/* VetCare · ruta de estudio
   Un día a la vez. Una etapa a la vez. Sin atajos. */

(function () {
  'use strict';

  var USO = window.USO || {};   /* para qué sirve cada día y qué preguntar en el trabajo */
  var SEMANAS = (window.WEEKS || []).slice().sort(function (a, b) { return a.n - b.n; });

  var PLAN = [];
  SEMANAS.forEach(function (sem) {
    sem.days.forEach(function (dia, i) {
      PLAN.push({ id: 'w' + sem.n + 'd' + (i + 1), sem: sem, dia: dia, ds: i + 1, idx: PLAN.length });
    });
  });
  var TOTAL = PLAN.length;

  var CLAVE = 'vetcare-ruta-v4';
  var S = cargar();
  var revisando = null;
  var volverA = 'hoy';   /* vista a la que vuelve el botón «Volver» tras releer un día */
  var scrollA = null;
  var refoco = null;

  function cargar() {
    var base = { hecho: {}, etapa: {}, paso: {}, quiz: {}, nota: {}, repaso: {}, rep: {}, tema: null };
    var x = {};
    try { x = JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { x = {}; }
    Object.keys(base).forEach(function (k) { if (x[k] === undefined) x[k] = base[k]; });
    return x;
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(S)); }
    catch (e) { avisar('No se pudo guardar tu progreso en este navegador'); }
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
  function fecha(ms) { return new Date(ms).toLocaleDateString('es', { day: 'numeric', month: 'long' }); }
  function temaOscuro() {
    if (S.tema) return S.tema === 'oscuro';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  var ANIMOS = [
    'Un día menos de no saberlo.',
    'Hecho. Mañana sigues desde aquí.',
    'Eso ya es tuyo.',
    'Constancia, no prisa.',
    'Un día completo vale más que tres a medias.',
    'Bien. Cierra y descansa.'
  ];

  /* ---------- etapas de un dia ---------- */

  var ETAPAS = [
    { r: 'Por qué hoy', b: 'Empezar' },
    { r: 'Estudia la fuente', b: 'Ya lo leí' },
    { r: 'Mira el ejemplo', b: 'Lo entendí' },
    { r: 'Hazlo tú', b: 'Hecho' },
    { r: 'Llévalo a VetCare', b: 'Continuar' },
    { r: 'Comprueba que lo sabes', b: 'Continuar' },
    { r: 'Cierra el día', b: '' }
  ];

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
               '<div class="rotulo">Por qué te sirve</div>' +
               '<p class="nota">' + esc(d.why) + '</p>' +
               '<div class="rotulo">Al terminar hoy tendrás</div>' +
               '<div class="entrega">' + esc(d.out) +
               '<br><span class="arch">' + esc(d.file) + '</span></div>';
      var u = USO[p.id];
      if (u) {
        cuerpo += '<div class="rotulo">Para qué sirve en el trabajo real</div>' +
                  '<p class="nota">' + esc(u.sirve) + '</p>' +
                  '<div class="rotulo">Por qué es tan importante</div>' +
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
               '<div class="rotulo">Qué hacer con esa fuente</div>' +
               '<p class="nota">' + esc(d.study.what) + '</p>';
      if (d.study.pasos && d.study.pasos.length) {
        cuerpo += '<div class="rotulo">Cómo estudiarlo, paso a paso</div><ol>';
        d.study.pasos.forEach(function (s) { cuerpo += '<li>' + esc(s) + '</li>'; });
        cuerpo += '</ol>';
      }
    }

    if (n === 2) {
      cuerpo = '<p class="ej-tit">' + esc(d.ex.title) + '</p>' +
               '<pre class="cod">' + esc(d.ex.body) + '</pre>';
    }

    if (n === 3) {
      cuerpo = '<p class="nota">Marca cada paso cuando lo hayas hecho de verdad. No se puede seguir sin los ' +
               d.steps.length + '.</p>';
      d.steps.forEach(function (s, i) {
        var k = p.id + '-p' + i, on = !!S.paso[k];
        cuerpo += '<div class="paso' + (on ? ' ok' : '') + '"' +
                  (soloLectura ? '' : ' data-paso="' + k + '" role="checkbox" tabindex="0" aria-checked="' + on + '"') + '>' +
                  '<span class="caja">✓</span><span>' + esc(s) + '</span></div>';
      });
    }

    if (n === 4) {
      cuerpo = '<div class="rotulo">En tu proyecto</div><ul>';
      d.vet.forEach(function (v) { cuerpo += '<li>' + esc(v) + '</li>'; });
      cuerpo += '</ul><div class="rotulo">Dónde se equivoca casi todo el mundo</div><ul class="avisos">';
      d.edge.forEach(function (v) { cuerpo += '<li>' + esc(v) + '</li>'; });
      cuerpo += '</ul>';
      var u = USO[p.id];
      if (u) {
        cuerpo += '<div class="rotulo">Qué preguntar en el trabajo y qué deberías obtener</div>';
        u.preguntas.forEach(function (x) {
          cuerpo += '<div class="preg">' +
                      '<span class="preg-a">' + esc(x.a) + '</span>' +
                      '<p class="preg-q">«' + esc(x.q) + '»</p>' +
                      '<p class="preg-o"><b>Deberías obtener:</b> ' + esc(x.obt) + '</p>' +
                    '</div>';
        });
        if (u.evita) {
          cuerpo += '<div class="preg evita">' +
                      '<span class="preg-a">Así no se pregunta</span>' +
                      '<p class="preg-q">«' + esc(u.evita.q) + '»</p>' +
                      '<p class="preg-o">' + esc(u.evita.por) + '</p>' +
                    '</div>';
        }
      }
    }

    if (n === 5) {
      cuerpo = '<p class="nota">Responde en voz alta antes de abrir la respuesta. Si no la tenías, no pasa nada: ' +
               'esa pregunta se guarda en Repaso.</p>';
      d.quiz.forEach(function (q, i) {
        var k = p.id + '-q' + i, j = S.quiz[k];
        var visible = !!j || !!S.quiz[k + '-v'] || soloLectura;
        cuerpo += '<div class="q' + (j ? ' resuelta' : '') + '">' +
                  '<p class="q-txt">' + esc(q.q) + '</p>';
        if (!visible) {
          cuerpo += '<button class="q-mini" data-ver="' + k + '">Ver respuesta</button>';
        } else {
          cuerpo += '<p class="q-resp">' + esc(q.a) + '</p>';
          if (!j && !soloLectura) {
            cuerpo += '<div class="q-juicio"><small>¿La tenías?</small>' +
                      '<button class="q-mini" data-j="' + k + '" data-v="si">Sí</button>' +
                      '<button class="q-mini" data-j="' + k + '" data-v="no">No del todo</button></div>';
          } else if (j) {
            cuerpo += '<p class="q-marca' + (j === 'no' ? ' fallo' : '') + '">' +
                      (j === 'si' ? '<b>La sabías.</b>' : '<b>Guardada en Repaso.</b> Vuelve a ella en unos días.') +
                      (soloLectura ? '' : ' <button class="q-mini" data-cambiar="' + k + '">Cambiar</button>') +
                      '</p>';
          }
        }
        cuerpo += '</div>';
      });
    }

    if (n === 6) {
      cuerpo = '<div class="entrega">' + esc(d.out) +
               '<br><span class="arch">' + esc(d.file) + '</span></div>' +
               '<div class="rotulo">Tu nota del día (opcional)</div>' +
               '<textarea class="nota-in" data-nota="' + p.id + '" placeholder="Qué te costó, qué descubriste, qué quieres recordar...">' +
               esc(S.nota[p.id] || '') + '</textarea>';
      if (!soloLectura) {
        cuerpo += '<div class="acciones">' +
                  '<button class="btn" data-completar="' + p.id + '">Marcar el día como completado</button>' +
                  '<button class="btn plano" data-repasar="' + p.id + '">' +
                  (S.repaso[p.id] ? 'Quitar de repaso' : 'Marcar para repasar') + '</button>' +
                  '</div>';
      }
    }

    var pie = '';
    if (!soloLectura && abierta && n < 6) {
      var ok = puedeAvanzar(p, n);
      pie = '<div class="acciones">' +
            '<button class="btn" data-sig="' + n + '"' + (ok ? '' : ' disabled') + '>' + ETAPAS[n].b + '</button>' +
            (ok ? '' : '<span class="pista">' + (n === 3
                ? 'Marca los ' + p.dia.steps.length + ' pasos para continuar'
                : 'Responde las ' + p.dia.quiz.length + ' preguntas para continuar') + '</span>') +
            '</div>';
    }

    return '<section class="etapa' + (abierta ? '' : ' lista') + '" id="et-' + n + '">' +
             '<div class="etapa-n"><b>' + (n + 1) + '</b>' + esc(ETAPAS[n].r) + '</div>' +
             cuerpo + pie +
           '</section>';
  }

  function htmlDia(p, soloLectura) {
    var top = soloLectura ? 6 : etapaDe(p.id);
    var h = '<article class="dia">' +
            '<div class="dia-sup">Semana ' + p.sem.n + '<span class="sep">·</span>Día ' + p.ds + ' de 6' +
            (soloLectura && S.hecho[p.id] ? '<span class="sep">·</span>completado' : '') + '</div>' +
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
    return '<div class="deshacer">¿Marcaste el día anterior como completado por error? ' +
           '<button class="enlace" data-reabrir="' + ant.id + '">Reabrir «' + esc(ant.dia.t) + '»</button></div>';
  }

  function vistaHoy() {
    var cont = $('#vistaHoy');

    if (revisando) {
      var p = porId(revisando);
      cont.innerHTML = '<div class="acciones" style="margin:0 0 22px">' +
                       '<button class="btn plano" data-volver="1">← Volver</button></div>' +
                       '<div class="sem-cab"><span class="sem-fase">' + esc(p.sem.phase) + '</span>' +
                       '<h1>' + esc(p.sem.title) + '</h1></div>' +
                       htmlDia(p, true);
      return;
    }

    var i = posicion();

    if (i >= TOTAL) {
      cont.innerHTML = htmlReabrir(i) + '<div class="final"><div class="glifo">✦</div>' +
        '<h1>144 días. Terminaste.</h1>' +
        '<p>Veinticuatro semanas, un sistema documentado de punta a punta y dos historias que de verdad te pasaron.</p>' +
        '<p>Lo que te falta ahora no es conocimiento: son repeticiones y tráfico real. Eso empieza con el proyecto siguiente.</p>' +
        '<div class="acciones" style="justify-content:center"><button class="btn plano" data-ir="mapa">Ver todo el recorrido</button></div></div>';
      return;
    }

    var p2 = PLAN[i];
    var sem = p2.sem;
    var h = htmlReabrir(i);

    if (i === 0) {
      h += '<div class="bienvenida">' +
           '<p><b>Cómo funciona esta ruta.</b> Durante 24 semanas construyes VetCare, el software de una clínica veterinaria. ' +
           'La clínica es inventada: no hay cliente real al que preguntar, así que los datos (cuántos veterinarios, cuántas mascotas, qué problemas tienen) ' +
           'los inventas tú, de forma realista, como si los hubieras averiguado hablando con el dueño.</p>' +
           '<p><b>Antes de empezar:</b> crea en tu ordenador una carpeta llamada <code>vetcare</code> y dentro otra llamada <code>docs</code>. ' +
           'Las primeras semanas no hay código: escribes documentos de texto (<code>.md</code>) con cualquier editor, por ejemplo VS Code o el Bloc de notas.</p>' +
           '<p><b>Cada día:</b> lees la fuente, miras el ejemplo resuelto y haces lo mismo para VetCare. Al cerrar el día aparece el siguiente; no se puede adelantar.</p>' +
           '</div>';
    }

    h += '<div class="sem-cab">' +
         '<span class="sem-fase">' + esc(sem.phase) + '</span>' +
         '<h1>' + esc(sem.title) + '</h1>' +
         '<p class="sem-meta">Semana ' + sem.n + ' de ' + SEMANAS.length + '</p>' +
         '<p class="sem-idea">' + esc(sem.idea) + '</p>' +
         '<div class="tira">';

    sem.days.forEach(function (d, k) {
      var id = 'w' + sem.n + 'd' + (k + 1);
      var cls = S.hecho[id] ? 'hecho' : (id === p2.id ? 'actual' : 'bloq');
      h += '<div class="tira-d ' + cls + '" title="' + (cls === 'bloq' ? 'Aún bloqueado' : esc(d.t)) + '">' +
           (cls === 'hecho' ? '✓' : (k + 1)) + '</div>';
    });

    h += '</div></div>' + htmlDia(p2, false);
    cont.innerHTML = h;
  }

  /* ---------- vista: mapa ---------- */

  function vistaMapa() {
    var i = posicion();
    var actual = i < TOTAL ? PLAN[i] : null;
    var h = '<h1 class="tit">El recorrido</h1>' +
            '<p class="sub">' + hechos() + ' de ' + TOTAL + ' días completados. ' +
            'Las semanas cerradas se abren solas cuando llegas a ellas.</p>';

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
      var titulo = cerrada && !siguiente ? 'Contenido bloqueado' : sem.title;

      h += '<div class="' + cls + '"' + (hechosSem > 0 ? ' data-abrir="' + sem.n + '" role="button" tabindex="0" aria-expanded="' + (S.abierta === sem.n) + '"' : '') + '>' +
           '<div class="msem-n">' + (completa ? '✓' : sem.n) + '</div>' +
           '<div class="msem-cue"><strong>' + esc(titulo) + '</strong>' +
           '<span>' + (cerrada && !siguiente ? 'Semana ' + sem.n
                        : (esActual ? 'En curso · día ' + actual.ds + ' de 6'
                        : (completa ? 'Completa' : 'Semana ' + sem.n + ' · ' + hechosSem + ' de 6'))) + '</span></div>';

      if (cerrada) {
        h += '<span class="cerr">' + (siguiente ? 'A continuación' : 'Cerrada') + '</span>';
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
               '<div class="ficha-sup">Día ' + (k + 1) + '</div><strong>' + esc(d.t) + '</strong>' +
               '<a href="#" data-leer="' + id + '">Volver a leerlo →</a></div>';
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
    var h = '<h1 class="tit">Repaso</h1>' +
            '<p class="sub">Lo que marcaste como no sabido. Cada pregunta vuelve a aparecer al día siguiente, y si la aciertas, a los 3, 7 y 14 días. Así se fija de verdad.</p>';

    if (!x.fallos.length && !x.dias.length) {
      h += '<div class="vacio"><p>Nada pendiente de repaso.<br>Aparecerá aquí cuando respondas <em>No del todo</em> a una pregunta.</p></div>';
      $('#vistaRepaso').innerHTML = h;
      return;
    }

    var ya = x.fallos.filter(function (f) { return f.toca; });
    var luego = x.fallos.filter(function (f) { return !f.toca; }).sort(function (a, b) { return a.due - b.due; });

    if (ya.length) {
      h += '<div class="mfase">Para repasar hoy · ' + ya.length + '</div>';
      ya.forEach(function (f) {
        var n = S.rep[f.k] ? S.rep[f.k].n : 0;
        h += '<div class="ficha">' +
             '<div class="ficha-sup">Semana ' + f.p.sem.n + ' · día ' + f.p.ds + ' · ' + esc(f.p.dia.t) + '</div>' +
             '<strong>' + esc(f.q.q) + '</strong>' +
             '<details><summary>Ver respuesta</summary><p>' + esc(f.q.a) + '</p></details>' +
             '<div class="acciones" style="margin-top:4px">' +
             '<button class="btn plano" data-ok="' + f.k + '">Ya me la sé' +
             (n + 1 >= INTERVALOS.length ? ' (cerrarla)' : ' (vuelve en ' + INTERVALOS[n + 1] + ' días)') + '</button>' +
             '<button class="btn plano" data-otra="' + f.k + '">Todavía no (mañana)</button></div></div>';
      });
    } else if (x.fallos.length) {
      h += '<div class="vacio"><p>Hoy no te toca repasar ninguna pregunta.</p></div>';
    }

    if (luego.length) {
      h += '<div class="mfase">Más adelante · ' + luego.length + '</div>';
      luego.forEach(function (f) {
        h += '<div class="ficha ficha-luego"><div class="ficha-sup">Vuelve el ' + fecha(f.due) + ' · semana ' + f.p.sem.n + ', día ' + f.p.ds + '</div>' +
             '<strong>' + esc(f.q.q) + '</strong></div>';
      });
    }

    if (x.dias.length) {
      h += '<div class="mfase">Días marcados para releer · ' + x.dias.length + '</div>';
      x.dias.forEach(function (p) {
        h += '<div class="ficha">' +
             '<div class="ficha-sup">Semana ' + p.sem.n + ' · día ' + p.ds + '</div>' +
             '<strong>' + esc(p.dia.t) + '</strong>' +
             '<p>' + esc(p.dia.out) + '</p>' +
             '<div class="acciones" style="margin-top:4px">' +
             '<button class="btn plano" data-leer="' + p.id + '">Volver a leerlo</button>' +
             '<button class="btn plano" data-desrepasar="' + p.id + '">Quitar</button></div></div>';
      });
    }

    $('#vistaRepaso').innerHTML = h;
  }

  /* ---------- vista: notas ---------- */

  function vistaNotas() {
    var con = PLAN.filter(function (p) { return (S.nota[p.id] || '').trim(); });
    var h = '<h1 class="tit">Mis notas</h1>' +
            '<p class="sub">' + con.length + (con.length === 1 ? ' nota escrita' : ' notas escritas') +
            '. Lo que escribiste con tus palabras es lo que de verdad recordarás.</p>';

    if (!con.length) {
      h += '<div class="vacio"><p>Todavía no has escrito ninguna nota.<br>' +
           'En el cierre de cada día tienes un espacio para hacerlo.</p></div>';
    } else {
      con.slice().reverse().forEach(function (p) {
        h += '<div class="ficha">' +
             '<div class="ficha-sup">Semana ' + p.sem.n + ' · día ' + p.ds + ' · ' + esc(p.sem.phase) + '</div>' +
             '<strong>' + esc(p.dia.t) + '</strong>' +
             '<p>' + esc(S.nota[p.id]) + '</p>' +
             '<a href="#" data-leer="' + p.id + '">Ver el día →</a></div>';
      });
    }
    $('#vistaNotas').innerHTML = h;
  }

  /* ---------- render ---------- */

  var vistaActual = 'hoy';

  function render() {
    document.documentElement.className = temaOscuro() ? 'oscuro' : '';

    var n = hechos();
    $('#avanceFill').style.width = (TOTAL ? (n / TOTAL * 100) : 0) + '%';
    $('#avanceTxt').textContent = n >= TOTAL ? 'Completado' : 'Día ' + (n + 1) + ' de ' + TOTAL;

    var pend = pendientes();
    var cnt = pend.fallos.filter(function (f) { return f.toca; }).length + pend.dias.length;
    $('#pillRepaso').textContent = cnt ? String(cnt) : '';

    vistaHoy(); vistaMapa(); vistaRepaso(); vistaNotas();

    ['hoy', 'mapa', 'repaso', 'notas'].forEach(function (v) {
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
      if (d.v === 'no') { S.rep[d.j] = { n: 0, due: enDias(1) }; avisar('Guardada en Repaso: vuelve mañana'); }
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
      var quedan = SEMANAS.length - pc.sem.n;
      if (pc.ds === 6) avisar('Semana ' + pc.sem.n + ' completa. ' +
        (quedan === 0 ? 'Era la última.' : quedan === 1 ? 'Queda una.' : quedan + ' por delante.'));
      else avisar(ANIMOS[(hechos() - 1) % ANIMOS.length]);
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
        avisar('Pregunta cerrada. Ya es tuya.');
      } else {
        S.rep[d.ok] = { n: r.n + 1, due: enDias(INTERVALOS[r.n + 1]) };
        avisar('Bien. Vuelve en ' + INTERVALOS[r.n + 1] + ' días.');
      }
      guardar(); render(); return;
    }
    if (d.otra) { S.rep[d.otra] = { n: 0, due: enDias(1) }; avisar('Vuelve mañana'); guardar(); render(); return; }
    if (d.cambiar) { delete S.quiz[d.cambiar]; delete S.rep[d.cambiar]; guardar(); render(); return; }
    if (d.reabrir) {
      var pr = porId(d.reabrir);
      if (!pr || !confirm('Se reabre «' + pr.dia.t + '» y vuelve a ser tu día actual. Tus pasos, respuestas y notas se conservan.\n\n¿Continuar?')) return;
      delete S.hecho[d.reabrir];
      guardar(); render(); window.scrollTo({ top: 0 });
      avisar('Día reabierto');
      return;
    }
  });

  document.addEventListener('input', function (e) {
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
    avisar('Copia guardada');
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
        guardar(); render();
        avisar('Progreso restaurado');
      } catch (err) { avisar('Ese archivo no es una copia válida'); }
      e.target.value = '';
      $('#menu').classList.remove('abierto');
    };
    r.readAsText(f);
  });

  $('#btnReset').addEventListener('click', function () {
    $('#menu').classList.remove('abierto');
    if (!confirm('Esto borra tu progreso, tus notas y tu repaso. No se puede deshacer.\n\n¿Continuar?')) return;
    try { localStorage.removeItem(CLAVE); } catch (err) { /* navegador sin almacenamiento */ }
    S = cargar();
    render();
    avisar('Empezamos de cero');
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

  if (!TOTAL) {
    $('#vistaHoy').innerHTML = '<div class="vacio"><p>No se cargó el contenido del curso.<br>' +
      'Revisa que la carpeta <strong>contenido/</strong> esté junto a este archivo.</p></div>';
  } else {
    render();
  }
})();
