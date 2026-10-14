/* Para qué sirve cada día en un trabajo real, por qué importa
   y qué preguntar (al cliente, al equipo o al tech lead) para aplicarlo.
   Clave: w<semana>d<día>. */
window.USO = Object.assign(window.USO || {}, {

/* ---------- Semana 13 · Testing ---------- */

'w13d1': {
  sirve: 'Un test con buena estructura (preparar, actuar, comprobar) y buen nombre documenta una regla de negocio y avisa si alguien la rompe. Es lo que se exige en casi todos los pull requests profesionales.',
  importa: 'Un test con nombre "Test1" que falla no le dice a nadie qué se rompió. Un test llamado "Cancelar_con_menos_de_24h_aplica_recargo" explica la regla, el fallo y dónde mirar sin abrir el código.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué convención de nombres usamos para los tests?', obt: 'El formato común del equipo, para que todos los tests se lean igual.' },
    { a: 'Al veterinario', q: 'Dime tres situaciones que el sistema nunca debe permitir.', obt: 'Los primeros tests que vale la pena escribir, sacados del negocio y no de tu código.' },
    { a: 'En una revisión de código', q: 'Si este test falla, ¿su nombre me dice qué regla se rompió?', obt: 'Mejorar nombres de tests que no explican nada.' }
  ],
  evita: { q: '¿Cuántos tests tengo que escribir?', por: 'El número no importa. Pregunta qué reglas son críticas y asegúrate de que cada una tiene su test.' }
},

'w13d2': {
  sirve: 'Decidir qué testear es invertir el tiempo donde un fallo cuesta más: reglas de negocio, cálculos de dinero, permisos. En el trabajo nunca hay tiempo para testearlo todo.',
  importa: 'Los equipos que persiguen el 100 % de cobertura acaban con tests frágiles de getters que se rompen con cada cambio. Los que no testean nada viven con miedo. El criterio económico es lo que da confianza sin frenar.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué error del sistema te costaría más dinero o un problema más serio?', obt: 'Las zonas de mayor riesgo, que deben tener más tests.' },
    { a: 'Al tech lead', q: '¿Qué bugs han llegado a producción este año? ¿Habría un test que los hubiera atrapado?', obt: 'Evidencia real de dónde faltan tests.' },
    { a: 'A QA', q: '¿Qué pruebas manuales repites en cada entrega?', obt: 'Candidatas a automatizar porque se hacen siempre.' }
  ],
  evita: { q: '¿Qué cobertura mínima necesitamos?', por: 'La cobertura mide líneas ejecutadas, no reglas probadas. Pregunta qué fallos serían más graves y si están cubiertos.' }
},

'w13d3': {
  sirve: 'Los dobles de prueba (stub, fake, mock, spy) sustituyen dependencias externas para probar una clase sola. Elegir el adecuado mantiene los tests rápidos y fáciles de mantener.',
  importa: 'Abusar de mocks produce tests que comprueban cómo está escrito el código y no qué hace: cualquier refactor los rompe aunque el comportamiento sea el mismo. Elegir bien el doble es lo que hace que los tests ayuden en vez de estorbar.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Preferimos fakes escritos a mano o una librería de mocks?', obt: 'El estilo del equipo y por qué.' },
    { a: 'En una revisión de código', q: '¿Este test comprueba el resultado o solo que se llamó a un método?', obt: 'Detectar tests acoplados a la implementación.' },
    { a: 'A un compañero', q: '¿Tenemos un fake del repositorio en memoria que pueda reutilizar?', obt: 'Herramientas de test ya hechas que ahorran tiempo.' }
  ],
  evita: { q: '¿Mockeo todo?', por: 'Mockear todo prueba muy poco. Pregunta qué dependencias son lentas o externas; solo esas necesitan doble.' }
},

