window.WEEKS = (window.WEEKS || []).concat([
{
  n: 21,
  phase: 'Rendimiento',
  title: 'Rendimiento: medir antes de tocar',
  idea: 'Casi todo lo que la gente hace para "optimizar" no sirve de nada, y una parte lo empeora. El problema no es que no sepan técnicas: es que adivinan dónde está el cuello de botella en vez de medirlo. Esta semana inviertes el orden. Primero decides qué significa rápido para VetCare y lo escribes como un número. Después mides de verdad, con percentiles y no con promedios, porque el promedio esconde justo a los usuarios que lo están pasando mal. Solo entonces tocas código, y cada cambio tiene que demostrar su mejora con una medición antes y después. Al final de la semana vas a tener algo que casi nadie tiene: la frase "esta optimización bajó el p95 de 800 ms a 120 ms" respaldada por datos tuyos.',
  res: [
    { t: 'Brendan Gregg — USE Method', u: 'https://www.brendangregg.com/usemethod.html', note: 'Método sistemático para encontrar cuellos de botella: utilización, saturación y errores de cada recurso. Corto y te da un orden en el que mirar en vez de dar palos de ciego.' },
    { t: 'PostgreSQL — Using EXPLAIN', u: 'https://www.postgresql.org/docs/current/using-explain.html', note: 'Ya lo tocaste en la semana 10. Esta vez lo usas para diagnosticar consultas reales de tu aplicación, no ejemplos.' },
    { t: 'BenchmarkDotNet — Getting started', u: 'https://benchmarkdotnet.org/articles/guides/getting-started.html', note: 'La herramienta estándar para medir código .NET en serio. Lo importante es que te evita los errores clásicos de medir con un cronómetro a mano.' },
    { t: 'web.dev — Core Web Vitals', u: 'https://web.dev/articles/vitals', note: 'Las métricas con las que se mide la experiencia real en el navegador. Define qué es rápido desde el punto de vista del usuario y no del servidor.' },
    { t: 'Google SRE Book — Service Level Objectives', u: 'https://sre.google/sre-book/service-level-objectives/', note: 'Percentiles, agregación y por qué el promedio engaña.' },
    { t: 'Microsoft Learn — ASP.NET Core metrics', u: 'https://learn.microsoft.com/en-us/aspnet/core/log-mon/metrics/metrics', note: 'System.Diagnostics.Metrics y las métricas integradas de ASP.NET Core.' },
    { t: 'Microsoft Learn — HybridCache', u: 'https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid', note: 'La cache recomendada en .NET moderno, con protección contra estampida.' }
  ],
  days: [
    {
      t: 'Definir rápido: objetivos, percentiles y la trampa del promedio',
      obj: 'Escribir objetivos de rendimiento numéricos para VetCare y entender por qué el promedio es la métrica que más engaños produce.',
      why: 'Sin un número objetivo, "optimizar" no tiene final ni criterio. Y entender percentiles es una de esas cosas que, cuando la explicas bien en una entrevista, cambia por completo la impresión que causas.',
      study: { r: 4, what: 'Lee la sección "Indicators in Practice" del capítulo, sobre todo la parte de agregación. Unos 12 minutos. Busca una cosa: por qué el promedio de latencia esconde a los usuarios que peor lo pasan y por qué se miden p50, p95 y p99. El método USE de Brendan Gregg queda como lectura extra.',
        pasos: [
          'Lee "Indicators" en la parte de terminología (~3 min): qué es un SLI.',
          'Lee "What Do You and Your Users Care About?" (~3 min): qué indicadores importan según el tipo de servicio.',
          'Lee "Aggregation" con atención (~5 min): el ejemplo donde la media esconde picos y por qué se usan percentiles.',
          'Escribe para VetCare tres objetivos con percentil y número, por ejemplo: p95 de la agenda del día por debajo de 300 ms.',
          'Opcional: si te sobra tiempo, lee el resumen del método USE de Brendan Gregg para tener un recorrido ordenado de recursos.'
        ] },
      ex: {
        title: 'Por qué el promedio miente y el percentil no',
        body: `Diez peticiones a /api/citas, tiempo en milisegundos:

  50, 55, 60, 52, 58, 54, 51, 57, 53, 2400

  Promedio ...... 289 ms    "va bien"
  Mediana (p50) .  54 ms    la experiencia típica
  p95 ........... 2400 ms   lo que sufre 1 de cada 20
  Máximo ........ 2400 ms

El promedio no describe a nadie: ni al que esperó 54 ms ni al
que esperó 2.4 s. Si tienes 1000 peticiones al día, el p95 deja
50 con una experiencia mala, todos los días.

Y con una página que hace 5 llamadas, la probabilidad de que
al menos una caiga en ese 5% es 1 - 0.95^5 = 23%. Casi una de
cada cuatro cargas se siente lenta aunque el promedio sea bueno.

--- Objetivos de rendimiento de VetCare ---

| Operación                  | p50     | p95     | p99     |
|----------------------------|---------|---------|---------|
| GET  /api/v1/agenda?dia=   | < 80ms  | < 300ms | < 800ms |
| POST /api/v1/citas         | < 150ms | < 500ms | < 1s    |
| GET  /api/v1/mascotas/{id} | < 60ms  | < 200ms | < 500ms |
| Login                      | < 300ms | < 600ms | < 1s    |
| Carga inicial de la web    | < 1.5s  | < 2.5s  | < 4s    |

Nota: el login es lento A PROPÓSITO. BCrypt con workFactor 12
tarda unos 250 ms y eso es la defensa, no un problema.

Presupuesto por petición de agenda (p95 = 300 ms):
  red y TLS .......  30 ms
  middleware/auth ..  10 ms
  consulta SQL ..... 150 ms   <- donde más margen hay
  serialización ....  20 ms
  margen ...........  90 ms`
      },
      steps: [
        'Escribe la tabla de objetivos de VetCare en docs/rendimiento.md. Pon números aunque te parezcan inventados: un objetivo discutible es infinitamente mejor que ninguno, porque se puede corregir con datos.',
        'Para tu endpoint más importante, reparte el presupuesto del p95 entre las etapas como en el ejemplo. Te obliga a pensar dónde puede estar el tiempo antes de medirlo, y luego comparas tu intuición con la realidad.',
        'Calcula a mano, con la fórmula del ejemplo, qué porcentaje de cargas de tu página de agenda tocará el p95 si hace tres llamadas (pista: 1 - 0.95^3). El número que sale suele sorprender y justifica por qué el p95 importa tanto.',
        'Aplica el método USE a tu entorno local: para CPU, memoria, disco y conexiones de base de datos, anota cómo medirías utilización, saturación y errores. No lo midas todavía, solo escribe el cómo.',
        'Anota en el documento una frase que vas a respetar toda la semana: ninguna optimización entra sin una medición antes y otra después.'
      ],
      vet: [
        'Decide cuál es la operación crítica de VetCare, la que más veces al día hace la recepción. Esa es la que vas a medir y optimizar el resto de la semana; el resto puede esperar.',
        'Añade docs/rendimiento.md al índice del README junto a los demás documentos.'
      ],
      edge: [
        'Optimizar algo que se ejecuta una vez al día es tiempo perdido aunque lo hagas diez veces más rápido. La prioridad es frecuencia por impacto, no dificultad técnica ni lo divertido que sea el problema.',
        'Los percentiles no se promedian. El p95 de dos servidores no es la media de sus p95; necesitas los datos juntos. Es un error que se comete a diario en los informes.',
        'Un objetivo sin fuente de datos es un deseo. Escribe junto a cada número cómo lo vas a medir, o el día que no se cumpla no sabrás ni si es cierto.'
      ],
      quiz: [
        { q: '¿Por qué el p95 dice más que el promedio?', a: 'Porque el promedio se deja arrastrar por los valores extremos y acaba describiendo a un usuario que no existe. El p95 te dice el tiempo que sufre uno de cada veinte, que son personas reales y normalmente las mismas: las que tienen más datos o peor conexión.' },
        { q: 'Si cada llamada cumple el p95 el 95% de las veces, ¿por qué una página con cinco llamadas se siente lenta mucho más a menudo?', a: 'Porque la página solo va rápida si todas las llamadas van rápidas, y la probabilidad de que las cinco estén por debajo del umbral es 0.95 elevado a 5, aproximadamente 77%. Es decir, casi una de cada cuatro cargas tendrá al menos una llamada lenta.' },
        { q: '¿Qué son utilización, saturación y errores en el método USE?', a: 'Utilización es qué porcentaje del tiempo el recurso está ocupado, saturación es cuánto trabajo está esperando en cola porque el recurso no da abasto, y errores son los fallos de ese recurso. La saturación suele ser la más reveladora: una CPU al 70% con cola larga va peor que una al 95% sin cola.' },
        { q: '¿Por qué poner un objetivo numérico antes de medir?', a: 'Porque sin un objetivo no hay criterio para decidir si hay que optimizar ni cuándo parar, y toda discusión sobre rendimiento se vuelve una cuestión de opinión. Con un número, los datos deciden.' }
      ],
      out: 'docs/rendimiento.md con tabla de objetivos por percentil, presupuesto por etapas y la operación crítica elegida.',
      file: 'docs/rendimiento.md'
    },
    {
      t: 'Medir la API: de dónde se va el tiempo de verdad',
      obj: 'Instrumentar la API para saber cuánto tarda cada petición y en qué, y generar carga suficiente para obtener percentiles reales.',
      why: 'La intuición sobre dónde se va el tiempo acierta mucho menos de lo que la gente cree. Medir primero es el hábito que separa a quien optimiza de quien toquetea, y en una entrevista se nota al instante en cómo describes el proceso.',
      study: { r: 5, what: 'Lee la página de métricas de ASP.NET Core. Unos 12 minutos. Lo que te interesa es que .NET ya trae contadores e histogramas integrados (por ejemplo http.server.request.duration), así que no necesitas una librería para empezar a medir.',
        pasos: [
          'Lee "Use metrics" (~3 min): qué métricas trae ASP.NET Core sin que hagas nada.',
          'Lee "View metrics with dotnet-counters" (~4 min) y ejecútalo contra tu API mientras haces peticiones.',
          'Lee "Create custom metrics" y "Creating metrics in ASP.NET Core apps with IMeterFactory" (~5 min).',
          'Lee "ASP.NET Core meters and counters" por encima (~2 min) y localiza http.server.request.duration.',
          'Genera carga con un bucle de peticiones y anota el p50, p95 y p99 de tus tres endpoints principales.'
        ] },
      ex: {
        title: 'Middleware de tiempos e histograma por endpoint',
        body: `// Medición básica: cuánto tarda cada petición, por ruta
var medidor = new Meter("VetCare.Api");
var duracion = medidor.CreateHistogram<double>(
    "vetcare.peticion.duracion", unit: "ms");

app.Use(async (ctx, next) =>
{
    var inicio = Stopwatch.GetTimestamp();
    try
    {
        await next();
    }
    finally
    {
        var ms = Stopwatch.GetElapsedTime(inicio).TotalMilliseconds;
        var ruta = ctx.GetEndpoint()?.DisplayName ?? "desconocido";

        duracion.Record(ms,
            new KeyValuePair<string, object?>("ruta", ruta),
            new KeyValuePair<string, object?>("estado", ctx.Response.StatusCode));

        if (ms > 500)
            app.Logger.LogWarning("Petición lenta {Ruta} {Ms}ms", ruta, ms);
    }
});

// Ver el SQL que EF Core ejecuta de verdad, solo en desarrollo
options.UseNpgsql(cadena)
       .EnableSensitiveDataLogging(esDesarrollo)
       .LogTo(Console.WriteLine, LogLevel.Information);

// Medir un trozo concreto de código cuando sospechas de él
// (en la semana 22 verás la forma buena, con ActivitySource)
using var actividad = new Activity("ConsultarAgenda").Start();
// ... código ...

# --- Generar carga para obtener percentiles ---
# Instalar: brew install bombardier  (en Mac; o descárgalo de
#   github.com/codesenberg/bombardier/releases; también valen hey o k6).
#   Ojo: NO es una herramienta de dotnet.
# -l pide la distribución de latencias (los percentiles).
# La sesión va en la cookie de la semana 18; copia su valor del navegador.

bombardier -c 10 -n 500 -l \\
  -H "Cookie: vetcare_sesion=$SESION" \\
  "http://localhost:8080/api/v1/agenda?dia=2026-10-05"

# Statistics        Avg      Stdev        Max
#   Reqs/sec       142.31     38.22     210.00
#   Latency       70.21ms    42.1ms    812.0ms
#   Latency Distribution
#      50%    54ms     <- la experiencia típica
#      95%   180ms     <- el objetivo que te pusiste
#      99%   640ms     <- la cola, donde está el problema`
      },
      steps: [
        'Añade el middleware de medición a tu API y el aviso de petición lenta. Arranca y navega por la web un rato: deberías ver avisos de las peticiones que pasan de medio segundo.',
        'Activa el registro de SQL de EF Core en desarrollo y usa la web normalmente durante dos minutos. Lee la consola: casi siempre aparece alguna consulta que no esperabas o que se repite muchas veces.',
        'Carga datos de verdad en tu base. Con veinte filas todo es rápido; genera al menos cincuenta mil citas y diez mil mascotas con un script. Medir contra una base vacía no mide nada.',
        'Instala bombardier o hey y lanza carga contra tu endpoint crítico. Apunta p50, p95 y p99 en docs/rendimiento.md como línea base. Este número es contra el que vas a comparar todo lo que hagas el resto de la semana.',
        'Compara la línea base con los objetivos del día 1. Marca qué endpoints cumplen y cuáles no. Solo los que no cumplen son candidatos a optimizarse; los demás están terminados y no se tocan.'
      ],
      vet: [
        'Guarda el script que genera los datos de prueba en database/seed-carga.sql o como un comando de tu CLI, para poder regenerar el mismo escenario cuando quieras comparar.',
        'Añade a docs/rendimiento.md una tabla de línea base con fecha, volumen de datos y los tres percentiles por endpoint. Sin el volumen de datos la medición no es comparable.'
      ],
      edge: [
        'Medir en modo Debug da números que no significan nada: el compilador no optimiza igual y hay comprobaciones extra. Mide siempre en Release.',
        'La primera petición de .NET siempre es lenta por la compilación JIT y el arranque en frío. Descarta el calentamiento antes de medir o lo meterás en el p99 y perseguirás un fantasma.',
        'Si generas carga desde la misma máquina que corre el servidor, estás compitiendo por la CPU contigo mismo. Para números finos, genera la carga desde otra máquina; para comparar antes y después, da igual mientras las condiciones sean iguales.'
      ],
      quiz: [
        { q: '¿Por qué medir con pocos datos en la base no sirve?', a: 'Porque con pocas filas PostgreSQL recorre la tabla entera en microsegundos y todas las consultas parecen rápidas, incluso las que no usan índice. Los problemas de rendimiento aparecen cuando el volumen cambia el plan de ejecución, así que tienes que medir con un volumen parecido al real.' },
        { q: '¿Qué te dice que la mediana sea buena pero el p99 sea malísimo?', a: 'Que la mayoría de peticiones van bien y hay una minoría que se comporta de forma muy distinta. Las causas típicas son un caso concreto con muchos más datos, un cache que falla, contención por bloqueos o una llamada externa que a veces se atasca.' },
        { q: '¿Por qué descartar las primeras peticiones de una medición?', a: 'Porque el arranque en frío incluye compilación JIT, apertura del pool de conexiones y cargas perezosas que solo ocurren una vez. Si las incluyes, contaminan la cola de la distribución y acabas optimizando algo que solo pasa al arrancar.' },
        { q: '¿Qué aporta un histograma por endpoint frente a un simple log de tiempos?', a: 'Que te da la distribución completa y te permite calcular percentiles por ruta y por código de estado, en vez de tener que leer miles de líneas de log a mano. Además se puede agregar y graficar, que es lo que necesitarás en la semana de observabilidad.' }
      ],
      out: 'Middleware de medición activo, base con volumen realista, y tabla de línea base con p50/p95/p99 por endpoint.',
      file: 'docs/rendimiento.md'
    },
    {
      t: 'Base de datos: donde está casi siempre el problema',
      obj: 'Encontrar las consultas lentas reales de VetCare, diagnosticarlas con EXPLAIN ANALYZE y arreglar las que no cumplen el objetivo.',
      why: 'En una aplicación de gestión típica, entre el 70 y el 90 por ciento del tiempo de una petición se va en la base de datos. Es donde una hora de trabajo da más resultado que en cualquier otro sitio, y es lo que más se pregunta en entrevistas de backend.',
      study: { r: 1, what: 'Repasa la página Using EXPLAIN de PostgreSQL, sobre todo la parte de EXPLAIN ANALYZE y la diferencia entre filas estimadas y filas reales. Unos 12 minutos. La señal que buscas: cuando la estimación y la realidad se separan mucho, el planificador está eligiendo mal porque sus estadísticas no reflejan tus datos.',
        pasos: [
          'Relee "EXPLAIN ANALYZE" (~6 min) con tu consulta más lenta delante.',
          'Busca en tu plan los nodos donde rows estimado y rows real difieren más de diez veces.',
          'Relee "Caveats" (~2 min).',
          'Ejecuta ANALYZE sobre la tabla implicada y repite el EXPLAIN ANALYZE: si el plan cambia, el problema eran las estadísticas.',
          'Anota cada consulta con su tiempo antes y después del arreglo.'
        ] },
      ex: {
        title: 'Del síntoma al plan y del plan al arreglo',
        body: `-- 1. Qué consultas duelen de verdad (requiere pg_stat_statements)
-- Ojo: la extensión tiene que cargarse al ARRANCAR PostgreSQL. Con Docker:
--   docker run ... postgres:17 -c shared_preload_libraries=pg_stat_statements
-- (en compose: command: ["postgres", "-c",
--                        "shared_preload_libraries=pg_stat_statements"])
-- Sin eso, la consulta de abajo da error aunque crees la extensión.
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT substring(query, 1, 70) AS consulta,
       calls,
       round(mean_exec_time::numeric, 2)  AS media_ms,
       round(total_exec_time::numeric, 0) AS total_ms
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Ordena por TIEMPO TOTAL, no por media: una consulta de 5 ms
-- llamada 100.000 veces duele más que una de 2 s llamada dos veces.

-- 2. Diagnosticar la peor
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.id, c.inicio, m.nombre
FROM cita c
JOIN mascota m ON m.id = c.mascota_id
WHERE c.inicio >= '2026-10-05' AND c.inicio < '2026-10-06'
ORDER BY c.inicio;

-- ANTES:
-- Seq Scan on cita  (cost=0..9821 rows=48 width=..)
--   (actual time=0.02..142.8 rows=37 loops=1)
--   Filter: (inicio >= ... AND inicio < ...)
--   Rows Removed by Filter: 49963      <- lee 50.000 para devolver 37
-- Buffers: shared hit=12 read=4310     <- 4310 bloques de disco
-- Execution Time: 148.221 ms

-- 3. Arreglar
CREATE INDEX CONCURRENTLY ix_cita_inicio ON cita (inicio);

-- DESPUÉS:
-- Index Scan using ix_cita_inicio on cita
--   (actual time=0.03..0.31 rows=37 loops=1)
-- Buffers: shared hit=9 read=3
-- Execution Time: 0.482 ms            <- 300 veces más rápido

-- Señales en un plan, de peor a mejor:
--   Seq Scan sobre tabla grande con filtro selectivo -> falta índice
--   Rows Removed by Filter enorme                    -> índice mal elegido
--   rows estimadas muy lejos de rows reales          -> ANALYZE / estadísticas
--   Nested Loop con loops=N alto                     -> huele a N+1
--   Sort con "external merge Disk"                   -> subir work_mem o indexar

-- 4. El clásico N+1 desde EF Core (semana 12)
-- 1 consulta de citas + 1 por cada mascota = 38 viajes a la base
var citas = await db.Citas.Where(c => c.Inicio >= dia).ToListAsync();
foreach (var c in citas) { var m = await db.Mascotas.FindAsync(c.MascotaId); }

-- Arreglo: una sola consulta con join y proyección (como AgendaDelDia)
var filas = await (from c in db.Citas.AsNoTracking()
                   join m in db.Mascotas on c.MascotaId equals m.Id
                   where c.Inicio >= dia && c.Inicio < dia.AddDays(1)
                   select new { c.Id, c.Inicio, Mascota = m.Nombre })
                  .ToListAsync();`
      },
      steps: [
        'Activa pg_stat_statements en tu PostgreSQL (arrancándolo con shared_preload_libraries, como en el ejemplo), usa la aplicación durante unos minutos generando tráfico real y después lanza la consulta de las diez peores ordenadas por tiempo total.',
        'Coge la peor y ejecútale EXPLAIN (ANALYZE, BUFFERS). Lee el plan de dentro hacia fuera y localiza las señales de la lista: escaneo secuencial, filas descartadas por filtro, estimación lejos de la realidad.',
        'Arregla esa consulta. Normalmente es un índice, pero a veces es la consulta la que está mal planteada: trae columnas que no usa, ordena por algo innecesario o se hace en bucle desde el código.',
        'Vuelve a ejecutar EXPLAIN ANALYZE y apunta el antes y el después en docs/rendimiento.md con el tiempo y los buffers leídos. Sin el antes, la mejora es una afirmación sin respaldo.',
        'Busca N+1 en tu código revisando el registro de SQL de ayer: si ves la misma consulta repetida muchas veces con parámetros distintos, lo tienes. Arréglalo con proyección en una sola consulta como en el ejemplo.'
      ],
      vet: [
        'Añade a database/indexes.sql cada índice nuevo con un comentario encima: qué consulta lo justifica y qué tiempo medido mejoró. Un índice sin justificación escrita es un índice que nadie se atreverá a borrar nunca.',
        'Repite la medición de carga del día 2 sobre el endpoint crítico y compara el p95 con la línea base. Esa comparación es el entregable real del día.'
      ],
      edge: [
        'Cada índice acelera lecturas y frena escrituras, además de ocupar espacio. En una tabla con muchas inserciones, cinco índices poco usados pueden costar más de lo que ahorran.',
        'CREATE INDEX bloquea la tabla para escrituras. En producción usa CREATE INDEX CONCURRENTLY, que tarda más pero no bloquea. Acostúmbrate ya aunque estés en local.',
        'Si las filas estimadas y las reales se diferencian en órdenes de magnitud, el planificador trabaja con información vieja. Ejecuta ANALYZE sobre la tabla antes de concluir que el problema es otro.'
      ],
      quiz: [
        { q: '¿Por qué ordenar pg_stat_statements por tiempo total y no por tiempo medio?', a: 'Porque lo que afecta al sistema es el tiempo acumulado. Una consulta de 5 ms ejecutada cien mil veces consume mucho más que una de dos segundos ejecutada dos veces, y además la primera suele ser más fácil de arreglar.' },
        { q: '¿Qué significa un Seq Scan con un valor alto en Rows Removed by Filter?', a: 'Que PostgreSQL está leyendo la tabla entera y descartando casi todo después de leerlo, porque no tiene un índice que le permita ir directo a las filas que cumplen la condición. Es la señal más clara de que falta un índice.' },
        { q: '¿Qué indica que las filas estimadas estén muy lejos de las reales?', a: 'Que las estadísticas de la tabla están desactualizadas y el planificador está eligiendo su estrategia con información falsa. Se corrige ejecutando ANALYZE, y si pasa a menudo, ajustando la frecuencia del autovacuum.' },
        { q: '¿Por qué no añadir índices a todas las columnas por si acaso?', a: 'Porque cada índice hay que mantenerlo en cada inserción, actualización y borrado, consume espacio y memoria, y encima puede confundir al planificador. Los índices se añaden para consultas concretas y medidas, no por precaución.' }
      ],
      out: 'Las tres peores consultas diagnosticadas y arregladas, con antes y después medidos, y los índices justificados por escrito.',
      file: 'docs/rendimiento.md'
    },
    {
      t: 'Cachear: la optimización que más se abusa',
      obj: 'Decidir con criterio qué merece cache, implementarla con invalidación correcta y saber cuándo no cachear.',
      why: 'La cache es la primera idea de todo el mundo y la causa de los bugs más difíciles de reproducir. Saber explicar cuándo no cachear demuestra más criterio que saber implementarla, y es justo lo que diferencia una respuesta madura en una entrevista.',
      study: { r: 6, what: 'Lee la página de HybridCache. Unos 12 minutos. Fíjate en GetOrCreateAsync (el patrón cache-aside), en la invalidación por etiquetas y en cómo evita la estampida cuando muchas peticiones piden la misma clave a la vez.',
        pasos: [
          'Lee "Register the service" y "Get and store cache entries" (~4 min).',
          'Lee "The main GetOrCreateAsync overload" (~3 min): si no está en cache, lo calcula una sola vez aunque lleguen muchas peticiones a la vez.',
          'Lee "Cache key guidance" (~3 min).',
          'Lee "Remove cache entries by key" y "Remove cache entries by tag" (~3 min): así se invalida cuando cambia el dato.',
          'Haz una tabla de datos de VetCare: se cachea o no, cuánto dura y qué evento lo invalida.'
        ] },
      ex: {
        title: 'Qué cachear, con qué caducidad y cómo invalidar',
        body: `// Antes de cachear, tres preguntas:
//   1. ¿Se lee mucho más de lo que se escribe?
//   2. ¿Importa que esté unos segundos desactualizado?
//   3. ¿Calcularlo es caro de verdad? (medido, no supuesto)
// Si alguna respuesta es no, no caches.

// --- Tabla de decisión para VetCare ---
// Lista de veterinarios ..... SÍ   cambia una vez al mes
// Catálogo de servicios ..... SÍ   cambia muy poco
// Agenda del día ............ NO   cambia constantemente y
//                                  mostrarla vieja causa dobles citas
// Historial clínico ......... NO   dato sensible, poco tráfico
// Permisos del usuario ...... CON CUIDADO: si revocas un rol,
//                                  la cache lo mantiene activo

// dotnet add package Microsoft.Extensions.Caching.Hybrid
// y en Program.cs: builder.Services.AddHybridCache();

public sealed class ServicioVeterinarios(HybridCache cache, VetCareDbContext db)
{
    private const string Clave = "veterinarios:activos";

    // Si no está en cache, lo calcula; si 100 peticiones piden la clave a
    // la vez, solo UNA va a la base y las demás esperan su resultado.
    public async Task<List<VeterinarioDto>> ActivosAsync(CancellationToken ct)
        => await cache.GetOrCreateAsync(
            Clave,
            async token => await db.Veterinarios
                .Where(v => v.Activo)
                .Select(v => new VeterinarioDto(v.Id, v.Nombre))
                .AsNoTracking()
                .ToListAsync(token),
            new HybridCacheEntryOptions { Expiration = TimeSpan.FromMinutes(10) },
            cancellationToken: ct);

    // Invalidar al escribir: si no haces esto, la cache miente.
    public async Task DesactivarAsync(Guid id, CancellationToken ct)
    {
        await db.Veterinarios.Where(v => v.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(v => v.Activo, false), ct);
        await cache.RemoveAsync(Clave, ct);
    }
}

// Cache HTTP: a veces la mejor cache es la que no escribes tú
ctx.Response.Headers.CacheControl = "public, max-age=300";
// y para recursos con hash en el nombre (Vite ya lo hace):
// "public, max-age=31536000, immutable"`
      },
      steps: [
        'Escribe la tabla de decisión de cache para VetCare: para cada dato que se consulta mucho, responde las tres preguntas y anota sí y por qué, o no y por qué. El no razonado vale tanto como el sí.',
        'Implementa cache solo para lo que haya pasado las tres preguntas. Lo normal es que sean una o dos cosas, no diez. Si tu lista de candidatos es larga, probablemente estás cacheando para evitar arreglar consultas.',
        'Implementa la invalidación en el mismo commit que la cache, nunca después. Una cache sin invalidación es un bug programado para aparecer cuando ya no te acuerdes de que existe.',
        'Mide otra vez con carga y compara. Si la mejora es pequeña, quita la cache: has añadido complejidad y una fuente de bugs a cambio de nada, y esa decisión también se documenta.',
        'Añade cabeceras Cache-Control a los recursos estáticos de la web y comprueba en la pestaña de red del navegador que la segunda carga los sirve desde cache. Es la cache más barata que existe y mucha gente la olvida.'
      ],
      vet: [
        'Documenta en docs/rendimiento.md cada cache: qué guarda, cuánto dura, qué la invalida y qué pasa si sirve un dato viejo. Esa última columna es la que de verdad importa.',
        'Revisa el caso de los permisos: si cacheas el rol del usuario, escribe explícitamente cuánto tiempo puede tardar en aplicarse una revocación. Es una decisión de seguridad, no de rendimiento.'
      ],
      edge: [
        'La invalidación es el problema difícil, no el almacenamiento. Antes de añadir una cache ten claro quién la borra y en qué operaciones, o acabarás depurando datos fantasma durante horas.',
        'La estampida de cache ocurre cuando una entrada muy usada caduca y cien peticiones simultáneas se lanzan a recalcularla a la vez. Se mitiga con un bloqueo por clave (HybridCache ya lo hace) o con caducidades ligeramente aleatorias.',
        'Cachear algo por usuario multiplica la memoria por el número de usuarios y suele tener muy poco acierto. Si el dato depende del usuario, casi siempre es mejor hacer la consulta rápida que cachearla.'
      ],
      quiz: [
        { q: '¿Cuáles son las tres preguntas antes de cachear algo?', a: 'Se lee mucho más de lo que se escribe, importa poco que esté algo desactualizado, y calcularlo es caro de verdad medido y no supuesto. Si falla cualquiera de las tres, la cache añade complejidad y riesgo sin beneficio proporcional.' },
        { q: '¿Por qué la agenda del día no se debe cachear en VetCare?', a: 'Porque cambia constantemente y mostrar una versión vieja tiene consecuencias reales: la recepción puede agendar sobre un hueco que ya no existe. Cuando el coste de un dato desactualizado es un error de negocio, la cache está descartada.' },
        { q: '¿Qué es una estampida de cache y cómo se evita?', a: 'Es lo que pasa cuando una entrada muy solicitada caduca y muchas peticiones simultáneas intentan recalcularla a la vez, golpeando la base justo en el peor momento. Se evita con un bloqueo por clave que deja recalcular a una sola, o añadiendo una variación aleatoria a las caducidades.' },
        { q: '¿Por qué cachear permisos de usuario es delicado?', a: 'Porque si revocas un rol y la cache sigue sirviendo el antiguo, ese usuario conserva acceso durante toda la duración de la entrada. Deja de ser un detalle de rendimiento para ser una ventana de seguridad, así que la duración tiene que ser corta y estar escrita.' }
      ],
      out: 'Tabla de decisión de cache escrita, una o dos caches implementadas con invalidación, y la mejora medida o la cache retirada.',
      file: 'docs/rendimiento.md'
    },
    {
      t: 'Rendimiento percibido en el navegador',
      obj: 'Medir la web de VetCare con las métricas que ve el usuario y reducir lo que tarda en ser útil, no solo en responder.',
      why: 'El usuario no mide milisegundos de servidor, mide cuánto tarda en poder hacer su trabajo. Core Web Vitals es el lenguaje estándar para eso y aparece en cualquier conversación seria sobre frontend.',
      study: { r: 3, what: 'Lee la página de Core Web Vitals de web.dev. Unos 12 minutos. Quédate con las tres métricas y qué mide cada una: LCP cuando aparece el contenido principal, INP cuánto tarda en responder a tu interacción, CLS cuánto se mueve la página mientras carga.',
        pasos: [
          'Lee la introducción de "Core Web Vitals" (~4 min): LCP, INP y CLS con sus umbrales de bueno.',
          'Lee "Field tools to measure Core Web Vitals" y "Lab tools to measure Core Web Vitals" (~3 min): datos reales frente a pruebas de laboratorio.',
          'Lee "Recommendations for improving your scores" (~2 min).',
          'Abre Lighthouse en las herramientas de desarrollo, analiza la página de agenda y anota las tres métricas.'
        ] },
      ex: {
        title: 'Diagnosticar y reducir el coste de carga',
        body: `// 1. Medir en el navegador: pestaña Lighthouse, modo móvil,
//    con ralentización de red y CPU. Sin ralentizar, todo parece
//    rápido porque tu máquina no es la de tu usuario.

// 2. Ver qué pesa de verdad en el paquete
//    npm run build
//    dist/assets/index-a1b2c3.js   842 kB   <- demasiado
//
//    npm i -D rollup-plugin-visualizer
//    y revisar el mapa: casi siempre hay una librería enorme
//    que usas para una sola cosa.

// 3. Cortar el paquete por rutas (semana 17)
const Facturacion = lazy(() => import('./paginas/Facturacion'));
const Historial   = lazy(() => import('./paginas/Historial'));
// La recepción que solo usa la agenda ya no descarga facturación.

// 4. Reservar el espacio para que la página no salte (CLS)
<div style={{ minHeight: 420 }}>
  {cargando ? <EsqueletoAgenda filas={8} /> : <Agenda citas={citas} />}
</div>
// El esqueleto debe ocupar lo mismo que el contenido real.
// Si no, el usuario hace clic donde había un botón que se movió.

// 5. Quitar trabajo del hilo principal (INP)
// MAL: filtrar 5000 elementos en cada pulsación de tecla
const vis = todas.filter(c => c.nombre.includes(busqueda));

// BIEN: memorizar y retrasar la búsqueda
const busquedaDiferida = useDeferredValue(busqueda);
const vis = useMemo(
  () => todas.filter(c => c.nombre.includes(busquedaDiferida)),
  [todas, busquedaDiferida]
);

// 6. Pedir los datos antes de que se necesiten (semana 17)
<Link
  to={'/citas/' + cita.id}
  onMouseEnter={() => qc.prefetchQuery(opcionesCita(cita.id))}
>`
      },
      steps: [
        'Ejecuta Lighthouse sobre tu web en modo móvil con ralentización activada y anota LCP, INP y CLS. Casi siempre la primera impresión es peor de lo que esperabas, y ese es el punto.',
        'Mira el tamaño del paquete tras npm run build. Si pasa de unos 300 kB comprimidos, instala el visualizador y averigua qué lo está inflando antes de tocar nada.',
        'Aplica carga diferida por rutas a las páginas que no se usan en el primer minuto de sesión. Vuelve a construir y compara el tamaño del paquete inicial.',
        'Busca saltos de contenido: recarga con la red ralentizada y observa si algo se mueve. Reserva espacio con esqueletos del mismo tamaño que el contenido real.',
        'Vuelve a pasar Lighthouse y apunta el antes y el después de las tres métricas en docs/rendimiento.md. Si alguna empeoró, averigua por qué antes de seguir.'
      ],
      vet: [
        'Comprueba que la agenda de VetCare es utilizable en menos de dos segundos y medio en móvil simulado. Es la pantalla que la recepción abre cincuenta veces al día y la única cuyo tiempo importa de verdad.',
        'Añade a docs/rendimiento.md una sección de frontend con las tres métricas antes y después y qué cambio concreto produjo cada mejora.'
      ],
      edge: [
        'Medir con tu máquina y tu fibra no mide a tus usuarios. Usa siempre ralentización de red y de CPU, porque un móvil de gama media es entre cuatro y seis veces más lento que tu portátil.',
        'Dividir el código en exceso también penaliza: cada trozo es una petición más. Divide por rutas y por librerías pesadas, no por componente.',
        'useMemo y useCallback no son gratis: tienen coste de comparación y de memoria. Úsalos cuando hayas medido que el recálculo duele, no por costumbre.'
      ],
      quiz: [
        { q: '¿Qué miden LCP, INP y CLS?', a: 'LCP mide cuánto tarda en aparecer el contenido principal, INP cuánto tarda la página en responder a una interacción del usuario, y CLS cuánto se desplaza el contenido de forma inesperada mientras carga. Juntas describen si la página se siente rápida, receptiva y estable.' },
        { q: '¿Por qué medir con ralentización de red y CPU?', a: 'Porque tu entorno de desarrollo es mucho mejor que el de tus usuarios: un móvil de gama media tiene una CPU varias veces más lenta y una conexión peor. Sin ralentizar, todas las métricas salen bien y no detectas nada.' },
        { q: '¿Cómo reduce la carga diferida por rutas el tiempo inicial?', a: 'Porque el navegador solo descarga el código de la página que se está viendo, en vez de todo el de la aplicación. Quien solo usa la agenda nunca paga el coste de descargar facturación ni historial.' },
        { q: '¿Por qué un esqueleto debe ocupar el mismo espacio que el contenido real?', a: 'Porque si ocupa menos, al llegar los datos todo lo de abajo se desplaza y eso es exactamente lo que mide el CLS. Además de verse mal, provoca clics accidentales en botones que se movieron justo antes de pulsarlos.' }
      ],
      out: 'Lighthouse medido antes y después, paquete inicial reducido con carga diferida, y saltos de contenido eliminados.',
      file: 'docs/rendimiento.md'
    },
    {
      t: 'Informe de optimización (examen de la semana)',
      obj: 'Reunir todas las mediciones en un informe que demuestre mejoras con datos y que puedas defender en una entrevista.',
      why: 'Decir "optimicé la aplicación" no significa nada. Decir "el p95 de la agenda bajó de 840 a 115 ms añadiendo un índice que eliminó un escaneo secuencial de cincuenta mil filas, y aquí está el plan de antes y de después" es una historia que se recuerda.',
      study: { r: 0, what: 'Relee tus propias notas de la semana en docs/rendimiento.md. Unos 10 minutos. Busca una cosa concreta: en qué caso tu intuición inicial sobre dónde estaba el problema falló. Esa es la parte más valiosa del informe y la que mejor demuestra que mediste de verdad.',
        pasos: [
          'Lee el "Summary" del método USE (~3 min) y úsalo como lista: utilización, saturación y errores de cada recurso.',
          'Relee tus notas de la semana en docs/rendimiento.md.',
          'Marca el caso en que tu intuición inicial falló y cuenta cómo lo descubriste.',
          'Ordena los hallazgos por impacto medido, no por esfuerzo que te costaron.'
        ] },
      ex: {
        title: 'Estructura del informe de rendimiento',
        body: `# Informe de rendimiento - VetCare
Fecha: 2026-xx-xx
Datos de prueba: 50.000 citas, 10.000 mascotas, 12 veterinarios
Entorno: local, Release, PostgreSQL 17 en Docker
Carga: bombardier -c 10 -n 500

## 1. Objetivos
| Operación            | Objetivo p95 | Antes  | Después | Cumple |
|----------------------|--------------|--------|---------|--------|
| GET /api/v1/agenda   | 300 ms       | 840 ms | 115 ms  | SÍ     |
| POST /api/v1/citas   | 500 ms       | 410 ms | 390 ms  | SÍ     |
| GET /api/v1/mascotas | 200 ms       | 95 ms  | 95 ms   | SÍ     |
| Carga web (móvil)    | 2.5 s        | 4.1 s  | 1.9 s   | SÍ     |

## 2. Cambios, uno por uno
### 2.1 Índice en cita(inicio)
Síntoma: p95 de la agenda en 840 ms.
Diagnóstico: EXPLAIN ANALYZE mostraba Seq Scan leyendo 50.000
filas para devolver 37. 4310 bloques leídos de disco.
Cambio: CREATE INDEX CONCURRENTLY ix_cita_inicio ON cita (inicio);
Resultado: consulta de 148 ms a 0.5 ms. p95 del endpoint 840 -> 190 ms.
Coste: escritura de citas +3%, medido. Aceptable.

### 2.2 N+1 al listar la agenda
Síntoma: 38 consultas por petición en el log de EF Core.
Diagnóstico: bucle sobre citas haciendo FindAsync de cada mascota.
Cambio: una sola consulta con Select proyectado y AsNoTracking.
Resultado: 38 consultas -> 1. p95 190 -> 115 ms.

### 2.3 Carga diferida por rutas en la web
Síntoma: paquete inicial de 842 kB, LCP de 4.1 s en móvil.
Diagnóstico: facturación e historial se descargaban siempre.
Cambio: lazy + Suspense en las rutas no críticas.
Resultado: paquete inicial 842 -> 310 kB. LCP 4.1 -> 1.9 s.

## 3. Lo que NO hice y por qué
- Cache de la agenda: descartada. Cambia constantemente y servir
  datos viejos permitiría agendar sobre un hueco ocupado.
- Réplica de lectura: innecesaria. Una clínica no genera el
  volumen que la justifique y añadiría complejidad operativa.
- Reescribir las consultas a Dapper: EF Core proyectado ya cumple
  el objetivo. Medido, no supuesto.

## 4. Lo que aprendí
Mi intuición decía que el cuello estaba en la serialización JSON.
La medición dijo que la serialización eran 8 ms de 840. El 94%
del tiempo estaba en una sola consulta sin índice.

## 5. Siguiente límite conocido
Con varios millones de citas, el índice deja de bastar y habrá
que particionar la tabla por mes.`
      },
      steps: [
        'Escribe docs/rendimiento-informe.md con las cinco secciones del ejemplo. Cada cambio necesita síntoma, diagnóstico, cambio, resultado medido y coste. Si te falta alguna de las cinco, ese cambio no está justificado.',
        'Revisa la sección 3 con especial cuidado. Lo que decidiste no hacer y por qué demuestra más criterio que la lista de cosas que hiciste, y es lo que un entrevistador senior buscará.',
        'Completa la sección 4 con honestidad: dónde falló tu intuición. Es el apartado que prueba que mediste en vez de adivinar, y el que más credibilidad te da.',
        'Verifica la lista de la semana: objetivos escritos por percentil, línea base medida con volumen realista, las tres peores consultas diagnosticadas con EXPLAIN ANALYZE, N+1 eliminados, caches justificadas o descartadas por escrito, Lighthouse antes y después, y cada cambio con su medición.',
        'Ejecuta una última ronda de carga contra todos los endpoints de la tabla de objetivos y confirma que los números del informe son reproducibles hoy. Un informe con datos de hace tres días y código que cambió después no sirve.',
        'Explica en voz alta en tres minutos una sola optimización de principio a fin: síntoma, cómo lo mediste, qué encontraste, qué cambiaste y cuánto mejoró. Esa es literalmente la respuesta a "cuéntame una vez que mejoraste el rendimiento de algo".'
      ],
      vet: [
        'Añade al README de VetCare una línea con el resultado más llamativo y el enlace al informe. Es de las primeras cosas que alguien mira y comunica mucho en una sola frase.',
        'Guarda el script de carga y el de datos de prueba en el repositorio para poder repetir la medición después de cualquier cambio grande.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/rendimiento-informe.md dentro de una semana.'
      ],
      edge: [
        'Una optimización sin medición previa no es una optimización, es un cambio. Puede que mejore, puede que empeore, y sin número no lo sabrás nunca.',
        'Toda optimización tiene coste: complejidad, memoria, escrituras más lentas o una cache que invalidar. Si no puedes nombrar el coste, no has entendido el cambio del todo.',
        'Optimizar antes de que exista el problema suele costar legibilidad a cambio de nada. La excepción son las decisiones estructurales difíciles de cambiar después, como el esquema de la base o la forma de los contratos de la API.'
      ],
      quiz: [
        { q: '¿Por qué un informe de rendimiento necesita el antes y el después?', a: 'Porque sin el antes no hay forma de saber si el cambio mejoró algo ni cuánto, y "va más rápido" sin número es una opinión. El antes es además lo que te permite descubrir que una optimización que parecía obvia no sirvió de nada.' },
        { q: '¿Por qué la sección de lo que no hiciste es tan valiosa?', a: 'Porque demuestra que evaluaste alternativas y decidiste con criterio en vez de aplicar todo lo que sabías. Descartar una cache razonando su coste dice más de tu madurez técnica que implementarla.' },
        { q: '¿Qué coste típico tiene cada una de las optimizaciones que hiciste esta semana?', a: 'El índice acelera lecturas pero frena escrituras y ocupa espacio; eliminar el N+1 suele significar una consulta más compleja de leer; la cache añade una invalidación que mantener y una ventana de datos viejos; y la carga diferida introduce una petición extra al navegar. Nombrar el coste forma parte de entender el cambio.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que el rendimiento no es un conjunto de trucos sino un método: defines qué significa rápido con un número, mides dónde se va el tiempo en vez de suponerlo, cambias una sola cosa y vuelves a medir, y aceptas que tu intuición sobre el cuello de botella casi siempre se equivoca.' }
      ],
      out: 'docs/rendimiento-informe.md completo con objetivos cumplidos, cada cambio medido, lo descartado justificado y el siguiente límite identificado.',
      file: 'docs/rendimiento-informe.md'
    }
  ]
}
]);
