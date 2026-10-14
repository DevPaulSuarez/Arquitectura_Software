/* What each day is for in a real job, why it matters
   and what to ask (the client, the team or the tech lead) to apply it.
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.USO = Object.assign(window.EN.USO || {}, {

/* ---------- Week 13 · Testing ---------- */

'w13d1': {
  sirve: 'A test with a good structure (arrange, act, assert) and a good name documents a business rule and warns you if someone breaks it. It is required in almost every professional pull request.',
  importa: 'A test called "Test1" that fails tells nobody what broke. A test called "Cancel_with_less_than_24h_applies_surcharge" explains the rule, the failure and where to look without opening the code.',
  preguntas: [
    { a: 'The tech lead', q: 'What naming convention do we use for tests?', obt: 'The team’s common format, so every test reads the same way.' },
    { a: 'The vet', q: 'Tell me three situations the system must never allow.', obt: 'The first tests worth writing, taken from the business and not from your code.' },
    { a: 'In a code review', q: 'If this test fails, does its name tell me which rule broke?', obt: 'Improving test names that explain nothing.' }
  ],
  evita: { q: 'How many tests do I have to write?', por: 'The number does not matter. Ask which rules are critical and make sure each one has its test.' }
},

'w13d2': {
  sirve: 'Deciding what to test is investing time where a failure costs most: business rules, money calculations, permissions. At work there is never time to test everything.',
  importa: 'Teams chasing 100% coverage end up with fragile getter tests that break with every change. Teams that test nothing live in fear. The economic criterion is what gives confidence without slowing down.',
  preguntas: [
    { a: 'The clinic owner', q: 'Which system error would cost you most money or cause a more serious problem?', obt: 'The highest-risk areas, which should have most tests.' },
    { a: 'The tech lead', q: 'Which bugs reached production this year? Would a test have caught them?', obt: 'Real evidence of where tests are missing.' },
    { a: 'QA', q: 'Which manual tests do you repeat on every delivery?', obt: 'Candidates for automation because they are always done.' }
  ],
  evita: { q: 'What minimum coverage do we need?', por: 'Coverage measures lines executed, not rules tested. Ask which failures would be most serious and whether they are covered.' }
},

'w13d3': {
  sirve: 'Test doubles (stub, fake, mock, spy) replace external dependencies to test a class on its own. Choosing the right one keeps tests fast and easy to maintain.',
  importa: 'Overusing mocks produces tests that check how the code is written and not what it does: any refactor breaks them even though the behaviour is the same. Choosing the double well is what makes tests help instead of getting in the way.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we prefer hand-written fakes or a mocking library?', obt: 'The team’s style and why.' },
    { a: 'In a code review', q: 'Does this test check the result or only that a method was called?', obt: 'Spotting tests coupled to the implementation.' },
    { a: 'A teammate', q: 'Do we have an in-memory repository fake I can reuse?', obt: 'Ready-made test tools that save time.' }
  ],
  evita: { q: 'Shall I mock everything?', por: 'Mocking everything tests very little. Ask which dependencies are slow or external; only those need a double.' }
},

'w13d4': {
  sirve: 'TDD is writing the test before the code, in short cycles. It is especially useful with complex rules (vaccination schedule, price calculation) where the design is not clear at the start.',
  importa: 'TDD forces you to think about usage before implementation, and leaves the code with tests from the first minute. It is also common in interviews to be asked to solve an exercise with TDD.',
  preguntas: [
    { a: 'The vet', q: 'Give me concrete examples: an 8-week-old puppy, which vaccines are due and when?', obt: 'Real examples that turn directly into the first tests.' },
    { a: 'The tech lead', q: 'In which parts of the project does the team use TDD and in which not?', obt: 'Where it adds value according to the team’s experience.' },
    { a: 'A teammate', q: 'Shall we do a pair programming session with TDD on this feature?', obt: 'Guided practice with someone who already masters the cycle.' }
  ],
  evita: { q: 'Is TDD good for everything?', por: 'No, and the abstract debate leads nowhere. Ask whether the rule you are going to write has clear cases that can be expressed as examples.' }
},

