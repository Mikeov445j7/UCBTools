import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfigReporte, ConfigReporteActual, RegistroReporte } from './reporte.model';
import { claveValor, detectarColumnas, normalizarTexto, presentarValor, resolverEtiquetaColumna } from './reporte.util';

interface OpcionFiltro { clave: string; texto: string; }
interface ColumnaReporte { clave: string; etiqueta: string; opciones: OpcionFiltro[]; }

@Component({
  selector: 'ucb-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteComponent implements OnChanges {
  @Input() datos: RegistroReporte[] = [];
  @Input() config: Partial<ConfigReporte> = {};
  private static siguienteId = 0;
  readonly instancia = `ucb-reporte-${++ReporteComponent.siguienteId}`;
  columnas: ColumnaReporte[] = [];
  columnasVisibles: ColumnaReporte[] = [];
  columnasFiltro: ColumnaReporte[] = [];
  filasVisibles: RegistroReporte[] = [];
  filasMostradas: string[][] = [];
  actual: ConfigReporteActual = { visibles: [], filtros: [], buscador: null };
  seleccion: Record<string, string> = Object.create(null) as Record<string, string>;
  textosFiltro: Record<string, string> = Object.create(null) as Record<string, string>;
  busqueda = '';

  get umbral(): number { return Math.max(1, Math.floor(this.config.umbralSeleccion ?? 8)); }

  ngOnChanges(cambios: SimpleChanges): void {
    const claves = detectarColumnas(this.datos);
    const filtrosConfigurados = new Set(this.config.filtros ?? []);
    this.columnas = claves.map(clave => ({ clave, etiqueta: resolverEtiquetaColumna(clave, this.config.etiquetas), opciones: filtrosConfigurados.has(clave) ? this.opciones(clave) : [] }));
    const visibles = [...new Set(this.config.visibles?.filter(clave => claves.includes(clave)) ?? [])];
    this.actual = {
      visibles: visibles.length ? visibles : [...claves],
      filtros: [...new Set((this.config.filtros ?? []).filter(clave => claves.includes(clave)))],
      buscador: this.config.buscador && claves.includes(this.config.buscador) ? this.config.buscador : null,
    };
    if (cambios['config']) {
      this.reiniciarFiltros();
    } else {
      for (const clave of Object.keys(this.seleccion)) {
        if (!this.actual.filtros.includes(clave)) { delete this.seleccion[clave]; delete this.textosFiltro[clave]; }
      }
    }
    this.recalcular();
  }

  etiqueta(clave: string): string { return this.columnas.find(columna => columna.clave === clave)?.etiqueta ?? clave; }
  valor(registro: RegistroReporte, clave: string): string {
    const valor = registro[clave];
    if (valor === null || valor === undefined || valor === '') return '—';
    return this.config.formateadores?.[clave]?.(valor, registro) ?? presentarValor(valor);
  }

  cambiarFiltro(clave: string, valor: string): void { this.seleccion[clave] = valor; this.recalcular(); }
  cambiarFiltroTexto(columna: ColumnaReporte, texto: string): void {
    this.textosFiltro[columna.clave] = texto;
    const opcion = columna.opciones.find(item => item.texto === texto);
    // Una entrada aún no elegida no debe mostrar resultados ajenos a lo escrito.
    this.seleccion[columna.clave] = texto ? opcion?.clave ?? '__sin_coincidencia__' : '';
    this.recalcular();
  }
  cambiarBusqueda(valor: string): void { this.busqueda = valor; this.recalcular(); }
  limpiarFiltros(): void { this.reiniciarFiltros(); this.recalcular(); }
  trackColumna(_: number, columna: ColumnaReporte): string { return columna.clave; }
  trackFila(indice: number): number { return indice; }

  private reiniciarFiltros(): void {
    this.seleccion = Object.create(null) as Record<string, string>;
    this.textosFiltro = Object.create(null) as Record<string, string>;
    this.busqueda = '';
  }

  private opciones(clave: string): OpcionFiltro[] {
    const valores = new Map<string, OpcionFiltro>();
    for (const registro of this.datos) {
      const valor = registro[clave];
      if (valor === null || valor === undefined || valor === '') continue;
      const identificador = claveValor(valor);
      if (!valores.has(identificador)) valores.set(identificador, { clave: identificador, texto: this.valor(registro, clave) });
    }
    const opciones = [...valores.values()];
    const cantidades = new Map<string, number>();
    for (const opcion of opciones) cantidades.set(opcion.texto, (cantidades.get(opcion.texto) ?? 0) + 1);
    for (const opcion of opciones) {
      if ((cantidades.get(opcion.texto) ?? 0) > 1) opcion.texto = `${opcion.texto} (${opcion.clave.split(':', 1)[0]})`;
    }
    return opciones.sort((a, b) => a.texto.localeCompare(b.texto, 'es', { numeric: true, sensitivity: 'base' }));
  }

  private recalcular(): void {
    const columnasPorClave = new Map(this.columnas.map(columna => [columna.clave, columna]));
    this.columnasVisibles = this.actual.visibles.map(clave => columnasPorClave.get(clave)).filter((columna): columna is ColumnaReporte => !!columna);
    this.columnasFiltro = this.actual.filtros.map(clave => columnasPorClave.get(clave)).filter((columna): columna is ColumnaReporte => !!columna);
    const busqueda = normalizarTexto(this.busqueda.trim());
    this.filasVisibles = this.datos.filter(registro => {
      if (busqueda && this.actual.buscador) {
        const valor = registro[this.actual.buscador];
        if (valor === null || valor === undefined || valor === '' || !normalizarTexto(presentarValor(valor)).includes(busqueda)) return false;
      }
      return this.actual.filtros.every(clave => !this.seleccion[clave] || claveValor(registro[clave]) === this.seleccion[clave]);
    });
    this.filasMostradas = this.filasVisibles.map(registro => this.columnasVisibles.map(columna => this.valor(registro, columna.clave)));
  }
}
