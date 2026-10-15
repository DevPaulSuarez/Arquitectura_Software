/* Glossary: the technical name of things you probably already did.
   t: term · en: alternative name or abbreviation (hidden when equal to t) · def: what it is
   ya: where you did it without knowing the name · dilo: how to say it in an interview · dia: day of the path where it is studied. */
window.EN = window.EN || {};
window.EN.GLOSARIO = (window.EN.GLOSARIO || []).concat([

/* ---------- Requirements ---------- */

{ t: 'Problem statement', en: 'Business problem', dia: 'w1d1',
  def: 'The description of the real pain the software must remove, without mentioning any technology.',
  ya: 'When you were asked for "a button to export to Excel" and you asked "what do you need it for?" until you found out they really wanted the monthly report in five minutes.',
  dilo: '"Before choosing the technology I write the problem in one sentence, so I do not build the wrong solution."' },

{ t: 'Stakeholder', en: 'Stakeholder', dia: 'w1d2',
  def: 'Anyone affected by the system: who uses it, who pays for it, who approves it and who suffers its effects.',
  ya: 'When a project got complicated because the boss wanted one thing, the user another and accounting a third, and you had to get them to agree.',
  dilo: '"I map the stakeholders and look for their conflicts early, because whoever has veto power can kill a system that works."' },

{ t: 'Functional requirement', en: 'FR', dia: 'w1d3',
  def: 'Something the system must DO, written so it can be checked.',
  ya: 'Every Jira ticket like "the user can filter orders by date". You did it every day; this is the formal name.',
  dilo: '"A well-written functional requirement has a verifiable result; if I cannot write a test for it, it is still a wish."' },

{ t: 'Non-functional requirement', en: 'NFR', dia: 'w1d4',
  def: 'HOW WELL the system must work: speed, availability, security, capacity. Always with numbers.',
  ya: 'When you were told "it has to load fast" or "it cannot go down during office hours". Those were non-functional requirements, just without a number.',
  dilo: '"Non-functional requirements decide the architecture; that is why I turn them from adjectives into numbers: under 1 s at p95, not "fast"."' },

{ t: 'Business rule', en: 'Business rule', dia: 'w1d5',
  def: 'A policy the business follows even if no software exists: "no vaccinating before 8 weeks".',
  ya: 'Those ifs where you asked the client "is it always like this or are there exceptions?": discounts, deadlines, limits. That logic is the business rule.',
  dilo: '"I separate business rules from screens so they live in one place and can be changed and tested without touching the interface."' },

{ t: 'Acceptance criteria', en: 'Gherkin', dia: 'w1d6',
  def: 'The concrete conditions that must hold for a story to count as done, often in Given / When / Then format.',
  ya: 'When QA sent a task back because "it did not do what was asked" and you argued about what done meant. Acceptance criteria avoid that argument.',
  dilo: '"I write the criteria before coding; if they all pass, the story is done and there is no argument."' },

{ t: 'Leading question', en: 'Leading question', dia: 'w2d1',
  def: 'A question that suggests the answer ("wouldn’t it be handy if…?") and therefore teaches you nothing new.',
  ya: 'When you proposed a solution in a meeting, the client said yes out of politeness and it later turned out they did not use it.',
  dilo: '"In interviews I ask about past facts ("tell me about the last time…") instead of wishes, so I do not hear my own idea back."' },

{ t: 'Assumption', en: 'Assumption', dia: 'w2d2',
  def: 'Something you take as true without having confirmed it. It is written down and numbered so it can be validated.',
  ya: 'Every time you thought "surely it is a single site" and coded it that way. It was an implicit assumption; writing it down makes it explicit.',
  dilo: '"I write down the assumptions and sort them by risk: I validate first the one that would make me redo the most work if it were false."' },

{ t: 'Scope creep', en: 'Scope creep', dia: 'w2d3',
  def: 'Uncontrolled growth of scope: "just one more thing", again and again, until the project never ends.',
  ya: 'Those "two-week" projects that lasted four months because every meeting added something.',
  dilo: '"I control it with written non-goals and MoSCoW prioritisation; whatever comes in, comes in with something going out."' },

{ t: 'MoSCoW', en: 'MoSCoW prioritization', dia: 'w2d3',
  def: 'Classifying requirements into Must (essential), Should (important), Could (nice to have) and Won\'t (not this version).',
  ya: 'When you decided with your boss what went into the first release and what was left "for phase 2".',
  dilo: '"If the Musts go over 60 % of the effort, I cut. That way the first version really ships."' },

{ t: 'Use case', en: 'Use case', dia: 'w2d4',
  def: 'The step-by-step description of an interaction between an actor and the system, including the alternative and error paths.',
  ya: 'When you wrote in a document or in your head "the user does this, the system answers that… and what if there is no stock?".',
  dilo: '"The happy path is the minority of the work; the alternative flows are where the bugs are, so I write them before coding."' },

{ t: 'User story', en: 'User story', dia: 'w2d5',
  def: 'A need told from the user’s side: "As a [role], I want [action], so that [benefit]".',
  ya: 'The cards on the sprint board. If you worked with Scrum, you wrote or received hundreds.',
  dilo: '"A story must deliver value on its own and fit in a few days; if not, I split it by flow or by rule."' },

{ t: 'INVEST', en: 'INVEST', dia: 'w2d5',
  def: 'Checklist for stories: Independent, Negotiable, Valuable, Estimable, Small and Testable.',
  ya: 'When someone in refinement said "this is too big" or "this depends on the other thing": they were applying INVEST without naming it.',
  dilo: '"I run every story through INVEST; the S and the T are the ones that fail most in practice."' },

{ t: 'Ubiquitous language', en: 'Ubiquitous language', dia: 'w2d6',
  def: 'Using the same words, with the same meaning, in conversations with the business, in documents and in code.',
  ya: 'When the client said "order" and in the code it was called "purchase" in one place and "request" in another, and there were constant misunderstandings.',
  dilo: '"I keep a domain glossary and name classes the way the business does; that way a conversation translates straight into code."' },

/* ---------- Domain and data modelling ---------- */

{ t: 'Entity', en: 'Entity', dia: 'w3d1',
  def: 'Something with its own identity that stays even if its data changes: a pet is still the same pet even if its weight changes.',
  ya: 'Every table with an id and every class you stored in the database: Customer, Order, Product.',
  dilo: '"Something is an entity if I need to follow its history over time; if I only care about its value, it is a value object."' },

{ t: 'Value object', en: 'Value object', dia: 'w3d4',
  def: 'An object defined only by its value, with no identity, usually immutable and with its rules inside: Money, Email, TimeRange.',
  ya: 'When you validated the email in five different places, or passed a decimal that could be kilos or grams. A value object solves exactly that.',
  dilo: '"I use value objects so an invalid state cannot even be represented: a negative Weight does not compile or cannot be built."' },

{ t: 'Identity vs equality', en: 'Identity vs equality', dia: 'w3d3',
  def: 'Two entities are the same if they have the same id, even if their data matches another one’s. Two values are equal if their data matches.',
  ya: 'When you found duplicate customers with the same data and had to decide whether they were the same person.',
  dilo: '"Entities are compared by id; value objects, by value. Mixing them up produces duplicates or wrong merges."' },

{ t: 'Cardinality', en: 'Cardinality (1:1, 1:N, N:N)', dia: 'w3d5',
  def: 'How many items on one side relate to how many on the other: one to one, one to many or many to many.',
  ya: 'Every time you decided whether to add a foreign key or create an intermediate table.',
  dilo: '"I validate cardinality by looking for real exceptions in the business; the one that looks 1:N often turns out to be N:N."' },

{ t: 'ERD', en: 'Entity-Relationship Diagram', dia: 'w3d6',
  def: 'The diagram of entities and relationships: the blueprint of the system’s data.',
  ya: 'The diagram your database tool generated, or the one you drew on a whiteboard before creating the tables.',
  dilo: '"I validate the ERD by walking real stories through it, not just checking that the boxes look right."' },

{ t: 'Foreign key', en: 'FK', dia: 'w4d1',
  def: 'A column that points to another table’s id and that the database guarantees exists. It goes on the "many" side.',
  ya: 'The customer_id in the orders table. You always used it; the new part is choosing the ON DELETE with judgement.',
  dilo: '"I choose RESTRICT, CASCADE or SET NULL based on the business rule, not by default; for sensitive data, RESTRICT."' },

{ t: 'Join table', en: 'Associative entity', dia: 'w4d2',
  def: 'The table that resolves a many-to-many relationship, and that often has data of its own (date, quantity, batch).',
  ya: 'The order_product table with quantity and price. Or, worse, when someone stored comma-separated ids in a column.',
  dilo: '"If the relationship has attributes or repeats over time, the join table is an entity with its own id."' },

{ t: 'Referential integrity', en: 'Referential integrity', dia: 'w4d3',
  def: 'The guarantee that every reference points to something that exists: there are no orders from non-existent customers.',
  ya: 'Those "violates foreign key constraint" errors when deleting something. That was the database protecting you.',
  dilo: '"Integrity is guaranteed by the database with constraints, not only by code, because more things than my application write to the database."' },

{ t: 'Constraint', en: 'Constraint (CHECK, UNIQUE, NOT NULL)', dia: 'w9d2',
  def: 'A rule the database enforces on its own and that rejects any data breaking it.',
  ya: 'Every NOT NULL and every UNIQUE you added. CHECK is their lesser-known sibling: "weight > 0".',
  dilo: '"I name constraints (ck_, uq_, fk_) so the error says which rule broke and I can turn it into a useful message."' },

{ t: 'Normalization', en: 'Normalization (1NF, 2NF, 3NF)', dia: 'w4d4',
  def: 'Organising tables so each piece of data lives in a single place and there are no copies that contradict each other.',
  ya: 'When the customer’s phone was copied onto every order and changing it left different versions around.',
  dilo: '"I normalise up to 3NF and denormalise on purpose only historical data, like the price charged, which must not change if the fee changes."' },

{ t: 'Invariant', en: 'Invariant', dia: 'w4d5',
  def: 'A condition that must hold ALWAYS: "a vet does not have two appointments at the same time".',
  ya: 'Those validations you had to remember to copy into every place that touched a piece of data. A well-protected invariant lives in a single place.',
  dilo: '"Every invariant has an owner: an aggregate or a database constraint. If it can be skipped by some path, it is not protected."' },

{ t: 'Aggregate', en: 'Aggregate (DDD)', dia: 'w4d5',
  def: 'A group of objects that are changed together through a root, to protect their invariants in one transaction.',
  ya: 'An order with its lines: you never saved a loose line, always the whole order.',
  dilo: '"Aggregates reference each other by id, not by object, and a transaction changes only one; that keeps the boundaries clear."' },

/* ---------- C# and OOP ---------- */

{ t: 'Encapsulation', en: 'Encapsulation', dia: 'w5d5',
  def: 'Hiding internal state and exposing only operations with business names that respect the rules.',
  ya: 'When a "I don’t know who changed this value" bug forced you to look for every public setter in the project.',
  dilo: '"I close setters and collections and expose methods like Cancel(reason); that way the rules cannot be skipped from outside."' },

{ t: 'Anemic domain model', en: 'Anemic domain model', dia: 'w5d3',
  def: 'Classes that only hold data (get and set) while all the logic lives in separate services.',
  ya: 'Projects with empty entities and a 2,000-line OrderService. It is very common; it has an anti-pattern name.',
  dilo: '"I move behaviour into the entity: appointment.Cancel() instead of appointment.Status = "cancelled" from a service."' },

{ t: 'Factory method', en: 'Factory method', dia: 'w5d4',
  def: 'A static method with a business name that creates a valid object: Appointment.Schedule(…) instead of new Appointment(…).',
  ya: 'When you had several constructors and it was not clear which one to use in each case.',
  dilo: '"I use named factories when there are several ways to create an object or when creating it has rules."' },

{ t: 'Abstraction', en: 'Abstraction', dia: 'w6d1',
  def: 'Keeping the essentials and hiding the details that may change behind a contract.',
  ya: 'When changing email provider forced you to touch twenty files and you thought "there should be a layer in between".',
  dilo: '"I abstract what may change provider or what I need to replace in tests; nothing else."' },

{ t: 'Interface', en: 'Interface', dia: 'w6d2',
  def: 'A contract that says WHAT can be done without saying HOW; several classes can fulfil it differently.',
  ya: 'All those ISomethingService you created because "that is how it is done". Their real point is being able to have two interchangeable implementations.',
  dilo: '"An interface with a single implementation that will never have another is usually unnecessary; I justify it with a second real use, even if it is testing."' },

{ t: 'Composition over inheritance', en: 'Composition over inheritance', dia: 'w6d3',
  def: 'Combining behaviours by joining small objects instead of creating class hierarchies.',
  ya: 'When subclasses multiplied (AdminUserWithDiscount, NormalUserWithDiscount…) and each new combination was another class.',
  dilo: '"With inheritance, variants grow by multiplying; with composition, by adding. That is why I compose when there are axes that combine."' },

{ t: 'Polymorphism', en: 'Polymorphism', dia: 'w6d5',
  def: 'Different objects answering the same message each in their own way, removing switches on type.',
  ya: 'When you replaced a giant switch with classes implementing the same method. Or when you suffered that switch copied in five places.',
  dilo: '"If adding a new type forces me to hunt for switches in the code, the design depends on my memory; with polymorphism, the compiler warns me."' },

{ t: 'Sealed class', en: 'Sealed class', dia: 'w6d4',
  def: 'A class nobody can inherit from. In C# it is marked with sealed.',
  ya: 'You probably never used it, and that is the lesson: inheriting should be a decision, not the default option.',
  dilo: '"I seal the leaves of my hierarchies; inheriting from something not designed for it creates fragile dependencies."' },

/* ---------- Design and SOLID ---------- */

{ t: 'Cohesion', en: 'Cohesion', dia: 'w7d1',
  def: 'How much the things living in the same class or module have to do with each other. High cohesion = a single topic.',
  ya: 'The Helper, Utils or Manager classes where everything you did not know where to put ended up. That is low cohesion.',
  dilo: '"I spot low cohesion by checking whether the methods use the same fields; if they form separate groups, they are two classes."' },

{ t: 'Coupling', en: 'Coupling', dia: 'w7d2',
  def: 'How much one piece depends on another: if changing A forces you to change B, they are coupled.',
  ya: 'That "small" change that ended up touching fifteen files. Or the class you could not test without starting the database.',
  dilo: '"Coupling decides whether a change costs an hour or three days; I reduce it by depending on interfaces, not on concrete classes."' },

{ t: 'SRP · Single responsibility', en: 'Single Responsibility Principle', dia: 'w7d3',
  def: 'A class should have a single reason to change, that is, answer to a single business actor.',
  ya: 'When a change requested by accounting broke something sales used, because it was in the same class.',
  dilo: '"SRP is not "do one thing", it is "a single actor asks for changes here"; I split by who asks for the changes."' },

{ t: 'OCP · Open/closed', en: 'Open/Closed Principle', dia: 'w7d4',
  def: 'Being able to add new behaviour by writing new code, without editing the code that already works.',
  ya: 'Every time you added another case to the fees switch and prayed not to break the earlier ones.',
  dilo: '"I apply OCP where change is frequent, like fees: a new rule is a new class, without touching the existing ones."' },

{ t: 'LSP · Liskov substitution', en: 'Liskov Substitution Principle', dia: 'w7d5',
  def: 'A child must be usable in place of the parent without anything breaking.',
  ya: 'That override that threw NotImplementedException because "that subclass does not support it".',
  dilo: '"If a child throws NotImplemented or demands more than the parent, the inheritance is lying; I move that method to a separate interface."' },

{ t: 'ISP · Interface segregation', en: 'Interface Segregation Principle', dia: 'w7d6',
  def: 'No client should depend on methods it does not use: several small interfaces are better than one huge one.',
  ya: 'The 25-method IRepository you half-implemented in tests.',
  dilo: '"I split interfaces by who uses them: IReadAppointments for reports, IAppointmentRepository for writes."' },

{ t: 'DIP · Dependency inversion', en: 'Dependency Inversion Principle', dia: 'w7d6',
  def: 'The important code (the business) does not depend on details (database, email); both depend on abstractions the business defines.',
  ya: 'When you separated the logic from data access with an interface and the implementation ended up in another project.',
  dilo: '"In my solution, the domain project references nothing from infrastructure; the arrows always point towards the domain."' },

/* ---------- Patterns ---------- */

{ t: 'Dependency injection', en: 'DI', dia: 'w8d1',
  def: 'Giving a class what it needs (through the constructor) instead of it creating it with new.',
  ya: 'All the constructors with parameters like ILogger or IRepository in ASP.NET. You used it daily; DI is just that, no magic.',
  dilo: '"DI is passing collaborators through the constructor; the container only automates assembling the object graph."' },

{ t: 'Service lifetimes', en: 'Singleton, scoped, transient', dia: 'w8d2',
  def: 'How long each service lives in the container: the whole application, one request or every time it is asked for.',
  ya: 'That AddScoped or AddSingleton you copied from another registration without thinking much.',
  dilo: '"The DbContext is scoped per request; a singleton must never receive a scoped one (captive dependency), and I turn on ValidateScopes to catch it."' },

{ t: 'Strategy pattern', en: 'Strategy pattern', dia: 'w8d3',
  def: 'Encapsulating interchangeable algorithms behind the same interface and picking one depending on the case.',
  ya: 'When you had different ways to calculate a price or a shipment and split them into classes.',
  dilo: '"I use Strategy when a decision changes with business policy; whoever uses it does not know which concrete strategy it gets."' },

{ t: 'Factory pattern', en: 'Factory pattern', dia: 'w8d4',
  def: 'Centralising in a single place the decision of which object to create based on some data.',
  ya: 'That if/else deciding which kind of document or notification to create, copied across several controllers.',
  dilo: '"The factory is the only place allowed to switch on type; the rest of the code asks and receives."' },

{ t: 'Adapter pattern', en: 'Adapter pattern', dia: 'w8d5',
  def: 'Wrapping an external library or API so your code talks to it in your own language.',
  ya: 'When you created a class wrapping the payments or email SDK so you did not use it directly all over the code.',
  dilo: '"The adapter translates the provider’s types and errors into my domain’s; changing provider means changing one class."' },

{ t: 'Repository pattern', en: 'Repository pattern', dia: 'w8d6',
  def: 'An apparent collection of aggregates that hides how they are stored: "give me the appointment", "save the appointment".',
  ya: 'The IXxxRepository found in almost every .NET project you worked on.',
  dilo: '"My repositories expose intention-revealing methods and never IQueryable; if they expose it, the database leaks out of the repository."' }

]);
