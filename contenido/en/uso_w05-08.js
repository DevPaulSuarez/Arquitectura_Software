/* What each day is for in a real job, why it matters
   and what to ask (the client, the team or the tech lead) to apply it.
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.USO = Object.assign(window.EN.USO || {}, {

/* ---------- Week 5 · Classes, objects and encapsulation ---------- */

'w5d1': {
  sirve: 'Going from the model to classes is the first real code of any project: the domain written in C#. At work, the project structure you create that day (Domain, Infrastructure, Api) is inherited by everyone who comes afterwards.',
  importa: 'Domain classes are the heart of the system and what lasts longest. If they are born as meaningless bags of data, all later code is written around that mistake and it is very hard to turn around.',
  preguntas: [
    { a: 'The tech lead', q: 'What project and folder structure does the team use for the domain?', obt: 'The team’s convention (project names, namespaces, where each thing goes) so you do not invent your own.' },
    { a: 'The tech lead', q: 'Do domain classes have names in English or in another language?', obt: 'The code’s language rule. Mixing languages in the same project is a constant source of confusion.' },
    { a: 'A teammate', q: 'Is there an existing class I should look at as an example?', obt: 'A real reference for the team’s style, much more useful than any generic guide.' }
  ],
  evita: { q: 'How do I create a class in C#?', por: 'That is in the documentation and you waste your teammate’s time. Ask about team decisions you cannot look up on the internet.' }
},

'w5d2': {
  sirve: 'Choosing between field and property, and between public, private or init, is deciding who can read and change each piece of data. It is something you review in every pull request.',
  importa: 'A public setter in the wrong place lets any part of the code change the state without going through the rules. That is how "I don’t know who changed this" bugs appear, which are the most expensive to track down.',
  preguntas: [
    { a: 'The tech lead', q: 'Which properties of Pet should be able to change after creating it and which not?', obt: 'Which data is immutable (date of birth, species) and which changes through methods with rules (weight, owner).' },
    { a: 'In a code review', q: 'Why does this property have a public set? Who changes it?', obt: 'The justification, or the warning that it should be closed and a method with a business name exposed.' },
    { a: 'The vet', q: 'Once a pet’s species is recorded, can it be corrected? Who does it?', obt: 'Whether the data can be corrected, by whom and with what record, which decides its access level.' }
  ],
  evita: { q: 'Shall I put get and set on everything and change it later?', por: 'That "later" never comes. Ask who should be able to change each piece of data and why, and start closed.' }
},

'w5d3': {
  sirve: 'Putting behaviour inside the classes (appointment.Cancel(reason) instead of appointment.Status = "cancelled") makes the rules live next to the data. It is the difference between a rich domain and an anaemic one.',
  importa: 'If the logic is loose in controllers and services, the same rule ends up copied in five places with five variations. When it changes, four are updated and the fifth becomes a bug in production.',
  preguntas: [
    { a: 'The receptionist', q: 'What steps do you follow when you cancel an appointment? Do you tell anyone, free anything up?', obt: 'Everything the Cancel method must do, not just changing a status.' },
    { a: 'The tech lead', q: 'Where is the logic for cancelling an appointment today? Is there more than one place?', obt: 'A map of the duplicated logic worth moving inside the entity.' },
    { a: 'In a code review', q: 'Does this check belong to the controller or to the entity?', obt: 'A criterion: if it is a business rule it goes in the domain; if it is input format it goes at the edge.' }
  ],
  evita: { q: 'Shall I make an AppointmentService with all the methods?', por: 'It leads straight to the anaemic domain. Ask what business actions an appointment has and whether any needs something external to the appointment itself.' }
},

'w5d4': {
  sirve: 'A constructor that requires everything necessary prevents half-built objects. At work it means you never again have to check whether a pet is missing its species.',
  importa: 'An object that can exist in an invalid state forces validation everywhere "just in case". With strict constructors, validation is done once and all the rest of the code can trust it.',
  preguntas: [
    { a: 'The vet', q: 'What is the minimum you have to know about a pet to be able to treat it?', obt: 'The constructor’s required parameters, decided by the business.' },
    { a: 'The tech lead', q: 'How does EF Core build our entities if the constructor has required parameters?', obt: 'The team’s pattern (private constructor for the ORM, public constructor with rules) so persistence does not break.' },
    { a: 'In a code review', q: 'Can this object exist without this data, even for a moment?', obt: 'Spotting two-step initialisations that leave the object invalid in between.' }
  ],
  evita: { q: 'Shall I leave an empty constructor to make it easier?', por: 'Easier to create and harder to maintain. Ask which data is essential for the object to make sense.' }
},

