/* Para qué sirve cada día en un trabajo real, por qué importa
   y qué preguntar (al cliente, al equipo o al tech lead) para aplicarlo.
   Clave: w<semana>d<día>. */
window.USO = Object.assign(window.USO || {}, {

/* ---------- Semana 1 · Entender el problema ---------- */

'w1d1': {
  sirve: 'Es lo primero que haces cuando te asignan un proyecto nuevo o una funcionalidad grande: antes de abrir el editor, aclaras qué dolor concreto hay que quitar. También es lo que dices en la primera reunión con el cliente y en la primera línea del README.',
  importa: 'Los proyectos más caros del mundo no fracasan por código lento, fracasan porque resolvieron el problema equivocado. Una semana programando lo que nadie necesitaba se tira entera; diez minutos preguntando bien lo evitan.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué pasó la última vez que algo salió mal con las citas? Cuéntame ese día.', obt: 'Un caso real con números: "el martes vinieron dos perros a la misma hora y uno esperó 40 minutos". De ahí sale el problema de verdad, no la idea de solución que traía.' },
    { a: 'Al dueño de la clínica', q: 'Si dentro de seis meses esto funciona, ¿qué habrá cambiado que puedas ver o contar?', obt: 'La medida de éxito: "menos de 3 citas perdidas al mes" o "la recepcionista ya no busca fichas en el cuaderno". Sin esto no sabrás cuándo terminaste.' },
    { a: 'Al dueño de la clínica', q: '¿Qué cosas NO quieres que haga el sistema, aunque parezcan útiles?', obt: 'Los no-objetivos: "la facturación la sigo haciendo en la caja". Te protegen de que el alcance crezca solo.' }
  ],
  evita: { q: '¿Quieres una app web o una app móvil?', por: 'Pregunta por la solución antes de conocer el problema y obliga al cliente a decidir algo técnico que no sabe decidir. Primero el dolor, después la herramienta.' }
},

'w1d2': {
  sirve: 'En cualquier empresa, antes de diseñar, haces el mapa de quién usa, quién paga y quién puede vetar. Sirve para saber a quién invitar a cada reunión y a quién enseñarle la demo antes de entregar.',
  importa: 'Un sistema puede funcionar perfecto y aun así ser rechazado porque ignoraste a la persona que lo usa ocho horas al día, o a la que firma el cheque. Detectar los conflictos entre stakeholders al principio cuesta una conversación; detectarlos en producción cuesta el proyecto.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Quién más, además de ti, va a tocar el sistema o se va a ver afectado por él?', obt: 'La lista completa: veterinarios, recepcionista, dueños de mascotas, quizá un contador. Suele salir alguien que no tenías en mente.' },
    { a: 'Al dueño de la clínica', q: '¿Quién decide al final si esto se usa o se tira?', obt: 'El stakeholder con poder de veto. A esa persona le enseñas avances cada semana.' },
    { a: 'A la recepcionista', q: '¿Qué es lo que más miedo te da de cambiar el cuaderno por un sistema?', obt: 'Sus temores reales ("que se caiga internet y no pueda dar citas"). Se convierten en requisitos no funcionales o en un plan de respaldo.' }
  ],
  evita: { q: '¿Todos están de acuerdo con el proyecto, verdad?', por: 'Es una pregunta inducida: casi siempre te dirán que sí. Mejor pregunta a cada persona por separado qué quiere y qué teme, y busca tú las contradicciones.' }
},

'w1d3': {
  sirve: 'Los requisitos funcionales son la lista de lo que el sistema debe hacer. Es lo que el equipo convierte en tareas, lo que QA usa para probar y lo que el cliente revisa para decir "esto sí lo pedí".',
  importa: 'Un requisito vago como "gestionar citas" se entiende distinto en cada cabeza, y esa diferencia aparece el día de la entrega como "esto no es lo que pedí". Un requisito verificable deja claro cuándo está terminado y evita discusiones.',
  preguntas: [
    { a: 'A la recepcionista', q: 'Enséñame paso a paso cómo das una cita hoy, desde que suena el teléfono hasta que cuelgas.', obt: 'El flujo real con sus pasos y datos: nombre del dueño, mascota, motivo, veterinario, hora. Cada paso es candidato a requisito funcional.' },
    { a: 'Al veterinario', q: '¿Qué información necesitas ver de una mascota justo antes de que entre a consulta?', obt: 'Los datos imprescindibles (alergias, última vacuna, peso) y en qué orden. Te dice qué debe mostrar la ficha.' },
    { a: 'Al tech lead', q: '¿Cómo vamos a comprobar este requisito? ¿Qué prueba lo daría por cumplido?', obt: 'Un criterio verificable. Si nadie sabe cómo probarlo, el requisito está mal escrito y hay que concretarlo.' }
  ],
  evita: { q: '¿Qué funcionalidades te gustaría tener?', por: 'Produce una lista de deseos infinita y sin prioridad. Pregunta por tareas que hacen hoy y cómo las hacen; los requisitos salen de ahí.' }
},

