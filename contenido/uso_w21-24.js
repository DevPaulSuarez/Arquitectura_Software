/* Para qué sirve cada día en un trabajo real, por qué importa
   y qué preguntar (al cliente, al equipo o al tech lead) para aplicarlo.
   Clave: w<semana>d<día>. */
window.USO = Object.assign(window.USO || {}, {

/* ---------- Semana 21 · Rendimiento ---------- */

'w21d1': {
  sirve: 'Escribir objetivos de rendimiento con percentiles ("el 95 % de las peticiones de agenda en menos de 300 ms") da una meta medible que todo el equipo entiende.',
  importa: 'El promedio esconde a los usuarios que sufren: una media de 200 ms puede incluir un 5 % de peticiones de 5 segundos. Sin objetivos en percentiles, se optimiza lo que no importa y se ignora lo que duele.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Qué acción haces más veces al día y cuánto toleras esperar en ella?', obt: 'Las operaciones críticas y su límite de espera, para convertirlos en objetivos.' },
    { a: 'Al tech lead', q: '¿Medimos percentiles o solo promedios en producción?', obt: 'Si los datos actuales sirven para comparar con el objetivo.' },
    { a: 'Al dueño de la clínica', q: '¿En qué horas hay más carga: primera hora, mediodía?', obt: 'Los picos en los que deben cumplirse los objetivos.' }
  ],
  evita: { q: '¿La API tiene que ser rápida, no?', por: 'No se puede medir. Pregunta qué operación, qué percentil y en qué tiempo.' }
},

'w21d2': {
  sirve: 'Instrumentar la API y generar carga con herramientas como k6 o bombardier muestra cuánto tarda cada petición y en qué parte se va el tiempo.',
  importa: 'Optimizar sin medir es adivinar, y la intuición falla casi siempre: el tiempo suele estar en un sitio que nadie sospechaba. Medir primero evita semanas de trabajo en la parte equivocada.',
  preguntas: [
    { a: 'Al equipo de infraestructura', q: '¿Tenemos un entorno parecido a producción donde lanzar pruebas de carga?', obt: 'Dónde medir sin afectar a usuarios reales.' },
    { a: 'Al tech lead', q: '¿Cuántos usuarios simultáneos esperamos en el pico?', obt: 'El nivel de carga que debe simular la prueba.' },
    { a: 'Al DBA', q: '¿La base de pruebas tiene un volumen de datos parecido a la real?', obt: 'Si los resultados serán representativos.' }
  ],
  evita: { q: '¿Hago una prueba de carga con un millón de usuarios?', por: 'Si no es tu realidad, mides lo que no importa. Pregunta cuál es la carga realista del pico.' }
},

'w21d3': {
  sirve: 'Encontrar las consultas lentas reales (con pg_stat_statements) y arreglarlas con EXPLAIN ANALYZE es la optimización con mejor retorno en casi cualquier aplicación.',
  importa: 'En la mayoría de aplicaciones de negocio, el cuello de botella está en la base de datos. Una sola consulta mal indexada que se ejecuta miles de veces al día puede ser la mitad del tiempo total de la API.',
  preguntas: [
    { a: 'Al DBA', q: '¿Qué consultas acumulan más tiempo total, no solo las más lentas una a una?', obt: 'Las consultas con más impacto: una de 10 ms que corre un millón de veces pesa más que una de 2 segundos al día.' },
    { a: 'Al tech lead', q: '¿Está activado pg_stat_statements en producción?', obt: 'Si hay datos reales de consultas para analizar.' },
    { a: 'A un compañero', q: '¿Qué pantalla lanza esta consulta y con qué frecuencia?', obt: 'El origen de la consulta en el código para arreglarla.' }
  ],
  evita: { q: '¿Añado índices hasta que vaya rápido?', por: 'Cada índice frena las escrituras. Pregunta qué dice el plan de ejecución de la consulta lenta.' }
},

