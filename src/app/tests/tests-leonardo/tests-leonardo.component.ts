import { Component } from '@angular/core';

import {
  EstudianteCarrera,
  PersonaBusqueda,
} from '../../../../libraries/buscador-personas';
import {
  PersonaPerfil,
  TarjetaDetalle,
  TarjetaSeccion,
} from '../../../../libraries/tarjeta-perfil';
import { TipoBadgeTarjeta } from '../../../../libraries/tarjeta-seleccion';
import { PersonaService } from '../../services/persona.service';

interface TarjetaDemoSeleccion {
  id: number;
  tagIzquierdo: string;
  tagDerecho: string;
  titulo: string;
  subtitulo: string;
  subtituloCursiva: boolean;
  metaPrincipalEtiqueta: string;
  metaPrincipalValor: string;
  metaSecundarioIzquierda: string;
  badgeDerecha: string;
  tipoBadge: TipoBadgeTarjeta;
}

@Component({
  selector: 'app-tests-leonardo',
  standalone: false,
  templateUrl: './tests-leonardo.component.html',
  styleUrls: ['./tests-leonardo.component.scss'],
})
export class TestsLeonardoComponent {
  tabActiva: 'buscadores' | 'tarjetas' = 'buscadores';

  // --- Estado: Buscador de Docentes / Usuarios (GetPersona) ---
  resultadosUsuarios: PersonaBusqueda[] = [];
  cargandoUsuarios = false;
  errorUsuarios: string | null = null;
  usuarioSeleccionado: PersonaBusqueda | null = null;
  detallesUsuario: TarjetaDetalle[] = [];

  // --- Estado: Buscador de Estudiantes por CI (GetEstudianteCarrera + DatosCompletos) ---
  resultadosEstudiantes: EstudianteCarrera[] = [];
  cargandoEstudiantes = false;
  errorEstudiantes: string | null = null;
  estudianteSeleccionado: EstudianteCarrera | null = null;
  detallesEstudianteSimple: TarjetaDetalle[] = [];
  estudianteCompleto: PersonaPerfil | null = null;
  seccionesEstudianteCompleto: TarjetaSeccion[] = [];
  cargandoCompleto = false;
  errorCompleto: string | null = null;

  // --- Estado: Demostración de Tarjeta Perfil (sin red) ---
  modoPerfilDemo: 'completo' | 'incompleto' = 'completo';
  readonly personaDemoCompleta: PersonaPerfil = {
    nombres: 'VALERIA',
    primerApellido: 'MENDOZA',
    segundoApellido: 'TORRES',
    nombreCarrera: 'Ingeniería de Sistemas',
  };
  readonly seccionesDemoCompleta: TarjetaSeccion[] = [
    {
      titulo: 'Identidad y Contacto',
      detalles: [
        { etiqueta: 'Documento', valor: '8392014 LP', tieneDato: true },
        { etiqueta: 'Correo', valor: 'valeria.mendoza@ucb.edu.bo', tieneDato: true },
        { etiqueta: 'Sede', valor: 'La Paz', tieneDato: true },
      ],
    },
    {
      titulo: 'Estado Académico',
      detalles: [
        { etiqueta: 'Carrera', valor: 'Ingeniería de Sistemas', tieneDato: true },
        { etiqueta: 'Modalidad', valor: 'Proyecto de Grado', tieneDato: true },
      ],
    },
  ];
  readonly personaDemoIncompleta: PersonaPerfil = {
    nombres: 'JUAN',
    primerApellido: 'MAMANI',
    segundoApellido: 'FALTA SEGUNDO_APELLIDO',
    nombreCarrera: null,
  };
  readonly detallesDemoIncompleto: TarjetaDetalle[] = [
    { etiqueta: 'Documento', valor: '7269100', tieneDato: true },
    { etiqueta: 'Departamento', valor: 'SIN DEPARTAMENTO', tieneDato: false },
    { etiqueta: 'Ciudad', valor: 'SIN CIUDAD', tieneDato: false },
    { etiqueta: 'Correo', valor: 'Dato faltante', tieneDato: false },
  ];