'w1d4': {
  sirve: 'Los no funcionales dicen CÓMO de bien debe funcionar: velocidad, disponibilidad, seguridad, cuántos usuarios. Son los que deciden la arquitectura, el servidor que contratas y el presupuesto.',
  importa: '"Que sea rápido" no se puede construir ni probar. "La agenda del día carga en menos de 1 segundo con 50 citas" sí. Sin números, el sistema puede cumplir todos los funcionales y aun así ser inutilizable, y nadie sabrá que estaba mal hasta que se queje el cliente.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Si el sistema se cae un martes a las 10 de la mañana, ¿cuánto tiempo puedes aguantar sin él antes de que sea un problema serio?', obt: 'Un número de disponibilidad real ("media hora, luego volvemos al papel"). Define si necesitas alta disponibilidad o un plan B en papel.' },
    { a: 'A la recepcionista', q: '¿Cuánto tiempo esperas, como máximo, desde que buscas a una mascota hasta que aparece en pantalla?', obt: 'Un límite de latencia que viene del usuario y no de tu intuición, por ejemplo "2 segundos, que tengo al cliente al teléfono".' },
    { a: 'Al tech lead', q: '¿Hay leyes o normas sobre datos personales que tengamos que cumplir en este cliente?', obt: 'Requisitos de privacidad y retención (protección de datos de los dueños) que cambian cómo guardas y borras información.' }
  ],
  evita: { q: '¿Quieres que sea rápido y seguro?', por: 'Todo el mundo dirá que sí y no habrás aprendido nada. Pregunta por situaciones concretas y tiempos tolerables para obtener números.' }
},

'w1d5': {
  sirve: 'Las reglas de negocio son las políticas que la clínica ya cumple sin software: "no se vacuna a un cachorro antes de 8 semanas", "una cita cancelada con menos de 24 h se cobra". En el trabajo son la lógica que irá dentro del dominio y que debe probarse con más cuidado.',
  importa: 'Si mezclas reglas con funcionalidades, las reglas acaban repartidas por pantallas, consultas y controladores, y cuando cambian (que cambian) hay que buscarlas por todo el código. Separarlas desde el principio es lo que permite cambiarlas en un solo sitio.',
  preguntas: [
    { a: 'Al veterinario', q: '¿Hay situaciones en las que NO atenderías o NO vacunarías a una mascota? ¿Por qué?', obt: 'Reglas con sus condiciones exactas ("no vacuno si tiene fiebre", "mínimo 8 semanas de vida").' },
    { a: 'Al dueño de la clínica', q: '¿Qué pasa cuando un cliente cancela tarde o no viene? ¿Siempre igual o hay excepciones?', obt: 'La regla y sus excepciones ("se cobra, salvo clientes de más de 5 años"). Las excepciones son las que rompen el código si no las conoces.' },
    { a: 'Al dueño de la clínica', q: 'Esta regla, ¿la decidiste tú o viene de una ley o del colegio de veterinarios?', obt: 'De dónde sale cada regla y quién la puede cambiar. Te dice cuáles serán configurables y cuáles fijas.' }
  ],
  evita: { q: '¿Qué validaciones quieres en el formulario?', por: 'Confunde una regla de negocio con un detalle de pantalla. Pregunta por la política de la clínica; dónde se valida lo decides tú después.' }
},

