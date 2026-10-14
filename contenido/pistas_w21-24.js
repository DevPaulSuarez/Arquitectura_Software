/* Una pista por cada paso de «Hazlo tú»: cómo empezar, un ejemplo y cómo saber que está bien.
   Clave: w<semana>d<día>; el orden coincide con days[].steps. */
window.PISTAS = Object.assign(window.PISTAS || {}, {

/* ---------- Semana 21 ---------- */

'w21d1': [
  'Tabla: | Operación | p50 | p95 | p99 |. Ejemplo: «GET agenda del día | 80 ms | 300 ms | 800 ms», «POST crear cita | 120 ms | 400 ms | 1 s», «buscar mascota | 50 ms | 200 ms | 500 ms». Inspírate en lo que toleran los usuarios: la recepcionista está al teléfono, así que menos de 1 s en casi todo.',
  'Ejemplo para la agenda con p95 de 300 ms: red y TLS 40 ms, middleware y autenticación 10 ms, consulta SQL 150 ms, serialización 20 ms, margen 80 ms. Escríbelo como tabla. La suma debe dar el p95, y el margen te recuerda que siempre aparece algo que no habías previsto.',
  '1 − 0,95³ = 1 − 0,857 = 0,143 → el 14 % de las cargas de la página tendrán al menos una llamada lenta. Con 10 llamadas: 1 − 0,95¹⁰ ≈ 40 %. Escribe la conclusión: «lo que para una petición es raro (5 %), para una página que hace varias es frecuente».',
  'Tabla: | Recurso | Utilización | Saturación | Errores |. CPU: % de uso en top o en Docker Desktop | cola de procesos (load average) | —. Conexiones a PostgreSQL: conexiones activas frente a máximo del pool | peticiones esperando conexión | timeouts al obtener conexión. Haz lo mismo con memoria y disco.',
  'Una frase visible, en negrita, al principio del documento: «Ninguna optimización entra sin una medición antes y otra después, con la misma carga y los mismos datos». El resto de la semana, cada cambio debe tener esas dos mediciones o no cuenta.'
],

'w21d2': [
  '«app.Use(async (ctx, next) => { var sw = Stopwatch.StartNew(); await next(); sw.Stop(); if (sw.ElapsedMilliseconds > 500) logger.LogWarning("Petición lenta {Metodo} {Ruta} {Ms} ms", ctx.Request.Method, ctx.Request.Path, sw.ElapsedMilliseconds); });». Ponlo de los primeros en el pipeline para que mida todo lo que viene detrás.',
  'Activa el log de SQL (semana 12) y usa la web 2 minutos: abre la agenda, cambia de día, abre fichas, crea una cita. Busca en la consola el mismo SELECT repetido con distintos parámetros (N+1) y consultas que traen columnas que nadie muestra. Apúntalo todo.',
  'Reutiliza generate_series de la semana 10: 10.000 mascotas repartidas entre unos 3.000 dueños y 50.000 citas en los últimos 2 años. Después: «ANALYZE;». Comprueba con «SELECT count(*) FROM cita;». Si todavía tienes las 500.000 de la semana 10, también sirven.',
  '«bombardier -c 20 -d 30s -l "http://localhost:5080/api/v1/agenda?dia=2026-06-10"» (-l muestra los percentiles). Con hey: «hey -z 30s -c 20 URL». Necesita autenticación: pasa la cookie con «-H "Cookie: vetcare_sesion=…"». Anota p50, p95 y p99, y también la concurrencia y la duración que usaste.',
  'Tabla: | Endpoint | Objetivo p95 | Medido p95 | ¿Cumple? |. Lo que cumple, se queda como está aunque «podría ir más rápido». Lo que no cumple pasa a una lista de candidatos, ordenada por lo lejos que está del objetivo.'
],

'w21d3': [
  'En compose: «command: postgres -c shared_preload_libraries=pg_stat_statements» y reinicia. Dentro: «CREATE EXTENSION pg_stat_statements;». Usa la app unos minutos y luego: «SELECT left(query, 80), calls, round(total_exec_time) total_ms, round(mean_exec_time, 1) media_ms FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;».',
  'Copia la consulta, sustituye los $1, $2 por valores reales y ejecuta «EXPLAIN (ANALYZE, BUFFERS) …». Busca: Seq Scan en tablas grandes, «Rows Removed by Filter» enorme, estimado muy distinto del real y «Buffers: shared read» alto (lecturas de disco).',
  'Si filtra por una columna sin índice → índice (multicolumna en el orden del filtro). Si trae 20 columnas y la pantalla usa 4 → proyección con Select. Si ordena por algo que la pantalla no necesita → quita el ORDER BY. Si se ejecuta una vez por cada elemento de una lista → es un N+1, no un problema de índices.',
  'Tabla: | Consulta | Antes (ms / buffers) | Cambio | Después (ms / buffers) |. Ejemplo: «agenda por veterinario | 210 ms / 12.400 buffers | índice (veterinario_id, inicio) | 0,8 ms / 6 buffers». Los buffers son importantes: miden el trabajo real y varían menos que los milisegundos.',
  'En el log de SQL: la misma consulta 30 veces seguidas con un id distinto. Localiza el foreach del código que la provoca. Arreglo: una proyección con Select que traiga todo en una sola consulta (como en la semana 12). Vuelve a usar la pantalla y cuenta las consultas: debe salir una.'
],

'w21d4': [
  'Tres preguntas por dato: ¿se lee mucho más de lo que cambia? ¿Es caro de obtener? ¿Pasa algo si se ve con unos minutos de retraso? Ejemplos: catálogo de vacunas → sí, sí, no pasa nada → cachear. Agenda del día → cambia constantemente y un retraso causa citas dobles → no cachear.',
  '«builder.Services.AddHybridCache();» y luego «await cache.GetOrCreateAsync("catalogo-vacunas", async ct => await db.Vacunas.ToListAsync(ct), new() { Expiration = TimeSpan.FromMinutes(30) }, cancellationToken: ct)». O IMemoryCache con GetOrCreateAsync. Una o dos cosas como mucho.',
  'Donde se modifica el dato, invalida: tras guardar una vacuna en el catálogo, «await cache.RemoveAsync("catalogo-vacunas", ct);». Escribe un test o una prueba manual: crea una vacuna nueva y pide el catálogo; debe aparecer inmediatamente, no a los 30 minutos.',
  'Repite exactamente la misma prueba de carga del día 2 contra ese endpoint. Si el p95 pasa de 40 ms a 35 ms, la cache no compensa: quítala y anota «descartada: mejora del 12 % que no justifica el riesgo de datos viejos». Si pasa de 400 ms a 5 ms, quédatela.',
  'Vite pone un hash en el nombre de los archivos (assets/index-a1b2c3.js), así que pueden cachearse un año: «Cache-Control: public, max-age=31536000, immutable». index.html, en cambio, con «no-cache». En Network, recarga: en la columna Size debe aparecer «(memory cache)» o «(disk cache)» para los .js y .css.'
],

'w21d5': [
  'Para medir algo realista: «npm run build && npm run preview», no el modo dev. En Chrome, F12 → Lighthouse → Mode: Navigation, Device: Mobile, solo Performance → Analyze. Anota LCP, CLS y TBT (Lighthouse no mide INP en una carga normal: usa TBT como aproximación o el modo Timespan interactuando).',
  'Al terminar «npm run build», Vite lista los archivos con su tamaño gzip. Si el JS principal pasa de unos 300 kB gzip: «npm install -D rollup-plugin-visualizer», añádelo a los plugins de vite.config.ts y reconstruye. Abre stats.html: los rectángulos más grandes son los culpables (una librería de fechas entera, iconos…).',
  '«const DetalleMascota = lazy(() => import("./paginas/DetalleMascota"));» y en la ruta «element: <Suspense fallback={<Esqueleto />}><DetalleMascota /></Suspense>». Hazlo con las páginas que no se usan al entrar (informes, administración). Reconstruye: el archivo principal debe ser más pequeño y aparecer archivos nuevos por página.',
  'Network en «Slow 3G», recarga y mira la pantalla: ¿algo se mueve cuando llegan los datos (la tabla empuja el pie, una imagen sin tamaño aparece de golpe)? Arreglos: esqueletos con la misma altura que el contenido final, «width» y «height» en las imágenes y un min-height en los contenedores que se rellenan después.',
  'Mismo modo y mismas condiciones que la primera medición. Tabla: | Métrica | Antes | Después |. Si alguna empeoró (por ejemplo, el LCP al hacer lazy la página de inicio), revisa qué cambió: nunca hagas lazy de lo que se ve nada más entrar.'
],

'w21d6': [
  'Por cada cambio, una ficha con las cinco partes. Ejemplo: Síntoma (la agenda tenía un p95 de 1,2 s) · Diagnóstico (Seq Scan en cita según EXPLAIN) · Cambio (índice (veterinario_id, inicio)) · Resultado (p95 de 180 ms con la misma carga) · Coste (+40 MB de índice, inserciones un 3 % más lentas). Si falta alguna, el cambio no está justificado.',
  'Lista de descartes con su motivo: «Redis para la agenda: descartado, el p95 ya cumple sin él y añade una pieza más que operar». «Desnormalizar el nombre del dueño en cita: descartado, el JOIN cuesta 0,3 ms». Esta sección demuestra que sabes decir que no.',
  'Escribe qué creías y qué resultó: «Creía que la serialización JSON era el cuello de botella; medido: 4 ms de 300». «Creía que la cache ayudaría mucho; medido: un 12 %». Que tu intuición falló y lo descubriste midiendo es exactamente lo que da credibilidad al informe.',
  'Recorre la lista punto por punto con su evidencia: enlace a la sección, comando ejecutado o captura. Si algún punto no tiene evidencia (por ejemplo, Lighthouse solo «después»), hazlo ahora antes de dar el informe por cerrado.',
  'Usa el mismo comando de bombardier del día 2 (misma concurrencia, misma duración, mismos datos) contra cada endpoint de la tabla. Si los números difieren más de un 10–15 % de los del informe, averigua qué cambió en el código o en los datos y actualiza el informe.',
  'Las cinco partes en 3 minutos: síntoma («la recepcionista esperaba más de 1 s»), cómo lo mediste (bombardier y pg_stat_statements), qué encontraste (Seq Scan), qué cambiaste (índice multicolumna) y cuánto mejoró (1,2 s → 180 ms). Con números concretos. Grábate.'
],

/* ---------- Semana 22 ---------- */

'w22d1': [
  'Busca «Log» seguido de «$"» o de «+»: «_logger.LogInformation($"Cita {id} creada")». Cambia a plantilla: «_logger.LogInformation("Cita {CitaId} creada para {VeterinarioId}", id, vetId);». Así CitaId queda como un campo consultable y no como texto mezclado.',
  'Guía: Debug (detalle para desarrollo), Information (algo normal del negocio: cita creada), Warning (algo raro pero gestionado: fallback del correo, petición lenta), Error (falló una operación: excepción no controlada). Un 409 por solape es Information, no Error: es un caso normal del negocio.',
  '«app.Use(async (ctx, next) => { using (logger.BeginScope(new Dictionary<string, object> { ["CorrelacionId"] = Activity.Current?.TraceId.ToString() ?? ctx.TraceIdentifier })) await next(); });». Activa los scopes en la consola: «builder.Logging.AddJsonConsole(o => o.IncludeScopes = true);». Haz una petición: todas sus líneas deben tener el mismo CorrelacionId.',
  'En tu manejador de errores: «problem.Extensions["correlacionId"] = Activity.Current?.TraceId.ToString();». Provoca un error y copia el correlacionId de la respuesta. Búscalo en la consola: debe encontrar todas las líneas de esa petición. Así soporte puede pedir ese código al usuario.',
  'Busca en las llamadas al logger: Email, Nombre, Telefono, Diagnostico, Token, Password, Authorization. Sustituye cada uno por su id. Revisa también las excepciones: «throw new X($"El dueño {email} …")» acaba en el log; usa el id también ahí.'
],

'w22d2': [
  '«var meter = new Meter("VetCare.Api"); var duracion = meter.CreateHistogram<double>("http.duracion", "ms"); var peticiones = meter.CreateCounter<long>("http.peticiones");». En el middleware: «duracion.Record(ms, new("ruta", plantillaRuta), new("resultado", status >= 500 ? "error" : "ok"));». Separar ok y error evita que los errores rápidos parezcan una mejora de latencia.',
  '«var citasCreadas = meter.CreateCounter<long>("vetcare.citas.creadas"); var citasRechazadas = meter.CreateCounter<long>("vetcare.citas.rechazadas");» con la etiqueta «motivo» (solape, validación). Incrementa en el caso de uso. Si un día las citas creadas caen a cero a las 11:00, algo va mal aunque la API responda 200.',
  'El pool de conexiones de Npgsql: el máximo por defecto es 100 (Maximum Pool Size). Npgsql publica métricas propias (conexiones en uso, peticiones esperando). Si no las ves, mide el tiempo de obtener conexión. Saturación = peticiones esperando a que haya una conexión libre.',
  'Revisa cada etiqueta: «ruta» con la plantilla («/api/citas/{id}») → unas 20 rutas: bien. «ruta» con la URL real («/api/citas/3f2a…») → una serie por cita: mal. «usuarioId» → miles de valores: fuera. «status» con 5 o 6 valores: bien.',
  'Tabla: | Nombre | Tipo (contador, histograma, gauge) | Etiquetas | Pregunta que responde |. Ejemplo: «http.duracion | histograma | ruta, resultado | ¿Los usuarios esperan más de lo prometido?». Si no se te ocurre una pregunta para alguna métrica, bórrala.'
],

'w22d3': [
  'Paquetes: OpenTelemetry.Extensions.Hosting, OpenTelemetry.Instrumentation.AspNetCore, OpenTelemetry.Instrumentation.Http, Npgsql.OpenTelemetry y OpenTelemetry.Exporter.OpenTelemetryProtocol. «builder.Services.AddOpenTelemetry().WithTracing(t => t.AddAspNetCoreInstrumentation(o => o.Filter = ctx => !ctx.Request.Path.StartsWithSegments("/health")).AddHttpClientInstrumentation().AddNpgsql().AddOtlpExporter());».',
  'Panel de Aspire: «docker run --rm -it -p 18888:18888 -p 4317:18889 mcr.microsoft.com/dotnet/aspire-dashboard». Exportador: «OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317». Abre localhost:18888 (el token aparece en el log del contenedor). En Traces, abre una y fíjate en cuántas consultas SQL hay dentro.',
  '«static readonly ActivitySource Fuente = new("VetCare.Application");» y en el caso de uso: «using var act = Fuente.StartActivity("AgendarCita"); act?.SetTag("vetcare.veterinario_id", cmd.VeterinarioId); act?.SetTag("vetcare.duracion_min", cmd.Duracion);». Registra la fuente: «t.AddSource("VetCare.Application")». Usa ids, nunca nombres ni emails.',
  'En el visor, ordena por duración y abre la más lenta. La barra más larga es donde se fue el tiempo: ¿una consulta SQL, una llamada externa o un hueco sin tramo (código de la aplicación)? Escribe: «Creía que era la base; en realidad, 70 % en la llamada al servicio de correo».',
  'Opción sencilla: genera el traceparent en el navegador («00-<32 hex>-<16 hex>-01») y mándalo en cada fetch como cabecera. Opción completa: el SDK web de OpenTelemetry (@opentelemetry/sdk-trace-web con instrumentación de fetch). Si la API recibe traceparent, su traza continúa el mismo traceId: compruébalo en el visor.'
],

'w22d4': [
  'Agendar cita: «SLI = POST /api/citas con respuesta 2xx o 4xx esperado (409, 422) en menos de 1 s / todas las POST /api/citas». Los 409 cuentan como buenos porque el sistema funcionó bien. Los 5xx y las lentas cuentan como malas. Escribe la fórmula para cada operación y qué queda fuera del denominador (por ejemplo, las peticiones de health).',
  'SLO 99,5 % en 30 días → presupuesto 0,5 % = 0,005 × 43.200 min ≈ 216 min al mes. En peticiones: con 20.000 al mes, 100 peticiones malas. Escribe los dos números. «Tenemos 3,6 horas de margen al mes» se entiende mucho mejor que «99,5 %».',
  'Rápida (página): consumo de presupuesto 14× más rápido de lo normal durante 1 h (confirmado en los últimos 5 min) → se agota en unos 2 días, actúa ya. Lenta (ticket): 6× durante 6 h (confirmado en 30 min) → revisar en horario laboral. Escribe la condición exacta, a quién avisa y por qué canal.',
  'Para cada alerta existente pregunta: si suena, ¿algún usuario lo nota? «CPU por encima del 80 %» → no necesariamente → bórrala o pásala a un panel. «Error de agendar por encima del 2 % durante 5 min» → sí → se queda. Apunta qué borraste y por qué.',
  'Lista: | Causa | Consumo estimado | Por qué se acepta |. Ejemplo: «Despliegue con corte de unos 30 s | 0,5 min por despliegue × 8 al mes = 4 min | más barato que montar despliegue sin corte con 4 clínicas». Así nadie se sorprende cuando el presupuesto baje.'
],

'w22d5': [
  'Nivel 1, cuatro gráficos y nada más: tasa de peticiones, tasa de error (%), latencia p95 y saturación (conexiones del pool). Encima, el estado del SLO. Debe responder en 5 segundos «¿está roto ahora?». Usa el panel de Aspire o Grafana con Prometheus, lo que tengas.',
  'Nivel 2: las mismas señales por endpoint (¿dónde está roto?). Nivel 3: por dependencia (base, correo) y trazas de ejemplo (¿por qué?). Cuando no puedas construir un gráfico porque no existe la métrica, apúntalo: «falta latencia por dependencia» y vuelve a instrumentar.',
  'Estructura: Síntoma (qué alerta sonó) · Impacto (qué no pueden hacer los usuarios) · Diagnóstico (pasos numerados: 1. mira el nivel 2: ¿un endpoint o todos? 2. …) · Mitigación (de más rápida a más lenta: rollback, desactivar la función, escalar) · Verificación (qué gráfico vuelve a verde) · Después (postmortem).',
  'Para «base de datos no disponible»: síntoma (/health/ready en 503, errores 5xx en todos los endpoints), diagnóstico («docker compose ps db», «docker compose logs db», conexiones del pool), mitigación (reiniciar el contenedor, liberar disco si está lleno), verificación (ready en 200, error por debajo del 1 %).',
  '«docker compose stop db» y sigue tu manual paso a paso sin saltarte nada y sin usar lo que ya sabes. Cada paso que no funcione o que no estuviera escrito, corrígelo en ese momento. Al final, «docker compose start db» y comprueba la verificación del manual.'
],

'w22d6': [
  'Si puedes, pide a otra persona que provoque la avería sin decirte cuál. Si lo haces tú, elige una al azar (escribe las cuatro en papeles) y espera unos minutos usando la web normalmente antes de mirar el panel, como pasaría en la realidad.',
  'Pon el cronómetro cuando notes el síntoma. Usa solo el panel, los logs y las trazas, sin abrir el código ni la configuración. Anota cada paso y su hora: «10:03 alerta de error, 10:05 el nivel 2 muestra que solo falla POST citas, 10:09 la traza indica timeout esperando conexión → pool».',
  'Lleva el manual abierto y marca cada paso: ✓ sirvió, ✗ no sirvió, + faltaba. Al terminar, edita el manual con todo lo marcado. Ejemplo: «+ Añadir: comprobar el tamaño del pool en la configuración antes de mirar la base».',
  'Secciones: Resumen · Cronología (con horas) · Impacto (usuarios, duración, presupuesto consumido) · Causa raíz · Por qué no lo detectamos antes · Qué funcionó bien · Acciones (cada una con responsable y fecha). Sin culpables: «la configuración permitía un pool de 2», no «yo puse mal el pool».',
  'Recorre la lista con su evidencia: captura del panel en tres niveles, nombres de las métricas, enlace a los dos manuales, la definición del SLO, las dos alertas escritas y el postmortem. Lo que no puedas enseñar, hazlo antes de cerrar la semana.',
  'Cinco partes en 3 minutos: qué pasó, cómo te enteraste (qué alerta o gráfico), cómo lo diagnosticaste (el camino por los tres niveles), qué hiciste para mitigar y qué cambiaste para que no vuelva. Incluye el tiempo que tardaste. Grábate.'
],

/* ---------- Semana 23 ---------- */

'w23d1': [
  'Los cinco pasos con sus tiempos en una entrevista de 45 minutos: 1) aclarar requisitos (5 min), 2) estimar (5 min), 3) diseño de alto nivel (10 min), 4) profundizar en lo difícil (15 min), 5) compromisos y cierre (5–10 min). Escríbelos en una tarjeta y míralos antes de cada práctica.',
  'Preguntas: ¿cuántos usuarios por clínica y cuántas citas al día? ¿Los dueños usan el sistema o solo el personal? ¿Hay requisitos legales sobre los datos médicos? ¿Qué disponibilidad se espera? ¿Comparten datos las clínicas? Suposiciones por defecto: «si no me contestan, asumo 5 usuarios y 40 citas al día por clínica, solo personal, 99,5 %».',
  'Acortador de URLs: ¿cuántas URLs nuevas al día y cuántas visitas? ¿Las URLs caducan? ¿Alias personalizados? ¿Estadísticas de clics? Reservas de restaurante: ¿cuántos restaurantes? ¿Hay que impedir reservas dobles de la misma mesa? ¿Pagos? Diez minutos cada uno, con cronómetro.',
  'Dos columnas. Funcionales: ¿quiénes son los usuarios? ¿Cuál es la operación principal? ¿Qué queda fuera? No funcionales: escala (usuarios, operaciones por segundo), proporción de lecturas y escrituras, latencia aceptable, consistencia frente a disponibilidad, retención de datos, región. Esa es tu plantilla para cualquier enunciado.',
  'Graba 3 minutos diciendo «Antes de diseñar, me gustaría aclarar…» y haz tus preguntas como si alguien respondiera. Si nadie responde, di la suposición en voz alta: «Asumo 200 clínicas con 40 citas al día cada una; si no es así, lo ajusto». Escúchate: ¿suenan a conversación o a lista leída?'
],

'w23d2': [
  'Proporciones clave: memoria unos 100 ns, SSD unos 100 µs (×1.000), red en el mismo centro de datos unos 0,5 ms, entre continentes unos 150 ms. Un servidor web aguanta miles de peticiones por segundo; PostgreSQL bien indexado, miles de consultas simples por segundo. Un día ≈ 100.000 segundos (para cuentas rápidas).',
  'Con tus suposiciones: 200 clínicas × 40 citas al día = 8.000 citas al día. Lecturas: unas 10 por cita → 80.000 al día ÷ 100.000 s ≈ 1 petición por segundo de media; el pico (×10) ≈ 10 por segundo. Escribe cada suposición y luego compara con el ejemplo.',
  '5.000 clínicas → 200.000 citas al día → unas 25 peticiones por segundo de media, unas 250 en el pico. Almacenamiento: 1 KB por cita × 200.000 × 365 ≈ 73 GB al año. Sigue cabiendo en un PostgreSQL bien configurado; lo que cambia antes es el número de conexiones y la necesidad de réplicas de lectura. Escribe en qué punto exacto cambia.',
  'Ejemplo: 2 fotos por visita × 2 MB × 8.000 visitas al día ≈ 32 GB al día ≈ 11 TB al año. En almacenamiento de objetos, a unos 0,02 $ por GB al mes, eso son unos 230 $ al mes el primer año. En la base de datos multiplicaría el tamaño de las copias y el tiempo de restauración. Con números, la decisión se defiende sola.',
  'Cuatro secciones con una conclusión de una frase cada una. Tráfico: «pico de 10 peticiones por segundo: una instancia sobra». Almacenamiento: «3 GB al año de datos: una base pequeña; las imágenes van fuera». Ancho de banda: «dominado por las imágenes: conviene un CDN». Memoria: «toda la agenda activa cabe en unos MB de caché».'
],

'w23d3': [
  'Busca «static» en campos que no sean readonly ni constantes, diccionarios de instancia en servicios singleton, IMemoryCache, sesiones en memoria y escrituras en disco local («File.Write», «Path.GetTempPath»). Haz una lista: «ContadorPeticiones: static int → el número se divide entre instancias».',
  'Para cada uno decide: mover fuera (sesiones, archivos subidos → base de datos u objetos) o justificar (caché del catálogo: cada instancia tiene la suya y puede tardar hasta 30 min en actualizarse). Escribe el porqué en una línea: «aceptable: el catálogo cambia una vez al mes».',
  'En compose duplica el servicio: api1 en el puerto 8081 y api2 en el 8082 (o usa «deploy: replicas: 2» con un proxy delante). Alterna peticiones: login en la 8081 y luego consulta con la misma cookie en la 8082. Si falla, algo vive en memoria de una sola instancia (por ejemplo, la clave de firma generada al arrancar).',
  'Tabla en orden: | Capa | Técnica | A partir de qué medición | Consecuencia |. Ejemplo: «API | 2.ª instancia + balanceador | CPU por encima del 70 % sostenido en el pico | hay que sacar las sesiones de la memoria». «Base de datos | réplica de lectura | conexiones por encima del 80 % del máximo | retardo de replicación en las lecturas».',
  'Problema: el usuario crea una cita (escribe en la principal) y la lista se lee de la réplica, que va 200 ms por detrás → no ve su cita. Soluciones: devolver la cita creada en la respuesta del POST y añadirla a la caché del cliente (lo que ya haces con React Query), o leer de la principal durante unos segundos después de escribir.'
],

'w23d4': [
  'Tabla: | Dato | Consistencia | Por qué |. «Huecos de la agenda | fuerte | una cita doble es un perro esperando y un conflicto con el cliente». «Historial médico | fuerte | un veterinario no puede decidir con datos viejos». «Contador de citas del mes en el panel | eventual (5 min) | es informativo».',
  'Secuencia: hilo A lee los huecos (libre) → hilo B lee los huecos (libre) → A inserta la cita de las 10:00 → B inserta la cita de las 10:00 → hay dos citas. Las dos comprobaciones fueron correctas en su momento; el problema es el tiempo entre comprobar y escribir. Solo la constraint de la base, que comprueba y escribe a la vez, lo impide.',
  'Para cada dato «fuerte» de tu tabla, escribe dónde está protegido: «sin solapes → ex_cita_sin_solape (exclusion constraint)», «email único → uq_dueno_email_lower», «factura y líneas juntas → transacción en FacturarCaso.cs». Si solo está en un if de C#, añade la protección en la base.',
  'Un número por dato: «contador del panel: hasta 5 min», «estadísticas mensuales: hasta 1 h», «nombre del dueño en un listado tras editarlo: hasta 30 s». Si alguien se queja de que un dato está viejo, ese número decide si es un bug o el comportamiento acordado.',
  'Plantilla: «CAP dice que, cuando la red se parte y unos nodos no pueden hablar con otros, hay que elegir entre responder con datos que pueden estar desactualizados (disponibilidad) o rechazar la operación (consistencia). Sin partición, no hay que renunciar a nada. En VetCare, para la agenda elijo consistencia: mejor un error que una cita doble».'
],

'w23d5': [
  'Las piezas: balanceador, caché distribuida (Redis), cola de mensajes, CDN, réplicas de lectura y almacenamiento de objetos. Tabla: | Pieza | Hoy | 200 clínicas | 5.000 |. Ejemplo: «Redis | no | no | quizá». «Objetos | sí (imágenes) | sí | sí». La mayoría de los «no» de hoy son la respuesta correcta.',
  'Para cada «no», el umbral concreto: «Redis: cuando haya 3 o más instancias de la API y la caché local cause inconsistencias visibles». «Cola: cuando el outbox procese más de 100 mensajes por segundo o haya varios consumidores». «Réplica: cuando las conexiones de la principal superen el 70 % en el pico».',
  'Diseño: la base guarda solo los metadatos (id, visita_id, clave del objeto, tipo, tamaño). Para subir: la API autoriza y devuelve una URL prefirmada (válida 5 min) y el navegador sube el archivo directamente al almacenamiento. Para ver: la API comprueba la pertenencia y devuelve otra URL prefirmada de lectura. El archivo nunca pasa por tu API.',
  'Columna nueva en la tabla: Mantenimiento. «Redis: actualizaciones, memoria, qué pasa si se cae (¿la API funciona sin él?), monitorización». «Cola: mensajes atascados, reintentos, mensajes venenosos, otra pieza más en las guardias». Si el mantenimiento pesa más que el beneficio, la respuesta es no.',
  'Estructura: «Hoy no: ya tengo un outbox en PostgreSQL que me da envío garantizado en la misma transacción, y a 8.000 citas al día procesa los mensajes de sobra. Añadiría una cola cuando haya varios consumidores distintos o pase de unos cientos de mensajes por segundo, y lo haría manteniendo el outbox como origen».'
],

'w23d6': [
  'Temporizador de 45 min, papel o una pizarra digital y graba el audio. Pasos con sus tiempos: aclarar (5), estimar (5), alto nivel (10), profundizar (15), compromisos (5–10). Si te atascas, di en voz alta qué estás pensando y pasa al siguiente paso: dejar de hablar es peor que equivocarse.',
  'Pasa a limpio las cinco secciones en el documento con lo que dijiste, no con lo que deberías haber dicho. Después compáralo con el ejemplo y anota las diferencias aparte: «no estimé el ancho de banda», «no hablé del retardo de replicación».',
  'Elige uno que nunca hayas diseñado y pon 30 minutos (paso 4 más corto). El objetivo es usar la misma plantilla de preguntas y la misma forma de estimar en un dominio nuevo. Si te bloqueas más que con VetCare, anota en qué paso.',
  'Cada punto con su enlace a la sección o el archivo. Lo que falte o esté a medias, complétalo hoy: la semana 24 se apoya en todo esto.',
  'Tres minutos solo sobre compromisos: «elegí consistencia en la agenda a costa de rechazar citas si la base no responde», «las imágenes fuera de la base a costa de gestionar URLs prefirmadas», «no añadí Redis a costa de cachés locales que pueden ir desfasadas». Admitir lo que sacrificas es lo que distingue a alguien que entiende de alguien que memorizó.',
  'Durante la práctica, cada vez que te quedes en blanco, apunta una palabra al margen. Al final, conviértelas en preguntas: «¿cómo particionaría la base de citas por clínica?», «¿qué pasa con las zonas horarias entre clínicas?». Guárdalas: son el material de estudio de la semana 24.'
],

/* ---------- Semana 24 ---------- */

'w24d1': [
  'Elige uno que no hayas practicado en la semana 23. Si hiciste el acortador, elige la biblioteca o los pedidos de comida. Escribe el enunciado en una línea encima de la hoja antes de poner el temporizador.',
  'Apunta las horas límite antes de empezar: «inicio 10:00 → aclarar hasta 10:05 → estimar hasta 10:10 → alto nivel hasta 10:20 → profundizar hasta 10:35 → compromisos hasta 10:45». Si a las 10:05 sigues preguntando, haz suposiciones y avanza.',
  'Escribe mientras hablas: cajas y flechas, números al margen, preguntas con interrogación. No lo pases a limpio después. Si puedes, graba el audio: lo usarás en el día 5.',
  'Busca la invariante que, si se rompe, el sistema no sirve. Biblioteca: «un ejemplar no puede estar prestado a dos personas a la vez». Acortador: «un código corto nunca puede apuntar a dos URLs distintas». Pedidos: «un pedido pagado no puede perderse». Dilo en voz alta y profundiza ahí.',
  'Subraya en tu documento cada decisión y marca si tiene un número detrás: «una instancia (pico de 15 peticiones/s)» ✓ frente a «uso Redis» ✗. Si hay menos de la mitad con número, rehaz la estimación del paso 2 con más detalle y vuelve a justificar.',
  'Lista aparte: pregunta, en qué paso apareció y por qué te bloqueó. Ejemplo: «paso 4: cómo generar códigos cortos únicos sin colisiones entre varias instancias». Júntala con las tres de la semana 23.'
],

'w24d2': [
  'Junto a cada path de openapi.yaml, un comentario «# consumido por: web, cli» o «# consumido por: nadie». Para saberlo, busca la ruta en web/src y en src/VetCare.Cli. Los que tienen consumidores necesitan cuidado; los que no, puedes cambiarlos libremente.',
  'Cambio candidato: «GET /api/citas/{id}» devuelve hoy «veterinarioId» y el frontend hace otra petición para el nombre. Cambio: devolver «veterinario: { id, nombre }». Otros candidatos: renombrar un campo mal nombrado o cambiar el formato de una fecha.',
  'Clasificación: añadir un campo opcional no rompe nada; quitar o renombrar un campo, cambiar su tipo o hacerlo obligatorio en la entrada sí rompe. Si rompe: fase 1 (añadir el nuevo y mantener el viejo, fecha), fase 2 (migrar a los consumidores, fecha), fase 3 (quitar el viejo, fecha). Escribe las fechas antes de programar.',
  'En el DTO: «Guid VeterinarioId, VeterinarioResumen Veterinario». En openapi.yaml, en el campo viejo: «deprecated: true» y «description: "Obsoleto. Usa veterinario.id. Se retira el 2026-12-01"». Los dos campos conviven: ningún cliente actual se rompe.',
  '«var usoObsoleto = meter.CreateCounter<long>("vetcare.api.campo_obsoleto");». Como la API no sabe qué campos lee el cliente, mide quién sigue en la versión vieja: los clientes nuevos mandan una cabecera «X-Cliente-Version» y cuentas las peticiones sin ella o con la versión vieja. Cuando el contador llegue a cero durante 2 semanas, puedes retirarlo.',
  '«[Fact] public async Task VeterinarioId_SigueExistiendo_HastaLaFechaDeRetirada() { if (DateTime.UtcNow >= new DateTime(2026, 12, 1)) return; var json = await client.GetStringAsync("/api/citas/…"); json.Should().Contain("\\"veterinarioId\\""); }». Si alguien lo borra antes de tiempo, el test se pone rojo.'
],

'w24d3': [
  'Conteos: «SELECT \'dueno\', count(*) FROM dueno UNION ALL SELECT \'mascota\', count(*) FROM mascota UNION ALL SELECT \'cita\', count(*) FROM cita UNION ALL SELECT \'factura\', count(*) FROM factura;». Apunta también un dato concreto, por ejemplo el nombre de una mascota en concreto, para comprobarlo después.',
  '«docker compose exec -T db pg_dump -U postgres -Fc vetcare > respaldo.dump» y «ls -lh respaldo.dump». Con 50.000 citas debería ocupar varios MB. Si ocupa unos pocos KB, probablemente has volcado otra base (revisa el nombre) o el comando ha fallado y solo has guardado el mensaje de error.',
  'Pon el cronómetro: «docker compose down -v», «docker compose up -d db», espera a que esté healthy, «docker compose exec -T db pg_restore -U postgres -d vetcare --clean --if-exists < respaldo.dump», levanta el resto y entra a la agenda. Para el cronómetro cuando veas tus citas. Ese es tu RTO medido.',
  'Repite los conteos y compáralos. Luego: «\\d cita» debe listar ex_cita_sin_solape. Prueba real: crea por la API una cita que se solape con otra → debe dar 409. Si da 201, la restauración no recuperó las constraints (o restauraste solo los datos).',
  'Secciones: RPO («hasta 24 h de datos perdidos: copia diaria a las 02:00»), RTO prometido (por ejemplo, 1 h) y medido (por ejemplo, 6 min), procedimiento numerado con los comandos exactos y tabla de retención: | Dato | Cuánto tiempo | Motivo | (historial médico X años según la normativa, logs 30 días, copias 30 días…).',
  'Comando o endpoint de administrador «anonimizar dueño {id}»: sustituye nombre, email y teléfono por valores neutros («Anonimizado-<id>»), conserva ids y facturas, e inserta en anonimizacion_aplicada (dueno_id, fecha, quien). Test: crea un dueño con una factura, anonimízalo, y comprueba que la factura existe y que el email ya no aparece en ninguna tabla.'
],

'w24d4': [
  'Orden: qué es VetCare en 2 líneas (el problema, no la tecnología) → una captura buena → arranque en 3 comandos → qué demuestra este proyecto (enlaces a ADR, informe de rendimiento, postmortem, modelo de amenazas) → stack → estado. Mueve todo lo largo a docs/ y enlázalo.',
  'Clona en /tmp en una carpeta nueva y sigue el README sin usar nada que sepas de memoria. Cada vez que adivines algo, anótalo: «no dice que hay que crear el .env», «no dice qué puerto abrir». Corrige el README, borra la carpeta y repite hasta que salga limpio.',
  '«ls docs/ docs/adr/» y compara con la lista. Busca documentos a medias: «grep -rl -i "TODO\\|pendiente\\|TBD" docs/». Para cada uno: complétalo o bórralo y quita su enlace. Un documento vacío da peor impresión que no tenerlo.',
  'Informe de rendimiento: cada cambio con antes y después medido. Postmortem: sin culpables, con acciones con fecha. ADR: cada uno con al menos dos alternativas descartadas y su motivo. Léelos como si fueras un entrevistador con 2 minutos para cada uno: ¿se entiende la conclusión en el primer párrafo?',
  'STAR: Situación (VetCare, la agenda iba lenta con 50.000 citas) · Tarea (bajar el p95 por debajo de 300 ms) · Acción (medí con bombardier, encontré el Seq Scan con EXPLAIN, creé el índice multicolumna) · Resultado (1,2 s → 180 ms). Otra historia buena: el incidente simulado. Cronométrate: unos 2 minutos cada una.',
  'Tres listas cortas. Hecho: lo principal con enlaces. No hecho a propósito: «sin app móvil», «sin multiclínica: decisión del ADR-003». Límite conocido: «una sola instancia de base; a partir de unas 5.000 clínicas necesitaría réplicas (ver diseño a escala)».'
],

'w24d5': [
  'Cronómetro de 2 minutos por pregunta, sin papel. Si te trabas, no releas la respuesta modelo: escribe una palabra («números», «alternativa», «cierre») y vuelve a empezar. A la tercera vuelta debería salir de corrido.',
  'Graba con el móvil «háblame de tu proyecto» en 2 minutos. Al escucharte, cuenta las muletillas («eh», «o sea», «básicamente») y las frases que empiezas sin saber cómo acabarlas. Repite una vez intentando reducir las dos cosas a la mitad.',
  'Ejemplo con «¿qué es un índice?»: respuesta («una estructura que permite encontrar filas sin leer toda la tabla»), porqué («evita el Seq Scan; en VetCare pasó de 210 ms a 0,8 ms»), compromiso («ocupa espacio y ralentiza las escrituras») y silencio: te callas y dejas que pregunten. Practicar el silencio es lo difícil.',
  'Para cada pregunta que te bloqueó: escribe la respuesta con la misma estructura de cuatro pasos y un ejemplo de VetCare o del dominio nuevo. Si no sabes responderla, estúdiala ahora (30 minutos como máximo por pregunta) y escribe la respuesta con tus palabras.',
  'Formato: «No tengo experiencia real con X; lo más cercano que hice fue Y; para cubrirlo estoy haciendo Z». Ejemplo: «No he operado Kubernetes en producción; desplegué con Docker Compose y CI; mi plan es montar un clúster local con kind el próximo mes». Dos huecos, sin justificarte.',
  'Dale la lista a alguien (o usa un generador aleatorio de números) para que elija 3 preguntas sin avisarte. Contesta con cronómetro. Después pregúntale qué entendió de cada respuesta. Si no tienes a nadie, mete las preguntas en papeles y saca tres al azar.'
],

'w24d6': [
  'Temporizador de 45 minutos, un enunciado que no hayas practicado nunca y nada abierto: ni notas, ni el ejemplo, ni internet. Graba el audio. Si dejas esta parte para después, perderás lo único que mide si el método ya es tuyo.',
  'Puntúa cada uno de los 14 puntos solo con lo que hay en tu hoja y en la grabación, no con lo que pensaste pero no dijiste. En la duda, no lo marques. Anota junto a cada punto fallado qué faltó.',
  'Ejecuta en el momento: clonar y levantar desde cero, «dotnet test», «npx tsc -b», el pipeline de CI en verde, «/health/ready», la restauración de la copia. Marca solo lo que acabas de ver funcionar hoy.',
  'Cada casilla sin marcar se convierte en una tarea con un verbo: «Añadir .env.example con JWT_CLAVE», «Arreglar el test intermitente de paginación». Ordénalas por impacto para alguien que llega mañana: primero lo que impide arrancar el proyecto, luego lo que se ve primero y por último lo cosmético.',
  'Para cada hueco (de la rúbrica, de la entrevista o de la auditoría): un recurso concreto (un libro, un curso o una documentación con nombre), algo que vas a construir para practicarlo y en qué mes. Proyecto nuevo: uno que ataque tu mayor hueco. Cadencia: «martes y jueves de 19:00 a 21:00 y sábados 2 h».',
  'Crea ahora el evento en tu calendario a 8 semanas: «Revisar plan-continuacion.md: ¿qué cumplí? ¿qué cambio?». Pon un aviso el día anterior. Después crea la etiqueta: «git tag -a v1.0.0 -m "Fin de la ruta de 24 semanas" && git push --tags».'
]

});
