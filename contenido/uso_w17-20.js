/* Para qué sirve cada día en un trabajo real, por qué importa
   y qué preguntar (al cliente, al equipo o al tech lead) para aplicarlo.
   Clave: w<semana>d<día>. */
window.USO = Object.assign(window.USO || {}, {

/* ---------- Semana 17 · Datos remotos y UX ---------- */

'w17d1': {
  sirve: 'Separar el estado de servidor (citas, mascotas: datos que viven en la API) del de cliente (filtro abierto, pestaña elegida) permite usar herramientas como TanStack Query para la cache, los reintentos y la recarga.',
  importa: 'Gestionar datos remotos con useState y useEffect acaba en datos viejos, peticiones duplicadas, condiciones de carrera y spinners eternos. Es uno de los motivos por los que muchos frontends se sienten lentos y poco fiables.',
  preguntas: [
    { a: 'Al tech lead de frontend', q: '¿Qué librería usamos para datos del servidor y cómo configuramos la cache?', obt: 'La herramienta y los valores por defecto del equipo (tiempo de datos frescos, reintentos).' },
    { a: 'A la recepcionista', q: 'Si otra persona da una cita, ¿cuánto tiempo puede tardar en aparecer en tu pantalla?', obt: 'Cuánta frescura necesitan los datos, que decide la estrategia de recarga.' },
    { a: 'En una revisión de código', q: '¿Por qué estos datos de la API están copiados en un useState?', obt: 'Eliminar copias de estado de servidor que se desincronizan.' }
  ],
  evita: { q: '¿Cargo los datos en un useEffect como siempre?', por: 'Funciona en el ejemplo y falla en la app real. Pregunta cómo se manejan cache, errores y recargas en el equipo.' }
},

'w17d2': {
  sirve: 'Las mutaciones (crear, editar, cancelar) deben dejar la cache coherente invalidando las consultas afectadas, para que la pantalla se actualice sin recargar la página.',
  importa: 'Si después de crear una cita la agenda no la muestra, el usuario la crea otra vez y tienes una cita duplicada. La invalidación correcta es lo que hace que la app se sienta fiable.',
  preguntas: [
    { a: 'Al tech lead de frontend', q: '¿Qué consultas hay que invalidar cuando se crea una cita?', obt: 'El mapa de qué datos dependen de qué operación.' },
    { a: 'Al equipo de backend', q: '¿La respuesta de crear cita devuelve la cita completa para actualizar la cache sin otra petición?', obt: 'Si se puede ahorrar una recarga usando la respuesta.' },
    { a: 'A la recepcionista', q: 'Después de dar una cita, ¿qué esperas ver al instante?', obt: 'La confirmación visual que el usuario necesita.' }
  ],
  evita: { q: '¿Recargo la página después de guardar?', por: 'Pierdes el estado y la sensación de rapidez. Pregunta qué datos cambian con la operación e invalida solo esos.' }
},

'w17d3': {
  sirve: 'Las actualizaciones optimistas muestran el cambio al instante (la cita cancelada desaparece) y lo deshacen si el servidor lo rechaza.',
  importa: 'Bien hechas, la app se siente instantánea aunque la red tarde. Mal hechas, el usuario cree que algo se guardó cuando no fue así, y eso es peor que esperar. Saber cuándo usarlas es tan importante como saber hacerlas.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué operaciones son tan importantes que el usuario debe esperar la confirmación del servidor?', obt: 'Dónde NO usar optimismo (cobros, datos médicos) y dónde sí.' },
    { a: 'Al equipo de backend', q: '¿Con qué frecuencia falla la cancelación de citas?', obt: 'Si el fallo es raro, el optimismo compensa.' },
    { a: 'Al diseñador', q: '¿Cómo avisamos al usuario si deshacemos un cambio optimista?', obt: 'El mensaje y la forma de comunicar el fallo.' }
  ],
  evita: { q: '¿Hago todo optimista para que vaya rápido?', por: 'Algunas operaciones no deben fingir éxito. Pregunta qué pasa si el usuario cree que se guardó y no fue así.' }
},

