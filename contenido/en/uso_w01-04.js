/* What each day is for in a real job, why it matters
   and what to ask (the client, the team or the tech lead) to apply it.
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.USO = Object.assign(window.EN.USO || {}, {

/* ---------- Week 1 · Understanding the problem ---------- */

'w1d1': {
  sirve: 'It is the first thing you do when you are assigned a new project or a big feature: before opening the editor, you clarify which specific pain has to be removed. It is also what you say in the first meeting with the client and in the first line of the README.',
  importa: 'The most expensive projects in the world do not fail because of slow code, they fail because they solved the wrong problem. A week programming what nobody needed is thrown away entirely; ten minutes asking the right questions prevent it.',
  preguntas: [
    { a: 'The clinic owner', q: 'What happened the last time something went wrong with appointments? Tell me about that day.', obt: 'A real case with numbers: "on Tuesday two dogs came at the same time and one waited 40 minutes". The real problem comes from there, not the solution idea they brought.' },
    { a: 'The clinic owner', q: 'If this works six months from now, what will have changed that you can see or count?', obt: 'The measure of success: "fewer than 3 lost appointments a month" or "the receptionist no longer searches for records in the notebook". Without this you will not know when you are done.' },
    { a: 'The clinic owner', q: 'What things do you NOT want the system to do, even if they seem useful?', obt: 'The non-goals: "I keep doing billing at the till". They protect you from scope growing by itself.' }
  ],
  evita: { q: 'Do you want a web app or a mobile app?', por: 'It asks about the solution before knowing the problem and forces the client to decide something technical they cannot decide. First the pain, then the tool.' }
},

'w1d2': {
  sirve: 'In any company, before designing, you map who uses, who pays and who can veto. It tells you whom to invite to each meeting and whom to show the demo to before delivering.',
  importa: 'A system can work perfectly and still be rejected because you ignored the person who uses it eight hours a day, or the one who signs the cheque. Spotting conflicts between stakeholders at the start costs a conversation; spotting them in production costs the project.',
  preguntas: [
    { a: 'The clinic owner', q: 'Who else, apart from you, is going to touch the system or be affected by it?', obt: 'The complete list: vets, receptionist, pet owners, maybe an accountant. Someone you had not thought of usually comes up.' },
    { a: 'The clinic owner', q: 'Who decides in the end whether this is used or thrown away?', obt: 'The stakeholder with veto power. That is the person you show progress to every week.' },
    { a: 'The receptionist', q: 'What scares you most about swapping the notebook for a system?', obt: 'Their real fears ("that the internet goes down and I can’t book appointments"). They become non-functional requirements or a fallback plan.' }
  ],
  evita: { q: 'Everyone agrees with the project, right?', por: 'It is a leading question: you will almost always get a yes. Better to ask each person separately what they want and what they fear, and look for the contradictions yourself.' }
},

'w1d3': {
  sirve: 'Functional requirements are the list of what the system must do. It is what the team turns into tasks, what QA uses to test and what the client reviews to say "yes, I asked for this".',
  importa: 'A vague requirement like "manage appointments" is understood differently in every head, and that difference shows up on delivery day as "this is not what I asked for". A verifiable requirement makes clear when it is done and avoids arguments.',
  preguntas: [
    { a: 'The receptionist', q: 'Show me step by step how you book an appointment today, from when the phone rings until you hang up.', obt: 'The real flow with its steps and data: owner’s name, pet, reason, vet, time. Each step is a candidate functional requirement.' },
    { a: 'The vet', q: 'What information do you need to see about a pet just before it comes into the consultation?', obt: 'The essential data (allergies, last vaccine, weight) and in what order. It tells you what the record must show.' },
    { a: 'The tech lead', q: 'How are we going to check this requirement? What test would mark it as met?', obt: 'A verifiable criterion. If nobody knows how to test it, the requirement is badly written and needs to be made concrete.' }
  ],
  evita: { q: 'What features would you like to have?', por: 'It produces an endless wish list with no priority. Ask about the tasks they do today and how they do them; the requirements come from there.' }
},

