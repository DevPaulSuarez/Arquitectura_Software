window.WEEKS = (window.WEEKS || []).concat([
{
  n: 12,
  phase: 'Backend y APIs',
  title: 'Construir la API de VetCare con ASP.NET Core',
  idea: 'Llegó el momento de juntar todo: el dominio de la fase 3, el esquema de la fase 5 y el contrato de la semana 11 se convierten en una API que corre de verdad. Esta semana escribes el backend completo y lo ves responder en el navegador.',
  res: [
    { t: 'Microsoft Learn — Tutorial: Create a minimal API',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api',
      note: 'Tutorial oficial paso a paso. Sigue este orden exacto el día 1.' },
    { t: 'Microsoft Learn — Middleware in ASP.NET Core',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/',
      note: 'Cómo se compone el pipeline de peticiones. Material del día 2.' },
    { t: 'Microsoft Learn — EF Core: Getting started',
      u: 'https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app',
      note: 'El ORM que vas a usar para hablar con PostgreSQL. Días 3 y 4.' },
    { t: 'Microsoft Learn — Model validation',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation',
      note: 'Data annotations y validación automática. Día 5.' },
    { t: 'Microsoft Learn — EF Core: Loading Related Data', u: 'https://learn.microsoft.com/en-us/ef/core/querying/related-data/', note: 'Include, carga explícita y lazy loading: cómo evitar el N+1.' },
    { t: 'Microsoft Learn — Generate OpenAPI documents', u: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi', note: 'Documentación de la API con Microsoft.AspNetCore.OpenApi.' }
  ],
  days: [
    {
      t: 'Primera API que responde',
      obj: 'Levantar un proyecto ASP.NET Core y servir los primeros endpoints.',
      why: 'Ver tu propio JSON en el navegador es el momento en que todo lo abstracto se vuelve real. Y Minimal APIs es la forma en que se empiezan hoy los servicios nuevos en .NET.',
      study: { r: 0, what: 'Sigue el tutorial hasta la sección "Test the API". Unos 25 minutos, haciéndolo, no solo leyéndolo. Busca una cosa: qué hace WebApplication.CreateBuilder y qué hace app.Run.',
        pasos: [
          'Lee "Prerequisites" y haz "Create an API project" (~6 min).',
          'Lee "Examine the code" (~3 min): qué hacen WebApplication.CreateBuilder, builder.Build y app.Run.',
          'Haz "Add NuGet packages" y "The model and database context classes" (~5 min).',
          'Haz "Replace the WeatherForecast sample with the Todo API" y "Test posting data" (~8 min).',
          'Haz "Examine the GET endpoints" y "Test the GET endpoints" (~4 min). Para aquí: el resto lo verás mañana.'
        ] },
      ex: { title: 'Program.cs mínimo', body: `dotnet new web -o src/VetCare.Api
dotnet sln add src/VetCare.Api
dotnet add src/VetCare.Api reference src/VetCare.Domain src/VetCare.Infrastructure
dotnet add src/VetCare.Api package Microsoft.AspNetCore.OpenApi

// src/VetCare.Api/Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/health", () => Results.Ok(new { estado = "ok" }));

app.MapGet("/api/v1/citas", () =>
{
    var citas = new[]
    {
        new { id = Guid.NewGuid(), inicio = "2026-03-10T10:00:00Z", estado = "agendada" },
        new { id = Guid.NewGuid(), inicio = "2026-03-10T11:00:00Z", estado = "confirmada" }
    };
    return Results.Ok(new { datos = citas });
});

var idDePrueba = Guid.Parse("5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f");

app.MapGet("/api/v1/citas/{id:guid}", (Guid id) =>
    id == idDePrueba
        ? Results.Ok(new { id, estado = "agendada" })
        : Results.NotFound());

app.MapPost("/api/v1/citas", (CrearCitaRequest req) =>
{
    var nuevoId = Guid.NewGuid();
    return Results.Created($"/api/v1/citas/{nuevoId}",
        new { id = nuevoId, estado = "agendada" });
});

app.Run();

record CrearCitaRequest(
    Guid MascotaId, Guid VeterinarioId,
    DateTimeOffset Inicio, int DuracionMinutos, string? Motivo);

QUÉ ES CADA PIEZA

CreateBuilder   arma configuración, logging y el contenedor DI
builder.Services  aquí registras tus dependencias
builder.Build()   congela el contenedor y crea la app
app.MapGet...     define rutas
app.Run()         arranca el servidor y bloquea

Results.Ok        200 con cuerpo
Results.Created   201 con header Location
Results.NotFound  404
Results.NoContent 204

El binding es automático:
{id:guid} de la ruta, el record del cuerpo JSON,
[FromQuery] de la query string.` },
      steps: [
        'Crea el proyecto con los comandos del ejemplo (dotnet new web, añadirlo a la solución, referencias y paquete de OpenAPI).',
        'Implementa /health y los tres endpoints de citas con datos falsos en memoria.',
        'Corre dotnet run y prueba cada endpoint con curl -i, verificando el código de estado de cada uno.',
        'Comprueba que POST devuelve 201 y que el header Location apunta a la ruta correcta.',
        'Abre /openapi/v1.json en el navegador y comprueba que ya se genera la especificación sola.'
      ],
      vet: [
        'Las rutas deben coincidir exactamente con tu docs/api-contract.md de la semana 11.',
        'Si encuentras diferencias, decide cuál es la correcta y actualiza el documento o el código. El contrato manda.'
      ],
      edge: [
        'Si el POST devuelve 415, falta el header Content-Type: application/json en tu curl.',
        'Los records usados como parámetro de cuerpo deben tener constructor público y propiedades coincidentes con el JSON en camelCase.',
        'MapGet con la misma ruta dos veces no da error al arrancar, pero la primera petición a esa ruta falla con AmbiguousMatchException (un 500). Revisa duplicados.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre builder.Services y app?', a: 'builder.Services es donde registras dependencias antes de construir la aplicación. Una vez llamas a Build el contenedor queda cerrado y app sirve para configurar el pipeline y las rutas.' },
        { q: '¿Cómo decide ASP.NET Core de dónde sacar cada parámetro de un endpoint?', a: 'Por convención: los tipos simples que coinciden con un segmento de ruta vienen de la ruta, los tipos simples restantes de la query string, los tipos complejos del cuerpo JSON y los servicios registrados del contenedor.' },
        { q: '¿Por qué Results.Created es mejor que Results.Ok al crear?', a: 'Porque 201 comunica que se creó un recurso nuevo y permite incluir el header Location con su URL, de modo que el cliente sabe dónde consultarlo sin construir la ruta a mano.' },
        { q: '¿Para qué sirve el endpoint /health?', a: 'Permite que orquestadores, balanceadores y monitoreo comprueben si la instancia está viva sin golpear un endpoint de negocio. Es la base de los reinicios automáticos y del despliegue sin caídas.' }
      ],
      out: 'API corriendo con /health y tres endpoints de citas devolviendo los códigos correctos.',
      file: 'src/VetCare.Api/Program.cs'
    },
    {
      t: 'El pipeline y los middlewares',
      obj: 'Entender cómo se procesa una petición y agregar comportamiento transversal.',
      why: 'Logging, manejo de errores, CORS y autenticación son middlewares. Si entiendes el pipeline, dejas de copiar líneas mágicas y empiezas a saber por qué el orden importa.',
      study: { r: 1, what: 'Lee el artículo completo, en especial el diagrama del pipeline y la sección "Middleware order". Unos 18 minutos. Busca una cosa: qué pasa si un middleware no llama a next.',
        pasos: [
          'Lee la introducción y el diagrama del pipeline (~4 min): cada middleware puede actuar antes y después del siguiente.',
          'Lee "Middleware code analysis" y "Create a middleware pipeline with WebApplication" (~5 min).',
          'Lee "Run delegate" (~2 min): un middleware que no llama a next corta la cadena.',
          'Lee "Middleware order" (~5 min) y copia el orden recomendado.',
          'Escribe un middleware que mida el tiempo de cada petición y comprueba en qué posición debe ir.'
        ] },
      ex: { title: 'Pipeline y middleware propio', body: `EL PIPELINE ES UNA CEBOLLA

petición ->  Excepciones
             -> Logging
                -> CORS
                   -> Autenticación
                      -> Autorización
                         -> Endpoint
                      <-
                   <-
                <-
             <-
respuesta <-

Cada middleware puede actuar antes y después
de llamar al siguiente.

MIDDLEWARE PROPIO: correlación y tiempo

app.Use(async (context, next) =>
{
    var traceId = context.TraceIdentifier;
    context.Response.Headers["X-Trace-Id"] = traceId;

    var sw = System.Diagnostics.Stopwatch.StartNew();
    await next();                   // ejecuta el resto del pipeline
    sw.Stop();

    app.Logger.LogInformation(
        "{Metodo} {Ruta} -> {Codigo} en {Ms} ms (trace {Trace})",
        context.Request.Method,
        context.Request.Path,
        context.Response.StatusCode,
        sw.ElapsedMilliseconds,
        traceId);
});

MANEJO GLOBAL DE ERRORES
(arriba del todo del archivo: using Microsoft.AspNetCore.Diagnostics;)

app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        var feature = context.Features
            .Get<IExceptionHandlerPathFeature>();

        var (codigo, titulo) = feature?.Error switch
        {
            HorarioOcupadoException => (409, "Horario no disponible"),
            NoEncontradoException   => (404, "Recurso no encontrado"),
            ReglaNegocioException   => (422, "Regla de negocio violada"),
            _                       => (500, "Error interno")
        };

        context.Response.StatusCode = codigo;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(new
        {
            type = "https://api.vetcare.local/errores/" + codigo,
            title = titulo,
            status = codigo,
            instance = context.Request.Path.Value,
            traceId = context.TraceIdentifier
        });
    });
});

EL ORDEN IMPORTA Y NO ES NEGOCIABLE

app.UseExceptionHandler(...);   // primero: envuelve a todos
app.UseHttpsRedirection();
app.UseCors("front");
app.UseAuthentication();        // siempre antes que
app.UseAuthorization();         // la autorización
app.MapGet(...);                // los endpoints al final

Si pones UseAuthorization antes de UseAuthentication,
el usuario siempre será anónimo y nada funcionará.

Si un middleware NO llama a next, la petición
termina ahí (eso es lo que hace, por ejemplo,
un middleware de rate limiting al devolver 429).` },
      steps: [
        'Agrega el middleware de logging con tiempo y traceId, y comprueba el header X-Trace-Id en la respuesta.',
        'Agrega UseExceptionHandler y crea tres excepciones propias en el dominio.',
        'Lanza cada excepción desde un endpoint de prueba y verifica que sale el código correcto en formato problem+json.',
        'Experimento del orden: añade antes de tu middleware de logging un app.Use que responda 503 sin llamar a next (un "modo mantenimiento") y observa que el log ya no aparece. Muévelo detrás del logging y compara.',
        'Lanza una excepción no controlada y confirma que el cliente recibe 500 sin stack trace.'
      ],
      vet: [
        'Las excepciones de VetCare: HorarioOcupadoException, NoEncontradoException, ReglaNegocioException.',
        'Los tipos de error deben coincidir con el catálogo que definiste en docs/api-contract.md.'
      ],
      edge: [
        'En desarrollo puedes mostrar detalles del error; en producción nunca. Usa app.Environment.IsDevelopment para decidir.',
        'Un middleware que escribe en el cuerpo y luego llama a next provoca el error de headers ya enviados.',
        'UseExceptionHandler debe ir primero para capturar fallos de los middlewares posteriores.'
      ],
      quiz: [
        { q: '¿Qué pasa si un middleware no llama a next?', a: 'El pipeline se corta ahí y los middlewares y endpoints posteriores no se ejecutan. Es el mecanismo que usan el rate limiting, el cache y la autorización para responder sin llegar al endpoint.' },
        { q: '¿Por qué UseAuthentication debe ir antes de UseAuthorization?', a: 'Porque la autenticación es la que construye la identidad del usuario a partir del token. Si la autorización se ejecuta antes, no hay identidad que evaluar y todo se trata como anónimo.' },
        { q: '¿Por qué UseExceptionHandler va al principio del pipeline?', a: 'Porque el middleware envuelve a todo lo que viene después. Si lo pones al final, no puede capturar las excepciones lanzadas por los middlewares anteriores a él.' },
        { q: '¿Cómo se relaciona el traceId con la depuración en producción?', a: 'Se devuelve al cliente en el error y se escribe en cada línea de log de esa petición. El usuario reporta el id y tú encuentras la traza exacta sin tener que adivinar qué petición fue.' }
      ],
      out: 'Pipeline con logging, traceId y manejo global de errores en formato problem+json.',
      file: 'src/VetCare.Api/Program.cs'
    },
    {
      t: 'EF Core: conectar con PostgreSQL',
      obj: 'Mapear tus entidades a las tablas reales y leer datos de la base.',
      why: 'EF Core es el ORM estándar de .NET y aparece en casi toda oferta de trabajo. Como ya sabes SQL de verdad, vas a usarlo bien en vez de confiar ciegamente.',
      study: { r: 2, what: 'Lee el tutorial hasta "Create the database" y luego la página de configuración de Npgsql. Unos 25 minutos. Busca una cosa: qué hace el change tracker del DbContext.',
        pasos: [
          'Lee "Create the model" (~4 min): el DbContext y las clases que mapea.',
          'Lee "Create the database" (~3 min): migraciones con dotnet ef. Solo para conocerlas: en VetCare el esquema lo mandan tus migraciones SQL de la semana 10.',
          'Lee "Create, read, update & delete" (~4 min) y fíjate en que SaveChanges es el momento en que se escribe.',
          'En la documentación de Npgsql (npgsql.org/efcore) mira cómo se configura UseNpgsql con la cadena de conexión (~5 min).',
          'Escribe en una línea qué hace el change tracker: recuerda qué cargaste y detecta qué cambió para generar los UPDATE.'
        ] },
      ex: { title: 'DbContext y configuración explícita', body: `dotnet add src/VetCare.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL

public class VetCareDbContext : DbContext
{
    public VetCareDbContext(DbContextOptions<VetCareDbContext> options)
        : base(options) { }

    public DbSet<Dueno> Duenos => Set<Dueno>();
    public DbSet<Mascota> Mascotas => Set<Mascota>();
    public DbSet<Cita> Citas => Set<Cita>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Cita>(e =>
        {
            e.ToTable("cita");
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).HasColumnName("id");
            e.Property(c => c.Inicio).HasColumnName("inicio");
            e.Property(c => c.Fin).HasColumnName("fin");
            // en la base el estado va en minúsculas ('agendada'),
            // como exige el CHECK de la semana 9
            e.Property(c => c.Estado)
                .HasColumnName("estado")
                .HasMaxLength(20)
                .HasConversion(
                    v => v.ToString().ToLowerInvariant(),
                    v => Enum.Parse<EstadoCita>(v, true));

            // Cita apunta a Mascota solo por Id (agregados, semana 4)
            e.HasOne<Mascota>()
             .WithMany()
             .HasForeignKey(c => c.MascotaId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(c => new { c.VeterinarioId, c.Inicio });
        });
    }
}

REGISTRO

builder.Services.AddDbContext<VetCareDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("VetCare")));

LA CADENA DE CONEXIÓN, SIN CONTRASEÑAS EN EL REPOSITORIO
(user-secrets la guarda fuera de la carpeta del proyecto)

dotnet user-secrets init --project src/VetCare.Api
dotnet user-secrets set "ConnectionStrings:VetCare" \\
  "Host=localhost;Database=vetcare;Username=postgres;Password=dev" \\
  --project src/VetCare.Api

CONSULTAR

app.MapGet("/api/v1/citas", async (
    VetCareDbContext db,
    Guid? veterinarioId,
    DateOnly? desde,
    int limite = 20) =>
{
    var q = db.Citas.AsNoTracking();

    if (veterinarioId is not null)
        q = q.Where(c => c.VeterinarioId == veterinarioId);

    if (desde is not null)
        q = q.Where(c => c.Inicio >=
            desde.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc));

    var datos = await q
        .OrderBy(c => c.Inicio)
        .Take(Math.Min(limite, 100))
        .Select(c => new CitaResponse(c.Id, c.Inicio, c.Fin,
                                      c.Estado.ToString().ToLowerInvariant()))
        .ToListAsync();

    return Results.Ok(new { datos });
});

(Aquí CitaResponse es una versión corta: Id, Inicio, Fin y
Estado. Añade la mascota y el veterinario cuando los necesites.)

OJO CON LAS FECHAS: con columnas timestamptz, Npgsql exige
DateTime con Kind = Utc. Por eso ToDateTime lleva
DateTimeKind.Utc; sin él, la consulta lanza una excepción.

AsNoTracking: para solo lectura. Evita que EF guarde
una copia de cada entidad para detectar cambios.
En listados es bastante más rápido.

Select con el DTO: EF traduce eso a SQL y pide
SOLO esas columnas. Es la forma correcta de proyectar.` },
      steps: [
        'Agrega el paquete Npgsql y crea VetCareDbContext en src/VetCare.Infrastructure.',
        'Configura el mapeo explícito a tus nombres de tabla y columna en snake_case.',
        'Guarda la cadena de conexión con dotnet user-secrets (como en el ejemplo) y registra el DbContext en Program.cs. Necesitarás using Microsoft.EntityFrameworkCore; arriba del archivo.',
        'Reemplaza los datos falsos del endpoint de citas por una consulta real contra tu base poblada con seed.sql.',
        'Activa el logging de SQL con opt.EnableSensitiveDataLogging().LogTo(Console.WriteLine) y mira exactamente qué SQL genera EF.'
      ],
      vet: [
        'Mapea al menos Dueno, Mascota, Veterinario y Cita contra las tablas reales creadas en la semana 9.',
        'Tu esquema sigue siendo la fuente de verdad: EF se adapta a él, no al revés. Si no quieres mapear columna a columna, el paquete EFCore.NamingConventions con UseSnakeCaseNamingConvention() lo hace por ti.'
      ],
      edge: [
        'Nunca pongas contraseñas en appsettings.json versionado. Usa dotnet user-secrets en desarrollo.',
        'Si olvidas AsNoTracking en un listado grande, EF guarda miles de entidades en memoria sin necesidad.',
        'Un Select con DTO después de un ToListAsync ya no se traduce a SQL: trae todas las columnas y proyecta en memoria. El orden importa.'
      ],
      quiz: [
        { q: '¿Qué hace el change tracker de EF Core?', a: 'Guarda una copia del estado original de cada entidad cargada para detectar qué cambió al llamar SaveChanges. Es útil para escrituras pero es puro costo en consultas de solo lectura.' },
        { q: '¿Cuándo usar AsNoTracking?', a: 'En cualquier consulta cuyo resultado no vayas a modificar y guardar, típicamente todos los listados y lecturas de la API. Evita la copia de seguimiento y reduce memoria y tiempo.' },
        { q: '¿Por qué proyectar a un DTO dentro del Select es importante?', a: 'Porque EF traduce esa proyección a SQL y pide solo las columnas necesarias. Si traes la entidad completa y proyectas después en memoria, transferiste datos que no usas.' },
        { q: '¿Por qué conviene activar el logging de SQL durante el desarrollo?', a: 'Porque te permite ver exactamente qué consulta genera cada expresión LINQ y detectar N+1 o consultas monstruosas antes de que lleguen a producción.' }
      ],
      out: 'Endpoint de citas devolviendo datos reales de PostgreSQL con el SQL generado revisado.',
      file: 'src/VetCare.Infrastructure/VetCareDbContext.cs'
    },
    {
      t: 'Escrituras, transacciones y N+1 en EF Core',
      obj: 'Guardar datos correctamente y evitar los dos errores clásicos del ORM.',
      why: 'Aquí es donde la mayoría de las APIs lentas nacen. Como ya sabes lo que es un N+1 y una transacción en SQL, vas a reconocerlos al instante en el código.',
      study: { r: 4, what: 'Lee la página de Loading Related Data y sus subpáginas de eager y lazy loading; después abre Transactions desde el índice lateral. Unos 20 minutos. Busca una cosa: la diferencia entre Include, lazy loading y proyección.',
        pasos: [
          'Lee la página principal (~2 min): las tres formas de cargar datos relacionados.',
          'Abre "Eager loading" (~5 min): Include y ThenInclude.',
          'Abre "Lazy loading" (~4 min) y fíjate en por qué provoca el problema N+1.',
          'Abre "Explicit loading" (~2 min) por encima.',
          'Activa el log de SQL de EF Core, recorre las citas con su mascota sin Include y cuenta cuántas consultas aparecen.'
        ] },
      ex: { title: 'Guardar bien y leer sin N+1', body: `CREAR UNA CITA

app.MapPost("/api/v1/citas", async (
    CrearCitaRequest req,
    VetCareDbContext db,
    IRelojSistema reloj) =>
{
    var mascota = await db.Mascotas.FindAsync(req.MascotaId);
    if (mascota is null)
        return Results.NotFound();

    // Agendar ahora recibe también "ahora" para rechazar
    // fechas pasadas (la regla de la semana 8)
    var cita = Cita.Agendar(
        req.MascotaId, req.VeterinarioId,
        req.Inicio.UtcDateTime,
        TimeSpan.FromMinutes(req.DuracionMinutos),
        reloj.Ahora());

    db.Citas.Add(cita);

    try
    {
        await db.SaveChangesAsync();
    }
    catch (DbUpdateException ex)
        when (ex.InnerException is PostgresException { SqlState: "23P01" })
    {
        // 23P01 = exclusion_violation: la constraint de solape
        // (PostgresException viene de: using Npgsql;)
        return Results.Problem(        // sale como problem+json
            type: "https://api.vetcare.local/errores/horario-ocupado",
            title: "El veterinario ya tiene una cita en ese horario",
            statusCode: StatusCodes.Status409Conflict);
    }

    return Results.Created($"/api/v1/citas/{cita.Id}",
        new CitaResponse(cita.Id, cita.Inicio, cita.Fin,
                         cita.Estado.ToString().ToLowerInvariant()));
});

Fíjate: la base garantiza la regla y el código
traduce su error a una respuesta HTTP clara.
Esto es exactamente lo que decidiste en la semana 10.

(IRelojSistema llega por DI: regístralo en Program.cs con
builder.Services.AddSingleton<IRelojSistema, RelojDelSistema>();)

TRANSACCIÓN EXPLÍCITA (varias operaciones)

await using var tx = await db.Database.BeginTransactionAsync();
try
{
    db.Facturas.Add(factura);
    await db.SaveChangesAsync();

    foreach (var l in lineas) { l.FacturaId = factura.Id; db.Lineas.Add(l); }
    await db.SaveChangesAsync();

    factura.Total = lineas.Sum(l => l.Monto);
    await db.SaveChangesAsync();

    await tx.CommitAsync();
}
catch
{
    await tx.RollbackAsync();
    throw;
}

Un solo SaveChanges ya es transaccional por sí mismo.
La transacción explícita hace falta cuando necesitas
varios SaveChanges como una sola unidad.

EL N+1 EN EF CORE

MAL: una consulta por cada mascota
var mascotas = await db.Mascotas.Where(m => m.DuenoId == duenoId).ToListAsync();
foreach (var m in mascotas)
{
    var visitas = await db.Visitas
        .Where(v => v.MascotaId == m.Id).ToListAsync();   // N consultas
}

BIEN con Include (trae entidades completas)
var mascotas = await db.Mascotas
    .Include(m => m.Visitas)
    .Where(m => m.DuenoId == duenoId)
    .ToListAsync();

MEJOR con proyección (trae solo lo que usas)
var datos = await db.Mascotas
    .Where(m => m.DuenoId == duenoId)
    .Select(m => new MascotaConVisitas(
        m.Id,
        m.Nombre,
        m.Visitas.Select(v => new VisitaResumen(v.Fecha, v.Motivo)).ToList()))
    .ToListAsync();` },
      steps: [
        'Implementa POST de cita leyendo y escribiendo en la base real.',
        'Captura el error 23P01 de PostgreSQL y tradúcelo a 409 con problem details.',
        'Prueba agendar dos citas solapadas por la API y comprueba que la segunda recibe 409.',
        'Provoca un N+1 a propósito en el historial de una mascota y mira el log de SQL contando las consultas.',
        'Corrígelo con proyección y vuelve a contar: debe ser una sola consulta.'
      ],
      vet: [
        'Endpoints a implementar hoy: POST /citas, POST /mascotas/{id}/visitas, GET /mascotas/{id}/historial.',
        'El historial debe traerse en una sola consulta.'
      ],
      edge: [
        'FindAsync busca primero en el change tracker y solo va a la base si no está: no sirve con AsNoTracking.',
        'Include con varias colecciones genera un producto cartesiano. Usa AsSplitQuery o proyecta.',
        'Nunca atrapes DbUpdateException de forma genérica: filtra por el SqlState concreto o esconderás bugs reales.'
      ],
      quiz: [
        { q: '¿Un solo SaveChanges necesita transacción explícita?', a: 'No. EF Core envuelve cada SaveChanges en su propia transacción, así que todas las operaciones de ese guardado son atómicas. La transacción explícita hace falta cuando varios SaveChanges deben ser una sola unidad.' },
        { q: '¿Cuál es la diferencia entre Include y proyección con Select?', a: 'Include trae las entidades relacionadas completas y las deja en el change tracker. La proyección genera un SQL que pide solo las columnas necesarias y devuelve DTOs, que es más eficiente para respuestas de API.' },
        { q: '¿Por qué capturar el SqlState 23P01 en vez de validar antes en el código?', a: 'Validar antes da mejor mensaje pero no elimina la carrera entre dos peticiones simultáneas. Capturar el error de la constraint es lo que garantiza la corrección; lo ideal es hacer ambas cosas.' },
        { q: '¿Cómo detectas un N+1 que ya está en el código?', a: 'Activando el log de SQL y contando las consultas de una petición, o viendo un bucle que hace await a la base dentro. Si el número de consultas crece con el número de elementos, es N+1.' }
      ],
      out: 'POST de cita con conflicto 409 funcionando y el historial resuelto en una sola consulta.',
      file: 'src/VetCare.Api/Program.cs'
    },
    {
      t: 'Validación, paginación y organización del código',
      obj: 'Validar la entrada automáticamente y dejar Program.cs ordenado.',
      why: 'Un Program.cs de 800 líneas es el destino de toda Minimal API mal organizada. Aprender a dividirlo en módulos desde el inicio es lo que distingue un proyecto mantenible.',
      study: { r: 3, what: 'Lee las secciones "Built-in attributes" y "Model state" del artículo de validación. Unos 15 minutos. Busca una cosa: qué formato tiene la respuesta de validación automática de ASP.NET Core.',
        pasos: [
          'Lee "Model state" (~2 min) y "Validation attributes" (~3 min).',
          'Lee "Built-in attributes" (~4 min) y apunta los que vas a usar: Required, Range, MaxLength, EmailAddress.',
          'Lee "Problem details" (~2 min): la forma del error de validación.',
          'Ten en cuenta que este artículo es de MVC: en Minimal APIs la validación no es automática salvo que la actives. Esta semana la aplicas tú con el filtro de endpoint del ejemplo, para entender qué pasa por dentro. (.NET 10 trae builder.Services.AddValidation(), que hace lo mismo sola y por defecto responde 400.)',
          'Escribe en una tabla cada DTO de entrada y los atributos de cada campo, sacados de tu api-contract.md.'
        ] },
      ex: { title: 'Validación y endpoints por módulo', body: `VALIDACIÓN CON DATA ANNOTATIONS

public record CrearCitaRequest(
    [property: Required] Guid MascotaId,
    [property: Required] Guid VeterinarioId,
    [property: Required] DateTimeOffset Inicio,
    [property: Range(10, 180)] int DuracionMinutos,
    [property: MaxLength(500)] string? Motivo);

¡OJO con el "property:"! En un record, un atributo escrito
sin él se aplica al parámetro del constructor, no a la
propiedad, y Validator lo ignora: la validación pasaría
siempre sin avisar. (Tampoco Required detecta Guid.Empty:
un Guid nunca es null. Eso lo vigila tu dominio.)

En Minimal APIs la validación no es automática:
se agrega con un filtro de endpoint
(arriba: using System.ComponentModel.DataAnnotations;).

public class ValidacionFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext ctx,
        EndpointFilterDelegate next)
    {
        var arg = ctx.Arguments.OfType<T>().FirstOrDefault();
        if (arg is null) return await next(ctx);

        var resultados = new List<ValidationResult>();
        var valido = Validator.TryValidateObject(
            arg, new ValidationContext(arg), resultados, true);

        if (!valido)
        {
            // GroupBy: un campo puede tener varios errores
            var errores = resultados
                .GroupBy(r => r.MemberNames.FirstOrDefault() ?? "general")
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(r => r.ErrorMessage ?? "Inválido").ToArray());

            return Results.ValidationProblem(errores, statusCode: 422);
        }

        return await next(ctx);
    }
}

Uso:
app.MapPost("/api/v1/citas", Handler)
   .AddEndpointFilter<ValidacionFilter<CrearCitaRequest>>();

ORGANIZAR EN MÓDULOS

// src/VetCare.Api/Endpoints/CitasEndpoints.cs
public static class CitasEndpoints
{
    public static IEndpointRouteBuilder MapCitas(this IEndpointRouteBuilder app)
    {
        var grupo = app.MapGroup("/api/v1/citas")
                       .WithTags("Citas");

        grupo.MapGet("/",          Listar);
        grupo.MapGet("/{id:guid}", PorId);
        grupo.MapPost("/",         Crear)
             .AddEndpointFilter<ValidacionFilter<CrearCitaRequest>>();
        grupo.MapPost("/{id:guid}/cancelacion", Cancelar);

        return app;
    }

    // (cuerpos omitidos: son los handlers que ya escribiste)
    private static async Task<IResult> Listar(...) { ... }
    private static async Task<IResult> PorId(...) { ... }
}

// Program.cs queda limpio
app.MapCitas();
app.MapMascotas();
app.MapDuenos();
app.MapFacturas();

PAGINACIÓN POR CURSOR (la de la semana 10)

var q = db.Citas.AsNoTracking().OrderBy(c => c.Inicio).ThenBy(c => c.Id);

if (cursor is not null)
{
    var (ultInicio, ultId) = DecodificarCursor(cursor);
    q = q.Where(c => c.Inicio > ultInicio
                  || (c.Inicio == ultInicio && c.Id > ultId));
}

var pagina = await q.Take(limite + 1).ToListAsync();
var hayMas = pagina.Count > limite;
var datos  = pagina.Take(limite).ToList();

return Results.Ok(new
{
    datos,
    paginacion = new
    {
        limite,
        hayMas,
        siguienteCursor = hayMas ? CodificarCursor(datos[^1]) : null
    }
});` },
      steps: [
        'Agrega data annotations a todos tus DTOs de entrada según las reglas de docs/api-contract.md.',
        'Implementa el filtro de validación genérico y aplícalo a todos los POST y PUT.',
        'Comprueba que una petición inválida devuelve 422 con el diccionario de errores por campo.',
        'Mueve los endpoints a archivos por recurso en src/VetCare.Api/Endpoints y deja Program.cs con menos de 60 líneas.',
        'Implementa la paginación por cursor en el listado de citas y pruébala pidiendo tres páginas seguidas.'
      ],
      vet: [
        'Módulos de endpoints: Citas, Mascotas, Duenos, Visitas, Facturas.',
        'Toda colección de VetCare se pagina con el mismo sobre: datos + paginacion.'
      ],
      edge: [
        'Las data annotations validan forma, no reglas de negocio. "La cita debe ser futura" depende del reloj y va en el dominio.',
        'El cursor debe codificar el orden completo, incluido el desempate por id, o se saltarán filas.',
        'Un límite sin tope máximo permite que un cliente pida un millón de filas. Siempre aplica Math.Min.'
      ],
      quiz: [
        { q: '¿Por qué las data annotations no bastan para validar?', a: 'Porque solo comprueban la forma del dato: tipo, rango, longitud, obligatoriedad. Las reglas que dependen del estado del sistema o del tiempo, como que no haya solape, viven en el dominio o en la base.' },
        { q: '¿Qué ventaja da MapGroup?', a: 'Agrupa rutas bajo un prefijo común y permite aplicar filtros, autorización y metadatos a todo el grupo de una vez, en lugar de repetirlos en cada endpoint.' },
        { q: '¿Por qué el cursor debe incluir un desempate por id?', a: 'Porque si dos filas comparten el valor de orden, el cursor no puede saber en cuál se quedó y puede repetir o saltarse filas. El id garantiza un orden total y estable.' },
        { q: '¿Por qué limitar el parámetro de tamaño de página?', a: 'Porque sin tope un cliente puede pedir toda la tabla en una petición y agotar memoria y conexiones del servidor. Es tanto un tema de rendimiento como de protección contra abuso.' }
      ],
      out: 'Validación devolviendo 422 por campo, endpoints en módulos y paginación por cursor funcionando.',
      file: 'src/VetCare.Api/Endpoints/CitasEndpoints.cs'
    },
    {
      t: 'API completa y documentada (examen de la semana)',
      obj: 'Cerrar la API con documentación generada, health checks y una demo end to end.',
      why: 'Una API que no se puede probar ni entender no existe para los demás. Este día convierte tu código en algo que otra persona puede usar sin preguntarte nada.',
      study: { r: 5, what: 'Lee la página completa: desde .NET 9 el documento OpenAPI lo genera Microsoft.AspNetCore.OpenApi y la interfaz (Scalar o Swagger UI) se añade aparte. Unos 15 minutos. Busca una cosa: cómo añadir descripciones y ejemplos a los endpoints.',
        pasos: [
          'Lee "Package installation" (~2 min) e instala Microsoft.AspNetCore.OpenApi.',
          'Lee "Configure OpenAPI document generation" (~4 min): AddOpenApi y MapOpenApi.',
          'Abre /openapi/v1.json en tu API y comprueba que aparecen todos tus endpoints.',
          'Añade a cada endpoint WithSummary y WithDescription, y comprueba que el documento los muestra.',
          'Añade una interfaz para leer el documento (Scalar o Swagger UI) solo en el entorno de desarrollo.'
        ] },
      ex: { title: 'Documentación, health y CORS', body: `DOCUMENTACIÓN NAVEGABLE

dotnet add package Scalar.AspNetCore

builder.Services.AddOpenApi();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();   // UI en /scalar
}

METADATOS POR ENDPOINT

grupo.MapPost("/", Crear)
     .WithName("CrearCita")
     .WithSummary("Agenda una cita nueva")
     .WithDescription("Devuelve 409 si el veterinario ya tiene una cita solapada.")
     .Produces<CitaResponse>(StatusCodes.Status201Created)
     .ProducesProblem(StatusCodes.Status409Conflict)
     .ProducesValidationProblem(StatusCodes.Status422UnprocessableEntity);

HEALTH CHECKS DE VERDAD

dotnet add package AspNetCore.HealthChecks.NpgSql

builder.Services.AddHealthChecks()
    .AddNpgSql(cadenaConexion, name: "postgres", tags: new[] { "ready" });

// live: no ejecuta ningún check, solo prueba que el proceso responde
app.MapHealthChecks("/health/live",
    new HealthCheckOptions { Predicate = _ => false });
// ready: ejecuta los checks marcados "ready" (la base)
app.MapHealthChecks("/health/ready",
    new HealthCheckOptions { Predicate = c => c.Tags.Contains("ready") });

(Sin Predicate, los dos ejecutarían todos los checks y
"live" fallaría al caerse la base: el orquestador
reiniciaría la API sin motivo. HealthCheckOptions viene de
using Microsoft.AspNetCore.Diagnostics.HealthChecks;)

Live  -> el orquestador reinicia si falla
Ready -> el balanceador deja de enviar tráfico si falla

CORS PARA EL FRONT DE LA FASE 7

builder.Services.AddCors(o => o.AddPolicy("front", p => p
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

app.UseCors("front");

Nunca uses AllowAnyOrigin junto con credenciales:
el navegador lo rechaza y además es inseguro.

CHECKLIST FINAL DE LA SEMANA

[ ] Todos los endpoints de docs/api-contract.md existen
[ ] Los códigos de estado coinciden con el contrato
[ ] Los errores salen en application/problem+json con traceId
[ ] Las colecciones están paginadas y con tope de limite
[ ] Ninguna entidad de dominio se serializa directamente
[ ] El SQL generado no tiene N+1 en ningún endpoint
[ ] /health/live y /health/ready responden
[ ] La documentación se abre y se puede probar desde el navegador
[ ] appsettings no tiene secretos versionados` },
      steps: [
        'Agrega la UI de documentación y comprueba que puedes ejecutar cada endpoint desde el navegador.',
        'Añade WithSummary, Produces y ProducesProblem a todos los endpoints.',
        'Configura health checks live y ready, y comprueba que ready falla si apagas PostgreSQL.',
        'Recorre el checklist completo y arregla todo lo que falte.',
        'Graba o haz una demo de cinco minutos: crear un dueño, su mascota, agendar una cita, intentar solaparla, ver el historial.'
      ],
      vet: [
        'Actualiza docs/openapi.yaml con el generado por la aplicación, o marca el generado como fuente de verdad.',
        'Escribe en README.md del repo cómo levantar la base, correr migraciones y arrancar la API.',
        'Pulsa «Marcar para repasar» y vuelve a leer src/VetCare.Api/Program.cs dentro de una semana.'
      ],
      edge: [
        'No expongas la UI de documentación en producción si la API no es pública: revela toda tu superficie de ataque.',
        'El health check ready no debe hacer consultas pesadas: se llama cada pocos segundos.',
        'Si el front recibe un error de CORS, revisa que UseCors esté antes de los endpoints y después de UseRouting.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre un health check live y uno ready?', a: 'Live indica si el proceso está vivo y debe reiniciarse si falla. Ready indica si puede atender tráfico, comprobando dependencias como la base de datos, y si falla el balanceador deja de enviarle peticiones sin reiniciarlo.' },
        { q: '¿Por qué se genera la documentación desde el código y no a mano?', a: 'Porque el código es lo que realmente corre. Un yaml escrito a mano se desincroniza en cuanto alguien cambia un endpoint, y una documentación equivocada es peor que no tener ninguna.' },
        { q: '¿Por qué AllowAnyOrigin con credenciales está prohibido?', a: 'Porque permitiría que cualquier sitio web hiciera peticiones autenticadas con las cookies del usuario. El navegador rechaza esa combinación precisamente para evitar ese ataque.' },
        { q: 'Resume qué construiste esta semana en una frase.', a: 'Una API real donde el pipeline maneja errores de forma uniforme, EF Core traduce el dominio a SQL que yo entiendo y controlo, la base garantiza las reglas críticas, la entrada se valida antes de llegar al negocio y todo queda documentado y comprobable desde el navegador.' }
      ],
      out: 'API completa, documentada, con health checks y demo end to end funcionando.',
      file: 'src/VetCare.Api/Program.cs'
    }
  ]
}
]);
