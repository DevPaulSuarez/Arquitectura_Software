/* Para qué sirve cada día en un trabajo real, por qué importa
   y qué preguntar (al cliente, al equipo o al tech lead) para aplicarlo.
   Clave: w<semana>d<día>. */
window.USO = Object.assign(window.USO || {}, {

/* ---------- Semana 5 · Clases, objetos y encapsulación ---------- */

'w5d1': {
  sirve: 'Pasar del modelo a clases es el primer código real de cualquier proyecto: el dominio escrito en C#. En el trabajo, la estructura de proyectos que creas ese día (Domain, Infrastructure, Api) la heredan todos los que vengan después.',
  importa: 'Las clases de dominio son el corazón del sistema y lo que más dura. Si nacen como bolsas de datos sin sentido, todo el código posterior se escribe alrededor de ese error y cuesta mucho darle la vuelta.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué estructura de proyectos y carpetas usa el equipo para el dominio?', obt: 'La convención del equipo (nombres de proyectos, espacios de nombres, dónde va cada cosa) para no inventar la tuya.' },
    { a: 'Al tech lead', q: '¿Las clases de dominio llevan nombres en español o en inglés?', obt: 'La regla de idioma del código. Mezclar idiomas en un mismo proyecto es una fuente constante de confusión.' },
    { a: 'A un compañero', q: '¿Hay alguna clase ya hecha que debería mirar como ejemplo?', obt: 'Una referencia real del estilo del equipo, mucho más útil que cualquier guía genérica.' }
  ],
  evita: { q: '¿Cómo creo una clase en C#?', por: 'Eso está en la documentación y gastas el tiempo del compañero. Pregunta por decisiones del equipo que no puedes buscar en internet.' }
},

'w5d2': {
  sirve: 'Elegir entre campo y propiedad, y entre public, private o init, es decidir quién puede leer y cambiar cada dato. Es algo que revisas en cada pull request.',
  importa: 'Un setter público en el lugar equivocado permite que cualquier parte del código cambie el estado sin pasar por las reglas. Así aparecen los bugs de "no sé quién cambió esto", que son los más caros de rastrear.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué propiedades de Mascota deberían poder cambiar después de crearla y cuáles no?', obt: 'Qué datos son inmutables (fecha de nacimiento, especie) y cuáles cambian por métodos con reglas (peso, dueño).' },
    { a: 'En una revisión de código', q: '¿Por qué esta propiedad tiene un set público? ¿Quién la cambia?', obt: 'La justificación o el aviso de que hay que cerrarla y exponer un método con nombre de negocio.' },
    { a: 'Al veterinario', q: '¿Una vez registrada la especie de una mascota se puede corregir? ¿Quién lo hace?', obt: 'Si el dato es corregible, por quién y con qué registro, lo que decide su nivel de acceso.' }
  ],
  evita: { q: '¿Pongo todo con get y set y luego lo cambiamos?', por: 'Ese "luego" no llega nunca. Pregunta quién debe poder cambiar cada dato y por qué, y empieza cerrado.' }
},

'w5d3': {
  sirve: 'Poner el comportamiento dentro de las clases (cita.Cancelar(motivo) en vez de cita.Estado = "cancelada") hace que las reglas vivan junto a los datos. Es la diferencia entre un dominio rico y uno anémico.',
  importa: 'Si la lógica está suelta en controladores y servicios, la misma regla acaba copiada en cinco sitios con cinco variaciones. Cuando cambia, se actualizan cuatro y el quinto se convierte en un bug en producción.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Qué pasos sigues cuando cancelas una cita? ¿Avisas a alguien, liberas algo?', obt: 'Todo lo que debe hacer el método Cancelar, no solo cambiar un estado.' },
    { a: 'Al tech lead', q: '¿Dónde está hoy la lógica de cancelar una cita? ¿Hay más de un sitio?', obt: 'Mapa de la lógica duplicada que conviene mover dentro de la entidad.' },
    { a: 'En una revisión de código', q: '¿Esta comprobación pertenece al controlador o a la entidad?', obt: 'Un criterio: si es regla del negocio va en el dominio; si es formato de entrada va en el borde.' }
  ],
  evita: { q: '¿Hago un CitaService con todos los métodos?', por: 'Lleva directo al dominio anémico. Pregunta qué acciones del negocio tiene una cita y si alguna necesita algo externo a la propia cita.' }
},

