window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 21,
  phase: 'Performance',
  title: 'Performance: measure before you touch',
  idea: 'Almost everything people do to "optimise" is useless, and part of it makes things worse. The problem is not that they do not know techniques: it is that they guess where the bottleneck is instead of measuring it. This week you reverse the order. First you decide what fast means for VetCare and write it down as a number. Then you really measure, with percentiles and not averages, because the average hides exactly the users who are having a bad time. Only then do you touch code, and every change has to prove its improvement with a measurement before and after. By the end of the week you will have something almost nobody has: the sentence "this optimisation took the p95 from 800 ms to 120 ms" backed by your own data.',
  res: [
    { t: 'Brendan Gregg — USE Method', u: 'https://www.brendangregg.com/usemethod.html', note: 'A systematic method for finding bottlenecks: utilisation, saturation and errors of each resource. Short, and it gives you an order to look in instead of poking around blindly.' },
    { t: 'PostgreSQL — Using EXPLAIN', u: 'https://www.postgresql.org/docs/current/using-explain.html', note: 'You already touched it in week 10. This time you use it to diagnose real queries from your application, not examples.' },
    { t: 'BenchmarkDotNet — Getting started', u: 'https://benchmarkdotnet.org/articles/guides/getting-started.html', note: 'The standard tool for measuring .NET code seriously. The important thing is that it saves you from the classic mistakes of timing by hand with a stopwatch.' },
    { t: 'web.dev — Core Web Vitals', u: 'https://web.dev/articles/vitals', note: 'The metrics used to measure the real experience in the browser. It defines what fast is from the user’s point of view and not the server’s.' },
    { t: 'Google SRE Book — Service Level Objectives', u: 'https://sre.google/sre-book/service-level-objectives/', note: 'Percentiles, aggregation and why the average deceives.' },
    { t: 'Microsoft Learn — ASP.NET Core metrics', u: 'https://learn.microsoft.com/en-us/aspnet/core/log-mon/metrics/metrics', note: 'System.Diagnostics.Metrics and ASP.NET Core’s built-in metrics.' },
    { t: 'Microsoft Learn — HybridCache', u: 'https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid', note: 'The recommended cache in modern .NET, with stampede protection.' }
  ],
  days: [
    {
      t: 'Defining fast: objectives, percentiles and the average trap',
      obj: 'Write numeric performance objectives for VetCare and understand why the average is the metric that produces the most deception.',
      why: 'Without a target number, "optimising" has no end and no criterion. And understanding percentiles is one of those things that, when you explain it well in an interview, completely changes the impression you make.',
      study: { r: 4, what: 'Read the "Indicators in Practice" section of the chapter, especially the part on aggregation. About 12 minutes. Look for one thing: why the latency average hides the users having the worst time and why p50, p95 and p99 are measured. Brendan Gregg’s USE method is extra reading.',
        pasos: [
          'Read "Indicators" in the terminology part (~3 min): what an SLI is.',
          'Read "What Do You and Your Users Care About?" (~3 min): which indicators matter depending on the kind of service.',
          'Read "Aggregation" carefully (~5 min): the example where the mean hides spikes and why percentiles are used.',
          'Write three objectives for VetCare with a percentile and a number, for example: p95 of the day’s schedule under 300 ms.',
          'Optional: if you have time left, read the summary of Brendan Gregg’s USE method to have an ordered walk through resources.'
        ] },
      ex: {
        title: 'Why the average lies and the percentile does not',
        body: `Ten requests to /api/appointments, time in milliseconds:

  50, 55, 60, 52, 58, 54, 51, 57, 53, 2400

  Average ....... 289 ms    "it's fine"
  Median (p50) ..  54 ms    the typical experience
  p95 ........... 2400 ms   what 1 in 20 suffers
  Maximum ....... 2400 ms

The average describes nobody: neither the one who waited 54 ms nor
the one who waited 2.4 s. If you have 1000 requests a day, the p95 leaves
50 with a bad experience, every day.

And with a page that makes 5 calls, the probability that
at least one falls in that 5% is 1 - 0.95^5 = 23%. Almost one in
four loads feels slow even though the average is good.

--- VetCare performance objectives ---

| Operation                  | p50     | p95     | p99     |
|----------------------------|---------|---------|---------|
| GET  /api/v1/agenda?day=   | < 80ms  | < 300ms | < 800ms |
| POST /api/v1/appointments  | < 150ms | < 500ms | < 1s    |
| GET  /api/v1/pets/{id}     | < 60ms  | < 200ms | < 500ms |
| Login                      | < 300ms | < 600ms | < 1s    |
| Initial web load           | < 1.5s  | < 2.5s  | < 4s    |

Note: login is slow ON PURPOSE. BCrypt with workFactor 12
takes about 250 ms and that is the defence, not a problem.

Budget per schedule request (p95 = 300 ms):
  network and TLS ..  30 ms
  middleware/auth ..  10 ms
  SQL query ........ 150 ms   <- where there is most room
  serialisation ....  20 ms
  margin ...........  90 ms`
      },
      steps: [
        'Write VetCare’s objectives table in docs/performance.md. Put numbers even if they seem made up: a debatable objective is infinitely better than none, because it can be corrected with data.',
        'For your most important endpoint, split the p95 budget between the stages as in the example. It forces you to think where the time might be before measuring it, and then you compare your intuition with reality.',
        'Calculate by hand, with the example’s formula, what percentage of your schedule page loads will hit the p95 if it makes three calls (hint: 1 - 0.95^3). The number that comes out usually surprises and justifies why the p95 matters so much.',
        'Apply the USE method to your local environment: for CPU, memory, disk and database connections, note how you would measure utilisation, saturation and errors. Do not measure yet, just write the how.',
        'Note in the document a sentence you will respect all week: no optimisation goes in without a measurement before and another after.'
      ],
      vet: [
        'Decide which is VetCare’s critical operation, the one reception does most times a day. That is the one you will measure and optimise for the rest of the week; the rest can wait.',
        'Add docs/performance.md to the README’s index next to the other documents.'
      ],
      edge: [
        'Optimising something that runs once a day is time wasted even if you make it ten times faster. The priority is frequency times impact, not technical difficulty or how fun the problem is.',
        'Percentiles are not averaged. The p95 of two servers is not the mean of their p95s; you need the data together. It is a mistake made daily in reports.',
        'An objective without a data source is a wish. Write next to each number how you are going to measure it, or the day it is not met you will not even know whether it is true.'
      ],
      quiz: [
        { q: 'Why does the p95 say more than the average?', a: 'Because the average gets dragged by extreme values and ends up describing a user who does not exist. The p95 tells you the time one in twenty suffers, who are real people and usually the same ones: those with more data or a worse connection.' },
        { q: 'If each call meets the p95 95% of the time, why does a page with five calls feel slow much more often?', a: 'Because the page is only fast if all the calls are fast, and the probability that all five are under the threshold is 0.95 to the power of 5, about 77%. That is, almost one in four loads will have at least one slow call.' },
        { q: 'What are utilisation, saturation and errors in the USE method?', a: 'Utilisation is what percentage of time the resource is busy, saturation is how much work is waiting in a queue because the resource cannot keep up, and errors are that resource’s failures. Saturation is usually the most revealing: a CPU at 70% with a long queue does worse than one at 95% with no queue.' },
        { q: 'Why set a numeric objective before measuring?', a: 'Because without an objective there is no criterion to decide whether to optimise or when to stop, and every performance discussion becomes a matter of opinion. With a number, the data decides.' }
      ],
      out: 'docs/performance.md with a table of objectives by percentile, a budget by stage and the critical operation chosen.',
      file: 'docs/performance.md'
    },
    {
      t: 'Measuring the API: where the time really goes',
      obj: 'Instrument the API to know how long each request takes and on what, and generate enough load to get real percentiles.',
      why: 'Intuition about where the time goes is right much less often than people think. Measuring first is the habit that separates someone who optimises from someone who tinkers, and in an interview it shows instantly in how you describe the process.',
      study: { r: 5, what: 'Read the ASP.NET Core metrics page. About 12 minutes. What interests you is that .NET already comes with built-in counters and histograms (for example http.server.request.duration), so you do not need a library to start measuring.',
        pasos: [
          'Read "Use metrics" (~3 min): what metrics ASP.NET Core brings without you doing anything.',
          'Read "View metrics with dotnet-counters" (~4 min) and run it against your API while making requests.',
          'Read "Create custom metrics" and "Creating metrics in ASP.NET Core apps with IMeterFactory" (~5 min).',
          'Skim "ASP.NET Core meters and counters" (~2 min) and find http.server.request.duration.',
          'Generate load with a loop of requests and note the p50, p95 and p99 of your three main endpoints.'
        ] },
      ex: {
        title: 'A timing middleware and a histogram per endpoint',
        body: `// Basic measurement: how long each request takes, by route
var meter = new Meter("VetCare.Api");
var duration = meter.CreateHistogram<double>(
    "vetcare.request.duration", unit: "ms");

app.Use(async (ctx, next) =>
{
    var start = Stopwatch.GetTimestamp();
    try
    {
        await next();
    }
    finally
    {
        var ms = Stopwatch.GetElapsedTime(start).TotalMilliseconds;
        var route = ctx.GetEndpoint()?.DisplayName ?? "unknown";

        duration.Record(ms,
            new KeyValuePair<string, object?>("route", route),
            new KeyValuePair<string, object?>("status", ctx.Response.StatusCode));

        if (ms > 500)
            app.Logger.LogWarning("Slow request {Route} {Ms}ms", route, ms);
    }
});

// See the SQL EF Core really runs, only in development
options.UseNpgsql(connection)
       .EnableSensitiveDataLogging(isDevelopment)
       .LogTo(Console.WriteLine, LogLevel.Information);

// Measure a specific piece of code when you suspect it
// (in week 22 you will see the good way, with ActivitySource)
using var activity = new Activity("QueryAgenda").Start();
// ... code ...

# --- Generate load to get percentiles ---
# Install: brew install bombardier  (on Mac; or download it from
#   github.com/codesenberg/bombardier/releases; hey or k6 also work).
#   Careful: it is NOT a dotnet tool.
# -l asks for the latency distribution (the percentiles).
# The session goes in week 18's cookie; copy its value from the browser.

bombardier -c 10 -n 500 -l \\
  -H "Cookie: vetcare_session=$SESSION" \\
  "http://localhost:8080/api/v1/agenda?day=2026-10-05"

# Statistics        Avg      Stdev        Max
#   Reqs/sec       142.31     38.22     210.00
#   Latency       70.21ms    42.1ms    812.0ms
#   Latency Distribution
#      50%    54ms     <- the typical experience
#      95%   180ms     <- the objective you set
#      99%   640ms     <- the tail, where the problem is`
      },
      steps: [
        'Add the measurement middleware and the slow request warning to your API. Start it and browse the web for a while: you should see warnings for requests over half a second.',
        'Turn on EF Core’s SQL logging in development and use the web normally for two minutes. Read the console: there is almost always a query you did not expect or one repeated many times.',
        'Load real data into your database. With twenty rows everything is fast; generate at least fifty thousand appointments and ten thousand pets with a script. Measuring against an empty database measures nothing.',
        'Install bombardier or hey and fire load at your critical endpoint. Note p50, p95 and p99 in docs/performance.md as the baseline. This number is what you will compare everything you do for the rest of the week against.',
        'Compare the baseline with day 1’s objectives. Mark which endpoints meet them and which do not. Only the ones that do not are candidates for optimisation; the rest are finished and are not touched.'
      ],
      vet: [
        'Keep the script that generates the test data in database/load-seed.sql or as a command of your CLI, so you can regenerate the same scenario whenever you want to compare.',
        'Add to docs/performance.md a baseline table with date, data volume and the three percentiles per endpoint. Without the data volume the measurement is not comparable.'
      ],
      edge: [
        'Measuring in Debug mode gives numbers that mean nothing: the compiler does not optimise the same way and there are extra checks. Always measure in Release.',
        '.NET’s first request is always slow because of JIT compilation and cold start. Discard the warm-up before measuring or you will put it in the p99 and chase a ghost.',
        'If you generate load from the same machine running the server, you are competing for CPU with yourself. For fine numbers, generate the load from another machine; to compare before and after, it does not matter as long as the conditions are the same.'
      ],
      quiz: [
        { q: 'Why is measuring with little data in the database useless?', a: 'Because with few rows PostgreSQL walks the whole table in microseconds and every query looks fast, even those that do not use an index. Performance problems appear when the volume changes the execution plan, so you have to measure with a volume similar to the real one.' },
        { q: 'What does it tell you if the median is good but the p99 is terrible?', a: 'That most requests go well and there is a minority behaving very differently. Typical causes are a specific case with much more data, a cache that misses, lock contention or an external call that sometimes gets stuck.' },
        { q: 'Why discard the first requests of a measurement?', a: 'Because cold start includes JIT compilation, opening the connection pool and lazy loads that only happen once. If you include them, they contaminate the tail of the distribution and you end up optimising something that only happens at startup.' },
        { q: 'What does a histogram per endpoint give you compared with a simple log of times?', a: 'It gives you the full distribution and lets you compute percentiles by route and status code, instead of having to read thousands of log lines by hand. It can also be aggregated and graphed, which is what you will need in observability week.' }
      ],
      out: 'Measurement middleware active, a database with realistic volume, and a baseline table with p50/p95/p99 per endpoint.',
      file: 'docs/performance.md'
    },
    {
      t: 'The database: where the problem almost always is',
      obj: 'Find VetCare’s real slow queries, diagnose them with EXPLAIN ANALYZE and fix the ones that miss the objective.',
      why: 'In a typical management application, between 70 and 90 percent of a request’s time goes into the database. It is where an hour of work pays off more than anywhere else, and it is what backend interviews ask about most.',
      study: { r: 1, what: 'Go over PostgreSQL’s Using EXPLAIN page, especially the part on EXPLAIN ANALYZE and the difference between estimated rows and actual rows. About 12 minutes. The signal you are looking for: when estimate and reality are far apart, the planner is choosing badly because its statistics do not reflect your data.',
        pasos: [
          'Reread "EXPLAIN ANALYZE" (~6 min) with your slowest query in front of you.',
          'Look in your plan for the nodes where estimated rows and actual rows differ by more than ten times.',
          'Reread "Caveats" (~2 min).',
          'Run ANALYZE on the table involved and repeat the EXPLAIN ANALYZE: if the plan changes, the problem was the statistics.',
          'Note each query with its time before and after the fix.'
        ] },
      ex: {
        title: 'From the symptom to the plan and from the plan to the fix',
        body: `-- 1. Which queries really hurt (requires pg_stat_statements)
-- Careful: the extension has to be loaded when PostgreSQL STARTS. With Docker:
--   docker run ... postgres:17 -c shared_preload_libraries=pg_stat_statements
-- (in compose: command: ["postgres", "-c",
--                        "shared_preload_libraries=pg_stat_statements"])
-- Without that, the query below errors even if you create the extension.
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT substring(query, 1, 70) AS query,
       calls,
       round(mean_exec_time::numeric, 2)  AS mean_ms,
       round(total_exec_time::numeric, 0) AS total_ms
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Sort by TOTAL TIME, not by mean: a 5 ms query
-- called 100,000 times hurts more than a 2 s one called twice.

-- 2. Diagnose the worst one
EXPLAIN (ANALYZE, BUFFERS)
SELECT a.id, a.starts_at, p.name
FROM appointment a
JOIN pet p ON p.id = a.pet_id
WHERE a.starts_at >= '2026-10-05' AND a.starts_at < '2026-10-06'
ORDER BY a.starts_at;

-- BEFORE:
-- Seq Scan on appointment  (cost=0..9821 rows=48 width=..)
--   (actual time=0.02..142.8 rows=37 loops=1)
--   Filter: (starts_at >= ... AND starts_at < ...)
--   Rows Removed by Filter: 49963      <- reads 50,000 to return 37
-- Buffers: shared hit=12 read=4310     <- 4310 blocks from disk
-- Execution Time: 148.221 ms

-- 3. Fix
CREATE INDEX CONCURRENTLY ix_appointment_starts_at ON appointment (starts_at);

-- AFTER:
-- Index Scan using ix_appointment_starts_at on appointment
--   (actual time=0.03..0.31 rows=37 loops=1)
-- Buffers: shared hit=9 read=3
-- Execution Time: 0.482 ms            <- 300 times faster

-- Signals in a plan, from worst to best:
--   Seq Scan on a big table with a selective filter -> missing index
--   Huge Rows Removed by Filter                     -> badly chosen index
--   estimated rows very far from actual rows        -> ANALYZE / statistics
--   Nested Loop with high loops=N                   -> smells like N+1
--   Sort with "external merge Disk"                 -> raise work_mem or index

-- 4. The classic N+1 from EF Core (week 12)
-- 1 query for appointments + 1 per pet = 38 trips to the database
var appointments = await db.Appointments.Where(a => a.Start >= day).ToListAsync();
foreach (var a in appointments) { var p = await db.Pets.FindAsync(a.PetId); }

-- Fix: a single query with a join and a projection (like DailyAgenda)
var rows = await (from a in db.Appointments.AsNoTracking()
                  join p in db.Pets on a.PetId equals p.Id
                  where a.Start >= day && a.Start < day.AddDays(1)
                  select new { a.Id, a.Start, Pet = p.Name })
                 .ToListAsync();`
      },
      steps: [
        'Turn on pg_stat_statements in your PostgreSQL (starting it with shared_preload_libraries, as in the example), use the application for a few minutes generating real traffic and then run the query for the ten worst ordered by total time.',
        'Take the worst one and run EXPLAIN (ANALYZE, BUFFERS) on it. Read the plan from the inside out and find the signals from the list: sequential scan, rows discarded by filter, estimate far from reality.',
        'Fix that query. It is usually an index, but sometimes it is the query that is badly framed: it fetches columns it does not use, sorts by something unnecessary or is run in a loop from the code.',
        'Run EXPLAIN ANALYZE again and note the before and after in docs/performance.md with the time and buffers read. Without the before, the improvement is an unsupported claim.',
        'Look for N+1 in your code by reviewing yesterday’s SQL log: if you see the same query repeated many times with different parameters, you have one. Fix it with a projection in a single query as in the example.'
      ],
      vet: [
        'Add each new index to database/indexes.sql with a comment above it: which query justifies it and what measured time it improved. An index without a written justification is one nobody will ever dare to delete.',
        'Repeat day 2’s load measurement on the critical endpoint and compare the p95 with the baseline. That comparison is the day’s real deliverable.'
      ],
      edge: [
        'Every index speeds up reads and slows down writes, as well as taking space. On a table with many inserts, five little-used indexes can cost more than they save.',
        'CREATE INDEX locks the table for writes. In production use CREATE INDEX CONCURRENTLY, which takes longer but does not lock. Get used to it now even if you are local.',
        'If estimated and actual rows differ by orders of magnitude, the planner is working with old information. Run ANALYZE on the table before concluding the problem is something else.'
      ],
      quiz: [
        { q: 'Why sort pg_stat_statements by total time and not by mean time?', a: 'Because what affects the system is the accumulated time. A 5 ms query run a hundred thousand times consumes much more than a two-second one run twice, and the first one is usually easier to fix too.' },
        { q: 'What does a Seq Scan with a high Rows Removed by Filter value mean?', a: 'That PostgreSQL is reading the whole table and discarding almost everything after reading it, because it has no index to go straight to the rows meeting the condition. It is the clearest sign that an index is missing.' },
        { q: 'What does it indicate when estimated rows are very far from actual ones?', a: 'That the table’s statistics are out of date and the planner is choosing its strategy with false information. It is fixed by running ANALYZE, and if it happens often, by tuning the autovacuum frequency.' },
        { q: 'Why not add indexes to every column just in case?', a: 'Because every index has to be maintained on every insert, update and delete, it consumes space and memory, and on top of that it can confuse the planner. Indexes are added for specific, measured queries, not as a precaution.' }
      ],
      out: 'The three worst queries diagnosed and fixed, with before and after measured, and the indexes justified in writing.',
      file: 'docs/performance.md'
    },
    {
      t: 'Caching: the most abused optimisation',
      obj: 'Decide with judgement what deserves a cache, implement it with correct invalidation and know when not to cache.',
      why: 'Caching is everyone’s first idea and the cause of the hardest bugs to reproduce. Being able to explain when not to cache shows more judgement than knowing how to implement it, and it is exactly what distinguishes a mature answer in an interview.',
      study: { r: 6, what: 'Read the HybridCache page. About 12 minutes. Notice GetOrCreateAsync (the cache-aside pattern), invalidation by tags and how it avoids a stampede when many requests ask for the same key at once.',
        pasos: [
          'Read "Register the service" and "Get and store cache entries" (~4 min).',
          'Read "The main GetOrCreateAsync overload" (~3 min): if it is not in the cache, it computes it only once even if many requests arrive at the same time.',
          'Read "Cache key guidance" (~3 min).',
          'Read "Remove cache entries by key" and "Remove cache entries by tag" (~3 min): that is how you invalidate when the data changes.',
          'Make a table of VetCare data: cached or not, how long it lasts and which event invalidates it.'
        ] },
      ex: {
        title: 'What to cache, with what expiry and how to invalidate',
        body: `// Before caching, three questions:
//   1. Is it read much more than it is written?
//   2. Does it matter if it is a few seconds out of date?
//   3. Is computing it really expensive? (measured, not assumed)
// If any answer is no, do not cache.

// --- Decision table for VetCare ---
// List of vets .............. YES  changes once a month
// Service catalogue ......... YES  changes very little
// Day's schedule ............ NO   changes constantly and
//                                  showing it stale causes double bookings
// Clinical history .......... NO   sensitive data, little traffic
// User permissions .......... CAREFULLY: if you revoke a role,
//                                  the cache keeps it active

// dotnet add package Microsoft.Extensions.Caching.Hybrid
// and in Program.cs: builder.Services.AddHybridCache();

public sealed class VetService(HybridCache cache, VetCareDbContext db)
{
    private const string Key = "vets:active";

    // If it is not in the cache, it computes it; if 100 requests ask for the key
    // at once, only ONE goes to the database and the rest wait for its result.
    public async Task<List<VetDto>> ActiveAsync(CancellationToken ct)
        => await cache.GetOrCreateAsync(
            Key,
            async token => await db.Vets
                .Where(v => v.Active)
                .Select(v => new VetDto(v.Id, v.Name))
                .AsNoTracking()
                .ToListAsync(token),
            new HybridCacheEntryOptions { Expiration = TimeSpan.FromMinutes(10) },
            cancellationToken: ct);

    // Invalidate on write: if you do not do this, the cache lies.
    public async Task DeactivateAsync(Guid id, CancellationToken ct)
    {
        await db.Vets.Where(v => v.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(v => v.Active, false), ct);
        await cache.RemoveAsync(Key, ct);
    }
}

// HTTP cache: sometimes the best cache is the one you do not write
ctx.Response.Headers.CacheControl = "public, max-age=300";
// and for resources with a hash in the name (Vite already does it):
// "public, max-age=31536000, immutable"`
      },
      steps: [
        'Write the cache decision table for VetCare: for each piece of data queried a lot, answer the three questions and note yes and why, or no and why. A reasoned no is worth as much as a yes.',
        'Implement a cache only for what passed the three questions. It will normally be one or two things, not ten. If your list of candidates is long, you are probably caching to avoid fixing queries.',
        'Implement the invalidation in the same commit as the cache, never afterwards. A cache without invalidation is a bug scheduled to appear when you no longer remember it exists.',
        'Measure again with load and compare. If the improvement is small, remove the cache: you have added complexity and a source of bugs for nothing, and that decision is documented too.',
        'Add Cache-Control headers to the web’s static resources and check in the browser’s network tab that the second load serves them from the cache. It is the cheapest cache there is and many people forget it.'
      ],
      vet: [
        'Document every cache in docs/performance.md: what it stores, how long it lasts, what invalidates it and what happens if it serves stale data. That last column is the one that really matters.',
        'Check the permissions case: if you cache the user’s role, write explicitly how long a revocation can take to apply. It is a security decision, not a performance one.'
      ],
      edge: [
        'Invalidation is the hard problem, not storage. Before adding a cache be clear about who deletes it and on which operations, or you will end up debugging phantom data for hours.',
        'A cache stampede happens when a heavily used entry expires and a hundred simultaneous requests rush to recompute it at once. It is mitigated with a per-key lock (HybridCache already does it) or with slightly random expiries.',
        'Caching something per user multiplies memory by the number of users and usually has a very low hit rate. If the data depends on the user, it is almost always better to make the query fast than to cache it.'
      ],
      quiz: [
        { q: 'What are the three questions before caching something?', a: 'Is it read much more than it is written, does it matter little if it is somewhat out of date, and is computing it really expensive, measured and not assumed. If any of the three fails, the cache adds complexity and risk without proportional benefit.' },
        { q: 'Why should the day’s schedule not be cached in VetCare?', a: 'Because it changes constantly and showing an old version has real consequences: reception can book over a slot that no longer exists. When the cost of stale data is a business error, caching is ruled out.' },
        { q: 'What is a cache stampede and how is it avoided?', a: 'It is what happens when a heavily requested entry expires and many simultaneous requests try to recompute it at once, hitting the database at the worst moment. It is avoided with a per-key lock that lets only one recompute, or by adding random variation to the expiries.' },
        { q: 'Why is caching user permissions delicate?', a: 'Because if you revoke a role and the cache keeps serving the old one, that user keeps access for the whole duration of the entry. It stops being a performance detail and becomes a security window, so the duration has to be short and written down.' }
      ],
      out: 'A cache decision table written, one or two caches implemented with invalidation, and the improvement measured or the cache removed.',
      file: 'docs/performance.md'
    },
    {
      t: 'Perceived performance in the browser',
      obj: 'Measure VetCare’s web with the metrics the user sees and reduce how long it takes to be useful, not just to respond.',
      why: 'The user does not measure server milliseconds, they measure how long it takes before they can do their job. Core Web Vitals is the standard language for that and comes up in any serious frontend conversation.',
      study: { r: 3, what: 'Read web.dev’s Core Web Vitals page. About 12 minutes. Keep the three metrics and what each one measures: LCP when the main content appears, INP how long it takes to respond to your interaction, CLS how much the page moves while loading.',
        pasos: [
          'Read the introduction of "Core Web Vitals" (~4 min): LCP, INP and CLS with their good thresholds.',
          'Read "Field tools to measure Core Web Vitals" and "Lab tools to measure Core Web Vitals" (~3 min): real data versus lab tests.',
          'Read "Recommendations for improving your scores" (~2 min).',
          'Open Lighthouse in the developer tools, analyse the schedule page and note the three metrics.'
        ] },
      ex: {
        title: 'Diagnosing and reducing the cost of loading',
        body: `// 1. Measure in the browser: Lighthouse tab, mobile mode,
//    with network and CPU throttling. Without throttling, everything looks
//    fast because your machine is not your user's.

// 2. See what really weighs in the bundle
//    npm run build
//    dist/assets/index-a1b2c3.js   842 kB   <- too much
//
//    npm i -D rollup-plugin-visualizer
//    and check the map: there is almost always a huge library
//    you use for a single thing.

// 3. Split the bundle by routes (week 17)
const Billing = lazy(() => import('./pages/Billing'));
const History = lazy(() => import('./pages/History'));
// Reception, which only uses the schedule, no longer downloads billing.

// 4. Reserve the space so the page does not jump (CLS)
<div style={{ minHeight: 420 }}>
  {loading ? <ScheduleSkeleton rows={8} /> : <Schedule appointments={appointments} />}
</div>
// The skeleton must take up the same space as the real content.
// If not, the user clicks where there was a button that moved.

// 5. Take work off the main thread (INP)
// BAD: filtering 5000 items on every keystroke
const visible = all.filter(a => a.name.includes(search));

// GOOD: memoise and defer the search
const deferredSearch = useDeferredValue(search);
const visible = useMemo(
  () => all.filter(a => a.name.includes(deferredSearch)),
  [all, deferredSearch]
);

// 6. Request the data before it is needed (week 17)
<Link
  to={'/appointments/' + appointment.id}
  onMouseEnter={() => qc.prefetchQuery(appointmentOptions(appointment.id))}
>`
      },
      steps: [
        'Run Lighthouse on your web in mobile mode with throttling on and note LCP, INP and CLS. The first impression is almost always worse than you expected, and that is the point.',
        'Look at the bundle size after npm run build. If it is over about 300 kB compressed, install the visualiser and find out what is inflating it before touching anything.',
        'Apply lazy loading by route to the pages not used in the first minute of a session. Rebuild and compare the size of the initial bundle.',
        'Look for content jumps: reload with the network throttled and watch whether anything moves. Reserve space with skeletons the same size as the real content.',
        'Run Lighthouse again and note the before and after of the three metrics in docs/performance.md. If any got worse, find out why before going on.'
      ],
      vet: [
        'Check that VetCare’s schedule is usable in under two and a half seconds on simulated mobile. It is the screen reception opens fifty times a day and the only one whose time really matters.',
        'Add a frontend section to docs/performance.md with the three metrics before and after and which specific change produced each improvement.'
      ],
      edge: [
        'Measuring with your machine and your fibre does not measure your users. Always use network and CPU throttling, because a mid-range phone is four to six times slower than your laptop.',
        'Splitting the code too much also penalises: each chunk is one more request. Split by routes and by heavy libraries, not by component.',
        'useMemo and useCallback are not free: they have comparison and memory costs. Use them when you have measured that the recalculation hurts, not by habit.'
      ],
      quiz: [
        { q: 'What do LCP, INP and CLS measure?', a: 'LCP measures how long the main content takes to appear, INP how long the page takes to respond to a user interaction, and CLS how much the content shifts unexpectedly while loading. Together they describe whether the page feels fast, responsive and stable.' },
        { q: 'Why measure with network and CPU throttling?', a: 'Because your development environment is much better than your users’: a mid-range phone has a CPU several times slower and a worse connection. Without throttling, every metric comes out fine and you detect nothing.' },
        { q: 'How does lazy loading by route reduce the initial time?', a: 'Because the browser only downloads the code of the page being viewed, instead of the whole application’s. Whoever only uses the schedule never pays the cost of downloading billing or history.' },
        { q: 'Why must a skeleton take up the same space as the real content?', a: 'Because if it takes less, when the data arrives everything below shifts and that is exactly what CLS measures. Besides looking bad, it causes accidental clicks on buttons that moved just before being pressed.' }
      ],
      out: 'Lighthouse measured before and after, initial bundle reduced with lazy loading, and content jumps removed.',
      file: 'docs/performance.md'
    },
    {
      t: 'Optimisation report (weekly exam)',
      obj: 'Gather all the measurements into a report that proves improvements with data and that you can defend in an interview.',
      why: 'Saying "I optimised the application" means nothing. Saying "the schedule’s p95 went from 840 to 115 ms by adding an index that removed a sequential scan of fifty thousand rows, and here is the plan before and after" is a story people remember.',
      study: { r: 0, what: 'Reread your own notes from the week in docs/performance.md. About 10 minutes. Look for one specific thing: in which case your initial intuition about where the problem was failed. That is the most valuable part of the report and the one that best shows you really measured.',
        pasos: [
          'Read the "Summary" of the USE method (~3 min) and use it as a list: utilisation, saturation and errors of each resource.',
          'Reread your notes from the week in docs/performance.md.',
          'Mark the case where your initial intuition failed and tell how you discovered it.',
          'Order the findings by measured impact, not by the effort they cost you.'
        ] },
      ex: {
        title: 'Structure of the performance report',
        body: `# Performance report - VetCare
Date: 2026-xx-xx
Test data: 50,000 appointments, 10,000 pets, 12 vets
Environment: local, Release, PostgreSQL 17 in Docker
Load: bombardier -c 10 -n 500

## 1. Objectives
| Operation                | p95 target | Before | After  | Met |
|--------------------------|------------|--------|--------|-----|
| GET /api/v1/agenda       | 300 ms     | 840 ms | 115 ms | YES |
| POST /api/v1/appointments| 500 ms     | 410 ms | 390 ms | YES |
| GET /api/v1/pets         | 200 ms     | 95 ms  | 95 ms  | YES |
| Web load (mobile)        | 2.5 s      | 4.1 s  | 1.9 s  | YES |

## 2. Changes, one by one
### 2.1 Index on appointment(starts_at)
Symptom: schedule p95 at 840 ms.
Diagnosis: EXPLAIN ANALYZE showed a Seq Scan reading 50,000
rows to return 37. 4310 blocks read from disk.
Change: CREATE INDEX CONCURRENTLY ix_appointment_starts_at ON appointment (starts_at);
Result: query from 148 ms to 0.5 ms. Endpoint p95 840 -> 190 ms.
Cost: appointment writes +3%, measured. Acceptable.

### 2.2 N+1 when listing the schedule
Symptom: 38 queries per request in the EF Core log.
Diagnosis: loop over appointments doing FindAsync for each pet.
Change: a single query with a projected Select and AsNoTracking.
Result: 38 queries -> 1. p95 190 -> 115 ms.

### 2.3 Lazy loading by route in the web
Symptom: initial bundle of 842 kB, LCP of 4.1 s on mobile.
Diagnosis: billing and history were always downloaded.
Change: lazy + Suspense on the non-critical routes.
Result: initial bundle 842 -> 310 kB. LCP 4.1 -> 1.9 s.

## 3. What I did NOT do and why
- Caching the schedule: discarded. It changes constantly and serving
  stale data would allow booking over a taken slot.
- Read replica: unnecessary. A clinic does not generate the
  volume that would justify it and it would add operational complexity.
- Rewriting the queries in Dapper: projected EF Core already meets
  the objective. Measured, not assumed.

## 4. What I learned
My intuition said the bottleneck was JSON serialisation.
The measurement said serialisation was 8 ms out of 840. 94%
of the time was in a single query without an index.

## 5. Next known limit
With several million appointments, the index stops being enough and the
table will have to be partitioned by month.`
      },
      steps: [
        'Write docs/performance-report.md with the example’s five sections. Each change needs symptom, diagnosis, change, measured result and cost. If you are missing any of the five, that change is not justified.',
        'Review section 3 with special care. What you decided not to do and why shows more judgement than the list of things you did, and it is what a senior interviewer will look for.',
        'Complete section 4 honestly: where your intuition failed. It is the part that proves you measured instead of guessing, and the one that gives you the most credibility.',
        'Check the week’s list: objectives written by percentile, baseline measured with realistic volume, the three worst queries diagnosed with EXPLAIN ANALYZE, N+1s removed, caches justified or discarded in writing, Lighthouse before and after, and every change with its measurement.',
        'Run a last round of load against every endpoint in the objectives table and confirm that the report’s numbers are reproducible today. A report with data from three days ago and code that changed afterwards is useless.',
        'Explain out loud in three minutes a single optimisation from start to finish: symptom, how you measured it, what you found, what you changed and how much it improved. That is literally the answer to "tell me about a time you improved the performance of something".'
      ],
      vet: [
        'Add to VetCare’s README a line with the most striking result and the link to the report. It is one of the first things someone looks at and it communicates a lot in a single sentence.',
        'Keep the load script and the test data script in the repository so you can repeat the measurement after any big change.',
        'Press "Mark for review" and reread docs/performance-report.md in a week.'
      ],
      edge: [
        'An optimisation without a prior measurement is not an optimisation, it is a change. It might improve things, it might make them worse, and without a number you will never know.',
        'Every optimisation has a cost: complexity, memory, slower writes or a cache to invalidate. If you cannot name the cost, you have not fully understood the change.',
        'Optimising before the problem exists usually costs readability for nothing. The exception is structural decisions that are hard to change later, such as the database schema or the shape of the API contracts.'
      ],
      quiz: [
        { q: 'Why does a performance report need the before and the after?', a: 'Because without the before there is no way to know whether the change improved anything or by how much, and "it’s faster" without a number is an opinion. The before is also what lets you discover that an optimisation that seemed obvious was useless.' },
        { q: 'Why is the section on what you did not do so valuable?', a: 'Because it shows you evaluated alternatives and decided with judgement instead of applying everything you knew. Discarding a cache by reasoning about its cost says more about your technical maturity than implementing it.' },
        { q: 'What typical cost does each of the optimisations you did this week have?', a: 'The index speeds up reads but slows writes and takes space; removing the N+1 usually means a query that is harder to read; the cache adds an invalidation to maintain and a window of stale data; and lazy loading introduces an extra request when navigating. Naming the cost is part of understanding the change.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That performance is not a set of tricks but a method: you define what fast means with a number, you measure where the time goes instead of assuming it, you change one thing and measure again, and you accept that your intuition about the bottleneck is almost always wrong.' }
      ],
      out: 'docs/performance-report.md complete with objectives met, every change measured, the discarded options justified and the next limit identified.',
      file: 'docs/performance-report.md'
    }
  ]
}
]);
