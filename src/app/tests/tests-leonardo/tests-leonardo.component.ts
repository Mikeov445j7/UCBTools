import { Component } from '@angular/core';
import {
  EstudianteCarrera,
  EstudianteCompleto,
  PersonaBusqueda,
} from '../../../../libraries/buscador-personas';
import {
  PersonaPerfil,
  TarjetaDetalle,
  TarjetaSeccion,
} from '../../../../libraries/tarjeta-perfil';
import { TipoBadgeTarjeta } from '../../../../libraries/tarjeta-seleccion';
import { PersonaService } from '../../services/persona.service';

export interface EventoConsola {
  id: number;
  hora: string;
  componente: string;
  evento: string;
  datos: string;
}

export interface TarjetaDemoSeleccion {
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
  // Consola de eventos en vivo
  registroEventos: EventoConsola[] = [];
  private contadorEvento = 1;

  // Estado: Buscador de Docentes / Usuarios
  resultadosUsuarios: PersonaBusqueda[] = [];
  cargandoUsuarios = false;
  errorUsuarios: string | null = null;
  usuarioSeleccionado: PersonaBusqueda | null = null;
  detallesUsuario: TarjetaDetalle[] = [];

  // Estado: Buscador de Estudiantes por CI
  resultadosEstudiantes: EstudianteCarrera[] = [];
  cargandoEstudiantes = false;
  errorEstudiantes: string | null = null;
  estudianteSeleccionado: EstudianteCarrera | null = null;
  detallesEstudianteSimple: TarjetaDetalle[] = [];
  estudianteCompleto: PersonaPerfil | null = null;
  seccionesEstudianteCompleto: TarjetaSeccion[] = [];
  cargandoCompleto = false;
  errorCompleto: string | null = null;

  // Estado: Demostración de Tarjeta Perfil
  modoPerfilDemo: 'completo' | 'incompleto' = 'completo';
  readonly personaDemoCompleta: PersonaPerfil = {
    nombres: 'VALERIA ANDREA',
    primerApellido: 'MENDOZA',
    segundoApellido: 'TORRES',
    nombreCarrera: 'Ingeniería de Sistemas',
  };
  readonly seccionesDemoCompleta: TarjetaSeccion[] = [
    {
      titulo: 'Identidad y Contacto Institucional',
      icono: 'badge',
      detalles: [
        { etiqueta: 'Documento C.I.', valor: '8392014 LP', tieneDato: true },
        { etiqueta: 'Correo Institucional', valor: 'valeria.mendoza@ucb.edu.bo', tieneDato: true },
        { etiqueta: 'Sede Regional', valor: 'Regional La Paz', tieneDato: true },
      ],
    },
    {
      titulo: 'Estado Académico y Titulación',
      icono: 'school',
      detalles: [
        { etiqueta: 'Carrera', valor: 'Ingeniería de Sistemas', tieneDato: true },
        { etiqueta: 'Modalidad de Grado', valor: 'Proyecto de Grado', tieneDato: true },
        { etiqueta: 'Estado del Trámite', valor: 'Habilitado para Defensa', tieneDato: true },
      ],
    },
  ];

  readonly personaDemoIncompleta: PersonaPerfil = {
    nombres: 'JUAN CARLOS',
    primerApellido: 'MAMANI',
    segundoApellido: 'FALTA SEGUNDO_APELLIDO',
    nombreCarrera: null,
  };
  readonly detallesDemoIncompleto: TarjetaDetalle[] = [
    { etiqueta: 'Documento C.I.', valor: '7269100', tieneDato: true },
    { etiqueta: 'Departamento', valor: 'SIN DEPARTAMENTO', tieneDato: false },
    { etiqueta: 'Ciudad / Regional', valor: 'SIN CIUDAD', tieneDato: false },
    { etiqueta: 'Correo Institucional', valor: 'Dato faltante', tieneDato: false },
  ];

  // Estado: Demostración de Tarjeta Selección
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

