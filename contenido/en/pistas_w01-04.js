/* One hint for each "Do it yourself" step: how to start, an example and how to know it is right.
   Key: w<week>d<day>; the order matches days[].steps. */
window.EN = window.EN || {};
window.EN.PISTAS = Object.assign(window.EN.PISTAS || {}, {

/* ---------- Week 1 ---------- */

'w1d1': [
  'Use this template: "[Who] loses/suffers [what] because [current cause]". Example: "Small veterinary clinics lose appointments and forget vaccines because they write everything in a notebook". Check: count the words (25 at most) and look for banned words such as app, web, system, database or C#.',
  'Each fact must carry a number or something observable. Think about: staff (how many vets and receptionists), volume (pets seen, appointments a day), how they work today (notebook, phone) and what goes wrong (appointments lost per week). Bad: "they have lots of clients". Good: "they see about 600 pets".',
  'Think of things someone might ask for later that you are not going to build now: billing, an app for owners, inventory, an online shop, several sites. Write them as "VetCare will not…". Check: each non-goal must be something reasonable someone might expect; "will not fly planes" does not count.'
],

'w1d2': [
  'Make a table with three columns: Who | What they want | What they fear. Start with whoever uses the system every day (receptionist, vet), then whoever pays (the clinic owner) and then whoever gets the effect without using it (the pet owner). Write concrete wishes and fears: "see the history in 10 seconds", not "make it easy".',
  'Ask yourself: if this person says "I don’t want it", is the project cancelled? It is almost always whoever pays, the clinic owner. Put ★ next to their name and add a line explaining why they have that power.',
  'Compare one person’s "what they want" column with another’s "what they fear" column. Example: the clinic owner wants to send reminders and the pet owner fears spam. Write the decision: "at most 1 reminder per appointment, 24 h before, and the client can unsubscribe".'
],

'w1d3': [
  'Format: "FR-01 · As a [role], I want [specific action] so that [benefit]". Walk through a day at the clinic: register an owner, register a pet, book an appointment, cancel it, see the day’s schedule, record a consultation, record a vaccine, see pending vaccines, search for a pet, see the history. That already gives you 10.',
  'Ask yourself which input would make the system say no. Examples: "the system rejects the appointment if the vet already has another at that time", "it rejects registering a pet without an owner", "the search returns at most 50 results". Each FR needs at least one "Rejects if…" line.',
  'Imagine the test: "given X, when I do Y, I expect Z". If you do not know which Z to write, the requirement is vague. Bad: "manage the schedule" (what do I expect to see?). Good: "see the day’s appointments ordered by time with the pet’s name". Rewrite until every FR has a checkable result.'
],

'w1d4': [
  'Use these categories as a checklist: performance (response time), availability (hours a day, maximum downtime), security (who has access, passwords), data (backups, retention), usability (clicks per task) and capacity (pets, simultaneous users). One NFR per category gives you the 6.',
  'Replace each adjective with a measure: "fast" → "the schedule loads in under 1 s with 50 appointments"; "secure" → "passwords are stored hashed, never in plain text"; "available" → "it works from 8:00 to 20:00 Monday to Saturday; maximum downtime 30 minutes". Check: if you cannot measure it with a clock or a number, rewrite it.',
  'For each NFR write "→ forces…". Examples: "under 1 s" → indexes on the appointments table; "daily backups" → a scheduled backup task; "personal data" → HTTPS and access control. If an NFR forces no decision, it is probably too obvious or too vague.'
],

'w1d5': [
  'Rules are the clinic’s policies, not system features. Look for sentences with "always", "never", "cannot", "at least" or "if… then…". Examples: "a pet can only have one responsible owner", "no vaccination before 8 weeks", "an appointment lasts 30 minutes", "cancelling with less than 24 h notice is charged".',
  'Imagine the clinic in 1990, without a computer. If the rule still existed ("no vaccination before 8 weeks"), it is a business rule. If it only exists because of the software ("the password must have 8 characters"), it is not: it is a security requirement. Cross out the ones that fail the test and find others.',
  'Ask yourself whether the rule depends on a decision by the owner (price, appointment length, cancellation period) or on something stable (biology, laws). The decision ones change: mark them "⚙ configurable". The stable ones can be fixed in the code.'
],

'w1d6': [
  'Choose the 5 most important FRs. For each one: a happy scenario and a rejection scenario (use day 3’s "Rejects if…" condition). Format: "Given Dr. Pérez has an appointment on Monday at 10:00 / When I book another at 10:00 with the same vet / Then the system rejects it with the message "time slot taken"". Use concrete data, not "a vet".',
  'Count the "When"s in each scenario. If there are two actions ("when I book and cancel"), it is two scenarios. The "Given"s and "Then"s can have several lines with "And", but the action tested is a single one.',
  'Set a 3-minute timer and record yourself on your phone. Structure: 1) the problem in one sentence, 2) for whom (stakeholders), 3) what v1 will do, 4) how you will know it works (one measure). Listen to yourself: if you hesitated or missed something, repeat until it flows.'
],

/* ---------- Week 2 ---------- */

'w2d1': [
  'Questions about past facts start with "tell me about the last time…", "what happened when…?", "how many times last month…?". Spread the 12 questions across topics: typical day, appointments, vaccines, recent problems, staff and what success would be. Avoid "would you like…?": that is asking for wishes.',
  'Look for questions starting with "do you want…?", "do you think…?", "is it…?" or "do you need…?". Turn them into open ones with "how", "what", "when" or "tell me". Example: "Do you need reminders?" → "What happens today when a client forgets their appointment?".',
  'Answer like a real owner who is not clear about things: exaggerate a bit, contradict yourself ("appointments almost never get lost"… and then "four were missed last week"). At the end write 3 discoveries that were not in your requirements.md. If you find none, your answers were too obedient.'
],

'w2d2': [
  'Look for these words in the document: fast, easy, normally, sometimes, several, many, etc., suitable, manage, the clients, the system, any, always. Mark them in bold or with a comment. If you find fewer than 10, read it out loud: vagueness is heard better than seen.',
  'For each word decide: if you know the number, replace it ("several vets" → "2 vets"). If you take it for granted without confirming it, write "ASM-01: we assume the clinic has a single site". If you do not know and it matters, write "Q-01: can owners have more than one pet with the same name?".',
  'For each question, imagine the answer is the opposite of what you believe and estimate how much work would have to be redone. "Are there several sites?" (a yes changes the whole model → high risk) versus "does the appointment last 30 or 20 min?" (changing a number → low). Order from highest to lowest risk.'
],

'w2d3': [
  'Must: without this v1 does not solve day 1’s problem. Should: important, but there is a manual workaround. Could: would be nice. Won\'t: not in this version (it does not mean never). For each FR ask yourself: can the clinic use v1 without this? If the answer is yes, it is not a Must.',
  'Give each FR a size: S = 1 point, M = 3, L = 5. Add up the Musts and divide by the total. If it is over 60%, move down to Should whatever has a manual workaround ("see statistics": the owner can count by hand for another month). It will hurt: that is the idea.',
  'Template: "VetCare v1 lets [who] [do the Musts] to [solve the problem], without [the most important thing left out]". Check: every part of the sentence must correspond to a Must; if you mention something that is a Should, it is surplus.'
],

'w2d4': [
  'Structure: name, primary actor, precondition, numbered main flow (actor does → system responds), alternative flows, postcondition. Choose 3 Musts with several steps: book an appointment, record a consultation, record a vaccine. The main flow should have between 5 and 9 steps.',
  'At each step of the main flow ask yourself: what if not? "The system shows the free slots" → what if there are none? "The actor chooses the pet" → what if it is not registered? "The system saves" → what if someone else took that slot at the same time? Number them 3a, 5a, 5b to show which step they come from.',
  'For each alternative flow write how the system is left at the end. Example: if the appointment fails to save, was the slot left half-reserved? If you cannot answer "nothing changed" or "X was left complete", there is a design gap: note it as a question in assumptions.md.'
],

'w2d5': [
  'One story = one user action with a benefit. Bad: "As a user I want to manage appointments". Good: "As a receptionist I want to see a vet’s free slots on a day so I can book without calling anyone". If a Must contains "and" or "manage", it is probably several stories.',
  'Make a table with the story and the letters I N V E S T, and put ✓ or ✗: Independent (can it be done on its own?), Negotiable (does it not already impose the solution?), Valuable (does anyone notice it?), Estimable (do you roughly know what it costs?), Small (does it fit in 3 days?), Testable (does it have acceptance criteria?).',
  'If Small fails, split it by flow (happy path first, alternatives later), by kind of data or by rule. If Independent fails, merge the two stories or change the order. If Testable fails, add 2 or 3 Given/When/Then criteria. Repeat until everything has ✓.'
],

'w2d6': [
  'Typical sections: 1 Problem, 2 Stakeholders, 3 v1 scope and non-goals, 4 Functional requirements, 5 Non-functional, 6 Business rules, 7 Use cases, 8 Stories and criteria, 9 Assumptions and open questions, 10 Glossary. Copy what you already have and write only the linking text. Do not rewrite from scratch.',
  'Choose words someone from outside could misunderstand: appointment, consultation, treatment, applied vaccine, booster, owner or responsible person, record, emergency, late cancellation. Each definition must answer: what exactly is it and how does it differ from the similar term? Example: "Consultation: the care given; an appointment is the prior booking".',
  'Time yourself for 5 minutes without looking at anything, and record yourself. When you finish, compare with spec-v1.md: did you mention the problem with its measure of success, the stakeholder with veto, what is in and out of v1? What you forgot is what you do not fully understand yet: read it again.'
],

/* ---------- Week 3 ---------- */

'w3d1': [
  'Open spec-v1.md and copy every noun into a list: pet, owner, appointment, vet, vaccine, consultation, schedule, receptionist, reminder, clinic, species, breed, weight… Do not filter yet: the more, the better. Remove only duplicates and synonyms.',
  'For each candidate: if "Max" changes weight, is it still Max? Yes → it has identity, it is an entity. If the weight "5 kg" changes to "6 kg", is it the same weight? No, it is another value → not an entity, it is an attribute or a value object. Mark E (entity), A (attribute) or V (value).',
  'For each entity write: "X exists because we need to follow its history over time: …". Example: "Appointment exists because it is created, rescheduled and cancelled, and we need to know what happened to it". In the discarded list, one line for each: "Species: it is a value of Pet, it has no history of its own".'
],

'w3d2': [
  'A table per entity: Attribute | Type | Required | Range/format. Use business types, not database ones: text, whole number, decimal, date, date and time, yes/no, closed list. Example: "weight | decimal | yes | 0.05–120 kg, 2 decimals". Check the ranges with common sense: a 300 kg cat does not exist.',
  'For each optional one write: "Optional because…" with a real situation. "Chip: optional because many indoor cats do not have one" works. "Email: optional just in case" does not. If you cannot think of a real case, make it required: it is always easier to relax a rule than to tighten it with data already stored.',
  'Ask for each attribute: is there any legitimate case for correcting it? Date of birth, species and the appointment’s creation date almost never change: mark them 🔒. Weight and phone do change. If in doubt (for example, a wrongly recorded species), note "correctable only by a vet".'
],

'w3d3': [
  'Practical rule: Guid if ids appear in public URLs or are generated in several places (it does not reveal how many records there are and does not clash). int/bigint if it is internal and you want short, readable ids. Choose one per entity and justify it in one sentence. Be consistent: do not mix without a reason.',
  'Entities are compared by Id: two pets with the same name, species and owner are still two if they have different Ids. Write: "Pet: equal if same Id". If there is also a unique natural key (the chip), note it separately as a uniqueness rule, not an equality rule.',
  'Look for groups of attributes that always go together and are compared by what they are worth: money (amount + currency), time range (start + end), address, weight with unit, phone, email. If two "10:00–10:30" are interchangeable, it is a value: it needs no Id.'
],

'w3d4': [
  'For each one make a card: Name / Contains / Rules / Equality. Example: "TimeRange / start and end / end after start, duration between 15 and 120 min, does not cross midnight / equal if start and end are equal". Good options in VetCare: Weight, TimeRange, Money, Email, Phone.',
  'Write the sentence "Now it is impossible to have…". Examples: "…a negative weight or grams where kilos were expected", "…an appointment that ends before it starts", "…an email without @". If you cannot name any invalid state that is removed, that value object adds nothing: choose another.',
  'Go over your day 2 attribute table looking for data with rules or with more than one part: decimals with a unit, start-end pairs, texts with a format (email, phone, chip). Change their type from "decimal" to "Weight" or from "text" to "Email" and note which entities each one appears in.'
],

'w3d5': [
  'Basic syntax: "OWNER ||--o{ PET : has". || means exactly one, o{ means zero or many, |{ one or many and o| zero or one. Write one line per relationship and paste it into mermaid.live to see it. If the diagram does not draw, check the symbols.',
  'Make a table: Relationship | Required on side A? | Required on side B? | When deleting A… | When deleting B…. Example: "Owner–Pet | an owner may have no pets | a pet always has an owner | deleting an owner with pets is not allowed | deleting a pet does not affect the owner". In the deletion columns use business rules, not SQL terms.',
  'Review each 1:N by asking whether the opposite case ever exists: a pet with two responsible people (a separated couple)? a vaccine applied to several pets (batches)? a consultation with two vets? If you find a real case, it is N:N. Document the initial intuition and why it changed.'
],

'w3d6': [
  'In Mermaid you can put attributes inside each entity: "PET { uuid id PK; string name; date birth_date; uuid owner_id FK }". Put only the key attributes (PK, FK and 2 or 3 important ones); if you put all of them, it cannot be read. Check that every day 1 entity and every day 5 relationship appears.',
  'For each story in the example, trace the diagram with your finger: which tables do you touch and what data do you store? Write "Supports" or "Does not support: missing…". Example: "a dog changes owner and the history must be kept": if the relationship stores no dates, who the previous owner was is lost.',
  'For each failure write: problem → change → why. Example: "We did not know who the previous owner was → new Ownership table with start and end date → the clinical history must know who authorised each treatment". Update the diagram and run only that story again.'
],

/* ---------- Week 4 ---------- */

'w4d1': [
  'Rule for 1:N: the FK always goes on the "many" side (pet.owner_id, not owner.pet_ids). For 1:1: it goes in the table that depends on the other or is optional (medical_record.pet_id with UNIQUE). Write "Pet–Owner: FK in pet, because an owner has many pets".',
  'RESTRICT: do not allow deleting the parent if it has children (an owner with pets). CASCADE: delete the children with the parent (only if the children make no sense on their own, like an invoice’s lines). SET NULL: the child survives without a parent (the appointment keeps its record if a vet leaves, with a column that allows NULL). When in doubt with medical data: RESTRICT.',
  'Template: "CREATE TABLE pet ( id uuid PRIMARY KEY, name text NOT NULL, owner_id uuid NOT NULL REFERENCES owner(id) ON DELETE RESTRICT, … );". Create the parent table (owner) first and then the child. Try it in PostgreSQL or an online SQL tool: if it gives an order error, the referenced table does not exist yet.'
],

'w4d2': [
  'Look for sentences where both sides can be "many": a pet receives many vaccines and a vaccine is given to many pets; a vet has several specialties and a specialty is held by several vets; a consultation uses several medicines. List each pair with its business name (AppliedVaccine, not pet_vaccine).',
  'Own attributes: do you need to store date, batch, dose or who applied it? Repetition: can the same pet receive the same vaccine twice (boosters)? If the answer to either is yes, the relationship has a life of its own.',
  'Pure relationship (vet_specialty): PRIMARY KEY (vet_id, specialty_id), which prevents duplicates. With a life of its own (applied_vaccine): id uuid PRIMARY KEY + pet_id + vaccine_id + date + batch, because the same pair repeats over time. Write in an SQL comment why you chose each option.'
],

'w4d3': [
  'Ask for each rule: can it be checked by looking at a single row or the relationship with another table? "Weight greater than 0" → CHECK. "Unique chip" → UNIQUE. "Every pet has an owner" → NOT NULL + FK. "No vaccination before 8 weeks" needs comparing with another table → it does not fit in a simple CHECK: mark it "in code".',
  'Syntax with a name: "CONSTRAINT ck_pet_weight_positive CHECK (weight_kg > 0)", "CONSTRAINT uq_pet_chip UNIQUE (chip)". Name format: prefix_table_rule. The name appears in the error message, so it must explain which rule was broken without having to look it up.',
  'Write an INSERT for each kind of constraint: negative weight (CHECK), repeated chip (UNIQUE), pet without a name (NOT NULL), non-existent owner_id (FK) and an impossible date. Under each one, in a comment: "-- fails on ck_pet_weight_positive". Really run them and copy the real error message.'
],

'w4d4': [
  '1NF: does any column store lists ("vaccines: rabies, distemper") or repeated columns (phone1, phone2)? 2NF: in tables with a composite key, are there columns that depend on only part of the key? 3NF: are there columns that depend on another column that is not the key (appointment.owner_phone depends on owner_id)?',
  'For each violation note: table.column → normal form broken → fix. Example: "appointment.vet_name → 3NF (depends on vet_id) → the column is dropped and obtained with a JOIN". Lists become rows of another table; transitive dependencies move to their own table.',
  'Look for data that must stay frozen at the moment it happened: the price charged for a consultation (even if the price list changes later), the pet’s weight on the day of the vaccine, the name of the prescribed medicine. Justification: "it is historical data, not a copy; if the original changes, this must not change".'
],

'w4d5': [
  'Format: "It always holds that…". Examples: "a vet does not have two appointments that overlap", "a pet always has exactly one responsible owner", "a cancelled appointment cannot be cancelled again", "an applied vaccine has a date that is not in the future", "an invoice’s total is the sum of its lines".',
  'The root is the entity you go through to modify the group. Group what must change together: Pet (with its applied vaccines), Appointment, Owner, Vet (with their schedule). Rule: an aggregate does not hold objects of another aggregate, only their Id (the Appointment holds pet_id, not the whole pet).',
  'If the invariant only looks at one aggregate’s data, that aggregate protects it within a transaction ("a cancelled appointment is not cancelled again" → Appointment). If it crosses aggregates ("a vet without overlaps" looks at many appointments), note that it needs a database constraint or a check with a lock, and that you will see it in week 10.'
],

'w4d6': [
  'Make a table Point | ✓/✗ | Note. Be strict: only mark ✓ if you can point to exactly where it holds (in which table and which line of the SQL). A "more or less" counts as ✗. It is better for you to find the flaws today than to find them in week 9.',
  'Put the ERD and the SQL side by side and go through them entity by entity: every table in the SQL must appear in the ERD with the same relationships, and every FK in the SQL must be a line in the diagram. When you change one, change the other at that very moment, not "later".',
  'Prepare the most debatable decision with the structure: what I chose, the alternative I discarded and why. Example: "I separated Appointment and Consultation even though they look the same; I could use one table with a status, but an appointment may never become a consultation and the consultation has medical data with different permissions". Record yourself for 5 minutes without notes.'
]

});
