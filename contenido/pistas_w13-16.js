/* Una pista por cada paso de «Hazlo tú»: cómo empezar, un ejemplo y cómo saber que está bien.
   Clave: w<semana>d<día>; el orden coincide con days[].steps. */
window.PISTAS = Object.assign(window.PISTAS || {}, {

/* ---------- Semana 13 ---------- */

'w13d1': [
  '«dotnet new xunit -o tests/VetCare.Domain.Tests», «dotnet sln add tests/VetCare.Domain.Tests», «dotnet add tests/VetCare.Domain.Tests reference src/VetCare.Domain» y «dotnet add tests/VetCare.Domain.Tests package FluentAssertions». Ejecuta «dotnet test»: el test de ejemplo que trae la plantilla debe pasar.',
  'Reparte: 3 de creación válida e inválida (fecha pasada, duración 0, duración de más de 2 h), 2 de estado inicial, 2 del cálculo del fin, 3 de transiciones (cancelar una pendiente, cancelar una ya cancelada, atender una cancelada). Estructura de cada test: Arrange (prepara), Act (una sola acción), Assert (comprueba).',
  '«[Theory] [InlineData(0)] [InlineData(-15)] [InlineData(180)] public void Agendar_CuandoDuracionInvalida_LanzaExcepcion(int minutos) { var act = () => Cita.Agendar(…, minutos, …); act.Should().Throw<ArgumentOutOfRangeException>(); }». Si tienes tres tests que solo cambian un número, conviértelos en un Theory.',
  'Ejemplos: «Cancelar_CuandoYaEstaCancelada_LanzaExcepcion», «Agendar_CuandoFechaEsPasada_Rechaza», «Fin_CuandoDura30Minutos_EsInicioMasMediaHora». Léelos seguidos como si fueran una lista de requisitos: si alguno no se entiende sin abrir el código, renómbralo.',
  'Todo verde, y ahora sabotea: cambia «fin > inicio» por «fin >= inicio» o comenta un throw. Ejecuta «dotnet test»: al menos un test debe ponerse rojo. Si todo sigue verde, a tus tests les falta ese caso. Deshaz el sabotaje al terminar.'
],

'w13d2': [
  'Tabla: | Regla | ¿Test? | Nombre del test |. Copia tus RN de la semana 1 y las invariantes de la semana 4. Marca ✓ solo si existe un test que fallaría al romper esa regla. Las reglas sin ✓ son tu lista de deuda de pruebas.',
  'Señal: el Assert es «mock.Verify(x => x.Guardar(…), Times.Once)» y no comprueba ningún resultado. Reescríbelo para comprobar el efecto: «repo.Citas.Should().ContainSingle(c => c.Estado == Pendiente)». Verificar llamadas solo tiene sentido cuando la llamada ES el resultado (por ejemplo, enviar un email).',
  '«dotnet test --collect:"XPlat Code Coverage"» genera un coverage.cobertura.xml. Para verlo en HTML: «dotnet tool install -g dotnet-reportgenerator-globaltool» y «reportgenerator -reports:**/coverage.cobertura.xml -targetdir:coverage». Abre coverage/index.html y entra en VetCare.Domain.',
  'Para cada línea roja, pregunta: si esto falla, ¿qué le pasa a la clínica? Mal cobro o datos médicos → escribe el test. Un ToString o un mensaje de log → anótalo como «riesgo aceptado: cosmético». Escribe la decisión en testing.md, no solo en tu cabeza.',
  'Candidatos a borrar: «var m = new Mascota("Max"); m.Nombre.Should().Be("Max");» (prueba el compilador, no tu lógica) y tests sin Assert. Prueba rápida: si puedes borrar la línea de código que «prueban» y siguen en verde, el test no protege nada.'
],

'w13d3': [
  'RelojFijo (stub: devuelve un valor fijo). RepositorioCitasEnMemoria (fake: funciona de verdad, pero con una List). NotificadorSpy (spy: guarda lo que se le pidió en «List<string> Enviados»). Dummy: un objeto que se pasa porque el constructor lo pide, pero el test nunca lo usa. Ponlos en tests/VetCare.Domain.Tests/Dobles/.',
  'Ideas: agenda bien → la cita está en el repositorio; solape → excepción; en el pasado (con RelojFijo) → excepción; tras agendar → el spy tiene 1 mensaje; si falla la validación → el spy tiene 0 mensajes. Cada test construye el agendador con dobles nuevos para no compartir estado.',
  '«dotnet add package Moq». Ejemplo: «var reloj = new Mock<IRelojSistema>(); reloj.Setup(r => r.Ahora).Returns(new DateTime(2026, 6, 1));» y pasas «reloj.Object». Compara los dos tests: ¿cuál entiende mejor alguien que no conoce Moq? Escribe tu conclusión en una línea.',
  'Estado: el Assert mira datos («repo.Citas.Count.Should().Be(1)»). Comportamiento: mira interacciones («spy.Enviados.Should().HaveCount(1)»). Justificación típica: guardar se comprueba por estado (lo importante es que la cita existe); notificar, por comportamiento (lo importante es que se pidió el envío, y no hay estado que mirar).',
  '«dotnet test tests/VetCare.Domain.Tests» muestra el tiempo total al final. Si pasa de 1 s, busca tests que usen Thread.Sleep, Task.Delay, archivos, HttpClient o una base de datos real: en tests de dominio no deberían existir. Sustitúyelos por dobles.'
],

'w13d4': [
  'Escribe primero 4 o 5 ejemplos concretos en papel: «perro de 8 semanas sin vacunas → polivalente hoy», «perro con la polivalente hace 3 semanas → refuerzo dentro de 1 semana», «gato adulto con la rabia hace 11 meses → rabia dentro de 1 mes». Cada ejemplo será un test, en orden de menor a mayor dificultad.',
  'Test: «var cal = new CalendarioVacunacion(); var proxima = cal.Proxima(Especie.Perro, edadSemanas: 8, historial: []); proxima.Vacuna.Should().Be("Polivalente");». No compila porque la clase no existe: eso es el rojo. Crea solo lo mínimo para que compile y vuelve a ver el rojo (ahora falla el Assert).',
  'Rojo → verde (el código mínimo, aunque sea «return "Polivalente"») → refactor. Siguiente test: el que obliga a quitar el valor fijo. Apunta la hora al empezar y al terminar cada ciclo: lo sano es entre 2 y 10 minutos. Si un ciclo dura 30, el paso era demasiado grande.',
  'Con 3 o 4 tests en verde, el código tendrá if repetidos. Refactor típico: una tabla de reglas «(especie, vacuna, edad mínima, intervalo)» y un bucle que la recorre. Ejecuta los tests después de cada cambio pequeño: deben seguir en verde todo el rato.',
  'Escribe en testing.md: dependencias de CalendarioVacunacion (probablemente ninguna o solo el reloj), cuánto tardó cada test y qué decisión de diseño te forzó TDD (por ejemplo, pasar la fecha por parámetro). Compáralo con alguna clase escrita sin TDD: ¿cuántas dependencias tiene esa?'
],

'w13d5': [
  '«dotnet new xunit -o tests/VetCare.Api.Tests», añádelo a la solución, referencia a src/VetCare.Api y los paquetes «Microsoft.AspNetCore.Mvc.Testing», «Testcontainers.PostgreSql» y FluentAssertions. Docker debe estar corriendo: Testcontainers levanta un PostgreSQL desechable para cada ejecución.',
  'Al final de Program.cs, después de app.Run(): «public partial class Program { }». Sirve para que WebApplicationFactory<Program> pueda encontrar la clase desde el proyecto de tests (en .NET 10 ya es visible, pero no molesta).',
  '«public class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime { readonly PostgreSqlContainer _db = new PostgreSqlBuilder().WithImage("postgres:17").Build(); public async Task InitializeAsync() { await _db.StartAsync(); /* aplica migraciones y datos-prueba.sql */ } protected override void ConfigureWebHost(IWebHostBuilder b) => b.UseSetting("ConnectionStrings:VetCare", _db.GetConnectionString()); … }».',
  'Usa «var client = factory.CreateClient();» y luego «await client.PostAsJsonAsync("/api/citas", dto)». Comprueba el código: «resp.StatusCode.Should().Be(HttpStatusCode.Created)». Para el 409, crea una cita y luego otra solapada. Para la paginación, pide 2 páginas y comprueba que no se repiten ids.',
  'Opciones: cada test usa datos propios (ids nuevos, veterinario creado en el test) o limpias las tablas antes de cada test (TRUNCATE o la librería Respawn). Prueba el orden: ejecuta un solo test con «dotnet test --filter "Nombre"» y luego todos. Si uno pasa solo y falla en grupo, comparten datos.'
],

'w13d6': [
  'En bash: «for i in $(seq 10); do dotnet test --no-build || echo "FALLO en la vuelta $i"; done». En PowerShell: «1..10 | % { dotnet test --no-build }». Si alguna vuelta falla, apunta qué test: los culpables típicos son fechas (DateTime.Now), el orden y los datos compartidos.',
  '«dotnet test tests/VetCare.Domain.Tests --logger "console;verbosity=normal"» muestra cada test con su duración. Ordena mentalmente por tiempo: los que tardan más de 50 ms casi siempre tocan disco, red o tienen un Sleep. Sustitúyelos por dobles.',
  'Mutaciones sencillas: cambia «>» por «>=» en la regla del solape, borra un throw de validación, cambia «+ 30» por «+ 31» en el cálculo del fin. Haz una cada vez y ejecuta la suite. Si alguna deja todo en verde, escribe el test que la detecta y deshaz la mutación.',
  'Recorre el checklist con el código delante y para cada punto pon el nombre del test o del archivo que lo demuestra. Ejemplo: «los tests no dependen del orden → probado ejecutando 10 vueltas». Si no puedes señalar la prueba, márcalo como ✗ y arréglalo.',
  'Estructura: 1) qué testeas (reglas de dominio con unitarios, la API con integración), 2) qué no y por qué (getters, el framework), 3) cómo sabes que sirve (mutaciones detectadas, 10 vueltas estables, tiempo de la suite). Usa números concretos. Grábate.'
],

/* ---------- Semana 14 ---------- */

'w14d1': [
  'Busca «Async(» en Program.cs y en tus endpoints. Para cada llamada mira si recibe ct o no: «ToListAsync()» sin argumentos = no lo recibe. Haz una lista: «GET /citas → ToListAsync() sin ct». Ese número es tu punto de partida.',
  '«app.MapGet("/api/citas", async (VetCareDbContext db, CancellationToken ct) => …)». ASP.NET le pasa el token de la petición: se cancela solo si el cliente cierra la conexión. Va siempre como último parámetro, por convención.',
  'Cada método intermedio necesita su parámetro: «Task<Cita> AgendarAsync(…, CancellationToken ct)», y cada llamada lo pasa: «await _repo.GuardarAsync(cita, ct)». Termina en EF: «ToListAsync(ct)», «SaveChangesAsync(ct)», «FirstOrDefaultAsync(…, ct)». Busca «Async()» con paréntesis vacíos: cada resultado es un eslabón roto.',
  'Opción 1: en la cadena de conexión, «…;Command Timeout=10». Opción 2: «o.UseNpgsql(cs, npg => npg.CommandTimeout(10))». Escribe una tabla en resiliencia.md: | Llamada | Timeout | Por qué |, por ejemplo «consulta de lectura | 10 s | la peor medida es de 300 ms; 10 s ya es un fallo».',
  'Endpoint temporal: «app.MapGet("/prueba/lenta", async (VetCareDbContext db, CancellationToken ct) => { await db.Database.ExecuteSqlRawAsync("SELECT pg_sleep(30)", ct); return Results.Ok(); });». Mide con «time curl -i localhost:5080/prueba/lenta»: debe fallar en unos 10 s. Prueba también a pulsar Ctrl+C en curl a los 2 s: la consulta debe cancelarse en PostgreSQL.'
],

'w14d2': [
  'Criterio: reintenta si el fallo es temporal y repetir no hace daño (408, 429, 500, 502, 503, 504). No reintentes si el error es tuyo o es definitivo (400, 401, 403, 404, 409, 422): por mucho que repitas, la respuesta será la misma. Ejemplo: «422 · no · los datos siguen siendo inválidos».',
  'Estructura: un bucle for de intentos; si la respuesta es de éxito o un error no reintentable, devuélvela; si no, espera «base * 2^intento + aleatorio(0, base)» y repite. Ejemplo con base 200 ms: unos 200, 400 y 800 ms más un poco de azar. El azar (jitter) evita que todos los clientes reintenten en el mismo milisegundo.',
  'HandlerFalso: un HttpMessageHandler que devuelve las respuestas de una cola y cuenta las llamadas: «Respuestas = new Queue<HttpStatusCode>([503, 503, 200])». Assert: «resultado.StatusCode.Should().Be(OK); handler.Llamadas.Should().Be(3);». Usa esperas cortas en el test (base de 1 ms) para que vaya rápido.',
  'Cola con un 400 repetido. Assert: «handler.Llamadas.Should().Be(1)». Si sale 3, tu método reintenta errores definitivos: revisa la condición que decide si un código es reintentable.',
  '«var sc = new ServiceCollection(); sc.AddHttpClient("prueba").ConfigurePrimaryHttpMessageHandler(() => h).AddStandardResilienceHandler(); var cliente = sc.BuildServiceProvider().GetRequiredService<IHttpClientFactory>().CreateClient("prueba");». Repite los dos asserts. Si el test tarda varios segundos, es normal: la librería usa esperas reales.'
],

'w14d3': [
  '«dotnet add src/VetCare.Infrastructure package Microsoft.Extensions.Http.Resilience». Luego «services.AddHttpClient<ClienteCorreo>(…).AddResilienceHandler("correo", b => { b.AddTimeout(…); b.AddRetry(…); b.AddCircuitBreaker(…); });». Fíjate en el orden: es como cebollas, de fuera hacia dentro.',
  '«stateDiagram-v2 / [*] --> Closed / Closed --> Open: % de fallos supera el umbral / Open --> HalfOpen: pasa BreakDuration / HalfOpen --> Closed: la petición de prueba va bien / HalfOpen --> Open: la petición de prueba falla». Pégalo en mermaid.live para comprobar que se dibuja.',
  'En la propia API: «app.MapPost("/fake/siempre-falla", () => Results.StatusCode(503));». En la configuración, apunta la BaseAddress del ClienteCorreo a «http://localhost:5080/fake/siempre-falla». Lo ideal es usar una variable de configuración para poder cambiarla sin recompilar.',
  'Un endpoint o un bucle en el Playground: «for (int i = 0; i < 20; i++) { var sw = Stopwatch.StartNew(); try { await cliente.EnviarAsync(…); } catch (Exception e) { Console.WriteLine($"{i}: {e.GetType().Name} {sw.ElapsedMilliseconds} ms"); } }». Verás un cambio de ~1000 ms a ~1 ms con BrokenCircuitException: el circuito se abrió.',
  'Tras la espera, la siguiente petición es la de prueba (Half-Open): en los logs aparece el intento. Para el cambio a 200, usa una variable estática en el endpoint falso («static bool falla = true» y otro endpoint que la cambie a false). Tras una prueba que vaya bien, las peticiones vuelven a tardar lo normal: el circuito está cerrado.'
],

'w14d4': [
  'Nuevo archivo de migración, por ejemplo 010_operacion_idempotente.sql, con «CREATE TABLE operacion_idempotente ( clave text PRIMARY KEY, respuesta jsonb NOT NULL, creado_en timestamptz NOT NULL DEFAULT now() );». Aplica la migración y comprueba con «\\d operacion_idempotente».',
  'Otra migración con «CREATE TABLE mensaje_outbox (…)» y además «CREATE INDEX ix_outbox_pendientes ON mensaje_outbox (creado_en) WHERE procesado_en IS NULL;». Ese índice parcial hace que buscar los pendientes sea rápido aunque la tabla tenga millones de mensajes procesados.',
  'Al inicio del endpoint: si no llega la cabecera → 400. Busca la clave: si existe, devuelve la respuesta guardada con el mismo código. Si no, crea la cita y guarda la clave y la respuesta en la MISMA transacción. Prueba: dos curl con la misma clave → mismo id, y una sola fila en la tabla cita.',
  'Sustituye «await _correo.EnviarAsync(…)» por «db.MensajesOutbox.Add(new MensajeOutbox { Tipo = "ConfirmacionCita", Payload = JsonSerializer.Serialize(…) });» antes del SaveChangesAsync. Así la cita y el mensaje se guardan juntos o no se guarda ninguno.',
  '«class ProcesadorOutbox : BackgroundService { protected override async Task ExecuteAsync(CancellationToken ct) { while (!ct.IsCancellationRequested) { using var scope = _sp.CreateScope(); … await Task.Delay(TimeSpan.FromSeconds(5), ct); } } }». Usa un scope nuevo en cada vuelta (el DbContext es scoped). Si falla un mensaje, incrementa intentos y sigue con los demás. Regístralo con AddHostedService.'
],

'w14d5': [
  'Filas típicas: PostgreSQL (crítica · error 503 · «servicio no disponible, inténtalo en unos minutos»), correo (no crítica · se encola · «recibirás la confirmación más tarde»), SMS (no crítica · se omite · nada), clima/feriados si los usas (no crítica · valor por defecto). Una dependencia es crítica si sin ella la operación principal no tiene sentido.',
  '«try { … } catch (Exception ex) { _logger.LogWarning(ex, "Fallo en {Dependencia}, uso fallback", "correo"); _fallbacks.Add(1, new KeyValuePair<string, object?>("dependencia", "correo")); return valorPorDefecto; }». El contador es un Counter<long> de System.Diagnostics.Metrics. Un catch vacío esconde los problemas: nunca lo dejes así.',
  'Abre la configuración de health checks: /health/ready solo debe comprobar lo marcado como crítico (normalmente la base de datos). Si comprueba el correo, el balanceador sacaría la API del servicio cuando falle el correo, aunque se podrían seguir dando citas.',
  '«public record CitaResponse(Guid Id, …, IReadOnlyList<string> Avisos);». Si el correo falló o se encoló: «Avisos = ["La confirmación por correo llegará en unos minutos"]». El frontend puede mostrarlo como aviso amarillo, no como error.',
  'Apaga el servidor falso de correo. Con curl: el POST debe dar 201 con «avisos» en el JSON; «curl -i /health/ready» debe dar 200; en la consola debe aparecer el Warning. Si una de las cuatro cosas no ocurre, vuelve al paso correspondiente.'
],

'w14d6': [
  'Para cada experimento: hipótesis (escrita ANTES), qué hiciste exactamente (comandos), qué pasó (con tiempos y códigos) y si coincide. Ejemplo: «Hipótesis: con PostgreSQL apagado, POST /citas responde 503 en menos de 2 s. Realidad: tardó 15 s → el timeout de conexión no estaba configurado».',
  'Arregla una cosa cada vez y repite el experimento entero, no solo el paso que falló. Anota la corrección junto al experimento: «Añadido Timeout=2 en la cadena de conexión → ahora 503 en 2,1 s ✓».',
  'Para cada punto del checklist, escribe archivo:línea o el nombre del test. «Timeouts en llamadas externas → ClienteCorreo.cs:24 (AddTimeout de 5 s)». Si solo puedes decir «creo que lo hice», márcalo como no hecho.',
  'En tests/VetCare.Api.Tests: dos POST con «client.DefaultRequestHeaders.Add("Idempotency-Key", clave)» y el mismo cuerpo. Assert: los dos responden con el mismo id, y una consulta directa a la base «SELECT count(*) FROM cita WHERE …» devuelve 1.',
  'Orden fijo: 1) qué puede fallar (base, correo, SMS, la red), 2) qué hace VetCare en cada caso (timeout, reintento, circuito, cola, aviso), 3) cómo lo comprobaste (experimentos y tests). Con un ejemplo concreto en cada punto. Cronométrate: 3 minutos son menos de lo que parece.'
],

/* ---------- Semana 15 ---------- */

'w15d1': [
  'Busca en cada .csproj las líneas «<ProjectReference Include="…" />». Dibuja una caja por proyecto y una flecha por referencia. Correcto: Api → Application/Infrastructure → Domain. Cualquier flecha que SALGA de Domain es un error que hay que corregir hoy.',
  'Busca en la carpeta src/VetCare.Domain: «using Microsoft.EntityFrameworkCore», «using Npgsql», «using Microsoft.AspNetCore», «using System.Net.Http». También atributos como [Table] o [Column] de EF. Anota archivo y línea de cada fuga.',
  'Ejemplo: si Domain usa DbContext directamente, crea «IRepositorioCitas» en Domain y «RepositorioCitasEf» en Infrastructure. Los atributos de EF ([Key], [Table]) pasan a configuración en OnModelCreating, dentro de Infrastructure. Compila después de cada fuga arreglada.',
  '«[Fact] public void Domain_NoDependeDeInfraestructura() { var refs = typeof(Cita).Assembly.GetReferencedAssemblies().Select(a => a.Name); refs.Should().NotContain(n => n!.Contains("EntityFramework") || n.Contains("Npgsql") || n.Contains("AspNetCore")); }». Prueba que funciona: añade un using de EF en Domain → el test debe ponerse rojo.',
  '«graph LR; Api --> Application; Api --> Infrastructure; Infrastructure --> Domain; Application --> Domain». Frase de ejemplo: «Como el dominio no depende de nada, puedo probar todas las reglas sin base de datos y cambiar EF Core por otra tecnología sin tocar las reglas de negocio».'
],

'w15d2': [
  '«dotnet new classlib -o src/VetCare.Application», «dotnet sln add …», «dotnet add src/VetCare.Application reference src/VetCare.Domain», «dotnet add src/VetCare.Api reference src/VetCare.Application». Comprueba: Application no debe referenciar Infrastructure.',
  'En Application: «record AgendarCitaComando(Guid MascotaId, Guid VeterinarioId, DateTime Inicio)», «record AgendarCitaResultado(Guid CitaId)», «interface IAgendarCita { Task<AgendarCitaResultado> EjecutarAsync(AgendarCitaComando c, CancellationToken ct); }» y la clase que la implementa, que orquesta: repositorio, ServicioAgenda (que sigue en Domain) y guardado.',
  'El endpoint queda así: «async (CrearCitaDto dto, IAgendarCita caso, CancellationToken ct) => { var r = await caso.EjecutarAsync(new(dto.MascotaId, …), ct); return Results.Created($"/api/citas/{r.CitaId}", r); }». Los errores se traducen en el manejador global. Si el endpoint tiene un if de negocio, todavía no está adelgazado.',
  '«dotnet new console -o src/VetCare.Cli», con referencias a Application e Infrastructure. Monta el contenedor (los mismos registros que la API), resuelve IAgendarCita y ejecútalo con datos de args. Si agenda una cita igual que el POST, has demostrado que HTTP es solo un adaptador.',
  'Mermaid: «graph LR; Api[Adaptador HTTP] --> Puertos; Cli[Adaptador consola] --> Puertos; subgraph Hexágono; Puertos[IAgendarCita] --> Dominio; end; Dominio --> IRepo[IRepositorioCitas]; IRepo -.implementa.- Ef[RepositorioEf]; Dominio --> INotif[INotificador]; INotif -.implementa.- Smtp[NotificadorSmtp]».'
],

'w15d3': [
  'Estructura: Application/Comandos/AgendarCita.cs, Application/Consultas/IAgendaDelDia.cs y FilaAgendaDto.cs, Infrastructure/Consultas/AgendaDelDiaEf.cs. Regla: en Consultas de Application solo hay contratos (interfaces y DTOs), nunca código de EF.',
  'Proyección directa: «db.Citas.Where(c => c.Inicio >= desde && c.Inicio < hasta).OrderBy(c => c.Inicio).Select(c => new FilaAgendaDto(c.Id, c.Inicio, c.Fin, c.Mascota.Nombre, c.Mascota.Dueno.Nombre, c.Estado.ToString())).ToListAsync(ct)». Sin Include y sin cargar agregados: EF genera un SELECT con solo esas columnas.',
  'Copia el SQL de cada versión del log de EF y ejecútalo en psql con EXPLAIN ANALYZE delante. Anota: «con repositorio: 3 consultas, 12 ms en total; proyección: 1 consulta, 2 ms». Si la diferencia es pequeña con tus datos, prueba con las 500.000 citas de la semana 10.',
  '«db.Database.SqlQueryRaw<ResumenMesDto>("SELECT date_trunc(\'month\', inicio) AS mes, count(*) AS citas FROM cita WHERE extract(year FROM inicio) = {0} GROUP BY 1 ORDER BY 1", anio)». El {0} se convierte en un parámetro real. Nunca uses $"… = {anio}" dentro de SqlQueryRaw: ahí sí estarías concatenando.',
  'Dos reglas con su porqué: «Escrituras → dominio: aquí viven las invariantes y no se las puede saltar nadie». «Lecturas → proyección directa: no cambian nada, así que no necesitan las reglas, y así se cargan solo los datos que se muestran». Añade la excepción: lecturas que necesitan una regla del dominio.'
],

'w15d4': [
  '«public abstract class EntidadBase { private readonly List<IEventoDominio> _eventos = new(); public IReadOnlyList<IEventoDominio> Eventos => _eventos; protected void Registrar(IEventoDominio e) => _eventos.Add(e); public void LimpiarEventos() => _eventos.Clear(); }». Cita, Visita y Factura heredan de ella. Que la lista no se mapee a ninguna columna: en EF, «e.Ignore(x => x.Eventos)».',
  '«public record CitaAgendada(Guid CitaId, Guid MascotaId, Guid VeterinarioId, DateTime Inicio) : IEventoDominio;». Nombre en pasado y datos mínimos: ids y lo imprescindible, no la entidad entera. En el método del dominio: «Registrar(new CitaAgendada(Id, …));» al final, cuando todo ha ido bien.',
  '«public async Task DespacharAsync(IEventoDominio e, CancellationToken ct) { var tipo = typeof(IManejador<>).MakeGenericType(e.GetType()); foreach (dynamic m in _sp.GetServices(tipo)) await m.ManejarAsync((dynamic)e, ct); }». Regístralo con AddScoped. Cada manejador con «services.AddScoped<IManejador<CitaAgendada>, EncolarConfirmacion>()».',
  'Antes de SaveChangesAsync, recorre las entidades con eventos (ChangeTracker.Entries<EntidadBase>()), despáchalos y limpia la lista. EncolarConfirmacion añade el MensajeOutbox al mismo DbContext, así se guarda en la misma transacción. Compara las líneas del caso de uso antes y después.',
  '«var cita = Cita.Agendar(…); cita.Eventos.Should().ContainSingle().Which.Should().BeOfType<CitaAgendada>().Which.MascotaId.Should().Be(mascotaId);». Sin base de datos y sin contenedor: el dominio produce eventos sin saber quién los escucha.'
],

'w15d5': [
  'Cuatro módulos por capacidad de negocio: Agenda (citas, horarios), Clínica (mascotas, visitas, vacunas), Clientes (dueños) y Facturación. Flecha con etiqueta: «Facturación → Clínica: necesita las visitas atendidas de una mascota en un mes». Si no puedes poner etiqueta, la flecha sobra.',
  'Ejemplo: «public interface IClinicaPublica { Task<IReadOnlyList<VisitaFacturable>> VisitasSinFacturarAsync(Guid duenoId, CancellationToken ct); }» con «record VisitaFacturable(Guid VisitaId, DateOnly Fecha, string Concepto, decimal Precio)». Dos o tres métodos por módulo, no veinte. Records planos: nunca devuelvas entidades internas.',
  'Busca en las consultas LINQ y SQL los JOIN entre tablas de módulos distintos (cita con factura, mascota con factura…). Lista: «AgendaDelDia une cita (Agenda) con dueno (Clientes)». No tienes que arreglarlos hoy: lo importante es saber cuántos son.',
  'Sustituye el JOIN por dos pasos: obtén los ids del módulo propio y luego llama a «IClientesPublica.NombresAsync(ids)». Mide el tiempo antes y después. Si pasa de 5 ms a 500 ms, esos datos se usan juntos tanto que quizá deberían estar en el mismo módulo: anótalo.',
  'Los tres criterios con números: contratos por módulo (lo sano es pocos y pequeños), veces que un cambio tocó dos módulos a la vez (mira «git log --stat»: commits que tocan carpetas de dos módulos) y si podrías extraer un módulo a otro servicio sin reescribirlo. Conclusión en 3 o 4 líneas.'
],

'w15d6': [
  'Archivos como docs/adr/004-capas.md … 008-modulos.md (sigue tu numeración). Plantilla: Título · Estado (aceptada) · Contexto (qué problema había) · Decisión (en una frase) · Alternativas · Consecuencias + y − · Verificación. Reutiliza lo que escribiste cada día en arquitectura.md.',
  'Ejemplo para CQRS ligero: «Alternativa 1: leer siempre por el repositorio del dominio → descartada: carga agregados completos para pintar una tabla (12 ms frente a 2 ms). Alternativa 2: base de lectura separada → descartada: complejidad de sincronización sin necesidad con el volumen actual».',
  'Preguntas para encontrarlas: ¿qué es más lento o más difícil ahora? ¿Qué tendrá que aprender alguien nuevo? ¿Qué código se duplica? Ejemplo: «Hexagonal: más proyectos y más archivos; un cambio pequeño toca 3 capas; quien venga de MVC tardará en orientarse».',
  'Ejemplos: «Capas → test Domain_NoDependeDeInfraestructura», «Eventos → test Agendar_RegistraCitaAgendada», «Módulos → revisión mensual de JOIN entre módulos con grep». Escribe el nombre exacto del test o el comando, para que cualquiera pueda comprobarlo.',
  'Las cuatro partes en orden, 45 segundos cada una más o menos: qué decidiste, qué descartaste y por qué, qué te cuesta, y qué señal te haría cambiar («si un módulo necesita los datos de otro en cada consulta, los fusionaría»). Esa última parte demuestra criterio en una entrevista. Grábate.'
],

/* ---------- Semana 16 ---------- */

'w16d1': [
  'Desde la raíz de VetCare: «npm create vite@latest web -- --template react-ts», luego «cd web», «npm install» y «npm run dev». Abre la URL que muestra (normalmente http://localhost:5173). Si ves el logo de Vite y React con el contador, ya está.',
  'Llama a tu API con curl y copia un JSON real. Tradúcelo: «export interface Cita { id: string; inicio: string; fin: string; mascotaNombre: string; duenoNombre: string; estado: EstadoCita; }» y «export type EstadoCita = "pendiente" | "confirmada" | "atendida" | "cancelada";». Las fechas llegan como string en JSON, no como Date.',
  '«const etiquetas: Record<EstadoCita, string> = { pendiente: "Pendiente", confirmada: "Confirmada", atendida: "Atendida", cancelada: "Cancelada" };». Añade «| "no_asistio"» al tipo: TypeScript debe marcar el objeto en rojo porque falta una clave. Ese error es el que te salvará cuando el backend añada un estado nuevo.',
  'FilaCita recibe «{ cita: Cita; onCancelar: (id: string) => void }» y TablaCitas recibe «{ citas: Cita[]; onCancelar: (id: string) => void }» y hace «citas.map(c => <FilaCita key={c.id} cita={c} onCancelar={onCancelar} />)». Por ahora, onCancelar puede ser un «console.log».',
  'Instala la extensión React Developer Tools (Chrome o Firefox). En las DevTools aparece la pestaña Components: busca FilaCita y mira el panel derecho. Deben estar «cita» con sus campos y «onCancelar» como función. Si falta algo o sobra algo, revisa la interfaz de props.'
],

'w16d2': [
  'Estado mínimo: «const [citas, setCitas] = useState(citasIniciales); const [filtro, setFiltro] = useState<EstadoCita | "todas">("todas");». Derivado en el render, sin useState: «const visibles = filtro === "todas" ? citas : citas.filter(c => c.estado === filtro); const total = visibles.length;».',
  '«setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: "cancelada" } : c));». map devuelve un array nuevo y el spread crea un objeto nuevo solo para la cita cambiada. En DevTools, el array de citas cambia de referencia después de cada cancelación.',
  'Escribe exactamente eso, pulsa el botón y verás que no pasa nada. React compara la referencia vieja con la nueva: como es el mismo array, decide que no hay nada que repintar. Escribe la explicación en un comentario y luego vuelve al patrón inmutable.',
  '«const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null); const seleccionada = citas.find(c => c.id === seleccionadaId);». Guarda solo el id, no una copia de la cita: así, si cancelas la cita seleccionada, el panel muestra el estado nuevo sin hacer nada más.',
  'Las tres preguntas: ¿cambia con el tiempo? ¿Viene de las props? ¿Se puede calcular a partir de otro estado o de las props? Si no cambia, o viene de props, o se puede calcular, no es estado: bórralo y calcúlalo. Anota «quité 2 useState: total y citasFiltradas».'
],

'w16d3': [
  '«function Buscador({ valor, onCambiar }: { valor: string; onCambiar: (v: string) => void }) { return <input value={valor} onChange={e => onCambiar(e.target.value)} />; }». En el padre: «const [texto, setTexto] = useState("")» y «<Buscador valor={texto} onCambiar={setTexto} />». El Buscador no tiene useState propio.',
  'PanelDetalle con «const [notas, setNotas] = useState("")» dentro. Escribe algo en las notas de la cita A, selecciona la cita B: el texto sigue ahí. React reutiliza el mismo componente en la misma posición del árbol y conserva su estado.',
  '«<PanelDetalle key={seleccionada.id} cita={seleccionada} />». Al cambiar la key, React desmonta el componente y monta uno nuevo, con el estado vacío. Repite la prueba: ahora las notas se vacían al cambiar de cita.',
  'Árbol en texto o en Mermaid: «PaginaAgenda (citas, filtro, seleccionadaId, texto) → Buscador · TablaCitas → FilaCita · PanelDetalle (notas)». Junto a cada estado, el motivo: «seleccionadaId vive en PaginaAgenda porque la usan TablaCitas (resalta la fila) y PanelDetalle (la muestra)».',
  'Sigue cada prop desde donde nace hasta donde se usa. Si pasa por un componente que solo la reenvía sin usarla, anótala: «onCancelar: Pagina → Tabla → Fila (Tabla solo la pasa)». Con dos niveles es normal; con tres o más, considera contexto o pasar el componente como children.'
],

'w16d4': [
  'Los cuatro casos innecesarios: calcular datos a partir de props o estado, reaccionar a un evento del usuario (eso va en el handler), reiniciar estado cuando cambia una prop (usa key) y encadenar estados. Para cada useEffect escribe a qué caso corresponde o «necesario: sincroniza con la red».',
  '«export function useCitasDelDia(dia: string) { const [datos, setDatos] = useState<Cita[]>([]); const [cargando, setCargando] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { const control = new AbortController(); fetch(`/api/v1/agenda?dia=${dia}`, { signal: control.signal })… ; return () => control.abort(); }, [dia]); return { datos, cargando, error }; }».',
  'Backend: «app.MapGet("/api/v1/agenda", async (DateOnly dia, IAgendaDelDia q, CancellationToken ct) => Results.Ok(new { datos = await q.EjecutarAsync(dia, ct) }));». En vite.config.ts: «server: { proxy: { "/api": "http://localhost:5080" } }» con tu puerto. Reinicia «npm run dev» después de cambiar la configuración.',
  'En el backend, añade «await Task.Delay(dia.Day % 2 == 0 ? 3000 : 500, ct);» al endpoint. Cambia de día A a B y vuelve a A rápido: con abort, ves los datos correctos. Comenta la línea «return () => control.abort()» y repite: verás los datos de un día debajo del título de otro. Quita el retardo al terminar.',
  'En la pestaña Network verás dos peticiones al cargar: la primera aparece como cancelada (canceled) y la segunda completa. Eso lo produce StrictMode en desarrollo. Si sin el abort se ven datos duplicados o parpadeos, tu efecto no limpiaba bien; en producción solo hay una petición.'
],

'w16d5': [
  '«type Formulario = { mascotaId: string; veterinarioId: string; inicio: string; motivo: string }; const [form, setForm] = useState<Formulario>(vacio); function cambiar<K extends keyof Formulario>(campo: K, valor: Formulario[K]) { setForm(f => ({ ...f, [campo]: valor })); }». Cada input usa «onChange={e => cambiar("motivo", e.target.value)}».',
  '«const [tocados, setTocados] = useState<Partial<Record<keyof Formulario, boolean>>>({});». En cada input: «onBlur={() => setTocados(t => ({ ...t, motivo: true }))}». Los errores se calculan siempre, pero se muestran solo si «tocados.motivo || intentoEnviar».',
  '«const [enviando, setEnviando] = useState(false);» y en el submit: «if (enviando) return; setEnviando(true); try { … } finally { setEnviando(false); }». Botón: «<button disabled={enviando}>{enviando ? "Guardando…" : "Agendar"}</button>». Haz doble clic rápido y comprueba en Network que solo sale un POST.',
  'Si «res.status === 409», lee el problem+json y muestra un mensaje propio: «Ese horario ya está ocupado para el Dr. Pérez. Elige otra hora». Si es 422, recorre «errors» y coloca cada mensaje junto a su campo. El usuario nunca debe ver «{"type":"…"}».',
  'Para el backend con Ctrl+C. fetch lanza un TypeError («Failed to fetch»): captúralo con «catch (e) { setError("No hay conexión con el servidor. Revisa tu red e inténtalo de nuevo."); }». El formulario debe conservar lo escrito para poder reenviarlo cuando vuelva la conexión.'
],

'w16d6': [
  'Recorre los siete puntos uno por uno contra la aplicación real (no contra los datos falsos): cambiar de día, filtrar, ver detalle, crear, cancelar… Marca cada uno con la prueba que hiciste. Si uno funciona solo con datos falsos, no está hecho.',
  'Los cuatro estados: cargando (esqueleto o texto), error (mensaje y botón de reintentar), vacío y con datos. Vacío: «No hay citas para el martes 10 de junio» con un botón «Agendar una cita». Prueba cada estado de verdad: un día sin citas, el backend apagado, un retardo para ver la carga.',
  'Para cada punto, abre el archivo y busca la línea que lo cumple. Si algo falla (por ejemplo, un estado duplicado), arréglalo en ese momento. Escribe en frontend.md lo que corregiste: es más valioso que una lista llena de ✓.',
  '«npx tsc -b» debe terminar sin ninguna salida. Busca any: «grep -rn "any" web/src --include=*.ts --include=*.tsx» y revisa los resultados (algunos serán palabras dentro de textos). Sustituye cada any por el tipo real o, si de verdad no lo conoces, por unknown y una comprobación.',
  'Recorre la pantalla solo con el teclado: Tab llega a todos los botones en un orden lógico, el foco se ve, Enter y Espacio funcionan y Escape cierra lo que esté abierto. Anota cada problema encontrado y cómo lo resolviste (o que queda pendiente, con el motivo).'
]

});