'w17d4': {
  sirve: 'Poner en la URL el estado que debe compartirse (fecha de la agenda, veterinario filtrado) permite guardar favoritos, compartir enlaces y usar el botón atrás.',
  importa: 'Si el filtro solo vive en memoria, al recargar se pierde y no se puede mandar un enlace a un compañero. Los usuarios esperan que la URL funcione, y es un detalle que diferencia una app profesional.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Alguna vez quieres enseñar a un compañero exactamente lo que estás viendo?', obt: 'Qué estado merece estar en la URL para poder compartirlo.' },
    { a: 'Al tech lead de frontend', q: '¿Qué librería de rutas usamos y cómo leemos parámetros de búsqueda?', obt: 'La herramienta común del equipo.' },
    { a: 'Al diseñador', q: '¿Qué pasa al pulsar atrás después de cambiar de día en la agenda?', obt: 'El comportamiento esperado de navegación.' }
  ],
  evita: { q: '¿Meto todo el estado en la URL?', por: 'La URL se vuelve ilegible. Pregunta qué estado quiere recordar o compartir el usuario.' }
},

'w17d5': {
  sirve: 'El rendimiento percibido se trabaja con esqueletos de carga, respuestas inmediatas a los clics y umbrales humanos (0,1 s se siente instantáneo, 1 s mantiene el hilo, 10 s se pierde la atención).',
  importa: 'El usuario no mide milisegundos, mide sensaciones. Una pantalla que muestra la estructura al instante y rellena después se siente más rápida que una que muestra todo junto aunque tarde lo mismo.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿En qué momento del día sientes que el sistema va lento?', obt: 'Las pantallas y los momentos donde el rendimiento percibido importa más.' },
    { a: 'Al diseñador', q: '¿Tenemos diseñados los esqueletos de carga de cada pantalla?', obt: 'Si hay diseño para los estados de carga o hay que proponerlo.' },
    { a: 'Al tech lead de frontend', q: '¿Medimos el tiempo de interacción real de los usuarios?', obt: 'Si hay datos de campo o solo pruebas en local.' }
  ],
  evita: { q: '¿Pongo un spinner en todas partes?', por: 'Un spinner a pantalla completa se siente más lento. Pregunta qué puede mostrarse ya mientras llega el resto.' }
},

'w17d6': {
  sirve: 'Recorrer la app completa con ojos de usuario y de revisor, y documentar las decisiones de datos y experiencia, es lo que se hace antes de enseñarla a un cliente o pasarla a producción.',
  importa: 'Las decisiones de frontend que no se escriben se pierden: por qué se usa optimismo aquí y no allí, qué está en la URL. El documento permite que otro desarrollador continúe sin romper la coherencia.',
  preguntas: [
    { a: 'A la recepcionista', q: 'Haz una mañana completa con la app: dar citas, cancelar, buscar fichas. ¿Dónde dudaste?', obt: 'Fricciones reales en el flujo completo.' },
    { a: 'Al tech lead de frontend', q: '¿Qué decisiones de esta app debería conocer alguien que llegue nuevo?', obt: 'El contenido mínimo del documento de frontend.' },
    { a: 'A QA', q: '¿Qué probarías primero para intentar romper esta app?', obt: 'Escenarios límite que no recorriste.' }
  ],
  evita: { q: '¿Está lista para el cliente?', por: 'Pregunta qué tarea debe poder hacer el cliente sin ayuda y comprueba que puede.' }
},

/* ---------- Semana 18 · Autenticación y autorización ---------- */

