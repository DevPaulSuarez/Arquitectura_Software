/* Refuerzos técnicos: la base que la ruta usa sin haberla explicado,
   colocada justo antes del día que la necesita. Se muestran en «Estudia la fuente».
   Clave: w<semana>d<día>. */
window.REFUERZOS = Object.assign(window.REFUERZOS || {}, {

'w5d1': {
  t: 'Git desde el primer día de código',
  porque: 'Hoy escribes la primera línea de VetCare. Si la guardas en git desde ya, llegarás a la semana 20 con 15 semanas de práctica diaria en lugar de empezar de cero.',
  explica: [
    'Git guarda fotos (commits) de tu proyecto. Cada commit tiene un mensaje que explica por qué cambiaste algo. Si rompes algo, puedes volver a cualquier foto anterior.',
    'El ciclo diario tiene tres pasos: modificas archivos, eliges cuáles entran en la próxima foto (git add) y haces la foto con un mensaje (git commit). git status te dice en todo momento en qué punto estás.',
    'Una regla para toda la ruta: un commit por cada paso de «Hazlo tú» que cambie código. Al final de cada día, tu historial cuenta lo que aprendiste.'
  ],
  ejemplo: `# Una sola vez, en la carpeta del proyecto
git init
dotnet new gitignore          # ignora bin/, obj/ y otros
git add .
git commit -m "Crea la solución y el proyecto de dominio"

# El ciclo de cada día
git status                    # ¿qué cambió?
git diff                      # ¿qué cambió exactamente?
git add src/VetCare.Domain/Mascota.cs
git commit -m "Añade Mascota con nombre, especie y fecha de nacimiento"

git log --oneline             # el historial, una línea por commit

# Si te equivocas
git restore Mascota.cs        # descarta cambios sin guardar
git commit --amend            # corrige el mensaje del último commit`,
  errores: [
    'Subir bin/ y obj/ al repositorio. Por eso el .gitignore va antes del primer commit.',
    'Mensajes como «cambios» o «fix». Escribe qué hace el commit, en imperativo: «Valida que el peso sea positivo».',
    'Hacer un único commit al final del día con todo mezclado. Si algo se rompe, no sabrás qué parte fue.',
    'Guardar contraseñas o cadenas de conexión en archivos que se suben. En la semana 19 aprenderás a sacarlas; hasta entonces, no escribas secretos reales.'
  ],
  comprueba: [
    { q: '¿Qué diferencia hay entre git add y git commit?', a: 'git add elige qué cambios entran en la próxima foto (el área de preparación); git commit hace la foto con un mensaje. Puedes cambiar diez archivos y hacer commit solo de dos.' },
    { q: '¿Por qué el .gitignore se crea antes del primer commit?', a: 'Porque lo que ya está en el historial se queda ahí aunque luego lo ignores. Es más fácil no subir bin/ y obj/ que sacarlos después.' },
    { q: '¿Qué comando te dice qué archivos cambiaste y cuáles están preparados para el commit?', a: 'git status. Úsalo antes de cada add y cada commit, hasta que sea un reflejo.' }
  ],
  fuente: { t: 'Pro Git, capítulo 2: Git Basics', u: 'https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository' }
},

'w5d3': {
  t: 'El depurador: ver lo que hace tu código en lugar de adivinarlo',
  porque: 'Hoy empiezas a meter reglas dentro de las clases. Cuando una no se comporte como esperas, el depurador te enseña el valor de cada variable línea a línea, sin llenar el código de Console.WriteLine.',
  explica: [
    'Un punto de interrupción (breakpoint) detiene el programa en una línea concreta. Mientras está detenido, puedes ver el valor de todas las variables, el objeto actual (this) y quién llamó a ese método (la pila de llamadas).',
    'Desde ahí avanzas: «paso por encima» ejecuta la línea y se detiene en la siguiente; «paso a paso» entra dentro del método que se llama en esa línea; «continuar» corre hasta el siguiente breakpoint.',
    'Un breakpoint condicional solo se detiene cuando se cumple algo, por ejemplo «peso < 0». Es la herramienta para encontrar el único caso raro entre mil.'
  ],
  ejemplo: `VS Code (con la extensión C# Dev Kit) o Visual Studio / Rider:

1. Haz clic a la izquierda del número de línea
   -> aparece un punto rojo (breakpoint)
2. F5 -> ejecuta en modo depuración
   (en VS Code elige ".NET" y el proyecto Playground)
3. El programa se detiene en la línea marcada:
   - Panel "Variables": valores actuales
   - Panel "Watch": escribe una expresión (cita.Fin - cita.Inicio)
   - Panel "Call stack": quién llamó a este método
4. Avanza:
   F10  paso por encima (siguiente línea)
   F11  paso a paso (entra en el método)
   Shift+F11  sal del método actual
   F5   continúa hasta el siguiente breakpoint
5. Breakpoint condicional:
   clic derecho en el punto rojo -> "Edit condition"
   -> pesoKg <= 0`,
  errores: [
    'Llenar el código de Console.WriteLine para entender un fallo y olvidar quitarlos después.',
    'Ejecutar con «dotnet run» y esperar que se detenga en el breakpoint: hay que arrancar en modo depuración (F5).',
    'Usar «paso a paso» (F11) en cada línea y acabar dentro del código del framework. Usa F10 y entra solo en tus métodos.',
    'Cambiar el código al azar hasta que funcione en lugar de detenerte y mirar qué valor tiene cada variable.'
  ],
  comprueba: [
    { q: '¿Qué diferencia hay entre F10 y F11?', a: 'F10 ejecuta la línea completa y se detiene en la siguiente. F11 entra dentro del método que se llama en esa línea. Usa F11 solo cuando sospeches de ese método.' },
    { q: '¿Para qué sirve la pila de llamadas (call stack)?', a: 'Para saber cómo llegaste a esa línea: qué método llamó a cuál. Cuando un valor llega mal, la pila te dice de dónde vino.' },
    { q: 'Tienes un bucle de 10.000 mascotas y solo una tiene un peso raro. ¿Cómo la encuentras?', a: 'Con un breakpoint condicional dentro del bucle, por ejemplo «pesoKg <= 0» o «nombre == "Rocky"». Se detendrá solo en ese caso.' }
  ],
  fuente: { t: 'Microsoft Learn: Debug a .NET console application with VS Code', u: 'https://learn.microsoft.com/en-us/dotnet/core/tutorials/debugging-with-visual-studio-code' }
},

'w6d2': {
  t: 'async y await: esperar sin bloquear',
  porque: 'A partir de hoy verás «Task», «async» y «await» en casi todas las semanas. Lo vas a usar a diario en cualquier API .NET, y es una pregunta fija en entrevistas.',
  explica: [
    'Cuando el código espera algo lento de fuera (la base de datos, un correo, otra API), el hilo puede quedarse bloqueado mirando o puede liberarse para atender otra petición mientras espera. async/await hace lo segundo: el código se lee como si fuera secuencial, pero el hilo queda libre durante la espera.',
    'Un método async devuelve Task (si no devuelve nada) o Task<T> (si devuelve un T). await espera a que la tarea termine y te da su resultado. Por convención, el nombre del método acaba en Async.',
    'async no hace que algo vaya más rápido ni lo ejecuta en paralelo: permite que el servidor atienda a más usuarios con los mismos hilos. Si necesitas lanzar dos esperas a la vez, empiezas las dos tareas y luego usas Task.WhenAll.'
  ],
  ejemplo: `// Síncrono: el hilo se queda bloqueado mientras espera
public void Enviar(string a, string texto)
{
    _smtp.Send(a, texto);              // bloquea hasta terminar
}

// Asíncrono: el hilo queda libre mientras espera
public async Task EnviarAsync(string a, string texto, CancellationToken ct)
{
    await _smtp.SendAsync(a, texto, ct);
}

// Devolver un valor: Task<T>
public async Task<Cita?> PorIdAsync(Guid id, CancellationToken ct)
    => await _db.Citas.FirstOrDefaultAsync(c => c.Id == id, ct);

// Dos esperas a la vez, no una detrás de otra
var tMascota = repoMascotas.PorIdAsync(mascotaId, ct);
var tDueno   = repoDuenos.PorIdAsync(duenoId, ct);
await Task.WhenAll(tMascota, tDueno);
var mascota = tMascota.Result;    // ya terminó: no bloquea

// MAL: bloquea el hilo y puede provocar interbloqueos
var cita = PorIdAsync(id, ct).Result;
// MAL: las excepciones se pierden y nadie espera el final
async void Guardar() { ... }`,
  errores: [
    'Usar .Result o .Wait() sobre una Task: bloquea el hilo y en algunos contextos produce un interbloqueo (deadlock).',
    'Escribir «async void»: nadie puede esperar al método y sus excepciones tumban el proceso. Solo se admite en manejadores de eventos.',
    'Olvidar el await: el método sigue antes de que la tarea termine y los errores desaparecen en silencio. El compilador suele avisar con el aviso CS4014.',
    'No pasar el CancellationToken: si el usuario cancela la petición, la consulta sigue ejecutándose para nada (lo verás en la semana 14).'
  ],
  comprueba: [
    { q: '¿async hace que mi código vaya más rápido?', a: 'No por sí solo. Libera el hilo mientras espera, así que el servidor atiende más peticiones a la vez. Una sola petición tarda lo mismo, salvo que lances varias esperas en paralelo con Task.WhenAll.' },
    { q: '¿Qué devuelve un método async que no devuelve ningún valor?', a: 'Task. No void. async void solo se usa en manejadores de eventos de interfaz.' },
    { q: '¿Por qué es peligroso usar .Result?', a: 'Porque bloquea el hilo esperando una tarea que a su vez puede necesitar ese mismo hilo para terminar: un interbloqueo. Además pierdes la ventaja de liberar el hilo.' },
    { q: 'Tienes que cargar la mascota y el dueño, que no dependen uno del otro. ¿Cómo lo harías más rápido?', a: 'Empiezo las dos tareas sin esperar y luego hago await Task.WhenAll(t1, t2). Así las dos esperas ocurren a la vez en lugar de una detrás de otra.' }
  ],
  fuente: { t: 'Microsoft Learn: Asynchronous programming with async and await', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/' }
},

'w8d6': {
  t: 'LINQ: consultar colecciones como si fueran tablas',
  porque: 'Hoy implementas el repositorio en memoria con Where, OrderBy y Any, y desde la semana 12 EF Core convierte esas mismas expresiones en SQL. Entender LINQ es entender la mitad del código de acceso a datos en .NET.',
  explica: [
    'LINQ son métodos para filtrar (Where), transformar (Select), ordenar (OrderBy), comprobar (Any, All), contar (Count), agrupar (GroupBy) y obtener uno (First, Single) sobre cualquier colección. Reciben lambdas: «c => c.Estado == Estado.Pendiente» se lee «para cada c, quédate con las pendientes».',
    'La ejecución es diferida: escribir el Where no hace nada todavía. La consulta se ejecuta cuando la recorres o la materializas con ToList, ToArray, Count o First. Si la recorres dos veces, se ejecuta dos veces.',
    'Con EF Core la diferencia importa mucho: sobre un IQueryable, LINQ se traduce a SQL y se ejecuta en la base. Si llamas a ToList demasiado pronto, traes toda la tabla a memoria y filtras después.'
  ],
  ejemplo: `var citas = repo.Todas();   // List<Cita>

// Filtrar y ordenar
var deHoy = citas
    .Where(c => DateOnly.FromDateTime(c.Inicio) == hoy)
    .OrderBy(c => c.Inicio)
    .ToList();

// Transformar a otra forma (proyección)
var filas = deHoy.Select(c => new { c.Id, Hora = c.Inicio.ToString("HH:mm") });

// Preguntas de sí o no
bool haySolape = citas.Any(c => c.VeterinarioId == vet && c.Inicio < fin && inicio < c.Fin);

// Uno solo
var cita  = citas.FirstOrDefault(c => c.Id == id);  // null si no hay
var unica = citas.Single(c => c.Id == id);          // excepción si hay 0 o más de 1

// Agrupar y contar
var porVet = citas
    .GroupBy(c => c.VeterinarioId)
    .Select(g => new { VeterinarioId = g.Key, Total = g.Count() });

// EF Core: MAL (trae toda la tabla y filtra en memoria)
var malas  = db.Citas.ToList().Where(c => c.VeterinarioId == vet);
// BIEN (el filtro se convierte en WHERE en el SQL)
var buenas = await db.Citas.Where(c => c.VeterinarioId == vet).ToListAsync(ct);`,
  errores: [
    'Llamar a ToList antes de filtrar en EF Core: trae toda la tabla a memoria.',
    'Usar Count() > 0 para saber si hay alguno: Any() se detiene en el primero que encuentra.',
    'Usar First cuando puede no haber resultado: lanza excepción. Usa FirstOrDefault y comprueba null.',
    'Recorrer dos veces la misma consulta diferida sin materializarla: la ejecutas dos veces (y con EF, son dos viajes a la base).'
  ],
  comprueba: [
    { q: '¿Cuándo se ejecuta realmente «citas.Where(c => c.Pendiente)»?', a: 'Cuando la recorres o la materializas: foreach, ToList, Count, First… Escribir el Where solo describe la consulta. Eso es la ejecución diferida.' },
    { q: '¿Qué diferencia hay entre First, FirstOrDefault y Single?', a: 'First devuelve el primero y lanza excepción si no hay ninguno. FirstOrDefault devuelve null (o el valor por defecto) si no hay ninguno. Single exige que haya exactamente uno y lanza excepción si hay cero o más de uno.' },
    { q: '¿Por qué «db.Citas.ToList().Where(…)» es un problema y «db.Citas.Where(…).ToList()» no?', a: 'En el primero, ToList trae todas las filas de la base y el filtro se aplica en memoria. En el segundo, EF Core traduce el Where a SQL y solo viajan las filas que cumplen la condición.' }
  ],
  fuente: { t: 'Microsoft Learn: Language Integrated Query (LINQ)', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/linq/' }
},

'w10d1': {
  t: 'Big O y estructuras de datos: cómo crece el coste',
  porque: 'Hoy ves que un índice convierte una búsqueda de «leer toda la tabla» en «ir casi directo». Eso tiene nombre: pasar de O(n) a O(log n). Es la misma idea que elegir bien entre List, Dictionary y HashSet en tu código, y una pregunta fija en entrevistas.',
  explica: [
    'La notación Big O describe cómo crece el trabajo cuando crecen los datos, no cuántos milisegundos tarda. O(1): igual con 10 que con un millón. O(log n): crece muy despacio (un millón de elementos son unos 20 pasos). O(n): el doble de datos, el doble de trabajo. O(n²): el doble de datos, cuatro veces el trabajo.',
    'Cada colección de .NET tiene sus costes. List<T>: acceder por posición es O(1), pero buscar un elemento (Contains, Find) es O(n). Dictionary<K,V> y HashSet<T>: buscar por clave es O(1) de media. SortedDictionary y los índices B-tree de la base: O(log n), y además mantienen el orden.',
    'El error típico es un bucle dentro de otro bucle sin darse cuenta: un Contains sobre una List dentro de un foreach es O(n²). Con 100 elementos no se nota; con 100.000, la pantalla se congela.'
  ],
  ejemplo: `// O(n²): por cada cita, recorre TODA la lista de mascotas
foreach (var cita in citas)                                   // n
{
    var m = mascotas.First(x => x.Id == cita.MascotaId);      // n
}
// 10.000 citas x 10.000 mascotas = 100.000.000 comparaciones

// O(n): un diccionario hace la búsqueda en O(1)
var porId = mascotas.ToDictionary(m => m.Id);                 // n, una vez
foreach (var cita in citas)                                   // n
{
    var m = porId[cita.MascotaId];                            // O(1)
}
// 10.000 + 10.000 = 20.000 operaciones

// HashSet para "¿ya lo vi?"
var vistos = new HashSet<Guid>();
if (!vistos.Add(cita.Id)) { /* duplicado */ }                 // O(1)

Resumen de costes de búsqueda
  List<T>.Contains           O(n)
  HashSet<T>.Contains        O(1)
  Dictionary<K,V>[clave]     O(1)
  SortedDictionary[clave]    O(log n)
  Seq Scan en PostgreSQL     O(n)
  Índice B-tree              O(log n)`,
  errores: [
    'Buscar con First o Contains sobre una List dentro de un bucle: O(n²) escondido.',
    'Pensar que Big O habla de milisegundos: habla de cómo crece el coste. Con pocos datos, un O(n) puede ser más rápido que un O(1) con más trabajo fijo.',
    'Usar List cuando la operación principal es «¿existe ya?»: para eso está HashSet.',
    'Optimizar sin medir: Big O dice qué va a doler al crecer, pero la decisión se confirma con una medición (lo harás en la semana 21).'
  ],
  comprueba: [
    { q: '¿Qué significa que una búsqueda sea O(log n)?', a: 'Que el trabajo crece muy despacio: cada paso descarta la mitad de lo que queda. Con un millón de elementos son unos 20 pasos. Es lo que hace un índice B-tree.' },
    { q: 'Tienes una lista de 50.000 ids y tienes que comprobar muchas veces si un id está dentro. ¿Qué estructura usas?', a: 'Un HashSet<Guid>: Contains es O(1) de media. Con una List, cada comprobación recorre la lista entera: O(n).' },
    { q: '¿Por qué un foreach con un First dentro puede congelar una pantalla?', a: 'Porque es O(n²): por cada elemento recorre la otra colección completa. Con 10.000 elementos son 100 millones de comparaciones. Se arregla creando antes un Dictionary por id.' },
    { q: '¿Qué relación hay entre un índice de la base de datos y Big O?', a: 'Sin índice, PostgreSQL lee toda la tabla (Seq Scan, O(n)). Con un índice B-tree, baja por el árbol en O(log n) hasta las filas que busca.' }
  ],
  fuente: { t: 'Microsoft Learn: Collections and data structures (.NET)', u: 'https://learn.microsoft.com/en-us/dotnet/standard/collections/' }
},

'w20d2': {
  t: 'Revisión de código: revisar y ser revisado',
  porque: 'Hoy trabajas con ramas, que en un equipo terminan en una pull request. Revisar el código de otros y recibir comentarios sobre el tuyo es parte diaria del trabajo de un ingeniero y lo que más acelera tu aprendizaje.',
  explica: [
    'Una pull request (PR) pide integrar tu rama en main. Antes del merge, otra persona la revisa. El objetivo no es encontrar culpables, sino que el código del proyecto mejore y que más de una persona lo entienda.',
    'Para que te revisen bien: PRs pequeñas (menos de 400 líneas), una descripción que diga qué cambia, por qué y cómo probarlo, y una revisión propia antes de pedir la ajena. Una PR enorme recibe un «LGTM» sin leer.',
    'Al revisar, en este orden: ¿hace lo que dice? ¿hay casos que no contempla? ¿tiene tests? ¿se entiende? El estilo lo comprueban las herramientas automáticas (dotnet format, linters), no las personas. Comenta sobre el código, no sobre la persona, y distingue lo bloqueante de las sugerencias.'
  ],
  ejemplo: `DESCRIPCIÓN DE UNA BUENA PR

  Título: Rechaza citas que se solapan con otra del mismo veterinario

  Qué cambia
  - AgendadorDeCitas consulta ExisteSolapadaAsync antes de guardar.
  - Nueva excepción HorarioOcupadoException -> 409 en la API.

  Por qué
  - Recepción agendaba dos citas a la misma hora (incidencia #12).

  Cómo probarlo
  - dotnet test (3 tests nuevos en AgendadorDeCitasTests)
  - POST /api/citas dos veces con el mismo horario -> 201 y luego 409

  Fuera de esta PR
  - La constraint en la base llega en la PR siguiente.

COMENTARIOS DE REVISIÓN

  MAL:  "Esto está mal."
  BIEN: "Si inicio == fin de otra cita, ¿cuenta como solape?
         Con < y no <= creo que sí se permiten citas contiguas,
         que es lo que pide RN-04. ¿Añadimos un test de ese caso?"

  Prefijos útiles:
    bloqueante:  hay que arreglarlo antes del merge
    sugerencia:  mejora opcional
    pregunta:    no entiendo algo; quizá no sea un problema`,
  errores: [
    'PRs gigantes que mezclan una funcionalidad, un refactor y cambios de formato: nadie puede revisarlas de verdad.',
    'Comentarios de estilo que una herramienta automática debería detectar: gastan la atención del revisor en lo menos importante.',
    'Tomarse los comentarios como algo personal, o escribirlos de forma que lo parezcan.',
    'Aprobar sin ejecutar ni entender el cambio: el «LGTM» de cortesía no protege a nadie.'
  ],
  comprueba: [
    { q: '¿Qué debe contener la descripción de una pull request?', a: 'Qué cambia, por qué (el problema o la incidencia), cómo probarlo y qué queda fuera. Con eso, el revisor entiende el contexto sin preguntarte.' },
    { q: '¿Qué revisas primero en una PR ajena?', a: 'Que haga lo que dice y que contemple los casos límite; luego los tests; luego que se entienda. El estilo lo revisan las herramientas automáticas.' },
    { q: '¿Por qué conviene que las PR sean pequeñas?', a: 'Porque se revisan mejor y más rápido, los errores se encuentran antes y, si algo se rompe, es fácil saber qué cambio fue y revertirlo.' }
  ],
  fuente: { t: 'Google Engineering Practices: How to do a code review', u: 'https://google.github.io/eng-practices/review/reviewer/' }
}

});