'w13d4': {
  sirve: 'TDD es escribir el test antes que el código, en ciclos cortos. Sirve especialmente con reglas complejas (calendario de vacunas, cálculo de precios) donde el diseño no está claro al principio.',
  importa: 'TDD obliga a pensar en el uso antes que en la implementación, y deja el código con tests desde el primer minuto. Además, en entrevistas es habitual que te pidan resolver un ejercicio con TDD.',
  preguntas: [
    { a: 'Al veterinario', q: 'Dame ejemplos concretos: un cachorro de 8 semanas, ¿qué vacunas le tocan y cuándo?', obt: 'Ejemplos reales que se convierten directamente en los primeros tests.' },
    { a: 'Al tech lead', q: '¿En qué partes del proyecto el equipo usa TDD y en cuáles no?', obt: 'Dónde aporta valor según la experiencia del equipo.' },
    { a: 'A un compañero', q: '¿Hacemos una sesión de pair programming con TDD en esta funcionalidad?', obt: 'Práctica guiada con alguien que ya domina el ciclo.' }
  ],
  evita: { q: '¿TDD sirve para todo?', por: 'No, y el debate abstracto no lleva a nada. Pregunta si la regla que vas a escribir tiene casos claros que se puedan expresar como ejemplos.' }
},

'w13d5': {
  sirve: 'Los tests de integración prueban la API completa con una base de datos real (por ejemplo con Testcontainers). Detectan errores que los unitarios no ven: mapeos, constraints, serialización.',
  importa: 'Muchos fallos reales están en las costuras: el JSON que no deserializa, la constraint que rechaza, la consulta mal mapeada. Los tests unitarios con mocks no los ven nunca; los de integración sí.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Los tests de integración usan una base real en contenedor o una en memoria?', obt: 'La práctica del equipo y sus motivos; la base en memoria no se comporta igual que PostgreSQL.' },
    { a: 'Al equipo de infraestructura', q: '¿El servidor de CI puede levantar contenedores Docker?', obt: 'Si los tests con Testcontainers pueden correr en el pipeline.' },
    { a: 'A QA', q: '¿Qué flujos de la API pruebas a mano que podríamos automatizar?', obt: 'Los escenarios de integración más valiosos.' }
  ],
  evita: { q: '¿Uso la base en memoria de EF para que sea más rápido?', por: 'No se comporta como PostgreSQL y los tests pasan con bugs reales. Pregunta qué diferencias de comportamiento te pueden afectar.' }
},

'w13d6': {
  sirve: 'Una suite rápida y fiable es la que el equipo ejecuta antes de cada commit sin quejarse. Saber defender cada decisión de testing es parte de cualquier entrevista seria.',
  importa: 'Una suite lenta deja de ejecutarse; una suite con tests que fallan al azar deja de creerse. En ambos casos es como no tener tests, pero con el coste de mantenerlos.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Cuánto tarda la suite completa? ¿Cuál es el máximo aceptable?', obt: 'Un objetivo de velocidad para la suite.' },
    { a: 'Al equipo', q: '¿Hay tests que fallan a veces sin motivo? ¿Cuáles?', obt: 'La lista de tests inestables que destruyen la confianza en la suite.' },
    { a: 'Al tech lead', q: '¿Qué tendría que pasar para que confíes en desplegar solo porque los tests pasan?', obt: 'La meta de confianza real de la suite.' }
  ],
  evita: { q: '¿Desactivo el test que falla a veces?', por: 'Lo escondes, no lo arreglas. Pregunta por qué falla: casi siempre es tiempo, orden o datos compartidos.' }
},

/* ---------- Semana 14 · Resiliencia ---------- */

'w14d1': {
  sirve: 'Un timeout en cada llamada externa (base de datos, SMS, email, otra API) evita que una dependencia lenta deje tus hilos esperando para siempre.',
  importa: 'Sin timeouts, un proveedor de SMS lento puede tumbar toda la API: cada petición se queda esperando, se agotan los hilos y deja de responder hasta la agenda. Es la causa de muchos incidentes en cascada.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué timeout tienen hoy nuestras llamadas HTTP y a la base de datos?', obt: 'Los valores actuales (que a veces son de 100 segundos por defecto) y si son razonables.' },
    { a: 'Al proveedor externo o su documentación', q: '¿Cuál es vuestro tiempo de respuesta normal y el percentil 99?', obt: 'Datos para fijar un timeout que no corte llamadas normales.' },
    { a: 'Al equipo de frontend', q: '¿Cuánto espera el usuario antes de que la pantalla dé un error?', obt: 'El presupuesto de tiempo total, que limita los timeouts del backend.' }
  ],
  evita: { q: '¿Pongo un timeout muy alto para que no falle?', por: 'Un timeout muy alto no protege de nada. Pregunta cuánto tarda normalmente la llamada y cuánto puede esperar el usuario.' }
},

