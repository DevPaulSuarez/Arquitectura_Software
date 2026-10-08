window.WEEKS = (window.WEEKS || []).concat([
{
  n: 9,
  phase: 'Bases de datos',
  title: 'SQL de verdad: crear, proteger y consultar datos',
  idea: 'Un ORM te deja escribir SQL sin saber SQL, y eso funciona hasta el día que algo va lento o los datos salen mal. Esta semana escribes SQL a mano contra PostgreSQL: creas el esquema de VetCare, lo blindas con constraints y aprendes a consultar sin inventar resultados.',
  res: [
    { t: 'PostgreSQL — Data Types', u: 'https://www.postgresql.org/docs/current/datatype.html', note: 'Todos los tipos de datos. Hoy solo numéricos, texto y fechas.' },
    { t: 'PostgreSQL — Data Manipulation (INSERT, UPDATE, DELETE, RETURNING)', u: 'https://www.postgresql.org/docs/current/dml.html', note: 'Capítulo oficial corto sobre escribir datos.' },
    { t: 'PostgreSQL — Transactions',
      u: 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
      note: 'Capítulo corto del tutorial oficial sobre transacciones. Es el tema del día 6.' },
    { t: 'PostgreSQL — Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html', note: 'CHECK, NOT NULL, UNIQUE, PRIMARY KEY y FOREIGN KEY.' },
    { t: 'PostgreSQL — Comparison Functions and Operators', u: 'https://www.postgresql.org/docs/current/functions-comparison.html', note: 'Cómo se compara con NULL y por qué sorprende.' },
    { t: 'PostgreSQL — Joins Between Tables', u: 'https://www.postgresql.org/docs/current/tutorial-join.html', note: 'El tutorial oficial de JOIN con ejemplos.' }
  ],
  days: [
    {
      t: 'DDL y tipos de datos',
      obj: 'Crear tablas eligiendo el tipo correcto para cada columna.',
      why: 'El tipo de dato es una decisión que te acompaña años. Guardar dinero en float o fechas en texto son errores que cuestan migraciones dolorosas y se preguntan en entrevistas.',
      study: { r: 0, what: 'Lee las secciones Numeric Types, Character Types y Date/Time Types. Unos 15 minutos. Busca una cosa: la diferencia entre numeric, real y double precision.',
        pasos: [
          'Abre "8.1. Numeric Types" desde el índice (~6 min). Lee la tabla inicial y la parte de numeric: es el tipo para dinero porque no redondea.',
          'En la misma página lee la parte de real y double precision (~2 min): son aproximados, por eso no sirven para importes.',
          'Abre "8.3. Character Types" (~3 min): la diferencia entre varchar(n) y text, y por qué en PostgreSQL no hay diferencia de rendimiento.',
          'Abre "8.5. Date/Time Types" (~4 min): fíjate en timestamptz y por qué guarda el instante exacto sin ambigüedad de zona horaria.',
          'Escribe el tipo de cada columna de Cita y de Factura con una línea de motivo.'
        ] },
      ex: { title: 'Elegir el tipo correcto', body: `MAL

CREATE TABLE factura (
    id          VARCHAR(50),
    total       FLOAT,
    fecha       VARCHAR(20),
    pagada      VARCHAR(2)
);

Problemas:
- FLOAT para dinero: 0.1 + 0.2 no da 0.3. Pierdes centavos.
- VARCHAR para fecha: no puedes ordenar ni restar fechas.
- VARCHAR para booleano: admite 'sí', 'SÍ', 'y', 'true', basura.
- VARCHAR para id: ocupa más y no valida el formato.

BIEN

CREATE TABLE factura (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    total       NUMERIC(10,2)  NOT NULL,
    fecha       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    pagada      BOOLEAN        NOT NULL DEFAULT false,
    nota        TEXT
);

Guía rápida para PostgreSQL:
dinero            -> NUMERIC(p,s), nunca float
momento exacto    -> TIMESTAMPTZ (guarda en UTC)
solo fecha        -> DATE
texto             -> TEXT (en Postgres no es más lento que VARCHAR)
sí/no             -> BOOLEAN
id de entidad     -> UUID (es el Guid de C# que elegiste
                     en la semana 3)
la otra opción    -> BIGINT GENERATED ALWAYS AS IDENTITY
                     (más compacto, pero revela volumen)` },
      steps: [
        'Instala PostgreSQL localmente o levanta uno con Docker: docker run --name vetcare-db -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:17',
        'Conéctate con psql o con una herramienta gráfica y crea la base vetcare.',
        'Traduce tu modelo de dominio de la semana 4 a CREATE TABLE: dueno, mascota, veterinario, cita, visita, vacuna, factura, linea_factura (en SQL, los nombres sin tildes ni ñ).',
        'Para cada columna justifica el tipo en un comentario SQL al lado. Si no sabes justificarlo, no lo elegiste, lo copiaste.',
        'Ejecuta el script completo desde cero dos veces usando DROP TABLE IF EXISTS al inicio (en orden inverso al de creación, o con CASCADE, por las claves foráneas), para comprobar que es reproducible.'
      ],
      vet: [
        'Guarda el resultado en database/schema.sql. Este archivo va a crecer toda la fase.',
        'Usa nombres en snake_case y en singular para tablas: dueno, mascota, cita.'
      ],
      edge: [
        'TIMESTAMP sin zona horaria es una trampa: guarda el número pero no sabes de qué zona. Usa TIMESTAMPTZ.',
        'NUMERIC es exacto pero más lento que los enteros. Para dinero esa lentitud no importa.',
        'Evita VARCHAR(255) por costumbre: pon el límite que exige el negocio o usa TEXT con un CHECK de longitud.'
      ],
      quiz: [
        { q: '¿Por qué no se debe usar FLOAT para dinero?', a: 'Porque los flotantes son binarios y no pueden representar exactamente valores decimales como 0.10. Los errores se acumulan en sumas y los totales terminan descuadrados por centavos.' },
        { q: '¿Cuál es la diferencia entre TIMESTAMP y TIMESTAMPTZ?', a: 'TIMESTAMPTZ convierte a UTC al guardar y vuelve a la zona de la sesión al leer, así que representa un instante real. TIMESTAMP guarda una pared de reloj sin contexto y es ambiguo en cuanto hay más de una zona.' },
        { q: '¿Cuándo usarías UUID en vez de un entero identidad?', a: 'Cuando el identificador se expone hacia afuera o se genera en varios lugares sin coordinación. El entero secuencial es más compacto y rápido, pero revela volumen y orden de creación.' },
        { q: '¿En PostgreSQL, TEXT es más lento que VARCHAR(n)?', a: 'No, internamente se almacenan igual. VARCHAR(n) solo agrega una validación de longitud, así que se elige por la regla de negocio, no por rendimiento.' }
      ],
      out: 'database/schema.sql que crea todas las tablas desde cero sin errores.',
      file: 'database/schema.sql'
    },
    {
      t: 'Constraints: que la base defienda tus reglas',
      obj: 'Impedir datos inválidos en la base, no solo en el código.',
      why: 'La aplicación no es el único que escribe en la base: hay scripts, migraciones y gente con psql. Las constraints son la última línea de defensa y un tema clásico de entrevista.',
      study: { r: 3, what: 'Lee Check, Not-Null, Unique, Primary Keys y Foreign Keys. Unos 18 minutos. Busca una cosa: qué hacen ON DELETE CASCADE y ON DELETE RESTRICT.',
        pasos: [
          'Relee "Check Constraints" (~4 min), ahora con tu esquema real delante.',
          'Lee "Not-Null Constraints" y "Unique Constraints" (~4 min).',
          'Lee "Primary Keys" (~2 min).',
          'Lee "Foreign Keys" hasta el final (~6 min), con atención a la lista de acciones ON DELETE.',
          'Escribe en una tabla, para cada FK de VetCare, la acción ON DELETE elegida y la regla de negocio que la justifica.'
        ] },
      ex: { title: 'Las cinco constraints esenciales', body: `CREATE TABLE cita (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mascota_id      UUID NOT NULL
        REFERENCES mascota(id) ON DELETE RESTRICT,

    veterinario_id  UUID NOT NULL
        REFERENCES veterinario(id) ON DELETE RESTRICT,

    inicio          TIMESTAMPTZ NOT NULL,
    fin             TIMESTAMPTZ NOT NULL,
    estado          TEXT NOT NULL DEFAULT 'agendada',
    motivo          TEXT,

    CONSTRAINT ck_cita_rango
        CHECK (fin > inicio),

    CONSTRAINT ck_cita_estado
        CHECK (estado IN ('agendada','confirmada','atendida','cancelada')),

    CONSTRAINT uq_cita_vet_inicio
        UNIQUE (veterinario_id, inicio)
);

Qué hace cada una:

NOT NULL    el dato es obligatorio
PRIMARY KEY identidad única de la fila
REFERENCES  la fila apuntada tiene que existir
CHECK       regla sobre los valores de la fila
UNIQUE      no se repite esa combinación

ON DELETE:
RESTRICT  impide borrar el padre si hay hijos  (seguro)
CASCADE   borra los hijos con el padre        (peligroso)
SET NULL  deja el hijo huérfano con null

Para VetCare: RESTRICT en casi todo.
CASCADE solo de factura a linea_factura,
porque una línea no tiene sentido sin su factura.` },
      steps: [
        'Agrega a cada tabla de database/schema.sql sus NOT NULL, PRIMARY KEY y FOREIGN KEY.',
        'Escribe al menos cuatro CHECK que codifiquen reglas reales: peso positivo, email con arroba, fin mayor que inicio, estado en una lista cerrada.',
        'Nombra todas las constraints con prefijos: pk_, fk_, uq_, ck_. Los errores de la base te dirán el nombre y lo agradecerás.',
        'Crea database/invalid-inserts.sql con diez INSERT que deben fallar, uno por cada constraint.',
        'Ejecútalos y copia el mensaje de error de cada uno al lado como comentario. Ese archivo es tu prueba de que el esquema defiende las reglas.'
      ],
      vet: [
        'Regla clave de VetCare: no puede haber dos citas del mismo veterinario a la misma hora. Empieza con UNIQUE(veterinario_id, inicio).',
        'Anota en database/README.md que el solapamiento parcial aún no está cubierto. Lo resolverás con EXCLUDE en la semana 10.'
      ],
      edge: [
        'Un CHECK solo puede mirar la misma fila. Las reglas entre tablas necesitan trigger o lógica de aplicación.',
        'UNIQUE permite múltiples NULL en PostgreSQL, porque NULL no es igual a NULL. Si quieres evitarlo, agrega NOT NULL (o, desde PostgreSQL 15, UNIQUE NULLS NOT DISTINCT).',
        'ON DELETE CASCADE puede borrar miles de filas sin aviso. Úsalo solo cuando el hijo no exista sin el padre.'
      ],
      quiz: [
        { q: 'Si la aplicación ya valida, ¿para qué poner constraints en la base?', a: 'Porque la aplicación no es el único cliente: hay migraciones, scripts, otro servicio o alguien con psql. La constraint garantiza la regla pase lo que pase y hace imposible que entren datos corruptos.' },
        { q: '¿Cuándo es correcto usar ON DELETE CASCADE?', a: 'Cuando el hijo no tiene existencia propia sin el padre, como las líneas de una factura. Si el hijo es información histórica valiosa, como las visitas de una mascota, RESTRICT es lo correcto.' },
        { q: '¿Qué limitación tiene CHECK?', a: 'Solo puede evaluar columnas de la misma fila. No puede consultar otras tablas ni otras filas, así que reglas como "no más de 20 citas por día" necesitan otra herramienta.' },
        { q: '¿Por qué conviene nombrar las constraints a mano?', a: 'Porque el mensaje de error de PostgreSQL incluye el nombre. Con un nombre como ck_cita_rango sabes al instante qué falló; con un nombre autogenerado tienes que ir a buscarlo al esquema.' }
      ],
      out: 'Esquema con constraints nombradas y database/invalid-inserts.sql con los errores documentados.',
      file: 'database/invalid-inserts.sql'
    },
    {
      t: 'INSERT, UPDATE y DELETE sin romper nada',
      obj: 'Modificar datos con seguridad y poblar la base con datos de prueba realistas.',
      why: 'Un UPDATE sin WHERE en producción es una historia que todo desarrollador escucha una vez. Aprender los hábitos defensivos ahora evita que la historia sea tuya.',
      study: { r: 1, what: 'Lee las cuatro secciones del capítulo: Inserting Data, Updating Data, Deleting Data y Returning Data from Modified Rows. Unos 15 minutos. Busca una cosa: qué te devuelve la cláusula RETURNING y por qué es útil.',
        pasos: [
          'Abre "6.1. Inserting Data" (~3 min): fíjate en listar siempre las columnas en el INSERT.',
          'Abre "6.2. Updating Data" (~3 min) y lee la advertencia: un UPDATE sin WHERE cambia todas las filas.',
          'Abre "6.3. Deleting Data" (~2 min).',
          'Abre "6.4. Returning Data from Modified Rows" (~4 min) y prueba un INSERT ... RETURNING id en psql.',
          'Antes de cada UPDATE o DELETE de hoy, ejecuta primero un SELECT con el mismo WHERE y cuenta las filas.'
        ] },
      ex: { title: 'Escribir datos con red de seguridad', body: `INSERT con varias filas y RETURNING

INSERT INTO dueno (nombre, email, telefono) VALUES
  ('Ana Perez',  'ana@example.com',  '555-0101'),
  ('Luis Gomez', 'luis@example.com', '555-0102')
RETURNING id, nombre;

RETURNING te da el id generado sin hacer otra consulta.

UPDATE: SIEMPRE con WHERE

-- Paso 1: mira a quién vas a afectar
SELECT id, estado FROM cita
 WHERE id = '7f9c2e0a-5b1d-4c8e-9a3f-2d6b8e1c4a90';

-- Paso 2: recién ahora actualiza
UPDATE cita
   SET estado = 'cancelada',
       motivo = 'El dueño reprogramó'
 WHERE id = '7f9c2e0a-5b1d-4c8e-9a3f-2d6b8e1c4a90'
RETURNING id, estado;

UPSERT: insertar o actualizar si ya existe

INSERT INTO vacuna (mascota_id, tipo, fecha, lote)
SELECT id, 'rabia', DATE '2026-03-10', 'L-2231'
  FROM mascota WHERE nombre = 'Rocky'
ON CONFLICT (mascota_id, tipo, fecha)
DO UPDATE SET lote = EXCLUDED.lote;

Necesita UNIQUE (mascota_id, tipo, fecha). La fecha va en
la clave porque la misma vacuna se repite cada año
(semana 4): si la clave fuera solo (mascota_id, tipo),
la vacuna de este año pisaría la del año pasado.

DELETE: el hábito que salva carreras

BEGIN;
  DELETE FROM cita WHERE estado = 'cancelada' AND inicio < '2025-01-01';
  -- Postgres dice: DELETE 134
  -- ¿Esperabas 134? Si no:
  -- ROLLBACK;
COMMIT;

Regla de oro: escribe el WHERE antes que el UPDATE/DELETE.
Muchos escriben primero SELECT y luego cambian la palabra.` },
      steps: [
        'Crea database/seed.sql con datos de prueba coherentes: 5 dueños, 8 mascotas, 3 veterinarios, 20 citas repartidas en el tiempo.',
        'Usa RETURNING para capturar ids y encadenar inserts con CTE (WITH ... AS) en lugar de poner ids a mano.',
        'Practica un UPDATE envuelto en BEGIN, revisa el número de filas afectadas y haz ROLLBACK a propósito.',
        'Intenta borrar un dueño que tiene mascotas y lee el error de la foreign key. Confirma que RESTRICT funciona.',
        'Escribe un UPSERT que registre la vacuna de una mascota sin duplicarla si ya existe.'
      ],
      vet: [
        'Los datos de seed deben incluir casos límite: una cita cancelada, una mascota sin visitas, un dueño con tres mascotas.',
        'El seed debe poder ejecutarse sobre una base recién creada con schema.sql, sin editar nada.'
      ],
      edge: [
        'En psql, autocommit está activo: un DELETE se aplica de inmediato si no abriste BEGIN.',
        'ON CONFLICT necesita una constraint única que coincida; si no existe, falla.',
        'Un UPDATE que no encuentra filas no es un error, simplemente afecta cero filas. Siempre revisa el contador.'
      ],
      quiz: [
        { q: '¿Para qué sirve RETURNING?', a: 'Devuelve las filas afectadas por un INSERT, UPDATE o DELETE en la misma operación. Evita una segunda consulta para obtener ids generados y garantiza que ves exactamente lo que se escribió.' },
        { q: '¿Cuál es el hábito que evita un UPDATE catastrófico?', a: 'Escribir primero un SELECT con el mismo WHERE para ver cuántas y cuáles filas se verán afectadas, y trabajar dentro de una transacción que puedas revertir si el contador no coincide con lo esperado.' },
        { q: '¿Qué hace ON CONFLICT DO UPDATE?', a: 'Si el INSERT choca con una constraint única, en vez de fallar ejecuta el UPDATE indicado sobre la fila existente. Es útil para operaciones idempotentes como sincronizaciones.' },
        { q: '¿Por qué el seed debe tener casos límite y no solo datos bonitos?', a: 'Porque los bugs aparecen en los bordes: entidades sin relaciones, registros cancelados, fechas pasadas. Un seed con solo datos felices esconde esos problemas hasta producción.' }
      ],
      out: 'database/seed.sql que puebla la base con datos coherentes y casos límite.',
      file: 'database/seed.sql'
    },
    {
      t: 'SELECT, filtros y NULL',
      obj: 'Consultar datos con precisión y entender la lógica de tres valores.',
      why: 'NULL es la causa número uno de resultados silenciosamente incorrectos en SQL. Entenderlo es la diferencia entre un reporte correcto y uno que se equivoca sin avisar.',
      study: { r: 4, what: 'Lee la página centrándote en IS NULL, IS DISTINCT FROM y la explicación de por qué comparar con NULL da NULL. Unos 15 minutos. Busca una cosa: por qué "columna != 5" no devuelve las filas donde columna es NULL.',
        pasos: [
          'Lee la tabla de operadores de comparación al principio de la página (~3 min).',
          'Busca la explicación de que no se debe escribir expresión = NULL (~3 min) y escribe con tus palabras por qué NULL no es igual a NULL.',
          'Lee la tabla de predicados: IS NULL, IS NOT NULL, IS DISTINCT FROM (~4 min).',
          'En psql ejecuta SELECT NULL = NULL; y SELECT NULL IS NOT DISTINCT FROM NULL; y compara los resultados.',
          'Reescribe una consulta de VetCare con != para que incluya también las filas con NULL.'
        ] },
      ex: { title: 'NULL y el orden de ejecución', body: `La trampa de NULL

SELECT * FROM mascota WHERE peso_kg != 10;

Esto NO devuelve las mascotas sin peso registrado.
Porque NULL != 10 no es true ni false, es NULL,
y WHERE solo deja pasar lo que es true.

Correcto:
SELECT * FROM mascota
 WHERE peso_kg IS DISTINCT FROM 10;

O explícito:
SELECT * FROM mascota
 WHERE peso_kg != 10 OR peso_kg IS NULL;

Reemplazar NULL al mostrar:
SELECT nombre, COALESCE(peso_kg, 0) AS peso FROM mascota;

Consulta completa con las piezas en orden

SELECT  m.nombre,
        m.especie,
        m.peso_kg
  FROM  mascota m
 WHERE  m.especie = 'perro'
   AND  m.fecha_nacimiento >= DATE '2020-01-01'
   AND  m.peso_kg IS NOT NULL
 ORDER BY m.peso_kg DESC NULLS LAST
 LIMIT  10;

ORDEN LÓGICO DE EJECUCIÓN (no el de escritura)

1. FROM     de dónde salen las filas
2. WHERE    filtra filas individuales
3. GROUP BY agrupa
4. HAVING   filtra grupos
5. SELECT   elige y calcula columnas
6. ORDER BY ordena
7. LIMIT    recorta

Por eso no puedes usar un alias del SELECT dentro del WHERE:
cuando WHERE se ejecuta, ese alias todavía no existe.` },
      steps: [
        'Escribe diez consultas sobre tu seed, de menor a mayor dificultad, en database/queries.sql.',
        'Incluye al menos una con BETWEEN, una con IN, una con LIKE o ILIKE y una con IS NULL.',
        'Haz el experimento del NULL: cuenta las mascotas con peso distinto de 10 usando != y usando IS DISTINCT FROM, y compara los dos números.',
        'Usa ORDER BY con NULLS LAST y observa cómo cambia el resultado.',
        'Intenta usar un alias del SELECT en el WHERE y lee el error. Ahora entiendes el orden de ejecución.'
      ],
      vet: [
        'Consultas útiles para VetCare: mascotas por especie, citas de hoy, dueños sin teléfono, mascotas sin visita en el último año.',
        'Comenta cada consulta con la pregunta de negocio que responde.'
      ],
      edge: [
        'LIKE distingue mayúsculas; ILIKE no. En búsquedas de nombres casi siempre quieres ILIKE.',
        'NOT IN con una subconsulta que devuelve algún NULL devuelve cero filas siempre. Usa NOT EXISTS.',
        'LIMIT sin ORDER BY no garantiza que recibas siempre las mismas filas: el orden no está definido.'
      ],
      quiz: [
        { q: '¿Por qué "peso != 10" no devuelve las filas con peso NULL?', a: 'Porque cualquier comparación con NULL da NULL, que no es verdadero. WHERE solo deja pasar lo verdadero, así que esas filas se descartan en silencio.' },
        { q: '¿Cuál es el orden lógico de ejecución de una consulta?', a: 'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. Es distinto al orden en que se escribe, y por eso un alias definido en SELECT no se puede usar en WHERE.' },
        { q: '¿Por qué NOT IN con subconsulta es peligroso?', a: 'Si la subconsulta devuelve aunque sea un NULL, la comparación nunca puede ser verdadera y el resultado es vacío. NOT EXISTS no tiene ese problema.' },
        { q: '¿Qué hace COALESCE y cuándo usarlo?', a: 'Devuelve el primer argumento que no sea NULL. Se usa para presentar un valor por defecto al mostrar datos, pero no debe usarse para esconder NULLs que en realidad indican un problema de datos.' }
      ],
      out: 'database/queries.sql con diez consultas comentadas y el experimento de NULL documentado.',
      file: 'database/queries.sql'
    },
    {
      t: 'JOINs',
      obj: 'Combinar tablas correctamente y saber cuándo cada tipo de JOIN cambia el resultado.',
      why: 'Los JOIN son la prueba técnica más frecuente en entrevistas de backend. Y en el trabajo, usar INNER cuando tocaba LEFT produce reportes que pierden filas sin avisar.',
      study: { r: 5, what: 'Lee la sección completa: inner join, left outer join y self join. Unos 18 minutos. Busca una cosa: por qué un filtro en el WHERE puede convertir un LEFT JOIN en un INNER JOIN.',
        pasos: [
          'Lee el principio de la sección (~4 min): la consulta que combina el tiempo de cada ciudad con su ubicación.',
          'Sigue con la parte de LEFT OUTER JOIN (~4 min): qué filas aparecen ahora y por qué salen columnas vacías.',
          'Lee la parte de self join (~3 min): unir una tabla consigo misma usando alias.',
          'Escribe tres consultas de VetCare: citas con su mascota (inner), mascotas con o sin citas (left) y una que filtre en el ON en vez del WHERE.',
          'Compara el número de filas de las dos últimas y explica la diferencia.'
        ] },
      ex: { title: 'Los JOIN que vas a usar de verdad', body: `INNER JOIN: solo lo que coincide en ambas

SELECT m.nombre AS mascota, d.nombre AS dueno
  FROM mascota m
  JOIN dueno d ON d.id = m.dueno_id;

LEFT JOIN: todo lo de la izquierda, coincida o no

SELECT m.nombre,
       COUNT(v.id) AS visitas
  FROM mascota m
  LEFT JOIN visita v ON v.mascota_id = m.id
 GROUP BY m.id, m.nombre;

Con LEFT JOIN, una mascota sin visitas aparece con 0.
Con INNER JOIN simplemente desaparece del reporte.

LA TRAMPA MÁS COMÚN

-- Esto ya NO es un LEFT JOIN
SELECT m.nombre, v.fecha
  FROM mascota m
  LEFT JOIN visita v ON v.mascota_id = m.id
 WHERE v.fecha >= DATE '2026-01-01';

Para las mascotas sin visita, v.fecha es NULL,
el WHERE las descarta y pierdes esas filas.

Correcto: el filtro va en el ON

SELECT m.nombre, v.fecha
  FROM mascota m
  LEFT JOIN visita v
         ON v.mascota_id = m.id
        AND v.fecha >= DATE '2026-01-01';

JOIN de tres tablas

SELECT d.nombre AS dueno, m.nombre AS mascota, c.inicio
  FROM cita c
  JOIN mascota m ON m.id = c.mascota_id
  JOIN dueno   d ON d.id = m.dueno_id
 WHERE c.inicio::date = CURRENT_DATE   -- en la semana 10 verás
 ORDER BY c.inicio;                    -- por qué esto no usa índices` },
      steps: [
        'Escribe la consulta de citas de hoy con dueño, mascota y veterinario, uniendo cuatro tablas.',
        'Escribe el reporte de visitas por mascota con LEFT JOIN y verifica que las mascotas sin visitas salen con cero.',
        'Haz el experimento de la trampa: mueve el filtro de fecha del ON al WHERE y compara la cantidad de filas.',
        'Escribe una consulta que encuentre dueños sin ninguna mascota usando LEFT JOIN con IS NULL, y la misma usando NOT EXISTS.',
        'Usa EXPLAIN delante de tu JOIN de cuatro tablas y simplemente observa el plan. En la semana 10 lo vas a entender.'
      ],
      vet: [
        'Reportes de VetCare a construir: agenda del día, historial clínico de una mascota, dueños sin visita reciente.',
        'Guarda todo en database/queries.sql con el nombre del reporte como comentario.'
      ],
      edge: [
        'Si un JOIN devuelve más filas de las esperadas, casi siempre uniste por una columna no única y multiplicaste resultados.',
        'Usa siempre alias cortos de tabla y prefija todas las columnas: evita ambigüedades y hace la consulta legible.',
        'CROSS JOIN sin querer ocurre si olvidas la condición ON: produce el producto cartesiano y puede colgar la sesión.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia práctica entre INNER y LEFT JOIN?', a: 'INNER devuelve solo las filas con coincidencia en ambas tablas. LEFT conserva todas las de la izquierda y rellena con NULL las columnas de la derecha cuando no hay coincidencia, que es lo que necesitas en reportes con ceros.' },
        { q: '¿Por qué un filtro en el WHERE anula un LEFT JOIN?', a: 'Porque las filas sin coincidencia tienen NULL en las columnas de la derecha y la condición del WHERE las descarta. El filtro sobre la tabla derecha debe ir en el ON para que se aplique antes de conservar las filas sin pareja.' },
        { q: '¿Cómo encuentras filas de A que no tienen correspondencia en B?', a: 'Con LEFT JOIN y luego WHERE b.id IS NULL, o con NOT EXISTS y una subconsulta correlacionada. NOT EXISTS suele ser más claro y no sufre el problema de NULL de NOT IN.' },
        { q: '¿Qué indica un JOIN que devuelve más filas de las esperadas?', a: 'Que la columna de unión no es única en una de las tablas, así que cada fila de un lado se empareja con varias del otro. Hay que revisar la cardinalidad o agregar antes de unir.' }
      ],
      out: 'Tres reportes con JOIN en database/queries.sql y el experimento de la trampa documentado.',
      file: 'database/queries.sql'
    },
    {
      t: 'Agregaciones y transacciones (examen de la semana)',
      obj: 'Resumir datos con GROUP BY y garantizar consistencia con transacciones.',
      why: 'Las agregaciones son el 80 por ciento de los reportes que te van a pedir, y las transacciones son lo que impide que un cobro se registre a medias. Juntos cierran tu base de SQL.',
      study: { r: 2, what: 'Lee el capítulo de transacciones del tutorial oficial completo. Unos 15 minutos. Busca una cosa: qué significa que una transacción sea atómica y qué pasa si la conexión se cae en medio.',
        pasos: [
          'Lee la sección entera (~8 min): el ejemplo de la transferencia bancaria entre Alice y Bob.',
          'Subraya la idea de todo o nada y la de que una transacción confirmada no se pierde aunque el servidor caiga.',
          'Lee la parte de SAVEPOINT (~3 min): volver a un punto intermedio sin cancelarlo todo.',
          'En psql abre BEGIN, inserta una cita, ejecuta ROLLBACK y comprueba que no quedó nada.',
          'Para GROUP BY repasa el ejemplo del día: hoy la fuente cubre solo las transacciones.'
        ] },
      ex: { title: 'GROUP BY, HAVING y BEGIN/COMMIT', body: `AGREGACIONES

SELECT  v.id            AS veterinario_id,
        v.nombre,
        COUNT(c.id)     AS total_citas,
        COUNT(*) FILTER (WHERE c.estado = 'cancelada') AS canceladas,
        ROUND(AVG(EXTRACT(EPOCH FROM (c.fin - c.inicio)) / 60), 1) AS min_promedio
  FROM  veterinario v
  LEFT JOIN cita c ON c.veterinario_id = v.id
                  AND c.inicio >= DATE '2026-01-01'  -- en el ON,
                                     -- no en el WHERE (día 5)
 GROUP BY v.id, v.nombre
HAVING  COUNT(c.id) > 5
 ORDER BY total_citas DESC;

WHERE filtra filas antes de agrupar.
HAVING filtra grupos después de agrupar.
Todo lo del SELECT que no sea agregado va en GROUP BY.

COUNT(*) cuenta filas, incluidas las de puro NULL.
COUNT(columna) ignora los NULL de esa columna.

TRANSACCIONES

BEGIN;

  INSERT INTO factura (dueno_id, total, fecha)
  SELECT id, 0, now() FROM dueno WHERE email = 'ana@example.com'
  RETURNING id AS factura_id \\gset

  INSERT INTO linea_factura (factura_id, concepto, monto) VALUES
    (:'factura_id', 'Consulta general', 35.00),
    (:'factura_id', 'Vacuna rabia',     18.50);

  UPDATE factura
     SET total = (SELECT SUM(monto) FROM linea_factura
                   WHERE factura_id = :'factura_id')
   WHERE id = :'factura_id';

COMMIT;

(\\gset es un comando de psql: guarda el id que devuelve
RETURNING en la variable factura_id, y :'factura_id' la usa.
Así no escribes ids a mano.)

Si algo falla entre BEGIN y COMMIT, haces ROLLBACK
y la base queda como si nada hubiera pasado.
Nunca existe una factura con líneas a medias.

ACID en una línea cada uno:
Atomicidad   todo o nada
Consistencia las constraints se respetan al terminar
Aislamiento  una transacción no ve lo a medias de otra
Durabilidad  lo confirmado sobrevive a un corte de luz` },
      steps: [
        'Escribe cuatro reportes agregados: citas por veterinario, ingresos por mes, especies más atendidas, promedio de duración de consulta.',
        'Usa al menos una vez COUNT(*) FILTER (WHERE ...) para contar un subconjunto sin otra consulta.',
        'Escribe la transacción completa de facturación y pruébala con COMMIT.',
        'Repítela provocando un error a propósito (un monto negativo que rompa tu CHECK) y comprueba con ROLLBACK que no quedó nada.',
        'Repaso final: explica en voz alta durante cinco minutos tu schema.sql, por qué elegiste cada tipo, qué protege cada constraint y cómo consultas la agenda del día.'
      ],
      vet: [
        'Deja listo database/reports.sql con los cuatro reportes comentados.',
        'Resume en database/README.md: cómo crear la base, correr schema, correr seed y correr los reportes.',
        'Pulsa «Marcar para repasar» y vuelve a leer database/schema.sql dentro de una semana.'
      ],
      edge: [
        'Una transacción abierta y olvidada bloquea filas y puede congelar la aplicación entera. Siempre cierra con COMMIT o ROLLBACK.',
        'AVG ignora los NULL, así que el promedio puede calcularse sobre menos filas de las que crees. Revisa con COUNT.',
        'En PostgreSQL, si una sentencia falla dentro de una transacción, el resto se aborta hasta que hagas ROLLBACK: verás "current transaction is aborted".'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre WHERE y HAVING?', a: 'WHERE filtra filas individuales antes de agrupar y HAVING filtra grupos ya formados. Por eso HAVING puede usar funciones de agregado como COUNT y WHERE no.' },
        { q: '¿Qué diferencia hay entre COUNT(*) y COUNT(columna)?', a: 'COUNT(*) cuenta todas las filas del grupo. COUNT(columna) cuenta solo aquellas donde esa columna no es NULL, así que con LEFT JOIN es la forma correcta de no contar las coincidencias vacías.' },
        { q: '¿Qué garantiza la atomicidad de una transacción?', a: 'Que el conjunto de operaciones se aplica completo o no se aplica nada. Si la conexión se cae antes del COMMIT, PostgreSQL revierte todo y la base nunca queda en un estado intermedio.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que la base de datos no es un almacén pasivo: los tipos definen qué es representable, las constraints definen qué es válido, las consultas definen qué puedes responder y las transacciones garantizan que nada quede a medias.' }
      ],
      out: 'database/reports.sql con cuatro reportes y la transacción de facturación probada con COMMIT y ROLLBACK.',
      file: 'database/reports.sql'
    }
  ]
}
]);
