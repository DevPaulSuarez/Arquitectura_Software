window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 8,
  phase: 'Design and SOLID',
  title: 'Patterns and dependency injection',
  idea: 'Patterns are not recipes to memorise: they are names for solutions you have already discovered on your own. This week you put a name to what you did in week 7 and learn the mechanism every modern .NET app uses to assemble objects: the dependency container.',
  res: [
    { t: 'Microsoft Learn — Dependency injection in .NET',
      u: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection',
      note: 'The official guide to the container you will use every day in ASP.NET Core. It includes the three lifetimes.' },
    { t: 'Refactoring Guru — Design patterns catalog',
      u: 'https://refactoring.guru/design-patterns/catalog',
      note: 'A catalogue with diagrams and code. Use it as a dictionary; do not read it all.' },
    { t: 'Martin Fowler — Inversion of Control Containers',
      u: 'https://martinfowler.com/articles/injection.html',
      note: 'The article that popularised the term. Useful for understanding why the container exists, not only how to use it.' },
    { t: 'Refactoring Guru — Strategy', u: 'https://refactoring.guru/design-patterns/strategy', note: 'Problem, solution and applicability of the Strategy pattern.' },
    { t: 'Refactoring Guru — Factory Method', u: 'https://refactoring.guru/design-patterns/factory-method', note: 'Delegating the decision of which class to create.' },
    { t: 'Refactoring Guru — Adapter', u: 'https://refactoring.guru/design-patterns/adapter', note: 'Making someone else’s interface fit yours.' },
    { t: 'Martin Fowler — Repository', u: 'https://martinfowler.com/eaaCatalog/repository.html', note: 'The original definition of the Repository pattern.' },
    { t: 'Microsoft Learn — Service lifetimes', u: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes', note: 'Transient, scoped and singleton: how long each service lives.' }
  ],
  days: [
    {
      t: 'Dependency injection by hand',
      obj: 'Understand that DI is just passing collaborators through the constructor, with no magic.',
      why: 'Many people think DI is the container. If you understand it works without a framework, you will be able to test, debug and explain the pattern in any language.',
      study: { r: 2, what: 'Read up to the "Forms of Dependency Injection" section. About 15 minutes. Look for one thing: the difference between inversion of control and dependency injection.',
        pasos: [
          'Read "Components and Services" (~3 min).',
          'Read "A Naive Example" (~4 min): the MovieLister that creates its own finder. That is the problem.',
          'Read "Inversion of Control" (~3 min): why Fowler proposes calling it dependency injection.',
          'Read the introduction to "Forms of Dependency Injection" and "Constructor Injection with PicoContainer" (~4 min), skipping the container detail.',
          'Write in one line the difference between inversion of control (the general idea) and dependency injection (the concrete form).'
        ] },
      ex: { title: 'Assembling the object graph by hand', body: `Without DI: each class builds its own things

public class AppointmentScheduler
{
    private readonly PostgresAppointmentRepository _repo = new();
}

With manual DI: someone outside assembles them

// The classes only declare what they need
public class AppointmentScheduler
{
    private readonly IAppointmentRepository _repo;
    private readonly INotifier _notifier;
    private readonly ISystemClock _clock;

    public AppointmentScheduler(
        IAppointmentRepository repo,
        INotifier notifier,
        ISystemClock clock)
    {
        _repo = repo;
        _notifier = notifier;
        _clock = clock;
    }
}

// A single place assembles everything: the composition root
public static class Program
{
    public static void Main()
    {
        ISystemClock clock = new SystemClock();
        IAppointmentRepository repo = new PostgresAppointmentRepository(connString);
        INotifier notifier = new EmailNotifier("appointments@vetcare.local");

        var scheduler = new AppointmentScheduler(repo, notifier, clock);
        scheduler.Schedule(newAppointment);
    }
}

In a test the same class is assembled with doubles:

var scheduler = new AppointmentScheduler(
    new InMemoryAppointmentRepository(),
    new FakeNotifier(),
    new FixedClock(new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc)));` },
      steps: [
        'In src/VetCare.Playground/Program.cs assemble the full AppointmentScheduler graph by hand.',
        'Create three fake implementations: InMemoryAppointmentRepository with a List, FakeNotifier that stores the messages in a list, and FixedClock that always returns the same date.',
        'Write a small main that schedules an appointment using the fakes and prints the messages it would have sent.',
        'Change only FixedClock’s date to a day after the appointment and check that the rule "no booking in the past" rejects it. If you do not have that rule yet, add it now in AppointmentScheduler using _clock.',
        'Note how many lines it took you to assemble the graph. That number is what the container will save you tomorrow.'
      ],
      vet: [
        'Keep the fake implementations in a separate project or a Fakes folder: they will serve you in the testing week.',
        'Document in docs/design.md that Program.cs is the only composition root.'
      ],
      edge: [
        'Avoid injecting through a public property: it leaves the object half built and it is easy to forget to assign it.',
        'If a constructor asks for more than four dependencies, the class almost always breaks SRP. Deal with that before the number.',
        'Do not inject the container into your classes to ask it for things: that is a service locator and it hides the real dependencies.'
      ],
      quiz: [
        { q: 'What is the difference between inversion of control and dependency injection?', a: 'Inversion of control is the general principle that something external decides the flow or the construction. Dependency injection is the concrete technique of receiving collaborators from outside, usually through the constructor.' },
        { q: 'Do you need a framework to do DI?', a: 'No. Passing collaborators through the constructor and assembling them in a single main is already dependency injection. The container only automates that assembly when the graph grows.' },
        { q: 'What is the composition root and why should there be only one?', a: 'It is the only place where you decide which concrete implementation is used. If there are several, the configuration is scattered and you never know which instance is running in each part.' },
        { q: 'Why should the clock be injected instead of calling DateTime.Now?', a: 'Because DateTime.Now makes the test depend on when it runs. With ISystemClock you can fix the date and test weekend, expiry or seniority rules deterministically.' }
      ],
      out: 'A Program.cs that assembles the graph by hand and three working test doubles.',
      file: 'src/VetCare.Playground/Program.cs'
    },
    {
      t: 'The .NET container and lifetimes',
      obj: 'Register services in the container and choose correctly between singleton, scoped and transient.',
      why: 'Getting the lifetime wrong is one of the most common causes of weird production bugs: one user’s data showing up in another user’s session. Knowing this makes you trustworthy.',
      study: { r: 7, what: 'Read the service lifetimes page. About 12 minutes. Look for one thing: what happens if a singleton depends on a scoped service.',
        pasos: [
          'Read the introduction (~2 min): what a service’s lifetime is.',
          'Read "Transient" (~2 min): a new instance every time it is requested.',
          'Read "Scoped" (~3 min): one instance per request or per scope. Notice the warning about resolving a scoped service from a singleton.',
          'Read "Singleton" (~3 min): one instance for the whole application, and why it must be thread-safe.',
          'Make a three-column table with your VetCare services and decide the lifetime of each one.'
        ] },
      ex: { title: 'The three lifetimes', body: `Registration

var services = new ServiceCollection();

services.AddSingleton<ISystemClock, SystemClock>();
services.AddScoped<IAppointmentRepository, PostgresAppointmentRepository>();
services.AddTransient<INotifier>(_ => new EmailNotifier("appointments@vetcare.local"));
services.AddScoped<AppointmentScheduler>();

var provider = services.BuildServiceProvider(new ServiceProviderOptions
{
    ValidateScopes = true,    // catches the trap below
    ValidateOnBuild = true    // and missing registrations, at startup
});

Resolution

using var scope = provider.CreateScope();
var scheduler = scope.ServiceProvider.GetRequiredService<AppointmentScheduler>();

What each one means

Singleton : one instance for the whole life of the app.
            For things with no state, or with shared state that
            is safe under concurrency (configuration, cache, clock).

Scoped    : one instance per HTTP request or per created scope.
            The right choice for DbContext and repositories.

Transient : a new instance every time it is requested.
            For cheap, stateless objects.

THE TRAP (captive dependency)

services.AddSingleton<ReportService>();   // lives forever
// and ReportService receives IAppointmentRepository (scoped)

The singleton keeps the first scoped repository and goes
on using it after its scope has died.
Result: a closed connection, stale data, or another user's
data. With ValidateScopes = true, .NET throws an error
instead of letting it pass silently.` },
      steps: [
        'Add the Microsoft.Extensions.DependencyInjection package to the Playground project.',
        'Replace yesterday’s manual assembly with registrations in the container.',
        'Resolve AppointmentScheduler from a scope and check that everything still works.',
        'Run the experiment: register one counter as singleton, another as scoped and another as transient, request each twice inside the same scope and print the id of each instance.',
        'Cause a captive dependency on purpose and, with ValidateScopes = true (as in the example), look at the real error.'
      ],
      vet: [
        'Define VetCare’s final registration: clock singleton, repositories scoped, notifier transient.',
        'Write in docs/design.md the table service - lifetime - why.'
      ],
      edge: [
        'A singleton must be safe under concurrency: several threads will use it at the same time.',
        'DbContext is always scoped. As a singleton it piles up tracked entities and blows up the memory.',
        'A transient that implements IDisposable and is requested from the root provider (outside a scope) is not released until the app dies: a classic leak.'
      ],
      quiz: [
        { q: 'What is a captive dependency?', a: 'When a long-lived service receives a short-lived one and keeps it beyond its scope. The short-lived one is captured and keeps being used when it should already be dead, which causes closed connections or crossed data.' },
        { q: 'Why must DbContext be scoped?', a: 'Because it keeps change tracking and a connection per unit of work. Scoped gives it one instance per request, which is exactly an API’s unit of work.' },
        { q: 'When should you choose transient over scoped?', a: 'When the object is cheap to create, keeps no state between calls and shares no resources. If it keeps any state relevant to the request, scoped is safer.' },
        { q: 'What extra requirement does a singleton have compared with the others?', a: 'It must be safe for concurrent access, because many requests use it at the same time. Any mutable field without synchronisation is a bug waiting to happen under load.' }
      ],
      out: 'Container configured, lifetime experiment run and the table in docs/design.md.',
      file: 'src/VetCare.Playground/Program.cs'
    },
    {
      t: 'The Strategy pattern',
      obj: 'Name and correctly apply the pattern you already used in OCP.',
      why: 'Strategy is the most useful pattern day to day and the one that shows up most in interviews, along with Repository. Knowing when NOT to use it makes you look senior.',
      study: { r: 3, what: 'Read the Problem, Solution and Applicability sections. About 12 minutes. Look for one thing: how it differs from simply passing a delegate.',
        pasos: [
          'Read "Intent" and "Problem" (~3 min): the example of the navigation app that grows out of control.',
          'Read "Solution" and "Real-World Analogy" (~3 min).',
          'Look at "Structure" (~2 min) and draw the three pieces: context, strategy interface and concrete strategies.',
          'Read "Applicability" and "Pros and Cons" (~4 min): notice the con that mentions anonymous functions. That is the answer to today’s question.',
          'Write the VetCare strategy interface you are going to implement, with a single method.'
        ] },
      ex: { title: 'Strategy with an interface and with a delegate', body: `Interface version (when the strategy has state or several methods)

public interface IDiscountPolicy
{
    decimal Apply(decimal amount, int ownerVisits);
}

public class FrequentClientDiscount : IDiscountPolicy
{
    private readonly int _minVisits;
    public FrequentClientDiscount(int minVisits)
        => _minVisits = minVisits;

    public decimal Apply(decimal amount, int ownerVisits)
        => ownerVisits >= _minVisits ? amount * 0.9m : amount;
}

public class Invoicer
{
    private readonly IDiscountPolicy _discount;
    public Invoicer(IDiscountPolicy discount) => _discount = discount;

    public decimal Total(decimal gross, int ownerVisits)
        => _discount.Apply(gross, ownerVisits);
}

Delegate version (when it is a single function with no state)

public class Invoicer
{
    private readonly Func<decimal, int, decimal> _discount;
    public Invoicer(Func<decimal, int, decimal> discount)
        => _discount = discount;
}

var i = new Invoicer((amount, visits) => visits >= 5 ? amount * 0.9m : amount);

Notice the strategy receives the number of visits, not the
whole Owner: it only needs that piece of data.

Rule of thumb:
a single operation with no state -> delegate.
Several operations, configuration or an important name -> interface.` },
      steps: [
        'Identify a decision in VetCare that changes according to business policy: discount, schedule priority or cancellation policy.',
        'Define the strategy interface with a single method and a name that describes the decision.',
        'Implement at least three different strategies.',
        'Register the default strategy in the container and resolve it through the constructor.',
        'Write a test that uses a fake strategy that always returns zero, to check that Invoicer has no discount logic of its own.'
      ],
      vet: [
        'Implement IDiscountPolicy with: NoDiscount, FrequentClient, SeasonalPromotion.',
        'Document in docs/design.md that changing the policy does not require touching Invoicer.'
      ],
      edge: [
        'If there is only one strategy and there will never be another, do not use the pattern: it is an extra file with no benefit.',
        'The strategy must not know who uses it. If it needs to call back into the context, the design is inverted.',
        'Beware of strategies that receive the whole object only to read one field: pass the data, not the whole world.'
      ],
      quiz: [
        { q: 'What problem does Strategy solve?', a: 'It lets you swap an algorithm at run time without the code that uses it knowing which one it is. The context delegates the decision and so stops filling up with conditionals.' },
        { q: 'When do you prefer a delegate over an interface?', a: 'When the strategy is a single function, with no state or configuration, and does not need its own name in the domain. The delegate avoids creating two files for one line.' },
        { q: 'How is Strategy similar to what you did in OCP?', a: 'It is the same thing: replacing a switch with interchangeable implementations. OCP is the principle you are after and Strategy is the name of the pattern you achieve it with.' },
        { q: 'How do you test a class that receives a strategy?', a: 'You pass it a fake strategy with known behaviour, for example one that always returns zero. That way the test checks the context’s logic and not the algorithm’s, which is tested separately.' }
      ],
      out: 'Three discount strategies working and interchangeable from the container.',
      file: 'src/VetCare.Domain/Billing/'
    },
    {
      t: 'Factory: deciding what to build',
      obj: 'Centralise object creation when it depends on input data.',
      why: 'When the concrete type depends on something only known at run time, the container is not enough. Factory is the answer and it appears in every real system.',
      study: { r: 4, what: 'Read Problem, Solution and "Relations with Other Patterns". About 12 minutes. Look for one thing: the difference between a factory method and a simple factory.',
        pasos: [
          'Read "Intent" and "Problem" (~3 min): the logistics example with trucks that later needs ships.',
          'Read "Solution" (~3 min) and look at "Structure" (~2 min).',
          'Read "Applicability" (~2 min).',
          'Read "Relations with Other Patterns" (~2 min) and note the difference with Abstract Factory and with a simple creation function.',
          'Write the list of clinical document types your factory must know how to create and which input decides which one.'
        ] },
      ex: { title: 'A factory for clinical documents', body: `The problem: the type depends on an input value

var type = request.DocumentType;  // "prescription", "vaccination", "diagnosis"

The container cannot decide this: it does not know the request.

SIMPLE FACTORY

public interface IDocumentFactory
{
    ClinicalDocument Create(string type, Guid petId, Guid vetId);
}

public class DocumentFactory : IDocumentFactory
{
    private readonly ISystemClock _clock;
    public DocumentFactory(ISystemClock clock) => _clock = clock;

    public ClinicalDocument Create(string type, Guid petId, Guid vetId)
        => type switch
    {
        "prescription" => new Prescription(petId, vetId, _clock.Now()),
        "vaccination"  => new Vaccination(petId, vetId, _clock.Now()),
        "diagnosis"    => new Diagnosis(petId, vetId, _clock.Now()),
        _ => throw new ArgumentException("Unknown document type: " + type)
    };
}

Why it is worth it:
- The switch exists in ONE place, not scattered.
- The factory receives its own dependencies through DI.
- Client code works only with ClinicalDocument.

Careful with the constructors: here each document receives
pet, vet and date. If your week 6 classes ask for more data
(for example, the prescription's medicine), add it to Create
as parameters or in a DocumentRequest object.

What you must NOT do: register Prescription or Vaccination
in the container. They are entities with their own data,
and the container is for services. (.NET 8+ "keyed
services" do help to choose between SERVICES, for example
between several INotifier:
  services.AddKeyedTransient<INotifier, SmsNotifier>("sms");)` },
      steps: [
        'Create IDocumentFactory and its implementation in the domain.',
        'Make the factory receive ISystemClock through its constructor and register the factory in the container.',
        'Replace every new Prescription or new Vaccination in client code with a call to the factory.',
        'Add a new type and check that you only touched the factory and the new file.',
        'Make an unknown type throw an exception with a clear message, not a silent null.'
      ],
      vet: [
        'Apply the factory to the ClinicalDocument from week 6.',
        'Write in docs/design.md why a switch is acceptable here: it concentrates the decision in one known place.'
      ],
      edge: [
        'A factory that only news up one fixed class adds nothing: remove it.',
        'Do not put business logic inside the factory. Its job is to build, not to calculate.',
        'If the factory needs ten parameters, the problem is the object’s constructor, not the factory.'
      ],
      quiz: [
        { q: 'Why does the DI container not replace a factory?', a: 'Because the container resolves dependencies known at startup, and the factory decides the concrete type with data that only exists at run time, such as a field of the request.' },
        { q: 'Is a switch inside a factory acceptable?', a: 'Yes. OCP’s goal is that the switch is not scattered all over the code. Concentrating it in a single known, testable place is precisely the solution.' },
        { q: 'What should the factory do with an unknown type?', a: 'Throw an exception with the received value in the message. Returning null moves the failure to some distant place where it will be much harder to diagnose.' },
        { q: 'What is the sign that a factory is unnecessary?', a: 'That it always builds the same type and makes no decision. In that case it is an empty layer of indirection and it is better to call the constructor directly.' }
      ],
      out: 'IDocumentFactory registered in the container and used by client code.',
      file: 'src/VetCare.Domain/Clinic/DocumentFactory.cs'
    },
    {
      t: 'Adapter: talking to the outside world',
      obj: 'Wrap an external library or API so that your domain does not depend on its shape.',
      why: 'Every real app integrates something external: a payment gateway, SMS, storage. Adapter is what stops a change of provider from becoming a rewrite.',
      study: { r: 5, what: 'Read Problem, Solution and the code example. About 12 minutes. Look for one thing: why the adapter implements YOUR interface, not the provider’s.',
        pasos: [
          'Read "Intent" and "Problem" (~3 min): the app that receives XML and the library that only understands JSON.',
          'Read "Solution" and "Real-World Analogy" (~3 min): the plug adapter.',
          'In "Structure" read "Object adapter" (~2 min); skip "Class adapter", C# has no multiple class inheritance.',
          'Open "Code Examples", choose C# and read the example (~4 min).',
          'Write your domain interface with VetCare words (for example NotifyOwner) before looking at the provider’s API.'
        ] },
      ex: { title: 'Adapting a notification provider', body: `Your domain defines what it needs

public interface INotifier      // the same one from week 6
{
    Task SendAsync(string to, string message);
}

The provider has another shape, which you do not control.
(SmsProClient is a made-up provider; every real SDK has
its own shape, but the idea is the same.)

public class SmsProClient          // comes from the provider's package
{
    public SendResult Send(string from, string to, string body, SendOptions o) { ... }
}

The adapter translates between both worlds

public class SmsNotifier : INotifier
{
    private readonly SmsProClient _client;
    private readonly string _sender;

    public SmsNotifier(SmsProClient client, string sender)
    {
        _client = client;
        _sender = sender;
    }

    public Task SendAsync(string to, string message)
    {
        var r = _client.Send(_sender, to, message, new SendOptions());
        if (!r.Ok) throw new NotificationFailedException(r.Error);
        return Task.CompletedTask;
    }
}

Concrete benefits:
- The domain never mentions SmsPro or SendResult.
- Switching to another provider is writing another adapter.
- The provider's error type is translated into yours.
- In tests you use FakeNotifier and never touch the network.` },
      steps: [
        'Choose an external dependency for VetCare: sending email, SMS, or file storage.',
        'Define the interface in the domain with your business vocabulary, not the provider’s.',
        'Create the adapter in src/VetCare.Infrastructure that implements that interface.',
        'Translate the provider’s errors into your own domain exceptions.',
        'Register the adapter in the container and check that src/VetCare.Domain has no using of the external package.'
      ],
      vet: [
        'Write two adapters for INotifier: a console one and an email one. Switch between them only by changing the registration.',
        'Add the list of external dependencies and their adapters to docs/design.md.'
      ],
      edge: [
        'Do not let provider types leak into your interface’s signature: if your method returns a SendResult, the adapter achieved nothing.',
        'Translate the exceptions too. If you let an SmsProException out, your upper layer is coupled just the same.',
        'An adapter that is a one-to-one copy of the provider’s API usually means you defined the interface by looking at the provider instead of at your need.'
      ],
      quiz: [
        { q: 'Who defines the interface an adapter implements?', a: 'Your domain, according to what it needs. If the provider defines it, the adapter only renames methods and the coupling stays intact.' },
        { q: 'Why must the provider’s exceptions be translated?', a: 'Because if your application layer catches provider-specific exceptions, it is coupled to it even though the interface exists. Translating them keeps the boundary truly clean.' },
        { q: 'How can you tell in the code that an adapter failed at its job?', a: 'When you see types or namespaces of the external package in the domain project, whether in signatures, caught exceptions or configuration enums.' },
        { q: 'What advantage does Adapter give for tests?', a: 'It lets you replace the whole external integration with an in-memory implementation, so tests run fast, with no network and deterministically.' }
      ],
      out: 'Two interchangeable INotifier adapters and zero external references in Domain.',
      file: 'src/VetCare.Infrastructure/Notifications/'
    },
    {
      t: 'Repository and wrapping up patterns (weekly exam)',
      obj: 'Implement the Repository pattern and defend when to use each pattern you have seen.',
      why: 'Repository is the pattern you will write most and also the most debated. Knowing its criticisms, not only its benefits, is what separates someone who understands it from someone who copies it.',
      study: { r: 6, what: 'Read the Repository entry in Fowler’s catalogue, it is short, and then go over your notes for the week. About 12 minutes. Look for one thing: why a repository is said to behave like an in-memory collection.',
        pasos: [
          'Read Fowler’s whole entry (~5 min): the repository mediates between the domain and the data mapping.',
          'Underline the idea that the repository behaves like an in-memory collection: add, remove and search with criteria.',
          'Notice the part about search criteria: that is why your methods should state intent (AppointmentsForDay) and not expose generic queries.',
          'Go over your notes on Strategy, Factory and Adapter and write for each pattern when you would NOT use it.'
        ] },
      ex: { title: 'A well-defined Repository', body: `BAD: a generic repository that leaks the whole database

public interface IRepository<T>
{
    IQueryable<T> Query();   // lets the database escape
}

This forces the caller to write its own LINQ queries and
spreads query logic all over the code.

GOOD: methods that express business intent

public interface IAppointmentRepository
{
    Task<Appointment?> ByIdAsync(Guid id);
    Task<IReadOnlyList<Appointment>> ForDayAsync(DateOnly day, Guid vetId);
    Task<bool> OverlapExistsAsync(Guid vetId, DateTime start, DateTime end);
    Task AddAsync(Appointment a);
    Task SaveChangesAsync();
}

In-memory implementation (for tests)

public class InMemoryAppointmentRepository : IAppointmentRepository
{
    private readonly List<Appointment> _data = new();

    public Task<Appointment?> ByIdAsync(Guid id)
        => Task.FromResult(_data.FirstOrDefault(a => a.Id == id));

    public Task<IReadOnlyList<Appointment>> ForDayAsync(DateOnly day, Guid vetId)
        => Task.FromResult<IReadOnlyList<Appointment>>(_data
               .Where(a => a.VetId == vetId &&
                           DateOnly.FromDateTime(a.Start) == day)
               .OrderBy(a => a.Start)
               .ToList());

    public Task<bool> OverlapExistsAsync(Guid vetId, DateTime start, DateTime end)
        => Task.FromResult(_data.Any(a =>
               a.VetId == vetId && a.Start < end && start < a.End));

    public Task AddAsync(Appointment a) { _data.Add(a); return Task.CompletedTask; }
    public Task SaveChangesAsync() => Task.CompletedTask;
}

The legitimate criticism:
EF Core ALREADY is a repository and a unit of work.
Wrapping it again can be a useless layer.
It is justified when you want to test without a database
or when you want to name the business queries.` },
      steps: [
        'Define IAppointmentRepository with methods that state intent, never with IQueryable.',
        'Implement the full in-memory version and use it in the Playground.',
        'Write the appointment overlap rule and test it against the in-memory repository.',
        'Review the week: write in docs/design.md one card per pattern with problem, solution and when NOT to use it.',
        'Defend out loud for five minutes: why you used Strategy for discounts, Factory for documents, Adapter for notifications and Repository for appointments.'
      ],
      vet: [
        'Leave the in-memory repository ready: it will be the base for the week 13 tests.',
        'Press "Mark for review" and reread docs/design.md in a week.'
      ],
      edge: [
        'A generic repository with a single Query method is not a repository, it is an alias for the database.',
        'Do not return half-loaded entities from the repository: the caller cannot know what is missing.',
        'If your application layer chains five repository calls for one operation, a method that expresses that operation is probably missing.'
      ],
      quiz: [
        { q: 'Why should a repository not expose IQueryable?', a: 'Because it leaks the abstraction: the caller ends up writing provider-dependent queries and can generate disastrous SQL without noticing. It also makes a faithful in-memory implementation impossible.' },
        { q: 'What is the strongest criticism of the Repository pattern with EF Core?', a: 'That DbContext already implements repository and unit of work, so wrapping it can be a layer that adds nothing. It is justified when you want to test without a database or name the queries in the language of the business.' },
        { q: 'How do you choose between Strategy and Factory for a new problem?', a: 'Strategy if what varies is how something is done and you want to swap the algorithm. Factory if what varies is which object to build and the decision depends on input data.' },
        { q: 'Summarise what you gained this week in one sentence.', a: 'That patterns are names for separating what changes from what does not: Strategy separates algorithms, Factory separates construction, Adapter separates the outside world and Repository separates persistence, and DI is the mechanism that connects all those pieces in a single place.' }
      ],
      out: 'docs/design.md with one card per pattern and the in-memory repository working.',
      file: 'docs/design.md'
    }
  ]
}
]);