'w14d2': {
  sirve: 'Reintentar con espera creciente y aleatoria recupera fallos pasajeros (un corte de red, un 503) sin saturar al servicio que ya está sufriendo.',
  importa: 'Reintentar de inmediato y muchas veces multiplica la carga justo cuando el servicio está peor: es la forma más rápida de convertir un problema pequeño en una caída total. Y reintentar errores que no son pasajeros (un 400) solo gasta recursos.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué errores consideramos pasajeros y cuáles definitivos?', obt: 'La lista de códigos y excepciones que merecen reintento.' },
    { a: 'Al proveedor externo', q: '¿Mandáis cabecera Retry-After cuando estáis saturados?', obt: 'Si debes respetar el tiempo que pide el servicio.' },
    { a: 'En una revisión de código', q: '¿Esta operación es segura de repetir? Si no, ¿por qué se reintenta?', obt: 'Evitar reintentos que duplican cobros o mensajes.' }
  ],
  evita: { q: '¿Reintento 10 veces para asegurar?', por: 'Diez reintentos sin espera pueden ser un ataque contra tu propio proveedor. Pregunta qué errores son pasajeros y cuánto tardan en recuperarse.' }
},

'w14d3': {
  sirve: 'Un circuit breaker deja de llamar a un servicio caído durante un tiempo y responde rápido con un fallo controlado. Protege tu sistema y le da respiro al otro.',
  importa: 'Insistir contra un servicio caído gasta tiempo en cada petición y retrasa su recuperación. El circuito abierto convierte segundos de espera en una respuesta inmediata y un plan B.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué porcentaje de errores debe abrir el circuito y cuánto tiempo se queda abierto?', obt: 'Los parámetros iniciales, que luego se ajustan con datos reales.' },
    { a: 'Al dueño de la clínica', q: 'Si el envío de recordatorios falla una hora, ¿qué prefieres: que se reintenten luego o avisar a la recepcionista?', obt: 'Qué hace el sistema cuando el circuito está abierto.' },
    { a: 'Al equipo de observabilidad', q: '¿Recibimos una alerta cuando se abre un circuito?', obt: 'Si el equipo se entera de que una dependencia está caída.' }
  ],
  evita: { q: '¿Pongo un circuit breaker en todas las llamadas?', por: 'No todas lo necesitan. Pregunta qué dependencias externas pueden caerse y cuánto daño hace esperarlas.' }
},

'w14d4': {
  sirve: 'La idempotencia operacional asegura que repetir una escritura no la duplique. El patrón outbox garantiza que si se guarda una cita, el aviso por email se envíe sí o sí, aunque falle en el primer intento.',
  importa: 'Sin outbox, hay dos errores posibles: guardar la cita y perder el email, o mandar el email y que la cita no se guarde. Los dos llegan al cliente y destruyen la confianza en el sistema.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué operaciones guardan en la base y además llaman a algo externo?', obt: 'Las candidatas a usar outbox.' },
    { a: 'Al dueño de la clínica', q: '¿Es peor que un cliente reciba dos recordatorios o que no reciba ninguno?', obt: 'Si el envío debe ser al menos una vez o como mucho una vez, una decisión de negocio.' },
    { a: 'Al equipo de infraestructura', q: '¿Quién procesa la tabla outbox y qué pasa si ese proceso se cae?', obt: 'La operación real del patrón en producción.' }
  ],
  evita: { q: '¿Envío el email justo después de guardar y listo?', por: 'Funciona hasta que falla una de las dos cosas. Pregunta qué pasa si el email falla después de guardar.' }
},