'w1d6': {
  sirve: 'Los criterios de aceptación son el contrato entre quien pide y quien construye: cuando todos pasan, la historia está terminada. En equipos ágiles se escriben antes de programar y QA los usa directamente como casos de prueba.',
  importa: 'Sin criterios, "terminado" significa algo distinto para el cliente, para el desarrollador y para QA. Con criterios Given/When/Then, la discusión pasa de opiniones a hechos: el escenario pasa o no pasa.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Imagina que te enseño esta función terminada. ¿Qué harías para comprobar que funciona?', obt: 'Los escenarios que él mismo probaría. Son tus criterios de aceptación, escritos con su lenguaje.' },
    { a: 'A QA o al tech lead', q: '¿Qué casos límite te preocupan de esta historia?', obt: 'Escenarios que olvidaste: cita a medianoche, mascota sin dueño, dos citas a la vez. Cada uno es un Given/When/Then más.' },
    { a: 'Al product owner', q: 'Si solo pudiéramos cumplir dos de estos criterios en esta entrega, ¿cuáles serían?', obt: 'Qué criterios son esenciales y cuáles pueden esperar, sin tener que adivinar.' }
  ],
  evita: { q: '¿Te parece bien si lo damos por terminado cuando funcione?', por: '"Cuando funcione" no es verificable. Pide un ejemplo concreto: dado esto, cuando hago aquello, entonces veo esto otro.' }
},

/* ---------- Semana 2 · De la conversación a la especificación ---------- */

'w2d1': {
  sirve: 'La entrevista de requisitos es la herramienta principal para sacar información del cliente. La usarás en consultoras, en startups con clientes nuevos y dentro de empresas cuando otro departamento te pide software.',
  importa: 'Una pregunta inducida ("¿verdad que necesitas recordatorios?") te devuelve tu propia idea con un sí educado. Una entrevista mal hecha produce requisitos inventados por ti, y el cliente lo descubre cuando ya está construido.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Cuéntame cómo fue ayer, desde que abriste hasta que cerraste.', obt: 'Una narración real con los problemas mezclados de forma natural. Escuchar un día completo revela más que una lista de preguntas cerradas.' },
    { a: 'Al dueño de la clínica', q: 'Dijiste que "a veces se pierden citas". ¿Cuántas veces el mes pasado? ¿Qué pasó exactamente?', obt: 'Frecuencia y detalle concretos. Repreguntar sobre lo que dijo, sin cambiar de tema, es la técnica más útil de una entrevista.' },
    { a: 'Al dueño de la clínica', q: '¿Hay algo que no te he preguntado y que crees que debería saber?', obt: 'Información que no sabías que existía. Esta pregunta de cierre suele sacar el dato más importante de la reunión.' }
  ],
  evita: { q: '¿No crees que sería genial poder mandar recordatorios por WhatsApp?', por: 'Es inducida: sugiere la respuesta y el cliente dirá que sí por cortesía. Pregunta qué pasa hoy cuando un cliente olvida la cita y deja que la necesidad salga sola.' }
},

'w2d2': {
  sirve: 'En el trabajo, cada documento de requisitos tiene palabras peligrosas: "rápido", "normalmente", "los clientes", "etc.". Cazar esas ambigüedades y convertirlas en preguntas o supuestos escritos es parte del trabajo diario de un senior.',
  importa: 'Cada ambigüedad que no aclaras la resuelve el programador a su manera, en silencio. Un supuesto escrito y validado ("asumimos una sola sede") se puede revisar; un supuesto implícito explota en producción.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Cuando dices "los clientes", ¿hablas de los dueños de las mascotas o también de otras clínicas que derivan pacientes?', obt: 'El significado exacto de una palabra que usabas como si estuviera clara.' },
    { a: 'Al dueño de la clínica', q: 'Estoy asumiendo que la clínica tiene una sola sede y un único horario. ¿Es correcto? ¿Va a seguir así un año?', obt: 'La confirmación o corrección de un supuesto que afecta al diseño de todo el sistema.' },
    { a: 'Al tech lead', q: 'Tengo estos cinco supuestos en el documento. ¿Cuáles crees que son más arriesgados si resultan falsos?', obt: 'Qué supuestos validar primero con el cliente, ordenados por impacto.' }
  ],
  evita: { q: '¿Esto está claro, no?', por: 'Nadie admite que no lo entendió. Pide que te lo expliquen con un ejemplo o explícalo tú y pregunta "¿qué parte no es así?".' }
},

