/* Reference solution for each weekly exam (day 6), weeks 7 to 12. */
window.EN = window.EN || {};
window.EN.SOLUCIONES = Object.assign(window.EN.SOLUCIONES || {}, {

'w7d6': {
  intro: 'A complete docs/design.md: the actors table, the verified dependency diagram and one sentence with an example for each letter of SOLID. That last section is, literally, your interview answer.',
  body: `# VetCare - Design

## 1. Purpose of each class
| Class                | Exists to...                                         |
|----------------------|------------------------------------------------------|
| AppointmentScheduler | decide whether an appointment can be booked and save it |
| PriceCalculator      | calculate the price of a visit according to its rules |
| ReceiptGenerator     | format the receipt handed to the owner               |
| EmailNotifier        | send notices by email (infrastructure)               |

## 2. Actors and classes (SRP)
| Actor asking for changes | Class               | Example of a change           |
|--------------------------|---------------------|-------------------------------|
| Reception                | AppointmentScheduler | minimum appointment duration |
| Clinic owner             | PriceCalculator     | new emergency fee             |
| Accounting               | ReceiptGenerator    | tax details on the receipt    |
| Tech team                | EmailNotifier       | switch email provider         |

## 3. Interfaces (ISP)
Before: IRepository with 7 methods (Save, Find, Delete, All,
        Export, Backup, Count).
After:
  IReadAppointments   ById, ForDay           (agenda, reports)
  ISaveAppointments   Save                   (scheduler)
  INotifier           SendAsync              (reminders)
  ISystemClock        Now                    (everything that uses the date)
Export and Backup leave the domain: they are operations tasks.

## 4. Dependencies (DIP)
graph LR
  Api --> Domain
  Api --> Infrastructure
  Infrastructure --> Domain

Check: src/VetCare.Domain/VetCare.Domain.csproj has no
ProjectReference and no infrastructure packages.
Search for "using VetCare.Infrastructure" in Domain: 0 results.

## 5. SOLID in VetCare (oral defence)
S  Each class has a single actor asking for changes: I separated
   PriceCalculator (clinic owner) from ReceiptGenerator
   (accounting).
O  A new fee is a new IPriceRule class; the calculator
   is not touched (I checked with git status: only one new file).
L  InternalNote cannot be signed, so I moved Sign out of the parent into
   ISignable; no child throws NotImplementedException.
I  AppointmentScheduler receives IReadAppointments + ISaveAppointments, not a
   seven-method repository it does not use.
D  The domain defines INotifier; EmailNotifier lives in
   Infrastructure and the arrow points towards the domain.`
},

'w8d6': {
  intro: 'The in-memory repository working with the overlap rule tested, and the pattern cards in docs/design.md. The "when NOT to use it" column is the one that shows judgement.',
  body: `// Overlap rule in AppointmentScheduler
public async Task<Appointment> ScheduleAsync(Guid petId, Guid vetId,
                                             DateTime start, TimeSpan duration)
{
    var appointment = Appointment.Schedule(petId, vetId, start, duration, _clock.Now);
    if (await _repo.ExistsOverlappingAsync(vetId, appointment.Start, appointment.End))
        throw new TimeSlotTakenException(vetId, appointment.Start);
    await _repo.AddAsync(appointment);
    await _repo.SaveChangesAsync();
    return appointment;
}

// Test in the Playground
10:00-10:30 vet A ............ OK, booked
10:15-10:45 vet A ............ REJECTED: time slot taken       (partial overlap)
10:30-11:00 vet A ............ OK, booked                      (back-to-back: no overlap)
10:00-10:30 vet B ............ OK, booked                      (another vet)
09:00-12:00 vet A ............ REJECTED: time slot taken       (contains others)

# docs/design.md - Pattern cards

## Strategy - discounts
Problem:   the discount policy changes as the owner decides.
Solution:  IDiscountPolicy with one class per policy; Invoicer
           receives one through the constructor.
In VetCare: NoDiscount, LoyaltyDiscount, MultiPetDiscount.
NOT for:   when there is only one way to calculate and it will not change; a
           normal method is simpler.

## Factory - clinical documents
Problem:   which document to create depends on the visit type, and that
           decision was copied in several places.
Solution:  IDocumentFactory.Create(type, visit); the only switch
           on type lives there.
NOT for:   when there is only one class or creating it is trivial (new is enough).

## Adapter - notifications
Problem:   the email provider's SDK has its own language and
           its own errors.
Solution:  INotifier in the domain; SendGridNotifier translates
           types and exceptions.
NOT for:   when the library already speaks your language and you will not change it
           (for example, ILogger).

## Repository - appointments
Problem:   the domain needs to save and find appointments without knowing
           PostgreSQL exists, and to be tested without a database.
Solution:  IAppointmentRepository with intention-revealing methods
           (ExistsOverlappingAsync) and an in-memory version for tests.
NOT for:   reads for screens and reports: there a direct projected
           query is simpler (light CQRS, week 15).
           EF Core is already a repository; wrapping it is only justified
           by the tests and by naming business queries.`
},

'w9d6': {
  intro: 'database/reports.sql with the four reports and the billing transaction tested on both paths. Compare especially the use of LEFT JOIN with the filter in the ON and COUNT FILTER.',
  body: `-- database/reports.sql

-- 1. Appointments per vet this year (includes vets with no appointments)
SELECT v.name,
       count(a.id)                                     AS total,
       count(*) FILTER (WHERE a.status = 'cancelled')  AS cancelled,
       count(*) FILTER (WHERE a.status = 'attended')   AS attended
  FROM vet v
  LEFT JOIN appointment a ON a.vet_id = v.id
                         AND a.starts_at >= DATE '2026-01-01'
 GROUP BY v.id, v.name
 ORDER BY total DESC;

-- 2. Revenue per month
SELECT date_trunc('month', i.issued_at)::date AS month,
       sum(il.amount)                         AS revenue,
       count(DISTINCT i.id)                   AS invoices
  FROM invoice i
  JOIN invoice_line il ON il.invoice_id = i.id
 GROUP BY 1
 ORDER BY 1;

-- 3. Most seen species (by visits, not by pets)
SELECT p.species, count(*) AS visits
  FROM visit vi
  JOIN pet p ON p.id = vi.pet_id
 GROUP BY p.species
 ORDER BY visits DESC;

-- 4. Average consultation length per vet, in minutes
SELECT v.name,
       round(avg(extract(epoch FROM (a.ends_at - a.starts_at)) / 60), 1) AS avg_min
  FROM appointment a
  JOIN vet v ON v.id = a.vet_id
 WHERE a.status = 'attended'
 GROUP BY v.name
HAVING count(*) >= 5;          -- with fewer than 5 the average says nothing

-- 5. Billing transaction: happy path
BEGIN;
  INSERT INTO invoice (id, owner_id, total, issued_at)
  SELECT gen_random_uuid(), id, 0, now() FROM owner WHERE email = 'ana@example.com'
  RETURNING id AS invoice_id \\gset
  INSERT INTO invoice_line (invoice_id, description, amount) VALUES
    (:'invoice_id', 'General consultation', 35.00),
    (:'invoice_id', 'Rabies vaccine',       18.50);
  UPDATE invoice SET total = (SELECT sum(amount) FROM invoice_line
                               WHERE invoice_id = :'invoice_id')
   WHERE id = :'invoice_id';
COMMIT;
-- Check: the invoice exists with total 53.50 and two lines.

-- 6. Transaction with an error: nothing must remain
BEGIN;
  INSERT INTO invoice (id, owner_id, total, issued_at)
  SELECT gen_random_uuid(), id, 0, now() FROM owner WHERE email = 'ana@example.com'
  RETURNING id AS invoice_id \\gset
  INSERT INTO invoice_line (invoice_id, description, amount)
  VALUES (:'invoice_id', 'Error on purpose', -10.00);
  -- ERROR: new row ... violates check constraint "ck_line_amount_positive"
  -- current transaction is aborted, commands ignored until end of transaction block
ROLLBACK;
-- Check:
SELECT count(*) FROM invoice WHERE id = :'invoice_id';   -- 0

-- 5-minute script
-- types: uuid (public ids), numeric(10,2) (exact money),
--        timestamptz (instants with time zone), text (names)
-- constraints: weight > 0, end > start, status in a closed list,
--              case-insensitive unique email, FK with RESTRICT
-- daily agenda: appointment JOIN pet JOIN owner JOIN vet,
--               filter by date range, ORDER BY starts_at`
},

'w10d6': {
  intro: 'A database/README.md documenting the lost update reproduced, the three defences tested and the decision for VetCare. What is valuable is that each defence has its observed result, not just the theory.',
  body: `# VetCare database - concurrency

## 1. The bug, reproduced
Two psql sessions on agenda(id=1, slots=1), Read Committed:
  A: BEGIN; SELECT slots ... -> 1
  B: BEGIN; SELECT slots ... -> 1
  A: UPDATE agenda SET slots = 0 WHERE id = 1; COMMIT;
  B: UPDATE agenda SET slots = 0 WHERE id = 1; COMMIT;
Result: two appointments booked, slots = 0. An update was lost.

## 2. Defence 1 - pessimistic (SELECT ... FOR UPDATE)
  A: SELECT slots ... FOR UPDATE -> 1
  B: SELECT slots ... FOR UPDATE -> waits
  A: UPDATE ... slots = slots - 1; COMMIT;
  B: (unblocks) -> reads 0 -> does not book
Result: correct. Cost: B waited 4 s while A held the row.

## 3. Defence 2 - optimistic (version column)
  A and B read version = 7
  A: UPDATE ... SET slots = slots - 1, version = version + 1
     WHERE id = 1 AND version = 7;   -> UPDATE 1
  B: the same UPDATE                 -> UPDATE 0
Result: correct. B does not wait, but must reread and retry or
tell the user. It is what EF Core does with [ConcurrencyCheck].

## 4. Defence 3 - the rule lives in the database (exclusion constraint)
  A: BEGIN; INSERT appointment vet X 10:00-10:30;   (no COMMIT)
  B: INSERT appointment vet X 10:15-10:45;          -> waits for A
  A: COMMIT;
  B: ERROR: conflicting key value violates exclusion constraint
     "ex_appointment_no_overlap"   (SQLSTATE 23P01)
Repeated 10 times changing the order: the constraint always wins.

## 5. Decision for VetCare
| Case                         | Defence                    | Why                          |
|------------------------------|----------------------------|------------------------------|
| Overlapping appointments     | Exclusion constraint       | Atomic, no code, impossible to skip |
| Editing the pet record       | Optimistic (version)       | Rare conflicts; do not lock the screen |
| Decrementing vaccine stock   | A single statement:        | No window between read and write |
|                              | SET stock = stock - 1      |                              |
|                              | WHERE id = $1 AND stock > 0|                              |
Isolation level: Read Committed by default. I do not go up to
Serializable: I have no anomaly that justifies it and it would force
retrying transactions (error 40001).

## 6. Summary for the oral defence
Indexes: multi-column (vet_id, starts_at), from 180 ms to 0.4 ms.
EXPLAIN: Seq Scan -> Index Scan; I read estimated versus actual.
Migrations: numbered, never edited; NOT NULL in three steps.
Concurrency: the above.`
},

'w11d6': {
  intro: 'A docs/openapi.yaml with six endpoints that complements the example of the day: it includes cancellation as a sub-resource, the history, cursor pagination and error responses reused with $ref. Paste it into editor.swagger.io to see it.',
  body: `openapi: 3.1.0
info:
  title: VetCare API
  version: 1.0.0
servers:
  - url: http://localhost:5080/api/v1

paths:
  /appointments:
    get:
      summary: Lists appointments, filtered and paginated by cursor
      parameters:
        - { name: vetId, in: query, schema: { type: string, format: uuid } }
        - { name: day, in: query, schema: { type: string, format: date } }
        - { name: status, in: query, schema: { $ref: '#/components/schemas/AppointmentStatus' } }
        - { name: limit, in: query, schema: { type: integer, default: 20, maximum: 100 } }
        - { name: cursor, in: query, schema: { type: string } }
      responses:
        '200':
          description: Page of appointments
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AppointmentPage' }
        '422': { $ref: '#/components/responses/Validation' }
    post:
      summary: Books an appointment
      parameters:
        - { name: Idempotency-Key, in: header, required: true, schema: { type: string, format: uuid } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateAppointmentRequest' }
      responses:
        '201':
          description: Appointment created
          headers: { Location: { schema: { type: string } } }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AppointmentResponse' }
        '404': { $ref: '#/components/responses/NotFound' }
        '409': { $ref: '#/components/responses/Conflict' }
        '422': { $ref: '#/components/responses/Validation' }

  /appointments/{id}:
    get:
      summary: Gets an appointment
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      responses:
        '200':
          description: The appointment
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AppointmentResponse' }
        '404': { $ref: '#/components/responses/NotFound' }

  /appointments/{id}/cancellation:
    post:
      summary: Cancels an appointment (it is not deleted, it stays in the history)
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [reason]
              properties: { reason: { type: string, maxLength: 200 } }
      responses:
        '200':
          description: Appointment cancelled
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AppointmentResponse' }
        '404': { $ref: '#/components/responses/NotFound' }
        '409': { $ref: '#/components/responses/Conflict' }

  /pets/{id}:
    get:
      summary: Gets a pet's record
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      responses:
        '200':
          description: The pet
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PetResponse' }
        '404': { $ref: '#/components/responses/NotFound' }

  /pets/{id}/history:
    get:
      summary: A pet's visits and vaccines, most recent first
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      responses:
        '200':
          description: History
          content:
            application/json:
              schema:
                type: object
                properties:
                  visits: { type: array, items: { $ref: '#/components/schemas/VisitResponse' } }
        '404': { $ref: '#/components/responses/NotFound' }

components:
  parameters:
    Id: { name: id, in: path, required: true, schema: { type: string, format: uuid } }
  schemas:
    AppointmentStatus: { type: string, enum: [confirmed, attended, cancelled] }
    CreateAppointmentRequest:
      type: object
      required: [petId, vetId, start, durationMinutes]
      properties:
        petId: { type: string, format: uuid }
        vetId: { type: string, format: uuid }
        start: { type: string, format: date-time }
        durationMinutes: { type: integer, minimum: 15, maximum: 120 }
        reason: { type: string, maxLength: 200 }
    AppointmentResponse:
      type: object
      properties:
        id: { type: string, format: uuid }
        petId: { type: string, format: uuid }
        vetId: { type: string, format: uuid }
        start: { type: string, format: date-time }
        end: { type: string, format: date-time }
        status: { $ref: '#/components/schemas/AppointmentStatus' }
    AppointmentPage:
      type: object
      properties:
        data: { type: array, items: { $ref: '#/components/schemas/AppointmentResponse' } }
        nextCursor: { type: [string, 'null'] }
    PetResponse:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        species: { type: string, enum: [dog, cat, other] }
        birthDate: { type: string, format: date }
    VisitResponse:
      type: object
      properties:
        visitedOn: { type: string, format: date-time }
        reason: { type: string }
        vet: { type: string }
    ProblemDetails:
      type: object
      properties:
        type: { type: string }
        title: { type: string }
        status: { type: integer }
        detail: { type: string }
        traceId: { type: string }
        errors: { type: object, additionalProperties: { type: array, items: { type: string } } }
  responses:
    NotFound:
      description: The resource does not exist
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
    Conflict:
      description: Clashes with the current state (time slot taken, appointment already cancelled)
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
    Validation:
      description: Invalid input data, with the error for each field
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/ProblemDetails' } } }`
},

'w12d6': {
  intro: 'The final checklist answered with its proof, the API’s tidy Program.cs and the demo script with the exact commands. If your Program.cs goes over 60 lines, see how here everything is delegated to extension methods.',
  body: `FINAL CHECKLIST (with the proof for each point)
[x] Contract endpoints ............ the 6 in openapi.yaml show up in /scalar
[x] Status codes .................. demo.http: 201, 404, 409, 422 checked
[x] problem+json errors + traceId . curl -i of the 409: correct Content-Type
[x] Paginated collections ......... limit=500 -> 422 "maximum 100"
[x] No serialised entities ........ every endpoint returns *Response
[x] No N+1 ........................ SQL log: 1 query in history
[x] /health/live and /ready ....... docker stop vetcare-db -> ready 503, live 200
[x] Browsable documentation ....... /scalar, I run POST from the browser
[x] No secrets .................... string in user-secrets; appsettings empty

// src/VetCare.Api/Program.cs
using VetCare.Api.Endpoints;
using VetCare.Api.Errors;
using VetCare.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("VetCare")
             ?? throw new InvalidOperationException("ConnectionStrings:VetCare is missing");

builder.Services.AddInfrastructure(connectionString);   // DbContext and repositories
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<DomainErrorHandler>();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks().AddNpgSql(connectionString, name: "postgres", tags: ["ready"]);
builder.Services.AddCors(o => o.AddPolicy("front", p => p
    .WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseMiddleware<RequestLogging>();
app.UseCors("front");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapHealthChecks("/health/live",  new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new() { Predicate = c => c.Tags.Contains("ready") });

var api = app.MapGroup("/api/v1");
api.MapOwners();
api.MapPets();
api.MapAppointments();

app.Run();

public partial class Program { }

DEMO SCRIPT (demo.http, 5 minutes)
1. POST /api/v1/owners           { "name": "Ana Ruiz", ... }        -> 201
2. POST /api/v1/pets             { "ownerId": "<id>", "name": "Rocky", ... } -> 201
3. POST /api/v1/appointments     10:00-10:30 with Dr. Pérez         -> 201 + Location
4. POST /api/v1/appointments     10:15-10:45, same vet              -> 409 problem+json
5. GET  /api/v1/pets/<id>/history                                    -> 200, a single SQL query
6. docker stop vetcare-db ; GET /health/ready                        -> 503`
}

});
