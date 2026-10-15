/* Reference solution for each weekly exam (day 6), weeks 13 to 18. */
window.EN = window.EN || {};
window.EN.SOLUCIONES = Object.assign(window.EN.SOLUCIONES || {}, {

'w13d6': {
  intro: 'A finished docs/testing.md: the testing policy, the map of covered rules, the measured results (10 runs, times, mutations) and the checklist. Notice that one mutation survived and was closed with a new test: that is normal and valuable.',
  body: `# VetCare - Testing

## 1. Policy
- Business rules: always a unit test (domain, no I/O).
- Endpoints: one integration test per promised status code,
  against real PostgreSQL with Testcontainers.
- Not tested: getters, trivial mappings or the framework.
- Names: Method_When_Then.

## 2. Rules and their tests
| Rule                                   | Test                                              |
|----------------------------------------|---------------------------------------------------|
| BR-01 Every pet has an owner           | Create_WhenOwnerEmpty_Throws                      |
| BR-02 Combination vaccine from 8 weeks | RecordVaccine_WhenSixWeeksOld_Rejects             |
| BR-03 No overlaps per vet              | Schedule_WhenPartiallyOverlapping_ThrowsTimeSlotTaken |
|                                        | Schedule_WhenBackToBack_Accepts                   |
| BR-04 Duration between 15 and 120 min  | Schedule_WhenDurationInvalid_Throws (Theory x4)   |
| BR-05 Only confirmed ones are cancelled| Cancel_WhenAlreadyCancelled_Throws                |
| BR-06 Fee with less than 24 h          | Cancel_WhenLessThan24hLeft_FlagsFee               |
| BR-07 Rabies booster at 12 months      | Next_WhenRabies11MonthsAgo_ReturnsRabiesIn1Month  |
| 409 in the API                         | PostAppointment_WhenOverlapping_Returns409        |
| 422 in the API                         | PostAppointment_WhenDuration0_Returns422WithField |

## 3. Measurements
Stability: 10 runs in a row of dotnet test -> 10/10 green.
  (Before: 9/10. The pagination test failed because two appointments had
  the same start and the order was not stable. Fix: ORDER BY starts_at, id.)
Speed: VetCare.Domain.Tests, 64 tests in 0.41 s.
       VetCare.Api.Tests, 14 tests in 11 s (container startup included).

## 4. Manual mutations
| Mutation                                   | Did the suite catch it?                      |
|--------------------------------------------|----------------------------------------------|
| a.Start < end  ->  a.Start <= end          | YES: Schedule_WhenBackToBack_Accepts         |
| duration < 15  ->  duration < 10           | YES: Theory with 10 minutes                  |
| remove the throw in Cancel when cancelled  | NO -> the test was missing. Added            |
|                                            | Cancel_WhenAlreadyCancelled_Throws           |

## 5. Checklist
[x] Pass in any order (10 runs)             [x] Unit tests < 2 s (0.41 s)
[x] No DateTime.Now or Thread.Sleep         [x] No ifs or loops in the tests
[x] Method_When_Then names                  [x] Every rule with its test
[x] One test per status code                [x] Mutations caught
[x] No test commented out or with Skip

## 6. Defence (5 minutes)
I test domain rules with fast unit tests and the API with real
integration tests. I do not test what cannot fail because of me. I know the suite
works because it catches mutations (and when it missed one, I closed it),
because it is stable over 10 runs and because it runs fast enough
to run before every commit.`
},

'w14d6': {
  intro: 'A docs/resilience.md with the four experiments run and their real results, including one that failed and how it was fixed, plus the idempotency test. A hypothesis failing is not a fail grade: it is exactly what the exercise is meant to uncover.',
  body: `# VetCare - Resilience

## Dependency matrix
| Dependency  | Critical | If it fails                    | The user sees                         |
|-------------|----------|--------------------------------|---------------------------------------|
| PostgreSQL  | YES      | 503 + Retry-After              | "Service unavailable, try again"      |
| Email       | NO       | Queued in the outbox           | Appointment created + "confirmation later" notice |
| SMS         | NO       | Skipped, Warning log           | Nothing                               |

## Experiment 1 - Database down
Hypothesis: POST /appointments -> 503 in < 11 s; ready 503; live 200.
Result: POST took 15.2 s and returned 500.          <- FAILED
Cause: the Npgsql connection timeout was 15 s and the
NpgsqlException was not translated.
Fix: "Timeout=3" in the connection string and the error handler
translates NpgsqlException to 503 with Retry-After: 30.
Repeated: 503 in 3.1 s. ready 503, live 200.         <- OK

## Experiment 2 - Slow email (30 s)
Hypothesis: 201 in < 3 s, email in the outbox, response with a warning.
Result: 201 in 140 ms; row in outbox_message; warnings = ["The email
confirmation will arrive in a few minutes"].        <- OK

## Experiment 3 - Email down for a sustained period
Hypothesis: first ones ~1 s; then < 10 ms with BrokenCircuitException;
one Half-Open attempt after 15 s.
Result (30 sends from the outbox processor):
  sends 1-6:   between 0.9 and 1.3 s (retries with backoff)
  sends 7-30:  between 1 and 3 ms, BrokenCircuitException
  after 15 s:  "Circuit breaker half-open" in the log, 1 attempt
  fake server switched to 200 -> "closed"               <- OK

## Experiment 4 - Client retry
Two POSTs with Idempotency-Key: abc-123 and the same body.
Result: 201 with id 3f2a... on both. SELECT count(*) = 1. <- OK

## Test added to the suite
[Fact]
public async Task PostAppointment_WithSameIdempotencyKey_CreatesSingleAppointment()
{
    var client = _factory.CreateClient();
    client.DefaultRequestHeaders.Add("Idempotency-Key", Guid.NewGuid().ToString());
    var dto = ValidAppointment();

    var r1 = await client.PostAsJsonAsync("/api/v1/appointments", dto);
    var r2 = await client.PostAsJsonAsync("/api/v1/appointments", dto);

    var a1 = await r1.Content.ReadFromJsonAsync<AppointmentResponse>();
    var a2 = await r2.Content.ReadFromJsonAsync<AppointmentResponse>();
    a1!.Id.Should().Be(a2!.Id);
    (await CountAppointments(dto.PetId, dto.Start)).Should().Be(1);
}

## Defence checklist (with where it is met)
[x] Justified timeouts ............. EmailClient.cs (5 s), string (Timeout=3)
[x] CancellationToken end to end ... endpoints -> use cases -> EF
[x] Retries only on 408/429/5xx .... RetryTests (2 tests)
[x] Breaker per dependency ......... AddResilienceHandler("email")
[x] Idempotency-Key on POST /appointments  test above
[x] External effects via outbox .... EnqueueConfirmation + OutboxProcessor
[x] Matrix written ................. above
[x] ready only with critical ones .. only "postgres"
[x] Fallbacks with Warning and metric  vetcare.fallbacks{dependency}
[x] Four experiments ............... above`
},

'w15d6': {
  intro: 'ADRs 005 to 008 complete (004 is already in the example of the day). Each one has at least two rejected alternatives, real negative consequences and a concrete verification.',
  body: `# ADR-005: Explicit use cases in VetCare.Application
Status: Accepted
Context: the endpoints mixed HTTP, orchestration and rules. POST
/appointments had 70 lines and could not be reused from anywhere else.
Decision: each write operation is a use case in
VetCare.Application (command + result + IScheduleAppointment interface).
The endpoint only translates HTTP <-> command.
Alternatives:
  1. Logic in the endpoints. Rejected: not reusable and hard to
     test without starting the API.
  2. MediatR for everything. Rejected: it adds a dependency and an
     indirection I do not need with a dozen use cases.
Consequences: + reusable (the CLI uses the same use case), +
tests without HTTP. − one more project and more files per operation.
Verification: VetCare.Cli books an appointment without going through HTTP; the
write endpoints have fewer than 15 lines.

# ADR-006: Light CQRS, direct projected reads
Status: Accepted
Context: the agenda loaded whole Appointment aggregates to show 6
columns: 3 queries and 12 ms per request.
Decision: writes go through the domain; reads are
projected with a direct Select on the DbContext into read DTOs
(interfaces in Application, implementation in Infrastructure).
Alternatives:
  1. Always read through the repository. Rejected: measured, 12 ms versus
     2 ms, and the repository kept growing with screen methods.
  2. Separate read database. Rejected: extra synchronisation and operations
     without a volume that justifies it.
Consequences: + fast, simple reads. − two paths to know;
a read that needs a rule must go through the domain.
Verification: EXPLAIN ANALYZE of the agenda in docs/architecture.md;
queries live only in Infrastructure/Queries.

# ADR-007: Domain events dispatched before the commit
Status: Accepted
Context: ScheduleAppointment called the outbox, statistics and the
vet's agenda; every new reaction made it bigger.
Decision: entities raise events (AppointmentScheduled...) and a
dispatcher delivers them to their handlers right before
SaveChangesAsync, inside the same transaction.
Alternatives:
  1. Direct calls in the use case. Rejected: it couples the use
     case to every reaction.
  2. Dispatch after the commit. Rejected: if the process dies between
     the commit and the dispatch, the reaction is lost. External effects already
     go through the outbox (outbox ADR, week 14).
Consequences: + adding a reaction = a new handler. − the flow
is less visible when reading the use case; a slow handler lengthens the
transaction.
Verification: test Schedule_RaisesAppointmentScheduled; integration test
that checks the appointment and its outbox message are saved together.

# ADR-008: Modular monolith, not microservices
Status: Accepted
Context: VetCare has four capabilities (Scheduling, Clinic,
Customers, Billing), a one-person team and a single database.
Decision: one deployable application with four modules. Each
module exposes a small public contract (IClinicPublic...) and does not
read another one's tables.
Alternatives:
  1. Microservices per capability. Rejected: network, deployments,
     observability and distributed consistency for a problem I do not
     have; the team is one person.
  2. Monolith without modules. Rejected: everything ends up depending on everything and
     later nothing can be extracted.
Consequences: + one deployment, local transactions, simple
debugging. − boundary discipline depends on reviews and tests, not
on the network; a module cannot scale on its own.
Verification: a test that fails if a module references another one's
internal namespace; monthly review of JOINs between modules (today: 2).
Signal to change: a module that needs to scale or be deployed at a
different pace from the rest.`
},

'w16d6': {
  intro: 'A finished Schedule.tsx with the four states, the derived search, the filter, the detail by id and the cancellation, plus the review notes. Compare it with yours looking above all at the minimal state: here there are only four useState.',
  body: `// web/src/pages/Schedule.tsx
import { useState } from "react";
import type { Appointment, AppointmentStatus } from "../types";
import { useDailyAppointments } from "../hooks/useDailyAppointments";
import { cancelAppointment } from "../api/appointments";
import { AppointmentTable } from "../components/AppointmentTable";
import { DetailPanel } from "../components/DetailPanel";
import { NewAppointmentForm } from "../components/NewAppointmentForm";

type Filter = AppointmentStatus | "all";

export function Schedule() {
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [filter, setFilter] = useState<Filter>("all");
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, loading, error, reload } = useDailyAppointments(day);

  // Derived: none of this is state
  const q = text.trim().toLowerCase();
  const visible = data
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => !q || a.petName.toLowerCase().includes(q)
                      || a.ownerName.toLowerCase().includes(q));
  const selected: Appointment | undefined = data.find((a) => a.id === selectedId);

  async function cancel(id: string) {
    if (!window.confirm("Cancel this appointment?")) return;
    await cancelAppointment(id);
    reload();
  }

  return (
    <main>
      <h1>Schedule</h1>
      <label htmlFor="day">Day</label>
      <input id="day" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      <label htmlFor="search">Search pet or owner</label>
      <input id="search" value={text} onChange={(e) => setText(e.target.value)} />
      <label htmlFor="status">Status</label>
      <select id="status" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value="all">All</option>
        <option value="confirmed">Confirmed</option>
        <option value="attended">Attended</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {loading && <TableSkeleton rows={5} />}

      {!loading && error && (
        <div role="alert">
          <p>The schedule could not be loaded. Check your connection.</p>
          <button onClick={reload}>Retry</button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <p>
          {data.length === 0
            ? "There are no appointments this day. You can book the first one with the form."
            : "No appointment matches the search or the filter."}
        </p>
      )}

      {!loading && !error && visible.length > 0 && (
        <AppointmentTable appointments={visible} selectedId={selectedId}
                          onSelect={setSelectedId} onCancel={cancel} />
      )}

      {selected && <DetailPanel key={selected.id} appointment={selected} />}
      <NewAppointmentForm day={day} onCreated={reload} />
    </main>
  );
}

// docs/frontend.md - Schedule review
Functionality: all 7 points done.
Four states: loading (skeleton), error (role="alert" + retry),
  empty (tells "no appointments" apart from "no match"), with data.
State: 4 useState (day, filter, text, selectedId). I removed 3:
  filteredAppointments, total and selectedAppointment (they are derived).
TypeScript: npx tsc -b with no errors; grep ": any" -> 0.
Manual test:
  1 backend off -> error + retry ....................... OK
  3 overlapping appointment -> "That time is already taken"  OK
  6 search with no results -> useful text .............. OK
  7 Tab: each row's "Cancel" button had no accessible
    text ("X"). Fix: aria-label="Cancel Rocky's appointment".`
},

'w17d6': {
  intro: 'A docs/frontend.md with the five sections of the deliverable. It is meant so that someone who does not know the project understands how data is handled and why.',
  body: `# VetCare web - Frontend decisions

## 1. Query keys
| Key                                  | Data                      | staleTime | Why                              |
|--------------------------------------|---------------------------|-----------|----------------------------------|
| ["appointments", day]                | one day's agenda          | 30 s      | changes often; several users     |
| ["pet", id]                          | record                    | 5 min     | almost never changes             |
| ["pet", id, "history"]               | visits and vaccines       | 1 min     | changes after each visit         |
| ["vets"]                             | list for selectors        | 1 h       | changes once a year              |
| ["session"]                          | logged-in user            | infinite  | only changes on login or logout  |
Rule: the key includes EVERYTHING that changes the result (the day, the id).

## 2. Invalidations
| Mutation          | Invalidates                                      |
|-------------------|--------------------------------------------------|
| Create appointment| ["appointments"]                                 |
| Cancel appointment| ["appointments"]  (optimistic on ["appointments", day]) |
| Record visit      | ["appointments"], ["pet", id, "history"]         |
| Edit pet          | ["pet", id], ["appointments"] (shows its name)   |

## 3. Optimistic or with a wait
| Operation          | Mode       | Reason                                         |
|--------------------|------------|------------------------------------------------|
| Cancel appointment | Optimistic | almost never fails; undoing is trivial         |
| Create appointment | Wait       | the server decides the id and may answer 409   |
| Record visit       | Wait       | clinical data: the user must see it was saved  |
Rollback tested with the backend off: the row goes back to "confirmed"
and "Could not cancel. Try again" appears.

## 4. Routes and URL
/                          schedule (?day=2026-10-10&status=confirmed&q=rocky)
/pets/:id                  record and history
/login                     sign in
*                          page not found
errorElement in the Layout unexpected error with a button to go back
The search uses replace: true (it does not fill the history letter by letter).

## 5. Perceived performance: the three thresholds
0.1 s  feels instant         -> cancelling is optimistic.
1 s    the flow is not lost  -> changing day keeps the previous table
       dimmed (keepPreviousData).
10 s   attention is lost     -> nothing must come close: on Slow 3G,
       creating an appointment takes 4 s and the button says "Saving…".
Skeletons only appear after 300 ms (useDelayed): on a fast
network there is no flicker.

## Manual tests (result)
1 3G .............. creating an appointment awkward -> added "Saving…"
2 backend off ..... the pet record showed a blank screen
                    -> the error state was missing. Fixed.
3 empty database .. empty-state texts on schedule and records
4 rollback ........ visible and with a notice
5 copied URL ...... same result in a new window
6 Tab ............. everything reachable
7 back after 1 min  refetchOnWindowFocus reloads the schedule`
},

'w18d6': {
  intro: 'A docs/security.md with the eight attacks run and their real result, including one that succeeded and how it was closed, and the tests that turn it into a regression check. Finding a flaw of your own is the best possible outcome of this week.',
  body: `# VetCare - Security audit

| # | Attack                     | Expected | Result                       |
|---|----------------------------|----------|------------------------------|
| 1 | IDOR on pets, history,     | 404      | pets 404 ✓ · history         |
|   | invoices and appointments  |          | 200 ✗ (see below) · rest ✓   |
| 2 | Reception records a visit  | 403      | 403 ✓                        |
| 3 | Token with changed role    | 401      | 401 ✓ (invalid signature)    |
| 4 | 20 failed logins           | 429 on 6th | 429 from the 6th ✓         |
| 5 | User enumeration           | identical| same body and code; time:    |
|   |                            |          | 4 ms versus 260 ms ✗         |
| 6 | Refresh after logout       | 401      | 401 ✓                        |
| 7 | ' OR 1=1 -- in search      | nothing  | 0 rows ✓ (SqlQueryRaw uses {0}) |
| 8 | Secrets in repo and history| nothing  | nothing ✓                    |

## What was wrong and how I fixed it
Attack 1: GET /api/v1/pets/{id}/history only filtered by id.
  The ownership filter was on GET /pets/{id}, but not on
  the history, which was added later.
  Fix: the filter goes in the history query:
    .Where(v => v.PetId == id &&
               (isStaff || v.Pet.Owner.UserId == userId))
  and it returns 404 if there is no result.
Attack 5: with a non-existent email no hash was calculated, so
  it answered in 4 ms. Fix: it verifies against a precalculated
  dummy hash. Now: 255 ms versus 260 ms.
Accepted risk: the access JWT is still valid for up to 15 min
  after logout (it cannot be revoked). Mitigated with the short
  lifetime and revoking the refresh token.

## Regression tests (tests/VetCare.Api.Tests/Security)
OwnerA_HistoryOfPetOfB_Returns404               (attack 1)
Receptionist_RecordVisit_Returns403             (attack 2)
TokenWithTamperedRole_Returns401                (attack 3)
RefreshAfterLogout_Returns401                   (attack 6)

[Fact]
public async Task OwnerA_HistoryOfPetOfB_Returns404()
{
    var (clientA, _) = await CreateOwnerWithPet("a@test.com");
    var (_, petB) = await CreateOwnerWithPet("b@test.com");

    var r = await clientA.GetAsync($"/api/v1/pets/{petB}/history");

    r.StatusCode.Should().Be(HttpStatusCode.NotFound);
}

## Final checklist (where it is met)
[x] BCrypt factor 12, never in logs ..... User.cs
[x] Login without enumeration, even by time  dummy hash in LoginService
[x] HttpOnly + Secure + SameSite cookie . IssueSession()
[x] Key outside the repo ................ user-secrets + failure on startup
[x] RequireAuthorization on non-public .. endpoint groups
[x] Ownership in the query .............. pets, history, appointments, invoices
[x] Someone else's = 404 ................ attack 1 test
[x] Refresh with rotation and reuse ..... RefreshService + test
[x] Logout revokes on the server ........ attack 6 test
[x] Rate limiting on login .............. "login" 5/min
[x] Five headers ........................ SecurityHeaders.cs
[x] HTTPS + HSTS ........................ UseHsts outside Development
[x] No secrets in repo or history ....... attack 8`
}

});
