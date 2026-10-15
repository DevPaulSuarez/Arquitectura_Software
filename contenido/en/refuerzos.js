/* Technical refreshers: the groundwork the path uses without having explained it,
   placed right before the day that needs it. Shown in "Study the source".
   Key: w<week>d<day>. */
window.EN = window.EN || {};
window.EN.REFUERZOS = Object.assign(window.EN.REFUERZOS || {}, {

'w5d1': {
  t: 'Git from the first day of code',
  porque: 'Today you write the first line of VetCare. If you keep it in git from now on, you will reach week 20 with 15 weeks of daily practice instead of starting from scratch.',
  explica: [
    'Git stores snapshots (commits) of your project. Each commit has a message explaining why you changed something. If you break something, you can go back to any earlier snapshot.',
    'The daily cycle has three steps: you modify files, you choose which ones go into the next snapshot (git add) and you take the snapshot with a message (git commit). git status tells you at any moment where you are.',
    'One rule for the whole path: one commit for every "Do it yourself" step that changes code. At the end of each day, your history tells what you learned.'
  ],
  ejemplo: `# Once only, in the project folder
git init
dotnet new gitignore          # ignores bin/, obj/ and others
git add .
git commit -m "Create the solution and the domain project"

# The daily cycle
git status                    # what changed?
git diff                      # what exactly changed?
git add src/VetCare.Domain/Pet.cs
git commit -m "Add Pet with name, species and birth date"

git log --oneline             # the history, one line per commit

# If you make a mistake
git restore Pet.cs            # discards unsaved changes
git commit --amend            # fixes the last commit's message`,
  errores: [
    'Pushing bin/ and obj/ to the repository. That is why the .gitignore goes before the first commit.',
    'Messages like "changes" or "fix". Write what the commit does, in the imperative: "Validate that weight is positive".',
    'Making a single commit at the end of the day with everything mixed together. If something breaks, you will not know which part it was.',
    'Storing passwords or connection strings in files that get pushed. In week 19 you will learn to take them out; until then, do not write real secrets.'
  ],
  comprueba: [
    { q: 'What is the difference between git add and git commit?', a: 'git add chooses which changes go into the next snapshot (the staging area); git commit takes the snapshot with a message. You can change ten files and commit only two.' },
    { q: 'Why is the .gitignore created before the first commit?', a: 'Because whatever is already in the history stays there even if you ignore it later. It is easier not to push bin/ and obj/ than to take them out afterwards.' },
    { q: 'Which command tells you which files you changed and which are staged for the commit?', a: 'git status. Use it before every add and every commit, until it is a reflex.' }
  ],
  fuente: { t: 'Pro Git, chapter 2: Git Basics', u: 'https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository' }
},

'w5d3': {
  t: 'The debugger: see what your code does instead of guessing',
  porque: 'Today you start putting rules inside classes. When one does not behave as you expect, the debugger shows you the value of every variable line by line, without filling the code with Console.WriteLine.',
  explica: [
    'A breakpoint stops the program at a specific line. While it is stopped, you can see the value of every variable, the current object (this) and who called that method (the call stack).',
    'From there you move on: "step over" runs the line and stops at the next one; "step into" goes inside the method called on that line; "continue" runs until the next breakpoint.',
    'A conditional breakpoint only stops when something holds, for example "weight < 0". It is the tool for finding the one odd case among a thousand.'
  ],
  ejemplo: `VS Code (with the C# Dev Kit extension) or Visual Studio / Rider:

1. Click to the left of the line number
   -> a red dot appears (breakpoint)
2. F5 -> runs in debug mode
   (in VS Code choose ".NET" and the Playground project)
3. The program stops at the marked line:
   - "Variables" panel: current values
   - "Watch" panel: type an expression (appointment.End - appointment.Start)
   - "Call stack" panel: who called this method
4. Move on:
   F10  step over (next line)
   F11  step into (goes into the method)
   Shift+F11  step out of the current method
   F5   continue to the next breakpoint
5. Conditional breakpoint:
   right-click on the red dot -> "Edit condition"
   -> weightKg <= 0`,
  errores: [
    'Filling the code with Console.WriteLine to understand a failure and forgetting to remove them afterwards.',
    'Running with "dotnet run" and expecting it to stop at the breakpoint: you have to start in debug mode (F5).',
    'Using "step into" (F11) on every line and ending up inside the framework’s code. Use F10 and only step into your own methods.',
    'Changing the code at random until it works instead of stopping and looking at the value of each variable.'
  ],
  comprueba: [
    { q: 'What is the difference between F10 and F11?', a: 'F10 runs the whole line and stops at the next one. F11 goes inside the method called on that line. Use F11 only when you suspect that method.' },
    { q: 'What is the call stack for?', a: 'To know how you got to that line: which method called which. When a value arrives wrong, the stack tells you where it came from.' },
    { q: 'You have a loop over 10,000 pets and only one has an odd weight. How do you find it?', a: 'With a conditional breakpoint inside the loop, for example "weightKg <= 0" or "name == "Rocky"". It will only stop in that case.' }
  ],
  fuente: { t: 'Microsoft Learn: Debug a .NET console application with VS Code', u: 'https://learn.microsoft.com/en-us/dotnet/core/tutorials/debugging-with-visual-studio-code' }
},

'w6d2': {
  t: 'async and await: waiting without blocking',
  porque: 'From today you will see "Task", "async" and "await" in almost every week. You will use them daily in any .NET API, and it is a standard interview question.',
  explica: [
    'When code waits for something slow from outside (the database, an email, another API), the thread can either sit blocked watching or be freed to serve another request while it waits. async/await does the latter: the code reads as if it were sequential, but the thread is free during the wait.',
    'An async method returns Task (if it returns nothing) or Task<T> (if it returns a T). await waits for the task to finish and gives you its result. By convention, the method name ends in Async.',
    'async does not make anything faster or run it in parallel: it lets the server serve more users with the same threads. If you need to start two waits at once, you start both tasks and then use Task.WhenAll.'
  ],
  ejemplo: `// Synchronous: the thread stays blocked while it waits
public void Send(string to, string text)
{
    _smtp.Send(to, text);              // blocks until it finishes
}

// Asynchronous: the thread is free while it waits
public async Task SendAsync(string to, string text, CancellationToken ct)
{
    await _smtp.SendAsync(to, text, ct);
}

// Returning a value: Task<T>
public async Task<Appointment?> ByIdAsync(Guid id, CancellationToken ct)
    => await _db.Appointments.FirstOrDefaultAsync(a => a.Id == id, ct);

// Two waits at once, not one after the other
var tPet   = petRepo.ByIdAsync(petId, ct);
var tOwner = ownerRepo.ByIdAsync(ownerId, ct);
await Task.WhenAll(tPet, tOwner);
var pet = tPet.Result;            // already finished: does not block

// BAD: blocks the thread and can cause deadlocks
var appointment = ByIdAsync(id, ct).Result;
// BAD: exceptions are lost and nobody waits for the end
async void Save() { ... }`,
  errores: [
    'Using .Result or .Wait() on a Task: it blocks the thread and in some contexts causes a deadlock.',
    'Writing "async void": nobody can await the method and its exceptions bring the process down. It is only acceptable in event handlers.',
    'Forgetting the await: the method carries on before the task finishes and errors vanish silently. The compiler usually warns with CS4014.',
    'Not passing the CancellationToken: if the user cancels the request, the query keeps running for nothing (you will see this in week 14).'
  ],
  comprueba: [
    { q: 'Does async make my code faster?', a: 'Not on its own. It frees the thread while it waits, so the server handles more requests at once. A single request takes the same time, unless you start several waits in parallel with Task.WhenAll.' },
    { q: 'What does an async method that returns no value return?', a: 'Task. Not void. async void is only used in UI event handlers.' },
    { q: 'Why is using .Result dangerous?', a: 'Because it blocks the thread waiting for a task that may in turn need that same thread to finish: a deadlock. You also lose the benefit of freeing the thread.' },
    { q: 'You have to load the pet and the owner, which do not depend on each other. How would you do it faster?', a: 'I start both tasks without waiting and then do await Task.WhenAll(t1, t2). That way both waits happen at the same time instead of one after the other.' }
  ],
  fuente: { t: 'Microsoft Learn: Asynchronous programming with async and await', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/' }
},

'w8d6': {
  t: 'LINQ: querying collections as if they were tables',
  porque: 'Today you implement the in-memory repository with Where, OrderBy and Any, and from week 12 EF Core turns those same expressions into SQL. Understanding LINQ is understanding half of the data access code in .NET.',
  explica: [
    'LINQ is a set of methods to filter (Where), transform (Select), sort (OrderBy), check (Any, All), count (Count), group (GroupBy) and get one item (First, Single) over any collection. They take lambdas: "a => a.Status == AppointmentStatus.Pending" reads "for each a, keep the pending ones".',
    'Execution is deferred: writing the Where does nothing yet. The query runs when you iterate it or materialise it with ToList, ToArray, Count or First. If you iterate it twice, it runs twice.',
    'With EF Core the difference matters a lot: on an IQueryable, LINQ is translated to SQL and runs in the database. If you call ToList too early, you bring the whole table into memory and filter afterwards.'
  ],
  ejemplo: `var appointments = repo.All();   // List<Appointment>

// Filter and sort
var today = appointments
    .Where(a => DateOnly.FromDateTime(a.Start) == todayDate)
    .OrderBy(a => a.Start)
    .ToList();

// Transform into another shape (projection)
var rows = today.Select(a => new { a.Id, Time = a.Start.ToString("HH:mm") });

// Yes-or-no questions
bool overlaps = appointments.Any(a => a.VetId == vet && a.Start < end && start < a.End);

// Just one
var appointment = appointments.FirstOrDefault(a => a.Id == id);  // null if none
var single      = appointments.Single(a => a.Id == id);          // throws if 0 or more than 1

// Group and count
var byVet = appointments
    .GroupBy(a => a.VetId)
    .Select(g => new { VetId = g.Key, Total = g.Count() });

// EF Core: BAD (brings the whole table and filters in memory)
var bad  = db.Appointments.ToList().Where(a => a.VetId == vet);
// GOOD (the filter becomes a WHERE in the SQL)
var good = await db.Appointments.Where(a => a.VetId == vet).ToListAsync(ct);`,
  errores: [
    'Calling ToList before filtering in EF Core: it brings the whole table into memory.',
    'Using Count() > 0 to know whether there is any: Any() stops at the first one it finds.',
    'Using First when there may be no result: it throws. Use FirstOrDefault and check for null.',
    'Iterating the same deferred query twice without materialising it: you run it twice (and with EF, that is two trips to the database).'
  ],
  comprueba: [
    { q: 'When does "appointments.Where(a => a.IsPending)" actually run?', a: 'When you iterate or materialise it: foreach, ToList, Count, First… Writing the Where only describes the query. That is deferred execution.' },
    { q: 'What is the difference between First, FirstOrDefault and Single?', a: 'First returns the first one and throws if there are none. FirstOrDefault returns null (or the default value) if there are none. Single requires exactly one and throws if there are zero or more than one.' },
    { q: 'Why is "db.Appointments.ToList().Where(…)" a problem and "db.Appointments.Where(…).ToList()" not?', a: 'In the first, ToList brings every row from the database and the filter is applied in memory. In the second, EF Core translates the Where to SQL and only the rows that match travel.' }
  ],
  fuente: { t: 'Microsoft Learn: Language Integrated Query (LINQ)', u: 'https://learn.microsoft.com/en-us/dotnet/csharp/linq/' }
},

'w10d1': {
  t: 'Big O and data structures: how cost grows',
  porque: 'Today you see that an index turns a lookup from "read the whole table" into "go almost straight there". That has a name: going from O(n) to O(log n). It is the same idea as choosing well between List, Dictionary and HashSet in your code, and a standard interview question.',
  explica: [
    'Big O notation describes how the work grows when the data grows, not how many milliseconds it takes. O(1): the same with 10 as with a million. O(log n): grows very slowly (a million items is about 20 steps). O(n): twice the data, twice the work. O(n²): twice the data, four times the work.',
    'Each .NET collection has its costs. List<T>: access by position is O(1), but finding an item (Contains, Find) is O(n). Dictionary<K,V> and HashSet<T>: lookup by key is O(1) on average. SortedDictionary and the database’s B-tree indexes: O(log n), and they also keep things sorted.',
    'The typical mistake is a loop inside another loop without noticing: a Contains on a List inside a foreach is O(n²). With 100 items you do not notice; with 100,000, the screen freezes.'
  ],
  ejemplo: `// O(n²): for each appointment, goes through the WHOLE list of pets
foreach (var appointment in appointments)                     // n
{
    var p = pets.First(x => x.Id == appointment.PetId);       // n
}
// 10,000 appointments x 10,000 pets = 100,000,000 comparisons

// O(n): a dictionary does the lookup in O(1)
var byId = pets.ToDictionary(p => p.Id);                      // n, once
foreach (var appointment in appointments)                     // n
{
    var p = byId[appointment.PetId];                          // O(1)
}
// 10,000 + 10,000 = 20,000 operations

// HashSet for "have I seen it already?"
var seen = new HashSet<Guid>();
if (!seen.Add(appointment.Id)) { /* duplicate */ }            // O(1)

Summary of lookup costs
  List<T>.Contains           O(n)
  HashSet<T>.Contains        O(1)
  Dictionary<K,V>[key]       O(1)
  SortedDictionary[key]      O(log n)
  Seq Scan in PostgreSQL     O(n)
  B-tree index               O(log n)`,
  errores: [
    'Searching with First or Contains on a List inside a loop: hidden O(n²).',
    'Thinking Big O is about milliseconds: it is about how the cost grows. With little data, an O(n) can be faster than an O(1) with more fixed work.',
    'Using List when the main operation is "does it already exist?": that is what HashSet is for.',
    'Optimising without measuring: Big O tells you what will hurt as things grow, but the decision is confirmed with a measurement (you will do it in week 21).'
  ],
  comprueba: [
    { q: 'What does it mean for a lookup to be O(log n)?', a: 'That the work grows very slowly: each step discards half of what is left. With a million items it is about 20 steps. It is what a B-tree index does.' },
    { q: 'You have a list of 50,000 ids and have to check many times whether an id is in it. Which structure do you use?', a: 'A HashSet<Guid>: Contains is O(1) on average. With a List, each check goes through the whole list: O(n).' },
    { q: 'Why can a foreach with a First inside freeze a screen?', a: 'Because it is O(n²): for each item it goes through the whole other collection. With 10,000 items that is 100 million comparisons. It is fixed by building a Dictionary by id beforehand.' },
    { q: 'What is the relation between a database index and Big O?', a: 'Without an index, PostgreSQL reads the whole table (Seq Scan, O(n)). With a B-tree index, it walks down the tree in O(log n) to the rows it is looking for.' }
  ],
  fuente: { t: 'Microsoft Learn: Collections and data structures (.NET)', u: 'https://learn.microsoft.com/en-us/dotnet/standard/collections/' }
},

'w20d2': {
  t: 'Code review: reviewing and being reviewed',
  porque: 'Today you work with branches, which in a team end up in a pull request. Reviewing other people’s code and getting comments on yours is a daily part of an engineer’s job and what speeds up your learning the most.',
  explica: [
    'A pull request (PR) asks to merge your branch into main. Before the merge, someone else reviews it. The goal is not to find someone to blame, but for the project’s code to improve and for more than one person to understand it.',
    'To be reviewed well: small PRs (under 400 lines), a description that says what changes, why and how to test it, and your own review before asking for someone else’s. A huge PR gets an "LGTM" without being read.',
    'When reviewing, in this order: does it do what it says? Are there cases it does not cover? Does it have tests? Is it understandable? Style is checked by automated tools (dotnet format, linters), not people. Comment on the code, not on the person, and separate blocking issues from suggestions.'
  ],
  ejemplo: `DESCRIPTION OF A GOOD PR

  Title: Reject appointments that overlap another one for the same vet

  What changes
  - AppointmentScheduler calls ExistsOverlappingAsync before saving.
  - New TimeSlotTakenException -> 409 in the API.

  Why
  - Reception was booking two appointments at the same time (issue #12).

  How to test it
  - dotnet test (3 new tests in AppointmentSchedulerTests)
  - POST /api/v1/appointments twice with the same time -> 201 then 409

  Out of this PR
  - The database constraint comes in the next PR.

REVIEW COMMENTS

  BAD:  "This is wrong."
  GOOD: "If start == end of another appointment, does it count as an overlap?
         With < rather than <= I think back-to-back appointments are allowed,
         which is what BR-04 asks for. Shall we add a test for that case?"

  Useful prefixes:
    blocking:    must be fixed before the merge
    suggestion:  optional improvement
    question:    I do not understand something; it may not be a problem`,
  errores: [
    'Giant PRs that mix a feature, a refactor and formatting changes: nobody can really review them.',
    'Style comments that an automated tool should catch: they spend the reviewer’s attention on what matters least.',
    'Taking comments personally, or writing them in a way that makes them seem personal.',
    'Approving without running or understanding the change: a courtesy "LGTM" protects nobody.'
  ],
  comprueba: [
    { q: 'What should a pull request description contain?', a: 'What changes, why (the problem or the issue), how to test it and what is left out. With that, the reviewer understands the context without asking you.' },
    { q: 'What do you review first in someone else’s PR?', a: 'That it does what it says and covers the edge cases; then the tests; then that it is understandable. Style is reviewed by automated tools.' },
    { q: 'Why is it good for PRs to be small?', a: 'Because they are reviewed better and faster, errors are found sooner and, if something breaks, it is easy to know which change it was and revert it.' }
  ],
  fuente: { t: 'Google Engineering Practices: How to do a code review', u: 'https://google.github.io/eng-practices/review/reviewer/' }
}

});
