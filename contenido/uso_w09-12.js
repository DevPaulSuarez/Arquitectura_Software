/* Para qué sirve cada día en un trabajo real, por qué importa
   y qué preguntar (al cliente, al equipo o al tech lead) para aplicarlo.
   Clave: w<semana>d<día>. */
window.USO = Object.assign(window.USO || {}, {

/* ---------- Semana 9 · SQL de verdad ---------- */

'w9d1': {
  sirve: 'Escribir el DDL es crear las tablas reales eligiendo tipos (numeric para dinero, timestamptz para fechas, text para nombres). Es lo que se revisa en cada migración que crea o altera una tabla.',
  importa: 'Un tipo mal elegido dura para siempre: guardar dinero en float produce céntimos perdidos, guardar fechas sin zona horaria provoca citas desplazadas una hora dos veces al año. Corregirlo con millones de filas es una operación arriesgada.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué convención usamos para ids: integer, bigint o uuid?', obt: 'La convención del equipo y su motivo, para que todas las tablas sean coherentes.' },
    { a: 'Al dueño de la clínica', q: '¿La clínica trabaja siempre en la misma zona horaria? ¿Hay citas online con clientes de fuera?', obt: 'Si basta con hora local o hace falta guardar con zona horaria.' },
    { a: 'Al DBA o tech lead', q: '¿Qué volumen esperamos en esta tabla en dos años?', obt: 'Si un integer basta o hace falta bigint, y si hay que pensar ya en índices o particiones.' }
  ],
  evita: { q: '¿Pongo todo como varchar(255)?', por: 'Es el atajo que nadie defiende en una revisión. Pregunta qué representa cada dato y qué rango tiene.' }
},

'w9d2': {
  sirve: 'Las constraints hacen que PostgreSQL rechace datos inválidos con un error claro. En el trabajo son la garantía de que ni un bug ni un script manual dejan la base en un estado imposible.',
  importa: 'Los datos sucios son la deuda técnica más cara: una vez dentro, contaminan reportes, rompen migraciones y nadie sabe si se pueden borrar. Una constraint cuesta una línea y evita años de limpieza.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Damos nombre propio a las constraints o dejamos el que pone PostgreSQL?', obt: 'La convención de nombres que permite traducir el error de la base a un mensaje útil en la API.' },
    { a: 'Al veterinario', q: '¿Hay combinaciones de datos que nunca pueden darse juntas? Por ejemplo, una vacuna de gato en un perro.', obt: 'Reglas entre columnas que pueden expresarse con CHECK o con claves foráneas compuestas.' },
    { a: 'Al DBA', q: '¿Cómo añadimos una constraint nueva a una tabla que ya tiene datos que no la cumplen?', obt: 'El procedimiento seguro (NOT VALID, limpiar, VALIDATE) sin bloquear producción.' }
  ],
  evita: { q: '¿Las constraints no hacen la base más lenta?', por: 'El coste es mínimo comparado con el de los datos corruptos. Pregunta qué datos imposibles podrían entrar hoy.' }
},

'w9d3': {
  sirve: 'INSERT, UPDATE y DELETE seguros (con WHERE comprobado, en transacción, con RETURNING) son lo que usas cuando arreglas datos en producción o preparas datos de prueba.',
  importa: 'Un UPDATE sin WHERE es un incidente con nombre propio en muchas empresas. Saber modificar datos con red de seguridad (transacción, comprobar filas afectadas antes de confirmar) separa a quien puede tocar producción de quien no.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Cuál es el procedimiento para corregir datos a mano en producción? ¿Quién lo revisa?', obt: 'El proceso del equipo (script revisado, transacción, copia previa), que existe por algún incidente pasado.' },
    { a: 'Al DBA', q: '¿Usamos borrado lógico o físico para mascotas y dueños?', obt: 'La política de borrado, que afecta a consultas, informes y privacidad.' },
    { a: 'A QA', q: '¿Qué datos de prueba necesitas para cubrir los casos raros?', obt: 'Casos realistas para el seed: mascotas sin chip, dueños con dos mascotas, citas canceladas.' }
  ],
  evita: { q: '¿Puedo lanzar este UPDATE en producción?', por: 'Pedir permiso sin enseñar nada no da seguridad a nadie. Enseña el script, cuántas filas afectará y cómo se deshace.' }
},

