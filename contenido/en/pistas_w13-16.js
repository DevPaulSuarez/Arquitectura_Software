/* One hint for each "Do it yourself" step: how to start, an example and how to know it is right.
   Key: w<week>d<day>; the order matches days[].steps. */
window.EN = window.EN || {};
window.EN.PISTAS = Object.assign(window.EN.PISTAS || {}, {

/* ---------- Week 13 ---------- */

'w13d1': [
  '"dotnet new xunit -o tests/VetCare.Domain.Tests", "dotnet sln add tests/VetCare.Domain.Tests", "dotnet add tests/VetCare.Domain.Tests reference src/VetCare.Domain" and "dotnet add tests/VetCare.Domain.Tests package FluentAssertions". Run "dotnet test": the sample test that comes with the template must pass.',
  'Split them: 3 for valid and invalid creation (past date, duration 0, duration over 2 h), 2 for the initial status, 2 for the end calculation, 3 for transitions (cancel a pending one, cancel an already cancelled one, attend a cancelled one). Structure of every test: Arrange (prepare), Act (one single action), Assert (check).',
  '"[Theory] [InlineData(0)] [InlineData(-15)] [InlineData(180)] public void Schedule_WhenDurationInvalid_Throws(int minutes) { var act = () => Appointment.Schedule(…, minutes, …); act.Should().Throw<ArgumentOutOfRangeException>(); }". If you have three tests that only change a number, turn them into a Theory.',
  'Examples: "Cancel_WhenAlreadyCancelled_Throws", "Schedule_WhenDateIsInThePast_Rejects", "End_WhenItLasts30Minutes_IsStartPlusHalfHour". Read them one after another as if they were a list of requirements: if one cannot be understood without opening the code, rename it.',
  'All green, and now sabotage it: change "end > start" to "end >= start" or comment out a throw. Run "dotnet test": at least one test must go red. If everything stays green, your tests are missing that case. Undo the sabotage when you finish.'
],

'w13d2': [
  'Table: | Rule | Test? | Test name |. Copy your BRs from week 1 and the invariants from week 4. Mark ✓ only if there is a test that would fail when that rule breaks. Rules without ✓ are your list of testing debt.',
  'Signal: the Assert is "mock.Verify(x => x.Save(…), Times.Once)" and it does not check any result. Rewrite it to check the effect: "repo.Appointments.Should().ContainSingle(a => a.Status == Pending)". Verifying calls only makes sense when the call IS the result (for example, sending an email).',
  '"dotnet test --collect:"XPlat Code Coverage"" generates a coverage.cobertura.xml. To see it as HTML: "dotnet tool install -g dotnet-reportgenerator-globaltool" and "reportgenerator -reports:**/coverage.cobertura.xml -targetdir:coverage". Open coverage/index.html and go into VetCare.Domain.',
  'For each red line, ask: if this fails, what happens to the clinic? Wrong billing or medical data → write the test. A ToString or a log message → note it as "accepted risk: cosmetic". Write the decision in testing.md, not only in your head.',
  'Candidates to delete: "var p = new Pet("Max"); p.Name.Should().Be("Max");" (it tests the compiler, not your logic) and tests with no Assert. Quick check: if you can delete the line of code they "test" and they stay green, the test protects nothing.'
],

'w13d3': [
  'FixedClock (stub: returns a fixed value). InMemoryAppointmentRepository (fake: it really works, but with a List). SpyNotifier (spy: stores what it was asked in "List<string> Sent"). Dummy: an object passed because the constructor asks for it, but the test never uses it. Put them in tests/VetCare.Domain.Tests/Doubles/.',
  'Ideas: schedules fine → the appointment is in the repository; overlap → exception; in the past (with FixedClock) → exception; after scheduling → the spy has 1 message; if validation fails → the spy has 0 messages. Each test builds the scheduler with new doubles so no state is shared.',
  '"dotnet add package Moq". Example: "var clock = new Mock<ISystemClock>(); clock.Setup(c => c.Now).Returns(new DateTime(2026, 6, 1));" and you pass "clock.Object". Compare both tests: which one does someone who does not know Moq understand better? Write your conclusion in one line.',
  'State: the Assert looks at data ("repo.Appointments.Count.Should().Be(1)"). Behaviour: it looks at interactions ("spy.Sent.Should().HaveCount(1)"). Typical justification: saving is checked by state (what matters is that the appointment exists); notifying, by behaviour (what matters is that the sending was requested, and there is no state to look at).',
  '"dotnet test tests/VetCare.Domain.Tests" shows the total time at the end. If it goes over 1 s, look for tests that use Thread.Sleep, Task.Delay, files, HttpClient or a real database: they should not exist in domain tests. Replace them with doubles.'
],

'w13d4': [
  'First write 4 or 5 concrete examples on paper: "8-week-old dog with no vaccines → combination vaccine today", "dog with the combination vaccine 3 weeks ago → booster in 1 week", "adult cat with rabies 11 months ago → rabies in 1 month". Each example will be a test, in order from easiest to hardest.',
  'Test: "var schedule = new VaccinationSchedule(); var next = schedule.Next(Species.Dog, ageWeeks: 8, history: []); next.Vaccine.Should().Be("Combination");". It does not compile because the class does not exist: that is the red. Create only the minimum so it compiles and see the red again (now the Assert fails).',
  'Red → green (the minimum code, even "return "Combination"") → refactor. Next test: the one that forces you to remove the hard-coded value. Note the time when you start and finish each cycle: healthy is between 2 and 10 minutes. If a cycle takes 30, the step was too big.',
  'With 3 or 4 green tests, the code will have repeated ifs. Typical refactor: a table of rules "(species, vaccine, minimum age, interval)" and a loop that goes through it. Run the tests after every small change: they must stay green the whole time.',
  'Write in testing.md: VaccinationSchedule’s dependencies (probably none, or only the clock), how long each test took and which design decision TDD forced on you (for example, passing the date as a parameter). Compare it with a class written without TDD: how many dependencies does that one have?'
],

'w13d5': [
  '"dotnet new xunit -o tests/VetCare.Api.Tests", add it to the solution, reference src/VetCare.Api and the packages "Microsoft.AspNetCore.Mvc.Testing", "Testcontainers.PostgreSql" and FluentAssertions. Docker must be running: Testcontainers starts a throwaway PostgreSQL for every run.',
  'At the end of Program.cs, after app.Run(): "public partial class Program { }". It lets WebApplicationFactory<Program> find the class from the test project (in .NET 10 it is already visible, but it does no harm).',
  '"public class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime { readonly PostgreSqlContainer _db = new PostgreSqlBuilder().WithImage("postgres:17").Build(); public async Task InitializeAsync() { await _db.StartAsync(); /* apply migrations and test-data.sql */ } protected override void ConfigureWebHost(IWebHostBuilder b) => b.UseSetting("ConnectionStrings:VetCare", _db.GetConnectionString()); … }".',
  'Use "var client = factory.CreateClient();" and then "await client.PostAsJsonAsync("/api/v1/appointments", dto)". Check the code: "resp.StatusCode.Should().Be(HttpStatusCode.Created)". For the 409, create an appointment and then another overlapping one. For pagination, ask for 2 pages and check the ids are not repeated.',
  'Options: each test uses its own data (new ids, a vet created in the test) or you clean the tables before each test (TRUNCATE or the Respawn library). Test the order: run a single test with "dotnet test --filter "Name"" and then all of them. If one passes alone and fails in the group, they share data.'
],

'w13d6': [
  'In bash: "for i in $(seq 10); do dotnet test --no-build || echo "FAILED on run $i"; done". In PowerShell: "1..10 | % { dotnet test --no-build }". If any run fails, note which test: the usual culprits are dates (DateTime.Now), order and shared data.',
  '"dotnet test tests/VetCare.Domain.Tests --logger "console;verbosity=normal"" shows each test with its duration. Sort them by time in your head: the ones taking more than 50 ms almost always touch disk or network, or have a Sleep. Replace them with doubles.',
  'Simple mutations: change ">" to ">=" in the overlap rule, delete a validation throw, change "+ 30" to "+ 31" in the end calculation. Do one at a time and run the suite. If one leaves everything green, write the test that catches it and undo the mutation.',
  'Go through the checklist with the code in front of you and, for each point, write the name of the test or file that proves it. Example: "tests do not depend on order → proven by running 10 times". If you cannot point at the proof, mark it ✗ and fix it.',
  'Structure: 1) what you test (domain rules with unit tests, the API with integration tests), 2) what you do not and why (getters, the framework), 3) how you know it works (mutations caught, 10 stable runs, suite time). Use concrete numbers. Record yourself.'
],

/* ---------- Week 14 ---------- */

'w14d1': [
  'Search for "Async(" in Program.cs and in your endpoints. For each call check whether it receives ct or not: "ToListAsync()" with no arguments = it does not. Make a list: "GET /appointments → ToListAsync() without ct". That number is your starting point.',
  '"app.MapGet("/api/v1/appointments", async (VetCareDbContext db, CancellationToken ct) => …)". ASP.NET passes it the request’s token: it is cancelled on its own if the client closes the connection. By convention it always goes as the last parameter.',
  'Every intermediate method needs its parameter: "Task<Appointment> ScheduleAsync(…, CancellationToken ct)", and every call passes it on: "await _repo.SaveAsync(appointment, ct)". It ends in EF: "ToListAsync(ct)", "SaveChangesAsync(ct)", "FirstOrDefaultAsync(…, ct)". Search for "Async()" with empty brackets: each result is a broken link in the chain.',
  'Option 1: in the connection string, "…;Command Timeout=10". Option 2: "o.UseNpgsql(cs, npg => npg.CommandTimeout(10))". Write a table in resilience.md: | Call | Timeout | Why |, for example "read query | 10 s | the worst one measured is 300 ms; 10 s is already a failure".',
  'Temporary endpoint: "app.MapGet("/test/slow", async (VetCareDbContext db, CancellationToken ct) => { await db.Database.ExecuteSqlRawAsync("SELECT pg_sleep(30)", ct); return Results.Ok(); });". Measure with "time curl -i localhost:5080/test/slow": it must fail in about 10 s. Also try pressing Ctrl+C in curl after 2 s: the query must be cancelled in PostgreSQL.'
],

'w14d2': [
  'Criterion: retry if the failure is temporary and repeating does no harm (408, 429, 500, 502, 503, 504). Do not retry if the error is yours or final (400, 401, 403, 404, 409, 422): however many times you repeat, the answer will be the same. Example: "422 · no · the data is still invalid".',
  'Structure: a for loop of attempts; if the response is a success or a non-retryable error, return it; if not, wait "base * 2^attempt + random(0, base)" and repeat. Example with a 200 ms base: about 200, 400 and 800 ms plus a bit of randomness. The randomness (jitter) stops all clients retrying in the same millisecond.',
  'FakeHandler: an HttpMessageHandler that returns responses from a queue and counts the calls: "Responses = new Queue<HttpStatusCode>([503, 503, 200])". Assert: "result.StatusCode.Should().Be(OK); handler.Calls.Should().Be(3);". Use short waits in the test (1 ms base) so it runs fast.',
  'A queue with a repeated 400. Assert: "handler.Calls.Should().Be(1)". If you get 3, your method retries final errors: check the condition that decides whether a code is retryable.',
  '"var sc = new ServiceCollection(); sc.AddHttpClient("test").ConfigurePrimaryHttpMessageHandler(() => h).AddStandardResilienceHandler(); var client = sc.BuildServiceProvider().GetRequiredService<IHttpClientFactory>().CreateClient("test");". Repeat both asserts. If the test takes several seconds, that is normal: the library uses real waits.'
],

'w14d3': [
  '"dotnet add src/VetCare.Infrastructure package Microsoft.Extensions.Http.Resilience". Then "services.AddHttpClient<EmailClient>(…).AddResilienceHandler("email", b => { b.AddTimeout(…); b.AddRetry(…); b.AddCircuitBreaker(…); });". Pay attention to the order: it is like an onion, from the outside in.',
  '"stateDiagram-v2 / [*] --> Closed / Closed --> Open: failure % goes over the threshold / Open --> HalfOpen: BreakDuration passes / HalfOpen --> Closed: the test request goes well / HalfOpen --> Open: the test request fails". Paste it into mermaid.live to check it draws.',
  'In the API itself: "app.MapPost("/fake/always-fails", () => Results.StatusCode(503));". In the configuration, point the EmailClient’s BaseAddress at "http://localhost:5080/fake/always-fails". Ideally use a configuration value so you can change it without recompiling.',
  'An endpoint or a loop in the Playground: "for (int i = 0; i < 20; i++) { var sw = Stopwatch.StartNew(); try { await client.SendAsync(…); } catch (Exception e) { Console.WriteLine($"{i}: {e.GetType().Name} {sw.ElapsedMilliseconds} ms"); } }". You will see a change from ~1000 ms to ~1 ms with BrokenCircuitException: the circuit opened.',
  'After the wait, the next request is the test one (Half-Open): the attempt shows up in the logs. To switch to 200, use a static variable in the fake endpoint ("static bool failing = true" and another endpoint that sets it to false). After a test request that goes well, requests take the normal time again: the circuit is closed.'
],

'w14d4': [
  'New migration file, for example 010_idempotent_operation.sql, with "CREATE TABLE idempotent_operation ( key text PRIMARY KEY, response jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now() );". Apply the migration and check with "\\d idempotent_operation".',
  'Another migration with "CREATE TABLE outbox_message (…)" and also "CREATE INDEX ix_outbox_pending ON outbox_message (created_at) WHERE processed_at IS NULL;". That partial index makes finding the pending ones fast even if the table has millions of processed messages.',
  'At the start of the endpoint: if the header does not arrive → 400. Look up the key: if it exists, return the stored response with the same code. If not, create the appointment and store the key and the response in the SAME transaction. Test: two curls with the same key → same id, and a single row in the appointment table.',
  'Replace "await _email.SendAsync(…)" with "db.OutboxMessages.Add(new OutboxMessage { Type = "AppointmentConfirmation", Payload = JsonSerializer.Serialize(…) });" before SaveChangesAsync. That way the appointment and the message are saved together, or neither is.',
  '"class OutboxProcessor : BackgroundService { protected override async Task ExecuteAsync(CancellationToken ct) { while (!ct.IsCancellationRequested) { using var scope = _sp.CreateScope(); … await Task.Delay(TimeSpan.FromSeconds(5), ct); } } }". Use a new scope on each loop (the DbContext is scoped). If a message fails, increase its attempts and carry on with the rest. Register it with AddHostedService.'
],

'w14d5': [
  'Typical rows: PostgreSQL (critical · 503 error · "service unavailable, try again in a few minutes"), email (not critical · it is queued · "you will get the confirmation later"), SMS (not critical · it is skipped · nothing), weather/holidays if you use them (not critical · default value). A dependency is critical if without it the main operation makes no sense.',
  '"try { … } catch (Exception ex) { _logger.LogWarning(ex, "Failure in {Dependency}, using fallback", "email"); _fallbacks.Add(1, new KeyValuePair<string, object?>("dependency", "email")); return defaultValue; }". The counter is a Counter<long> from System.Diagnostics.Metrics. An empty catch hides problems: never leave it like that.',
  'Open the health check configuration: /health/ready must only check what is marked critical (usually the database). If it checks email, the load balancer would take the API out of service when email fails, even though appointments could still be booked.',
  '"public record AppointmentResponse(Guid Id, …, IReadOnlyList<string> Warnings);". If email failed or was queued: "Warnings = ["The email confirmation will arrive in a few minutes"]". The frontend can show it as a yellow notice, not as an error.',
  'Switch off the fake email server. With curl: the POST must give 201 with "warnings" in the JSON; "curl -i /health/ready" must give 200; the Warning must show up in the console. If one of the four things does not happen, go back to the matching step.'
],

'w14d6': [
  'For each experiment: hypothesis (written BEFORE), what exactly you did (commands), what happened (with times and codes) and whether it matches. Example: "Hypothesis: with PostgreSQL off, POST /appointments answers 503 in under 2 s. Reality: it took 15 s → the connection timeout was not configured".',
  'Fix one thing at a time and repeat the whole experiment, not only the step that failed. Note the fix next to the experiment: "Added Timeout=2 to the connection string → now 503 in 2.1 s ✓".',
  'For each checklist point, write file:line or the test name. "Timeouts on external calls → EmailClient.cs:24 (5 s AddTimeout)". If all you can say is "I think I did it", mark it as not done.',
  'In tests/VetCare.Api.Tests: two POSTs with "client.DefaultRequestHeaders.Add("Idempotency-Key", key)" and the same body. Assert: both answer with the same id, and a direct query to the database "SELECT count(*) FROM appointment WHERE …" returns 1.',
  'Fixed order: 1) what can fail (database, email, SMS, the network), 2) what VetCare does in each case (timeout, retry, circuit, queue, warning), 3) how you checked it (experiments and tests). With a concrete example in each point. Time yourself: 3 minutes is less than it seems.'
],

/* ---------- Week 15 ---------- */

'w15d1': [
  'Look in each .csproj for the "<ProjectReference Include="…" />" lines. Draw a box per project and an arrow per reference. Correct: Api → Application/Infrastructure → Domain. Any arrow that LEAVES Domain is an error you must fix today.',
  'Search the src/VetCare.Domain folder for: "using Microsoft.EntityFrameworkCore", "using Npgsql", "using Microsoft.AspNetCore", "using System.Net.Http". Also attributes like EF’s [Table] or [Column]. Note the file and line of each leak.',
  'Example: if Domain uses DbContext directly, create "IAppointmentRepository" in Domain and "EfAppointmentRepository" in Infrastructure. The EF attributes ([Key], [Table]) move to configuration in OnModelCreating, inside Infrastructure. Build after each leak you fix.',
  '"[Fact] public void Domain_DoesNotDependOnInfrastructure() { var refs = typeof(Appointment).Assembly.GetReferencedAssemblies().Select(a => a.Name); refs.Should().NotContain(n => n!.Contains("EntityFramework") || n.Contains("Npgsql") || n.Contains("AspNetCore")); }". Check it works: add an EF using in Domain → the test must go red.',
  '"graph LR; Api --> Application; Api --> Infrastructure; Infrastructure --> Domain; Application --> Domain". Example sentence: "Since the domain depends on nothing, I can test every rule without a database and swap EF Core for another technology without touching the business rules".'
],

'w15d2': [
  '"dotnet new classlib -o src/VetCare.Application", "dotnet sln add …", "dotnet add src/VetCare.Application reference src/VetCare.Domain", "dotnet add src/VetCare.Api reference src/VetCare.Application". Check: Application must not reference Infrastructure.',
  'In Application: "record ScheduleAppointmentCommand(Guid PetId, Guid VetId, DateTime Start)", "record ScheduleAppointmentResult(Guid AppointmentId)", "interface IScheduleAppointment { Task<ScheduleAppointmentResult> ExecuteAsync(ScheduleAppointmentCommand c, CancellationToken ct); }" and the class that implements it, which orchestrates: repository, ScheduleService (which stays in Domain) and saving.',
  'The endpoint ends up like this: "async (CreateAppointmentDto dto, IScheduleAppointment useCase, CancellationToken ct) => { var r = await useCase.ExecuteAsync(new(dto.PetId, …), ct); return Results.Created($"/api/v1/appointments/{r.AppointmentId}", r); }". Errors are translated in the global handler. If the endpoint has a business if, it has not been slimmed down yet.',
  '"dotnet new console -o src/VetCare.Cli", with references to Application and Infrastructure. Build the container (the same registrations as the API), resolve IScheduleAppointment and run it with data from args. If it books an appointment just like the POST, you have shown HTTP is just an adapter.',
  'Mermaid: "graph LR; Api[HTTP adapter] --> Ports; Cli[Console adapter] --> Ports; subgraph Hexagon; Ports[IScheduleAppointment] --> Domain; end; Domain --> IRepo[IAppointmentRepository]; IRepo -.implements.- Ef[EfRepository]; Domain --> INotif[INotifier]; INotif -.implements.- Smtp[SmtpNotifier]".'
],

'w15d3': [
  'Structure: Application/Commands/ScheduleAppointment.cs, Application/Queries/IDailyAgenda.cs and AgendaRowDto.cs, Infrastructure/Queries/EfDailyAgenda.cs. Rule: Application’s Queries only hold contracts (interfaces and DTOs), never EF code.',
  'Direct projection: "db.Appointments.Where(a => a.Start >= from && a.Start < to).OrderBy(a => a.Start).Select(a => new AgendaRowDto(a.Id, a.Start, a.End, a.Pet.Name, a.Pet.Owner.Name, a.Status.ToString())).ToListAsync(ct)". No Include and no loading aggregates: EF generates a SELECT with only those columns.',
  'Copy the SQL of each version from the EF log and run it in psql with EXPLAIN ANALYZE in front. Note: "with repository: 3 queries, 12 ms in total; projection: 1 query, 2 ms". If the difference is small with your data, try with the 500,000 appointments from week 10.',
  '"db.Database.SqlQueryRaw<MonthlySummaryDto>("SELECT date_trunc(\'month\', starts_at) AS month, count(*) AS appointments FROM appointment WHERE extract(year FROM starts_at) = {0} GROUP BY 1 ORDER BY 1", year)". The {0} becomes a real parameter. Never use $"… = {year}" inside SqlQueryRaw: there you would be concatenating.',
  'Two rules with their why: "Writes → domain: the invariants live here and nobody can skip them". "Reads → direct projection: they change nothing, so they do not need the rules, and only the data shown is loaded". Add the exception: reads that need a domain rule.'
],

'w15d4': [
  '"public abstract class EntityBase { private readonly List<IDomainEvent> _events = new(); public IReadOnlyList<IDomainEvent> Events => _events; protected void Raise(IDomainEvent e) => _events.Add(e); public void ClearEvents() => _events.Clear(); }". Appointment, Visit and Invoice inherit from it. Make sure the list is not mapped to any column: in EF, "e.Ignore(x => x.Events)".',
  '"public record AppointmentScheduled(Guid AppointmentId, Guid PetId, Guid VetId, DateTime Start) : IDomainEvent;". Past-tense name and minimal data: ids and the essentials, not the whole entity. In the domain method: "Raise(new AppointmentScheduled(Id, …));" at the end, once everything has gone well.',
  '"public async Task DispatchAsync(IDomainEvent e, CancellationToken ct) { var type = typeof(IHandler<>).MakeGenericType(e.GetType()); foreach (dynamic h in _sp.GetServices(type)) await h.HandleAsync((dynamic)e, ct); }". Register it with AddScoped. Each handler with "services.AddScoped<IHandler<AppointmentScheduled>, EnqueueConfirmation>()".',
  'Before SaveChangesAsync, go through the entities with events (ChangeTracker.Entries<EntityBase>()), dispatch them and clear the list. EnqueueConfirmation adds the OutboxMessage to the same DbContext, so it is saved in the same transaction. Compare the use case’s lines before and after.',
  '"var appointment = Appointment.Schedule(…); appointment.Events.Should().ContainSingle().Which.Should().BeOfType<AppointmentScheduled>().Which.PetId.Should().Be(petId);". No database and no container: the domain produces events without knowing who listens to them.'
],

'w15d5': [
  'Four modules by business capability: Scheduling (appointments, time slots), Clinic (pets, visits, vaccines), Customers (owners) and Billing. An arrow with a label: "Billing → Clinic: needs a pet’s attended visits in a month". If you cannot write a label, the arrow should not be there.',
  'Example: "public interface IClinicPublic { Task<IReadOnlyList<BillableVisit>> UnbilledVisitsAsync(Guid ownerId, CancellationToken ct); }" with "record BillableVisit(Guid VisitId, DateOnly VisitedOn, string Description, decimal Price)". Two or three methods per module, not twenty. Plain records: never return internal entities.',
  'Look in the LINQ and SQL queries for JOINs between tables of different modules (appointment with invoice, pet with invoice…). List: "DailyAgenda joins appointment (Scheduling) with owner (Customers)". You do not have to fix them today: what matters is knowing how many there are.',
  'Replace the JOIN with two steps: get the ids from your own module and then call "ICustomersPublic.NamesAsync(ids)". Measure the time before and after. If it goes from 5 ms to 500 ms, that data is used together so much that maybe it should be in the same module: note it down.',
  'The three criteria with numbers: contracts per module (healthy is few and small), times a change touched two modules at once (look at "git log --stat": commits touching folders of two modules) and whether you could extract a module to another service without rewriting it. Conclusion in 3 or 4 lines.'
],

'w15d6': [
  'Files like docs/adr/004-layers.md … 008-modules.md (follow your numbering). Template: Title · Status (accepted) · Context (what problem there was) · Decision (in one sentence) · Alternatives · Consequences + and − · Verification. Reuse what you wrote each day in architecture.md.',
  'Example for light CQRS: "Alternative 1: always read through the domain repository → rejected: it loads whole aggregates to draw a table (12 ms vs 2 ms). Alternative 2: a separate read database → rejected: synchronisation complexity with no need at the current volume".',
  'Questions to find them: what is slower or harder now? What will someone new have to learn? What code is duplicated? Example: "Hexagonal: more projects and more files; a small change touches 3 layers; someone coming from MVC will take a while to find their way".',
  'Examples: "Layers → test Domain_DoesNotDependOnInfrastructure", "Events → test Schedule_RaisesAppointmentScheduled", "Modules → monthly review of JOINs between modules with grep". Write the exact test name or command, so anyone can check it.',
  'The four parts in order, about 45 seconds each: what you decided, what you rejected and why, what it costs you, and what signal would make you change ("if a module needs another one’s data in every query, I would merge them"). That last part shows judgement in an interview. Record yourself.'
],

/* ---------- Week 16 ---------- */

'w16d1': [
  'From the VetCare root: "npm create vite@latest web -- --template react-ts", then "cd web", "npm install" and "npm run dev". Open the URL it shows (usually http://localhost:5173). If you see the Vite and React logo with the counter, you are done.',
  'Call your API with curl and copy a real JSON. Translate it: "export interface Appointment { id: string; start: string; end: string; petName: string; ownerName: string; status: AppointmentStatus; }" and "export type AppointmentStatus = "scheduled" | "confirmed" | "attended" | "cancelled";". Dates arrive as strings in JSON, not as Date.',
  '"const labels: Record<AppointmentStatus, string> = { scheduled: "Scheduled", confirmed: "Confirmed", attended: "Attended", cancelled: "Cancelled" };". Add "| "no_show"" to the type: TypeScript must mark the object in red because a key is missing. That error is the one that will save you when the backend adds a new status.',
  'AppointmentRow receives "{ appointment: Appointment; onCancel: (id: string) => void }" and AppointmentTable receives "{ appointments: Appointment[]; onCancel: (id: string) => void }" and does "appointments.map(a => <AppointmentRow key={a.id} appointment={a} onCancel={onCancel} />)". For now, onCancel can be a "console.log".',
  'Install the React Developer Tools extension (Chrome or Firefox). The Components tab shows up in DevTools: find AppointmentRow and look at the right panel. "appointment" must be there with its fields and "onCancel" as a function. If something is missing or extra, check the props interface.'
],

'w16d2': [
  'Minimal state: "const [appointments, setAppointments] = useState(initialAppointments); const [filter, setFilter] = useState<AppointmentStatus | "all">("all");". Derived in the render, with no useState: "const visible = filter === "all" ? appointments : appointments.filter(a => a.status === filter); const total = visible.length;".',
  '"setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));". map returns a new array and the spread creates a new object only for the changed appointment. In DevTools, the appointments array changes reference after each cancellation.',
  'Write exactly that, press the button and you will see nothing happens. React compares the old reference with the new one: since it is the same array, it decides there is nothing to repaint. Write the explanation in a comment and then go back to the immutable pattern.',
  '"const [selectedId, setSelectedId] = useState<string | null>(null); const selected = appointments.find(a => a.id === selectedId);". Store only the id, not a copy of the appointment: that way, if you cancel the selected appointment, the panel shows the new status with nothing else to do.',
  'The three questions: does it change over time? Does it come from props? Can it be calculated from other state or from props? If it does not change, or comes from props, or can be calculated, it is not state: delete it and calculate it. Note "removed 2 useState: total and filteredAppointments".'
],

'w16d3': [
  '"function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <input value={value} onChange={e => onChange(e.target.value)} />; }". In the parent: "const [text, setText] = useState("")" and "<SearchBox value={text} onChange={setText} />". The SearchBox has no useState of its own.',
  'DetailPanel with "const [notes, setNotes] = useState("")" inside. Type something in appointment A’s notes, select appointment B: the text is still there. React reuses the same component in the same position of the tree and keeps its state.',
  '"<DetailPanel key={selected.id} appointment={selected} />". When the key changes, React unmounts the component and mounts a new one, with empty state. Repeat the test: now the notes are cleared when you change appointment.',
  'Tree in text or in Mermaid: "SchedulePage (appointments, filter, selectedId, text) → SearchBox · AppointmentTable → AppointmentRow · DetailPanel (notes)". Next to each piece of state, the reason: "selectedId lives in SchedulePage because AppointmentTable (highlights the row) and DetailPanel (shows it) both use it".',
  'Follow each prop from where it is born to where it is used. If it goes through a component that only passes it on without using it, note it: "onCancel: Page → Table → Row (Table only passes it)". With two levels it is normal; with three or more, consider context or passing the component as children.'
],

'w16d4': [
  'The four unnecessary cases: calculating data from props or state, reacting to a user event (that goes in the handler), resetting state when a prop changes (use key) and chaining states. For each useEffect write which case it is, or "needed: synchronises with the network".',
  '"export function useDailyAppointments(day: string) { const [data, setData] = useState<Appointment[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { const controller = new AbortController(); fetch(`/api/v1/agenda?day=${day}`, { signal: controller.signal })… ; return () => controller.abort(); }, [day]); return { data, loading, error }; }".',
  'Backend: "app.MapGet("/api/v1/agenda", async (DateOnly day, IDailyAgenda q, CancellationToken ct) => Results.Ok(new { data = await q.ExecuteAsync(day, ct) }));". In vite.config.ts: "server: { proxy: { "/api": "http://localhost:5080" } }" with your port. Restart "npm run dev" after changing the configuration.',
  'In the backend, add "await Task.Delay(day.Day % 2 == 0 ? 3000 : 500, ct);" to the endpoint. Switch from day A to B and back to A quickly: with abort, you see the right data. Comment out the line "return () => controller.abort()" and repeat: you will see one day’s data under another day’s title. Remove the delay when you finish.',
  'In the Network tab you will see two requests on load: the first shows as cancelled (canceled) and the second completes. StrictMode causes that in development. If without the abort you see duplicated data or flickering, your effect was not cleaning up properly; in production there is only one request.'
],

'w16d5': [
  '"type Form = { petId: string; vetId: string; start: string; reason: string }; const [form, setForm] = useState<Form>(empty); function change<K extends keyof Form>(field: K, value: Form[K]) { setForm(f => ({ ...f, [field]: value })); }". Each input uses "onChange={e => change("reason", e.target.value)}".',
  '"const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});". On each input: "onBlur={() => setTouched(t => ({ ...t, reason: true }))}". Errors are always calculated, but only shown if "touched.reason || triedToSubmit".',
  '"const [submitting, setSubmitting] = useState(false);" and in the submit: "if (submitting) return; setSubmitting(true); try { … } finally { setSubmitting(false); }". Button: "<button disabled={submitting}>{submitting ? "Saving…" : "Book"}</button>". Double-click fast and check in Network that only one POST goes out.',
  'If "res.status === 409", read the problem+json and show your own message: "That time is already taken for Dr. Pérez. Pick another time". If it is 422, go through "errors" and put each message next to its field. The user must never see "{"type":"…"}".',
  'Stop the backend with Ctrl+C. fetch throws a TypeError ("Failed to fetch"): catch it with "catch (e) { setError("There is no connection to the server. Check your network and try again."); }". The form must keep what was typed so it can be resent when the connection comes back.'
],

'w16d6': [
  'Go through the seven points one by one against the real application (not against the fake data): change day, filter, see details, create, cancel… Mark each one with the test you did. If one only works with fake data, it is not done.',
  'The four states: loading (skeleton or text), error (message and retry button), empty and with data. Empty: "There are no appointments on Tuesday 10 June" with a "Book an appointment" button. Test each state for real: a day with no appointments, the backend switched off, a delay to see the loading.',
  'For each point, open the file and find the line that meets it. If something fails (for example, duplicated state), fix it right then. Write in frontend.md what you corrected: it is worth more than a list full of ✓.',
  '"npx tsc -b" must finish with no output at all. Search for any: "grep -rn "any" web/src --include=*.ts --include=*.tsx" and review the results (some will be words inside texts). Replace each any with the real type or, if you really do not know it, with unknown and a check.',
  'Go through the screen using only the keyboard: Tab reaches every button in a logical order, focus is visible, Enter and Space work and Escape closes whatever is open. Note every problem found and how you solved it (or that it is pending, with the reason).'
]

});
