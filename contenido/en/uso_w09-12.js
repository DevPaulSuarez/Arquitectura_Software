/* What each day is for in a real job, why it matters
   and what to ask (the client, the team or the tech lead) to apply it.
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.USO = Object.assign(window.EN.USO || {}, {

/* ---------- Week 9 · Real SQL ---------- */

'w9d1': {
  sirve: 'Writing the DDL is creating the real tables by choosing types (numeric for money, timestamptz for dates, text for names). It is what gets reviewed in every migration that creates or alters a table.',
  importa: 'A badly chosen type lasts forever: storing money as float loses cents, storing dates without a time zone shifts appointments by an hour twice a year. Fixing it with millions of rows is a risky operation.',
  preguntas: [
    { a: 'The tech lead', q: 'What convention do we use for ids: integer, bigint or uuid?', obt: 'The team’s convention and its reason, so all tables are consistent.' },
    { a: 'The clinic owner', q: 'Does the clinic always work in the same time zone? Are there online appointments with clients from elsewhere?', obt: 'Whether local time is enough or you need to store it with a time zone.' },
    { a: 'The DBA or tech lead', q: 'What volume do we expect in this table in two years?', obt: 'Whether an integer is enough or bigint is needed, and whether indexes or partitions need thinking about now.' }
  ],
  evita: { q: 'Shall I make everything varchar(255)?', por: 'It is the shortcut nobody defends in a review. Ask what each piece of data represents and what range it has.' }
},

'w9d2': {
  sirve: 'Constraints make PostgreSQL reject invalid data with a clear error. At work they are the guarantee that neither a bug nor a manual script leaves the database in an impossible state.',
  importa: 'Dirty data is the most expensive technical debt: once inside, it contaminates reports, breaks migrations and nobody knows whether it can be deleted. A constraint costs one line and saves years of cleaning.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we give constraints our own names or leave the one PostgreSQL assigns?', obt: 'The naming convention that lets you translate the database error into a useful message in the API.' },
    { a: 'The vet', q: 'Are there combinations of data that can never occur together? For example, a cat vaccine on a dog.', obt: 'Rules across columns that can be expressed with CHECK or composite foreign keys.' },
    { a: 'The DBA', q: 'How do we add a new constraint to a table that already has data that does not meet it?', obt: 'The safe procedure (NOT VALID, clean up, VALIDATE) without locking production.' }
  ],
  evita: { q: 'Don’t constraints make the database slower?', por: 'The cost is tiny compared with corrupt data. Ask what impossible data could get in today.' }
},

'w9d3': {
  sirve: 'Safe INSERT, UPDATE and DELETE (with a checked WHERE, in a transaction, with RETURNING) are what you use when you fix data in production or prepare test data.',
  importa: 'An UPDATE without WHERE is an incident with its own name in many companies. Knowing how to modify data with a safety net (transaction, checking affected rows before committing) separates who can touch production from who cannot.',
  preguntas: [
    { a: 'The tech lead', q: 'What is the procedure for fixing data by hand in production? Who reviews it?', obt: 'The team’s process (reviewed script, transaction, prior backup), which exists because of some past incident.' },
    { a: 'The DBA', q: 'Do we use soft or hard deletes for pets and owners?', obt: 'The deletion policy, which affects queries, reports and privacy.' },
    { a: 'QA', q: 'What test data do you need to cover the odd cases?', obt: 'Realistic cases for the seed: pets without a chip, owners with two pets, cancelled appointments.' }
  ],
  evita: { q: 'Can I run this UPDATE in production?', por: 'Asking permission without showing anything gives nobody confidence. Show the script, how many rows it will affect and how it is undone.' }
},