'w9d4': {
  sirve: 'SELECT con filtros correctos responde las preguntas del negocio. Entender NULL (que no es igual a nada, ni a sí mismo) evita consultas que pierden filas en silencio.',
  importa: 'Una consulta con un NULL mal tratado no da error: devuelve un número equivocado. Y ese número acaba en un informe que alguien usa para tomar decisiones.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Cuando pides "las mascotas sin vacuna de rabia", ¿incluyes las que no sabemos si la tienen?', obt: 'Cómo tratar los datos desconocidos en el informe, que se traduce en cómo tratar NULL.' },
    { a: 'A un compañero', q: '¿Esta columna puede ser NULL? ¿Qué significa NULL aquí: no aplica o no lo sabemos?', obt: 'El significado del NULL, que cambia cómo se filtra.' },
    { a: 'Al tech lead', q: '¿Dónde dejamos las consultas de reportes para que se revisen y versionen?', obt: 'Dónde viven las consultas compartidas del equipo.' }
  ],
  evita: { q: '¿Por qué mi consulta no devuelve nada?', por: 'Sin contexto nadie puede ayudar. Enseña la consulta, los datos de ejemplo y lo que esperabas; casi siempre es un NULL.' }
},

'w9d5': {
  sirve: 'Los JOIN combinan tablas para responder preguntas como "citas de hoy con nombre de mascota y dueño". Elegir INNER o LEFT cambia qué filas aparecen.',
  importa: 'Un INNER JOIN donde tocaba LEFT hace desaparecer de un informe a las mascotas sin dueño o a los veterinarios sin citas. El resultado parece correcto, y por eso es peligroso.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'En el listado de veterinarios con sus citas del mes, ¿quieres ver también a los que no tuvieron ninguna?', obt: 'La respuesta que decide entre INNER y LEFT JOIN.' },
    { a: 'A un compañero', q: '¿Por qué este informe da más filas de las que esperaba?', obt: 'Detectar un JOIN que multiplica filas por una relación 1:N no prevista.' },
    { a: 'Al tech lead', q: '¿Tenemos índices en todas las claves foráneas que usamos en JOIN?', obt: 'Si los JOIN frecuentes tienen soporte de índices.' }
  ],
  evita: { q: '¿Qué JOIN tengo que usar?', por: 'Depende de la pregunta del negocio. Explica qué filas deben aparecer cuando no hay coincidencia.' }
},

'w9d6': {
  sirve: 'GROUP BY produce los informes que pide la dirección (citas por mes, ingresos por veterinario). Las transacciones garantizan que una operación de varios pasos se haga completa o no se haga.',
  importa: 'Un informe agregado mal hecho lleva a malas decisiones de negocio. Una operación sin transacción que falla a la mitad deja cobros sin cita o citas sin cobro, y alguien tendrá que cuadrar eso a mano.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué números miras cada mes para saber si la clínica va bien?', obt: 'Los informes que de verdad se usan, que son los que merece la pena construir bien.' },
    { a: 'Al tech lead', q: '¿Qué operaciones del sistema tocan varias tablas y deberían ir en una transacción?', obt: 'Las operaciones críticas que necesitan atomicidad.' },
    { a: 'Al contable', q: '¿Los ingresos se cuentan por fecha de la cita o por fecha de cobro?', obt: 'La definición exacta de la métrica, que cambia el GROUP BY.' }
  ],
  evita: { q: '¿Hago un informe con todo?', por: 'Un informe con todo no lo lee nadie. Pregunta qué decisión toma la persona con ese número.' }
},

/* ---------- Semana 10 · Rendimiento de base de datos ---------- */

'w10d1': {
  sirve: 'Los índices hacen que una búsqueda pase de leer toda la tabla a ir directo al dato. En el trabajo decides qué índices crear según las consultas reales, no por costumbre.',
  importa: 'Sin el índice correcto, una consulta que tarda 5 ms con 1.000 filas tarda segundos con un millón. Y cada índice innecesario hace más lentas todas las escrituras. Hay que poner los justos.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Cuáles son las consultas más frecuentes contra esta tabla?', obt: 'Los patrones de acceso que justifican cada índice.' },
    { a: 'Al DBA', q: '¿Hay índices que nunca se usan? ¿Cómo lo comprobamos?', obt: 'La consulta a pg_stat_user_indexes para encontrar índices que solo cuestan.' },
    { a: 'A la recepcionista', q: '¿Por qué datos buscas una mascota: nombre, teléfono del dueño, chip?', obt: 'Las columnas de búsqueda reales, que son las que necesitan índice.' }
  ],
  evita: { q: '¿Pongo un índice en cada columna?', por: 'Ralentiza las escrituras y ocupa espacio sin beneficio. Pregunta qué consultas son lentas y por qué columnas filtran.' }
},