'w18d1': {
  sirve: 'Guardar contraseñas con un hash lento y con sal (PBKDF2, bcrypt, Argon2) hace que una filtración de la base de datos no exponga las contraseñas reales.',
  importa: 'Las bases de datos se filtran, y la gente reutiliza contraseñas. Si guardas mal las contraseñas de la clínica, el daño llega al email y al banco de tus usuarios. Es un error que acaba en noticias y en multas.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Gestionamos contraseñas nosotros o usamos un proveedor de identidad externo?', obt: 'La decisión de no construir lo que ya está resuelto, si el equipo lo permite.' },
    { a: 'Al responsable de seguridad', q: '¿Qué política de contraseñas exigimos: longitud, listas de contraseñas filtradas?', obt: 'Las reglas actuales recomendadas (longitud mínima, comprobación contra filtradas) en vez de reglas antiguas de símbolos.' },
    { a: 'Al dueño de la clínica', q: '¿Quiénes tendrán cuenta: solo el personal o también los dueños de mascotas?', obt: 'El tamaño y tipo de población de usuarios, que cambia los requisitos.' }
  ],
  evita: { q: '¿Encripto las contraseñas con AES?', por: 'Las contraseñas no se cifran, se hashean con un algoritmo lento. Pregunta cuál es el estándar del equipo para almacenar contraseñas.' }
},

'w18d2': {
  sirve: 'Un JWT es un token firmado que dice quién es el usuario y qué puede hacer. Decidir dónde guardarlo en el navegador (cookie HttpOnly o memoria) es una decisión de seguridad con consecuencias.',
  importa: 'Un JWT está firmado, no cifrado: cualquiera puede leer su contenido. Guardarlo en localStorage lo expone a cualquier XSS. Entender lo que garantiza y lo que no evita los errores de seguridad más comunes en apps modernas.',
  preguntas: [
    { a: 'Al responsable de seguridad', q: '¿Dónde guardamos los tokens en el navegador y por qué?', obt: 'La decisión del equipo y la amenaza que mitiga.' },
    { a: 'Al tech lead', q: '¿Cuánto duran los tokens de acceso y cómo se revocan?', obt: 'Duración y estrategia de revocación, el punto débil de los JWT.' },
    { a: 'En una revisión de código', q: '¿Hay algún dato sensible dentro del payload del token?', obt: 'Detectar información que no debería viajar legible.' }
  ],
  evita: { q: '¿El JWT es seguro porque está cifrado?', por: 'No está cifrado, está firmado. Pregunta qué garantiza la firma y qué no.' }
},

'w18d3': {
  sirve: 'La autorización decide qué puede hacer cada usuario. No basta con roles: un veterinario puede ver historiales, pero solo de su clínica; un dueño solo los de sus mascotas.',
  importa: 'El fallo de seguridad número uno en aplicaciones web (OWASP A01) es el control de acceso roto: cambiar /mascotas/42 por /mascotas/43 y ver datos ajenos. Se evita comprobando el recurso, no solo el rol.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué puede ver y hacer cada tipo de persona: recepcionista, veterinario, dueño?', obt: 'La matriz de permisos dicha por el negocio.' },
    { a: 'Al responsable de seguridad', q: '¿Tenemos tests que comprueben que un usuario no accede a recursos de otro?', obt: 'Si el control por recurso está verificado o se da por supuesto.' },
    { a: 'En una revisión de código', q: '¿Este endpoint comprueba que la mascota pertenece al usuario, o solo que está autenticado?', obt: 'Detectar IDOR antes de que llegue a producción.' }
  ],
  evita: { q: '¿Con [Authorize] ya está protegido?', por: 'Solo comprueba que hay sesión. Pregunta si el usuario tiene derecho a ese recurso concreto.' }
},

'w18d4': {
  sirve: 'En React, la sesión se representa en un contexto que sabe quién está conectado, protege rutas y reacciona cuando el token caduca.',
  importa: 'Si la sesión caduca y la app no lo maneja, el usuario pierde lo que estaba escribiendo o ve errores sin sentido. Ocultar un botón en el frontend no es seguridad: la protección real siempre está en el backend.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Cuánto tiempo suele quedarse la pantalla abierta sin usarla?', obt: 'Cuánto debe durar la sesión para no molestar ni arriesgar.' },
    { a: 'Al responsable de seguridad', q: '¿Cuánto tiempo de inactividad permitimos antes de cerrar la sesión?', obt: 'El límite de seguridad que hay que equilibrar con el uso.' },
    { a: 'Al diseñador', q: '¿Qué ve el usuario cuando la sesión caduca en mitad de un formulario?', obt: 'El flujo para no perder trabajo.' }
  ],
  evita: { q: '¿Oculto los botones de admin y ya?', por: 'Ocultar no protege. Pregunta si el backend rechaza la operación aunque alguien la invoque a mano.' }
},