'w13d5': {
  sirve: 'Integration tests test the complete API with a real database (for example with Testcontainers). They catch errors unit tests do not see: mappings, constraints, serialisation.',
  importa: 'Many real failures are in the seams: JSON that does not deserialise, the constraint that rejects, the badly mapped query. Unit tests with mocks never see them; integration tests do.',
  preguntas: [
    { a: 'The tech lead', q: 'Do the integration tests use a real database in a container or an in-memory one?', obt: 'The team’s practice and its reasons; the in-memory database does not behave like PostgreSQL.' },
    { a: 'The infrastructure team', q: 'Can the CI server start Docker containers?', obt: 'Whether tests with Testcontainers can run in the pipeline.' },
    { a: 'QA', q: 'Which API flows do you test by hand that we could automate?', obt: 'The most valuable integration scenarios.' }
  ],
  evita: { q: 'Shall I use EF’s in-memory database so it’s faster?', por: 'It does not behave like PostgreSQL and tests pass with real bugs. Ask which behaviour differences could affect you.' }
},

'w13d6': {
  sirve: 'A fast, reliable suite is one the team runs before every commit without complaining. Being able to defend each testing decision is part of any serious interview.',
  importa: 'A slow suite stops being run; a suite with randomly failing tests stops being believed. In both cases it is like having no tests, but with the cost of maintaining them.',
  preguntas: [
    { a: 'The tech lead', q: 'How long does the full suite take? What is the acceptable maximum?', obt: 'A speed target for the suite.' },
    { a: 'The team', q: 'Are there tests that sometimes fail for no reason? Which ones?', obt: 'The list of flaky tests destroying confidence in the suite.' },
    { a: 'The tech lead', q: 'What would have to happen for you to trust deploying just because the tests pass?', obt: 'The suite’s real confidence goal.' }
  ],
  evita: { q: 'Shall I disable the test that sometimes fails?', por: 'You hide it, you do not fix it. Ask why it fails: it is almost always timing, order or shared data.' }
},

/* ---------- Week 14 · Resilience ---------- */

'w14d1': {
  sirve: 'A timeout on every external call (database, SMS, email, another API) stops a slow dependency from leaving your threads waiting forever.',
  importa: 'Without timeouts, a slow SMS provider can bring down the whole API: each request waits, threads run out and even the schedule stops responding. It is the cause of many cascading incidents.',
  preguntas: [
    { a: 'The tech lead', q: 'What timeout do our HTTP and database calls have today?', obt: 'The current values (which are sometimes 100 seconds by default) and whether they are reasonable.' },
    { a: 'The external provider or its documentation', q: 'What is your normal response time and your 99th percentile?', obt: 'Data to set a timeout that does not cut normal calls.' },
    { a: 'The frontend team', q: 'How long does the user wait before the screen shows an error?', obt: 'The total time budget, which limits the backend’s timeouts.' }
  ],
  evita: { q: 'Shall I set a very high timeout so it doesn’t fail?', por: 'A very high timeout protects against nothing. Ask how long the call normally takes and how long the user can wait.' }
},

'w14d2': {
  sirve: 'Retrying with growing, random waits recovers transient failures (a network blip, a 503) without overwhelming the service that is already suffering.',
  importa: 'Retrying immediately and many times multiplies the load exactly when the service is worst: it is the fastest way to turn a small problem into a total outage. And retrying errors that are not transient (a 400) only wastes resources.',
  preguntas: [
    { a: 'The tech lead', q: 'Which errors do we consider transient and which permanent?', obt: 'The list of codes and exceptions that deserve a retry.' },
    { a: 'The external provider', q: 'Do you send a Retry-After header when you are overloaded?', obt: 'Whether you should respect the time the service asks for.' },
    { a: 'In a code review', q: 'Is this operation safe to repeat? If not, why is it retried?', obt: 'Avoiding retries that duplicate charges or messages.' }
  ],
  evita: { q: 'Shall I retry 10 times to be sure?', por: 'Ten retries without waiting can be an attack on your own provider. Ask which errors are transient and how long they take to recover.' }
},