'w10d2': {
  sirve: 'EXPLAIN ANALYZE enseña cómo ejecuta PostgreSQL una consulta y dónde se va el tiempo. Es la herramienta que usas cuando alguien dice "la pantalla de agenda va lenta".',
  importa: 'Sin un plan de ejecución, optimizar es adivinar, y adivinar suele empeorar las cosas. Con él, ves en minutos si falta un índice, si la estimación es mala o si el problema ni siquiera está en la base.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Podemos obtener el plan de esta consulta con datos de tamaño real?', obt: 'Acceso a un entorno con volumen realista; los planes con 10 filas engañan.' },
    { a: 'Al DBA', q: '¿Las estadísticas de esta tabla están actualizadas?', obt: 'Si el planificador tiene información correcta o necesita un ANALYZE.' },
    { a: 'A quien reportó la lentitud', q: '¿Qué estabas haciendo exactamente, con qué filtros y a qué hora?', obt: 'La consulta exacta que hay que analizar, no una parecida.' }
  ],
  evita: { q: '¿La base de datos va lenta?', por: 'Es demasiado general. Pregunta qué consulta, con qué parámetros, y trae el plan de ejecución.' }
},

'w10d3': {
  sirve: 'Reconocer los patrones lentos clásicos (N+1, SELECT *, funciones sobre columnas indexadas, paginación con OFFSET grande) te permite arreglarlos en revisiones antes de que lleguen a producción.',
  importa: 'Estos cuatro patrones explican la mayoría de los problemas de rendimiento de bases de datos en aplicaciones normales. Conocerlos es la diferencia entre arreglar un problema en una hora o en una semana.',
  preguntas: [
    { a: 'En una revisión de código', q: '¿Cuántas consultas lanza esta pantalla para cargarse?', obt: 'Detección de N+1 antes de que llegue a producción.' },
    { a: 'Al tech lead', q: '¿Tenemos registro de consultas lentas activado en algún entorno?', obt: 'Una fuente de datos objetiva sobre qué consultas son problemáticas.' },
    { a: 'Al DBA', q: '¿Qué tabla ha crecido más rápido de lo esperado este trimestre?', obt: 'Dónde aparecerán los próximos problemas de rendimiento.' }
  ],
  evita: { q: '¿Cómo hago la base más rápida?', por: 'Sin medición no hay respuesta. Pregunta cuál es la consulta más lenta y cuántas veces se ejecuta.' }
},

'w10d4': {
  sirve: 'Algunas reglas, como "dos citas del mismo veterinario no pueden solaparse", no caben en un CHECK. PostgreSQL las resuelve con exclusion constraints sobre rangos de tiempo.',
  importa: 'Si esa regla solo vive en el código, dos peticiones simultáneas pueden crear dos citas solapadas porque ambas comprobaron "no hay nada" antes de que la otra guardara. La base de datos es la única que puede garantizarla con concurrencia.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Una cita que termina a las 10:00 y otra que empieza a las 10:00 se solapan?', obt: 'Si los rangos son cerrados o semiabiertos, un detalle que cambia la constraint.' },
    { a: 'Al veterinario', q: '¿Hay situaciones en las que sí aceptas dos citas a la vez, como una urgencia?', obt: 'Excepciones que la constraint debe contemplar o que necesitan otro tipo de cita.' },
    { a: 'Al tech lead', q: '¿Qué hace la API cuando la base rechaza una cita por solapamiento?', obt: 'Cómo traducir ese error a una respuesta 409 con un mensaje útil.' }
  ],
  evita: { q: '¿Basta con comprobar en el código que no hay solape?', por: 'No basta con concurrencia. Pregunta qué pasa si dos recepcionistas reservan el mismo hueco en el mismo segundo.' }
},

