/* Reference solution for each weekly exam (day 6).
   Shown folded in "Close the day": first you do yours, then you compare.
   Key: w<week>d6. */
window.EN = window.EN || {};
window.EN.SOLUCIONES = Object.assign(window.EN.SOLUCIONES || {}, {

'w1d6': {
  intro: 'A complete version of docs/acceptance-criteria.md: 5 requirements with one happy scenario and one rejection scenario each, and the assumptions section. Your requirements may be different; compare the shape: concrete data, a single When per scenario and results that can be checked.',
  body: `# VetCare - Acceptance criteria

## FR-01 Book appointment

Scenario: Appointment in a free slot
  Given vet Ana has no appointments on 10 Oct at 09:00
  And the pet "Rocky" is registered
  When the receptionist books an appointment for Rocky with Ana on 10 Oct at 09:00
  Then the appointment is saved with status "CONFIRMED"
  And it shows up in Ana's agenda for 10 Oct

Scenario: Time clash
  Given Ana already has an appointment on 10 Oct from 09:00 to 09:30
  When the receptionist books another appointment with Ana on 10 Oct at 09:15
  Then the system rejects the appointment
  And shows "The vet is not available at that time"

## FR-03 Register pet

Scenario: Pet with complete data
  Given the owner "Luis Pérez" is registered
  When the receptionist registers "Luna", cat, born 1 Mar 2024, 4.2 kg
  Then Luna shows up on Luis Pérez's record

Scenario: Pet with no owner
  Given no owner has been chosen
  When the receptionist tries to register "Luna"
  Then the system rejects the registration
  And shows "Every pet needs a responsible owner"

## FR-05 Cancel appointment

Scenario: Cancellation in advance
  Given Rocky has an appointment on 10 Oct at 09:00
  And it is now 8 Oct at 18:00
  When the receptionist cancels the appointment
  Then the appointment is in status "CANCELLED"
  And the 09:00 slot is free again

Scenario: Late cancellation (BR-06)
  Given Rocky has an appointment on 10 Oct at 09:00
  And it is now 10 Oct at 07:30
  When the receptionist cancels the appointment
  Then the appointment is in status "CANCELLED"
  And it is flagged with a late cancellation fee

## FR-07 Record applied vaccine

Scenario: Vaccine at an allowed age
  Given "Toby" is a 10-week-old dog
  When the vet records the combination vaccine with batch "PV-2291"
  Then the vaccine shows up in Toby's history with today's date and the batch

Scenario: Vaccine too early (BR-02)
  Given "Toby" is 6 weeks old
  When the vet tries to record the combination vaccine
  Then the system rejects it
  And shows "The combination vaccine is not given before 8 weeks"

## FR-09 See pending vaccines

Scenario: Booster pending
  Given Luna got the rabies vaccine on 10 Oct 2025
  And today is 20 Sep 2026
  When the receptionist opens Luna's record
  Then they see "Rabies: booster before 10 Oct 2026"

Scenario: No pending vaccines
  Given Luna has all her vaccines up to date
  When the receptionist opens Luna's record
  Then they see "No pending vaccines"
  And no warning shows up

---

# Added to docs/requirements.md

## 9. Open assumptions
ASM-01  The clinic has a single site.                  Risk: HIGH
ASM-02  Each appointment lasts 30 minutes except emergencies. Risk: MEDIUM
ASM-03  Fee for cancelling with less than 24 h notice. Risk: MEDIUM
ASM-04  Only staff use the system (not owners).        Risk: HIGH
ASM-05  Opening hours are Monday to Saturday, 8:00 to 20:00. Risk: LOW

---

3-minute defence (script)
1. Problem: the clinic loses appointments and forgets vaccines because
   it writes them down in a notebook.
2. For whom: reception (schedule), vets (history) and the clinic
   owner (who decides and pays).
3. How I will know it works: lost appointments drop from 12 to fewer
   than 3 a month and no vaccine goes past its date without a warning.`
},

'w2d6': {
  intro: 'A complete, compact docs/spec-v1.md. Notice three things: the scope clearly says what is NOT included, the non-functional requirements have numbers and the glossary defines the words that can be confused (appointment versus visit).',
  body: `# VetCare v1 - Specification

## 1. Business problem
Small veterinary clinics lose appointments and forget pending vaccines
because they record everything in a notebook. VetCare v1 must
reduce lost appointments from 12 to fewer than 3 a month and warn about
every vaccine about to expire.

## 2. Stakeholders and conflicts
| Who              | Wants                      | Fears                    |
|------------------|----------------------------|--------------------------|
| Clinic owner ★   | Fewer lost appointments    | Paying for something unused |
| Receptionist     | Booking without clashes    | Being slower on the phone |
| Vet              | History in 10 seconds      | Typing during the consult |
| Pet owner        | Vaccine reminders          | Spam                     |
Conflict: reminders versus spam -> at most 1 notice per appointment,
24 h before, with one-click unsubscribe.

## 3. Scope v1
Must:  clash-free schedule, owner and pet records, visit history,
       applied and pending vaccines, cancellations.
Won't: billing, owner app, inventory, multiple sites.

## 4. Functional requirements
FR-01 Book appointment · FR-02 See daily agenda · FR-03 Register pet
FR-04 Register owner · FR-05 Cancel appointment · FR-06 Record visit
FR-07 Record vaccine · FR-08 See history · FR-09 Pending vaccines
FR-10 Search pet by name, chip or owner's phone

## 5. Non-functional requirements
NFR-01 Daily agenda in < 1 s (p95) with 50 appointments
NFR-02 Available 8:00 to 20:00, maximum outage of 30 min
NFR-03 Hashed passwords; access only with your own user
NFR-04 Daily backup; maximum loss of 24 h
NFR-05 Clinical history kept for 5 years
NFR-06 Book an appointment in fewer than 6 clicks

## 6. Business rules
BR-01 Every pet has exactly one responsible owner
BR-02 The combination vaccine is not given before 8 weeks
BR-03 A vet does not see two appointments at the same time
BR-04 The standard appointment lasts 30 min; back-to-back ones do not overlap
BR-05 Only confirmed appointments can be cancelled
BR-06 Cancelling with less than 24 h notice means a fee
BR-07 Rabies is boosted every 12 months
BR-08 Clinical history is never deleted, only corrected with a record

## 7. Main use cases
UC-01 Book appointment (alternatives: no slot, new pet, simultaneous
      clash) · UC-02 See a visit · UC-03 Record vaccine

## 8. Acceptance criteria
See docs/acceptance-criteria.md (10 scenarios).

## 9. Assumptions and open questions
ASM-01 A single site (high risk) · ASM-04 Only staff use the system
Q-01 Is the late cancellation fee always charged?
Q-02 Are there walk-in emergencies? How are they recorded?

## 10. Glossary
Appointment  Booking of a slot with a vet. It may never happen
             (cancelled).
Visit        The care that did happen. It may come from an appointment
             or be a walk-in emergency.
Owner        Person legally and financially responsible for the pet.
Record       The pet's identifying data (not clinical).
History      The set of visits, diagnoses and vaccines of a pet.
Applied vaccine  A specific dose: date, batch and vet.
Booster      A new dose of a vaccine already given, within a fixed period.
Emergency    A visit with no prior appointment, seen on the spot.`
},

'w3d6': {
  intro: 'The final ERD in Mermaid, the result of running the 5 stress stories and the fixes. What matters is not that your diagram is the same, but that each story has a "supports" or "does not support" with its fix.',
  body: `erDiagram
  OWNER ||--o{ PET : "is responsible for"
  PET ||--o{ APPOINTMENT : has
  VET ||--o{ APPOINTMENT : sees
  PET ||--o{ VISIT : receives
  VET ||--o{ VISIT : performs
  APPOINTMENT |o--o| VISIT : "can produce"
  PET ||--o{ APPLIED_VACCINE : receives
  VACCINE ||--o{ APPLIED_VACCINE : "is applied as"
  PET ||--o{ OWNERSHIP : "had"
  OWNER ||--o{ OWNERSHIP : "had"

  OWNER { uuid id PK; string name; string phone; string email }
  PET { uuid id PK; uuid owner_id FK; string name; string species; date birth_date }
  VET { uuid id PK; string name; bool active }
  APPOINTMENT { uuid id PK; uuid pet_id FK; uuid vet_id FK; datetime starts_at; datetime ends_at; string status }
  VISIT { uuid id PK; uuid pet_id FK; uuid vet_id FK; uuid appointment_id FK "nullable"; datetime visited_on; string reason }
  VACCINE { uuid id PK; string name; int interval_months }
  APPLIED_VACCINE { uuid id PK; uuid pet_id FK; uuid vaccine_id FK; date applied_on; string batch }
  OWNERSHIP { uuid pet_id FK; uuid owner_id FK; date from_date; date to_date }

STRESS TEST
| # | Story                             | Before       | Fix                                            |
|---|-----------------------------------|--------------|------------------------------------------------|
| 1 | Walk-in emergency                 | DOES NOT support | VISIT.appointment_id becomes optional (0..1) |
| 2 | Dog handed over to another owner  | Partly supports | History hangs from PET (good); OWNERSHIP    |
|   |                                   |              | is added to know who the owner was             |
|   |                                   |              | on each date                                   |
| 3 | Vet Ana resigns                   | DOES NOT support | VET.active (soft delete); her past          |
|   |                                   |              | appointments and visits are kept               |
| 4 | Two vaccines on the same day      | Supports     | APPLIED_VACCINE has its own id, no uniqueness  |
|   |                                   |              | on (pet, date); uniqueness only on (pet,       |
|   |                                   |              | vaccine, date)                                 |
| 5 | Appointment rescheduled 3 times   | Supports     | Decision: the date is overwritten. The business |
|   |                                   |              | does not need the change history (asked).      |
|   |                                   |              | If it did: an APPOINTMENT_CHANGE table         |

WHAT I CHANGED AND WHY
- VISIT.appointment_id optional: an emergency is a visit with no prior booking.
- VET.active: you cannot delete someone with clinical history.
- OWNERSHIP with dates: the history must say who authorised
  each treatment at the time, even if the owner is someone else today.`
},

'w4d6': {
  intro: 'The 10-point checklist answered on the VetCare model, with the fixes applied and the SQL of the key tables. Notice that each answer points to where it is met, not just "yes".',
  body: `MODEL CHECKLIST
 1. Id and justified type ........... YES. uuid everywhere: it shows up in
                                        public URLs and does not reveal volume.
 2. Explicit ON DELETE .............. FIXED. It was missing on visit.appointment_id.
                                        Now SET NULL (the visit survives).
 3. Rules with constraints .......... YES, except BR-02 (minimum vaccine
                                        age): it needs the birth date
                                        from another table -> in code.
 4. Duplicated data ................. YES, one justified: visit.price
                                        freezes what was charged that day.
 5. N:N tables ...................... applied_vaccine: its own id (it repeats
                                        over time). vet_specialty:
                                        composite PK (pure relationship).
 6. Glossary names .................. FIXED. "consultation" -> "visit".
 7. Hard delete with retention ...... FIXED. pet and vet
                                        use active = false.
 8. Root of each aggregate .......... Pet (+ applied vaccines),
                                        Appointment, Owner, Vet.
 9. ERD and SQL match ............... FIXED. The SQL had no
                                        ownership; the ERD had no
                                        visit.price.
10. Stress stories .................. All 5 pass after the changes.

SQL OF THE KEY TABLES
CREATE TABLE pet (
  id          uuid PRIMARY KEY,
  owner_id    uuid NOT NULL,
  name        text NOT NULL,
  species     text NOT NULL,
  birth_date  date NOT NULL,
  active      boolean NOT NULL DEFAULT true,
  CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id)
    REFERENCES owner(id) ON DELETE RESTRICT,
  CONSTRAINT ck_pet_species CHECK (species IN ('dog','cat','other'))
);

CREATE TABLE visit (
  id              uuid PRIMARY KEY,
  pet_id          uuid NOT NULL REFERENCES pet(id) ON DELETE RESTRICT,
  vet_id          uuid NOT NULL REFERENCES vet(id) ON DELETE RESTRICT,
  appointment_id  uuid NULL REFERENCES appointment(id) ON DELETE SET NULL,
  visited_on      timestamptz NOT NULL,
  price           numeric(10,2) NOT NULL,   -- historical data, on purpose
  CONSTRAINT ck_visit_price CHECK (price >= 0)
);

CREATE TABLE applied_vaccine (
  id          uuid PRIMARY KEY,
  pet_id      uuid NOT NULL REFERENCES pet(id) ON DELETE RESTRICT,
  vaccine_id  uuid NOT NULL REFERENCES vaccine(id) ON DELETE RESTRICT,
  applied_on  date NOT NULL,
  batch       text NOT NULL,
  CONSTRAINT uq_applied_vaccine UNIQUE (pet_id, vaccine_id, applied_on)
);

DEFENCE (most debatable decision)
I kept APPOINTMENT and VISIT separate even though they look the same. I could
use a single table with a status, but an appointment may never become a visit
(cancelled) and a visit may not come from an appointment (emergency).
Also, the visit has clinical data with different permissions.`
},

'w5d6': {
  intro: 'A Program.cs with 10 attacks on the domain and the domain pieces that make all of them come out OK. Above all, compare which invariants you attack: if your list is shorter, you probably have unprotected rules.',
  body: `// src/VetCare.Playground/Program.cs
using VetCare.Domain;

void Try(string scenario, Action action)
{
    try { action(); Console.WriteLine($"FAIL: '{scenario}' should have been rejected"); }
    catch (Exception ex) { Console.WriteLine($"OK:   '{scenario}' -> {ex.Message}"); }
}

var now = new DateTime(2026, 10, 8, 10, 0, 0, DateTimeKind.Utc);
var owner = Guid.NewGuid();

Try("pet with no name",          () => new Pet("  ", Species.Dog, owner, new DateOnly(2024, 3, 1)));
Try("pet with no owner",         () => new Pet("Rocky", Species.Dog, Guid.Empty, new DateOnly(2024, 3, 1)));
Try("birth date in the future",  () => new Pet("Rocky", Species.Dog, owner, new DateOnly(2030, 1, 1)));

var rocky = new Pet("Rocky", Species.Dog, owner, new DateOnly(2024, 3, 1));
Try("negative weight",           () => rocky.UpdateWeight(-3m));
Try("vaccine with future date",  () => rocky.RecordVaccine("Rabies", "L-1", new DateOnly(2030, 1, 1), DateOnly.FromDateTime(now)));

Try("appointment in the past",   () => Appointment.Schedule(rocky.Id, Guid.NewGuid(), now.AddHours(-1), TimeSpan.FromMinutes(30), now));
Try("0-minute appointment",      () => Appointment.Schedule(rocky.Id, Guid.NewGuid(), now.AddDays(1), TimeSpan.Zero, now));
Try("5-hour appointment",        () => Appointment.Schedule(rocky.Id, Guid.NewGuid(), now.AddDays(1), TimeSpan.FromHours(5), now));

var appointment = Appointment.Schedule(rocky.Id, Guid.NewGuid(), now.AddDays(2), TimeSpan.FromMinutes(30), now);
Try("cancel twice", () => { appointment.Cancel("Trip", now); appointment.Cancel("Again", now); });
Try("modify the vaccine list from outside",
    () => ((ICollection<AppliedVaccine>)rocky.Vaccines).Add(null!));

// ---- The domain pieces that make it possible ----

public sealed class Appointment
{
    public Guid Id { get; } = Guid.NewGuid();
    public Guid PetId { get; }
    public Guid VetId { get; }
    public DateTime Start { get; private set; }
    public DateTime End { get; private set; }
    public AppointmentStatus Status { get; private set; } = AppointmentStatus.Confirmed;

    private Appointment(Guid petId, Guid vetId, DateTime start, DateTime end)
    { PetId = petId; VetId = vetId; Start = start; End = end; }

    public static Appointment Schedule(Guid petId, Guid vetId,
                                       DateTime start, TimeSpan duration, DateTime now)
    {
        if (petId == Guid.Empty) throw new ArgumentException("The appointment needs a pet");
        if (start <= now) throw new InvalidOperationException("You cannot book in the past");
        if (duration < TimeSpan.FromMinutes(15) || duration > TimeSpan.FromHours(2))
            throw new ArgumentOutOfRangeException(nameof(duration), "Between 15 and 120 minutes");
        return new Appointment(petId, vetId, start, start + duration);
    }

    public void Cancel(string reason, DateTime now)
    {
        if (Status != AppointmentStatus.Confirmed)
            throw new InvalidOperationException("Only confirmed appointments can be cancelled");
        Status = AppointmentStatus.Cancelled;
    }
}

// In Pet, the collection is exposed as read-only:
//   private readonly List<AppliedVaccine> _vaccines = new();
//   public IReadOnlyCollection<AppliedVaccine> Vaccines => _vaccines.AsReadOnly();

EXPECTED OUTPUT: 10 lines, all starting with "OK:".`
},

'w6d6': {
  intro: 'The OOP checklist applied to each domain class, the changes made and the check that behaviour did not change. The most important part is the last one: the empty diff between the output before and after.',
  body: `CHECKLIST PER CLASS (✓ meets · ✗ fixed)

             1  2  3  4  5  6  7  8  9  10
Pet          ✓  ✓  ✗  ✓  ✓  ✓  ✓  ✓  ✓  ✓   public set on Weight -> UpdateWeight()
Appointment  ✓  ✓  ✓  ✓  ✓  ✗  ✓  ✓  ✓  ✓   duration validated in 2 places -> TimeRange
Owner        ✗  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓   anaemic -> ChangeContact(phone, email) with validation
Invoice      ✓  ✓  ✓  ✗  ✓  ✓  ✓  ✓  ✗  ✓   public List -> IReadOnlyList; 34-line Total() split up
Documents    ✓  ✓  ✓  ✓  ✓  ✓  ✗  ✓  ✓  ✓   switch on type in GenerateTitle -> abstract Title
Reminder     ✓  ✓  ✓  ✓  ✗  ✓  ✓  ✓  ✓  ✓   new EmailNotifier -> INotifier through the constructor

CHANGES (one per commit)
1. Pet.Weight: private set + UpdateWeight(decimal) that validates > 0.
2. New value object TimeRange(Start, End): end > start and between
   15 and 120 minutes. Appointment and Availability use it; the validation
   is no longer duplicated.
3. Owner.ChangeContact: phone and email are validated together.
4. Invoice: private _lines, Lines as IReadOnlyList, AddLine().
   Total() is split into Subtotal(), Discount() and Taxes().
5. ClinicalDocument.Title becomes abstract; the switch disappears.
6. Reminder receives INotifier; it no longer creates EmailNotifier.

CHECK
$ dotnet run --project src/VetCare.Playground > docs/output-before.txt
  ... refactor ...
$ dotnet run --project src/VetCare.Playground > docs/output-after.txt
$ diff docs/output-before.txt docs/output-after.txt
$                                   <- no output: identical behaviour

ONE-SENTENCE JUSTIFICATION PER CHANGE
- TimeRange: the duration rule lived in two places; now in one.
- Abstract Title: adding a document no longer means hunting for switches.
- INotifier: Reminder can be tested without sending emails.`
}

});
