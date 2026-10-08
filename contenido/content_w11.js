window.WEEKS = (window.WEEKS || []).concat([
{
  n: 11,
  phase: 'Backend y APIs',
  title: 'HTTP y REST: el idioma de la web',
  idea: 'Antes de escribir una sola línea de ASP.NET necesitas entender el protocolo. Una API bien diseñada se explica sola: la URL dice qué recurso es, el verbo dice qué le haces y el código de estado dice cómo salió. Esta semana aprendes ese idioma y diseñas el contrato completo de VetCare.',
  res: [
    { t: 'MDN — HTTP overview',
      u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
      note: 'La mejor explicación gratuita del protocolo. Días 1 y 2 salen de aquí.' },
    { t: 'MDN — HTTP response status codes',
      u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
      note: 'Lista completa con explicación de cada código. Tenla abierta cada vez que diseñes un endpoint.' },
    { t: 'Microsoft — RESTful web API design',
      u: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      note: 'Guía de diseño con reglas concretas de nombres, filtros, paginación y versionado.' },
    { t: 'RFC 9457 — Problem Details for HTTP APIs',
      u: 'https://www.rfc-editor.org/rfc/rfc9457.html',
      note: 'El formato estándar de errores que ASP.NET Core usa por defecto. Léelo en el día 5.' },
    { t: 'OpenAPI Initiative — Learn OpenAPI', u: 'https://learn.openapis.org/', note: 'La guía oficial para escribir un documento OpenAPI.' }
  ],
  days: [
    {
      t: 'Anatomía de una petición HTTP',
      obj: 'Entender qué viaja exactamente entre cliente y servidor.',
      why: 'Cuando algo falla en producción, la primera herramienta es mirar la petición cruda. Si sabes leer headers y cuerpo, depuras en minutos lo que a otros les toma horas.',
      study: { r: 0, what: 'Lee "Overview of HTTP" completo y la sección "HTTP Messages". Unos 18 minutos. Busca una cosa: qué significa que HTTP sea un protocolo sin estado.',
        pasos: [
          'Lee "Components of HTTP-based systems" (~4 min): cliente, servidor y proxies.',
          'Lee "Basic aspects of HTTP", en especial "HTTP is stateless, but not sessionless" (~4 min).',
          'Lee "HTTP flow" (~3 min): los pasos de una petición completa.',
          'Lee "HTTP Messages" con "Requests" y "Responses" (~5 min) y copia las partes de cada mensaje.',
          'Abre las herramientas de desarrollo del navegador, pestaña Red, recarga una página y localiza en una petición real cada parte que copiaste.'
        ] },
      ex: { title: 'Petición y respuesta crudas', body: `PETICIÓN

POST /api/citas HTTP/1.1
Host: api.vetcare.local
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOi...
Idempotency-Key: 7f3c1b2a-9d44-4c21-8f0e-1a2b3c4d5e6f
Content-Length: 206

{
  "mascotaId": "0b8f1e2c-6a3d-4f7e-9c21-5d4b3a2f1e0d",
  "veterinarioId": "8d2e6b1a-3c4f-4a5b-8e7d-2f1a0c9b8e7d",
  "inicio": "2026-03-10T10:00:00Z",
  "duracionMinutos": 30,
  "motivo": "Control anual"
}

Partes:
  línea de petición : método + ruta + versión
  headers           : metadatos (quién soy, qué acepto, qué envío)
  línea en blanco   : separa headers del cuerpo
  cuerpo            : los datos

RESPUESTA

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/citas/5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f
Date: Tue, 10 Mar 2026 09:12:44 GMT

{
  "id": "5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f",
  "estado": "agendada",
  "inicio": "2026-03-10T10:00:00Z"
}

SIN ESTADO

El servidor no recuerda nada entre peticiones.
Cada petición debe traer todo lo necesario,
incluida la identidad (por eso va el token en cada una).
Eso es lo que permite tener diez servidores detrás
de un balanceador sin que el usuario note nada.

HEADERS QUE VAS A USAR SIEMPRE

Content-Type    qué formato envío
Accept          qué formato quiero recibir
Authorization   credencial
Location        dónde quedó el recurso creado
ETag            versión del recurso (cache y concurrencia)
Cache-Control   cuánto se puede cachear` },
      steps: [
        'Instala curl y haz una petición verbosa a una API pública: curl -v https://api.github.com/users/octocat',
        'Identifica en la salida la línea de petición, los headers de ida, el código de estado y los headers de vuelta.',
        'Repite con -H "Accept: application/xml" y observa qué pasa: muchas APIs solo saben JSON y lo ignoran o responden 406 Not Acceptable.',
        'Abre las DevTools del navegador en la pestaña Network, entra a cualquier sitio y examina tres peticiones distintas.',
        'Escribe en docs/api-notes.md la anatomía completa de una petición con tus propias palabras.'
      ],
      vet: [
        'Lista en docs/api-notes.md los headers que VetCare va a usar y para qué sirve cada uno.',
        'Decide el formato de fechas de la API: ISO 8601 en UTC, siempre.'
      ],
      edge: [
        'Content-Type describe lo que envías; Accept describe lo que quieres recibir. Confundirlos es un error común.',
        'HTTP es sin estado, pero las cookies y los tokens simulan estado. El servidor sigue sin recordar nada por sí mismo.',
        'Los headers no distinguen mayúsculas de minúsculas. Por convención se escriben con la primera letra en mayúscula, aunque en HTTP/2 y HTTP/3 viajan en minúsculas.'
      ],
      quiz: [
        { q: '¿Qué significa que HTTP sea sin estado?', a: 'Que el servidor no guarda información entre peticiones, así que cada una debe incluir todo lo necesario para entenderse por sí sola. Eso permite escalar horizontalmente porque cualquier servidor puede atender cualquier petición.' },
        { q: '¿Cuál es la diferencia entre Content-Type y Accept?', a: 'Content-Type declara el formato del cuerpo que estás enviando. Accept declara los formatos que el cliente puede procesar en la respuesta. Uno describe lo que mandas y el otro lo que esperas.' },
        { q: '¿Para qué sirve el header Location en una respuesta 201?', a: 'Indica la URL del recurso que se acaba de crear, para que el cliente pueda consultarlo sin tener que construir la URL a mano a partir del id.' },
        { q: '¿Por qué la autenticación viaja en cada petición y no una sola vez?', a: 'Porque el protocolo no mantiene sesión entre peticiones. Enviar la credencial siempre es lo que permite que cualquier instancia del servidor pueda atender sin compartir estado de sesión.' }
      ],
      out: 'docs/api-notes.md con la anatomía de una petición y los headers que usará VetCare.',
      file: 'docs/api-notes.md'
    },
    {
      t: 'Métodos y códigos de estado',
      obj: 'Elegir el verbo y el código correcto para cada operación.',
      why: 'Devolver 200 con un cuerpo que dice "error" es el pecado más común de las APIs mal hechas. Usar bien los códigos hace que clientes, proxies y monitoreo funcionen sin configuración extra.',
      study: { r: 1, what: 'Lee la lista completa de códigos, al menos los 2xx, 4xx y 5xx. Unos 18 minutos. Busca una cosa: la diferencia entre 401 y 403, y entre 400 y 422.',
        pasos: [
          'Lee "Successful responses" (~4 min): 200, 201, 204 y cuándo usar cada uno.',
          'Lee "Client error responses" (~8 min): 400, 401, 403, 404, 409, 422 y 429.',
          'Lee "Server error responses" (~3 min): 500, 502, 503 y 504.',
          'Escribe la diferencia entre 401 y 403, y entre 400 y 422, con un ejemplo de VetCare cada una.',
          'Haz una tabla con cada endpoint previsto de VetCare y el código de éxito y de error principal.'
        ] },
      ex: { title: 'Verbos, idempotencia y códigos', body: `LOS VERBOS

GET     leer. No cambia nada. Seguro e idempotente.
POST    crear o ejecutar acción. NO idempotente.
PUT     reemplazar completo. Idempotente.
PATCH   modificar parcial. No necesariamente idempotente.
DELETE  borrar. Idempotente.

IDEMPOTENTE = repetir la misma petición deja el sistema
en el mismo estado. DELETE dos veces: el recurso sigue
borrado. POST dos veces: dos citas creadas.

Por eso si el usuario hace doble clic en "Agendar",
necesitas un Idempotency-Key o una constraint única.

CÓDIGOS QUE DEBES USAR

200 OK                 lectura o actualización correcta
201 Created            recurso creado (manda Location)
202 Accepted           aceptado, se procesa después
204 No Content         correcto y no hay cuerpo (DELETE)

400 Bad Request        el cuerpo no se entiende (JSON roto)
401 Unauthorized       no sé quién eres (falta/expiró token)
403 Forbidden          sé quién eres y no puedes
404 Not Found          no existe ese recurso
409 Conflict           choca con el estado actual (solape)
422 Unprocessable      se entiende pero viola una regla
429 Too Many Requests  límite de peticiones superado

500 Internal Error     fallo tuyo no previsto
503 Service Unavailable  dependencia caída o mantenimiento

LA TRAMPA

HTTP/1.1 200 OK
{ "ok": false, "error": "La cita se solapa" }

Esto rompe todo: el monitoreo cree que va bien,
el cliente tiene que parsear el cuerpo para saber si falló,
y los reintentos automáticos no se activan.

Correcto:
HTTP/1.1 409 Conflict
{ "title": "Horario no disponible", ... }

401 vs 403
401 -> no te identificaste o tu token venció. Reintenta con credencial.
403 -> te identificaste bien pero no tienes permiso. Reintentar no sirve.

400 vs 422
400 -> no pude ni leer tu petición (JSON malformado, tipo incorrecto)
422 -> la leí bien pero rompe una regla de negocio` },
      steps: [
        'Haz una tabla en docs/api-notes.md con las diez operaciones de VetCare: operación, verbo, ruta, código de éxito, códigos de error posibles.',
        'Para cada operación escribe si es idempotente y por qué.',
        'Busca en tu tabla todo lo que pensabas resolver con POST y pregunta si PUT o DELETE son más correctos.',
        'Define qué hace VetCare cuando alguien agenda una cita solapada: debe ser 409, no 400 ni 200.',
        'Prueba los códigos con curl contra httpbin: curl -i https://httpbin.org/status/409'
      ],
      vet: [
        'Operaciones de VetCare: listar citas, ver cita, crear cita, reprogramar, cancelar, listar mascotas, ver historial, crear visita, listar facturas, marcar factura pagada.',
        'Cancelar una cita es un cambio de estado, no un DELETE: usa POST /api/citas/{id}/cancelacion o PATCH con el estado.'
      ],
      edge: [
        'DELETE de algo que ya no existe puede devolver 204 o 404; elige uno y sé consistente. 204 es más amable con reintentos.',
        'No uses 500 para errores de validación: 5xx significa que la culpa es tuya y dispara alertas y reintentos innecesarios.',
        'PUT reemplaza el recurso completo: el cliente manda la representación entera. Si faltan campos, lo honesto es rechazar la petición, nunca dejarlos intactos en silencio. Para cambiar solo dos campos existe PATCH.'
      ],
      quiz: [
        { q: '¿Qué significa que un método sea idempotente y por qué importa?', a: 'Que repetir la petición deja el sistema en el mismo estado. Importa porque permite que clientes, proxies y balanceadores reintenten con seguridad cuando hay un timeout de red sin provocar duplicados.' },
        { q: '¿Diferencia entre 401 y 403?', a: '401 significa que el servidor no sabe quién eres porque falta la credencial o expiró, así que reintentar con un token válido puede funcionar. 403 significa que te identificó correctamente pero no tienes permiso, y reintentar no cambiará nada.' },
        { q: '¿Por qué es malo devolver 200 con un campo error en el cuerpo?', a: 'Porque el código de estado es la señal que entienden proxies, caches, clientes HTTP y el monitoreo. Si siempre devuelves 200, nada de esa infraestructura puede distinguir éxito de fallo y los errores quedan invisibles en las métricas.' },
        { q: '¿Qué código usarías para una cita que se solapa con otra?', a: '409 Conflict, porque la petición está bien formada y es válida en sí misma pero choca con el estado actual del sistema. 422 también es defendible si lo tratas como violación de regla, pero 409 expresa mejor el conflicto con otro recurso.' }
      ],
      out: 'Tabla completa de operaciones, verbos y códigos en docs/api-notes.md.',
      file: 'docs/api-notes.md'
    },
    {
      t: 'Diseño de recursos y URLs',
      obj: 'Nombrar rutas que se entiendan sin documentación.',
      why: 'Las URLs son la interfaz pública de tu API y, a diferencia del código, son casi imposibles de cambiar después. Diseñarlas bien la primera vez ahorra años de deuda.',
      study: { r: 2, what: 'Lee las secciones "Define RESTful web API resource URIs" y "Define RESTful web API methods". Unos 18 minutos. Busca una cosa: por qué se recomiendan sustantivos en plural y no verbos.',
        pasos: [
          'Lee "RESTful web API design concepts" (~4 min): recursos, URIs y representaciones.',
          'Lee "Define RESTful web API resource URIs" y "Resource URI naming conventions" (~6 min): sustantivos en plural, sin verbos.',
          'Lee "Define RESTful web API methods" y dentro "HTTP request methods" (~6 min): qué hace cada verbo sobre una colección y sobre un elemento.',
          'Escribe las URIs de VetCare para mascotas, dueños y citas, incluida una relación anidada (las citas de una mascota).'
        ] },
      ex: { title: 'URLs que se explican solas', body: `MAL (verbos en la URL, el verbo ya es el método HTTP)

POST /api/getCitas
POST /api/crearCita
POST /api/deleteCita?id=5
GET  /api/obtenerMascotasDelDueno?duenoId=3

BIEN (sustantivos en plural, jerarquía clara)

GET    /api/citas                   listar
GET    /api/citas/{id}              ver una
POST   /api/citas                   crear
PUT    /api/citas/{id}              reemplazar
PATCH  /api/citas/{id}              modificar parcial
DELETE /api/citas/{id}              borrar

({id} es el UUID de la cita, por ejemplo
/api/citas/5e1d7c9a-2b4f-4e8a-9d3c-7a6b5c4d3e2f)

ANIDAMIENTO: solo cuando el hijo no existe sin el padre

GET  /api/duenos/{id}/mascotas      mascotas de ese dueño
GET  /api/mascotas/{id}/visitas     historial de esa mascota
POST /api/mascotas/{id}/visitas     registrar visita

No anides más de dos niveles.
Esto es ilegible y frágil:
  /api/duenos/{id}/mascotas/{id}/visitas/{id}/documentos/{id}

Mejor:
  /api/visitas/{id}/documentos
  o directamente /api/documentos/{id}

ACCIONES QUE NO SON CRUD

A veces una operación no es crear ni borrar.
Dos opciones aceptadas:

POST  /api/citas/{id}/cancelacion       (sub-recurso)
PATCH /api/citas/{id}  { "estado": "cancelada" }

Elige una convención y mantenla en toda la API.

FILTROS, ORDEN Y PAGINACIÓN: en query string

GET /api/citas?veterinarioId={id}&desde=2026-03-01&estado=agendada
GET /api/citas?orden=inicio&direccion=desc
GET /api/citas?limite=20&cursor=eyJpZCI6OTgxfQ

La ruta identifica QUÉ recurso.
La query string dice CUÁLES de ese recurso.

OTRAS REGLAS

- Plural siempre: /citas, no /cita
- Minúsculas y guion medio: /lineas-factura
- Sin extensión: nada de /citas.json, usa Accept
- Sin versión del lenguaje ni detalles internos en la URL
- Versión de la API: /api/v1/citas  o un header propio
  (por ejemplo Api-Version: 1)` },
      steps: [
        'Escribe en docs/api-contract.md la lista completa de rutas de VetCare con su verbo y una frase de qué hace.',
        'Revisa cada una: ¿tiene algún verbo en la ruta? ¿Está en plural? ¿Anida más de dos niveles?',
        'Define la query string de /api/citas: qué filtros acepta, cómo se ordena, cómo se pagina.',
        'Decide la convención para acciones no CRUD (cancelar, confirmar, marcar pagada) y aplícala a todas.',
        'Dale tu lista de rutas a alguien o léela en voz alta: si no se entiende sin explicación, renombra.'
      ],
      vet: [
        'Recursos de VetCare: dueños, mascotas, veterinarios, citas, visitas, vacunas, documentos, facturas.',
        'Anida solo: /duenos/{id}/mascotas, /mascotas/{id}/visitas, /mascotas/{id}/vacunas, /facturas/{id}/lineas.'
      ],
      edge: [
        'Una URL publicada es un contrato. Cambiarla rompe clientes, así que piensa el nombre como si fuera permanente.',
        'VetCare usa UUID (semana 3), así que sus ids no se pueden adivinar ni revelan cuántos registros hay. Aun así, cada endpoint debe comprobar que quien pregunta tiene permiso: un id difícil de adivinar no es seguridad.',
        'Evita endpoints que devuelvan cosas distintas según un parámetro. Dos comportamientos son dos endpoints.'
      ],
      quiz: [
        { q: '¿Por qué no se ponen verbos en la URL?', a: 'Porque el verbo ya lo aporta el método HTTP. Poner el verbo en la ruta duplica la información y rompe la uniformidad que permite a caches, proxies y clientes entender la operación sin leer documentación.' },
        { q: '¿Cuándo conviene anidar rutas?', a: 'Cuando el recurso hijo solo tiene sentido dentro del padre, como las líneas de una factura. Si el hijo tiene identidad propia y se consulta solo, es mejor darle una ruta de primer nivel.' },
        { q: '¿Qué va en la ruta y qué va en la query string?', a: 'La ruta identifica el recurso o la colección. La query string selecciona dentro de esa colección: filtros, orden, paginación y campos. Un filtro nunca debe ser parte de la ruta.' },
        { q: '¿Cómo modelas una acción que no es CRUD, como cancelar una cita?', a: 'O como un sub-recurso que representa el evento, con POST a /citas/{id}/cancelacion, o como un PATCH que cambia el campo estado. Ambas son válidas; lo importante es usar la misma convención en toda la API.' }
      ],
      out: 'docs/api-contract.md con todas las rutas, verbos y reglas de query string.',
      file: 'docs/api-contract.md'
    },
    {
      t: 'Representaciones: DTOs y contratos de datos',
      obj: 'Definir exactamente qué JSON entra y sale de cada endpoint.',
      why: 'Devolver tus entidades de dominio directamente es el error que más filtraciones de datos causa. Separar el modelo interno del contrato público es práctica estándar en todo equipo serio.',
      study: { r: 2, what: 'Lee la sección "Resource MIME types" y "Implement data pagination and filtering". Unos 15 minutos. Busca una cosa: por qué la respuesta de una colección debe envolver los datos en un objeto.',
        pasos: [
          'Lee "Resource MIME types" (~3 min): Content-Type y Accept.',
          'Lee "Implement data pagination and filtering" (~5 min): limit, offset y por qué hay que poner un máximo.',
          'Lee "Support partial responses" (~2 min) solo para saber que existe.',
          'Escribe el JSON de entrada y de salida de crear cita, separando lo que manda el cliente de lo que genera el servidor (id, fechas de creación).'
        ] },
      ex: { title: 'DTO de entrada y de salida', body: `POR QUÉ NO DEVOLVER LA ENTIDAD

public class Dueno
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Email { get; set; }
    public string HashPassword { get; set; }   // se filtra
    public string NotasInternas { get; set; }  // se filtra
    public List<Mascota> Mascotas { get; set; } // ciclo infinito
}

Si serializas esto: expones el hash, las notas internas
y provocas una referencia circular Dueno -> Mascota -> Dueno.

Además, cualquier rename en la entidad rompe a los clientes.

DTO DE SALIDA (lo que el mundo ve)

public record CitaResponse(
    Guid Id,
    DateTimeOffset Inicio,
    DateTimeOffset Fin,
    string Estado,
    MascotaResumen Mascota,
    VeterinarioResumen Veterinario);

public record MascotaResumen(Guid Id, string Nombre, string Especie);

DTO DE ENTRADA (lo que el mundo puede mandar)

public record CrearCitaRequest(
    Guid MascotaId,
    Guid VeterinarioId,
    DateTimeOffset Inicio,
    int DuracionMinutos,
    string? Motivo);

Fíjate que el cliente NO manda Id ni Estado:
esos los decide el servidor. Si los aceptaras,
alguien podría crear una cita ya "atendida".

RESPUESTA DE COLECCIÓN: siempre envuelta

MAL
[ { "id": "5e1d7c9a-..." }, { "id": "a41c..." } ]

BIEN
{
  "datos": [ { "id": "5e1d7c9a-..." }, { "id": "a41c..." } ],
  "paginacion": {
    "limite": 20,
    "siguienteCursor": "eyJpZCI6OTgxfQ",
    "hayMas": true
  }
}

Envolver te permite agregar metadatos después
sin romper a los clientes existentes.

CONVENCIONES DE JSON
- camelCase en los nombres de propiedad
- fechas en ISO 8601 con zona: 2026-03-10T10:00:00Z
- dinero como string decimal o como entero de centavos,
  nunca como float
- enums como string legible ("agendada"), no como número` },
      steps: [
        'Escribe en docs/api-contract.md el JSON de ejemplo de petición y respuesta para cada endpoint.',
        'Revisa cada respuesta: ¿hay algún campo que el cliente no necesita? Quítalo.',
        'Revisa cada petición: ¿hay algún campo que el cliente no debería poder decidir? Quítalo.',
        'Define el sobre de las colecciones con paginación y úsalo en todos los listados.',
        'Define el formato de fechas, dinero y enums una sola vez y aplícalo en todo el contrato.'
      ],
      vet: [
        'VetCare debe exponer CitaResponse, MascotaResponse, DuenoResponse, VisitaResponse, FacturaResponse.',
        'Ningún DTO debe incluir hash de contraseña, notas internas ni ids de otra tabla sin contexto.'
      ],
      edge: [
        'Un campo que agregas a una respuesta es fácil de quitar hoy e imposible mañana: no agregues nada "por si acaso".',
        'Devolver una lista desnuda en la raíz del JSON es un riesgo de seguridad antiguo en navegadores y además impide agregar metadatos.',
        'Si el DTO de salida es idéntico a la entidad hoy, igual sepáralos: el día que la entidad cambie no querrás cambiar el contrato público.'
      ],
      quiz: [
        { q: '¿Por qué no devolver entidades de dominio directamente?', a: 'Porque expone campos internos y sensibles, puede provocar ciclos de serialización, y ata el contrato público a tu modelo interno, de modo que cualquier refactor rompe a los clientes.' },
        { q: '¿Por qué el DTO de entrada no debe incluir el id ni el estado?', a: 'Porque son decisiones del servidor. Si el cliente puede enviarlos, puede crear recursos con identidad elegida o saltarse el flujo de estados, que es un fallo de seguridad y de consistencia.' },
        { q: '¿Por qué envolver las colecciones en un objeto?', a: 'Porque permite agregar metadatos como paginación, totales o avisos sin cambiar la forma de la respuesta, que sería un cambio rompedor si los datos estuvieran en la raíz como arreglo.' },
        { q: '¿Cómo se representa el dinero en JSON y por qué?', a: 'Como string decimal o como entero de centavos, nunca como número de punto flotante, porque JSON no distingue tipos numéricos y muchos parsers (el de JavaScript, por ejemplo) lo convierten a double, perdiendo precisión en los centavos.' }
      ],
      out: 'docs/api-contract.md con el JSON de entrada y salida de cada endpoint.',
      file: 'docs/api-contract.md'
    },
    {
      t: 'Errores, validación e idempotencia',
      obj: 'Diseñar respuestas de error útiles y operaciones seguras ante reintentos.',
      why: 'Un error bien formado ahorra horas de soporte. Y la idempotencia es lo que evita que un doble clic o un reintento de red cobre dos veces al cliente.',
      study: { r: 3, what: 'Lee el RFC 9457 hasta la sección 3.1. Unos 15 minutos. Busca una cosa: cuáles son los campos estándar de un objeto problem details.',
        pasos: [
          'Lee "1. Introduction" (~3 min): por qué hace falta un formato estándar de error.',
          'Lee "3. The Problem Details JSON Object" con su ejemplo (~3 min).',
          'Lee "3.1. Members of a Problem Details Object": "type", "status", "title", "detail" e "instance" (~5 min).',
          'Lee "3.2. Extension Members" (~2 min): así se añaden los errores por campo.',
          'Escribe el problem details de VetCare para una cita que se solapa con otra.'
        ] },
      ex: { title: 'Problem Details e Idempotency-Key', body: `ERROR MAL FORMADO

HTTP/1.1 400 Bad Request
"Error"

El cliente no sabe qué campo falló, ni si reintentar,
ni qué mostrarle al usuario.

ERROR SEGÚN RFC 9457 (el formato que genera ASP.NET Core;
ojo: por defecto ASP.NET Core responde 400 a la validación,
y en VetCare usamos 422 para reglas, como decidiste el día 2)

HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.vetcare.local/errores/validacion",
  "title": "Uno o más campos son inválidos",
  "status": 422,
  "detail": "Revisa los campos indicados en errors",
  "instance": "/api/citas",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "errors": {
    "inicio": ["La fecha debe ser futura"],
    "duracionMinutos": ["Debe estar entre 10 y 180"]
  }
}

Campos del estándar:
type     URI que identifica el TIPO de error (estable)
title    resumen legible, igual para todos los de ese tipo
status   el código HTTP, repetido para clientes que lo pierden
detail   explicación de ESTA ocurrencia concreta
instance URI de la petición que falló

traceId no es del estándar pero es oro: permite
cruzar el error del usuario con tus logs.

CONFLICTO DE NEGOCIO

HTTP/1.1 409 Conflict
{
  "type": "https://api.vetcare.local/errores/horario-ocupado",
  "title": "El veterinario ya tiene una cita en ese horario",
  "status": 409,
  "detail": "Conflicto con la cita 814 de 10:15 a 10:45",
  "instance": "/api/citas"
}

IDEMPOTENCIA EN POST

El cliente genera una clave única por intención:

POST /api/citas
Idempotency-Key: 7f3c1b2a-9d44-4c21-8f0e-1a2b3c4d5e6f

El servidor guarda clave -> respuesta.
Si llega la misma clave otra vez, devuelve la respuesta
guardada sin crear nada nuevo.

Así: el usuario hace doble clic, la red reintenta,
el móvil pierde cobertura y reenvía... una sola cita.

REGLA PARA MENSAJES DE ERROR
- Nunca incluyas stack traces ni SQL en la respuesta.
- Nunca digas "usuario no existe" en un login: di
  "credenciales inválidas" para no filtrar qué correos existen.
- Si incluye traceId, el usuario te lo puede dar y
  tú lo buscas en los logs.` },
      steps: [
        'Define en docs/api-contract.md el catálogo de errores de VetCare: una fila por tipo con type, title y status.',
        'Escribe el JSON completo de tres errores: validación 422, horario ocupado 409, no encontrado 404.',
        'Decide qué endpoints de VetCare necesitan Idempotency-Key. Como mínimo crear cita y registrar pago.',
        'Describe el flujo de idempotencia: dónde se guarda la clave, cuánto vive, qué pasa si llega la misma clave con cuerpo distinto.',
        'Revisa tus mensajes de error: ¿alguno filtra información interna? Reescríbelo.'
      ],
      vet: [
        'Tipos de error de VetCare: validación, horario-ocupado, recurso-no-encontrado, sin-permiso, límite-excedido.',
        'Todos los errores de VetCare incluyen traceId.'
      ],
      edge: [
        'Si llega la misma Idempotency-Key con un cuerpo distinto, responde 422: es un error del cliente, no una repetición.',
        'Las claves de idempotencia deben expirar (24 horas es típico) o la tabla crecerá sin límite.',
        'El campo type debe ser una URI estable que uses como identificador, no necesariamente una página que exista.'
      ],
      quiz: [
        { q: '¿Cuáles son los campos estándar de problem details?', a: 'type, title, status, detail e instance. type identifica la clase de error de forma estable, title la resume, status repite el código HTTP, detail explica esta ocurrencia concreta e instance apunta a la petición que falló.' },
        { q: '¿Cómo funciona una Idempotency-Key?', a: 'El cliente genera una clave única por intención y la envía en el header. El servidor guarda la asociación entre clave y respuesta, de modo que si la misma clave vuelve a llegar devuelve la respuesta original sin ejecutar la operación otra vez.' },
        { q: '¿Por qué un login fallido no debe decir si el usuario existe?', a: 'Porque permite enumerar cuentas: un atacante prueba correos y descubre cuáles están registrados. Un mensaje único de credenciales inválidas no revela esa información.' },
        { q: '¿Para qué sirve incluir traceId en el error?', a: 'Permite correlacionar lo que vio el usuario con los logs del servidor. El usuario reporta el id y tú encuentras la traza exacta sin tener que adivinar el momento ni el endpoint.' }
      ],
      out: 'Catálogo de errores y diseño de idempotencia en docs/api-contract.md.',
      file: 'docs/api-contract.md'
    },
    {
      t: 'Contrato completo y OpenAPI (examen de la semana)',
      obj: 'Escribir el contrato de la API de VetCare en formato OpenAPI y defenderlo.',
      why: 'OpenAPI es el formato que todo equipo usa para acordar la API antes de programarla. Saber escribirlo a mano te permite diseñar el contrato primero y generar clientes y documentación gratis.',
      study: { r: 4, what: 'Lee la introducción y la parte de la especificación sobre paths, operaciones y components. Unos 20 minutos. Luego abre https://editor.swagger.io para ver un OpenAPI de ejemplo. Busca una cosa: cómo se define un schema reutilizable en components.',
        pasos: [
          'Lee la página de inicio (~3 min): para qué sirve OpenAPI y quién lo usa.',
          'Desde el índice abre "The OpenAPI Specification Explained" y lee la parte de API endpoints (~5 min): paths y operaciones.',
          'Lee "Content of Message Bodies" y "Parameters and Payload of an Operation" (~5 min).',
          'Lee "Reusing Description" (~4 min): así se definen schemas en components y se reutilizan con $ref.',
          'Abre editor.swagger.io, borra el ejemplo y escribe el path de crear cita con un schema en components.'
        ] },
      ex: { title: 'OpenAPI mínimo pero real', body: `openapi: 3.1.0
info:
  title: VetCare API
  version: 1.0.0
  description: API de gestión de la clínica veterinaria VetCare

servers:
  - url: https://api.vetcare.local/api/v1

paths:
  /citas:
    get:
      summary: Listar citas
      parameters:
        - name: veterinarioId
          in: query
          schema: { type: string, format: uuid }
        - name: desde
          in: query
          schema: { type: string, format: date }
        - name: limite
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Lista paginada de citas
          content:
            application/json:
              schema:
                type: object
                properties:
                  datos:
                    type: array
                    items:
                      $ref: '#/components/schemas/CitaResponse'

    post:
      summary: Agendar una cita
      parameters:
        - name: Idempotency-Key
          in: header
          required: false
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CrearCitaRequest'
      responses:
        '201':
          description: Cita creada
          headers:
            Location:
              schema: { type: string }
        '409':
          description: Horario ocupado
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'

components:
  schemas:
    CrearCitaRequest:
      type: object
      required: [mascotaId, veterinarioId, inicio, duracionMinutos]
      properties:
        mascotaId:        { type: string, format: uuid }
        veterinarioId:    { type: string, format: uuid }
        inicio:           { type: string, format: date-time }
        duracionMinutos:  { type: integer, minimum: 10, maximum: 180 }
        motivo:           { type: string, maxLength: 500 }

    CitaResponse:
      type: object
      properties:
        id:     { type: string, format: uuid }
        inicio: { type: string, format: date-time }
        estado:
          type: string
          enum: [agendada, confirmada, atendida, cancelada]

    ProblemDetails:
      type: object
      properties:
        type:     { type: string }
        title:    { type: string }
        status:   { type: integer }
        detail:   { type: string }
        traceId:  { type: string }` },
      steps: [
        'Crea docs/openapi.yaml y escribe a mano al menos seis endpoints de VetCare con sus schemas.',
        'Reutiliza los schemas en components y referéncialos con $ref. No repitas definiciones.',
        'Pega tu archivo en https://editor.swagger.io y corrige todos los errores de validación.',
        'Mira el panel de la derecha del editor: es la documentación generada. Comprueba que se entiende sin tus explicaciones. (El botón Try it out todavía no funcionará: tu API aún no existe.)',
        'Defiende en voz alta durante cinco minutos: por qué elegiste cada verbo, cada código y cada forma de DTO.'
      ],
      vet: [
        'Endpoints mínimos en el openapi: listar citas, crear cita, ver cita, cancelar cita, listar mascotas de un dueño, historial de una mascota.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/openapi.yaml dentro de una semana.'
      ],
      edge: [
        'OpenAPI describe el contrato pero no lo hace cumplir: el servidor debe validar igual todo lo que llega.',
        'Mantener el yaml a mano se desincroniza fácil. En la semana 12 lo generarás desde el código de ASP.NET Core.',
        'No pongas ejemplos con datos reales de personas en el openapi: suele publicarse.'
      ],
      quiz: [
        { q: '¿Para qué sirve OpenAPI más allá de documentar?', a: 'Permite generar clientes en varios lenguajes, generar tests de contrato, validar peticiones automáticamente y acordar la API entre equipos antes de escribir código, de modo que front y back trabajen en paralelo.' },
        { q: '¿Qué gana usar $ref y components?', a: 'Evita repetir la misma definición en cada endpoint, así que un cambio en el schema se refleja en todas partes y el archivo se mantiene legible aunque la API crezca.' },
        { q: 'Si tengo OpenAPI, ¿necesito validar en el servidor?', a: 'Sí. OpenAPI es solo una descripción; cualquiera puede enviar una petición que no la respete. La validación en el servidor es la única garantía real.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que una buena API es un contrato explícito donde la URL identifica el recurso, el verbo dice la operación, el código de estado comunica el resultado a toda la infraestructura, el DTO protege el modelo interno y el error dice exactamente qué hacer a continuación.' }
      ],
      out: 'docs/openapi.yaml válido en editor.swagger.io con al menos seis endpoints.',
      file: 'docs/openapi.yaml'
    }
  ]
}
]);
