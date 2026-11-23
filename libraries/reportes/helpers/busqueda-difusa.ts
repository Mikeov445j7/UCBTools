const DISTANCIA_UBICACION = 100;

interface Coincidencia {
  errores: number;
  posicion: number;
}

function mejorCoincidencia(patron: string, texto: string): Coincidencia {
  const largoPatron = patron.length;
  const largoTexto = texto.length;
  let anterior: number[] = new Array<number>(largoTexto + 1).fill(0);

  for (let i = 1; i <= largoPatron; i++) {
    const actual: number[] = new Array<number>(largoTexto + 1).fill(0);
    actual[0] = i;
    for (let j = 1; j <= largoTexto; j++) {
      const costo = patron.charAt(i - 1) === texto.charAt(j - 1) ? 0 : 1;
      actual[j] = Math.min(anterior[j - 1] + costo, anterior[j] + 1, actual[j - 1] + 1);
    }
    anterior = actual;
  }

  let errores = anterior[0];
  let fin = 0;
  for (let j = 1; j <= largoTexto; j++) {
    if (anterior[j] < errores) {
      errores = anterior[j];
      fin = j;
    }
  }

  return { errores, posicion: Math.max(0, fin - largoPatron) };
}

export function buscarMejorCoincidencia(
  patron: string,
  candidatos: readonly string[],
  umbral = 0.35,
): string | null {
  if (!patron) {
    return null;
  }

  let mejor: string | null = null;
  let mejorPuntaje = Number.POSITIVE_INFINITY;

  for (const candidato of candidatos) {
    const { errores, posicion } = mejorCoincidencia(patron, candidato);
    const puntaje = errores / patron.length + posicion / DISTANCIA_UBICACION;
    if (puntaje <= umbral && puntaje < mejorPuntaje) {
      mejor = candidato;
      mejorPuntaje = puntaje;
    }
  }

  return mejor;
}