'w14d5': {
  sirve: 'Degradar con elegancia es decidir qué hace el sistema cuando una dependencia no está: mostrar la agenda sin el tiempo de espera, guardar la cita y avisar luego, etc.',
  importa: 'Un 500 genérico deja al usuario sin nada. Una degradación pensada mantiene la operación principal (dar citas) aunque fallen las secundarias (recordatorios). Es la diferencia entre "el sistema va un poco limitado" y "el sistema está caído".',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué es lo único que no puede dejar de funcionar nunca, aunque fallen otras cosas?', obt: 'La función crítica que se protege por encima de todo.' },
    { a: 'A la recepcionista', q: 'Si el sistema no puede mandar recordatorios, ¿prefieres que te avise para llamar tú?', obt: 'El plan B humano para cada degradación.' },
    { a: 'Al tech lead', q: '¿Qué dependencias son críticas y cuáles opcionales para cada pantalla?', obt: 'El mapa de dependencias por funcionalidad.' }
  ],
  evita: { q: '¿Qué hago si falla todo?', por: 'Demasiado general. Pregunta, dependencia por dependencia, qué pasa si falla esa sola.' }
},

'w14d6': {
  sirve: 'Romper el sistema a propósito (apagar la base, ralentizar el SMS) confirma que las defensas funcionan como dijiste. Es lo que hacen los equipos maduros antes de que lo haga la realidad.',
  importa: 'Una defensa de resiliencia que nunca se ha probado es una suposición. El caos controlado convierte "creo que aguanta" en "comprobé que aguanta", y ese es el argumento que convence en una revisión o una entrevista.',
  preguntas: [
    { a: 'Al tech lead', q: '¿En qué entorno podemos romper cosas sin afectar a nadie?', obt: 'El sitio seguro para los experimentos.' },
    { a: 'Al equipo de infraestructura', q: '¿Qué fallos han ocurrido en producción el último año?', obt: 'Los escenarios de caos más realistas para probar primero.' },
    { a: 'Al tech lead', q: '¿Qué resultado del experimento te haría dudar de desplegar?', obt: 'El criterio de éxito antes de empezar, no después.' }
  ],
  evita: { q: '¿Apago la base a ver qué pasa?', por: 'Sin hipótesis no aprendes nada. Escribe antes qué esperas que pase y luego compruébalo.' }
},

/* ---------- Semana 15 · Arquitectura ---------- */

'w15d1': {
  sirve: 'Las capas solo funcionan si las dependencias van en una dirección: la API depende del dominio, nunca al revés. En el trabajo lo compruebas mirando las referencias entre proyectos.',
  importa: 'Unas carpetas llamadas Domain e Infrastructure no son arquitectura si el dominio importa EF Core. Cuando la flecha va al revés, cambiar la base de datos obliga a reescribir las reglas de negocio.',
  preguntas: [
    { a: 'Al arquitecto', q: '¿Tenemos algún test o regla que impida que el dominio dependa de infraestructura?', obt: 'Si la regla de dependencias está automatizada o depende de la buena voluntad.' },
    { a: 'Al tech lead', q: '¿Qué proyecto referencia a qué otro hoy?', obt: 'El grafo real de dependencias para compararlo con el dibujo.' },
    { a: 'En una revisión de código', q: '¿Por qué este using de infraestructura está en una clase del dominio?', obt: 'Detectar la flecha al revés antes de que se asiente.' }
  ],
  evita: { q: '¿Cuántas capas tenemos que tener?', por: 'El número no importa. Pregunta en qué dirección van las dependencias y si se cumple siempre.' }
},

'w15d2': {
  sirve: 'La arquitectura hexagonal pone el dominio en el centro y trata la base de datos, la API HTTP y los servicios externos como adaptadores intercambiables.',
  importa: 'Con el dominio aislado puedes probar toda la lógica sin servidor ni base, y cambiar de framework web sin tocar el negocio. Es la arquitectura que más se pregunta en entrevistas de backend.',
  preguntas: [
    { a: 'Al arquitecto', q: '¿Qué puertos de entrada y de salida tiene la aplicación?', obt: 'El mapa de puertos y adaptadores real del sistema.' },
    { a: 'Al tech lead', q: '¿Dónde viven los casos de uso: en la API o en una capa de aplicación?', obt: 'La convención del equipo para orquestar el dominio.' },
    { a: 'En una revisión de código', q: '¿Este caso de uso funcionaría igual si lo llamamos desde una consola en vez de HTTP?', obt: 'La prueba de que la lógica no depende del adaptador de entrada.' }
  ],
  evita: { q: '¿Pasamos todo el proyecto a hexagonal?', por: 'Es una reescritura arriesgada. Pregunta qué problema concreto resuelve y empieza por un módulo.' }
},