'w5d4': {
  sirve: 'Un constructor que exige todo lo necesario impide crear objetos a medias. En el trabajo significa que nunca más tienes que comprobar si a una mascota le falta la especie.',
  importa: 'Un objeto que puede existir en estado inválido obliga a validar en todas partes "por si acaso". Con constructores estrictos, la validación se hace una vez y todo el resto del código puede confiar.',
  preguntas: [
    { a: 'Al veterinario', q: '¿Qué es lo mínimo que tienes que saber de una mascota para poder atenderla?', obt: 'Los parámetros obligatorios del constructor, decididos por el negocio.' },
    { a: 'Al tech lead', q: '¿Cómo construye EF Core nuestras entidades si el constructor tiene parámetros obligatorios?', obt: 'El patrón del equipo (constructor privado para el ORM, constructor público con reglas) para no romper la persistencia.' },
    { a: 'En una revisión de código', q: '¿Puede este objeto existir sin este dato aunque sea un momento?', obt: 'Detectar inicializaciones en dos pasos que dejan el objeto inválido entre medias.' }
  ],
  evita: { q: '¿Dejo un constructor vacío para que sea más fácil?', por: 'Más fácil de crear y más difícil de mantener. Pregunta qué datos son imprescindibles para que el objeto tenga sentido.' }
},

'w5d5': {
  sirve: 'Auditar la encapsulación es buscar todos los caminos por los que alguien puede romper el estado desde fuera: listas expuestas, setters abiertos, colecciones modificables. Es una revisión que se hace antes de que el dominio crezca.',
  importa: 'Exponer una List<Vacuna> pública permite añadir vacunas sin pasar por las reglas de calendario. Un hueco así parece inocente y es justo el que se usa en el bug más grave del año.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Exponemos colecciones como IReadOnlyCollection en todo el dominio?', obt: 'La convención del equipo para colecciones, que cierra el hueco más común de encapsulación.' },
    { a: 'A un compañero', q: '¿Puedes intentar dejar una cita en un estado imposible usando solo su interfaz pública?', obt: 'Una prueba práctica de la encapsulación desde fuera, como lo haría otro desarrollador con prisa.' },
    { a: 'En una revisión de código', q: '¿Por qué este método devuelve la lista interna en vez de una copia o vista de solo lectura?', obt: 'La corrección del hueco antes de que se use desde otro sitio.' }
  ],
  evita: { q: '¿Hace falta tanto private si somos pocos en el equipo?', por: 'El equipo crece y el código se queda. Pregunta qué reglas se pueden saltar hoy con el código actual.' }
},

'w5d6': {
  sirve: 'Demostrar con código que las invariantes no se pueden violar es lo que da confianza al equipo para tocar el dominio. Es la base de los tests unitarios que verás más adelante.',
  importa: 'Decir "las reglas están protegidas" no vale nada si no se puede ejecutar. Un programa que intenta romper cada regla y falla es una prueba que cualquiera puede repetir.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué invariante del dominio te preocupa más que alguien rompa sin darse cuenta?', obt: 'La regla prioritaria para demostrar primero.' },
    { a: 'Al veterinario', q: 'Si el sistema permitiera esta situación, ¿qué consecuencia tendría para un animal?', obt: 'El impacto real de cada invariante, que sirve para priorizar y para explicar por qué se protege.' },
    { a: 'A un compañero', q: 'Ejecuta este programa e intenta añadir un caso que viole una regla sin que salte el error.', obt: 'Un segundo par de ojos intentando romper lo que tú das por cerrado.' }
  ],
  evita: { q: '¿Con que compile ya está protegido?', por: 'Compilar no prueba reglas de negocio. Pregunta cómo demostrarías que es imposible violar la regla.' }
},

/* ---------- Semana 6 · Abstracción, interfaces y polimorfismo ---------- */

