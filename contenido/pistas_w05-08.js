/* Una pista por cada paso de «Hazlo tú»: cómo empezar, un ejemplo y cómo saber que está bien.
   Clave: w<semana>d<día>; el orden coincide con days[].steps. */
window.PISTAS = Object.assign(window.PISTAS || {}, {

/* ---------- Semana 5 ---------- */

'w5d1': [
  'Orden habitual: «dotnet new sln -n VetCare», «dotnet new classlib -o src/VetCare.Domain», «dotnet new console -o src/VetCare.Playground», «dotnet sln add» de los dos proyectos y «dotnet add src/VetCare.Playground reference src/VetCare.Domain». Comprueba con «dotnet build» desde la raíz: debe decir 0 errores.',
  'Copia los atributos de tu tabla de la semana 3 y conviértelos en propiedades: «public string Nombre { get; set; }», «public DateOnly FechaNacimiento { get; set; }», «public decimal PesoKg { get; set; }». Hoy no hace falta encapsular (eso es mañana); basta con que el tipo de cada propiedad coincida con tu modelo.',
  'Crea dos objetos de la misma clase con datos distintos, cambia una propiedad del primero e imprime los dos con Console.WriteLine. Ejemplo: «var max = new Mascota { Nombre = "Max" }; var luna = new Mascota { Nombre = "Luna" }; max.Nombre = "Maxi";». Si luna sigue llamándose Luna, has comprobado que cada objeto tiene su propio estado.'
],

'w5d2': [
  'Pregunta para cada propiedad: ¿alguien de fuera necesita LEERLA? ¿Y CAMBIARLA? Si solo se lee, usa «{ get; private set; }» o «{ get; init; }». Si nadie de fuera la usa, conviértela en campo privado «private int _contador;». Empieza cerrando todo y abre solo lo que haga falta para compilar.',
  'Patrón: «private readonly List<Vacuna> _vacunas = new(); public IReadOnlyList<Vacuna> Vacunas => _vacunas;». Desde fuera se puede recorrer, pero no hacer Add. Para añadir, crea un método con nombre del negocio: «public void RegistrarVacuna(Vacuna v)». Comprueba: «mascota.Vacunas.Add(...)» no debe compilar.',
  'Busca datos que se deducen de otros: la edad (a partir de la fecha de nacimiento), la duración de una cita (fin menos inicio), si una mascota tiene vacunas pendientes. Escríbelo así: «public int EdadEnAnios(DateOnly hoy) => …». Como depende de la fecha actual, pásale «hoy» como parámetro; mañana verás por qué.'
],

'w5d3': [
  'Busca reglas que hoy pondrías en el Program o en un servicio: «solo se puede cancelar una cita pendiente», «no se registra una vacuna con fecha futura», «el peso no puede bajar más de un 50 % de golpe». Conviértelas en métodos: cita.Cancelar(motivo), mascota.RegistrarVacuna(vacuna, hoy), mascota.ActualizarPeso(nuevoPeso).',
  'Estructura de cada método: primero todos los if que lanzan excepción, luego las asignaciones. Ejemplo: «if (Estado != EstadoCita.Pendiente) throw new InvalidOperationException("Solo se cancelan citas pendientes"); Estado = EstadoCita.Cancelada; MotivoCancelacion = motivo;». Si asignas algo antes de validar y luego falla, el objeto queda a medias.',
  'Busca DateTime.Now o DateTime.Today dentro de las clases y cámbialo por un parámetro: «public void Cancelar(string motivo, DateTime ahora)». Así puedes probar «cancelar con menos de 24 h» poniendo la fecha que quieras, sin esperar al día real. Comprueba: no debe quedar ningún DateTime.Now en src/VetCare.Domain.'
],

'w5d4': [
  'Al inicio del constructor valida cada parámetro: «if (string.IsNullOrWhiteSpace(nombre)) throw new ArgumentException("El nombre es obligatorio", nameof(nombre));», «if (pesoKg <= 0) throw new ArgumentOutOfRangeException(nameof(pesoKg));». Usa los mismos rangos de tu tabla de atributos de la semana 3.',
  'Si una clase solo tiene sentido con datos (Mascota sin nombre no existe), borra el constructor vacío. Si EF Core lo necesitará más adelante, déjalo como «private Mascota() { }» con un comentario «// para EF Core». Comprueba: «new Mascota()» desde Playground no debe compilar.',
  'Un método estático con nombre del negocio dice para qué se crea el objeto: «public static Cita Agendar(Guid mascotaId, Guid veterinarioId, RangoHorario horario, DateTime ahora)». Dentro valida (por ejemplo, que no sea en el pasado) y llama a un constructor privado. Es especialmente útil cuando hay varias formas de crear el mismo objeto.'
],

'w5d5': [
  'Los cinco agujeros típicos: 1) setters públicos, 2) colecciones públicas modificables, 3) constructores que no validan, 4) métodos que devuelven la lista interna, 5) propiedades de tipos mutables expuestas. Recorre cada clase con esta lista y apunta «Clase · agujero · línea».',
  'Para cada arreglo escribe una línea: «Mascota.Peso tenía set público → ahora ActualizarPeso() → protegía: el peso siempre es positivo». Si al cerrar un agujero no encuentras ninguna invariante que estuviera en riesgo, quizá no era un agujero: no hace falta cerrar por cerrar.',
  'Públicos (clases, propiedades, métodos): PascalCase → NombreMascota, Cancelar. Campos privados: guion bajo + camelCase → _vacunas. Parámetros y variables locales: camelCase → pesoKg. Usa la opción de renombrar del editor (F2) para que cambie todas las referencias a la vez.'
],

'w5d6': [
  'Ábrelo y comprueba que compila con «dotnet run --project src/VetCare.Playground». Si falta la referencia: «dotnet add src/VetCare.Playground reference src/VetCare.Domain». Borra el código de prueba de días anteriores o muévelo a un método aparte para empezar limpio.',
  'Usa una función auxiliar: «void Ataque(string nombre, Action accion) { try { accion(); Console.WriteLine("FALLO: " + nombre + " fue aceptado"); } catch (Exception e) { Console.WriteLine("OK: " + nombre + " → " + e.Message); } }». Ataques típicos: peso negativo, nombre vacío, cita en el pasado, cancelar dos veces, vacuna con fecha futura, añadir a una colección de solo lectura.',
  'Lee la salida buscando «FALLO». Cada uno es una invariante sin proteger: añade la validación en el constructor o en el método y vuelve a ejecutar. Termina cuando todas las líneas digan OK. Guarda esa salida: la usarás como referencia en el examen de la semana 6.'
],

/* ---------- Semana 6 ---------- */

'w6d1': [
  'Escribe la lista en una tabla con columnas: Candidato | ¿Puede cambiar de proveedor o tecnología? | ¿Necesito sustituirlo en pruebas?. Los seis del enunciado son buenos candidatos; añade al lado un ejemplo concreto: «Notificación: hoy email, mañana WhatsApp».',
  'Si contestas que sí a alguna de las dos preguntas, hazla interfaz. Si las dos son no, clase concreta. Ejemplo: el reloj → sí (en pruebas necesito una fecha fija) → interfaz. Un cálculo de edad → no y no → método normal. Escribe la decisión con una frase de motivo; los descartados también van al documento.',
  'Usa vocabulario del negocio y solo los métodos que necesitas hoy: «public interface INotificador { Task EnviarAsync(Destinatario a, string mensaje); }», «public interface IRelojSistema { DateTime Ahora { get; } }». Comprueba: ninguna firma debe mencionar SMTP, HTTP, SQL ni tipos de una librería externa.'
],

'w6d2': [
  'Ejemplos de parejas: NotificadorEmail / NotificadorEnMemoria (guarda los mensajes en una lista), RelojSistema / RelojFijo, RepositorioPostgres / RepositorioEnMemoria. La versión real puede ser sencilla por ahora (por ejemplo, escribir en consola «enviando email a…»); lo importante es que las dos implementen la misma interfaz.',
  'El servicio pide la interfaz por constructor: «public RecordatorioService(INotificador notificador, IRelojSistema reloj) { … }». Comprueba: dentro de RecordatorioService no debe aparecer ningún «new NotificadorEmail» ni el nombre de una clase concreta.',
  'En Program.cs crea el servicio dos veces: «new RecordatorioService(new NotificadorEmail(), reloj)» y «new RecordatorioService(new NotificadorEnMemoria(), reloj)», y llama al mismo método en los dos. Si el servicio funciona igual sin cambiar una línea de su código, la interfaz está bien diseñada.'
],

'w6d3': [
  'El candidato ideal tiene dos ejes que se combinan. Ejemplo en tarifas: tipo de cliente (normal, fidelizado) × horario (normal, urgencia). Con herencia tendrías TarifaNormal, TarifaFidelizado, TarifaUrgencia, TarifaFidelizadoUrgencia… Escribe los dos ejes y todas sus variantes.',
  'Haz la cuenta: variantes del eje A × variantes del eje B. Con 2 × 2 salen 4 clases; añade un tercer horario (fin de semana) y son 6; añade un eje más (especie) y se dispara. Implementa al menos 3 o 4 clases para sentir el problema y anota la fórmula.',
  'Con composición: «interface IReglaPrecio { decimal Aplicar(decimal precio); }» y una clase por regla (DescuentoFidelizado, RecargoUrgencia). La tarifa recibe una lista de reglas y las aplica en orden. Compara en una tabla: clases con herencia y con composición, y cuántas hay que crear para añadir una variante nueva (con composición, una).'
],

'w6d4': [
  'Prueba de «es un»: ¿una Receta es un DocumentoClinico en todos los casos, y comparten datos y comportamiento (fecha de emisión, veterinario que firma, mascota)? Si dudas, no es herencia. Los documentos clínicos son el ejemplo más claro en VetCare.',
  'Base: «public abstract class DocumentoClinico { public Guid MascotaId { get; } public DateTime Emitido { get; } protected DocumentoClinico(Guid mascotaId, DateTime emitido) { … } public abstract string Titulo { get; } }». Hojas: «public sealed class Receta : DocumentoClinico { … }». El constructor protected obliga a crear siempre una hoja concreta.',
  'Revisa tres cosas: 1) la base lleva abstract (no se puede hacer new DocumentoClinico), 2) cada hoja lleva sealed, 3) busca dentro de la base «is Receta», «GetType()» o «switch» por tipo: no debe haber ninguno. Si la base pregunta qué hijo es, el comportamiento debería estar en el hijo.'
],

'w6d5': [
  'Busca con el buscador del editor: «switch», «is Receta», «GetType()», «.Tipo ==», «TipoDocumento.». Anota cada uno con el archivo, la línea y qué decide (por ejemplo, el título del PDF según el tipo). Si no tienes ninguno, escribe uno a propósito para practicar.',
  'Si el switch decide el título según el tipo, añade «public abstract string Titulo { get; }» en la base y en cada hoja «public override string Titulo => "Receta";». Luego sustituye todo el switch por «documento.Titulo». Comprueba: el switch desaparece por completo, sin dejar un «default».',
  'Crea por ejemplo «sealed class CertificadoSalud : DocumentoClinico» con su override. El compilador te obligará a implementar los métodos abstractos. Comprueba con git diff: solo debe aparecer el archivo nuevo. Si tuviste que tocar otro archivo para que funcionara, ahí queda un switch escondido.'
],

'w6d6': [
  'Ejecuta «dotnet run --project src/VetCare.Playground > docs/salida-antes.txt». Así guardas la salida en un archivo para compararla después. Comprueba que todas las líneas dicen OK antes de empezar; si alguna dice FALLO, arréglala primero o no sabrás si la rompiste tú.',
  'Ve clase por clase y anota ✓/✗ en cada punto. Corrige un punto cada vez y compila después de cada cambio. Cambios pequeños y frecuentes: si algo se rompe, sabes exactamente qué fue.',
  'Ejecuta de nuevo hacia «docs/salida-despues.txt» y compara: «diff docs/salida-antes.txt docs/salida-despues.txt» (en Windows: «fc»). Si no imprime nada, el comportamiento es idéntico. Si hay diferencias, «git stash» o «git checkout» del archivo culpable y rehaz el cambio en pasos más pequeños.'
],

/* ---------- Semana 7 ---------- */

'w7d1': [
  'Haz una tabla sencilla: Clase | Métodos | Campos que usa cada método. Puedes usar la vista de esquema del editor (Outline en VS Code) para ver todos los métodos sin leer el código entero.',
  'Ejemplos: «Mascota existe para mantener los datos y la historia clínica de un animal» (bien). «GestorCitas existe para agendar citas Y enviar emails Y calcular precios» (sospechosa). Las palabras gestor, manager, helper o utils en el nombre casi siempre esconden un «y».',
  'Marca en la tabla qué campo usa cada método. Si salen grupos separados (los métodos 1-3 usan _repo y los métodos 4-5 usan _smtp, y nunca se cruzan), son dos clases dentro de una. Coloréalos: un color por grupo.',
  'Crea una clase por grupo de color y nómbrala por el tema: AgendadorDeCitas, NotificadorDeCitas, no CitasHelper2. Mueve los métodos con sus campos. La clase original puede desaparecer o quedarse solo con lo que de verdad le pertenece.',
  'Ejecuta «dotnet build» y cuenta los errores. Ve arreglándolos uno a uno (normalmente son cambios de tipo o de constructor). Anota el número inicial de errores en docs/diseno.md: indica cuántos sitios dependían de esa clase, y eso es el acoplamiento que verás mañana.'
],

'w7d2': [
  'Busca con el buscador del editor, solo en src/VetCare.Domain: «new Smtp», «new Http», «new Npgsql», «File.», «new Sql», «DateTime.Now». Apunta archivo, línea y qué crea. Cada resultado es una dependencia fija que impide probar y cambiar la clase.',
  'La interfaz debe tener solo lo que usa la clase de dominio. Si el dominio solo llama a Enviar, la interfaz es «interface INotificador { Task EnviarAsync(string destinatario, string mensaje); }», aunque la clase concreta tenga 20 métodos. Ponla en src/VetCare.Domain/Abstractions.',
  'Si no existe aún: «dotnet new classlib -o src/VetCare.Infrastructure», «dotnet add src/VetCare.Infrastructure reference src/VetCare.Domain». Mueve la clase y añade «: INotificador». La flecha de referencia va de Infrastructure a Domain, nunca al revés.',
  'Sustituye el campo «private readonly SmtpEmailSender _email = new(...)» por «private readonly INotificador _notificador;» y recíbelo en el constructor. Quien crea la clase (Playground o, más adelante, la API) decide qué implementación pasar.',
  'Busca «using VetCare.Infrastructure», «using Npgsql», «using System.Net.Mail» dentro de src/VetCare.Domain. Comprueba además el .csproj de Domain: no debe tener ninguna ProjectReference a Infrastructure. Cero resultados = objetivo cumplido.'
],

'w7d3': [
  'Tabla: Método | ¿Quién pediría cambiarlo?. Ejemplo para Factura: CalcularTotal → contabilidad; GenerarPdf → recepción (quiere otro diseño); Guardar → equipo técnico. Piensa en personas o departamentos reales de la clínica, no en capas técnicas.',
  'Si en una clase salen dos actores o más, agrupa los métodos por actor y crea una clase por grupo. La clase original puede quedarse con los datos y delegar en las nuevas, o desaparecer. Compila tras cada movimiento.',
  'Nombre = sustantivo que describe el trabajo + del qué: CalculadoraDeTotales, GeneradorDeRecibo, RepositorioDeFacturas. Evita Manager, Service o Helper solos. Prueba: si alguien lee solo el nombre de la clase, ¿adivina qué métodos tiene?',
  'Busca en src/VetCare.Domain: «pdf», «json», «html», «sql», «http», «Serialize». Si aparece en el dominio, ese código pertenece a otra capa (infraestructura o presentación). Muévelo y deja en el dominio solo lo que el negocio entendería.',
  'Copia la tabla del paso 1, ya corregida, con una columna nueva: Clase resultante. Debajo añade una frase: «Cada clase tiene un único actor que pide cambios en ella». En una entrevista, enseñar esta tabla explica SRP mejor que cualquier definición.'
],

'w7d4': [
  'Busca «switch», «case» y cadenas «if (tipo == …) else if». Elige el que tenga más ramas o el que más cambie (mira el historial con «git log -p» del archivo). Las tarifas y los descuentos son el candidato típico.',
  'Fíjate en qué cambia entre ramas. Si cada rama calcula un precio distinto: «interface IReglaPrecio { bool Aplica(Cita c); decimal Calcular(Cita c); }». Aplica dice si la regla corresponde al caso; Calcular hace el trabajo.',
  'Cada «case» se convierte en una clase: «case Urgencia: precio * 1.5» → «sealed class ReglaUrgencia : IReglaPrecio { public bool Aplica(Cita c) => c.EsUrgencia; public decimal Calcular(Cita c) => c.PrecioBase * 1.5m; }». Pon cada una en su archivo dentro de Precios/.',
  'Constructor: «public CalculadoraPrecio(IEnumerable<IReglaPrecio> reglas)». Método: «var regla = _reglas.FirstOrDefault(r => r.Aplica(cita)) ?? throw new InvalidOperationException("Sin regla para la cita");». Por ahora, en Playground, pasa la lista a mano: «new CalculadoraPrecio(new IReglaPrecio[] { new ReglaUrgencia(), … })».',
  'Crea por ejemplo ReglaFinDeSemana en un archivo nuevo y añádela solo a la lista que montas en Program.cs. Comprueba con «git status»: CalculadoraPrecio.cs y las otras reglas no deben aparecer como modificados.'
],

'w7d5': [
  'Busca: «throw new NotImplementedException», «throw new NotSupportedException» y overrides con el cuerpo vacío «{ }». Busca también overrides que no usan el parámetro que reciben. Cada uno es un hijo que promete algo que no cumple.',
  'Compara la primera línea de cada override con el método del padre: si el hijo añade un «if (x <= 0) throw» que el padre no tenía, exige más que el padre. Quien use el padre con un 0 (válido para él) romperá al recibir este hijo.',
  'Pregunta: ¿todos los hijos pueden hacer esto? Si solo algunos pueden (por ejemplo, firmar: un certificado se firma y una nota interna no), el padre promete demasiado → saca el método del padre. Si el hijo no es de verdad un caso del padre → que no herede.',
  'Ejemplo: «interface IFirmable { void Firmar(Veterinario v); }». Quita Firmar de DocumentoClinico; Receta y Certificado implementan IFirmable y NotaInterna no. El código que firma pide IFirmable, no DocumentoClinico. Los NotImplementedException desaparecen.',
  'Escribe una función que reciba DocumentoClinico y use solo lo que promete el padre (por ejemplo, Titulo y Emitido). Llámala con una instancia de cada hijo. Si alguna lanza una excepción o da un resultado raro, ese hijo todavía viola LSP. Con xUnit puedes hacerlo con [Theory] y una lista de documentos.'
],

'w7d6': [
  'Para cada interfaz mira quién la usa y qué métodos llama. Si AgendadorDeCitas solo usa Obtener y Guardar, y Reportes solo usa Listar, parte en dos: IRepositorioCitas (Obtener, Guardar) e IConsultasCitas (Listar). Regla orientativa: más de 5 métodos es sospechoso.',
  'Nombra según lo que hace el que la usa: ILeerCitas, INotificador, IRelojSistema. Evita ISqlRepo, IEmailService o IPostgresStore: atan el nombre a una tecnología y el dominio no debería saber cuál hay detrás. Usa F2 para renombrar en todo el proyecto.',
  'Con Mermaid: «graph LR; Api --> Domain; Infrastructure --> Domain; Api --> Infrastructure». Cada flecha significa «depende de / tiene referencia a». Sácalas de las ProjectReference de cada .csproj, no de memoria.',
  'Abre src/VetCare.Domain/VetCare.Domain.csproj: no debe tener ninguna ProjectReference ni paquetes de infraestructura (Npgsql, EF Core, clientes HTTP). En el diagrama, Domain solo debe recibir flechas, nunca enviarlas.',
  'Formato: letra · una frase · ejemplo en VetCare. «S: cada clase tiene un único actor que pide cambios — separé CalculadoraDeTotales de GeneradorDeRecibo». Haz las 5 y ensáyalas en voz alta. Si te quedas en blanco en alguna, vuelve a ese día.'
],

/* ---------- Semana 8 ---------- */

'w8d1': [
  'Empieza por las hojas (lo que no depende de nada) y sube: «var reloj = new RelojSistema(); var repo = new RepositorioCitasEnMemoria(); var notificador = new NotificadorConsola(); var agendador = new AgendadorDeCitas(repo, notificador, reloj);». Si una clase pide algo que todavía no has creado, créalo antes.',
  'RepositorioEnMemoria: «private readonly List<Cita> _citas = new();» y métodos que trabajan sobre la lista. NotificadorFalso: «public List<string> Enviados { get; } = new();» y en Enviar haces Enviados.Add(mensaje). RelojFijo: «public RelojFijo(DateTime ahora) => Ahora = ahora;».',
  'Monta el grafo con las tres falsas, agenda una cita y al final: «foreach (var m in notificador.Enviados) Console.WriteLine(m);». Como el notificador es falso, puedes ver qué se habría enviado sin mandar ningún email real.',
  'Crea «new RelojFijo(new DateTime(2026, 6, 10))» y agenda una cita para el 1 de junio. Debe lanzar excepción. La regla en AgendadorDeCitas: «if (horario.Inicio < _reloj.Ahora) throw new InvalidOperationException("No se agenda en el pasado");». Gracias al reloj falso, pruebas el pasado sin depender de la fecha real.',
  'Cuenta las líneas desde el primer new hasta que tienes el agendador. Con 3 dependencias son pocas, pero imagina 30 servicios, cada uno con 3 o 4 dependencias, creados en el orden correcto. Anota el número; mañana el contenedor hará esto por ti.'
],

'w8d2': [
  '«dotnet add src/VetCare.Playground package Microsoft.Extensions.DependencyInjection». Comprueba que aparece en el .csproj y que «dotnet build» sigue funcionando.',
  'Patrón: «var services = new ServiceCollection(); services.AddSingleton<IRelojSistema, RelojSistema>(); services.AddScoped<IRepositorioCitas, RepositorioCitasEnMemoria>(); services.AddTransient<AgendadorDeCitas>(); var provider = services.BuildServiceProvider(new ServiceProviderOptions { ValidateScopes = true });».',
  '«using var scope = provider.CreateScope(); var agendador = scope.ServiceProvider.GetRequiredService<AgendadorDeCitas>();». Repite la prueba de ayer: si se agenda igual, el contenedor está montando el mismo grafo que tú montabas a mano.',
  'Crea «class Contador { public Guid Id { get; } = Guid.NewGuid(); }» y tres clases que hereden de él (ContadorSingleton, ContadorScoped, ContadorTransient), registradas cada una con su tiempo de vida. Pide cada una dos veces en el mismo scope y luego en otro scope. Esperado: singleton tiene siempre el mismo Id, scoped repite Id dentro del scope y cambia entre scopes, transient cambia siempre.',
  'Registra como singleton un servicio que recibe IRepositorioCitas (scoped) y pídelo. Con ValidateScopes = true verás: «Cannot consume scoped service … from singleton …». Copia el mensaje a docs/diseno.md con una frase: un singleton vive para siempre y se quedaría con un repositorio que debería morir al acabar cada petición.'
],

'w8d3': [
  'Busca decisiones que el negocio cambia sin que cambie el resto del proceso: cuánto descuento aplicar, qué cita va primero, qué penalización tiene cancelar. Elige una y escribe 3 políticas reales posibles. Ejemplo: sin descuento, 10 % para clientes fidelizados, 20 % a partir de la segunda mascota.',
  'Un solo método que tome la decisión: «public interface IPoliticaDescuento { decimal Calcular(Factura factura); }». El nombre debe describir la decisión (PoliticaDescuento), no el patrón (IStrategy). Si necesitas dos métodos, probablemente son dos estrategias distintas.',
  'Una clase por política: SinDescuento (devuelve 0), DescuentoFidelidad, DescuentoMultiMascota. Cada una en su archivo y sin saber que las otras existen. Si dos comparten cálculo, extrae una función auxiliar, pero no las encadenes con herencia.',
  '«services.AddSingleton<IPoliticaDescuento, DescuentoFidelidad>();» y Facturador recibe «IPoliticaDescuento politica» por constructor. Para cambiar la política solo cambias esa línea de registro. Comprueba que Facturador no menciona ninguna política concreta.',
  'Crea «class DescuentoCero : IPoliticaDescuento { public decimal Calcular(Factura f) => 0; }» en el test. Construye Facturador con ella y comprueba que el total es exactamente la suma de las líneas. Si sale otro valor, Facturador tiene lógica de descuento escondida que debería estar en una estrategia.'
],

'w8d4': [
  '«public interface IFabricaDocumentos { DocumentoClinico Crear(TipoDocumento tipo, Consulta consulta); }» y su implementación «FabricaDocumentos» con un switch sobre el tipo. Este switch es aceptable: la fábrica es el único sitio que decide qué clase crear.',
  '«public FabricaDocumentos(IRelojSistema reloj) { _reloj = reloj; }» y usa «_reloj.Ahora» como fecha de emisión. Registra: «services.AddSingleton<IFabricaDocumentos, FabricaDocumentos>();». Comprueba que las fechas de los documentos salen de tu reloj fijo en las pruebas.',
  'Busca «new Receta(», «new Vacunacion(», «new Certificado(» fuera de la fábrica y de los tests. Sustitúyelos por «_fabrica.Crear(TipoDocumento.Receta, consulta)». Al terminar, la búsqueda solo debe encontrar resultados dentro de FabricaDocumentos.',
  'Crea el nuevo tipo (por ejemplo, InformeAlta), añade el valor al enum y un case en la fábrica. Con «git status» deberías ver solo: el archivo nuevo, el enum y la fábrica. Si aparece algún archivo cliente, todavía crea documentos por su cuenta.',
  'En el switch: «_ => throw new ArgumentOutOfRangeException(nameof(tipo), tipo, "Tipo de documento no soportado")». Nunca «_ => null»: un null viaja por el sistema y explota lejos de donde se originó, con un NullReferenceException que no dice nada.'
],

'w8d5': [
  'Elige la que más probablemente cambie de proveedor: el envío de correo (SMTP, SendGrid, Mailgun) es la más típica. Escribe qué operaciones necesita VetCare de verdad: probablemente solo «enviar un recordatorio a un dueño».',
  'Habla el idioma del negocio: «interface INotificador { Task EnviarRecordatorioAsync(Dueno dueno, Cita cita); }» y no «SendEmailAsync(MailMessage msg)». La interfaz no debe saber si al otro lado hay email, SMS o WhatsApp.',
  '«public sealed class NotificadorSendGrid : INotificador» en src/VetCare.Infrastructure/Notificaciones. Dentro traduces: Dueno → dirección de correo, Cita → asunto y cuerpo, y llamas al SDK. Si no tienes cuenta en ningún proveedor, simula la llamada con un Console.WriteLine; la estructura es lo que importa.',
  'Envuelve la llamada: «try { … } catch (SendGridException ex) { throw new NotificacionFallidaException("No se pudo enviar el recordatorio", ex); }». Define NotificacionFallidaException en el dominio. Pasa la excepción original como inner exception para no perder el detalle del error.',
  'Registra: «services.AddSingleton<INotificador, NotificadorSendGrid>();». Busca en src/VetCare.Domain «SendGrid», «MailKit», «System.Net.Mail»: cero resultados. Revisa también el .csproj de Domain: no debe tener ningún PackageReference del proveedor.'
],

'w8d6': [
  'Métodos con intención: «Task<Cita?> ObtenerAsync(Guid id); Task<IReadOnlyList<Cita>> DelVeterinarioEnDiaAsync(Guid veterinarioId, DateOnly dia); Task GuardarAsync(Cita cita);». Sin IQueryable: si devuelves IQueryable, quien llama puede construir consultas libres y el repositorio deja de esconder la base de datos.',
  'Usa una «List<Cita>» o un «Dictionary<Guid, Cita>» por dentro. DelVeterinarioEnDia filtra con LINQ: «_citas.Where(c => c.VeterinarioId == id && DateOnly.FromDateTime(c.Inicio) == dia).ToList()». Regístralo en el contenedor y agenda unas cuantas citas desde Playground.',
  'Dos rangos se solapan si «a.Inicio < b.Fin && b.Inicio < a.Fin». En AgendadorDeCitas: obtén las citas de ese veterinario ese día y, si alguna se solapa, lanza excepción. Prueba tres casos: solapada (rechaza), contigua 10:00–10:30 y 10:30–11:00 (acepta) y de otro veterinario a la misma hora (acepta).',
  'Ficha por patrón: Problema (qué dolía) · Solución (cómo lo resuelve) · En VetCare (dónde lo usaste) · Cuándo NO usarlo. Ejemplo de NO: «Factory: no hace falta si solo hay una clase y su creación es trivial». La sección del NO es la que demuestra criterio.',
  'Para cada patrón usa la estructura: problema concreto → por qué ese patrón → alternativa descartada. «Descuentos: cambiaban según la política del dueño → Strategy permite cambiar sin tocar Facturador → descarté un switch porque cada promoción nueva lo modificaba». Grábate 5 minutos y escúchate.'
]

});
