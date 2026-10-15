/* One hint for each "Do it yourself" step: how to start, an example and how to know it is right.
   Key: w<week>d<day>; the order matches days[].steps. */
window.EN = window.EN || {};
window.EN.PISTAS = Object.assign(window.EN.PISTAS || {}, {

/* ---------- Week 17 ---------- */

'w17d1': [
  '"npm install @tanstack/react-query". In main.tsx: "const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true } } });" and wrap: "<QueryClientProvider client={queryClient}><App /></QueryClientProvider>". Create the client outside the component, not inside.',
  '"export async function getAppointments(day: string, signal?: AbortSignal): Promise<Appointment[]> { const r = await fetch(`/api/v1/agenda?day=${day}`, { signal }); if (!r.ok) throw new Error(`HTTP ${r.status}`); return (await r.json()).data; }". No hooks, no useState: only fetch and types. That way they can be reused and tested without React.',
  '"export function useAppointments(day: string) { return useQuery({ queryKey: ["appointments", day], queryFn: ({ signal }) => getAppointments(day, signal) }); }". In the component: "const { data = [], isPending, error } = useAppointments(day);". React Query already handles cancellation with that signal.',
  '"npm install @tanstack/react-query-devtools" and inside the Provider: "<ReactQueryDevtools initialIsOpen={false} />". A floating button appears: open it, change day 3 or 4 times and you will see one entry for each ["appointments", day], with its state (fresh, stale, inactive).',
  'Temporarily mount "<AppointmentCounter day={day} />" as well as the table, and have both call useAppointments(day). In Network, filter by "agenda": even with two components asking for the same thing, only one request must go out. Both calls share the ["appointments", day] cache entry.'
],

'w17d2': [
  '"const create = useMutation({ mutationFn: createAppointment });" and in the submit: "create.mutate(form)". Use "create.isPending" to disable the button and "create.error" for the message. Delete the submitting and error useStates: the mutation already handles them.',
  '"const qc = useQueryClient(); useMutation({ mutationFn: createAppointment, onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }) });". The ["appointments"] key invalidates every key that starts like that (every day). Create an appointment and watch it show up in the table without you touching any state.',
  '"export function useCancelAppointment() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => cancelAppointment(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }) }); }". In AppointmentRow: "const cancel = useCancelAppointment();" and "onClick={() => cancel.mutate(appointment.id)}".',
  'Table: | Mutation | Keys to invalidate | Reason |. Example: "Create appointment | ["appointments"], ["pet", id, "history"] | it shows up in the agenda and in the history". "Edit owner | ["owner", id], ["appointments"] | the agenda shows the owner’s name". Think of every screen that shows that data.',
  'Open the React Query devtools and cancel an appointment: the ["appointments", day] entry turns stale (yellow) and right away fetching (blue) and fresh (green). In Network the reload request shows up right after the POST or PATCH.'
],

'w17d3': [
  'onMutate: "await qc.cancelQueries({ queryKey: ["appointments", day] }); const previous = qc.getQueryData<Appointment[]>(["appointments", day]); qc.setQueryData<Appointment[]>(["appointments", day], v => v?.map(a => a.id === id ? { ...a, status: "cancelled" } : a)); return { previous };". onError: "qc.setQueryData(["appointments", day], ctx?.previous); notify("Could not cancel");". onSettled: "qc.invalidateQueries({ queryKey: ["appointments"] })".',
  'In Network, set throttling to "Slow 3G" so it shows: the row changes instantly and the request is still in flight. With the previous version, the change waited for the response. Write the difference in feel in one line.',
  'With the page loaded, stop the backend (Ctrl+C) and cancel an appointment. You will see: it changes to cancelled → the request fails → it goes back to its previous state → the notice appears. If it stays cancelled, check that onError restores ctx.previous and that onMutate returns { previous }.',
  'Comment out the cancelQueries, add "await Task.Delay(2000)" in the agenda GET, refresh the page and cancel immediately. The GET that was already in flight finishes later and overwrites your change with the old state. Put cancelQueries back and repeat: it no longer happens. Remove the delay when you finish.',
  'Criterion: optimistic if it almost never fails and is easy to undo (cancel appointment, mark as read). Spinner if it fails often, has consequences (payments, medical data) or the server calculates something you need (the id or the price of a new appointment). Table: | Mutation | Optimistic or spinner | Reason |.'
],

'w17d4': [
  '"npm install react-router". "const router = createBrowserRouter([{ path: "/", element: <Layout />, errorElement: <ErrorPage />, children: [{ index: true, element: <Schedule /> }, { path: "pets/:id", element: <PetDetail /> }, { path: "*", element: <NotFound /> }] }]);". In Layout: the navigation bar and "<Outlet />".',
  '"const [params, setParams] = useSearchParams(); const day = params.get("day") ?? todayISO(); const filter = params.get("status") ?? "all";". To change it: "setParams(p => { p.set("day", next); return p; });". Test: choose a day and a filter, copy the URL, reload: exactly the same must be shown.',
  '"setParams(p => { p.set("q", text); return p; }, { replace: true });" only in the search. Before: type "rex" and press back → you remove one letter at a time. After: back takes you to the previous screen. The day and the filter must create a history entry (no replace).',
  '"const { id } = useParams(); const pet = usePet(id!);" with "queryKey: ["pet", id]". Navigate between two pets: different data must load, and when you go back to the first one, it must come out instantly from the cache. If you see the same pet in both, the id is not in the queryKey.',
  'NotFound: "This page does not exist" and a link to the schedule. ErrorPage uses "useRouteError()" and shows a friendly message with a button to go back. Try /made-up and also throw an error on purpose inside a component to see the errorElement.'
],

'w17d5': [
  'Table skeleton: "Array.from({ length: 5 }).map((_, i) => <tr key={i}><td><div className="skeleton" style={{ width: 60 }} /></td>…</tr>)" with CSS ".skeleton { height: 14px; border-radius: 4px; background: #e5e5e5; animation: pulse 1.2s infinite; }". Same number of columns and row height as the real table, so nothing jumps on load.',
  '"function useDelayed(active: boolean, ms = 300) { const [show, setShow] = useState(false); useEffect(() => { if (!active) { setShow(false); return; } const t = setTimeout(() => setShow(true), ms); return () => clearTimeout(t); }, [active, ms]); return show; }". Usage: "const showSkeleton = useDelayed(isPending);".',
  '"useQuery({ …, placeholderData: keepPreviousData })" and in the table: "style={{ opacity: isPlaceholderData ? 0.5 : 1 }}". When you change day, the previous day’s data is shown dimmed until the new data arrives, instead of an empty table that flickers.',
  '"const qc = useQueryClient(); <Link to={`/pets/${id}`} onMouseEnter={() => qc.prefetchQuery({ queryKey: ["pet", id], queryFn: () => getPet(id) })}>". In Network, hover without clicking: the request must go out. When you click, the record appears instantly.',
  'In Network, change "No throttling" to "Slow 3G" (or "3G"). Go through: load the schedule, change day, open a record, create an appointment, cancel. Note: "create appointment: 4 s with no sign anything is happening → add Saving… text on the button". Prioritise what annoys most.'
],

'w17d6': [
  'Go list by list with the code open next to you. For each point, point at the file that meets it or fix it right then. Example: "server data is not in useState → search for useState with API data: 0 results ✓".',
  'Do them for real, with DevTools open: slow network, backend down, reload in the middle of the page, URL shared in another tab, double click… For each one note what you expected and what happened. Fix the ones that fail and repeat them.',
  'Write it for someone who has not seen the project: what each screen does, how server data is handled (React Query, keys, invalidations), what goes in the URL, what is optimistic and what is not, and the loading states. Ask someone to read it and tell you what they did not understand.',
  '"npx tsc -b" with no output. For each any you cannot type: "const data: unknown = await r.json(); if (!isAppointment(data)) throw new Error("Unexpected response");" with a check function "function isAppointment(x: unknown): x is Appointment { … }". That way you validate what comes from outside instead of trusting it blindly.',
  'Structure with examples from your app: 1) server data has an owner outside (the database) and can change without you knowing, 2) that is why it needs caching, reloading and invalidation (the ["appointments", day] keys), 3) client state (open filter, typed text) is only yours. Record yourself.'
],

/* ---------- Week 18 ---------- */

'w18d1': [
  '"dotnet add src/VetCare.Domain package BCrypt.Net-Next" (it knows nothing about EF, so it does not break the architecture). "public static User Create(string email, string password, Role role) { /* validate minimum length */ return new User(Guid.NewGuid(), email.ToLowerInvariant(), BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12), role); }" and "public bool VerifyPassword(string p) => BCrypt.Net.BCrypt.Verify(p, PasswordHash);".',
  '"CREATE TABLE app_user ( id uuid PRIMARY KEY, email text NOT NULL, password_hash text NOT NULL, role text NOT NULL CHECK (role IN (\'admin\',\'vet\',\'receptionist\',\'owner\')), created_at timestamptz NOT NULL DEFAULT now() ); CREATE UNIQUE INDEX uq_app_user_email ON app_user (lower(email));". The column is called hash, not password: you never store the password.',
  '"var a = User.Create("a@x.com", "Secure-Pass-1", Role.Owner); var b = User.Create("b@x.com", "Secure-Pass-1", Role.Owner); a.PasswordHash.Should().NotBe(b.PasswordHash); a.VerifyPassword("Secure-Pass-1").Should().BeTrue(); a.VerifyPassword("other").Should().BeFalse();". The hashes differ because of the random salt.',
  'Both failures (email does not exist and wrong password) return exactly the same: "return Results.Problem(title: "Invalid credentials", statusCode: 401);". If you said "the user does not exist", an attacker could find out which emails are registered.',
  '"time curl -s -X POST …/login -d \'{"email":"nobody@x.com","password":"x"}\'" against a real email with a wrong password. If the non-existent one answers in 5 ms and the real one in 250 ms, you can tell who exists. Fix: when the user does not exist, verify anyway against a dummy hash to spend the same time.'
],

'w18d2': [
  '"builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => { o.TokenValidationParameters = new() { ValidIssuer = "vetcare", ValidAudience = "vetcare-web", IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), ValidAlgorithms = [SecurityAlgorithms.HmacSha256] }; o.Events = new() { OnMessageReceived = ctx => { ctx.Token = ctx.Request.Cookies["vetcare_session"]; return Task.CompletedTask; } }; });". Then UseAuthentication and UseAuthorization, in that order.',
  'Generate a long key: "openssl rand -base64 48" and then "dotnet user-secrets set "Jwt:Key" "…" --project src/VetCare.Api". On startup: "var key = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing");". Search for the key in appsettings*.json: it must not appear.',
  '"ctx.Response.Cookies.Append("vetcare_session", token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTimeOffset.UtcNow.AddMinutes(15) });" and "return Results.Ok(new { id, email, role });". In DevTools → Application → Cookies you must see the cookie with HttpOnly ticked.',
  'Since the cookie is HttpOnly, you cannot read it from JavaScript (that is the point). Copy it from DevTools → Application → Cookies. In the console: "JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")))". You will see email, role and exp in plain text: the JWT is signed, not encrypted.',
  'ADR: Context (the browser needs to keep the session). Decision (HttpOnly + Secure + SameSite=Strict cookie). Rejected alternative (localStorage: any XSS can read the token and send it out). Consequences (CSRF protection with SameSite; the API and the web must be on the same site or CORS must be configured with credentials).'
],

'w18d3': [
  '"builder.Services.AddAuthorizationBuilder().AddPolicy("Staff", p => p.RequireRole("admin","vet","receptionist")).AddPolicy("Clinical", p => p.RequireRole("admin","vet")).AddPolicy("Admin", p => p.RequireRole("admin"));". On each group: ".RequireAuthorization("Clinical")". An endpoint without RequireAuthorization is public: review them all.',
  'Table: | Method | Route | Policy | Ownership? |. Example: "GET | /api/v1/pets/{id} | Staff or Owner | yes: the owner only sees their own pets". "POST | /api/v1/visits | Clinical | no". Go through every MapGet, MapPost… in the project: if one is not in the table, it is missing.',
  'Look for routes with {id} and query parameters like ?ownerId=. For each one ask: if I change the id for another one, do I see someone else’s data? Until you test it, mark it as "possible IDOR".',
  'Filter in the query itself: "db.Pets.Where(p => p.Id == id && (isStaff || p.Owner.UserId == userId))". If it finds nothing → 404. Returning 403 would confirm to the attacker that the pet exists. Get userId from "ctx.User.FindFirstValue(ClaimTypes.NameIdentifier)", never from a parameter the client sends.',
  'Migration: "ALTER TABLE owner ADD COLUMN user_id uuid REFERENCES app_user(id);". Tests: create two users with the owner role, each with their own pet; user A asks for B’s pet → 404. A receptionist user does POST /api/v1/visits → 403. To authenticate in the tests, log in and reuse the cookie in the HttpClient.'
],

'w18d4': [
  '"app.MapGet("/api/auth/me", (ClaimsPrincipal u) => Results.Ok(new { id = u.FindFirstValue(ClaimTypes.NameIdentifier), email = u.FindFirstValue(ClaimTypes.Email), role = u.FindFirstValue(ClaimTypes.Role) })).RequireAuthorization();". No cookie → automatic 401. Try it with curl with and without the cookie.',
  '"const q = useQuery({ queryKey: ["session"], queryFn: getMe, retry: false, staleTime: Infinity });" and the context exposes "{ user: q.data ?? null, loading: q.isPending }". getMe returns null if it gets a 401 (it does not throw). While loading is true, show a skeleton, not the login.',
  '"function ProtectedRoute({ roles, children }) { const { user, loading } = useSession(); if (loading) return <Skeleton />; if (!user) return <Navigate to="/login" state={{ from: location }} replace />; if (roles && !roles.includes(user.role)) return <NoPermission />; return children; }". Apply it in the route tree, following yesterday’s table.',
  'In the fetch client: "if (r.status === 401) window.dispatchEvent(new Event("session-expired"));". A component listens for that event and opens a login dialog on top of the current screen, without navigating. That way the form underneath keeps its state. To test it, delete the cookie from DevTools and press save.',
  'Hide: "{user.role !== "receptionist" && <button>Record visit</button>}". Then, from the terminal: "curl -i -X POST localhost:5080/api/v1/visits -H "Content-Type: application/json" -d \'{…}\'" without a cookie → 401; with a receptionist user’s cookie → 403. The backend decides; hiding the button is just convenience.'
],

'w18d5': [
  '"CREATE TABLE refresh_token ( id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES app_user(id), hash text NOT NULL UNIQUE, family uuid NOT NULL, expires_at timestamptz NOT NULL, used_at timestamptz, revoked_at timestamptz );". Store SHA256(token): if the table leaks, the tokens are useless. The family column groups the tokens that come from one another through rotation.',
  'Refresh: look it up by hash. If it does not exist or has expired → 401. If it already has used_at → someone is reusing it (possible theft): revoke the whole family and answer 401. If it is valid: mark it as used, issue a new JWT and a new refresh token of the same family. Logout: revoke the current token and delete the cookies.',
  'In the fetch client: if it gets a 401 and the request was not the refresh itself, call "POST /api/auth/refresh" once and, if it goes well, repeat the original request. If the refresh fails → session-expired event. Stop two requests refreshing at the same time by storing the promise of the refresh in flight and reusing it.',
  '"builder.Services.AddRateLimiter(o => { o.AddFixedWindowLimiter("login", l => { l.PermitLimit = 5; l.Window = TimeSpan.FromMinutes(1); }); o.RejectionStatusCode = 429; });", "app.UseRateLimiter();" and on the login ".RequireRateLimiting("login")". Test: "for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code}\\n" -X POST …/login -d \'…\'; done" → the sixth gives 429.',
  'Middleware: "ctx.Response.Headers["X-Content-Type-Options"] = "nosniff"; ["X-Frame-Options"] = "DENY"; ["Referrer-Policy"] = "no-referrer"; ["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";" and "app.UseHsts()" only outside Development. In Network, click any request to the API and check the Response Headers.'
],

'w18d6': [
  'For each attack: exact command (curl with the headers), expected result and actual result (code and body). Typical examples: access with no cookie, IDOR by changing ids, escalating role, tampered token, expired token, brute force on the login, reusing the refresh token, CORS from another origin. Do it against the API, not against the interface.',
  'For each successful attack: what was wrong → fix → new result. Example: "GET /api/v1/pets/{id}/history did not filter by owner → added the ownership filter to the query → now 404". That "what was wrong" is the most valuable thing to tell in an interview.',
  'One test per attack in tests/VetCare.Api.Tests/Security/: "NoCookie_Pets_Returns401", "OwnerA_PetOfB_Returns404", "Receptionist_RecordVisit_Returns403", "TamperedToken_Returns401". If someone removes a filter in a refactor, the suite catches it.',
  'Next to each point: file:line or test name. "Passwords with a slow hash → User.cs:31 (BCrypt workFactor 12)". "Attempt limit → Program.cs:58 + test Login_SixthAttempt_429". If all you can say is "I think so", mark it as pending.',
  'Four parts, about 45 seconds each: what you store and how (BCrypt hash, never the password), how you know who someone is (JWT in an HttpOnly cookie), how you decide what they can do (role policies + ownership filter) and what you found when attacking it (the most serious flaw and how you closed it). Record yourself.'
],

/* ---------- Week 19 ---------- */

'w19d1': [
  'Search the code for: "SqlQueryRaw(", "FromSqlRaw(", "ExecuteSqlRaw(", "$"SELECT", ""SELECT … " +" and "string.Format(" with SQL. Review each result: if there is a {variable} inside a $"" passed to a Raw method, or there is a +, it is concatenation. Note file and line.',
  'If you have no vulnerable query, create one on purpose in a test endpoint: "db.Database.SqlQueryRaw<…>($"SELECT … WHERE name = \'{q}\'")". Attack with "curl "localhost:5080/test/search?q=%27%20OR%20%271%27%3D%271"" (that is \' OR \'1\'=\'1 encoded for the URL). If it returns every pet, the vulnerability is proven.',
  'Change it to "SqlQueryRaw<…>("SELECT … WHERE name = {0}", q)" or use "FromSql($"… WHERE name = {q}")" (this method does turn the interpolation into parameters). Repeat the same curl: zero rows. The attack text travels as data and is never interpreted as SQL.',
  'Look for "Process.Start", "Path.Combine(" with request data, "File.ReadAllText(" with paths coming from the user. Example of the risk: "Path.Combine("attachments", fileName)" with "../../appsettings.json". How you close it: only use ids you generate or "Path.GetFileName(name)" and check the final path stays inside the allowed folder.',
  'Three paragraphs: where it was (file:line and the query), the attack (the exact curl and how many rows it returned) and why parameterisation works (the query and the data travel separately to PostgreSQL, so the data can never become code, whatever characters it contains).'
],

'w19d2': [
  'Create a pet with that name from the form or with curl. The schedule must show the literal text "<img src=x onerror=alert(1)>" and no alert must pop up. Inspect the element: you will see &lt;img… escaped. React turns text into text, never into HTML.',
  '"grep -rn "dangerouslySetInnerHTML" web/src". If it shows up, follow the value back to its origin: does it come from the API? Did a user write it? If so, remove it and show it as text, or sanitise it with DOMPurify. If it does not show up, write "verified: 0 uses (date)".',
  '"export function safeUrl(u: string): string { try { const url = new URL(u, window.location.origin); return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "#"; } catch { return "#"; } }". Use it in "href={safeUrl(owner.website)}". Try with "javascript:alert(1)": it must become "#".',
  'In the API: "ctx.Response.Headers["Content-Security-Policy"] = "default-src \'self\'; script-src \'self\'; object-src \'none\'; frame-ancestors \'none\'";". In vite.config.ts: "preview: { headers: { "Content-Security-Policy": "…" } }". Violations show up in the console in red, with the directive that failed: adjust the policy without putting \'unsafe-inline\' in script-src.',
  'Three points: 1) React escapes everything you render as {text}. 2) Things slip through dangerouslySetInnerHTML and through URLs with javascript: in href or src. 3) If something gets past the filters, the CSP stops scripts that do not come from your own domain from running. Add the evidence for each point (today’s test).'
],

'w19d3': [
  'Per field: "reason: string, required, 3–200 characters, no line breaks", "durationMinutes: integer, 15–120, multiple of 15", "start: ISO date with time zone, in the future, at most 6 months ahead". If you do not know a limit, decide a reasonable one and note it as an assumption to confirm with the business.',
  'Reuse the validation filter from week 12 or write a validator per DTO: "if (dto.DurationMinutes is < 15 or > 120) errors["durationMinutes"] = ["Must be between 15 and 120"];". Return "Results.ValidationProblem(errors, statusCode: 422)". This validation checks the shape of the data; the business rules stay in the domain.',
  'Four curls: "-d \'{}\'" (422 for the required ones), duration 100000 (422), a reason of 10000 characters (generate it with "python3 -c "print(\'a\'*10000)"") → 422, and "-d \'{"reason":\'" (broken JSON) → 400. If any gives 500, a case is missing: look at the exception in the API log.',
  'In Program.cs: "builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 1_000_000);". Generate a big file: "python3 -c "import json; print(json.dumps({\'reason\': \'a\'*5_000_000}))" > big.json" and "curl -i -X POST … -H "Content-Type: application/json" --data-binary @big.json" → 413 Payload Too Large.',
  'Table: | Field | Rule in the form | Rule in the API | Do they match? |. If they do not match, align them, ideally with shared constants or documented in api-contract.md. Try a value right on the limit (200 characters) in both places.'
],

'w19d4': [
  '"dotnet list package --include-transitive". Count the "Top-level Package" lines and the "Transitive Package" lines. Note both numbers in dependencies.md. In the frontend: "npm ls --all | wc -l" for the equivalent.',
  '"dotnet list package --vulnerable --include-transitive" and "cd web && npm audit". For each finding: package, version, severity and the link to the advisory. Open one and write in your own words what it lets an attacker do and whether it affects how you use that package.',
  'To find out who pulls in a transitive dependency: "npm explain package-name" or "dotnet nuget why <project> <package>" (in .NET 8.0.4xx or later). Upgrade the top-level package: "dotnet add package X --version …" or "npm install x@latest". Audit again: the finding must disappear.',
  'Look at each package’s repository (link on nuget.org or npmjs.com): date of the last commit, number of maintainers, weekly downloads. Table: | Package | Last commit | Maintainers | Replaceable? |. Example: "left-pad | 2018 | 1 | yes: String.prototype.padStart".',
  'In ci.yml add the steps "dotnet list package --vulnerable --include-transitive 2>&1 | tee audit.txt; ! grep -q -i "has the following vulnerable packages" audit.txt" and "npm audit --audit-level=high". For Dependabot: create .github/dependabot.yml with "package-ecosystem: "nuget"" and ""npm"", with "directory" and "schedule: weekly".'
],

'w19d5': [
  '"git grep -n -i -E "password|secret|key|token|connectionstring"". For each result: is it a real value ("Password=dev123") or just a name ("Jwt:Key")? Names are fine; real values have to go. Also check the .http files, the scripts and the READMEs.',
  '"dotnet user-secrets set "ConnectionStrings:VetCare" "Host=…;Password=…" --project src/VetCare.Api" for each secret. In appsettings.json leave: ""ConnectionStrings": { "VetCare": "" }". Start the API and call /health/ready: if it answers 200, it is reading the secrets from user-secrets.',
  'Review appsettings.Development.json line by line: only log levels and harmless values. In .gitignore: ".env", "*.local.json", "appsettings.*.local.json". Search the history: "git log -p -S "Password=" --all". If any real value shows up, that secret is exposed even if it is no longer in the code.',
  'Rotating = generating a new value, putting it wherever it is used and making the old one useless (change the database password, generate another JWT key, revoke the token at the provider). Note: "Rotate the database password: exposed in commit abc123 (date)". Cleaning the history with git filter-repo can be done afterwards, but it does not replace rotating.',
  'Search for "_logger.Log" and review the parameters: "LogInformation("Login by {Email}", email)" → "LogInformation("Successful login {UserId}", id)". Add: "LogWarning("Failed login for {UserId}", idIfExists)" and "LogWarning("Access denied {UserId} {Route}", …)". Never log passwords, tokens or the Authorization header.'
],

'w19d6': [
  'Surface: the API’s public endpoints, the web and the database port (is it exposed?). Assets ordered by value: medical histories, owners’ contact details, credentials, schedule. Actors: curious owner (sees another one’s data), employee who leaves the company, automated external attacker, brute-force bot.',
  'Table: | OWASP category | Threat in VetCare | Impact (H/M/L) | Likelihood (H/M/L) |. Example: "A01 Broken access control | an owner sees someone else’s pet by changing the id | H | M". "A10 SSRF | does not apply because VetCare does not make requests to URLs the user provides".',
  'Sort by impact × likelihood and pick the top 3. For each one, the exact curl, the response you got (code and body) and the conclusion. Paste the output into the document as evidence: "HTTP/1.1 404 Not Found" proves more than "it is protected".',
  'Per threat: Mitigation | Status (done / partial / pending) | Where (file or test). Example: "Brute force on the login | done | Program.cs:58 + test Login_SixthAttempt_429". "Encrypted database backups | pending | not done". Being honest here is what gives the document credibility.',
  'Each point with its concrete evidence: the test name, the command and its output, or a screenshot. In section 4, accepted risks with their reason: "No two-factor authentication: the clinic has 4 employees and is on an internal network; to be reviewed if it is opened to owners over the internet".',
  'Three parts: what VetCare protects (medical and contact data), the most serious threat you found (with the attack and what it returned) and how you closed it (with the test that checks it). Time yourself: 3 minutes. It is the answer to "tell me about security in your project".'
],

/* ---------- Week 20 ---------- */

'w20d1': [
  '"git init", "dotnet new gitignore" and add at the end of that .gitignore: "node_modules/", ".env", "*.local.json", "dist/". Check with "git status" that bin, obj and node_modules do not show up. Then "git add ." and "git commit -m "Initial VetCare structure"".',
  'Example: subject "Reject appointments shorter than 15 minutes" (imperative, no full stop at the end, under 50 characters). Blank line. Body: "Reception was booking 5-minute appointments by mistyping and the vet had no time to see the pet. The minimum of 15 comes from BR-04". Use "git commit" without -m so the editor opens.',
  'Change two unrelated things in the same file (for example, an error message and a variable name). "git add -p file": for each hunk answer y (yes) or n (no). Commit the first one, repeat with the second. "git log -p -2" must show two commits, each with its own change.',
  '"git log --oneline --graph --all". Read it as if you were new: do you understand what was done and why? Messages like "fix", "changes" or "wip" say nothing. Note: "a1b2c3 "fix" → should be "Fix the appointment end calculation on the clock change"".',
  'Create test.txt and commit it. Modify it and "git restore test.txt" (discards). Modify it, "git add" and "git restore --staged test.txt" (takes it out of the staging area). "git commit --amend" (changes the last commit’s message). "git revert HEAD" (creates a commit that undoes the previous one). Look at "git log" after each step.'
],

'w20d2': [
  '"git switch -c feat/vaccine-reminder". Prefixes: feat (something new), fix (correction), docs, refactor. Bad: "feat/Program-cs". Good: "fix/midnight-appointment-overlap". The name must say what changes for the user or for the code, not which file you touch.',
  'On main: change line 10 of README.md to "Version A" and commit. "git switch feat/…": change the same line to "Version B" and commit. "git switch main && git merge feat/…" → "CONFLICT". The file will have <<<<<<<, ======= and >>>>>>> markers with both versions.',
  'Read both versions, decide which one is right (or combine them) and delete the markers. Before the commit: "dotnet build && dotnet test" (and "npm run build" if the conflict is in the frontend). Then "git add file" and "git commit". Check no "<<<<<<<" is left anywhere in the project.',
  'Repeat the exercise on new branches, but instead of merge: "git switch feat/… && git rebase main", resolve, "git add" and "git rebase --continue". Compare "git log --oneline --graph" for both cases: merge leaves a diamond; rebase, a straight line. Write when you would use each one.',
  '"git reflog" shows every place HEAD has been, including commits "lost" after a reset or a rebase. To recover one: "git switch -c rescue HEAD@{5}". Try it: do "git reset --hard HEAD~1" and recover that commit from the reflog.'
],

'w20d3': [
  'Two-stage Dockerfile: "FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build" (copy the csproj files, restore, copy the code, publish) and "FROM mcr.microsoft.com/dotnet/aspnet:10.0" (copy only the publish output, "USER app", ENTRYPOINT). .dockerignore: "**/bin", "**/obj", ".git", "node_modules", ".env", "**/*.local.json".',
  '"docker build -t vetcare-api ." and "docker images vetcare-api" shows the size (about 200–250 MB). To compare, a single-stage Dockerfile with the sdk image: over 800 MB. Note both numbers: the small image downloads sooner and carries less software that could have vulnerabilities.',
  '"docker run --rm -p 8080:8080 -e ConnectionStrings__VetCare="Host=host.docker.internal;Database=vetcare;Username=postgres;Password=dev" vetcare-api". The two underscores (__) stand for the configuration’s colon. host.docker.internal reaches your machine from the container. Open localhost:8080/health/ready.',
  'Right order in the build stage: "COPY *.sln ./", "COPY src/*/*.csproj" (into their folders), "RUN dotnet restore" and AFTER that "COPY . .". Change one line of code and rebuild: the restore step must say CACHED. If it runs every time, the code was copied before the csproj files.',
  '"docker ps" to see the id, then "docker exec -it <id> whoami" → it must answer "app". If it answers root, "USER app" is missing in the last stage (the .NET 8 and later images already come with that user created).'
],

'w20d4': [
  'Services: db (postgres:17, with a volume and the healthcheck "pg_isready -U postgres"), api (build: ., depends_on db with condition: service_healthy) and web (build: ./web). In .env: "DB_PASSWORD=…" and "JWT_KEY=…"; in the compose file: "${DB_PASSWORD}". Check with "git check-ignore .env": it must print ".env".',
  '"docker compose up -d --build" and "docker compose ps": all three running and db healthy. If the API restarts in a loop: "docker compose logs api". The usual cause is the connection string: inside compose the host is "db" (the service name), not localhost.',
  'Apply your migrations: "docker compose exec -T db psql -U postgres -d vetcare < database/migrations/001_….sql" (or your script). Load seed.sql the same way. "docker compose down" and "docker compose up -d": query the data, it must still be there. It lives in the volume, not in the container.',
  '"docker compose down -v" also deletes the volumes. When you bring it up again, the database is empty. Difference: down stops and removes the containers (the data stays in the volume); down -v also removes the data. Note it in the README so nobody finds out by accident.',
  '"git clone <your-repo> /tmp/vetcare-test && cd /tmp/vetcare-test", "cp .env.example .env", fill in the values and follow the README without looking anything else up. Every time you have to do something that is not written down, note it and add it to the README.'
],

'w20d5': [
  'Skeleton: "on: [push, pull_request]", a backend job with "runs-on: ubuntu-latest" and the steps "actions/checkout@v4", "actions/setup-dotnet@v4" (dotnet-version: 10.0.x), "dotnet restore", "dotnet build --no-restore", "dotnet format --verify-no-changes" and "dotnet test --no-build". Push and open the Actions tab.',
  'Open the red step and read the last lines of the log. If it is format: run "dotnet format" locally, commit and push. If the tests cannot find the migrations: build the path from the repository root ("AppContext.BaseDirectory" and go up folders until you find the .sln) instead of using "../../..".',
  'Frontend job: "actions/setup-node@v4" (node-version: 22, cache: npm, cache-dependency-path: web/package-lock.json), "npm ci", "npx tsc -b", "npm run build", "npm audit --audit-level=high". Use "defaults: run: working-directory: web" so you do not repeat "cd web" in every step.',
  'Image job: "needs: [backend, frontend]" and "docker build -t vetcare-api:${{ github.sha }} .". On the run’s page you will see a graph: backend and frontend in parallel, image afterwards. If one of the two fails, image shows as skipped.',
  '"git switch -c test/ci-red", change a "Should().Be(1)" to "Should().Be(2)", push and open a pull request. The PR must show the check in red and, if you protected main (Settings → Branches → Require status checks), it will not let you merge. Close the PR and delete the branch when you finish.'
],

'w20d6': [
  'Clone into a new folder ("git clone … ~/vetcare-clean"), do not copy .env or anything from your working folder. Open the README and do exactly what it says, in order. Keep a note open: "Step 3 says docker compose up, but .env has to be created first → missing from the README".',
  'Fix the README with each note, delete the folder and repeat from scratch. You are done when a full pass works without improvising anything. If you can, ask someone else to try it: they will find things you already take for granted.',
  'Sections: Environments (local, test, production), Requirements (Docker, versions), Startup, Migrations (how and when they are applied), Step-by-step deployment, Rollback (going back to the previous image and what happens to the migrations), What to watch afterwards (health, errors, latency) and Known risks.',
  'Mark each point with its evidence: "main protected → screenshot of Settings", "green CI → link to the run", "no root → whoami answers app". If a point has no evidence, do what is missing before ticking it.',
  '"git log --oneline -2" to see the previous commit. Build its image: "git switch --detach <sha> && docker build -t vetcare-api:<sha> . && git switch main". Change the image tag in compose and bring it up against the SAME database. If it fails because a column is missing or there is an extra NOT NULL, your last migration was not backwards compatible.',
  'Structure: 1) how it is deployed (steps and commands), 2) how you know it went well (health, logs, a manual test), 3) what you do if it goes wrong (rollback to the previous image and why the migrations allow it). If you get stuck at some point, that point is missing from deployment.md.'
]

});
