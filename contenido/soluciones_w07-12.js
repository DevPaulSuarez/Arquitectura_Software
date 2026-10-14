/* Solución de referencia de cada examen semanal (día 6), semanas 7 a 12. */
window.SOLUCIONES = Object.assign(window.SOLUCIONES || {}, {

'w7d6': {
  intro: 'Un docs/diseno.md completo: la tabla de actores, el diagrama de dependencias verificado y una frase con ejemplo por cada letra de SOLID. Esa última sección es, literalmente, tu respuesta de entrevista.',
  body: `# VetCare - Diseño

## 1. Propósito de cada clase
| Clase                | Existe para...                                       |
|----------------------|------------------------------------------------------|
| AgendadorDeCitas     | decidir si una cita se puede agendar y guardarla     |
| CalculadoraPrecio    | calcular el precio de una visita según sus reglas    |
| GeneradorDeRecibo    | dar formato al recibo que se entrega al dueño        |
| NotificadorEmail     | enviar avisos por correo (infraestructura)           |

## 2. Actores y clases (SRP)
| Actor que pide cambios | Clase                 | Ejemplo de cambio             |
|------------------------|-----------------------|-------------------------------|
| Recepción              | AgendadorDeCitas      | duración mínima de las citas  |
| Dueño de la clínica    | CalculadoraPrecio     | nueva tarifa de urgencias     |
| Contabilidad           | GeneradorDeRecibo     | datos fiscales en el recibo   |
| Equipo técnico         | NotificadorEmail      | cambiar de proveedor de correo|

## 3. Interfaces (ISP)
Antes: IRepositorio con 7 métodos (Guardar, Buscar, Eliminar, Todos,
       Exportar, Respaldar, Contar).
Después:
  ILeerCitas       PorId, DelDia               (agenda, reportes)
  IGuardarCitas    Guardar                     (agendador)
  INotificador     EnviarAsync                 (recordatorios)
  IRelojSistema    Ahora                       (todo lo que usa la fecha)
Exportar y Respaldar salen del dominio: son tareas de operación.

## 4. Dependencias (DIP)
graph LR
  Api --> Domain
  Api --> Infrastructure
  Infrastructure --> Domain

Comprobación: src/VetCare.Domain/VetCare.Domain.csproj no tiene
ninguna ProjectReference ni paquetes de infraestructura.
Búsqueda de "using VetCare.Infrastructure" en Domain: 0 resultados.

## 5. SOLID en VetCare (defensa oral)
S  Cada clase tiene un solo actor que pide cambios: separé
   CalculadoraPrecio (dueño de la clínica) de GeneradorDeRecibo
   (contabilidad).
O  Una tarifa nueva es una clase IReglaPrecio nueva; la calculadora
   no se toca (lo comprobé con git status: solo un archivo nuevo).
L  NotaInterna no se puede firmar, así que saqué Firmar del padre a
   IFirmable; ningún hijo lanza NotImplementedException.
I  AgendadorDeCitas recibe ILeerCitas + IGuardarCitas, no un
   repositorio de siete métodos que no usa.
D  El dominio define INotificador; NotificadorEmail vive en
   Infrastructure y la flecha apunta hacia el dominio.`
},

'w8d6': {
  intro: 'El repositorio en memoria funcionando con la regla de solapamiento probada, y las fichas de patrones en docs/diseno.md. La columna «cuándo NO usarlo» es la que demuestra criterio.',
  body: `// Regla de solapamiento en AgendadorDeCitas
public async Task<Cita> AgendarAsync(Guid mascotaId, Guid vetId,
                                     DateTime inicio, TimeSpan duracion)
{
    var cita = Cita.Agendar(mascotaId, vetId, inicio, duracion, _reloj.Ahora);
    if (await _repo.ExisteSolapadaAsync(vetId, cita.Inicio, cita.Fin))
        throw new HorarioOcupadoException(vetId, cita.Inicio);
    await _repo.AgregarAsync(cita);
    await _repo.GuardarCambiosAsync();
    return cita;
}

// Prueba en el Playground
10:00-10:30 vet A ............ OK, agendada
10:15-10:45 vet A ............ RECHAZADA: horario ocupado      (solape parcial)
10:30-11:00 vet A ............ OK, agendada                    (contigua: no solapa)
10:00-10:30 vet B ............ OK, agendada                    (otro veterinario)
09:00-12:00 vet A ............ RECHAZADA: horario ocupado      (contiene a otras)

# docs/diseno.md - Fichas de patrones

## Strategy - descuentos
Problema:  la política de descuento cambia según decide el dueño.
Solución:  IPoliticaDescuento con una clase por política; Facturador
           recibe una por constructor.
En VetCare: SinDescuento, DescuentoFidelidad, DescuentoMultiMascota.
NO usarlo: si solo hay una forma de calcular y no va a cambiar; un
           método normal es más simple.

## Factory - documentos clínicos
Problema:  qué documento crear depende del tipo de visita, y esa
           decisión estaba copiada en varios sitios.
Solución:  IFabricaDocumentos.Crear(tipo, visita); el único switch
           por tipo vive ahí.
NO usarlo: si solo hay una clase o crearla es trivial (new basta).

## Adapter - notificaciones
Problema:  el SDK del proveedor de correo tiene su propio idioma y
           sus propios errores.
Solución:  INotificador en el dominio; NotificadorSendGrid traduce
           tipos y excepciones.
NO usarlo: si la librería ya habla tu idioma y no vas a cambiarla
           (por ejemplo, ILogger).

## Repository - citas
Problema:  el dominio necesita guardar y buscar citas sin saber que
           existe PostgreSQL, y probarse sin base de datos.
Solución:  IRepositorioCitas con métodos de intención
           (ExisteSolapadaAsync) y una versión en memoria para tests.
NO usarlo: para lecturas de pantallas e informes: ahí una consulta
           proyectada directa es más simple (CQRS ligero, semana 15).
           EF Core ya es un repositorio; envolverlo solo se justifica
           por los tests y por nombrar consultas del negocio.`
},

'w9d6': {
  intro: 'database/reports.sql con los cuatro reportes y la transacción de facturación probada en sus dos caminos. Compara especialmente el uso de LEFT JOIN con el filtro en el ON y el COUNT FILTER.',
  body: `-- database/reports.sql

-- 1. Citas por veterinario este año (incluye a quien no tiene citas)
SELECT v.nombre,
       count(c.id)                                     AS total,
       count(*) FILTER (WHERE c.estado = 'cancelada')  AS canceladas,
       count(*) FILTER (WHERE c.estado = 'atendida')   AS atendidas
  FROM veterinario v
  LEFT JOIN cita c ON c.veterinario_id = v.id
                  AND c.inicio >= DATE '2026-01-01'
 GROUP BY v.id, v.nombre
 ORDER BY total DESC;

-- 2. Ingresos por mes
SELECT date_trunc('month', f.fecha)::date AS mes,
       sum(lf.monto)                      AS ingresos,
       count(DISTINCT f.id)               AS facturas
  FROM factura f
  JOIN linea_factura lf ON lf.factura_id = f.id
 GROUP BY 1
 ORDER BY 1;

-- 3. Especies más atendidas (por visitas, no por mascotas)
SELECT m.especie, count(*) AS visitas
  FROM visita vi
  JOIN mascota m ON m.id = vi.mascota_id
 GROUP BY m.especie
 ORDER BY visitas DESC;

-- 4. Duración media de la consulta por veterinario, en minutos
SELECT v.nombre,
       round(avg(extract(epoch FROM (c.fin - c.inicio)) / 60), 1) AS min_promedio
  FROM cita c
  JOIN veterinario v ON v.id = c.veterinario_id
 WHERE c.estado = 'atendida'
 GROUP BY v.nombre
HAVING count(*) >= 5;          -- con menos de 5 la media no dice nada

-- 5. Transacción de facturación: camino feliz
BEGIN;
  INSERT INTO factura (id, dueno_id, total, fecha)
  SELECT gen_random_uuid(), id, 0, now() FROM dueno WHERE email = 'ana@example.com'
  RETURNING id AS factura_id \\gset
  INSERT INTO linea_factura (factura_id, concepto, monto) VALUES
    (:'factura_id', 'Consulta general', 35.00),
    (:'factura_id', 'Vacuna rabia',     18.50);
  UPDATE factura SET total = (SELECT sum(monto) FROM linea_factura
                               WHERE factura_id = :'factura_id')
   WHERE id = :'factura_id';
COMMIT;
-- Comprobación: la factura existe con total 53.50 y dos líneas.

-- 6. Transacción con error: nada debe quedar
BEGIN;
  INSERT INTO factura (id, dueno_id, total, fecha)
  SELECT gen_random_uuid(), id, 0, now() FROM dueno WHERE email = 'ana@example.com'
  RETURNING id AS factura_id \\gset
  INSERT INTO linea_factura (factura_id, concepto, monto)
  VALUES (:'factura_id', 'Error a propósito', -10.00);
  -- ERROR: new row ... violates check constraint "ck_linea_monto_positivo"
  -- current transaction is aborted, commands ignored until end of transaction block
ROLLBACK;
-- Comprobación:
SELECT count(*) FROM factura WHERE id = :'factura_id';   -- 0

-- Guion de 5 minutos
-- tipos: uuid (ids públicos), numeric(10,2) (dinero exacto),
--        timestamptz (instantes con zona), text (nombres)
-- constraints: peso > 0, fin > inicio, estado en lista cerrada,
--              email único sin mayúsculas, FK con RESTRICT
-- agenda del día: cita JOIN mascota JOIN dueno JOIN veterinario,
--                 filtro por rango de fecha, ORDER BY inicio`
},

'w10d6': {
  intro: 'Un database/README.md que documenta el lost update reproducido, las tres defensas probadas y la decisión para VetCare. Lo valioso es que cada defensa tiene su resultado observado, no solo la teoría.',
  body: `# Base de datos de VetCare - concurrencia

## 1. El bug, reproducido
Dos sesiones de psql sobre agenda(id=1, cupos=1), Read Committed:
  A: BEGIN; SELECT cupos ... -> 1
  B: BEGIN; SELECT cupos ... -> 1
  A: UPDATE agenda SET cupos = 0 WHERE id = 1; COMMIT;
  B: UPDATE agenda SET cupos = 0 WHERE id = 1; COMMIT;
Resultado: dos citas agendadas, cupos = 0. Se perdió una actualización.

## 2. Defensa 1 - pesimista (SELECT ... FOR UPDATE)
  A: SELECT cupos ... FOR UPDATE -> 1
  B: SELECT cupos ... FOR UPDATE -> se queda esperando
  A: UPDATE ... cupos = cupos - 1; COMMIT;
  B: (se desbloquea) -> lee 0 -> no agenda
Resultado: correcto. Coste: B esperó 4 s mientras A tenía la fila.

## 3. Defensa 2 - optimista (columna version)
  A y B leen version = 7
  A: UPDATE ... SET cupos = cupos - 1, version = version + 1
     WHERE id = 1 AND version = 7;   -> UPDATE 1
  B: el mismo UPDATE                -> UPDATE 0
Resultado: correcto. B no espera, pero debe releer y reintentar o
avisar al usuario. Es lo que hace EF Core con [ConcurrencyCheck].

## 4. Defensa 3 - la regla vive en la base (exclusion constraint)
  A: BEGIN; INSERT cita vet X 10:00-10:30;     (sin COMMIT)
  B: INSERT cita vet X 10:15-10:45;            -> espera a A
  A: COMMIT;
  B: ERROR: conflicting key value violates exclusion constraint
     "ex_cita_sin_solape"   (SQLSTATE 23P01)
Repetido 10 veces cambiando el orden: la constraint gana siempre.

## 5. Decisión para VetCare
| Caso                         | Defensa                    | Por qué                      |
|------------------------------|----------------------------|------------------------------|
| Solape de citas              | Exclusion constraint       | Atómica, sin código, imposible de saltar |
| Editar la ficha de mascota   | Optimista (version)        | Conflictos raros; no bloquear la pantalla |
| Descontar stock de vacunas   | Una sola sentencia:        | Sin ventana entre leer y escribir |
|                              | SET stock = stock - 1      |                              |
|                              | WHERE id = $1 AND stock > 0|                              |
Nivel de aislamiento: Read Committed por defecto. No subo a
Serializable: no tengo una anomalía que lo justifique y obligaría a
reintentar transacciones (error 40001).

## 6. Resumen para la defensa oral
Índices: multicolumna (veterinario_id, inicio), de 180 ms a 0,4 ms.
EXPLAIN: Seq Scan -> Index Scan; leo estimado frente a real.
Migraciones: numeradas, nunca se editan; NOT NULL en tres pasos.
Concurrencia: lo anterior.`
},

'w11d6': {
  intro: 'Un docs/openapi.yaml con seis endpoints que complementa el ejemplo del día: incluye la cancelación como subrecurso, el historial, la paginación por cursor y respuestas de error reutilizadas con $ref. Pégalo en editor.swagger.io para verlo.',
  body: `openapi: 3.1.0
info:
  title: VetCare API
  version: 1.0.0
servers:
  - url: http://localhost:5080/api/v1

paths:
  /citas:
    get:
      summary: Lista las citas, filtradas y paginadas por cursor
      parameters:
        - { name: veterinarioId, in: query, schema: { type: string, format: uuid } }
        - { name: dia, in: query, schema: { type: string, format: date } }
        - { name: estado, in: query, schema: { $ref: '#/components/schemas/EstadoCita' } }
        - { name: limite, in: query, schema: { type: integer, default: 20, maximum: 100 } }
        - { name: cursor, in: query, schema: { type: string } }
      responses:
        '200':
          description: Página de citas
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PaginaCitas' }
        '422': { $ref: '#/components/responses/Validacion' }
    post:
      summary: Agenda una cita
      parameters:
        - { name: Idempotency-Key, in: header, required: true, schema: { type: string, format: uuid } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CrearCitaRequest' }
      responses:
        '201':
          description: Cita creada
          headers: { Location: { schema: { type: string } } }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/CitaResponse' }
        '404': { $ref: '#/components/responses/NoEncontrado' }
        '409': { $ref: '#/components/responses/Conflicto' }
        '422': { $ref: '#/components/responses/Validacion' }

  /citas/{id}:
    get:
      summary: Obtiene una cita
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      responses:
        '200':
          description: La cita
          content:
            application/json:
              schema: { $ref: '#/components/schemas/CitaResponse' }
        '404': { $ref: '#/components/responses/NoEncontrado' }

  /citas/{id}/cancelacion:
    post:
      summary: Cancela una cita (la cita no se borra, queda en el historial)
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [motivo]
              properties: { motivo: { type: string, maxLength: 200 } }
      responses:
        '200':
          description: Cita cancelada
          content:
            application/json:
              schema: { $ref: '#/components/schemas/CitaResponse' }
        '404': { $ref: '#/components/responses/NoEncontrado' }
        '409': { $ref: '#/components/responses/Conflicto' }

  /mascotas/{id}:
    get:
      summary: Obtiene la ficha de una mascota
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      responses:
        '200':
          description: La mascota
          content:
            application/json:
              schema: { $ref: '#/components/schemas/MascotaResponse' }
        '404': { $ref: '#/components/responses/NoEncontrado' }

  /mascotas/{id}/historial:
    get:
      summary: Visitas y vacunas de una mascota, de la más reciente a la más antigua
      parameters: [ { $ref: '#/components/parameters/Id' } ]
      responses:
        '200':
          description: Historial
          content:
            application/json:
              schema:
                type: object
                properties:
                  visitas: { type: array, items: { $ref: '#/components/schemas/VisitaResponse' } }
        '404': { $ref: '#/components/responses/NoEncontrado' }

components:
  parameters:
    Id: { name: id, in: path, required: true, schema: { type: string, format: uuid } }
  schemas:
    EstadoCita: { type: string, enum: [confirmada, atendida, cancelada] }
    CrearCitaRequest:
      type: object
      required: [mascotaId, veterinarioId, inicio, duracionMinutos]
      properties:
        mascotaId: { type: string, format: uuid }
        veterinarioId: { type: string, format: uuid }
        inicio: { type: string, format: date-time }
        duracionMinutos: { type: integer, minimum: 15, maximum: 120 }
        motivo: { type: string, maxLength: 200 }
    CitaResponse:
      type: object
      properties:
        id: { type: string, format: uuid }
        mascotaId: { type: string, format: uuid }
        veterinarioId: { type: string, format: uuid }
        inicio: { type: string, format: date-time }
        fin: { type: string, format: date-time }
        estado: { $ref: '#/components/schemas/EstadoCita' }
    PaginaCitas:
      type: object
      properties:
        datos: { type: array, items: { $ref: '#/components/schemas/CitaResponse' } }
        siguienteCursor: { type: [string, 'null'] }
    MascotaResponse:
      type: object
      properties:
        id: { type: string, format: uuid }
        nombre: { type: string }
        especie: { type: string, enum: [perro, gato, otro] }
        nacimiento: { type: string, format: date }
    VisitaResponse:
      type: object
      properties:
        fecha: { type: string, format: date-time }
        motivo: { type: string }
        veterinario: { type: string }
    ProblemDetails:
      type: object
      properties:
        type: { type: string }
        title: { type: string }
        status: { type: integer }
        detail: { type: string }
        traceId: { type: string }
        errors: { type: object, additionalProperties: { type: array, items: { type: string } } }
  responses:
    NoEncontrado:
      description: El recurso no existe
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
    Conflicto:
      description: Choca con el estado actual (horario ocupado, cita ya cancelada)
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
    Validacion:
      description: Datos de entrada inválidos, con el error de cada campo
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/ProblemDetails' } } }`
},

'w12d6': {
  intro: 'El checklist final respondido con su prueba, el Program.cs ordenado de la API y el guion de la demo con los comandos exactos. Si tu Program.cs pasa de 60 líneas, mira cómo aquí todo se delega en métodos de extensión.',
  body: `CHECKLIST FINAL (con la prueba de cada punto)
[x] Endpoints del contrato ........ los 6 de openapi.yaml aparecen en /scalar
[x] Códigos de estado ............. demo.http: 201, 404, 409, 422 comprobados
[x] Errores problem+json + traceId  curl -i del 409: Content-Type correcto
[x] Colecciones paginadas ......... limite=500 -> 422 "máximo 100"
[x] Sin entidades serializadas .... todos los endpoints devuelven *Response
[x] Sin N+1 ....................... log de SQL: 1 consulta en historial
[x] /health/live y /ready ......... docker stop vetcare-db -> ready 503, live 200
[x] Documentación navegable ....... /scalar, ejecuto POST desde el navegador
[x] Sin secretos .................. cadena en user-secrets; appsettings vacío

// src/VetCare.Api/Program.cs
using VetCare.Api.Endpoints;
using VetCare.Api.Errores;
using VetCare.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var cadena = builder.Configuration.GetConnectionString("VetCare")
             ?? throw new InvalidOperationException("Falta ConnectionStrings:VetCare");

builder.Services.AddInfraestructura(cadena);       // DbContext y repositorios
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ManejadorErroresDominio>();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks().AddNpgSql(cadena, name: "postgres", tags: ["ready"]);
builder.Services.AddCors(o => o.AddPolicy("front", p => p
    .WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseMiddleware<RegistroDePeticiones>();
app.UseCors("front");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapHealthChecks("/health/live",  new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new() { Predicate = c => c.Tags.Contains("ready") });

var api = app.MapGroup("/api/v1");
api.MapDuenos();
api.MapMascotas();
api.MapCitas();

app.Run();

public partial class Program { }

GUION DE LA DEMO (demo.http, 5 minutos)
1. POST /api/v1/duenos           { "nombre": "Ana Ruiz", ... }      -> 201
2. POST /api/v1/mascotas         { "duenoId": "<id>", "nombre": "Rocky", ... } -> 201
3. POST /api/v1/citas            10:00-10:30 con el Dr. Pérez       -> 201 + Location
4. POST /api/v1/citas            10:15-10:45, mismo veterinario     -> 409 problem+json
5. GET  /api/v1/mascotas/<id>/historial                              -> 200, una sola consulta SQL
6. docker stop vetcare-db ; GET /health/ready                        -> 503`
}

});
