window.WEEKS = (window.WEEKS || []).concat([
{
  n: 19,
  phase: 'Seguridad',
  title: 'Seguridad aplicada: todo lo que no es iniciar sesión',
  idea: 'La semana pasada pusiste puertas: contraseñas, tokens, roles. Esta semana descubres que un atacante casi nunca toca la puerta. Entra por la ventana que dejaste abierta sin saberlo: un campo de texto que se interpreta como código, una URL que tu servidor visita por obediencia, una librería de hace dos años con un fallo publicado, una clave de API que quedó en el historial de git. Ninguna de esas cosas se arregla con más login. Se arreglan validando en el borde, codificando a la salida, sabiendo qué dependencias usas y tratando los secretos como lo que son. Al terminar la semana vas a mirar tu propio código con ojos distintos: no preguntándote si funciona, sino preguntándote qué pasa si alguien manda lo que no esperabas.',
  res: [
    { t: 'OWASP Top 10 (2025)', u: 'https://owasp.org/Top10/2025/', note: 'La lista de referencia de la industria, edición 2025. No la leas entera: cada día te mando a una categoría concreta.' },
    { t: 'OWASP Cheat Sheet — Input Validation', u: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html', note: 'Corto y práctico. Explica la diferencia entre validar, sanear y codificar, que es donde casi todo el mundo se confunde.' },
    { t: 'OWASP Cheat Sheet — Cross Site Scripting Prevention', u: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', note: 'La guía de XSS por contexto. Lo importante es la idea de que el mismo dato es seguro en un sitio y peligroso en otro.' },
    { t: 'ASP.NET Core security documentation', u: 'https://learn.microsoft.com/en-us/aspnet/core/security/', note: 'El índice oficial de seguridad en tu stack. Lo usas como referencia cuando necesites la forma concreta de hacer algo en .NET.' },
    { t: 'Microsoft Learn — Safe storage of app secrets', u: 'https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets', note: 'User secrets en desarrollo y configuración por capas.' },
    { t: 'OWASP Top 10:2025 — A05 Injection', u: 'https://owasp.org/Top10/2025/A05_2025-Injection/', note: 'La categoría de inyección de la edición 2025: descripción, prevención y ataques de ejemplo.' },
    { t: 'OWASP Top 10:2025 — A03 Software Supply Chain Failures', u: 'https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/', note: 'La categoría de dependencias y cadena de suministro de la edición 2025.' }
  ],
  days: [
    {
      t: 'Inyección: cuando tu dato se vuelve código',
      obj: 'Entender por qué la inyección existe, demostrarla en tu propio código y cerrarla con parámetros en vez de con filtros de texto.',
      why: 'Es la pregunta de seguridad más repetida en entrevistas y la que más gente responde mal: contestan "escapo las comillas" en vez de "separo código de datos". Saber explicar la diferencia te coloca por encima de la media inmediatamente.',
      study: { r: 5, what: 'Lee la categoría A05:2025 Injection del OWASP Top 10. Unos 10 minutos. Busca una sola idea: la inyección ocurre cuando datos del usuario se mezclan con la instrucción que el motor va a interpretar. Fíjate que incluye SQL, pero también comandos del sistema operativo y LDAP: es el mismo fallo en distintos idiomas.',
        pasos: [
          'Lee "Description." (~3 min): cuando una aplicación es vulnerable.',
          'Lee "How to prevent." (~3 min): consultas parametrizadas por encima de todo.',
          'Lee "Example attack scenarios." (~2 min) y reescribe el primer ejemplo con tablas de VetCare.',
          'Busca en tu código cualquier SQL construido concatenando texto y apúntalo para corregirlo.'
        ] },
      ex: {
        title: 'La misma consulta, concatenada y parametrizada',
        body: `// MAL: el texto del usuario se convierte en parte de la instrucción
var nombre = request.Query["nombre"];
var sql = "SELECT * FROM mascota WHERE nombre = '" + nombre + "'";
var filas = await db.Database.SqlQueryRaw<MascotaDto>(sql).ToListAsync();

// Si alguien envía:  ' OR '1'='1
// la base recibe:    SELECT * FROM mascota WHERE nombre = '' OR '1'='1'
// y devuelve todas las mascotas de la clínica.

// Si alguien envía:  '; UPDATE usuario SET rol = 2 WHERE correo = 'yo@mail.com'; --
// la base recibe dos instrucciones y la segunda te da rol de administrador.

// BIEN: el texto del usuario nunca forma parte de la instrucción
var filas = await db.Database
    .SqlQueryRaw<MascotaDto>(
        """SELECT id AS "Id", nombre AS "Nombre" FROM mascota WHERE nombre = {0}""",
        nombre)
    .ToListAsync();
// ({0} no se pega en el texto: EF lo convierte en un parámetro. Los alias
//  van entre comillas para que coincidan con las propiedades del DTO,
//  como viste en la semana 15.)

// La instrucción viaja fija y el valor viaja aparte, por un canal
// que el motor nunca interpreta como SQL. No hay nada que escapar
// porque nunca se mezclaron.

// MEJOR AÚN: LINQ ya parametriza por ti
var filas = await db.Mascotas
    .Where(m => m.Nombre == nombre)
    .Select(m => new MascotaDto(m.Id, m.Nombre))
    .ToListAsync();`
      },
      steps: [
        'Abre tu proyecto y busca cualquier sitio donde construyas SQL con concatenación o interpolación de cadenas. Revisa en especial las consultas crudas que escribiste en la semana 15 con SqlQueryRaw. Apunta cada una en una lista.',
        'Levanta la API y ataca una de verdad desde el navegador o curl: manda el valor \' OR \'1\'=\'1 en el parámetro de búsqueda. Si recibes más filas de las que deberías, acabas de demostrar la vulnerabilidad en tu propio sistema. Guarda la respuesta como evidencia.',
        'Corrige esa consulta usando parámetros posicionales {0} o NpgsqlParameter. Repite el ataque y confirma que ahora devuelve cero filas, porque busca literalmente una mascota llamada \' OR \'1\'=\'1.',
        'Busca ahora inyección fuera de SQL: cualquier Process.Start, cualquier construcción de ruta de archivo con texto del usuario, cualquier cadena que acabe en un intérprete. Si tienes alguna, anota cómo la cerrarías.',
        'Escribe en docs/seguridad.md una sección "Inyección" con las tres cosas: dónde estaba el riesgo, qué ataque usaste para demostrarlo, y por qué la parametrización lo cierra de raíz en vez de filtrar caracteres.'
      ],
      vet: [
        'Revisa la consulta ResumenAsync (el resumen mensual) de la semana 15: era SQL crudo. Confirma que el año llega como parámetro y no concatenado, y escribe un test que pase un valor malicioso y compruebe que no rompe nada.',
        'Añade a database/queries.sql un comentario al principio del archivo recordando que toda consulta nueva debe usar parámetros, para que tu yo futuro no lo olvide cuando tenga prisa.'
      ],
      edge: [
        'Escapar comillas a mano no es una solución: siempre hay una codificación, un juego de caracteres o un caso límite que se te escapa. La única defensa real es que el dato viaje por un canal distinto al de la instrucción.',
        'Los nombres de tabla y columna no se pueden parametrizar. Si necesitas ordenar por una columna que elige el usuario, no la pegues en el SQL: valida contra una lista blanca fija de columnas permitidas y usa el valor de la lista, no el del usuario.',
        'Un ORM no te hace inmune. EF Core parametriza LINQ, pero FromSqlRaw y SqlQueryRaw con interpolación normal vuelven a abrir el agujero. FromSqlInterpolated sí parametriza; la diferencia está en el tipo del argumento, no en cómo se ve.'
      ],
      quiz: [
        { q: '¿Por qué parametrizar es mejor que escapar caracteres peligrosos?', a: 'Porque escapar intenta adivinar qué caracteres son peligrosos en un contexto que cambia, mientras que parametrizar elimina el problema de raíz: la instrucción se envía al motor ya compilada y el valor viaja por un canal separado que nunca se interpreta como código. No hay nada que adivinar.' },
        { q: 'Si uso EF Core con LINQ, ¿puedo tener inyección SQL?', a: 'Con LINQ normal no, porque EF Core traduce a una consulta parametrizada. Pero si usas FromSqlRaw o SqlQueryRaw concatenando texto del usuario, sí: el ORM te da el canal seguro pero no te obliga a usarlo.' },
        { q: 'Un usuario necesita ordenar los resultados por la columna que elija. ¿Cómo lo haces sin abrir una inyección?', a: 'Validas el valor recibido contra una lista blanca fija de columnas permitidas en tu código y usas el elemento de esa lista, nunca la cadena del usuario. Los identificadores no se pueden parametrizar, así que la única defensa es que el conjunto de valores posibles sea cerrado y lo definas tú.' },
        { q: '¿Qué tienen en común la inyección SQL, la inyección de comandos y el XSS?', a: 'Los tres son el mismo fallo en distintos intérpretes: datos del usuario llegan a un motor que los interpreta como instrucciones porque nunca se separó el código de los datos. Cambia el intérprete (la base, la shell, el navegador) pero la causa y el patrón de defensa son idénticos.' }
      ],
      out: 'Una vulnerabilidad de inyección demostrada con un ataque real contra tu propia API, corregida con parámetros, y documentada en docs/seguridad.md.',
      file: 'docs/seguridad.md'
    },
    {
      t: 'XSS y codificación de salida',
      obj: 'Entender que el mismo dato es seguro o peligroso según dónde lo pintes, y comprobar qué protección te da React de verdad y dónde deja de darla.',
      why: 'Mucha gente cree que "uso React, estoy protegido". Es medio cierto, y saber exactamente dónde acaba esa protección es lo que distingue a alguien que entiende de alguien que repite. Además conecta con la decisión de dónde guardaste el token en la semana 18.',
      study: { r: 2, what: 'Lee la introducción y la sección de contextos de la Cheat Sheet de XSS. Unos 12 minutos. Quédate con una idea: no existe "dato seguro", existe "dato codificado para el contexto donde va". El mismo texto necesita codificación distinta en HTML, en un atributo, dentro de JavaScript y en una URL.',
        pasos: [
          'Lee "Introduction" y "Framework Security" (~4 min): React escapa por ti, pero no en todos los sitios.',
          'Lee "XSS Defense Philosophy" y la introducción de "Output Encoding" (~3 min).',
          'Lee las subsecciones de HTML, atributos, JavaScript y URL dentro de Output Encoding (~5 min).',
          'Lee "Dangerous Contexts" (~2 min).',
          'Busca en tu frontend dangerouslySetInnerHTML y href construidos con datos del usuario: son los huecos donde React no te protege.'
        ] },
      ex: {
        title: 'Dónde React te protege y dónde te deja solo',
        body: `// SEGURO: React escapa el texto al renderizarlo
function Nota({ texto }: { texto: string }) {
  return <p>{texto}</p>;
}
// Si texto es  <img src=x onerror=alert(1)>
// el navegador muestra ese texto literal. No ejecuta nada.

// PELIGROSO: le pediste explícitamente que no escape
function NotaRica({ html }: { html: string }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}
// Aquí el onerror sí se ejecuta. El nombre de la prop es una
// advertencia, no un detalle de estilo.

// PELIGROSO: href acepta javascript: como esquema
<a href={urlDelUsuario}>Ver ficha</a>
// Si urlDelUsuario es  javascript:fetch('/api/...')
// el clic ejecuta código. React no valida esquemas de URL.

// Defensa para el enlace: lista blanca de esquemas
function urlSegura(u: string): string {
  try {
    const parsed = new URL(u, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';
  }
}

// Y la cabecera que limita el daño si algo se cuela. OJO: tiene que ir en
// la respuesta que entrega index.html (la página), no solo en el JSON de la
// API. Si en producción la API sirve también la web (app.UseStaticFiles y
// MapFallbackToFile("index.html")), este middleware la cubre:
app.Use(async (ctx, next) => {
    ctx.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'";
    await next();
});
// Para probarla en local con Vite: npm run build y después npm run preview,
// con la cabecera en vite.config.ts:
//   preview: { headers: { 'Content-Security-Policy': "default-src 'self'; ..." } }
// (npm run dev mete scripts en línea para recargar en caliente y choca con
//  una CSP estricta: no la pruebes ahí.)`
      },
      steps: [
        'Entra en tu formulario de la semana 16 (o crea una mascota) y escribe como nombre de mascota el texto <img src=x onerror=alert(1)>. Guárdalo y recarga la agenda. Confirma que se muestra como texto plano. Acabas de comprobar que React escapa por defecto.',
        'Busca en todo el proyecto web la cadena dangerouslySetInnerHTML. Si aparece en algún sitio, mira de dónde viene ese HTML: si puede venir de un usuario, tienes un XSS. Si no aparece, anota que lo verificaste.',
        'Busca cualquier atributo href o src que reciba un valor dinámico. Implementa la función urlSegura del ejemplo y úsala en todos ellos.',
        'Añade la cabecera Content-Security-Policy como en el ejemplo: en el middleware de la API (junto a las cabeceras de la semana 18) y en el preview de Vite. Abre la web con npm run build y npm run preview, con la consola del navegador abierta, y arregla las violaciones que aparezcan hasta que no quede ninguna.',
        'Escribe en docs/seguridad.md una sección "XSS" con tres puntos: qué protege React automáticamente, las dos vías por las que se le escapa y qué hace tu CSP si todo lo anterior falla.'
      ],
      vet: [
        'Si guardas notas clínicas con formato en VetCare, decide ahora: o guardas texto plano y lo pintas con saltos de línea, o guardas Markdown y lo conviertes a HTML con una librería que sanee. No inventes tu propio saneador.',
        'Verifica la decisión de la semana 18: si el token está en localStorage, un solo XSS se lo lleva. Si está en una cookie HttpOnly, no. Escribe esa frase en docs/seguridad.md como justificación explícita de tu elección.'
      ],
      edge: [
        'La codificación correcta depende del contexto. Lo que es seguro dentro de un <p> puede romper un atributo si contiene comillas, y dentro de una etiqueta <script> ninguna codificación HTML te salva. Nunca metas datos de usuario dentro de un bloque de script.',
        'El XSS almacenado es peor que el reflejado: el reflejado necesita que la víctima haga clic en tu enlace, el almacenado dispara solo cada vez que alguien abre la página. Un nombre de mascota malicioso ataca a toda la recepción.',
        'CSP es una red de seguridad, no un sustituto de codificar bien. Y una CSP con unsafe-inline en script-src no protege prácticamente de nada; si la necesitas para que tu app funcione, el problema está en la app.'
      ],
      quiz: [
        { q: '¿Por qué React protege de XSS por defecto y en qué dos casos deja de protegerte?', a: 'Porque al interpolar un valor en JSX lo escapa como texto, nunca como marcado. Deja de protegerte cuando usas dangerouslySetInnerHTML, que es una petición explícita de no escapar, y cuando pones un valor del usuario en un atributo que acepta código, como href con esquema javascript:.' },
        { q: '¿Qué diferencia hay entre XSS reflejado y almacenado, y cuál es más grave?', a: 'El reflejado vuelve en la respuesta a una petición manipulada, así que el atacante tiene que conseguir que la víctima abra su enlace. El almacenado queda guardado en tu base y se ejecuta para todo el que vea esa página, sin que el atacante haga nada más: es más grave porque escala solo.' },
        { q: '¿Qué es Content-Security-Policy y por qué no sustituye a codificar bien?', a: 'Es una cabecera que le dice al navegador de dónde puede cargar y ejecutar recursos, de modo que un script inyectado no llegue a ejecutarse. No sustituye a codificar porque es una segunda línea: reduce el daño de un fallo, pero si tu app necesita unsafe-inline para funcionar, esa línea casi desaparece.' },
        { q: '¿Cómo se relaciona el XSS con la decisión de dónde guardar el token de sesión?', a: 'Un XSS ejecuta JavaScript con todos los permisos de tu página, así que puede leer cualquier cosa que esté en localStorage, incluido el token. Una cookie marcada HttpOnly no es accesible desde JavaScript, así que el mismo XSS no puede robarla: por eso la elección de la semana 18 importa tanto.' }
      ],
      out: 'Una CSP activa sin violaciones en consola, todos los enlaces dinámicos validados por esquema, y la sección XSS escrita en docs/seguridad.md.',
      file: 'docs/seguridad.md'
    },
    {
      t: 'Validar en el borde y no confiar en el cliente',
      obj: 'Poner una capa de validación explícita en la entrada de la API, distinta de las reglas de negocio, y entender por qué la validación del formulario no cuenta.',
      why: 'Es la frontera que define si tu sistema es robusto o frágil. Y es la respuesta a una pregunta de entrevista muy común: "¿ya valido en el frontend, por qué validar otra vez?". La respuesta corta es que el frontend es opcional para el atacante.',
      study: { r: 1, what: 'Lee la Cheat Sheet de Input Validation, sobre todo las secciones de lista blanca frente a lista negra y la de validación sintáctica frente a semántica. Unos 10 minutos. Quédate con esto: validar no es sanear. Validar es rechazar lo que no encaja; sanear es modificar lo que llega, y modificar en silencio casi siempre esconde un bug.',
        pasos: [
          'Lee "Introduction" y "Input Validation Strategies" (~3 min): validación sintáctica frente a semántica.',
          'Lee "Allowlist vs Denylist" (~2 min): por qué la lista negra siempre se queda corta.',
          'Lee "Parse Safely, Then Validate" y "Validate Structured Data" (~3 min).',
          'Lee "Common Pitfalls" (~2 min).',
          'Para cada DTO de VetCare separa qué se valida en el borde (formato) y qué se valida en el dominio (reglas de negocio).'
        ] },
      ex: {
        title: 'Tres capas distintas que la gente confunde',
        body: `// CAPA 1 - Validación de entrada (sintáctica). En el borde de la API.
// Pregunta: ¿tiene esto la forma que espero?
public sealed record CrearCitaDto(
    Guid MascotaId,
    Guid VeterinarioId,
    DateTimeOffset Inicio,
    int DuracionMinutos,
    string? Motivo);

// Devuelve los errores por campo; vacío = todo bien
static Dictionary<string, string[]> Validar(CrearCitaDto d)
{
    var errores = new Dictionary<string, string[]>();

    if (d.MascotaId == Guid.Empty)
        errores["mascotaId"] = ["Requerido."];

    if (d.DuracionMinutos is < 10 or > 180)          // los límites de la semana 11
        errores["duracionMinutos"] = ["Debe estar entre 10 y 180."];

    if (d.Motivo is { Length: > 500 })
        errores["motivo"] = ["Máximo 500 caracteres."];

    return errores;
}

// CAPA 2 - Reglas de negocio (semántica). En el dominio.
// Pregunta: ¿tiene sentido esto en mi clínica?
//   - el veterinario existe y está activo
//   - la mascota no está dada de baja
//   - no hay solape con otra cita  -> ya lo tienes
// Estas reglas NO van en el DTO porque necesitan la base de datos.

// CAPA 3 - Restricciones de integridad. En PostgreSQL.
// Pregunta: ¿puede esto llegar a existir, pase lo que pase?
//   CHECK (fin - inicio BETWEEN interval '10 minutes' AND interval '180 minutes')
//   EXCLUDE USING gist (...)  -> tu constraint de solape
// Es la última red: protege aunque el bug esté en tu código.

// El endpoint responde 422 con problem details (RFC 9457, semana 11).
// El 400 queda para el JSON que ni siquiera se puede leer: ese lo
// devuelve ASP.NET Core solo.
var errores = Validar(dto);
if (errores.Count > 0)
    return Results.ValidationProblem(errores, statusCode: 422);`
      },
      steps: [
        'Elige los tres endpoints más importantes de tu API y escribe para cada uno, en papel o en un comentario, que forma exacta debe tener cada campo: tipo, rango, longitud máxima, si admite nulo. Si no sabes el límite de algo, decídelo ahora.',
        'Implementa la validación de entrada de esos tres endpoints. Puedes hacerlo a mano como en el ejemplo o con un endpoint filter de la semana 12 para no repetirte. Devuelve 422 con el formato de problem details que ya usas, como decidiste en la semana 11.',
        'Comprueba con curl qué pasa cuando mandas lo que no esperas: un cuerpo sin campos, una duración de 100000, un motivo de 10000 caracteres y un JSON malformado. El JSON malformado debe dar 400 y los otros tres 422, todos con un mensaje útil; nunca 500.',
        'Ajusta el límite de tamaño del cuerpo de la petición. Kestrel ya corta en unos 30 MB por defecto, pero para una API de citas eso es muchísimo: bájalo, por ejemplo a 1 MB, con builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 1_000_000). Mándale un JSON de 5 MB y comprueba que lo rechaza.',
        'Repasa tu formulario de React de la semana 16 y comprueba que los mensajes de error que muestra coinciden con lo que la API valida de verdad. Si el formulario permite algo que la API rechaza, el usuario se frustra; si el formulario bloquea algo que la API permite, estás perdiendo una funcionalidad sin querer.'
      ],
      vet: [
        'Crea en VetCare un endpoint filter reutilizable que valide el DTO entrante y corte la petición con 422 antes de llegar al manejador (o reutiliza el ValidacionFilter de la semana 12), para que ningún endpoint nuevo se te olvide.',
        'Escribe un test de API por cada regla de validación: mandas el valor inválido y compruebas el 422 y el nombre del campo en la respuesta. Son tests baratos y evitan regresiones silenciosas.'
      ],
      edge: [
        'Lista blanca siempre, lista negra nunca. Enumerar lo permitido es un conjunto cerrado que controlas; enumerar lo prohibido es una carrera que pierdes, porque siempre hay una variante que no pensaste.',
        'Sanear en silencio crea bugs raros: si recortas un texto a 500 caracteres sin avisar, el usuario cree que guardó algo que no se guardó. Rechaza y explica; solo normaliza cosas inequívocas como quitar espacios al principio y al final.',
        'Validar en el cliente es ergonomía, no seguridad. El atacante no usa tu formulario: usa curl. Toda validación que importe debe existir también en el servidor, y si puede expresarse como constraint, también en la base.'
      ],
      quiz: [
        { q: '¿Por qué no basta con validar en el formulario de React?', a: 'Porque el formulario es solo una forma cómoda de construir una petición HTTP, y cualquiera puede construir esa petición sin él usando curl o la consola del navegador. La validación del cliente mejora la experiencia; la del servidor es la única que un atacante no puede saltarse.' },
        { q: '¿Cuál es la diferencia entre validar y sanear, y cuál prefieres?', a: 'Validar es rechazar la entrada que no cumple la forma esperada; sanear es modificarla para que cumpla. Prefieres validar, porque sanear cambia los datos del usuario en silencio y convierte un error visible en un comportamiento raro que aparecerá mucho después.' },
        { q: '¿Por qué separar la validación de entrada de las reglas de negocio?', a: 'Porque responden preguntas distintas y necesitan cosas distintas: la de entrada pregunta si el dato tiene la forma correcta y se puede resolver mirando solo la petición, mientras que la de negocio pregunta si tiene sentido en el dominio y normalmente necesita consultar el estado del sistema.' },
        { q: '¿Qué gana la aplicación si la misma regla existe en la API y como constraint en PostgreSQL?', a: 'Gana una red de última instancia: si un bug, una migración a medias o un script manual intenta escribir un dato imposible, la base lo rechaza. La validación en la API da un buen mensaje de error; la constraint garantiza que el dato inválido nunca llega a existir.' }
      ],
      out: 'Tres endpoints con validación de entrada explícita, un límite de tamaño de cuerpo, y tests que comprueban cada regla devolviendo 422.',
      file: 'docs/seguridad.md'
    },
    {
      t: 'Dependencias: el código que no escribiste',
      obj: 'Saber exactamente qué librerías usas, detectar las que tienen vulnerabilidades conocidas y dejar esa comprobación automatizada.',
      why: 'La mayor parte del código que ejecutas en producción no lo escribiste tú. Es el vector de ataque que más ha crecido y el que casi ningún junior menciona. Decir en una entrevista "ejecuto dotnet list package --vulnerable en CI" es una señal muy fuerte de madurez.',
      study: { r: 6, what: 'Lee la categoría A03:2025 Software Supply Chain Failures (en 2021 se llamaba Vulnerable and Outdated Components). Unos 8 minutos. Fíjate en algo incómodo: no hace falta que la librería sea maliciosa, basta con que tenga un fallo publicado y tú no te hayas enterado. El problema no es la calidad del código ajeno sino tu falta de visibilidad.',
        pasos: [
          'Lee "Background." (~2 min): por qué esta categoría subió en la edición 2025.',
          'Lee "Description." (~3 min) y marca los puntos que aplican a VetCare.',
          'Lee "How to prevent." (~3 min) y convierte cada punto en una tarea concreta.',
          'Ejecuta dotnet list package --vulnerable y npm audit, y apunta lo que salga.'
        ] },
      ex: {
        title: 'Inventario y auditoría en los dos lados del proyecto',
        body: `# Backend: qué tengo instalado, incluyendo lo que viene arrastrado
dotnet list package --include-transitive

# Backend: cuáles tienen vulnerabilidades publicadas
# (desde .NET 8, dotnet restore ya avisa solo con los warnings NU1901-NU1904)
dotnet list package --vulnerable --include-transitive
#
# Project 'VetCare.Api' has the following vulnerable packages
#    [net10.0]:
#    Top-level Package      Severity   Resolved   Advisory URL
#    > Alguna.Librería       High       4.1.0      https://github.com/advisories/GHSA-xxxx

# Backend: qué está obsoleto (no es lo mismo que vulnerable)
dotnet list package --outdated

# Frontend
npm audit
npm audit --omit=dev          # solo lo que llega a producción
npm outdated

# Arreglar con criterio, no a lo bruto:
npm audit fix                 # solo cambios compatibles
# npm audit fix --force       # puede romperte la app: léelo antes

# En CI (GitHub Actions) hacemos que el pipeline falle si hay algo vulnerable:
#   - name: Auditar dependencias .NET
#     run: |
#       dotnet list package --vulnerable --include-transitive 2>&1 | tee audit.txt
#       ! grep -q "has the following vulnerable packages" audit.txt
#
#   - name: Auditar dependencias npm
#     run: npm audit --audit-level=high --omit=dev`
      },
      steps: [
        'Ejecuta dotnet list package --include-transitive en tu solución y mira el número real de paquetes. Casi siempre sorprende: las dependencias transitivas suelen multiplicar por diez las que tú declaraste.',
        'Ejecuta dotnet list package --vulnerable --include-transitive y npm audit. Anota cada hallazgo con su severidad y abre el advisory de al menos uno para leer qué permite hacer exactamente.',
        'Arregla lo que sea alto o crítico. Si la vulnerabilidad está en una dependencia transitiva, la solución suele ser subir el paquete de primer nivel que la arrastra, no instalar la transitiva a mano.',
        'Para cada paquete que uses, hazte tres preguntas y apunta las respuestas: cuándo fue su último commit, cuánta gente lo mantiene, y podría sustituirlo por algo de la librería estándar. Una dependencia de treinta líneas sin mantenimiento es peor que escribir esas treinta líneas.',
        'Añade los dos pasos de auditoría a tu pipeline de CI y activa Dependabot o Renovate en el repositorio para recibir avisos automáticos cuando salga una vulnerabilidad nueva.'
      ],
      vet: [
        'Crea docs/dependencias.md con una tabla: paquete, para qué lo uso, podría quitarlo. Revísala cada vez que vayas a añadir uno nuevo y se te hará costumbre preguntarte si de verdad lo necesitas.',
        'Fija las versiones de las imágenes de Docker de VetCare por etiqueta concreta en vez de latest, para que una reconstrucción no te cambie la base por debajo sin avisar.'
      ],
      edge: [
        'Obsoleto no es lo mismo que vulnerable. Una versión antigua sin fallos publicados puede ser perfectamente segura, y actualizar a lo último por costumbre introduce cambios de comportamiento gratis. Prioriza por severidad real, no por número de versión.',
        'npm audit fix --force puede subir versiones mayores y romper tu build. Ejecútalo solo cuando tengas tests verdes que te avisen, y nunca justo antes de una entrega.',
        'La instalación de un paquete puede ejecutar scripts en tu máquina. Desconfía de nombres parecidos a los populares: así funciona el typosquatting. Revisa siempre el nombre exacto antes de instalar.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre una dependencia directa y una transitiva, y por qué importa en seguridad?', a: 'La directa la declaraste tú; la transitiva llega porque otra dependencia la necesita. Importa porque la mayoría de las vulnerabilidades viven en las transitivas, que no aparecen en tu archivo de proyecto y por tanto son las que nunca miras.' },
        { q: 'Encuentras una vulnerabilidad alta en una dependencia transitiva. ¿Cómo la arreglas?', a: 'Normalmente subiendo la dependencia directa que la arrastra a una versión que ya incluye la corrección. Instalar la transitiva directamente para forzar su versión funciona pero es un parche frágil, así que solo se usa cuando el paquete de primer nivel aún no ha publicado arreglo.' },
        { q: '¿Por qué fallar el pipeline de CI ante una vulnerabilidad alta en vez de solo avisar?', a: 'Porque un aviso que no bloquea se ignora. Si el pipeline falla, la decisión de seguir adelante tiene que ser consciente y explícita, y queda registrada en vez de perderse entre el ruido de las notificaciones.' },
        { q: '¿Cuándo es mejor escribir tú mismo algo en vez de añadir una dependencia?', a: 'Cuando el paquete resuelve algo pequeño que puedes escribir en pocas líneas, o cuando está sin mantenimiento y con pocos ojos encima. Cada dependencia es código que ejecutas con tus permisos y superficie que tienes que vigilar para siempre.' }
      ],
      out: 'Auditoría de dependencias limpia en backend y frontend, los dos pasos integrados en CI, y docs/dependencias.md creado.',
      file: 'docs/dependencias.md'
    },
    {
      t: 'Secretos, configuración y registros sin filtraciones',
      obj: 'Sacar todos los secretos del repositorio, saber comprobar si alguna vez estuvieron ahí, y registrar información útil sin volcar datos personales ni credenciales.',
      why: 'Una clave filtrada en git es el fallo más barato de cometer y el más caro de arreglar, porque el historial es permanente. Y los registros que vuelcan datos sensibles convierten tu herramienta de diagnóstico en una base de datos de información personal sin proteger.',
      study: { r: 4, what: 'Lee la página de app secrets y después, desde el índice lateral, la de Data Protection. Unos 12 minutos. La idea clave: la configuración se superpone por capas y cada entorno aporta la suya, así que el secreto nunca tiene que vivir en el archivo que subes al repositorio.',
        pasos: [
          'Lee la introducción y "Work with environment variables" (~3 min).',
          'Lee "Use the Secret Manager tool" y "How the Secret Manager tool works" (~4 min): dónde se guardan los secretos y por qué solo sirve en desarrollo.',
          'Lee "Set a secret" y "Access a secret" (~3 min).',
          'Desde el índice lateral abre Data Protection por encima (~2 min).',
          'Busca en el historial de git cadenas de conexión o claves con git log -p y anota si alguna estuvo alguna vez en el repositorio.'
        ] },
      ex: {
        title: 'De la cadena de conexión en el repositorio a la configuración por capas',
        body: `// MAL: appsettings.json, versionado en git para siempre
{
  "ConnectionStrings": {
    "VetCare": "Host=prod.db;Username=admin;Password=Sup3rS3creta!"
  },
  "Jwt": { "Clave": "esta-clave-la-ve-todo-el-equipo" }
}

// BIEN: appsettings.json solo con lo que no es secreto
{
  "ConnectionStrings": { "VetCare": "" },
  "Jwt": { "Emisor": "vetcare", "MinutosExpiracion": 15 }
}

// Desarrollo: fuera del repositorio, por usuario
//   dotnet user-secrets init
//   dotnet user-secrets set "ConnectionStrings:VetCare" "Host=localhost;..."
//   dotnet user-secrets set "Jwt:Clave" "..."

// Producción: variables de entorno (doble guion bajo anida)
//   ConnectionStrings__VetCare=...
//   Jwt__Clave=...

// El código no cambia: el proveedor de configuración resuelve la capa
var cadena = builder.Configuration.GetConnectionString("VetCare")
    ?? throw new InvalidOperationException("Falta la cadena de conexión.");

// Registro que ayuda sin filtrar
_logger.LogInformation(
    "Cita {CitaId} creada por usuario {UsuarioId} para mascota {MascotaId}",
    cita.Id, usuarioId, cita.MascotaId);
// Identificadores sí; nombres, correos, teléfonos y tokens no.

// NUNCA:
// _logger.LogInformation("Login de {Correo} con token {Token}", correo, token);
// _logger.LogError(ex, "Fallo con payload {Payload}", JsonSerializer.Serialize(dto));`
      },
      steps: [
        'Busca en todo el proyecto las palabras password, secret, key, token y connectionstring sin distinguir mayúsculas. Revisa cada resultado y decide si es un valor real o solo un nombre.',
        'Mueve todos los secretos de desarrollo a user-secrets con dotnet user-secrets set, y deja en appsettings.json solo la estructura con valores vacíos. Confirma que la API sigue arrancando.',
        'Comprueba que appsettings.Development.json no contiene ningún secreto (ese archivo sí se puede versionar si solo tiene ajustes inofensivos) y que .gitignore cubre .env y cualquier archivo local de configuración. Si tu proyecto está en git, busca también en el historial: un secreto borrado en el último commit sigue estando en los anteriores.',
        'Si encuentras un secreto que llegó a estar en el historial, lo único correcto es rotarlo: genera una clave nueva e invalida la vieja. Limpiar el historial no basta porque no sabes quién lo clonó. Anota la rotación como tarea.',
        'Repasa tus llamadas al logger. Sustituye cualquier nombre, correo, teléfono o token por un identificador. Añade un registro de eventos de seguridad: inicio de sesión correcto, fallido, y acceso denegado, siempre con identificadores.'
      ],
      vet: [
        'Crea en VetCare un archivo .env.example con todas las claves que necesita la aplicación y valores de ejemplo vacíos, para que cualquiera sepa qué configurar sin que nadie suba un valor real.',
        'Añade a docs/seguridad.md una sección "Secretos" con la lista de secretos que usa VetCare, dónde vive cada uno en desarrollo y en producción, y cada cuánto se rota.'
      ],
      edge: [
        'Borrar un secreto en un commit nuevo no lo elimina: sigue en el historial y en todos los clones. Si estuvo publicado, considera que está comprometido y rótalo, aunque reescribas el historial después.',
        'Las excepciones sin filtrar son una fuga: un stack trace o un error de base de datos devuelto al cliente revela estructura interna. En producción devuelve siempre problem details genéricos y guarda el detalle solo en tus registros.',
        'Los registros también son datos personales. Si guardas correos o diagnósticos de pacientes en texto plano en un sistema de logs sin control de acceso, has creado una copia de tu base sin proteger.'
      ],
      quiz: [
        { q: '¿Por qué no basta con borrar un secreto del código y hacer commit?', a: 'Porque git guarda todo el historial: el valor sigue siendo recuperable en los commits anteriores y en cualquier clon que alguien ya tenga. La única acción que realmente cierra el riesgo es rotar el secreto para que el valor filtrado deje de servir.' },
        { q: '¿Cómo funciona la configuración por capas en ASP.NET Core y por qué ayuda con los secretos?', a: 'Los proveedores se aplican en orden y el último gana, de modo que appsettings.json aporta la estructura, user-secrets la rellena en desarrollo y las variables de entorno en producción. El código pide siempre la misma clave y el valor real nunca necesita estar en un archivo versionado.' },
        { q: '¿Qué información no debe aparecer nunca en un registro y qué pones en su lugar?', a: 'Contraseñas, tokens, cabeceras de autorización, números de tarjeta y datos personales como correos, teléfonos o diagnósticos. En su lugar registras identificadores opacos, que te permiten reconstruir lo que pasó consultando la base con los permisos adecuados.' },
        { q: '¿Por qué devolver el stack trace al cliente es un problema de seguridad?', a: 'Porque revela rutas, nombres de clases, versiones de librerías y a veces fragmentos de consultas, que es exactamente el mapa que un atacante necesita para elegir su siguiente intento. El detalle debe ir a tus registros y al cliente solo un mensaje genérico con un identificador de correlación.' }
      ],
      out: 'Cero secretos en el repositorio, user-secrets configurado, .env.example creado y los registros revisados sin datos personales.',
      file: 'docs/seguridad.md'
    },
    {
      t: 'Modelo de amenazas de VetCare (examen de la semana)',
      obj: 'Pensar como atacante sobre tu propio sistema de forma estructurada, priorizar lo encontrado y dejar un documento que puedas defender en una entrevista.',
      why: 'Encontrar fallos sueltos es útil; tener un método para buscarlos es lo que te hace fiable. Un modelo de amenazas escrito es, además, uno de los artefactos que más impresiona en una entrevista porque casi nadie lo lleva.',
      study: { r: 0, what: 'Repasa el índice completo del OWASP Top 10, solo los diez títulos. Unos 5 minutos. Hoy no lees para aprender: lees para usarlo como lista de comprobación contra VetCare, categoría por categoría.',
        pasos: [
          'Abre "Top 10:2025 List" y lee los diez títulos (~3 min).',
          'Para cada categoría escribe una línea: ¿aplica a VetCare? ¿dónde?',
          'Marca las tres que más riesgo suponen para una clínica y abre su página para leer How to prevent.',
          'Usa esa lista como esqueleto del modelo de amenazas de hoy.'
        ] },
      ex: {
        title: 'Un modelo de amenazas en cuatro preguntas',
        body: `# Modelo de amenazas - VetCare
Fecha: 2026-xx-xx

## 1. Qué estamos construyendo
Superficie expuesta:
  - API pública en /api/*            (internet)
  - Web React                        (internet)
  - PostgreSQL                       (solo red interna)
  - Pasarela de pagos                (saliente, terceros)

Activos que importan, ordenados:
  1. Historial clínico de pacientes  -> datos de salud
  2. Datos de contacto de dueños     -> datos personales
  3. Credenciales y tokens           -> acceso a todo lo anterior
  4. Facturación                     -> dinero

Actores:
  - Recepción, Veterinario, Administrador  (autenticados)
  - Dueño                                  (autenticado, solo lo suyo)
  - Anónimo                                (solo login)
  - Atacante externo                       (lo que nos ocupa)

## 2. Qué puede salir mal
| # | Amenaza                                   | OWASP | Impacto | Prob. | Prioridad |
|---|-------------------------------------------|-------|---------|-------|-----------|
| 1 | Un dueño lee el historial de otra mascota | A01   | Alto    | Media | 1         |
| 2 | XSS almacenado en nombre de mascota       | A05   | Alto    | Baja  | 2         |
| 3 | Fuerza bruta sobre /api/auth/login        | A07   | Medio   | Alta  | 2         |
| 4 | Dependencia con CVE publicado             | A03   | Alto    | Media | 1         |
| 5 | Secreto en el historial de git            | A02   | Crítico | Baja  | 1         |
| 6 | Enumeración de usuarios por el login      | A07   | Bajo    | Alta  | 3         |

## 3. Qué vamos a hacer
| # | Mitigación                                   | Estado    |
|---|----------------------------------------------|-----------|
| 1 | Filtro de propiedad dentro de la consulta    | Hecho S18 |
| 2 | React escapa + CSP sin unsafe-inline         | Hecho S19 |
| 3 | Rate limit 5/min por IP en login             | Hecho S18 |
| 4 | Auditoría de dependencias en CI              | Hecho S19 |
| 5 | Secretos en user-secrets + rotación          | Hecho S19 |
| 6 | Error de login idéntico en ambos casos       | Hecho S18 |

## 4. ¿Lo hicimos bien?
Evidencia por mitigación: test automatizado, captura del ataque
fallando, o línea de CI. Sin evidencia, la fila no cuenta.

Riesgos aceptados conscientemente:
  - Sin 2FA: equipo pequeño, red interna. Revisar en 6 meses.

(Los códigos son los de la edición 2025: A01 control de acceso,
A02 configuración, A03 cadena de suministro, A05 inyección, que en
2025 incluye el XSS, A07 autenticación.)`
      },
      steps: [
        'Crea docs/modelo-amenazas.md y rellena la sección 1 con tu sistema real: superficie expuesta, activos ordenados por valor y actores. Tardas quince minutos y es la parte que más claridad te da.',
        'Recorre las diez categorías del OWASP Top 10 una por una preguntándote si aplica a VetCare. Apunta cada amenaza encontrada en la tabla de la sección 2 con impacto y probabilidad. No te saltes ninguna categoría aunque creas que no aplica: escribir "no aplica porque..." también es un resultado.',
        'Ataca de verdad las tres amenazas con prioridad más alta. Usa curl, no la interfaz. Si el ataque funciona, tienes trabajo; si falla, guarda la respuesta como evidencia y pégala en el documento.',
        'Completa la sección 3 con el estado real de cada mitigación. Si algo está pendiente, escríbelo como pendiente: un modelo de amenazas que miente es peor que no tenerlo.',
        'Ejecuta la lista final de comprobación de abajo entera y marca cada punto con evidencia concreta: nombre del test, comando ejecutado o captura. Anota en la sección 4 los riesgos que aceptas conscientemente y por qué.',
        'Explícale el documento en voz alta a alguien, o a la pared, en tres minutos: qué protege VetCare, cuál fue la amenaza más seria que encontraste y cómo la cerraste. Esa es literalmente la respuesta a "háblame de seguridad en tu proyecto".'
      ],
      vet: [
        'Lista final de comprobación, trece puntos: ninguna consulta construye SQL por concatenación; ningún dangerouslySetInnerHTML con datos de usuario; CSP activa sin violaciones; todos los enlaces dinámicos validan esquema; los tres endpoints críticos validan entrada y devuelven 422; hay límite de tamaño de cuerpo; dotnet list package --vulnerable limpio; npm audit sin altos; auditoría en CI; cero secretos en el repositorio y en el historial; los registros no contienen datos personales ni tokens; las excepciones no se filtran al cliente; las cabeceras de seguridad de la semana 18 siguen presentes.',
        'Añade docs/modelo-amenazas.md y docs/dependencias.md al índice de tu README para que se vean al abrir el repositorio.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/modelo-amenazas.md dentro de una semana.'
      ],
      edge: [
        'Un modelo de amenazas es un documento vivo, no un entregable. Si lo escribes y no lo tocas en un año, describe un sistema que ya no existe. Revísalo cada vez que añadas una superficie nueva.',
        'Priorizar por impacto por probabilidad es mejor que arreglarlo todo: el tiempo es finito y una vulnerabilidad crítica abierta pesa más que cinco menores cerradas.',
        'Aceptar un riesgo conscientemente y por escrito es una decisión profesional válida. Ignorarlo sin escribirlo no lo es, porque nadie puede revisar una decisión que no existe en ningún sitio.'
      ],
      quiz: [
        { q: '¿Cuáles son las cuatro preguntas de un modelo de amenazas?', a: 'Las cuatro preguntas: ¿qué estamos construyendo?, ¿qué puede salir mal?, ¿qué vamos a hacer al respecto? y ¿lo hicimos bien? La última es la que más se olvida y la única que convierte una lista de buenas intenciones en algo verificable.' },
        { q: '¿Por qué priorizar amenazas en vez de arreglarlas todas?', a: 'Porque el tiempo es limitado y las amenazas no valen lo mismo: una que expone historiales clínicos a cualquiera pesa mucho más que una fuga de información menor. Priorizar por impacto y probabilidad hace que el esfuerzo que tienes vaya donde más reduce el riesgo.' },
        { q: '¿Qué significa aceptar un riesgo y cómo se hace bien?', a: 'Significa decidir conscientemente no mitigarlo porque el coste no compensa frente al impacto esperado. Se hace bien cuando queda escrito con la razón y una fecha de revisión, de forma que la decisión pueda discutirse más adelante en vez de ser un olvido silencioso.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que la seguridad real no está en la puerta de entrada sino en los bordes que no vigilas: el dato que se vuelve código, el campo que nunca limitaste, la librería que no sabías que tenías y el secreto que creíste haber borrado, y que la única forma de encontrarlos es buscarlos con método en lugar de esperar a que alguien los encuentre por ti.' }
      ],
      out: 'docs/modelo-amenazas.md completo con las cuatro secciones, los tres ataques prioritarios ejecutados con evidencia, y la lista de trece puntos verificada.',
      file: 'docs/modelo-amenazas.md'
    }
  ]
}
]);