'w10d5': {
  sirve: 'Las migraciones versionan los cambios del esquema para que todos los entornos (tu máquina, pruebas, producción) estén iguales y cada cambio se pueda revisar.',
  importa: 'Cambiar el esquema a mano en producción es como desplegar código sin git. Una migración mal pensada (por ejemplo, añadir una columna NOT NULL a una tabla enorme) puede bloquear la base durante minutos con usuarios dentro.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Las migraciones se aplican solas en el despliegue o las lanza alguien a mano?', obt: 'El proceso real del equipo y quién es responsable si falla.' },
    { a: 'Al DBA', q: '¿Esta migración bloquea la tabla? ¿Cuánto tiempo con el volumen actual?', obt: 'El riesgo real de la migración y si hay que partirla en varios pasos.' },
    { a: 'Al tech lead', q: '¿Cómo deshacemos esta migración si el despliegue sale mal?', obt: 'Un plan de vuelta atrás antes de necesitarlo.' }
  ],
  evita: { q: '¿Puedo editar una migración que ya está en main?', por: 'Si otro entorno ya la aplicó, editarla rompe la sincronía. Pregunta si ya se aplicó en algún sitio y crea una nueva si es así.' }
},

'w10d6': {
  sirve: 'Entender los niveles de aislamiento y los bloqueos explica qué pasa cuando dos usuarios modifican lo mismo a la vez. Es lo que necesitas para elegir entre bloqueo optimista, pesimista o reintento.',
  importa: 'Los bugs de concurrencia no se reproducen en tu máquina y aparecen en producción una vez a la semana. Quien entiende el aislamiento los diagnostica; quien no, los llama "fallos raros" durante meses.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué nivel de aislamiento usamos por defecto? ¿Alguna operación usa otro?', obt: 'El punto de partida para razonar sobre qué anomalías pueden ocurrir.' },
    { a: 'A la recepcionista', q: '¿Es habitual que dos personas editen la misma ficha a la vez?', obt: 'La frecuencia real del conflicto, que decide si basta con bloqueo optimista.' },
    { a: 'Al DBA', q: '¿Hemos tenido deadlocks en producción? ¿En qué tablas?', obt: 'Dónde está la contención real del sistema.' }
  ],
  evita: { q: '¿Pongo SERIALIZABLE en todo para ir seguros?', por: 'Obliga a reintentar muchas transacciones y puede bajar el rendimiento. Pregunta qué anomalía concreta quieres evitar en cada operación.' }
},

/* ---------- Semana 11 · HTTP y REST ---------- */

'w11d1': {
  sirve: 'Saber qué viaja en una petición HTTP (método, URL, cabeceras, cuerpo) es lo que te permite depurar cualquier integración entre frontend, backend y servicios externos.',
  importa: 'La mitad de los bugs entre frontend y backend son de HTTP: una cabecera que falta, un Content-Type equivocado, una cookie que no viaja. Quien sabe leer una petición en las herramientas del navegador los resuelve en minutos.',
  preguntas: [
    { a: 'Al equipo de frontend', q: '¿Puedes enseñarme la petición exacta que sale del navegador, con cabeceras?', obt: 'Datos reales para depurar, en vez de suposiciones sobre lo que el frontend manda.' },
    { a: 'Al tech lead', q: '¿Qué cabeceras son obligatorias en nuestra API: autenticación, correlación, versión?', obt: 'El contrato de cabeceras que todo cliente debe cumplir.' },
    { a: 'Al equipo de infraestructura', q: '¿Hay algún proxy o balanceador entre el cliente y la API que modifique cabeceras?', obt: 'Saber si alguien en medio cambia lo que llega, un clásico de "en local funciona".' }
  ],
  evita: { q: '¿Por qué no funciona la API?', por: 'No dice nada. Enseña la petición, la respuesta y el código de estado; con eso cualquiera puede ayudar.' }
},

