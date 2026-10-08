window.WEEKS = (window.WEEKS || []).concat([
{
  n: 17,
  phase: 'Frontend',
  title: 'Datos remotos y UX: que la app se sienta rápida',
  idea: 'La agenda de la semana pasada funciona, pero cada cambio de día vuelve a pedir todo, no hay cache, y si dos pantallas necesitan las mismas citas se piden dos veces. Además, al crear una cita el usuario espera a que el servidor responda mirando un spinner. Esta semana aprendes el patrón que resuelve todo eso de golpe: tratar los datos del servidor como una cache con la que sincronizas, no como estado que tú gestionas a mano. Y aprendes a que la interfaz responda antes de que la red conteste.',
  res: [
    { t: 'TanStack Query — Overview y Important Defaults',
      u: 'https://tanstack.com/query/latest/docs/framework/react/overview',
      note: 'La librería estándar para datos de servidor en React. Lee Overview y después Important Defaults: entender los valores por defecto evita el 90% de la confusión inicial.' },
    { t: 'TanStack Query — Optimistic Updates',
      u: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
      note: 'El patrón que hace que una app se sienta instantánea. Fíjate en el bloque onMutate, onError, onSettled: ese trío es todo el patrón.' },
    { t: 'Nielsen Norman Group — Response Times: The 3 Important Limits',
      u: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      note: 'Los tres umbrales de percepción humana: 0.1s, 1s y 10s. Es el fundamento de por qué una actualización optimista cambia tanto la sensación de velocidad.' },
    { t: 'React Router — URL Values', u: 'https://reactrouter.com/start/declarative/url-values', note: 'useParams y useSearchParams: el estado que vive en la URL.' },
    { t: 'TanStack Query — Mutations', u: 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations', note: 'useMutation y cómo invalidar después de escribir.' }
  ],
  days: [
    {
      t: 'Estado de servidor vs estado de cliente',
      obj: 'Distinguir los dos tipos de estado de una aplicación y entender por qué gestionar datos remotos con useState y useEffect siempre acaba mal.',
      why: 'Es el cambio mental que separa a quien escribe React de juguete de quien escribe aplicaciones reales. Poder explicar que los datos del servidor son una cache y no estado propio es una respuesta que impresiona en entrevistas de frontend.',
      study: { r: 0, what: 'Lee Overview y después la guía Important Defaults completa (en el índice lateral, dentro de Guides & Concepts). Unos 20 minutos. Busca una cosa: por qué staleTime vale 0 por defecto y qué implica eso en la práctica.',
        pasos: [
          'Lee "Motivation" (~5 min): la lista de problemas del estado de servidor (cache, duplicados, datos caducados, paginación).',
          'Mira el ejemplo de "Enough talk, show me some code already!" (~3 min): useQuery con queryKey y queryFn.',
          'Desde el índice lateral abre Important Defaults en Guides & Concepts (~6 min).',
          'En Important Defaults fíjate en staleTime 0, en los refetch al volver a la ventana y en los 3 reintentos por defecto.',
          'Haz dos listas para VetCare: estado de servidor (citas, mascotas) y estado de cliente (fecha seleccionada, modal abierto).'
        ] },
      ex: {
        title: 'Los dos tipos de estado y por qué importa',
        body: `// ESTADO DE CLIENTE: te pertenece, nace y muere en el navegador
//   el texto del buscador, el filtro, que fila está seleccionada,
//   si el panel lateral está abierto, el tema claro u oscuro
//   -> useState. Es tuyo, tú lo controlas, siempre es la verdad.

// ESTADO DE SERVIDOR: NO te pertenece. Es una copia prestada.
//   las citas, las mascotas, los veterinarios, las facturas
//   -> no es estado, es CACHE. El original vive en PostgreSQL y
//      puede cambiar sin que tú te enteres.

// Eso cambia las preguntas que tienes que responder:
//   ¿está mi copia desactualizada?          (staleness)
//   ¿cuándo la refresco?                    (refetch)
//   ¿qué enseño mientras refresco?          (¿datos viejos o un spinner?)
//   ¿dos componentes piden lo mismo y lo pido dos veces?  (deduplicación)
//   ¿el usuario se fue y volvió: lo pido otra vez?        (cache)
// useState no responde ninguna de esas preguntas. Por eso acabas
// escribiendo 200 líneas de infraestructura a mano y con bugs.

// npm install @tanstack/react-query

// src/main.tsx
const cliente = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s: durante ese tiempo no vuelve a pedir
      retry: 2,                 // reintentos, como en la semana 14
      refetchOnWindowFocus: true,  // vuelves a la pestaña -> refresca
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={cliente}>
    <App />
  </QueryClientProvider>
);

// src/api/citas.ts  -- la capa de acceso, separada de los componentes
export async function obtenerCitas(dia: string, signal?: AbortSignal): Promise<Cita[]> {
  const r = await fetch('/api/v1/agenda?dia=' + dia, { signal });
  if (!r.ok) throw new Error('No se pudieron cargar las citas (' + r.status + ')');
  const json = await r.json() as { datos: Cita[] };   // el sobre de la semana 11
  return json.datos;
}

// src/hooks/useCitas.ts  -- 40 líneas de ayer convertidas en 6
export function useCitas(dia: string) {
  return useQuery({
    queryKey: ['citas', dia],                        // la identidad de este dato
    queryFn: ({ signal }) => obtenerCitas(dia, signal),  // cancelación incluida
  });
}

// En el componente:
const { data: citas = [], isPending, isError, error, refetch } = useCitas(dia);
// Gratis y sin escribir nada: cache, deduplicación, cancelación, reintentos,
// refresco al volver a la pestaña, y datos viejos visibles mientras refresca.

// LA QUERY KEY ES LO MÁS IMPORTANTE
//   ['citas', '2026-10-05']  y  ['citas', '2026-10-06']  son dos entradas distintas
//   cambiar el día cambia la key -> nueva consulta, la anterior queda en cache
//   invalidar ['citas'] invalida TODAS las de citas, de cualquier día`
      },
      steps: [
        'Instala @tanstack/react-query y envuelve tu App con QueryClientProvider configurando los valores por defecto del ejemplo.',
        'Crea src/api/citas.ts con las funciones de acceso puras: obtenerCitas, crearCita, cancelarCita. No deben saber nada de React.',
        'Sustituye tu hook useCitasDelDia de la semana pasada por useQuery. Borra el useEffect, el AbortController y los tres useState: ya no hacen falta.',
        'Instala las devtools con npm install @tanstack/react-query-devtools, móntalas en App y observa la cache en vivo: cambia de día varias veces y mira cómo se acumulan las entradas.',
        'Comprueba la deduplicación: monta dos componentes que llamen a useCitas con el mismo día y verifica en la pestaña Network del navegador que solo se hace una petición.'
      ],
      vet: [
        'En VetCare las query keys serán ["citas", día], ["mascota", id], ["mascotas"] y ["veterinarios"]. Escríbelas en docs/frontend.md como un contrato: una key mal escrita rompe la cache en silencio.',
        'Decide un staleTime por tipo de dato y justifícalo: los veterinarios cambian casi nunca y pueden tener minutos, las citas del día cambian a menudo y necesitan segundos.'
      ],
      edge: [
        'Una query key mal construida es la fuente de casi todos los bugs de cache. Si olvidas incluir el día en la key, todos los días comparten la misma entrada y verás las citas del lunes el martes.',
        'staleTime en 0, que es el valor por defecto, significa que cualquier montaje de componente vuelve a pedir. Es seguro pero ruidoso; sube el valor según lo que cambie cada dato.',
        'No metas en la cache de queries cosas que no vienen del servidor. El filtro o el texto del buscador son estado de cliente y deben seguir en useState.'
      ],
      quiz: [
        { q: '¿Por qué los datos del servidor no son estado del cliente?', a: 'Porque su fuente de verdad vive en la base de datos y puede cambiar sin que el navegador se entere. Lo que tienes en memoria es una copia prestada que puede quedar desactualizada, así que las preguntas relevantes son cuándo refrescarla y qué mostrar mientras tanto, no cómo guardarla.' },
        { q: '¿Qué es una query key y por qué es tan importante?', a: 'Es la identidad de un dato dentro de la cache: dos componentes con la misma key comparten la misma entrada y la misma petición. Si olvidas incluir en ella un parámetro que afecta al resultado, distintas consultas comparten entrada y se muestran datos equivocados sin ningún error visible.' },
        { q: '¿Qué significa staleTime y qué efecto tiene subirlo?', a: 'Es el tiempo durante el cual un dato recién obtenido se considera fresco y no se vuelve a pedir aunque un componente se monte de nuevo. Subirlo reduce peticiones y hace la navegación más fluida, a cambio de mostrar datos potencialmente algo más antiguos.' },
        { q: '¿Qué cosas te da useQuery que tendrías que escribir a mano con useEffect?', a: 'Cache compartida entre componentes, deduplicación de peticiones simultáneas, cancelación al desmontar o cambiar de parámetro, reintentos, refresco al volver a la pestaña y la capacidad de mostrar datos viejos mientras refresca en segundo plano. Todo eso a mano son cientos de líneas con muchas aristas.' }
      ],
      out: 'La agenda funcionando con TanStack Query, con cache visible en devtools y deduplicación comprobada.',
      file: 'web/src/hooks/useCitas.ts'
    },
    {
      t: 'Mutaciones e invalidación',
      obj: 'Escribir operaciones de escritura que dejen la cache coherente sin recargar la página ni tocar el estado a mano.',
      why: 'Es la mitad que falta: leer es fácil, lo difícil es que después de escribir todo lo demás en pantalla refleje el cambio. Dominar la invalidación evita la clase de bug más común en aplicaciones reales, que es ver datos viejos tras una acción.',
      study: { r: 4, what: 'Lee la guía de Mutations y después Query Invalidation, enlazada desde el índice lateral. Unos 18 minutos. Busca una cosa: la diferencia entre invalidar una query y actualizar su contenido manualmente con setQueryData.',
        pasos: [
          'Lee la introducción de Mutations (~4 min): useMutation, mutate y los estados isPending, isError e isSuccess.',
          'Lee "Mutation Side Effects" (~4 min): onSuccess, onError y onSettled.',
          'Lee "Retry" (~1 min): las mutaciones no se reintentan por defecto. Piensa por qué.',
          'Desde el índice lateral abre Query Invalidation (~5 min): invalidateQueries marca como caducado y vuelve a pedir.',
          'Decide qué queries invalida cada mutación de VetCare: crear cita, cancelar cita, editar mascota.'
        ] },
      ex: {
        title: 'Crear, cancelar e invalidar lo correcto',
        body: `// src/api/citas.ts
export class ErrorSolape extends Error {}
// lo que devuelve el POST de la semana 12
export interface CitaCreada { id: string; inicio: string; fin: string; estado: EstadoCita }

// "clave" es la Idempotency-Key: el formulario la genera UNA vez por cita
// (con useRef, como en la semana 16) y la pasa aquí
export async function crearCita(
  { clave, ...datos }: NuevaCita & { clave: string }): Promise<CitaCreada> {
  const r = await fetch('/api/v1/citas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': clave,
    },
    body: JSON.stringify(datos),
  });
  if (r.status === 409) throw new ErrorSolape('Ese horario ya está ocupado.');
  if (!r.ok) {
    const p = await r.json().catch(() => null);
    throw new Error(p?.detail ?? 'No se pudo crear la cita.');
  }
  return r.json();
}

// src/hooks/useCrearCita.ts
export function useCrearCita() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: crearCita,

    onSuccess: () => {
      // Invalidar = marcar como obsoleto. Lo que esté en pantalla se refresca solo.
      qc.invalidateQueries({ queryKey: ['citas'] });

      // No metemos la respuesta con setQueryData: el POST devuelve solo id,
      // inicio, fin y estado, no la fila completa de la agenda (con nombres).
      // Mira la regla de abajo.
    },
  });
}

// En el componente:
const crear = useCrearCita();
const clave = useRef(crypto.randomUUID());

async function enviar(datos: NuevaCita) {
  try {
    await crear.mutateAsync({ ...datos, clave: clave.current });
    clave.current = crypto.randomUUID();   // la próxima cita, clave nueva
    cerrarFormulario();
  } catch (e) {
    // el error ya está en crear.error, aquí solo decides qué hacer con la UI
  }
}

<button type="submit" disabled={crear.isPending}>
  {crear.isPending ? 'Creando...' : 'Crear cita'}
</button>
{crear.isError && <p role="alert">{(crear.error as Error).message}</p>}

// QUÉ INVALIDAR: todo lo que el cambio pueda haber afectado. Piensa en consecuencias.
//   crear una cita   -> ['citas']  (la lista del día) y ['disponibilidad', vetId]
//   cancelar cita    -> ['citas'], ['cita', id]
//   registrar visita -> ['historial', mascotaId], ['citas']
//   emitir factura   -> ['facturas'], ['factura', id], ['historial', mascotaId]

// INVALIDAR vs setQueryData
//   invalidateQueries -> "este dato puede haber cambiado, vuelve a pedirlo"
//                        seguro, simple, cuesta una petición
//   setQueryData      -> "sé exactamente cómo queda, actualízalo sin pedir"
//                        instantáneo, pero si te equivocas muestras algo falso
// Regla práctica: invalida por defecto; usa setQueryData solo cuando la
// respuesta del servidor te da el objeto completo y actualizado.`
      },
      steps: [
        'Convierte la creación de citas del formulario de la semana pasada en un useMutation, eliminando el fetch manual y los estados de enviando y error.',
        'Añade la invalidación de ["citas"] en onSuccess y comprueba que la tabla se actualiza sola, sin que tú toques ningún estado.',
        'Escribe el mismo patrón para cancelar una cita, con su propio hook useCancelarCita.',
        'Haz la lista de consecuencias de cada mutación de VetCare en docs/frontend.md: para cada escritura, qué query keys quedan obsoletas.',
        'Observa el flujo completo en las devtools de React Query: mira cómo la query pasa a estado stale y se vuelve a pedir automáticamente tras la invalidación.'
      ],
      vet: [
        'En VetCare cancelar una cita afecta a la lista del día, al detalle de esa cita y a la disponibilidad del veterinario. Invalidar solo la lista es el bug típico: el panel de disponibilidad se queda mintiendo.',
        'Añade a docs/frontend.md la tabla mutación a keys invalidadas. Es un documento vivo que tendrás que actualizar cada vez que añadas una escritura.'
      ],
      edge: [
        'Olvidar invalidar una key relacionada produce el peor tipo de bug: la pantalla principal se actualiza y un panel secundario sigue mostrando datos viejos, así que parece que la app funciona hasta que alguien mira bien.',
        'Invalidar con una key demasiado amplia recarga medio sistema tras cada escritura. Hay un equilibrio entre invalidar de menos, que da datos viejos, e invalidar de más, que da peticiones innecesarias.',
        'mutateAsync lanza la excepción y mutate no lo hace. Si usas mutate sin onError, un fallo pasa en silencio y el usuario no se entera de nada.'
      ],
      quiz: [
        { q: '¿Qué significa invalidar una query?', a: 'Marcar esa entrada de cache como obsoleta. TanStack Query vuelve a pedirla automáticamente si algún componente montado la está usando, y si no lo está, la refrescará la próxima vez que alguien la necesite. No borra los datos: los sigue mostrando mientras llega la versión nueva.' },
        { q: '¿Cuándo usarías setQueryData en lugar de invalidateQueries?', a: 'Cuando la respuesta del servidor ya te da el objeto completo y actualizado, de modo que puedes escribirlo en la cache sin pedir nada. Es instantáneo y ahorra una petición, pero si lo que escribes no coincide exactamente con lo que tiene el servidor, muestras datos falsos sin saberlo.' },
        { q: '¿Por qué hay que pensar en consecuencias al decidir qué invalidar?', a: 'Porque una escritura casi nunca afecta solo a la lista obvia. Cancelar una cita cambia la lista del día, el detalle de esa cita y la disponibilidad del veterinario; si solo invalidas la lista, los otros paneles siguen mostrando un mundo que ya no existe.' },
        { q: '¿Qué diferencia hay entre mutate y mutateAsync?', a: 'mutateAsync devuelve una promesa que lanza la excepción si falla, así que puedes usar try y catch en el flujo. mutate no lanza y obliga a manejar el fallo en la devolución onError; si olvidas ponerla, el error desaparece y el usuario no recibe ninguna señal.' }
      ],
      out: 'Crear y cancelar citas por mutaciones, con la cache coherente y una tabla de invalidaciones documentada.',
      file: 'web/src/hooks/useCrearCita.ts'
    },
    {
      t: 'Actualizaciones optimistas',
      obj: 'Hacer que la interfaz refleje el cambio al instante y sepa deshacerlo con precisión si el servidor rechaza la operación.',
      why: 'Es lo que separa una aplicación que se siente profesional de una que se siente lenta, y la mayoría de desarrolladores no lo ha implementado nunca. Poder explicar el trío onMutate, onError y onSettled con su rollback es una respuesta muy fuerte.',
      study: { r: 1, what: 'Lee la página de Optimistic Updates entera, fijándote en el ejemplo con onMutate. Unos 15 minutos. Busca una cosa: por qué hay que cancelar las queries en curso antes de modificar la cache.',
        pasos: [
          'Lee la introducción y "Via the UI" (~4 min): la forma simple, mostrando las variables de la mutación mientras se envía.',
          'Lee "Via the cache" y "Updating a list of todos when adding a new todo" (~6 min): onMutate, cancelQueries, guardar el estado anterior y restaurarlo en onError.',
          'Lee "When to use what" (~2 min).',
          'Escribe, para cancelar cita, qué pasa en onMutate, en onError y en onSettled.'
        ] },
      ex: {
        title: 'El trío onMutate, onError, onSettled',
        body: `// LA IDEA: el 99% de las veces la operación va a funcionar.
// Enseña el resultado YA y prepara la marcha atrás por si acaso.
// Umbral de Nielsen: por debajo de 0.1s el usuario percibe respuesta instantánea.
// Ninguna red llega a eso. Solo la actualización optimista lo consigue.

export function useCancelarCita(dia: string) {
  const qc = useQueryClient();
  const key = ['citas', dia];

  return useMutation({
    mutationFn: (id: string) => cancelarCita(id),

    // 1. ANTES de llamar al servidor
    onMutate: async (id: string) => {
      // a) cancela refrescos en vuelo: si uno llega después, pisaría tu cambio
      await qc.cancelQueries({ queryKey: key });

      // b) guarda la foto actual para poder volver atrás
      const anteriores = qc.getQueryData<Cita[]>(key);

      // c) aplica el cambio en la cache como si ya hubiera funcionado
      qc.setQueryData<Cita[]>(key, (viejas = []) =>
        viejas.map(c => c.id === id ? { ...c, estado: 'cancelada' as const } : c));

      // d) devuelve la foto: llegará como tercer argumento a onError
      return { anteriores };
    },

    // 2. SI FALLA: restaura exactamente lo que había
    onError: (_err, _id, contexto) => {
      if (contexto?.anteriores) qc.setQueryData(key, contexto.anteriores);
      mostrarAviso('No se pudo cancelar la cita. Se ha restaurado.');
    },

    // 3. PASE LO QUE PASE: sincroniza con la verdad del servidor
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });
}

// POR QUÉ CADA PIEZA
//   cancelQueries  -> evita que una respuesta antigua en vuelo sobrescriba tu
//                     cambio optimista. Es la misma condición de carrera del
//                     AbortController de la semana pasada, en otra capa.
//   getQueryData   -> el rollback debe restaurar el estado EXACTO, no uno
//                     reconstruido a mano, porque puede haber otros cambios.
//   onSettled      -> aunque haya ido bien, el servidor puede haber hecho algo
//                     más (cambiar un contador, calcular un campo). Invalidar
//                     al final garantiza que acabas mostrando la verdad.

// CUÁNDO SÍ Y CUÁNDO NO
//   SÍ:  acciones con altísima probabilidad de éxito y efecto visual simple
//        -> cancelar una cita, marcar como leído, dar a me gusta, reordenar
//   NO:  operaciones que pueden fallar a menudo o cuyo resultado no conoces
//        -> crear una cita (el servidor asigna el id y puede dar 409 de solape)
//        -> cualquier pago
//   Para esas, spinner honesto. Mentir y rectificar es peor que esperar un segundo.`
      },
      steps: [
        'Convierte la cancelación de citas en optimista implementando los tres manejadores exactamente como en el ejemplo.',
        'Pruébalo con el backend funcionando: la fila debe cambiar de estado antes de que la red responda. Compara la sensación con la versión anterior.',
        'Ahora apaga el backend y cancela: comprueba que la fila cambia, vuelve a su estado anterior y aparece el aviso. Ese rollback es la mitad del patrón.',
        'Provoca la condición de carrera: quita el cancelQueries, añade un retardo en el backend, refresca y cancela casi a la vez. Observa cómo la respuesta vieja pisa tu cambio.',
        'Decide para cada mutación de VetCare si va optimista o con spinner y anota la decisión con su motivo en docs/frontend.md.'
      ],
      vet: [
        'En VetCare la cancelación va optimista porque es un cambio de estado simple que casi siempre funciona. La creación NO va optimista: el id lo asigna el servidor y el 409 de solape es un fallo realista y frecuente.',
        'Añade a docs/frontend.md el criterio en una frase: optimista cuando el éxito es casi seguro y conoces el resultado exacto; spinner honesto en los demás casos.'
      ],
      edge: [
        'Un rollback que reconstruye el estado a mano en vez de restaurar la foto guardada puede perder otros cambios ocurridos mientras tanto. Guarda y restaura siempre el valor completo.',
        'Sin cancelQueries, una petición de refresco lanzada antes de tu cambio puede responder después y sobrescribir el cambio optimista, haciendo que la fila parpadee de vuelta al estado anterior sin ningún error.',
        'Aplicar optimismo a una operación que falla a menudo entrena al usuario a desconfiar de la interfaz. Si ve aparecer y desaparecer cosas, deja de creerse lo que lee.'
      ],
      quiz: [
        { q: '¿Qué hacen las tres fases onMutate, onError y onSettled?', a: 'onMutate cancela refrescos en vuelo, guarda una foto de la cache y aplica el cambio como si ya hubiera funcionado. onError restaura esa foto si el servidor rechaza. onSettled invalida al final para sincronizar con la verdad del servidor pase lo que pase.' },
        { q: '¿Por qué hay que llamar a cancelQueries antes de modificar la cache?', a: 'Porque puede haber una petición de refresco ya en vuelo que responda después de tu cambio optimista y lo sobrescriba con los datos antiguos. Cancelarla evita esa condición de carrera, que es la misma idea del AbortController pero a nivel de cache.' },
        { q: '¿Por qué crear una cita no debería ser optimista?', a: 'Porque no conoces el resultado: el identificador lo asigna el servidor y el 409 por solape es un fallo realista que ocurre con frecuencia. Mostrar una cita que luego desaparece es peor experiencia que esperar un segundo con un indicador honesto.' },
        { q: '¿Por qué onSettled invalida incluso cuando la mutación fue bien?', a: 'Porque el servidor puede haber hecho más cosas de las que tú simulaste: recalcular un contador, cambiar un campo derivado o aplicar una regla. Invalidar al final garantiza que lo que queda en pantalla es la verdad del servidor y no tu aproximación.' }
      ],
      out: 'Cancelación de citas instantánea con rollback verificado apagando el backend.',
      file: 'web/src/hooks/useCancelarCita.ts'
    },
    {
      t: 'Rutas y estado en la URL',
      obj: 'Dividir VetCare en pantallas navegables y poner en la URL el estado que debe ser compartible y recordable.',
      why: 'La URL es estado que la gente olvida que existe. Una aplicación donde no puedes compartir un enlace a lo que estás viendo se siente rota, y saber razonar sobre qué va en la URL y qué no es criterio de producto, no solo técnico.',
      study: { r: 3, what: 'Lee la página URL Values del modo declarativo y prueba cada ejemplo en tu proyecto. Unos 15 minutos. Busca una cosa: la diferencia entre un parámetro de ruta (useParams) y un parámetro de búsqueda (useSearchParams).',
        pasos: [
          'Lee "Route Params" (~4 min): useParams para lo que identifica la pantalla, como /mascotas/42.',
          'Lee "URL Search Params" (~4 min): useSearchParams para filtros y páginas, como ?dia=2026-10-07.',
          'Lee "Location Object" (~2 min).',
          'Haz una tabla de pantallas de VetCare con su ruta y qué parámetros van en la ruta y cuáles en la búsqueda.',
          'Comprueba con un filtro que si recargas la página o copias la URL, el filtro se mantiene.'
        ] },
      ex: {
        title: 'Rutas de VetCare y estado en la URL',
        body: `// npm install react-router
// (desde la versión 7 basta con "react-router"; todo se importa de ahí)

// src/rutas.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,                  // cabecera, navegación, <Outlet />
    errorElement: <PaginaError />,        // captura errores de cualquier hija
    children: [
      { index: true,                    element: <Inicio /> },
      { path: 'agenda',                 element: <Agenda /> },
      { path: 'mascotas',               element: <ListaMascotas /> },
      { path: 'mascotas/:id',           element: <DetalleMascota /> },
      { path: 'mascotas/:id/historial', element: <HistorialMascota /> },
      { path: '*',                      element: <NoEncontrado /> },
    ],
  },
]);
// y en src/main.tsx: <RouterProvider router={router} /> en lugar de <App />

// PARÁMETRO DE RUTA: identifica QUÉ recurso estás viendo
export function DetalleMascota() {
  const { id } = useParams();                       // string | undefined
  const { data, isPending, isError, refetch } = useMascota(id!);   // el UUID

  if (isPending) return <Esqueleto />;
  if (isError)   return <MensajeError onReintentar={refetch} />;
  return <FichaMascota mascota={data} />;
}

// PARÁMETRO DE BÚSQUEDA: modifica CÓMO lo estás viendo
export function Agenda() {
  const [params, setParams] = useSearchParams();

  const dia    = params.get('dia')    ?? hoyISO();
  const filtro = (params.get('estado') ?? 'todas') as EstadoCita | 'todas';
  const busqueda = params.get('q') ?? '';

  function cambiar(clave: string, valor: string) {
    setParams(previos => {
      const n = new URLSearchParams(previos);
      if (valor) n.set(clave, valor); else n.delete(clave);   // no ensucies la URL
      return n;
    }, { replace: true });   // replace: no llenes el historial con cada tecla
  }

  const { data: citas = [] } = useCitas(dia);
  // ...
}
// Resultado: /agenda?dia=2026-10-05&estado=agendada&q=luna
// Eso se puede compartir por WhatsApp, guardar en marcadores, y el botón
// atrás del navegador funciona como el usuario espera.

// QUÉ VA EN LA URL Y QUÉ NO
//   SÍ: el recurso que ves, el día, los filtros, la búsqueda, la página,
//       el orden, la pestaña activa. Todo lo que quieras poder compartir.
//   NO: si un desplegable está abierto, el texto a medio escribir de un
//       formulario, la posición del scroll, el tema claro u oscuro.
//   La pregunta: ¿tendría sentido mandarle este enlace a un compañero?

// ENLACES, NO BOTONES CON onClick
<Link to={'/mascotas/' + m.id}>{m.nombre}</Link>
// Un Link es un <a> real: abre en pestaña nueva con ctrl+clic, se puede
// copiar con el botón derecho y los lectores de pantalla lo anuncian.`
      },
      steps: [
        'Instala react-router y define el árbol de rutas del ejemplo con un Layout que contenga la navegación y un Outlet.',
        'Mueve el día, el filtro y la búsqueda de la agenda desde useState a useSearchParams. Comprueba que al recargar la página conservas exactamente lo que estabas viendo.',
        'Usa replace true al actualizar el texto de búsqueda, para no crear una entrada de historial por cada letra tecleada. Prueba el botón atrás antes y después del cambio.',
        'Crea la ruta de detalle de mascota con parámetro y asegúrate de que useMascota usa ese id en su query key.',
        'Añade la ruta comodín de página no encontrada y el errorElement del Layout. Visita una URL inventada y comprueba que ves algo útil en lugar de una pantalla en blanco.'
      ],
      vet: [
        'Prueba el caso real que justifica todo esto: copia la URL de la agenda filtrada, ábrela en una ventana nueva y comprueba que ves exactamente lo mismo. Si no, el estado está en el sitio equivocado.',
        'Añade a docs/frontend.md el mapa de rutas de VetCare y la lista de qué parámetros acepta cada pantalla.'
      ],
      edge: [
        'Guardar un filtro solo en useState hace que se pierda al recargar y que no se pueda compartir. El usuario que manda un enlace a un compañero espera que vea lo mismo.',
        'Sin replace true, cada pulsación en el buscador crea una entrada de historial y el botón atrás obliga a pulsar veinte veces para salir de la pantalla.',
        'Un parámetro de búsqueda que no se limpia cuando está vacío deja URLs del tipo ?q=&estado= que son feas y difíciles de leer. Borra la clave cuando el valor sea vacío.'
      ],
      quiz: [
        { q: '¿Qué diferencia hay entre un parámetro de ruta y uno de búsqueda?', a: 'El de ruta identifica qué recurso estás viendo y forma parte de la jerarquía, como el id en /mascotas/7. El de búsqueda modifica cómo lo estás viendo sin cambiar el recurso, como un filtro o un orden, y es opcional por naturaleza.' },
        { q: '¿Cómo decides si un estado debe ir en la URL?', a: 'Preguntándote si tendría sentido mandarle ese enlace a un compañero. El día, los filtros y la búsqueda definen lo que el otro debería ver, así que van en la URL. Que un desplegable esté abierto o el texto a medio escribir no aportan nada al destinatario y se quedan en estado local.' },
        { q: '¿Por qué se usa replace al actualizar el texto de búsqueda?', a: 'Porque sin él, cada pulsación de tecla crea una entrada nueva en el historial del navegador y el botón atrás obliga al usuario a pulsar una vez por letra escrita. Con replace se sustituye la entrada actual y el historial sigue teniendo sentido.' },
        { q: '¿Por qué navegar con Link y no con un botón que llame a navigate?', a: 'Porque Link genera un enlace real, así que se puede abrir en pestaña nueva con ctrl más clic, copiar la dirección con el botón derecho y los lectores de pantalla lo anuncian como enlace. Un botón con onClick pierde todo ese comportamiento que el usuario da por hecho.' }
      ],
      out: 'VetCare navegable con rutas, filtros compartibles por URL y páginas de error y no encontrado.',
      file: 'web/src/rutas.tsx'
    },
    {
      t: 'Rendimiento percibido y estados de carga',
      obj: 'Aplicar los umbrales de percepción humana para que la aplicación se sienta rápida, incluso cuando la red no lo es.',
      why: 'Es una de las pocas áreas donde una decisión de interfaz cambia de verdad cómo percibe la gente tu producto. Poder citar los tres umbrales de Nielsen y explicar cómo los usaste demuestra que piensas en el usuario y no solo en el código.',
      study: { r: 2, what: 'Lee el artículo de Nielsen Norman Group completo, es corto. Unos 10 minutos. Busca una cosa: qué hay que hacer en cada uno de los tres umbrales, 0.1s, 1s y 10s.',
        pasos: [
          'Lee el artículo de principio a fin (~6 min).',
          'Copia los tres límites: 0,1 s se siente instantáneo, 1 s mantiene el hilo de pensamiento, 10 s es el máximo de atención.',
          'Lee "Web-Based Application Response Time" (~3 min).',
          'Para cada acción de VetCare escribe en qué umbral cae y qué feedback le corresponde: nada, un indicador o una barra de progreso.'
        ] },
      ex: {
        title: 'Los tres umbrales aplicados a VetCare',
        body: `// 0.1 s  -> se percibe como instantáneo. Ninguna señal de espera.
//           Toda interacción local: abrir un desplegable, filtrar en memoria,
//           escribir en un input. Y las actualizaciones optimistas de ayer.
//
// 1 s    -> el usuario nota la espera pero no pierde el hilo.
//           Ninguna animación de carga aún: un spinner que aparece 300ms
//           y se va es peor que no mostrar nada. Parpadea y marea.
//
// 10 s   -> límite de la atención. Por encima, el usuario se va.
//           Hace falta progreso real y la posibilidad de cancelar.

// TÉCNICA 1: esqueleto en vez de spinner, con retardo
function Esqueleto() {
  return (
    <div className="esqueleto" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => <div key={i} className="fila-fantasma" />)}
    </div>
  );
}

const { data, isPending } = useCitas(dia);
const mostrarCarga = useRetrasado(isPending, 300);   // solo si tarda más de 300ms
// Si la respuesta llega en 80ms, el usuario nunca ve nada parpadear.

function useRetrasado(activo: boolean, ms: number) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!activo) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), ms);
    return () => clearTimeout(t);
  }, [activo, ms]);
  return visible;
}
// Este SÍ es un uso legítimo de useEffect: sincroniza con un temporizador,
// que es un sistema externo a React.

// TÉCNICA 2: mostrar datos viejos mientras llegan los nuevos
const { data, isPlaceholderData } = useQuery({
  queryKey: ['citas', dia],
  queryFn: ({ signal }) => obtenerCitas(dia, signal),
  placeholderData: keepPreviousData,       // la tabla NO se vacía al cambiar de día
});

<div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
  <TablaCitas citas={data ?? []} />
</div>
// El usuario ve el día anterior atenuado en vez de un hueco blanco.
// La diferencia de sensación es enorme y cuesta una línea.

// TÉCNICA 3: precargar lo que sabes que va a pedir
function FilaMascota({ mascota }: { mascota: MascotaResumen }) {
  const qc = useQueryClient();
  return (
    <Link
      to={'/mascotas/' + mascota.id}
      onMouseEnter={() => qc.prefetchQuery({
        queryKey: ['mascota', mascota.id],
        queryFn: () => obtenerMascota(mascota.id),
      })}
    >
      {mascota.nombre}
    </Link>
  );
}
// Entre que el ratón entra en el enlace y el usuario hace clic pasan
// 200-400 ms. Suficiente para que la pantalla siguiente ya esté cargada.

// TÉCNICA 4: partir el código por ruta
// (lazy necesita que la página se exporte con "export default")
const HistorialMascota = lazy(() => import('./paginas/HistorialMascota'));
<Suspense fallback={<Esqueleto />}>
  <HistorialMascota />
</Suspense>
// La pantalla de historial no se descarga hasta que alguien la visita.`
      },
      steps: [
        'Sustituye todos tus spinners por esqueletos que imiten la forma del contenido real: una tabla por filas fantasma, una ficha por bloques grises.',
        'Implementa el hook useRetrasado y aplícalo para que el indicador de carga solo aparezca tras 300 ms. Prueba con la red rápida y comprueba que ya no parpadea.',
        'Añade placeholderData con keepPreviousData a la query de citas y cambia de día: la tabla debe atenuarse en lugar de vaciarse.',
        'Implementa la precarga al pasar el ratón sobre los enlaces de mascota. Comprueba en la pestaña Network que la petición sale antes del clic.',
        'Abre las devtools, activa la simulación de red lenta a 3G y recorre toda la aplicación. Anota en docs/frontend.md cada punto donde la espera se hace incómoda.'
      ],
      vet: [
        'En VetCare el peor caso es el historial de una mascota, que carga visitas, vacunas y facturas. Precárgalo al pasar el ratón por la fila y pártelo con lazy para que no pese en la carga inicial.',
        'Añade a docs/frontend.md los tres umbrales con un ejemplo propio de cada uno dentro de tu aplicación. Esa tabla es lo que vas a poder contar en una entrevista.'
      ],
      edge: [
        'Un esqueleto que no se parece al contenido real produce un salto visual molesto cuando llegan los datos. Debe tener aproximadamente las mismas dimensiones y la misma estructura.',
        'Precargar en cada movimiento del ratón sobre una lista larga puede lanzar decenas de peticiones. Limítalo a onMouseEnter del elemento concreto y confía en el staleTime para evitar repeticiones.',
        'Partir el código de más empeora las cosas: cada import dinámico es una petición extra y una posible espera. Pártelo por ruta, no por componente.'
      ],
      quiz: [
        { q: '¿Cuáles son los tres umbrales de Nielsen y qué exige cada uno?', a: 'Por debajo de 0.1 segundos se percibe como instantáneo y no hace falta ninguna señal. Hasta 1 segundo el usuario nota la espera pero mantiene el hilo, así que tampoco conviene un indicador que parpadee. A partir de 10 segundos se pierde la atención y hace falta progreso real y opción de cancelar.' },
        { q: '¿Por qué es mejor retrasar 300 ms el indicador de carga?', a: 'Porque si la respuesta llega en menos de ese tiempo, el usuario nunca ve nada y la operación se percibe como instantánea. Mostrar un spinner que aparece y desaparece en 80 milisegundos produce un parpadeo que hace que la aplicación parezca más nerviosa y más lenta de lo que es.' },
        { q: '¿Qué gana el usuario con keepPreviousData al cambiar de día?', a: 'Que la tabla no se vacía: sigue viendo los datos anteriores atenuados mientras llegan los nuevos. Mantiene el contexto visual y la altura de la página, en lugar de enfrentarse a un hueco blanco y a un salto de contenido cuando llega la respuesta.' },
        { q: '¿Por qué precargar al pasar el ratón funciona tan bien?', a: 'Porque entre que el puntero entra en un enlace y el usuario hace clic pasan típicamente entre 200 y 400 milisegundos, tiempo suficiente para que la petición vaya y vuelva. Cuando llega el clic los datos ya están en cache y la pantalla aparece sin espera percibida.' }
      ],
      out: 'Una aplicación que se siente rápida: esqueletos retrasados, datos previos visibles y precarga al pasar el ratón.',
      file: 'web/src/componentes/Esqueleto.tsx'
    },
    {
      t: 'VetCare web usable de punta a punta (examen de la semana)',
      obj: 'Recorrer la aplicación completa con ojos de usuario y de revisor, y dejar por escrito las decisiones de datos y de experiencia.',
      why: 'Una aplicación que funciona en tu máquina con red rápida y datos perfectos no demuestra nada. Haberla probado con red lenta, sin datos y con el backend caído es lo que puedes contar con confianza.',
      study: { r: 0, what: 'Repasa Important Defaults de TanStack Query ahora que llevas una semana usándolo. Unos 10 minutos. Busca una cosa: algún valor por defecto que hayas estado sufriendo sin saber que se podía configurar.',
        pasos: [
          'Vuelve a Important Defaults (~5 min) con tu código abierto.',
          'Para cada valor por defecto escribe si te ha afectado esta semana y si lo cambiarías.',
          'Recorre la aplicación como usuario: crea, edita y cancela una cita, recarga a mitad y comprueba que nada se pierde.',
          'Anota los tres problemas de experiencia que encuentres, ordenados por lo que molestarían a la recepcionista.'
        ] },
      ex: {
        title: 'Revisión final de la aplicación web',
        body: `DATOS
  [ ] Todas las lecturas pasan por useQuery; ningún fetch suelto en componentes
  [ ] Todas las escrituras pasan por useMutation
  [ ] Cada query key incluye TODOS los parámetros que afectan al resultado
  [ ] Cada mutación invalida todas las keys que su cambio puede afectar
  [ ] El staleTime de cada tipo de dato está elegido a conciencia, no por defecto
  [ ] Las funciones de src/api/ no importan nada de React

EXPERIENCIA
  [ ] Las cuatro pantallas cubren cargando, error, vacío y con datos
  [ ] Los indicadores de carga tienen retardo de 300 ms
  [ ] Los esqueletos se parecen al contenido real
  [ ] Cambiar de día o de filtro no vacía la pantalla
  [ ] Al menos una acción es optimista y su rollback está probado
  [ ] Todo error muestra un mensaje en español y una vía de salida

URL Y NAVEGACIÓN
  [ ] Día, filtro y búsqueda viven en la URL
  [ ] El botón atrás del navegador hace lo que el usuario espera
  [ ] Recargar la página conserva lo que estabas viendo
  [ ] Existe página de no encontrado y de error
  [ ] Se navega con Link, no con botones y navigate

PRUEBAS MANUALES OBLIGATORIAS
  1. Red lenta 3G en devtools -> recorre todo. ¿Dónde se hace incómodo?
  2. Backend apagado          -> cada pantalla da mensaje útil y reintentar
  3. Base de datos vacía      -> cada pantalla da un estado vacío con sentido
  4. Cancela una cita con el backend apagado -> cambio y rollback visible
  5. Copia la URL de la agenda filtrada -> ábrela en ventana nueva, mismo resultado
  6. Recorre toda la app con Tab -> sin ratón, todo alcanzable
  7. Deja la pestaña, espera un minuto, vuelve -> refresco automático

ENTREGABLES DE LA SEMANA
  [ ] docs/frontend.md con: tabla de query keys, tabla de invalidaciones,
      criterio optimista vs spinner, mapa de rutas y los tres umbrales
  [ ] npx tsc -b sin errores y cero any en src/`
      },
      steps: [
        'Recorre las tres listas de comprobación con el código delante y arregla lo que falle, en lugar de marcarlo igualmente.',
        'Ejecuta las siete pruebas manuales de verdad, en el navegador. La número 2 y la número 4 son las que más bugs revelan.',
        'Completa docs/frontend.md con las cinco secciones del entregable. Debe quedar un documento que alguien que no conoce el proyecto pueda leer.',
        'Deja npx tsc -b limpio y cero any en src. Si algún any es inevitable, sustitúyelo por unknown y acota el tipo donde lo uses.',
        'Explica en voz alta en tres minutos por qué los datos del servidor no son estado del cliente, usando tu propia aplicación como ejemplo de cada punto.'
      ],
      vet: [
        'Haz una captura de la agenda y del historial de mascota y guárdalas en docs/capturas/. Con el backend de la semana 12 y esta interfaz, VetCare ya es un proyecto completo que enseñar.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/frontend.md dentro de una semana.'
      ],
      edge: [
        'Probar solo con red rápida y datos completos esconde la mitad de los problemas. Las pruebas 1, 2 y 3 son las que encuentran lo que un usuario real encontraría el primer día.',
        'Un documento de decisiones que no se actualiza se vuelve peor que no tenerlo, porque la gente confía en él. Si cambias una query key, actualiza la tabla en el mismo commit.',
        'Marcar puntos de la lista sin comprobarlos de verdad convierte la revisión en un ritual vacío. Si no lo has visto funcionar en el navegador, no está hecho.'
      ],
      quiz: [
        { q: '¿Por qué las funciones de src/api no deben importar nada de React?', a: 'Para que sean puras funciones de acceso a datos, reutilizables desde un hook, desde un test o desde un script, y testeables sin montar ningún componente. Mezclar hooks ahí dentro las ata al ciclo de vida de React y las convierte en algo que solo funciona dentro de un componente.' },
        { q: '¿Cuál de las siete pruebas manuales encuentra más bugs y por qué?', a: 'La del backend apagado, porque obliga a recorrer todos los caminos de error que normalmente nunca se ejecutan en desarrollo. Es donde aparecen las pantallas en blanco, los mensajes en inglés sin traducir y los estados de carga que no terminan nunca.' },
        { q: '¿Qué significa que la aplicación se sienta rápida aunque la red no lo sea?', a: 'Que el usuario recibe una respuesta visual inmediata a cada acción aunque los datos tarden: actualizaciones optimistas para lo que casi siempre funciona, datos previos visibles mientras llegan los nuevos, precarga anticipada y retardo en los indicadores para no parpadear. La latencia real no baja, pero la percibida sí.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que los datos del servidor son una cache que hay que sincronizar y no estado que uno gestiona, y que una vez aceptas eso, la cache, la invalidación y el optimismo se vuelven las tres herramientas con las que una aplicación pasa de funcionar correctamente a sentirse bien.' }
      ],
      out: 'La web de VetCare completa, probada con red lenta y backend caído, con sus decisiones documentadas.',
      file: 'docs/frontend.md'
    }
  ]
}
]);
