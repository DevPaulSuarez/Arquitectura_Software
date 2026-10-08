window.WEEKS = (window.WEEKS || []).concat([
{
  n: 13,
  phase: 'Calidad y testing',
  title: 'Tests que te dejan dormir tranquilo',
  idea: 'Un test no sirve para demostrar que el código funciona hoy: sirve para que mañana puedas cambiarlo sin miedo. Esta semana escribes tests de verdad sobre VetCare y descubres que el código bien diseñado de las semanas 7 y 8 es fácil de probar, y el mal diseñado no.',
  res: [
    { t: 'Microsoft Learn — Unit testing with xUnit',
      u: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test',
      note: 'Tutorial oficial de xUnit con dotnet test. Día 1 sale de aquí.' },
    { t: 'Microsoft Learn — Unit testing best practices',
      u: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices',
      note: 'Nombres, estructura, qué probar y qué no. Léelo dos veces en la semana.' },
    { t: 'Martin Fowler — Test Double',
      u: 'https://martinfowler.com/bliki/TestDouble.html',
      note: 'La definición correcta de stub, mock, fake y spy. Imprescindible para el día 3.' },
    { t: 'Microsoft Learn — Integration tests in ASP.NET Core',
      u: 'https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests',
      note: 'WebApplicationFactory y pruebas de la API completa. Día 5.' },
    { t: 'Martin Fowler — Test Driven Development', u: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html', note: 'El ciclo rojo-verde-refactor explicado en una página.' },
    { t: 'Microsoft Learn — Unit testing C# with xUnit', u: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit', note: 'Tutorial oficial: crear la solución, el proyecto de tests y los primeros tests con xUnit.' }
  ],
  days: [
    {
      t: 'Tu primer test que vale algo',
      obj: 'Montar el proyecto de tests y escribir pruebas con buena estructura y nombre.',
      why: 'Saber escribir tests es requisito de entrada en cualquier equipo. Y el nombre del test es lo primero que lee quien revisa tu código: dice si entendiste el requisito o solo el método.',
      study: { r: 5, what: 'Sigue el tutorial completo creando el proyecto. Unos 25 minutos haciéndolo, no solo leyéndolo. Busca una cosa: la diferencia entre Fact y Theory.',
        pasos: [
          'Haz "Create the solution" con los "Commands to create the solution" (~8 min), escribiendo tú los comandos.',
          'Haz "Create a test" (~6 min): primero ve el test fallar, después haz que pase.',
          'Haz "Add more tests" (~6 min): fíjate en cómo un Theory con InlineData sustituye a varios Fact casi iguales.',
          'Ejecuta dotnet test y lee la salida entera, incluido el resumen final.',
          'Escribe en una línea: Fact es un caso fijo; Theory es el mismo test con varios datos.'
        ] },
      ex: { title: 'Arrange, Act, Assert', body: `dotnet new xunit -o tests/VetCare.Domain.Tests
dotnet sln add tests/VetCare.Domain.Tests
dotnet add tests/VetCare.Domain.Tests reference src/VetCare.Domain
dotnet add tests/VetCare.Domain.Tests package FluentAssertions

(Ojo con la licencia: FluentAssertions 8 o posterior es
gratis solo para uso no comercial. Para tu portfolio vale;
en una empresa, usa AwesomeAssertions, un fork libre con
la misma sintaxis.)

NOMBRE DEL TEST: qué, cuándo, entonces

MAL
  TestCita()
  Test1()
  AgendarTest()

BIEN
  Agendar_CuandoLaFechaEsPasada_LanzaReglaNegocioException
  Agendar_CuandoElHorarioEstaLibre_DejaLaCitaEnEstadoAgendada
  CalcularTotal_SinLineas_DevuelveCero

El nombre debe leerse como el requisito.
Si no puedes nombrarlo, no entendiste qué estás probando.

ESTRUCTURA AAA
(Supone que tu Cita.Agendar ya recibe "ahora", como en la
semana 12, y que lanza ReglaNegocioException si la fecha es
pasada o la duración no está entre 10 y 180 minutos.)

[Fact]
public void Agendar_CuandoLaFechaEsPasada_LanzaReglaNegocioException()
{
    // Arrange: preparar el escenario
    var ahora  = new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc);
    var pasado = ahora.AddHours(-2);

    // Act: ejecutar la acción
    var accion = () => Cita.Agendar(
        mascotaId: Guid.NewGuid(), vetId: Guid.NewGuid(),
        inicio: pasado, dur: TimeSpan.FromMinutes(30), ahora: ahora);

    // Assert: comprobar el resultado
    accion.Should()
          .Throw<ReglaNegocioException>()
          .WithMessage("*fecha*futura*");
}

THEORY: el mismo test con varios datos

[Theory]
[InlineData(0)]
[InlineData(5)]
[InlineData(181)]
[InlineData(-30)]
public void Agendar_ConDuracionInvalida_Lanza(int minutos)
{
    var ahora = new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc);

    var accion = () => Cita.Agendar(Guid.NewGuid(), Guid.NewGuid(),
        ahora.AddHours(2), TimeSpan.FromMinutes(minutos), ahora);

    accion.Should().Throw<ReglaNegocioException>();
}

UN SOLO CONCEPTO POR TEST

MAL (si falla, no sabes cuál de las tres cosas falló)
[Fact]
public void TestAgendar()
{
    var c = Cita.Agendar(...);
    c.Estado.Should().Be(EstadoCita.Agendada);
    c.Fin.Should().Be(c.Inicio.AddMinutes(30));
    c.Id.Should().NotBe(Guid.Empty);
}

Pártelo en tres tests con tres nombres.
Si uno falla, el nombre ya te dice qué se rompió.` },
      steps: [
        'Crea el proyecto tests/VetCare.Domain.Tests con xUnit y FluentAssertions, y agrégalo a la solución.',
        'Escribe diez tests sobre las reglas de la clase Cita: fecha futura, duración válida, estado inicial, cálculo del fin.',
        'Usa Theory con InlineData para todos los casos de un mismo concepto en vez de copiar el test.',
        'Nombra cada test con el patrón Metodo_Cuando_Entonces y léelos en voz alta: deben sonar como requisitos.',
        'Corre dotnet test y comprueba que todos pasan. Luego rompe el código a propósito y verifica que algún test se pone rojo.'
      ],
      vet: [
        'Reglas de VetCare a cubrir: la cita debe ser futura, duración entre 10 y 180, no se cancela una cita ya atendida, el total de la factura es la suma de sus líneas.',
        'Si una regla no está en docs/requirements.md, agrégala ahí antes de testearla.'
      ],
      edge: [
        'Un test que nunca ha fallado puede estar probando nada. Comprueba que se pone rojo rompiendo el código.',
        'No pongas lógica en el test: nada de if ni bucles ni cálculos. El valor esperado va escrito a mano.',
        'Evita Assert.True(algo): cuando falla solo dice "esperaba True". Usa aserciones que digan qué valor recibió.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre Fact y Theory?', a: 'Fact es un test sin parámetros que prueba un caso concreto. Theory recibe datos y ejecuta el mismo cuerpo una vez por cada conjunto, que es lo correcto cuando el concepto es el mismo y solo cambian los valores.' },
        { q: '¿Por qué el nombre del test importa tanto?', a: 'Porque cuando falla en el pipeline, el nombre es lo único que ves. Si dice qué método, en qué situación y qué se esperaba, diagnosticas sin abrir el código.' },
        { q: '¿Por qué no debe haber if ni bucles dentro de un test?', a: 'Porque el test se convierte en código que también puede tener bugs, y nadie testea los tests. Los valores esperados deben estar escritos literalmente para que sean evidentes.' },
        { q: '¿Cómo compruebas que un test realmente prueba algo?', a: 'Rompiendo a propósito el código que debería verificar y confirmando que el test se pone rojo. Un test que pasa pase lo que pase es ruido con falsa sensación de seguridad.' }
      ],
      out: 'Proyecto de tests con diez pruebas verdes sobre las reglas de Cita.',
      file: 'tests/VetCare.Domain.Tests/CitaTests.cs'
    },
    {
      t: 'Qué testear y qué no',
      obj: 'Decidir dónde invertir el esfuerzo de pruebas con criterio económico.',
      why: 'Testear todo es imposible y testear poco es peligroso. Saber elegir es lo que convierte los tests en una ventaja en vez de una carga de mantenimiento.',
      study: { r: 1, what: 'Lee el artículo completo de buenas prácticas. Unos 20 minutos. Busca una cosa: por qué no se deben testear los detalles de implementación.',
        pasos: [
          'Lee "Benefits of unit testing" (~3 min).',
          'Lee "Characteristics of good unit tests" (~3 min) y copia la lista: rápido, aislado, repetible, autoverificable y oportuno.',
          'Lee "Code coverage and code quality" (~2 min): por qué el 100% de cobertura no es un objetivo.',
          'Lee "Unit testing terminology" (~2 min): fake, mock y stub según Microsoft.',
          'En "Best practices" lee "Avoid infrastructure dependencies", "Follow test naming standards" y "Validate private methods with public methods" (~6 min). La última responde a la pregunta del día.'
        ] },
      ex: { title: 'La pirámide y los límites', body: `LA PIRÁMIDE DE TESTS

        /\\
       /  \\      E2E / UI      pocos, lentos, frágiles
      /----\\
     /      \\    Integración   algunos, medios
    /--------\\
   /          \\  Unitarios     muchos, rápidos, estables
  /------------\\

Proporción sana: muchos unitarios, bastantes de
integración en los caminos críticos, pocos E2E
solo para los flujos que no pueden fallar.

QUÉ SÍ TESTEAR

- Reglas de negocio y cálculos
- Casos límite y validaciones
- Bugs que ya ocurrieron (test de regresión)
- Contratos públicos: la API, el dominio
- Comportamiento ante errores

QUÉ NO TESTEAR

- Getters y setters triviales
- Código del framework (EF Core, ASP.NET)
- DTOs sin lógica
- Configuración y cableado
- Detalles privados de implementación

PROBAR COMPORTAMIENTO, NO IMPLEMENTACIÓN

MAL: acoplado a cómo está hecho
[Fact]
public void Agendar_LlamaAlMetodoValidarFecha()
{
    _validador.Verify(v => v.ValidarFecha(It.IsAny<DateTime>()), Times.Once);
}

Si refactorizas y renombras ValidarFecha, el test
se rompe aunque el comportamiento sea idéntico.
El test se vuelve un freno al refactor.

BIEN: acoplado al requisito
[Fact]
public void Agendar_ConFechaPasada_NoCreaLaCita()
{
    var accion = () => _agendador.Agendar(citaEnElPasado);
    accion.Should().Throw<ReglaNegocioException>();
    _repo.Guardadas.Should().BeEmpty();
}

Este test sobrevive a cualquier refactor interno.

COBERTURA: una guía, no un objetivo

80 por ciento de cobertura con tests que no comprueban
nada es peor que 50 por ciento con tests buenos.

Usa la cobertura al revés: mira qué líneas NO están
cubiertas y pregunta si alguna es una regla importante.

dotnet test --collect:"XPlat Code Coverage"

Eso deja un archivo coverage.cobertura.xml. Para verlo
como página web:

dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" \\
                -targetdir:coverage

y abre coverage/index.html en el navegador.` },
      steps: [
        'Lista en docs/testing.md las reglas de negocio de VetCare y marca cuáles están cubiertas por un test.',
        'Revisa tus tests actuales: ¿alguno comprueba que se llamó a un método en vez de que ocurrió un resultado? Reescríbelo.',
        'Genera el reporte de cobertura y mira las líneas no cubiertas del proyecto Domain.',
        'Por cada línea importante no cubierta, decide: escribo el test o acepto el riesgo y lo anoto.',
        'Borra cualquier test que no pueda fallar nunca o que solo compruebe un getter.'
      ],
      vet: [
        'Define en docs/testing.md la política de VetCare: qué se testea siempre, qué nunca y cuál es el objetivo de cobertura del dominio.',
        'El dominio de VetCare debe estar cerca del 100 por ciento; la infraestructura no.'
      ],
      edge: [
        'Un test que se rompe en cada refactor sin que cambie el comportamiento es un test malo: está acoplado a la implementación.',
        'La cobertura mide líneas ejecutadas, no comportamiento verificado. Un test sin aserciones da cobertura.',
        'Testear código generado o del framework solo agrega mantenimiento: confía en que Microsoft ya lo probó.'
      ],
      quiz: [
        { q: '¿Por qué la pirámide tiene más tests unitarios que E2E?', a: 'Porque los unitarios son rápidos, estables y señalan exactamente donde está el fallo, mientras que los E2E son lentos, se rompen por motivos ajenos y solo dicen que algo en el flujo falló.' },
        { q: '¿Qué significa testear comportamiento y no implementación?', a: 'Significa verificar el resultado observable desde fuera, no que se llamó a tal método interno. Así el test sigue siendo válido después de refactorizar y no se convierte en un obstáculo.' },
        { q: '¿Por qué la cobertura no es un buen objetivo en sí misma?', a: 'Porque mide líneas ejecutadas, no comportamiento verificado. Se puede llegar al 90 por ciento con tests sin aserciones, lo que da una falsa sensación de seguridad.' },
        { q: '¿Qué test es siempre justificado escribir?', a: 'El de un bug que ya ocurrió. Reproduce el fallo, confirma que el test está rojo, arregla el código y el test queda como garantía de que ese bug no vuelve.' }
      ],
      out: 'docs/testing.md con la política de pruebas y el mapa de reglas cubiertas.',
      file: 'docs/testing.md'
    },
    {
      t: 'Dobles de prueba: stub, fake, mock y spy',
      obj: 'Aislar la unidad bajo prueba con el tipo de doble correcto.',
      why: 'Casi todo el mundo llama mock a todo. Conocer las cuatro categorías y usar la correcta hace tus tests más claros y es una respuesta que impresiona en entrevista.',
      study: { r: 2, what: 'Lee el artículo de Fowler completo, es corto. Unos 12 minutos. Busca una cosa: la diferencia entre verificación de estado y verificación de comportamiento.',
        pasos: [
          'Lee el artículo de Fowler completo (~5 min).',
          'Copia la lista de los cinco tipos: Dummy, Fake, Stubs, Spies y Mocks, con una frase de cada uno.',
          'Fíjate en que solo los mocks se crean con expectativas sobre las llamadas que van a recibir: eso es verificar comportamiento. Los demás sirven para verificar el estado final.',
          'Para cada dependencia de AgendadorDeCitas escribe qué doble usarías y por qué.'
        ] },
      ex: { title: 'Los cuatro dobles', body: `DUMMY: se pasa pero no se usa
// si un constructor pide un ILogger y este test no mira
// los logs, le pasas uno que lo tira todo a la basura:
var logger = NullLogger<AgendadorDeCitas>.Instance;

STUB: devuelve respuestas fijas
public class RelojFijo : IRelojSistema
{
    private readonly DateTime _ahora;
    public RelojFijo(DateTime ahora) => _ahora = ahora;
    public DateTime Ahora() => _ahora;
}

FAKE: implementación real pero simplificada
public class RepositorioCitasEnMemoria : IRepositorioCitas
{
    public List<Cita> Guardadas { get; } = new();

    public Task AgregarAsync(Cita c) { Guardadas.Add(c); return Task.CompletedTask; }

    public Task<bool> ExisteSolapadaAsync(Guid vetId, DateTime ini, DateTime fin)
        => Task.FromResult(Guardadas.Any(c =>
               c.VeterinarioId == vetId && c.Inicio < fin && ini < c.Fin));

    // ...el resto de métodos de IRepositorioCitas, como en la semana 8
}

SPY: registra lo que le hicieron
public class NotificadorSpy : INotificador
{
    public List<(string Destino, string Mensaje)> Enviados { get; } = new();

    public Task EnviarAsync(string destino, string mensaje)
    {
        Enviados.Add((destino, mensaje));
        return Task.CompletedTask;
    }
}

MOCK: espera llamadas concretas y falla si no ocurren
var mock = new Mock<INotificador>();
mock.Setup(n => n.EnviarAsync("ana@example.com", It.IsAny<string>()))
    .Returns(Task.CompletedTask);
// ... ejecutar ...
mock.Verify(n => n.EnviarAsync("ana@example.com", It.IsAny<string>()), Times.Once);

TEST COMPLETO CON FAKES A MANO

[Fact]
public async Task Agendar_CuandoElHorarioEstaOcupado_NoNotifica()
{
    // Arrange
    var ahora = new DateTime(2026, 3, 10, 9, 0, 0, DateTimeKind.Utc);
    var vet   = Guid.NewGuid();
    var repo  = new RepositorioCitasEnMemoria();
    var spy   = new NotificadorSpy();
    var sut   = new AgendadorDeCitas(repo, spy, new RelojFijo(ahora));

    await sut.AgendarAsync(
        new SolicitudCita(Guid.NewGuid(), vet, ahora.AddHours(2), 30));

    // Act
    var accion = () => sut.AgendarAsync(
        new SolicitudCita(Guid.NewGuid(), vet, ahora.AddHours(2).AddMinutes(15), 30));

    // Assert
    await accion.Should().ThrowAsync<HorarioOcupadoException>();
    repo.Guardadas.Should().HaveCount(1);
    spy.Enviados.Should().HaveCount(1);   // solo notificó la primera
}

VERIFICACIÓN DE ESTADO vs DE COMPORTAMIENTO

Estado: compruebo el resultado final (repo.Guardadas tiene 1).
        Más robusto, sobrevive a refactors.

Comportamiento: compruebo que se llamó a algo.
        Necesario cuando el efecto es externo e invisible,
        como enviar un correo. Úsalo solo entonces.` },
      steps: [
        'Escribe a mano los cuatro dobles para VetCare: RelojFijo, RepositorioCitasEnMemoria, NotificadorSpy y un dummy.',
        'Escribe cinco tests de AgendadorDeCitas usando esos dobles, sin librería de mocking.',
        'Agrega el paquete Moq y reescribe uno de ellos con mocks. Compara cuál se lee mejor.',
        'Identifica en tus tests cuáles verifican estado y cuáles verifican comportamiento, y justifica cada caso.',
        'Comprueba que todos tus tests del dominio corren en menos de un segundo en total.'
      ],
      vet: [
        'Reutiliza el RepositorioCitasEnMemoria que escribiste en la semana 8. Ya lo tenías listo.',
        'Pon todos los dobles en tests/VetCare.Domain.Tests/Dobles/ para reutilizarlos.'
      ],
      edge: [
        'Si necesitas cinco mocks para un solo test, la clase tiene demasiadas dependencias: el problema es el diseño.',
        'Un mock que verifica cada llamada interna convierte el test en una copia del código y bloquea los refactors.',
        'Un fake con lógica propia puede tener bugs. Mantenlo lo más simple posible o acabarás depurando el test.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre un stub y un mock?', a: 'Un stub solo devuelve respuestas predefinidas para que el test pueda avanzar. Un mock además tiene expectativas sobre qué llamadas debe recibir y hace fallar el test si no se cumplen.' },
        { q: '¿Qué es un fake y cuándo es la mejor opción?', a: 'Es una implementación real pero simplificada, como un repositorio en memoria. Es ideal cuando necesitas comportamiento realista a lo largo de varias operaciones sin levantar la dependencia real.' },
        { q: '¿Cuándo se justifica verificar comportamiento en vez de estado?', a: 'Cuando el efecto es externo e invisible desde el sistema, como enviar un correo o publicar un evento. Si puedes comprobar el resultado observando el estado, esa forma es preferible por ser más robusta.' },
        { q: '¿Qué te dice un test que necesita cinco mocks?', a: 'Que la clase bajo prueba tiene demasiadas dependencias y probablemente viola la responsabilidad única. El problema no es el test sino el diseño que lo obliga a ser así.' }
      ],
      out: 'Carpeta de dobles reutilizables y cinco tests de AgendadorDeCitas corriendo en menos de un segundo.',
      file: 'tests/VetCare.Domain.Tests/Dobles/'
    },
    {
      t: 'TDD: dejar que el test guíe el diseño',
      obj: 'Escribir código nuevo empezando por el test, en ciclos cortos.',
      why: 'TDD no es solo una técnica de testing, es una técnica de diseño: te obliga a pensar en cómo se usa tu código antes de escribirlo. Haberlo practicado se nota en el resultado.',
      study: { r: 4, what: 'Lee el artículo de Fowler completo, es corto. Unos 10 minutos. Quédate con el ciclo rojo-verde-refactor y con el error más común: saltarse el refactor. Busca una cosa: por qué es importante ver el test fallar primero.',
        pasos: [
          'Lee el artículo de Fowler completo (~5 min).',
          'Copia los tres pasos del ciclo: escribir un test que falle, hacerlo pasar con el código mínimo, refactorizar.',
          'Fíjate en la advertencia sobre saltarse el refactor: es el error más común.',
          'Antes de programar, escribe la lista de tests que vas a necesitar para la regla de hoy, del caso más simple al más complejo.'
        ] },
      ex: { title: 'Un ciclo completo de TDD', body: `REQUISITO: calcular el total de una factura con descuento
por cliente frecuente (5 o más visitas, 10 por ciento).

PASO 1 - ROJO: el test más simple que falle

[Fact]
public void Total_SinLineas_EsCero()
{
    var f = new Factura(duenoId: Guid.NewGuid());
    f.Total().Should().Be(0m);
}

No compila: la clase Factura no existe. Eso es rojo.

PASO 2 - VERDE: lo mínimo para pasar

public class Factura
{
    public Factura(Guid duenoId) { }
    public decimal Total() => 0m;
}

Sí, devolver cero fijo es "hacer trampa".
Es intencional: el siguiente test te obligará a mejorarlo.

PASO 3 - ROJO otra vez

[Fact]
public void Total_ConDosLineas_EsLaSuma()
{
    var f = new Factura(Guid.NewGuid());
    f.AgregarLinea("Consulta", 35m);
    f.AgregarLinea("Vacuna",   18.50m);

    f.Total().Should().Be(53.50m);
}

PASO 4 - VERDE

public class Factura
{
    private readonly List<LineaFactura> _lineas = new();
    public Factura(Guid duenoId) => DuenoId = duenoId;
    public Guid DuenoId { get; }

    public void AgregarLinea(string concepto, decimal monto)
        => _lineas.Add(new LineaFactura(concepto, monto));

    public decimal Total() => _lineas.Sum(l => l.Monto);
}

PASO 5 - ROJO: la regla real

[Theory]
[InlineData(4, 53.50)]
[InlineData(5, 48.15)]
[InlineData(9, 48.15)]
public void Total_AplicaDescuentoDesdeCincoVisitas(int visitas, decimal esperado)
{
    var f = new Factura(Guid.NewGuid());
    f.AgregarLinea("Consulta", 35m);
    f.AgregarLinea("Vacuna",   18.50m);

    f.Total(visitasDelDueno: visitas).Should().Be(esperado);
}

PASO 6 - VERDE, y PASO 7 - REFACTOR

Ahora que hay tests verdes, puedes mover el descuento
a IEstrategiaDescuento (semana 8) con total seguridad:
si rompes algo, los tests te avisan en dos segundos.

EL CICLO
rojo     -> escribe el test, velo fallar
verde    -> el código mínimo que lo haga pasar
refactor -> limpia, con la red de seguridad puesta

Regla: nunca escribas código de producción
sin un test rojo que lo pida.` },
      steps: [
        'Elige una funcionalidad de VetCare que aún no exista: cálculo de la próxima vacuna según la especie y la edad.',
        'Escribe el primer test y comprueba que no compila o falla. No escribas nada de producción antes.',
        'Haz el ciclo completo al menos seis veces, con pasos pequeños. Anota cuántos minutos dura cada ciclo.',
        'En el tercer o cuarto ciclo, haz un refactor real apoyándote en los tests verdes.',
        'Compara el resultado con cómo lo habrías escrito sin TDD: cuántas dependencias tiene, qué tan fácil fue probarlo.'
      ],
      vet: [
        'Funcionalidad a construir con TDD: CalendarioVacunacion, que dada una especie y fecha de nacimiento devuelve las vacunas pendientes.',
        'Documenta en docs/testing.md tu experiencia: qué te costó, qué te ayudó.'
      ],
      edge: [
        'Si el ciclo dura más de diez minutos, el paso era demasiado grande. Parte el test en algo más pequeño.',
        'TDD no sirve igual para todo: para explorar una librería nueva o afinar una interfaz gráfica es un estorbo.',
        'Escribir el test después y afirmar que hiciste TDD es fácil de detectar: el código suele tener dependencias difíciles de sustituir.'
      ],
      quiz: [
        { q: '¿Por qué es importante ver el test fallar antes de escribir el código?', a: 'Porque confirma que el test realmente prueba lo que crees. Si pasa en verde desde el principio, puede estar mal escrito o probando algo que ya ocurría, y nunca te avisará de una regresión.' },
        { q: '¿Por qué se permite "hacer trampa" devolviendo un valor fijo en el paso verde?', a: 'Porque el objetivo del paso verde es cerrar el ciclo rápido, no escribir la solución final. El siguiente test rojo es el que obliga a generalizar, y así cada línea de producción nace justificada por un test.' },
        { q: '¿En qué sentido TDD es una técnica de diseño?', a: 'Porque te obliga a escribir primero cómo se usa el código desde fuera. Si resulta incómodo de invocar o necesita demasiadas dependencias, lo descubres antes de haberlo implementado.' },
        { q: '¿Cuándo TDD no es la mejor herramienta?', a: 'Cuando estás explorando una API desconocida, haciendo un prototipo desechable o ajustando detalles visuales, porque todavía no sabes cuál es el comportamiento correcto que deberías afirmar.' }
      ],
      out: 'CalendarioVacunacion construido íntegramente con TDD y el proceso documentado.',
      file: 'src/VetCare.Domain/Clinica/CalendarioVacunacion.cs'
    },
    {
      t: 'Tests de integración de la API',
      obj: 'Probar la API completa de punta a punta con una base de datos real.',
      why: 'Los tests unitarios no detectan un mapeo de EF mal hecho ni un middleware en el orden equivocado. Los de integración sí, y son los que de verdad dan confianza para desplegar.',
      study: { r: 3, what: 'Lee el artículo de integration tests, en especial WebApplicationFactory y la customización de servicios. Unos 22 minutos. Busca una cosa: cómo se reemplaza el DbContext real por uno de pruebas.',
        pasos: [
          'Lee "Introduction to integration tests" y "ASP.NET Core integration tests" (~4 min).',
          'Lee "Basic tests with the default WebApplicationFactory" (~5 min): la API arranca en memoria y la llamas con un HttpClient.',
          'Lee "Customize WebApplicationFactory" (~6 min): así se cambia el DbContext real por uno de pruebas en ConfigureWebHost.',
          'Lee "Inject mock services" y "Disposal of objects" (~4 min).',
          'Escribe en una línea por qué este test prueba más cosas que un test unitario y por qué es más lento.'
        ] },
      ex: { title: 'WebApplicationFactory con Postgres real', body: `dotnet new xunit -o tests/VetCare.Api.Tests
dotnet sln add tests/VetCare.Api.Tests
dotnet add tests/VetCare.Api.Tests reference src/VetCare.Api
dotnet add tests/VetCare.Api.Tests package Microsoft.AspNetCore.Mvc.Testing
dotnet add tests/VetCare.Api.Tests package Testcontainers.PostgreSql
dotnet add tests/VetCare.Api.Tests package FluentAssertions

FÁBRICA CON BASE EFÍMERA EN DOCKER

public class VetCareFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    // ids fijos que crea datos-prueba.sql
    public static readonly Guid Rocky = Guid.Parse("0b8f1e2c-6a3d-4f7e-9c21-5d4b3a2f1e0d");
    public static readonly Guid Michi = Guid.Parse("1c9a2f3d-7b4e-4a8f-8d32-6e5c4b3a2f1e");
    public static readonly Guid Ana = Guid.Parse("8d2e6b1a-3c4f-4a5b-8e7d-2f1a0c9b8e7d");

    private readonly PostgreSqlContainer _db =
        new PostgreSqlBuilder("postgres:17-alpine").Build();

    public async Task InitializeAsync()
    {
        await _db.StartAsync();

        // aplica tus migraciones (semana 10) y los datos de prueba
        var raiz = Path.Combine(AppContext.BaseDirectory, "../../../../..");
        var archivos = Directory
            .GetFiles(Path.Combine(raiz, "database/migrations"), "*.sql")
            .Order()
            .Append(Path.Combine(raiz, "tests/VetCare.Api.Tests/datos-prueba.sql"));

        await using var con = new NpgsqlConnection(_db.GetConnectionString());
        await con.OpenAsync();
        // la tabla de control que en la semana 10 creaba tu script
        await new NpgsqlCommand("""
            CREATE TABLE IF NOT EXISTS schema_migration (
              version TEXT PRIMARY KEY,
              aplicada TIMESTAMPTZ NOT NULL DEFAULT now())
            """, con).ExecuteNonQueryAsync();
        foreach (var archivo in archivos)
            await new NpgsqlCommand(File.ReadAllText(archivo), con)
                .ExecuteNonQueryAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        // la API lee "ConnectionStrings:VetCare": le damos la del
        // contenedor. Así cambian a la vez el DbContext y el
        // health check, sin tocar los servicios a mano.
        builder.UseSetting("ConnectionStrings:VetCare", _db.GetConnectionString());
    }

    public new async Task DisposeAsync() => await _db.DisposeAsync();
}

datos-prueba.sql inserta un dueño, dos mascotas (Rocky y
Michi) y una veterinaria (Ana) con esos mismos ids.

TEST DEL FLUJO COMPLETO

public class CitasApiTests : IClassFixture<VetCareFactory>
{
    private readonly HttpClient _http;

    public CitasApiTests(VetCareFactory factory)
        => _http = factory.CreateClient();

    [Fact]
    public async Task PostCita_ConDatosValidos_Devuelve201YLocation()
    {
        var body = new
        {
            mascotaId = VetCareFactory.Rocky,
            veterinarioId = VetCareFactory.Ana,
            inicio = "2026-06-10T10:00:00Z",
            duracionMinutos = 30
        };

        var res = await _http.PostAsJsonAsync("/api/v1/citas", body);

        res.StatusCode.Should().Be(HttpStatusCode.Created);
        res.Headers.Location.Should().NotBeNull();

        var creada = await res.Content.ReadFromJsonAsync<CitaResponse>();
        creada!.Estado.Should().Be("agendada");
    }

    [Fact]
    public async Task PostCita_QueSeSolapa_Devuelve409ConProblemDetails()
    {
        await _http.PostAsJsonAsync("/api/v1/citas", new
        {
            mascotaId = VetCareFactory.Rocky,
            veterinarioId = VetCareFactory.Ana,
            inicio = "2026-06-11T10:00:00Z",
            duracionMinutos = 30
        });

        var res = await _http.PostAsJsonAsync("/api/v1/citas", new
        {
            mascotaId = VetCareFactory.Michi,
            veterinarioId = VetCareFactory.Ana,
            inicio = "2026-06-11T10:15:00Z",
            duracionMinutos = 30
        });

        res.StatusCode.Should().Be(HttpStatusCode.Conflict);
        res.Content.Headers.ContentType!.MediaType
           .Should().Be("application/problem+json");
    }

    [Fact]
    public async Task PostCita_SinDuracion_Devuelve422()
    {
        var res = await _http.PostAsJsonAsync("/api/v1/citas", new
        {
            mascotaId = VetCareFactory.Rocky,
            veterinarioId = VetCareFactory.Ana,
            inicio = "2026-06-12T10:00:00Z",
            duracionMinutos = 0
        });

        res.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }
}

AISLAMIENTO ENTRE TESTS

Si dos tests comparten base, el orden los puede romper.
Opciones: una transacción por test con rollback,
truncar las tablas antes de cada test, o
datos únicos por test (fechas distintas, como arriba).` },
      steps: [
        'Crea el proyecto tests/VetCare.Api.Tests con Mvc.Testing y Testcontainers.',
        'Haz que Program.cs sea accesible desde los tests agregando "public partial class Program { }" al final. (En .NET 10 ya no hace falta, pero no molesta.)',
        'Escribe la fábrica que levanta PostgreSQL en Docker, aplica tus migraciones y carga tests/VetCare.Api.Tests/datos-prueba.sql al iniciar.',
        'Escribe al menos seis tests de integración: creación exitosa, conflicto 409, validación 422, no encontrado 404, listado paginado y health.',
        'Resuelve el aislamiento entre tests y comprueba que pasan igual ejecutados en cualquier orden.'
      ],
      vet: [
        'Los tests de integración deben cubrir los mismos códigos de estado que prometiste en docs/api-contract.md.',
        'Si un test de integración descubre que la API no cumple el contrato, gana el contrato: arregla el código.'
      ],
      edge: [
        'Testcontainers necesita Docker corriendo. Si no está disponible, los tests fallarán por entorno, no por código.',
        'Los tests de integración son lentos: no escribas uno por cada caso de validación, eso es trabajo de los unitarios.',
        'Si un test pasa solo cuando se ejecuta aislado, hay estado compartido. Arréglalo o tendrás fallos intermitentes eternos.'
      ],
      quiz: [
        { q: '¿Qué detectan los tests de integración que los unitarios no?', a: 'Errores en el cableado real: mapeos de EF incorrectos, orden de middlewares, serialización JSON, rutas mal escritas, constraints de la base y configuración. Todo lo que ocurre entre piezas y no dentro de una.' },
        { q: '¿Para qué sirve WebApplicationFactory?', a: 'Levanta la aplicación completa en memoria con su pipeline real y te da un HttpClient que habla con ella, permitiendo probar la API de verdad sin abrir un puerto ni desplegar nada.' },
        { q: '¿Por qué usar PostgreSQL real en vez de la base en memoria de EF?', a: 'Porque la base en memoria no respeta constraints, tipos ni SQL real, así que un test puede pasar ahí y fallar en producción. Con un contenedor efímero pruebas contra el mismo motor que usarás.' },
        { q: '¿Por qué es crítico el aislamiento entre tests de integración?', a: 'Porque comparten una base de datos y los datos que deja uno pueden hacer pasar o fallar a otro según el orden de ejecución, produciendo fallos intermitentes que destruyen la confianza en la suite.' }
      ],
      out: 'Seis tests de integración verdes contra PostgreSQL efímero, en cualquier orden.',
      file: 'tests/VetCare.Api.Tests/CitasApiTests.cs'
    },
    {
      t: 'Suite completa y confianza (examen de la semana)',
      obj: 'Dejar una suite rápida, fiable y útil, y saber defender cada decisión.',
      why: 'Una suite lenta o con fallos aleatorios termina siendo ignorada por el equipo. Dejarla sana es lo que hace que los tests sirvan de verdad durante años.',
      study: { r: 1, what: 'Relee el artículo de buenas prácticas completo con tus tests delante y corrige lo que no cumplas. Unos 20 minutos. Busca una cosa: la lista de características de un buen test unitario.',
        pasos: [
          'Relee "Characteristics of good unit tests" y pásala sobre tus tests uno por uno.',
          'Relee "Follow test naming standards" y renombra los tests que no cumplan.',
          'Relee "Avoid multiple Act tasks" y "Avoid coding logic in unit tests": busca tests que hagan dos cosas o tengan if o bucles.',
          'Relee "Use helper methods instead of Setup and Teardown" y simplifica la preparación compartida.',
          'Ejecuta toda la suite y apunta cuánto tarda: debe poder ejecutarse en cada cambio sin pensarlo.'
        ] },
      ex: { title: 'Checklist de una suite sana', body: `CARACTERÍSTICAS DE UN BUEN TEST

Rápido        milisegundos. Si tarda, nadie lo corre.
Aislado       no depende de otros tests ni del orden.
Repetible     mismo resultado siempre, en cualquier máquina.
Autoverificable  pasa o falla, sin que nadie interprete nada.
Oportuno      escrito junto al código, no seis meses después.

TESTS INTERMITENTES: el peor enemigo

Causas típicas y su arreglo:

DateTime.Now dentro del código
  -> inyecta IRelojSistema y usa RelojFijo

Dependencia del orden de ejecución
  -> limpia el estado antes de cada test

Thread.Sleep esperando algo asíncrono
  -> espera la condición, no un tiempo fijo

Orden de una colección sin ORDER BY
  -> ordena explícitamente o compara sin orden

Puerto o archivo fijo compartido
  -> usa recursos únicos por test

Un test intermitente es peor que ninguno:
enseña al equipo a ignorar el rojo.

ORGANIZAR LA SOLUCIÓN

tests/
  VetCare.Domain.Tests/      unitarios, milisegundos
  VetCare.Api.Tests/         integración, segundos

Separarlos permite correr solo los rápidos
mientras programas, y todos en el pipeline.

dotnet test tests/VetCare.Domain.Tests   # rápido, continuo
dotnet test                              # todo, antes de subir

CHECKLIST FINAL DE LA SEMANA

[ ] Todos los tests pasan en cualquier orden
[ ] Los unitarios completos tardan menos de 2 segundos
[ ] Ningún test usa DateTime.Now ni Thread.Sleep
[ ] Ningún test tiene if, for ni cálculos
[ ] Cada nombre dice qué, cuándo y entonces
[ ] Cada regla de docs/requirements.md tiene un test
[ ] Hay un test de integración por código de estado prometido
[ ] Rompí el código a propósito y la suite lo detectó
[ ] No queda ningún test comentado ni con Skip

EL TEST DE LA MUTACIÓN MANUAL

Cambia un > por un >= en una regla.
Cambia un + por un -.
Invierte una condición.
Si la suite sigue verde, tienes un agujero.` },
      steps: [
        'Corre toda la suite diez veces seguidas y confirma que no hay fallos intermitentes.',
        'Mide cuánto tardan los unitarios. Si pasan de dos segundos, busca cuál está tocando disco o red.',
        'Haz tres mutaciones manuales en el dominio y comprueba que la suite detecta las tres. Si alguna pasa, escribe el test que falta.',
        'Recorre el checklist completo y corrige todo lo que no cumplas.',
        'Defiende en voz alta durante cinco minutos: qué testeaste, qué no, por qué, y cómo sabes que tu suite sirve.'
      ],
      vet: [
        'Deja docs/testing.md con la política, el mapa de cobertura de reglas y el resultado de las mutaciones.',
        'Escribe en el README cómo correr solo los tests rápidos y cómo correr todos.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/testing.md dentro de una semana.'
      ],
      edge: [
        'Un test marcado con Skip es deuda invisible: o lo arreglas o lo borras con un comentario que explique por qué.',
        'Si el equipo empieza a decir "ese test siempre falla, ignóralo", la suite ya murió. Arréglalo el mismo día.',
        'Cuidado con tests que dependen de la zona horaria de la máquina: crea siempre las fechas en UTC explícito (DateTimeKind.Utc), nunca con DateTime.Now.'
      ],
      quiz: [
        { q: '¿Por qué un test intermitente es peor que no tener test?', a: 'Porque enseña al equipo a ignorar el color rojo. Cuando un fallo real aparezca, nadie lo va a investigar porque asumirán que es el test de siempre.' },
        { q: '¿Cuáles son las causas más comunes de intermitencia?', a: 'Depender del reloj real, del orden de ejecución, de esperas con Thread.Sleep, del orden no garantizado de una consulta sin ORDER BY, o de recursos compartidos como puertos y archivos fijos.' },
        { q: '¿Qué es la mutación manual y para qué sirve?', a: 'Consiste en cambiar a propósito un operador o una condición en el código y comprobar que algún test se pone rojo. Si la suite sigue verde, esa lógica no está realmente cubierta aunque la cobertura diga que sí.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que los tests no son una tarea posterior sino una herramienta de diseño y de confianza: los unitarios prueban reglas en milisegundos, los de integración prueban que las piezas encajan de verdad, y su valor depende de que sean rápidos, aislados y capaces de fallar cuando algo se rompe.' }
      ],
      out: 'Suite completa estable, rápida y validada con mutaciones manuales.',
      file: 'docs/testing.md'
    }
  ]
}
]);