'w14d3': {
  sirve: 'A circuit breaker stops calling a down service for a while and answers fast with a controlled failure. It protects your system and gives the other one breathing room.',
  importa: 'Insisting against a down service wastes time on every request and delays its recovery. The open circuit turns seconds of waiting into an immediate response and a plan B.',
  preguntas: [
    { a: 'The tech lead', q: 'What percentage of errors should open the circuit and how long does it stay open?', obt: 'The initial parameters, which are later tuned with real data.' },
    { a: 'The clinic owner', q: 'If sending reminders fails for an hour, what do you prefer: retry them later or alert the receptionist?', obt: 'What the system does when the circuit is open.' },
    { a: 'The observability team', q: 'Do we get an alert when a circuit opens?', obt: 'Whether the team finds out that a dependency is down.' }
  ],
  evita: { q: 'Shall I put a circuit breaker on every call?', por: 'Not all of them need one. Ask which external dependencies can go down and how much damage waiting for them does.' }
},

'w14d4': {
  sirve: 'Operational idempotency ensures that repeating a write does not duplicate it. The outbox pattern guarantees that if an appointment is saved, the email notification is sent no matter what, even if the first attempt fails.',
  importa: 'Without an outbox, there are two possible errors: saving the appointment and losing the email, or sending the email and the appointment not being saved. Both reach the client and destroy trust in the system.',
  preguntas: [
    { a: 'The tech lead', q: 'Which operations save to the database and also call something external?', obt: 'The candidates for using an outbox.' },
    { a: 'The clinic owner', q: 'Is it worse for a client to get two reminders or none?', obt: 'Whether sending must be at-least-once or at-most-once, a business decision.' },
    { a: 'The infrastructure team', q: 'Who processes the outbox table and what happens if that process goes down?', obt: 'How the pattern really runs in production.' }
  ],
  evita: { q: 'Shall I just send the email right after saving?', por: 'It works until one of the two things fails. Ask what happens if the email fails after saving.' }
},

'w14d5': {
  sirve: 'Degrading gracefully is deciding what the system does when a dependency is not there: show the schedule without the waiting time, save the appointment and notify later, etc.',
  importa: 'A generic 500 leaves the user with nothing. A thought-out degradation keeps the main operation (booking appointments) going even if the secondary ones (reminders) fail. It is the difference between "the system is a bit limited" and "the system is down".',
  preguntas: [
    { a: 'The clinic owner', q: 'What is the one thing that can never stop working, even if other things fail?', obt: 'The critical function protected above everything.' },
    { a: 'The receptionist', q: 'If the system cannot send reminders, would you prefer it to alert you so you can call?', obt: 'The human plan B for each degradation.' },
    { a: 'The tech lead', q: 'Which dependencies are critical and which optional for each screen?', obt: 'The map of dependencies per feature.' }
  ],
  evita: { q: 'What do I do if everything fails?', por: 'Too general. Ask, dependency by dependency, what happens if that one alone fails.' }
},

'w14d6': {
  sirve: 'Breaking the system on purpose (turning off the database, slowing down SMS) confirms the defences work as you said. It is what mature teams do before reality does it for them.',
  importa: 'A resilience defence that has never been tested is an assumption. Controlled chaos turns "I think it holds" into "I checked it holds", and that is the argument that convinces in a review or an interview.',
  preguntas: [
    { a: 'The tech lead', q: 'In which environment can we break things without affecting anyone?', obt: 'The safe place for the experiments.' },
    { a: 'The infrastructure team', q: 'Which failures have happened in production over the last year?', obt: 'The most realistic chaos scenarios to test first.' },
    { a: 'The tech lead', q: 'Which result of the experiment would make you hesitate to deploy?', obt: 'The success criterion before starting, not afterwards.' }
  ],
  evita: { q: 'Shall I turn off the database and see what happens?', por: 'Without a hypothesis you learn nothing. Write down beforehand what you expect to happen and then check it.' }
},

