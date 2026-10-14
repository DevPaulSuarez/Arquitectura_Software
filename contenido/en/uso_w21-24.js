/* What each day is for in a real job, why it matters
   and what to ask (the client, the team or the tech lead) to apply it.
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.USO = Object.assign(window.EN.USO || {}, {

/* ---------- Week 21 · Performance ---------- */

'w21d1': {
  sirve: 'Writing performance objectives with percentiles ("95% of schedule requests in under 300 ms") gives a measurable goal the whole team understands.',
  importa: 'The average hides the users who suffer: a mean of 200 ms can include 5% of requests taking 5 seconds. Without percentile objectives, you optimise what does not matter and ignore what hurts.',
  preguntas: [
    { a: 'The receptionist', q: 'Which action do you do most times a day and how long can you tolerate waiting for it?', obt: 'The critical operations and their wait limit, to turn into objectives.' },
    { a: 'The tech lead', q: 'Do we measure percentiles or only averages in production?', obt: 'Whether the current data is useful to compare with the objective.' },
    { a: 'The clinic owner', q: 'At which times is load highest: first thing, midday?', obt: 'The peaks at which the objectives must be met.' }
  ],
  evita: { q: 'The API has to be fast, right?', por: 'It cannot be measured. Ask which operation, which percentile and in what time.' }
},

'w21d2': {
  sirve: 'Instrumenting the API and generating load with tools like k6 or bombardier shows how long each request takes and where the time goes.',
  importa: 'Optimising without measuring is guessing, and intuition almost always fails: the time is usually somewhere nobody suspected. Measuring first avoids weeks of work on the wrong part.',
  preguntas: [
    { a: 'The infrastructure team', q: 'Do we have a production-like environment where we can run load tests?', obt: 'Where to measure without affecting real users.' },
    { a: 'The tech lead', q: 'How many simultaneous users do we expect at the peak?', obt: 'The load level the test must simulate.' },
    { a: 'The DBA', q: 'Does the test database have a data volume similar to the real one?', obt: 'Whether the results will be representative.' }
  ],
  evita: { q: 'Shall I run a load test with a million users?', por: 'If it is not your reality, you measure what does not matter. Ask what the realistic peak load is.' }
},

'w21d3': {
  sirve: 'Finding the real slow queries (with pg_stat_statements) and fixing them with EXPLAIN ANALYZE is the optimisation with the best return in almost any application.',
  importa: 'In most business applications, the bottleneck is in the database. A single badly indexed query run thousands of times a day can be half the API’s total time.',
  preguntas: [
    { a: 'The DBA', q: 'Which queries accumulate the most total time, not just the slowest one by one?', obt: 'The queries with most impact: a 10 ms one running a million times weighs more than a 2-second one once a day.' },
    { a: 'The tech lead', q: 'Is pg_stat_statements turned on in production?', obt: 'Whether there is real query data to analyse.' },
    { a: 'A teammate', q: 'Which screen fires this query and how often?', obt: 'The query’s origin in the code to fix it.' }
  ],
  evita: { q: 'Shall I add indexes until it’s fast?', por: 'Every index slows writes. Ask what the slow query’s execution plan says.' }
},

'w21d4': {
  sirve: 'Caching stores expensive results so they are not repeated. At work it is used for data that is read a lot and changes little, such as the vaccine catalogue or the clinic’s opening hours.',
  importa: 'Caching is the optimisation that introduces most bugs: stale data, forgotten invalidations, users seeing others’ information. Caching without judgement swaps a performance problem for a correctness one, which is worse.',
  preguntas: [
    { a: 'The clinic owner', q: 'How often do prices and opening hours change? Does anything happen if they are seen a few minutes late?', obt: 'How long the cache can last without causing problems.' },
    { a: 'The tech lead', q: 'Which data is per user and must never be shared in a common cache?', obt: 'Limits so data from different users is not mixed.' },
    { a: 'In a code review', q: 'What invalidates this cache when the data changes?', obt: 'Confirming there is invalidation and not just expiry.' }
  ],
  evita: { q: 'Shall I cache every API response?', por: 'You will show stale data, perhaps someone else’s. Ask which data is read a lot, changes little and is the same for everyone.' }
},

