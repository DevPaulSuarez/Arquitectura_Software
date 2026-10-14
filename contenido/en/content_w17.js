window.EN = window.EN || {};
window.EN.WEEKS = (window.EN.WEEKS || []).concat([
{
  n: 17,
  phase: 'Frontend',
  title: 'Remote data and UX: making the app feel fast',
  idea: 'Last week’s schedule works, but every change of day fetches everything again, there is no cache, and if two screens need the same appointments they are fetched twice. Also, when creating an appointment the user waits for the server to answer while staring at a spinner. This week you learn the pattern that solves all of that at once: treating server data as a cache you synchronise with, not as state you manage by hand. And you learn to make the UI respond before the network answers.',
  res: [
    { t: 'TanStack Query — Overview and Important Defaults',
      u: 'https://tanstack.com/query/latest/docs/framework/react/overview',
      note: 'The standard library for server data in React. Read Overview and then Important Defaults: understanding the defaults avoids 90% of the initial confusion.' },
    { t: 'TanStack Query — Optimistic Updates',
      u: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
      note: 'The pattern that makes an app feel instant. Notice the onMutate, onError, onSettled block: that trio is the whole pattern.' },
    { t: 'Nielsen Norman Group — Response Times: The 3 Important Limits',
      u: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      note: 'The three thresholds of human perception: 0.1s, 1s and 10s. It is the foundation of why an optimistic update changes the feeling of speed so much.' },
    { t: 'React Router — URL Values', u: 'https://reactrouter.com/start/declarative/url-values', note: 'useParams and useSearchParams: the state that lives in the URL.' },
    { t: 'TanStack Query — Mutations', u: 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations', note: 'useMutation and how to invalidate after writing.' }
  ],
  days: [
    {
      t: 'Server state vs client state',
      obj: 'Tell apart the two kinds of state in an application and understand why managing remote data with useState and useEffect always ends badly.',
      why: 'It is the mindset shift that separates someone who writes toy React from someone who writes real applications. Being able to explain that server data is a cache and not your own state is an answer that impresses in front-end interviews.',
      study: { r: 0, what: 'Read Overview and then the whole Important Defaults guide (in the side index, under Guides & Concepts). About 20 minutes. Look for one thing: why staleTime is 0 by default and what that means in practice.',
        pasos: [
          'Read "Motivation" (~5 min): the list of server-state problems (caching, duplicates, stale data, pagination).',
          'Look at the "Enough talk, show me some code already!" example (~3 min): useQuery with queryKey and queryFn.',
          'From the side index open Important Defaults under Guides & Concepts (~6 min).',
          'In Important Defaults notice staleTime 0, the refetch when you return to the window and the 3 default retries.',
          'Make two lists for VetCare: server state (appointments, pets) and client state (selected date, open modal).'
        ] },
      ex: {
        title: 'The two kinds of state and why it matters',
        body: `// CLIENT STATE: it belongs to you, it is born and dies in the browser
//   the search text, the filter, which row is selected,
//   whether the side panel is open, the light or dark theme
//   -> useState. It is yours, you control it, it is always the truth.

// SERVER STATE: it does NOT belong to you. It is a borrowed copy.
//   the appointments, the pets, the vets, the invoices
//   -> it is not state, it is a CACHE. The original lives in PostgreSQL and
//      can change without you finding out.

// That changes the questions you have to answer:
//   is my copy out of date?                    (staleness)
//   when do I refresh it?                      (refetch)
//   what do I show while refreshing?           (old data or a spinner?)
//   do two components ask for the same thing and do I fetch it twice? (deduplication)
//   the user left and came back: do I fetch it again?                  (cache)
// useState answers none of those questions. That is why you end up
// writing 200 lines of infrastructure by hand, with bugs.

// npm install @tanstack/react-query

// src/main.tsx
const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s: during that time it does not fetch again
      retry: 2,                 // retries, as in week 14
      refetchOnWindowFocus: true,  // you come back to the tab -> it refreshes
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
);

// src/api/appointments.ts  -- the access layer, separate from the components
export async function getAppointments(day: string, signal?: AbortSignal): Promise<Appointment[]> {
  const r = await fetch('/api/v1/agenda?day=' + day, { signal });
  if (!r.ok) throw new Error('The appointments could not be loaded (' + r.status + ')');
  const json = await r.json() as { data: Appointment[] };   // week 11's envelope
  return json.data;
}

// src/hooks/useAppointments.ts  -- yesterday's 40 lines turned into 6
export function useAppointments(day: string) {
  return useQuery({
    queryKey: ['appointments', day],                        // this data's identity
    queryFn: ({ signal }) => getAppointments(day, signal),  // cancellation included
  });
}

// In the component:
const { data: appointments = [], isPending, isError, error, refetch } = useAppointments(day);
// For free and without writing anything: cache, deduplication, cancellation,
// retries, refresh when returning to the tab, and old data visible while refreshing.

// THE QUERY KEY IS THE MOST IMPORTANT THING
//   ['appointments', '2026-10-05'] and ['appointments', '2026-10-06'] are two different entries
//   changing the day changes the key -> new query, the previous one stays in cache
//   invalidating ['appointments'] invalidates ALL appointment entries, for any day`
      },
      steps: [
        'Install @tanstack/react-query and wrap your App in QueryClientProvider with the defaults from the example.',
        'Create src/api/appointments.ts with the pure access functions: getAppointments, createAppointment, cancelAppointment. They must know nothing about React.',
        'Replace last week’s useDailyAppointments hook with useQuery. Delete the useEffect, the AbortController and the three useStates: they are no longer needed.',
        'Install the devtools with npm install @tanstack/react-query-devtools, mount them in App and watch the cache live: change day several times and see the entries pile up.',
        'Check deduplication: mount two components that call useAppointments with the same day and check in the browser’s Network tab that only one request is made.'
      ],
      vet: [
        'In VetCare the query keys will be ["appointments", day], ["pet", id], ["pets"] and ["vets"]. Write them in docs/frontend.md as a contract: a badly written key breaks the cache silently.',
        'Decide a staleTime per kind of data and justify it: vets almost never change and can have minutes, the day’s appointments change often and need seconds.'
      ],
      edge: [
        'A badly built query key is the source of almost every cache bug. If you forget to include the day in the key, every day shares the same entry and you will see Monday’s appointments on Tuesday.',
        'staleTime at 0, which is the default, means any component mount fetches again. It is safe but noisy; raise it according to how often each piece of data changes.',
        'Do not put things that do not come from the server into the query cache. The filter or the search text are client state and should stay in useState.'
      ],
      quiz: [
        { q: 'Why is server data not client state?', a: 'Because its source of truth lives in the database and can change without the browser finding out. What you have in memory is a borrowed copy that can go stale, so the relevant questions are when to refresh it and what to show in the meantime, not how to store it.' },
        { q: 'What is a query key and why is it so important?', a: 'It is the identity of a piece of data in the cache: two components with the same key share the same entry and the same request. If you forget to include a parameter that affects the result, different queries share an entry and wrong data is shown with no visible error.' },
        { q: 'What does staleTime mean and what effect does raising it have?', a: 'It is the time during which freshly fetched data is considered fresh and is not fetched again even if a component mounts again. Raising it reduces requests and makes navigation smoother, at the cost of showing data that may be a little older.' },
        { q: 'What does useQuery give you that you would have to write by hand with useEffect?', a: 'A cache shared between components, deduplication of simultaneous requests, cancellation on unmount or parameter change, retries, refresh when returning to the tab and the ability to show old data while refreshing in the background. All that by hand is hundreds of lines with many sharp edges.' }
      ],
      out: 'The schedule working with TanStack Query, with the cache visible in the devtools and deduplication checked.',
      file: 'web/src/hooks/useAppointments.ts'
    },
    {
      t: 'Mutations and invalidation',
      obj: 'Write write operations that leave the cache consistent without reloading the page or touching state by hand.',
      why: 'It is the missing half: reading is easy, the hard part is that after writing everything else on screen reflects the change. Mastering invalidation avoids the most common class of bug in real applications, which is seeing stale data after an action.',
      study: { r: 4, what: 'Read the Mutations guide and then Query Invalidation, linked from the side index. About 18 minutes. Look for one thing: the difference between invalidating a query and updating its contents by hand with setQueryData.',
        pasos: [
          'Read the Mutations introduction (~4 min): useMutation, mutate and the isPending, isError and isSuccess states.',
          'Read "Mutation Side Effects" (~4 min): onSuccess, onError and onSettled.',
          'Read "Retry" (~1 min): mutations are not retried by default. Think about why.',
          'From the side index open Query Invalidation (~5 min): invalidateQueries marks as stale and fetches again.',
          'Decide which queries each VetCare mutation invalidates: create appointment, cancel appointment, edit pet.'
        ] },
      ex: {
        title: 'Create, cancel and invalidate the right things',
        body: `// src/api/appointments.ts
export class OverlapError extends Error {}
// what week 12's POST returns
export interface CreatedAppointment { id: string; start: string; end: string; status: AppointmentStatus }

// "key" is the Idempotency-Key: the form generates it ONCE per appointment
// (with useRef, as in week 16) and passes it here
export async function createAppointment(
  { key, ...data }: NewAppointment & { key: string }): Promise<CreatedAppointment> {
  const r = await fetch('/api/v1/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
    },
    body: JSON.stringify(data),
  });
  if (r.status === 409) throw new OverlapError('That time slot is already taken.');
  if (!r.ok) {
    const p = await r.json().catch(() => null);
    throw new Error(p?.detail ?? 'The appointment could not be created.');
  }
  return r.json();
}

// src/hooks/useCreateAppointment.ts
export function useCreateAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,

    onSuccess: () => {
      // Invalidate = mark as stale. Whatever is on screen refreshes on its own.
      qc.invalidateQueries({ queryKey: ['appointments'] });

      // We do not put the response in with setQueryData: the POST returns only
      // id, start, end and status, not the full schedule row (with names).
      // See the rule below.
    },
  });
}

// In the component:
const create = useCreateAppointment();
const key = useRef(crypto.randomUUID());

async function submit(data: NewAppointment) {
  try {
    await create.mutateAsync({ ...data, key: key.current });
    key.current = crypto.randomUUID();   // the next appointment gets a new key
    closeForm();
  } catch (e) {
    // the error is already in create.error, here you only decide what to do with the UI
  }
}

<button type="submit" disabled={create.isPending}>
  {create.isPending ? 'Creating...' : 'Create appointment'}
</button>
{create.isError && <p role="alert">{(create.error as Error).message}</p>}

// WHAT TO INVALIDATE: everything the change may have affected. Think in consequences.
//   create an appointment -> ['appointments'] (the day's list) and ['availability', vetId]
//   cancel appointment    -> ['appointments'], ['appointment', id]
//   record visit          -> ['history', petId], ['appointments']
//   issue invoice         -> ['invoices'], ['invoice', id], ['history', petId]

// INVALIDATE vs setQueryData
//   invalidateQueries -> "this data may have changed, fetch it again"
//                        safe, simple, costs one request
//   setQueryData      -> "I know exactly how it ends up, update it without fetching"
//                        instant, but if you get it wrong you show something false
// Rule of thumb: invalidate by default; use setQueryData only when the
// server's response gives you the complete, updated object.`
      },
      steps: [
        'Turn last week’s form appointment creation into a useMutation, removing the manual fetch and the submitting and error states.',
        'Add the invalidation of ["appointments"] in onSuccess and check that the table updates on its own, without you touching any state.',
        'Write the same pattern for cancelling an appointment, with its own useCancelAppointment hook.',
        'Write the list of consequences of each VetCare mutation in docs/frontend.md: for each write, which query keys become stale.',
        'Watch the whole flow in the React Query devtools: see how the query goes to stale and is fetched again automatically after the invalidation.'
      ],
      vet: [
        'In VetCare cancelling an appointment affects the day’s list, that appointment’s detail and the vet’s availability. Invalidating only the list is the typical bug: the availability panel keeps lying.',
        'Add the mutation to invalidated keys table to docs/frontend.md. It is a living document you will have to update every time you add a write.'
      ],
      edge: [
        'Forgetting to invalidate a related key produces the worst kind of bug: the main screen updates and a secondary panel keeps showing stale data, so the app seems to work until someone looks closely.',
        'Invalidating with a key that is too broad reloads half the system after every write. There is a balance between invalidating too little, which gives stale data, and too much, which gives needless requests.',
        'mutateAsync throws the exception and mutate does not. If you use mutate without onError, a failure goes by silently and the user learns nothing.'
      ],
      quiz: [
        { q: 'What does invalidating a query mean?', a: 'Marking that cache entry as stale. TanStack Query fetches it again automatically if a mounted component is using it, and if not, it will refresh it the next time someone needs it. It does not delete the data: it keeps showing it while the new version arrives.' },
        { q: 'When would you use setQueryData instead of invalidateQueries?', a: 'When the server’s response already gives you the complete, updated object, so you can write it into the cache without fetching anything. It is instant and saves a request, but if what you write does not match exactly what the server has, you show false data without knowing it.' },
        { q: 'Why do you have to think in consequences when deciding what to invalidate?', a: 'Because a write almost never affects only the obvious list. Cancelling an appointment changes the day’s list, that appointment’s detail and the vet’s availability; if you only invalidate the list, the other panels keep showing a world that no longer exists.' },
        { q: 'What is the difference between mutate and mutateAsync?', a: 'mutateAsync returns a promise that throws if it fails, so you can use try and catch in the flow. mutate does not throw and forces you to handle the failure in the onError callback; if you forget it, the error disappears and the user gets no signal.' }
      ],
      out: 'Creating and cancelling appointments through mutations, with a consistent cache and a documented invalidation table.',
      file: 'web/src/hooks/useCreateAppointment.ts'
    },
    {
      t: 'Optimistic updates',
      obj: 'Make the UI reflect the change instantly and know how to undo it precisely if the server rejects the operation.',
      why: 'It is what separates an application that feels professional from one that feels slow, and most developers have never implemented it. Being able to explain the onMutate, onError and onSettled trio with its rollback is a very strong answer.',
      study: { r: 1, what: 'Read the whole Optimistic Updates page, paying attention to the onMutate example. About 15 minutes. Look for one thing: why you must cancel the queries in flight before modifying the cache.',
        pasos: [
          'Read the introduction and "Via the UI" (~4 min): the simple way, showing the mutation’s variables while it is sent.',
          'Read "Via the cache" and "Updating a list of todos when adding a new todo" (~6 min): onMutate, cancelQueries, saving the previous state and restoring it in onError.',
          'Read "When to use what" (~2 min).',
          'Write, for cancelling an appointment, what happens in onMutate, in onError and in onSettled.'
        ] },
      ex: {
        title: 'The onMutate, onError, onSettled trio',
        body: `// THE IDEA: 99% of the time the operation is going to work.
// Show the result NOW and prepare the way back just in case.
// Nielsen's threshold: under 0.1s the user perceives an instant response.
// No network gets there. Only the optimistic update does.

export function useCancelAppointment(day: string) {
  const qc = useQueryClient();
  const key = ['appointments', day];

  return useMutation({
    mutationFn: (id: string) => cancelAppointment(id),

    // 1. BEFORE calling the server
    onMutate: async (id: string) => {
      // a) cancel refreshes in flight: if one arrives afterwards, it would overwrite your change
      await qc.cancelQueries({ queryKey: key });

      // b) save the current snapshot to be able to go back
      const previous = qc.getQueryData<Appointment[]>(key);

      // c) apply the change in the cache as if it had already worked
      qc.setQueryData<Appointment[]>(key, (old = []) =>
        old.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));

      // d) return the snapshot: it arrives as the third argument of onError
      return { previous };
    },

    // 2. IF IT FAILS: restore exactly what was there
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(key, context.previous);
      showNotice('The appointment could not be cancelled. It has been restored.');
    },

    // 3. WHATEVER HAPPENS: sync with the server's truth
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });
}

// WHY EACH PIECE
//   cancelQueries -> stops an old in-flight response from overwriting your
//                    optimistic change. It is the same race condition as last
//                    week's AbortController, in another layer.
//   getQueryData  -> the rollback must restore the EXACT state, not one
//                    rebuilt by hand, because there may be other changes.
//   onSettled     -> even if it went well, the server may have done something
//                    more (changed a counter, calculated a field). Invalidating
//                    at the end guarantees you end up showing the truth.

// WHEN YES AND WHEN NO
//   YES: actions with a very high chance of success and a simple visual effect
//        -> cancel an appointment, mark as read, like, reorder
//   NO:  operations that may fail often or whose result you do not know
//        -> create an appointment (the server assigns the id and may give a 409)
//        -> any payment
//   For those, an honest spinner. Lying and correcting is worse than waiting a second.`
      },
      steps: [
        'Make appointment cancellation optimistic by implementing the three handlers exactly as in the example.',
        'Try it with the backend running: the row must change status before the network answers. Compare the feeling with the previous version.',
        'Now turn the backend off and cancel: check that the row changes, goes back to its previous state and the notice appears. That rollback is half the pattern.',
        'Cause the race condition: remove cancelQueries, add a delay in the backend, refresh and cancel almost at the same time. Watch the old response overwrite your change.',
        'Decide for each VetCare mutation whether it is optimistic or uses a spinner and write the decision with its reason in docs/frontend.md.'
      ],
      vet: [
        'In VetCare cancellation is optimistic because it is a simple status change that almost always works. Creation is NOT optimistic: the server assigns the id and the overlap 409 is a realistic, frequent failure.',
        'Add the criterion in one sentence to docs/frontend.md: optimistic when success is almost certain and you know the exact result; an honest spinner in every other case.'
      ],
      edge: [
        'A rollback that rebuilds the state by hand instead of restoring the saved snapshot can lose other changes that happened in the meantime. Always save and restore the complete value.',
        'Without cancelQueries, a refresh request fired before your change can answer afterwards and overwrite the optimistic change, making the row flicker back to its previous state with no error.',
        'Applying optimism to an operation that fails often trains the user to distrust the UI. If they see things appear and disappear, they stop believing what they read.'
      ],
      quiz: [
        { q: 'What do the three phases onMutate, onError and onSettled do?', a: 'onMutate cancels refreshes in flight, saves a snapshot of the cache and applies the change as if it had already worked. onError restores that snapshot if the server rejects it. onSettled invalidates at the end to sync with the server’s truth whatever happens.' },
        { q: 'Why must you call cancelQueries before modifying the cache?', a: 'Because there may be a refresh request already in flight that answers after your optimistic change and overwrites it with the old data. Cancelling it avoids that race condition, which is the same idea as the AbortController but at cache level.' },
        { q: 'Why should creating an appointment not be optimistic?', a: 'Because you do not know the result: the server assigns the identifier and the overlap 409 is a realistic failure that happens often. Showing an appointment that then disappears is a worse experience than waiting a second with an honest indicator.' },
        { q: 'Why does onSettled invalidate even when the mutation went well?', a: 'Because the server may have done more than you simulated: recalculated a counter, changed a derived field or applied a rule. Invalidating at the end guarantees that what stays on screen is the server’s truth and not your approximation.' }
      ],
      out: 'Instant appointment cancellation with a rollback verified by turning off the backend.',
      file: 'web/src/hooks/useCancelAppointment.ts'
    },
    {
      t: 'Routes and state in the URL',
      obj: 'Split VetCare into navigable screens and put in the URL the state that should be shareable and remembered.',
      why: 'The URL is state people forget exists. An application where you cannot share a link to what you are looking at feels broken, and knowing how to reason about what goes in the URL is product judgement, not only technical.',
      study: { r: 3, what: 'Read the declarative mode’s URL Values page and try each example in your project. About 15 minutes. Look for one thing: the difference between a route parameter (useParams) and a search parameter (useSearchParams).',
        pasos: [
          'Read "Route Params" (~4 min): useParams for what identifies the screen, such as /pets/42.',
          'Read "URL Search Params" (~4 min): useSearchParams for filters and pages, such as ?day=2026-10-07.',
          'Read "Location Object" (~2 min).',
          'Make a table of VetCare’s screens with their route and which parameters go in the route and which in the search.',
          'Check with a filter that if you reload the page or copy the URL, the filter is kept.'
        ] },
      ex: {
        title: 'VetCare’s routes and state in the URL',
        body: `// npm install react-router
// (since version 7 "react-router" is enough; everything is imported from there)

// src/routes.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,                  // header, navigation, <Outlet />
    errorElement: <ErrorPage />,          // catches errors from any child
    children: [
      { index: true,                element: <Home /> },
      { path: 'schedule',           element: <Schedule /> },
      { path: 'pets',               element: <PetList /> },
      { path: 'pets/:id',           element: <PetDetail /> },
      { path: 'pets/:id/history',   element: <PetHistory /> },
      { path: '*',                  element: <NotFound /> },
    ],
  },
]);
// and in src/main.tsx: <RouterProvider router={router} /> instead of <App />

// ROUTE PARAMETER: identifies WHICH resource you are looking at
export function PetDetail() {
  const { id } = useParams();                       // string | undefined
  const { data, isPending, isError, refetch } = usePet(id!);   // the UUID

  if (isPending) return <Skeleton />;
  if (isError)   return <ErrorMessage onRetry={refetch} />;
  return <PetCard pet={data} />;
}

// SEARCH PARAMETER: changes HOW you are looking at it
export function Schedule() {
  const [params, setParams] = useSearchParams();

  const day    = params.get('day')    ?? todayISO();
  const filter = (params.get('status') ?? 'all') as AppointmentStatus | 'all';
  const search = params.get('q') ?? '';

  function change(key: string, value: string) {
    setParams(previous => {
      const n = new URLSearchParams(previous);
      if (value) n.set(key, value); else n.delete(key);   // do not clutter the URL
      return n;
    }, { replace: true });   // replace: do not fill the history with every keystroke
  }

  const { data: appointments = [] } = useAppointments(day);
  // ...
}
// Result: /schedule?day=2026-10-05&status=scheduled&q=luna
// It can be shared over WhatsApp, saved as a bookmark, and the browser's
// back button works as the user expects.

// WHAT GOES IN THE URL AND WHAT DOES NOT
//   YES: the resource you see, the day, the filters, the search, the page,
//        the sort order, the active tab. Everything you want to be able to share.
//   NO:  whether a dropdown is open, the half-typed text of a form,
//        the scroll position, the light or dark theme.
//   The question: would it make sense to send this link to a colleague?

// LINKS, NOT BUTTONS WITH onClick
<Link to={'/pets/' + p.id}>{p.name}</Link>
// A Link is a real <a>: it opens in a new tab with ctrl+click, it can be
// copied with right-click and screen readers announce it.`
      },
      steps: [
        'Install react-router and define the route tree from the example with a Layout containing the navigation and an Outlet.',
        'Move the schedule’s day, filter and search from useState into useSearchParams. Check that when you reload the page you keep exactly what you were looking at.',
        'Use replace: true when updating the search text, so you do not create a history entry for every letter typed. Try the back button before and after the change.',
        'Create the pet detail route with a parameter and make sure usePet uses that id in its query key.',
        'Add the catch-all not-found route and the Layout’s errorElement. Visit a made-up URL and check that you see something useful instead of a blank screen.'
      ],
      vet: [
        'Try the real case that justifies all this: copy the filtered schedule URL, open it in a new window and check that you see exactly the same. If not, the state is in the wrong place.',
        'Add VetCare’s route map and the list of parameters each screen accepts to docs/frontend.md.'
      ],
      edge: [
        'Keeping a filter only in useState means it is lost on reload and cannot be shared. The user who sends a link to a colleague expects them to see the same thing.',
        'Without replace: true, each keystroke in the search box creates a history entry and the back button forces you to press twenty times to leave the screen.',
        'A search parameter that is not removed when empty leaves URLs like ?q=&status= that are ugly and hard to read. Delete the key when the value is empty.'
      ],
      quiz: [
        { q: 'What is the difference between a route parameter and a search parameter?', a: 'A route parameter identifies which resource you are looking at and is part of the hierarchy, like the id in /pets/7. A search parameter changes how you are looking at it without changing the resource, like a filter or a sort order, and is optional by nature.' },
        { q: 'How do you decide whether a piece of state should go in the URL?', a: 'By asking whether it would make sense to send that link to a colleague. The day, the filters and the search define what the other person should see, so they go in the URL. Whether a dropdown is open or half-typed text add nothing for the recipient and stay in local state.' },
        { q: 'Why is replace used when updating the search text?', a: 'Because without it, each keystroke creates a new entry in the browser history and the back button forces the user to press once per letter typed. With replace the current entry is replaced and the history still makes sense.' },
        { q: 'Why navigate with Link and not with a button that calls navigate?', a: 'Because Link generates a real link, so it can be opened in a new tab with ctrl plus click, its address can be copied with right-click and screen readers announce it as a link. A button with onClick loses all that behaviour the user takes for granted.' }
      ],
      out: 'A navigable VetCare with routes, filters shareable through the URL and error and not-found pages.',
      file: 'web/src/routes.tsx'
    },
    {
      t: 'Perceived performance and loading states',
      obj: 'Apply the thresholds of human perception so the app feels fast, even when the network is not.',
      why: 'It is one of the few areas where a UI decision really changes how people perceive your product. Being able to quote Nielsen’s three thresholds and explain how you used them shows you think about the user and not only the code.',
      study: { r: 2, what: 'Read the whole Nielsen Norman Group article, it is short. About 10 minutes. Look for one thing: what to do at each of the three thresholds, 0.1s, 1s and 10s.',
        pasos: [
          'Read the article from start to finish (~6 min).',
          'Copy the three limits: 0.1 s feels instant, 1 s keeps the train of thought, 10 s is the maximum attention span.',
          'Read "Web-Based Application Response Time" (~3 min).',
          'For each VetCare action write which threshold it falls into and which feedback it calls for: nothing, an indicator or a progress bar.'
        ] },
      ex: {
        title: 'The three thresholds applied to VetCare',
        body: `// 0.1 s  -> perceived as instant. No waiting signal at all.
//           Every local interaction: opening a dropdown, filtering in memory,
//           typing in an input. And yesterday's optimistic updates.
//
// 1 s    -> the user notices the wait but does not lose the thread.
//           No loading animation yet: a spinner that appears for 300ms
//           and goes away is worse than showing nothing. It flickers and dizzies.
//
// 10 s   -> the limit of attention. Above it, the user leaves.
//           Real progress and a way to cancel are needed.

// TECHNIQUE 1: a skeleton instead of a spinner, with a delay
function Skeleton() {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => <div key={i} className="ghost-row" />)}
    </div>
  );
}

const { data, isPending } = useAppointments(day);
const showLoading = useDelayed(isPending, 300);   // only if it takes more than 300ms
// If the response arrives in 80ms, the user never sees anything flicker.

function useDelayed(active: boolean, ms: number) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return visible;
}
// This IS a legitimate use of useEffect: it syncs with a timer,
// which is a system external to React.

// TECHNIQUE 2: show the old data while the new data arrives
const { data, isPlaceholderData } = useQuery({
  queryKey: ['appointments', day],
  queryFn: ({ signal }) => getAppointments(day, signal),
  placeholderData: keepPreviousData,       // the table does NOT empty when the day changes
});

<div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
  <AppointmentTable appointments={data ?? []} />
</div>
// The user sees the previous day dimmed instead of a blank gap.
// The difference in feeling is huge and it costs one line.

// TECHNIQUE 3: prefetch what you know they are going to ask for
function PetRow({ pet }: { pet: PetSummary }) {
  const qc = useQueryClient();
  return (
    <Link
      to={'/pets/' + pet.id}
      onMouseEnter={() => qc.prefetchQuery({
        queryKey: ['pet', pet.id],
        queryFn: () => getPet(pet.id),
      })}
    >
      {pet.name}
    </Link>
  );
}
// Between the mouse entering the link and the user clicking, 200-400 ms
// pass. Enough for the next screen to already be loaded.

// TECHNIQUE 4: split the code by route
// (lazy needs the page to be exported with "export default")
const PetHistory = lazy(() => import('./pages/PetHistory'));
<Suspense fallback={<Skeleton />}>
  <PetHistory />
</Suspense>
// The history screen is not downloaded until someone visits it.`
      },
      steps: [
        'Replace all your spinners with skeletons that imitate the shape of the real content: a table with ghost rows, a card with grey blocks.',
        'Implement the useDelayed hook and apply it so the loading indicator only appears after 300 ms. Try it on a fast network and check that it no longer flickers.',
        'Add placeholderData with keepPreviousData to the appointments query and change day: the table should dim instead of emptying.',
        'Implement prefetching on hover over the pet links. Check in the Network tab that the request goes out before the click.',
        'Open the devtools, turn on slow 3G network simulation and walk through the whole app. Note in docs/frontend.md every point where the wait becomes uncomfortable.'
      ],
      vet: [
        'In VetCare the worst case is a pet’s history, which loads visits, vaccines and invoices. Prefetch it when hovering over the row and split it with lazy so it does not weigh on the initial load.',
        'Add the three thresholds to docs/frontend.md with your own example of each within your app. That table is what you will be able to talk about in an interview.'
      ],
      edge: [
        'A skeleton that does not look like the real content produces an annoying visual jump when the data arrives. It should have roughly the same dimensions and structure.',
        'Prefetching on every mouse movement over a long list can fire dozens of requests. Limit it to onMouseEnter of the specific item and rely on staleTime to avoid repeats.',
        'Splitting the code too much makes things worse: every dynamic import is an extra request and a possible wait. Split by route, not by component.'
      ],
      quiz: [
        { q: 'What are Nielsen’s three thresholds and what does each one require?', a: 'Under 0.1 seconds it feels instant and no signal is needed. Up to 1 second the user notices the wait but keeps their train of thought, so a flickering indicator is not wise either. From 10 seconds attention is lost and real progress and an option to cancel are needed.' },
        { q: 'Why is it better to delay the loading indicator by 300 ms?', a: 'Because if the response arrives in less than that time, the user never sees anything and the operation feels instant. Showing a spinner that appears and disappears in 80 milliseconds produces a flicker that makes the app seem more nervous and slower than it is.' },
        { q: 'What does the user gain with keepPreviousData when changing day?', a: 'The table does not empty: they keep seeing the previous data dimmed while the new data arrives. It keeps the visual context and the page height, instead of facing a blank gap and a content jump when the response arrives.' },
        { q: 'Why does prefetching on hover work so well?', a: 'Because between the pointer entering a link and the user clicking typically 200 to 400 milliseconds pass, enough time for the request to go and come back. When the click arrives the data is already in the cache and the screen appears with no perceived wait.' }
      ],
      out: 'An app that feels fast: delayed skeletons, previous data visible and prefetching on hover.',
      file: 'web/src/components/Skeleton.tsx'
    },
    {
      t: 'VetCare web usable end to end (weekly exam)',
      obj: 'Walk through the whole app with the eyes of a user and of a reviewer, and write down the data and experience decisions.',
      why: 'An app that works on your machine with a fast network and perfect data proves nothing. Having tested it with a slow network, no data and the backend down is what you can talk about with confidence.',
      study: { r: 0, what: 'Go over TanStack Query’s Important Defaults again now that you have used it for a week. About 10 minutes. Look for one thing: a default you have been suffering without knowing it could be configured.',
        pasos: [
          'Go back to Important Defaults (~5 min) with your code open.',
          'For each default write whether it affected you this week and whether you would change it.',
          'Walk through the app as a user: create, edit and cancel an appointment, reload halfway and check that nothing is lost.',
          'Write down the three experience problems you find, ordered by how much they would annoy the receptionist.'
        ] },
      ex: {
        title: 'Final review of the web app',
        body: `DATA
  [ ] Every read goes through useQuery; no loose fetch in components
  [ ] Every write goes through useMutation
  [ ] Each query key includes ALL the parameters that affect the result
  [ ] Each mutation invalidates every key its change may affect
  [ ] Each kind of data's staleTime is chosen deliberately, not left as default
  [ ] The functions in src/api/ import nothing from React

EXPERIENCE
  [ ] The four screens cover loading, error, empty and with data
  [ ] Loading indicators have a 300 ms delay
  [ ] Skeletons look like the real content
  [ ] Changing day or filter does not empty the screen
  [ ] At least one action is optimistic and its rollback is tested
  [ ] Every error shows a readable message and a way out

URL AND NAVIGATION
  [ ] Day, filter and search live in the URL
  [ ] The browser's back button does what the user expects
  [ ] Reloading the page keeps what you were looking at
  [ ] There is a not-found page and an error page
  [ ] Navigation uses Link, not buttons and navigate

MANDATORY MANUAL TESTS
  1. Slow 3G network in devtools -> walk through everything. Where does it get uncomfortable?
  2. Backend off                 -> every screen gives a useful message and retry
  3. Empty database              -> every screen gives a sensible empty state
  4. Cancel an appointment with the backend off -> change and rollback visible
  5. Copy the filtered schedule URL -> open it in a new window, same result
  6. Walk the whole app with Tab -> no mouse, everything reachable
  7. Leave the tab, wait a minute, come back -> automatic refresh

THE WEEK'S DELIVERABLES
  [ ] docs/frontend.md with: query keys table, invalidation table,
      optimistic vs spinner criterion, route map and the three thresholds
  [ ] npx tsc -b with no errors and zero any in src/`
      },
      steps: [
        'Go through the three checklists with the code in front of you and fix what fails, instead of ticking it anyway.',
        'Really run the seven manual tests, in the browser. Numbers 2 and 4 are the ones that reveal the most bugs.',
        'Complete docs/frontend.md with the deliverable’s five sections. It should be a document someone who does not know the project can read.',
        'Leave npx tsc -b clean and zero any in src. If an any is unavoidable, replace it with unknown and narrow the type where you use it.',
        'Explain out loud in three minutes why server data is not client state, using your own app as the example for each point.'
      ],
      vet: [
        'Take screenshots of the schedule and the pet history and save them in docs/screenshots/. With week 12’s backend and this UI, VetCare is already a complete project to show.',
        'Press "Mark for review" and reread docs/frontend.md in a week.'
      ],
      edge: [
        'Testing only with a fast network and complete data hides half the problems. Tests 1, 2 and 3 are the ones that find what a real user would find on the first day.',
        'A decisions document that is not updated becomes worse than not having one, because people trust it. If you change a query key, update the table in the same commit.',
        'Ticking items on the list without really checking them turns the review into an empty ritual. If you have not seen it work in the browser, it is not done.'
      ],
      quiz: [
        { q: 'Why should the functions in src/api not import anything from React?', a: 'So they are pure data access functions, reusable from a hook, a test or a script, and testable without mounting any component. Mixing hooks into them ties them to React’s life cycle and turns them into something that only works inside a component.' },
        { q: 'Which of the seven manual tests finds the most bugs and why?', a: 'The backend-off one, because it forces you through every error path that normally never runs in development. That is where the blank screens, the untranslated messages and the loading states that never end show up.' },
        { q: 'What does it mean for the app to feel fast even if the network is not?', a: 'That the user gets an immediate visual response to every action even though the data takes time: optimistic updates for what almost always works, previous data visible while the new data arrives, early prefetching and a delay on indicators so they do not flicker. The real latency does not drop, but the perceived one does.' },
        { q: 'Summarise what you learned this week in one sentence.', a: 'That server data is a cache to be synchronised and not state you manage, and that once you accept that, caching, invalidation and optimism become the three tools that take an app from working correctly to feeling good.' }
      ],
      out: 'VetCare’s complete web app, tested with a slow network and the backend down, with its decisions documented.',
      file: 'docs/frontend.md'
    }
  ]
}
]);