'w18d5': {
  sirve: 'Completar la sesión es implementar el refresco de tokens, el cierre de sesión real y las defensas mínimas: límite de intentos, CORS correcto, cabeceras de seguridad.',
  importa: 'Sin límite de intentos, el login se puede atacar por fuerza bruta. Un cierre de sesión que no invalida el token deja la sesión viva. Son defensas básicas que todo auditor revisa primero.',
  preguntas: [
    { a: 'Al responsable de seguridad', q: '¿Cuántos intentos de login fallidos permitimos y qué pasa después?', obt: 'La política de bloqueo o retraso.' },
    { a: 'Al tech lead', q: '¿Cerrar sesión invalida el token de refresco en el servidor?', obt: 'Si el logout es real o solo borra datos en el navegador.' },
    { a: 'Al equipo de infraestructura', q: '¿Desde qué dominios se llama a la API?', obt: 'La lista exacta para configurar CORS sin comodines.' }
  ],
  evita: { q: '¿Pongo CORS con * para que funcione?', por: 'Abre la API a cualquier web. Pregunta qué orígenes deben poder llamarla.' }
},

'w18d6': {
  sirve: 'Auditar tu propia aplicación buscando fallos de forma activa es lo que hacen los equipos responsables antes de cada lanzamiento importante.',
  importa: 'Es mucho más barato encontrar tus propios fallos que pagar a que los encuentre un atacante. Una auditoría escrita además demuestra en una entrevista que piensas en seguridad sin que te lo pidan.',
  preguntas: [
    { a: 'Al responsable de seguridad', q: '¿Qué lista de control usamos: OWASP Top 10, ASVS?', obt: 'El estándar contra el que auditar.' },
    { a: 'A un compañero', q: 'Intenta acceder a datos de otra clínica con tu usuario de prueba.', obt: 'Una prueba de control de acceso hecha por alguien que no escribió el código.' },
    { a: 'Al tech lead', q: '¿Qué hallazgo de seguridad bloquearía la salida a producción?', obt: 'El umbral de gravedad que obliga a corregir antes de lanzar.' }
  ],
  evita: { q: '¿Es segura la aplicación?', por: 'Nadie puede responder sí. Pregunta qué amenazas concretas se revisaron y cuáles quedan pendientes.' }
},

/* ---------- Semana 19 · Seguridad aplicada ---------- */

'w19d1': {
  sirve: 'La inyección ocurre cuando un dato del usuario se ejecuta como código (SQL, comandos). Se cierra con consultas parametrizadas, nunca filtrando caracteres.',
  importa: 'La inyección SQL sigue en el Top 10 de OWASP después de más de veinte años. Una sola concatenación en una consulta puede exponer o borrar toda la base. Es un fallo que no se perdona en una revisión.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Hay algún sitio donde construyamos SQL concatenando texto?', obt: 'Los puntos de riesgo, incluidos FromSqlRaw o consultas dinámicas de ordenación.' },
    { a: 'En una revisión de código', q: '¿Este valor del usuario llega a la consulta como parámetro o como texto?', obt: 'Confirmar la parametrización en cada consulta nueva.' },
    { a: 'Al responsable de seguridad', q: '¿Tenemos análisis estático que detecte concatenaciones en SQL?', obt: 'Si hay una red automática además de la revisión humana.' }
  ],
  evita: { q: '¿Quito las comillas del input para evitar inyección?', por: 'Filtrar caracteres siempre deja huecos. Pregunta si la consulta usa parámetros.' }
},

