export interface OpcionCombo {
  valor: string | number;
  etiqueta: string;
  titulo?: string | null;
  subtitulo?: string;
  textoBusqueda?: string;
}

export class ComboLocal {
  opciones: OpcionCombo[] = [];
  filtradas: OpcionCombo[] = [];
  abierto = false;
  texto = '';
  indice = -1;

  cargando = false;
  error = false;

  textoRespaldo = '';

  alReintentar: (() => void) | null = null;
  alSeleccionar: ((opcion: OpcionCombo | null) => void) | null = null;

  constructor(
    readonly id: string,
    private readonly obtener: () => string | number | null,
    private readonly asignar: (valor: string | number | null) => void,
  ) {}

  establecerOpciones(opciones: OpcionCombo[]): void {
    this.opciones = opciones;
    this.filtradas = opciones;
    if (!this.abierto) {
      this.sincronizarTexto();
    }
  }

  sincronizarTexto(): void {
    const valor = this.obtener();
    if (valor === null) {
      this.texto = '';
      return;
    }
    const seleccionada = this.opciones.find((o) => o.valor === valor);
    this.texto = seleccionada ? seleccionada.etiqueta : this.textoRespaldo;
  }

  esSeleccionada(opcion: OpcionCombo): boolean {
    return this.obtener() === opcion.valor;
  }

  abrir(): void {
    if (this.abierto) {
      return;
    }
    this.filtradas = this.opciones;
    const seleccionado = this.obtener();
    this.indice = seleccionado === null ? -1 : this.opciones.findIndex((o) => o.valor === seleccionado);
    this.abierto = true;
    this.desplazarAlActivo();
  }

  cerrar(): void {
    this.abierto = false;
    this.indice = -1;
    this.sincronizarTexto();
  }

  alEscribir(event: Event): void {
    const texto = (event.target as HTMLInputElement).value;
    this.texto = texto;

    const consulta = texto.trim().toLowerCase();
    this.filtradas = consulta
      ? this.opciones.filter((o) => (o.textoBusqueda ?? o.etiqueta).toLowerCase().includes(consulta))
      : this.opciones;

    this.indice = this.filtradas.length ? 0 : -1;
    this.abierto = true;

    if (!consulta) {
      this.asignar(null);
      this.alSeleccionar?.(null);
    }
  }

  seleccionar(opcion: OpcionCombo): void {
    this.asignar(opcion.valor);
    this.alSeleccionar?.(opcion);
    this.cerrar();
  }

  alTeclear(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.abierto) {
          this.mover(1);
        } else {
          this.abrir();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.abierto) {
          this.mover(-1);
        } else {
          this.abrir();
        }
        break;
      case 'Enter':
        if (this.abierto) {
          event.preventDefault();
          const opcion = this.filtradas[this.indice];
          if (opcion) {
            this.seleccionar(opcion);
          }
        }
        break;
      case 'Escape':
        if (this.abierto) {
          event.stopPropagation();
          this.cerrar();
        }
        break;
      case 'Tab':
        this.cerrar();
        break;
    }
  }

  reintentar(): void {
    this.alReintentar?.();
  }

  trackByValor(_: number, opcion: OpcionCombo): string | number {
    return opcion.valor;
  }

  private mover(delta: number): void {
    const total = this.filtradas.length;
    if (!total) {
      return;
    }
    this.indice = Math.min(total - 1, Math.max(0, this.indice + delta));
    this.desplazarAlActivo();
  }

  private desplazarAlActivo(): void {
    setTimeout(() => {
      document
        .getElementById(`${this.id}-lista`)
        ?.querySelector('.combo-opcion.activa')
        ?.scrollIntoView({ block: 'nearest' });
    });
  }
}
