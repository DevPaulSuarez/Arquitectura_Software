window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 4, phase: 'Domain modelling', title: 'Relationships, integrity and normalisation',
  idea: 'Badly modelled relationships do not fail on day one: they fail the day you have 10,000 rows and discover the same data lives in three places and all three say something different.',
  res: [
    { t: 'Wikipedia — Database normalization', u: 'https://en.wikipedia.org/wiki/Database_normalization', note: 'Read only 1NF, 2NF and 3NF. The higher forms are almost never used in practice.' },
    { t: 'PostgreSQL — Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html', note: 'Official docs for PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK and NOT NULL.' },
    { t: 'Mermaid — ER diagrams', u: 'https://mermaid.js.org/syntax/entityRelationshipDiagram.html', note: 'To update your ERD this week.' },
    { t: 'Martin Fowler — Aggregate / DDD', u: 'https://martinfowler.com/bliki/DDD_Aggregate.html', note: 'What an aggregate is and why it defines the consistency boundary.' }
  ],
  days: [
    {
      t: '1:1 and 1:N relationships',
      obj: 'Implement VetCare’s one-to-one and one-to-many relationships correctly, deciding where the foreign key lives.',
      why: 'The question "which table does the foreign key go in" looks trivial and decides whether your queries will be simple or a hell of joins. It is one of the most practical modelling decisions.',
      study: { r: 1, what: 'Read the "Foreign Keys" section of the PostgreSQL docs (~10 min). Pay special attention to ON DELETE and ON UPDATE.',
        pasos: [
          'Read "Foreign Keys" from the start up to the orders and products example (~5 min).',
          'Keep reading the part on ON DELETE and ON UPDATE (~4 min) and note what RESTRICT, NO ACTION, CASCADE, SET NULL and SET DEFAULT do.',
          'Notice the note about creating an index on the referencing column: PostgreSQL does not create it for you.',
          'For each relationship write the sentence: if I delete X, what must happen to its Ys? The answer decides the policy.'
        ] },
      ex: {
        title: 'Where the foreign key goes',
        body: `1:N RULE -> the FK ALWAYS goes on the "many" side.

  OWNER (1) ---- (N) PET

  pet.owner_id -> owner.id          RIGHT
  owner.pet_id                      IMPOSSIBLE: an owner
                                    has several pets, they
                                    do not fit in one column.

1:1 RULE -> the FK goes on the OPTIONAL side, or the one
            queried less often.

  APPOINTMENT (1) ---- (0..1) VISIT

  visit.appointment_id -> appointment.id   RIGHT: the visit
                                           may not exist yet.
  appointment.visit_id                     BAD: most
                                           appointments would
                                           have NULL.

  Careful: for it to really be 1:1, visit.appointment_id
  needs UNIQUE. Without it, an appointment could have two
  visits (1:N):

    appointment_id uuid UNIQUE REFERENCES appointment(id)

  No NOT NULL, because an emergency has no appointment
  (week 3).

Resulting SQL:

  CREATE TABLE pet (
    id         uuid PRIMARY KEY,
    name       varchar(60) NOT NULL,
    owner_id   uuid NOT NULL REFERENCES owner(id)
                 ON DELETE RESTRICT
  );

ON DELETE RESTRICT = do not allow deleting an owner who
still has pets. In VetCare that is right: you protect the
history.`
      },
      steps: [
        'List all your 1:1 and 1:N relationships and write which table the FK goes in and why.',
        'For each FK choose the ON DELETE policy: RESTRICT, CASCADE or SET NULL, and justify it with a business rule.',
        'Write the CREATE TABLE for 3 of your entities with the FKs already in place.'
      ],
      vet: [
        'Create database/schema-draft.sql with the CREATE TABLE statements for your main entities.',
        'Add a table to docs/domain-model.md: relationship, where the FK goes, deletion policy, reason.'
      ],
      edge: [
        'CASCADE is convenient and dangerous: deleting an owner would delete their pets and with them the medical history you are legally required to keep.',
        'A true 1:1 relationship is rare. If one shows up, ask why it is not a single table: it is usually separation for performance or for security.'
      ],
      quiz: [
        { q: 'In a 1:N relationship, which side does the foreign key go on and why?', a: 'On the "many" side. Because a column holds only one value: pet.owner_id can point to its single owner, but owner could not store N pets in one column.' },
        { q: 'When would you use ON DELETE CASCADE and when RESTRICT?', a: 'CASCADE when the child makes no sense without the parent and has no historical value (the lines of a deleted shopping cart). RESTRICT when the child has value of its own or legal value, like VetCare’s medical history.' },
        { q: 'What does ON DELETE SET NULL mean and when is it useful?', a: 'That when the parent is deleted, the child’s FK becomes null. It is useful when the relationship is optional and the child makes sense without the parent: if a consulting room is removed, the appointment keeps everything else and only loses the room. Do not use it with vets: you would lose who attended each appointment. There the right answer is soft deletion.' },
        { q: 'Why is a 1:1 relationship usually suspicious?', a: 'Because normally both sides could be in the same table. If they are separate there must be an explicit reason: very large columns that are rarely queried, sensitive data with different permissions, or a different life cycle.' }
      ],
      out: 'database/schema-draft.sql with 3+ CREATE TABLE statements and a table of justified deletion policies.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'N:N relationships and join tables',
      obj: 'Model VetCare’s many-to-many relationships with join tables that carry their own data.',
      why: 'A join table is almost never just two columns. Discovering that it needs its own attributes is the moment you realise it was a business entity in disguise.',
      study: { r: 1, what: 'Reread composite PRIMARY KEY and UNIQUE in the constraints docs (~8 min).',
        pasos: [
          'Reread "Primary Keys" (~3 min), paying attention to multi-column keys.',
          'Reread "Unique Constraints" (~3 min): how to prevent duplicates of a pair of columns.',
          'Go back to "Foreign Keys" and find the order_items example: it is exactly a join table (~2 min).',
          'For each N:N ask: can the same pair repeat on different dates? If so, it needs its own Id.'
        ] },
      ex: {
        title: 'The join table that turns out to be an entity',
        body: `Relationship: a PET receives many TREATMENTS,
and a TREATMENT is given to many PETS.

FIRST ATTEMPT (dumb join table):
  CREATE TABLE pet_treatment (
    pet_id         uuid REFERENCES pet(id),
    treatment_id   uuid REFERENCES treatment(id),
    PRIMARY KEY (pet_id, treatment_id)
  );

But the business asks: when was it given? What dose?
Which vet gave it? Was it repeated the following month?

The composite PK prevents repeating the same treatment.
And that is false: a pet can get the same vaccine every
year.

SECOND ATTEMPT (it is a real entity):
  CREATE TABLE treatment_application (
    id             uuid PRIMARY KEY,
    pet_id         uuid NOT NULL REFERENCES pet(id),
    treatment_id   uuid NOT NULL REFERENCES treatment(id),
    vet_id         uuid NOT NULL REFERENCES vet(id),
    applied_on     date NOT NULL,
    dose_mg        decimal(8,2),
    UNIQUE (pet_id, treatment_id, applied_on)
  );

Now it has its own Id, its own attributes and a business
name. I stop calling it a "join table": it is an entity.`
      },
      steps: [
        'Find all of VetCare’s N:N relationships (you should have at least 2).',
        'For each one ask: does the relationship have its own attributes? Can it repeat over time?',
        'Write the CREATE TABLE: a composite PK if it is a pure relationship, its own Id if it has a life of its own.'
      ],
      vet: [
        'Add the N:N tables to database/schema-draft.sql.',
        'Update the ERD in docs/domain-model.md with the new entities you discovered.'
      ],
      edge: [
        'If the relationship can repeat over time, a two-column composite PK is a bug waiting to happen: it will stop you recording next year’s vaccine.',
        'A join table with a technical name (pet_treatment) almost always has a better business name (TreatmentApplication, Prescription).'
      ],
      quiz: [
        { q: 'Why does an N:N relationship need a third table?', a: 'Because a column cannot hold multiple references. The join table turns the N:N relationship into two 1:N relationships, which can be represented with foreign keys.' },
        { q: 'When should the join table have its own Id instead of a composite PK?', a: 'When the relationship has its own attributes, can repeat over time, or needs to be referenced by another table. At that point it stops being a link and becomes a domain entity.' },
        { q: 'What problem does a composite PK (pet_id, treatment_id) cause?', a: 'It prevents recording the same combination twice, which is false for recurring treatments like yearly vaccines. The right constraint would include the date.' },
        { q: 'How do you spot that a join table is really a business entity?', a: 'If the user has a name for it ("the vaccine application", "the prescription") and wants to query, list or change it on its own, it is a full entity.' }
      ],
      out: 'N:N tables in schema-draft.sql, with a reasoned decision between composite PK and own Id.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Referential integrity and constraints',
      obj: 'Armour the model with constraints so the database rejects impossible data on its own.',
      why: 'Any validation that lives only in the code can be bypassed: by a script, by another app, by a bug. The database is the last line of defence and never forgets to validate.',
      study: { r: 1, what: 'Read the whole constraints page (~15 min): CHECK, NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, EXCLUDE.',
        pasos: [
          'Read "Check Constraints" (~4 min): notice how to name a constraint with CONSTRAINT name.',
          'Read "Not-Null Constraints" and "Unique Constraints" (~4 min).',
          'Read "Primary Keys" and go over "Foreign Keys" again (~4 min).',
          'Read "Exclusion Constraints" (~2 min) just to know they exist: you will use them in week 10 for appointments that do not overlap.',
          'Open psql and try a CHECK that fails on purpose to see the error message with the constraint’s name.'
        ] },
      ex: {
        title: 'Constraints that turn business rules into guarantees',
        body: `Your business rules from week 1, now in SQL:

  CREATE TABLE appointment (
    id             uuid PRIMARY KEY,
    pet_id         uuid NOT NULL REFERENCES pet(id),
    vet_id         uuid NOT NULL REFERENCES vet(id),
    starts_at      timestamptz NOT NULL,
    ends_at        timestamptz NOT NULL,
    status         varchar(20) NOT NULL DEFAULT 'CONFIRMED',

    -- BR: the appointment ends after it starts
    CONSTRAINT ck_appointment_range CHECK (ends_at > starts_at),

    -- BR: only valid statuses
    CONSTRAINT ck_appointment_status CHECK (
      status IN ('CONFIRMED','CANCELLED','ATTENDED')
    ),

    -- BR: a vet does not have two appointments at once
    CONSTRAINT uq_vet_slot UNIQUE (vet_id, starts_at)
  );

What you gained:
 - Impossible to save an appointment that ends before it
   starts, from the API, from a script or by hand.
 - Impossible to have a made-up status like 'CONFIRMD'.
 - An exact time clash (same vet, same start time) is
   rejected by the database even if two requests arrive in
   the same millisecond. Application code alone cannot
   guarantee that.`
      },
      steps: [
        'Go through your business rules BR-01..BR-08 and mark which ones can be expressed as a constraint.',
        'Add the corresponding CHECK, UNIQUE and NOT NULL to your schema, with explicit names (ck_, uq_, fk_).',
        'Write 5 INSERTs that MUST fail and note which constraint rejects each one.'
      ],
      vet: [
        'Complete database/schema-draft.sql with all the named constraints.',
        'Create database/invalid-inserts.sql with the 5 INSERTs that must be rejected, each commented with the rule it breaks.'
      ],
      edge: [
        'Always name your constraints. An error "violates constraint ck_appointment_range" can be diagnosed; one with an auto-generated name cannot.',
        'UNIQUE (vet_id, starts_at) only prevents the exact clash. For partial overlaps you need an EXCLUDE constraint with ranges, which you will see in week 10.'
      ],
      quiz: [
        { q: 'Why is validating in the application code not enough?', a: 'Because the database receives writes from more places: migration scripts, another application, support fixing data by hand, or a race condition between two simultaneous requests. The constraint covers all those cases.' },
        { q: 'What is the difference between an application validation and a constraint?', a: 'The application one gives the user a good error message and is flexible. The constraint is the hard, unbreakable guarantee. You use both: the first for UX, the second for integrity.' },
        { q: 'Why is it important to name constraints?', a: 'Because the name appears in the error. With an explicit name you can map the database error to a useful message for the user; with an auto-generated one you can only show a generic error.' },
        { q: 'What is referential integrity?', a: 'The guarantee that every foreign key points to a row that exists. Without it you end up with appointments for ghost pets, which are impossible bugs to reproduce because the data is already gone.' }
      ],
      out: 'A schema with named constraints + 5 invalid INSERTs documented with the rule they break.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Normalisation 1NF, 2NF and 3NF',
      obj: 'Normalise VetCare’s schema up to 3NF and be able to explain when it is worth breaking it on purpose.',
      why: 'Normalising is the antidote to duplicated data that goes out of sync. And knowing when NOT to normalise is what separates someone who understood it from someone who memorised it.',
      study: { r: 0, what: 'Read only the 1NF, 2NF and 3NF sections (~15 min). Ignore BCNF and higher for now. Key idea: each normal form removes one specific kind of duplication.',
        pasos: [
          'Read "Objectives" (~3 min): which problems normalising avoids (insertion, update and deletion anomalies).',
          'In "Example", read "Initial data" and "Satisfying 1NF" (~4 min): why a cell with several values is a problem.',
          'Read "Satisfying 2NF" (~4 min): columns that depend on only part of the key.',
          'Read "Satisfying 3NF" (~4 min): transitive dependencies. Stop here: you do not need the other normal forms today.',
          'Write in your own words, in one line each, what 1NF, 2NF and 3NF remove.'
        ] },
      ex: {
        title: 'From a flat table to 3NF',
        body: `UNNORMALISED TABLE (what comes out of a spreadsheet):

 appt_id | pet     | owner_phones     | vet   | vet_specialty
 --------|---------|------------------|-------|--------------
 1       | Rocky   | 555-11, 555-22   | Ana   | Surgery
 2       | Whiskers| 555-33           | Ana   | Surgery

PROBLEM 1 (breaks 1NF): owner_phones has several values
in one cell. You cannot search by phone number.
 -> Fix: a phone table (id, owner_id, number).

PROBLEM 2 (breaks 3NF): vet_specialty depends on vet, not
on the appointment. It is a transitive dependency:
appointment -> vet -> specialty.
 -> Fix: the specialty lives in the vet table and the
    appointment stores vet_id.
The same happens with "pet": the name depends on the pet,
not on the appointment. If it changes name, you would have
to update all its appointments.
 -> Fix: the appointment stores pet_id, not the name.

AND 2NF? It can only be broken when the key has SEVERAL
columns. This table's key is appt_id (a single column), so
it meets 2NF automatically. An example with a composite key:

 vaccine_plan (pet_id, vaccine_id, doses_pending,
               pet_species)
 PK = (pet_id, vaccine_id)

PROBLEM 3 (breaks 2NF): pet_species depends only on pet_id,
which is PART of the key, not the whole key.
 -> Fix: the species lives in the pet table.

RESULT: each piece of data lives in ONE place. If it
changes, it changes once.

WHEN TO BREAK IT ON PURPOSE (denormalise):
On the invoice you store the treatment price COPIED, not
referenced. Because if the price goes up tomorrow, last
year's invoice must not change. Here the duplication is not
a mistake: it is a requirement.`
      },
      steps: [
        'Review your schema looking for: cells with several values, columns that do not depend on the whole key, and transitive dependencies.',
        'Fix each violation and note which normal form you were breaking.',
        'Find a case in VetCare where denormalising is the RIGHT thing to do and justify it.'
      ],
      vet: [
        'Update database/schema-draft.sql with the normalised schema.',
        'Add the section "7. Normalisation" to docs/domain-model.md: which violations you found and the deliberate denormalisation case.'
      ],
      edge: [
        'A free-text "notes" field does not break 1NF even if it contains commas. 1NF is about values the system needs to handle separately.',
        'Normalising to the maximum can give schemas with 15 joins for one screen. Normalise by default and denormalise with a measured reason, not a hunch.'
      ],
      quiz: [
        { q: 'What problem exactly does 1NF solve?', a: 'Multiple values in a single cell. Without 1NF you cannot query, index or validate those values separately: finding "who has the number 555-22" becomes a LIKE over text.' },
        { q: 'What is a transitive dependency and which normal form removes it?', a: 'When a field depends on another non-key field, which in turn depends on the key (appointment -> vet -> specialty). 3NF removes it by moving the field to the table it really depends on.' },
        { q: 'Give a case where denormalising is right.', a: 'Copying the price into the invoice line instead of referencing the catalogue. If the price changes tomorrow, the historical invoice must keep that day’s price. The duplicated data is a historical fact, not a copy.' },
        { q: 'What is the real risk of an unnormalised schema?', a: 'Update anomalies: you change the data in one place and not in another, and the system starts contradicting itself. They are silent bugs discovered months later, with the data already corrupted.' }
      ],
      out: 'A schema in 3NF + a section documenting the violations fixed and a justified denormalisation case.',
      file: 'database/schema-draft.sql'
    },
    {
      t: 'Invariants and aggregates',
      obj: 'Define which rules must always hold in VetCare and which group of entities protects them.',
      why: 'An aggregate defines the consistency boundary: what is saved together, what is locked together and what can be out of sync without harm. It is the decision that most shapes your transactions.',
      study: { r: 3, what: 'Read Fowler’s DDD_Aggregate (~10 min). Key idea: the aggregate has a root, and nobody touches the internal parts without going through it.',
        pasos: [
          'Read Fowler’s whole article (~8 min).',
          'Underline the definition of the aggregate root and the rule that external references only point to the root.',
          'Notice the part about transactions: an aggregate is the unit that is saved whole or not at all.',
          'Optional (~4 min): in the Microsoft article from week 3 read the part on the Aggregate pattern to see it applied in .NET.'
        ] },
      ex: {
        title: 'Invariants and boundaries in VetCare',
        body: `INVARIANT = something that must ALWAYS be true, at any
moment someone looks at the data.

 INV-01 An appointment cannot overlap another one for the
        same vet.
 INV-02 A pet always has exactly one responsible owner.
 INV-03 An invoice's total is the sum of its lines.

AGGREGATE = the group of objects saved and validated as a
unit, with a root that controls access.

  INVOICE aggregate (root: Invoice)
    Invoice
      InvoiceLine (internal)
      InvoiceLine (internal)

  Nobody creates a loose InvoiceLine. You ask the invoice:
  invoice.AddLine(...). That way the invoice can recalculate
  the total and keep INV-03.

  APPOINTMENT aggregate (root: Appointment) -- references
  pet and vet BY ID, not by the whole object.

  Careful with INV-01: it compares SEVERAL appointments, so
  no single Appointment aggregate can protect it alone. The
  database protects it with a constraint (week 10).

RULE OF THUMB:
 - Inside an aggregate: immediate consistency, in the same
   transaction.
 - Between aggregates: eventual consistency, by Id.

Small aggregates = fewer locks = more scalable.`
      },
      steps: [
        'Write 5 VetCare invariants: things that must always be true.',
        'Group your entities into 3-4 aggregates and name the root of each one.',
        'For each invariant say which aggregate protects it and whether it is validated inside a transaction or not.'
      ],
      vet: [
        'Add the section "8. Invariants and aggregates" to docs/domain-model.md.',
        'Draw the aggregates in Mermaid grouping entities, showing which references are internal and which are by Id.'
      ],
      edge: [
        'A giant aggregate covering half the model locks too many rows and kills concurrency. When in doubt, make it smaller.',
        'If an invariant crosses two aggregates, do not force it into one transaction: accept it as eventual consistency or rethink the boundaries.'
      ],
      quiz: [
        { q: 'What is a domain invariant?', a: 'A condition that must be true at every observable moment, not only at the end of an operation. If there is an instant when an outside observer can see the data broken, the invariant is not being kept.' },
        { q: 'Why are references between aggregates made by Id?', a: 'To keep the consistency boundary small. If Appointment loaded the whole Pet object, it would be easy to modify it from there and break Pet’s rules without going through its root.' },
        { q: 'What do I gain by making aggregates small?', a: 'Shorter transactions, fewer locked rows, fewer concurrency conflicts and better scalability. The price is accepting that some things are eventually consistent rather than instantly.' },
        { q: 'How does the aggregate root protect its invariants?', a: 'By being the only entry point. The internal parts are not created or changed directly: you call methods on the root, which validates and recalculates what is needed before allowing the change.' }
      ],
      out: '5 documented invariants, 3-4 aggregates with their root, and a boundaries diagram.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Revised ERD (weekly exam)',
      obj: 'Deliver VetCare’s final data model and defend every structural decision.',
      why: 'From next week you start writing C# against this model. Every mistake left here you will pay for, multiplied, in code, tests and migrations.',
      study: { r: 0, what: 'No new reading. Reread domain-model.md and schema-draft.sql end to end looking for inconsistencies between them.',
        pasos: [
          'Read the "Normal forms" table (~2 min) only to remember what each form requires up to 3NF.',
          'Open domain-model.md and schema-draft.sql side by side.',
          'For each entity check that it has a table, that its attributes have columns and that every relationship has its FK.',
          'Note each inconsistency in the format: the model says X, the SQL says Y. Then decide which of the two is right.'
        ] },
      ex: {
        title: 'Model review checklist',
        body: `Run your model through these 10 questions. Every
"I don't know" is a pending task, not a philosophical doubt.

 1. Does every entity have an Id with a justified type?
 2. Does every FK have an explicit ON DELETE policy?
 3. Does every business rule in the spec have its
    constraint, or is it documented why it cannot?
 4. Is there any field that could be duplicated and go out
    of sync? Is it justified?
 5. Every N:N table: composite PK or own Id, decided?
 6. Do the names come from the client's glossary?
 7. Is there physical deletion anywhere the legal
    requirement says keep for 5 years?
 8. Does every aggregate have a clear root?
 9. Do the ERD and the SQL say exactly the same thing?
10. Do the 5 stress stories from week 3 still pass after
    this week's changes?

Point 9 fails almost every time. The diagram gets updated
and the SQL does not, or the other way round.`
      },
      steps: [
        'Go through the full 10-point checklist and note the result of each one.',
        'Fix everything that fails, in both the ERD and the SQL, until the two match.',
        'Oral defence with no notes, 5 minutes: explain your entities, why those and not others, and the most debatable decision you made.'
      ],
      vet: [
        'Close docs/domain-model.md and database/schema-draft.sql as version 1 of the model.',
        'Press "Mark for review" and save the checklist result next to the two files.'
      ],
      edge: [
        'If the checklist makes you change things, perfect: that is what it is for. A model that passes the checklist first time usually means you did not look at it seriously.',
        'Write down the decision you feel least sure about. In week 15, when you write your first ADR, that will be the natural candidate.'
      ],
      quiz: [
        { q: 'Why is it critical that the ERD and the SQL say the same thing?', a: 'Because the diagram is what people read to understand the system and the SQL is what actually runs. If they diverge, every decision based on the diagram is made on false information.' },
        { q: 'What does it mean for a model to be "defensible"?', a: 'That for each structural decision you can give the reason and the alternative you discarded. It is not about being perfect, it is about being deliberate.' },
        { q: 'What is the real cost of a modelling mistake discovered late?', a: 'A data migration in production, an API change with clients already connected, rewriting queries and tests, and a risk of data loss. That is why a whole week of modelling is cheap.' },
        { q: 'Summarise weeks 3 and 4 in one idea.', a: 'That the data model is a faithful translation of the language of the business, that it must make invalid states impossible through constraints, and that each piece of data must live in one place unless duplication is an explicit requirement.' }
      ],
      out: 'Model v1 closed: consistent ERD and SQL, 10-point checklist answered and corrected.',
      file: 'docs/domain-model.md'
    }
  ]
},
{
  n: 5, phase: 'C# and OOP', title: 'Classes, objects and encapsulation in C#',
  idea: 'Now the model becomes code. The goal is not that it compiles: it is that it is impossible to create an object in an invalid state.',
  res: [
    { t: 'Microsoft Learn — Objects: create instances of types', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/objects', note: 'What an object is, how it is created and what its identity means.' },
    { t: 'Microsoft Learn — Classes and objects', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes', note: 'Reference for classes, fields, properties and constructors.' },
    { t: 'Microsoft Learn — Properties', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/properties', note: 'Properties, get/set, init and computed properties.' },
    { t: 'Microsoft Learn — C# coding conventions', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions', note: 'The naming conventions expected in any .NET team.' },
    { t: 'Microsoft Learn — Methods', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/methods', note: 'Signature, parameters, return values and passing by value or by reference.' },
    { t: 'Microsoft Learn — Constructors', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/constructors', note: 'Constructors, overloads, this() and primary constructors.' },
    { t: 'Microsoft Learn — Access modifiers', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers', note: 'public, private, protected, internal: the tools of encapsulation.' }
  ],
  days: [
    {
      t: 'Class vs object',
      obj: 'Create the VetCare .NET project and write your first domain classes from the model.',
      why: 'This is the moment your documentation becomes something executable. If the model was right, this is almost mechanical; if it was wrong, you will notice today.',
      study: { r: 1, what: 'Read the C# classes page. About 12 minutes. Key idea: a class is a template, an object is a live instance in memory.',
        pasos: [
          'Read "When to use classes" and "Declare a class" (~4 min).',
          'Read "Create objects" (~3 min): what new does and what the variable really holds.',
          'Skim "Constructors and initialization" (~3 min); you will go deep tomorrow.',
          'Write the Pet class with three properties and create two different objects in a Program.cs.'
        ] },
      ex: {
        title: 'First domain class',
        body: `Create the project (only once):

  dotnet new sln -n VetCare
  dotnet new classlib -o src/VetCare.Domain
  dotnet sln add src/VetCare.Domain

  # console project to try your classes by hand
  dotnet new console -o src/VetCare.Playground
  dotnet sln add src/VetCare.Playground
  dotnet add src/VetCare.Playground reference src/VetCare.Domain

  (With .NET 10 the file is called VetCare.slnx instead of
  VetCare.sln. It works the same.)

src/VetCare.Domain/Pet.cs

  namespace VetCare.Domain;

  public class Pet
  {
      public Guid Id { get; private set; }
      public string Name { get; private set; }
      public Species Species { get; private set; }
      public bool Active { get; private set; }

      public Pet(string name, Species species)
      {
          Id = Guid.NewGuid();
          Name = name;
          Species = species;
          Active = true;
      }
  }

  public enum Species { Dog, Cat, Other }

CLASS = the Pet template; it exists once in the code.
OBJECT = each concrete pet in memory:

  var rocky = new Pet("Rocky", Species.Dog);
  var whiskers = new Pet("Whiskers", Species.Cat);

rocky and whiskers share the class but have their own,
independent state. Changing rocky's name does not affect
whiskers.`
      },
      steps: [
        'Create the solution and the domain project with the commands from the example.',
        'Write 3 classes from your model (for example Pet, Owner and Vet) with their properties.',
        'In src/VetCare.Playground/Program.cs create 2 objects of each class and check that their state is independent. You run it with: dotnet run --project src/VetCare.Playground'
      ],
      vet: [
        'Leave the structure VetCare.sln (or .slnx) + src/VetCare.Domain + src/VetCare.Playground with your first 3 classes.',
        'Run dotnet build and make sure it compiles with no warnings.'
      ],
      edge: [
        'If the compiler complains that Name may be null, do not silence it: it means you did not guarantee it is always assigned. That warning is your friend.',
        'A class that cannot be instantiated without leaving it half done is badly designed. That is the topic for the day after tomorrow.'
      ],
      quiz: [
        { q: 'What is the difference between a class and an object?', a: 'The class is the definition: what data and behaviour it will have. The object is a concrete instance with its own state in memory. One class, many independent objects.' },
        { q: 'Why do the properties have private set in the example?', a: 'So that nobody outside the class can change the state directly. Changes must go through methods that validate the rules. Without that, anyone can leave the object invalid.' },
        { q: 'What do you gain by using enum Species instead of string?', a: 'Invalid values do not compile. With a string you can type "dogg" and the error shows up in production; with an enum the compiler catches it while you type.' },
        { q: 'What is a namespace and what is it for?', a: 'A logical grouping of types that avoids name clashes and communicates structure. VetCare.Domain.Pet makes it clear that the class belongs to the domain and not to the API layer.' }
      ],
      out: 'A .NET project compiling with 3 domain classes and a manual instantiation test.',
      file: 'src/VetCare.Domain/Pet.cs'
    },
    {
      t: 'Properties, fields and state',
      obj: 'Tell fields and properties apart and choose the right access level for each piece of data in your classes.',
      why: 'The difference between a public field and a property with logic is the difference between an object anyone can corrupt and one that protects itself.',
      study: { r: 2, what: 'Read the whole Properties page (~15 min): get, set, init, auto-properties, computed properties and expression-bodied members.',
        pasos: [
          'Read "Automatically implemented properties" (~3 min): the short form { get; set; } and when it is enough.',
          'Read "Field backed properties" and "Properties with backing fields" (~4 min): when you need a private field behind it to validate.',
          'Read "Required properties" (~2 min) and "Expression body definitions" (~2 min): this is how a computed property is written in one line.',
          'Read "Access control" (~2 min): how to make the get public and the set private or init.',
          'Go through each property of Pet and decide: public set, private set, init or computed. Write the reason next to it.'
        ] },
      ex: {
        title: 'Five ways to expose data',
        body: `  public class Pet
  {
      // 1. PRIVATE FIELD: an internal detail, nobody sees it.
      private readonly List<Vaccine> _vaccines = new();

      // 2. AUTO-PROPERTY, read-only from outside.
      public Guid Id { get; private set; }

      // 3. init PROPERTY: set when building and never again.
      public DateTime RegisteredOn { get; init; }

      // 4. COMPUTED PROPERTY: stores nothing, it derives.
      // (on day 3 you will see why it is even better to
      // receive today's date as a parameter than read the clock)
      public int? AgeYears => BirthDate is null
          ? null
          : (int)((DateTime.UtcNow - BirthDate.Value).TotalDays / 365.25);

      public DateTime? BirthDate { get; private set; }

      // 5. EXPOSE A COLLECTION WITHOUT ALLOWING CHANGES
      public IReadOnlyList<Vaccine> Vaccines => _vaccines;
  }

Point 5 is the most common beginner mistake:

  public List<Vaccine> Vaccines { get; set; }   // BAD

With that, anyone can call pet.Vaccines.Clear() and wipe
the history without going through any of your validation.
IReadOnlyList prevents it at compile time.

Point 4 matters too: AgeYears is NOT stored. If you stored
it, tomorrow it would be out of date.
Rule: whatever can be derived, is derived.`
      },
      steps: [
        'Review your 3 classes and make private everything that does not need to be seen from outside.',
        'Change any public collection into a private field + IReadOnlyList.',
        'Add at least one computed property that you were previously going to store as a field.'
      ],
      vet: [
        'Update your classes in src/VetCare.Domain with the right encapsulation.',
        'Write down in docs/notes-csharp.md which fields you decided to expose and which not, with the reason.'
      ],
      edge: [
        'Derived data that is also stored is duplication: sooner or later the stored and the computed values will say different things.',
        'readonly on a collection field protects the reference, not the contents: you can still call Add. That is why you expose it as IReadOnlyList. One more detail: whoever receives that IReadOnlyList could cast it to List and modify it. If you want to close it completely, return _vaccines.AsReadOnly().'
      ],
      quiz: [
        { q: 'Difference between a field and a property?', a: 'A field is a class variable that stores the data. A property is a pair of get/set methods dressed up as data, which let you validate, compute or restrict access without changing how it is used.' },
        { q: 'Why not expose a public List?', a: 'Because it hands full control of the contents to anyone: Add, Remove or Clear run without going through your validation. IReadOnlyList allows reading but forces changes to go through your methods.' },
        { q: 'When should you use init instead of set?', a: 'When the value must be set when building the object and not change afterwards, like a registration date. It gives immutability without forcing a constructor with twenty positional parameters.' },
        { q: 'Why is it better to compute the age than to store it?', a: 'Because stored data stays frozen while time moves on: tomorrow that field lies. Everything that can be derived from other data should be derived when it is read.' }
      ],
      out: 'Classes with correct encapsulation, protected collections and at least one computed property.',
      file: 'src/VetCare.Domain/Pet.cs'
    },
    {
      t: 'Methods and behaviour',
      obj: 'Move business logic inside the domain classes instead of leaving it scattered outside.',
      why: 'An object that has only data and no behaviour is called an anaemic model: it is a structure with a class name, and it forces you to spread the rules all over the system.',
      study: { r: 4, what: 'Read the Methods page (~12 min): signature, parameters, return values, overloading, passing by value and by reference, and expression-bodied members. Look for one thing: what happens when you pass an object to a method and modify it inside.',
        pasos: [
          'Read "Method signatures" and "Method access" (~3 min).',
          'Read "Method parameters vs. arguments" (~2 min).',
          'Read "Passing by reference vs. passing by value" carefully (~4 min): try the example and explain why the object changes even though it is passed by value.',
          'Read "Return values" and "Expression body definitions" (~3 min).',
          'Write the signature (only the signature) of the 3 business methods you are going to move into your classes, with domain names: Vaccinate, Reschedule, Cancel.'
        ] },
      ex: {
        title: 'Anaemic model vs rich model',
        body: `ANAEMIC (the rule lives outside, scattered):

  // in the controller
  if (appointment.Start < DateTime.UtcNow)
      return BadRequest("date in the past");
  appointment.Status = "CANCELLED";

  // and the same rule copied into another service...
  // and forgotten in a third one.

RICH (the rule lives where the data lives):

  public class Appointment
  {
      public AppointmentStatus Status { get; private set; }
      public DateTime Start { get; private set; }
      public DateTime End { get; private set; }
      public Guid VetId { get; private set; }

      public void Cancel(DateTime now)
      {
          if (Status != AppointmentStatus.Confirmed)
              throw new InvalidOperationException(
                  $"Cannot cancel an appointment that is {Status}.");

          if (Start - now < TimeSpan.FromHours(2))
              throw new InvalidOperationException(
                  "Cannot cancel with less than 2h notice.");

          Status = AppointmentStatus.Cancelled;
      }

      public bool OverlapsWith(Appointment other) =>
          VetId == other.VetId &&
          Start < other.End && other.Start < End;
  }

Now BR-01 exists in ONE place. The controller only calls
appointment.Cancel(...) and translates the exception.

Notice the "now" parameter: I do not use DateTime.UtcNow
inside the method. That way the method can be tested with
any date, without waiting two real hours.`
      },
      steps: [
        'Identify 3 business rules you would write outside the class today and move them inside as methods.',
        'Each method must validate first and change the state afterwards, never the other way round.',
        'Move time dependencies out into parameters, like the "now" in the example.'
      ],
      vet: [
        'Add behaviour methods to your classes: Cancel, Reschedule, RegisterVaccine, Deactivate, whatever applies to your model.',
        'Try each method by hand from the console, including the case that must throw an exception.'
      ],
      edge: [
        'If a method changes the state and then validates, it can leave the object broken when it throws. Always validate first.',
        'A method that uses DateTime.Now inside is almost impossible to test. Pass it as a parameter or inject a clock.'
      ],
      quiz: [
        { q: 'What is an anaemic domain model and why is it a problem?', a: 'Classes that only have data and no behaviour. The problem is that the rules end up spread across controllers and services, get duplicated, and when they change they are updated only in some places.' },
        { q: 'Why validate before modifying the state?', a: 'Because if you validate afterwards and throw, the object has already been partly modified. The caller catches the error thinking nothing happened, but the object is corrupt in memory.' },
        { q: 'Why pass "now" as a parameter instead of using DateTime.UtcNow inside?', a: 'To be able to test. With the parameter you write a "cancel with 1 hour of notice" test in milliseconds; with the internal call you would have to tamper with the system clock.' },
        { q: 'Where should a business rule live?', a: 'As close as possible to the data it protects, usually inside the entity or the value object. That way it is impossible to skip, because there is no way to change the data without going through the method.' }
      ],
      out: 'Classes with behaviour methods that encapsulate business rules, tried by hand.',
      file: 'src/VetCare.Domain/Appointment.cs'
    },
    {
      t: 'Constructors',
      obj: 'Design constructors that make it impossible to create an object in an invalid state.',
      why: 'If an object can exist half built, every method that receives it will have to check it is not broken. A good constructor removes hundreds of defensive checks scattered around.',
      study: { r: 5, what: 'Read the Constructors page (~12 min): default constructor, overloads, chaining with this() and primary constructors. Look for one thing: how a constructor can prevent an object from existing in an invalid state.',
        pasos: [
          'Read "Constructor syntax" (~5 min): normal constructor, expression-bodied and primary constructor.',
          'Skim "Static constructors" (~2 min): they initialise the class, not the objects.',
          'Open the C# classes page from day 1 again and reread the part on constructors and initialisation (~3 min).',
          'For each domain class write the list of things the object should not exist without: that is what the constructor must require and validate.'
        ] },
      ex: {
        title: 'A constructor that guarantees validity',
        body: `  public class Pet
  {
      public Guid Id { get; }
      public string Name { get; private set; }
      public Species Species { get; }
      public Guid OwnerId { get; }

      public Pet(string name, Species species, Guid ownerId)
      {
          if (string.IsNullOrWhiteSpace(name))
              throw new ArgumentException(
                  "The name is required.", nameof(name));

          name = name.Trim();   // clean first, then measure
          if (name.Length > 60)
              throw new ArgumentException(
                  "At most 60 characters.", nameof(name));

          if (ownerId == Guid.Empty)
              throw new ArgumentException(
                  "The pet needs an owner.", nameof(ownerId));

          Id = Guid.NewGuid();
          Name = name;
          Species = species;
          OwnerId = ownerId;
      }
  }

AN IMPORTANT CONSEQUENCE:
everywhere else in the system you can write
pet.Name.ToUpper() without checking for null.
If the object exists, it is valid. Full stop.

A FACTORY METHOD when the name adds meaning:

  public static Appointment Schedule(Guid petId, Guid vetId,
                                     DateTime start, TimeSpan dur)
  {
      if (dur <= TimeSpan.Zero)
          throw new ArgumentException("Invalid duration.");
      return new Appointment(petId, vetId, start, start + dur);
  }

Appointment.Schedule(...) reads better than new
Appointment(...) with four parameters whose order nobody
remembers.`
      },
      steps: [
        'Add validation to the constructors of all your domain classes.',
        'Remove the parameterless constructor from the classes where it makes no sense.',
        'Turn at least one constructor into a static factory method with a business name.'
      ],
      vet: [
        'Update src/VetCare.Domain so that no class can be built in an invalid state.',
        'Write 5 invalid construction attempts in the console and check that all of them throw.'
      ],
      edge: [
        'A constructor with more than 5 parameters is a signal: the class probably does too much, or several parameters should be a value object.',
        'Entity Framework Core can use a constructor with parameters if their names match mapped properties. If there is none like that, it needs a parameterless one, and it can be private: EF uses it and your code does not.'
      ],
      quiz: [
        { q: 'Why validate in the constructor and not in a Validate() method?', a: 'Because you have to remember to call a Validate() method, and someone will not. The constructor cannot be skipped: if the object exists, it went through it.' },
        { q: 'What do you gain in the rest of the system with constructors that validate?', a: 'You remove defensive programming. No method needs to check whether the name is null or the Id is empty, because those objects cannot exist.' },
        { q: 'When should you use a static factory method instead of a constructor?', a: 'When the name adds business meaning (Appointment.Schedule, Money.Zero), when there are several ways to create the object that would only differ by types, or when creation may return an existing instance.' },
        { q: 'What is wrong with a constructor that takes 8 parameters?', a: 'It is easy to get the order wrong between parameters of the same type, and the compiler does not warn you. It also usually means the class has too many responsibilities or that value objects grouping related data are missing.' }
      ],
      out: 'All domain classes with validating constructors, and no public parameterless constructor.',
      file: 'src/VetCare.Domain/Pet.cs'
    },
    {
      t: 'Encapsulation',
      obj: 'Audit your classes and close every gap through which someone could break the state from outside.',
      why: 'Encapsulating is not adding private out of habit: it is deliberately deciding what can change, who can change it and under what conditions. It is the reason the system stays correct as it grows.',
      study: { r: 6, what: 'Read the Access Modifiers page (~10 min): public, private, protected, internal and their combinations. Look for one thing: what the default access of a class member is if you write nothing. If you have time left, go over the C# coding conventions.',
        pasos: [
          'Read the "Summary table" (~3 min) and copy it into your notebook: who can see each modifier.',
          'Read "Class and struct accessibility" (~2 min): the default access of a class.',
          'Read "Member accessibility" (~3 min): a member’s default access is private. That is why writing less protects you more.',
          'Find everything that is public in your domain and ask: who outside really needs it? If nobody, lower it to private or internal.'
        ] },
      ex: {
        title: 'Encapsulation audit',
        body: `Look for these 5 holes in your classes:

1. A PUBLIC SETTER that allows invalid states
   public AppointmentStatus Status { get; set; }   // BAD
   -> appointment.Status = Attended without it happening.
   Fix: private set + a MarkAttended() method.

2. AN EXPOSED COLLECTION
   public List<Vaccine> Vaccines { get; set; }      // BAD
   Fix: private field + IReadOnlyList + AddVaccine().

3. A MUTABLE OBJECT RETURNED BY REFERENCE
   public Address Address { get; }                  // careful
   -> if Address has public setters, the caller changes it
      behind your back. Fix: an immutable value object.

4. A PUBLIC METHOD THAT SHOULD NOT BE
   public void RecalculateTotal()                   // BAD
   -> the caller could forget to call it.
   Fix: private, and call it from AddLine().

5. A CONSTRUCTOR THAT DOES NOT VALIDATE
   You fixed that yesterday.

THE FINAL encapsulation test:
"Can I, from outside the class and without reflection, leave
this object in a state that breaks an invariant?"
If the answer is yes, it is not encapsulated yet.`
      },
      steps: [
        'Run the 5-hole audit over all your domain classes.',
        'For each hole, apply the fix and note which invariant you were leaving unprotected.',
        'Apply the C# naming conventions: PascalCase for public members, _camelCase for private fields.'
      ],
      vet: [
        'Leave src/VetCare.Domain with no public setter on any entity.',
        'Write down in docs/notes-csharp.md the holes you found and how you closed them.'
      ],
      edge: [
        'Returning a mutable object from a read-only property is still a hole: the reference is read-only, the object is not.',
        'internal is useful to expose something only inside the same project without opening it to the world. If you also want to use it from the test project, you add the InternalsVisibleTo attribute.'
      ],
      quiz: [
        { q: 'What is the definitive test that a class is encapsulated?', a: 'Try, from outside and without reflection, to leave it in a state that breaks an invariant. If you manage, there is a hole. If no sequence of public calls can break it, it is encapsulated.' },
        { q: 'Why is a public setter on Status dangerous?', a: 'Because it lets you skip the state machine: marking an appointment as Attended without it happening, or reviving a cancelled one. The status must change only through methods that validate the transition.' },
        { q: 'What does it mean when a read-only property returns a mutable object?', a: 'That you protect the reference but not the contents: nobody can replace the object, but anyone can change it inside. The fix is for that object to be immutable.' },
        { q: 'What is internal for?', a: 'To expose a member inside the same assembly but not outside. It is useful for collaboration between classes of the same module or to open something to the tests (with InternalsVisibleTo) without making it part of the public API.' }
      ],
      out: 'An audited domain with no public setters, protected collections and C# conventions applied.',
      file: 'src/VetCare.Domain/'
    },
    {
      t: 'Invariants in code (weekly exam)',
      obj: 'Prove with executable code that your domain’s invariants are impossible to break.',
      why: 'Saying "my classes are well encapsulated" is worth nothing. Proving it with a program that tries to break them and fails every time is.',
      study: { r: 0, what: 'No new material. Reread the invariants you wrote in week 4 day 5 and check which ones are really protected in the code.',
        pasos: [
          'Read "Object identity vs. value equality" (~3 min): it will help you write attacks that compare objects.',
          'Open the invariants you wrote in week 4 day 5.',
          'Next to each invariant write the line of code that protects it (constructor, method or type). If there is none, that invariant is unprotected.',
          'Order the unprotected ones from most to least serious: that is the order in which you fix them today.'
        ] },
      ex: {
        title: 'A program that attacks the domain',
        body: `src/VetCare.Playground/Program.cs

  using VetCare.Domain;

  void Try(string scenario, Action action)
  {
      try
      {
          action();
          Console.WriteLine($"FAIL: '{scenario}' should have been rejected");
      }
      catch (Exception ex)
      {
          Console.WriteLine($"OK: '{scenario}' -> {ex.Message}");
      }
  }

  Try("pet with no name",
      () => new Pet("", Species.Dog, Guid.NewGuid()));

  Try("pet with no owner",
      () => new Pet("Rocky", Species.Dog, Guid.Empty));

  var appointment = Appointment.Schedule(Guid.NewGuid(), Guid.NewGuid(),
                                         DateTime.UtcNow.AddHours(5),
                                         TimeSpan.FromMinutes(30));

  Try("cancel twice", () => {
      appointment.Cancel(DateTime.UtcNow);
      appointment.Cancel(DateTime.UtcNow);
  });

  Try("cancel with 1h of notice", () => {
      var a = Appointment.Schedule(Guid.NewGuid(), Guid.NewGuid(),
                                   DateTime.UtcNow.AddHours(1),
                                   TimeSpan.FromMinutes(30));
      a.Cancel(DateTime.UtcNow);
  });

Expected output: every line starts with OK.
Any FAIL is a real hole in your domain.

In week 13 this same thing will become xUnit tests.
Today it is a console program, and it is already useful.`
      },
      steps: [
        'Use the VetCare.Playground console project you created on day 1 (it already references the domain).',
        'Write one attack attempt for each invariant you defined: at least 8.',
        'Run it and fix the domain until every line comes out OK.'
      ],
      vet: [
        'Leave src/VetCare.Playground/Program.cs with the 8+ attacks and all the output OK.',
        'Press "Mark for review" and save a screenshot of the console output next to the code.'
      ],
      edge: [
        'If an attack comes out FAIL and you do not know how to fix it, do not delete it: record it as technical debt with the invariant number.',
        'An attack that throws NullReferenceException instead of your business exception is also a failure: the message must explain the rule.'
      ],
      quiz: [
        { q: 'Why is a program that tries to break the domain worth more than reading the code?', a: 'Because reading shows you what you believe you wrote; running shows what really happens. Encapsulation holes are exactly the ones you do not see when reading.' },
        { q: 'Why is NullReferenceException a bad sign even though the attempt fails?', a: 'Because it means the object reached an invalid state and blew up by accident, not that your validation rejected it. The message does not explain the rule, and the failure might not happen on another path.' },
        { q: 'What is the difference between this program and an automated test?', a: 'None conceptually: same arrange, act and assert. The difference is that the test runs on its own in every build and fails the pipeline, while this program has to be checked by eye.' },
        { q: 'Summarise week 5 in one idea.', a: 'That a well designed class makes invalid state impossible: it validates in the constructor, exposes no setters, protects its collections and wraps the rules in methods. The rest of the system can then trust it without validating again.' }
      ],
      out: 'A console program with 8+ attacks on the domain, all correctly rejected.',
      file: 'src/VetCare.Playground/Program.cs'
    }
  ]
},
{
  n: 6, phase: 'C# and OOP', title: 'Abstraction, interfaces and polymorphism',
  idea: 'Inheritance is taught first and used least. What you will really use every day is composing objects and programming against interfaces.',
  res: [
    { t: 'Microsoft Learn — Interfaces', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces', note: 'Defining, implementing and using interfaces in C#.' },
    { t: 'Microsoft Learn — Inheritance', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance', note: 'Inheritance, virtual, override and abstract classes.' },
    { t: 'Microsoft Learn — Polymorphism', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/polymorphism', note: 'Run-time polymorphism.' },
    { t: 'Wikipedia — Composition over inheritance', u: 'https://en.wikipedia.org/wiki/Composition_over_inheritance', note: 'The principle explained with an example, benefits and drawbacks.' },
    { t: 'Microsoft Learn — Object-Oriented programming (C#)', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop', note: 'Abstraction, encapsulation, inheritance and polymorphism in a single example.' }
  ],
  days: [
    {
      t: 'Abstraction',
      obj: 'Identify which VetCare details should be hidden behind an abstraction and which should not.',
      why: 'Abstracting too little ties you to technical details; abstracting too much produces useless layers everyone hates. Knowing where the line is, is an engineer’s judgement, not a beginner’s.',
      study: { r: 4, what: 'Read the introduction of Microsoft’s object-oriented programming tutorial (~10 min), the part on abstraction and encapsulation. Key idea: a useful abstraction hides a decision that could change; it does not hide code for the sake of it.',
        pasos: [
          'Read the tutorial introduction (~3 min): the four ideas of object-oriented programming.',
          'Read "Create different types of accounts" (~5 min): notice what the base class hides and what it shows.',
          'Read "Different overdraft rules" (~3 min): a rule that changes is hidden behind a member each type resolves its own way.',
          'Read "Summary" (~1 min).',
          'For your 6 candidates answer: can this change without the business changing? Do I need to test it without the real thing? If both are no, it does not deserve an interface.'
        ] },
      ex: {
        title: 'What deserves to be abstracted and what does not',
        body: `DESERVES ABSTRACTION (the decision may change):

  Send a vaccine reminder.
  Today: email. Tomorrow: WhatsApp or SMS.

  public interface INotifier
  {
      Task SendAsync(string to, string message);
  }

  The domain calls INotifier and neither knows nor cares
  whether underneath there is SMTP, Twilio or a log file.

DOES NOT DESERVE ABSTRACTION (it will never change):

  public interface IAgeCalculator          // useless
  {
      int Calculate(DateTime birthDate);
  }

  This is a pure, deterministic calculation. There is no
  alternative provider, no decision to isolate.
  It is a method, not an interface.

THE KEY QUESTION:
"Can I imagine a realistic second implementation of this
in the next two years?"
 - Yes -> interface.
 - No  -> concrete class, and you will extract it if needed.

A SECOND QUESTION, just as useful:
"Do I need to replace this with a double in the tests?"
If the answer is yes (database, clock, email, external
API), it deserves an interface too.`
      },
      steps: [
        'List 6 abstraction candidates in VetCare (persistence, notification, clock, Id generation, payments, files).',
        'Apply the two key questions to each one and decide: interface or concrete class.',
        'Write the signatures of the 3 interfaces you decide are worth it.'
      ],
      vet: [
        'Create src/VetCare.Domain/Abstractions/ with your 3 interfaces: for example INotifier, ISystemClock, IAppointmentRepository.',
        'Document in docs/notes-csharp.md the candidates you discarded and why.'
      ],
      edge: [
        'An interface with a single implementation that will never have another, and that is not used in tests, is noise. Used well, an interface exists to isolate a change or to make testing possible.',
        'ISystemClock looks over the top until you try to test "do not cancel with less than 2 hours’ notice" without being able to control time.'
      ],
      quiz: [
        { q: 'What is the test for deciding whether something deserves an interface?', a: 'Whether you can imagine a realistic second implementation in the medium term, or whether you need to replace it with a double in tests. If neither is true, the interface only adds indirection.' },
        { q: 'Why abstract the system clock?', a: 'Because DateTime.UtcNow is an external dependency you cannot control. Without abstracting it you cannot test rules that depend on time without really waiting or tampering with the machine’s clock.' },
        { q: 'What is the problem with abstracting too much?', a: 'Every layer of indirection makes the flow of the code harder to follow. If there are five interfaces with one implementation each between the request and the database, debugging becomes a treasure hunt.' },
        { q: 'What does a good abstraction hide?', a: 'A decision that could change: the provider, the protocol, the database engine, the format. It does not hide arbitrary complexity and is not used just to make the code look more professional.' }
      ],
      out: '3 justified interfaces in Abstractions/ + a documented list of discarded candidates.',
      file: 'src/VetCare.Domain/Abstractions/INotifier.cs'
    },
    {
      t: 'Interfaces',
      obj: 'Implement your interfaces with at least two real, interchangeable implementations.',
      why: 'An interface with a single implementation proves nothing. With two you start to see the value: you can change the system’s behaviour without touching the code that uses it.',
      study: { r: 0, what: 'Read the whole Interfaces page (~15 min), including explicit implementation and default members.',
        pasos: [
          'Read "Declare an interface" and "Implement an interface" (~4 min).',
          'Read "Explicit implementation" (~2 min): when two interfaces have a member with the same name.',
          'Read "Interfaces vs. abstract classes" (~3 min) and write in one line when you would use each.',
          'Read "Default interface members and static abstract members" (~3 min) just to know they exist; you do not need them today.',
          'Read "Interfaces summary" (~1 min) and compare it with your 3 interfaces: do they meet what it says?'
        ] },
      ex: {
        title: 'One interface, two implementations',
        body: `  public interface INotifier
  {
      Task SendAsync(string to, string message);
  }

  // Real implementation
  public class EmailNotifier : INotifier
  {
      private readonly string _sender;
      public EmailNotifier(string sender) => _sender = sender;

      public async Task SendAsync(string to, string message)
      {
          // the real SMTP call would go here
          await Task.Delay(10);
          Console.WriteLine($"[EMAIL from {_sender}] {to}: {message}");
      }
  }

  // Implementation for development and tests
  public class InMemoryNotifier : INotifier
  {
      public List<(string To, string Message)> Sent { get; } = new();

      public Task SendAsync(string to, string message)
      {
          Sent.Add((to, message));
          return Task.CompletedTask;
      }
  }

  // The code that uses them does not know which one it got
  public class ReminderService
  {
      private readonly INotifier _notifier;
      public ReminderService(INotifier n) => _notifier = n;

      public async Task RemindVaccineAsync(Pet p, string contact)
      {
          await _notifier.SendAsync(contact,
              $"{p.Name} is due for a vaccine.");
      }
  }

In production you pass EmailNotifier.
In a test you pass InMemoryNotifier and then check that
Sent has exactly 1 element.
Same service, zero changes to its code.`
      },
      steps: [
        'Implement each of your 3 interfaces with a real version and an in-memory version.',
        'Write a service class that depends on the interface, never on the concrete implementation.',
        'In the playground, run the same service with both implementations and check it works the same.'
      ],
      vet: [
        'Create the src/VetCare.Infrastructure project with the real and the in-memory implementations: dotnet new classlib -o src/VetCare.Infrastructure, then dotnet sln add src/VetCare.Infrastructure and dotnet add src/VetCare.Infrastructure reference src/VetCare.Domain. To use it from the playground: dotnet add src/VetCare.Playground reference src/VetCare.Infrastructure.',
        'Check that src/VetCare.Domain does NOT reference Infrastructure. The dependency arrow points towards the domain, never the other way round.'
      ],
      edge: [
        'If your domain needs to reference Infrastructure to compile, the dependency is inverted. That is the central topic of week 15.',
        'An interface with 12 methods forces every implementation to write 12. That breaks ISP, which you will see next week.'
      ],
      quiz: [
        { q: 'What does the service gain by depending on INotifier instead of EmailNotifier?', a: 'It can work with any channel without changing a line, and in tests it can use an in-memory version that sends nothing real but lets you verify that a send was attempted.' },
        { q: 'Why must the domain not reference Infrastructure?', a: 'Because the domain is the stable part and infrastructure is the changing part. If the domain depends on the email provider, changing provider forces you to recompile and retest the business rules.' },
        { q: 'What is an in-memory implementation and what is it for?', a: 'A version that stores the effect in a list instead of really doing it. It is for fast, deterministic tests and for developing without depending on external services.' },
        { q: 'When does an interface have too many methods?', a: 'When implementations end up leaving methods empty or throwing NotImplementedException. That shows they are really several responsibilities that should be separate interfaces.' }
      ],
      out: 'Each interface with 2 implementations + a service that depends only on the abstraction.',
      file: 'src/VetCare.Infrastructure/EmailNotifier.cs'
    },
    {
      t: 'Composition over inheritance',
      obj: 'Solve with composition a problem you would instinctively solve with inheritance, and compare.',
      why: 'Inheritance creates the strongest coupling in OOP: the child depends on the parent’s internal details. Composition gives the same reuse without that bond.',
      study: { r: 3, what: 'Read the introduction, the example and the benefits and drawbacks sections (~10 min). Key idea: inheritance is "is a", composition is "has a" or "uses a".',
        pasos: [
          'Read the introduction (~2 min): the idea of reusing behaviour by containment rather than inheritance.',
          'Read "Example", first "Inheritance" and then "Composition and interfaces" (~5 min). Notice how many classes each version needs.',
          'Read "Benefits" and "Drawbacks" (~3 min).',
          'Read "Avoiding drawbacks" (~2 min): how to reduce the boilerplate that composition brings.',
          'Write a table with the variants of your VetCare case and count the classes you would need with inheritance versus composition.'
        ] },
      ex: {
        title: 'The same problem, two solutions',
        body: `PROBLEM: there are several fee types for a consultation:
normal, emergency (50% surcharge) and frequent client (-10%).

WITH INHERITANCE (breaks soon):

  class Consultation { public virtual decimal Price() => 100; }
  class EmergencyConsultation : Consultation
      { public override decimal Price() => 150; }
  class FrequentConsultation : Consultation
      { public override decimal Price() => 90; }

  And now? An emergency consultation FOR a frequent client.
  You need EmergencyFrequentConsultation. And with a third
  modifier (for example, weekend) you would have 8 classes
  (2 x 2 x 2). A combinatorial explosion.

WITH COMPOSITION (scales):

  public interface IPriceRule
  {
      decimal Apply(decimal current);
  }

  public class Emergency : IPriceRule
  {
      public decimal Apply(decimal c) => c * 1.5m;
  }

  public class FrequentClient : IPriceRule
  {
      public decimal Apply(decimal c) => c * 0.9m;
  }

  public class Consultation
  {
      private readonly List<IPriceRule> _rules;
      private readonly decimal _base;

      public Consultation(decimal basePrice, IEnumerable<IPriceRule> rules)
      {
          _base = basePrice;
          _rules = rules.ToList();
      }

      public decimal Price() =>
          _rules.Aggregate(_base, (acc, r) => r.Apply(acc));
  }

  var c = new Consultation(100m,
      new IPriceRule[] { new Emergency(), new FrequentClient() });
  // 100 -> 150 -> 135

Adding a fourth rule = one new class, zero changes to
Consultation. This is the Strategy pattern you will see in
week 8, discovered by you today.`
      },
      steps: [
        'Find a case in VetCare where you were going to use inheritance (fee types, notification types, user types).',
        'Implement it with inheritance and count how many classes you would need if two variants combine.',
        'Reimplement it with composition and compare: lines of code, classes needed and the cost of adding a new variant.'
      ],
      vet: [
        'Implement the composition version in src/VetCare.Domain/ and delete the inheritance one.',
        'Write the numeric comparison between the two in docs/notes-csharp.md.'
      ],
      edge: [
        'Composition is not free: it adds more small types. The gain shows up when there are combinations; with a single variant inheritance can be simpler.',
        'The order of the rules matters as soon as you mix kinds: with two percentages it does not (multiplication is commutative: 100 x 1.5 x 0.9 = 100 x 0.9 x 1.5 = 135), but with a fixed 10 € discount it does. Surcharge then discount: 150 - 10 = 140. Discount then surcharge: 90 x 1.5 = 135. That is a business decision: document it.'
      ],
      quiz: [
        { q: 'What is the combinatorial explosion of classes and why does inheritance cause it?', a: 'Every combination of variants needs a new class: with 3 independent modifiers you need up to 8 subclasses. Inheritance only allows one chain, so the combinations have to be spelled out.' },
        { q: 'What is the question for choosing between inheritance and composition?', a: 'If the relationship is truly "is a" and stable, inheritance can work. If it is "has a", "uses a" or can combine with other features, composition.' },
        { q: 'Why does inheritance create the strongest coupling?', a: 'Because the child depends on the parent’s internal details, not only on its public interface. A change in how the parent implements something can break the child even if the signature does not change.' },
        { q: 'What real drawback does composition have?', a: 'More small types and an extra indirection: you have to jump between several classes to understand the full flow. It pays off when there is real variability; not when there is a single case.' }
      ],
      out: 'A composition solution implemented + a documented comparison against the inheritance version.',
      file: 'src/VetCare.Domain/Pricing/IPriceRule.cs'
    },
    {
      t: 'Inheritance and abstract classes',
      obj: 'Use inheritance where it does fit and know the rules that stop it becoming a problem.',
      why: 'Inheritance is not bad, it is easy to misuse. Knowing when it is the right tool saves you both from abusing it and from an irrational fear of using it.',
      study: { r: 1, what: 'Read the Inheritance page (~15 min): abstract classes, virtual, override, sealed and the difference with new.',
        pasos: [
          'Read the introduction (~3 min): what a derived class inherits and what it does not.',
          'Read "Abstract and virtual methods" and "Abstract base classes" (~5 min).',
          'Read "Preventing further derivation" (~2 min): sealed and why it suits the leaves of the hierarchy.',
          'Read "Derived class hiding of base class members" (~3 min): the difference between new and override, and why new is almost always a mistake.',
          'Before coding, draw your hierarchy on paper and mark which class is abstract and which are sealed.'
        ] },
      ex: {
        title: 'Inheritance used well: a template with variable steps',
        body: `A valid case: all clinical documents share structure
and life cycle, but the content varies.

  public abstract class ClinicalDocument
  {
      public Guid Id { get; }
      public Guid PetId { get; }
      public DateTime Date { get; }

      protected ClinicalDocument(Guid petId, DateTime date)
      {
          if (petId == Guid.Empty)
              throw new ArgumentException("Pet required.");
          Id = Guid.NewGuid();
          PetId = petId;
          Date = date;
      }

      // every subclass MUST define it
      public abstract string Summary();

      // shared behaviour, not repeated
      public string Header() =>
          $"[{Date:yyyy-MM-dd}] {GetType().Name} #{Id.ToString()[..8]}";
  }

  public sealed class Prescription : ClinicalDocument
  {
      public string Medicine { get; }
      public string Dosage { get; }

      public Prescription(Guid petId, DateTime date,
                          string medicine, string dosage)
          : base(petId, date)
      {
          Medicine = medicine;
          Dosage = dosage;
      }

      public override string Summary() =>
          $"Prescription: {Medicine} ({Dosage})";
  }

THREE RULES TO AVOID PAIN:
1. The base class is abstract: it is never instantiated
   on its own.
2. The leaves are sealed: nobody inherits from a subclass.
   The hierarchy has 2 levels, not 5.
3. The base does not know its children. If you write
   "if (this is Prescription)" inside the base, the
   hierarchy is wrong: that should be an abstract method.`
      },
      steps: [
        'Find a real "is a" case with shared behaviour in VetCare: clinical documents, events, users.',
        'Implement it with an abstract class and 2-3 sealed subclasses.',
        'Check the 3 rules: abstract base, sealed leaves, zero type checks inside the base.'
      ],
      vet: [
        'Create the hierarchy in src/VetCare.Domain/ with at least 2 subclasses.',
        'Write down why in this case inheritance is better than the composition you used yesterday.'
      ],
      edge: [
        'If a subclass has to throw NotSupportedException in an inherited method, you are breaking LSP and the hierarchy is wrong. You will see it in detail next week.',
        'A hierarchy deeper than 2 levels can almost always be flattened. Every extra level multiplies the difficulty of understanding where a behaviour comes from.'
      ],
      quiz: [
        { q: 'When is inheritance the right tool?', a: 'When there is a genuine, stable "is a" relationship, real shared behaviour that would otherwise be repeated, and a closed, known set of variants that do not combine with each other.' },
        { q: 'Why mark subclasses as sealed?', a: 'To limit the hierarchy to two levels. Without sealed, someone will inherit from your subclass and from then on it is impossible to reason about which implementation runs.' },
        { q: 'What does an "if (this is SubclassX)" inside the base class indicate?', a: 'That the base knows its children, which inverts the relationship. That conditional should be an abstract method each subclass implements its own way.' },
        { q: 'Difference between an abstract class and an interface?', a: 'An interface only declares a contract, and a class can implement several. An abstract class can provide state and shared code, but you can only inherit from one. Use an interface for the contract and an abstract class to share implementation.' }
      ],
      out: 'A hierarchy with an abstract class and 2+ sealed subclasses that meets the 3 rules.',
      file: 'src/VetCare.Domain/Documents/ClinicalDocument.cs'
    },
    {
      t: 'Polymorphism',
      obj: 'Remove conditionals on type by replacing them with polymorphism.',
      why: 'Every switch on a type is a place that will have to change when a new case appears. Polymorphism turns that change into adding a class without touching anything that exists.',
      study: { r: 2, what: 'Read the Polymorphism page (~12 min). Key idea: the method that runs is decided by the object’s real type at run time, not by the type of the variable.',
        pasos: [
          'Read "Polymorphism overview" (~4 min) and the example of the shapes being drawn.',
          'Read "Virtual members" (~3 min): virtual in the base, override in the derived class.',
          'Read "Hide base class members with new members" (~2 min) and compare its output with override’s.',
          'Read "Prevent derived classes from overriding virtual members" and "Access base class virtual members from derived classes" (~3 min).',
          'Write a variable of the base type pointing to a derived object, call the method and predict what is printed before running it.'
        ] },
      ex: {
        title: 'From switch to polymorphism',
        body: `BEFORE: a switch that grows with every new type.

  public string Describe(ClinicalDocument doc)
  {
      switch (doc)
      {
          case Prescription p:
              return $"Prescription: {p.Medicine}";
          case Vaccination v:
              return $"Vaccine: {v.Name}";
          case Diagnosis d:
              return $"Dx: {d.Text}";
          default:
              throw new NotSupportedException();
      }
  }

Problems: every new type forces you to touch this method,
the default is a time bomb, and if the same switch exists in
three places you will forget one.

AFTER: each class knows how to describe itself.

  foreach (var doc in documents)
      Console.WriteLine(doc.Header() + " " + doc.Summary());

The Summary() method is abstract in the base. At run time,
.NET calls the implementation of the object's REAL type,
not the type of the declared variable.

PROOF THAT IT WORKS:

  List<ClinicalDocument> docs = new()
  {
      new Prescription(id, today, "Amoxicillin", "1 every 12h"),
      new Vaccination(id, today, "Rabies")
  };

  foreach (var d in docs)
      Console.WriteLine(d.Summary());
  // Prescription: Amoxicillin (1 every 12h)
  // Vaccine: Rabies

The variable is ClinicalDocument in both cases, but each
concrete type's Summary() runs.

Adding Referral tomorrow = one new class. Zero changes to
the code that walks the list.`
      },
      steps: [
        'Find any switch or chain of ifs on types in your code and list them.',
        'Turn one into polymorphism: an abstract method in the base, an implementation in each leaf.',
        'Add a new type and check that you did not have to modify any existing code.'
      ],
      vet: [
        'Leave the document hierarchy with polymorphic behaviour and no switches on type.',
        'In the playground walk a mixed list and show the result for each one.'
      ],
      edge: [
        'Not every switch is bad: a switch over a closed, stable enum of states can be clearer than a hierarchy. The problem is the switch over TYPES that keep growing.',
        'A default that throws NotSupportedException is the classic sign: it shows the compiler cannot guarantee you covered every case.'
      ],
      quiz: [
        { q: 'What decides which implementation runs in a polymorphic call?', a: 'The object’s real type at run time, not the type of the variable that references it. That is why a variable declared as ClinicalDocument runs Prescription’s Summary if the object is a Prescription.' },
        { q: 'Why is a switch on types a problem?', a: 'Because every new type forces you to change that switch, and the same switch is usually duplicated in several places. It is the classic symptom of breaking the open-closed principle.' },
        { q: 'When is a switch acceptable?', a: 'Over a closed, stable enum, or when the logic belongs to an outer layer that should not pollute the domain, such as translating a type into an HTTP response format. The criterion is whether the set of cases grows.' },
        { q: 'What does client code gain from polymorphism?', a: 'It stops knowing the concrete types. It can walk a mixed list and ask for the behaviour without knowing what it is talking to, and it will keep working with types that do not exist yet.' }
      ],
      out: 'The switch on types removed, replaced by polymorphism, and a new type added without touching existing code.',
      file: 'src/VetCare.Domain/Documents/'
    },
    {
      t: 'OOP refactor (weekly exam)',
      obj: 'Refactor your whole domain applying what you learned and justify every design decision.',
      why: 'Refactoring without changing behaviour is a skill separate from programming. It is what lets you improve existing code without breaking anything, which is 80% of real work.',
      study: { r: 0, what: 'No new material. Reread all of src/VetCare.Domain as if it were someone else’s code you have to review.',
        pasos: [
          'Go over "Interfaces vs. abstract classes" (~3 min) to have the criterion fresh.',
          'Open src/VetCare.Domain and walk the files in alphabetical order, as if you were an outside reviewer.',
          'For each class note: its purpose in one sentence, the dependencies it receives and any conditional on type.',
          'Make the list of problems before touching anything and order it from easiest to hardest to fix.'
        ] },
      ex: {
        title: 'OOP review checklist',
        body: `For each class in your domain answer:

 1. Does it have behaviour or is it only data? (anaemic)
 2. Can it be built in an invalid state?
 3. Does it have any public setter?
 4. Does it expose modifiable collections?
 5. Does it depend on a concrete class that should be an
    interface?
 6. Is there logic duplicated in two classes?
 7. Is there any switch on types?
 8. Does the hierarchy have more than 2 levels?
 9. Is any method longer than 20 lines?
10. Do the names come from the business glossary?

THE GOLDEN RULE OF REFACTORING:
you do not change behaviour. Before you start, run your
attack program from week 5 and note the output.
When you finish, the output must be IDENTICAL.

If you have no way to check that the behaviour did not
change, you are not refactoring: you are rewriting and
crossing your fingers.`
      },
      steps: [
        'Run the attack program from week 5 and save the output as a reference.',
        'Run the 10-point checklist over each class and fix everything that fails.',
        'Run the attack program again: the output must be identical. If it changed, revert and do it in smaller steps.'
      ],
      vet: [
        'Leave src/VetCare.Domain refactored, compiling without warnings and with the attack program giving the same output.',
        'Press "Mark for review" and save the checklist result next to the code.'
      ],
      edge: [
        'Refactor in small steps and compile after each one. A big refactor that does not compile is impossible to debug.',
        'If the checklist flags something you do not know how to fix yet, record it as debt: several of those points are solved with SOLID next week.'
      ],
      quiz: [
        { q: 'What exactly defines a refactor?', a: 'A change to the internal structure of the code that does not alter its observable behaviour. If the behaviour changes, it is something else: a fix or a new feature.' },
        { q: 'Why is it essential to be able to check the behaviour before refactoring?', a: 'Because without checking you cannot tell a refactor from a breakage. The safety net (tests, or at least an attack program) is what makes refactoring safe instead of reckless.' },
        { q: 'Why refactor in small steps?', a: 'Because if something breaks you know exactly which step broke it. With a big change you have to bisect by hand between dozens of mixed modifications.' },
        { q: 'Summarise week 6 in one idea.', a: 'That object-oriented design is about deciding what to hide behind abstractions, preferring composition to inheritance, and letting polymorphism remove conditionals on type so that adding new cases does not force you to touch existing code.' }
      ],
      out: 'A refactored domain with the 10-point checklist passed and behaviour verified as unchanged.',
      file: 'src/VetCare.Domain/'
    }
  ]
}
]);
