window.WEEKS = (window.WEEKS || []).concat([
{
  n: 4, phase: 'Modelado de dominio', title: 'Relaciones, integridad y normalización',
  idea: 'Las relaciones mal modeladas no fallan el primer día: fallan el día que tienes 10.000 filas y descubres que el mismo dato está en tres sitios y los tres dicen algo distinto.',
  res: [
    { t: 'Wikipedia — Database normalization', u: 'https://en.wikipedia.org/wiki/Database_normalization', note: 'Lee solo 1NF, 2NF y 3NF. Las formas superiores casi nunca se usan en la práctica.' },
    { t: 'PostgreSQL — Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html', note: 'Doc oficial de PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK y NOT NULL.' },
    { t: 'Mermaid — ER diagrams', u: 'https://mermaid.js.org/syntax/entityRelationshipDiagram.html', note: 'Para actualizar tu ERD esta semana.' },
    { t: 'Martin Fowler — Aggregate / DDD', u: 'https://martinfowler.com/bliki/DDD_Aggregate.html', note: 'Qué es un agregado y por qué define la frontera de consistencia.' }
  ],
  days: [
    {
      t: 'Relaciones 1:1 y 1:N',
      obj: 'Implementar correctamente las relaciones uno-a-uno y uno-a-muchos de VetCare, decidiendo dónde vive la clave foránea.',
      why: 'La pregunta "en qué tabla va la clave foránea" parece trivial y determina si tus consultas serán simples o un infierno de joins. Es una de las decisiones más prácticas del modelado.',
      study: { r: 1, what: 'Lee la sección "Foreign Keys" de la doc de PostgreSQL (~10 min). Fíjate especialmente en ON DELETE y ON UPDATE.',
        pasos: [
          'Lee "Foreign Keys" desde el principio hasta el ejemplo de orders y products (~5 min).',
          'Sigue leyendo la parte de ON DELETE y ON UPDATE (~4 min) y apunta qué hace RESTRICT, NO ACTION, CASCADE, SET NULL y SET DEFAULT.',
          'Fíjate en la nota sobre crear un índice en la columna que referencia: PostgreSQL no lo crea solo.',
          'Escribe para cada relación la frase: si borro X, ¿qué debe pasar con sus Y? La respuesta decide la política.'
        ] },
      ex: {
        title: 'Dónde va la clave foránea',
        body: `REGLA 1:N -> la FK va SIEMPRE en el lado "muchos".

  DUEÑO (1) ---- (N) MASCOTA

  mascota.dueno_id -> dueno.id      CORRECTO
  dueno.mascota_id                  IMPOSIBLE: un dueño
                                    tiene varias mascotas,
                                    no cabe en una columna.

REGLA 1:1 -> la FK va en el lado OPCIONAL o el que
             se consulta menos.

  CITA (1) ---- (0..1) VISITA

  visita.cita_id -> cita.id   CORRECTO: la visita puede
                              no existir todavía.
  cita.visita_id              MALO: la mayoría de citas
                              tendrían NULL.

  Ojo: para que sea 1:1 de verdad, visita.cita_id lleva
  UNIQUE. Sin él, una cita podría tener dos visitas (1:N):

    cita_id uuid UNIQUE REFERENCES cita(id)

  Sin NOT NULL, porque una urgencia no tiene cita
  (semana 3).

SQL resultante:

  CREATE TABLE mascota (
    id         uuid PRIMARY KEY,
    nombre     varchar(60) NOT NULL,
    dueno_id   uuid NOT NULL REFERENCES dueno(id)
                 ON DELETE RESTRICT
  );

ON DELETE RESTRICT = no dejes borrar un dueño que
todavía tiene mascotas. En VetCare eso es lo correcto:
proteges el historial.`
      },
      steps: [
        'Lista todas tus relaciones 1:1 y 1:N y escribe en qué tabla va la FK y por qué.',
        'Para cada FK elige la política ON DELETE: RESTRICT, CASCADE o SET NULL, y justifícala con una regla de negocio.',
        'Escribe el CREATE TABLE de 3 de tus entidades con las FK ya puestas.'
      ],
      vet: [
        'Crea database/schema-draft.sql con los CREATE TABLE de tus entidades principales.',
        'Agrega a docs/domain-model.md una tabla: relación, dónde va la FK, política de borrado, motivo.'
      ],
      edge: [
        'CASCADE es cómodo y peligroso: borrar un dueño borraría sus mascotas y con ellas el historial médico que por ley debes conservar.',
        'Una relación 1:1 verdadera es rara. Si aparece, pregunta por qué no es una sola tabla: suele ser separación por rendimiento o por seguridad.'
      ],
      quiz: [
        { q: '¿En una relación 1:N, en qué lado va la clave foránea y por qué?', a: 'En el lado "muchos". Porque una columna solo guarda un valor: mascota.dueno_id puede apuntar a su único dueño, pero dueño no podría guardar N mascotas en una columna.' },
        { q: '¿Cuándo usarías ON DELETE CASCADE y cuándo RESTRICT?', a: 'CASCADE cuando el hijo no tiene sentido sin el padre y no hay valor histórico (líneas de un carrito borrado). RESTRICT cuando el hijo tiene valor propio o legal, como el historial médico de VetCare.' },
        { q: '¿Qué significa ON DELETE SET NULL y cuándo sirve?', a: 'Que al borrar el padre, la FK del hijo pasa a null. Sirve cuando la relación es opcional y el hijo tiene sentido sin el padre: si se elimina una sala de consulta, la cita conserva todo lo demás y solo pierde la sala. No lo uses con veterinarios: perderías quién atendió cada cita. Ahí lo correcto es el borrado lógico.' },
        { q: '¿Por qué una relación 1:1 suele ser sospechosa?', a: 'Porque normalmente los dos lados podrían estar en la misma tabla. Si están separados debe haber un motivo explícito: columnas muy grandes que se consultan poco, datos sensibles con permisos distintos, o un ciclo de vida diferente.' }
      ],
      out: 'database/schema-draft.sql con 3+ CREATE TABLE y tabla de políticas de borrado justificadas.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Relaciones N:N y tablas puente',
      obj: 'Modelar las relaciones muchos-a-muchos de VetCare con tablas puente que lleven sus propios datos.',
      why: 'La tabla puente casi nunca es solo dos columnas. Descubrir que necesita atributos propios es el momento en que entiendes que era una entidad del negocio disfrazada.',
      study: { r: 1, what: 'Relee PRIMARY KEY compuesta y UNIQUE en la doc de constraints (~8 min).',
        pasos: [
          'Relee "Primary Keys" (~3 min), fijándote en las claves de varias columnas.',
          'Relee "Unique Constraints" (~3 min): cómo impedir duplicados de una pareja de columnas.',
          'Vuelve a "Foreign Keys" y busca el ejemplo de order_items: es exactamente una tabla puente (~2 min).',
          'Para cada N:N pregunta: ¿puede repetirse la misma pareja en distintas fechas? Si sí, necesita Id propio.'
        ] },
      ex: {
        title: 'La tabla puente que resulta ser una entidad',
        body: `Relación: una MASCOTA recibe muchos TRATAMIENTOS,
y un TRATAMIENTO se aplica a muchas MASCOTAS.

PRIMER INTENTO (puente tonto):
  CREATE TABLE mascota_tratamiento (
    mascota_id     uuid REFERENCES mascota(id),
    tratamiento_id uuid REFERENCES tratamiento(id),
    PRIMARY KEY (mascota_id, tratamiento_id)
  );

Pero el negocio pregunta: ¿cuándo se aplicó? ¿qué dosis?
¿qué veterinario lo aplicó? ¿se repitió el mes siguiente?

La PK compuesta impide repetir el mismo tratamiento.
Y eso es falso: una mascota puede recibir la misma
vacuna cada año.

SEGUNDO INTENTO (es una entidad real):
  CREATE TABLE aplicacion_tratamiento (
    id             uuid PRIMARY KEY,
    mascota_id     uuid NOT NULL REFERENCES mascota(id),
    tratamiento_id uuid NOT NULL REFERENCES tratamiento(id),
    veterinario_id uuid NOT NULL REFERENCES veterinario(id),
    fecha          date NOT NULL,
    dosis_mg       decimal(8,2),
    UNIQUE (mascota_id, tratamiento_id, fecha)
  );

Ahora tiene Id propio, atributos propios y nombre del
negocio. Dejo de llamarla "tabla puente": es una entidad.`
      },
      steps: [
        'Encuentra todas las relaciones N:N de VetCare (deberías tener al menos 2).',
        'Para cada una pregunta: ¿la relación tiene atributos propios? ¿se puede repetir en el tiempo?',
        'Escribe el CREATE TABLE: PK compuesta si es una relación pura, Id propio si tiene vida propia.'
      ],
      vet: [
        'Agrega las tablas N:N a database/schema-draft.sql.',
        'Actualiza el ERD de docs/domain-model.md con las nuevas entidades que descubriste.'
      ],
      edge: [
        'Si la relación se puede repetir en el tiempo, la PK compuesta de dos columnas es un bug esperando: te impedirá registrar la vacuna del año siguiente.',
        'Una tabla puente con nombre técnico (mascota_tratamiento) casi siempre tiene un nombre de negocio mejor (AplicacionTratamiento, Prescripción).'
      ],
      quiz: [
        { q: '¿Por qué una relación N:N necesita una tercera tabla?', a: 'Porque una columna no puede guardar múltiples referencias. La tabla puente convierte la relación N:N en dos relaciones 1:N, que sí se pueden representar con claves foráneas.' },
        { q: '¿Cuándo la tabla puente debe tener Id propio en vez de PK compuesta?', a: 'Cuando la relación tiene atributos propios, puede repetirse en el tiempo, o necesita ser referenciada por otra tabla. En ese momento deja de ser una unión y pasa a ser una entidad del dominio.' },
        { q: '¿Qué problema causa una PK compuesta (mascota_id, tratamiento_id)?', a: 'Impide registrar la misma combinación dos veces, lo cual es falso para tratamientos recurrentes como las vacunas anuales. La restricción correcta incluiría la fecha.' },
        { q: '¿Cómo detectas que una tabla puente es en realidad una entidad del negocio?', a: 'Si el usuario tiene un nombre para ella ("la aplicación de la vacuna", "la receta") y si quiere consultarla, listarla o modificarla por sí sola, es una entidad con todas las letras.' }
      ],
      out: 'Tablas N:N en schema-draft.sql, con decisión razonada entre PK compuesta y Id propio.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Integridad referencial y constraints',
      obj: 'Blindar el modelo con constraints para que la base de datos rechace por sí sola los datos imposibles.',
      why: 'Toda validación que solo vive en el código se puede saltar: por un script, por otra app, por un bug. La base de datos es la última línea de defensa y nunca se olvida de validar.',
      study: { r: 1, what: 'Lee la doc de constraints entera (~15 min): CHECK, NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, EXCLUDE.',
        pasos: [
          'Lee "Check Constraints" (~4 min): fíjate en cómo poner nombre a una constraint con CONSTRAINT nombre.',
          'Lee "Not-Null Constraints" y "Unique Constraints" (~4 min).',
          'Lee "Primary Keys" y repasa "Foreign Keys" (~4 min).',
          'Lee "Exclusion Constraints" (~2 min) solo para saber que existen: las usarás en la semana 10 para citas que no se solapan.',
          'Abre psql y prueba un CHECK que falle a propósito para ver el mensaje de error con el nombre de la constraint.'
        ] },
      ex: {
        title: 'Constraints que convierten reglas de negocio en garantías',
        body: `Tus reglas de negocio de la semana 1, ahora en SQL:

  CREATE TABLE cita (
    id             uuid PRIMARY KEY,
    mascota_id     uuid NOT NULL REFERENCES mascota(id),
    veterinario_id uuid NOT NULL REFERENCES veterinario(id),
    inicio         timestamptz NOT NULL,
    fin            timestamptz NOT NULL,
    estado         varchar(20) NOT NULL DEFAULT 'CONFIRMADA',

    -- RN: la cita termina después de empezar
    CONSTRAINT ck_cita_rango CHECK (fin > inicio),

    -- RN: solo estados válidos
    CONSTRAINT ck_cita_estado CHECK (
      estado IN ('CONFIRMADA','CANCELADA','ATENDIDA')
    ),

    -- RN: un veterinario no tiene dos citas a la vez
    CONSTRAINT uq_vet_horario UNIQUE (veterinario_id, inicio)
  );

Qué ganaste:
 - Imposible guardar una cita que termina antes de empezar,
   ni desde la API, ni desde un script, ni a mano.
 - Imposible un estado inventado como 'CONFIRMAD'.
 - El choque exacto de horarios (mismo veterinario, misma
   hora de inicio) lo rechaza la base de datos aunque dos
   peticiones lleguen en el mismo milisegundo. Eso el
   código de aplicación solo no lo puede garantizar.`
      },
      steps: [
        'Recorre tus reglas de negocio RN-01..RN-08 y marca cuáles se pueden expresar como constraint.',
        'Agrega a tu schema los CHECK, UNIQUE y NOT NULL correspondientes, con nombres explícitos (ck_, uq_, fk_).',
        'Escribe 5 INSERT que DEBEN fallar y anota qué constraint los rechaza.'
      ],
      vet: [
        'Completa database/schema-draft.sql con todos los constraints nombrados.',
        'Crea database/invalid-inserts.sql con los 5 INSERT que deben ser rechazados, cada uno comentado con la regla que viola.'
      ],
      edge: [
        'Nombra siempre tus constraints. Un error "violates constraint ck_cita_rango" es diagnosticable; uno con nombre autogenerado no lo es.',
        'UNIQUE (veterinario_id, inicio) solo evita el choque exacto. Para solapamientos parciales necesitas una constraint EXCLUDE con rangos, que verás en la semana 10.'
      ],
      quiz: [
        { q: '¿Por qué no basta con validar en el código de la aplicación?', a: 'Porque la base de datos recibe escrituras de más sitios: scripts de migración, otra aplicación, soporte corrigiendo datos a mano, o una condición de carrera entre dos peticiones simultáneas. La constraint cubre todos esos casos.' },
        { q: '¿Qué diferencia hay entre una validación de aplicación y una constraint?', a: 'La de aplicación da buen mensaje de error al usuario y es flexible. La constraint es la garantía dura e inviolable. Se usan las dos: la primera por UX, la segunda por integridad.' },
        { q: '¿Por qué es importante nombrar las constraints?', a: 'Porque el nombre aparece en el error. Con un nombre explícito puedes mapear el error de base de datos a un mensaje útil para el usuario; con uno autogenerado solo puedes mostrar un error genérico.' },
        { q: '¿Qué es la integridad referencial?', a: 'La garantía de que toda clave foránea apunta a una fila que existe. Sin ella acabas con citas de mascotas fantasma, que son bugs imposibles de reproducir porque el dato ya no está.' }
      ],
      out: 'Schema con constraints nombrados + 5 INSERT inválidos documentados con la regla que violan.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Normalización 1FN, 2FN y 3FN',
      obj: 'Normalizar el esquema de VetCare hasta 3FN y saber explicar cuándo conviene romperla a propósito.',
      why: 'Normalizar es el antídoto contra el dato duplicado que se desincroniza. Y saber cuándo NO normalizar es lo que distingue a quien lo entendió de quien lo memorizó.',
      study: { r: 0, what: 'Lee solo las secciones 1NF, 2NF y 3NF (~15 min). Ignora BCNF y superiores por ahora. Clave: cada forma normal elimina un tipo concreto de duplicación.',
        pasos: [
          'Lee "Objectives" (~3 min): qué problemas evita normalizar (anomalías de inserción, actualización y borrado).',
          'En "Example", lee "Initial data" y "Satisfying 1NF" (~4 min): por qué una celda con varios valores es un problema.',
          'Lee "Satisfying 2NF" (~4 min): columnas que dependen solo de parte de la clave.',
          'Lee "Satisfying 3NF" (~4 min): dependencias transitivas. Para aquí: el resto de formas normales no te hace falta hoy.',
          'Escribe con tus palabras, en una línea cada una, qué elimina 1FN, 2FN y 3FN.'
        ] },
      ex: {
        title: 'De tabla plana a 3FN',
        body: `TABLA SIN NORMALIZAR (lo que sale de un Excel):

 cita_id | mascota | telefonos_dueno  | vet   | vet_especialidad
 --------|---------|------------------|-------|------------------
 1       | Rocky   | 555-11, 555-22   | Ana   | Cirugía
 2       | Michi   | 555-33           | Ana   | Cirugía

PROBLEMA 1 (viola 1FN): telefonos_dueno tiene varios
valores en una celda. No puedes buscar por teléfono.
 -> Solución: tabla telefono(id, dueno_id, número).

PROBLEMA 2 (viola 3FN): vet_especialidad depende de vet,
no de la cita. Es una dependencia transitiva:
cita -> vet -> especialidad.
 -> Solución: la especialidad vive en la tabla veterinario
    y la cita guarda veterinario_id.
Lo mismo pasa con "mascota": el nombre depende de la
mascota, no de la cita. Si cambia de nombre, tendrías
que actualizar todas sus citas.
 -> Solución: cita guarda mascota_id, no el nombre.

¿Y LA 2FN? Solo se puede violar cuando la clave tiene
VARIAS columnas. Esta tabla tiene clave cita_id (una sola
columna), así que cumple 2FN automáticamente. Ejemplo con
clave compuesta:

 plan_vacunas (mascota_id, vacuna_id, dosis_pendientes,
               especie_mascota)
 PK = (mascota_id, vacuna_id)

PROBLEMA 3 (viola 2FN): especie_mascota depende solo de
mascota_id, que es PARTE de la clave, no de la clave entera.
 -> Solución: la especie vive en la tabla mascota.

RESULTADO: cada dato vive en UN solo sitio. Si cambia,
cambia una vez.

CUÁNDO ROMPERLA A PROPÓSITO (desnormalizar):
En la factura guardas el precio del tratamiento COPIADO,
no referenciado. Porque si mañana sube el precio, la
factura del año pasado no debe cambiar. Aquí la
duplicación no es un error: es un requisito.`
      },
      steps: [
        'Revisa tu schema buscando: celdas con varios valores, columnas que no dependen de la clave completa, y dependencias transitivas.',
        'Corrige cada violación y anota qué forma normal estabas incumpliendo.',
        'Encuentra en VetCare un caso donde desnormalizar sea lo CORRECTO y justifícalo.'
      ],
      vet: [
        'Actualiza database/schema-draft.sql con el esquema normalizado.',
        'Agrega a docs/domain-model.md la sección "7. Normalización": qué violaciones encontraste y el caso de desnormalización intencionada.'
      ],
      edge: [
        'Un campo tipo "notas" con texto libre no viola 1FN aunque contenga comas. 1FN habla de valores que el sistema necesita tratar por separado.',
        'Normalizar al máximo puede dar esquemas con 15 joins para una pantalla. Normaliza por defecto y desnormaliza con un motivo medido, no por intuición.'
      ],
      quiz: [
        { q: '¿Qué problema resuelve exactamente la 1FN?', a: 'Los valores múltiples en una sola celda. Sin 1FN no puedes consultar, indexar ni validar esos valores por separado: buscar "quién tiene el teléfono 555-22" se convierte en un LIKE sobre texto.' },
        { q: '¿Qué es una dependencia transitiva y qué forma normal la elimina?', a: 'Cuando un campo depende de otro campo no clave, que a su vez depende de la clave (cita -> veterinario -> especialidad). La elimina la 3FN, moviendo el campo a la tabla de la que realmente depende.' },
        { q: 'Da un caso donde desnormalizar sea correcto.', a: 'Copiar el precio en la línea de factura en vez de referenciar el catálogo. Si el precio cambia mañana, la factura histórica debe conservar el precio de ese día. El dato duplicado es un hecho histórico, no una copia.' },
        { q: '¿Cuál es el riesgo real de un esquema no normalizado?', a: 'Las anomalías de actualización: cambias el dato en un sitio y no en otro, y el sistema empieza a contradecirse. Son bugs silenciosos que se descubren meses después, con los datos ya corruptos.' }
      ],
      out: 'Schema en 3FN + sección documentando las violaciones corregidas y un caso de desnormalización justificada.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Invariantes y agregados',
      obj: 'Definir qué reglas deben cumplirse siempre en VetCare y qué grupo de entidades las protege.',
      why: 'Un agregado define la frontera de consistencia: qué se guarda junto, qué se bloquea junto y qué puede quedar desincronizado sin problema. Es la decisión que más condiciona tus transacciones.',
      study: { r: 3, what: 'Lee DDD_Aggregate de Fowler (~10 min). Clave: el agregado tiene una raíz, y nadie toca las partes internas sin pasar por ella.',
        pasos: [
          'Lee el artículo de Fowler completo (~8 min).',
          'Subraya la definición de raíz del agregado y la regla de que las referencias externas solo apuntan a la raíz.',
          'Fíjate en la parte de transacciones: un agregado es la unidad que se guarda entera o no se guarda.',
          'Opcional (~4 min): en el artículo de Microsoft de la semana 3 lee la parte del patrón Aggregate para verlo aplicado en .NET.'
        ] },
      ex: {
        title: 'Invariantes y fronteras en VetCare',
        body: `INVARIANTE = algo que SIEMPRE debe ser cierto,
en cualquier instante en que alguien mire los datos.

 INV-01 Una cita no puede solaparse con otra del mismo
        veterinario.
 INV-02 Una mascota tiene siempre exactamente un dueño
        responsable.
 INV-03 El total de una factura es la suma de sus líneas.

AGREGADO = el grupo de objetos que se guarda y se valida
como una unidad, con una raíz que controla el acceso.

  Agregado FACTURA (raíz: Factura)
    Factura
      LineaFactura (interna)
      LineaFactura (interna)

  Nadie crea una LineaFactura suelta. Se pide a la
  factura: factura.AgregarLinea(...). Así la factura
  puede recalcular el total y mantener INV-03.

  Agregado CITA (raíz: Cita) -- referencia a mascota y
  veterinario POR ID, no por objeto completo.

  Ojo con INV-01: compara VARIAS citas, así que ningún
  agregado Cita puede protegerla solo. La protege la base
  de datos con una constraint (la verás en la semana 10).

REGLA PRÁCTICA:
 - Dentro de un agregado: consistencia inmediata,
   en la misma transacción.
 - Entre agregados: consistencia eventual, por Id.

Agregados pequeños = menos bloqueos = más escalable.`
      },
      steps: [
        'Escribe 5 invariantes de VetCare: cosas que deben ser ciertas siempre.',
        'Agrupa tus entidades en 3-4 agregados e indica la raíz de cada uno.',
        'Para cada invariante indica qué agregado la protege y si se valida dentro de una transacción o no.'
      ],
      vet: [
        'Agrega la sección "8. Invariantes y agregados" a docs/domain-model.md.',
        'Dibuja en Mermaid los agregados agrupando entidades, mostrando qué referencias son internas y cuáles son por Id.'
      ],
      edge: [
        'Un agregado gigante que abarca medio modelo bloquea demasiadas filas y mata la concurrencia. Si dudas, hazlo más pequeño.',
        'Si una invariante cruza dos agregados, no la fuerces a una transacción: acéptala como consistencia eventual o replantea las fronteras.'
      ],
      quiz: [
        { q: '¿Qué es una invariante del dominio?', a: 'Una condición que debe ser cierta en todo momento observable, no solo al final de una operación. Si existe un instante en que un observador externo puede ver el dato roto, la invariante no se está cumpliendo.' },
        { q: '¿Por qué las referencias entre agregados se hacen por Id?', a: 'Para mantener la frontera de consistencia pequeña. Si Cita cargara el objeto Mascota completo, sería fácil modificarla desde ahí y romper las reglas de Mascota sin pasar por su raíz.' },
        { q: '¿Qué gano haciendo agregados pequeños?', a: 'Transacciones más cortas, menos filas bloqueadas, menos conflictos de concurrencia y mejor escalabilidad. El precio es aceptar que algunas cosas sean consistentes eventualmente en vez de al instante.' },
        { q: '¿Cómo protege la raíz del agregado sus invariantes?', a: 'Siendo el único punto de entrada. Las partes internas no se crean ni modifican directamente: se llaman métodos de la raíz, que valida y recalcula lo necesario antes de permitir el cambio.' }
      ],
      out: '5 invariantes documentadas, 3-4 agregados con su raíz, y diagrama de fronteras.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'ERD revisado (examen de la semana)',
      obj: 'Entregar el modelo de datos definitivo de VetCare y defender cada decisión estructural.',
      why: 'A partir de la semana que viene empiezas a escribir C# contra este modelo. Todo error que quede aquí lo vas a pagar multiplicado en código, tests y migraciones.',
      study: { r: 0, what: 'Sin lectura nueva. Relee domain-model.md y schema-draft.sql de punta a punta buscando incoherencias entre ambos.',
        pasos: [
          'Lee la tabla de "Normal forms" (~2 min) solo para recordar qué exige cada forma hasta 3NF.',
          'Abre domain-model.md y schema-draft.sql lado a lado.',
          'Para cada entidad comprueba que tiene tabla, que sus atributos tienen columna y que cada relación tiene su FK.',
          'Anota cada incoherencia con el formato: en el modelo dice X, en el SQL dice Y. Después decide cuál de los dos está bien.'
        ] },
      ex: {
        title: 'Checklist de revisión del modelo',
        body: `Pasa tu modelo por estas 10 preguntas. Cada "no sé"
es una tarea pendiente, no una duda filosófica.

 1. ¿Cada entidad tiene Id y el tipo está justificado?
 2. ¿Cada FK tiene política ON DELETE explícita?
 3. ¿Cada regla de negocio del spec tiene su constraint
    o está documentado por qué no se puede?
 4. ¿Hay algún campo que pueda estar duplicado y
    desincronizarse? ¿Está justificado?
 5. Cada tabla N:N: ¿PK compuesta o Id propio, decidido?
 6. ¿Los nombres salen del glosario del cliente?
 7. ¿Hay borrado físico en algún sitio donde el requisito
    legal pide conservar 5 años?
 8. ¿Cada agregado tiene raíz clara?
 9. ¿El ERD y el SQL dicen exactamente lo mismo?
10. ¿Las 5 historias de estrés de la semana 3 siguen
    pasando tras los cambios de esta semana?

El punto 9 falla casi siempre. El diagrama se actualiza
y el SQL no, o al revés.`
      },
      steps: [
        'Pasa el checklist completo de 10 puntos y anota el resultado de cada uno.',
        'Corrige todo lo que falle, tanto en el ERD como en el SQL, hasta que ambos coincidan.',
        'Defensa oral sin notas, 5 minutos: explica tus entidades, por qué esas y no otras, y la decisión más discutible que tomaste.'
      ],
      vet: [
        'Cierra docs/domain-model.md y database/schema-draft.sql como versión 1 del modelo.',
        'Pulsa «Marcar para repasar» y guarda el resultado del checklist junto a los dos archivos.'
      ],
      edge: [
        'Si el checklist te hace cambiar cosas, perfecto: para eso existe. Un modelo que pasa el checklist a la primera suele indicar que no lo miraste en serio.',
        'Anota la decisión que menos seguro te deje. En la semana 15, cuando escribas tu primer ADR, esa será la candidata natural.'
      ],
      quiz: [
        { q: '¿Por qué es crítico que el ERD y el SQL digan lo mismo?', a: 'Porque el diagrama es lo que la gente lee para entender el sistema y el SQL es lo que realmente se ejecuta. Si divergen, todas las decisiones basadas en el diagrama están tomadas sobre información falsa.' },
        { q: '¿Qué significa que un modelo sea "defendible"?', a: 'Que para cada decisión estructural puedes dar el motivo y la alternativa que descartaste. No se trata de que sea perfecto, sino de que sea consciente.' },
        { q: '¿Cuál es el coste real de un error de modelado descubierto tarde?', a: 'Migración de datos en producción, cambio de API con clientes ya conectados, reescritura de consultas y tests, y riesgo de pérdida de datos. Por eso una semana entera de modelado es barata.' },
        { q: 'Resume las semanas 3 y 4 en una idea.', a: 'Que el modelo de datos es la traducción fiel del lenguaje del negocio, que debe hacer imposibles los estados inválidos mediante constraints, y que cada dato debe vivir en un solo sitio salvo que la duplicación sea un requisito explícito.' }
      ],
      out: 'Modelo v1 cerrado: ERD y SQL coherentes, checklist de 10 puntos respondido y corregido.',
      file: 'docs/domain-model.md'
    }
  ]
},
{
  n: 5, phase: 'C# y OOP', title: 'Clases, objetos y encapsulación en C#',
  idea: 'Ahora el modelo se vuelve código. El objetivo no es que compile: es que sea imposible crear un objeto en estado inválido.',
  res: [
    { t: 'Microsoft Learn — Objects: create instances of types', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/objects', note: 'Qué es un objeto, cómo se crea y qué significa su identidad.' },
    { t: 'Microsoft Learn — Classes and objects', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes', note: 'Referencia de clases, campos, propiedades y constructores.' },
    { t: 'Microsoft Learn — Properties', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/properties', note: 'Propiedades, get/set, init y propiedades calculadas.' },
    { t: 'Microsoft Learn — C# coding conventions', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions', note: 'Convenciones de nombres que se esperan en cualquier equipo .NET.' },
    { t: 'Microsoft Learn — Methods', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/methods', note: 'Firma, parámetros, retorno y paso por valor o por referencia.' },
    { t: 'Microsoft Learn — Constructors', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/constructors', note: 'Constructores, sobrecargas, this() y constructores primarios.' },
    { t: 'Microsoft Learn — Access modifiers', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers', note: 'public, private, protected, internal: la herramienta de la encapsulación.' }
  ],
  days: [
    {
      t: 'Clase vs objeto',
      obj: 'Crear el proyecto .NET de VetCare y escribir tus primeras clases de dominio a partir del modelo.',
      why: 'Es el momento en que tu documentación se convierte en algo ejecutable. Si el modelo estaba bien, esto es casi mecánico; si estaba mal, lo vas a notar hoy mismo.',
      study: { r: 1, what: 'Lee la página de clases de C#. Unos 12 minutos. Clave: una clase es una plantilla, un objeto es una instancia viva en memoria.',
        pasos: [
          'Lee "When to use classes" y "Declare a class" (~4 min).',
          'Lee "Create objects" (~3 min): qué hace new y qué guarda realmente la variable.',
          'Lee "Constructors and initialization" por encima (~3 min); mañana lo ves a fondo.',
          'Escribe la clase Mascota con tres propiedades y crea dos objetos distintos en un Program.cs.'
        ] },
      ex: {
        title: 'Primera clase de dominio',
        body: `Crear el proyecto (una sola vez):

  dotnet new sln -n VetCare
  dotnet new classlib -o src/VetCare.Domain
  dotnet sln add src/VetCare.Domain

  # proyecto de consola para probar tus clases a mano
  dotnet new console -o src/VetCare.Playground
  dotnet sln add src/VetCare.Playground
  dotnet add src/VetCare.Playground reference src/VetCare.Domain

  (Con .NET 10 el archivo se llama VetCare.slnx en vez de
  VetCare.sln. Funciona igual.)

src/VetCare.Domain/Mascota.cs

  namespace VetCare.Domain;

  public class Mascota
  {
      public Guid Id { get; private set; }
      public string Nombre { get; private set; }
      public Especie Especie { get; private set; }
      public bool Activa { get; private set; }

      public Mascota(string nombre, Especie especie)
      {
          Id = Guid.NewGuid();
          Nombre = nombre;
          Especie = especie;
          Activa = true;
      }
  }

  public enum Especie { Perro, Gato, Otro }

CLASE = el molde Mascota, existe una vez en el código.
OBJETO = cada mascota concreta en memoria:

  var rocky = new Mascota("Rocky", Especie.Perro);
  var michi = new Mascota("Michi", Especie.Gato);

rocky y michi comparten la clase pero tienen estado
propio e independiente. Cambiar el nombre de rocky no
afecta a michi.`
      },
      steps: [
        'Crea la solución y el proyecto de dominio con los comandos del ejemplo.',
        'Escribe 3 clases de tu modelo (por ejemplo Mascota, Dueno y Veterinario; en el código, los nombres van sin tildes ni ñ) con sus propiedades.',
        'En src/VetCare.Playground/Program.cs crea 2 objetos de cada clase y comprueba que su estado es independiente. Lo ejecutas con: dotnet run --project src/VetCare.Playground'
      ],
      vet: [
        'Deja la estructura VetCare.sln (o .slnx) + src/VetCare.Domain + src/VetCare.Playground con tus 3 primeras clases.',
        'Ejecuta dotnet build y asegúrate de que compila sin warnings.'
      ],
      edge: [
        'Si el compilador se queja de que Nombre puede ser null, no lo silencies: significa que no garantizaste que siempre se asigne. Ese warning es tu amigo.',
        'Una clase que no se puede instanciar sin dejarla a medias está mal diseñada. Ese es el tema de pasado mañana.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre clase y objeto?', a: 'La clase es la definición: qué datos y qué comportamiento tendrá. El objeto es una instancia concreta con su propio estado en memoria. Una clase, muchos objetos independientes.' },
        { q: '¿Por qué las propiedades llevan private set en el ejemplo?', a: 'Para que nadie fuera de la clase pueda cambiar el estado directamente. Los cambios deben pasar por métodos que validen las reglas. Sin eso, cualquiera puede dejar el objeto inválido.' },
        { q: '¿Qué gana usar enum Especie en vez de string?', a: 'Que los valores inválidos no compilan. Con string puedes escribir "perrro" y el error aparece en producción; con enum el compilador lo detecta mientras escribes.' },
        { q: '¿Qué es un namespace y para qué sirve?', a: 'Un agrupador lógico de tipos que evita colisiones de nombres y comunica estructura. VetCare.Domain.Mascota deja claro que esa clase pertenece al dominio y no a la capa de API.' }
      ],
      out: 'Proyecto .NET compilando con 3 clases de dominio y una prueba manual de instanciación.',
      file: 'src/VetCare.Domain/Mascota.cs'
    },
    {
      t: 'Propiedades, campos y estado',
      obj: 'Distinguir campos de propiedades y elegir el nivel de acceso correcto para cada dato de tus clases.',
      why: 'La diferencia entre un campo público y una propiedad con lógica es la diferencia entre un objeto que cualquiera puede corromper y uno que se protege a sí mismo.',
      study: { r: 2, what: 'Lee la página de Properties completa (~15 min): get, set, init, auto-properties, propiedades calculadas y expression-bodied.',
        pasos: [
          'Lee "Automatically implemented properties" (~3 min): la forma corta { get; set; } y cuándo basta.',
          'Lee "Field backed properties" y "Properties with backing fields" (~4 min): cuándo necesitas un campo privado detrás para validar.',
          'Lee "Required properties" (~2 min) y "Expression body definitions" (~2 min): así se escribe una propiedad calculada en una línea.',
          'Lee "Access control" (~2 min): cómo hacer el get público y el set privado o init.',
          'Repasa cada propiedad de Mascota y decide: set público, private set, init o calculada. Escribe el motivo al lado.'
        ] },
      ex: {
        title: 'Cinco formas de exponer datos',
        body: `  public class Mascota
  {
      // 1. CAMPO PRIVADO: detalle interno, nadie lo ve.
      private readonly List<Vacuna> _vacunas = new();

      // 2. AUTO-PROPERTY de solo lectura externa.
      public Guid Id { get; private set; }

      // 3. PROPIEDAD init: se fija al construir y nunca más.
      public DateTime FechaAlta { get; init; }

      // 4. PROPIEDAD CALCULADA: no guarda nada, deriva.
      // (en el día 3 verás por qué es aún mejor recibir
      // la fecha de hoy como parámetro en vez de leer el reloj)
      public int? EdadAnios => FechaNacimiento is null
          ? null
          : (int)((DateTime.UtcNow - FechaNacimiento.Value).TotalDays / 365.25);

      public DateTime? FechaNacimiento { get; private set; }

      // 5. EXPONER COLECCIÓN SIN PERMITIR MODIFICARLA
      public IReadOnlyList<Vacuna> Vacunas => _vacunas;
  }

El punto 5 es el error más común del principiante:

  public List<Vacuna> Vacunas { get; set; }   // MAL

Con eso, cualquiera hace mascota.Vacunas.Clear() y borra
el historial sin pasar por ninguna validación tuya.
IReadOnlyList lo impide en tiempo de compilación.

El punto 4 también importa: EdadAnios NO se guarda.
Si la guardaras, mañana estaría desactualizada.
Regla: lo que se puede derivar, se deriva.`
      },
      steps: [
        'Revisa tus 3 clases y convierte en privado todo lo que no necesite verse desde fuera.',
        'Cambia cualquier colección pública por campo privado + IReadOnlyList.',
        'Agrega al menos una propiedad calculada que antes pensabas guardar como campo.'
      ],
      vet: [
        'Actualiza tus clases de src/VetCare.Domain con el encapsulamiento correcto.',
        'Anota en docs/notes-csharp.md qué campos decidiste exponer y cuáles no, con el motivo.'
      ],
      edge: [
        'Un dato derivado que además se guarda es duplicación: tarde o temprano el guardado y el calculado dirán cosas distintas.',
        'readonly en un campo de colección protege la referencia, no el contenido: todavía se puede hacer Add. Por eso la expones como IReadOnlyList. Y un detalle más: quien reciba ese IReadOnlyList podría hacer un cast a List y modificarla. Si quieres cerrarlo del todo, devuelve _vacunas.AsReadOnly().'
      ],
      quiz: [
        { q: '¿Diferencia entre campo y propiedad?', a: 'El campo es una variable de la clase que almacena el dato. La propiedad es un par de métodos get/set disfrazados de dato, que permiten validar, calcular o restringir el acceso sin cambiar la forma en que se usa.' },
        { q: '¿Por qué no exponer una List pública?', a: 'Porque entrega control total del contenido a cualquiera: Add, Remove o Clear se ejecutan sin pasar por tus validaciones. IReadOnlyList permite leer pero obliga a usar tus métodos para modificar.' },
        { q: '¿Cuándo usar init en vez de set?', a: 'Cuando el valor debe fijarse al construir el objeto y no cambiar después, como una fecha de alta. Da inmutabilidad sin obligarte a un constructor con veinte parámetros posicionales.' },
        { q: '¿Por qué es mejor calcular la edad que guardarla?', a: 'Porque un dato guardado se queda congelado y el tiempo sigue avanzando: mañana ese campo miente. Todo lo que se pueda derivar de otros datos debe derivarse en el momento de leerlo.' }
      ],
      out: 'Clases con encapsulamiento correcto, colecciones protegidas y al menos una propiedad calculada.',
      file: 'src/VetCare.Domain/Mascota.cs'
    },
    {
      t: 'Métodos y comportamiento',
      obj: 'Mover la lógica de negocio dentro de las clases de dominio en vez de dejarla suelta fuera.',
      why: 'Un objeto que solo tiene datos y ningún comportamiento se llama modelo anémico: es una estructura con nombre de clase, y obliga a repartir las reglas por todo el sistema.',
      study: { r: 4, what: 'Lee la página de Methods (~12 min): firma, parámetros, valores de retorno, sobrecarga, paso por valor y por referencia, y expression-bodied members. Busca una cosa: qué pasa cuando pasas un objeto a un método y lo modificas dentro.',
        pasos: [
          'Lee "Method signatures" y "Method access" (~3 min).',
          'Lee "Method parameters vs. arguments" (~2 min).',
          'Lee "Passing by reference vs. passing by value" con atención (~4 min): prueba el ejemplo y explica por qué el objeto cambia aunque se pase por valor.',
          'Lee "Return values" y "Expression body definitions" (~3 min).',
          'Escribe la firma (solo la firma) de los 3 métodos de negocio que vas a mover a tus clases, con nombres del dominio: Vacunar, Reprogramar, Cancelar.'
        ] },
      ex: {
        title: 'Modelo anémico vs modelo rico',
        body: `ANÉMICO (la regla vive fuera, repartida):

  // en el controlador
  if (cita.Inicio < DateTime.UtcNow)
      return BadRequest("fecha pasada");
  cita.Estado = "CANCELADA";

  // y la misma regla copiada en otro servicio...
  // y olvidada en un tercero.

RICO (la regla vive donde vive el dato):

  public class Cita
  {
      public EstadoCita Estado { get; private set; }
      public DateTime Inicio { get; private set; }
      public DateTime Fin { get; private set; }
      public Guid VeterinarioId { get; private set; }

      public void Cancelar(DateTime ahora)
      {
          if (Estado != EstadoCita.Confirmada)
              throw new InvalidOperationException(
                  $"No se puede cancelar una cita {Estado}.");

          if (Inicio - ahora < TimeSpan.FromHours(2))
              throw new InvalidOperationException(
                  "No se puede cancelar con menos de 2h.");

          Estado = EstadoCita.Cancelada;
      }

      public bool SeSolapaCon(Cita otra) =>
          VeterinarioId == otra.VeterinarioId &&
          Inicio < otra.Fin && otra.Inicio < Fin;
  }

Ahora RN-01 existe en UN solo lugar. El controlador
solo llama a cita.Cancelar(...) y traduce la excepción.

Fíjate en el parámetro "ahora": no uso DateTime.UtcNow
dentro del método. Así el método es testeable con
cualquier fecha, sin esperar dos horas reales.`
      },
      steps: [
        'Identifica 3 reglas de negocio que hoy escribirías fuera de la clase y muévelas dentro como métodos.',
        'Cada método debe validar primero y cambiar el estado después, nunca al revés.',
        'Saca las dependencias de tiempo a parámetros, como el "ahora" del ejemplo.'
      ],
      vet: [
        'Agrega métodos de comportamiento a tus clases: Cancelar, Reagendar, RegistrarVacuna, Desactivar, lo que aplique a tu modelo.',
        'Prueba cada método a mano desde la consola, incluido el caso que debe lanzar excepción.'
      ],
      edge: [
        'Si un método cambia el estado y luego valida, puede dejar el objeto roto cuando lance la excepción. Valida siempre primero.',
        'Un método que usa DateTime.Now por dentro es casi imposible de testear. Pásalo como parámetro o inyecta un reloj.'
      ],
      quiz: [
        { q: '¿Qué es un modelo de dominio anémico y por qué es un problema?', a: 'Clases que solo tienen datos sin comportamiento. El problema es que las reglas acaban repartidas por controladores y servicios, se duplican, y cuando cambian se actualizan solo en algunos sitios.' },
        { q: '¿Por qué validar antes de modificar el estado?', a: 'Porque si validas después y lanzas la excepción, el objeto ya quedó parcialmente modificado. El llamador atrapa el error creyendo que no pasó nada, pero el objeto está corrupto en memoria.' },
        { q: '¿Por qué pasar "ahora" como parámetro en vez de usar DateTime.UtcNow dentro?', a: 'Para poder testear. Con el parámetro escribes un test de "cancelar con 1 hora de margen" en milisegundos; con la llamada interna tendrías que manipular el reloj del sistema.' },
        { q: '¿Dónde debe vivir una regla de negocio?', a: 'Lo más cerca posible del dato que protege, normalmente dentro de la entidad o del value object. Así es imposible saltársela, porque no hay forma de cambiar el dato sin pasar por el método.' }
      ],
      out: 'Clases con métodos de comportamiento que encapsulan reglas de negocio, probados a mano.',
      file: 'src/VetCare.Domain/Cita.cs'
    },
    {
      t: 'Constructores',
      obj: 'Diseñar constructores que hagan imposible crear un objeto en estado inválido.',
      why: 'Si un objeto puede existir a medias, cada método que lo reciba tendrá que comprobar que no está roto. Un buen constructor elimina cientos de validaciones defensivas repartidas.',
      study: { r: 5, what: 'Lee la página de Constructors (~12 min): constructor por defecto, sobrecargas, encadenamiento con this() y constructores primarios. Busca una cosa: cómo un constructor puede impedir que exista un objeto en estado inválido.',
        pasos: [
          'Lee "Constructor syntax" (~5 min): constructor normal, expression-bodied y constructor primario.',
          'Lee "Static constructors" por encima (~2 min): sirven para inicializar la clase, no los objetos.',
          'Abre de nuevo la página de clases de C# del día 1 y relee la parte de constructores e inicialización (~3 min).',
          'Para cada clase de dominio escribe la lista de cosas sin las que el objeto no debería existir: eso es lo que el constructor debe exigir y validar.'
        ] },
      ex: {
        title: 'Constructor que garantiza validez',
        body: `  public class Mascota
  {
      public Guid Id { get; }
      public string Nombre { get; private set; }
      public Especie Especie { get; }
      public Guid DuenoId { get; }

      public Mascota(string nombre, Especie especie, Guid duenoId)
      {
          if (string.IsNullOrWhiteSpace(nombre))
              throw new ArgumentException(
                  "El nombre es obligatorio.", nameof(nombre));

          nombre = nombre.Trim();   // primero limpiar, luego medir
          if (nombre.Length > 60)
              throw new ArgumentException(
                  "Máximo 60 caracteres.", nameof(nombre));

          if (duenoId == Guid.Empty)
              throw new ArgumentException(
                  "La mascota necesita dueño.", nameof(duenoId));

          Id = Guid.NewGuid();
          Nombre = nombre;
          Especie = especie;
          DuenoId = duenoId;
      }
  }

CONSECUENCIA IMPORTANTE:
en todo el resto del sistema puedes escribir
mascota.Nombre.ToUpper() sin comprobar null.
Si el objeto existe, es válido. Punto.

MÉTODO FACTORÍA cuando el nombre aporta significado:

  public static Cita Agendar(Guid mascotaId, Guid vetId,
                             DateTime inicio, TimeSpan dur)
  {
      if (dur <= TimeSpan.Zero)
          throw new ArgumentException("Duración inválida.");
      return new Cita(mascotaId, vetId, inicio, inicio + dur);
  }

Cita.Agendar(...) se lee mejor que new Cita(...) con
cuatro parámetros cuyo orden nadie recuerda.`
      },
      steps: [
        'Agrega validaciones a los constructores de todas tus clases de dominio.',
        'Elimina el constructor sin parámetros de las clases donde no tenga sentido.',
        'Convierte al menos un constructor en método factoría estático con nombre del negocio.'
      ],
      vet: [
        'Actualiza src/VetCare.Domain para que ninguna clase pueda construirse en estado inválido.',
        'Escribe en la consola 5 intentos de construcción inválida y verifica que todos lanzan excepción.'
      ],
      edge: [
        'Un constructor con más de 5 parámetros es una señal: probablemente la clase hace demasiado, o varios parámetros deberían ser un value object.',
        'Entity Framework Core puede usar un constructor con parámetros si sus nombres coinciden con propiedades mapeadas. Si no hay ninguno así, necesita uno sin parámetros, y puede ser privado: EF lo usa y tu código no.'
      ],
      quiz: [
        { q: '¿Por qué validar en el constructor y no en un método Validar()?', a: 'Porque un método Validar() hay que acordarse de llamarlo, y alguien no lo hará. El constructor no se puede saltar: si el objeto existe, pasó por ahí.' },
        { q: '¿Qué ganas en el resto del sistema con constructores que validan?', a: 'Eliminas la programación defensiva. Ningún método necesita comprobar si el nombre es null o si el Id está vacío, porque esos objetos no pueden existir.' },
        { q: '¿Cuándo usar un método factoría estático en vez de un constructor?', a: 'Cuando el nombre aporta significado del negocio (Cita.Agendar, Dinero.Cero), cuando hay varias formas de crear el objeto que se distinguirían solo por tipos, o cuando la creación puede devolver una instancia existente.' },
        { q: '¿Qué problema tiene un constructor con 8 parámetros?', a: 'Es fácil equivocarse de orden entre parámetros del mismo tipo, y el compilador no te avisa. Además suele indicar que la clase tiene demasiadas responsabilidades o que faltan value objects que agrupen datos relacionados.' }
      ],
      out: 'Todas las clases de dominio con constructores que validan, sin constructor público sin parámetros.',
      file: 'src/VetCare.Domain/Mascota.cs'
    },
    {
      t: 'Encapsulación',
      obj: 'Auditar tus clases y cerrar todos los huecos por los que alguien podría romper el estado desde fuera.',
      why: 'Encapsular no es poner private por costumbre: es decidir conscientemente qué puede cambiar, quién y bajo qué condiciones. Es la base de que el sistema siga siendo correcto cuando crece.',
      study: { r: 6, what: 'Lee la página de Access Modifiers (~10 min): public, private, protected, internal y sus combinaciones. Busca una cosa: cuál es el acceso por defecto de un miembro de clase si no escribes nada. Si te sobra tiempo, repasa las convenciones de código de C#.',
        pasos: [
          'Lee la "Summary table" (~3 min) y cópiala a tu cuaderno: quién puede ver cada modificador.',
          'Lee "Class and struct accessibility" (~2 min): el acceso por defecto de una clase.',
          'Lee "Member accessibility" (~3 min): el acceso por defecto de un miembro es private. Por eso escribir menos te protege más.',
          'Busca en tu dominio todo lo que sea public y pregunta: ¿quién de fuera lo necesita de verdad? Si nadie, bájalo a private o internal.'
        ] },
      ex: {
        title: 'Auditoría de encapsulación',
        body: `Busca estos 5 agujeros en tus clases:

1. SETTER PÚBLICO que permite estados inválidos
   public EstadoCita Estado { get; set; }        // MAL
   -> cita.Estado = EstadoCita.Atendida sin haber pasado.
   Arreglo: private set + método MarcarAtendida().

2. COLECCIÓN EXPUESTA
   public List<Vacuna> Vacunas { get; set; }     // MAL
   Arreglo: campo privado + IReadOnlyList + AgregarVacuna().

3. OBJETO MUTABLE DEVUELTO POR REFERENCIA
   public Direccion Direccion { get; }           // ojo
   -> si Direccion tiene setters públicos, el llamador
      la modifica por detrás. Arreglo: value object inmutable.

4. MÉTODO PÚBLICO QUE NO DEBERÍA SERLO
   public void RecalcularTotal()                 // MAL
   -> el llamador podría olvidarse de llamarlo.
   Arreglo: private, y llamarlo desde AgregarLinea().

5. CONSTRUCTOR QUE NO VALIDA
   Ya lo resolviste ayer.

PRUEBA FINAL de encapsulación:
"¿Puedo, desde fuera de la clase y sin usar reflexión,
dejar este objeto en un estado que viole una invariante?"
Si la respuesta es sí, todavía no está encapsulado.`
      },
      steps: [
        'Pasa la auditoría de los 5 agujeros sobre todas tus clases de dominio.',
        'Por cada agujero, aplica el arreglo y anota qué invariante estabas dejando desprotegida.',
        'Aplica las convenciones de nombres de C#: PascalCase en públicos, _camelCase en campos privados.'
      ],
      vet: [
        'Deja src/VetCare.Domain sin ningún setter público en entidades.',
        'Anota en docs/notes-csharp.md los agujeros que encontraste y cómo los cerraste.'
      ],
      edge: [
        'Devolver un objeto mutable desde una propiedad de solo lectura sigue siendo un agujero: la referencia es de solo lectura, el objeto no.',
        'internal es útil para exponer algo solo dentro del mismo proyecto sin abrirlo al mundo. Si además lo quieres usar desde el proyecto de tests, se añade el atributo InternalsVisibleTo.'
      ],
      quiz: [
        { q: '¿Cuál es la prueba definitiva de que una clase está encapsulada?', a: 'Intentar, desde fuera y sin reflexión, dejarla en un estado que viole una invariante. Si lo consigues, hay un agujero. Si no existe ninguna secuencia de llamadas públicas que la rompa, está encapsulada.' },
        { q: '¿Por qué un setter público en Estado es peligroso?', a: 'Porque permite saltarse la máquina de estados: marcar una cita como Atendida sin que haya ocurrido, o revivir una cancelada. El estado debe cambiar solo mediante métodos que validen la transición.' },
        { q: '¿Qué significa que una propiedad de solo lectura devuelva un objeto mutable?', a: 'Que proteges la referencia pero no el contenido: nadie puede reemplazar el objeto, pero cualquiera puede modificarlo por dentro. La solución es que ese objeto sea inmutable.' },
        { q: '¿Para qué sirve internal?', a: 'Para exponer un miembro dentro del mismo ensamblado pero no fuera. Es útil para colaboraciones entre clases del mismo módulo o para abrir algo a los tests (con InternalsVisibleTo) sin hacerlo parte de la API pública.' }
      ],
      out: 'Dominio auditado sin setters públicos, colecciones protegidas y convenciones de C# aplicadas.',
      file: 'src/VetCare.Domain/'
    },
    {
      t: 'Invariantes en código (examen de la semana)',
      obj: 'Demostrar con código ejecutable que las invariantes de tu dominio son imposibles de violar.',
      why: 'Decir "mis clases están bien encapsuladas" no vale nada. Demostrarlo con un programa que intenta romperlas y falla en todos los intentos, sí.',
      study: { r: 0, what: 'Sin material nuevo. Relee las invariantes que escribiste en la semana 4 día 5 y comprueba cuáles están realmente protegidas en el código.',
        pasos: [
          'Lee "Object identity vs. value equality" (~3 min): te servirá para escribir ataques que comparan objetos.',
          'Abre las invariantes que escribiste en la semana 4 día 5.',
          'Al lado de cada invariante escribe la línea de código que la protege (constructor, método o tipo). Si no hay ninguna, esa invariante está desprotegida.',
          'Ordena las desprotegidas de más grave a menos grave: ese es el orden en que las arreglas hoy.'
        ] },
      ex: {
        title: 'Programa de ataque al dominio',
        body: `src/VetCare.Playground/Program.cs

  using VetCare.Domain;

  void Intentar(string caso, Action accion)
  {
      try
      {
          accion();
          Console.WriteLine($"FALLO: '{caso}' debería haber sido rechazado");
      }
      catch (Exception ex)
      {
          Console.WriteLine($"OK: '{caso}' -> {ex.Message}");
      }
  }

  Intentar("mascota sin nombre",
      () => new Mascota("", Especie.Perro, Guid.NewGuid()));

  Intentar("mascota sin dueño",
      () => new Mascota("Rocky", Especie.Perro, Guid.Empty));

  var cita = Cita.Agendar(Guid.NewGuid(), Guid.NewGuid(),
                          DateTime.UtcNow.AddHours(5),
                          TimeSpan.FromMinutes(30));

  Intentar("cancelar dos veces", () => {
      cita.Cancelar(DateTime.UtcNow);
      cita.Cancelar(DateTime.UtcNow);
  });

  Intentar("cancelar con 1h de margen", () => {
      var c = Cita.Agendar(Guid.NewGuid(), Guid.NewGuid(),
                           DateTime.UtcNow.AddHours(1),
                           TimeSpan.FromMinutes(30));
      c.Cancelar(DateTime.UtcNow);
  });

Salida esperada: todas las líneas empiezan con OK.
Cualquier FALLO es un agujero real en tu dominio.

En la semana 13 esto mismo se convertirá en tests de
xUnit. Hoy es un programa de consola, y ya es útil.`
      },
      steps: [
        'Usa el proyecto de consola VetCare.Playground que creaste el día 1 (ya tiene la referencia al dominio).',
        'Escribe un intento de ataque por cada invariante que definiste: mínimo 8.',
        'Ejecuta y corrige el dominio hasta que todas las líneas salgan OK.'
      ],
      vet: [
        'Deja src/VetCare.Playground/Program.cs con los 8+ ataques y la salida toda en OK.',
        'Pulsa «Marcar para repasar» y guarda una captura de la salida de la consola junto al código.'
      ],
      edge: [
        'Si algún ataque sale FALLO y no sabes cómo arreglarlo, no lo borres: anótalo como deuda técnica con el número de invariante.',
        'Un ataque que lanza NullReferenceException en vez de tu excepción de negocio también es un fallo: el mensaje debe explicar la regla.'
      ],
      quiz: [
        { q: '¿Por qué un programa que intenta romper el dominio vale más que leer el código?', a: 'Porque leyendo ves lo que creíste escribir; ejecutando ves lo que realmente pasa. Los agujeros de encapsulación son justamente los que no ves al leer.' },
        { q: '¿Por qué NullReferenceException es una mala señal aunque el intento falle?', a: 'Porque significa que el objeto llegó a un estado inválido y reventó por accidente, no que tu validación lo rechazó. El mensaje no explica la regla y el fallo podría no ocurrir en otro camino.' },
        { q: '¿Qué diferencia hay entre este programa y un test automático?', a: 'Ninguna conceptualmente: mismo arrange, act y assert. La diferencia es que el test se ejecuta solo en cada build y falla el pipeline, mientras que este programa hay que mirarlo a ojo.' },
        { q: 'Resume la semana 5 en una idea.', a: 'Que una clase bien diseñada hace imposible el estado inválido: valida en el constructor, no expone setters, protege sus colecciones y encapsula las reglas en métodos. El resto del sistema puede entonces confiar en ella sin validar de nuevo.' }
      ],
      out: 'Programa de consola con 8+ ataques al dominio, todos rechazados correctamente.',
      file: 'src/VetCare.Playground/Program.cs'
    }
  ]
},
{
  n: 6, phase: 'C# y OOP', title: 'Abstracción, interfaces y polimorfismo',
  idea: 'La herencia se enseña primero y se usa menos. Lo que de verdad usarás todos los días es componer objetos y programar contra interfaces.',
  res: [
    { t: 'Microsoft Learn — Interfaces', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces', note: 'Definición, implementación y uso de interfaces en C#.' },
    { t: 'Microsoft Learn — Inheritance', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance', note: 'Herencia, virtual, override y clases abstractas.' },
    { t: 'Microsoft Learn — Polymorphism', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/polymorphism', note: 'Polimorfismo en tiempo de ejecución.' },
    { t: 'Wikipedia — Composition over inheritance', u: 'https://en.wikipedia.org/wiki/Composition_over_inheritance', note: 'El principio explicado con ejemplo, ventajas e inconvenientes.' },
    { t: 'Microsoft Learn — Object-Oriented programming (C#)', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop', note: 'Abstracción, encapsulación, herencia y polimorfismo en un mismo ejemplo.' }
  ],
  days: [
    {
      t: 'Abstracción',
      obj: 'Identificar qué detalles de VetCare deben esconderse detrás de una abstracción y cuáles no.',
      why: 'Abstraer de menos te ata a detalles técnicos; abstraer de más produce capas inútiles que todo el mundo odia. Saber dónde está la línea es criterio de ingeniero, no de principiante.',
      study: { r: 4, what: 'Lee la introducción del tutorial de programación orientada a objetos de Microsoft (~10 min), la parte de abstracción y encapsulación. Clave: una abstracción útil esconde una decisión que podría cambiar, no esconde código por esconderlo.',
        pasos: [
          'Lee la introducción del tutorial (~3 min): las cuatro ideas de la programación orientada a objetos.',
          'Lee "Create different types of accounts" (~5 min): fíjate en qué esconde la clase base y qué deja ver.',
          'Lee "Different overdraft rules" (~3 min): una regla que cambia se esconde detrás de un miembro que cada tipo resuelve a su manera.',
          'Lee "Summary" (~1 min).',
          'Para tus 6 candidatos responde: ¿esto puede cambiar sin que cambie el negocio? ¿Necesito probarlo sin lo real? Si las dos son no, no merece interfaz.'
        ] },
      ex: {
        title: 'Qué merece abstraerse y qué no',
        body: `MERECE ABSTRACCIÓN (la decisión puede cambiar):

  Enviar recordatorio de vacuna.
  Hoy: email. Mañana: WhatsApp o SMS.

  public interface INotificador
  {
      Task EnviarAsync(string destino, string mensaje);
  }

  El dominio llama a INotificador y no sabe ni le importa
  si por debajo hay SMTP, Twilio o un fichero de log.

NO MERECE ABSTRACCIÓN (nunca va a cambiar):

  public interface ICalculadoraDeEdad      // inútil
  {
      int Calcular(DateTime nacimiento);
  }

  Esto es un cálculo puro y determinista. No hay
  proveedor alternativo, no hay decisión que aislar.
  Es un método, no una interfaz.

LA PREGUNTA CLAVE:
"¿Puedo imaginar una segunda implementación realista
de esto en los próximos dos años?"
 - Sí -> interfaz.
 - No -> clase concreta, y ya la extraerás si hace falta.

SEGUNDA PREGUNTA, igual de útil:
"¿Necesito sustituir esto por un doble en los tests?"
Si la respuesta es sí (base de datos, reloj, email,
API externa), también merece interfaz.`
      },
      steps: [
        'Lista 6 candidatos a abstracción en VetCare (persistencia, notificación, reloj, generación de Ids, pagos, archivos).',
        'Aplica las dos preguntas clave a cada uno y decide: interfaz o clase concreta.',
        'Escribe las firmas de las 3 interfaces que decidas que sí valen la pena.'
      ],
      vet: [
        'Crea src/VetCare.Domain/Abstractions/ con tus 3 interfaces: por ejemplo INotificador, IRelojSistema, IRepositorioCitas.',
        'Documenta en docs/notes-csharp.md los candidatos que descartaste y por qué.'
      ],
      edge: [
        'Una interfaz con una sola implementación que nunca va a tener otra, y que no se usa en tests, es ruido. Bien usada, la interfaz existe para aislar un cambio o para poder testear.',
        'IRelojSistema parece exagerado hasta que intentas testear "no cancelar con menos de 2 horas" sin poder controlar el tiempo.'
      ],
      quiz: [
        { q: '¿Cuál es la prueba para decidir si algo merece una interfaz?', a: 'Si puedes imaginar una segunda implementación realista a medio plazo, o si necesitas sustituirla por un doble en los tests. Si ninguna de las dos se cumple, la interfaz solo agrega indirección.' },
        { q: '¿Por qué abstraer el reloj del sistema?', a: 'Porque DateTime.UtcNow es una dependencia externa no controlable. Sin abstraerlo no puedes testear reglas que dependen del tiempo sin esperar de verdad o manipular el reloj de la máquina.' },
        { q: '¿Qué problema tiene abstraer demasiado?', a: 'Cada capa de indirección hace más difícil seguir el flujo del código. Si hay cinco interfaces con una implementación cada una entre la petición y la base de datos, depurar se vuelve una búsqueda del tesoro.' },
        { q: '¿Qué esconde una buena abstracción?', a: 'Una decisión que podría cambiar: el proveedor, el protocolo, el motor de base de datos, el formato. No esconde complejidad arbitraria ni se usa solo para que el código parezca más profesional.' }
      ],
      out: '3 interfaces justificadas en Abstractions/ + lista documentada de candidatos descartados.',
      file: 'src/VetCare.Domain/Abstractions/INotificador.cs'
    },
    {
      t: 'Interfaces',
      obj: 'Implementar tus interfaces con al menos dos implementaciones reales e intercambiables.',
      why: 'Una interfaz con una sola implementación no demuestra nada. Con dos empiezas a ver el valor: puedes cambiar el comportamiento del sistema sin tocar el código que lo usa.',
      study: { r: 0, what: 'Lee la página de Interfaces completa (~15 min), incluida la implementación explícita y los miembros por defecto.',
        pasos: [
          'Lee "Declare an interface" e "Implement an interface" (~4 min).',
          'Lee "Explicit implementation" (~2 min): cuándo dos interfaces tienen un miembro con el mismo nombre.',
          'Lee "Interfaces vs. abstract classes" (~3 min) y escribe en una línea cuándo usarías cada una.',
          'Lee "Default interface members and static abstract members" (~3 min) solo para saber que existen; hoy no los necesitas.',
          'Lee "Interfaces summary" (~1 min) y compara con tus 3 interfaces: ¿cumplen lo que dice?'
        ] },
      ex: {
        title: 'Una interfaz, dos implementaciones',
        body: `  public interface INotificador
  {
      Task EnviarAsync(string destino, string mensaje);
  }

  // Implementación real
  public class NotificadorEmail : INotificador
  {
      private readonly string _remitente;
      public NotificadorEmail(string remitente) => _remitente = remitente;

      public async Task EnviarAsync(string destino, string mensaje)
      {
          // aquí iría el SMTP real
          await Task.Delay(10);
          Console.WriteLine($"[EMAIL de {_remitente}] {destino}: {mensaje}");
      }
  }

  // Implementación para desarrollo y tests
  public class NotificadorEnMemoria : INotificador
  {
      public List<(string Destino, string Mensaje)> Enviados { get; } = new();

      public Task EnviarAsync(string destino, string mensaje)
      {
          Enviados.Add((destino, mensaje));
          return Task.CompletedTask;
      }
  }

  // El código que las usa no sabe cuál recibió
  public class ServicioRecordatorios
  {
      private readonly INotificador _notificador;
      public ServicioRecordatorios(INotificador n) => _notificador = n;

      public async Task RecordarVacunaAsync(Mascota m, string contacto)
      {
          await _notificador.EnviarAsync(contacto,
              $"A {m.Nombre} le toca la vacuna.");
      }
  }

En producción le pasas NotificadorEmail.
En un test le pasas NotificadorEnMemoria y después
compruebas que Enviados tiene exactamente 1 elemento.
Mismo servicio, cero cambios en su código.`
      },
      steps: [
        'Implementa cada una de tus 3 interfaces con una versión real y una versión en memoria.',
        'Escribe una clase de servicio que dependa de la interfaz, nunca de la implementación concreta.',
        'En el playground, ejecuta el mismo servicio con las dos implementaciones y comprueba que funciona igual.'
      ],
      vet: [
        'Crea el proyecto src/VetCare.Infrastructure con las implementaciones reales y las en memoria: dotnet new classlib -o src/VetCare.Infrastructure, después dotnet sln add src/VetCare.Infrastructure y dotnet add src/VetCare.Infrastructure reference src/VetCare.Domain. Para usarlo en el playground: dotnet add src/VetCare.Playground reference src/VetCare.Infrastructure.',
        'Verifica que src/VetCare.Domain NO referencia a Infrastructure. La flecha de dependencia apunta hacia el dominio, nunca al revés.'
      ],
      edge: [
        'Si tu dominio necesita referenciar Infrastructure para compilar, la dependencia está invertida. Ese es el tema central de la semana 15.',
        'Una interfaz con 12 métodos obliga a toda implementación a escribir 12. Eso es violar ISP, que verás la semana que viene.'
      ],
      quiz: [
        { q: '¿Qué gana el servicio al depender de INotificador en vez de NotificadorEmail?', a: 'Que puede funcionar con cualquier canal sin cambiar una línea, y que en tests puede usar una versión en memoria que no envía nada real pero permite verificar que se intentó enviar.' },
        { q: '¿Por qué el dominio no debe referenciar a Infrastructure?', a: 'Porque el dominio es lo estable y la infraestructura lo cambiante. Si el dominio depende del proveedor de email, cambiar de proveedor obliga a recompilar y retestear las reglas de negocio.' },
        { q: '¿Qué es una implementación en memoria y para qué sirve?', a: 'Una versión que guarda el efecto en una lista en vez de hacerlo de verdad. Sirve para tests rápidos y deterministas, y para desarrollar sin depender de servicios externos.' },
        { q: '¿Cuándo una interfaz tiene demasiados métodos?', a: 'Cuando las implementaciones acaban dejando métodos vacíos o lanzando NotImplementedException. Eso indica que son en realidad varias responsabilidades que deberían ser interfaces separadas.' }
      ],
      out: 'Cada interfaz con 2 implementaciones + servicio que depende solo de la abstracción.',
      file: 'src/VetCare.Infrastructure/NotificadorEmail.cs'
    },
    {
      t: 'Composición sobre herencia',
      obj: 'Resolver con composición un problema que instintivamente resolverías con herencia, y comparar.',
      why: 'La herencia crea el acoplamiento más fuerte que existe en OOP: el hijo depende de los detalles internos del padre. La composición da la misma reutilización sin esa atadura.',
      study: { r: 3, what: 'Lee la introducción, el ejemplo y las secciones de ventajas e inconvenientes (~10 min). Clave: herencia es "es un", composición es "tiene un" o "usa un".',
        pasos: [
          'Lee la introducción (~2 min): la idea de reutilizar comportamiento por contención y no por herencia.',
          'Lee "Example", primero "Inheritance" y después "Composition and interfaces" (~5 min). Fíjate en cuántas clases necesita cada versión.',
          'Lee "Benefits" y "Drawbacks" (~3 min).',
          'Lee "Avoiding drawbacks" (~2 min): cómo reducir el código repetitivo que trae la composición.',
          'Escribe una tabla con las variantes de tu caso de VetCare y cuenta las clases que harían falta con herencia frente a composición.'
        ] },
      ex: {
        title: 'El mismo problema, dos soluciones',
        body: `PROBLEMA: hay varios tipos de tarifa para una consulta:
normal, urgencia (recargo 50%) y cliente frecuente (-10%).

CON HERENCIA (se rompe pronto):

  class Consulta { public virtual decimal Precio() => 100; }
  class ConsultaUrgente : Consulta
      { public override decimal Precio() => 150; }
  class ConsultaFrecuente : Consulta
      { public override decimal Precio() => 90; }

  ¿Y ahora? Una consulta urgente DE un cliente frecuente.
  Necesitas ConsultaUrgenteFrecuente. Y con un tercer
  modificador (por ejemplo, fin de semana) tendrías
  8 clases (2 x 2 x 2). Explosión combinatoria.

CON COMPOSICIÓN (escala):

  public interface IReglaPrecio
  {
      decimal Aplicar(decimal baseActual);
  }

  public class Urgencia : IReglaPrecio
  {
      public decimal Aplicar(decimal b) => b * 1.5m;
  }

  public class ClienteFrecuente : IReglaPrecio
  {
      public decimal Aplicar(decimal b) => b * 0.9m;
  }

  public class Consulta
  {
      private readonly List<IReglaPrecio> _reglas;
      private readonly decimal _base;

      public Consulta(decimal precioBase, IEnumerable<IReglaPrecio> reglas)
      {
          _base = precioBase;
          _reglas = reglas.ToList();
      }

      public decimal Precio() =>
          _reglas.Aggregate(_base, (acc, r) => r.Aplicar(acc));
  }

  var c = new Consulta(100m,
      new IReglaPrecio[] { new Urgencia(), new ClienteFrecuente() });
  // 100 -> 150 -> 135

Agregar una cuarta regla = una clase nueva, cero cambios
en Consulta. Esto es el patrón Strategy que verás en la
semana 8, descubierto por ti mismo hoy.`
      },
      steps: [
        'Busca en VetCare un caso donde ibas a usar herencia (tipos de tarifa, tipos de notificación, tipos de usuario).',
        'Impleméntalo con herencia y cuenta cuántas clases necesitarías si se combinan dos variantes.',
        'Reimpleméntalo con composición y compara: líneas de código, clases necesarias y coste de agregar una variante nueva.'
      ],
      vet: [
        'Implementa la versión por composición en src/VetCare.Domain/ y borra la de herencia.',
        'Anota en docs/notes-csharp.md la comparación numérica entre ambas.'
      ],
      edge: [
        'La composición no es gratis: agrega más tipos pequeños. La ganancia aparece cuando hay combinaciones; con una sola variante la herencia puede ser más simple.',
        'El orden de las reglas importa en cuanto mezclas tipos: con dos porcentajes da igual (multiplicar es conmutativo: 100 x 1,5 x 0,9 = 100 x 0,9 x 1,5 = 135), pero con un descuento fijo de 10 € no. Recargo y luego descuento: 150 - 10 = 140. Descuento y luego recargo: 90 x 1,5 = 135. Eso es una decisión de negocio: documéntala.'
      ],
      quiz: [
        { q: '¿Qué es la explosión combinatoria de clases y por qué la causa la herencia?', a: 'Que cada combinación de variantes exige una clase nueva: con 3 modificadores independientes necesitas hasta 8 subclases. La herencia solo permite una cadena, así que las combinaciones hay que materializarlas.' },
        { q: '¿Cuál es la pregunta para elegir entre herencia y composición?', a: 'Si la relación es verdaderamente "es un" y estable, la herencia puede valer. Si es "tiene un", "usa un" o puede combinarse con otras características, composición.' },
        { q: '¿Por qué la herencia crea el acoplamiento más fuerte?', a: 'Porque el hijo depende de detalles internos del padre, no solo de su interfaz pública. Un cambio en cómo el padre implementa algo puede romper al hijo aunque la firma no cambie.' },
        { q: '¿Qué desventaja real tiene la composición?', a: 'Más tipos pequeños y una indirección extra: hay que saltar entre varias clases para entender el flujo completo. Compensa cuando hay variabilidad real; no cuando hay un solo caso.' }
      ],
      out: 'Solución por composición implementada + comparación documentada contra la versión por herencia.',
      file: 'src/VetCare.Domain/Precios/IReglaPrecio.cs'
    },
    {
      t: 'Herencia y clases abstractas',
      obj: 'Usar herencia donde sí corresponde y conocer las reglas que impiden que se convierta en un problema.',
      why: 'La herencia no es mala, es fácil de usar mal. Saber cuándo es la herramienta correcta te evita tanto el abuso como el miedo irracional a usarla.',
      study: { r: 1, what: 'Lee la página de Inheritance (~15 min): clases abstractas, virtual, override, sealed y la diferencia con new.',
        pasos: [
          'Lee la introducción (~3 min): qué hereda y qué no hereda una clase derivada.',
          'Lee "Abstract and virtual methods" y "Abstract base classes" (~5 min).',
          'Lee "Preventing further derivation" (~2 min): sealed y por qué conviene en las hojas de la jerarquía.',
          'Lee "Derived class hiding of base class members" (~3 min): la diferencia entre new y override, y por qué new casi siempre es un error.',
          'Antes de programar, dibuja tu jerarquía en papel y marca cuál es abstract y cuáles son sealed.'
        ] },
      ex: {
        title: 'Herencia bien usada: plantilla con pasos variables',
        body: `Caso válido: todos los documentos clínicos comparten
estructura y ciclo de vida, pero varía el contenido.

  public abstract class DocumentoClinico
  {
      public Guid Id { get; }
      public Guid MascotaId { get; }
      public DateTime Fecha { get; }

      protected DocumentoClinico(Guid mascotaId, DateTime fecha)
      {
          if (mascotaId == Guid.Empty)
              throw new ArgumentException("Mascota requerida.");
          Id = Guid.NewGuid();
          MascotaId = mascotaId;
          Fecha = fecha;
      }

      // cada subclase DEBE definirlo
      public abstract string Resumen();

      // comportamiento común, no se repite
      public string Encabezado() =>
          $"[{Fecha:yyyy-MM-dd}] {GetType().Name} #{Id.ToString()[..8]}";
  }

  public sealed class Receta : DocumentoClinico
  {
      public string Medicamento { get; }
      public string Posologia { get; }

      public Receta(Guid mascotaId, DateTime fecha,
                    string medicamento, string posologia)
          : base(mascotaId, fecha)
      {
          Medicamento = medicamento;
          Posologia = posologia;
      }

      public override string Resumen() =>
          $"Receta: {Medicamento} ({Posologia})";
  }

TRES REGLAS PARA NO SUFRIR:
1. La clase base es abstract: nunca se instancia sola.
2. Las hojas son sealed: nadie hereda de una subclase.
   La jerarquía tiene 2 niveles, no 5.
3. La base no conoce a sus hijos. Si escribes
   "if (this is Receta)" dentro de la base, la jerarquía
   está mal: eso debería ser un método abstracto.`
      },
      steps: [
        'Encuentra en VetCare un caso real de "es un" con comportamiento común: documentos clínicos, eventos, usuarios.',
        'Impleméntalo con una clase abstracta y 2-3 subclases sealed.',
        'Comprueba las 3 reglas: base abstract, hojas sealed, cero comprobaciones de tipo dentro de la base.'
      ],
      vet: [
        'Crea la jerarquía en src/VetCare.Domain/ con mínimo 2 subclases.',
        'Anota por qué en este caso la herencia es mejor que la composición que usaste ayer.'
      ],
      edge: [
        'Si una subclase tiene que lanzar NotSupportedException en un método heredado, estás violando LSP y la jerarquía está mal. Lo verás en detalle la semana que viene.',
        'Una jerarquía de más de 2 niveles casi siempre se puede aplanar. Cada nivel extra multiplica la dificultad de entender de dónde sale un comportamiento.'
      ],
      quiz: [
        { q: '¿Cuándo es la herencia la herramienta correcta?', a: 'Cuando hay una relación "es un" genuina y estable, comportamiento común real que se repetiría, y un conjunto cerrado y conocido de variantes que no se combinan entre sí.' },
        { q: '¿Por qué marcar las subclases como sealed?', a: 'Para limitar la jerarquía a dos niveles. Sin sealed, alguien heredará de tu subclase y a partir de ahí es imposible razonar sobre qué implementación se ejecuta.' },
        { q: '¿Qué indica un "if (this is SubclaseX)" dentro de la clase base?', a: 'Que la base conoce a sus hijos, lo cual invierte la relación. Ese condicional debería ser un método abstracto que cada subclase implementa a su manera.' },
        { q: '¿Diferencia entre clase abstracta e interfaz?', a: 'La interfaz solo declara un contrato y una clase puede implementar varias. La clase abstracta puede aportar estado y código compartido, pero solo se puede heredar de una. Se usa interfaz para el contrato y abstracta para compartir implementación.' }
      ],
      out: 'Jerarquía con clase abstracta y 2+ subclases sealed que cumple las 3 reglas.',
      file: 'src/VetCare.Domain/Documentos/DocumentoClinico.cs'
    },
    {
      t: 'Polimorfismo',
      obj: 'Eliminar condicionales por tipo sustituyéndolos por polimorfismo.',
      why: 'Cada switch sobre un tipo es un sitio que habrá que modificar cuando aparezca un caso nuevo. El polimorfismo convierte ese cambio en agregar una clase sin tocar nada existente.',
      study: { r: 2, what: 'Lee la página de Polymorphism (~12 min). Clave: el método que se ejecuta lo decide el tipo real del objeto en tiempo de ejecución, no el tipo de la variable.',
        pasos: [
          'Lee "Polymorphism overview" (~4 min) y el ejemplo de las figuras que se dibujan.',
          'Lee "Virtual members" (~3 min): virtual en la base, override en la derivada.',
          'Lee "Hide base class members with new members" (~2 min) y compara su salida con la de override.',
          'Lee "Prevent derived classes from overriding virtual members" y "Access base class virtual members from derived classes" (~3 min).',
          'Escribe una variable de tipo base que apunte a un objeto derivado, llama al método y predice qué se imprime antes de ejecutarlo.'
        ] },
      ex: {
        title: 'Del switch al polimorfismo',
        body: `ANTES: un switch que crece con cada tipo nuevo.

  public string Describir(DocumentoClinico doc)
  {
      switch (doc)
      {
          case Receta r:
              return $"Receta: {r.Medicamento}";
          case Vacunacion v:
              return $"Vacuna: {v.Nombre}";
          case Diagnostico d:
              return $"Dx: {d.Texto}";
          default:
              throw new NotSupportedException();
      }
  }

Problemas: cada tipo nuevo obliga a tocar este método,
el default es una bomba, y si existe el mismo switch en
tres sitios te olvidarás de uno.

DESPUÉS: cada clase sabe describirse.

  foreach (var doc in documentos)
      Console.WriteLine(doc.Encabezado() + " " + doc.Resumen());

El método Resumen() es abstracto en la base. En tiempo
de ejecución, .NET llama a la implementación del tipo
REAL del objeto, no al de la variable declarada.

PRUEBA DE QUE FUNCIONA:

  List<DocumentoClinico> docs = new()
  {
      new Receta(id, hoy, "Amoxicilina", "1 cada 12h"),
      new Vacunacion(id, hoy, "Antirrábica")
  };

  foreach (var d in docs)
      Console.WriteLine(d.Resumen());
  // Receta: Amoxicilina (1 cada 12h)
  // Vacuna: Antirrábica

La variable es DocumentoClinico en ambos casos, pero
se ejecuta el Resumen() de cada tipo concreto.

Agregar Derivacion mañana = una clase nueva. Cero cambios
en el código que recorre la lista.`
      },
      steps: [
        'Busca en tu código cualquier switch o cadena de if sobre tipos y lístalos.',
        'Convierte uno en polimorfismo: método abstracto en la base, implementación en cada hoja.',
        'Agrega un tipo nuevo y comprueba que no tuviste que modificar ningún código existente.'
      ],
      vet: [
        'Deja la jerarquía de documentos con comportamiento polimórfico y sin switches por tipo.',
        'En el playground recorre una lista mixta y muestra el resultado de cada uno.'
      ],
      edge: [
        'No todo switch es malo: un switch sobre un enum de estados cerrado y estable puede ser más claro que una jerarquía. El problema es el switch sobre TIPOS que crecen.',
        'El default que lanza NotSupportedException es la señal clásica: indica que el compilador no puede garantizarte que cubriste todos los casos.'
      ],
      quiz: [
        { q: '¿Qué determina qué implementación se ejecuta en una llamada polimórfica?', a: 'El tipo real del objeto en tiempo de ejecución, no el tipo de la variable que lo referencia. Por eso una variable declarada como DocumentoClinico ejecuta el Resumen de Receta si el objeto es una Receta.' },
        { q: '¿Por qué un switch sobre tipos es problemático?', a: 'Porque cada tipo nuevo obliga a modificar ese switch, y normalmente existe el mismo switch duplicado en varios sitios. Es el síntoma clásico de violación del principio abierto-cerrado.' },
        { q: '¿Cuándo es aceptable un switch?', a: 'Sobre un enum cerrado y estable, o cuando la lógica es de una capa externa que no debe contaminar el dominio, como traducir un tipo a un formato de respuesta HTTP. El criterio es si el conjunto de casos crece.' },
        { q: '¿Qué gana el código cliente con el polimorfismo?', a: 'Que deja de conocer los tipos concretos. Puede recorrer una lista heterogénea y pedir el comportamiento sin saber con qué está hablando, y seguirá funcionando con tipos que todavía no existen.' }
      ],
      out: 'Switch por tipos eliminado, reemplazado por polimorfismo, y un tipo nuevo agregado sin tocar código existente.',
      file: 'src/VetCare.Domain/Documentos/'
    },
    {
      t: 'Refactor OOP (examen de la semana)',
      obj: 'Refactorizar todo tu dominio aplicando lo aprendido y justificar cada decisión de diseño.',
      why: 'Refactorizar sin cambiar comportamiento es una habilidad separada de programar. Es la que te permite mejorar código existente sin romper nada, que es el 80% del trabajo real.',
      study: { r: 0, what: 'Sin material nuevo. Relee todo src/VetCare.Domain como si fuera código de otra persona que tienes que revisar.',
        pasos: [
          'Repasa "Interfaces vs. abstract classes" (~3 min) para tener fresco el criterio.',
          'Abre src/VetCare.Domain y recorre los archivos en orden alfabético, como si fueras un revisor externo.',
          'En cada clase anota: propósito en una frase, dependencias que recibe y cualquier condicional por tipo.',
          'Haz la lista de problemas antes de tocar nada y ordénala de más fácil a más difícil de arreglar.'
        ] },
      ex: {
        title: 'Checklist de revisión OOP',
        body: `Para cada clase de tu dominio responde:

 1. ¿Tiene comportamiento o es solo datos? (anémico)
 2. ¿Se puede construir en estado inválido?
 3. ¿Tiene algún setter público?
 4. ¿Expone colecciones modificables?
 5. ¿Depende de alguna clase concreta que debería
    ser interfaz?
 6. ¿Hay lógica duplicada en dos clases?
 7. ¿Hay algún switch sobre tipos?
 8. ¿La jerarquía tiene más de 2 niveles?
 9. ¿Algún método supera las 20 líneas?
10. ¿Los nombres salen del glosario del negocio?

REGLA DE ORO DEL REFACTOR:
no cambias comportamiento. Antes de empezar, ejecuta tu
programa de ataque de la semana 5 y anota la salida.
Al terminar, la salida debe ser IDÉNTICA.

Si no tienes forma de verificar que el comportamiento no
cambió, no estás refactorizando: estás reescribiendo y
cruzando los dedos.`
      },
      steps: [
        'Ejecuta el programa de ataque de la semana 5 y guarda la salida como referencia.',
        'Pasa el checklist de 10 puntos sobre cada clase y corrige todo lo que falle.',
        'Vuelve a ejecutar el programa de ataque: la salida debe ser idéntica. Si cambió, revierte y hazlo en pasos más pequeños.'
      ],
      vet: [
        'Deja src/VetCare.Domain refactorizado, compilando sin warnings y con el programa de ataque dando la misma salida.',
        'Pulsa «Marcar para repasar» y guarda el resultado del checklist junto al código.'
      ],
      edge: [
        'Refactoriza en pasos pequeños y compila después de cada uno. Un refactor grande que no compila es imposible de depurar.',
        'Si el checklist te marca algo que no sabes arreglar todavía, anótalo como deuda: varios de esos puntos se resuelven con SOLID la semana que viene.'
      ],
      quiz: [
        { q: '¿Qué define exactamente a un refactor?', a: 'Un cambio en la estructura interna del código que no altera su comportamiento observable. Si el comportamiento cambia, es otra cosa: una corrección o una funcionalidad nueva.' },
        { q: '¿Por qué es imprescindible poder verificar el comportamiento antes de refactorizar?', a: 'Porque sin verificación no puedes distinguir un refactor de una rotura. La red de seguridad (tests o al menos un programa de ataque) es lo que hace que refactorizar sea seguro en vez de temerario.' },
        { q: '¿Por qué refactorizar en pasos pequeños?', a: 'Porque si algo se rompe sabes exactamente qué paso lo rompió. Con un cambio grande tienes que bisecar manualmente entre decenas de modificaciones mezcladas.' },
        { q: 'Resume la semana 6 en una idea.', a: 'Que el diseño orientado a objetos consiste en decidir qué esconder detrás de abstracciones, preferir componer sobre heredar, y dejar que el polimorfismo elimine los condicionales por tipo para que agregar casos nuevos no obligue a tocar código existente.' }
      ],
      out: 'Dominio refactorizado con checklist de 10 puntos aprobado y comportamiento verificado sin cambios.',
      file: 'src/VetCare.Domain/'
    }
  ]
}
]);
