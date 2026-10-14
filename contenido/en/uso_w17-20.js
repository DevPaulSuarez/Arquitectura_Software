/* What each day is for in a real job, why it matters
   and what to ask (the client, the team or the tech lead) to apply it.
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.USO = Object.assign(window.EN.USO || {}, {

/* ---------- Week 17 · Remote data and UX ---------- */

'w17d1': {
  sirve: 'Separating server state (appointments, pets: data living in the API) from client state (open filter, chosen tab) lets you use tools like TanStack Query for caching, retries and refetching.',
  importa: 'Managing remote data with useState and useEffect ends up in stale data, duplicate requests, race conditions and endless spinners. It is one of the reasons many frontends feel slow and unreliable.',
  preguntas: [
    { a: 'The frontend tech lead', q: 'Which library do we use for server data and how do we configure the cache?', obt: 'The tool and the team’s defaults (fresh data time, retries).' },
    { a: 'The receptionist', q: 'If someone else books an appointment, how long can it take to appear on your screen?', obt: 'How fresh the data needs to be, which decides the refetch strategy.' },
    { a: 'In a code review', q: 'Why is this API data copied into a useState?', obt: 'Removing copies of server state that get out of sync.' }
  ],
  evita: { q: 'Shall I load the data in a useEffect as usual?', por: 'It works in the example and fails in the real app. Ask how caching, errors and refetching are handled in the team.' }
},

'w17d2': {
  sirve: 'Mutations (create, edit, cancel) must leave the cache consistent by invalidating the affected queries, so the screen updates without reloading the page.',
  importa: 'If after creating an appointment the schedule does not show it, the user creates it again and you have a duplicate appointment. Correct invalidation is what makes the app feel reliable.',
  preguntas: [
    { a: 'The frontend tech lead', q: 'Which queries have to be invalidated when an appointment is created?', obt: 'The map of which data depends on which operation.' },
    { a: 'The backend team', q: 'Does the create-appointment response return the complete appointment to update the cache without another request?', obt: 'Whether a refetch can be saved by using the response.' },
    { a: 'The receptionist', q: 'After booking an appointment, what do you expect to see instantly?', obt: 'The visual confirmation the user needs.' }
  ],
  evita: { q: 'Shall I reload the page after saving?', por: 'You lose the state and the feeling of speed. Ask which data changes with the operation and invalidate only that.' }
},

'w17d3': {
  sirve: 'Optimistic updates show the change instantly (the cancelled appointment disappears) and undo it if the server rejects it.',
  importa: 'Done well, the app feels instant even if the network is slow. Done badly, the user thinks something was saved when it was not, and that is worse than waiting. Knowing when to use them is as important as knowing how to build them.',
  preguntas: [
    { a: 'The clinic owner', q: 'Which operations are so important that the user must wait for the server’s confirmation?', obt: 'Where NOT to use optimism (payments, medical data) and where to.' },
    { a: 'The backend team', q: 'How often does appointment cancellation fail?', obt: 'If failure is rare, optimism pays off.' },
    { a: 'The designer', q: 'How do we tell the user if we undo an optimistic change?', obt: 'The message and the way to communicate the failure.' }
  ],
  evita: { q: 'Shall I make everything optimistic so it’s fast?', por: 'Some operations must not fake success. Ask what happens if the user thinks it was saved and it was not.' }
},

'w17d4': {
  sirve: 'Putting in the URL the state that should be shareable (schedule date, filtered vet) allows bookmarks, shared links and the back button.',
  importa: 'If the filter only lives in memory, it is lost on reload and a link cannot be sent to a colleague. Users expect the URL to work, and it is a detail that distinguishes a professional app.',
  preguntas: [
    { a: 'The receptionist', q: 'Do you ever want to show a colleague exactly what you are looking at?', obt: 'Which state deserves to be in the URL so it can be shared.' },
    { a: 'The frontend tech lead', q: 'Which routing library do we use and how do we read search parameters?', obt: 'The team’s common tool.' },
    { a: 'The designer', q: 'What happens on pressing back after changing day in the schedule?', obt: 'The expected navigation behaviour.' }
  ],
  evita: { q: 'Shall I put all the state in the URL?', por: 'The URL becomes unreadable. Ask which state the user wants to remember or share.' }
},

