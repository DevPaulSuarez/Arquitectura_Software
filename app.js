/* VetCare · ruta de estudio
   Un día a la vez. Una etapa a la vez. Sin atajos. */

(function () {
  'use strict';

  /* ---------- idioma ---------- */

  /* El contenido en español vive en window.WEEKS, window.USO…; el inglés, en window.EN.
     Los identificadores de día (w1d1…) son los mismos en los dos idiomas, así que
     el progreso, las notas y el repaso se comparten al cambiar de idioma. */
  var CONTENIDO = {
    es: { WEEKS: window.WEEKS, USO: window.USO, PISTAS: window.PISTAS, GLOSARIO: window.GLOSARIO,
          REFUERZOS: window.REFUERZOS, SOLUCIONES: window.SOLUCIONES },
    en: window.EN || {}
  };

  var I18N = {
    es: {
      lang: 'es', locale: 'es', otro: 'EN', cambiar: 'Switch to English',
      nav: { hoy: 'Hoy', mapa: 'Mapa', repaso: 'Repaso', notas: 'Notas', glosario: 'Glosario' },
      tema: 'Cambiar tema', mas: 'Más opciones',
      exportar: 'Guardar copia', importar: 'Restaurar copia', borrar: 'Borrar mi progreso',
      noGuardar: 'No se pudo guardar tu progreso en este navegador',
      animos: ['Un día menos de no saberlo.', 'Hecho. Mañana sigues desde aquí.', 'Eso ya es tuyo.',
               'Constancia, no prisa.', 'Un día completo vale más que tres a medias.', 'Bien. Cierra y descansa.'],
      etapas: [
        { r: 'Por qué hoy', b: 'Empezar' }, { r: 'Estudia la fuente', b: 'Ya lo leí' },
        { r: 'Mira el ejemplo', b: 'Lo entendí' }, { r: 'Hazlo tú', b: 'Hecho' },
        { r: 'Llévalo a VetCare', b: 'Continuar' }, { r: 'Comprueba que lo sabes', b: 'Continuar' },
        { r: 'Cierra el día', b: '' }
      ],
      porQueSirve: 'Por qué te sirve', alTerminar: 'Al terminar hoy tendrás',
      sirveTrabajo: 'Para qué sirve en el trabajo real', importante: 'Por qué es tan importante',
      queHacer: 'Qué hacer con esa fuente', pasoAPaso: 'Cómo estudiarlo, paso a paso',
      refuerzo: 'Refuerzo antes de seguir', porQueAhora: 'Por qué ahora:', errores: 'Errores típicos',
      compruebaRef: 'Comprueba que lo entendiste', profundizar: 'Para profundizar:',
      marcaPasos: function (n) { return 'Marca cada paso cuando lo hayas hecho de verdad. No se puede seguir sin los ' + n + '.'; },
      verPista: 'Ver pista',
      enProyecto: 'En tu proyecto', seEquivoca: 'Dónde se equivoca casi todo el mundo',
      preguntar: 'Qué preguntar en el trabajo y qué deberías obtener', obtener: 'Deberías obtener:',
      noPreguntar: 'Así no se pregunta',
      respondeVoz: 'Responde en voz alta antes de abrir la respuesta. Si no la tenías, no pasa nada: esa pregunta se guarda en Repaso.',
      verRespuesta: 'Ver respuesta', laTenias: '¿La tenías?', si: 'Sí', noDelTodo: 'No del todo',
      laSabias: '<b>La sabías.</b>', guardadaRep: '<b>Guardada en Repaso.</b> Vuelve a ella en unos días.', cambiarResp: 'Cambiar',
      verSolucion: 'Ver la solución de referencia', notaDia: 'Tu nota del día (opcional)',
      notaPh: 'Qué te costó, qué descubriste, qué quieres recordar...',
      completar: 'Marcar el día como completado', quitarRep: 'Quitar de repaso', marcarRep: 'Marcar para repasar',
      faltanPasos: function (n) { return 'Marca los ' + n + ' pasos para continuar'; },
      faltanPregs: function (n) { return 'Responde las ' + n + ' preguntas para continuar'; },
      semDia: function (s, d) { return 'Semana ' + s + '<span class="sep">·</span>Día ' + d + ' de 6'; },
      completado: 'completado',
      reabrirQ: '¿Marcaste el día anterior como completado por error? ', reabrir: function (t) { return 'Reabrir «' + t + '»'; },
      volver: '← Volver',
      finTit: '144 días. Terminaste.',
      finP1: 'Veinticuatro semanas, un sistema documentado de punta a punta y dos historias que de verdad te pasaron.',
      finP2: 'Lo que te falta ahora no es conocimiento: son repeticiones y tráfico real. Eso empieza con el proyecto siguiente.',
      verRecorrido: 'Ver todo el recorrido',
      bienvenida:
        '<p><b>Cómo funciona esta ruta.</b> Durante 24 semanas construyes VetCare, el software de una clínica veterinaria. ' +
        'La clínica es inventada: no hay cliente real al que preguntar, así que los datos (cuántos veterinarios, cuántas mascotas, qué problemas tienen) ' +
        'los inventas tú, de forma realista, como si los hubieras averiguado hablando con el dueño.</p>' +
        '<p><b>Antes de empezar:</b> crea en tu ordenador una carpeta llamada <code>vetcare</code> y dentro otra llamada <code>docs</code>. ' +
        'Las primeras semanas no hay código: escribes documentos de texto (<code>.md</code>) con cualquier editor, por ejemplo VS Code o el Bloc de notas.</p>' +
        '<p><b>Cada día:</b> lees la fuente, miras el ejemplo resuelto y haces lo mismo para VetCare. Al cerrar el día aparece el siguiente; no se puede adelantar.</p>',
      semDe: function (n, t) { return 'Semana ' + n + ' de ' + t; }, bloqueado: 'Aún bloqueado',
      recorrido: 'El recorrido',
      recorridoSub: function (h, t) { return h + ' de ' + t + ' días completados. Las semanas cerradas se abren solas cuando llegas a ellas.'; },
      contBloq: 'Contenido bloqueado', semana: function (n) { return 'Semana ' + n; },
      enCurso: function (d) { return 'En curso · día ' + d + ' de 6'; }, completa: 'Completa',
      semHechos: function (n, h) { return 'Semana ' + n + ' · ' + h + ' de 6'; },
      aContinuacion: 'A continuación', cerrada: 'Cerrada', dia: function (n) { return 'Día ' + n; },
      releer: 'Volver a leerlo →',
      repaso: 'Repaso',
      repasoSub: 'Lo que marcaste como no sabido. Cada pregunta vuelve a aparecer al día siguiente, y si la aciertas, a los 3, 7 y 14 días. Así se fija de verdad.',
      nadaRep: 'Nada pendiente de repaso.<br>Aparecerá aquí cuando respondas <em>No del todo</em> a una pregunta.',
      paraHoy: function (n) { return 'Para repasar hoy · ' + n; },
      semDiaT: function (s, d, t) { return 'Semana ' + s + ' · día ' + d + (t ? ' · ' + t : ''); },
      yaSe: 'Ya me la sé', cerrarla: ' (cerrarla)', vuelveEn: function (n) { return ' (vuelve en ' + n + ' días)'; },
      todaviaNo: 'Todavía no (mañana)', hoyNada: 'Hoy no te toca repasar ninguna pregunta.',
      masAdelante: function (n) { return 'Más adelante · ' + n; },
      vuelveEl: function (f, s, d) { return 'Vuelve el ' + f + ' · semana ' + s + ', día ' + d; },
      diasReleer: function (n) { return 'Días marcados para releer · ' + n; },
      releerBtn: 'Volver a leerlo', quitar: 'Quitar',
      misNotas: 'Mis notas',
      notasSub: function (n) { return n + (n === 1 ? ' nota escrita' : ' notas escritas') + '. Lo que escribiste con tus palabras es lo que de verdad recordarás.'; },
      sinNotas: 'Todavía no has escrito ninguna nota.<br>En el cierre de cada día tienes un espacio para hacerlo.',
      verDia: 'Ver el día →',
      glosario: 'Glosario',
      gloSub: function (n) { return n + ' términos. El nombre técnico de muchas cosas que probablemente ya hacías: ponerles nombre es lo que te deja explicarlas y defenderlas.'; },
      gloPh: 'Buscar: cohesión, idempotencia, p95…', gloAria: 'Buscar en el glosario',
      repasarDia: 'Repasar el día →', diaHoy: 'Es el día de hoy →',
      seEstudia: function (s, d) { return 'Se estudia en la semana ' + s + ', día ' + d; },
      yaLoHiciste: 'Seguramente ya lo hiciste', entrevista: 'Cómo decirlo en una entrevista',
      gloNada: 'Ningún término coincide con la búsqueda.',
      completadoTot: 'Completado', diaDe: function (n, t) { return 'Día ' + n + ' de ' + t; },
      avRepaso: 'Guardada en Repaso: vuelve mañana',
      semCompleta: function (n, q) { return 'Semana ' + n + ' completa. ' + (q === 0 ? 'Era la última.' : q === 1 ? 'Queda una.' : q + ' por delante.'); },
      cerrada2: 'Pregunta cerrada. Ya es tuya.', bienVuelve: function (n) { return 'Bien. Vuelve en ' + n + ' días.'; },
      manana: 'Vuelve mañana',
      reabrirConf: function (t) { return 'Se reabre «' + t + '» y vuelve a ser tu día actual. Tus pasos, respuestas y notas se conservan.\n\n¿Continuar?'; },
      reabierto: 'Día reabierto', copiaOk: 'Copia guardada', restaurado: 'Progreso restaurado',
      copiaMal: 'Ese archivo no es una copia válida',
      borrarConf: 'Esto borra tu progreso, tus notas y tu repaso. No se puede deshacer.\n\n¿Continuar?',
      deCero: 'Empezamos de cero',
      sinContenido: 'No se cargó el contenido del curso.<br>Revisa que la carpeta <strong>contenido/</strong> esté junto a este archivo.'
    },

    en: {
      lang: 'en', locale: 'en', otro: 'ES', cambiar: 'Cambiar a español',
      nav: { hoy: 'Today', mapa: 'Map', repaso: 'Review', notas: 'Notes', glosario: 'Glossary' },
      tema: 'Change theme', mas: 'More options',
      exportar: 'Save backup', importar: 'Restore backup', borrar: 'Delete my progress',
      noGuardar: 'Your progress could not be saved in this browser',
      animos: ['One less day of not knowing it.', 'Done. Tomorrow you pick up from here.', 'That is yours now.',
               'Consistency, not speed.', 'One full day beats three half days.', 'Good. Close up and rest.'],
      etapas: [
        { r: 'Why today', b: 'Start' }, { r: 'Study the source', b: 'I read it' },
        { r: 'See the example', b: 'I get it' }, { r: 'Do it yourself', b: 'Done' },
        { r: 'Bring it to VetCare', b: 'Continue' }, { r: 'Check you know it', b: 'Continue' },
        { r: 'Close the day', b: '' }
      ],
      porQueSirve: 'Why it helps you', alTerminar: 'By the end of today you will have',
      sirveTrabajo: 'What it is for in a real job', importante: 'Why it matters so much',
      queHacer: 'What to do with this source', pasoAPaso: 'How to study it, step by step',
      refuerzo: 'Refresher before you continue', porQueAhora: 'Why now:', errores: 'Common mistakes',
      compruebaRef: 'Check you understood it', profundizar: 'To go deeper:',
      marcaPasos: function (n) { return 'Tick each step only when you have really done it. You cannot continue without all ' + n + '.'; },
      verPista: 'Show hint',
      enProyecto: 'In your project', seEquivoca: 'Where almost everyone goes wrong',
      preguntar: 'What to ask at work and what you should get', obtener: 'You should get:',
      noPreguntar: 'How not to ask',
      respondeVoz: 'Answer out loud before opening the answer. If you did not know it, that is fine: the question is saved to Review.',
      verRespuesta: 'Show answer', laTenias: 'Did you get it?', si: 'Yes', noDelTodo: 'Not quite',
      laSabias: '<b>You knew it.</b>', guardadaRep: '<b>Saved to Review.</b> Come back to it in a few days.', cambiarResp: 'Change',
      verSolucion: 'Show the reference solution', notaDia: 'Your note for today (optional)',
      notaPh: 'What was hard, what you discovered, what you want to remember...',
      completar: 'Mark the day as complete', quitarRep: 'Remove from review', marcarRep: 'Mark for review',
      faltanPasos: function (n) { return 'Tick all ' + n + ' steps to continue'; },
      faltanPregs: function (n) { return 'Answer all ' + n + ' questions to continue'; },
      semDia: function (s, d) { return 'Week ' + s + '<span class="sep">·</span>Day ' + d + ' of 6'; },
      completado: 'completed',
      reabrirQ: 'Did you mark the previous day as complete by mistake? ', reabrir: function (t) { return 'Reopen “' + t + '”'; },
      volver: '← Back',
      finTit: '144 days. You finished.',
      finP1: 'Twenty-four weeks, a system documented end to end, and two stories that really happened to you.',
      finP2: 'What you are missing now is not knowledge: it is repetitions and real traffic. That starts with the next project.',
      verRecorrido: 'See the whole path',
      bienvenida:
        '<p><b>How this path works.</b> Over 24 weeks you build VetCare, the software for a veterinary clinic. ' +
        'The clinic is made up: there is no real client to ask, so you invent the data (how many vets, how many pets, what problems they have) ' +
        'realistically, as if you had found it out by talking to the owner.</p>' +
        '<p><b>Before you start:</b> create a folder called <code>vetcare</code> on your computer, with another one called <code>docs</code> inside. ' +
        'The first weeks have no code: you write text documents (<code>.md</code>) with any editor, such as VS Code or Notepad.</p>' +
        '<p><b>Every day:</b> you read the source, look at the worked example and do the same for VetCare. When you close the day, the next one appears; you cannot skip ahead.</p>',
      semDe: function (n, t) { return 'Week ' + n + ' of ' + t; }, bloqueado: 'Still locked',
      recorrido: 'The path',
      recorridoSub: function (h, t) { return h + ' of ' + t + ' days completed. Locked weeks open by themselves when you reach them.'; },
      contBloq: 'Locked content', semana: function (n) { return 'Week ' + n; },
      enCurso: function (d) { return 'In progress · day ' + d + ' of 6'; }, completa: 'Complete',
      semHechos: function (n, h) { return 'Week ' + n + ' · ' + h + ' of 6'; },
      aContinuacion: 'Up next', cerrada: 'Locked', dia: function (n) { return 'Day ' + n; },
      releer: 'Read it again →',
      repaso: 'Review',
      repasoSub: 'What you marked as not known. Each question comes back the next day and, if you get it right, after 3, 7 and 14 days. That is how it really sticks.',
      nadaRep: 'Nothing to review.<br>Questions appear here when you answer <em>Not quite</em>.',
      paraHoy: function (n) { return 'To review today · ' + n; },
      semDiaT: function (s, d, t) { return 'Week ' + s + ' · day ' + d + (t ? ' · ' + t : ''); },
      yaSe: 'I know it now', cerrarla: ' (close it)', vuelveEn: function (n) { return ' (back in ' + n + ' days)'; },
      todaviaNo: 'Not yet (tomorrow)', hoyNada: 'No questions to review today.',
      masAdelante: function (n) { return 'Later · ' + n; },
      vuelveEl: function (f, s, d) { return 'Back on ' + f + ' · week ' + s + ', day ' + d; },
      diasReleer: function (n) { return 'Days marked to reread · ' + n; },
      releerBtn: 'Read it again', quitar: 'Remove',
      misNotas: 'My notes',
      notasSub: function (n) { return n + (n === 1 ? ' note written' : ' notes written') + '. What you wrote in your own words is what you will really remember.'; },
      sinNotas: 'You have not written any notes yet.<br>Each day ends with a space to do it.',
      verDia: 'See the day →',
      glosario: 'Glossary',
      gloSub: function (n) { return n + ' terms. The technical name of many things you probably already did: naming them is what lets you explain and defend them.'; },
      gloPh: 'Search: cohesion, idempotency, p95…', gloAria: 'Search the glossary',
      repasarDia: 'Review the day →', diaHoy: 'It is today’s day →',
      seEstudia: function (s, d) { return 'Studied in week ' + s + ', day ' + d; },
      yaLoHiciste: 'You have probably done it already', entrevista: 'How to say it in an interview',
      gloNada: 'No term matches the search.',
      completadoTot: 'Completed', diaDe: function (n, t) { return 'Day ' + n + ' of ' + t; },
      avRepaso: 'Saved to Review: back tomorrow',
      semCompleta: function (n, q) { return 'Week ' + n + ' complete. ' + (q === 0 ? 'It was the last one.' : q === 1 ? 'One to go.' : q + ' ahead.'); },
      cerrada2: 'Question closed. It is yours now.', bienVuelve: function (n) { return 'Good. Back in ' + n + ' days.'; },
      manana: 'Back tomorrow',
      reabrirConf: function (t) { return '“' + t + '” will reopen and become your current day again. Your steps, answers and notes are kept.\n\nContinue?'; },
      reabierto: 'Day reopened', copiaOk: 'Backup saved', restaurado: 'Progress restored',
      copiaMal: 'That file is not a valid backup',
      borrarConf: 'This deletes your progress, notes and review. It cannot be undone.\n\nContinue?',
      deCero: 'Starting from scratch',
      sinContenido: 'The course content did not load.<br>Check that the <strong>contenido/</strong> folder is next to this file.'
    }
  };

  var CLAVE = 'vetcare-ruta-v4';
  var S = cargar();
  var L, USO, PISTAS, GLOSARIO, REFUERZOS, SOLUCIONES, SEMANAS, PLAN, TOTAL;

  /* elige el idioma: el guardado, o el del contenido disponible */
  function aplicarIdioma() {
    var lang = S.idioma === 'en' && CONTENIDO.en.WEEKS ? 'en' : 'es';
    var c = CONTENIDO[lang];
    L = I18N[lang];
    USO = c.USO || {};                 /* para qué sirve cada día y qué preguntar en el trabajo */
    PISTAS = c.PISTAS || {};           /* una pista por paso de «Hazlo tú» */
    GLOSARIO = c.GLOSARIO || [];       /* el nombre técnico de lo que ya hacías */
    REFUERZOS = c.REFUERZOS || {};     /* base técnica justo antes del día que la usa */
    SOLUCIONES = c.SOLUCIONES || {};   /* solución de referencia de cada examen */
    SEMANAS = (c.WEEKS || []).slice().sort(function (a, b) { return a.n - b.n; });
    PLAN = [];
    SEMANAS.forEach(function (sem) {
      sem.days.forEach(function (dia, i) {
        PLAN.push({ id: 'w' + sem.n + 'd' + (i + 1), sem: sem, dia: dia, ds: i + 1, idx: PLAN.length });
      });
    });
    TOTAL = PLAN.length;
    textosFijos();
  }

  /* textos de index.html, que no se repintan con cada render */
  function textosFijos() {
    document.documentElement.lang = L.lang;
    document.querySelectorAll('.nav-b').forEach(function (b) {
      var badge = b.querySelector('.pill');
      b.textContent = L.nav[b.dataset.vista];
      if (badge) b.appendChild(badge);
    });
    $('#btnIdioma').textContent = L.otro;
    $('#btnIdioma').title = L.cambiar;
    $('#btnIdioma').setAttribute('aria-label', L.cambiar);
    $('#btnTema').title = L.tema;
    $('#btnMas').title = L.mas;
    $('#btnExport').textContent = L.exportar;
    $('#lblImport').firstChild.nodeValue = L.importar;
    $('#btnReset').textContent = L.borrar;
  }

  var pistaAbierta = {};   /* pistas desplegadas; sobreviven a los repintados de la vista */
  var glosarioQ = '';
  var revisando = null;
  var volverA = 'hoy';     /* vista a la que vuelve el botón «Volver» tras releer un día */
  var scrollA = null;
  var refoco = null;

  function cargar() {
    var base = { hecho: {}, etapa: {}, paso: {}, quiz: {}, nota: {}, repaso: {}, rep: {}, tema: null, idioma: null };
    var x = {};
    try { x = JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { x = {}; }
    Object.keys(base).forEach(function (k) { if (x[k] === undefined) x[k] = base[k]; });
    return x;
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(S)); }
    catch (e) { avisar(L.noGuardar); }
  }

  /* ---------- utilidades ---------- */

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(s) { return document.querySelector(s); }
  function posicion() {
    for (var i = 0; i < TOTAL; i++) { if (!S.hecho[PLAN[i].id]) return i; }
    return TOTAL;
  }
  function hechos() {
    var n = 0;
    for (var i = 0; i < TOTAL; i++) { if (S.hecho[PLAN[i].id]) n++; }
    return n;
  }
  function porId(id) {
    for (var i = 0; i < TOTAL; i++) { if (PLAN[i].id === id) return PLAN[i]; }
    return null;
  }
  function avisar(t) {
    var el = $('#aviso');
    el.textContent = t;
    el.classList.add('ver');
    clearTimeout(avisar._t);
    avisar._t = setTimeout(function () { el.classList.remove('ver'); }, 3200);
  }

  var DIA_MS = 86400000;
  var INTERVALOS = [1, 3, 7, 14];   /* días hasta la siguiente vuelta de una pregunta fallada */
  function hoy() { return enDias(0); }
  /* medianoche de dentro de n días; con setDate y no sumando 24 h, para que
     los cambios de hora de marzo y octubre no retrasen un repaso un día */
  function enDias(n) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d.getTime(); }
  function toca(k) { var r = S.rep[k]; return !r || r.due <= hoy(); }
  function fecha(ms) { return new Date(ms).toLocaleDateString(L.locale, { day: 'numeric', month: 'long' }); }
  function temaOscuro() {
    if (S.tema) return S.tema === 'oscuro';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  /* ---------- etapas de un dia ---------- */

  function etapaDe(id) { return S.etapa[id] || 0; }

  function pasosListos(p) {
    for (var i = 0; i < p.dia.steps.length; i++) {
      if (!S.paso[p.id + '-p' + i]) return false;
    }
    return true;
  }
  function quizListo(p) {
    for (var i = 0; i < p.dia.quiz.length; i++) {
      if (!S.quiz[p.id + '-q' + i]) return false;
    }
    return true;
  }
  function puedeAvanzar(p, n) {
    if (n === 3) return pasosListos(p);
    if (n === 5) return quizListo(p);
    return true;
  }

  function htmlEtapa(p, n, abierta, soloLectura) {
    var d = p.dia, cuerpo = '';

    if (n === 0) {
      cuerpo = '<p>' + esc(d.obj) + '</p>' +
               '<div class="rotulo">' + L.porQueSirve + '</div>' +
               '<p class="nota">' + esc(d.why) + '</p>' +
               '<div class="rotulo">' + L.alTerminar + '</div>' +
               '<div class="entrega">' + esc(d.out) +
               '<br><span class="arch">' + esc(d.file) + '</span></div>';
      var u = USO[p.id];
      if (u) {
        cuerpo += '<div class="rotulo">' + L.sirveTrabajo + '</div>' +
                  '<p class="nota">' + esc(u.sirve) + '</p>' +
                  '<div class="rotulo">' + L.importante + '</div>' +
                  '<p class="nota">' + esc(u.importa) + '</p>';
      }
    }

    if (n === 1) {
      var r = p.sem.res[d.study.r] || p.sem.res[0];
      cuerpo = '<div class="recurso">' +
                 '<a href="' + esc(r.u) + '" target="_blank" rel="noopener noreferrer">' + esc(r.t) + '</a>' +
                 '<span class="url">' + esc(r.u) + '</span>' +
                 (r.note ? '<p class="nota-r">' + esc(r.note) + '</p>' : '') +
               '</div>' +
               '<div class="rotulo">' + L.queHacer + '</div>' +
               '<p class="nota">' + esc(d.study.what) + '</p>';
      if (d.study.pasos && d.study.pasos.length) {
        cuerpo += '<div class="rotulo">' + L.pasoAPaso + '</div><ol>';
        d.study.pasos.forEach(function (s) { cuerpo += '<li>' + esc(s) + '</li>'; });
        cuerpo += '</ol>';
      }
      var rf = REFUERZOS[p.id];
      if (rf) {
        cuerpo += '<div class="refuerzo">' +
                  '<div class="refuerzo-sup">' + L.refuerzo + '</div>' +
                  '<p class="refuerzo-t">' + esc(rf.t) + '</p>' +
                  '<p class="nota"><b>' + L.porQueAhora + '</b> ' + esc(rf.porque) + '</p>';
        rf.explica.forEach(function (x) { cuerpo += '<p class="nota">' + esc(x) + '</p>'; });
        cuerpo += '<pre class="cod">' + esc(rf.ejemplo) + '</pre>' +
                  '<div class="rotulo">' + L.errores + '</div><ul class="avisos">';
        rf.errores.forEach(function (x) { cuerpo += '<li>' + esc(x) + '</li>'; });
        cuerpo += '</ul><div class="rotulo">' + L.compruebaRef + '</div>';
        rf.comprueba.forEach(function (x) {
          cuerpo += '<details class="refuerzo-q"><summary>' + esc(x.q) + '</summary><p>' + esc(x.a) + '</p></details>';
        });
        if (rf.fuente) {
          cuerpo += '<p class="nota refuerzo-f">' + L.profundizar + ' <a href="' + esc(rf.fuente.u) +
                    '" target="_blank" rel="noopener noreferrer">' + esc(rf.fuente.t) + '</a></p>';
        }
        cuerpo += '</div>';
      }
    }

    if (n === 2) {
      cuerpo = '<p class="ej-tit">' + esc(d.ex.title) + '</p>' +
               '<pre class="cod">' + esc(d.ex.body) + '</pre>';
    }

    if (n === 3) {
      cuerpo = '<p class="nota">' + L.marcaPasos(d.steps.length) + '</p>';
      d.steps.forEach(function (s, i) {
        var k = p.id + '-p' + i, on = !!S.paso[k];
        cuerpo += '<div class="paso' + (on ? ' ok' : '') + '"' +
                  (soloLectura ? '' : ' data-paso="' + k + '" role="checkbox" tabindex="0" aria-checked="' + on + '"') + '>' +
                  '<span class="caja">✓</span><span>' + esc(s) + '</span></div>';
        var pista = (PISTAS[p.id] || [])[i];
        if (pista) {
          cuerpo += '<details class="pista-paso" data-pista="' + k + '"' + (pistaAbierta[k] ? ' open' : '') + '>' +
                    '<summary>' + L.verPista + '</summary><p>' + esc(pista) + '</p></details>';
        }
      });
    }

    if (n === 4) {
      cuerpo = '<div class="rotulo">' + L.enProyecto + '</div><ul>';
      d.vet.forEach(function (v) { cuerpo += '<li>' + esc(v) + '</li>'; });
      cuerpo += '</ul><div class="rotulo">' + L.seEquivoca + '</div><ul class="avisos">';
      d.edge.forEach(function (v) { cuerpo += '<li>' + esc(v) + '</li>'; });
      cuerpo += '</ul>';
      var u2 = USO[p.id];
      if (u2) {
        cuerpo += '<div class="rotulo">' + L.preguntar + '</div>';
        u2.preguntas.forEach(function (x) {
          cuerpo += '<div class="preg">' +
                      '<span class="preg-a">' + esc(x.a) + '</span>' +
                      '<p class="preg-q">«' + esc(x.q) + '»</p>' +
                      '<p class="preg-o"><b>' + L.obtener + '</b> ' + esc(x.obt) + '</p>' +
                    '</div>';
        });
        if (u2.evita) {
          cuerpo += '<div class="preg evita">' +
                      '<span class="preg-a">' + L.noPreguntar + '</span>' +
                      '<p class="preg-q">«' + esc(u2.evita.q) + '»</p>' +
                      '<p class="preg-o">' + esc(u2.evita.por) + '</p>' +
                    '</div>';
        }
      }
    }

    if (n === 5) {
      cuerpo = '<p class="nota">' + L.respondeVoz + '</p>';
      d.quiz.forEach(function (q, i) {
        var k = p.id + '-q' + i, j = S.quiz[k];
        var visible = !!j || !!S.quiz[k + '-v'] || soloLectura;
        cuerpo += '<div class="q' + (j ? ' resuelta' : '') + '">' +
                  '<p class="q-txt">' + esc(q.q) + '</p>';
        if (!visible) {
          cuerpo += '<button class="q-mini" data-ver="' + k + '">' + L.verRespuesta + '</button>';
        } else {
          cuerpo += '<p class="q-resp">' + esc(q.a) + '</p>';
          if (!j && !soloLectura) {
            cuerpo += '<div class="q-juicio"><small>' + L.laTenias + '</small>' +
                      '<button class="q-mini" data-j="' + k + '" data-v="si">' + L.si + '</button>' +
                      '<button class="q-mini" data-j="' + k + '" data-v="no">' + L.noDelTodo + '</button></div>';
          } else if (j) {
            cuerpo += '<p class="q-marca' + (j === 'no' ? ' fallo' : '') + '">' +
                      (j === 'si' ? L.laSabias : L.guardadaRep) +
                      (soloLectura ? '' : ' <button class="q-mini" data-cambiar="' + k + '">' + L.cambiarResp + '</button>') +
                      '</p>';
          }
        }
        cuerpo += '</div>';
      });
    }

    if (n === 6) {
      var sol = SOLUCIONES[p.id];
      cuerpo = '<div class="entrega">' + esc(d.out) +
               '<br><span class="arch">' + esc(d.file) + '</span></div>' +
               (sol ? '<details class="solucion"><summary>' + L.verSolucion + '</summary>' +
                      '<p class="nota">' + esc(sol.intro) + '</p>' +
                      '<pre class="cod">' + esc(sol.body) + '</pre></details>' : '') +
               '<div class="rotulo">' + L.notaDia + '</div>' +
               '<textarea class="nota-in" data-nota="' + p.id + '" placeholder="' + esc(L.notaPh) + '">' +
               esc(S.nota[p.id] || '') + '</textarea>';
      if (!soloLectura) {
        cuerpo += '<div class="acciones">' +
                  '<button class="btn" data-completar="' + p.id + '">' + L.completar + '</button>' +
                  '<button class="btn plano" data-repasar="' + p.id + '">' +
                  (S.repaso[p.id] ? L.quitarRep : L.marcarRep) + '</button>' +
                  '</div>';
      }
    }

    var pie = '';
    if (!soloLectura && abierta && n < 6) {
      var ok = puedeAvanzar(p, n);
      pie = '<div class="acciones">' +
            '<button class="btn" data-sig="' + n + '"' + (ok ? '' : ' disabled') + '>' + L.etapas[n].b + '</button>' +
            (ok ? '' : '<span class="pista">' + (n === 3
                ? L.faltanPasos(p.dia.steps.length)
                : L.faltanPregs(p.dia.quiz.length)) + '</span>') +
            '</div>';
    }

    return '<section class="etapa' + (abierta ? '' : ' lista') + '" id="et-' + n + '">' +
             '<div class="etapa-n"><b>' + (n + 1) + '</b>' + esc(L.etapas[n].r) + '</div>' +
             cuerpo + pie +
           '</section>';
  }

  function htmlDia(p, soloLectura) {
    var top = soloLectura ? 6 : etapaDe(p.id);
    var h = '<article class="dia">' +
            '<div class="dia-sup">' + L.semDia(p.sem.n, p.ds) +
            (soloLectura && S.hecho[p.id] ? '<span class="sep">·</span>' + L.completado : '') + '</div>' +
            '<h2>' + esc(p.dia.t) + '</h2>';
    for (var n = 0; n <= top; n++) {
      h += htmlEtapa(p, n, n === top, soloLectura);
    }
    return h + '</article>';
  }

  /* ---------- vista: hoy ---------- */

  function htmlReabrir(i) {
    var ant = i > 0 ? PLAN[i - 1] : null;
    if (!ant || !S.hecho[ant.id] || Date.now() - S.hecho[ant.id] > DIA_MS) return '';
    return '<div class="deshacer">' + L.reabrirQ +
           '<button class="enlace" data-reabrir="' + ant.id + '">' + esc(L.reabrir(ant.dia.t)) + '</button></div>';
  }

  function vistaHoy() {
    var cont = $('#vistaHoy');

    if (revisando) {
      var p = porId(revisando);
      cont.innerHTML = '<div class="acciones" style="margin:0 0 22px">' +
                       '<button class="btn plano" data-volver="1">' + L.volver + '</button></div>' +
                       '<div class="sem-cab"><span class="sem-fase">' + esc(p.sem.phase) + '</span>' +
                       '<h1>' + esc(p.sem.title) + '</h1></div>' +
                       htmlDia(p, true);
      return;
    }

    var i = posicion();

    if (i >= TOTAL) {
      cont.innerHTML = htmlReabrir(i) + '<div class="final"><div class="glifo">✦</div>' +
        '<h1>' + L.finTit + '</h1>' +
        '<p>' + L.finP1 + '</p>' +
        '<p>' + L.finP2 + '</p>' +
        '<div class="acciones" style="justify-content:center"><button class="btn plano" data-ir="mapa">' + L.verRecorrido + '</button></div></div>';
      return;
    }

    var p2 = PLAN[i];
    var sem = p2.sem;
    var h = htmlReabrir(i);

    if (i === 0) h += '<div class="bienvenida">' + L.bienvenida + '</div>';

    h += '<div class="sem-cab">' +
         '<span class="sem-fase">' + esc(sem.phase) + '</span>' +
         '<h1>' + esc(sem.title) + '</h1>' +
         '<p class="sem-meta">' + L.semDe(sem.n, SEMANAS.length) + '</p>' +
         '<p class="sem-idea">' + esc(sem.idea) + '</p>' +
         '<div class="tira">';

    sem.days.forEach(function (d, k) {
      var id = 'w' + sem.n + 'd' + (k + 1);
      var cls = S.hecho[id] ? 'hecho' : (id === p2.id ? 'actual' : 'bloq');
      h += '<div class="tira-d ' + cls + '" title="' + (cls === 'bloq' ? L.bloqueado : esc(d.t)) + '">' +
           (cls === 'hecho' ? '✓' : (k + 1)) + '</div>';
    });

    h += '</div></div>' + htmlDia(p2, false);
    cont.innerHTML = h;
  }

  /* ---------- vista: mapa ---------- */

  function vistaMapa() {
    var i = posicion();
    var actual = i < TOTAL ? PLAN[i] : null;
    var h = '<h1 class="tit">' + L.recorrido + '</h1>' +
            '<p class="sub">' + L.recorridoSub(hechos(), TOTAL) + '</p>';

    var fase = null;
    SEMANAS.forEach(function (sem) {
      if (sem.phase !== fase) { fase = sem.phase; h += '<div class="mfase">' + esc(fase) + '</div>'; }

      var hechosSem = 0;
      sem.days.forEach(function (d, k) { if (S.hecho['w' + sem.n + 'd' + (k + 1)]) hechosSem++; });

      var esActual = actual && actual.sem.n === sem.n;
      var completa = hechosSem === sem.days.length;
      var cerrada = hechosSem === 0 && !esActual;
      var siguiente = actual && sem.n === actual.sem.n + 1;

      var cls = 'msem' + (completa ? ' completa' : '') + (esActual ? ' activa' : '') + (cerrada ? ' cerrada' : '');
      var titulo = cerrada && !siguiente ? L.contBloq : sem.title;

      h += '<div class="' + cls + '"' + (hechosSem > 0 ? ' data-abrir="' + sem.n + '" role="button" tabindex="0" aria-expanded="' + (S.abierta === sem.n) + '"' : '') + '>' +
           '<div class="msem-n">' + (completa ? '✓' : sem.n) + '</div>' +
           '<div class="msem-cue"><strong>' + esc(titulo) + '</strong>' +
           '<span>' + (cerrada && !siguiente ? L.semana(sem.n)
                        : (esActual ? L.enCurso(actual.ds)
                        : (completa ? L.completa : L.semHechos(sem.n, hechosSem)))) + '</span></div>';

      if (cerrada) {
        h += '<span class="cerr">' + (siguiente ? L.aContinuacion : L.cerrada) + '</span>';
      } else {
        h += '<div class="msem-pts">';
        sem.days.forEach(function (d, k) {
          h += '<span class="pt' + (S.hecho['w' + sem.n + 'd' + (k + 1)] ? ' on' : '') + '"></span>';
        });
        h += '</div>';
      }
      h += '</div>';

      if (S.abierta === sem.n && hechosSem > 0) {
        sem.days.forEach(function (d, k) {
          var id = 'w' + sem.n + 'd' + (k + 1);
          if (!S.hecho[id]) return;
          h += '<div class="ficha" style="margin-left:22px">' +
               '<div class="ficha-sup">' + L.dia(k + 1) + '</div><strong>' + esc(d.t) + '</strong>' +
               '<a href="#" data-leer="' + id + '">' + L.releer + '</a></div>';
        });
      }
    });

    $('#vistaMapa').innerHTML = h;
  }

  /* ---------- vista: repaso ---------- */

  function pendientes() {
    var fallos = [], dias = [];
    PLAN.forEach(function (p) {
      p.dia.quiz.forEach(function (q, i) {
        var k = p.id + '-q' + i;
        if (S.quiz[k] === 'no') fallos.push({ p: p, q: q, k: k, toca: toca(k), due: S.rep[k] ? S.rep[k].due : 0 });
      });
      if (S.repaso[p.id]) dias.push(p);
    });
    return { fallos: fallos, dias: dias };
  }

  function vistaRepaso() {
    var x = pendientes();
    var h = '<h1 class="tit">' + L.repaso + '</h1>' +
            '<p class="sub">' + L.repasoSub + '</p>';

    if (!x.fallos.length && !x.dias.length) {
      h += '<div class="vacio"><p>' + L.nadaRep + '</p></div>';
      $('#vistaRepaso').innerHTML = h;
      return;
    }

    var ya = x.fallos.filter(function (f) { return f.toca; });
    var luego = x.fallos.filter(function (f) { return !f.toca; }).sort(function (a, b) { return a.due - b.due; });

    if (ya.length) {
      h += '<div class="mfase">' + L.paraHoy(ya.length) + '</div>';
      ya.forEach(function (f) {
        var n = S.rep[f.k] ? S.rep[f.k].n : 0;
        h += '<div class="ficha">' +
             '<div class="ficha-sup">' + esc(L.semDiaT(f.p.sem.n, f.p.ds, f.p.dia.t)) + '</div>' +
             '<strong>' + esc(f.q.q) + '</strong>' +
             '<details><summary>' + L.verRespuesta + '</summary><p>' + esc(f.q.a) + '</p></details>' +
             '<div class="acciones" style="margin-top:4px">' +
             '<button class="btn plano" data-ok="' + f.k + '">' + L.yaSe +
             (n + 1 >= INTERVALOS.length ? L.cerrarla : L.vuelveEn(INTERVALOS[n + 1])) + '</button>' +
             '<button class="btn plano" data-otra="' + f.k + '">' + L.todaviaNo + '</button></div></div>';
      });
    } else if (x.fallos.length) {
      h += '<div class="vacio"><p>' + L.hoyNada + '</p></div>';
    }

    if (luego.length) {
      h += '<div class="mfase">' + L.masAdelante(luego.length) + '</div>';
      luego.forEach(function (f) {
        h += '<div class="ficha ficha-luego"><div class="ficha-sup">' + L.vuelveEl(fecha(f.due), f.p.sem.n, f.p.ds) + '</div>' +
             '<strong>' + esc(f.q.q) + '</strong></div>';
      });
    }

    if (x.dias.length) {
      h += '<div class="mfase">' + L.diasReleer(x.dias.length) + '</div>';
      x.dias.forEach(function (p) {
        h += '<div class="ficha">' +
             '<div class="ficha-sup">' + esc(L.semDiaT(p.sem.n, p.ds)) + '</div>' +
             '<strong>' + esc(p.dia.t) + '</strong>' +
             '<p>' + esc(p.dia.out) + '</p>' +
             '<div class="acciones" style="margin-top:4px">' +
             '<button class="btn plano" data-leer="' + p.id + '">' + L.releerBtn + '</button>' +
             '<button class="btn plano" data-desrepasar="' + p.id + '">' + L.quitar + '</button></div></div>';
      });
    }

    $('#vistaRepaso').innerHTML = h;
  }

  /* ---------- vista: notas ---------- */

  function vistaNotas() {
    var con = PLAN.filter(function (p) { return (S.nota[p.id] || '').trim(); });
    var h = '<h1 class="tit">' + L.misNotas + '</h1>' +
            '<p class="sub">' + L.notasSub(con.length) + '</p>';

    if (!con.length) {
      h += '<div class="vacio"><p>' + L.sinNotas + '</p></div>';
    } else {
      con.slice().reverse().forEach(function (p) {
        h += '<div class="ficha">' +
             '<div class="ficha-sup">' + esc(L.semDiaT(p.sem.n, p.ds, p.sem.phase)) + '</div>' +
             '<strong>' + esc(p.dia.t) + '</strong>' +
             '<p>' + esc(S.nota[p.id]) + '</p>' +
             '<a href="#" data-leer="' + p.id + '">' + L.verDia + '</a></div>';
      });
    }
    $('#vistaNotas').innerHTML = h;
  }

  /* ---------- vista: glosario ---------- */

  /* minúsculas y sin tildes, para que «cohesion» encuentre «Cohesión» */
  function normal(t) {
    return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  /* coincide con el inicio de una palabra: «idor» no debe encontrar «servidor» */
  function encaja(texto, q) { return !q || (' ' + texto).indexOf(' ' + q) !== -1; }
  function coincide(g, q) { return encaja(normal(g.t + ' ' + g.en + ' ' + g.def), q); }

  function vistaGlosario() {
    var q = normal(glosarioQ.trim());
    var actual = posicion() < TOTAL ? PLAN[posicion()].id : null;
    var h = '<h1 class="tit">' + L.glosario + '</h1>' +
            '<p class="sub">' + L.gloSub(GLOSARIO.length) + '</p>' +
            '<input class="glo-buscar" id="glosarioBuscar" type="search" placeholder="' + esc(L.gloPh) + '" ' +
            'aria-label="' + esc(L.gloAria) + '" value="' + esc(glosarioQ) + '">';

    var fases = [];
    GLOSARIO.map(function (g) { return { g: g, p: porId(g.dia) }; })
      .filter(function (x) { return x.p; })
      .sort(function (a, b) { return a.p.idx - b.p.idx; })
      .forEach(function (x) {
        var f = fases[fases.length - 1];
        if (!f || f.nombre !== x.p.sem.phase) fases.push(f = { nombre: x.p.sem.phase, items: [] });
        f.items.push(x);
      });

    fases.forEach(function (f) {
      var visibles = f.items.filter(function (x) { return coincide(x.g, q); }).length;
      h += '<section class="glo-fase"' + (visibles ? '' : ' hidden') + '><h2 class="glo-fase-t">' + esc(f.nombre) + '</h2>';
      f.items.forEach(function (x) {
        var g = x.g, p = x.p, enlace;
        if (S.hecho[p.id]) enlace = '<a href="#" data-leer="' + p.id + '">' + L.repasarDia + '</a>';
        else if (p.id === actual) enlace = '<a href="#" data-ir="hoy">' + L.diaHoy + '</a>';
        else enlace = '<span class="glo-luego">' + L.seEstudia(p.sem.n, p.ds) + '</span>';
        h += '<article class="glo"' + (coincide(g, q) ? '' : ' hidden') + ' data-glo="' + esc(normal(g.t + ' ' + g.en + ' ' + g.def)) + '">' +
             '<div class="glo-cab"><strong>' + esc(g.t) + '</strong>' +
             (g.en && g.en !== g.t ? '<span class="glo-en">' + esc(g.en) + '</span>' : '') + '</div>' +
             '<p>' + esc(g.def) + '</p>' +
             '<div class="rotulo">' + L.yaLoHiciste + '</div><p class="glo-ya">' + esc(g.ya) + '</p>' +
             '<div class="rotulo">' + L.entrevista + '</div><p class="glo-dilo">' + esc(g.dilo) + '</p>' +
             enlace + '</article>';
      });
      h += '</section>';
    });
    h += '<div class="vacio glo-nada"' + (q && !GLOSARIO.some(function (g) { return coincide(g, q); }) ? '' : ' hidden') +
         '><p>' + L.gloNada + '</p></div>';
    $('#vistaGlosario').innerHTML = h;
  }

  /* filtrar sin repintar, para no perder el foco del buscador */
  function filtrarGlosario() {
    var q = normal(glosarioQ.trim()), alguno = false;
    document.querySelectorAll('#vistaGlosario .glo-fase').forEach(function (f) {
      var vis = 0;
      f.querySelectorAll('.glo').forEach(function (a) {
        var ok = encaja(a.getAttribute('data-glo'), q);
        a.hidden = !ok; if (ok) vis++;
      });
      f.hidden = !vis; if (vis) alguno = true;
    });
    $('#vistaGlosario .glo-nada').hidden = alguno;
  }

  /* ---------- render ---------- */

  var vistaActual = 'hoy';

  function render() {
    document.documentElement.className = temaOscuro() ? 'oscuro' : '';

    var n = hechos();
    $('#avanceFill').style.width = (TOTAL ? (n / TOTAL * 100) : 0) + '%';
    $('#avanceTxt').textContent = n >= TOTAL ? L.completadoTot : L.diaDe(n + 1, TOTAL);

    var pend = pendientes();
    var cnt = pend.fallos.filter(function (f) { return f.toca; }).length + pend.dias.length;
    $('#pillRepaso').textContent = cnt ? String(cnt) : '';

    vistaHoy(); vistaMapa(); vistaRepaso(); vistaNotas(); vistaGlosario();

    ['hoy', 'mapa', 'repaso', 'notas', 'glosario'].forEach(function (v) {
      $('#vista' + v[0].toUpperCase() + v.slice(1)).classList.toggle('activa', v === vistaActual);
    });
    document.querySelectorAll('.nav-b').forEach(function (b) {
      b.classList.toggle('activa', b.dataset.vista === vistaActual);
    });

    if (refoco) {
      var rf = document.querySelector(refoco);
      if (rf) rf.focus();
      refoco = null;
    }

    if (scrollA) {
      var el = document.getElementById(scrollA);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scrollA = null;
    }
  }

  function irA(v) {
    vistaActual = v;
    revisando = null;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- eventos ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-vista],[data-sig],[data-paso],[data-ver],[data-j],[data-completar],' +
                             '[data-repasar],[data-desrepasar],[data-ok],[data-otra],[data-cambiar],[data-reabrir],[data-leer],[data-abrir],[data-volver],[data-ir]');
    if (!t) {
      if (!e.target.closest('.menu-env')) $('#menu').classList.remove('abierto');
      return;
    }

    var d = t.dataset;

    if (d.vista) { irA(d.vista); return; }
    if (d.ir) { irA(d.ir); return; }
    if (d.volver) { irA(volverA); return; }

    if (d.leer) {
      e.preventDefault();
      volverA = vistaActual;
      revisando = d.leer; vistaActual = 'hoy'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (d.abrir) {
      S.abierta = S.abierta === +d.abrir ? null : +d.abrir;
      refoco = '[data-abrir="' + d.abrir + '"]';
      guardar(); render(); return;
    }

    if (d.paso) {
      S.paso[d.paso] = !S.paso[d.paso];
      refoco = '[data-paso="' + d.paso + '"]';
      guardar(); render(); return;
    }

    if (d.ver) { S.quiz[d.ver + '-v'] = true; guardar(); render(); return; }

    if (d.j) {
      S.quiz[d.j] = d.v;
      if (d.v === 'no') { S.rep[d.j] = { n: 0, due: enDias(1) }; avisar(L.avRepaso); }
      guardar(); render(); return;
    }

    if (d.sig) {
      var i = posicion();
      if (i >= TOTAL) return;
      var p = PLAN[i], n = +d.sig;
      if (!puedeAvanzar(p, n)) return;
      S.etapa[p.id] = Math.max(etapaDe(p.id), n + 1);
      scrollA = 'et-' + (n + 1);
      guardar(); render(); return;
    }

    if (d.completar) {
      var pc = porId(d.completar);
      if (!pc || posicion() !== pc.idx) return;
      S.hecho[pc.id] = Date.now();
      guardar();
      if (pc.ds === 6) avisar(L.semCompleta(pc.sem.n, SEMANAS.length - pc.sem.n));
      else avisar(L.animos[(hechos() - 1) % L.animos.length]);
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (d.repasar) {
      if (S.repaso[d.repasar]) delete S.repaso[d.repasar]; else S.repaso[d.repasar] = true;
      guardar(); render(); return;
    }
    if (d.desrepasar) { delete S.repaso[d.desrepasar]; guardar(); render(); return; }
    if (d.ok) {
      var r = S.rep[d.ok] || { n: 0 };
      if (r.n + 1 >= INTERVALOS.length) {
        S.quiz[d.ok] = 'si'; delete S.rep[d.ok];
        avisar(L.cerrada2);
      } else {
        S.rep[d.ok] = { n: r.n + 1, due: enDias(INTERVALOS[r.n + 1]) };
        avisar(L.bienVuelve(INTERVALOS[r.n + 1]));
      }
      guardar(); render(); return;
    }
    if (d.otra) { S.rep[d.otra] = { n: 0, due: enDias(1) }; avisar(L.manana); guardar(); render(); return; }
    if (d.cambiar) { delete S.quiz[d.cambiar]; delete S.rep[d.cambiar]; guardar(); render(); return; }
    if (d.reabrir) {
      var pr = porId(d.reabrir);
      if (!pr || !confirm(L.reabrirConf(pr.dia.t))) return;
      delete S.hecho[d.reabrir];
      guardar(); render(); window.scrollTo({ top: 0 });
      avisar(L.reabierto);
      return;
    }
  });

  /* toggle no burbujea: se escucha en captura */
  document.addEventListener('toggle', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-pista');
    if (k) pistaAbierta[k] = e.target.open;
  }, true);

  document.addEventListener('input', function (e) {
    if (e.target.id === 'glosarioBuscar') { glosarioQ = e.target.value; filtrarGlosario(); return; }
    var id = e.target.dataset && e.target.dataset.nota;
    if (!id) return;
    S.nota[id] = e.target.value;
    clearTimeout(document._tn);
    document._tn = setTimeout(guardar, 500);
  });

  /* si se cierra la pestaña justo después de escribir, guardar ya la nota */
  window.addEventListener('pagehide', function () {
    if (document._tn) { clearTimeout(document._tn); document._tn = null; guardar(); }
  });

  $('#btnTema').addEventListener('click', function () {
    S.tema = temaOscuro() ? 'claro' : 'oscuro';
    guardar(); render();
  });

  $('#btnIdioma').addEventListener('click', function () {
    S.idioma = L.lang === 'es' ? 'en' : 'es';
    glosarioQ = '';
    guardar(); aplicarIdioma(); render();
  });

  $('#btnMas').addEventListener('click', function (e) {
    e.stopPropagation();
    $('#menu').classList.toggle('abierto');
  });

  $('#btnExport').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
    a.download = 'vetcare-progreso-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    /* revocar al momento cancela la descarga en algunos navegadores */
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    $('#menu').classList.remove('abierto');
    avisar(L.copiaOk);
  });

  $('#inpImport').addEventListener('change', function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var x = JSON.parse(r.result);
        if (!x || typeof x !== 'object' || !x.hecho) throw new Error('formato');
        S = x;
        Object.keys({ hecho: 1, etapa: 1, paso: 1, quiz: 1, nota: 1, repaso: 1, rep: 1 }).forEach(function (k) {
          if (!S[k]) S[k] = {};
        });
        guardar(); aplicarIdioma(); render();
        avisar(L.restaurado);
      } catch (err) { avisar(L.copiaMal); }
      e.target.value = '';
      $('#menu').classList.remove('abierto');
    };
    r.readAsText(f);
  });

  $('#btnReset').addEventListener('click', function () {
    $('#menu').classList.remove('abierto');
    if (!confirm(L.borrarConf)) return;
    var idioma = S.idioma;   /* borrar el progreso no cambia el idioma elegido */
    try { localStorage.removeItem(CLAVE); } catch (err) { /* navegador sin almacenamiento */ }
    S = cargar();
    S.idioma = idioma; guardar();
    render();
    avisar(L.deCero);
  });

  /* teclado: Enter o Espacio activan los elementos con role (pasos y semanas del mapa) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target.closest && e.target.closest('[role="checkbox"],[role="button"]');
    if (!t) return;
    e.preventDefault();
    t.click();
  });

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var alCambiar = function () { if (!S.tema) render(); };
    if (mq.addEventListener) mq.addEventListener('change', alCambiar); else if (mq.addListener) mq.addListener(alCambiar);
  }

  /* ---------- arranque ---------- */

  aplicarIdioma();
  if (!TOTAL) {
    $('#vistaHoy').innerHTML = '<div class="vacio"><p>' + L.sinContenido + '</p></div>';
  } else {
    render();
  }
})();
