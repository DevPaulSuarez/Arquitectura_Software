window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 15,
  phase: 'Architecture',
  title: 'Architecture: deciding where each thing lives',
  idea: 'So far VetCare works, has tests and survives failures. The next problem is different: as the project grows, nobody knows where to put new code. Architecture is not drawing pretty boxes, it is setting rules about who may depend on whom, so that today’s decision does not block you in six months. This week you learn to separate into layers, to invert dependencies towards the domain, to separate reads from writes when it is needed, and above all to know when NOT to apply any of this.',
  res: [
    { t: 'Microsoft Learn — Common web application architectures',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures',
      note: 'Covers the layered monolith, clean architecture and their trade-offs with .NET examples. It is the reference that best fits your stack.' },
    { t: 'Alistair Cockburn — Hexagonal Architecture',
      u: 'https://alistair.cockburn.us/hexagonal-architecture/',
      note: 'The original ports and adapters article, written by its author. Short and conceptual: read the intent, not the implementation.' },
    { t: 'Martin Fowler — CQRS',
      u: 'https://martinfowler.com/bliki/CQRS.html',
      note: 'Two pages explaining what CQRS is and, more importantly, when NOT to use it. Fowler is explicit about the pattern’s cost.' },
    { t: 'Microsoft Learn — Domain events: design and implementation',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation',
      note: 'How to model domain events in .NET without coupling the domain to infrastructure. Look at the example of how they are collected and dispatched.' },
    { t: 'Martin Fowler — Microservice Trade-Offs', u: 'https://martinfowler.com/articles/microservice-trade-offs.html', note: 'What you gain and what you pay when splitting modules into services. The best defence of the modular monolith.' },
    { t: 'Michael Nygard — Documenting Architecture Decisions', u: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions', note: 'The original article that proposed ADRs and their format.' }
  ],
  days: [
    {
      t: 'Layers: the arrow rule',
      obj: 'Understand that a layered architecture is not defined by folders but by the direction of dependencies, and check that direction in your own solution.',
      why: 'It is the most common architecture question in mid-level interviews, and the mediocre answer is "well, there is a data layer, a business layer and a presentation layer". The good answer talks about the direction of the arrows and what that direction lets you do.',
      study: { r: 0, what: 'Read only the sections on the layered monolithic application and on clean architecture. About 15 minutes. Look for one thing: in the clean architecture diagram, which way all the arrows point and why that is the only thing that matters.',
        pasos: [
          'Read "What is a monolithic application?" and "What are layers?" (~4 min).',
          'Read the section on traditional N-Layer applications (~4 min): the UI depends on the logic and the logic on the data.',
          'Read "Clean architecture" (~5 min) and look at its diagram: dependencies point towards the centre.',
          'Read "Organizing code in Clean Architecture" (~3 min): Application Core, Infrastructure and UI Layer.',
          'Open VetCare’s .csproj files and draw the references between projects. Check that none goes from the core outwards.'
        ] },
      ex: {
        title: 'The same feature with the arrows backwards',
        body: `// BAD: the domain knows the database
// src/VetCare.Domain/Appointment.cs
using Microsoft.EntityFrameworkCore;     // <-- you already lost

public class Appointment
{
    public async Task<bool> SlotFreeAsync(VetCareDbContext db)   // <-- and more
    {
        return !await db.Appointments.AnyAsync(a => a.VetId == VetId && ...);
    }
}
// Consequences: you cannot test Appointment without a database,
// you cannot move off PostgreSQL without touching the domain,
// and the business rule is mixed with how it is stored.

// GOOD: the domain defines WHAT it needs, infrastructure says HOW
// src/VetCare.Domain/IAppointmentRepository.cs   (the "port")
public interface IAppointmentRepository
{
    Task<bool> OverlapExistsAsync(Guid vetId, DateTime start,
                                  DateTime end, CancellationToken ct);
    Task AddAsync(Appointment appointment, CancellationToken ct);
}

// src/VetCare.Domain/ScheduleService.cs
public class ScheduleService
{
    private readonly IAppointmentRepository _repo;
    private readonly ISystemClock _clock;

    public async Task<Appointment> ScheduleAsync(Guid vetId, Guid petId,
                                                 DateTime start, CancellationToken ct)
    {
        if (start < _clock.Now())
            throw new BusinessRuleException("Cannot book in the past.");

        var end = start.AddMinutes(30);
        if (await _repo.OverlapExistsAsync(vetId, start, end, ct))
            throw new TimeSlotTakenException(vetId, start);

        var appointment = new Appointment(vetId, petId, start, end, _clock.Now());
        await _repo.AddAsync(appointment, ct);
        return appointment;
    }
}

// src/VetCare.Infrastructure/EfAppointmentRepository.cs   (the "adapter")
public class EfAppointmentRepository : IAppointmentRepository { /* uses EF Core */ }

// The definitive test, in the domain's .csproj:
// <ItemGroup> ... no PackageReference to EF Core, Npgsql or ASP.NET
// If the domain references nothing from infrastructure, the arrows are right.`
      },
      steps: [
        'Open VetCare’s four .csproj files and draw on paper one arrow per ProjectReference. Api -> Infrastructure -> Domain is correct; any arrow leaving Domain is a mistake.',
        'Check the usings of every file inside src/VetCare.Domain/. If you find Microsoft.EntityFrameworkCore, Npgsql, Microsoft.AspNetCore or System.Net.Http, you have a leak.',
        'Move each leak: the interface stays in Domain, the implementation goes to Infrastructure. It is exactly week 7’s DIP applied at project level.',
        'Add an architecture test: an xUnit test that walks typeof(Appointment).Assembly.GetReferencedAssemblies() and fails if any contains EntityFramework or Npgsql. (If you want finer rules, the NetArchTest.Rules library lets you write them as sentences.)',
        'Write in docs/architecture.md the layer diagram in Mermaid (graph LR) with the three boxes and the arrows, and below it one sentence explaining what the project gains from that direction.'
      ],
      vet: [
        'In VetCare the domain must compile and be tested without PostgreSQL existing. Literally check that dotnet test tests/VetCare.Domain.Tests passes with Docker turned off.',
        'Write in docs/architecture.md the three things this direction gives you: testing rules in milliseconds, changing database without touching rules, and reading the business without technical noise.'
      ],
      edge: [
        'Folders are not layers. You can have Domain/, Application/ and Infrastructure/ inside a single project and still have spaghetti if nothing stops the cross usings. The architecture test is what makes the rule real.',
        'An entity with EF Core attributes ([Table], [Column]) is already coupled. Use fluent configuration with IEntityTypeConfiguration in Infrastructure and keep the domain clean.',
        'The application layer (use cases) is optional at first. If you only have three endpoints, adding another layer is ceremony. Add it when the domain services start mixing orchestration with rules.'
      ],
      quiz: [
        { q: 'What really defines a layered architecture: the folders or the dependencies?', a: 'The dependencies. Folders are visual organisation and prevent nothing; what defines the architecture is which code may reference which other code. A rule the compiler cannot break is a rule; a folder naming convention is a suggestion.' },
        { q: 'Why must the domain not reference EF Core?', a: 'Because the domain contains the rules that define the business and those rules do not depend on how data is stored. If you couple them to the ORM, you cannot test them without a database, you cannot change storage without touching the business, and every reader has to mentally separate the rule from the technical detail.' },
        { q: 'What is a port and what is an adapter, with a VetCare example?', a: 'A port is the interface the domain declares according to what it needs, like IAppointmentRepository with the OverlapExistsAsync method. An adapter is the concrete implementation that lives outside, like EfAppointmentRepository using EF Core and PostgreSQL. The domain defines the shape of the socket and the infrastructure makes the cable.' },
        { q: 'What is an architecture test for if you have already drawn the diagram?', a: 'The diagram goes out of date as soon as someone adds a reference in a hurry; the test fails in that very commit. It turns the architecture decision into something executable and verifiable, just as a business test turns a rule into something verifiable.' }
      ],
      out: 'A domain with no infrastructure dependencies, verified by an automatic architecture test.',
      file: 'docs/architecture.md'
    },
    {
      t: 'Hexagonal: the domain at the centre',
      obj: 'Reorganise VetCare by ports and adapters and understand that the "outside" includes both the database and the HTTP API itself.',
      why: 'Many people believe hexagonal is only about the database. Understanding that the REST API is also an adapter, interchangeable with a CLI or a message consumer, is the conceptual leap valued in architecture interviews.',
      study: { r: 1, what: 'Read Cockburn’s whole article, it is short. About 12 minutes. Look for one thing: the distinction between driving ports (the ones that call you) and driven ports (the ones you call).',
        pasos: [
          'Read Cockburn’s article from start to finish (~10 min).',
          'Underline the pattern’s goal: that the application can be driven equally by people, programs or tests, and developed without its database.',
          'Split the ports into two groups: those that call the application (the HTTP API, the tests) and those the application calls (database, email).',
          'Draw VetCare’s hexagon with two ports on each side and the concrete adapter for each.'
        ] },
      ex: {
        title: 'The two sides of the hexagon',
        body: `// DRIVEN PORTS: the domain uses them. Interface in Domain.
//   IAppointmentRepository -> adapter: EfAppointmentRepository   (PostgreSQL)
//   INotifier              -> adapter: SmtpNotifier              (email)
//   ISystemClock           -> adapter: SystemClock               (DateTime.UtcNow)
//   IPaymentGateway        -> adapter: StripeGateway             (HTTP)
//
// DRIVING PORTS: someone calls them. They are your use cases.
//   IScheduleAppointment   -> adapters: AppointmentEndpoints (HTTP)
//                                       ScheduleCommandLine  (CLI)
//                                       AppointmentConsumer  (queue)

// src/VetCare.Application/IScheduleAppointment.cs
public interface IScheduleAppointment
{
    Task<ScheduleResult> ExecuteAsync(ScheduleAppointmentCommand cmd, CancellationToken ct);
}

public record ScheduleAppointmentCommand(Guid VetId, Guid PetId, DateTime Start);
public record ScheduleResult(Guid AppointmentId, DateTime Start, DateTime End);
// Notice: no HttpRequest, no IActionResult, no DbContext. Our own types.

// src/VetCare.Application/ScheduleAppointment.cs
public class ScheduleAppointment : IScheduleAppointment
{
    private readonly ScheduleService _schedule;
    private readonly IUnitOfWork _uow;

    public async Task<ScheduleResult> ExecuteAsync(ScheduleAppointmentCommand cmd, CancellationToken ct)
    {
        var appointment = await _schedule.ScheduleAsync(cmd.VetId, cmd.PetId, cmd.Start, ct);
        await _uow.SaveChangesAsync(ct);
        return new ScheduleResult(appointment.Id, appointment.Start, appointment.End);
    }
}

// src/VetCare.Api/Endpoints/AppointmentEndpoints.cs  (HTTP adapter, very thin)
group.MapPost("/", async (CreateAppointmentRequest req, IScheduleAppointment useCase, CancellationToken ct) =>
{
    try
    {
        var r = await useCase.ExecuteAsync(
            new ScheduleAppointmentCommand(req.VetId, req.PetId,
                                           req.Start.UtcDateTime), ct);
        return Results.Created($"/api/v1/appointments/{r.AppointmentId}",
            new AppointmentResponse(r.AppointmentId, r.Start, r.End, "scheduled"));
    }
    catch (TimeSlotTakenException ex)
    {
        return Results.Problem(title: "Time slot taken", detail: ex.Message, statusCode: 409);
    }
});
// The endpoint only translates: HTTP -> command, result -> HTTP, exception -> status.
// Zero business rules. If you delete the API, the use case is still usable.`
      },
      steps: [
        'Create the src/VetCare.Application project referencing only VetCare.Domain. Add it to the solution and make VetCare.Api reference it.',
        'Move one complete use case into Application: ScheduleAppointment, with its command, its result and its interface. The ScheduleService domain service stays in Domain.',
        'Slim the POST /appointments endpoint down until it only does three things: build the command, call the use case, and translate the result or exception into HTTP.',
        'Write a second driving adapter to prove the point: a small console command in src/VetCare.Cli that calls IScheduleAppointment directly, without going through HTTP.',
        'Draw the hexagon in docs/architecture.md with Mermaid: the domain in the centre, the driven ports on the right with their adapters, the driving ones on the left with theirs.'
      ],
      vet: [
        'In VetCare the use cases are exactly: ScheduleAppointment, CancelAppointment, RecordVisit, IssueInvoice, GetPetHistory. Create at least the interfaces for all five even if you only implement one.',
        'Add the ports table to docs/architecture.md: name, type (driving or driven), current adapter, an imaginable alternative adapter. That last column is what shows the pattern’s value.'
      ],
      edge: [
        'If your application layer only forwards calls to the domain without adding anything, it is noise. Justify it when it orchestrates several things: a transaction, several aggregates, publishing events.',
        'The API DTOs and the application commands look the same at first and the temptation is to reuse them. Do not: the DTO changes for HTTP contract reasons and the command for business reasons, and coupling them forces you to break one when changing the other.',
        'Hexagonal does not imply microservices. All of this fits perfectly in a single-process monolith, and in fact that is where it pays off most.'
      ],
      quiz: [
        { q: 'What is the difference between a driving port and a driven port?', a: 'A driven port is an interface the domain declares because it needs something from outside, such as persistence or email, and infrastructure implements it. A driving port is an interface that exposes what the system can do, and someone outside calls it, like the HTTP endpoint or a CLI. What changes is the direction of the call.' },
        { q: 'Why is the HTTP API an adapter and not "the application"?', a: 'Because it is just one way of invoking the use cases, interchangeable with a CLI, a queue consumer or a scheduled job. If the logic were in the endpoint, each new way of invoking it would force you to duplicate it; keeping it in the use case, adding an adapter costs a few lines.' },
        { q: 'Why not reuse the API DTO as the application command?', a: 'Because they change for different reasons. The DTO changes when the public contract changes, for example renaming a field for client compatibility. The command changes when the use case changes. Coupling them lets an HTTP contract decision leak into the core.' },
        { q: 'How does the console adapter prove the architecture works?', a: 'Because if you can book an appointment from the console without touching a single line of the domain or the application, it is proven that the core does not depend on HTTP. It is the practical verification of the hexagon, equivalent to the previous day’s architecture test.' }
      ],
      out: 'A VetCare.Application project with explicit use cases and two working driving adapters.',
      file: 'src/VetCare.Application/'
    },
    {
      t: 'Light CQRS: reading is not writing',
      obj: 'Separate the read path from the write path where it helps, using direct queries to read and the domain model only to write.',
      why: 'This is where most people overdo it: they set up event sourcing and two databases for a CRUD app. Being able to apply the light version and explain why you do not apply the heavy one shows judgement, which is what is really sought in an architect.',
      study: { r: 2, what: 'Read Fowler’s whole article, it is two pages. About 10 minutes. Look for one thing: the section where he says when NOT to use CQRS. That is the part almost nobody quotes.',
        pasos: [
          'Read the article from start to finish (~5 min).',
          'Look at the diagram: one model for updating and a different one for querying.',
          'Read "When to use it" (~3 min) and copy the warning: in most systems CQRS adds risky complexity.',
          'Write which VetCare reads would gain from a direct query (today’s schedule) and which need nothing special.'
        ] },
      ex: {
        title: 'Two paths with different needs',
        body: `// THE PROBLEM: forcing reads through the write model
var appointments = await _repo.ByVetAsync(vetId, ct);   // brings whole aggregates
var dto = appointments.Select(a => new AppointmentListDto(
    a.Id, a.Start, a.Pet.Name, a.Pet.Owner.Name)).ToList();
// To draw a 4-column table you loaded whole entities, with tracking,
// with all their collections, and caused an N+1 or a huge Include.

// WRITE: ALWAYS goes through the domain. That is where the rules live.
public async Task<ScheduleResult> ExecuteAsync(ScheduleAppointmentCommand cmd, CancellationToken ct)
{
    var appointment = await _schedule.ScheduleAsync(cmd.VetId, cmd.PetId, cmd.Start, ct);
    await _uow.SaveChangesAsync(ct);
    return new ScheduleResult(appointment.Id, appointment.Start, appointment.End);
}

// READ: does NOT go through the domain. It projects straight to what the screen needs.
// Application cannot see the DbContext (it only references Domain), so:
//   src/VetCare.Application/Queries/IDailyAgenda.cs   -> the interface and the DTO
//   src/VetCare.Infrastructure/Queries/DailyAgenda.cs -> the real query
public class DailyAgenda : IDailyAgenda
{
    private readonly VetCareDbContext _db;   // here it is fine

    public Task<List<AgendaRowDto>> ExecuteAsync(Guid vetId, DateOnly day, CancellationToken ct)
    {
        var from = day.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var to   = from.AddDays(1);   // a range, not .Date: so it uses the index (week 10)

        return (from a in _db.Appointments.AsNoTracking()
                join p in _db.Pets   on a.PetId   equals p.Id
                join o in _db.Owners on p.OwnerId equals o.Id
                where a.VetId == vetId
                   && a.Start >= from && a.Start < to
                orderby a.Start
                select new AgendaRowDto(
                    a.Id, a.Start, a.End, p.Name, o.Name,
                    a.Status.ToString().ToLowerInvariant()))
               .ToListAsync(ct);
    }
}
// A single SQL query, only the needed columns, no tracking, no aggregates.
// (The joins are by hand because Appointment points to Pet only by Id, week 12.)

// And when not even LINQ will do, plain SQL with no fuss:
public record MonthlySummaryDto(DateTime Month, long Total, long Cancelled);

public async Task<List<MonthlySummaryDto>> SummaryAsync(int year, CancellationToken ct)
{
    // The aliases are quoted so they match the record's properties
    // EXACTLY: PostgreSQL lowercases anything that is not quoted,
    // and EF would not find "Month".
    const string sql = """
        SELECT date_trunc('month', a.starts_at)                AS "Month",
               count(*)                                        AS "Total",
               count(*) FILTER (WHERE a.status = 'cancelled')  AS "Cancelled"
        FROM appointment a
        WHERE a.starts_at >= make_date(@year, 1, 1)
          AND a.starts_at <  make_date(@year + 1, 1, 1)
        GROUP BY 1 ORDER BY 1
        """;
    return await _db.Database.SqlQueryRaw<MonthlySummaryDto>(sql,
        new NpgsqlParameter("year", year)).ToListAsync(ct);
}

// Light CQRS = this. Same database, same tables, two code paths.
// Heavy CQRS = a separate read database, synchronisation, eventual consistency.
// Only the latter if you have a real imbalance between reads and writes.`
      },
      steps: [
        'Create two folders in VetCare.Application: Commands/ and Queries/. Move ScheduleAppointment into Commands/. Queries/ holds only the read interfaces and DTOs; their implementations go in VetCare.Infrastructure/Queries/.',
        'Write the DailyAgenda query exactly as in the example (interface in Application, implementation in Infrastructure), projecting directly into AgendaRowDto without going through the domain repository.',
        'Compare with EXPLAIN ANALYZE, as you learned in week 10, the SQL generated by the repository version and by the direct projection. Note both durations.',
        'Write the monthly summary query in plain SQL using SqlQueryRaw and parameters. Never concatenate the year into the string: that is SQL injection.',
        'Document in docs/architecture.md the rule you just adopted: writes go through the domain, reads project directly, and the reason for each.'
      ],
      vet: [
        'In VetCare the queries that clearly take the read path are: today’s schedule, a pet’s history, the invoice list and the monthly summary. The writes are yesterday’s five use cases.',
        'Make it clear in docs/architecture.md that VetCare uses light CQRS with a single database, and write explicitly which condition would have to be met to justify the heavy version.'
      ],
      edge: [
        'CQRS does not require two databases. That is the advanced version, it brings eventual consistency and multiplies the operational complexity. 95% of projects only need the code separation.',
        'Read queries that skip the domain can also skip visibility rules. If a pet is confidential, that filter must be in the query too: duplicating it is a known risk you have to cover with tests.',
        'Do not create one DTO per screen if two screens need the same thing, and do not reuse one for three different screens by forcing null fields. A read DTO exists to serve a specific view.'
      ],
      quiz: [
        { q: 'What exactly is CQRS in its light version?', a: 'Separating the code that writes from the code that reads: writes go through the domain model where the rules live, and reads project straight from the database into a DTO shaped for the screen. It is a separation of code paths, not of databases.' },
        { q: 'Why can reads skip the domain model without breaking the architecture?', a: 'Because the domain model exists to protect invariants when changing state, and a read changes nothing. Forcing it through whole aggregates only adds cost without providing any protection.' },
        { q: 'When should you NOT apply CQRS, according to Fowler?', a: 'When the domain is a simple CRUD where the read and write models are practically the same. There the separation adds code and concepts without solving any problem, and Fowler warns explicitly that the pattern is applied far more often than it should be.' },
        { q: 'What concrete risk does skipping the domain on reads introduce and how is it mitigated?', a: 'That visibility or filtering rules the domain applied are left out of the direct query and data that should not be seen gets exposed. It is mitigated by replicating those filters in the query and covering them with integration tests that check a user does not see what is not theirs.' }
      ],
      out: 'Commands and queries separated, with at least one projected query and one in parameterised plain SQL.',
      file: 'src/VetCare.Application/Queries/'
    },
    {
      t: 'Domain events',
      obj: 'Let the domain announce what has happened without knowing who is listening, and dispatch those events at the right moment relative to the transaction.',
      why: 'It is the clean way to solve "when X happens, also do Y and Z" without the use case growing out of control. In interviews it is the natural answer to how to decouple side effects, and it connects directly with last week’s outbox.',
      study: { r: 3, what: 'Read Microsoft Learn’s domain events page, focusing on how they are collected in the entity and when they are dispatched. About 15 minutes. Look for one thing: why they are dispatched before the commit and not after.',
        pasos: [
          'Read "What is a domain event?" and "Domain events versus integration events" (~5 min).',
          'Read "Raise domain events" and "The deferred approach to raise and dispatch events" (~5 min): the entity keeps the events in a list and they are dispatched on save.',
          'Read "Single transaction across aggregates versus eventual consistency across aggregates" (~4 min).',
          'Skim "How to handle domain events" (~2 min).',
          'Write two VetCare events in the past tense (AppointmentScheduled, VaccineApplied) and what should happen when each one occurs.'
        ] },
      ex: {
        title: 'The entity announces, the use case dispatches',
        body: `// src/VetCare.Domain/Events/IDomainEvent.cs
public interface IDomainEvent { DateTime OccurredAt { get; } }

public record AppointmentScheduled(Guid AppointmentId, Guid VetId, Guid PetId,
                                   DateTime Start, DateTime OccurredAt) : IDomainEvent;

// src/VetCare.Domain/EntityBase.cs
public abstract class EntityBase
{
    private readonly List<IDomainEvent> _events = new();
    public IReadOnlyList<IDomainEvent> Events => _events;
    protected void Raise(IDomainEvent e) => _events.Add(e);
    public void ClearEvents() => _events.Clear();
}

// The entity only ANNOUNCES. It does not know or care who is listening.
public class Appointment : EntityBase
{
    public Appointment(Guid vetId, Guid petId, DateTime start, DateTime end, DateTime now)
    {
        Id = Guid.NewGuid();   // the Id exists BEFORE the event is announced
        VetId = vetId; PetId = petId; Start = start; End = end;
        Status = AppointmentStatus.Scheduled;
        Raise(new AppointmentScheduled(Id, vetId, petId, start, now));
    }
}

// The IHandler interface lives in Application. There can be several per event.
public interface IHandler<in T> where T : IDomainEvent
{
    Task HandleAsync(T evt, CancellationToken ct);
}

// This handler writes to the DbContext, so it lives in Infrastructure:
// src/VetCare.Infrastructure/Handlers/QueueConfirmation.cs
public class QueueConfirmation : IHandler<AppointmentScheduled>
{
    private readonly VetCareDbContext _db;
    public Task HandleAsync(AppointmentScheduled e, CancellationToken ct)
    {
        _db.Outbox.Add(new OutboxMessage("AppointmentCreated",
            JsonSerializer.Serialize(new { e.AppointmentId, e.Start }), e.OccurredAt));
        return Task.CompletedTask;   // it only adds to the context, it does NOT save
    }
}

// The dispatch: BEFORE SaveChanges, inside the same transaction.
// It is the IUnitOfWork implementation, in Infrastructure:
public async Task SaveChangesAsync(CancellationToken ct)
{
    var entities = _db.ChangeTracker.Entries<EntityBase>()
        .Select(e => e.Entity)
        .Where(e => e.Events.Count > 0)
        .ToList();

    var events = entities.SelectMany(e => e.Events).ToList();
    entities.ForEach(e => e.ClearEvents());

    foreach (var ev in events)
        await _dispatcher.DispatchAsync(ev, ct);   // the handlers write to the context

    await _db.SaveChangesAsync(ct);   // ONE commit with the appointment and the outbox together
}
// Why before the commit: so the appointment and the outbox message are atomic.
// If you dispatched afterwards, you could have the appointment saved and the outbox lost.`
      },
      steps: [
        'Create EntityBase with the list of events and make Appointment, Visit and Invoice inherit from it. The domain entities change in nothing else.',
        'Define the events VetCare really needs: AppointmentScheduled, AppointmentCancelled, VisitRecorded, InvoiceIssued. As immutable records with the minimum data.',
        'Implement the dispatcher: a class that receives IServiceProvider and resolves IEnumerable<IHandler<T>> for the event’s concrete type. Register it as scoped.',
        'Move the code that inserts into the outbox from the ScheduleAppointment use case into the QueueConfirmation handler. The use case should end up shorter than before.',
        'Write a domain test with no database: create an Appointment and check that its Events collection contains exactly one AppointmentScheduled with the right data.'
      ],
      vet: [
        'In VetCare the AppointmentScheduled event will have at least two handlers: queue the confirmation email and record the appointments-created metric. Having two is exactly what shows the pattern’s value.',
        'Add the list of events with their current handlers to docs/architecture.md. That table is the map of your system’s side effects.'
      ],
      edge: [
        'A domain event is in the past and is a fact: it is named with a past participle (AppointmentScheduled, not ScheduleAppointment) and can never fail in the sense of rejecting the operation. If a handler needs to veto, it was not an event but part of the rule.',
        'VetCare generates the Guid in the domain, so the event is born with the right Id. If one day you use ids generated by the database, do not raise events from the constructor: the event would carry Id 0.',
        'Synchronous handlers inside the transaction must be fast and do no external I/O. Calling HTTP in there lengthens the transaction and brings back the problem the outbox was meant to solve.'
      ],
      quiz: [
        { q: 'Why are domain events dispatched before SaveChanges and not after?', a: 'So that what the handlers write goes into the same transaction as the change that triggered them. That way the appointment and its outbox message are saved or discarded together. Dispatching after the commit opens the window where the appointment exists and its side effect is lost.' },
        { q: 'What does the ScheduleAppointment use case gain by moving the outbox insert into a handler?', a: 'It stops knowing about side effects. If tomorrow you need to record a metric, send an SMS and update a statistic, you add three handlers and the use case does not change a line. It is the open-closed principle applied to effects.' },
        { q: 'Why is an event named in the past tense and what does that imply?', a: 'Because it describes something that already happened and is a done deal, not a request. It implies that no handler can cancel the operation: if a condition must be able to prevent the appointment from being created, that condition is a domain rule and must be evaluated before, not in a handler.' },
        { q: 'What is the problem with raising AppointmentScheduled from the constructor when the database generates the Id?', a: 'At that moment the Id is still 0, so the event travels with an invalid identifier and the handler cannot reference the appointment. It is solved by generating the identifier in the domain, for example with a Guid, or by raising the event after the entity has its Id.' }
      ],
      out: 'Domain events working with pre-commit dispatch and at least two handlers on the same event.',
      file: 'src/VetCare.Domain/Events/'
    },
    {
      t: 'Modularity and module boundaries',
      obj: 'Split VetCare into modules by business capability and define how they talk to each other without creating a tangle of dependencies.',
      why: 'It is the basis for understanding microservices without falling into them. The question "how would you split this system" appears in every design interview, and the mature answer talks about business boundaries and the cost of communication, not about technology.',
      study: { r: 4, what: 'Read Fowler’s article on the costs and benefits of splitting into services. About 15 minutes. Look for one thing: which concrete cost appears the moment two modules stop sharing a process.',
        pasos: [
          'Read the introduction and "Strong Module Boundaries (Pro)" (~4 min): a monolith can also have strong boundaries if you look after them.',
          'Read "Distribution (Con)" (~4 min): remote calls are slow and can fail. That is today’s cost.',
          'Read "Eventual Consistency (Con)" (~3 min).',
          'Read "Summing Up" (~2 min).',
          'Write VetCare’s modules (scheduling, clinic, billing) and what each one may call in the others.'
        ] },
      ex: {
        title: 'VetCare’s modules and their boundaries',
        body: `src/
  VetCare.Modules.Scheduling/      <- appointments, availability, calendar
  VetCare.Modules.Clinic/          <- visits, diagnoses, prescriptions, vaccines
  VetCare.Modules.Billing/         <- invoices, lines, payments
  VetCare.Modules.Patients/        <- pets, owners, vets
  VetCare.Shared/                  <- minimal types: ids, Money, ISystemClock
  VetCare.Api/                     <- the single host, mounts each module's endpoints

// RULE 1: each module has its own Domain, Application and Infrastructure inside.
//         The layered structure repeats INSIDE each module.

// RULE 2: a module does NOT reference another module's project.
//         If it needs something, it asks through a small public contract.

// VetCare.Modules.Patients/Contracts/IPatientQueries.cs   (the module's public API)
public interface IPatientQueries
{
    Task<PetSummary?> GetAsync(Guid petId, CancellationToken ct);
}
public record PetSummary(Guid Id, string Name, string Species, Guid OwnerId);
// Notice how small it is. The Scheduling module does NOT need the whole Pet
// entity, only to know it exists and what it is called.

// RULE 3: no JOINs between tables of different modules.
//         Scheduling has appointment.pet_id, but does not JOIN with pet.
//         If it needs the name, it calls IPatientQueries. It hurts a little. That is the point.

// RULE 4: communication that does not need an immediate answer goes through events.
//         Billing publishes InvoiceIssued; Clinic listens if it cares.
//         Neither knows the other.

// HOW TO PROVE THE BOUNDARIES ARE GOOD
//   - How many public contracts does each module expose? Few = a good boundary.
//   - How often do you change two modules in the same commit? Often = a bad boundary.
//   - Could you move a module into its own process by changing only the adapter? Yes = a good boundary.

// WHEN TO MOVE TO MICROSERVICES: when a module needs to scale, deploy or fail
// independently AND the team can take on the network, deployments and eventual
// consistency. Until then, the modular monolith always wins.`
      },
      steps: [
        'Draw VetCare’s four modules in docs/architecture.md and, for each pair that communicates, an arrow labelled with exactly what one needs from the other.',
        'Define each module’s minimal public contract: an interface with the methods other modules need, and plain records as parameters and return values. Make it embarrassingly small.',
        'Identify every JOIN in your current code that crosses the boundary between two modules. Write them down: they are your boundary debt. You do not have to fix them all today.',
        'Pick the clearest case and replace the JOIN with a call to the other module’s public contract. Measure whether the query becomes unacceptably slow: if it does, the boundary is in the wrong place.',
        'Apply the three-criteria test to your boundaries and write the conclusion: number of contracts per module, how often you have touched two modules at once, and whether you could extract one.'
      ],
      vet: [
        'In VetCare the most debatable boundary is Scheduling versus Clinic: an appointment becomes a visit. Decide whether they are one module or two and write in docs/architecture.md the argument that convinced you, with its counter-argument.',
        'Write explicitly that VetCare is and will remain a modular monolith, and what concrete signal would make you reconsider. Knowing when not to split is as valuable as knowing how to split.'
      ],
      edge: [
        'A shared module that ends up containing business entities stops being shared and becomes a second global coupling. Shared holds only technical types with no rules: ids, Money, the clock.',
        'Forbidding JOINs between modules costs performance in reports that cut across everything. The honest way out is a read view or query explicitly marked as cross-module, not silently breaking the rule.',
        'Splitting by technical layers (all controllers together, all repositories together) is not modularity: any business change still touches every folder. Modules are split by business capability.'
      ],
      quiz: [
        { q: 'Why should a module not JOIN with another module’s tables?', a: 'Because that JOIN turns the other module’s internal schema into its public contract: any column rename breaks someone else’s code. Going through an explicit contract keeps the schema an internal detail and lets each module evolve its storage on its own.' },
        { q: 'What signal tells you two modules are badly separated?', a: 'That you almost always change them in the same commit. If adding a feature systematically forces you to touch both, they share a reason to change and the boundary is cutting in the wrong place; they should probably be one.' },
        { q: 'Why is splitting by technical layers not modularity?', a: 'Because a business change such as adding a field to the appointment forces you to touch the controllers folder, the services folder, the repositories folder and the entities folder. Real modularity aims to keep a business change contained in one place, and that only happens when you split by business capability.' },
        { q: 'Which conditions must be met to justify moving a module into a microservice?', a: 'That the module needs to scale, deploy or fail independently of the rest, and that the team can take on the cost that comes with the network: latency, partial failures, coordinated deployments and eventual consistency. Without the first condition it is gratuitous complexity; without the second it is unaffordable complexity.' }
      ],
      out: 'A module map with defined public contracts and the boundary debt identified in writing.',
      file: 'docs/architecture.md'
    },
    {
      t: 'Defending your architecture (weekly exam)',
      obj: 'Write VetCare’s architecture decisions in ADR format and be able to defend each one with its discarded alternative.',
      why: 'In a senior interview nobody asks you to recite patterns: they ask you to defend a decision and say what you discarded and why. An ADR is exactly that exercise in writing, and having five written gives you concrete material to talk about.',
      study: { r: 5, what: 'Read the original article that proposed ADRs. About 10 minutes. Look for one thing: why the consequences section must also include the bad, because an ADR with no drawbacks is propaganda.',
        pasos: [
          'Read the introduction (~3 min): why architecture decisions get lost if they are not written down.',
          'Read the parts of the format: "Context", "Decision", "Status" and "Consequences" (~4 min).',
          'Read "Experience Report" (~2 min).',
          'Copy the template into docs/adr/0000-template.md before writing your ADRs.'
        ] },
      ex: {
        title: 'ADR template and a complete example',
        body: `# ADR-004: The domain does not depend on EF Core

## Status
Accepted — 2026-10-04

## Context
VetCare uses EF Core on PostgreSQL. The initial temptation was to put mapping
attributes on the entities and query methods inside them, which is the fastest
thing to write. The scheduling rules (overlaps, opening hours, cancellations)
are the part of the system that will change most and most needs fast tests.

## Decision
The VetCare.Domain project references no infrastructure package. The
persistence interfaces (IAppointmentRepository, IUnitOfWork) are declared in
Domain and implemented in Infrastructure. Mapping is configured with
IEntityTypeConfiguration in Infrastructure, not with attributes on the entities.

## Alternatives considered
1. Entities with EF attributes and queries inside the domain.
   Discarded: it forces you to start PostgreSQL to test an overlap rule.
2. The Active Record pattern (the entity saves itself).
   Discarded: it mixes the rule with persistence and makes the in-memory double impossible.
3. A generic IRepository<T> for everything.
   Discarded: it ends up exposing IQueryable and leaks EF Core into the domain anyway.

## Consequences
Positive: domain tests run in milliseconds without Docker; the rules read without
technical noise; changing storage affects a single project.
Negative: there are more interfaces and more mapping code; some queries that
would be trivial with direct LINQ need an explicit repository method.
Mitigation: reads use light CQRS and go straight to the DbContext (see ADR-006).

## How it is verified
The ArchitectureTests.Domain_does_not_reference_infrastructure test inspects the
referenced assemblies and fails if EntityFramework or Npgsql appears.

---
THE FIVE ADRs YOU MUST WRITE THIS WEEK
  ADR-004  The domain does not depend on EF Core           (day 1)
  ADR-005  Explicit use cases in VetCare.Application       (day 2)
  ADR-006  Light CQRS: reads projected directly            (day 3)
  ADR-007  Domain events dispatched before the commit      (day 4)
  ADR-008  Modular monolith, not microservices             (day 5)`
      },
      steps: [
        'Create the docs/adr/ folder and write the five ADRs, one per day of this week, following the exact template: context, decision, alternatives considered, positive and negative consequences, and how it is verified.',
        'The alternatives section is mandatory and needs at least two discarded options with their reason. An ADR with no alternatives does not prove you decided anything.',
        'The negative consequences section is mandatory too. If you cannot find any, you have not understood the cost of your decision: think again.',
        'Check that each ADR has a concrete verification: a test, a manual check or a command. A decision that cannot be checked erodes on its own.',
        'Explain ADR-008 out loud in three minutes as if you were asked in an interview: what you decided, what you discarded, what it would cost you and what signal would make you change your mind.'
      ],
      vet: [
        'Check that the whole set is consistent: your layer diagram, your hexagon, your module map and your five ADRs must tell the same story. If one contradicts another, one of the two is out of date.',
        'Press "Mark for review" and reread docs/adr/ in a week.'
      ],
      edge: [
        'An ADR is not edited when you change your mind: you write a new one that supersedes it and the old one moves to Superseded by ADR-00X status. The value lies in the historical record of why you thought what you thought.',
        'An ADR that only says "we use clean architecture because it is good practice" is worth nothing. The value is in YOUR project’s concrete context and in the alternatives you discarded for concrete reasons.',
        'Beware of defending an architecture whose cost you have not paid. If you have never felt the pain of the extra interfaces, your defence sounds like a textbook recital. Say honestly which part has cost you.'
      ],
      quiz: [
        { q: 'Why is the discarded alternatives section the most valuable part of an ADR?', a: 'Because it is what proves there was a decision and not a copy. It tells the future reader, who may be you, which options were already evaluated and why they were rejected, stopping someone from reopening the debate without information or repeating a path already explored.' },
        { q: 'Why is an ADR never edited when you change your mind?', a: 'Because the document records what was known and decided at a specific moment. Editing it erases that historical context. The right thing is to write a new ADR that supersedes it, leaving the evolution of the project’s thinking visible.' },
        { q: 'What is an ADR with no negative consequences missing?', a: 'Honesty, and probably understanding. Every architecture decision trades some costs for others: more interfaces, more latency, more ceremony, less flexibility. If you do not identify the price, you are not comparing options, you are justifying one you had already chosen.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That architecture is not boxes in a diagram but rules about who may depend on whom, chosen deliberately according to what this particular project needs to change easily, verified with tests and recorded with their discarded alternatives so the decision outlives the person who made it.' }
      ],
      out: 'Five ADRs written in docs/adr/ with alternatives, negative consequences and concrete verification.',
      file: 'docs/adr/'
    }
  ]
}
]);