'w17d5': {
  sirve: 'Perceived performance is worked on with loading skeletons, immediate responses to clicks and human thresholds (0.1 s feels instant, 1 s keeps the train of thought, 10 s loses attention).',
  importa: 'The user does not measure milliseconds, they measure feelings. A screen that shows the structure instantly and fills it in afterwards feels faster than one that shows everything at once even if it takes the same time.',
  preguntas: [
    { a: 'The receptionist', q: 'At what time of day do you feel the system is slow?', obt: 'The screens and moments where perceived performance matters most.' },
    { a: 'The designer', q: 'Do we have the loading skeletons for each screen designed?', obt: 'Whether there is a design for loading states or one has to be proposed.' },
    { a: 'The frontend tech lead', q: 'Do we measure users’ real interaction time?', obt: 'Whether there is field data or only local tests.' }
  ],
  evita: { q: 'Shall I put a spinner everywhere?', por: 'A full-screen spinner feels slower. Ask what can be shown already while the rest arrives.' }
},

'w17d6': {
  sirve: 'Walking through the whole app with a user’s and a reviewer’s eyes, and documenting the data and experience decisions, is what you do before showing it to a client or putting it into production.',
  importa: 'Frontend decisions that are not written down get lost: why optimism is used here and not there, what is in the URL. The document lets another developer carry on without breaking the consistency.',
  preguntas: [
    { a: 'The receptionist', q: 'Do a whole morning with the app: booking, cancelling, searching records. Where did you hesitate?', obt: 'Real friction in the complete flow.' },
    { a: 'The frontend tech lead', q: 'Which decisions in this app should someone new know about?', obt: 'The minimum content of the frontend document.' },
    { a: 'QA', q: 'What would you test first to try to break this app?', obt: 'Edge scenarios you did not walk through.' }
  ],
  evita: { q: 'Is it ready for the client?', por: 'Ask what task the client must be able to do without help and check they can.' }
},

/* ---------- Week 18 · Authentication and authorisation ---------- */

'w18d1': {
  sirve: 'Storing passwords with a slow, salted hash (PBKDF2, bcrypt, Argon2) means a database leak does not expose the real passwords.',
  importa: 'Databases leak, and people reuse passwords. If you store the clinic’s passwords badly, the damage reaches your users’ email and bank. It is a mistake that ends up in the news and in fines.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we manage passwords ourselves or use an external identity provider?', obt: 'The decision not to build what is already solved, if the team allows it.' },
    { a: 'The security lead', q: 'What password policy do we require: length, lists of leaked passwords?', obt: 'The currently recommended rules (minimum length, checking against leaked ones) instead of old symbol rules.' },
    { a: 'The clinic owner', q: 'Who will have an account: only staff or pet owners too?', obt: 'The size and kind of user population, which changes the requirements.' }
  ],
  evita: { q: 'Shall I encrypt the passwords with AES?', por: 'Passwords are not encrypted, they are hashed with a slow algorithm. Ask what the team’s standard is for storing passwords.' }
},

'w18d2': {
  sirve: 'A JWT is a signed token that says who the user is and what they can do. Deciding where to store it in the browser (HttpOnly cookie or memory) is a security decision with consequences.',
  importa: 'A JWT is signed, not encrypted: anyone can read its contents. Storing it in localStorage exposes it to any XSS. Understanding what it guarantees and what it does not avoids the most common security mistakes in modern apps.',
  preguntas: [
    { a: 'The security lead', q: 'Where do we store tokens in the browser and why?', obt: 'The team’s decision and the threat it mitigates.' },
    { a: 'The tech lead', q: 'How long do access tokens last and how are they revoked?', obt: 'Duration and revocation strategy, the weak point of JWTs.' },
    { a: 'In a code review', q: 'Is there any sensitive data inside the token’s payload?', obt: 'Spotting information that should not travel readable.' }
  ],
  evita: { q: 'Is the JWT secure because it is encrypted?', por: 'It is not encrypted, it is signed. Ask what the signature guarantees and what it does not.' }
},