'w9d4': {
  sirve: 'SELECT with correct filters answers the business’s questions. Understanding NULL (which is not equal to anything, not even itself) avoids queries that silently lose rows.',
  importa: 'A query with badly handled NULL does not error: it returns a wrong number. And that number ends up in a report someone uses to make decisions.',
  preguntas: [
    { a: 'The clinic owner', q: 'When you ask for "pets without a rabies vaccine", do you include the ones we don’t know whether they have it?', obt: 'How to treat unknown data in the report, which translates into how to treat NULL.' },
    { a: 'A teammate', q: 'Can this column be NULL? What does NULL mean here: not applicable or unknown?', obt: 'The meaning of NULL, which changes how it is filtered.' },
    { a: 'The tech lead', q: 'Where do we keep report queries so they are reviewed and versioned?', obt: 'Where the team’s shared queries live.' }
  ],
  evita: { q: 'Why does my query return nothing?', por: 'Without context nobody can help. Show the query, the sample data and what you expected; it is almost always a NULL.' }
},

'w9d5': {
  sirve: 'JOINs combine tables to answer questions like "today’s appointments with pet and owner name". Choosing INNER or LEFT changes which rows appear.',
  importa: 'An INNER JOIN where a LEFT was needed makes pets without an owner or vets without appointments disappear from a report. The result looks right, and that is why it is dangerous.',
  preguntas: [
    { a: 'The clinic owner', q: 'In the list of vets with their appointments for the month, do you also want to see the ones who had none?', obt: 'The answer that decides between INNER and LEFT JOIN.' },
    { a: 'A teammate', q: 'Why does this report give more rows than I expected?', obt: 'Spotting a JOIN that multiplies rows through an unexpected 1:N relationship.' },
    { a: 'The tech lead', q: 'Do we have indexes on all the foreign keys we use in JOINs?', obt: 'Whether the frequent JOINs have index support.' }
  ],
  evita: { q: 'Which JOIN should I use?', por: 'It depends on the business question. Explain which rows must appear when there is no match.' }
},

'w9d6': {
  sirve: 'GROUP BY produces the reports management asks for (appointments per month, revenue per vet). Transactions guarantee that a multi-step operation is done completely or not at all.',
  importa: 'A badly made aggregate report leads to bad business decisions. An operation without a transaction that fails halfway leaves charges without an appointment or appointments without a charge, and someone will have to reconcile it by hand.',
  preguntas: [
    { a: 'The clinic owner', q: 'Which numbers do you look at each month to know whether the clinic is doing well?', obt: 'The reports that are really used, which are the ones worth building properly.' },
    { a: 'The tech lead', q: 'Which system operations touch several tables and should go in a transaction?', obt: 'The critical operations that need atomicity.' },
    { a: 'The accountant', q: 'Is revenue counted by appointment date or by payment date?', obt: 'The exact definition of the metric, which changes the GROUP BY.' }
  ],
  evita: { q: 'Shall I make a report with everything?', por: 'Nobody reads a report with everything. Ask what decision the person makes with that number.' }
},

/* ---------- Week 10 · Database performance ---------- */

'w10d1': {
  sirve: 'Indexes make a search go from reading the whole table to going straight to the data. At work you decide which indexes to create based on the real queries, not out of habit.',
  importa: 'Without the right index, a query that takes 5 ms with 1,000 rows takes seconds with a million. And every unnecessary index makes every write slower. You need just the right ones.',
  preguntas: [
    { a: 'The tech lead', q: 'What are the most frequent queries against this table?', obt: 'The access patterns that justify each index.' },
    { a: 'The DBA', q: 'Are there indexes that are never used? How do we check?', obt: 'The query on pg_stat_user_indexes to find indexes that only cost.' },
    { a: 'The receptionist', q: 'By what do you search for a pet: name, owner’s phone, chip?', obt: 'The real search columns, which are the ones that need an index.' }
  ],
  evita: { q: 'Shall I put an index on every column?', por: 'It slows writes and takes space with no benefit. Ask which queries are slow and which columns they filter by.' }
},