'w1d4': {
  sirve: 'Non-functional requirements say HOW well it must work: speed, availability, security, how many users. They are the ones that decide the architecture, the server you rent and the budget.',
  importa: '"Make it fast" cannot be built or tested. "The day’s schedule loads in under 1 second with 50 appointments" can. Without numbers, the system can meet every functional requirement and still be unusable, and nobody will know it was wrong until the client complains.',
  preguntas: [
    { a: 'The clinic owner', q: 'If the system goes down on a Tuesday at 10 in the morning, how long can you manage without it before it is a serious problem?', obt: 'A real availability number ("half an hour, then we go back to paper"). It defines whether you need high availability or a paper plan B.' },
    { a: 'The receptionist', q: 'How long, at most, do you expect to wait from searching for a pet until it appears on screen?', obt: 'A latency limit that comes from the user and not from your intuition, for example "2 seconds, I have the client on the phone".' },
    { a: 'The tech lead', q: 'Are there laws or rules about personal data we have to comply with for this client?', obt: 'Privacy and retention requirements (owners’ data protection) that change how you store and delete information.' }
  ],
  evita: { q: 'Do you want it to be fast and secure?', por: 'Everyone will say yes and you will have learned nothing. Ask about specific situations and tolerable times to get numbers.' }
},

'w1d5': {
  sirve: 'Business rules are the policies the clinic already follows without software: "a puppy is not vaccinated before 8 weeks", "an appointment cancelled with less than 24 h notice is charged". At work they are the logic that will go inside the domain and must be tested most carefully.',
  importa: 'If you mix rules with features, the rules end up scattered across screens, queries and controllers, and when they change (and they do) you have to hunt for them all over the code. Separating them from the start is what lets you change them in one place.',
  preguntas: [
    { a: 'The vet', q: 'Are there situations in which you would NOT treat or NOT vaccinate a pet? Why?', obt: 'Rules with their exact conditions ("I don’t vaccinate if it has a fever", "at least 8 weeks old").' },
    { a: 'The clinic owner', q: 'What happens when a client cancels late or does not show up? Always the same or are there exceptions?', obt: 'The rule and its exceptions ("it is charged, except for clients of more than 5 years"). The exceptions are what break the code if you do not know them.' },
    { a: 'The clinic owner', q: 'Did you decide this rule yourself or does it come from a law or the veterinary association?', obt: 'Where each rule comes from and who can change it. It tells you which will be configurable and which fixed.' }
  ],
  evita: { q: 'What validations do you want on the form?', por: 'It confuses a business rule with a screen detail. Ask about the clinic’s policy; where it is validated is for you to decide later.' }
},

'w1d6': {
  sirve: 'Acceptance criteria are the contract between whoever asks and whoever builds: when they all pass, the story is done. In agile teams they are written before programming and QA uses them directly as test cases.',
  importa: 'Without criteria, "done" means something different to the client, the developer and QA. With Given/When/Then criteria, the discussion moves from opinions to facts: the scenario passes or it does not.',
  preguntas: [
    { a: 'The clinic owner', q: 'Imagine I show you this feature finished. What would you do to check it works?', obt: 'The scenarios they would test themselves. They are your acceptance criteria, written in their language.' },
    { a: 'QA or the tech lead', q: 'Which edge cases worry you about this story?', obt: 'Scenarios you forgot: an appointment at midnight, a pet with no owner, two appointments at once. Each one is one more Given/When/Then.' },
    { a: 'The product owner', q: 'If we could only meet two of these criteria in this delivery, which would they be?', obt: 'Which criteria are essential and which can wait, without having to guess.' }
  ],
  evita: { q: 'Is it OK if we call it done when it works?', por: '"When it works" is not verifiable. Ask for a specific example: given this, when I do that, then I see this other thing.' }
},

/* ---------- Week 2 · From conversation to specification ---------- */

