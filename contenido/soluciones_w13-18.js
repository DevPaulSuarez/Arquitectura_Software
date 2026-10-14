/* Solución de referencia de cada examen semanal (día 6), semanas 13 a 18. */
window.SOLUCIONES = Object.assign(window.SOLUCIONES || {}, {

'w13d6': {
  intro: 'Un docs/testing.md terminado: la política de pruebas, el mapa de reglas cubiertas, los resultados medidos (10 vueltas, tiempos, mutaciones) y el checklist. Fíjate en que una mutación sobrevivió y se cerró con un test nuevo: eso es lo normal y lo valioso.',
  body: `# VetCare - Testing

## 1. Política
- Reglas de negocio: test unitario siempre (dominio, sin E/S).
- Endpoints: un test de integración por código de estado prometido,
  contra PostgreSQL real con Testcontainers.
- No se prueban: getters, mapeos triviales ni el framework.
- Nombres: Metodo_Cuando_Entonces.

## 2. Reglas y sus tests
| Regla                                  | Test                                              |
|----------------------------------------|---------------------------------------------------|
| RN-01 Toda mascota tiene dueño         | Crear_CuandoDuenoVacio_LanzaExcepcion             |
| RN-02 Polivalente desde 8 semanas      | RegistrarVacuna_CuandoTiene6Semanas_Rechaza       |
| RN-03 Sin solapes por veterinario      | Agendar_CuandoSolapaParcialmente_LanzaHorarioOcupado |
|                                        | Agendar_CuandoEsContigua_Acepta                   |
| RN-04 Duración entre 15 y 120 min      | Agendar_CuandoDuracionInvalida_Lanza (Theory x4)  |
| RN-05 Solo se cancelan confirmadas     | Cancelar_CuandoYaEstaCancelada_LanzaExcepcion     |
| RN-06 Recargo con menos de 24 h        | Cancelar_CuandoFaltanMenosDe24h_MarcaRecargo      |
| RN-07 Refuerzo de rabia a 12 meses     | Proxima_CuandoRabiaHace11Meses_DevuelveRabiaEn1Mes|
| 409 en la API                          | PostCita_CuandoSolapa_Devuelve409                 |
| 422 en la API                          | PostCita_CuandoDuracion0_Devuelve422ConCampo      |

## 3. Mediciones
Estabilidad: 10 vueltas seguidas de dotnet test -> 10/10 verdes.
  (Antes: 9/10. El test de paginación fallaba porque dos citas tenían
  el mismo inicio y el orden no era estable. Arreglo: ORDER BY inicio, id.)
Velocidad: VetCare.Domain.Tests, 64 tests en 0,41 s.
           VetCare.Api.Tests, 14 tests en 11 s (arranque del contenedor incluido).

## 4. Mutaciones manuales
| Mutación                                   | ¿La detectó la suite?                        |
|--------------------------------------------|----------------------------------------------|
| c.Inicio < fin  ->  c.Inicio <= fin        | SÍ: Agendar_CuandoEsContigua_Acepta          |
| duracion < 15   ->  duracion < 10          | SÍ: Theory con 10 minutos                    |
| quitar el throw de Cancelar en cancelada   | NO -> faltaba el test. Añadido               |
|                                            | Cancelar_CuandoYaEstaCancelada_LanzaExcepcion|

## 5. Checklist
[x] Pasan en cualquier orden (10 vueltas)  [x] Unitarios < 2 s (0,41 s)
[x] Sin DateTime.Now ni Thread.Sleep        [x] Sin if ni bucles en los tests
[x] Nombres Metodo_Cuando_Entonces          [x] Cada regla con su test
[x] Un test por código de estado            [x] Mutaciones detectadas
[x] Ningún test comentado ni con Skip

## 6. Defensa (5 minutos)
Testeo reglas de dominio con unitarios rápidos y la API con integración
real. No testeo lo que no puede fallar por mi culpa. Sé que la suite
sirve porque detecta mutaciones (y cuando no detectó una, la cerré),
porque es estable en 10 vueltas y porque corre lo bastante rápido como
para ejecutarla antes de cada commit.`
},

'w14d6': {
  intro: 'Un docs/resiliencia.md con los cuatro experimentos ejecutados y sus resultados reales, incluido uno que falló y cómo se arregló, más el test de idempotencia. Que una hipótesis falle no es un suspenso: es exactamente lo que el ejercicio debe descubrir.',
  body: `# VetCare - Resiliencia

## Matriz de dependencias
| Dependencia | Crítica | Si falla                       | El usuario ve                         |
|-------------|---------|--------------------------------|---------------------------------------|
| PostgreSQL  | SÍ      | 503 + Retry-After              | "Servicio no disponible, reintenta"   |
| Correo      | NO      | Se encola en outbox            | Cita creada + aviso "confirmación más tarde" |
| SMS         | NO      | Se omite, log Warning          | Nada                                  |

## Experimento 1 - Base de datos caída
Hipótesis: POST /citas -> 503 en < 11 s; ready 503; live 200.
Resultado: POST tardó 15,2 s y devolvió 500.        <- FALLÓ
Causa: el timeout de conexión de Npgsql era 15 s y la excepción
NpgsqlException no estaba traducida.
Arreglo: "Timeout=3" en la cadena de conexión y el manejador de
errores traduce NpgsqlException a 503 con Retry-After: 30.
Repetido: 503 en 3,1 s. ready 503, live 200.         <- OK

## Experimento 2 - Correo lento (30 s)
Hipótesis: 201 en < 3 s, correo en outbox, respuesta con aviso.
Resultado: 201 en 140 ms; fila en mensaje_outbox; avisos = ["La
confirmación por correo llegará en unos minutos"].  <- OK

## Experimento 3 - Correo caído de forma sostenida
Hipótesis: primeras ~1 s; luego < 10 ms con BrokenCircuitException;
un intento Half-Open a los 15 s.
Resultado (30 envíos desde el procesador del outbox):
  envíos 1-6:  entre 0,9 y 1,3 s (reintentos con backoff)
  envíos 7-30: entre 1 y 3 ms, BrokenCircuitException
  a los 15 s:  "Circuit breaker half-open" en el log, 1 intento
  servidor falso cambiado a 200 -> "closed"             <- OK

## Experimento 4 - Reintento del cliente
Dos POST con Idempotency-Key: abc-123 y el mismo cuerpo.
Resultado: 201 con id 3f2a... en los dos. SELECT count(*) = 1. <- OK

## Test añadido a la suite
[Fact]
public async Task PostCita_ConMismaIdempotencyKey_CreaUnaSolaCita()
{
    var cliente = _factory.CreateClient();
    cliente.DefaultRequestHeaders.Add("Idempotency-Key", Guid.NewGuid().ToString());
    var dto = CitaValida();

    var r1 = await cliente.PostAsJsonAsync("/api/v1/citas", dto);
    var r2 = await cliente.PostAsJsonAsync("/api/v1/citas", dto);

    var c1 = await r1.Content.ReadFromJsonAsync<CitaResponse>();
    var c2 = await r2.Content.ReadFromJsonAsync<CitaResponse>();
    c1!.Id.Should().Be(c2!.Id);
    (await ContarCitas(dto.MascotaId, dto.Inicio)).Should().Be(1);
}

## Checklist de defensa (con dónde se cumple)
[x] Timeouts justificados ......... ClienteCorreo.cs (5 s), cadena (Timeout=3)
[x] CancellationToken de punta a punta  endpoints -> casos de uso -> EF
[x] Reintentos solo 408/429/5xx ... ReintentosTests (2 tests)
[x] Breaker por dependencia ........ AddResilienceHandler("correo")
[x] Idempotency-Key en POST /citas . test anterior
[x] Efectos externos por outbox ..... EncolarConfirmacion + ProcesadorOutbox
[x] Matriz escrita .................. arriba
[x] ready solo con críticas ......... solo "postgres"
[x] Fallbacks con Warning y métrica . vetcare.fallbacks{dependencia}
[x] Cuatro experimentos ............. arriba`
},

'w15d6': {
  intro: 'Los ADR 005 a 008 completos (el 004 ya está en el ejemplo del día). Cada uno tiene al menos dos alternativas descartadas, consecuencias negativas reales y una verificación concreta.',
  body: `# ADR-005: Casos de uso explícitos en VetCare.Application
Estado: Aceptada
Contexto: los endpoints mezclaban HTTP, orquestación y reglas. POST
/citas tenía 70 líneas y no se podía reutilizar desde otro sitio.
Decisión: cada operación de escritura es un caso de uso en
VetCare.Application (comando + resultado + interfaz IAgendarCita).
El endpoint solo traduce HTTP <-> comando.
Alternativas:
  1. Lógica en los endpoints. Descartada: no reutilizable y difícil de
     probar sin levantar la API.
  2. MediatR para todo. Descartada: añade una dependencia y una
     indirección que no necesito con una decena de casos de uso.
Consecuencias: + reutilizable (la CLI usa el mismo caso de uso), +
pruebas sin HTTP. − un proyecto más y más archivos por operación.
Verificación: VetCare.Cli agenda una cita sin pasar por HTTP; los
endpoints de escritura tienen menos de 15 líneas.

# ADR-006: CQRS ligero, lecturas proyectadas directas
Estado: Aceptada
Contexto: la agenda cargaba agregados Cita completos para mostrar 6
columnas: 3 consultas y 12 ms por petición.
Decisión: las escrituras pasan por el dominio; las lecturas se
proyectan con Select directo sobre el DbContext a DTOs de lectura
(interfaces en Application, implementación en Infrastructure).
Alternativas:
  1. Leer siempre por el repositorio. Descartada: medido, 12 ms frente
     a 2 ms, y el repositorio crecía con métodos de pantalla.
  2. Base de lectura separada. Descartada: sincronización y operación
     extra sin un volumen que lo justifique.
Consecuencias: + lecturas rápidas y simples. − dos caminos que conocer;
una lectura que necesite una regla debe ir por el dominio.
Verificación: EXPLAIN ANALYZE de la agenda en docs/arquitectura.md;
las consultas viven solo en Infrastructure/Consultas.

# ADR-007: Eventos de dominio despachados antes del commit
Estado: Aceptada
Contexto: AgendarCita llamaba al outbox, a estadísticas y a la
agenda del veterinario; cada reacción nueva lo engordaba.
Decisión: las entidades registran eventos (CitaAgendada...) y un
despachador los entrega a sus manejadores justo antes de
SaveChangesAsync, dentro de la misma transacción.
Alternativas:
  1. Llamadas directas en el caso de uso. Descartada: acopla el caso de
     uso a cada reacción.
  2. Despachar después del commit. Descartada: si el proceso cae entre
     el commit y el despacho, la reacción se pierde. Lo externo ya va
     por outbox (ADR del outbox, semana 14).
Consecuencias: + añadir una reacción = un manejador nuevo. − el flujo
es menos visible al leer el caso de uso; un manejador lento alarga la
transacción.
Verificación: test Agendar_RegistraCitaAgendada; test de integración
que comprueba que la cita y su mensaje de outbox se guardan juntos.

# ADR-008: Monolito modular, no microservicios
Estado: Aceptada
Contexto: VetCare tiene cuatro capacidades (Agenda, Clínica,
Clientes, Facturación), un equipo de una persona y una sola base.
Decisión: una sola aplicación desplegable con cuatro módulos. Cada
módulo expone un contrato público pequeño (IClinicaPublica...) y no
lee las tablas de otro.
Alternativas:
  1. Microservicios por capacidad. Descartada: red, despliegues,
     observabilidad y consistencia distribuida para un problema que no
     tengo; el equipo es de una persona.
  2. Monolito sin módulos. Descartada: todo acaba dependiendo de todo y
     después no se puede extraer nada.
Consecuencias: + un despliegue, transacciones locales, depuración
simple. − la disciplina de fronteras depende de revisiones y tests, no
de la red; un módulo no escala por separado.
Verificación: test que falla si un módulo referencia el namespace
interno de otro; revisión mensual de JOIN entre módulos (hoy: 2).
Señal para cambiar: un módulo que necesite escalar o desplegarse con
otro ritmo que el resto.`
},

'w16d6': {
  intro: 'Una Agenda.tsx terminada con los cuatro estados, la búsqueda derivada, el filtro, el detalle por id y la cancelación, más las notas de la revisión. Compárala con la tuya mirando sobre todo el estado mínimo: aquí solo hay cuatro useState.',
  body: `// web/src/paginas/Agenda.tsx
import { useState } from "react";
import type { Cita, EstadoCita } from "../tipos";
import { useCitasDelDia } from "../hooks/useCitasDelDia";
import { cancelarCita } from "../api/citas";
import { TablaCitas } from "../componentes/TablaCitas";
import { PanelDetalle } from "../componentes/PanelDetalle";
import { FormularioNuevaCita } from "../componentes/FormularioNuevaCita";

type Filtro = EstadoCita | "todas";

export function Agenda() {
  const [dia, setDia] = useState(() => new Date().toISOString().slice(0, 10));
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [texto, setTexto] = useState("");
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const { datos, cargando, error, recargar } = useCitasDelDia(dia);

  // Derivado: nada de esto es estado
  const q = texto.trim().toLowerCase();
  const visibles = datos
    .filter((c) => filtro === "todas" || c.estado === filtro)
    .filter((c) => !q || c.mascotaNombre.toLowerCase().includes(q)
                      || c.duenoNombre.toLowerCase().includes(q));
  const seleccionada: Cita | undefined = datos.find((c) => c.id === seleccionadaId);

  async function cancelar(id: string) {
    if (!window.confirm("¿Cancelar esta cita?")) return;
    await cancelarCita(id);
    recargar();
  }

  return (
    <main>
      <h1>Agenda</h1>
      <label htmlFor="dia">Día</label>
      <input id="dia" type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
      <label htmlFor="buscar">Buscar mascota o dueño</label>
      <input id="buscar" value={texto} onChange={(e) => setTexto(e.target.value)} />
      <label htmlFor="estado">Estado</label>
      <select id="estado" value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)}>
        <option value="todas">Todas</option>
        <option value="confirmada">Confirmadas</option>
        <option value="atendida">Atendidas</option>
        <option value="cancelada">Canceladas</option>
      </select>

      {cargando && <EsqueletoTabla filas={5} />}

      {!cargando && error && (
        <div role="alert">
          <p>No se pudo cargar la agenda. Comprueba la conexión.</p>
          <button onClick={recargar}>Reintentar</button>
        </div>
      )}

      {!cargando && !error && visibles.length === 0 && (
        <p>
          {datos.length === 0
            ? "No hay citas este día. Puedes agendar la primera con el formulario."
            : "Ninguna cita coincide con la búsqueda o el filtro."}
        </p>
      )}

      {!cargando && !error && visibles.length > 0 && (
        <TablaCitas citas={visibles} seleccionadaId={seleccionadaId}
                    onSeleccionar={setSeleccionadaId} onCancelar={cancelar} />
      )}

      {seleccionada && <PanelDetalle key={seleccionada.id} cita={seleccionada} />}
      <FormularioNuevaCita dia={dia} onCreada={recargar} />
    </main>
  );
}

// docs/frontend.md - Revisión de la agenda
Funcionalidad: los 7 puntos hechos.
Cuatro estados: cargando (esqueleto), error (role="alert" + reintentar),
  vacío (distingue "no hay citas" de "no coincide"), con datos.
Estado: 4 useState (dia, filtro, texto, seleccionadaId). Quité 3:
  citasFiltradas, total y citaSeleccionada (se derivan).
TypeScript: npx tsc -b sin errores; grep ": any" -> 0.
Prueba manual:
  1 backend apagado -> error + reintentar ............ OK
  3 cita solapada -> "Ese horario ya está ocupado" ..... OK
  6 búsqueda sin resultados -> texto útil .............. OK
  7 Tab: el botón "Cancelar" de cada fila no tenía texto
    accesible ("X"). Arreglo: aria-label="Cancelar cita de Rocky".`
},

'w17d6': {
  intro: 'Un docs/frontend.md con las cinco secciones del entregable. Está pensado para que alguien que no conoce el proyecto entienda cómo se gestionan los datos y por qué.',
  body: `# VetCare web - Decisiones de frontend

## 1. Query keys
| Key                                  | Datos                     | staleTime | Por qué                          |
|--------------------------------------|---------------------------|-----------|----------------------------------|
| ["citas", dia]                       | agenda de un día          | 30 s      | cambia a menudo; varios usuarios |
| ["mascota", id]                      | ficha                     | 5 min     | casi nunca cambia                |
| ["mascota", id, "historial"]         | visitas y vacunas         | 1 min     | cambia tras cada visita          |
| ["veterinarios"]                     | lista para selectores     | 1 h       | cambia una vez al año            |
| ["sesion"]                           | usuario conectado         | infinito  | solo cambia al entrar o salir    |
Regla: la key incluye TODO lo que cambia el resultado (el día, el id).

## 2. Invalidaciones
| Mutación          | Invalida                                         |
|-------------------|--------------------------------------------------|
| Crear cita        | ["citas"]                                        |
| Cancelar cita     | ["citas"]  (optimista sobre ["citas", dia])      |
| Registrar visita  | ["citas"], ["mascota", id, "historial"]          |
| Editar mascota    | ["mascota", id], ["citas"] (muestra su nombre)   |

## 3. Optimista o con espera
| Operación        | Modo       | Motivo                                           |
|------------------|------------|--------------------------------------------------|
| Cancelar cita    | Optimista  | casi nunca falla; deshacer es trivial            |
| Crear cita       | Espera     | el servidor decide el id y puede responder 409   |
| Registrar visita | Espera     | dato clínico: el usuario debe ver que se guardó  |
Rollback probado con el backend apagado: la fila vuelve a "confirmada"
y aparece "No se pudo cancelar. Inténtalo de nuevo".

## 4. Rutas y URL
/                          agenda (?dia=2026-10-10&estado=confirmada&q=rocky)
/mascotas/:id              ficha e historial
/login                     acceso
*                          página no encontrada
errorElement en el Layout  error inesperado con botón para volver
La búsqueda usa replace: true (no llena el historial letra a letra).

## 5. Rendimiento percibido: los tres umbrales
0,1 s  se siente instantáneo -> cancelar es optimista.
1 s    no se pierde el hilo  -> cambiar de día mantiene la tabla
       anterior atenuada (keepPreviousData).
10 s   se pierde la atención -> nada debe acercarse: con Slow 3G,
       crear cita tarda 4 s y el botón dice "Guardando…".
Los esqueletos aparecen solo tras 300 ms (useRetrasado): con red
rápida no hay parpadeo.

## Pruebas manuales (resultado)
1 3G .............. crear cita incómodo -> añadido "Guardando…"
2 backend apagado . la ficha de mascota mostraba una pantalla en blanco
                    -> faltaba el estado de error. Arreglado.
3 base vacía ...... textos de vacío en agenda y fichas
4 rollback ........ visible y con aviso
5 URL copiada ..... mismo resultado en ventana nueva
6 Tab ............. todo alcanzable
7 volver tras 1 min  refetchOnWindowFocus recarga la agenda`
},

'w18d6': {
  intro: 'Un docs/seguridad.md con los ocho ataques ejecutados y su resultado real, incluido uno que tuvo éxito y cómo se cerró, y los tests que lo convierten en regresión. Encontrar un fallo propio es el mejor resultado posible de esta semana.',
  body: `# VetCare - Auditoría de seguridad

| # | Ataque                     | Esperado | Resultado                    |
|---|----------------------------|----------|------------------------------|
| 1 | IDOR en mascotas, historial| 404      | mascotas 404 ✓ · historial   |
|   | facturas y citas           |          | 200 ✗ (ver abajo) · resto ✓  |
| 2 | Recepción registra visita  | 403      | 403 ✓                        |
| 3 | Token con rol cambiado     | 401      | 401 ✓ (firma inválida)       |
| 4 | 20 logins fallidos         | 429 al 6º| 429 desde el 6º ✓            |
| 5 | Enumeración de usuarios    | iguales  | cuerpo y código iguales; tiempo: |
|   |                            |          | 4 ms frente a 260 ms ✗       |
| 6 | Refresco tras cerrar sesión| 401      | 401 ✓                        |
| 7 | ' OR 1=1 -- en búsqueda    | nada     | 0 filas ✓ (SqlQueryRaw usa {0}) |
| 8 | Secretos en repo e historial| nada    | nada ✓                       |

## Lo que estaba mal y cómo lo arreglé
Ataque 1: GET /api/v1/mascotas/{id}/historial filtraba solo por id.
  El filtro por pertenencia estaba en GET /mascotas/{id}, pero no en
  el historial, que se añadió después.
  Arreglo: el filtro va en la consulta del historial:
    .Where(v => v.MascotaId == id &&
               (esPersonal || v.Mascota.Dueno.UsuarioId == usuarioId))
  y devuelve 404 si no hay resultado.
Ataque 5: con email inexistente no se calculaba ningún hash, así que
  respondía en 4 ms. Arreglo: se verifica contra un hash ficticio
  precalculado. Ahora: 255 ms frente a 260 ms.
Riesgo aceptado: el JWT de acceso sigue siendo válido hasta 15 min
  tras cerrar sesión (no se puede revocar). Mitigado con la duración
  corta y la revocación del refresco.

## Tests de regresión (tests/VetCare.Api.Tests/Seguridad)
DuenoA_HistorialDeMascotaDeB_Devuelve404       (ataque 1)
Recepcion_RegistrarVisita_Devuelve403          (ataque 2)
TokenConRolAlterado_Devuelve401                (ataque 3)
RefrescoTrasCerrarSesion_Devuelve401           (ataque 6)

[Fact]
public async Task DuenoA_HistorialDeMascotaDeB_Devuelve404()
{
    var (clienteA, _) = await CrearDuenoConMascota("a@test.com");
    var (_, mascotaB) = await CrearDuenoConMascota("b@test.com");

    var r = await clienteA.GetAsync($"/api/v1/mascotas/{mascotaB}/historial");

    r.StatusCode.Should().Be(HttpStatusCode.NotFound);
}

## Checklist final (dónde se cumple)
[x] BCrypt factor 12, nunca en logs ...... Usuario.cs
[x] Login sin enumeración, ni por tiempo . hash ficticio en ServicioLogin
[x] Cookie HttpOnly + Secure + SameSite .. EmitirSesion()
[x] Clave fuera del repo ................. user-secrets + fallo al arrancar
[x] RequireAuthorization en lo no público  grupos de endpoints
[x] Pertenencia en la consulta ........... mascotas, historial, citas, facturas
[x] Ajeno = 404 .......................... test del ataque 1
[x] Refresco con rotación y reutilización  ServicioRefresco + test
[x] Logout revoca en servidor ............ test del ataque 6
[x] Rate limiting en login ............... "login" 5/min
[x] Cinco cabeceras ...................... CabecerasSeguridad.cs
[x] HTTPS + HSTS ......................... UseHsts fuera de Development
[x] Sin secretos en repo ni historial .... ataque 8`
}

});
