window.WEEKS = (window.WEEKS || []).concat([
{
  n: 8,
  phase: 'Diseño y SOLID',
  title: 'Patrones e inyección de dependencias',
  idea: 'Los patrones no son recetas para memorizar: son nombres para soluciones que ya descubriste solo. Esta semana le pones nombre a lo que hiciste en la semana 7 y aprendes el mecanismo que usa todo .NET moderno para armar los objetos: el contenedor de dependencias.',
  res: [
    { t: 'Microsoft Learn — Dependency injection in .NET',
      u: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection',
      note: 'La guía oficial del contenedor que vas a usar todos los días en ASP.NET Core. Incluye los tres tiempos de vida.' },
    { t: 'Refactoring Gurú — Design patterns catalog',
      u: 'https://refactoring.guru/design-patterns/catalog',
      note: 'Catálogo con diagramas y código. Úsalo como diccionario, no lo leas entero.' },
    { t: 'Martin Fowler — Inversion of Control Containers',
      u: 'https://martinfowler.com/articles/injection.html',
      note: 'El artículo que popularizó el término. Útil para entender por qué existe el contenedor, no solo cómo se usa.' },
    { t: 'Refactoring Gurú — Strategy', u: 'https://refactoring.guru/design-patterns/strategy', note: 'Problema, solución y aplicabilidad del patrón Strategy.' },
    { t: 'Refactoring Gurú — Factory Method', u: 'https://refactoring.guru/design-patterns/factory-method', note: 'Delegar la decisión de qué clase crear.' },
    { t: 'Refactoring Gurú — Adapter', u: 'https://refactoring.guru/design-patterns/adapter', note: 'Hacer que una interfaz ajena encaje con la tuya.' },
    { t: 'Martin Fowler — Repository', u: 'https://martinfowler.com/eaaCatalog/repository.html', note: 'La definición original del patrón Repository.' },
    { t: 'Microsoft Learn — Service lifetimes', u: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes', note: 'Transient, scoped y singleton: cuánto vive cada servicio.' }
  ],
  days: [
    {
      t: 'Inyección de dependencias a mano',
      obj: 'Entender que DI es solo pasar colaboradores por constructor, sin magia.',
      why: 'Mucha gente cree que DI es el contenedor. Si entiendes que funciona sin framework, vas a poder testear, depurar y explicar el patrón en cualquier lenguaje.',
      study: { r: 2, what: 'Lee hasta la sección "Forms of Dependency Injection". Unos 15 minutos. Busca una cosa: la diferencia entre inversión de control e inyección de dependencias.',
        pasos: [
          'Lee "Components and Services" (~3 min).',
          'Lee "A Naive Example" (~4 min): el MovieLister que crea su propio buscador. Ese es el problema.',
          'Lee "Inversion of Control" (~3 min): por qué Fowler propone llamarlo inyección de dependencias.',
          'Lee la introducción de "Forms of Dependency Injection" y "Constructor Injection with PicoContainer" (~4 min), saltando el detalle del contenedor.',
          'Escribe en una línea la diferencia entre inversión de control (idea general) e inyección de dependencias (forma concreta).'
        ] },
      ex: { title: 'Armado manual del grafo de objetos', body: `Sin DI: cada clase se construye sus cosas

public class AgendadorDeCitas
{
    private readonly PostgresCitaRepository _repo = new();
}

Con DI manual: alguien de afuera las arma

// Las clases solo declaran lo que necesitan
public class AgendadorDeCitas
{
    private readonly IRepositorioCitas _repo;
    private readonly INotificador _notificador;
    private readonly IRelojSistema _reloj;

    public AgendadorDeCitas(
        IRepositorioCitas repo,
        INotificador notificador,
        IRelojSistema reloj)
    {
        _repo = repo;
        _notificador = notificador;
        _reloj = reloj;
    }
}

// Un único lugar arma todo: la raíz de composición
public static class Program
{
    public static void Main()
    {
        IRelojSistema reloj = new RelojDelSistema();
        IRepositorioCitas repo = new PostgresCitaRepository(cadena);
        INotificador notif = new NotificadorEmail("citas@vetcare.local");

        var agendador = new AgendadorDeCitas(repo, notif, reloj);
        agendador.Agendar(nuevaCita);
    }
}

En un test la misma clase se arma con dobles:

var agendador = new AgendadorDeCitas(
    new RepositorioEnMemoria(),
    new NotificadorFalso(),
    new RelojFijo(new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc)));` },
      steps: [
        'En src/VetCare.Playground/Program.cs arma a mano el grafo completo de AgendadorDeCitas.',
        'Crea tres implementaciones falsas: RepositorioEnMemoria con una List, NotificadorFalso que guarda los mensajes en una lista, y RelojFijo que devuelve siempre la misma fecha.',
        'Escribe un pequeño main que agende una cita usando las falsas e imprima los mensajes que habría enviado.',
        'Cambia solo la fecha de RelojFijo a un día posterior al de la cita y comprueba que la regla "no se agenda en el pasado" la rechaza. Si todavía no tienes esa regla, añádela ahora en AgendadorDeCitas usando _reloj.',
        'Anota cuántas líneas te tomó armar el grafo. Ese número es lo que el contenedor te va a ahorrar mañana.'
      ],
      vet: [
        'Deja las implementaciones falsas en un proyecto aparte o en una carpeta Fakes: te servirán en la semana de testing.',
        'Documenta en docs/diseno.md que Program.cs es la única raíz de composición.'
      ],
      edge: [
        'Evita la inyección por propiedad pública: deja el objeto a medio construir y es fácil olvidar asignarla.',
        'Si un constructor pide más de cuatro dependencias, casi siempre la clase viola SRP. Trata eso antes que el número.',
        'No inyectes el contenedor dentro de tus clases para pedirle cosas: eso es service locator y esconde las dependencias reales.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre inversión de control e inyección de dependencias?', a: 'Inversión de control es el principio general de que algo externo decide el flujo o la construcción. Inyección de dependencias es la técnica concreta de recibir los colaboradores desde afuera, normalmente por constructor.' },
        { q: '¿Necesitas un framework para hacer DI?', a: 'No. Pasar los colaboradores por constructor y armarlos en un único main ya es inyección de dependencias. El contenedor solo automatiza ese armado cuando el grafo crece.' },
        { q: '¿Qué es la raíz de composición y por qué debe ser una sola?', a: 'Es el único lugar donde se decide qué implementación concreta se usa. Si hay varias, la configuración queda dispersa y nunca sabes qué instancia está corriendo en cada parte.' },
        { q: '¿Por qué el reloj debe inyectarse en vez de llamar DateTime.Now?', a: 'Porque DateTime.Now hace el test dependiente del momento en que se ejecuta. Con IRelojSistema puedes fijar la fecha y probar reglas de fin de semana, vencimientos o antigüedad de forma determinista.' }
      ],
      out: 'Program.cs que arma el grafo a mano y tres dobles de prueba funcionando.',
      file: 'src/VetCare.Playground/Program.cs'
    },
    {
      t: 'El contenedor de .NET y los tiempos de vida',
      obj: 'Registrar servicios en el contenedor y elegir bien entre singleton, scoped y transient.',
      why: 'Equivocarte de tiempo de vida es una de las causas más comunes de bugs raros en producción: datos de un usuario que aparecen en la sesión de otro. Saber esto te hace confiable.',
      study: { r: 7, what: 'Lee la página de tiempos de vida de los servicios. Unos 12 minutos. Busca una cosa: qué pasa si un singleton depende de un scoped.',
        pasos: [
          'Lee la introducción (~2 min): qué es el tiempo de vida de un servicio.',
          'Lee "Transient" (~2 min): una instancia nueva cada vez que se pide.',
          'Lee "Scoped" (~3 min): una instancia por petición o por scope. Fíjate en la advertencia sobre resolver un scoped desde un singleton.',
          'Lee "Singleton" (~3 min): una instancia para toda la aplicación, y por qué debe ser segura entre hilos.',
          'Haz una tabla de tres columnas con tus servicios de VetCare y decide el tiempo de vida de cada uno.'
        ] },
      ex: { title: 'Los tres tiempos de vida', body: `Registro

var services = new ServiceCollection();

services.AddSingleton<IRelojSistema, RelojDelSistema>();
services.AddScoped<IRepositorioCitas, PostgresCitaRepository>();
services.AddTransient<INotificador>(_ => new NotificadorEmail("citas@vetcare.local"));
services.AddScoped<AgendadorDeCitas>();

var provider = services.BuildServiceProvider(new ServiceProviderOptions
{
    ValidateScopes = true,    // detecta la trampa de abajo
    ValidateOnBuild = true    // y los registros que faltan, al arrancar
});

Resolución

using var scope = provider.CreateScope();
var agendador = scope.ServiceProvider.GetRequiredService<AgendadorDeCitas>();

Qué significa cada uno

Singleton : una instancia para toda la vida de la app.
            Sirve para cosas sin estado o con estado compartido
            y seguro para concurrencia (configuración, cache, reloj).

Scoped    : una instancia por petición HTTP o por scope creado.
            Es lo correcto para DbContext y repositorios.

Transient : una instancia cada vez que se pide.
            Para objetos baratos y sin estado.

LA TRAMPA (captive dependency)

services.AddSingleton<ServicioReportes>();   // vive para siempre
// y ServicioReportes recibe IRepositorioCitas (scoped)

El singleton se queda con el primer repositorio scoped
y lo sigue usando después de que su scope murió.
Resultado: conexión cerrada, datos viejos, o datos
de otro usuario. Con ValidateScopes = true, .NET lanza
un error en vez de dejarlo pasar en silencio.` },
      steps: [
        'Agrega el paquete Microsoft.Extensions.DependencyInjection al proyecto Playground.',
        'Reemplaza el armado manual de ayer por registros en el contenedor.',
        'Resuelve AgendadorDeCitas desde un scope y comprueba que todo sigue funcionando.',
        'Haz el experimento: registra un contador como singleton, otro como scoped y otro como transient, pídelos dos veces dentro del mismo scope e imprime el id de cada instancia.',
        'Provoca a propósito una captive dependency y, con ValidateScopes = true (como en el ejemplo), mira el error real.'
      ],
      vet: [
        'Define el registro definitivo de VetCare: reloj singleton, repositorios scoped, notificador transient.',
        'Escribe en docs/diseno.md la tabla servicio - tiempo de vida - por qué.'
      ],
      edge: [
        'Un singleton debe ser seguro para concurrencia: varios hilos lo usarán al mismo tiempo.',
        'DbContext siempre scoped. Como singleton acumula entidades rastreadas y revienta la memoria.',
        'Un transient que implementa IDisposable y se pide al proveedor raíz (fuera de un scope) no se libera hasta que muere la app: es una fuga clásica.'
      ],
      quiz: [
        { q: '¿Qué es una captive dependency?', a: 'Cuando un servicio de vida larga recibe uno de vida corta y lo retiene más allá de su scope. El de vida corta queda capturado y se sigue usando cuando ya debería haber muerto, lo que produce conexiones cerradas o datos cruzados.' },
        { q: '¿Por qué DbContext debe ser scoped?', a: 'Porque mantiene un seguimiento de cambios y una conexión por unidad de trabajo. Scoped le da una instancia por petición, que es exactamente la unidad de trabajo de una API.' },
        { q: '¿Cuándo elegir transient sobre scoped?', a: 'Cuando el objeto es barato de crear, no guarda estado entre llamadas y no comparte recursos. Si guarda cualquier estado relevante a la petición, scoped es más seguro.' },
        { q: '¿Qué requisito extra tiene un singleton frente a los otros?', a: 'Debe ser seguro para acceso concurrente, porque múltiples peticiones lo usan al mismo tiempo. Cualquier campo mutable sin sincronización es un bug esperando a ocurrir bajo carga.' }
      ],
      out: 'Contenedor configurado, experimento de tiempos de vida ejecutado y tabla en docs/diseno.md.',
      file: 'src/VetCare.Playground/Program.cs'
    },
    {
      t: 'Patrón Strategy',
      obj: 'Nombrar y aplicar correctamente el patrón que ya usaste en OCP.',
      why: 'Strategy es el patrón más útil del día a día y el que más aparece en entrevistas junto a Repository. Saber cuándo NO usarlo te hace ver senior.',
      study: { r: 3, what: 'Lee las secciones Problem, Solution y Applicability. Unos 12 minutos. Busca una cosa: en qué se diferencia de simplemente pasar un delegado.',
        pasos: [
          'Lee "Intent" y "Problem" (~3 min): el ejemplo de la app de rutas que crece sin control.',
          'Lee "Solution" y "Real-World Analogy" (~3 min).',
          'Mira "Structure" (~2 min) y dibuja las tres piezas: contexto, interfaz de estrategia y estrategias concretas.',
          'Lee "Applicability" y "Pros and Cons" (~4 min): fíjate en el contra que menciona las funciones anónimas. Ahí está la respuesta a la pregunta del día.',
          'Escribe la interfaz de estrategia de VetCare que vas a implementar, con un solo método.'
        ] },
      ex: { title: 'Strategy con interfaz y con delegado', body: `Versión con interfaz (cuando la estrategia tiene estado o varios métodos)

public interface IEstrategiaDescuento
{
    decimal Aplicar(decimal monto, int visitasDelDueno);
}

public class DescuentoClienteFrecuente : IEstrategiaDescuento
{
    private readonly int _visitasMinimas;
    public DescuentoClienteFrecuente(int visitasMinimas)
        => _visitasMinimas = visitasMinimas;

    public decimal Aplicar(decimal monto, int visitasDelDueno)
        => visitasDelDueno >= _visitasMinimas ? monto * 0.9m : monto;
}

public class Facturador
{
    private readonly IEstrategiaDescuento _descuento;
    public Facturador(IEstrategiaDescuento descuento) => _descuento = descuento;

    public decimal Total(decimal bruto, int visitasDelDueno)
        => _descuento.Aplicar(bruto, visitasDelDueno);
}

Versión con delegado (cuando es una sola función sin estado)

public class Facturador
{
    private readonly Func<decimal, int, decimal> _descuento;
    public Facturador(Func<decimal, int, decimal> descuento)
        => _descuento = descuento;
}

var f = new Facturador((monto, visitas) => visitas >= 5 ? monto * 0.9m : monto);

Fíjate en que la estrategia recibe el número de visitas,
no el Dueno entero: solo necesita ese dato.

Regla práctica:
una sola operación sin estado -> delegado.
Varias operaciones, configuración o nombre importante -> interfaz.` },
      steps: [
        'Identifica en VetCare una decisión que cambie según política del negocio: descuento, prioridad de agenda, o política de cancelación.',
        'Define la interfaz de estrategia con un solo método y un nombre que describa la decisión.',
        'Implementa al menos tres estrategias distintas.',
        'Registra la estrategia por defecto en el contenedor y resuélvela por constructor.',
        'Escribe un test que use una estrategia falsa que siempre devuelve cero, para comprobar que el Facturador no tiene lógica propia de descuento.'
      ],
      vet: [
        'Implementa IEstrategiaDescuento con: SinDescuento, ClienteFrecuente, PromocionTemporada.',
        'Deja documentado en docs/diseno.md que cambiar la política no requiere tocar Facturador.'
      ],
      edge: [
        'Si solo hay una estrategia y nunca habrá otra, no uses el patrón: es un archivo extra sin beneficio.',
        'La estrategia no debe conocer a quien la usa. Si necesita llamar de vuelta al contexto, el diseño está invertido.',
        'Cuidado con estrategias que reciben el objeto completo solo para leer un campo: pasa el dato, no el mundo entero.'
      ],
      quiz: [
        { q: '¿Qué problema resuelve Strategy?', a: 'Permite intercambiar un algoritmo en tiempo de ejecución sin que el código que lo usa sepa cuál es. El contexto delega la decisión y así deja de llenarse de condicionales.' },
        { q: '¿Cuándo prefieres un delegado sobre una interfaz?', a: 'Cuando la estrategia es una sola función, sin estado ni configuración, y no necesita un nombre propio en el dominio. El delegado evita crear dos archivos para una línea.' },
        { q: '¿En qué se parece Strategy a lo que hiciste en OCP?', a: 'Es lo mismo: reemplazar un switch por implementaciones intercambiables. OCP es el principio que persigues y Strategy es el nombre del patrón con el que lo consigues.' },
        { q: '¿Cómo testeas una clase que recibe una estrategia?', a: 'Le pasas una estrategia falsa con comportamiento conocido, por ejemplo una que siempre devuelve cero. Así el test verifica la lógica del contexto y no la del algoritmo, que se prueba aparte.' }
      ],
      out: 'Tres estrategias de descuento funcionando e intercambiables desde el contenedor.',
      file: 'src/VetCare.Domain/Facturacion/'
    },
    {
      t: 'Factory: decidir qué construir',
      obj: 'Centralizar la creación de objetos cuando depende de datos de entrada.',
      why: 'Cuando el tipo concreto depende de algo que solo se sabe en tiempo de ejecución, el contenedor no basta. Factory es la respuesta y aparece en todo sistema real.',
      study: { r: 4, what: 'Lee Problem, Solution y "Relations with Other Patterns". Unos 12 minutos. Busca una cosa: la diferencia entre factory method y simple factory.',
        pasos: [
          'Lee "Intent" y "Problem" (~3 min): el ejemplo de la logística con camiones que luego necesita barcos.',
          'Lee "Solution" (~3 min) y mira "Structure" (~2 min).',
          'Lee "Applicability" (~2 min).',
          'Lee "Relations with Other Patterns" (~2 min) y apunta la diferencia con Abstract Factory y con una simple función de creación.',
          'Escribe la lista de tipos de documento clínico que tu fábrica debe saber crear y qué dato de entrada decide cuál.'
        ] },
      ex: { title: 'Factory para documentos clínicos', body: `El problema: el tipo depende de un dato de entrada

var tipo = request.TipoDocumento;  // "receta", "vacunacion", "diagnostico"

El contenedor no puede decidir esto: no conoce el request.

SIMPLE FACTORY

public interface IFabricaDocumentos
{
    DocumentoClinico Crear(string tipo, Guid mascotaId, Guid veterinarioId);
}

public class FabricaDocumentos : IFabricaDocumentos
{
    private readonly IRelojSistema _reloj;
    public FabricaDocumentos(IRelojSistema reloj) => _reloj = reloj;

    public DocumentoClinico Crear(string tipo, Guid mascotaId, Guid veterinarioId)
        => tipo switch
    {
        "receta"      => new Receta(mascotaId, veterinarioId, _reloj.Ahora()),
        "vacunacion"  => new Vacunacion(mascotaId, veterinarioId, _reloj.Ahora()),
        "diagnostico" => new Diagnostico(mascotaId, veterinarioId, _reloj.Ahora()),
        _ => throw new ArgumentException("Tipo de documento desconocido: " + tipo)
    };
}

Por qué vale la pena:
- El switch existe en UN solo lugar, no repartido.
- La fábrica recibe sus propias dependencias por DI.
- El código cliente trabaja solo con DocumentoClinico.

Ojo con los constructores: aquí cada documento recibe
mascota, veterinario y fecha. Si tus clases de la semana 6
piden más datos (por ejemplo, el medicamento de la receta),
añádelos a Crear como parámetros o en un objeto
SolicitudDocumento.

Lo que NO debes hacer: registrar Receta o Vacunacion en el
contenedor. Son entidades con datos propios, y el
contenedor es para servicios. (Los "keyed services" de
.NET 8 o posterior sí sirven para elegir entre SERVICIOS,
por ejemplo entre varios INotificador:
  services.AddKeyedTransient<INotificador, NotificadorSms>("sms");)` },
      steps: [
        'Crea IFabricaDocumentos y su implementación en el dominio.',
        'Haz que la fábrica reciba IRelojSistema por constructor y registra la fábrica en el contenedor.',
        'Reemplaza en el código cliente todo new Receta o new Vacunacion por una llamada a la fábrica.',
        'Agrega un tipo nuevo y comprueba que solo tocaste la fábrica y el archivo nuevo.',
        'Haz que un tipo desconocido lance una excepción con mensaje claro, no un null silencioso.'
      ],
      vet: [
        'Aplica la fábrica a DocumentoClinico de la semana 6.',
        'Anota en docs/diseno.md por qué aquí sí se acepta un switch: concentra la decisión en un punto conocido.'
      ],
      edge: [
        'Una fábrica que solo hace new de una clase fija no aporta nada: quítala.',
        'No pongas lógica de negocio dentro de la fábrica. Su trabajo es construir, no calcular.',
        'Si la fábrica necesita diez parámetros, el problema está en el constructor del objeto, no en la fábrica.'
      ],
      quiz: [
        { q: '¿Por qué el contenedor de DI no reemplaza a una factory?', a: 'Porque el contenedor resuelve dependencias conocidas al arrancar, y la factory decide el tipo concreto con datos que solo existen en tiempo de ejecución, como un campo del request.' },
        { q: '¿Es aceptable un switch dentro de una factory?', a: 'Sí. El objetivo de OCP es que el switch no esté repartido por todo el código. Concentrarlo en un único punto conocido y testeable es precisamente la solución.' },
        { q: '¿Qué debe hacer la factory ante un tipo desconocido?', a: 'Lanzar una excepción con el valor recibido en el mensaje. Devolver null traslada el fallo a otro punto lejano donde será mucho más difícil de diagnosticar.' },
        { q: '¿Cuál es la señal de que una factory sobra?', a: 'Que siempre construye el mismo tipo y no toma ninguna decisión. En ese caso es una capa de indirección vacía y conviene llamar al constructor directamente.' }
      ],
      out: 'IFabricaDocumentos registrada en el contenedor y usada por el código cliente.',
      file: 'src/VetCare.Domain/Clinica/FabricaDocumentos.cs'
    },
    {
      t: 'Adapter: hablar con lo externo',
      obj: 'Envolver una librería o API externa para que tu dominio no dependa de su forma.',
      why: 'Toda app real integra algo externo: pasarela de pago, SMS, almacenamiento. Adapter es lo que evita que un cambio de proveedor se convierta en una reescritura.',
      study: { r: 5, what: 'Lee Problem, Solution y el ejemplo de código. Unos 12 minutos. Busca una cosa: por qué el adaptador implementa TU interfaz, no la del proveedor.',
        pasos: [
          'Lee "Intent" y "Problem" (~3 min): la app que recibe XML y la librería que solo entiende JSON.',
          'Lee "Solution" y "Real-World Analogy" (~3 min): el adaptador de enchufe.',
          'En "Structure" lee "Object adapter" (~2 min); salta "Class adapter", C# no tiene herencia múltiple de clases.',
          'Abre "Code Examples", elige C# y lee el ejemplo (~4 min).',
          'Escribe la interfaz de tu dominio con palabras de VetCare (por ejemplo AvisarDueno) antes de mirar la API del proveedor.'
        ] },
      ex: { title: 'Adaptar un proveedor de notificaciones', body: `Tu dominio define lo que necesita

public interface INotificador      // la misma de la semana 6
{
    Task EnviarAsync(string destino, string mensaje);
}

El proveedor tiene otra forma, que tú no controlas.
(SmsProClient es un proveedor inventado; cada SDK real
tiene su propia forma, pero la idea es la misma.)

public class SmsProClient          // viene del paquete del proveedor
{
    public SendResult Send(string from, string to, string body, SendOptions o) { ... }
}

El adaptador traduce entre ambos mundos

public class NotificadorSms : INotificador
{
    private readonly SmsProClient _cliente;
    private readonly string _remitente;

    public NotificadorSms(SmsProClient cliente, string remitente)
    {
        _cliente = cliente;
        _remitente = remitente;
    }

    public Task EnviarAsync(string destino, string mensaje)
    {
        var r = _cliente.Send(_remitente, destino, mensaje, new SendOptions());
        if (!r.Ok) throw new NotificacionFallidaException(r.Error);
        return Task.CompletedTask;
    }
}

Beneficios concretos:
- El dominio nunca menciona SmsPro ni SendResult.
- Cambiar a otro proveedor es escribir otro adaptador.
- El tipo de error del proveedor se traduce a uno tuyo.
- En tests usas NotificadorFalso y no tocas la red.` },
      steps: [
        'Elige una dependencia externa de VetCare: envío de correo, SMS, o almacenamiento de archivos.',
        'Define la interfaz en el dominio con el vocabulario de tu negocio, no el del proveedor.',
        'Crea el adaptador en src/VetCare.Infrastructure que implemente esa interfaz.',
        'Traduce los errores del proveedor a excepciones propias de tu dominio.',
        'Registra el adaptador en el contenedor y comprueba que src/VetCare.Domain no tiene ningún using del paquete externo.'
      ],
      vet: [
        'Escribe dos adaptadores para INotificador: uno de consola y uno de correo. Alterna entre ambos solo cambiando el registro.',
        'Agrega a docs/diseno.md la lista de dependencias externas y su adaptador.'
      ],
      edge: [
        'No dejes escapar tipos del proveedor en la firma de tu interfaz: si tu método devuelve un SendResult, el adaptador no sirvió de nada.',
        'Traduce también las excepciones. Si dejas salir una SmsProException, tu capa superior queda acoplada igual.',
        'Un adaptador que es copia uno a uno de la API del proveedor suele indicar que definiste la interfaz mirando al proveedor en vez de a tu necesidad.'
      ],
      quiz: [
        { q: '¿Quién define la interfaz que implementa un adaptador?', a: 'Tu dominio, según lo que necesita. Si la define el proveedor, el adaptador solo renombra métodos y el acoplamiento sigue intacto.' },
        { q: '¿Por qué hay que traducir las excepciones del proveedor?', a: 'Porque si tu capa de aplicación captura excepciones específicas del proveedor, queda acoplada a él aunque exista la interfaz. Traducirlas mantiene la frontera limpia de verdad.' },
        { q: '¿Cómo se nota en el código que un adaptador falló en su propósito?', a: 'Cuando ves tipos o espacios de nombres del paquete externo en el proyecto de dominio, ya sea en firmas, en excepciones capturadas o en enums de configuración.' },
        { q: '¿Qué ventaja da Adapter para los tests?', a: 'Permite sustituir toda la integración externa por una implementación en memoria, así que los tests corren rápido, sin red y de forma determinista.' }
      ],
      out: 'Dos adaptadores de INotificador intercambiables y cero referencias externas en Domain.',
      file: 'src/VetCare.Infrastructure/Notificaciones/'
    },
    {
      t: 'Repository y cierre de patrones (examen de la semana)',
      obj: 'Implementar el patrón Repository y defender cuándo usar cada patrón visto.',
      why: 'Repository es el patrón que más vas a escribir y también el más discutido. Saber sus críticas, no solo sus ventajas, es lo que distingue a alguien que lo entiende de alguien que lo copia.',
      study: { r: 6, what: 'Lee la entrada Repository del catálogo de Fowler, es corta, y luego repasa tus notas de la semana. Unos 12 minutos. Busca una cosa: por qué se dice que un repositorio se comporta como una colección en memoria.',
        pasos: [
          'Lee la entrada completa de Fowler (~5 min): el repositorio media entre el dominio y el mapeo de datos.',
          'Subraya la idea de que el repositorio se comporta como una colección en memoria: añadir, quitar y buscar con criterios.',
          'Fíjate en la parte sobre criterios de búsqueda: por eso tus métodos deben decir intención (CitasDelDia) y no exponer consultas genéricas.',
          'Repasa tus notas de Strategy, Factory y Adapter y escribe para cada patrón cuándo NO lo usarías.'
        ] },
      ex: { title: 'Repository bien definido', body: `MAL: repositorio genérico que filtra la base entera

public interface IRepositorio<T>
{
    IQueryable<T> Query();   // deja escapar la base de datos
}

Esto obliga al llamador a escribir sus propias consultas
LINQ y reparte la lógica de consulta por todo el código.

BIEN: métodos que expresan intención del negocio

public interface IRepositorioCitas
{
    Task<Cita?> PorIdAsync(Guid id);
    Task<IReadOnlyList<Cita>> DelDiaAsync(DateOnly dia, Guid veterinarioId);
    Task<bool> ExisteSolapadaAsync(Guid veterinarioId, DateTime inicio, DateTime fin);
    Task AgregarAsync(Cita c);
    Task GuardarCambiosAsync();
}

Implementación en memoria (para tests)

public class RepositorioCitasEnMemoria : IRepositorioCitas
{
    private readonly List<Cita> _datos = new();

    public Task<Cita?> PorIdAsync(Guid id)
        => Task.FromResult(_datos.FirstOrDefault(c => c.Id == id));

    public Task<IReadOnlyList<Cita>> DelDiaAsync(DateOnly dia, Guid vetId)
        => Task.FromResult<IReadOnlyList<Cita>>(_datos
               .Where(c => c.VeterinarioId == vetId &&
                           DateOnly.FromDateTime(c.Inicio) == dia)
               .OrderBy(c => c.Inicio)
               .ToList());

    public Task<bool> ExisteSolapadaAsync(Guid vetId, DateTime ini, DateTime fin)
        => Task.FromResult(_datos.Any(c =>
               c.VeterinarioId == vetId && c.Inicio < fin && ini < c.Fin));

    public Task AgregarAsync(Cita c) { _datos.Add(c); return Task.CompletedTask; }
    public Task GuardarCambiosAsync() => Task.CompletedTask;
}

La crítica legítima:
EF Core YA es un repositorio y una unidad de trabajo.
Envolverlo otra vez puede ser una capa inútil.
Se justifica cuando quieres testear sin base de datos
o cuando quieres nombrar las consultas del negocio.` },
      steps: [
        'Define IRepositorioCitas con métodos que digan intención, nunca con IQueryable.',
        'Implementa la versión en memoria completa y úsala en el Playground.',
        'Escribe la regla de solapamiento de citas y pruébala contra el repositorio en memoria.',
        'Repasa la semana: escribe en docs/diseno.md una ficha por patrón con problema, solución y cuándo NO usarlo.',
        'Defiende en voz alta durante cinco minutos: por qué usaste Strategy para descuentos, Factory para documentos, Adapter para notificaciones y Repository para citas.'
      ],
      vet: [
        'Deja el repositorio en memoria listo: será la base de los tests de la semana 13.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/diseno.md dentro de una semana.'
      ],
      edge: [
        'Un repositorio genérico con un solo método Query no es un repositorio, es un alias de la base de datos.',
        'No devuelvas entidades a medio cargar desde el repositorio: el llamador no puede saber qué falta.',
        'Si tu capa de aplicación encadena cinco llamadas al repositorio para una operación, probablemente falta un método que exprese esa operación.'
      ],
      quiz: [
        { q: '¿Por qué un repositorio no debe exponer IQueryable?', a: 'Porque filtra la abstracción: el llamador acaba escribiendo consultas que dependen del proveedor y puede generar SQL desastroso sin darse cuenta. Además vuelve imposible una implementación en memoria fiel.' },
        { q: '¿Cuál es la crítica más fuerte al patrón Repository en EF Core?', a: 'Que DbContext ya implementa repositorio y unidad de trabajo, así que envolverlo puede ser una capa que no agrega nada. Se justifica cuando quieres testear sin base o nombrar las consultas en lenguaje del negocio.' },
        { q: '¿Cómo eliges entre Strategy y Factory ante un problema nuevo?', a: 'Strategy si lo que varía es cómo se hace algo y quieres intercambiar el algoritmo. Factory si lo que varía es qué objeto construir y la decisión depende de datos de entrada.' },
        { q: 'Resume qué ganaste esta semana en una frase.', a: 'Que los patrones son nombres para separar lo que cambia de lo que no: Strategy separa algoritmos, Factory separa construcción, Adapter separa lo externo y Repository separa la persistencia, y DI es el mecanismo que conecta todas esas piezas en un solo lugar.' }
      ],
      out: 'docs/diseno.md con una ficha por patrón y el repositorio en memoria funcionando.',
      file: 'docs/diseno.md'
    }
  ]
}
]);