'w19d2': {
  sirve: 'Para evitar XSS hay que codificar la salida según dónde se pinta el dato. React lo hace por defecto en el texto, pero no en dangerouslySetInnerHTML, en URLs javascript: ni en atributos especiales.',
  importa: 'Un XSS permite a un atacante ejecutar código en el navegador de la recepcionista: robar su sesión, ver fichas o dar citas falsas. Creer que React te protege de todo es justo lo que deja abiertos los huecos.',
  preguntas: [
    { a: 'En una revisión de código', q: '¿Por qué se usa dangerouslySetInnerHTML aquí? ¿El contenido se sanea?', obt: 'Justificación y saneamiento de los pocos sitios donde React no protege.' },
    { a: 'Al veterinario', q: '¿Necesitas formato (negritas, listas) en las notas clínicas?', obt: 'Si hace falta HTML enriquecido o basta con texto plano, que es mucho más seguro.' },
    { a: 'Al responsable de seguridad', q: '¿Tenemos una Content Security Policy configurada?', obt: 'Una segunda capa de defensa contra XSS.' }
  ],
  evita: { q: '¿React ya evita el XSS, verdad?', por: 'Solo en parte. Pregunta en qué casos concretos React no codifica la salida.' }
},

'w19d3': {
  sirve: 'Validar en el borde de la API (tipos, longitudes, formatos) separa los datos mal formados de las reglas de negocio. La validación del formulario es solo comodidad para el usuario.',
  importa: 'Cualquiera puede saltarse el frontend y llamar a la API con curl. Si la API confía en que el formulario validó, acepta cualquier cosa. La regla es simple: el cliente nunca es de fiar.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué validaciones hace hoy solo el frontend y no la API?', obt: 'Los huecos de validación que un atacante puede aprovechar.' },
    { a: 'Al equipo de frontend', q: '¿Compartimos las reglas de validación o están duplicadas a mano?', obt: 'Si hay riesgo de que las dos validaciones diverjan.' },
    { a: 'En una revisión de código', q: '¿Qué pasa si mando este campo con 10 MB de texto?', obt: 'Límites de tamaño que faltan en la entrada.' }
  ],
  evita: { q: '¿Si el formulario ya valida, la API también tiene que hacerlo?', por: 'Sí, siempre. Pregunta qué pasa si alguien llama a la API sin pasar por el formulario.' }
},

'w19d4': {
  sirve: 'Auditar dependencias (dotnet list package --vulnerable, npm audit, Dependabot) detecta librerías con vulnerabilidades conocidas y lo deja automatizado en CI.',
  importa: 'La mayor parte del código que despliegas no lo escribiste tú. Una librería vulnerable es una puerta abierta aunque tu código sea perfecto. Casos como Log4Shell demostraron que puede afectar a medio internet en un día.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Quién revisa las alertas de dependencias y cada cuánto?', obt: 'El responsable y la frecuencia, para que las alertas no se acumulen sin leer.' },
    { a: 'Al responsable de seguridad', q: '¿Qué gravedad de vulnerabilidad bloquea un merge?', obt: 'El umbral que debe aplicar el pipeline.' },
    { a: 'A un compañero', q: '¿Para qué usamos esta librería? ¿Seguimos necesitándola?', obt: 'Dependencias que se pueden quitar, la forma más barata de reducir riesgo.' }
  ],
  evita: { q: '¿Actualizo todas las dependencias a la última versión?', por: 'Puede romper cosas sin control. Pregunta cuáles tienen vulnerabilidades conocidas y empieza por ellas.' }
},

'w19d5': {
  sirve: 'Sacar los secretos del repositorio (a variables de entorno o un gestor de secretos), comprobar el historial de git y registrar sin volcar datos personales es higiene básica de cualquier equipo.',
  importa: 'Un secreto subido a git queda en el historial aunque lo borres en el siguiente commit, y hay bots que rastrean repositorios públicos buscándolos en minutos. Los logs con datos personales son una filtración esperando a ocurrir.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Dónde se guardan los secretos de producción y quién tiene acceso?', obt: 'El gestor de secretos y el control de acceso.' },
    { a: 'Al responsable de seguridad', q: 'Si encuentro un secreto en el historial de git, ¿cuál es el procedimiento?', obt: 'Rotar el secreto primero, limpiar el historial después.' },
    { a: 'Al responsable de privacidad', q: '¿Qué datos personales no pueden aparecer nunca en los logs?', obt: 'La lista de datos a enmascarar.' }
  ],
  evita: { q: '¿Borro el archivo con la clave y ya está?', por: 'Sigue en el historial. Pregunta cómo se rota la clave, porque hay que darla por comprometida.' }
},