'w5d5': {
  sirve: 'Auditing encapsulation is looking for every path by which someone can break the state from outside: exposed lists, open setters, modifiable collections. It is a review done before the domain grows.',
  importa: 'Exposing a public List<Vaccine> lets vaccines be added without going through the schedule rules. A gap like that looks innocent and is exactly the one used in the year’s most serious bug.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we expose collections as IReadOnlyCollection across the whole domain?', obt: 'The team’s convention for collections, which closes the most common encapsulation gap.' },
    { a: 'A teammate', q: 'Can you try to leave an appointment in an impossible state using only its public interface?', obt: 'A practical test of encapsulation from outside, as another developer in a hurry would do it.' },
    { a: 'In a code review', q: 'Why does this method return the internal list instead of a copy or a read-only view?', obt: 'Fixing the gap before it is used from somewhere else.' }
  ],
  evita: { q: 'Do we need so much private if the team is small?', por: 'The team grows and the code stays. Ask which rules can be bypassed today with the current code.' }
},

'w5d6': {
  sirve: 'Proving with code that the invariants cannot be violated is what gives the team confidence to touch the domain. It is the basis of the unit tests you will see later.',
  importa: 'Saying "the rules are protected" is worth nothing if it cannot be run. A program that tries to break every rule and fails is proof anyone can repeat.',
  preguntas: [
    { a: 'The tech lead', q: 'Which domain invariant worries you most that someone might break without noticing?', obt: 'The priority rule to prove first.' },
    { a: 'The vet', q: 'If the system allowed this situation, what consequence would it have for an animal?', obt: 'The real impact of each invariant, which helps prioritise and explain why it is protected.' },
    { a: 'A teammate', q: 'Run this program and try to add a case that violates a rule without the error firing.', obt: 'A second pair of eyes trying to break what you consider closed.' }
  ],
  evita: { q: 'If it compiles, is it protected?', por: 'Compiling does not prove business rules. Ask how you would show that violating the rule is impossible.' }
},

/* ---------- Week 6 · Abstraction, interfaces and polymorphism ---------- */

'w6d1': {
  sirve: 'Abstracting is hiding details that may change (the email provider, SMS, file storage) behind a stable contract. At work it lets you switch provider without touching the business.',
  importa: 'When the SMS provider raises prices or disappears, a good abstraction turns the migration into a one-class change. Without it, it is weeks hunting for calls all over the code.',
  preguntas: [
    { a: 'The tech lead', q: 'Which external services do we use that could change in the next year?', obt: 'The list of volatile details that deserve to be behind an abstraction.' },
    { a: 'The clinic owner', q: 'How do you prefer to notify clients: email, SMS or WhatsApp? Could it change?', obt: 'Whether the channel is stable or variable, which decides whether abstracting it is worth it.' },
    { a: 'In a code review', q: 'Does this interface hide something that can really change, or is it abstraction for its own sake?', obt: 'A brake on unnecessary abstractions that only add files.' }
  ],
  evita: { q: 'Shall I put an interface on every class?', por: 'That is noise, not design. Ask which parts can change independently; only those need abstraction.' }
},

'w6d2': {
  sirve: 'An interface with two real implementations (email and SMS, or real and test) is what lets you change behaviour by configuration and test without external services.',
  importa: 'If an interface has a single implementation and will never have another, it is surplus. If it really has two, it shows the contract is well designed and does not leak details of a specific implementation.',
  preguntas: [
    { a: 'The tech lead', q: 'Does this interface have methods that only make sense for email?', obt: 'Spotting contracts that leak details of one implementation (subject, HTML) and prevent others.' },
    { a: 'A teammate', q: 'How do you choose at startup which implementation to use in each environment?', obt: 'The way the team configures implementations per environment (development, testing, production).' },
    { a: 'QA', q: 'Would a fake implementation that keeps messages in memory for you to check be useful?', obt: 'A real use for the second implementation: testing without sending real SMS.' }
  ],
  evita: { q: 'How is an interface implemented?', por: 'It is syntax and you find it in two minutes. Ask whether the contract works for all the implementations you imagine.' }
},