'w21d4': {
  sirve: 'Cachear guarda resultados costosos para no repetirlos. En el trabajo se usa para datos que se leen mucho y cambian poco, como el catálogo de vacunas o los horarios de la clínica.',
  importa: 'La cache es la optimización que más bugs introduce: datos viejos, invalidaciones olvidadas, usuarios que ven información de otros. Cachear sin criterio cambia un problema de rendimiento por uno de corrección, que es peor.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Cada cuánto cambian los precios y los horarios? ¿Pasa algo si se ven con unos minutos de retraso?', obt: 'Cuánto tiempo puede durar la cache sin causar problemas.' },
    { a: 'Al tech lead', q: '¿Qué datos son por usuario y nunca deben compartirse en una cache común?', obt: 'Límites para no mezclar datos de usuarios distintos.' },
    { a: 'En una revisión de código', q: '¿Qué invalida esta cache cuando cambia el dato?', obt: 'Confirmar que hay invalidación y no solo caducidad.' }
  ],
  evita: { q: '¿Cacheo todas las respuestas de la API?', por: 'Mostrarás datos viejos y quizás ajenos. Pregunta qué datos se leen mucho, cambian poco y son iguales para todos.' }
},

'w21d5': {
  sirve: 'Las métricas del navegador (LCP, INP, CLS) miden lo que el usuario percibe: cuándo ve el contenido, cuánto tarda en responder un clic, si la página salta.',
  importa: 'Una API rápida no sirve si el navegador tarda 4 segundos en descargar un JavaScript enorme. Google usa estas métricas en sus resultados y los usuarios las sienten aunque no sepan su nombre.',
  preguntas: [
    { a: 'Al tech lead de frontend', q: '¿Cuánto pesa el bundle de JavaScript y qué librería pesa más?', obt: 'Dónde recortar para que la app cargue antes.' },
    { a: 'A la recepcionista', q: '¿Usas la app en un ordenador antiguo o con mala conexión?', obt: 'Las condiciones reales en las que hay que medir.' },
    { a: 'Al diseñador', q: '¿Hay elementos que aparecen tarde y empujan el contenido?', obt: 'Causas de saltos visuales (CLS) que molestan al usuario.' }
  ],
  evita: { q: '¿Paso Lighthouse y si sale verde está bien?', por: 'Lighthouse simula una máquina concreta. Pregunta cómo es la experiencia en los equipos reales de la clínica.' }
},

'w21d6': {
  sirve: 'Un informe de optimización con mediciones antes y después demuestra el valor del trabajo con datos. Es lo que convence a un jefe de invertir más tiempo o lo que impresiona en una entrevista.',
  importa: '"Lo hice más rápido" no convence a nadie. "Bajé el p95 de la agenda de 1.200 ms a 180 ms con un índice compuesto" sí. Los datos convierten una opinión en un logro defendible.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué formato de informe le sirve a la dirección para entender el impacto?', obt: 'El nivel de detalle técnico adecuado para cada público.' },
    { a: 'Al dueño de la clínica', q: '¿Has notado alguna diferencia en la velocidad estas semanas?', obt: 'La percepción del usuario, que complementa los números.' },
    { a: 'Al tech lead', q: '¿Qué objetivo quedó sin cumplir y vale la pena seguir?', obt: 'Los siguientes pasos priorizados.' }
  ],
  evita: { q: '¿Pongo todas las gráficas que tengo?', por: 'Demasiados datos esconden el mensaje. Pregunta qué decisión debe tomar quien lee el informe.' }
},

/* ---------- Semana 22 · Observabilidad ---------- */

'w22d1': {
  sirve: 'Los logs estructurados (con campos como citaId, usuarioId, traceId) permiten buscar y filtrar en vez de leer texto. Con un id de correlación reconstruyes todo lo que pasó en una petición.',
  importa: 'Cuando algo falla a las 3 de la mañana, buscar en millones de líneas de texto libre es imposible. Con logs estructurados, encuentras todas las líneas de esa petición en segundos.',
  preguntas: [
    { a: 'Al equipo de infraestructura', q: '¿A qué herramienta se envían los logs y qué campos indexa?', obt: 'Dónde y cómo se consultan los logs en producción.' },
    { a: 'Al tech lead', q: '¿Qué campos deben aparecer siempre en cada línea de log?', obt: 'El estándar mínimo de campos del equipo.' },
    { a: 'A soporte', q: 'Cuando un usuario reporta un error, ¿qué dato nos da para buscarlo?', obt: 'Si hace falta mostrar un id de correlación al usuario para que lo comparta.' }
  ],
  evita: { q: '¿Pongo logs en todos los métodos?', por: 'Mucho ruido y mucho coste. Pregunta qué preguntas necesitas poder responder cuando algo falle.' }
},

