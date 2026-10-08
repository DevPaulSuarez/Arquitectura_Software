window.WEEKS = (window.WEEKS || []).concat([
{
  n: 20,
  phase: 'DevOps',
  title: 'Git, Docker y CI/CD: de tu máquina a algo que corre solo',
  idea: 'Hasta ahora VetCare existe en un sitio: tu portátil. Funciona porque tú sabes qué arrancar, en qué orden y con qué configuración. Eso no es un sistema, es una costumbre. Esta semana conviertes esa costumbre en algo escrito: un historial de git que cuenta una historia legible, una imagen de Docker que arranca igual en cualquier máquina, un docker compose que levanta la aplicación entera con un comando, y un pipeline que compila, prueba y audita cada vez que subes código, sin que tengas que acordarte. Al final de la semana vas a poder borrar tu carpeta local, clonar el repositorio y tener todo corriendo en cinco minutos. Esa es la prueba.',
  res: [
    { t: 'Pro Git — Branching and Merging', u: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging', note: 'El libro oficial de Git, gratis. Lee los capítulos que te indico cada día; la clave es entender que una rama es un puntero, no una copia.' },
    { t: 'Docker — Build with .NET / Dockerfile reference', u: 'https://docs.docker.com/reference/dockerfile/', note: 'La referencia del Dockerfile. La usas para buscar instrucciones concretas, no para leerla de corrido.' },
    { t: 'Docker Compose — Overview', u: 'https://docs.docker.com/compose/', note: 'Explica el modelo de varios servicios en un archivo. Es lo que convierte tu proyecto en algo que se levanta con un comando.' },
    { t: 'GitHub Actions — Understanding workflows', u: 'https://docs.github.com/en/actions/using-workflows/about-workflows', note: 'El modelo de workflows, jobs y steps. Entendido esto, cualquier pipeline de cualquier herramienta te resulta familiar.' },
    { t: 'Pro Git — Recording Changes to the Repository', u: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository', note: 'Staging, commit y el ciclo de vida de un archivo.' },
    { t: 'Docker Docs — Multi-stage builds', u: 'https://docs.docker.com/build/building/multi-stage/', note: 'Cómo separar la imagen de compilación de la de ejecución para que la final sea pequeña.' },
    { t: 'Docker Docs — Control startup order in Compose', u: 'https://docs.docker.com/compose/how-tos/startup-order/', note: 'depends_on con healthcheck: que la API espere a que la base esté lista de verdad.' }
  ],
  days: [
    {
      t: 'Git de verdad: commits e historial que se leen',
      obj: 'Dejar de usar git como botón de guardar y empezar a usarlo como documentación ejecutable de por qué el código es como es.',
      why: 'Tu historial es lo primero que mira alguien que evalúa tu trabajo. Un historial de cuarenta commits que dicen "cambios" dice una cosa de ti; uno donde cada commit es un cambio coherente con un mensaje que explica el porqué dice otra muy distinta.',
      study: { r: 4, what: 'Lee en Pro Git el capítulo Recording Changes to the Repository y el de Viewing the Commit History. Unos 15 minutos. Busca una idea concreta: el área de preparación existe precisamente para que puedas elegir qué parte de tu trabajo entra en cada commit, en vez de volcarlo todo junto.',
        pasos: [
          'Lee "Checking the Status of Your Files", "Tracking New Files" y "Staging Modified Files" (~5 min).',
          'Lee "Ignoring Files" (~2 min) y revisa tu .gitignore.',
          'Lee "Viewing Your Staged and Unstaged Changes" (~3 min): git diff y git diff --staged.',
          'Lee "Committing Your Changes" (~2 min).',
          'Abre después el capítulo Viewing the Commit History (~4 min) y prueba git log --oneline --graph en tu repositorio.'
        ] },
      ex: {
        title: 'Un mensaje de commit que sirve dentro de seis meses',
        body: `# MAL
git commit -m "cambios"
git commit -m "fix"
git commit -m "ahora sí"
git commit -m "wip"

# BIEN: asunto imperativo y corto, cuerpo que explica el porqué
git commit -m "Rechazar citas solapadas con 409 en vez de 500

El constraint EXCLUDE de PostgreSQL lanzaba SqlState 23P01 y
salía como error no controlado. Ahora se captura en el endpoint
y se traduce a problem details con status 409, que es lo que
el cliente web necesita para mostrar un mensaje útil.

El código se escribe una vez y se lee muchas: el cuerpo explica
el porqué, porque quien lo lee ya ve el qué en el diff."

# Elegir qué entra en el commit, no volcarlo todo
git status                  # qué hay cambiado
git diff                    # qué cambié exactamente
git add -p                  # trocito a trocito, decidiendo
git diff --staged           # revisar justo antes de confirmar
git commit

# Leer el historial como lo que es: una narración
git log --oneline --graph --decorate -20
git log --oneline -- src/VetCare.Domain/   # solo esa carpeta
git log -S "HorarioOcupadoException"       # cuándo apareció esto
git blame src/VetCare.Domain/Clinica/Cita.cs

# Deshacer sin perder trabajo
git restore archivo.cs              # descartar cambios no preparados
git restore --staged archivo.cs     # sacar del área de preparación
git commit --amend                  # corregir el último (si no lo subiste)
git revert <hash>                   # deshacer uno ya publicado`
      },
      steps: [
        'Si VetCare no está en git todavía, inicialízalo ahora: git init, crea un .gitignore que excluya bin, obj, node_modules, .env y los archivos de configuración local, y haz el primer commit. (Truco: dotnet new gitignore te genera uno completo para .NET.)',
        'Haz un cambio pequeño de verdad en el código y confírmalo con un mensaje completo: asunto imperativo de menos de cincuenta caracteres, línea en blanco, y un cuerpo que explique por qué lo hiciste y no qué hiciste.',
        'Practica git add -p: haz dos cambios no relacionados en el mismo archivo y sepáralos en dos commits distintos. Es la habilidad que más limpia deja tu historia y casi nadie la usa.',
        'Ejecuta git log --oneline --graph de tu repositorio y léelo como si fueras otra persona. Si hay commits cuyo mensaje no te dice nada, anota qué mensaje deberían haber tenido.',
        'Practica deshacer en un archivo de pruebas: descarta cambios con restore, saca algo del área de preparación, corrige el último commit con amend y deshaz uno con revert. Hacerlo una vez sin presión vale más que leerlo diez veces.'
      ],
      vet: [
        'Escribe docs/contributing.md con tu convención de mensajes de commit y pégala como ejemplo. Aunque trabajes solo, obliga a tu yo futuro y demuestra criterio a quien mire el repositorio.',
        'Revisa que .gitignore cubre todo lo que la semana 19 te hizo sacar del repositorio: .env y cualquier archivo local con secretos. (appsettings.Development.json puede versionarse si no tiene ninguno.)'
      ],
      edge: [
        'No uses git commit --amend ni reescribas commits que ya están publicados en una rama compartida: cambias los hashes y rompes el historial de todos los que ya lo tenían. Para deshacer algo publicado, revert.',
        'Un commit debe ser una unidad coherente que deje el proyecto funcionando. Un commit que no compila rompe git bisect, que es precisamente la herramienta que querrás usar el día que busques cuándo se introdujo un bug.',
        'git add . es cómodo y es así como se suben secretos sin querer. Mira siempre git status antes, y si el diff es grande, usa add -p.'
      ],
      quiz: [
        { q: '¿Para qué sirve el área de preparación si total vas a confirmar todo?', a: 'Sirve para elegir qué entra en cada commit. Si trabajaste en dos cosas a la vez, el área de preparación te deja hacer dos commits coherentes en vez de uno mezclado, y eso es lo que hace que el historial sea útil después.' },
        { q: '¿Por qué el cuerpo del mensaje debe explicar el porqué y no el qué?', a: 'Porque el qué ya está en el diff y se puede leer con git show. Lo que no se puede recuperar es la razón: qué alternativa descartaste, qué bug te obligó a hacerlo, qué restricción existía. Eso es lo que necesita quien lo lea dentro de seis meses, incluido tú.' },
        { q: '¿Cuál es la diferencia entre revert y reset, y cuándo usas cada uno?', a: 'revert crea un commit nuevo que deshace los cambios de otro, dejando el historial intacto; reset mueve el puntero de la rama hacia atrás y reescribe la historia. Usas revert cuando el commit ya está publicado y reset solo en trabajo local que nadie ha visto.' },
        { q: '¿Por qué importa que cada commit deje el proyecto compilando?', a: 'Porque herramientas como git bisect recorren el historial compilando y probando para encontrar dónde se introdujo un fallo. Si hay commits rotos por el camino, la búsqueda se vuelve manual y pierdes la mejor herramienta que tienes para cazar regresiones antiguas.' }
      ],
      out: 'VetCare en git con .gitignore correcto, al menos tres commits con mensajes completos y docs/contributing.md escrito.',
      file: 'docs/contributing.md'
    },
    {
      t: 'Ramas, merges y trabajo en paralelo',
      obj: 'Trabajar con ramas con criterio, resolver un conflicto a conciencia y entender qué hace exactamente un merge frente a un rebase.',
      why: 'En cualquier equipo trabajas con ramas y pull requests desde el primer día. Y los conflictos de merge asustan hasta que entiendes que git no se ha roto: simplemente te está pidiendo una decisión que solo tú puedes tomar.',
      study: { r: 0, what: 'Lee en Pro Git el capítulo Basic Branching and Merging entero, incluida la sección de conflictos. Unos 15 minutos. La idea que lo cambia todo: una rama es solo un puntero a un commit, por eso crearlas es instantáneo y por eso borrarlas no borra nada.',
        pasos: [
          'Lee "Basic Branching" (~6 min): el ejemplo del arreglo urgente mientras trabajas en otra cosa.',
          'Lee "Basic Merging" (~3 min): fast-forward frente a merge de tres vías.',
          'Lee "Basic Merge Conflicts" (~5 min) y fíjate en los marcadores de conflicto.',
          'Crea dos ramas que toquen la misma línea, provoca el conflicto y resuélvelo leyendo los dos lados antes de elegir.'
        ] },
      ex: {
        title: 'Un ciclo de rama completo, incluido el conflicto',
        body: `# Partir de main actualizada
git switch main
git pull

# Rama corta, con nombre que dice qué hace
git switch -c feat/cancelar-cita

# ...trabajas, commits pequeños...
git add -p && git commit

# Mientras tanto main avanzó. Traer ese avance a tu rama:
git fetch origin
git merge origin/main        # seguro, crea commit de merge
# o
git rebase origin/main       # historia lineal, reescribe TUS commits

# CONFLICTO. Git marca el archivo así:
# <<<<<<< HEAD
#     return Results.Conflict(problema);     <- lo que hay en main
# =======
#     return Results.Problem(detalle, statusCode: 409);   <- lo tuyo
# >>>>>>> feat/cancelar-cita
#
# No elijas a ciegas. Lee las dos versiones, entiende por qué
# cada una existe y escribe la versión correcta, que a veces no
# es ninguna de las dos. Borra los marcadores.

git add archivo.cs
git merge --continue         # o git rebase --continue

# Si te pierdes, siempre puedes abortar y volver al estado anterior
git merge --abort
git rebase --abort

# Integrar y limpiar
git switch main
git merge --no-ff feat/cancelar-cita   # conserva que fue una rama
git branch -d feat/cancelar-cita

# La red de seguridad: todo lo que hiciste queda registrado
git reflog`
      },
      steps: [
        'Crea una rama feat/ para la siguiente cosa que vayas a hacer en VetCare. Usa un prefijo (feat, fix, docs, refactor) y un nombre que describa el cambio, no el archivo.',
        'Provoca un conflicto a propósito: en main cambia una línea de un archivo y confirma; en tu rama cambia esa misma línea de otra forma y confirma; luego intenta el merge. Es la única forma de perderle el miedo.',
        'Resuelve ese conflicto leyendo las dos versiones y escribiendo la correcta. Después verifica que compila y que los tests pasan antes de confirmar el merge: resolver un conflicto sin ejecutar nada es como no resolverlo.',
        'Haz el mismo ejercicio con rebase en lugar de merge y compara git log --graph de ambos resultados. Vas a ver con tus ojos la diferencia entre una historia con bifurcación y una lineal.',
        'Ejecuta git reflog y localiza los estados por los que pasaste. Saber que existe es lo que te permite experimentar con git sin miedo a perder trabajo.'
      ],
      vet: [
        'Decide y escribe en docs/contributing.md tu estrategia de ramas para VetCare: nombres con prefijo, ramas cortas, main siempre compilando. Trabajando solo basta con eso.',
        'Si tienes el repositorio en GitHub, crea una pull request contigo mismo para la rama de hoy y revisa tu propio diff antes de integrarla. Leer el diff completo antes de fusionar detecta más errores de los que esperas.'
      ],
      edge: [
        'No hagas rebase de una rama que otra persona ya tiene: reescribes los commits y le creas un historial divergente imposible de reconciliar limpiamente. La regla práctica es rebase solo sobre lo que nadie más ha visto.',
        'Las ramas largas son la causa real de los conflictos dolorosos. Una rama de dos días se integra sin drama; una de tres semanas se convierte en un proyecto en sí misma.',
        'Resolver un conflicto quedándote con una versión entera sin leer la otra es así como se pierden cambios silenciosamente. El código compila, los tests pasan, y una funcionalidad desapareció sin que nadie se entere.'
      ],
      quiz: [
        { q: '¿Qué es exactamente una rama en git?', a: 'Un puntero móvil a un commit, nada más. Por eso crear una rama es instantáneo y no duplica archivos, y por eso borrarla no borra los commits: solo quita la etiqueta que apuntaba a ellos.' },
        { q: '¿Cuál es la diferencia práctica entre merge y rebase?', a: 'merge crea un commit nuevo que une las dos historias y conserva la bifurcación tal como ocurrió; rebase reaplica tus commits encima de la otra rama y produce una historia lineal pero con hashes nuevos. Merge es seguro siempre; rebase es más limpio pero solo sobre commits que nadie más tiene.' },
        { q: '¿Por qué es peligroso hacer rebase de una rama compartida?', a: 'Porque reescribe los commits con hashes distintos, así que quien ya tenía la rama antigua se queda con una historia divergente que git no puede reconciliar sin duplicar commits o perder trabajo.' },
        { q: '¿Qué te dice git con un conflicto de merge y qué es lo único que lo resuelve bien?', a: 'Te dice que las dos ramas cambiaron las mismas líneas y que no puede decidir por ti cuál es la intención correcta. Lo único que lo resuelve bien es leer ambas versiones, entender por qué existen y escribir la versión que cumple las dos intenciones, verificando después que compila y los tests pasan.' }
      ],
      out: 'Un conflicto provocado y resuelto a conciencia, una rama integrada en main, y la estrategia de ramas documentada.',
      file: 'docs/contributing.md'
    },
    {
      t: 'Docker: empaquetar la API para que corra en cualquier sitio',
      obj: 'Escribir un Dockerfile multietapa para la API de VetCare y entender qué es realmente una imagen y un contenedor.',
      why: 'Docker es la respuesta definitiva a "en mi máquina funciona" y es un requisito prácticamente universal en las ofertas de backend. Entender la diferencia entre imagen y contenedor, y por qué una compilación multietapa importa, te separa del que solo copia Dockerfiles.',
      study: { r: 5, what: 'Lee la página de multi-stage builds y consulta la referencia de Dockerfile solo para las instrucciones que no conozcas. Unos 15 minutos. Idea clave: cada instrucción crea una capa, y las capas se cachean, así que el orden en que escribes el Dockerfile determina cuánto tarda cada reconstrucción.',
        pasos: [
          'Lee la introducción y "Use multi-stage builds" (~5 min): una etapa compila con el SDK y otra ejecuta con el runtime.',
          'Lee "Name your build stages" (~2 min): FROM ... AS build.',
          'Lee "Stop at a specific build stage" (~2 min).',
          'En la referencia de Dockerfile repasa solo WORKDIR, COPY, ENTRYPOINT y EXPOSE (~5 min).',
          'Ordena tu Dockerfile para copiar primero los .csproj y hacer el restore antes de copiar el resto del código, y explica por qué.'
        ] },
      ex: {
        title: 'Dockerfile multietapa para VetCare.Api',
        body: `# ===== Etapa 1: compilar =====
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Primero solo los archivos de proyecto: si no cambian,
# Docker reutiliza la capa de restore y ahorra minutos.
COPY src/VetCare.Api/*.csproj            src/VetCare.Api/
COPY src/VetCare.Domain/*.csproj         src/VetCare.Domain/
COPY src/VetCare.Application/*.csproj    src/VetCare.Application/
COPY src/VetCare.Infrastructure/*.csproj src/VetCare.Infrastructure/
# Se restaura el proyecto de la API, NO la solución: la solución también
# incluye Playground y tests, cuyos .csproj no hemos copiado, y fallaría.
RUN dotnet restore src/VetCare.Api/VetCare.Api.csproj

# Ahora sí, todo el código
COPY . .
RUN dotnet publish src/VetCare.Api/VetCare.Api.csproj \\
    -c Release -o /app/publish --no-restore

# ===== Etapa 2: ejecutar =====
# Imagen sin SDK ni compilador: más pequeña y menos superficie.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# curl, solo para el healthcheck de compose (la imagen no trae ni curl ni wget)
RUN apt-get update && apt-get install -y --no-install-recommends curl \\
    && rm -rf /var/lib/apt/lists/*

# No correr como root: las imágenes de .NET 8+ ya traen un usuario
# sin privilegios, "app", y su número en la variable APP_UID
USER $APP_UID

COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "VetCare.Api.dll"]

# --- .dockerignore (igual de importante) ---
# Ojo con el **/: "bin/" a secas solo ignora la carpeta de la RAÍZ.
# Sin **/, COPY . . mete los obj/ de tu máquina encima del restore
# y dotnet publish --no-restore falla (NETSDK1064).
# **/bin/
# **/obj/
# **/node_modules/
# .git/
# **/appsettings.Development.json
# .env

# --- Comandos ---
# docker build -t vetcare-api:1.0 .
# docker run --rm -p 8080:8080 \\
#   -e ConnectionStrings__VetCare="Host=host.docker.internal;..." \\
#   vetcare-api:1.0
# docker images            # tamaño de la imagen
# docker logs <id>
# docker exec -it <id> sh  # entrar a mirar`
      },
      steps: [
        'Crea el Dockerfile en la raíz de la solución y el .dockerignore junto a él. El .dockerignore no es opcional: sin él copias bin, obj y .git dentro de la imagen y puedes acabar metiendo secretos.',
        'Construye la imagen con docker build y mira el tamaño con docker images. Después, por curiosidad, construye una versión de una sola etapa basada en el SDK y compara: la diferencia suele ser de más de medio gigabyte.',
        'Arranca el contenedor pasando la cadena de conexión como variable de entorno, tal como preparaste en la semana 19. Comprueba que /health/ready responde desde el navegador.',
        'Haz un cambio de una línea en el código y reconstruye. Observa qué etapas reutiliza Docker de la caché: si el restore se repite cada vez, es que copiaste el código antes que los csproj.',
        'Verifica que el contenedor no corre como root con docker exec -it <id> whoami. Debe responder app; si responde root, revisa la instrucción USER.'
      ],
      vet: [
        'Añade al README de VetCare la sección de cómo construir y arrancar la imagen, con los comandos exactos. Es lo primero que busca cualquiera que clone el repositorio.',
        'Comprueba que el contenedor lee toda su configuración de variables de entorno y que no queda ningún valor quemado en appsettings.json. Una imagen debe poder desplegarse en cualquier entorno sin reconstruirla.'
      ],
      edge: [
        'Una imagen es la plantilla inmutable; un contenedor es una ejecución de esa plantilla. Todo lo que escribas dentro de un contenedor desaparece al borrarlo, salvo que esté en un volumen. Por eso los datos nunca viven en la imagen.',
        'El orden de las instrucciones determina el aprovechamiento de la cache. Copia primero lo que cambia poco (los csproj) y después lo que cambia siempre (el código). Al revés, cada build descarga todos los paquetes otra vez.',
        'No metas secretos en el Dockerfile con ENV ni con ARG: quedan en las capas de la imagen y cualquiera con la imagen puede leerlos. Los secretos se inyectan al arrancar el contenedor.'
      ],
      quiz: [
        { q: '¿Cuál es la diferencia entre una imagen y un contenedor?', a: 'La imagen es una plantilla inmutable con el sistema de archivos y la orden de arranque; el contenedor es una ejecución concreta de esa imagen con su propia capa de escritura. De una imagen puedes lanzar muchos contenedores, y lo que escriben desaparece al borrarlos salvo que uses volúmenes.' },
        { q: '¿Por qué una compilación multietapa y no una sola?', a: 'Porque para compilar necesitas el SDK, el código fuente y los paquetes, pero para ejecutar solo necesitas el runtime y los binarios publicados. Separarlo reduce la imagen final en cientos de megas y, más importante, quita de producción el compilador y el código fuente, que es superficie de ataque que no necesitas.' },
        { q: '¿Por qué copiar los .csproj y hacer restore antes de copiar el código?', a: 'Porque Docker cachea cada capa y la invalida cuando cambian los archivos que copia. Si el restore depende solo de los csproj, cambiar una línea de código no obliga a descargar los paquetes otra vez, y la reconstrucción pasa de minutos a segundos.' },
        { q: '¿Por qué configurar USER y no correr como root dentro del contenedor?', a: 'Porque si alguien consigue ejecutar código dentro del contenedor, hereda los permisos del proceso. Como root tiene control total del contenedor y más posibilidades de escapar a través de un fallo del motor, mientras que un usuario sin privilegios limita mucho lo que puede hacer.' }
      ],
      out: 'Imagen de VetCare.Api construida, corriendo sin root, respondiendo a /health/ready y documentada en el README.',
      file: 'Dockerfile'
    },
    {
      t: 'Compose: levantar la aplicación entera con un comando',
      obj: 'Definir API, base de datos y web en un solo archivo, con dependencias ordenadas y datos que sobreviven a los reinicios.',
      why: 'Es la diferencia entre un proyecto que alguien puede probar en cinco minutos y uno que abandona a los diez. Y es exactamente el mismo modelo mental que usan Kubernetes y cualquier orquestador: servicios, redes, volúmenes y comprobaciones de salud.',
      study: { r: 6, what: 'Lee cómo controlar el orden de arranque en Compose y después la página de networking. Unos 12 minutos. Lo importante: los servicios se ven entre sí por su nombre, así que la API se conecta a db y no a localhost.',
        pasos: [
          'Lee "Control startup" (~4 min): depends_on por sí solo no espera a que la base acepte conexiones.',
          'Lee "Example" (~3 min): condition: service_healthy junto a un healthcheck.',
          'Abre la página Networking in Compose desde el índice y lee su introducción (~4 min): cada servicio es accesible por su nombre.',
          'Escribe la cadena de conexión de la API dentro de Compose y explica por qué no lleva localhost.'
        ] },
      ex: {
        title: 'compose.yaml de VetCare completo',
        body: `services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: vetcare
      POSTGRES_USER: vetcare
      POSTGRES_PASSWORD: \${DB_PASSWORD:?falta DB_PASSWORD}
    volumes:
      - datos-db:/var/lib/postgresql/data
    ports:
      - "5432:5432"        # solo para que puedas conectarte tú
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
      Jwt__Clave: \${JWT_CLAVE:?falta JWT_CLAVE}
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy    # espera a que la base responda
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:8080/health/live || exit 1"]
      interval: 10s
      retries: 5

  web:
    build:
      context: ./web        # usa web/Dockerfile (abajo)
    environment:
      API_URL: http://api:8080   # a dónde manda el proxy de Vite las /api
    ports:
      - "5173:5173"
    depends_on:
      api:
        condition: service_healthy

volumes:
  datos-db:

# --- Comandos ---
# docker compose up -d --build
# docker compose ps
# docker compose logs -f api
# docker compose exec db psql -U vetcare -d vetcare
# docker compose down            # para todo, conserva el volumen
# docker compose down -v         # BORRA los datos también

# --- web/Dockerfile (modo desarrollo, para compose) ---
# FROM node:22-alpine
# WORKDIR /web
# COPY package*.json ./
# RUN npm ci
# COPY . .
# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host"]
#
# --- web/.dockerignore (sin él, COPY . . mete tu node_modules,
#     con binarios de tu sistema, encima del que instaló npm ci) ---
# node_modules/
# dist/
#
# --- y en web/vite.config.ts, el proxy lee esa variable ---
#   server: { proxy: { '/api': process.env.API_URL ?? 'http://localhost:5xxx' } }`
      },
      steps: [
        'Crea compose.yaml en la raíz y un archivo .env local con DB_PASSWORD y JWT_CLAVE. Confirma que .env está en .gitignore: es exactamente lo que la semana 19 te hizo sacar del repositorio.',
        'Levanta todo con docker compose up -d --build y comprueba con docker compose ps que los tres servicios están sanos. Si la API arranca antes que la base, revisa la condición service_healthy.',
        'Aplica las migraciones contra la base del contenedor y carga tu seed. Después ejecuta docker compose down seguido de up y confirma que los datos siguen ahí: eso demuestra que el volumen funciona.',
        'Ejecuta docker compose down -v y vuelve a levantar. Ahora los datos deben haber desaparecido. Haber visto las dos cosas te deja clara para siempre la diferencia entre parar y destruir.',
        'Haz la prueba definitiva: clona tu repositorio en otra carpeta como si fueras otra persona, crea el .env a partir del .env.example y levanta todo. Si funciona a la primera siguiendo solo el README, tu proyecto está listo para que alguien más lo vea.'
      ],
      vet: [
        'Añade al README de VetCare una sección de arranque rápido con exactamente tres pasos: clonar, copiar .env.example a .env con tus valores, y docker compose up. Nada más.',
        'Añade un servicio opcional de pgadmin o adminer al compose si te resulta cómodo inspeccionar la base, pero déjalo en un perfil separado para que no arranque siempre.'
      ],
      edge: [
        'Dentro de la red de compose los servicios se llaman por su nombre de servicio, no localhost: la API se conecta a Host=db. localhost dentro de un contenedor es ese mismo contenedor.',
        'depends_on sin condition solo espera a que el contenedor arranque, no a que el servicio esté listo. PostgreSQL tarda unos segundos en aceptar conexiones, así que sin healthcheck tu API fallará al arrancar de forma intermitente.',
        'docker compose down -v borra los volúmenes y con ellos la base de datos entera. Es la forma más común de perder datos de desarrollo sin querer: acostúmbrate a escribir down a secas.'
      ],
      quiz: [
        { q: '¿Por qué la API se conecta a Host=db y no a Host=localhost?', a: 'Porque compose crea una red donde cada servicio es resoluble por su nombre, y dentro de un contenedor localhost se refiere a ese contenedor, no a la máquina anfitriona. db es el nombre DNS del servicio de PostgreSQL dentro de esa red.' },
        { q: '¿Qué problema resuelve un healthcheck que depends_on por sí solo no resuelve?', a: 'depends_on solo garantiza el orden de arranque de los contenedores, no que el proceso de dentro esté listo. El healthcheck comprueba que el servicio responde de verdad, y con condition service_healthy la API espera a que PostgreSQL acepte conexiones en vez de fallar en el arranque.' },
        { q: '¿Por qué la base de datos necesita un volumen?', a: 'Porque la capa de escritura de un contenedor desaparece cuando lo borras. Un volumen vive fuera del ciclo de vida del contenedor, así que puedes reconstruir la imagen y recrear el contenedor sin perder los datos.' },
        { q: '¿Qué diferencia hay entre docker compose down y docker compose down -v?', a: 'down para y elimina los contenedores y la red, pero conserva los volúmenes y por tanto los datos. down -v elimina también los volúmenes, lo que significa borrar la base de datos completa.' }
      ],
      out: 'docker compose up levanta base, API y web funcionando, con datos que sobreviven al reinicio, verificado desde un clon limpio.',
      file: 'compose.yaml'
    },
    {
      t: 'CI: que la máquina verifique por ti en cada push',
      obj: 'Montar un pipeline que compile, pase los tests contra una base real y audite dependencias en cada cambio, sin que tengas que acordarte.',
      why: 'Es lo que convierte tus tests de la semana 13 en una red de seguridad real. Un test que solo corre cuando te acuerdas no protege nada. Además, un repositorio con una insignia verde de CI comunica profesionalidad antes de que nadie lea una línea de tu código.',
      study: { r: 3, what: 'Lee la página de about workflows de GitHub Actions. Unos 12 minutos. Quédate con la jerarquía: un workflow tiene jobs, cada job corre en una máquina limpia, y cada job tiene steps en orden. Los jobs son paralelos por defecto salvo que declares que uno necesita a otro.',
        pasos: [
          'Lee "About workflows" y "Workflow basics" (~5 min): workflow, jobs, steps y runners.',
          'Lee "Workflow triggers" (~3 min): push, pull_request y ejecución manual.',
          'Escribe la jerarquía de tu pipeline antes de escribir el YAML: qué jobs, en qué orden y cuál necesita a cuál.',
          'Decide qué se ejecuta en cada pull request y qué solo en main.'
        ] },
      ex: {
        title: '.github/workflows/ci.yml para VetCare',
        body: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  backend:
    runs-on: ubuntu-latest
    # Los tests de integración levantan su propio PostgreSQL con
    # Testcontainers (semana 13). ubuntu-latest ya trae Docker, así que
    # no hace falta declarar la base aquí.
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'

      - name: Restaurar
        run: dotnet restore

      - name: Compilar
        run: dotnet build --no-restore -c Release

      - name: Formato
        run: dotnet format --verify-no-changes

      - name: Tests
        run: dotnet test --no-build -c Release --logger "trx;LogFileName=test.trx"

      - name: Dependencias vulnerables
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
      - run: npx tsc -b              # tipos ("tsc --noEmit" a secas no mira nada en un proyecto de Vite)
      - run: npm run build
      - run: npm audit --audit-level=high --omit=dev

  imagen:
    needs: [backend, frontend]      # solo si los dos pasaron
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t vetcare-api:\${{ github.sha }} .`
      },
      steps: [
        'Crea .github/workflows/ci.yml con el job de backend. Haz push y mira la ejecución en la pestaña Actions del repositorio. Lo normal es que falle la primera vez: eso es información, no un fracaso.',
        'Arregla lo que falle hasta que el job esté verde. Fallos típicos: dotnet format encuentra archivos sin formatear (ejecuta dotnet format en local y vuelve a subir) o los tests de integración no encuentran database/migrations porque la ruta relativa cambia. Testcontainers funciona en GitHub sin hacer nada: el runner ya tiene Docker.',
        'Añade el job de frontend con comprobación de tipos, build y auditoría. Son tres comprobaciones que tardan menos de un minuto y atrapan la mayoría de los errores tontos.',
        'Añade el job de imagen con needs para que solo se construya si backend y frontend pasaron. Mira en la interfaz el grafo de dependencias entre jobs: es la forma visual de ver qué se paraleliza y qué espera.',
        'Rompe algo a propósito, por ejemplo cambia una assertion de un test, y haz push en una rama. Comprueba que el pipeline se pone rojo y que la pull request te avisa. Un CI que nunca has visto fallar no sabes si funciona.'
      ],
      vet: [
        'Protege la rama main en la configuración del repositorio exigiendo que CI pase antes de poder integrar. Es lo que convierte el pipeline de informativo en obligatorio.',
        'Añade la insignia de estado del workflow al principio del README de VetCare, con el enlace a Actions.'
      ],
      edge: [
        'Cada job arranca en una máquina limpia: no comparte sistema de archivos con los demás salvo que uses artefactos. Si un job compila y otro espera encontrar los binarios, no los va a encontrar.',
        'Cachea las dependencias pero nunca los resultados de los tests. Un cache mal configurado puede hacer que el pipeline pase con código viejo, que es la peor forma posible de falso verde.',
        'Los secretos van en los secrets del repositorio y se referencian con la sintaxis de secrets, nunca escritos en el yaml. Y recuerda que el yaml del workflow es público en un repositorio público.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre un job y un step?', a: 'Un job es una unidad que corre en su propia máquina limpia y puede ejecutarse en paralelo con otros; un step es un comando dentro de un job y se ejecuta en orden compartiendo el mismo sistema de archivos. Por eso dos steps pueden pasarse archivos y dos jobs no, salvo con artefactos.' },
        { q: '¿Por qué en CI los tests usan un PostgreSQL de verdad (con Testcontainers) en vez de un mock de la base?', a: 'Porque los tests de integración que de verdad protegen comprueban comportamiento de la base: constraints, transacciones, el EXCLUDE de solape. Contra un mock pasarían siempre y no te dirían nada; contra una base real reproducen lo que pasará en producción.' },
        { q: '¿Para qué sirve needs entre jobs?', a: 'Para declarar que un job solo debe ejecutarse si otros terminaron bien. Sin needs todos los jobs arrancan a la vez, lo que es rápido, pero no tiene sentido construir y publicar una imagen si los tests fallaron.' },
        { q: '¿Por qué hacer que el pipeline falle ante una dependencia vulnerable en vez de solo mostrarlo?', a: 'Porque una advertencia que no bloquea se ignora al tercer día. Si falla, seguir adelante exige una decisión explícita de alguien, y esa decisión queda registrada en lugar de diluirse entre notificaciones.' }
      ],
      out: 'Pipeline verde con tres jobs, tests corriendo contra PostgreSQL real, auditoría integrada y main protegida.',
      file: '.github/workflows/ci.yml'
    },
    {
      t: 'Entrega y reproducibilidad (examen de la semana)',
      obj: 'Demostrar que cualquiera puede clonar VetCare y tenerlo corriendo, y dejar escrito cómo se despliega y cómo se vuelve atrás.',
      why: 'La pregunta "¿cómo se despliega tu proyecto?" aparece en casi toda entrevista de nivel intermedio. Responderla con un documento y una demostración reproducible en vez de con una explicación vaga te coloca en otra categoría.',
      study: { r: 2, what: 'Relee tu propio README con ojos de alguien que no conoce el proyecto. Unos 10 minutos. No busques errores de redacción: busca los pasos que das por supuestos porque tú ya los tienes hechos. Esos son los que hacen que otro abandone.',
        pasos: [
          'Clona tu repositorio en una carpeta nueva, como si fueras otra persona.',
          'Sigue tu README al pie de la letra, sin usar nada que no esté escrito.',
          'Apunta cada paso en el que te atasques o tengas que adivinar.',
          'Corrige el README con esos pasos y repite hasta que el clon funcione sin ayuda.'
        ] },
      ex: {
        title: 'docs/despliegue.md: el documento que te preguntan',
        body: `# Despliegue de VetCare

## Entornos
| Entorno    | Dónde            | Base de datos        | Quién despliega |
|------------|------------------|----------------------|-----------------|
| Local      | docker compose   | contenedor           | cualquiera      |
| Pruebas    | servidor único   | PostgreSQL gestionado| CI en main      |
| Producción | servidor único   | PostgreSQL gestionado| manual          |

## Requisitos
- Docker 24+ y Docker Compose v2
- Variables: DB_PASSWORD, JWT_CLAVE  (ver .env.example)

## Arranque local
    git clone <url> && cd vetcare
    cp .env.example .env     # rellenar valores
    docker compose up -d --build
    # API  http://localhost:8080/health/ready
    # Web  http://localhost:5173

## Migraciones
Se aplican ANTES de arrancar la versión nueva, siguiendo
expand/contract (semana 10): primero se añade, se despliega el
código que usa lo viejo y lo nuevo, y solo después se quita.
Así un rollback de código nunca deja la base incompatible.

    ./database/migrar.sh     # el script de la semana 10, apuntando a la
                             # base de ese entorno (PGHOST, PGUSER...)

## Despliegue
1. CI verde en main
2. Construir imagen etiquetada con el sha del commit
3. Aplicar migraciones (solo expand)
4. Arrancar la versión nueva
5. Verificar /health/ready y un caso de uso real
6. Si falla -> rollback

## Rollback
    docker compose up -d --no-deps api   # con la etiqueta anterior
Las migraciones NO se revierten: por eso solo se despliegan
cambios de esquema compatibles hacia atrás.

## Qué vigilar tras desplegar
- /health/ready en verde
- Errores 5xx en los registros durante 10 minutos
- Una cita creada de punta a punta

## Riesgos conocidos
- Un solo servidor: hay corte durante el despliegue. Aceptado.
- Sin copias de seguridad automatizadas. PENDIENTE, prioridad alta.`
      },
      steps: [
        'Haz la prueba de la carpeta limpia en serio: clona el repositorio en una ruta nueva, no copies nada de tu carpeta actual y sigue tu README al pie de la letra sin improvisar. Cada vez que tengas que hacer algo que no está escrito, páralo y anótalo.',
        'Corrige el README hasta que la prueba funcione de principio a fin sin ningún paso improvisado. Esta es la verificación real de la semana; el resto son medios para llegar aquí.',
        'Escribe docs/despliegue.md completo siguiendo el ejemplo: entornos, requisitos, arranque, migraciones, pasos de despliegue, rollback, qué vigilar después y riesgos conocidos.',
        'Comprueba la lista de la semana: historial con mensajes legibles, .gitignore cubriendo secretos, un conflicto resuelto, Dockerfile multietapa sin root, .dockerignore, compose con healthchecks y volumen, CI verde con tests contra PostgreSQL, auditoría de dependencias en CI, main protegida, README con arranque en tres pasos y despliegue documentado.',
        'Simula un rollback: despliega localmente la imagen etiquetada con el commit anterior y comprueba que la aplicación sigue funcionando contra la misma base. Si no funciona, tu última migración no era compatible hacia atrás y eso es justo lo que querías descubrir aquí y no en producción.',
        'Explica en voz alta, en tres minutos, cómo se despliega VetCare y qué harías si el despliegue sale mal. Si te trabas, el documento todavía no está terminado.'
      ],
      vet: [
        'Añade al README el índice de los documentos que llevas: requirements, domain-model, api-contract, testing, resiliencia, arquitectura, adr, frontend, seguridad, modelo-amenazas, dependencias, despliegue y contributing. Ese índice es tu portafolio.',
        'Etiqueta este punto del repositorio con git tag -a v0.1.0 -m "VetCare con despliegue reproducible" y empuja la etiqueta. Es tu primer hito versionado.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/despliegue.md dentro de una semana.'
      ],
      edge: [
        'Un README que funciona hoy en tu máquina y falla en una limpia es un README que no has probado. La prueba del clon limpio es la única que vale.',
        'Las migraciones no se revierten en un rollback real: revertir un cambio de esquema con datos dentro es peligroso y a menudo imposible. Por eso expand/contract no es una elegancia académica sino la condición que hace posible volver atrás.',
        'Automatizar un despliegue que no entiendes a mano es automatizar un problema. Haz el proceso manualmente al menos una vez entendiendo cada paso antes de ponerlo en un script.'
      ],
      quiz: [
        { q: '¿Por qué la prueba del clon limpio es la verificación que importa?', a: 'Porque en tu máquina ya tienes instalado, configurado y arrancado todo lo que el README da por supuesto, así que no puedes detectar los pasos que faltan. Un clon limpio no tiene ninguna de esas suposiciones y revela exactamente dónde se atascaría otra persona.' },
        { q: '¿Por qué las migraciones no se revierten en un rollback?', a: 'Porque revertir un cambio de esquema con datos ya escritos puede ser destructivo o directamente imposible. La solución es desplegar solo cambios compatibles hacia atrás con expand/contract, de forma que la versión anterior del código siga funcionando contra el esquema nuevo.' },
        { q: '¿Qué debería incluir como mínimo un documento de despliegue?', a: 'Los entornos y quién despliega en cada uno, los requisitos y variables necesarias, los pasos ordenados incluida la migración, el procedimiento de rollback, qué verificar después de desplegar y los riesgos conocidos que se aceptan.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que un proyecto no está terminado cuando funciona en tu máquina sino cuando cualquiera puede reproducirlo sin ti, y que git, Docker y CI son precisamente las tres herramientas que convierten tu conocimiento implícito en instrucciones que una máquina puede seguir y verificar sola.' }
      ],
      out: 'Clon limpio funcionando siguiendo solo el README, docs/despliegue.md completo, rollback probado y etiqueta v0.1.0 publicada.',
      file: 'docs/despliegue.md'
    }
  ]
}
]);
