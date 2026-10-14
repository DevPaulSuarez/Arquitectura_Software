window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 18,
  phase: 'Frontend',
  title: 'Authentication and authorisation end to end',
  idea: 'Until now anyone who opens VetCare can see and cancel anyone’s appointments. The piece every real system needs is missing: knowing who you are (authentication) and what you can do (authorisation). It is where the most serious mistakes are made, because most people solve it badly by copying a tutorial: badly stored passwords, tokens in localStorage, and permission checks that only exist in the frontend. This week you do it right and understand why each decision is the one it is.',
  res: [
    { t: 'OWASP — Authentication Cheat Sheet',
      u: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
      note: 'The reference on how to do it right. Read the sections on password storage and on error messages: they are the two most people get wrong.' },
    { t: 'Microsoft Learn — Authentication and authorization in ASP.NET Core',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/',
      note: 'How it is configured in your stack. Focus on JWT bearer and on policy-based authorization; the rest is for scenarios you do not have.' },
    { t: 'OWASP — JSON Web Token Cheat Sheet', u: 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html', note: 'JWT risks and where to store the token.' },
    { t: 'MDN — Using HTTP cookies',
      u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
      note: 'The HttpOnly, Secure and SameSite flags. They are three lines of configuration that decide whether your session can be stolen or not.' },
    { t: 'Microsoft Learn — Policy-based authorization', u: 'https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies', note: 'Requirements, handlers and policies in ASP.NET Core.' },
    { t: 'React — Passing Data Deeply with Context', u: 'https://react.dev/learn/passing-data-deeply-with-context', note: 'How to share the session with the whole application.' },
    { t: 'OWASP — Session Management Cheat Sheet', u: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html', note: 'Expiry, renewal and logout.' },
    { t: 'OWASP — Cheat Sheet Series (index)', u: 'https://cheatsheetseries.owasp.org/', note: 'All the OWASP guides in a single index.' }
  ],
  days: [
    {
      t: 'Passwords and sign-up',
      obj: 'Store passwords so that a database leak does not expose your users’ accounts.',
      why: 'It is the most frequent web development mistake with the most serious consequences. Being able to say "a slow, salted hash, never encryption or plain SHA-256" and explain why is an answer expected in any backend interview.',
      study: { r: 0, what: 'Read the Password Storage and Authentication Responses sections of the OWASP cheat sheet. About 15 minutes. Look for one thing: why the login error message must be identical for a non-existent user and a wrong password.',
        pasos: [
          'Read "Introduction" (~2 min).',
          'Read "Implement Proper Password Strength Controls" (~4 min): minimum length and why not to force odd composition rules.',
          'Read "Store Passwords in a Secure Fashion" and "Compare Password Hashes Using Safe Functions" (~4 min); then open the linked Password Storage Cheat Sheet if you want the detail on Argon2 and bcrypt.',
          'Find the section on authentication responses and error messages in the page (~3 min): the same message for a non-existent user and a wrong password.',
          'Write VetCare’s sign-up flow: what is validated, what is stored and what is never stored.'
        ] },
      ex: {
        title: 'A salted hash and a correct sign-up endpoint',
        body: `// WHAT IS NEVER DONE
//   store the password in plain text          -> total leak
//   encrypt it (AES, etc.)                    -> it is reversible, the key leaks too
//   plain SHA-256 or MD5                      -> broken at millions per second with a GPU
//
// WHAT IS DONE: a SLOW hash with a unique SALT per user.
//   bcrypt, scrypt or Argon2id. Slow is the feature, not the flaw:
//   if verifying costs 100 ms, trying a billion passwords is unfeasible.
//   The unique salt makes two users with the same password have different
//   hashes, and defeats precomputed tables.

// dotnet add package BCrypt.Net-Next

// src/VetCare.Domain/Users/User.cs
public class User : EntityBase
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public Role Role { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public static User Create(string email, string password, Role role, ISystemClock clock)
    {
        if (!email.Contains('@'))        throw new BusinessRuleException("Invalid email.");
        if (password.Length < 12)        throw new BusinessRuleException("At least 12 characters.");

        return new User
        {
            Email = email.Trim().ToLowerInvariant(),
            // workFactor 12: ~250ms per hash. Raise it over the years, never lower it.
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12),
            Role = role,
            CreatedAt = clock.Now(),
        };
    }

    public bool VerifyPassword(string attempt)
        => BCrypt.Net.BCrypt.Verify(attempt, PasswordHash);
}
// BCrypt generates the salt by itself and stores it INSIDE the resulting hash.
// You do not need a separate column for the salt.

// Owner: the pet's owner, who only sees their own (you will use it on day 3)
public enum Role { Receptionist, Vet, Admin, Owner }

// LOGIN: the detail almost everyone gets wrong
// A hash of any password, computed ONCE at startup:
var fakeHash = BCrypt.Net.BCrypt.HashPassword("nobody-exists", workFactor: 12);

app.MapPost("/api/auth/login", async (LoginDto dto, VetCareDbContext db, ITokenIssuer tokens) =>
{
    var email = dto.Email.Trim().ToLowerInvariant();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);

    // BAD: if (user is null) return Problem("User does not exist");
    //      -> that confirms to the attacker which emails are registered.
    //      It also answers faster, which can be measured.

    // GOOD: same message, same code, and ALWAYS verify to equalise the time.
    // If the user does not exist, verify against the fake hash: it costs the same.
    // (Careful: "user is not null && user.Verify..." does NOT work, because if it is
    //  null BCrypt is skipped and it answers 250 ms earlier: that can be measured.)
    var matches = BCrypt.Net.BCrypt.Verify(dto.Password,
                                           user?.PasswordHash ?? fakeHash);
    var valid = user is not null && matches;
    if (!valid)
    {
        await Task.Delay(Random.Shared.Next(50, 150));   // extra noise
        return Results.Problem(
            title: "Invalid credentials",
            detail: "The email or the password is not correct.",
            statusCode: 401);
    }

    return Results.Ok(new { token = tokens.Issue(user!) });
});

// SIGN-UP: the same problem the other way round
//   If /api/auth/register answers "that email already exists", you have just
//   built an oracle of registered users. Always answer 202 and send a
//   different email depending on the case.`
      },
      steps: [
        'Create the User entity with the Create factory method and the verification, using BCrypt with workFactor 12. Respect the architecture: the domain does not know EF Core.',
        'Create the migration with the app_user table: id, unique email, password_hash, role and created_at. The email must have a unique index.',
        'Write a domain test that checks three things: the same password produces different hashes for two users, VerifyPassword succeeds with the right one and fails with the wrong one.',
        'Implement the login endpoint exactly as in the example, with the same message and the same code for both failure cases.',
        'Measure the times: log in with a non-existent email and with an existing one but a bad password. If the difference is noticeable, you have a timing leak to fix.'
      ],
      vet: [
        'VetCare has three staff roles: Receptionist books and cancels appointments, Vet records visits and prescriptions, Admin manages users and billing. And one more, Owner: the client, who can only see their own pets. Write it in docs/security.md before writing permission code.',
        'Create an initial admin user with a data migration or a startup command. Never leave it with a default password written in the repository.'
      ],
      edge: [
        'Never log the password, not even in development, not even inside the request object. Logs get copied, emailed and end up in places you do not control.',
        'A minimum length limit matters much more than demanding capitals and symbols. Twelve free characters are safer and more usable than eight with odd rules people get round with Password1!.',
        'BCrypt’s workFactor is raised over the years as hardware improves. Keep the number in configuration and plan to rehash the user’s password on their next successful login.'
      ],
      quiz: [
        { q: 'Why are passwords hashed rather than encrypted?', a: 'Because encryption is reversible: whoever gets the key recovers every password in clear. A hash cannot be undone, so to verify you hash what the user types again and compare the results. Nobody, not even you, needs to know the original password.' },
        { q: 'Why is a slow hash better than a fast one?', a: 'Because the attacker who steals the database tries millions of candidates per second. If verifying one costs 250 milliseconds, trying a billion combinations becomes years of computation. The slowness, irrelevant for a legitimate login, is what makes brute force unfeasible.' },
        { q: 'What does the salt add and why must it be unique per user?', a: 'It makes two users with the same password have different hashes, so an attacker cannot spot repeated accounts or reuse the work of breaking one for the others. It also defeats precomputed tables, because one would have to be generated for every possible salt.' },
        { q: 'Why must the login error be identical for a non-existent user and a wrong password?', a: 'Because telling them apart turns the login into an oracle that confirms which emails are registered, which lets someone build a list of real accounts to attack or phish. For the same reason the response times must be equalised: the difference in duration leaks the same information.' }
      ],
      out: 'Sign-up and login with BCrypt, indistinguishable responses and hash tests green.',
      file: 'src/VetCare.Domain/Users/User.cs'
    },
    {
      t: 'JWT: what it is and where to store it',
      obj: 'Understand what a JWT token is, what it guarantees and what it does not, and make an informed decision about where to store it in the browser.',
      why: 'It is the most common frontend security question and the one most people answer badly. Knowing that a JWT is signed but not encrypted, and explaining the trade-off between localStorage and an HttpOnly cookie, sets you apart immediately.',
      study: { r: 2, what: 'Read the OWASP JWT cheat sheet. About 15 minutes. Look for one thing: the list of places NOT to store the token and the reason for each.',
        pasos: [
          'Read "Introduction" and "Token Structure" with its "Example" (~4 min): header, payload and signature.',
          'Read "Considerations about using JWTs" and "Not using JWTs" (~4 min): when it is better not to use them.',
          'Read "Signed JWTs are not confidential" (~2 min): anyone can read the payload, so nothing sensitive inside.',
          'Read "JWT revocation" (~3 min): a JWT cannot easily be cancelled before it expires.',
          'Write your decision for VetCare: where the token lives, how long it lasts and how the session is closed.'
        ] },
      ex: {
        title: 'Anatomy of the token and the storage decision',
        body: `// A JWT IS THREE BASE64 PARTS SEPARATED BY DOTS
//   eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiI0MiIsInJvbGUiOiJWZXQifQ . 3kFz_x...
//   header                . claims (payload)                    . signature
//
// THE PART EVERYONE GETS CONFUSED ABOUT:
//   the payload is ENCODED in base64, NOT encrypted.
//   Anyone can read it with atob() in the browser console.
//   -> NEVER put sensitive data in a JWT.
//   The signature guarantees that nobody MODIFIED it, not that nobody READ it.

// ISSUING IN ASP.NET CORE
public string Issue(User u)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
    var token = new JwtSecurityToken(
        issuer:   _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, u.Id.ToString()),
            new Claim(ClaimTypes.Role, u.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        },
        expires: DateTime.UtcNow.AddMinutes(15),     // short. Very short. On purpose.
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

    return new JwtSecurityTokenHandler().WriteToken(token);
}
// The key NEVER goes in appsettings.json inside the repository.
// In development: dotnet user-secrets. In production: environment variable or secret manager.
// With HmacSha256 it must be at least 32 bytes (256 bits): if it is shorter, .NET
// throws an error when signing. Generate one with: openssl rand -base64 48

// WHERE TO STORE IT IN THE BROWSER: there is no perfect option, there is a trade-off.
//
// localStorage
//   + simple, survives reloads, easy to send in the Authorization header
//   - ANY JavaScript on the page can read it. One XSS = stolen session.
//     And a single compromised npm dependency is enough.
//
// HttpOnly + Secure + SameSite=Strict cookie
//   + JavaScript CANNOT read it, so an XSS does not steal the token
//   + it is sent by itself on every request
//   - you have to think about CSRF (SameSite=Strict mitigates it almost entirely)
//   - it requires API and web to share a domain or configuring CORS with credentials
//
// RECOMMENDATION: HttpOnly cookie. An XSS is still serious, but it does not
// carry the session off to another computer.

// IN ASP.NET CORE, ISSUING THE COOKIE
Results.Ok(new { user = new { u.Id, u.Email, role = u.Role.ToString() } });
// and before that:
context.Response.Cookies.Append("vetcare_session", token, new CookieOptions
{
    HttpOnly = true,                    // JavaScript does not see it
    Secure   = true,                    // only over HTTPS
    SameSite = SameSiteMode.Strict,     // not sent from other sites -> anti CSRF
    Expires  = DateTimeOffset.UtcNow.AddMinutes(15),
    Path     = "/",
});

// CAREFUL: JwtBearer looks for the token in the Authorization header, NOT in cookies.
// You have to tell it where it is, when configuring it in Program.cs:
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 },  // never "none"
        };
        o.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                ctx.Token = ctx.Request.Cookies["vetcare_session"];   // from the cookie
                return Task.CompletedTask;
            }
        };
    });
// Without OnMessageReceived, every request arrives as anonymous and
// you will get 401 even though the cookie is there.

// And IN THE FRONTEND, no storing tokens:
await fetch('/api/v1/appointments', { credentials: 'include' });   // the cookie goes by itself
// The frontend does not know the token. It cannot leak it. That is the idea.`
      },
      steps: [
        'Install Microsoft.AspNetCore.Authentication.JwtBearer and configure validation in Program.cs as in the example: issuer, audience, key, algorithm and reading the token from the cookie (OnMessageReceived). Expiry is validated by itself. Add app.UseAuthentication() and app.UseAuthorization() in week 12’s order.',
        'Store the signing key with dotnet user-secrets set "Jwt:Key" and check that appsettings.json does not contain it. Add a startup check that fails if it is not configured.',
        'Change the login so it issues the HttpOnly cookie with the example’s three flags and returns only the user’s public data, never the token.',
        'Copy an issued token, paste it into jwt.io or decode the payload with atob in the browser console. Seeing it in clear is what fixes the lesson.',
        'Write the storage decision in docs/security.md with the discarded alternative and the reason, in ADR format as you learned in week 15.'
      ],
      vet: [
        'VetCare’s JWT carries only the user’s identifier and their role. No email, name or clinic data: anyone who intercepts the token can read the contents.',
        'Add to docs/security.md the exact list of claims your token includes and why each one is needed.'
      ],
      edge: [
        'A JWT cannot be revoked by itself: once issued it is valid until it expires, even if you delete the user. That is why the expiry is short and tomorrow you add refresh.',
        'The signing key in the repository is a total leak: anyone can issue valid tokens with the admin role. If you ever push it by mistake, it has to be rotated; deleting the commit is not enough.',
        'The none algorithm exists in the JWT specification and was a historical hole. Always configure the expected algorithm explicitly in validation and never trust the one the token’s header says.'
      ],
      quiz: [
        { q: 'What does a JWT’s signature guarantee and what does it not guarantee?', a: 'It guarantees integrity and authenticity: that the token was issued by whoever has the key and that nobody has changed its contents. It does not guarantee confidentiality, because the payload is base64-encoded and anyone can read it by decoding it, without needing any key.' },
        { q: 'Why is storing the token in localStorage dangerous?', a: 'Because any JavaScript running on the page can read it, including code coming in through an XSS or a compromised dependency. With the token in hand, the attacker can use the session from any other machine until it expires.' },
        { q: 'What do the HttpOnly, Secure and SameSite flags provide?', a: 'HttpOnly stops JavaScript from reading the cookie, so an XSS cannot steal the session. Secure stops it travelling over unencrypted HTTP. SameSite stops the browser sending it on requests originating from other sites, which is the basis of the CSRF attack.' },
        { q: 'Why does the token expire after only fifteen minutes?', a: 'Because a JWT cannot be revoked: it stays valid until it expires even if you delete the user or change their password. A short window limits the damage of a stolen token, and convenience is recovered with a separate refresh mechanism.' }
      ],
      out: 'A login that issues a signed HttpOnly cookie, with the key outside the repository and the decision documented.',
      file: 'docs/security.md'
    },
    {
      t: 'Authorisation in the backend',
      obj: 'Protect every endpoint with the right permission and understand that per-resource authorisation is different from per-role authorisation.',
      why: 'The most common security flaw in real APIs is not authentication but authorisation: endpoints where an authenticated user can access another’s data by changing an id. It has its own name, IDOR, and comes up in security interviews.',
      study: { r: 4, what: 'Read Policy-based authorization and, from the side index, Resource-based authorization. About 18 minutes. Look for one thing: the difference between a role-based requirement and a resource-based one.',
        pasos: [
          'Read "Requirements and policy registration" (~4 min): a policy is a named set of requirements.',
          'Read "Apply policies to endpoints" (~3 min): RequireAuthorization in Minimal APIs.',
          'Read "Authorization handlers" and "Use a handler for one requirement" (~5 min).',
          'From the side index open Resource-based authorization (~5 min): when the decision depends on the data, such as a vet only seeing their appointments.',
          'Make a table with each VetCare endpoint and its rule: public, by role or by resource.'
        ] },
      ex: {
        title: 'Three levels of authorisation',
        body: `// LEVEL 1: authenticated or not
app.MapGet("/appointments", ...).RequireAuthorization();
app.MapGet("/health/live", ...).AllowAnonymous();

// LEVEL 2: by role  -- "who you are determines what you can do"
builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("ManageSchedule", p => p.RequireRole("Receptionist", "Admin"));
    o.AddPolicy("MedicalAct",     p => p.RequireRole("Vet"));
    o.AddPolicy("Billing",        p => p.RequireRole("Admin"));
});

appointments.MapPost("/",                    CreateAppointment).RequireAuthorization("ManageSchedule");
appointments.MapPost("/{id:guid}/cancellation", Cancel).RequireAuthorization("ManageSchedule");
visits.MapPost("/",           Record).RequireAuthorization("MedicalAct");
invoices.MapPost("/",         Issue).RequireAuthorization("Billing");

// LEVEL 3: by resource  -- "can you do it, but ON THIS specific item?"
// This is the one almost nobody implements and the one that causes the leaks.
//
// IDOR (Insecure Direct Object Reference):
//   GET /api/v1/pets/{id} -> the user puts in the id of someone else's pet
//   (they saw it in a link, a log, a screenshot) and sees it.
//   They have the right role. They are authenticated. And still they should not be able to.
//   VetCare using UUIDs makes it harder to guess, but does NOT prevent it.

// BAD
app.MapGet("/api/v1/pets/{id:guid}", async (Guid id, VetCareDbContext db) =>
{
    var p = await db.Pets.FindAsync(id);
    return p is null ? Results.NotFound() : Results.Ok(ToDto(p));
}).RequireAuthorization();
// Any authenticated user sees ANY pet. Complete leak.

// GOOD: the ownership filter goes in the QUERY, not in a later if
app.MapGet("/api/v1/pets/{id:guid}", async (
    Guid id, ClaimsPrincipal who, VetCareDbContext db, CancellationToken ct) =>
{
    // the token's "sub" arrives as ClaimTypes.NameIdentifier
    var userId = Guid.Parse(who.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var isStaff = who.IsInRole("Vet") || who.IsInRole("Receptionist")
               || who.IsInRole("Admin");

    var query = db.Pets.AsNoTracking().Where(p => p.Id == id);

    if (!isStaff)
        query = query.Where(p => db.Owners.Any(             // only their own
            o => o.Id == p.OwnerId && o.UserId == userId));

    var p = await query.Select(x => ToDto(x)).FirstOrDefaultAsync(ct);

    // 404, not 403: if you return 403 you are confirming that pet exists.
    return p is null ? Results.NotFound() : Results.Ok(p);
}).RequireAuthorization();

// WHY IN THE QUERY AND NOT IN AN if AFTERWARDS
//   a) it is impossible to forget to check before returning
//   b) you do not load from the database data you cannot show
//   c) it works the same for lists: the same clause filters one or a thousand rows

// GOLDEN RULE
//   Never trust an identifier coming from the client without checking
//   that this client has a right to that specific object.`
      },
      steps: [
        'Define the example’s three policies in Program.cs and apply RequireAuthorization with the right policy to every VetCare endpoint.',
        'Make an inventory in docs/security.md: one row per endpoint with method, route, policy applied and whether it also needs a per-resource check.',
        'Identify every endpoint that receives an id from the client and returns data. Each of them is a possible IDOR until you prove otherwise.',
        'Implement the ownership filter inside the query in at least the pet and history endpoints. Return 404, never 403.',
        'Add a user_id column to the owner table (uuid, nullable: not every owner has an account). Write security integration tests: a user with the Owner role asks for another owner’s pet and must get 404; a Receptionist role asks to record a visit and must get 403.'
      ],
      vet: [
        'In VetCare the critical case is the clinical history: an owner can only see their own pets’. It is sensitive data and the filter has to be in the read query, which in your CQRS architecture bypasses the domain.',
        'Remember week 15’s warning: read queries that do not go through the domain can skip visibility rules. This is exactly that situation, so those tests are not optional.'
      ],
      edge: [
        'Returning 403 instead of 404 for someone else’s resource confirms that the resource exists, which allows valid identifiers to be enumerated. For a resource that does not belong to you, the right thing is for it simply not to exist.',
        'Checking permissions with an if after loading the object works until someone adds a new path and forgets the if. Putting it in the query makes the protection travel with the data access.',
        'The roles in the token stay frozen until it expires. If you demote a user from admin to receptionist, they will still be admin for fifteen minutes: it is the price of stateless tokens.'
      ],
      quiz: [
        { q: 'What is an IDOR and why is it so common?', a: 'It is when an authenticated user accesses another’s data simply by changing an identifier in the URL. It is common because the endpoint passes the authentication and role checks, which is what people test, and nobody also checks that this specific object belongs to whoever asks for it.' },
        { q: 'Why must the ownership filter go in the query and not in a later if?', a: 'Because that way the protection is inseparable from the data access: it cannot be forgotten on a new path, you do not load from the database information you will not be able to show, and the same clause works for a single item as for a whole list.' },
        { q: 'Why return 404 and not 403 when the resource belongs to another user?', a: 'Because a 403 confirms that the resource exists and lets someone enumerate valid identifiers by trying values. From the point of view of someone with no right to see it, that object should be indistinguishable from a non-existent one.' },
        { q: 'What is the difference between authorisation by role and by resource?', a: 'Role authorisation answers what kind of actions someone can do, such as recording a visit if they are a vet. Resource authorisation answers which specific items they can do them on, such as seeing only the pets they own. Both are needed: the first without the second leaves the door open to IDORs.' }
      ],
      out: 'Every endpoint with a policy applied, ownership filters in the query and security tests green.',
      file: 'docs/security.md'
    },
    {
      t: 'Session in the frontend',
      obj: 'Represent the authenticated user in React, protect routes and gracefully handle the moment the session expires.',
      why: 'It is the part that decides whether the application is usable: a session that expires and throws you to the login screen losing what you were typing is one of the most frustrating experiences there are.',
      study: { r: 5, what: 'Read the whole page. About 15 minutes. Look for one thing: when to use context and why it should not replace passing props.',
        pasos: [
          'Read the problem at the start (~3 min): passing props through many levels.',
          'Follow the three steps (~6 min): create the context, use it with useContext and provide it.',
          'Read the part about before you use context (~3 min): the alternatives, such as passing props or using children.',
          'Read the use cases for context (~2 min): theme, current user, routing.',
          'Write which session data will go in VetCare’s context and which will keep going through props.'
        ] },
      ex: {
        title: 'Session context and protected routes',
        body: `// src/auth/SessionContext.tsx
interface SessionUser {
  id: string;
  email: string;
  role: 'Receptionist' | 'Vet' | 'Admin' | 'Owner';
}

const SessionCtx = createContext<{
  user: SessionUser | null;
  loading: boolean;
} | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // The token is in an HttpOnly cookie: the frontend does NOT see it.
  // To know who you are, you ask the server.
  const { data: user = null, isPending: loading } = useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<SessionUser | null> => {
      const r = await fetch('/api/auth/me', { credentials: 'include' });
      if (r.status === 401) return null;          // not authenticated, not an error
      if (!r.ok) throw new Error('Error checking the session');
      return r.json();
    },
    staleTime: 5 * 60_000,
    retry: false,                                  // a 401 is not retried
  });

  return <SessionCtx.Provider value={{ user, loading }}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}

// PROTECTED ROUTE
export function ProtectedRoute({ roles }: { roles?: SessionUser['role'][] }) {
  const { user, loading } = useSession();
  const location = useLocation();

  if (loading) return <LoadingScreen />;        // without this it flickers to login

  if (!user) {
    // remember where they were going to come back after logging in
    return <Navigate to="/login" state={{ destination: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) return <NoPermission />;

  return <Outlet />;
}

// In the routes:
{
  element: <ProtectedRoute />,
  children: [
    { path: 'schedule', element: <Schedule /> },
    {
      element: <ProtectedRoute roles={['Admin']} />,
      children: [{ path: 'users', element: <UserManagement /> }],
    },
  ],
}

// EXPIRED SESSION: a 401 can arrive at any moment
export async function request(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, credentials: 'include' });

  if (r.status === 401) {
    // do not reload the page: that wipes what the user was typing
    window.dispatchEvent(new CustomEvent('session-expired'));
    throw new SessionExpiredError();
  }
  return r;
}

// A component listens and shows a dialog on top, without destroying the screen:
useEffect(() => {
  const on401 = () => setShowLoginDialog(true);
  window.addEventListener('session-expired', on401);
  return () => window.removeEventListener('session-expired', on401);
}, []);
// The user logs in again in the dialog and carries on exactly where they were.

// THE MOST IMPORTANT WARNING
// Hiding a button by role is ERGONOMICS, not security.
// Anyone who opens the devtools sees it anyway, and can call the API with curl.
// The only real authorisation is yesterday's backend one.`
      },
      steps: [
        'Create the GET /api/auth/me endpoint in the backend: it returns the authenticated user’s id, email and role, or 401 if not authenticated.',
        'Implement the SessionProvider with useQuery and mount it above the router. The loading state is essential so it does not flicker to the login on reload.',
        'Implement ProtectedRoute with role support and protect VetCare’s routes according to the permissions table you wrote yesterday.',
        'Implement the expired session flow with the custom event and a re-login dialog. Test that after logging in again you are on the same screen with what you had typed.',
        'Hide in the UI the actions the role cannot do, and then prove to yourself it is not security: call the protected endpoint with curl without the cookie and check that the backend rejects it.'
      ],
      vet: [
        'In VetCare, Receptionist must not see the record visit button and Vet must not see the issue invoice one. But both endpoints must reject the direct call all the same.',
        'Add the sentence that sums up the lesson at the end of docs/security.md: the UI hides options for convenience, the backend prevents them for security.'
      ],
      edge: [
        'If ProtectedRoute does not wait for the loading state, on reload the user sees a flicker to the login before the session response arrives, even though they are perfectly authenticated.',
        'Reloading the whole page on a 401 destroys the form the user was filling in. An overlay dialog keeps the work and is the difference between a tolerable app and an irritating one.',
        'Do not store the role in localStorage to avoid the session request. Anyone can edit it from the console and grant themselves the admin role in the UI; they gain no real access, but you see how far it is from being a source of truth.'
      ],
      quiz: [
        { q: 'Why does the frontend ask the server who the user is instead of reading the token?', a: 'Because with an HttpOnly cookie JavaScript cannot read the token, which is precisely what protects it from an XSS. The way to know the session is an endpoint that returns the authenticated user’s public data, and that response is cached like any other query.' },
        { q: 'Why must ProtectedRoute wait for the loading state?', a: 'Because while the session request is in flight the user is still null, and redirecting at that moment sends someone who is authenticated to the login. The result is an annoying flicker on every reload and, if the redirect is aggressive, an unjustified ejection.' },
        { q: 'Why is hiding buttons by role not security?', a: 'Because frontend code runs on a machine the user controls: they can see the hidden button in the developer tools or call the API directly with curl. It is a help so as not to show useless options, but what prevents the action is the backend.' },
        { q: 'What does the user gain with a re-login dialog instead of a redirect to the login?', a: 'They keep the context and the work in progress. A redirect destroys the form they were filling in and forces them to navigate back to where they were, while the dialog lets them carry on exactly where they left off after authenticating again.' }
      ],
      out: 'A React session with role-protected routes and expiry handled without losing the user’s work.',
      file: 'web/src/auth/SessionContext.tsx'
    },
    {
      t: 'Refresh, logout and defences',
      obj: 'Complete the session life cycle and add the minimum defences every exposed application needs.',
      why: 'This is where the loose ends that separate a prototype from something deployable are tied: real revocation, attempt limiting and security headers. They are things a reviewer looks for immediately.',
      study: { r: 6, what: 'Read the Session Expiration and Manual Session Expiration sections of the cheat sheet. About 15 minutes. Look for one thing: why logout has to invalidate something on the server and not just delete the cookie.',
        pasos: [
          'Read "Cookies" with "Secure Attribute", "HttpOnly Attribute" and "SameSite Attribute" (~5 min).',
          'Read "HTML5 Web Storage API" and "The localStorage API" (~3 min): why it is not a good place for a session token.',
          'Find the session expiration section and the manual expiration one in the page (~5 min).',
          'Write the life cycle of a VetCare session: duration, renewal and what is invalidated on the server on logout.'
        ] },
      ex: {
        title: 'Refresh token, real logout and defences',
        body: `// THE PROBLEM: a 15-minute access token = the user logs in again every 15 minutes.
// THE SOLUTION: two tokens with different responsibilities.
//
//   Access token    15 min   stateless, signed, sent on every request
//   Refresh token   7 days   STORED IN THE DATABASE, therefore REVOCABLE
//
// The key is that the refresh token has state: there is a row you can delete.

// refresh_token table
//   id uuid pk, user_id uuid fk, token_hash text not null,
//   expires_at timestamptz not null, revoked_at timestamptz null,
//   replaced_by uuid null, created_from_ip inet null
// The token's HASH is stored, not the token. If the table leaks, they are useless.

app.MapPost("/api/auth/refresh", async (HttpContext ctx, VetCareDbContext db,
        ITokenIssuer issuer, ILogger<Program> log, CancellationToken ct) =>
{
    var raw = ctx.Request.Cookies["vetcare_refresh"];
    if (raw is null) return Results.Unauthorized();

    var hash = Hash(raw);
    var row = await db.RefreshTokens.Include(t => t.User)
                      .FirstOrDefaultAsync(t => t.TokenHash == hash, ct);

    if (row is null || row.ExpiresAt < DateTime.UtcNow)
        return Results.Unauthorized();

    // THEFT DETECTION: if someone uses an already revoked token, someone copied it.
    if (row.RevokedAt is not null)
    {
        await RevokeWholeChainAsync(db, row.UserId, ct);   // closes EVERYTHING
        log.LogWarning("Refresh token reuse for user {Id}", row.UserId);
        return Results.Unauthorized();
    }

    // ROTATION: each refresh invalidates the previous one and issues a new one
    var fresh = GenerateRefreshToken();
    row.RevokedAt = DateTime.UtcNow;
    row.ReplacedBy = fresh.Id;
    db.RefreshTokens.Add(fresh);
    await db.SaveChangesAsync(ct);

    IssueCookies(ctx, issuer.Issue(row.User), fresh.Raw);
    return Results.NoContent();
});

// REAL LOGOUT
app.MapPost("/api/auth/logout", async (HttpContext ctx, VetCareDbContext db, CancellationToken ct) =>
{
    var raw = ctx.Request.Cookies["vetcare_refresh"];
    if (raw is not null)
    {
        // deleting the cookie is NOT enough: the token would still be valid
        // for whoever had a copy. It has to be revoked in the database.
        var hash = Hash(raw);
        await db.RefreshTokens
            .Where(t => t.TokenHash == hash && t.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, DateTime.UtcNow), ct);
    }
    ctx.Response.Cookies.Delete("vetcare_session");
    ctx.Response.Cookies.Delete("vetcare_refresh");
    return Results.NoContent();
});

// LIMIT LOGIN ATTEMPTS  (.NET 7+, no libraries)
// One counter PER IP. (Plain AddFixedWindowLimiter creates ONE single counter
// for the whole app: 5 logins per minute across ALL users.)
builder.Services.AddRateLimiter(o =>
{
    o.AddPolicy("login", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 5,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0
        }));
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});
app.UseRateLimiter();
app.MapPost("/api/auth/login", Login).RequireRateLimiting("login");

// SECURITY HEADERS (your own middleware, three minutes of work)
app.Use(async (ctx, next) =>
{
    var h = ctx.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";
    h["X-Frame-Options"] = "DENY";                       // anti clickjacking
    h["Referrer-Policy"] = "strict-origin-when-cross-origin";
    h["Content-Security-Policy"] = "default-src 'self'"; // the best anti-XSS defence
    await next();
});
if (!app.Environment.IsDevelopment())
    app.UseHsts();   // forces HTTPS in browsers
// (HSTS is not sent to localhost: locally it is normal not to see that header)`
      },
      steps: [
        'Create the refresh_token table with its migration and always store the token’s hash, never the value in clear.',
        'Implement the refresh and logout endpoints with rotation, reuse detection and real revocation in the database.',
        'In the frontend, intercept the 401 and try a silent refresh before showing the re-login dialog. Only if the refresh also fails do you ask for credentials.',
        'Add the rate limiter to the login endpoint and check it by firing six attempts in a row with curl: the sixth must answer 429.',
        'Add the headers middleware and check the result in the browser’s Network tab, checking that the middleware’s four headers appear on every response (the fifth, HSTS, only appears outside localhost).'
      ],
      vet: [
        'Test VetCare’s theft detection: save a refresh token, use it to refresh, and then try to use the old one. That user’s whole chain must end up revoked.',
        'Complete docs/security.md with the diagram of the session life cycle: login, use, refresh with rotation, expiry and logout.'
      ],
      edge: [
        'Deleting the cookie on the client does not close the session: whoever has a copy of the token can still get in. Logout is only real if it invalidates something on the server.',
        'Without rotation, a stolen refresh token works for the full seven days without you being able to detect it. With rotation, the first use by the attacker or by the legitimate user gives away the duplication.',
        'A limiter by IP address alone punishes entire offices going out through the same IP and does not stop a distributed attacker. Combine it with a per-account limit and growing delays.'
      ],
      quiz: [
        { q: 'Why is the refresh token stored in the database and the access token not?', a: 'Because the access token is stateless and its security comes from lasting very little, while the refresh token lasts days and needs to be revocable. Having a row in the database is exactly what allows it to be invalidated on logout or when a theft is detected.' },
        { q: 'What is refresh token rotation and what does it allow you to detect?', a: 'It is issuing a new token and revoking the used one on every refresh, so each token only works once. It allows you to detect a theft: if someone tries to use an already revoked token, it means two copies exist, and the right response is to revoke that user’s whole chain.' },
        { q: 'Why is deleting the cookie not the same as logging out?', a: 'Because the cookie is only a copy of the token in that browser. If someone captured the value, they still have it and the API still accepts it until it expires. Logout is only effective if it invalidates the token on the server.' },
        { q: 'What does the Content-Security-Policy header protect and why does it matter so much here?', a: 'It restricts which origins code can be loaded and run from on the page, which cuts off the main route for an XSS. It matters especially because an XSS is the attack that could act on the user’s behalf even with an HttpOnly cookie, so it is the defence that complements secure token storage.' }
      ],
      out: 'A complete session cycle with rotation, theft detection, attempt limiting and security headers.',
      file: 'src/VetCare.Api/Auth/'
    },
    {
      t: 'VetCare security audit (weekly exam)',
      obj: 'Review the whole application actively looking for the flaws you yourself might have left, and leave a written record.',
      why: 'Auditing your own work with an objective list is a skill you can demonstrate. Being able to say you tried to exploit your application and found and fixed two things is worth much more than claiming it is secure.',
      study: { r: 7, what: 'Go through the OWASP Cheat Sheet Series index and open the two or three that apply to VetCare and you have not read yet. About 15 minutes. Look for one thing: a specific risk you have not considered this week.',
        pasos: [
          'Go through the Cheat Sheet Series index (~3 min) and choose two or three that apply to VetCare and you have not read.',
          'Good candidates: Authorization, REST Security, Logging, Cross-Site Request Forgery Prevention.',
          'In each one read only the introduction and the main list of recommendations (~4 min per cheat sheet).',
          'Turn each recommendation you do not meet into a line of today’s audit script.'
        ] },
      ex: {
        title: 'Audit script: try to break your own application',
        body: `ATTACK 1 — IDOR on every endpoint with an identifier
  How:      log in as owner A and request /api/v1/pets/{id} of a pet
            belonging to owner B (copy its id from the database). Repeat with history,
            invoices and appointments.
  Expected: 404 on all the ones that do not belong to you.
  Result:   ______________________

ATTACK 2 — Bypassing the UI
  How:      log in as Receptionist, who does not see the record visit button.
            curl -X POST /api/v1/pets/{id}/visits --cookie "vetcare_session=..." -d '{...}'
  Expected: 403.
  Result:   ______________________

ATTACK 3 — Tampering with the token
  How:      copy your cookie, decode the payload, change the role to Admin,
            re-encode it in base64 and use it.
  Expected: 401. The signature does not match and validation rejects it.
  Result:   ______________________

ATTACK 4 — Brute force
  How:      20 login attempts with a wrong password against the same account.
  Expected: 429 from the sixth. The message is still identical to the
            non-existent user one.
  Result:   ______________________

ATTACK 5 — User enumeration
  How:      log in with a non-existent email and with a real email and a bad password.
            Compare the body, the status code AND the response time.
  Expected: indistinguishable in all three respects.
  Result:   ______________________

ATTACK 6 — The session that will not die
  How:      copy the vetcare_refresh cookie, log out and then call
            POST /api/auth/refresh with that old cookie.
  Expected: 401. (Careful: with the old ACCESS cookie, the API will keep
            answering for up to 15 minutes: a JWT cannot be revoked.
            Note it as an accepted risk, not as a flaw.)
  Result:   ______________________

ATTACK 7 — SQL injection
  How:      in the search box type: ' OR 1=1 --
            And in any field that ends up in a query.
  Expected: nothing. EF Core parameterises. Check by hand your SqlQueryRaw from
            week 15: that is where you might have concatenated.
  Result:   ______________________

ATTACK 8 — Secrets in the repository
  How:      grep -rniE "(password|secret|apikey|connectionstring)" --include=*.json .
            And check the git history, not only the current files.
  Expected: nothing real. Only placeholders.
  Result:   ______________________

FINAL CHECKLIST
  [ ] Passwords with BCrypt workFactor >= 12, never in logs
  [ ] Login and sign-up do not reveal which emails exist, not even by timing
  [ ] Token in an HttpOnly + Secure + SameSite cookie, short expiry
  [ ] Signing key outside the repository
  [ ] Every non-public route with RequireAuthorization
  [ ] Every endpoint with a client id filters by ownership IN THE QUERY
  [ ] Someone else's resource returns 404, not 403
  [ ] Refresh with rotation and reuse detection
  [ ] Logout revokes on the server
  [ ] Rate limiting on login
  [ ] The five security headers present
  [ ] HTTPS mandatory with HSTS
  [ ] No secrets in the repository or its history`
      },
      steps: [
        'Really run the eight attacks against your application locally. Write the actual result of each in docs/security.md.',
        'For every attack that succeeds, fix the code and run it again until it fails. Document what was wrong: that is the week’s most valuable learning.',
        'Turn at least attacks 1, 2, 3 and 6 into automated integration tests. They are regressions that can come back with any refactor.',
        'Go through the final checklist pointing out in the code where each item is. What you cannot point to is not done.',
        'Explain out loud for three minutes how you protected VetCare, in this order: what you store and how, how you know who the user is, how you decide what they can do and what you found when trying to break it.'
      ],
      vet: [
        'Your docs/security.md must end up complete: roles and permissions, endpoint inventory, token storage decision, session life cycle and the eight audit results.',
        'Press "Mark for review" and reread docs/security.md in a week.'
      ],
      edge: [
        'Do not run these attacks against systems that are not yours. What in your local environment is learning is, against someone else’s server without written authorisation, a crime.',
        'A checklist ticked without checking is worse than not having one, because it creates false confidence that stops anyone really reviewing it later.',
        'Security is never finished: what is fine today can break with a new dependency or an endpoint added in a hurry. Repeat this audit every time you add exposed surface.'
      ],
      quiz: [
        { q: 'Why does the audit include trying to bypass the UI with curl?', a: 'Because it is exactly what an attacker would do and because it checks the only protection that counts, the server’s. If the endpoint answers correctly to a direct call that does not go through the UI, you have verified that hiding the button was only convenience and not your defence.' },
        { q: 'What does attack 3 tell you about the token’s signature?', a: 'That the signature makes the payload immutable in practice: you can read and modify it, but you cannot recompute a valid signature without the server’s key. That is why the attempt to promote yourself to admin is rejected with a 401 instead of granting you the role.' },
        { q: 'Why does attack 8 also check the git history?', a: 'Because deleting a secret from the file does not delete it from the history: anyone who clones the repository can recover it from an old commit. A secret that was ever published must be considered compromised and rotated, not just removed from the current state.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That security is not a feature you add but a set of verifiable decisions at every layer: how you store what you must never be able to read, where you put the token so an XSS cannot take it, and above all that real authorisation lives in the server’s query and not in the buttons you decide to show.' }
      ],
      out: 'Eight attacks run and documented, with the flaws found fixed and covered by tests.',
      file: 'docs/security.md'
    }
  ]
}
]);
