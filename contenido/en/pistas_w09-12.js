/* One hint for each "Do it yourself" step: how to start, an example and how to know it is right.
   Key: w<week>d<day>; the order matches days[].steps. */
window.EN = window.EN || {};
window.EN.PISTAS = Object.assign(window.EN.PISTAS || {}, {

/* ---------- Week 9 ---------- */

'w9d1': [
  'If you use Docker, first check Docker Desktop is open ("docker ps" must not error). After the docker run, "docker ps" must show vetcare-db with status Up. If port 5432 is taken (you already had PostgreSQL installed), use "-p 5433:5432" and connect to 5433.',
  'With Docker: "docker exec -it vetcare-db psql -U postgres" and inside "CREATE DATABASE vetcare;" and "\\c vetcare". With a graphical tool (DBeaver, pgAdmin): host localhost, port 5432, user postgres, password dev. Check with "\\l": vetcare must appear in the list.',
  'Create first the tables without FKs (owner, vet, vaccine) and then the ones that depend on them (pet, appointment, visit, invoice, invoice_line). Template: "CREATE TABLE pet ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL REFERENCES owner(id), name text NOT NULL, … );".',
  'Examples: "weight_kg numeric(5,2) -- exact decimal, up to 999.99 kg", "starts_at timestamptz -- stores an instant with time zone", "name text -- in PostgreSQL text and varchar perform the same", "price numeric(10,2) -- money: never float, which loses cents". If the comment says "just because", look that type up.',
  'At the start of the file: "DROP TABLE IF EXISTS invoice_line, invoice, visit, appointment, pet, vaccine, vet, owner CASCADE;". Run: "psql -U postgres -d vetcare -f database/schema.sql" (with Docker, copy the file first or use "docker exec -i vetcare-db psql -U postgres -d vetcare < database/schema.sql"). Two runs in a row without errors = reproducible.'
],

'w9d2': [
  'NOT NULL on everything your attribute table marked as required. PRIMARY KEY on each id. FOREIGN KEY on each _id column. If you already put REFERENCES yesterday, now give it a name: "CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id) REFERENCES owner(id)".',
  'Examples: "CONSTRAINT ck_pet_weight_positive CHECK (weight_kg > 0)", "CONSTRAINT ck_owner_email_at CHECK (email LIKE \'%@%\')", "CONSTRAINT ck_appointment_range CHECK (ends_at > starts_at)", "CONSTRAINT ck_appointment_status CHECK (status IN (\'scheduled\',\'attended\',\'cancelled\'))".',
  'Format: prefix_table_what. pk_pet, fk_pet_owner, uq_owner_email, ck_appointment_range. When an INSERT fails, PostgreSQL will say "violates check constraint "ck_appointment_range"" and you will know instantly which rule was broken.',
  'One INSERT per constraint, changing only the value that breaks it: weight -1, email without @, end before start, status "deleted", made-up owner_id, NULL name, duplicate id… Put a comment above each one: "-- must fail on ck_pet_weight_positive".',
  'Run the whole file with psql: each INSERT will fail separately. Copy the message: "-- ERROR: new row for relation "pet" violates check constraint "ck_pet_weight_positive"". If any does NOT fail, that constraint is missing: add it to the schema and repeat.'
],

'w9d3': [
  'Make it realistic and varied: an owner with 3 pets, another with none, pets of different species, past, future and cancelled appointments, a pet without a chip, a vet with no appointments. Those edge cases are what will make tomorrow’s queries interesting.',
  'Pattern: "WITH o AS ( INSERT INTO owner (name, email) VALUES (\'Ana\', \'ana@mail.com\') RETURNING id ) INSERT INTO pet (owner_id, name, species, weight_kg) SELECT id, \'Max\', \'dog\', 12.5 FROM o;". That way you do not copy ids by hand and the script works even if the ids change.',
  '"BEGIN; UPDATE pet SET weight_kg = weight_kg * 1.1 WHERE species = \'cat\';" psql answers "UPDATE 3": check that number is the one you expected. Look at the result with a SELECT and then "ROLLBACK;". Another SELECT confirms everything went back to how it was. This is the routine for touching production data.',
  '"DELETE FROM owner WHERE name = \'Ana\';" must fail with "violates foreign key constraint "fk_pet_owner"". If the delete works and their pets disappear, your FK has ON DELETE CASCADE: change it to RESTRICT if your business rule says an owner with pets cannot be deleted.',
  'You need a UNIQUE constraint on the combination (for example pet_id, vaccine_id, applied_on). Then: "INSERT INTO applied_vaccine (…) VALUES (…) ON CONFLICT (pet_id, vaccine_id, applied_on) DO NOTHING;". Run it twice: the second must answer "INSERT 0 0".'
],

'w9d4': [
  'A difficulty ladder: 1) all pets, 2) only dogs, 3) pets over 10 kg, 4) ordered by weight, 5) this week’s appointments… up to 10) something combining several filters. Above each one, a comment with the business question it answers: "-- Which dogs weigh more than 20 kg?".',
  'BETWEEN: "WHERE starts_at BETWEEN \'2026-06-01\' AND \'2026-06-07\'". IN: "WHERE species IN (\'dog\',\'cat\')". ILIKE (ignores case): "WHERE name ILIKE \'ma%\'". IS NULL: "WHERE chip IS NULL". Remember: "= NULL" never works; always IS NULL.',
  'First set some weight to NULL in the seed. Then: "SELECT count(*) FROM pet WHERE weight_kg != 10;" and "SELECT count(*) FROM pet WHERE weight_kg IS DISTINCT FROM 10;". The second gives more rows, because != discards the NULLs (NULL != 10 gives "unknown", not true). Note both numbers and the explanation.',
  '"ORDER BY weight_kg DESC" puts NULLs first in PostgreSQL. "ORDER BY weight_kg DESC NULLS LAST" sends them to the end. Run both and compare the first rows. On a "heaviest pets" screen you want NULLS LAST.',
  '"SELECT weight_kg * 1000 AS grams FROM pet WHERE grams > 5000;" gives "column "grams" does not exist". WHERE is evaluated before SELECT, so the alias does not exist yet. Write the real order in a comment: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.'
],

'w9d5': [
  'Start from appointment and join the rest: "FROM appointment a JOIN pet p ON p.id = a.pet_id JOIN owner o ON o.id = p.owner_id JOIN vet v ON v.id = a.vet_id WHERE a.starts_at::date = current_date ORDER BY a.starts_at". If there are no appointments today, change the seed’s date or use a fixed date.',
  '"SELECT p.name, count(vi.id) AS visits FROM pet p LEFT JOIN visit vi ON vi.pet_id = p.id GROUP BY p.id, p.name". Careful: count(vi.id), not count(*). count(*) would count 1 for pets without visits, because the row with NULL also counts.',
  'Version A: "LEFT JOIN visit vi ON vi.pet_id = p.id AND vi.visited_on >= \'2026-01-01\'". Version B: the same filter in the WHERE. B loses the pets without visits: the WHERE discards the rows with NULL and turns the LEFT JOIN into an INNER JOIN. Note how many rows each one gives.',
  'A: "SELECT o.* FROM owner o LEFT JOIN pet p ON p.owner_id = o.id WHERE p.id IS NULL". B: "SELECT o.* FROM owner o WHERE NOT EXISTS (SELECT 1 FROM pet p WHERE p.owner_id = o.id)". Both must return the same owners. If your seed has no owner without a pet, add one.',
  'Put EXPLAIN in front of step 1’s query. You will see a tree with nodes such as Hash Join, Nested Loop or Seq Scan. You do not need to understand it today: copy the plan into a comment. In week 10 you will come back to it and be surprised by how much you already understand.'
],

'w9d6': [
  'Appointments per vet: GROUP BY v.id, v.name with count(*). Revenue per month: "date_trunc(\'month\', i.issued_at) AS month, sum(il.amount)". Species: GROUP BY p.species ORDER BY count(*) DESC. Average duration: "avg(ends_at - starts_at)". Put above each one the business question it answers.',
  'Example: "SELECT v.name, count(*) AS total, count(*) FILTER (WHERE a.status = \'cancelled\') AS cancelled FROM appointment a JOIN vet v ON … GROUP BY v.name". A single pass over the table gives you the total and the subset in separate columns.',
  '"BEGIN; INSERT INTO invoice (…) RETURNING id; INSERT INTO invoice_line (…) …; UPDATE appointment SET status = \'invoiced\' WHERE id = …; COMMIT;". After the COMMIT, check with SELECT that the invoice, its lines and the updated appointment all exist.',
  'Repeat the transaction putting a negative amount on one line. When it fails, PostgreSQL marks the transaction as aborted: do "ROLLBACK;". Check with SELECT that neither the invoice nor any line was left. That is atomicity: all or nothing.',
  'Structure: 1) main tables and relationships, 2) three type decisions (money, dates, ids), 3) three constraints and which rule they protect, 4) the day’s schedule query explained JOIN by JOIN. Record yourself. If any explanation starts with "I think…", go over that part again.'
],

/* ---------- Week 10 ---------- */

'w10d1': [
  'Example: "INSERT INTO appointment (id, pet_id, vet_id, starts_at, ends_at, status) SELECT gen_random_uuid(), (SELECT id FROM pet ORDER BY random() LIMIT 1), …, ts, ts + interval \'30 min\', \'scheduled\' FROM generate_series(1, 500000) g, LATERAL (SELECT now() - random() * interval \'3 years\' AS ts) t;". If you have an overlap exclusion constraint, add it afterwards (week 10, day 4).',
  'In psql: "\\timing on". Then run the query three times: "SELECT * FROM appointment WHERE vet_id = \'…\' AND starts_at >= \'2026-03-01\' AND starts_at < \'2026-03-02\';". Note the time of the third run (the first may be slower because the data is not cached yet).',
  '"CREATE INDEX ix_appointment_vet_start ON appointment (vet_id, starts_at);". Measure three times again. It should go from hundreds of ms to under 1 ms. Note both times in indexes.sql as a comment: "-- without index: 180 ms; with index: 0.4 ms".',
  'Filter only by starts_at and put EXPLAIN ANALYZE: you will see a Seq Scan or poor use of the index, because the index’s first column is vet_id. Create "CREATE INDEX ix_appointment_starts_at ON appointment (starts_at);" and repeat: now Index Scan or Bitmap Index Scan should appear. The order of columns in an index matters.',
  '"\\di+" shows the indexes with their size. Or: "SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)), idx_scan FROM pg_stat_user_indexes;". idx_scan = 0 means it has never been used. Note the unused ones as candidates for deletion.'
],

'w10d2': [
  'Put it in front of each query: "EXPLAIN (ANALYZE, BUFFERS) SELECT …". Careful: ANALYZE really runs the query, so with UPDATE or DELETE wrap it in BEGIN … ROLLBACK. Copy each plan to performance-notes.md.',
  'Read the plan from the bottom up and from most indented to least indented. The top node is the main one. "rows=" in the left parenthesis is the estimate and "actual … rows=" is reality. If they differ by ×10 or more, the planner is badly informed. Execution Time is at the very end.',
  'Look for "Seq Scan on appointment" with a huge "Rows Removed by Filter": it reads the whole table to keep a few rows. Create an index on the filter column and repeat the EXPLAIN. Compare Execution Time before and after and note it down.',
  'Turn off autovacuum on the table for the experiment: "ALTER TABLE appointment SET (autovacuum_enabled = false);". Insert 200,000 rows with generate_series and run EXPLAIN ANALYZE: you will see estimated rows very different from actual. Then "ANALYZE appointment;" and repeat. When you finish, turn autovacuum back on.',
  'For each query: the query, the plan before, what you changed (an index, an ANALYZE, rewriting the query), the plan after and one sentence with the why: "it went from Seq Scan (220 ms) to Index Scan (0.3 ms) because the filter on vet_id now uses ix_appointment_vet_start".'
],

'w10d3': [
  'With Npgsql or Dapper in the Playground: one query fetches the pets and then, in a foreach, one query per pet for its visits. Add a counter that adds 1 for each query run. With 100 pets it is 101 queries: that is N+1. Also measure the total time with Stopwatch.',
  'A single query with a JOIN: "SELECT p.id, p.name, v.visited_on FROM pet p LEFT JOIN visit v ON v.pet_id = p.id" and group in C# by pet. Compare: 101 queries versus 1, and the total time. Over a network, each trip to the database costs milliseconds even if the query is trivial.',
  'Cursor: "WHERE (starts_at, id) > (\'2026-03-01 10:00\', \'…last_id…\') ORDER BY starts_at, id LIMIT 20". OFFSET: "ORDER BY starts_at, id OFFSET 100000 LIMIT 20". Measure both with EXPLAIN ANALYZE: OFFSET reads and discards 100,000 rows; the cursor jumps straight to the point with the index on (starts_at, id).',
  '"CREATE INDEX ix_appointment_vet_covering ON appointment (vet_id, starts_at) INCLUDE (status);". Then ask only for the index’s columns: "SELECT starts_at, status FROM appointment WHERE vet_id = …". Run "VACUUM appointment;" first to update the visibility map; otherwise a normal Index Scan may still appear.',
  'Slow: "WHERE date_trunc(\'day\', starts_at) = \'2026-03-01\'" (the function on the column prevents using the index). Fast: "WHERE starts_at >= \'2026-03-01\' AND starts_at < \'2026-03-02\'". Compare the two EXPLAINs. Rule: leave the column "bare" on one side of the operator.'
],

'w10d4': [
  '"CREATE EXTENSION IF NOT EXISTS btree_gist;" and then "ALTER TABLE appointment ADD CONSTRAINT ex_appointment_no_overlap EXCLUDE USING gist (vet_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> \'cancelled\');". If it fails because your data already has overlaps, delete them or mark them as cancelled first.',
  'For the same vet: partial overlap (10:00–10:30 versus 10:15–10:45), full containment (10:00–11:00 versus 10:15–10:30) and an identical start. Also check that the adjacent 10:30–11:00 DOES go in: tstzrange is half-open [start, end), so touching is not overlapping.',
  'Insert an appointment with status "cancelled" in a taken slot: it must go in. Then try to change it to "scheduled" with UPDATE: it must fail. That way you check the constraint’s WHERE clause works in both directions.',
  '"CREATE UNIQUE INDEX ix_owner_email_lower ON owner (lower(email));". Insert "ana@mail.com" and then "ANA@Mail.com": the second must fail. Without lower(), PostgreSQL would treat them as different and you would have two accounts for the same person.',
  'Make two lists. "Guaranteed by the database": positive weight, email unique regardless of case, no overlaps, FKs… "In the code": no vaccination before 8 weeks, late cancellation surcharge… For each one in the code, a sentence on why it does not fit in the database (it needs data from another table, it depends on the current time…).'
],

'w10d5': [
  'Split your schema.sql into small files: 001_create_base_tables.sql, 002_add_constraints.sql, 003_performance_indexes.sql, 004_overlap_exclusion.sql. Use numbers with leading zeros so they sort properly. Never edit a migration that has already been applied anywhere: create the next one.',
  '"CREATE TABLE IF NOT EXISTS schema_migration ( version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now() );". At the end of each file: "INSERT INTO schema_migration (version) VALUES (\'003\');". Better still: wrap each file in BEGIN … COMMIT so the migration and its record go together.',
  'Outline in bash: "for f in database/migrations/*.sql; do v=$(basename "$f" | cut -c1-3); done_=$(psql -tAc "SELECT 1 FROM schema_migration WHERE version=\'$v\'"); [ "$done_" = "1" ] || psql -v ON_ERROR_STOP=1 -f "$f"; done". ON_ERROR_STOP makes it stop at the first error instead of carrying on blindly.',
  '"DROP DATABASE vetcare; CREATE DATABASE vetcare;" and run your script. Compare the schema: "pg_dump --schema-only vetcare > after.sql" and diff it with a dump from before. If it is identical, anyone can recreate your database from scratch.',
  'Three separate migrations: 1) "ALTER TABLE pet ADD COLUMN sex text;" (allows NULL, instant). 2) "UPDATE pet SET sex = \'unknown\' WHERE sex IS NULL;" (backfills; on huge tables, in batches). 3) "ALTER TABLE pet ALTER COLUMN sex SET NOT NULL;". That way there is never a moment when the table is locked for long.'
],

'w10d6': [
  'Session A: "BEGIN; SELECT stock FROM vaccine WHERE id=1;" (sees 10). Session B: the same (sees 10). A: "UPDATE vaccine SET stock = 9 WHERE id=1; COMMIT;". B: "UPDATE vaccine SET stock = 9 WHERE id=1; COMMIT;". Result: stock 9 when it should be 8. An update was lost. Use two terminal windows side by side.',
  'In both sessions: "SELECT stock FROM vaccine WHERE id=1 FOR UPDATE;". Session B waits until A COMMITs, and then sees the already updated value (9). If B calculates from what it reads, the final result is 8. It works, but it blocks: note that trade-off.',
  'Add "version int NOT NULL DEFAULT 0". Update like this: "UPDATE vaccine SET stock = 9, version = version + 1 WHERE id = 1 AND version = 0;". The second session, which read version 0, gets "UPDATE 0": nobody blocked it, but it finds out about the conflict and must reread and retry (or tell the user).',
  'A: "BEGIN; INSERT appointment 10:00–10:30 vet X;" (no COMMIT). B: insert 10:15–10:45 for the same vet → it waits. A: COMMIT → B fails with "conflicting key value violates exclusion constraint". No check done in the code achieves this with two simultaneous requests.',
  'One example per topic: indexes (the multicolumn one on appointments and why that order), EXPLAIN (the query that went from Seq Scan to Index Scan), migrations (the NOT NULL column in three steps), concurrency (lost update and when to use optimistic or pessimistic). Record yourself and listen.'
],

/* ---------- Week 11 ---------- */

'w11d1': [
  'curl comes installed on macOS, Linux and Windows 10 or later (in PowerShell use "curl.exe" so as not to call the alias). With -v you will see lines starting with ">" (what you send), "<" (what you receive) and "*" (connection information, such as TLS).',
  'Request line: "> GET /users/octocat HTTP/2". Outgoing headers: "> Host:", "> User-Agent:", "> Accept:". Status: "< HTTP/2 200". Return headers: "< content-type: application/json", "< cache-control"… The JSON body comes after an empty line. Mark each part with a colour or a comment.',
  'Look at the status code and the response’s content-type: if it is still JSON, the API ignored your Accept; if it is a 406, it explicitly rejected it. Note which behaviour it has and which you would prefer for VetCare (the usual is to answer only JSON).',
  'Press F12, go to the Network tab and reload the page. Click on a request and check Headers, Preview and Response. Choose three of different kinds: the HTML document, a JS or CSS file and an XHR or fetch request (filter by Fetch/XHR). Compare their headers.',
  'Structure in your own words: 1) request line (method, path, version), 2) headers (what Host, Accept, Content-Type and Authorization are for), 3) body (when it has one and when not) and the same for the response. Finish with a list of the headers VetCare will use and what for.'
],

'w11d2': [
  'Markdown table: | Operation | Verb | Path | Success | Errors |. Example: | Book appointment | POST | /api/appointments | 201 | 400, 404 (pet does not exist), 409 (slot taken), 422 |. The 10 operations come from your week 1 FRs.',
  'Idempotent = repeating it gives the same final result. GET, PUT and DELETE are (deleting twice leaves the appointment just as deleted). POST is not (two POSTs create two appointments). Write the why in each row. PATCH depends: "add 1 to the weight" is not idempotent; "set the weight to 12" is.',
  'For each POST ask: does it create a new resource? → POST is fine. Does it replace a whole one I already know by its id? → PUT. Does it change some fields? → PATCH. Does it remove? → DELETE. Typical mistake: "POST /api/appointments/delete" instead of "DELETE /api/appointments/{id}".',
  '409 Conflict means the request is well formed, but clashes with the resource’s current state. 400 would be "the request is badly written" (and it is not). 200 would lie (nothing was created). Write the error body in the table: "type: slot-taken, detail: Dr. Pérez already has an appointment from 10:00 to 10:30".',
  '-i shows the response headers. Also try /status/201, /status/404 and /status/422. Look at the first line "HTTP/2 409". You can also do "curl -i -X DELETE https://httpbin.org/delete" to see other methods.'
],

'w11d3': [
  'Format: "GET /api/pets/{id} — returns a pet". Go through the resources: owners, pets, appointments, vets, applied vaccines, and for each one the operations you need (not all: if nobody deletes vets through the API, there is no DELETE).',
  'Checklist: no verbs (/api/getAppointments → GET /api/appointments), plural (/api/appointment → /api/appointments), lowercase with hyphens (/api/applied-vaccines) and at most two levels (/api/owners/{id}/pets is fine; /api/owners/{id}/pets/{id}/vaccines/{id} is too much: use /api/applied-vaccines/{id}).',
  'Example: "GET /api/appointments?vetId=…&from=2026-06-01&to=2026-06-07&status=scheduled&sort=start&limit=20&cursor=…". Document each parameter: type, whether it is required, default value and maximum allowed (for example, limit at most 100).',
  'Two common conventions: a sub-resource with POST ("POST /api/appointments/{id}/cancellation") or a PATCH of the status ("PATCH /api/appointments/{id}" with {"status":"cancelled"}). Choose one and apply it to every action. What matters is being consistent.',
  'Read it out loud to someone who is not a programmer, or imagine they are someone else: "GET slash api slash appointments slash id"… If you have to add "this is actually for…", the name fails. Rename until every path explains itself.'
],

'w11d4': [
  'For each endpoint, two blocks: Request and Response, with realistic data: "{"petId":"3f2a…","vetId":"9c1b…","start":"2026-06-10T10:00:00-05:00","reason":"Annual vaccine"}". Put ids and dates in their real format; no "string" or "xxx".',
  'Check each field of the response: does any screen show it or any client use it? If not, out. Typical candidates: internal audit dates, ids of junction tables, technical flags, passwords (never!). Fewer fields = fewer things you cannot change later.',
  'Fields the server decides and not the client: id, initial status, creation date, calculated price, who created it (it comes from the authenticated user). If the client could send "price: 0" or "status: attended", you would have a security hole.',
  'A single envelope for every list: "{"data":[…],"pagination":{"limit":20,"hasMore":true,"nextCursor":"eyJ…"}}". With a cursor there is no need for "total" (counting everything is expensive). Use it for appointments, pets, owners… That way the frontend always paginates the same way.',
  'A "Conventions" section at the start: dates in ISO 8601 with zone ("2026-06-10T10:00:00-05:00"), money as a decimal string with currency ("{"amount":"45.00","currency":"USD"}"), enums in lowercase ("scheduled"), ids as uuid. Then go over all the examples and fix those that do not comply.'
],

'w11d5': [
  'Table: | type | title | status |. Examples: "/errors/validation | Invalid data | 422", "/errors/slot-taken | Time slot not available | 409", "/errors/not-found | Resource not found | 404", "/errors/forbidden | No permission | 403". type is a stable identifier the frontend uses to decide what to do.',
  'RFC 9457 format: "{"type":"/errors/validation","title":"Invalid data","status":422,"detail":"There are 2 fields with errors","errors":{"start":["Must be a future date"],"petId":["Required"]}}". The 409 must say what it clashes with; the 404, which resource it did not find.',
  'Operations needing an Idempotency-Key are the POSTs whose duplicate does harm: create appointment (two appointments), record payment (two charges) and send a manual reminder. PUT and DELETE are already idempotent by nature. Write the list with a one-sentence reason for each.',
  'Flow: the client generates a uuid and sends it in the Idempotency-Key header. The server stores (key, body hash, response) for 24 h. If the key arrives again with the same body, it returns the stored response without repeating the operation. If it arrives with another body, it answers 422. If the first request is still being processed, it answers 409.',
  'Look in your messages for: table or constraint names ("violates ck_pet…"), stack traces, file paths, library versions or "the user exists but the password fails". Replace them with messages for the user: "The weight must be greater than 0". The technical detail goes to the log, never to the response.'
],

'w11d6': [
  'Skeleton: "openapi: 3.1.0 / info: { title: VetCare API, version: 1.0.0 } / paths: { /api/appointments: { get: …, post: … }, /api/appointments/{id}: { get: … } }". Each operation has parameters, requestBody (if applicable) and responses with at least the success and one error. Copy the sample JSON from api-contract.md.',
  'Define once "components: schemas: Appointment: {type: object, properties: …}" and use it with "$ref: \'#/components/schemas/Appointment\'". Do the same with the error: "components: schemas: ProblemDetails". If you write the same property twice, a $ref is missing there.',
  'Paste the YAML on the left; errors appear at the top in red, with a line number. The most common are indentation (always use 2 spaces, never tabs), a badly written $ref or a path parameter {id} not defined in parameters. Fix until none are left.',
  'Expand each endpoint in the right panel: do you understand what it does from the summary alone? Do the examples make sense? Are all possible errors there? If you have to explain something out loud, add it as a description in the YAML.',
  'Prepare three decisions with their discarded alternative: "POST /appointments/{id}/cancellation instead of DELETE because the appointment is not deleted: it stays in the history", "409 and not 400 for the overlap", "the price is not in the input DTO because the server calculates it". Record yourself for 5 minutes.'
],

/* ---------- Week 12 ---------- */

'w12d1': [
  '"dotnet new web -o src/VetCare.Api", "dotnet sln add src/VetCare.Api", "dotnet add src/VetCare.Api reference src/VetCare.Domain src/VetCare.Infrastructure", "dotnet add src/VetCare.Api package Microsoft.AspNetCore.OpenApi". Check with "dotnet build" at the root.',
  '"app.MapGet("/health", () => Results.Ok(new { status = "ok" }));". For appointments use a static list: "var appointments = new List<AppointmentDto>();" with MapGet("/api/appointments"), MapGet("/api/appointments/{id:guid}") and MapPost("/api/appointments"). In the GET by id: if it does not exist, "Results.NotFound()".',
  '"dotnet run --project src/VetCare.Api" tells you the port (for example, http://localhost:5080). Try: "curl -i localhost:5080/api/appointments", a GET with a made-up id (must give 404) and a POST: "curl -i -X POST localhost:5080/api/appointments -H "Content-Type: application/json" -d \'{"petId":"…"}\'".',
  'In the POST: "return Results.Created($"/api/appointments/{appointment.Id}", appointment);". With curl -i you will see "HTTP/1.1 201 Created" and "Location: /api/appointments/3f2a…". Copy that path and do a GET with it: it must return the appointment just created.',
  'You need "builder.Services.AddOpenApi();" and "app.MapOpenApi();" in Program.cs. Open http://localhost:5080/openapi/v1.json: you will see your routes in JSON. Compare it with your hand-written openapi.yaml: whatever is missing (summaries, errors) you will add on day 6.'
],

'w12d2': [
  '"app.Use(async (ctx, next) => { var sw = Stopwatch.StartNew(); var traceId = Activity.Current?.TraceId.ToString() ?? ctx.TraceIdentifier; ctx.Response.Headers["X-Trace-Id"] = traceId; await next(); logger.LogInformation("{Method} {Path} → {Status} in {Ms} ms [{TraceId}]", …); });". Check with curl -i that X-Trace-Id appears.',
  'Exceptions in the domain: NotFoundException, TimeSlotTakenException, BusinessRuleException. In Program.cs: "builder.Services.AddProblemDetails();" and "app.UseExceptionHandler();". Then an IExceptionHandler (or a handler in UseExceptionHandler) that translates each kind of exception into its code.',
  'Create temporary endpoints: "app.MapGet("/test/404", () => { throw new NotFoundException("Appointment"); });". Call them with curl -i and check: the right code, "Content-Type: application/problem+json" and the body with type, title and status. Delete them when you finish.',
  '"app.Use((ctx, next) => { ctx.Response.StatusCode = 503; return Task.CompletedTask; });" placed BEFORE your logging middleware: the response goes out, but there is no log, because the request never reached the logging. Move it AFTER: now the 503 is logged. Conclusion: the order of the app.Use calls is the order they run in.',
  'Throw "throw new Exception("boom with internal data")". With curl you must get a 500 with a generic problem+json, without "at VetCare.Api…" or the internal message. Careful: in the Development environment, ASP.NET shows more detail; also try with "ASPNETCORE_ENVIRONMENT=Production dotnet run".'
],

'w12d3': [
  '"dotnet add src/VetCare.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL". Create "public class VetCareDbContext(DbContextOptions<VetCareDbContext> options) : DbContext(options) { public DbSet<Appointment> Appointments => Set<Appointment>(); … }". One DbSet per aggregate root.',
  'In OnModelCreating: "modelBuilder.Entity<Appointment>(e => { e.ToTable("appointment"); e.Property(x => x.Start).HasColumnName("starts_at"); e.Property(x => x.VetId).HasColumnName("vet_id"); });". Alternative: the EFCore.NamingConventions package with ".UseSnakeCaseNamingConvention()", which does it automatically (but check the columns whose name differs, like starts_at).',
  '"dotnet user-secrets init --project src/VetCare.Api" and "dotnet user-secrets set "ConnectionStrings:VetCare" "Host=localhost;Database=vetcare;Username=postgres;Password=dev" --project src/VetCare.Api". In Program.cs: "builder.Services.AddDbContext<VetCareDbContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("VetCare")));".',
  'The endpoint receives the DbContext: "app.MapGet("/api/appointments", async (VetCareDbContext db) => await db.Appointments.OrderBy(a => a.Start).Take(20).Select(a => new AppointmentDto(…)).ToListAsync());". If it comes out empty, check you ran seed.sql against this same database.',
  'Add inside UseNpgsql or in AddDbContext: "o.UseNpgsql(…).EnableSensitiveDataLogging().LogTo(Console.WriteLine, LogLevel.Information)". Call the endpoint and look for the generated SELECT in the console. Check: snake_case names, the LIMIT 20 and only the DTO’s columns. Development only: it shows real data.'
],

'w12d4': [
  'MapPost receives the DTO and the DbContext: create the entity with its domain factory ("Appointment.Schedule(…)"), "db.Appointments.Add(appointment); await db.SaveChangesAsync();" and return "Results.Created(…)". Check with a SELECT in psql that the row really exists.',
  '"catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: "23P01" }) { return Results.Problem(type: "/errors/slot-taken", title: "Time slot not available", statusCode: 409); }". 23P01 is PostgreSQL’s code for violating an exclusion constraint.',
  'First POST: 10:00–10:30 → 201. Second POST, same vet, 10:15–10:45 → 409 with problem+json. Third, 10:30–11:00 → 201 (it is adjacent, it does not overlap). Keep the three curl commands in a .http or .sh file to repeat them.',
  'History endpoint: load the pet and then, inside a foreach, "await db.Visits.Where(v => v.PetId == …).ToListAsync()" for each thing. Count the SELECTs that appear in the console: one more per item. That is N+1.',
  'Projection in a single query: "db.Pets.Where(p => p.Id == id).Select(p => new HistoryDto(p.Name, p.Visits.OrderByDescending(v => v.Date).Select(v => new VisitDto(v.Date, v.Reason)).ToList())).SingleOrDefaultAsync()". A single SELECT with a JOIN must appear in the console.'
],

'w12d5': [
  'In the DTO: "public record CreateAppointmentRequest([Required] Guid? PetId, [Required] DateTimeOffset? Start, [StringLength(200)] string? Reason);". Use the same limits you put in api-contract.md. Nullable types with [Required] detect that a field is missing (otherwise, an empty Guid would pass as valid).',
  'A generic IEndpointFilter: "class ValidationFilter<T> : IEndpointFilter { … var dto = ctx.Arguments.OfType<T>().First(); var results = new List<ValidationResult>(); if (!Validator.TryValidateObject(dto, new ValidationContext(dto), results, true)) return Results.ValidationProblem(…, statusCode: 422); return await next(ctx); }". Apply it with ".AddEndpointFilter<ValidationFilter<CreateAppointmentRequest>>()".',
  'Send a POST without petId and with a 300-character reason. You must get 422 with "errors: { "PetId": ["…"], "Reason": ["…"] }". If you get 400, ASP.NET could not even read the JSON (check the syntax); if you get 201, the filter is not applied to that endpoint.',
  'Create "static class AppointmentEndpoints { public static RouteGroupBuilder MapAppointments(this IEndpointRouteBuilder app) { var g = app.MapGroup("/api/appointments"); g.MapGet("/", …); return g; } }". In Program.cs only "app.MapAppointments(); app.MapPets();" is left. Count Program.cs’s lines: fewer than 60.',
  'Encoded cursor: base64 of "start|id" of the last row. Query: ".Where(a => a.Start > cursorStart || (a.Start == cursorStart && a.Id.CompareTo(cursorId) > 0)).OrderBy(a => a.Start).ThenBy(a => a.Id).Take(limit + 1)". If limit + 1 rows come back, there is a next page. Ask for three pages and check no appointment is repeated or missing.'
],

'w12d6': [
  'With Scalar: "dotnet add package Scalar.AspNetCore" and "app.MapScalarApiReference();" (or Swagger UI with Swashbuckle). Open /scalar/v1 and run a GET, a POST and an error from the browser. Enable it only in Development: "if (app.Environment.IsDevelopment())".',
  'Example: "g.MapPost("/", Create).WithSummary("Books an appointment").Produces<AppointmentDto>(201).ProducesValidationProblem(422).ProducesProblem(409);". Reload the documentation: each endpoint must show all its possible codes. Compare it with your week 11 openapi.yaml.',
  '"builder.Services.AddHealthChecks().AddNpgSql(connection, tags: new[] { "ready" });". "app.MapHealthChecks("/health/live", new() { Predicate = _ => false }); app.MapHealthChecks("/health/ready", new() { Predicate = r => r.Tags.Contains("ready") });". With "docker stop vetcare-db", /health/ready must give 503 and /health/live stay at 200.',
  'Go through each point and write ✓ or ✗ with the concrete proof (a curl command or a screenshot). Prioritise what affects the client: right codes, errors in problem+json, validation and pagination. Cosmetic things last.',
  'Prepare the script and the commands in a .http or .sh file so you do not type live. Order: create owner (201) → create pet with that owner → book appointment (201) → overlap it (409) → GET history. Record yourself with a split screen: terminal on one side and the database on the other.'
]

});
