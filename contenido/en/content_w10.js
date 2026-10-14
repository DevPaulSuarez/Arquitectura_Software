window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 10,
  phase: 'Databases',
  title: 'Keep the database fast as it grows',
  idea: 'With a hundred rows everything is fast. The work starts at a million. This week you stop guessing: you learn to read the execution plan, add indexes with judgement, version the schema and understand what happens when two people touch the same row at the same time.',
  res: [
    { t: 'PostgreSQL — Using EXPLAIN',
      u: 'https://www.postgresql.org/docs/current/using-explain.html',
      note: 'The key chapter of the week. Read it slowly: it is the one that teaches you to diagnose instead of guess.' },
    { t: 'PostgreSQL — Indexes',
      u: 'https://www.postgresql.org/docs/current/indexes.html',
      note: 'Index types, multicolumn, partial and expression indexes. Reference for days 1 and 4.' },
    { t: 'PostgreSQL — Transaction Isolation',
      u: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      note: 'Isolation levels and the anomalies each one prevents. Day 6 material.' },
    { t: 'PostgreSQL — Range Types', u: 'https://www.postgresql.org/docs/current/rangetypes.html', note: 'Date ranges and the exclusion constraint to prevent overlaps.' },
    { t: 'PostgreSQL — ALTER TABLE', u: 'https://www.postgresql.org/docs/current/sql-altertable.html', note: 'Which schema changes lock or rewrite the table.' }
  ],
  days: [
    {
      t: 'Indexes: how they work and when to add them',
      obj: 'Understand the B-tree and decide on indexes based on evidence, not habit.',
      why: 'A well placed index turns a 3-second query into 3 milliseconds. A badly placed one makes writes slower without speeding anything up. Knowing the difference is direct value.',
      study: { r: 1, what: 'Read the sections "Introduction", "Index Types" and "Multicolumn Indexes". About 18 minutes. Look for one thing: why the order of columns in a multicolumn index matters.',
        pasos: [
          'Open "11.1. Introduction" (~4 min): why without an index the database has to read the whole table.',
          'Open "11.2. Index Types" and read only the B-tree part (~4 min): which operators it can speed up.',
          'Open "11.3. Multicolumn Indexes" (~5 min): why an index on (a, b) helps to filter by a, but almost never by b alone.',
          'Write VetCare’s three most frequent queries and, for each one, the index that would help it with its columns in order.'
        ] },
      ex: { title: 'Indexes that help and indexes that do not', body: `(To keep it readable, this week ids appear as numbers:
vet_id = 3. In your database they are UUIDs; use a real one,
for example the result of SELECT id FROM vet LIMIT 1.)

Without an index, finding an appointment by date walks the
whole table: 1,000,000 rows read to return 12.

CREATE INDEX ix_appointment_starts_at ON appointment (starts_at);

Now Postgres goes down the tree: ~20 comparisons.

MULTICOLUMN INDEX: the order rules

CREATE INDEX ix_appointment_vet_start ON appointment (vet_id, starts_at);

This index HELPS with:
  WHERE vet_id = 3
  WHERE vet_id = 3 AND starts_at >= '2026-03-01'
  WHERE vet_id = 3 ORDER BY starts_at

This index does NOT help with:
  WHERE starts_at >= '2026-03-01'   -- the first column is missing

Rule: the index's first column must appear in the filter.
It is like a directory sorted by surname and then first
name: searching by first name alone does not help.
(PostgreSQL 18 added "skip scan", which sometimes uses the
index even when the first column is missing, if it has few
distinct values. Do not design around it.)

PARTIAL INDEX: smaller and faster

CREATE INDEX ix_appointment_pending
    ON appointment (starts_at)
 WHERE status IN ('scheduled','confirmed');

If 95 per cent of appointments are historical, this index
takes 5 per cent of the space.

EXPRESSION INDEX

CREATE INDEX ix_owner_email_lower ON owner (lower(email));
-- helps with:  WHERE lower(email) = 'ana@example.com'

WHAT NOT TO INDEX
- Columns with few distinct values (a boolean in a small
  table): walking the table is cheaper than the index.
- Tables with many writes and few reads.
- Columns that never appear in WHERE, JOIN or ORDER BY.

THE REAL COST: every INSERT/UPDATE/DELETE must update every
index on the table. More indexes, slower writes and more
disk space.

HOW TO GENERATE VOLUME (for today's step 1)

WITH p AS (SELECT array_agg(id) AS a FROM pet),
     v AS (SELECT array_agg(id) AS a FROM vet)
INSERT INTO appointment (pet_id, vet_id, starts_at, ends_at, status)
SELECT p.a[1 + g % array_length(p.a, 1)],
       v.a[1 + g % array_length(v.a, 1)],
       TIMESTAMPTZ '2022-01-01 08:00+00' + g * INTERVAL '5 minutes',
       TIMESTAMPTZ '2022-01-01 08:00+00' + g * INTERVAL '5 minutes'
                                         + INTERVAL '5 minutes',
       'attended'
  FROM generate_series(1, 500000) AS g, p, v;

It spreads the appointments across the pets and vets in your
seed, each one 5 minutes after the previous one. Then run
ANALYZE appointment; so PostgreSQL updates its statistics.` },
      steps: [
        'Generate volume: use generate_series to insert 500,000 test appointments into your database.',
        'Time a query by vet and date without an index, with \\timing turned on in psql.',
        'Create the multicolumn index and time it again. Write down both times.',
        'Filter only by the second column (starts_at) and check with EXPLAIN that the multicolumn index barely helps. Then create an index on starts_at alone and see how the plan changes.',
        'List your database’s indexes with \\di and work out their size with pg_relation_size. An index nobody uses is pure cost.'
      ],
      vet: [
        'Indexes VetCare needs: appointment(vet_id, starts_at), visit(pet_id, visited_on), pet(owner_id), and a unique lower(owner.email).',
        'Save all the CREATE INDEX statements in database/indexes.sql with a comment saying which query each one speeds up.'
      ],
      edge: [
        'The primary key already comes with an index. Do not create it again.',
        'A foreign key does NOT create an index automatically in PostgreSQL: if you query by it, create one yourself.',
        'An index on a column you use with functions (upper, date_trunc) is not used unless it is an expression index.'
      ],
      quiz: [
        { q: 'Why does the column order matter in a multicolumn index?', a: 'Because the index is sorted first by the leftmost column. If your filter does not include that first column, PostgreSQL cannot jump straight in and generally ignores the index.' },
        { q: 'What is the cost of adding an index?', a: 'Every write must also update the index, so INSERT, UPDATE and DELETE get slower, and the index takes space on disk and in the memory cache.' },
        { q: 'When is a partial index worth it?', a: 'When almost all your queries filter by a condition that discards most of the table, for example only pending appointments. The resulting index is much smaller and fits better in memory.' },
        { q: 'Does a foreign key create an index automatically?', a: 'Not in PostgreSQL. The referenced table has one because it is the primary key, but the referencing column has none and you must create it if you query by it or often delete parents.' }
      ],
      out: 'database/indexes.sql with justified indexes and the before/after timings noted.',
      file: 'database/indexes.sql'
    },
    {
      t: 'EXPLAIN ANALYZE: stop guessing',
      obj: 'Read an execution plan and identify the real bottleneck.',
      why: 'Anyone can say "it is slow". What you are hired for is pointing at exactly which node of the plan costs and why. It is a measurable and scarce skill.',
      study: { r: 0, what: 'Read "EXPLAIN Basics" and "EXPLAIN ANALYZE" in full. About 20 minutes. Look for one thing: the difference between estimated rows and actual rows, and why that difference matters.',
        pasos: [
          'Read "EXPLAIN Basics" (~8 min): what cost, rows and width mean, and how the tree is read from the bottom up.',
          'Read "EXPLAIN ANALYZE" (~8 min): the difference between estimated and actual, and the loops field.',
          'Read "Caveats" (~3 min): why a plan on little data does not look like the production one.',
          'Run EXPLAIN ANALYZE on your daily schedule query and mark the node that takes the most time.'
        ] },
      ex: { title: 'Reading an execution plan', body: `EXPLAIN (ANALYZE, BUFFERS)
SELECT a.starts_at, p.name
  FROM appointment a
  JOIN pet p ON p.id = a.pet_id
 WHERE a.vet_id = 3
   AND a.starts_at >= DATE '2026-03-01';

Typical output:

Nested Loop  (cost=0.85..412.33 rows=120 width=28)
             (actual time=0.041..1.812 rows=118 loops=1)
  ->  Index Scan using ix_appointment_vet_start on appointment a
        (cost=0.42..85.11 rows=120 width=16)
        (actual time=0.028..0.214 rows=118 loops=1)
        Index Cond: (vet_id = 3 AND starts_at >= '2026-03-01')
  ->  Index Scan using pet_pkey on pet p
        (cost=0.43..2.72 rows=1 width=20)
        (actual time=0.011..0.012 rows=1 loops=118)
        Index Cond: (id = a.pet_id)
Planning Time: 0.231 ms
Execution Time: 1.998 ms

HOW TO READ IT

Read it from the inside out and from the bottom up.
cost   = the planner's estimate (arbitrary units)
actual = REAL time and rows
loops  = how many times that node ran
         (that node's total time = actual time x loops)

WARNING SIGNS

Seq Scan on a big table with a selective WHERE
  -> an index is missing, or the index cannot be used

rows=10 (estimated) vs rows=50000 (actual)
  -> stale statistics: run ANALYZE table;
     the planner is choosing badly from bad information

loops=50000 in a Nested Loop
  -> the inner side runs 50,000 times. If it does not use
     an index, one is missing; if the estimate was bad, the
     planner should have chosen a Hash Join (check ANALYZE)

Rows Removed by Filter: 980000
  -> it read a million rows to keep 20,000

Buffers: shared read=45000
  -> it read 45,000 blocks that were not in PostgreSQL's
     cache (maybe from disk): a lot of work

COMMON NODE TYPES
Seq Scan         reads the whole table
Index Scan       goes down the index and visits the table
Index Only Scan  answers everything from the index (the best)
Bitmap Heap Scan many scattered matches
Nested Loop      good if the outer side has few rows
Hash Join        good for joining two large sets
Sort             sorts in memory or on disk (disk = bad)` },
      steps: [
        'Run EXPLAIN (ANALYZE, BUFFERS) on the five queries in database/queries.sql.',
        'For each one note: main node type, estimated vs actual rows, and Execution Time.',
        'Find at least one with a Seq Scan on a large table and fix it with an index. Measure again.',
        'Cause a bad estimate: insert 200,000 rows without running ANALYZE and watch the plan get it wrong. Then run ANALYZE and compare.',
        'Paste the before and after plans into database/performance-notes.md with your explanation of what changed.'
      ],
      vet: [
        'Today’s schedule is VetCare’s most used query: it must stay under 10 ms with half a million appointments.',
        'Document in database/performance-notes.md the latency target for each critical query.'
      ],
      edge: [
        'EXPLAIN only estimates; EXPLAIN ANALYZE really runs it. Never run EXPLAIN ANALYZE on a DELETE in production outside BEGIN ... ROLLBACK: ANALYZE really executes it.',
        'With small tables PostgreSQL chooses a Seq Scan on purpose and it is right: reading 500 rows sequentially is faster than jumping through an index.',
        'Cost is not milliseconds and is not comparable between machines. Compare plans from the same server and go by actual time.'
      ],
      quiz: [
        { q: 'What is the difference between EXPLAIN and EXPLAIN ANALYZE?', a: 'EXPLAIN only shows the estimated plan without running the query. EXPLAIN ANALYZE really runs it and adds actual times and rows, which is the only thing that lets you compare the estimate with reality.' },
        { q: 'What does a big difference between estimated and actual rows mean?', a: 'That the planner has stale or skewed statistics, and is therefore choosing the wrong strategy. The fix is usually running ANALYZE on the table.' },
        { q: 'Is a Seq Scan always bad?', a: 'No. If the table is small or the query returns a large share of the rows, reading sequentially is faster than jumping through an index. It is bad when the table is big and the filter is very selective.' },
        { q: 'Why multiply actual time by loops?', a: 'Because the time an inner node shows is for a single run. If loops is 50,000, that seemingly cheap node may be the one taking almost all the total time.' }
      ],
      out: 'database/performance-notes.md with before/after plans and one query optimised measurably.',
      file: 'database/performance-notes.md'
    },
    {
      t: 'Slow patterns and how to fix them',
      obj: 'Recognise the four most common performance problems and fix them.',
      why: 'Almost every slow query in the real world falls into a handful of patterns. Knowing them by heart lets you diagnose in minutes what takes others a day.',
      study: { r: 1, what: 'Find "Partial Indexes" and "Index-Only Scans" in the docs. About 15 minutes. Look for one thing: what condition must hold for an Index Only Scan to happen.',
        pasos: [
          'Open "11.8. Partial Indexes" (~5 min): index only the rows that matter, for example only appointments that are not cancelled.',
          'Open "11.9. Index-Only Scans and Covering Indexes" (~6 min): the query is answered from the index alone if all the columns are in it.',
          'Notice the visibility map condition on that same page: why VACUUM matters.',
          'Write a partial index and a covering index for VetCare and compare the plan before and after with EXPLAIN ANALYZE.'
        ] },
      ex: { title: 'Four slow patterns', body: `1. SELECT * WHEN YOU ONLY NEED TWO COLUMNS

Slow:
SELECT * FROM appointment WHERE vet_id = 3;

Better: asking only for what you need allows an Index Only Scan
SELECT starts_at, status FROM appointment WHERE vet_id = 3;

CREATE INDEX ix_appointment_vet_covering
    ON appointment (vet_id, starts_at) INCLUDE (status);

Now the index contains everything asked for and does not
touch the table.

2. A FUNCTION ON THE FILTERED COLUMN

Slow (ignores the index on starts_at):
WHERE date_trunc('day', starts_at) = DATE '2026-03-10'

Fast (a range, the index is used):
WHERE starts_at >= DATE '2026-03-10'
  AND starts_at <  DATE '2026-03-11'

3. THE N+1 QUERY (the ORM classic)

Slow: 1 query + 1 per pet
SELECT id FROM pet WHERE owner_id = 5;
  then for each one:
SELECT * FROM visit WHERE pet_id = ?;

Fast: a single query
SELECT p.id, p.name, v.visited_on, v.reason
  FROM pet p
  LEFT JOIN visit v ON v.pet_id = p.id
 WHERE p.owner_id = 5;

4. PAGINATION WITH A BIG OFFSET

Slow: to reach page 5000 it reads and throws away 100,000 rows
SELECT * FROM appointment ORDER BY starts_at LIMIT 20 OFFSET 100000;

Fast: cursor (keyset) pagination
SELECT * FROM appointment
 WHERE starts_at > '2026-03-10 14:30:00+00'
 ORDER BY starts_at
 LIMIT 20;

You keep the last value seen and carry on from there.
Constant time whatever the page.
(If two appointments can share a start time, break the tie
with the id: WHERE (starts_at, id) > ($last_start, $last_id)
            ORDER BY starts_at, id)` },
      steps: [
        'Reproduce the N+1 pattern in the Playground: query pets and then the visits one by one. Count the queries.',
        'Rewrite it as a single JOIN and compare the total time.',
        'Implement cursor pagination over the appointment table and compare it with OFFSET 100000.',
        'Create a covering index with INCLUDE and confirm in EXPLAIN that an Index Only Scan appears.',
        'Rewrite a date_trunc filter as a range filter and check that the plan changes from Seq Scan to Index Scan.'
      ],
      vet: [
        'A pet’s clinical history is VetCare’s most likely N+1 case: solve it with a single JOIN.',
        'The front end’s paginated appointment list will use keyset, not OFFSET. Note it in database/performance-notes.md.'
      ],
      edge: [
        'An Index Only Scan needs the table to be reasonably vacuumed; otherwise Postgres still visits the table to check visibility.',
        'Cursor pagination needs a stable, unique order. If starts_at can repeat, break the tie with the id.',
        'Do not optimise a query that runs once a month. Measure first which ones are frequent.'
      ],
      quiz: [
        { q: 'What is the N+1 problem and why does it hurt so much?', a: 'It is running one query to get N items and then one query per item. Every round trip to the database has network latency, so 200 small queries are much slower than a single one with a JOIN.' },
        { q: 'Why does applying a function to the column cancel the index?', a: 'Because the index stores the original sorted value, not the function’s result. PostgreSQL would have to compute the function for every row, so it walks the whole table unless you create an expression index.' },
        { q: 'Why is a big OFFSET slow?', a: 'Because the database must generate and throw away every row before the offset before returning the ones you asked for. The cost grows linearly with the page number.' },
        { q: 'What condition allows an Index Only Scan?', a: 'That every column the query needs is in the index, either as key columns or with INCLUDE. Then PostgreSQL answers without reading the table.' }
      ],
      out: 'N+1 fixed, cursor pagination implemented and an Index Only Scan confirmed in EXPLAIN.',
      file: 'database/performance-notes.md'
    },
    {
      t: 'Advanced constraints and the overlap rule',
      obj: 'Solve in the database the rule a CHECK cannot express.',
      why: 'The rule "no two overlapping appointments for the same vet" is exactly the kind of problem that separates someone who knows SQL from someone who only uses it. And in VetCare it is a real rule.',
      study: { r: 3, what: 'Read the Range Types introduction and the section "Constraints on Ranges". About 15 minutes. Look for one thing: which operator an exclusion constraint uses to compare ranges and why the btree_gist extension is needed.',
        pasos: [
          'Read the introduction and "8.17.1. Built-in Range and Multirange Types" (~3 min): tstzrange is the one you will use for appointments.',
          'Read "8.17.3. Inclusive and Exclusive Bounds" (~3 min): why [start, end) stops two back-to-back appointments from clashing.',
          'Read "8.17.9. Indexing" (~2 min): ranges are indexed with GiST.',
          'Read "8.17.10. Constraints on Ranges" (~5 min): the room booking example with EXCLUDE USING GIST and the && operator.',
          'Adapt the example to your appointment table: same vet and overlapping ranges must be impossible.'
        ] },
      ex: { title: 'EXCLUDE for ranges without overlap', body: `The problem UNIQUE does not solve:

Appointment A: 10:00 - 10:30 vet 3
Appointment B: 10:15 - 10:45 vet 3

Different start times, so UNIQUE accepts them, but they
overlap and cannot both be attended.

SOLUTION: an exclusion constraint with ranges

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointment
  ADD CONSTRAINT ex_appointment_no_overlap
  EXCLUDE USING gist (
      vet_id WITH =,
      tstzrange(starts_at, ends_at) WITH &&
  )
  WHERE (status <> 'cancelled');

It reads like this: forbid two rows where
the vet is the SAME (=)
and the time ranges OVERLAP (&&),
unless the appointment is cancelled.

btree_gist is needed because we mix a normal equality with
a range operator.

Trying it:

INSERT INTO appointment (vet_id, pet_id, starts_at, ends_at, status)
SELECT v.id, p.id, '2026-03-10 10:00+00', '2026-03-10 10:30+00', 'scheduled'
  FROM vet v, pet p
 WHERE v.name = 'Ana' AND p.name = 'Rocky';
-- OK

INSERT INTO appointment (vet_id, pet_id, starts_at, ends_at, status)
SELECT v.id, p.id, '2026-03-10 10:15+00', '2026-03-10 10:45+00', 'scheduled'
  FROM vet v, pet p
 WHERE v.name = 'Ana' AND p.name = 'Whiskers';
-- ERROR: conflicting key value violates exclusion
--        constraint "ex_appointment_no_overlap"

OTHER USEFUL CONSTRAINTS

Unique regardless of case:
CREATE UNIQUE INDEX uq_owner_email ON owner (lower(email));

Unique only among the active ones:
CREATE UNIQUE INDEX uq_vet_licence_active
    ON vet (licence) WHERE active;

Deferred until COMMIT:
ALTER TABLE invoice_line
  ADD CONSTRAINT fk_il_invoice
  FOREIGN KEY (invoice_id) REFERENCES invoice(id)
  DEFERRABLE INITIALLY DEFERRED;` },
      steps: [
        'Enable the btree_gist extension and add the exclusion constraint to the appointment table.',
        'Add three INSERTs to database/invalid-inserts.sql that try to overlap appointments, including partial overlap and full containment.',
        'Check that a cancelled appointment can overlap, thanks to the constraint’s WHERE clause.',
        'Create the unique index on lower(email) and try inserting the same email with different capitalisation.',
        'Document in database/README.md which business rules are guaranteed by the database and which stay in the code.'
      ],
      vet: [
        'This constraint closes the rule you noted as pending in week 9.',
        'Also write down the decision: the code validates first to give a good message, the database always validates to guarantee the truth.'
      ],
      edge: [
        'EXCLUDE uses a GiST index, which is slower to write than a B-tree. On tables with very high write volume you have to measure it.',
        'Decide the bounds convention: tstzrange includes the start and excludes the end by default, so 10:00-10:30 and 10:30-11:00 do not overlap. That is what you want.',
        'The application must catch PostgreSQL’s 23P01 error and translate it into a readable message, not show the raw error.'
      ],
      quiz: [
        { q: 'Why can UNIQUE not prevent overlapping appointments?', a: 'Because UNIQUE compares values by exact equality and overlap is a relationship between ranges. Two appointments with different start times are unique even if they clash in time.' },
        { q: 'What does the && operator mean in an exclusion constraint?', a: 'It is the overlap operator for ranges: it returns true if the two ranges share at least one instant. The constraint forbids two rows where that happens from existing together.' },
        { q: 'What is the WHERE clause in the exclusion constraint for?', a: 'It makes it partial, so it only applies to rows that meet the condition. Here it lets cancelled appointments not block the slot.' },
        { q: 'If the database already guarantees the rule, why validate it in the code too?', a: 'To give the user a useful error message before trying to save. The database is the final guarantee, but a raw constraint error is a bad user experience.' }
      ],
      out: 'An active exclusion constraint, overlap attempts failing and the rules documented in database/README.md.',
      file: 'database/schema.sql'
    },
    {
      t: 'Migrations: versioning the schema',
      obj: 'Change the schema reproducibly and safely in a database that has data.',
      why: 'In a team nobody edits the database by hand. Migrations are how a real team evolves the schema, and knowing how to do a migration without downtime is a highly valued skill.',
      study: { r: 4, what: 'Read the Notes section of ALTER TABLE: which operations rewrite the table and which lock each one takes. About 15 minutes. Look for one thing: why adding a column with a DEFAULT no longer locks in modern PostgreSQL.',
        pasos: [
          'Skim "Description" (~3 min) to see everything ALTER TABLE allows.',
          'Read the "Notes" section (~6 min): which operations rewrite the whole table and which only touch the catalogue.',
          'Find the sentence about adding a column with a non-volatile DEFAULT: since PostgreSQL 11 it no longer rewrites the table.',
          'Look at "Examples" (~3 min) and copy the ones for adding a column and adding a constraint.',
          'Write your first migration as a numbered file (for example 002_add_constraints.sql) instead of running it by hand.'
        ] },
      ex: { title: 'Ordered, safe migrations', body: `FILE STRUCTURE

database/migrations/
  001_create_base_tables.sql
  002_add_constraints.sql
  003_performance_indexes.sql
  004_overlap_exclusion.sql
  005_add_notes_column.sql

Rules:
- Numbered, never edited once applied.
- Each one must be able to run exactly once.
- A mistake is fixed with a NEW migration.

CONTROL TABLE

CREATE TABLE IF NOT EXISTS schema_migration (
    version     TEXT PRIMARY KEY,
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

A SAFE (non-blocking) MIGRATION

-- 005_add_notes_column.sql
BEGIN;
  ALTER TABLE pet ADD COLUMN notes TEXT;
  INSERT INTO schema_migration (version) VALUES ('005');
COMMIT;

DANGEROUS OPERATIONS AND THEIR ALTERNATIVE

Dangerous: adding a NOT NULL column with no default
  -> fails if there are rows
  Three-step alternative:
    1) ALTER TABLE t ADD COLUMN c TEXT;
    2) UPDATE t SET c = '...' WHERE c IS NULL;  (in batches)
    3) ALTER TABLE t ALTER COLUMN c SET NOT NULL;

Dangerous: CREATE INDEX on a big table
  -> blocks writes for minutes
  Alternative:
    CREATE INDEX CONCURRENTLY ix_... ON t (col);
    (cannot go inside a transaction)

Dangerous: renaming or dropping a column in use
  -> breaks the deployed app
  Expand/contract alternative:
    1) add the new column
    2) write to both for one release
    3) migrate the data
    4) stop reading the old one
    5) drop it in a later release

APPLY ONLY THE PENDING ONES (bash + psql)

psql -d vetcare -v ON_ERROR_STOP=1 -c "CREATE TABLE IF NOT EXISTS
  schema_migration (version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now());"

for f in database/migrations/*.sql; do
  v=$(basename "$f" | cut -d_ -f1)        # "005"
  done_already=$(psql -d vetcare -tAc \\
    "SELECT 1 FROM schema_migration WHERE version = '$v'")
  if [ "$done_already" != "1" ]; then
    echo "Applying $f"
    psql -d vetcare -v ON_ERROR_STOP=1 -f "$f" || exit 1
  fi
done` },
      steps: [
        'Reorganise all your SQL into numbered files in database/migrations/, from creating the tables to the exclusion constraint.',
        'Create the schema_migration table and make each file record its version.',
        'Write a bash script or a psql command that applies, in order, only the migrations not yet recorded.',
        'Test the whole process: drop the database, recreate it and apply everything from scratch. It must end up identical.',
        'Write a migration that adds a NOT NULL column to a table with data, using the three safe steps.'
      ],
      vet: [
        'From now on, VetCare’s whole database phase changes only through migrations.',
        'Write the exact command to apply the migrations from scratch in database/README.md.'
      ],
      edge: [
        'Never edit a migration that has already been applied in another environment: the databases will end up different and the bug will be impossible to trace.',
        'CREATE INDEX CONCURRENTLY cannot run inside BEGIN/COMMIT and can be left invalid if it fails; you have to check it.',
        'A huge UPDATE in a single transaction locks rows and grows the WAL. Do it in batches of a few thousand rows.'
      ],
      quiz: [
        { q: 'Why is an applied migration never edited?', a: 'Because the environments where it already ran will not run it again, so they would have a different schema from new environments. Fixes are always made with an additional migration.' },
        { q: 'How do you add a NOT NULL column to a table with millions of rows?', a: 'In three steps: first add it as nullable, then fill in the values in batches, and only then apply SET NOT NULL. That avoids a long lock and an immediate failure because of existing rows.' },
        { q: 'What does CREATE INDEX CONCURRENTLY do and what limitation does it have?', a: 'It builds the index without blocking the table’s writes, at the cost of being slower and making two passes. It cannot run inside a transaction and if it fails it leaves an invalid index that must be dropped.' },
        { q: 'What does the expand/contract pattern consist of?', a: 'Adding the new thing without removing the old one, making the application write to both for a while, migrating the data and only afterwards removing the old one. It lets you deploy schema changes without breaking the previous version of the app.' }
      ],
      out: 'Numbered database/migrations/, a schema_migration table and a full from-scratch rebuild verified.',
      file: 'database/migrations/'
    },
    {
      t: 'Concurrency and isolation (weekly exam)',
      obj: 'Understand what happens when two transactions collide and choose the right defence.',
      why: 'The "two people booked the same slot" bug is concurrency, not logic. Being able to explain a lost update and how to prevent it is a senior-level interview answer.',
      study: { r: 2, what: 'Read "Read Committed" and "Repeatable Read" from the isolation chapter. About 20 minutes. Look for one thing: which anomaly Read Committed allows that Repeatable Read does not.',
        pasos: [
          'Read the introduction and the table of phenomena per isolation level (~4 min).',
          'Read "13.2.1. Read Committed Isolation Level" (~6 min): each statement sees the data committed at its moment.',
          'Read "13.2.2. Repeatable Read Isolation Level" (~5 min): the whole transaction sees the same snapshot, and it can fail with a serialisation error.',
          'Skim "13.2.3. Serializable Isolation Level" (~3 min).',
          'Open two psql sessions and reproduce a non-repeatable read in Read Committed; then repeat it with Repeatable Read.'
        ] },
      ex: { title: 'The lost update and how to prevent it', body: `THE PROBLEM (two receptionists at the same time)

Session A                       Session B
---------                       ---------
BEGIN;                          BEGIN;
SELECT slots FROM schedule
 WHERE id=1;  -- 1
                                SELECT slots FROM schedule
                                 WHERE id=1;  -- 1
UPDATE schedule SET slots=0
 WHERE id=1;
COMMIT;
                                UPDATE schedule SET slots=0
                                 WHERE id=1;
                                COMMIT;

Two appointments were booked with a single slot.
This is called a lost update.

DEFENCE 1: pessimistic locking (SELECT FOR UPDATE)

BEGIN;
  SELECT slots FROM schedule WHERE id=1 FOR UPDATE;
  -- session B waits here
  UPDATE schedule SET slots = slots - 1 WHERE id=1;
COMMIT;

Simple and correct. Cost: the other session waits.
Good when conflicts are frequent and the section is short.

If everything fits in ONE statement, even simpler:
UPDATE schedule SET slots = slots - 1
 WHERE id = 1 AND slots > 0;
-- 0 rows affected = there was no slot left

DEFENCE 2: optimistic locking (a version column)

UPDATE schedule
   SET slots = slots - 1,
       version = version + 1
 WHERE id = 1
   AND version = 7;     -- the version I read

If it affects 0 rows, someone changed the row first:
you reload and retry. No waiting, but you have to handle
the retry. It is what EF Core does with a concurrency
column.

DEFENCE 3: let the database solve it

INSERT INTO appointment (...) VALUES (...);
-- the exclusion constraint from day 4 rejects the overlap
-- atomically, regardless of concurrency

For VetCare this is the best one: the rule lives in the
database and no race between sessions can get round it.

ISOLATION LEVELS IN POSTGRESQL

Read Committed (the default)
  each statement sees what was committed when it started.
  Allows non-repeatable reads and lost updates.

Repeatable Read
  the whole transaction sees a fixed snapshot from the start.
  If there is a conflict, Postgres aborts with error 40001
  and YOU must retry.

Serializable
  as if transactions ran one after another.
  Maximum guarantee, more aborts to retry.` },
      steps: [
        'Open two psql sessions and reproduce the lost update step by step. Confirm that the bug is real.',
        'Repeat it using SELECT FOR UPDATE in both and watch the second one wait.',
        'Implement the optimistic version with a version column and cause the conflict to see 0 rows affected.',
        'Try the two sessions inserting overlapping appointments at the same time and check that the exclusion constraint always wins.',
        'Final review: explain out loud in five minutes indexes, EXPLAIN, migrations and concurrency using VetCare examples.'
      ],
      vet: [
        'Write VetCare’s final decision in database/README.md: the overlap rule is defended with an exclusion constraint, not with locks.',
        'Leave database/performance-notes.md with the latency targets and the week’s measurements.',
        'Press "Mark for review" and reread database/performance-notes.md in a week.'
      ],
      edge: [
        'In Repeatable Read and Serializable your code must retry on error 40001. If it does not, the user sees a random failure.',
        'A SELECT FOR UPDATE inside a long transaction blocks everyone else: keep the transaction as short as possible.',
        'Two transactions that lock the same rows in a different order produce a deadlock. PostgreSQL kills one; always lock in the same order to avoid it.'
      ],
      quiz: [
        { q: 'What is a lost update?', a: 'When two transactions read the same value, change it based on that read and the second write overwrites the first. The first one’s change disappears as if it had never happened.' },
        { q: 'When do you prefer optimistic over pessimistic locking?', a: 'When conflicts are rare and you do not want sessions to wait for each other. Optimistic locking blocks nobody but forces you to detect the conflict and retry; pessimistic is simpler but serialises access.' },
        { q: 'What must you do if you use Repeatable Read?', a: 'Implement retries, because PostgreSQL can abort the transaction with error 40001 when it detects a serialisation conflict. Without a retry, the user gets an intermittent error with no apparent cause.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That performance and correctness under load are not guessed: they are measured with EXPLAIN ANALYZE, fixed with indexes and well written queries, evolved with versioned migrations and protected with constraints that no race between users can get round.' }
      ],
      out: 'A lost update reproduced and solved three ways, with the decision documented in database/README.md.',
      file: 'database/README.md'
    }
  ]
}
]);