'w2d1': {
  sirve: 'The requirements interview is the main tool for getting information out of the client. You will use it in consultancies, in startups with new clients and inside companies when another department asks you for software.',
  importa: 'A leading question ("you need reminders, right?") gives you your own idea back with a polite yes. A badly run interview produces requirements invented by you, and the client discovers it when it is already built.',
  preguntas: [
    { a: 'The clinic owner', q: 'Tell me about yesterday, from when you opened until you closed.', obt: 'A real narrative with the problems mixed in naturally. Listening to a full day reveals more than a list of closed questions.' },
    { a: 'The clinic owner', q: 'You said "appointments sometimes get lost". How many times last month? What exactly happened?', obt: 'Specific frequency and detail. Following up on what they said, without changing the subject, is the most useful interview technique.' },
    { a: 'The clinic owner', q: 'Is there anything I haven’t asked that you think I should know?', obt: 'Information you did not know existed. This closing question often brings out the most important fact of the meeting.' }
  ],
  evita: { q: 'Don’t you think it would be great to send reminders by WhatsApp?', por: 'It is leading: it suggests the answer and the client will say yes out of politeness. Ask what happens today when a client forgets an appointment and let the need come out by itself.' }
},

'w2d2': {
  sirve: 'At work, every requirements document has dangerous words: "fast", "normally", "the clients", "etc.". Catching those ambiguities and turning them into questions or written assumptions is part of a senior’s daily work.',
  importa: 'Every ambiguity you do not clear up is resolved by the programmer in their own way, silently. A written, validated assumption ("we assume a single site") can be reviewed; an implicit assumption blows up in production.',
  preguntas: [
    { a: 'The clinic owner', q: 'When you say "the clients", do you mean the pet owners or also other clinics that refer patients?', obt: 'The exact meaning of a word you were using as if it were clear.' },
    { a: 'The clinic owner', q: 'I am assuming the clinic has a single site and one set of opening hours. Is that right? Will it stay that way for a year?', obt: 'Confirmation or correction of an assumption that affects the design of the whole system.' },
    { a: 'The tech lead', q: 'I have these five assumptions in the document. Which do you think are riskiest if they turn out to be false?', obt: 'Which assumptions to validate first with the client, ordered by impact.' }
  ],
  evita: { q: 'This is clear, isn’t it?', por: 'Nobody admits they did not understand. Ask them to explain it with an example, or explain it yourself and ask "which part isn’t like that?".' }
},

'w2d3': {
  sirve: 'Prioritising is deciding what goes into the first version and what does not. You will do it in every sprint planning and in every meeting where the client asks for "just one more thing".',
  importa: 'Without priority, everything is urgent and the first version never ships. With MoSCoW you can say no with arguments: "this is a Could, it goes in if there is time left". Delivering something small that works is worth more than promising something big that never arrives.',
  preguntas: [
    { a: 'The clinic owner', q: 'If tomorrow only one thing in the system worked, which would it have to be for it to be useful to you?', obt: 'The real Must. It is usually much smaller than the initial list.' },
    { a: 'The clinic owner', q: 'If this feature arrives two months later, what do you lose?', obt: 'The real cost of waiting. If the answer is "nothing serious", it is a Should or a Could.' },
    { a: 'The tech lead', q: 'How many of these Must stories realistically fit in the first four weeks?', obt: 'A capacity limit that forces scope to be cut with data, not with optimism.' }
  ],
  evita: { q: 'What is important to you?', por: 'Everything will be important. Force a choice: "if you could only have one", "what do you lose if you wait". Priority appears when something has to be given up.' }
},

