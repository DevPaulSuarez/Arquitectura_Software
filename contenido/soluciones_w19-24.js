/* Solución de referencia de cada examen semanal (día 6), semanas 19 a 24. */
window.SOLUCIONES = Object.assign(window.SOLUCIONES || {}, {

'w19d6': {
  intro: 'La sección 2 completa recorriendo las diez categorías del OWASP Top 10 (incluidas las que no aplican y por qué), la evidencia de los tres ataques prioritarios y los riesgos aceptados. El ejemplo del día muestra solo seis amenazas; aquí está el recorrido entero.',
  body: `## 2. Qué puede salir mal (OWASP Top 10, edición 2025)
| Cat. | Amenaza en VetCare                              | Impacto | Prob. | Prio. |
|------|-------------------------------------------------|---------|-------|-------|
| A01  | Un dueño lee el historial de otra mascota (IDOR)| Alto    | Media | 1     |
| A01  | Recepción ejecuta acciones de veterinario       | Medio   | Media | 2     |
| A02  | CORS abierto o cabeceras ausentes en producción | Medio   | Media | 2     |
| A03  | Dependencia con vulnerabilidad publicada        | Alto    | Media | 1     |
| A04  | Contraseñas débiles o hash rápido               | Alto    | Baja  | 2     |
| A05  | Inyección SQL en SqlQueryRaw del resumen mensual| Crítico | Baja  | 1     |
| A05  | XSS almacenado en nombre o notas de mascota     | Alto    | Baja  | 2     |
| A06  | Diseño: cancelar citas ajenas sin pertenencia   | Medio   | Baja  | 3     |
| A07  | Fuerza bruta y enumeración en el login          | Medio   | Alta  | 2     |
| A08  | Integridad: imagen Docker sin verificar origen  | Medio   | Baja  | 3     |
| A09  | Registros sin eventos de seguridad, o con datos | Medio   | Media | 2     |
|      | personales dentro                               |         |       |       |
| A10  | Manejo de excepciones que filtra detalles       | Bajo    | Media | 3     |
SSRF: no aplica porque VetCare nunca pide URLs que proporcione el usuario.

## Evidencia de los tres ataques prioritarios
1) IDOR en el historial (A01)
$ curl -i --cookie "vetcare_sesion=<dueño A>" \\
       http://localhost:5080/api/v1/mascotas/9c1b.../historial
HTTP/1.1 404 Not Found
Content-Type: application/problem+json
{"type":"/errores/no-encontrado","title":"Recurso no encontrado","status":404,...}
Test: DuenoA_HistorialDeMascotaDeB_Devuelve404

2) Inyección en el resumen mensual (A05)
$ curl -i "http://localhost:5080/api/v1/informes/resumen?anio=2026%20OR%201%3D1"
HTTP/1.1 422 Unprocessable Entity      <- anio es int: ni llega a la consulta
Y en código: SqlQueryRaw("... = {0}", anio)  (parámetro, no concatenación)

3) Dependencias (A03)
$ dotnet list package --vulnerable --include-transitive
The given project VetCare.Api has no vulnerable packages given the current sources.
$ npm audit --audit-level=high
found 0 vulnerabilities
CI: job "auditoria" en .github/workflows/ci.yml

## 3. Mitigaciones (estado real)
| Amenaza          | Mitigación                                 | Estado     |
|------------------|--------------------------------------------|------------|
| IDOR             | Pertenencia en la consulta + 404           | Hecho S18  |
| Roles            | Políticas por endpoint                     | Hecho S18  |
| Configuración    | CORS exacto, cinco cabeceras, CSP          | Hecho S19  |
| Dependencias     | Auditoría en CI + Dependabot               | Hecho S19  |
| Contraseñas      | BCrypt factor 12, longitud mínima 12       | Hecho S18  |
| Inyección        | Solo parámetros; revisión de SqlQueryRaw   | Hecho S19  |
| XSS              | React + urlSegura + CSP sin unsafe-inline  | Hecho S19  |
| Login            | Rate limit + respuesta idéntica en tiempo  | Hecho S18  |
| Imagen Docker    | Imagen oficial con versión fija            | PARCIAL: sin verificar firma |
| Registros        | Eventos de seguridad con ids, sin PII      | Hecho S19  |
| Excepciones      | Manejador global, 500 genérico             | Hecho S12  |

## 4. Riesgos aceptados
- Sin segundo factor: 4 empleados en red interna. Revisar si se abre a
  dueños por internet.
- JWT válido hasta 15 min tras cerrar sesión: duración corta y
  refresco revocable.
- Firma de imágenes Docker sin verificar: pendiente para producción.`
},

'w20d6': {
  intro: 'El resultado de la prueba de la carpeta limpia (con lo que faltaba en el README), el README de arranque corregido, el simulacro de rollback y la lista de la semana con su evidencia.',
  body: `PRUEBA DE LA CARPETA LIMPIA (primera pasada)
$ git clone git@github.com:tu-usuario/vetcare.git ~/vetcare-limpio && cd ~/vetcare-limpio
1. "cp .env.example .env"      -> .env.example no tenía JWT_CLAVE   ✗
2. "docker compose up -d"      -> la API arrancó antes que la base   ✗
                                  (faltaba condition: service_healthy)
3. Abrir http://localhost:8080 -> 404: el README no decía que la API
                                  vive en /health y /scalar          ✗
4. Migraciones                 -> el README no lo mencionaba         ✗
Segunda pasada tras corregir: de cero a la agenda funcionando en 6 min.

README (sección de arranque, corregida)
## Arrancar en local
Requisitos: Docker 24+ con Compose v2.

    git clone <url> vetcare && cd vetcare
    cp .env.example .env            # rellena DB_PASSWORD y JWT_CLAVE
    docker compose up -d --build
    ./database/migrar.sh            # aplica las migraciones a la base del contenedor

- Web:            http://localhost:5173
- API (docs):     http://localhost:8080/scalar
- Salud:          http://localhost:8080/health/ready
- Datos de ejemplo: docker compose exec -T db psql -U postgres -d vetcare < database/seed.sql

SIMULACRO DE ROLLBACK
$ git log --oneline -2
a41c2e9 Añade el campo sexo a mascota (expand: columna nullable)
7d03b18 Busca mascotas por chip
$ docker build -t vetcare-api:7d03b18 . (desde el commit 7d03b18)
$ VETCARE_TAG=7d03b18 docker compose up -d --no-deps api
$ curl -s localhost:8080/health/ready  -> Healthy
$ POST /api/v1/citas                   -> 201
Funciona: la versión anterior ignora la columna nueva porque la
migración solo añadió (expand). Si hubiera borrado o renombrado una
columna, el rollback habría fallado.

LISTA DE LA SEMANA (con evidencia)
[x] Historial legible ............ git log --oneline: 0 commits "fix"/"wip"
[x] .gitignore con secretos ...... git check-ignore .env -> .env
[x] Conflicto resuelto ........... commit e5f1a20 "Resuelve conflicto en README"
[x] Dockerfile multietapa sin root  whoami -> app
[x] .dockerignore ................ imagen sin .git ni bin/obj
[x] Compose con healthchecks y volumen  down + up conserva datos
[x] CI verde contra PostgreSQL ... enlace a la última ejecución
[x] Auditoría en CI .............. job "auditoria"
[x] main protegida ............... Settings -> Branches (captura)
[x] README en tres pasos ......... arriba
[x] Despliegue documentado ....... docs/despliegue.md

$ git tag -a v0.1.0 -m "VetCare reproducible: compose, CI y despliegue documentado"
$ git push --tags

GUION (3 minutos)
Se despliega construyendo la imagen etiquetada con el sha, aplicando
solo migraciones compatibles hacia atrás y arrancando la versión
nueva; verifico /health/ready y una cita de punta a punta. Si sale
mal, vuelvo a la imagen del commit anterior con un comando: funciona
porque nunca borro ni renombro columnas en el mismo despliegue.`
},

'w21d6': {
  intro: 'El ejemplo del día ya es un informe completo; úsalo como modelo de las cinco secciones. Aquí tienes lo que no muestra: la verificación de la lista con su evidencia, la ronda final de reproducibilidad y el guion de tres minutos de una optimización.',
  body: `VERIFICACIÓN DE LA LISTA DE LA SEMANA
[x] Objetivos por percentil ............ sección 1 (p95 por operación)
[x] Línea base con volumen realista .... 50.000 citas, 10.000 mascotas
[x] Tres peores consultas con EXPLAIN .. pg_stat_statements top 3:
      1. agenda por veterinario y día   Seq Scan -> Index Scan
      2. historial de mascota           N+1 (38 consultas) -> 1
      3. búsqueda por nombre (ILIKE)    Seq Scan -> GIN pg_trgm
[x] N+1 eliminados ..................... log de EF: 1 consulta por pantalla
[x] Cachés justificadas o descartadas .. catálogo de vacunas: SÍ (30 min);
                                        agenda: NO (cambia constantemente)
[x] Lighthouse antes y después ......... LCP 4,1 s -> 1,9 s; CLS 0,18 -> 0,02
[x] Cada cambio con medición ........... sección 2

RONDA FINAL DE REPRODUCIBILIDAD (hoy, mismo comando del día 2)
$ bombardier -c 10 -n 500 -l "http://localhost:8080/api/v1/agenda?dia=2026-10-10"
| Operación            | Informe p95 | Hoy p95 | Diferencia |
|----------------------|-------------|---------|------------|
| GET agenda           | 115 ms      | 121 ms  | +5 %  ✓    |
| POST citas           | 390 ms      | 402 ms  | +3 %  ✓    |
| GET mascotas         | 95 ms       | 93 ms   | -2 %  ✓    |
Todas dentro del 10 %: el informe es reproducible.

GUION DE 3 MINUTOS: "cuéntame una vez que mejoraste el rendimiento"
Situación: la agenda del día de VetCare tenía un p95 de 840 ms con
  50.000 citas; el objetivo era 300 ms porque la recepcionista la usa
  con el cliente al teléfono.
Medición: bombardier para la línea base y pg_stat_statements para ver
  qué consulta acumulaba más tiempo total.
Hallazgo: EXPLAIN ANALYZE mostraba un Seq Scan que leía 50.000 filas
  para devolver 37. Yo creía que el problema era la serialización JSON:
  medí y eran 8 ms de 840.
Cambio: índice en cita(inicio) y, después, eliminar un N+1 de 38
  consultas con una proyección.
Resultado: p95 de 840 a 115 ms, con un coste medido del 3 % en las
  escrituras. Y descarté cachear la agenda: servir datos viejos
  permitiría agendar en un hueco ocupado.`
},

'w22d6': {
  intro: 'Un incidente distinto al del ejemplo (el pool de conexiones reducido a 2), con el tiempo de diagnóstico medido, las correcciones al manual y el postmortem completo en siete secciones.',
  body: `# Postmortem 01 - Agotamiento del pool de conexiones
Fecha: 2026-xx-xx · Duración: 23 min (16:00 - 16:23)
Impacto: 41 % de las peticiones de agenda con más de 5 s; 12 errores
  503 por timeout esperando conexión. Presupuesto de error del SLO de
  agenda consumido: 18 % del mes.

## Cronología
16:00  Avería provocada: Maximum Pool Size=2 en la configuración.
16:03  Alerta lenta (6x durante 30 min) aún sin disparar; noto el
       problema al usar la web: la agenda tarda.
16:05  Panel nivel 1: latencia p95 4,8 s; errores 2 %; tráfico normal.
16:07  Nivel 2: afecta a TODOS los endpoints por igual -> no es una
       consulta, es algo compartido.
16:11  Nivel 3: saturación del pool al 100 % y 30 peticiones esperando
       conexión. Las consultas en sí tardan 3 ms (trazas).
16:14  Causa identificada: hay conexiones de sobra en PostgreSQL
       (8 de 100), pero la aplicación no las pide -> límite del pool.
       Tiempo hasta la causa: 14 minutos.
16:19  Mitigación: configuración restaurada y reinicio de la API.
16:23  Verificado: p95 110 ms, error 0 %, una cita creada de punta a punta.

## Causa raíz
El límite del pool de Npgsql quedó en 2. Con 10 peticiones simultáneas,
8 esperaban conexión; al superar el timeout de espera, devolvían 503.

## Por qué no lo detectamos antes
- La configuración del pool no se valida al arrancar ni aparece en el
  panel.
- No había alerta de saturación del pool, solo de errores y latencia.
- La alerta de latencia era solo lenta: tardaría 30 min en sonar.

## Qué funcionó bien
- El nivel 2 descartó en 2 minutos que fuera una consulta concreta.
- Las trazas mostraron que el tiempo estaba ANTES de la consulta.

## Acciones
| Acción                                                  | Tipo      | Fecha  |
|---------------------------------------------------------|-----------|--------|
| Alerta de saturación del pool > 80 % durante 5 min      | Detección | +3 días|
| Alerta rápida también por latencia, no solo por errores | Detección | +3 días|
| Test de arranque que falla si el pool es < 20           | Causa     | +1 sem |
| Panel nivel 1: añadir "peticiones esperando conexión"   | Detección | +1 sem |

## Lo que aprendimos
Un recurso agotado se ve como lentitud general, no como errores. Mirar
primero si el problema afecta a todo o a una parte ahorró la mitad del
diagnóstico.

CORRECCIONES AL MANUAL "error alto / latencia alta"
+ Paso 2 nuevo: ¿afecta a todos los endpoints o a uno? Si a todos,
  mirar recursos compartidos (pool, CPU, base) antes que consultas.
+ Paso 4 nuevo: comparar tiempo de la traza con tiempo de la consulta;
  si la consulta es rápida, el problema está antes (esperas).
- Quitado: "reiniciar la base" como primera mitigación (no era el caso
  y habría cortado el servicio sin motivo).

VERIFICACIÓN DE LA SEMANA
[x] Logs estructurados con correlación   [x] Cuatro señales doradas
[x] Dos métricas de negocio              [x] Trazas con tramos propios
[x] SLI y SLO con presupuesto            [x] Dos alertas por consumo
[x] Panel en tres niveles                [x] Dos manuales de guardia
[x] Postmortem escrito (este)`
},

'w23d6': {
  intro: 'El ejemplo del día ya es el diseño completo de VetCare a escala. Aquí tienes la otra mitad del examen: el segundo enunciado (un acortador de URLs) resuelto en 30 minutos con el mismo método, y un ejemplo de las tres lagunas anotadas.',
  body: `# Diseño: acortador de URLs (30 minutos)

## 1. Requisitos (4 min)
Preguntas: ¿cuántas URLs nuevas al día? ¿cuántas visitas? ¿caducan?
¿alias personalizados? ¿estadísticas?
Supuestos: 1 millón de URLs nuevas al día, 100 visitas por URL
(100:1 lecturas), no caducan, alias opcional, contador de clics
aproximado.
No funcionales: la redirección en < 50 ms p95; un código nunca apunta
a dos URLs distintas; la redirección es más importante que crear.

## 2. Estimación (4 min)
Escrituras: 1 M / 100.000 s ≈ 10/s (pico 100/s).
Lecturas:   100 M / 100.000 s ≈ 1.000/s (pico 10.000/s).
Almacenamiento: 500 bytes x 1 M x 365 ≈ 180 GB al año.
Código: base62 con 7 caracteres = 62^7 ≈ 3,5 billones -> sobra.
Conclusión: el reto son las lecturas (caché) y generar códigos únicos
sin colisiones entre instancias.

## 3. Diseño general (7 min)
  Navegador -> Balanceador -> API x N (sin estado)
                               |-> Caché (código -> URL)   lecturas
                               |-> PostgreSQL (código PK)  verdad
                               +-> Cola -> contador de clics (asíncrono)

## 4. Profundizar: generar el código sin colisiones (10 min)
Opción A: hash de la URL y cortar -> colisiones; hay que comprobar y
  reintentar.
Opción B: contador global -> único, pero un punto central.
Elegida: secuencia de PostgreSQL por bloques. Cada instancia reserva
  un bloque de 1.000 ids (UPDATE ... RETURNING) y los codifica en
  base62. Sin colisiones, sin coordinar cada petición.
Garantía final: PRIMARY KEY en el código; si un alias personalizado ya
  existe -> 409.
Redirección: buscar en caché; si no está, en la base y guardar en
  caché. 301 si no hay estadísticas, 302 si hay que contar clics.

## 5. Compromisos (5 min)
- Contador de clics eventual (segundos de retraso): aceptado.
- Códigos predecibles (secuenciales): si importa, barajar los bits.
- Una región: latencia mayor lejos; CDN delante de las redirecciones
  populares.
- Lo primero que se rompe: la caché (memoria) a ~10.000 lecturas/s;
  después, el tamaño de la tabla (particionar por fecha de creación).

LAS TRES LAGUNAS ANOTADAS (ejemplo)
1. ¿Cómo invalido la caché de una URL que se borra por abuso, con
   varias instancias y cachés locales?
2. ¿Cuándo conviene 301 frente a 302 si los navegadores cachean el 301?
3. En VetCare multi-clínica: ¿cómo funciona exactamente la seguridad
   por fila (row-level security) de PostgreSQL con EF Core?`
},

'w24d6': {
  intro: 'Un ejemplo de las partes 1 y 3: el diseño de la opción A (préstamo de bicicletas) puntuado con la rúbrica, y un docs/plan-continuacion.md relleno. Tu plan debe salir de tus propios huecos; este muestra el nivel de concreción que se espera.',
  body: `PARTE 1 - DISEÑO: préstamo de bicicletas de ciudad (45 min)

1. Requisitos (5)
   Preguntas: ¿cuántas estaciones y bicis? ¿pago por minuto o abono?
   ¿la bici se desbloquea desde la app? ¿qué pasa sin cobertura?
   Supuestos: 500 estaciones, 8.000 bicis, 200.000 viajes al día,
   desbloqueo desde la app, la estación tiene conexión.
2. Estimación (5)
   200.000 viajes / 100.000 s ≈ 2 alquileres/s (pico 20/s).
   Estado de estaciones: 500 x cada 10 s = 50 escrituras/s.
   Almacenamiento: 1 KB x 200.000 x 365 ≈ 73 GB al año.
   Conclusión: el volumen es pequeño; el reto es que dos personas no
   desbloqueen la misma bici.
3. Diseño (15)
   App -> Balanceador -> API x2 -> PostgreSQL (+ réplica)
   Estaciones -> cola -> procesador de estado (asíncrono)
   Mapa de disponibilidad: lecturas desde caché (eventual, 10 s).
4. Profundizar: alquilar una bici (15)
   UPDATE bici SET estado = 'en_uso', usuario_id = $1
    WHERE id = $2 AND estado = 'libre';     -> 0 filas = ya no está libre
   Una sola sentencia: no hay carrera entre leer y escribir.
   Idempotency-Key: si la app reintenta por mala cobertura, no se
   cobran dos alquileres. Orden al estación por outbox.
5. Compromisos (5)
   - Mapa eventual (10 s): puede mostrar una bici que ya se llevaron.
   - Una región. - Sin funcionamiento sin conexión en la estación.
   Primero se rompe: picos de las 8:00 en estaciones céntricas
   (contención en pocas filas), no el volumen total.

RÚBRICA (autoevaluación honesta): 12 / 14
  [x] 4 preguntas   [x] supuestos   [x] tráfico   [x] almacenamiento
  [x] conclusiones  [x] < 8 cajas   [ ] cada pieza con número (la caché
  del mapa no lo tenía)  [x] parte difícil  [x] flujo de escritura
  [x] carrera  [x] consistencia por dato  [ ] carga de ruptura con
  número  [x] 3 trade-offs  [x] sin tecnología injustificada

PARTE 3 - docs/plan-continuacion.md

## Lo que ya sé hacer
Diseñar un sistema de tamaño medio partiendo de requisitos y
estimaciones. Construir una API .NET de producción con pruebas,
resiliencia, seguridad y observabilidad. Operar lo que construyo:
medir, diagnosticar, revertir y documentar.

## Mis tres huecos reales
1. Mensajería real (colas, reintentos, mensajes duplicados).
2. Kubernetes y despliegue en la nube; solo usé Docker Compose.
3. Estructuras de datos y algoritmos bajo presión de entrevista.

## Qué hago con cada hueco
1. Documentación de RabbitMQ + "Enterprise Integration Patterns"
   (capítulos de mensajería) -> mover el outbox de VetCare a una cola
   real con consumidor idempotente.
2. Curso oficial de Kubernetes (kubernetes.io/docs/tutorials) ->
   desplegar VetCare en un clúster local con kind y health checks.
3. 3 problemas semanales en LeetCode (arrays, hash maps, grafos)
   explicando en voz alta la complejidad -> un cuaderno con 50
   resueltos.

## Un proyecto nuevo, no VetCare
Elección: reservas de pistas deportivas con disponibilidad en tiempo
real. Por qué: me obliga a usar WebSockets y mucha escritura
concurrente sobre los mismos huecos, que VetCare no forzó.

## Cadencia
6 horas por semana: martes y jueves de 19:00 a 21:00, sábado de
10:00 a 12:00. Señal de que voy bien: un entregable visible al mes
(enero: outbox con cola; febrero: VetCare en kind; marzo: primera
versión del proyecto nuevo).

## Fecha de revisión
2026-12-xx (8 semanas). En el calendario desde hoy.

$ git tag -a v1.0.0 -m "Fin de la ruta de 24 semanas" && git push --tags`
}

});