'w11d2': {
  sirve: 'Elegir el verbo (GET, POST, PUT, PATCH, DELETE) y el código (200, 201, 400, 404, 409) correctos hace que cualquier cliente entienda tu API sin leer documentación.',
  importa: 'Devolver 200 con un {"error": true} dentro rompe los reintentos, las cachés, la monitorización y las herramientas que confían en los códigos. Usar bien HTTP es lo que hace que tu API funcione con el resto del mundo.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué código devolvemos cuando la validación falla: 400 o 422?', obt: 'La convención del equipo, para que toda la API sea coherente.' },
    { a: 'Al equipo de frontend', q: '¿Qué necesitas distinguir en los errores para mostrar el mensaje correcto?', obt: 'Qué códigos y datos de error hacen falta desde el punto de vista de quien consume la API.' },
    { a: 'En una revisión de código', q: '¿Esta operación es idempotente? Entonces, ¿por qué es POST?', obt: 'Ajustar el verbo a la semántica real de la operación.' }
  ],
  evita: { q: '¿Devuelvo siempre 200 y el error en el JSON?', por: 'Rompe todo lo que confía en HTTP. Pregunta qué debe hacer el cliente en cada caso y elige el código que lo comunica.' }
},

'w11d3': {
  sirve: 'Diseñar URLs como recursos (/mascotas/42/vacunas) hace la API predecible. En el trabajo es lo primero que se discute cuando se diseña un endpoint nuevo.',
  importa: 'Las URLs son un contrato público: una vez que una app móvil las usa, cambiarlas obliga a sacar versión nueva. Pensarlas bien al principio evita años arrastrando rutas como /getMascotaById.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Usamos plurales y español en las rutas? ¿Cuánta anidación permitimos?', obt: 'Las reglas de estilo de URLs del equipo.' },
    { a: 'Al equipo de frontend', q: '¿Qué pantallas vais a construir y qué datos necesita cada una?', obt: 'Los recursos y las relaciones que de verdad hacen falta, sin inventar endpoints.' },
    { a: 'En una revisión de código', q: '¿Esta acción es un recurso o un verbo escondido en la URL?', obt: 'Cómo modelar acciones como cancelar una cita sin romper el estilo REST.' }
  ],
  evita: { q: '¿Cómo llamo al endpoint?', por: 'Sin contexto es una discusión de gustos. Explica qué recurso representa y qué operaciones admite.' }
},

'w11d4': {
  sirve: 'Los DTOs definen exactamente qué JSON entra y sale de cada endpoint, separados de las entidades. Así puedes cambiar la base de datos sin romper a los clientes de la API.',
  importa: 'Devolver la entidad directamente expone campos internos (contraseñas, flags, ids técnicos) y ata la API a la base de datos. Es uno de los fallos de seguridad y diseño más comunes en APIs nuevas.',
  preguntas: [
    { a: 'Al equipo de frontend', q: '¿Qué campos necesitas exactamente en la lista de citas y cuáles solo en el detalle?', obt: 'DTOs ajustados a cada uso, que evitan enviar datos de más.' },
    { a: 'Al tech lead', q: '¿Cómo formateamos fechas, dinero y enumerados en el JSON?', obt: 'Convenciones de formato que hacen la API coherente.' },
    { a: 'Al responsable de seguridad', q: '¿Hay datos que nunca deben salir de la API, aunque sean del propio usuario?', obt: 'Campos sensibles que deben quedar fuera de todos los DTOs.' }
  ],
  evita: { q: '¿Devuelvo la entidad directamente para ahorrar código?', por: 'Ahorras líneas hoy y expones datos internos para siempre. Pregunta qué necesita el cliente y devuelve solo eso.' }
},

'w11d5': {
  sirve: 'Los errores con formato estándar (Problem Details) y las operaciones idempotentes hacen que los clientes sepan qué falló y puedan reintentar sin duplicar citas o cobros.',
  importa: 'En redes reales las peticiones se repiten: el usuario hace doble clic, el móvil pierde cobertura, el proxy reintenta. Sin idempotencia, cada reintento puede ser una cita o un cobro duplicado.',
  preguntas: [
    { a: 'Al equipo de frontend', q: '¿Qué hace la app si una petición de crear cita tarda mucho y no responde?', obt: 'Si el cliente reintenta, y por tanto si la operación necesita clave de idempotencia.' },
    { a: 'Al tech lead', q: '¿Usamos Problem Details (RFC 9457) para todos los errores?', obt: 'El formato de error común del equipo.' },
    { a: 'A soporte', q: '¿Qué mensajes de error confunden más a los usuarios?', obt: 'Errores que hay que reescribir para que se entiendan.' }
  ],
  evita: { q: '¿Qué mensaje pongo en el error?', por: 'Sin saber quién lo lee, no hay buen mensaje. Pregunta qué debe hacer el usuario o el cliente cuando lo recibe.' }
},