  // --- Estado: Demostración de Tarjeta Selección ---
  indiceTarjetaSeleccionada: number | null = null;
  readonly tarjetasDemo: TarjetaDemoSeleccion[] = [
    {
      id: 1,
      tagIzquierdo: 'SIS · N° 104',
      tagDerecho: 'SEDE LA PAZ',
      titulo: 'Ingeniería de Sistemas',
      subtitulo: 'Sistema de automatización documental para trámites académicos',
      subtituloCursiva: true,
      metaPrincipalEtiqueta: 'Defensa:',
      metaPrincipalValor: '18/10/2026 — 10:30 hrs',
      metaSecundarioIzquierda: '📍 Auditorio 2 - Bloque D',
      badgeDerecha: 'Nota: 94 pts.',
      tipoBadge: 'verde',
    },
    {
      id: 2,
      tagIzquierdo: 'DER',
      tagDerecho: 'SANTA CRUZ (SCZ)',
      titulo: 'Derecho',
      subtitulo: 'Facultad de Ciencias Jurídicas y Políticas',
      subtituloCursiva: false,
      metaPrincipalEtiqueta: 'Defensa:',
      metaPrincipalValor: '22/10/2026',
      metaSecundarioIzquierda: '',
      badgeDerecha: 'Estado 7',
      tipoBadge: 'amarillo',
    },
    {
      id: 3,
      tagIzquierdo: 'ICO',
      tagDerecho: 'COCHABAMBA (CBB)',
      titulo: 'Ingeniería Comercial',
      subtitulo: 'Evaluación de modelo de negocio institucional',
      subtituloCursiva: true,
      metaPrincipalEtiqueta: 'Registro:',
      metaPrincipalValor: '05/11/2026',
      metaSecundarioIzquierda: '📍 Modalidad Virtual',
      badgeDerecha: 'Verificado',
      tipoBadge: 'azul',
    },
  ];

  constructor(private readonly personaService: PersonaService) {}

  cambiarTab(tab: 'buscadores' | 'tarjetas'): void {
    this.tabActiva = tab;
  }

  buscarUsuarios(termino: string): void {
    this.errorUsuarios = null;
    if (!termino) {
      this.resultadosUsuarios = [];
      this.cargandoUsuarios = false;
      return;
    }

    this.cargandoUsuarios = true;
    this.personaService.buscarPersonas(termino).subscribe({
      next: (datos) => {
        this.resultadosUsuarios = Array.isArray(datos) ? datos : [];
        this.cargandoUsuarios = false;
      },
      error: () => {
        this.resultadosUsuarios = [];
        this.cargandoUsuarios = false;
        this.errorUsuarios = 'Error al consultar Autoridades/GetPersona.';
      },
    });
  }

  seleccionarUsuario(usuario: PersonaBusqueda): void {
    this.usuarioSeleccionado = usuario;
    this.resultadosUsuarios = [];
    this.detallesUsuario = [
      {
        etiqueta: 'Documento de Identidad',
        valor: usuario.documentoIdentidad ?? 'Sin documento',
        tieneDato: Boolean(usuario.documentoIdentidad),
      },
      {
        etiqueta: 'Rol / Cargo',
        valor: usuario.descripcion ?? 'Registrado',
        tieneDato: true,
      },
      {
        etiqueta: 'ID Persona',
        valor: usuario.idPersona ?? usuario.id ?? 'N/D',
        tieneDato: Boolean(usuario.idPersona ?? usuario.id),
      },
    ];
  }

  buscarEstudiantes(ci: string): void {
    this.errorEstudiantes = null;
    if (!ci) {
      this.resultadosEstudiantes = [];
      this.cargandoEstudiantes = false;
      return;
    }

    this.cargandoEstudiantes = true;
    this.personaService.buscarEstudiantesPorCI(ci).subscribe({
      next: (datos) => {
        this.resultadosEstudiantes = Array.isArray(datos) ? datos : [];
        this.cargandoEstudiantes = false;
      },
      error: () => {
        this.resultadosEstudiantes = [];
        this.cargandoEstudiantes = false;
        this.errorEstudiantes = 'Error al consultar Estudiante/GetEstudianteCarrera.';
      },
    });
  }

  seleccionarEstudiante(estudiante: EstudianteCarrera): void {
    this.estudianteSeleccionado = estudiante;
    this.resultadosEstudiantes = [];
    this.detallesEstudianteSimple = [
      {
        etiqueta: 'Documento de Identidad',
        valor: estudiante.documentoIdentidad ?? 'Sin documento',
        tieneDato: Boolean(estudiante.documentoIdentidad),
      },
      {
        etiqueta: 'Carrera',
        valor: estudiante.nombreCarrera ?? 'Sin carrera',
        tieneDato: Boolean(estudiante.nombreCarrera),
      },
      {
        etiqueta: 'ID Subdepartamento',
        valor: estudiante.idSubdepartamento ?? estudiante.idSubdepto ?? 'N/D',
        tieneDato: Boolean(estudiante.idSubdepartamento ?? estudiante.idSubdepto),
      },
    ];

    this.cargandoCompleto = true;
    this.errorCompleto = null;
    this.estudianteCompleto = null;
    this.seccionesEstudianteCompleto = [];

    this.personaService.obtenerPerfilCompletoEstudiante(estudiante).subscribe({
      next: (perfil) => {
        this.cargandoCompleto = false;
        this.estudianteCompleto = perfil.estudiante;
        this.seccionesEstudianteCompleto = perfil.secciones;
      },
      error: () => {
        this.cargandoCompleto = false;
        this.errorCompleto = 'No se pudo obtener el detalle completo del estudiante.';
      },
    });
  }

  alternarTarjetaDemo(index: number): void {
    this.indiceTarjetaSeleccionada = this.indiceTarjetaSeleccionada === index ? null : index;
  }
}