'w2d3': {
  sirve: 'Priorizar es decidir qué entra en la primera versión y qué no. Lo harás en cada planificación de sprint y en cada reunión donde el cliente pide "solo una cosa más".',
  importa: 'Sin prioridad, todo es urgente y la primera versión nunca sale. Con MoSCoW puedes decir que no con argumentos: "esto es un Could, entra si sobra tiempo". Entregar algo pequeño que funcione vale más que prometer algo grande que no llega.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Si mañana solo funcionara una cosa del sistema, ¿cuál tendría que ser para que te sirva?', obt: 'El verdadero Must. Normalmente es mucho más pequeño que la lista inicial.' },
    { a: 'Al dueño de la clínica', q: 'Si esta función llega dos meses más tarde, ¿qué pierdes?', obt: 'El coste real de esperar. Si la respuesta es "nada grave", es un Should o un Could.' },
    { a: 'Al tech lead', q: '¿Cuántas de estas historias Must caben de forma realista en las primeras cuatro semanas?', obt: 'Un límite de capacidad que obliga a recortar el alcance con datos, no con optimismo.' }
  ],
  evita: { q: '¿Qué es importante para ti?', por: 'Todo será importante. Obliga a elegir: "si solo pudieras tener una", "qué pierdes si esperas". La prioridad aparece cuando hay que renunciar a algo.' }
},

'w2d4': {
  sirve: 'Un caso de uso describe una interacción completa entre un actor y el sistema, incluido lo que sale mal. Se usa en proyectos medianos y grandes, en sistemas regulados y siempre que el flujo tiene muchas ramas.',
  importa: 'El camino feliz es el 20 % del trabajo; los flujos alternativos (no hay hueco, el dueño no existe, se corta la conexión) son el 80 % de los errores en producción. Escribirlos antes de programar es la forma más barata de encontrarlos.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Qué haces cuando un cliente quiere cita y no hay hueco ese día?', obt: 'Un flujo alternativo real (ofrecer otro día, lista de espera, meter una urgencia) que el sistema debe soportar.' },
    { a: 'A la recepcionista', q: '¿Y si llama alguien cuya mascota no está registrada todavía?', obt: 'Otro flujo alternativo: el registro rápido durante la llamada, con los datos mínimos.' },
    { a: 'Al tech lead', q: '¿En qué punto de este flujo puede fallar algo técnico y qué ve el usuario entonces?', obt: 'Los flujos de excepción técnicos (sin conexión, doble clic) que también hay que diseñar.' }
  ],
  evita: { q: '¿Me describes cómo funciona agendar una cita?', por: 'Obtendrás solo el camino feliz. Pregunta expresamente por lo que sale mal: "¿y si no hay hueco?", "¿y si se equivoca de hora?".' }
},

'w2d5': {
  sirve: 'Las user stories son la unidad de trabajo en casi todos los equipos ágiles: lo que aparece en Jira o en GitHub Projects. Saber escribirlas bien es saber partir el trabajo en piezas que se terminan en días, no en meses.',
  importa: 'Una historia demasiado grande o dependiente de otras bloquea al equipo durante semanas. INVEST es la lista de control que evita historias imposibles de estimar, probar o entregar.',
  preguntas: [
    { a: 'Al product owner', q: '¿Quién se beneficia exactamente de esta historia y qué podrá hacer que hoy no puede?', obt: 'El "como... quiero... para..." con un usuario y un beneficio reales, no inventados.' },
    { a: 'Al equipo en el refinamiento', q: '¿Esta historia se puede terminar y probar en menos de tres días? Si no, ¿por dónde la partimos?', obt: 'Una división en historias más pequeñas que siguen aportando valor por sí solas.' },
    { a: 'A QA', q: '¿Con estos criterios de aceptación podrías probar la historia sin preguntarme nada?', obt: 'Confirmación de que la historia es Testable, o la lista de dudas que faltan por cerrar.' }
  ],
  evita: { q: '¿Me haces la historia de "gestión de mascotas"?', por: '"Gestión de" es una épica, no una historia. Pregunta por acciones concretas: registrar, buscar, editar alergias; cada una es una historia.' }
},

