window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 13,
  phase: 'Quality and testing',
  title: 'Tests that let you sleep at night',
  idea: 'A test is not there to prove the code works today: it is there so you can change it tomorrow without fear. This week you write real tests for VetCare and discover that the well designed code from weeks 7 and 8 is easy to test, and the badly designed code is not.',
  res: [
    { t: 'Microsoft Learn — Unit testing with xUnit',
      u: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test',
      note: 'The official xUnit tutorial with dotnet test. Day 1 comes from here.' },
    { t: 'Microsoft Learn — Unit testing best practices',
      u: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices',
      note: 'Names, structure, what to test and what not. Read it twice this week.' },
    { t: 'Martin Fowler — Test Double',
      u: 'https://martinfowler.com/bliki/TestDouble.html',
      note: 'The correct definitions of stub, mock, fake and spy. Essential for day 3.' },
    { t: 'Microsoft Learn — Integration tests in ASP.NET Core',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests',
      note: 'WebApplicationFactory and testing the whole API. Day 5.' },
    { t: 'Martin Fowler — Test Driven Development', u: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html', note: 'The red-green-refactor cycle explained in one page.' },
    { t: 'Microsoft Learn — Unit testing C# with xUnit', u: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit', note: 'The official tutorial: create the solution, the test project and the first xUnit tests.' }
  ],
  days: [
    {
      t: 'Your first test worth something',
      obj: 'Set up the test project and write tests with a good structure and name.',
      why: 'Knowing how to write tests is an entry requirement in any team. And the test’s name is the first thing a reviewer reads: it says whether you understood the requirement or only the method.',
      study: { r: 5, what: 'Follow the whole tutorial, creating the project. About 25 minutes doing it, not just reading it. Look for one thing: the difference between Fact and Theory.',
        pasos: [
          'Do "Create the solution" with the "Commands to create the solution" (~8 min), typing the commands yourself.',
          'Do "Create a test" (~6 min): first see the test fail, then make it pass.',
          'Do "Add more tests" (~6 min): notice how a Theory with InlineData replaces several almost identical Facts.',
          'Run dotnet test and read the whole output, including the final summary.',
          'Write in one line: a Fact is a fixed case; a Theory is the same test with several data sets.'
        ] },
      ex: { title: 'Arrange, Act, Assert', body: `dotnet new xunit -o tests/VetCare.Domain.Tests
dotnet sln add tests/VetCare.Domain.Tests
dotnet add tests/VetCare.Domain.Tests reference src/VetCare.Domain
dotnet add tests/VetCare.Domain.Tests package FluentAssertions

(Mind the licence: FluentAssertions 8 or later is free only
for non-commercial use. It is fine for your portfolio; at a
company use AwesomeAssertions, a free fork with the same
syntax.)

THE TEST NAME: what, when, then

BAD
  TestAppointment()
  Test1()
  ScheduleTest()

GOOD
  Schedule_WhenTheDateIsInThePast_ThrowsBusinessRuleException
  Schedule_WhenTheSlotIsFree_LeavesTheAppointmentScheduled
  CalculateTotal_WithNoLines_ReturnsZero

The name should read like the requirement.
If you cannot name it, you did not understand what you are
testing.

AAA STRUCTURE
(It assumes your Appointment.Schedule already receives "now",
as in week 12, and throws BusinessRuleException if the date is
in the past or the duration is not between 10 and 180 minutes.)

[Fact]
public void Schedule_WhenTheDateIsInThePast_ThrowsBusinessRuleException()
{
    // Arrange: set up the scenario
    var now  = new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc);
    var past = now.AddHours(-2);

    // Act: run the action
    var action = () => Appointment.Schedule(
        petId: Guid.NewGuid(), vetId: Guid.NewGuid(),
        start: past, dur: TimeSpan.FromMinutes(30), now: now);

    // Assert: check the result
    action.Should()
          .Throw<BusinessRuleException>()
          .WithMessage("*date*future*");
}

THEORY: the same test with several data sets

[Theory]
[InlineData(0)]
[InlineData(5)]
[InlineData(181)]
[InlineData(-30)]
public void Schedule_WithInvalidDuration_Throws(int minutes)
{
    var now = new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc);

    var action = () => Appointment.Schedule(Guid.NewGuid(), Guid.NewGuid(),
        now.AddHours(2), TimeSpan.FromMinutes(minutes), now);

    action.Should().Throw<BusinessRuleException>();
}

ONE CONCEPT PER TEST

BAD (if it fails, you do not know which of the three failed)
[Fact]
public void TestSchedule()
{
    var a = Appointment.Schedule(...);
    a.Status.Should().Be(AppointmentStatus.Scheduled);
    a.End.Should().Be(a.Start.AddMinutes(30));
    a.Id.Should().NotBe(Guid.Empty);
}

Split it into three tests with three names.
If one fails, the name already tells you what broke.` },
      steps: [
        'Create the tests/VetCare.Domain.Tests project with xUnit and FluentAssertions, and add it to the solution.',
        'Write ten tests on the rules of the Appointment class: future date, valid duration, initial status, end calculation.',
        'Use a Theory with InlineData for all the cases of the same concept instead of copying the test.',
        'Name each test with the Method_When_Then pattern and read them out loud: they should sound like requirements.',
        'Run dotnet test and check that they all pass. Then break the code on purpose and check that some test turns red.'
      ],
      vet: [
        'VetCare rules to cover: the appointment must be in the future, duration between 10 and 180, an attended appointment cannot be cancelled, an invoice’s total is the sum of its lines.',
        'If a rule is not in docs/requirements.md, add it there before testing it.'
      ],
      edge: [
        'A test that has never failed may be testing nothing. Check that it turns red by breaking the code.',
        'Do not put logic in the test: no ifs, loops or calculations. The expected value is written by hand.',
        'Avoid Assert.True(something): when it fails it only says "expected True". Use assertions that say which value they received.'
      ],
      quiz: [
        { q: 'What is the difference between Fact and Theory?', a: 'A Fact is a test with no parameters that checks one concrete case. A Theory receives data and runs the same body once per data set, which is right when the concept is the same and only the values change.' },
        { q: 'Why does the test name matter so much?', a: 'Because when it fails in the pipeline, the name is the only thing you see. If it says which method, in which situation and what was expected, you diagnose without opening the code.' },
        { q: 'Why must there be no ifs or loops inside a test?', a: 'Because the test becomes code that can also have bugs, and nobody tests the tests. The expected values must be written literally so they are obvious.' },
        { q: 'How do you check that a test really tests something?', a: 'By deliberately breaking the code it should verify and confirming that the test turns red. A test that passes whatever happens is noise with a false sense of safety.' }
      ],
      out: 'A test project with ten green tests on the rules of Appointment.',
      file: 'tests/VetCare.Domain.Tests/AppointmentTests.cs'
    },
    {
      t: 'What to test and what not',
      obj: 'Decide where to invest testing effort with economic judgement.',
      why: 'Testing everything is impossible and testing too little is dangerous. Knowing how to choose is what turns tests into an advantage instead of a maintenance burden.',
      study: { r: 1, what: 'Read the whole best practices article. About 20 minutes. Look for one thing: why implementation details should not be tested.',
        pasos: [
          'Read "Benefits of unit testing" (~3 min).',
          'Read "Characteristics of good unit tests" (~3 min) and copy the list: fast, isolated, repeatable, self-checking and timely.',
          'Read "Code coverage and code quality" (~2 min): why 100% coverage is not a goal.',
          'Read "Unit testing terminology" (~2 min): fake, mock and stub according to Microsoft.',
          'Under "Best practices" read "Avoid infrastructure dependencies", "Follow test naming standards" and "Validate private methods with public methods" (~6 min). The last one answers today’s question.'
        ] },
      ex: { title: 'The pyramid and the limits', body: `THE TEST PYRAMID

        /\\
       /  \\      E2E / UI      few, slow, fragile
      /----\\
     /      \\    Integration   some, medium
    /--------\\
   /          \\  Unit          many, fast, stable
  /------------\\

A healthy proportion: many unit tests, plenty of
integration tests on the critical paths, few E2E tests,
only for the flows that must not fail.

WHAT TO TEST

- Business rules and calculations
- Edge cases and validation
- Bugs that already happened (regression tests)
- Public contracts: the API, the domain
- Behaviour on errors

WHAT NOT TO TEST

- Trivial getters and setters
- Framework code (EF Core, ASP.NET)
- DTOs with no logic
- Configuration and wiring
- Private implementation details

TEST BEHAVIOUR, NOT IMPLEMENTATION

BAD: coupled to how it is done
[Fact]
public void Schedule_CallsValidateDate()
{
    _validator.Verify(v => v.ValidateDate(It.IsAny<DateTime>()), Times.Once);
}

If you refactor and rename ValidateDate, the test breaks
even though the behaviour is identical.
The test becomes a brake on refactoring.

GOOD: coupled to the requirement
[Fact]
public void Schedule_WithPastDate_DoesNotCreateTheAppointment()
{
    var action = () => _scheduler.Schedule(appointmentInThePast);
    action.Should().Throw<BusinessRuleException>();
    _repo.Saved.Should().BeEmpty();
}

This test survives any internal refactor.

COVERAGE: a guide, not a goal

80 per cent coverage with tests that check nothing is worse
than 50 per cent with good tests.

Use coverage the other way round: look at which lines are
NOT covered and ask whether any of them is an important rule.

dotnet test --collect:"XPlat Code Coverage"

That leaves a coverage.cobertura.xml file. To see it as a
web page:

dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" \\
                -targetdir:coverage

and open coverage/index.html in the browser.` },
      steps: [
        'List VetCare’s business rules in docs/testing.md and mark which ones are covered by a test.',
        'Review your current tests: does any of them check that a method was called instead of that a result happened? Rewrite it.',
        'Generate the coverage report and look at the uncovered lines of the Domain project.',
        'For each important uncovered line, decide: I write the test, or I accept the risk and write it down.',
        'Delete any test that can never fail or that only checks a getter.'
      ],
      vet: [
        'Define VetCare’s policy in docs/testing.md: what is always tested, what never is and what the domain’s coverage target is.',
        'VetCare’s domain should be close to 100 per cent; the infrastructure should not.'
      ],
      edge: [
        'A test that breaks on every refactor without the behaviour changing is a bad test: it is coupled to the implementation.',
        'Coverage measures lines executed, not behaviour verified. A test with no assertions gives coverage.',
        'Testing generated or framework code only adds maintenance: trust that Microsoft already tested it.'
      ],
      quiz: [
        { q: 'Why does the pyramid have more unit tests than E2E tests?', a: 'Because unit tests are fast, stable and point exactly to where the failure is, while E2E tests are slow, break for unrelated reasons and only say that something in the flow failed.' },
        { q: 'What does testing behaviour rather than implementation mean?', a: 'It means checking the result observable from outside, not that some internal method was called. That way the test stays valid after a refactor and does not become an obstacle.' },
        { q: 'Why is coverage not a good goal in itself?', a: 'Because it measures lines executed, not behaviour verified. You can reach 90 per cent with tests that have no assertions, which gives a false sense of safety.' },
        { q: 'Which test is always worth writing?', a: 'The one for a bug that already happened. Reproduce the failure, confirm the test is red, fix the code and the test stays as a guarantee that the bug does not come back.' }
      ],
      out: 'docs/testing.md with the testing policy and the map of covered rules.',
      file: 'docs/testing.md'
    },
    {
      t: 'Test doubles: stub, fake, mock and spy',
      obj: 'Isolate the unit under test with the right kind of double.',
      why: 'Almost everyone calls everything a mock. Knowing the four categories and using the right one makes your tests clearer, and it is an answer that impresses in an interview.',
      study: { r: 2, what: 'Read Fowler’s whole article, it is short. About 12 minutes. Look for one thing: the difference between state verification and behaviour verification.',
        pasos: [
          'Read Fowler’s whole article (~5 min).',
          'Copy the list of the five kinds: Dummy, Fake, Stubs, Spies and Mocks, with one sentence each.',
          'Notice that only mocks are created with expectations about the calls they will receive: that is verifying behaviour. The others are used to verify the final state.',
          'For each dependency of AppointmentScheduler write which double you would use and why.'
        ] },
      ex: { title: 'The four doubles', body: `DUMMY: passed in but never used
// if a constructor asks for an ILogger and this test does
// not look at the logs, you pass one that throws it all away:
var logger = NullLogger<AppointmentScheduler>.Instance;

STUB: returns fixed answers
public class FixedClock : ISystemClock
{
    private readonly DateTime _now;
    public FixedClock(DateTime now) => _now = now;
    public DateTime Now() => _now;
}

FAKE: a real but simplified implementation
public class InMemoryAppointmentRepository : IAppointmentRepository
{
    public List<Appointment> Saved { get; } = new();

    public Task AddAsync(Appointment a) { Saved.Add(a); return Task.CompletedTask; }

    public Task<bool> OverlapExistsAsync(Guid vetId, DateTime start, DateTime end)
        => Task.FromResult(Saved.Any(a =>
               a.VetId == vetId && a.Start < end && start < a.End));

    // ...the rest of IAppointmentRepository's methods, as in week 8
}

SPY: records what was done to it
public class SpyNotifier : INotifier
{
    public List<(string To, string Message)> Sent { get; } = new();

    public Task SendAsync(string to, string message)
    {
        Sent.Add((to, message));
        return Task.CompletedTask;
    }
}

MOCK: expects specific calls and fails if they do not happen
var mock = new Mock<INotifier>();
mock.Setup(n => n.SendAsync("ana@example.com", It.IsAny<string>()))
    .Returns(Task.CompletedTask);
// ... run ...
mock.Verify(n => n.SendAsync("ana@example.com", It.IsAny<string>()), Times.Once);

A FULL TEST WITH HAND-WRITTEN FAKES

[Fact]
public async Task Schedule_WhenTheSlotIsTaken_DoesNotNotify()
{
    // Arrange
    var now  = new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc);
    var vet  = Guid.NewGuid();
    var repo = new InMemoryAppointmentRepository();
    var spy  = new SpyNotifier();
    var sut  = new AppointmentScheduler(repo, spy, new FixedClock(now));

    await sut.ScheduleAsync(
        new AppointmentRequest(Guid.NewGuid(), vet, now.AddHours(2), 30));

    // Act
    var action = () => sut.ScheduleAsync(
        new AppointmentRequest(Guid.NewGuid(), vet, now.AddHours(2).AddMinutes(15), 30));

    // Assert
    await action.Should().ThrowAsync<TimeSlotTakenException>();
    repo.Saved.Should().HaveCount(1);
    spy.Sent.Should().HaveCount(1);   // it only notified the first one
}

STATE VERIFICATION vs BEHAVIOUR VERIFICATION

State: I check the final result (repo.Saved has 1).
       More robust, survives refactors.

Behaviour: I check that something was called.
       Needed when the effect is external and invisible,
       such as sending an email. Use it only then.` },
      steps: [
        'Write the four doubles for VetCare by hand: FixedClock, InMemoryAppointmentRepository, SpyNotifier and a dummy.',
        'Write five AppointmentScheduler tests using those doubles, with no mocking library.',
        'Add the Moq package and rewrite one of them with mocks. Compare which one reads better.',
        'Identify which of your tests verify state and which verify behaviour, and justify each case.',
        'Check that all your domain tests run in under one second in total.'
      ],
      vet: [
        'Reuse the InMemoryAppointmentRepository you wrote in week 8. You already had it ready.',
        'Put all the doubles in tests/VetCare.Domain.Tests/Doubles/ to reuse them.'
      ],
      edge: [
        'If you need five mocks for a single test, the class has too many dependencies: the problem is the design.',
        'A mock that verifies every internal call turns the test into a copy of the code and blocks refactoring.',
        'A fake with its own logic can have bugs. Keep it as simple as possible or you will end up debugging the test.'
      ],
      quiz: [
        { q: 'What is the difference between a stub and a mock?', a: 'A stub only returns predefined answers so the test can move on. A mock also has expectations about which calls it must receive and fails the test if they are not met.' },
        { q: 'What is a fake and when is it the best option?', a: 'It is a real but simplified implementation, like an in-memory repository. It is ideal when you need realistic behaviour across several operations without starting the real dependency.' },
        { q: 'When is verifying behaviour instead of state justified?', a: 'When the effect is external and invisible from the system, such as sending an email or publishing an event. If you can check the result by observing the state, that way is preferable because it is more robust.' },
        { q: 'What does a test that needs five mocks tell you?', a: 'That the class under test has too many dependencies and probably breaks single responsibility. The problem is not the test but the design that forces it to be that way.' }
      ],
      out: 'A folder of reusable doubles and five AppointmentScheduler tests running in under a second.',
      file: 'tests/VetCare.Domain.Tests/Doubles/'
    },
    {
      t: 'TDD: let the test guide the design',
      obj: 'Write new code starting from the test, in short cycles.',
      why: 'TDD is not only a testing technique, it is a design technique: it forces you to think about how your code is used before writing it. Having practised it shows in the result.',
      study: { r: 4, what: 'Read Fowler’s whole article, it is short. About 10 minutes. Keep the red-green-refactor cycle and the most common mistake: skipping the refactor. Look for one thing: why it is important to see the test fail first.',
        pasos: [
          'Read Fowler’s whole article (~5 min).',
          'Copy the three steps of the cycle: write a failing test, make it pass with the minimum code, refactor.',
          'Notice the warning about skipping the refactor: it is the most common mistake.',
          'Before coding, write the list of tests you will need for today’s rule, from the simplest case to the most complex.'
        ] },
      ex: { title: 'A complete TDD cycle', body: `REQUIREMENT: calculate an invoice's total with a discount
for frequent clients (5 or more visits, 10 per cent).

STEP 1 - RED: the simplest test that fails

[Fact]
public void Total_WithNoLines_IsZero()
{
    var i = new Invoice(ownerId: Guid.NewGuid());
    i.Total().Should().Be(0m);
}

It does not compile: the Invoice class does not exist.
That is red.

STEP 2 - GREEN: the minimum to pass

public class Invoice
{
    public Invoice(Guid ownerId) { }
    public decimal Total() => 0m;
}

Yes, returning a fixed zero is "cheating".
It is deliberate: the next test will force you to improve it.

STEP 3 - RED again

[Fact]
public void Total_WithTwoLines_IsTheSum()
{
    var i = new Invoice(Guid.NewGuid());
    i.AddLine("Consultation", 35m);
    i.AddLine("Vaccine",      18.50m);

    i.Total().Should().Be(53.50m);
}

STEP 4 - GREEN

public class Invoice
{
    private readonly List<InvoiceLine> _lines = new();
    public Invoice(Guid ownerId) => OwnerId = ownerId;
    public Guid OwnerId { get; }

    public void AddLine(string description, decimal amount)
        => _lines.Add(new InvoiceLine(description, amount));

    public decimal Total() => _lines.Sum(l => l.Amount);
}

STEP 5 - RED: the real rule

[Theory]
[InlineData(4, 53.50)]
[InlineData(5, 48.15)]
[InlineData(9, 48.15)]
public void Total_AppliesDiscountFromFiveVisits(int visits, decimal expected)
{
    var i = new Invoice(Guid.NewGuid());
    i.AddLine("Consultation", 35m);
    i.AddLine("Vaccine",      18.50m);

    i.Total(ownerVisits: visits).Should().Be(expected);
}

STEP 6 - GREEN, and STEP 7 - REFACTOR

Now that the tests are green, you can move the discount
into IDiscountPolicy (week 8) with complete safety: if you
break something, the tests tell you in two seconds.

THE CYCLE
red      -> write the test, watch it fail
green    -> the minimum code that makes it pass
refactor -> clean up, with the safety net in place

Rule: never write production code without a red test that
asks for it.` },
      steps: [
        'Pick a VetCare feature that does not exist yet: working out the next vaccine according to species and age.',
        'Write the first test and check that it does not compile or fails. Do not write any production code before.',
        'Do the full cycle at least six times, in small steps. Note how many minutes each cycle takes.',
        'In the third or fourth cycle, do a real refactor relying on the green tests.',
        'Compare the result with how you would have written it without TDD: how many dependencies it has, how easy it was to test.'
      ],
      vet: [
        'Feature to build with TDD: VaccinationSchedule, which given a species and a birth date returns the pending vaccines.',
        'Document your experience in docs/testing.md: what was hard, what helped.'
      ],
      edge: [
        'If a cycle lasts more than ten minutes, the step was too big. Split the test into something smaller.',
        'TDD does not help equally with everything: to explore a new library or fine-tune a graphical interface it gets in the way.',
        'Writing the test afterwards and claiming you did TDD is easy to spot: the code usually has dependencies that are hard to replace.'
      ],
      quiz: [
        { q: 'Why is it important to see the test fail before writing the code?', a: 'Because it confirms the test really checks what you think. If it is green from the start, it may be badly written or testing something that already happened, and it will never warn you of a regression.' },
        { q: 'Why is "cheating" with a fixed value allowed in the green step?', a: 'Because the goal of the green step is to close the cycle quickly, not to write the final solution. The next red test is what forces you to generalise, and so every production line is born justified by a test.' },
        { q: 'In what sense is TDD a design technique?', a: 'Because it forces you to write first how the code is used from outside. If it turns out to be awkward to call or needs too many dependencies, you find out before implementing it.' },
        { q: 'When is TDD not the best tool?', a: 'When you are exploring an unknown API, making a throwaway prototype or adjusting visual details, because you do not yet know what the correct behaviour you should assert is.' }
      ],
      out: 'VaccinationSchedule built entirely with TDD and the process documented.',
      file: 'src/VetCare.Domain/Clinic/VaccinationSchedule.cs'
    },
    {
      t: 'Integration tests for the API',
      obj: 'Test the whole API end to end with a real database.',
      why: 'Unit tests do not catch a badly done EF mapping or middleware in the wrong order. Integration tests do, and they are the ones that really give you confidence to deploy.',
      study: { r: 3, what: 'Read the integration tests article, especially WebApplicationFactory and customising services. About 22 minutes. Look for one thing: how the real DbContext is replaced with a test one.',
        pasos: [
          'Read "Introduction to integration tests" and "ASP.NET Core integration tests" (~4 min).',
          'Read "Basic tests with the default WebApplicationFactory" (~5 min): the API starts in memory and you call it with an HttpClient.',
          'Read "Customize WebApplicationFactory" (~6 min): this is how you swap the real DbContext for a test one in ConfigureWebHost.',
          'Read "Inject mock services" and "Disposal of objects" (~4 min).',
          'Write in one line why this test checks more things than a unit test and why it is slower.'
        ] },
      ex: { title: 'WebApplicationFactory with real Postgres', body: `dotnet new xunit -o tests/VetCare.Api.Tests
dotnet sln add tests/VetCare.Api.Tests
dotnet add tests/VetCare.Api.Tests reference src/VetCare.Api
dotnet add tests/VetCare.Api.Tests package Microsoft.AspNetCore.Mvc.Testing
dotnet add tests/VetCare.Api.Tests package Testcontainers.PostgreSql
dotnet add tests/VetCare.Api.Tests package FluentAssertions

A FACTORY WITH A THROWAWAY DATABASE IN DOCKER

public class VetCareFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    // fixed ids created by test-data.sql
    public static readonly Guid Rocky = Guid.Parse("0b8f1e2c-6a3d-4f7e-9c21-5d4b3a2f1e0d");
    public static readonly Guid Whiskers = Guid.Parse("1c9a2f3d-7b4e-4a8f-8d32-6e5c4b3a2f1e");
    public static readonly Guid Ana = Guid.Parse("8d2e6b1a-3c4f-4a5b-8e7d-2f1a0c9b8e7d");

    private readonly PostgreSqlContainer _db =
        new PostgreSqlBuilder("postgres:17-alpine").Build();

    public async Task InitializeAsync()
    {
        await _db.StartAsync();

        // applies your migrations (week 10) and the test data
        var root = Path.Combine(AppContext.BaseDirectory, "../../../../..");
        var files = Directory
            .GetFiles(Path.Combine(root, "database/migrations"), "*.sql")
            .Order()
            .Append(Path.Combine(root, "tests/VetCare.Api.Tests/test-data.sql"));

        await using var con = new NpgsqlConnection(_db.GetConnectionString());
        await con.OpenAsync();
        // the control table your script created in week 10
        await new NpgsqlCommand("""
            CREATE TABLE IF NOT EXISTS schema_migration (
              version TEXT PRIMARY KEY,
              applied_at TIMESTAMPTZ NOT NULL DEFAULT now())
            """, con).ExecuteNonQueryAsync();
        foreach (var file in files)
            await new NpgsqlCommand(File.ReadAllText(file), con)
                .ExecuteNonQueryAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        // the API reads "ConnectionStrings:VetCare": we give it the
        // container's. That way the DbContext and the health check
        // change together, without touching the services by hand.
        builder.UseSetting("ConnectionStrings:VetCare", _db.GetConnectionString());
    }

    public new async Task DisposeAsync() => await _db.DisposeAsync();
}

test-data.sql inserts an owner, two pets (Rocky and
Whiskers) and a vet (Ana) with those same ids.

TESTING THE FULL FLOW

public class AppointmentApiTests : IClassFixture<VetCareFactory>
{
    private readonly HttpClient _http;

    public AppointmentApiTests(VetCareFactory factory)
        => _http = factory.CreateClient();

    [Fact]
    public async Task PostAppointment_WithValidData_Returns201AndLocation()
    {
        var body = new
        {
            petId = VetCareFactory.Rocky,
            vetId = VetCareFactory.Ana,
            start = "2026-06-10T10:00:00Z",
            durationMinutes = 30
        };

        var res = await _http.PostAsJsonAsync("/api/v1/appointments", body);

        res.StatusCode.Should().Be(HttpStatusCode.Created);
        res.Headers.Location.Should().NotBeNull();

        var created = await res.Content.ReadFromJsonAsync<AppointmentResponse>();
        created!.Status.Should().Be("scheduled");
    }

    [Fact]
    public async Task PostAppointment_ThatOverlaps_Returns409WithProblemDetails()
    {
        await _http.PostAsJsonAsync("/api/v1/appointments", new
        {
            petId = VetCareFactory.Rocky,
            vetId = VetCareFactory.Ana,
            start = "2026-06-11T10:00:00Z",
            durationMinutes = 30
        });

        var res = await _http.PostAsJsonAsync("/api/v1/appointments", new
        {
            petId = VetCareFactory.Whiskers,
            vetId = VetCareFactory.Ana,
            start = "2026-06-11T10:15:00Z",
            durationMinutes = 30
        });

        res.StatusCode.Should().Be(HttpStatusCode.Conflict);
        res.Content.Headers.ContentType!.MediaType
           .Should().Be("application/problem+json");
    }

    [Fact]
    public async Task PostAppointment_WithNoDuration_Returns422()
    {
        var res = await _http.PostAsJsonAsync("/api/v1/appointments", new
        {
            petId = VetCareFactory.Rocky,
            vetId = VetCareFactory.Ana,
            start = "2026-06-12T10:00:00Z",
            durationMinutes = 0
        });

        res.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }
}

ISOLATION BETWEEN TESTS

If two tests share a database, the order can break them.
Options: one transaction per test with rollback, truncate
the tables before each test, or unique data per test
(different dates, as above).` },
      steps: [
        'Create the tests/VetCare.Api.Tests project with Mvc.Testing and Testcontainers.',
        'Make Program.cs accessible from the tests by adding "public partial class Program { }" at the end. (In .NET 10 it is no longer needed, but it does no harm.)',
        'Write the factory that starts PostgreSQL in Docker, applies your migrations and loads tests/VetCare.Api.Tests/test-data.sql at startup.',
        'Write at least six integration tests: successful creation, 409 conflict, 422 validation, 404 not found, paginated list and health.',
        'Solve the isolation between tests and check that they pass the same when run in any order.'
      ],
      vet: [
        'The integration tests must cover the same status codes you promised in docs/api-contract.md.',
        'If an integration test discovers that the API does not meet the contract, the contract wins: fix the code.'
      ],
      edge: [
        'Testcontainers needs Docker running. If it is not available, the tests will fail because of the environment, not the code.',
        'Integration tests are slow: do not write one for every validation case, that is the unit tests’ job.',
        'If a test only passes when run on its own, there is shared state. Fix it or you will have flaky failures forever.'
      ],
      quiz: [
        { q: 'What do integration tests catch that unit tests do not?', a: 'Mistakes in the real wiring: wrong EF mappings, middleware order, JSON serialisation, badly written routes, database constraints and configuration. Everything that happens between pieces and not inside one.' },
        { q: 'What is WebApplicationFactory for?', a: 'It starts the complete application in memory with its real pipeline and gives you an HttpClient that talks to it, letting you test the API for real without opening a port or deploying anything.' },
        { q: 'Why use real PostgreSQL instead of EF’s in-memory database?', a: 'Because the in-memory database does not respect constraints, types or real SQL, so a test can pass there and fail in production. With a throwaway container you test against the same engine you will use.' },
        { q: 'Why is isolation between integration tests critical?', a: 'Because they share a database and the data one leaves behind can make another pass or fail depending on the order of execution, producing flaky failures that destroy confidence in the suite.' }
      ],
      out: 'Six green integration tests against a throwaway PostgreSQL, in any order.',
      file: 'tests/VetCare.Api.Tests/AppointmentApiTests.cs'
    },
    {
      t: 'A complete suite and confidence (weekly exam)',
      obj: 'Leave a fast, reliable and useful suite, and be able to defend every decision.',
      why: 'A slow or flaky suite ends up ignored by the team. Leaving it healthy is what makes tests really useful for years.',
      study: { r: 1, what: 'Reread the whole best practices article with your tests in front of you and fix what you do not meet. About 20 minutes. Look for one thing: the list of characteristics of a good unit test.',
        pasos: [
          'Reread "Characteristics of good unit tests" and apply it to your tests one by one.',
          'Reread "Follow test naming standards" and rename the tests that do not comply.',
          'Reread "Avoid multiple Act tasks" and "Avoid coding logic in unit tests": look for tests that do two things or have ifs or loops.',
          'Reread "Use helper methods instead of Setup and Teardown" and simplify the shared setup.',
          'Run the whole suite and note how long it takes: it should be something you can run on every change without thinking.'
        ] },
      ex: { title: 'Checklist for a healthy suite', body: `CHARACTERISTICS OF A GOOD TEST

Fast           milliseconds. If it is slow, nobody runs it.
Isolated       does not depend on other tests or on the order.
Repeatable     the same result always, on any machine.
Self-checking  passes or fails, with nobody interpreting anything.
Timely         written with the code, not six months later.

FLAKY TESTS: the worst enemy

Typical causes and their fix:

DateTime.Now inside the code
  -> inject ISystemClock and use FixedClock

Dependence on the order of execution
  -> clean the state before each test

Thread.Sleep waiting for something asynchronous
  -> wait for the condition, not a fixed time

The order of a collection with no ORDER BY
  -> sort explicitly or compare ignoring order

A fixed shared port or file
  -> use unique resources per test

A flaky test is worse than none:
it teaches the team to ignore red.

ORGANISING THE SOLUTION

tests/
  VetCare.Domain.Tests/      unit, milliseconds
  VetCare.Api.Tests/         integration, seconds

Separating them lets you run only the fast ones while you
code, and all of them in the pipeline.

dotnet test tests/VetCare.Domain.Tests   # fast, continuous
dotnet test                              # everything, before pushing

THE WEEK'S FINAL CHECKLIST

[ ] Every test passes in any order
[ ] The whole unit suite takes under 2 seconds
[ ] No test uses DateTime.Now or Thread.Sleep
[ ] No test has an if, a for or calculations
[ ] Every name says what, when and then
[ ] Every rule in docs/requirements.md has a test
[ ] There is an integration test per promised status code
[ ] I broke the code on purpose and the suite caught it
[ ] No test is left commented out or with Skip

THE MANUAL MUTATION TEST

Change a > into a >= in a rule.
Change a + into a -.
Invert a condition.
If the suite stays green, you have a hole.` },
      steps: [
        'Run the whole suite ten times in a row and confirm there are no flaky failures.',
        'Measure how long the unit tests take. If they go over two seconds, find which one is touching disk or network.',
        'Make three manual mutations in the domain and check that the suite catches all three. If one gets through, write the missing test.',
        'Go through the full checklist and fix everything you do not meet.',
        'Defend out loud for five minutes: what you tested, what not, why, and how you know your suite works.'
      ],
      vet: [
        'Leave docs/testing.md with the policy, the map of rule coverage and the result of the mutations.',
        'Write in the README how to run only the fast tests and how to run all of them.',
        'Press "Mark for review" and reread docs/testing.md in a week.'
      ],
      edge: [
        'A test marked Skip is invisible debt: either fix it or delete it with a comment explaining why.',
        'If the team starts saying "that test always fails, ignore it", the suite is already dead. Fix it the same day.',
        'Watch out for tests that depend on the machine’s time zone: always create dates in explicit UTC (DateTimeKind.Utc), never with DateTime.Now.'
      ],
      quiz: [
        { q: 'Why is a flaky test worse than having no test?', a: 'Because it teaches the team to ignore red. When a real failure appears, nobody will investigate it because they will assume it is the usual test.' },
        { q: 'What are the most common causes of flakiness?', a: 'Depending on the real clock, on the order of execution, on waiting with Thread.Sleep, on the unguaranteed order of a query with no ORDER BY, or on shared resources such as fixed ports and files.' },
        { q: 'What is manual mutation and what is it for?', a: 'It means deliberately changing an operator or a condition in the code and checking that some test turns red. If the suite stays green, that logic is not really covered even if coverage says it is.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That tests are not a later chore but a tool for design and confidence: unit tests check rules in milliseconds, integration tests check that the pieces really fit, and their value depends on being fast, isolated and able to fail when something breaks.' }
      ],
      out: 'A complete, stable, fast suite validated with manual mutations.',
      file: 'docs/testing.md'
    }
  ]
}
]);