'w6d1': {
  sirve: 'Abstraer es esconder detalles que pueden cambiar (el proveedor de email, el SMS, el almacenamiento de archivos) detrás de un contrato estable. En el trabajo te permite cambiar de proveedor sin tocar el negocio.',
  importa: 'Cuando el proveedor de SMS sube los precios o desaparece, una buena abstracción convierte la migración en un cambio de una clase. Sin ella, son semanas buscando llamadas por todo el código.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué servicios externos usamos que podrían cambiar en el próximo año?', obt: 'La lista de detalles volátiles que merecen estar detrás de una abstracción.' },
    { a: 'Al dueño de la clínica', q: '¿Cómo prefieres avisar a los clientes: email, SMS o WhatsApp? ¿Puede cambiar?', obt: 'Si el canal es estable o variable, que decide si vale la pena abstraerlo.' },
    { a: 'En una revisión de código', q: '¿Esta interfaz esconde algo que de verdad puede cambiar, o abstrae por abstraer?', obt: 'Un freno a las abstracciones innecesarias que solo añaden archivos.' }
  ],
  evita: { q: '¿Le pongo interfaz a todas las clases?', por: 'Eso es ruido, no diseño. Pregunta qué partes pueden cambiar de forma independiente; solo esas necesitan abstracción.' }
},

'w6d2': {
  sirve: 'Una interfaz con dos implementaciones reales (email y SMS, o real y de prueba) es lo que permite cambiar comportamiento por configuración y testear sin servicios externos.',
  importa: 'Si una interfaz tiene una sola implementación y nunca tendrá otra, sobra. Si tiene dos de verdad, demuestra que el contrato está bien diseñado y no filtra detalles de una implementación concreta.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Esta interfaz tiene métodos que solo tienen sentido para el email?', obt: 'Detectar contratos que filtran detalles de una implementación (asunto, HTML) y que impiden otras.' },
    { a: 'A un compañero', q: '¿Cómo eliges en el arranque qué implementación usar en cada entorno?', obt: 'La forma en que el equipo configura implementaciones por entorno (desarrollo, pruebas, producción).' },
    { a: 'A QA', q: '¿Te serviría una implementación falsa que guarde los mensajes en memoria para revisarlos?', obt: 'Un uso real de la segunda implementación: probar sin mandar SMS de verdad.' }
  ],
  evita: { q: '¿Cómo se implementa una interfaz?', por: 'Es sintaxis y la encuentras en dos minutos. Pregunta si el contrato sirve para todas las implementaciones que imaginas.' }
},

'w6d3': {
  sirve: 'Componer (una Factura que recibe una lista de reglas de precio) en vez de heredar (FacturaConDescuentoYUrgencia) es la forma habitual de combinar comportamientos sin explosión de clases.',
  importa: 'La herencia para combinar variantes crece de forma exponencial: cada combinación nueva es una clase nueva. La composición crece de forma lineal. Es una de las decisiones que más diferencia un diseño mantenible de uno que hay que reescribir.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué descuentos y recargos existen y se pueden combinar entre sí?', obt: 'La lista de variaciones y si se combinan. Si se combinan, la composición es la respuesta.' },
    { a: 'Al tech lead', q: '¿Dónde tenemos jerarquías de herencia de más de dos niveles?', obt: 'Candidatos a refactorizar a composición.' },
    { a: 'En una revisión de código', q: 'Si mañana aparece un nuevo tipo de descuento, ¿cuántas clases hay que crear o tocar?', obt: 'La medida práctica de si el diseño escala: una clase nueva es bien, cinco es mal.' }
  ],
  evita: { q: '¿Herencia o composición, qué es mejor?', por: 'Sin contexto no hay respuesta. Pregunta cómo van a variar y combinarse los comportamientos y la respuesta sale sola.' }
},

'w6d4': {
  sirve: 'La herencia sí encaja cuando hay una relación "es un" real y estable, con comportamiento común (un DocumentoClinico base del que salen Receta y Certificado). Saber cuándo usarla es tan importante como saber cuándo no.',
  importa: 'Una herencia mal usada encadena clases que no deberían depender entre sí: cambias el padre y se rompen hijos que ni sabías que existían. Las reglas (padre abstracto, poca profundidad, sellar lo que no se extiende) evitan ese efecto dominó.',
  preguntas: [
    { a: 'Al veterinario', q: '¿Qué tienen en común todos los documentos que emitís: recetas, certificados, informes?', obt: 'El comportamiento y los datos compartidos que justifican una clase base.' },
    { a: 'Al tech lead', q: '¿Sellamos las clases por defecto en este proyecto?', obt: 'La convención sobre sealed, que evita herencias accidentales.' },
    { a: 'En una revisión de código', q: '¿Este hijo usa todo lo que hereda o sobrescribe métodos para dejarlos vacíos?', obt: 'La señal de que la herencia está forzada y hay que replantearla.' }
  ],
  evita: { q: '¿Puedo heredar de esta clase para reutilizar un método?', por: 'Reutilizar código no es motivo para heredar. Pregunta si el hijo "es un" padre en todos los casos.' }
},

