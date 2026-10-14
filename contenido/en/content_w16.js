window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 16,
  phase: 'Frontend',
  title: 'React and TypeScript: thinking of the UI as state',
  idea: 'You have an API that works, is resilient and is well architected. Now someone has to use it. The classic mistake when coming to React from the backend is treating it as HTML templates with JavaScript inside. It is not: React is a function that turns state into UI. If the state is well modelled, the UI almost writes itself; if it is badly modelled, you end up fighting useEffect and impossible bugs. This week you learn to model state, not to decorate screens.',
  res: [
    { t: 'React — Describing the UI',
      u: 'https://react.dev/learn/describing-the-ui',
      note: 'The new official documentation, which is excellent. This section covers components, props and conditional rendering with interactive examples you can play with on the page itself.' },
    { t: 'React — Managing State',
      u: 'https://react.dev/learn/managing-state',
      note: 'The most important section of the whole documentation. Structuring state, lifting it and when to use a reducer. It is what separates someone who knows React from someone who copies examples.' },
    { t: 'TypeScript Handbook — Everyday Types',
      u: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
      note: 'The types you will use 95% of the time. Coming from C# it will feel familiar, but pay attention to union types, which have no direct equivalent.' },
    { t: 'React — You Might Not Need an Effect',
      u: 'https://react.dev/learn/you-might-not-need-an-effect',
      note: 'The page that prevents the most bugs in the whole documentation. Read it even if you think you do not need it: almost everyone overuses useEffect.' },
    { t: 'React — Reacting to Input with State', u: 'https://react.dev/learn/reacting-to-input-with-state', note: 'A form modelled as states: typing, submitting, error and success.' }
  ],
  days: [
    {
      t: 'Components, props and JSX with types',
      obj: 'Write React components typed with TypeScript and understand why a component is just a function from props to UI.',
      why: 'It is the foundation of everything and where you see fastest whether someone comes from the backend with good habits. A well typed component explains itself and the editor corrects you before you run it, just as in C#.',
      study: { r: 0, what: 'Read the pages Your First Component, Passing Props to a Component and Conditional Rendering. About 20 minutes. Look for one thing: why props are read-only and what happens if you try to change them.',
        pasos: [
          'From the chapter page open "Your First Component" (~6 min): a component is a function that returns JSX.',
          'Open "Passing Props to a Component" (~7 min): props are read-only; to change something you use state.',
          'Open "Conditional Rendering" (~5 min).',
          'Write the type of PetCard’s props in TypeScript before writing the component.'
        ] },
      ex: {
        title: 'From function to typed component',
        body: `// from VetCare's root folder:
// npm create vite@latest web -- --template react-ts
// cd web && npm install && npm run dev

// src/types.ts  -- the domain types, a mirror of your API DTOs
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'attended' | 'cancelled';

export interface Appointment {
  id: string;            // the UUID the API sends
  start: string;         // ISO 8601, as the API sends it
  end: string;
  petName: string;
  ownerName: string;
  status: AppointmentStatus;
}

// src/components/StatusBadge.tsx
// A component is A FUNCTION: it receives props, it returns JSX. Nothing else.
interface StatusBadgeProps {
  status: AppointmentStatus;
}

const colours: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue',
  confirmed: 'bg-green',
  attended:  'bg-grey',
  cancelled: 'bg-red',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={'badge ' + colours[status]}>{status}</span>;
}
// Record<AppointmentStatus, string> forces you to cover the four statuses.
// If tomorrow you add 'no_show' to the union type, TypeScript flags an error here.
// That is exhaustiveness: the same as a switch with no default in C#.

// src/components/AppointmentRow.tsx
interface AppointmentRowProps {
  appointment: Appointment;
  onCancel: (id: string) => void;     // callbacks are typed too
}

export function AppointmentRow({ appointment, onCancel }: AppointmentRowProps) {
  const time = new Date(appointment.start).toLocaleTimeString('en', {
    hour: '2-digit', minute: '2-digit',
  });
  const canCancel = appointment.status === 'scheduled' || appointment.status === 'confirmed';

  return (
    <tr>
      <td>{time}</td>
      <td>{appointment.petName}</td>
      <td>{appointment.ownerName}</td>
      <td><StatusBadge status={appointment.status} /></td>
      <td>
        {canCancel && (
          <button onClick={() => onCancel(appointment.id)}>Cancel</button>
        )}
      </td>
    </tr>
  );
}
// Notice: AppointmentRow does not know WHAT happens on cancel. It only reports it.
// The parent decides. It is the same idea as a domain event: announce without
// knowing who listens.`
      },
      steps: [
        'Create the project with Vite and the react-ts template inside VetCare’s web/ folder. Run npm run dev and confirm you see the default page.',
        'Create src/types.ts with the Appointment, Pet and Owner interfaces, copying exactly the fields your week 12 API returns. If they do not match, your front end will lie.',
        'Write StatusBadge using Record<AppointmentStatus, string> and check exhaustiveness: add a fifth status to the union type and check that TypeScript flags an error on the Record.',
        'Write AppointmentRow and AppointmentTable, with AppointmentTable receiving an array of appointments and passing the onCancel callback down. Use fake data in a constant array, no API yet.',
        'Open React DevTools in the browser, select an AppointmentRow and look at its props. Check that you see exactly what you wrote in the interface.'
      ],
      vet: [
        'This week’s target screen is VetCare’s daily schedule: a table of appointments with time, pet, owner, status and a cancel button. It is the natural consumer of the DailyAgenda query you wrote last week.',
        'Write in docs/frontend.md the front-end types and which API DTO each one comes from. That correspondence is what breaks silently when you change the backend.'
      ],
      edge: [
        'Do not modify props. They are read-only and mutating them does not trigger a re-render, so you will see stale data on screen with no visible error. If something has to change, it is state, not a prop.',
        'Avoid typing props as any or as an untyped object to get by. The moment you write any, you lose exactly the advantage you chose TypeScript for.',
        'In JSX the value 0 IS rendered: {appointments.length && <Table/>} prints a 0 on screen when the array is empty. Always use {appointments.length > 0 && ...}.'
      ],
      quiz: [
        { q: 'What exactly is a React component?', a: 'A function that receives a props object and returns a description of UI in JSX. It is not a template or a class with a life cycle: given the same state and props it must always produce the same output, which makes it predictable and testable.' },
        { q: 'Why are props read-only?', a: 'Because they belong to the parent component, which created them and controls when they change. If a child mutated them, React would not notice the change and would not re-render, so you would see stale data with no error. Data always flows from parent to child.' },
        { q: 'What advantage does Record<AppointmentStatus, string> give over a loose object?', a: 'TypeScript forces you to cover every variant of the union type. If tomorrow you add a new status, the compiler flags an error everywhere it is missing, just like an exhaustive switch in C#. It is the type acting as an automatic checklist.' },
        { q: 'Why does AppointmentRow receive onCancel instead of calling the API directly?', a: 'So the component stays a pure presentation function, reusable and easy to test. By reporting upwards instead of acting, the component with the context decides what cancelling means, just as a domain event decouples the announcer from whoever reacts.' }
      ],
      out: 'A React+TS project started with domain types and an appointment table drawn with fake data.',
      file: 'web/src/components/'
    },
    {
      t: 'State and events: using useState well',
      obj: 'Decide what is state and what is not, and avoid the most common beginner mistake: duplicating in state something that can be calculated.',
      why: 'Most React bugs are not React bugs: they are badly modelled states that can end up in impossible combinations. Knowing how to reduce state to the minimum is the skill that shows most when reviewing front-end code.',
      study: { r: 1, what: 'Read State: A Component’s Memory and, above all, Choosing the State Structure. About 20 minutes. Look for one thing: the principle of avoiding redundant state and the example of why storing fullName alongside firstName and lastName is a mistake.',
        pasos: [
          'From the chapter page open "Choosing the State Structure" (~10 min).',
          'Copy its principles, especially avoiding redundant state and avoiding duplication in state.',
          'Find the fullName example: why it is calculated during render instead of being stored.',
          'If useState still does not feel comfortable, first read State: A Component\'s Memory in the Adding Interactivity chapter (~6 min).',
          'List the state variables of your schedule screen and cross out the ones that can be calculated from others.'
        ] },
      ex: {
        title: 'Minimal state vs duplicated state',
        body: `// BAD: three pieces of state that can contradict each other
function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);                   // derivable from appointments.length
  const [hasAppointments, setHasAppointments] = useState(false);   // derivable too
  const [selected, setSelected] = useState<Appointment | null>(null);   // a copy

  // Now every time you change appointments you must remember to update the other three.
  // The day you forget one, the screen says "3 appointments" over a table with 5 rows.
  // And selected keeps stale data when the original appointment changes.
}

// GOOD: a single source of truth, the rest is calculated during render
function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  // Derived. Recalculated on every render and ALWAYS consistent.
  const visible = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const total = visible.length;
  const selected = appointments.find(a => a.id === selectedId) ?? null;

  // Storing the ID instead of the object is the key: if the appointment changes,
  // selected reflects the new version automatically.

  function cancel(id: string) {
    // NEVER mutate the array. React compares by reference.
    setAppointments(previous => previous.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    ));
  }

  return (
    <>
      <FilterSelector value={filter} onChange={setFilter} />
      <p>{total} appointment{total === 1 ? '' : 's'}</p>
      <AppointmentTable appointments={visible} onCancel={cancel} onSelect={setSelectedId} />
      {selected && <DetailPanel appointment={selected} />}
    </>
  );
}

// THE QUESTIONS FOR DECIDING WHETHER SOMETHING IS STATE:
//   1. Does it arrive through props?            -> not state
//   2. Can it be calculated from something else? -> not state, calculate it during render
//   3. Does it stay the same between renders and nobody changes it? -> not state, it is a constant
//   If it survives all three questions, then it is state.`
      },
      steps: [
        'Make yesterday’s AppointmentTable interactive: add the status filter and the counter, calculating both during render instead of storing them in state.',
        'Implement cancel with the immutable update pattern from the example. Check in React DevTools that the array is a new object after each change.',
        'Do the mutation experiment: write appointments[0].status = "cancelled" and then setAppointments(appointments). See that the screen does not change and understand why: the array’s reference is the same.',
        'Add row selection by storing only the id. Check that when you cancel the selected appointment, the detail panel updates on its own, with no extra code.',
        'Apply the three questions to every useState you have written and delete the ones that do not survive. Note in docs/frontend.md how many you removed.'
      ],
      vet: [
        'VetCare’s schedule needs exactly three pieces of state: the list of appointments, the selected id and the filter. Run any fourth useState through the three questions before accepting it.',
        'Write in docs/frontend.md the rule you just learned in your own words and your own example of derived state you were about to store.'
      ],
      edge: [
        'setState is asynchronous in the sense that it does not update the variable immediately. If you read appointments right after setAppointments, you see the old value. Use the function form setAppointments(previous => ...) whenever the new value depends on the old one.',
        'Storing a whole object in state when it is already in a list creates two copies that drift apart. Store the identifier and find the object during render.',
        'Mutating an array or object in state does not trigger a render because React compares references, not contents. Always use map, filter and the spread operator to create new values.'
      ],
      quiz: [
        { q: 'What are the three questions for deciding whether something should be state?', a: 'If it arrives through props it is not state, because it belongs to the parent. If it can be calculated from another value it is not state, it is calculated during render. If it never changes between renders it is a constant. Only what survives all three is real state.' },
        { q: 'Why is it better to store the selected appointment’s id than the whole object?', a: 'Because the stored object would be a copy frozen at the moment it was selected. If the appointment changes in the list, the copy keeps stale data and the screen shows inconsistent information. By storing the id and finding it during render, you always get the current version.' },
        { q: 'Why does mutating a state array not update the screen?', a: 'Because React decides whether to render by comparing the new value’s reference with the previous one, not its contents. If you mutate the same array the reference does not change, React concludes nothing happened and skips the render even though the data is different.' },
        { q: 'When must you use the function form of setState?', a: 'Whenever the new value depends on the previous one. The state variable in the current scope holds the value of the render in progress, which may be stale if there are several updates in a row. The function form receives the most recent value guaranteed by React.' }
      ],
      out: 'An interactive schedule with the minimum possible state and everything else derived during render.',
      file: 'web/src/pages/Schedule.tsx'
    },
    {
      t: 'Lifting state up and composing',
      obj: 'Place state at the right level of the component tree and understand the controlled component pattern.',
      why: 'It is the most important structural decision in a React app and the one that decides whether the code scales or turns into a knot. Explaining "lifting state up" well in an interview shows you understand one-way data flow.',
      study: { r: 1, what: 'Read Sharing State Between Components and Preserving and Resetting State. About 20 minutes. Look for one thing: why changing a component’s key resets its state and what that is for.',
        pasos: [
          'Open "Sharing State Between Components" (~8 min): lifting state to the closest common ancestor.',
          'Notice the idea of a controlled versus an uncontrolled component.',
          'Open "Preserving and Resetting State" (~8 min): React keeps state according to the position in the tree.',
          'Find the part about resetting state with a different key and try the example.',
          'Decide in your schedule which component owns the selected date and why.'
        ] },
      ex: {
        title: 'State in the closest common ancestor',
        body: `// RULE: state lives in the closest common ancestor of everyone who needs it.
// Not higher (needless renders, props passing through layers), not lower
// (the siblings cannot see it).

// CONTROLLED COMPONENT: it has no state of its own, it receives it and reports changes.
interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="search"
      value={value}                                   // the value comes from outside
      onChange={e => onChange(e.target.value)}        // the change goes outside
      placeholder="Search pet or owner"
    />
  );
}
// Advantage: the parent always knows what is typed and can clear, validate or
// sync it with the URL. An uncontrolled input (no value) is a black box.

// THE PARENT ORCHESTRATES, THE CHILDREN PRESENT
export function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const term = search.trim().toLowerCase();
  const visible = term === ''
    ? appointments
    : appointments.filter(a =>
        a.petName.toLowerCase().includes(term) ||
        a.ownerName.toLowerCase().includes(term));

  const selected = appointments.find(a => a.id === selectedId) ?? null;

  return (
    <div className="schedule">
      <SearchBox value={search} onChange={setSearch} />
      <AppointmentTable
        appointments={visible}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      {selected && (
        <DetailPanel
          key={selected.id}              // <-- key: resets the panel when the appointment changes
          appointment={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

// WHY THE key ON DetailPanel
// If DetailPanel has a notes form with its own useState and you switch
// appointment, React reuses the instance and the text typed for appointment 1
// appears on appointment 2. Changing the key tells React: this is another
// component, start from scratch. It is the idiomatic way to reset state.

// PROP DRILLING: if a prop passes through more than 2-3 levels without the
// middle ones using it, it is a sign the state is too high up or that you
// need composition with children.`
      },
      steps: [
        'Extract the search box into its own controlled component and check that the parent is still the only owner of the typed text.',
        'Add the DetailPanel with a notes form that has its own internal useState. Switch appointment without a key and watch the bug: the text stays from the previous appointment.',
        'Now add key={selected.id} and check that the form resets. You have just used the official tool for resetting state.',
        'Draw the page’s component tree in docs/frontend.md and mark on which node each piece of state lives and why that is the closest common ancestor.',
        'Look in your code for a prop that passes through more than two levels without being used on the way. If there is one, note it: it is a candidate for context or for composition with children.'
      ],
      vet: [
        'In VetCare the schedule page is the common ancestor of the search box, the table and the detail panel, so the three pieces of state live there. The notes form inside the panel is legitimate local state: nobody else needs it.',
        'Add the decision rule in one sentence to docs/frontend.md, plus the key example, which is what will save you hours of debugging in the future.'
      ],
      edge: [
        'Lifting state too high makes the whole tree re-render for a local change. Lift it only as far as needed, not one level more.',
        'A controlled input with no onChange is frozen and React warns in the console. Either really control it with value and onChange, or use defaultValue and leave it uncontrolled.',
        'Using the array index as the key in a list causes bugs when reordering or removing items, because React ties the state to the index and not to the item. Always use the real id.'
      ],
      quiz: [
        { q: 'Where should a piece of state shared by two sibling components live?', a: 'In their closest common ancestor. Lower down the siblings cannot see it, and higher up it causes needless renders and forces props through components that do not use them. The closest common ancestor is exactly the balance point.' },
        { q: 'What is a controlled component and what advantage does it give?', a: 'It is a component that does not store its value but receives it through props and reports changes upwards. The advantage is that the parent always knows the current value and can clear, validate or sync it with other parts, instead of having to ask the DOM.' },
        { q: 'What is changing a component’s key for?', a: 'To tell React to treat it as a different component and therefore discard its internal state and create it from scratch. It is the idiomatic way to reset a form when the item being edited changes, without writing any effect.' },
        { q: 'Why does using the array index as the key cause problems?', a: 'Because React ties the component’s identity to the key, and if you use the index, when you remove or reorder items position 0 now holds different data while React believes it is the same. The internal state and the focus stay stuck to the position instead of the item.' }
      ],
      out: 'A component tree with the state placed at the right level and the key pattern applied where needed.',
      file: 'web/src/pages/Schedule.tsx'
    },
    {
      t: 'Effects: when you really need them',
      obj: 'Identify the few cases where useEffect is the right tool and remove all the others.',
      why: 'Overusing useEffect is the number one cause of bugs, infinite loops and double renders in real React apps. Being able to say "that does not need an effect" is one of the clearest signs of experience.',
      study: { r: 3, what: 'Read the whole of You Might Not Need an Effect. About 25 minutes; it is long but it is the best investment of the week. Look for one thing: the list of cases that do NOT need an effect and the one that does.',
        pasos: [
          'Read "How to remove unnecessary Effects" (~4 min): effects are for synchronising with external systems.',
          'Read "Updating state based on props or state" and "Caching expensive calculations" (~5 min).',
          'Read "Resetting all state when a prop changes" and "Sharing logic between event handlers" (~5 min).',
          'Read "Sending a POST request" and "Chains of computations" (~5 min).',
          'Read "Fetching data" (~4 min): the case where an effect does make sense, with its clean-up.',
          'Find every useEffect in your code and classify it with what you just read.'
        ] },
      ex: {
        title: 'Four unnecessary effects and one legitimate one',
        body: `// UNNECESSARY 1: calculating something from props or state
const [visible, setVisible] = useState<Appointment[]>([]);
useEffect(() => { setVisible(appointments.filter(a => a.status === filter)); }, [appointments, filter]);
// RIGHT: calculate it during render. One render fewer and zero drift.
const visible = appointments.filter(a => a.status === filter);

// UNNECESSARY 2: reacting to a user interaction
useEffect(() => { if (cancelledAppointment) showNotice('Appointment cancelled'); }, [cancelledAppointment]);
// RIGHT: do it in the event handler. That is where the action happened.
function cancel(id: string) {
  setAppointments(p => p.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));
  showNotice('Appointment cancelled');
}

// UNNECESSARY 3: resetting state when a prop changes
useEffect(() => { setNotes(''); }, [appointment.id]);
// RIGHT: use a key on the parent component, as you saw yesterday.

// UNNECESSARY 4: telling the parent about a state change
useEffect(() => { onChange(selection); }, [selection]);
// RIGHT: call onChange in the same handler that changes the selection.

// LEGITIMATE: synchronising with a system EXTERNAL to React
// (network, timers, subscriptions, direct DOM, localStorage)
// It calls GET /api/v1/agenda?day=2026-03-10, which returns { data: [...] }
// with the rows of week 15's DailyAgenda query.
export function useDailyAppointments(day: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);   // bumping it = fetch again

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch('/api/v1/agenda?day=' + day, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('Error ' + r.status);
        return r.json() as Promise<{ data: Appointment[] }>;   // week 11's envelope
      })
      .then(json => setAppointments(json.data))
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setLoading(false));

    return () => controller.abort();    // clean-up: cancels if the day changes or it unmounts
  }, [day, version]);

  // reload is for the "Retry" button and after creating an appointment
  return { appointments, loading, error, reload: () => setVersion(v => v + 1) };
}
// The three mandatory pieces of a network effect:
//   1. an AbortController to cancel
//   2. the clean-up function that aborts it
//   3. explicit loading and error states
// Without the clean-up, switching days quickly can let the slow response for
// the old day overwrite the new day's. That is a race condition.`
      },
      steps: [
        'Go through every useEffect you have written and classify each one under the four unnecessary cases. Delete the ones that fit and note how many are left.',
        'Write the useDailyAppointments hook exactly as in the example, with AbortController and clean-up. Put it in web/src/hooks/.',
        'Connect the schedule page to your real API. First add to the API the GET /api/v1/agenda?day= endpoint that calls DailyAgenda (week 15) and returns { data }. Declare the record as AgendaRowDto(Guid Id, DateTime Start, DateTime End, string PetName, string OwnerName, string Status) so the JSON matches the Appointment type. Because the backend runs on another port, add to vite.config.ts: server: { proxy: { "/api": "http://localhost:5xxx" } }, with the port dotnet run shows.',
        'Cause the race condition on purpose: add an artificial delay in the backend and switch days twice quickly. Then remove controller.abort() and check that now the data does get corrupted.',
        'Check that React in strict mode runs the effect twice in development and that your code handles it without visible duplicate requests thanks to the clean-up. That double mount exists precisely to catch badly written effects.'
      ],
      vet: [
        'VetCare’s schedule must show three distinct visual states: loading with a skeleton, error with a message and a retry button, and empty with useful text. Never a blank screen.',
        'Write in docs/frontend.md the effects you removed and why. That list is the proof that you understood the lesson.'
      ],
      edge: [
        'An effect that updates a piece of state in its own dependency array causes an infinite loop. If it happens, the fix is almost never adjusting the dependencies but removing the effect.',
        'Functions and objects declared inside the component are new on every render, so making them a dependency restarts the effect every time. Move them outside, use useCallback, or reconsider whether the effect is needed.',
        'Do not empty the dependency array to silence the linter warning. That warning is almost always pointing at a real bug with stale values in a closure.'
      ],
      quiz: [
        { q: 'What is useEffect really for?', a: 'For synchronising your component with a system outside React: the network, a timer, a subscription, local storage or the DOM directly. It is not for transforming data or reacting to user interactions, which are handled during render and in the handlers respectively.' },
        { q: 'Why is calculating a derived value during render better than doing it in an effect?', a: 'Because the effect runs after the render, so you first draw the screen with the old value and then draw it again with the new one: two renders and a flicker. Calculating it during render, the value is always consistent with the current state and cannot drift.' },
        { q: 'Which race condition does the AbortController prevent in a request?', a: 'A slow request fired earlier answering after a more recent one and overwriting the correct data with stale data. By aborting the previous one in the clean-up function, only the latest valid request can update the state.' },
        { q: 'Why does React in strict mode run effects twice in development?', a: 'To force you to discover effects without a correct clean-up function. If your effect mounts, unmounts and mounts again without leaving rubbish or duplicating visible work, it is well written. If it breaks something when duplicated, you have just found a bug that would appear in production in another form.' }
      ],
      out: 'A data hook with correct cancellation, the schedule connected to the real API and zero unnecessary effects.',
      file: 'web/src/hooks/useDailyAppointments.ts'
    },
    {
      t: 'Forms and validation',
      obj: 'Build the new appointment form with client-side validation, submitting states and translation of the errors your API returns.',
      why: 'Forms are where the quality of a UI shows most and where most usability mistakes are made. This is also where the circle closes with the backend: your week 11 RFC 9457 has to reach the screen in a useful way.',
      study: { r: 4, what: 'Read the whole page; it is exactly a form with validation and a server response. About 15 minutes. Look for one thing: why the form is modelled as states (typing, submitting, success) instead of switching loose booleans on and off.',
        pasos: [
          'Read the comparison between imperative and declarative UI at the start (~4 min).',
          'Follow the five steps with the form example (~8 min): identify visual states, what triggers them, represent them with useState, remove non-essential state and connect the events.',
          'Notice how it replaces several booleans with a single status variable.',
          'Write the visual states of your new appointment form before writing the component.'
        ] },
      ex: {
        title: 'A controlled form with validation and server errors',
        body: `interface AppointmentForm {
  petId: string;
  vetId: string;
  start: string;
  reason: string;
}

type FieldErrors = Partial<Record<keyof AppointmentForm, string>>;

const EMPTY: AppointmentForm = { petId: '', vetId: '', start: '', reason: '' };

function validate(f: AppointmentForm): FieldErrors {
  const e: FieldErrors = {};
  if (!f.petId)       e.petId = 'Choose a pet';
  if (!f.vetId)       e.vetId = 'Choose a vet';
  if (!f.start)       e.start = 'Give a date and time';
  else if (new Date(f.start) < new Date()) e.start = 'You cannot book in the past';
  if (f.reason.trim().length < 3) e.reason = 'Describe the reason (at least 3 characters)';
  return e;
}

export function NewAppointmentForm({ onCreated }: { onCreated: () => void }) {
  const [values, setValues] = useState<AppointmentForm>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  // ONE key per appointment you try to create: if the user retries after a
  // network error, the SAME key is resent and the server does not duplicate (week 14)
  const key = useRef(crypto.randomUUID());

  function change<K extends keyof AppointmentForm>(field: K, value: string) {
    const next = { ...values, [field]: value };   // a copy, never a mutation
    setValues(next);
    setErrors(validate(next));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();                               // otherwise the browser reloads
    const errs = validate(values);
    setErrors(errs);
    setTouched(new Set(Object.keys(values)));         // on submit, show them all
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setGeneralError(null);
    try {
      const r = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': key.current,
        },
        body: JSON.stringify({
          petId: values.petId,                        // UUIDs travel as text
          vetId: values.vetId,
          start: new Date(values.start).toISOString(),
          reason: values.reason.trim(),
        }),
      });

      if (r.status === 409) {
        setGeneralError('That vet already has an appointment at that time. Choose another slot.');
        return;
      }
      if (!r.ok) {
        // week 11's RFC 9457 (if the body is not JSON, an empty object)
        const problem = await r.json().catch(() => ({}));
        setGeneralError(problem.detail ?? problem.title ?? 'The appointment could not be created.');
        return;
      }

      key.current = crypto.randomUUID();             // the next appointment gets a new key
      onCreated();                                   // the parent calls reload()
      setValues(EMPTY);
      setTouched(new Set());
    } catch {
      setGeneralError('There is no connection to the server. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const show = (f: keyof AppointmentForm) => touched.has(f) ? errors[f] : undefined;

  return (
    <form onSubmit={submit} noValidate>
      <Field
        label="Reason"
        value={values.reason}
        error={show('reason')}
        onChange={v => change('reason', v)}
        onBlur={() => setTouched(t => new Set(t).add('reason'))}
      />
      {generalError && <p role="alert" className="general-error">{generalError}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create appointment'}
      </button>
    </form>
  );
}`
      },
      steps: [
        'Build the full new appointment form with the four fields, using a single object in state and the generic typed change function.',
        'Implement the touched-fields pattern: a field’s error is only shown once the user has left it or presses submit. Showing errors while they type the first letter is hostile.',
        'Disable the button while submitting is true and change its text. Click twice quickly to check that two appointments are not created.',
        'Cause the overlap 409 you implemented in week 12 and check that the message the user sees is useful and readable, not the raw problem details JSON.',
        'Turn off the backend and submit the form. Check that you see the no-connection message and that the app does not break.'
      ],
      vet: [
        'The form’s Idempotency-Key must be generated only once per appointment you try to create (that is why it lives in a useRef), not on every submit or every render. If the user retries after a network error, the same key prevents the duplicate appointment: that is where week 14’s work pays off.',
        'Add the error table to docs/frontend.md: HTTP code the API returns, message the user sees. That translation is yours and is part of the product.'
      ],
      edge: [
        'Without e.preventDefault() the browser reloads the page on submit and you lose all the state. It is the number one mistake with forms in React.',
        'Client-side validation is for the user experience, never for security. The server must validate the same things again, because anyone can call your API without going through the form.',
        'A submit button that is not disabled allows double submissions with a double click. Disabling it is the first barrier; the Idempotency-Key is what really guarantees there is no duplicate.'
      ],
      quiz: [
        { q: 'Why are errors only shown for touched fields?', a: 'Because marking in red a field the user has not filled in yet is hostile and confusing: you tell them they got it wrong before giving them a chance to get it right. Showing them when they leave the field or try to submit respects the natural pace of whoever is filling in the form.' },
        { q: 'Why does client-side validation not replace server-side validation?', a: 'Because the client is code running on a machine you do not control, and anyone can call the API directly with curl, skipping the whole form. Client-side validation improves the experience with an immediate answer; server-side validation is the only thing that protects the data.' },
        { q: 'What role does week 14’s Idempotency-Key play here?', a: 'It guarantees that if the user retries after a network error, where they do not know whether the request arrived, a second appointment is not created. It is the real safety net, whereas disabling the button only prevents the accidental double click and does not cover a manual retry.' },
        { q: 'How should an overlap 409 be translated onto the screen?', a: 'As a plain-language message explaining what is happening and what the user can do, for example that the vet already has an appointment at that time and they should choose another slot. Showing the problem details JSON or a numeric code hands the user a technical problem they cannot interpret.' }
      ],
      out: 'A new appointment form with progressive validation, double-submit protection and translated server errors.',
      file: 'web/src/components/NewAppointmentForm.tsx'
    },
    {
      t: 'VetCare’s complete schedule (weekly exam)',
      obj: 'Bring everything together in a screen that really works against your API and review it with front-end quality criteria.',
      why: 'It is your first real screen connected to your own backend, end to end. Being able to show it working and explain every state decision is exactly what a full-stack interview asks for.',
      study: { r: 1, what: 'Skim the whole Managing State section, checking that you recognise each concept in your own code. About 10 minutes. Look for one thing: a pattern from the documentation you have not applied yet that would help you.',
        pasos: [
          'Open the chapter page and read the list of topics (~2 min).',
          'For each topic write where it appears in your schedule: state structure, shared state, reset with key, reducer and context.',
          'Open "Extracting State Logic into a Reducer" (~6 min) if your schedule has many related setState calls.',
          'Note one pattern you do not apply yet and decide whether it is worth it today.'
        ] },
      ex: {
        title: 'Reviewing the schedule screen',
        body: `MINIMUM FUNCTIONALITY
  [ ] Lists the day's appointments reading from GET /api/v1/agenda?day=
  [ ] Lets you change day and reloads correctly
  [ ] Searches by pet or owner name without going to the server
  [ ] Filters by status
  [ ] Creates a new appointment and it appears in the list without reloading the page
  [ ] Cancels an appointment after a confirmation
  [ ] Shows the selected appointment's detail

THE FOUR STATES OF ANY SCREEN WITH DATA
  [ ] Loading   -> skeleton or indicator, never a blank screen
  [ ] Error     -> clear message and a retry button
  [ ] Empty     -> useful text, not a table with zero rows and no explanation
  [ ] With data -> the normal case
  If one is missing, the screen is not finished.

STATE QUALITY
  [ ] No state duplicates something derivable (run the three questions on each useState)
  [ ] No state stores an object that is already in a list (store the id)
  [ ] Each piece of state lives in the closest common ancestor
  [ ] Every useEffect syncs with something external; none transforms data
  [ ] Every request has an AbortController and clean-up

MINIMUM ACCESSIBILITY
  [ ] The whole form can be walked with the Tab key in a logical order
  [ ] Every input has its associated <label htmlFor>
  [ ] Errors use role="alert" so a screen reader announces them
  [ ] Buttons are <button> and links are <a>, never a <div> with onClick
  [ ] Text contrast is readable (check with the browser devtools)

TYPESCRIPT
  [ ] Zero any in the whole project. Search: grep -rn ": any" src/
  [ ] npx tsc -b passes with no errors (with Vite's tsconfig, plain "tsc --noEmit" checks nothing)
  [ ] The front-end types match the API DTOs field by field

FINAL MANUAL TEST (really do it, in the browser)
  1. Load today's schedule with the backend off -> error message and retry
  2. Turn the backend on and press retry -> it loads
  3. Create an appointment that overlaps another -> a clear 409 message
  4. Create a valid appointment -> it appears in the list instantly
  5. Cancel that appointment -> it changes status without reloading
  6. Search for a letter that does not exist -> empty state with useful text
  7. Walk everything with Tab, without touching the mouse -> all reachable`
      },
      steps: [
        'Complete the list’s minimum functionality until all seven points are done.',
        'Implement the four screen states. The empty state is the one almost everyone forgets: write a text that says there are no appointments and offers to create one.',
        'Go through the state quality list point by point, with the code in front of you. Fix what fails instead of ticking it anyway.',
        'Run npx tsc -b and search for any in the whole project. Leave both clean.',
        'Do the full seven-step manual test in the browser, including the Tab walk, and note in docs/frontend.md what you found.'
      ],
      vet: [
        'This screen is VetCare’s first visible deliverable. Take a screenshot and save it in docs/screenshots/: it will help when you want to show the project.',
        'Press "Mark for review" and reread docs/frontend.md in a week.'
      ],
      edge: [
        'A screen with no loading state looks broken on slow connections, even if it works perfectly. The user cannot tell slow from frozen if you give them no signal.',
        'Trusting that the API always answers well is the classic mistake of a freshly connected front end. Your backend has timeouts and circuit breakers: your front end must have a path for each of those failures.',
        'Accessibility is not an extra added at the end. A div with onClick does not get focus, does not respond to Enter and is invisible to a screen reader: changing it to a button at the end of the project usually breaks the styles.'
      ],
      quiz: [
        { q: 'What are the four states every screen with remote data must cover?', a: 'Loading, error, empty and with data. Forgetting loading makes the screen look broken; forgetting error leaves the user with no way out; and forgetting empty shows a table with no rows that does not explain whether there is no data or something failed.' },
        { q: 'Why does the empty state need its own text and a table with no rows is not enough?', a: 'Because an empty table is ambiguous: the user does not know whether there are no appointments that day, whether the filter is too narrow or whether loading failed silently. An explicit text saying there are no appointments and offering to create one turns a dead end into an action.' },
        { q: 'Why is a div with onClick an accessibility problem?', a: 'Because it does not get focus with Tab, does not respond to Enter or space, and screen readers do not announce it as something clickable. A button element brings all that behaviour for free, and replacing it at the end of the project usually breaks styles written for the div.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That in React the UI is a function of state, so the real work is not writing JSX but modelling the minimum state and placing it at the right level, deriving everything else during render and keeping effects only for talking to the outside world.' }
      ],
      out: 'VetCare’s schedule working against the real API, with the four states, no any and keyboard accessible.',
      file: 'web/src/pages/Schedule.tsx'
    }
  ]
}
]);