'w22d2': {
  sirve: 'Las métricas de latencia, tráfico, errores y saturación (las cuatro señales doradas de Google) resumen la salud del sistema en cuatro gráficas.',
  importa: 'Medir causas (CPU alta) genera alertas que no siempre afectan al usuario. Medir síntomas (errores, latencia) te avisa justo cuando el usuario sufre. Es la diferencia entre un equipo que vive en alerta y uno que duerme.',
  preguntas: [
    { a: 'Al equipo de infraestructura', q: '¿Qué sistema de métricas usamos: Prometheus, Azure Monitor, otro?', obt: 'La herramienta y cómo exponer métricas desde la API.' },
    { a: 'Al tech lead', q: '¿Qué endpoint, si falla, afecta más al negocio?', obt: 'Dónde poner primero las métricas detalladas.' },
    { a: 'Al dueño de la clínica', q: '¿Qué número te diría de un vistazo que hoy el sistema va bien?', obt: 'Una métrica de negocio (citas creadas por hora) que complementa a las técnicas.' }
  ],
  evita: { q: '¿Mido el uso de CPU y memoria?', por: 'Son causas, no síntomas. Pregunta qué nota el usuario cuando el sistema va mal.' }
},

'w22d3': {
  sirve: 'Las trazas distribuidas con OpenTelemetry muestran una petición dividida en tramos (API, base de datos, SMS) con el tiempo de cada uno, para localizar dónde se va el tiempo.',
  importa: 'Cuando una petición pasa por varios servicios, los logs de cada uno no cuentan la historia completa. La traza sí, y convierte una investigación de horas en un vistazo.',
  preguntas: [
    { a: 'Al equipo de infraestructura', q: '¿A dónde enviamos las trazas y qué porcentaje muestreamos?', obt: 'El destino y la política de muestreo para no disparar costes.' },
    { a: 'Al tech lead', q: '¿Las llamadas a servicios externos propagan el contexto de traza?', obt: 'Si la traza está completa o se corta en algún punto.' },
    { a: 'A un compañero', q: '¿Qué operación de negocio merece su propio tramo con nombre?', obt: 'Tramos personalizados que hacen la traza legible.' }
  ],
  evita: { q: '¿Guardo el 100 % de las trazas?', por: 'En producción es carísimo. Pregunta qué muestreo da suficiente información sin disparar el coste.' }
},

'w22d4': {
  sirve: 'Un SLO es una promesa medible ("el 99,5 % de las peticiones de agenda funcionan bien en 30 días"). El presupuesto de error es cuánto puedes fallar, y las alertas se disparan cuando se consume demasiado rápido.',
  importa: 'Las alertas por umbrales fijos suenan a todas horas por picos sin importancia, y el equipo acaba ignorándolas. Las alertas por consumo de presupuesto solo suenan cuando de verdad se está rompiendo la promesa.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Cuántas veces al mes puede fallar dar una cita antes de que sea un problema para ti?', obt: 'La base de negocio para fijar el SLO.' },
    { a: 'Al tech lead', q: '¿Qué hacemos cuando se agota el presupuesto de error: frenamos funcionalidades?', obt: 'La política del equipo, que es lo que da sentido al SLO.' },
    { a: 'Al equipo de guardia', q: '¿Qué alertas os despiertan sin que haya nada que hacer?', obt: 'Alertas ruidosas que hay que convertir o eliminar.' }
  ],
  evita: { q: '¿Ponemos un SLO del 100 %?', por: 'Es imposible y paraliza al equipo. Pregunta cuánto fallo tolera el negocio sin daño real.' }
},