/* ---------- Week 15 · Architecture ---------- */

'w15d1': {
  sirve: 'Layers only work if the dependencies go in one direction: the API depends on the domain, never the other way round. At work you check it by looking at the references between projects.',
  importa: 'Folders called Domain and Infrastructure are not architecture if the domain imports EF Core. When the arrow points the wrong way, changing the database forces you to rewrite the business rules.',
  preguntas: [
    { a: 'The architect', q: 'Do we have any test or rule that stops the domain depending on infrastructure?', obt: 'Whether the dependency rule is automated or relies on goodwill.' },
    { a: 'The tech lead', q: 'Which project references which other today?', obt: 'The real dependency graph to compare with the drawing.' },
    { a: 'In a code review', q: 'Why is this infrastructure using in a domain class?', obt: 'Spotting the backwards arrow before it settles in.' }
  ],
  evita: { q: 'How many layers do we have to have?', por: 'The number does not matter. Ask which direction the dependencies go in and whether it always holds.' }
},

'w15d2': {
  sirve: 'Hexagonal architecture puts the domain at the centre and treats the database, the HTTP API and external services as interchangeable adapters.',
  importa: 'With the domain isolated you can test all the logic without a server or database, and switch web framework without touching the business. It is the architecture most asked about in backend interviews.',
  preguntas: [
    { a: 'The architect', q: 'Which input and output ports does the application have?', obt: 'The system’s real map of ports and adapters.' },
    { a: 'The tech lead', q: 'Where do the use cases live: in the API or in an application layer?', obt: 'The team’s convention for orchestrating the domain.' },
    { a: 'In a code review', q: 'Would this use case work the same if we called it from a console instead of HTTP?', obt: 'The proof that the logic does not depend on the input adapter.' }
  ],
  evita: { q: 'Shall we move the whole project to hexagonal?', por: 'It is a risky rewrite. Ask what specific problem it solves and start with one module.' }
},

'w15d3': {
  sirve: 'Light CQRS separates reading from writing: writes go through the domain and its rules, reads go straight to optimised queries.',
  importa: 'Loading complete aggregates just to show a list is slow and complicates the domain. Separating the two paths makes reads fast and leaves writes protected.',
  preguntas: [
    { a: 'The tech lead', q: 'Which screens read a lot and modify nothing?', obt: 'The candidates for direct queries without going through the domain.' },
    { a: 'The frontend team', q: 'Which combined data does the schedule screen need in a single call?', obt: 'The ideal read model for that screen.' },
    { a: 'The architect', q: 'Do we need separate databases for reading and writing or are different queries enough?', obt: 'The right level of CQRS without over-designing.' }
  ],
  evita: { q: 'Shall we implement CQRS with event sourcing?', por: 'It is far more than is needed almost always. Ask what problem reads have today.' }
},

'w15d4': {
  sirve: 'Domain events announce what happened ("AppointmentCancelled") so other parts react (free the slot, notify the client) without the appointment knowing about them.',
  importa: 'Without events, the Appointment class ends up calling notifications, billing and statistics, and each new reaction makes it bigger. With events, adding a reaction is adding a handler, without touching the domain.',
  preguntas: [
    { a: 'The clinic owner', q: 'When an appointment is cancelled, who has to find out and what does each one do?', obt: 'The event’s handlers, taken from the business.' },
    { a: 'The tech lead', q: 'Are events dispatched before or after committing the transaction?', obt: 'The rule that avoids announcing something that in the end was not saved.' },
    { a: 'In a code review', q: 'Does this event describe something that already happened or an order?', obt: 'Naming events in the past tense and telling them apart from commands.' }
  ],
  evita: { q: 'Shall I use events for everything?', por: 'The flow becomes hard to follow. Ask which reactions are secondary and can happen without the sender knowing.' }
},