'w6d3': {
  sirve: 'Composing (an Invoice that receives a list of price rules) instead of inheriting (InvoiceWithDiscountAndUrgency) is the usual way to combine behaviours without a class explosion.',
  importa: 'Inheritance to combine variants grows exponentially: every new combination is a new class. Composition grows linearly. It is one of the decisions that most distinguishes a maintainable design from one that has to be rewritten.',
  preguntas: [
    { a: 'The clinic owner', q: 'What discounts and surcharges exist and can they be combined with each other?', obt: 'The list of variations and whether they combine. If they combine, composition is the answer.' },
    { a: 'The tech lead', q: 'Where do we have inheritance hierarchies more than two levels deep?', obt: 'Candidates for refactoring to composition.' },
    { a: 'In a code review', q: 'If a new kind of discount appears tomorrow, how many classes have to be created or touched?', obt: 'The practical measure of whether the design scales: one new class is fine, five is bad.' }
  ],
  evita: { q: 'Inheritance or composition, which is better?', por: 'Without context there is no answer. Ask how the behaviours will vary and combine and the answer comes by itself.' }
},

'w6d4': {
  sirve: 'Inheritance does fit when there is a real, stable "is a" relationship with common behaviour (a base ClinicalDocument from which Prescription and Certificate come). Knowing when to use it is as important as knowing when not to.',
  importa: 'Misused inheritance chains classes that should not depend on each other: you change the parent and children you did not even know existed break. The rules (abstract parent, little depth, seal what is not extended) avoid that domino effect.',
  preguntas: [
    { a: 'The vet', q: 'What do all the documents you issue have in common: prescriptions, certificates, reports?', obt: 'The shared behaviour and data that justify a base class.' },
    { a: 'The tech lead', q: 'Do we seal classes by default in this project?', obt: 'The convention on sealed, which avoids accidental inheritance.' },
    { a: 'In a code review', q: 'Does this child use everything it inherits, or does it override methods to leave them empty?', obt: 'The sign that inheritance is forced and needs rethinking.' }
  ],
  evita: { q: 'Can I inherit from this class to reuse a method?', por: 'Reusing code is not a reason to inherit. Ask whether the child "is a" parent in every case.' }
},

'w6d5': {
  sirve: 'Polymorphism replaces switches by type ("if it’s a prescription do this, if it’s a certificate do that") with objects that know how to behave. At work it removes conditionals repeated all over the code.',
  importa: 'Every switch by type is a place you have to remember to update when adding a new type. When there are ten, one is always forgotten, and that omission is a bug that only shows up with the new type.',
  preguntas: [
    { a: 'The tech lead', q: 'How many switches or ifs by document type are there in the code?', obt: 'The size of the problem and the places that would benefit from polymorphism.' },
    { a: 'The clinic owner', q: 'Do you expect new kinds of documents or services to appear?', obt: 'Whether the list is stable (a switch is fine) or will grow (it deserves polymorphism).' },
    { a: 'In a code review', q: 'If I add a new type, does the compiler warn me about every place I must touch?', obt: 'A practical test of whether the design depends on the programmer’s memory.' }
  ],
  evita: { q: 'Shall I remove every if from the code?', por: 'Not every if is bad. Ask which ones decide based on an object’s type and are repeated in several places.' }
},

