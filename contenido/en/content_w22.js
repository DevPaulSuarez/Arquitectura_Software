window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 22,
  phase: 'Observability',
  title: 'Observability: knowing what happens when you are not looking',
  idea: 'Last week you measured with your laptop in front of you and the load you were firing. In production nobody is in front. The system gets requests at three in the morning, fails for a specific user with specific data, and by the time you find out it can no longer be reproduced. Observability is the difference between being able to answer "what happened" and having to say "I don’t know, try again". This week you build the three pieces that give you that answer: logs that can be queried instead of read, metrics that warn you before the user calls, and traces that follow a request through the whole system. And most importantly: you learn that the good question is not "is it down" but "how many people are having a bad time right now".',
  res: [
    { t: 'Google SRE Book — Monitoring Distributed Systems', u: 'https://sre.google/sre-book/monitoring-distributed-systems/', note: 'The chapter that defines the four golden signals and the difference between symptom and cause. It is the most quoted reference in interviews about monitoring.' },
    { t: 'OpenTelemetry — Observability primer', u: 'https://opentelemetry.io/docs/concepts/observability-primer/', note: 'It explains logs, metrics and traces and how they relate. It is the standard every tool supports, so learning it does not tie you to any vendor.' },
    { t: '.NET observability with OpenTelemetry', u: 'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel', note: 'Exactly how it is instrumented in your stack. You use it the day you configure the SDK in VetCare.' },
    { t: 'Google SRE Book — Service Level Objectives', u: 'https://sre.google/sre-book/service-level-objectives/', note: 'SLI, SLO and error budget. It is the framework that turns "it’s fine" into a number you can make decisions with.' }
  ],
  days: [
    {
      t: 'Structured logs: from text to queryable data',
      obj: 'Turn your logs into events with queryable fields and add correlation so you can reconstruct a complete request.',
      why: 'A plain text log is read; a structured one is queried. The difference between searching by eye through ten thousand lines and filtering by user and error code in two seconds is what determines whether you can debug production or not.',
      study: { r: 1, what: 'Read the logs section of the OpenTelemetry primer and the whole introduction. About 12 minutes. Keep one idea: a log is an event with attributes, not a sentence. The text is for the human; the attributes are for the machine that will filter among millions.',
        pasos: [
          'Read "What is Observability?" (~3 min): being able to ask new questions without changing the code.',
          'Read "Logs" (~3 min): notice the difference between a loose log and one with trace context.',
          'Read "Spans" and "Span attributes" (~3 min): this is what an event with attributes looks like.',
          'Choose three VetCare log messages and rewrite them as templates with fields: AppointmentId, VetId, DurationMs.'
        ] },
      ex: {
        title: 'The same event, unreadable and queryable',
        body: `// BAD: everything concatenated into a sentence
logger.LogInformation("Error creating appointment for " + pet.Name +
    " on " + start + ": " + ex.Message);
// Result: a different string every time. You cannot filter by
// anything, you cannot count, you cannot group. And on top of that it leaks
// the pet's name, which is personal data (week 19).

// GOOD: a fixed template + structured attributes
logger.LogWarning(
    "Appointment rejected for overlap {AppointmentId} {VetId} {Start}",
    appointmentId, vetId, start);
// The template is constant, so you can count how many times
// it happened. The attributes are fields, so you can filter by
// vet. And there is no personal data.

// Levels with judgement, not at random:
//   Trace/Debug  only in development
//   Information  business events: appointment created, session started
//   Warning      something went wrong but the system handled it (409, retry)
//   Error        the request failed and someone should look at it
//   Critical     the system cannot keep working

// So the console shows the scopes, and in JSON too:
builder.Logging.AddJsonConsole(o => o.IncludeScopes = true);

// Correlation: an identifier that ties together everything in a request.
// Put it AFTER UseAuthentication, so ctx.User is already filled in.
app.Use(async (ctx, next) =>
{
    var correlation = ctx.Request.Headers["X-Correlation-Id"].FirstOrDefault()
                      ?? Activity.Current?.TraceId.ToString()
                      ?? Guid.NewGuid().ToString();

    ctx.Response.Headers["X-Correlation-Id"] = correlation;

    using (app.Logger.BeginScope(new Dictionary<string, object>
    {
        ["CorrelationId"] = correlation,
        // "sub" arrives as NameIdentifier (week 18)
        ["UserId"] = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous",
        ["Route"] = ctx.Request.Path.Value ?? ""
    }))
    {
        await next();
    }
});
// Now ALL the logs of that request carry those three
// fields without you having to pass them by hand.

// Return the identifier to the client in errors
return Results.Problem(
    title: "The appointment could not be created",
    statusCode: 500,
    extensions: new Dictionary<string, object?> { ["correlationId"] = correlation });
// The user tells you the code and you find their exact request.`
      },
      steps: [
        'Go through your logger calls and turn every concatenation into a template with attributes. Look for plus signs and string interpolation inside Log calls: each one is a log you will not be able to query.',
        'Check the levels you use. It is normal to find everything at Information, errors included. Reassign them according to the example’s table: the level is the first thing you will filter by in an incident.',
        'Add the correlation middleware with BeginScope. Make a request and check in the console that all the lines of that request share the same identifier.',
        'Add the correlation identifier to the error responses in the problem details format you have used since week 11. Test it by causing an error and check that the code in the response appears in the logs.',
        'Check one last time that no log contains names, emails, phone numbers, diagnoses or tokens, as you decided in week 19. Identifiers yes, personal data no.'
      ],
      vet: [
        'Define in docs/observability.md VetCare’s business events that are always logged: appointment created, appointment cancelled, invoice issued, session started, session failed, access denied. With their exact attributes.',
        'Make the frontend send the X-Correlation-Id header generated with crypto.randomUUID on every request, so you can follow a user action from the browser down to the database.'
      ],
      edge: [
        'The message template must be constant. If you put a variable value inside the text instead of as an attribute, each log is a different message and you lose the ability to count and group, which is almost all the value.',
        'Logging too much costs money and hides what matters. A log per iteration of a loop turns your logging system into expensive noise. Log decisions and outcomes, not steps.',
        'Do not log inside a hot loop or on the path of an operation that runs thousands of times a second: writing logs is input and output and can itself become the bottleneck.'
      ],
      quiz: [
        { q: 'What is the difference between a text log and a structured one?', a: 'The text one is a sentence built on each call, so it can only be read. The structured one has a constant template and the values as attributes, so it can be filtered, counted and grouped by any of those fields among millions of events.' },
        { q: 'What is a correlation identifier for?', a: 'To tie together all the events belonging to the same request, even if they go through several components and are written at different times. Without it, the logs of concurrent requests get intermixed and reconstructing a single one is impossible.' },
        { q: 'Why return the correlation identifier to the client in an error?', a: 'Because it turns a useless report like "it doesn’t work" into something actionable: the user gives you the code and you find exactly their request, with all its events, without having to guess when it happened.' },
        { q: 'What criterion do you use to choose between Warning and Error?', a: 'Warning is something that went wrong but the system handled correctly, such as an overlap conflict returned as 409 or a retry that ended up working. Error is a request that failed and that someone should review, because it indicates a problem that is not accounted for.' }
      ],
      out: 'Structured logs with attributes, levels reassigned, end-to-end correlation and the identifier visible in error responses.',
      file: 'docs/observability.md'
    },
    {
      t: 'Metrics and the four golden signals',
      obj: 'Instrument VetCare with latency, traffic, error and saturation metrics, and understand why symptoms are measured and not causes.',
      why: 'It is the standard vocabulary of monitoring. Being able to say "I measure the four golden signals and alert on symptoms, not causes" in an interview immediately communicates that you understand operations and not just development.',
      study: { r: 0, what: 'Read the Monitoring Distributed Systems chapter of Google’s SRE book, specifically the section on the four golden signals and the one on symptoms versus causes. About 15 minutes. The idea that will serve you most: alert on what the user suffers, not on what seems worrying to you.',
        pasos: [
          'Read "Symptoms Versus Causes" (~4 min) and copy its table of examples.',
          'Read "Black-Box Versus White-Box" (~3 min).',
          'Read "The Four Golden Signals" (~5 min): latency, traffic, errors and saturation.',
          'Read "Worrying About Your Tail (or, Instrumentation and Performance)" (~3 min): the average trap again.',
          'Write VetCare’s specific metric for each of the four signals.'
        ] },
      ex: {
        title: 'The four signals applied to VetCare',
        body: `// LATENCY: how long it takes, separating success from error.
//   A fast error and a fast success are not the same thing:
//   if you mix them, a pile of instant 500s improves
//   your percentile and you will think everything is fine.
var latency = meter.CreateHistogram<double>(
    "vetcare.request.duration", "ms");

// TRAFFIC: how many requests per second and of what kind.
var requests = meter.CreateCounter<long>("vetcare.request.total");

// ERRORS: proportion of failed requests. Proportion, not
// absolute number: 100 errors with 1000 requests is a crisis,
// with 1,000,000 it is noise.
var errors = meter.CreateCounter<long>("vetcare.request.error");

// SATURATION: how full the most limited resource is.
// In VetCare it is the PostgreSQL connection pool, and Npgsql already
// publishes it as a metric (meter "Npgsql", db.client.connections.usage):
// you only need to add .AddMeter("Npgsql") when configuring OpenTelemetry
// (day 3). No need to write anything.

app.Use(async (ctx, next) =>
{
    var start = Stopwatch.GetTimestamp();
    try { await next(); }
    finally
    {
        var ms = Stopwatch.GetElapsedTime(start).TotalMilliseconds;
        var route = ctx.GetEndpoint()?.DisplayName ?? "other";
        var code = ctx.Response.StatusCode;

        var tags = new TagList
        {
            { "route", route },
            { "code", code },
            { "success", code < 500 }
        };

        latency.Record(ms, tags);
        requests.Add(1, tags);
        if (code >= 500) errors.Add(1, tags);
    }
});

// Business metrics, worth as much as the technical ones:
var appointmentsCreated = meter.CreateCounter<long>("vetcare.appointment.created");
var appointmentsRejected = meter.CreateCounter<long>("vetcare.appointment.rejected");
// If created appointments drop to zero at 10 in the morning, something
// is broken even though all your technical metrics are green.

// WATCH OUT for cardinality: this sinks any system
// requests.Add(1, new("petId", id));        // 10,000 series
// requests.Add(1, new("route", route));     // 20 series  OK`
      },
      steps: [
        'Instrument the four signals in your API following the example. Separate success from error in latency: it is the detail most people forget and the one that produces most deception.',
        'Add at least two VetCare business metrics, such as appointments created and appointments rejected for overlap. They are the ones that warn you of problems no technical metric detects.',
        'Identify the most limited resource in your system and measure its saturation. In VetCare it is almost certainly the PostgreSQL connection pool.',
        'Review every tag you add and ask how many distinct values it can have. If the answer is more than a few dozen, remove it: you are creating a time series for each value and that sinks any metrics system.',
        'Write in docs/observability.md the list of metrics with their name, type, tags and which question each one answers. A metric that does not answer a specific question is noise you pay for.'
      ],
      vet: [
        'For each VetCare metric write the question it answers. For example: how many people are waiting longer than acceptable to see the schedule. If you do not know the question, the metric is surplus.',
        'Add a counter of accesses denied by authorisation. A spike there can be a permissions bug or an attack, and in both cases you want to know.'
      ],
      edge: [
        'Alert on symptoms and not on causes. A CPU at 90% can be normal; the user waiting eight seconds never is. Cause alerts generate noise and end up being silenced, which is the worst thing that can happen to an alert.',
        'High cardinality is the mistake that costs the most money in observability. A tag with user identifiers creates a time series per user and can multiply your bill by a thousand.',
        'If you mix the latency of successes and errors, an avalanche of fast errors lowers your percentile and makes the dashboard look better just when the system is worse.'
      ],
      quiz: [
        { q: 'What are the four golden signals and what does each one measure?', a: 'Latency, how long it takes to respond; traffic, how much demand it receives; errors, what proportion of requests fail; and saturation, how full the most limited resource is. Together they describe the health of a service from the point of view of whoever uses it.' },
        { q: 'Why alert on symptoms and not on causes?', a: 'Because symptoms are what the user suffers and always deserve attention, while causes can be out of the ordinary without anyone noticing. Alerting on causes generates warnings that correspond to no real problem, and alerts that cry wolf end up being ignored.' },
        { q: 'Why measure latency separating successes from errors?', a: 'Because an error returned in two milliseconds enters the distribution as if it were a super fast response and improves your percentile. If you mix them, a massive failure can leave your dashboard green while no user can work.' },
        { q: 'What is cardinality and why does it matter so much?', a: 'It is the number of distinct combinations of tag values, and each combination is a time series that has to be stored and queried. A tag with unique identifiers generates millions of series, which degrades the metrics system and sends the cost through the roof.' }
      ],
      out: 'The four golden signals instrumented, two business metrics, saturation measured and the list documented with its questions.',
      file: 'docs/observability.md'
    },
    {
      t: 'Distributed traces: following a whole request',
      obj: 'Configure OpenTelemetry in VetCare to see a request split into spans and find where the time goes without guessing.',
      why: 'Traces are the piece that turns "the schedule is slow" into "80% of the time is in this specific query". It is the tool that speeds up a diagnosis the most and the one that best shows you know how to operate a system with several pieces.',
      study: { r: 2, what: 'Read the observability with OpenTelemetry in .NET page, focusing on tracing configuration and automatic instrumentation. About 15 minutes. The key idea: a trace is a tree of spans, each span has a duration and attributes, and the context is propagated through headers so several services share the same trace.',
        pasos: [
          'Read "What is observability?" and "Observability approaches in .NET" (~4 min).',
          'Read "What is OpenTelemetry?" and ".NET implementation of OpenTelemetry" (~4 min): Activity is .NET’s span.',
          'Read "OpenTelemetry packages" (~3 min) and note the instrumentation packages for ASP.NET Core, HttpClient and EF Core or Npgsql.',
          'Look at "Examples" (~3 min) to see the full configuration.',
          'Draw the tree of spans you expect to see for creating an appointment before running it, and compare afterwards.'
        ] },
      ex: {
        title: 'From the opaque request to the tree of spans',
        body: `// Installation
// dotnet add package OpenTelemetry.Extensions.Hosting
// dotnet add package OpenTelemetry.Instrumentation.AspNetCore
// dotnet add package OpenTelemetry.Instrumentation.Http
// dotnet add package Npgsql.OpenTelemetry
// dotnet add package OpenTelemetry.Instrumentation.Runtime
// dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol

builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("vetcare-api", serviceVersion: "1.0.0"))
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation(o =>
        {
            // Do not trace the health checks: they are noise
            o.Filter = ctx => !ctx.Request.Path.StartsWithSegments("/health");
        })
        .AddHttpClientInstrumentation()   // outgoing calls
        .AddNpgsql()                      // SQL queries (needs using Npgsql;)
        .AddOtlpExporter())
    .WithMetrics(m => m
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation()
        .AddMeter("VetCare.Api")
        .AddMeter("Npgsql")               // connection pool usage
        .AddOtlpExporter());

// Your own spans for the pieces you care about
private static readonly ActivitySource Source = new("VetCare.Api");

public async Task<Result> ScheduleAsync(Command cmd, CancellationToken ct)
{
    using var span = Source.StartActivity("ScheduleAppointment");
    span?.SetTag("vet.id", cmd.VetId);
    span?.SetTag("appointment.duration_min", cmd.DurationMinutes);

    try
    {
        var r = await _handler.ExecuteAsync(cmd, ct);
        span?.SetTag("result", r.Success ? "ok" : "rejected");
        return r;
    }
    catch (Exception ex)
    {
        span?.SetStatus(ActivityStatusCode.Error, ex.Message);
        throw;
    }
}

// What you see in the viewer (Aspire Dashboard or Jaeger):
//
// POST /api/v1/appointments ...................... 842 ms
//   |- Auth middleware ............................   4 ms
//   |- SELECT vet WHERE id = $1 ..................   3 ms
//   |- SELECT appointment WHERE starts_at BETWEEN . 782 ms  <- HERE
//   |- INSERT INTO appointment ...................  12 ms
//   |- POST https://notifications/send ...........  38 ms
//
// 782 of 842 ms in one query. There is nothing left to guess.

# Local viewer without setting up infrastructure:
# docker run --rm -p 18888:18888 -p 4317:18889 \\
#   mcr.microsoft.com/dotnet/aspire-dashboard:latest
# and OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
# Open http://localhost:18888 with the link (it carries a token) the
# container writes to its logs on startup.`
      },
      steps: [
        'Install the OpenTelemetry packages and configure tracing and metrics as in the example. Add the filter so the health checks are not traced or they will fill the viewer with noise.',
        'Bring up the Aspire dashboard in Docker or Jaeger, point the exporter at it, and make a few requests from the web. Open a trace and look at it: you almost always see something you did not expect.',
        'Add your own spans to the two or three most important VetCare operations, with useful attributes. Avoid putting people’s identifiers as attributes because of what you saw in week 19.',
        'Find in the viewer the slowest of the last requests you made and work out which span the time is in. Compare that result with what you would have assumed before looking.',
        'Make the frontend propagate the trace context: if you send the traceparent header, the trace starts in the browser and ends at the SQL query. It is the complete view of a user action.'
      ],
      vet: [
        'Mark in the scheduling span whether the appointment was rejected for overlap. It lets you search directly for all the rejection traces and see whether there is a pattern by vet or by time.',
        'Check that week 14’s calls with retries appear in the trace as several spans. Seeing the retries drawn out is the quickest way to spot that a dependency is unstable.'
      ],
      edge: [
        'Sampling is necessary in production: tracing a hundred percent of the requests of a high-traffic system costs a lot and adds little. The usual approach is to sample a low percentage and always a hundred percent of errors.',
        'Do not put personal data or secrets as span attributes: traces are exported to external systems and usually have less access control than your database.',
        'A span per function makes the trace unreadable. Create spans at the boundaries that matter: entry, database query, external call, relevant business operation.'
      ],
      quiz: [
        { q: 'What is a trace and what is a span?', a: 'A trace is the complete journey of a request through the system; a span is a specific operation within that journey, with its duration, its attributes and its parent-child relationship. The set of spans forms a tree that shows where the time was spent.' },
        { q: 'How does a trace relate to logs and metrics?', a: 'Metrics tell you something is wrong and for how many people, the trace tells you where the time goes in a specific request, and the logs give you the detail of what happened at that point. The trace identifier is what ties the three views together.' },
        { q: 'Why are traces sampled in production?', a: 'Because generating and storing a trace for every request of a high-traffic system is expensive and most of those traces are identical and add nothing. The usual approach is to sample a fraction of normal traffic and always keep the errors and slow requests.' },
        { q: 'What is the advantage of propagating the trace context from the browser?', a: 'That the trace includes the time the user really experienced, including the network and frontend processing, not just what the server took. That way you can tell a backend problem from a network or rendering one.' }
      ],
      out: 'OpenTelemetry configured, traces visible in a dashboard, your own spans with attributes and a slow request diagnosed with data.',
      file: 'docs/observability.md'
    },
    {
      t: 'SLOs, error budget and alerts that do not cry wolf',
      obj: 'Define service level objectives for VetCare and turn them into alerts based on error budget consumption.',
      why: 'It is the concept that most separates a developer from someone who understands operations. It lets you answer with a number "is the system OK?" and, above all, "can we risk deploying today?".',
      study: { r: 3, what: 'Read the Service Level Objectives chapter of the SRE book, especially the part on the error budget. About 15 minutes. Central idea: the target is never a hundred percent, because a hundred percent prevents changing anything. The margin you have left is precisely your budget to deploy and take risks.',
        pasos: [
          'Read "Objectives" and "Agreements" in the terminology (~4 min): SLO versus SLA.',
          'Read "Defining Objectives" and "Choosing Targets" (~6 min): why the target is never a hundred percent.',
          'Read "Control Measures" and "SLOs Set Expectations" (~4 min).',
          'Calculate your error budget: with a monthly SLO of 99.5%, how many minutes of failure can you afford?'
        ] },
      ex: {
        title: 'From SLI to alert in four steps',
        body: `# VetCare SLOs

## 1. SLI: what exactly you measure
Schedule availability:
  requests to GET /api/v1/agenda with code < 500
  divided by all requests to GET /api/v1/agenda

Schedule latency:
  requests to GET /api/v1/agenda served in under 300 ms
  divided by all requests to GET /api/v1/agenda

## 2. SLO: the target, over a window
  Availability ...... 99.5% over 30 days
  Latency ........... 95% under 300 ms over 30 days

## 3. Error budget: how much failure you can afford
  100% - 99.5% = 0.5% of 30 days = 3 h 36 min a month
  With 20,000 requests a month: 100 requests can fail.

  If you have spent 20% of the budget: relax, deploy.
  If you have spent 90% by day 10: freeze changes and fix
  reliability instead of adding features.

## 4. Alerts: by burn rate, not by a point-in-time threshold

  FAST ALERT  (warn now, wake someone up)
    If over the last hour the budget is being burned at a rate
    that would exhaust it in under 2 days -> incident.
    (error ratio > 7% sustained for 5 min)

  SLOW ALERT  (ticket, look at it tomorrow)
    If over the last 6 hours the rate would exhaust the budget
    before the end of the month -> silent degradation.
    (error ratio > 1% for 6 h)

## Why NOT alert like this:
  "error ratio > 0%"           -> goes off every day, gets silenced
  "CPU > 80%"                  -> cause, not symptom
  "a request took > 1 s"       -> there is always one
  "p95 > 300 ms right now"     -> a 30 s spike is not a problem

## Accepted risks
  - Downtime during deployment: single server. Consumes
    budget consciously, about 40 s per deployment.`
      },
      steps: [
        'Define the SLI of your two most important VetCare operations: the exact formula of good over total. Writing it as a division forces you to decide what counts as good and which requests go in the denominator.',
        'Set the SLO of each one with its window and calculate the error budget in minutes and in number of requests. Seeing the budget expressed in minutes per month completely changes the conversation.',
        'Write the two alerts, the fast one and the slow one, with their specific conditions. Two well-thought-out alerts are worth more than twenty nobody looks at.',
        'Go over any alert you already had and remove the ones that warn about causes instead of symptoms. If an alert does not mean someone is suffering, it should not go off.',
        'Write the accepted risks section: which things you know consume budget and you decide to tolerate. Week 20’s deployment downtime is the clearest example.'
      ],
      vet: [
        'Add a business SLO to VetCare, for example that 99% of created appointments are confirmed correctly. Business SLOs detect failures no status code reveals.',
        'Create a table in docs/observability.md with SLI, SLO, budget and the two alerts of each operation. It is half a page and it is what you will be asked to explain.'
      ],
      edge: [
        'An SLO of a hundred percent is a conceptual mistake: it leaves no budget for deploying, for maintenance or for the network to fail. If your target admits no failure, you have prohibited change.',
        'Alerting on an instantaneous threshold produces warnings for thirty-second spikes that affect nobody. Alert on how fast you burn budget over a window, which is what correlates with real damage.',
        'An alert that goes off and nobody acts on is worse than not having it: it trains the team to ignore alerts, including the one that did matter. If you are not going to act, make it a dashboard and not an alert.'
      ],
      quiz: [
        { q: 'What is the difference between SLI, SLO and error budget?', a: 'The SLI is the measure, a proportion of good events over the total; the SLO is the target you set for that measure over a time window; and the error budget is what is left up to a hundred percent, that is, how much you can afford to fail before missing the target.' },
        { q: 'Why is a 100% SLO a bad idea?', a: 'Because it leaves no margin: any deployment, any maintenance and any network failure breaks it. The error budget is precisely what lets you change the system, and without it you are forced not to touch anything.' },
        { q: 'What is alerting by budget burn rate?', a: 'It is alerting when the rate at which you are spending the error budget, measured over a window, would exhaust it before the period ends. That way a brief spike triggers nothing and a sustained degradation does, which is exactly what you want.' },
        { q: 'What is the error budget for in a product decision?', a: 'To decide with data whether it is time to deploy new features or fix reliability. If plenty of budget is left, risks can be taken; if it is almost exhausted, the priority becomes stabilising, and that conversation stops being a clash of opinions.' }
      ],
      out: 'SLI and SLO defined for two operations, error budget calculated and two burn-rate alerts written.',
      file: 'docs/observability.md'
    },
    {
      t: 'Dashboards and the on-call runbook',
      obj: 'Build a dashboard that answers questions in order and write the procedures for VetCare’s two most likely incidents.',
      why: 'At three in the morning nobody reasons well. An ordered dashboard and a written runbook are the difference between resolving in ten minutes and taking two hours. And having written on-call runbooks is a sign of seniority very few people can show.',
      study: { r: 0, what: 'Reread the final part of the SRE book’s monitoring chapter, where it talks about simplicity and not piling up signals. About 10 minutes. The lesson: a dashboard with forty charts informs about nothing. A good dashboard answers few questions in a thought-out order.',
        pasos: [
          'Read "As Simple as Possible, No Simpler" (~3 min).',
          'Read "Tying These Principles Together" (~3 min): the questions every alert must pass.',
          'Read "Bigtable SRE: A Tale of Over-Alerting" (~3 min).',
          'Order your dashboard’s questions: is the user affected? Where? Since when? Why?'
        ] },
      ex: {
        title: 'A three-level dashboard and an on-call runbook',
        body: `# VetCare dashboard

## Level 1 - Is it OK? (4 charts, seen at a glance)
  - Requests per second, stacked by status code
  - 5xx error ratio, with the SLO line marked
  - Latency p50 / p95 / p99, with the target line
  - Error budget consumed this month, as a percentage

## Level 2 - Where does it hurt? (opened if level 1 is red)
  - p95 latency broken down by endpoint
  - Errors by endpoint and by code
  - Appointments created per hour (business)
  - Access denied per hour (security)

## Level 3 - Why? (saturation and dependencies)
  - Pool connections in use versus the maximum
  - PostgreSQL latency and slow queries
  - State of the notifications circuit breaker (week 14)
  - Process CPU and memory

Rule: if a chart has never helped make a decision,
it is deleted. A dashboard is a tool, not decoration.

================================================================

# On-call runbook: high error ratio on /api/v1/appointments

## Symptom
Fast alert: 5xx errors above 7% for 5 minutes.

## Impact
Reception cannot see or create appointments. Direct impact
on the day's care. High priority.

## Diagnosis, in this order
1. Dashboard level 1: is it only /api/v1/appointments or everything?
   -> everything = general problem; only one = that endpoint's code
2. Dashboard level 3: connection pool saturated?
   -> yes = slow queries or a connection leak
3. Traces: open a request with an error. Which span does it fail in?
4. Logs: filter by Error level over the last 15 min.
   Group by message template. Usually one dominates.
5. Does it coincide with a deployment? Look at the image tag.

## Mitigations, from fastest to slowest
  a) If it coincides with a deployment -> rollback (week 20).
     It is the fastest action and almost always the right one.
  b) If it is pool saturation -> raise the pool size and
     restart. It is a patch, not the fix.
  c) If it is an external dependency -> check the circuit
     breaker opened. If it did not, review its configuration.

## Verification
Error ratio below 1% for 10 minutes and an appointment
created end to end by hand.

## Afterwards
Write the postmortem. Without looking for culprits: look for the cause
and the detection. Two mandatory questions: why did it happen, and
why did it take us so long to find out.`
      },
      steps: [
        'Build the level 1 dashboard with its four charts. You can use the Aspire dashboard, Grafana or whatever you have: what matters is the order and that there are four, not forty.',
        'Add levels 2 and 3. You will realise you are missing metrics: note them and instrument again. Building the dashboard is what reveals you were not measuring.',
        'Write the on-call runbook for the high error ratio following the example’s structure: symptom, impact, ordered diagnosis, mitigations from fastest to slowest, verification and what to do afterwards.',
        'Write a second runbook for another likely VetCare incident, for example high latency or database unavailable. Two well-written runbooks cover most of what will really happen to you.',
        'Test a runbook by causing the problem: stop the PostgreSQL container with docker compose stop db and follow your own procedure step by step. Fix whatever does not work. An untested runbook is fiction.'
      ],
      vet: [
        'Leave the level 1 dashboard open while you use VetCare for a while. Seeing your own actions reflected in the charts is what teaches you to read them quickly when you need to.',
        'Keep the two runbooks in docs/oncall/ named by symptom, not by cause. In an incident you search by what you see, not by what you do not know yet.'
      ],
      edge: [
        'A dashboard with too many charts is a dashboard nobody looks at. If you do not know what decision you would make with a chart, it should not be there.',
        'An on-call runbook nobody has run is useless. Test it by causing the failure locally, because a step is always missing or a command is wrong.',
        'A blameless postmortem is not kindness, it is effectiveness: if people fear the consequences, they hide information and you lose the real cause. What you look for is the system’s failure, not the person.'
      ],
      quiz: [
        { q: 'Why organise a dashboard in levels?', a: 'Because the questions have a natural order: first whether there is a problem, then where it hurts, and only then why. A flat dashboard with everything mixed forces you to search through noise exactly when you have least time and least calm.' },
        { q: 'What must an on-call runbook contain at a minimum?', a: 'The symptom that triggers it, the impact on the user, the diagnosis steps in order, the mitigations ordered from fastest to slowest, how to verify it was resolved and what to do afterwards. All written for someone who has just woken up.' },
        { q: 'Why is the first mitigation usually the rollback?', a: 'Because the most frequent cause of a new incident is the last change deployed, and going back is the fastest and most predictable action. Calm diagnosis is done after restoring the service, not before.' },
        { q: 'Why should a postmortem not look for culprits?', a: 'Because if people fear the consequences they hide details and you never reach the real cause, which is almost always a system failure and not a person’s. The two useful questions are why it happened and why it took us so long to detect it.' }
      ],
      out: 'A three-level dashboard working and two on-call runbooks written, one of them tested by causing the failure.',
      file: 'docs/oncall/high-error-appointments.md'
    },
    {
      t: 'Simulated incident (weekly exam)',
      obj: 'Cause a real incident in VetCare, diagnose it using only your observability tools and write the postmortem.',
      why: 'It is the rehearsal that makes the first real incident not be the first time you use your tools. And a written postmortem is one of the documents that impresses most in an interview because it shows you have operated something, not just built it.',
      study: { r: 0, what: 'Go over your two on-call runbooks and your dashboard. About 8 minutes. Today you learn nothing new: today you check whether what you set up really works when something breaks without warning.',
        pasos: [
          'Reread your two on-call runbooks from start to finish.',
          'Open your dashboard and check that each chart answers a question from the runbook.',
          'Ask someone else to break something without telling you what, or break it yourself and wait ten minutes before looking.',
          'During the diagnosis note the time of each step: you will use it later in the postmortem’s timeline.'
        ] },
      ex: {
        title: 'VetCare postmortem',
        body: `# Postmortem - High latency on the schedule
Date: 2026-xx-xx
Duration: 18 min (14:02 - 14:20)
Impact: 340 requests above the 300 ms target.
        p95 reached 4.2 s. Nobody reported the problem.
Error budget consumed: 12% of the month.

## Timeline
14:02  Deployment of the version with the new search filter.
14:04  Dashboard level 1: p95 rises from 115 ms to 3.8 s. Errors at 0%.
14:05  Slow alert fires. (The fast one does not, because there were no 5xx:
       the system was slow, not broken. Lesson.)
14:08  Dashboard level 3: connection pool at 95%. Saturation.
14:11  Trace of a slow request: 3.6 s of 3.8 s in a single
       span, SELECT on appointment with ILIKE and no index.
14:14  Decision: rollback to the previous image.
14:18  p95 back to 120 ms.
14:20  Verified with an appointment created end to end. Closed.

## Root cause
The new filter generated ILIKE '%text%' on appointment.reason, with no
index to serve it (a normal B-tree does not work for that pattern;
a GIN with pg_trgm does). With 50,000 rows it forced a
sequential scan per request, which kept the connections
busy and saturated the pool.

## Why we did not detect it before deploying
- It was tested locally with 20 rows of data.
- CI has no performance check.
- The new query's plan was not reviewed.

## What went well
- The level 1 dashboard showed the problem in 2 minutes.
- The trace located the exact query in 3 minutes.
- The rollback documented in week 20 worked first time.

## What we fix
| Action                                           | Type       |
|--------------------------------------------------|------------|
| GIN index with pg_trgm for text search           | Cause      |
| Fast alert also on latency, not only 5xx         | Detection  |
| Realistic data volume in the CI environment      | Prevention |
| Review EXPLAIN of every new query in the PR      | Process    |

## What we learned
A slow system does not generate errors, so an alert based
only on 5xx does not see it. Slow is also being down, just
more slowly.`
      },
      steps: [
        'Choose a fault and cause it without looking at the dashboard yet. Good options: stop the PostgreSQL container, reduce the pool to two connections, add an artificial delay in an endpoint, or drop an index you created in week 21.',
        'Diagnose using only your tools, without looking at the code you just changed. Time how long it takes from the start until you know the cause. That number is the real measure of your observability.',
        'Follow your on-call runbook to the letter and note every step that is missing, wrong or useless. Fix the runbook immediately afterwards.',
        'Write the complete postmortem with the example’s seven sections. The section on why we did not detect it earlier is the most valuable and the one almost nobody writes.',
        'Check the week’s list: structured logs with end-to-end correlation, four golden signals instrumented, two business metrics, traces with your own spans, SLI and SLO defined with the budget calculated, two burn-rate alerts, a three-level dashboard, two on-call runbooks and a written postmortem.',
        'Explain your incident out loud in three minutes: what happened, how you found out, how you diagnosed it, what you did to mitigate it and what you changed so it does not happen again. That is the answer to "tell me about an incident you resolved".'
      ],
      vet: [
        'Add an observability section to VetCare’s README with a link to the postmortem. It is one of the documents that best communicates that your project was operated and not just written.',
        'Turn the actions in the postmortem’s table into real tasks and do them. A postmortem whose actions are never carried out is a writing exercise.',
        'Press "Mark for review" and reread docs/observability.md in a week.'
      ],
      edge: [
        'If it takes you more than ten minutes to find the cause with your tools, the problem is not your skill: instrumentation is missing. Note what you would have needed and add it.',
        'A postmortem without specific actions with an owner and a date is venting. The part that prevents repetition is the actions table, not the narrative.',
        'Always separate cause actions from detection actions. Fixing the cause prevents this specific failure; improving detection helps you with all the ones you do not know yet, which are most of them.'
      ],
      quiz: [
        { q: 'Why must a postmortem include why it was not detected earlier?', a: 'Because detection time is usually most of the impact: a failure detected in two minutes and another detected in two hours can have the same cause and completely different consequences. Improving detection also protects you from future failures you do not know yet.' },
        { q: 'What is the difference between a cause action and a detection action?', a: 'A cause action prevents that specific failure from happening again, like adding the missing index. A detection action makes you find out sooner if something similar happens, like adding a latency alert. The second has more reach because it covers failures you have not imagined yet.' },
        { q: 'Why can an alert based only on 5xx errors miss a serious incident?', a: 'Because a saturated system responds correctly but very slowly, so it produces no error codes. For the user it is equivalent to being down, so you need to alert on latency too and not only on failures.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That observability is not installing tools but being able to answer questions about what already happened: structured logs with correlation give you the detail, the four signals tell you how many people are suffering, traces tell you where the time went, and SLOs turn all that into decisions instead of pretty charts.' }
      ],
      out: 'An incident caused and diagnosed with your own tools, the runbook corrected and a complete postmortem with cause and detection actions.',
      file: 'docs/postmortem-01.md'
    }
  ]
}
]);
