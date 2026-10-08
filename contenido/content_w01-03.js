window.WEEKS = (window.WEEKS || []).concat([
{
  n: 1, phase: 'Ingeniería de requisitos', title: 'Entender el problema antes de programar',
  idea: 'Un ingeniero senior no empieza escribiendo código. Empieza entendiendo qué problema real tiene una persona y cómo sabremos que lo resolvimos.',
  res: [
    { t: 'Wikipedia — Requirements analysis', u: 'https://en.wikipedia.org/wiki/Requirements_analysis', note: 'Artículo de referencia: cómo se analizan los requisitos y qué tipos existen.' },
    { t: 'Mountain Goat — User stories', u: 'https://www.mountaingoatsoftware.com/agile/user-stories', note: 'La referencia clásica de Mike Cohn sobre historias de usuario.' },
    { t: 'Cucumber — Gherkin reference', u: 'https://cucumber.io/docs/gherkin/reference/', note: 'Sintaxis Given/When/Then para criterios de aceptación verificables.' },
    { t: 'Nielsen Norman — User interviews', u: 'https://www.nngroup.com/articles/user-interviews/', note: 'Cómo preguntar sin inducir la respuesta que quieres oír.' },
    { t: 'Wikipedia — Business rule', u: 'https://en.wikipedia.org/wiki/Business_rule', note: 'Qué es una regla de negocio y por qué existe aunque no haya software.' },
    { t: 'Nielsen Norman Group — Problem Statements in UX Discovery', u: 'https://www.nngroup.com/articles/problem-statements/', note: 'Cómo escribir el problema antes de pensar en la solución.' },
    { t: 'Wikipedia — Stakeholder analysis', u: 'https://en.wikipedia.org/wiki/Stakeholder_analysis', note: 'Tipos de stakeholders y la matriz poder-interés.' },
    { t: 'Wikipedia — Non-functional requirement', u: 'https://en.wikipedia.org/wiki/Non-functional_requirement', note: 'Definición, clasificación y ejemplos de requisitos no funcionales.' }
  ],
  days: [
    {
      t: 'El problema de negocio',
      obj: 'Escribir en una sola frase qué problema real resuelve VetCare, sin mencionar ninguna tecnología.',
      why: 'En una entrevista, la primera pregunta sobre tu proyecto siempre es "qué hace y para quién". Si respondes con tecnologías en vez de con el problema, pierdes puntos de inmediato.',
      study: { r: 5, what: 'Lee el artículo de Nielsen Norman Group sobre problem statements. Unos 12 minutos. Busca una cosa: la diferencia entre lo que el cliente PIDE (una solución) y lo que NECESITA (un problema resuelto).',
        pasos: [
          'Lee la sección "What’s a Problem Statement?" (~4 min) y escribe con tus palabras, en una línea, qué es.',
          'Lee "How to Write a Problem Statement" (~5 min). Apunta las partes que debe tener un buen enunciado del problema.',
          'Lee "Problem Statements Don’t Need to Be Negative" (~2 min).',
          'Cierra el artículo. Escribe tres frases distintas sobre qué problema resuelve VetCare sin nombrar ninguna tecnología.',
          'Tacha toda frase que describa una solución ("una app", "un sistema", "una base de datos"). Quédate con la más corta que siga siendo verdad.'
        ] },
      ex: {
        title: 'Mal vs bien',
        body: `MAL (habla de solución):
"VetCare es un sistema web en C# con PostgreSQL para clínicas."

BIEN (habla de problema):
"Las clínicas veterinarias pequeñas pierden citas y no saben
qué vacunas tiene pendiente cada mascota, porque lo anotan
en cuaderno. VetCare evita citas perdidas y olvidos de vacuna."

La prueba: si borras la frase y el lector no sabe a quién
le duele algo, todavía estás hablando de la solución.

------------------------------------------------------------
ASÍ QUEDA EL ARCHIVO AL TERMINAR EL DÍA (docs/requirements.md)
------------------------------------------------------------

# VetCare - Requisitos

## 1. Problema de negocio

Las clínicas veterinarias pequeñas pierden citas y olvidan
vacunas pendientes porque lo apuntan todo en un cuaderno.

### Hechos del contexto (inventados, pero realistas)
1. La clínica tiene 2 veterinarios y 1 recepcionista.
2. Atiende unas 600 mascotas, sobre todo perros y gatos.
3. Recibe unas 25 citas al día, la mitad por teléfono.
4. Cada semana 3 o 4 clientes no vienen y nadie les avisa antes.
5. Para saber qué vacuna toca, la recepcionista busca a mano
   en el cuaderno, y a veces no encuentra la ficha.

### Lo que VetCare NO va a hacer (no-objetivos)
1. No va a cobrar ni hacer facturas (eso sigue en su caja).
2. No va a ser una app para que los dueños pidan cita solos.
3. No va a gestionar el inventario de medicamentos.

Fíjate: ni una palabra de C#, web, app o base de datos en la
frase del problema. Los hechos los inventas tú; lo importante
es que sean concretos (números) y creíbles.`
      },
      steps: [
        'Escribe el problema de VetCare en una frase de máximo 25 palabras. Prohibido nombrar lenguajes, frameworks o bases de datos.',
        'Debajo escribe 5 hechos del contexto (cuántas mascotas, cuántos veterinarios, qué pasa hoy sin el sistema).',
        'Escribe 3 cosas que VetCare explícitamente NO va a hacer. Esto se llama delimitar el alcance.'
      ],
      vet: [
        'Crea la carpeta docs/ en tu proyecto y dentro el archivo requirements.md.',
        'Pon un título "1. Problema de negocio" y pega ahí la frase, los 5 hechos y los 3 no-objetivos.'
      ],
      edge: [
        'Si tu frase sirve igual para una peluquería canina, es demasiado genérica. Hazla específica.',
        'Si no puedes nombrar a quién le duele el problema, todavía no tienes un problema de negocio.'
      ],
      quiz: [
        { q: '¿Por qué es un error describir el problema mencionando la tecnología?', a: 'Porque fija la solución antes de entender la necesidad. Si el problema es "pierden citas", quizá la mejor solución sea un recordatorio por WhatsApp y no una web. Decidir la tecnología primero te cierra opciones.' },
        { q: '¿Qué diferencia hay entre lo que el cliente pide y lo que necesita?', a: 'Lo que pide es su idea de solución ("quiero un botón de Excel"). Lo que necesita es el resultado ("necesito dar el reporte mensual al dueño en 5 minutos"). Tu trabajo es llegar al segundo.' },
        { q: '¿Para qué sirve escribir los no-objetivos?', a: 'Para proteger el alcance. Sin ellos, cada conversación agrega funciones y el proyecto nunca termina. Es la herramienta más barata contra el scope creep.' },
        { q: '¿Cómo sabrías que VetCare resolvió el problema?', a: 'Necesitas una medida observable: por ejemplo "las citas perdidas por mes bajan de 12 a menos de 3". Si no puedes medirlo, no puedes demostrar que funcionó.' }
      ],
      out: 'docs/requirements.md con la sección 1 completa: 1 frase de problema, 5 hechos, 3 no-objetivos.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Stakeholders',
      obj: 'Identificar a todas las personas afectadas por VetCare y qué quiere cada una, incluidos los que se contradicen.',
      why: 'La mayoría de proyectos fallan no por código malo, sino porque se construyó para un solo tipo de usuario y se ignoró a otro que tenía poder de veto.',
      study: { r: 6, what: 'Lee el artículo de Wikipedia sobre análisis de stakeholders. Unos 10 minutos. Busca: la diferencia entre usuario, cliente y sponsor. No son la misma persona.',
        pasos: [
          'Lee la introducción (~2 min): qué es un stakeholder y para qué se analiza.',
          'Lee "Stakeholder types" (~3 min) y anota los tipos que aparecen.',
          'Lee "The power-interest matrix" (~4 min) y dibuja la matriz de dos ejes en un papel.',
          'Coloca en la matriz a los de VetCare: dueño de la clínica, veterinario, recepcionista y dueño de la mascota.',
          'Para cada uno escribe quién USA el sistema, quién lo PAGA y quién DECIDE si se compra.'
        ] },
      ex: {
        title: 'Tabla de stakeholders de VetCare',
        body: `| Quién          | Qué quiere                  | Qué teme                 |
|----------------|-----------------------------|--------------------------|
| Veterinario    | Ver historial en 10 seg     | Teclear mucho            |
| Recepcionista  | Agendar sin choques         | Equivocarse con el horario|
| Dueño clínica  | Saber ingresos del mes      | Pagar una licencia cara  |
| Dueño mascota  | Que le recuerden la vacuna  | Spam                     |

Conflicto detectado: el dueño de la mascota teme el spam,
pero el dueño de la clínica quiere mandar recordatorios.
Ese conflicto se decide ahora, no en producción.`
      },
      steps: [
        'Haz la tabla con mínimo 4 stakeholders de VetCare: quién, qué quiere, qué teme.',
        'Marca con una estrella al stakeholder que puede cancelar el proyecto si no está contento.',
        'Encuentra y escribe 1 conflicto real entre dos de ellos, y cómo lo resolverías.'
      ],
      vet: [
        'Agrega la sección "2. Stakeholders" a docs/requirements.md con la tabla completa.',
        'Debajo de la tabla escribe el conflicto detectado y tu decisión, en 2 frases.'
      ],
      edge: [
        'No olvides a los stakeholders que no usan el sistema pero lo sufren: contabilidad, soporte, el que paga la factura del servidor.',
        'Si todos tus stakeholders quieren lo mismo, no buscaste suficiente. Siempre hay tensión.'
      ],
      quiz: [
        { q: '¿Diferencia entre usuario y cliente?', a: 'El usuario usa el sistema a diario (recepcionista). El cliente paga por él (dueño de la clínica). Pueden querer cosas opuestas: el cliente quiere más controles, el usuario quiere menos clics.' },
        { q: '¿Qué haces cuando dos stakeholders piden cosas incompatibles?', a: 'No eliges en silencio. Documentas ambas posturas, propones una opción con su costo, y pides una decisión explícita a quien tiene autoridad. Luego lo escribes para que nadie lo niegue después.' },
        { q: '¿Por qué importa lo que un stakeholder TEME, no solo lo que quiere?', a: 'Porque el miedo predice el rechazo. Un veterinario que teme teclear mucho no va a usar tu formulario de 20 campos aunque tenga todas las funciones que pidió.' },
        { q: '¿Quién es el stakeholder más peligroso de ignorar?', a: 'El que tiene poder de veto sin ser usuario diario: típicamente quien paga o quien responde legalmente por los datos. Aparece tarde y puede tumbar meses de trabajo.' }
      ],
      out: 'Sección 2 de requirements.md: tabla de mínimo 4 stakeholders + 1 conflicto documentado con decisión.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Requisitos funcionales',
      obj: 'Escribir 10 requisitos funcionales de VetCare que sean verificables, no deseos vagos.',
      why: 'Un requisito funcional mal escrito es una discusión garantizada en 3 meses. Uno bien escrito se puede convertir en un test automático casi palabra por palabra.',
      study: { r: 1, what: 'Lee la guía de user stories de Mountain Goat. Unos 10 minutos. Fíjate en por qué el "para" es la parte más importante.',
        pasos: [
          'Lee "What Is a User Story?" y "Why User Stories Work" (~4 min).',
          'Lee "The User Story Template" (~2 min). Copia la plantilla: Como <rol> quiero <acción> para <beneficio>.',
          'En "User Story Examples" lee el caso "Internal Business System" (~2 min): es el que más se parece a VetCare.',
          'Lee "Improving a Weak Story" (~2 min) y apunta cómo se arregla una historia floja.',
          'Escribe tres historias de VetCare con la plantilla. Tacha las que no tengan un "para" real.'
        ] },
      ex: {
        title: 'Requisito vago vs verificable',
        body: `VAGO:
"El sistema debe gestionar citas."
No se puede probar. ¿Gestionar qué? ¿Quién? ¿Cuándo falla?

VERIFICABLE:
RF-01 — Como recepcionista quiero registrar una cita
        indicando mascota, veterinario, fecha y hora,
        para que el veterinario sepa a quién atiende.
        El sistema rechaza la cita si el veterinario ya
        tiene otra cita en ese mismo horario.

Fíjate: tiene ID, rol, acción, beneficio y una regla
que se puede convertir en test.`
      },
      steps: [
        'Escribe 10 requisitos funcionales con ID (RF-01 ... RF-10) usando el formato Como/quiero/para.',
        'A cada uno agrégale al menos una condición de rechazo o límite ("el sistema rechaza si...").',
        'Relee cada uno y pregunta: ¿podría escribir un test que falle o pase con esto? Si no, reescríbelo.'
      ],
      vet: [
        'Agrega la sección "3. Requisitos funcionales" a docs/requirements.md con los 10 RF numerados.',
        'Al lado de cada RF escribe el stakeholder de ayer que lo pidió. Si un RF no tiene dueño, sospecha: quizá lo inventaste tú.'
      ],
      edge: [
        'Un requisito con la palabra "y" suele ser dos requisitos disfrazados. Sepáralos.',
        'Si un requisito usa "debería" o "idealmente", no es requisito: es una idea. Muévelo a una lista aparte.'
      ],
      quiz: [
        { q: '¿Qué hace verificable a un requisito?', a: 'Que puedas describir una situación concreta donde se cumple y otra donde no. Si no existe un caso donde el requisito falle, el requisito no dice nada.' },
        { q: '¿Por qué el "para qué" de la historia de usuario es la parte clave?', a: 'Porque es el beneficio, y es lo único que te permite proponer una solución mejor. Si solo tienes la acción, implementas literal. Si tienes el beneficio, puedes resolverlo de forma más simple.' },
        { q: '¿Qué problema tiene el requisito "el sistema debe ser fácil de usar"?', a: 'No es funcional, es no funcional, y además no es medible. Habría que convertirlo en algo como "un recepcionista nuevo registra su primera cita en menos de 2 minutos sin ayuda".' },
        { q: '¿Para qué numerar los requisitos con ID?', a: 'Para poder referenciarlos después en commits, tests, ADRs y conversaciones. "Rompe RF-04" es trazable; "rompe lo de las citas" no.' }
      ],
      out: '10 requisitos funcionales con ID, formato Como/quiero/para, condición de rechazo y stakeholder asociado.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Requisitos no funcionales',
      obj: 'Definir 6 requisitos no funcionales de VetCare con números concretos, no adjetivos.',
      why: 'Los requisitos no funcionales son los que deciden la arquitectura. "Debe soportar 10 usuarios" y "debe soportar 10 millones" producen dos sistemas completamente distintos con los mismos requisitos funcionales.',
      study: { r: 7, what: 'Lee el artículo de Wikipedia sobre requisitos no funcionales. Unos 10 minutos. Anota las categorías: rendimiento, seguridad, disponibilidad, usabilidad, mantenibilidad, cumplimiento legal.',
        pasos: [
          'Lee "Definition" (~2 min): la diferencia entre lo que el sistema HACE y lo bien que lo hace.',
          'Lee "Classification of non-functional requirements" (~2 min): calidades de ejecución frente a calidades de evolución.',
          'Recorre "Examples" (~4 min) y marca los que aplican a una clínica veterinaria.',
          'Para cada uno que marcaste, escribe un requisito con un número dentro (tiempo de respuesta, horas de disponibilidad, días de retención). Si no tiene número, todavía no es un requisito.'
        ] },
      ex: {
        title: 'Adjetivo vs número',
        body: `ADJETIVO (inútil):
"El sistema debe ser rápido y seguro."

NÚMERO (decide arquitectura):
RNF-01 Rendimiento: la búsqueda de historial responde en
       menos de 300 ms para el percentil 95, con 5000
       mascotas en base de datos.
RNF-02 Disponibilidad: la clínica abre 8:00-20:00. Fuera
       de ese horario se permite mantenimiento.
RNF-03 Seguridad: las contraseñas se guardan con hash
       bcrypt, nunca en texto plano.
RNF-04 Legal: el historial médico se conserva 5 años.

Cada número de arriba cambia una decisión técnica real:
índices, backups, librería de hashing, política de borrado.`
      },
      steps: [
        'Escribe 6 RNF (RNF-01 ... RNF-06) cubriendo mínimo: rendimiento, seguridad, disponibilidad y datos.',
        'Cada uno debe tener un número o un límite concreto. Prohibidos los adjetivos solos.',
        'Al lado de cada RNF escribe qué decisión técnica te obliga a tomar.'
      ],
      vet: [
        'Agrega la sección "4. Requisitos no funcionales" a docs/requirements.md.',
        'Marca cuál de los 6 crees que será el más difícil de cumplir y por qué.'
      ],
      edge: [
        'Un RNF sin forma de medirlo es un deseo. Si dices 300 ms, piensa ya con qué lo vas a medir.',
        'Cuidado con pedir disponibilidad 99.99%: eso son 52 minutos de caída al año y cuesta muchísimo. Pide lo que el negocio realmente necesita.'
      ],
      quiz: [
        { q: '¿Por qué los RNF deciden la arquitectura más que los funcionales?', a: 'Porque los funcionales dicen QUÉ hace el sistema y casi siempre se pueden implementar de muchas formas. Los no funcionales imponen restricciones de escala, latencia y riesgo que descartan opciones completas.' },
        { q: '¿Qué significa percentil 95 en un requisito de latencia?', a: 'Que el 95% de las peticiones responden por debajo de ese tiempo. Se usa en vez del promedio porque el promedio esconde los casos lentos, que son justo los que enfadan al usuario.' },
        { q: 'Da un ejemplo de RNF legal en VetCare y su impacto técnico.', a: 'Conservar el historial médico 5 años. Impacto: no puedes hacer DELETE físico de registros; necesitas borrado lógico, política de archivado y backups con retención.' },
        { q: '¿Por qué es peligroso pedir "máxima seguridad"?', a: 'Porque no es una meta, es un gradiente infinito sin criterio de parada. Sin un nivel concreto (qué amenazas, qué datos, qué cumplimiento) no sabes cuándo parar ni puedes justificar el costo.' }
      ],
      out: '6 RNF con números concretos y la decisión técnica que cada uno impone.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Reglas de negocio',
      obj: 'Extraer las reglas de negocio de VetCare y separarlas de los requisitos funcionales.',
      why: 'Las reglas de negocio son las que más cambian y las que más bugs causan cuando están copiadas en cinco sitios del código. Identificarlas ahora te permite centralizarlas después en el dominio.',
      study: { r: 4, what: 'Lee el artículo completo, es corto. Unos 8 minutos. Clave: una regla de negocio es verdadera aunque no exista el software; el requisito es lo que el software hace con ella.',
        pasos: [
          'Lee el resumen inicial y la sección "Introduction" (~3 min).',
          'Lee "Categories" (~3 min) y anota las categorías de reglas que propone.',
          'Escribe cinco reglas de la clínica, por ejemplo: una cita no puede solaparse con otra del mismo veterinario.',
          'Comprueba cada regla: ¿seguiría siendo verdad si la clínica trabajara con papel y boli? Si no, es un requisito del software, no una regla de negocio.'
        ] },
      ex: {
        title: 'Requisito vs regla de negocio',
        body: `REQUISITO FUNCIONAL (qué hace el sistema):
RF-02 El recepcionista puede cancelar una cita.

REGLA DE NEGOCIO (verdad del negocio):
RN-01 Una cita no se puede cancelar con menos de 2 horas
      de antelación, salvo que la cancele el veterinario.
RN-02 Una mascota solo puede tener un expediente activo.
RN-03 En esta clínica, la vacuna antirrábica se repite cada 12 meses.

Prueba para distinguirlas: si mañana cierras el software
y vuelven al cuaderno de papel, RN-01 sigue siendo cierta.
RF-02 desaparece. Eso es una regla de negocio.`
      },
      steps: [
        'Escribe 8 reglas de negocio de VetCare con ID RN-01 ... RN-08.',
        'A cada una aplícale la prueba del cuaderno de papel: ¿sigue siendo cierta sin software? Si no, no es regla de negocio.',
        'Marca cuáles de esas reglas crees que podrían cambiar en 1 año. Esas son las que habrá que hacer configurables.'
      ],
      vet: [
        'Agrega la sección "5. Reglas de negocio" a docs/requirements.md.',
        'Conecta cada RN con el RF que la hace cumplir. Si una RN no tiene RF, te falta un requisito.'
      ],
      edge: [
        'Las reglas con excepciones ("salvo que...") son las que más bugs generan. Escribe la excepción explícita, no la dejes implícita.',
        'Una regla que nadie puede confirmarte probablemente te la estás inventando. Márcala como SUPUESTO.'
      ],
      quiz: [
        { q: '¿Cuál es la prueba rápida para saber si algo es regla de negocio?', a: 'Preguntarte si seguiría siendo cierta sin el software. "Una mascota tiene un solo dueño responsable" es regla de negocio. "El sistema muestra un modal de confirmación" no lo es.' },
        { q: '¿Por qué conviene centralizar las reglas de negocio en el código?', a: 'Porque si la misma regla está duplicada en el controlador, el servicio y el frontend, cuando cambie vas a actualizar dos de los tres sitios y tendrás un bug silencioso.' },
        { q: '¿Qué haces con una regla que no puedes confirmar con el cliente?', a: 'La escribes igual pero marcada como SUPUESTO, con la pregunta pendiente al lado. Un supuesto documentado es manejable; uno implícito en tu cabeza es una bomba.' },
        { q: '¿Por qué las excepciones de una regla son peligrosas?', a: 'Porque suelen descubrirse tarde, en producción, y obligan a cambiar una validación que ya está repartida. Escribirlas desde el inicio te obliga a diseñar el caso completo.' }
      ],
      out: '8 reglas de negocio con ID, validadas con la prueba del cuaderno, y cada una conectada a su RF.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Criterios de aceptación (examen de la semana)',
      obj: 'Convertir 5 requisitos en criterios de aceptación Given/When/Then y defender tu especificación.',
      why: 'Los criterios de aceptación son el puente entre el negocio y el test automático. Si sabes escribirlos, más adelante los tests de integración casi se escriben solos.',
      study: { r: 2, what: 'Lee la referencia de Gherkin: Feature, Scenario, Given, When, Then. 12 minutos. Fíjate en la regla de oro: Given es estado, When es UNA acción, Then es resultado observable.',
        pasos: [
          'Lee "Keywords" y "Feature" (~3 min).',
          'Lee "Example" y "Steps": Given, When, Then, And, But (~5 min). Regla de oro: Given es estado, When es UNA acción, Then es resultado observable.',
          'Lee "Background" y "Scenario Outline" con "Examples" (~4 min): cómo no repetir pasos y cómo probar varios datos con un solo escenario.',
          'Escribe dos escenarios para reservar una cita: uno que sale bien y otro que falla por solape.'
        ] },
      ex: {
        title: 'Criterio de aceptación para RF-01',
        body: `Feature: Registrar cita

Scenario: Cita válida en horario libre
  Given la veterinaria Ana no tiene citas el 10/10 a las 09:00
  And la mascota "Rocky" está registrada
  When el recepcionista registra una cita para Rocky
       con Ana el 10/10 a las 09:00
  Then la cita queda guardada con estado "CONFIRMADA"
  And Ana ve la cita en su agenda del 10/10

Scenario: Choque de horario
  Given la veterinaria Ana ya tiene una cita el 10/10 a las 09:00
  When el recepcionista intenta registrar otra cita
       para Ana el 10/10 a las 09:00
  Then el sistema rechaza la cita
  And muestra el mensaje "El veterinario no está disponible"

Un solo When por escenario. Si necesitas dos acciones,
son dos escenarios.`
      },
      steps: [
        'Elige 5 requisitos de los que escribiste y escribe para cada uno 2 escenarios: uno feliz y uno de rechazo.',
        'Revisa que cada escenario tenga exactamente un When. Si tiene dos, pártelo.',
        'Sin mirar tus notas, explica en voz alta durante 3 minutos: qué problema resuelve VetCare, para quién, y cómo sabrás que funciona.'
      ],
      vet: [
        'Crea docs/acceptance-criteria.md con los 10 escenarios (5 requisitos x 2).',
        'Al final de requirements.md agrega una sección "6. Supuestos abiertos" con todas las preguntas que no pudiste responder esta semana.'
      ],
      edge: [
        'Un Then que dice "el sistema funciona correctamente" no sirve. Tiene que ser observable: un estado, un mensaje, un registro.',
        'Si un escenario necesita 8 líneas de Given, tu caso es demasiado grande o tu modelo está mal.'
      ],
      quiz: [
        { q: '¿Por qué solo un When por escenario?', a: 'Porque si el escenario falla con dos acciones no sabes cuál de las dos lo rompió. Un When significa un diagnóstico claro cuando el test se pone rojo.' },
        { q: '¿Qué relación hay entre un criterio de aceptación y un test de integración?', a: 'Casi uno a uno. El Given es el arrange (preparar datos), el When es el act (llamar al endpoint), el Then es el assert. Por eso escribir buenos criterios ahorra trabajo después.' },
        { q: '¿Qué pones en Then si el resultado es un rechazo?', a: 'El estado observable del rechazo: código de respuesta, mensaje de error concreto, y sobre todo que el dato NO se guardó. El "no se guardó" se olvida mucho y es la mitad del valor del test.' },
        { q: 'Resume la semana: ¿cuál es el orden correcto problema -> criterio?', a: 'Problema de negocio -> stakeholders -> requisitos funcionales y no funcionales -> reglas de negocio -> criterios de aceptación. Cada paso se apoya en el anterior; saltarte uno hace que el siguiente sea inventado.' }
      ],
      out: 'docs/acceptance-criteria.md con 10 escenarios Gherkin + sección de supuestos abiertos en requirements.md.',
      file: 'docs/acceptance-criteria.md'
    }
  ]
},
{
  n: 2, phase: 'Ingeniería de requisitos', title: 'De la conversación a la especificación',
  idea: 'Los requisitos nunca llegan limpios. Llegan como una conversación confusa y contradictoria. Esta semana aprendes a convertir ese ruido en algo que un equipo pueda construir.',
  res: [
    { t: 'Nielsen Norman — User interviews', u: 'https://www.nngroup.com/articles/user-interviews/', note: 'Técnica de entrevista: preguntas abiertas, no inducidas.' },
    { t: 'Wikipedia — Software requirements specification', u: 'https://en.wikipedia.org/wiki/Software_requirements_specification', note: 'Qué estructura tiene una especificación y qué hace que un requisito sea de calidad.' },
    { t: 'Mountain Goat — User stories', u: 'https://www.mountaingoatsoftware.com/agile/user-stories', note: 'Historias de usuario e INVEST.' },
    { t: 'Wikipedia — MoSCoW method', u: 'https://en.wikipedia.org/wiki/MoSCoW_method', note: 'Must / Should / Could / Won\'t. Corto y suficiente.' },
    { t: 'UML use case diagrams', u: 'https://www.uml-diagrams.org/use-case-diagrams.html', note: 'Referencia de notación de casos de uso.' },
    { t: 'Agile Alliance — INVEST', u: 'https://www.agilealliance.org/glossary/invest/', note: 'Los seis criterios de una buena historia de usuario, de Bill Wake.' },
    { t: 'Wikipedia — Use case', u: 'https://en.wikipedia.org/wiki/Use_case', note: 'Qué es un caso de uso y las plantillas clásicas para escribirlo (Cockburn).' }
  ],
  days: [
    {
      t: 'Entrevista de requisitos',
      obj: 'Preparar y simular una entrevista con el dueño de la clínica, sin hacer preguntas inducidas.',
      why: 'Saber preguntar es la habilidad que separa a un programador de un ingeniero. Un mal set de preguntas produce un sistema que nadie usa, aunque el código sea impecable.',
      study: { r: 0, what: 'Lee el artículo completo (~12 min). Lo esencial: pregunta por el pasado concreto ("qué pasó la última vez que..."), no por el futuro hipotético ("usarías...").',
        pasos: [
          'Lee "Why Conduct User Interviews?" (~2 min): para qué sirve una entrevista y qué NO te va a dar.',
          'Lee "1. Identify What You’d Like to Learn" y "2. Prepare a Guide" (~4 min). Escribe en una línea qué quieres aprender del dueño de la clínica.',
          'Lee "4. Start Easy", "5. Build Rapport" y "6. Follow Up and Probe" (~4 min). Apunta tres preguntas de seguimiento que puedas reutilizar (por ejemplo: cuéntame más sobre eso).',
          'Lee "Limitations of Interviews" (~2 min): por qué lo que la gente dice que hace no siempre es lo que hace.',
          'Revisa tus preguntas: cambia cada "usarías...?" o "te gustaría...?" por "cuéntame la última vez que...".'
        ] },
      ex: {
        title: 'Pregunta inducida vs abierta',
        body: `INDUCIDA (solo confirma lo que ya creías):
"¿Te gustaría tener recordatorios automáticos de vacuna?"
Respuesta: "sí, claro". No aprendiste nada.

ABIERTA SOBRE EL PASADO (te da datos reales):
"Cuéntame la última vez que a una mascota se le pasó
 una vacuna. ¿Cómo te enteraste? ¿Qué hiciste?"
Respuesta: "la dueña llamó enojada tres meses después,
tuve que buscar en el cuaderno de 2023..."

Ahí aparecieron: el canal (llamada), el retraso (3 meses),
el dolor (buscar en cuaderno viejo) y el stakeholder real.`
      },
      steps: [
        'Escribe 12 preguntas para el dueño de la clínica. Mínimo 8 deben ser sobre hechos pasados concretos.',
        'Marca y reescribe cualquier pregunta que se pueda responder con sí o no.',
        'Simula la entrevista: responde tú mismo como si fueras el dueño, inventando respuestas realistas y algo contradictorias.'
      ],
      vet: [
        'Crea docs/interview-notes.md con las 12 preguntas y las respuestas simuladas.',
        'Al final lista 3 cosas nuevas que descubriste y que no estaban en requirements.md.'
      ],
      edge: [
        'Si todas las respuestas simuladas te convienen, hiciste trampa. Mete al menos una respuesta que rompa tu plan.',
        'Cuidado con entrevistar solo al que paga. El que usa el sistema todos los días te da información distinta.'
      ],
      quiz: [
        { q: '¿Por qué preguntar por el pasado y no por el futuro?', a: 'Porque la gente predice mal su propio comportamiento futuro pero recuerda bien lo que le dolió. "¿Usarías X?" da opiniones; "¿qué pasó la última vez?" da datos.' },
        { q: '¿Qué tiene de malo una pregunta de sí/no?', a: 'Que cierra la conversación y suele inducir la respuesta. Las preguntas abiertas obligan a narrar, y en la narración aparecen los detalles que no sabías que tenías que preguntar.' },
        { q: '¿Qué haces si dos entrevistados se contradicen?', a: 'No eliges al que te cae mejor. Anotas la contradicción como un conflicto explícito, buscas un tercer dato (observar el proceso real) y llevas la decisión a quien tiene autoridad.' },
        { q: '¿Qué es el "silencio incómodo" en una entrevista y para qué sirve?', a: 'Es esperar 3-5 segundos después de que la persona termina de hablar. Casi siempre sigue hablando y lo segundo que dice es más honesto y más útil que lo primero.' }
      ],
      out: 'docs/interview-notes.md con 12 preguntas, respuestas simuladas y 3 descubrimientos nuevos.',
      file: 'docs/interview-notes.md'
    },
    {
      t: 'Ambigüedad y supuestos',
      obj: 'Cazar las ambigüedades de tu propia documentación y convertirlas en supuestos explícitos o preguntas.',
      why: 'La ambigüedad no desaparece sola: se convierte en una decisión que alguien toma a las 2 de la madrugada sin contexto. Cazarla ahora cuesta minutos; cazarla en producción cuesta días.',
      study: { r: 1, what: 'Hoy el material principal eres tú: tu propio requirements.md. Antes, lee en Wikipedia la sección "Requirement quality" (~6 min) para saber qué buscar.',
        pasos: [
          'Lee "Requirement quality" y apunta las cualidades que debe cumplir un requisito.',
          'Abre tu requirements.md y subraya las palabras vagas: "rápido", "varios", "normalmente", "etc", "si aplica".',
          'Por cada palabra vaga, escribe la pregunta que le harías al cliente para convertirla en un número o una regla concreta.',
          'Reescribe el requisito con la respuesta más probable y marca el supuesto como pendiente de confirmar.'
        ] },
      ex: {
        title: 'Caza de ambigüedad',
        body: `ORIGINAL:
"El recepcionista puede cancelar citas recientes."

AMBIGÜEDADES:
- "reciente" = ¿cuánto? ¿2 horas? ¿7 días?
- "cancelar" = ¿borrar o marcar como cancelada?
- ¿puede cancelar citas de OTRO recepcionista?
- ¿qué pasa con la cita cancelada en la agenda del vet?

RESULTADO:
SUP-01 "Reciente" = cita futura con más de 2h de margen.
       (supuesto, confirmar con el dueño)
RN-04  Cancelar = cambiar estado a CANCELADA, nunca borrar.
PREG-01 ¿Puede un recepcionista cancelar citas creadas
       por otro? -> pendiente de respuesta.`
      },
      steps: [
        'Relee requirements.md y subraya todas las palabras vagas. Deberías encontrar al menos 10.',
        'Convierte cada una en: un número concreto, un SUPUESTO numerado, o una PREGUNTA numerada.',
        'Ordena las preguntas por riesgo: cuál te obligaría a rehacer más trabajo si la respuesta es la contraria a la que supones.'
      ],
      vet: [
        'Crea docs/assumptions.md con dos tablas: SUPUESTOS (SUP-01...) y PREGUNTAS ABIERTAS (PREG-01...).',
        'Cada supuesto lleva: qué supongo, en qué me baso y qué pasa si me equivoco.'
      ],
      edge: [
        'La palabra "simplemente" casi siempre esconde complejidad. Donde la veas, hay un requisito sin escribir.',
        'Un supuesto sin consecuencia documentada no sirve. Lo importante no es el supuesto, es el costo de equivocarse.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre un supuesto y una pregunta abierta?', a: 'El supuesto es una decisión que tomaste tú para poder avanzar, y la documentas para poder revertirla. La pregunta abierta es algo que todavía bloquea o que no te atreves a decidir solo.' },
        { q: '¿Por qué hay que documentar "qué pasa si me equivoco"?', a: 'Porque eso te da la prioridad. Un supuesto equivocado que cuesta 10 minutos de cambio puede quedarse; uno que te obliga a rehacer el modelo de datos hay que confirmarlo ya.' },
        { q: 'Da tres palabras señal de ambigüedad.', a: '"Rápido", "varios", "normalmente", "etc.", "si aplica", "simplemente", "debería". Todas delegan la decisión al lector, y el lector futuro eres tú sin memoria.' },
        { q: '¿Qué riesgo tiene resolver toda ambigüedad antes de empezar?', a: 'Parálisis por análisis. No todas las ambigüedades importan. Por eso se ordenan por riesgo: resuelves las que afectan decisiones irreversibles y dejas las demás como supuestos.' }
      ],
      out: 'docs/assumptions.md con mínimo 6 supuestos y 4 preguntas abiertas, ordenadas por riesgo.',
      file: 'docs/assumptions.md'
    },
    {
      t: 'Priorización con MoSCoW',
      obj: 'Priorizar todos tus requisitos y definir un alcance de primera versión que puedas construir de verdad.',
      why: 'Todo proyecto personal muere por exceso de alcance. Saber decir "esto no va en la v1" es una habilidad de ingeniería, no de falta de ambición.',
      study: { r: 3, what: 'Lee la página de MoSCoW (~6 min). Clave: la categoría Won\'t es obligatoria y es la más valiosa. Si no tienes Won\'t, no priorizaste.',
        pasos: [
          'Lee la introducción y "Background" (~2 min): de dónde viene el método.',
          'Lee "Prioritization of requirements" (~3 min) y copia la definición de cada categoría: Must, Should, Could y Won\'t.',
          'Lee "Criticism" (~2 min): qué problemas tiene el método y cómo evitarlos.',
          'Antes de clasificar, escribe la regla que usarás para Must: si no está, la v1 no tiene sentido. Aplícala sin excepciones.'
        ] },
      ex: {
        title: 'MoSCoW aplicado a VetCare v1',
        body: `MUST (sin esto no hay producto):
  RF-01 Registrar cita sin choques
  RF-03 Ficha de mascota con historial
  RF-05 Login de veterinario y recepcionista

SHOULD (importante, pero el producto vive sin ello):
  RF-07 Recordatorio de vacuna
  RF-08 Buscar mascota por nombre de dueño

COULD (si sobra tiempo):
  RF-09 Exportar historial a PDF

WON'T en v1 (decisión explícita, no olvido):
  Facturación
  App móvil
  Multi-clínica

Regla práctica: MUST no debe pasar del 60% del esfuerzo.
Si todo es MUST, no priorizaste, solo hiciste una lista.`
      },
      steps: [
        'Clasifica todos tus RF en Must / Should / Could / Won\'t.',
        'Estima a ojo el esfuerzo de cada RF y suma: si los Must pasan del 60% del esfuerzo total, reclasifica. Oblígate a bajar cosas.',
        'Escribe en una frase qué es la v1 de VetCare: solo los Must.'
      ],
      vet: [
        'Agrega la sección "7. Alcance v1 (MoSCoW)" a docs/requirements.md con las 4 listas.',
        'Escribe debajo la frase de alcance de la v1 y la fecha objetivo que te pones.'
      ],
      edge: [
        'Si algo está en Must solo porque es divertido de programar, es Could. Sé honesto.',
        'Won\'t no significa nunca: significa no en esta versión. Escribe "Won\'t v1" para dejarlo claro.'
      ],
      quiz: [
        { q: '¿Por qué la categoría Won\'t es la más valiosa?', a: 'Porque es la única que realmente reduce trabajo. Must/Should/Could solo ordenan; Won\'t corta. Además convierte un olvido en una decisión defendible frente al stakeholder.' },
        { q: '¿Qué significa que Must no pase del 60% del esfuerzo?', a: 'Que te dejas margen para lo que no previste, que siempre aparece. Si planificas al 100% de capacidad, cualquier imprevisto rompe la fecha.' },
        { q: '¿Cuál es la diferencia entre Should y Could?', a: 'Should es doloroso no tenerlo pero existe un workaround manual. Could es un "estaría bien" sin dolor real si falta. Si no puedes nombrar el workaround, probablemente es Must.' },
        { q: '¿Cómo defiendes ante un stakeholder que su función favorita es Could?', a: 'Con el impacto en el problema de negocio de la semana 1. "Esto no reduce citas perdidas ni olvidos de vacuna, que es lo que definimos como el problema. Entra en v2 salvo que cambiemos el objetivo."' }
      ],
      out: 'Sección MoSCoW completa con las 4 categorías y la frase de alcance de la v1.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Casos de uso',
      obj: 'Escribir 3 casos de uso completos con flujo principal y flujos alternativos.',
      why: 'El caso de uso es donde descubres los caminos que no habías pensado. La mayoría de bugs de producción viven en los flujos alternativos que nadie escribió.',
      study: { r: 6, what: 'Lee en Wikipedia cómo se escribe un caso de uso, sobre todo la plantilla de Cockburn. Unos 12 minutos. No necesitas dibujar el diagrama UML todavía: hoy importa el texto (actor, precondición, flujo principal, flujos alternativos, postcondición).',
        pasos: [
          'Lee "Definition" y "General principle" (~3 min): un caso de uso describe un objetivo del actor, no una pantalla.',
          'Lee "Templates" y dentro "Cockburn style" y "Fully dressed" (~5 min). Copia los apartados de la plantilla completa.',
          'Lee "Actors" (~2 min): quién es actor principal y quién secundario.',
          'Lee "Misconceptions" (~2 min) y apunta el error que crees que más cometerías.',
          'Escribe el esqueleto de UC-01 (reservar cita) solo con los títulos de la plantilla, antes de rellenar nada.'
        ] },
      ex: {
        title: 'Caso de uso UC-01',
        body: `UC-01 Registrar cita
Actor principal: Recepcionista
Precondición: usuario autenticado; la mascota existe

Flujo principal:
 1. El recepcionista busca la mascota por nombre.
 2. El sistema muestra las coincidencias.
 3. El recepcionista elige la mascota y el veterinario.
 4. El recepcionista elige fecha y hora.
 5. El sistema valida que el veterinario esté libre.
 6. El sistema guarda la cita como CONFIRMADA.
 7. El sistema muestra el comprobante.

Flujos alternativos:
 2a. No hay coincidencias -> ofrecer crear mascota nueva.
 5a. Veterinario ocupado -> mostrar 3 huecos cercanos.
 5b. Fecha en el pasado -> rechazar con mensaje.
 6a. Fallo de base de datos -> no se guarda nada,
     mensaje de reintento, nada queda a medias.

Postcondición: existe una cita CONFIRMADA o el sistema
quedó exactamente como estaba.`
      },
      steps: [
        'Escribe 3 casos de uso de tus requisitos Must, con la estructura completa.',
        'Cada caso de uso necesita mínimo 3 flujos alternativos. Oblígate a buscarlos.',
        'Revisa la postcondición: ¿en el caso de fallo, el sistema queda consistente? Si no lo sabes, ahí tienes un hueco.'
      ],
      vet: [
        'Crea docs/use-cases.md con los 3 casos de uso numerados UC-01, UC-02, UC-03.',
        'Marca en cada flujo alternativo qué regla de negocio (RN-xx) lo justifica.'
      ],
      edge: [
        'El flujo alternativo más olvidado es el fallo técnico a mitad de la operación. Escríbelo siempre.',
        'Si un paso del flujo principal dice "el sistema procesa", es una caja negra. Ábrela o mueve esa complejidad a otro caso de uso.'
      ],
      quiz: [
        { q: '¿Por qué los flujos alternativos importan más que el principal?', a: 'Porque el flujo principal lo implementa cualquiera y casi siempre funciona. Los bugs, la mala UX y las inconsistencias de datos viven en los alternativos, que es donde nadie pensó.' },
        { q: '¿Qué es una precondición y por qué importa?', a: 'Es el estado que debe ser cierto antes de empezar. Importa porque define de quién es la responsabilidad de validar: si la precondición dice "usuario autenticado", el caso de uso no tiene que volver a comprobarlo.' },
        { q: '¿Qué debe decir la postcondición en el caso de fallo?', a: 'Que el sistema quedó en un estado consistente conocido, normalmente "como estaba antes". Esto es el germen de las transacciones que verás en la semana 9.' },
        { q: '¿Diferencia entre caso de uso y user story?', a: 'La user story es corta y sirve para planificar y conversar. El caso de uso es detallado y sirve para implementar y probar. No compiten: la story es el título, el caso de uso es el contenido.' }
      ],
      out: 'docs/use-cases.md con 3 casos de uso completos, mínimo 3 flujos alternativos cada uno.',
      file: 'docs/use-cases.md'
    },
    {
      t: 'User stories e INVEST',
      obj: 'Convertir tu alcance Must en user stories que cumplan los criterios INVEST.',
      why: 'En cualquier equipo real vas a recibir el trabajo en forma de historias. Saber si una historia está bien formada te permite rechazar trabajo mal definido antes de empezarlo.',
      study: { r: 5, what: 'Lee la definición de INVEST (~5 min): Independent, Negotiable, Valuable, Estimable, Small, Testable. Después vuelve al artículo de Mountain Goat sobre user stories para ver historias bien partidas. 10 min en total.',
        pasos: [
          'Lee "What is INVEST?" (~3 min) y escribe cada letra con una pregunta de comprobación propia (por ejemplo, Small: ¿cabe en 3 días?).',
          'Lee "Origins" (~1 min): quién lo propuso y para qué.',
          'Abre la guía de Mountain Goat de la semana 1 y relee la parte sobre qué hace buena a una historia (~4 min): es INVEST contado con ejemplos.',
          'Elige tu historia más grande y escribe cómo la partirías en dos que aporten valor cada una por separado.'
        ] },
      ex: {
        title: 'Historia que falla INVEST y su arreglo',
        body: `HISTORIA MALA:
"Como usuario quiero gestionar el sistema."
 - ¿Independent? no se sabe
 - ¿Valuable? no se ve el beneficio
 - ¿Small? es enorme
 - ¿Testable? imposible

PARTIDA EN HISTORIAS QUE SÍ CUMPLEN:
US-01 Como recepcionista quiero registrar una cita
      para que el veterinario sepa a quién atiende.
      Estimación: 2 días. Testable: UC-01.
US-02 Como recepcionista quiero ver la agenda del día
      para saber qué huecos quedan libres.
      Estimación: 1 día. Testable: lista ordenada por hora.
US-03 Como veterinario quiero ver el historial de una
      mascota para decidir el tratamiento.
      Estimación: 2 días.

Regla: si no puedes estimarla, es porque no la entiendes.`
      },
      steps: [
        'Convierte tus Must en 6-8 user stories con formato Como/quiero/para.',
        'Pasa cada historia por los 6 criterios INVEST y anota cuál falla.',
        'Parte o reescribe las que fallen hasta que todas pasen. Ninguna historia debe superar 3 días de trabajo estimado.'
      ],
      vet: [
        'Crea docs/backlog.md con la lista de user stories, su estimación en días y el caso de uso que la respalda.',
        'Ordénalas en el orden en que las vas a construir. Ese es tu plan real de las próximas semanas.'
      ],
      edge: [
        'Una historia que depende de otras tres no es Independent. Reordena o fusiona.',
        'Si estimas todo en "1 día", no estás estimando. Oblígate a que haya variedad.'
      ],
      quiz: [
        { q: '¿Qué significa que una historia sea Negotiable?', a: 'Que describe el qué y el porqué, pero deja abierto el cómo. Si la historia ya dice "con un dropdown de Bootstrap", le quitaste al equipo la posibilidad de encontrar algo mejor.' },
        { q: '¿Por qué una historia debe ser Small?', a: 'Porque las grandes esconden incertidumbre, no se estiman bien y no dan feedback rápido. Una historia de 3 días que falla te cuesta 3 días; una de 3 semanas te cuesta 3 semanas.' },
        { q: '¿Qué haces si una historia no es Estimable?', a: 'No la estimas al azar. Creas una tarea de investigación acotada (un spike de medio día) para resolver la incógnita concreta, y luego estimas.' },
        { q: '¿Cómo se relacionan user story, caso de uso y criterio de aceptación?', a: 'La user story dice qué y por qué. El caso de uso detalla los pasos y los caminos alternativos. El criterio de aceptación define cómo se comprueba. Los tres describen lo mismo con distinto nivel de zoom.' }
      ],
      out: 'docs/backlog.md con 6-8 historias que pasan INVEST, estimadas y ordenadas.',
      file: 'docs/backlog.md'
    },
    {
      t: 'Mini especificación (examen de la semana)',
      obj: 'Producir un documento único de especificación de VetCare v1 y defenderlo como en una revisión real.',
      why: 'Esta es la primera pieza de portfolio de verdad. Un documento de especificación claro demuestra más madurez de ingeniería que 500 líneas de código bonito.',
      study: { r: 1, what: 'Hoy no hay material nuevo. Lee solo la sección "Structure" del artículo (~5 min) para comparar con el índice de tu documento. Después relee todo lo que escribiste en las semanas 1 y 2 de principio a fin, como si lo hubiera escrito otra persona.',
        pasos: [
          'Lee la sección "Structure" (~4 min) y compara su índice con el de tu spec-v1.md: ¿qué apartado te falta?',
          'Relee "Requirement quality" (~2 min) y úsala como lista de comprobación.',
          'Imprime o abre en pantalla completa todo lo escrito en las semanas 1 y 2 y léelo de corrido, sin corregir todavía.',
          'Anota en un papel cada contradicción o hueco que encuentres; después corrígelos todos de una vez.'
        ] },
      ex: {
        title: 'Estructura del documento final',
        body: `docs/spec-v1.md

1. Problema de negocio (1 párrafo)
2. Stakeholders y conflictos (tabla)
3. Alcance v1: Must / Won't (listas)
4. Requisitos funcionales (RF-xx)
5. Requisitos no funcionales (RNF-xx, con números)
6. Reglas de negocio (RN-xx)
7. Casos de uso principales (UC-01..03)
8. Criterios de aceptación (Gherkin)
9. Supuestos y preguntas abiertas
10. Glosario (qué es "cita", "expediente", "visita")

El punto 10 lo olvida todo el mundo y es crítico:
si tú y el cliente usan "visita" con distinto significado,
todo lo anterior está contaminado.`
      },
      steps: [
        'Monta docs/spec-v1.md con las 10 secciones, reutilizando lo que ya escribiste.',
        'Escribe el glosario: mínimo 8 términos del dominio veterinario con su definición exacta.',
        'Autoevaluación sin mirar: explica en voz alta, en 5 minutos, el problema, los stakeholders, el alcance v1 y cómo sabrás que funcionó.'
      ],
      vet: [
        'Deja docs/spec-v1.md como el único documento que hay que leer para entender VetCare.',
        'Guárdalo bien: es lo que defenderás ante un "cliente difícil" cuando pidas la evaluación de la semana 2.'
      ],
      edge: [
        'Si dos secciones se contradicen, no elijas en silencio: corrígelo y anota por qué.',
        'Si el glosario tiene dos términos que significan lo mismo, elimina uno. Los sinónimos en un dominio son fuente permanente de bugs.'
      ],
      quiz: [
        { q: '¿Por qué un glosario es crítico en una especificación?', a: 'Porque los términos del dominio se convertirán en nombres de clases y tablas. Si "visita" y "cita" se usan como sinónimos en el documento, acabarás con dos entidades confusas en el modelo.' },
        { q: '¿Qué harías si el cliente leyera tu spec y dijera "esto no es lo que pedí"?', a: 'Buscar en qué sección concreta diverge, confirmar si es un supuesto mal tomado o un requisito omitido, corregir la sección y anotar el cambio. El documento existe precisamente para que esa conversación sea barata.' },
        { q: '¿Cuánto debería durar una especificación antes de quedar obsoleta?', a: 'Hasta el primer contacto con el código real. Es un documento vivo: cuando descubras algo implementando, vuelves y lo actualizas. Una spec que nunca cambia es una spec que nadie lee.' },
        { q: 'Resume las semanas 1 y 2 en una sola idea.', a: 'Que el software empieza en el lenguaje del negocio, no en el del código, y que cada afirmación vaga que no conviertas en algo verificable se convertirá en un bug o en una discusión más adelante.' }
      ],
      out: 'docs/spec-v1.md completo con las 10 secciones, incluido glosario de 8+ términos.',
      file: 'docs/spec-v1.md'
    }
  ]
},
{
  n: 3, phase: 'Modelado de dominio', title: 'Del lenguaje del negocio a las entidades',
  idea: 'Modelar es decidir qué cosas existen en tu sistema, qué las identifica y cómo se relacionan. Un modelo bueno hace que el código se escriba solo; uno malo te persigue durante años.',
  res: [
    { t: 'Martin Fowler — Domain Model', u: 'https://martinfowler.com/eaaCatalog/domainModel.html', note: 'Definición corta y autoritativa de qué es un modelo de dominio.' },
    { t: 'Martin Fowler — Value Object', u: 'https://martinfowler.com/bliki/ValueObject.html', note: 'La distinción entidad / value object explicada por quien popularizó el término.' },
    { t: 'Microsoft — DDD domain model layer', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice', note: 'Cómo se ve esto en .NET concretamente.' },
    { t: 'Mermaid — ER diagrams', u: 'https://mermaid.js.org/syntax/entityRelationshipDiagram.html', note: 'Para dibujar tu ERD en texto, versionable en git.' },
    { t: 'Microsoft Learn — Implement value objects', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects', note: 'Cómo se implementa un value object en C#: igualdad por valor e inmutabilidad.' },
    { t: 'Microsoft Learn — Design a microservice domain model', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model', note: 'Entidades, value objects y agregados explicados para .NET.' },
    { t: 'Microsoft Learn — Implement a microservice domain model with .NET', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/net-core-microservice-domain-model', note: 'Cómo se definen y protegen los datos de una entidad en C#.' }
  ],
  days: [
    {
      t: 'Entidades',
      obj: 'Extraer del glosario las entidades reales de VetCare y justificar por qué cada una existe.',
      why: 'Cada entidad que creas de más es una tabla, un repositorio, un conjunto de tests y una fuente de bugs. Cada una que falta te obliga a un refactor doloroso. Esta decisión es de las más caras del proyecto.',
      study: { r: 5, what: 'Lee la definición de Domain Model de Fowler (~3 min, es una página corta) y después este artículo de Microsoft sobre entidades. Clave: una entidad tiene identidad propia que persiste aunque cambien todos sus atributos.',
        pasos: [
          'Lee "The Domain Entity pattern" (~5 min): qué hace que algo sea entidad y no un simple dato.',
          'Lee "Rich domain model versus anemic domain model" (~4 min): la entidad también tiene comportamiento, no solo datos.',
          'Abre la página corta de Fowler sobre Domain Model (enlace de la semana) y lee el primer párrafo (~2 min).',
          'Con tu spec-v1.md abierto, haz la prueba de identidad a cada candidata: ¿si cambian todos sus datos, sigue siendo la misma? Si sí, es entidad.'
        ] },
      ex: {
        title: 'Cómo se detecta una entidad',
        body: `Técnica: subraya los SUSTANTIVOS de tu spec.

"El recepcionista registra una CITA para una MASCOTA
 con un VETERINARIO. La mascota pertenece a un DUEÑO.
 Cada visita genera un registro en el HISTORIAL."

Candidatas: Cita, Mascota, Veterinario, Dueño, Historial.

Ahora filtra con la prueba de identidad:
 - Mascota: si le cambias el nombre, ¿sigue siendo la misma
   mascota? SÍ -> es entidad, necesita un Id.
 - Dirección del dueño: si cambias la calle, es otra
   dirección. NO tiene identidad propia -> no es entidad.

Descartadas por no ser del dominio: "pantalla", "botón",
"reporte en PDF". Eso es interfaz, no dominio.`
      },
      steps: [
        'Subraya todos los sustantivos de tu spec-v1.md y haz una lista de candidatas.',
        'Aplica a cada una la prueba de identidad: ¿sigue siendo la misma cosa si cambian sus datos?',
        'Quédate con 6-9 entidades y escribe una frase justificando por qué cada una existe.'
      ],
      vet: [
        'Crea docs/domain-model.md con la sección "1. Entidades": nombre, una frase de propósito, y por qué tiene identidad propia.',
        'Lista aparte las candidatas que descartaste y el motivo. Esto vale tanto como la lista buena.'
      ],
      edge: [
        'Cuidado con entidades llamadas "Manager", "Data", "Info" o "Helper": no son conceptos del negocio, son síntomas de que no encontraste el nombre real.',
        'Si una entidad solo tiene un Id y un nombre, pregunta si de verdad necesita ser entidad o es un simple valor.'
      ],
      quiz: [
        { q: '¿Cuál es la prueba para saber si algo es entidad?', a: 'Si tiene identidad que persiste independientemente de sus atributos. Una mascota sigue siendo la misma aunque cambie de nombre, peso y dueño. Por eso necesita un Id estable.' },
        { q: '¿Por qué "ReportManager" es mal nombre de entidad?', a: 'Porque no existe en el lenguaje del negocio. Ningún veterinario dice "voy a consultar el ReportManager". Los nombres del dominio salen de la boca del usuario, no de patrones técnicos.' },
        { q: '¿Qué pasa si creas entidades de más?', a: 'Multiplicas tablas, joins, repositorios, mapeos y tests sin ganar nada. El modelo se vuelve caro de cambiar justo cuando más necesitas cambiarlo, al principio.' },
        { q: '¿De dónde deben salir los nombres de tus entidades?', a: 'Del glosario que escribiste con el cliente. Si tu código usa "Appointment" y el cliente dice "visita", cada conversación requiere traducción y en cada traducción se pierde algo.' }
      ],
      out: 'docs/domain-model.md sección 1: 6-9 entidades justificadas + lista de descartadas con motivo.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Atributos y tipos',
      obj: 'Definir los atributos de cada entidad con su tipo, obligatoriedad y rango válido.',
      why: 'Los tipos son tu primera línea de defensa. Un atributo declarado como string cuando debería ser una fecha te garantiza bugs de formato y comparaciones imposibles.',
      study: { r: 6, what: 'Lee cómo Microsoft define los datos de una entidad. Unos 10 minutos. Clave: que un atributo pueda ser nulo es una decisión de negocio, no técnica.',
        pasos: [
          'Lee "Implement domain entities as POCO classes" (~4 min): mira qué atributos tiene la entidad de ejemplo y de qué tipo son.',
          'Lee "Encapsulate data in the Domain Entities" (~4 min): por qué los atributos no se cambian desde fuera sin una regla.',
          'Para cada atributo de Mascota pregunta: ¿puede faltar en la vida real? Si la respuesta es no, es obligatorio.',
          'Escribe un caso real del negocio para cada atributo opcional. Si no se te ocurre ninguno, hazlo obligatorio.'
        ] },
      ex: {
        title: 'Atributos de Mascota',
        body: `Mascota
  Id            Guid      obligatorio  inmutable
  Nombre        string    obligatorio  1-60 caracteres
  Especie       enum      obligatorio  Perro|Gato|Otro
  FechaNac      date      opcional     no futura
  PesoKg        decimal   opcional     > 0 y < 200
  DuenoId       Guid      obligatorio  debe existir
  Activa        bool      obligatorio  default true

Decisiones que acabas de tomar sin darte cuenta:
 - FechaNac opcional -> habrá mascotas rescatadas sin fecha.
   Tu cálculo de edad tiene que soportar null.
 - PesoKg decimal, no float -> evitas errores de redondeo.
 - Especie enum, no string -> nadie escribirá "perrro".
 - Activa bool -> borrado lógico, no físico (RNF legal).`
      },
      steps: [
        'Para cada entidad escribe sus atributos con: tipo, obligatorio/opcional, y rango o formato válido.',
        'Justifica cada campo opcional con un caso real del negocio. Si no puedes, hazlo obligatorio.',
        'Marca qué atributos son inmutables después de crear el registro.'
      ],
      vet: [
        'Agrega la sección "2. Atributos" a docs/domain-model.md con una tabla por entidad.',
        'Marca con un asterisco los atributos que vienen directamente de una regla de negocio (RN-xx).'
      ],
      edge: [
        'Nunca uses float para dinero ni para pesos que se van a comparar. Usa decimal.',
        'Un string sin longitud máxima es una invitación a que alguien pegue un libro entero. Define siempre el límite.'
      ],
      quiz: [
        { q: '¿Por qué decimal y no float para el peso o el precio?', a: 'Porque float es binario y no representa exactamente valores decimales: 0.1 + 0.2 no da 0.3. En dinero eso produce descuadres; en comparaciones produce bugs intermitentes.' },
        { q: '¿Qué decisión de negocio esconde un campo opcional?', a: 'Que existe un caso real donde el dato no se conoce. Si no puedes nombrar ese caso, el campo debería ser obligatorio y te estás protegiendo de una validación que no quieres escribir.' },
        { q: '¿Por qué enum en vez de string para la especie?', a: 'Porque el string acepta errores de escritura, mayúsculas distintas y valores inventados. El enum deja una lista cerrada de valores que el compilador conoce, y el error de escritura se detecta al compilar en vez de en producción. Ojo con un detalle de C#: un número fuera de la lista puede colarse con un cast como (Especie)99 o al leer un JSON, así que en los datos que llegan de fuera hay que comprobarlo con Enum.IsDefined.' },
        { q: '¿Qué significa que un atributo sea inmutable y por qué importa?', a: 'Que no cambia después de crear el objeto, como el Id o la fecha de creación. Importa porque los atributos inmutables se pueden cachear, comparar e indexar sin miedo, y eliminan toda una clase de bugs de concurrencia.' }
      ],
      out: 'Tabla de atributos por entidad con tipo, obligatoriedad, rango y marca de inmutabilidad.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Identidad vs igualdad',
      obj: 'Decidir cómo se identifica cada entidad y entender por qué dos objetos con los mismos datos no son el mismo.',
      why: 'Confundir identidad con igualdad es la causa de bugs muy difíciles de encontrar: duplicados invisibles, comparaciones que fallan, objetos que se pierden en colecciones.',
      study: { r: 1, what: 'Lee ValueObject de Fowler (~6 min) prestando atención a la frase sobre igualdad por valor versus igualdad por referencia o por id.',
        pasos: [
          'Lee el artículo de Fowler completo (~6 min), sin detenerte en el código.',
          'Relee el párrafo donde compara igualdad por referencia, por identidad y por valor. Escribe la diferencia con un ejemplo de VetCare.',
          'Lee el ejemplo de la fecha o el dinero que usa Fowler y piensa cuál sería su equivalente en la clínica (peso, teléfono, rango horario).',
          'Responde por escrito: ¿dos mascotas con el mismo nombre, raza y dueño, son la misma mascota? ¿Y dos pesos de 4,2 kg?'
        ] },
      ex: {
        title: 'Dos gatos llamados Michi',
        body: `Dos mascotas con los MISMOS datos:
  { Nombre:"Michi", Especie:Gato, PesoKg:4.2 }
  { Nombre:"Michi", Especie:Gato, PesoKg:4.2 }

¿Son el mismo gato? NO. Son dos gatos distintos de dos
dueños distintos. Por eso Mascota necesita Id.

Dos direcciones con los mismos datos:
  { Calle:"Av. Siempreviva 742", Ciudad:"Lima" }
  { Calle:"Av. Siempreviva 742", Ciudad:"Lima" }

¿Son la misma dirección? SÍ. No tiene sentido darles Id.
Es un VALUE OBJECT: se compara por sus valores.

Regla:
 Entidad      -> igualdad por Id.
 Value object -> igualdad por todos sus valores.

Elección de Id en VetCare:
 Guid: no colisiona, se puede generar en el cliente,
       no revela cuántos registros tienes.
 int autoincremental: más legible y más rápido de indexar,
       pero filtra información y complica la fusión de datos.
Para VetCare: Guid en entidades de negocio. En .NET 9 o
posterior puedes crearlo con Guid.CreateVersion7(), que es
ordenado por tiempo y no desordena los índices.`
      },
      steps: [
        'Decide el tipo de Id de cada entidad (Guid o int) y escribe el motivo en una frase.',
        'Para cada entidad escribe la regla de igualdad: por qué campos se compara.',
        'Encuentra en tu modelo al menos 2 conceptos que NO deberían tener Id porque son valores.'
      ],
      vet: [
        'Agrega la sección "3. Identidad" a docs/domain-model.md: tipo de Id por entidad y justificación.',
        'Lista los candidatos a value object que encontraste.'
      ],
      edge: [
        'Nunca uses como Id un dato que el negocio puede querer cambiar (email, DNI, nombre). Ese día tendrás que actualizar todas las claves foráneas.',
        'Dos entidades con el mismo Id son la misma entidad aunque todos sus datos difieran. Es una versión distinta, no otro objeto.'
      ],
      quiz: [
        { q: '¿Por qué un email es mal candidato a clave primaria?', a: 'Porque es un dato de negocio que puede cambiar. Si alguien cambia de email, tienes que actualizar la clave y todas las filas que la referencian, con riesgo de inconsistencia. Las claves deben ser sin significado.' },
        { q: '¿Cuál es la diferencia entre igualdad por identidad e igualdad por valor?', a: 'Por identidad: dos objetos son iguales si tienen el mismo Id, aunque sus datos difieran (la misma mascota antes y después de engordar). Por valor: son iguales si todos sus campos coinciden, sin Id.' },
        { q: '¿Ventaja de Guid sobre int autoincremental?', a: 'Se puede generar sin consultar la base de datos, no colisiona al fusionar datos de varias fuentes, no revela el volumen de registros y hace muy difícil adivinar Ids ajenos en una URL. Ojo: eso no sustituye a comprobar permisos; un Id difícil de adivinar no es una medida de seguridad.' },
        { q: '¿Desventaja de Guid?', a: 'Ocupa más espacio, es menos legible al depurar y, si es aleatorio, fragmenta los índices de base de datos porque las inserciones no van al final. Por eso existen variantes ordenadas como UUID v7 (Guid.CreateVersion7() en .NET 9 o posterior).' }
      ],
      out: 'Sección 3 con tipo de Id justificado por entidad, regla de igualdad, y 2+ candidatos a value object.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Value objects',
      obj: 'Modelar 3 value objects de VetCare y entender por qué hacen el código más seguro.',
      why: 'Los value objects eliminan la "obsesión por primitivos": ese código lleno de strings y decimales sueltos donde nada te impide pasar el teléfono en el campo del email.',
      study: { r: 4, what: 'Lee "Implement value objects" de Microsoft, en especial la clase base ValueObject y cómo compara por valor (~10 min). Si te queda duda, relee ValueObject de Fowler enfocándote en inmutabilidad. 12 min.',
        pasos: [
          'Lee "Important characteristics of value objects" (~3 min): sin identidad, inmutable, comparado por valor.',
          'Lee "Value object implementation in C#" y "Value object comparison semantics" (~5 min). Fíjate en GetEqualityComponents.',
          'Salta las secciones de EF Core por hoy: las verás en la semana 12.',
          'Para cada value object que elijas, escribe la regla de validación que pondría su constructor.'
        ] },
      ex: {
        title: 'De primitivo a value object',
        body: `ANTES (obsesión por primitivos):
  void Registrar(string email, string telefono, decimal peso)

  // nada impide esto, y compila perfectamente:
  Registrar(telefono, email, -5);

DESPUÉS (value objects):
  void Registrar(Email email, Telefono tel, Peso peso)

  // esto ya no compila. El error se detecta al escribirlo.

Un value object en C# (idea, lo implementarás en la semana 5):
  Email
    - valor: string
    - se construye validando que tenga formato válido
    - si el formato es inválido, lanza excepción: NUNCA
      existe un Email inválido en memoria
    - es inmutable: no hay setter
    - dos Email son iguales si su valor es igual

Candidatos en VetCare:
  Email, Telefono, Peso, RangoHorario, Dirección, Dinero.

Ganancia real: la validación se escribe UNA vez, en el
constructor, no en cada controlador que recibe un email.`
      },
      steps: [
        'Elige 3 value objects de VetCare y define: qué valores contiene, qué reglas de validación tiene y cómo se comparan.',
        'Para cada uno escribe el estado inválido que ahora se vuelve imposible de representar.',
        'Busca en tu modelo de atributos los primitivos que deberían convertirse en value objects.'
      ],
      vet: [
        'Agrega la sección "4. Value objects" a docs/domain-model.md con los 3 definidos.',
        'Actualiza la tabla de atributos del día 2 cambiando los primitivos afectados por el value object correspondiente.'
      ],
      edge: [
        'Un value object debe ser inmutable. Si necesitas cambiarlo, creas uno nuevo. Si tiene setters, probablemente es una entidad mal disfrazada.',
        'RangoHorario es el value object más útil de VetCare: encapsula la regla de solapamiento de citas en un solo sitio.'
      ],
      quiz: [
        { q: '¿Qué es la obsesión por primitivos y por qué es un problema?', a: 'Usar string, int y decimal para todo en vez de tipos del dominio. El problema es que el compilador no puede ayudarte: cualquier string encaja donde se espera un email, y la validación acaba duplicada en todas partes.' },
        { q: '¿Por qué un value object debe ser inmutable?', a: 'Porque su identidad es su valor. Si pudieras cambiarlo, un objeto que estaba guardado en una colección o usado como clave cambiaría de identidad por debajo, rompiendo comparaciones y hashes.' },
        { q: '¿Dónde se valida un value object y qué ganas con eso?', a: 'En su constructor, de forma que sea imposible construir uno inválido. Ganas que en todo el resto del sistema puedas asumir que el dato es válido, sin volver a comprobarlo.' },
        { q: '¿Por qué RangoHorario es mejor que dos campos inicio y fin sueltos?', a: 'Porque los dos campos sueltos permiten estados absurdos (fin antes que inicio) y obligan a repetir la lógica de solapamiento en cada sitio. El value object valida la coherencia una vez y expone un método SeSolapaCon.' }
      ],
      out: 'Sección 4 con 3 value objects definidos (valores, validación, igualdad) y tabla de atributos actualizada.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Relaciones y cardinalidad',
      obj: 'Definir todas las relaciones entre tus entidades con su cardinalidad exacta y su obligatoriedad.',
      why: 'La cardinalidad mal elegida es el error más caro del modelado. Pasar de 1:N a N:N en producción significa migración de datos, cambio de API y reescritura de consultas.',
      study: { r: 3, what: 'Mira la sintaxis de ER en Mermaid (~8 min). Aprende a leer la notación: uno-a-uno, uno-a-muchos, muchos-a-muchos, y el modificador opcional/obligatorio.',
        pasos: [
          'Lee "Entities and Relationships" (~2 min): cómo se declara una relación entre dos entidades.',
          'Lee "Relationship Syntax" (~4 min) y copia la tabla de símbolos: |o, ||, }o, }|. Escribe al lado qué significa cada uno en español.',
          'Lee "Identification" (~1 min): la diferencia entre línea continua y discontinua.',
          'Lee "Attributes" (~2 min) para saber cómo añadir PK y FK al diagrama.',
          'Pega un diagrama de ejemplo en mermaid.live y cambia un símbolo para ver el efecto.'
        ] },
      ex: {
        title: 'Relaciones de VetCare en Mermaid',
        body: `erDiagram
  DUENO ||--o{ MASCOTA : "tiene"
  MASCOTA ||--o{ CITA : "genera"
  VETERINARIO ||--o{ CITA : "atiende"
  CITA ||--o| VISITA : "produce"
  MASCOTA ||--o{ VACUNA : "recibe"

Lectura de la notación:
  ||--o{  uno obligatorio a cero-o-muchos
  ||--||  uno a uno obligatorio
  }o--o{  cero-o-muchos a cero-o-muchos

Preguntas que cada relación te obliga a responder:
 - ¿Una mascota puede tener dos dueños? (familia divorciada)
 - Si borro un dueño, ¿qué pasa con sus mascotas?
 - ¿Una cita sin veterinario asignado puede existir?
 - ¿Una visita puede existir sin cita previa? (urgencia)

La última es clave: si en una urgencia atienden sin cita,
VISITA no puede depender obligatoriamente de CITA.
Fíjate en que el diagrama de arriba dice CITA ||--o| VISITA:
toda visita tiene exactamente una cita. Si aceptas
urgencias, cámbialo a CITA |o--o| VISITA.`
      },
      steps: [
        'Escribe todas las relaciones de tu modelo en formato Mermaid erDiagram.',
        'Para cada relación responde por escrito: ¿es obligatoria en ambos lados? ¿qué pasa al borrar cada extremo?',
        'Busca al menos una relación donde tu primera intuición fuera 1:N y en realidad sea N:N.'
      ],
      vet: [
        'Agrega la sección "5. Relaciones" a docs/domain-model.md con el bloque Mermaid y la tabla de decisiones de borrado.',
        'Pega el código Mermaid en mermaid.live para ver el diagrama y comprobar que no te falta ninguna entidad suelta.'
      ],
      edge: [
        'Una entidad sin ninguna relación es sospechosa: o sobra, o te falta descubrir cómo se conecta.',
        'La relación mascota-dueño parece 1:N obvia, hasta que aparece la pareja que se separa y ambos quieren acceso. Decide ahora.'
      ],
      quiz: [
        { q: '¿Por qué cambiar de 1:N a N:N es tan caro en producción?', a: 'Porque necesitas crear una tabla puente, migrar los datos existentes, cambiar las claves foráneas, reescribir las consultas y adaptar la API y la UI. Todo a la vez y sin perder datos.' },
        { q: '¿Qué significa el modificador opcional en una relación?', a: 'Que el otro extremo puede no existir. Una cita puede existir sin visita (todavía no ocurrió), pero no puede existir sin mascota. Eso determina si la clave foránea admite null.' },
        { q: '¿Qué debes decidir para cada relación respecto al borrado?', a: 'Si al borrar el padre se borran los hijos (cascade), se impide el borrado (restrict) o la clave queda en null. En VetCare, con un requisito legal de retener historiales, casi nunca querrás cascade.' },
        { q: '¿Cómo detectas una relación N:N escondida?', a: 'Preguntando el "y al revés". Una mascota tiene un dueño, vale; ¿pero un dueño puede tener varias mascotas y una mascota puede tener varios responsables? Si ambas respuestas son sí, es N:N.' }
      ],
      out: 'Diagrama Mermaid con todas las relaciones + tabla de obligatoriedad y política de borrado por relación.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'ERD inicial (examen de la semana)',
      obj: 'Producir el diagrama entidad-relación completo de VetCare y defenderlo contra casos reales.',
      why: 'El ERD es lo primero que mira cualquier ingeniero senior cuando revisa tu proyecto. En 30 segundos le dice si entendiste el dominio o solo tradujiste pantallas a tablas.',
      study: { r: 0, what: 'Hoy no hay lectura nueva. Relee tu propio domain-model.md completo buscando contradicciones con spec-v1.md.',
        pasos: [
          'Abre tu domain-model.md y tu spec-v1.md lado a lado.',
          'Para cada requisito Must, busca en el modelo la entidad y la relación que lo soportan. Si no hay, es un hueco.',
          'Para cada entidad del modelo, busca el requisito que la justifica. Si no hay, sobra o falta un requisito.',
          'Escribe la lista de contradicciones antes de corregir nada, y corrígelas después en orden.'
        ] },
      ex: {
        title: 'Prueba de estrés del modelo',
        body: `No valides tu modelo mirándolo. Valídalo con historias:

CASO 1: Llega una mascota de urgencia sin cita previa.
  -> ¿Tu modelo lo soporta? Si VISITA exige CITA, no.

CASO 2: Un dueño traspasa su perro a otra persona.
  -> El historial debe seguir con el perro, no con el dueño.
     ¿Tu modelo mantiene la separación?

CASO 3: La veterinaria Ana renuncia.
  -> ¿Puedes borrarla? Sus citas pasadas deben conservarse.
     Necesitas borrado lógico (Activo = false).

CASO 4: Dos vacunas el mismo día a la misma mascota.
  -> ¿Tu restricción de unicidad lo permite o lo bloquea?

CASO 5: Una cita se reagenda tres veces.
  -> ¿Guardas historial de cambios o pisas la fecha?
     ¿El negocio necesita saberlo?

Si tu modelo falla una historia, el modelo está mal.
La historia es real; el modelo es una hipótesis.`
      },
      steps: [
        'Genera el ERD final en Mermaid con entidades, atributos clave y todas las relaciones.',
        'Pasa tu modelo por las 5 historias del ejemplo y escribe si lo soporta o no.',
        'Corrige el modelo para los casos que fallen y documenta qué cambiaste y por qué.'
      ],
      vet: [
        'Deja docs/domain-model.md cerrado con el ERD final y la sección "6. Prueba de estrés del modelo".',
        'Pulsa «Marcar para repasar» y guarda una captura del diagrama renderizado (por ejemplo docs/erd.png) junto a domain-model.md.'
      ],
      edge: [
        'Si tuviste que cambiar el modelo con las historias, eso es éxito, no fracaso. Haberlo descubierto hoy en un documento cuesta una hora; descubrirlo con datos en producción cuesta semanas.',
        'Guarda las historias de estrés: en la semana 13 se convertirán casi literalmente en tus tests.'
      ],
      quiz: [
        { q: '¿Por qué se valida un modelo con historias y no leyéndolo?', a: 'Porque leyendo tu propio modelo solo confirmas lo que ya pensabas. Una historia concreta del negocio es un caso de prueba independiente que puede refutarlo.' },
        { q: '¿Qué te dice el caso de la veterinaria que renuncia sobre el borrado?', a: 'Que el borrado físico casi nunca sirve en sistemas con historial. Necesitas borrado lógico (un flag Activo) para que los registros pasados sigan siendo coherentes.' },
        { q: '¿Por qué el historial médico debe colgar de la mascota y no del dueño?', a: 'Porque el historial médico es un hecho sobre el animal y debe sobrevivir a un cambio de dueño. Si cuelga del dueño, al traspasar la mascota pierdes su pasado clínico.' },
        { q: 'Resume: ¿qué hace bueno a un modelo de dominio?', a: 'Que usa el vocabulario del negocio, que hace imposibles los estados inválidos, que soporta las historias reales incluidas las raras, y que se puede cambiar sin reescribir todo porque las responsabilidades están separadas.' }
      ],
      out: 'ERD final en Mermaid + prueba de estrés con 5 historias y las correcciones aplicadas.',
      file: 'docs/domain-model.md'
    }
  ]
}
]);
