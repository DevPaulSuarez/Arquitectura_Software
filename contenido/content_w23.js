window.WEEKS = (window.WEEKS || []).concat([
{
  n: 23,
  phase: 'Diseño de sistemas',
  title: 'Diseño de sistemas I: estimar, escalar y elegir',
  idea: 'VetCare funciona para una clínica. Esta semana te preguntas qué pasaría con doscientas, y descubres que la respuesta no se improvisa: se estima. El diseño de sistemas no es dibujar cajas bonitas, es hacer cuatro multiplicaciones que te dicen si necesitas una base de datos o veinte, y después elegir entre opciones sabiendo que cada una cuesta algo. Esta semana aprendes el método: aclarar requisitos antes de diseñar, estimar con números de orden de magnitud, entender por qué no puedes tener consistencia y disponibilidad a la vez cuando la red falla, y saber cuándo escalar es añadir una máquina y cuándo es partir los datos. Al terminar vas a poder sostener una conversación de diseño de una hora sin quedarte en blanco.',
  res: [
    { t: 'Martin Fowler — Microservices and the Monolith First', u: 'https://martinfowler.com/bliki/MonolithFirst.html', note: 'Corto y muy útil. Argumenta por qué empezar con un monolito suele ser la decisión correcta, que es lo contrario de lo que la gente supone que se espera oír.' },
    { t: 'Wikipedia — CAP theorem', u: 'https://en.wikipedia.org/wiki/CAP_theorem', note: 'Lee solo la definición y las críticas. Lo importante es entender que la elección solo aparece cuando hay partición de red, no todo el tiempo.' },
    { t: 'AWS — Caching best practices and CDN', u: 'https://aws.amazon.com/caching/best-practices/', note: 'Explica las capas de cache de un sistema real y dónde conviene cada una. Es independiente del proveedor en lo conceptual.' },
    { t: 'PostgreSQL — High Availability, Load Balancing and Replication', u: 'https://www.postgresql.org/docs/current/high-availability.html', note: 'La vista oficial de replicación en tu motor. Lo usas para hablar con precisión en vez de decir "pongo réplicas".' },
    { t: 'System Design Primer — How to approach a system design question', u: 'https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question', note: 'El método en cuatro pasos para no empezar dibujando cajas.' },
    { t: 'Latency numbers every programmer should know', u: 'https://gist.github.com/jboner/2841832', note: 'La tabla clásica de órdenes de magnitud.' },
    { t: 'Eric Brewer — CAP Twelve Years Later: How the Rules Have Changed', u: 'https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/', note: 'El autor del teorema CAP explica por qué elegir 2 de 3 es engañoso.' }
  ],
  days: [
    {
      t: 'El método: aclarar antes de diseñar',
      obj: 'Aprender la estructura de una entrevista de diseño de sistemas y practicar las preguntas que hay que hacer antes de dibujar nada.',
      why: 'La mayoría de los candidatos empieza a dibujar cajas en el primer minuto y fracasa por resolver un problema que nadie le pidió. El método es lo que se evalúa, más que la solución concreta.',
      study: { r: 4, what: 'Lee la sección "How to approach a system design interview question" del System Design Primer. Unos 10 minutos. Quédate con los pasos: casos de uso y restricciones, diseño de alto nivel, componentes clave y escalado. Busca una cosa: cuánto tiempo se dedica a preguntar antes de dibujar la primera caja.',
        pasos: [
          'Lee "Step 1: Outline use cases, constraints, and assumptions" (~3 min) y copia sus preguntas.',
          'Lee "Step 2: Create a high level design" y "Step 3: Design core components" (~3 min).',
          'Lee "Step 4: Scale the design" (~2 min).',
          'Lee "Back-of-the-envelope calculations" (~2 min): los enlaces que verás mañana.',
          'Escribe tu plantilla de 5 pasos con las preguntas de aclaración que harías para VetCare a escala.'
        ] },
      ex: {
        title: 'Los cinco pasos y las preguntas de cada uno',
        body: `PASO 1 - Aclarar requisitos (5 min de 45). No lo saltes.

Funcionales: ¿qué debe hacer?
  - ¿Quiénes son los usuarios? (¿recepción, veterinario, dueño?)
  - ¿Qué operaciones son imprescindibles para la versión 1?
  - ¿Qué queda explícitamente fuera del alcance?

No funcionales: ¿con qué límites?
  - ¿Cuántos usuarios? ¿Cuántas clínicas?
  - Lecturas frente a escrituras: ¿qué proporción?
  - ¿Qué latencia es aceptable?
  - ¿Puede estar unos segundos desactualizado o no?
  - ¿Hay datos regulados? (historial clínico: sí)

PASO 2 - Estimar (5 min). Números de orden de magnitud.
  Sin esto, todo lo que digas después es decoración.

PASO 3 - Diseño general (15 min). Cajas y flechas.
  Clientes -> balanceador -> API -> base de datos
  Y la cola o la cache solo si la estimación las justifica.

PASO 4 - Profundizar (15 min). El entrevistador elige.
  Esquema de datos, el endpoint crítico, cómo escala la pieza
  que primero se rompe.

PASO 5 - Cuellos de botella y compromisos (5 min).
  Qué se rompe primero, qué harías entonces, qué has sacrificado.

--- Ejemplo: VetCare para 200 clínicas ---

Preguntas que haría antes de dibujar:
  1. ¿Las clínicas comparten datos o están aisladas?
     (cambia TODO el diseño: multi-inquilino o instancias)
  2. ¿Un dueño puede ver el historial de su mascota?
     (sí = usuarios externos = 100x más tráfico y más seguridad)
  3. ¿Necesitan funcionar sin internet?
     (sí = sincronización offline = otro proyecto entero)
  4. ¿Hay integración con laboratorios o facturación externa?
  5. ¿Qué pasa si la agenda se ve desactualizada 10 segundos?

Suposiciones que escribo porque no me contestan:
  - Datos aislados por clínica, sin compartir.
  - Solo personal de clínica, sin acceso de dueños en v1.
  - Requiere internet.
  - La agenda debe ser consistente al instante: una cita doble
    es un error de negocio real, no una molestia.`
      },
      steps: [
        'Aprende los cinco pasos y los tiempos aproximados. Son el guion que te salva de quedarte en blanco: si no sabes qué decir, vuelves al paso en el que estabas.',
        'Toma el enunciado "diseña VetCare para 200 clínicas" y escribe las cinco preguntas que harías antes de dibujar nada. Después escribe las suposiciones que tomarías si no te contestan. Esa lista es tu red de seguridad.',
        'Repite el ejercicio con otro enunciado distinto, por ejemplo un acortador de URLs o un sistema de reservas de restaurante. Solo el paso 1: preguntas y suposiciones. Diez minutos cada uno.',
        'Escribe en docs/diseno-sistemas.md tu plantilla personal del paso 1: las preguntas que vas a hacer siempre, divididas en funcionales y no funcionales. Tener una plantilla propia elimina el pánico del minuto uno.',
        'Practica en voz alta durante tres minutos el paso 1 de VetCare como si tuvieras un entrevistador delante. Lo incómodo del ejercicio es exactamente lo que lo hace útil.'
      ],
      vet: [
        'Decide y escribe la respuesta a la pregunta más importante para VetCare: multi-inquilino en una base compartida con filtro por clínica, o una base por clínica. Anota tres ventajas y tres inconvenientes de cada una.',
        'Relee tus ADR de la semana 15. Vas a ver que un ADR y el paso 5 de una entrevista de diseño son el mismo ejercicio: opciones, elección y consecuencias.'
      ],
      edge: [
        'Dibujar antes de preguntar es el fallo más común y el más penalizado. Un diseño técnicamente brillante para el problema equivocado puntúa peor que un diseño simple para el problema correcto.',
        'No contestes "depende" y te quedes ahí. Di de qué depende, elige una opción con una suposición explícita y sigue. El entrevistador quiere verte decidir, no verte dudar.',
        'Proponer microservicios sin que la escala lo justifique es una señal de alarma para un entrevistador con experiencia. El monolito modular de tu semana 15 es la respuesta correcta mucho más a menudo de lo que la gente cree.'
      ],
      quiz: [
        { q: '¿Por qué el primer paso es aclarar requisitos y no dibujar?', a: 'Porque el enunciado siempre es ambiguo a propósito y hay varios sistemas distintos que lo cumplirían. Sin acotar usuarios, volumen y restricciones puedes diseñar algo correcto para un problema que nadie te pidió, que es el error que más penaliza.' },
        { q: '¿Cuál es el argumento de MonolithFirst?', a: 'Que no conoces los límites reales de los módulos hasta que has construido el sistema y lo has visto evolucionar, así que partirlo en servicios al principio produce fronteras equivocadas que luego son carísimas de mover. Es más fácil extraer un servicio de un monolito bien modularizado que reunir servicios mal cortados.' },
        { q: '¿Qué haces si el entrevistador no responde a una pregunta tuya?', a: 'Tomas una suposición razonable, la dices en voz alta y sigues diseñando sobre ella. Dejar la decisión en el aire bloquea el resto de la conversación, y una suposición explícita siempre se puede revisar después.' },
        { q: '¿Por qué la pregunta de si las clínicas comparten datos cambia todo el diseño?', a: 'Porque determina el modelo de datos, el aislamiento, la seguridad y la forma de escalar: con datos aislados puedes repartir clínicas entre bases distintas con facilidad, y con datos compartidos necesitas filtrado por inquilino en cada consulta y un único esquema que crece con todos.' }
      ],
      out: 'Plantilla personal del paso 1 escrita, dos enunciados practicados y la decisión de multi-inquilino de VetCare documentada.',
      file: 'docs/diseno-sistemas.md'
    },
    {
      t: 'Estimar: los números que debes saber de memoria',
      obj: 'Calcular tráfico, almacenamiento y ancho de banda de VetCare a escala, y saber de memoria las magnitudes de referencia.',
      why: 'Es el paso que separa una respuesta vaga de una fundamentada. Decir "con 200 clínicas son unas 60 peticiones por segundo en pico, que caben de sobra en un servidor" cambia por completo el tono de la conversación.',
      study: { r: 5, what: 'Lee la tabla y memoriza los órdenes de magnitud: memoria, SSD, disco y red. Unos 12 minutos. No memorices cifras exactas, memoriza las proporciones: leer de memoria es unas mil veces más rápido que una lectura aleatoria de SSD, y un viaje entre continentes es unas mil veces más lento que esa lectura de SSD.',
        pasos: [
          'Lee la tabla completa (~3 min).',
          'Calcula tú mismo las proporciones: Main memory reference (100 ns) frente a Read 4K randomly from SSD (150 us), y esa lectura frente a un viaje de ida y vuelta entre continentes (150 ms).',
          'Mira la gráfica "Typical Latency Comparison (Latest x86 Processors)", más abajo en la página (~2 min).',
          'Escribe de memoria, sin mirar, los cinco órdenes de magnitud y comprueba después.',
          'Usa esos números para estimar cuántas peticiones por segundo hace VetCare con 200 clínicas.'
        ] },
      ex: {
        title: 'Estimación completa de VetCare a 200 clínicas',
        body: `--- Números de referencia (de memoria) ---
  Referencia a memoria ..... 0.1 microsegundos (100 ns)
  Leer 1 MB de memoria ..... 250 microsegundos (tabla clásica;
                             hoy bastante menos)
  SSD, lectura aleatoria 4K  150 microsegundos
  Leer 1 MB de SSD ......... 1 milisegundo
  Viaje de red, mismo DC ... 0.5 milisegundos
  Viaje intercontinental ... 150 milisegundos
  Un servidor modesto ...... miles de peticiones/s si son simples
  PostgreSQL, una instancia  miles de escrituras/s con buen esquema

  Al año hay ~31.5 millones de segundos (recordar 30M).

--- 1. Usuarios y tráfico ---
  200 clínicas x 5 empleados = 1.000 usuarios
  Activos a la vez en hora punta: ~30% = 300
  Acciones por usuario activo: ~1 cada 20 s = 0.05 req/s
  => 300 x 0.05 = 15 req/s de media en punta

  Pico sobre la media: x4  => 60 req/s
  Lecturas frente a escrituras: 90/10
     54 lecturas/s, 6 escrituras/s

  CONCLUSIÓN: 60 req/s. Un solo servidor sobra. No hace falta
  nada exótico. Decirlo así vale más que dibujar diez cajas.

--- 2. Almacenamiento ---
  Citas: 200 clínicas x 25 citas/día x 250 días = 1.25M al año
  Fila de cita ~ 300 bytes => 375 MB al año
  Visitas con notas ~ 2 KB => 2.5 GB al año
  Mascotas: 200 x 2.000 = 400.000 x 500 B = 200 MB

  Datos estructurados: ~3 GB al año. En 5 años, 15 GB.
  CONCLUSIÓN: cabe en una instancia sin pensarlo.

  Imágenes (radiografías): 200 x 5/día x 250 x 2 MB = 500 GB/año
  CONCLUSIÓN: esto NO va en la base de datos. Va en
  almacenamiento de objetos, y la base guarda la URL.

--- 3. Ancho de banda ---
  Respuesta de agenda ~ 20 KB
  54 lecturas/s x 20 KB = ~1 MB/s = 8 Mbps
  CONCLUSIÓN: trivial. Las imágenes dominan y van por CDN.

--- 4. Memoria para cache ---
  Datos calientes: la agenda de hoy de cada clínica
  200 x 25 citas x 300 B = 1.5 MB
  CONCLUSIÓN: cabe entero en memoria. Si hiciera falta cache,
  sería ridículamente pequeña.

--- CONCLUSIÓN GENERAL ---
  A esta escala el sistema es sencillo: un servidor de API con
  réplica para disponibilidad, una PostgreSQL con réplica de
  lectura si hace falta, y objetos + CDN para imágenes.
  Lo interesante no es la escala: es el aislamiento entre
  clínicas y la consistencia de la agenda.`
      },
      steps: [
        'Memoriza los órdenes de magnitud de la tabla. No las cifras exactas: las proporciones. Lo que tienes que poder decir sin pensar es que leer de memoria es unas mil veces más rápido que una lectura aleatoria de SSD y que un salto entre continentes cuesta más de cien milisegundos.',
        'Haz tu propia estimación de VetCare para 200 clínicas sin mirar el ejemplo. Compara después. Las diferencias no son errores: son suposiciones distintas, y lo importante es que las tuyas estén escritas.',
        'Repite la estimación para 5.000 clínicas y mira qué cambia. Vas a encontrar el punto exacto donde una sola base de datos deja de bastar, y ese punto es la respuesta a "cuándo escalarías".',
        'Estima el almacenamiento de imágenes y calcula el coste aproximado al mes. Es el número que justifica por qué las imágenes no van en la base de datos, y poder decirlo con cifras es muy convincente.',
        'Escribe la estimación completa en docs/diseno-sistemas.md con las cuatro secciones: tráfico, almacenamiento, ancho de banda y memoria, cada una terminando en una conclusión de una frase.'
      ],
      vet: [
        'Compara tu estimación con las mediciones reales de la semana 21. Si tu base aguanta cierto número de peticiones por segundo medidas, ya sabes cuántas clínicas soporta tu implementación actual.',
        'Anota en docs/diseno-sistemas.md el número de clínicas que soportaría VetCare hoy según tus mediciones. Es el dato más honesto que puedes tener sobre tu propio sistema.'
      ],
      edge: [
        'Redondea sin miedo y usa potencias de diez. El objetivo es decidir si necesitas una máquina o cien, no acertar el tercer decimal. Precisión falsa hace perder tiempo y no mejora ninguna decisión.',
        'El pico sobre la media es el factor que más se olvida. Un sistema diseñado para la media se cae todos los días a las nueve de la mañana, cuando toda la recepción abre la agenda a la vez.',
        'Los archivos binarios no van en la base de datos relacional: inflan las copias de seguridad, saturan el cache de páginas y hacen cada consulta más lenta. Van en almacenamiento de objetos con la referencia en la base.'
      ],
      quiz: [
        { q: '¿Cómo estimas peticiones por segundo en pico a partir del número de usuarios?', a: 'Multiplicas usuarios totales por el porcentaje activo simultáneamente, por la frecuencia de acciones de cada uno, y después aplicas un factor de pico sobre la media de entre tres y cinco. El factor de pico es la parte que más se olvida y la que más determina el dimensionado.' },
        { q: '¿Por qué las imágenes no se guardan en la base de datos relacional?', a: 'Porque ocupan órdenes de magnitud más que los datos estructurados, inflan las copias de seguridad, desplazan del cache las páginas que sí se consultan y no aportan nada que la base pueda consultar. Van en almacenamiento de objetos servido por CDN, con solo la URL en la tabla.' },
        { q: '¿Qué proporciones de latencia conviene tener memorizadas y para qué?', a: 'Que leer de memoria es del orden de mil veces más rápido que una lectura aleatoria de SSD y que un viaje intercontinental está en los cientos de milisegundos. Sirven para decidir al instante si merece la pena cachear algo o si hace falta replicar datos cerca del usuario.' },
        { q: '¿Por qué la conclusión de una estimación es tan importante como los números?', a: 'Porque los números solo sirven si llevan a una decisión. "60 peticiones por segundo" no dice nada por sí solo; "60 peticiones por segundo, así que un servidor sobra y el problema real es el aislamiento entre clínicas" es lo que demuestra que entiendes lo que estimaste.' }
      ],
      out: 'Estimación completa de VetCare a 200 y a 5.000 clínicas con conclusión por sección y el punto de ruptura identificado.',
      file: 'docs/diseno-sistemas.md'
    },
    {
      t: 'Escalar: vertical, horizontal y el estado que estorba',
      obj: 'Entender cómo se escala cada capa de verdad y por qué el estado en el servidor es lo que impide añadir máquinas.',
      why: 'Es la pregunta de seguimiento garantizada: "¿y si el tráfico se multiplica por cien?". Responder capa por capa, diciendo qué se rompe primero, es lo que demuestra que entiendes el sistema entero y no solo tu código.',
      study: { r: 3, what: 'Lee la página de high availability de PostgreSQL, solo la comparación de métodos de replicación. Unos 12 minutos. Quédate con la distinción entre replicación síncrona y asíncrona: la síncrona no pierde datos pero cada escritura espera a la réplica, y la asíncrona es rápida pero puede perder las últimas transacciones si cae el primario.',
        pasos: [
          'Lee la introducción del capítulo (~3 min): por qué escalar escrituras es más difícil que escalar lecturas.',
          'Abre "26.1. Comparison of Different Solutions" (~8 min) y fíjate en la tabla final de características.',
          'Copia la diferencia entre replicación síncrona y asíncrona con su coste.',
          'Para cada capa de VetCare (web, API, base de datos) escribe si escala en horizontal y qué estado lo impide.'
        ] },
      ex: {
        title: 'Escalar capa por capa, en el orden en que se rompe',
        body: `--- Vertical frente a horizontal ---
  Vertical: una máquina más grande.
    + simple, no cambia el código, no añade consistencia eventual
    - tiene techo, y el precio sube más rápido que la potencia
    => es la primera opción y casi siempre la correcta al principio

  Horizontal: más máquinas.
    + sin techo práctico, tolera la caída de una
    - exige que el servicio no guarde estado, añade red y latencia
    => necesario a partir de cierto punto, pero tiene coste real

--- CAPA 1: API. Fácil de escalar SOLO SI no tiene estado ---

  // MAL: el servidor recuerda cosas en memoria
  private static readonly Dictionary<string, Carrito> _sesiones = new();
  // Con dos servidores detrás de un balanceador, la petición
  // siguiente puede caer en el otro y el estado no está.

  // BIEN: el estado vive fuera del proceso
  //   - sesión en el token JWT (semana 18) o en un almacén compartido
  //   - datos en PostgreSQL
  //   - cache en un servicio de cache compartido
  // Así cualquier servidor puede atender cualquier petición
  // y añadir máquinas es cambiar un número.

  Ojo: el procesador de outbox de la semana 14 SÍ tiene estado
  de ejecución. Con dos instancias procesarían el mismo mensaje
  dos veces. Por eso usabas SELECT ... FOR UPDATE SKIP LOCKED:
  la base es la que coordina.

--- CAPA 2: Lecturas de base de datos. Réplicas ---

  Primario (escrituras) --async--> Réplica 1 (lecturas)
                        --async--> Réplica 2 (lecturas)

  Consecuencia que hay que saber nombrar: retardo de replicación.
  Creas una cita y la lees de una réplica 50 ms después: puede
  no estar. Soluciones:
    a) leer del primario justo después de escribir
    b) devolver el objeto creado en la respuesta del POST
    c) aceptar el retardo donde no importe
  En VetCare la (b) es la mejor: el POST ya devuelve la cita.

--- CAPA 3: Escrituras de base de datos. Lo difícil ---

  Una sola primaria acepta miles de escrituras/s. VetCare
  necesita 6/s. No vas a llegar nunca al límite, y decir esto
  en una entrevista es una respuesta madura, no una evasión.

  Si llegaras, en orden:
    1. optimizar consultas e índices (semana 21)
    2. mover lo que no es crítico a una cola (outbox, semana 14)
    3. particionar tablas por fecha
    4. fragmentar por clínica  <- último recurso

--- CAPA 4: Lo que se rompe primero de verdad ---
  Casi nunca es la CPU. Es el pool de conexiones, el almacenamiento
  de archivos, una dependencia externa lenta o una consulta sin
  índice. Lo sabes porque lo mides (semana 22), no porque lo supongas.`
      },
      steps: [
        'Busca estado en tu API: campos estáticos, variables de clase que acumulan, cache en memoria del proceso, archivos temporales locales. Cada uno es algo que impide añadir una segunda instancia.',
        'Decide para cada estado que encuentres si lo mueves fuera o si lo justificas. La cache en memoria de la semana 21 es aceptable si cada instancia tiene la suya y los datos son poco cambiantes, sabiendo que al invalidar solo se borra en UNA instancia: las demás sirven el valor viejo hasta que caduca (HybridCache solo coordina instancias si le añades una cache distribuida, como Redis). Una sesión en memoria no es aceptable nunca.',
        'Arranca dos instancias de tu API en compose cambiando los puertos y mándales peticiones alternadas. Si algo se rompe, has encontrado estado oculto que no habías detectado leyendo.',
        'Escribe en docs/diseno-sistemas.md el orden en que escalarías VetCare: qué capa, con qué técnica, a partir de qué número medido y con qué consecuencia. El número medido es lo que lo convierte en un plan y no en una lista.',
        'Para la capa de lecturas, escribe qué harás con el retardo de replicación. En VetCare la respuesta buena es devolver el objeto creado en el POST, y saber nombrar el problema vale más que la solución.'
      ],
      vet: [
        'Revisa el procesador de outbox de la semana 14 y confirma que SELECT FOR UPDATE SKIP LOCKED le permite tener varias instancias sin procesar el mismo mensaje dos veces. Explícalo por escrito.',
        'Añade a docs/diseno-sistemas.md una sección de qué se rompe primero en VetCare según tus mediciones de la semana 21. Casi seguro es el pool de conexiones y no la CPU.'
      ],
      edge: [
        'Escalar vertical es la primera opción y con mucha frecuencia la correcta: una máquina el doble de grande es infinitamente más simple que dos máquinas coordinadas y no introduce ningún problema de consistencia.',
        'Las réplicas de lectura no escalan las escrituras, y la gente las propone como si lo hicieran. Si tu problema son las escrituras, añadir réplicas solo añade retardo y confusión.',
        'El estado compartido en memoria de un proceso es la razón número uno por la que un servicio no se puede escalar horizontalmente. Y suele estar escondido en un campo estático que parece inocente.'
      ],
      quiz: [
        { q: '¿Por qué el estado en memoria del servidor impide escalar horizontalmente?', a: 'Porque cada instancia tiene su propia memoria y el balanceador puede enviar peticiones consecutivas del mismo usuario a instancias distintas, que no conocen lo que guardó la otra. El estado tiene que vivir en un sitio compartido o en el propio token del cliente.' },
        { q: '¿Qué es el retardo de replicación y cómo se maneja?', a: 'Es el tiempo que tarda una escritura del primario en aparecer en las réplicas asíncronas, durante el cual una lectura en la réplica puede no ver el dato recién escrito. Se maneja leyendo del primario justo después de escribir, devolviendo el objeto creado en la respuesta, o aceptando el retardo donde no tenga consecuencias.' },
        { q: '¿Por qué las réplicas de lectura no resuelven un problema de escrituras?', a: 'Porque todas las escrituras siguen yendo al primario, que es el único que las acepta; las réplicas solo reparten la carga de lectura. Si el cuello está en las escrituras, la solución pasa por optimizar, mover trabajo a colas, particionar o fragmentar.' },
        { q: '¿Cuándo es correcto escalar verticalmente en vez de horizontalmente?', a: 'Casi siempre al principio: mientras una máquina más grande resuelva el problema, es la opción más simple, no exige cambiar el código y no introduce consistencia eventual ni coordinación. Se pasa a horizontal cuando se alcanza el techo de la máquina o cuando necesitas tolerar la caída de una.' }
      ],
      out: 'Estado del servidor identificado y resuelto, dos instancias funcionando, y el plan de escalado por capas con números medidos.',
      file: 'docs/diseno-sistemas.md'
    },
    {
      t: 'Consistencia, CAP y lo que de verdad significa eventual',
      obj: 'Entender el teorema CAP sin los malentendidos habituales y decidir para cada dato de VetCare cuánta consistencia necesita.',
      why: 'Es el tema donde más gente repite frases sin entenderlas. Explicar que la elección solo aparece durante una partición de red, y que la mayoría de sistemas eligen por dato y no globalmente, te distingue inmediatamente.',
      study: { r: 6, what: 'Lee el artículo de Eric Brewer, el autor de CAP, sobre cómo se malinterpreta el teorema. Unos 15 minutos. La idea que corrige casi todos los errores: CAP no dice que elijas dos de tres siempre; dice que cuando la red se parte tienes que elegir entre responder con datos posiblemente viejos o no responder.',
        pasos: [
          'Lee la introducción y la sección sobre por qué 2 de 3 es engañoso (~5 min).',
          'Lee "Cap-latency connection" (~3 min): en la práctica, una partición es un timeout.',
          'Lee "Managing partitions" (~4 min): detectar la partición, operar en modo limitado y recuperar.',
          'Para cada dato de VetCare (citas, historial, facturas, catálogo) decide: ¿en una partición, prefieres responder con datos viejos o no responder?'
        ] },
      ex: {
        title: 'Consistencia decidida dato por dato en VetCare',
        body: `--- CAP, bien entendido ---
  C (consistencia): todos los nodos ven el mismo dato.
  A (disponibilidad): todos responden algo.
  P (partición): la red entre nodos se corta.

  La partición NO se elige: ocurre. Lo que eliges es qué
  hacer durante ella.
    CP = rechazo peticiones antes que servir datos viejos
    AP = sirvo lo que tengo aunque esté desactualizado

  Si no hay partición, tienes C y A a la vez sin problema.
  Por eso en un sistema de una sola base de datos CAP casi
  no aplica: hablar de CAP ahí es una señal de no entenderlo.

--- Tipos de consistencia, de más fuerte a más débil ---
  Fuerte ......... toda lectura ve la última escritura
  Lectura propia . yo veo lo mío al instante, los demás tardan
  Eventual ....... todos convergen si dejan de escribir

--- Decisión por dato en VetCare ---

| Dato                  | Consistencia   | Por qué                      |
|-----------------------|----------------|------------------------------|
| Hueco de agenda       | FUERTE         | dos citas en el mismo hueco  |
|                       |                | es un error real de negocio  |
| Historial clínico     | FUERTE         | decisión médica sobre el dato|
| Factura emitida       | FUERTE         | dinero                       |
| Lista de veterinarios | eventual (min) | cambia una vez al mes        |
| Contador de citas     | eventual (seg) | es informativo               |
| Notificación enviada  | eventual       | ya la haces asíncrona con    |
|                       |                | outbox (semana 14)           |

  La agenda exige consistencia fuerte, y por eso tu constraint
  EXCLUDE de PostgreSQL es la decisión de diseño más importante
  de todo VetCare: delega la garantía al único sitio que puede
  darla de verdad bajo concurrencia.

--- Por qué no vale "lo compruebo antes de insertar" ---
  Hilo A: SELECT -> hueco libre
  Hilo B: SELECT -> hueco libre
  Hilo A: INSERT -> ok
  Hilo B: INSERT -> ok      <- dos citas en el mismo hueco

  La comprobación y la escritura no son atómicas. Solo lo
  resuelve una restricción en la base o un bloqueo explícito.
  Esto es exactamente lo que probaste en la semana 10.

--- Idempotencia como respuesta práctica ---
  En un sistema distribuido no sabes si tu petición llegó:
  el fallo pudo ser antes o después de procesarla. Por eso
  la Idempotency-Key de la semana 14 no es un lujo: es la
  única forma de que reintentar sea seguro.`
      },
      steps: [
        'Escribe la tabla de consistencia de VetCare: para cada tipo de dato, qué nivel necesita y por qué. La columna del por qué es la que importa, porque es lo que te van a preguntar.',
        'Explica por escrito, con la secuencia de hilos del ejemplo, por qué comprobar antes de insertar no evita la cita duplicada. Es la demostración más clara de por qué necesitas la restricción en la base.',
        'Verifica en tu código que todo dato que marcaste como consistencia fuerte está protegido por una restricción de base de datos o una transacción, no solo por una comprobación en C#.',
        'Para los datos de consistencia eventual, escribe cuánto tiempo de retraso es aceptable en cada uno. Un número concreto convierte "eventual" de excusa en decisión de diseño.',
        'Escribe la definición correcta de CAP con tus palabras, incluyendo la aclaración de que la elección solo aparece durante una partición. Si no puedes explicarlo en tres frases, reléelo.'
      ],
      vet: [
        'Escribe un ADR nuevo (ADR-009) sobre el constraint EXCLUDE de la semana 10, con la justificación en términos de consistencia: es la frontera donde VetCare exige garantía fuerte y por qué ninguna comprobación en el código puede darla.',
        'Repasa dónde usas la Idempotency-Key y escribe en docs/diseno-sistemas.md por qué es la pieza que hace seguros los reintentos de la semana 14.'
      ],
      edge: [
        'CAP no es "elige dos de tres" como eslogan permanente: la partición no es una opción sino un evento, y la elección real es entre consistencia y disponibilidad mientras ese evento dura.',
        'Consistencia eventual no significa "a veces los datos están mal". Significa que convergen si cesan las escrituras, y que durante un intervalo acotado puedes leer un valor antiguo. Si ese intervalo no está acotado ni medido, no es un diseño.',
        'La consistencia fuerte no es gratis: cuesta latencia, coordinación y disponibilidad durante los fallos. Pedirla para todo es tan mal diseño como no pedirla nunca.'
      ],
      quiz: [
        { q: '¿Qué dice realmente el teorema CAP?', a: 'Que cuando la red entre nodos se parte, un sistema distribuido tiene que elegir entre seguir respondiendo con datos posiblemente desactualizados o rechazar peticiones para no violar la consistencia. Sin partición puedes tener consistencia y disponibilidad a la vez, así que la elección solo aparece durante el fallo.' },
        { q: '¿Por qué comprobar antes de insertar no evita una cita duplicada?', a: 'Porque entre la comprobación y la inserción otro hilo puede hacer la misma comprobación y obtener el mismo resultado, de modo que los dos insertan. La comprobación y la escritura no son atómicas, así que la garantía tiene que venir de una restricción en la base o de un bloqueo explícito.' },
        { q: '¿Qué significa consistencia eventual y qué hace falta para que sea un diseño y no una excusa?', a: 'Significa que todas las réplicas convergen al mismo valor si dejan de llegar escrituras, de modo que durante un intervalo se puede leer un dato antiguo. Para ser un diseño necesita que ese intervalo esté acotado, medido y documentado como aceptable para ese dato concreto.' },
        { q: '¿Por qué la idempotencia es imprescindible en un sistema distribuido?', a: 'Porque cuando una petición falla no sabes si el fallo ocurrió antes o después de que el servidor la procesara, así que reintentar puede duplicar el efecto. Una clave de idempotencia permite que el servidor reconozca el reintento y devuelva el resultado original en vez de ejecutar dos veces.' }
      ],
      out: 'Tabla de consistencia por dato con justificación, demostración escrita de la condición de carrera y verificación de que las garantías fuertes están en la base.',
      file: 'docs/diseno-sistemas.md'
    },
    {
      t: 'Las piezas del armario: cuándo usar cada una',
      obj: 'Conocer las piezas típicas de una arquitectura y, sobre todo, saber cuándo NO usarlas.',
      why: 'Todo el mundo sabe nombrar cola, cache y CDN. Lo que se evalúa es si sabes cuándo no hacen falta. Decir "no añadiría una cola aquí porque el volumen no lo justifica y el pedido debe confirmarse al instante" vale más que dibujarla.',
      study: { r: 2, what: 'Lee la página de caching best practices y la parte de CDN. Unos 12 minutos. Fíjate en las capas: navegador, CDN, cache de aplicación, cache de base de datos. Cada una tiene un uso distinto y la mayoría de la gente solo piensa en la tercera.',
        pasos: [
          'Lee "How to apply caching" (~3 min).',
          'Lee "Lazy caching" y "Write-through" (~4 min) y escribe cuándo usarías cada uno en VetCare.',
          'Lee "Time-to-live" y "Evictions" (~3 min).',
          'Lee "The thundering herd" (~2 min): el mismo problema de estampida que viste con HybridCache.',
          'Lee la parte de "Amazon CloudFront" (~1 min) para situar la CDN como la capa más cercana al usuario.'
        ] },
      ex: {
        title: 'Seis piezas, con el caso de uso y el caso de no uso',
        body: `--- BALANCEADOR DE CARGA ---
  Para: repartir tráfico, sobrevivir a la caída de una instancia,
        terminar TLS, hacer despliegues sin corte.
  No lo necesitas si: una sola instancia te sobra y aceptas el
        corte del despliegue (VetCare hoy, semana 20).

--- CDN ---
  Para: archivos estáticos, imágenes, usuarios geográficamente
        repartidos. Es la mejora de latencia más barata que existe.
  No lo necesitas si: todo tu tráfico es dinámico y tus usuarios
        están en una sola región.
  En VetCare: SÍ, para radiografías y para el paquete de la web.

--- CACHE COMPARTIDA (Redis o similar) ---
  Para: datos caros de calcular, muy leídos, tolerables algo
        viejos. También sesiones compartidas y rate limiting
        entre varias instancias.
  No lo necesitas si: una cache en memoria por instancia basta,
        o si el dato no tolera estar viejo (semana 21).
  En VetCare: solo si pasas a varias instancias y necesitas que
        el rate limiting de login sea global.

--- COLA DE MENSAJES ---
  Para: desacoplar trabajo lento del ciclo de la petición,
        absorber picos, reintentar sin bloquear al usuario.
  No lo necesitas si: el trabajo es rápido, el usuario necesita
        el resultado ya, o tu outbox en PostgreSQL basta.
  En VetCare: tu tabla outbox YA es una cola. Suficiente a esta
        escala, y decirlo demuestra criterio.

--- BUSCADOR (Elasticsearch o similar) ---
  Para: búsqueda de texto libre, relevancia, facetas, agregaciones
        sobre muchos documentos.
  No lo necesitas si: PostgreSQL con tsvector o pg_trgm te cumple.
        Y a tu escala te cumple.
  En VetCare: NO. Un índice GIN resuelve la búsqueda de mascotas
        y te ahorra un sistema entero que mantener y sincronizar.

--- ALMACENAMIENTO DE OBJETOS ---
  Para: archivos binarios. Radiografías, PDF de facturas, adjuntos.
  No lo necesitas si: no manejas archivos.
  En VetCare: SÍ, obligatorio. 500 GB al año de imágenes no van
        en una tabla.

================================================================
PRINCIPIO: cada pieza que añades es un sistema más que desplegar,
monitorizar, actualizar, asegurar y que puede fallar a las tres
de la madrugada. El coste no es implementarla: es mantenerla.

La respuesta correcta a "¿añadirías X?" es casi siempre
"todavía no, y te digo el número a partir del cual sí".`
      },
      steps: [
        'Para cada una de las seis piezas, escribe si VetCare la necesita hoy, a 200 clínicas y a 5.000 clínicas. Tres columnas. Vas a ver que la mayoría de las respuestas de hoy son no, y eso es correcto.',
        'Para cada no, escribe el número concreto a partir del cual pasaría a sí. Ese número es lo que convierte tu respuesta en una decisión de ingeniería en vez de una opinión.',
        'Elige la pieza que VetCare sí necesita ya, que es el almacenamiento de objetos para imágenes, y diseña cómo encaja: dónde se guarda la URL, quién autoriza el acceso, cómo se sube el archivo sin pasar por tu API.',
        'Escribe qué mantenimiento real implica cada pieza que añadirías: actualizaciones, copias de seguridad, monitorización, un modo de fallo nuevo. Esa columna es la que casi nadie considera y la que más pesa en la realidad.',
        'Practica en voz alta la respuesta a "¿añadirías una cola de mensajes a VetCare?". La buena respuesta menciona que ya tienes un outbox, por qué basta a esta escala, y a partir de qué volumen cambiarías.'
      ],
      vet: [
        'Decide cómo se sirven las radiografías de VetCare: URLs firmadas con caducidad corta desde el almacenamiento de objetos, en vez de pasar el archivo por tu API. Escribe por qué, conectándolo con la autorización de la semana 18.',
        'Dibuja el diagrama completo de VetCare a 200 clínicas con solo las piezas que has justificado. Guárdalo como diagrama en docs/diseno-sistemas.md con Mermaid.'
      ],
      edge: [
        'Cada pieza nueva añade un modo de fallo que no tenías y que hay que monitorizar, actualizar y asegurar. El coste real de una pieza no es escribir el código que la usa: es operarla durante años.',
        'Añadir un buscador dedicado obliga a sincronizar datos entre dos sistemas, lo que introduce inconsistencia y un trabajo de reindexado que falla. PostgreSQL con índices de texto cubre muchísimos casos reales.',
        'Una cache compartida se convierte en un punto único de fallo si tu aplicación no sabe funcionar sin ella. Diseña siempre el camino sin cache, aunque sea más lento.'
      ],
      quiz: [
        { q: '¿Por qué la respuesta a "¿añadirías esta pieza?" suele ser todavía no?', a: 'Porque cada componente añade coste permanente de operación, un modo de fallo nuevo y más superficie que asegurar, mientras que el beneficio solo aparece por encima de cierto volumen. La respuesta completa incluye el número a partir del cual sí lo añadirías.' },
        { q: '¿Cuándo hace falta un buscador dedicado en lugar de PostgreSQL?', a: 'Cuando necesitas relevancia avanzada, facetas, agregaciones complejas o un volumen de documentos que PostgreSQL no indexa con eficacia. Por debajo de eso, un índice GIN con tsvector o pg_trgm cumple y te ahorra sincronizar dos sistemas.' },
        { q: '¿Por qué tu tabla de outbox ya es una cola?', a: 'Porque hace lo esencial de una cola: persiste el trabajo pendiente, permite procesarlo de forma asíncrona, reintenta lo que falla y con FOR UPDATE SKIP LOCKED coordina varios consumidores. A volumen moderado basta y evita operar un sistema de mensajería aparte.' },
        { q: '¿Por qué las imágenes se sirven con URLs firmadas y no a través de tu API?', a: 'Porque pasar cientos de megas por tu API consume memoria, conexiones y ancho de banda de un servicio que debería dedicarse a datos. Una URL firmada con caducidad corta delega la entrega al almacenamiento y al CDN manteniendo el control de autorización en tu servidor.' }
      ],
      out: 'Tabla de piezas con decisión para hoy, 200 y 5.000 clínicas, el umbral de cada no, y el diagrama de VetCare con solo lo justificado.',
      file: 'docs/diseno-sistemas.md'
    },
    {
      t: 'Diseño completo de VetCare a escala (examen de la semana)',
      obj: 'Ejecutar una entrevista de diseño completa de principio a fin, en voz alta y con tiempo, y dejarla escrita.',
      why: 'Es la única forma de saber si el método funciona en ti. Leer sobre diseño de sistemas y hacer uno entero con reloj son experiencias completamente distintas, y la segunda es la que se evalúa.',
      study: { r: 0, what: 'Repasa tu plantilla del paso 1 y tu estimación. Unos 8 minutos. Hoy no lees nada nuevo: hoy ejecutas los cinco pasos con reloj y te grabas si puedes, porque escucharte es incómodo y es lo que más te mejora.',
        pasos: [
          'Lee el artículo MonolithFirst de Fowler (~5 min): te dará el argumento para la pregunta de microservicios.',
          'Repasa tu plantilla de 5 pasos y tu estimación de la semana.',
          'Pon un temporizador de 45 minutos y ejecuta el diseño completo en voz alta.',
          'Graba la sesión y escúchala después anotando cada momento en que dudaste.'
        ] },
      ex: {
        title: 'Diseño de VetCare a 200 clínicas, resultado completo',
        body: `# Diseño: VetCare para 200 clínicas

## 1. Requisitos
Funcionales (v1): agenda con detección de solape, fichas de
mascota e historial, visitas con documentos, facturación básica,
tres roles. Fuera de alcance: acceso de dueños, app móvil,
funcionamiento sin internet, integración con laboratorios.

No funcionales: 1.000 usuarios internos, 60 req/s en pico,
90% lecturas. Agenda consistente al instante. Historial clínico
es dato regulado: cifrado y auditoría de accesos. Objetivo de
disponibilidad 99.5%, latencia p95 de agenda < 300 ms.

Suposiciones: clínicas aisladas entre sí; requiere internet;
una sola región geográfica.

## 2. Estimación
60 req/s en pico, 6 escrituras/s.
3 GB/año de datos estructurados, 15 GB en 5 años.
500 GB/año de imágenes.
Conclusión: el volumen no es el reto. El reto es el aislamiento
entre clínicas y la consistencia de la agenda.

## 3. Diseño general
    Navegador -> CDN (estáticos, imágenes)
              -> Balanceador -> API x2 (sin estado)
                                 |-> PostgreSQL primario
                                 |     +-- réplica (lectura y
                                 |         conmutación)
                                 |-> Objetos (radiografías)
                                 +-- Outbox -> notificaciones

Multi-inquilino: una base con clinica_id en cada tabla y filtro
obligatorio en cada consulta, más política de fila en PostgreSQL
como segunda red. Alternativa descartada: una base por clínica,
porque 200 esquemas y 200 migraciones no se operan con un equipo
pequeño.

## 4. Profundizar: el endpoint crítico
POST /api/v1/citas
  1. Autenticar, obtener clinica_id del token (nunca del cuerpo)
  2. Validar entrada (semana 19)
  3. Idempotency-Key para que el reintento sea seguro (semana 14)
  4. INSERT; el constraint EXCLUDE con clinica_id garantiza que
     no haya solape bajo concurrencia
  5. SqlState 23P01 -> 409 con problem details (semana 11)
  6. Evento a outbox para la notificación, en la misma transacción
  7. Devolver la cita creada, para evitar el retardo de réplica

## 5. Cuellos de botella y compromisos
Lo que se rompe primero: el pool de conexiones, medido en la
semana 21, no la CPU. Mitigación: ajustar el pool y eliminar
consultas lentas antes de añadir máquinas.

Siguiente límite: a unas 5.000 clínicas el primario de escritura
empieza a notarse. Entonces: particionar cita por mes y, solo
después, fragmentar por clinica_id, que ya es la clave natural.

Compromisos aceptados:
  - Una región: usuarios lejanos tienen peor latencia. Aceptado.
  - Réplica asíncrona: ventana de pérdida de segundos ante caída
    del primario. Aceptado para esta escala.
  - Monolito modular, no microservicios: el equipo es pequeño y
    los límites de módulo ya están definidos (semana 15). Se
    extraería un servicio solo si un módulo necesitara escalar
    o desplegarse por separado.`
      },
      steps: [
        'Pon un temporizador de 45 minutos y haz el diseño completo de VetCare a 200 clínicas en voz alta, respetando los cinco pasos y sus tiempos. No pares aunque te atasques: seguir hablando es parte de lo que entrenas.',
        'Escribe el resultado en docs/diseno-vetcare-escala.md con las cinco secciones. Compáralo con el ejemplo solo después de haber hecho el tuyo.',
        'Repite el ejercicio con un enunciado distinto y sin relación con VetCare: un acortador de URLs, un sistema de reservas o un feed de notificaciones. Treinta minutos. El objetivo es comprobar que el método funciona fuera de tu dominio conocido.',
        'Verifica la lista de la semana: plantilla del paso 1 escrita, estimación a dos escalas con conclusiones, plan de escalado por capas con números medidos, tabla de consistencia por dato, tabla de piezas con umbrales, diagrama justificado y un diseño completo escrito.',
        'Grábate explicando el paso 5, los compromisos, durante tres minutos. Escúchate. Esa sección es la que distingue a alguien que entiende de alguien que memorizó, porque es la única donde tienes que admitir lo que sacrificaste.',
        'Anota las tres preguntas que te dejaron en blanco durante el ejercicio. Esas son tu material de estudio para la semana 24, más valiosas que cualquier lista genérica de temas.'
      ],
      vet: [
        'Añade el diagrama Mermaid de la arquitectura a escala en docs/diseno-vetcare-escala.md y enlázalo desde el README. Es de lo primero que mira alguien que evalúa tu proyecto.',
        'Compara el diseño a escala con tu implementación real y escribe las tres diferencias más grandes. Saber en qué se diferencia lo que construiste de lo que construirías es una respuesta excelente en una entrevista.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/diseno-vetcare-escala.md dentro de una semana.'
      ],
      edge: [
        'Un diseño sin compromisos declarados es un diseño que no has entendido. Siempre sacrificas algo: latencia, consistencia, coste o simplicidad operativa. Si no puedes nombrarlo, falta análisis.',
        'No propongas tecnología concreta antes de haber justificado la necesidad. Decir el nombre de un producto en el minuto tres, antes de la estimación, es la señal más clara de que estás recitando en vez de diseñando.',
        'El reloj importa. Un diseño excelente que se queda en el paso 2 porque te extendiste puntúa peor que uno completo y razonable. Practicar con tiempo es parte del ejercicio, no un detalle.'
      ],
      quiz: [
        { q: '¿Cuáles son los cinco pasos de un diseño de sistemas y cuánto dura cada uno?', a: 'Aclarar requisitos unos cinco minutos, estimar otros cinco, diseño general quince, profundizar en lo que pida el entrevistador quince, y cuellos de botella con compromisos cinco. Los dos primeros parecen prescindibles y son los que determinan si el resto tiene sentido.' },
        { q: '¿Por qué el paso de compromisos es el más revelador?', a: 'Porque obliga a decir qué has sacrificado y por qué, lo que solo puede hacer quien entiende de verdad las consecuencias de sus decisiones. Un diseño presentado como si no tuviera inconvenientes delata que no se analizó.' },
        { q: '¿Por qué en VetCare se descarta una base por clínica a favor de multi-inquilino?', a: 'Porque doscientas bases implican doscientas migraciones, doscientos juegos de copias de seguridad y doscientos puntos de monitorización, que es un coste operativo imposible para un equipo pequeño. Con una base compartida y clinica_id más política de fila consigues el aislamiento a mucho menor coste.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que el diseño de sistemas es un método y no un catálogo: preguntas antes de dibujar, estimas para saber si el problema que imaginas existe de verdad, eliges consistencia dato por dato en vez de globalmente, y justificas cada pieza con el número a partir del cual hace falta y el coste de operarla.' }
      ],
      out: 'Un diseño completo de VetCare a escala escrito y defendido en voz alta, un segundo enunciado practicado, y las tres lagunas identificadas para la semana 24.',
      file: 'docs/diseno-vetcare-escala.md'
    }
  ]
}
]);
