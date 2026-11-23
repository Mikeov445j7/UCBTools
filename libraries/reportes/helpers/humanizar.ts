import { buscarEnDiccionario } from './diccionario-columnas';

function separarCamelCase(texto: string): string {
  return texto
    .replace(/([\p{Ll}\d])(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll}+)/gu, '$1 $2')
    .toLowerCase();
}

export function humanizarClave(clave: string): string {
  if (!clave) {
    return '';
  }

  const base = separarCamelCase(clave).replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  return base
    .split(' ')
    .filter((palabra) => palabra.length > 0)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

export function resolverEtiquetaColumna(
  clave: string,
  etiquetasManuales: Record<string, string> = {},
): string {
  const manual: string | undefined = etiquetasManuales[clave];
  if (manual) {
    return manual;
  }

  const delDiccionario = buscarEnDiccionario(clave);
  if (delDiccionario) {
    return delDiccionario;
  }

  return humanizarClave(clave);
}