'w21d5': {
  sirve: 'Browser metrics (LCP, INP, CLS) measure what the user perceives: when they see the content, how long a click takes to respond, whether the page jumps.',
  importa: 'A fast API is useless if the browser takes 4 seconds to download a huge JavaScript bundle. Google uses these metrics in its results and users feel them even if they do not know their names.',
  preguntas: [
    { a: 'The frontend tech lead', q: 'How big is the JavaScript bundle and which library weighs most?', obt: 'Where to cut so the app loads sooner.' },
    { a: 'The receptionist', q: 'Do you use the app on an old computer or with a poor connection?', obt: 'The real conditions under which to measure.' },
    { a: 'The designer', q: 'Are there elements that appear late and push the content?', obt: 'Causes of visual jumps (CLS) that annoy the user.' }
  ],
  evita: { q: 'If I run Lighthouse and it’s green, is it fine?', por: 'Lighthouse simulates a specific machine. Ask what the experience is like on the clinic’s real computers.' }
},

'w21d6': {
  sirve: 'An optimisation report with before and after measurements proves the value of the work with data. It is what convinces a manager to invest more time or what impresses in an interview.',
  importa: '"I made it faster" convinces nobody. "I took the schedule’s p95 from 1,200 ms to 180 ms with a composite index" does. Data turns an opinion into a defensible achievement.',
  preguntas: [
    { a: 'The tech lead', q: 'Which report format helps management understand the impact?', obt: 'The right level of technical detail for each audience.' },
    { a: 'The clinic owner', q: 'Have you noticed any difference in speed these weeks?', obt: 'The user’s perception, which complements the numbers.' },
    { a: 'The tech lead', q: 'Which objective was left unmet and is worth pursuing?', obt: 'The prioritised next steps.' }
  ],
  evita: { q: 'Shall I put in all the charts I have?', por: 'Too much data hides the message. Ask what decision the reader of the report has to make.' }
},

/* ---------- Week 22 · Observability ---------- */

'w22d1': {
  sirve: 'Structured logs (with fields like appointmentId, userId, traceId) let you search and filter instead of reading text. With a correlation id you reconstruct everything that happened in a request.',
  importa: 'When something fails at 3 in the morning, searching millions of lines of free text is impossible. With structured logs, you find every line of that request in seconds.',
  preguntas: [
    { a: 'The infrastructure team', q: 'Which tool are the logs sent to and which fields does it index?', obt: 'Where and how logs are queried in production.' },
    { a: 'The tech lead', q: 'Which fields must always appear in every log line?', obt: 'The team’s minimum standard of fields.' },
    { a: 'Support', q: 'When a user reports an error, what piece of data do they give us to search for it?', obt: 'Whether a correlation id needs to be shown to the user so they can share it.' }
  ],
  evita: { q: 'Shall I put logs in every method?', por: 'Lots of noise and lots of cost. Ask which questions you need to be able to answer when something fails.' }
},

'w22d2': {
  sirve: 'Latency, traffic, error and saturation metrics (Google’s four golden signals) summarise the system’s health in four charts.',
  importa: 'Measuring causes (high CPU) generates alerts that do not always affect the user. Measuring symptoms (errors, latency) warns you just when the user is suffering. It is the difference between a team living on alert and one that sleeps.',
  preguntas: [
    { a: 'The infrastructure team', q: 'Which metrics system do we use: Prometheus, Azure Monitor, another?', obt: 'The tool and how to expose metrics from the API.' },
    { a: 'The tech lead', q: 'Which endpoint, if it fails, affects the business most?', obt: 'Where to put detailed metrics first.' },
    { a: 'The clinic owner', q: 'Which number would tell you at a glance that the system is fine today?', obt: 'A business metric (appointments created per hour) that complements the technical ones.' }
  ],
  evita: { q: 'Shall I measure CPU and memory usage?', por: 'They are causes, not symptoms. Ask what the user notices when the system is doing badly.' }
},

