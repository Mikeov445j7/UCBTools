let contador = 0;

export function crearIdUnico(prefijo: string): string {
  contador += 1;
  return `${prefijo}-${contador}`;
}