'w19d6': {
  sirve: 'Un modelo de amenazas (por ejemplo con STRIDE) recorre el sistema pensando como atacante, prioriza riesgos y decide defensas. Se hace al diseñar y al cambiar algo importante.',
  importa: 'Sin un método, la seguridad depende de lo que se te ocurra ese día. Con un modelo de amenazas, cubres sistemáticamente cada tipo de ataque y puedes justificar qué riesgos aceptas y por qué.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué sería lo peor que podría pasar con los datos de la clínica?', obt: 'Los activos más valiosos y el impacto de perderlos, desde el negocio.' },
    { a: 'Al responsable de seguridad', q: '¿Usamos STRIDE u otro método para modelar amenazas?', obt: 'El método del equipo para que el documento sea comparable.' },
    { a: 'Al tech lead', q: '¿Qué riesgo de esta lista estamos dispuestos a aceptar sin mitigar?', obt: 'Decisiones explícitas de riesgo aceptado, firmadas por alguien.' }
  ],
  evita: { q: '¿Nos pueden hackear?', por: 'Siempre sí. Pregunta qué activos protegemos, de quién y con qué controles.' }
},

/* ---------- Semana 20 · Git, Docker y CI/CD ---------- */

'w20d1': {
  sirve: 'Commits pequeños con mensajes que explican el porqué convierten el historial en documentación. Es lo que usas para entender por qué una línea es como es (git blame) o para encontrar cuándo entró un bug (git bisect).',
  importa: 'Un historial de "fix", "cambios" y "wip" no sirve para nada cuando hay que investigar un problema en producción. Un buen historial ahorra horas cada vez que alguien necesita entender una decisión pasada.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Seguimos alguna convención de mensajes, como Conventional Commits?', obt: 'El formato del equipo.' },
    { a: 'Al tech lead', q: '¿Preferimos squash al hacer merge o conservar todos los commits?', obt: 'La política que decide cómo de cuidados deben ser los commits intermedios.' },
    { a: 'A un compañero', q: '¿Puedes entender qué hace este commit solo con el mensaje?', obt: 'Una prueba rápida de la calidad del mensaje.' }
  ],
  evita: { q: '¿Importa mucho el mensaje del commit?', por: 'Importa cuando alguien lo lee meses después. Pregunta cómo investiga el equipo los bugs en el historial.' }
},

'w20d2': {
  sirve: 'Trabajar con ramas cortas, resolver conflictos entendiendo ambos cambios y elegir entre merge y rebase son tareas diarias en cualquier equipo con más de una persona.',
  importa: 'Resolver un conflicto quedándote con "lo mío" sin entender lo del otro borra trabajo ajeno sin que nadie lo note. Las ramas largas generan conflictos enormes. El flujo de ramas define la velocidad del equipo.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué flujo de ramas usamos: trunk-based, GitHub Flow, Git Flow?', obt: 'El modelo de ramas del equipo.' },
    { a: 'A un compañero', q: 'Tenemos un conflicto en este archivo: ¿qué querías conseguir con tu cambio?', obt: 'La intención del otro cambio para resolver el conflicto sin perder nada.' },
    { a: 'Al tech lead', q: '¿Se puede hacer rebase de ramas que ya están compartidas?', obt: 'La regla que evita reescribir historia que otros usan.' }
  ],
  evita: { q: '¿Acepto mis cambios en el conflicto y sigo?', por: 'Puedes borrar trabajo de otro. Pregunta qué intentaba hacer el otro cambio antes de resolver.' }
},

