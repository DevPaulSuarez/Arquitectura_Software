/* One hint for each "Do it yourself" step: how to start, an example and how to know it is right.
   Key: w<week>d<day>; the order matches days[].steps. */
window.EN = window.EN || {};
window.EN.PISTAS = Object.assign(window.EN.PISTAS || {}, {

/* ---------- Week 5 ---------- */

'w5d1': [
  'Usual order: "dotnet new sln -n VetCare", "dotnet new classlib -o src/VetCare.Domain", "dotnet new console -o src/VetCare.Playground", "dotnet sln add" for both projects and "dotnet add src/VetCare.Playground reference src/VetCare.Domain". Check with "dotnet build" from the root: it must say 0 errors.',
  'Copy the attributes from your week 3 table and turn them into properties: "public string Name { get; set; }", "public DateOnly BirthDate { get; set; }", "public decimal WeightKg { get; set; }". You do not need to encapsulate today (that is tomorrow); it is enough for each property’s type to match your model.',
  'Create two objects of the same class with different data, change a property of the first and print both with Console.WriteLine. Example: "var max = new Pet { Name = "Max" }; var luna = new Pet { Name = "Luna" }; max.Name = "Maxi";". If luna is still called Luna, you have checked that each object has its own state.'
],

'w5d2': [
  'Ask for each property: does anyone outside need to READ it? And CHANGE it? If it is only read, use "{ get; private set; }" or "{ get; init; }". If nobody outside uses it, turn it into a private field "private int _counter;". Start by closing everything and open only what is needed to compile.',
  'Pattern: "private readonly List<Vaccine> _vaccines = new(); public IReadOnlyList<Vaccine> Vaccines => _vaccines;". From outside it can be iterated, but Add cannot be called. To add, create a method with a business name: "public void RecordVaccine(Vaccine v)". Check: "pet.Vaccines.Add(...)" must not compile.',
  'Look for data deduced from other data: the age (from the date of birth), an appointment’s duration (end minus start), whether a pet has pending vaccines. Write it like this: "public int AgeInYears(DateOnly today) => …". Since it depends on the current date, pass "today" as a parameter; tomorrow you will see why.'
],

'w5d3': [
  'Look for rules you would put in Program or in a service today: "only a scheduled appointment can be cancelled", "a vaccine with a future date is not recorded", "the weight cannot drop by more than 50% at once". Turn them into methods: appointment.Cancel(reason), pet.RecordVaccine(vaccine, today), pet.UpdateWeight(newWeight).',
  'Structure of each method: first all the ifs that throw, then the assignments. Example: "if (Status != AppointmentStatus.Scheduled) throw new InvalidOperationException("Only scheduled appointments are cancelled"); Status = AppointmentStatus.Cancelled; CancellationReason = reason;". If you assign something before validating and then it fails, the object is left half-done.',
  'Look for DateTime.Now or DateTime.Today inside the classes and replace it with a parameter: "public void Cancel(string reason, DateTime now)". That way you can test "cancel with less than 24 h" by putting in any date you want, without waiting for the real day. Check: no DateTime.Now must be left in src/VetCare.Domain.'
],

'w5d4': [
  'At the start of the constructor validate each parameter: "if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("The name is required", nameof(name));", "if (weightKg <= 0) throw new ArgumentOutOfRangeException(nameof(weightKg));". Use the same ranges as your week 3 attribute table.',
  'If a class only makes sense with data (a Pet without a name does not exist), delete the empty constructor. If EF Core will need it later, leave it as "private Pet() { }" with a comment "// for EF Core". Check: "new Pet()" from Playground must not compile.',
  'A static method with a business name says what the object is created for: "public static Appointment Schedule(Guid petId, Guid vetId, TimeRange slot, DateTime now)". Inside, validate (for example, that it is not in the past) and call a private constructor. It is especially useful when there are several ways to create the same object.'
],

'w5d5': [
  'The five typical holes: 1) public setters, 2) modifiable public collections, 3) constructors that do not validate, 4) methods that return the internal list, 5) exposed properties of mutable types. Go through each class with this list and note "Class · hole · line".',
  'For each fix write a line: "Pet.Weight had a public set → now UpdateWeight() → it protected: the weight is always positive". If when closing a hole you cannot find any invariant that was at risk, maybe it was not a hole: there is no need to close for the sake of closing.',
  'Public things (classes, properties, methods): PascalCase → PetName, Cancel. Private fields: underscore + camelCase → _vaccines. Parameters and local variables: camelCase → weightKg. Use the editor’s rename option (F2) so all references change at once.'
],

'w5d6': [
  'Open it and check it compiles with "dotnet run --project src/VetCare.Playground". If the reference is missing: "dotnet add src/VetCare.Playground reference src/VetCare.Domain". Delete the test code from previous days or move it into a separate method to start clean.',
  'Use a helper function: "void Attack(string name, Action action) { try { action(); Console.WriteLine("FAIL: " + name + " was accepted"); } catch (Exception e) { Console.WriteLine("OK: " + name + " → " + e.Message); } }". Typical attacks: negative weight, empty name, appointment in the past, cancelling twice, vaccine with a future date, adding to a read-only collection.',
  'Read the output looking for "FAIL". Each one is an unprotected invariant: add the validation in the constructor or the method and run again. Finish when every line says OK. Keep that output: you will use it as a reference in week 6’s exam.'
],

/* ---------- Week 6 ---------- */

'w6d1': [
  'Write the list in a table with columns: Candidate | Can it change provider or technology? | Do I need to replace it in tests?. The six in the prompt are good candidates; add a concrete example next to each: "Notification: email today, WhatsApp tomorrow".',
  'If you answer yes to either question, make it an interface. If both are no, a concrete class. Example: the clock → yes (in tests I need a fixed date) → interface. An age calculation → no and no → a normal method. Write the decision with a one-sentence reason; the discarded ones also go in the document.',
  'Use the business’s vocabulary and only the methods you need today: "public interface INotifier { Task SendAsync(Recipient to, string message); }", "public interface ISystemClock { DateTime Now(); }". Check: no signature should mention SMTP, HTTP, SQL or types from an external library.'
],

'w6d2': [
  'Examples of pairs: EmailNotifier / InMemoryNotifier (keeps the messages in a list), SystemClock / FixedClock, PostgresRepository / InMemoryRepository. The real version can be simple for now (for example, writing "sending email to…" to the console); what matters is that both implement the same interface.',
  'The service asks for the interface through its constructor: "public ReminderService(INotifier notifier, ISystemClock clock) { … }". Check: inside ReminderService there must be no "new EmailNotifier" nor the name of any concrete class.',
  'In Program.cs create the service twice: "new ReminderService(new EmailNotifier(), clock)" and "new ReminderService(new InMemoryNotifier(), clock)", and call the same method on both. If the service works the same without changing a line of its code, the interface is well designed.'
],

'w6d3': [
  'The ideal candidate has two axes that combine. Example with prices: kind of client (normal, frequent) × time (normal, emergency). With inheritance you would have NormalFee, FrequentFee, EmergencyFee, FrequentEmergencyFee… Write down both axes and all their variants.',
  'Do the sum: variants of axis A × variants of axis B. With 2 × 2 you get 4 classes; add a third time (weekend) and it is 6; add another axis (species) and it explodes. Implement at least 3 or 4 classes to feel the problem and note the formula.',
  'With composition: "interface IPriceRule { decimal Apply(decimal price); }" and one class per rule (FrequentClientDiscount, EmergencySurcharge). The fee receives a list of rules and applies them in order. Compare in a table: classes with inheritance and with composition, and how many must be created to add a new variant (with composition, one).'
],

'w6d4': [
  '"Is a" test: is a Prescription a ClinicalDocument in every case, and do they share data and behaviour (issue date, signing vet, pet)? If in doubt, it is not inheritance. Clinical documents are the clearest example in VetCare.',
  'Base: "public abstract class ClinicalDocument { public Guid PetId { get; } public DateTime Issued { get; } protected ClinicalDocument(Guid petId, DateTime issued) { … } public abstract string Title { get; } }". Leaves: "public sealed class Prescription : ClinicalDocument { … }". The protected constructor forces you to always create a concrete leaf.',
  'Check three things: 1) the base is abstract (you cannot do new ClinicalDocument), 2) each leaf is sealed, 3) look inside the base for "is Prescription", "GetType()" or a switch by type: there must be none. If the base asks which child it is, the behaviour should be in the child.'
],

'w6d5': [
  'Search with the editor’s search: "switch", "is Prescription", "GetType()", ".Type ==", "DocumentType.". Note each one with the file, the line and what it decides (for example, the PDF title depending on the type). If you have none, write one on purpose to practise.',
  'If the switch decides the title by type, add "public abstract string Title { get; }" to the base and in each leaf "public override string Title => "Prescription";". Then replace the whole switch with "document.Title". Check: the switch disappears completely, without leaving a "default".',
  'Create for example "sealed class HealthCertificate : ClinicalDocument" with its override. The compiler will force you to implement the abstract members. Check with git diff: only the new file should appear. If you had to touch another file to make it work, there is a hidden switch there.'
],

'w6d6': [
  'Run "dotnet run --project src/VetCare.Playground > docs/output-before.txt". That saves the output to a file to compare later. Check every line says OK before starting; if any says FAIL, fix it first or you will not know whether you broke it.',
  'Go class by class and mark ✓/✗ on each point. Fix one point at a time and compile after each change. Small, frequent changes: if something breaks, you know exactly what it was.',
  'Run again into "docs/output-after.txt" and compare: "diff docs/output-before.txt docs/output-after.txt" (on Windows: "fc"). If it prints nothing, the behaviour is identical. If there are differences, "git stash" or "git checkout" the guilty file and redo the change in smaller steps.'
],

/* ---------- Week 7 ---------- */

'w7d1': [
  'Make a simple table: Class | Methods | Fields each method uses. You can use the editor’s outline view (Outline in VS Code) to see every method without reading all the code.',
  'Examples: "Pet exists to keep an animal’s data and clinical history" (good). "AppointmentManager exists to book appointments AND send emails AND calculate prices" (suspicious). The words manager, helper or utils in the name almost always hide an "and".',
  'Mark in the table which field each method uses. If separate groups appear (methods 1-3 use _repo and methods 4-5 use _smtp, and they never cross), they are two classes inside one. Colour them: one colour per group.',
  'Create one class per colour group and name it after its topic: AppointmentScheduler, AppointmentNotifier, not AppointmentHelper2. Move the methods with their fields. The original class may disappear or keep only what really belongs to it.',
  'Run "dotnet build" and count the errors. Fix them one by one (they are usually type or constructor changes). Note the initial number of errors in docs/design.md: it shows how many places depended on that class, and that is the coupling you will see tomorrow.'
],

'w7d2': [
  'Search with the editor’s search, only in src/VetCare.Domain: "new Smtp", "new Http", "new Npgsql", "File.", "new Sql", "DateTime.Now". Note file, line and what it creates. Each result is a fixed dependency that prevents testing and changing the class.',
  'The interface must have only what the domain class uses. If the domain only calls Send, the interface is "interface INotifier { Task SendAsync(string recipient, string message); }", even if the concrete class has 20 methods. Put it in src/VetCare.Domain/Abstractions.',
  'If it does not exist yet: "dotnet new classlib -o src/VetCare.Infrastructure", "dotnet add src/VetCare.Infrastructure reference src/VetCare.Domain". Move the class and add ": INotifier". The reference arrow goes from Infrastructure to Domain, never the other way round.',
  'Replace the field "private readonly SmtpEmailSender _email = new(...)" with "private readonly INotifier _notifier;" and receive it in the constructor. Whoever creates the class (Playground or, later, the API) decides which implementation to pass.',
  'Search for "using VetCare.Infrastructure", "using Npgsql", "using System.Net.Mail" inside src/VetCare.Domain. Also check Domain’s .csproj: it must have no ProjectReference to Infrastructure. Zero results = goal met.'
],

'w7d3': [
  'Table: Method | Who would ask to change it?. Example for Invoice: CalculateTotal → accounting; GeneratePdf → reception (wants another design); Save → the technical team. Think of real people or departments in the clinic, not technical layers.',
  'If two or more actors appear in a class, group the methods by actor and create one class per group. The original class can keep the data and delegate to the new ones, or disappear. Compile after each move.',
  'Name = a noun describing the job + what it applies to: TotalsCalculator, ReceiptGenerator, InvoiceRepository. Avoid Manager, Service or Helper on their own. Test: if someone reads only the class name, can they guess its methods?',
  'Search in src/VetCare.Domain: "pdf", "json", "html", "sql", "http", "Serialize". If it appears in the domain, that code belongs to another layer (infrastructure or presentation). Move it and leave in the domain only what the business would understand.',
  'Copy step 1’s table, now corrected, with a new column: Resulting class. Below it add a sentence: "Each class has a single actor who requests changes to it". In an interview, showing this table explains SRP better than any definition.'
],

'w7d4': [
  'Search for "switch", "case" and chains of "if (type == …) else if". Choose the one with most branches or that changes most (look at the history with "git log -p" on the file). Prices and discounts are the typical candidate.',
  'Look at what changes between branches. If each branch calculates a different price: "interface IPriceRule { bool Applies(Appointment a); decimal Calculate(Appointment a); }". Applies says whether the rule matches the case; Calculate does the work.',
  'Each "case" becomes a class: "case Emergency: price * 1.5" → "sealed class EmergencyRule : IPriceRule { public bool Applies(Appointment a) => a.IsEmergency; public decimal Calculate(Appointment a) => a.BasePrice * 1.5m; }". Put each one in its own file inside Pricing/.',
  'Constructor: "public PriceCalculator(IEnumerable<IPriceRule> rules)". Method: "var rule = _rules.FirstOrDefault(r => r.Applies(appointment)) ?? throw new InvalidOperationException("No rule for the appointment");". For now, in Playground, pass the list by hand: "new PriceCalculator(new IPriceRule[] { new EmergencyRule(), … })".',
  'Create for example WeekendRule in a new file and add it only to the list you build in Program.cs. Check with "git status": PriceCalculator.cs and the other rules must not appear as modified.'
],

'w7d5': [
  'Search: "throw new NotImplementedException", "throw new NotSupportedException" and overrides with an empty body "{ }". Also look for overrides that do not use the parameter they receive. Each one is a child promising something it does not deliver.',
  'Compare the first line of each override with the parent’s method: if the child adds an "if (x <= 0) throw" the parent did not have, it demands more than the parent. Whoever uses the parent with a 0 (valid for it) will break on receiving this child.',
  'Ask: can every child do this? If only some can (for example, signing: a certificate is signed and an internal note is not), the parent promises too much → take the method out of the parent. If the child is not really a case of the parent → it should not inherit.',
  'Example: "interface ISignable { void Sign(Vet v); }". Remove Sign from ClinicalDocument; Prescription and Certificate implement ISignable and DraftNote does not. The code that signs asks for ISignable, not ClinicalDocument. The NotImplementedExceptions disappear.',
  'Write a function that receives a ClinicalDocument and uses only what the parent promises (for example, Title and Issued). Call it with an instance of each child. If any throws an exception or gives an odd result, that child still violates LSP. With xUnit you can do it with [Theory] and a list of documents.'
],

'w7d6': [
  'For each interface look at who uses it and which methods they call. If AppointmentScheduler only uses Get and Save, and Reports only uses List, split it in two: IAppointmentRepository (Get, Save) and IAppointmentQueries (List). Rough rule: more than 5 methods is suspicious.',
  'Name it after what its user does: IReadAppointments, INotifier, ISystemClock. Avoid ISqlRepo, IEmailService or IPostgresStore: they tie the name to a technology and the domain should not know which is behind. Use F2 to rename across the project.',
  'With Mermaid: "graph LR; Api --> Domain; Infrastructure --> Domain; Api --> Infrastructure". Each arrow means "depends on / has a reference to". Take them from each .csproj’s ProjectReferences, not from memory.',
  'Open src/VetCare.Domain/VetCare.Domain.csproj: it must have no ProjectReference and no infrastructure packages (Npgsql, EF Core, HTTP clients). In the diagram, Domain must only receive arrows, never send them.',
  'Format: letter · one sentence · example in VetCare. "S: each class has a single actor requesting changes — I separated TotalsCalculator from ReceiptGenerator". Do all 5 and rehearse them out loud. If you go blank on one, go back to that day.'
],

/* ---------- Week 8 ---------- */

'w8d1': [
  'Start with the leaves (what depends on nothing) and work up: "var clock = new SystemClock(); var repo = new InMemoryAppointmentRepository(); var notifier = new ConsoleNotifier(); var scheduler = new AppointmentScheduler(repo, notifier, clock);". If a class asks for something you have not created yet, create it first.',
  'InMemoryRepository: "private readonly List<Appointment> _appointments = new();" and methods working on the list. FakeNotifier: "public List<string> Sent { get; } = new();" and in Send you do Sent.Add(message). FixedClock: "public FixedClock(DateTime now) => _now = now; public DateTime Now() => _now;".',
  'Build the graph with the three fakes, book an appointment and at the end: "foreach (var m in notifier.Sent) Console.WriteLine(m);". Since the notifier is fake, you can see what would have been sent without sending any real email.',
  'Create "new FixedClock(new DateTime(2026, 6, 10))" and book an appointment for 1 June. It must throw. The rule in AppointmentScheduler: "if (slot.Start < _clock.Now()) throw new InvalidOperationException("Appointments are not booked in the past");". Thanks to the fake clock, you test the past without depending on the real date.',
  'Count the lines from the first new until you have the scheduler. With 3 dependencies there are few, but imagine 30 services, each with 3 or 4 dependencies, created in the right order. Note the number; tomorrow the container will do this for you.'
],

'w8d2': [
  '"dotnet add src/VetCare.Playground package Microsoft.Extensions.DependencyInjection". Check that it appears in the .csproj and that "dotnet build" still works.',
  'Pattern: "var services = new ServiceCollection(); services.AddSingleton<ISystemClock, SystemClock>(); services.AddScoped<IAppointmentRepository, InMemoryAppointmentRepository>(); services.AddTransient<AppointmentScheduler>(); var provider = services.BuildServiceProvider(new ServiceProviderOptions { ValidateScopes = true });".',
  '"using var scope = provider.CreateScope(); var scheduler = scope.ServiceProvider.GetRequiredService<AppointmentScheduler>();". Repeat yesterday’s test: if it books the same way, the container is building the same graph you were building by hand.',
  'Create "class Counter { public Guid Id { get; } = Guid.NewGuid(); }" and three classes inheriting from it (SingletonCounter, ScopedCounter, TransientCounter), each registered with its lifetime. Ask for each twice in the same scope and then in another scope. Expected: singleton always has the same Id, scoped repeats the Id within the scope and changes between scopes, transient always changes.',
  'Register as a singleton a service that receives IAppointmentRepository (scoped) and ask for it. With ValidateScopes = true you will see: "Cannot consume scoped service … from singleton …". Copy the message to docs/design.md with a sentence: a singleton lives forever and would hold on to a repository that should die at the end of each request.'
],

'w8d3': [
  'Look for decisions the business changes without the rest of the process changing: how much discount to apply, which appointment goes first, what penalty cancelling has. Choose one and write 3 possible real policies. Example: no discount, 10% for frequent clients, 20% from the second pet.',
  'A single method that makes the decision: "public interface IDiscountPolicy { decimal Calculate(Invoice invoice); }". The name must describe the decision (DiscountPolicy), not the pattern (IStrategy). If you need two methods, they are probably two different strategies.',
  'One class per policy: NoDiscount (returns 0), LoyaltyDiscount, MultiPetDiscount. Each in its own file and without knowing the others exist. If two share a calculation, extract a helper function, but do not chain them with inheritance.',
  '"services.AddSingleton<IDiscountPolicy, LoyaltyDiscount>();" and Invoicer receives "IDiscountPolicy policy" through its constructor. To change the policy you only change that registration line. Check that Invoicer mentions no concrete policy.',
  'Create "class ZeroDiscount : IDiscountPolicy { public decimal Calculate(Invoice i) => 0; }" in the test. Build Invoicer with it and check that the total is exactly the sum of the lines. If another value comes out, Invoicer has hidden discount logic that should be in a strategy.'
],

'w8d4': [
  '"public interface IDocumentFactory { ClinicalDocument Create(DocumentType type, Consultation consultation); }" and its implementation "DocumentFactory" with a switch on the type. This switch is acceptable: the factory is the only place that decides which class to create.',
  '"public DocumentFactory(ISystemClock clock) { _clock = clock; }" and use "_clock.Now()" as the issue date. Register: "services.AddSingleton<IDocumentFactory, DocumentFactory>();". Check that the documents’ dates come from your fixed clock in the tests.',
  'Look for "new Prescription(", "new Vaccination(", "new Certificate(" outside the factory and the tests. Replace them with "_factory.Create(DocumentType.Prescription, consultation)". When you finish, the search must only find results inside DocumentFactory.',
  'Create the new type (for example, DischargeReport), add the value to the enum and a case to the factory. With "git status" you should see only: the new file, the enum and the factory. If any client file appears, it still creates documents on its own.',
  'In the switch: "_ => throw new ArgumentOutOfRangeException(nameof(type), type, "Unsupported document type")". Never "_ => null": a null travels through the system and blows up far from where it started, with a NullReferenceException that says nothing.'
],

'w8d5': [
  'Choose the one most likely to change provider: sending email (SMTP, SendGrid, Mailgun) is the most typical. Write down which operations VetCare really needs: probably only "send a reminder to an owner".',
  'Speak the business’s language: "interface INotifier { Task SendReminderAsync(Owner owner, Appointment appointment); }" and not "SendEmailAsync(MailMessage msg)". The interface must not know whether there is email, SMS or WhatsApp on the other side.',
  '"public sealed class SendGridNotifier : INotifier" in src/VetCare.Infrastructure/Notifications. Inside you translate: Owner → email address, Appointment → subject and body, and you call the SDK. If you do not have an account with any provider, simulate the call with a Console.WriteLine; the structure is what matters.',
  'Wrap the call: "try { … } catch (SendGridException ex) { throw new NotificationFailedException("The reminder could not be sent", ex); }". Define NotificationFailedException in the domain. Pass the original exception as the inner exception so the error detail is not lost.',
  'Register: "services.AddSingleton<INotifier, SendGridNotifier>();". Search in src/VetCare.Domain for "SendGrid", "MailKit", "System.Net.Mail": zero results. Also check Domain’s .csproj: it must have no PackageReference to the provider.'
],

'w8d6': [
  'Methods with intent: "Task<Appointment?> GetAsync(Guid id); Task<IReadOnlyList<Appointment>> ForVetOnDayAsync(Guid vetId, DateOnly day); Task SaveAsync(Appointment appointment);". No IQueryable: if you return IQueryable, the caller can build free-form queries and the repository stops hiding the database.',
  'Use a "List<Appointment>" or a "Dictionary<Guid, Appointment>" inside. ForVetOnDay filters with LINQ: "_appointments.Where(a => a.VetId == id && DateOnly.FromDateTime(a.Start) == day).ToList()". Register it in the container and book a few appointments from Playground.',
  'Two ranges overlap if "a.Start < b.End && b.Start < a.End". In AppointmentScheduler: get that vet’s appointments for that day and, if any overlaps, throw. Test three cases: overlapping (rejects), adjacent 10:00–10:30 and 10:30–11:00 (accepts) and another vet at the same time (accepts).',
  'A card per pattern: Problem (what hurt) · Solution (how it solves it) · In VetCare (where you used it) · When NOT to use it. Example of NOT: "Factory: not needed if there is only one class and creating it is trivial". The NOT section is the one that shows judgement.',
  'For each pattern use the structure: concrete problem → why that pattern → discarded alternative. "Discounts: they changed with the owner’s policy → Strategy lets them change without touching Invoicer → I discarded a switch because every new promotion modified it". Record yourself for 5 minutes and listen.'
]

});
