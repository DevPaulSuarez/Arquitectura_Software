window.WEEKS = (window.WEEKS || []).concat([
{
  n: 14,
  phase: 'Calidad y testing',
  title: 'Resiliencia: que una falla ajena no tumbe tu sistema',
  idea: 'Tu API de VetCare va a depender de cosas que no controlas: la base de datos, el servicio de correo, una pasarela de pagos, la red. Esas cosas fallan. La pregunta no es si fallan sino qué hace tu sistema cuando pasa. Un sistema frágil se cuelga esperando para siempre, reintenta en bucle y multiplica el daño. Un sistema resiliente corta rápido, reintenta con cabeza, se rinde a tiempo y sigue dando el servicio que todavía puede dar. Esta semana aprendes las cuatro herramientas que se usan de verdad: timeouts, reintentos con backoff, circuit breaker y degradación elegante.',
  res: [
    { t: 'AWS Builders Library — Timeouts, retries and backoff with jitter',
      u: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
      note: 'El mejor texto gratuito sobre por qué los reintentos ingenuos empeoran una caída. Lenguaje agnóstico, se lee en 20 minutos y te cambia la forma de pensar.' },
    { t: 'Microsoft Learn — Implement resilient applications',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/',
      note: 'La guía oficial de .NET. Te interesa sobre todo cómo se configura resiliencia en HttpClient sin escribir la lógica a mano.' },
    { t: 'Polly — documentación oficial',
      u: 'https://www.pollydocs.org/',
      note: 'La librería estándar de resiliencia en .NET. Mira las páginas de Retry, Timeout y Circuit Breaker: cada una tiene un ejemplo mínimo que puedes copiar.' },
    { t: 'Azure Architecture Center — Circuit Breaker pattern',
      u: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker',
      note: 'Explica los tres estados del circuito con un diagrama. Es la mejor página para entender el patrón antes de usar la librería.' },
    { t: 'microservices.io — Transactional outbox', u: 'https://microservices.io/patterns/data/transactional-outbox.html', note: 'Cómo guardar en tu base y avisar a otro sistema sin perder mensajes.' },
    { t: 'Microsoft Learn — Strategies to handle partial failure', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/partial-failure-strategies', note: 'Las estrategias para que un fallo parcial no tumbe todo: reintentos, circuit breaker, fallbacks y límites.' },
    { t: 'Polly — Resilience strategies', u: 'https://www.pollydocs.org/strategies/', note: 'Índice de estrategias de Polly con sus opciones y valores por defecto.' }
  ],
  days: [
    {
      t: 'Timeouts: nunca esperes para siempre',
      obj: 'Entender por qué toda llamada externa necesita un límite de tiempo y aprender a propagarlo con CancellationToken en .NET.',
      why: 'Es el fallo número uno en sistemas reales y la primera pregunta de cualquier entrevista de resiliencia. Una llamada sin timeout no falla: se queda colgada, ocupa un hilo y una conexión, y cuando llegan cien peticiones más tu API deja de responder entera aunque solo un servicio esté lento.',
      study: { r: 0, what: 'Lee solo la sección de Timeouts (el principio del artículo, antes de Retries). Unos 10 minutos. Busca una cosa: por qué un timeout demasiado largo es casi tan malo como no tener ninguno.',
        pasos: [
          'Lee "Introduction" y "Failures Happen" (~4 min): por qué en un sistema distribuido los fallos son normales.',
          'Lee "Timeouts" (~6 min): cómo elige AWS el valor del timeout a partir de los percentiles de latencia.',
          'Para aquí: los reintentos son mañana.',
          'Escribe para cada llamada externa de VetCare (base de datos, correo, SMS) el timeout que pondrías y por qué.'
        ] },
      ex: {
        title: 'La misma llamada, sin límite y con límite',
        body: `// MAL: si el servicio de correo tarda 5 minutos, esta petición tarda 5 minutos
public async Task NotificarAsync(string email, string texto)
{
    var respuesta = await _http.PostAsJsonAsync("/send", new { email, texto });
    respuesta.EnsureSuccessStatusCode();
}

// BIEN: dos capas de límite
// 1) el HttpClient tiene un tope global
services.AddHttpClient<ClienteCorreo>(c =>
{
    c.BaseAddress = new Uri("https://correo.example.com");
    c.Timeout = TimeSpan.FromSeconds(5);
});

// 2) la operación concreta puede tener un límite más corto todavía
public async Task NotificarAsync(string email, string texto, CancellationToken ct)
{
    using var corte = CancellationTokenSource.CreateLinkedTokenSource(ct);
    corte.CancelAfter(TimeSpan.FromSeconds(2));

    try
    {
        var respuesta = await _http.PostAsJsonAsync("/send", new { email, texto }, corte.Token);
        respuesta.EnsureSuccessStatusCode();
    }
    catch (OperationCanceledException) when (!ct.IsCancellationRequested)
    {
        // el que se acabó fue NUESTRO límite de 2s, no el cliente que se fue
        throw new TimeoutException("El servicio de correo no respondió en 2 segundos.");
    }
}

// Y en el endpoint: acepta el token que ASP.NET Core te da gratis.
// Si el navegador cierra la pestaña, ct se cancela y dejas de trabajar para nadie.
app.MapPost("/api/v1/citas", async (CrearCitaRequest req, ServicioCitas svc, CancellationToken ct) =>
{
    var cita = await svc.CrearAsync(req, ct);
    return Results.Created($"/api/v1/citas/{cita.Id}", cita);
});`
      },
      steps: [
        'Abre src/VetCare.Api/Program.cs y busca cada método async que llame a la base de datos o a un servicio externo. Anota cuántos NO reciben un CancellationToken.',
        'Añade CancellationToken ct como último parámetro de tus endpoints. ASP.NET Core lo inyecta solo: no tienes que registrar nada.',
        'Propaga ese ct hacia abajo: al servicio, al repositorio, y finalmente a EF Core (ToListAsync(ct), SaveChangesAsync(ct)). Si lo cortas a medio camino, no sirve de nada.',
        'Configura el timeout de comando de Npgsql en tu cadena de conexión o en el DbContext: opciones.UseNpgsql(cs, o => o.CommandTimeout(10)). Diez segundos para una consulta de lectura ya es muchísimo.',
        'Comprueba que funciona: crea un endpoint de prueba que haga await db.Database.ExecuteSqlRawAsync("SELECT pg_sleep(30)", ct); llámalo y mide que tu API corta a los 10 segundos en vez de esperar 30.'
      ],
      vet: [
        'En VetCare el endpoint POST /citas escribe en la base y luego manda un correo de confirmación. El correo NO debe poder retrasar la respuesta: dale 2 segundos como máximo.',
        'Escribe en docs/resiliencia.md una tabla con tres columnas: operación, timeout elegido, por qué ese número. Un timeout sin justificación es un número mágico.'
      ],
      edge: [
        'Un timeout debe ser más corto que el del que te llama. Si el navegador espera 30s, tu API no puede esperar 30s a la base: entonces el usuario ve un error del navegador y tú nunca sabes qué pasó.',
        'OperationCanceledException también se lanza cuando el cliente se desconecta. Distingue los dos casos mirando si ct.IsCancellationRequested es true, como en el ejemplo, o registrarás errores falsos.',
        'HttpClient.Timeout aplica a toda la operación incluida la lectura del cuerpo. Si descargas un archivo grande legítimo, ese timeout global te lo va a cortar: usa un HttpClient distinto para esos casos.'
      ],
      quiz: [
        { q: '¿Por qué un timeout de 60 segundos es peligroso aunque técnicamente exista?', a: 'Porque durante esos 60 segundos el hilo, la conexión y la memoria de esa petición siguen ocupados. Con suficientes peticiones lentas agotas el pool antes de que venza el primer timeout, y tu API deja de aceptar tráfico sano. Un límite útil es el que corta antes de que se acumulen recursos, no el que acaba "algún día".' },
        { q: '¿Qué diferencia hay entre el timeout del HttpClient y un CancellationTokenSource con CancelAfter?', a: 'El del HttpClient es un tope global para todas las llamadas de ese cliente y es la red de seguridad. El CancellationTokenSource te permite un límite más corto y específico para una operación concreta, y además se combina con el token del cliente, así que respeta tanto tu límite como la desconexión del usuario.' },
        { q: '¿Qué pasa si recibes un CancellationToken en el endpoint pero no lo pasas a SaveChangesAsync?', a: 'Que la cancelación no llega a donde está el tiempo de espera real. El framework marca la petición como cancelada pero la consulta sigue corriendo en la base de datos y sigue ocupando una conexión. Propagar el token hasta la última llamada de E/S es lo que hace que la cancelación sea real.' },
        { q: '¿Por qué el timeout del correo en VetCare debe ser más corto que el de la base de datos?', a: 'Porque la escritura de la cita es la operación crítica y el correo es secundario. Si el correo tarda, el usuario debería recibir su cita creada igual. Los timeouts reflejan la importancia: lo imprescindible puede esperar un poco más, lo accesorio se corta rápido.' }
      ],
      out: 'Tus endpoints y repositorios propagan CancellationToken de punta a punta y tienes una tabla de timeouts justificados.',
      file: 'docs/resiliencia.md'
    },
    {
      t: 'Reintentos con backoff y jitter',
      obj: 'Saber qué errores merecen reintento, cuáles no, y por qué reintentar inmediatamente es la forma más rápida de tumbar un sistema que ya estaba sufriendo.',
      why: 'Casi todo el mundo sabe escribir un bucle de reintento; muy poca gente sabe cuándo NO reintentar. Saber distinguir un error transitorio de uno permanente, y saber explicar qué es el jitter, te coloca por encima de la media en cualquier entrevista de backend.',
      study: { r: 0, what: 'Ahora sí, lee las secciones de Retries y de Jitter del mismo artículo de AWS. Unos 15 minutos. Busca una cosa: qué es una "tormenta de reintentos" y cómo el jitter la evita.',
        pasos: [
          'Lee "Retries and backoff" (~7 min): por qué reintentar al instante empeora un servicio que ya está saturado.',
          'Fíjate en la parte que explica cómo los reintentos se multiplican cuando hay varias capas que reintentan.',
          'Lee "Jitter" (~5 min): añadir aleatoriedad para que los clientes no reintenten todos a la vez.',
          'Lee "Conclusion" (~1 min).',
          'Haz una tabla con los errores de VetCare: cuáles se reintentan (timeouts, 503) y cuáles nunca (400, 409).'
        ] },
      ex: {
        title: 'Reintento ingenuo vs reintento con cabeza',
        body: `// MAL: reintenta todo, al instante, siempre
for (int i = 0; i < 5; i++)
{
    try { return await LlamarAsync(); }
    catch { /* otra vez */ }
}

// Tres fallos de golpe:
// 1. reintenta un 400 Bad Request, que jamás va a funcionar
// 2. reintenta sin esperar, así que golpea 5 veces en 10 ms
// 3. si 1000 clientes hacen esto a la vez, el servicio caído recibe 5000 peticiones

// BIEN: solo errores transitorios, espera creciente, con ruido aleatorio
static bool EsTransitorio(HttpResponseMessage r) =>
    r.StatusCode == HttpStatusCode.RequestTimeout        // 408
    || r.StatusCode == HttpStatusCode.TooManyRequests     // 429
    || (int)r.StatusCode >= 500;                          // 500, 502, 503, 504

static readonly Random _rnd = Random.Shared;

public async Task<HttpResponseMessage> ConReintentosAsync(
    Func<Task<HttpResponseMessage>> operacion, int maxIntentos = 3)
{
    for (int intento = 1; ; intento++)
    {
        var r = await operacion();
        if (!EsTransitorio(r) || intento == maxIntentos) return r;
        r.Dispose();   // esta respuesta se descarta: libérala

        // backoff exponencial: 200ms, 400ms, 800ms...
        var baseMs = 200 * Math.Pow(2, intento - 1);
        // jitter total: un punto aleatorio entre 0 y ese tope
        var esperaMs = _rnd.NextDouble() * baseMs;

        await Task.Delay(TimeSpan.FromMilliseconds(esperaMs));
    }
}

// MEJOR TODAVÍA: no lo escribas tú. En .NET 8+:
// dotnet add package Microsoft.Extensions.Http.Resilience
services.AddHttpClient<ClienteCorreo>()
        .AddStandardResilienceHandler();
// Eso ya trae timeout, reintentos con jitter y circuit breaker configurados con
// valores sensatos. Escribirlo a mano es un ejercicio de aprendizaje, no de producción.

// PARA LOS TESTS: un handler falso que devuelve los códigos que le digas
class HandlerFalso : HttpMessageHandler
{
    private readonly Queue<HttpStatusCode> _codigos;
    public int Llamadas { get; private set; }
    public HandlerFalso(params HttpStatusCode[] codigos) => _codigos = new(codigos);

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage peticion, CancellationToken ct)
    {
        Llamadas++;
        return Task.FromResult(new HttpResponseMessage(_codigos.Dequeue()));
    }
}
// var h = new HandlerFalso(HttpStatusCode.ServiceUnavailable,
//                          HttpStatusCode.ServiceUnavailable, HttpStatusCode.OK);
// var http = new HttpClient(h) { BaseAddress = new Uri("http://prueba") };
// var r = await ConReintentosAsync(() => http.GetAsync("/x"));
// r.StatusCode.Should().Be(HttpStatusCode.OK); h.Llamadas.Should().Be(3);`
      },
      steps: [
        'Haz una lista en docs/resiliencia.md con dos columnas: "reintentar" y "no reintentar". Coloca ahí 400, 401, 403, 404, 409, 422, 408, 429, 500, 502, 503, 504 y justifica cada uno en media línea.',
        'Implementa a mano el método ConReintentosAsync del ejemplo en src/VetCare.Infrastructure/Resiliencia/. Hazlo una vez para entenderlo por dentro.',
        'Escribe un test con xUnit que use el HandlerFalso del ejemplo: que devuelva 503 dos veces y 200 la tercera, y comprueba que el método acaba devolviendo 200 y que hubo exactamente 3 intentos.',
        'Escribe un segundo test: el handler devuelve 400 siempre. Comprueba que hubo UN solo intento. Este test es el que demuestra que entendiste la lección.',
        'Ahora repite los dos tests con la librería: services.AddHttpClient("prueba").ConfigurePrimaryHttpMessageHandler(() => h).AddStandardResilienceHandler(), y pide el cliente con IHttpClientFactory. Comprueba que también hace 3 llamadas con 503, 503, 200 y una sola con 400. Tardará unos segundos: la librería espera más entre intentos. Así ves que hace lo mismo, pero mejor.'
      ],
      vet: [
        'Aplica reintentos SOLO al cliente de correo y al de la pasarela de pagos de VetCare. A la base de datos no le pongas reintentos genéricos todavía: eso lo resuelve EnableRetryOnFailure de Npgsql, que sabe qué errores de PostgreSQL son transitorios de verdad.',
        'Añade a docs/resiliencia.md una nota: cuántos intentos como máximo y por qué. Tres suele ser el techo razonable; más que eso y estás alargando el dolor del usuario.'
      ],
      edge: [
        'Nunca reintentes una operación no idempotente sin una clave de idempotencia. Si POST /pagos agota su timeout pero el pago SÍ se procesó, el reintento cobra dos veces. Mañana resolvemos esto.',
        'El jitter no es opcional. Sin él, mil clientes que fallaron en el mismo milisegundo reintentan en el mismo milisegundo, y el servicio que empezaba a recuperarse se vuelve a caer. El ruido aleatorio reparte la carga.',
        'Los reintentos anidados se multiplican. Si tu capa HTTP reintenta 3 veces y la capa de servicio también reintenta 3 veces, son 9 llamadas y 9 veces el tiempo. Decide una sola capa responsable de reintentar.'
      ],
      quiz: [
        { q: '¿Por qué no se debe reintentar un 404 o un 400?', a: 'Porque son errores permanentes: el recurso no existe o la petición está mal formada, y repetir la misma petición va a dar exactamente el mismo resultado. Reintentarlos solo gasta tiempo del usuario y carga del servidor sin ninguna posibilidad de éxito.' },
        { q: '¿Qué es el jitter y qué problema resuelve?', a: 'Es añadir aleatoriedad al tiempo de espera entre reintentos. Resuelve la tormenta de reintentos: si muchos clientes fallan simultáneamente y todos esperan exactamente 200 ms, todos vuelven a golpear a la vez y provocan una segunda caída. El jitter reparte esos reintentos a lo largo del intervalo.' },
        { q: 'Un 429 Too Many Requests se reintenta. ¿Qué hay que mirar antes de elegir cuánto esperar?', a: 'La cabecera Retry-After, si el servidor la envía. Es el propio servicio diciéndote cuándo volver. Ignorarla y usar tu backoff calculado es desobedecer una instrucción explícita y te puede llevar a un bloqueo más largo.' },
        { q: '¿Por qué el ejercicio pide implementar los reintentos a mano y luego sustituirlos por la librería?', a: 'Porque entender el mecanismo por dentro es lo que te permite configurar la librería con criterio y responder en una entrevista. Pero en producción la librería gana: ya maneja casos límite, cancelación, métricas y combinación con otras políticas que tu implementación de 20 líneas no cubre.' }
      ],
      out: 'Una política de reintentos que solo ataca errores transitorios, con backoff exponencial y jitter, cubierta por dos tests.',
      file: 'src/VetCare.Infrastructure/Resiliencia/'
    },
    {
      t: 'Circuit breaker: rendirse a tiempo',
      obj: 'Entender los tres estados de un circuito y configurar uno real con Polly para que VetCare deje de golpear un servicio que está claramente caído.',
      why: 'Es el patrón que distingue a quien ha operado sistemas en producción de quien solo ha leído sobre ellos. En una entrevista de diseño, mencionar circuit breaker junto con su razón (dejar de gastar recursos en algo que sabes que falla) suma mucho.',
      study: { r: 3, what: 'Lee la página completa de Circuit Breaker de Azure Architecture Center, prestando atención al diagrama de estados. Unos 12 minutos. Busca una cosa: qué hace exactamente el estado Half-Open y por qué no se pasa directo de Open a Closed.',
        pasos: [
          'Lee "Context and problem" y "Solution" (~5 min), con el diagrama de estados delante.',
          'Escribe qué pasa en cada estado: Closed deja pasar, Open falla rápido, Half-Open prueba con pocas peticiones.',
          'Lee "Problems and considerations" (~4 min) y apunta las tres que más afectan a VetCare.',
          'Lee "When to use this pattern" (~2 min).',
          'En "Example" lee "Flow C: Half-Open state" (~2 min) y explica por qué no se pasa directo de Open a Closed.'
        ] },
      ex: {
        title: 'Los tres estados y la configuración real',
        body: `// Closed   -> todo pasa. Se cuentan los fallos.
// Open     -> nada pasa. Se falla al instante, sin ni siquiera intentarlo.
// Half-Open-> pasa UNA petición de prueba. Si va bien -> Closed. Si falla -> Open otra vez.
//
// La clave: en Open NO esperas al timeout. Fallas en microsegundos.
// Eso libera hilos, conexiones y le da aire al servicio caído para recuperarse.

// dotnet add package Microsoft.Extensions.Http.Resilience

services.AddHttpClient<ClienteCorreo>(c =>
{
    c.BaseAddress = new Uri("https://correo.example.com");
})
.AddResilienceHandler("correo", pipeline =>
{
    pipeline
      // 1. tope TOTAL de la operación, con reintentos incluidos
      .AddTimeout(TimeSpan.FromSeconds(5))

      // 2. reintentos
      .AddRetry(new HttpRetryStrategyOptions
      {
          MaxRetryAttempts = 3,
          BackoffType = DelayBackoffType.Exponential,
          UseJitter = true,
          Delay = TimeSpan.FromMilliseconds(200)
      })

      // 3. circuit breaker
      .AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
      {
          // si más del 50% de las llamadas falla...
          FailureRatio = 0.5,
          // ...habiendo al menos 10 peticiones en la ventana...
          MinimumThroughput = 10,
          // ...medido en los últimos 30 segundos...
          SamplingDuration = TimeSpan.FromSeconds(30),
          // ...abre el circuito 15 segundos antes de probar otra vez.
          BreakDuration = TimeSpan.FromSeconds(15)
      })

      // 4. tope de CADA intento
      .AddTimeout(TimeSpan.FromSeconds(2));
});

// El orden importa. En Polly, lo que añades primero queda POR FUERA:
// timeout total -> retry -> circuit breaker -> timeout por intento.
// Es el mismo orden que usa AddStandardResilienceHandler.
// El breaker va por DENTRO del retry: así cuenta cada llamada real al
// servicio (lo que de verdad mide su salud), y cuando se abre lanza
// BrokenCircuitException, que el retry no reintenta: deja de insistir ya.

// Lo comprobé con un servicio falso que siempre responde 503:
//   petición 1: 503 tras ~1,1 s  (4 llamadas reales: 1 + 3 reintentos)
//   petición 2: 503 tras ~0,6 s  (4 llamadas reales)
//   petición 3: BrokenCircuitException (a las 10 llamadas, se abre)
//   petición 4 en adelante: BrokenCircuitException en 0 ms, 0 llamadas

// Cuando el circuito está abierto, o se agota el tiempo, la llamada
// lanza una excepción de Polly. Captúrala y degrada (mañana lo vemos):
try
{
    await _clienteCorreo.NotificarAsync(email, texto, ct);
}
catch (Exception ex) when (ex is BrokenCircuitException
                              or TimeoutRejectedException
                              or HttpRequestException)
{
    _log.LogWarning("Correo no disponible. Cita creada igual, notificación encolada.");
    await _cola.EncolarAsync(new NotificacionPendiente(email, texto), ct);
}`
      },
      steps: [
        'Instala Microsoft.Extensions.Http.Resilience en el proyecto VetCare.Infrastructure y configura el ClienteCorreo exactamente como en el ejemplo.',
        'Dibuja el diagrama de estados en docs/resiliencia.md usando Mermaid: stateDiagram-v2 con Closed, Open y HalfOpen y las flechas etiquetadas con la condición de cada transición.',
        'Levanta un servidor falso que siempre devuelva 503 (puede ser un endpoint tuyo en /fake/siempre-falla) y apunta el ClienteCorreo ahí.',
        'Lanza 20 peticiones seguidas y mide el tiempo de cada una. Verás que las primeras tardan alrededor de un segundo (los reintentos esperan) y que, tras unas pocas, empiezan a fallar en milisegundos: ese es el circuito abriéndose.',
        'Espera los 15 segundos de BreakDuration, lanza una petición más y observa en los logs el intento Half-Open. Luego cambia el servidor falso a 200 y comprueba que el circuito vuelve a cerrarse.'
      ],
      vet: [
        'En VetCare el circuito del cliente de correo debe estar separado del circuito de la pasarela de pagos. Si el correo se cae, los pagos deben seguir funcionando: un circuito por dependencia, nunca uno global.',
        'Añade una fila a tu tabla de docs/resiliencia.md: para cada dependencia externa, qué política tiene (timeout, retry, breaker) y qué pasa cuando el circuito abre.'
      ],
      edge: [
        'MinimumThroughput existe para evitar falsos positivos. Sin él, dos fallos sobre dos peticiones son un 100% de error y abrirías el circuito con casi ninguna evidencia.',
        'Un circuito compartido entre todos los endpoints de un servicio puede ser demasiado grueso: si solo /send está roto pero /status funciona, abres de más. Si el servicio distingue rutas críticas, considera un breaker por ruta.',
        'El circuit breaker no sustituye a los reintentos ni al revés. Los reintentos resuelven fallos puntuales de una petición; el breaker resuelve fallos sostenidos de un servicio. Se usan juntos: el retry por fuera y el breaker por dentro.'
      ],
      quiz: [
        { q: '¿Por qué existe el estado Half-Open en vez de pasar de Open a Closed cuando vence el temporizador?', a: 'Porque reabrir el tráfico de golpe tras un corte manda toda la carga acumulada contra un servicio que quizá apenas se está levantando y lo vuelve a tumbar. Half-Open deja pasar una sola petición de prueba: si tiene éxito se cierra el circuito, y si falla se vuelve a abrir sin haber hecho daño.' },
        { q: '¿Qué gana el sistema mientras el circuito está abierto, si de todas formas la petición falla?', a: 'Gana tiempo y recursos. Con el circuito abierto el fallo es inmediato en vez de costar los 2 segundos del timeout, así que no se acumulan hilos ni conexiones esperando, y el servicio caído deja de recibir tráfico y tiene margen para recuperarse.' },
        { q: '¿Por qué, en Polly, el circuit breaker va por dentro del retry?', a: 'Porque así el breaker ve cada llamada real al servicio, que es lo que mide su salud. Y cuando se abre lanza BrokenCircuitException, que el retry no reintenta, así que se deja de insistir al instante. Es el orden del handler estándar de .NET: timeout total, retry, circuit breaker y timeout por intento.' },
        { q: 'En VetCare, ¿qué debe pasar con una cita cuando el circuito del correo está abierto?', a: 'La cita debe crearse igual. El correo es una consecuencia deseable pero no es la operación crítica, así que se captura BrokenCircuitException, se registra el aviso y se encola la notificación para enviarla después. Rechazar la cita porque el correo está caído sería convertir un fallo secundario en un fallo total.' }
      ],
      out: 'ClienteCorreo con timeout + retry + circuit breaker configurados y un diagrama de estados que entiendes de verdad.',
      file: 'src/VetCare.Infrastructure/Resiliencia/'
    },
    {
      t: 'Idempotencia operacional y outbox',
      obj: 'Garantizar que reintentar una operación de escritura no la duplique, y que un efecto externo no se pierda cuando la transacción se confirma pero el envío falla.',
      why: 'Es el problema real que se esconde detrás de "simplemente reintenta". Entender la dualidad escribir-en-base y publicar-afuera, y saber nombrar el patrón Outbox, es material directo de entrevistas senior.',
      study: { r: 4, what: 'Lee el patrón completo. Unos 12 minutos. Fíjate en el problema que resuelve: guardar en la base y avisar a otro sistema no es atómico sin un truco. Busca una cosa: por qué no puedes meter una llamada HTTP dentro de una transacción de base de datos.',
        pasos: [
          'Lee "Context" y "Problem" (~3 min): guardar en la base y enviar un mensaje no es atómico.',
          'Lee "Forces" (~2 min).',
          'Lee "Solution" con su diagrama (~4 min): la tabla outbox se escribe en la misma transacción y otro proceso la envía después.',
          'Lee "Result context" (~2 min): el mensaje puede enviarse más de una vez, por eso el receptor debe ser idempotente.',
          'Dibuja el flujo de VetCare: crear cita, guardar en outbox, proceso que envía el SMS.'
        ] },
      ex: {
        title: 'El problema de los dos sistemas y cómo se resuelve',
        body: `// EL PROBLEMA
using var tx = await db.Database.BeginTransactionAsync(ct);
db.Citas.Add(cita);
await db.SaveChangesAsync(ct);
await _correo.NotificarAsync(cita.Email, ct);   // <-- fuera de la base
await tx.CommitAsync(ct);

// Dos formas de romperse:
// a) el correo falla -> haces rollback, pero quizá el correo YA se envió
// b) el correo va bien y el commit falla -> avisaste de una cita que no existe
// Una transacción de base de datos no puede abarcar un sistema externo. Punto.

// SOLUCIÓN 1: clave de idempotencia para que el reintento del CLIENTE no duplique
// (ya lo viste en la semana 11, ahora es obligatorio)
app.MapPost("/api/v1/citas", async (
    CrearCitaRequest req,
    [FromHeader(Name = "Idempotency-Key")] string? clave,
    VetCareDbContext db, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(clave))
        return Results.Problem(title: "Falta Idempotency-Key", statusCode: 400);

    var previa = await db.OperacionesIdempotentes
                         .AsNoTracking()
                         .FirstOrDefaultAsync(o => o.Clave == clave, ct);
    if (previa is not null)
        return Results.Ok(JsonSerializer.Deserialize<CitaResponse>(previa.Respuesta));

    // ... crear la cita ...
    db.OperacionesIdempotentes.Add(new OperacionIdempotente(clave, respuestaJson));
    await db.SaveChangesAsync(ct);
    // Si llegan dos peticiones a la vez con la misma clave, la PRIMARY
    // KEY de "clave" rechaza la segunda (error 23505): captúralo y
    // devuelve la respuesta guardada.
    return Results.Created($"/api/v1/citas/{cita.Id}", respuesta);
});

// SOLUCIÓN 2: Outbox para que el efecto externo no se pierda
// La misma transacción escribe la cita Y la intención de notificar.
db.Citas.Add(cita);
db.Outbox.Add(new MensajeOutbox(
    tipo: "CitaCreada",
    payload: JsonSerializer.Serialize(new { cita.Id, cita.Email }),
    creadoEn: _reloj.Ahora()));
await db.SaveChangesAsync(ct);   // una sola transacción, todo o nada

// Un proceso aparte lee el outbox y envía:
var pendientes = await db.Outbox
    .Where(m => m.ProcesadoEn == null)
    .OrderBy(m => m.CreadoEn)
    .Take(50)
    .ToListAsync(ct);

foreach (var m in pendientes)
{
    await _correo.NotificarAsync(m.Payload, ct);  // con retry y breaker
    m.ProcesadoEn = _reloj.Ahora();
    await db.SaveChangesAsync(ct);
}
// Entrega "al menos una vez": puede enviar dos veces si el proceso muere
// justo después de enviar. Por eso el consumidor también debe ser idempotente.`
      },
      steps: [
        'Crea la tabla operacion_idempotente en una migración nueva: clave text primary key, respuesta jsonb not null, creado_en timestamptz not null default now().',
        'Crea la tabla mensaje_outbox: id uuid primary key, tipo text not null, payload jsonb not null, creado_en timestamptz not null, procesado_en timestamptz null, intentos int not null default 0.',
        'Modifica POST /citas para exigir la cabecera Idempotency-Key y devolver la respuesta guardada si la clave ya existe, sin volver a crear nada.',
        'Mueve el envío de correo fuera del flujo de creación: en su lugar inserta un MensajeOutbox dentro de la misma SaveChangesAsync.',
        'Escribe un BackgroundService llamado ProcesadorOutbox que cada 5 segundos lea hasta 50 mensajes pendientes, los envíe usando el ClienteCorreo resiliente de ayer, y marque procesado_en.'
      ],
      vet: [
        'Añade un índice parcial a mensaje_outbox: CREATE INDEX ix_outbox_pendientes ON mensaje_outbox (creado_en) WHERE procesado_en IS NULL. Es exactamente el caso que estudiaste en la semana 10.',
        'Escribe en docs/resiliencia.md la frase clave que debes poder decir en una entrevista: "no se puede hacer commit atómico entre una base de datos y un sistema externo, por eso se escribe la intención en la misma transacción y se entrega después".'
      ],
      edge: [
        'Un outbox sin limpieza crece sin parar. Añade una tarea que borre los mensajes procesados con más de 7 días, o la tabla acabará siendo la más grande de tu base.',
        'El procesador de outbox debe tolerar que haya dos instancias corriendo. Usa SELECT ... FOR UPDATE SKIP LOCKED al tomar los mensajes, o dos servidores enviarán el mismo correo.',
        'Guardar la respuesta completa en la tabla de idempotencia es lo que hace que el reintento devuelva exactamente lo mismo. Si solo guardas la clave y devuelves 409, el cliente que perdió la respuesta por un corte de red nunca sabrá el id de su cita.'
      ],
      quiz: [
        { q: '¿Por qué no se puede meter una llamada HTTP dentro de una transacción de base de datos?', a: 'Porque la transacción solo controla la base de datos: puede deshacer sus propias escrituras, pero no puede deshacer un correo ya enviado ni un cobro ya ejecutado. Si la transacción hace rollback después de la llamada, los dos sistemas quedan en desacuerdo de forma permanente.' },
        { q: '¿Qué garantía de entrega da el patrón Outbox y qué implica para el consumidor?', a: 'Da entrega al menos una vez: el mensaje nunca se pierde, pero puede enviarse dos veces si el proceso muere entre el envío y el marcado como procesado. Eso implica que el consumidor o el efecto final tienen que ser idempotentes para que el duplicado no haga daño.' },
        { q: '¿Por qué la tabla de idempotencia guarda la respuesta y no solo la clave?', a: 'Para poder devolver al cliente exactamente el mismo resultado que la primera vez. El caso típico es que la operación sí se ejecutó pero la respuesta se perdió por la red; el cliente reintenta y necesita el id de la cita creada, no un simple aviso de duplicado.' },
        { q: '¿Qué hace SKIP LOCKED en el procesador de outbox y por qué importa?', a: 'Hace que una instancia que lee mensajes ignore las filas que otra instancia ya tiene bloqueadas en lugar de esperar por ellas. Importa porque permite escalar el procesador a varias instancias en paralelo sin enviar duplicados ni bloquearse entre sí.' }
      ],
      out: 'POST /citas idempotente de verdad y un outbox con su procesador en segundo plano.',
      file: 'src/VetCare.Infrastructure/Outbox/'
    },
    {
      t: 'Degradación elegante y fallbacks',
      obj: 'Decidir, dependencia por dependencia, qué hace VetCare cuando algo no está disponible, en vez de devolver un 500 genérico.',
      why: 'Es la diferencia entre un sistema que "se cae" y uno que "funciona peor un rato". Saber clasificar dependencias en críticas y no críticas, y defender esa clasificación, es una habilidad de diseño que se nota inmediatamente.',
      study: { r: 5, what: 'Lee la lista de estrategias para fallos parciales y después la guía de health checks de ASP.NET Core. Unos 12 minutos. Busca una cosa: qué significa que una dependencia sea crítica y cómo eso cambia tu endpoint /health/ready.',
        pasos: [
          'Lee la página completa (~4 min): cada estrategia en un párrafo.',
          'Detente en "Provide fallbacks": qué devuelve el sistema cuando una dependencia falla.',
          'Detente en "Limit the number of queued requests": por qué dejar acumular peticiones empeora la caída.',
          'Abre la documentación de health checks de ASP.NET Core y lee la sección sobre separar readiness y liveness (~5 min).',
          'Haz una tabla con cada dependencia de VetCare: ¿es crítica? ¿qué hace el sistema si falla? ¿afecta a /health/ready?'
        ] },
      ex: {
        title: 'Matriz de degradación de VetCare',
        body: `// Clasifica CADA dependencia. Solo hay dos categorías y hay que elegir.
//
// CRÍTICA: sin ella la operación no tiene sentido -> falla rápido y claro
//   PostgreSQL. Sin base de datos no hay citas. 503 + Retry-After.
//
// NO CRÍTICA: la operación sigue siendo válida -> degrada
//   Servicio de correo   -> encola en outbox, responde 201 igual
//   Pasarela de pagos    -> crea la factura en estado "pendiente de cobro"
//   Servicio de SMS      -> omite, registra el aviso
//   Cache de disponibles -> consulta la base directamente, más lento pero correcto

// En código, la degradación es explícita y visible, nunca un catch vacío:
public async Task<IReadOnlyList<HorarioDto>> HorariosAsync(Guid vetId, CancellationToken ct)
{
    try
    {
        return await _cache.ObtenerAsync(vetId, ct);
    }
    // ojo: el timeout de Polly lanza TimeoutRejectedException,
    // no TimeoutException
    catch (Exception ex) when (ex is BrokenCircuitException or TimeoutRejectedException)
    {
        _log.LogWarning(ex, "Cache no disponible para vet {VetId}. Leyendo de la base.", vetId);
        _metricas.Incrementar("cache.degradado");
        return await _repo.HorariosAsync(vetId, ct);   // fallback correcto
    }
}

// Y el usuario se entera de forma honesta:
// CitaResponse con un campo nuevo: Avisos
return Results.Created($"/api/v1/citas/{cita.Id}", new CitaResponse(
    cita.Id, cita.Inicio, cita.Fin, "agendada",
    Avisos: correoEncolado
        ? new[] { "El correo de confirmación se enviará en unos minutos." }
        : Array.Empty<string>()));

// Health checks que reflejan la matriz
// (AddUrlGroup viene del paquete AspNetCore.HealthChecks.Uris):
builder.Services.AddHealthChecks()
    .AddNpgSql(cs, name: "postgres", tags: new[] { "ready" })       // crítica
    .AddUrlGroup(new Uri(correoUrl), name: "correo",
                 failureStatus: HealthStatus.Degraded);             // NO en "ready"

app.MapHealthChecks("/health/live",  new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new() { Predicate = h => h.Tags.Contains("ready") });
// Clave: si el correo está caído, /health/ready sigue en 200.
// Si estuviera en "ready", el orquestador sacaría de rotación una API que SÍ funciona.`
      },
      steps: [
        'Escribe en docs/resiliencia.md la matriz completa: una fila por dependencia externa de VetCare, con columnas dependencia, crítica sí/no, comportamiento al fallar y qué ve el usuario.',
        'Implementa el fallback del ejemplo para al menos una dependencia no crítica. Que el catch registre un log con nivel Warning y una métrica, nunca que se lo trague en silencio.',
        'Revisa tu endpoint /health/ready de la semana 12 y quita de él cualquier dependencia que hayas clasificado como no crítica.',
        'Añade un campo Avisos a tu CitaResponse para que la respuesta pueda decir honestamente que algo se hará más tarde. Degradar sin avisar al usuario es mentir.',
        'Apaga el servicio de correo falso y recorre el flujo completo en el navegador o con curl: la cita debe crearse, la respuesta debe traer el aviso, /health/ready debe seguir en 200 y el log debe tener el Warning.'
      ],
      vet: [
        'La única dependencia crítica de VetCare es PostgreSQL. Si clasificas una segunda como crítica, escribe al lado por qué: cada dependencia crítica que añades multiplica tu probabilidad de caída total.',
        'Comprueba que tu respuesta de error cuando PostgreSQL sí está caído usa el formato RFC 9457 que aprendiste en la semana 11, con status 503 y una cabecera Retry-After.'
      ],
      edge: [
        'Un catch que devuelve datos vacíos no es degradación, es corrupción silenciosa. Si la cache falla y devuelves una lista vacía de horarios, el usuario cree que no hay huecos. Prefiere leer de la base o fallar.',
        'Si el fallback es más lento que la vía normal, puede tumbarte: cuando la cache cae, toda la carga va a la base de golpe. Protege el fallback con su propio límite de concurrencia.',
        'Degradar sin registrar una métrica te deja ciego. Puedes pasar semanas sirviendo la versión degradada sin que nadie se entere de que la cache lleva caída desde el martes.'
      ],
      quiz: [
        { q: '¿Qué criterio usas para decidir si una dependencia es crítica?', a: 'Si sin ella la operación que pide el usuario pierde su sentido o quedaría incorrecta. Sin base de datos no se puede crear una cita, así que es crítica. Sin correo la cita existe igual y es válida, así que es no crítica y debe degradarse en lugar de fallar.' },
        { q: '¿Por qué una dependencia no crítica no debe aparecer en /health/ready?', a: 'Porque /health/ready decide si el orquestador manda tráfico a esa instancia. Si incluyes el correo y el correo se cae, todas tus instancias se marcan como no listas y se retiran de rotación, dejando el servicio completamente caído por culpa de una función secundaria que funciona perfectamente.' },
        { q: '¿Por qué devolver una lista vacía cuando falla la cache es peor que lanzar un error?', a: 'Porque una lista vacía es una respuesta válida y creíble: el usuario concluye que no hay horarios disponibles y se va. Un error es honesto y reintentable. La degradación nunca debe producir datos que parezcan correctos y no lo sean.' },
        { q: '¿Qué tiene que aparecer siempre en el camino de un fallback, aparte del propio fallback?', a: 'Un log de nivel Warning y una métrica. Sin esa señal el sistema puede estar funcionando degradado durante días sin que nadie lo note, que es justo lo contrario de lo que buscas: degradar es ganar tiempo para arreglar, no esconder el problema.' }
      ],
      out: 'Una matriz de degradación escrita, al menos un fallback implementado con log y métrica, y health checks coherentes con la matriz.',
      file: 'docs/resiliencia.md'
    },
    {
      t: 'Caos controlado y defensa (examen de la semana)',
      obj: 'Romper VetCare a propósito, comprobar que se comporta como dijiste que se comportaría, y poder defender cada decisión de resiliencia.',
      why: 'Un plan de resiliencia que nunca se ha probado es una hipótesis. La frase "lo probé apagando la base de datos y esto es lo que pasó" en una entrevista vale más que cualquier lista de patrones memorizados.',
      study: { r: 6, what: 'Repasa en Polly las estrategias de Retry, Timeout y Circuit Breaker, mirando la tabla Defaults de cada una. Unos 10 minutos. Busca una cosa: qué valor por defecto trae cada estrategia, para saber qué estás cambiando cuando configuras.',
        pasos: [
          'Lee "Built-in strategies" (~2 min): cuáles son reactivas y cuáles proactivas.',
          'Abre la estrategia Retry y lee su tabla de valores por defecto (~3 min): intentos, retraso y tipo de backoff.',
          'Abre Timeout y Circuit Breaker y haz lo mismo (~4 min).',
          'Compara esos valores con los que configuraste en VetCare y anota cada diferencia y su motivo.'
        ] },
      ex: {
        title: 'Guion de caos: cuatro experimentos',
        body: `EXPERIMENTO 1 — Base de datos caída (dependencia crítica)
  Acción:   docker stop vetcare-db
  Hipótesis: POST /citas devuelve 503 con problem details y Retry-After.
             /health/ready devuelve 503. /health/live sigue en 200.
             La API NO se queda colgada: responde en menos de 11 segundos.
  Resultado: ______________________________________________
  Arreglo:   ______________________________________________

EXPERIMENTO 2 — Servicio de correo lento (no crítica, timeout)
  Acción:   apunta el ClienteCorreo a un endpoint que hace Task.Delay(30s)
  Hipótesis: POST /citas responde 201 en menos de 3 segundos.
             El correo se encola en outbox. La respuesta trae el aviso.
  Resultado: ______________________________________________
  Arreglo:   ______________________________________________

EXPERIMENTO 3 — Servicio de correo caído de forma sostenida (breaker)
  Acción:   endpoint que siempre devuelve 503. Lanza 30 peticiones.
  Hipótesis: las primeras tardan ~1 s (reintentos). Tras unas pocas
             peticiones fallan en <10 ms con BrokenCircuitException.
             Tras 15 segundos hay exactamente un intento Half-Open en los logs.
  Resultado: ______________________________________________
  Arreglo:   ______________________________________________

EXPERIMENTO 4 — Reintento del cliente (idempotencia)
  Acción:   curl -X POST /citas -H "Idempotency-Key: abc-123" ... (dos veces)
  Hipótesis: la primera devuelve 201. La segunda devuelve el MISMO id.
             SELECT count(*) FROM cita WHERE ... devuelve 1, no 2.
  Resultado: ______________________________________________
  Arreglo:   ______________________________________________

CHECKLIST DE DEFENSA
  [ ] Toda llamada externa tiene timeout y ese timeout está justificado
  [ ] CancellationToken se propaga desde el endpoint hasta la última llamada de E/S
  [ ] Los reintentos solo atacan 408, 429 y 5xx, con backoff exponencial y jitter
  [ ] Hay un circuit breaker por dependencia, no uno global
  [ ] Ninguna operación no idempotente se reintenta sin Idempotency-Key
  [ ] Los efectos externos pasan por outbox, no por dentro de la transacción
  [ ] Existe una matriz escrita de dependencias críticas y no críticas
  [ ] /health/ready solo contiene dependencias críticas
  [ ] Cada fallback registra log Warning y métrica
  [ ] Los cuatro experimentos están ejecutados y anotados`
      },
      steps: [
        'Ejecuta los cuatro experimentos uno por uno. Escribe el resultado real en docs/resiliencia.md, aunque contradiga tu hipótesis: ahí es donde está el aprendizaje.',
        'Para cada hipótesis que falló, arregla el código y vuelve a ejecutar el experimento hasta que el resultado coincida.',
        'Recorre el checklist de defensa y marca solo lo que puedas señalar en el código. Lo que no puedas señalar, no está hecho.',
        'Añade a tu suite de la semana 13 un test de integración que verifique el experimento 4: dos POST con la misma Idempotency-Key producen una sola fila en cita.',
        'Grábate o explica en voz alta, en 3 minutos, la resiliencia de VetCare, en este orden: qué puede fallar, qué hace el sistema en cada caso y cómo lo comprobaste.'
      ],
      vet: [
        'Tu docs/resiliencia.md debe quedar como un documento completo: tabla de timeouts, política de reintentos, configuración de breakers, matriz de degradación y resultados de los cuatro experimentos.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/resiliencia.md dentro de una semana.'
      ],
      edge: [
        'Si un experimento sale bien a la primera, sospecha. Comprueba que de verdad rompiste lo que creías romper: muchas veces el contenedor seguía vivo o el cliente apuntaba a otra URL.',
        'No ejecutes experimentos de caos contra una base con datos que te importen. Usa el contenedor de Docker de la semana 9 y asume que lo vas a tener que recrear.',
        'La resiliencia tiene coste: cada reintento multiplica la carga y cada breaker añade estado. No pongas políticas donde no hay riesgo real; una llamada en memoria no necesita circuit breaker.'
      ],
      quiz: [
        { q: 'Un experimento de caos cuya hipótesis se cumple, ¿qué te aporta?', a: 'Te convierte una creencia en evidencia. Antes del experimento sabías que habías configurado un timeout; después sabes que ese timeout corta de verdad en el camino real del código, con el orden de políticas que tienes y con la propagación de cancelación que escribiste.' },
        { q: '¿Por qué /health/live debe seguir en 200 cuando PostgreSQL está caído?', a: 'Porque live responde a la pregunta de si el proceso está sano y debe ser reiniciado, no a si puede atender tráfico. Reiniciar la API no arregla una base de datos caída, así que marcar live como fallo provocaría reinicios en bucle que empeoran la situación.' },
        { q: '¿Por qué el experimento 4 se convierte en un test automatizado y los otros no necesariamente?', a: 'Porque la idempotencia es una regla de negocio verificable con el stack de tests de integración que ya tienes y puede romperse con cualquier refactor del endpoint. Los experimentos de caos dependen de apagar infraestructura, así que se ejecutan a mano o en un entorno dedicado, no en cada commit.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que la resiliencia no es una librería sino un conjunto de decisiones explícitas: cuánto esperar antes de rendirse, qué errores merecen otra oportunidad, cuándo dejar de insistir, qué operaciones pueden repetirse sin daño y qué parte del servicio sigue siendo válida cuando algo externo se cae.' }
      ],
      out: 'docs/resiliencia.md completo con los cuatro experimentos ejecutados y un test de idempotencia en la suite.',
      file: 'docs/resiliencia.md'
    }
  ]
}
]);
