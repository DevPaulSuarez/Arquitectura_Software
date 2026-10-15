/* Glossary (part three): frontend, security, DevOps, performance, observability and system design. */
window.EN = window.EN || {};
window.EN.GLOSARIO = (window.EN.GLOSARIO || []).concat([

/* ---------- Frontend ---------- */

{ t: 'Component and props', en: 'Component / props', dia: 'w16d1',
  def: 'A component is a function that takes data (props) and returns UI. Props go from parent to child.',
  ya: 'Any React, Angular or Blazor screen you built out of reusable pieces.',
  dilo: '"A component is a function from props to UI; typing the props with TypeScript documents how it is used."' },

{ t: 'Derived state', en: 'Derived state', dia: 'w16d2',
  def: 'A value that can be calculated from other state or from props, and that therefore must NOT be stored as state.',
  ya: 'The counter or filtered list you kept in a useState and that sometimes got out of sync.',
  dilo: '"I keep the minimum possible state and calculate the rest in the render; two sources of truth end up contradicting each other."' },

{ t: 'Lifting state up', en: 'Lifting state up', dia: 'w16d3',
  def: 'Moving state to the closest common ancestor of the components that share it.',
  ya: 'When two sibling components needed the same data and you ended up moving it to the parent.',
  dilo: '"State lives in the closest common ancestor of whoever uses it; no higher, no lower."' },

{ t: 'Controlled component', en: 'Controlled component', dia: 'w16d3',
  def: 'A component that does not keep its own value: it receives it from the parent and tells it when it changes.',
  ya: 'The input with value and onChange that you wired to the form state.',
  dilo: '"I use controlled components so the parent is the single owner of the data."' },

{ t: 'Side effect', en: 'useEffect', dia: 'w16d4',
  def: 'Code that synchronises the component with something external: the network, a timer, a subscription.',
  ya: 'The useEffects you added for almost everything and that sometimes created infinite loops.',
  dilo: '"useEffect is for synchronising with external systems; calculating data or reacting to a click does not need an effect."' },

{ t: 'Race condition', en: 'Race condition', dia: 'w16d4',
  def: 'When the result depends on the order in which simultaneous operations finish, and that order is not guaranteed.',
  ya: 'Changing filter quickly and seeing the previous filter’s data, because its response arrived later.',
  dilo: '"I cancel old requests with AbortController; otherwise a slow response can overwrite a more recent one."' },

{ t: 'Server state', en: 'Server state / data cache', dia: 'w17d1',
  def: 'Data owned by the server, of which the client only has a copy that can go stale. It needs caching, reloading and invalidation.',
  ya: 'The data you loaded into a useState on mount and that nobody updated when it changed.',
  dilo: '"I do not treat server data as local state; I use TanStack Query for caching, deduplication and reloading."' },

{ t: 'Cache invalidation', en: 'Cache invalidation', dia: 'w17d2',
  def: 'Marking stored data as stale so it is fetched again when something changes it.',
  ya: 'The "reload the page to see your change" you told users.',
  dilo: '"Each mutation invalidates exactly the affected keys; I have it documented in a table."' },

{ t: 'Optimistic update', en: 'Optimistic update', dia: 'w17d3',
  def: 'Showing the change instantly, before the server answers, and undoing it if it fails.',
  ya: 'The "like" that is marked straight away on any social network.',
  dilo: '"I use optimism where failure is rare and easy to undo; for payments or medical data, I wait for confirmation."' },

{ t: 'Lazy loading', en: 'Code splitting', dia: 'w21d5',
  def: 'Splitting the JavaScript into chunks and downloading each page only when it is needed.',
  ya: 'The application that took ages to open because it downloaded everything at once.',
  dilo: '"I lazy-load the routes not used on entry; never the initial screen."' },

{ t: 'Core Web Vitals', en: 'LCP, INP, CLS', dia: 'w21d5',
  def: 'Google’s experience metrics: when the main content is visible (LCP), how long it takes to respond to an interaction (INP) and how much the page jumps (CLS).',
  ya: 'The page where you were about to press a button and it moved at the last moment. That is CLS.',
  dilo: '"I measure with Lighthouse on mobile with a slow network, because the user does not perceive API milliseconds, but these metrics."' },

/* ---------- Security ---------- */

{ t: 'Authentication vs authorization', en: 'AuthN / AuthZ', dia: 'w18d3',
  def: 'Authentication: who you are. Authorization: what you can do. They are different things and are checked separately.',
  ya: 'The [Authorize] you put on controllers, which only checks the first one.',
  dilo: '"[Authorize] says there is a session; then I check the role and also that the specific resource belongs to the user."' },

{ t: 'Password hashing', en: 'bcrypt, Argon2', dia: 'w18d1',
  def: 'Transforming the password with a slow, salted algorithm so that, if the database leaks, the passwords cannot be recovered.',
  ya: 'If you ever saw passwords encrypted with AES, or worse, in plain text, in an inherited database.',
  dilo: '"Passwords are not encrypted, they are hashed with a slow algorithm and a unique salt; I use BCrypt with a work factor of 12."' },

{ t: 'JWT', en: 'JSON Web Token', dia: 'w18d2',
  def: 'A signed token containing user data (their id, their role). It is signed, not encrypted: anyone can read it.',
  ya: 'The Bearer token you sent in the Authorization header.',
  dilo: '"The signature guarantees nobody tampered with it, not that it is secret; that is why I put no sensitive data in it and keep it in an HttpOnly cookie."' },

{ t: 'IDOR', en: 'Insecure Direct Object Reference', dia: 'w18d3',
  def: 'Being able to see or touch someone else’s data by changing an id in the URL: /orders/42 → /orders/43.',
  ya: 'Check an old project of yours: if an endpoint filtered only by id and not by user, it had an IDOR.',
  dilo: '"I filter ownership inside the query itself and return 404, not 403, so as not to confirm the resource exists."' },

{ t: 'Rate limiting', en: 'Rate limiting', dia: 'w18d5',
  def: 'Putting a limit on the number of requests accepted per user or IP in a period of time.',
  ya: 'The 429 Too Many Requests errors some external API returned to you.',
  dilo: '"The login has an attempt limit; without it, it is vulnerable to brute force."' },

{ t: 'SQL injection', en: 'SQL injection', dia: 'w19d1',
  def: 'When user data is run as part of the SQL because it was concatenated into the query.',
  ya: 'Any "SELECT … WHERE name = \'" + text + "\'" you have seen in an old project.',
  dilo: '"I close it with parameters, never by filtering characters; the data travels separately and can never become code."' },

{ t: 'XSS', en: 'Cross-Site Scripting', dia: 'w19d2',
  def: 'Getting someone else’s browser to run code entered as data.',
  ya: 'A comment or a name with <script> that was shown as is on a page.',
  dilo: '"React escapes by default, but not in dangerouslySetInnerHTML or in javascript: links; and I have CSP as a second layer."' },

{ t: 'CSP', en: 'Content Security Policy', dia: 'w19d2',
  def: 'A header that tells the browser which origins it may load and run scripts and other resources from.',
  ya: 'Those red "Refused to load the script…" errors in the console.',
  dilo: '"CSP limits the damage if an XSS slips through: even if a script is injected, the browser refuses to run it."' },

{ t: 'CORS', en: 'Cross-Origin Resource Sharing', dia: 'w18d5',
  def: 'The rules with which an API says which other domains may call it from the browser.',
  ya: 'The famous CORS error you "fixed" by setting AllowAnyOrigin.',
  dilo: '"CORS is not a server protection but a browser one; I configure exact origins, never a wildcard with credentials."' },

{ t: 'Input validation at the boundary', en: 'Input validation', dia: 'w19d3',
  def: 'Checking the shape of everything that enters the API (types, ranges, lengths), without trusting that the form already validated it.',
  ya: 'The fields "the frontend already validates" that someone broke by calling the API directly.',
  dilo: '"The client is never trustworthy: form validation is convenience and API validation is security."' },

{ t: 'Transitive dependency', en: 'SCA', dia: 'w19d4',
  def: 'A library you did not install yourself, but that another one you did install pulls in.',
  ya: 'The hundreds of node_modules folders you never asked for.',
  dilo: '"I audit dependencies in CI and turn on Dependabot; most of the code I deploy I did not write."' },

{ t: 'Secrets management', en: 'Secrets management', dia: 'w19d5',
  def: 'Keeping passwords, keys and tokens out of the code, in environment variables or a secrets manager.',
  ya: 'The appsettings.json with the production password pushed to git.',
  dilo: '"A secret that reached the git history gets rotated; deleting it is not enough, because I do not know who cloned it."' },

{ t: 'Threat modeling', en: 'STRIDE', dia: 'w19d6',
  def: 'Analysing the system by thinking like an attacker, in an orderly way, to prioritise what to defend.',
  ya: 'That security review someone did "by eye" before a production release.',
  dilo: '"I go through the OWASP Top 10 category by category, prioritise by impact and likelihood and really attack the top three."' },

{ t: 'OWASP Top 10', en: 'OWASP Top 10', dia: 'w19d6',
  def: 'The reference list of the ten most common security risks in web applications.',
  ya: 'What showed up in the pentest report you were handed to fix.',
  dilo: '"First on the list is broken access control, like IDOR; that is why I test it with integration tests."' },

/* ---------- DevOps ---------- */

{ t: 'Atomic commit', en: 'Atomic commit', dia: 'w20d1',
  def: 'A commit with a single logical change and a message explaining why it was made.',
  ya: 'The "fix", "changes" and "wip" commits nobody understands three months later.',
  dilo: '"I use git add -p to separate changes and write the why in the message; the history is documentation."' },

{ t: 'Merge vs rebase', en: 'Merge vs rebase', dia: 'w20d2',
  def: 'Merge joins two branches keeping the fork; rebase rewrites your branch on top of the other so the history stays linear.',
  ya: 'GitHub’s "Merge" or "Rebase and merge" button you picked without much thought.',
  dilo: '"I rebase my local branches and never shared branches; and if I make a mistake, git reflog lets me go back."' },

{ t: 'Image and container', en: 'Docker image / container', dia: 'w20d3',
  def: 'The image is the immutable package with the application and everything it needs; the container is a run of that image.',
  ya: 'The docker run commands you copied from a README to start a database.',
  dilo: '"I use a multi-stage Dockerfile: I build with the SDK and run with a small image, without root."' },

{ t: 'Docker Compose', en: 'Docker Compose', dia: 'w20d4',
  def: 'A file that defines several containers (API, database, web) and starts them together with one command.',
  ya: 'The docker-compose.yml that got your environment running on day one at a new job.',
  dilo: '"With healthchecks and depends_on, the API waits for the database to be ready; and down -v deletes the data, down does not."' },

{ t: 'CI/CD', en: 'Continuous Integration / Delivery', dia: 'w20d5',
  def: 'CI: building and testing every change automatically. CD: deploying it automatically and repeatably.',
  ya: 'The green or red checks on pull requests in GitHub or Azure DevOps.',
  dilo: '"My pipeline builds, runs the tests against real PostgreSQL and audits dependencies; main is protected and does not allow merging on red."' },

{ t: 'Rollback', en: 'Rollback', dia: 'w20d6',
  def: 'Going back to the previous version when a deployment goes wrong.',
  ya: 'Those nights of failed deployments where nobody knew exactly how to go back.',
  dilo: '"I test the rollback before I need it, and my migrations are backwards compatible so the previous version works with the new database."' },

/* ---------- Performance ---------- */

{ t: 'Percentile (p95, p99)', en: 'Percentile latency', dia: 'w21d1',
  def: 'The p95 is the time below which 95 % of requests fall. It shows what slow users suffer.',
  ya: 'The "on average it is fine" while some users complained it was very slow.',
  dilo: '"The average hides the tail; my targets are by percentile, and a page with 3 calls hits the p95 in 14 % of loads."' },

{ t: 'Load testing', en: 'Load testing', dia: 'w21d2',
  def: 'Simulating many users at once to measure how the system responds.',
  ya: 'Launch day when everything went down because nobody had tested with real traffic.',
  dilo: '"I measure a baseline with realistic data volume; with twenty rows in the database everything is fast and you learn nothing."' },

{ t: 'Cache', en: 'Cache-aside', dia: 'w21d4',
  def: 'Storing the result of something expensive so you do not repeat it, accepting it may go stale.',
  ya: 'That IMemoryCache someone added that later showed out-of-date data.',
  dilo: '"I only cache what is read a lot, changes little and tolerates delay; the invalidation goes in the same commit; and if the gain is small, I remove it."' },

/* ---------- Observability ---------- */

{ t: 'Structured logging', en: 'Structured logging', dia: 'w22d1',
  def: 'Logs with queryable fields (AppointmentId=42) instead of free text.',
  ya: 'Searching with Ctrl+F in a 2 GB log file at three in the morning.',
  dilo: '"I use templates with properties, never interpolation, and I never log personal data; only identifiers."' },

{ t: 'Correlation ID', en: 'Trace ID', dia: 'w22d1',
  def: 'An identifier that follows a request across the whole system and lets you find all its log lines.',
  ya: 'When support told you "the user says it failed at 10" and there was no way to find that request.',
  dilo: '"The trace id goes in every log line and in error responses; the user gives it to me and I find it in seconds."' },

{ t: 'Four golden signals', en: 'Four golden signals', dia: 'w22d2',
  def: 'The four basic metrics of a service: latency, traffic, errors and saturation.',
  ya: 'The Grafana or Application Insights dashboards with dozens of charts nobody knew how to read.',
  dilo: '"I measure symptoms, not causes: a CPU spike does not always affect the user; a rise in errors always does."' },

{ t: 'Metric cardinality', en: 'Metric cardinality', dia: 'w22d2',
  def: 'How many different values a tag can take. Each value creates a new time series.',
  ya: 'The monitoring bill that shot up because someone tagged metrics with the user id.',
  dilo: '"I tag with the route template, never with the real URL or user ids."' },

{ t: 'Distributed trace', en: 'Span', dia: 'w22d3',
  def: 'The full path of a request split into spans with their duration: API, database, external services.',
  ya: 'The "I don’t know where the time goes" solved by putting Stopwatch all over the code.',
  dilo: '"I use OpenTelemetry; in the trace I see which span the time is in without guessing."' },

{ t: 'SLI, SLO and SLA', en: 'Service Level Indicator / Objective / Agreement', dia: 'w22d4',
  def: 'SLI: what you measure (percentage of good requests). SLO: the internal target (99.5 %). SLA: what you promise by contract, with a penalty.',
  ya: 'The contract’s "99.9 % availability" that nobody really measured.',
  dilo: '"I express the SLO as an error budget in minutes per month; that changes the conversation about how much risk we can take."' },

{ t: 'Error budget', en: 'Burn rate', dia: 'w22d4',
  def: 'How much the system can fail without breaking the SLO. Alerts are based on how fast it is being used up.',
  ya: 'The alerts that fired on any spike and that the team ended up silencing.',
  dilo: '"I have two burn-rate alerts, a fast one and a slow one; two well-thought-out alerts are worth more than twenty."' },

{ t: 'Runbook', en: 'Playbook', dia: 'w22d5',
  def: 'The step-by-step procedure to diagnose and mitigate a specific incident.',
  ya: 'The "call Juan, he is the only one who knows how to fix it".',
  dilo: '"I test my runbooks by causing the failure; a runbook nobody has ever followed is fiction."' },

{ t: 'Blameless postmortem', en: 'Blameless postmortem', dia: 'w22d6',
  def: 'The written analysis of an incident that looks for what allowed the error, not who made it.',
  ya: 'The meetings after an outage that ended up looking for someone to blame.',
  dilo: '"The most valuable section is "why we did not detect it sooner"; the actions are for cause and detection, each with an owner and a date."' },

/* ---------- System design ---------- */

{ t: 'Back-of-the-envelope estimation', en: 'Quick estimation', dia: 'w23d2',
  def: 'Rough calculations of traffic, storage and bandwidth to decide the system’s size before designing it.',
  ya: 'When you said "this won’t hold" or "this is overkill" by intuition, without doing the maths.',
  dilo: '"8,000 appointments a day is 1 request per second on average; one instance is plenty. The maths turns opinions into arguments."' },

{ t: 'Scale up vs scale out', en: 'Vertical vs horizontal scaling', dia: 'w23d3',
  def: 'Vertical: a bigger machine. Horizontal: more machines behind a load balancer.',
  ya: 'When the fix for a slow system was "give the server more RAM".',
  dilo: '"I scale vertically while I can, because it is simpler; to scale horizontally, the API must be stateless."' },

{ t: 'Stateless service', en: 'Stateless service', dia: 'w23d3',
  def: 'A service that keeps nothing in memory between requests, so any instance can serve any request.',
  ya: 'The login that got lost when a second server was added because the session was in memory.',
  dilo: '"I look for state in static fields, local caches and temporary files; each one prevents adding instances."' },

{ t: 'Read replica', en: 'Replication lag', dia: 'w23d3',
  def: 'A copy of the database that receives the changes with some delay and is used to spread the reads.',
  ya: 'The "I saved it and it doesn’t show up" that fixed itself when reloading a second later.',
  dilo: '"I solve replication lag by returning the created object in the POST, instead of rereading it from the replica."' },

{ t: 'CAP theorem', en: 'CAP theorem', dia: 'w23d4',
  def: 'When the network splits, a distributed system must choose between consistency (reject) and availability (answer with possibly stale data).',
  ya: 'You probably heard it quoted in some meeting, almost always incorrectly.',
  dilo: '"The choice only appears during a partition; for the agenda I choose consistency, because a double booking is worse than an error."' },

{ t: 'Eventual consistency', en: 'Eventual consistency', dia: 'w23d4',
  def: 'The data ends up correct everywhere, but not instantly.',
  ya: 'The "likes" counter that takes a few seconds to match on every device.',
  dilo: '"Eventual always comes with a number: the dashboard counter can be 5 minutes behind; the agenda cannot."' },

{ t: 'Object storage', en: 'S3, Blob', dia: 'w23d5',
  def: 'A service for storing large files (images, documents) outside the database.',
  ya: 'The images stored in the database that made backups take forever.',
  dilo: '"The database only stores the metadata; the browser uploads straight to storage with a pre-signed URL."' },

{ t: 'Message queue', en: 'Message queue', dia: 'w23d5',
  def: 'An intermediary that stores messages so another process handles them asynchronously.',
  ya: 'RabbitMQ, Azure Service Bus or Kafka, which were sometimes added "just in case".',
  dilo: '"Today I do not need it: my outbox gives me guaranteed delivery; I would add it with several consumers or hundreds of messages per second."' },

{ t: 'Breaking change', en: 'Expand-contract', dia: 'w24d2',
  def: 'An API change that breaks whoever already uses it. It is avoided by adding the new thing, migrating the clients and removing the old thing later.',
  ya: 'Renaming a JSON field and the mobile app stopping working.',
  dilo: '"Adding an optional field does not break; removing or renaming does. I use expand/contract with dates and measure usage before removing."' },

{ t: 'RPO and RTO', en: 'Recovery Point / Time Objective', dia: 'w24d3',
  def: 'RPO: how much data you can afford to lose. RTO: how long the system can be down after a disaster.',
  ya: 'The "when was the last backup?" in the middle of an emergency.',
  dilo: '"A backup that has never been restored is not a backup; I measure the real RTO with a drill."' },

{ t: 'STAR method', en: 'Situation, Task, Action, Result', dia: 'w24d4',
  def: 'A structure for telling an experience in an interview: situation, task, action and result.',
  ya: 'All those times you told about an achievement of yours and it came out messy or too long.',
  dilo: '"The agenda took 1.2 s (situation), it had to go below 300 ms (task), I measured and added an index (action) and it ended at 180 ms (result)."' }

]);