'w22d5': {
  sirve: 'Un panel bien ordenado responde preguntas en secuencia (¿está roto? ¿desde cuándo? ¿dónde?) y un manual de guardia dice qué hacer paso a paso en cada incidencia probable.',
  importa: 'En mitad de un incidente nadie piensa con claridad. Un manual escrito con calma permite que cualquiera del equipo resuelva el problema, no solo quien construyó el sistema.',
  preguntas: [
    { a: 'Al equipo de guardia', q: '¿Qué miras primero cuando suena una alerta?', obt: 'El orden real de diagnóstico, que define el orden del panel.' },
    { a: 'Al tech lead', q: '¿Cuáles han sido las dos incidencias más frecuentes del último año?', obt: 'Las que merecen un manual de guardia primero.' },
    { a: 'A un compañero', q: 'Sigue este manual sin mi ayuda. ¿En qué paso te quedaste dudando?', obt: 'Pasos ambiguos que hay que reescribir.' }
  ],
  evita: { q: '¿Pongo todas las métricas en un panel?', por: 'Un panel con 40 gráficas no responde nada. Pregunta qué preguntas hay que responder durante un incidente y en qué orden.' }
},

'w22d6': {
  sirve: 'Simular un incidente, diagnosticarlo solo con tus herramientas y escribir el postmortem es exactamente lo que harás en un equipo real después de cada caída importante.',
  importa: 'El postmortem sin culpables es la herramienta con la que los equipos maduros aprenden de los errores. Si las herramientas de observabilidad no bastan para diagnosticar el incidente simulado, tampoco bastarán con uno real.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué formato de postmortem usamos y quién lo revisa?', obt: 'La plantilla y el proceso del equipo.' },
    { a: 'Al equipo de guardia', q: '¿Qué te habría ayudado a detectar esto antes?', obt: 'Acciones concretas de mejora en alertas y paneles.' },
    { a: 'Al dueño de la clínica', q: '¿Cómo te enteraste del problema y qué hiciste mientras tanto?', obt: 'El impacto real en el negocio y cómo comunicarse mejor la próxima vez.' }
  ],
  evita: { q: '¿Quién tuvo la culpa?', por: 'Buscar culpables hace que la gente esconda errores. Pregunta qué permitió que el error llegara a producción y cómo evitarlo.' }
},

/* ---------- Semana 23 · Diseño de sistemas I ---------- */

'w23d1': {
  sirve: 'Aclarar requisitos antes de diseñar (usuarios, volumen, operaciones principales, restricciones) es el primer paso de cualquier entrevista de diseño de sistemas y de cualquier proyecto grande.',
  importa: 'En las entrevistas de diseño, lanzarse a dibujar sin preguntar es el error que más suspensos provoca. En el trabajo, es lo que lleva a construir un sistema para un millón de usuarios cuando había mil.',
  preguntas: [
    { a: 'Al entrevistador o al cliente', q: '¿Cuántos usuarios activos al día y cuál es la operación más frecuente?', obt: 'La escala y el camino crítico que guían todo el diseño.' },
    { a: 'Al entrevistador o al cliente', q: '¿Qué es más importante aquí: que los datos estén siempre al día o que el sistema nunca deje de responder?', obt: 'La prioridad entre consistencia y disponibilidad.' },
    { a: 'Al entrevistador o al cliente', q: '¿Qué queda fuera del alcance de este diseño?', obt: 'Los límites para no gastar el tiempo en partes que no se evalúan.' }
  ],
  evita: { q: '¿Uso microservicios y Kafka?', por: 'Elegir piezas antes de conocer los requisitos es justo lo que el entrevistador quiere ver si evitas. Pregunta primero por la escala y las operaciones.' }
},

'w23d2': {
  sirve: 'Estimar tráfico, almacenamiento y ancho de banda con cuentas rápidas (peticiones por segundo, GB al año) te dice si necesitas un servidor o cien antes de diseñar nada.',
  importa: 'Sin estimaciones, cualquier diseño parece razonable. Con ellas descubres que VetCare a escala nacional cabe en una base de datos bien indexada, o que necesita particiones. Es lo que separa una opinión de un argumento.',
  preguntas: [
    { a: 'Al entrevistador o al cliente', q: '¿Cuántas clínicas, cuántas citas por clínica al día y cuántos años de historial?', obt: 'Los números de entrada para calcular volumen y almacenamiento.' },
    { a: 'Al equipo de infraestructura', q: '¿Cuántas peticiones por segundo aguanta hoy uno de nuestros servidores?', obt: 'Una referencia real para convertir tráfico en número de máquinas.' },
    { a: 'Al tech lead', q: '¿La proporción entre lecturas y escrituras se parece a 10 a 1 o es otra?', obt: 'El ratio que decide si invertir en caches y réplicas de lectura.' }
  ],
  evita: { q: '¿Cuántos servidores necesito?', por: 'Sin datos de entrada no hay respuesta. Pregunta por usuarios, operaciones y tamaño de los datos, y haz la cuenta.' }
},