'w15d5': {
  sirve: 'Splitting the system into modules by business capability (schedule, clinical history, billing) with clear boundaries is the basis for several teams working without treading on each other.',
  importa: 'A monolith without modules becomes a big ball of mud where everything depends on everything. A well-made modular monolith is easier to maintain than many badly made microservices, and it can be split later if needed.',
  preguntas: [
    { a: 'The clinic owner', q: 'Which areas of the clinic work fairly independently?', obt: 'The business capabilities that mark the module boundaries.' },
    { a: 'The architect', q: 'How do the modules communicate: direct calls to a public interface or events?', obt: 'The rules of communication between modules.' },
    { a: 'The tech lead', q: 'Does any module read another’s tables directly?', obt: 'Boundary leaks that couple the modules through the database.' }
  ],
  evita: { q: 'Shall we move it to microservices?', por: 'It is the solution before understanding the problem. Ask first whether the boundaries between modules are clear inside the monolith.' }
},

'w15d6': {
  sirve: 'ADRs (Architecture Decision Records) record what was decided, why and which alternatives were discarded. They are the team’s memory when people change.',
  importa: 'A year from now someone will ask "why was it done this way?" and without ADRs nobody will know, or a good decision will be undone through ignorance. Defending decisions with alternatives is what is expected of an architect.',
  preguntas: [
    { a: 'The tech lead', q: 'Which architecture decisions have been discussed more than once?', obt: 'The ones most in need of an ADR to close the debate.' },
    { a: 'The architect', q: 'Which alternative was almost chosen and why not?', obt: 'The discarded alternative, the most valuable part of the ADR.' },
    { a: 'A new teammate', q: 'Which project decision did you not understand when you arrived?', obt: 'Decisions that urgently need documenting.' }
  ],
  evita: { q: 'Shall I document every decision?', por: 'It becomes bureaucracy. Ask which decisions are hard to reverse or cause debate; those get an ADR.' }
},

/* ---------- Week 16 · React and TypeScript ---------- */

'w16d1': {
  sirve: 'Components typed with TypeScript are the basic unit of any modern React frontend. Prop types document how each component is used and prevent errors when calling it.',
  importa: 'Without types, a change in a component silently breaks every screen using it and the user discovers it. With types, the compiler discovers it before the commit.',
  preguntas: [
    { a: 'The frontend tech lead', q: 'Do we have a base component library or a design system?', obt: 'Ready-made components you should reuse instead of creating others.' },
    { a: 'The designer', q: 'What variants does this component have: sizes, states, colours?', obt: 'The props the component needs, decided by the design.' },
    { a: 'In a code review', q: 'Why is this prop of type any?', obt: 'Closing typing gaps that cancel out TypeScript’s advantage.' }
  ],
  evita: { q: 'Shall I make a component for each screen?', por: 'Ask which pieces repeat across screens; those are the reusable components.' }
},

'w16d2': {
  sirve: 'Deciding what is state (what changes and cannot be computed) and what is not avoids half of React’s bugs. Duplicated state gets out of sync.',
  importa: 'Keeping in state something that can be computed (the total of appointments, the filtered list) forces you to keep two things in sync, and one is always forgotten. It is the most common beginner’s mistake in React.',
  preguntas: [
    { a: 'The receptionist', q: 'Which filters and options do you change in the schedule during the day?', obt: 'What really is the screen’s state.' },
    { a: 'In a code review', q: 'Can this state be computed from another?', obt: 'Removing duplicated state and deriving it in the render.' },
    { a: 'The frontend tech lead', q: 'Do we use a global state manager or just useState and context?', obt: 'The team’s tool and when it is used.' }
  ],
  evita: { q: 'Shall I put everything in global state?', por: 'It complicates unnecessarily. Ask who uses each piece of data; if only one component uses it, the state is local.' }
},

