/* Glosario (segunda parte): bases de datos, APIs, testing, resiliencia y arquitectura. */
window.GLOSARIO = (window.GLOSARIO || []).concat([

/* ---------- Bases de datos ---------- */

{ t: 'DDL y DML', en: 'Data Definition / Manipulation Language', dia: 'w9d1',
  def: 'DDL crea y cambia la estructura (CREATE, ALTER, DROP); DML trabaja con los datos (SELECT, INSERT, UPDATE, DELETE).',
  ya: 'Todo el SQL que escribiste. Simplemente nadie te dijo que se divide en esas dos familias.',
  dilo: '«El DDL va en migraciones versionadas; el DML que toca producción, en una transacción revisada».' },

{ t: 'Transacción y ACID', en: 'Transaction / ACID', dia: 'w9d6',
  def: 'Un grupo de operaciones que se hace completo o no se hace. ACID: Atomicidad, Consistencia, Aislamiento y Durabilidad.',
  ya: 'Cuando un proceso falló a la mitad y quedaron cobros sin factura, y tuviste que cuadrarlo a mano. Una transacción lo habría evitado.',
  dilo: '«Toda operación que toca varias tablas va en una transacción; si un paso falla, nada queda a medias».' },

{ t: 'Lógica de tres valores', en: 'Three-valued logic (NULL)', dia: 'w9d4',
  def: 'En SQL una comparación puede ser verdadera, falsa o desconocida (con NULL). NULL no es igual a nada, ni a sí mismo.',
  ya: 'Esa consulta que «perdía» filas sin dar error porque tenía una columna NULL en el filtro.',
  dilo: '«Uso IS NULL e IS DISTINCT FROM, y decido qué significa NULL en cada columna: no aplica o no se sabe».' },

{ t: 'INNER JOIN y LEFT JOIN', en: 'Inner / Left outer join', dia: 'w9d5',
  def: 'INNER solo devuelve filas con coincidencia en ambas tablas; LEFT conserva todas las de la izquierda aunque no tengan pareja.',
  ya: 'Cuando un informe no mostraba a los vendedores sin ventas y alguien preguntó dónde estaban.',
  dilo: '«Un filtro sobre la tabla derecha en el WHERE convierte el LEFT en INNER; si quiero conservar filas, lo pongo en el ON».' },

{ t: 'Índice (árbol B)', en: 'B-tree index', dia: 'w10d1',
  def: 'Una estructura ordenada que permite encontrar filas sin leer toda la tabla, a cambio de espacio y escrituras algo más lentas.',
  ya: 'El índice que alguien creó «porque la pantalla iba lenta» y de repente todo fue rápido.',
  dilo: '«En un índice multicolumna, el orden importa: la primera columna debe ser la del filtro por igualdad; y creo índices por evidencia, no por costumbre».' },

{ t: 'Plan de ejecución', en: 'Query plan / EXPLAIN ANALYZE', dia: 'w10d2',
  def: 'Cómo decide la base ejecutar una consulta y dónde se va el tiempo, paso a paso.',
  ya: 'Cuando probabas cambios a ciegas en una consulta lenta hasta que «parecía» más rápida. El plan te dice exactamente por qué.',
  dilo: '«Antes de optimizar miro EXPLAIN ANALYZE: Seq Scan en tabla grande, filas descartadas y estimación frente a realidad».' },

{ t: 'Problema N+1', en: 'N+1 query problem', dia: 'w10d3',
  def: 'Hacer una consulta para la lista y luego una más por cada elemento: 1 + N consultas en lugar de una.',
  ya: 'Esa pantalla que iba bien en desarrollo y se arrastraba en producción con muchos registros, normalmente por una propiedad de navegación dentro de un foreach.',
  dilo: '«Lo detecto contando consultas en el log del ORM y lo resuelvo con una proyección o un JOIN en una sola consulta».' },

{ t: 'Paginación por cursor', en: 'Keyset / cursor pagination', dia: 'w10d3',
  def: 'Pedir «los 20 siguientes después de este» en lugar de «sáltate 100.000 y dame 20» (OFFSET).',
  ya: 'Las páginas finales de un listado que tardaban muchísimo más que la primera.',
  dilo: '«OFFSET lee y descarta todas las filas anteriores; el cursor salta directo con el índice, así que su coste no crece con la página».' },

{ t: 'Migración', en: 'Database migration', dia: 'w10d5',
  def: 'Un cambio de esquema versionado y ordenado que se aplica igual en todos los entornos.',
  ya: 'Los Add-Migration de EF o los scripts SQL numerados que había que ejecutar antes de desplegar.',
  dilo: '«Una migración aplicada nunca se edita; y añadir una columna NOT NULL a una tabla con datos lo hago en tres pasos para no bloquear».' },

{ t: 'Nivel de aislamiento', en: 'Isolation level', dia: 'w10d6',
  def: 'Cuánto se «ven» entre sí las transacciones simultáneas: Read Committed, Repeatable Read, Serializable.',
  ya: 'Esos bugs raros que solo pasaban en producción, con varios usuarios a la vez, y nunca en tu máquina.',
  dilo: '«No pongo Serializable por defecto; elijo la defensa según la anomalía que quiero evitar en cada operación».' },

{ t: 'Actualización perdida', en: 'Lost update', dia: 'w10d6',
  def: 'Dos personas leen el mismo valor, lo modifican y guardan; el segundo guardado borra el cambio del primero sin que nadie se entere.',
  ya: 'El stock que «se descuadraba» de vez en cuando, o el formulario donde dos personas editaban la misma ficha.',
  dilo: '«Lo evito con bloqueo pesimista (SELECT FOR UPDATE) o con bloqueo optimista mediante una columna de versión».' },

{ t: 'Bloqueo optimista', en: 'Optimistic concurrency', dia: 'w10d6',
  def: 'No bloquear al leer, sino comprobar al guardar que nadie cambió el dato (con una versión); si cambió, se rechaza.',
  ya: 'Los mensajes de «otro usuario modificó este registro, recarga la página».',
  dilo: '«Uso optimista cuando los conflictos son raros y pesimista cuando son frecuentes o el coste de reintentar es alto».' },

/* ---------- Backend y APIs ---------- */

{ t: 'Verbos HTTP', en: 'HTTP methods', dia: 'w11d2',
  def: 'GET lee, POST crea, PUT reemplaza, PATCH modifica en parte y DELETE borra. Cada uno con su significado.',
  ya: 'Usabas GET y POST para todo. Era normal; lo profesional es que el verbo diga lo que hace la operación.',
  dilo: '«El verbo comunica la semántica: GET no cambia nada y es cacheable; PUT y DELETE son idempotentes; POST no».' },

{ t: 'Códigos de estado', en: 'HTTP status codes', dia: 'w11d2',
  def: '2xx éxito, 4xx error del cliente, 5xx error del servidor. 201 creado, 404 no existe, 409 conflicto, 422 datos inválidos.',
  ya: 'Esas APIs que devolvían 200 con {"error": true} dentro, y había que leer el cuerpo para saber si funcionó.',
  dilo: '«Uso los códigos con precisión porque de ellos dependen los reintentos, las cachés y la monitorización: un solape es 409, no 400».' },

{ t: 'Idempotencia', en: 'Idempotency', dia: 'w11d5',
  def: 'Que repetir una operación dé el mismo resultado final que hacerla una vez.',
  ya: 'El doble clic que creaba dos pedidos, o el reintento automático que cobraba dos veces.',
  dilo: '«Las operaciones que crean algo importante aceptan una Idempotency-Key; si llega dos veces, devuelvo la respuesta guardada sin repetir».' },

{ t: 'Recurso REST', en: 'REST resource', dia: 'w11d3',
  def: 'Diseñar las URLs alrededor de cosas (sustantivos en plural) y no de acciones: GET /citas/42, no /obtenerCita?id=42.',
  ya: 'Las rutas del tipo /api/GetClienteById que heredaste en algún proyecto.',
  dilo: '«Las URLs son contrato público; las diseño como recursos para que se entiendan sin documentación».' },

{ t: 'DTO', en: 'Data Transfer Object', dia: 'w11d4',
  def: 'Un objeto que define exactamente qué datos entran o salen de un endpoint, separado de la entidad.',
  ya: 'Las clases XxxRequest y XxxResponse. O el problema de devolver la entidad completa y exponer campos internos.',
  dilo: '«Nunca devuelvo entidades: el DTO me deja cambiar la base sin romper clientes y evita filtrar campos sensibles».' },

{ t: 'Problem Details', en: 'Problem Details (RFC 9457)', dia: 'w11d5',
  def: 'Un formato estándar de error en JSON con type, title, status y detail.',
  ya: 'Cada proyecto tenía su propio formato de error; este es el estándar que lo unifica.',
  dilo: '«Todos mis errores salen en problem+json, con un type estable que el frontend usa para decidir qué mostrar».' },

{ t: 'OpenAPI', en: 'OpenAPI / Swagger', dia: 'w11d6',
  def: 'Un documento que describe la API completa: rutas, parámetros, cuerpos y respuestas. Swagger es la herramienta más conocida.',
  ya: 'La página /swagger que abrías para probar endpoints.',
  dilo: '«El contrato OpenAPI permite que frontend y backend trabajen en paralelo y que las herramientas detecten cambios incompatibles».' },

{ t: 'Middleware', en: 'Middleware / request pipeline', dia: 'w12d2',
  def: 'Piezas que procesan todas las peticiones en orden: registro, errores, autenticación, CORS.',
  ya: 'Las líneas app.UseAlgo() de Program.cs, que cambiabas de orden hasta que algo funcionaba.',
  dilo: '«El orden de los middlewares es el orden de ejecución; lo transversal va ahí, no repetido en cada endpoint».' },

{ t: 'ORM', en: 'Object-Relational Mapper', dia: 'w12d3',
  def: 'Una librería que traduce entre objetos y tablas, como Entity Framework Core.',
  ya: 'Entity Framework, Dapper (un micro-ORM) o Hibernate si venías de Java.',
  dilo: '«Uso el ORM sin perder de vista el SQL que genera: lo registro en desarrollo y lo reviso con EXPLAIN cuando importa».' },

{ t: 'Health check', en: 'Liveness / readiness probe', dia: 'w12d6',
  def: 'Endpoints que dicen si la aplicación está viva (live) y si está lista para recibir tráfico (ready).',
  ya: 'El /health que pedía el equipo de infraestructura para el balanceador o Kubernetes.',
  dilo: '«Live solo comprueba que el proceso responde; ready comprueba las dependencias críticas, y solo las críticas».' },

/* ---------- Testing ---------- */

{ t: 'Test unitario', en: 'Unit test', dia: 'w13d1',
  def: 'Una prueba rápida de una pieza aislada, sin base de datos ni red.',
  ya: 'Los tests de xUnit o NUnit, si los escribías. Y si no los escribías, este es tu punto de partida.',
  dilo: '«Estructuro cada test en Arrange, Act y Assert, y lo nombro como un requisito: Cancelar_CuandoYaEstaCancelada_LanzaExcepcion».' },

{ t: 'Cobertura de código', en: 'Code coverage', dia: 'w13d2',
  def: 'El porcentaje de líneas que ejecutan los tests. Mide qué se ejecuta, no si se comprueba bien.',
  ya: 'Ese 80 % obligatorio que se cumplía con tests de getters que no protegían nada.',
  dilo: '«La cobertura me dice qué no está probado, no qué está bien probado; priorizo por riesgo de negocio, no por porcentaje».' },

{ t: 'Dobles de prueba', en: 'Test doubles (stub, fake, mock, spy)', dia: 'w13d3',
  def: 'Objetos que sustituyen a dependencias reales en un test: stub (devuelve algo fijo), fake (funciona, pero simplificado), mock (verifica llamadas) y spy (registra lo que pasó).',
  ya: 'Todo lo que hacías con Moq. Probablemente lo llamabas «mock» a todo, que es lo habitual.',
  dilo: '«Prefiero comprobar estado con fakes; verifico llamadas solo cuando la llamada es el resultado, como enviar un correo».' },

{ t: 'TDD', en: 'Test-Driven Development', dia: 'w13d4',
  def: 'Escribir el test antes que el código, en ciclos cortos: rojo (falla), verde (pasa) y refactor.',
  ya: 'Cuando escribías primero un ejemplo de uso para tener claro qué querías construir. TDD formaliza esa idea.',
  dilo: '«Uso TDD en reglas con casos claros, como un calendario de vacunas; me obliga a diseñar desde el uso y a dejar el código probado».' },

{ t: 'Test de integración', en: 'Integration test', dia: 'w13d5',
  def: 'Una prueba que ejecuta varias piezas reales juntas: la API completa contra una base de datos de verdad.',
  ya: 'Las pruebas que hacías a mano con Postman antes de cada entrega.',
  dilo: '«Uso Testcontainers para levantar un PostgreSQL real; la base en memoria no se comporta igual y deja pasar bugs».' },

{ t: 'Test intermitente', en: 'Flaky test', dia: 'w13d6',
  def: 'Un test que a veces pasa y a veces falla sin que cambie el código.',
  ya: 'Ese test que se volvía a ejecutar en CI «porque a veces falla» hasta que se ponía verde.',
  dilo: '«Un test intermitente destruye la confianza en toda la suite; lo arreglo de inmediato: casi siempre es tiempo, orden o datos compartidos».' },

{ t: 'Pruebas de mutación', en: 'Mutation testing', dia: 'w13d6',
  def: 'Cambiar el código a propósito (un > por un >=) y comprobar que algún test falla. Si ninguno falla, falta un test.',
  ya: 'Probablemente no lo hiciste nunca. Es la forma de comprobar que los tests sirven, no solo que existen.',
  dilo: '«Valido mi suite con mutaciones: si rompo una regla y todo sigue verde, esa regla no estaba protegida».' },

/* ---------- Resiliencia ---------- */

{ t: 'Timeout', en: 'Timeout', dia: 'w14d1',
  def: 'El tiempo máximo que esperas a una respuesta antes de rendirte.',
  ya: 'La caída en la que un servicio externo lento dejó toda la aplicación sin responder.',
  dilo: '«Toda llamada externa tiene timeout, y propago el CancellationToken de punta a punta para que cancelar sirva de algo».' },

{ t: 'Reintento con backoff y jitter', en: 'Retry with exponential backoff and jitter', dia: 'w14d2',
  def: 'Reintentar esperando cada vez más (200, 400, 800 ms) y con algo de azar, para no saturar al servicio que ya sufre.',
  ya: 'El bucle de «intenta 3 veces» que escribiste alguna vez, probablemente sin espera entre intentos.',
  dilo: '«Solo reintento errores pasajeros (503, 504, timeouts), nunca un 400; y uso jitter para que no reintenten todos a la vez».' },

{ t: 'Circuit breaker', en: 'Circuit breaker', dia: 'w14d3',
  def: 'Dejar de llamar a un servicio que está fallando durante un tiempo y responder rápido con un error controlado.',
  ya: 'Cuando desactivabas a mano una integración caída para que no arrastrara al resto.',
  dilo: '«El circuito tiene tres estados (cerrado, abierto, semiabierto); protege mi sistema y le da respiro al servicio caído para recuperarse».' },

{ t: 'Patrón outbox', en: 'Transactional outbox', dia: 'w14d4',
  def: 'Guardar el mensaje a enviar en la misma transacción que el dato, y enviarlo después con un proceso en segundo plano.',
  ya: 'El pedido que se guardó pero cuyo correo de confirmación nunca llegó (o al revés).',
  dilo: '«Con outbox, guardar y encolar el envío es atómico; el procesador reintenta hasta que sale, así que el aviso nunca se pierde».' },

{ t: 'Degradación elegante', en: 'Graceful degradation / fallback', dia: 'w14d5',
  def: 'Seguir ofreciendo lo esencial cuando falla algo secundario, avisando al usuario de lo que no funciona.',
  ya: 'Cuando la web seguía funcionando sin las recomendaciones porque el servicio de recomendaciones estaba caído.',
  dilo: '«Tengo una matriz de dependencias: qué es crítico, qué hace el sistema si cada una falla y qué ve el usuario».' },

{ t: 'Ingeniería del caos', en: 'Chaos engineering', dia: 'w14d6',
  def: 'Provocar fallos a propósito, con una hipótesis previa, para comprobar que el sistema aguanta como crees.',
  ya: 'Las caídas reales que sufriste en producción. La diferencia es elegir cuándo y dónde ocurren.',
  dilo: '«Escribo la hipótesis antes de romper nada; una defensa que nunca he visto funcionar es solo una suposición».' },

/* ---------- Arquitectura ---------- */

{ t: 'Arquitectura en capas', en: 'Layered architecture', dia: 'w15d1',
  def: 'Separar el sistema en presentación, aplicación, dominio e infraestructura, con dependencias en una sola dirección.',
  ya: 'Las carpetas Controllers, Services y Repositories de casi todos los proyectos. Lo que define las capas no son las carpetas, sino hacia dónde apuntan las dependencias.',
  dilo: '«Verifico la dirección de las dependencias con un test de arquitectura, no confío en la disciplina del equipo».' },

{ t: 'Arquitectura hexagonal', en: 'Hexagonal / Ports and Adapters', dia: 'w15d2',
  def: 'El dominio en el centro; todo lo exterior (HTTP, base de datos, correo) se conecta mediante puertos (interfaces) y adaptadores.',
  ya: 'Si alguna vez llamaste a la misma lógica desde una API y desde un proceso por lotes sin duplicarla, estabas cerca.',
  dilo: '«La API HTTP es solo un adaptador más; mis casos de uso funcionan igual desde una consola».' },

{ t: 'Caso de uso (servicio de aplicación)', en: 'Use case / application service', dia: 'w15d2',
  def: 'La clase que orquesta una operación completa: carga, llama al dominio, guarda. Sin reglas de negocio propias.',
  ya: 'Los métodos de servicio que coordinaban repositorios y otras clases para una operación concreta.',
  dilo: '«El endpoint construye el comando, invoca el caso de uso y traduce el resultado a HTTP; nada más».' },

{ t: 'CQRS', en: 'Command Query Responsibility Segregation', dia: 'w15d3',
  def: 'Separar el camino de escritura (comandos, por el dominio) del de lectura (consultas proyectadas directamente).',
  ya: 'Cuando hiciste una consulta SQL directa para un informe en lugar de cargar las entidades completas.',
  dilo: '«Uso CQRS ligero: misma base, distinto camino. Escribo por el dominio para proteger reglas y leo proyectando solo lo necesario».' },

{ t: 'Evento de dominio', en: 'Domain event', dia: 'w15d4',
  def: 'Un aviso de algo que ya pasó en el negocio («CitaCancelada») para que otras partes reaccionen sin que el emisor las conozca.',
  ya: 'Cuando el método Guardar acabó llamando al correo, a las estadísticas y a facturación, y cada nueva reacción lo hacía más grande.',
  dilo: '«Los eventos se nombran en pasado y los despacho antes del commit para que sus efectos vayan en la misma transacción».' },

{ t: 'Monolito modular', en: 'Modular monolith', dia: 'w15d5',
  def: 'Una sola aplicación desplegable dividida en módulos con fronteras claras y contratos pequeños entre ellos.',
  ya: 'El monolito donde todo dependía de todo. Este es su opuesto, sin el coste de los microservicios.',
  dilo: '«Prefiero un monolito modular bien hecho a microservicios mal hechos; si un módulo necesita separarse, sus fronteras ya existen».' },

{ t: 'ADR', en: 'Architecture Decision Record', dia: 'w15d6',
  def: 'Un documento corto que registra una decisión de arquitectura: contexto, decisión, alternativas descartadas y consecuencias.',
  ya: 'Esa decisión que nadie recordaba por qué se tomó y que alguien deshizo sin saber que tenía un motivo.',
  dilo: '«Cada ADR lleva las alternativas descartadas y sus consecuencias negativas; sin eso, no demuestra que hubo una decisión».' }

]);
