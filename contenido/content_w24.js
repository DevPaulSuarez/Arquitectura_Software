window.WEEKS = (window.WEEKS || []).concat([
  {
    n: 24,
    phase: 'Diseño de sistemas',
    title: 'Diseño de sistemas II y cierre: evolucionar, cuidar los datos y contar lo que hiciste',
    idea: 'La semana 23 te dio el método. Esta semana lo pones a prueba en un dominio que no conoces, y después te ocupas de las dos cosas que separan un proyecto de estudio de un sistema real: cómo cambia un contrato sin romper a quien ya lo usa, y cómo se cuidan los datos cuando perderlos no es una opción. El cierre no es un resumen: es convertir 24 semanas de trabajo en algo que puedas defender en una entrevista en cinco minutos, con evidencia en el repositorio y dos historias que de verdad te pasaron. Si llegaste aquí tienes un sistema documentado de punta a punta; lo que falta es que sepas decirlo.',
    res: [
      { t: 'Martin Fowler — Patterns of Distributed Systems',
        u: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
        note: 'Catálogo de patrones con nombre y problema concreto. No lo leas entero: úsalo como índice para poner nombre a cosas que ya hiciste (write-ahead log, idempotent receiver, versioned value).' },
      { t: 'Martin Fowler — Consumer-Driven Contracts',
        u: 'https://martinfowler.com/articles/consumerDrivenContracts.html',
        note: 'Explica por qué versionar una API es un problema de acuerdos entre personas antes que de rutas. Base del día 2.' },
      { t: 'PostgreSQL — Backup and Restore',
        u: 'https://www.postgresql.org/docs/current/backup.html',
        note: 'Documentación oficial. Para el día 3 solo necesitas las secciones de pg_dump y de restore; lo demás es referencia.' },
      { t: 'Google SRE Book — Postmortem Culture',
        u: 'https://sre.google/sre-book/postmortem-culture/',
        note: 'Ya escribiste un postmortem en la semana 22. Este capítulo te da el lenguaje para contarlo en una entrevista sin sonar a excusa.' }
    ],
    days: [
      {
        t: 'Transferir el método: diseñar un dominio que no conoces',
        obj: 'Aplicar los cinco pasos de la semana 23 a un sistema distinto a VetCare y comprobar que el método, no el dominio, es lo que sabes.',
        why: 'En una entrevista no te van a pedir VetCare. Te van a pedir un acortador de URLs, un sistema de reservas o un feed. Si solo sabes tu proyecto, tu respuesta se cae en el primer minuto. Si sabes el método, el dominio es solo vocabulario nuevo.',
        study: { r: 0, what: 'Abre el catálogo de patrones y lee solo los títulos y la primera frase de cada uno. Unos 10 minutos. No intentes aprenderlos: el objetivo es que reconozcas que varios de ellos ya los implementaste sin saber el nombre. Anota tres que te suenen a algo que ya hiciste.',
        pasos: [
          'Recorre la lista de patrones del catálogo leyendo solo el título y la primera frase (~8 min).',
          'Marca tres que ya implementaste sin saberlo, por ejemplo "Idempotent Receiver" o "Write-Ahead Log".',
          'Abre uno de ellos y lee solo su problema y su solución (~4 min).',
          'Antes de diseñar el sistema nuevo, escribe tu plantilla de 5 pasos de memoria.'
        ] },
        ex: {
          title: 'Diseño guiado: sistema de reservas de salas de una universidad',
          body: `Dominio nuevo, mismo método. Esto es el ejercicio completo resuelto.
Léelo entero antes de hacer el tuyo, para ver el ritmo.

PASO 1 - ACLARAR (5 min)

Preguntas funcionales que hago:
  - ¿Quién reserva: estudiantes, profesores o personal administrativo?
  - ¿Una reserva se aprueba automáticamente o la revisa alguien?
  - ¿Hay reservas recurrentes, por ejemplo todos los martes del semestre?
  - ¿Se puede cancelar? ¿Hasta cuándo?
Preguntas no funcionales:
  - ¿Cuántas salas y cuántos usuarios?
  - ¿Cuándo se usa? ¿Hay picos al inicio de semestre?
  - ¿Qué pasa si el sistema se cae una hora?

Respuestas que asumo y escribo:
  A1. 20.000 estudiantes, 1.200 profesores, 400 salas.
  A2. Estudiantes reservan con aprobación automática si la sala es libre.
      Profesores pueden reservar recurrente.
  A3. El pico es la primera semana de semestre y los lunes a las 8:00,
      cuando se abre la agenda de la semana.
  A4. Una hora caído es molesto, no crítico. Objetivo 99.5%.

PASO 2 - ESTIMAR (5 min)

  Reservas por día: 400 salas x 8 franjas útiles = 3.200 franjas/día.
  Si se ocupa el 60%: 1.920 reservas/día.
  1.920 / 86.400 s = 0,02 reservas por segundo. Nada.
  Pero: el lunes 8:00 se abre la agenda. Si 3.000 personas
  entran en 10 minutos: 3.000 / 600 = 5 req/s de escritura,
  con picos de 50 req/s en el primer minuto.
  Lectura de la agenda: cada usuario mira 5 veces por visita.
  21.200 usuarios x 2 visitas/semana x 5 = 212.000 lecturas/semana
  = 0,35 req/s de media, 30 req/s en el pico del lunes.

  Conclusión: el volumen total es pequeño. El problema no es la escala,
  es la concentración: todo pasa en diez minutos a la semana,
  y todos pelean por las mismas filas.

  Almacenamiento: 1.920 reservas/día x 365 = 700.000 filas/año
  x 200 bytes = 140 MB/año. Irrelevante.

PASO 3 - DISEÑO ALTO NIVEL (15 min)

  [Navegador] -> [Balanceador] -> [API x2] -> [PostgreSQL]
                                      |
                                      +-> [Cola de correos]

  Tablas: usuario, sala, reserva, bloqueo_academico
  La restricción clave es exactamente la que ya conoces:
    EXCLUDE USING gist (sala_id WITH =, rango WITH &&)
  Es el mismo problema de solape de la cita de VetCare.
  Eso es transferencia: el dominio cambió, la invariante no.

PASO 4 - PROFUNDIZAR (15 min) - el pico del lunes

  Problema: 3.000 personas intentan reservar las mismas 400 salas
  en el mismo minuto. Casi todos van a fallar.
  Si cada fallo es un error 500 o una espera de 30 segundos,
  el sistema parece caído aunque esté funcionando.

  Decisiones:
  1. El conflicto es la respuesta normal, no un error del sistema:
     409 con el cuerpo de problem details y las tres franjas
     libres más cercanas. El usuario reintenta con un clic.
  2. No pongo un bloqueo de aplicación ni una cola:
     la restricción EXCLUDE ya serializa por sala.
     Dos reservas de salas distintas no se estorban.
  3. Idempotency-Key en el POST: con 3.000 personas nerviosas
     dándole dos veces al botón, es obligatorio.
  4. La lectura de la agenda se cachea 10 segundos.
     Aceptar 10 segundos de desactualización es correcto
     porque el 409 ya cubre el caso de la carrera.
     Esto baja las 30 req/s de lectura a casi cero.

PASO 5 - CUELLOS DE BOTELLA (5 min)

  - Lo primero que se rompe: la cola de PostgreSQL por sala popular.
    Con 200 personas peleando por la sala A, se serializan.
    Número: si cada transacción tarda 5 ms, 200 esperan 1 segundo.
    Aceptable. A partir de 2.000 por sala habría que repensarlo.
  - Riesgo real mayor: que el correo de confirmación se envíe
    dentro de la transacción. Eso la alarga de 5 ms a 300 ms
    y multiplica la espera por 60. Va a la cola. Patrón outbox.

TRADE-OFFS QUE DECLARO
  - Elegí consistencia fuerte en la reserva y eventual en la
    confirmación por correo. Nadie se queja de un correo
    que llega en 20 segundos; todos se quejan de una sala doble.
  - Elegí no hacer sistema de espera ni lista de prioridades.
    Es complejidad que la universidad probablemente no quiere.
    Si la quisiera, lo diría en el paso 1.`
        },
        steps: [
          'Elige un dominio que no sea VetCare y que no hayas diseñado nunca. Tres buenas opciones: un acortador de URLs, un sistema de préstamo de libros de biblioteca, o una app de seguimiento de pedidos de comida.',
          'Pon un temporizador de 45 minutos y respeta los cinco bloques de tiempo del ejercicio. Si te pasas en el paso 1, te quedas sin paso 4, que es donde se gana la entrevista.',
          'Escribe el documento a mano mientras piensas, en voz alta si puedes. No lo escribas bonito después: el objetivo es practicar el pensamiento bajo reloj, no producir un PDF.',
          'En el paso 4 elige la parte difícil tú mismo y di por qué la elegiste: "profundizo en X porque es donde está la invariante que, si se rompe, deja el sistema inservible".',
          'Al terminar, compara tu documento con el del ejemplo y busca una sola cosa: cuántas de tus decisiones tienen un número detrás. Si menos de la mitad, repite el paso 2 con más cuidado.',
          'Anota en una lista aparte las preguntas que te dejaron en blanco. Esas, junto a las tres de la semana 23, son tu plan de estudio del día 6.'
        ],
        vet: [
          'Marca explícitamente en tu documento las tres cosas que copiaste de VetCare sin pensar: la restricción de solape, el 409 con alternativas y la clave de idempotencia. Son tu patrimonio técnico, no casualidades.',
          'Si tu dominio nuevo NO necesita alguna de ellas, escribe por qué. Reconocer cuándo un patrón no aplica vale más que aplicarlo siempre.'
        ],
        edge: [
          'El error más común es empezar a dibujar cajas en el minuto dos. Sin paso 1 y 2, el dibujo es decoración: no puedes justificar ninguna caja porque no sabes el tamaño del problema.',
          'El segundo error es estimar con números redondos sin decir de dónde salen. "Asumo 20.000 estudiantes porque es una universidad mediana" es una estimación; "asumo un millón de usuarios" sin fuente es una fantasía.',
          'No metas microservicios, Kafka ni Kubernetes en un sistema de 0,02 escrituras por segundo. Mencionar tecnología grande sin el número que la justifique es la señal más clara de inexperiencia.'
        ],
        quiz: [
          { q: '¿Por qué practicar un dominio distinto en vez de pulir más el diseño de VetCare?', a: 'Porque pulir VetCare mejora tu conocimiento del dominio, y lo que te van a evaluar es el método. Repetir el método en un dominio desconocido es la única forma de comprobar que lo que sabes es transferible y no memorizado.' },
          { q: 'En el ejemplo de las salas, el volumen total era minúsculo. ¿Por qué entonces el diseño no era trivial?', a: 'Porque la dificultad no venía del volumen sino de la concentración y la contención: todo el tráfico ocurre en diez minutos y toda la gente pelea por las mismas filas. Escala y contención son problemas distintos, y la contención aparece mucho antes.' },
          { q: '¿Qué invariante del ejemplo de las salas es idéntica a una de VetCare, y qué significa eso?', a: 'La de no solapamiento de un recurso en el tiempo: una sala no puede tener dos reservas que se cruzan, igual que un veterinario no puede tener dos citas que se cruzan. Significa que la restricción EXCLUDE con btree_gist que aprendiste en la semana 10 no era un truco de PostgreSQL para tu proyecto, era la solución a una clase de problema que vas a volver a encontrar.' },
          { q: '¿Por qué en el paso 4 del ejemplo se decidió NO poner una cola para las reservas?', a: 'Porque la restricción de la base de datos ya serializa el acceso por sala, y una cola solo añadiría latencia, una pieza más que operar y un estado intermedio que explicar al usuario. La cola se reservó para el correo, donde la asincronía sí aporta: saca 300 ms de la transacción crítica.' }
        ],
        out: 'Un documento de diseño de 45 minutos de un dominio nuevo, con los cinco pasos, números en las decisiones y trade-offs declarados; más una lista de las preguntas que te bloquearon.',
        file: 'docs/diseno-practica-02.md'
      },
      {
        t: 'Evolucionar un contrato sin romper a quien ya lo usa',
        obj: 'Cambiar la API de VetCare de forma que los clientes existentes sigan funcionando, y saber cuándo toca versión nueva y cuándo no.',
        why: 'Escribir una API desde cero es fácil. Cambiarla cuando hay una app móvil en producción, un panel web y un cliente que integró hace un año es donde se rompen los sistemas. Es también la pregunta de entrevista que separa a quien ha mantenido algo de quien solo ha construido.',
        study: { r: 1, what: 'Lee el artículo de contratos dirigidos por el consumidor. Unos 15 minutos. Quédate con la idea central: tu API no tiene una forma correcta, tiene un conjunto de expectativas de consumidores reales, y romper el contrato es romper una expectativa concreta, no violar una regla abstracta.',
        pasos: [
          'Lee "Evolving a Service: An Example" (~5 min): cómo un cambio pequeño rompe a un consumidor.',
          'Lee "Schema Versioning" y "Breaking Changes" (~5 min).',
          'Lee "Consumer-Driven Contracts" con "Provider Contracts" y "Consumer Contracts" (~5 min).',
          'Lee "Benefits" y "Liabilities" (~3 min).',
          'Clasifica cambios posibles de la API de VetCare en dos columnas: no rompe (añadir un campo opcional) y rompe (renombrar un campo).'
        ] },
        ex: {
          title: 'El catálogo de cambios: qué rompe y qué no',
          body: `CAMBIOS COMPATIBLES (no necesitas versión nueva)

  Añadir un campo opcional a la RESPUESTA.
    Antes: { "id": 1, "inicio": "..." }
    Ahora: { "id": 1, "inicio": "...", "salaId": 7 }
    Por qué no rompe: un cliente que deserializa a un tipo
    conocido ignora lo que no espera. Salvo que valide
    con esquema estricto. Eso se pregunta, no se asume.

  Añadir un campo OPCIONAL a la petición, con valor por defecto.
    Si el campo falta, el servidor usa el defecto anterior.
    El cliente viejo nunca lo manda y sigue funcionando.

  Añadir un endpoint nuevo.
  Añadir un valor nuevo a una lista que el cliente solo muestra.
  Relajar una validación (aceptar más de lo que aceptabas).

CAMBIOS QUE ROMPEN (necesitas versión o migración)

  Quitar o renombrar un campo de la respuesta.
  Cambiar el tipo de un campo.
    "precio": 1200      ->  "precio": "1200.00"
    Esto rompe silenciosamente: el cliente no falla,
    calcula mal. Es el peor tipo de rotura.
  Hacer obligatorio un campo de la petición que era opcional.
  Endurecer una validación.
    Si antes aceptabas teléfonos sin prefijo y ahora los
    rechazas, acabas de romper a todos los que mandaban así.
  Cambiar el significado de un valor sin cambiar su nombre.
    "estado": "pendiente" pasa a significar otra cosa.
    No hay forma de que el cliente lo detecte.
  Cambiar un código de estado HTTP.
    Si 404 pasa a ser 204, el cliente que trataba el 404
    como "no existe" ahora cree que tuvo éxito.
  Cambiar el orden de una lista en la que alguien confiaba
    sin que estuviera documentado el orden.

LA REGLA PRÁCTICA
  Al escribir: sé estricto con lo que aceptas.
  Al cambiar: sé conservador con lo que quitas.
  Puedes añadir casi siempre. Quitar casi nunca sale gratis.

CÓMO SE QUITA UN CAMPO DE VERDAD (expand / contract otra vez)

  Es el mismo patrón de la semana 10, aplicado al contrato.

  Fase 1 - EXPAND. Añade el campo nuevo, deja el viejo.
    { "veterinarioId": 4, "veterinario": { "id": 4, "nombre": "..." } }
    Los dos conviven. Nadie se rompe. Documenta el viejo
    como obsoleto en el OpenAPI:
      deprecated: true
      description: "Obsoleto desde 2026-11. Usa veterinario.id.
                    Se retira el 2027-02-01."

  Fase 2 - MIGRAR. Avisa y mide.
    Cuenta el uso con una métrica, igual que en la semana 22:
      contadorCampoObsoleto.Add(1,
        new TagList { { "campo", "veterinarioId" },
                      { "cliente", clienteId } });
    No retires nada mientras ese contador no sea cero
    o sepas exactamente a quién vas a romper.

  Fase 3 - CONTRACT. Quita el campo viejo.
    Solo cuando el contador lleve semanas en cero,
    o cuando pasaste la fecha anunciada y avisaste
    a los que quedaban por su nombre.

DÓNDE PONER LA VERSIÓN

  En la ruta:      /api/v1/citas
    Obvio, cacheable, fácil de enrutar. Feo de mantener
    si tienes muchas rutas. Es lo que elige la mayoría.
  En una cabecera: Accept: application/vnd.vetcare.v2+json
    Más limpio conceptualmente. Más fácil de olvidar
    y más difícil de probar a mano con el navegador.

  Decisión de VetCare: versión en la ruta, y solo subo
  de versión cuando no haya forma compatible de hacer el cambio.
  Objetivo declarado: no llegar nunca a v3.
  Una versión nueva es un sistema más que mantener,
  no una mejora.

LO QUE NUNCA ES PARTE DEL CONTRATO
  Aunque el cliente lo vea, no prometiste:
  - El orden de los campos del JSON.
  - El formato exacto del texto de un mensaje de error
    (si prometiste algo, es el campo type del problem details).
  - El valor concreto de un id (solo su formato: un UUID).
  - Cuánto tarda una petición (eso es el SLO, no el contrato).`
        },
        steps: [
          'Abre tu docs/openapi.yaml de la semana 11 y marca cada endpoint con quién lo consume hoy: la web de la semana 16, el CLI, o nadie todavía. Un endpoint sin consumidor es libre; uno con dos consumidores es un acuerdo.',
          'Elige un cambio real que quieras hacer en VetCare. Un buen candidato: que la respuesta de la cita devuelva el objeto veterinario completo en vez de solo el id, porque el frontend hacía una petición extra.',
          'Clasifica tu cambio con el catálogo del ejemplo. Si rompe, escribe las tres fases de expand/contract con fechas concretas antes de tocar código.',
          'Implementa la fase 1 en src/VetCare.Api: añade el campo nuevo sin quitar el viejo, y marca el viejo como deprecated en el OpenAPI con fecha de retirada.',
          'Añade el contador de uso del campo obsoleto con el Meter de la semana 22. Sin medición no vas a poder decidir cuándo retirarlo y vas a quedarte con el campo para siempre.',
          'Escribe un test en tests/VetCare.Api.Tests que falle si el campo obsoleto desaparece antes de la fecha. Un comentario en el código se ignora; un test rojo no.'
        ],
        vet: [
          'Añade a docs/api-contract.md una sección de "política de cambios" con dos listas, lo que puedes cambiar sin avisar y lo que no, y la promesa de aviso mínimo (por ejemplo 90 días).',
          'Escribe una ADR corta en docs/adr/ sobre la decisión de versionar en la ruta y el objetivo de no llegar a v3. Es exactamente el tipo de decisión que en seis meses nadie recuerda por qué se tomó.'
        ],
        edge: [
          'El cambio de tipo es el más peligroso de todos porque no produce ningún error: el cliente sigue respondiendo 200 y los números salen mal. Si alguna vez tienes que cambiar un tipo, usa un nombre de campo nuevo, siempre.',
          'Un cliente que valida la respuesta con esquema estricto se rompe incluso cuando añades un campo opcional. Por eso "añadir nunca rompe" es falso: es "añadir no rompe a clientes tolerantes". Pregúntalo antes de prometerlo.',
          'Mantener v1 y v2 en paralelo duplica los tests, los bugs y las migraciones de base de datos que tienen que servir a las dos. El coste de una versión nueva no es escribirla, es que dos contratos distintos tienen que seguir siendo verdad sobre los mismos datos.'
        ],
        quiz: [
          { q: '¿Por qué cambiar un número por una cadena en la respuesta es peor que quitar el campo entero?', a: 'Porque quitarlo produce un fallo visible e inmediato en el cliente, mientras que cambiar el tipo deja que el cliente siga respondiendo 200 y calcule mal en silencio. Los errores ruidosos se arreglan en horas; los silenciosos viven meses y corrompen datos.' },
          { q: '¿Qué tiene que ocurrir antes de la fase de contract, y por qué no basta con haber avisado?', a: 'Tiene que haber evidencia de que nadie usa el campo, y eso solo lo da una métrica de uso real. Avisar prueba que fuiste correcto, no que el cliente leyó el aviso; el contador prueba que el cambio es seguro.' },
          { q: 'Si un endpoint no tiene ningún consumidor todavía, ¿cambia algo?', a: 'Sí: puedes cambiarlo libremente, porque un contrato existe entre partes y no hay segunda parte. Por eso vale la pena saber quién consume cada endpoint antes de discutir compatibilidad, en vez de tratar toda la API con la misma rigidez.' },
          { q: '¿Por qué el objetivo declarado de VetCare es "no llegar nunca a v3" en vez de versionar con tranquilidad?', a: 'Porque cada versión viva es un contrato más que debe seguir siendo verdad sobre los mismos datos, con sus tests, sus bugs y sus migraciones compartidas. Versionar es la salida cuando no hay camino compatible, no una herramienta de uso habitual.' }
        ],
        out: 'La fase 1 de un cambio de contrato implementada, el campo viejo marcado como obsoleto con fecha, un contador de uso y una política de cambios escrita.',
        file: 'docs/api-contract.md'
      },
      {
        t: 'Datos: copias, restauración y el derecho a ser borrado',
        obj: 'Probar que puedes recuperar los datos de VetCare después de un desastre, y decidir cuánto tiempo guardas cada cosa.',
        why: 'Un historial clínico perdido no se puede reconstruir: no existe en otro sitio. Esta es la única categoría de fallo de la que un sistema no se recupera, y casi nadie la practica. Decir en una entrevista "hice un simulacro de restauración y tardé 14 minutos" te separa inmediatamente de quien dice "tengo backups".',
        study: { r: 2, what: 'Lee la introducción de la documentación de backup de PostgreSQL y la sección de pg_dump. Unos 15 minutos. Fíjate en la distinción entre volcado lógico y copia a nivel de fichero, y en por qué el punto en el tiempo (PITR) existe. No necesitas configurar PITR hoy.',
        pasos: [
          'Lee la introducción del capítulo (~2 min): los tres enfoques de copia.',
          'Abre la sección de SQL Dump desde el índice (~6 min): pg_dump, restaurar y por qué es una foto consistente.',
          'Abre "25.2. File System Level Backup" por encima (~2 min).',
          'Lee la introducción de "25.3. Continuous Archiving and Point-in-Time Recovery (PITR)" (~3 min): volver a un instante concreto.',
          'Haz un pg_dump de VetCare, borra la base de pruebas y restáurala. Mide cuánto tarda.'
        ] },
        ex: {
          title: 'Simulacro de desastre y política de retención',
          body: `PRIMERO, LA VERDAD INCÓMODA
  Un backup que nunca restauraste no es un backup.
  Es un fichero del que esperas algo.
  Lo único que cuenta es el tiempo que tardas en volver
  a tener el sistema en pie. Eso se mide, no se supone.

DOS NÚMEROS QUE DEBES PODER DECIR

  RPO (Recovery Point Objective)
    Cuántos datos puedo permitirme perder, medido en tiempo.
    Si hago copia cada 24 h, mi RPO es 24 h:
    en el peor caso pierdo un día de citas y visitas.
  RTO (Recovery Time Objective)
    Cuánto puedo tardar en estar operativo otra vez.

  Decisión de VetCare:
    RPO = 1 hora   (copia completa diaria + WAL continuo)
    RTO = 2 horas  (restauración manual documentada)
  (Si no configuras el archivado de WAL, tu RPO real es de
   24 horas: escríbelo así, como dice el aviso de abajo.)
  Justificación: perder una hora de citas se puede reconstruir
  llamando a la gente. Perder un día, no.
  Dos horas caídos en una clínica es grave pero sobrevivible;
  el personal puede trabajar en papel ese rato,
  y existe un procedimiento escrito para ello.

EL SIMULACRO (esto es el ejercicio del día)

  1. Haz la copia.
     docker compose exec -T db pg_dump -U vetcare -Fc vetcare \\
       > copias/vetcare-$(date +%F-%H%M).dump

     -Fc es formato comprimido propio: permite restaurar
     tablas sueltas y va más rápido que el SQL plano.
     -T es imprescindible: sin él, docker abre una terminal
     y el fichero binario sale corrupto.

  2. Comprueba que la copia dice algo.
     ls -lh copias/
     Si el fichero pesa 4 KB y tu base tiene datos, falló.
     Un backup de tamaño sospechoso es la forma más común
     de descubrir meses después que no había nada dentro.

  3. DESTRUYE. Esto es lo que casi nadie hace.
     docker compose down -v
     La -v borra el volumen. Los datos ya no están.
     Si esto te da miedo, es exactamente por eso
     que tienes que practicarlo ahora y no en el incidente.

  4. Levanta limpio y mide desde aquí.
     date
     docker compose up -d --wait db
     (Con un volumen nuevo, el compose crea solo la base
      vetcare vacía, por POSTGRES_DB. No hay que crearla.)

  5. Restaura.
     cat copias/vetcare-2026-11-02-0300.dump | \\
       docker compose exec -T db pg_restore -U vetcare -d vetcare

  6. VERIFICA con datos, no con la ausencia de errores.
     SELECT count(*) FROM cita;
     SELECT count(*) FROM mascota;
     SELECT max(inicio) FROM cita;
     Compara con lo que anotaste antes de destruir.
     Comprueba también que las restricciones volvieron:
       \\d cita
     Si ex_cita_sin_solape no está, restauraste datos
     sin las reglas que los protegen. Eso es peor
     que no restaurar, porque parece que funcionó.

  7. Levanta la API y entra a la aplicación.
     Una restauración que no termina en "entré y vi mi agenda"
     no está verificada.

  8. date otra vez. Ese número es tu RTO real.
     Escríbelo. Si es mayor que el que prometiste,
     tienes dos opciones honestas: mejorar el procedimiento
     o cambiar la promesa.

RETENCIÓN: no todo se guarda igual

  Dato                 Guardar      Por qué
  -------------------- ------------ ---------------------------
  Historial clínico    permanente   obligación profesional,
                                    y clínicamente útil a 10 años
  Facturas             10 años      obligación fiscal típica
  Citas pasadas        5 años       utilidad decreciente
  Tokens de refresco   al caducar   semana 18: dejar de
                                    ser útil = dejar de existir
  Registros de acceso  1 año        investigar incidentes
  Logs de aplicación   30 días      depurar, no archivar
  Datos de dueño
  que pidió borrado    ver abajo

  Regla general: un dato que no tiene un motivo escrito
  para existir es una responsabilidad, no un activo.
  Cada dato que guardas es un dato que puedes filtrar.

BORRADO A PETICIÓN, SIN ROMPER LA CONTABILIDAD

  Un dueño pide que borres sus datos.
  Tienes un conflicto real: su petición es legítima,
  y también es legítimo que la factura de 2026 siga existiendo.

  Solución: anonimizar en vez de borrar en cascada.
    UPDATE dueno
       SET nombre = 'Dueño eliminado',
           email = NULL,
           telefono = NULL,
           direccion = NULL,
           anonimizado_en = now()
     WHERE id = $1;          -- el id (UUID) del dueño, como parámetro

  La factura mantiene su importe, su fecha y su id de dueño.
  Deja de poder identificar a una persona.
  La historia clínica de la mascota: decisión de dominio,
  no técnica. Anótala y di quién debería decidirla
  (el veterinario responsable, no tú).

  Y lo que casi todos olvidan: los backups.
  Si borras hoy y restauras una copia de la semana pasada,
  el dato vuelve. Por eso el procedimiento de borrado
  tiene que incluir una nota en el documento:
  "los datos anonimizados pueden reaparecer en una
  restauración anterior a la fecha de anonimización;
  tras restaurar, se reejecuta la lista de anonimizaciones
  pendientes registrada en la tabla anonimizacion_aplicada."
  Es incómodo y es la verdad. Decirlo es más profesional
  que prometer un borrado que no puedes garantizar.`
        },
        steps: [
          'Antes de tocar nada, ejecuta los conteos de verificación y apúntalos en papel. Sin el estado previo no puedes verificar nada después.',
          'Haz el pg_dump y mira el tamaño del fichero. Si es sospechosamente pequeño, para y averigua por qué antes de seguir.',
          'Haz el simulacro completo, incluido el docker compose down -v. Mide el tiempo real desde la destrucción hasta que entras a la aplicación y ves tu agenda.',
          'Verifica que volvieron las restricciones y no solo las filas. Comprueba en concreto ex_cita_sin_solape e intenta crear una cita solapada: debe dar 409.',
          'Escribe docs/respaldos.md con tu RPO, tu RTO prometido, tu RTO medido, el procedimiento numerado y la tabla de retención.',
          'Implementa la anonimización como un comando o un endpoint protegido para administrador, con la tabla anonimizacion_aplicada, y escribe un test que compruebe que la factura sigue existiendo después.'
        ],
        vet: [
          'Añade a docs/despliegue.md de la semana 20 un enlace al procedimiento de restauración, porque el día que lo necesites vas a buscar en el documento de despliegue.',
          'Si tu RTO medido es peor que el prometido, no ajustes el documento en silencio: escribe la diferencia y una acción concreta para cerrarla. Es el mismo hábito del postmortem de la semana 22.'
        ],
        edge: [
          'Restaurar en la misma máquina donde está el sistema vivo es la forma clásica de convertir un simulacro en un incidente real. Restaura en una base de datos con otro nombre o en otro contenedor, siempre.',
          'Un volcado lógico con pg_dump captura un instante consistente, pero no la hora siguiente. Si tu RPO es de una hora, necesitas los WAL archivados, no solo el dump; si solo tienes el dump diario, tu RPO honesto es 24 horas y debes escribir eso.',
          'Las copias tienen que estar en otro sitio que el servidor. Una copia en el mismo disco protege del DROP TABLE accidental pero no del fallo de disco, del ransomware ni del borrado de la cuenta de hosting.'
        ],
        quiz: [
          { q: '¿Cuál es la diferencia entre RPO y RTO, y cuál de los dos suele ser más caro de mejorar?', a: 'El RPO es cuántos datos aceptas perder medido en tiempo, y el RTO es cuánto tardas en estar operativo. Mejorar el RPO suele ser más barato (hacer copias más a menudo o archivar WAL), mientras que mejorar el RTO exige automatizar y ensayar el procedimiento, que es trabajo humano continuo.' },
          { q: '¿Por qué la verificación de una restauración tiene que incluir mirar las restricciones y no solo contar filas?', a: 'Porque una restauración que trae los datos sin sus restricciones deja la base en un estado que parece correcto y acepta datos inválidos desde ese momento. Las filas cuentan la historia pasada; las restricciones protegen la futura, y perderlas es un daño silencioso.' },
          { q: '¿Por qué se anonimiza el dueño en vez de borrar sus filas en cascada?', a: 'Porque hay obligaciones en conflicto: la persona tiene derecho a no ser identificable y la clínica tiene obligación de conservar facturas e historial. Anonimizar satisface las dos: desaparece el vínculo con una persona real y se conservan los registros contables y clínicos.' },
          { q: '¿Qué problema crean los backups para una petición de borrado, y cuál es la respuesta honesta?', a: 'Que restaurar una copia anterior al borrado hace reaparecer el dato. La respuesta honesta es registrar las anonimizaciones aplicadas en una tabla y reejecutarlas como paso obligatorio del procedimiento de restauración, y documentar explícitamente esa limitación en vez de prometer un borrado absoluto.' }
        ],
        out: 'Un simulacro de desastre completado con RTO medido, docs/respaldos.md con procedimiento y retención, y la anonimización implementada con su test.',
        file: 'docs/respaldos.md'
      },
      {
        t: 'Convertir 24 semanas en evidencia que alguien quiera leer',
        obj: 'Dejar el repositorio de VetCare en un estado donde un desconocido entienda en cinco minutos qué sabes hacer, sin que tú se lo expliques.',
        why: 'Nadie va a leer tu código. Van a leer el README, mirar dos o tres documentos y decidir si siguen. Todo el trabajo de 24 semanas vale lo que vale su puerta de entrada. Y un repositorio que se explica solo es la mejor carta de presentación técnica que existe, porque demuestra justo la habilidad que más se valora y menos se ve: comunicar.',
        study: { r: 0, what: 'Hoy no hay lectura nueva. En su lugar, abre tu propio repositorio como si fuera de otra persona y dedica 10 minutos a leerlo sin arreglar nada. Anota el momento exacto en que te perderías si no fuera tuyo. Ese punto es lo que vas a arreglar hoy.',
        pasos: [
          'Abre tu repositorio en el navegador como si fuera de otra persona.',
          'Lee solo el README durante dos minutos y escribe qué entendiste del proyecto.',
          'Navega diez minutos sin arreglar nada y anota el momento exacto en que te perderías.',
          'Ordena los arreglos por lo que verá primero un revisor: README, estructura de carpetas y docs.'
        ] },
        ex: {
          title: 'Estructura del README y el índice de evidencia',
          body: `EL README NO ES DOCUMENTACIÓN, ES UNA PUERTA

  Reglas:
  - Lo más importante arriba. Nadie baja.
  - Que se pueda arrancar en tres comandos.
  - Enlaces a los documentos profundos, no su contenido.
  - Nada de "trabajo en progreso" ni disculpas.

PLANTILLA

  # VetCare

  Sistema de gestión para una clínica veterinaria:
  agenda sin solapes, historial clínico, facturación
  y panel web. .NET 10, PostgreSQL 17, React + TypeScript.

  ## Qué hace, en una pantalla

  (una captura de la agenda. Una. La mejor.)

  - Agenda con garantía de no solape a nivel de base de datos
  - Historial clínico por mascota con documentos tipados
  - Facturación con reglas de precio componibles
  - Autenticación por cookie con rotación de refresco
  - API documentada con OpenAPI y errores RFC 9457

  ## Arrancar

      cp .env.example .env
      docker compose up -d
      # http://localhost:5173

  Eso es todo. Migraciones y datos de ejemplo se aplican
  al arrancar.

  ## Cómo está construido

      src/VetCare.Domain          reglas de negocio, sin dependencias
      src/VetCare.Application     casos de uso
      src/VetCare.Infrastructure  base de datos, correo, resiliencia
      src/VetCare.Api             endpoints HTTP
      web/                        panel React
      tests/                      unitarios, integración, arquitectura

  Las reglas de negocio no conocen la base de datos.
  Hay un test que lo verifica:
  tests/VetCare.Domain.Tests/ArquitecturaTests.cs

  ## Decisiones

  Cada decisión no obvia está escrita con su alternativa
  descartada y su motivo: [docs/adr/](docs/adr/)

  ## Documentos

  | Tema          | Documento                        |
  |---------------|----------------------------------|
  | Requisitos    | docs/requirements.md             |
  | Modelo        | docs/domain-model.md             |
  | Arquitectura  | docs/arquitectura.md             |
  | API           | docs/api-contract.md             |
  | Seguridad     | docs/seguridad.md                |
  | Rendimiento   | docs/rendimiento-informe.md      |
  | Observabilidad| docs/observabilidad.md           |
  | Despliegue    | docs/despliegue.md               |
  | Respaldos     | docs/respaldos.md                |
  | Diseño escala | docs/diseno-vetcare-escala.md    |
  | Postmortem    | docs/postmortem-01.md            |

  ## Estado

  Hecho: agenda, pacientes, facturación, auth, panel web.
  No hecho a propósito: pagos reales, app móvil, multi-idioma.
  Límite conocido: una sola instancia de API;
  el siguiente límite está en ~500 req/s (docs/rendimiento-informe.md).

LOS TRES DOCUMENTOS QUE MÁS VALEN

  De los 25 documentos, tres son los que un entrevistador
  no espera encontrar y le hacen cambiar de postura:

  1. docs/rendimiento-informe.md
     Porque tiene números antes y después, y una sección
     de "lo que NO hice y por qué". Demuestra criterio,
     no solo capacidad.
  2. docs/postmortem-01.md
     Porque demuestra que distingues causa de detección
     y que no buscas culpables. Es madurez operativa.
  3. docs/adr/
     Porque demuestra que sabes que una decisión sin
     alternativa descartada no es una decisión.

  Si tuvieras tiempo de pulir solo tres cosas, son estas.

DOS HISTORIAS QUE DEBES TENER LISTAS

  Formato: Situación, Tarea, Acción, Resultado.
  Dos minutos cada una. Sin tecnicismos innecesarios.

  Historia 1 - rendimiento (sale de la semana 21)
    S: la agenda tardaba 2,4 segundos en el p95 con un año
       de datos cargados.
    T: bajarla por debajo de 400 ms sin reescribir la aplicación.
    A: medí primero con pg_stat_statements en vez de adivinar.
       Mi intuición decía que era el frontend; era un
       escaneo secuencial por un filtro de fecha sin índice.
       Añadí un índice parcial, quité un N+1 con proyección
       y cacheé el catálogo de veterinarios. Nada más.
    R: p95 de 2.400 ms a 180 ms. Documenté lo que decidí
       NO optimizar y a partir de qué carga haría falta.

  Historia 2 - incidente (sale de la semana 22)
    S: la búsqueda de pacientes empezó a dar errores
       intermitentes en producción simulada.
    T: encontrar la causa y evitar que se repitiera.
    A: la traza mostró 782 ms de 842 en un solo SELECT
       con ILIKE sin índice, que agotaba el pool de conexiones
       y hacía fallar peticiones que no tenían nada que ver.
       Mitigué con rollback primero y arreglé después con
       un índice GIN. Escribí el postmortem separando
       acciones de causa de acciones de detección.
    R: el error bajó a cero y añadí una alerta de saturación
       del pool, que era lo que de verdad faltaba:
       el problema no era el índice, era que no lo vimos.

  Fíjate en que ninguna historia dice "aprendí mucho".
  Las dos dicen un número y una decisión.`
        },
        steps: [
          'Reescribe el README completo con la plantilla. Lo más importante arriba, arranque en tres comandos, enlaces en vez de contenido, una sola captura y la buena.',
          'Haz la prueba del desconocido de verdad: clona el repositorio en un directorio nuevo, sigue tu propio README al pie de la letra sin usar nada que sepas de memoria, y anota cada paso que falla o que tuviste que adivinar. Arregla el README, no tu memoria.',
          'Revisa que los 25 documentos existan y que ninguno esté a medias. Un documento con un encabezado y un "TODO" debajo resta más de lo que un documento ausente.',
          'Pule los tres documentos de más valor: el informe de rendimiento, el postmortem y las ADR. Que cada ADR tenga alternativa descartada y motivo.',
          'Escribe tus dos historias con el formato de situación, tarea, acción y resultado, y cuéntalas en voz alta con reloj. Dos minutos cada una. Si pasas de tres minutos, sobra contexto.',
          'Añade la sección de estado con lo hecho, lo no hecho a propósito y el límite conocido. Declarar lo que falta genera más confianza que fingir que está todo.'
        ],
        vet: [
          'Comprueba que cada afirmación del README tiene una prueba en el repositorio. Si dices "las reglas de negocio no conocen la base de datos", el test de arquitectura tiene que existir y pasar; si no, estás escribiendo deseos.',
          'Pon en el README el enlace al OpenAPI y a una captura del panel de observabilidad. Lo que se ve se cree; lo que se afirma se duda.'
        ],
        edge: [
          'La captura de pantalla desactualizada hace más daño que la ausencia de captura, porque la primera cosa que el lector comprueba es si lo que ve coincide con lo que arranca.',
          'No listes tecnologías como si fueran logros. "Usa Redis" no dice nada; "cacheé el catálogo de veterinarios porque cambia una vez al mes y se leía en cada petición" dice que entiendes por qué.',
          'No escribas en el README que el proyecto es un ejercicio de aprendizaje en la primera línea. Que sea un proyecto de estudio se nota solo; empezar disculpándote hace que el lector lea el resto con otra expectativa.'
        ],
        quiz: [
          { q: '¿Por qué el README importa más que la calidad del código para que alguien valore tu trabajo?', a: 'Porque es lo único que casi todo el mundo va a leer: decide en el primer minuto si alguien sigue mirando. El código excelente que nadie abre no comunica nada, y comunicar es parte del trabajo, no un extra.' },
          { q: '¿Qué tienen en común los tres documentos de más valor, y por qué sorprenden?', a: 'Los tres muestran criterio y no solo capacidad: el informe de rendimiento dice lo que decidiste no hacer, el postmortem separa la causa de la falta de detección, y las ADR registran la alternativa descartada. Sorprenden porque casi todos los proyectos de estudio demuestran que algo funciona, y casi ninguno demuestra que se eligió entre opciones.' },
          { q: '¿Por qué la prueba del clon limpio es indispensable aunque tú sepas que el proyecto arranca?', a: 'Porque tu máquina tiene estado, variables y hábitos que el README no menciona, y tu memoria rellena los huecos sin que lo notes. Solo un clon nuevo que se sigue literalmente revela los pasos que están en tu cabeza y no en el documento.' },
          { q: '¿Por qué declarar lo que NO hiciste aumenta la confianza en vez de restarle?', a: 'Porque distingue entre una carencia por descuido y una decisión con límite conocido, y eso es exactamente lo que diferencia a alguien con criterio. Un proyecto que dice "no implementé pagos reales y el siguiente límite está en 500 req/s" demuestra que conoce su propio sistema mejor que uno que no menciona ningún límite.' }
        ],
        out: 'Un README que funciona como puerta de entrada, verificado con un clon limpio, los tres documentos clave pulidos y dos historias de dos minutos ensayadas.',
        file: 'README.md'
      },
      {
        t: 'Ensayo de entrevista: explicar en voz alta lo que ya sabes',
        obj: 'Pasar de saber a poder explicarlo bajo presión, en el idioma de quien pregunta y en el tiempo que te dan.',
        why: 'Las 23 semanas anteriores construyeron conocimiento. Hoy se practica la única habilidad que lo hace visible. Hay una distancia enorme entre entender algo y explicarlo en noventa segundos a alguien que no sabe de tu proyecto, y esa distancia solo se cierra hablando en voz alta, nunca leyendo.',
        study: { r: 3, what: 'Lee el capítulo de cultura de postmortem del libro de SRE, sobre todo la parte de cómo se cuenta un fallo sin buscar culpables. Unos 15 minutos. Te sirve para la pregunta de "cuéntame un error que cometiste", que es la que más gente contesta mal por querer sonar infalible.',
        pasos: [
          'Lee "Google’s Postmortem Philosophy" (~5 min): sin culpables, centrado en el sistema.',
          'Lee "Collaborate and Share Knowledge" (~4 min).',
          'Lee "Introducing a Postmortem Culture" (~4 min).',
          'Prepara tu respuesta a cuéntame un error que cometiste con la estructura de un postmortem: qué pasó, impacto, causa, qué cambiaste.'
        ] },
        ex: {
          title: 'Banco de preguntas con respuestas que de verdad funcionan',
          body: `CÓMO SE CONTESTA UNA PREGUNTA TÉCNICA EN VOZ ALTA

  1. Contesta en una frase. Primero la respuesta.
  2. Da el porqué en dos o tres frases.
  3. Da el trade-off o el límite. Esto es lo que te separa.
  4. Para de hablar.

  El error más común es construir contexto durante un minuto
  antes de contestar. Quien pregunta no sabe si lo sabes
  hasta que lo dices, y empieza a dudar.

PREGUNTAS DE PROYECTO

P: Cuéntame tu proyecto en dos minutos.
R: VetCare es un sistema de gestión para clínicas veterinarias.
   La invariante central es que un veterinario no puede tener
   dos citas que se solapen, y eso lo garantiza la base de datos
   con una restricción de exclusión, no el código de aplicación.
   Ahí está la decisión interesante: validé en memoria primero
   y descubrí que dos peticiones simultáneas se colaban,
   porque entre el SELECT y el INSERT hay una ventana.
   Lo moví a la base de datos y el error de violación
   lo traduzco a un 409 con problem details.
   Alrededor de eso hay historial clínico, facturación,
   una API con OpenAPI y problem details, y un panel en React.
   Todo arranca con docker compose up.

   Por qué funciona: nombra una invariante, cuenta un error
   propio, explica la corrección y acaba en algo ejecutable.

P: ¿Qué es lo más difícil que resolviste?
R: Que "lento" y "caído" son lo mismo para el usuario.
   Tenía una búsqueda con ILIKE sin índice que tardaba 800 ms.
   Parecía un problema de velocidad de una pantalla,
   pero agotaba el pool de conexiones y hacía fallar
   peticiones de otras partes del sistema.
   Lo encontré con una traza distribuida, no leyendo código:
   782 ms de 842 estaban en un solo SELECT.
   Lo que más me marcó no fue el índice GIN,
   fue que no teníamos alerta de saturación del pool.
   El arreglo de la causa tardó diez minutos;
   el de la detección era el que faltaba de verdad.

P: ¿Qué harías distinto si empezaras de nuevo?
R: Medir antes. Dediqué tiempo a optimizar el frontend
   por intuición y el problema estaba en una consulta.
   Ahora no toco rendimiento sin un número previo.
   Y escribiría las ADR desde el primer día:
   las empecé en la semana 15 y las cinco decisiones
   anteriores tuve que reconstruirlas de memoria.

P: ¿Cómo sabes que tu código funciona?
R: En tres niveles con propósito distinto.
   Unitarios sobre las reglas de dominio con dobles,
   que corren en milisegundos y me dicen si rompí una regla.
   Integración con la base de datos real en Testcontainers,
   porque las restricciones y las transacciones solo se
   prueban de verdad contra PostgreSQL.
   Y un test de arquitectura que falla si el dominio
   referencia la infraestructura, porque una regla
   que solo está en un documento se incumple en tres meses.

PREGUNTAS CONCEPTUALES CORTAS

P: Diferencia entre autenticación y autorización.
R: Autenticación es quién eres, autorización es qué puedes
   hacer. Se confunden porque van juntas, pero fallan distinto:
   un fallo de autenticación es dejar entrar a un desconocido,
   uno de autorización es dejar que un usuario legítimo
   vea el historial de la mascota de otro. Lo segundo
   es más común y más difícil de detectar.

P: ¿Qué es idempotencia y por qué te importa?
R: Que repetir la misma operación no cambia el resultado.
   Me importa porque en una red no sabes si tu petición
   no llegó o si llegó y se perdió la respuesta.
   Sin idempotencia no puedes reintentar, y sin reintentos
   no tienes resiliencia. En VetCare el POST de cita
   acepta una Idempotency-Key y guarda la respuesta
   de la primera ejecución.

P: ¿Por qué no usas un índice en todas las columnas?
R: Porque cada índice se mantiene en cada escritura
   y ocupa espacio, así que acelera lecturas y frena
   escrituras. Se añaden por consulta medida,
   no por si acaso. En mi caso puse uno parcial
   sobre citas futuras porque el 95% de las consultas
   solo mira hacia adelante.

P: ¿Cuándo usarías NoSQL?
R: Cuando no necesito transacciones entre entidades
   ni consultas por relaciones, y el acceso es por clave.
   En VetCare no es el caso: una cita toca veterinario,
   mascota y factura en la misma operación, y necesito
   una restricción de solape. Elegir NoSQL ahí sería
   reimplementar en código lo que la base me da gratis.

LA PREGUNTA QUE MÁS SE FALLA

P: ¿Qué no sabes?
R: Di la verdad con estructura, no te escondas.
   "No he operado un sistema con tráfico real de usuarios.
   Simulé carga e incidentes y escribí runbooks,
   pero sé que la presión de una guardia de verdad
   no es lo mismo. También sé que mi experiencia
   de despliegue es con compose, no con Kubernetes."
   Esto genera confianza. Decir que lo sabes todo
   te resta en cuanto hagan la segunda pregunta.

REGLAS DEL ENSAYO
  - En voz alta. Pensarlo no cuenta: la boca falla
    donde la cabeza iba fluida.
  - Con reloj. Dos minutos el proyecto, noventa segundos
    las conceptuales.
  - Grábate una vez. Es incómodo y es el ejercicio
    que más rápido mejora: vas a oír todas las muletillas
    y los sitios donde no sabes cómo terminar.`
        },
        steps: [
          'Contesta en voz alta y con reloj las cuatro preguntas de proyecto, sin leer. Si te trabas, no vuelvas a leer la respuesta modelo: anota en una palabra qué te faltó y repite.',
          'Grábate contestando la pregunta del proyecto en dos minutos. Escúchate una vez. Cuenta cuántas veces empiezas una frase sin saber cómo acaba.',
          'Coge las cinco preguntas conceptuales y contéstalas con la estructura de cuatro pasos: respuesta, porqué, trade-off, silencio. El cuarto paso es el que hay que practicar.',
          'Añade al banco las tres preguntas que te dejaron en blanco en la semana 23 y las de ayer, y escribe tu propia respuesta para cada una. Lo que te bloqueó es tu material, no una lista genérica.',
          'Prepara tu respuesta a "qué no sabes" por escrito. Dos huecos reales, nombrados, sin excusas y sin dramatizarlos.',
          'Si puedes, pide a alguien que te haga tres preguntas de la lista sin avisarte del orden. La diferencia entre contestar lo que esperabas y lo que te preguntan es la mitad del ejercicio.'
        ],
        vet: [
          'Verifica que cada afirmación de tus respuestas es cierta hoy en tu repositorio. Si dices que hay un test de arquitectura, ábrelo y ejecútalo; una afirmación que no se sostiene al segundo "muéstrame" cuesta más que no haberla hecho.',
          'Añade al final de docs/arquitectura.md un párrafo de "cómo explico este sistema en dos minutos". El día que lo necesites no vas a tener tiempo de reconstruirlo.'
        ],
        edge: [
          'Memorizar respuestas palabra por palabra se nota y se rompe con la primera repregunta. Memoriza la estructura y los números; las frases salen distintas cada vez y eso está bien.',
          'Contar un error propio funciona solo si incluye qué cambiaste después. Sin la corrección, la historia es una confesión; con ella, es evidencia de que aprendes.',
          'Hablar más de dos minutos sin que te interrumpan casi siempre es mala señal: significa que quien escucha dejó de seguirte. Termina y deja que te pregunten.'
        ],
        quiz: [
          { q: '¿Por qué se contesta primero y se da el contexto después?', a: 'Porque quien pregunta no sabe si conoces la respuesta hasta que la dices, y un minuto de contexto previo se interpreta como que estás ganando tiempo. Respuesta, porqué, trade-off y silencio mantiene el control de la conversación.' },
          { q: '¿Qué convierte "cuéntame un error" en una buena respuesta en vez de una confesión?', a: 'Que incluya el cambio de comportamiento posterior y, si existe, un número. "Optimicé por intuición y me equivoqué, ahora no toco rendimiento sin medir antes" es evidencia de aprendizaje; el mismo error sin la corrección es solo una debilidad declarada.' },
          { q: '¿Por qué el tercer paso, el trade-off, es el que más diferencia una respuesta?', a: 'Porque cualquiera puede repetir la definición de un concepto, pero decir cuándo no lo usarías demuestra que lo has aplicado y has visto su coste. Es la diferencia entre haber leído sobre índices y haber mantenido una tabla con demasiados.' },
          { q: '¿Por qué hay que practicar en voz alta y no mentalmente?', a: 'Porque explicar usa una habilidad distinta de entender, y falla en sitios donde el pensamiento iba fluido: ordenar la idea, elegir palabras y terminar la frase. Solo hablando descubres dónde se rompe, y grabarse acelera eso más que cualquier otra técnica.' }
        ],
        out: 'Un banco de preguntas propio con tus respuestas, cuatro respuestas de proyecto ensayadas con reloj, una grabación escuchada y tu respuesta honesta a "qué no sabes".',
        file: 'docs/entrevista-banco.md'
      },
      {
        t: 'Examen final: diseño de 45 minutos, auditoría y plan de los próximos seis meses (examen de la semana)',
        obj: 'Demostrar en una sola sesión que el método es tuyo, que el repositorio se sostiene solo y que sabes qué estudiar después.',
        why: 'Un curso que termina sin examen no termina: se abandona. Hoy cierras las 24 semanas con una prueba que no se puede aprobar leyendo, una auditoría que separa lo que crees que tienes de lo que de verdad está, y un plan que evita el vacío de la semana que viene, que es cuando casi todo el mundo pierde el impulso.',
        study: { r: 0, what: 'Sin lectura nueva. Antes de empezar, abre la lista de preguntas que te bloquearon durante las semanas 23 y 24. Dedica 10 minutos a buscar la respuesta de UNA sola, la que más te moleste no saber. Esa es la primera entrada de tu plan de estudio.',
        pasos: [
          'Abre la lista de preguntas que te bloquearon en las semanas 23 y 24.',
          'Elige una sola, la que más te moleste no saber, y busca su respuesta durante diez minutos.',
          'Escribe lo que encontraste y de qué fuente: es la primera entrada de tu plan de estudio.',
          'Prepara reloj, papel y el repositorio limpio antes de empezar el examen.'
        ] },
        ex: {
          title: 'Las tres partes del examen final',
          body: `PARTE 1 - DISEÑO DE 45 MINUTOS SIN AYUDA (45 min)

  Elige un enunciado que no hayas tocado.
  Tres opciones de dificultad creciente:
    A. Un sistema de préstamo de bicicletas de ciudad.
    B. Una plataforma de cursos con video y progreso.
    C. Un sistema de notificaciones multicanal
       (correo, SMS, push) para varias aplicaciones.

  Reglas estrictas:
    - 45 minutos de reloj. Cuando suena, paras.
    - Sin consultar tus documentos ni internet.
    - Los cinco pasos con su tiempo: 5 / 5 / 15 / 15 / 5.
    - Todo escrito. Nada "pensado".

  Rúbrica. Te puntúas tú, con honestidad:

    [ ] Hice al menos 4 preguntas antes de diseñar
    [ ] Escribí mis supuestos como supuestos
    [ ] Estimé tráfico con un cálculo visible
    [ ] Estimé almacenamiento a un año
    [ ] Cada estimación acaba en una conclusión de una línea
    [ ] Dibujé la arquitectura con menos de 8 cajas
    [ ] Justifiqué cada pieza con un número o la quité
    [ ] Elegí la parte difícil y dije por qué
    [ ] Profundicé en un flujo de escritura concreto
    [ ] Traté una condición de carrera explícitamente
    [ ] Dije qué consistencia necesita cada dato
    [ ] Nombré lo primero que se rompe y a qué carga
    [ ] Declaré al menos 3 trade-offs
    [ ] No mencioné ninguna tecnología sin justificarla

  12 de 14 o más: el método es tuyo.
  8 a 11: te falta disciplina de reloj, no conocimiento.
  Menos de 8: repite el ejercicio con otro enunciado
  antes de seguir. No es un fracaso, es que te faltan
  repeticiones; este es el tercer diseño de tu vida.

PARTE 2 - AUDITORÍA DEL REPOSITORIO (30 min)

  Recorre la lista. Cada línea se marca solo si existe
  Y pasa Y lo acabas de comprobar ahora, no de memoria.

  Arranque
    [ ] clon limpio + docker compose up funciona
    [ ] el README no miente en ningún paso
    [ ] .env.example tiene todas las variables
    [ ] no hay ningún secreto real en el repositorio

  Código
    [ ] dotnet build sin advertencias nuevas
    [ ] dotnet test todo verde
    [ ] npx tsc -b sin errores
    [ ] dotnet format --verify-no-changes pasa
    [ ] el test de arquitectura existe y pasa
    [ ] no quedan TODO ni código comentado muerto

  Datos
    [ ] migraciones aplicadas desde cero funcionan
    [ ] ex_cita_sin_solape existe y la probaste
    [ ] el simulacro de restauración está documentado
        con RTO medido
    [ ] la retención está escrita por tipo de dato

  Seguridad
    [ ] dotnet list package --vulnerable: limpio
    [ ] npm audit --omit=dev: limpio
    [ ] las cabeceras de seguridad están activas
    [ ] un dueño no puede ver las mascotas de otro
        (compruébalo con dos usuarios de verdad)
    [ ] los registros no contienen datos personales

  Operación
    [ ] CI verde en la rama principal
    [ ] hay trazas visibles en el panel
    [ ] existen las cuatro señales doradas en un panel
    [ ] el runbook está escrito y es seguible

  Documentos
    [ ] los 25 documentos existen y ninguno está a medias
    [ ] cada ADR tiene alternativa descartada y motivo
    [ ] el informe de rendimiento tiene antes y después
    [ ] el postmortem separa causa de detección

  Cada casilla sin marcar es una tarea, no un defecto moral.
  Escríbelas en una lista y ordénalas por lo que más
  afecta a alguien que llegue al repositorio mañana.

PARTE 3 - PLAN DE LOS PRÓXIMOS SEIS MESES (20 min)

  No "seguir estudiando". Eso no es un plan.

  Plantilla:

  ## Lo que ya sé hacer
  (tres frases. Sin modestia falsa y sin inventar.)
  Diseño de un sistema de tamaño medio con estimaciones.
  Una API de producción con pruebas, resiliencia,
  seguridad y observabilidad. Operar lo que escribí:
  medir, diagnosticar, revertir y documentar.

  ## Mis tres huecos reales
  (de la lista de preguntas que te bloquearon)
  1. ...
  2. ...
  3. ...

  ## Qué hago con cada hueco
  Hueco 1: [recurso concreto] + [algo que construyo con él]
  Hueco 2: ...
  Hueco 3: ...
  Regla: cada hueco se cierra construyendo algo,
  no leyendo. Un hueco cuyo plan es "leer un libro"
  sigue abierto en junio.

  ## Un proyecto nuevo, no VetCare
  VetCare ya demostró lo que tenía que demostrar.
  El segundo proyecto debe forzar algo que VetCare
  no te forzó. Buenas opciones:
    - Algo con tiempo real (WebSockets, presencia)
    - Algo con mucha escritura concurrente
    - Algo con procesamiento de datos por lotes
    - Algo móvil, si quieres ir por ahí
  Elección: ...
  Por qué: me obliga a ...

  ## Cadencia
  Horas por semana realistas: ...
  Días concretos: ...
  Cómo sé si voy bien: un entregable visible al mes.
  No "horas estudiadas": entregables.

  ## Fecha de revisión
  Dentro de 8 semanas vuelvo a este documento
  y lo actualizo con lo que de verdad pasó.
  (Ponlo en el calendario hoy. Un plan sin fecha
   de revisión es una lista de deseos.)

LO QUE ACABAS DE TERMINAR

  24 semanas. 144 días. Un sistema que:
  - captura requisitos y los convierte en un modelo
  - tiene reglas de negocio aisladas y verificadas
  - persiste en una base relacional con invariantes reales
  - expone una API con contrato, errores y versionado
  - se prueba en tres niveles y resiste fallos ajenos
  - tiene una interfaz que se siente rápida
  - autentica y autoriza de punta a punta
  - se construye y despliega sola
  - se mide, se observa y se diagnostica
  - se respalda, se restaura y se puede evolucionar
  - y está explicado de forma que otro lo entienda

  Casi nadie que se llama desarrollador junior
  puede decir eso de ningún proyecto propio.
  Lo que te falta no es conocimiento: son repeticiones
  y tráfico real. Y eso solo se consigue construyendo
  la siguiente cosa, que empieza la semana que viene.`
        },
        steps: [
          'Haz la parte 1 ahora, de un tirón, con el reloj puesto y sin consultar nada. Si te saltas esta parte, el examen no existe: es la única que no se puede aprobar con lo que ya tienes escrito.',
          'Puntúate con la rúbrica de 14 puntos siendo duro contigo. Marcar una casilla que no cumpliste solo te roba la información que el ejercicio te iba a dar.',
          'Haz la auditoría comprobando cada línea en el momento, ejecutando los comandos. Lo que recuerdas que funcionaba hace tres semanas no cuenta.',
          'Convierte cada casilla sin marcar en una tarea concreta, ordenada por impacto para alguien que llegue mañana al repositorio.',
          'Escribe el plan de seis meses con la plantilla, con un recurso concreto y algo construido por hueco, el proyecto nuevo elegido y justificado, y la cadencia en días reales de tu semana.',
          'Pon la fecha de revisión del plan en el calendario hoy mismo, a ocho semanas. Es el único paso de todo el curso que te protege de perder el impulso.'
        ],
        vet: [
          'Haz un commit final con mensaje "cierre: auditoría, respaldos y plan de continuación" y etiqueta el estado con git tag -a v1.0.0 -m "VetCare completo: 24 semanas". Un punto fijo al que puedes volver.',
          'Añade al README un enlace al plan de continuación. Demuestra que sabes lo que no sabes, y eso es parte del trabajo técnico.',
          'Pulsa «Marcar para repasar» y vuelve a leer docs/plan-continuacion.md dentro de una semana.'
        ],
        edge: [
          'Saltarse la parte 1 por cansancio es la forma más común de terminar el curso sin saber si aprendiste. Es el único ejercicio que mide método y no memoria.',
          'Una auditoría hecha de memoria es peor que ninguna: te deja con la falsa confianza de que todo está y descubres los huecos cuando alguien más los encuentra.',
          'Un plan de seis meses con más de tres huecos no es ambición, es dispersión. Tres cerrados vale más que diez empezados, y el plan tiene que caber en tu semana real, no en la ideal.'
        ],
        quiz: [
          { q: '¿Por qué el diseño de 45 minutos sin consultar nada es la parte que no se puede saltar?', a: 'Porque todo lo demás que tienes es evidencia de trabajo acumulado, y esta es la única prueba de que el método funciona en tu cabeza sin apoyo. Mide exactamente lo que te van a evaluar: pensar bajo reloj en un dominio desconocido.' },
          { q: '¿Por qué la auditoría exige comprobar cada punto en el momento en vez de recordarlo?', a: 'Porque un repositorio cambia y la memoria es optimista: lo que pasaba hace tres semanas pudo romperse con cualquier cambio posterior. Una casilla marcada de memoria produce falsa confianza, que es peor que un hueco conocido.' },
          { q: '¿Por qué cada hueco del plan debe cerrarse construyendo y no leyendo?', a: 'Porque leer produce reconocimiento y construir produce capacidad, y en una entrevista o en el trabajo te piden lo segundo. Un hueco cuyo plan es "leer un libro" se detecta fácil: sigue abierto seis meses después y suena idéntico a cuando lo escribiste.' },
          { q: '¿Por qué el siguiente proyecto no debe ser una extensión de VetCare?', a: 'Porque VetCare ya demostró lo que podía demostrar y seguir añadiéndole funciones solo repite habilidades que ya tienes. Un proyecto que te fuerce a algo nuevo, como tiempo real o escritura muy concurrente, genera aprendizaje; uno que te deja cómodo genera volumen.' },
          { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que terminar un sistema no es hacer que funcione, sino dejarlo en condiciones de que cambie sin romper a nadie, de que sobreviva a perder sus datos y de que otra persona lo entienda sin ti; y que mi propio conocimiento sigue la misma regla: solo cuenta cuando puedo explicarlo en voz alta, con un número y un trade-off, sobre un problema que nunca había visto.' }
        ],
        out: 'El diseño de 45 minutos puntuado con la rúbrica, la auditoría completa con su lista de tareas pendientes, docs/plan-continuacion.md escrito y la etiqueta v1.0.0 creada.',
        file: 'docs/plan-continuacion.md'
      }
    ]
  }
]);