'w6d6': {
  sirve: 'Refactoring a whole domain and justifying each decision is what you do when a module starts to hurt. It is also what you are asked to explain in a mid-level technical interview.',
  importa: 'Refactoring without justification turns the code into the taste of whoever touched it last. Justifying each change with a principle and a specific benefit is what convinces the team and the tech lead to accept it.',
  preguntas: [
    { a: 'The tech lead', q: 'Which part of the domain scares you most to touch right now?', obt: 'The place where the refactor adds most value.' },
    { a: 'The tech lead', q: 'Do you prefer this refactor in one big PR or in several small ones?', obt: 'The way of delivering the team can review without getting blocked.' },
    { a: 'A teammate', q: 'Do you understand why I changed this without me explaining it?', obt: 'Whether the new code explains itself or a name or comment is missing.' }
  ],
  evita: { q: 'Can I redo the whole domain?', por: 'It sounds like risk without a clear benefit. Present the specific problem, the proposed change and how you will check nothing breaks.' }
},

/* ---------- Week 7 · Cohesion, coupling and SOLID ---------- */

'w7d1': {
  sirve: 'Measuring cohesion lets you look at a 600-line class and explain with judgement what is wrong with it and how to split it. It is what a senior does in a code review.',
  importa: 'Catch-all classes are where bugs pile up: everyone touches them, for different reasons, and every change breaks something unrelated. Spotting them early stops them becoming untouchable.',
  preguntas: [
    { a: 'The tech lead', q: 'Which class in the project is modified in almost every pull request?', obt: 'The number one candidate for low cohesion.' },
    { a: 'In a code review', q: 'Can you describe this class in one sentence without using "and"?', obt: 'A quick cohesion test anyone understands.' },
    { a: 'A teammate', q: 'Which methods of this class use fields the others do not use?', obt: 'The groups of methods that are really another class.' }
  ],
  evita: { q: 'Is this class too big?', por: 'Size is not the problem. Ask whether all its methods talk about the same topic and use the same data.' }
},

'w7d2': {
  sirve: 'Reducing coupling is what lets you change one part of the system without breaking others. At work you notice it when a small change costs an hour instead of three days.',
  importa: 'Strong coupling means you cannot test without a real database, or switch provider without touching the business. It is the number one reason teams are afraid of touching the code.',
  preguntas: [
    { a: 'The tech lead', q: 'Which module, if you change it, forces you to touch more files than you expected?', obt: 'The project’s most painful coupling point.' },
    { a: 'In a code review', q: 'Why does this domain class do new on an infrastructure class?', obt: 'An accidental coupling solved with an interface and injection.' },
    { a: 'A teammate', q: 'Can you test this class without starting the database?', obt: 'The most practical coupling test: if you cannot, it is too tied.' }
  ],
  evita: { q: 'How do I remove all the dependencies?', por: 'Zero coupling is impossible. Ask which dependencies are accidental and which are necessary.' }
},

'w7d3': {
  sirve: 'The single responsibility principle is applied by asking who requests changes: if the accountant and the vet request changes in the same class, it has two responsibilities.',
  importa: 'When two different people request changes in the same class, sooner or later one’s change breaks what the other uses. SRP stops an improvement in billing from breaking the medical record.',
  preguntas: [
    { a: 'The clinic owner', q: 'Who asks you for changes to the reports and who to the medical records?', obt: 'The different actors requesting changes, which mark the responsibility boundaries.' },
    { a: 'The tech lead', q: 'Did this class change in the last month for reasons coming from two different departments?', obt: 'Evidence in the git history of a class with several responsibilities.' },
    { a: 'In a code review', q: 'If the tax rule changes, does this class have to change?', obt: 'A concrete test of whether the class mixes responsibilities.' }
  ],
  evita: { q: 'Does SRP mean each class does only one thing?', por: 'It is the most common wrong interpretation. Ask who requests the changes, which is what SRP really measures.' }
},

'w7d4': {
  sirve: 'Open/closed means being able to add a new case (a new kind of discount) by creating new code, without editing what already works and is tested.',
  importa: 'Every time you edit working code you risk breaking it. A design open to extension reduces that risk precisely in the areas that change most.',
  preguntas: [
    { a: 'The clinic owner', q: 'How often do new promotions, prices or kinds of service appear?', obt: 'Where the frequent change is, which is where OCP pays off.' },
    { a: 'The tech lead', q: 'Which file has to be edited every time a new case is added?', obt: 'The point that violates OCP and is worth turning into an extension.' },
    { a: 'In a code review', q: 'Does this change add a case or modify the logic of the existing cases?', obt: 'Whether the design already allows extending or every novelty touches what is tested.' }
  ],
  evita: { q: 'Shall I make everything extensible just in case?', por: 'Premature extensibility complicates without benefit. Ask where there have really been repeated changes.' }
},