'w11d6': {
  sirve: 'El contrato OpenAPI es la documentación ejecutable de la API: genera clientes, valida peticiones y permite que frontend y backend trabajen en paralelo.',
  importa: 'Sin contrato escrito, frontend y backend se enteran de los cambios cuando algo se rompe. Con contrato, se acuerdan antes y las herramientas detectan incompatibilidades automáticamente.',
  preguntas: [
    { a: 'Al equipo de frontend', q: '¿Podéis empezar a trabajar con este contrato y un servidor simulado?', obt: 'Confirmación de que el contrato es suficiente para trabajar en paralelo.' },
    { a: 'Al tech lead', q: '¿El contrato se escribe primero o se genera desde el código?', obt: 'El enfoque del equipo (contract-first o code-first) y sus motivos.' },
    { a: 'A un cliente externo de la API', q: '¿Qué te falta en la documentación para integrarte sin preguntarnos?', obt: 'Huecos reales de documentación vistos desde fuera.' }
  ],
  evita: { q: '¿Hace falta documentar la API si el código se entiende?', por: 'Los clientes no leen tu código. Pregunta cómo se va a integrar alguien que no tiene acceso al repositorio.' }
},

/* ---------- Semana 12 · API con ASP.NET Core ---------- */

'w12d1': {
  sirve: 'Levantar un proyecto ASP.NET Core con los primeros endpoints es el punto de partida de cualquier backend .NET. En el trabajo lo harás al crear un servicio nuevo o una prueba de concepto.',
  importa: 'Las decisiones del primer día (Minimal APIs o controladores, estructura de carpetas, configuración) se copian en todos los endpoints siguientes. Empezar ordenado ahorra un refactor grande a los tres meses.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Usamos Minimal APIs o controladores? ¿Hay una plantilla del equipo?', obt: 'El estilo estándar del equipo, para no crear un proyecto distinto a los demás.' },
    { a: 'Al tech lead', q: '¿Qué versión de .NET usamos y cuándo se actualiza?', obt: 'La versión objetivo y la política de actualización.' },
    { a: 'A un compañero', q: '¿Cómo levantas tú el proyecto en local la primera vez?', obt: 'Los pasos reales, que a menudo no están en el README y conviene añadir.' }
  ],
  evita: { q: '¿Cómo hago un Hola Mundo en ASP.NET?', por: 'Eso está en la documentación oficial. Pregunta por las convenciones del equipo que no puedes encontrar fuera.' }
},

'w12d2': {
  sirve: 'Los middlewares añaden comportamiento a todas las peticiones (registro, manejo de errores, autenticación, CORS). En el trabajo es donde vive todo lo transversal de la API.',
  importa: 'El orden de los middlewares importa: autenticar después de autorizar, o capturar errores después de que ocurran, deja agujeros de seguridad o errores sin registrar. Es una de las causas más comunes de "funciona raro".',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué middlewares tenemos y en qué orden? ¿Hay alguno propio?', obt: 'El mapa del pipeline real del proyecto.' },
    { a: 'Al equipo de seguridad', q: '¿Qué cabeceras de seguridad deben añadirse en todas las respuestas?', obt: 'Requisitos transversales que van en un middleware.' },
    { a: 'En una revisión de código', q: '¿Esto debería ser un middleware o un filtro de endpoint?', obt: 'Si el comportamiento aplica a todo o solo a algunos endpoints.' }
  ],
  evita: { q: '¿Meto este try/catch en cada endpoint?', por: 'Lo transversal va en un solo sitio. Pregunta si hay un middleware de manejo de errores y úsalo.' }
},

