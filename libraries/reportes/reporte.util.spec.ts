import { detectarColumnas, presentarValor, resolverEtiquetaColumna } from './reporte.util';

describe('Utilidades de reporte', () => {
  it('detecta la unión de claves sin modificar el orden original', () => {
    expect(detectarColumnas([{ nombres: 'Ana' }, { nombres: 'Luis', carrera: 'Derecho' }])).toEqual(['nombres', 'carrera']);
  });

  it('prioriza etiquetas manuales, diccionario, corrección inequívoca y humanización', () => {
    expect(resolverEtiquetaColumna('idSede', { idSede: 'Campus' })).toBe('Campus');
    expect(resolverEtiquetaColumna('fecha_registro')).toBe('Fecha de Registro');
    expect(resolverEtiquetaColumna('primerApelido')).toBe('Primer Apellido');
    expect(resolverEtiquetaColumna('codigoAPI2')).toBe('Codigo API 2');
  });

  it('presenta vacíos sin perder cero ni falso y conserva fechas sin hora', () => {
    expect(presentarValor(null)).toBe('—');
    expect(presentarValor('')).toBe('—');
    expect(presentarValor(0)).toBe('0');
    expect(presentarValor(false)).toBe('false');
    expect(presentarValor('2024-02-12')).toContain('12');
    expect(presentarValor('2024-02-30')).toBe('2024-02-30');
  });
});