'w2d6': {
  sirve: 'Un documento de especificación reúne problema, alcance, requisitos y criterios en un solo sitio. En el trabajo se revisa en una reunión con el cliente y el equipo antes de comprometer fechas.',
  importa: 'La especificación es la referencia cuando surgen dudas o discusiones a mitad de proyecto. Sin ella, la memoria de cada persona es la "verdad", y cada memoria recuerda una cosa distinta.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Lee la sección de alcance. ¿Hay algo que esperabas y no está, o algo que está y no quieres?', obt: 'Correcciones de alcance ahora, cuando cambiar una línea cuesta cero.' },
    { a: 'Al tech lead', q: '¿Qué parte de esta especificación te parece más arriesgada de construir?', obt: 'El riesgo técnico principal, para atacarlo primero o investigarlo antes de prometer fechas.' },
    { a: 'Al equipo', q: 'Si os doy solo este documento, ¿podríais empezar a trabajar mañana sin llamarme?', obt: 'Los huecos que impiden que el documento se sostenga solo.' }
  ],
  evita: { q: '¿Lo apruebas para empezar?', por: 'Invita a un sí rápido sin leer. Pide revisión de secciones concretas y pregunta qué falta o sobra.' }
},

/* ---------- Semana 3 · Modelado de dominio ---------- */

'w3d1': {
  sirve: 'Identificar entidades es decidir qué "cosas" maneja el negocio y tendrán identidad propia: Mascota, Dueño, Cita, Vacuna. Es la base de las tablas, de las clases y de las rutas de la API.',
  importa: 'Si te equivocas en las entidades, todo lo que se construye encima hereda el error: tablas, endpoints y pantallas. Cambiar una entidad mal elegida a los seis meses es una migración dolorosa que toca todo el sistema.',
  preguntas: [
    { a: 'Al veterinario', q: '¿De qué cosas guardáis un registro que consultáis más adelante?', obt: 'Los sustantivos que tienen historia propia: mascota, consulta, vacuna aplicada, tratamiento. Son tus candidatas a entidad.' },
    { a: 'Al dueño de la clínica', q: 'Si un perro cambia de dueño, ¿es la misma ficha o una nueva?', obt: 'Si la Mascota es una entidad independiente del Dueño y cómo se relacionan.' },
    { a: 'Al tech lead', q: '¿"Tratamiento" merece ser entidad o es solo un dato dentro de la consulta?', obt: 'Un criterio para decidir: si tiene ciclo de vida propio o se consulta por separado, es entidad.' }
  ],
  evita: { q: '¿Qué tablas necesitas?', por: 'El cliente no piensa en tablas. Pregunta por lo que registra y consulta en su día a día, y las entidades las deduces tú.' }
},

'w3d2': {
  sirve: 'Definir atributos con tipo, obligatoriedad y rango es lo que luego se convierte en columnas, validaciones y campos de formulario. Es el puente entre el lenguaje del negocio y el código.',
  importa: 'Un atributo mal tipado (el peso como texto, la fecha como string) genera errores silenciosos durante años. Saber qué es obligatorio y qué rango es válido evita datos basura que después nadie se atreve a limpiar.',
  preguntas: [
    { a: 'Al veterinario', q: '¿Cuál es el peso más bajo y el más alto que habéis registrado? ¿En kilos con decimales?', obt: 'El rango válido y la precisión del dato. Te dice el tipo exacto y la validación.' },
    { a: 'A la recepcionista', q: '¿Qué datos de un dueño siempre tienes y cuáles a veces faltan?', obt: 'Qué campos deben ser obligatorios y cuáles opcionales, según la realidad y no según tu formulario ideal.' },
    { a: 'Al tech lead', q: '¿Guardamos la fecha de nacimiento o la edad?', obt: 'La regla de guardar el dato que no cambia (la fecha) y calcular el que sí cambia (la edad).' }
  ],
  evita: { q: '¿El teléfono es obligatorio?', por: 'Pregunta de sí o no sin contexto. Pregunta qué pasa cuando no tienen el teléfono de alguien: así sabes si es obligatorio o solo deseable.' }
},

