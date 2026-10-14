# VetCare · Ruta de estudio

Veinticuatro semanas para pasar de escribir código a diseñar, operar y defender un sistema.
Un proyecto que te acompaña todo el camino: **VetCare**, el software de una clínica veterinaria.

## Cómo se usa

Abre `index.html` en el navegador. Eso es todo.

La aplicación te muestra **un solo día**. Dentro del día, **una sola etapa**. Cuando cierras el
día aparece el siguiente, y no antes. No hay botón para adelantarse ni para marcar "esto ya lo sé":
es deliberado, porque la única forma de que la ruta funcione es no saltarse nada.

Cada día son siete etapas en este orden:

1. **Por qué hoy** — qué vas a conseguir, para qué sirve en un trabajo real, por qué es tan importante y qué archivo tendrás al terminar
2. **Estudia la fuente** — el enlace exacto (en inglés), qué buscar dentro y un **paso a paso** con las secciones concretas que leer y los minutos de cada una
3. **Mira el ejemplo** — un caso resuelto completo, con código real
4. **Hazlo tú** — los pasos marcables; hay que marcar todos para seguir. Cada paso tiene una **pista** desplegable: cómo empezar, un ejemplo concreto y cómo comprobar que quedó bien
5. **Llévalo a VetCare** — cómo se aplica a tu proyecto, dónde falla casi todo el mundo y **qué preguntar en el trabajo** (al cliente, al equipo o al tech lead), con lo que deberías obtener de cada pregunta y un ejemplo de cómo *no* preguntar
6. **Comprueba que lo sabes** — las preguntas; las que respondas *No del todo* van a Repaso
7. **Cierra el día** — el entregable, el archivo donde vive y tu nota

## Las cuatro vistas

| Vista | Para qué |
|---|---|
| **Hoy** | Lo único que necesitas mirar. El día actual y nada más |
| **Mapa** | El recorrido completo. Lo hecho se puede releer; lo bloqueado no se ve |
| **Repaso** | Las preguntas que no supiste vuelven al día siguiente y, si las aciertas, a los 3, 7 y 14 días. También los días que marcaste para releer |
| **Notas** | Todo lo que escribiste con tus palabras, junto |

## Qué contiene

- **24 semanas · 144 días · 577 preguntas** de autoevaluación con respuesta explicada
- **14 fases**: requisitos, modelado de dominio, C# y OOP, diseño y SOLID, bases de datos,
  backend y APIs, calidad y testing, arquitectura, frontend, seguridad, DevOps, rendimiento,
  observabilidad y diseño de sistemas
- Un recurso canónico real por tema (Microsoft Learn, PostgreSQL, MDN, Martin Fowler, OWASP,
  Google SRE Book, OpenTelemetry, react.dev, Pro Git, web.dev…) con una explicación en español
  de qué leer y por qué
- Un ejemplo trabajado por día: código, consultas, planes de ejecución, ficheros de CI,
  plantillas de documento
- El sexto día de cada semana es un **examen**: defiendes lo aprendido produciendo un documento

## Stack

C# / .NET 10 · PostgreSQL 17 · ASP.NET Core · EF Core · React · TypeScript · Vite · xUnit ·
Docker · GitHub Actions · OpenTelemetry

## Si te equivocas

- Si marcas un día como completado por error, puedes **reabrirlo** durante las 24 horas siguientes desde la vista Hoy.
- Si respondes mal a "¿La tenías?", el botón **Cambiar** deja volver a contestar.

## Accesibilidad y tema

- Todo se puede usar con teclado: Tab para moverse, Enter o Espacio para marcar pasos y abrir semanas.
- El tema claro u oscuro sigue al de tu sistema hasta que lo cambies con el botón ◐.

## Tu progreso

Se guarda solo en `localStorage` de este navegador. Desde el menú `···`:

- **Guardar copia** descarga un JSON con todo (progreso, notas, repaso)
- **Restaurar copia** lo vuelve a cargar, aquí o en otro ordenador
- **Borrar mi progreso** empieza de cero

Haz una copia de vez en cuando. Si limpias los datos del navegador, se pierde.

## Estructura

```
index.html        la aplicación
styles.css        la interfaz
app.js            el bloqueo progresivo y las vistas
contenido/        las 24 semanas, un archivo por bloque
                  uso_*.js: para qué sirve cada día y qué preguntar en el trabajo
                  pistas_*.js: una pista por cada paso de «Hazlo tú»
README.md
```

El contenido está separado de la aplicación a propósito: cada archivo de `contenido/` añade
semanas a `window.WEEKS` y se puede leer o corregir sin tocar el código.