  // Manejador central de registro de eventos
  registrarEvento(componente: string, evento: string, datos: unknown): void {
    const ahora = new Date();
    const hora = ahora.toTimeString().split(' ')[0] + '.' + ahora.getMilliseconds().toString().padStart(3, '0');
    const datosStr = typeof datos === 'object' ? JSON.stringify(datos, null, 2) : String(datos);

    this.registroEventos.unshift({
      id: this.contadorEvento++,
      hora,
      componente,
      evento,
      datos: datosStr,
    });

    if (this.registroEventos.length > 50) {
      this.registroEventos.pop();
    }
  }

  limpiarConsola(): void {
    this.registroEventos = [];
  }

  // --- Handlers: Buscador de Docentes / Usuarios ---
  buscarUsuarios(termino: string): void {
    this.errorUsuarios = null;
    this.registrarEvento('ucb-combobox-usuarios', '@Output() terminoBuscado', termino);

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
        this.registrarEvento('PersonaService', 'Autoridades/GetPersona SUCCESS', `Recibidos ${this.resultadosUsuarios.length} registros`);
      },
      error: (err: unknown) => {
        this.resultadosUsuarios = [];
        this.cargandoUsuarios = false;
        this.errorUsuarios = 'Error al consultar Autoridades/GetPersona.';
        console.error(err);
      },
    });
  }

  seleccionarUsuario(usuario: PersonaBusqueda): void {
    this.usuarioSeleccionado = usuario;
    this.resultadosUsuarios = [];
    this.detallesUsuario = this.personaService.armarDetallesUsuario(usuario);
    this.registrarEvento('ucb-combobox-usuarios', '@Output() usuarioSeleccionado', usuario);
  }

  // --- Handlers: Buscador de Estudiantes ---
  buscarEstudiantes(ci: string): void {
    this.errorEstudiantes = null;
    this.registrarEvento('ucb-combobox-estudiantes', '@Output() terminoBuscado', ci);

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
        this.registrarEvento('PersonaService', 'Estudiante/GetEstudianteCarrera SUCCESS', `Recibidos ${this.resultadosEstudiantes.length} registros`);
      },
      error: (err: unknown) => {
        this.resultadosEstudiantes = [];
        this.cargandoEstudiantes = false;
        this.errorEstudiantes = 'Error al consultar Estudiante/GetEstudianteCarrera.';
        console.error(err);
      },
    });
  }

  seleccionarEstudiante(estudiante: EstudianteCarrera): void {
    this.estudianteSeleccionado = estudiante;
    this.resultadosEstudiantes = [];
    this.detallesEstudianteSimple = this.personaService.armarDetallesEstudianteSimple(estudiante);

    this.cargandoCompleto = true;
    this.errorCompleto = null;
    this.estudianteCompleto = null;
    this.seccionesEstudianteCompleto = [];

    this.registrarEvento('ucb-combobox-estudiantes', '@Output() estudianteSeleccionado', estudiante);

    this.personaService.obtenerPerfilCompletoEstudiante(estudiante).subscribe({
      next: (perfil) => {
        this.cargandoCompleto = false;
        this.estudianteCompleto = perfil.estudiante;
        this.seccionesEstudianteCompleto = perfil.secciones;
        this.registrarEvento('PersonaService', 'GetEstudianteDatosCompletosConTodo SUCCESS', `Expediente completo obtenido`);
      },
      error: (err: unknown) => {
        this.cargandoCompleto = false;
        this.errorCompleto = 'No se pudo obtener el detalle completo del estudiante.';
        console.error(err);
      },
    });
  }

  // --- Handlers: Tarjeta Selección ---
  seleccionarTarjetaDemo(tarjeta: TarjetaDemoSeleccion, indice: number): void {
    if (this.indiceTarjetaSeleccionada === indice) {
      this.indiceTarjetaSeleccionada = null;
      this.registrarEvento('ucb-tarjeta-seleccion', '@Output() seleccionar (deselección)', `Tarjeta deseleccionada ID: ${tarjeta.id}`);
    } else {
      this.indiceTarjetaSeleccionada = indice;
      this.registrarEvento('ucb-tarjeta-seleccion', '@Output() seleccionar', { id: tarjeta.id, titulo: tarjeta.titulo });
    }
  }

  setModoPerfilDemo(modo: 'completo' | 'incompleto'): void {
    this.modoPerfilDemo = modo;
    this.registrarEvento('ucb-tarjeta-perfil', 'Cambio de Modo Demo', modo);
  }
}