'w20d3': {
  sirve: 'Un Dockerfile multietapa compila la API en una imagen y copia solo lo necesario a otra imagen pequeña. Esa imagen corre igual en tu máquina, en CI y en producción.',
  importa: 'El "en mi máquina funciona" desaparece con contenedores. Una imagen pequeña, sin herramientas de compilación ni usuario root, se despliega más rápido y tiene menos superficie de ataque.',
  preguntas: [
    { a: 'Al equipo de infraestructura', q: '¿Qué imagen base usamos y quién la mantiene actualizada?', obt: 'La imagen aprobada y la política de actualización.' },
    { a: 'Al responsable de seguridad', q: '¿Los contenedores deben correr sin usuario root?', obt: 'Requisitos de seguridad del contenedor.' },
    { a: 'Al tech lead', q: '¿Cuánto debería pesar la imagen final?', obt: 'Un objetivo de tamaño que obliga a usar etapas y a no copiar de más.' }
  ],
  evita: { q: '¿Copio todo el proyecto al contenedor?', por: 'Mete secretos, código fuente y basura. Pregunta qué necesita la imagen para ejecutarse y usa un .dockerignore.' }
},

'w20d4': {
  sirve: 'Compose define API, base de datos y web en un archivo para levantar todo con un comando. Es la forma estándar de que alguien nuevo tenga el entorno funcionando en minutos.',
  importa: 'Si montar el entorno local lleva un día de instrucciones, cada persona nueva pierde ese día y cada máquina queda un poco distinta. Con Compose, el entorno es código versionado y reproducible.',
  preguntas: [
    { a: 'A un compañero nuevo', q: '¿Cuánto tardaste en tener el proyecto funcionando y en qué te atascaste?', obt: 'Los pasos que faltan en el compose o en el README.' },
    { a: 'Al tech lead', q: '¿Los datos de la base local deben sobrevivir a un docker compose down?', obt: 'Si hacen falta volúmenes persistentes y cómo se reinicia desde cero.' },
    { a: 'Al equipo de infraestructura', q: '¿Usamos Compose también en algún entorno compartido o solo en local?', obt: 'El alcance del archivo y lo que debe cumplir.' }
  ],
  evita: { q: '¿Pongo las contraseñas en el compose.yaml?', por: 'Acaban en el repositorio. Pregunta cómo maneja el equipo las variables de entorno locales.' }
},

'w20d5': {
  sirve: 'Un pipeline de CI compila, pasa los tests contra una base real y audita dependencias en cada push, sin depender de que alguien se acuerde.',
  importa: 'Sin CI, los errores llegan a main y los descubre otro compañero al día siguiente. Con CI, se descubren en minutos y en la rama de quien los causó. Es la red de seguridad básica de un equipo.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué comprobaciones deben pasar para poder hacer merge a main?', obt: 'Las reglas de protección de rama y los checks obligatorios.' },
    { a: 'Al equipo de infraestructura', q: '¿Cuánto tarda hoy el pipeline y cuál es el máximo aceptable?', obt: 'Un objetivo de velocidad del pipeline.' },
    { a: 'Al equipo', q: '¿Qué pruebas hacéis a mano antes de un merge que podría hacer el pipeline?', obt: 'Pasos a automatizar.' }
  ],
  evita: { q: '¿Desactivo el paso que falla para poder hacer merge?', por: 'Quita la red de seguridad. Pregunta por qué falla y arréglalo o márcalo como pendiente con un responsable.' }
},

'w20d6': {
  sirve: 'Demostrar que cualquiera puede clonar y ejecutar el proyecto, y escribir cómo se despliega y cómo se vuelve atrás, es lo que deja un sistema en manos del equipo y no de una persona.',
  importa: 'Un proyecto que solo sabe desplegar una persona es un riesgo para la empresa. Tener escrito el rollback antes de necesitarlo es lo que convierte un incidente de horas en uno de minutos.',
  preguntas: [
    { a: 'A un compañero', q: '¿Puedes clonar el repositorio y levantar todo siguiendo solo el README?', obt: 'Una prueba real de reproducibilidad.' },
    { a: 'Al equipo de infraestructura', q: '¿Cómo volvemos a la versión anterior si el despliegue sale mal?', obt: 'El procedimiento de rollback documentado y probado.' },
    { a: 'Al tech lead', q: '¿Qué tiene que comprobarse justo después de cada despliegue?', obt: 'La lista de verificación posterior al despliegue.' }
  ],
  evita: { q: '¿Despliego y si falla lo miramos?', por: 'Mirar en caliente es lento y estresante. Pregunta cuál es el plan de vuelta atrás antes de desplegar.' }
}

});
