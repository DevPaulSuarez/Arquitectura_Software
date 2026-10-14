/* Glosario (tercera parte): frontend, seguridad, DevOps, rendimiento, observabilidad y diseño de sistemas. */
window.GLOSARIO = (window.GLOSARIO || []).concat([

/* ---------- Frontend ---------- */

{ t: 'Componente y props', en: 'Component / props', dia: 'w16d1',
  def: 'Un componente es una función que recibe datos (props) y devuelve interfaz. Las props van del padre al hijo.',
  ya: 'Cualquier pantalla de React, Angular o Blazor que hayas construido a base de piezas reutilizables.',
  dilo: '«Un componente es una función de props a interfaz; tipar las props con TypeScript documenta cómo se usa».' },

{ t: 'Estado derivado', en: 'Derived state', dia: 'w16d2',
  def: 'Un valor que se puede calcular a partir de otro estado o de las props, y que por eso NO debe guardarse como estado.',
  ya: 'El contador o la lista filtrada que guardabas en un useState y que a veces se desincronizaba.',
  dilo: '«Guardo el mínimo estado posible y calculo el resto en el render; dos fuentes de verdad acaban contradiciéndose».' },

{ t: 'Levantar el estado', en: 'Lifting state up', dia: 'w16d3',
  def: 'Mover el estado al antepasado común más cercano de los componentes que lo comparten.',
  ya: 'Cuando dos componentes hermanos necesitaban el mismo dato y acabaste moviéndolo al padre.',
  dilo: '«El estado vive en el antepasado común más cercano de quien lo usa; ni más arriba ni más abajo».' },

{ t: 'Componente controlado', en: 'Controlled component', dia: 'w16d3',
  def: 'Un componente que no guarda su propio valor: lo recibe del padre y le avisa cuando cambia.',
  ya: 'El input con value y onChange que conectabas al estado del formulario.',
  dilo: '«Uso componentes controlados para que el padre sea el único dueño del dato».' },

{ t: 'Efecto', en: 'Side effect / useEffect', dia: 'w16d4',
  def: 'Código que sincroniza el componente con algo externo: la red, un temporizador, una suscripción.',
  ya: 'Los useEffect que ponías para casi todo y que a veces creaban bucles infinitos.',
  dilo: '«useEffect es para sincronizar con sistemas externos; calcular datos o reaccionar a un clic no necesita efecto».' },

{ t: 'Condición de carrera', en: 'Race condition', dia: 'w16d4',
  def: 'Cuando el resultado depende del orden en que terminan operaciones simultáneas, y ese orden no está garantizado.',
  ya: 'Cambiar rápido de filtro y ver los datos del filtro anterior, porque su respuesta llegó más tarde.',
  dilo: '«Cancelo las peticiones antiguas con AbortController; si no, una respuesta lenta puede pisar a una más reciente».' },

{ t: 'Estado de servidor', en: 'Server state / data cache', dia: 'w17d1',
  def: 'Datos cuyo dueño es el servidor y que en el cliente son solo una copia que puede quedarse vieja. Necesitan caché, recarga e invalidación.',
  ya: 'Los datos que cargabas en un useState al montar el componente y que nadie actualizaba cuando cambiaban.',
  dilo: '«No trato los datos del servidor como estado local; uso TanStack Query para caché, deduplicación y recarga».' },

{ t: 'Invalidación de caché', en: 'Cache invalidation', dia: 'w17d2',
  def: 'Marcar como obsoletos los datos guardados para que se vuelvan a pedir cuando algo los cambia.',
  ya: 'El «recarga la página para ver tu cambio» que decías a los usuarios.',
  dilo: '«Cada mutación invalida exactamente las claves afectadas; lo tengo documentado en una tabla».' },

{ t: 'Actualización optimista', en: 'Optimistic update', dia: 'w17d3',
  def: 'Mostrar el cambio al instante, antes de que responda el servidor, y deshacerlo si falla.',
  ya: 'El «me gusta» que se marca al momento en cualquier red social.',
  dilo: '«Uso optimismo donde el fallo es raro y fácil de deshacer; en cobros o datos médicos, espero la confirmación».' },

{ t: 'Carga diferida', en: 'Code splitting / lazy loading', dia: 'w21d5',
  def: 'Partir el JavaScript en trozos y descargar cada página solo cuando se necesita.',
  ya: 'La aplicación que tardaba mucho en abrir porque descargaba todo de golpe.',
  dilo: '«Cargo de forma diferida las rutas que no se usan al entrar; nunca la pantalla inicial».' },

{ t: 'Core Web Vitals', en: 'LCP, INP, CLS', dia: 'w21d5',
  def: 'Las métricas de experiencia de Google: cuándo se ve el contenido principal (LCP), cuánto tarda en responder a una interacción (INP) y cuánto salta la página (CLS).',
  ya: 'La página donde ibas a pulsar un botón y se movía en el último momento. Eso es CLS.',
  dilo: '«Mido con Lighthouse en móvil con red lenta, porque el usuario no percibe milisegundos de la API, sino estas métricas».' },

/* ---------- Seguridad ---------- */

{ t: 'Autenticación y autorización', en: 'Authentication vs authorization', dia: 'w18d3',
  def: 'Autenticación: quién eres. Autorización: qué puedes hacer. Son cosas distintas y se comprueban por separado.',
  ya: 'El [Authorize] que ponías en los controladores, que solo comprueba lo primero.',
  dilo: '«[Authorize] dice que hay sesión; luego compruebo el rol y además que el recurso concreto pertenece al usuario».' },

{ t: 'Hash de contraseña', en: 'Password hashing (bcrypt, Argon2)', dia: 'w18d1',
  def: 'Transformar la contraseña con un algoritmo lento y con sal para que, si se filtra la base, no se puedan recuperar.',
  ya: 'Si alguna vez viste contraseñas cifradas con AES, o peor, en texto plano, en una base heredada.',
  dilo: '«Las contraseñas no se cifran, se hashean con un algoritmo lento y sal única; uso BCrypt con factor de trabajo 12».' },

{ t: 'JWT', en: 'JSON Web Token', dia: 'w18d2',
  def: 'Un token firmado que contiene datos del usuario (su id, su rol). Está firmado, no cifrado: cualquiera puede leerlo.',
  ya: 'El token Bearer que mandabas en la cabecera Authorization.',
  dilo: '«La firma garantiza que nadie lo alteró, no que sea secreto; por eso no meto datos sensibles y lo guardo en una cookie HttpOnly».' },

{ t: 'IDOR', en: 'Insecure Direct Object Reference', dia: 'w18d3',
  def: 'Poder ver o tocar datos ajenos cambiando un id en la URL: /pedidos/42 → /pedidos/43.',
  ya: 'Revisa un proyecto viejo tuyo: si un endpoint filtraba solo por id y no por usuario, tenía un IDOR.',
  dilo: '«Filtro la pertenencia dentro de la propia consulta y devuelvo 404, no 403, para no confirmar que el recurso existe».' },

{ t: 'Limitación de peticiones', en: 'Rate limiting', dia: 'w18d5',
  def: 'Poner un límite al número de peticiones que se aceptan por usuario o IP en un periodo de tiempo.',
  ya: 'Los errores 429 Too Many Requests que te devolvía alguna API externa.',
  dilo: '«El login tiene límite de intentos; sin él, es vulnerable a fuerza bruta».' },

{ t: 'Inyección SQL', en: 'SQL injection', dia: 'w19d1',
  def: 'Cuando un dato del usuario se ejecuta como parte del SQL porque se concatenó en la consulta.',
  ya: 'Cualquier "SELECT … WHERE nombre = \'" + texto + "\'" que hayas visto en un proyecto antiguo.',
  dilo: '«La cierro con parámetros, nunca filtrando caracteres; el dato viaja aparte y nunca puede convertirse en código».' },

{ t: 'XSS', en: 'Cross-Site Scripting', dia: 'w19d2',
  def: 'Conseguir que el navegador de otra persona ejecute código introducido como dato.',
  ya: 'Un comentario o un nombre con <script> que se mostraba tal cual en una página.',
  dilo: '«React escapa por defecto, pero no en dangerouslySetInnerHTML ni en enlaces javascript:; y tengo CSP como segunda capa».' },

{ t: 'CSP', en: 'Content Security Policy', dia: 'w19d2',
  def: 'Una cabecera que dice al navegador de qué orígenes puede cargar y ejecutar scripts y otros recursos.',
  ya: 'Esos errores rojos en la consola de «Refused to load the script…».',
  dilo: '«La CSP limita el daño si un XSS se cuela: aunque haya un script inyectado, el navegador se niega a ejecutarlo».' },

{ t: 'CORS', en: 'Cross-Origin Resource Sharing', dia: 'w18d5',
  def: 'Las reglas con las que una API dice qué otros dominios pueden llamarla desde el navegador.',
  ya: 'El famoso error de CORS que «arreglabas» poniendo AllowAnyOrigin.',
  dilo: '«CORS no es una protección del servidor sino del navegador; configuro orígenes exactos, nunca un comodín con credenciales».' },

{ t: 'Validación en el borde', en: 'Input validation at the boundary', dia: 'w19d3',
  def: 'Comprobar la forma de todo lo que entra en la API (tipos, rangos, longitudes), sin confiar en que el formulario ya validó.',
  ya: 'Los campos que «el frontend ya valida» y que alguien rompió llamando a la API directamente.',
  dilo: '«El cliente nunca es de fiar: la validación del formulario es comodidad y la de la API es seguridad».' },

{ t: 'Dependencia transitiva', en: 'Transitive dependency / SCA', dia: 'w19d4',
  def: 'Una librería que no instalaste tú, sino que arrastra otra que sí instalaste.',
  ya: 'Los cientos de carpetas de node_modules que nunca pediste.',
  dilo: '«Audito dependencias en CI y activo Dependabot; la mayor parte del código que despliego no lo escribí yo».' },

{ t: 'Gestión de secretos', en: 'Secrets management', dia: 'w19d5',
  def: 'Mantener contraseñas, claves y tokens fuera del código, en variables de entorno o en un gestor de secretos.',
  ya: 'El appsettings.json con la contraseña de producción subido a git.',
  dilo: '«Un secreto que llegó al historial de git se rota, no basta con borrarlo, porque no sé quién lo clonó».' },

{ t: 'Modelo de amenazas', en: 'Threat modeling / STRIDE', dia: 'w19d6',
  def: 'Analizar el sistema pensando como un atacante, de forma ordenada, para priorizar qué defender.',
  ya: 'Esa revisión de seguridad que alguien hacía «a ojo» antes de una salida a producción.',
  dilo: '«Recorro el OWASP Top 10 categoría por categoría, priorizo por impacto y probabilidad y ataco de verdad las tres principales».' },

{ t: 'OWASP Top 10', en: 'OWASP Top 10', dia: 'w19d6',
  def: 'La lista de referencia de los diez riesgos de seguridad más comunes en aplicaciones web.',
  ya: 'Lo que aparecía en el informe del pentest que te pasaban para corregir.',
  dilo: '«El primero de la lista es el control de acceso roto, como el IDOR; por eso lo pruebo con tests de integración».' },

/* ---------- DevOps ---------- */

{ t: 'Commit atómico', en: 'Atomic commit', dia: 'w20d1',
  def: 'Un commit con un solo cambio lógico y un mensaje que explica por qué se hizo.',
  ya: 'Los commits «fix», «cambios» y «wip» que nadie entiende tres meses después.',
  dilo: '«Uso git add -p para separar cambios y escribo el porqué en el mensaje; el historial es documentación».' },

{ t: 'Merge frente a rebase', en: 'Merge vs rebase', dia: 'w20d2',
  def: 'Merge une dos ramas conservando la bifurcación; rebase reescribe tu rama encima de la otra para que la historia quede lineal.',
  ya: 'El botón «Merge» o «Rebase and merge» de GitHub que elegías sin pensar mucho.',
  dilo: '«Hago rebase de mis ramas locales y nunca de ramas compartidas; y si me equivoco, git reflog me deja volver atrás».' },

{ t: 'Imagen y contenedor', en: 'Docker image / container', dia: 'w20d3',
  def: 'La imagen es el paquete inmutable con la aplicación y todo lo que necesita; el contenedor es una ejecución de esa imagen.',
  ya: 'Los docker run que copiabas de un README para levantar una base de datos.',
  dilo: '«Uso Dockerfile multietapa: compilo con el SDK y ejecuto con una imagen pequeña, sin root».' },

{ t: 'Docker Compose', en: 'Docker Compose', dia: 'w20d4',
  def: 'Un archivo que define varios contenedores (API, base de datos, web) y los levanta juntos con un comando.',
  ya: 'El docker-compose.yml que te hacía levantar el entorno el primer día en un trabajo nuevo.',
  dilo: '«Con healthchecks y depends_on, la API espera a que la base esté lista; y down -v borra los datos, down no».' },

{ t: 'CI/CD', en: 'Continuous Integration / Delivery', dia: 'w20d5',
  def: 'CI: compilar y probar automáticamente cada cambio. CD: desplegarlo de forma automática y repetible.',
  ya: 'Los checks verdes o rojos de las pull requests en GitHub o Azure DevOps.',
  dilo: '«Mi pipeline compila, pasa los tests contra PostgreSQL real y audita dependencias; main está protegida y no admite merge en rojo».' },

{ t: 'Rollback', en: 'Rollback', dia: 'w20d6',
  def: 'Volver a la versión anterior cuando un despliegue sale mal.',
  ya: 'Esas noches de despliegue fallido donde nadie sabía exactamente cómo volver atrás.',
  dilo: '«El rollback lo pruebo antes de necesitarlo, y mis migraciones son compatibles hacia atrás para que la versión anterior funcione con la base nueva».' },

/* ---------- Rendimiento ---------- */

{ t: 'Percentil (p95, p99)', en: 'Percentile latency', dia: 'w21d1',
  def: 'El p95 es el tiempo por debajo del cual está el 95 % de las peticiones. Muestra lo que sufren los usuarios lentos.',
  ya: 'El «en promedio va bien» mientras algunos usuarios se quejaban de que iba muy lento.',
  dilo: '«El promedio esconde la cola; mis objetivos son por percentil, y una página con 3 llamadas toca el p95 en el 14 % de las cargas».' },

{ t: 'Prueba de carga', en: 'Load testing', dia: 'w21d2',
  def: 'Simular muchos usuarios a la vez para medir cómo responde el sistema.',
  ya: 'El día del lanzamiento en que todo se cayó porque nadie había probado con tráfico real.',
  dilo: '«Mido una línea base con datos de volumen realista; con veinte filas en la base todo es rápido y no aprendes nada».' },

{ t: 'Caché', en: 'Cache / cache-aside', dia: 'w21d4',
  def: 'Guardar el resultado de algo costoso para no repetirlo, aceptando que puede quedarse viejo.',
  ya: 'Ese IMemoryCache que alguien añadió y que luego mostraba datos desactualizados.',
  dilo: '«Cacheo solo lo que se lee mucho, cambia poco y tolera retraso; la invalidación va en el mismo commit; y si la mejora es pequeña, la quito».' },

/* ---------- Observabilidad ---------- */

{ t: 'Log estructurado', en: 'Structured logging', dia: 'w22d1',
  def: 'Registros con campos consultables (CitaId=42) en lugar de texto libre.',
  ya: 'Buscar con Ctrl+F en un archivo de log de 2 GB a las tres de la mañana.',
  dilo: '«Uso plantillas con propiedades, nunca interpolación, y nunca registro datos personales; solo identificadores».' },

{ t: 'ID de correlación', en: 'Correlation ID / trace ID', dia: 'w22d1',
  def: 'Un identificador que acompaña a una petición por todo el sistema y permite encontrar todas sus líneas de log.',
  ya: 'Cuando soporte te pasaba «el usuario dice que falló a las 10» y no había forma de encontrar esa petición.',
  dilo: '«El trace id va en todas las líneas de log y en las respuestas de error; el usuario me lo da y lo encuentro en segundos».' },

{ t: 'Señales doradas', en: 'Four golden signals', dia: 'w22d2',
  def: 'Las cuatro métricas básicas de un servicio: latencia, tráfico, errores y saturación.',
  ya: 'Los paneles de Grafana o Application Insights con decenas de gráficas que nadie sabía leer.',
  dilo: '«Mido síntomas, no causas: un pico de CPU no siempre afecta al usuario; un aumento de errores, siempre».' },

{ t: 'Cardinalidad de métricas', en: 'Metric cardinality', dia: 'w22d2',
  def: 'Cuántos valores distintos puede tomar una etiqueta. Cada valor crea una serie temporal nueva.',
  ya: 'La factura del sistema de monitorización que se disparó porque alguien etiquetó las métricas con el id de usuario.',
  dilo: '«Etiqueto con la plantilla de la ruta, nunca con la URL real ni con ids de usuario».' },

{ t: 'Traza distribuida', en: 'Distributed trace / span', dia: 'w22d3',
  def: 'El recorrido completo de una petición dividido en tramos (spans) con su duración: API, base de datos, servicios externos.',
  ya: 'El «no sé dónde se va el tiempo» resuelto a base de poner Stopwatch por todo el código.',
  dilo: '«Uso OpenTelemetry; en la traza veo en qué tramo está el tiempo sin adivinar».' },

{ t: 'SLI, SLO y SLA', en: 'Service Level Indicator / Objective / Agreement', dia: 'w22d4',
  def: 'SLI: lo que mides (porcentaje de peticiones buenas). SLO: el objetivo interno (99,5 %). SLA: lo que prometes por contrato, con penalización.',
  ya: 'El «99,9 % de disponibilidad» del contrato que nadie medía realmente.',
  dilo: '«Expreso el SLO como presupuesto de error en minutos al mes; eso cambia la conversación sobre cuánto riesgo podemos asumir».' },

{ t: 'Presupuesto de error', en: 'Error budget / burn rate', dia: 'w22d4',
  def: 'Cuánto puede fallar el sistema sin incumplir el SLO. Las alertas se basan en lo rápido que se consume.',
  ya: 'Las alertas que sonaban por cualquier pico y que el equipo acababa silenciando.',
  dilo: '«Tengo dos alertas por velocidad de consumo, una rápida y otra lenta; dos alertas bien pensadas valen más que veinte».' },

{ t: 'Manual de guardia', en: 'Runbook / playbook', dia: 'w22d5',
  def: 'El procedimiento paso a paso para diagnosticar y mitigar una incidencia concreta.',
  ya: 'El «llama a Juan, que es el único que sabe arreglarlo».',
  dilo: '«Mis manuales los pruebo provocando el fallo; un manual que nunca se ha seguido es ficción».' },

{ t: 'Postmortem sin culpables', en: 'Blameless postmortem', dia: 'w22d6',
  def: 'El análisis escrito de una incidencia que busca qué permitió el error, no quién lo cometió.',
  ya: 'Las reuniones después de una caída que acababan buscando un culpable.',
  dilo: '«La sección más valiosa es "por qué no lo detectamos antes"; las acciones son de causa y de detección, cada una con responsable y fecha».' },

/* ---------- Diseño de sistemas ---------- */

{ t: 'Estimación rápida', en: 'Back-of-the-envelope estimation', dia: 'w23d2',
  def: 'Cálculos aproximados de tráfico, almacenamiento y ancho de banda para decidir el tamaño del sistema antes de diseñarlo.',
  ya: 'Cuando decías «esto no aguanta» o «esto sobra» por intuición, sin hacer la cuenta.',
  dilo: '«8.000 citas al día son 1 petición por segundo de media; una instancia sobra. Las cuentas convierten opiniones en argumentos».' },

{ t: 'Escalado vertical y horizontal', en: 'Scale up vs scale out', dia: 'w23d3',
  def: 'Vertical: una máquina más grande. Horizontal: más máquinas detrás de un balanceador.',
  ya: 'Cuando la solución a un sistema lento era «súbele la RAM al servidor».',
  dilo: '«Escalo en vertical mientras se pueda, porque es más simple; para escalar en horizontal, la API debe ser sin estado».' },

{ t: 'Sin estado', en: 'Stateless service', dia: 'w23d3',
  def: 'Un servicio que no guarda nada en memoria entre peticiones, así que cualquier instancia puede atender cualquier petición.',
  ya: 'El login que se perdía al añadir un segundo servidor porque la sesión estaba en memoria.',
  dilo: '«Busco estado en campos estáticos, cachés locales y archivos temporales; cada uno impide añadir instancias».' },

{ t: 'Réplica de lectura', en: 'Read replica / replication lag', dia: 'w23d3',
  def: 'Una copia de la base que recibe los cambios con algo de retraso y sirve para repartir las lecturas.',
  ya: 'El «guardé y no aparece» que se arreglaba solo al recargar un segundo después.',
  dilo: '«El retardo de replicación lo resuelvo devolviendo el objeto creado en el POST, en lugar de releerlo de la réplica».' },

{ t: 'Teorema CAP', en: 'CAP theorem', dia: 'w23d4',
  def: 'Cuando la red se parte, un sistema distribuido debe elegir entre consistencia (rechazar) y disponibilidad (responder con datos quizá viejos).',
  ya: 'Probablemente lo oíste citar en alguna reunión, casi siempre de forma incorrecta.',
  dilo: '«La elección solo aparece durante una partición; para la agenda elijo consistencia, porque una cita doble es peor que un error».' },

{ t: 'Consistencia eventual', en: 'Eventual consistency', dia: 'w23d4',
  def: 'Los datos acaban siendo correctos en todas partes, pero no al instante.',
  ya: 'El contador de «me gusta» que tarda unos segundos en coincidir en todos los dispositivos.',
  dilo: '«Eventual siempre lleva un número: el contador del panel puede ir 5 minutos por detrás; la agenda, no».' },

{ t: 'Almacenamiento de objetos', en: 'Object storage (S3, Blob)', dia: 'w23d5',
  def: 'Un servicio para guardar archivos grandes (imágenes, documentos) fuera de la base de datos.',
  ya: 'Las imágenes guardadas en la base de datos que hacían eternas las copias de seguridad.',
  dilo: '«La base guarda solo los metadatos; el navegador sube directamente al almacenamiento con una URL prefirmada».' },

{ t: 'Cola de mensajes', en: 'Message queue', dia: 'w23d5',
  def: 'Un intermediario que guarda mensajes para que otro proceso los atienda de forma asíncrona.',
  ya: 'RabbitMQ, Azure Service Bus o Kafka, que a veces se añadían «por si acaso».',
  dilo: '«Hoy no la necesito: mi outbox me da envío garantizado; la añadiría con varios consumidores o cientos de mensajes por segundo».' },

{ t: 'Cambio incompatible', en: 'Breaking change / expand-contract', dia: 'w24d2',
  def: 'Un cambio en la API que rompe a quien ya la usa. Se evita añadiendo lo nuevo, migrando a los clientes y retirando lo viejo después.',
  ya: 'Renombrar un campo del JSON y que la app móvil dejara de funcionar.',
  dilo: '«Añadir un campo opcional no rompe; quitar o renombrar sí. Uso expand/contract con fechas y mido el uso antes de retirar».' },

{ t: 'RPO y RTO', en: 'Recovery Point / Time Objective', dia: 'w24d3',
  def: 'RPO: cuántos datos puedes permitirte perder. RTO: cuánto tiempo puede estar parado el sistema tras un desastre.',
  ya: 'El «¿cuándo fue la última copia de seguridad?» en mitad de una emergencia.',
  dilo: '«Una copia que no se ha restaurado nunca no es una copia; mido el RTO real con un simulacro».' },

{ t: 'Método STAR', en: 'STAR (Situation, Task, Action, Result)', dia: 'w24d4',
  def: 'Una estructura para contar una experiencia en una entrevista: situación, tarea, acción y resultado.',
  ya: 'Todas esas veces que contaste un logro tuyo y te quedó desordenado o demasiado largo.',
  dilo: '«La agenda tardaba 1,2 s (situación), debía bajar de 300 ms (tarea), medí y añadí un índice (acción) y quedó en 180 ms (resultado)».' }

]);