'w23d3': {
  sirve: 'Escalar en vertical (máquina más grande) o en horizontal (más máquinas) depende de cada capa. Sacar el estado del servidor es lo que permite añadir máquinas detrás de un balanceador.',
  importa: 'Si la API guarda sesiones en memoria, añadir un segundo servidor rompe los logins. Entender qué estado estorba es la clave de escalar, y es una pregunta fija en entrevistas.',
  preguntas: [
    { a: 'Al tech lead', q: '¿La API guarda algo en memoria entre peticiones: sesiones, caches, archivos?', obt: 'El estado que impide escalar horizontalmente.' },
    { a: 'Al equipo de infraestructura', q: '¿Cuál es el siguiente tamaño de máquina disponible y cuánto cuesta?', obt: 'Si escalar en vertical sigue siendo la opción más simple y barata.' },
    { a: 'Al DBA', q: '¿La base de datos es hoy el límite o aún tiene margen?', obt: 'Qué capa escalar primero.' }
  ],
  evita: { q: '¿Ponemos más servidores?', por: 'Si el cuello está en la base o hay estado en memoria, no ayuda. Pregunta dónde está el límite actual.' }
},

'w23d4': {
  sirve: 'CAP dice que, ante una partición de red, hay que elegir entre consistencia y disponibilidad. En la práctica, decides por cada dato cuánta consistencia necesita.',
  importa: 'No todos los datos necesitan lo mismo: una cita debe ser consistente (no dos personas en el mismo hueco), pero un contador de visitas puede ir con retraso. Elegir bien da sistemas rápidos y correctos a la vez.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Si dos recepcionistas ven la agenda con un minuto de retraso, ¿pasa algo grave?', obt: 'Qué datos toleran consistencia eventual y cuáles no.' },
    { a: 'Al arquitecto', q: '¿Dónde usamos réplicas de lectura que pueden ir con retraso?', obt: 'Los sitios donde ya hay consistencia eventual sin que todos lo sepan.' },
    { a: 'Al entrevistador', q: 'En este sistema, ¿qué prefieres en caso de fallo de red: rechazar la operación o aceptarla y reconciliar después?', obt: 'La elección CP o AP según el caso de uso.' }
  ],
  evita: { q: '¿Nuestro sistema es CP o AP?', por: 'Cada dato puede ser distinto. Pregunta qué pasa con cada operación concreta si la red se parte.' }
},

'w23d5': {
  sirve: 'Conocer las piezas típicas (balanceador, cache, cola, CDN, réplicas, almacenamiento de objetos) y sobre todo cuándo no usarlas es lo que hace un diseño sensato.',
  importa: 'Cada pieza nueva es algo más que puede fallar, que hay que monitorizar y pagar. Añadir una cola o una cache "por si acaso" complica el sistema sin beneficio. Saber decir "aquí no hace falta" es señal de madurez.',
  preguntas: [
    { a: 'Al arquitecto', q: '¿Qué problema concreto resuelve esta cola que no resuelva una tabla en la base?', obt: 'Justificación real de la pieza o la decisión de no añadirla.' },
    { a: 'Al equipo de infraestructura', q: '¿Cuánto cuesta mantener esta pieza en producción, en dinero y en guardias?', obt: 'El coste operativo, que casi nunca aparece en el diagrama.' },
    { a: 'Al entrevistador', q: '¿Qué volumen de archivos adjuntos esperamos? ¿Hace falta almacenamiento de objetos?', obt: 'Si la pieza está justificada por los datos o no.' }
  ],
  evita: { q: '¿Qué tecnologías debería poner en el diagrama?', por: 'El diagrama no es un catálogo. Pregunta qué problema tiene cada parte del sistema y añade solo lo que lo resuelve.' }
},