'w22d3': {
  sirve: 'Distributed traces with OpenTelemetry show a request split into spans (API, database, SMS) with each one’s time, to find where the time goes.',
  importa: 'When a request goes through several services, each one’s logs do not tell the whole story. The trace does, and turns an investigation of hours into a glance.',
  preguntas: [
    { a: 'The infrastructure team', q: 'Where do we send traces and what percentage do we sample?', obt: 'The destination and the sampling policy so costs do not explode.' },
    { a: 'The tech lead', q: 'Do calls to external services propagate the trace context?', obt: 'Whether the trace is complete or gets cut somewhere.' },
    { a: 'A teammate', q: 'Which business operation deserves its own named span?', obt: 'Custom spans that make the trace readable.' }
  ],
  evita: { q: 'Shall I keep 100% of the traces?', por: 'In production it is very expensive. Ask which sampling gives enough information without exploding the cost.' }
},

'w22d4': {
  sirve: 'An SLO is a measurable promise ("99.5% of schedule requests work well over 30 days"). The error budget is how much you can fail, and alerts fire when it is consumed too fast.',
  importa: 'Fixed-threshold alerts go off all the time for unimportant spikes, and the team ends up ignoring them. Budget burn alerts only go off when the promise is really being broken.',
  preguntas: [
    { a: 'The clinic owner', q: 'How many times a month can booking an appointment fail before it is a problem for you?', obt: 'The business basis for setting the SLO.' },
    { a: 'The tech lead', q: 'What do we do when the error budget runs out: do we pause features?', obt: 'The team’s policy, which is what gives the SLO meaning.' },
    { a: 'The on-call team', q: 'Which alerts wake you up with nothing to do?', obt: 'Noisy alerts that need converting or removing.' }
  ],
  evita: { q: 'Shall we set a 100% SLO?', por: 'It is impossible and paralyses the team. Ask how much failure the business tolerates without real harm.' }
},

'w22d5': {
  sirve: 'A well-ordered dashboard answers questions in sequence (is it broken? since when? where?) and an on-call runbook says what to do step by step in each likely incident.',
  importa: 'In the middle of an incident nobody thinks clearly. A runbook written calmly lets anyone on the team solve the problem, not just whoever built the system.',
  preguntas: [
    { a: 'The on-call team', q: 'What do you look at first when an alert goes off?', obt: 'The real order of diagnosis, which defines the dashboard’s order.' },
    { a: 'The tech lead', q: 'What have been the two most frequent incidents of the last year?', obt: 'The ones that deserve a runbook first.' },
    { a: 'A teammate', q: 'Follow this runbook without my help. At which step did you hesitate?', obt: 'Ambiguous steps that need rewriting.' }
  ],
  evita: { q: 'Shall I put every metric on one dashboard?', por: 'A dashboard with 40 charts answers nothing. Ask which questions have to be answered during an incident and in what order.' }
},

'w22d6': {
  sirve: 'Simulating an incident, diagnosing it with only your tools and writing the postmortem is exactly what you will do in a real team after every major outage.',
  importa: 'The blameless postmortem is the tool mature teams learn from mistakes with. If the observability tools are not enough to diagnose the simulated incident, they will not be enough for a real one either.',
  preguntas: [
    { a: 'The tech lead', q: 'Which postmortem format do we use and who reviews it?', obt: 'The team’s template and process.' },
    { a: 'The on-call team', q: 'What would have helped you detect this sooner?', obt: 'Specific improvement actions on alerts and dashboards.' },
    { a: 'The clinic owner', q: 'How did you find out about the problem and what did you do meanwhile?', obt: 'The real impact on the business and how to communicate better next time.' }
  ],
  evita: { q: 'Whose fault was it?', por: 'Looking for culprits makes people hide mistakes. Ask what allowed the error to reach production and how to prevent it.' }
},