'w15d3': {
  sirve: 'CQRS ligero separa leer de escribir: las escrituras pasan por el dominio y sus reglas, las lecturas van directas a consultas optimizadas.',
  importa: 'Cargar agregados completos solo para mostrar una lista es lento y complica el dominio. Separar los dos caminos hace las lecturas rápidas y deja las escrituras protegidas.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué pantallas leen mucho y no modifican nada?', obt: 'Las candidatas a consultas directas sin pasar por el dominio.' },
    { a: 'Al equipo de frontend', q: '¿Qué datos combinados necesita la pantalla de agenda en una sola llamada?', obt: 'El modelo de lectura ideal para esa pantalla.' },
    { a: 'Al arquitecto', q: '¿Necesitamos bases separadas para leer y escribir o basta con consultas distintas?', obt: 'El nivel justo de CQRS sin sobrediseñar.' }
  ],
  evita: { q: '¿Implementamos CQRS con event sourcing?', por: 'Es mucho más de lo que hace falta casi siempre. Pregunta qué problema tienen hoy las lecturas.' }
},

'w15d4': {
  sirve: 'Los eventos de dominio anuncian lo que pasó ("CitaCancelada") para que otras partes reaccionen (liberar hueco, avisar al cliente) sin que la cita las conozca.',
  importa: 'Sin eventos, la clase Cita acaba llamando a notificaciones, facturación y estadísticas, y cada nueva reacción la hace más grande. Con eventos, añadir una reacción es añadir un manejador, sin tocar el dominio.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: 'Cuando se cancela una cita, ¿quién tiene que enterarse y qué hace cada uno?', obt: 'Los manejadores del evento, sacados del negocio.' },
    { a: 'Al tech lead', q: '¿Los eventos se despachan antes o después de confirmar la transacción?', obt: 'La regla que evita avisar de algo que al final no se guardó.' },
    { a: 'En una revisión de código', q: '¿Este evento describe algo que ya pasó o una orden?', obt: 'Nombrar eventos en pasado y distinguirlos de comandos.' }
  ],
  evita: { q: '¿Uso eventos para todo?', por: 'El flujo se vuelve difícil de seguir. Pregunta qué reacciones son secundarias y pueden ocurrir sin que el emisor lo sepa.' }
},

'w15d5': {
  sirve: 'Dividir el sistema en módulos por capacidad de negocio (agenda, historial clínico, facturación) con fronteras claras es la base para que varios equipos trabajen sin pisarse.',
  importa: 'Un monolito sin módulos se convierte en una bola de barro donde todo depende de todo. Un monolito modular bien hecho es más fácil de mantener que muchos microservicios mal hechos, y se puede dividir más adelante si hace falta.',
  preguntas: [
    { a: 'Al dueño de la clínica', q: '¿Qué áreas de la clínica funcionan de forma bastante independiente?', obt: 'Las capacidades de negocio que marcan las fronteras de módulo.' },
    { a: 'Al arquitecto', q: '¿Cómo se comunican los módulos: llamadas directas a una interfaz pública o eventos?', obt: 'Las reglas de comunicación entre módulos.' },
    { a: 'Al tech lead', q: '¿Algún módulo lee directamente las tablas de otro?', obt: 'Fugas de frontera que acoplan los módulos por la base de datos.' }
  ],
  evita: { q: '¿Lo pasamos a microservicios?', por: 'Es la solución antes de entender el problema. Pregunta si las fronteras entre módulos están claras dentro del monolito primero.' }
},

