import { ColumnaConfig, ConfigReporte } from '../models/reporte.model';

export interface ColumnaResuelta {
  clave: string;
  etiqueta?: string;
  formato?: string;
  visible: boolean;
  filtro: boolean;
}

export class ReporteConfig {
  static resolver(
    config: ConfigReporte,
    claves: string[],
  ): { columnas: ColumnaResuelta[]; buscador: string | null } {
    const existe = new Set(claves);
    const defs = (config.columnas ?? []).filter((d) => existe.has(d.clave));
    const defPorClave = new Map<string, ColumnaConfig>(defs.map((d) => [d.clave, d]));
    const usaColumnas = defs.length > 0;
    const visiblesCfg = new Set((config.visibles ?? []).filter((k) => existe.has(k)));
    const filtrosCfg = new Set(config.filtros ?? []);
    const orden = Array.from(new Set([...defs.map((d) => d.clave), ...claves]));

    let columnas: ColumnaResuelta[] = orden.map((clave) => {
      const def = defPorClave.get(clave);
      const visible = usaColumnas
        ? def !== undefined && def.visible !== false
        : visiblesCfg.size === 0 || visiblesCfg.has(clave);
      return {
        clave,
        etiqueta: def?.etiqueta,
        formato: def?.formato,
        visible,
        filtro: def?.filtro ?? filtrosCfg.has(clave),
      };
    });

    if (!columnas.some((c) => c.visible)) {
      columnas = columnas.map((c) => ({ ...c, visible: true }));
    }

    const buscador = config.buscador && existe.has(config.buscador) ? config.buscador : null;
    return { columnas, buscador };
  }
}
