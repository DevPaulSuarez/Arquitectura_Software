window.WEEKS = (window.WEEKS || []).concat([
{
  n: 10,
  phase: 'Bases de datos',
  title: 'Que la base siga rápida cuando crezca',
  idea: 'Con cien filas todo es rápido. El trabajo empieza con un millón. Esta semana dejas de adivinar: aprendes a leer el plan de ejecución, a poner índices con criterio, a versionar el esquema y a entender qué pasa cuando dos personas tocan la misma fila al mismo tiempo.',
  res: [
    { t: 'PostgreSQL — Using EXPLAIN',
      u: 'https://www.postgresql.org/docs/current/using-explain.html',
      note: 'El capítulo clave de la semana. Léelo despacio, es el que te enseña a diagnosticar en vez de adivinar.' },
    { t: 'PostgreSQL — Indexes',
      u: 'https://www.postgresql.org/docs/current/indexes.html',
      note: 'Tipos de índice, índices multicolumna, parciales y de expresión. Referencia para los días 1 y 4.' },
    { t: 'PostgreSQL — Transaction Isolation',
      u: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      note: 'Niveles de aislamiento y las anomalías que evita cada uno. Material del día 6.' },
    { t: 'PostgreSQL — Range Types', u: 'https://www.postgresql.org/docs/current/rangetypes.html', note: 'Rangos de fechas y la exclusión constraint para evitar solapes.' },
    { t: 'PostgreSQL — ALTER TABLE', u: 'https://www.postgresql.org/docs/current/sql-altertable.html', note: 'Qué cambios de esquema bloquean o reescriben la tabla.' }
  ],
  days: [
    {
      t: 'Índices: cómo funcionan y cuándo ponerlos',
      obj: 'Entender el árbol B y decidir índices por evidencia, no por costumbre.',
      why: 'Un índice bien puesto convierte una consulta de 3 segundos en 3 milisegundos. Uno mal puesto hace las escrituras más lentas sin acelerar nada. Saber la diferencia es valor directo.',
      study: { r: 1, what: 'Lee las secciones "Introduction", "Index Types" y "Multicolumn Indexes". Unos 18 minutos. Busca una cosa: por qué el orden de las columnas en un índice multicolumna importa.',
        pasos: [
          'Abre "11.1. Introduction" (~4 min): por qué sin índice la base tiene que leer toda la tabla.',
          'Abre "11.2. Index Types" y lee solo la parte de B-tree (~4 min): qué operadores puede acelerar.',
          'Abre "11.3. Multicolumn Indexes" (~5 min): por qué un índice (a, b) sirve para filtrar por a, pero casi nunca solo por b.',
          'Escribe las tres consultas más frecuentes de VetCare y, para cada una, el índice que la ayudaría con sus columnas en orden.'
        ] },
      ex: { title: 'Índices que sirven y que no', body: `(Para que se lea mejor, esta semana los ids aparecen como
números: veterinario_id = 3. En tu base son UUID; usa uno
real, por ejemplo el de SELECT id FROM veterinario LIMIT 1.)

Sin índice, buscar una cita por fecha recorre la tabla entera:
1.000.000 de filas leídas para devolver 12.

CREATE INDEX ix_cita_inicio ON cita (inicio);

Ahora Postgres baja por el árbol: ~20 comparaciones.

ÍNDICE MULTICOLUMNA: el orden manda

CREATE INDEX ix_cita_vet_inicio ON cita (veterinario_id, inicio);

Este índice SIRVE para:
  WHERE veterinario_id = 3
  WHERE veterinario_id = 3 AND inicio >= '2026-03-01'
  WHERE veterinario_id = 3 ORDER BY inicio

Este índice NO sirve para:
  WHERE inicio >= '2026-03-01'      -- falta la primera columna

Regla: la primera columna del índice debe aparecer
en el filtro. Es como un directorio ordenado por
apellido y luego nombre: buscar solo por nombre no ayuda.
(PostgreSQL 18 añadió "skip scan", que a veces aprovecha
el índice aunque falte la primera columna, si esta tiene
pocos valores distintos. No diseñes contando con ello.)

ÍNDICE PARCIAL: más pequeño y más rápido

CREATE INDEX ix_cita_pendientes
    ON cita (inicio)
 WHERE estado IN ('agendada','confirmada');

Si el 95 por ciento de las citas son históricas,
este índice ocupa el 5 por ciento del espacio.

ÍNDICE DE EXPRESIÓN

CREATE INDEX ix_dueno_email_lower ON dueno (lower(email));
-- sirve para:  WHERE lower(email) = 'ana@example.com'

QUÉ NO INDEXAR
- Columnas con pocos valores distintos (un boolean en una
  tabla pequeña): recorrer es más barato que el índice.
- Tablas con muchas escrituras y pocas lecturas.
- Columnas que nunca aparecen en WHERE, JOIN ni ORDER BY.

COSTO REAL: cada INSERT/UPDATE/DELETE debe actualizar
todos los índices de la tabla. Más índices, escrituras
más lentas y más espacio en disco.

CÓMO GENERAR VOLUMEN (para el paso 1 de hoy)

WITH m AS (SELECT array_agg(id) AS a FROM mascota),
     v AS (SELECT array_agg(id) AS a FROM veterinario)
INSERT INTO cita (mascota_id, veterinario_id, inicio, fin, estado)
SELECT m.a[1 + g % array_length(m.a, 1)],
       v.a[1 + g % array_length(v.a, 1)],
       TIMESTAMPTZ '2022-01-01 08:00+00' + g * INTERVAL '5 minutes',
       TIMESTAMPTZ '2022-01-01 08:00+00' + g * INTERVAL '5 minutes'
                                         + INTERVAL '5 minutes',
       'atendida'
  FROM generate_series(1, 500000) AS g, m, v;

Reparte las citas entre tus mascotas y veterinarios del seed,
cada una 5 minutos después de la anterior. Después ejecuta
ANALYZE cita; para que PostgreSQL actualice sus estadísticas.` },
      steps: [
        'Genera volumen: usa generate_series para insertar 500.000 citas de prueba en tu base.',
        'Mide una consulta por veterinario y fecha sin índice, con \\timing activado en psql.',
        'Crea el índice multicolumna y vuelve a medir. Anota los dos tiempos.',
        'Filtra solo por la segunda columna (inicio) y comprueba con EXPLAIN que el índice multicolumna apenas ayuda. Después crea un índice solo sobre inicio y mira cómo cambia el plan.',
        'Lista los índices de tu base con \\di y calcula su tamaño con pg_relation_size. Un índice que nadie usa es puro costo.'
      ],
      vet: [
        'Índices que VetCare necesita: cita(veterinario_id, inicio), visita(mascota_id, fecha), mascota(dueno_id), lower(dueno.email) único.',
        'Guarda todos los CREATE INDEX en database/indexes.sql con un comentario que diga qué consulta acelera cada uno.'
      ],
      edge: [
        'La clave primaria ya trae índice. No lo crees otra vez.',
        'Una foreign key NO crea índice automáticamente en PostgreSQL: si consultas por ella, créala tú.',
        'Un índice sobre una columna que usas con funciones (upper, date_trunc) no se usa salvo que el índice sea de expresión.'
      ],
      quiz: [
        { q: '¿Por qué importa el orden de columnas en un índice multicolumna?', a: 'Porque el índice está ordenado primero por la columna izquierda. Si tu filtro no incluye esa primera columna, PostgreSQL no puede saltar directamente y en general ignora el índice.' },
        { q: '¿Cuál es el costo de agregar un índice?', a: 'Cada escritura debe actualizar también el índice, así que INSERT, UPDATE y DELETE se vuelven más lentos, y el índice ocupa espacio en disco y memoria cache.' },
        { q: '¿Cuándo conviene un índice parcial?', a: 'Cuando casi todas tus consultas filtran por una condición que descarta la mayor parte de la tabla, por ejemplo solo las citas pendientes. El índice resultante es mucho más pequeño y cabe mejor en memoria.' },
        { q: '¿Una foreign key crea un índice automáticamente?', a: 'En PostgreSQL no. Crea el índice en la tabla referenciada por ser clave primaria, pero la columna que referencia queda sin índice y hay que crearlo si se consulta o si se borran padres con frecuencia.' }
      ],
      out: 'database/indexes.sql con los índices justificados y las mediciones antes/después anotadas.',
      file: 'database/indexes.sql'
    },
    {
      t: 'EXPLAIN ANALYZE: dejar de adivinar',
      obj: 'Leer un plan de ejecución e identificar el cuello de botella real.',
      why: 'Cualquiera puede decir "está lento". Lo que te contratan por saber es señalar exactamente qué nodo del plan cuesta y por qué. Es una habilidad medible y escasa.',
      study: { r: 0, what: 'Lee "EXPLAIN Basics" y "EXPLAIN ANALYZE" completos. Unos 20 minutos. Busca una cosa: la diferencia entre rows estimado y rows real, y por qué esa diferencia importa.',
        pasos: [
          'Lee "EXPLAIN Basics" (~8 min): qué significan cost, rows y width, y cómo se lee el árbol de abajo hacia arriba.',
          'Lee "EXPLAIN ANALYZE" (~8 min): la diferencia entre lo estimado y lo real, y el campo loops.',
          'Lee "Caveats" (~3 min): por qué un plan con pocos datos no se parece al de producción.',
          'Ejecuta EXPLAIN ANALYZE sobre tu consulta de agenda del día y marca el nodo que más tiempo consume.'
        ] },
      ex: { title: 'Leer un plan de ejecución', body: `EXPLAIN (ANALYZE, BUFFERS)
SELECT c.inicio, m.nombre
  FROM cita c
  JOIN mascota m ON m.id = c.mascota_id
 WHERE c.veterinario_id = 3
   AND c.inicio >= DATE '2026-03-01';

Salida típica:

Nested Loop  (cost=0.85..412.33 rows=120 width=28)
             (actual time=0.041..1.812 rows=118 loops=1)
  ->  Index Scan using ix_cita_vet_inicio on cita c
        (cost=0.42..85.11 rows=120 width=16)
        (actual time=0.028..0.214 rows=118 loops=1)
        Index Cond: (veterinario_id = 3 AND inicio >= '2026-03-01')
  ->  Index Scan using mascota_pkey on mascota m
        (cost=0.43..2.72 rows=1 width=20)
        (actual time=0.011..0.012 rows=1 loops=118)
        Index Cond: (id = c.mascota_id)
Planning Time: 0.231 ms
Execution Time: 1.998 ms

CÓMO SE LEE

Se lee de adentro hacia afuera y de abajo hacia arriba.
cost   = estimación del planificador (unidades arbitrarias)
actual = tiempo y filas REALES
loops  = cuántas veces se ejecutó ese nodo
         (tiempo total de ese nodo = actual time x loops)

SEÑALES DE ALARMA

Seq Scan sobre tabla grande con WHERE selectivo
  -> falta un índice, o el índice no se puede usar

rows=10 (estimado) vs rows=50000 (real)
  -> estadísticas desactualizadas: corre ANALYZE tabla;
     el planificador está eligiendo mal por mala información

loops=50000 en un Nested Loop
  -> el lado interno se ejecuta 50.000 veces. Si no usa
     índice, falta uno; si la estimación era mala, el
     planificador debió elegir Hash Join (mira ANALYZE)

Rows Removed by Filter: 980000
  -> leyó un millón de filas para quedarse con 20.000

Buffers: shared read=45000
  -> leyó 45.000 bloques que no estaban en la caché de
     PostgreSQL (puede que del disco): mucho trabajo

TIPOS DE NODO FRECUENTES
Seq Scan      lee toda la tabla
Index Scan    baja por el índice y va a la tabla
Index Only Scan  resuelve todo con el índice (lo mejor)
Bitmap Heap Scan  muchas coincidencias dispersas
Nested Loop   bueno si el lado externo tiene pocas filas
Hash Join     bueno para unir dos conjuntos grandes
Sort          ordena en memoria o en disco (disk = malo)` },
      steps: [
        'Corre EXPLAIN (ANALYZE, BUFFERS) sobre las cinco consultas de database/queries.sql.',
        'Para cada una anota: tipo de nodo principal, rows estimado vs real, y Execution Time.',
        'Encuentra al menos una con Seq Scan sobre tabla grande y arréglala con un índice. Vuelve a medir.',
        'Provoca una mala estimación: inserta 200.000 filas sin correr ANALYZE y mira cómo el plan se equivoca. Luego corre ANALYZE y compara.',
        'Pega los planes antes y después en database/performance-notes.md con tu explicación de qué cambió.'
      ],
      vet: [
        'La agenda del día es la consulta más usada de VetCare: debe quedar por debajo de 10 ms con medio millón de citas.',
        'Documenta en database/performance-notes.md el objetivo de latencia de cada consulta crítica.'
      ],
      edge: [
        'EXPLAIN solo estima; EXPLAIN ANALYZE ejecuta de verdad. Nunca corras EXPLAIN ANALYZE de un DELETE en producción fuera de BEGIN ... ROLLBACK: ANALYZE lo ejecuta de verdad.',
        'Con tablas pequeñas PostgreSQL elige Seq Scan a propósito y hace bien: leer 500 filas secuencial es más rápido que saltar por un índice.',
        'El cost no son milisegundos ni es comparable entre máquinas. Compara planes del mismo servidor y guíate por actual time.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre EXPLAIN y EXPLAIN ANALYZE?', a: 'EXPLAIN solo muestra el plan estimado sin ejecutar la consulta. EXPLAIN ANALYZE la ejecuta de verdad y agrega tiempos y filas reales, que es lo único que permite comparar estimación con realidad.' },
        { q: '¿Qué significa una gran diferencia entre rows estimado y rows real?', a: 'Que el planificador tiene estadísticas desactualizadas o sesgadas, y por tanto está eligiendo una estrategia equivocada. La solución suele ser correr ANALYZE sobre la tabla.' },
        { q: '¿Un Seq Scan siempre es malo?', a: 'No. Si la tabla es pequeña o la consulta devuelve gran parte de las filas, leer secuencialmente es más rápido que saltar por un índice. Es malo cuando la tabla es grande y el filtro es muy selectivo.' },
        { q: '¿Por qué hay que multiplicar actual time por loops?', a: 'Porque el tiempo que muestra un nodo interno es el de una sola ejecución. Si loops es 50.000, ese nodo aparentemente barato puede ser el que consume casi todo el tiempo total.' }
      ],
      out: 'database/performance-notes.md con planes antes/después y una consulta optimizada de forma medible.',
      file: 'database/performance-notes.md'
    },
    {
      t: 'Patrones lentos y cómo arreglarlos',
      obj: 'Reconocer los cuatro problemas de rendimiento más comunes y corregirlos.',
      why: 'Casi todas las consultas lentas del mundo real caen en unos pocos patrones. Conocerlos de memoria te permite diagnosticar en minutos lo que a otros les toma un día.',
      study: { r: 1, what: 'Busca en la doc "Partial Indexes" y "Index-Only Scans". Unos 15 minutos. Busca una cosa: qué condición debe cumplirse para que ocurra un Index Only Scan.',
        pasos: [
          'Abre "11.8. Partial Indexes" (~5 min): indexar solo las filas que importan, por ejemplo solo las citas no canceladas.',
          'Abre "11.9. Index-Only Scans and Covering Indexes" (~6 min): la consulta se responde solo con el índice si todas las columnas están en él.',
          'Fíjate en la condición del visibility map en esa misma página: por qué el VACUUM influye.',
          'Escribe un índice parcial y uno de cobertura para VetCare y compara el plan antes y después con EXPLAIN ANALYZE.'
        ] },
      ex: { title: 'Cuatro patrones lentos', body: `1. SELECT * cuando solo necesitas dos columnas

Lento:
SELECT * FROM cita WHERE veterinario_id = 3;

Mejor: pedir solo lo necesario permite Index Only Scan
SELECT inicio, estado FROM cita WHERE veterinario_id = 3;

CREATE INDEX ix_cita_vet_cubriente
    ON cita (veterinario_id, inicio) INCLUDE (estado);

Ahora el índice contiene todo lo pedido y no toca la tabla.

2. FUNCIÓN SOBRE LA COLUMNA FILTRADA

Lento (ignora el índice sobre inicio):
WHERE date_trunc('day', inicio) = DATE '2026-03-10'

Rápido (rango, el índice sí se usa):
WHERE inicio >= DATE '2026-03-10'
  AND inicio <  DATE '2026-03-11'

3. CONSULTA N+1 (el clásico de los ORM)

Lento: 1 consulta + 1 por cada mascota
SELECT id FROM mascota WHERE dueno_id = 5;
  luego por cada una:
SELECT * FROM visita WHERE mascota_id = ?;

Rápido: una sola consulta
SELECT m.id, m.nombre, v.fecha, v.motivo
  FROM mascota m
  LEFT JOIN visita v ON v.mascota_id = m.id
 WHERE m.dueno_id = 5;

4. PAGINACIÓN CON OFFSET GRANDE

Lento: para llegar a la página 5000 lee y descarta 100.000 filas
SELECT * FROM cita ORDER BY inicio LIMIT 20 OFFSET 100000;

Rápido: paginación por cursor (keyset)
SELECT * FROM cita
 WHERE inicio > '2026-03-10 14:30:00+00'
 ORDER BY inicio
 LIMIT 20;

Guardas el último valor visto y sigues desde ahí.
Tiempo constante sin importar la página.
(Si dos citas pueden tener el mismo inicio, desempata con
el id: WHERE (inicio, id) > ($ultimo_inicio, $ultimo_id)
       ORDER BY inicio, id)` },
      steps: [
        'Reproduce el patrón N+1 en el Playground: consulta mascotas y luego las visitas una por una. Cuenta las consultas.',
        'Reescríbelo como un solo JOIN y compara el tiempo total.',
        'Implementa paginación por cursor sobre la tabla de citas y compárala con OFFSET 100000.',
        'Crea un índice cubriente con INCLUDE y confirma en EXPLAIN que aparece Index Only Scan.',
        'Reescribe un filtro con date_trunc como un filtro de rango y verifica que el plan cambia de Seq Scan a Index Scan.'
      ],
      vet: [
        'El historial clínico de una mascota es el caso N+1 más probable de VetCare: resuélvelo con un solo JOIN.',
        'La lista de citas paginada del front usará keyset, no OFFSET. Anótalo en database/performance-notes.md.'
      ],
      edge: [
        'Index Only Scan necesita que la tabla esté razonablemente vacuumeada; si no, Postgres igual visita la tabla para comprobar visibilidad.',
        'La paginación por cursor requiere un orden estable y único. Si inicio puede repetirse, desempata con el id.',
        'No optimices una consulta que corre una vez al mes. Mide primero cuáles son las frecuentes.'
      ],
      quiz: [
        { q: '¿Qué es el problema N+1 y por qué duele tanto?', a: 'Es hacer una consulta para obtener N elementos y luego una consulta por cada uno. Cada ida y vuelta a la base tiene latencia de red, así que 200 consultas pequeñas son mucho más lentas que una sola con JOIN.' },
        { q: '¿Por qué aplicar una función a la columna anula el índice?', a: 'Porque el índice guarda el valor original ordenado, no el resultado de la función. PostgreSQL tendría que calcular la función en cada fila, así que recorre la tabla entera salvo que crees un índice de expresión.' },
        { q: '¿Por qué OFFSET grande es lento?', a: 'Porque la base debe generar y descartar todas las filas anteriores al offset antes de devolver las que pides. El costo crece linealmente con el número de página.' },
        { q: '¿Qué condición permite un Index Only Scan?', a: 'Que todas las columnas que la consulta necesita estén en el índice, ya sea como columnas clave o con INCLUDE. Así PostgreSQL responde sin leer la tabla.' }
      ],
      out: 'N+1 corregido, paginación por cursor implementada y un Index Only Scan confirmado en EXPLAIN.',
      file: 'database/performance-notes.md'
    },
    {
      t: 'Constraints avanzadas y la regla de solapamiento',
      obj: 'Resolver con la base la regla que un CHECK no puede expresar.',
      why: 'La regla "no dos citas solapadas para el mismo veterinario" es exactamente el tipo de problema que separa a quien sabe SQL de quien solo lo usa. Y en VetCare es una regla real.',
      study: { r: 3, what: 'Lee la introducción de Range Types y la sección "Constraints on Ranges". Unos 15 minutos. Busca una cosa: qué operador usa una exclusión constraint para comparar rangos y por qué hace falta la extensión btree_gist.',
        pasos: [
          'Lee la introducción y "8.17.1. Built-in Range and Multirange Types" (~3 min): tstzrange es el que usarás para las citas.',
          'Lee "8.17.3. Inclusive and Exclusive Bounds" (~3 min): por qué [inicio, fin) evita que dos citas seguidas choquen.',
          'Lee "8.17.9. Indexing" (~2 min): los rangos se indexan con GiST.',
          'Lee "8.17.10. Constraints on Ranges" (~5 min): el ejemplo de reservas de salas con EXCLUDE USING GIST y el operador &&.',
          'Adapta el ejemplo a tu tabla de citas: mismo veterinario y rangos que se solapan deben ser imposibles.'
        ] },
      ex: { title: 'EXCLUDE para rangos sin solape', body: `El problema que UNIQUE no resuelve:

Cita A: 10:00 - 10:30 veterinario 3
Cita B: 10:15 - 10:45 veterinario 3

Horas de inicio distintas, así que UNIQUE las acepta,
pero se solapan y es imposible atenderlas.

SOLUCIÓN: exclusion constraint con rangos

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE cita
  ADD CONSTRAINT ex_cita_sin_solape
  EXCLUDE USING gist (
      veterinario_id WITH =,
      tstzrange(inicio, fin) WITH &&
  )
  WHERE (estado <> 'cancelada');

Se lee así: prohíbe dos filas donde
el veterinario sea el MISMO (=)
y los rangos de tiempo se SOLAPEN (&&),
salvo que la cita esté cancelada.

btree_gist hace falta porque mezclamos
una igualdad normal con un operador de rango.

Probarlo:

INSERT INTO cita (veterinario_id, mascota_id, inicio, fin, estado)
SELECT v.id, m.id, '2026-03-10 10:00+00', '2026-03-10 10:30+00', 'agendada'
  FROM veterinario v, mascota m
 WHERE v.nombre = 'Ana' AND m.nombre = 'Rocky';
-- OK

INSERT INTO cita (veterinario_id, mascota_id, inicio, fin, estado)
SELECT v.id, m.id, '2026-03-10 10:15+00', '2026-03-10 10:45+00', 'agendada'
  FROM veterinario v, mascota m
 WHERE v.nombre = 'Ana' AND m.nombre = 'Michi';
-- ERROR: conflicting key value violates exclusion
--        constraint "ex_cita_sin_solape"

OTRAS CONSTRAINTS ÚTILES

Único sin importar mayúsculas:
CREATE UNIQUE INDEX uq_dueno_email ON dueno (lower(email));

Único solo entre las activas:
CREATE UNIQUE INDEX uq_vet_licencia_activa
    ON veterinario (licencia) WHERE activo;

Diferido hasta el COMMIT:
ALTER TABLE linea_factura
  ADD CONSTRAINT fk_lf_factura
  FOREIGN KEY (factura_id) REFERENCES factura(id)
  DEFERRABLE INITIALLY DEFERRED;` },
      steps: [
        'Habilita la extensión btree_gist y agrega la exclusión constraint a la tabla cita.',
        'Agrega tres INSERT a database/invalid-inserts.sql que intenten solapar citas, incluyendo solape parcial y contención total.',
        'Comprueba que una cita cancelada sí puede solaparse, gracias a la cláusula WHERE de la constraint.',
        'Crea el índice único sobre lower(email) y prueba insertar el mismo correo con mayúsculas distintas.',
        'Documenta en database/README.md qué reglas de negocio están garantizadas por la base y cuáles quedan en el código.'
      ],
      vet: [
        'Esta constraint cierra la regla que anotaste como pendiente en la semana 9.',
        'Anota también la decisión: el código valida antes para dar buen mensaje, la base valida siempre para garantizar la verdad.'
      ],
      edge: [
        'EXCLUDE usa un índice GiST, que es más lento de escribir que un B-tree. En tablas con escritura muy alta hay que medirlo.',
        'Decide la convención de límites: tstzrange por defecto incluye el inicio y excluye el fin, así que 10:00-10:30 y 10:30-11:00 no se solapan. Eso es lo que quieres.',
        'La aplicación debe capturar el error 23P01 de PostgreSQL y traducirlo a un mensaje legible, no mostrar el error crudo.'
      ],
      quiz: [
        { q: '¿Por qué UNIQUE no puede evitar citas solapadas?', a: 'Porque UNIQUE compara valores por igualdad exacta y el solape es una relación entre rangos. Dos citas con horas de inicio distintas son únicas aunque se pisen en el tiempo.' },
        { q: '¿Qué significa el operador && en una exclusión constraint?', a: 'Es el operador de solape entre rangos: devuelve verdadero si los dos rangos comparten al menos un instante. La constraint prohíbe que coexistan dos filas donde eso ocurra.' },
        { q: '¿Para qué sirve la cláusula WHERE en la exclusión constraint?', a: 'La convierte en parcial, de modo que solo se aplica a las filas que cumplen la condición. Aquí permite que las citas canceladas no bloqueen el horario.' },
        { q: 'Si la base ya garantiza la regla, ¿por qué validarla también en el código?', a: 'Para dar un mensaje de error útil al usuario antes de intentar guardar. La base es la garantía final, pero un error de constraint crudo es mala experiencia de usuario.' }
      ],
      out: 'Exclusión constraint activa, intentos de solape fallando y reglas documentadas en database/README.md.',
      file: 'database/schema.sql'
    },
    {
      t: 'Migraciones: versionar el esquema',
      obj: 'Cambiar el esquema de forma reproducible y segura en una base con datos.',
      why: 'En un equipo nadie edita la base a mano. Las migraciones son la forma en que un equipo real evoluciona el esquema, y saber hacer una migración sin downtime es una habilidad muy valorada.',
      study: { r: 4, what: 'Lee la sección Notes de ALTER TABLE: qué operaciones reescriben la tabla y qué bloqueo toma cada una. Unos 15 minutos. Busca una cosa: por qué agregar una columna con DEFAULT ya no bloquea en PostgreSQL moderno.',
        pasos: [
          'Lee "Description" por encima (~3 min) para ver todo lo que permite ALTER TABLE.',
          'Lee la sección "Notes" (~6 min): qué operaciones reescriben la tabla entera y cuáles solo tocan el catálogo.',
          'Busca la frase sobre añadir una columna con un DEFAULT no volátil: desde PostgreSQL 11 ya no reescribe la tabla.',
          'Mira "Examples" (~3 min) y copia los de añadir columna y añadir constraint.',
          'Escribe tu primera migración como archivo numerado (por ejemplo 002_agregar_constraints.sql) en vez de ejecutarla a mano.'
        ] },
      ex: { title: 'Migraciones ordenadas y seguras', body: `ESTRUCTURA DE ARCHIVOS

database/migrations/
  001_crear_tablas_base.sql
  002_agregar_constraints.sql
  003_indices_rendimiento.sql
  004_exclusion_solape.sql
  005_agregar_columna_notas.sql

Reglas:
- Numeradas, nunca se editan una vez aplicadas.
- Cada una debe poder correrse una sola vez.
- Un error se arregla con una migración NUEVA.

TABLA DE CONTROL

CREATE TABLE IF NOT EXISTS schema_migration (
    version    TEXT PRIMARY KEY,
    aplicada   TIMESTAMPTZ NOT NULL DEFAULT now()
);

MIGRACIÓN SEGURA (no bloqueante)

-- 005_agregar_columna_notas.sql
BEGIN;
  ALTER TABLE mascota ADD COLUMN notas TEXT;
  INSERT INTO schema_migration (version) VALUES ('005');
COMMIT;

OPERACIONES PELIGROSAS Y SU ALTERNATIVA

Peligroso: agregar columna NOT NULL sin default
  -> falla si hay filas
  Alternativa en tres pasos:
    1) ALTER TABLE t ADD COLUMN c TEXT;
    2) UPDATE t SET c = '...' WHERE c IS NULL;  (por lotes)
    3) ALTER TABLE t ALTER COLUMN c SET NOT NULL;

Peligroso: CREATE INDEX en tabla grande
  -> bloquea escrituras durante minutos
  Alternativa:
    CREATE INDEX CONCURRENTLY ix_... ON t (col);
    (no puede ir dentro de una transacción)

Peligroso: renombrar o borrar una columna en uso
  -> rompe la app desplegada
  Alternativa expand/contract:
    1) agregar la columna nueva
    2) escribir en ambas durante un release
    3) migrar los datos
    4) dejar de leer la vieja
    5) borrarla en un release posterior

APLICAR SOLO LAS PENDIENTES (bash + psql)

psql -d vetcare -v ON_ERROR_STOP=1 -c "CREATE TABLE IF NOT EXISTS
  schema_migration (version TEXT PRIMARY KEY,
  aplicada TIMESTAMPTZ NOT NULL DEFAULT now());"

for f in database/migrations/*.sql; do
  v=$(basename "$f" | cut -d_ -f1)        # "005"
  ya=$(psql -d vetcare -tAc \\
    "SELECT 1 FROM schema_migration WHERE version = '$v'")
  if [ "$ya" != "1" ]; then
    echo "Aplicando $f"
    psql -d vetcare -v ON_ERROR_STOP=1 -f "$f" || exit 1
  fi
done` },
      steps: [
        'Reorganiza todo tu SQL en database/migrations/ numerado, desde la creación de tablas hasta la exclusión constraint.',
        'Crea la tabla schema_migration y haz que cada archivo registre su versión.',
        'Escribe un script bash o un comando psql que aplique en orden solo las migraciones no registradas.',
        'Prueba el proceso completo: borra la base, recréala y aplica todo desde cero. Debe quedar idéntica.',
        'Escribe una migración que agregue una columna NOT NULL a una tabla con datos, usando los tres pasos seguros.'
      ],
      vet: [
        'A partir de ahora toda la fase de base de datos de VetCare cambia solo por migraciones.',
        'Anota en database/README.md el comando exacto para aplicar migraciones desde cero.'
      ],
      edge: [
        'Nunca edites una migración ya aplicada en otro entorno: las bases quedarán distintas y el bug será imposible de rastrear.',
        'CREATE INDEX CONCURRENTLY no puede ejecutarse dentro de BEGIN/COMMIT y puede quedar en estado inválido si falla; hay que revisarlo.',
        'Un UPDATE masivo en una sola transacción bloquea filas y crece el WAL. Hazlo por lotes de unos miles de filas.'
      ],
      quiz: [
        { q: '¿Por qué no se edita una migración ya aplicada?', a: 'Porque los entornos donde ya corrió no volverán a ejecutarla, así que quedarían con un esquema distinto al de los entornos nuevos. Las correcciones se hacen siempre con una migración adicional.' },
        { q: '¿Cómo agregas una columna NOT NULL a una tabla con millones de filas?', a: 'En tres pasos: primero la agregas nullable, luego rellenas los valores por lotes, y recién entonces aplicas SET NOT NULL. Así evitas un bloqueo largo y un fallo inmediato por filas existentes.' },
        { q: '¿Qué hace CREATE INDEX CONCURRENTLY y qué limitación tiene?', a: 'Construye el índice sin bloquear las escrituras de la tabla, a cambio de ser más lento y hacer dos pasadas. No puede ejecutarse dentro de una transacción y si falla deja un índice inválido que hay que eliminar.' },
        { q: '¿En qué consiste el patrón expand/contract?', a: 'En agregar lo nuevo sin quitar lo viejo, hacer que la aplicación escriba en ambos durante un periodo, migrar los datos y recién después eliminar lo antiguo. Permite desplegar cambios de esquema sin tumbar la versión anterior de la app.' }
      ],
      out: 'database/migrations/ numerado, tabla schema_migration y recreación completa desde cero verificada.',
      file: 'database/migrations/'
    },
    {
      t: 'Concurrencia y aislamiento (examen de la semana)',
      obj: 'Entender qué pasa cuando dos transacciones chocan y elegir la defensa correcta.',
      why: 'El bug de "dos personas agendaron la misma hora" es concurrencia, no lógica. Saber explicar lost update y cómo evitarlo es una respuesta de entrevista de nivel senior.',
      study: { r: 2, what: 'Lee "Read Committed" y "Repeatable Read" del capítulo de aislamiento. Unos 20 minutos. Busca una cosa: qué anomalía permite Read Committed que Repeatable Read no.',
        pasos: [
          'Lee la introducción y la tabla de fenómenos por nivel de aislamiento (~4 min).',
          'Lee "13.2.1. Read Committed Isolation Level" (~6 min): cada sentencia ve los datos confirmados en su momento.',
          'Lee "13.2.2. Repeatable Read Isolation Level" (~5 min): toda la transacción ve la misma foto, y puede fallar con un error de serialización.',
          'Lee "13.2.3. Serializable Isolation Level" por encima (~3 min).',
          'Abre dos sesiones de psql y reproduce una lectura no repetible en Read Committed; después repite con Repeatable Read.'
        ] },
      ex: { title: 'Lost update y cómo evitarlo', body: `EL PROBLEMA (dos recepcionistas a la vez)

Sesión A                        Sesión B
--------                        --------
BEGIN;                          BEGIN;
SELECT cupos FROM agenda
 WHERE id=1;  -- 1
                                SELECT cupos FROM agenda
                                 WHERE id=1;  -- 1
UPDATE agenda SET cupos=0
 WHERE id=1;
COMMIT;
                                UPDATE agenda SET cupos=0
                                 WHERE id=1;
                                COMMIT;

Se agendaron dos citas con un solo cupo.
A esto se le llama lost update.

DEFENSA 1: bloqueo pesimista (SELECT FOR UPDATE)

BEGIN;
  SELECT cupos FROM agenda WHERE id=1 FOR UPDATE;
  -- la sesión B queda esperando aquí
  UPDATE agenda SET cupos = cupos - 1 WHERE id=1;
COMMIT;

Simple y correcto. Costo: la otra sesión espera.
Bueno cuando el conflicto es frecuente y la sección corta.

Si todo cabe en UNA sentencia, aún más simple:
UPDATE agenda SET cupos = cupos - 1
 WHERE id = 1 AND cupos > 0;
-- 0 filas afectadas = ya no quedaba cupo

DEFENSA 2: bloqueo optimista (columna de versión)

UPDATE agenda
   SET cupos = cupos - 1,
       version = version + 1
 WHERE id = 1
   AND version = 7;     -- la versión que leí

Si afecta 0 filas, alguien cambió la fila antes:
recargas y reintentas. Sin esperas, pero hay que
manejar el reintento. Es lo que hace EF Core con
una columna de concurrencia.

DEFENSA 3: dejar que lo resuelva la base

INSERT INTO cita (...) VALUES (...);
-- la exclusión constraint del día 4 rechaza el solape
-- atómicamente, sin importar la concurrencia

Para VetCare esta es la mejor: la regla vive en la base
y ninguna carrera entre sesiones puede saltársela.

NIVELES DE AISLAMIENTO EN POSTGRESQL

Read Committed (por defecto)
  cada sentencia ve lo confirmado al momento de empezar.
  Permite non-repeatable read y lost update.

Repeatable Read
  toda la transacción ve una foto fija del inicio.
  Si hay conflicto, Postgres aborta con error 40001
  y TÚ debes reintentar.

Serializable
  como si las transacciones corrieran una tras otra.
  Máxima garantía, más abortos que reintentar.` },
      steps: [
        'Abre dos sesiones de psql y reproduce el lost update paso a paso. Confirma que el bug es real.',
        'Repítelo usando SELECT FOR UPDATE en ambas y observa cómo la segunda espera.',
        'Implementa la versión optimista con columna versión y provoca el conflicto para ver el 0 filas afectadas.',
        'Prueba las dos sesiones insertando citas solapadas simultáneamente y comprueba que la exclusión constraint gana siempre.',
        'Repaso final: explica en voz alta en cinco minutos índices, EXPLAIN, migraciones y concurrencia usando ejemplos de VetCare.'
      ],
      vet: [
        'Anota en database/README.md la decisión final de VetCare: la regla de solape se defiende con exclusión constraint, no con bloqueos.',
        'Deja database/performance-notes.md con los objetivos de latencia y las mediciones de la semana.',
        'Pulsa «Marcar para repasar» y vuelve a leer database/performance-notes.md dentro de una semana.'
      ],
      edge: [
        'En Repeatable Read y Serializable tu código debe reintentar ante el error 40001. Si no lo haces, el usuario ve un fallo aleatorio.',
        'Un SELECT FOR UPDATE dentro de una transacción larga bloquea a todos los demás: mantén la transacción lo más corta posible.',
        'Dos transacciones que bloquean las mismas filas en orden distinto producen un deadlock. PostgreSQL mata una; siempre bloquea en el mismo orden para evitarlo.'
      ],
      quiz: [
        { q: '¿Qué es un lost update?', a: 'Cuando dos transacciones leen el mismo valor, lo modifican a partir de esa lectura y la segunda escritura sobrescribe la primera. El cambio de la primera desaparece como si nunca hubiera ocurrido.' },
        { q: '¿Cuándo prefieres bloqueo optimista sobre pesimista?', a: 'Cuando los conflictos son raros y no quieres que las sesiones se esperen. El optimista no bloquea a nadie pero obliga a detectar el conflicto y reintentar; el pesimista es más simple pero serializa el acceso.' },
        { q: '¿Qué debes hacer si usas Repeatable Read?', a: 'Implementar reintentos, porque PostgreSQL puede abortar la transacción con el error 40001 cuando detecta un conflicto de serialización. Sin reintento, el usuario recibe un error intermitente sin causa aparente.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que el rendimiento y la corrección bajo carga no se adivinan: se miden con EXPLAIN ANALYZE, se corrigen con índices y consultas bien escritas, se evolucionan con migraciones versionadas y se protegen con constraints que ninguna carrera entre usuarios puede saltarse.' }
      ],
      out: 'Lost update reproducido y resuelto de tres formas, con la decisión documentada en database/README.md.',
      file: 'database/README.md'
    }
  ]
}
]);