'w6d5': {
  sirve: 'El polimorfismo sustituye los switch por tipo ("si es receta haz esto, si es certificado aquello") por objetos que saben comportarse. En el trabajo elimina condicionales repetidos por todo el código.',
  importa: 'Cada switch por tipo es un sitio que hay que acordarse de actualizar al añadir un tipo nuevo. Cuando hay diez, siempre se olvida uno, y ese olvido es un bug que solo aparece con el tipo nuevo.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Cuántos switch o if por tipo de documento hay en el código?', obt: 'El tamaño del problema y los sitios que se beneficiarían del polimorfismo.' },
    { a: 'Al dueño de la clínica', q: '¿Esperas que aparezcan nuevos tipos de documento o de servicio?', obt: 'Si la lista es estable (un switch está bien) o crecerá (merece polimorfismo).' },
    { a: 'En una revisión de código', q: 'Si añado un tipo nuevo, ¿el compilador me avisa de todos los sitios que debo tocar?', obt: 'Una prueba práctica de si el diseño depende de la memoria del programador.' }
  ],
  evita: { q: '¿Quito todos los if del código?', por: 'No todos los if son malos. Pregunta cuáles deciden según el tipo de un objeto y se repiten en varios sitios.' }
},

'w6d6': {
  sirve: 'Refactorizar un dominio entero y justificar cada decisión es lo que se hace cuando un módulo empieza a doler. Es también lo que te piden explicar en una entrevista técnica de nivel medio.',
  importa: 'Refactorizar sin justificar convierte el código en el gusto de quien lo tocó último. Justificar cada cambio con un principio y un beneficio concreto es lo que convence al equipo y al tech lead de aceptarlo.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué parte del dominio te da más miedo tocar ahora mismo?', obt: 'El sitio donde el refactor aporta más valor.' },
    { a: 'Al tech lead', q: '¿Prefieres este refactor en un PR grande o en varios pequeños?', obt: 'La forma de entregar que el equipo puede revisar sin bloquearse.' },
    { a: 'A un compañero', q: '¿Entiendes por qué cambié esto sin que te lo explique?', obt: 'Si el código nuevo se explica solo o si falta un nombre o un comentario.' }
  ],
  evita: { q: '¿Puedo rehacer todo el dominio?', por: 'Suena a riesgo sin beneficio claro. Presenta el problema concreto, el cambio propuesto y cómo vas a comprobar que nada se rompe.' }
},

/* ---------- Semana 7 · Cohesión, acoplamiento y SOLID ---------- */

'w7d1': {
  sirve: 'Medir la cohesión te permite mirar una clase de 600 líneas y explicar con criterio qué le pasa y cómo partirla. Es lo que hace un senior en una revisión de código.',
  importa: 'Las clases cajón de sastre son donde se acumulan los bugs: todo el mundo las toca, por motivos distintos, y cada cambio rompe algo no relacionado. Detectarlas pronto evita que se vuelvan intocables.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué clase del proyecto se modifica en casi todos los pull requests?', obt: 'La candidata número uno a tener baja cohesión.' },
    { a: 'En una revisión de código', q: '¿Puedes describir esta clase en una frase sin usar "y"?', obt: 'Una prueba rápida de cohesión que cualquiera entiende.' },
    { a: 'A un compañero', q: '¿Qué métodos de esta clase usan campos que los demás no usan?', obt: 'Los grupos de métodos que en realidad son otra clase.' }
  ],
  evita: { q: '¿Esta clase es demasiado grande?', por: 'El tamaño no es el problema. Pregunta si todos sus métodos hablan del mismo tema y usan los mismos datos.' }
},

