/* Una pista por cada paso de «Hazlo tú»: cómo empezar, un ejemplo y cómo saber que está bien.
   Clave: w<semana>d<día>; el orden coincide con days[].steps. */
window.PISTAS = Object.assign(window.PISTAS || {}, {

/* ---------- Semana 17 ---------- */

'w17d1': [
  '«npm install @tanstack/react-query». En main.tsx: «const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true } } });» y envuelve: «<QueryClientProvider client={queryClient}><App /></QueryClientProvider>». Crea el cliente fuera del componente, no dentro.',
  '«export async function obtenerCitas(dia: string, signal?: AbortSignal): Promise<Cita[]> { const r = await fetch(`/api/v1/agenda?dia=${dia}`, { signal }); if (!r.ok) throw new Error(`HTTP ${r.status}`); return (await r.json()).datos; }». Sin hooks, sin useState: solo fetch y tipos. Así se pueden reutilizar y probar sin React.',
  '«export function useCitas(dia: string) { return useQuery({ queryKey: ["citas", dia], queryFn: ({ signal }) => obtenerCitas(dia, signal) }); }». En el componente: «const { data = [], isPending, error } = useCitas(dia);». La cancelación ya la gestiona React Query con ese signal.',
  '«npm install @tanstack/react-query-devtools» y dentro del Provider: «<ReactQueryDevtools initialIsOpen={false} />». Aparece un botón flotante: ábrelo, cambia de día 3 o 4 veces y verás una entrada por cada ["citas", dia], con su estado (fresh, stale, inactive).',
  'Monta temporalmente «<ContadorCitas dia={dia} />» además de la tabla, y que los dos llamen a useCitas(dia). En Network, filtra por «agenda»: aunque haya dos componentes pidiendo lo mismo, debe salir una sola petición. Las dos llamadas comparten la entrada de caché ["citas", dia].'
],

'w17d2': [
  '«const crear = useMutation({ mutationFn: crearCita });» y en el submit: «crear.mutate(form)». Usa «crear.isPending» para deshabilitar el botón y «crear.error» para el mensaje. Borra los useState de enviando y error: la mutación ya los gestiona.',
  '«const qc = useQueryClient(); useMutation({ mutationFn: crearCita, onSuccess: () => qc.invalidateQueries({ queryKey: ["citas"] }) });». La clave ["citas"] invalida todas las que empiezan así (todos los días). Crea una cita y mira cómo aparece en la tabla sin que hayas tocado ningún estado.',
  '«export function useCancelarCita() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => cancelarCita(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["citas"] }) }); }». En FilaCita: «const cancelar = useCancelarCita();» y «onClick={() => cancelar.mutate(cita.id)}».',
  'Tabla: | Mutación | Claves a invalidar | Motivo |. Ejemplo: «Crear cita | ["citas"], ["mascota", id, "historial"] | aparece en la agenda y en el historial». «Editar dueño | ["dueno", id], ["citas"] | la agenda muestra el nombre del dueño». Piensa en cada pantalla que muestre ese dato.',
  'Abre las devtools de React Query y cancela una cita: la entrada ["citas", dia] cambia a stale (amarillo) y enseguida a fetching (azul) y fresh (verde). En Network aparece la petición de recarga justo después del POST o PATCH.'
],

'w17d3': [
  'onMutate: «await qc.cancelQueries({ queryKey: ["citas", dia] }); const previo = qc.getQueryData<Cita[]>(["citas", dia]); qc.setQueryData<Cita[]>(["citas", dia], v => v?.map(c => c.id === id ? { ...c, estado: "cancelada" } : c)); return { previo };». onError: «qc.setQueryData(["citas", dia], ctx?.previo); avisar("No se pudo cancelar");». onSettled: «qc.invalidateQueries({ queryKey: ["citas"] })».',
  'En Network, pon el throttling en «Slow 3G» para que se note: la fila cambia al instante y la petición sigue en curso. Con la versión anterior, el cambio esperaba a la respuesta. Escribe en una línea la diferencia de sensación.',
  'Con la página cargada, para el backend (Ctrl+C) y cancela una cita. Verás: cambia a cancelada → la petición falla → vuelve a su estado anterior → aparece el aviso. Si se queda cancelada, revisa que onError restaure ctx.previo y que onMutate devuelva { previo }.',
  'Comenta el cancelQueries, añade «await Task.Delay(2000)» en el GET de la agenda, refresca la página y cancela inmediatamente. El GET que ya estaba en curso termina después y pisa tu cambio con el estado viejo. Vuelve a poner cancelQueries y repite: ya no pasa. Quita el retardo al terminar.',
  'Criterio: optimista si casi nunca falla y es fácil deshacer (cancelar cita, marcar como leído). Con spinner si falla a menudo, tiene consecuencias (cobros, datos médicos) o el servidor calcula algo que necesitas (el id o el precio de una cita nueva). Tabla: | Mutación | Optimista o spinner | Motivo |.'
],

'w17d4': [
  '«npm install react-router». «const router = createBrowserRouter([{ path: "/", element: <Layout />, errorElement: <PaginaError />, children: [{ index: true, element: <Agenda /> }, { path: "mascotas/:id", element: <DetalleMascota /> }, { path: "*", element: <NoEncontrada /> }] }]);». En Layout: la barra de navegación y «<Outlet />».',
  '«const [params, setParams] = useSearchParams(); const dia = params.get("dia") ?? hoyISO(); const filtro = params.get("estado") ?? "todas";». Para cambiar: «setParams(p => { p.set("dia", nuevo); return p; });». Prueba: elige un día y un filtro, copia la URL, recarga: debe verse exactamente lo mismo.',
  '«setParams(p => { p.set("q", texto); return p; }, { replace: true });» solo en la búsqueda. Antes: escribe «firulais» y pulsa atrás → vas quitando letra a letra. Después: atrás te lleva a la pantalla anterior. El día y el filtro sí deben crear entrada de historial (sin replace).',
  '«const { id } = useParams(); const mascota = useMascota(id!);» con «queryKey: ["mascota", id]». Navega entre dos mascotas: deben cargarse datos distintos, y al volver a la primera, salir al instante desde la caché. Si se ve la misma mascota en ambas, el id no está en la queryKey.',
  'NoEncontrada: «Esta página no existe» y un enlace a la agenda. PaginaError usa «useRouteError()» y muestra un mensaje amable con un botón para volver. Prueba /inventado y también lanza un error a propósito dentro de un componente para ver el errorElement.'
],

'w17d5': [
  'Esqueleto de tabla: «Array.from({ length: 5 }).map((_, i) => <tr key={i}><td><div className="esqueleto" style={{ width: 60 }} /></td>…</tr>)» con CSS «.esqueleto { height: 14px; border-radius: 4px; background: #e5e5e5; animation: pulso 1.2s infinite; }». Mismo número de columnas y altura de fila que la tabla real, para que nada salte al cargar.',
  '«function useRetrasado(activo: boolean, ms = 300) { const [mostrar, setMostrar] = useState(false); useEffect(() => { if (!activo) { setMostrar(false); return; } const t = setTimeout(() => setMostrar(true), ms); return () => clearTimeout(t); }, [activo, ms]); return mostrar; }». Uso: «const verEsqueleto = useRetrasado(isPending);».',
  '«useQuery({ …, placeholderData: keepPreviousData })» y en la tabla: «style={{ opacity: isPlaceholderData ? 0.5 : 1 }}». Al cambiar de día, se ven los datos del día anterior atenuados hasta que llegan los nuevos, en lugar de una tabla vacía que parpadea.',
  '«const qc = useQueryClient(); <Link to={`/mascotas/${id}`} onMouseEnter={() => qc.prefetchQuery({ queryKey: ["mascota", id], queryFn: () => obtenerMascota(id) })}>». En Network, pasa el ratón sin hacer clic: la petición debe salir. Al hacer clic, la ficha aparece al instante.',
  'En Network, cambia «No throttling» por «Slow 3G» (o «3G»). Recorre: cargar la agenda, cambiar de día, abrir una ficha, crear una cita, cancelar. Anota: «crear cita: 4 s sin ninguna señal de que algo pasa → añadir texto Guardando… en el botón». Prioriza lo que más molesta.'
],

'w17d6': [
  'Ve lista por lista con el código abierto al lado. Para cada punto, señala el archivo que lo cumple o arréglalo en el momento. Ejemplo: «los datos del servidor no están en useState → buscar useState con datos de la API: 0 resultados ✓».',
  'Hazlas de verdad, con DevTools abiertas: red lenta, backend caído, recargar en mitad de la página, URL compartida en otra pestaña, doble clic… Para cada una anota qué esperabas y qué pasó. Las que fallen, arréglalas y repítelas.',
  'Escríbelo para alguien que no ha visto el proyecto: qué hace cada pantalla, cómo se gestionan los datos del servidor (React Query, claves, invalidaciones), qué va en la URL, qué es optimista y qué no, y los estados de carga. Pídele a alguien que lo lea y te diga qué no entendió.',
  '«npx tsc -b» sin salida. Para cada any que no puedas tipar: «const datos: unknown = await r.json(); if (!esCita(datos)) throw new Error("Respuesta inesperada");» con una función de comprobación «function esCita(x: unknown): x is Cita { … }». Así validas lo que llega de fuera en lugar de confiar a ciegas.',
  'Estructura con ejemplos de tu app: 1) los datos del servidor tienen dueño fuera (la base de datos) y pueden cambiar sin que tú lo sepas, 2) por eso necesitan caché, recarga e invalidación (las claves ["citas", dia]), 3) el estado del cliente (filtro abierto, texto escrito) es solo tuyo. Grábate.'
],

/* ---------- Semana 18 ---------- */

'w18d1': [
  '«dotnet add src/VetCare.Domain package BCrypt.Net-Next» (no conoce EF, así que no rompe la arquitectura). «public static Usuario Crear(string email, string contrasena, Rol rol) { /* valida longitud mínima */ return new Usuario(Guid.NewGuid(), email.ToLowerInvariant(), BCrypt.Net.BCrypt.HashPassword(contrasena, workFactor: 12), rol); }» y «public bool VerificarContrasena(string c) => BCrypt.Net.BCrypt.Verify(c, HashContrasena);».',
  '«CREATE TABLE usuario ( id uuid PRIMARY KEY, email text NOT NULL, hash_contrasena text NOT NULL, rol text NOT NULL CHECK (rol IN (\'admin\',\'veterinario\',\'recepcion\',\'dueno\')), creado_en timestamptz NOT NULL DEFAULT now() ); CREATE UNIQUE INDEX uq_usuario_email ON usuario (lower(email));». La columna se llama hash, no contraseña: nunca guardas la contraseña.',
  '«var a = Usuario.Crear("a@x.com", "Clave-Segura-1", Rol.Dueno); var b = Usuario.Crear("b@x.com", "Clave-Segura-1", Rol.Dueno); a.HashContrasena.Should().NotBe(b.HashContrasena); a.VerificarContrasena("Clave-Segura-1").Should().BeTrue(); a.VerificarContrasena("otra").Should().BeFalse();». Los hashes difieren por la sal aleatoria.',
  'Los dos fallos (email no existe y contraseña incorrecta) devuelven exactamente lo mismo: «return Results.Problem(title: "Credenciales incorrectas", statusCode: 401);». Si dijeras «el usuario no existe», un atacante podría averiguar qué emails están registrados.',
  '«time curl -s -X POST …/login -d \'{"email":"noexiste@x.com","contrasena":"x"}\'» frente a un email real con contraseña mala. Si el inexistente responde en 5 ms y el real en 250 ms, se nota quién existe. Arreglo: cuando el usuario no existe, verifica igualmente contra un hash ficticio para gastar el mismo tiempo.'
],

'w18d2': [
  '«builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => { o.TokenValidationParameters = new() { ValidIssuer = "vetcare", ValidAudience = "vetcare-web", IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(clave)), ValidAlgorithms = [SecurityAlgorithms.HmacSha256] }; o.Events = new() { OnMessageReceived = ctx => { ctx.Token = ctx.Request.Cookies["vetcare_sesion"]; return Task.CompletedTask; } }; });». Luego UseAuthentication y UseAuthorization, en ese orden.',
  'Genera una clave larga: «openssl rand -base64 48» y luego «dotnet user-secrets set "Jwt:Clave" "…" --project src/VetCare.Api». Al arrancar: «var clave = builder.Configuration["Jwt:Clave"] ?? throw new InvalidOperationException("Falta Jwt:Clave");». Busca la clave en appsettings*.json: no debe aparecer.',
  '«ctx.Response.Cookies.Append("vetcare_sesion", token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTimeOffset.UtcNow.AddMinutes(15) });» y «return Results.Ok(new { id, email, rol });». En DevTools → Application → Cookies debe verse la cookie con HttpOnly marcado.',
  'Como la cookie es HttpOnly, no puedes leerla desde JavaScript (esa es la gracia). Cópiala desde DevTools → Application → Cookies. En la consola: «JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")))». Verás email, rol y exp en claro: el JWT está firmado, no cifrado.',
  'ADR: Contexto (el navegador necesita guardar la sesión). Decisión (cookie HttpOnly + Secure + SameSite=Strict). Alternativa descartada (localStorage: cualquier XSS puede leer el token y enviarlo fuera). Consecuencias (protección CSRF con SameSite; la API y la web deben estar en el mismo sitio o configurar CORS con credenciales).'
],

'w18d3': [
  '«builder.Services.AddAuthorizationBuilder().AddPolicy("Personal", p => p.RequireRole("admin","veterinario","recepcion")).AddPolicy("Clinico", p => p.RequireRole("admin","veterinario")).AddPolicy("Admin", p => p.RequireRole("admin"));». En cada grupo: «.RequireAuthorization("Clinico")». Un endpoint sin RequireAuthorization queda público: revísalos todos.',
  'Tabla: | Método | Ruta | Política | ¿Pertenencia? |. Ejemplo: «GET | /api/mascotas/{id} | Personal o Dueno | sí: el dueño solo ve sus mascotas». «POST | /api/visitas | Clinico | no». Recorre todos los MapGet, MapPost… del proyecto: si alguno no está en la tabla, falta.',
  'Busca rutas con {id} y parámetros de query como ?duenoId=. Para cada una pregunta: si cambio el id por otro, ¿veo datos ajenos? Hasta que lo pruebes, márcala como «posible IDOR».',
  'Filtra en la propia consulta: «db.Mascotas.Where(m => m.Id == id && (esPersonal || m.Dueno.UsuarioId == usuarioId))». Si no encuentra nada → 404. Devolver 403 confirmaría al atacante que esa mascota existe. Obtén usuarioId de «ctx.User.FindFirstValue(ClaimTypes.NameIdentifier)», nunca de un parámetro que mande el cliente.',
  'Migración: «ALTER TABLE dueno ADD COLUMN usuario_id uuid REFERENCES usuario(id);». Tests: crea dos usuarios con rol dueño, cada uno con su mascota; el usuario A pide la mascota de B → 404. Un usuario de recepción hace POST /api/visitas → 403. Para autenticarte en los tests, haz login y reutiliza la cookie en el HttpClient.'
],

'w18d4': [
  '«app.MapGet("/api/auth/yo", (ClaimsPrincipal u) => Results.Ok(new { id = u.FindFirstValue(ClaimTypes.NameIdentifier), email = u.FindFirstValue(ClaimTypes.Email), rol = u.FindFirstValue(ClaimTypes.Role) })).RequireAuthorization();». Sin cookie → 401 automático. Pruébalo con curl con y sin cookie.',
  '«const q = useQuery({ queryKey: ["sesion"], queryFn: obtenerYo, retry: false, staleTime: Infinity });» y el contexto expone «{ usuario: q.data ?? null, cargando: q.isPending }». obtenerYo devuelve null si recibe 401 (no lanza error). Mientras cargando sea true, muestra un esqueleto, no el login.',
  '«function RutaProtegida({ roles, children }) { const { usuario, cargando } = useSesion(); if (cargando) return <Esqueleto />; if (!usuario) return <Navigate to="/login" state={{ desde: location }} replace />; if (roles && !roles.includes(usuario.rol)) return <SinPermiso />; return children; }». Aplícalo en el árbol de rutas, según la tabla de ayer.',
  'En el cliente fetch: «if (r.status === 401) window.dispatchEvent(new Event("sesion-caducada"));». Un componente escucha ese evento y abre un diálogo de login encima de la pantalla actual, sin navegar. Así el formulario debajo conserva su estado. Para probarlo, borra la cookie desde DevTools y pulsa guardar.',
  'Oculta: «{usuario.rol !== "recepcion" && <button>Registrar visita</button>}». Luego, desde la terminal: «curl -i -X POST localhost:5080/api/visitas -H "Content-Type: application/json" -d \'{…}\'» sin cookie → 401; con la cookie de un usuario de recepción → 403. El backend decide; ocultar el botón es solo comodidad.'
],

'w18d5': [
  '«CREATE TABLE token_refresco ( id uuid PRIMARY KEY, usuario_id uuid NOT NULL REFERENCES usuario(id), hash text NOT NULL UNIQUE, familia uuid NOT NULL, expira_en timestamptz NOT NULL, usado_en timestamptz, revocado_en timestamptz );». Guarda SHA256(token): si se filtra la tabla, los tokens no sirven. La columna familia agrupa los tokens que salen unos de otros por rotación.',
  'Refresco: busca por hash. Si no existe o expiró → 401. Si ya tiene usado_en → alguien lo reutiliza (posible robo): revoca toda la familia y responde 401. Si es válido: márcalo como usado, emite un JWT nuevo y un refresh nuevo de la misma familia. Salida: revoca el token actual y borra las cookies.',
  'En el cliente fetch: si recibe 401 y la petición no era el propio refresco, llama una vez a «POST /api/auth/refresco» y, si va bien, repite la petición original. Si el refresco falla → evento sesion-caducada. Evita que dos peticiones refresquen a la vez guardando la promesa del refresco en curso y reutilizándola.',
  '«builder.Services.AddRateLimiter(o => { o.AddFixedWindowLimiter("login", l => { l.PermitLimit = 5; l.Window = TimeSpan.FromMinutes(1); }); o.RejectionStatusCode = 429; });», «app.UseRateLimiter();» y en el login «.RequireRateLimiting("login")». Prueba: «for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code}\\n" -X POST …/login -d \'…\'; done» → el sexto da 429.',
  'Middleware: «ctx.Response.Headers["X-Content-Type-Options"] = "nosniff"; ["X-Frame-Options"] = "DENY"; ["Referrer-Policy"] = "no-referrer"; ["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";» y «app.UseHsts()» solo fuera de Development. En Network, haz clic en cualquier petición a la API y revisa los Response Headers.'
],

'w18d6': [
  'Para cada ataque: comando exacto (curl con las cabeceras), resultado esperado y resultado real (código y cuerpo). Ejemplos típicos: acceder sin cookie, IDOR cambiando ids, escalar rol, token alterado, token caducado, fuerza bruta en el login, reutilizar el refresh token, CORS desde otro origen. Hazlo contra la API, no contra la interfaz.',
  'Para cada ataque con éxito: qué estaba mal → arreglo → nuevo resultado. Ejemplo: «GET /api/historial/{id} no filtraba por dueño → añadido el filtro de pertenencia en la consulta → ahora 404». Ese «qué estaba mal» es lo más valioso para contar en una entrevista.',
  'Un test por ataque en tests/VetCare.Api.Tests/Seguridad/: «SinCookie_Mascotas_Devuelve401», «DuenoA_MascotaDeB_Devuelve404», «Recepcion_RegistrarVisita_Devuelve403», «TokenAlterado_Devuelve401». Si alguien quita un filtro en un refactor, la suite lo detecta.',
  'Junto a cada punto: archivo:línea o nombre del test. «Contraseñas con hash lento → Usuario.cs:31 (BCrypt workFactor 12)». «Límite de intentos → Program.cs:58 + test Login_SextoIntento_429». Si solo puedes decir «creo que sí», márcalo como pendiente.',
  'Cuatro partes, unos 45 segundos cada una: qué guardas y cómo (hash BCrypt, nunca la contraseña), cómo sabes quién es (JWT en cookie HttpOnly), cómo decides qué puede hacer (políticas por rol + filtro por pertenencia) y qué encontraste al atacarlo (el fallo más serio y cómo lo cerraste). Grábate.'
],

/* ---------- Semana 19 ---------- */

'w19d1': [
  'Busca en el código: «SqlQueryRaw(», «FromSqlRaw(», «ExecuteSqlRaw(», «$"SELECT», «"SELECT … " +» y «string.Format(» con SQL. Revisa cada resultado: si hay {variable} dentro de un $"" pasado a un método Raw, o hay un +, es concatenación. Apunta archivo y línea.',
  'Si no tienes ninguna consulta vulnerable, crea una a propósito en un endpoint de pruebas: «db.Database.SqlQueryRaw<…>($"SELECT … WHERE nombre = \'{q}\'")». Ataca con «curl "localhost:5080/prueba/buscar?q=%27%20OR%20%271%27%3D%271"» (es \' OR \'1\'=\'1 codificado para la URL). Si devuelve todas las mascotas, la vulnerabilidad está demostrada.',
  'Cambia a «SqlQueryRaw<…>("SELECT … WHERE nombre = {0}", q)» o usa «FromSql($"… WHERE nombre = {q}")» (este método sí convierte la interpolación en parámetros). Repite el mismo curl: cero filas. El texto del ataque viaja como un dato y nunca se interpreta como SQL.',
  'Busca «Process.Start», «Path.Combine(» con datos de la petición, «File.ReadAllText(» con rutas que vienen del usuario. Ejemplo de riesgo: «Path.Combine("adjuntos", nombreArchivo)» con «../../appsettings.json». Cómo se cierra: usar solo ids generados por ti o «Path.GetFileName(nombre)» y comprobar que la ruta final queda dentro de la carpeta permitida.',
  'Tres párrafos: dónde estaba (archivo:línea y la consulta), el ataque (el curl exacto y cuántas filas devolvió) y por qué funciona la parametrización (la consulta y los datos viajan por separado a PostgreSQL, así que el dato nunca puede convertirse en código, sin importar qué caracteres contenga).'
],

'w19d2': [
  'Crea una mascota con ese nombre desde el formulario o con curl. En la agenda debe verse el texto literal «<img src=x onerror=alert(1)>» y no debe saltar ninguna alerta. Inspecciona el elemento: verás &lt;img… escapado. React convierte el texto en texto, nunca en HTML.',
  '«grep -rn "dangerouslySetInnerHTML" web/src». Si aparece, sigue el valor hasta su origen: ¿viene de la API?, ¿lo escribió un usuario? Si sí, quítalo y muéstralo como texto, o sanéalo con DOMPurify. Si no aparece, escribe «verificado: 0 usos (fecha)».',
  '«export function urlSegura(u: string): string { try { const url = new URL(u, window.location.origin); return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "#"; } catch { return "#"; } }». Úsala en «href={urlSegura(dueno.web)}». Prueba con «javascript:alert(1)»: debe convertirse en «#».',
  'En la API: «ctx.Response.Headers["Content-Security-Policy"] = "default-src \'self\'; script-src \'self\'; object-src \'none\'; frame-ancestors \'none\'";». En vite.config.ts: «preview: { headers: { "Content-Security-Policy": "…" } }». Las violaciones aparecen en la consola en rojo, con la directiva que falló: ajusta la política sin poner \'unsafe-inline\' en script-src.',
  'Tres puntos: 1) React escapa todo lo que pintas como {texto}. 2) Se le escapa por dangerouslySetInnerHTML y por URLs con javascript: en href o src. 3) Si algo pasa los filtros, la CSP impide ejecutar scripts que no vengan de tu propio dominio. Añade la evidencia de cada punto (la prueba de hoy).'
],

'w19d3': [
  'Por campo: «motivo: string, obligatorio, 3–200 caracteres, sin saltos de línea», «duracionMinutos: entero, 15–120, múltiplo de 15», «inicio: fecha ISO con zona, futura, como mucho a 6 meses vista». Si no sabes un límite, decide uno razonable y anótalo como supuesto para confirmarlo con el negocio.',
  'Reutiliza el filtro de validación de la semana 12 o escribe un validador por DTO: «if (dto.DuracionMinutos is < 15 or > 120) errores["duracionMinutos"] = ["Debe estar entre 15 y 120"];». Devuelve «Results.ValidationProblem(errores, statusCode: 422)». Esta validación revisa la forma de los datos; las reglas de negocio siguen en el dominio.',
  'Cuatro curl: «-d \'{}\'» (422 por los obligatorios), duración 100000 (422), motivo de 10000 caracteres (genéralo con «python3 -c "print(\'a\'*10000)"») → 422, y «-d \'{"motivo":\'» (JSON roto) → 400. Si alguno da 500, falta un caso: mira la excepción en el log de la API.',
  'En Program.cs: «builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 1_000_000);». Genera un archivo grande: «python3 -c "import json; print(json.dumps({\'motivo\': \'a\'*5_000_000}))" > grande.json» y «curl -i -X POST … -H "Content-Type: application/json" --data-binary @grande.json» → 413 Payload Too Large.',
  'Tabla: | Campo | Regla en el formulario | Regla en la API | ¿Coinciden? |. Si no coinciden, alinéalas, idealmente con constantes compartidas o documentadas en api-contract.md. Prueba un valor justo en el límite (200 caracteres) en los dos sitios.'
],

'w19d4': [
  '«dotnet list package --include-transitive». Cuenta las líneas de «Top-level Package» y de «Transitive Package». Anota los dos números en dependencias.md. En el frontend: «npm ls --all | wc -l» para el equivalente.',
  '«dotnet list package --vulnerable --include-transitive» y «cd web && npm audit». Para cada hallazgo: paquete, versión, severidad y el enlace al advisory. Abre uno y escribe con tus palabras qué permite hacer a un atacante y si afecta a cómo usas tú ese paquete.',
  'Para saber quién arrastra una transitiva: «npm explain nombre-paquete» o «dotnet nuget why <proyecto> <paquete>» (en .NET 8.0.4xx o posterior). Sube el paquete de primer nivel: «dotnet add package X --version …» o «npm install x@latest». Vuelve a auditar: el hallazgo debe desaparecer.',
  'Mira el repositorio de cada paquete (enlace en nuget.org o npmjs.com): fecha del último commit, número de mantenedores, descargas semanales. Tabla: | Paquete | Último commit | Mantenedores | ¿Sustituible? |. Ejemplo: «left-pad | 2018 | 1 | sí: String.prototype.padStart».',
  'En ci.yml añade los pasos «dotnet list package --vulnerable --include-transitive 2>&1 | tee audit.txt; ! grep -q -i "has the following vulnerable packages" audit.txt» y «npm audit --audit-level=high». Para Dependabot: crea .github/dependabot.yml con «package-ecosystem: "nuget"» y «"npm"», con «directory» y «schedule: weekly».'
],

'w19d5': [
  '«git grep -n -i -E "password|secret|key|token|connectionstring"». Para cada resultado: ¿es un valor real («Password=dev123») o solo un nombre («Jwt:Clave»)? Los nombres no pasa nada; los valores reales hay que sacarlos. Revisa también los archivos .http, los scripts y los README.',
  '«dotnet user-secrets set "ConnectionStrings:VetCare" "Host=…;Password=…" --project src/VetCare.Api» por cada secreto. En appsettings.json deja: «"ConnectionStrings": { "VetCare": "" }». Arranca la API y llama a /health/ready: si responde 200, lee los secretos de user-secrets.',
  'Revisa appsettings.Development.json línea a línea: solo niveles de log y valores inofensivos. En .gitignore: «.env», «*.local.json», «appsettings.*.local.json». Busca en el historial: «git log -p -S "Password=" --all». Si aparece algún valor real, ese secreto está expuesto aunque ya no esté en el código.',
  'Rotar = generar un valor nuevo, ponerlo donde se use y dejar el viejo inservible (cambiar la contraseña de la base, generar otra clave JWT, revocar el token en el proveedor). Anota: «Rotar contraseña de la base: expuesta en el commit abc123 (fecha)». Limpiar el historial con git filter-repo puede hacerse después, pero no sustituye a rotar.',
  'Busca «_logger.Log» y revisa los parámetros: «LogInformation("Login de {Email}", email)» → «LogInformation("Login correcto {UsuarioId}", id)». Añade: «LogWarning("Login fallido para {UsuarioId}", idSiExiste)» y «LogWarning("Acceso denegado {UsuarioId} {Ruta}", …)». Nunca registres contraseñas, tokens ni la cabecera Authorization.'
],

'w19d6': [
  'Superficie: los endpoints públicos de la API, la web y el puerto de la base (¿está expuesto?). Activos ordenados por valor: historiales médicos, datos de contacto de los dueños, credenciales, agenda. Actores: dueño curioso (ve datos de otro), empleado que se va de la empresa, atacante externo automatizado, bot de fuerza bruta.',
  'Tabla: | Categoría OWASP | Amenaza en VetCare | Impacto (A/M/B) | Probabilidad (A/M/B) |. Ejemplo: «A01 Control de acceso roto | un dueño ve la mascota de otro cambiando el id | A | M». «A10 SSRF | no aplica porque VetCare no hace peticiones a URLs que proporciona el usuario».',
  'Ordena por impacto × probabilidad y elige las 3 primeras. Para cada una, el curl exacto, la respuesta obtenida (código y cuerpo) y la conclusión. Pega la salida en el documento como evidencia: «HTTP/1.1 404 Not Found» demuestra más que «está protegido».',
  'Por amenaza: Mitigación | Estado (hecha / parcial / pendiente) | Dónde (archivo o test). Ejemplo: «Fuerza bruta en el login | hecha | Program.cs:58 + test Login_SextoIntento_429». «Copias de la base cifradas | pendiente | sin hacer». Ser honesto aquí es lo que da credibilidad al documento.',
  'Cada punto con su evidencia concreta: el nombre del test, el comando y su salida, o una captura. En la sección 4, riesgos aceptados con motivo: «Sin autenticación en dos pasos: la clínica tiene 4 empleados y está en una red interna; se revisará si se abre a dueños por internet».',
  'Tres partes: qué protege VetCare (datos médicos y de contacto), la amenaza más seria que encontraste (con el ataque y lo que devolvió) y cómo la cerraste (con el test que lo comprueba). Cronométrate: 3 minutos. Es la respuesta a «háblame de seguridad en tu proyecto».'
],

/* ---------- Semana 20 ---------- */

'w20d1': [
  '«git init», «dotnet new gitignore» y añade al final de ese .gitignore: «node_modules/», «.env», «*.local.json», «dist/». Comprueba con «git status» que no aparecen bin, obj ni node_modules. Luego «git add .» y «git commit -m "Estructura inicial de VetCare"».',
  'Ejemplo: asunto «Rechaza citas de menos de 15 minutos» (imperativo, sin punto final, menos de 50 caracteres). Línea en blanco. Cuerpo: «Recepción agendaba citas de 5 minutos por error al teclear y el veterinario no tenía tiempo de atender. El mínimo de 15 viene de la RN-04». Usa «git commit» sin -m para que se abra el editor.',
  'Cambia dos cosas sin relación en el mismo archivo (por ejemplo, un mensaje de error y un nombre de variable). «git add -p archivo»: para cada bloque responde y (sí) o n (no). Confirma el primero, repite con el segundo. «git log -p -2» debe mostrar dos commits, cada uno con su cambio.',
  '«git log --oneline --graph --all». Léelo como si llegaras nuevo: ¿entiendes qué se hizo y por qué? Mensajes como «fix», «cambios» o «wip» no dicen nada. Apunta: «a1b2c3 "fix" → debería ser "Corrige el cálculo del fin de cita en el cambio de hora"».',
  'Crea prueba.txt y haz commit. Modifícalo y «git restore prueba.txt» (descarta). Modifícalo, «git add» y «git restore --staged prueba.txt» (lo saca del área de preparación). «git commit --amend» (cambia el mensaje del último commit). «git revert HEAD» (crea un commit que deshace el anterior). Mira «git log» después de cada paso.'
],

'w20d2': [
  '«git switch -c feat/recordatorio-vacunas». Prefijos: feat (algo nuevo), fix (corrección), docs, refactor. Mal: «feat/Program-cs». Bien: «fix/solape-citas-medianoche». El nombre debe decir qué cambia para el usuario o para el código, no qué archivo tocas.',
  'En main: cambia la línea 10 de README.md a «Versión A» y haz commit. «git switch feat/…»: cambia la misma línea a «Versión B» y haz commit. «git switch main && git merge feat/…» → «CONFLICT». El archivo tendrá marcas <<<<<<<, ======= y >>>>>>> con las dos versiones.',
  'Lee las dos versiones, decide cuál es la correcta (o combínalas) y borra las marcas. Antes del commit: «dotnet build && dotnet test» (y «npm run build» si el conflicto es del frontend). Luego «git add archivo» y «git commit». Busca que no quede ningún «<<<<<<<» en el proyecto.',
  'Repite el ejercicio en ramas nuevas, pero en lugar de merge: «git switch feat/… && git rebase main», resuelve, «git add» y «git rebase --continue». Compara «git log --oneline --graph» de los dos casos: el merge deja un rombo; el rebase, una línea recta. Escribe cuándo usarías cada uno.',
  '«git reflog» muestra cada sitio por el que pasó HEAD, incluidos commits «perdidos» tras un reset o un rebase. Para recuperar uno: «git switch -c rescate HEAD@{5}». Pruébalo: haz «git reset --hard HEAD~1» y recupera ese commit desde el reflog.'
],

'w20d3': [
  'Dockerfile en dos etapas: «FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build» (copia los csproj, restore, copia el código, publish) y «FROM mcr.microsoft.com/dotnet/aspnet:10.0» (copia solo la salida de publish, «USER app», ENTRYPOINT). .dockerignore: «**/bin», «**/obj», «.git», «node_modules», «.env», «**/*.local.json».',
  '«docker build -t vetcare-api .» y «docker images vetcare-api» muestra el tamaño (unos 200–250 MB). Para comparar, un Dockerfile de una sola etapa con la imagen sdk: más de 800 MB. Anota los dos números: la imagen pequeña se descarga antes y lleva menos software que pueda tener vulnerabilidades.',
  '«docker run --rm -p 8080:8080 -e ConnectionStrings__VetCare="Host=host.docker.internal;Database=vetcare;Username=postgres;Password=dev" vetcare-api». Los dos guiones bajos (__) equivalen a los dos puntos de la configuración. host.docker.internal llega a tu máquina desde el contenedor. Abre localhost:8080/health/ready.',
  'Orden correcto en la etapa build: «COPY *.sln ./», «COPY src/*/*.csproj» (en sus carpetas), «RUN dotnet restore» y DESPUÉS «COPY . .». Cambia una línea de código y reconstruye: el paso restore debe decir CACHED. Si se repite cada vez, el código se copió antes que los csproj.',
  '«docker ps» para ver el id, luego «docker exec -it <id> whoami» → debe responder «app». Si responde root, falta «USER app» en la última etapa (las imágenes de .NET 8 y posteriores ya traen ese usuario creado).'
],

'w20d4': [
  'Servicios: db (postgres:17, con volumen y healthcheck «pg_isready -U postgres»), api (build: ., depends_on db con condition: service_healthy) y web (build: ./web). En .env: «DB_PASSWORD=…» y «JWT_CLAVE=…»; en el compose: «${DB_PASSWORD}». Comprueba con «git check-ignore .env»: debe imprimir «.env».',
  '«docker compose up -d --build» y «docker compose ps»: los tres en running y db en healthy. Si la API se reinicia en bucle: «docker compose logs api». Lo típico es la cadena de conexión: dentro de compose el host es «db» (el nombre del servicio), no localhost.',
  'Aplica tus migraciones: «docker compose exec -T db psql -U postgres -d vetcare < database/migrations/001_….sql» (o tu script). Carga seed.sql igual. «docker compose down» y «docker compose up -d»: consulta los datos, deben seguir ahí. Están en el volumen, no en el contenedor.',
  '«docker compose down -v» borra también los volúmenes. Al volver a levantar, la base está vacía. Diferencia: down para y elimina los contenedores (los datos se quedan en el volumen); down -v elimina además los datos. Anótalo en el README para que nadie lo descubra por accidente.',
  '«git clone <tu-repo> /tmp/vetcare-prueba && cd /tmp/vetcare-prueba», «cp .env.example .env», rellena los valores y sigue el README sin consultar nada más. Cada vez que tengas que hacer algo que no está escrito, anótalo y añádelo al README.'
],

'w20d5': [
  'Esqueleto: «on: [push, pull_request]», un job backend con «runs-on: ubuntu-latest» y los pasos «actions/checkout@v4», «actions/setup-dotnet@v4» (dotnet-version: 10.0.x), «dotnet restore», «dotnet build --no-restore», «dotnet format --verify-no-changes» y «dotnet test --no-build». Haz push y abre la pestaña Actions.',
  'Abre el paso en rojo y lee las últimas líneas del log. Si es format: ejecuta «dotnet format» en local, haz commit y push. Si los tests no encuentran las migraciones: construye la ruta desde la raíz del repositorio («AppContext.BaseDirectory» y sube carpetas hasta encontrar el .sln) en lugar de usar «../../..».',
  'Job frontend: «actions/setup-node@v4» (node-version: 22, cache: npm, cache-dependency-path: web/package-lock.json), «npm ci», «npx tsc -b», «npm run build», «npm audit --audit-level=high». Usa «defaults: run: working-directory: web» para no repetir «cd web» en cada paso.',
  'Job imagen: «needs: [backend, frontend]» y «docker build -t vetcare-api:${{ github.sha }} .». En la página de la ejecución verás un grafo: backend y frontend en paralelo, imagen después. Si uno de los dos falla, imagen aparece como omitido (skipped).',
  '«git switch -c prueba/ci-rojo», cambia un «Should().Be(1)» por «Should().Be(2)», push y abre una pull request. La PR debe mostrar el check en rojo y, si protegiste main (Settings → Branches → Require status checks), no dejará hacer merge. Cierra la PR y borra la rama al terminar.'
],

'w20d6': [
  'Clona en una carpeta nueva («git clone … ~/vetcare-limpio»), no copies .env ni nada de tu carpeta de trabajo. Abre el README y haz exactamente lo que dice, en orden. Ten una nota abierta: «Paso 3 dice docker compose up, pero antes hay que crear .env → falta en el README».',
  'Corrige el README con cada nota, borra la carpeta y repite desde cero. Termina cuando una pasada completa funcione sin improvisar nada. Si puedes, pide a otra persona que lo pruebe: encontrará cosas que tú ya das por sabidas.',
  'Secciones: Entornos (local, pruebas, producción), Requisitos (Docker, versiones), Arranque, Migraciones (cómo y cuándo se aplican), Despliegue paso a paso, Rollback (volver a la imagen anterior y qué pasa con las migraciones), Qué vigilar después (health, errores, latencia) y Riesgos conocidos.',
  'Marca cada punto con su evidencia: «main protegida → captura de Settings», «CI verde → enlace a la ejecución», «sin root → whoami responde app». Si algún punto no tiene evidencia, haz lo que falta antes de marcarlo.',
  '«git log --oneline -2» para ver el commit anterior. Construye su imagen: «git switch --detach <sha> && docker build -t vetcare-api:<sha> . && git switch main». Cambia la etiqueta de la imagen en compose y levanta contra la MISMA base. Si falla porque falta una columna o sobra una NOT NULL, tu última migración no era compatible hacia atrás.',
  'Estructura: 1) cómo se despliega (pasos y comandos), 2) cómo sabes que fue bien (health, logs, una prueba manual), 3) qué haces si sale mal (rollback a la imagen anterior y por qué las migraciones lo permiten). Si te trabas en algún punto, ese punto falta en despliegue.md.'
]

});