/* ---------- Week 23 · System design I ---------- */

'w23d1': {
  sirve: 'Clarifying requirements before designing (users, volume, main operations, constraints) is the first step of any system design interview and any big project.',
  importa: 'In design interviews, diving into drawing without asking is the mistake that causes most failures. At work, it is what leads to building a system for a million users when there were a thousand.',
  preguntas: [
    { a: 'The interviewer or the client', q: 'How many daily active users and what is the most frequent operation?', obt: 'The scale and the critical path that guide the whole design.' },
    { a: 'The interviewer or the client', q: 'What matters more here: that data is always up to date or that the system never stops answering?', obt: 'The priority between consistency and availability.' },
    { a: 'The interviewer or the client', q: 'What is out of scope for this design?', obt: 'The limits so you do not spend time on parts that are not being evaluated.' }
  ],
  evita: { q: 'Shall I use microservices and Kafka?', por: 'Choosing pieces before knowing the requirements is exactly what the interviewer wants to see you avoid. Ask first about the scale and the operations.' }
},

'w23d2': {
  sirve: 'Estimating traffic, storage and bandwidth with quick sums (requests per second, GB a year) tells you whether you need one server or a hundred before designing anything.',
  importa: 'Without estimates, any design looks reasonable. With them you discover that VetCare at national scale fits in one well-indexed database, or that it needs partitions. It is what separates an opinion from an argument.',
  preguntas: [
    { a: 'The interviewer or the client', q: 'How many clinics, how many appointments per clinic per day and how many years of history?', obt: 'The input numbers to calculate volume and storage.' },
    { a: 'The infrastructure team', q: 'How many requests per second can one of our servers handle today?', obt: 'A real reference to turn traffic into a number of machines.' },
    { a: 'The tech lead', q: 'Is the ratio of reads to writes about 10 to 1 or something else?', obt: 'The ratio that decides whether to invest in caches and read replicas.' }
  ],
  evita: { q: 'How many servers do I need?', por: 'Without input data there is no answer. Ask about users, operations and data size, and do the sum.' }
},

'w23d3': {
  sirve: 'Scaling vertically (a bigger machine) or horizontally (more machines) depends on each layer. Taking state out of the server is what lets you add machines behind a load balancer.',
  importa: 'If the API keeps sessions in memory, adding a second server breaks logins. Understanding which state gets in the way is the key to scaling, and it is a fixed interview question.',
  preguntas: [
    { a: 'The tech lead', q: 'Does the API keep anything in memory between requests: sessions, caches, files?', obt: 'The state that prevents horizontal scaling.' },
    { a: 'The infrastructure team', q: 'What is the next machine size available and how much does it cost?', obt: 'Whether scaling vertically is still the simplest, cheapest option.' },
    { a: 'The DBA', q: 'Is the database the limit today or does it still have headroom?', obt: 'Which layer to scale first.' }
  ],
  evita: { q: 'Shall we add more servers?', por: 'If the bottleneck is the database or there is state in memory, it does not help. Ask where the current limit is.' }
},

'w23d4': {
  sirve: 'CAP says that, in a network partition, you have to choose between consistency and availability. In practice, you decide for each piece of data how much consistency it needs.',
  importa: 'Not all data needs the same: an appointment must be consistent (not two people in the same slot), but a visit counter can lag. Choosing well gives systems that are fast and correct at the same time.',
  preguntas: [
    { a: 'The clinic owner', q: 'If two receptionists see the schedule a minute late, does anything serious happen?', obt: 'Which data tolerates eventual consistency and which does not.' },
    { a: 'The architect', q: 'Where do we use read replicas that may lag?', obt: 'The places where there is already eventual consistency without everyone knowing.' },
    { a: 'The interviewer', q: 'In this system, what do you prefer in a network failure: reject the operation or accept it and reconcile later?', obt: 'The CP or AP choice depending on the use case.' }
  ],
  evita: { q: 'Is our system CP or AP?', por: 'Each piece of data can be different. Ask what happens to each specific operation if the network splits.' }
},

