window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 20,
  phase: 'DevOps',
  title: 'Git, Docker and CI/CD: from your machine to something that runs by itself',
  idea: 'Until now VetCare exists in one place: your laptop. It works because you know what to start, in what order and with what configuration. That is not a system, it is a habit. This week you turn that habit into something written: a git history that tells a readable story, a Docker image that starts the same way on any machine, a docker compose that brings up the whole application with one command, and a pipeline that builds, tests and audits every time you push code, without you having to remember. By the end of the week you will be able to delete your local folder, clone the repository and have everything running in five minutes. That is the test.',
  res: [
    { t: 'Pro Git — Branching and Merging', u: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging', note: 'The official Git book, free. Read the chapters I point you to each day; the key is understanding that a branch is a pointer, not a copy.' },
    { t: 'Docker — Build with .NET / Dockerfile reference', u: 'https://docs.docker.com/reference/dockerfile/', note: 'The Dockerfile reference. Use it to look up specific instructions, not to read straight through.' },
    { t: 'Docker Compose — Overview', u: 'https://docs.docker.com/compose/', note: 'It explains the model of several services in one file. It is what turns your project into something that comes up with one command.' },
    { t: 'GitHub Actions — Understanding workflows', u: 'https://docs.github.com/en/actions/using-workflows/about-workflows', note: 'The model of workflows, jobs and steps. Once you understand this, any pipeline in any tool feels familiar.' },
    { t: 'Pro Git — Recording Changes to the Repository', u: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository', note: 'Staging, commit and the life cycle of a file.' },
    { t: 'Docker Docs — Multi-stage builds', u: 'https://docs.docker.com/build/building/multi-stage/', note: 'How to separate the build image from the runtime image so the final one is small.' },
    { t: 'Docker Docs — Control startup order in Compose', u: 'https://docs.docker.com/compose/how-tos/startup-order/', note: 'depends_on with a healthcheck: the API waits until the database is really ready.' }
  ],
  days: [
    {
      t: 'Real Git: commits and a history that can be read',
      obj: 'Stop using git as a save button and start using it as executable documentation of why the code is the way it is.',
      why: 'Your history is the first thing someone evaluating your work looks at. A history of forty commits saying "changes" says one thing about you; one where each commit is a coherent change with a message explaining why says something very different.',
      study: { r: 4, what: 'Read the Pro Git chapters Recording Changes to the Repository and Viewing the Commit History. About 15 minutes. Look for one specific idea: the staging area exists precisely so you can choose which part of your work goes into each commit, instead of dumping it all together.',
        pasos: [
          'Read "Checking the Status of Your Files", "Tracking New Files" and "Staging Modified Files" (~5 min).',
          'Read "Ignoring Files" (~2 min) and check your .gitignore.',
          'Read "Viewing Your Staged and Unstaged Changes" (~3 min): git diff and git diff --staged.',
          'Read "Committing Your Changes" (~2 min).',
          'Then open the Viewing the Commit History chapter (~4 min) and try git log --oneline --graph in your repository.'
        ] },
      ex: {
        title: 'A commit message that is useful six months later',
        body: `# BAD
git commit -m "changes"
git commit -m "fix"
git commit -m "now it works"
git commit -m "wip"

# GOOD: short imperative subject, a body that explains why
git commit -m "Reject overlapping appointments with 409 instead of 500

PostgreSQL's EXCLUDE constraint threw SqlState 23P01 and
came out as an unhandled error. Now it is caught in the endpoint
and translated to problem details with status 409, which is what
the web client needs to show a useful message.

Code is written once and read many times: the body explains
why, because whoever reads it already sees what in the diff."

# Choose what goes into the commit, do not dump everything
git status                  # what has changed
git diff                    # what exactly I changed
git add -p                  # piece by piece, deciding
git diff --staged           # review right before committing
git commit

# Read the history as what it is: a narrative
git log --oneline --graph --decorate -20
git log --oneline -- src/VetCare.Domain/   # only that folder
git log -S "TimeSlotTakenException"        # when this appeared
git blame src/VetCare.Domain/Appointment.cs

# Undo without losing work
git restore file.cs                 # discard unstaged changes
git restore --staged file.cs        # take it out of the staging area
git commit --amend                  # fix the last one (if you did not push it)
git revert <hash>                   # undo one already published`
      },
      steps: [
        'If VetCare is not in git yet, initialise it now: git init, create a .gitignore excluding bin, obj, node_modules, .env and local configuration files, and make the first commit. (Tip: dotnet new gitignore generates a complete one for .NET.)',
        'Make a real small change in the code and commit it with a complete message: an imperative subject under fifty characters, a blank line, and a body explaining why you did it and not what you did.',
        'Practise git add -p: make two unrelated changes in the same file and split them into two separate commits. It is the skill that leaves your history cleanest and almost nobody uses it.',
        'Run git log --oneline --graph on your repository and read it as if you were someone else. If there are commits whose message tells you nothing, note what message they should have had.',
        'Practise undoing in a test file: discard changes with restore, take something out of the staging area, fix the last commit with amend and undo one with revert. Doing it once without pressure is worth more than reading it ten times.'
      ],
      vet: [
        'Write docs/contributing.md with your commit message convention and paste it in as an example. Even if you work alone, it binds your future self and shows judgement to whoever looks at the repository.',
        'Check that .gitignore covers everything week 19 made you take out of the repository: .env and any local file with secrets. (appsettings.Development.json can be versioned if it has none.)'
      ],
      edge: [
        'Do not use git commit --amend or rewrite commits already published on a shared branch: you change the hashes and break the history of everyone who already had it. To undo something published, revert.',
        'A commit should be a coherent unit that leaves the project working. A commit that does not compile breaks git bisect, which is precisely the tool you will want the day you look for when a bug was introduced.',
        'git add . is convenient and is how secrets get pushed by accident. Always look at git status first, and if the diff is big, use add -p.'
      ],
      quiz: [
        { q: 'What is the staging area for if you are going to commit everything anyway?', a: 'It is for choosing what goes into each commit. If you worked on two things at once, the staging area lets you make two coherent commits instead of one mixed one, and that is what makes the history useful later.' },
        { q: 'Why should the message body explain why and not what?', a: 'Because the what is already in the diff and can be read with git show. What cannot be recovered is the reason: which alternative you discarded, which bug forced you to do it, which constraint existed. That is what whoever reads it in six months needs, including you.' },
        { q: 'What is the difference between revert and reset, and when do you use each?', a: 'revert creates a new commit that undoes another one’s changes, leaving the history intact; reset moves the branch pointer back and rewrites history. You use revert when the commit is already published and reset only on local work nobody has seen.' },
        { q: 'Why does it matter that every commit leaves the project compiling?', a: 'Because tools like git bisect walk the history building and testing to find where a failure was introduced. If there are broken commits along the way, the search becomes manual and you lose the best tool you have for hunting old regressions.' }
      ],
      out: 'VetCare in git with a correct .gitignore, at least three commits with complete messages and docs/contributing.md written.',
      file: 'docs/contributing.md'
    },
    {
      t: 'Branches, merges and working in parallel',
      obj: 'Work with branches with judgement, resolve a conflict properly and understand exactly what a merge does compared with a rebase.',
      why: 'In any team you work with branches and pull requests from day one. And merge conflicts are scary until you understand that git has not broken: it is simply asking you for a decision only you can make.',
      study: { r: 0, what: 'Read the whole Pro Git chapter Basic Branching and Merging, including the conflicts section. About 15 minutes. The idea that changes everything: a branch is only a pointer to a commit, which is why creating them is instant and why deleting them deletes nothing.',
        pasos: [
          'Read "Basic Branching" (~6 min): the example of the urgent fix while you work on something else.',
          'Read "Basic Merging" (~3 min): fast-forward versus three-way merge.',
          'Read "Basic Merge Conflicts" (~5 min) and notice the conflict markers.',
          'Create two branches that touch the same line, cause the conflict and resolve it by reading both sides before choosing.'
        ] },
      ex: {
        title: 'A complete branch cycle, including the conflict',
        body: `# Start from an up-to-date main
git switch main
git pull

# A short branch, with a name that says what it does
git switch -c feat/cancel-appointment

# ...you work, small commits...
git add -p && git commit

# Meanwhile main moved on. Bring that progress into your branch:
git fetch origin
git merge origin/main        # safe, creates a merge commit
# or
git rebase origin/main       # linear history, rewrites YOUR commits

# CONFLICT. Git marks the file like this:
# <<<<<<< HEAD
#     return Results.Conflict(problem);     <- what is in main
# =======
#     return Results.Problem(detail, statusCode: 409);   <- yours
# >>>>>>> feat/cancel-appointment
#
# Do not choose blindly. Read both versions, understand why
# each one exists and write the right version, which sometimes is
# neither of the two. Delete the markers.

git add file.cs
git merge --continue         # or git rebase --continue

# If you get lost, you can always abort and go back to the previous state
git merge --abort
git rebase --abort

# Integrate and clean up
git switch main
git merge --no-ff feat/cancel-appointment   # keeps the fact it was a branch
git branch -d feat/cancel-appointment

# The safety net: everything you did is recorded
git reflog`
      },
      steps: [
        'Create a feat/ branch for the next thing you are going to do in VetCare. Use a prefix (feat, fix, docs, refactor) and a name that describes the change, not the file.',
        'Cause a conflict on purpose: in main change a line of a file and commit; in your branch change that same line differently and commit; then try the merge. It is the only way to lose your fear of it.',
        'Resolve that conflict by reading both versions and writing the right one. Then check that it compiles and the tests pass before committing the merge: resolving a conflict without running anything is like not resolving it.',
        'Do the same exercise with rebase instead of merge and compare git log --graph of both results. You will see with your own eyes the difference between a forked history and a linear one.',
        'Run git reflog and find the states you went through. Knowing it exists is what lets you experiment with git without fear of losing work.'
      ],
      vet: [
        'Decide and write in docs/contributing.md your branching strategy for VetCare: prefixed names, short branches, main always compiling. Working alone, that is enough.',
        'If you have the repository on GitHub, create a pull request with yourself for today’s branch and review your own diff before merging it. Reading the full diff before merging catches more mistakes than you expect.'
      ],
      edge: [
        'Do not rebase a branch someone else already has: you rewrite the commits and create a divergent history for them that cannot be reconciled cleanly. The practical rule is rebase only on what nobody else has seen.',
        'Long branches are the real cause of painful conflicts. A two-day branch is integrated without drama; a three-week one becomes a project in itself.',
        'Resolving a conflict by keeping one whole version without reading the other is how changes get lost silently. The code compiles, the tests pass, and a feature disappeared without anyone noticing.'
      ],
      quiz: [
        { q: 'What exactly is a branch in git?', a: 'A movable pointer to a commit, nothing more. That is why creating a branch is instant and does not duplicate files, and why deleting it does not delete the commits: it only removes the label pointing at them.' },
        { q: 'What is the practical difference between merge and rebase?', a: 'merge creates a new commit joining the two histories and keeps the fork as it happened; rebase reapplies your commits on top of the other branch and produces a linear history but with new hashes. Merge is always safe; rebase is cleaner but only on commits nobody else has.' },
        { q: 'Why is rebasing a shared branch dangerous?', a: 'Because it rewrites the commits with different hashes, so whoever already had the old branch is left with a divergent history git cannot reconcile without duplicating commits or losing work.' },
        { q: 'What is git telling you with a merge conflict and what is the only thing that resolves it properly?', a: 'It is telling you that both branches changed the same lines and it cannot decide for you which intention is right. The only thing that resolves it properly is reading both versions, understanding why they exist and writing the version that fulfils both intentions, then checking that it compiles and the tests pass.' }
      ],
      out: 'A conflict caused and resolved properly, a branch integrated into main, and the branching strategy documented.',
      file: 'docs/contributing.md'
    },
    {
      t: 'Docker: packaging the API so it runs anywhere',
      obj: 'Write a multi-stage Dockerfile for the VetCare API and understand what an image and a container really are.',
      why: 'Docker is the definitive answer to "it works on my machine" and is a practically universal requirement in backend job offers. Understanding the difference between image and container, and why a multi-stage build matters, sets you apart from someone who only copies Dockerfiles.',
      study: { r: 5, what: 'Read the multi-stage builds page and look up the Dockerfile reference only for instructions you do not know. About 15 minutes. Key idea: each instruction creates a layer, and layers are cached, so the order in which you write the Dockerfile determines how long each rebuild takes.',
        pasos: [
          'Read the introduction and "Use multi-stage builds" (~5 min): one stage builds with the SDK and another runs with the runtime.',
          'Read "Name your build stages" (~2 min): FROM ... AS build.',
          'Read "Stop at a specific build stage" (~2 min).',
          'In the Dockerfile reference go over only WORKDIR, COPY, ENTRYPOINT and EXPOSE (~5 min).',
          'Order your Dockerfile to copy the .csproj files first and restore before copying the rest of the code, and explain why.'
        ] },
      ex: {
        title: 'A multi-stage Dockerfile for VetCare.Api',
        body: `# ===== Stage 1: build =====
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# First only the project files: if they do not change,
# Docker reuses the restore layer and saves minutes.
COPY src/VetCare.Api/*.csproj            src/VetCare.Api/
COPY src/VetCare.Domain/*.csproj         src/VetCare.Domain/
COPY src/VetCare.Application/*.csproj    src/VetCare.Application/
COPY src/VetCare.Infrastructure/*.csproj src/VetCare.Infrastructure/
# The API project is restored, NOT the solution: the solution also
# includes Playground and tests, whose .csproj we have not copied, and it would fail.
RUN dotnet restore src/VetCare.Api/VetCare.Api.csproj

# Now, all the code
COPY . .
RUN dotnet publish src/VetCare.Api/VetCare.Api.csproj \\
    -c Release -o /app/publish --no-restore

# ===== Stage 2: run =====
# An image without SDK or compiler: smaller and less surface.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# curl, only for compose's healthcheck (the image has neither curl nor wget)
RUN apt-get update && apt-get install -y --no-install-recommends curl \\
    && rm -rf /var/lib/apt/lists/*

# Do not run as root: .NET 8+ images already come with an unprivileged
# user, "app", and its number in the APP_UID variable
USER $APP_UID

COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "VetCare.Api.dll"]

# --- .dockerignore (just as important) ---
# Watch the **/: plain "bin/" only ignores the folder at the ROOT.
# Without **/, COPY . . puts your machine's obj/ on top of the restore
# and dotnet publish --no-restore fails (NETSDK1064).
# **/bin/
# **/obj/
# **/node_modules/
# .git/
# **/appsettings.Development.json
# .env

# --- Commands ---
# docker build -t vetcare-api:1.0 .
# docker run --rm -p 8080:8080 \\
#   -e ConnectionStrings__VetCare="Host=host.docker.internal;..." \\
#   vetcare-api:1.0
# docker images            # image size
# docker logs <id>
# docker exec -it <id> sh  # go in and look`
      },
      steps: [
        'Create the Dockerfile at the root of the solution and the .dockerignore next to it. The .dockerignore is not optional: without it you copy bin, obj and .git into the image and you can end up putting secrets in.',
        'Build the image with docker build and look at the size with docker images. Then, out of curiosity, build a single-stage version based on the SDK and compare: the difference is usually more than half a gigabyte.',
        'Start the container passing the connection string as an environment variable, as you prepared in week 19. Check that /health/ready answers from the browser.',
        'Make a one-line change in the code and rebuild. Watch which stages Docker reuses from the cache: if the restore is repeated every time, you copied the code before the csproj files.',
        'Check that the container does not run as root with docker exec -it <id> whoami. It must answer app; if it answers root, check the USER instruction.'
      ],
      vet: [
        'Add to VetCare’s README the section on how to build and start the image, with the exact commands. It is the first thing anyone who clones the repository looks for.',
        'Check that the container reads all its configuration from environment variables and that no value is left hard-coded in appsettings.json. An image must be deployable to any environment without rebuilding it.'
      ],
      edge: [
        'An image is the immutable template; a container is a run of that template. Everything you write inside a container disappears when you delete it, unless it is in a volume. That is why data never lives in the image.',
        'The order of the instructions determines how well the cache is used. Copy first what changes rarely (the csproj files) and then what changes always (the code). The other way round, every build downloads all the packages again.',
        'Do not put secrets in the Dockerfile with ENV or ARG: they stay in the image’s layers and anyone with the image can read them. Secrets are injected when the container starts.'
      ],
      quiz: [
        { q: 'What is the difference between an image and a container?', a: 'The image is an immutable template with the file system and the start command; the container is a specific run of that image with its own writable layer. From one image you can launch many containers, and what they write disappears when they are deleted unless you use volumes.' },
        { q: 'Why a multi-stage build and not a single one?', a: 'Because to build you need the SDK, the source code and the packages, but to run you only need the runtime and the published binaries. Separating them reduces the final image by hundreds of megabytes and, more importantly, removes the compiler and source code from production, which is attack surface you do not need.' },
        { q: 'Why copy the .csproj files and restore before copying the code?', a: 'Because Docker caches each layer and invalidates it when the files it copies change. If the restore depends only on the csproj files, changing a line of code does not force the packages to be downloaded again, and the rebuild goes from minutes to seconds.' },
        { q: 'Why configure USER and not run as root inside the container?', a: 'Because if someone manages to run code inside the container, they inherit the process’s permissions. As root they have full control of the container and more chances of escaping through an engine flaw, while an unprivileged user greatly limits what they can do.' }
      ],
      out: 'The VetCare.Api image built, running without root, answering /health/ready and documented in the README.',
      file: 'Dockerfile'
    },
    {
      t: 'Compose: bringing up the whole application with one command',
      obj: 'Define API, database and web in a single file, with ordered dependencies and data that survives restarts.',
      why: 'It is the difference between a project someone can try in five minutes and one they abandon after ten. And it is exactly the same mental model Kubernetes and any orchestrator use: services, networks, volumes and health checks.',
      study: { r: 6, what: 'Read how to control startup order in Compose and then the networking page. About 12 minutes. The important thing: services see each other by name, so the API connects to db and not to localhost.',
        pasos: [
          'Read "Control startup" (~4 min): depends_on on its own does not wait for the database to accept connections.',
          'Read "Example" (~3 min): condition: service_healthy together with a healthcheck.',
          'Open the Networking in Compose page from the index and read its introduction (~4 min): each service is reachable by its name.',
          'Write the API’s connection string inside Compose and explain why it does not use localhost.'
        ] },
      ex: {
        title: 'VetCare’s complete compose.yaml',
        body: `services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: vetcare
      POSTGRES_USER: vetcare
      POSTGRES_PASSWORD: \${DB_PASSWORD:?DB_PASSWORD is missing}
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"        # only so you can connect yourself
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vetcare -d vetcare"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ConnectionStrings__VetCare: "Host=db;Database=vetcare;Username=vetcare;Password=\${DB_PASSWORD}"
      Jwt__Key: \${JWT_KEY:?JWT_KEY is missing}
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy    # waits for the database to answer
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:8080/health/live || exit 1"]
      interval: 10s
      retries: 5

  web:
    build:
      context: ./web        # uses web/Dockerfile (below)
    environment:
      API_URL: http://api:8080   # where Vite's proxy sends /api
    ports:
      - "5173:5173"
    depends_on:
      api:
        condition: service_healthy

volumes:
  db-data:

# --- Commands ---
# docker compose up -d --build
# docker compose ps
# docker compose logs -f api
# docker compose exec db psql -U vetcare -d vetcare
# docker compose down            # stops everything, keeps the volume
# docker compose down -v         # DELETES the data too

# --- web/Dockerfile (development mode, for compose) ---
# FROM node:22-alpine
# WORKDIR /web
# COPY package*.json ./
# RUN npm ci
# COPY . .
# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host"]
#
# --- web/.dockerignore (without it, COPY . . puts your node_modules,
#     with your system's binaries, on top of the one npm ci installed) ---
# node_modules/
# dist/
#
# --- and in web/vite.config.ts, the proxy reads that variable ---
#   server: { proxy: { '/api': process.env.API_URL ?? 'http://localhost:5xxx' } }`
      },
      steps: [
        'Create compose.yaml at the root and a local .env file with DB_PASSWORD and JWT_KEY. Confirm that .env is in .gitignore: it is exactly what week 19 made you take out of the repository.',
        'Bring everything up with docker compose up -d --build and check with docker compose ps that the three services are healthy. If the API starts before the database, check the service_healthy condition.',
        'Apply the migrations against the container’s database and load your seed. Then run docker compose down followed by up and confirm the data is still there: that proves the volume works.',
        'Run docker compose down -v and bring it up again. Now the data should have disappeared. Having seen both things makes the difference between stopping and destroying clear to you forever.',
        'Do the definitive test: clone your repository into another folder as if you were someone else, create the .env from .env.example and bring everything up. If it works first time following only the README, your project is ready for someone else to see.'
      ],
      vet: [
        'Add a quick start section to VetCare’s README with exactly three steps: clone, copy .env.example to .env with your values, and docker compose up. Nothing more.',
        'Add an optional pgadmin or adminer service to the compose if you find it handy for inspecting the database, but leave it in a separate profile so it does not always start.'
      ],
      edge: [
        'Inside the compose network services are called by their service name, not localhost: the API connects to Host=db. localhost inside a container is that same container.',
        'depends_on without condition only waits for the container to start, not for the service to be ready. PostgreSQL takes a few seconds to accept connections, so without a healthcheck your API will fail on startup intermittently.',
        'docker compose down -v deletes the volumes and with them the whole database. It is the most common way to lose development data by accident: get used to typing plain down.'
      ],
      quiz: [
        { q: 'Why does the API connect to Host=db and not to Host=localhost?', a: 'Because compose creates a network where each service can be resolved by its name, and inside a container localhost refers to that container, not to the host machine. db is the DNS name of the PostgreSQL service inside that network.' },
        { q: 'What problem does a healthcheck solve that depends_on on its own does not?', a: 'depends_on only guarantees the start order of the containers, not that the process inside is ready. The healthcheck checks that the service really answers, and with condition service_healthy the API waits for PostgreSQL to accept connections instead of failing on startup.' },
        { q: 'Why does the database need a volume?', a: 'Because a container’s writable layer disappears when you delete it. A volume lives outside the container’s life cycle, so you can rebuild the image and recreate the container without losing the data.' },
        { q: 'What is the difference between docker compose down and docker compose down -v?', a: 'down stops and removes the containers and the network, but keeps the volumes and therefore the data. down -v also removes the volumes, which means deleting the whole database.' }
      ],
      out: 'docker compose up brings up database, API and web working, with data that survives restarts, checked from a clean clone.',
      file: 'compose.yaml'
    },
    {
      t: 'CI: letting the machine check for you on every push',
      obj: 'Set up a pipeline that builds, runs the tests against a real database and audits dependencies on every change, without you having to remember.',
      why: 'It is what turns your week 13 tests into a real safety net. A test that only runs when you remember protects nothing. Also, a repository with a green CI badge communicates professionalism before anyone reads a line of your code.',
      study: { r: 3, what: 'Read the GitHub Actions about workflows page. About 12 minutes. Keep the hierarchy: a workflow has jobs, each job runs on a clean machine, and each job has steps in order. Jobs are parallel by default unless you declare that one needs another.',
        pasos: [
          'Read "About workflows" and "Workflow basics" (~5 min): workflow, jobs, steps and runners.',
          'Read "Workflow triggers" (~3 min): push, pull_request and manual run.',
          'Write your pipeline’s hierarchy before writing the YAML: which jobs, in what order and which needs which.',
          'Decide what runs on every pull request and what only on main.'
        ] },
      ex: {
        title: '.github/workflows/ci.yml for VetCare',
        body: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  backend:
    runs-on: ubuntu-latest
    # The integration tests bring up their own PostgreSQL with
    # Testcontainers (week 13). ubuntu-latest already has Docker, so
    # there is no need to declare the database here.
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'

      - name: Restore
        run: dotnet restore

      - name: Build
        run: dotnet build --no-restore -c Release

      - name: Format
        run: dotnet format --verify-no-changes

      - name: Tests
        run: dotnet test --no-build -c Release --logger "trx;LogFileName=test.trx"

      - name: Vulnerable dependencies
        run: |
          dotnet list package --vulnerable --include-transitive 2>&1 | tee audit.txt
          ! grep -q "has the following vulnerable packages" audit.txt

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: web/package-lock.json
      - run: npm ci
      - run: npx tsc -b              # types (plain "tsc --noEmit" checks nothing in a Vite project)
      - run: npm run build
      - run: npm audit --audit-level=high --omit=dev

  image:
    needs: [backend, frontend]      # only if both passed
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t vetcare-api:\${{ github.sha }} .`
      },
      steps: [
        'Create .github/workflows/ci.yml with the backend job. Push and watch the run in the repository’s Actions tab. It will normally fail the first time: that is information, not failure.',
        'Fix whatever fails until the job is green. Typical failures: dotnet format finds unformatted files (run dotnet format locally and push again) or the integration tests do not find database/migrations because the relative path changes. Testcontainers works on GitHub without doing anything: the runner already has Docker.',
        'Add the frontend job with type checking, build and audit. They are three checks that take less than a minute and catch most silly mistakes.',
        'Add the image job with needs so it is only built if backend and frontend passed. Look at the dependency graph between jobs in the UI: it is the visual way to see what is parallelised and what waits.',
        'Break something on purpose, for example change a test’s assertion, and push on a branch. Check that the pipeline turns red and that the pull request warns you. A CI you have never seen fail is one you do not know works.'
      ],
      vet: [
        'Protect the main branch in the repository settings by requiring CI to pass before merging. It is what turns the pipeline from informative into mandatory.',
        'Add the workflow status badge at the top of VetCare’s README, with the link to Actions.'
      ],
      edge: [
        'Each job starts on a clean machine: it does not share a file system with the others unless you use artifacts. If one job builds and another expects to find the binaries, it will not find them.',
        'Cache the dependencies but never the test results. A badly configured cache can make the pipeline pass with old code, which is the worst possible kind of false green.',
        'Secrets go in the repository’s secrets and are referenced with the secrets syntax, never written in the yaml. And remember that the workflow’s yaml is public in a public repository.'
      ],
      quiz: [
        { q: 'What is the difference between a job and a step?', a: 'A job is a unit that runs on its own clean machine and can run in parallel with others; a step is a command inside a job and runs in order sharing the same file system. That is why two steps can pass files to each other and two jobs cannot, except with artifacts.' },
        { q: 'Why do the tests in CI use a real PostgreSQL (with Testcontainers) instead of a database mock?', a: 'Because the integration tests that really protect you check database behaviour: constraints, transactions, the overlap EXCLUDE. Against a mock they would always pass and tell you nothing; against a real database they reproduce what will happen in production.' },
        { q: 'What is needs between jobs for?', a: 'To declare that a job should only run if others finished successfully. Without needs every job starts at once, which is fast, but it makes no sense to build and publish an image if the tests failed.' },
        { q: 'Why make the pipeline fail on a vulnerable dependency instead of just showing it?', a: 'Because a warning that does not block is ignored by the third day. If it fails, going ahead requires an explicit decision by someone, and that decision is recorded instead of being diluted among notifications.' }
      ],
      out: 'A green pipeline with three jobs, tests running against real PostgreSQL, audit integrated and main protected.',
      file: '.github/workflows/ci.yml'
    },
    {
      t: 'Delivery and reproducibility (weekly exam)',
      obj: 'Prove that anyone can clone VetCare and have it running, and leave written down how it is deployed and how it is rolled back.',
      why: 'The question "how is your project deployed?" comes up in almost every mid-level interview. Answering it with a document and a reproducible demo instead of a vague explanation puts you in another category.',
      study: { r: 2, what: 'Reread your own README with the eyes of someone who does not know the project. About 10 minutes. Do not look for wording mistakes: look for the steps you take for granted because you already have them done. Those are the ones that make someone else give up.',
        pasos: [
          'Clone your repository into a new folder, as if you were someone else.',
          'Follow your README to the letter, without using anything that is not written.',
          'Note every step where you get stuck or have to guess.',
          'Fix the README with those steps and repeat until the clone works without help.'
        ] },
      ex: {
        title: 'docs/deployment.md: the document you get asked about',
        body: `# VetCare deployment

## Environments
| Environment | Where           | Database              | Who deploys   |
|-------------|-----------------|-----------------------|---------------|
| Local       | docker compose  | container             | anyone        |
| Staging     | single server   | managed PostgreSQL    | CI on main    |
| Production  | single server   | managed PostgreSQL    | manual        |

## Requirements
- Docker 24+ and Docker Compose v2
- Variables: DB_PASSWORD, JWT_KEY  (see .env.example)

## Local start
    git clone <url> && cd vetcare
    cp .env.example .env     # fill in the values
    docker compose up -d --build
    # API  http://localhost:8080/health/ready
    # Web  http://localhost:5173

## Migrations
They are applied BEFORE starting the new version, following
expand/contract (week 10): first you add, you deploy the
code that uses the old and the new, and only afterwards you remove.
That way a code rollback never leaves the database incompatible.

    ./database/migrate.sh    # the week 10 migrations, pointed at
                             # that environment's database (PGHOST, PGUSER...)

## Deployment
1. CI green on main
2. Build the image tagged with the commit's sha
3. Apply migrations (expand only)
4. Start the new version
5. Check /health/ready and a real use case
6. If it fails -> rollback

## Rollback
    docker compose up -d --no-deps api   # with the previous tag
Migrations are NOT reverted: that is why only backward-compatible
schema changes are deployed.

## What to watch after deploying
- /health/ready green
- 5xx errors in the logs for 10 minutes
- One appointment created end to end

## Known risks
- A single server: there is downtime during deployment. Accepted.
- No automated backups. PENDING, high priority.`
      },
      steps: [
        'Do the clean folder test for real: clone the repository to a new path, do not copy anything from your current folder and follow your README to the letter without improvising. Every time you have to do something that is not written, stop and note it.',
        'Fix the README until the test works from start to finish without any improvised step. This is the week’s real check; everything else is a means to get here.',
        'Write the complete docs/deployment.md following the example: environments, requirements, start, migrations, deployment steps, rollback, what to watch afterwards and known risks.',
        'Check the week’s list: history with readable messages, .gitignore covering secrets, a conflict resolved, multi-stage Dockerfile without root, .dockerignore, compose with healthchecks and a volume, green CI with tests against PostgreSQL, dependency audit in CI, main protected, README with a three-step start and deployment documented.',
        'Simulate a rollback: deploy locally the image tagged with the previous commit and check that the application still works against the same database. If it does not, your last migration was not backward compatible and that is exactly what you wanted to discover here and not in production.',
        'Explain out loud, in three minutes, how VetCare is deployed and what you would do if the deployment goes wrong. If you get stuck, the document is not finished yet.'
      ],
      vet: [
        'Add to the README the index of the documents you have: requirements, domain-model, api-contract, testing, resilience, architecture, adr, frontend, security, threat-model, dependencies, deployment and contributing. That index is your portfolio.',
        'Tag this point of the repository with git tag -a v0.1.0 -m "VetCare with reproducible deployment" and push the tag. It is your first versioned milestone.',
        'Press "Mark for review" and reread docs/deployment.md in a week.'
      ],
      edge: [
        'A README that works today on your machine and fails on a clean one is a README you have not tested. The clean clone test is the only one that counts.',
        'Migrations are not reverted in a real rollback: reverting a schema change with data inside is dangerous and often impossible. That is why expand/contract is not an academic nicety but the condition that makes going back possible.',
        'Automating a deployment you do not understand by hand is automating a problem. Do the process manually at least once understanding each step before putting it in a script.'
      ],
      quiz: [
        { q: 'Why is the clean clone test the check that matters?', a: 'Because on your machine you already have installed, configured and started everything the README takes for granted, so you cannot spot the missing steps. A clean clone has none of those assumptions and reveals exactly where someone else would get stuck.' },
        { q: 'Why are migrations not reverted in a rollback?', a: 'Because reverting a schema change with data already written can be destructive or simply impossible. The solution is to deploy only backward-compatible changes with expand/contract, so the previous version of the code keeps working against the new schema.' },
        { q: 'What should a deployment document include at a minimum?', a: 'The environments and who deploys to each one, the requirements and variables needed, the ordered steps including the migration, the rollback procedure, what to check after deploying and the known risks that are accepted.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That a project is not finished when it works on your machine but when anyone can reproduce it without you, and that git, Docker and CI are precisely the three tools that turn your implicit knowledge into instructions a machine can follow and check by itself.' }
      ],
      out: 'A clean clone working by following only the README, docs/deployment.md complete, rollback tested and the v0.1.0 tag published.',
      file: 'docs/deployment.md'
    }
  ]
}
]);
