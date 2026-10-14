window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 12,
  phase: 'Backend and APIs',
  title: 'Building the VetCare API with ASP.NET Core',
  idea: 'It is time to put everything together: the domain, the database schema and week 11’s contract become an API that really runs. This week you write the complete backend and see it answer in the browser.',
  res: [
    { t: 'Microsoft Learn — Tutorial: Create a minimal API',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api',
      note: 'The official step-by-step tutorial. Follow this exact order on day 1.' },
    { t: 'Microsoft Learn — Middleware in ASP.NET Core',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/',
      note: 'How the request pipeline is composed. Day 2 material.' },
    { t: 'Microsoft Learn — EF Core: Getting started',
      u: 'https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app',
      note: 'The ORM you will use to talk to PostgreSQL. Days 3 and 4.' },
    { t: 'Microsoft Learn — Model validation',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation',
      note: 'Data annotations and automatic validation. Day 5.' },
    { t: 'Microsoft Learn — EF Core: Loading Related Data', u: 'https://learn.microsoft.com/en-us/ef/core/querying/related-data/', note: 'Include, explicit loading and lazy loading: how to avoid N+1.' },
    { t: 'Microsoft Learn — Generate OpenAPI documents', u: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi', note: 'Documenting the API with Microsoft.AspNetCore.OpenApi.' }
  ],
  days: [
    {
      t: 'A first API that answers',
      obj: 'Start an ASP.NET Core project and serve the first endpoints.',
      why: 'Seeing your own JSON in the browser is the moment everything abstract becomes real. And Minimal APIs are how new services are started in .NET today.',
      study: { r: 0, what: 'Follow the tutorial up to the "Test the API" section. About 25 minutes, doing it, not just reading it. Look for one thing: what WebApplication.CreateBuilder does and what app.Run does.',
        pasos: [
          'Read "Prerequisites" and do "Create an API project" (~6 min).',
          'Read "Examine the code" (~3 min): what WebApplication.CreateBuilder, builder.Build and app.Run do.',
          'Do "Add NuGet packages" and "The model and database context classes" (~5 min).',
          'Do "Replace the WeatherForecast sample with the Todo API" and "Test posting data" (~8 min).',
          'Do "Examine the GET endpoints" and "Test the GET endpoints" (~4 min). Stop here: you will see the rest tomorrow.'
        ] },
      ex: { title: 'A minimal Program.cs', body: `dotnet new web -o src/VetCare.Api
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

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/v1/appointments", () =>
{
    var appointments = new[]
    {
        new { id = Guid.NewGuid(), start = "2026-03-10T10:00:00Z", status = "scheduled" },
        new { id = Guid.NewGuid(), start = "2026-03-10T11:00:00Z", status = "confirmed" }
    };
    return Results.Ok(new { data = appointments });
});

var testId = Guid.Parse("5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f");

app.MapGet("/api/v1/appointments/{id:guid}", (Guid id) =>
    id == testId
        ? Results.Ok(new { id, status = "scheduled" })
        : Results.NotFound());

app.MapPost("/api/v1/appointments", (CreateAppointmentRequest req) =>
{
    var newId = Guid.NewGuid();
    return Results.Created($"/api/v1/appointments/{newId}",
        new { id = newId, status = "scheduled" });
});

app.Run();

record CreateAppointmentRequest(
    Guid PetId, Guid VetId,
    DateTimeOffset Start, int DurationMinutes, string? Reason);

WHAT EACH PIECE IS

CreateBuilder     sets up configuration, logging and the DI container
builder.Services  where you register your dependencies
builder.Build()   freezes the container and creates the app
app.MapGet...     defines routes
app.Run()         starts the server and blocks

Results.Ok        200 with a body
Results.Created   201 with a Location header
Results.NotFound  404
Results.NoContent 204

Binding is automatic:
{id:guid} from the route, the record from the JSON body,
[FromQuery] from the query string.` },
      steps: [
        'Create the project with the commands from the example (dotnet new web, add it to the solution, references and the OpenAPI package).',
        'Implement /health and the three appointment endpoints with fake in-memory data.',
        'Run dotnet run and try each endpoint with curl -i, checking each one’s status code.',
        'Check that POST returns 201 and that the Location header points to the right path.',
        'Open /openapi/v1.json in the browser and check that the specification is already generated on its own.'
      ],
      vet: [
        'The routes must match your docs/api-contract.md from week 11 exactly.',
        'If you find differences, decide which one is right and update the document or the code. The contract rules.'
      ],
      edge: [
        'If the POST returns 415, your curl is missing the Content-Type: application/json header.',
        'Records used as a body parameter must have a public constructor and properties that match the JSON in camelCase.',
        'MapGet with the same route twice does not fail at startup, but the first request to that route fails with AmbiguousMatchException (a 500). Check for duplicates.'
      ],
      quiz: [
        { q: 'What is the difference between builder.Services and app?', a: 'builder.Services is where you register dependencies before building the application. Once you call Build the container is closed and app is used to configure the pipeline and the routes.' },
        { q: 'How does ASP.NET Core decide where to get each endpoint parameter from?', a: 'By convention: simple types that match a route segment come from the route, other simple types from the query string, complex types from the JSON body and registered services from the container.' },
        { q: 'Why is Results.Created better than Results.Ok when creating?', a: 'Because 201 says a new resource was created and lets you include the Location header with its URL, so the client knows where to fetch it without building the path by hand.' },
        { q: 'What is the /health endpoint for?', a: 'It lets orchestrators, load balancers and monitoring check whether the instance is alive without hitting a business endpoint. It is the basis of automatic restarts and zero-downtime deployment.' }
      ],
      out: 'An API running with /health and three appointment endpoints returning the right codes.',
      file: 'src/VetCare.Api/Program.cs'
    },
    {
      t: 'The pipeline and middleware',
      obj: 'Understand how a request is processed and add cross-cutting behaviour.',
      why: 'Logging, error handling, CORS and authentication are middleware. If you understand the pipeline, you stop copying magic lines and start knowing why the order matters.',
      study: { r: 1, what: 'Read the whole article, especially the pipeline diagram and the "Middleware order" section. About 18 minutes. Look for one thing: what happens if a middleware does not call next.',
        pasos: [
          'Read the introduction and the pipeline diagram (~4 min): each middleware can act before and after the next one.',
          'Read "Middleware code analysis" and "Create a middleware pipeline with WebApplication" (~5 min).',
          'Read "Run delegate" (~2 min): a middleware that does not call next cuts the chain.',
          'Read "Middleware order" (~5 min) and copy the recommended order.',
          'Write a middleware that times each request and check which position it must go in.'
        ] },
      ex: { title: 'The pipeline and your own middleware', body: `THE PIPELINE IS AN ONION

request ->  Exceptions
             -> Logging
                -> CORS
                   -> Authentication
                      -> Authorisation
                         -> Endpoint
                      <-
                   <-
                <-
             <-
response <-

Each middleware can act before and after calling the next
one.

YOUR OWN MIDDLEWARE: correlation and timing

app.Use(async (context, next) =>
{
    var traceId = context.TraceIdentifier;
    context.Response.Headers["X-Trace-Id"] = traceId;

    var sw = System.Diagnostics.Stopwatch.StartNew();
    await next();                   // runs the rest of the pipeline
    sw.Stop();

    app.Logger.LogInformation(
        "{Method} {Path} -> {Status} in {Ms} ms (trace {Trace})",
        context.Request.Method,
        context.Request.Path,
        context.Response.StatusCode,
        sw.ElapsedMilliseconds,
        traceId);
});

GLOBAL ERROR HANDLING
(at the very top of the file: using Microsoft.AspNetCore.Diagnostics;)

app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        var feature = context.Features
            .Get<IExceptionHandlerPathFeature>();

        var (code, title) = feature?.Error switch
        {
            TimeSlotTakenException => (409, "Time slot not available"),
            NotFoundException      => (404, "Resource not found"),
            BusinessRuleException  => (422, "Business rule broken"),
            _                      => (500, "Internal error")
        };

        context.Response.StatusCode = code;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(new
        {
            type = "https://api.vetcare.local/errors/" + code,
            title,
            status = code,
            instance = context.Request.Path.Value,
            traceId = context.TraceIdentifier
        });
    });
});

THE ORDER MATTERS AND IS NOT NEGOTIABLE

app.UseExceptionHandler(...);   // first: wraps everything
app.UseHttpsRedirection();
app.UseCors("front");
app.UseAuthentication();        // always before
app.UseAuthorization();         // authorisation
app.MapGet(...);                // endpoints at the end

If you put UseAuthorization before UseAuthentication, the
user will always be anonymous and nothing will work.

If a middleware does NOT call next, the request ends there
(that is what a rate limiting middleware does, for example,
when it returns 429).` },
      steps: [
        'Add the logging middleware with timing and traceId, and check the X-Trace-Id header in the response.',
        'Add UseExceptionHandler and create three domain exceptions of your own.',
        'Throw each exception from a test endpoint and check that the right code comes out in problem+json format.',
        'Order experiment: add, before your logging middleware, an app.Use that answers 503 without calling next (a "maintenance mode") and see that the log no longer appears. Move it after the logging and compare.',
        'Throw an unhandled exception and confirm that the client receives a 500 with no stack trace.'
      ],
      vet: [
        'VetCare’s exceptions: TimeSlotTakenException, NotFoundException, BusinessRuleException.',
        'The error kinds must match the catalogue you defined in docs/api-contract.md.'
      ],
      edge: [
        'In development you can show error details; in production never. Use app.Environment.IsDevelopment to decide.',
        'A middleware that writes to the body and then calls next causes the "headers already sent" error.',
        'UseExceptionHandler must go first to catch failures in the later middleware.'
      ],
      quiz: [
        { q: 'What happens if a middleware does not call next?', a: 'The pipeline is cut there and the later middleware and endpoints do not run. It is the mechanism rate limiting, caching and authorisation use to answer without reaching the endpoint.' },
        { q: 'Why must UseAuthentication go before UseAuthorization?', a: 'Because authentication is what builds the user’s identity from the token. If authorisation runs first, there is no identity to evaluate and everything is treated as anonymous.' },
        { q: 'Why does UseExceptionHandler go at the start of the pipeline?', a: 'Because a middleware wraps everything that comes after it. If you put it at the end, it cannot catch exceptions thrown by the middleware before it.' },
        { q: 'How does the traceId relate to debugging in production?', a: 'It is returned to the client in the error and written on every log line of that request. The user reports the id and you find the exact trace without guessing which request it was.' }
      ],
      out: 'A pipeline with logging, traceId and global error handling in problem+json format.',
      file: 'src/VetCare.Api/Program.cs'
    },
    {
      t: 'EF Core: connecting to PostgreSQL',
      obj: 'Map your entities to the real tables and read data from the database.',
      why: 'EF Core is .NET’s standard ORM and appears in almost every job ad. Because you already know real SQL, you will use it well instead of trusting it blindly.',
      study: { r: 2, what: 'Read the tutorial up to "Create the database" and then Npgsql’s configuration page. About 25 minutes. Look for one thing: what the DbContext’s change tracker does.',
        pasos: [
          'Read "Create the model" (~4 min): the DbContext and the classes it maps.',
          'Read "Create the database" (~3 min): migrations with dotnet ef. Just to know them: in VetCare the schema is driven by your SQL migrations from week 10.',
          'Read "Create, read, update & delete" (~4 min) and notice that SaveChanges is the moment things are written.',
          'In the Npgsql documentation (npgsql.org/efcore) look at how UseNpgsql is configured with the connection string (~5 min).',
          'Write in one line what the change tracker does: it remembers what you loaded and detects what changed to generate the UPDATEs.'
        ] },
      ex: { title: 'DbContext and explicit configuration', body: `dotnet add src/VetCare.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL

public class VetCareDbContext : DbContext
{
    public VetCareDbContext(DbContextOptions<VetCareDbContext> options)
        : base(options) { }

    public DbSet<Owner> Owners => Set<Owner>();
    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Appointment>(e =>
        {
            e.ToTable("appointment");
            e.HasKey(a => a.Id);
            e.Property(a => a.Id).HasColumnName("id");
            e.Property(a => a.Start).HasColumnName("starts_at");
            e.Property(a => a.End).HasColumnName("ends_at");
            // in the database the status is lowercase ('scheduled'),
            // as week 9's CHECK requires
            e.Property(a => a.Status)
                .HasColumnName("status")
                .HasMaxLength(20)
                .HasConversion(
                    v => v.ToString().ToLowerInvariant(),
                    v => Enum.Parse<AppointmentStatus>(v, true));

            // Appointment points to Pet only by Id (aggregates, week 4)
            e.HasOne<Pet>()
             .WithMany()
             .HasForeignKey(a => a.PetId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(a => new { a.VetId, a.Start });
        });
    }
}

REGISTRATION

builder.Services.AddDbContext<VetCareDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("VetCare")));

THE CONNECTION STRING, WITH NO PASSWORDS IN THE REPOSITORY
(user-secrets stores it outside the project folder)

dotnet user-secrets init --project src/VetCare.Api
dotnet user-secrets set "ConnectionStrings:VetCare" \\
  "Host=localhost;Database=vetcare;Username=postgres;Password=dev" \\
  --project src/VetCare.Api

QUERYING

app.MapGet("/api/v1/appointments", async (
    VetCareDbContext db,
    Guid? vetId,
    DateOnly? from,
    int limit = 20) =>
{
    var q = db.Appointments.AsNoTracking();

    if (vetId is not null)
        q = q.Where(a => a.VetId == vetId);

    if (from is not null)
        q = q.Where(a => a.Start >=
            from.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc));

    var data = await q
        .OrderBy(a => a.Start)
        .Take(Math.Min(limit, 100))
        .Select(a => new AppointmentResponse(a.Id, a.Start, a.End,
                                             a.Status.ToString().ToLowerInvariant()))
        .ToListAsync();

    return Results.Ok(new { data });
});

(Here AppointmentResponse is a short version: Id, Start, End
and Status. Add the pet and the vet when you need them.)

CAREFUL WITH DATES: with timestamptz columns, Npgsql requires
DateTime with Kind = Utc. That is why ToDateTime takes
DateTimeKind.Utc; without it, the query throws an exception.

AsNoTracking: for read-only work. It stops EF keeping a copy
of each entity to detect changes. In lists it is quite a
bit faster.

Select with the DTO: EF translates that into SQL and asks
for ONLY those columns. It is the right way to project.` },
      steps: [
        'Add the Npgsql package and create VetCareDbContext in src/VetCare.Infrastructure.',
        'Configure the explicit mapping to your snake_case table and column names.',
        'Store the connection string with dotnet user-secrets (as in the example) and register the DbContext in Program.cs. You will need using Microsoft.EntityFrameworkCore; at the top of the file.',
        'Replace the appointment endpoint’s fake data with a real query against your database filled with seed.sql.',
        'Turn on SQL logging with opt.EnableSensitiveDataLogging().LogTo(Console.WriteLine) and look at exactly what SQL EF generates.'
      ],
      vet: [
        'Map at least Owner, Pet, Vet and Appointment against the real tables created in week 9.',
        'Your schema is still the source of truth: EF adapts to it, not the other way round. If you do not want to map column by column, the EFCore.NamingConventions package with UseSnakeCaseNamingConvention() does it for you.'
      ],
      edge: [
        'Never put passwords in a versioned appsettings.json. Use dotnet user-secrets in development.',
        'If you forget AsNoTracking on a big list, EF keeps thousands of entities in memory for no reason.',
        'A Select with a DTO after a ToListAsync is no longer translated to SQL: it brings every column and projects in memory. Order matters.'
      ],
      quiz: [
        { q: 'What does EF Core’s change tracker do?', a: 'It keeps a copy of the original state of each loaded entity to detect what changed when you call SaveChanges. It is useful for writes but pure cost in read-only queries.' },
        { q: 'When should you use AsNoTracking?', a: 'In any query whose result you will not modify and save, typically every list and read in the API. It avoids the tracking copy and reduces memory and time.' },
        { q: 'Why is projecting to a DTO inside the Select important?', a: 'Because EF translates that projection into SQL and asks only for the columns needed. If you bring the whole entity and project afterwards in memory, you transferred data you do not use.' },
        { q: 'Why is it worth turning on SQL logging during development?', a: 'Because it lets you see exactly which query each LINQ expression generates and catch N+1 or monstrous queries before they reach production.' }
      ],
      out: 'The appointment endpoint returning real data from PostgreSQL, with the generated SQL reviewed.',
      file: 'src/VetCare.Infrastructure/VetCareDbContext.cs'
    },
    {
      t: 'Writes, transactions and N+1 in EF Core',
      obj: 'Save data correctly and avoid the ORM’s two classic mistakes.',
      why: 'This is where most slow APIs are born. Because you already know what an N+1 and a transaction are in SQL, you will recognise them instantly in the code.',
      study: { r: 4, what: 'Read the Loading Related Data page and its eager and lazy loading subpages; then open Transactions from the side index. About 20 minutes. Look for one thing: the difference between Include, lazy loading and projection.',
        pasos: [
          'Read the main page (~2 min): the three ways of loading related data.',
          'Open "Eager loading" (~5 min): Include and ThenInclude.',
          'Open "Lazy loading" (~4 min) and notice why it causes the N+1 problem.',
          'Skim "Explicit loading" (~2 min).',
          'Turn on EF Core’s SQL log, walk the appointments with their pet without Include and count how many queries appear.'
        ] },
      ex: { title: 'Saving properly and reading without N+1', body: `CREATING AN APPOINTMENT

app.MapPost("/api/v1/appointments", async (
    CreateAppointmentRequest req,
    VetCareDbContext db,
    ISystemClock clock) =>
{
    var pet = await db.Pets.FindAsync(req.PetId);
    if (pet is null)
        return Results.NotFound();

    // Schedule now also receives "now" to reject past dates
    // (the rule from week 8)
    var appointment = Appointment.Schedule(
        req.PetId, req.VetId,
        req.Start.UtcDateTime,
        TimeSpan.FromMinutes(req.DurationMinutes),
        clock.Now());

    db.Appointments.Add(appointment);

    try
    {
        await db.SaveChangesAsync();
    }
    catch (DbUpdateException ex)
        when (ex.InnerException is PostgresException { SqlState: "23P01" })
    {
        // 23P01 = exclusion_violation: the overlap constraint
        // (PostgresException comes from: using Npgsql;)
        return Results.Problem(        // comes out as problem+json
            type: "https://api.vetcare.local/errors/slot-taken",
            title: "The vet already has an appointment at that time",
            statusCode: StatusCodes.Status409Conflict);
    }

    return Results.Created($"/api/v1/appointments/{appointment.Id}",
        new AppointmentResponse(appointment.Id, appointment.Start, appointment.End,
                                appointment.Status.ToString().ToLowerInvariant()));
});

Notice: the database guarantees the rule and the code
translates its error into a clear HTTP response.
This is exactly what you decided in week 10.

(ISystemClock arrives through DI: register it in Program.cs
with builder.Services.AddSingleton<ISystemClock, SystemClock>();)

EXPLICIT TRANSACTION (several operations)

await using var tx = await db.Database.BeginTransactionAsync();
try
{
    db.Invoices.Add(invoice);
    await db.SaveChangesAsync();

    foreach (var l in lines) { l.InvoiceId = invoice.Id; db.InvoiceLines.Add(l); }
    await db.SaveChangesAsync();

    invoice.Total = lines.Sum(l => l.Amount);
    await db.SaveChangesAsync();

    await tx.CommitAsync();
}
catch
{
    await tx.RollbackAsync();
    throw;
}

A single SaveChanges is already transactional on its own.
The explicit transaction is needed when you need several
SaveChanges calls as one unit.

N+1 IN EF CORE

BAD: one query per pet
var pets = await db.Pets.Where(p => p.OwnerId == ownerId).ToListAsync();
foreach (var p in pets)
{
    var visits = await db.Visits
        .Where(v => v.PetId == p.Id).ToListAsync();   // N queries
}

GOOD with Include (brings whole entities)
var pets = await db.Pets
    .Include(p => p.Visits)
    .Where(p => p.OwnerId == ownerId)
    .ToListAsync();

BETTER with projection (brings only what you use)
var data = await db.Pets
    .Where(p => p.OwnerId == ownerId)
    .Select(p => new PetWithVisits(
        p.Id,
        p.Name,
        p.Visits.Select(v => new VisitSummary(v.VisitedOn, v.Reason)).ToList()))
    .ToListAsync();` },
      steps: [
        'Implement the appointment POST reading from and writing to the real database.',
        'Catch PostgreSQL’s 23P01 error and translate it into a 409 with problem details.',
        'Try booking two overlapping appointments through the API and check that the second one gets a 409.',
        'Cause an N+1 on purpose in a pet’s history and look at the SQL log counting the queries.',
        'Fix it with a projection and count again: it must be a single query.'
      ],
      vet: [
        'Endpoints to implement today: POST /appointments, POST /pets/{id}/visits, GET /pets/{id}/history.',
        'The history must be fetched in a single query.'
      ],
      edge: [
        'FindAsync looks in the change tracker first and only goes to the database if it is not there: it does not work with AsNoTracking.',
        'Include with several collections produces a Cartesian product. Use AsSplitQuery or project.',
        'Never catch DbUpdateException generically: filter by the specific SqlState or you will hide real bugs.'
      ],
      quiz: [
        { q: 'Does a single SaveChanges need an explicit transaction?', a: 'No. EF Core wraps each SaveChanges in its own transaction, so all the operations in that save are atomic. The explicit transaction is needed when several SaveChanges calls must be a single unit.' },
        { q: 'What is the difference between Include and projection with Select?', a: 'Include brings the related entities whole and leaves them in the change tracker. Projection generates SQL that asks only for the needed columns and returns DTOs, which is more efficient for API responses.' },
        { q: 'Why catch SqlState 23P01 instead of validating beforehand in the code?', a: 'Validating first gives a better message but does not remove the race between two simultaneous requests. Catching the constraint error is what guarantees correctness; ideally you do both.' },
        { q: 'How do you detect an N+1 that is already in the code?', a: 'By turning on the SQL log and counting the queries of a request, or by spotting a loop that awaits the database inside it. If the number of queries grows with the number of items, it is an N+1.' }
      ],
      out: 'An appointment POST with a working 409 conflict and the history fetched in a single query.',
      file: 'src/VetCare.Api/Program.cs'
    },
    {
      t: 'Validation, pagination and organising the code',
      obj: 'Validate input automatically and leave Program.cs tidy.',
      why: 'An 800-line Program.cs is the fate of every badly organised Minimal API. Learning to split it into modules from the start is what makes a project maintainable.',
      study: { r: 3, what: 'Read the "Built-in attributes" and "Model state" sections of the validation article. About 15 minutes. Look for one thing: what shape ASP.NET Core’s automatic validation response has.',
        pasos: [
          'Read "Model state" (~2 min) and "Validation attributes" (~3 min).',
          'Read "Built-in attributes" (~4 min) and note the ones you will use: Required, Range, MaxLength, EmailAddress.',
          'Read "Problem details" (~2 min): the shape of the validation error.',
          'Bear in mind this article is about MVC: in Minimal APIs validation is not automatic unless you turn it on. This week you apply it yourself with the endpoint filter in the example, to understand what happens inside. (.NET 10 brings builder.Services.AddValidation(), which does the same on its own and answers 400 by default.)',
          'Write in a table each input DTO and the attributes of each field, taken from your api-contract.md.'
        ] },
      ex: { title: 'Validation and endpoints by module', body: `VALIDATION WITH DATA ANNOTATIONS

public record CreateAppointmentRequest(
    [property: Required] Guid PetId,
    [property: Required] Guid VetId,
    [property: Required] DateTimeOffset Start,
    [property: Range(10, 180)] int DurationMinutes,
    [property: MaxLength(500)] string? Reason);

CAREFUL with "property:"! In a record, an attribute written
without it applies to the constructor parameter, not the
property, and Validator ignores it: validation would always
pass without warning. (Required does not catch Guid.Empty
either: a Guid is never null. Your domain watches for that.)

In Minimal APIs validation is not automatic: it is added
with an endpoint filter
(at the top: using System.ComponentModel.DataAnnotations;).

public class ValidationFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext ctx,
        EndpointFilterDelegate next)
    {
        var arg = ctx.Arguments.OfType<T>().FirstOrDefault();
        if (arg is null) return await next(ctx);

        var results = new List<ValidationResult>();
        var valid = Validator.TryValidateObject(
            arg, new ValidationContext(arg), results, true);

        if (!valid)
        {
            // GroupBy: one field can have several errors
            var errors = results
                .GroupBy(r => r.MemberNames.FirstOrDefault() ?? "general")
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(r => r.ErrorMessage ?? "Invalid").ToArray());

            return Results.ValidationProblem(errors, statusCode: 422);
        }

        return await next(ctx);
    }
}

Usage:
app.MapPost("/api/v1/appointments", Handler)
   .AddEndpointFilter<ValidationFilter<CreateAppointmentRequest>>();

ORGANISING INTO MODULES

// src/VetCare.Api/Endpoints/AppointmentEndpoints.cs
public static class AppointmentEndpoints
{
    public static IEndpointRouteBuilder MapAppointments(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/appointments")
                       .WithTags("Appointments");

        group.MapGet("/",          List);
        group.MapGet("/{id:guid}", ById);
        group.MapPost("/",         Create)
             .AddEndpointFilter<ValidationFilter<CreateAppointmentRequest>>();
        group.MapPost("/{id:guid}/cancellation", Cancel);

        return app;
    }

    // (bodies omitted: they are the handlers you already wrote)
    private static async Task<IResult> List(...) { ... }
    private static async Task<IResult> ById(...) { ... }
}

// Program.cs stays clean
app.MapAppointments();
app.MapPets();
app.MapOwners();
app.MapInvoices();

CURSOR PAGINATION (the one from week 10)

var q = db.Appointments.AsNoTracking().OrderBy(a => a.Start).ThenBy(a => a.Id);

if (cursor is not null)
{
    var (lastStart, lastId) = DecodeCursor(cursor);
    q = q.Where(a => a.Start > lastStart
                  || (a.Start == lastStart && a.Id > lastId));
}

var page = await q.Take(limit + 1).ToListAsync();
var hasMore = page.Count > limit;
var data    = page.Take(limit).ToList();

return Results.Ok(new
{
    data,
    pagination = new
    {
        limit,
        hasMore,
        nextCursor = hasMore ? EncodeCursor(data[^1]) : null
    }
});` },
      steps: [
        'Add data annotations to all your input DTOs according to the rules in docs/api-contract.md.',
        'Implement the generic validation filter and apply it to every POST and PUT.',
        'Check that an invalid request returns 422 with the dictionary of errors per field.',
        'Move the endpoints into one file per resource in src/VetCare.Api/Endpoints and leave Program.cs under 60 lines.',
        'Implement cursor pagination on the appointment list and test it by asking for three pages in a row.'
      ],
      vet: [
        'Endpoint modules: Appointments, Pets, Owners, Visits, Invoices.',
        'Every VetCare collection is paginated with the same envelope: data + pagination.'
      ],
      edge: [
        'Data annotations validate shape, not business rules. "The appointment must be in the future" depends on the clock and belongs in the domain.',
        'The cursor must encode the complete order, including the id tie-breaker, or rows will be skipped.',
        'A limit with no maximum lets a client ask for a million rows. Always apply Math.Min.'
      ],
      quiz: [
        { q: 'Why are data annotations not enough to validate?', a: 'Because they only check the shape of the data: type, range, length, required. Rules that depend on the state of the system or on time, such as no overlap, live in the domain or the database.' },
        { q: 'What advantage does MapGroup give?', a: 'It groups routes under a common prefix and lets you apply filters, authorisation and metadata to the whole group at once, instead of repeating them on every endpoint.' },
        { q: 'Why must the cursor include an id tie-breaker?', a: 'Because if two rows share the sort value, the cursor cannot know which one it stopped at and may repeat or skip rows. The id guarantees a total, stable order.' },
        { q: 'Why limit the page-size parameter?', a: 'Because without a cap a client can ask for the whole table in one request and exhaust the server’s memory and connections. It is as much about performance as about protection against abuse.' }
      ],
      out: 'Validation returning 422 per field, endpoints in modules and cursor pagination working.',
      file: 'src/VetCare.Api/Endpoints/AppointmentEndpoints.cs'
    },
    {
      t: 'A complete, documented API (weekly exam)',
      obj: 'Close the API with generated documentation, health checks and an end-to-end demo.',
      why: 'An API that cannot be tried or understood does not exist for other people. This day turns your code into something another person can use without asking you anything.',
      study: { r: 5, what: 'Read the whole page: since .NET 9 the OpenAPI document is generated by Microsoft.AspNetCore.OpenApi and the UI (Scalar or Swagger UI) is added separately. About 15 minutes. Look for one thing: how to add descriptions and examples to the endpoints.',
        pasos: [
          'Read "Package installation" (~2 min) and install Microsoft.AspNetCore.OpenApi.',
          'Read "Configure OpenAPI document generation" (~4 min): AddOpenApi and MapOpenApi.',
          'Open /openapi/v1.json in your API and check that all your endpoints appear.',
          'Add WithSummary and WithDescription to each endpoint, and check that the document shows them.',
          'Add a UI to read the document (Scalar or Swagger UI) only in the development environment.'
        ] },
      ex: { title: 'Documentation, health and CORS', body: `BROWSABLE DOCUMENTATION

dotnet add package Scalar.AspNetCore

builder.Services.AddOpenApi();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();   // UI at /scalar
}

METADATA PER ENDPOINT

group.MapPost("/", Create)
     .WithName("CreateAppointment")
     .WithSummary("Books a new appointment")
     .WithDescription("Returns 409 if the vet already has an overlapping appointment.")
     .Produces<AppointmentResponse>(StatusCodes.Status201Created)
     .ProducesProblem(StatusCodes.Status409Conflict)
     .ProducesValidationProblem(StatusCodes.Status422UnprocessableEntity);

REAL HEALTH CHECKS

dotnet add package AspNetCore.HealthChecks.NpgSql

builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, name: "postgres", tags: new[] { "ready" });

// live: runs no checks, it only proves the process answers
app.MapHealthChecks("/health/live",
    new HealthCheckOptions { Predicate = _ => false });
// ready: runs the checks tagged "ready" (the database)
app.MapHealthChecks("/health/ready",
    new HealthCheckOptions { Predicate = c => c.Tags.Contains("ready") });

(Without Predicate, both would run every check and "live"
would fail when the database went down: the orchestrator
would restart the API for no reason. HealthCheckOptions
comes from using Microsoft.AspNetCore.Diagnostics.HealthChecks;)

Live  -> the orchestrator restarts it if it fails
Ready -> the load balancer stops sending traffic if it fails

CORS FOR THE FRONT END (weeks 16-17)

builder.Services.AddCors(o => o.AddPolicy("front", p => p
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

app.UseCors("front");

Never use AllowAnyOrigin together with credentials: the
browser rejects it and it is insecure anyway.

THE WEEK'S FINAL CHECKLIST

[ ] Every endpoint in docs/api-contract.md exists
[ ] The status codes match the contract
[ ] Errors come out as application/problem+json with a traceId
[ ] Collections are paginated and the limit has a cap
[ ] No domain entity is serialised directly
[ ] The generated SQL has no N+1 in any endpoint
[ ] /health/live and /health/ready answer
[ ] The documentation opens and can be tried from the browser
[ ] appsettings has no versioned secrets` },
      steps: [
        'Add the documentation UI and check that you can run each endpoint from the browser.',
        'Add WithSummary, Produces and ProducesProblem to every endpoint.',
        'Configure live and ready health checks, and check that ready fails if you stop PostgreSQL.',
        'Go through the full checklist and fix everything that is missing.',
        'Record or give a five-minute demo: create an owner, their pet, book an appointment, try to overlap it, see the history.'
      ],
      vet: [
        'Update docs/openapi.yaml with the one the application generates, or mark the generated one as the source of truth.',
        'Write in the repo’s README.md how to start the database, run the migrations and start the API.',
        'Press "Mark for review" and reread src/VetCare.Api/Program.cs in a week.'
      ],
      edge: [
        'Do not expose the documentation UI in production if the API is not public: it reveals your whole attack surface.',
        'The ready health check must not run heavy queries: it is called every few seconds.',
        'If the front end gets a CORS error, check that UseCors is before the endpoints and after UseRouting.'
      ],
      quiz: [
        { q: 'What is the difference between a live and a ready health check?', a: 'Live says whether the process is alive and should be restarted if it fails. Ready says whether it can take traffic, checking dependencies such as the database, and if it fails the load balancer stops sending it requests without restarting it.' },
        { q: 'Why is the documentation generated from the code and not by hand?', a: 'Because the code is what really runs. A hand-written yaml goes out of sync as soon as someone changes an endpoint, and wrong documentation is worse than none.' },
        { q: 'Why is AllowAnyOrigin with credentials forbidden?', a: 'Because it would let any website make authenticated requests with the user’s cookies. The browser rejects that combination precisely to prevent that attack.' },
        { q: 'Summarise what you built this week in one sentence.', a: 'A real API where the pipeline handles errors uniformly, EF Core translates the domain into SQL I understand and control, the database guarantees the critical rules, input is validated before it reaches the business and everything is documented and testable from the browser.' }
      ],
      out: 'A complete, documented API with health checks and a working end-to-end demo.',
      file: 'src/VetCare.Api/Program.cs'
    }
  ]
}
]);
