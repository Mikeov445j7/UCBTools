const SELECTOR_ENFOCABLES = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export class FocoModal {
  private previo: HTMLElement | null = null;
  private activo = false;

  activar(contenedor: HTMLElement): void {
    if (this.activo) {
      return;
    }
    this.activo = true;
    const actual = document.activeElement;
    this.previo = actual instanceof HTMLElement ? actual : null;
    setTimeout(() => contenedor.focus());
  }

  desactivar(): void {
    if (!this.activo) {
      return;
    }
    this.activo = false;
    const previo = this.previo;
    this.previo = null;
    if (previo && document.contains(previo)) {
      previo.focus();
    }
  }

  atrapar(event: KeyboardEvent, contenedor: HTMLElement): void {
    if (event.key !== 'Tab') {
      return;
    }
    const enfocables = Array.from(contenedor.querySelectorAll<HTMLElement>(SELECTOR_ENFOCABLES)).filter(
      (elemento) => elemento.offsetParent !== null,
    );
    if (enfocables.length === 0) {
      event.preventDefault();
      contenedor.focus();
      return;
    }
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    const actual = document.activeElement;
    if (event.shiftKey && (actual === primero || actual === contenedor)) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && actual === ultimo) {
      event.preventDefault();
      primero.focus();
    }
  }
}