'w16d3': {
  sirve: 'Lifting state up to the right common ancestor lets two components share data without duplicating it. Controlled components receive their value and report changes.',
  importa: 'State at the wrong level forces you to sync components with effects or makes the whole tree re-render. Putting it in its place leaves the code simple and predictable.',
  preguntas: [
    { a: 'The designer', q: 'If I select a vet in the side panel, which other parts of the screen should change?', obt: 'Which components share state and where it should live.' },
    { a: 'In a code review', q: 'Why does this child component have its own copy of the value the parent passes it?', obt: 'Spotting state duplicated between parent and child.' },
    { a: 'The frontend tech lead', q: 'From how many levels of props do we prefer a context?', obt: 'The team’s criterion to avoid passing props through too many levels.' }
  ],
  evita: { q: 'How do I sync the state of two components?', por: 'It is not synced, it is shared. Ask what their common ancestor is and lift the state there.' }
},

'w16d4': {
  sirve: 'useEffect is for syncing with external systems (subscriptions, timers, browser APIs). Almost everything else is solved without effects.',
  importa: 'Unnecessary effects cause double renders, infinite loops and flickering data. React’s official documentation devotes a whole page to "you might not need an effect" because it is the most widespread mistake.',
  preguntas: [
    { a: 'In a code review', q: 'Does this effect sync with something external or compute something from props?', obt: 'Whether the effect is surplus and can be a computation in the render.' },
    { a: 'The frontend tech lead', q: 'How do we load data from the server: hand-written effects or a library?', obt: 'The team’s convention, which normally avoids hand-written effects.' },
    { a: 'A teammate', q: 'Does this effect clean up what it creates when the component unmounts?', obt: 'Spotting subscription or timer leaks.' }
  ],
  evita: { q: 'Shall I add a useEffect to update this state when the prop changes?', por: 'It is almost always surplus. Ask whether the value can be computed directly from the prop.' }
},

'w16d5': {
  sirve: 'A complete form validates on the client, shows the submitting state and translates the errors the API returns into messages next to the right field.',
  importa: 'Forms are where users get most frustrated. A generic "something went wrong" error after filling in ten fields makes them give up or phone. Translating server errors properly is what closes the loop.',
  preguntas: [
    { a: 'The receptionist', q: 'Which data do you fill in quickly and in what order when booking an appointment by phone?', obt: 'The order of the fields and which must be quick to fill in.' },
    { a: 'The backend team', q: 'What format do the API’s validation errors have? Do they say which field?', obt: 'How to associate each server error with its field.' },
    { a: 'The designer', q: 'Where and when are errors shown: while typing, on leaving the field or on submit?', obt: 'The validation behaviour agreed with design.' }
  ],
  evita: { q: 'Shall I validate only in the backend?', por: 'The user expects to know the error immediately. Ask which validations the client can do and which only the server can.' }
},

'w16d6': {
  sirve: 'Integrating a complete screen against the real API and reviewing it with quality criteria (accessibility, empty states, errors, loading) is what makes it ready for real users.',
  importa: 'A screen that only works with perfect data fails on day one. Loading, empty and error states are half of frontend work and what the user perceives as quality.',
  preguntas: [
    { a: 'The receptionist', q: 'Use the schedule for ten minutes as if it were a normal day. What bothers you?', obt: 'Real usability problems you do not see while programming.' },
    { a: 'The designer', q: 'How should the empty schedule, the loading one and the failing one look?', obt: 'Design of the states that are usually forgotten.' },
    { a: 'The frontend tech lead', q: 'Which criteria do you check before approving a screen?', obt: 'The team’s frontend checklist.' }
  ],
  evita: { q: 'Do you like how it turned out?', por: 'Aesthetic opinion validates nothing. Ask them to use it for a real task and watch where they get stuck.' }
}

});
