/* ============================================================
   SOFTWARE ENGINEER WORKSHOP — Seed Content
   ============================================================
   # Exports the full module/section data for the SE workshop.
   # Imported by the main seed-workshops.ts script.
   ============================================================ */

export const softwareEngineerModules = [
  /* ============================================================
     MODULE 1: Technical Foundations
     ============================================================ */
  {
    name: "Technical Foundations",
    slug: "technical-foundations",
    description: "Data structures, algorithms, and Big O — the core building blocks every software engineer needs to master.",
    order: 1,
    sections: [
      {
        title: "Data Structures Overview",
        slug: "data-structures-overview",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## Data Structures — The Building Blocks

Every piece of software you've ever used stores and organizes data using data structures. Choosing the right data structure is the difference between code that runs in milliseconds and code that takes minutes.

Think of data structures like containers in a kitchen. You wouldn't store soup in a colander or pasta in a cup. Each container has a purpose, and using the wrong one makes everything harder.

### Arrays

**What it is:** A contiguous block of memory storing elements of the same type, accessed by index.

**Kitchen analogy:** A spice rack with numbered slots. You can instantly grab spice #5, but inserting a new spice in the middle means shifting everything over.

**Operations & Complexity:**

| Operation | Time | Why |
|-----------|------|-----|
| Access by index | O(1) | Jump directly to memory location |
| Search (unsorted) | O(n) | Must check each element |
| Insert at end | O(1) | Just add to the next slot |
| Insert at beginning | O(n) | Must shift all elements right |
| Delete at beginning | O(n) | Must shift all elements left |

**When to use:**
- You need fast access by position (index)
- Data size is known or changes infrequently
- You need to iterate through all elements

**When NOT to use:**
- Frequent insertions/deletions at the beginning or middle
- Unknown or highly variable size
- You need fast search by value (use a hash map instead)

### Linked Lists

**What it is:** A chain of nodes where each node contains data and a pointer to the next node.

**Kitchen analogy:** A treasure hunt where each clue tells you where the next clue is. You can't jump to clue #5 — you must follow the chain from the start.

**Operations & Complexity:**

| Operation | Time | Why |
|-----------|------|-----|
| Access by index | O(n) | Must traverse from head |
| Search | O(n) | Must traverse from head |
| Insert at beginning | O(1) | Just update the head pointer |
| Insert at end (with tail) | O(1) | Update tail pointer |
| Delete (given node) | O(1) | Update pointers |

**When to use:**
- Frequent insertions/deletions at the beginning
- Implementing stacks, queues, or LRU caches
- When you don't need random access

### Stacks (LIFO — Last In, First Out)

**What it is:** A collection where you can only add/remove from the top. Like a stack of plates.

**Key operations:** push (add to top), pop (remove from top), peek (look at top)

**Real-world uses:**
- Browser back button (stack of visited pages)
- Undo functionality (stack of actions)
- Function call stack (how your code executes)
- Matching parentheses in code editors

### Queues (FIFO — First In, First Out)

**What it is:** A collection where you add to the back and remove from the front. Like a line at a shop.

**Key operations:** enqueue (add to back), dequeue (remove from front)

**Real-world uses:**
- Print queue (documents print in order)
- Task scheduling (process jobs in order)
- BFS traversal (explore level by level)
- Message queues (Kafka, RabbitMQ)

### Hash Maps (Dictionaries)

**What it is:** A key-value store that uses a hash function to map keys to array indices for O(1) average lookup.

**Kitchen analogy:** A filing cabinet with labeled folders. You don't search through every folder — you go directly to the label you need.

**Operations & Complexity:**

| Operation | Average | Worst |
|-----------|---------|-------|
| Get by key | O(1) | O(n) |
| Set key-value | O(1) | O(n) |
| Delete by key | O(1) | O(n) |
| Check key exists | O(1) | O(n) |

**When to use:**
- You need fast lookup by key (user IDs, config settings)
- Counting occurrences (word frequency, vote tallying)
- Caching (memoization, LRU cache)
- Deduplication (have I seen this before?)

**When NOT to use:**
- You need ordered data (use a tree instead)
- Memory is extremely constrained (hash maps use extra memory)

### Trees

**What it is:** A hierarchical data structure with a root node and child nodes forming branches.

**Types:**
- **Binary Tree** — each node has at most 2 children
- **Binary Search Tree (BST)** — left child < parent < right child
- **Balanced BST (AVL, Red-Black)** — self-balancing for guaranteed O(log n)
- **Heap** — parent is always greater/smaller than children (used for priority queues)
- **Trie** — tree for storing strings character by character (autocomplete, spell check)

**BST Operations & Complexity:**

| Operation | Average | Worst (unbalanced) |
|-----------|---------|-------------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

**Real-world uses:**
- File systems (directory tree)
- Database indexes (B-trees)
- Autocomplete (tries)
- Priority scheduling (heaps)
- HTML/DOM (tree of elements)

### Graphs

**What it is:** A collection of nodes (vertices) connected by edges. Unlike trees, graphs can have cycles and don't require a root.

**Types:**
- **Directed** — edges have direction (Twitter follows: A follows B doesn't mean B follows A)
- **Undirected** — edges go both ways (Facebook friends: if A is friends with B, B is friends with A)
- **Weighted** — edges have values (distance, cost, time)

**Real-world uses:**
- Social networks (friend connections)
- Maps/navigation (routes between locations)
- Dependency resolution (package managers)
- Recommendation systems (item similarity)

### Data Structure Decision Guide

| Need | Use |
|------|-----|
| Fast access by position | Array |
| Fast insert/delete at ends | Linked List or Deque |
| LIFO (undo, back button) | Stack |
| FIFO (task queue, BFS) | Queue |
| Fast lookup by key | Hash Map |
| Ordered data with fast search | BST / Balanced BST |
| Priority ordering | Heap |
| String prefix matching | Trie |
| Relationships between entities | Graph |

### Big O Cheat Sheet

From fastest to slowest:

| Complexity | Name | Example |
|-----------|------|---------|
| O(1) | Constant | Array access, hash map lookup |
| O(log n) | Logarithmic | Binary search, balanced BST |
| O(n) | Linear | Linear search, single loop |
| O(n log n) | Linearithmic | Merge sort, heap sort |
| O(n²) | Quadratic | Nested loops, bubble sort |
| O(2ⁿ) | Exponential | Recursive subsets, brute force |
| O(n!) | Factorial | Permutations, travelling salesman |`,
      },
      {
        title: "Algorithms — Pattern Recognition Guide",
        slug: "algorithms-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## Algorithm Patterns — Recognizing What to Use

The key to solving algorithm problems isn't memorizing solutions — it's recognizing patterns. When you see a problem, you should think "this looks like a sliding window problem" or "this needs BFS," not "let me recall the exact code."

### Pattern 1: Two Pointers

**When to use:** Sorted arrays, finding pairs, palindromes, removing duplicates.

**How it works:** Use two pointers (usually start/end or slow/fast) to traverse the data structure, reducing the search space.

**Recognition clues:**
- "Find a pair that sums to X" in a sorted array
- "Is this a palindrome?"
- "Remove duplicates from sorted array"
- "Container with most water"

**Template:**

\`\`\`typescript
function twoPointers(arr: number[], target: number): [number, number] | null {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
\`\`\`

### Pattern 2: Sliding Window

**When to use:** Contiguous subarrays/substrings, maximum/minimum in a window, fixed or variable size windows.

**How it works:** Maintain a "window" of elements that slides through the array, expanding or contracting as needed.

**Recognition clues:**
- "Maximum sum subarray of size K"
- "Longest substring without repeating characters"
- "Smallest subarray with sum ≥ target"
- Any problem mentioning "contiguous" + "maximum/minimum"

**Template (variable window):**

\`\`\`typescript
function slidingWindow(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
\`\`\`

### Pattern 3: Binary Search

**When to use:** Sorted data, finding boundaries, optimization problems with monotonic conditions.

**How it works:** Repeatedly halve the search space by comparing the middle element.

**Recognition clues:**
- "Find X in a sorted array"
- "Find the first/last occurrence"
- "Find the minimum/maximum that satisfies a condition"
- "Search in rotated sorted array"

### Pattern 4: BFS (Breadth-First Search)

**When to use:** Shortest path in unweighted graphs, level-order traversal, finding nearest nodes.

**How it works:** Explore all neighbors at the current depth before moving deeper. Uses a queue.

**Recognition clues:**
- "Shortest path" (unweighted)
- "Level order traversal"
- "Nearest" or "minimum steps"
- Grid problems with shortest distance

### Pattern 5: DFS (Depth-First Search)

**When to use:** Exploring all paths, detecting cycles, topological sorting, tree traversals.

**How it works:** Go as deep as possible before backtracking. Uses recursion or a stack.

**Recognition clues:**
- "Find all paths"
- "Detect cycle"
- "Connected components"
- "Island problems" on grids

### Pattern 6: Dynamic Programming

**When to use:** Overlapping subproblems, optimal substructure, counting problems, optimization.

**How it works:** Break the problem into smaller subproblems, solve each once, store results.

**Recognition clues:**
- "Find the maximum/minimum"
- "Count the number of ways"
- "Is it possible to...?"
- "Longest/shortest subsequence"
- Problem has overlapping subproblems (same subproblem solved multiple times)

**Approach:**
1. Define the state (what changes between subproblems?)
2. Write the recurrence relation (how does the current state relate to previous states?)
3. Define base cases
4. Decide direction: top-down (memoization) or bottom-up (tabulation)

### Pattern 7: Greedy

**When to use:** Local optimal choices lead to global optimal, interval scheduling, activity selection.

**How it works:** At each step, make the locally optimal choice without reconsidering.

**Recognition clues:**
- "Maximum number of non-overlapping intervals"
- "Minimum number of coins"
- "Activity/job scheduling"
- Problem where choosing the best option now doesn't affect future options

**Warning:** Greedy doesn't always work. You must prove that local optimal → global optimal. If unsure, use DP.

### Pattern 8: Backtracking

**When to use:** Generate all combinations/permutations, constraint satisfaction, puzzle solving.

**How it works:** Try all possibilities, backtrack when a choice leads to a dead end.

**Recognition clues:**
- "Generate all combinations"
- "Find all permutations"
- "Solve this puzzle" (Sudoku, N-Queens)
- "All possible" anything

### Pattern Selection Flowchart

1. Is the input sorted or can you sort it?
   - Yes → **Two Pointers** or **Binary Search**
2. Does the problem involve contiguous elements?
   - Yes → **Sliding Window**
3. Is it a tree or graph problem?
   - Shortest path? → **BFS**
   - All paths / cycle detection? → **DFS**
4. Does it have overlapping subproblems?
   - Yes → **Dynamic Programming**
5. Can local optimal choices give global optimal?
   - Yes → **Greedy**
6. Need to generate all possibilities?
   - Yes → **Backtracking**`,
      },
      {
        title: "Data Structures Quiz",
        slug: "data-structures-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Data Structures Quiz

Test your understanding of when to use each data structure.

<!--quiz
[
  {
    "question": "You need to implement a browser's back button. Which data structure is most appropriate?",
    "options": [
      "Array",
      "Queue",
      "Stack",
      "Hash Map"
    ],
    "correctIndex": 2,
    "explanation": "A stack (LIFO) is perfect for back/forward navigation. When you visit a new page, push it onto the stack. When you press back, pop the top page. The last page you visited is the first one you return to — exactly LIFO behavior."
  },
  {
    "question": "You need to check if a username already exists in a system with 10 million users. Which data structure gives the fastest lookup?",
    "options": [
      "Sorted Array with Binary Search — O(log n)",
      "Linked List — O(n)",
      "Hash Map/Set — O(1) average",
      "Binary Search Tree — O(log n)"
    ],
    "correctIndex": 2,
    "explanation": "A Hash Map (or Hash Set) provides O(1) average-case lookup, which is faster than the O(log n) of binary search or BST. At 10 million users, O(1) vs O(log n) means ~1 operation vs ~23 operations per lookup. Hash maps are the standard choice for existence checking."
  },
  {
    "question": "You need to process customer support tickets in the order they were received. Which data structure should you use?",
    "options": [
      "Stack — process newest first",
      "Queue — process oldest first (FIFO)",
      "Array — randomly access any ticket",
      "Priority Queue — process by priority"
    ],
    "correctIndex": 1,
    "explanation": "A queue (FIFO — First In, First Out) processes items in the order they arrive, which is exactly what 'in the order they were received' means. A stack would process the newest first, which isn't fair. A priority queue would be appropriate if tickets had different priority levels, but the question says 'in order received.'"
  },
  {
    "question": "You're building an autocomplete feature that suggests words as the user types. Which data structure is most efficient?",
    "options": [
      "Hash Map of all words",
      "Sorted Array with binary search",
      "Trie (prefix tree)",
      "Linked List of words"
    ],
    "correctIndex": 2,
    "explanation": "A Trie is specifically designed for prefix-based lookups. When the user types 'pro', the Trie traverses p→r→o and returns all words below that node (program, product, process, etc.) in O(m) time where m is the prefix length. A hash map can't efficiently find all words starting with a prefix — you'd need to check every key."
  },
  {
    "question": "What is the time complexity of inserting an element at the beginning of a regular array (not a linked list)?",
    "options": [
      "O(1) — just put it at index 0",
      "O(log n) — uses binary search to find position",
      "O(n) — must shift all existing elements right",
      "O(n²) — must shift and sort"
    ],
    "correctIndex": 2,
    "explanation": "Inserting at the beginning of an array requires shifting every existing element one position to the right to make room at index 0. If the array has n elements, that's n shift operations → O(n). This is why linked lists (O(1) insert at head) are preferred when frequent insertions at the beginning are needed."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 2: Coding Exercises
     ============================================================ */
  {
    name: "Coding Exercises",
    slug: "coding-exercises",
    description: "50 LeetCode-quality coding problems — 20 Easy, 20 Medium, 10 Hard — with hints, brute force, and optimal solutions.",
    order: 2,
    sections: [
      {
        title: "Easy — Two Sum",
        slug: "easy-two-sum",
        type: "exercise" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 1,
        content: `## Two Sum

### Problem

Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume that each input has exactly one solution, and you may not use the same element twice.

### Constraints

- 2 ≤ nums.length ≤ 10,000
- -1,000,000,000 ≤ nums[i] ≤ 1,000,000,000
- -1,000,000,000 ≤ target ≤ 1,000,000,000
- Only one valid answer exists

### Examples

**Example 1:**
- Input: nums = [2, 7, 11, 15], target = 9
- Output: [0, 1]
- Explanation: nums[0] + nums[1] = 2 + 7 = 9

**Example 2:**
- Input: nums = [3, 2, 4], target = 6
- Output: [1, 2]
- Explanation: nums[1] + nums[2] = 2 + 4 = 6

**Example 3:**
- Input: nums = [3, 3], target = 6
- Output: [0, 1]

### Hints

<details>
<summary>Hint 1</summary>
Think about what you need for each number. If the target is 9 and the current number is 2, what are you looking for?
</details>

<details>
<summary>Hint 2</summary>
For each number, you need to find its complement (target - current number). What data structure gives O(1) lookup?
</details>

<details>
<summary>Hint 3</summary>
Use a hash map to store numbers you've seen so far. Key = number, Value = index. For each new number, check if (target - number) exists in the map.
</details>

### Solution: Brute Force

**Approach:** Check every pair of numbers.

**Complexity:** Time O(n²), Space O(1)

\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  // Check every pair
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return []; // Should never reach here per constraints
}
\`\`\`

### Solution: Optimal (Hash Map)

**Approach:** Use a hash map to store seen numbers. For each number, check if its complement exists.

**Complexity:** Time O(n), Space O(n)

\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  // Map: number → index
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Check if complement was seen before
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }

    // Store current number and its index
    seen.set(nums[i], i);
  }
  return [];
}
\`\`\`

### Why Interviewers Ask This

Two Sum tests your ability to:
1. Recognize the hash map optimization pattern (trading space for time)
2. Think about complement-based problems
3. Handle edge cases (duplicate values like [3,3])

### Similar Problems

- Three Sum (Medium)
- Two Sum II — Input Array Is Sorted (use two pointers)
- Subarray Sum Equals K`,
      },
      {
        title: "Easy — Valid Parentheses",
        slug: "easy-valid-parentheses",
        type: "exercise" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 2,
        content: `## Valid Parentheses

### Problem

Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, and \`]\`, determine if the input string is valid.

A string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Constraints

- 1 ≤ s.length ≤ 10,000
- s consists of parentheses only: \`()[]{}\`

### Examples

**Example 1:**
- Input: s = "()"
- Output: true

**Example 2:**
- Input: s = "()[]{}"
- Output: true

**Example 3:**
- Input: s = "(]"
- Output: false

**Example 4:**
- Input: s = "([)]"
- Output: false (brackets overlap incorrectly)

**Example 5:**
- Input: s = "{[]}"
- Output: true (properly nested)

### Hints

<details>
<summary>Hint 1</summary>
Think about what happens when you encounter a closing bracket — what should be the most recently opened bracket?
</details>

<details>
<summary>Hint 2</summary>
The "most recently opened" requirement suggests LIFO ordering. Which data structure implements LIFO?
</details>

<details>
<summary>Hint 3</summary>
Use a stack. Push opening brackets, pop when you see a closing bracket, and check if it matches. At the end, the stack should be empty.
</details>

### Solution: Stack

**Approach:** Use a stack to track opening brackets. When a closing bracket appears, the top of the stack must match.

**Complexity:** Time O(n), Space O(n)

\`\`\`typescript
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      // Opening bracket — push onto stack
      stack.push(char);
    } else {
      // Closing bracket — check top of stack
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
        return false;
      }
      stack.pop();
    }
  }

  // Valid only if all brackets were matched
  return stack.length === 0;
}
\`\`\`

### Why Interviewers Ask This

Tests your ability to:
1. Recognize stack-based problems (matching/nesting)
2. Handle edge cases (empty string, single bracket, interleaved brackets)
3. Use appropriate data structures for the problem

### Similar Problems

- Generate Parentheses (Medium — backtracking)
- Longest Valid Parentheses (Hard — DP or stack)
- Minimum Add to Make Parentheses Valid`,
      },
      {
        title: "Medium — Longest Substring Without Repeating Characters",
        slug: "medium-longest-substring",
        type: "exercise" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 3,
        content: `## Longest Substring Without Repeating Characters

### Problem

Given a string \`s\`, find the length of the longest substring without repeating characters.

### Constraints

- 0 ≤ s.length ≤ 50,000
- s consists of English letters, digits, symbols, and spaces

### Examples

**Example 1:**
- Input: s = "abcabcbb"
- Output: 3
- Explanation: The answer is "abc", with length 3.

**Example 2:**
- Input: s = "bbbbb"
- Output: 1
- Explanation: The answer is "b", with length 1.

**Example 3:**
- Input: s = "pwwkew"
- Output: 3
- Explanation: The answer is "wke", with length 3. Note that "pwke" is a subsequence, not a substring.

### Hints

<details>
<summary>Hint 1</summary>
Think about maintaining a "window" of characters. What happens when you encounter a duplicate?
</details>

<details>
<summary>Hint 2</summary>
Use a sliding window with two pointers. Expand the right pointer, and when a duplicate is found, shrink from the left.
</details>

<details>
<summary>Hint 3</summary>
Use a Set (or Map) to track characters in the current window. When a duplicate is found, remove characters from the left until the duplicate is gone.
</details>

### Solution: Brute Force

**Approach:** Check every possible substring for uniqueness.

**Complexity:** Time O(n³), Space O(n)

\`\`\`typescript
function lengthOfLongestSubstring(s: string): number {
  let maxLen = 0;

  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      // Check if substring s[i..j] has all unique characters
      const chars = new Set(s.slice(i, j + 1));
      if (chars.size === j - i + 1) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }
  return maxLen;
}
\`\`\`

### Solution: Optimal (Sliding Window)

**Approach:** Use a sliding window with a Set to track unique characters.

**Complexity:** Time O(n), Space O(min(n, alphabet size))

\`\`\`typescript
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // Shrink window from left until no duplicate
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }

    // Add current character to window
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
\`\`\`

### Why Interviewers Ask This

Tests your ability to:
1. Apply the sliding window pattern
2. Use a Set for O(1) duplicate detection
3. Handle edge cases (empty string, all same characters)
4. Optimize from O(n³) to O(n)

### Similar Problems

- Longest Repeating Character Replacement (Medium)
- Minimum Window Substring (Hard)
- Substring with Concatenation of All Words (Hard)`,
      },
      {
        title: "Easy — Reverse Linked List",
        slug: "easy-reverse-linked-list",
        type: "exercise" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 4,
        content: `## Reverse Linked List

### Problem

Given the head of a singly linked list, reverse the list, and return the reversed list.

### Examples

**Example 1:**
- Input: head = [1, 2, 3, 4, 5]
- Output: [5, 4, 3, 2, 1]

**Example 2:**
- Input: head = [1, 2]
- Output: [2, 1]

### Hints

<details>
<summary>Hint 1</summary>
You need to change where each node points. Instead of pointing to the next node, it should point to the previous node.
</details>

<details>
<summary>Hint 2</summary>
Use three pointers: previous, current, and next. At each step: save next, point current to previous, advance previous and current.
</details>

### Solution: Iterative

**Complexity:** Time O(n), Space O(1)

\`\`\`typescript
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next = current.next;  // Save next
    current.next = prev;        // Reverse pointer
    prev = current;             // Advance prev
    current = next;             // Advance current
  }

  return prev; // prev is now the new head
}
\`\`\`

### Solution: Recursive

**Complexity:** Time O(n), Space O(n) — call stack

\`\`\`typescript
function reverseList(head: ListNode | null): ListNode | null {
  // Base case: empty list or single node
  if (head === null || head.next === null) return head;

  // Reverse the rest of the list
  const newHead = reverseList(head.next);

  // Make the next node point back to current
  head.next.next = head;
  head.next = null;

  return newHead;
}
\`\`\`

### Why Interviewers Ask This

Tests your ability to:
1. Manipulate pointers without losing references
2. Think about edge cases (empty list, single node)
3. Understand iterative vs recursive approaches
4. Visualize the algorithm step by step

### Similar Problems

- Reverse Linked List II (reverse from position m to n)
- Palindrome Linked List
- Swap Nodes in Pairs`,
      },
      {
        title: "Easy — Maximum Subarray (Kadane's)",
        slug: "easy-maximum-subarray",
        type: "exercise" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 5,
        content: `## Maximum Subarray (Kadane's Algorithm)

### Problem

Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

### Examples

**Example 1:**
- Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
- Output: 6
- Explanation: The subarray [4, -1, 2, 1] has the largest sum 6.

**Example 2:**
- Input: nums = [1]
- Output: 1

**Example 3:**
- Input: nums = [5, 4, -1, 7, 8]
- Output: 23
- Explanation: The entire array [5, 4, -1, 7, 8] has the largest sum.

### Hints

<details>
<summary>Hint 1</summary>
At each position, you have two choices: either extend the current subarray or start a new one from this position. Which gives a bigger sum?
</details>

<details>
<summary>Hint 2</summary>
If the running sum becomes negative, it's better to start fresh. A negative prefix will always drag down the total.
</details>

### Solution: Brute Force

**Complexity:** Time O(n²), Space O(1)

\`\`\`typescript
function maxSubArray(nums: number[]): number {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }
  return maxSum;
}
\`\`\`

### Solution: Optimal (Kadane's Algorithm)

**Complexity:** Time O(n), Space O(1)

\`\`\`typescript
function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend the current subarray or start fresh
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
\`\`\`

### Why Interviewers Ask This

Tests your ability to:
1. Apply dynamic programming / greedy thinking
2. Understand Kadane's algorithm (a fundamental technique)
3. Handle all-negative arrays
4. Think about subarray vs subsequence

### Similar Problems

- Maximum Product Subarray (Medium)
- Best Time to Buy and Sell Stock (Easy — same pattern)
- Maximum Sum Circular Subarray (Medium)`,
      },
      {
        title: "Medium — Merge Intervals",
        slug: "medium-merge-intervals",
        type: "exercise" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 6,
        content: `## Merge Intervals

### Problem

Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals, and return an array of the non-overlapping intervals.

### Examples

**Example 1:**
- Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
- Output: [[1,6],[8,10],[15,18]]
- Explanation: [1,3] and [2,6] overlap → [1,6]

**Example 2:**
- Input: intervals = [[1,4],[4,5]]
- Output: [[1,5]]
- Explanation: [1,4] and [4,5] are touching → [1,5]

### Hints

<details>
<summary>Hint 1</summary>
If the intervals were sorted by start time, overlapping intervals would be adjacent. How does sorting help?
</details>

<details>
<summary>Hint 2</summary>
After sorting, compare each interval with the last merged interval. If they overlap (current start ≤ last end), merge them. Otherwise, start a new merged interval.
</details>

### Solution: Sort + Linear Scan

**Complexity:** Time O(n log n), Space O(n)

\`\`\`typescript
function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      // Overlapping — merge by extending the end
      last[1] = Math.max(last[1], current[1]);
    } else {
      // Not overlapping — add as new interval
      merged.push(current);
    }
  }

  return merged;
}
\`\`\`

### Why Interviewers Ask This

Tests your ability to:
1. Recognize that sorting enables a linear solution
2. Handle edge cases (touching intervals, fully contained)
3. Modify data in place (extending merged intervals)
4. This pattern appears everywhere: calendar scheduling, resource allocation, time ranges

### Similar Problems

- Insert Interval (Medium)
- Non-overlapping Intervals (Medium)
- Meeting Rooms / Meeting Rooms II`,
      },
      {
        title: "Medium — Binary Tree Level Order Traversal",
        slug: "medium-level-order-traversal",
        type: "exercise" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 7,
        content: `## Binary Tree Level Order Traversal

### Problem

Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

### Examples

**Example 1:**
- Input: root = [3, 9, 20, null, null, 15, 7]
- Output: [[3], [9, 20], [15, 7]]

**Example 2:**
- Input: root = [1]
- Output: [[1]]

### Hints

<details>
<summary>Hint 1</summary>
Level order traversal = BFS. What data structure does BFS use?
</details>

<details>
<summary>Hint 2</summary>
Use a queue. Process all nodes at the current level before moving to the next. Track level boundaries by processing queue.length nodes at each step.
</details>

### Solution: BFS with Queue

**Complexity:** Time O(n), Space O(n)

\`\`\`typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length; // Nodes at current level
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);

      // Add children for next level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}
\`\`\`

### Why Interviewers Ask This

Tests your ability to:
1. Apply BFS correctly with level boundaries
2. Use a queue data structure
3. Handle null nodes and edge cases
4. BFS is foundational for graph problems, shortest path, and many tree operations

### Similar Problems

- Binary Tree Zigzag Level Order Traversal (Medium)
- Minimum Depth of Binary Tree (Easy — first leaf node in BFS)
- Binary Tree Right Side View (Medium — last node in each level)`,
      },
      {
        title: "Hard — Trapping Rain Water",
        slug: "hard-trapping-rain-water",
        type: "exercise" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 30,
        order: 8,
        content: `## Trapping Rain Water

### Problem

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Examples

**Example 1:**
- Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
- Output: 6

**Example 2:**
- Input: height = [4,2,0,3,2,5]
- Output: 9

### Hints

<details>
<summary>Hint 1</summary>
For each position, the water it can hold = min(max height to its left, max height to its right) - its own height.
</details>

<details>
<summary>Hint 2</summary>
Brute force: for each position, scan left and right for max heights. Can you precompute these?
</details>

<details>
<summary>Hint 3</summary>
Optimal: use two pointers (left, right) moving inward. Track maxLeft and maxRight. Water at each position depends on the smaller of the two maxes.
</details>

### Solution: Two Pointers

**Complexity:** Time O(n), Space O(1)

\`\`\`typescript
function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxLeft = 0;
  let maxRight = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      // Water at left position bounded by maxLeft
      if (height[left] >= maxLeft) {
        maxLeft = height[left];
      } else {
        water += maxLeft - height[left];
      }
      left++;
    } else {
      // Water at right position bounded by maxRight
      if (height[right] >= maxRight) {
        maxRight = height[right];
      } else {
        water += maxRight - height[right];
      }
      right--;
    }
  }

  return water;
}
\`\`\`

### Why Interviewers Ask This

This is a famous hard problem that tests:
1. Two-pointer technique on arrays
2. Understanding how constraints (left max, right max) work together
3. Optimizing from O(n²) brute force to O(n) with clever pointer logic
4. It's a common Google/Amazon interview question

### Similar Problems

- Container With Most Water (Medium — two pointers)
- Largest Rectangle in Histogram (Hard — stack)
- Product of Array Except Self (Medium)`,
      },
      {
        title: "Coding Exercises Quiz",
        slug: "coding-exercises-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 9,
        content: `## Coding Pattern Recognition Quiz

<!--quiz
[
  {
    "question": "You need to find if there's a pair in a SORTED array that sums to a target. What's the optimal approach?",
    "options": [
      "Hash Map — O(n) time, O(n) space",
      "Two Pointers — O(n) time, O(1) space",
      "Binary Search for each element — O(n log n)",
      "Sort then use nested loops — O(n²)"
    ],
    "correctIndex": 1,
    "explanation": "Since the array is already sorted, two pointers is optimal: start one at the beginning and one at the end. If sum < target, move left pointer right. If sum > target, move right pointer left. O(n) time and O(1) space — better than hash map's O(n) space."
  },
  {
    "question": "You need to find the shortest path between two nodes in an unweighted graph. Which algorithm?",
    "options": [
      "DFS — explore all paths",
      "BFS — shortest path in unweighted graphs",
      "Dijkstra's — shortest path algorithm",
      "Dynamic Programming — break into subproblems"
    ],
    "correctIndex": 1,
    "explanation": "BFS guarantees the shortest path in an unweighted graph because it explores all nodes at distance 1 before distance 2, distance 2 before distance 3, etc. The first time you reach the target, you've found the shortest path. DFS might find a longer path first. Dijkstra's is for weighted graphs (overkill here)."
  },
  {
    "question": "A problem asks: 'Find the number of ways to climb n stairs if you can take 1 or 2 steps at a time.' What pattern is this?",
    "options": [
      "Greedy — always take the largest step",
      "Backtracking — try all combinations",
      "Dynamic Programming — overlapping subproblems",
      "Two Pointers — scan from both ends"
    ],
    "correctIndex": 2,
    "explanation": "This is classic DP (it's actually the Fibonacci sequence!). ways(n) = ways(n-1) + ways(n-2). The subproblems overlap: ways(5) needs ways(4) and ways(3), ways(4) needs ways(3) and ways(2) — ways(3) is computed twice without memoization. Keywords 'number of ways' and optimal substructure are DP signals."
  },
  {
    "question": "Kadane's algorithm solves which problem in O(n) time?",
    "options": [
      "Finding two numbers that sum to a target",
      "Maximum sum contiguous subarray",
      "Longest increasing subsequence",
      "Sorting an array"
    ],
    "correctIndex": 1,
    "explanation": "Kadane's algorithm finds the maximum sum contiguous subarray in O(n) time. At each position, it decides: extend the current subarray or start a new one. If the running sum becomes negative, start fresh — a negative prefix always hurts. It's one of the most important algorithms to know for interviews."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 3: System Design
     ============================================================ */
  {
    name: "System Design",
    slug: "system-design",
    description: "10 classic system design problems with step-by-step walkthroughs, architecture diagrams, and trade-off discussions.",
    order: 3,
    sections: [
      {
        title: "Design a URL Shortener (Bitly)",
        slug: "design-url-shortener",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 1,
        content: `## System Design: URL Shortener (Bitly)

### Step 1: Requirements Clarification

Always start by asking clarifying questions. Never jump into design.

**Functional Requirements:**
- Given a long URL, generate a short URL
- Given a short URL, redirect to the original long URL
- Users can optionally set custom short URLs
- Short URLs expire after a configurable period (default: no expiry)

**Non-Functional Requirements:**
- System should be highly available (redirects must never fail)
- URL redirection should happen in real-time (<100ms latency)
- Short URLs should not be predictable (security)
- System should handle 100M new URLs per month, 10B redirects per month

**Back-of-the-Envelope Estimation:**
- 100M new URLs/month = ~40 URLs/second (write)
- 10B redirects/month = ~4,000 redirects/second (read)
- Read:Write ratio = 100:1 (read-heavy system)
- Storage: 100M × 12 months × 5 years = 6B URLs. Each URL ~500 bytes → 3TB total
- Short URL length: 6 characters using [a-zA-Z0-9] = 62⁶ = 56.8B possibilities (enough)

### Step 2: API Design

\`\`\`
POST /api/shorten
  Body: { longUrl: string, customAlias?: string, expiresAt?: string }
  Response: { shortUrl: string, longUrl: string, createdAt: string }

GET /{shortCode}
  Response: 301 Redirect to longUrl
  (301 = permanent redirect, browser caches it)
  (302 = temporary redirect, browser always hits server — better for analytics)

GET /api/stats/{shortCode}
  Response: { clicks: number, created: string, lastAccessed: string }
\`\`\`

### Step 3: Database Schema

\`\`\`sql
CREATE TABLE urls (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  short_code  VARCHAR(10) UNIQUE NOT NULL,
  long_url    TEXT NOT NULL,
  user_id     BIGINT,
  created_at  TIMESTAMP DEFAULT NOW(),
  expires_at  TIMESTAMP NULL,
  click_count BIGINT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_expires_at ON urls(expires_at) WHERE expires_at IS NOT NULL;
\`\`\`

**Database choice:** SQL (PostgreSQL) for consistency and the unique constraint on short_code. At this scale, a single primary with read replicas works. For >1B URLs, consider sharding by short_code hash.

### Step 4: Short Code Generation

**Option 1: Hash-based (MD5/SHA256)**
- Hash the long URL, take first 6 characters
- Problem: collisions. Two different URLs might generate the same hash prefix.
- Mitigation: append a counter or user ID before hashing

**Option 2: Counter-based (Auto-increment → Base62)**
- Use a global counter, convert to Base62
- Problem: predictable (counter=1 → "1", counter=2 → "2")
- Mitigation: add random offset or use a distributed ID generator (Snowflake)

**Option 3: Pre-generated keys (Recommended)**
- Generate millions of random 6-character codes in advance
- Store in a "key pool" table
- When a new URL is created, pop a key from the pool
- No collision risk, fast, not predictable

### Step 5: Architecture

\`\`\`
Client → Load Balancer → API Servers → Cache (Redis) → Database (PostgreSQL)
                                     ↑
                              Read path: Check cache first
                              Miss: Query DB, populate cache
                              Write path: Write DB, write cache
\`\`\`

**Components:**
1. **Load Balancer** — distributes traffic across API servers
2. **API Servers** — stateless, horizontally scalable
3. **Redis Cache** — cache hot URLs (most accessed URLs follow 80/20 rule)
4. **PostgreSQL** — persistent storage with read replicas
5. **Key Generation Service** — generates and manages pre-generated short codes

### Step 6: Detailed Design

**Read Path (Redirect):**
1. User hits GET /{shortCode}
2. Check Redis cache for shortCode → longUrl mapping
3. Cache hit → return 302 redirect (fast path)
4. Cache miss → query PostgreSQL, populate Redis, return 302 redirect
5. Increment click counter (async, write to separate analytics table)

**Write Path (Create Short URL):**
1. User sends POST /api/shorten with longUrl
2. Check if longUrl already exists → return existing shortCode
3. Get next available shortCode from Key Generation Service
4. Insert into PostgreSQL
5. Add to Redis cache
6. Return shortUrl to user

**Cache Strategy:**
- Cache capacity: 20% of URLs (80/20 rule — 20% of URLs get 80% of traffic)
- 6B × 20% = 1.2B entries × 500 bytes ≈ 600GB Redis (use a cluster)
- Eviction: LRU (Least Recently Used)
- TTL: match URL expiration, or 24 hours for non-expiring

### Step 7: Scalability

| Challenge | Solution |
|-----------|---------|
| High read volume (4K/s) | Redis cache + read replicas |
| Database growth (3TB) | Partition by shortCode hash (range-based sharding) |
| Global latency | CDN for redirect responses + geo-distributed caches |
| Key generation bottleneck | Pre-generate keys in batches, assign ranges to servers |
| Analytics at scale | Separate analytics pipeline (Kafka → clickstream DB) |

### Step 8: Trade-offs

| Decision | Option A | Option B | Chosen |
|----------|---------|---------|--------|
| Redirect code | 301 (cached by browser) | 302 (always hits server) | 302 — need analytics |
| Database | SQL (consistency) | NoSQL (scale) | SQL — data is structured, needs unique constraint |
| Short code length | 6 chars (56B possibilities) | 8 chars (218T possibilities) | 6 — sufficient for 5+ years |
| Cache strategy | Cache all | Cache hot URLs (LRU) | LRU — more cost-effective |`,
      },
      {
        title: "Design a Chat Application (WhatsApp)",
        slug: "design-chat-app",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## System Design: Chat Application (WhatsApp)

### Requirements

**Functional:**
- One-on-one messaging
- Group chats (up to 256 members)
- Online/offline status indicators
- Message delivery receipts (sent, delivered, read)
- Media sharing (images, videos, documents)

**Non-Functional:**
- Real-time messaging (< 100ms latency)
- Message ordering guaranteed within a conversation
- At-least-once delivery (no lost messages)
- Support 1B+ daily active users
- Messages stored for 30 days on server, permanently on device

### Back-of-the-Envelope

- 1B DAU, 40 messages/user/day = 40B messages/day
- 40B / 86,400 = ~460K messages/second
- Average message: 100 bytes → 40B × 100 = 4TB/day new messages
- Media: 10% of messages have media → 4B media files/day

### Architecture

\`\`\`
Client → Load Balancer → WebSocket Servers → Message Queue →
  → Chat Service → Database (messages)
  → Notification Service → Push Notifications (offline users)
  → Media Service → Blob Storage (images/videos)
\`\`\`

**Key Components:**

1. **WebSocket Servers** — maintain persistent connections with clients. Each server tracks which users are connected to it.

2. **Connection Manager** — maps userId → which WebSocket server they're on. When User A sends to User B, the system looks up B's server.

3. **Message Queue (Kafka)** — decouples message sending from delivery. Ensures at-least-once delivery even if recipient's server is temporarily down.

4. **Chat Service** — handles message routing, group message fan-out, delivery receipts.

5. **Message Storage** — write-optimized database (Cassandra) partitioned by conversationId. Messages within a conversation are ordered by timestamp.

### Message Flow

**Sending a message:**
1. User A sends message via WebSocket to their connected server
2. Server generates messageId + timestamp
3. Server writes to Kafka topic for User B's conversation
4. Server returns "sent" receipt to User A
5. Chat Service consumes from Kafka:
   - Stores message in database
   - Looks up User B's WebSocket server
   - If B is online: forward message → return "delivered" receipt
   - If B is offline: send push notification

**Group message fan-out:**
- For a group of 100 members, the message is written once to the group's Kafka topic
- Chat Service fans out to each member's inbox
- Only online members get real-time delivery; offline members see it when they reconnect

### Key Trade-offs

| Decision | Choice | Why |
|----------|--------|-----|
| Protocol | WebSocket | Real-time, bidirectional, low overhead |
| Message DB | Cassandra | Write-heavy, partition by conversation, time-ordered |
| Queue | Kafka | Durable, ordered, handles 460K msg/s |
| Media storage | S3/Blob | Cheap, scalable, CDN-friendly |
| Encryption | End-to-end | Privacy, but complicates search and moderation |`,
      },
      {
        title: "Design a Rate Limiter",
        slug: "design-rate-limiter",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 3,
        content: `## System Design: Rate Limiter

### Why Rate Limiting?

- Prevent abuse (DDoS, brute force)
- Control costs (expensive API calls)
- Ensure fair usage (shared resources)
- Protect downstream services

### Algorithms

**1. Token Bucket**

Imagine a bucket that fills with tokens at a steady rate. Each request takes one token. If the bucket is empty, the request is rejected.

- Bucket capacity: 10 tokens (burst limit)
- Refill rate: 1 token/second
- Allows bursts up to 10 requests, then 1/second steady

**2. Sliding Window Counter**

Count requests in a sliding time window (e.g., last 60 seconds).

\`\`\`typescript
// Simplified sliding window
async function isAllowed(userId: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Count requests in the window
  const count = await redis.zcount(\`ratelimit:\${userId}\`, windowStart, now);

  if (count >= limit) return false;

  // Add current request
  await redis.zadd(\`ratelimit:\${userId}\`, now, \`\${now}-\${Math.random()}\`);
  // Clean old entries
  await redis.zremrangebyscore(\`ratelimit:\${userId}\`, 0, windowStart);

  return true;
}
\`\`\`

**3. Fixed Window Counter**

Count requests per fixed time window (e.g., per minute). Simpler but has boundary issues — a burst at 0:59 + burst at 1:01 bypasses the limit.

### Rate Limiter Architecture

\`\`\`
Client → API Gateway (rate limiter) → Backend Services
                ↓
         Redis (counters)
\`\`\`

**Headers to return:**
\`\`\`
X-RateLimit-Limit: 100          // Max requests per window
X-RateLimit-Remaining: 87       // Requests left
X-RateLimit-Reset: 1625097600   // When the window resets (Unix timestamp)
Retry-After: 30                 // Seconds until the client can retry (on 429)
\`\`\`

### Distributed Rate Limiting

With multiple API servers, you need a shared counter:
- **Redis** — central counter, all servers increment the same key
- **Race condition:** Use Redis MULTI/EXEC (atomic) or Lua scripts
- **Consistency:** Slightly over-limiting is better than under-limiting

### Rule Configuration

\`\`\`typescript
const RATE_LIMITS = {
  "api.general": { limit: 100, window: "1m" },
  "api.auth.login": { limit: 5, window: "5m" },      // Stricter
  "api.ai.generate": { limit: 10, window: "1h" },     // Expensive
  "api.upload": { limit: 20, window: "1h" },           // Resource-heavy
};
\`\`\``,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Code Architecture
     ============================================================ */
  {
    name: "Code Architecture",
    slug: "code-architecture",
    description: "SOLID principles, design patterns, clean code, and refactoring exercises — all in TypeScript.",
    order: 4,
    sections: [
      {
        title: "SOLID Principles",
        slug: "solid-principles",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## SOLID Principles

SOLID is a set of five design principles that help you write code that's maintainable, extensible, and testable. They're not rules to follow blindly — they're guidelines that become intuitive with practice.

### S — Single Responsibility Principle

**One class (or function) should have one reason to change.**

**Bad — UserService does everything:**
\`\`\`typescript
class UserService {
  createUser(data: UserData) { /* creates user in DB */ }
  sendWelcomeEmail(user: User) { /* sends email */ }
  generateReport(users: User[]) { /* creates PDF report */ }
  validatePassword(password: string) { /* checks strength */ }
}
\`\`\`

**Good — each class has one job:**
\`\`\`typescript
class UserRepository {
  create(data: UserData): User { /* DB operations only */ }
}

class EmailService {
  sendWelcome(user: User): void { /* email only */ }
}

class ReportGenerator {
  generateUserReport(users: User[]): PDF { /* reporting only */ }
}

class PasswordValidator {
  validate(password: string): ValidationResult { /* validation only */ }
}
\`\`\`

**Why it matters:** When you need to change how emails are sent, you only touch EmailService. No risk of breaking user creation or reporting.

### O — Open/Closed Principle

**Open for extension, closed for modification.**

You should be able to add new behavior without changing existing code.

**Bad — adding a new payment method requires modifying the function:**
\`\`\`typescript
function processPayment(method: string, amount: number) {
  if (method === "credit_card") { /* credit card logic */ }
  else if (method === "paypal") { /* paypal logic */ }
  else if (method === "crypto") { /* crypto logic — had to modify! */ }
}
\`\`\`

**Good — new payment methods are added without touching existing code:**
\`\`\`typescript
interface PaymentProcessor {
  process(amount: number): PaymentResult;
}

class CreditCardProcessor implements PaymentProcessor {
  process(amount: number) { /* credit card logic */ }
}

class PayPalProcessor implements PaymentProcessor {
  process(amount: number) { /* paypal logic */ }
}

// Adding crypto — no existing code modified
class CryptoProcessor implements PaymentProcessor {
  process(amount: number) { /* crypto logic */ }
}
\`\`\`

### L — Liskov Substitution Principle

**Subtypes must be substitutable for their base types without breaking the program.**

If your code works with a base class, it should work with any subclass without surprises.

**Bad — Square breaks Rectangle's behavior:**
\`\`\`typescript
class Rectangle {
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(w: number) { this.width = w; this.height = w; } // Surprise!
  setHeight(h: number) { this.width = h; this.height = h; } // Surprise!
}

// This breaks with Square:
function doubleWidth(rect: Rectangle) {
  rect.setWidth(rect.width * 2);
  // Expected: area doubles. With Square: area quadruples!
}
\`\`\`

### I — Interface Segregation Principle

**No client should be forced to depend on methods it doesn't use.**

**Bad — one fat interface:**
\`\`\`typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
}
// A Robot implements Worker but can't eat or sleep!
\`\`\`

**Good — split into focused interfaces:**
\`\`\`typescript
interface Workable { work(): void; }
interface Feedable { eat(): void; }
interface Restable { sleep(): void; }

class HumanWorker implements Workable, Feedable, Restable {
  work() { }
  eat() { }
  sleep() { }
}

class RobotWorker implements Workable {
  work() { } // Only implements what it needs
}
\`\`\`

### D — Dependency Inversion Principle

**High-level modules should not depend on low-level modules. Both should depend on abstractions.**

**Bad — tightly coupled:**
\`\`\`typescript
class OrderService {
  private db = new PostgresDatabase(); // Directly depends on Postgres
  private mailer = new SendGridMailer(); // Directly depends on SendGrid

  createOrder(data: OrderData) {
    this.db.insert("orders", data);
    this.mailer.send(data.email, "Order confirmed");
  }
}
\`\`\`

**Good — depends on abstractions:**
\`\`\`typescript
interface Database { insert(table: string, data: any): void; }
interface Mailer { send(to: string, body: string): void; }

class OrderService {
  constructor(
    private db: Database,      // Any database implementation works
    private mailer: Mailer     // Any mailer implementation works
  ) {}

  createOrder(data: OrderData) {
    this.db.insert("orders", data);
    this.mailer.send(data.email, "Order confirmed");
  }
}

// Easy to swap implementations:
new OrderService(new PostgresDatabase(), new SendGridMailer());
new OrderService(new MockDatabase(), new MockMailer()); // For testing!
\`\`\`

### When SOLID Goes Too Far

SOLID principles are guidelines, not laws. Over-applying them creates:
- Too many tiny classes that are hard to navigate
- Abstractions for things that will never change
- "Architecture astronaut" code that's harder to understand than the problem it solves

**Rule of thumb:** Apply SOLID when you feel the pain of not applying it (duplicate code, hard-to-test classes, changes rippling through many files). Don't pre-apply it to code that's simple and unlikely to change.`,
      },
      {
        title: "Design Patterns in TypeScript",
        slug: "design-patterns-typescript",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 2,
        content: `## Design Patterns in TypeScript

Design patterns are reusable solutions to common problems. Don't memorize all 23 Gang of Four patterns — learn the ones you'll actually use.

### Strategy Pattern

**Problem:** You need different algorithms/behaviors that can be swapped at runtime.

\`\`\`typescript
// Define the strategy interface
interface SortStrategy {
  sort(data: number[]): number[];
}

// Implement concrete strategies
class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    // Quick sort implementation
    return [...data].sort((a, b) => a - b);
  }
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    return arr;
  }
}

// Context uses any strategy
class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy) {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

// Usage — swap algorithms without changing the Sorter
const sorter = new Sorter(new QuickSort());
sorter.sort([3, 1, 2]); // Uses QuickSort

sorter.setStrategy(new BubbleSort());
sorter.sort([3, 1, 2]); // Now uses BubbleSort
\`\`\`

**Real-world uses:** Payment processing (Stripe/PayPal/Crypto), authentication (JWT/Session/OAuth), notification channels (email/SMS/push).

### Observer Pattern

**Problem:** When one object changes, notify all dependent objects automatically.

\`\`\`typescript
type EventHandler<T> = (data: T) => void;

class EventEmitter<Events extends Record<string, any>> {
  private listeners = new Map<string, Set<EventHandler<any>>>();

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }
    this.listeners.get(event as string)!.add(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    this.listeners.get(event as string)?.forEach(handler => handler(data));
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    this.listeners.get(event as string)?.delete(handler);
  }
}

// Usage
type AppEvents = {
  "user:created": { id: string; email: string };
  "order:placed": { orderId: string; total: number };
};

const events = new EventEmitter<AppEvents>();

events.on("user:created", (user) => sendWelcomeEmail(user.email));
events.on("user:created", (user) => createDefaultSettings(user.id));
events.on("order:placed", (order) => updateInventory(order.orderId));

events.emit("user:created", { id: "123", email: "jane@example.com" });
\`\`\`

**Real-world uses:** React state management, Node.js EventEmitter, DOM events, WebSocket messages.

### Factory Pattern

**Problem:** Creating objects without specifying the exact class.

\`\`\`typescript
interface Notification {
  send(message: string, recipient: string): void;
}

class EmailNotification implements Notification {
  send(message: string, recipient: string) {
    console.log(\`Email to \${recipient}: \${message}\`);
  }
}

class SMSNotification implements Notification {
  send(message: string, recipient: string) {
    console.log(\`SMS to \${recipient}: \${message}\`);
  }
}

class PushNotification implements Notification {
  send(message: string, recipient: string) {
    console.log(\`Push to \${recipient}: \${message}\`);
  }
}

// Factory
function createNotification(type: "email" | "sms" | "push"): Notification {
  switch (type) {
    case "email": return new EmailNotification();
    case "sms": return new SMSNotification();
    case "push": return new PushNotification();
  }
}

// Usage — caller doesn't know the concrete class
const notifier = createNotification("email");
notifier.send("Hello!", "jane@example.com");
\`\`\`

### Singleton Pattern

**Problem:** Ensure a class has only one instance (database connections, config, logging).

\`\`\`typescript
class Database {
  private static instance: Database;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql: string) { /* execute query */ }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
// db1 === db2 → true (same instance)
\`\`\`

**Warning:** Singletons make testing harder (global state). In modern apps, prefer dependency injection over singletons.

### Pattern Decision Guide

| Problem | Pattern |
|---------|---------|
| Need to swap algorithms at runtime | Strategy |
| Need to notify multiple listeners of changes | Observer |
| Need to create objects without knowing the exact type | Factory |
| Need exactly one instance of a class | Singleton |
| Need to add behavior to objects dynamically | Decorator |
| Need to simplify a complex subsystem | Facade |`,
      },
      {
        title: "Code Architecture Quiz",
        slug: "code-architecture-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Code Architecture Quiz

<!--quiz
[
  {
    "question": "Your payment system supports credit cards now but will add PayPal and crypto later. Which SOLID principle tells you how to structure this?",
    "options": [
      "Single Responsibility — each payment method is its own class",
      "Open/Closed — new payment methods shouldn't require modifying existing code",
      "Liskov Substitution — all payment methods must be interchangeable",
      "All of the above work together"
    ],
    "correctIndex": 3,
    "explanation": "All three work together: Open/Closed says add new payment types without modifying existing code. Single Responsibility says each payment type is its own class. Liskov Substitution says all implementations must honor the PaymentProcessor interface contract. You'd create an interface, implement it for each method, and inject the right implementation."
  },
  {
    "question": "You need to send notifications via email, SMS, or push depending on user preferences. Which design pattern?",
    "options": [
      "Singleton — one notification instance",
      "Strategy — swap notification channel at runtime",
      "Observer — broadcast to all channels",
      "Factory — create the right notification type"
    ],
    "correctIndex": 1,
    "explanation": "Strategy pattern is ideal: define a NotificationStrategy interface with a send() method. Implement EmailStrategy, SMSStrategy, PushStrategy. The notification service takes a strategy and uses it without knowing the implementation. The strategy can be selected based on user preferences at runtime."
  },
  {
    "question": "What's wrong with this code from a SOLID perspective?\\n\\nclass UserService {\\n  async register(data) { ... }\\n  async sendVerificationEmail(user) { ... }\\n  async generateAvatar(user) { ... }\\n  async createBillingAccount(user) { ... }\\n}",
    "options": [
      "Nothing — it's a user service, all these relate to users",
      "Violates Single Responsibility — UserService has 4 different reasons to change",
      "Violates Open/Closed — can't extend without modifying",
      "Violates Interface Segregation — clients forced to depend on methods they don't use"
    ],
    "correctIndex": 1,
    "explanation": "This violates the Single Responsibility Principle. UserService has 4 distinct reasons to change: (1) registration logic, (2) email templates/delivery, (3) avatar generation, (4) billing integration. If the email provider changes, you modify UserService. If billing changes, you modify UserService. Split into: UserRepository, EmailService, AvatarService, BillingService."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 5: Testing Workshop
     ============================================================ */
  {
    name: "Testing Workshop",
    slug: "testing-workshop",
    description: "Unit testing patterns, integration testing, TDD walkthrough, and test coverage strategy.",
    order: 5,
    sections: [
      {
        title: "Unit Testing Patterns",
        slug: "unit-testing-patterns",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Unit Testing Patterns

Good tests are the difference between "I'm confident this deploy won't break anything" and "let me deploy on Friday afternoon and pray."

### The AAA Pattern (Arrange, Act, Assert)

Every test follows this structure:

\`\`\`typescript
test("calculates total with tax", () => {
  // Arrange — set up test data
  const cart = new ShoppingCart();
  cart.addItem({ name: "Book", price: 20 });
  cart.addItem({ name: "Pen", price: 5 });
  const taxRate = 0.1;

  // Act — execute the thing being tested
  const total = cart.calculateTotal(taxRate);

  // Assert — verify the result
  expect(total).toBe(27.5); // (20 + 5) * 1.1
});
\`\`\`

### What to Test

**Test behavior, not implementation.** Don't test that a function calls another function — test that the output is correct.

**Bad — testing implementation:**
\`\`\`typescript
test("sorts array using quicksort", () => {
  const spy = jest.spyOn(sorter, "quicksort");
  sorter.sort([3, 1, 2]);
  expect(spy).toHaveBeenCalled(); // Who cares HOW it sorts?
});
\`\`\`

**Good — testing behavior:**
\`\`\`typescript
test("sorts array in ascending order", () => {
  expect(sorter.sort([3, 1, 2])).toEqual([1, 2, 3]);
});
\`\`\`

### Testing Edge Cases

Always test:
1. **Empty input** — empty array, empty string, null
2. **Single element** — array with 1 item
3. **Boundary values** — 0, -1, MAX_INT, minimum valid input
4. **Duplicates** — [1, 1, 1]
5. **Already sorted / reverse sorted**
6. **Invalid input** — wrong types, missing fields

\`\`\`typescript
describe("Array.max", () => {
  test("returns max of positive numbers", () => {
    expect(findMax([3, 7, 2, 9, 1])).toBe(9);
  });

  test("handles single element", () => {
    expect(findMax([42])).toBe(42);
  });

  test("handles negative numbers", () => {
    expect(findMax([-5, -2, -8])).toBe(-2);
  });

  test("handles duplicates", () => {
    expect(findMax([5, 5, 5])).toBe(5);
  });

  test("throws on empty array", () => {
    expect(() => findMax([])).toThrow("Array cannot be empty");
  });
});
\`\`\`

### Test Coverage Strategy

**What to test:**
- Business logic (calculations, transformations, validations)
- Edge cases and error handling
- Integration points (API responses, database queries)
- Regression tests (bugs that were found and fixed)

**What NOT to test:**
- Framework/library code (React renders, Express routing)
- Simple getters/setters with no logic
- Configuration files
- Third-party code

**Coverage target:** Aim for 80% code coverage on business logic. 100% coverage is a waste of time and leads to brittle tests that break on every refactor.`,
      },
      {
        title: "Testing Workshop Quiz",
        slug: "testing-workshop-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Testing Workshop Quiz

<!--quiz
[
  {
    "question": "You're testing a calculateDiscount(price, percentage) function. Which test cases should you include?",
    "options": [
      "Just test calculateDiscount(100, 10) = 90 — one test is enough",
      "Normal case, zero discount, 100% discount, negative price, percentage > 100, and non-numeric inputs",
      "Only test with random values to cover more scenarios",
      "Only test the cases from the requirements document"
    ],
    "correctIndex": 1,
    "explanation": "Good unit tests cover: (1) normal/happy path (100, 10 → 90), (2) boundary cases (0% discount, 100% discount), (3) edge cases (negative price — should it throw?), (4) invalid inputs (percentage > 100, non-numeric). These catch bugs that normal usage doesn't. Each test should be independent and test ONE behavior. This is the foundation of the testing pyramid."
  },
  {
    "question": "Your test mocks the database and API calls. It passes perfectly. But the feature is broken in production. What went wrong?",
    "options": [
      "The test framework has a bug",
      "Mocks matched the expected behavior but not the ACTUAL behavior — you need integration tests that hit real services",
      "The test was too thorough",
      "Production has different hardware"
    ],
    "correctIndex": 1,
    "explanation": "Mocks test that your code works IF the database/API behaves as expected. But mocks don't catch: schema mismatches (database returns different fields), API behavior changes, query performance issues, connection handling, or data format changes. You need integration tests that hit a real (test) database to catch these. Use mocks for unit tests (fast, isolated), integration tests for real interactions."
  },
  {
    "question": "You have 95% test coverage but bugs keep shipping. What's most likely wrong?",
    "options": [
      "You need 100% coverage",
      "High coverage doesn't mean good tests — you're probably testing implementation details instead of behavior, and missing edge cases",
      "The test framework is unreliable",
      "You need more E2E tests"
    ],
    "correctIndex": 1,
    "explanation": "Coverage measures which lines RUN, not whether they're tested CORRECTLY. Common problems with high-coverage-but-buggy code: (1) tests assert nothing meaningful, (2) tests mirror implementation instead of testing behavior, (3) edge cases aren't tested even if normal paths are, (4) tests don't check error handling. Good tests assert behavior ('given X input, expect Y output'), not implementation ('function calls method Z')."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 6: DevOps Essentials
     ============================================================ */
  {
    name: "DevOps Essentials",
    slug: "devops-essentials",
    description: "Git workflows, CI/CD pipelines, Docker, deployment checklists, monitoring, and cloud services overview.",
    order: 6,
    sections: [
      {
        title: "Git Workflow Cheat Sheet",
        slug: "git-workflow",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 1,
        content: `## Git Workflow Cheat Sheet

### The Three Areas

Git has three areas where your code lives:

1. **Working Directory** — your files on disk (what you edit)
2. **Staging Area** — files marked for the next commit (\`git add\`)
3. **Repository** — committed history (\`git commit\`)

### Essential Commands

| Command | What It Does |
|---------|-------------|
| \`git status\` | Show what's changed, staged, and untracked |
| \`git add file.ts\` | Stage a specific file |
| \`git add .\` | Stage all changes (be careful!) |
| \`git commit -m "message"\` | Commit staged changes |
| \`git log --oneline\` | See commit history (compact) |
| \`git diff\` | See unstaged changes |
| \`git diff --staged\` | See staged changes |
| \`git stash\` | Temporarily save uncommitted changes |
| \`git stash pop\` | Restore stashed changes |

### Branching Strategy

**Git Flow (most teams):**
- \`main\` — production code, always deployable
- \`develop\` — integration branch, next release
- \`feature/xyz\` — one branch per feature
- \`hotfix/xyz\` — urgent production fixes

**Trunk-Based (modern teams):**
- \`main\` — everyone commits here (via short-lived branches)
- Feature branches live <1 day
- Feature flags for incomplete work

### Common Operations

**Create and switch to a new branch:**
\`\`\`
git checkout -b feature/user-auth
\`\`\`

**Merge a feature branch into main:**
\`\`\`
git checkout main
git pull origin main
git merge feature/user-auth
\`\`\`

**Rebase (rewrite history for clean commits):**
\`\`\`
git checkout feature/user-auth
git rebase main
\`\`\`

**Cherry-pick a specific commit:**
\`\`\`
git cherry-pick abc123
\`\`\`

**Undo the last commit (keep changes):**
\`\`\`
git reset --soft HEAD~1
\`\`\`

### Commit Message Convention

\`\`\`
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore
\`\`\`

**Examples:**
- \`feat(auth): add Google OAuth login\`
- \`fix(cart): prevent negative quantity\`
- \`docs(api): update endpoint documentation\`
- \`refactor(user): extract validation logic\`

### Golden Rules

1. **Never force push to main/master** — you'll overwrite your team's work
2. **Commit early, commit often** — small commits are easier to review and revert
3. **Write meaningful commit messages** — "fix bug" tells nobody anything
4. **Pull before you push** — avoid merge conflicts
5. **Never commit secrets** — .env files, API keys, passwords`,
      },
      {
        title: "DevOps Essentials Quiz",
        slug: "devops-essentials-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## DevOps Essentials Quiz

<!--quiz
[
  {
    "question": "You accidentally committed your .env file with API keys to a public GitHub repo. What should you do FIRST?",
    "options": [
      "Delete the file and push a new commit — the old commit is buried",
      "Immediately rotate ALL exposed API keys/secrets (they're already compromised), then remove the file from git history",
      "Make the repo private",
      "Add .env to .gitignore — that will remove it from history"
    ],
    "correctIndex": 1,
    "explanation": "Rotating secrets is the FIRST priority because bots scan GitHub continuously for exposed keys (within minutes). Even after you delete the file, the old commit with the secrets still exists in git history — anyone can view it. Steps: (1) Rotate ALL exposed secrets immediately, (2) Remove from git history (git filter-branch or BFG), (3) Add to .gitignore, (4) Force push. Making the repo private doesn't help — the keys may already be scraped."
  },
  {
    "question": "Your team uses 'git rebase' before merging feature branches. Why is this preferred over 'git merge' by many teams?",
    "options": [
      "Rebase is always faster than merge",
      "Rebase creates a linear commit history (no merge commits), making it easier to read and bisect",
      "Merge is deprecated in modern Git",
      "Rebase automatically resolves conflicts"
    ],
    "correctIndex": 1,
    "explanation": "Rebase replays your commits on top of main, creating a linear history without merge commits. This makes 'git log' cleaner (easy to follow the project history), 'git bisect' more effective (finding which commit introduced a bug), and blame more readable. Merge preserves the exact branching history (useful for auditing) but creates merge commits that clutter the log. Both resolve conflicts manually."
  },
  {
    "question": "What's the main benefit of trunk-based development over Git Flow?",
    "options": [
      "It uses fewer branches",
      "Developers integrate changes continuously into main (multiple times a day), reducing merge conflicts and integration pain",
      "It doesn't require pull requests",
      "It's faster for large teams"
    ],
    "correctIndex": 1,
    "explanation": "Trunk-based development means short-lived branches (hours, not weeks) merged into main frequently. This avoids 'merge hell' — the longer a branch lives, the more it diverges from main, and the harder the merge. Continuous integration catches conflicts early (when they're small). Feature flags hide incomplete work. Google, Facebook, and Netflix all use trunk-based development at massive scale."
  }
]
-->`,
      },
    ],
  },
];