'w10d2': {
  sirve: 'EXPLAIN ANALYZE shows how PostgreSQL runs a query and where the time goes. It is the tool you use when someone says "the schedule screen is slow".',
  importa: 'Without an execution plan, optimising is guessing, and guessing usually makes things worse. With it, you see in minutes whether an index is missing, whether the estimate is bad or whether the problem is not even in the database.',
  preguntas: [
    { a: 'The tech lead', q: 'Can we get this query’s plan with real-sized data?', obt: 'Access to an environment with realistic volume; plans with 10 rows deceive.' },
    { a: 'The DBA', q: 'Are this table’s statistics up to date?', obt: 'Whether the planner has correct information or needs an ANALYZE.' },
    { a: 'Whoever reported the slowness', q: 'What exactly were you doing, with which filters and at what time?', obt: 'The exact query to analyse, not a similar one.' }
  ],
  evita: { q: 'Is the database slow?', por: 'It is too general. Ask which query, with which parameters, and bring the execution plan.' }
},

'w10d3': {
  sirve: 'Recognising the classic slow patterns (N+1, SELECT *, functions on indexed columns, pagination with a big OFFSET) lets you fix them in reviews before they reach production.',
  importa: 'These four patterns explain most database performance problems in ordinary applications. Knowing them is the difference between fixing a problem in an hour or in a week.',
  preguntas: [
    { a: 'In a code review', q: 'How many queries does this screen fire to load?', obt: 'Spotting N+1 before it reaches production.' },
    { a: 'The tech lead', q: 'Do we have slow query logging turned on in any environment?', obt: 'An objective data source on which queries are problematic.' },
    { a: 'The DBA', q: 'Which table has grown faster than expected this quarter?', obt: 'Where the next performance problems will appear.' }
  ],
  evita: { q: 'How do I make the database faster?', por: 'Without measurement there is no answer. Ask which query is slowest and how many times it runs.' }
},

'w10d4': {
  sirve: 'Some rules, like "two appointments of the same vet cannot overlap", do not fit in a CHECK. PostgreSQL solves them with exclusion constraints over time ranges.',
  importa: 'If that rule only lives in the code, two simultaneous requests can create two overlapping appointments because both checked "there’s nothing" before the other one saved. The database is the only one that can guarantee it under concurrency.',
  preguntas: [
    { a: 'The receptionist', q: 'Does an appointment ending at 10:00 and another starting at 10:00 overlap?', obt: 'Whether the ranges are closed or half-open, a detail that changes the constraint.' },
    { a: 'The vet', q: 'Are there situations where you do accept two appointments at once, such as an emergency?', obt: 'Exceptions the constraint must allow for or that need another kind of appointment.' },
    { a: 'The tech lead', q: 'What does the API do when the database rejects an appointment for overlapping?', obt: 'How to translate that error into a 409 response with a useful message.' }
  ],
  evita: { q: 'Is it enough to check in the code that there is no overlap?', por: 'It is not enough under concurrency. Ask what happens if two receptionists book the same slot in the same second.' }
},

'w10d5': {
  sirve: 'Migrations version the schema changes so every environment (your machine, testing, production) is the same and each change can be reviewed.',
  importa: 'Changing the schema by hand in production is like deploying code without git. A badly thought-out migration (for example, adding a NOT NULL column to a huge table) can lock the database for minutes with users inside.',
  preguntas: [
    { a: 'The tech lead', q: 'Are migrations applied automatically on deployment or does someone run them by hand?', obt: 'The team’s real process and who is responsible if it fails.' },
    { a: 'The DBA', q: 'Does this migration lock the table? For how long with the current volume?', obt: 'The real risk of the migration and whether it needs splitting into several steps.' },
    { a: 'The tech lead', q: 'How do we undo this migration if the deployment goes wrong?', obt: 'A rollback plan before you need it.' }
  ],
  evita: { q: 'Can I edit a migration that is already in main?', por: 'If another environment already applied it, editing it breaks the sync. Ask whether it has been applied anywhere and create a new one if so.' }
},

