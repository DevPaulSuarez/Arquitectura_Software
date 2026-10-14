/* Una pista por cada paso de «Hazlo tú»: cómo empezar, un ejemplo y cómo saber que está bien.
   Clave: w<semana>d<día>; el orden coincide con days[].steps. */
window.PISTAS = Object.assign(window.PISTAS || {}, {

/* ---------- Semana 1 ---------- */

'w1d1': [
  'Usa esta plantilla: «[Quién] pierde/sufre [qué] porque [causa actual]». Ejemplo: «Las clínicas veterinarias pequeñas pierden citas y olvidan vacunas porque lo apuntan todo en un cuaderno». Comprueba: cuenta las palabras (máximo 25) y busca palabras prohibidas como app, web, sistema, base de datos o C#.',
  'Cada hecho debe llevar un número o algo observable. Piensa en: personal (cuántos veterinarios y recepcionistas), volumen (mascotas atendidas, citas al día), cómo se trabaja hoy (cuaderno, teléfono) y qué sale mal (citas perdidas por semana). Mal: «tienen muchos clientes». Bien: «atienden unas 600 mascotas».',
  'Piensa en cosas que alguien podría pedir más adelante y que no vas a construir ahora: facturación, app para dueños, inventario, tienda online, varias sedes. Escríbelas como «VetCare no va a…». Comprueba: cada no-objetivo debe ser algo razonable que alguien podría esperar; «no va a pilotar aviones» no sirve.'
],

'w1d2': [
  'Haz una tabla con tres columnas: Quién | Qué quiere | Qué teme. Empieza por quien usa el sistema cada día (recepcionista, veterinario), luego quien paga (dueño de la clínica) y luego quien recibe el efecto sin usarlo (dueño de la mascota). Escribe deseos y miedos concretos: «ver el historial en 10 segundos», no «que sea fácil».',
  'Pregúntate: si esta persona dice «no lo quiero», ¿se cancela el proyecto? Casi siempre es quien paga, el dueño de la clínica. Pon ★ junto a su nombre y añade una línea explicando por qué tiene ese poder.',
  'Compara la columna «qué quiere» de una persona con la columna «qué teme» de otra. Ejemplo: el dueño de la clínica quiere mandar recordatorios y el dueño de la mascota teme el spam. Escribe la decisión: «máximo 1 recordatorio por cita, 24 h antes, y el cliente puede darse de baja».'
],

'w1d3': [
  'Formato: «RF-01 · Como [rol], quiero [acción concreta] para [beneficio]». Recorre un día de la clínica: registrar dueño, registrar mascota, dar cita, cancelarla, ver la agenda del día, registrar consulta, registrar vacuna, ver vacunas pendientes, buscar mascota, ver historial. Con eso ya tienes 10.',
  'Pregúntate qué entrada haría que el sistema diga que no. Ejemplos: «el sistema rechaza la cita si el veterinario ya tiene otra a esa hora», «rechaza registrar una mascota sin dueño», «la búsqueda devuelve como máximo 50 resultados». Cada RF necesita al menos una línea «Rechaza si…».',
  'Imagina el test: «dado X, cuando hago Y, espero Z». Si no sabes qué Z escribir, el requisito es vago. Mal: «gestionar la agenda» (¿qué espero ver?). Bien: «ver las citas del día ordenadas por hora con el nombre de la mascota». Reescribe hasta que cada RF tenga un resultado comprobable.'
],

'w1d4': [
  'Usa estas categorías como lista de control: rendimiento (tiempo de respuesta), disponibilidad (horas al día, caída máxima), seguridad (quién accede, contraseñas), datos (copias, retención), usabilidad (clics por tarea) y capacidad (mascotas, usuarios simultáneos). Una RNF por categoría te da las 6.',
  'Sustituye cada adjetivo por una medida: «rápido» → «la agenda carga en menos de 1 s con 50 citas»; «seguro» → «las contraseñas se guardan con hash, nunca en texto»; «disponible» → «funciona de 8:00 a 20:00 de lunes a sábado; caída máxima de 30 minutos». Comprueba: si no puedes medirla con un reloj o un número, reescríbela.',
  'Para cada RNF escribe «→ obliga a…». Ejemplos: «menos de 1 s» → índices en la tabla de citas; «copias diarias» → tarea programada de backup; «datos personales» → HTTPS y control de acceso. Si una RNF no obliga a ninguna decisión, probablemente es demasiado obvia o demasiado vaga.'
],

'w1d5': [
  'Las reglas son políticas de la clínica, no funciones del sistema. Busca frases con «siempre», «nunca», «no se puede», «como mínimo» o «si… entonces…». Ejemplos: «una mascota solo puede tener un dueño responsable», «no se vacuna antes de las 8 semanas», «una cita dura 30 minutos», «cancelar con menos de 24 h se cobra».',
  'Imagina la clínica en 1990, sin ordenador. Si la regla seguía existiendo («no vacunar antes de 8 semanas»), es regla de negocio. Si solo existe por el software («la contraseña debe tener 8 caracteres»), no lo es: es un requisito de seguridad. Tacha las que no pasen la prueba y busca otras.',
  'Pregúntate si la regla depende de una decisión del dueño (precio, duración de la cita, plazo de cancelación) o de algo estable (biología, leyes). Las de decisión cambian: márcalas con «⚙ configurable». Las estables pueden ir fijas en el código.'
],

'w1d6': [
  'Elige los 5 RF más importantes. Para cada uno: un escenario feliz y otro de rechazo (usa la condición «Rechaza si…» del día 3). Formato: «Dado que el Dr. Pérez tiene cita el lunes a las 10:00 / Cuando agendo otra a las 10:00 con el mismo veterinario / Entonces el sistema la rechaza con el mensaje "horario ocupado"». Usa datos concretos, no «un veterinario».',
  'Cuenta los «Cuando» de cada escenario. Si hay dos acciones («cuando agendo y cancelo»), son dos escenarios. Los «Dado» y los «Entonces» pueden tener varias líneas con «Y», pero la acción probada es una sola.',
  'Ponte un temporizador de 3 minutos y grábate con el móvil. Estructura: 1) el problema en una frase, 2) para quién (stakeholders), 3) qué hará la v1, 4) cómo sabrás que funciona (una medida). Escúchate: si dudaste o te faltó algo, repítelo hasta que salga fluido.'
],

/* ---------- Semana 2 ---------- */

'w2d1': [
  'Las preguntas sobre hechos pasados empiezan por «cuéntame la última vez que…», «¿qué pasó cuando…?», «¿cuántas veces el mes pasado…?». Reparte las 12 preguntas por temas: día típico, citas, vacunas, problemas recientes, personal y qué sería un éxito. Evita «¿te gustaría…?»: eso es pedir deseos.',
  'Busca preguntas que empiecen por «¿quieres…?», «¿te parece…?», «¿es…?» o «¿necesitas…?». Conviértelas en abiertas con «cómo», «qué», «cuándo» o «cuéntame». Ejemplo: «¿Necesitas recordatorios?» → «¿Qué pasa hoy cuando un cliente olvida su cita?».',
  'Responde como un dueño real, que no tiene las ideas claras: exagera un poco, se contradice («casi nunca se pierden citas»… y luego «la semana pasada fallaron cuatro»). Al final escribe 3 descubrimientos que no estaban en tu requirements.md. Si no encuentras ninguno, tus respuestas fueron demasiado obedientes.'
],

'w2d2': [
  'Busca estas palabras en el documento: rápido, fácil, normalmente, a veces, varios, muchos, etc., adecuado, gestionar, los clientes, el sistema, cualquier, siempre. Márcalas en negrita o con un comentario. Si encuentras menos de 10, léelo en voz alta: las vaguedades se oyen mejor de lo que se ven.',
  'Para cada palabra decide: si sabes el número, sustitúyela («varios veterinarios» → «2 veterinarios»). Si lo das por hecho sin confirmarlo, escribe «S-01: asumimos que la clínica tiene una sola sede». Si no lo sabes y es importante, escribe «P-01: ¿los dueños pueden tener más de una mascota con el mismo nombre?».',
  'Para cada pregunta, imagina que la respuesta es la contraria de lo que crees y estima cuánto trabajo habría que rehacer. «¿Hay varias sedes?» (un sí cambia el modelo entero → riesgo alto) frente a «¿la cita dura 30 o 20 min?» (cambiar un número → bajo). Ordena de mayor a menor riesgo.'
],

'w2d3': [
  'Must: sin esto la v1 no resuelve el problema del día 1. Should: importante, pero hay un apaño manual. Could: estaría bien. Won\'t: no entra en esta versión (no significa nunca). Para cada RF pregúntate: ¿la clínica puede usar la v1 sin esto? Si la respuesta es sí, no es Must.',
  'Ponle a cada RF una talla: S = 1 punto, M = 3, L = 5. Suma los Must y divide entre el total. Si pasa del 60 %, baja a Should lo que tenga apaño manual («ver estadísticas»: el dueño puede contar a mano un mes más). Te dolerá: es la idea.',
  'Plantilla: «La v1 de VetCare permite a [quién] [hacer los Must] para [resolver el problema], sin [lo más importante que queda fuera]». Comprueba: cada parte de la frase debe corresponder a un Must; si mencionas algo que es Should, sobra.'
],

'w2d4': [
  'Estructura: nombre, actor principal, precondición, flujo principal numerado (actor hace → sistema responde), flujos alternativos, postcondición. Elige 3 Must con varios pasos: agendar cita, registrar consulta, registrar vacuna. El flujo principal debe tener entre 5 y 9 pasos.',
  'En cada paso del flujo principal pregúntate: ¿y si no? «El sistema muestra los huecos libres» → ¿y si no hay huecos? «El actor elige la mascota» → ¿y si no está registrada? «El sistema guarda» → ¿y si otra persona tomó ese hueco al mismo tiempo? Numera como 3a, 5a, 5b para indicar en qué paso nacen.',
  'Para cada flujo alternativo escribe cómo queda el sistema al terminar. Ejemplo: si la cita falla al guardarse, ¿quedó el hueco reservado a medias? Si no puedes contestar «nada cambió» o «quedó X completo», hay un hueco de diseño: anótalo como pregunta en assumptions.md.'
],

'w2d5': [
  'Una historia = una acción de un usuario con un beneficio. Mal: «Como usuario quiero gestionar citas». Bien: «Como recepcionista quiero ver los huecos libres de un veterinario en un día para agendar sin llamar a nadie». Si un Must contiene «y» o «gestionar», probablemente son varias historias.',
  'Haz una tabla con la historia y las letras I N V E S T, y pon ✓ o ✗: Independiente (¿se puede hacer sola?), Negociable (¿no impone ya la solución?), Valiosa (¿alguien la nota?), Estimable (¿sabes más o menos cuánto cuesta?), Small/pequeña (¿cabe en 3 días?), Testable (¿tiene criterios de aceptación?).',
  'Si falla Small, pártela por flujo (camino feliz primero, alternativos después), por tipo de dato o por regla. Si falla Independiente, junta las dos historias o cambia el orden. Si falla Testable, añade 2 o 3 criterios Dado/Cuando/Entonces. Repite hasta tener todo con ✓.'
],

'w2d6': [
  'Secciones típicas: 1 Problema, 2 Stakeholders, 3 Alcance v1 y no-objetivos, 4 Requisitos funcionales, 5 No funcionales, 6 Reglas de negocio, 7 Casos de uso, 8 Historias y criterios, 9 Supuestos y preguntas abiertas, 10 Glosario. Copia lo que ya tienes y escribe solo los textos de unión. No reescribas desde cero.',
  'Elige palabras que alguien de fuera podría entender mal: cita, consulta, tratamiento, vacuna aplicada, refuerzo, dueño o responsable, ficha, urgencia, cancelación tardía. Cada definición debe responder: ¿qué es exactamente y en qué se diferencia del término parecido? Ejemplo: «Consulta: atención realizada; una cita es la reserva previa».',
  'Cronométrate 5 minutos sin mirar nada, y grábate. Al terminar, compara con spec-v1.md: ¿mencionaste el problema con su medida de éxito, al stakeholder con veto, qué entra y qué no en la v1? Lo que olvidaste es lo que todavía no entiendes del todo: vuelve a leerlo.'
],

/* ---------- Semana 3 ---------- */

'w3d1': [
  'Abre spec-v1.md y copia a una lista cada sustantivo: mascota, dueño, cita, veterinario, vacuna, consulta, horario, recepcionista, recordatorio, clínica, especie, raza, peso… No filtres todavía: cuantas más, mejor. Quita solo los duplicados y los sinónimos.',
  'Para cada candidata: si a «Max» le cambia el peso, ¿sigue siendo Max? Sí → tiene identidad, es entidad. Si cambia el peso «5 kg» a «6 kg», ¿es el mismo peso? No, es otro valor → no es entidad, es atributo o value object. Marca E (entidad), A (atributo) o V (valor).',
  'Para cada entidad escribe: «X existe porque necesitamos seguir su historia en el tiempo: …». Ejemplo: «Cita existe porque se crea, se reprograma y se cancela, y hay que saber qué le pasó». En la lista de descartadas, una línea por cada una: «Especie: es un valor de Mascota, no tiene historia propia».'
],

'w3d2': [
  'Tabla por entidad: Atributo | Tipo | Obligatorio | Rango/formato. Usa tipos de negocio, no de base de datos: texto, número entero, decimal, fecha, fecha y hora, sí/no, lista cerrada. Ejemplo: «peso | decimal | sí | 0,05–120 kg, 2 decimales». Revisa los rangos con sentido común: un gato de 300 kg no existe.',
  'Para cada opcional escribe: «Opcional porque…» con una situación real. «Chip: opcional porque muchos gatos de interior no lo tienen» sirve. «Email: opcional por si acaso» no sirve. Si no se te ocurre un caso real, hazlo obligatorio: siempre es más fácil relajar una regla que endurecerla con datos ya guardados.',
  'Pregunta para cada atributo: ¿hay algún caso legítimo de corregirlo? Fecha de nacimiento, especie y fecha de creación de la cita casi nunca cambian: márcalas con 🔒. El peso y el teléfono sí cambian. Si dudas (por ejemplo, la especie mal registrada), anota «corregible solo por veterinario».'
],

'w3d3': [
  'Regla práctica: Guid si los ids aparecen en URLs públicas o se generan en varios sitios (no revela cuántos registros hay y no choca). int/bigint si es interno y quieres ids cortos y legibles. Elige uno por entidad y justifícalo en una frase. Sé coherente: no mezcles sin motivo.',
  'Las entidades se comparan por Id: dos mascotas con el mismo nombre, especie y dueño siguen siendo dos si tienen Ids distintos. Escribe: «Mascota: iguales si Id igual». Si además existe una clave natural única (el chip), anótala aparte como regla de unicidad, no como regla de igualdad.',
  'Busca grupos de atributos que siempre van juntos y que se comparan por lo que valen: dinero (importe + moneda), rango horario (inicio + fin), dirección, peso con unidad, teléfono, email. Si dos «10:00–10:30» son intercambiables, es un valor: no necesita Id.'
],

'w3d4': [
  'Para cada uno haz una ficha: Nombre / Contiene / Reglas / Igualdad. Ejemplo: «RangoHorario / inicio y fin / fin posterior a inicio, duración entre 15 y 120 min, sin cruzar medianoche / iguales si inicio y fin son iguales». Buenas opciones en VetCare: Peso, RangoHorario, Dinero, Email, Telefono.',
  'Escribe la frase «Ahora es imposible tener…». Ejemplos: «…un peso negativo o en gramos donde se esperaban kilos», «…una cita que termina antes de empezar», «…un email sin @». Si no puedes nombrar ningún estado inválido que se elimine, ese value object no aporta: elige otro.',
  'Repasa tu tabla de atributos del día 2 buscando datos con reglas o con más de una parte: decimales con unidad, pares inicio-fin, textos con formato (email, teléfono, chip). Cambia su tipo de «decimal» a «Peso» o de «texto» a «Email» y anota en qué entidades aparece cada uno.'
],

'w3d5': [
  'Sintaxis básica: «DUENO ||--o{ MASCOTA : tiene». || significa exactamente uno, o{ significa cero o muchos, |{ uno o muchos y o| cero o uno. Escribe una línea por relación y pégalo en mermaid.live para verlo. Si el diagrama no se dibuja, revisa los símbolos.',
  'Haz una tabla: Relación | ¿Obligatoria lado A? | ¿Obligatoria lado B? | Al borrar A… | Al borrar B…. Ejemplo: «Dueño–Mascota | un dueño puede no tener mascotas | una mascota siempre tiene dueño | no se permite borrar dueño con mascotas | borrar mascota no afecta al dueño». En la columna de borrado usa reglas de negocio, no términos de SQL.',
  'Revisa cada 1:N preguntando si alguna vez existe el caso contrario: ¿una mascota con dos responsables (pareja separada)? ¿una vacuna aplicada a varias mascotas (lotes)? ¿una consulta con dos veterinarios? Si encuentras un caso real, es N:N. Documenta la intuición inicial y por qué cambió.'
],

'w3d6': [
  'En Mermaid puedes poner atributos dentro de cada entidad: «MASCOTA { uuid id PK; string nombre; date nacimiento; uuid dueno_id FK }». Pon solo los atributos clave (PK, FK y 2 o 3 importantes); si pones todos, no se lee. Comprueba que aparecen todas las entidades del día 1 y todas las relaciones del día 5.',
  'Para cada historia del ejemplo, recorre el diagrama con el dedo: ¿qué tablas tocas y qué datos guardas? Escribe «Soporta» o «No soporta: falta…». Ejemplo: «perro cambia de dueño y hay que conservar el historial»: si la relación no guarda fechas, se pierde quién era el dueño antes.',
  'Para cada fallo escribe: problema → cambio → por qué. Ejemplo: «No sabíamos quién fue dueño antes → nueva tabla Responsabilidad con fecha de inicio y fin → el historial clínico debe saber quién autorizó cada tratamiento». Actualiza el diagrama y vuelve a pasar solo esa historia.'
],

/* ---------- Semana 4 ---------- */

'w4d1': [
  'Regla para 1:N: la FK siempre va en el lado de «muchos» (mascota.dueno_id, no dueno.mascota_ids). Para 1:1: va en la tabla que depende de la otra o que es opcional (ficha_medica.mascota_id con UNIQUE). Escribe «Mascota–Dueño: FK en mascotas, porque un dueño tiene muchas mascotas».',
  'RESTRICT: no dejes borrar el padre si tiene hijos (dueño con mascotas). CASCADE: borra los hijos con el padre (solo si los hijos no tienen sentido solos, como las líneas de una factura). SET NULL: el hijo sobrevive sin padre (la cita conserva el registro si se da de baja a un veterinario, con columna que admite NULL). Ante la duda en datos médicos: RESTRICT.',
  'Plantilla: «CREATE TABLE mascotas ( id uuid PRIMARY KEY, nombre text NOT NULL, dueno_id uuid NOT NULL REFERENCES duenos(id) ON DELETE RESTRICT, … );». Primero crea la tabla padre (duenos) y luego la hija. Pruébalo en PostgreSQL o en un SQL online: si da error de orden, es que la tabla referenciada todavía no existe.'
],

'w4d2': [
  'Busca frases donde los dos lados pueden ser «muchos»: una mascota recibe muchas vacunas y una vacuna se pone a muchas mascotas; un veterinario tiene varias especialidades y una especialidad la tienen varios veterinarios; una consulta usa varios medicamentos. Lista cada par con su nombre de negocio (VacunaAplicada, no mascota_vacuna).',
  'Atributos propios: ¿hay que guardar fecha, lote, dosis o quién la aplicó? Repetición: ¿puede la misma mascota recibir la misma vacuna dos veces (los refuerzos)? Si la respuesta a cualquiera de las dos es sí, la relación tiene vida propia.',
  'Relación pura (veterinario_especialidad): PRIMARY KEY (veterinario_id, especialidad_id), y así se impide el duplicado. Con vida propia (vacunas_aplicadas): id uuid PRIMARY KEY + mascota_id + vacuna_id + fecha + lote, porque la misma pareja se repite en el tiempo. Escribe en un comentario SQL por qué elegiste cada opción.'
],

'w4d3': [
  'Pregunta para cada regla: ¿se puede comprobar mirando una sola fila o la relación con otra tabla? «Peso mayor que 0» → CHECK. «Chip único» → UNIQUE. «Toda mascota tiene dueño» → NOT NULL + FK. «No vacunar antes de 8 semanas» necesita comparar con otra tabla → no cabe en un CHECK simple: márcala como «en código».',
  'Sintaxis con nombre: «CONSTRAINT ck_mascotas_peso_positivo CHECK (peso_kg > 0)», «CONSTRAINT uq_mascotas_chip UNIQUE (chip)». Formato del nombre: prefijo_tabla_regla. El nombre aparece en el mensaje de error, así que debe explicar qué regla se rompió sin tener que buscarla.',
  'Escribe un INSERT por cada tipo de constraint: peso negativo (CHECK), chip repetido (UNIQUE), mascota sin nombre (NOT NULL), dueno_id inexistente (FK) y una fecha imposible. Debajo de cada uno, en un comentario: «-- falla por ck_mascotas_peso_positivo». Ejecútalos de verdad y copia el mensaje de error real.'
],

'w4d4': [
  '1FN: ¿alguna columna guarda listas («vacunas: rabia, moquillo») o columnas repetidas (telefono1, telefono2)? 2FN: en tablas con clave compuesta, ¿hay columnas que dependen solo de una parte de la clave? 3FN: ¿hay columnas que dependen de otra columna que no es la clave (citas.dueno_telefono depende de dueno_id)?',
  'Para cada violación anota: tabla.columna → forma normal incumplida → corrección. Ejemplo: «citas.nombre_veterinario → 3FN (depende de veterinario_id) → se borra la columna y se obtiene con JOIN». Las listas se convierten en filas de otra tabla; las dependencias transitivas se mueven a su propia tabla.',
  'Busca datos que deben quedar congelados en el momento en que ocurrieron: el precio cobrado en una consulta (aunque la tarifa cambie después), el peso de la mascota el día de la vacuna, el nombre del medicamento recetado. Justificación: «es un dato histórico, no una copia; si cambia el original, este no debe cambiar».'
],

'w4d5': [
  'Formato: «Siempre se cumple que…». Ejemplos: «un veterinario no tiene dos citas que se solapen», «una mascota siempre tiene exactamente un dueño responsable», «una cita cancelada no se puede volver a cancelar», «una vacuna aplicada tiene fecha no futura», «el total de una factura es la suma de sus líneas».',
  'La raíz es la entidad por la que entras para modificar el grupo. Agrupa lo que debe cambiar junto: Mascota (con sus vacunas aplicadas), Cita, Dueño, Veterinario (con su horario). Regla: un agregado no guarda objetos de otro agregado, solo su Id (la Cita guarda mascota_id, no la mascota entera).',
  'Si la invariante solo mira datos de un agregado, ese agregado la protege dentro de una transacción («una cita cancelada no se cancela otra vez» → Cita). Si cruza agregados («un veterinario sin solapes» mira muchas citas), anota que necesita una constraint de base de datos o una comprobación con bloqueo, y que la verás en la semana 10.'
],

'w4d6': [
  'Haz una tabla Punto | ✓/✗ | Nota. Sé estricto: marca ✓ solo si puedes señalar exactamente dónde se cumple (en qué tabla y en qué línea del SQL). Un «más o menos» cuenta como ✗. Es mejor encontrar tú los fallos hoy que encontrarlos en la semana 9.',
  'Coloca el ERD y el SQL uno al lado del otro y recórrelos entidad por entidad: cada tabla del SQL debe aparecer en el ERD con las mismas relaciones, y cada FK del SQL debe ser una línea del diagrama. Cuando cambies uno, cambia el otro en ese mismo momento, no «después».',
  'Prepara la decisión más discutible con la estructura: lo que elegí, la alternativa que descarté y por qué. Ejemplo: «separé Cita y Consulta aunque parecen lo mismo; podía usar una tabla con estado, pero una cita puede no convertirse nunca en consulta y la consulta tiene datos médicos con permisos distintos». Grábate 5 minutos sin notas.'
]

});