'w7d2': {
  sirve: 'Reducir el acoplamiento es lo que permite cambiar una parte del sistema sin romper otras. En el trabajo se nota cuando un cambio pequeño cuesta una hora en vez de tres días.',
  importa: 'El acoplamiento fuerte hace que no puedas testear sin base de datos real, ni cambiar de proveedor sin tocar el negocio. Es la causa número uno de que los equipos tengan miedo de tocar el código.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué módulo, si lo cambias, obliga a tocar más archivos de los que esperabas?', obt: 'El punto de acoplamiento más doloroso del proyecto.' },
    { a: 'En una revisión de código', q: '¿Por qué esta clase del dominio hace new de una clase de infraestructura?', obt: 'Un acoplamiento accidental que se resuelve con una interfaz y una inyección.' },
    { a: 'A un compañero', q: '¿Puedes testear esta clase sin levantar la base de datos?', obt: 'La prueba más práctica de acoplamiento: si no puedes, está demasiado atada.' }
  ],
  evita: { q: '¿Cómo quito todas las dependencias?', por: 'Cero acoplamiento es imposible. Pregunta qué dependencias son accidentales y cuáles son necesarias.' }
},

'w7d3': {
  sirve: 'El principio de responsabilidad única se aplica preguntando quién pide los cambios: si el contador y el veterinario piden cambios en la misma clase, tiene dos responsabilidades.',
  importa: 'Cuando dos personas distintas piden cambios en la misma clase, tarde o temprano el cambio de una rompe lo que usa la otra. SRP evita que una mejora en facturación rompa la ficha médica.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Quién te pide cambios en los reportes y quién en las fichas médicas?', obt: 'Los distintos actores que piden cambios, que marcan las fronteras de responsabilidad.' },
    { a: 'Al tech lead', q: '¿Esta clase cambió en el último mes por motivos de dos departamentos distintos?', obt: 'Evidencia en el historial de git de una clase con varias responsabilidades.' },
    { a: 'En una revisión de código', q: 'Si cambia la regla de impuestos, ¿esta clase tiene que cambiar?', obt: 'Una prueba concreta de si la clase mezcla responsabilidades.' }
  ],
  evita: { q: '¿SRP quiere decir que cada clase hace una sola cosa?', por: 'Es la interpretación equivocada más común. Pregunta por quién pide los cambios, que es lo que de verdad mide SRP.' }
},

'w7d4': {
  sirve: 'Abierto/cerrado significa poder añadir un caso nuevo (un nuevo tipo de descuento) creando código nuevo, sin editar el que ya funciona y está probado.',
  importa: 'Cada vez que editas código que funciona arriesgas romperlo. Un diseño abierto a extensión reduce ese riesgo justo en las zonas que más cambian.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Cada cuánto aparecen nuevas promociones, tarifas o tipos de servicio?', obt: 'Dónde está el cambio frecuente, que es donde OCP compensa.' },
    { a: 'Al tech lead', q: '¿Qué archivo hay que editar cada vez que se añade un caso nuevo?', obt: 'El punto que viola OCP y que conviene convertir en extensión.' },
    { a: 'En una revisión de código', q: '¿Este cambio añade un caso o modifica la lógica de los casos existentes?', obt: 'Si el diseño ya permite extender o si cada novedad toca lo probado.' }
  ],
  evita: { q: '¿Hago todo extensible por si acaso?', por: 'La extensibilidad prematura complica sin beneficio. Pregunta dónde ha habido cambios repetidos de verdad.' }
},

'w7d5': {
  sirve: 'Liskov detecta herencias que mienten: un hijo que no puede sustituir al padre sin romper algo. En el trabajo aparece cuando un subtipo lanza NotImplementedException o ignora parámetros.',
  importa: 'Si un subtipo no cumple el contrato del padre, todo el código que confía en ese contrato falla de forma imprevisible y solo con ese subtipo. Son bugs muy difíciles de encontrar porque el código "parece" correcto.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Tenemos subclases que lanzan NotImplementedException en métodos heredados?', obt: 'Violaciones de Liskov evidentes que conviene rediseñar.' },
    { a: 'Al veterinario', q: '¿Una consulta de urgencia sigue todas las reglas de una consulta normal o se salta algunas?', obt: 'Si la urgencia "es una" consulta de verdad o merece otro modelo.' },
    { a: 'En una revisión de código', q: 'Si sustituyo el padre por este hijo en todos los tests del padre, ¿pasan?', obt: 'La prueba práctica de Liskov.' }
  ],
  evita: { q: '¿Un cuadrado es un rectángulo?', por: 'Es el ejemplo de libro y no te ayuda con tu código. Pregunta por casos de tu dominio donde un subtipo se comporta distinto.' }
},

