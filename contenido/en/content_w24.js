window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
  {
    n: 24,
    phase: 'System design',
    title: 'System design II and wrap-up: evolve, look after the data and tell what you did',
    idea: 'Week 23 gave you the method. This week you put it to the test in a domain you do not know, and then you deal with the two things that separate a study project from a real system: how a contract changes without breaking whoever already uses it, and how data is looked after when losing it is not an option. The wrap-up is not a summary: it is turning 24 weeks of work into something you can defend in an interview in five minutes, with evidence in the repository and two stories that really happened to you. If you got here you have a system documented end to end; what is missing is that you know how to say it.',
    res: [
      { t: 'Martin Fowler — Patterns of Distributed Systems',
        u: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
        note: 'A catalogue of patterns with a name and a specific problem. Do not read it all: use it as an index to put names to things you already did (write-ahead log, idempotent receiver, versioned value).' },
      { t: 'Martin Fowler — Consumer-Driven Contracts',
        u: 'https://martinfowler.com/articles/consumerDrivenContracts.html',
        note: 'It explains why versioning an API is a problem of agreements between people before it is one of routes. The basis of day 2.' },
      { t: 'PostgreSQL — Backup and Restore',
        u: 'https://www.postgresql.org/docs/current/backup.html',
        note: 'Official documentation. For day 3 you only need the pg_dump and restore sections; the rest is reference.' },
      { t: 'Google SRE Book — Postmortem Culture',
        u: 'https://sre.google/sre-book/postmortem-culture/',
        note: 'You already wrote a postmortem in week 22. This chapter gives you the language to tell it in an interview without sounding like an excuse.' }
    ],
    days: [
      {
        t: 'Transferring the method: designing a domain you do not know',
        obj: 'Apply week 23’s five steps to a system different from VetCare and check that the method, not the domain, is what you know.',
        why: 'In an interview they will not ask you for VetCare. They will ask you for a URL shortener, a booking system or a feed. If you only know your project, your answer collapses in the first minute. If you know the method, the domain is just new vocabulary.',
        study: { r: 0, what: 'Open the patterns catalogue and read only the titles and the first sentence of each one. About 10 minutes. Do not try to learn them: the goal is to recognise that you already implemented several of them without knowing the name. Note three that sound like something you already did.',
        pasos: [
          'Go through the catalogue’s list of patterns reading only the title and the first sentence (~8 min).',
          'Mark three you already implemented without knowing, for example "Idempotent Receiver" or "Write-Ahead Log".',
          'Open one of them and read only its problem and its solution (~4 min).',
          'Before designing the new system, write your 5-step template from memory.'
        ] },
        ex: {
          title: 'Guided design: a university room booking system',
          body: `New domain, same method. This is the complete exercise solved.
Read all of it before doing yours, to see the rhythm.

STEP 1 - CLARIFY (5 min)

Functional questions I ask:
  - Who books: students, lecturers or administrative staff?
  - Is a booking approved automatically or does someone review it?
  - Are there recurring bookings, for example every Tuesday of the term?
  - Can it be cancelled? Until when?
Non-functional questions:
  - How many rooms and how many users?
  - When is it used? Are there spikes at the start of term?
  - What happens if the system is down for an hour?

Answers I assume and write down:
  A1. 20,000 students, 1,200 lecturers, 400 rooms.
  A2. Students book with automatic approval if the room is free.
      Lecturers can book recurrently.
  A3. The peak is the first week of term and Mondays at 8:00,
      when the week's schedule opens.
  A4. An hour down is annoying, not critical. Target 99.5%.

STEP 2 - ESTIMATE (5 min)

  Bookings per day: 400 rooms x 8 useful slots = 3,200 slots/day.
  If 60% are taken: 1,920 bookings/day.
  1,920 / 86,400 s = 0.02 bookings per second. Nothing.
  But: on Monday at 8:00 the schedule opens. If 3,000 people
  come in within 10 minutes: 3,000 / 600 = 5 write req/s,
  with peaks of 50 req/s in the first minute.
  Reading the schedule: each user looks 5 times per visit.
  21,200 users x 2 visits/week x 5 = 212,000 reads/week
  = 0.35 req/s average, 30 req/s at the Monday peak.

  Conclusion: the total volume is small. The problem is not scale,
  it is concentration: everything happens in ten minutes a week,
  and everyone fights over the same rows.

  Storage: 1,920 bookings/day x 365 = 700,000 rows/year
  x 200 bytes = 140 MB/year. Irrelevant.

STEP 3 - HIGH-LEVEL DESIGN (15 min)

  [Browser] -> [Load balancer] -> [API x2] -> [PostgreSQL]
                                      |
                                      +-> [Email queue]

  Tables: app_user, room, booking, academic_block
  The key constraint is exactly the one you already know:
    EXCLUDE USING gist (room_id WITH =, period WITH &&)
  It is the same overlap problem as VetCare's appointment.
  That is transfer: the domain changed, the invariant did not.

STEP 4 - GO DEEPER (15 min) - the Monday peak

  Problem: 3,000 people try to book the same 400 rooms
  in the same minute. Almost all of them will fail.
  If each failure is a 500 error or a 30-second wait,
  the system looks down even though it is working.

  Decisions:
  1. The conflict is the normal answer, not a system error:
     409 with a problem details body and the three nearest
     free slots. The user retries with one click.
  2. I do not add an application lock or a queue:
     the EXCLUDE constraint already serialises per room.
     Two bookings for different rooms do not get in each other's way.
  3. Idempotency-Key on the POST: with 3,000 nervous people
     clicking the button twice, it is mandatory.
  4. Reading the schedule is cached for 10 seconds.
     Accepting 10 seconds of staleness is right
     because the 409 already covers the race case.
     This brings the 30 read req/s down to almost zero.

STEP 5 - BOTTLENECKS (5 min)

  - What breaks first: the PostgreSQL queue per popular room.
    With 200 people fighting for room A, they get serialised.
    Number: if each transaction takes 5 ms, 200 wait 1 second.
    Acceptable. From 2,000 per room it would need rethinking.
  - The bigger real risk: sending the confirmation email
    inside the transaction. That stretches it from 5 ms to 300 ms
    and multiplies the wait by 60. It goes to the queue. Outbox pattern.

TRADE-OFFS I DECLARE
  - I chose strong consistency for the booking and eventual for the
    email confirmation. Nobody complains about an email
    that arrives in 20 seconds; everyone complains about a double-booked room.
  - I chose not to build a waiting system or a priority list.
    It is complexity the university probably does not want.
    If it did, it would say so in step 1.`
        },
        steps: [
          'Choose a domain that is not VetCare and that you have never designed. Three good options: a URL shortener, a library book loan system, or a food order tracking app.',
          'Set a 45-minute timer and respect the exercise’s five time blocks. If you overrun in step 1, you run out of step 4, which is where the interview is won.',
          'Write the document by hand while you think, out loud if you can. Do not write it nicely afterwards: the goal is to practise thinking against the clock, not to produce a PDF.',
          'In step 4 choose the hard part yourself and say why you chose it: "I go deeper into X because it is where the invariant is that, if it breaks, leaves the system useless".',
          'When you finish, compare your document with the example’s and look for one thing only: how many of your decisions have a number behind them. If fewer than half, repeat step 2 more carefully.',
          'Note on a separate list the questions that left you blank. Those, together with the three from week 23, are your day 6 study plan.'
        ],
        vet: [
          'Mark explicitly in your document the three things you copied from VetCare without thinking: the overlap constraint, the 409 with alternatives and the idempotency key. They are your technical heritage, not coincidences.',
          'If your new domain does NOT need one of them, write why. Recognising when a pattern does not apply is worth more than always applying it.'
        ],
        edge: [
          'The most common mistake is starting to draw boxes in minute two. Without steps 1 and 2, the drawing is decoration: you cannot justify any box because you do not know the size of the problem.',
          'The second mistake is estimating with round numbers without saying where they come from. "I assume 20,000 students because it is a medium-sized university" is an estimate; "I assume a million users" with no source is a fantasy.',
          'Do not put microservices, Kafka or Kubernetes into a system of 0.02 writes per second. Mentioning big technology without the number that justifies it is the clearest sign of inexperience.'
        ],
        quiz: [
          { q: 'Why practise a different domain instead of polishing VetCare’s design further?', a: 'Because polishing VetCare improves your knowledge of the domain, and what will be evaluated is the method. Repeating the method in an unknown domain is the only way to check that what you know is transferable and not memorised.' },
          { q: 'In the rooms example, the total volume was tiny. So why was the design not trivial?', a: 'Because the difficulty came not from volume but from concentration and contention: all the traffic happens in ten minutes and everyone fights over the same rows. Scale and contention are different problems, and contention appears much earlier.' },
          { q: 'Which invariant of the rooms example is identical to one of VetCare’s, and what does that mean?', a: 'The non-overlap of a resource in time: a room cannot have two bookings that cross, just as a vet cannot have two appointments that cross. It means the EXCLUDE constraint with btree_gist you learned in week 10 was not a PostgreSQL trick for your project, it was the solution to a class of problem you will meet again.' },
          { q: 'Why did step 4 of the example decide NOT to use a queue for the bookings?', a: 'Because the database constraint already serialises access per room, and a queue would only add latency, one more piece to operate and an intermediate state to explain to the user. The queue was kept for the email, where asynchrony does help: it takes 300 ms out of the critical transaction.' }
        ],
        out: 'A 45-minute design document for a new domain, with the five steps, numbers in the decisions and declared trade-offs; plus a list of the questions that blocked you.',
        file: 'docs/design-practice-02.md'
      },
      {
        t: 'Evolving a contract without breaking whoever already uses it',
        obj: 'Change VetCare’s API so existing clients keep working, and know when a new version is due and when not.',
        why: 'Writing an API from scratch is easy. Changing it when there is a mobile app in production, a web dashboard and a client that integrated a year ago is where systems break. It is also the interview question that separates someone who has maintained something from someone who has only built.',
        study: { r: 1, what: 'Read the consumer-driven contracts article. About 15 minutes. Keep the central idea: your API does not have one correct shape, it has a set of expectations from real consumers, and breaking the contract is breaking a specific expectation, not violating an abstract rule.',
        pasos: [
          'Read "Evolving a Service: An Example" (~5 min): how a small change breaks a consumer.',
          'Read "Schema Versioning" and "Breaking Changes" (~5 min).',
          'Read "Consumer-Driven Contracts" with "Provider Contracts" and "Consumer Contracts" (~5 min).',
          'Read "Benefits" and "Liabilities" (~3 min).',
          'Classify possible changes to VetCare’s API in two columns: does not break (adding an optional field) and breaks (renaming a field).'
        ] },
        ex: {
          title: 'The catalogue of changes: what breaks and what does not',
          body: `COMPATIBLE CHANGES (you do not need a new version)

  Adding an optional field to the RESPONSE.
    Before: { "id": 1, "start": "..." }
    Now:    { "id": 1, "start": "...", "roomId": 7 }
    Why it does not break: a client that deserialises into a known
    type ignores what it does not expect. Unless it validates
    with a strict schema. That is asked, not assumed.

  Adding an OPTIONAL field to the request, with a default value.
    If the field is missing, the server uses the previous default.
    The old client never sends it and keeps working.

  Adding a new endpoint.
  Adding a new value to a list the client only displays.
  Relaxing a validation (accepting more than you accepted).

CHANGES THAT BREAK (you need a version or a migration)

  Removing or renaming a field of the response.
  Changing a field's type.
    "price": 1200      ->  "price": "1200.00"
    This breaks silently: the client does not fail,
    it calculates wrongly. It is the worst kind of breakage.
  Making a request field that was optional mandatory.
  Tightening a validation.
    If you used to accept phone numbers without a prefix and now
    reject them, you have just broken everyone who sent them like that.
  Changing the meaning of a value without changing its name.
    "status": "pending" starts to mean something else.
    There is no way for the client to detect it.
  Changing an HTTP status code.
    If 404 becomes 204, the client that treated 404
    as "does not exist" now thinks it succeeded.
  Changing the order of a list someone relied on
    without the order being documented.

THE PRACTICAL RULE
  When writing: be strict about what you accept.
  When changing: be conservative about what you remove.
  You can almost always add. Removing almost never comes free.

HOW A FIELD IS REALLY REMOVED (expand / contract again)

  It is the same pattern as week 10, applied to the contract.

  Phase 1 - EXPAND. Add the new field, leave the old one.
    { "vetId": 4, "vet": { "id": 4, "name": "..." } }
    Both coexist. Nobody breaks. Document the old one
    as deprecated in the OpenAPI:
      deprecated: true
      description: "Deprecated since 2026-11. Use vet.id.
                    Removed on 2027-02-01."

  Phase 2 - MIGRATE. Warn and measure.
    Count usage with a metric, as in week 22:
      deprecatedFieldCounter.Add(1,
        new TagList { { "field", "vetId" },
                      { "client", clientId } });
    Do not remove anything while that counter is not zero
    or you know exactly whom you are going to break.

  Phase 3 - CONTRACT. Remove the old field.
    Only when the counter has been at zero for weeks,
    or when you passed the announced date and warned
    the ones left by name.

WHERE TO PUT THE VERSION

  In the route:   /api/v1/appointments
    Obvious, cacheable, easy to route. Ugly to maintain
    if you have many routes. It is what most people choose.
  In a header:    Accept: application/vnd.vetcare.v2+json
    Conceptually cleaner. Easier to forget
    and harder to test by hand with the browser.

  VetCare's decision: version in the route, and I only bump
  the version when there is no compatible way to make the change.
  Declared goal: never reach v3.
  A new version is one more system to maintain,
  not an improvement.

WHAT IS NEVER PART OF THE CONTRACT
  Even if the client sees it, you did not promise:
  - The order of the JSON fields.
  - The exact text of an error message
    (if you promised anything, it is the problem details type field).
  - The specific value of an id (only its format: a UUID).
  - How long a request takes (that is the SLO, not the contract).`
        },
        steps: [
          'Open your docs/openapi.yaml from week 11 and mark each endpoint with who consumes it today: week 16’s web, the CLI, or nobody yet. An endpoint without a consumer is free; one with two consumers is an agreement.',
          'Choose a real change you want to make in VetCare. A good candidate: having the appointment response return the full vet object instead of only the id, because the frontend was making an extra request.',
          'Classify your change with the example’s catalogue. If it breaks, write the three expand/contract phases with specific dates before touching code.',
          'Implement phase 1 in src/VetCare.Api: add the new field without removing the old one, and mark the old one as deprecated in the OpenAPI with a removal date.',
          'Add the deprecated field usage counter with week 22’s Meter. Without measurement you will not be able to decide when to remove it and you will be stuck with the field forever.',
          'Write a test in tests/VetCare.Api.Tests that fails if the deprecated field disappears before the date. A comment in the code gets ignored; a red test does not.'
        ],
        vet: [
          'Add a "change policy" section to docs/api-contract.md with two lists, what you can change without warning and what you cannot, and the minimum notice promise (for example 90 days).',
          'Write a short ADR in docs/adr/ on the decision to version in the route and the goal of never reaching v3. It is exactly the kind of decision nobody remembers the reason for in six months.'
        ],
        edge: [
          'A type change is the most dangerous of all because it produces no error: the client keeps answering 200 and the numbers come out wrong. If you ever have to change a type, use a new field name, always.',
          'A client that validates the response with a strict schema breaks even when you add an optional field. That is why "adding never breaks" is false: it is "adding does not break tolerant clients". Ask before promising it.',
          'Keeping v1 and v2 in parallel doubles the tests, the bugs and the database migrations that have to serve both. The cost of a new version is not writing it, it is that two different contracts have to stay true over the same data.'
        ],
        quiz: [
          { q: 'Why is changing a number to a string in the response worse than removing the field entirely?', a: 'Because removing it produces a visible, immediate failure in the client, while changing the type lets the client keep answering 200 and calculate wrongly in silence. Noisy errors get fixed in hours; silent ones live for months and corrupt data.' },
          { q: 'What has to happen before the contract phase, and why is having warned not enough?', a: 'There has to be evidence that nobody uses the field, and only a real usage metric provides that. Warning proves you behaved correctly, not that the client read the notice; the counter proves the change is safe.' },
          { q: 'If an endpoint has no consumer yet, does anything change?', a: 'Yes: you can change it freely, because a contract exists between parties and there is no second party. That is why it is worth knowing who consumes each endpoint before discussing compatibility, instead of treating the whole API with the same rigidity.' },
          { q: 'Why is VetCare’s declared goal "never reach v3" instead of versioning freely?', a: 'Because each live version is one more contract that has to stay true over the same data, with its tests, its bugs and its shared migrations. Versioning is the way out when there is no compatible path, not a tool for regular use.' }
        ],
        out: 'Phase 1 of a contract change implemented, the old field marked as deprecated with a date, a usage counter and a change policy written.',
        file: 'docs/api-contract.md'
      },
      {
        t: 'Data: backups, restore and the right to be erased',
        obj: 'Prove you can recover VetCare’s data after a disaster, and decide how long you keep each thing.',
        why: 'A lost clinical history cannot be rebuilt: it does not exist anywhere else. This is the only category of failure a system does not recover from, and almost nobody practises it. Saying in an interview "I did a restore drill and it took 14 minutes" sets you apart immediately from someone who says "I have backups".',
        study: { r: 2, what: 'Read the introduction of PostgreSQL’s backup documentation and the pg_dump section. About 15 minutes. Notice the distinction between a logical dump and a file-level copy, and why point in time (PITR) exists. You do not need to configure PITR today.',
        pasos: [
          'Read the chapter introduction (~2 min): the three approaches to backup.',
          'Open the SQL Dump section from the index (~6 min): pg_dump, restoring and why it is a consistent snapshot.',
          'Skim "25.2. File System Level Backup" (~2 min).',
          'Read the introduction of "25.3. Continuous Archiving and Point-in-Time Recovery (PITR)" (~3 min): going back to a specific instant.',
          'Make a pg_dump of VetCare, drop the test database and restore it. Measure how long it takes.'
        ] },
        ex: {
          title: 'A disaster drill and a retention policy',
          body: `FIRST, THE UNCOMFORTABLE TRUTH
  A backup you have never restored is not a backup.
  It is a file you hope something from.
  The only thing that counts is how long it takes you to get
  the system back up. That is measured, not assumed.

TWO NUMBERS YOU MUST BE ABLE TO SAY

  RPO (Recovery Point Objective)
    How much data I can afford to lose, measured in time.
    If I back up every 24 h, my RPO is 24 h:
    in the worst case I lose a day of appointments and visits.
  RTO (Recovery Time Objective)
    How long I can take to be operational again.

  VetCare's decision:
    RPO = 1 hour   (daily full backup + continuous WAL)
    RTO = 2 hours  (documented manual restore)
  (If you do not configure WAL archiving, your real RPO is
   24 hours: write it like that, as the warning below says.)
  Justification: losing an hour of appointments can be rebuilt
  by calling people. Losing a day cannot.
  Two hours down in a clinic is serious but survivable;
  staff can work on paper for that time,
  and there is a written procedure for it.

THE DRILL (this is the day's exercise)

  1. Make the backup.
     docker compose exec -T db pg_dump -U vetcare -Fc vetcare \\
       > backups/vetcare-$(date +%F-%H%M).dump

     -Fc is its own compressed format: it allows restoring
     individual tables and is faster than plain SQL.
     -T is essential: without it, docker opens a terminal
     and the binary file comes out corrupted.

  2. Check that the backup says something.
     ls -lh backups/
     If the file weighs 4 KB and your database has data, it failed.
     A backup of suspicious size is the most common way
     of discovering months later that there was nothing inside.

  3. DESTROY. This is what almost nobody does.
     docker compose down -v
     The -v deletes the volume. The data is gone.
     If this scares you, that is exactly why
     you have to practise it now and not during the incident.

  4. Bring it up clean and start timing from here.
     date
     docker compose up -d --wait db
     (With a new volume, compose creates only the empty
      vetcare database by itself, through POSTGRES_DB. No need to create it.)

  5. Restore.
     cat backups/vetcare-2026-11-02-0300.dump | \\
       docker compose exec -T db pg_restore -U vetcare -d vetcare

  6. VERIFY with data, not with the absence of errors.
     SELECT count(*) FROM appointment;
     SELECT count(*) FROM pet;
     SELECT max(starts_at) FROM appointment;
     Compare with what you noted before destroying.
     Also check that the constraints came back:
       \\d appointment
     If ex_appointment_no_overlap is not there, you restored data
     without the rules that protect it. That is worse
     than not restoring, because it looks like it worked.

  7. Start the API and go into the application.
     A restore that does not end with "I logged in and saw my schedule"
     is not verified.

  8. date again. That number is your real RTO.
     Write it down. If it is greater than what you promised,
     you have two honest options: improve the procedure
     or change the promise.

RETENTION: not everything is kept the same way

  Data                 Keep         Why
  -------------------- ------------ ---------------------------
  Clinical history     permanent    professional obligation,
                                    and clinically useful at 10 years
  Invoices             10 years     typical tax obligation
  Past appointments    5 years      decreasing usefulness
  Refresh tokens       on expiry    week 18: no longer
                                    useful = no longer existing
  Access logs          1 year       investigating incidents
  Application logs     30 days      debugging, not archiving
  Data of an owner
  who asked for erasure see below

  General rule: data without a written reason
  to exist is a liability, not an asset.
  Every piece of data you keep is a piece of data you can leak.

ERASURE ON REQUEST, WITHOUT BREAKING THE ACCOUNTS

  An owner asks you to delete their data.
  You have a real conflict: their request is legitimate,
  and it is also legitimate for the 2026 invoice to keep existing.

  Solution: anonymise instead of cascading deletes.
    UPDATE owner
       SET name = 'Deleted owner',
           email = NULL,
           phone = NULL,
           address = NULL,
           anonymised_at = now()
     WHERE id = $1;          -- the owner's id (UUID), as a parameter

  The invoice keeps its amount, its date and its owner id.
  It can no longer identify a person.
  The pet's clinical history: a domain decision,
  not a technical one. Note it and say who should decide it
  (the responsible vet, not you).

  And what almost everyone forgets: the backups.
  If you delete today and restore last week's backup,
  the data comes back. That is why the erasure procedure
  has to include a note in the document:
  "anonymised data may reappear in a restore
  from before the anonymisation date;
  after restoring, the list of pending anonymisations
  recorded in the applied_anonymisation table is re-run."
  It is uncomfortable and it is the truth. Saying so is more professional
  than promising an erasure you cannot guarantee.`
        },
        steps: [
          'Before touching anything, run the verification counts and note them on paper. Without the previous state you cannot verify anything afterwards.',
          'Make the pg_dump and look at the file size. If it is suspiciously small, stop and find out why before going on.',
          'Do the complete drill, including docker compose down -v. Measure the real time from the destruction until you log into the application and see your schedule.',
          'Check that the constraints came back and not just the rows. Check ex_appointment_no_overlap specifically and try to create an overlapping appointment: it must give 409.',
          'Write docs/backups.md with your RPO, your promised RTO, your measured RTO, the numbered procedure and the retention table.',
          'Implement the anonymisation as a command or an admin-protected endpoint, with the applied_anonymisation table, and write a test that checks the invoice still exists afterwards.'
        ],
        vet: [
          'Add a link to the restore procedure to week 20’s docs/deployment.md, because the day you need it you will look in the deployment document.',
          'If your measured RTO is worse than the promised one, do not quietly adjust the document: write down the difference and a specific action to close it. It is the same habit as week 22’s postmortem.'
        ],
        edge: [
          'Restoring on the same machine where the live system is running is the classic way to turn a drill into a real incident. Restore into a database with another name or in another container, always.',
          'A logical dump with pg_dump captures a consistent instant, but not the following hour. If your RPO is one hour, you need the archived WAL, not just the dump; if you only have the daily dump, your honest RPO is 24 hours and you must write that.',
          'Backups have to be somewhere other than the server. A backup on the same disk protects against an accidental DROP TABLE but not against disk failure, ransomware or the hosting account being deleted.'
        ],
        quiz: [
          { q: 'What is the difference between RPO and RTO, and which of the two is usually more expensive to improve?', a: 'RPO is how much data you accept losing measured in time, and RTO is how long it takes you to be operational. Improving RPO is usually cheaper (backing up more often or archiving WAL), while improving RTO requires automating and rehearsing the procedure, which is continuous human work.' },
          { q: 'Why must verifying a restore include looking at the constraints and not just counting rows?', a: 'Because a restore that brings back the data without its constraints leaves the database in a state that looks correct and accepts invalid data from then on. The rows tell the past story; the constraints protect the future one, and losing them is silent damage.' },
          { q: 'Why is the owner anonymised instead of deleting their rows in cascade?', a: 'Because there are conflicting obligations: the person has the right not to be identifiable and the clinic has the obligation to keep invoices and history. Anonymising satisfies both: the link to a real person disappears and the accounting and clinical records are kept.' },
          { q: 'What problem do backups create for an erasure request, and what is the honest answer?', a: 'That restoring a backup from before the erasure makes the data reappear. The honest answer is to record the anonymisations applied in a table and re-run them as a mandatory step of the restore procedure, and to document that limitation explicitly instead of promising absolute erasure.' }
        ],
        out: 'A disaster drill completed with a measured RTO, docs/backups.md with procedure and retention, and the anonymisation implemented with its test.',
        file: 'docs/backups.md'
      },
      {
        t: 'Turning 24 weeks into evidence someone wants to read',
        obj: 'Leave VetCare’s repository in a state where a stranger understands in five minutes what you can do, without you explaining it.',
        why: 'Nobody is going to read your code. They will read the README, look at two or three documents and decide whether to keep going. All 24 weeks of work are worth what their front door is worth. And a repository that explains itself is the best technical calling card there is, because it shows exactly the skill that is most valued and least seen: communicating.',
        study: { r: 0, what: 'No new reading today. Instead, open your own repository as if it were someone else’s and spend 10 minutes reading it without fixing anything. Note the exact moment you would get lost if it were not yours. That point is what you will fix today.',
        pasos: [
          'Open your repository in the browser as if it were someone else’s.',
          'Read only the README for two minutes and write what you understood of the project.',
          'Browse for ten minutes without fixing anything and note the exact moment you would get lost.',
          'Order the fixes by what a reviewer will see first: README, folder structure and docs.'
        ] },
        ex: {
          title: 'The README structure and the evidence index',
          body: `THE README IS NOT DOCUMENTATION, IT IS A DOOR

  Rules:
  - The most important thing at the top. Nobody scrolls down.
  - It can be started in three commands.
  - Links to the deep documents, not their content.
  - No "work in progress" and no apologies.

TEMPLATE

  # VetCare

  A management system for a veterinary clinic:
  a schedule with no overlaps, clinical history, billing
  and a web dashboard. .NET 10, PostgreSQL 17, React + TypeScript.

  ## What it does, in one screen

  (a screenshot of the schedule. One. The best one.)

  - Schedule with a no-overlap guarantee at database level
  - Clinical history per pet with typed documents
  - Billing with composable price rules
  - Cookie authentication with refresh rotation
  - API documented with OpenAPI and RFC 9457 errors

  ## Start

      cp .env.example .env
      docker compose up -d
      # http://localhost:5173

  That is all. Migrations and sample data are applied
  on startup.

  ## How it is built

      src/VetCare.Domain          business rules, no dependencies
      src/VetCare.Application     use cases
      src/VetCare.Infrastructure  database, email, resilience
      src/VetCare.Api             HTTP endpoints
      web/                        React dashboard
      tests/                      unit, integration, architecture

  The business rules do not know the database.
  There is a test that checks it:
  tests/VetCare.Domain.Tests/ArchitectureTests.cs

  ## Decisions

  Every non-obvious decision is written down with its discarded
  alternative and its reason: [docs/adr/](docs/adr/)

  ## Documents

  | Topic          | Document                         |
  |----------------|----------------------------------|
  | Requirements   | docs/requirements.md             |
  | Model          | docs/domain-model.md             |
  | Architecture   | docs/architecture.md             |
  | API            | docs/api-contract.md             |
  | Security       | docs/security.md                 |
  | Performance    | docs/performance-report.md       |
  | Observability  | docs/observability.md            |
  | Deployment     | docs/deployment.md               |
  | Backups        | docs/backups.md                  |
  | Design at scale| docs/vetcare-at-scale.md         |
  | Postmortem     | docs/postmortem-01.md            |

  ## Status

  Done: schedule, patients, billing, auth, web dashboard.
  Not done on purpose: real payments, mobile app, multi-language.
  Known limit: a single API instance;
  the next limit is at ~500 req/s (docs/performance-report.md).

THE THREE MOST VALUABLE DOCUMENTS

  Of the 25 documents, three are the ones an interviewer
  does not expect to find and that make them change posture:

  1. docs/performance-report.md
     Because it has numbers before and after, and a section
     on "what I did NOT do and why". It shows judgement,
     not just ability.
  2. docs/postmortem-01.md
     Because it shows you separate cause from detection
     and do not look for culprits. It is operational maturity.
  3. docs/adr/
     Because it shows you know that a decision without
     a discarded alternative is not a decision.

  If you had time to polish only three things, these are them.

TWO STORIES YOU MUST HAVE READY

  Format: Situation, Task, Action, Result.
  Two minutes each. No unnecessary jargon.

  Story 1 - performance (from week 21)
    S: the schedule took 2.4 seconds at p95 with a year
       of data loaded.
    T: get it under 400 ms without rewriting the application.
    A: I measured first with pg_stat_statements instead of guessing.
       My intuition said it was the frontend; it was a
       sequential scan on a date filter without an index.
       I added a partial index, removed an N+1 with a projection
       and cached the vets catalogue. Nothing more.
    R: p95 from 2,400 ms to 180 ms. I documented what I decided
       NOT to optimise and from what load it would be needed.

  Story 2 - incident (from week 22)
    S: patient search started giving intermittent
       errors in simulated production.
    T: find the cause and stop it happening again.
    A: the trace showed 782 ms of 842 in a single SELECT
       with ILIKE and no index, which exhausted the connection pool
       and made unrelated requests fail.
       I mitigated with a rollback first and fixed it afterwards with
       a GIN index. I wrote the postmortem separating
       cause actions from detection actions.
    R: the error dropped to zero and I added a pool saturation
       alert, which was what was really missing:
       the problem was not the index, it was that we did not see it.

  Notice that neither story says "I learned a lot".
  Both say a number and a decision.`
        },
        steps: [
          'Rewrite the whole README with the template. The most important thing at the top, start in three commands, links instead of content, a single screenshot and a good one.',
          'Do the stranger test for real: clone the repository into a new directory, follow your own README to the letter without using anything you know by heart, and note every step that fails or that you had to guess. Fix the README, not your memory.',
          'Check that the 25 documents exist and none is half-finished. A document with a heading and a "TODO" below it subtracts more than a missing document.',
          'Polish the three most valuable documents: the performance report, the postmortem and the ADRs. Make sure each ADR has a discarded alternative and a reason.',
          'Write your two stories in the situation, task, action and result format, and tell them out loud against the clock. Two minutes each. If you go over three minutes, there is too much context.',
          'Add the status section with what is done, what is not done on purpose and the known limit. Declaring what is missing generates more confidence than pretending everything is there.'
        ],
        vet: [
          'Check that every claim in the README has proof in the repository. If you say "the business rules do not know the database", the architecture test has to exist and pass; if not, you are writing wishes.',
          'Put in the README the link to the OpenAPI and a screenshot of the observability dashboard. What is seen is believed; what is claimed is doubted.'
        ],
        edge: [
          'An out-of-date screenshot does more harm than no screenshot, because the first thing the reader checks is whether what they see matches what starts up.',
          'Do not list technologies as if they were achievements. "Uses Redis" says nothing; "I cached the vets catalogue because it changes once a month and was read on every request" says you understand why.',
          'Do not write in the README’s first line that the project is a learning exercise. That it is a study project shows by itself; starting with an apology makes the reader read the rest with a different expectation.'
        ],
        quiz: [
          { q: 'Why does the README matter more than code quality for someone to value your work?', a: 'Because it is the only thing almost everyone will read: it decides in the first minute whether someone keeps looking. Excellent code nobody opens communicates nothing, and communicating is part of the job, not an extra.' },
          { q: 'What do the three most valuable documents have in common, and why do they surprise?', a: 'All three show judgement and not just ability: the performance report says what you decided not to do, the postmortem separates the cause from the lack of detection, and the ADRs record the discarded alternative. They surprise because almost every study project shows something works, and almost none shows that a choice was made between options.' },
          { q: 'Why is the clean clone test essential even if you know the project starts?', a: 'Because your machine has state, variables and habits the README does not mention, and your memory fills in the gaps without you noticing. Only a fresh clone followed literally reveals the steps that are in your head and not in the document.' },
          { q: 'Why does declaring what you did NOT do increase confidence instead of reducing it?', a: 'Because it distinguishes a gap from carelessness from a decision with a known limit, and that is exactly what marks someone with judgement. A project that says "I did not implement real payments and the next limit is at 500 req/s" shows it knows its own system better than one that mentions no limit.' }
        ],
        out: 'A README that works as a front door, checked with a clean clone, the three key documents polished and two two-minute stories rehearsed.',
        file: 'README.md'
      },
      {
        t: 'Interview rehearsal: explaining out loud what you already know',
        obj: 'Go from knowing to being able to explain it under pressure, in the language of whoever asks and in the time you are given.',
        why: 'The previous 23 weeks built knowledge. Today you practise the only skill that makes it visible. There is a huge distance between understanding something and explaining it in ninety seconds to someone who does not know your project, and that distance is only closed by speaking out loud, never by reading.',
        study: { r: 3, what: 'Read the postmortem culture chapter of the SRE book, especially the part on how a failure is told without looking for culprits. About 15 minutes. It helps you with the question "tell me about a mistake you made", which most people answer badly by wanting to sound infallible.',
        pasos: [
          'Read "Google’s Postmortem Philosophy" (~5 min): blameless, focused on the system.',
          'Read "Collaborate and Share Knowledge" (~4 min).',
          'Read "Introducing a Postmortem Culture" (~4 min).',
          'Prepare your answer to tell me about a mistake you made with the structure of a postmortem: what happened, impact, cause, what you changed.'
        ] },
        ex: {
          title: 'A bank of questions with answers that really work',
          body: `HOW TO ANSWER A TECHNICAL QUESTION OUT LOUD

  1. Answer in one sentence. The answer first.
  2. Give the why in two or three sentences.
  3. Give the trade-off or the limit. This is what sets you apart.
  4. Stop talking.

  The most common mistake is building context for a minute
  before answering. Whoever asks does not know whether you know it
  until you say it, and starts to doubt.

PROJECT QUESTIONS

Q: Tell me about your project in two minutes.
A: VetCare is a management system for veterinary clinics.
   The central invariant is that a vet cannot have
   two appointments that overlap, and that is guaranteed by the database
   with an exclusion constraint, not by application code.
   That is where the interesting decision is: I validated in memory first
   and discovered that two simultaneous requests slipped through,
   because there is a window between the SELECT and the INSERT.
   I moved it to the database and I translate the violation error
   into a 409 with problem details.
   Around that there is clinical history, billing,
   an API with OpenAPI and problem details, and a React dashboard.
   Everything starts with docker compose up.

   Why it works: it names an invariant, tells one of your own mistakes,
   explains the fix and ends in something runnable.

Q: What is the hardest thing you solved?
A: That "slow" and "down" are the same thing for the user.
   I had a search with ILIKE and no index that took 800 ms.
   It looked like a speed problem on one screen,
   but it exhausted the connection pool and made
   requests from other parts of the system fail.
   I found it with a distributed trace, not by reading code:
   782 ms of 842 were in a single SELECT.
   What struck me most was not the GIN index,
   it was that we had no pool saturation alert.
   Fixing the cause took ten minutes;
   the detection fix was the one really missing.

Q: What would you do differently if you started again?
A: Measure first. I spent time optimising the frontend
   by intuition and the problem was in a query.
   Now I do not touch performance without a prior number.
   And I would write ADRs from day one:
   I started them in week 15 and had to rebuild
   the five earlier decisions from memory.

Q: How do you know your code works?
A: At three levels with different purposes.
   Unit tests on the domain rules with test doubles,
   which run in milliseconds and tell me if I broke a rule.
   Integration with the real database in Testcontainers,
   because constraints and transactions can only
   really be tested against PostgreSQL.
   And an architecture test that fails if the domain
   references the infrastructure, because a rule
   that only lives in a document gets broken within three months.

SHORT CONCEPTUAL QUESTIONS

Q: Difference between authentication and authorisation.
A: Authentication is who you are, authorisation is what you can
   do. They get confused because they go together, but they fail differently:
   an authentication failure is letting a stranger in,
   an authorisation failure is letting a legitimate user
   see the history of someone else's pet. The second
   is more common and harder to detect.

Q: What is idempotency and why do you care?
A: That repeating the same operation does not change the result.
   I care because on a network you do not know whether your request
   did not arrive or arrived and the response was lost.
   Without idempotency you cannot retry, and without retries
   you have no resilience. In VetCare the appointment POST
   accepts an Idempotency-Key and stores the response
   of the first execution.

Q: Why don't you put an index on every column?
A: Because every index is maintained on every write
   and takes space, so it speeds up reads and slows down
   writes. They are added per measured query,
   not just in case. In my case I put a partial one
   on future appointments because 95% of queries
   only look forward.

Q: When would you use NoSQL?
A: When I do not need transactions across entities
   or queries by relationships, and access is by key.
   In VetCare that is not the case: an appointment touches vet,
   pet and invoice in the same operation, and I need
   an overlap constraint. Choosing NoSQL there would mean
   reimplementing in code what the database gives me for free.

THE QUESTION MOST OFTEN FAILED

Q: What don't you know?
A: Tell the truth with structure, do not hide.
   "I have not operated a system with real user traffic.
   I simulated load and incidents and wrote runbooks,
   but I know the pressure of a real on-call shift
   is not the same. I also know my deployment
   experience is with compose, not with Kubernetes."
   This builds confidence. Saying you know everything
   costs you as soon as they ask the second question.

REHEARSAL RULES
  - Out loud. Thinking it does not count: the mouth stumbles
    where the head was flowing.
  - Against the clock. Two minutes for the project, ninety seconds
    for the conceptual ones.
  - Record yourself once. It is uncomfortable and it is the exercise
    that improves you fastest: you will hear all the filler words
    and the places where you do not know how to finish.`
        },
        steps: [
          'Answer the four project questions out loud and against the clock, without reading. If you get stuck, do not reread the model answer: note in one word what you were missing and repeat.',
          'Record yourself answering the project question in two minutes. Listen once. Count how many times you start a sentence without knowing how it ends.',
          'Take the five conceptual questions and answer them with the four-step structure: answer, why, trade-off, silence. The fourth step is the one that needs practice.',
          'Add to the bank the three questions that left you blank in week 23 and yesterday’s, and write your own answer for each. What blocked you is your material, not a generic list.',
          'Prepare your answer to "what don’t you know" in writing. Two real gaps, named, with no excuses and without dramatising them.',
          'If you can, ask someone to ask you three questions from the list without telling you the order. The difference between answering what you expected and what you are asked is half the exercise.'
        ],
        vet: [
          'Check that every claim in your answers is true today in your repository. If you say there is an architecture test, open it and run it; a claim that does not survive the second "show me" costs more than not having made it.',
          'Add at the end of docs/architecture.md a paragraph on "how I explain this system in two minutes". The day you need it you will not have time to rebuild it.'
        ],
        edge: [
          'Memorising answers word for word shows and breaks with the first follow-up question. Memorise the structure and the numbers; the sentences come out differently every time and that is fine.',
          'Telling one of your own mistakes only works if it includes what you changed afterwards. Without the correction, the story is a confession; with it, it is evidence that you learn.',
          'Talking for more than two minutes without being interrupted is almost always a bad sign: it means the listener stopped following you. Finish and let them ask.'
        ],
        quiz: [
          { q: 'Why do you answer first and give the context afterwards?', a: 'Because whoever asks does not know whether you know the answer until you say it, and a minute of prior context is interpreted as you buying time. Answer, why, trade-off and silence keeps you in control of the conversation.' },
          { q: 'What turns "tell me about a mistake" into a good answer instead of a confession?', a: 'That it includes the later change in behaviour and, if there is one, a number. "I optimised by intuition and got it wrong, now I do not touch performance without measuring first" is evidence of learning; the same mistake without the correction is just a declared weakness.' },
          { q: 'Why is the third step, the trade-off, the one that most distinguishes an answer?', a: 'Because anyone can repeat the definition of a concept, but saying when you would not use it shows you have applied it and seen its cost. It is the difference between having read about indexes and having maintained a table with too many.' },
          { q: 'Why practise out loud and not in your head?', a: 'Because explaining uses a different skill from understanding, and it fails in places where the thinking was flowing: ordering the idea, choosing words and finishing the sentence. Only by speaking do you discover where it breaks, and recording yourself speeds that up more than any other technique.' }
        ],
        out: 'Your own bank of questions with your answers, four project answers rehearsed against the clock, a recording listened to and your honest answer to "what don’t you know".',
        file: 'docs/interview-bank.md'
      },
      {
        t: 'Final exam: a 45-minute design, an audit and a plan for the next six months (weekly exam)',
        obj: 'Show in a single session that the method is yours, that the repository stands on its own and that you know what to study next.',
        why: 'A course that ends without an exam does not end: it is abandoned. Today you close the 24 weeks with a test that cannot be passed by reading, an audit that separates what you think you have from what is really there, and a plan that avoids the void of next week, which is when almost everyone loses momentum.',
        study: { r: 0, what: 'No new reading. Before starting, open the list of questions that blocked you during weeks 23 and 24. Spend 10 minutes looking for the answer to ONE of them, the one it bothers you most not to know. That is the first entry of your study plan.',
        pasos: [
          'Open the list of questions that blocked you in weeks 23 and 24.',
          'Choose just one, the one it bothers you most not to know, and look for its answer for ten minutes.',
          'Write down what you found and from which source: it is the first entry of your study plan.',
          'Get a clock, paper and the clean repository ready before starting the exam.'
        ] },
        ex: {
          title: 'The three parts of the final exam',
          body: `PART 1 - A 45-MINUTE DESIGN WITHOUT HELP (45 min)

  Choose a prompt you have not touched.
  Three options of increasing difficulty:
    A. A city bike rental system.
    B. A course platform with video and progress.
    C. A multi-channel notification system
       (email, SMS, push) for several applications.

  Strict rules:
    - 45 minutes on the clock. When it rings, you stop.
    - Without consulting your documents or the internet.
    - The five steps with their times: 5 / 5 / 15 / 15 / 5.
    - Everything written. Nothing "thought".

  Rubric. You score yourself, honestly:

    [ ] I asked at least 4 questions before designing
    [ ] I wrote my assumptions as assumptions
    [ ] I estimated traffic with a visible calculation
    [ ] I estimated storage for one year
    [ ] Each estimate ends in a one-line conclusion
    [ ] I drew the architecture with fewer than 8 boxes
    [ ] I justified each piece with a number or removed it
    [ ] I chose the hard part and said why
    [ ] I went deeper into a specific write flow
    [ ] I dealt with a race condition explicitly
    [ ] I said what consistency each piece of data needs
    [ ] I named what breaks first and at what load
    [ ] I declared at least 3 trade-offs
    [ ] I mentioned no technology without justifying it

  12 out of 14 or more: the method is yours.
  8 to 11: you are missing clock discipline, not knowledge.
  Fewer than 8: repeat the exercise with another prompt
  before moving on. It is not a failure, you are missing
  repetitions; this is the third design of your life.

PART 2 - REPOSITORY AUDIT (30 min)

  Go through the list. Each line is only ticked if it exists
  AND passes AND you have just checked it now, not from memory.

  Startup
    [ ] clean clone + docker compose up works
    [ ] the README does not lie in any step
    [ ] .env.example has every variable
    [ ] there is no real secret in the repository

  Code
    [ ] dotnet build with no new warnings
    [ ] dotnet test all green
    [ ] npx tsc -b with no errors
    [ ] dotnet format --verify-no-changes passes
    [ ] the architecture test exists and passes
    [ ] no TODOs or dead commented-out code left

  Data
    [ ] migrations applied from scratch work
    [ ] ex_appointment_no_overlap exists and you tested it
    [ ] the restore drill is documented
        with a measured RTO
    [ ] retention is written per kind of data

  Security
    [ ] dotnet list package --vulnerable: clean
    [ ] npm audit --omit=dev: clean
    [ ] the security headers are active
    [ ] an owner cannot see another owner's pets
        (check it with two real users)
    [ ] the logs contain no personal data

  Operations
    [ ] CI green on the main branch
    [ ] traces visible in the dashboard
    [ ] the four golden signals exist in a dashboard
    [ ] the runbook is written and can be followed

  Documents
    [ ] the 25 documents exist and none is half-finished
    [ ] every ADR has a discarded alternative and a reason
    [ ] the performance report has before and after
    [ ] the postmortem separates cause from detection

  Every unticked box is a task, not a moral failing.
  Write them in a list and order them by what most
  affects someone who arrives at the repository tomorrow.

PART 3 - PLAN FOR THE NEXT SIX MONTHS (20 min)

  Not "keep studying". That is not a plan.

  Template:

  ## What I can already do
  (three sentences. No false modesty and no inventing.)
  Design a medium-sized system with estimates.
  A production API with tests, resilience,
  security and observability. Operate what I wrote:
  measure, diagnose, roll back and document.

  ## My three real gaps
  (from the list of questions that blocked you)
  1. ...
  2. ...
  3. ...

  ## What I do with each gap
  Gap 1: [specific resource] + [something I build with it]
  Gap 2: ...
  Gap 3: ...
  Rule: each gap is closed by building something,
  not by reading. A gap whose plan is "read a book"
  is still open in June.

  ## A new project, not VetCare
  VetCare already showed what it had to show.
  The second project must force something VetCare
  did not force on you. Good options:
    - Something real-time (WebSockets, presence)
    - Something with lots of concurrent writes
    - Something with batch data processing
    - Something mobile, if you want to go that way
  Choice: ...
  Why: it forces me to ...

  ## Cadence
  Realistic hours per week: ...
  Specific days: ...
  How I know I am on track: one visible deliverable a month.
  Not "hours studied": deliverables.

  ## Review date
  In 8 weeks I come back to this document
  and update it with what really happened.
  (Put it in the calendar today. A plan without a review
   date is a wish list.)

WHAT YOU HAVE JUST FINISHED

  24 weeks. 144 days. A system that:
  - captures requirements and turns them into a model
  - has isolated, verified business rules
  - persists in a relational database with real invariants
  - exposes an API with a contract, errors and versioning
  - is tested at three levels and withstands others' failures
  - has a UI that feels fast
  - authenticates and authorises end to end
  - builds and deploys itself
  - is measured, observed and diagnosed
  - is backed up, restored and can evolve
  - and is explained so someone else can understand it

  Almost nobody who calls themselves a junior developer
  can say that about any project of their own.
  What you are missing is not knowledge: it is repetitions
  and real traffic. And that only comes from building
  the next thing, which starts next week.`
        },
        steps: [
          'Do part 1 now, in one go, with the clock running and without consulting anything. If you skip this part, the exam does not exist: it is the only part that cannot be passed with what you already have written.',
          'Score yourself with the 14-point rubric being hard on yourself. Ticking a box you did not meet only robs you of the information the exercise was going to give you.',
          'Do the audit checking each line on the spot, running the commands. What you remember working three weeks ago does not count.',
          'Turn each unticked box into a specific task, ordered by impact for someone arriving at the repository tomorrow.',
          'Write the six-month plan with the template, with a specific resource and something built per gap, the new project chosen and justified, and the cadence in real days of your week.',
          'Put the plan’s review date in the calendar today, eight weeks from now. It is the only step in the whole course that protects you from losing momentum.'
        ],
        vet: [
          'Make a final commit with the message "wrap-up: audit, backups and continuation plan" and tag the state with git tag -a v1.0.0 -m "VetCare complete: 24 weeks". A fixed point you can come back to.',
          'Add a link to the continuation plan in the README. It shows you know what you do not know, and that is part of the technical work.',
          'Press "Mark for review" and reread docs/next-steps-plan.md in a week.'
        ],
        edge: [
          'Skipping part 1 out of tiredness is the most common way to finish the course without knowing whether you learned. It is the only exercise that measures method and not memory.',
          'An audit done from memory is worse than none: it leaves you with the false confidence that everything is there and you discover the gaps when someone else finds them.',
          'A six-month plan with more than three gaps is not ambition, it is dispersion. Three closed are worth more than ten started, and the plan has to fit your real week, not the ideal one.'
        ],
        quiz: [
          { q: 'Why is the 45-minute design without consulting anything the part that cannot be skipped?', a: 'Because everything else you have is evidence of accumulated work, and this is the only proof that the method works in your head without support. It measures exactly what you will be evaluated on: thinking against the clock in an unknown domain.' },
          { q: 'Why does the audit require checking each point on the spot instead of remembering it?', a: 'Because a repository changes and memory is optimistic: what passed three weeks ago may have broken with any later change. A box ticked from memory produces false confidence, which is worse than a known gap.' },
          { q: 'Why must each gap in the plan be closed by building and not by reading?', a: 'Because reading produces recognition and building produces ability, and in an interview or at work they ask for the second. A gap whose plan is "read a book" is easy to spot: it is still open six months later and sounds identical to when you wrote it.' },
          { q: 'Why should the next project not be an extension of VetCare?', a: 'Because VetCare already showed what it could show and adding more features only repeats skills you already have. A project that forces you into something new, such as real time or highly concurrent writes, generates learning; one that keeps you comfortable generates volume.' },
          { q: 'Summarise what you learned this week in one sentence.', a: 'That finishing a system is not making it work, but leaving it able to change without breaking anyone, to survive losing its data and to be understood by someone else without you; and that my own knowledge follows the same rule: it only counts when I can explain it out loud, with a number and a trade-off, about a problem I had never seen.' }
        ],
        out: 'The 45-minute design scored with the rubric, the complete audit with its list of pending tasks, docs/next-steps-plan.md written and the v1.0.0 tag created.',
        file: 'docs/next-steps-plan.md'
      }
    ]
  }
]);