'w23d5': {
  sirve: 'Knowing the typical pieces (load balancer, cache, queue, CDN, replicas, object storage) and above all when not to use them is what makes a sensible design.',
  importa: 'Every new piece is one more thing that can fail, that has to be monitored and paid for. Adding a queue or a cache "just in case" complicates the system with no benefit. Being able to say "it’s not needed here" is a sign of maturity.',
  preguntas: [
    { a: 'The architect', q: 'What specific problem does this queue solve that a table in the database does not?', obt: 'A real justification for the piece or the decision not to add it.' },
    { a: 'The infrastructure team', q: 'How much does it cost to keep this piece in production, in money and on-call?', obt: 'The operating cost, which almost never appears in the diagram.' },
    { a: 'The interviewer', q: 'What volume of attachments do we expect? Is object storage needed?', obt: 'Whether the piece is justified by the data or not.' }
  ],
  evita: { q: 'Which technologies should I put in the diagram?', por: 'The diagram is not a catalogue. Ask what problem each part of the system has and add only what solves it.' }
},

'w23d6': {
  sirve: 'Running a complete design interview out loud and against the clock is the best preparation for mid-level and senior interviews.',
  importa: 'Knowing the pieces is not enough: you have to order them in 45 minutes, explain each decision and react to questions. Practising it out loud is the only thing that turns it into a skill.',
  preguntas: [
    { a: 'A teammate acting as interviewer', q: 'At what point did you get lost following my explanation?', obt: 'Unclear parts of your talk.' },
    { a: 'A teammate acting as interviewer', q: 'Did I ask enough questions at the start or did I dive in too fast?', obt: 'An assessment of the clarification phase, the one most often failed.' },
    { a: 'The tech lead', q: 'Which part of this design would you attack in an interview?', obt: 'The hard questions you should have prepared.' }
  ],
  evita: { q: 'Did it go well?', por: 'A useless answer. Ask for specific feedback: what part was missing, where you hesitated, which decision you did not justify.' }
},

/* ---------- Week 24 · System design II and wrap-up ---------- */

'w24d1': {
  sirve: 'Applying the method to a domain you do not know (hotel bookings, food delivery) shows you know how to design, not that you memorised VetCare.',
  importa: 'In interviews you are almost never asked to design your own project. If the method only works with VetCare, it is not a method. Transferring it to another domain is the proof that it is yours.',
  preguntas: [
    { a: 'The interviewer', q: 'Who are the main users and which operation do they do most?', obt: 'The starting point in a new domain, just as with VetCare.' },
    { a: 'The interviewer', q: 'Is there any special requirement in this domain: payments, real time, location?', obt: 'What makes this system different and deserves special attention.' },
    { a: 'The interviewer', q: 'Would you like me to go deeper into a specific part?', obt: 'Where to spend the remaining time according to what the interviewer values.' }
  ],
  evita: { q: 'Shall I make it similar to VetCare?', por: 'Each domain has its own needs. Apply the same questions and let the answers change the design.' }
},

'w24d2': {
  sirve: 'Evolving an API without breaking clients (adding optional fields, not removing or renaming, versioning only when there is no other way) is a daily task in any API with users.',
  importa: 'Breaking a contract leaves installed mobile apps not working until the user updates. An incompatible change can cost more than all the new functionality you wanted to add.',
  preguntas: [
    { a: 'The frontend or mobile team', q: 'Which versions of the app are still in use and use this endpoint?', obt: 'Who would break with the change.' },
    { a: 'The tech lead', q: 'What is our deprecation policy and how much notice is given?', obt: 'The process for retiring something without surprising anyone.' },
    { a: 'In a code review', q: 'Does this change break any client that works today?', obt: 'Spotting incompatible changes before publishing them.' }
  ],
  evita: { q: 'Shall I release a v2 for this change?', por: 'Maintaining two versions is expensive. Ask whether the change can be made compatibly before versioning.' }
},