'w23d6': {
  sirve: 'Ejecutar una entrevista de diseño completa en voz alta y con tiempo es la mejor preparación para las entrevistas de nivel medio y senior.',
  importa: 'Saber las piezas no basta: hay que ordenarlas en 45 minutos, explicar cada decisión y reaccionar a preguntas. Practicarlo en voz alta es lo único que lo convierte en una habilidad.',
  preguntas: [
    { a: 'A un compañero que haga de entrevistador', q: '¿En qué momento te perdiste siguiendo mi explicación?', obt: 'Partes poco claras de tu discurso.' },
    { a: 'A un compañero que haga de entrevistador', q: '¿Hice suficientes preguntas al principio o me lancé demasiado rápido?', obt: 'Una valoración de la fase de aclaración, la que más se suspende.' },
    { a: 'Al tech lead', q: '¿Qué parte de este diseño atacarías en una entrevista?', obt: 'Las preguntas difíciles que debes llevar preparadas.' }
  ],
  evita: { q: '¿Me salió bien?', por: 'Respuesta inútil. Pide feedback concreto: qué parte faltó, dónde dudaste, qué decisión no justificaste.' }
},

/* ---------- Semana 24 · Diseño de sistemas II y cierre ---------- */

'w24d1': {
  sirve: 'Aplicar el método a un dominio que no conoces (reservas de hotel, envío de comida) demuestra que sabes diseñar, no que memorizaste VetCare.',
  importa: 'En entrevistas casi nunca te piden diseñar tu propio proyecto. Si el método solo funciona con VetCare, no es un método. Transferirlo a otro dominio es la prueba de que es tuyo.',
  preguntas: [
    { a: 'Al entrevistador', q: '¿Quiénes son los usuarios principales y qué operación hacen más veces?', obt: 'El punto de partida en un dominio nuevo, igual que con VetCare.' },
    { a: 'Al entrevistador', q: '¿Hay algún requisito especial de este dominio: pagos, tiempo real, ubicación?', obt: 'Lo que hace distinto a este sistema y merece atención especial.' },
    { a: 'Al entrevistador', q: '¿Quieres que profundice en alguna parte concreta?', obt: 'Dónde poner el tiempo que queda según lo que valora el entrevistador.' }
  ],
  evita: { q: '¿Lo hago parecido a VetCare?', por: 'Cada dominio tiene sus propias necesidades. Aplica las mismas preguntas y deja que las respuestas cambien el diseño.' }
},

'w24d2': {
  sirve: 'Evolucionar una API sin romper a los clientes (añadir campos opcionales, no quitar ni renombrar, versionar solo cuando no hay otra) es tarea diaria en cualquier API con usuarios.',
  importa: 'Romper un contrato deja a las apps móviles instaladas sin funcionar hasta que el usuario actualice. Un cambio incompatible puede costar más que toda la funcionalidad nueva que querías añadir.',
  preguntas: [
    { a: 'Al equipo de frontend o móvil', q: '¿Qué versiones de la app siguen en uso y usan este endpoint?', obt: 'Quién se rompería con el cambio.' },
    { a: 'Al tech lead', q: '¿Cuál es nuestra política de deprecación y con cuánto tiempo se avisa?', obt: 'El proceso para retirar algo sin sorprender a nadie.' },
    { a: 'En una revisión de código', q: '¿Este cambio rompe algún cliente que funciona hoy?', obt: 'Detectar cambios incompatibles antes de publicarlos.' }
  ],
  evita: { q: '¿Saco una v2 para este cambio?', por: 'Mantener dos versiones es caro. Pregunta si el cambio se puede hacer de forma compatible antes de versionar.' }
},

'w24d3': {
  sirve: 'Probar que puedes restaurar una copia de seguridad, y decidir cuánto tiempo guardas cada dato, es lo que protege a la clínica de un desastre y de problemas legales.',
  importa: 'Una copia que nunca se ha restaurado no es una copia, es una esperanza. Muchas empresas descubren que sus copias no sirven el día que las necesitan. Además, las leyes de protección de datos obligan a poder borrar datos personales cuando se pide.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Si perdemos datos, ¿cuántas horas de trabajo puedes permitirte perder como máximo?', obt: 'El RPO (pérdida máxima de datos aceptable), que define cada cuánto copiar.' },
    { a: 'Al dueño de la clínica', q: '¿Cuánto tiempo puede estar el sistema parado tras un desastre?', obt: 'El RTO (tiempo máximo de recuperación), que define cómo restaurar.' },
    { a: 'Al responsable de privacidad', q: '¿Cuánto tiempo debemos guardar historiales médicos y qué hacemos si un dueño pide su borrado?', obt: 'Plazos de retención y procedimiento de borrado conforme a la ley.' }
  ],
  evita: { q: '¿Tenemos copias de seguridad?', por: 'Un sí no garantiza nada. Pregunta cuándo fue la última vez que se restauró una y cuánto tardó.' }
},