'w7d5': {
  sirve: 'Liskov detects inheritance that lies: a child that cannot substitute for the parent without breaking something. At work it shows up when a subtype throws NotImplementedException or ignores parameters.',
  importa: 'If a subtype does not honour the parent’s contract, all the code relying on that contract fails unpredictably and only with that subtype. They are very hard bugs to find because the code "looks" correct.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we have subclasses that throw NotImplementedException in inherited methods?', obt: 'Obvious Liskov violations worth redesigning.' },
    { a: 'The vet', q: 'Does an emergency consultation follow all the rules of a normal consultation or skip some?', obt: 'Whether the emergency really "is a" consultation or deserves another model.' },
    { a: 'In a code review', q: 'If I substitute this child for the parent in all the parent’s tests, do they pass?', obt: 'The practical Liskov test.' }
  ],
  evita: { q: 'Is a square a rectangle?', por: 'It is the textbook example and does not help with your code. Ask about cases in your domain where a subtype behaves differently.' }
},

'w7d6': {
  sirve: 'Small interfaces and inverted dependencies are what keep the domain from depending on the database or frameworks. It is the design expected in any professional .NET team.',
  importa: 'With the domain depending on abstractions, you can change the database, the web framework or the email provider without touching the business rules. Also, defending SOLID with your own code is a common interview question.',
  preguntas: [
    { a: 'The tech lead', q: 'Does the domain project have any reference to EF Core, ASP.NET or another framework?', obt: 'Whether dependency inversion really holds or only in theory.' },
    { a: 'In a code review', q: 'Does this class use all the methods of the interface it receives?', obt: 'Spotting fat interfaces worth splitting (ISP).' },
    { a: 'The architect', q: 'Who defines the interfaces: the domain that uses them or the infrastructure that implements them?', obt: 'The rule that the abstraction belongs to whoever consumes it.' }
  ],
  evita: { q: 'Do we follow SOLID?', por: 'A yes or no question that leads nowhere. Ask about a specific principle in a specific class.' }
},

/* ---------- Week 8 · Patterns and dependency injection ---------- */

'w8d1': {
  sirve: 'Dependency injection is passing a class what it needs through the constructor instead of it creating it. It is the basis of how any modern .NET application is written.',
  importa: 'Understanding DI by hand stops you using the container as black magic. When something fails at startup, whoever knows what the container does fixes it in minutes; whoever does not loses the afternoon.',
  preguntas: [
    { a: 'The tech lead', q: 'Are there classes in the project that create their dependencies with new instead of receiving them?', obt: 'The points that prevent testing and switching implementations.' },
    { a: 'A teammate', q: 'Does this class receive too many constructor parameters?', obt: 'A sign the class does too much (more than four or five dependencies usually is).' },
    { a: 'In a code review', q: 'Why is a service locator used here instead of constructor injection?', obt: 'Spotting hidden dependencies that make the class hard to understand and test.' }
  ],
  evita: { q: 'Which DI container is the best?', por: 'The tool matters less than the concept. Ask what dependencies a class has and who should create them.' }
},

'w8d2': {
  sirve: 'Choosing between singleton, scoped and transient decides how long each service lives. In ASP.NET Core, the DbContext is scoped per request, an HTTP client is usually a singleton, etc.',
  importa: 'A wrong lifetime produces serious bugs: a singleton DbContext shared between requests mixes data from different users and fails under concurrency. They are errors that do not show in development and blow up under real load.',
  preguntas: [
    { a: 'The tech lead', q: 'Does this service keep state between calls? Is it safe to share between threads?', obt: 'The two criteria that decide whether it can be a singleton.' },
    { a: 'In a code review', q: 'Is there a singleton that receives a scoped service?', obt: 'The captive dependency, a classic mistake ASP.NET detects in development if validation is turned on.' },
    { a: 'A teammate', q: 'Do we have the container’s scope validation turned on in development?', obt: 'Whether the team gets automatic warnings of lifetime mistakes.' }
  ],
  evita: { q: 'Shall I make everything a singleton so it goes faster?', por: 'You gain microseconds and risk data crossing between users. Ask whether the service has state and whether it is thread-safe.' }
},

