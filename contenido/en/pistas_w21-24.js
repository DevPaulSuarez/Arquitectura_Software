/* One hint for each "Do it yourself" step: how to start, an example and how to know it is right.
   Key: w<week>d<day>; the order matches days[].steps. */
window.EN = window.EN || {};
window.EN.PISTAS = Object.assign(window.EN.PISTAS || {}, {

/* ---------- Week 21 ---------- */

'w21d1': [
  'Table: | Operation | p50 | p95 | p99 |. Example: "GET daily agenda | 80 ms | 300 ms | 800 ms", "POST create appointment | 120 ms | 400 ms | 1 s", "search pet | 50 ms | 200 ms | 500 ms". Base it on what users tolerate: the receptionist is on the phone, so under 1 s for almost everything.',
  'Example for the agenda with a 300 ms p95: network and TLS 40 ms, middleware and authentication 10 ms, SQL query 150 ms, serialisation 20 ms, margin 80 ms. Write it as a table. The sum must give the p95, and the margin reminds you something you had not foreseen always shows up.',
  '1 − 0.95³ = 1 − 0.857 = 0.143 → 14 % of page loads will have at least one slow call. With 10 calls: 1 − 0.95¹⁰ ≈ 40 %. Write the conclusion: "what is rare for one request (5 %) is frequent for a page that makes several".',
  'Table: | Resource | Utilisation | Saturation | Errors |. CPU: % used in top or in Docker Desktop | process queue (load average) | —. PostgreSQL connections: active connections versus the pool maximum | requests waiting for a connection | timeouts getting a connection. Do the same with memory and disk.',
  'One visible sentence, in bold, at the start of the document: "No optimisation goes in without a measurement before and another after, with the same load and the same data". For the rest of the week, every change must have those two measurements or it does not count.'
],

'w21d2': [
  '"app.Use(async (ctx, next) => { var sw = Stopwatch.StartNew(); await next(); sw.Stop(); if (sw.ElapsedMilliseconds > 500) logger.LogWarning("Slow request {Method} {Route} {Ms} ms", ctx.Request.Method, ctx.Request.Path, sw.ElapsedMilliseconds); });". Put it among the first in the pipeline so it measures everything that comes after it.',
  'Turn on the SQL log (week 12) and use the web for 2 minutes: open the schedule, change day, open records, create an appointment. Look in the console for the same SELECT repeated with different parameters (N+1) and queries that bring columns nobody shows. Note it all down.',
  'Reuse generate_series from week 10: 10,000 pets spread among about 3,000 owners and 50,000 appointments over the last 2 years. Afterwards: "ANALYZE;". Check with "SELECT count(*) FROM appointment;". If you still have the 500,000 from week 10, they work too.',
  '"bombardier -c 20 -d 30s -l "http://localhost:5080/api/v1/agenda?day=2026-06-10"" (-l shows the percentiles). With hey: "hey -z 30s -c 20 URL". It needs authentication: pass the cookie with "-H "Cookie: vetcare_session=…"". Note p50, p95 and p99, and also the concurrency and duration you used.',
  'Table: | Endpoint | p95 target | Measured p95 | Meets it? |. Whatever meets it stays as it is even if "it could go faster". Whatever does not goes onto a list of candidates, sorted by how far it is from the target.'
],

'w21d3': [
  'In compose: "command: postgres -c shared_preload_libraries=pg_stat_statements" and restart. Inside: "CREATE EXTENSION pg_stat_statements;". Use the app for a few minutes and then: "SELECT left(query, 80), calls, round(total_exec_time) total_ms, round(mean_exec_time, 1) mean_ms FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;".',
  'Copy the query, replace $1, $2 with real values and run "EXPLAIN (ANALYZE, BUFFERS) …". Look for: Seq Scan on big tables, a huge "Rows Removed by Filter", an estimate very different from the actual and a high "Buffers: shared read" (disk reads).',
  'If it filters by a column with no index → index (multi-column, in the order of the filter). If it brings 20 columns and the screen uses 4 → projection with Select. If it sorts by something the screen does not need → remove the ORDER BY. If it runs once per item of a list → it is an N+1, not an index problem.',
  'Table: | Query | Before (ms / buffers) | Change | After (ms / buffers) |. Example: "agenda by vet | 210 ms / 12,400 buffers | index (vet_id, starts_at) | 0.8 ms / 6 buffers". Buffers matter: they measure the real work and vary less than milliseconds.',
  'In the SQL log: the same query 30 times in a row with a different id. Find the foreach in the code that causes it. Fix: a projection with Select that brings everything in a single query (as in week 12). Use the screen again and count the queries: there must be one.'
],

'w21d4': [
  'Three questions per piece of data: is it read much more than it changes? Is it expensive to get? Does anything happen if it is seen a few minutes late? Examples: vaccine catalogue → yes, yes, nothing happens → cache it. Daily agenda → changes constantly and a delay causes double bookings → do not cache.',
  '"builder.Services.AddHybridCache();" and then "await cache.GetOrCreateAsync("vaccine-catalogue", async ct => await db.Vaccines.ToListAsync(ct), new() { Expiration = TimeSpan.FromMinutes(30) }, cancellationToken: ct)". Or IMemoryCache with GetOrCreateAsync. One or two things at most.',
  'Where the data is modified, invalidate: after saving a vaccine in the catalogue, "await cache.RemoveAsync("vaccine-catalogue", ct);". Write a test or a manual check: create a new vaccine and ask for the catalogue; it must show up immediately, not after 30 minutes.',
  'Repeat exactly the same load test from day 2 against that endpoint. If the p95 goes from 40 ms to 35 ms, the cache is not worth it: remove it and note "rejected: a 12 % improvement does not justify the risk of stale data". If it goes from 400 ms to 5 ms, keep it.',
  'Vite puts a hash in the file names (assets/index-a1b2c3.js), so they can be cached for a year: "Cache-Control: public, max-age=31536000, immutable". index.html, on the other hand, with "no-cache". In Network, reload: the Size column must show "(memory cache)" or "(disk cache)" for the .js and .css files.'
],

'w21d5': [
  'To measure something realistic: "npm run build && npm run preview", not dev mode. In Chrome, F12 → Lighthouse → Mode: Navigation, Device: Mobile, only Performance → Analyze. Note LCP, CLS and TBT (Lighthouse does not measure INP on a normal load: use TBT as an approximation or Timespan mode while interacting).',
  'When "npm run build" finishes, Vite lists the files with their gzip size. If the main JS goes over about 300 kB gzip: "npm install -D rollup-plugin-visualizer", add it to the plugins in vite.config.ts and rebuild. Open stats.html: the biggest rectangles are the culprits (a whole date library, icons…).',
  '"const PetDetail = lazy(() => import("./pages/PetDetail"));" and in the route "element: <Suspense fallback={<Skeleton />}><PetDetail /></Suspense>". Do it with the pages not used on entry (reports, admin). Rebuild: the main file must be smaller and new per-page files must appear.',
  'Network on "Slow 3G", reload and watch the screen: does anything move when the data arrives (the table pushes the footer, an image with no size pops in)? Fixes: skeletons the same height as the final content, "width" and "height" on images and a min-height on containers that get filled later.',
  'Same mode and same conditions as the first measurement. Table: | Metric | Before | After |. If any got worse (for example, LCP after making the home page lazy), check what changed: never lazy-load what is seen right on entry.'
],

'w21d6': [
  'For each change, a card with the five parts. Example: Symptom (the agenda had a 1.2 s p95) · Diagnosis (Seq Scan on appointment according to EXPLAIN) · Change (index (vet_id, starts_at)) · Result (180 ms p95 with the same load) · Cost (+40 MB of index, inserts 3 % slower). If any part is missing, the change is not justified.',
  'List of rejections with their reason: "Redis for the agenda: rejected, the p95 already meets the target without it and it adds one more piece to operate". "Denormalise the owner’s name into appointment: rejected, the JOIN costs 0.3 ms". This section shows you know how to say no.',
  'Write what you believed and what turned out: "I believed JSON serialisation was the bottleneck; measured: 4 ms out of 300". "I believed the cache would help a lot; measured: 12 %". That your intuition failed and you found out by measuring is exactly what gives the report credibility.',
  'Go through the list point by point with its evidence: link to the section, command run or screenshot. If a point has no evidence (for example, Lighthouse only "after"), do it now before calling the report finished.',
  'Use the same bombardier command from day 2 (same concurrency, same duration, same data) against each endpoint in the table. If the numbers differ by more than 10–15 % from the report’s, find out what changed in the code or in the data and update the report.',
  'The five parts in 3 minutes: symptom ("the receptionist waited more than 1 s"), how you measured it (bombardier and pg_stat_statements), what you found (Seq Scan), what you changed (multi-column index) and how much it improved (1.2 s → 180 ms). With concrete numbers. Record yourself.'
],

/* ---------- Week 22 ---------- */

'w22d1': [
  'Search for "Log" followed by "$"" or by "+": "_logger.LogInformation($"Appointment {id} created")". Change it to a template: "_logger.LogInformation("Appointment {AppointmentId} created for {VetId}", id, vetId);". That way AppointmentId stays as a queryable field and not as mixed-in text.',
  'Guide: Debug (detail for development), Information (something normal in the business: appointment created), Warning (something odd but handled: email fallback, slow request), Error (an operation failed: unhandled exception). A 409 for an overlap is Information, not Error: it is a normal business case.',
  '"app.Use(async (ctx, next) => { using (logger.BeginScope(new Dictionary<string, object> { ["CorrelationId"] = Activity.Current?.TraceId.ToString() ?? ctx.TraceIdentifier })) await next(); });". Turn on scopes in the console: "builder.Logging.AddJsonConsole(o => o.IncludeScopes = true);". Make a request: all its lines must have the same CorrelationId.',
  'In your error handler: "problem.Extensions["correlationId"] = Activity.Current?.TraceId.ToString();". Cause an error and copy the correlationId from the response. Search for it in the console: it must find every line of that request. That way support can ask the user for that code.',
  'Look in the logger calls for: Email, Name, Phone, Diagnosis, Token, Password, Authorization. Replace each one with its id. Also check the exceptions: "throw new X($"The owner {email} …")" ends up in the log; use the id there too.'
],

'w22d2': [
  '"var meter = new Meter("VetCare.Api"); var duration = meter.CreateHistogram<double>("vetcare.request.duration", "ms"); var requests = meter.CreateCounter<long>("vetcare.request.total");". In the middleware: "duration.Record(ms, new("route", routeTemplate), new("outcome", status >= 500 ? "error" : "ok"));". Separating ok and error stops fast errors looking like a latency improvement.',
  '"var appointmentsCreated = meter.CreateCounter<long>("vetcare.appointment.created"); var appointmentsRejected = meter.CreateCounter<long>("vetcare.appointment.rejected");" with the "reason" tag (overlap, validation). Increment them in the use case. If one day appointments created drop to zero at 11:00, something is wrong even if the API answers 200.',
  'The Npgsql connection pool: the default maximum is 100 (Maximum Pool Size). Npgsql publishes its own metrics (connections in use, requests waiting). If you do not see them, measure the time to get a connection. Saturation = requests waiting for a free connection.',
  'Review each tag: "route" with the template ("/api/v1/appointments/{id}") → about 20 routes: fine. "route" with the real URL ("/api/v1/appointments/3f2a…") → one series per appointment: bad. "userId" → thousands of values: out. "status" with 5 or 6 values: fine.',
  'Table: | Name | Type (counter, histogram, gauge) | Tags | Question it answers |. Example: "vetcare.request.duration | histogram | route, outcome | Are users waiting longer than promised?". If you cannot think of a question for a metric, delete it.'
],

'w22d3': [
  'Packages: OpenTelemetry.Extensions.Hosting, OpenTelemetry.Instrumentation.AspNetCore, OpenTelemetry.Instrumentation.Http, Npgsql.OpenTelemetry and OpenTelemetry.Exporter.OpenTelemetryProtocol. "builder.Services.AddOpenTelemetry().WithTracing(t => t.AddAspNetCoreInstrumentation(o => o.Filter = ctx => !ctx.Request.Path.StartsWithSegments("/health")).AddHttpClientInstrumentation().AddNpgsql().AddOtlpExporter());".',
  'Aspire dashboard: "docker run --rm -it -p 18888:18888 -p 4317:18889 mcr.microsoft.com/dotnet/aspire-dashboard". Exporter: "OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317". Open localhost:18888 (the token shows up in the container log). In Traces, open one and look at how many SQL queries there are inside.',
  '"static readonly ActivitySource Source = new("VetCare.Application");" and in the use case: "using var act = Source.StartActivity("ScheduleAppointment"); act?.SetTag("vetcare.vet_id", cmd.VetId); act?.SetTag("vetcare.duration_min", cmd.Duration);". Register the source: "t.AddSource("VetCare.Application")". Use ids, never names or emails.',
  'In the viewer, sort by duration and open the slowest. The longest bar is where the time went: an SQL query, an external call or a gap with no span (application code)? Write: "I believed it was the database; in fact, 70 % in the call to the email service".',
  'Simple option: generate the traceparent in the browser ("00-<32 hex>-<16 hex>-01") and send it in every fetch as a header. Full option: the OpenTelemetry web SDK (@opentelemetry/sdk-trace-web with fetch instrumentation). If the API receives traceparent, its trace continues the same traceId: check it in the viewer.'
],

'w22d4': [
  'Book appointment: "SLI = POST /api/v1/appointments with a 2xx response or an expected 4xx (409, 422) in under 1 s / all POST /api/v1/appointments". 409s count as good because the system worked properly. 5xx and slow ones count as bad. Write the formula for each operation and what is left out of the denominator (for example, health requests).',
  '99.5 % SLO over 30 days → 0.5 % budget = 0.005 × 43,200 min ≈ 216 min a month. In requests: with 20,000 a month, 100 bad requests. Write both numbers. "We have 3.6 hours of margin a month" is understood much better than "99.5 %".',
  'Fast (page): budget burning 14× faster than normal for 1 h (confirmed over the last 5 min) → it runs out in about 2 days, act now. Slow (ticket): 6× for 6 h (confirmed over 30 min) → review during working hours. Write the exact condition, who it alerts and through which channel.',
  'For each existing alert ask: if it fires, does any user notice? "CPU above 80 %" → not necessarily → delete it or move it to a dashboard. "Booking error above 2 % for 5 min" → yes → it stays. Note what you deleted and why.',
  'List: | Cause | Estimated burn | Why it is accepted |. Example: "Deployment with a cut of about 30 s | 0.5 min per deployment × 8 a month = 4 min | cheaper than building zero-downtime deployment with 4 clinics". That way nobody is surprised when the budget goes down.'
],

'w22d5': [
  'Level 1, four charts and nothing else: request rate, error rate (%), p95 latency and saturation (pool connections). On top, the SLO status. It must answer in 5 seconds "is it broken right now?". Use the Aspire dashboard or Grafana with Prometheus, whatever you have.',
  'Level 2: the same signals per endpoint (where is it broken?). Level 3: per dependency (database, email) and sample traces (why?). When you cannot build a chart because the metric does not exist, note it: "missing latency per dependency" and go back to instrumenting.',
  'Structure: Symptom (which alert fired) · Impact (what users cannot do) · Diagnosis (numbered steps: 1. look at level 2: one endpoint or all of them? 2. …) · Mitigation (fastest to slowest: rollback, turn off the feature, scale) · Verification (which chart goes back to green) · Afterwards (postmortem).',
  'For "database unavailable": symptom (/health/ready at 503, 5xx errors on every endpoint), diagnosis ("docker compose ps db", "docker compose logs db", pool connections), mitigation (restart the container, free disk if it is full), verification (ready at 200, error below 1 %).',
  '"docker compose stop db" and follow your runbook step by step without skipping anything and without using what you already know. Every step that does not work or was not written down, fix it right then. At the end, "docker compose start db" and check the runbook’s verification.'
],

'w22d6': [
  'If you can, ask someone else to cause the failure without telling you which one. If you do it yourself, pick one at random (write the four on slips of paper) and wait a few minutes using the web normally before looking at the dashboard, as would happen in real life.',
  'Start the stopwatch when you notice the symptom. Use only the dashboard, the logs and the traces, without opening the code or the configuration. Note each step and its time: "10:03 error alert, 10:05 level 2 shows only POST appointments fails, 10:09 the trace shows a timeout waiting for a connection → pool".',
  'Keep the runbook open and mark each step: ✓ it helped, ✗ it did not, + it was missing. When you finish, edit the runbook with everything marked. Example: "+ Add: check the pool size in the configuration before looking at the database".',
  'Sections: Summary · Timeline (with times) · Impact (users, duration, budget burned) · Root cause · Why we did not detect it sooner · What went well · Actions (each with an owner and a date). Blameless: "the configuration allowed a pool of 2", not "I set the pool wrong".',
  'Go through the list with its evidence: screenshot of the dashboard at three levels, the metric names, a link to both runbooks, the SLO definition, the two written alerts and the postmortem. Whatever you cannot show, do it before closing the week.',
  'Five parts in 3 minutes: what happened, how you found out (which alert or chart), how you diagnosed it (the path through the three levels), what you did to mitigate it and what you changed so it does not happen again. Include how long it took you. Record yourself.'
],

/* ---------- Week 23 ---------- */

'w23d1': [
  'The five steps with their times in a 45-minute interview: 1) clarify requirements (5 min), 2) estimate (5 min), 3) high-level design (10 min), 4) go deep on the hard part (15 min), 5) trade-offs and wrap-up (5–10 min). Write them on a card and look at it before each practice.',
  'Questions: how many users per clinic and how many appointments a day? Do owners use the system or only staff? Are there legal requirements on medical data? What availability is expected? Do clinics share data? Default assumptions: "if they do not answer, I assume 5 users and 40 appointments a day per clinic, staff only, 99.5 %".',
  'URL shortener: how many new URLs a day and how many visits? Do URLs expire? Custom aliases? Click statistics? Restaurant bookings: how many restaurants? Must double bookings of the same table be prevented? Payments? Ten minutes each, with a stopwatch.',
  'Two columns. Functional: who are the users? What is the main operation? What is out of scope? Non-functional: scale (users, operations per second), read/write ratio, acceptable latency, consistency versus availability, data retention, region. That is your template for any prompt.',
  'Record 3 minutes saying "Before designing, I would like to clarify…" and ask your questions as if someone were answering. If nobody answers, say the assumption out loud: "I assume 200 clinics with 40 appointments a day each; if that is not right, I will adjust it". Listen to yourself: does it sound like a conversation or a list being read out?'
],

'w23d2': [
  'Key ratios: memory about 100 ns, SSD about 100 µs (×1,000), network in the same data centre about 0.5 ms, between continents about 150 ms. A web server handles thousands of requests per second; a well-indexed PostgreSQL, thousands of simple queries per second. One day ≈ 100,000 seconds (for quick maths).',
  'With your assumptions: 200 clinics × 40 appointments a day = 8,000 appointments a day. Reads: about 10 per appointment → 80,000 a day ÷ 100,000 s ≈ 1 request per second on average; the peak (×10) ≈ 10 per second. Write each assumption and then compare with the example.',
  '5,000 clinics → 200,000 appointments a day → about 25 requests per second on average, about 250 at peak. Storage: 1 KB per appointment × 200,000 × 365 ≈ 73 GB a year. It still fits in a well-configured PostgreSQL; what changes first is the number of connections and the need for read replicas. Write at exactly which point it changes.',
  'Example: 2 photos per visit × 2 MB × 8,000 visits a day ≈ 32 GB a day ≈ 11 TB a year. In object storage, at about $0.02 per GB a month, that is about $230 a month in the first year. In the database it would multiply the size of the backups and the restore time. With numbers, the decision defends itself.',
  'Four sections with a one-sentence conclusion each. Traffic: "peak of 10 requests per second: one instance is more than enough". Storage: "3 GB of data a year: a small database; images go outside". Bandwidth: "dominated by images: a CDN is worth it". Memory: "the whole active agenda fits in a few MB of cache".'
],

'w23d3': [
  'Look for "static" on fields that are not readonly or constants, instance dictionaries in singleton services, IMemoryCache, in-memory sessions and writes to local disk ("File.Write", "Path.GetTempPath"). Make a list: "RequestCounter: static int → the number is split between instances".',
  'For each one decide: move it out (sessions, uploaded files → database or object storage) or justify it (catalogue cache: each instance has its own and it can take up to 30 min to update). Write the why in one line: "acceptable: the catalogue changes once a month".',
  'In compose duplicate the service: api1 on port 8081 and api2 on 8082 (or use "deploy: replicas: 2" with a proxy in front). Alternate requests: log in on 8081 and then query with the same cookie on 8082. If it fails, something lives in the memory of a single instance (for example, the signing key generated on startup).',
  'Table in order: | Layer | Technique | From which measurement | Consequence |. Example: "API | 2nd instance + load balancer | CPU above 70 % sustained at peak | sessions must be taken out of memory". "Database | read replica | connections above 80 % of the maximum | replication lag on reads".',
  'Problem: the user creates an appointment (writes to the primary) and the list is read from the replica, which is 200 ms behind → they do not see their appointment. Solutions: return the created appointment in the POST response and add it to the client cache (what you already do with React Query), or read from the primary for a few seconds after writing.'
],

'w23d4': [
  'Table: | Data | Consistency | Why |. "Agenda slots | strong | a double booking is a dog waiting and a conflict with the client". "Medical history | strong | a vet cannot decide with stale data". "Monthly appointment counter on the dashboard | eventual (5 min) | it is informative".',
  'Sequence: thread A reads the slots (free) → thread B reads the slots (free) → A inserts the 10:00 appointment → B inserts the 10:00 appointment → there are two appointments. Both checks were correct at the time; the problem is the time between checking and writing. Only the database constraint, which checks and writes at once, prevents it.',
  'For each "strong" piece of data in your table, write where it is protected: "no overlaps → ex_appointment_no_overlap (exclusion constraint)", "unique email → uq_owner_email_lower", "invoice and lines together → transaction in InvoiceUseCase.cs". If it is only in a C# if, add the protection in the database.',
  'One number per piece of data: "dashboard counter: up to 5 min", "monthly statistics: up to 1 h", "owner’s name in a list after editing it: up to 30 s". If someone complains a piece of data is stale, that number decides whether it is a bug or the agreed behaviour.',
  'Template: "CAP says that, when the network splits and some nodes cannot talk to others, you have to choose between answering with data that may be out of date (availability) or rejecting the operation (consistency). With no partition, you do not have to give anything up. In VetCare, for the agenda I choose consistency: better an error than a double booking".'
],

'w23d5': [
  'The pieces: load balancer, distributed cache (Redis), message queue, CDN, read replicas and object storage. Table: | Piece | Today | 200 clinics | 5,000 |. Example: "Redis | no | no | maybe". "Objects | yes (images) | yes | yes". Most of today’s "no" answers are the right answer.',
  'For each "no", the concrete threshold: "Redis: when there are 3 or more API instances and the local cache causes visible inconsistencies". "Queue: when the outbox processes more than 100 messages per second or there are several consumers". "Replica: when the primary’s connections go over 70 % at peak".',
  'Design: the database stores only the metadata (id, visit_id, object key, type, size). To upload: the API authorises and returns a pre-signed URL (valid for 5 min) and the browser uploads the file straight to storage. To view: the API checks ownership and returns another pre-signed read URL. The file never goes through your API.',
  'New column in the table: Maintenance. "Redis: updates, memory, what happens if it goes down (does the API work without it?), monitoring". "Queue: stuck messages, retries, poison messages, one more piece in the on-call rota". If the maintenance weighs more than the benefit, the answer is no.',
  'Structure: "Not today: I already have an outbox in PostgreSQL that gives me guaranteed delivery in the same transaction, and at 8,000 appointments a day it processes the messages with room to spare. I would add a queue when there are several different consumers or it goes over a few hundred messages per second, and I would do it keeping the outbox as the source".'
],

'w23d6': [
  '45-minute timer, paper or a digital whiteboard, and record the audio. Steps with their times: clarify (5), estimate (5), high level (10), go deep (15), trade-offs (5–10). If you get stuck, say out loud what you are thinking and move to the next step: going silent is worse than being wrong.',
  'Write the five sections up neatly in the document with what you said, not with what you should have said. Then compare it with the example and note the differences separately: "I did not estimate bandwidth", "I did not talk about replication lag".',
  'Pick one you have never designed and set 30 minutes (shorter step 4). The goal is to use the same question template and the same way of estimating in a new domain. If you get blocked more than with VetCare, note at which step.',
  'Each point with its link to the section or file. Whatever is missing or half done, complete it today: week 24 builds on all of this.',
  'Three minutes only on trade-offs: "I chose consistency for the agenda at the cost of rejecting appointments if the database does not answer", "images outside the database at the cost of handling pre-signed URLs", "I did not add Redis at the cost of local caches that may be out of date". Admitting what you give up is what sets apart someone who understands from someone who memorised.',
  'During the practice, every time your mind goes blank, jot a word in the margin. At the end, turn them into questions: "how would I partition the appointments database by clinic?", "what about time zones between clinics?". Keep them: they are the study material for week 24.'
],

/* ---------- Week 24 ---------- */

'w24d1': [
  'Pick one you did not practise in week 23. If you did the shortener, pick the library or the food orders. Write the prompt in one line at the top of the sheet before starting the timer.',
  'Note the deadlines before starting: "start 10:00 → clarify until 10:05 → estimate until 10:10 → high level until 10:20 → go deep until 10:35 → trade-offs until 10:45". If at 10:05 you are still asking, make assumptions and move on.',
  'Write while you talk: boxes and arrows, numbers in the margin, questions with question marks. Do not write it up neatly afterwards. If you can, record the audio: you will use it on day 5.',
  'Find the invariant that, if broken, makes the system useless. Library: "a copy cannot be lent to two people at once". Shortener: "a short code can never point to two different URLs". Orders: "a paid order cannot be lost". Say it out loud and go deep there.',
  'Underline every decision in your document and mark whether it has a number behind it: "one instance (peak of 15 requests/s)" ✓ versus "I use Redis" ✗. If fewer than half have a number, redo the step 2 estimate in more detail and justify again.',
  'Separate list: question, at which step it came up and why it blocked you. Example: "step 4: how to generate unique short codes without collisions across several instances". Put it together with the three from week 23.'
],

'w24d2': [
  'Next to each path in openapi.yaml, a comment "# consumed by: web, cli" or "# consumed by: nobody". To find out, search for the route in web/src and in src/VetCare.Cli. The ones with consumers need care; the ones without, you can change freely.',
  'Candidate change: "GET /api/v1/appointments/{id}" returns "vetId" today and the frontend makes another request for the name. Change: return "vet: { id, name }". Other candidates: renaming a badly named field or changing a date’s format.',
  'Classification: adding an optional field breaks nothing; removing or renaming a field, changing its type or making it required on input does break. If it breaks: phase 1 (add the new one and keep the old one, date), phase 2 (migrate the consumers, date), phase 3 (remove the old one, date). Write the dates before coding.',
  'In the DTO: "Guid VetId, VetSummary Vet". In openapi.yaml, on the old field: "deprecated: true" and "description: "Deprecated. Use vet.id. Removed on 2026-12-01"". Both fields live side by side: no current client breaks.',
  '"var deprecatedUse = meter.CreateCounter<long>("vetcare.api.deprecated_field");". Since the API does not know which fields the client reads, measure who is still on the old version: new clients send an "X-Client-Version" header and you count the requests without it or with the old version. When the counter stays at zero for 2 weeks, you can remove it.',
  '"[Fact] public async Task VetId_StillExists_UntilRemovalDate() { if (DateTime.UtcNow >= new DateTime(2026, 12, 1)) return; var json = await client.GetStringAsync("/api/v1/appointments/…"); json.Should().Contain("\\"vetId\\""); }". If someone deletes it ahead of time, the test goes red.'
],

'w24d3': [
  'Counts: "SELECT \'owner\', count(*) FROM owner UNION ALL SELECT \'pet\', count(*) FROM pet UNION ALL SELECT \'appointment\', count(*) FROM appointment UNION ALL SELECT \'invoice\', count(*) FROM invoice;". Also note one concrete piece of data, for example the name of a specific pet, to check it afterwards.',
  '"docker compose exec -T db pg_dump -U postgres -Fc vetcare > backup.dump" and "ls -lh backup.dump". With 50,000 appointments it should take several MB. If it takes a few KB, you probably dumped another database (check the name) or the command failed and you only saved the error message.',
  'Start the stopwatch: "docker compose down -v", "docker compose up -d db", wait until it is healthy, "docker compose exec -T db pg_restore -U postgres -d vetcare --clean --if-exists < backup.dump", bring up the rest and open the schedule. Stop the stopwatch when you see your appointments. That is your measured RTO.',
  'Repeat the counts and compare them. Then: "\\d appointment" must list ex_appointment_no_overlap. Real test: create through the API an appointment that overlaps another → it must give 409. If it gives 201, the restore did not bring back the constraints (or you restored only the data).',
  'Sections: RPO ("up to 24 h of data lost: daily backup at 02:00"), promised RTO (for example, 1 h) and measured (for example, 6 min), numbered procedure with the exact commands and a retention table: | Data | How long | Reason | (medical history X years according to regulations, logs 30 days, backups 30 days…).',
  'Admin command or endpoint "anonymise owner {id}": replaces name, email and phone with neutral values ("Anonymised-<id>"), keeps ids and invoices, and inserts into applied_anonymisation (owner_id, date, who). Test: create an owner with an invoice, anonymise them, and check the invoice exists and the email no longer appears in any table.'
],

'w24d4': [
  'Order: what VetCare is in 2 lines (the problem, not the technology) → one good screenshot → startup in 3 commands → what this project shows (links to ADRs, performance report, postmortem, threat model) → stack → status. Move everything long into docs/ and link to it.',
  'Clone into /tmp in a new folder and follow the README without using anything you know by heart. Every time you guess something, note it: "it does not say .env has to be created", "it does not say which port to open". Fix the README, delete the folder and repeat until it comes out clean.',
  '"ls docs/ docs/adr/" and compare with the list. Look for half-finished documents: "grep -rl -i "TODO\\|pending\\|TBD" docs/". For each one: complete it or delete it and remove its link. An empty document makes a worse impression than not having it.',
  'Performance report: every change with measured before and after. Postmortem: blameless, with dated actions. ADRs: each with at least two rejected alternatives and their reason. Read them as if you were an interviewer with 2 minutes for each one: is the conclusion clear in the first paragraph?',
  'STAR: Situation (VetCare, the agenda was slow with 50,000 appointments) · Task (get the p95 below 300 ms) · Action (I measured with bombardier, found the Seq Scan with EXPLAIN, created the multi-column index) · Result (1.2 s → 180 ms). Another good story: the simulated incident. Time yourself: about 2 minutes each.',
  'Three short lists. Done: the main things with links. Not done on purpose: "no mobile app", "no multi-clinic: decision in ADR-003". Known limit: "a single database instance; from about 5,000 clinics it would need replicas (see design at scale)".'
],

'w24d5': [
  '2-minute stopwatch per question, no paper. If you stumble, do not reread the model answer: write one word ("numbers", "alternative", "wrap-up") and start again. By the third round it should come out smoothly.',
  'Record "tell me about your project" on your phone in 2 minutes. When you listen back, count the filler words ("um", "like", "basically") and the sentences you start without knowing how to finish them. Repeat once trying to cut both in half.',
  'Example with "what is an index?": answer ("a structure that lets you find rows without reading the whole table"), why ("it avoids the Seq Scan; in VetCare it went from 210 ms to 0.8 ms"), trade-off ("it takes space and slows down writes") and silence: you stop talking and let them ask. Practising the silence is the hard part.',
  'For each question that blocked you: write the answer with the same four-step structure and an example from VetCare or the new domain. If you do not know how to answer it, study it now (30 minutes at most per question) and write the answer in your own words.',
  'Format: "I do not have real experience with X; the closest thing I did was Y; to cover it I am doing Z". Example: "I have not run Kubernetes in production; I deployed with Docker Compose and CI; my plan is to set up a local cluster with kind next month". Two gaps, without justifying yourself.',
  'Give the list to someone (or use a random number generator) so they pick 3 questions without warning you. Answer with a stopwatch. Afterwards ask them what they understood from each answer. If you have nobody, put the questions on slips of paper and draw three at random.'
],

'w24d6': [
  '45-minute timer, a prompt you have never practised and nothing open: no notes, no example, no internet. Record the audio. If you leave this part for later, you will lose the only thing that measures whether the method is already yours.',
  'Score each of the 14 points only with what is on your sheet and in the recording, not with what you thought but did not say. When in doubt, do not tick it. Next to each missed point, note what was missing.',
  'Run it right then: clone and bring it up from scratch, "dotnet test", "npx tsc -b", the CI pipeline green, "/health/ready", the backup restore. Tick only what you have just seen working today.',
  'Each unticked box becomes a task with a verb: "Add .env.example with JWT_KEY", "Fix the flaky pagination test". Sort them by impact for someone arriving tomorrow: first what stops the project starting, then what is seen first and lastly the cosmetic.',
  'For each gap (from the rubric, the interview or the audit): a concrete resource (a book, a course or documentation by name), something you will build to practise it and in which month. New project: one that tackles your biggest gap. Cadence: "Tuesdays and Thursdays from 19:00 to 21:00 and Saturdays 2 h".',
  'Create the event in your calendar now, 8 weeks out: "Review next-steps-plan.md: what did I achieve? what do I change?". Set a reminder the day before. Then create the tag: "git tag -a v1.0.0 -m "End of the 24-week path" && git push --tags".'
]

});