'w15d6': {
  sirve: 'Los ADR (Architecture Decision Records) dejan escrito qué se decidió, por qué y qué alternativas se descartaron. Son la memoria del equipo cuando la gente cambia.',
  importa: 'Dentro de un año alguien preguntará "¿por qué se hizo así?" y sin ADR nadie lo sabrá, o se deshará una buena decisión por desconocimiento. Defender decisiones con alternativas es lo que se espera de un arquitecto.',
  preguntas: [
    { a: 'Al tech lead', q: '¿Qué decisiones de arquitectura se han discutido más de una vez?', obt: 'Las que más necesitan un ADR para cerrar el debate.' },
    { a: 'Al arquitecto', q: '¿Qué alternativa estuvo a punto de elegirse y por qué no?', obt: 'La alternativa descartada, la parte más valiosa del ADR.' },
    { a: 'A un compañero nuevo', q: '¿Qué decisión del proyecto no entendiste al llegar?', obt: 'Decisiones que necesitan documentarse con urgencia.' }
  ],
  evita: { q: '¿Documento todas las decisiones?', por: 'Se vuelve burocracia. Pregunta qué decisiones son difíciles de revertir o generan debate; esas llevan ADR.' }
},

/* ---------- Semana 16 · React y TypeScript ---------- */

'w16d1': {
  sirve: 'Componentes tipados con TypeScript son la unidad básica de cualquier frontend React moderno. Los tipos de las props documentan cómo se usa cada componente y evitan errores al llamarlo.',
  importa: 'Sin tipos, un cambio en un componente rompe en silencio todas las pantallas que lo usan y lo descubre el usuario. Con tipos, lo descubre el compilador antes del commit.',
  preguntas: [
    { a: 'Al tech lead de frontend', q: '¿Tenemos una librería de componentes base o un sistema de diseño?', obt: 'Componentes ya hechos que debes reutilizar en vez de crear otros.' },
    { a: 'Al diseñador', q: '¿Qué variantes tiene este componente: tamaños, estados, colores?', obt: 'Las props que necesita el componente, decididas por el diseño.' },
    { a: 'En una revisión de código', q: '¿Por qué esta prop es de tipo any?', obt: 'Cerrar huecos de tipado que anulan la ventaja de TypeScript.' }
  ],
  evita: { q: '¿Hago un componente para cada pantalla?', por: 'Pregunta qué piezas se repiten entre pantallas; esas son los componentes reutilizables.' }
},

'w16d2': {
  sirve: 'Decidir qué es estado (lo que cambia y no se puede calcular) y qué no lo es evita la mitad de los bugs de React. El estado duplicado se desincroniza.',
  importa: 'Guardar en estado algo que se puede calcular (el total de citas, la lista filtrada) obliga a mantener dos cosas sincronizadas, y siempre se olvida una. Es el error de principiante más común en React.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Qué filtros y opciones cambias en la agenda durante el día?', obt: 'Lo que de verdad es estado de la pantalla.' },
    { a: 'En una revisión de código', q: '¿Este estado se puede calcular a partir de otro?', obt: 'Eliminar estado duplicado y derivarlo en el render.' },
    { a: 'Al tech lead de frontend', q: '¿Usamos algún gestor de estado global o solo useState y contexto?', obt: 'La herramienta del equipo y cuándo se usa.' }
  ],
  evita: { q: '¿Meto todo en un estado global?', por: 'Complica sin necesidad. Pregunta quién usa cada dato; si solo lo usa un componente, el estado es local.' }
},

'w16d3': {
  sirve: 'Levantar el estado al antepasado común correcto permite que dos componentes compartan datos sin duplicarlos. Los componentes controlados reciben su valor y avisan de cambios.',
  importa: 'Un estado en el nivel equivocado obliga a sincronizar componentes con efectos o hace que todo el árbol se vuelva a pintar. Ponerlo en su sitio deja el código simple y predecible.',
  preguntas: [
    { a: 'Al diseñador', q: 'Si selecciono un veterinario en el panel lateral, ¿qué otras partes de la pantalla deben cambiar?', obt: 'Qué componentes comparten estado y dónde debe vivir.' },
    { a: 'En una revisión de código', q: '¿Por qué este componente hijo tiene su propia copia del valor que le pasa el padre?', obt: 'Detectar estado duplicado entre padre e hijo.' },
    { a: 'Al tech lead de frontend', q: '¿A partir de cuántos niveles de props preferimos un contexto?', obt: 'El criterio del equipo para evitar pasar props por demasiados niveles.' }
  ],
  evita: { q: '¿Cómo sincronizo el estado de dos componentes?', por: 'No se sincronizan, se comparte. Pregunta cuál es su antepasado común y sube el estado allí.' }
},

