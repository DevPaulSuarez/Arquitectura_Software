window.WEEKS = (window.WEEKS || []).concat([
{
  n: 16,
  phase: 'Frontend',
  title: 'React y TypeScript: pensar la interfaz como estado',
  idea: 'Tienes una API que funciona, es resiliente y está bien arquitecturada. Ahora alguien tiene que usarla. El error clásico al llegar a React desde el backend es tratarlo como plantillas HTML con JavaScript dentro. No lo es: React es una función que convierte estado en interfaz. Si el estado está bien modelado, la interfaz casi se escribe sola; si está mal modelado, acabas peleando con useEffect y con bugs imposibles. Esta semana aprendes a modelar estado, no a decorar pantallas.',
  res: [
    { t: 'React — Describing the UI',
      u: 'https://react.dev/learn/describing-the-ui',
      note: 'La documentación oficial nueva, que es excelente. Esta sección cubre componentes, props y renderizado condicional con ejemplos interactivos que puedes tocar en la propia página.' },
    { t: 'React — Managing State',
      u: 'https://react.dev/learn/managing-state',
      note: 'La sección más importante de toda la documentación. Estructurar estado, levantarlo y cuándo usar reducer. Es la que separa a quien sabe React de quien copia ejemplos.' },
    { t: 'TypeScript Handbook — Everyday Types',
      u: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
      note: 'Los tipos que vas a usar el 95% del tiempo. Viniendo de C# te resultará familiar, pero presta atención a los tipos unión, que no tienen equivalente directo.' },
    { t: 'React — You Might Not Need an Effect',
      u: 'https://react.dev/learn/you-might-not-need-an-effect',
      note: 'La página que más bugs previene de toda la documentación. Léela aunque creas que no la necesitas: casi todo el mundo usa useEffect de más.' },
    { t: 'React — Reacting to Input with State', u: 'https://react.dev/learn/reacting-to-input-with-state', note: 'Un formulario modelado como estados: escribiendo, enviando, error y éxito.' }
  ],
  days: [
    {
      t: 'Componentes, props y JSX con tipos',
      obj: 'Escribir componentes de React tipados con TypeScript y entender por qué un componente es solo una función de props a interfaz.',
      why: 'Es la base de todo y es donde más rápido se ve si alguien viene del backend con buenos hábitos. Un componente bien tipado es autoexplicativo y el editor te corrige antes de ejecutar, igual que en C#.',
      study: { r: 0, what: 'Lee las páginas Your First Component, Passing Props to a Component y Conditional Rendering. Unos 20 minutos. Busca una cosa: por qué las props son de solo lectura y qué pasa si intentas modificarlas.',
        pasos: [
          'Desde la página del capítulo abre "Your First Component" (~6 min): un componente es una función que devuelve JSX.',
          'Abre "Passing Props to a Component" (~7 min): las props son de solo lectura; para cambiar algo se usa estado.',
          'Abre "Conditional Rendering" (~5 min).',
          'Escribe el tipo de las props de TarjetaMascota con TypeScript antes de escribir el componente.'
        ] },
      ex: {
        title: 'De función a componente tipado',
        body: `// desde la carpeta raíz de VetCare:
// npm create vite@latest web -- --template react-ts
// cd web && npm install && npm run dev

// src/tipos.ts  -- los tipos del dominio, espejo de tus DTOs de la API
export type EstadoCita = 'agendada' | 'confirmada' | 'atendida' | 'cancelada';

export interface Cita {
  id: string;            // el UUID que manda la API
  inicio: string;        // ISO 8601, como lo manda la API
  fin: string;
  mascotaNombre: string;
  duenoNombre: string;
  estado: EstadoCita;
}

// src/componentes/EtiquetaEstado.tsx
// Un componente es UNA FUNCIÓN: recibe props, devuelve JSX. Nada más.
interface PropsEtiqueta {
  estado: EstadoCita;
}

const colores: Record<EstadoCita, string> = {
  agendada:   'bg-azul',
  confirmada: 'bg-verde',
  atendida:   'bg-gris',
  cancelada:  'bg-rojo',
};

export function EtiquetaEstado({ estado }: PropsEtiqueta) {
  return <span className={'etiqueta ' + colores[estado]}>{estado}</span>;
}
// El Record<EstadoCita, string> obliga a cubrir los cuatro estados.
// Si mañana añades 'no_asistio' al tipo unión, TypeScript te marca error aquí.
// Eso es exhaustividad: lo mismo que un switch sin default en C#.

// src/componentes/FilaCita.tsx
interface PropsFila {
  cita: Cita;
  onCancelar: (id: string) => void;     // callbacks también van tipados
}

export function FilaCita({ cita, onCancelar }: PropsFila) {
  const hora = new Date(cita.inicio).toLocaleTimeString('es', {
    hour: '2-digit', minute: '2-digit',
  });
  const sePuedeCancelar = cita.estado === 'agendada' || cita.estado === 'confirmada';

  return (
    <tr>
      <td>{hora}</td>
      <td>{cita.mascotaNombre}</td>
      <td>{cita.duenoNombre}</td>
      <td><EtiquetaEstado estado={cita.estado} /></td>
      <td>
        {sePuedeCancelar && (
          <button onClick={() => onCancelar(cita.id)}>Cancelar</button>
        )}
      </td>
    </tr>
  );
}
// Fíjate: FilaCita no sabe QUÉ pasa al cancelar. Solo avisa. El padre decide.
// Es la misma idea que un evento de dominio: anunciar sin conocer al que escucha.`
      },
      steps: [
        'Crea el proyecto con Vite y la plantilla react-ts dentro de la carpeta web/ de VetCare. Arranca npm run dev y confirma que ves la página por defecto.',
        'Crea src/tipos.ts con las interfaces Cita, Mascota y Dueno, copiando exactamente los campos que devuelve tu API de la semana 12. Si no coinciden, tu frontend mentirá.',
        'Escribe EtiquetaEstado usando Record<EstadoCita, string> y comprueba la exhaustividad: añade un quinto estado al tipo unión y verifica que TypeScript marca error en el Record.',
        'Escribe FilaCita y TablaCitas, con TablaCitas recibiendo un array de citas y pasando el callback onCancelar hacia abajo. Usa datos falsos en un array constante, sin API todavía.',
        'Abre React DevTools en el navegador, selecciona una FilaCita y observa sus props. Comprueba que ves exactamente lo que escribiste en la interfaz.'
      ],
      vet: [
        'La pantalla objetivo de esta semana es la agenda del día de VetCare: una tabla de citas con hora, mascota, dueño, estado y botón de cancelar. Es el consumidor natural de la consulta AgendaDelDia que escribiste la semana pasada.',
        'Anota en docs/frontend.md los tipos del frontend y de qué DTO de la API sale cada uno. Esa correspondencia es la que se rompe en silencio cuando cambias el backend.'
      ],
      edge: [
        'No modifiques props. Son de solo lectura y mutarlas no provoca un nuevo render, así que verás datos viejos en pantalla sin ningún error visible. Si algo tiene que cambiar, es estado, no prop.',
        'Evita escribir props como any o como un objeto sin tipo para salir del paso. En el momento en que pones any, pierdes exactamente la ventaja por la que elegiste TypeScript.',
        'En JSX, el valor 0 SÍ se renderiza: {citas.length && <Tabla/>} pinta un 0 en pantalla cuando el array está vacío. Usa {citas.length > 0 && ...} siempre.'
      ],
      quiz: [
        { q: '¿Qué es exactamente un componente de React?', a: 'Una función que recibe un objeto de props y devuelve una descripción de interfaz en JSX. No es una plantilla ni una clase con ciclo de vida: dado el mismo estado y las mismas props debe producir siempre la misma salida, lo que la hace predecible y testeable.' },
        { q: '¿Por qué las props son de solo lectura?', a: 'Porque pertenecen al componente padre, que es quien las creó y quien controla cuándo cambian. Si un hijo las mutara, React no se enteraría del cambio y no volvería a renderizar, así que verías datos desactualizados sin ningún error. El flujo de datos siempre va de padre a hijo.' },
        { q: '¿Qué ventaja da usar Record<EstadoCita, string> en vez de un objeto suelto?', a: 'Que TypeScript obliga a cubrir todas las variantes del tipo unión. Si mañana añades un estado nuevo, el compilador marca error en todos los sitios donde falte, igual que un switch exhaustivo en C#. Es el tipo haciendo de lista de comprobación automática.' },
        { q: '¿Por qué FilaCita recibe onCancelar en lugar de llamar a la API directamente?', a: 'Para que el componente siga siendo una función pura de presentación, reutilizable y fácil de probar. Al avisar hacia arriba en vez de actuar, quien decide qué significa cancelar es el componente que tiene el contexto, igual que un evento de dominio desacopla al que anuncia del que reacciona.' }
      ],
      out: 'Proyecto React+TS arrancado con tipos del dominio y una tabla de citas pintada con datos falsos.',
      file: 'web/src/componentes/'
    },
    {
      t: 'Estado y eventos: useState bien usado',
      obj: 'Decidir qué es estado y qué no lo es, y evitar el error más común de los principiantes: duplicar en estado algo que se puede calcular.',
      why: 'La mayoría de bugs de React no son bugs de React: son estados mal modelados que pueden estar en combinaciones imposibles. Saber reducir el estado al mínimo es la habilidad que más se nota al revisar código de frontend.',
      study: { r: 1, what: 'Lee State: A Component Memory y, sobre todo, Choosing the State Structure. Unos 20 minutos. Busca una cosa: el principio de evitar estado redundante y el ejemplo de por qué guardar fullName junto a firstName y lastName es un error.',
        pasos: [
          'Desde la página del capítulo abre "Choosing the State Structure" (~10 min).',
          'Copia sus principios, en especial evitar estado redundante y evitar duplicar datos en el estado.',
          'Busca el ejemplo de fullName: por qué se calcula durante el render en vez de guardarse.',
          'Si useState aún no te resulta cómodo, lee antes State: A Component\'s Memory en el capítulo Adding Interactivity (~6 min).',
          'Lista las variables de estado de tu pantalla de agenda y tacha las que se pueden calcular a partir de otras.'
        ] },
      ex: {
        title: 'Estado mínimo vs estado duplicado',
        body: `// MAL: tres estados que pueden contradecirse
function Agenda() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [total, setTotal] = useState(0);                 // derivable de citas.length
  const [hayCitas, setHayCitas] = useState(false);       // derivable también
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);  // copia

  // Ahora cada vez que cambies citas tienes que acordarte de actualizar los otros tres.
  // El día que olvides uno, la pantalla dice "3 citas" sobre una tabla con 5 filas.
  // Y citaSeleccionada se queda con datos viejos cuando la cita original cambia.
}

// BIEN: una sola fuente de verdad, lo demás se calcula en el render
function Agenda() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [idSeleccionada, setIdSeleccionada] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<EstadoCita | 'todas'>('todas');

  // Derivado. Se recalcula en cada render y SIEMPRE es coherente.
  const visibles = filtro === 'todas' ? citas : citas.filter(c => c.estado === filtro);
  const total = visibles.length;
  const seleccionada = citas.find(c => c.id === idSeleccionada) ?? null;

  // Guardar el ID en vez del objeto es la clave: si la cita cambia,
  // seleccionada refleja la versión nueva automáticamente.

  function cancelar(id: string) {
    // NUNCA mutes el array. React compara por referencia.
    setCitas(previas => previas.map(c =>
      c.id === id ? { ...c, estado: 'cancelada' as const } : c
    ));
  }

  return (
    <>
      <SelectorFiltro valor={filtro} onCambiar={setFiltro} />
      <p>{total} cita{total === 1 ? '' : 's'}</p>
      <TablaCitas citas={visibles} onCancelar={cancelar} onSeleccionar={setIdSeleccionada} />
      {seleccionada && <PanelDetalle cita={seleccionada} />}
    </>
  );
}

// LA PREGUNTA PARA DECIDIR SI ALGO ES ESTADO:
//   1. ¿Llega por props?            -> no es estado
//   2. ¿Se puede calcular de otro?  -> no es estado, calcúlalo en el render
//   3. ¿Se mantiene igual entre renders y nadie lo cambia? -> no es estado, es constante
//   Si sobrevive a las tres preguntas, entonces sí es estado.`
      },
      steps: [
        'Convierte tu TablaCitas de ayer en interactiva: añade el filtro por estado y el contador, calculando ambos en el render en lugar de guardarlos en estado.',
        'Implementa cancelar con el patrón de actualización inmutable del ejemplo. Comprueba en React DevTools que el array es un objeto nuevo tras cada cambio.',
        'Haz el experimento de la mutación: escribe citas[0].estado = "cancelada" y luego setCitas(citas). Observa que la pantalla no cambia y entiende por qué: la referencia del array es la misma.',
        'Añade selección de fila guardando solo el id. Comprueba que al cancelar la cita seleccionada, el panel de detalle se actualiza solo, sin código extra.',
        'Aplica las tres preguntas a cada useState que tengas escrito y elimina los que no sobrevivan. Anota en docs/frontend.md cuántos quitaste.'
      ],
      vet: [
        'La agenda de VetCare necesita exactamente tres estados: la lista de citas, el id seleccionado y el filtro. Cualquier cuarto useState que te salga, pásalo por las tres preguntas antes de aceptarlo.',
        'Escribe en docs/frontend.md la regla que acabas de aprender con tus palabras y un ejemplo propio de estado derivado que estuviste a punto de guardar.'
      ],
      edge: [
        'setState es asíncrono en el sentido de que no actualiza la variable inmediatamente. Si lees citas justo después de setCitas, ves el valor viejo. Usa la forma de función setCitas(previas => ...) siempre que el nuevo valor dependa del anterior.',
        'Guardar un objeto completo en estado cuando ya está en una lista crea dos copias que se desincronizan. Guarda el identificador y busca el objeto en el render.',
        'Mutar un array u objeto de estado no provoca render porque React compara referencias, no contenido. Usa siempre map, filter y el operador de propagación para crear valores nuevos.'
      ],
      quiz: [
        { q: '¿Cuáles son las tres preguntas para decidir si algo debe ser estado?', a: 'Si llega por props no es estado porque pertenece al padre. Si se puede calcular a partir de otro valor no es estado, se calcula en el render. Si no cambia nunca entre renders es una constante. Solo lo que sobrevive a las tres es estado real.' },
        { q: '¿Por qué es mejor guardar el id de la cita seleccionada que el objeto completo?', a: 'Porque el objeto guardado sería una copia congelada en el momento de seleccionarlo. Si la cita cambia en la lista, la copia se queda con datos viejos y la pantalla muestra información inconsistente. Guardando el id y buscando en el render, siempre se obtiene la versión actual.' },
        { q: '¿Por qué mutar un array de estado no actualiza la pantalla?', a: 'Porque React decide si debe renderizar comparando la referencia del valor nuevo con la del anterior, no su contenido. Si mutas el mismo array la referencia no cambia, React concluye que nada ocurrió y se salta el render aunque los datos sean distintos.' },
        { q: '¿Cuándo hay que usar la forma de función de setState?', a: 'Siempre que el nuevo valor dependa del anterior. La variable de estado en el ámbito actual tiene el valor del render en curso, que puede estar desactualizado si hay varias actualizaciones seguidas. La forma de función recibe el valor más reciente garantizado por React.' }
      ],
      out: 'Una agenda interactiva con el mínimo estado posible y todo lo demás derivado en el render.',
      file: 'web/src/paginas/Agenda.tsx'
    },
    {
      t: 'Levantar el estado y componer',
      obj: 'Repartir el estado en el nivel correcto del árbol de componentes y entender el patrón de componente controlado.',
      why: 'Es la decisión estructural más importante de una app React y la que define si el código escala o se convierte en un nudo. Explicar bien "levantar el estado" en una entrevista demuestra que entiendes el flujo de datos unidireccional.',
      study: { r: 1, what: 'Lee Sharing State Between Components y Preserving and Resetting State. Unos 20 minutos. Busca una cosa: por qué cambiar la key de un componente reinicia su estado y para qué sirve eso.',
        pasos: [
          'Abre "Sharing State Between Components" (~8 min): levantar el estado al ancestro común más cercano.',
          'Fíjate en la idea de componente controlado frente a no controlado.',
          'Abre "Preserving and Resetting State" (~8 min): React guarda el estado según la posición en el árbol.',
          'Busca la parte de resetear el estado con una key distinta y prueba el ejemplo.',
          'Decide en tu agenda qué componente es el dueño de la fecha seleccionada y por qué.'
        ] },
      ex: {
        title: 'Estado en el ancestro común más cercano',
        body: `// REGLA: el estado vive en el ancestro común más cercano de todos los que lo necesitan.
// Ni más arriba (renders innecesarios, props atravesando capas), ni más abajo
// (los hermanos no pueden verlo).

// COMPONENTE CONTROLADO: no tiene estado propio, lo recibe y avisa de los cambios.
interface PropsBuscador {
  valor: string;
  onCambiar: (v: string) => void;
}

export function Buscador({ valor, onCambiar }: PropsBuscador) {
  return (
    <input
      type="search"
      value={valor}                                   // el valor viene de fuera
      onChange={e => onCambiar(e.target.value)}       // el cambio sale hacia fuera
      placeholder="Buscar mascota o dueño"
    />
  );
}
// Ventaja: el padre siempre sabe lo que hay escrito y puede limpiarlo, validarlo
// o sincronizarlo con la URL. Un input no controlado (sin value) es una caja negra.

// EL PADRE ORQUESTA, LOS HIJOS PRESENTAN
export function PaginaAgenda() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [idSeleccionada, setIdSeleccionada] = useState<string | null>(null);

  const termino = busqueda.trim().toLowerCase();
  const visibles = termino === ''
    ? citas
    : citas.filter(c =>
        c.mascotaNombre.toLowerCase().includes(termino) ||
        c.duenoNombre.toLowerCase().includes(termino));

  const seleccionada = citas.find(c => c.id === idSeleccionada) ?? null;

  return (
    <div className="agenda">
      <Buscador valor={busqueda} onCambiar={setBusqueda} />
      <TablaCitas
        citas={visibles}
        idSeleccionada={idSeleccionada}
        onSeleccionar={setIdSeleccionada}
      />
      {seleccionada && (
        <PanelDetalle
          key={seleccionada.id}          // <-- clave: reinicia el panel al cambiar de cita
          cita={seleccionada}
          onCerrar={() => setIdSeleccionada(null)}
        />
      )}
    </div>
  );
}

// POR QUÉ EL key EN PanelDetalle
// Si PanelDetalle tiene un formulario de notas con su propio useState y cambias
// de cita, React reutiliza la instancia y el texto escrito para la cita 1 aparece
// en la cita 2. Cambiar la key le dice a React: esto es otro componente, empieza
// de cero. Es la forma idiomática de reiniciar estado.

// PROP DRILLING: si una prop atraviesa más de 2-3 niveles sin que los
// intermedios la usen, es señal de que el estado está demasiado arriba o
// de que te hace falta composición con children.`
      },
      steps: [
        'Extrae el buscador a su propio componente controlado y comprueba que el padre sigue siendo el único dueño del texto escrito.',
        'Añade el PanelDetalle con un formulario de notas que tenga su propio useState interno. Cambia de cita sin poner key y observa el bug: el texto se queda de la cita anterior.',
        'Ahora añade key={seleccionada.id} y comprueba que el formulario se reinicia. Acabas de usar la herramienta oficial para reiniciar estado.',
        'Dibuja en docs/frontend.md el árbol de componentes de la página y marca en qué nodo vive cada pieza de estado y por qué ese es el ancestro común más cercano.',
        'Busca en tu código si alguna prop atraviesa más de dos niveles sin usarse por el camino. Si la hay, anótala: es candidata a contexto o a composición con children.'
      ],
      vet: [
        'En VetCare la página de agenda es el ancestro común de buscador, tabla y panel de detalle, así que ahí viven los tres estados. El formulario de notas dentro del panel es estado local legítimo: nadie más lo necesita.',
        'Añade a docs/frontend.md la regla de decisión en una frase y el ejemplo de la key, que es lo que te va a ahorrar horas de depuración en el futuro.'
      ],
      edge: [
        'Levantar el estado demasiado arriba hace que todo el árbol se vuelva a renderizar por un cambio local. Súbelo solo hasta donde hace falta, ni un nivel más.',
        'Un input controlado sin onChange queda congelado y React avisa por consola. O lo controlas de verdad con value y onChange, o usas defaultValue y lo dejas no controlado.',
        'Usar el índice del array como key en una lista provoca bugs al reordenar o eliminar elementos, porque React asocia el estado al índice y no al elemento. Usa siempre el id real.'
      ],
      quiz: [
        { q: '¿Dónde debe vivir una pieza de estado compartida por dos componentes hermanos?', a: 'En su ancestro común más cercano. Más abajo los hermanos no pueden verla, y más arriba provoca renders innecesarios y obliga a pasar props por componentes que no las usan. El ancestro común más cercano es el punto exacto de equilibrio.' },
        { q: '¿Qué es un componente controlado y qué ventaja da?', a: 'Es un componente que no guarda su valor sino que lo recibe por props y notifica los cambios hacia arriba. La ventaja es que el padre siempre conoce el valor actual y puede limpiarlo, validarlo o sincronizarlo con otras partes, en lugar de tener que preguntarle al DOM.' },
        { q: '¿Para qué sirve cambiar la key de un componente?', a: 'Para decirle a React que lo trate como un componente distinto y por tanto descarte su estado interno y lo cree de cero. Es la forma idiomática de reiniciar un formulario al cambiar el elemento que está editando, sin escribir ningún efecto.' },
        { q: '¿Por qué usar el índice del array como key da problemas?', a: 'Porque React asocia la identidad del componente a la key, y si usas el índice, al eliminar o reordenar elementos la posición 0 pasa a contener otro dato mientras React cree que es el mismo. El estado interno y el foco se quedan pegados a la posición en vez de al elemento.' }
      ],
      out: 'Un árbol de componentes con el estado colocado en el nivel correcto y el patrón de key aplicado donde hace falta.',
      file: 'web/src/paginas/Agenda.tsx'
    },
    {
      t: 'Efectos: cuando los necesitas de verdad',
      obj: 'Identificar los pocos casos donde useEffect es la herramienta correcta y eliminar todos los demás.',
      why: 'El uso excesivo de useEffect es la causa número uno de bugs, bucles infinitos y renders dobles en aplicaciones React reales. Saber decir "eso no necesita un efecto" es una de las señales más claras de experiencia.',
      study: { r: 3, what: 'Lee You Might Not Need an Effect entera. Unos 25 minutos, es larga pero es la mejor inversión de la semana. Busca una cosa: la lista de casos que NO necesitan efecto y el único que sí.',
        pasos: [
          'Lee "How to remove unnecessary Effects" (~4 min): los efectos son para sincronizar con sistemas externos.',
          'Lee "Updating state based on props or state" y "Caching expensive calculations" (~5 min).',
          'Lee "Resetting all state when a prop changes" y "Sharing logic between event handlers" (~5 min).',
          'Lee "Sending a POST request" y "Chains of computations" (~5 min).',
          'Lee "Fetching data" (~4 min): el caso donde un efecto sí tiene sentido, con su limpieza.',
          'Busca cada useEffect de tu código y clasifícalo con lo que acabas de leer.'
        ] },
      ex: {
        title: 'Cuatro efectos innecesarios y uno legítimo',
        body: `// INNECESARIO 1: calcular algo a partir de props o estado
const [visibles, setVisibles] = useState<Cita[]>([]);
useEffect(() => { setVisibles(citas.filter(c => c.estado === filtro)); }, [citas, filtro]);
// CORRECTO: calcularlo en el render. Un render extra menos y cero desincronización.
const visibles = citas.filter(c => c.estado === filtro);

// INNECESARIO 2: reaccionar a una interacción del usuario
useEffect(() => { if (citaCancelada) mostrarAviso('Cita cancelada'); }, [citaCancelada]);
// CORRECTO: hacerlo en el manejador del evento. Ahí es donde ocurrió la acción.
function cancelar(id: string) {
  setCitas(p => p.map(c => c.id === id ? { ...c, estado: 'cancelada' as const } : c));
  mostrarAviso('Cita cancelada');
}

// INNECESARIO 3: reiniciar estado al cambiar una prop
useEffect(() => { setNotas(''); }, [cita.id]);
// CORRECTO: usar key en el componente padre, como viste ayer.

// INNECESARIO 4: avisar al padre de un cambio de estado
useEffect(() => { onCambio(seleccion); }, [seleccion]);
// CORRECTO: llamar a onCambio en el mismo manejador que cambia la selección.

// LEGÍTIMO: sincronizar con un sistema EXTERNO a React
// (red, temporizadores, suscripciones, DOM directo, localStorage)
// Llama a GET /api/v1/agenda?dia=2026-03-10, que devuelve { datos: [...] }
// con las filas de la consulta AgendaDelDia de la semana 15.
export function useCitasDelDia(dia: string) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);   // subirla = volver a pedir

  useEffect(() => {
    const control = new AbortController();
    setCargando(true);
    setError(null);

    fetch('/api/v1/agenda?dia=' + dia, { signal: control.signal })
      .then(r => {
        if (!r.ok) throw new Error('Error ' + r.status);
        return r.json() as Promise<{ datos: Cita[] }>;   // el sobre de la semana 11
      })
      .then(json => setCitas(json.datos))
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setCargando(false));

    return () => control.abort();    // limpieza: cancela si el día cambia o se desmonta
  }, [dia, version]);

  // recargar sirve para el botón "Reintentar" y tras crear una cita
  return { citas, cargando, error, recargar: () => setVersion(v => v + 1) };
}
// Las tres piezas obligatorias de un efecto de red:
//   1. un AbortController para cancelar
//   2. la función de limpieza que lo aborta
//   3. estados explícitos de cargando y error
// Sin la limpieza, cambiar de día rápido puede hacer que la respuesta lenta
// del día antiguo pise a la del día nuevo. Eso es una condición de carrera.`
      },
      steps: [
        'Recorre todos los useEffect que hayas escrito y clasifica cada uno según los cuatro casos innecesarios. Elimina los que encajen y anota cuántos quedaron.',
        'Escribe el hook useCitasDelDia exactamente como en el ejemplo, con AbortController y limpieza. Ponlo en web/src/hooks/.',
        'Conecta la página de agenda a tu API real. Primero añade a la API el endpoint GET /api/v1/agenda?dia= que llama a AgendaDelDia (semana 15) y devuelve { datos }. Declara el record como FilaAgendaDto(Guid Id, DateTime Inicio, DateTime Fin, string MascotaNombre, string DuenoNombre, string Estado) para que el JSON coincida con el tipo Cita. Como el backend corre en otro puerto, añade en vite.config.ts: server: { proxy: { "/api": "http://localhost:5xxx" } }, con el puerto que muestra dotnet run.',
        'Provoca la condición de carrera a propósito: añade un retardo artificial en el backend y cambia de día dos veces rápido. Luego quita el control.abort() y comprueba que ahora sí se corrompen los datos.',
        'Comprueba que React en modo estricto ejecuta el efecto dos veces en desarrollo y que tu código lo soporta sin duplicar peticiones visibles gracias a la limpieza. Ese doble montaje existe justo para detectar efectos mal escritos.'
      ],
      vet: [
        'La agenda de VetCare debe mostrar tres estados visuales distintos: cargando con un esqueleto, error con un mensaje y un botón de reintentar, y vacío con un texto útil. Nunca una pantalla en blanco.',
        'Anota en docs/frontend.md los efectos que eliminaste y por qué. Esa lista es la prueba de que entendiste la lección.'
      ],
      edge: [
        'Un efecto que actualiza un estado presente en su propio array de dependencias provoca un bucle infinito. Si te pasa, casi siempre la solución no es ajustar las dependencias sino eliminar el efecto.',
        'Las funciones y objetos declarados dentro del componente son nuevos en cada render, así que ponerlos como dependencia reinicia el efecto siempre. Muévelos fuera, o usa useCallback, o replantea si el efecto hace falta.',
        'No vacíes el array de dependencias para silenciar el aviso del linter. Ese aviso casi siempre está señalando un bug real de valores obsoletos en una clausura.'
      ],
      quiz: [
        { q: '¿Para qué sirve realmente useEffect?', a: 'Para sincronizar tu componente con un sistema externo a React: la red, un temporizador, una suscripción, el almacenamiento local o el DOM directo. No sirve para transformar datos ni para reaccionar a interacciones del usuario, que se resuelven en el render y en los manejadores respectivamente.' },
        { q: '¿Por qué calcular un valor derivado en el render es mejor que hacerlo en un efecto?', a: 'Porque el efecto se ejecuta después del render, así que primero pintas la pantalla con el valor viejo y luego la vuelves a pintar con el nuevo: dos renders y un parpadeo. Calculándolo en el render el valor siempre es coherente con el estado actual y no hay posibilidad de desincronización.' },
        { q: '¿Qué condición de carrera previene el AbortController en una petición?', a: 'La de que una petición lenta lanzada antes responda después de una más reciente y sobrescriba los datos correctos con datos viejos. Al abortar la anterior en la función de limpieza, solo la última petición vigente puede llegar a actualizar el estado.' },
        { q: '¿Por qué React en modo estricto ejecuta los efectos dos veces en desarrollo?', a: 'Para forzar que descubras efectos sin función de limpieza correcta. Si tu efecto monta, desmonta y vuelve a montar sin dejar basura ni duplicar trabajo visible, está bien escrito. Si al duplicarse rompe algo, acabas de encontrar un bug que aparecerá en producción de otra forma.' }
      ],
      out: 'Un hook de datos con cancelación correcta, la agenda conectada a la API real y cero efectos innecesarios.',
      file: 'web/src/hooks/useCitasDelDia.ts'
    },
    {
      t: 'Formularios y validación',
      obj: 'Construir el formulario de nueva cita con validación en cliente, estados de envío y traducción de los errores que devuelve tu API.',
      why: 'Los formularios son donde más se nota la calidad de una interfaz y donde más errores de usabilidad se cometen. Además aquí se cierra el círculo con el backend: tu RFC 9457 de la semana 11 tiene que llegar a la pantalla de forma útil.',
      study: { r: 4, what: 'Lee la página completa, es justo un formulario con validación y respuesta del servidor. Unos 15 minutos. Busca una cosa: por qué se modela el formulario como estados (typing, submitting, success) en vez de encender y apagar booleanos sueltos.',
        pasos: [
          'Lee la comparación entre UI imperativa y declarativa del principio (~4 min).',
          'Sigue los cinco pasos con el ejemplo del formulario (~8 min): identificar estados visuales, qué los dispara, representarlos con useState, quitar estado no esencial y conectar los eventos.',
          'Fíjate en cómo sustituye varios booleanos por una sola variable status.',
          'Escribe los estados visuales de tu formulario de nueva cita antes de escribir el componente.'
        ] },
      ex: {
        title: 'Formulario controlado con validación y errores del servidor',
        body: `interface FormularioCita {
  mascotaId: string;
  veterinarioId: string;
  inicio: string;
  motivo: string;
}

type ErroresCampo = Partial<Record<keyof FormularioCita, string>>;

const VACIO: FormularioCita = { mascotaId: '', veterinarioId: '', inicio: '', motivo: '' };

function validar(f: FormularioCita): ErroresCampo {
  const e: ErroresCampo = {};
  if (!f.mascotaId)       e.mascotaId = 'Elige una mascota';
  if (!f.veterinarioId)   e.veterinarioId = 'Elige un veterinario';
  if (!f.inicio)          e.inicio = 'Indica fecha y hora';
  else if (new Date(f.inicio) < new Date()) e.inicio = 'No se puede agendar en el pasado';
  if (f.motivo.trim().length < 3) e.motivo = 'Describe el motivo (mínimo 3 caracteres)';
  return e;
}

export function FormularioNuevaCita({ onCreada }: { onCreada: () => void }) {
  const [valores, setValores] = useState<FormularioCita>(VACIO);
  const [errores, setErrores] = useState<ErroresCampo>({});
  const [tocados, setTocados] = useState<Set<string>>(new Set());
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  // UNA clave por cita que se intenta crear: si el usuario reintenta tras
  // un error de red, se reenvía la MISMA y el servidor no duplica (semana 14)
  const clave = useRef(crypto.randomUUID());

  function cambiar<K extends keyof FormularioCita>(campo: K, valor: string) {
    const nuevos = { ...valores, [campo]: valor };   // copia, nunca mutación
    setValores(nuevos);
    setErrores(validar(nuevos));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();                               // si no, el navegador recarga
    const errs = validar(valores);
    setErrores(errs);
    setTocados(new Set(Object.keys(valores)));        // al enviar, muestra todos
    if (Object.keys(errs).length > 0) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const r = await fetch('/api/v1/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': clave.current,
        },
        body: JSON.stringify({
          mascotaId: valores.mascotaId,               // los UUID viajan como texto
          veterinarioId: valores.veterinarioId,
          inicio: new Date(valores.inicio).toISOString(),
          motivo: valores.motivo.trim(),
        }),
      });

      if (r.status === 409) {
        setErrorGeneral('Ese veterinario ya tiene una cita a esa hora. Elige otro hueco.');
        return;
      }
      if (!r.ok) {
        // RFC 9457 de la semana 11 (si el cuerpo no es JSON, objeto vacío)
        const problema = await r.json().catch(() => ({}));
        setErrorGeneral(problema.detail ?? problema.title ?? 'No se pudo crear la cita.');
        return;
      }

      clave.current = crypto.randomUUID();           // la próxima cita, clave nueva
      onCreada();                                     // el padre llama a recargar()
      setValores(VACIO);
      setTocados(new Set());
    } catch {
      setErrorGeneral('No hay conexión con el servidor. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const mostrar = (c: keyof FormularioCita) => tocados.has(c) ? errores[c] : undefined;

  return (
    <form onSubmit={enviar} noValidate>
      <Campo
        etiqueta="Motivo"
        valor={valores.motivo}
        error={mostrar('motivo')}
        onCambiar={v => cambiar('motivo', v)}
        onSalir={() => setTocados(t => new Set(t).add('motivo'))}
      />
      {errorGeneral && <p role="alert" className="error-general">{errorGeneral}</p>}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Creando...' : 'Crear cita'}
      </button>
    </form>
  );
}`
      },
      steps: [
        'Construye el formulario de nueva cita completo con los cuatro campos, usando un solo objeto en estado y la función cambiar genérica con tipos.',
        'Implementa el patrón de campos tocados: el error de un campo solo se muestra cuando el usuario ya salió de él o cuando pulsa enviar. Mostrar errores mientras escribe la primera letra es hostil.',
        'Deshabilita el botón mientras enviando es true y cambia su texto. Pulsa dos veces rápido para comprobar que no se crean dos citas.',
        'Provoca el 409 de solape que implementaste en la semana 12 y verifica que el mensaje que ve el usuario es útil y en español, no el JSON crudo de problem details.',
        'Apaga el backend y envía el formulario. Comprueba que ves el mensaje de sin conexión y que la aplicación no se rompe.'
      ],
      vet: [
        'La Idempotency-Key del formulario debe generarse una sola vez por cita que se intenta crear (por eso va en un useRef), no en cada envío ni en cada render. Si el usuario reintenta tras un error de red, la misma clave evita la cita duplicada: ahí es donde el trabajo de la semana 14 da su fruto.',
        'Añade a docs/frontend.md la tabla de errores: código HTTP que devuelve la API, mensaje que ve el usuario. Esa traducción es tuya y es parte del producto.'
      ],
      edge: [
        'Sin e.preventDefault() el navegador recarga la página al enviar y pierdes todo el estado. Es el fallo número uno con formularios en React.',
        'La validación de cliente es para la experiencia de usuario, nunca para la seguridad. El servidor tiene que validar lo mismo otra vez porque cualquiera puede llamar a tu API sin pasar por el formulario.',
        'Un botón de enviar sin deshabilitar permite dobles envíos con un doble clic. Deshabilitarlo es la primera barrera; la Idempotency-Key es la que garantiza de verdad que no se duplique.'
      ],
      quiz: [
        { q: '¿Por qué solo se muestran los errores de los campos tocados?', a: 'Porque marcar en rojo un campo que el usuario todavía no ha rellenado es hostil y confuso: le dices que se equivocó antes de darle oportunidad de acertar. Mostrarlos cuando sale del campo o cuando intenta enviar respeta el ritmo natural de quien rellena el formulario.' },
        { q: '¿Por qué la validación de cliente no sustituye a la del servidor?', a: 'Porque el cliente es código que corre en una máquina que no controlas y cualquiera puede llamar a la API directamente con curl saltándose el formulario entero. La validación de cliente mejora la experiencia dando respuesta inmediata; la del servidor es la única que protege los datos.' },
        { q: '¿Qué papel juega aquí la Idempotency-Key de la semana 14?', a: 'Garantiza que si el usuario reintenta tras un error de red, donde no sabe si la petición llegó, no se cree una segunda cita. Es la red de seguridad real, mientras que deshabilitar el botón solo evita el doble clic accidental y no cubre el reintento manual.' },
        { q: '¿Cómo debe traducirse un 409 de solape a la pantalla?', a: 'Como un mensaje en lenguaje natural que explique qué pasa y qué puede hacer el usuario, por ejemplo que ese veterinario ya tiene una cita a esa hora y que elija otro hueco. Mostrar el JSON de problem details o un código numérico traslada al usuario un problema técnico que no puede interpretar.' }
      ],
      out: 'Formulario de nueva cita con validación progresiva, protección contra doble envío y errores del servidor traducidos.',
      file: 'web/src/componentes/FormularioNuevaCita.tsx'
    },
    {
      t: 'Agenda completa de VetCare (examen de la semana)',
      obj: 'Integrar todo en una pantalla que funcione de verdad contra tu API y revisarla con criterios de calidad de frontend.',
      why: 'Es tu primera pantalla real conectada a tu propio backend, de punta a punta. Poder enseñarla funcionando y explicar cada decisión de estado es exactamente lo que pide una entrevista de puesto full stack.',
      study: { r: 1, what: 'Repasa en diagonal toda la sección Managing State comprobando que reconoces cada concepto en tu propio código. Unos 10 minutos. Busca una cosa: algún patrón de la documentación que todavía no hayas aplicado y que te vendría bien.',
        pasos: [
          'Abre la página del capítulo y lee la lista de temas (~2 min).',
          'Para cada tema escribe dónde aparece en tu agenda: estructura del estado, estado compartido, reset con key, reducer y contexto.',
          'Abre "Extracting State Logic into a Reducer" (~6 min) si tu agenda tiene muchos setState relacionados.',
          'Anota un patrón que aún no aplicas y decide si hoy merece la pena.'
        ] },
      ex: {
        title: 'Revisión de la pantalla de agenda',
        body: `FUNCIONALIDAD MÍNIMA
  [ ] Lista las citas del día leyendo de GET /api/v1/agenda?dia=
  [ ] Permite cambiar de día y recarga correctamente
  [ ] Busca por nombre de mascota o de dueño sin ir al servidor
  [ ] Filtra por estado
  [ ] Crea una cita nueva y aparece en la lista sin recargar la página
  [ ] Cancela una cita con confirmación previa
  [ ] Muestra el detalle de la cita seleccionada

LOS CUATRO ESTADOS DE TODA PANTALLA CON DATOS
  [ ] Cargando  -> esqueleto o indicador, nunca pantalla en blanco
  [ ] Error     -> mensaje claro y botón de reintentar
  [ ] Vacío     -> texto útil, no una tabla con cero filas y sin explicación
  [ ] Con datos -> el caso normal
  Si te falta alguno, la pantalla no está terminada.

CALIDAD DE ESTADO
  [ ] Ningún estado duplica algo derivable (pasa las tres preguntas a cada useState)
  [ ] Ningún estado guarda un objeto que ya está en una lista (guarda el id)
  [ ] Cada estado vive en el ancestro común más cercano
  [ ] Todos los useEffect sincronizan con algo externo; ninguno transforma datos
  [ ] Toda petición tiene AbortController y limpieza

ACCESIBILIDAD MÍNIMA
  [ ] Se puede recorrer todo el formulario con la tecla Tab en orden lógico
  [ ] Cada input tiene su <label htmlFor> asociado
  [ ] Los errores usan role="alert" para que un lector de pantalla los anuncie
  [ ] Los botones son <button> y los enlaces son <a>, nunca un <div> con onClick
  [ ] El contraste de texto es legible (comprueba con las devtools del navegador)

TYPESCRIPT
  [ ] Cero any en todo el proyecto. Busca: grep -rn ": any" src/
  [ ] npx tsc -b pasa sin errores (con el tsconfig de Vite, "tsc --noEmit" a secas no comprueba nada)
  [ ] Los tipos del frontend coinciden campo a campo con los DTOs de la API

PRUEBA MANUAL FINAL (hazla de verdad, en el navegador)
  1. Carga la agenda de hoy con el backend apagado -> mensaje de error y reintentar
  2. Enciende el backend y pulsa reintentar -> carga
  3. Crea una cita que solape con otra -> mensaje claro de 409
  4. Crea una cita válida -> aparece en la lista al instante
  5. Cancela esa cita -> cambia de estado sin recargar
  6. Busca por una letra que no exista -> estado vacío con texto útil
  7. Recorre todo con Tab, sin tocar el ratón -> todo accesible`
      },
      steps: [
        'Completa la funcionalidad mínima de la lista hasta que los siete puntos estén hechos.',
        'Implementa los cuatro estados de pantalla. El estado vacío es el que casi todo el mundo olvida: escribe un texto que diga que no hay citas y ofrezca crear una.',
        'Recorre la lista de calidad de estado punto por punto, con el código delante. Arregla lo que falle en lugar de marcarlo igualmente.',
        'Ejecuta npx tsc -b y busca any en todo el proyecto. Deja ambos limpios.',
        'Haz la prueba manual completa de siete pasos en el navegador, incluido el recorrido con Tab, y anota en docs/frontend.md lo que encontraste.'
      ],
      vet: [
        'Esta pantalla es el primer entregable visible de VetCare. Hazle una captura y guárdala en docs/capturas/ : te va a servir cuando quieras enseñar el proyecto.',
        'Pulsa «Marcar para repasar» y vuelve a leer docs/frontend.md dentro de una semana.'
      ],
      edge: [
        'Una pantalla sin estado de carga parece rota en conexiones lentas, aunque funcione perfectamente. El usuario no distingue lento de colgado si no le das ninguna señal.',
        'Confiar en que la API siempre responde bien es el error clásico del frontend recién conectado. Tu backend tiene timeouts y circuit breakers: tu frontend debe tener un camino para cada uno de esos fallos.',
        'La accesibilidad no es un extra que se añade al final. Un div con onClick no recibe foco, no responde a Enter y es invisible para un lector de pantalla: cambiarlo a button al final del proyecto suele romper los estilos.'
      ],
      quiz: [
        { q: '¿Cuáles son los cuatro estados que toda pantalla con datos remotos debe cubrir?', a: 'Cargando, error, vacío y con datos. Olvidar cargando hace que la pantalla parezca rota; olvidar error deja al usuario sin salida; y olvidar vacío muestra una tabla sin filas que no explica si no hay datos o si algo falló.' },
        { q: '¿Por qué el estado vacío necesita un texto propio y no basta con una tabla sin filas?', a: 'Porque una tabla vacía es ambigua: el usuario no sabe si no hay citas ese día, si el filtro es demasiado estrecho o si la carga falló en silencio. Un texto explícito que diga que no hay citas y ofrezca crear una convierte un callejón sin salida en una acción.' },
        { q: '¿Por qué un div con onClick es un problema de accesibilidad?', a: 'Porque no recibe foco con Tab, no responde a Enter ni a espacio, y los lectores de pantalla no lo anuncian como algo pulsable. Un elemento button trae todo ese comportamiento gratis, y sustituirlo al final del proyecto suele romper estilos que se escribieron sobre el div.' },
        { q: 'Resume qué aprendiste esta semana en una frase.', a: 'Que en React la interfaz es una función del estado, así que el trabajo real no está en escribir JSX sino en modelar el estado mínimo y colocarlo en el nivel correcto, derivando todo lo demás en el render y reservando los efectos solo para hablar con el mundo exterior.' }
      ],
      out: 'La agenda de VetCare funcionando contra la API real, con los cuatro estados, sin any y accesible con teclado.',
      file: 'web/src/paginas/Agenda.tsx'
    }
  ]
}
]);
