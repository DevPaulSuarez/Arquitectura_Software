window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 11,
  phase: 'Backend and APIs',
  title: 'HTTP and REST: the language of the web',
  idea: 'Before writing a single line of ASP.NET you need to understand the protocol. A well designed API explains itself: the URL says which resource it is, the verb says what you do to it and the status code says how it went. This week you learn that language and design VetCare’s complete contract.',
  res: [
    { t: 'MDN — HTTP overview',
      u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
      note: 'The best free explanation of the protocol. Days 1 and 2 come from here.' },
    { t: 'MDN — HTTP response status codes',
      u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
      note: 'The full list with an explanation of each code. Keep it open every time you design an endpoint.' },
    { t: 'Microsoft — RESTful web API design',
      u: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      note: 'A design guide with concrete rules for names, filters, pagination and versioning.' },
    { t: 'RFC 9457 — Problem Details for HTTP APIs',
      u: 'https://www.rfc-editor.org/rfc/rfc9457.html',
      note: 'The standard error format ASP.NET Core uses by default. Read it on day 5.' },
    { t: 'OpenAPI Initiative — Learn OpenAPI', u: 'https://learn.openapis.org/', note: 'The official guide to writing an OpenAPI document.' }
  ],
  days: [
    {
      t: 'Anatomy of an HTTP request',
      obj: 'Understand exactly what travels between client and server.',
      why: 'When something fails in production, the first tool is looking at the raw request. If you can read headers and body, you debug in minutes what takes others hours.',
      study: { r: 0, what: 'Read the whole "Overview of HTTP" and the "HTTP Messages" section. About 18 minutes. Look for one thing: what it means for HTTP to be a stateless protocol.',
        pasos: [
          'Read "Components of HTTP-based systems" (~4 min): client, server and proxies.',
          'Read "Basic aspects of HTTP", especially "HTTP is stateless, but not sessionless" (~4 min).',
          'Read "HTTP flow" (~3 min): the steps of a full request.',
          'Read "HTTP Messages" with "Requests" and "Responses" (~5 min) and copy the parts of each message.',
          'Open the browser’s developer tools, Network tab, reload a page and find in a real request each part you copied.'
        ] },
      ex: { title: 'Raw request and response', body: `REQUEST

POST /api/appointments HTTP/1.1
Host: api.vetcare.local
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOi...
Idempotency-Key: 7f3c1b2a-9d44-4c21-8f0e-1a2b3c4d5e6f
Content-Length: 205

{
  "petId": "0b8f1e2c-6a3d-4f7e-9c21-5d4b3a2f1e0d",
  "vetId": "8d2e6b1a-3c4f-4a5b-8e7d-2f1a0c9b8e7d",
  "start": "2026-03-10T10:00:00Z",
  "durationMinutes": 30,
  "reason": "Annual check-up"
}

Parts:
  request line : method + path + version
  headers      : metadata (who I am, what I accept, what I send)
  blank line   : separates the headers from the body
  body         : the data

RESPONSE

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/appointments/5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f
Date: Tue, 10 Mar 2026 09:12:44 GMT

{
  "id": "5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f",
  "status": "scheduled",
  "start": "2026-03-10T10:00:00Z"
}

STATELESS

The server remembers nothing between requests.
Each request must carry everything needed, including the
identity (that is why the token goes in every one).
That is what lets you have ten servers behind a load
balancer without the user noticing anything.

HEADERS YOU WILL ALWAYS USE

Content-Type    which format I am sending
Accept          which format I want back
Authorization   credential
Location        where the created resource ended up
ETag            version of the resource (cache and concurrency)
Cache-Control   how long it can be cached` },
      steps: [
        'Install curl and make a verbose request to a public API: curl -v https://api.github.com/users/octocat',
        'Identify in the output the request line, the outgoing headers, the status code and the returning headers.',
        'Repeat with -H "Accept: application/xml" and see what happens: many APIs only know JSON and either ignore it or answer 406 Not Acceptable.',
        'Open the browser’s DevTools on the Network tab, go to any site and examine three different requests.',
        'Write in docs/api-notes.md the full anatomy of a request in your own words.'
      ],
      vet: [
        'List in docs/api-notes.md the headers VetCare will use and what each one is for.',
        'Decide the API’s date format: ISO 8601 in UTC, always.'
      ],
      edge: [
        'Content-Type describes what you send; Accept describes what you want to receive. Mixing them up is a common mistake.',
        'HTTP is stateless, but cookies and tokens simulate state. The server still remembers nothing on its own.',
        'Headers are case-insensitive. By convention they are written with a capital first letter, although in HTTP/2 and HTTP/3 they travel in lowercase.'
      ],
      quiz: [
        { q: 'What does it mean for HTTP to be stateless?', a: 'That the server keeps no information between requests, so each one must include everything needed to be understood on its own. That allows horizontal scaling, because any server can handle any request.' },
        { q: 'What is the difference between Content-Type and Accept?', a: 'Content-Type declares the format of the body you are sending. Accept declares the formats the client can process in the response. One describes what you send and the other what you expect.' },
        { q: 'What is the Location header for in a 201 response?', a: 'It gives the URL of the resource that was just created, so the client can fetch it without building the URL by hand from the id.' },
        { q: 'Why does authentication travel in every request and not just once?', a: 'Because the protocol keeps no session between requests. Always sending the credential is what lets any instance of the server handle the request without sharing session state.' }
      ],
      out: 'docs/api-notes.md with the anatomy of a request and the headers VetCare will use.',
      file: 'docs/api-notes.md'
    },
    {
      t: 'Methods and status codes',
      obj: 'Choose the right verb and code for each operation.',
      why: 'Returning 200 with a body that says "error" is the most common sin of badly made APIs. Using codes properly makes clients, proxies and monitoring work with no extra configuration.',
      study: { r: 1, what: 'Read the full list of codes, at least the 2xx, 4xx and 5xx ones. About 18 minutes. Look for one thing: the difference between 401 and 403, and between 400 and 422.',
        pasos: [
          'Read "Successful responses" (~4 min): 200, 201, 204 and when to use each one.',
          'Read "Client error responses" (~8 min): 400, 401, 403, 404, 409, 422 and 429.',
          'Read "Server error responses" (~3 min): 500, 502, 503 and 504.',
          'Write the difference between 401 and 403, and between 400 and 422, with a VetCare example each.',
          'Make a table with each planned VetCare endpoint and its main success and error codes.'
        ] },
      ex: { title: 'Verbs, idempotency and codes', body: `THE VERBS

GET     read. Changes nothing. Safe and idempotent.
POST    create or run an action. NOT idempotent.
PUT     replace completely. Idempotent.
PATCH   modify partially. Not necessarily idempotent.
DELETE  delete. Idempotent.

IDEMPOTENT = repeating the same request leaves the system
in the same state. DELETE twice: the resource stays deleted.
POST twice: two appointments created.

That is why if the user double-clicks "Book", you need an
Idempotency-Key or a unique constraint.

CODES YOU SHOULD USE

200 OK                 correct read or update
201 Created            resource created (send Location)
202 Accepted           accepted, processed later
204 No Content         correct and there is no body (DELETE)

400 Bad Request        the body cannot be understood (broken JSON)
401 Unauthorized       I do not know who you are (missing/expired token)
403 Forbidden          I know who you are and you may not
404 Not Found          that resource does not exist
409 Conflict           clashes with the current state (overlap)
422 Unprocessable      understood, but breaks a rule
429 Too Many Requests  request limit exceeded

500 Internal Error     your own unforeseen failure
503 Service Unavailable  a dependency is down or maintenance

THE TRAP

HTTP/1.1 200 OK
{ "ok": false, "error": "The appointment overlaps" }

This breaks everything: monitoring thinks it is fine, the
client has to parse the body to know it failed, and
automatic retries never kick in.

Correct:
HTTP/1.1 409 Conflict
{ "title": "Time slot not available", ... }

401 vs 403
401 -> you did not identify yourself or your token expired. Retry with a credential.
403 -> you identified yourself correctly but have no permission. Retrying does not help.

400 vs 422
400 -> I could not even read your request (malformed JSON, wrong type)
422 -> I read it fine but it breaks a business rule` },
      steps: [
        'Make a table in docs/api-notes.md with VetCare’s ten operations: operation, verb, path, success code, possible error codes.',
        'For each operation write whether it is idempotent and why.',
        'Look in your table for everything you were going to solve with POST and ask whether PUT or DELETE would be more correct.',
        'Define what VetCare does when someone books an overlapping appointment: it must be 409, not 400 or 200.',
        'Try the codes with curl against httpbin: curl -i https://httpbin.org/status/409'
      ],
      vet: [
        'VetCare operations: list appointments, view an appointment, create an appointment, reschedule, cancel, list pets, view history, create a visit, list invoices, mark an invoice as paid.',
        'Cancelling an appointment is a change of state, not a DELETE: use POST /api/appointments/{id}/cancellation or PATCH with the status.'
      ],
      edge: [
        'A DELETE of something that no longer exists can return 204 or 404; pick one and be consistent. 204 is kinder to retries.',
        'Do not use 500 for validation errors: 5xx means it is your fault, and it triggers alerts and needless retries.',
        'PUT replaces the whole resource: the client sends the full representation. If fields are missing, the honest thing is to reject the request, never to silently leave them as they were. To change just two fields there is PATCH.'
      ],
      quiz: [
        { q: 'What does it mean for a method to be idempotent and why does it matter?', a: 'That repeating the request leaves the system in the same state. It matters because it lets clients, proxies and load balancers retry safely when there is a network timeout without causing duplicates.' },
        { q: 'Difference between 401 and 403?', a: '401 means the server does not know who you are because the credential is missing or expired, so retrying with a valid token may work. 403 means it identified you correctly but you have no permission, and retrying will change nothing.' },
        { q: 'Why is it bad to return 200 with an error field in the body?', a: 'Because the status code is the signal understood by proxies, caches, HTTP clients and monitoring. If you always return 200, none of that infrastructure can tell success from failure and errors become invisible in the metrics.' },
        { q: 'Which code would you use for an appointment that overlaps another one?', a: '409 Conflict, because the request is well formed and valid in itself but clashes with the current state of the system. 422 is also defensible if you treat it as a rule violation, but 409 better expresses the conflict with another resource.' }
      ],
      out: 'A complete table of operations, verbs and codes in docs/api-notes.md.',
      file: 'docs/api-notes.md'
    },
    {
      t: 'Designing resources and URLs',
      obj: 'Name routes that can be understood without documentation.',
      why: 'URLs are your API’s public interface and, unlike code, they are almost impossible to change later. Designing them well the first time saves years of debt.',
      study: { r: 2, what: 'Read the sections "Define RESTful web API resource URIs" and "Define RESTful web API methods". About 18 minutes. Look for one thing: why plural nouns are recommended rather than verbs.',
        pasos: [
          'Read "RESTful web API design concepts" (~4 min): resources, URIs and representations.',
          'Read "Define RESTful web API resource URIs" and "Resource URI naming conventions" (~6 min): plural nouns, no verbs.',
          'Read "Define RESTful web API methods" and within it "HTTP request methods" (~6 min): what each verb does on a collection and on an item.',
          'Write VetCare’s URIs for pets, owners and appointments, including a nested relationship (a pet’s appointments).'
        ] },
      ex: { title: 'URLs that explain themselves', body: `BAD (verbs in the URL; the verb is already the HTTP method)

POST /api/getAppointments
POST /api/createAppointment
POST /api/deleteAppointment?id=5
GET  /api/getPetsForOwner?ownerId=3

GOOD (plural nouns, clear hierarchy)

GET    /api/appointments             list
GET    /api/appointments/{id}        view one
POST   /api/appointments             create
PUT    /api/appointments/{id}        replace
PATCH  /api/appointments/{id}        modify partially
DELETE /api/appointments/{id}        delete

({id} is the appointment's UUID, for example
/api/appointments/5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f)

NESTING: only when the child does not exist without the parent

GET  /api/owners/{id}/pets          that owner's pets
GET  /api/pets/{id}/visits          that pet's history
POST /api/pets/{id}/visits          record a visit

Do not nest more than two levels.
This is unreadable and fragile:
  /api/owners/{id}/pets/{id}/visits/{id}/documents/{id}

Better:
  /api/visits/{id}/documents
  or directly /api/documents/{id}

ACTIONS THAT ARE NOT CRUD

Sometimes an operation is neither creating nor deleting.
Two accepted options:

POST  /api/appointments/{id}/cancellation   (sub-resource)
PATCH /api/appointments/{id}  { "status": "cancelled" }

Pick one convention and keep it across the whole API.

FILTERS, SORTING AND PAGINATION: in the query string

GET /api/appointments?vetId={id}&from=2026-03-01&status=scheduled
GET /api/appointments?sort=start&direction=desc
GET /api/appointments?limit=20&cursor=eyJpZCI6OTgxfQ

The path identifies WHICH resource.
The query string says WHICH ONES of that resource.

OTHER RULES

- Always plural: /appointments, not /appointment
- Lowercase and hyphens: /invoice-lines
- No extension: no /appointments.json, use Accept
- No language version or internal details in the URL
- API version: /api/v1/appointments or a custom header
  (for example Api-Version: 1)` },
      steps: [
        'Write in docs/api-contract.md the full list of VetCare’s routes with their verb and one sentence about what they do.',
        'Check each one: does it have a verb in the path? Is it plural? Does it nest more than two levels?',
        'Define the query string for /api/appointments: which filters it accepts, how it is sorted, how it is paginated.',
        'Decide the convention for non-CRUD actions (cancel, confirm, mark as paid) and apply it to all of them.',
        'Give your list of routes to someone or read it out loud: if it is not understood without explanation, rename.'
      ],
      vet: [
        'VetCare resources: owners, pets, vets, appointments, visits, vaccines, documents, invoices.',
        'Nest only: /owners/{id}/pets, /pets/{id}/visits, /pets/{id}/vaccines, /invoices/{id}/lines.'
      ],
      edge: [
        'A published URL is a contract. Changing it breaks clients, so think of the name as if it were permanent.',
        'VetCare uses UUIDs (week 3), so its ids cannot be guessed and do not reveal how many records there are. Even so, every endpoint must check that the caller has permission: a hard-to-guess id is not security.',
        'Avoid endpoints that return different things depending on a parameter. Two behaviours are two endpoints.'
      ],
      quiz: [
        { q: 'Why are verbs not put in the URL?', a: 'Because the HTTP method already provides the verb. Putting the verb in the path duplicates the information and breaks the uniformity that lets caches, proxies and clients understand the operation without reading documentation.' },
        { q: 'When is it worth nesting routes?', a: 'When the child resource only makes sense inside the parent, like the lines of an invoice. If the child has its own identity and is queried on its own, it is better to give it a top-level route.' },
        { q: 'What goes in the path and what goes in the query string?', a: 'The path identifies the resource or the collection. The query string selects within that collection: filters, sorting, pagination and fields. A filter should never be part of the path.' },
        { q: 'How do you model an action that is not CRUD, such as cancelling an appointment?', a: 'Either as a sub-resource representing the event, with a POST to /appointments/{id}/cancellation, or as a PATCH that changes the status field. Both are valid; what matters is using the same convention across the whole API.' }
      ],
      out: 'docs/api-contract.md with all the routes, verbs and query string rules.',
      file: 'docs/api-contract.md'
    },
    {
      t: 'Representations: DTOs and data contracts',
      obj: 'Define exactly which JSON goes into and comes out of each endpoint.',
      why: 'Returning your domain entities directly is the mistake that causes the most data leaks. Separating the internal model from the public contract is standard practice in any serious team.',
      study: { r: 2, what: 'Read the sections "Resource MIME types" and "Implement data pagination and filtering". About 15 minutes. Look for one thing: why a collection response should wrap the data in an object.',
        pasos: [
          'Read "Resource MIME types" (~3 min): Content-Type and Accept.',
          'Read "Implement data pagination and filtering" (~5 min): limit, offset and why there must be a maximum.',
          'Read "Support partial responses" (~2 min) just to know it exists.',
          'Write the input and output JSON for creating an appointment, separating what the client sends from what the server generates (id, creation dates).'
        ] },
      ex: { title: 'Input and output DTOs', body: `WHY NOT RETURN THE ENTITY

public class Owner
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }   // leaks
    public string InternalNotes { get; set; }  // leaks
    public List<Pet> Pets { get; set; }        // infinite cycle
}

If you serialise this: you expose the hash and the internal
notes, and cause a circular reference Owner -> Pet -> Owner.

On top of that, any rename in the entity breaks the clients.

OUTPUT DTO (what the world sees)

public record AppointmentResponse(
    Guid Id,
    DateTimeOffset Start,
    DateTimeOffset End,
    string Status,
    PetSummary Pet,
    VetSummary Vet);

public record PetSummary(Guid Id, string Name, string Species);

INPUT DTO (what the world may send)

public record CreateAppointmentRequest(
    Guid PetId,
    Guid VetId,
    DateTimeOffset Start,
    int DurationMinutes,
    string? Reason);

Notice the client does NOT send Id or Status: the server
decides those. If you accepted them, someone could create
an appointment that is already "attended".

COLLECTION RESPONSE: always wrapped

BAD
[ { "id": "5e1d7c9a-..." }, { "id": "a41c..." } ]

GOOD
{
  "data": [ { "id": "5e1d7c9a-..." }, { "id": "a41c..." } ],
  "pagination": {
    "limit": 20,
    "nextCursor": "eyJpZCI6OTgxfQ",
    "hasMore": true
  }
}

Wrapping lets you add metadata later without breaking the
existing clients.

JSON CONVENTIONS
- camelCase property names
- ISO 8601 dates with a zone: 2026-03-10T10:00:00Z
- money as a decimal string or as an integer of cents,
  never as a float
- enums as readable strings ("scheduled"), not numbers` },
      steps: [
        'Write in docs/api-contract.md the example request and response JSON for each endpoint.',
        'Check each response: is there any field the client does not need? Remove it.',
        'Check each request: is there any field the client should not be able to decide? Remove it.',
        'Define the envelope for collections with pagination and use it in every list.',
        'Define the format for dates, money and enums once and apply it across the whole contract.'
      ],
      vet: [
        'VetCare must expose AppointmentResponse, PetResponse, OwnerResponse, VisitResponse, InvoiceResponse.',
        'No DTO may include a password hash, internal notes or ids from another table with no context.'
      ],
      edge: [
        'A field you add to a response is easy to remove today and impossible tomorrow: do not add anything "just in case".',
        'Returning a bare list at the root of the JSON is an old browser security risk and also prevents adding metadata.',
        'If the output DTO is identical to the entity today, still keep them separate: the day the entity changes you will not want to change the public contract.'
      ],
      quiz: [
        { q: 'Why not return domain entities directly?', a: 'Because it exposes internal and sensitive fields, can cause serialisation cycles, and ties the public contract to your internal model, so any refactor breaks the clients.' },
        { q: 'Why must the input DTO not include the id or the status?', a: 'Because they are the server’s decisions. If the client can send them, it can create resources with an identity of its choosing or skip the state flow, which is a security and consistency failure.' },
        { q: 'Why wrap collections in an object?', a: 'Because it lets you add metadata such as pagination, totals or notices without changing the shape of the response, which would be a breaking change if the data were an array at the root.' },
        { q: 'How is money represented in JSON and why?', a: 'As a decimal string or an integer number of cents, never as a floating-point number, because JSON does not distinguish numeric types and many parsers (JavaScript’s, for example) turn it into a double, losing precision in the cents.' }
      ],
      out: 'docs/api-contract.md with the input and output JSON for each endpoint.',
      file: 'docs/api-contract.md'
    },
    {
      t: 'Errors, validation and idempotency',
      obj: 'Design useful error responses and operations that are safe under retries.',
      why: 'A well formed error saves hours of support. And idempotency is what stops a double click or a network retry from charging the client twice.',
      study: { r: 3, what: 'Read RFC 9457 up to section 3.1. About 15 minutes. Look for one thing: what the standard fields of a problem details object are.',
        pasos: [
          'Read "1. Introduction" (~3 min): why a standard error format is needed.',
          'Read "3. The Problem Details JSON Object" with its example (~3 min).',
          'Read "3.1. Members of a Problem Details Object": "type", "status", "title", "detail" and "instance" (~5 min).',
          'Read "3.2. Extension Members" (~2 min): this is how per-field errors are added.',
          'Write VetCare’s problem details for an appointment that overlaps another one.'
        ] },
      ex: { title: 'Problem Details and Idempotency-Key', body: `A BADLY FORMED ERROR

HTTP/1.1 400 Bad Request
"Error"

The client does not know which field failed, whether to
retry, or what to show the user.

AN ERROR FOLLOWING RFC 9457 (the format ASP.NET Core
generates; careful: by default ASP.NET Core answers 400 for
validation, and in VetCare we use 422 for rules, as you
decided on day 2)

HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.vetcare.local/errors/validation",
  "title": "One or more fields are invalid",
  "status": 422,
  "detail": "Check the fields listed in errors",
  "instance": "/api/appointments",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "errors": {
    "start": ["The date must be in the future"],
    "durationMinutes": ["Must be between 10 and 180"]
  }
}

Standard fields:
type     URI that identifies the KIND of error (stable)
title    readable summary, the same for every error of that kind
status   the HTTP code, repeated for clients that lose it
detail   explanation of THIS particular occurrence
instance URI of the request that failed

traceId is not part of the standard but it is gold: it lets
you match the user's error with your logs.

BUSINESS CONFLICT

HTTP/1.1 409 Conflict
{
  "type": "https://api.vetcare.local/errors/slot-taken",
  "title": "The vet already has an appointment at that time",
  "status": 409,
  "detail": "Conflicts with appointment 814 from 10:15 to 10:45",
  "instance": "/api/appointments"
}

IDEMPOTENCY IN POST

The client generates a unique key per intention:

POST /api/appointments
Idempotency-Key: 7f3c1b2a-9d44-4c21-8f0e-1a2b3c4d5e6f

The server stores key -> response.
If the same key arrives again, it returns the stored response
without creating anything new.

So: the user double-clicks, the network retries, the phone
loses signal and resends... a single appointment.

RULES FOR ERROR MESSAGES
- Never include stack traces or SQL in the response.
- Never say "user does not exist" at login: say "invalid
  credentials" so as not to leak which emails exist.
- If it includes a traceId, the user can give it to you and
  you can look it up in the logs.` },
      steps: [
        'Define VetCare’s error catalogue in docs/api-contract.md: one row per kind with type, title and status.',
        'Write the full JSON for three errors: validation 422, slot taken 409, not found 404.',
        'Decide which VetCare endpoints need an Idempotency-Key. At least creating an appointment and recording a payment.',
        'Describe the idempotency flow: where the key is stored, how long it lives, what happens if the same key arrives with a different body.',
        'Review your error messages: does any of them leak internal information? Rewrite it.'
      ],
      vet: [
        'VetCare error kinds: validation, slot-taken, resource-not-found, no-permission, limit-exceeded.',
        'Every VetCare error includes a traceId.'
      ],
      edge: [
        'If the same Idempotency-Key arrives with a different body, answer 422: it is a client error, not a repeat.',
        'Idempotency keys must expire (24 hours is typical) or the table will grow without limit.',
        'The type field must be a stable URI you use as an identifier, not necessarily a page that exists.'
      ],
      quiz: [
        { q: 'What are the standard fields of problem details?', a: 'type, title, status, detail and instance. type identifies the kind of error stably, title summarises it, status repeats the HTTP code, detail explains this particular occurrence and instance points to the request that failed.' },
        { q: 'How does an Idempotency-Key work?', a: 'The client generates a unique key per intention and sends it in the header. The server stores the link between key and response, so if the same key arrives again it returns the original response without running the operation again.' },
        { q: 'Why should a failed login not say whether the user exists?', a: 'Because it allows account enumeration: an attacker tries emails and discovers which ones are registered. A single "invalid credentials" message does not reveal that information.' },
        { q: 'What is including a traceId in the error for?', a: 'It lets you correlate what the user saw with the server logs. The user reports the id and you find the exact trace without having to guess the time or the endpoint.' }
      ],
      out: 'An error catalogue and the idempotency design in docs/api-contract.md.',
      file: 'docs/api-contract.md'
    },
    {
      t: 'Complete contract and OpenAPI (weekly exam)',
      obj: 'Write VetCare’s API contract in OpenAPI format and defend it.',
      why: 'OpenAPI is the format every team uses to agree on the API before coding it. Being able to write it by hand lets you design the contract first and get clients and documentation for free.',
      study: { r: 4, what: 'Read the introduction and the part of the specification about paths, operations and components. About 20 minutes. Then open https://editor.swagger.io to see an example OpenAPI. Look for one thing: how a reusable schema is defined in components.',
        pasos: [
          'Read the home page (~3 min): what OpenAPI is for and who uses it.',
          'From the index open "The OpenAPI Specification Explained" and read the part on API endpoints (~5 min): paths and operations.',
          'Read "Content of Message Bodies" and "Parameters and Payload of an Operation" (~5 min).',
          'Read "Reusing Description" (~4 min): this is how schemas are defined in components and reused with $ref.',
          'Open editor.swagger.io, delete the example and write the create-appointment path with a schema in components.'
        ] },
      ex: { title: 'A minimal but real OpenAPI', body: `openapi: 3.1.0
info:
  title: VetCare API
  version: 1.0.0
  description: Management API for the VetCare veterinary clinic

servers:
  - url: https://api.vetcare.local/api/v1

paths:
  /appointments:
    get:
      summary: List appointments
      parameters:
        - name: vetId
          in: query
          schema: { type: string, format: uuid }
        - name: from
          in: query
          schema: { type: string, format: date }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Paginated list of appointments
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/AppointmentResponse'

    post:
      summary: Book an appointment
      parameters:
        - name: Idempotency-Key
          in: header
          required: false
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAppointmentRequest'
      responses:
        '201':
          description: Appointment created
          headers:
            Location:
              schema: { type: string }
        '409':
          description: Time slot taken
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'

components:
  schemas:
    CreateAppointmentRequest:
      type: object
      required: [petId, vetId, start, durationMinutes]
      properties:
        petId:            { type: string, format: uuid }
        vetId:            { type: string, format: uuid }
        start:            { type: string, format: date-time }
        durationMinutes:  { type: integer, minimum: 10, maximum: 180 }
        reason:           { type: string, maxLength: 500 }

    AppointmentResponse:
      type: object
      properties:
        id:     { type: string, format: uuid }
        start:  { type: string, format: date-time }
        status:
          type: string
          enum: [scheduled, confirmed, attended, cancelled]

    ProblemDetails:
      type: object
      properties:
        type:     { type: string }
        title:    { type: string }
        status:   { type: integer }
        detail:   { type: string }
        traceId:  { type: string }` },
      steps: [
        'Create docs/openapi.yaml and write by hand at least six VetCare endpoints with their schemas.',
        'Reuse the schemas in components and reference them with $ref. Do not repeat definitions.',
        'Paste your file into https://editor.swagger.io and fix every validation error.',
        'Look at the editor’s right-hand panel: it is the generated documentation. Check that it can be understood without your explanations. (The Try it out button will not work yet: your API does not exist.)',
        'Defend out loud for five minutes: why you chose each verb, each code and each DTO shape.'
      ],
      vet: [
        'Minimum endpoints in the openapi: list appointments, create an appointment, view an appointment, cancel an appointment, list an owner’s pets, a pet’s history.',
        'Press "Mark for review" and reread docs/openapi.yaml in a week.'
      ],
      edge: [
        'OpenAPI describes the contract but does not enforce it: the server must still validate everything that arrives.',
        'A hand-maintained yaml goes out of sync easily. In week 12 you will generate it from the ASP.NET Core code.',
        'Do not put examples with real people’s data in the openapi: it is usually published.'
      ],
      quiz: [
        { q: 'What is OpenAPI for beyond documenting?', a: 'It lets you generate clients in several languages, generate contract tests, validate requests automatically and agree on the API between teams before writing code, so front end and back end can work in parallel.' },
        { q: 'What do you gain by using $ref and components?', a: 'It avoids repeating the same definition in every endpoint, so a change to the schema is reflected everywhere and the file stays readable as the API grows.' },
        { q: 'If I have OpenAPI, do I need to validate on the server?', a: 'Yes. OpenAPI is only a description; anyone can send a request that does not respect it. Server-side validation is the only real guarantee.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That a good API is an explicit contract where the URL identifies the resource, the verb states the operation, the status code tells the whole infrastructure the result, the DTO protects the internal model and the error says exactly what to do next.' }
      ],
      out: 'A docs/openapi.yaml that is valid in editor.swagger.io with at least six endpoints.',
      file: 'docs/openapi.yaml'
    }
  ]
}
]);