'w2d4': {
  sirve: 'A use case describes a complete interaction between an actor and the system, including what goes wrong. It is used in medium and large projects, in regulated systems and whenever the flow has many branches.',
  importa: 'The happy path is 20% of the work; the alternative flows (no free slot, the owner does not exist, the connection drops) are 80% of the errors in production. Writing them before programming is the cheapest way to find them.',
  preguntas: [
    { a: 'The receptionist', q: 'What do you do when a client wants an appointment and there is no free slot that day?', obt: 'A real alternative flow (offer another day, a waiting list, squeeze in an emergency) the system must support.' },
    { a: 'The receptionist', q: 'And if someone calls whose pet is not registered yet?', obt: 'Another alternative flow: quick registration during the call, with the minimum data.' },
    { a: 'The tech lead', q: 'At what point in this flow can something technical fail and what does the user see then?', obt: 'The technical exception flows (no connection, double click) that also have to be designed.' }
  ],
  evita: { q: 'Can you describe how booking an appointment works?', por: 'You will only get the happy path. Ask explicitly about what goes wrong: "what if there is no slot?", "what if they get the time wrong?".' }
},

'w2d5': {
  sirve: 'User stories are the unit of work in almost every agile team: what appears in Jira or GitHub Projects. Knowing how to write them well is knowing how to split work into pieces that are finished in days, not months.',
  importa: 'A story that is too big or dependent on others blocks the team for weeks. INVEST is the checklist that avoids stories impossible to estimate, test or deliver.',
  preguntas: [
    { a: 'The product owner', q: 'Who exactly benefits from this story and what will they be able to do that they cannot today?', obt: 'The "as a... I want... so that..." with a real user and benefit, not invented ones.' },
    { a: 'The team in refinement', q: 'Can this story be finished and tested in under three days? If not, where do we split it?', obt: 'A split into smaller stories that still deliver value on their own.' },
    { a: 'QA', q: 'With these acceptance criteria could you test the story without asking me anything?', obt: 'Confirmation that the story is Testable, or the list of open questions still to close.' }
  ],
  evita: { q: 'Can you write me the "pet management" story?', por: '"Management of" is an epic, not a story. Ask about specific actions: register, search, edit allergies; each one is a story.' }
},

'w2d6': {
  sirve: 'A specification document brings problem, scope, requirements and criteria together in one place. At work it is reviewed in a meeting with the client and the team before committing to dates.',
  importa: 'The specification is the reference when doubts or arguments come up mid-project. Without it, each person’s memory is the "truth", and each memory remembers something different.',
  preguntas: [
    { a: 'The clinic owner', q: 'Read the scope section. Is there anything you expected that is not there, or anything there you do not want?', obt: 'Scope corrections now, when changing a line costs nothing.' },
    { a: 'The tech lead', q: 'Which part of this specification seems riskiest to build?', obt: 'The main technical risk, to tackle first or investigate before promising dates.' },
    { a: 'The team', q: 'If I give you only this document, could you start working tomorrow without calling me?', obt: 'The gaps that stop the document from standing on its own.' }
  ],
  evita: { q: 'Do you approve it so we can start?', por: 'It invites a quick yes without reading. Ask for a review of specific sections and ask what is missing or surplus.' }
},

/* ---------- Week 3 · Domain modelling ---------- */

'w3d1': {
  sirve: 'Identifying entities is deciding which "things" the business handles and have their own identity: Pet, Owner, Appointment, Vaccine. It is the basis of the tables, the classes and the API routes.',
  importa: 'If you get the entities wrong, everything built on top inherits the mistake: tables, endpoints and screens. Changing a badly chosen entity six months in is a painful migration that touches the whole system.',
  preguntas: [
    { a: 'The vet', q: 'What things do you keep a record of that you look up later?', obt: 'The nouns that have their own history: pet, consultation, applied vaccine, treatment. They are your candidate entities.' },
    { a: 'The clinic owner', q: 'If a dog changes owner, is it the same record or a new one?', obt: 'Whether Pet is an entity independent of Owner and how they relate.' },
    { a: 'The tech lead', q: 'Does "Treatment" deserve to be an entity or is it just data inside the consultation?', obt: 'A criterion to decide: if it has its own life cycle or is queried separately, it is an entity.' }
  ],
  evita: { q: 'What tables do you need?', por: 'The client does not think in tables. Ask about what they record and look up day to day, and you deduce the entities.' }
},

