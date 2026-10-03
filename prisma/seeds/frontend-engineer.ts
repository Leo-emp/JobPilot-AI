/* ============================================================
   FRONTEND ENGINEER WORKSHOP — Seed Content
   ============================================================
   # React, TypeScript, CSS, performance, accessibility,
   # state management, and frontend testing.
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
        estimatedMinutes: 30,
        order: 1,
        content: `## React Component Patterns

Writing React components that are reusable, maintainable, and performant requires understanding common patterns. These patterns aren't rules — they're tools you reach for when the situation calls for them.

### Pattern 1: Composition Over Configuration

**Bad — one component with tons of props:**
\`\`\`tsx
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
/>
\`\`\`

**Good — composable children:**
\`\`\`tsx
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

**Why:** Composition is more flexible. You can put anything inside Card.Body — text, images, forms, other components. The prop-heavy version can only do what its props allow.

### Pattern 2: Render Props

Pass a function as a prop that returns JSX. Useful when a component needs to share logic but the parent controls the rendering.

\`\`\`tsx
// The component provides data, parent decides how to render it
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
\`\`\`

**When to use:** When you need to share behavior (data fetching, mouse tracking, form state) but different consumers need different UIs. Note: custom hooks have largely replaced this pattern.

### Pattern 3: Custom Hooks for Logic Reuse

Extract component logic into reusable hooks.

\`\`\`tsx
// Custom hook — reusable logic
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch { return initialValue; }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage — any component can use it
function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  return <ThemePicker value={theme} onChange={setTheme} />;
}
\`\`\`

### Pattern 4: Controlled vs Uncontrolled Components

**Controlled** — parent owns the state:
\`\`\`tsx
function Form() {
  const [name, setName] = useState("");
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
\`\`\`

**Uncontrolled** — component owns its own state:
\`\`\`tsx
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => console.log(inputRef.current?.value);
  return <input ref={inputRef} defaultValue="" />;
}
\`\`\`

**Rule:** Use controlled components by default. Use uncontrolled only for simple forms or when integrating with non-React code.

### Pattern 5: Error Boundaries

Catch JavaScript errors in the component tree and show a fallback UI instead of crashing the entire page.

\`\`\`tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Component error:", error, info);
    // Send to error tracking (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <RiskyComponent />
</ErrorBoundary>
\`\`\`

### React Performance Optimization

| Technique | When to Use |
|-----------|-------------|
| React.memo() | Prevent re-renders when props haven't changed |
| useMemo() | Expensive calculations that don't need to run every render |
| useCallback() | Functions passed as props to memoized children |
| Virtualization (react-window) | Rendering 1000+ items in a list |
| Code splitting (lazy/Suspense) | Large components not needed on initial load |
| Key prop optimization | Use stable, unique keys (not array index) |

**Don't optimize prematurely.** Profile first with React DevTools Profiler. Most performance issues are caused by unnecessary re-renders, not slow computations.`,
      },
      {
        title: "React Hooks Deep Dive",
        slug: "react-hooks-deep-dive",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 2,
        content: `## React Hooks Deep Dive

Hooks let you use state and lifecycle features in function components. Understanding them deeply prevents the most common React bugs.

### useState — State Management

\`\`\`tsx
const [count, setCount] = useState(0);

// Direct update
setCount(5);

// Functional update (when new state depends on old state)
setCount(prev => prev + 1); // Always use this for increments!
\`\`\`

**Common mistake — stale state in closures:**
\`\`\`tsx
// BUG — clicking fast only increments by 1
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1); // Captures 'count' at render time
    setCount(count + 1); // Same stale 'count' — adds 1, not 2
  };
}

// FIX — use functional updates
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1); // Always reads latest state
    setCount(prev => prev + 1); // Correctly adds 2
  };
}
\`\`\`

### useEffect — Side Effects

\`\`\`tsx
// Runs on every render (usually wrong)
useEffect(() => { fetchData(); });

// Runs once on mount (empty deps)
useEffect(() => { fetchData(); }, []);

// Runs when userId changes
useEffect(() => { fetchUserData(userId); }, [userId]);

// Cleanup function (runs before re-run and on unmount)
useEffect(() => {
  const interval = setInterval(() => tick(), 1000);
  return () => clearInterval(interval); // Cleanup!
}, []);
\`\`\`

**The dependency array is a contract.** If you use a variable inside the effect, it must be in the dependency array. ESLint's exhaustive-deps rule catches this.

### useRef — Mutable Values That Don't Trigger Re-renders

\`\`\`tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => { inputRef.current?.focus(); }, []);

// Mutable value that persists across renders
const renderCount = useRef(0);
useEffect(() => { renderCount.current++; });
\`\`\`

**Key insight:** Changing a ref does NOT cause a re-render. Use it for values you need to persist but don't want to display.

### useMemo & useCallback

\`\`\`tsx
// useMemo — cache expensive computation
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items] // Only re-sort when items change
);

// useCallback — cache function reference
const handleClick = useCallback(
  (id: string) => { setSelected(id); },
  [] // Function never changes
);
\`\`\`

**Don't use them everywhere.** They add complexity and memory overhead. Only use when:
1. The computation is genuinely expensive (>1ms)
2. The function is passed to a memoized child (React.memo)
3. The value is in another hook's dependency array

### Hook Rules

1. **Only call hooks at the top level** — never inside conditions, loops, or nested functions
2. **Only call hooks in React functions** — components or custom hooks
3. **Custom hooks must start with "use"** — useAuth, useFetch, useLocalStorage

\`\`\`tsx
// BAD — hook inside condition
function Profile({ userId }: { userId?: string }) {
  if (!userId) return null;
  const [user, setUser] = useState(null); // WRONG! Conditional hook
}

// GOOD — hook always runs, condition in JSX
function Profile({ userId }: { userId?: string }) {
  const [user, setUser] = useState(null);
  if (!userId) return null;
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
    "explanation": "This creates an infinite loop: the effect runs → fetchItems updates items via setItems → items changed → effect runs again → repeat forever. The dependency should be [] (run once on mount) or a specific trigger like a search query, not the state that the effect itself updates."
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
    "explanation": "React.memo() prevents re-renders when props haven't changed. But it's not free — React must compare all props on every render (shallow comparison). It's only worth it when: (1) the component is expensive to render, AND (2) it often receives the same props while its parent re-renders. For simple components, the comparison overhead may exceed the render cost."
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
    "explanation": "React identifies hooks by their call ORDER (1st hook, 2nd hook, etc.), not by name. If a hook is inside an if-statement, it might be the 3rd hook on one render and the 2nd on another — React would match hook states to the wrong hooks, causing bizarre bugs. This is why the 'Rules of Hooks' ESLint plugin exists."
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
    "explanation": "The bug is stale closures: setCount(count + 1) captures 'count' at render time. All 3 clicks use the same stale value (e.g., 0), so they all set it to 1. The functional form setCount(prev => prev + 1) always reads the latest state, so each click correctly increments from the current value."
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
        estimatedMinutes: 25,
        order: 1,
        content: `## TypeScript Patterns for React

TypeScript catches bugs at compile time that would otherwise crash in production. These patterns make your React code bulletproof.

### Typing Component Props

\`\`\`tsx
// Basic props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger"; // Union type
  disabled?: boolean;
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled} className={variant}>{label}</button>;
}
\`\`\`

### Discriminated Unions (Tagged Unions)

The most powerful TypeScript pattern for handling multiple states.

\`\`\`tsx
// API state — exactly one of these at any time
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function UserProfile() {
  const [state, setState] = useState<ApiState<User>>({ status: "idle" });

  // TypeScript narrows the type inside each branch
  switch (state.status) {
    case "idle":
      return <p>Click to load</p>;
    case "loading":
      return <Spinner />;
    case "success":
      return <p>{state.data.name}</p>; // TypeScript knows 'data' exists here
    case "error":
      return <p>{state.error}</p>; // TypeScript knows 'error' exists here
  }
}
\`\`\`

### Generic Components

\`\`\`tsx
// A reusable list component that works with any item type
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage — TypeScript infers T from the items
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>} // user is typed as User
  keyExtractor={(user) => user.id}
/>
\`\`\`

### Utility Types You'll Use Daily

\`\`\`tsx
// Partial<T> — make all properties optional
type UserUpdate = Partial<User>;

// Required<T> — make all properties required
type CompleteUser = Required<User>;

// Pick<T, K> — select specific properties
type UserPreview = Pick<User, "id" | "name" | "avatar">;

// Omit<T, K> — remove specific properties
type UserWithoutPassword = Omit<User, "password">;

// Record<K, V> — create an object type with specific keys
type UserMap = Record<string, User>;

// Extract / Exclude — filter union types
type Status = "active" | "inactive" | "banned";
type ActiveStatus = Extract<Status, "active" | "inactive">; // "active" | "inactive"
\`\`\`

### Typing API Responses

\`\`\`tsx
// Define your API response types
interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
  };
}

interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// Type-safe fetch wrapper
async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error: ApiError = await res.json();
    throw new Error(error.error.message);
  }
  return res.json() as Promise<T>;
}

// Usage
const { data } = await apiFetch<ApiResponse<User[]>>("/api/users");
// data is typed as User[]
\`\`\`

### The 'as const' Trick

\`\`\`tsx
// Without 'as const' — type is string[]
const ROLES = ["admin", "editor", "viewer"];

// With 'as const' — type is readonly ["admin", "editor", "viewer"]
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"
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
    "explanation": "A union of string literals gives the best developer experience: autocomplete shows exactly the valid options, typos are caught at compile time ('primry' would error), and no enum import is needed. Enums work but add runtime code and require imports. A plain 'string' type provides no safety — you could pass 'banana' and TypeScript wouldn't complain. 'any' defeats the purpose of TypeScript entirely."
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
    "explanation": "A discriminated union models the 'either/or' relationship. With optional props, nothing prevents passing both href AND onClick (or neither). A discriminated union with a 'variant' field makes the type system enforce the constraint: if variant is 'link', only href is available; if 'button', only onClick. TypeScript narrows the type automatically when you check the variant."
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
    "explanation": "'as const' tells TypeScript to infer the narrowest possible type. Without it, ['admin', 'editor'] is string[] — you lose the specific values. With it, TypeScript knows the EXACT values, so typeof ROLES[number] produces 'admin' | 'editor' | 'viewer'. This lets you define your values once and derive the type from them — no duplication. Note: it makes the array readonly at the TYPE level, not runtime."
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
        estimatedMinutes: 30,
        order: 1,
        content: `## Flexbox & Grid — The Complete Guide

Every modern layout uses Flexbox, Grid, or both. Understanding when to use each is the key to clean, responsive layouts.

### Flexbox — One-Dimensional Layouts

Flexbox works in a single direction: row (horizontal) or column (vertical).

**When to use Flexbox:**
- Navigation bars (items in a row)
- Centering content (vertically and horizontally)
- Distributing space between items
- Items that should wrap to the next line

**The Container (Parent):**
\`\`\`css
.container {
  display: flex;
  flex-direction: row;       /* row | column | row-reverse | column-reverse */
  justify-content: center;   /* Main axis: flex-start | center | flex-end | space-between | space-around | space-evenly */
  align-items: center;       /* Cross axis: flex-start | center | flex-end | stretch | baseline */
  gap: 16px;                 /* Space between items */
  flex-wrap: wrap;           /* Allow items to wrap to next line */
}
\`\`\`

**The Items (Children):**
\`\`\`css
.item {
  flex-grow: 1;    /* How much extra space this item should take (0 = don't grow) */
  flex-shrink: 0;  /* Whether item can shrink below its natural size (0 = don't shrink) */
  flex-basis: 200px; /* Starting size before growing/shrinking */

  /* Shorthand: flex: grow shrink basis */
  flex: 1 0 200px;
}
\`\`\`

**Common Flexbox Recipes:**

\`\`\`css
/* Center anything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Space between (logo left, nav right) */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Equal-width columns */
.columns {
  display: flex;
  gap: 16px;
}
.columns > * {
  flex: 1; /* Each child takes equal space */
}
\`\`\`

### Grid — Two-Dimensional Layouts

Grid works in both rows AND columns simultaneously.

**When to use Grid:**
- Page layouts (header, sidebar, main, footer)
- Card grids (products, gallery)
- Complex layouts that need rows AND columns aligned
- Layouts where items need to span multiple rows/columns

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-rows: auto 1fr auto;     /* header, main, footer */
  gap: 16px;
}

/* Responsive grid that auto-adjusts column count */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

### Flexbox vs Grid Decision

| Layout | Use |
|--------|-----|
| Items in a single row/column | Flexbox |
| Navigation bar | Flexbox |
| Centering a single element | Flexbox |
| Card grid (equal sizes) | Grid |
| Full page layout | Grid |
| Items spanning multiple rows+columns | Grid |
| Content-driven sizing | Flexbox |
| Layout-driven sizing | Grid |

### Responsive Design

\`\`\`css
/* Mobile-first approach */
.container {
  padding: 16px;
  display: flex;
  flex-direction: column; /* Stack on mobile */
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    padding: 24px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
  }
}
\`\`\`

**Responsive units:**
| Unit | Description | Use Case |
|------|------------|----------|
| rem | Relative to root font size | Font sizes, spacing |
| em | Relative to parent font size | Component-level spacing |
| vw/vh | Viewport width/height | Full-screen sections |
| % | Percentage of parent | Fluid widths |
| clamp() | min, preferred, max | Fluid typography |

\`\`\`css
/* Fluid typography — scales between 16px and 24px */
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
        estimatedMinutes: 25,
        order: 2,
        content: `## Tailwind CSS Mastery

