window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 1, phase: 'Requirements engineering', title: 'Understand the problem before you code',
  idea: 'A senior engineer does not start by writing code. They start by understanding what real problem a person has and how we will know we solved it.',
  res: [
    { t: 'Wikipedia — Requirements analysis', u: 'https://en.wikipedia.org/wiki/Requirements_analysis', note: 'Reference article: how requirements are analysed and which kinds exist.' },
    { t: 'Mountain Goat — User stories', u: 'https://www.mountaingoatsoftware.com/agile/user-stories', note: 'Mike Cohn’s classic reference on user stories.' },
    { t: 'Cucumber — Gherkin reference', u: 'https://cucumber.io/docs/gherkin/reference/', note: 'Given/When/Then syntax for verifiable acceptance criteria.' },
    { t: 'Nielsen Norman — User interviews', u: 'https://www.nngroup.com/articles/user-interviews/', note: 'How to ask questions without leading people to the answer you want to hear.' },
    { t: 'Wikipedia — Business rule', u: 'https://en.wikipedia.org/wiki/Business_rule', note: 'What a business rule is and why it exists even without software.' },
    { t: 'Nielsen Norman Group — Problem Statements in UX Discovery', u: 'https://www.nngroup.com/articles/problem-statements/', note: 'How to write the problem before thinking about the solution.' },
    { t: 'Wikipedia — Stakeholder analysis', u: 'https://en.wikipedia.org/wiki/Stakeholder_analysis', note: 'Types of stakeholders and the power-interest grid.' },
    { t: 'Wikipedia — Non-functional requirement', u: 'https://en.wikipedia.org/wiki/Non-functional_requirement', note: 'Definition, classification and examples of non-functional requirements.' }
  ],
  days: [
    {
      t: 'The business problem',
      obj: 'Write in a single sentence what real problem VetCare solves, without mentioning any technology.',
      why: 'In an interview, the first question about your project is always "what does it do and for whom". If you answer with technologies instead of the problem, you lose points immediately.',
      study: { r: 5, what: 'Read the Nielsen Norman Group article on problem statements. About 12 minutes. Look for one thing: the difference between what the client ASKS for (a solution) and what they NEED (a problem solved).',
        pasos: [
          'Read the section "What’s a Problem Statement?" (~4 min) and write in one line, in your own words, what it is.',
          'Read "How to Write a Problem Statement" (~5 min). Note the parts a good problem statement must have.',
          'Read "Problem Statements Don’t Need to Be Negative" (~2 min).',
          'Close the article. Write three different sentences about what problem VetCare solves without naming any technology.',
          'Cross out any sentence that describes a solution ("an app", "a system", "a database"). Keep the shortest one that is still true.'
        ] },
      ex: {
        title: 'Bad vs good',
        body: `BAD (talks about the solution):
"VetCare is a web system in C# with PostgreSQL for clinics."

GOOD (talks about the problem):
"Small veterinary clinics miss appointments and do not know
which vaccines each pet has pending, because they write it
in a notebook. VetCare prevents missed appointments and
forgotten vaccines."

The test: if you delete the sentence and the reader does not
know who is hurting, you are still talking about the solution.

------------------------------------------------------------
THIS IS WHAT THE FILE LOOKS LIKE AT THE END OF THE DAY
(docs/requirements.md)
------------------------------------------------------------

# VetCare - Requirements

## 1. Business problem

Small veterinary clinics miss appointments and forget pending
vaccines because they write everything down in a notebook.

### Context facts (made up, but realistic)
1. The clinic has 2 vets and 1 receptionist.
2. It looks after about 600 pets, mostly dogs and cats.
3. It gets about 25 appointments a day, half of them by phone.
4. Every week 3 or 4 clients do not show up and nobody
   reminds them beforehand.
5. To know which vaccine is due, the receptionist searches
   the notebook by hand, and sometimes cannot find the record.

### What VetCare will NOT do (non-goals)
1. It will not take payments or issue invoices (that stays
   at the till).
2. It will not be an app for owners to book on their own.
3. It will not manage the medicine inventory.

Notice: not a single word about C#, web, app or database in
the problem sentence. You make up the facts; what matters is
that they are concrete (numbers) and believable.`
      },
      steps: [
        'Write VetCare’s problem in one sentence of at most 25 words. Naming languages, frameworks or databases is forbidden.',
        'Below it, write 5 context facts (how many pets, how many vets, what happens today without the system).',
        'Write 3 things VetCare will explicitly NOT do. This is called setting the scope.'
      ],
      vet: [
        'Create the docs/ folder in your project and the requirements.md file inside it.',
        'Add a heading "1. Business problem" and paste the sentence, the 5 facts and the 3 non-goals there.'
      ],
      edge: [
        'If your sentence works just as well for a dog grooming salon, it is too generic. Make it specific.',
        'If you cannot name who is hurting, you do not have a business problem yet.'
      ],
      quiz: [
        { q: 'Why is it a mistake to describe the problem by mentioning the technology?', a: 'Because it fixes the solution before understanding the need. If the problem is "they miss appointments", the best solution might be a WhatsApp reminder, not a website. Choosing the technology first closes options.' },
        { q: 'What is the difference between what the client asks for and what they need?', a: 'What they ask for is their idea of a solution ("I want an Excel button"). What they need is the outcome ("I need to give the owner the monthly report in 5 minutes"). Your job is to get to the second one.' },
        { q: 'What are non-goals for?', a: 'To protect the scope. Without them, every conversation adds features and the project never ends. It is the cheapest tool against scope creep.' },
        { q: 'How would you know VetCare solved the problem?', a: 'You need an observable measure: for example "missed appointments per month drop from 12 to fewer than 3". If you cannot measure it, you cannot show it worked.' }
      ],
      out: 'docs/requirements.md with section 1 complete: 1 problem sentence, 5 facts, 3 non-goals.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Stakeholders',
      obj: 'Identify everyone affected by VetCare and what each of them wants, including the ones who contradict each other.',
      why: 'Most projects fail not because of bad code, but because they were built for one type of user and ignored another who had veto power.',
      study: { r: 6, what: 'Read the Wikipedia article on stakeholder analysis. About 10 minutes. Look for the difference between user, client and sponsor. They are not the same person.',
        pasos: [
          'Read the introduction (~2 min): what a stakeholder is and why you analyse them.',
          'Read "Stakeholder types" (~3 min) and note the types that appear.',
          'Read "The power-interest matrix" (~4 min) and draw the two-axis grid on paper.',
          'Place VetCare’s people on the grid: clinic owner, vet, receptionist and pet owner.',
          'For each one write who USES the system, who PAYS for it and who DECIDES whether it is bought.'
        ] },
      ex: {
        title: 'VetCare stakeholder table',
        body: `| Who            | What they want              | What they fear           |
|----------------|-----------------------------|--------------------------|
| Vet            | See the history in 10 sec   | Typing a lot             |
| Receptionist   | Book without clashes        | Getting the time wrong   |
| Clinic owner   | Know the month's income     | Paying an expensive licence |
| Pet owner      | Be reminded of vaccines     | Spam                     |

Conflict detected: the pet owner fears spam, but the clinic
owner wants to send reminders. That conflict is decided now,
not in production.`
      },
      steps: [
        'Build the table with at least 4 VetCare stakeholders: who, what they want, what they fear.',
        'Mark with a star the stakeholder who can cancel the project if they are not happy.',
        'Find and write 1 real conflict between two of them, and how you would resolve it.'
      ],
      vet: [
        'Add the section "2. Stakeholders" to docs/requirements.md with the full table.',
        'Below the table write the conflict you found and your decision, in 2 sentences.'
      ],
      edge: [
        'Do not forget the stakeholders who do not use the system but suffer it: accounting, support, whoever pays the server bill.',
        'If all your stakeholders want the same thing, you did not look hard enough. There is always tension.'
      ],
      quiz: [
        { q: 'Difference between user and client?', a: 'The user uses the system every day (receptionist). The client pays for it (clinic owner). They can want opposite things: the client wants more controls, the user wants fewer clicks.' },
        { q: 'What do you do when two stakeholders ask for incompatible things?', a: 'You do not choose in silence. You document both positions, propose an option with its cost, and ask whoever has the authority for an explicit decision. Then you write it down so nobody can deny it later.' },
        { q: 'Why does it matter what a stakeholder FEARS, not only what they want?', a: 'Because fear predicts rejection. A vet who fears typing a lot will not use your 20-field form even if it has every feature they asked for.' },
        { q: 'Who is the most dangerous stakeholder to ignore?', a: 'The one with veto power who is not a daily user: typically whoever pays or is legally responsible for the data. They show up late and can wipe out months of work.' }
      ],
      out: 'Section 2 of requirements.md: a table of at least 4 stakeholders + 1 documented conflict with a decision.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Functional requirements',
      obj: 'Write 10 functional requirements for VetCare that are verifiable, not vague wishes.',
      why: 'A badly written functional requirement is a guaranteed argument in 3 months. A well written one can be turned into an automated test almost word for word.',
      study: { r: 1, what: 'Read Mountain Goat’s guide to user stories. About 10 minutes. Notice why the "so that" is the most important part.',
        pasos: [
          'Read "What Is a User Story?" and "Why User Stories Work" (~4 min).',
          'Read "The User Story Template" (~2 min). Copy the template: As a <role> I want <action> so that <benefit>.',
          'In "User Story Examples" read the "Internal Business System" case (~2 min): it is the one closest to VetCare.',
          'Read "Improving a Weak Story" (~2 min) and note how a weak story is fixed.',
          'Write three VetCare stories with the template. Cross out the ones without a real "so that".'
        ] },
      ex: {
        title: 'Vague vs verifiable requirement',
        body: `VAGUE:
"The system must manage appointments."
It cannot be tested. Manage what? Who? When does it fail?

VERIFIABLE:
FR-01 — As a receptionist I want to book an appointment
        giving the pet, vet, date and time,
        so that the vet knows who they are seeing.
        The system rejects the appointment if the vet
        already has another one at that same time.

Notice: it has an ID, a role, an action, a benefit and a
rule that can be turned into a test.`
      },
      steps: [
        'Write 10 functional requirements with IDs (FR-01 ... FR-10) using the As a / I want / so that format.',
        'Add to each one at least one rejection condition or limit ("the system rejects if...").',
        'Reread each one and ask: could I write a test that fails or passes with this? If not, rewrite it.'
      ],
      vet: [
        'Add the section "3. Functional requirements" to docs/requirements.md with the 10 numbered FRs.',
        'Next to each FR write the stakeholder from yesterday who asked for it. If an FR has no owner, be suspicious: maybe you made it up.'
      ],
      edge: [
        'A requirement with the word "and" is usually two requirements in disguise. Split them.',
        'If a requirement says "should" or "ideally", it is not a requirement: it is an idea. Move it to a separate list.'
      ],
      quiz: [
        { q: 'What makes a requirement verifiable?', a: 'That you can describe a concrete situation where it is met and another where it is not. If there is no case where the requirement fails, the requirement says nothing.' },
        { q: 'Why is the "so that" of a user story the key part?', a: 'Because it is the benefit, and it is the only thing that lets you propose a better solution. If you only have the action, you implement it literally. If you have the benefit, you can solve it more simply.' },
        { q: 'What is wrong with the requirement "the system must be easy to use"?', a: 'It is not functional, it is non-functional, and it is not measurable either. It would have to become something like "a new receptionist books their first appointment in under 2 minutes without help".' },
        { q: 'Why number requirements with an ID?', a: 'So you can refer to them later in commits, tests, ADRs and conversations. "Breaks FR-04" is traceable; "breaks the appointments thing" is not.' }
      ],
      out: '10 functional requirements with an ID, As a / I want / so that format, a rejection condition and the related stakeholder.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Non-functional requirements',
      obj: 'Define 6 non-functional requirements for VetCare with concrete numbers, not adjectives.',
      why: 'Non-functional requirements are the ones that decide the architecture. "Must support 10 users" and "must support 10 million" produce two completely different systems with the same functional requirements.',
      study: { r: 7, what: 'Read the Wikipedia article on non-functional requirements. About 10 minutes. Note the categories: performance, security, availability, usability, maintainability, legal compliance.',
        pasos: [
          'Read "Definition" (~2 min): the difference between what the system DOES and how well it does it.',
          'Read "Classification of non-functional requirements" (~2 min): execution qualities versus evolution qualities.',
          'Go through "Examples" (~4 min) and mark the ones that apply to a veterinary clinic.',
          'For each one you marked, write a requirement with a number in it (response time, hours of availability, days of retention). If it has no number, it is not a requirement yet.'
        ] },
      ex: {
        title: 'Adjective vs number',
        body: `ADJECTIVE (useless):
"The system must be fast and secure."

NUMBER (decides architecture):
NFR-01 Performance: the history search responds in under
       300 ms at the 95th percentile, with 5000 pets in
       the database.
NFR-02 Availability: the clinic opens 8:00-20:00. Outside
       those hours, maintenance is allowed.
NFR-03 Security: passwords are stored with a bcrypt hash,
       never in plain text.
NFR-04 Legal: the medical history is kept for 5 years.

Each number above changes a real technical decision:
indexes, backups, hashing library, deletion policy.`
      },
      steps: [
        'Write 6 NFRs (NFR-01 ... NFR-06) covering at least: performance, security, availability and data.',
        'Each one must have a number or a concrete limit. Adjectives on their own are forbidden.',
        'Next to each NFR write which technical decision it forces you to make.'
      ],
      vet: [
        'Add the section "4. Non-functional requirements" to docs/requirements.md.',
        'Mark which of the 6 you think will be hardest to meet and why.'
      ],
      edge: [
        'An NFR with no way to measure it is a wish. If you say 300 ms, think now about what you will measure it with.',
        'Be careful asking for 99.99% availability: that is 52 minutes of downtime a year and it costs a fortune. Ask for what the business really needs.'
      ],
      quiz: [
        { q: 'Why do NFRs decide the architecture more than functional ones?', a: 'Because functional requirements say WHAT the system does and can almost always be implemented in many ways. Non-functional ones impose limits on scale, latency and risk that rule out whole options.' },
        { q: 'What does the 95th percentile mean in a latency requirement?', a: 'That 95% of requests respond below that time. It is used instead of the average because the average hides the slow cases, which are exactly the ones that annoy the user.' },
        { q: 'Give an example of a legal NFR in VetCare and its technical impact.', a: 'Keep the medical history for 5 years. Impact: you cannot physically DELETE records; you need soft deletion, an archiving policy and backups with retention.' },
        { q: 'Why is it dangerous to ask for "maximum security"?', a: 'Because it is not a goal, it is an endless gradient with no stopping point. Without a concrete level (which threats, which data, which compliance) you do not know when to stop and cannot justify the cost.' }
      ],
      out: '6 NFRs with concrete numbers and the technical decision each one imposes.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Business rules',
      obj: 'Extract VetCare’s business rules and separate them from the functional requirements.',
      why: 'Business rules are the ones that change the most and cause the most bugs when they are copied into five places in the code. Identifying them now lets you centralise them in the domain later.',
      study: { r: 4, what: 'Read the whole article, it is short. About 8 minutes. Key idea: a business rule is true even if the software does not exist; the requirement is what the software does with it.',
        pasos: [
          'Read the opening summary and the "Introduction" section (~3 min).',
          'Read "Categories" (~3 min) and note the categories of rules it proposes.',
          'Write five clinic rules, for example: an appointment cannot overlap another one for the same vet.',
          'Check each rule: would it still be true if the clinic worked with pen and paper? If not, it is a software requirement, not a business rule.'
        ] },
      ex: {
        title: 'Requirement vs business rule',
        body: `FUNCTIONAL REQUIREMENT (what the system does):
FR-02 The receptionist can cancel an appointment.

BUSINESS RULE (a truth of the business):
BR-01 An appointment cannot be cancelled with less than 2
      hours' notice, unless the vet cancels it.
BR-02 A pet can only have one active record.
BR-03 In this clinic, the rabies vaccine is repeated every
      12 months.

Test to tell them apart: if tomorrow you shut down the
software and they go back to the paper notebook, BR-01 is
still true. FR-02 disappears. That is a business rule.`
      },
      steps: [
        'Write 8 VetCare business rules with IDs BR-01 ... BR-08.',
        'Apply the paper notebook test to each one: is it still true without software? If not, it is not a business rule.',
        'Mark which of those rules you think could change within 1 year. Those are the ones that will need to be configurable.'
      ],
      vet: [
        'Add the section "5. Business rules" to docs/requirements.md.',
        'Link each BR to the FR that enforces it. If a BR has no FR, you are missing a requirement.'
      ],
      edge: [
        'Rules with exceptions ("unless...") are the ones that cause the most bugs. Write the exception explicitly; do not leave it implicit.',
        'A rule nobody can confirm for you is probably one you are making up. Mark it as an ASSUMPTION.'
      ],
      quiz: [
        { q: 'What is the quick test to know whether something is a business rule?', a: 'Ask whether it would still be true without the software. "A pet has a single responsible owner" is a business rule. "The system shows a confirmation dialog" is not.' },
        { q: 'Why is it worth centralising business rules in the code?', a: 'Because if the same rule is duplicated in the controller, the service and the frontend, when it changes you will update two of the three places and have a silent bug.' },
        { q: 'What do you do with a rule you cannot confirm with the client?', a: 'You still write it, but marked as an ASSUMPTION, with the pending question next to it. A documented assumption is manageable; an implicit one in your head is a time bomb.' },
        { q: 'Why are the exceptions to a rule dangerous?', a: 'Because they are usually discovered late, in production, and force you to change a validation that is already spread around. Writing them from the start forces you to design the full case.' }
      ],
      out: '8 business rules with IDs, checked with the notebook test, and each one linked to its FR.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Acceptance criteria (weekly exam)',
      obj: 'Turn 5 requirements into Given/When/Then acceptance criteria and defend your specification.',
      why: 'Acceptance criteria are the bridge between the business and the automated test. If you know how to write them, later on integration tests almost write themselves.',
      study: { r: 2, what: 'Read the Gherkin reference: Feature, Scenario, Given, When, Then. 12 minutes. Notice the golden rule: Given is state, When is ONE action, Then is an observable result.',
        pasos: [
          'Read "Keywords" and "Feature" (~3 min).',
          'Read "Example" and "Steps": Given, When, Then, And, But (~5 min). Golden rule: Given is state, When is ONE action, Then is an observable result.',
          'Read "Background" and "Scenario Outline" with "Examples" (~4 min): how not to repeat steps and how to test several data sets with one scenario.',
          'Write two scenarios for booking an appointment: one that goes well and one that fails because of an overlap.'
        ] },
      ex: {
        title: 'Acceptance criterion for FR-01',
        body: `Feature: Book appointment

Scenario: Valid appointment in a free slot
  Given vet Ana has no appointments on 10/10 at 09:00
  And the pet "Rocky" is registered
  When the receptionist books an appointment for Rocky
       with Ana on 10/10 at 09:00
  Then the appointment is saved with status "CONFIRMED"
  And Ana sees the appointment in her schedule for 10/10

Scenario: Time clash
  Given vet Ana already has an appointment on 10/10 at 09:00
  When the receptionist tries to book another appointment
       for Ana on 10/10 at 09:00
  Then the system rejects the appointment
  And shows the message "The vet is not available"

One When per scenario. If you need two actions,
they are two scenarios.`
      },
      steps: [
        'Pick 5 of the requirements you wrote and write 2 scenarios for each: a happy one and a rejection one.',
        'Check that each scenario has exactly one When. If it has two, split it.',
        'Without looking at your notes, explain out loud for 3 minutes: what problem VetCare solves, for whom, and how you will know it works.'
      ],
      vet: [
        'Create docs/acceptance-criteria.md with the 10 scenarios (5 requirements x 2).',
        'At the end of requirements.md add a section "6. Open assumptions" with all the questions you could not answer this week.'
      ],
      edge: [
        'A Then that says "the system works correctly" is useless. It has to be observable: a state, a message, a record.',
        'If a scenario needs 8 lines of Given, your case is too big or your model is wrong.'
      ],
      quiz: [
        { q: 'Why only one When per scenario?', a: 'Because if the scenario fails with two actions you do not know which one broke it. One When means a clear diagnosis when the test turns red.' },
        { q: 'What is the relationship between an acceptance criterion and an integration test?', a: 'Almost one to one. Given is the arrange (prepare data), When is the act (call the endpoint), Then is the assert. That is why writing good criteria saves work later.' },
        { q: 'What do you put in Then if the result is a rejection?', a: 'The observable state of the rejection: response code, concrete error message and above all that the data was NOT saved. The "was not saved" is often forgotten and it is half the value of the test.' },
        { q: 'Summarise the week: what is the right order from problem to criterion?', a: 'Business problem -> stakeholders -> functional and non-functional requirements -> business rules -> acceptance criteria. Each step rests on the previous one; skipping one makes the next one invented.' }
      ],
      out: 'docs/acceptance-criteria.md with 10 Gherkin scenarios + an open assumptions section in requirements.md.',
      file: 'docs/acceptance-criteria.md'
    }
  ]
},
{
  n: 2, phase: 'Requirements engineering', title: 'From conversation to specification',
  idea: 'Requirements never arrive clean. They arrive as a confusing, contradictory conversation. This week you learn to turn that noise into something a team can build.',
  res: [
    { t: 'Nielsen Norman — User interviews', u: 'https://www.nngroup.com/articles/user-interviews/', note: 'Interview technique: open questions, not leading ones.' },
    { t: 'Wikipedia — Software requirements specification', u: 'https://en.wikipedia.org/wiki/Software_requirements_specification', note: 'How a specification is structured and what makes a requirement good.' },
    { t: 'Mountain Goat — User stories', u: 'https://www.mountaingoatsoftware.com/agile/user-stories', note: 'User stories and INVEST.' },
    { t: 'Wikipedia — MoSCoW method', u: 'https://en.wikipedia.org/wiki/MoSCoW_method', note: 'Must / Should / Could / Won\'t. Short and enough.' },
    { t: 'UML use case diagrams', u: 'https://www.uml-diagrams.org/use-case-diagrams.html', note: 'Use case notation reference.' },
    { t: 'Agile Alliance — INVEST', u: 'https://www.agilealliance.org/glossary/invest/', note: 'Bill Wake’s six criteria for a good user story.' },
    { t: 'Wikipedia — Use case', u: 'https://en.wikipedia.org/wiki/Use_case', note: 'What a use case is and the classic templates to write one (Cockburn).' }
  ],
  days: [
    {
      t: 'Requirements interview',
      obj: 'Prepare and simulate an interview with the clinic owner, without asking leading questions.',
      why: 'Knowing how to ask is the skill that separates a programmer from an engineer. A bad set of questions produces a system nobody uses, however clean the code is.',
      study: { r: 0, what: 'Read the whole article (~12 min). The essentials: ask about the concrete past ("what happened the last time...") rather than the hypothetical future ("would you use...").',
        pasos: [
          'Read "Why Conduct User Interviews?" (~2 min): what an interview is for and what it will NOT give you.',
          'Read "1. Identify What You’d Like to Learn" and "2. Prepare a Guide" (~4 min). Write in one line what you want to learn from the clinic owner.',
          'Read "4. Start Easy", "5. Build Rapport" and "6. Follow Up and Probe" (~4 min). Note three follow-up questions you can reuse (for example: tell me more about that).',
          'Read "Limitations of Interviews" (~2 min): why what people say they do is not always what they do.',
          'Review your questions: change every "would you use...?" or "would you like...?" into "tell me about the last time...".'
        ] },
      ex: {
        title: 'Leading vs open question',
        body: `LEADING (only confirms what you already believed):
"Would you like automatic vaccine reminders?"
Answer: "yes, sure". You learned nothing.

OPEN, ABOUT THE PAST (gives you real data):
"Tell me about the last time a pet missed a vaccine.
 How did you find out? What did you do?"
Answer: "the owner called, angry, three months later,
I had to search the 2023 notebook..."

There they appeared: the channel (a call), the delay
(3 months), the pain (searching an old notebook) and the
real stakeholder.`
      },
      steps: [
        'Write 12 questions for the clinic owner. At least 8 must be about concrete past events.',
        'Mark and rewrite any question that can be answered with yes or no.',
        'Simulate the interview: answer yourself as if you were the owner, inventing realistic and somewhat contradictory answers.'
      ],
      vet: [
        'Create docs/interview-notes.md with the 12 questions and the simulated answers.',
        'At the end list 3 new things you discovered that were not in requirements.md.'
      ],
      edge: [
        'If all the simulated answers suit you, you cheated. Put in at least one answer that breaks your plan.',
        'Be careful interviewing only the one who pays. The person who uses the system every day gives you different information.'
      ],
      quiz: [
        { q: 'Why ask about the past and not about the future?', a: 'Because people predict their own future behaviour badly but remember well what hurt them. "Would you use X?" gives opinions; "what happened last time?" gives data.' },
        { q: 'What is wrong with a yes/no question?', a: 'It closes the conversation and tends to lead the answer. Open questions force people to tell a story, and in the story the details you did not know you had to ask for come out.' },
        { q: 'What do you do if two interviewees contradict each other?', a: 'You do not pick the one you like better. You note the contradiction as an explicit conflict, look for a third piece of evidence (observe the real process) and take the decision to whoever has the authority.' },
        { q: 'What is the "awkward silence" in an interview and what is it for?', a: 'It is waiting 3-5 seconds after the person finishes talking. They almost always keep going, and the second thing they say is more honest and more useful than the first.' }
      ],
      out: 'docs/interview-notes.md with 12 questions, simulated answers and 3 new discoveries.',
      file: 'docs/interview-notes.md'
    },
    {
      t: 'Ambiguity and assumptions',
      obj: 'Hunt down the ambiguities in your own documentation and turn them into explicit assumptions or questions.',
      why: 'Ambiguity does not go away on its own: it becomes a decision someone makes at 2 a.m. with no context. Catching it now costs minutes; catching it in production costs days.',
      study: { r: 1, what: 'Today the main material is you: your own requirements.md. First, read the "Requirement quality" section on Wikipedia (~6 min) to know what to look for.',
        pasos: [
          'Read "Requirement quality" and note the qualities a requirement must have.',
          'Open your requirements.md and underline the vague words: "fast", "several", "normally", "etc", "if applicable".',
          'For each vague word, write the question you would ask the client to turn it into a number or a concrete rule.',
          'Rewrite the requirement with the most likely answer and mark the assumption as pending confirmation.'
        ] },
      ex: {
        title: 'Ambiguity hunt',
        body: `ORIGINAL:
"The receptionist can cancel recent appointments."

AMBIGUITIES:
- "recent" = how recent? 2 hours? 7 days?
- "cancel" = delete it or mark it as cancelled?
- can they cancel ANOTHER receptionist's appointments?
- what happens to the cancelled appointment in the vet's
  schedule?

RESULT:
ASM-01 "Recent" = future appointment with more than 2h of
       margin. (assumption, confirm with the owner)
BR-04  Cancel = change the status to CANCELLED, never delete.
Q-01   Can a receptionist cancel appointments created by
       another one? -> pending answer.`
      },
      steps: [
        'Reread requirements.md and underline every vague word. You should find at least 10.',
        'Turn each one into: a concrete number, a numbered ASSUMPTION, or a numbered QUESTION.',
        'Order the questions by risk: which would force you to redo the most work if the answer is the opposite of what you assume.'
      ],
      vet: [
        'Create docs/assumptions.md with two tables: ASSUMPTIONS (ASM-01...) and OPEN QUESTIONS (Q-01...).',
        'Each assumption includes: what I assume, what I base it on and what happens if I am wrong.'
      ],
      edge: [
        'The word "simply" almost always hides complexity. Wherever you see it, there is an unwritten requirement.',
        'An assumption with no documented consequence is useless. What matters is not the assumption, it is the cost of being wrong.'
      ],
      quiz: [
        { q: 'What is the difference between an assumption and an open question?', a: 'An assumption is a decision you made to be able to move on, and you document it so you can reverse it. An open question is something that still blocks you or that you do not dare to decide alone.' },
        { q: 'Why document "what happens if I am wrong"?', a: 'Because that gives you the priority. A wrong assumption that costs 10 minutes to change can stay; one that forces you to redo the data model must be confirmed now.' },
        { q: 'Give three words that signal ambiguity.', a: '"Fast", "several", "normally", "etc.", "if applicable", "simply", "should". They all hand the decision to the reader, and the future reader is you with no memory of it.' },
        { q: 'What is the risk of resolving every ambiguity before starting?', a: 'Analysis paralysis. Not every ambiguity matters. That is why they are ordered by risk: you resolve the ones that affect irreversible decisions and leave the rest as assumptions.' }
      ],
      out: 'docs/assumptions.md with at least 6 assumptions and 4 open questions, ordered by risk.',
      file: 'docs/assumptions.md'
    },
    {
      t: 'Prioritising with MoSCoW',
      obj: 'Prioritise all your requirements and define a first-version scope you can actually build.',
      why: 'Every personal project dies of too much scope. Knowing how to say "this is not in v1" is an engineering skill, not a lack of ambition.',
      study: { r: 3, what: 'Read the MoSCoW page (~6 min). Key idea: the Won\'t category is mandatory and the most valuable one. If you have no Won\'t, you did not prioritise.',
        pasos: [
          'Read the introduction and "Background" (~2 min): where the method comes from.',
          'Read "Prioritization of requirements" (~3 min) and copy the definition of each category: Must, Should, Could and Won\'t.',
          'Read "Criticism" (~2 min): what problems the method has and how to avoid them.',
          'Before classifying, write the rule you will use for Must: if it is missing, v1 makes no sense. Apply it with no exceptions.'
        ] },
      ex: {
        title: 'MoSCoW applied to VetCare v1',
        body: `MUST (without this there is no product):
  FR-01 Book an appointment without clashes
  FR-03 Pet record with history
  FR-05 Login for vet and receptionist

SHOULD (important, but the product lives without it):
  FR-07 Vaccine reminder
  FR-08 Find a pet by the owner's name

COULD (if there is time left):
  FR-09 Export history to PDF

WON'T in v1 (an explicit decision, not an oversight):
  Invoicing
  Mobile app
  Multi-clinic

Rule of thumb: MUST should not exceed 60% of the effort.
If everything is MUST, you did not prioritise, you just
made a list.`
      },
      steps: [
        'Classify all your FRs as Must / Should / Could / Won\'t.',
        'Roughly estimate the effort of each FR and add them up: if the Musts exceed 60% of the total effort, reclassify. Force yourself to move things down.',
        'Write in one sentence what VetCare v1 is: only the Musts.'
      ],
      vet: [
        'Add the section "7. Scope v1 (MoSCoW)" to docs/requirements.md with the 4 lists.',
        'Below it write the v1 scope sentence and the target date you set yourself.'
      ],
      edge: [
        'If something is a Must only because it is fun to program, it is a Could. Be honest.',
        'Won\'t does not mean never: it means not in this version. Write "Won\'t v1" to make it clear.'
      ],
      quiz: [
        { q: 'Why is the Won\'t category the most valuable?', a: 'Because it is the only one that really reduces work. Must/Should/Could only order; Won\'t cuts. It also turns an oversight into a decision you can defend in front of the stakeholder.' },
        { q: 'What does it mean that Must should not exceed 60% of the effort?', a: 'That you leave yourself room for what you did not foresee, which always shows up. If you plan at 100% capacity, any surprise breaks the date.' },
        { q: 'What is the difference between Should and Could?', a: 'Should hurts not to have, but there is a manual workaround. Could is a "nice to have" with no real pain if it is missing. If you cannot name the workaround, it is probably a Must.' },
        { q: 'How do you defend to a stakeholder that their favourite feature is a Could?', a: 'With its impact on the business problem from week 1. "This does not reduce missed appointments or forgotten vaccines, which is what we defined as the problem. It goes into v2 unless we change the goal."' }
      ],
      out: 'A complete MoSCoW section with the 4 categories and the v1 scope sentence.',
      file: 'docs/requirements.md'
    },
    {
      t: 'Use cases',
      obj: 'Write 3 complete use cases with a main flow and alternative flows.',
      why: 'The use case is where you discover the paths you had not thought of. Most production bugs live in the alternative flows nobody wrote down.',
      study: { r: 6, what: 'Read on Wikipedia how a use case is written, especially Cockburn’s template. About 12 minutes. You do not need to draw the UML diagram yet: today the text matters (actor, precondition, main flow, alternative flows, postcondition).',
        pasos: [
          'Read "Definition" and "General principle" (~3 min): a use case describes a goal of the actor, not a screen.',
          'Read "Templates" and within it "Cockburn style" and "Fully dressed" (~5 min). Copy the sections of the full template.',
          'Read "Actors" (~2 min): who is the primary actor and who is secondary.',
          'Read "Misconceptions" (~2 min) and note the mistake you think you would make most.',
          'Write the skeleton of UC-01 (book an appointment) with only the template headings, before filling anything in.'
        ] },
      ex: {
        title: 'Use case UC-01',
        body: `UC-01 Book appointment
Primary actor: Receptionist
Precondition: user authenticated; the pet exists

Main flow:
 1. The receptionist searches for the pet by name.
 2. The system shows the matches.
 3. The receptionist chooses the pet and the vet.
 4. The receptionist chooses the date and time.
 5. The system checks that the vet is free.
 6. The system saves the appointment as CONFIRMED.
 7. The system shows the confirmation.

Alternative flows:
 2a. No matches -> offer to create a new pet.
 5a. Vet busy -> show the 3 nearest free slots.
 5b. Date in the past -> reject with a message.
 6a. Database failure -> nothing is saved, retry message,
     nothing is left half done.

Postcondition: there is a CONFIRMED appointment, or the
system is exactly as it was.`
      },
      steps: [
        'Write 3 use cases from your Must requirements, with the full structure.',
        'Each use case needs at least 3 alternative flows. Force yourself to find them.',
        'Check the postcondition: in the failure case, is the system left consistent? If you do not know, there is a gap.'
      ],
      vet: [
        'Create docs/use-cases.md with the 3 use cases numbered UC-01, UC-02, UC-03.',
        'In each alternative flow, mark which business rule (BR-xx) justifies it.'
      ],
      edge: [
        'The most forgotten alternative flow is the technical failure halfway through the operation. Always write it.',
        'If a step of the main flow says "the system processes", it is a black box. Open it or move that complexity to another use case.'
      ],
      quiz: [
        { q: 'Why do alternative flows matter more than the main one?', a: 'Because anyone implements the main flow and it almost always works. The bugs, the bad UX and the data inconsistencies live in the alternatives, where nobody thought.' },
        { q: 'What is a precondition and why does it matter?', a: 'It is the state that must be true before starting. It matters because it defines whose responsibility it is to validate: if the precondition says "user authenticated", the use case does not have to check it again.' },
        { q: 'What should the postcondition say in the failure case?', a: 'That the system was left in a known consistent state, usually "as it was before". This is the seed of the transactions you will see in week 9.' },
        { q: 'Difference between a use case and a user story?', a: 'The user story is short and is used to plan and talk. The use case is detailed and is used to implement and test. They do not compete: the story is the title, the use case is the content.' }
      ],
      out: 'docs/use-cases.md with 3 complete use cases, at least 3 alternative flows each.',
      file: 'docs/use-cases.md'
    },
    {
      t: 'User stories and INVEST',
      obj: 'Turn your Must scope into user stories that meet the INVEST criteria.',
      why: 'In any real team you will receive work as stories. Knowing whether a story is well formed lets you push back on badly defined work before you start it.',
      study: { r: 5, what: 'Read the INVEST definition (~5 min): Independent, Negotiable, Valuable, Estimable, Small, Testable. Then go back to the Mountain Goat article on user stories to see well split stories. 10 min in total.',
        pasos: [
          'Read "What is INVEST?" (~3 min) and write each letter with your own check question (for example, Small: does it fit in 3 days?).',
          'Read "Origins" (~1 min): who proposed it and why.',
          'Open the Mountain Goat guide from week 1 and reread the part about what makes a good story (~4 min): it is INVEST told with examples.',
          'Pick your biggest story and write how you would split it into two that each deliver value on their own.'
        ] },
      ex: {
        title: 'A story that fails INVEST and its fix',
        body: `BAD STORY:
"As a user I want to manage the system."
 - Independent? unknown
 - Valuable? the benefit is not visible
 - Small? it is huge
 - Testable? impossible

SPLIT INTO STORIES THAT DO MEET IT:
US-01 As a receptionist I want to book an appointment
      so that the vet knows who they are seeing.
      Estimate: 2 days. Testable: UC-01.
US-02 As a receptionist I want to see today's schedule
      so that I know which slots are free.
      Estimate: 1 day. Testable: list ordered by time.
US-03 As a vet I want to see a pet's history
      so that I can decide the treatment.
      Estimate: 2 days.

Rule: if you cannot estimate it, it is because you do not
understand it.`
      },
      steps: [
        'Turn your Musts into 6-8 user stories in the As a / I want / so that format.',
        'Run each story through the 6 INVEST criteria and note which one fails.',
        'Split or rewrite the ones that fail until they all pass. No story should exceed 3 days of estimated work.'
      ],
      vet: [
        'Create docs/backlog.md with the list of user stories, their estimate in days and the use case behind each one.',
        'Order them in the order you are going to build them. That is your real plan for the coming weeks.'
      ],
      edge: [
        'A story that depends on three others is not Independent. Reorder or merge.',
        'If you estimate everything at "1 day", you are not estimating. Force yourself to have variety.'
      ],
      quiz: [
        { q: 'What does it mean for a story to be Negotiable?', a: 'That it describes the what and the why, but leaves the how open. If the story already says "with a Bootstrap dropdown", you took away the team’s chance to find something better.' },
        { q: 'Why should a story be Small?', a: 'Because big ones hide uncertainty, are hard to estimate and give no fast feedback. A 3-day story that fails costs you 3 days; a 3-week one costs you 3 weeks.' },
        { q: 'What do you do if a story is not Estimable?', a: 'You do not estimate it at random. You create a time-boxed research task (a half-day spike) to resolve the specific unknown, and then you estimate.' },
        { q: 'How do user story, use case and acceptance criterion relate?', a: 'The user story says what and why. The use case details the steps and the alternative paths. The acceptance criterion defines how it is checked. All three describe the same thing at different zoom levels.' }
      ],
      out: 'docs/backlog.md with 6-8 stories that pass INVEST, estimated and ordered.',
      file: 'docs/backlog.md'
    },
    {
      t: 'Mini specification (weekly exam)',
      obj: 'Produce a single specification document for VetCare v1 and defend it as in a real review.',
      why: 'This is your first real portfolio piece. A clear specification document shows more engineering maturity than 500 lines of pretty code.',
      study: { r: 1, what: 'No new material today. Read only the "Structure" section of the article (~5 min) to compare with your document’s table of contents. Then reread everything you wrote in weeks 1 and 2 from start to finish, as if someone else had written it.',
        pasos: [
          'Read the "Structure" section (~4 min) and compare its table of contents with your spec-v1.md: which section are you missing?',
          'Reread "Requirement quality" (~2 min) and use it as a checklist.',
          'Print or open in full screen everything written in weeks 1 and 2 and read it straight through, without correcting yet.',
          'Write down on paper every contradiction or gap you find; then fix them all at once.'
        ] },
      ex: {
        title: 'Structure of the final document',
        body: `docs/spec-v1.md

1. Business problem (1 paragraph)
2. Stakeholders and conflicts (table)
3. Scope v1: Must / Won't (lists)
4. Functional requirements (FR-xx)
5. Non-functional requirements (NFR-xx, with numbers)
6. Business rules (BR-xx)
7. Main use cases (UC-01..03)
8. Acceptance criteria (Gherkin)
9. Assumptions and open questions
10. Glossary (what "appointment", "record", "visit" mean)

Everyone forgets point 10 and it is critical: if you and
the client use "visit" with different meanings,
everything above is contaminated.`
      },
      steps: [
        'Assemble docs/spec-v1.md with the 10 sections, reusing what you already wrote.',
        'Write the glossary: at least 8 veterinary domain terms with their exact definition.',
        'Self-assessment without looking: explain out loud, in 5 minutes, the problem, the stakeholders, the v1 scope and how you will know it worked.'
      ],
      vet: [
        'Make docs/spec-v1.md the only document someone needs to read to understand VetCare.',
        'Keep it safe: it is what you will defend before a "difficult client" when you ask for the week 2 review.'
      ],
      edge: [
        'If two sections contradict each other, do not choose in silence: fix it and note why.',
        'If the glossary has two terms that mean the same thing, remove one. Synonyms in a domain are a permanent source of bugs.'
      ],
      quiz: [
        { q: 'Why is a glossary critical in a specification?', a: 'Because the domain terms will become class and table names. If "visit" and "appointment" are used as synonyms in the document, you will end up with two confusing entities in the model.' },
        { q: 'What would you do if the client read your spec and said "this is not what I asked for"?', a: 'Find which specific section diverges, confirm whether it is a wrong assumption or a missing requirement, fix the section and record the change. The document exists precisely to make that conversation cheap.' },
        { q: 'How long should a specification last before it becomes outdated?', a: 'Until the first contact with real code. It is a living document: when you discover something while implementing, you go back and update it. A spec that never changes is a spec nobody reads.' },
        { q: 'Summarise weeks 1 and 2 in a single idea.', a: 'That software starts in the language of the business, not of the code, and that every vague statement you do not turn into something verifiable will become a bug or an argument later.' }
      ],
      out: 'docs/spec-v1.md complete with the 10 sections, including a glossary of 8+ terms.',
      file: 'docs/spec-v1.md'
    }
  ]
},
{
  n: 3, phase: 'Domain modelling', title: 'From the language of the business to entities',
  idea: 'Modelling is deciding which things exist in your system, what identifies them and how they relate. A good model makes the code write itself; a bad one haunts you for years.',
  res: [
    { t: 'Martin Fowler — Domain Model', u: 'https://martinfowler.com/eaaCatalog/domainModel.html', note: 'A short, authoritative definition of what a domain model is.' },
    { t: 'Martin Fowler — Value Object', u: 'https://martinfowler.com/bliki/ValueObject.html', note: 'The entity / value object distinction explained by the person who popularised the term.' },
    { t: 'Microsoft — DDD domain model layer', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice', note: 'What this looks like specifically in .NET.' },
    { t: 'Mermaid — ER diagrams', u: 'https://mermaid.js.org/syntax/entityRelationshipDiagram.html', note: 'To draw your ERD as text, versioned in git.' },
    { t: 'Microsoft Learn — Implement value objects', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects', note: 'How a value object is implemented in C#: equality by value and immutability.' },
    { t: 'Microsoft Learn — Design a microservice domain model', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model', note: 'Entities, value objects and aggregates explained for .NET.' },
    { t: 'Microsoft Learn — Implement a microservice domain model with .NET', u: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/net-core-microservice-domain-model', note: 'How an entity’s data is defined and protected in C#.' }
  ],
  days: [
    {
      t: 'Entities',
      obj: 'Extract VetCare’s real entities from the glossary and justify why each one exists.',
      why: 'Every extra entity you create is a table, a repository, a set of tests and a source of bugs. Every missing one forces a painful refactor. This is one of the most expensive decisions in the project.',
      study: { r: 5, what: 'Read Fowler’s definition of Domain Model (~3 min, it is a short page) and then this Microsoft article on entities. Key idea: an entity has its own identity that persists even if all its attributes change.',
        pasos: [
          'Read "The Domain Entity pattern" (~5 min): what makes something an entity and not just data.',
          'Read "Rich domain model versus anemic domain model" (~4 min): the entity also has behaviour, not only data.',
          'Open Fowler’s short page on Domain Model (this week’s link) and read the first paragraph (~2 min).',
          'With your spec-v1.md open, apply the identity test to each candidate: if all its data changes, is it still the same thing? If yes, it is an entity.'
        ] },
      ex: {
        title: 'How to spot an entity',
        body: `Technique: underline the NOUNS in your spec.

"The receptionist books an APPOINTMENT for a PET
 with a VET. The pet belongs to an OWNER.
 Each visit creates an entry in the HISTORY."

Candidates: Appointment, Pet, Vet, Owner, History.

Now filter with the identity test:
 - Pet: if you change its name, is it still the same pet?
   YES -> it is an entity, it needs an Id.
 - Owner's address: if you change the street, it is a
   different address. It has NO identity of its own -> it
   is not an entity.

Discarded because they are not domain concepts: "screen",
"button", "PDF report". That is interface, not domain.`
      },
      steps: [
        'Underline every noun in your spec-v1.md and make a list of candidates.',
        'Apply the identity test to each one: is it still the same thing if its data changes?',
        'Keep 6-9 entities and write one sentence justifying why each one exists.'
      ],
      vet: [
        'Create docs/domain-model.md with the section "1. Entities": name, one sentence of purpose, and why it has its own identity.',
        'List separately the candidates you discarded and why. This is worth as much as the good list.'
      ],
      edge: [
        'Beware of entities called "Manager", "Data", "Info" or "Helper": they are not business concepts, they are symptoms that you did not find the real name.',
        'If an entity only has an Id and a name, ask whether it really needs to be an entity or is just a value.'
      ],
      quiz: [
        { q: 'What is the test to know whether something is an entity?', a: 'Whether it has an identity that persists independently of its attributes. A pet is still the same pet even if its name, weight and owner change. That is why it needs a stable Id.' },
        { q: 'Why is "ReportManager" a bad entity name?', a: 'Because it does not exist in the language of the business. No vet says "I am going to check the ReportManager". Domain names come out of the user’s mouth, not from technical patterns.' },
        { q: 'What happens if you create too many entities?', a: 'You multiply tables, joins, repositories, mappings and tests for no gain. The model becomes expensive to change exactly when you most need to change it: at the beginning.' },
        { q: 'Where should your entity names come from?', a: 'From the glossary you wrote with the client. If your code says "Booking" and the client says "appointment", every conversation needs translating, and something is lost in every translation.' }
      ],
      out: 'docs/domain-model.md section 1: 6-9 justified entities + a list of discarded ones with the reason.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Attributes and types',
      obj: 'Define the attributes of each entity with their type, whether they are required and their valid range.',
      why: 'Types are your first line of defence. An attribute declared as string when it should be a date guarantees formatting bugs and impossible comparisons.',
      study: { r: 6, what: 'Read how Microsoft defines an entity’s data. About 10 minutes. Key idea: whether an attribute can be null is a business decision, not a technical one.',
        pasos: [
          'Read "Implement domain entities as POCO classes" (~4 min): look at which attributes the example entity has and what types they are.',
          'Read "Encapsulate data in the Domain Entities" (~4 min): why attributes are not changed from outside without a rule.',
          'For each attribute of Pet ask: can it be missing in real life? If the answer is no, it is required.',
          'Write a real business case for each optional attribute. If you cannot think of one, make it required.'
        ] },
      ex: {
        title: 'Attributes of Pet',
        body: `Pet
  Id            Guid      required   immutable
  Name          string    required   1-60 characters
  Species       enum      required   Dog|Cat|Other
  BirthDate     date      optional   not in the future
  WeightKg      decimal   optional   > 0 and < 200
  OwnerId       Guid      required   must exist
  Active        bool      required   default true

Decisions you just made without noticing:
 - BirthDate optional -> there will be rescued pets with no
   date. Your age calculation has to handle null.
 - WeightKg decimal, not float -> you avoid rounding errors.
 - Species enum, not string -> nobody will type "dogg".
 - Active bool -> soft deletion, not physical (legal NFR).`
      },
      steps: [
        'For each entity write its attributes with: type, required/optional, and valid range or format.',
        'Justify every optional field with a real business case. If you cannot, make it required.',
        'Mark which attributes are immutable after the record is created.'
      ],
      vet: [
        'Add the section "2. Attributes" to docs/domain-model.md with one table per entity.',
        'Mark with an asterisk the attributes that come straight from a business rule (BR-xx).'
      ],
      edge: [
        'Never use float for money or for weights that will be compared. Use decimal.',
        'A string with no maximum length is an invitation for someone to paste a whole book. Always define the limit.'
      ],
      quiz: [
        { q: 'Why decimal and not float for the weight or the price?', a: 'Because float is binary and cannot represent decimal values exactly: 0.1 + 0.2 is not 0.3. In money that produces mismatches; in comparisons it produces intermittent bugs.' },
        { q: 'What business decision does an optional field hide?', a: 'That there is a real case where the data is not known. If you cannot name that case, the field should be required and you are dodging a validation you do not want to write.' },
        { q: 'Why an enum instead of a string for the species?', a: 'Because a string accepts typos, different capitalisation and invented values. The enum gives a closed list of values the compiler knows, so a typo is caught at compile time instead of in production. Watch out for a C# detail: a number outside the list can slip in with a cast like (Species)99 or when reading JSON, so for data coming from outside you must check it with Enum.IsDefined.' },
        { q: 'What does it mean for an attribute to be immutable and why does it matter?', a: 'That it does not change after the object is created, like the Id or the creation date. It matters because immutable attributes can be cached, compared and indexed without fear, and they eliminate a whole class of concurrency bugs.' }
      ],
      out: 'An attribute table per entity with type, required flag, range and immutability mark.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Identity vs equality',
      obj: 'Decide how each entity is identified and understand why two objects with the same data are not the same object.',
      why: 'Confusing identity with equality causes bugs that are very hard to find: invisible duplicates, comparisons that fail, objects that get lost in collections.',
      study: { r: 1, what: 'Read Fowler’s ValueObject (~6 min), paying attention to the sentence about equality by value versus equality by reference or by id.',
        pasos: [
          'Read Fowler’s whole article (~6 min), without stopping at the code.',
          'Reread the paragraph where he compares equality by reference, by identity and by value. Write the difference with a VetCare example.',
          'Read Fowler’s date or money example and think what its equivalent would be in the clinic (weight, phone number, time range).',
          'Answer in writing: are two pets with the same name, breed and owner the same pet? And two weights of 4.2 kg?'
        ] },
      ex: {
        title: 'Two cats called Whiskers',
        body: `Two pets with the SAME data:
  { Name:"Whiskers", Species:Cat, WeightKg:4.2 }
  { Name:"Whiskers", Species:Cat, WeightKg:4.2 }

Are they the same cat? NO. They are two different cats with
two different owners. That is why Pet needs an Id.

Two addresses with the same data:
  { Street:"742 Evergreen Terrace", City:"Springfield" }
  { Street:"742 Evergreen Terrace", City:"Springfield" }

Are they the same address? YES. Giving them an Id makes no
sense. It is a VALUE OBJECT: it is compared by its values.

Rule:
 Entity       -> equality by Id.
 Value object -> equality by all its values.

Choosing the Id in VetCare:
 Guid: does not collide, can be generated on the client,
       does not reveal how many records you have.
 auto-increment int: more readable and faster to index,
       but leaks information and makes merging data harder.
For VetCare: Guid for business entities. In .NET 9 or
later you can create it with Guid.CreateVersion7(), which is
time-ordered and does not scatter the indexes.`
      },
      steps: [
        'Decide the Id type of each entity (Guid or int) and write the reason in one sentence.',
        'For each entity write the equality rule: which fields it is compared by.',
        'Find at least 2 concepts in your model that should NOT have an Id because they are values.'
      ],
      vet: [
        'Add the section "3. Identity" to docs/domain-model.md: Id type per entity and justification.',
        'List the value object candidates you found.'
      ],
      edge: [
        'Never use as an Id a piece of data the business may want to change (email, national ID, name). That day you will have to update every foreign key.',
        'Two entities with the same Id are the same entity even if all their data differs. It is a different version, not another object.'
      ],
      quiz: [
        { q: 'Why is an email a bad candidate for a primary key?', a: 'Because it is business data that can change. If someone changes their email, you have to update the key and every row that references it, with a risk of inconsistency. Keys should carry no meaning.' },
        { q: 'What is the difference between equality by identity and equality by value?', a: 'By identity: two objects are equal if they have the same Id, even if their data differs (the same pet before and after gaining weight). By value: they are equal if all their fields match, with no Id.' },
        { q: 'Advantage of Guid over auto-increment int?', a: 'It can be generated without querying the database, does not collide when merging data from several sources, does not reveal the number of records and makes it very hard to guess other people’s Ids in a URL. Careful: that does not replace checking permissions; a hard-to-guess Id is not a security measure.' },
        { q: 'Disadvantage of Guid?', a: 'It takes more space, is less readable when debugging and, if random, fragments database indexes because inserts do not go to the end. That is why ordered variants like UUID v7 exist (Guid.CreateVersion7() in .NET 9 or later).' }
      ],
      out: 'Section 3 with a justified Id type per entity, the equality rule, and 2+ value object candidates.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Value objects',
      obj: 'Model 3 VetCare value objects and understand why they make the code safer.',
      why: 'Value objects remove "primitive obsession": that code full of loose strings and decimals where nothing stops you passing the phone number into the email field.',
      study: { r: 4, what: 'Read Microsoft’s "Implement value objects", especially the ValueObject base class and how it compares by value (~10 min). If in doubt, reread Fowler’s ValueObject focusing on immutability. 12 min.',
        pasos: [
          'Read "Important characteristics of value objects" (~3 min): no identity, immutable, compared by value.',
          'Read "Value object implementation in C#" and "Value object comparison semantics" (~5 min). Notice GetEqualityComponents.',
          'Skip the EF Core sections for today: you will see them in week 12.',
          'For each value object you choose, write the validation rule its constructor would apply.'
        ] },
      ex: {
        title: 'From primitive to value object',
        body: `BEFORE (primitive obsession):
  void Register(string email, string phone, decimal weight)

  // nothing prevents this, and it compiles perfectly:
  Register(phone, email, -5);

AFTER (value objects):
  void Register(Email email, Phone phone, Weight weight)

  // this no longer compiles. The error is caught as you type.

A value object in C# (the idea; you will implement it in week 5):
  Email
    - value: string
    - built by validating that it has a valid format
    - if the format is invalid, it throws: an invalid Email
      NEVER exists in memory
    - it is immutable: there is no setter
    - two Emails are equal if their value is equal

Candidates in VetCare:
  Email, Phone, Weight, TimeRange, Address, Money.

Real gain: the validation is written ONCE, in the
constructor, not in every controller that receives an email.`
      },
      steps: [
        'Choose 3 VetCare value objects and define: which values they hold, which validation rules they have and how they are compared.',
        'For each one write the invalid state that now becomes impossible to represent.',
        'Look in your attribute model for the primitives that should become value objects.'
      ],
      vet: [
        'Add the section "4. Value objects" to docs/domain-model.md with the 3 you defined.',
        'Update the attribute table from day 2, replacing the affected primitives with the corresponding value object.'
      ],
      edge: [
        'A value object must be immutable. If you need to change it, you create a new one. If it has setters, it is probably an entity in disguise.',
        'TimeRange is VetCare’s most useful value object: it puts the appointment overlap rule in a single place.'
      ],
      quiz: [
        { q: 'What is primitive obsession and why is it a problem?', a: 'Using string, int and decimal for everything instead of domain types. The problem is that the compiler cannot help you: any string fits where an email is expected, and the validation ends up duplicated everywhere.' },
        { q: 'Why must a value object be immutable?', a: 'Because its identity is its value. If you could change it, an object stored in a collection or used as a key would change identity underneath you, breaking comparisons and hashes.' },
        { q: 'Where is a value object validated and what do you gain?', a: 'In its constructor, so that it is impossible to build an invalid one. You gain that the whole rest of the system can assume the data is valid without checking it again.' },
        { q: 'Why is TimeRange better than two loose start and end fields?', a: 'Because two loose fields allow absurd states (end before start) and force you to repeat the overlap logic everywhere. The value object checks consistency once and exposes an OverlapsWith method.' }
      ],
      out: 'Section 4 with 3 defined value objects (values, validation, equality) and an updated attribute table.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Relationships and cardinality',
      obj: 'Define every relationship between your entities with its exact cardinality and whether it is required.',
      why: 'A wrongly chosen cardinality is the most expensive modelling mistake. Going from 1:N to N:N in production means a data migration, an API change and rewriting queries.',
      study: { r: 3, what: 'Look at Mermaid’s ER syntax (~8 min). Learn to read the notation: one-to-one, one-to-many, many-to-many, and the optional/required modifier.',
        pasos: [
          'Read "Entities and Relationships" (~2 min): how a relationship between two entities is declared.',
          'Read "Relationship Syntax" (~4 min) and copy the symbol table: |o, ||, }o, }|. Write next to each one what it means.',
          'Read "Identification" (~1 min): the difference between a solid and a dashed line.',
          'Read "Attributes" (~2 min) to learn how to add PK and FK to the diagram.',
          'Paste an example diagram into mermaid.live and change a symbol to see the effect.'
        ] },
      ex: {
        title: 'VetCare relationships in Mermaid',
        body: `erDiagram
  OWNER ||--o{ PET : "has"
  PET ||--o{ APPOINTMENT : "generates"
  VET ||--o{ APPOINTMENT : "attends"
  APPOINTMENT ||--o| VISIT : "produces"
  PET ||--o{ VACCINE : "receives"

Reading the notation:
  ||--o{  exactly one to zero-or-many
  ||--||  exactly one to exactly one
  }o--o{  zero-or-many to zero-or-many

Questions each relationship forces you to answer:
 - Can a pet have two owners? (a separated couple)
 - If I delete an owner, what happens to their pets?
 - Can an appointment exist with no vet assigned?
 - Can a visit exist with no prior appointment? (emergency)

The last one is key: if they see emergencies without an
appointment, VISIT cannot depend on APPOINTMENT as required.
Notice that the diagram above says APPOINTMENT ||--o| VISIT:
every visit has exactly one appointment. If you accept
emergencies, change it to APPOINTMENT |o--o| VISIT.`
      },
      steps: [
        'Write all the relationships of your model in Mermaid erDiagram format.',
        'For each relationship answer in writing: is it required on both sides? What happens when each end is deleted?',
        'Find at least one relationship where your first instinct was 1:N and it is really N:N.'
      ],
      vet: [
        'Add the section "5. Relationships" to docs/domain-model.md with the Mermaid block and the table of deletion decisions.',
        'Paste the Mermaid code into mermaid.live to see the diagram and check that no entity is left on its own.'
      ],
      edge: [
        'An entity with no relationships at all is suspicious: either it is not needed, or you have not discovered how it connects yet.',
        'The pet-owner relationship looks like an obvious 1:N, until a couple separates and both want access. Decide now.'
      ],
      quiz: [
        { q: 'Why is changing from 1:N to N:N so expensive in production?', a: 'Because you need to create a join table, migrate the existing data, change the foreign keys, rewrite the queries and adapt the API and the UI. All at once and without losing data.' },
        { q: 'What does the optional modifier in a relationship mean?', a: 'That the other end may not exist. An appointment can exist without a visit (it has not happened yet), but it cannot exist without a pet. That decides whether the foreign key accepts null.' },
        { q: 'What do you have to decide for each relationship regarding deletion?', a: 'Whether deleting the parent deletes the children (cascade), blocks the deletion (restrict) or sets the key to null. In VetCare, with a legal requirement to keep histories, you will almost never want cascade.' },
        { q: 'How do you spot a hidden N:N relationship?', a: 'By asking "and the other way round?". A pet has an owner, fine; but can an owner have several pets and can a pet have several responsible people? If both answers are yes, it is N:N.' }
      ],
      out: 'A Mermaid diagram with all the relationships + a table of required flags and deletion policy per relationship.',
      file: 'docs/domain-model.md'
    },
    {
      t: 'Initial ERD (weekly exam)',
      obj: 'Produce VetCare’s complete entity-relationship diagram and defend it against real cases.',
      why: 'The ERD is the first thing any senior engineer looks at when reviewing your project. In 30 seconds it tells them whether you understood the domain or just turned screens into tables.',
      study: { r: 0, what: 'No new reading today. Reread your whole domain-model.md looking for contradictions with spec-v1.md.',
        pasos: [
          'Open your domain-model.md and your spec-v1.md side by side.',
          'For each Must requirement, find the entity and relationship in the model that support it. If there is none, it is a gap.',
          'For each entity in the model, find the requirement that justifies it. If there is none, it is not needed or a requirement is missing.',
          'Write the list of contradictions before correcting anything, and then fix them in order.'
        ] },
      ex: {
        title: 'Stress test for the model',
        body: `Do not validate your model by looking at it. Validate it
with stories:

CASE 1: An emergency pet arrives with no appointment.
  -> Does your model support it? If VISIT requires
     APPOINTMENT, no.

CASE 2: An owner hands their dog over to another person.
  -> The history must stay with the dog, not the owner.
     Does your model keep them separate?

CASE 3: Vet Ana resigns.
  -> Can you delete her? Her past appointments must be kept.
     You need soft deletion (Active = false).

CASE 4: Two vaccines on the same day for the same pet.
  -> Does your uniqueness constraint allow it or block it?

CASE 5: An appointment is rescheduled three times.
  -> Do you keep a history of changes or overwrite the date?
     Does the business need to know?

If your model fails a story, the model is wrong.
The story is real; the model is a hypothesis.`
      },
      steps: [
        'Produce the final ERD in Mermaid with entities, key attributes and all the relationships.',
        'Run your model through the 5 stories in the example and write whether it supports each one.',
        'Fix the model for the cases that fail and document what you changed and why.'
      ],
      vet: [
        'Close docs/domain-model.md with the final ERD and the section "6. Model stress test".',
        'Press "Mark for review" and save a screenshot of the rendered diagram (for example docs/erd.png) next to domain-model.md.'
      ],
      edge: [
        'If you had to change the model because of the stories, that is success, not failure. Finding it today in a document costs an hour; finding it with data in production costs weeks.',
        'Keep the stress stories: in week 13 they will turn almost literally into your tests.'
      ],
      quiz: [
        { q: 'Why is a model validated with stories and not by reading it?', a: 'Because reading your own model only confirms what you already thought. A concrete business story is an independent test case that can refute it.' },
        { q: 'What does the case of the vet who resigns tell you about deletion?', a: 'That physical deletion is almost never right in systems with history. You need soft deletion (an Active flag) so past records stay consistent.' },
        { q: 'Why should the medical history hang from the pet and not the owner?', a: 'Because the medical history is a fact about the animal and must survive a change of owner. If it hangs from the owner, handing the pet over loses its clinical past.' },
        { q: 'Summarise: what makes a domain model good?', a: 'That it uses the vocabulary of the business, makes invalid states impossible, supports the real stories including the odd ones, and can be changed without rewriting everything because responsibilities are separated.' }
      ],
      out: 'Final ERD in Mermaid + a stress test with 5 stories and the corrections applied.',
      file: 'docs/domain-model.md'
    }
  ]
}
]);