'w3d3': {
  sirve: 'Decidir cómo se identifica cada entidad (un id interno, un número de chip, un DNI) determina las claves primarias, las URLs de la API y cómo se evitan duplicados.',
  importa: 'Si dos fichas del mismo perro conviven sin que el sistema lo sepa, el historial médico se parte en dos y un veterinario puede poner una vacuna dos veces. La identidad es un tema de seguridad del paciente, no solo de diseño.',
  preguntas: [
    { a: 'Al veterinario', q: '¿Cómo sabes con seguridad que el perro que entra es el mismo que vino el año pasado?', obt: 'El identificador natural del negocio (chip, nombre más dueño) y lo fiable que es.' },
    { a: 'A la recepcionista', q: '¿Alguna vez has encontrado dos fichas de la misma mascota? ¿Qué hiciste?', obt: 'Casos reales de duplicados y la necesidad de una función para detectarlos o fusionarlos.' },
    { a: 'Al tech lead', q: '¿Usamos el número de chip como clave primaria o un id propio?', obt: 'El argumento de usar un id interno estable y el chip como dato único opcional, porque no todas las mascotas tienen chip.' }
  ],
  evita: { q: '¿El nombre de la mascota es único?', por: 'La respuesta obvia es no, y no aprendes nada. Pregunta cómo distinguen hoy a dos "Max" para descubrir su identificador real.' }
},

'w3d4': {
  sirve: 'Los value objects (Peso, Email, RangoHorario, Dinero) agrupan un valor con sus reglas. En el trabajo se usan para que un dato inválido no pueda ni existir en el código.',
  importa: 'Pasar un decimal suelto como "peso" permite que alguien pase gramos donde se esperaban kilos y nadie lo note. Un value object convierte ese error en algo que el compilador o el constructor detienen al momento.',
  preguntas: [
    { a: 'Al veterinario', q: '¿El peso lo anotáis siempre en la misma unidad? ¿Con cuántos decimales?', obt: 'Las reglas que vivirán dentro del value object Peso: unidad, precisión y valores imposibles.' },
    { a: 'Al dueño de la clínica', q: '¿Los precios incluyen impuestos? ¿Alguna vez cobráis en otra moneda?', obt: 'Si necesitas un value object Dinero con moneda o basta con un importe, y cómo se redondea.' },
    { a: 'Al tech lead', q: '¿Dónde tenemos datos primitivos que se validan en muchos sitios distintos?', obt: 'Candidatos claros a value object: si la misma validación está copiada tres veces, ahí hay un tipo escondido.' }
  ],
  evita: { q: '¿Hacemos una clase para el email?', por: 'Plantea la solución sin el motivo. Pregunta qué reglas tiene el dato y en cuántos sitios se repiten; la clase se justifica sola.' }
},

'w3d5': {
  sirve: 'La cardinalidad (uno a uno, uno a muchos, muchos a muchos) decide las claves foráneas, las tablas puente y cómo se navega entre datos en la API. Es lo que se discute en toda revisión de modelo de datos.',
  importa: 'Modelar como "una mascota tiene un dueño" cuando en realidad puede tener dos obliga a rehacer tablas, consultas y pantallas cuando aparece el primer caso real, y siempre aparece.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Puede una mascota tener más de un dueño responsable, por ejemplo una pareja separada?', obt: 'Si la relación es 1:N o N:N, con casos reales que lo demuestran.' },
    { a: 'Al veterinario', q: '¿En una misma consulta pueden participar dos veterinarios?', obt: 'La cardinalidad entre Consulta y Veterinario, que define si basta con una clave foránea o hace falta una tabla puente.' },
    { a: 'Al dueño de la clínica', q: '¿Puede existir un dueño registrado sin ninguna mascota?', obt: 'La obligatoriedad de la relación: el mínimo es 0 o 1, que afecta a las restricciones de la base.' }
  ],
  evita: { q: '¿Cada mascota tiene un dueño?', por: 'Pregunta cerrada que confirma tu suposición. Pregunta por excepciones: "¿alguna vez una mascota ha tenido más de un responsable?".' }
},

'w3d6': {
  sirve: 'El diagrama entidad-relación es el plano del sistema. Se enseña en reuniones de diseño, se pega en la documentación y es lo primero que mira alguien que entra nuevo al equipo.',
  importa: 'Un ERD revisado contra casos reales detecta en una hora problemas que costarían semanas en código. Además, es la pieza que más se pide en entrevistas para ver si sabes modelar.',
  preguntas: [
    { a: 'Al tech lead', q: 'Recorre conmigo este caso: un perro con dos dueños se vacuna y luego se da de baja. ¿El modelo lo soporta?', obt: 'Validación del ERD contra un escenario completo y los huecos que aparezcan.' },
    { a: 'Al dueño de la clínica', q: 'Te leo las relaciones en español: "una cita es de una sola mascota con un solo veterinario". ¿Es siempre así?', obt: 'Confirmación del modelo en el lenguaje del negocio, sin enseñarle diagramas que no sabe leer.' },
    { a: 'A un compañero', q: '¿Qué consulta te costaría escribir con este modelo?', obt: 'Los puntos donde el modelo dificulta preguntas habituales, que pueden pedir un ajuste.' }
  ],
  evita: { q: '¿Te gusta el diagrama?', por: 'Pregunta de opinión que no valida nada. Pide que recorran un caso real sobre el diagrama y que señalen dónde se rompe.' }
},