'w3d2': {
  sirve: 'Defining attributes with type, whether they are required and their range is what later becomes columns, validations and form fields. It is the bridge between the business’s language and the code.',
  importa: 'A badly typed attribute (weight as text, the date as a string) generates silent errors for years. Knowing what is required and what range is valid avoids junk data nobody later dares to clean up.',
  preguntas: [
    { a: 'The vet', q: 'What is the lowest and the highest weight you have recorded? In kilos with decimals?', obt: 'The valid range and precision of the data. It tells you the exact type and the validation.' },
    { a: 'The receptionist', q: 'Which details of an owner do you always have and which are sometimes missing?', obt: 'Which fields must be required and which optional, according to reality and not your ideal form.' },
    { a: 'The tech lead', q: 'Do we store the date of birth or the age?', obt: 'The rule of storing the data that does not change (the date) and computing the one that does (the age).' }
  ],
  evita: { q: 'Is the phone number required?', por: 'A yes or no question with no context. Ask what happens when they do not have someone’s phone number: that way you know whether it is required or just desirable.' }
},

'w3d3': {
  sirve: 'Deciding how each entity is identified (an internal id, a microchip number, an ID card) determines the primary keys, the API URLs and how duplicates are avoided.',
  importa: 'If two records of the same dog coexist without the system knowing, the medical history is split in two and a vet may give a vaccine twice. Identity is a patient safety issue, not just a design one.',
  preguntas: [
    { a: 'The vet', q: 'How do you know for sure that the dog coming in is the same one that came last year?', obt: 'The business’s natural identifier (chip, name plus owner) and how reliable it is.' },
    { a: 'The receptionist', q: 'Have you ever found two records of the same pet? What did you do?', obt: 'Real cases of duplicates and the need for a feature to detect or merge them.' },
    { a: 'The tech lead', q: 'Do we use the microchip number as the primary key or our own id?', obt: 'The argument for a stable internal id with the chip as an optional unique field, because not every pet has a chip.' }
  ],
  evita: { q: 'Is the pet’s name unique?', por: 'The obvious answer is no, and you learn nothing. Ask how they tell two "Max" apart today to discover their real identifier.' }
},

'w3d4': {
  sirve: 'Value objects (Weight, Email, TimeRange, Money) group a value with its rules. At work they are used so that invalid data cannot even exist in the code.',
  importa: 'Passing a loose decimal as "weight" lets someone pass grams where kilos were expected without anyone noticing. A value object turns that mistake into something the compiler or the constructor stops immediately.',
  preguntas: [
    { a: 'The vet', q: 'Do you always record weight in the same unit? With how many decimals?', obt: 'The rules that will live inside the Weight value object: unit, precision and impossible values.' },
    { a: 'The clinic owner', q: 'Do prices include tax? Do you ever charge in another currency?', obt: 'Whether you need a Money value object with a currency or an amount is enough, and how it is rounded.' },
    { a: 'The tech lead', q: 'Where do we have primitive data validated in many different places?', obt: 'Clear value object candidates: if the same validation is copied three times, there is a hidden type there.' }
  ],
  evita: { q: 'Shall we make a class for the email?', por: 'It proposes the solution without the reason. Ask what rules the data has and in how many places they are repeated; the class justifies itself.' }
},

'w3d5': {
  sirve: 'Cardinality (one to one, one to many, many to many) decides the foreign keys, the junction tables and how you navigate between data in the API. It is what gets discussed in every data model review.',
  importa: 'Modelling "a pet has one owner" when in reality it can have two forces you to redo tables, queries and screens when the first real case appears, and it always appears.',
  preguntas: [
    { a: 'The receptionist', q: 'Can a pet have more than one responsible owner, for example a separated couple?', obt: 'Whether the relationship is 1:N or N:N, with real cases that prove it.' },
    { a: 'The vet', q: 'Can two vets take part in the same consultation?', obt: 'The cardinality between Consultation and Vet, which defines whether a foreign key is enough or a junction table is needed.' },
    { a: 'The clinic owner', q: 'Can an owner be registered without any pet?', obt: 'Whether the relationship is mandatory: the minimum is 0 or 1, which affects the database constraints.' }
  ],
  evita: { q: 'Does each pet have one owner?', por: 'A closed question that confirms your assumption. Ask about exceptions: "has a pet ever had more than one person responsible for it?".' }
},