'w18d3': {
  sirve: 'Authorisation decides what each user can do. Roles are not enough: a vet can see histories, but only for their clinic; an owner only those of their pets.',
  importa: 'The number one security flaw in web applications (OWASP A01) is broken access control: changing /pets/42 to /pets/43 and seeing someone else’s data. It is avoided by checking the resource, not just the role.',
  preguntas: [
    { a: 'The clinic owner', q: 'What can each kind of person see and do: receptionist, vet, owner?', obt: 'The permissions matrix told by the business.' },
    { a: 'The security lead', q: 'Do we have tests checking that a user cannot access another’s resources?', obt: 'Whether per-resource control is verified or taken for granted.' },
    { a: 'In a code review', q: 'Does this endpoint check that the pet belongs to the user, or only that they are authenticated?', obt: 'Spotting IDOR before it reaches production.' }
  ],
  evita: { q: 'Is it protected with [Authorize]?', por: 'It only checks there is a session. Ask whether the user has a right to that specific resource.' }
},

'w18d4': {
  sirve: 'In React, the session is represented in a context that knows who is logged in, protects routes and reacts when the token expires.',
  importa: 'If the session expires and the app does not handle it, the user loses what they were typing or sees meaningless errors. Hiding a button in the frontend is not security: the real protection is always in the backend.',
  preguntas: [
    { a: 'The receptionist', q: 'How long does the screen usually stay open without being used?', obt: 'How long the session should last so it neither annoys nor risks.' },
    { a: 'The security lead', q: 'How much inactivity do we allow before closing the session?', obt: 'The security limit that has to be balanced with usage.' },
    { a: 'The designer', q: 'What does the user see when the session expires in the middle of a form?', obt: 'The flow so no work is lost.' }
  ],
  evita: { q: 'Shall I just hide the admin buttons?', por: 'Hiding does not protect. Ask whether the backend rejects the operation even if someone calls it by hand.' }
},

'w18d5': {
  sirve: 'Completing the session means implementing token refresh, real logout and the minimum defences: attempt limiting, correct CORS, security headers.',
  importa: 'Without an attempt limit, the login can be brute-forced. A logout that does not invalidate the token leaves the session alive. They are basic defences every auditor checks first.',
  preguntas: [
    { a: 'The security lead', q: 'How many failed login attempts do we allow and what happens after?', obt: 'The lockout or delay policy.' },
    { a: 'The tech lead', q: 'Does logging out invalidate the refresh token on the server?', obt: 'Whether logout is real or only deletes data in the browser.' },
    { a: 'The infrastructure team', q: 'From which domains is the API called?', obt: 'The exact list to configure CORS without wildcards.' }
  ],
  evita: { q: 'Shall I set CORS to * so it works?', por: 'It opens the API to any website. Ask which origins should be able to call it.' }
},

'w18d6': {
  sirve: 'Auditing your own application by actively looking for flaws is what responsible teams do before every important launch.',
  importa: 'It is much cheaper to find your own flaws than to pay for an attacker to find them. A written audit also shows in an interview that you think about security without being asked.',
  preguntas: [
    { a: 'The security lead', q: 'Which checklist do we use: OWASP Top 10, ASVS?', obt: 'The standard to audit against.' },
    { a: 'A teammate', q: 'Try to access another clinic’s data with your test user.', obt: 'An access control test done by someone who did not write the code.' },
    { a: 'The tech lead', q: 'Which security finding would block going to production?', obt: 'The severity threshold that forces a fix before launching.' }
  ],
  evita: { q: 'Is the application secure?', por: 'Nobody can answer yes. Ask which specific threats were reviewed and which are still pending.' }
},

