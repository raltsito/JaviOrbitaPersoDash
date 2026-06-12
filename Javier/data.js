/* ====================================================================
   Órbita — Dashboard personal de Javier
   data.js — datos de ejemplo, constantes y helpers de persistencia
   (script plano, expone todo en window.ORB)
   ==================================================================== */
(function () {
  "use strict";

  // ---- Helpers de fecha ------------------------------------------------
  const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const DIAS_LARGO = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  function hoy() { return new Date(); }
  function fechaLarga(d) {
    return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
  }

  // ---- Persistencia ----------------------------------------------------
  const KEY = "orbita_state_v1";
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---- Datos de ejemplo ------------------------------------------------
  const SEED = {
    usuario: { nombre: "Javier", racha: 14 },

    // Agenda del día (objetivo diario)
    agenda: [
      { id: "a1", hora: "07:00", actividad: "Meditación + respiración", done: true, notas: "10 min, antes del café" },
      { id: "a2", hora: "08:00", actividad: "Desayuno y lectura", done: true, notas: "20 páginas — ensayo" },
      { id: "a3", hora: "09:30", actividad: "Bloque de trabajo profundo", done: true, notas: "Proyecto Órbita · sin notificaciones" },
      { id: "a4", hora: "13:00", actividad: "Almuerzo consciente", done: false, notas: "" },
      { id: "a5", hora: "15:00", actividad: "Sprint review con el equipo", done: false, notas: "Preparar 3 puntos" },
      { id: "a6", hora: "18:30", actividad: "Entrenamiento — pierna", done: false, notas: "Gimnasio, 45 min" },
      { id: "a7", hora: "21:00", actividad: "Lectura y desconexión", done: false, notas: "Sin pantallas" },
    ],

    // Agenda semanal (objetivo semanal) — bloques por día
    semana: [
      { dia: "Lun", bloques: ["Trabajo profundo", "Gym — pierna", "Cena con Ana"] },
      { dia: "Mar", bloques: ["Curso de diseño", "Mindfulness", "Lectura"] },
      { dia: "Mié", bloques: ["Trabajo profundo", "Gym — empuje", "Llamar a Carlos"] },
      { dia: "Jue", bloques: ["Reunión cliente", "Caminata", "Planificación"] },
      { dia: "Vie", bloques: ["Trabajo profundo", "Gym — tirón", "Ocio"] },
      { dia: "Sáb", bloques: ["Carrera larga", "Familia", "Proyecto personal"] },
      { dia: "Dom", bloques: ["Descanso", "Repaso semanal", "Preparar semana"] },
    ],

    // Objetivos por periodo
    objetivos: [
      { id: "o1", periodo: "diario", titulo: "Leer 20 páginas", cat: "mente", progreso: 100, vinc: ["mente"] },
      { id: "o2", periodo: "diario", titulo: "Cerrar 3 tareas clave", cat: "trabajo", progreso: 66, vinc: ["trabajo"] },
      { id: "o3", periodo: "diario", titulo: "Beber 2L de agua", cat: "cuerpo", progreso: 70, vinc: ["cuerpo"] },
      { id: "o4", periodo: "semanal", titulo: "3 sesiones de gimnasio", cat: "cuerpo", progreso: 66, vinc: ["cuerpo"] },
      { id: "o5", periodo: "semanal", titulo: "Llamar a 2 personas cercanas", cat: "social", progreso: 50, vinc: ["social"] },
      { id: "o6", periodo: "semanal", titulo: "Avanzar curso de diseño", cat: "mente", progreso: 80, vinc: ["mente", "trabajo"] },
      { id: "o7", periodo: "mes", titulo: "Terminar curso de diseño", cat: "mente", progreso: 64, vinc: ["mente"] },
      { id: "o8", periodo: "mes", titulo: "Ahorrar 400€", cat: "trabajo", progreso: 45, vinc: ["trabajo"] },
      { id: "o9", periodo: "mes", titulo: "Reducir tabaco a la mitad", cat: "cuerpo", progreso: 55, vinc: ["cuerpo"] },
      { id: "o10", periodo: "año", titulo: "Correr una media maratón", cat: "cuerpo", progreso: 38, vinc: ["cuerpo"] },
      { id: "o11", periodo: "año", titulo: "Aprender alemán (A2)", cat: "mente", progreso: 22, vinc: ["mente"] },
      { id: "o12", periodo: "año", titulo: "Construir hábito de escritura", cat: "mente", progreso: 30, vinc: ["mente", "social"] },
    ],

    // Hábitos — configuración + valor de hoy
    habitos: [
      { id: "h_agua", nombre: "Hidratación", tipo: "cantidad", unidad: "L", objetivo: 2, paso: 0.25, hoy: 1.25, color: "blue", icono: "drop", mejorMas: true },
      { id: "h_estira", nombre: "Estiramiento", tipo: "sino", objetivo: 1, hoy: 1, color: "mint", icono: "stretch", mejorMas: true },
      { id: "h_tabaco", nombre: "Tabaco", tipo: "cantidad", unidad: "cig", objetivo: 20, paso: 1, hoy: 6, color: "red", icono: "smoke", mejorMas: false },
      { id: "h_fisica", nombre: "Actividad física", tipo: "cantidad", unidad: "min", objetivo: 20, paso: 5, hoy: 0, color: "green", icono: "run", mejorMas: true },
      { id: "h_mind", nombre: "Mindfulness", tipo: "cantidad", unidad: "min", objetivo: 20, paso: 5, hoy: 10, color: "violet", icono: "lotus", mejorMas: true },
      { id: "h_alim", nombre: "Alimentación", tipo: "sino", objetivo: 1, hoy: 0, color: "amber", icono: "apple", mejorMas: true },
    ],

    // Actividades de autocuidado libres (se registran en dashboard hábitos)
    autocuidado: [
      { id: "ac1", texto: "Baño largo y sin prisa", done: true },
      { id: "ac2", texto: "Ordenar el escritorio", done: false },
    ],

    // Conexiones personales
    conexiones: [
      { id: "c1", nombre: "Ana", relacion: "Hermana", check: true, ultimo: "Ayer", notas: "Cumple el 24 — reservar mesa" },
      { id: "c2", nombre: "Carlos", relacion: "Mentor", check: false, ultimo: "Hace 6 días", notas: "Pedir feedback del proyecto" },
      { id: "c3", nombre: "Lucía", relacion: "Mejor amiga", check: true, ultimo: "Hoy", notas: "" },
      { id: "c4", nombre: "Mamá", relacion: "Familia", check: false, ultimo: "Hace 3 días", notas: "Llamar el domingo" },
      { id: "c5", nombre: "Diego", relacion: "Socio", check: true, ultimo: "Hace 2 días", notas: "Cerrar propuesta Órbita" },
      { id: "c6", nombre: "Sara", relacion: "Amiga gym", check: false, ultimo: "Hace 9 días", notas: "Proponer carrera del sábado" },
    ],

    // Frase del mes (precargada)
    frase: {
      texto: "La disciplina es elegir entre lo que quieres ahora y lo que quieres más.",
      autor: "Augusta F. Kantra",
    },

    ajustes: {
      tema: "claro",      // claro | oscuro
      vistaAgenda: "dia", // dia | semana | mes | año
    },
  };

  // ---- Series históricas para gráficas (deterministas) -----------------
  // Actividades completadas por día (últimos 7 días, % 0-100)
  const actividadesSemana = [82, 90, 71, 100, 88, 64, 76];
  // Por mes (12 meses, % objetivos alcanzados)
  const objetivosMes = [58, 63, 70, 66, 74, 81, 77, 85, 79, 88, 84, 0]
    .map((v, i) => (i === 11 ? 62 : v)); // mes actual en curso
  // Actividades por mes (conteo)
  const actividadesPorMes = [120, 134, 128, 142, 150, 161, 158, 170, 165, 178, 172, 96];

  // Historial semanal por hábito (7 días) — para gráficas y semáforo
  const histHabitos = {
    h_agua:   [1.75, 2.0, 1.5, 2.25, 2.0, 1.0, 1.25],   // L, obj 2
    h_estira: [1, 1, 0, 1, 1, 1, 1],                     // sino
    h_tabaco: [9, 7, 12, 5, 8, 14, 6],                   // cig, obj max 20 (menos mejor)
    h_fisica: [25, 0, 30, 20, 0, 45, 0],                 // min, obj 20
    h_mind:   [15, 20, 0, 25, 10, 0, 10],                // min, obj 20
    h_alim:   [1, 1, 1, 0, 1, 0, 0],                     // sino
  };

  // ---- API -------------------------------------------------------------
  function freshState() { return JSON.parse(JSON.stringify(SEED)); }

  window.ORB = {
    DIAS, DIAS_LARGO, MESES,
    hoy, fechaLarga,
    load, save, freshState,
    SEED,
    series: { actividadesSemana, objetivosMes, actividadesPorMes, histHabitos },
    // categorías de objetivos -> color token + etiqueta
    categorias: {
      cuerpo:  { label: "Cuerpo",  color: "green" },
      mente:   { label: "Mente",   color: "violet" },
      trabajo: { label: "Trabajo", color: "blue" },
      social:  { label: "Social",  color: "amber" },
    },
  };
})();
