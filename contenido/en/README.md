# English content

Same structure and the same day ids (`w1d1`…) as the Spanish content, so progress is shared.
Every file adds to `window.EN` instead of the Spanish globals:

```js
window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([ ... ]);
window.EN.USO = Object.assign(window.EN.USO || {}, { ... });
```

Rule: same number of days, steps, quiz questions, hints and glossary entries as the Spanish version.

## Naming used in code, SQL and file names

Code in the English version uses English names. Use exactly these:

| Spanish | English (C#) | English (SQL) |
|---|---|---|
| Mascota | Pet | pet |
| Dueno / Dueño | Owner | owner |
| Cita | Appointment | appointment |
| Veterinario | Vet | vet |
| Visita | Visit | visit |
| Vacuna | Vaccine | vaccine |
| VacunaAplicada | AppliedVaccine | applied_vaccine |
| Factura / LineaFactura | Invoice / InvoiceLine | invoice / invoice_line |
| Especie | Species | species |
| EstadoCita (Pendiente, Confirmada, Atendida, Cancelada) | AppointmentStatus (Pending, Confirmed, Attended, Cancelled) | status ('pending', 'confirmed', 'attended', 'cancelled') |
| Responsabilidad | Ownership | ownership |
| Usuario | User | app_user |
| RangoHorario | TimeRange | — |
| Peso | Weight | weight_kg |
| Dinero | Money | — |
| AgendadorDeCitas | AppointmentScheduler | — |
| INotificador / NotificadorEmail | INotifier / EmailNotifier | — |
| IRelojSistema / RelojSistema / RelojFijo | ISystemClock / SystemClock / FixedClock | — |
| IRepositorioCitas / RepositorioCitasEnMemoria | IAppointmentRepository / InMemoryAppointmentRepository | — |
| ILeerCitas / IGuardarCitas | IReadAppointments / ISaveAppointments | — |
| CalculadoraPrecio / IReglaPrecio | PriceCalculator / IPriceRule | — |
| IPoliticaDescuento / Facturador | IDiscountPolicy / Invoicer | — |
| IFabricaDocumentos / DocumentoClinico / Receta | IDocumentFactory / ClinicalDocument / Prescription | — |
| CalendarioVacunacion | VaccinationSchedule | — |
| IAgendarCita / AgendarCitaComando | IScheduleAppointment / ScheduleAppointmentCommand | — |
| AgendaDelDia / FilaAgendaDto | DailyAgenda / AgendaRowDto | — |
| CitaAgendada / CitaCancelada | AppointmentScheduled / AppointmentCancelled | — |
| MensajeOutbox / ProcesadorOutbox | OutboxMessage / OutboxProcessor | outbox_message |
| operacion_idempotente | — | idempotent_operation |
| token_refresco | — | refresh_token |
| HorarioOcupadoException | TimeSlotTakenException | — |
| VetCareDbContext | VetCareDbContext | — |
| ex_cita_sin_solape | — | ex_appointment_no_overlap |
| Agenda (página web) | Schedule (page) | — |

Project names stay the same: `VetCare.Domain`, `VetCare.Application`, `VetCare.Infrastructure`, `VetCare.Api`,
`VetCare.Playground`, `VetCare.Cli`, `tests/VetCare.Domain.Tests`, `tests/VetCare.Api.Tests`, `web/`.

Document file names in English: `docs/requirements.md`, `docs/acceptance-criteria.md`, `docs/interview-notes.md`,
`docs/assumptions.md`, `docs/use-cases.md`, `docs/backlog.md`, `docs/spec-v1.md`, `docs/domain-model.md`,
`docs/design.md`, `docs/testing.md`, `docs/resilience.md`, `docs/architecture.md`, `docs/adr/`, `docs/frontend.md`,
`docs/security.md`, `docs/dependencies.md`, `docs/threat-model.md`, `docs/contributing.md`, `docs/deployment.md`,
`docs/performance.md`, `docs/performance-report.md`, `docs/observability.md`, `docs/oncall/`, `docs/postmortem-01.md`,
`docs/system-design.md`, `docs/vetcare-at-scale.md`, `docs/design-practice-02.md`, `docs/api-notes.md`,
`docs/api-contract.md`, `docs/openapi.yaml`, `docs/backups.md`, `docs/interview-bank.md`, `docs/next-steps-plan.md`.

The API routes in English: `/api/v1/appointments`, `/api/v1/pets`, `/api/v1/owners`, `/api/v1/agenda?day=`,
`/api/v1/pets/{id}/history`, `/api/v1/appointments/{id}/cancellation`, `/api/auth/login`, `/api/auth/me`,
`/api/auth/refresh`, `/api/auth/logout`. Cookie names: `vetcare_session`, `vetcare_refresh`.

## Requirement IDs

| Spanish | English |
|---|---|
| RF-01 (requisito funcional) | FR-01 |
| RNF-01 (no funcional) | NFR-01 |
| RN-01 (regla de negocio) | BR-01 |
| SUP-01 (supuesto) | ASM-01 |
| PREG-01 (pregunta abierta) | Q-01 |
| UC-01, US-01 | UC-01, US-01 |
