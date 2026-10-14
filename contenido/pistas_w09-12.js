/* Una pista por cada paso de «Hazlo tú»: cómo empezar, un ejemplo y cómo saber que está bien.
   Clave: w<semana>d<día>; el orden coincide con days[].steps. */
window.PISTAS = Object.assign(window.PISTAS || {}, {

/* ---------- Semana 9 ---------- */

'w9d1': [
  'Si usas Docker, primero comprueba que Docker Desktop está abierto («docker ps» no debe dar error). Tras el docker run, «docker ps» debe mostrar vetcare-db con estado Up. Si el puerto 5432 está ocupado (ya tenías un PostgreSQL instalado), usa «-p 5433:5432» y conéctate al 5433.',
  'Con Docker: «docker exec -it vetcare-db psql -U postgres» y dentro «CREATE DATABASE vetcare;» y «\\c vetcare». Con herramienta gráfica (DBeaver, pgAdmin): host localhost, puerto 5432, usuario postgres, contraseña dev. Comprueba con «\\l»: vetcare debe aparecer en la lista.',
  'Crea primero las tablas sin FK (dueno, veterinario, vacuna) y luego las que dependen de ellas (mascota, cita, visita, factura, linea_factura). Plantilla: «CREATE TABLE mascota ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), dueno_id uuid NOT NULL REFERENCES dueno(id), nombre text NOT NULL, … );».',
  'Ejemplos: «peso_kg numeric(5,2) -- decimal exacto, hasta 999,99 kg», «inicio timestamptz -- guarda instante con zona horaria», «nombre text -- en PostgreSQL text y varchar rinden igual», «precio numeric(10,2) -- dinero: nunca float, que pierde céntimos». Si el comentario dice «porque sí», investiga ese tipo.',
  'Al principio del archivo: «DROP TABLE IF EXISTS linea_factura, factura, visita, cita, mascota, vacuna, veterinario, dueno CASCADE;». Ejecuta: «psql -U postgres -d vetcare -f database/schema.sql» (con Docker, copia antes el archivo o usa «docker exec -i vetcare-db psql -U postgres -d vetcare < database/schema.sql»). Dos ejecuciones seguidas sin errores = reproducible.'
],

'w9d2': [
  'NOT NULL en todo lo que tu tabla de atributos marcaba como obligatorio. PRIMARY KEY en cada id. FOREIGN KEY en cada columna _id. Si ya pusiste REFERENCES ayer, ahora dale nombre: «CONSTRAINT fk_mascota_dueno FOREIGN KEY (dueno_id) REFERENCES dueno(id)».',
  'Ejemplos: «CONSTRAINT ck_mascota_peso_positivo CHECK (peso_kg > 0)», «CONSTRAINT ck_dueno_email_arroba CHECK (email LIKE \'%@%\')», «CONSTRAINT ck_cita_fin_mayor CHECK (fin > inicio)», «CONSTRAINT ck_cita_estado CHECK (estado IN (\'pendiente\',\'atendida\',\'cancelada\'))».',
  'Formato: prefijo_tabla_qué. pk_mascota, fk_mascota_dueno, uq_dueno_email, ck_cita_fin_mayor. Cuando falle un INSERT, PostgreSQL dirá «violates check constraint "ck_cita_fin_mayor"» y sabrás al momento qué regla se rompió.',
  'Un INSERT por constraint, cambiando solo el dato que la rompe: peso -1, email sin @, fin antes que inicio, estado «borrada», dueno_id inventado, nombre NULL, id duplicado… Pon un comentario encima de cada uno: «-- debe fallar por ck_mascota_peso_positivo».',
  'Ejecuta el archivo entero con psql: cada INSERT fallará por separado. Copia el mensaje: «-- ERROR: new row for relation "mascota" violates check constraint "ck_mascota_peso_positivo"». Si alguno NO falla, falta esa constraint: añádela al schema y repite.'
],

'w9d3': [
  'Hazlo realista y variado: un dueño con 3 mascotas, otro sin ninguna, mascotas de distintas especies, citas pasadas, futuras y canceladas, una mascota sin chip, un veterinario sin citas. Esos casos límite son los que harán interesantes las consultas de mañana.',
  'Patrón: «WITH d AS ( INSERT INTO dueno (nombre, email) VALUES (\'Ana\', \'ana@mail.com\') RETURNING id ) INSERT INTO mascota (dueno_id, nombre, especie, peso_kg) SELECT id, \'Max\', \'perro\', 12.5 FROM d;». Así no copias ids a mano y el script funciona aunque los ids cambien.',
  '«BEGIN; UPDATE mascota SET peso_kg = peso_kg * 1.1 WHERE especie = \'gato\';» psql responde «UPDATE 3»: comprueba que ese número es el que esperabas. Mira el resultado con un SELECT y luego «ROLLBACK;». Otro SELECT confirma que todo volvió a como estaba. Esta es la rutina para tocar datos de producción.',
  '«DELETE FROM dueno WHERE nombre = \'Ana\';» debe fallar con «violates foreign key constraint "fk_mascota_dueno"». Si el borrado funciona y desaparecen sus mascotas, tu FK tiene ON DELETE CASCADE: cámbialo a RESTRICT si tu regla de negocio dice que no se puede borrar un dueño con mascotas.',
  'Necesitas una constraint UNIQUE sobre la combinación (por ejemplo mascota_id, vacuna_id, fecha). Luego: «INSERT INTO vacuna_aplicada (…) VALUES (…) ON CONFLICT (mascota_id, vacuna_id, fecha) DO NOTHING;». Ejecútalo dos veces: la segunda debe responder «INSERT 0 0».'
],

'w9d4': [
  'Escalera de dificultad: 1) todas las mascotas, 2) solo perros, 3) mascotas de más de 10 kg, 4) ordenadas por peso, 5) citas de esta semana… hasta 10) algo que combine varios filtros. Encima de cada una, un comentario con la pregunta de negocio que responde: «-- ¿Qué perros pesan más de 20 kg?».',
  'BETWEEN: «WHERE inicio BETWEEN \'2026-06-01\' AND \'2026-06-07\'». IN: «WHERE especie IN (\'perro\',\'gato\')». ILIKE (ignora mayúsculas): «WHERE nombre ILIKE \'ma%\'». IS NULL: «WHERE chip IS NULL». Recuerda: «= NULL» nunca funciona; siempre IS NULL.',
  'Primero pon algún peso a NULL en el seed. Luego: «SELECT count(*) FROM mascota WHERE peso_kg != 10;» y «SELECT count(*) FROM mascota WHERE peso_kg IS DISTINCT FROM 10;». La segunda da más filas, porque != descarta los NULL (NULL != 10 da «desconocido», no verdadero). Anota los dos números y la explicación.',
  '«ORDER BY peso_kg DESC» pone los NULL primero en PostgreSQL. «ORDER BY peso_kg DESC NULLS LAST» los manda al final. Ejecuta las dos y compara las primeras filas. En una pantalla de «mascotas más pesadas» quieres NULLS LAST.',
  '«SELECT peso_kg * 1000 AS gramos FROM mascota WHERE gramos > 5000;» da «column "gramos" does not exist». El WHERE se evalúa antes que el SELECT, así que el alias todavía no existe. Escribe el orden real en un comentario: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.'
],

'w9d5': [
  'Parte de cita y une las demás: «FROM cita c JOIN mascota m ON m.id = c.mascota_id JOIN dueno d ON d.id = m.dueno_id JOIN veterinario v ON v.id = c.veterinario_id WHERE c.inicio::date = current_date ORDER BY c.inicio». Si hoy no hay citas, cambia la fecha del seed o usa una fecha fija.',
  '«SELECT m.nombre, count(vi.id) AS visitas FROM mascota m LEFT JOIN visita vi ON vi.mascota_id = m.id GROUP BY m.id, m.nombre». Ojo: count(vi.id), no count(*). count(*) contaría 1 para las mascotas sin visitas, porque la fila con NULL también cuenta.',
  'Versión A: «LEFT JOIN visita vi ON vi.mascota_id = m.id AND vi.fecha >= \'2026-01-01\'». Versión B: el mismo filtro en el WHERE. La B pierde las mascotas sin visitas: el WHERE descarta las filas con NULL y convierte el LEFT JOIN en INNER JOIN. Anota cuántas filas da cada una.',
  'A: «SELECT d.* FROM dueno d LEFT JOIN mascota m ON m.dueno_id = d.id WHERE m.id IS NULL». B: «SELECT d.* FROM dueno d WHERE NOT EXISTS (SELECT 1 FROM mascota m WHERE m.dueno_id = d.id)». Las dos deben devolver los mismos dueños. Si tu seed no tiene ningún dueño sin mascota, añade uno.',
  'Pon EXPLAIN delante de la consulta del paso 1. Verás un árbol con nodos como Hash Join, Nested Loop o Seq Scan. Hoy no hace falta entenderlo: copia el plan en un comentario. En la semana 10 volverás a él y te sorprenderá lo mucho que ya entiendes.'
],

'w9d6': [
  'Citas por veterinario: GROUP BY v.id, v.nombre con count(*). Ingresos por mes: «date_trunc(\'month\', f.fecha) AS mes, sum(lf.importe)». Especies: GROUP BY m.especie ORDER BY count(*) DESC. Duración media: «avg(fin - inicio)». Pon encima de cada uno la pregunta de negocio que responde.',
  'Ejemplo: «SELECT v.nombre, count(*) AS total, count(*) FILTER (WHERE c.estado = \'cancelada\') AS canceladas FROM cita c JOIN veterinario v ON … GROUP BY v.nombre». Una sola pasada por la tabla te da el total y el subconjunto en columnas separadas.',
  '«BEGIN; INSERT INTO factura (…) RETURNING id; INSERT INTO linea_factura (…) …; UPDATE cita SET estado = \'facturada\' WHERE id = …; COMMIT;». Tras el COMMIT, comprueba con SELECT que existen la factura, sus líneas y la cita actualizada.',
  'Repite la transacción poniendo un importe negativo en una línea. Al fallar, PostgreSQL marca la transacción como abortada: haz «ROLLBACK;». Comprueba con SELECT que no quedó ni la factura ni ninguna línea. Esa es la atomicidad: todo o nada.',
  'Estructura: 1) tablas y relaciones principales, 2) tres decisiones de tipos (dinero, fechas, ids), 3) tres constraints y qué regla protegen, 4) la consulta de la agenda del día explicada JOIN por JOIN. Grábate. Si alguna explicación empieza con «creo que…», repasa esa parte.'
],

/* ---------- Semana 10 ---------- */

'w10d1': [
  'Ejemplo: «INSERT INTO cita (id, mascota_id, veterinario_id, inicio, fin, estado) SELECT gen_random_uuid(), (SELECT id FROM mascota ORDER BY random() LIMIT 1), …, ts, ts + interval \'30 min\', \'pendiente\' FROM generate_series(1, 500000) g, LATERAL (SELECT now() - random() * interval \'3 years\' AS ts) t;». Si tienes una exclusion constraint de solapes, añádela después (semana 10, día 4).',
  'En psql: «\\timing on». Luego ejecuta la consulta tres veces: «SELECT * FROM cita WHERE veterinario_id = \'…\' AND inicio >= \'2026-03-01\' AND inicio < \'2026-03-02\';». Anota el tiempo de la tercera ejecución (la primera puede ir más lenta porque los datos aún no están en caché).',
  '«CREATE INDEX ix_cita_veterinario_inicio ON cita (veterinario_id, inicio);». Vuelve a medir tres veces. Debería pasar de cientos de ms a menos de 1 ms. Anota los dos tiempos en indexes.sql como comentario: «-- sin índice: 180 ms; con índice: 0,4 ms».',
  'Filtra solo por inicio y pon EXPLAIN ANALYZE: verás un Seq Scan o un uso pobre del índice, porque la primera columna del índice es veterinario_id. Crea «CREATE INDEX ix_cita_inicio ON cita (inicio);» y repite: ahora debe aparecer Index Scan o Bitmap Index Scan. El orden de las columnas en un índice importa.',
  '«\\di+» muestra los índices con su tamaño. O bien: «SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)), idx_scan FROM pg_stat_user_indexes;». idx_scan = 0 significa que nunca se ha usado. Apunta los que no se usan como candidatos a borrar.'
],

'w10d2': [
  'Ponlo delante de cada consulta: «EXPLAIN (ANALYZE, BUFFERS) SELECT …». Ojo: ANALYZE ejecuta la consulta de verdad, así que con UPDATE o DELETE envuélvela en BEGIN … ROLLBACK. Copia cada plan a performance-notes.md.',
  'Lee el plan de abajo arriba y del más indentado al menos indentado. El nodo de arriba es el principal. «rows=» del paréntesis de la izquierda es la estimación y «actual … rows=» es la realidad. Si se diferencian en ×10 o más, el planificador está mal informado. Execution Time está al final del todo.',
  'Busca «Seq Scan on cita» con un «Rows Removed by Filter» enorme: lee toda la tabla para quedarse con pocas filas. Crea un índice sobre la columna del filtro y repite el EXPLAIN. Compara Execution Time antes y después y anótalo.',
  'Desactiva el autovacuum de la tabla para el experimento: «ALTER TABLE cita SET (autovacuum_enabled = false);». Inserta 200.000 filas con generate_series y ejecuta EXPLAIN ANALYZE: verás rows estimado muy distinto del real. Luego «ANALYZE cita;» y repite. Al terminar, vuelve a activar el autovacuum.',
  'Por cada consulta: la consulta, el plan antes, qué cambiaste (un índice, un ANALYZE, reescribir la consulta), el plan después y una frase con el porqué: «pasó de Seq Scan (220 ms) a Index Scan (0,3 ms) porque el filtro por veterinario_id ahora usa ix_cita_veterinario_inicio».'
],

'w10d3': [
  'Con Npgsql o Dapper en el Playground: una consulta trae las mascotas y luego, en un foreach, una consulta por mascota para sus visitas. Pon un contador que sume 1 por cada consulta ejecutada. Con 100 mascotas son 101 consultas: eso es el N+1. Mide también el tiempo total con Stopwatch.',
  'Una sola consulta con JOIN: «SELECT m.id, m.nombre, v.fecha FROM mascota m LEFT JOIN visita v ON v.mascota_id = m.id» y agrupa en C# por mascota. Compara: 101 consultas frente a 1, y el tiempo total. En red, cada viaje a la base cuesta milisegundos aunque la consulta sea trivial.',
  'Cursor: «WHERE (inicio, id) > (\'2026-03-01 10:00\', \'…ultimo_id…\') ORDER BY inicio, id LIMIT 20». OFFSET: «ORDER BY inicio, id OFFSET 100000 LIMIT 20». Mide los dos con EXPLAIN ANALYZE: OFFSET lee y descarta 100.000 filas; el cursor salta directo al punto con el índice sobre (inicio, id).',
  '«CREATE INDEX ix_cita_vet_inicio_cov ON cita (veterinario_id, inicio) INCLUDE (estado);». Luego pide solo columnas del índice: «SELECT inicio, estado FROM cita WHERE veterinario_id = …». Ejecuta antes «VACUUM cita;» para actualizar el mapa de visibilidad; si no, puede seguir saliendo Index Scan normal.',
  'Lento: «WHERE date_trunc(\'day\', inicio) = \'2026-03-01\'» (la función sobre la columna impide usar el índice). Rápido: «WHERE inicio >= \'2026-03-01\' AND inicio < \'2026-03-02\'». Compara los dos EXPLAIN. Regla: deja la columna «desnuda» a un lado del operador.'
],

'w10d4': [
  '«CREATE EXTENSION IF NOT EXISTS btree_gist;» y luego «ALTER TABLE cita ADD CONSTRAINT ex_cita_sin_solape EXCLUDE USING gist (veterinario_id WITH =, tstzrange(inicio, fin) WITH &&) WHERE (estado <> \'cancelada\');». Si falla porque ya hay solapes en tus datos, bórralos o márcalos como cancelados antes.',
  'Para el mismo veterinario: solape parcial (10:00–10:30 frente a 10:15–10:45), contención total (10:00–11:00 frente a 10:15–10:30) e inicio idéntico. Comprueba también que la contigua 10:30–11:00 SÍ entra: tstzrange es semiabierto [inicio, fin), así que tocarse no es solaparse.',
  'Inserta una cita con estado «cancelada» en un hueco ocupado: debe entrar. Luego intenta cambiarla a «pendiente» con UPDATE: debe fallar. Así compruebas que la cláusula WHERE de la constraint funciona en los dos sentidos.',
  '«CREATE UNIQUE INDEX uq_dueno_email_lower ON dueno (lower(email));». Inserta «ana@mail.com» y después «ANA@Mail.com»: el segundo debe fallar. Sin lower(), PostgreSQL los trataría como distintos y tendrías dos cuentas para la misma persona.',
  'Haz dos listas. «Garantizado por la base»: peso positivo, email único sin importar mayúsculas, sin solapes, FK… «En el código»: no vacunar antes de 8 semanas, recargo por cancelación tardía… Para cada una del código, una frase de por qué no cabe en la base (necesita datos de otra tabla, depende de la hora actual…).'
],

'w10d5': [
  'Parte tu schema.sql en archivos pequeños: 001_crear_tablas.sql, 002_constraints.sql, 003_indices.sql, 004_exclusion_citas.sql. Usa números con ceros a la izquierda para que se ordenen bien. Nunca edites una migración que ya se aplicó en algún sitio: crea la siguiente.',
  '«CREATE TABLE IF NOT EXISTS schema_migration ( version text PRIMARY KEY, aplicada_en timestamptz NOT NULL DEFAULT now() );». Al final de cada archivo: «INSERT INTO schema_migration (version) VALUES (\'003\');». Mejor aún: envuelve cada archivo en BEGIN … COMMIT para que la migración y su registro vayan juntos.',
  'Esquema en bash: «for f in database/migrations/*.sql; do v=$(basename "$f" | cut -c1-3); ya=$(psql -tAc "SELECT 1 FROM schema_migration WHERE version=\'$v\'"); [ "$ya" = "1" ] || psql -v ON_ERROR_STOP=1 -f "$f"; done». ON_ERROR_STOP hace que se detenga en el primer error en vez de seguir a ciegas.',
  '«DROP DATABASE vetcare; CREATE DATABASE vetcare;» y ejecuta tu script. Compara el esquema: «pg_dump --schema-only vetcare > despues.sql» y haz un diff con un volcado de antes. Si es idéntico, cualquiera puede recrear tu base desde cero.',
  'Tres migraciones separadas: 1) «ALTER TABLE mascota ADD COLUMN sexo text;» (admite NULL, instantáneo). 2) «UPDATE mascota SET sexo = \'desconocido\' WHERE sexo IS NULL;» (rellena; en tablas enormes, por lotes). 3) «ALTER TABLE mascota ALTER COLUMN sexo SET NOT NULL;». Así nunca hay un momento en que la tabla esté bloqueada mucho tiempo.'
],

'w10d6': [
  'Sesión A: «BEGIN; SELECT stock FROM vacuna WHERE id=1;» (ve 10). Sesión B: lo mismo (ve 10). A: «UPDATE vacuna SET stock = 9 WHERE id=1; COMMIT;». B: «UPDATE vacuna SET stock = 9 WHERE id=1; COMMIT;». Resultado: stock 9 cuando deberían ser 8. Se perdió una actualización. Usa dos ventanas de terminal una al lado de la otra.',
  'En las dos sesiones: «SELECT stock FROM vacuna WHERE id=1 FOR UPDATE;». La sesión B se queda esperando hasta que A haga COMMIT, y entonces ve el valor ya actualizado (9). Si B calcula a partir de lo que lee, el resultado final es 8. Funciona, pero bloquea: anota esa contrapartida.',
  'Añade «version int NOT NULL DEFAULT 0». Actualiza así: «UPDATE vacuna SET stock = 9, version = version + 1 WHERE id = 1 AND version = 0;». La segunda sesión, que leyó version 0, recibe «UPDATE 0»: nadie la bloqueó, pero se entera del conflicto y debe releer y reintentar (o avisar al usuario).',
  'A: «BEGIN; INSERT cita 10:00–10:30 vet X;» (sin COMMIT). B: insert 10:15–10:45 para el mismo vet → se queda esperando. A: COMMIT → B falla con «conflicting key value violates exclusion constraint». Ninguna comprobación hecha en el código consigue esto con dos peticiones simultáneas.',
  'Un ejemplo por tema: índices (el multicolumna de citas y por qué ese orden), EXPLAIN (la consulta que pasó de Seq Scan a Index Scan), migraciones (la columna NOT NULL en tres pasos), concurrencia (lost update y cuándo usar optimista o pesimista). Grábate y escúchate.'
],

/* ---------- Semana 11 ---------- */

'w11d1': [
  'curl viene instalado en macOS, Linux y Windows 10 o superior (en PowerShell usa «curl.exe» para no llamar al alias). Con -v verás líneas que empiezan por «>» (lo que envías), «<» (lo que recibes) y «*» (información de la conexión, como TLS).',
  'Línea de petición: «> GET /users/octocat HTTP/2». Cabeceras de ida: «> Host:», «> User-Agent:», «> Accept:». Estado: «< HTTP/2 200». Cabeceras de vuelta: «< content-type: application/json», «< cache-control»… El cuerpo JSON viene después de una línea vacía. Marca cada parte con un color o con un comentario.',
  'Fíjate en el código de estado y en el content-type de la respuesta: si sigue siendo JSON, la API ignoró tu Accept; si es un 406, lo rechazó explícitamente. Anota cuál de los dos comportamientos tiene y qué preferirías para VetCare (lo habitual es responder solo JSON).',
  'Pulsa F12, ve a la pestaña Network (Red) y recarga la página. Haz clic en una petición y revisa Headers, Preview y Response. Elige tres de tipos distintos: el documento HTML, un archivo JS o CSS y una petición XHR o fetch (filtra por Fetch/XHR). Compara sus cabeceras.',
  'Estructura con tus palabras: 1) línea de petición (método, ruta, versión), 2) cabeceras (para qué sirven Host, Accept, Content-Type y Authorization), 3) cuerpo (cuándo lleva y cuándo no) y lo mismo para la respuesta. Termina con una lista de las cabeceras que usará VetCare y para qué.'
],

'w11d2': [
  'Tabla Markdown: | Operación | Verbo | Ruta | Éxito | Errores |. Ejemplo: | Agendar cita | POST | /api/citas | 201 | 400, 404 (mascota no existe), 409 (horario ocupado), 422 |. Las 10 operaciones salen de tus RF de la semana 1.',
  'Idempotente = repetirla da el mismo resultado final. GET, PUT y DELETE sí (borrar dos veces deja la cita borrada igual). POST no (dos POST crean dos citas). Escribe el porqué en cada fila. PATCH depende: «sumar 1 al peso» no es idempotente; «poner el peso a 12» sí.',
  'Para cada POST pregunta: ¿crea un recurso nuevo? → POST está bien. ¿Reemplaza uno entero que ya conozco por su id? → PUT. ¿Cambia algunos campos? → PATCH. ¿Elimina? → DELETE. Error típico: «POST /api/citas/borrar» en lugar de «DELETE /api/citas/{id}».',
  '409 Conflict significa que la petición está bien formada, pero choca con el estado actual del recurso. 400 sería «la petición está mal escrita» (y no lo está). 200 mentiría (no se creó nada). Escribe en la tabla el cuerpo del error: «type: horario-ocupado, detail: el Dr. Pérez ya tiene cita de 10:00 a 10:30».',
  '-i muestra las cabeceras de la respuesta. Prueba también /status/201, /status/404 y /status/422. Fíjate en la primera línea «HTTP/2 409». Además puedes hacer «curl -i -X DELETE https://httpbin.org/delete» para ver otros métodos.'
],

'w11d3': [
  'Formato: «GET /api/mascotas/{id} — devuelve una mascota». Recorre los recursos: dueños, mascotas, citas, veterinarios, vacunas aplicadas, y para cada uno las operaciones que necesitas (no todas: si nadie borra veterinarios por la API, no hay DELETE).',
  'Lista de control: sin verbos (/api/obtenerCitas → GET /api/citas), plural (/api/cita → /api/citas), minúsculas con guiones (/api/vacunas-aplicadas) y como mucho dos niveles (/api/duenos/{id}/mascotas está bien; /api/duenos/{id}/mascotas/{id}/vacunas/{id} es demasiado: usa /api/vacunas-aplicadas/{id}).',
  'Ejemplo: «GET /api/citas?veterinarioId=…&desde=2026-06-01&hasta=2026-06-07&estado=pendiente&orden=inicio&limite=20&cursor=…». Documenta cada parámetro: tipo, si es obligatorio, valor por defecto y máximo permitido (por ejemplo, limite como máximo 100).',
  'Dos convenciones habituales: subrecurso con POST («POST /api/citas/{id}/cancelacion») o PATCH del estado («PATCH /api/citas/{id}» con {"estado":"cancelada"}). Elige una y aplícala a todas las acciones. Lo importante es ser coherente.',
  'Léela en voz alta a alguien que no sea programador o imagina que es otra persona: «GET barra api barra citas barra id»… Si tienes que añadir «esto en realidad sirve para…», el nombre falla. Renombra hasta que cada ruta se explique sola.'
],

'w11d4': [
  'Para cada endpoint, dos bloques: Petición y Respuesta, con datos realistas: «{"mascotaId":"3f2a…","veterinarioId":"9c1b…","inicio":"2026-06-10T10:00:00-05:00","motivo":"Vacuna anual"}». Pon ids y fechas con el formato real; nada de «string» o «xxx».',
  'Revisa cada campo de la respuesta: ¿lo muestra alguna pantalla o lo usa algún cliente? Si no, fuera. Candidatos típicos: fechas internas de auditoría, ids de tablas intermedias, banderas técnicas, contraseñas (¡nunca!). Menos campos = menos cosas que no puedes cambiar después.',
  'Campos que decide el servidor y no el cliente: id, estado inicial, fecha de creación, precio calculado, quién lo creó (sale del usuario autenticado). Si el cliente pudiera mandar «precio: 0» o «estado: atendida», tendrías un agujero de seguridad.',
  'Un sobre único para todos los listados: «{"items":[…],"siguienteCursor":"eyJ…","limite":20}». Con cursor no hace falta «total» (contarlo todo es caro). Úsalo en citas, mascotas, dueños… Así el frontend pagina siempre igual.',
  'Una sección «Convenciones» al principio: fechas en ISO 8601 con zona («2026-06-10T10:00:00-05:00»), dinero como string decimal con moneda («{"importe":"45.00","moneda":"USD"}»), enums en minúsculas («pendiente»), ids como uuid. Luego revisa todos los ejemplos y corrige los que no cumplan.'
],

'w11d5': [
  'Tabla: | type | title | status |. Ejemplos: «/errores/validacion | Datos inválidos | 422», «/errores/horario-ocupado | Horario no disponible | 409», «/errores/no-encontrado | Recurso no encontrado | 404», «/errores/no-autorizado | Sin permiso | 403». type es un identificador estable que el frontend usa para decidir qué hacer.',
  'Formato RFC 9457: «{"type":"/errores/validacion","title":"Datos inválidos","status":422,"detail":"Hay 2 campos con errores","errors":{"inicio":["Debe ser una fecha futura"],"mascotaId":["Obligatorio"]}}». El 409 debe decir con qué choca; el 404, qué recurso no encontró.',
  'Necesitan Idempotency-Key las operaciones POST cuyo duplicado hace daño: crear cita (dos citas), registrar pago (dos cobros) y enviar un recordatorio manual. Las PUT y DELETE ya son idempotentes por naturaleza. Escribe la lista con una frase de motivo para cada una.',
  'Flujo: el cliente genera un uuid y lo manda en la cabecera Idempotency-Key. El servidor guarda (clave, hash del cuerpo, respuesta) durante 24 h. Si la clave llega otra vez con el mismo cuerpo, devuelve la respuesta guardada sin repetir la operación. Si llega con otro cuerpo, responde 422. Si la primera petición aún se está procesando, responde 409.',
  'Busca en tus mensajes: nombres de tablas o constraints («violates ck_mascota…»), trazas de pila, rutas de archivos, versiones de librerías o «el usuario existe pero la contraseña falla». Sustitúyelos por mensajes para el usuario: «El peso debe ser mayor que 0». El detalle técnico va al log, nunca a la respuesta.'
],

'w11d6': [
  'Esqueleto: «openapi: 3.1.0 / info: { title: VetCare API, version: 1.0.0 } / paths: { /api/citas: { get: …, post: … }, /api/citas/{id}: { get: … } }». Cada operación lleva parameters, requestBody (si aplica) y responses con al menos el éxito y un error. Copia los JSON de ejemplo de api-contract.md.',
  'Define una vez «components: schemas: Cita: {type: object, properties: …}» y úsala con «$ref: \'#/components/schemas/Cita\'». Haz lo mismo con el error: «components: schemas: ProblemDetails». Si escribes la misma propiedad dos veces, ahí falta un $ref.',
  'Pega el YAML a la izquierda; los errores aparecen arriba en rojo, con número de línea. Los más comunes son la indentación (usa siempre 2 espacios, nunca tabuladores), un $ref mal escrito o un parámetro de ruta {id} sin definir en parameters. Corrige hasta que no quede ninguno.',
  'Despliega cada endpoint en el panel derecho: ¿entiendes qué hace solo con el summary? ¿Los ejemplos tienen sentido? ¿Están todos los errores posibles? Si tienes que explicar algo en voz alta, añádelo como description en el YAML.',
  'Prepara tres decisiones con su alternativa descartada: «POST /citas/{id}/cancelacion en vez de DELETE porque la cita no se borra: queda en el historial», «409 y no 400 para el solape», «el precio no está en el DTO de entrada porque lo calcula el servidor». Grábate 5 minutos.'
],

/* ---------- Semana 12 ---------- */

'w12d1': [
  '«dotnet new web -o src/VetCare.Api», «dotnet sln add src/VetCare.Api», «dotnet add src/VetCare.Api reference src/VetCare.Domain src/VetCare.Infrastructure», «dotnet add src/VetCare.Api package Microsoft.AspNetCore.OpenApi». Comprueba con «dotnet build» en la raíz.',
  '«app.MapGet("/health", () => Results.Ok(new { estado = "ok" }));». Para citas usa una lista estática: «var citas = new List<CitaDto>();» con MapGet("/api/citas"), MapGet("/api/citas/{id:guid}") y MapPost("/api/citas"). En el GET por id: si no existe, «Results.NotFound()».',
  '«dotnet run --project src/VetCare.Api» te dice el puerto (por ejemplo, http://localhost:5080). Prueba: «curl -i localhost:5080/api/citas», un GET con un id inventado (debe dar 404) y un POST: «curl -i -X POST localhost:5080/api/citas -H "Content-Type: application/json" -d \'{"mascotaId":"…"}\'».',
  'En el POST: «return Results.Created($"/api/citas/{cita.Id}", cita);». Con curl -i verás «HTTP/1.1 201 Created» y «Location: /api/citas/3f2a…». Copia esa ruta y haz un GET con ella: debe devolver la cita recién creada.',
  'Necesitas «builder.Services.AddOpenApi();» y «app.MapOpenApi();» en Program.cs. Abre http://localhost:5080/openapi/v1.json: verás tus rutas en JSON. Compáralo con tu openapi.yaml escrito a mano: lo que falte (summaries, errores) lo añadirás en el día 6.'
],

'w12d2': [
  '«app.Use(async (ctx, next) => { var sw = Stopwatch.StartNew(); var traceId = Activity.Current?.TraceId.ToString() ?? ctx.TraceIdentifier; ctx.Response.Headers["X-Trace-Id"] = traceId; await next(); logger.LogInformation("{Metodo} {Ruta} → {Status} en {Ms} ms [{TraceId}]", …); });». Comprueba con curl -i que aparece X-Trace-Id.',
  'Excepciones en el dominio: NoEncontradoException, HorarioOcupadoException, ReglaNegocioException. En Program.cs: «builder.Services.AddProblemDetails();» y «app.UseExceptionHandler();». Luego un IExceptionHandler (o un manejador en UseExceptionHandler) que traduce cada tipo de excepción a su código.',
  'Crea endpoints temporales: «app.MapGet("/prueba/404", () => { throw new NoEncontradoException("Cita"); });». Llámalos con curl -i y comprueba: código correcto, «Content-Type: application/problem+json» y el cuerpo con type, title y status. Bórralos al terminar.',
  '«app.Use((ctx, next) => { ctx.Response.StatusCode = 503; return Task.CompletedTask; });» colocado ANTES de tu middleware de logging: la respuesta sale, pero no hay log, porque la petición nunca llegó al logging. Muévelo DESPUÉS: ahora sí se registra el 503. Conclusión: el orden de los app.Use es el orden en que se ejecutan.',
  'Lanza «throw new Exception("boom con datos internos")». Con curl debe salir 500 con un problem+json genérico, sin «at VetCare.Api…» ni el mensaje interno. Ojo: en el entorno Development, ASP.NET muestra más detalle; prueba también con «ASPNETCORE_ENVIRONMENT=Production dotnet run».'
],

'w12d3': [
  '«dotnet add src/VetCare.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL». Crea «public class VetCareDbContext(DbContextOptions<VetCareDbContext> options) : DbContext(options) { public DbSet<Cita> Citas => Set<Cita>(); … }». Un DbSet por cada raíz de agregado.',
  'En OnModelCreating: «modelBuilder.Entity<Cita>(e => { e.ToTable("cita"); e.Property(x => x.Inicio).HasColumnName("inicio"); e.Property(x => x.VeterinarioId).HasColumnName("veterinario_id"); });». Alternativa: el paquete EFCore.NamingConventions con «.UseSnakeCaseNamingConvention()», que lo hace automáticamente.',
  '«dotnet user-secrets init --project src/VetCare.Api» y «dotnet user-secrets set "ConnectionStrings:VetCare" "Host=localhost;Database=vetcare;Username=postgres;Password=dev" --project src/VetCare.Api». En Program.cs: «builder.Services.AddDbContext<VetCareDbContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("VetCare")));».',
  'El endpoint recibe el DbContext: «app.MapGet("/api/citas", async (VetCareDbContext db) => await db.Citas.OrderBy(c => c.Inicio).Take(20).Select(c => new CitaDto(…)).ToListAsync());». Si sale vacío, comprueba que ejecutaste seed.sql en esta misma base.',
  'Añade dentro de UseNpgsql o en el AddDbContext: «o.UseNpgsql(…).EnableSensitiveDataLogging().LogTo(Console.WriteLine, LogLevel.Information)». Llama al endpoint y busca en la consola el SELECT generado. Comprueba: nombres snake_case, el LIMIT 20 y solo las columnas del DTO. Solo en desarrollo: enseña datos reales.'
],

'w12d4': [
  'MapPost recibe el DTO y el DbContext: crea la entidad con su factoría del dominio («Cita.Agendar(…)»), «db.Citas.Add(cita); await db.SaveChangesAsync();» y devuelve «Results.Created(…)». Comprueba con un SELECT en psql que la fila existe de verdad.',
  '«catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: "23P01" }) { return Results.Problem(type: "/errores/horario-ocupado", title: "Horario no disponible", statusCode: 409); }». 23P01 es el código de PostgreSQL para violar una exclusion constraint.',
  'Primer POST: 10:00–10:30 → 201. Segundo POST, mismo veterinario, 10:15–10:45 → 409 con problem+json. Tercero, 10:30–11:00 → 201 (es contigua, no se solapa). Guarda los tres comandos curl en un archivo .http o .sh para repetirlos.',
  'Endpoint de historial: carga la mascota y luego, dentro de un foreach, «await db.Visitas.Where(v => v.MascotaId == …).ToListAsync()» por cada cosa. Cuenta en la consola los SELECT que aparecen: uno más por cada elemento. Ese es el N+1.',
  'Proyección en una sola consulta: «db.Mascotas.Where(m => m.Id == id).Select(m => new HistorialDto(m.Nombre, m.Visitas.OrderByDescending(v => v.Fecha).Select(v => new VisitaDto(v.Fecha, v.Motivo)).ToList())).SingleOrDefaultAsync()». En la consola debe aparecer un único SELECT con un JOIN.'
],

'w12d5': [
  'En el DTO: «public record CrearCitaDto([Required] Guid? MascotaId, [Required] DateTimeOffset? Inicio, [StringLength(200)] string? Motivo);». Usa los mismos límites que pusiste en api-contract.md. Los tipos anulables con [Required] detectan que falta un campo (si no, un Guid vacío pasaría como válido).',
  'Un IEndpointFilter genérico: «class ValidacionFiltro<T> : IEndpointFilter { … var dto = ctx.Arguments.OfType<T>().First(); var resultados = new List<ValidationResult>(); if (!Validator.TryValidateObject(dto, new ValidationContext(dto), resultados, true)) return Results.ValidationProblem(…, statusCode: 422); return await next(ctx); }». Aplícalo con «.AddEndpointFilter<ValidacionFiltro<CrearCitaDto>>()».',
  'Manda un POST sin mascotaId y con un motivo de 300 caracteres. Debes recibir 422 con «errors: { "MascotaId": ["…"], "Motivo": ["…"] }». Si recibes 400, ASP.NET no pudo ni leer el JSON (revisa la sintaxis); si recibes 201, el filtro no está aplicado a ese endpoint.',
  'Crea «static class CitasEndpoints { public static RouteGroupBuilder MapCitas(this IEndpointRouteBuilder app) { var g = app.MapGroup("/api/citas"); g.MapGet("/", …); return g; } }». En Program.cs solo queda «app.MapCitas(); app.MapMascotas();». Cuenta las líneas de Program.cs: menos de 60.',
  'Cursor codificado: base64 de «inicio|id» de la última fila. Consulta: «.Where(c => c.Inicio > cursorInicio || (c.Inicio == cursorInicio && c.Id.CompareTo(cursorId) > 0)).OrderBy(c => c.Inicio).ThenBy(c => c.Id).Take(limite + 1)». Si vuelven limite + 1 filas, hay página siguiente. Pide tres páginas y comprueba que no se repite ni falta ninguna cita.'
],

'w12d6': [
  'Con Scalar: «dotnet add package Scalar.AspNetCore» y «app.MapScalarApiReference();» (o Swagger UI con Swashbuckle). Abre /scalar/v1 y ejecuta GET, POST y un error desde el navegador. Actívalo solo en Development: «if (app.Environment.IsDevelopment())».',
  'Ejemplo: «g.MapPost("/", Crear).WithSummary("Agenda una cita").Produces<CitaDto>(201).ProducesValidationProblem(422).ProducesProblem(409);». Recarga la documentación: cada endpoint debe mostrar todos sus códigos posibles. Compáralo con tu openapi.yaml de la semana 11.',
  '«builder.Services.AddHealthChecks().AddNpgSql(cadena, tags: new[] { "ready" });». «app.MapHealthChecks("/health/live", new() { Predicate = _ => false }); app.MapHealthChecks("/health/ready", new() { Predicate = r => r.Tags.Contains("ready") });». Con «docker stop vetcare-db», /health/ready debe dar 503 y /health/live seguir en 200.',
  'Recorre cada punto y escribe ✓ o ✗ con la prueba concreta (un comando curl o una captura). Prioriza lo que afecta al cliente: códigos correctos, errores en problem+json, validación y paginación. Lo estético, al final.',
  'Prepara el guion y los comandos en un archivo .http o .sh para no escribir en directo. Orden: crear dueño (201) → crear mascota con ese dueño → agendar cita (201) → solaparla (409) → GET historial. Grábate con la pantalla dividida: terminal a un lado y la base de datos al otro.'
]

});
