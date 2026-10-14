window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 14,
  phase: 'Quality and testing',
  title: 'Resilience: stop someone else’s failure from taking you down',
  idea: 'Your VetCare API is going to depend on things you do not control: the database, the email service, a payment gateway, the network. Those things fail. The question is not whether they fail but what your system does when they do. A fragile system hangs waiting forever, retries in a loop and multiplies the damage. A resilient system cuts off quickly, retries sensibly, gives up in time and keeps providing the service it still can. This week you learn the four tools that are really used: timeouts, retries with backoff, circuit breakers and graceful degradation.',
  res: [
    { t: 'AWS Builders Library — Timeouts, retries and backoff with jitter',
      u: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
      note: 'The best free text on why naive retries make an outage worse. Language-agnostic, it reads in 20 minutes and changes how you think.' },
    { t: 'Microsoft Learn — Implement resilient applications',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/',
      note: 'The official .NET guide. You mainly care about how resilience is configured on HttpClient without writing the logic by hand.' },
    { t: 'Polly — official documentation',
      u: 'https://www.pollydocs.org/',
      note: 'The standard resilience library in .NET. Look at the Retry, Timeout and Circuit Breaker pages: each one has a minimal example you can copy.' },
    { t: 'Azure Architecture Center — Circuit Breaker pattern',
      u: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker',
      note: 'Explains the circuit’s three states with a diagram. It is the best page for understanding the pattern before using the library.' },
    { t: 'microservices.io — Transactional outbox', u: 'https://microservices.io/patterns/data/transactional-outbox.html', note: 'How to save to your database and notify another system without losing messages.' },
    { t: 'Microsoft Learn — Strategies to handle partial failure', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/partial-failure-strategies', note: 'Strategies so a partial failure does not take everything down: retries, circuit breakers, fallbacks and limits.' },
    { t: 'Polly — Resilience strategies', u: 'https://www.pollydocs.org/strategies/', note: 'An index of Polly’s strategies with their options and default values.' }
  ],
  days: [
    {
      t: 'Timeouts: never wait forever',
      obj: 'Understand why every external call needs a time limit and learn to propagate it with CancellationToken in .NET.',
      why: 'It is the number one failure in real systems and the first question in any resilience interview. A call with no timeout does not fail: it hangs, takes a thread and a connection, and when a hundred more requests arrive your whole API stops answering even though only one service is slow.',
      study: { r: 0, what: 'Read only the Timeouts section (the start of the article, before Retries). About 10 minutes. Look for one thing: why a timeout that is too long is almost as bad as having none.',
        pasos: [
          'Read "Introduction" and "Failures Happen" (~4 min): why failures are normal in a distributed system.',
          'Read "Timeouts" (~6 min): how AWS chooses the timeout value from latency percentiles.',
          'Stop here: retries are tomorrow.',
          'Write, for each external call in VetCare (database, email, SMS), the timeout you would set and why.'
        ] },
      ex: {
        title: 'The same call, with no limit and with a limit',
        body: `// BAD: if the email service takes 5 minutes, this request takes 5 minutes
public async Task NotifyAsync(string email, string text)
{
    var response = await _http.PostAsJsonAsync("/send", new { email, text });
    response.EnsureSuccessStatusCode();
}

// GOOD: two layers of limits
// 1) the HttpClient has a global cap
services.AddHttpClient<EmailClient>(c =>
{
    c.BaseAddress = new Uri("https://email.example.com");
    c.Timeout = TimeSpan.FromSeconds(5);
});

// 2) the specific operation can have an even shorter limit
public async Task NotifyAsync(string email, string text, CancellationToken ct)
{
    using var cut = CancellationTokenSource.CreateLinkedTokenSource(ct);
    cut.CancelAfter(TimeSpan.FromSeconds(2));

    try
    {
        var response = await _http.PostAsJsonAsync("/send", new { email, text }, cut.Token);
        response.EnsureSuccessStatusCode();
    }
    catch (OperationCanceledException) when (!ct.IsCancellationRequested)
    {
        // what ran out was OUR 2s limit, not the client leaving
        throw new TimeoutException("The email service did not answer within 2 seconds.");
    }
}

// And in the endpoint: accept the token ASP.NET Core gives you for free.
// If the browser closes the tab, ct is cancelled and you stop working for nobody.
app.MapPost("/api/v1/appointments", async (CreateAppointmentRequest req, AppointmentService svc, CancellationToken ct) =>
{
    var appointment = await svc.CreateAsync(req, ct);
    return Results.Created($"/api/v1/appointments/{appointment.Id}", appointment);
});`
      },
      steps: [
        'Open src/VetCare.Api/Program.cs and find every async method that calls the database or an external service. Count how many do NOT receive a CancellationToken.',
        'Add CancellationToken ct as the last parameter of your endpoints. ASP.NET Core injects it on its own: you do not have to register anything.',
        'Pass that ct down: to the service, to the repository, and finally to EF Core (ToListAsync(ct), SaveChangesAsync(ct)). If you cut it halfway, it is useless.',
        'Configure Npgsql’s command timeout in your connection string or in the DbContext: options.UseNpgsql(cs, o => o.CommandTimeout(10)). Ten seconds for a read query is already a lot.',
        'Check that it works: create a test endpoint that does await db.Database.ExecuteSqlRawAsync("SELECT pg_sleep(30)", ct); call it and measure that your API cuts off at 10 seconds instead of waiting 30.'
      ],
      vet: [
        'In VetCare the POST /appointments endpoint writes to the database and then sends a confirmation email. The email must NOT be able to delay the response: give it 2 seconds at most.',
        'Write a three-column table in docs/resilience.md: operation, chosen timeout, why that number. A timeout with no justification is a magic number.'
      ],
      edge: [
        'A timeout must be shorter than the caller’s. If the browser waits 30s, your API cannot wait 30s for the database: then the user sees a browser error and you never know what happened.',
        'OperationCanceledException is also thrown when the client disconnects. Tell the two cases apart by checking whether ct.IsCancellationRequested is true, as in the example, or you will log false errors.',
        'HttpClient.Timeout applies to the whole operation, including reading the body. If you download a legitimately large file, that global timeout will cut it: use a different HttpClient for those cases.'
      ],
      quiz: [
        { q: 'Why is a 60-second timeout dangerous even though it technically exists?', a: 'Because during those 60 seconds that request’s thread, connection and memory stay busy. With enough slow requests you exhaust the pool before the first timeout expires, and your API stops accepting healthy traffic. A useful limit is one that cuts off before resources pile up, not one that ends "some day".' },
        { q: 'What is the difference between the HttpClient timeout and a CancellationTokenSource with CancelAfter?', a: 'The HttpClient one is a global cap for all of that client’s calls and is the safety net. The CancellationTokenSource lets you set a shorter, specific limit for one operation, and it is also combined with the client’s token, so it respects both your limit and the user disconnecting.' },
        { q: 'What happens if you receive a CancellationToken in the endpoint but do not pass it to SaveChangesAsync?', a: 'The cancellation does not reach where the real waiting happens. The framework marks the request as cancelled but the query keeps running in the database and keeps holding a connection. Propagating the token down to the last I/O call is what makes the cancellation real.' },
        { q: 'Why should VetCare’s email timeout be shorter than the database’s?', a: 'Because writing the appointment is the critical operation and the email is secondary. If the email is slow, the user should still get their appointment created. Timeouts reflect importance: what is essential can wait a little longer, what is incidental is cut off quickly.' }
      ],
      out: 'Your endpoints and repositories propagate CancellationToken end to end, and you have a table of justified timeouts.',
      file: 'docs/resilience.md'
    },
    {
      t: 'Retries with backoff and jitter',
      obj: 'Know which errors deserve a retry, which do not, and why retrying immediately is the fastest way to bring down a system that was already struggling.',
      why: 'Almost everyone knows how to write a retry loop; very few know when NOT to retry. Telling a transient error from a permanent one, and being able to explain what jitter is, puts you above average in any backend interview.',
      study: { r: 0, what: 'Now read the Retries and Jitter sections of the same AWS article. About 15 minutes. Look for one thing: what a "retry storm" is and how jitter prevents it.',
        pasos: [
          'Read "Retries and backoff" (~7 min): why retrying instantly makes an already saturated service worse.',
          'Notice the part that explains how retries multiply when several layers retry.',
          'Read "Jitter" (~5 min): adding randomness so clients do not all retry at once.',
          'Read "Conclusion" (~1 min).',
          'Make a table of VetCare’s errors: which ones are retried (timeouts, 503) and which never are (400, 409).'
        ] },
      ex: {
        title: 'Naive retry vs sensible retry',
        body: `// BAD: retries everything, instantly, always
for (int i = 0; i < 5; i++)
{
    try { return await CallAsync(); }
    catch { /* again */ }
}

// Three failures at once:
// 1. it retries a 400 Bad Request, which will never work
// 2. it retries without waiting, so it hits 5 times in 10 ms
// 3. if 1000 clients do this at once, the failed service gets 5000 requests

// GOOD: only transient errors, growing wait, with random noise
static bool IsTransient(HttpResponseMessage r) =>
    r.StatusCode == HttpStatusCode.RequestTimeout        // 408
    || r.StatusCode == HttpStatusCode.TooManyRequests     // 429
    || (int)r.StatusCode >= 500;                          // 500, 502, 503, 504

static readonly Random _rnd = Random.Shared;

public async Task<HttpResponseMessage> WithRetriesAsync(
    Func<Task<HttpResponseMessage>> operation, int maxAttempts = 3)
{
    for (int attempt = 1; ; attempt++)
    {
        var r = await operation();
        if (!IsTransient(r) || attempt == maxAttempts) return r;
        r.Dispose();   // this response is thrown away: release it

        // exponential backoff: 200ms, 400ms, 800ms...
        var baseMs = 200 * Math.Pow(2, attempt - 1);
        // full jitter: a random point between 0 and that cap
        var waitMs = _rnd.NextDouble() * baseMs;

        await Task.Delay(TimeSpan.FromMilliseconds(waitMs));
    }
}

// EVEN BETTER: do not write it yourself. In .NET 8+:
// dotnet add package Microsoft.Extensions.Http.Resilience
services.AddHttpClient<EmailClient>()
        .AddStandardResilienceHandler();
// That already brings a timeout, retries with jitter and a circuit breaker
// configured with sensible values. Writing it by hand is a learning
// exercise, not a production one.

// FOR THE TESTS: a fake handler that returns the codes you tell it
class FakeHandler : HttpMessageHandler
{
    private readonly Queue<HttpStatusCode> _codes;
    public int Calls { get; private set; }
    public FakeHandler(params HttpStatusCode[] codes) => _codes = new(codes);

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        Calls++;
        return Task.FromResult(new HttpResponseMessage(_codes.Dequeue()));
    }
}
// var h = new FakeHandler(HttpStatusCode.ServiceUnavailable,
//                         HttpStatusCode.ServiceUnavailable, HttpStatusCode.OK);
// var http = new HttpClient(h) { BaseAddress = new Uri("http://test") };
// var r = await WithRetriesAsync(() => http.GetAsync("/x"));
// r.StatusCode.Should().Be(HttpStatusCode.OK); h.Calls.Should().Be(3);`
      },
      steps: [
        'Make a two-column list in docs/resilience.md: "retry" and "do not retry". Place 400, 401, 403, 404, 409, 422, 408, 429, 500, 502, 503, 504 there and justify each one in half a line.',
        'Implement the WithRetriesAsync method from the example by hand in src/VetCare.Infrastructure/Resilience/. Do it once to understand it from the inside.',
        'Write an xUnit test that uses the FakeHandler from the example: it returns 503 twice and 200 the third time, and you check that the method ends up returning 200 and that there were exactly 3 attempts.',
        'Write a second test: the handler always returns 400. Check that there was ONE attempt. This is the test that proves you understood the lesson.',
        'Now repeat both tests with the library: services.AddHttpClient("test").ConfigurePrimaryHttpMessageHandler(() => h).AddStandardResilienceHandler(), and get the client with IHttpClientFactory. Check that it also makes 3 calls with 503, 503, 200 and a single one with 400. It will take a few seconds: the library waits longer between attempts. That way you see it does the same, but better.'
      ],
      vet: [
        'Apply retries ONLY to VetCare’s email client and payment gateway client. Do not put generic retries on the database yet: Npgsql’s EnableRetryOnFailure handles that, and it knows which PostgreSQL errors are really transient.',
        'Add a note to docs/resilience.md: how many attempts at most and why. Three is usually the sensible ceiling; more than that and you are prolonging the user’s pain.'
      ],
      edge: [
        'Never retry a non-idempotent operation without an idempotency key. If POST /payments times out but the payment WAS processed, the retry charges twice. We solve this tomorrow.',
        'Jitter is not optional. Without it, a thousand clients that failed in the same millisecond retry in the same millisecond, and the service that was starting to recover goes down again. Random noise spreads the load.',
        'Nested retries multiply. If your HTTP layer retries 3 times and the service layer also retries 3 times, that is 9 calls and 9 times the time. Decide on a single layer responsible for retrying.'
      ],
      quiz: [
        { q: 'Why should a 404 or a 400 not be retried?', a: 'Because they are permanent errors: the resource does not exist or the request is malformed, and repeating the same request will give exactly the same result. Retrying them only wastes the user’s time and the server’s load with no chance of success.' },
        { q: 'What is jitter and what problem does it solve?', a: 'It is adding randomness to the wait between retries. It solves the retry storm: if many clients fail at the same time and all wait exactly 200 ms, they all hit again at once and cause a second outage. Jitter spreads those retries across the interval.' },
        { q: 'A 429 Too Many Requests is retried. What should you look at before choosing how long to wait?', a: 'The Retry-After header, if the server sends it. It is the service itself telling you when to come back. Ignoring it and using your calculated backoff disobeys an explicit instruction and can get you blocked for longer.' },
        { q: 'Why does the exercise ask you to implement retries by hand and then replace them with the library?', a: 'Because understanding the mechanism from the inside is what lets you configure the library with judgement and answer in an interview. But in production the library wins: it already handles edge cases, cancellation, metrics and combination with other policies that your 20-line implementation does not cover.' }
      ],
      out: 'A retry policy that only targets transient errors, with exponential backoff and jitter, covered by two tests.',
      file: 'src/VetCare.Infrastructure/Resilience/'
    },
    {
      t: 'Circuit breaker: give up in time',
      obj: 'Understand a circuit’s three states and configure a real one with Polly so VetCare stops hammering a service that is clearly down.',
      why: 'It is the pattern that separates someone who has operated systems in production from someone who has only read about them. In a design interview, mentioning the circuit breaker along with its reason (stop spending resources on something you know is failing) earns a lot.',
      study: { r: 3, what: 'Read the whole Circuit Breaker page in the Azure Architecture Center, paying attention to the state diagram. About 12 minutes. Look for one thing: what exactly the Half-Open state does and why you do not go straight from Open to Closed.',
        pasos: [
          'Read "Context and problem" and "Solution" (~5 min), with the state diagram in front of you.',
          'Write what happens in each state: Closed lets things through, Open fails fast, Half-Open tests with a few requests.',
          'Read "Problems and considerations" (~4 min) and note the three that affect VetCare most.',
          'Read "When to use this pattern" (~2 min).',
          'Under "Example" read "Flow C: Half-Open state" (~2 min) and explain why you do not go straight from Open to Closed.'
        ] },
      ex: {
        title: 'The three states and the real configuration',
        body: `// Closed    -> everything goes through. Failures are counted.
// Open      -> nothing goes through. It fails instantly, without even trying.
// Half-Open -> ONE test request goes through. If it works -> Closed. If it fails -> Open again.
//
// The key: in Open you do NOT wait for the timeout. You fail in microseconds.
// That frees threads and connections and gives the failed service room to recover.

// dotnet add package Microsoft.Extensions.Http.Resilience

services.AddHttpClient<EmailClient>(c =>
{
    c.BaseAddress = new Uri("https://email.example.com");
})
.AddResilienceHandler("email", pipeline =>
{
    pipeline
      // 1. TOTAL cap on the operation, retries included
      .AddTimeout(TimeSpan.FromSeconds(5))

      // 2. retries
      .AddRetry(new HttpRetryStrategyOptions
      {
          MaxRetryAttempts = 3,
          BackoffType = DelayBackoffType.Exponential,
          UseJitter = true,
          Delay = TimeSpan.FromMilliseconds(200)
      })

      // 3. circuit breaker
      .AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
      {
          // if more than 50% of calls fail...
          FailureRatio = 0.5,
          // ...with at least 10 requests in the window...
          MinimumThroughput = 10,
          // ...measured over the last 30 seconds...
          SamplingDuration = TimeSpan.FromSeconds(30),
          // ...open the circuit for 15 seconds before trying again.
          BreakDuration = TimeSpan.FromSeconds(15)
      })

      // 4. cap on EACH attempt
      .AddTimeout(TimeSpan.FromSeconds(2));
});

// The order matters. In Polly, what you add first ends up OUTSIDE:
// total timeout -> retry -> circuit breaker -> per-attempt timeout.
// It is the same order AddStandardResilienceHandler uses.
// The breaker goes INSIDE the retry: that way it counts each real
// call to the service (what really measures its health), and when it
// opens it throws BrokenCircuitException, which the retry does not
// retry: it stops insisting immediately.

// I checked it with a fake service that always answers 503:
//   request 1: 503 after ~1.1 s  (4 real calls: 1 + 3 retries)
//   request 2: 503 after ~0.6 s  (4 real calls)
//   request 3: BrokenCircuitException (it opens at 10 calls)
//   request 4 onwards: BrokenCircuitException in 0 ms, 0 calls

// When the circuit is open, or time runs out, the call throws a
// Polly exception. Catch it and degrade (we look at that tomorrow):
try
{
    await _emailClient.NotifyAsync(email, text, ct);
}
catch (Exception ex) when (ex is BrokenCircuitException
                              or TimeoutRejectedException
                              or HttpRequestException)
{
    _log.LogWarning("Email unavailable. Appointment created anyway, notification queued.");
    await _queue.EnqueueAsync(new PendingNotification(email, text), ct);
}`
      },
      steps: [
        'Install Microsoft.Extensions.Http.Resilience in the VetCare.Infrastructure project and configure EmailClient exactly as in the example.',
        'Draw the state diagram in docs/resilience.md using Mermaid: stateDiagram-v2 with Closed, Open and HalfOpen and the arrows labelled with each transition’s condition.',
        'Start a fake server that always returns 503 (it can be your own endpoint at /fake/always-fails) and point EmailClient at it.',
        'Fire 20 requests in a row and time each one. You will see the first ones take about a second (the retries wait) and that, after a few, they start failing in milliseconds: that is the circuit opening.',
        'Wait the 15 seconds of BreakDuration, fire one more request and look for the Half-Open attempt in the logs. Then switch the fake server to 200 and check that the circuit closes again.'
      ],
      vet: [
        'In VetCare the email client’s circuit must be separate from the payment gateway’s circuit. If email goes down, payments must keep working: one circuit per dependency, never a global one.',
        'Add a row to your table in docs/resilience.md: for each external dependency, which policy it has (timeout, retry, breaker) and what happens when the circuit opens.'
      ],
      edge: [
        'MinimumThroughput exists to avoid false positives. Without it, two failures out of two requests is a 100% error rate and you would open the circuit with almost no evidence.',
        'A circuit shared by all of a service’s endpoints can be too coarse: if only /send is broken but /status works, you open too much. If the service distinguishes critical routes, consider a breaker per route.',
        'The circuit breaker does not replace retries, nor the other way round. Retries solve one-off failures of a request; the breaker solves sustained failures of a service. They are used together: the retry outside and the breaker inside.'
      ],
      quiz: [
        { q: 'Why does the Half-Open state exist instead of going from Open to Closed when the timer expires?', a: 'Because reopening the traffic all at once after an outage sends all the accumulated load at a service that may only just be getting back up, and knocks it down again. Half-Open lets a single test request through: if it succeeds the circuit closes, and if it fails it opens again having done no harm.' },
        { q: 'What does the system gain while the circuit is open, if the request fails anyway?', a: 'Time and resources. With the circuit open the failure is immediate instead of costing the 2-second timeout, so threads and connections do not pile up waiting, and the failed service stops receiving traffic and has room to recover.' },
        { q: 'Why, in Polly, does the circuit breaker go inside the retry?', a: 'Because that way the breaker sees each real call to the service, which is what measures its health. And when it opens it throws BrokenCircuitException, which the retry does not retry, so it stops insisting at once. It is the order of .NET’s standard handler: total timeout, retry, circuit breaker and per-attempt timeout.' },
        { q: 'In VetCare, what should happen to an appointment when the email circuit is open?', a: 'The appointment must be created anyway. The email is a desirable consequence but not the critical operation, so you catch BrokenCircuitException, log the warning and queue the notification to send later. Rejecting the appointment because email is down would turn a secondary failure into a total one.' }
      ],
      out: 'EmailClient with timeout + retry + circuit breaker configured and a state diagram you really understand.',
      file: 'src/VetCare.Infrastructure/Resilience/'
    },
    {
      t: 'Operational idempotency and the outbox',
      obj: 'Guarantee that retrying a write operation does not duplicate it, and that an external effect is not lost when the transaction commits but sending fails.',
      why: 'It is the real problem hiding behind "just retry". Understanding the write-to-the-database versus publish-outside duality, and being able to name the Outbox pattern, is straight senior interview material.',
      study: { r: 4, what: 'Read the whole pattern. About 12 minutes. Notice the problem it solves: saving to the database and notifying another system is not atomic without a trick. Look for one thing: why you cannot put an HTTP call inside a database transaction.',
        pasos: [
          'Read "Context" and "Problem" (~3 min): saving to the database and sending a message is not atomic.',
          'Read "Forces" (~2 min).',
          'Read "Solution" with its diagram (~4 min): the outbox table is written in the same transaction and another process sends it later.',
          'Read "Resulting context" (~2 min): the message may be sent more than once, which is why the receiver must be idempotent.',
          'Draw VetCare’s flow: create the appointment, save to the outbox, a process that sends the SMS.'
        ] },
      ex: {
        title: 'The two-systems problem and how it is solved',
        body: `// THE PROBLEM
using var tx = await db.Database.BeginTransactionAsync(ct);
db.Appointments.Add(appointment);
await db.SaveChangesAsync(ct);
await _email.NotifyAsync(appointment.Email, ct);   // <-- outside the database
await tx.CommitAsync(ct);

// Two ways to break:
// a) the email fails -> you roll back, but maybe the email WAS already sent
// b) the email works and the commit fails -> you announced an appointment that does not exist
// A database transaction cannot span an external system. Full stop.

// SOLUTION 1: an idempotency key so the CLIENT's retry does not duplicate
// (you saw it in week 11, now it is mandatory)
app.MapPost("/api/v1/appointments", async (
    CreateAppointmentRequest req,
    [FromHeader(Name = "Idempotency-Key")] string? key,
    VetCareDbContext db, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(key))
        return Results.Problem(title: "Missing Idempotency-Key", statusCode: 400);

    var previous = await db.IdempotentOperations
                           .AsNoTracking()
                           .FirstOrDefaultAsync(o => o.Key == key, ct);
    if (previous is not null)
        return Results.Ok(JsonSerializer.Deserialize<AppointmentResponse>(previous.Response));

    // ... create the appointment ...
    db.IdempotentOperations.Add(new IdempotentOperation(key, responseJson));
    await db.SaveChangesAsync(ct);
    // If two requests arrive at the same time with the same key, the
    // PRIMARY KEY on "key" rejects the second one (error 23505): catch
    // it and return the stored response.
    return Results.Created($"/api/v1/appointments/{appointment.Id}", response);
});

// SOLUTION 2: an Outbox so the external effect is not lost
// The same transaction writes the appointment AND the intention to notify.
db.Appointments.Add(appointment);
db.Outbox.Add(new OutboxMessage(
    type: "AppointmentCreated",
    payload: JsonSerializer.Serialize(new { appointment.Id, appointment.Email }),
    createdAt: _clock.Now()));
await db.SaveChangesAsync(ct);   // a single transaction, all or nothing

// A separate process reads the outbox and sends:
var pending = await db.Outbox
    .Where(m => m.ProcessedAt == null)
    .OrderBy(m => m.CreatedAt)
    .Take(50)
    .ToListAsync(ct);

foreach (var m in pending)
{
    await _email.NotifyAsync(m.Payload, ct);  // with retry and breaker
    m.ProcessedAt = _clock.Now();
    await db.SaveChangesAsync(ct);
}
// "At least once" delivery: it may send twice if the process dies right
// after sending. That is why the consumer must also be idempotent.`
      },
      steps: [
        'Create the idempotent_operation table in a new migration: key text primary key, response jsonb not null, created_at timestamptz not null default now().',
        'Create the outbox_message table: id uuid primary key, type text not null, payload jsonb not null, created_at timestamptz not null, processed_at timestamptz null, attempts int not null default 0.',
        'Change POST /appointments to require the Idempotency-Key header and return the stored response if the key already exists, without creating anything again.',
        'Move the email sending out of the creation flow: instead, insert an OutboxMessage inside the same SaveChangesAsync.',
        'Write a BackgroundService called OutboxProcessor that every 5 seconds reads up to 50 pending messages, sends them using yesterday’s resilient EmailClient, and sets processed_at.'
      ],
      vet: [
        'Add a partial index to outbox_message: CREATE INDEX ix_outbox_pending ON outbox_message (created_at) WHERE processed_at IS NULL. It is exactly the case you studied in week 10.',
        'Write in docs/resilience.md the key sentence you should be able to say in an interview: "you cannot commit atomically across a database and an external system, so you write the intention in the same transaction and deliver it afterwards".'
      ],
      edge: [
        'An outbox with no clean-up grows forever. Add a task that deletes processed messages older than 7 days, or the table will end up the biggest in your database.',
        'The outbox processor must tolerate two instances running. Use SELECT ... FOR UPDATE SKIP LOCKED when taking the messages, or two servers will send the same email.',
        'Storing the full response in the idempotency table is what makes the retry return exactly the same thing. If you only store the key and return 409, the client that lost the response to a network cut will never know its appointment’s id.'
      ],
      quiz: [
        { q: 'Why can you not put an HTTP call inside a database transaction?', a: 'Because the transaction only controls the database: it can undo its own writes, but it cannot undo an email already sent or a charge already made. If the transaction rolls back after the call, the two systems are left permanently in disagreement.' },
        { q: 'What delivery guarantee does the Outbox pattern give and what does it imply for the consumer?', a: 'It gives at-least-once delivery: the message is never lost, but it may be sent twice if the process dies between sending and marking it as processed. That means the consumer or the final effect has to be idempotent so the duplicate does no harm.' },
        { q: 'Why does the idempotency table store the response and not just the key?', a: 'To be able to return exactly the same result to the client as the first time. The typical case is that the operation did run but the response was lost on the network; the client retries and needs the id of the created appointment, not a mere duplicate warning.' },
        { q: 'What does SKIP LOCKED do in the outbox processor and why does it matter?', a: 'It makes an instance reading messages skip the rows another instance has already locked instead of waiting for them. It matters because it lets you scale the processor to several instances in parallel without sending duplicates or blocking each other.' }
      ],
      out: 'A truly idempotent POST /appointments and an outbox with its background processor.',
      file: 'src/VetCare.Infrastructure/Outbox/'
    },
    {
      t: 'Graceful degradation and fallbacks',
      obj: 'Decide, dependency by dependency, what VetCare does when something is unavailable, instead of returning a generic 500.',
      why: 'It is the difference between a system that "goes down" and one that "works worse for a while". Being able to classify dependencies as critical and non-critical, and to defend that classification, is a design skill that shows immediately.',
      study: { r: 5, what: 'Read the list of strategies for partial failures and then the ASP.NET Core health checks guide. About 12 minutes. Look for one thing: what it means for a dependency to be critical and how that changes your /health/ready endpoint.',
        pasos: [
          'Read the whole page (~4 min): each strategy in one paragraph.',
          'Stop at "Provide fallbacks": what the system returns when a dependency fails.',
          'Stop at "Limit the number of queued requests": why letting requests pile up makes the outage worse.',
          'Open the ASP.NET Core health checks documentation and read the section on separating readiness and liveness (~5 min).',
          'Make a table with each VetCare dependency: is it critical? What does the system do if it fails? Does it affect /health/ready?'
        ] },
      ex: {
        title: 'VetCare’s degradation matrix',
        body: `// Classify EVERY dependency. There are only two categories and you must pick one.
//
// CRITICAL: without it the operation makes no sense -> fail fast and clearly
//   PostgreSQL. Without a database there are no appointments. 503 + Retry-After.
//
// NON-CRITICAL: the operation is still valid -> degrade
//   Email service        -> queue in the outbox, still answer 201
//   Payment gateway      -> create the invoice in "pending payment" status
//   SMS service          -> skip it, log the warning
//   Availability cache   -> query the database directly, slower but correct

// In code, degradation is explicit and visible, never an empty catch:
public async Task<IReadOnlyList<SlotDto>> SlotsAsync(Guid vetId, CancellationToken ct)
{
    try
    {
        return await _cache.GetAsync(vetId, ct);
    }
    // careful: Polly's timeout throws TimeoutRejectedException,
    // not TimeoutException
    catch (Exception ex) when (ex is BrokenCircuitException or TimeoutRejectedException)
    {
        _log.LogWarning(ex, "Cache unavailable for vet {VetId}. Reading from the database.", vetId);
        _metrics.Increment("cache.degraded");
        return await _repo.SlotsAsync(vetId, ct);   // correct fallback
    }
}

// And the user finds out honestly:
// AppointmentResponse with a new field: Notices
return Results.Created($"/api/v1/appointments/{appointment.Id}", new AppointmentResponse(
    appointment.Id, appointment.Start, appointment.End, "scheduled",
    Notices: emailQueued
        ? new[] { "The confirmation email will be sent in a few minutes." }
        : Array.Empty<string>()));

// Health checks that reflect the matrix
// (AddUrlGroup comes from the AspNetCore.HealthChecks.Uris package):
builder.Services.AddHealthChecks()
    .AddNpgSql(cs, name: "postgres", tags: new[] { "ready" })       // critical
    .AddUrlGroup(new Uri(emailUrl), name: "email",
                 failureStatus: HealthStatus.Degraded);             // NOT in "ready"

app.MapHealthChecks("/health/live",  new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new() { Predicate = h => h.Tags.Contains("ready") });
// Key point: if email is down, /health/ready stays at 200.
// If it were in "ready", the orchestrator would take an API that DOES work out of rotation.`
      },
      steps: [
        'Write the full matrix in docs/resilience.md: one row per external VetCare dependency, with columns dependency, critical yes/no, behaviour on failure and what the user sees.',
        'Implement the fallback from the example for at least one non-critical dependency. The catch must log at Warning level and record a metric, never swallow it silently.',
        'Review your /health/ready endpoint from week 12 and remove from it any dependency you classified as non-critical.',
        'Add a Notices field to your AppointmentResponse so the response can honestly say that something will happen later. Degrading without telling the user is lying.',
        'Turn off the fake email service and walk the whole flow in the browser or with curl: the appointment must be created, the response must carry the notice, /health/ready must stay at 200 and the log must have the Warning.'
      ],
      vet: [
        'VetCare’s only critical dependency is PostgreSQL. If you classify a second one as critical, write next to it why: every critical dependency you add multiplies your chance of a total outage.',
        'Check that your error response when PostgreSQL really is down uses the RFC 9457 format you learned in week 11, with status 503 and a Retry-After header.'
      ],
      edge: [
        'A catch that returns empty data is not degradation, it is silent corruption. If the cache fails and you return an empty list of slots, the user thinks there are no openings. Prefer reading from the database or failing.',
        'If the fallback is slower than the normal path, it can take you down: when the cache drops, all the load goes to the database at once. Protect the fallback with its own concurrency limit.',
        'Degrading without recording a metric leaves you blind. You can spend weeks serving the degraded version without anyone noticing the cache has been down since Tuesday.'
      ],
      quiz: [
        { q: 'Which criterion do you use to decide whether a dependency is critical?', a: 'Whether without it the operation the user asks for loses its meaning or would be incorrect. Without a database an appointment cannot be created, so it is critical. Without email the appointment still exists and is valid, so it is non-critical and should degrade rather than fail.' },
        { q: 'Why should a non-critical dependency not appear in /health/ready?', a: 'Because /health/ready decides whether the orchestrator sends traffic to that instance. If you include email and email goes down, all your instances are marked not ready and taken out of rotation, leaving the service completely down because of a secondary function while everything else works perfectly.' },
        { q: 'Why is returning an empty list when the cache fails worse than throwing an error?', a: 'Because an empty list is a valid, believable answer: the user concludes there are no slots available and leaves. An error is honest and can be retried. Degradation must never produce data that looks correct and is not.' },
        { q: 'What must always appear in a fallback path, apart from the fallback itself?', a: 'A Warning-level log and a metric. Without that signal the system can run degraded for days without anyone noticing, which is exactly the opposite of what you want: degrading is buying time to fix things, not hiding the problem.' }
      ],
      out: 'A written degradation matrix, at least one fallback implemented with a log and a metric, and health checks consistent with the matrix.',
      file: 'docs/resilience.md'
    },
    {
      t: 'Controlled chaos and defence (weekly exam)',
      obj: 'Break VetCare on purpose, check that it behaves as you said it would, and be able to defend every resilience decision.',
      why: 'A resilience plan that has never been tested is a hypothesis. The sentence "I tested it by turning off the database and this is what happened" in an interview is worth more than any memorised list of patterns.',
      study: { r: 6, what: 'Go over Polly’s Retry, Timeout and Circuit Breaker strategies, looking at each one’s Defaults table. About 10 minutes. Look for one thing: which default value each strategy comes with, so you know what you are changing when you configure.',
        pasos: [
          'Read "Built-in strategies" (~2 min): which are reactive and which are proactive.',
          'Open the Retry strategy and read its table of default values (~3 min): attempts, delay and backoff type.',
          'Open Timeout and Circuit Breaker and do the same (~4 min).',
          'Compare those values with the ones you configured in VetCare and note each difference and its reason.'
        ] },
      ex: {
        title: 'Chaos script: four experiments',
        body: `EXPERIMENT 1 — Database down (critical dependency)
  Action:     docker stop vetcare-db
  Hypothesis: POST /appointments returns 503 with problem details and Retry-After.
              /health/ready returns 503. /health/live stays at 200.
              The API does NOT hang: it answers in under 11 seconds.
  Result:     ______________________________________________
  Fix:        ______________________________________________

EXPERIMENT 2 — Slow email service (non-critical, timeout)
  Action:     point EmailClient at an endpoint that does Task.Delay(30s)
  Hypothesis: POST /appointments answers 201 in under 3 seconds.
              The email is queued in the outbox. The response carries the notice.
  Result:     ______________________________________________
  Fix:        ______________________________________________

EXPERIMENT 3 — Email service down for a sustained period (breaker)
  Action:     an endpoint that always returns 503. Fire 30 requests.
  Hypothesis: the first ones take ~1 s (retries). After a few requests
              they fail in <10 ms with BrokenCircuitException.
              After 15 seconds there is exactly one Half-Open attempt in the logs.
  Result:     ______________________________________________
  Fix:        ______________________________________________

EXPERIMENT 4 — Client retry (idempotency)
  Action:     curl -X POST /appointments -H "Idempotency-Key: abc-123" ... (twice)
  Hypothesis: the first returns 201. The second returns the SAME id.
              SELECT count(*) FROM appointment WHERE ... returns 1, not 2.
  Result:     ______________________________________________
  Fix:        ______________________________________________

DEFENCE CHECKLIST
  [ ] Every external call has a timeout and that timeout is justified
  [ ] CancellationToken is propagated from the endpoint to the last I/O call
  [ ] Retries only target 408, 429 and 5xx, with exponential backoff and jitter
  [ ] There is one circuit breaker per dependency, not a global one
  [ ] No non-idempotent operation is retried without an Idempotency-Key
  [ ] External effects go through the outbox, not inside the transaction
  [ ] There is a written matrix of critical and non-critical dependencies
  [ ] /health/ready only contains critical dependencies
  [ ] Every fallback logs a Warning and records a metric
  [ ] The four experiments have been run and written up`
      },
      steps: [
        'Run the four experiments one by one. Write the real result in docs/resilience.md, even if it contradicts your hypothesis: that is where the learning is.',
        'For each hypothesis that failed, fix the code and run the experiment again until the result matches.',
        'Go through the defence checklist and tick only what you can point to in the code. What you cannot point to is not done.',
        'Add to your week 13 suite an integration test that checks experiment 4: two POSTs with the same Idempotency-Key produce a single row in appointment.',
        'Record yourself or explain out loud, in 3 minutes, VetCare’s resilience, in this order: what can fail, what the system does in each case and how you checked it.'
      ],
      vet: [
        'Your docs/resilience.md should end up as a complete document: timeout table, retry policy, breaker configuration, degradation matrix and the results of the four experiments.',
        'Press "Mark for review" and reread docs/resilience.md in a week.'
      ],
      edge: [
        'If an experiment works first time, be suspicious. Check that you really broke what you thought you broke: often the container was still alive or the client was pointing at another URL.',
        'Do not run chaos experiments against a database with data you care about. Use the Docker container from week 9 and assume you will have to recreate it.',
        'Resilience has a cost: each retry multiplies the load and each breaker adds state. Do not add policies where there is no real risk; an in-memory call does not need a circuit breaker.'
      ],
      quiz: [
        { q: 'What does a chaos experiment whose hypothesis holds give you?', a: 'It turns a belief into evidence. Before the experiment you knew you had configured a timeout; afterwards you know that timeout really cuts off on the real code path, with the policy order you have and the cancellation propagation you wrote.' },
        { q: 'Why must /health/live stay at 200 when PostgreSQL is down?', a: 'Because live answers whether the process is healthy and should be restarted, not whether it can take traffic. Restarting the API does not fix a database that is down, so marking live as failing would cause restart loops that make things worse.' },
        { q: 'Why does experiment 4 become an automated test while the others need not?', a: 'Because idempotency is a business rule that can be checked with the integration test stack you already have, and it can break with any refactor of the endpoint. Chaos experiments depend on turning off infrastructure, so they are run by hand or in a dedicated environment, not on every commit.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That resilience is not a library but a set of explicit decisions: how long to wait before giving up, which errors deserve another chance, when to stop insisting, which operations can be repeated without harm and which part of the service is still valid when something external goes down.' }
      ],
      out: 'A complete docs/resilience.md with the four experiments run and an idempotency test in the suite.',
      file: 'docs/resilience.md'
    }
  ]
}
]);
