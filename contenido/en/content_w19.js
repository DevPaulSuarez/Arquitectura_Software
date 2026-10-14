window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 19,
  phase: 'Security',
  title: 'Applied security: everything that is not logging in',
  idea: 'Last week you put in doors: passwords, tokens, roles. This week you discover that an attacker almost never knocks on the door. They come in through the window you left open without knowing it: a text field interpreted as code, a URL your server visits out of obedience, a two-year-old library with a published flaw, an API key left in the git history. None of those things is fixed with more login. They are fixed by validating at the edge, encoding on output, knowing which dependencies you use and treating secrets as what they are. By the end of the week you will look at your own code with different eyes: not asking whether it works, but asking what happens if someone sends what you did not expect.',
  res: [
    { t: 'OWASP Top 10 (2025)', u: 'https://owasp.org/Top10/2025/', note: 'The industry’s reference list, 2025 edition. Do not read it all: each day I send you to a specific category.' },
    { t: 'OWASP Cheat Sheet — Input Validation', u: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html', note: 'Short and practical. It explains the difference between validating, sanitising and encoding, which is where almost everyone gets confused.' },
    { t: 'OWASP Cheat Sheet — Cross Site Scripting Prevention', u: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', note: 'The XSS guide by context. The important thing is the idea that the same data is safe in one place and dangerous in another.' },
    { t: 'ASP.NET Core security documentation', u: 'https://learn.microsoft.com/en-us/aspnet/core/security/', note: 'The official security index for your stack. Use it as a reference when you need the specific way to do something in .NET.' },
    { t: 'Microsoft Learn — Safe storage of app secrets', u: 'https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets', note: 'User secrets in development and layered configuration.' },
    { t: 'OWASP Top 10:2025 — A05 Injection', u: 'https://owasp.org/Top10/2025/A05_2025-Injection/', note: 'The injection category of the 2025 edition: description, prevention and example attacks.' },
    { t: 'OWASP Top 10:2025 — A03 Software Supply Chain Failures', u: 'https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/', note: 'The dependencies and supply chain category of the 2025 edition.' }
  ],
  days: [
    {
      t: 'Injection: when your data becomes code',
      obj: 'Understand why injection exists, demonstrate it in your own code and close it with parameters instead of text filters.',
      why: 'It is the most repeated security question in interviews and the one most people answer badly: they say "I escape the quotes" instead of "I separate code from data". Being able to explain the difference puts you above average immediately.',
      study: { r: 5, what: 'Read the A05:2025 Injection category of the OWASP Top 10. About 10 minutes. Look for a single idea: injection happens when user data is mixed with the instruction the engine is going to interpret. Notice that it includes SQL, but also operating system commands and LDAP: it is the same flaw in different languages.',
        pasos: [
          'Read "Description." (~3 min): when an application is vulnerable.',
          'Read "How to prevent." (~3 min): parameterised queries above everything.',
          'Read "Example attack scenarios." (~2 min) and rewrite the first example with VetCare’s tables.',
          'Look in your code for any SQL built by concatenating text and note it down to fix.'
        ] },
      ex: {
        title: 'The same query, concatenated and parameterised',
        body: `// BAD: the user's text becomes part of the instruction
var name = request.Query["name"];
var sql = "SELECT * FROM pet WHERE name = '" + name + "'";
var rows = await db.Database.SqlQueryRaw<PetDto>(sql).ToListAsync();

// If someone sends:  ' OR '1'='1
// the database gets: SELECT * FROM pet WHERE name = '' OR '1'='1'
// and returns every pet in the clinic.

// If someone sends:  '; UPDATE app_user SET role = 2 WHERE email = 'me@mail.com'; --
// the database gets two instructions and the second gives you the admin role.

// GOOD: the user's text never forms part of the instruction
var rows = await db.Database
    .SqlQueryRaw<PetDto>(
        """SELECT id AS "Id", name AS "Name" FROM pet WHERE name = {0}""",
        name)
    .ToListAsync();
// ({0} is not pasted into the text: EF turns it into a parameter. The aliases
//  go in quotes so they match the DTO's properties,
//  as you saw in week 15.)

// The instruction travels fixed and the value travels separately, through a channel
// the engine never interprets as SQL. There is nothing to escape
// because they were never mixed.

// EVEN BETTER: LINQ already parameterises for you
var rows = await db.Pets
    .Where(p => p.Name == name)
    .Select(p => new PetDto(p.Id, p.Name))
    .ToListAsync();`
      },
      steps: [
        'Open your project and look for anywhere you build SQL by concatenating or interpolating strings. Check especially the raw queries you wrote in week 15 with SqlQueryRaw. Note each one in a list.',
        'Start the API and really attack one from the browser or curl: send the value \' OR \'1\'=\'1 in the search parameter. If you get more rows than you should, you have just demonstrated the vulnerability in your own system. Keep the response as evidence.',
        'Fix that query using positional parameters {0} or NpgsqlParameter. Repeat the attack and confirm it now returns zero rows, because it is literally looking for a pet called \' OR \'1\'=\'1.',
        'Now look for injection outside SQL: any Process.Start, any file path built with user text, any string that ends up in an interpreter. If you have any, note how you would close it.',
        'Write an "Injection" section in docs/security.md with three things: where the risk was, which attack you used to demonstrate it, and why parameterisation closes it at the root instead of filtering characters.'
      ],
      vet: [
        'Check week 15’s SummaryAsync query (the monthly summary): it was raw SQL. Confirm the year arrives as a parameter and not concatenated, and write a test that passes a malicious value and checks it breaks nothing.',
        'Add a comment at the top of database/queries.sql reminding that every new query must use parameters, so your future self does not forget when in a hurry.'
      ],
      edge: [
        'Escaping quotes by hand is not a solution: there is always an encoding, a character set or an edge case that slips past you. The only real defence is for the data to travel through a different channel from the instruction.',
        'Table and column names cannot be parameterised. If you need to sort by a column the user chooses, do not paste it into the SQL: validate against a fixed allowlist of permitted columns and use the list’s value, not the user’s.',
        'An ORM does not make you immune. EF Core parameterises LINQ, but FromSqlRaw and SqlQueryRaw with normal interpolation open the hole again. FromSqlInterpolated does parameterise; the difference is in the argument’s type, not in how it looks.'
      ],
      quiz: [
        { q: 'Why is parameterising better than escaping dangerous characters?', a: 'Because escaping tries to guess which characters are dangerous in a context that changes, while parameterising removes the problem at the root: the instruction is sent to the engine already compiled and the value travels through a separate channel that is never interpreted as code. There is nothing to guess.' },
        { q: 'If I use EF Core with LINQ, can I have SQL injection?', a: 'With normal LINQ no, because EF Core translates to a parameterised query. But if you use FromSqlRaw or SqlQueryRaw concatenating user text, yes: the ORM gives you the safe channel but does not force you to use it.' },
        { q: 'A user needs to sort the results by the column they choose. How do you do it without opening an injection?', a: 'You validate the value received against a fixed allowlist of permitted columns in your code and use the item from that list, never the user’s string. Identifiers cannot be parameterised, so the only defence is for the set of possible values to be closed and defined by you.' },
        { q: 'What do SQL injection, command injection and XSS have in common?', a: 'All three are the same flaw in different interpreters: user data reaches an engine that interprets it as instructions because code was never separated from data. The interpreter changes (the database, the shell, the browser) but the cause and the defence pattern are identical.' }
      ],
      out: 'An injection vulnerability demonstrated with a real attack against your own API, fixed with parameters, and documented in docs/security.md.',
      file: 'docs/security.md'
    },
    {
      t: 'XSS and output encoding',
      obj: 'Understand that the same data is safe or dangerous depending on where you render it, and check what protection React really gives you and where it stops.',
      why: 'Many people believe "I use React, I am protected". It is half true, and knowing exactly where that protection ends is what separates someone who understands from someone who repeats. It also connects with the decision of where you stored the token in week 18.',
      study: { r: 2, what: 'Read the introduction and the contexts section of the XSS Cheat Sheet. About 12 minutes. Keep one idea: there is no "safe data", there is "data encoded for the context it goes into". The same text needs different encoding in HTML, in an attribute, inside JavaScript and in a URL.',
        pasos: [
          'Read "Introduction" and "Framework Security" (~4 min): React escapes for you, but not everywhere.',
          'Read "XSS Defense Philosophy" and the introduction of "Output Encoding" (~3 min).',
          'Read the HTML, attribute, JavaScript and URL subsections inside Output Encoding (~5 min).',
          'Read "Dangerous Contexts" (~2 min).',
          'Look in your frontend for dangerouslySetInnerHTML and hrefs built with user data: they are the gaps where React does not protect you.'
        ] },
      ex: {
        title: 'Where React protects you and where it leaves you alone',
        body: `// SAFE: React escapes the text when rendering it
function Note({ text }: { text: string }) {
  return <p>{text}</p>;
}
// If text is  <img src=x onerror=alert(1)>
// the browser shows that literal text. Nothing runs.

// DANGEROUS: you explicitly asked it not to escape
function RichNote({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}
// Here the onerror does run. The prop's name is a
// warning, not a style detail.

// DANGEROUS: href accepts javascript: as a scheme
<a href={userUrl}>View record</a>
// If userUrl is  javascript:fetch('/api/...')
// the click runs code. React does not validate URL schemes.

// Defence for the link: an allowlist of schemes
function safeUrl(u: string): string {
  try {
    const parsed = new URL(u, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';
  }
}

// And the header that limits the damage if something slips through. CAREFUL: it has
// to go on the response that delivers index.html (the page), not only on the API's
// JSON. If in production the API also serves the web (app.UseStaticFiles and
// MapFallbackToFile("index.html")), this middleware covers it:
app.Use(async (ctx, next) => {
    ctx.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'";
    await next();
});
// To test it locally with Vite: npm run build and then npm run preview,
// with the header in vite.config.ts:
//   preview: { headers: { 'Content-Security-Policy': "default-src 'self'; ..." } }
// (npm run dev injects inline scripts for hot reload and clashes with
//  a strict CSP: do not test it there.)`
      },
      steps: [
        'Go into your week 16 form (or create a pet) and type <img src=x onerror=alert(1)> as the pet’s name. Save it and reload the schedule. Confirm it is shown as plain text. You have just checked that React escapes by default.',
        'Search the whole web project for the string dangerouslySetInnerHTML. If it appears anywhere, look at where that HTML comes from: if it can come from a user, you have an XSS. If it does not appear, note that you checked.',
        'Look for any href or src attribute that receives a dynamic value. Implement the example’s safeUrl function and use it in all of them.',
        'Add the Content-Security-Policy header as in the example: in the API middleware (next to week 18’s headers) and in Vite’s preview. Open the web with npm run build and npm run preview, with the browser console open, and fix the violations that appear until none are left.',
        'Write an "XSS" section in docs/security.md with three points: what React protects automatically, the two ways it slips past it and what your CSP does if everything else fails.'
      ],
      vet: [
        'If you store formatted clinical notes in VetCare, decide now: either you store plain text and render it with line breaks, or you store Markdown and convert it to HTML with a library that sanitises. Do not invent your own sanitiser.',
        'Check week 18’s decision: if the token is in localStorage, a single XSS takes it. If it is in an HttpOnly cookie, it does not. Write that sentence in docs/security.md as the explicit justification of your choice.'
      ],
      edge: [
        'The right encoding depends on the context. What is safe inside a <p> can break an attribute if it contains quotes, and inside a <script> tag no HTML encoding saves you. Never put user data inside a script block.',
        'Stored XSS is worse than reflected: the reflected one needs the victim to click your link, the stored one fires by itself every time someone opens the page. A malicious pet name attacks the whole reception desk.',
        'CSP is a safety net, not a substitute for encoding well. And a CSP with unsafe-inline in script-src protects from practically nothing; if you need it for your app to work, the problem is in the app.'
      ],
      quiz: [
        { q: 'Why does React protect from XSS by default and in which two cases does it stop protecting you?', a: 'Because when interpolating a value in JSX it escapes it as text, never as markup. It stops protecting you when you use dangerouslySetInnerHTML, which is an explicit request not to escape, and when you put a user value in an attribute that accepts code, such as an href with the javascript: scheme.' },
        { q: 'What is the difference between reflected and stored XSS, and which is more serious?', a: 'Reflected comes back in the response to a manipulated request, so the attacker has to get the victim to open their link. Stored stays saved in your database and runs for everyone who sees that page, with no further action from the attacker: it is more serious because it scales by itself.' },
        { q: 'What is Content-Security-Policy and why does it not replace encoding well?', a: 'It is a header that tells the browser where it may load and run resources from, so that an injected script never gets to run. It does not replace encoding because it is a second line: it reduces the damage of a flaw, but if your app needs unsafe-inline to work, that line almost disappears.' },
        { q: 'How is XSS related to the decision of where to store the session token?', a: 'An XSS runs JavaScript with all your page’s permissions, so it can read anything in localStorage, including the token. A cookie marked HttpOnly is not accessible from JavaScript, so the same XSS cannot steal it: that is why week 18’s choice matters so much.' }
      ],
      out: 'An active CSP with no violations in the console, every dynamic link validated by scheme, and the XSS section written in docs/security.md.',
      file: 'docs/security.md'
    },
    {
      t: 'Validate at the edge and do not trust the client',
      obj: 'Put an explicit validation layer at the API’s entrance, separate from the business rules, and understand why the form’s validation does not count.',
      why: 'It is the boundary that defines whether your system is robust or fragile. And it is the answer to a very common interview question: "I already validate in the frontend, why validate again?". The short answer is that the frontend is optional for the attacker.',
      study: { r: 1, what: 'Read the Input Validation Cheat Sheet, especially the sections on allowlist versus denylist and syntactic versus semantic validation. About 10 minutes. Keep this: validating is not sanitising. Validating is rejecting what does not fit; sanitising is modifying what arrives, and silently modifying almost always hides a bug.',
        pasos: [
          'Read "Introduction" and "Input Validation Strategies" (~3 min): syntactic versus semantic validation.',
          'Read "Allowlist vs Denylist" (~2 min): why the denylist always falls short.',
          'Read "Parse Safely, Then Validate" and "Validate Structured Data" (~3 min).',
          'Read "Common Pitfalls" (~2 min).',
          'For each VetCare DTO separate what is validated at the edge (format) and what is validated in the domain (business rules).'
        ] },
      ex: {
        title: 'Three different layers people confuse',
        body: `// LAYER 1 - Input validation (syntactic). At the API's edge.
// Question: does this have the shape I expect?
public sealed record CreateAppointmentDto(
    Guid PetId,
    Guid VetId,
    DateTimeOffset Start,
    int DurationMinutes,
    string? Reason);

// Returns the errors per field; empty = all good
static Dictionary<string, string[]> Validate(CreateAppointmentDto d)
{
    var errors = new Dictionary<string, string[]>();

    if (d.PetId == Guid.Empty)
        errors["petId"] = ["Required."];

    if (d.DurationMinutes is < 10 or > 180)          // week 11's limits
        errors["durationMinutes"] = ["Must be between 10 and 180."];

    if (d.Reason is { Length: > 500 })
        errors["reason"] = ["Maximum 500 characters."];

    return errors;
}

// LAYER 2 - Business rules (semantic). In the domain.
// Question: does this make sense in my clinic?
//   - the vet exists and is active
//   - the pet has not been deregistered
//   - there is no overlap with another appointment  -> you already have it
// These rules do NOT go in the DTO because they need the database.

// LAYER 3 - Integrity constraints. In PostgreSQL.
// Question: can this ever come to exist, whatever happens?
//   CHECK (ends_at - starts_at BETWEEN interval '10 minutes' AND interval '180 minutes')
//   EXCLUDE USING gist (...)  -> your overlap constraint
// It is the last net: it protects even if the bug is in your code.

// The endpoint answers 422 with problem details (RFC 9457, week 11).
// 400 is kept for JSON that cannot even be read: ASP.NET Core
// returns that one by itself.
var errors = Validate(dto);
if (errors.Count > 0)
    return Results.ValidationProblem(errors, statusCode: 422);`
      },
      steps: [
        'Choose the three most important endpoints of your API and write for each one, on paper or in a comment, what exact shape each field must have: type, range, maximum length, whether it accepts null. If you do not know the limit of something, decide it now.',
        'Implement the input validation of those three endpoints. You can do it by hand as in the example or with a week 12 endpoint filter so you do not repeat yourself. Return 422 with the problem details format you already use, as you decided in week 11.',
        'Check with curl what happens when you send what is not expected: a body with no fields, a duration of 100000, a 10000-character reason and malformed JSON. The malformed JSON must give 400 and the other three 422, all with a useful message; never 500.',
        'Adjust the request body size limit. Kestrel already cuts at about 30 MB by default, but for an appointments API that is a lot: lower it, for example to 1 MB, with builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 1_000_000). Send it a 5 MB JSON and check that it rejects it.',
        'Go over your week 16 React form and check that the error messages it shows match what the API really validates. If the form allows something the API rejects, the user gets frustrated; if the form blocks something the API allows, you are losing a feature without meaning to.'
      ],
      vet: [
        'Create in VetCare a reusable endpoint filter that validates the incoming DTO and cuts the request with 422 before it reaches the handler (or reuse week 12’s ValidationFilter), so no new endpoint slips past you.',
        'Write an API test for each validation rule: send the invalid value and check the 422 and the field name in the response. They are cheap tests and prevent silent regressions.'
      ],
      edge: [
        'Allowlist always, denylist never. Listing what is allowed is a closed set you control; listing what is forbidden is a race you lose, because there is always a variant you did not think of.',
        'Silent sanitising creates odd bugs: if you trim a text to 500 characters without warning, the user thinks they saved something that was not saved. Reject and explain; only normalise unambiguous things such as removing spaces at the start and end.',
        'Validating on the client is ergonomics, not security. The attacker does not use your form: they use curl. Every validation that matters must also exist on the server, and if it can be expressed as a constraint, in the database too.'
      ],
      quiz: [
        { q: 'Why is validating in the React form not enough?', a: 'Because the form is only a convenient way to build an HTTP request, and anyone can build that request without it using curl or the browser console. Client validation improves the experience; the server’s is the only one an attacker cannot skip.' },
        { q: 'What is the difference between validating and sanitising, and which do you prefer?', a: 'Validating is rejecting input that does not meet the expected shape; sanitising is modifying it so it does. You prefer validating, because sanitising silently changes the user’s data and turns a visible error into odd behaviour that will show up much later.' },
        { q: 'Why separate input validation from business rules?', a: 'Because they answer different questions and need different things: input validation asks whether the data has the right shape and can be decided by looking only at the request, while business validation asks whether it makes sense in the domain and normally needs to query the system’s state.' },
        { q: 'What does the application gain if the same rule exists in the API and as a constraint in PostgreSQL?', a: 'It gains a last-resort net: if a bug, a half-finished migration or a manual script tries to write impossible data, the database rejects it. Validation in the API gives a good error message; the constraint guarantees that invalid data never comes to exist.' }
      ],
      out: 'Three endpoints with explicit input validation, a body size limit, and tests checking each rule returns 422.',
      file: 'docs/security.md'
    },
    {
      t: 'Dependencies: the code you did not write',
      obj: 'Know exactly which libraries you use, detect the ones with known vulnerabilities and leave that check automated.',
      why: 'Most of the code you run in production was not written by you. It is the attack vector that has grown the most and the one almost no junior mentions. Saying in an interview "I run dotnet list package --vulnerable in CI" is a very strong sign of maturity.',
      study: { r: 6, what: 'Read the A03:2025 Software Supply Chain Failures category (in 2021 it was called Vulnerable and Outdated Components). About 8 minutes. Notice something uncomfortable: the library does not need to be malicious, it is enough for it to have a published flaw that you did not hear about. The problem is not the quality of other people’s code but your lack of visibility.',
        pasos: [
          'Read "Background." (~2 min): why this category went up in the 2025 edition.',
          'Read "Description." (~3 min) and mark the points that apply to VetCare.',
          'Read "How to prevent." (~3 min) and turn each point into a specific task.',
          'Run dotnet list package --vulnerable and npm audit, and note what comes out.'
        ] },
      ex: {
        title: 'Inventory and audit on both sides of the project',
        body: `# Backend: what I have installed, including what is pulled in
dotnet list package --include-transitive

# Backend: which ones have published vulnerabilities
# (since .NET 8, dotnet restore already warns by itself with warnings NU1901-NU1904)
dotnet list package --vulnerable --include-transitive
#
# Project 'VetCare.Api' has the following vulnerable packages
#    [net10.0]:
#    Top-level Package      Severity   Resolved   Advisory URL
#    > Some.Library          High       4.1.0      https://github.com/advisories/GHSA-xxxx

# Backend: what is outdated (not the same as vulnerable)
dotnet list package --outdated

# Frontend
npm audit
npm audit --omit=dev          # only what reaches production
npm outdated

# Fix with judgement, not by brute force:
npm audit fix                 # only compatible changes
# npm audit fix --force       # can break your app: read it first

# In CI (GitHub Actions) we make the pipeline fail if anything is vulnerable:
#   - name: Audit .NET dependencies
#     run: |
#       dotnet list package --vulnerable --include-transitive 2>&1 | tee audit.txt
#       ! grep -q "has the following vulnerable packages" audit.txt
#
#   - name: Audit npm dependencies
#     run: npm audit --audit-level=high --omit=dev`
      },
      steps: [
        'Run dotnet list package --include-transitive on your solution and look at the real number of packages. It almost always surprises: transitive dependencies usually multiply by ten the ones you declared.',
        'Run dotnet list package --vulnerable --include-transitive and npm audit. Note each finding with its severity and open the advisory of at least one to read exactly what it allows.',
        'Fix what is high or critical. If the vulnerability is in a transitive dependency, the solution is usually to upgrade the top-level package that pulls it in, not to install the transitive one by hand.',
        'For each package you use, ask yourself three questions and note the answers: when was its last commit, how many people maintain it, and could I replace it with something from the standard library. An unmaintained thirty-line dependency is worse than writing those thirty lines.',
        'Add the two audit steps to your CI pipeline and turn on Dependabot or Renovate in the repository to get automatic notices when a new vulnerability comes out.'
      ],
      vet: [
        'Create docs/dependencies.md with a table: package, what I use it for, could I remove it. Review it every time you are about to add a new one and asking yourself whether you really need it will become a habit.',
        'Pin the versions of VetCare’s Docker images to a specific tag instead of latest, so a rebuild does not change the base underneath you without warning.'
      ],
      edge: [
        'Outdated is not the same as vulnerable. An old version with no published flaws can be perfectly safe, and upgrading to the latest by habit introduces behaviour changes for free. Prioritise by real severity, not by version number.',
        'npm audit fix --force can bump major versions and break your build. Run it only when you have green tests to warn you, and never right before a delivery.',
        'Installing a package can run scripts on your machine. Distrust names similar to popular ones: that is how typosquatting works. Always check the exact name before installing.'
      ],
      quiz: [
        { q: 'What is the difference between a direct and a transitive dependency, and why does it matter for security?', a: 'You declared the direct one; the transitive one arrives because another dependency needs it. It matters because most vulnerabilities live in the transitive ones, which do not appear in your project file and are therefore the ones you never look at.' },
        { q: 'You find a high vulnerability in a transitive dependency. How do you fix it?', a: 'Usually by upgrading the direct dependency that pulls it in to a version that already includes the fix. Installing the transitive one directly to force its version works but is a fragile patch, so it is only used when the top-level package has not published a fix yet.' },
        { q: 'Why fail the CI pipeline on a high vulnerability instead of just warning?', a: 'Because a warning that does not block gets ignored. If the pipeline fails, the decision to go ahead has to be conscious and explicit, and it is recorded instead of getting lost in the noise of notifications.' },
        { q: 'When is it better to write something yourself instead of adding a dependency?', a: 'When the package solves something small you can write in a few lines, or when it is unmaintained and has few eyes on it. Every dependency is code you run with your permissions and surface you have to watch forever.' }
      ],
      out: 'A clean dependency audit on backend and frontend, both steps integrated in CI, and docs/dependencies.md created.',
      file: 'docs/dependencies.md'
    },
    {
      t: 'Secrets, configuration and logs without leaks',
      obj: 'Get every secret out of the repository, know how to check whether one was ever there, and log useful information without dumping personal data or credentials.',
      why: 'A key leaked in git is the cheapest flaw to commit and the most expensive to fix, because the history is permanent. And logs that dump sensitive data turn your diagnostic tool into an unprotected database of personal information.',
      study: { r: 4, what: 'Read the app secrets page and then, from the side index, the Data Protection one. About 12 minutes. The key idea: configuration is layered and each environment provides its own, so the secret never has to live in the file you push to the repository.',
        pasos: [
          'Read the introduction and "Work with environment variables" (~3 min).',
          'Read "Use the Secret Manager tool" and "How the Secret Manager tool works" (~4 min): where the secrets are stored and why it only works in development.',
          'Read "Set a secret" and "Access a secret" (~3 min).',
          'From the side index skim Data Protection (~2 min).',
          'Search the git history for connection strings or keys with git log -p and note whether any was ever in the repository.'
        ] },
      ex: {
        title: 'From the connection string in the repository to layered configuration',
        body: `// BAD: appsettings.json, versioned in git forever
{
  "ConnectionStrings": {
    "VetCare": "Host=prod.db;Username=admin;Password=Sup3rS3cret!"
  },
  "Jwt": { "Key": "the-whole-team-can-see-this-key" }
}

// GOOD: appsettings.json only with what is not secret
{
  "ConnectionStrings": { "VetCare": "" },
  "Jwt": { "Issuer": "vetcare", "ExpiryMinutes": 15 }
}

// Development: outside the repository, per user
//   dotnet user-secrets init
//   dotnet user-secrets set "ConnectionStrings:VetCare" "Host=localhost;..."
//   dotnet user-secrets set "Jwt:Key" "..."

// Production: environment variables (double underscore nests)
//   ConnectionStrings__VetCare=...
//   Jwt__Key=...

// The code does not change: the configuration provider resolves the layer
var connection = builder.Configuration.GetConnectionString("VetCare")
    ?? throw new InvalidOperationException("The connection string is missing.");

// Logging that helps without leaking
_logger.LogInformation(
    "Appointment {AppointmentId} created by user {UserId} for pet {PetId}",
    appointment.Id, userId, appointment.PetId);
// Identifiers yes; names, emails, phone numbers and tokens no.

// NEVER:
// _logger.LogInformation("Login of {Email} with token {Token}", email, token);
// _logger.LogError(ex, "Failure with payload {Payload}", JsonSerializer.Serialize(dto));`
      },
      steps: [
        'Search the whole project for the words password, secret, key, token and connectionstring case-insensitively. Check each result and decide whether it is a real value or just a name.',
        'Move every development secret to user-secrets with dotnet user-secrets set, and leave in appsettings.json only the structure with empty values. Confirm the API still starts.',
        'Check that appsettings.Development.json contains no secret (that file can be versioned if it only has harmless settings) and that .gitignore covers .env and any local configuration file. If your project is in git, search the history too: a secret deleted in the last commit is still in the previous ones.',
        'If you find a secret that made it into the history, the only correct thing is to rotate it: generate a new key and invalidate the old one. Cleaning the history is not enough because you do not know who cloned it. Note the rotation as a task.',
        'Go over your logger calls. Replace any name, email, phone number or token with an identifier. Add logging of security events: successful login, failed login, and access denied, always with identifiers.'
      ],
      vet: [
        'Create a .env.example file in VetCare with every key the application needs and empty sample values, so anyone knows what to configure without anyone pushing a real value.',
        'Add a "Secrets" section to docs/security.md with the list of secrets VetCare uses, where each one lives in development and in production, and how often it is rotated.'
      ],
      edge: [
        'Deleting a secret in a new commit does not remove it: it is still in the history and in every clone. If it was ever published, consider it compromised and rotate it, even if you rewrite the history afterwards.',
        'Unfiltered exceptions are a leak: a stack trace or a database error returned to the client reveals internal structure. In production always return generic problem details and keep the detail only in your logs.',
        'Logs are personal data too. If you store emails or patient diagnoses in plain text in a logging system without access control, you have created an unprotected copy of your database.'
      ],
      quiz: [
        { q: 'Why is deleting a secret from the code and committing not enough?', a: 'Because git keeps the whole history: the value can still be recovered from previous commits and from any clone someone already has. The only action that really closes the risk is rotating the secret so the leaked value stops working.' },
        { q: 'How does layered configuration work in ASP.NET Core and why does it help with secrets?', a: 'Providers are applied in order and the last one wins, so appsettings.json provides the structure, user-secrets fills it in during development and environment variables in production. The code always asks for the same key and the real value never needs to be in a versioned file.' },
        { q: 'What information must never appear in a log and what do you put instead?', a: 'Passwords, tokens, authorisation headers, card numbers and personal data such as emails, phone numbers or diagnoses. Instead you log opaque identifiers, which let you reconstruct what happened by querying the database with the right permissions.' },
        { q: 'Why is returning the stack trace to the client a security problem?', a: 'Because it reveals paths, class names, library versions and sometimes fragments of queries, which is exactly the map an attacker needs to choose their next attempt. The detail should go to your logs and the client should only get a generic message with a correlation identifier.' }
      ],
      out: 'Zero secrets in the repository, user-secrets configured, .env.example created and logs reviewed with no personal data.',
      file: 'docs/security.md'
    },
    {
      t: 'VetCare threat model (weekly exam)',
      obj: 'Think like an attacker about your own system in a structured way, prioritise what you find and leave a document you can defend in an interview.',
      why: 'Finding loose flaws is useful; having a method to look for them is what makes you reliable. A written threat model is, moreover, one of the artefacts that impresses most in an interview because almost nobody brings one.',
      study: { r: 0, what: 'Go over the full OWASP Top 10 index, just the ten titles. About 5 minutes. Today you do not read to learn: you read to use it as a checklist against VetCare, category by category.',
        pasos: [
          'Open "Top 10:2025 List" and read the ten titles (~3 min).',
          'For each category write one line: does it apply to VetCare? Where?',
          'Mark the three that are most risky for a clinic and open their page to read How to prevent.',
          'Use that list as the skeleton of today’s threat model.'
        ] },
      ex: {
        title: 'A threat model in four questions',
        body: `# Threat model - VetCare
Date: 2026-xx-xx

## 1. What are we building
Exposed surface:
  - Public API at /api/*             (internet)
  - React web                        (internet)
  - PostgreSQL                       (internal network only)
  - Payment gateway                  (outgoing, third party)

Assets that matter, in order:
  1. Patients' clinical history      -> health data
  2. Owners' contact details         -> personal data
  3. Credentials and tokens          -> access to everything above
  4. Billing                         -> money

Actors:
  - Receptionist, Vet, Admin               (authenticated)
  - Owner                                  (authenticated, only their own)
  - Anonymous                              (login only)
  - External attacker                      (our concern)

## 2. What can go wrong
| # | Threat                                    | OWASP | Impact   | Prob.  | Priority |
|---|-------------------------------------------|-------|----------|--------|----------|
| 1 | An owner reads another pet's history      | A01   | High     | Medium | 1        |
| 2 | Stored XSS in a pet's name                | A05   | High     | Low    | 2        |
| 3 | Brute force on /api/auth/login            | A07   | Medium   | High   | 2        |
| 4 | Dependency with a published CVE           | A03   | High     | Medium | 1        |
| 5 | Secret in the git history                 | A02   | Critical | Low    | 1        |
| 6 | User enumeration through the login        | A07   | Low      | High   | 3        |

## 3. What are we going to do
| # | Mitigation                                   | Status     |
|---|----------------------------------------------|------------|
| 1 | Ownership filter inside the query            | Done W18   |
| 2 | React escapes + CSP without unsafe-inline    | Done W19   |
| 3 | Rate limit 5/min per IP on login             | Done W18   |
| 4 | Dependency audit in CI                       | Done W19   |
| 5 | Secrets in user-secrets + rotation           | Done W19   |
| 6 | Identical login error in both cases          | Done W18   |

## 4. Did we do a good job?
Evidence per mitigation: automated test, screenshot of the attack
failing, or CI line. Without evidence, the row does not count.

Consciously accepted risks:
  - No 2FA: small team, internal network. Review in 6 months.

(The codes are the 2025 edition's: A01 access control,
A02 configuration, A03 supply chain, A05 injection, which in
2025 includes XSS, A07 authentication.)`
      },
      steps: [
        'Create docs/threat-model.md and fill in section 1 with your real system: exposed surface, assets ordered by value and actors. It takes fifteen minutes and it is the part that gives you the most clarity.',
        'Go through the ten OWASP Top 10 categories one by one asking whether each applies to VetCare. Note every threat found in section 2’s table with impact and probability. Do not skip any category even if you think it does not apply: writing "does not apply because..." is also a result.',
        'Really attack the three highest-priority threats. Use curl, not the UI. If the attack works, you have work to do; if it fails, keep the response as evidence and paste it into the document.',
        'Complete section 3 with the real status of each mitigation. If something is pending, write it as pending: a threat model that lies is worse than not having one.',
        'Run the whole final checklist below and mark each point with concrete evidence: test name, command run or screenshot. Note in section 4 the risks you consciously accept and why.',
        'Explain the document out loud to someone, or to the wall, in three minutes: what VetCare protects, which was the most serious threat you found and how you closed it. That is literally the answer to "tell me about security in your project".'
      ],
      vet: [
        'Final checklist, thirteen points: no query builds SQL by concatenation; no dangerouslySetInnerHTML with user data; CSP active with no violations; every dynamic link validates its scheme; the three critical endpoints validate input and return 422; there is a body size limit; dotnet list package --vulnerable clean; npm audit with no highs; audit in CI; zero secrets in the repository and its history; logs contain no personal data or tokens; exceptions do not leak to the client; week 18’s security headers are still present.',
        'Add docs/threat-model.md and docs/dependencies.md to your README’s index so they are seen when the repository is opened.',
        'Press "Mark for review" and reread docs/threat-model.md in a week.'
      ],
      edge: [
        'A threat model is a living document, not a deliverable. If you write it and do not touch it for a year, it describes a system that no longer exists. Review it every time you add new surface.',
        'Prioritising by impact times probability is better than fixing everything: time is finite and one open critical vulnerability weighs more than five minor ones closed.',
        'Accepting a risk consciously and in writing is a valid professional decision. Ignoring it without writing it down is not, because nobody can review a decision that exists nowhere.'
      ],
      quiz: [
        { q: 'What are the four questions of a threat model?', a: 'The four questions: what are we building?, what can go wrong?, what are we going to do about it? and did we do a good job? The last one is the most forgotten and the only one that turns a list of good intentions into something verifiable.' },
        { q: 'Why prioritise threats instead of fixing them all?', a: 'Because time is limited and threats are not worth the same: one that exposes clinical histories to anyone weighs much more than a minor information leak. Prioritising by impact and probability makes the effort you have go where it reduces risk the most.' },
        { q: 'What does accepting a risk mean and how is it done well?', a: 'It means consciously deciding not to mitigate it because the cost does not pay off against the expected impact. It is done well when it is written down with the reason and a review date, so the decision can be discussed later instead of being a silent oversight.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That real security is not at the front door but at the edges you do not watch: the data that becomes code, the field you never limited, the library you did not know you had and the secret you thought you had deleted, and that the only way to find them is to look for them methodically instead of waiting for someone else to find them for you.' }
      ],
      out: 'docs/threat-model.md complete with the four sections, the three priority attacks run with evidence, and the thirteen-point list verified.',
      file: 'docs/threat-model.md'
    }
  ]
}
]);
