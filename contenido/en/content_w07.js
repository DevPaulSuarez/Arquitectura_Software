window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 7,
  phase: 'Design and SOLID',
  title: 'Give every piece a single reason to change',
  idea: 'You already know how to write classes. Now it is time to decide where to put each thing. A good design is not the one with the most classes, it is the one where a future change touches a single file. This week you learn to measure that with two ideas (cohesion and coupling) and to apply it with the five SOLID principles.',
  res: [
    { t: 'Microsoft Learn — Architectural principles',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles',
      note: 'An official summary of separation of concerns, encapsulation and dependency inversion, with .NET examples.' },
    { t: 'Robert C. Martin — The Single Responsibility Principle', u: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html', note: 'The author of SOLID clarifies what "one reason to change" really means.' },
    { t: 'Martin Fowler — Reducing coupling',
      u: 'https://martinfowler.com/ieeeSoftware/coupling.pdf',
      note: 'Four pages from the most cited author on the topic. It gives you vocabulary to defend decisions in an interview.' },
    { t: 'Robert C. Martin — The Open Closed Principle', u: 'https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html', note: 'OCP explained by the person who popularised it, short and direct.' },
    { t: 'Wikipedia — Liskov substitution principle', u: 'https://en.wikipedia.org/wiki/Liskov_substitution_principle', note: 'The formal definition and why it matters when inheriting.' }
  ],
  days: [
    {
      t: 'Cohesion: what lives together',
      obj: 'Recognise whether a class has a clear purpose or is a junk drawer.',
      why: 'In interviews they will show you a 600-line class and ask what is wrong with it. The professional answer starts with cohesion: this class does too many unrelated things.',
      study: { r: 0, what: 'Read only the sections "Separation of concerns" and "Encapsulation". About 10 minutes. Look for one thing: what it means for a component to have a "well-defined responsibility".',
        pasos: [
          'Read the introduction to "Common design principles" (~2 min).',
          'Read "Separation of concerns" (~4 min): separate by kind of work, not by size.',
          'Read "Encapsulation" (~3 min): each part hides how it works and exposes a contract.',
          'Read "Single responsibility" (~2 min): you will see it is the same idea from another angle.',
          'Write the sentence "this class exists to..." for your two largest classes before starting the steps.'
        ] },
      ex: { title: 'Low cohesion vs high cohesion', body: `(Outline: method bodies are omitted.)

BAD (low cohesion: three different topics in one class)

public class AppointmentManager
{
    public void BookAppointment(Appointment a) { }
    public void SendConfirmationEmail(string email) { }
    public decimal CalculateTax(decimal amount) { }
    public void WriteToLogFile(string text) { }
}

If the email provider changes, you touch AppointmentManager.
If the VAT changes, you touch AppointmentManager.
If the booking rule changes, you touch AppointmentManager.
Three different reasons to modify the same file.

GOOD (each class with one topic)

public class AppointmentScheduler
{
    public void Schedule(Appointment a) { }
    public void Reschedule(Appointment a, DateTime newTime) { }
    public void Cancel(Appointment a, string reason) { }
}

public class EmailNotifier
{
    public void SendConfirmation(string email, Appointment a) { }
}

public class TaxCalculator
{
    public decimal Calculate(decimal amount) { }
}

Now each class's methods talk about the same topic and use
the same data. That is high cohesion.` },
      steps: [
        'Open src/VetCare.Domain and list on a sheet each class you have with its methods.',
        'For each class write in a single sentence: this class exists to ____. If you need the word "and", it is suspicious.',
        'Mark in red every class whose methods do not share the same private fields. That is the classic symptom of low cohesion.',
        'Pick the worst one and split its methods into two new classes with names that state the topic, not the mechanism.',
        'Compile. If splitting one class broke 20 files, write that number down: it helps you talk about coupling tomorrow.'
      ],
      vet: [
        'Check your Appointment class: if it has price calculation methods, move them out. The price is another topic.',
        'Create docs/design.md and write the one-line sentence for each domain class.'
      ],
      edge: [
        'High cohesion does not mean tiny classes. A 200-line class that only talks about booking appointments is fine.',
        'Beware of classes called Helper, Manager, Utils or Common: they are almost always junk drawers.',
        'Splitting on a whim creates the opposite problem: ten classes that always change together. If they are always modified at the same time, maybe they should be one.'
      ],
      quiz: [
        { q: 'How do you detect low cohesion without reading all the code?', a: 'Check whether the class’s methods use the same private fields. If method A only touches _repo and method B only touches _smtp, they are two classes disguised as one.' },
        { q: 'Why is the name "AppointmentManager" worse than "AppointmentScheduler"?', a: 'Manager says nothing, so any method seems to fit there. A specific name acts as a filter: if the method does not fit the name, it does not fit the class.' },
        { q: 'What is the relationship between cohesion and ease of testing?', a: 'A cohesive class needs few dependencies to build, so the test is set up in two lines. A junk-drawer class forces you to fake email, database and clock just to test an addition.' },
        { q: 'Is it possible to have too many small classes?', a: 'Yes. If to understand a flow you must open eight files and they all change together when a requirement changes, the separation gives you nothing and it is worth merging them.' }
      ],
      out: 'docs/design.md with the purpose sentence for each class and at least one class split.',
      file: 'docs/design.md'
    },
    {
      t: 'Coupling: who depends on whom',
      obj: 'Measure how much classes know about each other and reduce it with abstractions.',
      why: 'Coupling is what decides whether a small change costs an hour or three days. It is the measure tech leads use most to accept or reject a pull request.',
      study: { r: 2, what: 'Read Fowler’s whole PDF, it is four pages. About 15 minutes. Look for one thing: the difference between necessary coupling and accidental coupling.',
        pasos: [
          'Read the first paragraphs (~3 min) and copy Fowler’s definition: if changing one module forces you to change another, there is coupling.',
          'Notice why he says duplication always implies coupling, and why banning coupling only sweeps it under the rug (~2 min).',
          'Read the section Look at dependencies (~5 min): the focus is on large modules and on the direction of dependencies. Copy his user interface, domain and database diagram.',
          'Read the rest (~5 min), paying attention to how he uses an interface to invert an annoying dependency.',
          'Draw the same kind of diagram for VetCare and mark in red any arrow that goes from the domain to the infrastructure.'
        ] },
      ex: { title: 'Strong vs weak coupling', body: `STRONG: the class builds what it needs

public class AppointmentScheduler
{
    private readonly SmtpEmailSender _email = new SmtpEmailSender("smtp.gmail.com");
    private readonly SqlAppointmentRepository _repo = new SqlAppointmentRepository("Host=localhost...");

    public void Schedule(Appointment a, string ownerEmail)
    {
        _repo.Save(a);
        _email.Send(ownerEmail, "Appointment confirmed");
    }
}

Problems:
- You cannot test it without a real SMTP server and database.
- Moving from Gmail to SendGrid forces you to touch this class.
- The connection string is hidden in the domain.

WEAK: the class receives contracts

public class AppointmentScheduler
{
    private readonly INotifier _notifier;
    private readonly IAppointmentRepository _repo;

    public AppointmentScheduler(IAppointmentRepository repo, INotifier notifier)
    {
        _repo = repo;
        _notifier = notifier;
    }

    public async Task ScheduleAsync(Appointment a, string ownerEmail)
    {
        _repo.Save(a);
        await _notifier.SendAsync(ownerEmail, "Appointment confirmed");
    }
}

Now in a test you pass fake implementations and the class
does not know whether behind it there is Gmail, SendGrid or
a text file.` },
      steps: [
        'Search your code for the word new followed by an infrastructure class (repository, email, http, file). Every occurrence inside the domain is coupling you must remove.',
        'For each one, define an interface in the domain with only the methods you really use.',
        'Move the concrete class to src/VetCare.Infrastructure and make it implement the interface.',
        'Change the domain class to receive the interface through its constructor.',
        'Count how many infrastructure usings are left in src/VetCare.Domain. The goal is zero.'
      ],
      vet: [
        'Apply this to the INotifier and IAppointmentRepository you defined in week 6.',
        'Write the rule in docs/design.md: the Domain project references no other project.'
      ],
      edge: [
        'An interface with 20 methods does not reduce coupling, it only disguises it. The interface is defined by whoever uses it, not whoever implements it.',
        'Coupling to language types (string, DateTime, List) is normal and does not need abstracting.',
        'If an interface has a single implementation and you will never have another or test that point, you may not need it yet.'
      ],
      quiz: [
        { q: 'What is the difference between necessary and accidental coupling?', a: 'Necessary coupling comes from the problem: booking appointments needs to store them somewhere. Accidental coupling comes from the implementation: booking appointments does not need to know the database is PostgreSQL. You accept the first; you hide the second behind an interface.' },
        { q: 'Why should the interface live in the domain project and not in infrastructure?', a: 'Because then the dependency arrow points inwards: infrastructure knows the domain and not the other way round. If the interface lived in infrastructure, the domain would have to reference it and you would be back to the original coupling.' },
        { q: 'Which symptom in the tests gives away strong coupling?', a: 'That to test a simple rule you need to start a database, the network or wait real time. If the test’s arrange takes 30 lines, the class depends on too many concrete things.' },
        { q: 'Does reducing coupling always improve the design?', a: 'No. Every abstraction adds a file and a mental jump when reading the code. It is justified when there is more than one real implementation, when you need to test, or when the dependency is on something external and unstable.' }
      ],
      out: 'The Domain project compiles with no references to infrastructure.',
      file: 'docs/design.md'
    },
    {
      t: 'SRP: a single reason to change',
      obj: 'Apply the single responsibility principle by identifying who asks for each change.',
      why: 'SRP is question one in almost every interview about SOLID, and most people explain it wrongly by saying "a class does one thing". If you explain it in terms of actors, you stand out.',
      study: { r: 1, what: 'Read Robert C. Martin’s whole article. About 10 minutes. Look for one thing: the correct definition talks about reasons to change, meaning the people or roles who ask for changes, not the number of methods.',
        pasos: [
          'Read the article from start to finish (~8 min).',
          'Underline the sentence that says the principle is about people: who asks for the change.',
          'Notice the example of the class with methods for the CFO, the COO and the CTO. Write the VetCare equivalent: accounting, reception and the vet.',
          'Write in your own words why putting together code for two actors makes a change for one break the other.'
        ] },
      ex: { title: 'SRP by actors', body: `(Outline: method bodies are omitted.)

A class with three different bosses:

public class Invoice
{
    public decimal CalculateTotal() { }   // defined by Accounting
    public string GeneratePdf() { }       // defined by Design / Marketing
    public void SaveToDatabase() { }      // defined by the data team
}

If Accounting changes the VAT, the file is touched.
If Marketing wants another logo, the same file is touched.
Two teams editing the same file is how conflicts and bugs
by side effect happen.

Split by actor:

public class Invoice                 // business rules
{
    public decimal CalculateTotal() { }
}

public class InvoicePdfGenerator     // presentation
{
    public byte[] Generate(Invoice i) { }
}

public class InvoiceRepository       // persistence
{
    public void Save(Invoice i) { }
}

The key question for applying SRP:
who, as a person or area of the business,
can ask for this to change?` },
      steps: [
        'Take your three largest classes and make a table: method, who would ask for a change to it (accounting, reception, vet, technical team).',
        'If a class has methods from two different actors, split it by actor.',
        'Name the new classes with the noun of the role: TotalsCalculator, ReceiptGenerator, InvoiceRepository.',
        'Check that the domain class does not mention formats (pdf, json, html) or technologies (sql, http).',
        'Write the actor-class table in docs/design.md. That table is your interview answer.'
      ],
      vet: [
        'In VetCare the actors are: reception (schedule), the vet (clinical history), accounting (invoices), the owner (notifications).',
        'Check that no class mixes rules from two of those actors.'
      ],
      edge: [
        'SRP does not forbid a class from having many methods, it forbids it from having many bosses.',
        'A DTO with 30 properties does not break SRP: it has no behaviour, it only carries data.',
        'Taking SRP to the extreme produces classes with a single method called Execute. That is a procedure in disguise, not design.'
      ],
      quiz: [
        { q: 'What is the precise definition of SRP?', a: 'A module should have a single reason to change, understood as a single actor or area of the business that can request that change. It is not about counting methods.' },
        { q: 'Why is mixing total calculation and PDF generation a real risk?', a: 'Because accounting and design edit the same file. A format change can break the calculation without anyone noticing until the invoices come out wrong.' },
        { q: 'Does a DTO with many properties break SRP?', a: 'No. SRP is about reasons for behaviour to change. A data container with no logic has no behaviour that can break for different reasons.' },
        { q: 'How do you answer "but then I have more files"?', a: 'More small, focused files are read and tested faster than one big one. The real cost is not the number of files but how many you have to open to understand or change something.' }
      ],
      out: 'An actor-class table in docs/design.md and at least one class split by actor.',
      file: 'docs/design.md'
    },
    {
      t: 'OCP: open for extension, closed for modification',
      obj: 'Add a new case without editing code that already works.',
      why: 'Every time you edit a tested class you risk breaking it. OCP is the concrete technique for growing without putting what already runs in production at risk again.',
      study: { r: 3, what: 'Read Robert C. Martin’s article on OCP. About 10 minutes. Look for one thing: how a switch on type becomes polymorphism, and why that lets you add behaviour without touching code that already works.',
        pasos: [
          'Read the article up to "Is this Absurd?" (~4 min): what open for extension and closed for modification mean.',
          'Read "Is this Absurd?" (~2 min): the typical objection and its answer.',
          'Read "Plugin Architecture" (~3 min): the plugin example is OCP in its purest form.',
          'Read "Conclusion" (~1 min).',
          'Pick the longest switch on type in your code and write which interface and which classes would come out of it.'
        ] },
      ex: { title: 'From switch to strategies', body: `CLOSED TO GROWTH (every new fee edits this method)

public decimal Calculate(ServiceType type, decimal basePrice)
{
    switch (type)
    {
        case ServiceType.Consultation: return basePrice;
        case ServiceType.Emergency:    return basePrice * 1.5m;
        case ServiceType.Vaccination:  return basePrice * 0.9m;
        default: throw new ArgumentException();
    }
}

OPEN TO GROWTH

// Careful: this is not week 6's IPriceRule. There the rules
// were chained; here each fee decides the whole price.
public interface IFee
{
    bool AppliesTo(ServiceType type);
    decimal Calculate(decimal basePrice);
}

public class EmergencyFee : IFee
{
    public bool AppliesTo(ServiceType t) => t == ServiceType.Emergency;
    public decimal Calculate(decimal basePrice) => basePrice * 1.5m;
}

public class PriceCalculator
{
    private readonly IEnumerable<IFee> _fees;
    public PriceCalculator(IEnumerable<IFee> fees) => _fees = fees;

    public decimal Calculate(ServiceType type, decimal basePrice)
    {
        var fee = _fees.First(f => f.AppliesTo(type));
        return fee.Calculate(basePrice);
    }
}

Adding "SurgeryFee" is now creating a new file.
PriceCalculator is not touched and its tests stay green.` },
      steps: [
        'Search your code for every switch or chain of ifs that decides based on a type or an enum.',
        'For the largest one, define an interface with the method that varies.',
        'Create one class per branch of the switch.',
        'Let the original class receive the collection of implementations and pick the one that applies.',
        'Add a new branch without touching any existing file. If you manage, you met OCP.'
      ],
      vet: [
        'Apply this to VetCare’s fees: consultation, emergency, vaccination, surgery, grooming.',
        'Add a "post-surgery check-up" fee and check that you only created one file.'
      ],
      edge: [
        'Not every switch deserves polymorphism. If the enum will never grow (days of the week), the switch is clearer.',
        'If no rule applies, decide the behaviour: a clear exception or an explicit default rule. Do not silently return zero.',
        'OCP is applied where you have already seen change happen. Guessing where the system will grow produces useless abstractions.'
      ],
      quiz: [
        { q: 'What does "closed for modification" mean?', a: 'That to add new behaviour you do not need to edit the existing file, only add one. The tested code stays intact and therefore remains trustworthy.' },
        { q: 'What is the sign that OCP is missing?', a: 'That every new requirement of the same kind forces you back to the same switch or the same chain of ifs. That file grows without limit and gathers all the bugs.' },
        { q: 'What drawback does the strategy version have?', a: 'The logic is spread over several files, so reading all the fees at a glance costs more. You pay that readability in exchange for being able to grow without risk.' },
        { q: 'When should you NOT apply OCP?', a: 'When the set of cases is fixed and known, or when you only have two branches and no evidence they will grow. Abstracting too early adds complexity with no benefit.' }
      ],
      out: 'PriceCalculator with interchangeable rules and a new fee added without touching old code.',
      file: 'src/VetCare.Domain/Pricing/'
    },
    {
      t: 'LSP: children must be able to replace the parent',
      obj: 'Detect inheritance that lies and fix it.',
      why: 'LSP is the principle most people recite without understanding. Being able to give the square and rectangle counterexample, and one from your own project, sets you apart.',
      study: { r: 4, what: 'Read the introduction and the "Principle" section. About 10 minutes. Look for one thing: why throwing NotImplementedException in a subclass breaks the principle.',
        pasos: [
          'Read the introduction (~2 min) and the "Principle" section (~4 min): preconditions, postconditions and invariants.',
          'Read "Violation" (~3 min): the classic square and rectangle example.',
          'Write in your own words: a child cannot ask for more than the parent or promise less than the parent.',
          'Apply it to NotImplementedException: the parent promised to do something and the child does not do it. That is why it breaks the principle.'
        ] },
      ex: { title: 'Inheritance that lies', body: `VIOLATION

public class ClinicalDocument
{
    public virtual void Sign(Vet v) { }
    public virtual void Print() { }
}

public class DraftNote : ClinicalDocument
{
    public override void Sign(Vet v)
        => throw new NotSupportedException("A draft is not signed");
}

Any code that receives a ClinicalDocument and calls Sign
will blow up if it is given a draft. The child cannot
replace the parent, so the inheritance is false.

FIX: split by real capability

public abstract class ClinicalDocument
{
    public abstract void Print();
}

public interface ISignable
{
    void Sign(Vet v);
}

public class Prescription : ClinicalDocument, ISignable
{
    public override void Print() { }
    public void Sign(Vet v) { }
}

public class DraftNote : ClinicalDocument
{
    public override void Print() { }
}

Now the type tells the truth: only what is signable is signed.` },
      steps: [
        'Search your code for any override that throws NotImplementedException or NotSupportedException, or that ignores its argument.',
        'Also look for overrides that tighten the precondition (the parent accepts any number and the child demands a positive one).',
        'For each case decide: either the child should not inherit from there, or the parent promises too much.',
        'Move the problematic method to a separate interface and have only the classes that really can do it implement it.',
        'Write a test that receives the base class and works with every subclass. If it passes with all of them, you meet LSP.'
      ],
      vet: [
        'Review your ClinicalDocument -> Prescription, Vaccination, Diagnosis hierarchy from week 6.',
        'Ask for each parent method: can all three subclasses really fulfil it?'
      ],
      edge: [
        'A child can demand less than the parent (accept more inputs) and promise more (guarantee more), never the other way round. That is the formal rule: preconditions equal or weaker, postconditions equal or stronger.',
        'Changing the meaning also breaks LSP: if the parent returns an empty list and the child returns null, the client code fails.',
        'Most LSP violations are fixed by replacing inheritance with composition or with separate interfaces.'
      ],
      quiz: [
        { q: 'State LSP in one useful sentence.', a: 'If the code works with the base class, it must keep working the same when you pass it any subclass, without knowing which one it is or needing extra checks.' },
        { q: 'Why does throwing NotSupportedException in an override break it?', a: 'Because the parent’s contract says the method can be called. The child turns it into a trap and forces the client to ask about the type before calling it, which is exactly what polymorphism was supposed to avoid.' },
        { q: 'Give a sign of an LSP violation without looking at exceptions.', a: 'An if that asks for the concrete type before using the object, for example "if (doc is Prescription)". If you need to know which subclass it is, the abstraction is not helping you.' },
        { q: 'How does LSP relate to test design?', a: 'You can write a battery of tests against the base class and run it with each subclass. If one fails, that subclass breaks LSP and should leave the hierarchy.' }
      ],
      out: 'A clinical document hierarchy with no overrides that throw, with ISignable split out.',
      file: 'src/VetCare.Domain/Clinic/'
    },
    {
      t: 'ISP and DIP (weekly exam)',
      obj: 'Close SOLID with small interfaces and inverted dependencies, and defend the whole design.',
      why: 'ISP and DIP are what you see most in real .NET code: interfaces per use case and everything wired up in Program.cs. Ending the week explaining it out loud makes the learning stick.',
      study: { r: 0, what: 'Read the sections "Dependency inversion" and "Explicit dependencies". About 12 minutes. Look for one thing: why the high-level module defines the interface.',
        pasos: [
          'Read "Dependency inversion" (~5 min) and look at the diagram with the inverted arrows.',
          'Read "Explicit dependencies" (~3 min): dependencies are visible in the constructor, not hidden inside.',
          'There is no ISP section in this article: remember today’s example and write the rule in one line: no client should depend on methods it does not use.',
          'Go over your notes for the whole week and write one sentence for each letter of SOLID with a VetCare example.'
        ] },
      ex: { title: 'ISP and DIP together', body: `ISP: a fat interface vs interfaces by need

BAD
public interface IRepository
{
    void Save(object e);
    object Find(Guid id);
    void Delete(Guid id);
    List<object> All();
    void Export(string path);
    void Backup();
}

A class that only needs Find is forced to implement Backup
and Export even though they make no sense for it.

GOOD
public interface IReadAppointments
{
    Appointment? ById(Guid id);
    IReadOnlyList<Appointment> ForDay(DateOnly day);
}

public interface ISaveAppointments
{
    void Save(Appointment a);
}

Each consumer asks only for what it uses.

DIP: the direction of the arrow

Without DIP:  Domain  ----> PostgresAppointmentRepository
With DIP:     Domain  ----> IAppointmentRepository
                                 ^
                                 |
              Infrastructure ----+

The interface lives in Domain. Infrastructure implements it.
The domain never knows PostgreSQL exists.

Wiring in the API's Program.cs (you will create it in week 12):

builder.Services.AddScoped<IAppointmentRepository, PostgresAppointmentRepository>();
builder.Services.AddScoped<INotifier>(
    _ => new EmailNotifier("appointments@vetcare.local"));

(The second line uses a function because EmailNotifier takes
a string in its constructor, and the container does not
know which string to give it.)` },
      steps: [
        'Review your interfaces and split any that has more than five methods or methods nobody uses together.',
        'Rename the interfaces after what the client needs, not the technology: IReadAppointments, not ISqlRepo.',
        'Draw in docs/design.md the arrow diagram between Domain, Infrastructure and the entry layer.',
        'Check the golden rule: no arrow leaves Domain going outwards.',
        'Prepare your oral defence: one sentence for each letter of SOLID with a concrete VetCare example.'
      ],
      vet: [
        'Leave a final section "SOLID in VetCare" in docs/design.md with the five principles and where each one shows in your code.',
        'Explain the design out loud in five minutes, without reading, as if it were an interview.',
        'Press "Mark for review" and reread docs/design.md in a week.'
      ],
      edge: [
        'One interface per method is excessive: group what is always used together.',
        'DIP does not mean "put interfaces everywhere". It means policy does not depend on detail.',
        'If your Program.cs has 200 service registrations, it is not a DIP mistake; it is a sign that modules to group the registration are missing.'
      ],
      quiz: [
        { q: 'What concrete problem does ISP solve?', a: 'It stops a class from having to implement methods that do not belong to it just because they live in the same interface. That produces empty implementations or ones that throw, which in turn break LSP.' },
        { q: 'Who should define the interface according to DIP and why?', a: 'The high-level module that consumes it, because the interface expresses what it needs. If the detail defines it, the high level ends up adapting to the technology and the inversion does not happen.' },
        { q: 'How are ISP and LSP related?', a: 'An interface that is too big forces partial implementations that throw, and that is exactly an LSP violation. Splitting the interface removes both violations at once.' },
        { q: 'Summarise in one sentence what SOLID is for.', a: 'To make the cost of a future change proportional to the size of the change and not to the size of the system: each piece has one topic, depends on contracts and not details, and grows by adding files instead of editing the ones that already work.' }
      ],
      out: 'docs/design.md complete with the actor table, the dependency diagram and a SOLID in VetCare section.',
      file: 'docs/design.md'
    }
  ]
}
]);