'w8d3': {
  sirve: 'Strategy encapsulates interchangeable algorithms (price calculation by kind of client, for example). Naming the pattern lets the team recognise it and use it the same way throughout the code.',
  importa: 'Pattern names are shared vocabulary: saying "it’s a Strategy" saves ten minutes of explanation in a review. It is also one of the patterns most asked about in interviews.',
  preguntas: [
    { a: 'The clinic owner', q: 'Do prices change depending on the kind of client, pet or time of day?', obt: 'The axes of variation that can become strategies.' },
    { a: 'The tech lead', q: 'How do we choose the strategy: by configuration, by request data or by user?', obt: 'The selection mechanism, which often ends up in a Factory.' },
    { a: 'In a code review', q: 'Does this strategy need state or can it be a stateless function?', obt: 'Whether a delegate is enough or a full class is needed.' }
  ],
  evita: { q: 'Where can I put a Strategy?', por: 'Looking for where to put a pattern is designing backwards. Ask which algorithm changes depending on the case; if there is one, the pattern appears.' }
},

'w8d4': {
  sirve: 'A Factory centralises the decision of which object to create based on the input data. At work it stops that creation logic being spread across controllers and services.',
  importa: 'If the decision of what to create is copied in several places, adding a new type requires finding them all. A Factory leaves a single point to change and test.',
  preguntas: [
    { a: 'The tech lead', q: 'Where do we decide today which kind of document to create based on the consultation?', obt: 'The places where creation is duplicated and worth centralising.' },
    { a: 'The vet', q: 'Which consultation data determines whether a prescription, a certificate or a report is issued?', obt: 'The exact rules that will go inside the Factory.' },
    { a: 'In a code review', q: 'Does this Factory only decide what to create or does it also have business logic?', obt: 'Keeping the Factory focused on creation.' }
  ],
  evita: { q: 'Shall I make a Factory for every class?', por: 'It is only needed when creation depends on data or is complex. Ask whether there is a repeated "what to create" decision.' }
},

'w8d5': {
  sirve: 'An Adapter wraps an external library or API (an SMS provider, a payment gateway) so your domain talks to it in your own language.',
  importa: 'External APIs change version, shape and sometimes provider. Without an Adapter, that change leaks into the whole system; with one, it is fixed in a single class.',
  preguntas: [
    { a: 'The tech lead', q: 'Which third-party SDKs are used directly from the domain or the controllers?', obt: 'The points where an Adapter is missing.' },
    { a: 'The external provider or its documentation', q: 'What errors does the API return, with which codes, and how often does it change version?', obt: 'What the Adapter must translate into your domain’s errors.' },
    { a: 'In a code review', q: 'Does any type from the external SDK escape outside the Adapter?', obt: 'Spotting leaks that tie your code to the library.' }
  ],
  evita: { q: 'Shall I use the SDK directly, it’s quicker?', por: 'It is quicker today and more expensive tomorrow. Ask what happens if the provider has to change.' }
},

'w8d6': {
  sirve: 'The Repository hides how aggregates are stored so the domain only sees "give me the pet" and "save the appointment". Knowing when to use each pattern is what is valued in a design review.',
  importa: 'Using patterns where they are not needed complicates as much as not using them where they are. Being able to defend why you used Repository here and not there shows judgement, which is what distinguishes a senior.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we use repositories on top of EF Core or the DbContext directly?', obt: 'The team’s position and its reasons; some teams do each for good reasons.' },
    { a: 'In a code review', q: 'Does this repository return IQueryable or already materialised results?', obt: 'Whether the abstraction leaks outwards or is properly closed.' },
    { a: 'The architect', q: 'Which of the patterns we use seems surplus to you?', obt: 'An experienced opinion on the project’s unnecessary complexity.' }
  ],
  evita: { q: 'Shall I make a generic repository for every entity?', por: 'The generic one exposes operations many aggregates should not have. Ask which operations each aggregate needs.' }
}

});
