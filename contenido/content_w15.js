window.WEEKS = (window.WEEKS || []).concat([
{
  n: 15,
  phase: 'Arquitectura',
  title: 'Arquitectura: decidir dónde vive cada cosa',
  idea: 'Hasta ahora VetCare funciona, tiene tests y aguanta fallos. El problema que viene es otro: cuando el proyecto crece, nadie sabe dónde poner el código nuevo. La arquitectura no es dibujar cajas bonitas, es establecer reglas sobre quién puede depender de quién, para que una decisión de hoy no te bloquee dentro de seis meses. Esta semana aprendes a separar en capas, a invertir las dependencias hacia el dominio, a separar lecturas de escrituras cuando hace falta, y sobre todo a saber cuándo NO aplicar nada de esto.',
  res: [
    { t: 'Microsoft Learn — Common web application architectures',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures',
      note: 'Recorre monolito en capas, clean architecture y sus trade-offs con ejemplos de .NET. Es la referencia que mejor encaja con tu stack.' },
    { t: 'Alistair Cockburn — Hexagonal Architecture',
      u: 'https://alistair.cockburn.us/hexagonal-architecture/',
      note: 'El artículo original de puertos y adaptadores, escrito por su autor. Corto y conceptual: lee la intención, no la implementación.' },
    { t: 'Martin Fowler — CQRS',
      u: 'https://martinfowler.com/bliki/CQRS.html',
      note: 'Dos páginas que explican qué es CQRS y, más importante, cuándo NO usarlo. Fowler es explícito sobre el coste del patrón.' },
    { t: 'Microsoft Learn — Domain events: design and implementation',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation',
      note: 'Cómo modelar eventos de dominio en .NET sin acoplar el dominio a la infraestructura. Mira el ejemplo de cómo se recogen y se despachan.' },
    { t: 'Martin Fowler — Microservice Trade-Offs', u: 'https://martinfowler.com/articles/microservice-trade-offs.html', note: 'Qué ganas y qué pagas al separar módulos en servicios. La mejor defensa del monolito modular.' },
    { t: 'Michael Nygard — Documenting Architecture Decisions', u: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions', note: 'El artículo original que propone los ADR y su formato.' }
  ],
  days: [
    {
      t: 'Capas: la regla de la flecha',
      obj: 'Entender que una arquitectura en capas no se define por las carpetas sino por la dirección de las dependencias, y verificar esa dirección en tu propia solución.',
      why: 'Es la pregunta de arquitectura más común en entrevistas de nivel medio y la respuesta mediocre es "pues hay una capa de datos, una de negocio y una de presentación". La buena respuesta habla de la dirección de las flechas y de qué es lo que esa dirección te permite hacer.',
      study: { r: 0, what: 'Lee solo las secciones de aplicación monolítica en capas y de clean architecture. Unos 15 minutos. Busca una cosa: en el diagrama de clean architecture, hacia dónde apuntan todas las flechas y por qué eso es lo único que importa.',
        pasos: [
          'Lee "What is a monolithic application?" y "What are layers?" (~4 min).',
          'Lee la sección de aplicaciones N-Layer tradicionales (~4 min): la interfaz depende de la lógica y la lógica de los datos.',
          'Lee "Clean architecture" (~5 min) y mira su diagrama: las dependencias apuntan hacia el centro.',
          'Lee "Organizing code in Clean Architecture" (~3 min): Application Core, Infrastructure y UI Layer.',
          'Abre los .csproj de VetCare y dibuja las referencias entre proyectos. Comprueba que ninguna sale del núcleo hacia afuera.'
        ] },
      ex: {
        title: 'La misma funcionalidad con las flechas al revés',
        body: `// MAL: el dominio conoce la base de datos
// src/VetCare.Domain/Cita.cs
using Microsoft.EntityFrameworkCore;     // <-- ya perdiste

public class Cita
{
    public async Task<bool> HayHuecoAsync(VetCareDbContext db)   // <-- y más
    {
        return !await db.Citas.AnyAsync(c => c.VeterinarioId == VeterinarioId && ...);
    }
}
// Consecuencias: no puedes testear Cita sin una base de datos,
// no puedes cambiar de PostgreSQL sin tocar el dominio,
// y la regla de negocio está mezclada con la forma de guardarla.

// BIEN: el dominio define QUÉ necesita, la infraestructura dice CÓMO
// src/VetCare.Domain/IRepositorioCitas.cs   (el "puerto")
public interface IRepositorioCitas
{
    Task<bool> ExisteSolapeAsync(Guid vetId, DateTime inicio,
                                 DateTime fin, CancellationToken ct);
    Task AnadirAsync(Cita cita, CancellationToken ct);
}

// src/VetCare.Domain/ServicioAgenda.cs
public class ServicioAgenda
{
    private readonly IRepositorioCitas _repo;
    private readonly IRelojSistema _reloj;

    public async Task<Cita> AgendarAsync(Guid vetId, Guid mascotaId,
                                         DateTime inicio, CancellationToken ct)
    {
        if (inicio < _reloj.Ahora())
            throw new ReglaNegocioException("No se puede agendar en el pasado.");

        var fin = inicio.AddMinutes(30);
        if (await _repo.ExisteSolapeAsync(vetId, inicio, fin, ct))
            throw new HorarioOcupadoException(vetId, inicio);

        var cita = new Cita(vetId, mascotaId, inicio, fin, _reloj.Ahora());
        await _repo.AnadirAsync(cita, ct);
        return cita;
    }
}

// src/VetCare.Infrastructure/RepositorioCitasEf.cs   (el "adaptador")
public class RepositorioCitasEf : IRepositorioCitas { /* usa EF Core */ }

// La prueba definitiva, en el .csproj del dominio:
// <ItemGroup> ... ningún PackageReference a EF Core, Npgsql o ASP.NET
// Si el dominio no referencia nada de infraestructura, las flechas van bien.`
      },
      steps: [
        'Abre los cuatro .csproj de VetCare y dibuja en papel una flecha por cada ProjectReference. Api -> Infrastructure -> Domain es correcto; cualquier flecha que salga de Domain es un error.',
        'Revisa los using de cada archivo dentro de src/VetCare.Domain/. Si encuentras Microsoft.EntityFrameworkCore, Npgsql, Microsoft.AspNetCore o System.Net.Http, tienes una fuga.',
        'Mueve cada fuga: la interfaz se queda en Domain, la implementación se va a Infrastructure. Es exactamente la DIP de la semana 7 aplicada a nivel de proyecto.',
        'Añade un test de arquitectura: un test de xUnit que recorra typeof(Cita).Assembly.GetReferencedAssemblies() y falle si alguno contiene EntityFramework o Npgsql. (Si quieres reglas más finas, la librería NetArchTest.Rules permite escribirlas como frases.)',
        'Escribe en docs/arquitectura.md el diagrama de capas en Mermaid (graph LR) con las tres cajas y las flechas, y debajo una frase que explique qué gana el proyecto con esa dirección.'
      ],
      vet: [
        'En VetCare el dominio debe poder compilar y testearse sin que exista PostgreSQL. Comprueba literalmente que dotnet test tests/VetCare.Domain.Tests pasa con Docker apagado.',
        'Anota en docs/arquitectura.md las tres cosas que esta dirección te permite: testear reglas en milisegundos, cambiar de base de datos sin tocar reglas, y leer el negocio sin ruido técnico.'
      ],
      edge: [
        'Las carpetas no son capas. Puedes tener Domain/, Application/ e Infrastructure/ dentro de un solo proyecto y seguir teniendo spaghetti si no hay nada que impida el using cruzado. El test de arquitectura es lo que hace la regla real.',
        'Una entidad con atributos de EF Core ([Table], [Column]) ya está acoplada. Usa configuración fluida con IEntityTypeConfiguration en Infrastructure y deja el dominio limpio.',
        'La capa de aplicación (casos de uso) es opcional al principio. Si solo tienes tres endpoints, meter una capa más es ceremonia. Añádela cuando los servicios de dominio empiecen a mezclar orquestación con reglas.'
      ],
      quiz: [
        { q: '¿Qué define realmente una arquitectura en capas: las carpetas o las dependencias?', a: 'Las dependencias. Las carpetas son organización visual y no impiden nada; lo que define la arquitectura es qué código puede referenciar a qué otro código. Una regla que el compilador no puede romper es una regla; una convención de nombres de carpeta es una sugerencia.' },
        { q: '¿Por qué el dominio no debe referenciar EF Core?', a: 'Porque el dominio contiene las reglas que definen el negocio y esas reglas no dependen de cómo se guarden los datos. Si las acoplas al ORM, no puedes testearlas sin base de datos, no puedes cambiar de almacenamiento sin tocar el negocio, y cualquier lector tiene que separar mentalmente la regla del detalle técnico.' },
        { q: '¿Qué es un puerto y qué es un adaptador, con un ejemplo de VetCare?', a: 'Un puerto es la interfaz que el dominio declara según lo que necesita, como IRepositorioCitas con el método ExisteSolapeAsync. Un adaptador es la implementación concreta que vive fuera, como RepositorioCitasEf usando EF Core y PostgreSQL. El dominio define la forma del enchufe y la infraestructura fabrica el cable.' },
        { q: '¿Para qué sirve un test de arquitectura si ya dibujaste el diagrama?', a: 'El diagrama se queda obsoleto en cuanto alguien añade una referencia con prisa; el test falla en ese mismo commit. Convierte la decisión de arquitectura en algo ejecutable y verificable, igual que un test de negocio convierte una regla en algo verificable.' }
      ],
      out: 'Un dominio sin dependencias de infraestructura, verificado por un test de arquitectura automático.',
      file: 'docs/arquitectura.md'
    },
    {
      t: 'Hexagonal: el dominio en el centro',
      obj: 'Reorganizar VetCare según puertos y adaptadores y entender que el "exterior" incluye tanto la base de datos como la propia API HTTP.',
      why: 'Mucha gente cree que hexagonal solo se refiere a la base de datos. Entender que la API REST también es un adaptador, intercambiable por un CLI o por un consumidor de mensajes, es el salto conceptual que se valora en entrevistas de arquitectura.',
      study: { r: 1, what: 'Lee el artículo de Cockburn completo, es corto. Unos 12 minutos. Busca una cosa: la distinción entre puertos conductores (driving, los que te llaman) y conducidos (driven, los que tú llamas).',
        pasos: [
          'Lee el artículo de Cockburn de principio a fin (~10 min).',
          'Subraya el objetivo del patrón: que la aplicación pueda ser usada igual por personas, programas o tests, y desarrollarse sin su base de datos.',
          'Separa los puertos en dos grupos: los que llaman a la aplicación (la API HTTP, los tests) y los que la aplicación llama (base de datos, correo).',
          'Dibuja el hexágono de VetCare con dos puertos de cada lado y el adaptador concreto de cada uno.'
        ] },
      ex: {
        title: 'Dos lados del hexágono',
        body: `// PUERTOS CONDUCIDOS (driven): el dominio los usa. Interfaz en Domain.
//   IRepositorioCitas      -> adaptador: RepositorioCitasEf        (PostgreSQL)
//   INotificador           -> adaptador: NotificadorSmtp           (correo)
//   IRelojSistema          -> adaptador: RelojDelSistema           (DateTime.UtcNow)
//   IPasarelaPagos         -> adaptador: PasarelaStripe            (HTTP)
//
// PUERTOS CONDUCTORES (driving): alguien los llama. Son tus casos de uso.
//   IAgendarCita           -> adaptadores: CitasEndpoints (HTTP)
//                                          ComandoAgendar (CLI)
//                                          ConsumidorCitas (cola)

// src/VetCare.Application/IAgendarCita.cs
public interface IAgendarCita
{
    Task<ResultadoAgenda> EjecutarAsync(AgendarCitaComando cmd, CancellationToken ct);
}

public record AgendarCitaComando(Guid VetId, Guid MascotaId, DateTime Inicio);
public record ResultadoAgenda(Guid CitaId, DateTime Inicio, DateTime Fin);
// Fíjate: ni HttpRequest, ni IActionResult, ni DbContext. Tipos propios.

// src/VetCare.Application/AgendarCita.cs
public class AgendarCita : IAgendarCita
{
    private readonly ServicioAgenda _agenda;
    private readonly IUnidadDeTrabajo _uow;

    public async Task<ResultadoAgenda> EjecutarAsync(AgendarCitaComando cmd, CancellationToken ct)
    {
        var cita = await _agenda.AgendarAsync(cmd.VetId, cmd.MascotaId, cmd.Inicio, ct);
        await _uow.GuardarCambiosAsync(ct);
        return new ResultadoAgenda(cita.Id, cita.Inicio, cita.Fin);
    }
}

// src/VetCare.Api/Endpoints/CitasEndpoints.cs  (adaptador HTTP, muy delgado)
grupo.MapPost("/", async (CrearCitaRequest req, IAgendarCita caso, CancellationToken ct) =>
{
    try
    {
        var r = await caso.EjecutarAsync(
            new AgendarCitaComando(req.VeterinarioId, req.MascotaId,
                                   req.Inicio.UtcDateTime), ct);
        return Results.Created($"/api/v1/citas/{r.CitaId}",
            new CitaResponse(r.CitaId, r.Inicio, r.Fin, "agendada"));
    }
    catch (HorarioOcupadoException ex)
    {
        return Results.Problem(title: "Horario ocupado", detail: ex.Message, statusCode: 409);
    }
});
// El endpoint solo traduce: HTTP -> comando, resultado -> HTTP, excepción -> status.
// Cero reglas de negocio. Si borras la API, el caso de uso sigue siendo utilizable.`
      },
      steps: [
        'Crea el proyecto src/VetCare.Application con referencia solo a VetCare.Domain. Añádelo a la solución y haz que VetCare.Api lo referencie.',
        'Mueve a Application un caso de uso completo: AgendarCita, con su comando, su resultado y su interfaz. El servicio de dominio ServicioAgenda se queda en Domain.',
        'Adelgaza el endpoint POST /citas hasta que solo haga tres cosas: construir el comando, invocar el caso de uso, y traducir resultado o excepción a HTTP.',
        'Escribe un segundo adaptador conductor para demostrar el punto: un pequeño comando de consola en src/VetCare.Cli que invoque IAgendarCita directamente, sin pasar por HTTP.',
        'Dibuja el hexágono en docs/arquitectura.md con Mermaid: el dominio en el centro, los puertos conducidos a la derecha con sus adaptadores, los conductores a la izquierda con los suyos.'
      ],
      vet: [
        'En VetCare los casos de uso son exactamente: AgendarCita, CancelarCita, RegistrarVisita, EmitirFactura, ConsultarHistorialMascota. Crea al menos las interfaces de los cinco aunque solo implementes uno.',
        'Añade a docs/arquitectura.md la tabla de puertos: nombre, tipo (conductor o conducido), adaptador actual, adaptador alternativo imaginable. Esa última columna es la que demuestra el valor del patrón.'
      ],
      edge: [
        'Si tu capa de aplicación solo reenvía llamadas al dominio sin añadir nada, es ruido. Justifícala cuando orqueste varias cosas: transacción, varios agregados, publicación de eventos.',
        'Los DTOs de la API y los comandos de aplicación parecen iguales al principio y la tentación es reutilizar. No lo hagas: el DTO cambia por motivos de contrato HTTP y el comando por motivos de negocio, y acoplarlos te obliga a romper uno al cambiar el otro.',
        'Hexagonal no implica microservicios. Todo esto cabe perfectamente en un monolito de un solo proceso, y de hecho ahí es donde más rentable sale.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre un puerto conductor y uno conducido?', a: 'El conducido es una interfaz que el dominio declara porque necesita algo del exterior, como persistencia o correo, y la infraestructura la implementa. El conductor es una interfaz que expone lo que el sistema sabe hacer y la llama alguien de fuera, como el endpoint HTTP o un CLI. La dirección de la llamada es la que cambia.' },
        { q: '¿Por qué la API HTTP es un adaptador y no "la aplicación"?', a: 'Porque es solo una forma de invocar los casos de uso, intercambiable por un CLI, un consumidor de cola o un trabajo programado. Si la lógica estuviera en el endpoint, cada nueva forma de invocarla obligaría a duplicarla; manteniéndola en el caso de uso, añadir un adaptador cuesta unas pocas líneas.' },
        { q: '¿Por qué no reutilizar el DTO de la API como comando de aplicación?', a: 'Porque cambian por razones distintas. El DTO cambia cuando cambia el contrato público, por ejemplo al renombrar un campo por compatibilidad con clientes. El comando cambia cuando cambia el caso de uso. Acoplarlos hace que una decisión de contrato HTTP se filtre hasta el núcleo.' },
        { q: '¿Cómo demuestra el adaptador de consola que la arquitectura funciona?', a: 'Porque si puedes agendar una cita desde consola sin tocar ni una línea del dominio ni de la aplicación, queda probado que el núcleo no depende de HTTP. Es la verificación práctica del hexágono, equivalente al test de arquitectura del día anterior.' }
      ],
      out: 'Un proyecto VetCare.Application con casos de uso explícitos y dos adaptadores conductores funcionando.',
      file: 'src/VetCare.Application/'
    },
    {
      t: 'CQRS ligero: leer no es escribir',
      obj: 'Separar el camino de lectura del de escritura donde aporta, usando consultas directas para leer y el modelo de dominio solo para escribir.',
      why: 'Es donde más gente se pasa de frenada: monta event sourcing y dos bases de datos para un CRUD. Saber aplicar la versión ligera y saber explicar por qué no aplicas la pesada demuestra criterio, que es lo que de verdad se busca en un arquitecto.',
      study: { r: 2, what: 'Lee el artículo de Fowler completo, son dos páginas. Unos 10 minutos. Busca una cosa: la sección donde dice cuándo NO usar CQRS. Esa es la parte que casi nadie cita.',
        pasos: [
          'Lee el artículo de principio a fin (~5 min).',
          'Fíjate en el diagrama: un modelo para actualizar y otro distinto para consultar.',
          'Lee "When to use it" (~3 min) y copia la advertencia: en la mayoría de sistemas CQRS añade complejidad arriesgada.',
          'Escribe qué lecturas de VetCare ganarían con una consulta directa (la agenda del día) y cuáles no necesitan nada especial.'
        ] },
      ex: {
        title: 'Dos caminos con necesidades distintas',
        body: `// EL PROBLEMA: forzar las lecturas a pasar por el modelo de escritura
var citas = await _repo.ObtenerPorVeterinarioAsync(vetId, ct);   // trae agregados completos
var dto = citas.Select(c => new CitaListadoDto(
    c.Id, c.Inicio, c.Mascota.Nombre, c.Mascota.Dueno.Nombre)).ToList();
// Para pintar una tabla con 4 columnas has cargado entidades completas,
// con tracking, con todas sus colecciones, y has provocado N+1 o un Include enorme.

// ESCRITURA: pasa por el dominio SIEMPRE. Ahí viven las reglas.
public async Task<ResultadoAgenda> EjecutarAsync(AgendarCitaComando cmd, CancellationToken ct)
{
    var cita = await _agenda.AgendarAsync(cmd.VetId, cmd.MascotaId, cmd.Inicio, ct);
    await _uow.GuardarCambiosAsync(ct);
    return new ResultadoAgenda(cita.Id, cita.Inicio, cita.Fin);
}

// LECTURA: NO pasa por el dominio. Proyecta directo a lo que la pantalla necesita.
// Application no puede ver el DbContext (solo referencia a Domain), así que:
//   src/VetCare.Application/Consultas/IAgendaDelDia.cs   -> la interfaz y el DTO
//   src/VetCare.Infrastructure/Consultas/AgendaDelDia.cs -> la consulta real
public class AgendaDelDia : IAgendaDelDia
{
    private readonly VetCareDbContext _db;   // aquí sí, y no pasa nada

    public Task<List<FilaAgendaDto>> EjecutarAsync(Guid vetId, DateOnly dia, CancellationToken ct)
    {
        var desde = dia.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var hasta = desde.AddDays(1);   // rango, no .Date: así usa el índice (semana 10)

        return (from c in _db.Citas.AsNoTracking()
                join m in _db.Mascotas on c.MascotaId equals m.Id
                join d in _db.Duenos   on m.DuenoId   equals d.Id
                where c.VeterinarioId == vetId
                   && c.Inicio >= desde && c.Inicio < hasta
                orderby c.Inicio
                select new FilaAgendaDto(
                    c.Id, c.Inicio, c.Fin, m.Nombre, d.Nombre,
                    c.Estado.ToString().ToLowerInvariant()))
               .ToListAsync(ct);
    }
}
// Una sola consulta SQL, solo las columnas necesarias, sin tracking, sin agregados.
// (Los join van a mano porque Cita apunta a Mascota solo por Id, semana 12.)

// Y cuando ni LINQ llega, SQL plano sin complejos:
public record ResumenMensualDto(DateTime Mes, long Total, long Canceladas);

public async Task<List<ResumenMensualDto>> ResumenAsync(int anio, CancellationToken ct)
{
    // Los alias van entre comillas para que coincidan EXACTOS con las
    // propiedades del record: PostgreSQL pasa a minúsculas lo que no
    // va entre comillas, y EF no encontraría "Mes".
    const string sql = """
        SELECT date_trunc('month', c.inicio)                  AS "Mes",
               count(*)                                       AS "Total",
               count(*) FILTER (WHERE c.estado = 'cancelada') AS "Canceladas"
        FROM cita c
        WHERE c.inicio >= make_date(@anio, 1, 1)
          AND c.inicio <  make_date(@anio + 1, 1, 1)
        GROUP BY 1 ORDER BY 1
        """;
    return await _db.Database.SqlQueryRaw<ResumenMensualDto>(sql,
        new NpgsqlParameter("anio", anio)).ToListAsync(ct);
}

// CQRS ligero = esto. Misma base de datos, mismas tablas, dos caminos de código.
// CQRS pesado = base de lectura separada, sincronización, consistencia eventual.
// Solo lo segundo si tienes una desproporción real entre lecturas y escrituras.`
      },
      steps: [
        'Crea dos carpetas en VetCare.Application: Comandos/ y Consultas/. Mueve AgendarCita a Comandos/. En Consultas/ van solo las interfaces y los DTO de lectura; sus implementaciones, en VetCare.Infrastructure/Consultas/.',
        'Escribe la consulta AgendaDelDia tal cual el ejemplo (interfaz en Application, implementación en Infrastructure), proyectando directamente a FilaAgendaDto sin pasar por el repositorio del dominio.',
        'Compara con EXPLAIN ANALYZE, como aprendiste en la semana 10, el SQL que genera la versión con repositorio y el que genera la proyección directa. Anota las dos duraciones.',
        'Escribe la consulta de resumen mensual con SQL plano usando SqlQueryRaw y parámetros. Nunca concatenes el año en la cadena: eso es inyección SQL.',
        'Documenta en docs/arquitectura.md la regla que acabas de adoptar: las escrituras pasan por el dominio, las lecturas proyectan directo, y el motivo de cada una.'
      ],
      vet: [
        'En VetCare las consultas que claramente van por el camino de lectura son: agenda del día, historial de una mascota, listado de facturas y resumen mensual. Las escrituras son los cinco casos de uso de ayer.',
        'Deja claro en docs/arquitectura.md que VetCare usa CQRS ligero con una sola base de datos, y escribe explícitamente qué condición tendría que cumplirse para justificar la versión pesada.'
      ],
      edge: [
        'CQRS no obliga a tener dos bases de datos. Esa es la versión avanzada, trae consistencia eventual y multiplica la complejidad operativa. El 95% de los proyectos solo necesita la separación de código.',
        'Las consultas de lectura saltándose el dominio pueden saltarse también reglas de visibilidad. Si una mascota es confidencial, ese filtro tiene que estar en la consulta también: duplicarlo es un riesgo conocido que hay que cubrir con tests.',
        'No crees un DTO por pantalla si dos pantallas necesitan lo mismo, ni reutilices uno para tres pantallas distintas forzando campos nulos. El DTO de lectura existe para servir a una vista concreta.'
      ],
      quiz: [
        { q: '¿Qué es exactamente CQRS en su versión ligera?', a: 'Separar el código que escribe del código que lee: las escrituras pasan por el modelo de dominio donde viven las reglas, y las lecturas proyectan directamente desde la base a un DTO adaptado a la pantalla. Es una separación de caminos de código, no de bases de datos.' },
        { q: '¿Por qué las lecturas pueden saltarse el modelo de dominio sin que sea una violación de la arquitectura?', a: 'Porque el modelo de dominio existe para proteger invariantes al modificar el estado, y una lectura no modifica nada. Forzarla a pasar por agregados completos solo añade coste sin aportar ninguna protección.' },
        { q: '¿Cuándo NO deberías aplicar CQRS, según Fowler?', a: 'Cuando el dominio es un CRUD sencillo donde el modelo de lectura y el de escritura son prácticamente iguales. Ahí la separación añade código y conceptos sin resolver ningún problema, y Fowler advierte explícitamente de que el patrón se aplica mucho más de lo que se debería.' },
        { q: '¿Qué riesgo concreto introduce saltarse el dominio en las lecturas y cómo se mitiga?', a: 'Que las reglas de visibilidad o filtrado que el dominio aplicaba queden fuera de la consulta directa y se expongan datos que no deberían verse. Se mitiga replicando esos filtros en la consulta y cubriéndolos con tests de integración que verifiquen que un usuario no ve lo que no le corresponde.' }
      ],
      out: 'Comandos y consultas separados, con al menos una consulta proyectada y una en SQL plano parametrizado.',
      file: 'src/VetCare.Application/Consultas/'
    },
    {
      t: 'Eventos de dominio',
      obj: 'Dejar que el dominio anuncie lo que ha pasado sin saber quién escucha, y despachar esos eventos en el momento correcto respecto a la transacción.',
      why: 'Es la forma limpia de resolver "cuando pase X, haz también Y y Z" sin que el caso de uso crezca sin control. En entrevistas es la respuesta natural a cómo desacoplar efectos secundarios, y conecta directamente con el outbox de la semana pasada.',
      study: { r: 3, what: 'Lee la página de domain events de Microsoft Learn centrándote en el apartado de cómo se recogen en la entidad y cuándo se despachan. Unos 15 minutos. Busca una cosa: por qué se despachan antes del commit y no después.',
        pasos: [
          'Lee "What is a domain event?" y "Domain events versus integration events" (~5 min).',
          'Lee "Raise domain events" y "The deferred approach to raise and dispatch events" (~5 min): la entidad guarda los eventos en una lista y se despachan al guardar.',
          'Lee "Single transaction across aggregates versus eventual consistency across aggregates" (~4 min).',
          'Lee "How to handle domain events" por encima (~2 min).',
          'Escribe dos eventos de VetCare en pasado (CitaAgendada, VacunaAplicada) y qué debería pasar cuando ocurre cada uno.'
        ] },
      ex: {
        title: 'La entidad anuncia, el caso de uso despacha',
        body: `// src/VetCare.Domain/Eventos/IEventoDominio.cs
public interface IEventoDominio { DateTime OcurridoEn { get; } }

public record CitaAgendada(Guid CitaId, Guid VetId, Guid MascotaId,
                           DateTime Inicio, DateTime OcurridoEn) : IEventoDominio;

// src/VetCare.Domain/EntidadBase.cs
public abstract class EntidadBase
{
    private readonly List<IEventoDominio> _eventos = new();
    public IReadOnlyList<IEventoDominio> Eventos => _eventos;
    protected void Registrar(IEventoDominio e) => _eventos.Add(e);
    public void LimpiarEventos() => _eventos.Clear();
}

// La entidad solo ANUNCIA. No sabe quién escucha ni le importa.
public class Cita : EntidadBase
{
    public Cita(Guid vetId, Guid mascotaId, DateTime inicio, DateTime fin, DateTime ahora)
    {
        Id = Guid.NewGuid();   // el Id existe ANTES de anunciar el evento
        VeterinarioId = vetId; MascotaId = mascotaId; Inicio = inicio; Fin = fin;
        Estado = EstadoCita.Agendada;
        Registrar(new CitaAgendada(Id, vetId, mascotaId, inicio, ahora));
    }
}

// La interfaz IManejador vive en Application. Puede haber varios por evento.
public interface IManejador<in T> where T : IEventoDominio
{
    Task ManejarAsync(T evento, CancellationToken ct);
}

// Este manejador escribe en el DbContext, así que vive en Infrastructure:
// src/VetCare.Infrastructure/Manejadores/EncolarConfirmacion.cs
public class EncolarConfirmacion : IManejador<CitaAgendada>
{
    private readonly VetCareDbContext _db;
    public Task ManejarAsync(CitaAgendada e, CancellationToken ct)
    {
        _db.Outbox.Add(new MensajeOutbox("CitaCreada",
            JsonSerializer.Serialize(new { e.CitaId, e.Inicio }), e.OcurridoEn));
        return Task.CompletedTask;   // solo añade al contexto, NO guarda
    }
}

// El despacho: ANTES del SaveChanges, dentro de la misma transacción.
// Es la implementación de IUnidadDeTrabajo, en Infrastructure:
public async Task GuardarCambiosAsync(CancellationToken ct)
{
    var entidades = _db.ChangeTracker.Entries<EntidadBase>()
        .Select(e => e.Entity)
        .Where(e => e.Eventos.Count > 0)
        .ToList();

    var eventos = entidades.SelectMany(e => e.Eventos).ToList();
    entidades.ForEach(e => e.LimpiarEventos());

    foreach (var ev in eventos)
        await _despachador.DespacharAsync(ev, ct);   // los manejadores escriben en el contexto

    await _db.SaveChangesAsync(ct);   // UN commit con la cita y el outbox juntos
}
// Por qué antes del commit: así la cita y el mensaje de outbox son atómicos.
// Si despacharas después, podrías tener la cita guardada y el outbox perdido.`
      },
      steps: [
        'Crea EntidadBase con la lista de eventos y haz que Cita, Visita y Factura hereden de ella. Las entidades de dominio no cambian en nada más.',
        'Define los eventos que VetCare necesita de verdad: CitaAgendada, CitaCancelada, VisitaRegistrada, FacturaEmitida. Como records, inmutables, con los datos mínimos.',
        'Implementa el despachador: una clase que recibe IServiceProvider y resuelve IEnumerable<IManejador<T>> para el tipo concreto del evento. Regístralo con scoped.',
        'Mueve el código que inserta en el outbox desde el caso de uso AgendarCita hasta el manejador EncolarConfirmacion. El caso de uso debe quedar más corto que antes.',
        'Escribe un test de dominio sin base de datos: crea una Cita y comprueba que su colección Eventos contiene exactamente un CitaAgendada con los datos correctos.'
      ],
      vet: [
        'En VetCare el evento CitaAgendada tendrá al menos dos manejadores: encolar la confirmación por correo y registrar la métrica de citas creadas. Que sean dos es justo lo que demuestra el valor del patrón.',
        'Añade a docs/arquitectura.md la lista de eventos con sus manejadores actuales. Esa tabla es el mapa de efectos secundarios de tu sistema.'
      ],
      edge: [
        'Un evento de dominio es pasado y es un hecho: se nombra en participio (CitaAgendada, no AgendarCita) y nunca puede fallar en el sentido de rechazar la operación. Si un manejador necesita vetar, no era un evento sino parte de la regla.',
        'VetCare genera el Guid en el dominio, así que el evento ya nace con el Id correcto. Si algún día usas ids que genera la base de datos, no lances eventos desde el constructor: tendrías Id 0 en el evento.',
        'Los manejadores síncronos dentro de la transacción deben ser rápidos y no hacer E/S externa. Llamar a un HTTP ahí dentro alarga la transacción y reintroduce el problema que el outbox venía a resolver.'
      ],
      quiz: [
        { q: '¿Por qué los eventos de dominio se despachan antes del SaveChanges y no después?', a: 'Para que lo que escriban los manejadores entre en la misma transacción que el cambio que los provocó. Así la cita y su mensaje de outbox se guardan o se descartan juntos. Despachar después del commit abre la ventana de que la cita exista y su efecto secundario se pierda.' },
        { q: '¿Qué gana el caso de uso AgendarCita al mover la inserción en outbox a un manejador?', a: 'Deja de conocer los efectos secundarios. Si mañana hay que registrar una métrica, avisar por SMS y actualizar una estadística, se añaden tres manejadores y el caso de uso no cambia ni una línea. Es el principio abierto-cerrado aplicado a los efectos.' },
        { q: '¿Por qué un evento se nombra en pasado y qué implica eso?', a: 'Porque describe algo que ya sucedió y es un hecho consumado, no una petición. Implica que ningún manejador puede cancelar la operación: si una condición debe poder impedir que la cita se cree, esa condición es una regla del dominio y tiene que evaluarse antes, no en un manejador.' },
        { q: '¿Qué problema tiene lanzar CitaAgendada desde el constructor cuando el Id lo genera la base de datos?', a: 'Que en ese momento el Id todavía vale 0, así que el evento viaja con un identificador inválido y el manejador no puede referenciar la cita. Se resuelve generando el identificador en el dominio, por ejemplo con un Guid, o registrando el evento después de que la entidad tenga Id.' }
      ],
      out: 'Eventos de dominio funcionando con despacho pre-commit y al menos dos manejadores sobre el mismo evento.',
      file: 'src/VetCare.Domain/Eventos/'
    },
    {
      t: 'Modularidad y límites de módulo',
      obj: 'Dividir VetCare en módulos por capacidad de negocio y definir cómo se comunican entre sí sin crear un nudo de dependencias.',
      why: 'Es la base para entender microservicios sin caer en ellos. La pregunta "cómo partirías este sistema" aparece en toda entrevista de diseño, y la respuesta madura habla de límites de negocio y de coste de comunicación, no de tecnología.',
      study: { r: 4, what: 'Lee el artículo de Fowler sobre los costes y beneficios de separar en servicios. Unos 15 minutos. Busca una cosa: qué coste concreto aparece en el momento en que dos módulos dejan de compartir proceso.',
        pasos: [
          'Lee la introducción y "Strong Module Boundaries (Pro)" (~4 min): un monolito también puede tener límites fuertes si los cuidas.',
          'Lee "Distribution (Con)" (~4 min): las llamadas remotas son lentas y pueden fallar. Ese es el coste del día.',
          'Lee "Eventual Consistency (Con)" (~3 min).',
          'Lee "Summing Up" (~2 min).',
          'Escribe los módulos de VetCare (agenda, clínica, facturación) y qué puede llamar cada uno a los demás.'
        ] },
      ex: {
        title: 'Módulos de VetCare y sus fronteras',
        body: `src/
  VetCare.Modulos.Agenda/          <- citas, disponibilidad, calendario
  VetCare.Modulos.Clinica/         <- visitas, diagnósticos, recetas, vacunas
  VetCare.Modulos.Facturacion/     <- facturas, líneas, cobros
  VetCare.Modulos.Pacientes/       <- mascotas, dueños, veterinarios
  VetCare.Compartido/              <- tipos mínimos: ids, Dinero, IRelojSistema
  VetCare.Api/                     <- único host, monta los endpoints de cada módulo

// REGLA 1: cada módulo tiene su propio Domain, Application e Infrastructure dentro.
//          La estructura en capas se repite DENTRO de cada módulo.

// REGLA 2: un módulo NO referencia el proyecto de otro módulo.
//          Si necesita algo, lo pide a través de un contrato público pequeño.

// VetCare.Modulos.Pacientes/Contratos/IConsultaPacientes.cs   (API pública del módulo)
public interface IConsultaPacientes
{
    Task<MascotaResumen?> ObtenerAsync(Guid mascotaId, CancellationToken ct);
}
public record MascotaResumen(Guid Id, string Nombre, string Especie, Guid DuenoId);
// Fíjate en lo pequeño que es. El módulo Agenda NO necesita la entidad Mascota entera,
// solo saber que existe y cómo se llama.

// REGLA 3: nada de JOIN entre tablas de módulos distintos.
//          Agenda tiene cita.mascota_id, pero no hace JOIN con mascota.
//          Si necesita el nombre, llama a IConsultaPacientes. Duele un poco. Es el punto.

// REGLA 4: la comunicación que no necesita respuesta inmediata va por eventos.
//          Facturacion publica FacturaEmitida; Clinica la escucha si le interesa.
//          Ninguno conoce al otro.

// CÓMO SE PRUEBA QUE LOS LÍMITES SON BUENOS
//   - ¿Cuántos contratos públicos expone cada módulo? Pocos = buen límite.
//   - ¿Cuántas veces cambias dos módulos en el mismo commit? Muchas = mal límite.
//   - ¿Podrías sacar un módulo a su propio proceso cambiando solo el adaptador? Sí = buen límite.

// CUÁNDO PASAR A MICROSERVICIOS: cuando un módulo necesite escalar, desplegarse o
// fallar de forma independiente Y el equipo pueda asumir red, despliegues y
// consistencia eventual. Antes de eso, el monolito modular gana siempre.`
      },
      steps: [
        'Dibuja en docs/arquitectura.md los cuatro módulos de VetCare y, para cada par que se comunique, una flecha etiquetada con qué necesita exactamente uno del otro.',
        'Define el contrato público mínimo de cada módulo: una interfaz con los métodos que otros módulos necesitan, y records planos como parámetros y retornos. Que sea embarazosamente pequeño.',
        'Identifica en tu código actual cada JOIN que cruce el límite de dos módulos. Anótalos: son tu deuda de límites. No hace falta arreglarlos todos hoy.',
        'Elige el caso más claro y sustituye el JOIN por una llamada al contrato público del otro módulo. Mide si la consulta se vuelve inaceptablemente lenta: si lo es, el límite está mal puesto.',
        'Aplica la prueba de los tres criterios a tus límites y escribe la conclusión: número de contratos por módulo, cuántas veces has tocado dos módulos a la vez, y si podrías extraer alguno.'
      ],
      vet: [
        'En VetCare el límite más discutible es Agenda frente a Clinica: una cita se convierte en una visita. Decide si son un módulo o dos y escribe en docs/arquitectura.md el argumento que te convenció, con su contraargumento.',
        'Escribe explícitamente que VetCare es y seguirá siendo un monolito modular, y cuál sería la señal concreta que te haría reconsiderarlo. Saber cuándo no partir es tan valioso como saber partir.'
      ],
      edge: [
        'Un módulo compartido que acaba conteniendo entidades de negocio deja de ser compartido y se convierte en un segundo acoplamiento global. En Compartido solo van tipos técnicos sin reglas: ids, Dinero, el reloj.',
        'Prohibir JOINs entre módulos cuesta rendimiento en informes que cruzan todo. La salida honesta es tener una vista o consulta de lectura explícitamente marcada como cross-module, no romper la regla en silencio.',
        'Partir por capas técnicas (todos los controladores juntos, todos los repositorios juntos) no es modularidad: cualquier cambio de negocio sigue tocando todas las carpetas. Los módulos se parten por capacidad de negocio.'
      ],
      quiz: [
        { q: '¿Por qué un módulo no debe hacer JOIN con las tablas de otro?', a: 'Porque ese JOIN convierte el esquema interno del otro módulo en su contrato público: cualquier renombrado de columna rompe código ajeno. Pasar por un contrato explícito mantiene el esquema como detalle interno y permite que cada módulo evolucione su almacenamiento solo.' },
        { q: '¿Qué señal te dice que dos módulos están mal separados?', a: 'Que casi siempre los cambies en el mismo commit. Si añadir una funcionalidad obliga sistemáticamente a tocar los dos, es que comparten una razón de cambio y el límite está cortando por el sitio equivocado; probablemente deberían ser uno solo.' },
        { q: '¿Por qué partir por capas técnicas no es modularidad?', a: 'Porque un cambio de negocio como añadir un campo a la cita obliga a tocar la carpeta de controladores, la de servicios, la de repositorios y la de entidades. La modularidad real busca que un cambio de negocio quede contenido en un sitio, y eso solo ocurre partiendo por capacidad de negocio.' },
        { q: '¿Qué condiciones deben darse para justificar pasar un módulo a microservicio?', a: 'Que ese módulo necesite escalar, desplegarse o fallar de forma independiente del resto, y que el equipo pueda asumir el coste que llega con la red: latencia, fallos parciales, despliegues coordinados y consistencia eventual. Sin la primera condición es complejidad gratuita; sin la segunda es complejidad inasumible.' }
      ],
      out: 'Un mapa de módulos con contratos públicos definidos y la deuda de límites identificada por escrito.',
      file: 'docs/arquitectura.md'
    },
    {
      t: 'Defender tu arquitectura (examen de la semana)',
      obj: 'Escribir las decisiones de arquitectura de VetCare en formato ADR y poder defender cada una con su alternativa descartada.',
      why: 'En una entrevista senior nadie te pide que recites patrones: te piden que defiendas una decisión y que digas qué descartaste y por qué. Un ADR es exactamente ese ejercicio por escrito, y tener cinco escritos te da material concreto que contar.',
      study: { r: 5, what: 'Lee el artículo original que propuso los ADR. Unos 10 minutos. Busca una cosa: por qué la sección de consecuencias debe incluir también lo malo, porque un ADR sin inconvenientes es propaganda.',
        pasos: [
          'Lee la introducción (~3 min): por qué las decisiones de arquitectura se pierden si no se escriben.',
          'Lee las partes del formato: "Context", "Decision", "Status" y "Consequences" (~4 min).',
          'Lee "Experience Report" (~2 min).',
          'Copia la plantilla en docs/adr/0000-plantilla.md antes de escribir tus ADR.'
        ] },
      ex: {
        title: 'Plantilla ADR y un ejemplo completo',
        body: `# ADR-004: El dominio no depende de EF Core

## Estado
Aceptada — 2026-10-04

## Contexto
VetCare usa EF Core sobre PostgreSQL. La tentación inicial fue poner atributos
de mapeo en las entidades y métodos de consulta dentro de ellas, que es lo más
rápido de escribir. Las reglas de agenda (solapes, horarios, cancelaciones) son
la parte del sistema que más va a cambiar y la que más necesita tests rápidos.

## Decisión
El proyecto VetCare.Domain no referencia ningún paquete de infraestructura.
Las interfaces de persistencia (IRepositorioCitas, IUnidadDeTrabajo) se declaran
en Domain y se implementan en Infrastructure. El mapeo se configura con
IEntityTypeConfiguration en Infrastructure, no con atributos en las entidades.

## Alternativas consideradas
1. Entidades con atributos de EF y consultas dentro del dominio.
   Descartada: obliga a levantar PostgreSQL para testear una regla de solape.
2. Patrón Active Record (la entidad se guarda a sí misma).
   Descartada: mezcla la regla con la persistencia y hace imposible el doble en memoria.
3. Repositorio genérico IRepositorio<T> para todo.
   Descartada: acaba exponiendo IQueryable y filtra EF Core al dominio igualmente.

## Consecuencias
Positivas: los tests de dominio corren en milisegundos sin Docker; las reglas se
leen sin ruido técnico; cambiar de almacenamiento afecta a un solo proyecto.
Negativas: hay más interfaces y más código de mapeo; algunas consultas que serían
triviales con LINQ directo requieren un método explícito en el repositorio.
Mitigación: las lecturas usan CQRS ligero y van directas al DbContext (ver ADR-006).

## Cómo se verifica
Test ArquitecturaTests.Dominio_no_referencia_infraestructura, que inspecciona
los ensamblados referenciados y falla si aparece EntityFramework o Npgsql.

---
LOS CINCO ADR QUE DEBES ESCRIBIR ESTA SEMANA
  ADR-004  El dominio no depende de EF Core            (día 1)
  ADR-005  Casos de uso explícitos en VetCare.Application (día 2)
  ADR-006  CQRS ligero: lecturas proyectadas directas  (día 3)
  ADR-007  Eventos de dominio despachados pre-commit   (día 4)
  ADR-008  Monolito modular, no microservicios         (día 5)`
      },
      steps: [
        'Crea la carpeta docs/adr/ y escribe los cinco ADR, uno por día de esta semana, siguiendo la plantilla exacta: contexto, decisión, alternativas consideradas, consecuencias positivas y negativas, y cómo se verifica.',
        'La sección de alternativas es obligatoria y necesita al menos dos opciones descartadas con su motivo. Un ADR sin alternativas no demuestra que decidiste nada.',
        'La sección de consecuencias negativas también es obligatoria. Si no encuentras ninguna, no has entendido el coste de tu decisión: vuelve a pensarlo.',
        'Revisa que cada ADR tenga una verificación concreta: un test, una comprobación manual o un comando. Una decisión que no se puede comprobar se erosiona sola.',
        'Explica en voz alta ADR-008 en tres minutos como si te lo preguntaran en una entrevista: qué decidiste, qué descartaste, qué te costaría y qué señal te haría cambiar de opinión.'
      ],
      vet: [
        'Comprueba la coherencia del conjunto: tu diagrama de capas, tu hexágono, tu mapa de módulos y tus cinco ADR deben contar la misma historia. Si uno contradice a otro, uno de los dos está desactualizado.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/adr/ dentro de una semana.'
      ],
      edge: [
        'Un ADR no se edita cuando cambias de opinión: se escribe uno nuevo que lo supersede y el antiguo pasa a estado Superseded por ADR-00X. El valor está en el registro histórico de por qué pensabas lo que pensabas.',
        'Un ADR que solo dice "usamos clean architecture porque es una buena práctica" no vale nada. El valor está en el contexto concreto de TU proyecto y en las alternativas que descartaste por motivos concretos.',
        'Cuidado con defender una arquitectura por la que no has pagado el coste. Si nunca has sentido el dolor de las interfaces extra, tu defensa suena a repetición de libro. Di honestamente qué parte te ha costado.'
      ],
      quiz: [
        { q: '¿Por qué la sección de alternativas descartadas es la más valiosa de un ADR?', a: 'Porque es la que demuestra que hubo una decisión y no una copia. Dice al lector futuro, que puede ser tú mismo, qué opciones ya se evaluaron y por qué se rechazaron, evitando que alguien reabra el debate sin información o repita un camino ya explorado.' },
        { q: '¿Por qué un ADR nunca se edita cuando cambias de opinión?', a: 'Porque el documento registra lo que se sabía y se decidió en un momento concreto. Editarlo borra ese contexto histórico. Lo correcto es escribir un ADR nuevo que lo supersede, dejando visible la evolución del pensamiento del proyecto.' },
        { q: '¿Qué le falta a un ADR que no tiene consecuencias negativas?', a: 'Le falta honestidad y probablemente comprensión. Toda decisión de arquitectura cambia unos costes por otros: más interfaces, más latencia, más ceremonia, menos flexibilidad. Si no identificas el precio, no estás comparando opciones, estás justificando una que ya habías elegido.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que la arquitectura no son cajas en un diagrama sino reglas sobre quién puede depender de quién, elegidas a conciencia según lo que ese proyecto concreto necesita cambiar con facilidad, verificadas con tests y registradas con sus alternativas descartadas para que la decisión sobreviva a quien la tomó.' }
      ],
      out: 'Cinco ADR escritos en docs/adr/ con alternativas, consecuencias negativas y verificación concreta.',
      file: 'docs/adr/'
    }
  ]
}
]);
