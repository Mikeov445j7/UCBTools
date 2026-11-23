import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { formatoPorClave, FORMATOS_COLUMNAS } from './helpers/diccionario-columnas';
import { detectarDefinicionFiltro } from './helpers/filtro-columnas';
import { resolverEtiquetaColumna } from './helpers/humanizar';
import { ReporteConfig } from './helpers/reporte-config';
import {
  ConfigReporte,
  EstadoReporte,
  EventoCargado,
  EventoConfigCambiada,
  EventoErrorCarga,
  EventoFilaSeleccionada,
  FormatoColumna,
  RegistroReporte,
} from './models/reporte.model';

const MENSAJE_SIN_FUENTE = 'No se configuró el origen de los datos.';
const VALOR_VACIO = '-';

interface ColumnaEstado {
  clave: string;
  etiqueta: string;
  visible: boolean;
  filtro: boolean;
  formato: FormatoColumna | null;
}

interface OpcionVista {
  valor: string;
  etiqueta: string;
}

interface FiltroVista {
  clave: string;
  etiqueta: string;
  tipo: 'seleccion' | 'lista';
  opciones: OpcionVista[];
}

@Component({
  selector: 'ucb-reporte',
  standalone: false,
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteComponent implements OnChanges {
  private static contador = 0;

  readonly id = `ucb-reporte-${ReporteComponent.contador++}`;

  @Input() config: ConfigReporte = { id: '' };
  @Input() datos: RegistroReporte[] | null = null;
  @Input() cargando = false;
  @Input() error: string | null = null;

  @Output() cargado = new EventEmitter<EventoCargado>();
  @Output() errorCarga = new EventEmitter<EventoErrorCarga>();
  @Output() filaSeleccionada = new EventEmitter<EventoFilaSeleccionada>();
  @Output() configCambiada = new EventEmitter<EventoConfigCambiada>();
  @Output() reintentar = new EventEmitter<void>();

  estado: EstadoReporte = 'sin-fuente';
  mensajeError = MENSAJE_SIN_FUENTE;
  registros: RegistroReporte[] = [];
  filas: RegistroReporte[] = [];
  columnas: ColumnaEstado[] = [];
  columnasVisibles: ColumnaEstado[] = [];
  filtros: FiltroVista[] = [];
  buscador: string | null = null;
  termino = '';
  valores: Record<string, string> = {};
  panelAbierto = false;
  filaActiva: RegistroReporte | null = null;

  get reporteId(): string {
    return this.config?.id ?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambioDatos = !!changes['datos'];

    if (cambioDatos) {
      this.registros = Array.isArray(this.datos) ? this.datos : [];
      this.filaActiva = null;
    }

    this.estado = this.calcularEstado();
    this.mensajeError = this.calcularMensaje();

    if (cambioDatos || changes['config']) {
      this.construir();
    }

    if (cambioDatos && (this.estado === 'listo' || this.estado === 'sin-datos')) {
      const total = this.registros.length;
      this.diferir(() => this.cargado.emit({ reporteId: this.reporteId, total }));
    }

    if (changes['error'] && this.error) {
      const mensaje = this.error;
      this.diferir(() => this.errorCarga.emit({ reporteId: this.reporteId, mensaje }));
    }
  }

  private calcularEstado(): EstadoReporte {
    if (this.error) {
      return 'error';
    }
    if (this.cargando) {
      return 'cargando';
    }
    if (!Array.isArray(this.datos)) {
      return 'sin-fuente';
    }
    return this.registros.length > 0 ? 'listo' : 'sin-datos';
  }

  private calcularMensaje(): string {
    if (this.estado === 'error') {
      return this.error ?? '';
    }
    return this.estado === 'sin-fuente' ? MENSAJE_SIN_FUENTE : '';
  }

  private diferir(accion: () => void): void {
    Promise.resolve().then(accion);
  }

  private construir(): void {
    const primera: RegistroReporte = this.registros[0] ?? {};
    const claves = Object.keys(primera);
    const resuelto = ReporteConfig.resolver(this.config ?? { id: '' }, claves);

    this.columnas = resuelto.columnas.map((c) => ({
      clave: c.clave,
      etiqueta: c.etiqueta ?? resolverEtiquetaColumna(c.clave),
      visible: c.visible,
      filtro: c.filtro,
      formato: this.formatoDe(c.clave, c.formato, primera[c.clave]),
    }));
    this.buscador = resuelto.buscador;
    this.termino = '';
    this.valores = {};
    this.recalcular(true);
  }

  private formatoDe(clave: string, nombre: string | undefined, ejemplo: unknown): FormatoColumna | null {
    if (nombre) {
      const definido: FormatoColumna | undefined = FORMATOS_COLUMNAS[nombre.toLowerCase()];
      if (definido) {
        return definido;
      }
    }
    return formatoPorClave(clave, ejemplo);
  }

  private formatear(columna: ColumnaEstado | undefined, valor: unknown): string {
    if (valor === null || valor === undefined || valor === '') {
      return VALOR_VACIO;
    }
    return columna?.formato ? columna.formato(valor) : String(valor);
  }

  celda(columna: ColumnaEstado, fila: RegistroReporte): string {
    return this.formatear(columna, fila[columna.clave]);
  }

  private recalcular(reconstruirFiltros = false): void {
    this.columnasVisibles = this.columnas.filter((c) => c.visible);

    if (reconstruirFiltros) {
      this.filtros = this.columnas
        .filter((c) => c.filtro)
        .map((c) => {
          const definicion = detectarDefinicionFiltro(this.registros, c.clave);
          const opciones = definicion.opciones
            .map((v) => ({
              etiqueta: this.formatear(c, v),
              valor: definicion.tipo === 'seleccion' ? String(v) : this.formatear(c, v),
            }))
            .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es'));
          return { clave: c.clave, etiqueta: c.etiqueta, tipo: definicion.tipo, opciones };
        });

      const validas = new Set(this.filtros.map((f) => f.clave));
      Object.keys(this.valores).forEach((k) => {
        if (!validas.has(k)) {
          delete this.valores[k];
        }
      });
    }

    const porClave = new Map(this.columnas.map((c) => [c.clave, c]));
    const termino = this.termino.trim().toLowerCase();
    const claveBuscador = this.buscador;

    this.filas = this.registros.filter((fila) => {
      if (
        claveBuscador &&
        termino &&
        !this.formatear(porClave.get(claveBuscador), fila[claveBuscador]).toLowerCase().includes(termino)
      ) {
        return false;
      }
      for (const filtro of this.filtros) {
        const valor = this.valores[filtro.clave];
        if (!valor) {
          continue;
        }
        if (filtro.tipo === 'seleccion') {
          if (String(fila[filtro.clave]) !== valor) {
            return false;
          }
        } else if (
          !this.formatear(porClave.get(filtro.clave), fila[filtro.clave]).toLowerCase().includes(valor.toLowerCase())
        ) {
          return false;
        }
      }
      return true;
    });
  }

  private valorDe(evento: Event): string {
    return (evento.target as HTMLInputElement | HTMLSelectElement).value;
  }

  alBuscar(evento: Event): void {
    this.termino = this.valorDe(evento);
    this.recalcular();
  }

  alFiltrar(clave: string, evento: Event): void {
    const valor = this.valorDe(evento);
    if (valor) {
      this.valores[clave] = valor;
    } else {
      delete this.valores[clave];
    }
    this.recalcular();
  }

  limpiar(): void {
    this.termino = '';
    this.valores = {};
    this.recalcular();
  }

  alternarVisible(columna: ColumnaEstado): void {
    columna.visible = !columna.visible;
    this.recalcular();
    this.emitirConfig();
  }

  alternarFiltro(columna: ColumnaEstado): void {
    columna.filtro = !columna.filtro;
    this.recalcular(true);
    this.emitirConfig();
  }

  elegirBuscador(clave: string): void {
    this.buscador = clave;
    this.termino = '';
    this.recalcular();
    this.emitirConfig();
  }

  seleccionar(fila: RegistroReporte): void {
    this.filaActiva = fila;
    this.filaSeleccionada.emit({ reporteId: this.reporteId, fila });
  }

  private emitirConfig(): void {
    this.configCambiada.emit({
      reporteId: this.reporteId,
      config: {
        visibles: this.columnas.filter((c) => c.visible).map((c) => c.clave),
        filtros: this.columnas.filter((c) => c.filtro).map((c) => c.clave),
        buscador: this.buscador,
      },
    });
  }

  trackFila(indice: number): number {
    return indice;
  }

  trackClave(_: number, elemento: { clave: string }): string {
    return elemento.clave;
  }
}