'w3d6': {
  sirve: 'The entity-relationship diagram is the system’s blueprint. It is shown in design meetings, pasted into the documentation and is the first thing someone new to the team looks at.',
  importa: 'An ERD checked against real cases finds in an hour problems that would cost weeks in code. It is also the piece most asked for in interviews to see whether you can model.',
  preguntas: [
    { a: 'The tech lead', q: 'Walk through this case with me: a dog with two owners is vaccinated and then deregistered. Does the model support it?', obt: 'Validation of the ERD against a complete scenario and the gaps that appear.' },
    { a: 'The clinic owner', q: 'I’ll read you the relationships in plain words: "an appointment is for a single pet with a single vet". Is it always like that?', obt: 'Confirmation of the model in the business’s language, without showing them diagrams they cannot read.' },
    { a: 'A teammate', q: 'Which query would be hard for you to write with this model?', obt: 'The points where the model makes common questions difficult, which may call for an adjustment.' }
  ],
  evita: { q: 'Do you like the diagram?', por: 'An opinion question that validates nothing. Ask them to walk a real case over the diagram and point out where it breaks.' }
},

/* ---------- Week 4 · Relationships, integrity and normalisation ---------- */

'w4d1': {
  sirve: 'Deciding where the foreign key lives in 1:1 and 1:N relationships is a daily decision when creating tables or adding a feature. It determines how data is inserted, deleted and queried.',
  importa: 'A foreign key on the wrong side forces two tables to be updated on every change, or allows orphaned data. It is one of the most common mistakes seen in juniors’ code reviews.',
  preguntas: [
    { a: 'The tech lead', q: 'Medical record and pet are 1:1. Do we split it into another table or keep it in the same one?', obt: 'Criteria to decide: access frequency, size, different permissions or optional data.' },
    { a: 'The vet', q: 'If an owner is deregistered, what should happen to their pets’ history?', obt: 'The deletion rule (keep, reassign or block), which defines the foreign key’s ON DELETE.' },
    { a: 'A teammate', q: 'From which side are we going to query this relationship most often?', obt: 'The real access pattern, which influences indexes and how the ORM navigates.' }
  ],
  evita: { q: 'Do I put the FK in pets or in owners?', por: 'A question with no context that makes the other person think for you. Explain the cardinality and ask whether your reasoning holds.' }
},

'w4d2': {
  sirve: 'Junction tables resolve N:N relationships such as pet–vaccine or vet–specialty. At work they almost always end up carrying their own data: date, batch, who applied it.',
  importa: 'Treating an N:N relationship as a list of comma-separated ids in a column is a classic mistake that makes queries and integrity impossible. A well-made junction table is what lets you answer "which dogs received the faulty batch".',
  preguntas: [
    { a: 'The vet', q: 'When you give a vaccine, what do you write down apart from which one it was?', obt: 'The attributes of the relationship (date, batch, dose, vet), which live in the junction table.' },
    { a: 'The clinic owner', q: 'If a manufacturer recalls a batch, do you need to know who it was given to?', obt: 'The traceability need that justifies the junction table with its own data.' },
    { a: 'The tech lead', q: 'Does this junction table deserve its own entity in the domain?', obt: 'The criterion: if it has its own data and rules (AppliedVaccine), it goes from technical table to business concept.' }
  ],
  evita: { q: 'Can I store the vaccines as an array in the pet?', por: 'A question looking for permission for the shortcut. Ask what queries the business will need about vaccines; the answer will tell you no.' }
},

