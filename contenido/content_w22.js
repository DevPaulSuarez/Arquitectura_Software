window.WEEKS = (window.WEEKS || []).concat([
{
  n: 22,
  phase: 'Observabilidad',
  title: 'Observabilidad: saber qué pasa cuando no estás mirando',
  idea: 'La semana pasada medías con tu portátil delante y la carga que tú lanzabas. En producción no hay nadie delante. El sistema recibe peticiones a las tres de la madrugada, falla para un usuario concreto con unos datos concretos, y cuando te enteras ya no se puede reproducir. Observabilidad es la diferencia entre poder responder "qué pasó" y tener que decir "no sé, prueba otra vez". Esta semana construyes las tres piezas que te dan esa respuesta: registros que se pueden consultar en vez de leer, métricas que te avisan antes de que el usuario llame, y trazas que siguen una petición por todo el sistema. Y lo más importante: aprendes que la pregunta buena no es "está caído" sino "cuánta gente lo está pasando mal ahora mismo".',
  res: [
    { t: 'Google SRE Book — Monitoring Distributed Systems', u: 'https://sre.google/sre-book/monitoring-distributed-systems/', note: 'El capítulo que define las cuatro señales doradas y la diferencia entre síntoma y causa. Es la referencia que más se cita en entrevistas sobre monitorización.' },
    { t: 'OpenTelemetry — Observability primer', u: 'https://opentelemetry.io/docs/concepts/observability-primer/', note: 'Explica logs, métricas y trazas y cómo se relacionan. Es el estándar que soportan todas las herramientas, así que aprenderlo no te ata a ningún proveedor.' },
    { t: '.NET observability with OpenTelemetry', u: 'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel', note: 'Cómo se instrumenta exactamente en tu stack. Lo usas el día que configures el SDK en VetCare.' },
    { t: 'Google SRE Book — Service Level Objectives', u: 'https://sre.google/sre-book/service-level-objectives/', note: 'SLI, SLO y presupuesto de error. Es el marco que convierte "va bien" en un número con el que se pueden tomar decisiones.' }
  ],
  days: [
    {
      t: 'Registros estructurados: de texto a datos consultables',
      obj: 'Convertir tus registros en eventos con campos consultables y añadir correlación para poder reconstruir una petición completa.',
      why: 'Un registro de texto plano se lee; uno estructurado se consulta. La diferencia entre buscar a ojo en diez mil líneas y filtrar por usuario y código de error en dos segundos es lo que determina si puedes depurar producción o no.',
      study: { r: 1, what: 'Lee la sección de logs del primer de OpenTelemetry y la introducción entera. Unos 12 minutos. Quédate con una idea: un registro es un evento con atributos, no una frase. El texto es para el humano; los atributos son para la máquina que va a filtrar entre millones.',
        pasos: [
          'Lee "What is Observability?" (~3 min): poder hacer preguntas nuevas sin cambiar el código.',
          'Lee "Logs" (~3 min): fíjate en la diferencia entre un log suelto y uno con contexto de traza.',
          'Lee "Spans" y "Span attributes" (~3 min): así se ve un evento con atributos.',
          'Elige tres mensajes de log de VetCare y reescríbelos como plantillas con campos: CitaId, VeterinarioId, DuracionMs.'
        ] },
      ex: {
        title: 'El mismo evento, ilegible y consultable',
        body: `// MAL: todo concatenado en una frase
logger.LogInformation("Error al crear cita para " + mascota.Nombre +
    " el " + inicio + ": " + ex.Message);
// Resultado: una cadena distinta cada vez. No puedes filtrar por
// nada, no puedes contar, no puedes agrupar. Y encima filtra el
// nombre de la mascota, que es dato personal (semana 19).

// BIEN: plantilla fija + atributos estructurados
logger.LogWarning(
    "Cita rechazada por solape {CitaId} {VeterinarioId} {Inicio}",
    citaId, veterinarioId, inicio);
// La plantilla es constante, así que puedes contar cuántas veces
// pasó. Los atributos son campos, así que puedes filtrar por
// veterinario. Y no hay datos personales.

// Niveles con criterio, no al azar:
//   Trace/Debug  solo en desarrollo
//   Information  eventos de negocio: cita creada, sesión iniciada
//   Warning      algo salió mal pero el sistema lo manejó (409, retry)
//   Error        la petición falló y alguien debería mirarlo
//   Critical     el sistema no puede seguir funcionando

// Para que la consola muestre los ámbitos (scopes) y además en JSON:
builder.Logging.AddJsonConsole(o => o.IncludeScopes = true);

// Correlación: un identificador que une todo lo de una petición.
// Ponlo DESPUÉS de UseAuthentication, para que ctx.User ya esté relleno.
app.Use(async (ctx, next) =>
{
    var correlacion = ctx.Request.Headers["X-Correlation-Id"].FirstOrDefault()
                      ?? Activity.Current?.TraceId.ToString()
                      ?? Guid.NewGuid().ToString();

    ctx.Response.Headers["X-Correlation-Id"] = correlacion;

    using (app.Logger.BeginScope(new Dictionary<string, object>
    {
        ["CorrelacionId"] = correlacion,
        // "sub" llega como NameIdentifier (semana 18)
        ["UsuarioId"] = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anónimo",
        ["Ruta"] = ctx.Request.Path.Value ?? ""
    }))
    {
        await next();
    }
});
// Ahora TODOS los registros de esa petición llevan esos tres
// campos sin que tengas que pasarlos a mano.

// Devolver el identificador al cliente en los errores
return Results.Problem(
    title: "No se pudo crear la cita",
    statusCode: 500,
    extensions: new Dictionary<string, object?> { ["correlacionId"] = correlacion });
// El usuario te dice el código y encuentras su petición exacta.`
      },
      steps: [
        'Recorre tus llamadas al logger y convierte toda concatenación en plantilla con atributos. Busca los símbolos de suma y la interpolación de cadenas dentro de llamadas a Log: cada uno es un registro que no vas a poder consultar.',
        'Revisa los niveles que usas. Lo normal es encontrar que todo está en Information, incluidos errores. Reasígnalos según la tabla del ejemplo: el nivel es lo primero por lo que vas a filtrar en una incidencia.',
        'Añade el middleware de correlación con BeginScope. Haz una petición y comprueba en la consola que todas las líneas de esa petición comparten el mismo identificador.',
        'Añade el identificador de correlación a las respuestas de error en el formato problem details que ya usas desde la semana 11. Pruébalo provocando un error y comprueba que el código de la respuesta aparece en los registros.',
        'Repasa una última vez que ningún registro contiene nombres, correos, teléfonos, diagnósticos ni tokens, como decidiste en la semana 19. Identificadores sí, datos personales no.'
      ],
      vet: [
        'Define en docs/observabilidad.md los eventos de negocio de VetCare que siempre se registran: cita creada, cita cancelada, factura emitida, sesión iniciada, sesión fallida, acceso denegado. Con sus atributos exactos.',
        'Haz que el frontend envíe la cabecera X-Correlation-Id generada con crypto.randomUUID en cada petición, para poder seguir una acción del usuario desde el navegador hasta la base de datos.'
      ],
      edge: [
        'La plantilla del mensaje debe ser constante. Si metes un valor variable dentro del texto en vez de como atributo, cada registro es un mensaje distinto y pierdes la capacidad de contar y agrupar, que es casi todo el valor.',
        'Registrar demasiado cuesta dinero y esconde lo importante. Un registro por cada iteración de un bucle convierte tu sistema de logs en ruido caro. Registra decisiones y resultados, no pasos.',
        'No registres dentro de un bucle caliente ni en el camino de una operación que se ejecuta miles de veces por segundo: la escritura de registros es entrada y salida y puede convertirse ella misma en el cuello de botella.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre un registro de texto y uno estructurado?', a: 'El de texto es una frase construida en cada llamada, así que solo se puede leer. El estructurado tiene una plantilla constante y los valores como atributos, así que se puede filtrar, contar y agrupar por cualquiera de esos campos entre millones de eventos.' },
        { q: '¿Para qué sirve un identificador de correlación?', a: 'Para unir todos los eventos que pertenecen a la misma petición, aunque pasen por varios componentes y se escriban en momentos distintos. Sin él, los registros de peticiones concurrentes se entremezclan y reconstruir una sola es imposible.' },
        { q: '¿Por qué devolver el identificador de correlación al cliente en un error?', a: 'Porque convierte un reporte inútil como "no me funciona" en algo accionable: el usuario te da el código y tú encuentras exactamente su petición, con todos sus eventos, sin tener que adivinar cuándo ocurrió.' },
        { q: '¿Qué criterio usas para elegir entre Warning y Error?', a: 'Warning es algo que salió mal pero el sistema manejó correctamente, como un conflicto de solape devuelto como 409 o un reintento que acabó funcionando. Error es una petición que falló y que alguien debería revisar, porque indica un problema que no está contemplado.' }
      ],
      out: 'Registros estructurados con atributos, niveles reasignados, correlación de punta a punta y el identificador visible en las respuestas de error.',
      file: 'docs/observabilidad.md'
    },
    {
      t: 'Métricas y las cuatro señales doradas',
      obj: 'Instrumentar VetCare con métricas de latencia, tráfico, errores y saturación, y entender por qué se miden síntomas y no causas.',
      why: 'Es el vocabulario estándar de la monitorización. Poder decir "mido las cuatro señales doradas y alerto sobre síntomas, no sobre causas" en una entrevista comunica inmediatamente que entiendes operación y no solo desarrollo.',
      study: { r: 0, what: 'Lee el capítulo de Monitoring Distributed Systems del libro de SRE de Google, concretamente la sección de las cuatro señales doradas y la de síntomas frente a causas. Unos 15 minutos. La idea que más te va a servir: alertas sobre lo que el usuario sufre, no sobre lo que a ti te parece preocupante.',
        pasos: [
          'Lee "Symptoms Versus Causes" (~4 min) y copia su tabla de ejemplos.',
          'Lee "Black-Box Versus White-Box" (~3 min).',
          'Lee "The Four Golden Signals" (~5 min): latencia, tráfico, errores y saturación.',
          'Lee "Worrying About Your Tail (or, Instrumentation and Performance)" (~3 min): otra vez la trampa del promedio.',
          'Escribe la métrica concreta de VetCare para cada una de las cuatro señales.'
        ] },
      ex: {
        title: 'Las cuatro señales aplicadas a VetCare',
        body: `// LATENCIA: cuánto tarda, separando éxito de error.
//   Un error rápido y un éxito rápido no son lo mismo:
//   si los mezclas, un montón de 500 instantáneos te mejoran
//   el percentil y creerás que todo va bien.
var latencia = medidor.CreateHistogram<double>(
    "vetcare.peticion.duracion", "ms");

// TRÁFICO: cuántas peticiones por segundo y de qué tipo.
var peticiones = medidor.CreateCounter<long>("vetcare.peticion.total");

// ERRORES: proporción de peticiones fallidas. Proporción, no
// número absoluto: 100 errores con 1000 peticiones es una crisis,
// con 1.000.000 es ruido.
var errores = medidor.CreateCounter<long>("vetcare.peticion.error");

// SATURACIÓN: cuán lleno está el recurso más limitado.
// En VetCare es el pool de conexiones a PostgreSQL, y Npgsql ya lo
// publica como métrica (medidor "Npgsql", db.client.connections.usage):
// solo hay que añadir .AddMeter("Npgsql") al configurar OpenTelemetry
// (día 3). No hace falta escribir nada.

app.Use(async (ctx, next) =>
{
    var inicio = Stopwatch.GetTimestamp();
    try { await next(); }
    finally
    {
        var ms = Stopwatch.GetElapsedTime(inicio).TotalMilliseconds;
        var ruta = ctx.GetEndpoint()?.DisplayName ?? "otro";
        var codigo = ctx.Response.StatusCode;

        var etiquetas = new TagList
        {
            { "ruta", ruta },
            { "codigo", codigo },
            { "exito", codigo < 500 }
        };

        latencia.Record(ms, etiquetas);
        peticiones.Add(1, etiquetas);
        if (codigo >= 500) errores.Add(1, etiquetas);
    }
});

// Métricas de negocio, que valen tanto como las técnicas:
var citasCreadas = medidor.CreateCounter<long>("vetcare.cita.creada");
var citasRechazadas = medidor.CreateCounter<long>("vetcare.cita.rechazada");
// Si las citas creadas caen a cero a las 10 de la mañana, algo
// está roto aunque todas tus métricas técnicas estén en verde.

// CUIDADO con la cardinalidad: esto hunde cualquier sistema
// peticiones.Add(1, new("mascotaId", id));   // 10.000 series
// peticiones.Add(1, new("ruta", ruta));      // 20 series  OK`
      },
      steps: [
        'Instrumenta las cuatro señales en tu API siguiendo el ejemplo. Separa éxito de error en la latencia: es el detalle que más gente olvida y el que más engaños produce.',
        'Añade al menos dos métricas de negocio de VetCare, como citas creadas y citas rechazadas por solape. Son las que te avisan de problemas que ninguna métrica técnica detecta.',
        'Identifica cuál es el recurso más limitado de tu sistema y mide su saturación. En VetCare casi seguro es el pool de conexiones a PostgreSQL.',
        'Revisa cada etiqueta que añades y pregunta cuántos valores distintos puede tener. Si la respuesta es más de unas decenas, quítala: estás creando una serie temporal por cada valor y eso hunde cualquier sistema de métricas.',
        'Escribe en docs/observabilidad.md la lista de métricas con su nombre, tipo, etiquetas y qué pregunta responde cada una. Una métrica que no responde a una pregunta concreta es ruido que pagas.'
      ],
      vet: [
        'Para cada métrica de VetCare escribe la pregunta que contesta. Por ejemplo: cuánta gente está esperando más de lo aceptable para ver la agenda. Si no sabes la pregunta, la métrica sobra.',
        'Añade un contador de accesos denegados por autorización. Un pico ahí puede ser un bug de permisos o un ataque, y en ambos casos quieres saberlo.'
      ],
      edge: [
        'Alerta sobre síntomas y no sobre causas. Una CPU al 90% puede ser normal; el usuario esperando ocho segundos nunca lo es. Las alertas de causa generan ruido y se acaban silenciando, que es lo peor que le puede pasar a una alerta.',
        'La cardinalidad alta es el error que más cuesta dinero en observabilidad. Una etiqueta con identificadores de usuario crea una serie temporal por usuario y puede multiplicar tu factura por mil.',
        'Si mezclas latencia de éxitos y de errores, una avalancha de errores rápidos te baja el percentil y hace que el panel se vea mejor justo cuando el sistema está peor.'
      ],
      quiz: [
        { q: '¿Cuáles son las cuatro señales doradas y qué mide cada una?', a: 'Latencia, cuánto tarda en responder; tráfico, cuánta demanda recibe; errores, qué proporción de peticiones falla; y saturación, cuán lleno está el recurso más limitado. Juntas describen la salud de un servicio desde el punto de vista de quien lo usa.' },
        { q: '¿Por qué alertar sobre síntomas y no sobre causas?', a: 'Porque los síntomas son lo que sufre el usuario y siempre merecen atención, mientras que las causas pueden estar fuera de lo normal sin que nadie lo note. Alertar sobre causas genera avisos que no corresponden a ningún problema real, y las alertas que gritan en falso se acaban ignorando.' },
        { q: '¿Por qué medir la latencia separando éxitos de errores?', a: 'Porque un error devuelto en dos milisegundos entra en la distribución como si fuera una respuesta rapidísima y te mejora el percentil. Si los mezclas, un fallo masivo te puede dejar el panel en verde mientras ningún usuario puede trabajar.' },
        { q: '¿Qué es la cardinalidad y por qué importa tanto?', a: 'Es el número de combinaciones distintas de valores de etiquetas, y cada combinación es una serie temporal que hay que almacenar y consultar. Una etiqueta con identificadores únicos genera millones de series, lo que degrada el sistema de métricas y dispara el coste.' }
      ],
      out: 'Las cuatro señales doradas instrumentadas, dos métricas de negocio, saturación medida y la lista documentada con su pregunta.',
      file: 'docs/observabilidad.md'
    },
    {
      t: 'Trazas distribuidas: seguir una petición entera',
      obj: 'Configurar OpenTelemetry en VetCare para ver una petición dividida en tramos y localizar dónde se va el tiempo sin adivinar.',
      why: 'Las trazas son la pieza que convierte "la agenda va lenta" en "el 80% del tiempo está en esta consulta concreta". Es la herramienta que más acelera un diagnóstico y la que mejor demuestra que sabes operar un sistema con varias piezas.',
      study: { r: 2, what: 'Lee la página de observability con OpenTelemetry en .NET, centrándote en la configuración de tracing y las instrumentaciones automáticas. Unos 15 minutos. La idea clave: una traza es un árbol de tramos, cada tramo tiene duración y atributos, y el contexto se propaga por cabeceras para que varios servicios compartan la misma traza.',
        pasos: [
          'Lee "What is observability?" y "Observability approaches in .NET" (~4 min).',
          'Lee "What is OpenTelemetry?" y ".NET implementation of OpenTelemetry" (~4 min): Activity es el tramo de .NET.',
          'Lee "OpenTelemetry packages" (~3 min) y apunta los paquetes de instrumentación de ASP.NET Core, HttpClient y EF Core o Npgsql.',
          'Revisa "Examples" (~3 min) para ver la configuración completa.',
          'Dibuja el árbol de tramos que esperas ver para crear una cita antes de ejecutarlo, y compara después.'
        ] },
      ex: {
        title: 'De la petición opaca al árbol de tramos',
        body: `// Instalación
// dotnet add package OpenTelemetry.Extensions.Hosting
// dotnet add package OpenTelemetry.Instrumentation.AspNetCore
// dotnet add package OpenTelemetry.Instrumentation.Http
// dotnet add package Npgsql.OpenTelemetry
// dotnet add package OpenTelemetry.Instrumentation.Runtime
// dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol

builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("vetcare-api", serviceVersion: "1.0.0"))
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation(o =>
        {
            // No trazar las comprobaciones de salud: son ruido
            o.Filter = ctx => !ctx.Request.Path.StartsWithSegments("/health");
        })
        .AddHttpClientInstrumentation()   // llamadas salientes
        .AddNpgsql()                      // consultas SQL (necesita using Npgsql;)
        .AddOtlpExporter())
    .WithMetrics(m => m
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation()
        .AddMeter("VetCare.Api")
        .AddMeter("Npgsql")               // uso del pool de conexiones
        .AddOtlpExporter());

// Tramos propios para los trozos que te importan
private static readonly ActivitySource Fuente = new("VetCare.Api");

public async Task<Resultado> AgendarAsync(Comando cmd, CancellationToken ct)
{
    using var tramo = Fuente.StartActivity("AgendarCita");
    tramo?.SetTag("veterinario.id", cmd.VeterinarioId);
    tramo?.SetTag("cita.duracion_min", cmd.DuracionMinutos);

    try
    {
        var r = await _manejador.EjecutarAsync(cmd, ct);
        tramo?.SetTag("resultado", r.Exito ? "ok" : "rechazada");
        return r;
    }
    catch (Exception ex)
    {
        tramo?.SetStatus(ActivityStatusCode.Error, ex.Message);
        throw;
    }
}

// Lo que ves en el visor (Aspire Dashboard o Jaeger):
//
// POST /api/v1/citas ............................. 842 ms
//   |- Auth middleware ............................   4 ms
//   |- SELECT veterinario WHERE id = $1 ..........   3 ms
//   |- SELECT cita WHERE inicio BETWEEN ... ...... 782 ms  <- AQUÍ
//   |- INSERT INTO cita ..........................  12 ms
//   |- POST https://notificaciones/enviar ........  38 ms
//
// 782 de 842 ms en una consulta. Ya no hay nada que adivinar.

# Visor local sin montar infraestructura:
# docker run --rm -p 18888:18888 -p 4317:18889 \\
#   mcr.microsoft.com/dotnet/aspire-dashboard:latest
# y OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
# Abre http://localhost:18888 con el enlace (lleva un token) que el
# contenedor escribe en sus logs al arrancar.`
      },
      steps: [
        'Instala los paquetes de OpenTelemetry y configura tracing y métricas como en el ejemplo. Añade el filtro para no trazar las comprobaciones de salud o te llenarán el visor de ruido.',
        'Levanta el panel de Aspire en Docker o Jaeger, apunta el exportador a él, y haz unas cuantas peticiones desde la web. Abre una traza y mírala: casi siempre ves algo que no esperabas.',
        'Añade tramos propios a las dos o tres operaciones más importantes de VetCare, con atributos útiles. Evita poner identificadores de personas como atributos por lo que viste en la semana 19.',
        'Busca en el visor la petición más lenta de las últimas que hiciste y averigua en qué tramo está el tiempo. Compara ese resultado con lo que tú habrías supuesto antes de mirar.',
        'Haz que el frontend propague el contexto de traza: si envías la cabecera traceparent, la traza empieza en el navegador y acaba en la consulta SQL. Es la vista completa de una acción del usuario.'
      ],
      vet: [
        'Marca en el tramo de agendar si la cita fue rechazada por solape. Te permite buscar directamente todas las trazas de rechazos y ver si hay un patrón por veterinario o por horario.',
        'Comprueba que las llamadas con reintentos de la semana 14 aparecen en la traza como varios tramos. Ver los reintentos dibujados es la forma más rápida de detectar que una dependencia está inestable.'
      ],
      edge: [
        'El muestreo es necesario en producción: trazar el cien por cien de las peticiones de un sistema con mucho tráfico cuesta mucho y aporta poco. Lo habitual es muestrear un porcentaje bajo y siempre el cien por cien de los errores.',
        'No pongas datos personales ni secretos como atributos de un tramo: las trazas se exportan a sistemas externos y suelen tener menos control de acceso que tu base de datos.',
        'Un tramo por cada función convierte la traza en algo ilegible. Crea tramos en las fronteras que importan: entrada, consulta a la base, llamada externa, operación de negocio relevante.'
      ],
      quiz: [
        { q: '¿Qué es una traza y qué es un tramo?', a: 'Una traza es el recorrido completo de una petición por el sistema; un tramo es una operación concreta dentro de ese recorrido, con su duración, sus atributos y su relación padre e hijo. El conjunto de tramos forma un árbol que muestra dónde se consumió el tiempo.' },
        { q: '¿Cómo se relaciona una traza con los registros y las métricas?', a: 'Las métricas te dicen que algo va mal y para cuánta gente, la traza te dice dónde se va el tiempo en una petición concreta, y los registros te dan el detalle de lo que ocurrió en ese punto. El identificador de traza es lo que une las tres vistas.' },
        { q: '¿Por qué se muestrean las trazas en producción?', a: 'Porque generar y almacenar una traza por cada petición de un sistema con mucho tráfico es caro y la mayoría de esas trazas son idénticas y no aportan nada. Lo habitual es muestrear una fracción del tráfico normal y conservar siempre los errores y las peticiones lentas.' },
        { q: '¿Qué ventaja tiene propagar el contexto de traza desde el navegador?', a: 'Que la traza incluye el tiempo que el usuario realmente experimentó, incluida la red y el procesamiento del frontend, no solo lo que tardó el servidor. Así puedes distinguir un problema de backend de uno de red o de renderizado.' }
      ],
      out: 'OpenTelemetry configurado, trazas visibles en un panel, tramos propios con atributos y una petición lenta diagnosticada con datos.',
      file: 'docs/observabilidad.md'
    },
    {
      t: 'SLO, presupuesto de error y alertas que no gritan en falso',
      obj: 'Definir objetivos de nivel de servicio para VetCare y convertirlos en alertas basadas en consumo de presupuesto de error.',
      why: 'Es el concepto que más separa a un desarrollador de alguien que entiende operación. Permite responder con un número a "¿está bien el sistema?" y, sobre todo, a "¿podemos arriesgarnos a desplegar hoy?".',
      study: { r: 3, what: 'Lee el capítulo de Service Level Objectives del libro de SRE, especialmente la parte de presupuesto de error. Unos 15 minutos. Idea central: el objetivo nunca es el cien por cien, porque el cien por cien impide cambiar nada. El margen que te sobra es precisamente tu presupuesto para desplegar y arriesgar.',
        pasos: [
          'Lee "Objectives" y "Agreements" de la terminología (~4 min): SLO frente a SLA.',
          'Lee "Defining Objectives" y "Choosing Targets" (~6 min): por qué el objetivo nunca es el cien por cien.',
          'Lee "Control Measures" y "SLOs Set Expectations" (~4 min).',
          'Calcula tu presupuesto de error: con un SLO del 99,5% mensual, ¿cuántos minutos de fallo te puedes permitir?'
        ] },
      ex: {
        title: 'De SLI a alerta en cuatro pasos',
        body: `# SLO de VetCare

## 1. SLI: qué mides exactamente
Disponibilidad de la agenda:
  peticiones a GET /api/v1/agenda con código < 500
  dividido entre todas las peticiones a GET /api/v1/agenda

Latencia de la agenda:
  peticiones a GET /api/v1/agenda servidas en menos de 300 ms
  dividido entre todas las peticiones a GET /api/v1/agenda

## 2. SLO: el objetivo, en una ventana
  Disponibilidad .... 99.5% en 30 días
  Latencia .......... 95% por debajo de 300 ms en 30 días

## 3. Presupuesto de error: lo que te puedes permitir fallar
  100% - 99.5% = 0.5% de 30 días = 3 h 36 min al mes
  Con 20.000 peticiones al mes: 100 peticiones pueden fallar.

  Si has gastado el 20% del presupuesto: tranquilo, despliega.
  Si has gastado el 90% el día 10: congela cambios y arregla
  fiabilidad en vez de añadir funcionalidades.

## 4. Alertas: por velocidad de consumo, no por umbral puntual

  ALERTA RÁPIDA  (avisar ya, despertar a alguien)
    Si en la última hora se consume el presupuesto a un ritmo
    que lo agotaría en menos de 2 días -> incidente.
    (ratio de error > 7% durante 5 min sostenidos)

  ALERTA LENTA  (ticket, mirarlo mañana)
    Si en las últimas 6 horas el ritmo agotaría el presupuesto
    antes de fin de mes -> degradación silenciosa.
    (ratio de error > 1% durante 6 h)

## Por qué NO alertar así:
  "ratio de error > 0%"        -> suena cada día, se silencia
  "CPU > 80%"                  -> causa, no síntoma
  "una petición tardó > 1 s"   -> siempre hay una
  "p95 > 300 ms ahora mismo"   -> un pico de 30 s no es un problema

## Riesgos aceptados
  - Corte durante el despliegue: un servidor único. Consume
    presupuesto conscientemente, unos 40 s por despliegue.`
      },
      steps: [
        'Define el SLI de tus dos operaciones más importantes de VetCare: la fórmula exacta de buenas entre total. Escribirla como división te obliga a decidir qué cuenta como bueno y qué peticiones entran en el denominador.',
        'Fija el SLO de cada una con su ventana y calcula el presupuesto de error en minutos y en número de peticiones. Ver el presupuesto expresado en minutos al mes cambia por completo la conversación.',
        'Escribe las dos alertas, la rápida y la lenta, con sus condiciones concretas. Dos alertas bien pensadas valen más que veinte que nadie mira.',
        'Repasa cualquier alerta que ya tuvieras y elimina las que avisan de causas en vez de síntomas. Si una alerta no implica que alguien sufre, no debe sonar.',
        'Escribe el apartado de riesgos aceptados: qué cosas sabes que consumen presupuesto y decides tolerar. El corte del despliegue de la semana 20 es el ejemplo más claro.'
      ],
      vet: [
        'Añade un SLO de negocio a VetCare, por ejemplo que el 99% de las citas creadas se confirmen correctamente. Los SLO de negocio detectan fallos que ningún código de estado revela.',
        'Crea en docs/observabilidad.md una tabla con SLI, SLO, presupuesto y las dos alertas de cada operación. Es media página y es lo que te van a pedir que expliques.'
      ],
      edge: [
        'Un SLO del cien por cien es un error conceptual: no deja presupuesto para desplegar, para mantener ni para que falle la red. Si tu objetivo no admite ningún fallo, has prohibido el cambio.',
        'Alertar sobre un umbral instantáneo produce avisos por picos de treinta segundos que no afectan a nadie. Alerta sobre la velocidad a la que consumes presupuesto en una ventana, que es lo que se correlaciona con el daño real.',
        'Una alerta que suena y nadie actúa es peor que no tenerla: entrena al equipo a ignorar las alertas, incluida la que sí importaba. Si no vas a actuar, haz que sea un panel y no una alerta.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre SLI, SLO y presupuesto de error?', a: 'El SLI es la medida, una proporción de eventos buenos sobre el total; el SLO es el objetivo que te fijas para esa medida en una ventana de tiempo; y el presupuesto de error es lo que te sobra hasta el cien por cien, es decir, cuánto te puedes permitir fallar antes de incumplir.' },
        { q: '¿Por qué un SLO del 100% es una mala idea?', a: 'Porque no deja ningún margen: cualquier despliegue, cualquier mantenimiento y cualquier fallo de red lo incumple. El presupuesto de error es precisamente lo que te permite cambiar el sistema, y sin él estás obligado a no tocar nada.' },
        { q: '¿Qué es alertar por velocidad de consumo de presupuesto?', a: 'Es alertar cuando el ritmo al que estás gastando el presupuesto de error, medido en una ventana, llevaría a agotarlo antes de que termine el periodo. Así un pico breve no dispara nada y una degradación sostenida sí, que es exactamente lo que quieres.' },
        { q: '¿Para qué sirve el presupuesto de error en una decisión de producto?', a: 'Para decidir con datos si toca desplegar funcionalidades nuevas o arreglar fiabilidad. Si queda mucho presupuesto, se puede arriesgar; si está casi agotado, la prioridad pasa a estabilizar, y esa conversación deja de ser una discusión de opiniones.' }
      ],
      out: 'SLI y SLO definidos para dos operaciones, presupuesto de error calculado y dos alertas por velocidad de consumo escritas.',
      file: 'docs/observabilidad.md'
    },
    {
      t: 'Paneles y manual de guardia',
      obj: 'Construir un panel que responda preguntas en orden y escribir los procedimientos para las dos incidencias más probables de VetCare.',
      why: 'A las tres de la madrugada nadie razona bien. Un panel ordenado y un manual escrito son la diferencia entre resolver en diez minutos y tardar dos horas. Y tener manuales de guardia escritos es una señal de seniority que muy poca gente puede mostrar.',
      study: { r: 0, what: 'Relee la parte final del capítulo de monitorización del libro de SRE, donde habla de simplicidad y de no acumular señales. Unos 10 minutos. La lección: un panel con cuarenta gráficos no informa de nada. El buen panel contesta pocas preguntas en un orden pensado.',
        pasos: [
          'Lee "As Simple as Possible, No Simpler" (~3 min).',
          'Lee "Tying These Principles Together" (~3 min): las preguntas que debe superar cada alerta.',
          'Lee "Bigtable SRE: A Tale of Over-Alerting" (~3 min).',
          'Ordena las preguntas de tu panel: ¿está afectado el usuario? ¿dónde? ¿desde cuándo? ¿por qué?'
        ] },
      ex: {
        title: 'Un panel en tres niveles y un manual de guardia',
        body: `# Panel de VetCare

## Nivel 1 - ¿Está bien? (4 gráficos, se ve de un vistazo)
  - Peticiones por segundo, apiladas por código de estado
  - Ratio de error de 5xx, con la línea del SLO marcada
  - Latencia p50 / p95 / p99, con la línea del objetivo
  - Presupuesto de error consumido este mes, en porcentaje

## Nivel 2 - ¿Dónde duele? (se abre si el nivel 1 está rojo)
  - Latencia p95 desglosada por endpoint
  - Errores por endpoint y por código
  - Citas creadas por hora (negocio)
  - Accesos denegados por hora (seguridad)

## Nivel 3 - ¿Por qué? (saturación y dependencias)
  - Conexiones del pool en uso frente al máximo
  - Latencia de PostgreSQL y consultas lentas
  - Estado del circuit breaker de notificaciones (semana 14)
  - CPU y memoria del proceso

Regla: si un gráfico no ha ayudado nunca a tomar una decisión,
se borra. Un panel es una herramienta, no un adorno.

================================================================

# Manual de guardia: ratio de error alto en /api/v1/citas

## Síntoma
Alerta rápida: errores 5xx por encima del 7% durante 5 minutos.

## Impacto
La recepción no puede ver ni crear citas. Impacto directo
en la atención del día. Prioridad alta.

## Diagnóstico, en este orden
1. Panel nivel 1: ¿es solo /api/v1/citas o todo?
   -> todo = problema general; solo uno = código de ese endpoint
2. Panel nivel 3: ¿pool de conexiones saturado?
   -> sí = consultas lentas o fuga de conexiones
3. Trazas: abre una petición con error. ¿En qué tramo falla?
4. Registros: filtra por nivel Error en los últimos 15 min.
   Agrupa por plantilla de mensaje. Normalmente hay una que domina.
5. ¿Coincide con un despliegue? Mira la etiqueta de la imagen.

## Mitigaciones, de más rápida a más lenta
  a) Si coincide con un despliegue -> rollback (semana 20).
     Es la acción más rápida y casi siempre la correcta.
  b) Si es saturación del pool -> subir el tamaño del pool y
     reiniciar. Es un parche, no el arreglo.
  c) Si es una dependencia externa -> comprobar que el circuit
     breaker abrió. Si no abrió, revisar su configuración.

## Verificación
Ratio de error por debajo del 1% durante 10 minutos y una cita
creada de punta a punta manualmente.

## Después
Escribir el postmortem. Sin buscar culpables: buscar la causa
y la detección. Dos preguntas obligatorias: por qué pasó, y
por qué tardamos en enterarnos.`
      },
      steps: [
        'Construye el panel de nivel 1 con sus cuatro gráficos. Puedes usar el panel de Aspire, Grafana o lo que tengas: lo que importa es el orden y que sean cuatro, no cuarenta.',
        'Añade los niveles 2 y 3. Te vas a dar cuenta de que te faltan métricas: anótalas y vuelve a instrumentar. Construir el panel es lo que revela que no estabas midiendo.',
        'Escribe el manual de guardia para el ratio de error alto siguiendo la estructura del ejemplo: síntoma, impacto, diagnóstico ordenado, mitigaciones de más rápida a más lenta, verificación y qué hacer después.',
        'Escribe un segundo manual para otra incidencia probable de VetCare, por ejemplo latencia alta o base de datos no disponible. Dos manuales bien escritos cubren la mayoría de lo que te va a pasar de verdad.',
        'Prueba un manual provocando el problema: para el contenedor de PostgreSQL con docker compose stop db y sigue tu propio procedimiento paso a paso. Lo que no funcione, corrígelo. Un manual que no se ha probado es ficción.'
      ],
      vet: [
        'Deja el panel de nivel 1 abierto mientras usas VetCare un rato. Ver tus propias acciones reflejadas en los gráficos es lo que te enseña a leerlos rápido cuando haga falta.',
        'Guarda los dos manuales en docs/guardia/ con un nombre por síntoma, no por causa. En una incidencia buscas por lo que ves, no por lo que todavía no sabes.'
      ],
      edge: [
        'Un panel con demasiados gráficos es un panel que nadie mira. Si no sabes qué decisión tomarías con un gráfico, no debería estar ahí.',
        'Un manual de guardia que nadie ha ejecutado no sirve. Pruébalo provocando el fallo en local, porque siempre falta un paso o un comando está mal.',
        'El postmortem sin culpables no es amabilidad, es eficacia: si la gente teme las consecuencias, oculta información y pierdes la causa real. Lo que se busca es el fallo del sistema, no la persona.'
      ],
      quiz: [
        { q: '¿Por qué organizar un panel en niveles?', a: 'Porque las preguntas tienen un orden natural: primero si hay un problema, luego dónde duele, y solo después por qué. Un panel plano con todo mezclado obliga a buscar entre ruido justo cuando menos tiempo y menos calma tienes.' },
        { q: '¿Qué debe contener como mínimo un manual de guardia?', a: 'El síntoma que lo dispara, el impacto en el usuario, los pasos de diagnóstico en orden, las mitigaciones ordenadas de más rápida a más lenta, cómo verificar que se resolvió y qué hacer después. Todo escrito para alguien recién despertado.' },
        { q: '¿Por qué la primera mitigación suele ser el rollback?', a: 'Porque la causa más frecuente de una incidencia nueva es el último cambio desplegado, y volver atrás es la acción más rápida y predecible. Diagnosticar con calma se hace después de restablecer el servicio, no antes.' },
        { q: '¿Por qué un postmortem no debe buscar culpables?', a: 'Porque si la gente teme las consecuencias oculta detalles y nunca llegas a la causa real, que casi siempre es un fallo del sistema y no de una persona. Las dos preguntas útiles son por qué pasó y por qué tardamos en detectarlo.' }
      ],
      out: 'Panel en tres niveles funcionando y dos manuales de guardia escritos, uno de ellos probado provocando el fallo.',
      file: 'docs/guardia/error-alto-citas.md'
    },
    {
      t: 'Incidente simulado (examen de la semana)',
      obj: 'Provocar una incidencia real en VetCare, diagnosticarla usando solo tus herramientas de observabilidad y escribir el postmortem.',
      why: 'Es el ensayo que hace que la primera incidencia de verdad no sea la primera vez que usas tus herramientas. Y un postmortem escrito es uno de los documentos que más impresiona en una entrevista porque demuestra que has operado algo, no solo construido.',
      study: { r: 0, what: 'Repasa tus dos manuales de guardia y tu panel. Unos 8 minutos. Hoy no aprendes nada nuevo: hoy compruebas si lo que montaste sirve de verdad cuando algo se rompe sin avisar.',
        pasos: [
          'Relee tus dos manuales de guardia de principio a fin.',
          'Abre tu panel y comprueba que cada gráfico responde a una pregunta del manual.',
          'Pide a otra persona que rompa algo sin decirte qué, o rómpelo tú y espera diez minutos antes de mirar.',
          'Durante el diagnóstico apunta la hora de cada paso: luego la usarás en la cronología del postmortem.'
        ] },
      ex: {
        title: 'Postmortem de VetCare',
        body: `# Postmortem - Latencia alta en la agenda
Fecha: 2026-xx-xx
Duración: 18 min (14:02 - 14:20)
Impacto: 340 peticiones por encima del objetivo de 300 ms.
         p95 alcanzó 4.2 s. Nadie reportó el problema.
Presupuesto de error consumido: 12% del mes.

## Cronología
14:02  Despliegue de la versión con el nuevo filtro de búsqueda.
14:04  Panel nivel 1: p95 sube de 115 ms a 3.8 s. Errores en 0%.
14:05  Alerta lenta dispara. (La rápida no, porque no había 5xx:
       el sistema estaba lento, no roto. Aprendizaje.)
14:08  Panel nivel 3: pool de conexiones al 95%. Saturación.
14:11  Traza de una petición lenta: 3.6 s de 3.8 s en un único
       tramo, SELECT sobre cita con ILIKE sin índice.
14:14  Decisión: rollback a la imagen anterior.
14:18  p95 vuelve a 120 ms.
14:20  Verificado con una cita creada de punta a punta. Cerrado.

## Causa raíz
El filtro nuevo generaba ILIKE '%texto%' sobre cita.motivo, sin
índice que lo sirviera (un B-tree normal no vale para ese patrón;
un GIN con pg_trgm sí). Con 50.000 filas obligaba a un
escaneo secuencial por petición, lo que mantenía las conexiones
ocupadas y saturaba el pool.

## Por qué no lo detectamos antes de desplegar
- Se probó en local con 20 filas de datos.
- El CI no tiene una comprobación de rendimiento.
- No se revisó el plan de la consulta nueva.

## Qué funcionó bien
- El panel de nivel 1 mostró el problema en 2 minutos.
- La traza localizó la consulta exacta en 3 minutos.
- El rollback documentado en la semana 20 funcionó a la primera.

## Qué arreglamos
| Acción                                           | Tipo       |
|--------------------------------------------------|------------|
| Índice GIN con pg_trgm para búsqueda por texto   | Causa      |
| Alerta rápida también por latencia, no solo 5xx  | Detección  |
| Datos de volumen realista en el entorno de CI    | Prevención |
| Revisar EXPLAIN de toda consulta nueva en la PR  | Proceso    |

## Lo que aprendimos
Un sistema lento no genera errores, así que una alerta basada
solo en 5xx no lo ve. Lento también es estar caído, solo que
más despacio.`
      },
      steps: [
        'Elige una avería y provócala sin mirar el panel todavía. Opciones buenas: para el contenedor de PostgreSQL, reduce el pool a dos conexiones, añade un retardo artificial en un endpoint, o borra un índice que creaste en la semana 21.',
        'Diagnostica usando solo tus herramientas, sin mirar el código que acabas de cambiar. Cronometra cuánto tardas desde que empieza hasta que sabes la causa. Ese número es la medida real de tu observabilidad.',
        'Sigue tu manual de guardia al pie de la letra y anota cada paso que falta, está mal o no sirve. Corrige el manual inmediatamente después.',
        'Escribe el postmortem completo con las siete secciones del ejemplo. La sección de por qué no lo detectamos antes es la más valiosa y la que casi nadie escribe.',
        'Verifica la lista de la semana: registros estructurados con correlación de punta a punta, cuatro señales doradas instrumentadas, dos métricas de negocio, trazas con tramos propios, SLI y SLO definidos con presupuesto calculado, dos alertas por velocidad de consumo, panel en tres niveles, dos manuales de guardia y un postmortem escrito.',
        'Explica tu incidente en voz alta en tres minutos: qué pasó, cómo te enteraste, cómo lo diagnosticaste, qué hiciste para mitigarlo y qué cambiaste para que no vuelva. Esa es la respuesta a "cuéntame una incidencia que hayas resuelto".'
      ],
      vet: [
        'Añade al README de VetCare un apartado de observabilidad con un enlace al postmortem. Es uno de los documentos que mejor comunica que tu proyecto fue operado y no solo escrito.',
        'Convierte en tareas reales las acciones de la tabla del postmortem y hazlas. Un postmortem cuyas acciones nunca se ejecutan es un ejercicio de redacción.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/observabilidad.md dentro de una semana.'
      ],
      edge: [
        'Si tardas más de diez minutos en localizar la causa con tus herramientas, el problema no es tu habilidad: es que falta instrumentación. Anota qué te habría hecho falta y añádelo.',
        'Un postmortem sin acciones concretas con responsable y fecha es un desahogo. La parte que evita la repetición es la tabla de acciones, no la narración.',
        'Separa siempre acciones de causa de acciones de detección. Arreglar la causa evita este fallo concreto; mejorar la detección te ayuda con todos los que aún no conoces, que son la mayoría.'
      ],
      quiz: [
        { q: '¿Por qué un postmortem debe incluir por qué no se detectó antes?', a: 'Porque el tiempo de detección suele ser la mayor parte del impacto: un fallo detectado en dos minutos y otro detectado en dos horas pueden tener la misma causa y consecuencias completamente distintas. Mejorar la detección te protege además de fallos futuros que aún no conoces.' },
        { q: '¿Qué diferencia hay entre una acción de causa y una de detección?', a: 'La de causa impide que ese fallo concreto vuelva a ocurrir, como añadir el índice que faltaba. La de detección hace que, si ocurre algo parecido, te enteres antes, como añadir una alerta de latencia. La segunda tiene más alcance porque cubre fallos que todavía no has imaginado.' },
        { q: '¿Por qué una alerta basada solo en errores 5xx puede no ver una incidencia grave?', a: 'Porque un sistema saturado responde correctamente pero muy lento, así que no produce códigos de error. Para el usuario es equivalente a estar caído, de modo que necesitas alertar también sobre latencia y no solo sobre fallos.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que observabilidad no es instalar herramientas sino poder contestar preguntas sobre lo que ya pasó: registros estructurados con correlación te dan el detalle, las cuatro señales te dicen cuánta gente sufre, las trazas te dicen dónde se fue el tiempo, y los SLO convierten todo eso en decisiones en vez de en gráficos bonitos.' }
      ],
      out: 'Un incidente provocado y diagnosticado con tus propias herramientas, el manual corregido y un postmortem completo con acciones de causa y de detección.',
      file: 'docs/postmortem-01.md'
    }
  ]
}
]);
