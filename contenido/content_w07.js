window.WEEKS = (window.WEEKS || []).concat([
{
  n: 7,
  phase: 'Diseño y SOLID',
  title: 'Que cada pieza tenga una sola razón para cambiar',
  idea: 'Ya sabes escribir clases. Ahora toca decidir dónde poner cada cosa. Un buen diseño no es el que tiene más clases, es el que hace que un cambio futuro toque un solo archivo. Esta semana aprendes a medir eso con dos ideas (cohesión y acoplamiento) y a aplicarlo con los cinco principios SOLID.',
  res: [
    { t: 'Microsoft Learn — Architectural principles',
      u: 'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles',
      note: 'Resumen oficial de separación de responsabilidades, encapsulación e inversión de dependencias, con ejemplos en .NET.' },
    { t: 'Robert C. Martin — The Single Responsibility Principle', u: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html', note: 'El autor de SOLID aclara qué significa de verdad "una razón para cambiar".' },
    { t: 'Martin Fowler — Reducing coupling',
      u: 'https://martinfowler.com/ieeeSoftware/coupling.pdf',
      note: 'Cuatro páginas del autor más citado del tema. Te da vocabulario para defender decisiones en una entrevista.' },
    { t: 'Robert C. Martin — The Open Closed Principle', u: 'https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html', note: 'OCP explicado por su divulgador, corto y directo.' },
    { t: 'Wikipedia — Liskov substitution principle', u: 'https://en.wikipedia.org/wiki/Liskov_substitution_principle', note: 'La definición formal y por qué importa al heredar.' }
  ],
  days: [
    {
      t: 'Cohesión: qué vive junto',
      obj: 'Reconocer si una clase tiene un propósito claro o es un cajón de sastre.',
      why: 'En entrevistas te van a mostrar una clase de 600 líneas y preguntar qué está mal. La respuesta profesional empieza con cohesión: esta clase hace demasiadas cosas no relacionadas.',
      study: { r: 0, what: 'Lee solo la sección "Separation of concerns" y "Encapsulation". Unos 10 minutos. Busca una cosa: qué significa que un componente tenga "una responsabilidad bien definida".',
        pasos: [
          'Lee la introducción de "Common design principles" (~2 min).',
          'Lee "Separation of concerns" (~4 min): separar por tipo de trabajo, no por tamaño.',
          'Lee "Encapsulation" (~3 min): cada parte esconde su funcionamiento y expone un contrato.',
          'Lee "Single responsibility" (~2 min): verás que es la misma idea vista desde otro ángulo.',
          'Escribe la frase "esta clase existe para..." de tus dos clases más grandes antes de empezar los pasos.'
        ] },
      ex: { title: 'Baja cohesión vs alta cohesión', body: `(Esquema: los cuerpos de los métodos se omiten.)

MAL (baja cohesión: tres temas distintos en una clase)

public class GestorCitas
{
    public void AgendarCita(Cita c) { }
    public void EnviarEmailConfirmacion(string correo) { }
    public decimal CalcularImpuesto(decimal monto) { }
    public void GuardarEnArchivoLog(string texto) { }
}

Si cambia el proveedor de email, tocas GestorCitas.
Si cambia el IVA, tocas GestorCitas.
Si cambia la regla de agendado, tocas GestorCitas.
Tres razones distintas para modificar el mismo archivo.

BIEN (cada clase con un tema)

public class AgendadorDeCitas
{
    public void Agendar(Cita c) { }
    public void Reprogramar(Cita c, DateTime nueva) { }
    public void Cancelar(Cita c, string motivo) { }
}

public class NotificadorEmail
{
    public void EnviarConfirmacion(string correo, Cita c) { }
}

public class CalculadoraImpuestos
{
    public decimal Calcular(decimal monto) { }
}

Ahora los métodos de cada clase hablan del mismo tema
y usan los mismos datos. Eso es alta cohesión.` },
      steps: [
        'Abre src/VetCare.Domain y lista en una hoja cada clase que tengas con sus métodos.',
        'Para cada clase escribe en una sola frase: esta clase existe para ____. Si necesitas la palabra "y", es sospechosa.',
        'Marca con rojo toda clase cuyos métodos no compartan los mismos campos privados. Ese es el síntoma clásico de baja cohesión.',
        'Elige la peor y parte sus métodos en dos clases nuevas con nombres que digan el tema, no el mecanismo.',
        'Compila. Si rompiste 20 archivos al partir una clase, anota ese número: te sirve mañana para hablar de acoplamiento.'
      ],
      vet: [
        'Revisa tu clase Cita: si tiene métodos de cálculo de precio, muévelos fuera. El precio es otro tema.',
        'Crea docs/diseno.md y escribe la frase de una línea de cada clase del dominio.'
      ],
      edge: [
        'Alta cohesión no significa clases diminutas. Una clase de 200 líneas que solo habla de agendar citas está bien.',
        'Cuidado con las clases llamadas Helper, Manager, Utils o Common: casi siempre son cajones de sastre.',
        'Partir por capricho crea el problema contrario: diez clases que siempre cambian juntas. Si siempre se modifican a la vez, quizás deberían ser una.'
      ],
      quiz: [
        { q: '¿Cómo detectas baja cohesión sin leer todo el código?', a: 'Mira si los métodos de la clase usan los mismos campos privados. Si el método A toca solo _repo y el método B toca solo _smtp, son dos clases disfrazadas de una.' },
        { q: '¿Por qué el nombre "GestorCitas" es peor que "AgendadorDeCitas"?', a: 'Gestor no dice nada, así que cualquier método parece caber ahí. Un nombre específico actúa como filtro: si el método no encaja en el nombre, no encaja en la clase.' },
        { q: '¿Qué relación hay entre cohesión y facilidad de testear?', a: 'Una clase cohesiva necesita pocas dependencias para construirse, así que el test se arma en dos líneas. Una clase cajón de sastre exige simular email, base de datos y reloj solo para probar una suma.' },
        { q: '¿Es posible tener demasiadas clases pequeñas?', a: 'Sí. Si para entender un flujo debes abrir ocho archivos y todos cambian juntos cuando cambia un requisito, la separación no te está dando nada y conviene unirlas.' }
      ],
      out: 'docs/diseno.md con la frase de propósito de cada clase y al menos una clase partida.',
      file: 'docs/diseno.md'
    },
    {
      t: 'Acoplamiento: quién depende de quién',
      obj: 'Medir cuánto se enteran unas clases de otras y reducirlo con abstracciones.',
      why: 'El acoplamiento es lo que decide si un cambio pequeño cuesta una hora o tres días. Es la métrica que más usan los tech leads para aceptar o rechazar un pull request.',
      study: { r: 2, what: 'Lee el PDF de Fowler completo, son cuatro páginas. Unos 15 minutos. Busca una cosa: la diferencia entre acoplamiento necesario y acoplamiento accidental.',
        pasos: [
          'Lee los primeros párrafos (~3 min) y copia la definición de Fowler: si cambiar un módulo obliga a cambiar otro, hay acoplamiento.',
          'Fíjate en por qué dice que la duplicación siempre implica acoplamiento, y por qué prohibir el acoplamiento solo lo esconde bajo la alfombra (~2 min).',
          'Lee la sección Look at dependencies (~5 min): el foco va en los módulos grandes y en la dirección de las dependencias. Copia su diagrama de interfaz de usuario, dominio y base de datos.',
          'Lee el resto (~5 min) fijándote en cómo usa una interfaz para invertir una dependencia molesta.',
          'Dibuja el mismo tipo de diagrama para VetCare y marca con rojo cualquier flecha que salga del dominio hacia la infraestructura.'
        ] },
      ex: { title: 'Acoplamiento fuerte vs débil', body: `FUERTE: la clase construye lo que necesita

public class AgendadorDeCitas
{
    private readonly SmtpEmailSender _email = new SmtpEmailSender("smtp.gmail.com");
    private readonly SqlCitaRepository _repo = new SqlCitaRepository("Host=localhost...");

    public void Agendar(Cita c, string correoDueno)
    {
        _repo.Guardar(c);
        _email.Enviar(correoDueno, "Cita confirmada");
    }
}

Problemas:
- No puedes testear sin servidor SMTP ni base de datos real.
- Cambiar de Gmail a SendGrid obliga a tocar esta clase.
- La cadena de conexión está escondida en el dominio.

DÉBIL: la clase recibe contratos

public class AgendadorDeCitas
{
    private readonly INotificador _notificador;
    private readonly IRepositorioCitas _repo;

    public AgendadorDeCitas(IRepositorioCitas repo, INotificador notificador)
    {
        _repo = repo;
        _notificador = notificador;
    }

    public async Task AgendarAsync(Cita c, string correoDueno)
    {
        _repo.Guardar(c);
        await _notificador.EnviarAsync(correoDueno, "Cita confirmada");
    }
}

Ahora en un test pasas implementaciones falsas y la clase
no sabe si detrás hay Gmail, SendGrid o un archivo de texto.` },
      steps: [
        'Busca en tu código la palabra new seguida de una clase de infraestructura (repositorio, email, http, archivo). Cada aparición dentro del dominio es acoplamiento que debes quitar.',
        'Por cada una, define una interfaz en el dominio con solo los métodos que realmente usas.',
        'Mueve la clase concreta a src/VetCare.Infrastructure y haz que implemente la interfaz.',
        'Cambia la clase del dominio para recibir la interfaz por constructor.',
        'Cuenta cuántos using de infraestructura quedan en src/VetCare.Domain. La meta es cero.'
      ],
      vet: [
        'Aplica esto a INotificador y IRepositorioCitas que ya definiste en la semana 6.',
        'Anota en docs/diseno.md la regla: el proyecto Domain no referencia a ningún otro proyecto.'
      ],
      edge: [
        'Una interfaz con 20 métodos no reduce acoplamiento, solo lo disfraza. La interfaz la define quien la usa, no quien la implementa.',
        'Acoplarte a tipos del lenguaje (string, DateTime, List) es normal y no hay que abstraerlo.',
        'Si una interfaz tiene una sola implementación y nunca vas a tener otra ni a testear ese punto, puede que no la necesites todavía.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre acoplamiento necesario y accidental?', a: 'El necesario viene del problema: agendar citas necesita guardarlas en algún lado. El accidental viene de la implementación: agendar citas no necesita saber que la base es PostgreSQL. El primero se acepta, el segundo se esconde tras una interfaz.' },
        { q: '¿Por qué la interfaz debe vivir en el proyecto del dominio y no en infraestructura?', a: 'Porque así la flecha de dependencia apunta hacia adentro: infraestructura conoce al dominio y no al revés. Si la interfaz viviera en infraestructura, el dominio tendría que referenciarla y volverías al acoplamiento original.' },
        { q: '¿Qué síntoma en los tests delata acoplamiento fuerte?', a: 'Que para probar una regla simple necesitas levantar base de datos, red o esperar tiempo real. Si el arrange del test ocupa 30 líneas, la clase depende de demasiadas cosas concretas.' },
        { q: '¿Reducir acoplamiento siempre mejora el diseño?', a: 'No. Cada abstracción agrega un archivo y un salto mental al leer el código. Se justifica cuando hay más de una implementación real, cuando necesitas testear, o cuando la dependencia es a algo externo e inestable.' }
      ],
      out: 'El proyecto Domain compila sin referencias a infraestructura.',
      file: 'docs/diseno.md'
    },
    {
      t: 'SRP: una sola razón para cambiar',
      obj: 'Aplicar el principio de responsabilidad única identificando quién pide cada cambio.',
      why: 'SRP es la pregunta uno de casi toda entrevista sobre SOLID, y la mayoría lo explica mal diciendo "una clase hace una cosa". Si lo explicas por actores, destacas.',
      study: { r: 1, what: 'Lee el artículo de Robert C. Martin completo. Unos 10 minutos. Busca una cosa: la definición correcta habla de razones para cambiar, es decir, de las personas o roles que piden cambios, no de cantidad de métodos.',
        pasos: [
          'Lee el artículo de principio a fin (~8 min).',
          'Subraya la frase que dice que el principio trata sobre personas: quién pide el cambio.',
          'Fíjate en el ejemplo de la clase con métodos para el director financiero, el de operaciones y el de tecnología. Escribe el equivalente en VetCare: contabilidad, recepción y veterinario.',
          'Escribe con tus palabras por qué juntar código de dos actores provoca que un cambio de uno rompa al otro.'
        ] },
      ex: { title: 'SRP por actores', body: `(Esquema: los cuerpos de los métodos se omiten.)

Una clase con tres jefes distintos:

public class Factura
{
    public decimal CalcularTotal() { }      // lo define Contabilidad
    public string GenerarPdf() { }          // lo define Diseño / Marketing
    public void GuardarEnBaseDeDatos() { }  // lo define el equipo de datos
}

Si Contabilidad cambia el IVA, el archivo se toca.
Si Marketing quiere otro logo, el mismo archivo se toca.
Dos equipos editando el mismo archivo es como se producen
los conflictos y los bugs por efecto colateral.

Separado por actor:

public class Factura                 // reglas de negocio
{
    public decimal CalcularTotal() { }
}

public class GeneradorPdfFactura     // presentación
{
    public byte[] Generar(Factura f) { }
}

public class RepositorioFacturas     // persistencia
{
    public void Guardar(Factura f) { }
}

Pregunta clave para aplicar SRP:
¿quién, como persona o área del negocio,
puede pedir que esto cambie?` },
      steps: [
        'Toma tus tres clases más grandes y haz una tabla: método, quién pediría un cambio en él (contabilidad, recepción, veterinario, equipo técnico).',
        'Si una clase tiene métodos de dos actores distintos, sepárala por actor.',
        'Nombra las clases nuevas con el sustantivo del rol: CalculadoraDeTotales, GeneradorDeRecibo, RepositorioDeFacturas.',
        'Verifica que la clase de dominio no mencione formatos (pdf, json, html) ni tecnologías (sql, http).',
        'Escribe en docs/diseno.md la tabla actor-clase. Esa tabla es tu respuesta de entrevista.'
      ],
      vet: [
        'En VetCare los actores son: recepción (agenda), veterinario (historia clínica), contabilidad (facturas), dueño (notificaciones).',
        'Revisa que ninguna clase mezcle reglas de dos de esos actores.'
      ],
      edge: [
        'SRP no prohíbe que una clase tenga muchos métodos, prohíbe que tenga muchos jefes.',
        'Un DTO con 30 propiedades no viola SRP: no tiene comportamiento, solo transporta datos.',
        'Llevar SRP al extremo produce clases con un solo método llamado Execute. Eso es un procedimiento con disfraz, no diseño.'
      ],
      quiz: [
        { q: '¿Cuál es la definición precisa de SRP?', a: 'Un módulo debe tener una sola razón para cambiar, entendida como un solo actor o área del negocio que pueda solicitar ese cambio. No se trata de contar métodos.' },
        { q: '¿Por qué mezclar cálculo de total y generación de PDF es un riesgo real?', a: 'Porque contabilidad y diseño editan el mismo archivo. Un cambio de formato puede romper el cálculo sin que nadie lo note hasta que las facturas salgan mal.' },
        { q: '¿Un DTO con muchas propiedades viola SRP?', a: 'No. SRP habla de razones de cambio en el comportamiento. Un contenedor de datos sin lógica no tiene comportamiento que pueda romperse por motivos distintos.' },
        { q: '¿Cómo respondes a "pero así tengo más archivos"?', a: 'Más archivos pequeños y enfocados se leen y se prueban más rápido que uno grande. El costo real no es la cantidad de archivos sino cuántos tienes que abrir para entender o cambiar algo.' }
      ],
      out: 'Tabla actor-clase en docs/diseno.md y al menos una clase separada por actor.',
      file: 'docs/diseno.md'
    },
    {
      t: 'OCP: abierto a extensión, cerrado a modificación',
      obj: 'Agregar un caso nuevo sin editar el código que ya funciona.',
      why: 'Cada vez que editas una clase probada corres el riesgo de romperla. OCP es la técnica concreta para crecer sin volver a arriesgar lo que ya pasa en producción.',
      study: { r: 3, what: 'Lee el artículo de Robert C. Martin sobre OCP. Unos 10 minutos. Busca una cosa: cómo un switch por tipo se convierte en polimorfismo, y por qué eso permite añadir comportamiento sin tocar código que ya funciona.',
        pasos: [
          'Lee el artículo hasta "Is this Absurd?" (~4 min): qué significa abierto a extensión y cerrado a modificación.',
          'Lee "Is this Absurd?" (~2 min): la objeción típica y su respuesta.',
          'Lee "Plugin Architecture" (~3 min): el ejemplo de los plugins es OCP en estado puro.',
          'Lee "Conclusion" (~1 min).',
          'Elige el switch por tipo más largo de tu código y escribe qué interfaz y qué clases saldrían de él.'
        ] },
      ex: { title: 'De switch a estrategias', body: `CERRADO AL CRECIMIENTO (cada tarifa nueva edita este método)

public decimal Calcular(TipoServicio tipo, decimal baseP)
{
    switch (tipo)
    {
        case TipoServicio.Consulta:   return baseP;
        case TipoServicio.Urgencia:   return baseP * 1.5m;
        case TipoServicio.Vacunacion: return baseP * 0.9m;
        default: throw new ArgumentException();
    }
}

ABIERTO AL CRECIMIENTO

// Ojo: no es la IReglaPrecio de la semana 6. Allí las reglas
// se encadenaban; aquí cada tarifa decide el precio entero.
public interface ITarifa
{
    bool AplicaA(TipoServicio tipo);
    decimal Calcular(decimal baseP);
}

public class TarifaUrgencia : ITarifa
{
    public bool AplicaA(TipoServicio t) => t == TipoServicio.Urgencia;
    public decimal Calcular(decimal baseP) => baseP * 1.5m;
}

public class CalculadoraPrecio
{
    private readonly IEnumerable<ITarifa> _tarifas;
    public CalculadoraPrecio(IEnumerable<ITarifa> tarifas) => _tarifas = tarifas;

    public decimal Calcular(TipoServicio tipo, decimal baseP)
    {
        var tarifa = _tarifas.First(t => t.AplicaA(tipo));
        return tarifa.Calcular(baseP);
    }
}

Agregar "TarifaCirugia" ahora es crear un archivo nuevo.
CalculadoraPrecio no se toca y sus tests siguen verdes.` },
      steps: [
        'Busca en tu código todo switch o cadena de if que decida según un tipo o un enum.',
        'Para el más grande, define una interfaz con el método que varía.',
        'Crea una clase por cada rama del switch.',
        'Deja que la clase original reciba la colección de implementaciones y elija la que aplica.',
        'Agrega una rama nueva sin tocar ningún archivo existente. Si lo logras, cumpliste OCP.'
      ],
      vet: [
        'Aplica esto a las tarifas de VetCare: consulta, urgencia, vacunación, cirugía, peluquería.',
        'Agrega una tarifa de "control post operatorio" y verifica que solo creaste un archivo.'
      ],
      edge: [
        'No todo switch merece polimorfismo. Si el enum nunca va a crecer (días de la semana), el switch es más claro.',
        'Si ninguna regla aplica, decide el comportamiento: excepción clara o una regla por defecto explícita. No devuelvas cero en silencio.',
        'OCP se aplica donde ya viste que el cambio ocurre. Adivinar dónde crecerá el sistema produce abstracciones inútiles.'
      ],
      quiz: [
        { q: '¿Qué significa "cerrado a modificación"?', a: 'Que para agregar comportamiento nuevo no necesitas editar el archivo existente, solo agregar uno. El código probado se queda intacto y por tanto sigue siendo confiable.' },
        { q: '¿Cuál es la señal de que falta OCP?', a: 'Que cada requisito nuevo del mismo tipo te obliga a volver al mismo switch o a la misma cadena de if. Ese archivo crece sin límite y concentra todos los bugs.' },
        { q: '¿Qué desventaja tiene la versión con estrategias?', a: 'Que la lógica queda repartida en varios archivos, así que leer todas las tarifas de un vistazo cuesta más. Se paga esa legibilidad a cambio de poder crecer sin riesgo.' },
        { q: '¿Cuándo NO aplicar OCP?', a: 'Cuando el conjunto de casos es fijo y conocido, o cuando solo tienes dos ramas y no hay evidencia de que vayan a aumentar. Abstraer antes de tiempo agrega complejidad sin beneficio.' }
      ],
      out: 'CalculadoraPrecio con reglas intercambiables y una tarifa nueva agregada sin tocar código viejo.',
      file: 'src/VetCare.Domain/Precios/'
    },
    {
      t: 'LSP: los hijos deben poder reemplazar al padre',
      obj: 'Detectar herencias que mienten y corregirlas.',
      why: 'LSP es el principio que más gente recita sin entender. Saber dar el contraejemplo del cuadrado y el rectángulo, y uno de tu propio proyecto, te separa del resto.',
      study: { r: 4, what: 'Lee la introducción y la sección "Principle". Unos 10 minutos. Busca una cosa: por qué lanzar NotImplementedException en una subclase rompe el principio.',
        pasos: [
          'Lee la introducción (~2 min) y la sección "Principle" (~4 min): precondiciones, postcondiciones e invariantes.',
          'Lee "Violation" (~3 min): el ejemplo clásico del cuadrado y el rectángulo.',
          'Escribe con tus palabras: un hijo no puede pedir más que el padre ni prometer menos que el padre.',
          'Aplícalo a NotImplementedException: el padre prometía hacer algo y el hijo no lo hace. Por eso rompe el principio.'
        ] },
      ex: { title: 'Herencia que miente', body: `VIOLACIÓN

public class DocumentoClinico
{
    public virtual void Firmar(Veterinario v) { }
    public virtual void Imprimir() { }
}

public class NotaBorrador : DocumentoClinico
{
    public override void Firmar(Veterinario v)
        => throw new NotSupportedException("Un borrador no se firma");
}

Cualquier código que reciba DocumentoClinico y llame Firmar
va a explotar si le pasan un borrador. El hijo no puede
reemplazar al padre, así que la herencia es falsa.

CORRECCIÓN: separar por capacidad real

public abstract class DocumentoClinico
{
    public abstract void Imprimir();
}

public interface IFirmable
{
    void Firmar(Veterinario v);
}

public class Receta : DocumentoClinico, IFirmable
{
    public override void Imprimir() { }
    public void Firmar(Veterinario v) { }
}

public class NotaBorrador : DocumentoClinico
{
    public override void Imprimir() { }
}

Ahora el tipo dice la verdad: solo lo firmable se firma.` },
      steps: [
        'Busca en tu código cualquier override que lance NotImplementedException, NotSupportedException o que ignore el argumento.',
        'Busca también overrides que endurezcan la precondición (el padre acepta cualquier número y el hijo exige positivo).',
        'Para cada caso decide: o el hijo no debería heredar de ahí, o el padre promete demasiado.',
        'Mueve el método problemático a una interfaz aparte y haz que solo lo implemente quien realmente puede.',
        'Escribe un test que reciba la clase base y funcione con todas las subclases. Si pasa con todas, cumples LSP.'
      ],
      vet: [
        'Revisa tu jerarquía DocumentoClinico -> Receta, Vacunacion, Diagnostico de la semana 6.',
        'Pregunta por cada método del padre: ¿las tres subclases pueden cumplirlo de verdad?'
      ],
      edge: [
        'Un hijo puede exigir menos que el padre (aceptar más entradas) y prometer más (garantizar más), nunca al revés. Es la regla formal: precondiciones iguales o más débiles, postcondiciones iguales o más fuertes.',
        'Cambiar el significado también rompe LSP: si el padre devuelve lista vacía y el hijo devuelve null, el código cliente falla.',
        'La mayoría de las violaciones de LSP se arreglan reemplazando herencia por composición o por interfaces separadas.'
      ],
      quiz: [
        { q: 'Enuncia LSP en una frase útil.', a: 'Si el código funciona con la clase base, debe seguir funcionando igual cuando le pasas cualquier subclase, sin saber cuál es ni necesitar comprobaciones extra.' },
        { q: '¿Por qué lanzar NotSupportedException en un override lo rompe?', a: 'Porque el contrato del padre dice que ese método se puede llamar. El hijo lo convierte en una trampa y obliga al cliente a preguntar el tipo antes de llamarlo, que es justo lo que el polimorfismo debía evitar.' },
        { q: 'Da una señal de violación de LSP sin ver excepciones.', a: 'Un if que pregunta el tipo concreto antes de usar el objeto, por ejemplo "if (doc is Receta)". Si necesitas saber cuál subclase es, la abstracción no te sirve.' },
        { q: '¿Cómo se relaciona LSP con el diseño de tests?', a: 'Puedes escribir una batería de tests contra la clase base y ejecutarla con cada subclase. Si alguna falla, esa subclase viola LSP y debe salir de la jerarquía.' }
      ],
      out: 'Jerarquía de documentos clínicos sin overrides que lancen excepciones, con IFirmable separado.',
      file: 'src/VetCare.Domain/Clinica/'
    },
    {
      t: 'ISP y DIP (examen de la semana)',
      obj: 'Cerrar SOLID con interfaces pequeñas y dependencias invertidas, y defender el diseño completo.',
      why: 'ISP y DIP son los que más se ven en código .NET real: interfaces por caso de uso y todo cableado en Program.cs. Terminar la semana explicándolo en voz alta fija el aprendizaje.',
      study: { r: 0, what: 'Lee las secciones "Dependency inversion" y "Explicit dependencies". Unos 12 minutos. Busca una cosa: por qué el módulo de alto nivel define la interfaz.',
        pasos: [
          'Lee "Dependency inversion" (~5 min) y fíjate en el diagrama con las flechas invertidas.',
          'Lee "Explicit dependencies" (~3 min): las dependencias se ven en el constructor, no se esconden dentro.',
          'Para ISP no hay sección en este artículo: recuerda el ejemplo del día y escribe la regla en una línea: ningún cliente debe depender de métodos que no usa.',
          'Repasa tus notas de toda la semana y escribe una frase por cada letra de SOLID con un ejemplo de VetCare.'
        ] },
      ex: { title: 'ISP y DIP juntos', body: `ISP: interfaz gorda vs interfaces por necesidad

MAL
public interface IRepositorio
{
    void Guardar(object e);
    object Buscar(Guid id);
    void Eliminar(Guid id);
    List<object> Todos();
    void Exportar(string ruta);
    void Respaldar();
}

Una clase que solo necesita Buscar queda obligada a
implementar Respaldar y Exportar aunque no tengan sentido.

BIEN
public interface ILeerCitas
{
    Cita? PorId(Guid id);
    IReadOnlyList<Cita> DelDia(DateOnly dia);
}

public interface IGuardarCitas
{
    void Guardar(Cita c);
}

Cada consumidor pide solo lo que usa.

DIP: la dirección de la flecha

Sin DIP:   Dominio  ----> PostgresCitaRepository
Con DIP:   Dominio  ----> IRepositorioCitas
                              ^
                              |
           Infraestructura ---+

La interfaz vive en Dominio. Infraestructura la implementa.
El dominio nunca sabe que existe PostgreSQL.

Cableado en el Program.cs de la API (lo crearás en la semana 12):

builder.Services.AddScoped<IRepositorioCitas, PostgresCitaRepository>();
builder.Services.AddScoped<INotificador>(
    _ => new NotificadorEmail("citas@vetcare.local"));

(La segunda línea usa una función porque NotificadorEmail
recibe un string en el constructor, y el contenedor no
sabe qué string darle.)` },
      steps: [
        'Revisa tus interfaces y parte toda la que tenga más de cinco métodos o métodos que nadie use juntos.',
        'Renombra las interfaces por lo que el cliente necesita, no por la tecnología: ILeerCitas, no ISqlRepo.',
        'Dibuja en docs/diseno.md el diagrama de flechas entre Domain, Infrastructure y la capa de entrada.',
        'Verifica la regla de oro: ninguna flecha sale de Domain hacia afuera.',
        'Prepara tu defensa oral: una frase por cada letra de SOLID con un ejemplo concreto de VetCare.'
      ],
      vet: [
        'Deja en docs/diseno.md una sección final "SOLID en VetCare" con los cinco principios y dónde se ve cada uno en tu código.',
        'Explica el diseño en voz alta en cinco minutos, sin leer, como si fuera una entrevista.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/diseno.md dentro de una semana.'
      ],
      edge: [
        'Una interfaz por método es exagerado: agrupa lo que siempre se usa junto.',
        'DIP no significa "mete interfaces en todo". Significa que la política no depende del detalle.',
        'Si tu Program.cs tiene 200 registros de servicios, no es error de DIP, es señal de que faltan módulos que agrupen el registro.'
      ],
      quiz: [
        { q: '¿Qué problema concreto resuelve ISP?', a: 'Evita que una clase tenga que implementar métodos que no le corresponden solo porque viven en la misma interfaz. Eso produce implementaciones vacías o que lanzan excepciones, que a su vez rompen LSP.' },
        { q: '¿Quién debe definir la interfaz según DIP y por qué?', a: 'El módulo de alto nivel que la consume, porque la interfaz expresa lo que él necesita. Si la define el detalle, el alto nivel termina adaptándose a la tecnología y la inversión no ocurre.' },
        { q: '¿Cómo se relacionan ISP y LSP?', a: 'Una interfaz demasiado grande obliga a implementaciones parciales que lanzan excepciones, y eso es exactamente una violación de LSP. Partir la interfaz elimina las dos infracciones de una vez.' },
        { q: 'Resume en una frase para qué sirve SOLID.', a: 'Para que el costo de un cambio futuro sea proporcional al tamaño del cambio y no al tamaño del sistema: cada pieza tiene un tema, depende de contratos y no de detalles, y crece agregando archivos en vez de editando los que ya funcionan.' }
      ],
      out: 'docs/diseno.md completo con tabla de actores, diagrama de dependencias y sección SOLID en VetCare.',
      file: 'docs/diseno.md'
    }
  ]
}
]);