'w10d6': {
  sirve: 'Understanding isolation levels and locks explains what happens when two users modify the same thing at once. It is what you need to choose between optimistic locking, pessimistic locking or retrying.',
  importa: 'Concurrency bugs do not reproduce on your machine and show up in production once a week. Whoever understands isolation diagnoses them; whoever does not calls them "weird failures" for months.',
  preguntas: [
    { a: 'The tech lead', q: 'Which isolation level do we use by default? Does any operation use another?', obt: 'The starting point for reasoning about which anomalies can occur.' },
    { a: 'The receptionist', q: 'Is it common for two people to edit the same record at once?', obt: 'The real frequency of the conflict, which decides whether optimistic locking is enough.' },
    { a: 'The DBA', q: 'Have we had deadlocks in production? On which tables?', obt: 'Where the system’s real contention is.' }
  ],
  evita: { q: 'Shall I put SERIALIZABLE on everything to be safe?', por: 'It forces many transactions to retry and can lower performance. Ask which specific anomaly you want to avoid in each operation.' }
},

/* ---------- Week 11 · HTTP and REST ---------- */

'w11d1': {
  sirve: 'Knowing what travels in an HTTP request (method, URL, headers, body) is what lets you debug any integration between frontend, backend and external services.',
  importa: 'Half the bugs between frontend and backend are HTTP ones: a missing header, a wrong Content-Type, a cookie that does not travel. Whoever can read a request in the browser’s tools solves them in minutes.',
  preguntas: [
    { a: 'The frontend team', q: 'Can you show me the exact request leaving the browser, with headers?', obt: 'Real data to debug, instead of assumptions about what the frontend sends.' },
    { a: 'The tech lead', q: 'Which headers are mandatory in our API: authentication, correlation, version?', obt: 'The header contract every client must meet.' },
    { a: 'The infrastructure team', q: 'Is there a proxy or load balancer between the client and the API that modifies headers?', obt: 'Knowing whether someone in between changes what arrives, a classic "works locally" case.' }
  ],
  evita: { q: 'Why doesn’t the API work?', por: 'It says nothing. Show the request, the response and the status code; with that anyone can help.' }
},

'w11d2': {
  sirve: 'Choosing the right verb (GET, POST, PUT, PATCH, DELETE) and code (200, 201, 400, 404, 409) makes any client understand your API without reading documentation.',
  importa: 'Returning 200 with an {"error": true} inside breaks retries, caches, monitoring and tools that rely on the codes. Using HTTP properly is what makes your API work with the rest of the world.',
  preguntas: [
    { a: 'The tech lead', q: 'Which code do we return when validation fails: 400 or 422?', obt: 'The team’s convention, so the whole API is consistent.' },
    { a: 'The frontend team', q: 'What do you need to distinguish in errors to show the right message?', obt: 'Which error codes and data are needed from the point of view of whoever consumes the API.' },
    { a: 'In a code review', q: 'Is this operation idempotent? Then why is it POST?', obt: 'Matching the verb to the operation’s real semantics.' }
  ],
  evita: { q: 'Shall I always return 200 and the error in the JSON?', por: 'It breaks everything that relies on HTTP. Ask what the client must do in each case and choose the code that communicates it.' }
},

'w11d3': {
  sirve: 'Designing URLs as resources (/pets/42/vaccines) makes the API predictable. At work it is the first thing discussed when a new endpoint is designed.',
  importa: 'URLs are a public contract: once a mobile app uses them, changing them forces a new version. Thinking them through at the start avoids years dragging routes like /getPetById around.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we use plurals in the routes? How much nesting do we allow?', obt: 'The team’s URL style rules.' },
    { a: 'The frontend team', q: 'Which screens are you going to build and what data does each need?', obt: 'The resources and relationships really needed, without inventing endpoints.' },
    { a: 'In a code review', q: 'Is this action a resource or a verb hidden in the URL?', obt: 'How to model actions like cancelling an appointment without breaking the REST style.' }
  ],
  evita: { q: 'What do I call the endpoint?', por: 'Without context it is a discussion of taste. Explain which resource it represents and which operations it supports.' }
},