Tailwind CSS is a utility-first CSS framework that lets you build designs directly in your markup. Instead of writing custom CSS, you compose utility classes.

### Essential Utility Patterns

**Spacing (padding/margin):**
\`\`\`html
<!-- p-{size}: padding, m-{size}: margin -->
<div class="p-4 mx-auto my-8 px-6 py-3">
  <!-- p-4 = 1rem padding all sides -->
  <!-- mx-auto = horizontal auto margin (centering) -->
</div>
\`\`\`

**Flexbox & Grid:**
\`\`\`html
<!-- Flex row with gap -->
<div class="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
\`\`\`

**Responsive breakpoints (mobile-first):**
\`\`\`html
<div class="flex flex-col md:flex-row">
  <!-- Stacked on mobile, side-by-side on tablet+ -->
</div>
\`\`\`

| Breakpoint | Min-width | Common use |
|-----------|-----------|------------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |

**States:**
\`\`\`html
<button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 active:bg-blue-800 disabled:opacity-50 transition-colors">
  Click me
</button>
\`\`\`

### Common Component Patterns

**Glass card:**
\`\`\`html
<div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
  Glass morphism card
</div>
\`\`\`

### Best Practices

1. **Extract components, not CSS** — repeat a pattern? Make a React component
2. **Use design tokens** — configure in tailwind.config.ts
3. **Mobile-first** — base styles for mobile, breakpoints for larger
4. **Avoid arbitrary values** — use the design system not p-[17px]`,
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
    "question": "You need a responsive card grid that auto-adjusts column count. Best approach?",
    "options": [
      "Flexbox with flex-wrap and fixed widths",
      "CSS Grid with repeat(auto-fill, minmax(280px, 1fr))",
      "Media queries for each breakpoint",
      "JavaScript window resize listener"
    ],
    "correctIndex": 1,
    "explanation": "CSS Grid with repeat(auto-fill, minmax(280px, 1fr)) creates as many columns as fit (min 280px each) and distributes remaining space equally. No media queries, no JS — the browser handles it automatically."
  },
  {
    "question": "What's the difference between justify-content and align-items in Flexbox?",
    "options": [
      "They do the same thing",
      "justify-content = MAIN axis; align-items = CROSS axis",
      "justify-content is horizontal; align-items is vertical (always)",
      "justify-content centers text; align-items centers elements"
    ],
    "correctIndex": 1,
    "explanation": "justify-content controls the MAIN axis (the direction items flow). align-items controls the CROSS axis (perpendicular). In flex-direction: row, main=horizontal and cross=vertical. In column, it's reversed."
  },
  {
    "question": "In Tailwind, what does md:flex-row mean?",
    "options": [
      "Always use flex-row on medium elements",
      "Apply flex-row at 768px and above (mobile-first)",
      "Use flex-row only on medium screens",
      "Deprecated class"
    ],
    "correctIndex": 1,
    "explanation": "Tailwind is mobile-first: md: applies FROM 768px and UP. Below 768px, the unprefixed class (e.g., flex-col) applies. This equals @media (min-width: 768px) { flex-direction: row; }."
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
        estimatedMinutes: 25,
        order: 1,
        content: `## Core Web Vitals & Performance

Google uses Core Web Vitals as ranking signals. Your page's performance directly affects SEO, user experience, and conversion rates.

### The Three Core Web Vitals

**LCP (Largest Contentful Paint) — Loading**
- Measures when the largest visible element finishes loading
- Target: < 2.5 seconds
- Fix: optimize images, preload critical resources, use SSR/SSG

**INP (Interaction to Next Paint) — Interactivity**
- Measures responsiveness to user interactions (clicks, taps, key presses)
- Target: < 200ms
- Fix: break up long tasks, use web workers, defer non-critical JavaScript

**CLS (Cumulative Layout Shift) — Visual Stability**
- Measures unexpected layout shifts (content jumping around)
- Target: < 0.1
- Fix: set explicit dimensions on images/videos, reserve space for dynamic content

### Bundle Optimization

**Code splitting — only load what's needed:**
\`\`\`tsx
// Before — entire admin panel loads for every user
import AdminPanel from "./AdminPanel";

// After — admin panel loads only when needed
const AdminPanel = React.lazy(() => import("./AdminPanel"));

<Suspense fallback={<Loading />}>
  {isAdmin && <AdminPanel />}
</Suspense>
\`\`\`

**Tree shaking — import only what you use:**
\`\`\`tsx
// Bad — imports entire library (200KB)
import _ from "lodash";
_.debounce(fn, 300);

// Good — imports only debounce (4KB)
import debounce from "lodash/debounce";
debounce(fn, 300);
\`\`\`

### Image Optimization

| Format | Best For | Notes |
|--------|---------|-------|
| WebP | Photos, general use | 30% smaller than JPEG |
| AVIF | Photos (modern browsers) | 50% smaller than JPEG |
| SVG | Icons, logos, illustrations | Infinitely scalable, tiny size |
| PNG | Screenshots, transparency | Lossless, larger file size |

\`\`\`tsx
// Next.js Image component — automatic optimization
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={630}
  priority // Preload above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
\`\`\`

### Performance Checklist

| Category | Optimization |
|----------|-------------|
| Images | Use WebP/AVIF, lazy load below-the-fold, set width/height |
| JavaScript | Code split routes, tree shake imports, defer non-critical scripts |
| CSS | Inline critical CSS, lazy load rest, remove unused CSS |
| Fonts | Use font-display: swap, preload critical fonts, self-host |
| Network | Enable gzip/brotli, use CDN, cache static assets |
| Rendering | Use SSR/SSG for content pages, avoid layout shifts |`,
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
    "question": "Your page has a CLS (Cumulative Layout Shift) score of 0.35. The 'good' threshold is 0.1. What's the most likely cause?",
    "options": [
      "Too much JavaScript on the page",
      "Images or ads loading without reserved dimensions, causing content to jump around as they appear",
      "Slow server response time",
      "The page has too many fonts"
    ],
    "correctIndex": 1,
    "explanation": "CLS measures visual stability — how much content shifts as the page loads. The #1 cause is images without explicit width/height attributes: the browser doesn't know how big they'll be until loaded, so content below jumps down. Fix: always set width and height on images (or use CSS aspect-ratio). Also common: ads injected into the page, dynamically loaded content pushing things down, and web fonts causing text reflow."
  },
  {
    "question": "Your LCP (Largest Contentful Paint) is 5 seconds. The 'good' threshold is 2.5s. The largest element is a hero image. What's the highest-impact fix?",
    "options": [
      "Compress the image to WebP and add loading='eager' with a preload link tag",
      "Add lazy loading to all images",
      "Minify the JavaScript bundle",
      "Move to a faster hosting provider"
    ],
    "correctIndex": 0,
    "explanation": "LCP measures when the largest visible element renders. If it's a hero image: (1) compress to WebP/AVIF (often 50-70% smaller), (2) add a preload hint so the browser starts downloading it immediately, (3) use loading='eager' (not lazy — it's above the fold). Lazy loading the hero image would make LCP WORSE. JS minification helps FID/INP but not LCP directly."
  },
  {
    "question": "You import a charting library (200KB) that's only used on one page. Every page loads it. What's the fix?",
    "options": [
      "Use a smaller charting library",
      "Dynamic import with React.lazy() — load the chart component only when that page is visited",
      "Move the chart to an iframe",
      "Minify the library more aggressively"
    ],
    "correctIndex": 1,
    "explanation": "Code splitting with dynamic imports (React.lazy + Suspense) loads the charting library ONLY when the user visits the page that needs it. Every other page gets a smaller bundle and faster load. This is one of the highest-impact performance optimizations: identify large dependencies used on few pages and dynamic-import them. Next.js does this automatically for route-based splitting."
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
        estimatedMinutes: 25,
        order: 1,
        content: `## Accessibility (a11y) — Building for Everyone

1 in 4 adults has a disability. Accessibility isn't optional — it's a legal requirement in many countries and simply good engineering.

### Semantic HTML — The Foundation

Using the right HTML elements is 80% of accessibility. Screen readers understand semantic HTML natively.

\`\`\`html
<!-- Bad — div soup (screen reader sees nothing meaningful) -->
<div class="nav">
  <div class="nav-item" onclick="navigate()">Home</div>
</div>
<div class="main">
  <div class="heading">Welcome</div>
  <div class="text">Click <div class="link" onclick="go()">here</div></div>
</div>

<!-- Good — semantic HTML (screen reader understands the structure) -->
<nav>
  <a href="/">Home</a>
</nav>
<main>
  <h1>Welcome</h1>
  <p>Visit our <a href="/about">about page</a></p>
</main>
\`\`\`

### ARIA — When HTML Isn't Enough

ARIA (Accessible Rich Internet Applications) attributes provide extra information for screen readers. Use them only when native HTML can't convey the meaning.

\`\`\`tsx
// Custom toggle — needs ARIA because it's a <div>, not a <checkbox>
<div
  role="switch"
  aria-checked={isOn}
  aria-label="Dark mode"
  tabIndex={0}
  onClick={() => toggle()}
  onKeyDown={(e) => e.key === "Enter" && toggle()}
>
  {isOn ? "On" : "Off"}
</div>

// Better — just use a real checkbox
<label>
  <input type="checkbox" checked={isOn} onChange={() => toggle()} />
  Dark mode
</label>
\`\`\`

**Rule:** If you can use a native HTML element, use it. ARIA is a last resort.

### Keyboard Navigation

All interactive elements must be usable with keyboard only:
- **Tab** — move to next focusable element
- **Shift+Tab** — move to previous
- **Enter/Space** — activate buttons, links
- **Escape** — close modals, dropdowns
- **Arrow keys** — navigate within components (tabs, menus)

\`\`\`tsx
// Focus trap for modals
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current?.focus();

      // Close on Escape
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
\`\`\`

### Color & Contrast

- **Minimum contrast ratio:** 4.5:1 for normal text, 3:1 for large text
- **Don't rely on color alone** — use icons, patterns, or text labels too
- **Test with colorblindness simulators** — 8% of men are colorblind

### Accessibility Checklist

| Category | Requirement |
|----------|------------|
| Structure | Use semantic HTML (nav, main, header, footer, article, section) |
| Headings | Proper heading hierarchy (h1 → h2 → h3, no skipping) |
| Images | All images have alt text (decorative images: alt="") |
| Forms | Every input has a visible label (not just placeholder) |
| Focus | Visible focus indicators on all interactive elements |
| Keyboard | All functionality accessible via keyboard |
| Color | 4.5:1 contrast ratio, don't rely on color alone |
| Motion | Respect prefers-reduced-motion media query |`,
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
    "question": "You have a custom dropdown built with <div> elements. A keyboard-only user can't navigate it. What's the best fix?",
    "options": [
      "Add tabIndex='0' to each option div",
      "Replace the custom dropdown with a native <select> element — it has keyboard navigation, screen reader support, and focus management built in",
      "Add an aria-label to the container",
      "Add a tooltip explaining how to use the keyboard"
    ],
    "correctIndex": 1,
    "explanation": "The #1 rule of accessibility: use native HTML elements when possible. A native <select> gives you keyboard navigation (arrow keys, type-ahead), screen reader announcements, focus management, and mobile device support — all for free. Custom dropdowns require hundreds of lines of ARIA and keyboard handling code to match what <select> does natively. Only build custom when <select> truly can't meet your design needs."
  },
  {
    "question": "An image shows a graph of quarterly revenue. What should the alt text be?",
    "options": [
      "alt='graph'",
      "alt='Image of a bar chart'",
      "alt='Quarterly revenue: Q1 £1.2M, Q2 £1.5M, Q3 £1.8M, Q4 £2.1M — 75% year-over-year growth'",
      "alt='' (empty alt text)"
    ],
    "correctIndex": 2,
    "explanation": "Alt text should convey the INFORMATION the image provides, not just describe what it looks like. A screen reader user hearing 'graph' or 'bar chart' gets no useful information. The alt text should include the key data and insight the graph communicates. For complex data, consider adding a data table as a visible alternative. Use alt='' only for purely decorative images that add no information."
  },
  {
    "question": "Your site uses green text for success and red text for errors, with no other distinction. What accessibility problem does this create?",
    "options": [
      "No problem — everyone understands red=bad, green=good",
      "It fails for colorblind users (8% of men) who can't distinguish red from green — add icons, labels, or patterns alongside color",
      "The colors are too bright",
      "Screen readers can't see colors"
    ],
    "correctIndex": 1,
    "explanation": "Red-green colorblindness (deuteranopia/protanopia) affects about 8% of men. If color is the ONLY indicator, these users can't tell success from error. WCAG requires: 'Color is not used as the only visual means of conveying information.' Fix: add a checkmark icon for success, an X icon for errors, plus text labels. Color can reinforce the message, but shouldn't be the sole signal."
  }
]
-->`,
      },
    ],
  },
];