'w7d6': {
  sirve: 'Interfaces pequeñas y dependencias invertidas son lo que hace que el dominio no dependa de la base de datos ni de frameworks. Es el diseño que esperan en cualquier equipo .NET profesional.',
  importa: 'Con el dominio dependiendo de abstracciones, puedes cambiar la base de datos, el framework web o el proveedor de email sin tocar las reglas del negocio. Además, defender SOLID con tu propio código es una pregunta habitual en entrevistas.',
  preguntas: [
    { a: 'Al tech lead', q: '¿El proyecto de dominio tiene alguna referencia a EF Core, ASP.NET u otro framework?', obt: 'Si la inversión de dependencias se cumple de verdad o solo en teoría.' },
    { a: 'En una revisión de código', q: '¿Esta clase usa todos los métodos de la interfaz que recibe?', obt: 'Detección de interfaces gordas que conviene partir (ISP).' },
    { a: 'Al arquitecto', q: '¿Quién define las interfaces: el dominio que las usa o la infraestructura que las implementa?', obt: 'La regla de que la abstracción pertenece a quien la consume.' }
  ],
  evita: { q: '¿Cumplimos SOLID?', por: 'Pregunta de sí o no que no lleva a nada. Pregunta por un principio concreto en una clase concreta.' }
},

/* ---------- Semana 8 · Patrones e inyección de dependencias ---------- */

'w8d1': {
  sirve: 'La inyección de dependencias es pasar a una clase lo que necesita por el constructor en vez de que lo cree ella. Es la base de cómo se escribe cualquier aplicación .NET moderna.',
  importa: 'Entender DI a mano evita usar el contenedor como magia negra. Cuando algo falla en el arranque, quien sabe qué hace el contenedor lo arregla en minutos; quien no, pierde la tarde.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Hay clases en el proyecto que crean sus dependencias con new en lugar de recibirlas?', obt: 'Los puntos que impiden testear y cambiar implementaciones.' },
    { a: 'A un compañero', q: '¿Esta clase recibe demasiados parámetros en el constructor?', obt: 'Una señal de que la clase hace demasiado (más de cuatro o cinco dependencias suele serlo).' },
    { a: 'En una revisión de código', q: '¿Por qué se usa aquí un service locator en vez de inyección por constructor?', obt: 'Detectar dependencias ocultas que dificultan entender y probar la clase.' }
  ],
  evita: { q: '¿Qué contenedor de DI es el mejor?', por: 'La herramienta importa menos que el concepto. Pregunta qué dependencias tiene una clase y quién debería crearlas.' }
},

'w8d2': {
  sirve: 'Elegir entre singleton, scoped y transient decide cuánto vive cada servicio. En ASP.NET Core, el DbContext es scoped por petición, un cliente HTTP suele ser singleton, etc.',
  importa: 'Un tiempo de vida equivocado produce bugs graves: un DbContext singleton compartido entre peticiones mezcla datos de usuarios distintos y falla con concurrencia. Son errores que no salen en desarrollo y explotan con carga real.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Este servicio guarda estado entre llamadas? ¿Es seguro compartirlo entre hilos?', obt: 'Los dos criterios que deciden si puede ser singleton.' },
    { a: 'En una revisión de código', q: '¿Hay algún singleton que reciba un servicio scoped?', obt: 'La dependencia cautiva, un error clásico que ASP.NET detecta en desarrollo si se activa la validación.' },
    { a: 'A un compañero', q: '¿Tenemos activada la validación de scopes del contenedor en desarrollo?', obt: 'Si el equipo recibe aviso automático de errores de tiempo de vida.' }
  ],
  evita: { q: '¿Pongo todo como singleton para que vaya más rápido?', por: 'Ganas microsegundos y arriesgas datos cruzados entre usuarios. Pregunta si el servicio tiene estado y si es seguro entre hilos.' }
},