'w11d4': {
  sirve: 'DTOs define exactly which JSON goes in and out of each endpoint, separate from the entities. That way you can change the database without breaking the API’s clients.',
  importa: 'Returning the entity directly exposes internal fields (passwords, flags, technical ids) and ties the API to the database. It is one of the most common security and design flaws in new APIs.',
  preguntas: [
    { a: 'The frontend team', q: 'Which fields exactly do you need in the appointments list and which only in the detail?', obt: 'DTOs fitted to each use, which avoid sending extra data.' },
    { a: 'The tech lead', q: 'How do we format dates, money and enums in the JSON?', obt: 'Format conventions that make the API consistent.' },
    { a: 'The security lead', q: 'Is there data that must never leave the API, even if it belongs to the user themselves?', obt: 'Sensitive fields that must be left out of every DTO.' }
  ],
  evita: { q: 'Shall I return the entity directly to save code?', por: 'You save lines today and expose internal data forever. Ask what the client needs and return only that.' }
},

'w11d5': {
  sirve: 'Errors in a standard format (Problem Details) and idempotent operations let clients know what failed and retry without duplicating appointments or charges.',
  importa: 'On real networks requests are repeated: the user double-clicks, the phone loses signal, the proxy retries. Without idempotency, each retry can be a duplicate appointment or charge.',
  preguntas: [
    { a: 'The frontend team', q: 'What does the app do if a create-appointment request takes a long time and does not answer?', obt: 'Whether the client retries, and therefore whether the operation needs an idempotency key.' },
    { a: 'The tech lead', q: 'Do we use Problem Details (RFC 9457) for all errors?', obt: 'The team’s common error format.' },
    { a: 'Support', q: 'Which error messages confuse users most?', obt: 'Errors that need rewriting so they are understood.' }
  ],
  evita: { q: 'What message do I put in the error?', por: 'Without knowing who reads it, there is no good message. Ask what the user or the client must do when they receive it.' }
},

'w11d6': {
  sirve: 'The OpenAPI contract is the API’s executable documentation: it generates clients, validates requests and lets frontend and backend work in parallel.',
  importa: 'Without a written contract, frontend and backend find out about changes when something breaks. With a contract, they are agreed beforehand and tools detect incompatibilities automatically.',
  preguntas: [
    { a: 'The frontend team', q: 'Can you start working with this contract and a mock server?', obt: 'Confirmation that the contract is enough to work in parallel.' },
    { a: 'The tech lead', q: 'Is the contract written first or generated from the code?', obt: 'The team’s approach (contract-first or code-first) and its reasons.' },
    { a: 'An external API client', q: 'What is missing from the documentation for you to integrate without asking us?', obt: 'Real documentation gaps seen from outside.' }
  ],
  evita: { q: 'Do we need to document the API if the code is understandable?', por: 'Clients do not read your code. Ask how someone with no access to the repository is going to integrate.' }
},

/* ---------- Week 12 · API with ASP.NET Core ---------- */

'w12d1': {
  sirve: 'Starting an ASP.NET Core project with the first endpoints is the starting point of any .NET backend. At work you will do it when creating a new service or a proof of concept.',
  importa: 'Day one decisions (Minimal APIs or controllers, folder structure, configuration) are copied into every following endpoint. Starting tidy saves a big refactor three months in.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we use Minimal APIs or controllers? Is there a team template?', obt: 'The team’s standard style, so you do not create a project different from the others.' },
    { a: 'The tech lead', q: 'Which .NET version do we use and when is it updated?', obt: 'The target version and the update policy.' },
    { a: 'A teammate', q: 'How do you start the project locally the first time?', obt: 'The real steps, which are often not in the README and are worth adding.' }
  ],
  evita: { q: 'How do I do a Hello World in ASP.NET?', por: 'That is in the official documentation. Ask about the team’s conventions you cannot find outside.' }
},

'w12d2': {
  sirve: 'Middlewares add behaviour to every request (logging, error handling, authentication, CORS). At work it is where everything cross-cutting in the API lives.',
  importa: 'The order of middlewares matters: authenticating after authorising, or catching errors after they happen, leaves security holes or unlogged errors. It is one of the most common causes of "it behaves oddly".',
  preguntas: [
    { a: 'The tech lead', q: 'Which middlewares do we have and in what order? Are any our own?', obt: 'The map of the project’s real pipeline.' },
    { a: 'The security team', q: 'Which security headers must be added to every response?', obt: 'Cross-cutting requirements that go in a middleware.' },
    { a: 'In a code review', q: 'Should this be a middleware or an endpoint filter?', obt: 'Whether the behaviour applies to everything or only some endpoints.' }
  ],
  evita: { q: 'Shall I put this try/catch in every endpoint?', por: 'Cross-cutting things go in one place. Ask whether there is an error handling middleware and use it.' }
},

