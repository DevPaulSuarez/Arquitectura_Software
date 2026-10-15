/* Reference solution for each weekly exam (day 6), weeks 19 to 24. */
window.EN = window.EN || {};
window.EN.SOLUCIONES = Object.assign(window.EN.SOLUCIONES || {}, {

'w19d6': {
  intro: 'Section 2 complete, going through the ten categories of the OWASP Top 10 (including the ones that do not apply and why), the evidence for the three priority attacks and the accepted risks. The example of the day only shows six threats; here is the whole walk-through.',
  body: `## 2. What can go wrong (OWASP Top 10, 2025 edition)
| Cat. | Threat in VetCare                               | Impact  | Prob. | Prio. |
|------|-------------------------------------------------|---------|-------|-------|
| A01  | An owner reads another pet's history (IDOR)     | High    | Medium| 1     |
| A01  | Reception performs vet actions                  | Medium  | Medium| 2     |
| A02  | Open CORS or missing headers in production      | Medium  | Medium| 2     |
| A03  | Dependency with a published vulnerability       | High    | Medium| 1     |
| A04  | Weak passwords or a fast hash                   | High    | Low   | 2     |
| A05  | SQL injection in the monthly summary SqlQueryRaw| Critical| Low   | 1     |
| A05  | Stored XSS in a pet's name or notes             | High    | Low   | 2     |
| A06  | Design: cancelling other people's appointments without ownership | Medium | Low | 3 |
| A07  | Brute force and enumeration on the login        | Medium  | High  | 2     |
| A08  | Integrity: Docker image with unverified origin  | Medium  | Low   | 3     |
| A09  | Logs without security events, or with personal  | Medium  | Medium| 2     |
|      | data inside                                     |         |       |       |
| A10  | Exception handling that leaks details           | Low     | Medium| 3     |
SSRF: does not apply because VetCare never requests URLs the user provides.

## Evidence for the three priority attacks
1) IDOR on the history (A01)
$ curl -i --cookie "vetcare_session=<owner A>" \\
       http://localhost:5080/api/v1/pets/9c1b.../history
HTTP/1.1 404 Not Found
Content-Type: application/problem+json
{"type":"/errors/not-found","title":"Resource not found","status":404,...}
Test: OwnerA_HistoryOfPetOfB_Returns404

2) Injection in the monthly summary (A05)
$ curl -i "http://localhost:5080/api/v1/reports/summary?year=2026%20OR%201%3D1"
HTTP/1.1 422 Unprocessable Entity      <- year is an int: it never reaches the query
And in code: SqlQueryRaw("... = {0}", year)  (parameter, not concatenation)

3) Dependencies (A03)
$ dotnet list package --vulnerable --include-transitive
The given project VetCare.Api has no vulnerable packages given the current sources.
$ npm audit --audit-level=high
found 0 vulnerabilities
CI: "audit" job in .github/workflows/ci.yml

## 3. Mitigations (real status)
| Threat           | Mitigation                                 | Status     |
|------------------|--------------------------------------------|------------|
| IDOR             | Ownership in the query + 404               | Done W18   |
| Roles            | Policies per endpoint                      | Done W18   |
| Configuration    | Exact CORS, five headers, CSP              | Done W19   |
| Dependencies     | Audit in CI + Dependabot                   | Done W19   |
| Passwords        | BCrypt factor 12, minimum length 12        | Done W18   |
| Injection        | Parameters only; SqlQueryRaw reviewed      | Done W19   |
| XSS              | React + safeUrl + CSP without unsafe-inline| Done W19   |
| Login            | Rate limit + response identical in time    | Done W18   |
| Docker image     | Official image with a pinned version       | PARTIAL: signature not verified |
| Logs             | Security events with ids, no PII           | Done W19   |
| Exceptions       | Global handler, generic 500                | Done W12   |

## 4. Accepted risks
- No second factor: 4 employees on an internal network. Review if it is opened to
  owners over the internet.
- JWT valid for up to 15 min after logout: short lifetime and
  revocable refresh token.
- Docker image signatures not verified: pending for production.`
},

'w20d6': {
  intro: 'The result of the clean-folder test (with what was missing from the README), the corrected startup README, the rollback drill and the week’s list with its evidence.',
  body: `CLEAN-FOLDER TEST (first pass)
$ git clone git@github.com:your-user/vetcare.git ~/vetcare-clean && cd ~/vetcare-clean
1. "cp .env.example .env"      -> .env.example had no JWT_KEY         ✗
2. "docker compose up -d"      -> the API started before the database ✗
                                  (condition: service_healthy was missing)
3. Open http://localhost:8080  -> 404: the README did not say the API
                                  lives at /health and /scalar        ✗
4. Migrations                  -> the README did not mention them     ✗
Second pass after fixing: from zero to a working schedule in 6 min.

README (startup section, corrected)
## Run locally
Requirements: Docker 24+ with Compose v2.

    git clone <url> vetcare && cd vetcare
    cp .env.example .env            # fill in DB_PASSWORD and JWT_KEY
    docker compose up -d --build
    ./database/migrate.sh           # applies the migrations to the container's database

- Web:            http://localhost:5173
- API (docs):     http://localhost:8080/scalar
- Health:         http://localhost:8080/health/ready
- Sample data:    docker compose exec -T db psql -U postgres -d vetcare < database/seed.sql

ROLLBACK DRILL
$ git log --oneline -2
a41c2e9 Add the sex field to pet (expand: nullable column)
7d03b18 Search pets by chip
$ docker build -t vetcare-api:7d03b18 . (from commit 7d03b18)
$ VETCARE_TAG=7d03b18 docker compose up -d --no-deps api
$ curl -s localhost:8080/health/ready  -> Healthy
$ POST /api/v1/appointments            -> 201
It works: the previous version ignores the new column because the
migration only added (expand). If it had dropped or renamed a
column, the rollback would have failed.

WEEK'S LIST (with evidence)
[x] Readable history ............. git log --oneline: 0 "fix"/"wip" commits
[x] .gitignore with secrets ...... git check-ignore .env -> .env
[x] Conflict resolved ............ commit e5f1a20 "Resolve conflict in README"
[x] Multi-stage Dockerfile, no root  whoami -> app
[x] .dockerignore ................ image without .git or bin/obj
[x] Compose with healthchecks and volume  down + up keeps data
[x] CI green against PostgreSQL .. link to the last run
[x] Audit in CI .................. "audit" job
[x] main protected ............... Settings -> Branches (screenshot)
[x] README in three steps ........ above
[x] Deployment documented ........ docs/deployment.md

$ git tag -a v0.1.0 -m "Reproducible VetCare: compose, CI and documented deployment"
$ git push --tags

SCRIPT (3 minutes)
It is deployed by building the image tagged with the sha, applying
only backwards-compatible migrations and starting the new
version; I check /health/ready and one appointment end to end. If it goes
wrong, I go back to the previous commit's image with one command: it works
because I never drop or rename columns in the same deployment.`
},

'w21d6': {
  intro: 'The example of the day is already a complete report; use it as the model for the five sections. Here is what it does not show: checking the list with its evidence, the final reproducibility round and the three-minute script for an optimisation.',
  body: `CHECKING THE WEEK'S LIST
[x] Targets by percentile .............. section 1 (p95 per operation)
[x] Baseline with realistic volume ..... 50,000 appointments, 10,000 pets
[x] Three worst queries with EXPLAIN ... pg_stat_statements top 3:
      1. agenda by vet and day          Seq Scan -> Index Scan
      2. pet history                    N+1 (38 queries) -> 1
      3. search by name (ILIKE)         Seq Scan -> GIN pg_trgm
[x] N+1 removed ........................ EF log: 1 query per screen
[x] Caches justified or rejected ....... vaccine catalogue: YES (30 min);
                                        agenda: NO (changes constantly)
[x] Lighthouse before and after ........ LCP 4.1 s -> 1.9 s; CLS 0.18 -> 0.02
[x] Each change with a measurement ..... section 2

FINAL REPRODUCIBILITY ROUND (today, same command as day 2)
$ bombardier -c 10 -n 500 -l "http://localhost:8080/api/v1/agenda?day=2026-10-10"
| Operation            | Report p95  | Today p95 | Difference |
|----------------------|-------------|-----------|------------|
| GET agenda           | 115 ms      | 121 ms    | +5 %  ✓    |
| POST appointments    | 390 ms      | 402 ms    | +3 %  ✓    |
| GET pets             | 95 ms       | 93 ms     | -2 %  ✓    |
All within 10 %: the report is reproducible.

3-MINUTE SCRIPT: "tell me about a time you improved performance"
Situation: VetCare's daily agenda had an 840 ms p95 with
  50,000 appointments; the target was 300 ms because the receptionist uses it
  with the client on the phone.
Measurement: bombardier for the baseline and pg_stat_statements to see
  which query accumulated the most total time.
Finding: EXPLAIN ANALYZE showed a Seq Scan reading 50,000 rows
  to return 37. I believed the problem was JSON serialisation:
  I measured and it was 8 ms out of 840.
Change: an index on appointment(starts_at) and, afterwards, removing a
  38-query N+1 with a projection.
Result: p95 from 840 to 115 ms, with a measured cost of 3 % on
  writes. And I rejected caching the agenda: serving stale data
  would allow booking into a taken slot.`
},

'w22d6': {
  intro: 'An incident different from the example’s (the connection pool shrunk to 2), with the diagnosis time measured, the fixes to the runbook and the complete seven-section postmortem.',
  body: `# Postmortem 01 - Connection pool exhaustion
Date: 2026-xx-xx · Duration: 23 min (16:00 - 16:23)
Impact: 41 % of agenda requests took over 5 s; 12 503 errors
  from timeouts waiting for a connection. Agenda SLO error budget
  burned: 18 % of the month.

## Timeline
16:00  Failure caused: Maximum Pool Size=2 in the configuration.
16:03  Slow alert (6x over 30 min) not fired yet; I notice the
       problem using the web: the agenda is slow.
16:05  Level 1 dashboard: p95 latency 4.8 s; errors 2 %; normal traffic.
16:07  Level 2: it affects ALL endpoints equally -> it is not a
       query, it is something shared.
16:11  Level 3: pool saturation at 100 % and 30 requests waiting for a
       connection. The queries themselves take 3 ms (traces).
16:14  Cause found: PostgreSQL has connections to spare
       (8 of 100), but the application does not ask for them -> pool limit.
       Time to cause: 14 minutes.
16:19  Mitigation: configuration restored and API restarted.
16:23  Verified: p95 110 ms, error 0 %, one appointment created end to end.

## Root cause
The Npgsql pool limit was left at 2. With 10 simultaneous requests,
8 waited for a connection; when they went over the wait timeout, they returned 503.

## Why we did not detect it sooner
- The pool configuration is not validated on startup and does not show on the
  dashboard.
- There was no pool saturation alert, only error and latency alerts.
- The latency alert was slow-only: it would take 30 min to fire.

## What went well
- Level 2 ruled out a specific query in 2 minutes.
- The traces showed the time was spent BEFORE the query.

## Actions
| Action                                                  | Type      | Date   |
|---------------------------------------------------------|-----------|--------|
| Pool saturation alert > 80 % for 5 min                  | Detection | +3 days|
| Fast alert on latency too, not only on errors           | Detection | +3 days|
| Startup test that fails if the pool is < 20             | Cause     | +1 week|
| Level 1 dashboard: add "requests waiting for a connection" | Detection | +1 week|

## What we learned
An exhausted resource looks like general slowness, not like errors. Checking
first whether the problem affects everything or one part saved half of the
diagnosis.

FIXES TO THE "high error / high latency" RUNBOOK
+ New step 2: does it affect all endpoints or one? If all of them,
  look at shared resources (pool, CPU, database) before queries.
+ New step 4: compare the trace time with the query time;
  if the query is fast, the problem is before it (waits).
- Removed: "restart the database" as the first mitigation (it was not the case
  and it would have cut the service for no reason).

CHECKING THE WEEK
[x] Structured logs with correlation    [x] Four golden signals
[x] Two business metrics                [x] Traces with custom spans
[x] SLI and SLO with a budget           [x] Two burn-rate alerts
[x] Dashboard in three levels           [x] Two on-call runbooks
[x] Postmortem written (this one)`
},

'w23d6': {
  intro: 'The example of the day is already the complete design of VetCare at scale. Here is the other half of the exam: the second prompt (a URL shortener) solved in 30 minutes with the same method, and an example of the three gaps noted down.',
  body: `# Design: URL shortener (30 minutes)

## 1. Requirements (4 min)
Questions: how many new URLs a day? how many visits? do they expire?
custom aliases? statistics?
Assumptions: 1 million new URLs a day, 100 visits per URL
(100:1 reads), they do not expire, optional alias, approximate
click counter.
Non-functional: redirect in < 50 ms p95; a code never points
to two different URLs; redirecting matters more than creating.

## 2. Estimate (4 min)
Writes: 1 M / 100,000 s ≈ 10/s (peak 100/s).
Reads:  100 M / 100,000 s ≈ 1,000/s (peak 10,000/s).
Storage: 500 bytes x 1 M x 365 ≈ 180 GB a year.
Code: base62 with 7 characters = 62^7 ≈ 3.5 trillion -> more than enough.
Conclusion: the challenge is reads (cache) and generating unique codes
without collisions between instances.

## 3. High-level design (7 min)
  Browser -> Load balancer -> API x N (stateless)
                               |-> Cache (code -> URL)    reads
                               |-> PostgreSQL (code PK)   source of truth
                               +-> Queue -> click counter (asynchronous)

## 4. Go deep: generating the code without collisions (10 min)
Option A: hash the URL and cut it -> collisions; you have to check and
  retry.
Option B: global counter -> unique, but a central point.
Chosen: PostgreSQL sequence in blocks. Each instance reserves
  a block of 1,000 ids (UPDATE ... RETURNING) and encodes them in
  base62. No collisions, no coordination on every request.
Final guarantee: PRIMARY KEY on the code; if a custom alias already
  exists -> 409.
Redirect: look in the cache; if it is not there, in the database and store it in the
  cache. 301 if there are no statistics, 302 if clicks must be counted.

## 5. Trade-offs (5 min)
- Eventual click counter (seconds of delay): accepted.
- Predictable codes (sequential): if it matters, shuffle the bits.
- One region: higher latency far away; a CDN in front of popular
  redirects.
- What breaks first: the cache (memory) at ~10,000 reads/s;
  then, the table size (partition by creation date).

THE THREE GAPS NOTED DOWN (example)
1. How do I invalidate the cache for a URL deleted for abuse, with
   several instances and local caches?
2. When is 301 better than 302 if browsers cache the 301?
3. In multi-clinic VetCare: how exactly does PostgreSQL row-level
   security work with EF Core?`
},

'w24d6': {
  intro: 'An example of parts 1 and 3: the design for option A (city bike rental) scored with the rubric, and a filled-in docs/next-steps-plan.md. Your plan must come from your own gaps; this one shows the level of concreteness expected.',
  body: `PART 1 - DESIGN: city bike rental (45 min)

1. Requirements (5)
   Questions: how many stations and bikes? pay per minute or pass?
   is the bike unlocked from the app? what happens with no signal?
   Assumptions: 500 stations, 8,000 bikes, 200,000 trips a day,
   unlock from the app, the station has a connection.
2. Estimate (5)
   200,000 trips / 100,000 s ≈ 2 rentals/s (peak 20/s).
   Station status: 500 x every 10 s = 50 writes/s.
   Storage: 1 KB x 200,000 x 365 ≈ 73 GB a year.
   Conclusion: the volume is small; the challenge is that two people do not
   unlock the same bike.
3. Design (15)
   App -> Load balancer -> API x2 -> PostgreSQL (+ replica)
   Stations -> queue -> status processor (asynchronous)
   Availability map: reads from cache (eventual, 10 s).
4. Go deep: renting a bike (15)
   UPDATE bike SET status = 'in_use', user_id = $1
    WHERE id = $2 AND status = 'free';      -> 0 rows = no longer free
   A single statement: no race between reading and writing.
   Idempotency-Key: if the app retries because of poor signal, two
   rentals are not charged. Command to the station via outbox.
5. Trade-offs (5)
   - Eventual map (10 s): it may show a bike someone already took.
   - One region. - No offline operation at the station.
   What breaks first: the 8:00 peaks at central stations
   (contention on a few rows), not the total volume.

RUBRIC (honest self-assessment): 12 / 14
  [x] 4 questions   [x] assumptions   [x] traffic   [x] storage
  [x] conclusions   [x] < 8 boxes   [ ] each piece with a number (the map
  cache did not have one)  [x] hard part  [x] write flow
  [x] race  [x] consistency per piece of data  [ ] breaking load with
  a number  [x] 3 trade-offs  [x] no unjustified technology

PART 3 - docs/next-steps-plan.md

## What I can already do
Design a medium-sized system starting from requirements and
estimates. Build a production .NET API with tests,
resilience, security and observability. Operate what I build:
measure, diagnose, roll back and document.

## My three real gaps
1. Real messaging (queues, retries, duplicate messages).
2. Kubernetes and cloud deployment; I have only used Docker Compose.
3. Data structures and algorithms under interview pressure.

## What I do about each gap
1. RabbitMQ documentation + "Enterprise Integration Patterns"
   (messaging chapters) -> move VetCare's outbox to a real queue
   with an idempotent consumer.
2. Official Kubernetes tutorials (kubernetes.io/docs/tutorials) ->
   deploy VetCare on a local cluster with kind and health checks.
3. 3 LeetCode problems a week (arrays, hash maps, graphs)
   explaining the complexity out loud -> a notebook with 50
   solved.

## A new project, not VetCare
Choice: sports court bookings with real-time availability.
Why: it forces me to use WebSockets and lots of concurrent writes
on the same slots, which VetCare did not force.

## Cadence
6 hours a week: Tuesdays and Thursdays from 19:00 to 21:00, Saturday from
10:00 to 12:00. Sign I am on track: one visible deliverable a month
(January: outbox with a queue; February: VetCare on kind; March: first
version of the new project).

## Review date
2026-12-xx (8 weeks). In the calendar from today.

$ git tag -a v1.0.0 -m "End of the 24-week path" && git push --tags`
}

});
