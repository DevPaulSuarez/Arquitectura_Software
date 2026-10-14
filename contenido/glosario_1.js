/* Glosario: el nombre técnico de cosas que probablemente ya hacías.
   t: término · en: nombre en inglés · def: qué es · ya: dónde lo hiciste sin saber el nombre
   dilo: cómo decirlo en una entrevista · dia: día de la ruta donde se estudia. */
window.GLOSARIO = (window.GLOSARIO || []).concat([

/* ---------- Requisitos ---------- */

{ t: 'Problema de negocio', en: 'Problem statement', dia: 'w1d1',
  def: 'La descripción del dolor real que el software debe quitar, sin mencionar ninguna tecnología.',
  ya: 'Cuando te pedían «un botón para exportar a Excel» y preguntabas «¿para qué lo necesitas?» hasta descubrir que en realidad querían el informe mensual en cinco minutos.',
  dilo: '«Antes de elegir la tecnología escribo el problema en una frase, para no construir la solución equivocada».' },

{ t: 'Stakeholder', en: 'Stakeholder', dia: 'w1d2',
  def: 'Cualquier persona afectada por el sistema: quien lo usa, quien lo paga, quien lo aprueba y quien sufre sus efectos.',
  ya: 'Cuando un proyecto se complicaba porque el jefe quería una cosa, el usuario otra y el área de contabilidad una tercera, y tenías que ponerlos de acuerdo.',
  dilo: '«Mapeo a los stakeholders y busco sus conflictos al principio, porque el que tiene poder de veto puede tumbar un sistema que funciona».' },

{ t: 'Requisito funcional', en: 'Functional requirement', dia: 'w1d3',
  def: 'Algo que el sistema debe HACER, escrito de forma que se pueda comprobar.',
  ya: 'Cada tarea de Jira del tipo «el usuario puede filtrar pedidos por fecha». Lo hacías todos los días; el nombre formal es este.',
  dilo: '«Un requisito funcional bien escrito tiene un resultado verificable; si no puedo escribir un test para él, todavía es un deseo».' },

{ t: 'Requisito no funcional', en: 'Non-functional requirement (NFR)', dia: 'w1d4',
  def: 'CÓMO de bien debe funcionar el sistema: velocidad, disponibilidad, seguridad, capacidad. Siempre con números.',
  ya: 'Cuando te decían «tiene que cargar rápido» o «no se puede caer en horario de oficina». Eran requisitos no funcionales, solo que sin número.',
  dilo: '«Los no funcionales deciden la arquitectura; por eso los convierto de adjetivos a números: menos de 1 s en el p95, no "rápido"».' },

{ t: 'Regla de negocio', en: 'Business rule', dia: 'w1d5',
  def: 'Una política que el negocio cumple aunque no exista software: «no se vacuna antes de las 8 semanas».',
  ya: 'Esos if que preguntabas al cliente si «siempre es así o hay excepciones»: descuentos, plazos, límites. Esa lógica es la regla de negocio.',
  dilo: '«Separo las reglas de negocio de las pantallas para que vivan en un solo sitio y se puedan cambiar y probar sin tocar la interfaz».' },

{ t: 'Criterios de aceptación', en: 'Acceptance criteria / Gherkin', dia: 'w1d6',
  def: 'Las condiciones concretas que deben cumplirse para dar una historia por terminada, a menudo en formato Dado / Cuando / Entonces.',
  ya: 'Cuando QA te devolvía una tarea porque «no hacía lo que se pidió» y discutíais qué significaba terminado. Los criterios de aceptación evitan esa discusión.',
  dilo: '«Escribo los criterios antes de programar; si todos pasan, la historia está terminada y no hay discusión».' },

{ t: 'Pregunta inducida', en: 'Leading question', dia: 'w2d1',
  def: 'Una pregunta que sugiere la respuesta («¿verdad que te vendría bien…?») y por eso no te enseña nada nuevo.',
  ya: 'Cuando proponías una solución en una reunión, el cliente decía que sí por cortesía y luego resultó que no la usaba.',
  dilo: '«En las entrevistas pregunto por hechos pasados ("cuéntame la última vez que…") en lugar de deseos, para no oír mi propia idea de vuelta».' },

{ t: 'Supuesto', en: 'Assumption', dia: 'w2d2',
  def: 'Algo que das por cierto sin haberlo confirmado. Se escribe y se numera para poder validarlo.',
  ya: 'Cada vez que pensabas «seguro que es una sola sede» y lo programabas así. Era un supuesto implícito; escribirlo lo convierte en uno explícito.',
  dilo: '«Escribo los supuestos y los ordeno por riesgo: valido primero el que me obligaría a rehacer más trabajo si fuera falso».' },

{ t: 'Scope creep', en: 'Scope creep', dia: 'w2d3',
  def: 'El crecimiento descontrolado del alcance: «solo una cosa más», una y otra vez, hasta que el proyecto no termina nunca.',
  ya: 'Esos proyectos de «dos semanas» que duraron cuatro meses porque cada reunión añadía algo.',
  dilo: '«Lo controlo con no-objetivos escritos y priorización MoSCoW; lo que entra, entra con algo que sale».' },

{ t: 'MoSCoW', en: 'MoSCoW prioritization', dia: 'w2d3',
  def: 'Clasificar requisitos en Must (imprescindible), Should (importante), Could (deseable) y Won\'t (esta versión no).',
  ya: 'Cuando decidías con tu jefe qué entraba en la primera entrega y qué se dejaba «para la fase 2».',
  dilo: '«Si los Must pasan del 60 % del esfuerzo, recorto. Así la primera versión sale de verdad».' },

{ t: 'Caso de uso', en: 'Use case', dia: 'w2d4',
  def: 'La descripción paso a paso de una interacción entre un actor y el sistema, incluidos los caminos alternativos y de error.',
  ya: 'Cuando escribías en un documento o en la cabeza «el usuario hace esto, el sistema responde aquello… ¿y si no hay stock?».',
  dilo: '«El camino feliz es la minoría del trabajo; los flujos alternativos son donde están los bugs, así que los escribo antes de programar».' },

{ t: 'User story', en: 'User story', dia: 'w2d5',
  def: 'Una necesidad contada desde el usuario: «Como [rol], quiero [acción], para [beneficio]».',
  ya: 'Las tarjetas del tablero del sprint. Si trabajaste con Scrum, escribiste o recibiste cientos.',
  dilo: '«Una historia debe aportar valor por sí sola y caber en pocos días; si no, la parto por flujo o por regla».' },

{ t: 'INVEST', en: 'INVEST', dia: 'w2d5',
  def: 'Lista de control para historias: Independiente, Negociable, Valiosa, Estimable, Pequeña (Small) y Testable.',
  ya: 'Cuando en el refinamiento alguien decía «esto es demasiado grande» o «esto depende de lo otro»: estaba aplicando INVEST sin nombrarlo.',
  dilo: '«Paso cada historia por INVEST; la S y la T son las que más fallan en la práctica».' },

{ t: 'Lenguaje ubicuo', en: 'Ubiquitous language', dia: 'w2d6',
  def: 'Usar las mismas palabras, con el mismo significado, en las conversaciones con el negocio, en los documentos y en el código.',
  ya: 'Cuando el cliente decía «pedido» y en el código se llamaba «orden» en un sitio y «compra» en otro, y había malentendidos constantes.',
  dilo: '«Mantengo un glosario del dominio y nombro las clases igual que el negocio; así una conversación se traduce directamente a código».' },

/* ---------- Modelado de dominio y datos ---------- */

{ t: 'Entidad', en: 'Entity', dia: 'w3d1',
  def: 'Algo con identidad propia que se mantiene aunque cambien sus datos: una mascota sigue siendo la misma aunque cambie de peso.',
  ya: 'Cada tabla con un id y cada clase que guardabas en la base: Cliente, Pedido, Producto.',
  dilo: '«Algo es entidad si necesito seguir su historia en el tiempo; si solo me importa su valor, es un value object».' },

{ t: 'Value object', en: 'Value object', dia: 'w3d4',
  def: 'Un objeto definido solo por su valor, sin identidad, normalmente inmutable y con sus reglas dentro: Dinero, Email, RangoHorario.',
  ya: 'Cuando validabas el email en cinco sitios distintos, o pasabas un decimal que podía ser kilos o gramos. Un value object resuelve exactamente eso.',
  dilo: '«Uso value objects para que un estado inválido no pueda ni representarse: un Peso negativo no compila o no se construye».' },

{ t: 'Identidad frente a igualdad', en: 'Identity vs equality', dia: 'w3d3',
  def: 'Dos entidades son la misma si tienen el mismo id, aunque sus datos coincidan con los de otra. Dos valores son iguales si sus datos coinciden.',
  ya: 'Cuando encontrabas clientes duplicados con los mismos datos y tenías que decidir si eran la misma persona.',
  dilo: '«Las entidades se comparan por id; los value objects, por valor. Confundirlo produce duplicados o fusiones indebidas».' },

{ t: 'Cardinalidad', en: 'Cardinality (1:1, 1:N, N:N)', dia: 'w3d5',
  def: 'Cuántos elementos de un lado se relacionan con cuántos del otro: uno a uno, uno a muchos o muchos a muchos.',
  ya: 'Cada vez que decidías si poner una clave foránea o crear una tabla intermedia.',
  dilo: '«Valido la cardinalidad buscando excepciones reales en el negocio; la que parece 1:N a menudo resulta ser N:N».' },

{ t: 'ERD', en: 'Entity-Relationship Diagram', dia: 'w3d6',
  def: 'El diagrama de entidades y relaciones: el plano de los datos del sistema.',
  ya: 'El diagrama que generaba tu herramienta de base de datos, o el que dibujabas en una pizarra antes de crear las tablas.',
  dilo: '«Valido el ERD recorriendo historias reales sobre él, no solo revisando que las cajas estén bien».' },

{ t: 'Clave foránea', en: 'Foreign key (FK)', dia: 'w4d1',
  def: 'Una columna que apunta al id de otra tabla y que la base garantiza que existe. Va en el lado de «muchos».',
  ya: 'El cliente_id de la tabla pedidos. Lo usabas siempre; la parte nueva es decidir con criterio el ON DELETE.',
  dilo: '«Elijo RESTRICT, CASCADE o SET NULL según la regla de negocio, no por defecto; en datos sensibles, RESTRICT».' },

{ t: 'Tabla puente', en: 'Join table / associative entity', dia: 'w4d2',
  def: 'La tabla que resuelve una relación muchos a muchos, y que a menudo tiene datos propios (fecha, cantidad, lote).',
  ya: 'La tabla pedido_producto con cantidad y precio. O, peor, cuando alguien guardaba ids separados por comas en una columna.',
  dilo: '«Si la relación tiene atributos o se repite en el tiempo, la tabla puente es una entidad con id propio».' },

{ t: 'Integridad referencial', en: 'Referential integrity', dia: 'w4d3',
  def: 'La garantía de que toda referencia apunta a algo que existe: no hay pedidos de clientes inexistentes.',
  ya: 'Esos errores de «violates foreign key constraint» al borrar algo. Eran la base protegiéndote.',
  dilo: '«La integridad la garantiza la base con constraints, no solo el código, porque a la base escriben más cosas que mi aplicación».' },

{ t: 'Constraint', en: 'Constraint (CHECK, UNIQUE, NOT NULL)', dia: 'w9d2',
  def: 'Una regla que la base de datos impone por sí sola y que rechaza cualquier dato que la incumpla.',
  ya: 'Cada NOT NULL y cada UNIQUE que pusiste. El CHECK es su hermano menos conocido: «peso > 0».',
  dilo: '«Nombro las constraints (ck_, uq_, fk_) para que el error diga qué regla se rompió y poder traducirlo a un mensaje útil».' },

{ t: 'Normalización', en: 'Normalization (1NF, 2NF, 3NF)', dia: 'w4d4',
  def: 'Organizar las tablas para que cada dato viva en un solo sitio y no haya copias que se contradigan.',
  ya: 'Cuando el teléfono del cliente estaba copiado en cada pedido y al cambiarlo quedaban versiones distintas.',
  dilo: '«Normalizo hasta 3FN y desnormalizo a propósito solo datos históricos, como el precio cobrado, que no debe cambiar si cambia la tarifa».' },

{ t: 'Invariante', en: 'Invariant', dia: 'w4d5',
  def: 'Una condición que debe cumplirse SIEMPRE: «un veterinario no tiene dos citas a la misma hora».',
  ya: 'Esas validaciones que tenías que acordarte de copiar en cada sitio que tocaba un dato. Una invariante bien protegida está en un único sitio.',
  dilo: '«Cada invariante tiene un dueño: un agregado o una constraint de la base. Si se puede saltar por algún camino, no está protegida».' },

{ t: 'Agregado', en: 'Aggregate (DDD)', dia: 'w4d5',
  def: 'Un grupo de objetos que se modifican juntos a través de una raíz, para proteger sus invariantes en una transacción.',
  ya: 'Un pedido con sus líneas: nunca guardabas una línea suelta, siempre el pedido completo.',
  dilo: '«Los agregados se referencian por id, no por objeto, y una transacción modifica uno solo; eso mantiene las fronteras claras».' },

/* ---------- C# y OOP ---------- */

{ t: 'Encapsulación', en: 'Encapsulation', dia: 'w5d5',
  def: 'Esconder el estado interno y exponer solo operaciones con nombre del negocio que respetan las reglas.',
  ya: 'Cuando un bug de «no sé quién cambió este valor» te obligaba a buscar todos los set públicos del proyecto.',
  dilo: '«Cierro setters y colecciones y expongo métodos como Cancelar(motivo); así las reglas no se pueden saltar desde fuera».' },

{ t: 'Dominio anémico', en: 'Anemic domain model', dia: 'w5d3',
  def: 'Clases que solo tienen datos (get y set) mientras toda la lógica vive en servicios aparte.',
  ya: 'Los proyectos con entidades vacías y un PedidoService de 2.000 líneas. Es muy común; tiene nombre de antipatrón.',
  dilo: '«Muevo el comportamiento a la entidad: cita.Cancelar() en lugar de cita.Estado = "cancelada" desde un servicio».' },

{ t: 'Método factoría', en: 'Factory method', dia: 'w5d4',
  def: 'Un método estático con nombre de negocio que crea un objeto válido: Cita.Agendar(…) en lugar de new Cita(…).',
  ya: 'Cuando tenías varios constructores y no quedaba claro cuál usar en cada caso.',
  dilo: '«Uso factorías con nombre cuando hay varias formas de crear un objeto o cuando crearlo tiene reglas».' },

{ t: 'Abstracción', en: 'Abstraction', dia: 'w6d1',
  def: 'Quedarte con lo esencial y esconder los detalles que pueden cambiar detrás de un contrato.',
  ya: 'Cuando cambiar de proveedor de correo te obligó a tocar veinte archivos y pensaste «debería haber una capa en medio».',
  dilo: '«Abstraigo lo que puede cambiar de proveedor o lo que necesito sustituir en pruebas; el resto, no».' },

{ t: 'Interfaz', en: 'Interface', dia: 'w6d2',
  def: 'Un contrato que dice QUÉ se puede hacer sin decir CÓMO; varias clases pueden cumplirlo de forma distinta.',
  ya: 'Todos esos IAlgoService que creabas porque «así se hace». Su sentido real es poder tener dos implementaciones intercambiables.',
  dilo: '«Una interfaz con una sola implementación que nunca tendrá otra suele sobrar; la justifico con un segundo uso real, aunque sea el de pruebas».' },

{ t: 'Composición sobre herencia', en: 'Composition over inheritance', dia: 'w6d3',
  def: 'Combinar comportamientos uniendo objetos pequeños en lugar de crear jerarquías de clases.',
  ya: 'Cuando las subclases se multiplicaron (UsuarioAdminConDescuento, UsuarioNormalConDescuento…) y cada combinación nueva era otra clase.',
  dilo: '«Con herencia, las variantes crecen multiplicándose; con composición, sumándose. Por eso compongo cuando hay ejes que se combinan».' },

{ t: 'Polimorfismo', en: 'Polymorphism', dia: 'w6d5',
  def: 'Que distintos objetos respondan al mismo mensaje cada uno a su manera, eliminando los switch por tipo.',
  ya: 'Cuando reemplazaste un switch gigante por clases que implementaban el mismo método. O cuando sufriste ese switch copiado en cinco sitios.',
  dilo: '«Si añadir un tipo nuevo me obliga a buscar switch por el código, el diseño depende de mi memoria; con polimorfismo, el compilador me avisa».' },

{ t: 'Clase sellada', en: 'Sealed class', dia: 'w6d4',
  def: 'Una clase de la que nadie puede heredar. En C# se marca con sealed.',
  ya: 'Probablemente nunca la usaste, y ahí está la lección: heredar debería ser una decisión, no la opción por defecto.',
  dilo: '«Sello las hojas de mis jerarquías; heredar de algo que no fue diseñado para ello crea dependencias frágiles».' },

/* ---------- Diseño y SOLID ---------- */

{ t: 'Cohesión', en: 'Cohesion', dia: 'w7d1',
  def: 'Cuánto tienen que ver entre sí las cosas que viven en una misma clase o módulo. Alta cohesión = un solo tema.',
  ya: 'Las clases Helper, Utils o Manager donde acababa todo lo que no sabías dónde poner. Eso es baja cohesión.',
  dilo: '«Detecto baja cohesión mirando si los métodos usan los mismos campos; si forman grupos separados, son dos clases».' },

{ t: 'Acoplamiento', en: 'Coupling', dia: 'w7d2',
  def: 'Cuánto depende una pieza de otra: si cambiar A obliga a cambiar B, están acopladas.',
  ya: 'Ese cambio «pequeño» que acabó tocando quince archivos. O la clase que no podías probar sin levantar la base de datos.',
  dilo: '«El acoplamiento decide si un cambio cuesta una hora o tres días; lo reduzco dependiendo de interfaces, no de clases concretas».' },

{ t: 'SRP · Responsabilidad única', en: 'Single Responsibility Principle', dia: 'w7d3',
  def: 'Una clase debe tener un solo motivo para cambiar, es decir, responder ante un solo actor del negocio.',
  ya: 'Cuando un cambio pedido por contabilidad rompió algo que usaba el área comercial, porque estaba en la misma clase.',
  dilo: '«SRP no es "hacer una sola cosa", es "un solo actor pide cambios aquí"; separo por quién pide los cambios».' },

{ t: 'OCP · Abierto/cerrado', en: 'Open/Closed Principle', dia: 'w7d4',
  def: 'Poder añadir comportamiento nuevo creando código nuevo, sin editar el que ya funciona.',
  ya: 'Cada vez que añadías otro case al switch de tarifas y rezabas para no romper los anteriores.',
  dilo: '«Aplico OCP donde el cambio es frecuente, como las tarifas: una regla nueva es una clase nueva, sin tocar las existentes».' },

{ t: 'LSP · Sustitución de Liskov', en: 'Liskov Substitution Principle', dia: 'w7d5',
  def: 'Un hijo debe poder usarse en lugar del padre sin que nada se rompa.',
  ya: 'Ese override que lanzaba NotImplementedException porque «esa subclase no lo soporta».',
  dilo: '«Si un hijo lanza NotImplemented o exige más que el padre, la herencia miente; muevo ese método a una interfaz aparte».' },

{ t: 'ISP · Segregación de interfaces', en: 'Interface Segregation Principle', dia: 'w7d6',
  def: 'Ningún cliente debería depender de métodos que no usa: mejor varias interfaces pequeñas que una enorme.',
  ya: 'El IRepositorio de 25 métodos que implementabas a medias en los tests.',
  dilo: '«Parto las interfaces por quién las usa: ILeerCitas para los reportes, IRepositorioCitas para las escrituras».' },

{ t: 'DIP · Inversión de dependencias', en: 'Dependency Inversion Principle', dia: 'w7d6',
  def: 'El código importante (el negocio) no depende de detalles (base de datos, correo); ambos dependen de abstracciones que define el negocio.',
  ya: 'Cuando separaste la lógica del acceso a datos con una interfaz y la implementación quedó en otro proyecto.',
  dilo: '«En mi solución, el proyecto de dominio no referencia nada de infraestructura; las flechas siempre apuntan hacia el dominio».' },

/* ---------- Patrones ---------- */

{ t: 'Inyección de dependencias', en: 'Dependency Injection (DI)', dia: 'w8d1',
  def: 'Pasarle a una clase lo que necesita (por el constructor) en lugar de que lo cree ella con new.',
  ya: 'Todos los constructores con parámetros como ILogger o IRepositorio en ASP.NET. Lo usabas a diario; DI es solo eso, sin magia.',
  dilo: '«DI es pasar colaboradores por constructor; el contenedor solo automatiza el armado del grafo de objetos».' },

{ t: 'Tiempos de vida', en: 'Service lifetimes (singleton, scoped, transient)', dia: 'w8d2',
  def: 'Cuánto vive cada servicio en el contenedor: toda la aplicación, una petición o cada vez que se pide.',
  ya: 'Ese AddScoped o AddSingleton que copiabas de otro registro sin pensar mucho.',
  dilo: '«El DbContext es scoped por petición; un singleton nunca debe recibir un scoped (captive dependency), y activo ValidateScopes para detectarlo».' },

{ t: 'Patrón Strategy', en: 'Strategy pattern', dia: 'w8d3',
  def: 'Encapsular algoritmos intercambiables detrás de una misma interfaz y elegir uno según el caso.',
  ya: 'Cuando tenías distintas formas de calcular un precio o un envío y las separaste en clases.',
  dilo: '«Uso Strategy cuando una decisión cambia según la política del negocio; el que la usa no sabe qué estrategia concreta recibe».' },

{ t: 'Patrón Factory', en: 'Factory pattern', dia: 'w8d4',
  def: 'Centralizar en un solo sitio la decisión de qué objeto crear según unos datos.',
  ya: 'Ese if/else que decidía qué tipo de documento o de notificación crear, y que estaba copiado en varios controladores.',
  dilo: '«La fábrica es el único sitio con permiso para hacer un switch por tipo; el resto del código pide y recibe».' },

{ t: 'Patrón Adapter', en: 'Adapter pattern', dia: 'w8d5',
  def: 'Envolver una librería o API externa para que tu código hable con ella en tu propio idioma.',
  ya: 'Cuando creaste una clase que envolvía el SDK de pagos o de correo para no usarlo directamente por todo el código.',
  dilo: '«El adapter traduce tipos y errores del proveedor a los de mi dominio; cambiar de proveedor es cambiar una clase».' },

{ t: 'Patrón Repository', en: 'Repository pattern', dia: 'w8d6',
  def: 'Una colección aparente de agregados que esconde cómo se guardan: «dame la cita», «guarda la cita».',
  ya: 'Los IXxxRepository que había en casi todos los proyectos .NET en los que trabajaste.',
  dilo: '«Mis repositorios exponen métodos con intención y nunca IQueryable; si lo exponen, la base de datos se escapa del repositorio».' }

]);