'w12d3': {
  sirve: 'EF Core maps your entities to PostgreSQL tables. At work you configure that mapping so it respects the constraints, types and names you designed.',
  importa: 'Letting EF decide everything by convention produces tables different from the ones designed: generic types, odd names, missing constraints. Explicit mapping keeps code and database aligned.',
  preguntas: [
    { a: 'The tech lead', q: 'Is the schema driven by EF (code-first) or by the SQL we write by hand?', obt: 'The schema’s source of truth, a team decision with consequences.' },
    { a: 'The DBA', q: 'What naming convention do we use for tables and columns: snake_case?', obt: 'The convention EF must respect.' },
    { a: 'A teammate', q: 'How do we configure the connection string locally without pushing it to the repository?', obt: 'The team’s use of user secrets or environment variables.' }
  ],
  evita: { q: 'Shall I just let EF generate everything?', por: 'You lose control of types and constraints. Ask who rules the schema and configure the mapping to respect it.' }
},

'w12d4': {
  sirve: 'Saving properly with EF Core (one unit of work, SaveChanges once, explicit loading) avoids N+1 and half-saved data.',
  importa: 'N+1 is invisible with 10 rows and brings the API down with 10,000. Writes without a transaction leave inconsistent data. Both mistakes are among the most seen in EF Core code reviews.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we log the SQL queries EF generates in development?', obt: 'A way to see N+1 with your own eyes before it reaches production.' },
    { a: 'In a code review', q: 'How many times is SaveChanges called in this operation?', obt: 'Spotting split operations that should be atomic.' },
    { a: 'The DBA', q: 'Which endpoints fire the most queries per request?', obt: 'Where to look for N+1 first.' }
  ],
  evita: { q: 'Shall I use Include everywhere so it loads fast?', por: 'Include everywhere loads too much data. Ask what data each screen needs and load only that.' }
},

'w12d5': {
  sirve: 'Automatically validating input and paginating lists are requirements of any real API. Splitting Program.cs into endpoint files keeps the project readable as it grows.',
  importa: 'A list without pagination works until the day someone asks for 50,000 appointments and the API runs out of memory. Input validation is the first barrier against junk data and attacks.',
  preguntas: [
    { a: 'The frontend team', q: 'How many items do you show per page and how does the user navigate?', obt: 'The page size and the kind of pagination (by page or by cursor).' },
    { a: 'The tech lead', q: 'Which library or mechanism do we use to validate: DataAnnotations, FluentValidation?', obt: 'The team’s common tool.' },
    { a: 'In a code review', q: 'What is the maximum number of items a client can request here?', obt: 'An upper limit that protects the API from abusive requests.' }
  ],
  evita: { q: 'Shall I return all appointments and let the frontend paginate?', por: 'It moves the problem and makes it worse with the network. Ask how many appointments there will be in a year.' }
},

'w12d6': {
  sirve: 'Wrapping up the API with generated documentation, health checks and an end-to-end demo is what makes it ready for another team to consume or to deploy.',
  importa: 'An API without a health check cannot be monitored or load-balanced; without documentation, nobody uses it without asking. The end-to-end demo shows the pieces fit together, not just that they compile.',
  preguntas: [
    { a: 'The infrastructure team', q: 'Which health endpoint do you expect and what should it check: only the API or the database too?', obt: 'The health check contract for the load balancer or orchestrator.' },
    { a: 'The frontend team', q: 'Is the generated documentation enough for you or is something missing?', obt: 'Documentation gaps from the consumer’s point of view.' },
    { a: 'The tech lead', q: 'Which walkthrough do you want to see in the demo to consider it finished?', obt: 'The acceptance criterion of the complete API.' }
  ],
  evita: { q: 'Is the API finished now?', por: 'Finished for whom? Ask what has to work in the demo and what infrastructure needs to deploy it.' }
}

});