'w24d4': {
  sirve: 'Un repositorio que se entiende en cinco minutos (README claro, decisiones documentadas, cómo ejecutarlo) es tu mejor carta de presentación ante un reclutador o un equipo técnico.',
  importa: 'Los reclutadores técnicos dedican pocos minutos a cada repositorio. Si no entienden qué hiciste y por qué, el trabajo de 24 semanas no cuenta. La presentación es parte del trabajo, no un adorno.',
  preguntas: [
    { a: 'A alguien que no conozca el proyecto', q: 'Mira el repositorio cinco minutos y dime qué crees que sé hacer.', obt: 'Si el repositorio comunica lo que quieres, visto con ojos ajenos.' },
    { a: 'A un reclutador o mentor', q: '¿Qué buscas primero cuando abres el repositorio de un candidato?', obt: 'Qué destacar arriba del README.' },
    { a: 'A un desarrollador senior', q: '¿Qué decisión de este proyecto te parece más interesante para hablar en una entrevista?', obt: 'Los temas fuertes que debes preparar.' }
  ],
  evita: { q: '¿Está bonito el README?', por: 'La estética importa poco. Pregunta si alguien entiende en cinco minutos qué problema resuelve y qué decisiones tomaste.' }
},

'w24d5': {
  sirve: 'Ensayar en voz alta las respuestas técnicas, adaptadas a quien pregunta y al tiempo disponible, convierte lo que sabes en lo que puedes demostrar en una entrevista.',
  importa: 'Saber algo y explicarlo bajo presión son habilidades distintas. Muchos candidatos que saben suspenden por no poder ordenar la respuesta en dos minutos. El ensayo es lo que cierra esa brecha.',
  preguntas: [
    { a: 'A un compañero que haga de entrevistador', q: 'Pregúntame por qué elegí PostgreSQL y córtame a los dos minutos.', obt: 'Práctica de respuestas concisas con límite de tiempo.' },
    { a: 'A un compañero que haga de entrevistador', q: 'Hazme una pregunta de seguimiento difícil sobre lo que acabo de decir.', obt: 'Entrenamiento para las repreguntas, que es donde se nota quién entiende de verdad.' },
    { a: 'A alguien no técnico', q: '¿Entendiste qué hace VetCare y por qué es útil?', obt: 'Prueba de que sabes explicarlo a un reclutador o a un jefe no técnico.' }
  ],
  evita: { q: '¿Qué me van a preguntar en la entrevista?', por: 'Nadie lo sabe exactamente. Pregunta qué tipo de preguntas suelen hacer y practica respondiendo, no memorizando.' }
},

'w24d6': {
  sirve: 'Cerrar con un diseño cronometrado, una auditoría del repositorio y un plan de estudio para los próximos seis meses es lo que convierte la ruta en un punto de partida, no en un final.',
  importa: 'Lo que no se practica se olvida. Un plan concreto de qué estudiar después, basado en tus puntos débiles reales, es lo que mantiene el crecimiento cuando ya no hay una ruta marcada.',
  preguntas: [
    { a: 'A un desarrollador senior o mentor', q: 'Viendo mi trabajo, ¿qué tema me haría falta para el siguiente nivel?', obt: 'Una prioridad de estudio basada en la opinión de alguien con experiencia.' },
    { a: 'A un tech lead de una empresa que te interese', q: '¿Qué tecnologías y prácticas usa vuestro equipo en el día a día?', obt: 'Qué estudiar para acercarte al puesto que quieres.' },
    { a: 'A ti mismo, con tus notas y el Repaso', q: '¿Qué preguntas he fallado más veces durante las 24 semanas?', obt: 'Tus puntos débiles reales, que deben encabezar el plan.' }
  ],
  evita: { q: '¿Qué debería aprender ahora?', por: 'Sin contexto, te recomendarán lo que está de moda. Pregunta qué te falta para el puesto concreto que buscas.' }
}

});