'w16d4': {
  sirve: 'useEffect sirve para sincronizar con sistemas externos (suscripciones, temporizadores, APIs del navegador). Casi todo lo demás se resuelve sin efectos.',
  importa: 'Los efectos innecesarios causan renders dobles, bucles infinitos y datos parpadeando. La documentación oficial de React dedica una página entera a "probablemente no necesitas un efecto" porque es el error más extendido.',
  preguntas: [
    { a: 'En una revisión de código', q: '¿Este efecto sincroniza con algo externo o calcula algo a partir de props?', obt: 'Si el efecto sobra y puede ser un cálculo en el render.' },
    { a: 'Al tech lead de frontend', q: '¿Cómo cargamos datos del servidor: efectos a mano o una librería?', obt: 'La convención del equipo, que normalmente evita efectos a mano.' },
    { a: 'A un compañero', q: '¿Este efecto limpia lo que crea cuando el componente se desmonta?', obt: 'Detectar fugas de suscripciones o temporizadores.' }
  ],
  evita: { q: '¿Pongo un useEffect para actualizar este estado cuando cambia la prop?', por: 'Casi siempre sobra. Pregunta si el valor se puede calcular directamente a partir de la prop.' }
},

'w16d5': {
  sirve: 'Un formulario completo valida en el cliente, muestra el estado de envío y traduce los errores que devuelve la API a mensajes junto al campo correcto.',
  importa: 'Los formularios son donde el usuario más se frustra. Un error genérico "algo salió mal" tras rellenar diez campos hace que abandone o llame por teléfono. Traducir bien los errores del servidor es lo que cierra el ciclo.',
  preguntas: [
    { a: 'A la recepcionista', q: '¿Qué datos rellenas con prisa y en qué orden al dar una cita por teléfono?', obt: 'El orden de los campos y cuáles deben ser rápidos de rellenar.' },
    { a: 'Al equipo de backend', q: '¿Qué formato tienen los errores de validación de la API? ¿Indican el campo?', obt: 'Cómo asociar cada error del servidor a su campo.' },
    { a: 'Al diseñador', q: '¿Dónde y cuándo se muestran los errores: al escribir, al salir del campo o al enviar?', obt: 'El comportamiento de validación acordado con diseño.' }
  ],
  evita: { q: '¿Valido solo en el backend?', por: 'El usuario espera saber el error al momento. Pregunta qué validaciones puede hacer el cliente y cuáles solo el servidor.' }
},

'w16d6': {
  sirve: 'Integrar una pantalla completa contra la API real y revisarla con criterios de calidad (accesibilidad, estados vacíos, errores, carga) es lo que la deja lista para usuarios reales.',
  importa: 'Una pantalla que solo funciona con datos perfectos falla el primer día. Los estados de carga, vacío y error son la mitad del trabajo de frontend y lo que el usuario percibe como calidad.',
  preguntas: [
    { a: 'A la recepcionista', q: 'Usa la agenda diez minutos como si fuera un día normal. ¿Qué te molesta?', obt: 'Problemas de uso reales que no se ven programando.' },
    { a: 'Al diseñador', q: '¿Cómo deben verse la agenda vacía, la que carga y la que falla?', obt: 'Diseño de los estados que normalmente se olvidan.' },
    { a: 'Al tech lead de frontend', q: '¿Qué criterios revisas antes de aprobar una pantalla?', obt: 'La lista de control del equipo para frontend.' }
  ],
  evita: { q: '¿Te gusta cómo quedó?', por: 'La opinión estética no valida nada. Pide que la usen con una tarea real y observa dónde se atascan.' }
}

});
