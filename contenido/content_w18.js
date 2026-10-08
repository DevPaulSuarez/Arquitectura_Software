window.WEEKS = (window.WEEKS || []).concat([
{
  n: 18,
  phase: 'Frontend',
  title: 'Autenticación y autorización de punta a punta',
  idea: 'Hasta ahora cualquiera que abra VetCare puede ver y cancelar las citas de cualquiera. Falta la pieza que todo sistema real necesita: saber quién eres (autenticación) y qué puedes hacer (autorización). Es la parte donde más errores graves se cometen, porque la mayoría se resuelve mal copiando un tutorial: contraseñas mal guardadas, tokens en localStorage, y comprobaciones de permisos que solo existen en el frontend. Esta semana la haces bien y entiendes por qué cada decisión es la que es.',
  res: [
    { t: 'OWASP — Authentication Cheat Sheet',
      u: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
      note: 'La referencia sobre cómo se hace bien. Lee las secciones de almacenamiento de contraseñas y de mensajes de error: son las dos que más gente falla.' },
    { t: 'Microsoft Learn — Authentication and authorization in ASP.NET Core',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/',
      note: 'Cómo se configura en tu stack. Céntrate en JWT bearer y en policy-based authorization; el resto es para escenarios que no tienes.' },
    { t: 'OWASP — JSON Web Token Cheat Sheet', u: 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html', note: 'Riesgos de JWT y dónde guardar el token.' },
    { t: 'MDN — Using HTTP cookies',
      u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
      note: 'Las banderas HttpOnly, Secure y SameSite. Son tres líneas de configuración que deciden si tu sesión es robable o no.' },
    { t: 'Microsoft Learn — Policy-based authorization', u: 'https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies', note: 'Requisitos, handlers y políticas en ASP.NET Core.' },
    { t: 'React — Passing Data Deeply with Context', u: 'https://react.dev/learn/passing-data-deeply-with-context', note: 'Cómo compartir la sesión con toda la aplicación.' },
    { t: 'OWASP — Session Management Cheat Sheet', u: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html', note: 'Caducidad, renovación y cierre de sesión.' },
    { t: 'OWASP — Cheat Sheet Series (índice)', u: 'https://cheatsheetseries.owasp.org/', note: 'Todas las guías de OWASP en un solo índice.' }
  ],
  days: [
    {
      t: 'Contraseñas y registro',
      obj: 'Guardar contraseñas de forma que una filtración de la base de datos no exponga las cuentas de tus usuarios.',
      why: 'Es el error con consecuencias más graves y más frecuentes del desarrollo web. Saber decir "hash lento con sal, nunca cifrado ni SHA-256 a secas" y explicar por qué es una respuesta que se espera en cualquier entrevista de backend.',
      study: { r: 0, what: 'Lee las secciones Password Storage y Authentication Responses del cheat sheet de OWASP. Unos 15 minutos. Busca una cosa: por qué el mensaje de error de login debe ser idéntico para usuario inexistente y contraseña incorrecta.',
        pasos: [
          'Lee "Introduction" (~2 min).',
          'Lee "Implement Proper Password Strength Controls" (~4 min): longitud mínima y por qué no forzar reglas raras de composición.',
          'Lee "Store Passwords in a Secure Fashion" y "Compare Password Hashes Using Safe Functions" (~4 min); después abre el Password Storage Cheat Sheet enlazado si quieres el detalle de Argon2 y bcrypt.',
          'Busca en la página la sección sobre respuestas de autenticación y mensajes de error (~3 min): el mismo mensaje para usuario inexistente y contraseña incorrecta.',
          'Escribe el flujo de registro de VetCare: qué se valida, qué se guarda y qué nunca se guarda.'
        ] },
      ex: {
        title: 'Hash con sal y un endpoint de registro correcto',
        body: `// LO QUE NUNCA SE HACE
//   guardar la contraseña en texto plano       -> filtración total
//   cifrarla (AES, etc.)                       -> es reversible, la clave se filtra también
//   SHA-256 o MD5 a secas                      -> se rompen a millones por segundo con GPU
//
// LO QUE SE HACE: un hash LENTO y con SAL única por usuario.
//   bcrypt, scrypt o Argon2id. Lento es la característica, no el defecto:
//   si verificar cuesta 100 ms, probar mil millones de contraseñas es inviable.
//   La sal única hace que dos usuarios con la misma contraseña tengan hashes
//   distintos, y anula las tablas precalculadas.

// dotnet add package BCrypt.Net-Next

// src/VetCare.Domain/Usuarios/Usuario.cs
public class Usuario : EntidadBase
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Email { get; private set; } = null!;
    public string HashContrasena { get; private set; } = null!;
    public Rol Rol { get; private set; }
    public DateTime CreadoEn { get; private set; }

    public static Usuario Crear(string email, string contrasena, Rol rol, IRelojSistema reloj)
    {
        if (!email.Contains('@'))        throw new ReglaNegocioException("Email inválido.");
        if (contrasena.Length < 12)      throw new ReglaNegocioException("Mínimo 12 caracteres.");

        return new Usuario
        {
            Email = email.Trim().ToLowerInvariant(),
            // workFactor 12: ~250ms por hash. Súbelo con los años, no lo bajes.
            HashContrasena = BCrypt.Net.BCrypt.HashPassword(contrasena, workFactor: 12),
            Rol = rol,
            CreadoEn = reloj.Ahora(),
        };
    }

    public bool VerificarContrasena(string intento)
        => BCrypt.Net.BCrypt.Verify(intento, HashContrasena);
}
// BCrypt genera la sal solo y la guarda DENTRO del hash resultante.
// No necesitas una columna aparte para la sal.

// Dueno: el dueño de la mascota, que solo ve las suyas (lo usarás el día 3)
public enum Rol { Recepcion, Veterinario, Administrador, Dueno }

// EL LOGIN: el detalle que casi todos fallan
// Un hash de una contraseña cualquiera, calculado UNA vez al arrancar:
var hashFalso = BCrypt.Net.BCrypt.HashPassword("no-existe-nadie", workFactor: 12);

app.MapPost("/api/auth/login", async (LoginDto dto, VetCareDbContext db, IEmisorTokens tokens) =>
{
    var email = dto.Email.Trim().ToLowerInvariant();
    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

    // MAL: if (usuario is null) return Problem("Usuario no existe");
    //      -> eso le confirma al atacante qué emails están registrados.
    //      Además responde más rápido, lo que se puede medir.

    // BIEN: mismo mensaje, mismo código, y verifica SIEMPRE para igualar el tiempo.
    // Si el usuario no existe, se verifica contra el hash falso: cuesta lo mismo.
    // (Ojo: "usuario is not null && usuario.Verificar..." NO vale, porque si es
    //  null se salta el BCrypt y responde 250 ms antes: eso se mide.)
    var coincide = BCrypt.Net.BCrypt.Verify(dto.Contrasena,
                                            usuario?.HashContrasena ?? hashFalso);
    var valida = usuario is not null && coincide;
    if (!valida)
    {
        await Task.Delay(Random.Shared.Next(50, 150));   // ruido adicional
        return Results.Problem(
            title: "Credenciales inválidas",
            detail: "El email o la contraseña no son correctos.",
            statusCode: 401);
    }

    return Results.Ok(new { token = tokens.Emitir(usuario!) });
});

// REGISTRO: el mismo problema al revés
//   Si /api/auth/registro responde "ese email ya existe", acabas de dar un
//   oráculo de usuarios registrados. Responde 202 siempre y manda un
//   correo distinto según el caso.`
      },
      steps: [
        'Crea la entidad Usuario con el método de fábrica Crear y la verificación, usando BCrypt con workFactor 12. Respeta la arquitectura: el dominio no conoce EF Core.',
        'Crea la migración con la tabla usuario: id, email único, hash_contrasena, rol y creado_en. El email debe tener un índice único.',
        'Escribe un test de dominio que compruebe tres cosas: la misma contraseña produce hashes distintos para dos usuarios, VerificarContrasena acierta con la correcta y falla con la incorrecta.',
        'Implementa el endpoint de login exactamente como en el ejemplo, con el mismo mensaje y el mismo código para los dos casos de fallo.',
        'Mide los tiempos: haz login con un email inexistente y con uno existente pero contraseña mala. Si la diferencia es apreciable, tienes una fuga por tiempo que arreglar.'
      ],
      vet: [
        'VetCare tiene tres roles de personal: Recepcion agenda y cancela citas, Veterinario registra visitas y recetas, Administrador gestiona usuarios y facturación. Y uno más, Dueno: el cliente, que solo puede ver sus propias mascotas. Escríbelo en docs/seguridad.md antes de escribir código de permisos.',
        'Crea un usuario administrador inicial con una migración de datos o un comando de arranque. Nunca lo dejes con una contraseña por defecto escrita en el repositorio.'
      ],
      edge: [
        'Nunca registres la contraseña en un log, ni siquiera en desarrollo, ni aunque sea dentro del objeto de la petición. Los logs se copian, se mandan por correo y acaban en sitios que no controlas.',
        'Un límite mínimo de longitud importa mucho más que exigir mayúsculas y símbolos. Doce caracteres libres son más seguros y más usables que ocho con reglas raras que la gente sortea con Password1!.',
        'El workFactor de BCrypt se sube con los años conforme el hardware mejora. Guarda el número en configuración y planifica rehashear la contraseña del usuario en su próximo login correcto.'
      ],
      quiz: [
        { q: '¿Por qué no se cifran las contraseñas sino que se hashean?', a: 'Porque el cifrado es reversible: quien consiga la clave recupera todas las contraseñas en claro. Un hash no se puede deshacer, así que para verificar se vuelve a hashear lo que escribe el usuario y se comparan los resultados. Nadie, ni siquiera tú, necesita conocer la contraseña original.' },
        { q: '¿Por qué un hash lento es mejor que uno rápido?', a: 'Porque el atacante que roba la base de datos prueba millones de candidatas por segundo. Si verificar una cuesta 250 milisegundos, probar mil millones de combinaciones pasa a costar años de cómputo. La lentitud, que es irrelevante para un login legítimo, es lo que hace inviable la fuerza bruta.' },
        { q: '¿Qué aporta la sal y por qué debe ser única por usuario?', a: 'Hace que dos usuarios con la misma contraseña tengan hashes distintos, así que un atacante no puede ver cuentas repetidas ni reutilizar el trabajo de romper una para las demás. Además anula las tablas precalculadas, porque habría que generar una por cada sal posible.' },
        { q: '¿Por qué el error de login debe ser idéntico para usuario inexistente y contraseña incorrecta?', a: 'Porque distinguirlos convierte el login en un oráculo que confirma qué emails están registrados, lo que permite construir una lista de cuentas reales para atacar o para phishing. Y por el mismo motivo hay que igualar los tiempos de respuesta: la diferencia de duración filtra la misma información.' }
      ],
      out: 'Registro y login con BCrypt, respuestas indistinguibles y tests de hash en verde.',
      file: 'src/VetCare.Domain/Usuarios/Usuario.cs'
    },
    {
      t: 'JWT: qué es y dónde guardarlo',
      obj: 'Entender qué es un token JWT, qué garantiza y qué no, y tomar una decisión informada sobre dónde almacenarlo en el navegador.',
      why: 'Es la pregunta de seguridad frontend más común y la que más gente responde mal. Saber que un JWT va firmado pero no cifrado, y explicar el compromiso entre localStorage y cookie HttpOnly, te distingue inmediatamente.',
      study: { r: 2, what: 'Lee el cheat sheet de JWT de OWASP. Unos 15 minutos. Busca una cosa: la lista de sitios donde NO guardar el token y el motivo de cada uno.',
        pasos: [
          'Lee "Introduction" y "Token Structure" con su "Example" (~4 min): cabecera, carga y firma.',
          'Lee "Considerations about using JWTs" y "Not using JWTs" (~4 min): cuándo no conviene usarlos.',
          'Lee "Signed JWTs are not confidential" (~2 min): cualquiera puede leer la carga, así que nada sensible dentro.',
          'Lee "JWT revocation" (~3 min): un JWT no se puede anular fácilmente antes de que caduque.',
          'Escribe tu decisión para VetCare: dónde vive el token, cuánto dura y cómo se cierra la sesión.'
        ] },
      ex: {
        title: 'Anatomía del token y la decisión de almacenamiento',
        body: `// UN JWT SON TRES PARTES EN BASE64 SEPARADAS POR PUNTOS
//   eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiI0MiIsInJvbGUiOiJWZXQifQ . 3kFz_x...
//   cabecera              . reclamaciones (payload)             . firma
//
// LA PARTE QUE TODO EL MUNDO CONFUNDE:
//   el payload está CODIFICADO en base64, NO cifrado.
//   Cualquiera puede leerlo con atob() en la consola del navegador.
//   -> NUNCA metas datos sensibles en un JWT.
//   La firma garantiza que nadie lo MODIFICÓ, no que nadie lo LEYÓ.

// EMISIÓN EN ASP.NET CORE
public string Emitir(Usuario u)
{
    var clave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Clave"]!));
    var token = new JwtSecurityToken(
        issuer:   _config["Jwt:Emisor"],
        audience: _config["Jwt:Audiencia"],
        claims: new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, u.Id.ToString()),
            new Claim(ClaimTypes.Role, u.Rol.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        },
        expires: DateTime.UtcNow.AddMinutes(15),     // corto. Muy corto. A propósito.
        signingCredentials: new SigningCredentials(clave, SecurityAlgorithms.HmacSha256));

    return new JwtSecurityTokenHandler().WriteToken(token);
}
// La clave NUNCA va en appsettings.json dentro del repositorio.
// En desarrollo: dotnet user-secrets. En producción: variable de entorno o gestor de secretos.
// Con HmacSha256 debe tener al menos 32 bytes (256 bits): si es más corta, .NET
// lanza un error al firmar. Genera una con: openssl rand -base64 48

// DÓNDE GUARDARLO EN EL NAVEGADOR: no hay opción perfecta, hay un compromiso.
//
// localStorage
//   + simple, sobrevive a recargas, fácil de mandar en la cabecera Authorization
//   - CUALQUIER JavaScript de la página lo puede leer. Un XSS = sesión robada.
//     Y basta con una dependencia de npm comprometida.
//
// Cookie HttpOnly + Secure + SameSite=Strict
//   + el JavaScript NO la puede leer, así que un XSS no roba el token
//   + se manda sola en cada petición
//   - hay que pensar en CSRF (SameSite=Strict lo mitiga casi por completo)
//   - requiere que API y web compartan dominio o configurar CORS con credenciales
//
// RECOMENDACIÓN: cookie HttpOnly. Un XSS sigue siendo grave, pero no se
// lleva la sesión a otro ordenador.

// EN ASP.NET CORE, EMITIR LA COOKIE
Results.Ok(new { usuario = new { u.Id, u.Email, rol = u.Rol.ToString() } });
// y antes:
contexto.Response.Cookies.Append("vetcare_sesion", token, new CookieOptions
{
    HttpOnly = true,                    // JavaScript no la ve
    Secure   = true,                    // solo por HTTPS
    SameSite = SameSiteMode.Strict,     // no se manda desde otros sitios -> anti CSRF
    Expires  = DateTimeOffset.UtcNow.AddMinutes(15),
    Path     = "/",
});

// OJO: JwtBearer busca el token en la cabecera Authorization, NO en cookies.
// Hay que decirle dónde está, al configurarlo en Program.cs:
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Emisor"],
            ValidAudience = builder.Configuration["Jwt:Audiencia"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Clave"]!)),
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 },  // nunca "none"
        };
        o.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                ctx.Token = ctx.Request.Cookies["vetcare_sesion"];   // de la cookie
                return Task.CompletedTask;
            }
        };
    });
// Sin OnMessageReceived, todas las peticiones llegan como anónimas y
// recibirás 401 aunque la cookie esté ahí.

// Y EN EL FRONTEND, nada de guardar tokens:
await fetch('/api/v1/citas', { credentials: 'include' });   // la cookie va sola
// El frontend no conoce el token. No puede filtrarlo. Esa es la idea.`
      },
      steps: [
        'Instala Microsoft.AspNetCore.Authentication.JwtBearer y configura la validación en Program.cs como en el ejemplo: emisor, audiencia, clave, algoritmo y lectura del token desde la cookie (OnMessageReceived). La expiración se valida sola. Añade app.UseAuthentication() y app.UseAuthorization() en el orden de la semana 12.',
        'Guarda la clave de firma con dotnet user-secrets set "Jwt:Clave" y comprueba que appsettings.json no la contiene. Añade una comprobación al arranque que falle si no está configurada.',
        'Cambia el login para que emita la cookie HttpOnly con las tres banderas del ejemplo y devuelva solo los datos públicos del usuario, nunca el token.',
        'Copia un token emitido, pégalo en jwt.io o decodifica el payload con atob en la consola del navegador. Verlo en claro es lo que fija la lección.',
        'Escribe en docs/seguridad.md la decisión de almacenamiento con su alternativa descartada y el motivo, en formato ADR como aprendiste en la semana 15.'
      ],
      vet: [
        'El JWT de VetCare lleva solo el identificador del usuario y su rol. Nada de email, nombre ni datos de la clínica: cualquiera que intercepte el token puede leer el contenido.',
        'Añade a docs/seguridad.md la lista exacta de reclamaciones que incluye tu token y por qué cada una es necesaria.'
      ],
      edge: [
        'Un JWT no se puede revocar por sí mismo: una vez emitido es válido hasta que expira, aunque borres al usuario. Por eso la expiración es corta y mañana añades el refresco.',
        'La clave de firma en el repositorio es una filtración total: cualquiera puede emitir tokens válidos con el rol de administrador. Si alguna vez la subes por error, hay que rotarla, no basta con borrar el commit.',
        'El algoritmo none existe en la especificación de JWT y fue un agujero histórico. Configura siempre explícitamente el algoritmo esperado en la validación y nunca confíes en el que diga la cabecera del token.'
      ],
      quiz: [
        { q: '¿Qué garantiza la firma de un JWT y qué no garantiza?', a: 'Garantiza integridad y autenticidad: que el token lo emitió quien tiene la clave y que nadie ha cambiado su contenido. No garantiza confidencialidad, porque el payload va codificado en base64 y cualquiera puede leerlo decodificándolo, sin necesidad de ninguna clave.' },
        { q: '¿Por qué es peligroso guardar el token en localStorage?', a: 'Porque cualquier JavaScript que se ejecute en la página puede leerlo, incluido el que entre por un XSS o por una dependencia comprometida. Con el token en la mano, el atacante puede usar la sesión desde cualquier otro equipo hasta que expire.' },
        { q: '¿Qué aportan las banderas HttpOnly, Secure y SameSite?', a: 'HttpOnly impide que JavaScript lea la cookie, así que un XSS no puede robar la sesión. Secure impide que viaje por HTTP sin cifrar. SameSite impide que el navegador la envíe en peticiones originadas en otros sitios, que es la base del ataque CSRF.' },
        { q: '¿Por qué la expiración del token es de solo quince minutos?', a: 'Porque un JWT no se puede revocar: sigue siendo válido hasta que caduca aunque borres al usuario o cambies su contraseña. Una ventana corta limita el daño de un token robado, y la comodidad se recupera con un mecanismo de refresco separado.' }
      ],
      out: 'Login que emite cookie HttpOnly firmada, con la clave fuera del repositorio y la decisión documentada.',
      file: 'docs/seguridad.md'
    },
    {
      t: 'Autorización en el backend',
      obj: 'Proteger cada endpoint con el permiso correcto y entender que la autorización por recurso es distinta de la autorización por rol.',
      why: 'El fallo de seguridad más común en APIs reales no es la autenticación sino la autorización: endpoints donde un usuario autenticado puede acceder a datos de otro cambiando un id. Tiene nombre propio, IDOR, y aparece en entrevistas de seguridad.',
      study: { r: 4, what: 'Lee Policy-based authorization y, desde el índice lateral, Resource-based authorization. Unos 18 minutos. Busca una cosa: la diferencia entre un requisito basado en rol y uno basado en recurso.',
        pasos: [
          'Lee "Requirements and policy registration" (~4 min): una política es un conjunto de requisitos con nombre.',
          'Lee "Apply policies to endpoints" (~3 min): RequireAuthorization en Minimal APIs.',
          'Lee "Authorization handlers" y "Use a handler for one requirement" (~5 min).',
          'Desde el índice lateral abre Resource-based authorization (~5 min): cuando la decisión depende del dato, como que un veterinario solo vea sus citas.',
          'Haz una tabla con cada endpoint de VetCare y su regla: público, por rol o por recurso.'
        ] },
      ex: {
        title: 'Tres niveles de autorización',
        body: `// NIVEL 1: autenticado o no
app.MapGet("/citas", ...).RequireAuthorization();
app.MapGet("/health/live", ...).AllowAnonymous();

// NIVEL 2: por rol  -- "quién eres determina qué puedes hacer"
builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("GestionAgenda",  p => p.RequireRole("Recepcion", "Administrador"));
    o.AddPolicy("ActoMedico",     p => p.RequireRole("Veterinario"));
    o.AddPolicy("Facturacion",    p => p.RequireRole("Administrador"));
});

citas.MapPost("/",                       CrearCita).RequireAuthorization("GestionAgenda");
citas.MapPost("/{id:guid}/cancelacion",  Cancelar).RequireAuthorization("GestionAgenda");
visitas.MapPost("/",          Registrar).RequireAuthorization("ActoMedico");
facturas.MapPost("/",         Emitir).RequireAuthorization("Facturacion");

// NIVEL 3: por recurso  -- "¿puedes hacerlo, pero SOBRE ESTE elemento concreto?"
// Este es el que casi nadie implementa y el que causa las filtraciones.
//
// IDOR (Insecure Direct Object Reference):
//   GET /api/v1/mascotas/{id} -> el usuario pone el id de una mascota ajena
//   (lo vio en un enlace, en un log, en una captura) y la ve.
//   Tiene el rol correcto. Está autenticado. Y aun así no debería poder.
//   Que VetCare use UUID lo hace más difícil de adivinar, pero NO lo impide.

// MAL
app.MapGet("/api/v1/mascotas/{id:guid}", async (Guid id, VetCareDbContext db) =>
{
    var m = await db.Mascotas.FindAsync(id);
    return m is null ? Results.NotFound() : Results.Ok(ADto(m));
}).RequireAuthorization();
// Cualquier usuario autenticado ve CUALQUIER mascota. Filtración completa.

// BIEN: el filtro de pertenencia va en la CONSULTA, no en un if posterior
app.MapGet("/api/v1/mascotas/{id:guid}", async (
    Guid id, ClaimsPrincipal quien, VetCareDbContext db, CancellationToken ct) =>
{
    // "sub" del token llega como ClaimTypes.NameIdentifier
    var usuarioId = Guid.Parse(quien.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var esPersonal = quien.IsInRole("Veterinario") || quien.IsInRole("Recepcion")
                  || quien.IsInRole("Administrador");

    var consulta = db.Mascotas.AsNoTracking().Where(m => m.Id == id);

    if (!esPersonal)
        consulta = consulta.Where(m => db.Duenos.Any(           // solo las suyas
            d => d.Id == m.DuenoId && d.UsuarioId == usuarioId));

    var m = await consulta.Select(x => ADto(x)).FirstOrDefaultAsync(ct);

    // 404, no 403: si devuelves 403 estás confirmando que esa mascota existe.
    return m is null ? Results.NotFound() : Results.Ok(m);
}).RequireAuthorization();

// POR QUÉ EN LA CONSULTA Y NO EN UN if DESPUÉS
//   a) es imposible olvidarse de comprobar antes de devolver
//   b) no cargas de la base datos que no puedes mostrar
//   c) funciona igual en listados: la misma cláusula filtra una o mil filas

// REGLA DE ORO
//   Nunca confíes en un identificador que viene del cliente sin comprobar
//   que ese cliente tiene derecho a ese objeto concreto.`
      },
      steps: [
        'Define las tres políticas del ejemplo en Program.cs y aplica RequireAuthorization con la política correcta a cada endpoint de VetCare.',
        'Haz un inventario en docs/seguridad.md: una fila por endpoint con método, ruta, política aplicada y si necesita además comprobación por recurso.',
        'Identifica todos los endpoints que reciben un id del cliente y devuelven datos. Cada uno de ellos es un posible IDOR hasta que demuestres lo contrario.',
        'Implementa el filtro por pertenencia dentro de la consulta en al menos los endpoints de mascota y de historial. Devuelve 404, nunca 403.',
        'Añade a la tabla dueno una columna usuario_id (uuid, puede ser null: no todos los dueños tienen cuenta). Escribe tests de integración de seguridad: un usuario con rol Dueno pide la mascota de otro dueño y debe recibir 404; un rol Recepcion pide registrar una visita y debe recibir 403.'
      ],
      vet: [
        'En VetCare el caso crítico es el historial clínico: un dueño solo puede ver el de sus propias mascotas. Es un dato sensible y el filtro tiene que estar en la consulta de lectura, que en tu arquitectura CQRS se salta el dominio.',
        'Recuerda el aviso de la semana 15: las consultas de lectura que no pasan por el dominio pueden saltarse reglas de visibilidad. Esta es exactamente esa situación, así que esos tests no son opcionales.'
      ],
      edge: [
        'Devolver 403 en lugar de 404 para un recurso ajeno confirma que ese recurso existe, lo que permite enumerar identificadores válidos. Para un recurso que no te pertenece, lo correcto es que simplemente no exista.',
        'Comprobar permisos con un if después de cargar el objeto funciona hasta que alguien añade un camino nuevo y olvida el if. Ponerlo en la consulta hace que la protección viaje con el acceso a datos.',
        'Los roles en el token se quedan congelados hasta que expira. Si degradas a un usuario de administrador a recepción, seguirá siendo administrador durante quince minutos: es el precio de los tokens sin estado.'
      ],
      quiz: [
        { q: '¿Qué es un IDOR y por qué es tan común?', a: 'Es cuando un usuario autenticado accede a datos de otro simplemente cambiando un identificador en la URL. Es común porque el endpoint pasa la comprobación de autenticación y de rol, que es lo que la gente prueba, y nadie verifica además que ese objeto concreto le pertenezca al que lo pide.' },
        { q: '¿Por qué el filtro de pertenencia debe ir en la consulta y no en un if posterior?', a: 'Porque así la protección es inseparable del acceso a datos: no se puede olvidar en un camino nuevo, no cargas de la base información que no vas a poder mostrar, y la misma cláusula sirve igual para un elemento que para un listado completo.' },
        { q: '¿Por qué devolver 404 y no 403 cuando el recurso es de otro usuario?', a: 'Porque un 403 confirma que ese recurso existe y permite enumerar identificadores válidos probando números. Desde el punto de vista de quien no tiene derecho a verlo, ese objeto no debería distinguirse de uno inexistente.' },
        { q: '¿Qué diferencia hay entre autorización por rol y por recurso?', a: 'La de rol responde a qué tipo de acciones puede hacer alguien, como registrar una visita si es veterinario. La de recurso responde a sobre qué elementos concretos puede hacerlas, como ver solo las mascotas de las que es dueño. Hacen falta las dos: la primera sin la segunda deja la puerta abierta a los IDOR.' }
      ],
      out: 'Todos los endpoints con política aplicada, filtros por pertenencia en la consulta y tests de seguridad en verde.',
      file: 'docs/seguridad.md'
    },
    {
      t: 'Sesión en el frontend',
      obj: 'Representar al usuario autenticado en React, proteger rutas y manejar con elegancia el momento en que la sesión caduca.',
      why: 'Es la parte que decide si la aplicación es usable: una sesión que caduca y te echa a la pantalla de login perdiendo lo que escribías es una de las experiencias más frustrantes que existen.',
      study: { r: 5, what: 'Lee la página completa. Unos 15 minutos. Busca una cosa: cuándo usar contexto y por qué no debe sustituir a pasar props.',
        pasos: [
          'Lee el problema del principio (~3 min): pasar props por muchos niveles.',
          'Sigue los tres pasos (~6 min): crear el contexto, usarlo con useContext y proveerlo.',
          'Lee la parte de antes de usar contexto (~3 min): las alternativas, como pasar props o usar children.',
          'Lee los casos de uso del contexto (~2 min): tema, usuario actual, enrutado.',
          'Escribe qué datos de sesión irán en el contexto de VetCare y cuáles seguirán pasando por props.'
        ] },
      ex: {
        title: 'Contexto de sesión y rutas protegidas',
        body: `// src/auth/SesionContexto.tsx
interface UsuarioSesion {
  id: string;
  email: string;
  rol: 'Recepcion' | 'Veterinario' | 'Administrador' | 'Dueno';
}

const SesionCtx = createContext<{
  usuario: UsuarioSesion | null;
  cargando: boolean;
} | null>(null);

export function ProveedorSesion({ children }: { children: React.ReactNode }) {
  // El token está en una cookie HttpOnly: el frontend NO lo ve.
  // Para saber quién eres, se lo preguntas al servidor.
  const { data: usuario = null, isPending: cargando } = useQuery({
    queryKey: ['sesion'],
    queryFn: async (): Promise<UsuarioSesion | null> => {
      const r = await fetch('/api/auth/yo', { credentials: 'include' });
      if (r.status === 401) return null;          // no autenticado, no es un error
      if (!r.ok) throw new Error('Error al comprobar la sesión');
      return r.json();
    },
    staleTime: 5 * 60_000,
    retry: false,                                  // un 401 no se reintenta
  });

  return <SesionCtx.Provider value={{ usuario, cargando }}>{children}</SesionCtx.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionCtx);
  if (!ctx) throw new Error('useSesion debe usarse dentro de ProveedorSesion');
  return ctx;
}

// RUTA PROTEGIDA
export function RutaProtegida({ roles }: { roles?: UsuarioSesion['rol'][] }) {
  const { usuario, cargando } = useSesion();
  const ubicacion = useLocation();

  if (cargando) return <PantallaCargando />;        // sin esto parpadea al login

  if (!usuario) {
    // guarda a donde iba para volver después de entrar
    return <Navigate to="/login" state={{ destino: ubicacion.pathname }} replace />;
  }

  if (roles && !roles.includes(usuario.rol)) return <SinPermiso />;

  return <Outlet />;
}

// En las rutas:
{
  element: <RutaProtegida />,
  children: [
    { path: 'agenda', element: <Agenda /> },
    {
      element: <RutaProtegida roles={['Administrador']} />,
      children: [{ path: 'usuarios', element: <GestionUsuarios /> }],
    },
  ],
}

// SESIÓN CADUCADA: un 401 puede llegar en cualquier momento
export async function peticion(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, credentials: 'include' });

  if (r.status === 401) {
    // no recargues la página: eso borra lo que el usuario estaba escribiendo
    window.dispatchEvent(new CustomEvent('sesion-caducada'));
    throw new ErrorSesionCaducada();
  }
  return r;
}

// Un componente escucha y muestra un diálogo encima, sin destruir la pantalla:
useEffect(() => {
  const al401 = () => setMostrarDialogoLogin(true);
  window.addEventListener('sesion-caducada', al401);
  return () => window.removeEventListener('sesion-caducada', al401);
}, []);
// El usuario vuelve a entrar en el diálogo y sigue justo donde estaba.

// LA ADVERTENCIA MÁS IMPORTANTE
// Esconder un botón según el rol es ERGONOMÍA, no seguridad.
// Quien abre las devtools lo ve igual, y puede llamar a la API con curl.
// La única autorización real es la del backend de ayer.`
      },
      steps: [
        'Crea el endpoint GET /api/auth/yo en el backend: devuelve id, email y rol del usuario autenticado, o 401 si no lo está.',
        'Implementa el ProveedorSesion con useQuery y móntalo por encima del router. El estado cargando es imprescindible para que no parpadee hacia el login al recargar.',
        'Implementa RutaProtegida con soporte de roles y protege las rutas de VetCare según la tabla de permisos que escribiste ayer.',
        'Implementa el flujo de sesión caducada con el evento personalizado y un diálogo de reentrada. Prueba que al volver a entrar sigues en la misma pantalla con lo que tenías escrito.',
        'Oculta en la interfaz las acciones que el rol no puede hacer, y después demuéstrate a ti mismo que no es seguridad: llama al endpoint protegido con curl sin la cookie y comprueba que el backend lo rechaza.'
      ],
      vet: [
        'En VetCare, Recepcion no debe ver el botón de registrar visita y Veterinario no debe ver el de emitir factura. Pero los dos endpoints tienen que rechazar igualmente la llamada directa.',
        'Añade al final de docs/seguridad.md la frase que resume la lección: la interfaz oculta opciones por comodidad, el backend las impide por seguridad.'
      ],
      edge: [
        'Si RutaProtegida no espera al estado cargando, al recargar la página el usuario ve un parpadeo hacia el login antes de que llegue la respuesta de sesión, aunque esté perfectamente autenticado.',
        'Recargar la página entera al recibir un 401 destruye el formulario que el usuario estaba rellenando. Un diálogo superpuesto conserva el trabajo y es la diferencia entre una app tolerable y una irritante.',
        'No guardes el rol en localStorage para evitar la petición de sesión. Cualquiera lo edita desde la consola y se autoconcede el rol de administrador en la interfaz; no gana acceso real, pero ves hasta qué punto no es una fuente de verdad.'
      ],
      quiz: [
        { q: '¿Por qué el frontend pregunta al servidor quién es el usuario en lugar de leer el token?', a: 'Porque con una cookie HttpOnly el JavaScript no puede leer el token, que es justamente lo que lo protege de un XSS. La forma de conocer la sesión es un endpoint que devuelve los datos públicos del usuario autenticado, y esa respuesta se cachea como cualquier otra consulta.' },
        { q: '¿Por qué RutaProtegida debe esperar al estado de carga?', a: 'Porque mientras la petición de sesión está en vuelo el usuario todavía es null, y redirigir en ese momento manda al login a alguien que sí está autenticado. El resultado es un parpadeo molesto en cada recarga y, si la redirección es agresiva, una expulsión injustificada.' },
        { q: '¿Por qué ocultar botones según el rol no es seguridad?', a: 'Porque el código del frontend se ejecuta en una máquina que el usuario controla: puede ver el botón oculto en las herramientas de desarrollo o llamar directamente a la API con curl. Es una ayuda para no mostrar opciones inútiles, pero quien impide la acción es el backend.' },
        { q: '¿Qué gana el usuario con un diálogo de reentrada en lugar de una redirección al login?', a: 'Conserva el contexto y el trabajo en curso. Una redirección destruye el formulario que estaba rellenando y le obliga a volver a navegar hasta donde estaba, mientras que el diálogo le deja continuar exactamente donde lo dejó tras volver a autenticarse.' }
      ],
      out: 'Sesión en React con rutas protegidas por rol y caducidad manejada sin perder el trabajo del usuario.',
      file: 'web/src/auth/SesionContexto.tsx'
    },
    {
      t: 'Refresco, cierre de sesión y defensas',
      obj: 'Completar el ciclo de vida de la sesión y añadir las defensas mínimas que toda aplicación expuesta necesita.',
      why: 'Aquí se cierran los cabos sueltos que distinguen un prototipo de algo desplegable: revocación real, limitación de intentos y cabeceras de seguridad. Son cosas que un revisor busca inmediatamente.',
      study: { r: 6, what: 'Lee las secciones Session Expiration y Manual Session Expiration del cheat sheet. Unos 15 minutos. Busca una cosa: por qué el cierre de sesión tiene que invalidar algo en el servidor y no solo borrar la cookie.',
        pasos: [
          'Lee "Cookies" con "Secure Attribute", "HttpOnly Attribute" y "SameSite Attribute" (~5 min).',
          'Lee "HTML5 Web Storage API" y "The localStorage API" (~3 min): por qué no es buen sitio para un token de sesión.',
          'Busca en la página la sección de caducidad de sesión y la de cierre manual (~5 min).',
          'Escribe el ciclo de vida de una sesión de VetCare: duración, renovación y qué se invalida en el servidor al cerrar.'
        ] },
      ex: {
        title: 'Token de refresco, cierre real y defensas',
        body: `// EL PROBLEMA: token de acceso de 15 minutos = el usuario reentra cada 15 minutos.
// LA SOLUCIÓN: dos tokens con responsabilidades distintas.
//
//   Token de acceso   15 min   sin estado, firmado, va en cada petición
//   Token de refresco  7 días  GUARDADO EN BASE DE DATOS, por tanto REVOCABLE
//
// La clave es que el de refresco tiene estado: existe una fila que puedes borrar.

// tabla token_refresco
//   id uuid pk, usuario_id uuid fk, hash_token text not null,
//   expira_en timestamptz not null, revocado_en timestamptz null,
//   reemplazado_por uuid null, creado_desde_ip inet null
// Se guarda el HASH del token, no el token. Si filtran la tabla, no sirven de nada.

app.MapPost("/api/auth/refrescar", async (HttpContext ctx, VetCareDbContext db,
        IEmisorTokens emisor, ILogger<Program> log, CancellationToken ct) =>
{
    var crudo = ctx.Request.Cookies["vetcare_refresco"];
    if (crudo is null) return Results.Unauthorized();

    var hash = Hashear(crudo);
    var fila = await db.TokensRefresco.Include(t => t.Usuario)
                       .FirstOrDefaultAsync(t => t.HashToken == hash, ct);

    if (fila is null || fila.ExpiraEn < DateTime.UtcNow)
        return Results.Unauthorized();

    // DETECCIÓN DE ROBO: si usan un token ya revocado, alguien lo copió.
    if (fila.RevocadoEn is not null)
    {
        await RevocarTodaLaCadenaAsync(db, fila.UsuarioId, ct);   // cierra TODO
        log.LogWarning("Reutilización de token de refresco del usuario {Id}", fila.UsuarioId);
        return Results.Unauthorized();
    }

    // ROTACIÓN: cada refresco invalida el anterior y emite uno nuevo
    var nuevo = GenerarTokenRefresco();
    fila.RevocadoEn = DateTime.UtcNow;
    fila.ReemplazadoPor = nuevo.Id;
    db.TokensRefresco.Add(nuevo);
    await db.SaveChangesAsync(ct);

    EmitirCookies(ctx, emisor.Emitir(fila.Usuario), nuevo.Crudo);
    return Results.NoContent();
});

// CIERRE DE SESIÓN REAL
app.MapPost("/api/auth/salir", async (HttpContext ctx, VetCareDbContext db, CancellationToken ct) =>
{
    var crudo = ctx.Request.Cookies["vetcare_refresco"];
    if (crudo is not null)
    {
        // borrar la cookie NO basta: el token seguiría siendo válido
        // para quien tuviera una copia. Hay que revocarlo en la base.
        var hash = Hashear(crudo);
        await db.TokensRefresco
            .Where(t => t.HashToken == hash && t.RevocadoEn == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevocadoEn, DateTime.UtcNow), ct);
    }
    ctx.Response.Cookies.Delete("vetcare_sesion");
    ctx.Response.Cookies.Delete("vetcare_refresco");
    return Results.NoContent();
});

// LIMITAR INTENTOS DE LOGIN  (.NET 7+, sin librerías)
// Un contador POR IP. (AddFixedWindowLimiter a secas crea UN solo contador
// para toda la app: 5 logins por minuto entre TODOS los usuarios.)
builder.Services.AddRateLimiter(o =>
{
    o.AddPolicy("login", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "desconocida",
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

// CABECERAS DE SEGURIDAD (middleware propio, tres minutos de trabajo)
app.Use(async (ctx, siguiente) =>
{
    var h = ctx.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";
    h["X-Frame-Options"] = "DENY";                       // anti clickjacking
    h["Referrer-Policy"] = "strict-origin-when-cross-origin";
    h["Content-Security-Policy"] = "default-src 'self'"; // la mejor defensa anti XSS
    await siguiente();
});
if (!app.Environment.IsDevelopment())
    app.UseHsts();   // fuerza HTTPS en los navegadores
// (HSTS no se envía a localhost: en local es normal no ver esa cabecera)`
      },
      steps: [
        'Crea la tabla token_refresco con su migración y guarda siempre el hash del token, nunca el valor en claro.',
        'Implementa los endpoints de refresco y de salida con rotación, detección de reutilización y revocación real en base de datos.',
        'En el frontend, intercepta el 401 e intenta un refresco silencioso antes de mostrar el diálogo de reentrada. Solo si el refresco también falla pides credenciales.',
        'Añade el limitador de peticiones al endpoint de login y compruébalo lanzando seis intentos seguidos con curl: el sexto debe responder 429.',
        'Añade el middleware de cabeceras y verifica el resultado en la pestaña Network del navegador, comprobando que las cuatro cabeceras del middleware aparecen en cada respuesta (la quinta, HSTS, solo aparece fuera de localhost).'
      ],
      vet: [
        'Prueba la detección de robo de VetCare: guarda un token de refresco, úsalo para refrescar, y después intenta usar el antiguo. Toda la cadena de ese usuario debe quedar revocada.',
        'Completa docs/seguridad.md con el diagrama del ciclo de vida de la sesión: login, uso, refresco con rotación, caducidad y salida.'
      ],
      edge: [
        'Borrar la cookie en el cliente no cierra la sesión: quien tenga una copia del token sigue entrando. El cierre de sesión solo es real si invalida algo en el servidor.',
        'Sin rotación, un token de refresco robado funciona durante los siete días completos sin que puedas detectarlo. Con rotación, el primer uso del atacante o del usuario legítimo delata la duplicación.',
        'Un limitador solo por dirección IP castiga a oficinas enteras que salen por la misma IP y no detiene a un atacante distribuido. Combínalo con un límite por cuenta y con retardos crecientes.'
      ],
      quiz: [
        { q: '¿Por qué el token de refresco se guarda en base de datos y el de acceso no?', a: 'Porque el de acceso es sin estado y su seguridad viene de durar muy poco, mientras que el de refresco dura días y necesita poder revocarse. Tener una fila en la base es justamente lo que permite invalidarlo al cerrar sesión o al detectar un robo.' },
        { q: '¿Qué es la rotación de tokens de refresco y qué permite detectar?', a: 'Es emitir un token nuevo y revocar el usado en cada refresco, de modo que cada token solo sirve una vez. Permite detectar un robo: si alguien intenta usar un token ya revocado, significa que existen dos copias, y la respuesta correcta es revocar toda la cadena de ese usuario.' },
        { q: '¿Por qué borrar la cookie no equivale a cerrar sesión?', a: 'Porque la cookie es solo una copia del token en ese navegador. Si alguien capturó el valor, lo sigue teniendo y la API lo sigue aceptando hasta que caduque. El cierre de sesión solo es efectivo si invalida el token en el servidor.' },
        { q: '¿Qué protege la cabecera Content-Security-Policy y por qué importa tanto aquí?', a: 'Restringe de qué orígenes puede cargarse y ejecutarse código en la página, lo que corta la vía principal de un XSS. Importa especialmente porque un XSS es el ataque que podría actuar en nombre del usuario aunque la cookie sea HttpOnly, así que es la defensa que complementa al almacenamiento seguro del token.' }
      ],
      out: 'Ciclo de sesión completo con rotación, detección de robo, limitación de intentos y cabeceras de seguridad.',
      file: 'src/VetCare.Api/Auth/'
    },
    {
      t: 'Auditoría de seguridad de VetCare (examen de la semana)',
      obj: 'Revisar la aplicación entera buscando activamente los fallos que tú mismo podrías haber dejado, y dejar constancia escrita.',
      why: 'Auditar tu propio trabajo con una lista objetiva es una habilidad que se puede demostrar. Poder decir que intentaste explotar tu aplicación y que encontraste y arreglaste dos cosas vale mucho más que afirmar que es segura.',
      study: { r: 7, what: 'Recorre el índice del OWASP Cheat Sheet Series y abre los dos o tres que apliquen a VetCare y todavía no hayas leído. Unos 15 minutos. Busca una cosa: un riesgo concreto que no hayas considerado esta semana.',
        pasos: [
          'Recorre el índice del Cheat Sheet Series (~3 min) y elige dos o tres que apliquen a VetCare y no hayas leído.',
          'Buenos candidatos: Authorization, REST Security, Logging, Cross-Site Request Forgery Prevention.',
          'En cada uno lee solo la introducción y la lista principal de recomendaciones (~4 min por cheat sheet).',
          'Convierte cada recomendación que no cumplas en una línea del guion de auditoría de hoy.'
        ] },
      ex: {
        title: 'Guion de auditoría: intenta romper tu propia aplicación',
        body: `ATAQUE 1 — IDOR en cada endpoint con identificador
  Como:   autentícate como dueño A y pide /api/v1/mascotas/{id} de una mascota
          del dueño B (copia su id de la base). Repítelo con historial,
          facturas y citas.
  Esperado: 404 en todos los que no te pertenecen.
  Resultado: ______________________

ATAQUE 2 — Saltarse la interfaz
  Como:   autentícate como Recepcion, que no ve el botón de registrar visita.
          curl -X POST /api/v1/mascotas/{id}/visitas --cookie "vetcare_sesion=..." -d '{...}'
  Esperado: 403.
  Resultado: ______________________

ATAQUE 3 — Manipular el token
  Como:   copia tu cookie, decodifica el payload, cambia el rol a Administrador,
          vuelve a codificar en base64 y úsala.
  Esperado: 401. La firma no cuadra y la validación lo rechaza.
  Resultado: ______________________

ATAQUE 4 — Fuerza bruta
  Como:   20 intentos de login con contraseña incorrecta contra la misma cuenta.
  Esperado: 429 a partir del sexto. El mensaje sigue siendo idéntico al de
            usuario inexistente.
  Resultado: ______________________

ATAQUE 5 — Enumeración de usuarios
  Como:   login con email inexistente y con email real y contraseña mala.
          Compara el cuerpo, el código de estado Y el tiempo de respuesta.
  Esperado: indistinguibles en los tres aspectos.
  Resultado: ______________________

ATAQUE 6 — Sesión que no muere
  Como:   copia la cookie vetcare_refresco, cierra sesión y después llama a
          POST /api/auth/refrescar con esa cookie vieja.
  Esperado: 401. (Ojo: con la cookie de ACCESO vieja, la API seguirá
            respondiendo hasta 15 minutos: un JWT no se puede revocar.
            Anótalo como riesgo aceptado, no como fallo.)
  Resultado: ______________________

ATAQUE 7 — Inyección SQL
  Como:   en el buscador escribe: ' OR 1=1 --
          Y en cualquier campo que acabe en una consulta.
  Esperado: nada. EF Core parametriza. Revisa a mano tus SqlQueryRaw de la
            semana 15: ahí es donde podrías haber concatenado.
  Resultado: ______________________

ATAQUE 8 — Secretos en el repositorio
  Como:   grep -rniE "(password|secret|apikey|connectionstring)" --include=*.json .
          Y revisa el historial de git, no solo los archivos actuales.
  Esperado: nada real. Solo marcadores de posición.
  Resultado: ______________________

CHECKLIST FINAL
  [ ] Contraseñas con BCrypt workFactor >= 12, nunca en logs
  [ ] Login y registro no revelan qué emails existen, ni por tiempo
  [ ] Token en cookie HttpOnly + Secure + SameSite, expiración corta
  [ ] Clave de firma fuera del repositorio
  [ ] Toda ruta no pública con RequireAuthorization
  [ ] Todo endpoint con id del cliente filtra por pertenencia EN LA CONSULTA
  [ ] Recurso ajeno devuelve 404, no 403
  [ ] Refresco con rotación y detección de reutilización
  [ ] Cierre de sesión revoca en servidor
  [ ] Rate limiting en login
  [ ] Las cinco cabeceras de seguridad presentes
  [ ] HTTPS obligatorio con HSTS
  [ ] Ningún secreto en el repositorio ni en su historial`
      },
      steps: [
        'Ejecuta los ocho ataques de verdad contra tu aplicación en local. Escribe el resultado real de cada uno en docs/seguridad.md.',
        'Por cada ataque que tenga éxito, arregla el código y vuelve a ejecutarlo hasta que falle. Documenta qué estaba mal: ese es el aprendizaje más valioso de la semana.',
        'Convierte en tests de integración automatizados al menos los ataques 1, 2, 3 y 6. Son regresiones que pueden volver con cualquier refactor.',
        'Recorre el checklist final señalando en el código dónde está cada punto. Lo que no puedas señalar, no está hecho.',
        'Explica en voz alta durante tres minutos cómo protegiste VetCare, en este orden: qué guardas y cómo, cómo sabes quién es el usuario, cómo decides qué puede hacer y qué encontraste al intentar romperlo.'
      ],
      vet: [
        'Tu docs/seguridad.md debe quedar completo: roles y permisos, inventario de endpoints, decisión de almacenamiento del token, ciclo de vida de la sesión y los ocho resultados de auditoría.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/seguridad.md dentro de una semana.'
      ],
      edge: [
        'No ejecutes estos ataques contra sistemas que no sean tuyos. Lo que en tu entorno local es aprendizaje, contra un servidor ajeno y sin autorización escrita es un delito.',
        'Un checklist marcado sin comprobar es peor que no tenerlo, porque genera una confianza falsa que impide que alguien lo revise de verdad más adelante.',
        'La seguridad no se termina: lo que hoy está bien puede romperse con una dependencia nueva o un endpoint añadido con prisa. Repite esta auditoría cada vez que añadas superficie expuesta.'
      ],
      quiz: [
        { q: '¿Por qué la auditoría incluye intentar saltarse la interfaz con curl?', a: 'Porque es exactamente lo que haría un atacante y porque comprueba la única protección que cuenta, la del servidor. Si el endpoint responde correctamente a una llamada directa sin pasar por la interfaz, has verificado que ocultar el botón era solo comodidad y no tu defensa.' },
        { q: '¿Qué te dice el ataque 3 sobre la firma del token?', a: 'Que la firma hace el payload inmutable en la práctica: puedes leerlo y modificarlo, pero no puedes recalcular una firma válida sin la clave del servidor. Por eso el intento de ascenderte a administrador se rechaza con 401 en lugar de concederte el rol.' },
        { q: '¿Por qué el ataque 8 revisa también el historial de git?', a: 'Porque borrar un secreto del archivo no lo borra del historial: cualquiera que clone el repositorio puede recuperarlo de un commit antiguo. Un secreto que estuvo publicado hay que considerarlo comprometido y rotarlo, no solo eliminarlo del estado actual.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que la seguridad no es una funcionalidad que se añade sino un conjunto de decisiones verificables en cada capa: cómo guardas lo que nunca debes poder leer, dónde pones el token para que un XSS no se lo lleve, y sobre todo que la autorización real vive en la consulta del servidor y no en los botones que decides mostrar.' }
      ],
      out: 'Ocho ataques ejecutados y documentados, con los fallos encontrados arreglados y cubiertos por tests.',
      file: 'docs/seguridad.md'
    }
  ]
}
]);