/* ---------- Semana 4 · Relaciones, integridad y normalización ---------- */

'w4d1': {
  sirve: 'Decidir dónde vive la clave foránea en relaciones 1:1 y 1:N es una decisión diaria cuando se crean tablas o se añade una funcionalidad. Determina cómo se insertan, borran y consultan los datos.',
  importa: 'Una clave foránea en el lado equivocado obliga a actualizar dos tablas en cada cambio, o permite datos huérfanos. Es uno de los errores que más se ven en revisiones de código de juniors.',
  preguntas: [
    { a: 'Al tech lead', q: 'Ficha médica y mascota son 1:1. ¿La separamos en otra tabla o va en la misma?', obt: 'Criterios para decidir: frecuencia de acceso, tamaño, permisos distintos o datos opcionales.' },
    { a: 'Al veterinario', q: 'Si se da de baja a un dueño, ¿qué debe pasar con el historial de sus mascotas?', obt: 'La regla de borrado (conservar, reasignar o bloquear), que define el ON DELETE de la clave foránea.' },
    { a: 'A un compañero', q: '¿Desde qué lado vamos a consultar esta relación más a menudo?', obt: 'El patrón de acceso real, que influye en índices y en cómo navega el ORM.' }
  ],
  evita: { q: '¿Pongo la FK en mascotas o en dueños?', por: 'Pregunta sin contexto que obliga al otro a pensar por ti. Explica la cardinalidad y pregunta si tu razonamiento se sostiene.' }
},

'w4d2': {
  sirve: 'Las tablas puente resuelven relaciones N:N como mascota–vacuna o veterinario–especialidad. En el trabajo casi siempre acaban llevando datos propios: fecha, lote, quién la aplicó.',
  importa: 'Tratar una relación N:N como una lista de ids separados por comas en una columna es un error clásico que hace imposibles las consultas y la integridad. La tabla puente bien hecha es lo que permite responder "qué perros recibieron el lote defectuoso".',
  preguntas: [
    { a: 'Al veterinario', q: 'Cuando pones una vacuna, ¿qué anotas además de cuál fue?', obt: 'Los atributos de la relación (fecha, lote, dosis, veterinario), que viven en la tabla puente.' },
    { a: 'Al dueño de la clínica', q: 'Si un fabricante retira un lote, ¿necesitas saber a quién se le puso?', obt: 'La necesidad de trazabilidad que justifica la tabla puente con datos propios.' },
    { a: 'Al tech lead', q: '¿Esta tabla puente merece su propia entidad en el dominio?', obt: 'El criterio: si tiene datos y reglas propias (VacunaAplicada), pasa de tabla técnica a concepto del negocio.' }
  ],
  evita: { q: '¿Puedo guardar las vacunas como un array en la mascota?', por: 'Pregunta buscando permiso para el atajo. Pregunta qué consultas necesitará el negocio sobre las vacunas; la respuesta te dirá que no.' }
},

'w4d3': {
  sirve: 'Las constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) hacen que la base de datos rechace datos imposibles aunque el código tenga un bug o alguien entre por un script.',
  importa: 'El código cambia, se escriben scripts de migración y se conectan otras aplicaciones. Las constraints son la última defensa: si no están, tarde o temprano habrá un peso negativo o una cita sin mascota, y limpiar eso cuesta mucho más que prevenirlo.',
  preguntas: [
    { a: 'Al veterinario', q: '¿Qué valores serían imposibles en la vida real? Un peso, una fecha de nacimiento, una temperatura.', obt: 'Rangos imposibles que se convierten directamente en restricciones CHECK.' },
    { a: 'A la recepcionista', q: '¿Puede haber dos dueños con el mismo email o teléfono?', obt: 'Qué debe ser UNIQUE y qué no (familias que comparten teléfono).' },
    { a: 'Al tech lead', q: '¿Validamos esto solo en el código o también con una constraint en la base?', obt: 'La práctica de validar en ambos: el código da buenos mensajes y la base garantiza la integridad.' }
  ],
  evita: { q: '¿Hace falta poner constraints si ya valido en el backend?', por: 'Plantea un falso dilema. Pregunta qué otras vías escriben en la base (scripts, migraciones, otra app) y verás por qué hacen falta las dos.' }
},