'w12d3': {
  sirve: 'EF Core mapea tus entidades a tablas de PostgreSQL. En el trabajo configuras ese mapeo para que respete las constraints, los tipos y los nombres que diseñaste.',
  importa: 'Dejar que EF decida todo por convención produce tablas distintas a las diseñadas: tipos genéricos, nombres raros, constraints que faltan. El mapeo explícito mantiene alineados el código y la base.',
  preguntas: [
    { a: 'Al tech lead', q: '¿El esquema lo manda EF (code-first) o el SQL que escribimos a mano?', obt: 'La fuente de verdad del esquema, una decisión de equipo con consecuencias.' },
    { a: 'Al DBA', q: '¿Qué convención de nombres usamos en tablas y columnas: snake_case?', obt: 'La convención que EF debe respetar.' },
    { a: 'A un compañero', q: '¿Cómo configuramos la cadena de conexión en local sin subirla al repositorio?', obt: 'El uso de user secrets o variables de entorno del equipo.' }
  ],
  evita: { q: '¿Dejo que EF genere todo y ya?', por: 'Pierdes el control de tipos y constraints. Pregunta quién manda en el esquema y configura el mapeo para respetarlo.' }
},

'w12d4': {
  sirve: 'Guardar bien con EF Core (una unidad de trabajo, SaveChanges una vez, cargas explícitas) evita el N+1 y los datos a medio guardar.',
  importa: 'El N+1 es invisible con 10 filas y tumba la API con 10.000. Las escrituras sin transacción dejan datos inconsistentes. Los dos errores son de los más vistos en revisiones de código de EF Core.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Registramos las consultas SQL que genera EF en desarrollo?', obt: 'Una forma de ver el N+1 con tus propios ojos antes de llegar a producción.' },
    { a: 'En una revisión de código', q: '¿Cuántas veces se llama a SaveChanges en esta operación?', obt: 'Detectar operaciones partidas que deberían ser atómicas.' },
    { a: 'Al DBA', q: '¿Qué endpoints lanzan más consultas por petición?', obt: 'Dónde buscar el N+1 primero.' }
  ],
  evita: { q: '¿Uso Include en todo para que cargue rápido?', por: 'Include en todo carga datos de más. Pregunta qué datos necesita cada pantalla y carga solo eso.' }
},

'w12d5': {
  sirve: 'Validar automáticamente la entrada y paginar los listados son requisitos de cualquier API real. Ordenar Program.cs en archivos de endpoints mantiene el proyecto legible cuando crece.',
  importa: 'Un listado sin paginación funciona hasta el día en que alguien pide 50.000 citas y la API se queda sin memoria. La validación de entrada es la primera barrera contra datos basura y ataques.',
  preguntas: [
    { a: 'Al equipo de frontend', q: '¿Cuántos elementos mostráis por página y cómo navega el usuario?', obt: 'El tamaño de página y el tipo de paginación (por página o por cursor).' },
    { a: 'Al tech lead', q: '¿Qué librería o mecanismo usamos para validar: DataAnnotations, FluentValidation?', obt: 'La herramienta común del equipo.' },
    { a: 'En una revisión de código', q: '¿Cuál es el máximo de elementos que puede pedir un cliente aquí?', obt: 'Un límite superior que protege a la API de peticiones abusivas.' }
  ],
  evita: { q: '¿Devuelvo todas las citas y que el frontend pagine?', por: 'Traslada el problema y lo agrava con la red. Pregunta cuántas citas habrá en un año.' }
},

'w12d6': {
  sirve: 'Cerrar la API con documentación generada, health checks y una demo de punta a punta es lo que la deja lista para que otro equipo la consuma o para desplegarla.',
  importa: 'Una API sin health check no se puede monitorizar ni balancear; sin documentación, nadie la usa sin preguntar. La demo end to end demuestra que las piezas encajan, no solo que compilan.',
  preguntas: [
    { a: 'Al equipo de infraestructura', q: '¿Qué endpoint de salud esperáis y qué debe comprobar: solo la API o también la base?', obt: 'El contrato del health check para el balanceador o el orquestador.' },
    { a: 'Al equipo de frontend', q: '¿La documentación generada os basta o falta algo?', obt: 'Huecos de documentación desde el punto de vista del consumidor.' },
    { a: 'Al tech lead', q: '¿Qué recorrido quieres ver en la demo para darla por terminada?', obt: 'El criterio de aceptación de la API completa.' }
  ],
  evita: { q: '¿Ya está terminada la API?', por: 'Terminada para quién. Pregunta qué tiene que funcionar en la demo y qué necesita infraestructura para desplegarla.' }
}

});
