/* Glossary (part two): databases, APIs, testing, resilience and architecture. */
window.EN = window.EN || {};
window.EN.GLOSARIO = (window.EN.GLOSARIO || []).concat([

/* ---------- Databases ---------- */

{ t: 'DDL and DML', en: 'Data Definition / Manipulation Language', dia: 'w9d1',
  def: 'DDL creates and changes the structure (CREATE, ALTER, DROP); DML works with the data (SELECT, INSERT, UPDATE, DELETE).',
  ya: 'All the SQL you wrote. It is just that nobody told you it splits into those two families.',
  dilo: '"DDL goes in versioned migrations; DML that touches production, in a reviewed transaction."' },

{ t: 'Transaction and ACID', en: 'Transaction / ACID', dia: 'w9d6',
  def: 'A group of operations that is done completely or not at all. ACID: Atomicity, Consistency, Isolation and Durability.',
  ya: 'When a process failed halfway and left charges without an invoice, and you had to reconcile it by hand. A transaction would have prevented it.',
  dilo: '"Every operation that touches several tables goes in a transaction; if one step fails, nothing is left half done."' },

{ t: 'Three-valued logic', en: 'Three-valued logic (NULL)', dia: 'w9d4',
  def: 'In SQL a comparison can be true, false or unknown (with NULL). NULL is not equal to anything, not even itself.',
  ya: 'That query that "lost" rows without any error because it had a NULL column in the filter.',
  dilo: '"I use IS NULL and IS DISTINCT FROM, and I decide what NULL means in each column: not applicable or unknown."' },

{ t: 'INNER JOIN and LEFT JOIN', en: 'Inner / Left outer join', dia: 'w9d5',
  def: 'INNER only returns rows with a match in both tables; LEFT keeps every row on the left even if it has no partner.',
  ya: 'When a report did not show the salespeople with no sales and someone asked where they were.',
  dilo: '"A filter on the right-hand table in the WHERE turns the LEFT into an INNER; if I want to keep rows, I put it in the ON."' },

{ t: 'B-tree index', en: 'Index', dia: 'w10d1',
  def: 'A sorted structure that lets you find rows without reading the whole table, in exchange for space and somewhat slower writes.',
  ya: 'The index someone created "because the screen was slow" and suddenly everything was fast.',
  dilo: '"In a multi-column index, order matters: the first column must be the one filtered by equality; and I create indexes on evidence, not out of habit."' },

{ t: 'Query plan', en: 'EXPLAIN ANALYZE', dia: 'w10d2',
  def: 'How the database decides to run a query and where the time goes, step by step.',
  ya: 'When you tried changes blindly on a slow query until it "seemed" faster. The plan tells you exactly why.',
  dilo: '"Before optimising I look at EXPLAIN ANALYZE: Seq Scan on a big table, discarded rows and estimate versus reality."' },

{ t: 'N+1 query problem', en: 'N+1 query problem', dia: 'w10d3',
  def: 'Running one query for the list and then one more for each item: 1 + N queries instead of one.',
  ya: 'That screen that was fine in development and crawled in production with many records, usually because of a navigation property inside a foreach.',
  dilo: '"I spot it by counting queries in the ORM log and fix it with a projection or a JOIN in a single query."' },

{ t: 'Cursor pagination', en: 'Keyset / cursor pagination', dia: 'w10d3',
  def: 'Asking for "the next 20 after this one" instead of "skip 100,000 and give me 20" (OFFSET).',
  ya: 'The last pages of a listing that took much longer than the first one.',
  dilo: '"OFFSET reads and discards all the earlier rows; the cursor jumps straight there with the index, so its cost does not grow with the page."' },

{ t: 'Database migration', en: 'Database migration', dia: 'w10d5',
  def: 'A versioned, ordered schema change that is applied the same way in every environment.',
  ya: 'EF’s Add-Migration or the numbered SQL scripts you had to run before deploying.',
  dilo: '"An applied migration is never edited; and adding a NOT NULL column to a table with data I do in three steps so it does not lock."' },

{ t: 'Isolation level', en: 'Isolation level', dia: 'w10d6',
  def: 'How much simultaneous transactions "see" each other: Read Committed, Repeatable Read, Serializable.',
  ya: 'Those odd bugs that only happened in production, with several users at once, and never on your machine.',
  dilo: '"I do not use Serializable by default; I choose the defence based on the anomaly I want to avoid in each operation."' },

{ t: 'Lost update', en: 'Lost update', dia: 'w10d6',
  def: 'Two people read the same value, change it and save; the second save wipes the first one’s change without anyone noticing.',
  ya: 'The stock that "got out of sync" every now and then, or the form where two people edited the same record.',
  dilo: '"I prevent it with pessimistic locking (SELECT FOR UPDATE) or optimistic locking with a version column."' },

{ t: 'Optimistic concurrency', en: 'Optimistic locking', dia: 'w10d6',
  def: 'Not locking when reading, but checking when saving that nobody changed the data (with a version); if it changed, it is rejected.',
  ya: 'The "another user modified this record, reload the page" messages.',
  dilo: '"I use optimistic when conflicts are rare and pessimistic when they are frequent or retrying is expensive."' },

/* ---------- Backend and APIs ---------- */

{ t: 'HTTP methods', en: 'HTTP verbs', dia: 'w11d2',
  def: 'GET reads, POST creates, PUT replaces, PATCH changes part of it and DELETE deletes. Each with its own meaning.',
  ya: 'You used GET and POST for everything. That was normal; the professional way is for the verb to say what the operation does.',
  dilo: '"The verb conveys the semantics: GET changes nothing and is cacheable; PUT and DELETE are idempotent; POST is not."' },

{ t: 'HTTP status codes', en: 'HTTP status codes', dia: 'w11d2',
  def: '2xx success, 4xx client error, 5xx server error. 201 created, 404 does not exist, 409 conflict, 422 invalid data.',
  ya: 'Those APIs that returned 200 with {"error": true} inside, and you had to read the body to know whether it worked.',
  dilo: '"I use codes precisely because retries, caches and monitoring depend on them: an overlap is 409, not 400."' },

{ t: 'Idempotency', en: 'Idempotency', dia: 'w11d5',
  def: 'Repeating an operation gives the same final result as doing it once.',
  ya: 'The double click that created two orders, or the automatic retry that charged twice.',
  dilo: '"Operations that create something important accept an Idempotency-Key; if it arrives twice, I return the stored response without repeating."' },

{ t: 'REST resource', en: 'REST resource', dia: 'w11d3',
  def: 'Designing URLs around things (plural nouns) and not around actions: GET /appointments/42, not /getAppointment?id=42.',
  ya: 'The /api/GetCustomerById style routes you inherited in some project.',
  dilo: '"URLs are a public contract; I design them as resources so they can be understood without documentation."' },

{ t: 'DTO', en: 'Data Transfer Object', dia: 'w11d4',
  def: 'An object that defines exactly what data goes in or out of an endpoint, separate from the entity.',
  ya: 'The XxxRequest and XxxResponse classes. Or the problem of returning the whole entity and exposing internal fields.',
  dilo: '"I never return entities: the DTO lets me change the database without breaking clients and avoids leaking sensitive fields."' },

{ t: 'Problem Details', en: 'Problem Details (RFC 9457)', dia: 'w11d5',
  def: 'A standard JSON error format with type, title, status and detail.',
  ya: 'Every project had its own error format; this is the standard that unifies it.',
  dilo: '"All my errors come out as problem+json, with a stable type the frontend uses to decide what to show."' },

{ t: 'OpenAPI', en: 'OpenAPI / Swagger', dia: 'w11d6',
  def: 'A document that describes the whole API: routes, parameters, bodies and responses. Swagger is the best-known tool.',
  ya: 'The /swagger page you opened to try endpoints.',
  dilo: '"The OpenAPI contract lets frontend and backend work in parallel and lets tools detect breaking changes."' },

{ t: 'Middleware', en: 'Middleware / request pipeline', dia: 'w12d2',
  def: 'Pieces that process every request in order: logging, errors, authentication, CORS.',
  ya: 'The app.UseSomething() lines in Program.cs, which you reordered until something worked.',
  dilo: '"The order of middlewares is the order of execution; cross-cutting concerns go there, not repeated in every endpoint."' },

{ t: 'ORM', en: 'Object-Relational Mapper', dia: 'w12d3',
  def: 'A library that translates between objects and tables, like Entity Framework Core.',
  ya: 'Entity Framework, Dapper (a micro-ORM) or Hibernate if you came from Java.',
  dilo: '"I use the ORM without losing sight of the SQL it generates: I log it in development and check it with EXPLAIN when it matters."' },

{ t: 'Health check', en: 'Liveness / readiness probe', dia: 'w12d6',
  def: 'Endpoints that say whether the application is alive (live) and whether it is ready to take traffic (ready).',
  ya: 'The /health the infrastructure team asked for, for the load balancer or Kubernetes.',
  dilo: '"Live only checks the process responds; ready checks the critical dependencies, and only the critical ones."' },

/* ---------- Testing ---------- */

{ t: 'Unit test', en: 'Unit test', dia: 'w13d1',
  def: 'A fast test of an isolated piece, with no database or network.',
  ya: 'The xUnit or NUnit tests, if you wrote them. And if you did not, this is your starting point.',
  dilo: '"I structure each test as Arrange, Act and Assert, and name it like a requirement: Cancel_WhenAlreadyCancelled_Throws."' },

{ t: 'Code coverage', en: 'Code coverage', dia: 'w13d2',
  def: 'The percentage of lines the tests run. It measures what runs, not whether it is checked properly.',
  ya: 'That mandatory 80 % that was met with getter tests that protected nothing.',
  dilo: '"Coverage tells me what is not tested, not what is well tested; I prioritise by business risk, not by percentage."' },

{ t: 'Test doubles', en: 'Stub, fake, mock, spy', dia: 'w13d3',
  def: 'Objects that replace real dependencies in a test: stub (returns something fixed), fake (works, but simplified), mock (verifies calls) and spy (records what happened).',
  ya: 'Everything you did with Moq. You probably called all of it "mock", which is the usual thing.',
  dilo: '"I prefer checking state with fakes; I verify calls only when the call is the result, like sending an email."' },

{ t: 'TDD', en: 'Test-Driven Development', dia: 'w13d4',
  def: 'Writing the test before the code, in short cycles: red (fails), green (passes) and refactor.',
  ya: 'When you first wrote a usage example to be clear about what you wanted to build. TDD formalises that idea.',
  dilo: '"I use TDD on rules with clear cases, like a vaccination schedule; it forces me to design from usage and leaves the code tested."' },

{ t: 'Integration test', en: 'Integration test', dia: 'w13d5',
  def: 'A test that runs several real pieces together: the whole API against a real database.',
  ya: 'The tests you did by hand with Postman before every release.',
  dilo: '"I use Testcontainers to start a real PostgreSQL; an in-memory database does not behave the same and lets bugs through."' },

{ t: 'Flaky test', en: 'Flaky test', dia: 'w13d6',
  def: 'A test that sometimes passes and sometimes fails without the code changing.',
  ya: 'That test that was rerun in CI "because it sometimes fails" until it went green.',
  dilo: '"A flaky test destroys trust in the whole suite; I fix it right away: it is almost always time, order or shared data."' },

{ t: 'Mutation testing', en: 'Mutation testing', dia: 'w13d6',
  def: 'Changing the code on purpose (a > for a >=) and checking that some test fails. If none fails, a test is missing.',
  ya: 'You probably never did it. It is the way to check that tests work, not just that they exist.',
  dilo: '"I validate my suite with mutations: if I break a rule and everything stays green, that rule was not protected."' },

/* ---------- Resilience ---------- */

{ t: 'Timeout', en: 'Timeout', dia: 'w14d1',
  def: 'The maximum time you wait for a response before giving up.',
  ya: 'The outage where a slow external service left the whole application unresponsive.',
  dilo: '"Every external call has a timeout, and I propagate the CancellationToken end to end so cancelling actually does something."' },

{ t: 'Retry with backoff and jitter', en: 'Retry with exponential backoff and jitter', dia: 'w14d2',
  def: 'Retrying while waiting longer each time (200, 400, 800 ms) and with some randomness, so you do not overload the service that is already struggling.',
  ya: 'The "try 3 times" loop you wrote at some point, probably with no wait between attempts.',
  dilo: '"I only retry transient errors (503, 504, timeouts), never a 400; and I use jitter so they do not all retry at once."' },

{ t: 'Circuit breaker', en: 'Circuit breaker', dia: 'w14d3',
  def: 'Stopping calls to a failing service for a while and answering fast with a controlled error.',
  ya: 'When you switched off a broken integration by hand so it did not drag the rest down.',
  dilo: '"The circuit has three states (closed, open, half-open); it protects my system and gives the failing service room to recover."' },

{ t: 'Outbox pattern', en: 'Transactional outbox', dia: 'w14d4',
  def: 'Storing the message to send in the same transaction as the data, and sending it later with a background process.',
  ya: 'The order that was saved but whose confirmation email never arrived (or the other way round).',
  dilo: '"With an outbox, saving and queuing the send is atomic; the processor retries until it goes out, so the notice is never lost."' },

{ t: 'Graceful degradation', en: 'Fallback', dia: 'w14d5',
  def: 'Keeping the essentials working when something secondary fails, telling the user what does not work.',
  ya: 'When the website kept working without recommendations because the recommendation service was down.',
  dilo: '"I keep a dependency matrix: what is critical, what the system does if each one fails and what the user sees."' },

{ t: 'Chaos engineering', en: 'Chaos engineering', dia: 'w14d6',
  def: 'Causing failures on purpose, with a hypothesis beforehand, to check the system holds up as you believe.',
  ya: 'The real outages you suffered in production. The difference is choosing when and where they happen.',
  dilo: '"I write the hypothesis before breaking anything; a defence I have never seen work is only an assumption."' },

/* ---------- Architecture ---------- */

{ t: 'Layered architecture', en: 'Layered architecture', dia: 'w15d1',
  def: 'Splitting the system into presentation, application, domain and infrastructure, with dependencies in a single direction.',
  ya: 'The Controllers, Services and Repositories folders in almost every project. What defines the layers is not the folders, but which way the dependencies point.',
  dilo: '"I verify the direction of dependencies with an architecture test; I do not rely on team discipline."' },

{ t: 'Hexagonal architecture', en: 'Ports and Adapters', dia: 'w15d2',
  def: 'The domain in the centre; everything outside (HTTP, database, email) connects through ports (interfaces) and adapters.',
  ya: 'If you ever called the same logic from an API and from a batch process without duplicating it, you were close.',
  dilo: '"The HTTP API is just one more adapter; my use cases work the same from a console."' },

{ t: 'Use case', en: 'Application service', dia: 'w15d2',
  def: 'The class that orchestrates a whole operation: loads, calls the domain, saves. With no business rules of its own.',
  ya: 'The service methods that coordinated repositories and other classes for a specific operation.',
  dilo: '"The endpoint builds the command, invokes the use case and translates the result to HTTP; nothing more."' },

{ t: 'CQRS', en: 'Command Query Responsibility Segregation', dia: 'w15d3',
  def: 'Separating the write path (commands, through the domain) from the read path (directly projected queries).',
  ya: 'When you wrote a direct SQL query for a report instead of loading whole entities.',
  dilo: '"I use light CQRS: same database, different path. I write through the domain to protect rules and read projecting only what is needed."' },

{ t: 'Domain event', en: 'Domain event', dia: 'w15d4',
  def: 'A notice of something that already happened in the business ("AppointmentCancelled") so other parts react without the sender knowing them.',
  ya: 'When the Save method ended up calling email, statistics and billing, and each new reaction made it bigger.',
  dilo: '"Events are named in the past tense and I dispatch them before the commit so their effects go in the same transaction."' },

{ t: 'Modular monolith', en: 'Modular monolith', dia: 'w15d5',
  def: 'A single deployable application divided into modules with clear boundaries and small contracts between them.',
  ya: 'The monolith where everything depended on everything. This is its opposite, without the cost of microservices.',
  dilo: '"I prefer a well-built modular monolith to badly built microservices; if a module needs to split off, its boundaries already exist."' },

{ t: 'ADR', en: 'Architecture Decision Record', dia: 'w15d6',
  def: 'A short document that records an architecture decision: context, decision, rejected alternatives and consequences.',
  ya: 'That decision nobody remembered the reason for and someone undid without knowing it had one.',
  dilo: '"Every ADR includes the rejected alternatives and their negative consequences; without that, it does not show there was a decision."' }

]);