'w4d3': {
  sirve: 'Constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) make the database reject impossible data even if the code has a bug or someone comes in through a script.',
  importa: 'Code changes, migration scripts are written and other applications connect. Constraints are the last defence: if they are not there, sooner or later there will be a negative weight or an appointment without a pet, and cleaning that up costs far more than preventing it.',
  preguntas: [
    { a: 'The vet', q: 'Which values would be impossible in real life? A weight, a date of birth, a temperature.', obt: 'Impossible ranges that turn directly into CHECK constraints.' },
    { a: 'The receptionist', q: 'Can two owners have the same email or phone number?', obt: 'What must be UNIQUE and what not (families sharing a phone).' },
    { a: 'The tech lead', q: 'Do we validate this only in the code or also with a constraint in the database?', obt: 'The practice of validating in both: the code gives good messages and the database guarantees integrity.' }
  ],
  evita: { q: 'Do we need constraints if I already validate in the backend?', por: 'It poses a false dilemma. Ask what other paths write to the database (scripts, migrations, another app) and you will see why both are needed.' }
},

'w4d4': {
  sirve: 'Normalising removes duplication in the data so each fact lives in one place. At work it also tells you when to break normalisation on purpose, for example in reports.',
  importa: 'If the owner’s phone is copied into every appointment, when it changes contradictory data is left and nobody knows which is right. Normalisation avoids anomalies that corrupt the data little by little and without making noise.',
  preguntas: [
    { a: 'The tech lead', q: 'The consultation price: do we read it from the current price list or copy it into the appointment?', obt: 'The distinction between duplicating by mistake and deliberately storing historical data: the price charged must not change if the price list changes.' },
    { a: 'A teammate', q: 'Where do we have the same data stored in two tables?', obt: 'Existing duplication that can cause inconsistencies.' },
    { a: 'The data team', q: 'Does this report need a denormalised table or is a view enough?', obt: 'When it is worth denormalising for performance and when not.' }
  ],
  evita: { q: 'Is it in third normal form?', por: 'An academic question. Ask what happens if a piece of data that appears in several rows changes; that is the practical test of normalisation.' }
},

'w4d5': {
  sirve: 'Invariants are rules that must always hold ("a pet cannot have two appointments at the same time"). Aggregates are the group of objects that protects them. At work they decide what is saved together in a transaction.',
  importa: 'If a critical rule can be bypassed through a side path in the code, it will be. Defining who protects each invariant is what makes the system correct even with several developers touching it at once.',
  preguntas: [
    { a: 'The clinic owner', q: 'What things should never happen, even if someone makes a mistake using the system?', obt: 'The business invariants told by whoever suffers them: two appointments in the same slot, a vaccine given too early.' },
    { a: 'The tech lead', q: 'Which objects have to change together in the same transaction for this rule to hold?', obt: 'The aggregate boundary: not so big it locks everything, nor so small the rule escapes.' },
    { a: 'The vet', q: 'If a rule has a medical exception, who authorises it?', obt: 'Whether the invariant is absolute or has a controlled exception path.' }
  ],
  evita: { q: 'What validations do I put in the aggregate?', por: 'It mixes input validation with invariants. Ask what must ALWAYS be true in the business; that is what the aggregate protects.' }
},

'w4d6': {
  sirve: 'Delivering a defended data model is what you do before creating the real database. It is the document the tech lead and the architect review to give the green light.',
  importa: 'Changing the data model with the system in production is one of the most expensive operations there is. Defending it well now, with discarded alternatives, saves months of migrations.',
  preguntas: [
    { a: 'The tech lead', q: 'Which decision in this model would be hardest for you to change a year from now?', obt: 'The riskiest structural decision, to review twice before moving on.' },
    { a: 'The architect', q: 'If the clinic opens a second site, which tables have to be touched?', obt: 'A test of the model’s evolution against a likely business change.' },
    { a: 'A teammate', q: 'Try to break the model: look for data it cannot store or a rule that can be violated.', obt: 'Gaps you do not see because you know your own design too well.' }
  ],
  evita: { q: 'Is the model OK?', por: 'Too open. Ask them to attack it with specific cases or future changes; that is how what needs fixing comes out.' }
}

});
