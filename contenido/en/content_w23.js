window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 23,
  phase: 'System design',
  title: 'System design I: estimate, scale and choose',
  idea: 'VetCare works for one clinic. This week you ask yourself what would happen with two hundred, and you discover that the answer is not improvised: it is estimated. System design is not drawing pretty boxes, it is doing four multiplications that tell you whether you need one database or twenty, and then choosing between options knowing that each one costs something. This week you learn the method: clarify requirements before designing, estimate with order-of-magnitude numbers, understand why you cannot have consistency and availability at the same time when the network fails, and know when scaling means adding a machine and when it means splitting the data. By the end you will be able to hold an hour-long design conversation without going blank.',
  res: [
    { t: 'Martin Fowler — Microservices and the Monolith First', u: 'https://martinfowler.com/bliki/MonolithFirst.html', note: 'Short and very useful. It argues why starting with a monolith is usually the right decision, which is the opposite of what people assume is expected.' },
    { t: 'Wikipedia — CAP theorem', u: 'https://en.wikipedia.org/wiki/CAP_theorem', note: 'Read only the definition and the criticisms. The important thing is understanding that the choice only appears when there is a network partition, not all the time.' },
    { t: 'AWS — Caching best practices and CDN', u: 'https://aws.amazon.com/caching/best-practices/', note: 'It explains the cache layers of a real system and where each one fits. Conceptually it is vendor-independent.' },
    { t: 'PostgreSQL — High Availability, Load Balancing and Replication', u: 'https://www.postgresql.org/docs/current/high-availability.html', note: 'The official view of replication in your engine. You use it to talk precisely instead of saying "I add replicas".' },
    { t: 'System Design Primer — How to approach a system design question', u: 'https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question', note: 'The four-step method so you do not start by drawing boxes.' },
    { t: 'Latency numbers every programmer should know', u: 'https://gist.github.com/jboner/2841832', note: 'The classic table of orders of magnitude.' },
    { t: 'Eric Brewer — CAP Twelve Years Later: How the Rules Have Changed', u: 'https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/', note: 'The author of the CAP theorem explains why choosing 2 of 3 is misleading.' }
  ],
  days: [
    {
      t: 'The method: clarify before designing',
      obj: 'Learn the structure of a system design interview and practise the questions you have to ask before drawing anything.',
      why: 'Most candidates start drawing boxes in the first minute and fail by solving a problem nobody asked them. The method is what is evaluated, more than the specific solution.',
      study: { r: 4, what: 'Read the "How to approach a system design interview question" section of the System Design Primer. About 10 minutes. Keep the steps: use cases and constraints, high-level design, core components and scaling. Look for one thing: how much time is spent asking before drawing the first box.',
        pasos: [
          'Read "Step 1: Outline use cases, constraints, and assumptions" (~3 min) and copy its questions.',
          'Read "Step 2: Create a high level design" and "Step 3: Design core components" (~3 min).',
          'Read "Step 4: Scale the design" (~2 min).',
          'Read "Back-of-the-envelope calculations" (~2 min): the links you will see tomorrow.',
          'Write your 5-step template with the clarifying questions you would ask for VetCare at scale.'
        ] },
      ex: {
        title: 'The five steps and the questions for each',
        body: `STEP 1 - Clarify requirements (5 min of 45). Do not skip it.

Functional: what must it do?
  - Who are the users? (reception, vet, owner?)
  - Which operations are essential for version 1?
  - What is explicitly out of scope?

Non-functional: within what limits?
  - How many users? How many clinics?
  - Reads versus writes: what proportion?
  - What latency is acceptable?
  - Can it be a few seconds out of date or not?
  - Is there regulated data? (clinical history: yes)

STEP 2 - Estimate (5 min). Order-of-magnitude numbers.
  Without this, everything you say afterwards is decoration.

STEP 3 - High-level design (15 min). Boxes and arrows.
  Clients -> load balancer -> API -> database
  And the queue or cache only if the estimate justifies them.

STEP 4 - Go deeper (15 min). The interviewer chooses.
  Data schema, the critical endpoint, how the piece that
  breaks first scales.

STEP 5 - Bottlenecks and trade-offs (5 min).
  What breaks first, what you would do then, what you have sacrificed.

--- Example: VetCare for 200 clinics ---

Questions I would ask before drawing:
  1. Do clinics share data or are they isolated?
     (it changes EVERYTHING in the design: multi-tenant or instances)
  2. Can an owner see their pet's history?
     (yes = external users = 100x more traffic and more security)
  3. Do they need to work without internet?
     (yes = offline sync = a whole other project)
  4. Is there integration with labs or external billing?
  5. What happens if the schedule is 10 seconds out of date?

Assumptions I write down because nobody answers me:
  - Data isolated per clinic, not shared.
  - Clinic staff only, no owner access in v1.
  - Requires internet.
  - The schedule must be consistent instantly: a double booking
    is a real business error, not an annoyance.`
      },
      steps: [
        'Learn the five steps and their approximate times. They are the script that saves you from going blank: if you do not know what to say, you go back to the step you were on.',
        'Take the prompt "design VetCare for 200 clinics" and write the five questions you would ask before drawing anything. Then write the assumptions you would make if nobody answers. That list is your safety net.',
        'Repeat the exercise with a different prompt, for example a URL shortener or a restaurant booking system. Only step 1: questions and assumptions. Ten minutes each.',
        'Write in docs/system-design.md your personal step 1 template: the questions you will always ask, split into functional and non-functional. Having your own template removes the panic of minute one.',
        'Practise step 1 for VetCare out loud for three minutes as if you had an interviewer in front of you. The discomfort of the exercise is exactly what makes it useful.'
      ],
      vet: [
        'Decide and write the answer to the most important question for VetCare: multi-tenant in a shared database with a clinic filter, or one database per clinic. Note three advantages and three drawbacks of each.',
        'Reread your week 15 ADRs. You will see that an ADR and step 5 of a design interview are the same exercise: options, choice and consequences.'
      ],
      edge: [
        'Drawing before asking is the most common and most penalised mistake. A technically brilliant design for the wrong problem scores worse than a simple design for the right problem.',
        'Do not answer "it depends" and stop there. Say what it depends on, choose an option with an explicit assumption and carry on. The interviewer wants to see you decide, not see you hesitate.',
        'Proposing microservices without the scale justifying it is a red flag for an experienced interviewer. Your week 15 modular monolith is the right answer much more often than people think.'
      ],
      quiz: [
        { q: 'Why is the first step clarifying requirements and not drawing?', a: 'Because the prompt is always ambiguous on purpose and there are several different systems that would meet it. Without narrowing down users, volume and constraints you can design something correct for a problem nobody asked you, which is the most penalised mistake.' },
        { q: 'What is the MonolithFirst argument?', a: 'That you do not know the real boundaries of the modules until you have built the system and watched it evolve, so splitting it into services at the start produces wrong boundaries that are very expensive to move later. It is easier to extract a service from a well-modularised monolith than to bring together badly cut services.' },
        { q: 'What do you do if the interviewer does not answer one of your questions?', a: 'You make a reasonable assumption, say it out loud and keep designing on top of it. Leaving the decision up in the air blocks the rest of the conversation, and an explicit assumption can always be revisited later.' },
        { q: 'Why does the question of whether clinics share data change the whole design?', a: 'Because it determines the data model, isolation, security and the way to scale: with isolated data you can spread clinics across different databases easily, and with shared data you need tenant filtering in every query and a single schema that grows with everyone.' }
      ],
      out: 'Personal step 1 template written, two prompts practised and VetCare’s multi-tenancy decision documented.',
      file: 'docs/system-design.md'
    },
    {
      t: 'Estimating: the numbers you should know by heart',
      obj: 'Calculate VetCare’s traffic, storage and bandwidth at scale, and know the reference magnitudes by heart.',
      why: 'It is the step that separates a vague answer from a grounded one. Saying "with 200 clinics it is about 60 requests per second at peak, which fits comfortably on one server" completely changes the tone of the conversation.',
      study: { r: 5, what: 'Read the table and memorise the orders of magnitude: memory, SSD, disk and network. About 12 minutes. Do not memorise exact figures, memorise the ratios: reading from memory is about a thousand times faster than a random SSD read, and a round trip between continents is about a thousand times slower than that SSD read.',
        pasos: [
          'Read the full table (~3 min).',
          'Calculate the ratios yourself: Main memory reference (100 ns) versus Read 4K randomly from SSD (150 us), and that read versus a round trip between continents (150 ms).',
          'Look at the "Typical Latency Comparison (Latest x86 Processors)" chart, further down the page (~2 min).',
          'Write from memory, without looking, the five orders of magnitude and then check.',
          'Use those numbers to estimate how many requests per second VetCare makes with 200 clinics.'
        ] },
      ex: {
        title: 'A complete estimate of VetCare at 200 clinics',
        body: `--- Reference numbers (by heart) ---
  Memory reference ......... 0.1 microseconds (100 ns)
  Read 1 MB from memory .... 250 microseconds (classic table;
                             much less today)
  SSD, random 4K read ...... 150 microseconds
  Read 1 MB from SSD ....... 1 millisecond
  Network round trip, same DC 0.5 milliseconds
  Intercontinental round trip 150 milliseconds
  A modest server .......... thousands of requests/s if they are simple
  PostgreSQL, one instance . thousands of writes/s with a good schema

  A year has ~31.5 million seconds (remember 30M).

--- 1. Users and traffic ---
  200 clinics x 5 employees = 1,000 users
  Active at once at peak hour: ~30% = 300
  Actions per active user: ~1 every 20 s = 0.05 req/s
  => 300 x 0.05 = 15 req/s average at peak

  Peak over average: x4  => 60 req/s
  Reads versus writes: 90/10
     54 reads/s, 6 writes/s

  CONCLUSION: 60 req/s. A single server is more than enough. Nothing
  exotic is needed. Saying it like that is worth more than drawing ten boxes.

--- 2. Storage ---
  Appointments: 200 clinics x 25 appointments/day x 250 days = 1.25M a year
  Appointment row ~ 300 bytes => 375 MB a year
  Visits with notes ~ 2 KB => 2.5 GB a year
  Pets: 200 x 2,000 = 400,000 x 500 B = 200 MB

  Structured data: ~3 GB a year. In 5 years, 15 GB.
  CONCLUSION: it fits in one instance without thinking about it.

  Images (X-rays): 200 x 5/day x 250 x 2 MB = 500 GB/year
  CONCLUSION: this does NOT go in the database. It goes in
  object storage, and the database stores the URL.

--- 3. Bandwidth ---
  Schedule response ~ 20 KB
  54 reads/s x 20 KB = ~1 MB/s = 8 Mbps
  CONCLUSION: trivial. Images dominate and go through a CDN.

--- 4. Memory for a cache ---
  Hot data: today's schedule for each clinic
  200 x 25 appointments x 300 B = 1.5 MB
  CONCLUSION: it fits entirely in memory. If a cache were needed,
  it would be ridiculously small.

--- OVERALL CONCLUSION ---
  At this scale the system is simple: an API server with a
  replica for availability, one PostgreSQL with a read
  replica if needed, and objects + CDN for images.
  The interesting part is not the scale: it is the isolation between
  clinics and the consistency of the schedule.`
      },
      steps: [
        'Memorise the table’s orders of magnitude. Not the exact figures: the ratios. What you must be able to say without thinking is that reading from memory is about a thousand times faster than a random SSD read and that a hop between continents costs more than a hundred milliseconds.',
        'Make your own estimate of VetCare for 200 clinics without looking at the example. Compare afterwards. The differences are not mistakes: they are different assumptions, and the important thing is that yours are written down.',
        'Repeat the estimate for 5,000 clinics and see what changes. You will find the exact point where a single database stops being enough, and that point is the answer to "when would you scale".',
        'Estimate the image storage and calculate the approximate monthly cost. It is the number that justifies why images do not go in the database, and being able to say it with figures is very convincing.',
        'Write the complete estimate in docs/system-design.md with the four sections: traffic, storage, bandwidth and memory, each ending in a one-sentence conclusion.'
      ],
      vet: [
        'Compare your estimate with the real measurements from week 21. If your database handles a certain measured number of requests per second, you already know how many clinics your current implementation supports.',
        'Note in docs/system-design.md the number of clinics VetCare would support today according to your measurements. It is the most honest figure you can have about your own system.'
      ],
      edge: [
        'Round without fear and use powers of ten. The goal is to decide whether you need one machine or a hundred, not to get the third decimal right. False precision wastes time and improves no decision.',
        'Peak over average is the factor most often forgotten. A system designed for the average falls over every day at nine in the morning, when all of reception opens the schedule at once.',
        'Binary files do not go in the relational database: they inflate backups, saturate the page cache and make every query slower. They go in object storage with the reference in the database.'
      ],
      quiz: [
        { q: 'How do you estimate peak requests per second from the number of users?', a: 'You multiply total users by the percentage active at the same time, by the frequency of each one’s actions, and then apply a peak-over-average factor of between three and five. The peak factor is the part most often forgotten and the one that most determines the sizing.' },
        { q: 'Why are images not stored in the relational database?', a: 'Because they take up orders of magnitude more than the structured data, inflate backups, push out of the cache the pages that are actually queried and add nothing the database can query. They go in object storage served by a CDN, with only the URL in the table.' },
        { q: 'Which latency ratios is it worth having memorised and what for?', a: 'That reading from memory is on the order of a thousand times faster than a random SSD read and that an intercontinental round trip is in the hundreds of milliseconds. They serve to decide instantly whether caching something is worth it or whether data needs replicating close to the user.' },
        { q: 'Why is the conclusion of an estimate as important as the numbers?', a: 'Because the numbers are only useful if they lead to a decision. "60 requests per second" says nothing on its own; "60 requests per second, so one server is enough and the real problem is isolation between clinics" is what shows you understand what you estimated.' }
      ],
      out: 'A complete estimate of VetCare at 200 and 5,000 clinics with a conclusion per section and the breaking point identified.',
      file: 'docs/system-design.md'
    },
    {
      t: 'Scaling: vertical, horizontal and the state that gets in the way',
      obj: 'Understand how each layer really scales and why state on the server is what prevents adding machines.',
      why: 'It is the guaranteed follow-up question: "what if traffic multiplies by a hundred?". Answering layer by layer, saying what breaks first, is what shows you understand the whole system and not just your code.',
      study: { r: 3, what: 'Read PostgreSQL’s high availability page, only the comparison of replication methods. About 12 minutes. Keep the distinction between synchronous and asynchronous replication: synchronous does not lose data but every write waits for the replica, and asynchronous is fast but can lose the last transactions if the primary goes down.',
        pasos: [
          'Read the chapter introduction (~3 min): why scaling writes is harder than scaling reads.',
          'Open "26.1. Comparison of Different Solutions" (~8 min) and look at the final feature table.',
          'Copy the difference between synchronous and asynchronous replication with its cost.',
          'For each VetCare layer (web, API, database) write whether it scales horizontally and what state prevents it.'
        ] },
      ex: {
        title: 'Scaling layer by layer, in the order it breaks',
        body: `--- Vertical versus horizontal ---
  Vertical: a bigger machine.
    + simple, does not change the code, adds no eventual consistency
    - it has a ceiling, and the price rises faster than the power
    => it is the first option and almost always the right one at the start

  Horizontal: more machines.
    + no practical ceiling, tolerates one going down
    - requires the service to hold no state, adds network and latency
    => necessary beyond a certain point, but it has a real cost

--- LAYER 1: API. Easy to scale ONLY IF it has no state ---

  // BAD: the server remembers things in memory
  private static readonly Dictionary<string, Cart> _sessions = new();
  // With two servers behind a load balancer, the next request
  // may land on the other one and the state is not there.

  // GOOD: the state lives outside the process
  //   - session in the JWT token (week 18) or in a shared store
  //   - data in PostgreSQL
  //   - cache in a shared cache service
  // That way any server can handle any request
  // and adding machines is changing a number.

  Careful: week 14's outbox processor DOES have execution
  state. With two instances they would process the same message
  twice. That is why you used SELECT ... FOR UPDATE SKIP LOCKED:
  the database is what coordinates.

--- LAYER 2: Database reads. Replicas ---

  Primary (writes) --async--> Replica 1 (reads)
                   --async--> Replica 2 (reads)

  A consequence you must be able to name: replication lag.
  You create an appointment and read it from a replica 50 ms later: it might
  not be there. Solutions:
    a) read from the primary right after writing
    b) return the created object in the POST response
    c) accept the lag where it does not matter
  In VetCare (b) is the best: the POST already returns the appointment.

--- LAYER 3: Database writes. The hard part ---

  A single primary accepts thousands of writes/s. VetCare
  needs 6/s. You will never reach the limit, and saying this
  in an interview is a mature answer, not an evasion.

  If you did, in order:
    1. optimise queries and indexes (week 21)
    2. move what is not critical to a queue (outbox, week 14)
    3. partition tables by date
    4. shard by clinic  <- last resort

--- LAYER 4: What really breaks first ---
  It is almost never the CPU. It is the connection pool, file
  storage, a slow external dependency or a query without an
  index. You know because you measure it (week 22), not because you assume it.`
      },
      steps: [
        'Look for state in your API: static fields, class variables that accumulate, in-process memory cache, local temporary files. Each one is something that prevents adding a second instance.',
        'Decide for each piece of state you find whether you move it out or justify it. Week 21’s in-memory cache is acceptable if each instance has its own and the data changes little, knowing that invalidating only deletes it in ONE instance: the others serve the old value until it expires (HybridCache only coordinates instances if you add a distributed cache such as Redis). An in-memory session is never acceptable.',
        'Start two instances of your API in compose by changing the ports and send them alternating requests. If something breaks, you have found hidden state you had not detected by reading.',
        'Write in docs/system-design.md the order in which you would scale VetCare: which layer, with which technique, from which measured number and with what consequence. The measured number is what makes it a plan and not a list.',
        'For the reads layer, write what you will do about replication lag. In VetCare the good answer is returning the created object in the POST, and being able to name the problem is worth more than the solution.'
      ],
      vet: [
        'Review week 14’s outbox processor and confirm that SELECT FOR UPDATE SKIP LOCKED lets it have several instances without processing the same message twice. Explain it in writing.',
        'Add a section to docs/system-design.md on what breaks first in VetCare according to your week 21 measurements. It is almost certainly the connection pool and not the CPU.'
      ],
      edge: [
        'Scaling vertically is the first option and very often the right one: a machine twice as big is infinitely simpler than two coordinated machines and introduces no consistency problem.',
        'Read replicas do not scale writes, and people propose them as if they did. If your problem is writes, adding replicas only adds lag and confusion.',
        'State shared in a process’s memory is the number one reason a service cannot be scaled horizontally. And it is usually hidden in a static field that looks innocent.'
      ],
      quiz: [
        { q: 'Why does in-memory state on the server prevent horizontal scaling?', a: 'Because each instance has its own memory and the load balancer can send consecutive requests from the same user to different instances, which do not know what the other stored. The state has to live in a shared place or in the client’s own token.' },
        { q: 'What is replication lag and how is it handled?', a: 'It is the time a write on the primary takes to appear in the asynchronous replicas, during which a read on the replica may not see the data just written. It is handled by reading from the primary right after writing, returning the created object in the response, or accepting the lag where it has no consequences.' },
        { q: 'Why do read replicas not solve a writes problem?', a: 'Because all writes still go to the primary, which is the only one that accepts them; replicas only spread the read load. If the bottleneck is writes, the solution goes through optimising, moving work to queues, partitioning or sharding.' },
        { q: 'When is it right to scale vertically instead of horizontally?', a: 'Almost always at the start: as long as a bigger machine solves the problem, it is the simplest option, requires no code changes and introduces neither eventual consistency nor coordination. You move to horizontal when you hit the machine’s ceiling or when you need to tolerate one going down.' }
      ],
      out: 'Server state identified and resolved, two instances working, and the layer-by-layer scaling plan with measured numbers.',
      file: 'docs/system-design.md'
    },
    {
      t: 'Consistency, CAP and what eventual really means',
      obj: 'Understand the CAP theorem without the usual misunderstandings and decide for each piece of VetCare data how much consistency it needs.',
      why: 'It is the topic where most people repeat phrases without understanding them. Explaining that the choice only appears during a network partition, and that most systems choose per piece of data and not globally, sets you apart immediately.',
      study: { r: 6, what: 'Read Eric Brewer’s article, the author of CAP, on how the theorem is misinterpreted. About 15 minutes. The idea that corrects almost every mistake: CAP does not say you always choose two of three; it says that when the network splits you have to choose between answering with possibly stale data or not answering.',
        pasos: [
          'Read the introduction and the section on why 2 of 3 is misleading (~5 min).',
          'Read "Cap-latency connection" (~3 min): in practice, a partition is a timeout.',
          'Read "Managing partitions" (~4 min): detect the partition, operate in limited mode and recover.',
          'For each piece of VetCare data (appointments, history, invoices, catalogue) decide: during a partition, do you prefer to answer with stale data or not answer?'
        ] },
      ex: {
        title: 'Consistency decided data by data in VetCare',
        body: `--- CAP, properly understood ---
  C (consistency): every node sees the same data.
  A (availability): every node answers something.
  P (partition): the network between nodes is cut.

  The partition is NOT chosen: it happens. What you choose is what
  to do during it.
    CP = I reject requests rather than serve stale data
    AP = I serve what I have even if it is out of date

  If there is no partition, you have C and A at once without trouble.
  That is why in a single-database system CAP hardly
  applies: talking about CAP there is a sign of not understanding it.

--- Kinds of consistency, from strongest to weakest ---
  Strong ............ every read sees the latest write
  Read-your-writes .. I see mine instantly, others take longer
  Eventual .......... everyone converges if they stop writing

--- Decision per piece of data in VetCare ---

| Data                  | Consistency    | Why                          |
|-----------------------|----------------|------------------------------|
| Schedule slot         | STRONG         | two appointments in one slot |
|                       |                | is a real business error     |
| Clinical history      | STRONG         | medical decision on the data |
| Issued invoice        | STRONG         | money                        |
| List of vets          | eventual (min) | changes once a month         |
| Appointment counter   | eventual (sec) | it is informative            |
| Notification sent     | eventual       | already asynchronous with    |
|                       |                | the outbox (week 14)         |

  The schedule demands strong consistency, and that is why your PostgreSQL
  EXCLUDE constraint is the most important design decision
  in all of VetCare: it delegates the guarantee to the only place that can
  really provide it under concurrency.

--- Why "I check before inserting" does not work ---
  Thread A: SELECT -> slot free
  Thread B: SELECT -> slot free
  Thread A: INSERT -> ok
  Thread B: INSERT -> ok      <- two appointments in the same slot

  The check and the write are not atomic. Only a constraint
  in the database or an explicit lock solves it.
  This is exactly what you tested in week 10.

--- Idempotency as the practical answer ---
  In a distributed system you do not know whether your request arrived:
  the failure could have been before or after processing it. That is why
  week 14's Idempotency-Key is not a luxury: it is the
  only way for retrying to be safe.`
      },
      steps: [
        'Write VetCare’s consistency table: for each kind of data, what level it needs and why. The why column is the one that matters, because it is what you will be asked.',
        'Explain in writing, with the example’s thread sequence, why checking before inserting does not prevent the duplicate appointment. It is the clearest demonstration of why you need the constraint in the database.',
        'Check in your code that every piece of data you marked as strong consistency is protected by a database constraint or a transaction, not just by a check in C#.',
        'For the eventual consistency data, write how much delay is acceptable for each. A specific number turns "eventual" from an excuse into a design decision.',
        'Write the correct definition of CAP in your own words, including the clarification that the choice only appears during a partition. If you cannot explain it in three sentences, reread it.'
      ],
      vet: [
        'Write a new ADR (ADR-009) on week 10’s EXCLUDE constraint, with the justification in terms of consistency: it is the boundary where VetCare demands a strong guarantee and why no check in the code can provide it.',
        'Go over where you use the Idempotency-Key and write in docs/system-design.md why it is the piece that makes week 14’s retries safe.'
      ],
      edge: [
        'CAP is not "choose two of three" as a permanent slogan: the partition is not an option but an event, and the real choice is between consistency and availability while that event lasts.',
        'Eventual consistency does not mean "sometimes the data is wrong". It means it converges if writes stop, and that during a bounded interval you can read an old value. If that interval is not bounded and measured, it is not a design.',
        'Strong consistency is not free: it costs latency, coordination and availability during failures. Asking for it for everything is as bad a design as never asking for it.'
      ],
      quiz: [
        { q: 'What does the CAP theorem really say?', a: 'That when the network between nodes splits, a distributed system has to choose between continuing to answer with possibly out-of-date data or rejecting requests so as not to violate consistency. Without a partition you can have consistency and availability at once, so the choice only appears during the failure.' },
        { q: 'Why does checking before inserting not prevent a duplicate appointment?', a: 'Because between the check and the insert another thread can make the same check and get the same result, so both insert. The check and the write are not atomic, so the guarantee has to come from a constraint in the database or an explicit lock.' },
        { q: 'What does eventual consistency mean and what is needed for it to be a design and not an excuse?', a: 'It means all replicas converge to the same value if writes stop arriving, so during an interval an old value can be read. To be a design it needs that interval to be bounded, measured and documented as acceptable for that specific piece of data.' },
        { q: 'Why is idempotency essential in a distributed system?', a: 'Because when a request fails you do not know whether the failure happened before or after the server processed it, so retrying can duplicate the effect. An idempotency key lets the server recognise the retry and return the original result instead of executing twice.' }
      ],
      out: 'A consistency table per piece of data with justification, a written demonstration of the race condition and verification that the strong guarantees are in the database.',
      file: 'docs/system-design.md'
    },
    {
      t: 'The pieces in the cupboard: when to use each one',
      obj: 'Know the typical pieces of an architecture and, above all, know when NOT to use them.',
      why: 'Everyone can name queue, cache and CDN. What is evaluated is whether you know when they are not needed. Saying "I would not add a queue here because the volume does not justify it and the order must be confirmed instantly" is worth more than drawing it.',
      study: { r: 2, what: 'Read the caching best practices page and the CDN part. About 12 minutes. Notice the layers: browser, CDN, application cache, database cache. Each one has a different use and most people only think of the third.',
        pasos: [
          'Read "How to apply caching" (~3 min).',
          'Read "Lazy caching" and "Write-through" (~4 min) and write when you would use each in VetCare.',
          'Read "Time-to-live" and "Evictions" (~3 min).',
          'Read "The thundering herd" (~2 min): the same stampede problem you saw with HybridCache.',
          'Read the "Amazon CloudFront" part (~1 min) to place the CDN as the layer closest to the user.'
        ] },
      ex: {
        title: 'Six pieces, with the use case and the no-use case',
        body: `--- LOAD BALANCER ---
  For: spreading traffic, surviving an instance going down,
       terminating TLS, deploying without downtime.
  You do not need it if: one instance is more than enough and you accept
       deployment downtime (VetCare today, week 20).

--- CDN ---
  For: static files, images, geographically spread users.
       It is the cheapest latency improvement there is.
  You do not need it if: all your traffic is dynamic and your users
       are in a single region.
  In VetCare: YES, for X-rays and for the web bundle.

--- SHARED CACHE (Redis or similar) ---
  For: data that is expensive to compute, heavily read, tolerably a bit
       stale. Also shared sessions and rate limiting
       across several instances.
  You do not need it if: an in-memory cache per instance is enough,
       or if the data does not tolerate being stale (week 21).
  In VetCare: only if you move to several instances and need
       login rate limiting to be global.

--- MESSAGE QUEUE ---
  For: decoupling slow work from the request cycle,
       absorbing spikes, retrying without blocking the user.
  You do not need it if: the work is fast, the user needs
       the result now, or your outbox in PostgreSQL is enough.
  In VetCare: your outbox table ALREADY is a queue. Enough at this
       scale, and saying so shows judgement.

--- SEARCH ENGINE (Elasticsearch or similar) ---
  For: free-text search, relevance, facets, aggregations
       over many documents.
  You do not need it if: PostgreSQL with tsvector or pg_trgm meets your needs.
       And at your scale it does.
  In VetCare: NO. A GIN index solves pet search
       and saves you a whole system to maintain and synchronise.

--- OBJECT STORAGE ---
  For: binary files. X-rays, invoice PDFs, attachments.
  You do not need it if: you do not handle files.
  In VetCare: YES, mandatory. 500 GB a year of images do not go
       in a table.

================================================================
PRINCIPLE: every piece you add is one more system to deploy,
monitor, update, secure and that can fail at three
in the morning. The cost is not implementing it: it is maintaining it.

The right answer to "would you add X?" is almost always
"not yet, and I'll tell you the number from which I would".`
      },
      steps: [
        'For each of the six pieces, write whether VetCare needs it today, at 200 clinics and at 5,000 clinics. Three columns. You will see that most of today’s answers are no, and that is correct.',
        'For each no, write the specific number from which it would become yes. That number is what turns your answer into an engineering decision instead of an opinion.',
        'Choose the piece VetCare does need already, which is object storage for images, and design how it fits: where the URL is stored, who authorises access, how the file is uploaded without going through your API.',
        'Write what real maintenance each piece you would add implies: updates, backups, monitoring, a new failure mode. That column is the one almost nobody considers and the one that weighs most in reality.',
        'Practise out loud the answer to "would you add a message queue to VetCare?". The good answer mentions that you already have an outbox, why it is enough at this scale, and from what volume you would change.'
      ],
      vet: [
        'Decide how VetCare’s X-rays are served: signed URLs with a short expiry from object storage, instead of passing the file through your API. Write why, connecting it with week 18’s authorisation.',
        'Draw the complete diagram of VetCare at 200 clinics with only the pieces you have justified. Keep it as a Mermaid diagram in docs/system-design.md.'
      ],
      edge: [
        'Every new piece adds a failure mode you did not have and that has to be monitored, updated and secured. The real cost of a piece is not writing the code that uses it: it is operating it for years.',
        'Adding a dedicated search engine forces you to synchronise data between two systems, which introduces inconsistency and a reindexing job that fails. PostgreSQL with text indexes covers a great many real cases.',
        'A shared cache becomes a single point of failure if your application cannot work without it. Always design the path without the cache, even if it is slower.'
      ],
      quiz: [
        { q: 'Why is the answer to "would you add this piece?" usually not yet?', a: 'Because each component adds a permanent operating cost, a new failure mode and more surface to secure, while the benefit only appears above a certain volume. The complete answer includes the number from which you would add it.' },
        { q: 'When do you need a dedicated search engine instead of PostgreSQL?', a: 'When you need advanced relevance, facets, complex aggregations or a volume of documents PostgreSQL does not index efficiently. Below that, a GIN index with tsvector or pg_trgm does the job and saves you synchronising two systems.' },
        { q: 'Why is your outbox table already a queue?', a: 'Because it does the essentials of a queue: it persists pending work, allows it to be processed asynchronously, retries what fails and with FOR UPDATE SKIP LOCKED coordinates several consumers. At moderate volume it is enough and avoids operating a separate messaging system.' },
        { q: 'Why are images served with signed URLs and not through your API?', a: 'Because passing hundreds of megabytes through your API consumes memory, connections and bandwidth of a service that should be devoted to data. A signed URL with a short expiry delegates delivery to the storage and the CDN while keeping authorisation control on your server.' }
      ],
      out: 'A table of pieces with a decision for today, 200 and 5,000 clinics, the threshold of each no, and VetCare’s diagram with only what is justified.',
      file: 'docs/system-design.md'
    },
    {
      t: 'Complete design of VetCare at scale (weekly exam)',
      obj: 'Run a complete design interview from start to finish, out loud and timed, and leave it written down.',
      why: 'It is the only way to know whether the method works for you. Reading about system design and doing a whole one against the clock are completely different experiences, and the second is the one that is evaluated.',
      study: { r: 0, what: 'Go over your step 1 template and your estimate. About 8 minutes. Today you read nothing new: today you run the five steps against the clock and record yourself if you can, because listening to yourself is uncomfortable and is what improves you most.',
        pasos: [
          'Read Fowler’s MonolithFirst article (~5 min): it will give you the argument for the microservices question.',
          'Go over your 5-step template and your estimate from this week.',
          'Set a 45-minute timer and run the complete design out loud.',
          'Record the session and listen to it afterwards noting every moment you hesitated.'
        ] },
      ex: {
        title: 'Design of VetCare at 200 clinics, complete result',
        body: `# Design: VetCare for 200 clinics

## 1. Requirements
Functional (v1): schedule with overlap detection, pet records
and history, visits with documents, basic billing,
three roles. Out of scope: owner access, mobile app,
offline operation, lab integration.

Non-functional: 1,000 internal users, 60 req/s at peak,
90% reads. Schedule consistent instantly. Clinical history
is regulated data: encryption and access auditing. Availability
target 99.5%, schedule p95 latency < 300 ms.

Assumptions: clinics isolated from each other; requires internet;
a single geographic region.

## 2. Estimate
60 req/s at peak, 6 writes/s.
3 GB/year of structured data, 15 GB in 5 years.
500 GB/year of images.
Conclusion: volume is not the challenge. The challenge is isolation
between clinics and schedule consistency.

## 3. High-level design
    Browser -> CDN (static files, images)
            -> Load balancer -> API x2 (stateless)
                                 |-> PostgreSQL primary
                                 |     +-- replica (reads and
                                 |         failover)
                                 |-> Objects (X-rays)
                                 +-- Outbox -> notifications

Multi-tenant: one database with clinic_id in every table and a mandatory
filter in every query, plus a PostgreSQL row policy
as a second net. Discarded alternative: one database per clinic,
because 200 schemas and 200 migrations cannot be run by a small
team.

## 4. Going deeper: the critical endpoint
POST /api/v1/appointments
  1. Authenticate, get clinic_id from the token (never from the body)
  2. Validate input (week 19)
  3. Idempotency-Key so the retry is safe (week 14)
  4. INSERT; the EXCLUDE constraint with clinic_id guarantees
     no overlap under concurrency
  5. SqlState 23P01 -> 409 with problem details (week 11)
  6. Event to the outbox for the notification, in the same transaction
  7. Return the created appointment, to avoid replica lag

## 5. Bottlenecks and trade-offs
What breaks first: the connection pool, measured in
week 21, not the CPU. Mitigation: tune the pool and remove
slow queries before adding machines.

Next limit: at about 5,000 clinics the write primary
starts to show. Then: partition appointment by month and, only
afterwards, shard by clinic_id, which is already the natural key.

Accepted trade-offs:
  - One region: distant users get worse latency. Accepted.
  - Asynchronous replica: a loss window of seconds if the primary
    goes down. Accepted for this scale.
  - Modular monolith, not microservices: the team is small and
    the module boundaries are already defined (week 15). A
    service would be extracted only if a module needed to scale
    or be deployed separately.`
      },
      steps: [
        'Set a 45-minute timer and do the complete design of VetCare at 200 clinics out loud, respecting the five steps and their times. Do not stop even if you get stuck: keeping talking is part of what you are training.',
        'Write the result in docs/vetcare-at-scale.md with the five sections. Compare it with the example only after you have done yours.',
        'Repeat the exercise with a different prompt unrelated to VetCare: a URL shortener, a booking system or a notifications feed. Thirty minutes. The goal is to check that the method works outside your familiar domain.',
        'Check the week’s list: step 1 template written, an estimate at two scales with conclusions, a layer-by-layer scaling plan with measured numbers, a consistency table per piece of data, a table of pieces with thresholds, a justified diagram and a complete design written down.',
        'Record yourself explaining step 5, the trade-offs, for three minutes. Listen to yourself. That section is what distinguishes someone who understands from someone who memorised, because it is the only one where you have to admit what you sacrificed.',
        'Note the three questions that left you blank during the exercise. Those are your study material for week 24, more valuable than any generic list of topics.'
      ],
      vet: [
        'Add the Mermaid diagram of the at-scale architecture to docs/vetcare-at-scale.md and link it from the README. It is one of the first things someone evaluating your project looks at.',
        'Compare the at-scale design with your real implementation and write the three biggest differences. Knowing how what you built differs from what you would build is an excellent answer in an interview.',
        'Press "Mark for review" and reread docs/vetcare-at-scale.md in a week.'
      ],
      edge: [
        'A design without declared trade-offs is a design you have not understood. You always sacrifice something: latency, consistency, cost or operational simplicity. If you cannot name it, analysis is missing.',
        'Do not propose specific technology before you have justified the need. Saying a product’s name in minute three, before the estimate, is the clearest sign you are reciting instead of designing.',
        'The clock matters. An excellent design that stays at step 2 because you went on too long scores worse than a complete, reasonable one. Practising against time is part of the exercise, not a detail.'
      ],
      quiz: [
        { q: 'What are the five steps of a system design and how long does each last?', a: 'Clarifying requirements about five minutes, estimating another five, high-level design fifteen, going deeper into whatever the interviewer asks fifteen, and bottlenecks with trade-offs five. The first two seem dispensable and are the ones that determine whether the rest makes sense.' },
        { q: 'Why is the trade-offs step the most revealing?', a: 'Because it forces you to say what you have sacrificed and why, which only someone who really understands the consequences of their decisions can do. A design presented as if it had no drawbacks gives away that it was not analysed.' },
        { q: 'Why does VetCare discard one database per clinic in favour of multi-tenancy?', a: 'Because two hundred databases mean two hundred migrations, two hundred sets of backups and two hundred monitoring points, which is an impossible operating cost for a small team. With a shared database and clinic_id plus a row policy you achieve the isolation at a much lower cost.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That system design is a method and not a catalogue: you ask before drawing, you estimate to know whether the problem you imagine really exists, you choose consistency data by data instead of globally, and you justify each piece with the number from which it is needed and the cost of operating it.' }
      ],
      out: 'A complete design of VetCare at scale written and defended out loud, a second prompt practised, and the three gaps identified for week 24.',
      file: 'docs/vetcare-at-scale.md'
    }
  ]
}
]);