/* ---------- Week 19 · Applied security ---------- */

'w19d1': {
  sirve: 'Injection happens when user data is executed as code (SQL, commands). It is closed with parameterised queries, never by filtering characters.',
  importa: 'SQL injection is still in the OWASP Top 10 after more than twenty years. A single concatenation in a query can expose or delete the whole database. It is a flaw that is not forgiven in a review.',
  preguntas: [
    { a: 'The tech lead', q: 'Is there anywhere we build SQL by concatenating text?', obt: 'The risk points, including FromSqlRaw or dynamic sorting queries.' },
    { a: 'In a code review', q: 'Does this user value reach the query as a parameter or as text?', obt: 'Confirming parameterisation in every new query.' },
    { a: 'The security lead', q: 'Do we have static analysis that detects concatenation in SQL?', obt: 'Whether there is an automatic net as well as human review.' }
  ],
  evita: { q: 'Shall I strip the quotes from the input to avoid injection?', por: 'Filtering characters always leaves gaps. Ask whether the query uses parameters.' }
},

'w19d2': {
  sirve: 'To avoid XSS you have to encode the output according to where the data is rendered. React does it by default in text, but not in dangerouslySetInnerHTML, in javascript: URLs or in special attributes.',
  importa: 'An XSS lets an attacker run code in the receptionist’s browser: steal their session, see records or book fake appointments. Believing React protects you from everything is exactly what leaves the gaps open.',
  preguntas: [
    { a: 'In a code review', q: 'Why is dangerouslySetInnerHTML used here? Is the content sanitised?', obt: 'Justification and sanitising of the few places where React does not protect.' },
    { a: 'The vet', q: 'Do you need formatting (bold, lists) in clinical notes?', obt: 'Whether rich HTML is needed or plain text is enough, which is much safer.' },
    { a: 'The security lead', q: 'Do we have a Content Security Policy configured?', obt: 'A second layer of defence against XSS.' }
  ],
  evita: { q: 'React already prevents XSS, right?', por: 'Only partly. Ask in which specific cases React does not encode the output.' }
},

'w19d3': {
  sirve: 'Validating at the API’s edge (types, lengths, formats) separates malformed data from business rules. Form validation is only a convenience for the user.',
  importa: 'Anyone can skip the frontend and call the API with curl. If the API trusts that the form validated, it accepts anything. The rule is simple: the client is never to be trusted.',
  preguntas: [
    { a: 'The tech lead', q: 'Which validations does only the frontend do today and not the API?', obt: 'The validation gaps an attacker can exploit.' },
    { a: 'The frontend team', q: 'Do we share the validation rules or are they duplicated by hand?', obt: 'Whether there is a risk of the two validations diverging.' },
    { a: 'In a code review', q: 'What happens if I send this field with 10 MB of text?', obt: 'Size limits missing on the input.' }
  ],
  evita: { q: 'If the form already validates, does the API have to as well?', por: 'Yes, always. Ask what happens if someone calls the API without going through the form.' }
},

'w19d4': {
  sirve: 'Auditing dependencies (dotnet list package --vulnerable, npm audit, Dependabot) detects libraries with known vulnerabilities and leaves it automated in CI.',
  importa: 'Most of the code you deploy was not written by you. A vulnerable library is an open door even if your code is perfect. Cases like Log4Shell showed it can affect half the internet in a day.',
  preguntas: [
    { a: 'The tech lead', q: 'Who reviews the dependency alerts and how often?', obt: 'The owner and frequency, so alerts do not pile up unread.' },
    { a: 'The security lead', q: 'What vulnerability severity blocks a merge?', obt: 'The threshold the pipeline must apply.' },
    { a: 'A teammate', q: 'What do we use this library for? Do we still need it?', obt: 'Dependencies that can be removed, the cheapest way to reduce risk.' }
  ],
  evita: { q: 'Shall I update every dependency to the latest version?', por: 'It can break things uncontrollably. Ask which ones have known vulnerabilities and start with those.' }
},

