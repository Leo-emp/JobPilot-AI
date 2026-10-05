/* ============================================================
   FRONTEND ENGINEER WORKSHOP — Seed Content
   ============================================================
   # React, TypeScript, CSS, performance, accessibility,
   # state management, and frontend testing.
   # EXPANDED: Deep prose, analogies, step-by-step walkthroughs.
   ============================================================ */

export const frontendEngineerModules = [
  /* ============================================================
     MODULE 1: React Mastery
     ============================================================ */
  {
    name: "React Mastery",
    slug: "react-mastery",
    description: "Component patterns, hooks deep dive, performance optimization, Server Components, and common React pitfalls.",
    order: 1,
    sections: [
      {
        title: "React Component Patterns",
        slug: "react-component-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 45,
        order: 1,
        content: `## React Component Patterns

React is fundamentally about building user interfaces from small, reusable pieces called components. Think of components like LEGO bricks — individually simple, but capable of constructing anything when combined thoughtfully. The difference between a junior developer and a senior one often comes down to knowing WHICH patterns to use and WHEN.

This lesson covers the five most important component patterns you will encounter in professional React codebases. Each pattern solves a specific problem. Using the right pattern makes your code easier to understand, test, and change. Using the wrong pattern creates complexity that spreads like weeds.

### Pattern 1: Composition Over Configuration

This is the single most important React pattern. It separates good React code from bad React code.

The anti-pattern is a "god component" — one component that tries to handle every possible variation through props. You have seen these: a Card component with 25 props controlling every aspect of its appearance and behaviour. Adding a new variation means adding more props. Testing means testing every combination.

\`\`\`tsx
// # BAD — the "god component" anti-pattern
// # Every variation needs a new prop. 25 props and counting.
// # Adding a "card with a video header" means more props.
<Card
  title="Welcome"
  subtitle="Get started"
  icon="star"
  body="Hello world"
  footer="Learn more"
  variant="primary"
  showBorder
  showShadow
  onFooterClick={() => {}}
  headerActions={<Button />}
  footerActions={<Button />}
/>
\`\`\`

The composition pattern replaces this with a small set of building blocks that you combine freely, like LEGO bricks. The parent decides what goes inside; the Card component just handles the visual container.

\`\`\`tsx
// # GOOD — composition lets you put ANYTHING inside
// # Want a video header? Just put a <Video /> in Card.Header.
// # Want two buttons in the footer? Put them there.
// # The Card doesn't need to know about videos or buttons.
<Card variant="primary">
  <Card.Header>
    <Card.Icon name="star" />
    <Card.Title>Welcome</Card.Title>
    <Card.Subtitle>Get started</Card.Subtitle>
  </Card.Header>
  <Card.Body>Hello world</Card.Body>
  <Card.Footer>
    <Button onClick={() => {}}>Learn more</Button>
  </Card.Footer>
</Card>
\`\`\`

Why is composition better? Because each piece has one job. Card.Header handles header layout. Card.Body handles content padding. The Card wrapper handles the border and shadow. When you need a new variation — say, a card with an image header — you do not modify ANY existing code. You just compose differently:

\`\`\`tsx
// # New variation — no code changes to Card!
<Card variant="primary">
  <Card.Header>
    <img src="/hero.jpg" alt="Hero" className="rounded-t-xl" />
  </Card.Header>
  <Card.Body>
    <h2>Welcome</h2>
    <p>Hello world</p>
  </Card.Body>
</Card>
\`\`\`

This is the Open-Closed Principle in action: your components are open for extension (new compositions) but closed for modification (you do not change existing component code to add new variations).

### Pattern 2: Render Props

A render prop is a function that a component calls to determine what to render. The component provides data or behaviour; the consumer decides how to display it. Think of it as a contract: "I will give you data, you tell me how to display it."

\`\`\`tsx
// # The DataFetcher component handles ALL the fetching logic:
// # loading states, error handling, caching, retry.
// # But it has NO opinion about how to display the data.
// # The consumer decides that via the render prop (children function).
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    // # The consumer controls the UI
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage message={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
\`\`\`

When should you use render props? When you have reusable logic (data fetching, mouse tracking, intersection observation) that different consumers need to render differently. One consumer might show a spinner during loading; another might show a skeleton screen. The logic is shared; the presentation varies.

That said, custom hooks have largely replaced render props in modern React. A render prop and a custom hook solve the same problem — sharing logic — but hooks are simpler and more composable. If you are writing new code, prefer hooks. You will still encounter render props in older codebases and component libraries.

### Pattern 3: Custom Hooks for Logic Reuse

Custom hooks are the modern way to share logic between components. A custom hook is just a function that uses other hooks. It starts with "use" — that is the only naming requirement.

The key insight is separation of concerns: your component handles rendering (JSX), and your hook handles logic (state, effects, calculations). This makes both easier to understand, test, and reuse.

\`\`\`tsx
// # Custom hook — reusable logic, zero UI
// # Any component can use this to persist values in localStorage.
// # The hook handles serialization, error recovery, and syncing.
function useLocalStorage<T>(key: string, initialValue: T) {
  // # Lazy initialization — only reads localStorage once on mount
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      // # localStorage might be unavailable (incognito, full storage)
      return initialValue;
    }
  });

  // # Sync to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // # Storage full or unavailable — fail silently
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// # Usage — any component can now persist state to localStorage
// # with a single line. The hook handles all the complexity.
function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  return <ThemePicker value={theme} onChange={setTheme} />;
}

function Preferences() {
  const [lang, setLang] = useLocalStorage("language", "en");
  return <LanguagePicker value={lang} onChange={setLang} />;
}
\`\`\`

Good custom hooks follow a simple rule: they encapsulate one piece of reusable logic. \`useLocalStorage\` handles persistence. \`useMediaQuery\` handles responsive breakpoints. \`useDebounce\` handles debouncing. Each hook is small, focused, and testable in isolation.

### Pattern 4: Controlled vs Uncontrolled Components

This pattern is about who owns the state — the parent component or the child component.

In a **controlled** component, the parent owns the state and passes it down as props. The child cannot change its own state; it can only request changes through callbacks. This gives the parent full control over the component's behaviour.

\`\`\`tsx
// # CONTROLLED — parent owns the state
// # The input displays whatever 'name' is. It cannot change itself.
// # onChange tells the parent what the user typed; the parent decides
// # whether to update 'name' (it could validate, transform, or reject).
function Form() {
  const [name, setName] = useState("");
  return (
    <input
      value={name}               // # Parent controls the display value
      onChange={e => setName(e.target.value)} // # Parent decides what happens on change
    />
  );
}
\`\`\`

In an **uncontrolled** component, the child owns its own state. The parent does not know what the current value is unless it asks (via a ref). This is simpler but gives you less control.

\`\`\`tsx
// # UNCONTROLLED — child owns its own state
// # The input manages its own value internally.
// # The parent can read it via the ref, but only when it chooses to.
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    // # Read the value at submit time, not continuously
    console.log(inputRef.current?.value);
  };
  return <input ref={inputRef} defaultValue="" />;
}
\`\`\`

**The rule:** Default to controlled components. They are more predictable, easier to validate, and make your data flow clear. Use uncontrolled only for simple forms or when integrating with non-React code (like a jQuery plugin).

### Pattern 5: Error Boundaries

JavaScript errors in a component tree used to crash the entire React application — the whole page would go white. Error boundaries catch these errors and display a fallback UI instead, so only the broken part fails while the rest of the page keeps working.

Think of error boundaries like circuit breakers in your house. When one circuit overloads, the breaker for that circuit trips, cutting power to that room — but the rest of the house stays lit. Without circuit breakers, the whole house goes dark.

\`\`\`tsx
// # Error boundaries must be class components (React limitation)
// # They catch errors in rendering, lifecycle methods, and constructors
// # of their child component tree.
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  // # This lifecycle method catches errors during rendering
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // # This lifecycle method lets you log the error
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // # Send to error tracking service (Sentry, etc.)
    console.error("Component error:", error, info);
  }

  render() {
    // # Show fallback UI if an error was caught
    if (this.state.hasError) return this.props.fallback;
    // # Otherwise, render children normally
    return this.props.children;
  }
}

// # Usage — wrap risky components. If RiskyComponent throws,
// # only that component is replaced by the fallback message.
// # The rest of the page continues working.
<ErrorBoundary fallback={<p>Something went wrong. Please refresh.</p>}>
  <RiskyComponent />
</ErrorBoundary>
\`\`\`

**Best practice:** Place error boundaries strategically. Wrap major page sections (sidebar, main content, header) in their own boundaries. This way, if the sidebar crashes, the main content still works. Do not wrap every single component — that creates too much visual noise when things go wrong.

### React Performance Optimization

React is fast by default for most applications. Performance optimization should only happen after you have measured and identified a real problem. Premature optimization adds complexity without benefit.

That said, there are common patterns that genuinely help when you need them:

| Technique | What It Does | When to Use |
|-----------|-------------|-------------|
| React.memo() | Skips re-rendering when props have not changed | Expensive components whose parent re-renders often with same props |
| useMemo() | Caches the result of an expensive calculation | Sorting/filtering large arrays, complex computations |
| useCallback() | Caches a function reference | Functions passed as props to memoized children |
| Virtualization (react-window) | Only renders visible items in a list | Rendering 1,000+ items |
| Code splitting (lazy/Suspense) | Loads component code on demand | Large components not needed on initial page load |
| Key prop optimization | Helps React identify which items changed | Always use stable, unique keys (never array index for dynamic lists) |

**The workflow:** Profile first with React DevTools Profiler. Find which components re-render most often and why. Then apply the appropriate technique. Most performance issues come from unnecessary re-renders, not slow computations.`,
      },
      {
        title: "React Hooks Deep Dive",
        slug: "react-hooks-deep-dive",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## React Hooks Deep Dive

Hooks are functions that let you "hook into" React's state and lifecycle features from function components. Before hooks, you needed class components for state and lifecycle methods. Hooks replaced all of that with a simpler, more composable API.

Understanding hooks deeply is essential because the most common React bugs — infinite loops, stale closures, memory leaks, unnecessary re-renders — all stem from misunderstanding how hooks work.

### useState — Managing Component State

useState is the most basic hook. It gives your component a piece of state — a value that React remembers between renders and that, when changed, triggers a re-render.

\`\`\`tsx
// # Declare a state variable called 'count' with initial value 0
// # setCount is the function to update it
const [count, setCount] = useState(0);

// # Direct update — set to a specific value
setCount(5);

// # Functional update — when new state depends on old state
// # ALWAYS use this form for increments, toggles, and array manipulations
setCount(prev => prev + 1);
\`\`\`

The functional update form (\`prev => prev + 1\`) is critically important and many developers underuse it. Here is why it matters:

**The stale closure bug — the most common React mistake:**

\`\`\`tsx
// # BUG — clicking the button 3 times fast increments by only 1
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // # Each of these captures the SAME 'count' from when this
    // # render's handleClick was created. If count was 0,
    // # ALL THREE calls set count to 0 + 1 = 1.
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // # Result: count becomes 1, not 3!
  };
}

// # FIX — functional updates always read the latest state
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // # Each call reads the LATEST state, not the stale closure value
    setCount(prev => prev + 1); // 0 → 1
    setCount(prev => prev + 1); // 1 → 2
    setCount(prev => prev + 1); // 2 → 3
    // # Result: count correctly becomes 3!
  };
}
\`\`\`

This bug happens because of how JavaScript closures work. When React renders your component, it creates a snapshot of all state values. The handleClick function "closes over" that snapshot. Even if state changes between clicks, the function still sees the old value. The functional update form avoids this because it receives the latest state as an argument instead of reading it from the closure.

**Lazy initialization — expensive initial values:**

\`\`\`tsx
// # BAD — this function runs on EVERY render, even though
// # useState only uses the result on the FIRST render
const [data, setData] = useState(expensiveComputation());

// # GOOD — pass a function, not a value
// # The function only runs ONCE (on the first render)
const [data, setData] = useState(() => expensiveComputation());
\`\`\`

### useEffect — Side Effects and Synchronization

useEffect lets you synchronize your component with external systems: APIs, timers, event listeners, the DOM, and anything outside React's render cycle. Think of it as telling React: "after you render, do this extra thing."

The most important thing to understand about useEffect is the dependency array — the second argument. It controls WHEN the effect runs:

\`\`\`tsx
// # No dependency array — runs after EVERY render (usually wrong)
// # This can cause infinite loops if the effect updates state
useEffect(() => {
  fetchData();
});

// # Empty dependency array — runs ONCE after the first render (mount)
// # Use for one-time setup: API calls, event listeners, timers
useEffect(() => {
  fetchData();
}, []);

// # Specific dependencies — runs when ANY listed value changes
// # This effect re-runs whenever userId changes
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// # Cleanup function — runs before re-run AND on unmount
// # Essential for preventing memory leaks with subscriptions,
// # timers, and event listeners
useEffect(() => {
  const interval = setInterval(() => tick(), 1000);
  // # Return a cleanup function — React calls this before
  // # running the effect again and when the component unmounts
  return () => clearInterval(interval);
}, []);
\`\`\`

**The dependency array is a contract, not a suggestion.** Every variable used inside the effect must appear in the dependency array. If you use \`userId\` inside the effect but leave it out of the deps, your effect uses a stale value — it sees the userId from the first render forever, even after it changes. ESLint's exhaustive-deps rule catches this, and you should never disable it.

**Common useEffect mistakes:**

\`\`\`tsx
// # MISTAKE 1: Infinite loop
// # The effect updates 'items', which triggers a re-render,
// # which runs the effect again, which updates 'items'...
const [items, setItems] = useState([]);
useEffect(() => {
  fetchItems().then(setItems);
}, [items]); // # items is a dependency that the effect itself changes!
// # FIX: Use [] if you want to fetch once, or use a different trigger

// # MISTAKE 2: Missing cleanup (memory leak)
useEffect(() => {
  window.addEventListener("resize", handleResize);
  // # If this component unmounts, the event listener stays attached!
  // # This causes memory leaks and bugs.
}, []);
// # FIX: Always return a cleanup function for subscriptions
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

// # MISTAKE 3: Fetching without handling race conditions
useEffect(() => {
  // # If userId changes rapidly, multiple fetches race.
  // # An older response might arrive after a newer one,
  // # showing stale data.
  fetchUser(userId).then(setUser);
}, [userId]);
// # FIX: Use an abort controller or a stale flag
useEffect(() => {
  let cancelled = false;
  fetchUser(userId).then(user => {
    if (!cancelled) setUser(user);
  });
  return () => { cancelled = true; };
}, [userId]);
\`\`\`

### useRef — Mutable Values That Persist Without Re-rendering

useRef gives you a mutable container that persists across renders but does NOT trigger re-renders when changed. It is perfect for two use cases: accessing DOM elements and storing mutable values that should not cause re-renders.

\`\`\`tsx
// # USE CASE 1: DOM reference — access the actual DOM element
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  // # Focus the input when the component mounts
  inputRef.current?.focus();
}, []);
// # In JSX: <input ref={inputRef} />

// # USE CASE 2: Mutable value that persists but doesn't re-render
// # Perfect for tracking values you need but don't display
const renderCount = useRef(0);
useEffect(() => {
  renderCount.current++; // # Does NOT trigger a re-render
  console.log("Render count:", renderCount.current);
});
\`\`\`

The key difference between useRef and useState: updating a ref does NOT cause a re-render. This makes refs ideal for values that change frequently but should not update the UI — interval IDs, previous values, DOM measurements, and animation frame IDs.

### useMemo and useCallback — Caching Computations and Functions

These hooks cache values between renders so React does not recompute them unnecessarily. But they are not free — they add memory overhead and code complexity. Use them deliberately, not by default.

\`\`\`tsx
// # useMemo — cache the RESULT of an expensive computation
// # Only re-sorts when 'items' changes, not on every render
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items] // # Dependency array — recompute when items changes
);

// # useCallback — cache the FUNCTION REFERENCE itself
// # The function only changes when the dependencies change
const handleClick = useCallback(
  (id: string) => { setSelected(id); },
  [] // # No dependencies — function never changes
);
\`\`\`

**When to use them (and when NOT to):**

Use useMemo when:
1. The computation takes more than ~1ms (sorting thousands of items, complex calculations)
2. The result is passed to a memoized child component (React.memo)
3. The result is used in another hook's dependency array

Use useCallback when:
1. The function is passed as a prop to a child wrapped in React.memo
2. The function is in another hook's dependency array

Do NOT use them when:
- The computation is simple (comparing two values, string concatenation)
- The component does not re-render often
- The result is not passed to memoized children

Adding useMemo/useCallback everywhere is a common mistake. Each one adds a comparison on every render (React must check if dependencies changed). For cheap computations, this comparison costs MORE than just re-computing the value.

### Hook Rules — Why They Exist

React tracks hooks by their CALL ORDER, not by their names. The first hook called in a component is "hook 1," the second is "hook 2," and so on. React uses this order to match each hook call to its stored state from the previous render.

This means hooks must ALWAYS be called in the same order on every render. Two rules enforce this:

1. **Only call hooks at the top level** — never inside conditions, loops, or nested functions
2. **Only call hooks in React functions** — components or custom hooks

\`\`\`tsx
// # BAD — hook inside a condition
// # On renders where userId exists, useState is hook #2
// # On renders where it doesn't, useState is hook #1
// # React matches the wrong state to the wrong hook!
function Profile({ userId }: { userId?: string }) {
  if (!userId) return null;
  const [user, setUser] = useState(null); // # BREAKS the rules
}

// # GOOD — hooks always run, condition is in the JSX
// # useState is ALWAYS hook #1 on every render
function Profile({ userId }: { userId?: string }) {
  const [user, setUser] = useState(null); // # Always runs
  if (!userId) return null; // # Early return AFTER hooks
  // ...
}
\`\`\``,
      },
      {
        title: "React Patterns Quiz",
        slug: "react-patterns-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## React Patterns Quiz

<!--quiz
[
  {
    "question": "What's wrong with this code?\\n\\nconst [items, setItems] = useState([]);\\nuseEffect(() => {\\n  fetchItems().then(setItems);\\n}, [items]);",
    "options": [
      "Nothing — it correctly fetches items when they change",
      "Infinite loop — setItems changes items, which triggers the effect again",
      "Missing error handling in the promise",
      "useState should use an empty object, not an empty array"
    ],
    "correctIndex": 1,
    "explanation": "This creates an infinite loop: the effect runs → fetchItems updates items via setItems → items changed (new array reference) → effect runs again → repeat forever. The dependency should be [] (run once on mount) or a specific trigger like a search query, not the state that the effect itself updates. Remember: arrays are compared by reference in JavaScript, so even if the fetched data is identical, a new array is a new reference."
  },
  {
    "question": "When should you use React.memo() to wrap a component?",
    "options": [
      "Always — it's free performance",
      "When the component is expensive to render AND its parent re-renders often with the same props",
      "Only for class components that need shouldComponentUpdate",
      "When the component has more than 5 props"
    ],
    "correctIndex": 1,
    "explanation": "React.memo() prevents re-renders when props haven't changed. But it's NOT free — React must shallow-compare all props on every parent render to decide whether to skip the child render. This comparison has a cost. It's only worth paying that cost when: (1) the component is expensive to render (large DOM tree, complex logic), AND (2) it often receives the same props while its parent re-renders. For simple components, the comparison may cost more than just re-rendering."
  },
  {
    "question": "Why must React hooks be called at the top level of a component, never inside conditions?",
    "options": [
      "It's a convention for readability, not a requirement",
      "React tracks hooks by their call order — conditional hooks break the order between renders",
      "Conditional hooks cause memory leaks",
      "TypeScript can't type-check hooks inside conditions"
    ],
    "correctIndex": 1,
    "explanation": "React identifies hooks by their call ORDER (1st hook, 2nd hook, etc.), not by name. If a hook is inside an if-statement, it might be the 3rd hook on one render and the 2nd on another — React would match hook states to the wrong hooks, causing bizarre bugs. This is why the 'Rules of Hooks' ESLint plugin exists — it catches this at compile time."
  },
  {
    "question": "You have a Counter component. Clicking the button 3 times fast increments by only 1 instead of 3. What's the fix?",
    "options": [
      "Use useRef instead of useState",
      "Add a setTimeout to debounce clicks",
      "Use the functional form: setCount(prev => prev + 1)",
      "Wrap the handler in useCallback"
    ],
    "correctIndex": 2,
    "explanation": "The bug is stale closures: setCount(count + 1) captures 'count' at the time the click handler was created during the last render. All 3 rapid clicks use the same stale value (e.g., 0), so they all set count to 0 + 1 = 1. The functional form setCount(prev => prev + 1) always reads the latest state via the 'prev' argument, so each click correctly increments: 0→1, 1→2, 2→3."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 2: TypeScript for Frontend
     ============================================================ */
  {
    name: "TypeScript for Frontend",
    slug: "typescript-frontend",
    description: "Type-safe components, generics, utility types, discriminated unions, and typing API responses.",
    order: 2,
    sections: [
      {
        title: "TypeScript Patterns for React",
        slug: "typescript-react-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## TypeScript Patterns for React

TypeScript is JavaScript with a type system bolted on. It catches entire categories of bugs at compile time — bugs that would otherwise crash your application in production at 3 AM on a Saturday. The type system is your first line of defence, catching errors before any user ever sees them.

For React specifically, TypeScript provides two enormous benefits: it ensures your components receive the right props (no more "undefined is not a function" errors), and it gives you autocomplete everywhere (you can discover a component's API just by typing a dot).

This lesson covers the TypeScript patterns you will use daily in professional React codebases. These are not theoretical — they are the patterns that prevent real bugs and save real debugging time.

### Typing Component Props

Every React component should have typed props. This is the most basic and most important TypeScript pattern. It tells consumers exactly what the component expects and prevents misuse.

\`\`\`tsx
// # Define the props interface — this IS the component's API
// # Think of it as a contract: "I accept these inputs and nothing else"
interface ButtonProps {
  label: string;                                    // # Required — must be a string
  onClick: () => void;                              // # Required — must be a function
  variant?: "primary" | "secondary" | "danger";     // # Optional — only these 3 values allowed
  disabled?: boolean;                               // # Optional — defaults to false
  children?: React.ReactNode;                       // # Optional — any renderable content
  size?: "sm" | "md" | "lg";                        // # Optional — t-shirt sizing
}

// # Use the props with destructuring and defaults
function Button({
  label,
  onClick,
  variant = "primary",  // # Default value if not provided
  disabled = false,
  size = "md",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`btn btn-\${variant} btn-\${size}\`}
    >
      {label}
    </button>
  );
}
\`\`\`

Now TypeScript enforces the contract. If someone tries to pass \`variant="banana"\`, TypeScript shows a red squiggly line immediately — the bug is caught before the code even runs.

### Discriminated Unions (Tagged Unions)

This is the most powerful TypeScript pattern for handling multiple states. It models the reality that a value can be in exactly one of several states, and each state has different data available.

Think about an API call. It is always in one of four states: idle (not started), loading (in progress), success (data received), or error (something went wrong). At any moment, it is in exactly ONE of these states. A discriminated union models this perfectly:

\`\`\`tsx
// # Each state has a 'status' field (the discriminant)
// # TypeScript uses this field to narrow the type automatically
type ApiState<T> =
  | { status: "idle" }                    // # Not started — no data, no error
  | { status: "loading" }                 // # In progress — no data yet
  | { status: "success"; data: T }        // # Complete — data is available
  | { status: "error"; error: string };   // # Failed — error message available

function UserProfile() {
  const [state, setState] = useState<ApiState<User>>({ status: "idle" });

  // # TypeScript narrows the type inside each branch
  // # This means you can ONLY access 'data' in the success case
  // # and ONLY access 'error' in the error case.
  switch (state.status) {
    case "idle":
      return <p>Click to load your profile</p>;
    case "loading":
      return <Spinner />;
    case "success":
      // # TypeScript KNOWS state.data exists here — no runtime check needed
      return <p>Welcome, {state.data.name}!</p>;
    case "error":
      // # TypeScript KNOWS state.error exists here
      return <p>Error: {state.error}</p>;
  }
}
\`\`\`

Why is this better than optional properties? Because with optional properties, TypeScript cannot help you:

\`\`\`tsx
// # BAD — optional properties do not model the state machine
interface ApiState<T> {
  loading: boolean;
  data?: T;
  error?: string;
}
// # Problem: nothing prevents { loading: true, data: someData, error: "oops" }
// # That state makes no sense — loading AND success AND error simultaneously?
// # TypeScript cannot catch this logical impossibility.

// # GOOD — discriminated union makes impossible states unrepresentable
// # You literally CANNOT construct a value that is loading AND has data.
\`\`\`

### Generic Components

Generics let you write components that work with ANY data type while maintaining full type safety. Think of generics like a template: "this component works with items of type T, where T is whatever you pass in."

\`\`\`tsx
// # A reusable list component — works with ANY item type
// # T is the generic type parameter — it becomes whatever type
// # the consumer passes as 'items'
interface ListProps<T> {
  items: T[];                                    // # Array of any type
  renderItem: (item: T) => React.ReactNode;      // # How to render each item
  keyExtractor: (item: T) => string;             // # How to get a unique key
  emptyMessage?: string;                         // # What to show if no items
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) {
    return <p className="text-gray-500">{emptyMessage || "No items"}</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// # Usage with User[] — TypeScript infers T = User
// # Now 'user' in renderItem is typed as User automatically!
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>} // # user: User (inferred!)
  keyExtractor={(user) => user.id}                // # user: User (inferred!)
  emptyMessage="No users found"
/>

// # Usage with Product[] — same component, different type
// # T is now Product — full type safety for a completely different data shape
<List
  items={products}
  renderItem={(product) => <span>{product.title} — £{product.price}</span>}
  keyExtractor={(product) => product.id}
/>
\`\`\`

The beauty of generics is that you write the component once and it works with any data type — users, products, orders, blog posts — while giving you full autocomplete and type checking for each specific use.

### Utility Types You Will Use Daily

TypeScript provides built-in utility types that transform existing types. These save you from duplicating type definitions and keep your types in sync.

\`\`\`tsx
// # Given this User type:
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
}

// # Partial<T> — make ALL properties optional
// # Perfect for update functions where you only change some fields
type UserUpdate = Partial<User>;
// # = { id?: string; name?: string; email?: string; ... }

// # Required<T> — make ALL properties required (opposite of Partial)
type CompleteUser = Required<User>;

// # Pick<T, K> — select ONLY specific properties
// # Perfect for component props that only need a subset of a type
type UserPreview = Pick<User, "id" | "name" | "role">;
// # = { id: string; name: string; role: "admin" | "editor" | "viewer" }

// # Omit<T, K> — remove specific properties
// # Perfect for API responses that shouldn't include sensitive data
type PublicUser = Omit<User, "password">;
// # = { id: string; name: string; email: string; role: ...; createdAt: Date }

// # Record<K, V> — create an object type with specific key and value types
type UserMap = Record<string, User>;
// # = { [key: string]: User }

// # Extract and Exclude — filter union types
type Status = "active" | "inactive" | "banned";
type ActiveStatus = Extract<Status, "active" | "inactive">;
// # = "active" | "inactive"
type BannedStatus = Exclude<Status, "active" | "inactive">;
// # = "banned"
\`\`\`

### Typing API Responses

A common source of runtime errors is assuming an API response has a certain shape without verifying it. TypeScript types give you compile-time safety, but they do not validate runtime data. For full safety, combine TypeScript types with runtime validation (Zod).

\`\`\`tsx
// # Define your API response shapes
interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// # Type-safe fetch wrapper — generic over the response type
async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error: ApiError = await res.json();
    throw new Error(error.error.message);
  }
  return res.json() as Promise<T>;
}

// # Usage — the response is fully typed
const { data, pagination } = await apiFetch<ApiResponse<User[]>>("/api/users");
// # data is User[] — full autocomplete: data[0].name, data[0].email
// # pagination?.total gives you the total count
\`\`\`

### The 'as const' Assertion

The \`as const\` assertion tells TypeScript to infer the narrowest possible type. Without it, TypeScript widens string literals to \`string\` and array literals to \`string[]\`. With it, you get the exact values — which lets you derive union types from arrays.

\`\`\`tsx
// # Without 'as const' — TypeScript infers string[]
const ROLES = ["admin", "editor", "viewer"];
// # type: string[] — you lose the specific values

// # With 'as const' — TypeScript infers the exact tuple
const ROLES = ["admin", "editor", "viewer"] as const;
// # type: readonly ["admin", "editor", "viewer"]

// # Now you can derive a union type from the array!
type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"

// # This is powerful: define values ONCE, derive the type from them
// # No duplication, no risk of the type and values getting out of sync
\`\`\``,
      },
      {
        title: "TypeScript for Frontend Quiz",
        slug: "typescript-frontend-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## TypeScript for Frontend Quiz

<!--quiz
[
  {
    "question": "You have a Button component that can be 'primary', 'secondary', or 'danger'. Which TypeScript pattern gives the best type safety?",
    "options": [
      "variant: string",
      "variant: 'primary' | 'secondary' | 'danger' (union of string literals)",
      "variant: ButtonVariant (an enum)",
      "variant: any"
    ],
    "correctIndex": 1,
    "explanation": "A union of string literals gives the best developer experience: autocomplete shows exactly the valid options, typos are caught at compile time ('primry' would error), and no enum import is needed. Enums work but add runtime JavaScript code and require imports everywhere. A plain 'string' type provides zero safety — you could pass 'banana' and TypeScript wouldn't complain. 'any' completely defeats the purpose of TypeScript."
  },
  {
    "question": "Your component receives either a 'href' (link) or 'onClick' (button), never both. How do you type this?",
    "options": [
      "{ href?: string; onClick?: () => void } — make both optional",
      "Use a discriminated union: { variant: 'link'; href: string } | { variant: 'button'; onClick: () => void }",
      "{ href: string | undefined; onClick: () => void | undefined }",
      "Use 'as any' to bypass the type system"
    ],
    "correctIndex": 1,
    "explanation": "A discriminated union models the 'either/or' relationship precisely. With optional props, nothing prevents passing BOTH href AND onClick simultaneously (or neither) — the type system can't enforce the constraint. A discriminated union with a 'variant' field makes the type system enforce it: if variant is 'link', only href is available; if 'button', only onClick. TypeScript narrows the type automatically when you check the variant field."
  },
  {
    "question": "What does the 'as const' assertion do when used with an array like ['admin', 'editor', 'viewer'] as const?",
    "options": [
      "Makes the array immutable at runtime (like Object.freeze)",
      "Narrows the type from string[] to the readonly tuple ['admin', 'editor', 'viewer'], enabling typeof ROLES[number] to produce a union type",
      "Converts the values to constants (like #define in C)",
      "It has no effect — arrays are already constant"
    ],
    "correctIndex": 1,
    "explanation": "'as const' tells TypeScript to infer the NARROWEST possible type. Without it, ['admin', 'editor'] is typed as string[] — you lose the specific values. With it, TypeScript knows the EXACT values in the array, so typeof ROLES[number] produces 'admin' | 'editor' | 'viewer' — a union type derived from the array. This lets you define values once and derive the type automatically, with no duplication. Note: it makes the array readonly at the TYPE level, not at runtime."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 3: CSS & Styling
     ============================================================ */
  {
    name: "CSS & Styling",
    slug: "css-styling",
    description: "Flexbox, Grid, responsive design, animations, CSS-in-JS patterns, and Tailwind CSS mastery.",
    order: 3,
    sections: [
      {
        title: "Flexbox & Grid — Complete Guide",
        slug: "flexbox-grid-guide",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Flexbox & Grid — The Complete Guide

Every modern web layout uses Flexbox, Grid, or a combination of both. These are the two most important CSS layout systems, and understanding when to use each one will save you hours of frustration trying to get things to line up properly.

Think of the difference this way: Flexbox is like arranging books on a single shelf — you control how they spread out along that one shelf (left to right, or stacked top to bottom). Grid is like designing an entire bookcase — you control both the rows AND columns simultaneously, deciding exactly where each book goes in the two-dimensional grid.

### Flexbox — One-Dimensional Layouts

Flexbox works in a single direction: either horizontally (row) or vertically (column). It is perfect for components that flow in one direction — navigation bars, button groups, form layouts, card footers with action buttons.

The fundamental concept is that a flex container distributes space among its children. You control HOW that space is distributed.

**The Container (Parent) — Controls the overall layout:**

\`\`\`css
.container {
  display: flex;               /* # Activate flexbox */
  flex-direction: row;         /* # Direction: row (→) or column (↓) */
  justify-content: center;     /* # MAIN axis alignment (the direction items flow) */
  align-items: center;         /* # CROSS axis alignment (perpendicular to main) */
  gap: 16px;                   /* # Space BETWEEN items (not around edges) */
  flex-wrap: wrap;             /* # Allow items to wrap to next line if they don't fit */
}
\`\`\`

Understanding the difference between justify-content and align-items is crucial and trips up many developers. Here is the mental model:

- \`justify-content\` controls the **main axis** — the direction items flow. In \`flex-direction: row\`, the main axis is horizontal. In \`column\`, the main axis is vertical.
- \`align-items\` controls the **cross axis** — perpendicular to the main axis. In \`row\`, the cross axis is vertical. In \`column\`, the cross axis is horizontal.

So in a row layout, \`justify-content: center\` centres items horizontally, and \`align-items: center\` centres them vertically. In a column layout, the axes swap.

**The Items (Children) — Control individual sizing:**

\`\`\`css
.item {
  flex-grow: 1;      /* # How much EXTRA space this item should absorb (0 = don't grow) */
  flex-shrink: 0;    /* # Whether this item can shrink below its natural size (0 = don't shrink) */
  flex-basis: 200px; /* # Starting size before growing/shrinking */

  /* # Shorthand: flex: grow shrink basis */
  flex: 1 0 200px;   /* # Grow to fill space, don't shrink, start at 200px */
}
\`\`\`

**Common Flexbox Recipes — patterns you will use every day:**

\`\`\`css
/* # Recipe 1: Centre anything (the most common Flexbox use) */
.center {
  display: flex;
  justify-content: center;  /* # Horizontal centre */
  align-items: center;      /* # Vertical centre */
  min-height: 100vh;        /* # Full viewport height */
}

/* # Recipe 2: Navigation bar (logo left, links right) */
.navbar {
  display: flex;
  justify-content: space-between; /* # Push items to opposite ends */
  align-items: center;            /* # Vertically centre everything */
  padding: 0 24px;
}

/* # Recipe 3: Equal-width columns */
.columns {
  display: flex;
  gap: 16px;        /* # Space between columns */
}
.columns > * {
  flex: 1;          /* # Each child takes equal space */
}

/* # Recipe 4: Sticky footer (footer always at bottom) */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;     /* # Full viewport height */
}
.page > main {
  flex: 1;               /* # Main content grows to fill available space */
}
/* # Footer naturally sits at the bottom because main pushes it down */
\`\`\`

### Grid — Two-Dimensional Layouts

CSS Grid works in both rows AND columns simultaneously. It is designed for page-level layouts and any situation where you need precise control over both dimensions.

\`\`\`css
/* # Basic grid — 3 equal columns with gap */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* # 3 columns, each 1 fraction of available space */
  gap: 24px;                             /* # Space between all cells */
}

/* # Page layout with named areas */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;          /* # Sidebar: 250px, Main: rest */
  grid-template-rows: 60px 1fr 40px;         /* # Header: 60px, Main: flexible, Footer: 40px */
  grid-template-areas:
    "header  header"    /* # Header spans both columns */
    "sidebar main"      /* # Sidebar and main side by side */
    "footer  footer";   /* # Footer spans both columns */
  min-height: 100vh;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* # The magic responsive grid — auto-adjusts column count! */
/* # This single line handles ALL breakpoints — no media queries needed */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
/* # On a 1200px screen: 4 columns of ~280px each */
/* # On a 900px screen: 3 columns of ~280px each */
/* # On a 600px screen: 2 columns of ~280px each */
/* # On a 320px screen: 1 column at full width */
\`\`\`

The \`repeat(auto-fill, minmax(280px, 1fr))\` pattern is one of the most useful CSS tricks. It creates as many columns as will fit (each at least 280px wide) and distributes remaining space equally. No media queries, no JavaScript — the browser handles all the responsive behaviour.

### When to Use Flexbox vs Grid

| Layout Need | Use | Why |
|-------------|-----|-----|
| Items in a single row or column | Flexbox | One-dimensional flow |
| Navigation bar | Flexbox | Items flow in one direction |
| Centering a single element | Flexbox | Simplest solution |
| Card grid (equal sizes) | Grid | Two-dimensional alignment |
| Full page layout (header, sidebar, main, footer) | Grid | Named areas make it clear |
| Items spanning multiple rows + columns | Grid | Grid handles spanning natively |
| Content-driven sizing (items determine their own size) | Flexbox | Flex items size themselves |
| Layout-driven sizing (the grid determines item size) | Grid | Grid cells have fixed sizes |

**The general rule:** Use Flexbox for components (inside a card, inside a nav bar). Use Grid for page layouts (arranging those cards and nav bars on the page). Many real layouts use both — Grid for the overall page structure, Flexbox inside each Grid cell.

### Responsive Design — Mobile-First Approach

Responsive design means your layout adapts to different screen sizes. The best approach is mobile-first: write your base styles for mobile, then add complexity for larger screens using media queries.

\`\`\`css
/* # Base styles — mobile first (no media query needed) */
.container {
  padding: 16px;
  display: flex;
  flex-direction: column; /* # Stack everything vertically on mobile */
  gap: 16px;
}

/* # Tablet and up (768px+) — add side-by-side layout */
@media (min-width: 768px) {
  .container {
    flex-direction: row;  /* # Side by side on tablet */
    padding: 24px;
  }
}

/* # Desktop (1024px+) — add max-width and centre */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;       /* # Centre the container */
    padding: 32px;
  }
}
\`\`\`

**Responsive units — choosing the right measurement:**

| Unit | What It Means | Best For |
|------|--------------|----------|
| rem | Relative to root font size (usually 16px) | Font sizes, spacing, margins |
| em | Relative to parent element's font size | Component-level spacing that scales with text |
| vw / vh | Percentage of viewport width / height | Full-screen sections, hero areas |
| % | Percentage of parent element | Fluid widths within a container |
| clamp() | Minimum, preferred, maximum value | Fluid typography that scales smoothly |

\`\`\`css
/* # Fluid typography — font size scales smoothly between 16px and 24px */
/* # based on viewport width, without ever going below 16px or above 24px */
h1 {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
}
\`\`\``,
      },
      {
        title: "Tailwind CSS Mastery",
        slug: "tailwind-mastery",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## Tailwind CSS Mastery

Tailwind CSS is a utility-first CSS framework that takes a fundamentally different approach to styling. Instead of writing custom CSS classes with semantic names (\`.card-header\`, \`.nav-link\`), you compose designs directly in your HTML using small, single-purpose utility classes (\`flex\`, \`p-4\`, \`text-white\`).

This feels wrong at first — "isn't this just inline styles?" No. Tailwind utilities are constrained to a design system (consistent spacing, colours, sizes), support responsive breakpoints and pseudo-states (hover, focus, dark mode), and generate optimised CSS that only includes what you actually use.

The initial learning curve is steep — you need to memorise a few dozen class names — but once you know them, you can build UIs dramatically faster because you never leave your HTML/JSX to write CSS in a separate file.

### Essential Utility Patterns

**Spacing — padding and margin:**

Tailwind uses a spacing scale where each number is 0.25rem (4px). So \`p-4\` is 1rem (16px), \`p-8\` is 2rem (32px), and so on.

\`\`\`html
<!-- # p-{n} = padding, m-{n} = margin -->
<!-- # x = horizontal (left+right), y = vertical (top+bottom) -->
<!-- # t/b/l/r = top/bottom/left/right individually -->
<div class="p-4 mx-auto my-8 px-6 py-3">
  <!-- p-4 = 1rem (16px) padding on all sides -->
  <!-- mx-auto = auto margin left+right (centres the element) -->
  <!-- my-8 = 2rem (32px) margin top+bottom -->
  <!-- px-6 = 1.5rem horizontal padding, py-3 = 0.75rem vertical -->
</div>
\`\`\`

**Flexbox and Grid:**

\`\`\`html
<!-- # Flex row with items centred and spaced apart -->
<div class="flex items-center justify-between gap-4">
  <span>Logo</span>
  <nav class="flex gap-6">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</div>

<!-- # Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white/5 rounded-xl p-6">Card 1</div>
  <div class="bg-white/5 rounded-xl p-6">Card 2</div>
  <div class="bg-white/5 rounded-xl p-6">Card 3</div>
</div>
\`\`\`

**Responsive breakpoints — mobile-first:**

Tailwind breakpoints work mobile-first. The base class applies to ALL screen sizes. Prefixed classes apply FROM that breakpoint and UP.

\`\`\`html
<!-- # flex-col = column layout on mobile (base) -->
<!-- # md:flex-row = row layout on 768px and above -->
<!-- # lg:gap-8 = larger gap on 1024px and above -->
<div class="flex flex-col md:flex-row gap-4 lg:gap-8">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>
\`\`\`

| Breakpoint | Min-width | Typical Use |
|-----------|-----------|-------------|
| (none) | 0px | Mobile — base styles |
| sm: | 640px | Large phones, landscape |
| md: | 768px | Tablets |
| lg: | 1024px | Laptops |
| xl: | 1280px | Desktops |
| 2xl: | 1536px | Large monitors |

**States — hover, focus, active, disabled:**

\`\`\`html
<!-- # Interactive button with state transitions -->
<button class="
  bg-blue-600          /* # Default background */
  hover:bg-blue-700    /* # Darker on hover */
  focus:ring-2         /* # Focus ring for accessibility */
  focus:ring-blue-400  /* # Ring colour */
  active:bg-blue-800   /* # Even darker when clicked */
  disabled:opacity-50  /* # Faded when disabled */
  disabled:cursor-not-allowed
  transition-colors    /* # Smooth colour transitions */
  px-6 py-2 rounded-lg font-medium text-white
">
  Click me
</button>
\`\`\`

### Common Component Patterns in Tailwind

**Glass morphism card (popular in modern UI design):**

\`\`\`html
<div class="
  bg-white/5           /* # Very subtle white background (5% opacity) */
  backdrop-blur-sm     /* # Blur the content behind the card */
  border border-white/10  /* # Subtle border */
  rounded-xl           /* # Rounded corners */
  p-6                  /* # Padding */
  hover:border-white/20  /* # Brighter border on hover */
  transition-all       /* # Smooth all transitions */
  shadow-lg shadow-black/10  /* # Subtle shadow */
">
  <h3 class="text-white font-bold text-lg mb-2">Glass Card</h3>
  <p class="text-white/70">Content with translucent background</p>
</div>
\`\`\`

**Responsive card grid with hover effects:**

\`\`\`html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div class="group bg-gray-900 rounded-xl p-6 border border-gray-800
              hover:border-indigo-500/50 transition-all duration-300
              hover:shadow-lg hover:shadow-indigo-500/10">
    <h3 class="text-white font-bold group-hover:text-indigo-400 transition-colors">
      Feature Title
    </h3>
    <p class="text-gray-400 mt-2">Description text here</p>
  </div>
</div>
\`\`\`

Notice the \`group\` and \`group-hover:\` pattern. Adding \`group\` to a parent lets child elements respond to the parent's hover state. When you hover the card, the title colour changes via \`group-hover:text-indigo-400\`.

### Best Practices for Tailwind

1. **Extract COMPONENTS, not CSS** — if you find yourself repeating the same utility classes, create a React component, not a CSS class. Components encapsulate both structure and styling.

2. **Use the design system** — stick to Tailwind's spacing scale (4, 8, 12, 16, 20, 24, 32...) and colour palette. Avoid arbitrary values like \`p-[17px]\` — they break the consistency of your design system.

3. **Mobile-first always** — write base styles for mobile, then add breakpoint prefixes for larger screens. Never the other way around.

4. **Configure your theme** — customise colours, fonts, and spacing in \`tailwind.config.ts\` so the entire design system reflects your brand. This way, \`text-primary\` means your brand colour everywhere.

5. **Dark mode** — use the \`dark:\` prefix for dark mode variants. Tailwind supports both class-based and media-query-based dark mode detection.`,
      },
      {
        title: "CSS & Layout Quiz",
        slug: "css-layout-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## CSS & Layout Quiz

<!--quiz
[
  {
    "question": "You need a responsive card grid that auto-adjusts column count without media queries. Best approach?",
    "options": [
      "Flexbox with flex-wrap and fixed widths",
      "CSS Grid with repeat(auto-fill, minmax(280px, 1fr))",
      "Write a media query for each breakpoint",
      "Use JavaScript to calculate and set column count on window resize"
    ],
    "correctIndex": 1,
    "explanation": "CSS Grid with repeat(auto-fill, minmax(280px, 1fr)) creates as many columns as fit in the available space (each at least 280px) and distributes remaining space equally. It handles ALL screen sizes automatically — 4 columns on wide screens, 1 column on phones — with zero media queries and zero JavaScript. The browser does all the work."
  },
  {
    "question": "What's the difference between justify-content and align-items in Flexbox?",
    "options": [
      "They do the same thing",
      "justify-content controls the MAIN axis (direction of flow); align-items controls the CROSS axis (perpendicular)",
      "justify-content is always horizontal; align-items is always vertical",
      "justify-content centres text; align-items centres elements"
    ],
    "correctIndex": 1,
    "explanation": "justify-content controls the MAIN axis (the direction items flow in). align-items controls the CROSS axis (perpendicular to the main axis). In flex-direction: row, main = horizontal and cross = vertical. In flex-direction: column, it REVERSES: main = vertical and cross = horizontal. This is why people get confused — the axes swap when you change direction."
  },
  {
    "question": "In Tailwind CSS, what does the class md:flex-row mean?",
    "options": [
      "Always use flex-row on medium-sized elements",
      "Apply flex-row FROM 768px screen width and UP (mobile-first)",
      "Use flex-row ONLY on medium screens (not on large or small)",
      "A deprecated class that should not be used"
    ],
    "correctIndex": 1,
    "explanation": "Tailwind uses a mobile-first responsive system. md: means 'apply this FROM 768px and UP' — it's equivalent to @media (min-width: 768px) { ... }. The base (unprefixed) class applies to ALL screen sizes including mobile. So 'flex-col md:flex-row' means: column layout on mobile, row layout on tablet and above."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Web Performance
     ============================================================ */
  {
    name: "Web Performance",
    slug: "web-performance",
    description: "Core Web Vitals, bundle optimization, lazy loading, image optimization, and performance profiling.",
    order: 4,
    sections: [
      {
        title: "Core Web Vitals & Performance Metrics",
        slug: "core-web-vitals",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Core Web Vitals & Web Performance

Web performance directly impacts three things that matter to every business: user experience (slow sites frustrate users), conversion rates (a 1-second delay in page load reduces conversions by 7%), and SEO rankings (Google uses Core Web Vitals as ranking signals). Performance is not a nice-to-have — it is a competitive advantage.

### The Three Core Web Vitals

Google defined three specific metrics that capture the most important aspects of user experience. Every web developer should know these by heart.

**LCP (Largest Contentful Paint) — Loading Speed**

LCP measures when the largest visible element on the page finishes rendering. This is usually a hero image, a large heading, or a video thumbnail. It answers the question: "How long until the user sees the main content?"

- Target: under 2.5 seconds
- What counts as the "largest element": images, video posters, background images, block-level text elements
- Most common causes of slow LCP: large unoptimised images, slow server response times, render-blocking JavaScript, CSS that delays rendering

How to fix slow LCP: optimise your largest image (compress, use WebP/AVIF, set proper dimensions), preload critical resources with \`<link rel="preload">\`, use server-side rendering (SSR) or static generation (SSG) so content is in the initial HTML, and eliminate render-blocking resources.

**INP (Interaction to Next Paint) — Responsiveness**

INP measures how quickly the page responds to user interactions — clicks, taps, and key presses. It captures the delay between a user's action and the next visual update. It answers the question: "Does the page feel snappy or sluggish?"

- Target: under 200 milliseconds
- Measured across the entire page lifetime, not just on load
- Most common causes of slow INP: long-running JavaScript tasks that block the main thread, heavy event handlers, excessive DOM manipulation

How to fix slow INP: break long tasks into smaller chunks using \`requestIdleCallback\` or \`setTimeout\`, move expensive computations to Web Workers, debounce input handlers, use CSS animations instead of JavaScript animations (CSS animations run on the compositor thread, not the main thread).

**CLS (Cumulative Layout Shift) — Visual Stability**

CLS measures how much the page layout shifts unexpectedly as it loads. Those annoying moments when you are about to click a button and the page shifts, causing you to click the wrong thing — that is what CLS captures.

- Target: under 0.1
- Most common causes of high CLS: images without explicit dimensions (the browser does not know how big they will be until loaded), dynamically injected content (ads, cookie banners), web fonts that change text size when they load

How to fix high CLS: ALWAYS set width and height on images (or use CSS aspect-ratio), reserve space for dynamic content before it loads, use \`font-display: swap\` with size-matched fallback fonts, avoid inserting content above existing content.

### Bundle Optimization — Loading Less JavaScript

The average web page ships 500KB+ of JavaScript. Much of it is unnecessary on the initial page load. Reducing what you ship and when you ship it is one of the highest-impact performance improvements.

**Code splitting — load only what is needed:**

\`\`\`tsx
// # BEFORE — the entire AdminPanel code loads for every user,
// # even if only 5% of users are admins
import AdminPanel from "./AdminPanel";

// # AFTER — AdminPanel code loads only when an admin visits that page
// # The main bundle is smaller, and regular users never download admin code
const AdminPanel = React.lazy(() => import("./AdminPanel"));

// # Suspense shows a loading fallback while the code loads
<Suspense fallback={<div className="animate-pulse h-96 bg-gray-800 rounded-xl" />}>
  {isAdmin && <AdminPanel />}
</Suspense>
\`\`\`

**Tree shaking — import only what you use:**

\`\`\`tsx
// # BAD — imports the ENTIRE lodash library (~70KB minified)
// # Your bundle includes hundreds of functions you never use
import _ from "lodash";
_.debounce(fn, 300);

// # GOOD — imports ONLY the debounce function (~2KB)
// # Bundlers can tree-shake the rest
import debounce from "lodash/debounce";
debounce(fn, 300);

// # BEST — use native JavaScript when possible (0KB added)
// # Many lodash functions have native equivalents now
const debounced = (() => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), 300);
  };
})();
\`\`\`

### Image Optimization — The Biggest Quick Win

Images are typically the largest assets on a web page. Optimising them is often the single highest-impact performance improvement you can make.

| Format | Best For | Size vs JPEG |
|--------|---------|-------------|
| WebP | Photos, general use | 30% smaller |
| AVIF | Photos (modern browsers) | 50% smaller |
| SVG | Icons, logos, illustrations | Infinitely scalable, tiny |
| PNG | Screenshots, images needing transparency | Lossless but larger |

\`\`\`tsx
// # Next.js Image component — handles ALL optimisation automatically:
// # - Converts to WebP/AVIF
// # - Generates responsive sizes
// # - Lazy loads by default (below-the-fold images)
// # - Prevents CLS by reserving space
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero image showing the product dashboard"
  width={1200}          // # Explicit dimensions prevent CLS
  height={630}
  priority              // # Preload this image — it's above the fold
  placeholder="blur"    // # Show a blurred version while loading
  blurDataURL="data:image/jpeg;base64,..." // # Tiny base64 blur
/>
\`\`\`

### Performance Checklist

| Category | What to Do | Impact |
|----------|-----------|--------|
| Images | WebP/AVIF format, lazy load below-fold, explicit width/height | Very high |
| JavaScript | Code split routes, tree shake imports, defer non-critical scripts | High |
| CSS | Inline critical CSS, lazy load non-critical, remove unused | Medium |
| Fonts | Use font-display: swap, preload critical fonts, self-host | Medium |
| Network | Enable Brotli compression, use CDN, cache static assets | High |
| Rendering | SSR/SSG for content pages, avoid layout shifts | High |
| Third-party | Audit third-party scripts (analytics, ads), lazy load them | Medium |`,
      },
      {
        title: "Web Performance Quiz",
        slug: "web-performance-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Web Performance Quiz

<!--quiz
[
  {
    "question": "Your page has a CLS (Cumulative Layout Shift) score of 0.35 — well above the 0.1 threshold. What's the most likely cause?",
    "options": [
      "Too much JavaScript on the page",
      "Images or ads loading without reserved dimensions, causing content to jump as they appear",
      "Slow server response time",
      "The page has too many web fonts"
    ],
    "correctIndex": 1,
    "explanation": "CLS measures visual instability — how much content shifts as the page loads. The #1 cause is images without explicit width/height attributes: the browser doesn't know how much space to reserve, so when the image loads, everything below it shifts down. Fix: always set width and height on images, use CSS aspect-ratio for responsive images, and reserve space for dynamically loaded content (ads, embeds, cookie banners) before it appears."
  },
  {
    "question": "Your LCP (Largest Contentful Paint) is 5 seconds. The largest element is a hero image. What's the highest-impact fix?",
    "options": [
      "Compress to WebP/AVIF and add a preload link so the browser starts downloading it immediately",
      "Add lazy loading to all images on the page",
      "Minify the JavaScript bundle",
      "Move to a faster hosting provider"
    ],
    "correctIndex": 0,
    "explanation": "LCP measures when the largest visible element renders. For a hero image: (1) compress to WebP/AVIF (often 50-70% smaller than JPEG), (2) add <link rel='preload' as='image'> so the browser starts downloading before it encounters the <img> tag, (3) use loading='eager' (not lazy — it's above the fold). Adding lazy loading to the hero would make LCP WORSE because it delays loading until the image scrolls into view."
  },
  {
    "question": "You import a charting library (200KB) used on only one page. Every page in your app loads it. What's the fix?",
    "options": [
      "Find a smaller charting library",
      "Dynamic import with React.lazy() — load the chart component only when that page is visited",
      "Move the chart to an iframe",
      "Compress the library more aggressively"
    ],
    "correctIndex": 1,
    "explanation": "Code splitting with React.lazy() and dynamic imports loads the charting library ONLY when a user visits the page that uses it. Every other page gets a smaller bundle and faster load. This is one of the highest-impact optimizations: identify large dependencies used on few pages and dynamic-import them. Next.js does route-based splitting automatically, but component-level splitting with React.lazy() gives you finer control."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 5: Accessibility
     ============================================================ */
  {
    name: "Accessibility (a11y)",
    slug: "accessibility",
    description: "WCAG guidelines, semantic HTML, ARIA attributes, keyboard navigation, screen reader testing.",
    order: 5,
    sections: [
      {
        title: "Building Accessible Web Applications",
        slug: "building-accessible-apps",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Accessibility (a11y) — Building for Everyone

One in four adults lives with some form of disability. That is roughly 2 billion people worldwide. Accessibility is not a feature you add at the end — it is a fundamental quality of good software engineering. In many countries (the UK, EU, US, Australia), it is also a legal requirement under disability discrimination laws.

Beyond the legal and ethical arguments, accessibility is simply good engineering practice. Accessible websites work better for EVERYONE: keyboard shortcuts help power users, high contrast helps people using screens in bright sunlight, captions help people watching videos in noisy environments, and clear heading structures help search engines understand your content (SEO).

### Semantic HTML — The Foundation of Accessibility

Using the right HTML elements is 80% of accessibility work. Screen readers (software that reads web pages aloud for blind users) understand semantic HTML natively. They announce a \`<nav>\` element as "navigation," a \`<button>\` as "button," and a \`<h1>\` as "heading level 1." But they cannot understand that a styled \`<div>\` is supposed to be a button — to them, it is just a generic container with no meaning.

\`\`\`html
<!-- # BAD — "div soup". A screen reader sees nothing meaningful.
     # A blind user has no idea this is a navigation bar with links. -->
<div class="nav">
  <div class="nav-item" onclick="navigate('/')">Home</div>
  <div class="nav-item" onclick="navigate('/about')">About</div>
</div>
<div class="main">
  <div class="heading">Welcome</div>
  <div class="text">Click <div class="link" onclick="go('/about')">here</div></div>
</div>

<!-- # GOOD — semantic HTML. The screen reader announces:
     # "Navigation landmark. Link: Home. Link: About."
     # "Main landmark. Heading level 1: Welcome."
     # "Link: about page" -->
<nav aria-label="Main navigation">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
<main>
  <h1>Welcome</h1>
  <p>Visit our <a href="/about">about page</a></p>
</main>
\`\`\`

The semantic version also gives you keyboard navigation for free. Links and buttons are focusable and activatable with Enter by default. The \`<div onclick>\` versions are not — keyboard users cannot interact with them at all without extra JavaScript.

### ARIA — When Native HTML Is Not Enough

ARIA (Accessible Rich Internet Applications) attributes provide extra information to assistive technologies. They are your escape hatch for custom components that do not have a native HTML equivalent.

The first rule of ARIA is: **do not use ARIA if a native HTML element does the job.** A native \`<button>\` is always better than \`<div role="button">\`, because the native element includes keyboard handling, focus management, and screen reader announcements — all for free.

\`\`\`tsx
// # ARIA is needed here because there is no native HTML "switch" element.
// # We must add role, state, keyboard handling, and label manually.
<div
  role="switch"                    // # Tells screen readers this is a toggle switch
  aria-checked={isOn}              // # Current state: on or off
  aria-label="Dark mode"           // # What this switch controls
  tabIndex={0}                     // # Makes it focusable with keyboard
  onClick={() => toggle()}
  onKeyDown={(e) => {
    // # Handle keyboard activation (Enter or Space)
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }}
>
  {isOn ? "On" : "Off"}
</div>

// # But a native checkbox with a label is simpler and more accessible:
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={isOn}
    onChange={() => toggle()}
    className="sr-only"  // # Visually hidden but accessible
  />
  <span className={/* visual toggle styles */}>
    {isOn ? "On" : "Off"}
  </span>
  Dark mode
</label>
\`\`\`

The second example is better because the browser handles focus, keyboard interaction, state management, and screen reader announcements — you just style it.

### Keyboard Navigation — Every Feature Must Work Without a Mouse

Many users navigate entirely with a keyboard: people with motor disabilities, power users who prefer keyboard shortcuts, and screen reader users (screen readers are keyboard-driven). If a feature only works with a mouse, you are excluding these users.

The essential keyboard interactions every web application must support:

- **Tab** — moves focus to the next interactive element
- **Shift+Tab** — moves focus to the previous interactive element
- **Enter** — activates buttons and links
- **Space** — activates buttons, toggles checkboxes
- **Escape** — closes modals, dropdowns, and popups
- **Arrow keys** — navigates within components (tabs, menus, radio groups)

**Focus management for modals:**

When a modal opens, focus must move into the modal. While the modal is open, focus must be trapped inside (Tab should cycle through the modal's interactive elements, not escape to the page behind). When the modal closes, focus must return to the element that opened it.

\`\`\`tsx
function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // # Remember what opened the modal so we can return focus later
      triggerRef.current = document.activeElement as HTMLElement;
      // # Move focus into the modal
      modalRef.current?.focus();

      // # Close on Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    } else {
      // # Return focus to the element that opened the modal
      triggerRef.current?.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // # Overlay — clicking outside closes the modal
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
         onClick={onClose}>
      <div
        role="dialog"           // # Tells screen readers this is a dialog
        aria-modal="true"       // # Screen reader should treat background as inert
        aria-labelledby="modal-title" // # Points to the modal's heading
        ref={modalRef}
        tabIndex={-1}           // # Allows focus but not Tab navigation
        onClick={e => e.stopPropagation()} // # Prevent closing when clicking inside
        className="bg-gray-900 rounded-xl p-6 max-w-lg w-full"
      >
        <h2 id="modal-title">Modal Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
\`\`\`

### Colour and Contrast

Colour contrast is one of the most frequently failed accessibility requirements. Low-contrast text is hard to read for people with low vision (which includes many older adults) and in challenging lighting conditions (bright sunlight on a phone screen).

WCAG requires a minimum contrast ratio of **4.5:1** for normal text and **3:1** for large text (18px+ or 14px+ bold). Use a contrast checker tool (WebAIM, Stark, or browser DevTools) to verify your colour combinations.

Another critical rule: **never use colour as the sole means of conveying information.** 8% of men are colour-blind (red-green colour blindness is most common). If your error messages are red text with no other indicator, colour-blind users cannot distinguish them from normal text.

### Accessibility Testing Checklist

| Category | What to Check |
|----------|--------------|
| Structure | Semantic HTML elements (nav, main, header, footer, article, section) |
| Headings | Proper hierarchy: h1 → h2 → h3. No skipping levels. Only one h1 per page. |
| Images | ALL images have alt text. Decorative images use alt="" (empty). |
| Forms | Every input has a visible \`<label>\` (not just placeholder text — placeholders disappear on focus). |
| Focus | All interactive elements have visible focus indicators. Never use outline: none without a replacement. |
| Keyboard | ALL functionality works with keyboard only. Tab through the entire page. |
| Colour | 4.5:1 contrast ratio for text. Information not conveyed by colour alone. |
| Motion | Respect \`prefers-reduced-motion\` media query. Provide a way to pause animations. |
| Screen reader | Test with VoiceOver (Mac), NVDA (Windows), or TalkBack (Android). |`,
      },
      {
        title: "Accessibility Quiz",
        slug: "accessibility-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Accessibility Quiz

<!--quiz
[
  {
    "question": "You built a custom dropdown with <div> elements. Keyboard-only users can't navigate it. What's the best fix?",
    "options": [
      "Add tabIndex='0' to each option <div>",
      "Replace the custom dropdown with a native <select> element — it has keyboard navigation, screen reader support, and focus management built in",
      "Add an aria-label to the container",
      "Add a tooltip explaining keyboard navigation"
    ],
    "correctIndex": 1,
    "explanation": "The #1 rule of accessibility: use native HTML elements whenever possible. A native <select> provides keyboard navigation (arrow keys, type-ahead search), screen reader announcements ('Combobox, 3 of 5'), focus management, and mobile-optimised UI — all for free, with zero JavaScript. A custom <div> dropdown requires hundreds of lines of ARIA attributes, keyboard handlers, and focus management to achieve what <select> does natively. Only build custom when <select> genuinely can't meet your needs."
  },
  {
    "question": "An image shows a graph of quarterly revenue. What should the alt text be?",
    "options": [
      "alt='graph'",
      "alt='Image of a bar chart'",
      "alt='Quarterly revenue: Q1 £1.2M, Q2 £1.5M, Q3 £1.8M, Q4 £2.1M — 75% YoY growth'",
      "alt='' (empty alt text)"
    ],
    "correctIndex": 2,
    "explanation": "Alt text should convey the INFORMATION the image communicates, not just describe its visual appearance. A screen reader user hearing 'graph' or 'bar chart' gets zero useful information — they still don't know what the data shows. The alt text should include the key numbers, trend, and insight. For complex data visualisations, also consider providing a data table as a visible alternative. Use alt='' only for purely decorative images that add no information."
  },
  {
    "question": "Your site uses green text for success messages and red text for errors, with no other visual distinction. What accessibility problem does this create?",
    "options": [
      "No problem — everyone understands red = bad, green = good",
      "Colour-blind users (8% of men) cannot distinguish red from green — add icons, text labels, or patterns alongside colour",
      "The colours are too bright for sensitive eyes",
      "Screen readers cannot detect colour"
    ],
    "correctIndex": 1,
    "explanation": "Red-green colour blindness (deuteranopia/protanopia) affects approximately 8% of men and 0.5% of women. If colour is the ONLY indicator of success vs. error, these users genuinely cannot tell the difference. WCAG requires: 'Colour is not used as the only visual means of conveying information.' Fix: add a checkmark icon (✓) for success and an X icon (✗) for errors, plus text labels ('Success' / 'Error'). Colour can reinforce the message but must not be the sole signal."
  }
]
-->`,
      },
    ],
  },
];