'w24d3': {
  sirve: 'Proving you can restore a backup, and deciding how long you keep each piece of data, is what protects the clinic from a disaster and from legal problems.',
  importa: 'A backup that has never been restored is not a backup, it is a hope. Many companies discover their backups are useless on the day they need them. Data protection laws also require being able to delete personal data when asked.',
  preguntas: [
    { a: 'The clinic owner', q: 'If we lose data, how many hours of work can you afford to lose at most?', obt: 'The RPO (maximum acceptable data loss), which defines how often to back up.' },
    { a: 'The clinic owner', q: 'How long can the system be down after a disaster?', obt: 'The RTO (maximum recovery time), which defines how to restore.' },
    { a: 'The privacy lead', q: 'How long must we keep medical histories and what do we do if an owner asks for erasure?', obt: 'Retention periods and the erasure procedure in line with the law.' }
  ],
  evita: { q: 'Do we have backups?', por: 'A yes guarantees nothing. Ask when one was last restored and how long it took.' }
},

'w24d4': {
  sirve: 'A repository that can be understood in five minutes (clear README, documented decisions, how to run it) is your best calling card for a recruiter or a technical team.',
  importa: 'Technical recruiters spend a few minutes on each repository. If they do not understand what you did and why, 24 weeks of work do not count. Presentation is part of the work, not decoration.',
  preguntas: [
    { a: 'Someone who does not know the project', q: 'Look at the repository for five minutes and tell me what you think I can do.', obt: 'Whether the repository communicates what you want, seen through someone else’s eyes.' },
    { a: 'A recruiter or mentor', q: 'What do you look for first when you open a candidate’s repository?', obt: 'What to highlight at the top of the README.' },
    { a: 'A senior developer', q: 'Which decision in this project seems most interesting to talk about in an interview?', obt: 'The strong topics you should prepare.' }
  ],
  evita: { q: 'Does the README look nice?', por: 'Looks matter little. Ask whether someone understands in five minutes what problem it solves and what decisions you made.' }
},

'w24d5': {
  sirve: 'Rehearsing technical answers out loud, adapted to who is asking and the time available, turns what you know into what you can demonstrate in an interview.',
  importa: 'Knowing something and explaining it under pressure are different skills. Many candidates who know fail because they cannot order the answer in two minutes. Rehearsal is what closes that gap.',
  preguntas: [
    { a: 'A teammate acting as interviewer', q: 'Ask me why I chose PostgreSQL and cut me off at two minutes.', obt: 'Practice of concise answers with a time limit.' },
    { a: 'A teammate acting as interviewer', q: 'Ask me a hard follow-up question about what I just said.', obt: 'Training for follow-ups, which is where it shows who really understands.' },
    { a: 'Someone non-technical', q: 'Did you understand what VetCare does and why it is useful?', obt: 'Proof that you can explain it to a recruiter or a non-technical manager.' }
  ],
  evita: { q: 'What will they ask me in the interview?', por: 'Nobody knows exactly. Ask what kind of questions they usually ask and practise answering, not memorising.' }
},

'w24d6': {
  sirve: 'Wrapping up with a timed design, a repository audit and a study plan for the next six months is what turns the path into a starting point, not an end.',
  importa: 'What is not practised is forgotten. A concrete plan of what to study next, based on your real weak points, is what keeps growth going when there is no longer a set path.',
  preguntas: [
    { a: 'A senior developer or mentor', q: 'Looking at my work, which topic would I need for the next level?', obt: 'A study priority based on the opinion of someone with experience.' },
    { a: 'A tech lead at a company you are interested in', q: 'Which technologies and practices does your team use day to day?', obt: 'What to study to get closer to the job you want.' },
    { a: 'Yourself, with your notes and the Review', q: 'Which questions have I got wrong most often during the 24 weeks?', obt: 'Your real weak points, which should head the plan.' }
  ],
  evita: { q: 'What should I learn now?', por: 'Without context, you will be recommended whatever is fashionable. Ask what you are missing for the specific job you are after.' }
}

});