'w19d5': {
  sirve: 'Taking secrets out of the repository (into environment variables or a secret manager), checking the git history and logging without dumping personal data is basic hygiene for any team.',
  importa: 'A secret pushed to git stays in the history even if you delete it in the next commit, and there are bots that crawl public repositories looking for them within minutes. Logs with personal data are a leak waiting to happen.',
  preguntas: [
    { a: 'The tech lead', q: 'Where are production secrets stored and who has access?', obt: 'The secret manager and the access control.' },
    { a: 'The security lead', q: 'If I find a secret in the git history, what is the procedure?', obt: 'Rotate the secret first, clean the history afterwards.' },
    { a: 'The privacy lead', q: 'Which personal data must never appear in the logs?', obt: 'The list of data to mask.' }
  ],
  evita: { q: 'Shall I just delete the file with the key?', por: 'It is still in the history. Ask how the key is rotated, because it has to be considered compromised.' }
},

'w19d6': {
  sirve: 'A threat model (for example with STRIDE) walks through the system thinking like an attacker, prioritises risks and decides defences. It is done when designing and when changing something important.',
  importa: 'Without a method, security depends on what occurs to you that day. With a threat model, you cover each kind of attack systematically and can justify which risks you accept and why.',
  preguntas: [
    { a: 'The clinic owner', q: 'What would be the worst thing that could happen to the clinic’s data?', obt: 'The most valuable assets and the impact of losing them, from the business side.' },
    { a: 'The security lead', q: 'Do we use STRIDE or another method to model threats?', obt: 'The team’s method so the document is comparable.' },
    { a: 'The tech lead', q: 'Which risk on this list are we willing to accept without mitigating?', obt: 'Explicit accepted-risk decisions, signed off by someone.' }
  ],
  evita: { q: 'Can we be hacked?', por: 'Always yes. Ask which assets we protect, from whom and with what controls.' }
},

/* ---------- Week 20 · Git, Docker and CI/CD ---------- */

'w20d1': {
  sirve: 'Small commits with messages explaining the why turn the history into documentation. It is what you use to understand why a line is the way it is (git blame) or to find when a bug came in (git bisect).',
  importa: 'A history of "fix", "changes" and "wip" is useless when a production problem has to be investigated. A good history saves hours every time someone needs to understand a past decision.',
  preguntas: [
    { a: 'The tech lead', q: 'Do we follow a message convention, like Conventional Commits?', obt: 'The team’s format.' },
    { a: 'The tech lead', q: 'Do we prefer squash on merge or keeping every commit?', obt: 'The policy that decides how carefully the intermediate commits must be made.' },
    { a: 'A teammate', q: 'Can you understand what this commit does from the message alone?', obt: 'A quick test of the message’s quality.' }
  ],
  evita: { q: 'Does the commit message really matter?', por: 'It matters when someone reads it months later. Ask how the team investigates bugs in the history.' }
},

'w20d2': {
  sirve: 'Working with short branches, resolving conflicts by understanding both changes and choosing between merge and rebase are daily tasks in any team with more than one person.',
  importa: 'Resolving a conflict by keeping "mine" without understanding the other’s deletes someone else’s work without anyone noticing. Long branches generate huge conflicts. The branching flow defines the team’s speed.',
  preguntas: [
    { a: 'The tech lead', q: 'Which branching flow do we use: trunk-based, GitHub Flow, Git Flow?', obt: 'The team’s branching model.' },
    { a: 'A teammate', q: 'We have a conflict in this file: what were you trying to achieve with your change?', obt: 'The intention of the other change to resolve the conflict without losing anything.' },
    { a: 'The tech lead', q: 'Can branches that are already shared be rebased?', obt: 'The rule that avoids rewriting history others use.' }
  ],
  evita: { q: 'Shall I accept my changes in the conflict and carry on?', por: 'You may delete someone else’s work. Ask what the other change was trying to do before resolving.' }
},

