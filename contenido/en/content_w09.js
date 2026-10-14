window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 9,
  phase: 'Databases',
  title: 'Real SQL: create, protect and query data',
  idea: 'An ORM lets you write SQL without knowing SQL, and that works until the day something is slow or the data comes out wrong. This week you write SQL by hand against PostgreSQL: you create VetCare’s schema, armour it with constraints and learn to query without inventing results.',
  res: [
    { t: 'PostgreSQL — Data Types', u: 'https://www.postgresql.org/docs/current/datatype.html', note: 'All the data types. Today only numeric, text and dates.' },
    { t: 'PostgreSQL — Data Manipulation (INSERT, UPDATE, DELETE, RETURNING)', u: 'https://www.postgresql.org/docs/current/dml.html', note: 'A short official chapter on writing data.' },
    { t: 'PostgreSQL — Transactions',
      u: 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
      note: 'A short chapter of the official tutorial on transactions. It is day 6’s topic.' },
    { t: 'PostgreSQL — Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html', note: 'CHECK, NOT NULL, UNIQUE, PRIMARY KEY and FOREIGN KEY.' },
    { t: 'PostgreSQL — Comparison Functions and Operators', u: 'https://www.postgresql.org/docs/current/functions-comparison.html', note: 'How comparing with NULL works and why it surprises people.' },
    { t: 'PostgreSQL — Joins Between Tables', u: 'https://www.postgresql.org/docs/current/tutorial-join.html', note: 'The official JOIN tutorial with examples.' }
  ],
  days: [
    {
      t: 'DDL and data types',
      obj: 'Create tables choosing the right type for each column.',
      why: 'The data type is a decision that stays with you for years. Storing money as float or dates as text are mistakes that cost painful migrations, and they come up in interviews.',
      study: { r: 0, what: 'Read the sections Numeric Types, Character Types and Date/Time Types. About 15 minutes. Look for one thing: the difference between numeric, real and double precision.',
        pasos: [
          'Open "8.1. Numeric Types" from the index (~6 min). Read the first table and the part on numeric: it is the type for money because it does not round.',
          'On the same page read the part on real and double precision (~2 min): they are approximate, which is why they are no good for amounts.',
          'Open "8.3. Character Types" (~3 min): the difference between varchar(n) and text, and why in PostgreSQL there is no performance difference.',
          'Open "8.5. Date/Time Types" (~4 min): notice timestamptz and why it stores the exact instant without time zone ambiguity.',
          'Write the type of each column of Appointment and Invoice with a one-line reason.'
        ] },
      ex: { title: 'Choosing the right type', body: `BAD

CREATE TABLE invoice (
    id          VARCHAR(50),
    total       FLOAT,
    issued_at   VARCHAR(20),
    paid        VARCHAR(3)
);

Problems:
- FLOAT for money: 0.1 + 0.2 is not 0.3. You lose cents.
- VARCHAR for a date: you cannot sort or subtract dates.
- VARCHAR for a boolean: it accepts 'yes', 'YES', 'y',
  'true', rubbish.
- VARCHAR for an id: takes more space and does not
  validate the format.

GOOD

CREATE TABLE invoice (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    total       NUMERIC(10,2)  NOT NULL,
    issued_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
    paid        BOOLEAN        NOT NULL DEFAULT false,
    note        TEXT
);

Quick guide for PostgreSQL:
money             -> NUMERIC(p,s), never float
exact moment      -> TIMESTAMPTZ (stored in UTC)
date only         -> DATE
text              -> TEXT (in Postgres it is no slower than VARCHAR)
yes/no            -> BOOLEAN
entity id         -> UUID (the C# Guid you chose in week 3)
the other option  -> BIGINT GENERATED ALWAYS AS IDENTITY
                     (more compact, but reveals volume)` },
      steps: [
        'Install PostgreSQL locally or start one with Docker: docker run --name vetcare-db -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:17',
        'Connect with psql or a graphical tool and create the vetcare database.',
        'Translate your week 4 domain model into CREATE TABLE statements: owner, pet, vet, appointment, visit, vaccine, invoice, invoice_line.',
        'For each column justify the type in an SQL comment next to it. If you cannot justify it, you did not choose it, you copied it.',
        'Run the whole script from scratch twice using DROP TABLE IF EXISTS at the top (in reverse creation order, or with CASCADE, because of the foreign keys), to check that it is reproducible.'
      ],
      vet: [
        'Save the result in database/schema.sql. This file will grow throughout the phase.',
        'Use snake_case singular names for tables: owner, pet, appointment.'
      ],
      edge: [
        'TIMESTAMP without a time zone is a trap: it stores the number but you do not know which zone it is in. Use TIMESTAMPTZ.',
        'NUMERIC is exact but slower than integers. For money that slowness does not matter.',
        'Avoid VARCHAR(255) out of habit: set the limit the business requires or use TEXT with a length CHECK.'
      ],
      quiz: [
        { q: 'Why should FLOAT not be used for money?', a: 'Because floating-point numbers are binary and cannot represent decimal values like 0.10 exactly. The errors accumulate in sums and the totals end up off by cents.' },
        { q: 'What is the difference between TIMESTAMP and TIMESTAMPTZ?', a: 'TIMESTAMPTZ converts to UTC when storing and back to the session’s zone when reading, so it represents a real instant. TIMESTAMP stores a wall-clock reading with no context and is ambiguous as soon as there is more than one zone.' },
        { q: 'When would you use UUID instead of an identity integer?', a: 'When the identifier is exposed outside or generated in several places without coordination. The sequential integer is more compact and fast, but reveals volume and creation order.' },
        { q: 'In PostgreSQL, is TEXT slower than VARCHAR(n)?', a: 'No, internally they are stored the same. VARCHAR(n) only adds a length check, so you choose based on the business rule, not on performance.' }
      ],
      out: 'database/schema.sql that creates every table from scratch without errors.',
      file: 'database/schema.sql'
    },
    {
      t: 'Constraints: let the database defend your rules',
      obj: 'Prevent invalid data in the database, not only in the code.',
      why: 'The application is not the only thing that writes to the database: there are scripts, migrations and people with psql. Constraints are the last line of defence and a classic interview topic.',
      study: { r: 3, what: 'Read Check, Not-Null, Unique, Primary Keys and Foreign Keys. About 18 minutes. Look for one thing: what ON DELETE CASCADE and ON DELETE RESTRICT do.',
        pasos: [
          'Reread "Check Constraints" (~4 min), now with your real schema in front of you.',
          'Read "Not-Null Constraints" and "Unique Constraints" (~4 min).',
          'Read "Primary Keys" (~2 min).',
          'Read "Foreign Keys" to the end (~6 min), paying attention to the list of ON DELETE actions.',
          'Write in a table, for each VetCare FK, the chosen ON DELETE action and the business rule that justifies it.'
        ] },
      ex: { title: 'The five essential constraints', body: `CREATE TABLE appointment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    pet_id          UUID NOT NULL
        REFERENCES pet(id) ON DELETE RESTRICT,

    vet_id          UUID NOT NULL
        REFERENCES vet(id) ON DELETE RESTRICT,

    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ NOT NULL,
    status          TEXT NOT NULL DEFAULT 'scheduled',
    reason          TEXT,

    CONSTRAINT ck_appointment_range
        CHECK (ends_at > starts_at),

    CONSTRAINT ck_appointment_status
        CHECK (status IN ('scheduled','confirmed','attended','cancelled')),

    CONSTRAINT uq_appointment_vet_start
        UNIQUE (vet_id, starts_at)
);

What each one does:

NOT NULL    the value is required
PRIMARY KEY unique identity of the row
REFERENCES  the row it points to must exist
CHECK       a rule about the row's values
UNIQUE      that combination does not repeat

ON DELETE:
RESTRICT  blocks deleting the parent if there are children (safe)
CASCADE   deletes the children with the parent              (dangerous)
SET NULL  leaves the child orphaned with null

For VetCare: RESTRICT almost everywhere.
CASCADE only from invoice to invoice_line,
because a line makes no sense without its invoice.` },
      steps: [
        'Add the NOT NULL, PRIMARY KEY and FOREIGN KEY constraints to every table in database/schema.sql.',
        'Write at least four CHECKs that encode real rules: positive weight, email with an at sign, end after start, status in a closed list.',
        'Name every constraint with prefixes: pk_, fk_, uq_, ck_. The database errors will tell you the name and you will be grateful.',
        'Create database/invalid-inserts.sql with ten INSERTs that must fail, one per constraint.',
        'Run them and copy each error message next to it as a comment. That file is your proof that the schema defends the rules.'
      ],
      vet: [
        'A key VetCare rule: the same vet cannot have two appointments at the same time. Start with UNIQUE(vet_id, starts_at).',
        'Note in database/README.md that partial overlap is not covered yet. You will solve it with EXCLUDE in week 10.'
      ],
      edge: [
        'A CHECK can only look at the same row. Rules across tables need a trigger or application logic.',
        'UNIQUE allows multiple NULLs in PostgreSQL, because NULL is not equal to NULL. If you want to prevent it, add NOT NULL (or, from PostgreSQL 15, UNIQUE NULLS NOT DISTINCT).',
        'ON DELETE CASCADE can delete thousands of rows without warning. Use it only when the child cannot exist without the parent.'
      ],
      quiz: [
        { q: 'If the application already validates, why put constraints in the database?', a: 'Because the application is not the only client: there are migrations, scripts, another service or someone with psql. The constraint guarantees the rule whatever happens and makes it impossible for corrupt data to get in.' },
        { q: 'When is ON DELETE CASCADE right?', a: 'When the child has no existence of its own without the parent, like the lines of an invoice. If the child is valuable historical information, like a pet’s visits, RESTRICT is right.' },
        { q: 'What limitation does CHECK have?', a: 'It can only evaluate columns of the same row. It cannot query other tables or other rows, so rules like "no more than 20 appointments per day" need another tool.' },
        { q: 'Why is it worth naming constraints by hand?', a: 'Because PostgreSQL’s error message includes the name. With a name like ck_appointment_range you know instantly what failed; with an auto-generated name you have to go and look it up in the schema.' }
      ],
      out: 'A schema with named constraints and database/invalid-inserts.sql with the errors documented.',
      file: 'database/invalid-inserts.sql'
    },
    {
      t: 'INSERT, UPDATE and DELETE without breaking anything',
      obj: 'Modify data safely and fill the database with realistic test data.',
      why: 'An UPDATE without a WHERE in production is a story every developer hears once. Learning the defensive habits now stops that story from being yours.',
      study: { r: 1, what: 'Read the chapter’s four sections: Inserting Data, Updating Data, Deleting Data and Returning Data from Modified Rows. About 15 minutes. Look for one thing: what the RETURNING clause gives you and why it is useful.',
        pasos: [
          'Open "6.1. Inserting Data" (~3 min): notice that you should always list the columns in the INSERT.',
          'Open "6.2. Updating Data" (~3 min) and read the warning: an UPDATE without a WHERE changes every row.',
          'Open "6.3. Deleting Data" (~2 min).',
          'Open "6.4. Returning Data from Modified Rows" (~4 min) and try an INSERT ... RETURNING id in psql.',
          'Before every UPDATE or DELETE today, first run a SELECT with the same WHERE and count the rows.'
        ] },
      ex: { title: 'Writing data with a safety net', body: `INSERT with several rows and RETURNING

INSERT INTO owner (name, email, phone) VALUES
  ('Ana Perez',  'ana@example.com',  '555-0101'),
  ('Luis Gomez', 'luis@example.com', '555-0102')
RETURNING id, name;

RETURNING gives you the generated id without another query.

UPDATE: ALWAYS with a WHERE

-- Step 1: look at who you are going to affect
SELECT id, status FROM appointment
 WHERE id = '7f9c2e0a-5b1d-4c8e-9a3f-2d6b8e1c4a90';

-- Step 2: only now update
UPDATE appointment
   SET status = 'cancelled',
       reason = 'The owner rescheduled'
 WHERE id = '7f9c2e0a-5b1d-4c8e-9a3f-2d6b8e1c4a90'
RETURNING id, status;

UPSERT: insert, or update if it already exists

INSERT INTO vaccine (pet_id, kind, applied_on, batch)
SELECT id, 'rabies', DATE '2026-03-10', 'L-2231'
  FROM pet WHERE name = 'Rocky'
ON CONFLICT (pet_id, kind, applied_on)
DO UPDATE SET batch = EXCLUDED.batch;

It needs UNIQUE (pet_id, kind, applied_on). The date is in
the key because the same vaccine repeats every year
(week 4): if the key were only (pet_id, kind), this year's
vaccine would overwrite last year's.

DELETE: the habit that saves careers

BEGIN;
  DELETE FROM appointment WHERE status = 'cancelled' AND starts_at < '2025-01-01';
  -- Postgres says: DELETE 134
  -- Did you expect 134? If not:
  -- ROLLBACK;
COMMIT;

Golden rule: write the WHERE before the UPDATE/DELETE.
Many people write the SELECT first and then change the word.` },
      steps: [
        'Create database/seed.sql with consistent test data: 5 owners, 8 pets, 3 vets, 20 appointments spread over time.',
        'Use RETURNING to capture ids and chain inserts with CTEs (WITH ... AS) instead of typing ids by hand.',
        'Practise an UPDATE wrapped in BEGIN, check the number of affected rows and ROLLBACK on purpose.',
        'Try to delete an owner who has pets and read the foreign key error. Confirm that RESTRICT works.',
        'Write an UPSERT that records a pet’s vaccine without duplicating it if it already exists.'
      ],
      vet: [
        'The seed data must include edge cases: a cancelled appointment, a pet with no visits, an owner with three pets.',
        'The seed must run on a freshly created database with schema.sql, without editing anything.'
      ],
      edge: [
        'In psql autocommit is on: a DELETE applies immediately if you did not open a BEGIN.',
        'ON CONFLICT needs a matching unique constraint; if there is none, it fails.',
        'An UPDATE that finds no rows is not an error, it simply affects zero rows. Always check the counter.'
      ],
      quiz: [
        { q: 'What is RETURNING for?', a: 'It returns the rows affected by an INSERT, UPDATE or DELETE in the same operation. It avoids a second query to get generated ids and guarantees you see exactly what was written.' },
        { q: 'What habit prevents a catastrophic UPDATE?', a: 'Writing a SELECT with the same WHERE first to see how many and which rows will be affected, and working inside a transaction you can roll back if the counter does not match what you expected.' },
        { q: 'What does ON CONFLICT DO UPDATE do?', a: 'If the INSERT clashes with a unique constraint, instead of failing it runs the given UPDATE on the existing row. It is useful for idempotent operations such as synchronisations.' },
        { q: 'Why should the seed have edge cases and not only nice data?', a: 'Because bugs show up at the edges: entities with no relationships, cancelled records, past dates. A seed with only happy data hides those problems until production.' }
      ],
      out: 'database/seed.sql that fills the database with consistent data and edge cases.',
      file: 'database/seed.sql'
    },
    {
      t: 'SELECT, filters and NULL',
      obj: 'Query data precisely and understand three-valued logic.',
      why: 'NULL is the number one cause of silently wrong results in SQL. Understanding it is the difference between a correct report and one that is wrong without warning.',
      study: { r: 4, what: 'Read the page focusing on IS NULL, IS DISTINCT FROM and the explanation of why comparing with NULL gives NULL. About 15 minutes. Look for one thing: why "column != 5" does not return the rows where the column is NULL.',
        pasos: [
          'Read the table of comparison operators at the start of the page (~3 min).',
          'Find the explanation that you must not write expression = NULL (~3 min) and write in your own words why NULL is not equal to NULL.',
          'Read the table of predicates: IS NULL, IS NOT NULL, IS DISTINCT FROM (~4 min).',
          'In psql run SELECT NULL = NULL; and SELECT NULL IS NOT DISTINCT FROM NULL; and compare the results.',
          'Rewrite a VetCare query that uses != so that it also includes the rows with NULL.'
        ] },
      ex: { title: 'NULL and the order of execution', body: `The NULL trap

SELECT * FROM pet WHERE weight_kg != 10;

This does NOT return the pets with no recorded weight.
Because NULL != 10 is neither true nor false, it is NULL,
and WHERE only lets through what is true.

Correct:
SELECT * FROM pet
 WHERE weight_kg IS DISTINCT FROM 10;

Or explicitly:
SELECT * FROM pet
 WHERE weight_kg != 10 OR weight_kg IS NULL;

Replacing NULL when displaying:
SELECT name, COALESCE(weight_kg, 0) AS weight FROM pet;

A full query with the pieces in order

SELECT  p.name,
        p.species,
        p.weight_kg
  FROM  pet p
 WHERE  p.species = 'dog'
   AND  p.birth_date >= DATE '2020-01-01'
   AND  p.weight_kg IS NOT NULL
 ORDER BY p.weight_kg DESC NULLS LAST
 LIMIT  10;

LOGICAL ORDER OF EXECUTION (not the order you write it)

1. FROM     where the rows come from
2. WHERE    filters individual rows
3. GROUP BY groups
4. HAVING   filters groups
5. SELECT   chooses and computes columns
6. ORDER BY sorts
7. LIMIT    trims

That is why you cannot use a SELECT alias inside the WHERE:
when WHERE runs, that alias does not exist yet.` },
      steps: [
        'Write ten queries over your seed, from easiest to hardest, in database/queries.sql.',
        'Include at least one with BETWEEN, one with IN, one with LIKE or ILIKE and one with IS NULL.',
        'Do the NULL experiment: count the pets whose weight is not 10 using != and using IS DISTINCT FROM, and compare the two numbers.',
        'Use ORDER BY with NULLS LAST and see how the result changes.',
        'Try to use a SELECT alias in the WHERE and read the error. Now you understand the order of execution.'
      ],
      vet: [
        'Useful VetCare queries: pets by species, today’s appointments, owners with no phone, pets with no visit in the last year.',
        'Comment each query with the business question it answers.'
      ],
      edge: [
        'LIKE is case-sensitive; ILIKE is not. For name searches you almost always want ILIKE.',
        'NOT IN with a subquery that returns any NULL always returns zero rows. Use NOT EXISTS.',
        'LIMIT without ORDER BY does not guarantee you always get the same rows: the order is undefined.'
      ],
      quiz: [
        { q: 'Why does "weight != 10" not return the rows where the weight is NULL?', a: 'Because any comparison with NULL gives NULL, which is not true. WHERE only lets true through, so those rows are silently discarded.' },
        { q: 'What is the logical order of execution of a query?', a: 'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. It differs from the order in which it is written, which is why an alias defined in SELECT cannot be used in WHERE.' },
        { q: 'Why is NOT IN with a subquery dangerous?', a: 'If the subquery returns even one NULL, the comparison can never be true and the result is empty. NOT EXISTS does not have that problem.' },
        { q: 'What does COALESCE do and when should you use it?', a: 'It returns the first argument that is not NULL. It is used to show a default value when displaying data, but it should not be used to hide NULLs that actually signal a data problem.' }
      ],
      out: 'database/queries.sql with ten commented queries and the NULL experiment documented.',
      file: 'database/queries.sql'
    },
    {
      t: 'JOINs',
      obj: 'Combine tables correctly and know when each type of JOIN changes the result.',
      why: 'JOINs are the most frequent technical test in backend interviews. And at work, using INNER where LEFT was needed produces reports that lose rows without warning.',
      study: { r: 5, what: 'Read the whole section: inner join, left outer join and self join. About 18 minutes. Look for one thing: why a filter in the WHERE can turn a LEFT JOIN into an INNER JOIN.',
        pasos: [
          'Read the start of the section (~4 min): the query that combines each city’s weather with its location.',
          'Continue with the LEFT OUTER JOIN part (~4 min): which rows now appear and why empty columns show up.',
          'Read the self join part (~3 min): joining a table to itself using aliases.',
          'Write three VetCare queries: appointments with their pet (inner), pets with or without appointments (left) and one that filters in the ON instead of the WHERE.',
          'Compare the number of rows of the last two and explain the difference.'
        ] },
      ex: { title: 'The JOINs you will really use', body: `INNER JOIN: only what matches on both sides

SELECT p.name AS pet, o.name AS owner
  FROM pet p
  JOIN owner o ON o.id = p.owner_id;

LEFT JOIN: everything on the left, matching or not

SELECT p.name,
       COUNT(v.id) AS visits
  FROM pet p
  LEFT JOIN visit v ON v.pet_id = p.id
 GROUP BY p.id, p.name;

With LEFT JOIN, a pet with no visits shows up with 0.
With INNER JOIN it simply disappears from the report.

THE MOST COMMON TRAP

-- This is NO longer a LEFT JOIN
SELECT p.name, v.visited_on
  FROM pet p
  LEFT JOIN visit v ON v.pet_id = p.id
 WHERE v.visited_on >= DATE '2026-01-01';

For pets with no visit, v.visited_on is NULL, the WHERE
discards them and you lose those rows.

Correct: the filter goes in the ON

SELECT p.name, v.visited_on
  FROM pet p
  LEFT JOIN visit v
         ON v.pet_id = p.id
        AND v.visited_on >= DATE '2026-01-01';

A three-table JOIN

SELECT o.name AS owner, p.name AS pet, a.starts_at
  FROM appointment a
  JOIN pet   p ON p.id = a.pet_id
  JOIN owner o ON o.id = p.owner_id
 WHERE a.starts_at::date = CURRENT_DATE   -- in week 10 you will see
 ORDER BY a.starts_at;                    -- why this does not use indexes` },
      steps: [
        'Write the query for today’s appointments with owner, pet and vet, joining four tables.',
        'Write the visits per pet report with LEFT JOIN and check that pets with no visits come out with zero.',
        'Do the trap experiment: move the date filter from the ON to the WHERE and compare the number of rows.',
        'Write a query that finds owners with no pets using LEFT JOIN with IS NULL, and the same one using NOT EXISTS.',
        'Put EXPLAIN in front of your four-table JOIN and just look at the plan. In week 10 you will understand it.'
      ],
      vet: [
        'VetCare reports to build: today’s schedule, a pet’s clinical history, owners with no recent visit.',
        'Save everything in database/queries.sql with the report name as a comment.'
      ],
      edge: [
        'If a JOIN returns more rows than expected, you almost always joined on a non-unique column and multiplied the results.',
        'Always use short table aliases and prefix every column: it avoids ambiguity and makes the query readable.',
        'An accidental CROSS JOIN happens if you forget the ON condition: it produces the Cartesian product and can hang the session.'
      ],
      quiz: [
        { q: 'What is the practical difference between INNER and LEFT JOIN?', a: 'INNER returns only the rows that match in both tables. LEFT keeps all the rows on the left and fills the right-hand columns with NULL when there is no match, which is what you need in reports with zeros.' },
        { q: 'Why does a filter in the WHERE cancel a LEFT JOIN?', a: 'Because rows with no match have NULL in the right-hand columns and the WHERE condition discards them. A filter on the right-hand table must go in the ON so it is applied before keeping the unmatched rows.' },
        { q: 'How do you find rows in A that have no match in B?', a: 'With LEFT JOIN and then WHERE b.id IS NULL, or with NOT EXISTS and a correlated subquery. NOT EXISTS is usually clearer and does not suffer from NOT IN’s NULL problem.' },
        { q: 'What does a JOIN that returns more rows than expected indicate?', a: 'That the join column is not unique in one of the tables, so each row on one side pairs with several on the other. You need to check the cardinality or aggregate before joining.' }
      ],
      out: 'Three reports with JOINs in database/queries.sql and the trap experiment documented.',
      file: 'database/queries.sql'
    },
    {
      t: 'Aggregations and transactions (weekly exam)',
      obj: 'Summarise data with GROUP BY and guarantee consistency with transactions.',
      why: 'Aggregations are 80 per cent of the reports you will be asked for, and transactions are what stop a payment from being recorded halfway. Together they close your SQL foundation.',
      study: { r: 2, what: 'Read the whole transactions chapter of the official tutorial. About 15 minutes. Look for one thing: what it means for a transaction to be atomic and what happens if the connection drops in the middle.',
        pasos: [
          'Read the whole section (~8 min): the example of the bank transfer between Alice and Bob.',
          'Underline the all-or-nothing idea and the idea that a committed transaction is not lost even if the server crashes.',
          'Read the SAVEPOINT part (~3 min): going back to an intermediate point without cancelling everything.',
          'In psql open a BEGIN, insert an appointment, run ROLLBACK and check that nothing is left.',
          'For GROUP BY, go over today’s example: the source today only covers transactions.'
        ] },
      ex: { title: 'GROUP BY, HAVING and BEGIN/COMMIT', body: `AGGREGATIONS

SELECT  v.id            AS vet_id,
        v.name,
        COUNT(a.id)     AS total_appointments,
        COUNT(*) FILTER (WHERE a.status = 'cancelled') AS cancelled,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.ends_at - a.starts_at)) / 60), 1) AS avg_minutes
  FROM  vet v
  LEFT JOIN appointment a ON a.vet_id = v.id
                         AND a.starts_at >= DATE '2026-01-01'  -- in the ON,
                                          -- not in the WHERE (day 5)
 GROUP BY v.id, v.name
HAVING  COUNT(a.id) > 5
 ORDER BY total_appointments DESC;

WHERE filters rows before grouping.
HAVING filters groups after grouping.
Everything in the SELECT that is not an aggregate goes in
GROUP BY.

COUNT(*) counts rows, including all-NULL ones.
COUNT(column) ignores that column's NULLs.

TRANSACTIONS

BEGIN;

  INSERT INTO invoice (owner_id, total, issued_at)
  SELECT id, 0, now() FROM owner WHERE email = 'ana@example.com'
  RETURNING id AS invoice_id \\gset

  INSERT INTO invoice_line (invoice_id, description, amount) VALUES
    (:'invoice_id', 'General consultation', 35.00),
    (:'invoice_id', 'Rabies vaccine',       18.50);

  UPDATE invoice
     SET total = (SELECT SUM(amount) FROM invoice_line
                   WHERE invoice_id = :'invoice_id')
   WHERE id = :'invoice_id';

COMMIT;

(\\gset is a psql command: it stores the id returned by
RETURNING in the invoice_id variable, and :'invoice_id'
uses it. That way you do not type ids by hand.)

If something fails between BEGIN and COMMIT, you ROLLBACK
and the database is as if nothing had happened.
There is never an invoice with half its lines.

ACID in one line each:
Atomicity    all or nothing
Consistency  constraints hold when it finishes
Isolation    a transaction does not see another's half work
Durability   what is committed survives a power cut` },
      steps: [
        'Write four aggregate reports: appointments per vet, income per month, most treated species, average consultation length.',
        'Use COUNT(*) FILTER (WHERE ...) at least once to count a subset without another query.',
        'Write the full invoicing transaction and test it with COMMIT.',
        'Repeat it causing an error on purpose (a negative amount that breaks your CHECK) and check with ROLLBACK that nothing is left.',
        'Final review: explain out loud for five minutes your schema.sql, why you chose each type, what each constraint protects and how you query today’s schedule.'
      ],
      vet: [
        'Leave database/reports.sql ready with the four commented reports.',
        'Summarise in database/README.md: how to create the database, run the schema, run the seed and run the reports.',
        'Press "Mark for review" and reread database/schema.sql in a week.'
      ],
      edge: [
        'A transaction left open and forgotten locks rows and can freeze the whole application. Always close it with COMMIT or ROLLBACK.',
        'AVG ignores NULLs, so the average may be computed over fewer rows than you think. Check with COUNT.',
        'In PostgreSQL, if a statement fails inside a transaction, the rest is aborted until you ROLLBACK: you will see "current transaction is aborted".'
      ],
      quiz: [
        { q: 'What is the difference between WHERE and HAVING?', a: 'WHERE filters individual rows before grouping and HAVING filters groups that have already been formed. That is why HAVING can use aggregate functions like COUNT and WHERE cannot.' },
        { q: 'What is the difference between COUNT(*) and COUNT(column)?', a: 'COUNT(*) counts every row in the group. COUNT(column) counts only those where that column is not NULL, so with LEFT JOIN it is the right way not to count the empty matches.' },
        { q: 'What does a transaction’s atomicity guarantee?', a: 'That the set of operations is applied completely or not at all. If the connection drops before the COMMIT, PostgreSQL rolls everything back and the database is never left in an intermediate state.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That the database is not a passive store: types define what can be represented, constraints define what is valid, queries define what you can answer and transactions guarantee that nothing is left half done.' }
      ],
      out: 'database/reports.sql with four reports and the invoicing transaction tested with COMMIT and ROLLBACK.',
      file: 'database/reports.sql'
    }
  ]
}
]);