'w4d4': {
  sirve: 'Normalizar elimina duplicación en los datos para que cada hecho viva en un solo sitio. En el trabajo también sirve para saber cuándo romper la normalización a propósito, por ejemplo en reportes.',
  importa: 'Si el teléfono del dueño está copiado en cada cita, al cambiarlo quedan datos contradictorios y nadie sabe cuál es el bueno. La normalización evita anomalías que corrompen los datos poco a poco y sin hacer ruido.',
  preguntas: [
    { a: 'Al tech lead', q: 'El precio de la consulta, ¿lo leemos de la tarifa actual o lo copiamos en la cita?', obt: 'La distinción entre duplicar por error y guardar a propósito un dato histórico: el precio cobrado no debe cambiar si cambia la tarifa.' },
    { a: 'A un compañero', q: '¿Dónde tenemos el mismo dato guardado en dos tablas?', obt: 'Duplicaciones existentes que pueden causar inconsistencias.' },
    { a: 'Al equipo de datos', q: '¿Este reporte necesita una tabla desnormalizada o una vista basta?', obt: 'Cuándo merece la pena desnormalizar por rendimiento y cuándo no.' }
  ],
  evita: { q: '¿Está en tercera forma normal?', por: 'Pregunta académica. Pregunta qué pasa si cambia un dato que aparece en varias filas; esa es la prueba práctica de la normalización.' }
},

'w4d5': {
  sirve: 'Las invariantes son reglas que deben cumplirse siempre ("una mascota no puede tener dos citas a la misma hora"). Los agregados son el grupo de objetos que las protege. En el trabajo deciden qué se guarda junto en una transacción.',
  importa: 'Si una regla crítica se puede saltar por un camino lateral del código, se saltará. Definir quién protege cada invariante es lo que hace que el sistema sea correcto incluso con varios desarrolladores tocándolo a la vez.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué cosas no deberían pasar nunca, aunque alguien se equivoque al usar el sistema?', obt: 'Las invariantes del negocio dichas por quien las sufre: dos citas en el mismo hueco, una vacuna antes de tiempo.' },
    { a: 'Al tech lead', q: '¿Qué objetos tienen que cambiar juntos en la misma transacción para que esta regla se cumpla?', obt: 'La frontera del agregado: ni tan grande que bloquee todo ni tan pequeña que la regla se escape.' },
    { a: 'Al veterinario', q: 'Si una regla tiene una excepción médica, ¿quién la autoriza?', obt: 'Si la invariante es absoluta o tiene una vía de excepción controlada.' }
  ],
  evita: { q: '¿Qué validaciones pongo en el agregado?', por: 'Mezcla validación de entrada con invariantes. Pregunta qué debe ser cierto SIEMPRE en el negocio; eso es lo que protege el agregado.' }
},

'w4d6': {
  sirve: 'Entregar un modelo de datos defendido es lo que se hace antes de crear la base de datos real. Es el documento que revisan el tech lead y el arquitecto para dar luz verde.',
  importa: 'Cambiar el modelo de datos con el sistema en producción es de las operaciones más caras que existen. Defenderlo bien ahora, con alternativas descartadas, ahorra migraciones de meses.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué decisión de este modelo te costaría más cambiar dentro de un año?', obt: 'La decisión estructural más arriesgada, para revisarla dos veces antes de seguir.' },
    { a: 'Al arquitecto', q: 'Si la clínica abre una segunda sede, ¿qué tablas hay que tocar?', obt: 'Una prueba de evolución del modelo frente a un cambio de negocio probable.' },
    { a: 'A un compañero', q: 'Intenta romper el modelo: busca un dato que no pueda guardar o una regla que se pueda violar.', obt: 'Huecos que tú no ves porque conoces demasiado bien tu propio diseño.' }
  ],
  evita: { q: '¿Está bien el modelo?', por: 'Demasiado abierta. Pide que lo ataquen con casos concretos o con cambios futuros; así sale lo que hay que corregir.' }
}

});