'w20d3': {
  sirve: 'A multi-stage Dockerfile builds the API in one image and copies only what is needed into another small image. That image runs the same on your machine, in CI and in production.',
  importa: '"It works on my machine" disappears with containers. A small image, without build tools or a root user, deploys faster and has less attack surface.',
  preguntas: [
    { a: 'The infrastructure team', q: 'Which base image do we use and who keeps it up to date?', obt: 'The approved image and the update policy.' },
    { a: 'The security lead', q: 'Must containers run without the root user?', obt: 'The container’s security requirements.' },
    { a: 'The tech lead', q: 'How big should the final image be?', obt: 'A size target that forces you to use stages and not copy too much.' }
  ],
  evita: { q: 'Shall I copy the whole project into the container?', por: 'It brings in secrets, source code and junk. Ask what the image needs to run and use a .dockerignore.' }
},

'w20d4': {
  sirve: 'Compose defines API, database and web in one file to bring everything up with one command. It is the standard way for someone new to have the environment working in minutes.',
  importa: 'If setting up the local environment takes a day of instructions, every new person loses that day and every machine ends up slightly different. With Compose, the environment is versioned, reproducible code.',
  preguntas: [
    { a: 'A new teammate', q: 'How long did it take you to get the project working and where did you get stuck?', obt: 'The steps missing from the compose file or the README.' },
    { a: 'The tech lead', q: 'Must the local database’s data survive a docker compose down?', obt: 'Whether persistent volumes are needed and how to reset from scratch.' },
    { a: 'The infrastructure team', q: 'Do we also use Compose in any shared environment or only locally?', obt: 'The file’s scope and what it must meet.' }
  ],
  evita: { q: 'Shall I put the passwords in compose.yaml?', por: 'They end up in the repository. Ask how the team handles local environment variables.' }
},

'w20d5': {
  sirve: 'A CI pipeline builds, runs the tests against a real database and audits dependencies on every push, without depending on anyone remembering.',
  importa: 'Without CI, errors reach main and another teammate discovers them the next day. With CI, they are discovered in minutes and on the branch of whoever caused them. It is a team’s basic safety net.',
  preguntas: [
    { a: 'The tech lead', q: 'Which checks must pass to be able to merge into main?', obt: 'The branch protection rules and mandatory checks.' },
    { a: 'The infrastructure team', q: 'How long does the pipeline take today and what is the acceptable maximum?', obt: 'A speed target for the pipeline.' },
    { a: 'The team', q: 'Which tests do you do by hand before a merge that the pipeline could do?', obt: 'Steps to automate.' }
  ],
  evita: { q: 'Shall I disable the failing step so I can merge?', por: 'It removes the safety net. Ask why it fails and fix it, or mark it as pending with an owner.' }
},

'w20d6': {
  sirve: 'Proving anyone can clone and run the project, and writing down how it is deployed and how it is rolled back, is what puts a system in the team’s hands and not one person’s.',
  importa: 'A project only one person knows how to deploy is a risk for the company. Having the rollback written before you need it is what turns an incident of hours into one of minutes.',
  preguntas: [
    { a: 'A teammate', q: 'Can you clone the repository and bring everything up following only the README?', obt: 'A real reproducibility test.' },
    { a: 'The infrastructure team', q: 'How do we go back to the previous version if the deployment goes wrong?', obt: 'The documented, tested rollback procedure.' },
    { a: 'The tech lead', q: 'What has to be checked right after each deployment?', obt: 'The post-deployment checklist.' }
  ],
  evita: { q: 'Shall I deploy and look at it if it fails?', por: 'Looking at it live is slow and stressful. Ask what the rollback plan is before deploying.' }
}

});
