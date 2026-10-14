/* Solución de referencia de cada examen semanal (día 6).
   Se muestra plegada en «Cierra el día»: primero haces la tuya, luego comparas.
   Clave: w<semana>d6. */
window.SOLUCIONES = Object.assign(window.SOLUCIONES || {}, {

'w1d6': {
  intro: 'Una versión completa de docs/acceptance-criteria.md: 5 requisitos con un escenario feliz y uno de rechazo cada uno, y la sección de supuestos. Tus requisitos pueden ser otros; compara la forma: datos concretos, un solo Cuando por escenario y resultados que se pueden comprobar.',
  body: `# VetCare - Criterios de aceptación

## RF-01 Agendar cita

Escenario: Cita en un horario libre
  Dado que la veterinaria Ana no tiene citas el 10/10 a las 09:00
  Y la mascota "Rocky" está registrada
  Cuando la recepcionista agenda una cita para Rocky con Ana el 10/10 a las 09:00
  Entonces la cita queda guardada con estado "CONFIRMADA"
  Y aparece en la agenda de Ana del 10/10

Escenario: Choque de horario
  Dado que Ana ya tiene una cita el 10/10 de 09:00 a 09:30
  Cuando la recepcionista agenda otra cita con Ana el 10/10 a las 09:15
  Entonces el sistema rechaza la cita
  Y muestra "La veterinaria no está disponible en ese horario"

## RF-03 Registrar mascota

Escenario: Mascota con datos completos
  Dado que el dueño "Luis Pérez" está registrado
  Cuando la recepcionista registra a "Luna", gata, nacida el 01/03/2024, 4,2 kg
  Entonces Luna aparece en la ficha de Luis Pérez

Escenario: Mascota sin dueño
  Dado que no se ha elegido ningún dueño
  Cuando la recepcionista intenta registrar a "Luna"
  Entonces el sistema rechaza el registro
  Y muestra "Toda mascota necesita un dueño responsable"

## RF-05 Cancelar cita

Escenario: Cancelación con antelación
  Dado que Rocky tiene cita el 10/10 a las 09:00
  Y hoy es 08/10 a las 18:00
  Cuando la recepcionista cancela la cita
  Entonces la cita queda en estado "CANCELADA"
  Y el hueco de las 09:00 vuelve a estar libre

Escenario: Cancelación tardía (RN-06)
  Dado que Rocky tiene cita el 10/10 a las 09:00
  Y hoy es 10/10 a las 07:30
  Cuando la recepcionista cancela la cita
  Entonces la cita queda en estado "CANCELADA"
  Y se marca con recargo por cancelación tardía

## RF-07 Registrar vacuna aplicada

Escenario: Vacuna en edad permitida
  Dado que "Toby" es un perro de 10 semanas
  Cuando el veterinario registra la vacuna polivalente con lote "PV-2291"
  Entonces la vacuna aparece en el historial de Toby con fecha de hoy y lote

Escenario: Vacuna antes de tiempo (RN-02)
  Dado que "Toby" tiene 6 semanas
  Cuando el veterinario intenta registrar la vacuna polivalente
  Entonces el sistema la rechaza
  Y muestra "La polivalente no se aplica antes de las 8 semanas"

## RF-09 Ver vacunas pendientes

Escenario: Refuerzo pendiente
  Dado que Luna recibió la vacuna de la rabia el 10/10/2025
  Y hoy es 20/09/2026
  Cuando la recepcionista abre la ficha de Luna
  Entonces ve "Rabia: refuerzo antes del 10/10/2026"

Escenario: Sin vacunas pendientes
  Dado que Luna tiene todas sus vacunas al día
  Cuando la recepcionista abre la ficha de Luna
  Entonces ve "Sin vacunas pendientes"
  Y no aparece ningún aviso

---

# Añadido a docs/requirements.md

## 9. Supuestos abiertos
S-01  La clínica tiene una sola sede.                 Riesgo: ALTO
S-02  Cada cita dura 30 minutos salvo urgencias.      Riesgo: MEDIO
S-03  Recargo por cancelación con menos de 24 h.      Riesgo: MEDIO
S-04  Solo el personal usa el sistema (no los dueños). Riesgo: ALTO
S-05  El horario es de lunes a sábado, 8:00 a 20:00.  Riesgo: BAJO

---

Defensa en 3 minutos (guion)
1. Problema: la clínica pierde citas y olvida vacunas porque lo
   apunta en un cuaderno.
2. Para quién: recepción (agenda), veterinarios (historial) y el
   dueño de la clínica (que decide y paga).
3. Cómo sabré que funciona: las citas perdidas bajan de 12 a menos
   de 3 al mes y ninguna vacuna se pasa de fecha sin aviso.`
},

'w2d6': {
  intro: 'Una docs/spec-v1.md completa y compacta. Fíjate en tres cosas: el alcance dice claramente lo que NO entra, los no funcionales tienen números y el glosario define las palabras que se pueden confundir (cita frente a visita).',
  body: `# VetCare v1 - Especificación

## 1. Problema de negocio
Las clínicas veterinarias pequeñas pierden citas y olvidan vacunas
pendientes porque lo registran todo en un cuaderno. VetCare v1 debe
reducir las citas perdidas de 12 a menos de 3 al mes y avisar de
toda vacuna próxima a vencer.

## 2. Stakeholders y conflictos
| Quién            | Quiere                     | Teme                     |
|------------------|----------------------------|--------------------------|
| Dueño clínica ★  | Menos citas perdidas       | Pagar algo que no se use |
| Recepcionista    | Agendar sin choques        | Ir más lenta al teléfono |
| Veterinario      | Historial en 10 segundos   | Teclear durante consulta |
| Dueño mascota    | Que le recuerden vacunas   | Spam                     |
Conflicto: recordatorios frente a spam -> máximo 1 aviso por cita,
24 h antes, con baja en un clic.

## 3. Alcance v1
Must:  agenda sin solapes, fichas de dueño y mascota, historial de
       visitas, vacunas aplicadas y pendientes, cancelaciones.
Won't: facturación, app para dueños, inventario, varias sedes.

## 4. Requisitos funcionales
RF-01 Agendar cita · RF-02 Ver agenda del día · RF-03 Registrar mascota
RF-04 Registrar dueño · RF-05 Cancelar cita · RF-06 Registrar visita
RF-07 Registrar vacuna · RF-08 Ver historial · RF-09 Vacunas pendientes
RF-10 Buscar mascota por nombre, chip o teléfono del dueño

## 5. Requisitos no funcionales
RNF-01 Agenda del día en < 1 s (p95) con 50 citas
RNF-02 Disponible de 8:00 a 20:00, caída máxima de 30 min
RNF-03 Contraseñas con hash; acceso solo con usuario propio
RNF-04 Copia de seguridad diaria; pérdida máxima de 24 h
RNF-05 Historial clínico conservado 5 años
RNF-06 Dar una cita en menos de 6 clics

## 6. Reglas de negocio
RN-01 Toda mascota tiene exactamente un dueño responsable
RN-02 La polivalente no se aplica antes de las 8 semanas
RN-03 Un veterinario no atiende dos citas a la vez
RN-04 La cita estándar dura 30 min; las contiguas no se solapan
RN-05 Solo se cancelan citas confirmadas
RN-06 Cancelar con menos de 24 h implica recargo
RN-07 La rabia se refuerza cada 12 meses
RN-08 El historial clínico no se borra, solo se corrige con registro

## 7. Casos de uso principales
UC-01 Agendar cita (alternativos: sin hueco, mascota nueva, choque
      simultáneo) · UC-02 Atender visita · UC-03 Registrar vacuna

## 8. Criterios de aceptación
Ver docs/acceptance-criteria.md (10 escenarios).

## 9. Supuestos y preguntas abiertas
S-01 Una sola sede (riesgo alto) · S-04 Solo personal usa el sistema
P-01 ¿El recargo por cancelación tardía se cobra siempre?
P-02 ¿Hay urgencias sin cita? ¿Cómo se registran?

## 10. Glosario
Cita        Reserva de un hueco con un veterinario. Puede no llegar a
            ocurrir (cancelada).
Visita      La atención que sí ocurrió. Puede venir de una cita o ser
            una urgencia sin cita.
Dueño       Persona responsable legal y económica de la mascota.
Ficha       Datos identificativos de la mascota (no clínicos).
Historial   Conjunto de visitas, diagnósticos y vacunas de una mascota.
Vacuna aplicada  Dosis concreta: fecha, lote y veterinario.
Refuerzo    Nueva dosis de una vacuna ya aplicada, en un plazo fijo.
Urgencia    Visita sin cita previa que se atiende en el momento.`
},

'w3d6': {
  intro: 'El ERD final en Mermaid, el resultado de pasar las 5 historias de estrés y las correcciones. Lo importante no es que tu diagrama sea igual, sino que cada historia tenga un «soporta» o un «no soporta» con su arreglo.',
  body: `erDiagram
  DUENO ||--o{ MASCOTA : "es responsable de"
  MASCOTA ||--o{ CITA : tiene
  VETERINARIO ||--o{ CITA : atiende
  MASCOTA ||--o{ VISITA : recibe
  VETERINARIO ||--o{ VISITA : realiza
  CITA |o--o| VISITA : "puede generar"
  MASCOTA ||--o{ VACUNA_APLICADA : recibe
  VACUNA ||--o{ VACUNA_APLICADA : "se aplica como"
  MASCOTA ||--o{ RESPONSABILIDAD : "tuvo"
  DUENO ||--o{ RESPONSABILIDAD : "tuvo"

  DUENO { uuid id PK; string nombre; string telefono; string email }
  MASCOTA { uuid id PK; uuid dueno_id FK; string nombre; string especie; date nacimiento }
  VETERINARIO { uuid id PK; string nombre; bool activo }
  CITA { uuid id PK; uuid mascota_id FK; uuid veterinario_id FK; datetime inicio; datetime fin; string estado }
  VISITA { uuid id PK; uuid mascota_id FK; uuid veterinario_id FK; uuid cita_id FK "nullable"; datetime fecha; string motivo }
  VACUNA { uuid id PK; string nombre; int intervalo_meses }
  VACUNA_APLICADA { uuid id PK; uuid mascota_id FK; uuid vacuna_id FK; date fecha; string lote }
  RESPONSABILIDAD { uuid mascota_id FK; uuid dueno_id FK; date desde; date hasta }

PRUEBA DE ESTRÉS
| # | Historia                          | Antes        | Arreglo                                        |
|---|-----------------------------------|--------------|------------------------------------------------|
| 1 | Urgencia sin cita                 | NO soporta   | VISITA.cita_id pasa a opcional (0..1)          |
| 2 | Traspaso del perro a otro dueño   | Soporta a medias | Historial cuelga de MASCOTA (bien); se añade |
|   |                                   |              | RESPONSABILIDAD para saber quién era el dueño  |
|   |                                   |              | en cada fecha                                  |
| 3 | La veterinaria Ana renuncia       | NO soporta   | VETERINARIO.activo (borrado lógico); sus citas |
|   |                                   |              | y visitas pasadas se conservan                 |
| 4 | Dos vacunas el mismo día          | Soporta      | VACUNA_APLICADA tiene id propio, sin unicidad  |
|   |                                   |              | (mascota, fecha); unicidad solo por (mascota,  |
|   |                                   |              | vacuna, fecha)                                 |
| 5 | Cita reagendada tres veces        | Soporta      | Decisión: se pisa la fecha. El negocio no      |
|   |                                   |              | necesita el historial de cambios (preguntado). |
|   |                                   |              | Si lo necesitara: tabla CAMBIO_CITA            |

QUÉ CAMBIÉ Y POR QUÉ
- VISITA.cita_id opcional: una urgencia es una visita sin reserva previa.
- VETERINARIO.activo: no se puede borrar a alguien con historial clínico.
- RESPONSABILIDAD con fechas: el historial debe decir quién autorizó
  cada tratamiento en su momento, aunque hoy el dueño sea otro.`
},

'w4d6': {
  intro: 'El checklist de 10 puntos respondido sobre el modelo de VetCare, con las correcciones aplicadas y el SQL de las tablas clave. Fíjate en que cada respuesta señala dónde se cumple, no solo «sí».',
  body: `CHECKLIST DEL MODELO
 1. Id y tipo justificado ............ SÍ. uuid en todo: aparece en URLs
                                        públicas y no revela volumen.
 2. ON DELETE explícito ............. CORREGIDO. Faltaba en visita.cita_id.
                                        Ahora SET NULL (la visita sobrevive).
 3. Reglas con constraint ........... SÍ, salvo RN-02 (edad mínima de
                                        vacuna): necesita la fecha de
                                        nacimiento de otra tabla -> en código.
 4. Datos duplicados ................ SÍ, uno justificado: visita.precio
                                        congela lo cobrado ese día.
 5. Tablas N:N ...................... vacuna_aplicada: id propio (se repite
                                        en el tiempo). veterinario_especialidad:
                                        PK compuesta (relación pura).
 6. Nombres del glosario ............ CORREGIDO. "consulta" -> "visita".
 7. Borrado físico con retención .... CORREGIDO. mascota y veterinario
                                        usan activo = false.
 8. Raíz de cada agregado ........... Mascota (+ vacunas aplicadas),
                                        Cita, Dueño, Veterinario.
 9. ERD y SQL coinciden ............. CORREGIDO. El SQL no tenía
                                        responsabilidad; el ERD no tenía
                                        visita.precio.
10. Historias de estrés ............. Las 5 pasan tras los cambios.

SQL DE LAS TABLAS CLAVE
CREATE TABLE mascota (
  id          uuid PRIMARY KEY,
  dueno_id    uuid NOT NULL,
  nombre      text NOT NULL,
  especie     text NOT NULL,
  nacimiento  date NOT NULL,
  activo      boolean NOT NULL DEFAULT true,
  CONSTRAINT fk_mascota_dueno FOREIGN KEY (dueno_id)
    REFERENCES dueno(id) ON DELETE RESTRICT,
  CONSTRAINT ck_mascota_especie CHECK (especie IN ('perro','gato','otro'))
);

CREATE TABLE visita (
  id              uuid PRIMARY KEY,
  mascota_id      uuid NOT NULL REFERENCES mascota(id) ON DELETE RESTRICT,
  veterinario_id  uuid NOT NULL REFERENCES veterinario(id) ON DELETE RESTRICT,
  cita_id         uuid NULL REFERENCES cita(id) ON DELETE SET NULL,
  fecha           timestamptz NOT NULL,
  precio          numeric(10,2) NOT NULL,   -- dato histórico, a propósito
  CONSTRAINT ck_visita_precio CHECK (precio >= 0)
);

CREATE TABLE vacuna_aplicada (
  id          uuid PRIMARY KEY,
  mascota_id  uuid NOT NULL REFERENCES mascota(id) ON DELETE RESTRICT,
  vacuna_id   uuid NOT NULL REFERENCES vacuna(id) ON DELETE RESTRICT,
  fecha       date NOT NULL,
  lote        text NOT NULL,
  CONSTRAINT uq_vacuna_aplicada UNIQUE (mascota_id, vacuna_id, fecha)
);

DEFENSA (decisión más discutible)
Separé CITA y VISITA aunque parecen lo mismo. Podía usar una sola
tabla con estado, pero una cita puede no convertirse nunca en visita
(cancelada) y una visita puede no venir de una cita (urgencia).
Además, la visita tiene datos clínicos con permisos distintos.`
},

'w5d6': {
  intro: 'Un Program.cs con 10 ataques al dominio y las piezas del dominio que hacen que todos salgan OK. Compara sobre todo qué invariantes atacas: si tu lista es más corta, probablemente tienes reglas sin proteger.',
  body: `// src/VetCare.Playground/Program.cs
using VetCare.Domain;

void Intentar(string caso, Action accion)
{
    try { accion(); Console.WriteLine($"FALLO: '{caso}' debería haber sido rechazado"); }
    catch (Exception ex) { Console.WriteLine($"OK:    '{caso}' -> {ex.Message}"); }
}

var ahora = new DateTime(2026, 10, 8, 10, 0, 0, DateTimeKind.Utc);
var dueno = Guid.NewGuid();

Intentar("mascota sin nombre",      () => new Mascota("  ", Especie.Perro, dueno, new DateOnly(2024, 3, 1)));
Intentar("mascota sin dueño",       () => new Mascota("Rocky", Especie.Perro, Guid.Empty, new DateOnly(2024, 3, 1)));
Intentar("nacimiento en el futuro", () => new Mascota("Rocky", Especie.Perro, dueno, new DateOnly(2030, 1, 1)));

var rocky = new Mascota("Rocky", Especie.Perro, dueno, new DateOnly(2024, 3, 1));
Intentar("peso negativo",           () => rocky.ActualizarPeso(-3m));
Intentar("vacuna con fecha futura", () => rocky.RegistrarVacuna("Rabia", "L-1", new DateOnly(2030, 1, 1), DateOnly.FromDateTime(ahora)));

Intentar("cita en el pasado",       () => Cita.Agendar(rocky.Id, Guid.NewGuid(), ahora.AddHours(-1), TimeSpan.FromMinutes(30), ahora));
Intentar("cita de 0 minutos",       () => Cita.Agendar(rocky.Id, Guid.NewGuid(), ahora.AddDays(1), TimeSpan.Zero, ahora));
Intentar("cita de 5 horas",         () => Cita.Agendar(rocky.Id, Guid.NewGuid(), ahora.AddDays(1), TimeSpan.FromHours(5), ahora));

var cita = Cita.Agendar(rocky.Id, Guid.NewGuid(), ahora.AddDays(2), TimeSpan.FromMinutes(30), ahora);
Intentar("cancelar dos veces", () => { cita.Cancelar("Viaje", ahora); cita.Cancelar("Otra vez", ahora); });
Intentar("modificar la lista de vacunas desde fuera",
    () => ((ICollection<VacunaAplicada>)rocky.Vacunas).Add(null!));

// ---- Las piezas del dominio que lo hacen posible ----

public sealed class Cita
{
    public Guid Id { get; } = Guid.NewGuid();
    public Guid MascotaId { get; }
    public Guid VeterinarioId { get; }
    public DateTime Inicio { get; private set; }
    public DateTime Fin { get; private set; }
    public EstadoCita Estado { get; private set; } = EstadoCita.Confirmada;

    private Cita(Guid mascotaId, Guid veterinarioId, DateTime inicio, DateTime fin)
    { MascotaId = mascotaId; VeterinarioId = veterinarioId; Inicio = inicio; Fin = fin; }

    public static Cita Agendar(Guid mascotaId, Guid veterinarioId,
                               DateTime inicio, TimeSpan duracion, DateTime ahora)
    {
        if (mascotaId == Guid.Empty) throw new ArgumentException("La cita necesita una mascota");
        if (inicio <= ahora) throw new InvalidOperationException("No se agenda en el pasado");
        if (duracion < TimeSpan.FromMinutes(15) || duracion > TimeSpan.FromHours(2))
            throw new ArgumentOutOfRangeException(nameof(duracion), "Entre 15 y 120 minutos");
        return new Cita(mascotaId, veterinarioId, inicio, inicio + duracion);
    }

    public void Cancelar(string motivo, DateTime ahora)
    {
        if (Estado != EstadoCita.Confirmada)
            throw new InvalidOperationException("Solo se cancelan citas confirmadas");
        Estado = EstadoCita.Cancelada;
    }
}

// En Mascota, la colección se expone de solo lectura:
//   private readonly List<VacunaAplicada> _vacunas = new();
//   public IReadOnlyCollection<VacunaAplicada> Vacunas => _vacunas.AsReadOnly();

SALIDA ESPERADA: 10 líneas, todas empiezan por "OK:".`
},

'w6d6': {
  intro: 'El checklist OOP aplicado a cada clase del dominio, los cambios hechos y la verificación de que el comportamiento no cambió. Lo más importante es la última parte: el diff vacío entre la salida de antes y la de después.',
  body: `CHECKLIST POR CLASE (✓ cumple · ✗ corregido)

             1  2  3  4  5  6  7  8  9  10
Mascota      ✓  ✓  ✗  ✓  ✓  ✓  ✓  ✓  ✓  ✓   set público en Peso -> ActualizarPeso()
Cita         ✓  ✓  ✓  ✓  ✓  ✗  ✓  ✓  ✓  ✓   duración validada en 2 sitios -> RangoHorario
Dueno        ✗  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓   anémica -> CambiarContacto(tel, email) con validación
Factura      ✓  ✓  ✓  ✗  ✓  ✓  ✓  ✓  ✗  ✓   List pública -> IReadOnlyList; Total() de 34 líneas partido
Documentos   ✓  ✓  ✓  ✓  ✓  ✓  ✗  ✓  ✓  ✓   switch por tipo en GenerarTitulo -> Titulo abstracto
Recordatorio ✓  ✓  ✓  ✓  ✗  ✓  ✓  ✓  ✓  ✓   new NotificadorEmail -> INotificador por constructor

CAMBIOS (uno por commit)
1. Mascota.Peso: set privado + ActualizarPeso(decimal) que valida > 0.
2. Nuevo value object RangoHorario(Inicio, Fin): fin > inicio y entre
   15 y 120 minutos. Cita y Disponibilidad lo usan; la validación ya
   no está duplicada.
3. Dueno.CambiarContacto: el teléfono y el email se validan juntos.
4. Factura: _lineas privada, Lineas como IReadOnlyList, AgregarLinea().
   Total() se parte en Subtotal(), Descuento() e Impuestos().
5. DocumentoClinico.Titulo pasa a abstracto; desaparece el switch.
6. Recordatorio recibe INotificador; ya no crea NotificadorEmail.

VERIFICACIÓN
$ dotnet run --project src/VetCare.Playground > docs/salida-antes.txt
  ... refactor ...
$ dotnet run --project src/VetCare.Playground > docs/salida-despues.txt
$ diff docs/salida-antes.txt docs/salida-despues.txt
$                                   <- sin salida: comportamiento idéntico

JUSTIFICACIÓN EN UNA FRASE POR CAMBIO
- RangoHorario: la regla de duración vivía en dos sitios; ahora en uno.
- Titulo abstracto: añadir un documento ya no obliga a buscar switch.
- INotificador: Recordatorio se puede probar sin enviar correos.`
}

});