'w8d3': {
  sirve: 'Strategy encapsula algoritmos intercambiables (cálculo de precios por tipo de cliente, por ejemplo). Ponerle nombre al patrón permite que el equipo lo reconozca y lo use igual en todo el código.',
  importa: 'Los nombres de patrones son vocabulario compartido: decir "es un Strategy" ahorra diez minutos de explicación en una revisión. Además, es de los patrones más preguntados en entrevistas.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Las tarifas cambian según el tipo de cliente, de mascota o de horario?', obt: 'Los ejes de variación que pueden convertirse en estrategias.' },
    { a: 'Al tech lead', q: '¿Cómo elegimos la estrategia: por configuración, por datos de la petición o por usuario?', obt: 'El mecanismo de selección, que muchas veces termina en una Factory.' },
    { a: 'En una revisión de código', q: '¿Esta estrategia necesita estado o puede ser una función sin estado?', obt: 'Si basta con un delegado o hace falta una clase completa.' }
  ],
  evita: { q: '¿Dónde puedo meter un Strategy?', por: 'Buscar dónde meter un patrón es diseñar al revés. Pregunta qué algoritmo cambia según el caso; si existe, el patrón aparece.' }
},

'w8d4': {
  sirve: 'Una Factory centraliza la decisión de qué objeto crear según los datos de entrada. En el trabajo evita que esa lógica de creación esté repartida por controladores y servicios.',
  importa: 'Si la decisión de qué crear está copiada en varios sitios, añadir un tipo nuevo exige encontrarlos todos. Una Factory deja un único punto que cambiar y probar.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Dónde decidimos hoy qué tipo de documento crear según la consulta?', obt: 'Los sitios donde la creación está duplicada y conviene centralizar.' },
    { a: 'Al veterinario', q: '¿Qué datos de la consulta determinan si se emite receta, certificado o informe?', obt: 'Las reglas exactas que irán dentro de la Factory.' },
    { a: 'En una revisión de código', q: '¿Esta Factory solo decide qué crear o también tiene lógica de negocio?', obt: 'Mantener la Factory enfocada en la creación.' }
  ],
  evita: { q: '¿Hago una Factory para cada clase?', por: 'Solo hace falta cuando la creación depende de datos o es compleja. Pregunta si hay una decisión de "qué crear" que se repite.' }
},

'w8d5': {
  sirve: 'Un Adapter envuelve una librería o API externa (un proveedor de SMS, una pasarela de pagos) para que tu dominio hable con ella en tu propio idioma.',
  importa: 'Las APIs externas cambian de versión, de forma y a veces de proveedor. Sin Adapter, ese cambio se filtra a todo el sistema; con él, se arregla en una sola clase.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué SDKs de terceros se usan directamente desde el dominio o los controladores?', obt: 'Los puntos donde falta un Adapter.' },
    { a: 'Al proveedor externo o su documentación', q: '¿Qué errores devuelve la API, con qué códigos y cada cuánto cambia de versión?', obt: 'Lo que el Adapter debe traducir a errores de tu dominio.' },
    { a: 'En una revisión de código', q: '¿Algún tipo del SDK externo se escapa fuera del Adapter?', obt: 'Detectar fugas que atan tu código a la librería.' }
  ],
  evita: { q: '¿Uso directamente el SDK, que es más rápido?', por: 'Es más rápido hoy y más caro mañana. Pregunta qué pasa si hay que cambiar de proveedor.' }
},

'w8d6': {
  sirve: 'El Repository esconde cómo se guardan los agregados para que el dominio solo vea "dame la mascota" y "guarda la cita". Saber cuándo usar cada patrón es lo que se valora en una revisión de diseño.',
  importa: 'Usar patrones donde no hacen falta complica tanto como no usarlos donde sí. Poder defender por qué usaste Repository aquí y no allí demuestra criterio, que es lo que diferencia a un senior.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Usamos repositorios encima de EF Core o el DbContext directamente?', obt: 'La postura del equipo y sus motivos; hay equipos que hacen cada cosa por buenas razones.' },
    { a: 'En una revisión de código', q: '¿Este repositorio devuelve IQueryable o resultados ya materializados?', obt: 'Si la abstracción se filtra hacia fuera o está bien cerrada.' },
    { a: 'Al arquitecto', q: '¿Qué patrón de los que usamos te parece que sobra?', obt: 'Una opinión con experiencia sobre la complejidad innecesaria del proyecto.' }
  ],
  evita: { q: '¿Hago un repositorio genérico para todas las entidades?', por: 'El genérico expone operaciones que muchos agregados no deberían tener. Pregunta qué operaciones necesita cada agregado.' }
}

});
