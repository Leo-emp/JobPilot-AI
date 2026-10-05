/* ============================================================
   SOFTWARE ENGINEER WORKSHOP — Seed Content
   ============================================================
   # Exports the full module/section data for the SE workshop.
   # Imported by the main seed-workshops.ts script.
   # EXPANDED: Deep prose, analogies, step-by-step walkthroughs.
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
        estimatedMinutes: 45,
        order: 1,
        content: `## Data Structures — The Building Blocks

Every piece of software you have ever used stores and organises data using data structures. Choosing the right data structure is the difference between code that runs in milliseconds and code that takes minutes. This is not an exaggeration — the wrong choice can turn a one-second operation into a one-hour operation when the data set grows large enough.

Think of data structures like containers in a kitchen. You would not store soup in a colander or pasta in a cup. Each container has a purpose, and using the wrong one makes everything harder. The same principle applies to software — each data structure excels at certain operations and fails at others.

Understanding data structures is not about memorising definitions. It is about developing an intuition for which container to reach for when you encounter a specific problem. When someone says "I need to check if this item exists in a collection of 10 million items," your brain should immediately think "hash map" — just as naturally as you would reach for a bowl when serving soup.

### Arrays

**What it is:** A contiguous block of memory storing elements of the same type, accessed by index.

**Kitchen analogy:** A spice rack with numbered slots. You can instantly grab spice number 5 — you know exactly where it is because the slots are numbered in order. But inserting a new spice in the middle means physically sliding everything over to make room.

This is not just a metaphor — it is exactly how arrays work in computer memory. An array occupies a contiguous block of memory, and each element sits at a predictable offset from the start. The computer calculates the memory address of element \`i\` using a simple formula: \`start_address + (i × element_size)\`. This is why accessing any element by index is instant — the computer does not need to search; it calculates the exact location.

But this contiguous layout has a cost. When you insert an element at position 3, every element from position 3 onwards must be physically shifted one slot to the right to make room. With 10 million elements, inserting at the beginning means moving 10 million values. That is expensive.

**Operations & Complexity:**

| Operation | Time | Why |
|-----------|------|-----|
| Access by index | O(1) | Jump directly to calculated memory location |
| Search (unsorted) | O(n) | Must check each element one by one |
| Insert at end | O(1) | Just add to the next available slot |
| Insert at beginning | O(n) | Must shift ALL existing elements right |
| Delete at beginning | O(n) | Must shift ALL existing elements left |

**When to use:**
- You need fast access by position (index)
- Data size is known or changes infrequently
- You need to iterate through all elements in order
- Memory efficiency matters (no overhead per element)

**When NOT to use:**
- Frequent insertions/deletions at the beginning or middle
- Unknown or highly variable size
- You need fast search by value (use a hash map instead)

### Linked Lists

**What it is:** A chain of nodes where each node contains data and a pointer (reference) to the next node.

**Kitchen analogy:** A treasure hunt where each clue tells you where the next clue is. You cannot jump to clue number 5 — you must follow the chain from the very first clue, reading each one to find the location of the next.

The key insight about linked lists is that they trade random access speed for insertion speed. Because nodes are not stored contiguously in memory (they can be anywhere), inserting a new node is trivial — create the node, update two pointers, and you are done. No shifting required. But finding a specific node means walking the chain from the beginning.

**Operations & Complexity:**

| Operation | Time | Why |
|-----------|------|-----|
| Access by index | O(n) | Must traverse from head, one node at a time |
| Search | O(n) | Must traverse from head |
| Insert at beginning | O(1) | Just create a new node and point it to the old head |
| Insert at end (with tail pointer) | O(1) | Update tail pointer |
| Delete (given the node reference) | O(1) | Update the previous node's pointer |

**When to use:**
- Frequent insertions/deletions at the beginning
- Implementing stacks, queues, or LRU caches
- When you do not need random access by index
- When memory is fragmented (nodes do not need contiguous space)

### Stacks (LIFO — Last In, First Out)

**What it is:** A collection where you can only add to and remove from the top. Like a stack of plates — the last plate you place on top is the first one you take off.

**Key operations:** push (add to top), pop (remove from top), peek (look at top without removing)

This "last in, first out" behaviour might seem restrictive, but it perfectly models many real-world processes. Think about what happens when you type in a text editor and press Ctrl+Z (undo). The last action you performed is the first one to be undone. That is a stack.

**Real-world uses:**
- Browser back button (stack of visited pages — the last page you visited is the first one you go back to)
- Undo functionality (stack of actions — undo the most recent action first)
- Function call stack (when function A calls function B which calls function C, C finishes first, then B, then A)
- Matching parentheses in code editors (push opening brackets, pop when you see closing brackets)
- Expression evaluation (converting infix to postfix notation)

### Queues (FIFO — First In, First Out)

**What it is:** A collection where you add to the back and remove from the front. Like a queue at a shop — the first person in line is the first person served.

**Key operations:** enqueue (add to back), dequeue (remove from front)

Queues model fairness — first come, first served. Any system that processes requests in the order they arrive uses a queue. This is so fundamental that operating systems, web servers, and databases all use queues internally.

**Real-world uses:**
- Print queue (documents print in the order they were submitted)
- Task scheduling (process jobs in the order they arrive)
- BFS graph traversal (explore nodes level by level)
- Message queues in distributed systems (Kafka, RabbitMQ, SQS)
- Customer support ticket systems

### Hash Maps (Dictionaries)

**What it is:** A key-value store that uses a hash function to map keys to array indices, giving O(1) average-case lookup.

**Kitchen analogy:** A filing cabinet with labelled folders. You do not search through every folder — you go directly to the folder with the label you need. The label IS the address.

Hash maps are arguably the single most important data structure in practical software engineering. They appear everywhere: caching, configuration, counting, deduplication, indexing, routing, and more. If you could learn only one data structure, learn hash maps.

The magic is the hash function. It takes any key (a string, a number, an object) and converts it into an array index. The same key always produces the same index, so lookup is instant — compute the hash, go to that index, and read the value. No searching.

**Operations & Complexity:**

| Operation | Average | Worst (hash collisions) |
|-----------|---------|------------------------|
| Get by key | O(1) | O(n) |
| Set key-value | O(1) | O(n) |
| Delete by key | O(1) | O(n) |
| Check key exists | O(1) | O(n) |

The worst case (O(n)) happens when many keys hash to the same index (a "collision"). Good hash functions and proper table sizing make this extremely rare in practice.

**When to use:**
- Fast lookup by key (user IDs, config settings, database records)
- Counting occurrences (word frequency, vote tallying, analytics)
- Caching (memoisation, LRU cache, API response caching)
- Deduplication (have I seen this value before?)
- Two Sum and similar "find complement" problems

**When NOT to use:**
- You need ordered data (use a tree or sorted array instead)
- Memory is extremely constrained (hash maps use extra memory for the hash table)
- You need range queries ("find all values between 10 and 20")

### Trees

**What it is:** A hierarchical data structure with a root node and child nodes forming branches. Unlike arrays and linked lists (which are linear), trees branch — each node can have multiple children.

**Types and when to use each:**
- **Binary Search Tree (BST)** — left child < parent < right child. Enables O(log n) search, insert, and delete when balanced. Used in database indexes and in-memory sorted collections.
- **Balanced BST (AVL, Red-Black)** — self-balancing to guarantee O(log n) even in worst case. Used in language standard libraries (Java TreeMap, C++ std::map).
- **Heap** — parent is always greater (max-heap) or smaller (min-heap) than children. Used for priority queues: "give me the highest-priority item" in O(1).
- **Trie** — tree for storing strings character by character. Used for autocomplete, spell check, and IP routing.
- **B-tree / B+ tree** — wide, shallow tree optimised for disk access. Used in virtually every database index (PostgreSQL, MySQL, SQLite).

**Real-world uses:**
- File systems (the directory tree on your computer)
- Database indexes (B-trees make SELECT fast)
- Autocomplete features (tries)
- Priority scheduling (heaps — "process the most urgent task next")
- HTML/DOM (the Document Object Model is a tree of elements)

### Graphs

**What it is:** A collection of nodes (vertices) connected by edges. Unlike trees, graphs can have cycles (A → B → C → A) and do not require a root node.

Graphs model relationships. Any time you have entities that are connected to each other, you have a graph. Social networks, maps, dependency chains, recommendation systems — all graphs.

**Types:**
- **Directed** — edges have direction (Twitter follows: A follows B does NOT mean B follows A)
- **Undirected** — edges go both ways (Facebook friends: if A is friends with B, B is friends with A)
- **Weighted** — edges have values (map routes: the edge from London to Edinburgh has weight "distance in miles")

### Data Structure Decision Guide

| What You Need | Use This |
|---------------|----------|
| Fast access by position | Array |
| Fast insert/delete at ends | Linked List or Deque |
| LIFO ordering (undo, back button) | Stack |
| FIFO ordering (task queue, BFS) | Queue |
| Fast lookup by key | Hash Map |
| Ordered data with fast search | BST / Balanced BST |
| Priority ordering | Heap / Priority Queue |
| String prefix matching | Trie |
| Relationships between entities | Graph |

### Big O Cheat Sheet

Big O describes how an algorithm's performance scales as input size grows. It answers the question: "If I double the input, how much longer does it take?"

| Complexity | Name | Scaling Behaviour | Example |
|-----------|------|-------------------|---------|
| O(1) | Constant | Same time regardless of input size | Array access, hash map lookup |
| O(log n) | Logarithmic | Doubles input → one extra step | Binary search, balanced BST |
| O(n) | Linear | Doubles input → doubles time | Linear search, single loop |
| O(n log n) | Linearithmic | Slightly worse than linear | Merge sort, heap sort, good sorting |
| O(n²) | Quadratic | Doubles input → 4x time | Nested loops, bubble sort |
| O(2ⁿ) | Exponential | Each +1 input doubles time | Recursive subsets, brute force |
| O(n!) | Factorial | Completely impractical for n > 20 | Permutations, travelling salesman |`,
      },
      {
        title: "Algorithms — Pattern Recognition Guide",
        slug: "algorithms-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## Algorithm Patterns — Recognising What to Use

The key to solving algorithm problems is not memorising solutions — it is recognising patterns. When you see a problem, you should think "this looks like a sliding window problem" or "this needs BFS," not "let me recall the exact code." Pattern recognition turns an infinite number of problems into a manageable number of techniques.

Think of it like learning to play chess. A grandmaster does not calculate every possible move from scratch. They recognise positions: "this looks like a Sicilian Defence — I know the typical responses." Similarly, an experienced engineer recognises: "this asks for the longest contiguous subarray — I know this is a sliding window problem."

### Pattern 1: Two Pointers

**When to use:** Sorted arrays, finding pairs, palindromes, removing duplicates.

**How it works:** Use two pointers (usually start/end or slow/fast) to traverse the data structure, reducing the search space with each step instead of checking every pair.

The insight is that in a sorted array, the relationship between the two pointed-to values tells you which pointer to move. If the sum is too small, move the left pointer right (to increase the sum). If the sum is too large, move the right pointer left (to decrease it). This eliminates entire swathes of the search space in one step.

**Recognition clues:**
- "Find a pair that sums to X" in a sorted array
- "Is this a palindrome?"
- "Remove duplicates from sorted array"
- "Container with most water"
- Any problem on sorted data asking about pairs

\`\`\`typescript
// # Two Pointers: find pair summing to target in sorted array
function twoPointers(arr: number[], target: number): [number, number] | null {
  let left = 0;                    // # Start pointer at beginning
  let right = arr.length - 1;      // # End pointer at end

  while (left < right) {
    const sum = arr[left] + arr[right];   // # Calculate current pair sum
    if (sum === target) return [left, right]; // # Found the pair
    if (sum < target) left++;     // # Sum too small → need bigger number → move left forward
    else right--;                 // # Sum too large → need smaller number → move right backward
  }
  return null;                    // # No pair found
}
\`\`\`

### Pattern 2: Sliding Window

**When to use:** Problems involving contiguous subarrays or substrings — "find the maximum/minimum over a window of elements."

**How it works:** Maintain a "window" that slides through the array. Instead of recalculating everything for each position, you add the new element entering the window and remove the old element leaving it.

The key insight: if you need to examine every contiguous subarray of size K, the brute force approach recalculates each subarray from scratch — O(n × K). But consecutive windows overlap! Window [2,3,4,5] and window [3,4,5,6] share elements [3,4,5]. Sliding window exploits this overlap.

**Recognition clues:**
- "Maximum sum subarray of size K"
- "Longest substring without repeating characters"
- "Smallest subarray with sum >= target"
- Any problem mentioning "contiguous" + "maximum/minimum"

\`\`\`typescript
// # Sliding Window: longest substring without repeating characters
function slidingWindow(s: string): number {
  const seen = new Set<string>();  // # Track characters in current window
  let left = 0;                    // # Left edge of window
  let maxLen = 0;                  // # Best result found so far

  for (let right = 0; right < s.length; right++) {
    // # If character already in window, shrink from left until it is gone
    while (seen.has(s[right])) {
      seen.delete(s[left]);        // # Remove leftmost character
      left++;                      // # Shrink window
    }
    seen.add(s[right]);            // # Add new character to window
    maxLen = Math.max(maxLen, right - left + 1); // # Update best length
  }
  return maxLen;
}
\`\`\`

### Pattern 3: Binary Search

**When to use:** Sorted data, finding boundaries, or any problem where you can determine "is the answer in the left half or the right half?"

**How it works:** Repeatedly halve the search space by comparing the middle element. Each comparison eliminates half of the remaining possibilities — this is why binary search is O(log n). For 1 billion elements, binary search needs at most 30 comparisons.

**Recognition clues:**
- "Find X in a sorted array"
- "Find the first/last occurrence"
- "Find the minimum value that satisfies a condition" (binary search on the answer)
- "Search in rotated sorted array"

### Pattern 4: BFS (Breadth-First Search)

**When to use:** Shortest path in unweighted graphs, level-order traversal, finding the nearest node.

**How it works:** Explore all neighbours at the current depth before moving deeper. Uses a queue — process nodes in FIFO order, which guarantees that you visit closer nodes before distant ones.

The critical property: BFS guarantees the shortest path in an unweighted graph. The first time you reach a node, you have found the shortest path to it. This is because BFS explores all nodes at distance 1, then all at distance 2, then all at distance 3, and so on.

### Pattern 5: DFS (Depth-First Search)

**When to use:** Exploring all paths, detecting cycles, topological sorting, tree traversals, connected components.

**How it works:** Go as deep as possible along one path before backtracking. Uses recursion or an explicit stack.

DFS and BFS are complements. BFS finds the shortest path but uses more memory (it keeps the entire frontier in the queue). DFS uses less memory but does not guarantee the shortest path. Choose based on your problem: shortest path → BFS. All paths / cycle detection → DFS.

### Pattern 6: Dynamic Programming

**When to use:** Problems with overlapping subproblems and optimal substructure. If solving the problem naturally leads to solving the same smaller problems repeatedly, DP eliminates that redundancy.

**The three steps to any DP solution:**
1. Define the state — what variables describe a subproblem? (e.g., dp[i] = best answer considering the first i elements)
2. Write the recurrence — how does the current state relate to previous states? (e.g., dp[i] = max(dp[i-1], dp[i-2] + value[i]))
3. Define base cases — what are the trivial starting values? (e.g., dp[0] = 0, dp[1] = value[0])

**Recognition clues:**
- "Find the maximum/minimum"
- "Count the number of ways"
- "Is it possible to...?"
- "Longest/shortest subsequence"
- The same subproblem is solved multiple times

### Pattern 7: Greedy

**When to use:** When making the locally optimal choice at each step leads to the globally optimal solution.

**Warning:** Greedy does not always work. You must prove (or strongly intuit) that local optimal → global optimal. If unsure, use DP instead — it is always correct, just sometimes slower.

**Recognition clues:**
- "Maximum number of non-overlapping intervals" (sort by end time, always pick the earliest-ending)
- "Activity/job scheduling"
- "Minimum coins" (only works with certain denominations — use DP for arbitrary denominations)

### Pattern 8: Backtracking

**When to use:** Generate all combinations/permutations, constraint satisfaction, puzzle solving.

**How it works:** Try all possibilities systematically. When a choice leads to a dead end, undo it ("backtrack") and try the next option. It is DFS applied to a decision tree.

### Pattern Selection Flowchart

1. Is the input sorted (or can you sort it)? → **Two Pointers** or **Binary Search**
2. Does the problem involve contiguous elements? → **Sliding Window**
3. Is it a tree or graph problem?
   - Shortest path (unweighted)? → **BFS**
   - All paths / cycle detection? → **DFS**
4. Does it have overlapping subproblems? → **Dynamic Programming**
5. Can local optimal choices guarantee global optimal? → **Greedy**
6. Need to generate all possibilities? → **Backtracking**`,
      },
      {
        title: "Data Structures Quiz",
        slug: "data-structures-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Data Structures Quiz

<!--quiz
[
  {
    "question": "You need to implement a browser's back button. Which data structure is most appropriate?",
    "options": [
      "Array — store pages in order",
      "Queue — process pages FIFO",
      "Stack — the last page visited is the first one you go back to (LIFO)",
      "Hash Map — look up pages by URL"
    ],
    "correctIndex": 2,
    "explanation": "A stack (LIFO) is perfect for back/forward navigation. When you visit a new page, push it onto the stack. When you press back, pop the top page. The last page you visited is the first one you return to — exactly LIFO behaviour."
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
    "explanation": "A Hash Map (or Hash Set) provides O(1) average-case lookup, which is faster than the O(log n) of binary search or BST. At 10 million users, O(1) means ~1 operation vs O(log n) which means ~23 operations. Hash maps are the standard choice for existence checking and deduplication."
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
    "explanation": "A queue (FIFO — First In, First Out) processes items in the order they arrive, which is exactly what 'in the order they were received' means. A stack would process the newest first (unfair). A priority queue would be appropriate if tickets had different priority levels, but the question specifies 'in order received.'"
  },
  {
    "question": "You're building an autocomplete feature that suggests words as the user types. Which data structure is most efficient?",
    "options": [
      "Hash Map of all words",
      "Sorted Array with binary search",
      "Trie (prefix tree) — designed specifically for prefix-based lookups",
      "Linked List of words"
    ],
    "correctIndex": 2,
    "explanation": "A Trie is specifically designed for prefix-based lookups. When the user types 'pro', the Trie traverses p→r→o and returns all words below that node (program, product, process, etc.) in O(m) time where m is the prefix length. A hash map cannot efficiently find all words starting with a prefix — you would need to check every single key."
  },
  {
    "question": "What is the time complexity of inserting an element at the beginning of a regular array (not a linked list)?",
    "options": [
      "O(1) — just put it at index 0",
      "O(log n) — uses binary search to find position",
      "O(n) — must shift ALL existing elements one position right",
      "O(n²) — must shift and sort"
    ],
    "correctIndex": 2,
    "explanation": "Inserting at the beginning of an array requires shifting every existing element one position to the right to make room at index 0. If the array has n elements, that is n shift operations → O(n). This is why linked lists (O(1) insert at head) are preferred when frequent insertions at the beginning are needed."
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
    description: "Classic coding problems with step-by-step walkthroughs — brute force first, then optimal solutions with pattern explanations.",
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

### Examples

**Example 1:**
- Input: nums = [2, 7, 11, 15], target = 9
- Output: [0, 1]
- Because nums[0] + nums[1] = 2 + 7 = 9

**Example 2:**
- Input: nums = [3, 2, 4], target = 6
- Output: [1, 2]

### Hints

<details>
<summary>Hint 1</summary>
For each number, what are you looking for? If the target is 9 and the current number is 2, you need to find 7 (the complement).
</details>

<details>
<summary>Hint 2</summary>
What data structure gives O(1) lookup? Use a hash map to store numbers you have seen, then for each new number, check if its complement exists.
</details>

### Solution: Brute Force — O(n²)

Check every pair. Simple but slow.

\`\`\`typescript
// # Brute force: check every pair of numbers
function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {          // # First number
    for (let j = i + 1; j < nums.length; j++) {    // # Second number (after first)
      if (nums[i] + nums[j] === target) {           // # Do they add up?
        return [i, j];                               // # Found it
      }
    }
  }
  return [];  // # Should never reach here per constraints
}
\`\`\`

### Solution: Optimal (Hash Map) — O(n)

The key insight: for each number, you are looking for its complement (target - number). A hash map lets you check "have I seen the complement before?" in O(1).

\`\`\`typescript
// # Optimal: hash map stores seen numbers for O(1) complement lookup
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();  // # Map: number → its index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];    // # What number do I need?

    if (seen.has(complement)) {             // # Have I seen it before?
      return [seen.get(complement)!, i];    // # Return both indices
    }

    seen.set(nums[i], i);                  // # Store current number for future lookups
  }
  return [];
}
\`\`\`

### Why This Problem Matters

Two Sum is the most classic interview problem because it tests the most fundamental optimisation technique in computer science: trading space for time. The brute force uses O(1) space but O(n²) time. The hash map uses O(n) space but O(n) time. This space-time tradeoff appears in virtually every optimisation problem.

### Similar Problems

- Three Sum (Medium) — sort + two pointers
- Two Sum II — Input Array Is Sorted (use two pointers, not hash map)
- Subarray Sum Equals K (Medium) — prefix sum + hash map`,
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

### Examples

- \`"()"\` → true
- \`"()[]{}"\` → true
- \`"(]"\` → false
- \`"([)]"\` → false (brackets overlap incorrectly)
- \`"{[]}"\` → true (properly nested)

### Solution: Stack — O(n)

The insight: when you encounter a closing bracket, the most recently opened bracket must match it. "Most recently" = LIFO = stack.

\`\`\`typescript
// # Stack-based matching: push opens, pop and check on closes
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {  // # Map closing → opening
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);                    // # Opening bracket → push onto stack
    } else {
      // # Closing bracket → top of stack must be the matching opener
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
        return false;                      // # Mismatch or no opener → invalid
      }
      stack.pop();                         // # Match found → remove the opener
    }
  }

  return stack.length === 0;  // # Valid only if ALL brackets were matched
}
\`\`\`

### Why This Problem Matters

This is the canonical "use a stack" problem. Any problem involving matching, nesting, or "most recent" ordering is likely a stack problem. The pattern extends to: expression evaluation, HTML tag matching, and compiler syntax checking.`,
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

### Examples

- \`"abcabcbb"\` → 3 (the substring "abc")
- \`"bbbbb"\` → 1 (the substring "b")
- \`"pwwkew"\` → 3 (the substring "wke" — note "pwke" is a subsequence, not a substring)

### Solution: Sliding Window — O(n)

This is the classic sliding window problem. Maintain a window [left, right] of unique characters. Expand right to add characters. When a duplicate is found, shrink from the left until the duplicate is removed.

\`\`\`typescript
// # Sliding window: expand right, shrink left on duplicate
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();  // # Characters in current window
  let left = 0;                    // # Left edge of window
  let maxLen = 0;                  // # Best result found

  for (let right = 0; right < s.length; right++) {
    // # If this character is already in the window, shrink from left
    while (seen.has(s[right])) {
      seen.delete(s[left]);        // # Remove leftmost character
      left++;                      // # Move left edge forward
    }

    seen.add(s[right]);            // # Add new character to window
    maxLen = Math.max(maxLen, right - left + 1);  // # Update best length
  }
  return maxLen;
}
\`\`\`

### Why This Problem Matters

This is THE problem for learning the sliding window pattern. Once you understand this approach — maintaining a window, expanding and contracting — you can apply it to dozens of similar problems: maximum sum subarray, minimum window substring, longest repeating character replacement, and more.`,
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

Given the head of a singly linked list, reverse the list and return the new head.

### Example

Input: 1 → 2 → 3 → 4 → 5
Output: 5 → 4 → 3 → 2 → 1

### Solution: Iterative — O(n) time, O(1) space

The trick: use three pointers. At each step, reverse the current node's pointer, then advance all three pointers forward.

\`\`\`typescript
// # Iterative reversal: change each node's "next" to point backward
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;   // # Previous node (starts as null — new tail)
  let current = head;                  // # Current node being processed

  while (current !== null) {
    const next = current.next;  // # Save reference to next node BEFORE we break the link
    current.next = prev;        // # Reverse the pointer: point backward instead of forward
    prev = current;             // # Advance prev to current position
    current = next;             // # Advance current to next position
  }

  return prev;  // # prev is now the new head (was the last node)
}
\`\`\`

### Visualisation

\`\`\`
Step 0: null ← [prev]   1 → 2 → 3 → null
                        [curr]
Step 1: null ← 1        2 → 3 → null
              [prev]   [curr]
Step 2: null ← 1 ← 2    3 → null
                  [prev] [curr]
Step 3: null ← 1 ← 2 ← 3
                        [prev] [curr=null] → DONE
\`\`\`

### Why This Problem Matters

Reversing a linked list is one of the most common interview questions because it tests pointer manipulation — a skill that trips up many candidates. The iterative solution uses O(1) extra space and is preferred over the recursive solution (which uses O(n) stack space).`,
      },
      {
        title: "Easy — Maximum Subarray (Kadane's Algorithm)",
        slug: "easy-maximum-subarray",
        type: "exercise" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 5,
        content: `## Maximum Subarray — Kadane's Algorithm

### Problem

Given an integer array \`nums\`, find the contiguous subarray with the largest sum.

### Example

Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6 (the subarray [4, -1, 2, 1] has the largest sum)

### The Key Insight

At each position, you have exactly two choices: either extend the current subarray by including this element, or start a completely new subarray beginning at this element. Which is better? If the running sum is negative, starting fresh is always better — a negative prefix will only drag down whatever comes next.

### Solution: Kadane's Algorithm — O(n) time, O(1) space

\`\`\`typescript
// # Kadane's: at each position, extend or restart
function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];      // # Best sum found so far (global best)
  let currentSum = nums[0];  // # Sum of the current subarray (local best)

  for (let i = 1; i < nums.length; i++) {
    // # Decision: extend current subarray OR start fresh at nums[i]
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    // # Update global best if current subarray is better
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
\`\`\`

### Why This Problem Matters

Kadane's Algorithm is one of the most elegant algorithms in computer science. It reduces a seemingly complex problem (find the best subarray among O(n²) possibilities) to a single linear pass. The same "extend or restart" logic applies to: Best Time to Buy and Sell Stock, Maximum Product Subarray, and Maximum Sum Circular Subarray.`,
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

Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals.

### Example

Input: [[1,3], [2,6], [8,10], [15,18]]
Output: [[1,6], [8,10], [15,18]]
Because [1,3] and [2,6] overlap → merged into [1,6]

### The Key Insight

If you sort intervals by start time, overlapping intervals become adjacent. Then a single linear scan merges them: if the current interval's start is less than or equal to the last merged interval's end, they overlap — extend the merged interval. Otherwise, start a new merged interval.

### Solution: Sort + Linear Scan — O(n log n)

\`\`\`typescript
// # Sort by start time, then merge overlapping intervals in one pass
function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);  // # Sort by start time

  const merged: number[][] = [intervals[0]];  // # Start with the first interval

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];    // # Last merged interval
    const current = intervals[i];               // # Current interval

    if (current[0] <= last[1]) {
      // # Overlapping: extend the end of the last merged interval
      last[1] = Math.max(last[1], current[1]);
    } else {
      // # No overlap: add current interval as a new entry
      merged.push(current);
    }
  }

  return merged;
}
\`\`\`

### Why This Problem Matters

Interval merging appears everywhere in real software: calendar scheduling (find free time slots), resource allocation (merge overlapping bookings), time range queries (merge overlapping log entries), and IP range consolidation. The "sort then scan" technique is a powerful general pattern.`,
      },
      {
        title: "Hard — Trapping Rain Water",
        slug: "hard-trapping-rain-water",
        type: "exercise" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 30,
        order: 7,
        content: `## Trapping Rain Water

### Problem

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Example

Input: [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6

### The Key Insight

For each position, the water it can hold equals: min(max height to its left, max height to its right) minus its own height. Water is bounded by the shorter of the two walls.

The two-pointer approach avoids precomputing these maximums by working from both ends inward, maintaining running maximums as it goes.

### Solution: Two Pointers — O(n) time, O(1) space

\`\`\`typescript
// # Two pointers: track max heights from both sides, work inward
function trap(height: number[]): number {
  let left = 0;                         // # Left pointer
  let right = height.length - 1;        // # Right pointer
  let maxLeft = 0;                      // # Tallest bar seen from the left
  let maxRight = 0;                     // # Tallest bar seen from the right
  let water = 0;                        // # Total trapped water

  while (left < right) {
    if (height[left] < height[right]) {
      // # Left side is the bottleneck — process left position
      if (height[left] >= maxLeft) {
        maxLeft = height[left];         // # Update max (this bar is a wall, not a container)
      } else {
        water += maxLeft - height[left]; // # Water fills up to maxLeft
      }
      left++;
    } else {
      // # Right side is the bottleneck — process right position
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

### Why This Problem Matters

This is one of the most famous hard interview problems (common at Google and Amazon). It combines the two-pointer technique with a non-obvious insight about how constraints from both sides interact. Understanding this problem develops the ability to reason about bounded quantities — a skill that transfers to many other problems.`,
      },
      {
        title: "Coding Exercises Quiz",
        slug: "coding-exercises-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 8,
        content: `## Coding Pattern Recognition Quiz

<!--quiz
[
  {
    "question": "You need to find if there's a pair in a SORTED array that sums to a target. What's the optimal approach?",
    "options": [
      "Hash Map — O(n) time, O(n) space",
      "Two Pointers — O(n) time, O(1) space (optimal because the array is already sorted)",
      "Binary Search for each element — O(n log n)",
      "Nested loops — O(n²)"
    ],
    "correctIndex": 1,
    "explanation": "Since the array is SORTED, two pointers is optimal: start one at the beginning and one at the end. If sum < target, move left pointer right. If sum > target, move right pointer left. O(n) time and O(1) space — better than a hash map's O(n) space. The sorted order is what makes two pointers work; on an unsorted array, you'd need the hash map."
  },
  {
    "question": "You need to find the shortest path between two nodes in an unweighted graph. Which algorithm?",
    "options": [
      "DFS — explore all paths depth-first",
      "BFS — guarantees shortest path in unweighted graphs because it explores level by level",
      "Dijkstra's — shortest path for weighted graphs",
      "Dynamic Programming — break into subproblems"
    ],
    "correctIndex": 1,
    "explanation": "BFS guarantees the shortest path in an unweighted graph because it explores ALL nodes at distance 1 before ANY at distance 2. The first time you reach the target, you have found the shortest path. DFS might find a longer path first. Dijkstra's is for weighted graphs and is overkill for unweighted ones."
  },
  {
    "question": "A problem asks: 'Find the number of ways to climb n stairs if you can take 1 or 2 steps at a time.' What pattern is this?",
    "options": [
      "Greedy — always take the largest step possible",
      "Backtracking — try all combinations",
      "Dynamic Programming — overlapping subproblems: ways(n) = ways(n-1) + ways(n-2)",
      "Two Pointers — scan from both ends"
    ],
    "correctIndex": 2,
    "explanation": "This is classic DP (it is actually the Fibonacci sequence!). ways(n) = ways(n-1) + ways(n-2). The subproblems overlap: ways(5) needs ways(4) and ways(3), ways(4) needs ways(3) and ways(2) — ways(3) is computed twice without memoisation. Keywords 'number of ways' and optimal substructure are DP signals."
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
    "explanation": "Kadane's algorithm finds the maximum sum contiguous subarray in O(n). At each position, it decides: extend the current subarray or start fresh. If the running sum is negative, starting fresh is always better — a negative prefix always hurts. It is one of the most fundamental algorithms for interviews."
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
    description: "Classic system design problems with step-by-step walkthroughs — requirements, API, database, architecture, scaling, and trade-offs.",
    order: 3,
    sections: [
      {
        title: "Design a URL Shortener (Bitly)",
        slug: "design-url-shortener",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## System Design: URL Shortener (Bitly)

System design interviews test your ability to think at scale, make trade-offs, and communicate clearly about complex distributed systems. The URL shortener is the perfect starting problem because it is simple enough to understand immediately but deep enough to explore caching, database design, scaling, and distributed systems.

### Step 1: Requirements Clarification

Always start by asking clarifying questions. Never jump straight into architecture — interviewers want to see that you gather requirements before designing.

**Functional Requirements:**
- Given a long URL, generate a unique short URL
- Given a short URL, redirect to the original long URL
- Users can optionally set custom short URLs
- Short URLs expire after a configurable period (default: no expiry)

**Non-Functional Requirements:**
- Highly available (redirects must never fail — this IS the product)
- Low latency (< 100ms for redirects — users notice anything slower)
- Short URLs should not be predictable (security against enumeration)
- Scale: 100M new URLs/month, 10B redirects/month

### Step 2: Back-of-the-Envelope Estimation

This step demonstrates that you think quantitatively, not just qualitatively. Interviewers love this.

\`\`\`
Write throughput:
  100M new URLs/month ÷ 30 days ÷ 86,400 seconds ≈ 40 URLs/second

Read throughput:
  10B redirects/month ÷ 30 ÷ 86,400 ≈ 4,000 redirects/second

Read:Write ratio = 100:1 → read-heavy system (optimise for reads)

Storage (5-year projection):
  100M × 12 months × 5 years = 6 billion URLs
  Each URL record ≈ 500 bytes → 6B × 500 = 3TB total

Short URL length:
  Characters: [a-zA-Z0-9] = 62 options per character
  6 characters: 62⁶ = 56.8 billion possibilities (enough for 6B URLs)
\`\`\`

### Step 3: API Design

\`\`\`
POST /api/shorten
  Body: { longUrl: string, customAlias?: string, expiresAt?: string }
  Response: { shortUrl: string, longUrl: string, createdAt: string }

GET /{shortCode}
  Response: 302 Redirect to longUrl
  Why 302 (temporary) instead of 301 (permanent)?
    301 = browser caches the redirect permanently (faster for user, but we lose analytics)
    302 = browser always hits our server (slightly slower, but we can track every click)
    → Choose 302 for analytics, 301 if analytics are not needed

GET /api/stats/{shortCode}
  Response: { clicks: number, created: string, lastAccessed: string }
\`\`\`

### Step 4: Database Design

\`\`\`sql
-- # Main URL table: stores the short-to-long mapping
CREATE TABLE urls (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  short_code  VARCHAR(10) UNIQUE NOT NULL,  -- # The 6-char code (indexed for fast lookup)
  long_url    TEXT NOT NULL,                -- # The original URL
  user_id     BIGINT,                       -- # Who created it (nullable for anonymous)
  created_at  TIMESTAMP DEFAULT NOW(),
  expires_at  TIMESTAMP NULL,               -- # NULL = never expires
  click_count BIGINT DEFAULT 0
);

-- # Index on short_code: this is our primary lookup path
CREATE INDEX idx_short_code ON urls(short_code);
-- # Partial index for expiring URLs (only index rows that HAVE an expiry)
CREATE INDEX idx_expires_at ON urls(expires_at) WHERE expires_at IS NOT NULL;
\`\`\`

**Database choice:** PostgreSQL. The data is structured (fits relational model well), we need a unique constraint on short_code (SQL databases enforce this natively), and at 3TB total over 5 years, a single primary with read replicas handles this. For >10B URLs, consider sharding by short_code hash.

### Step 5: Short Code Generation

Three approaches, each with different trade-offs:

| Approach | How It Works | Pros | Cons |
|----------|-------------|------|------|
| Hash-based | MD5/SHA256 the URL, take first 6 chars | Deterministic, same URL → same code | Collisions possible, must handle them |
| Counter-based | Auto-increment → Base62 encode | No collisions, simple | Predictable (sequential), single point of failure |
| Pre-generated pool | Generate millions of random codes in advance | No collisions, fast, unpredictable | Extra storage, pool management needed |

**Recommended: Pre-generated key pool.** Generate millions of random 6-character codes in advance. Store them in a key pool table. When a new URL is created, pop a key from the pool. No collision risk, fast, and not predictable.

### Step 6: Architecture

\`\`\`
Client → Load Balancer → API Servers → Cache (Redis) → Database (PostgreSQL)
                                     ↑
                              Read path: cache first, DB on miss
                              Write path: DB first, then populate cache
\`\`\`

**Read path (redirect) — the hot path:**
1. User hits GET /{shortCode}
2. Check Redis cache → cache hit? Return 302 redirect immediately
3. Cache miss → query PostgreSQL → populate Redis → return 302
4. Increment click counter asynchronously (do not slow down the redirect)

**Write path (create short URL):**
1. POST /api/shorten with longUrl
2. Optionally check if longUrl already has a code (deduplication)
3. Pop a pre-generated code from the key pool
4. Insert into PostgreSQL
5. Add to Redis cache
6. Return shortUrl

### Step 7: Scaling Discussion

| Challenge | Solution |
|-----------|---------|
| High read volume (4K/s) | Redis cache (80/20 rule: 20% of URLs get 80% of traffic) + read replicas |
| Database growth (3TB) | Partition by short_code hash (range-based sharding) |
| Global latency | CDN for redirect responses + geo-distributed Redis clusters |
| Key generation at scale | Assign key ranges to each server (no coordination needed) |
| Analytics at scale | Separate analytics pipeline (Kafka → analytics database) |

### Step 8: Trade-off Summary

The interviewer wants to hear you reason about trade-offs, not memorise the "right" answer.

| Decision | Option A | Option B | Our Choice & Why |
|----------|---------|---------|-----------------|
| Redirect code | 301 (browser caches) | 302 (always hits server) | 302 — need click analytics |
| Database | SQL (consistency) | NoSQL (horizontal scale) | SQL — structured data, unique constraint, sufficient scale |
| Short code length | 6 chars (56B options) | 8 chars (218T options) | 6 — enough for 5+ years |
| Cache strategy | Cache everything | Cache hot URLs (LRU) | LRU — cost-effective, 20% cache covers 80% of traffic |`,
      },
      {
        title: "Design a Chat Application (WhatsApp)",
        slug: "design-chat-app",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## System Design: Chat Application (WhatsApp)

Chat systems are among the most demanding distributed systems to design. They require real-time delivery, guaranteed ordering, offline message handling, and extreme scale — WhatsApp handles over 100 billion messages per day. This design problem tests your understanding of WebSockets, message queues, database partitioning, and push notifications.

### Requirements

**Functional:**
- One-on-one messaging (the core feature)
- Group chats (up to 256 members)
- Online/offline status indicators
- Message delivery receipts (sent → delivered → read)
- Media sharing (images, videos, documents)

**Non-Functional:**
- Real-time messaging (< 100ms latency for online users)
- Message ordering guaranteed within a conversation
- At-least-once delivery (no lost messages — this is critical for trust)
- Support 1B+ daily active users
- Messages stored for 30 days on server, permanently on device

### Back-of-the-Envelope

\`\`\`
1B DAU × 40 messages/user/day = 40 billion messages/day
40B ÷ 86,400 seconds = ~460,000 messages/second
Average message: 100 bytes → 40B × 100 = 4TB/day of new messages
Media: ~10% of messages have attachments → 4 billion media files/day
\`\`\`

### Architecture

\`\`\`
Client ←→ WebSocket Server ←→ Message Queue (Kafka) ←→ Chat Service
                                                          ↓
                                              Message Database (Cassandra)
                                              Notification Service (push)
                                              Media Service (blob storage)
\`\`\`

**Why WebSockets?** HTTP is request-response: the client must ask "any new messages?" repeatedly (polling). WebSockets maintain a persistent, bidirectional connection — the server can push messages to the client instantly without the client asking. This is essential for real-time chat.

**Connection Manager:** Maps userId → which WebSocket server they are connected to. When User A sends a message to User B, the system needs to know which server B is on so it can forward the message.

**Message Queue (Kafka):** Decouples message sending from delivery. If User B's server is temporarily overloaded or B is offline, the message is safely stored in Kafka until it can be delivered. This guarantees at-least-once delivery.

### Message Flow

**Sending a message (User A → User B):**
1. User A sends message via their WebSocket connection
2. A's WebSocket server generates a messageId and timestamp
3. Server publishes message to Kafka topic for B's conversation
4. Server returns a "sent" receipt (single tick ✓) to User A
5. Chat Service consumes from Kafka:
   - Stores message in Cassandra (durability)
   - Looks up User B's WebSocket server in Connection Manager
   - **If B is online:** forward message via B's WebSocket → return "delivered" receipt (double tick ✓✓) to A
   - **If B is offline:** send push notification via APNs/FCM
6. When B opens the chat and sees the message → "read" receipt (blue ticks) sent to A

**Group message fan-out:**
The message is written once to the group's Kafka topic. The Chat Service fans out to each member's inbox. Only online members receive real-time delivery; offline members see messages when they reconnect and sync.

### Database Choice: Why Cassandra?

| Requirement | Why Cassandra Fits |
|-------------|-------------------|
| Write-heavy (460K msg/s) | Cassandra excels at writes — distributed, no single bottleneck |
| Partition by conversation | Natural partition key: conversationId. All messages for a chat live on the same nodes |
| Time-ordered within partition | Clustering key: timestamp. Messages are automatically ordered |
| Horizontal scaling | Add nodes to handle more data — no downtime, automatic rebalancing |

### Key Trade-offs

| Decision | Our Choice | Why |
|----------|-----------|-----|
| Protocol | WebSocket | Real-time bidirectional, low overhead per message |
| Message DB | Cassandra | Write-optimised, partition by conversation, time-ordered |
| Queue | Kafka | Durable, ordered, handles 460K msg/s, replay capability |
| Media storage | S3/Blob storage | Cheap, scalable, CDN-friendly for global delivery |
| Encryption | End-to-end | Privacy requirement, but prevents server-side search/moderation |`,
      },
      {
        title: "Design a Rate Limiter",
        slug: "design-rate-limiter",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 3,
        content: `## System Design: Rate Limiter

A rate limiter controls how many requests a client can make within a time window. Every production API needs one. Without rate limiting, a single misbehaving client (or attacker) can overwhelm your servers, exhaust your resources, and bring down the service for everyone.

### Why Rate Limiting Matters

- **Prevent abuse:** DDoS attacks, brute-force login attempts, scraping
- **Control costs:** Expensive operations (AI inference, payment processing) must be budgeted
- **Ensure fairness:** Shared resources should not be monopolised by one client
- **Protect downstream services:** Your API might be fine at 10K req/s, but the database behind it might not

### Rate Limiting Algorithms

**1. Token Bucket (Most Common)**

Imagine a bucket that fills with tokens at a steady rate (e.g., 1 token per second). The bucket has a maximum capacity (e.g., 10 tokens). Each request consumes one token. If the bucket is empty, the request is rejected.

This algorithm naturally allows bursts: if a client has been quiet, their bucket is full, and they can make 10 requests immediately. But sustained traffic is limited to the refill rate (1/second). This is usually the desired behaviour — allow short bursts but limit sustained load.

**2. Sliding Window Counter**

Count requests in a sliding time window. More accurate than fixed windows because it avoids the boundary problem.

\`\`\`typescript
// # Sliding window: count requests in the last N seconds using a Redis sorted set
async function isAllowed(
  userId: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowMs;  // # Beginning of the time window

  // # Count requests within the window
  const count = await redis.zcount(\`ratelimit:\${userId}\`, windowStart, now);

  if (count >= limit) return false;    // # Over the limit → reject

  // # Record this request (score = timestamp, member = unique ID)
  await redis.zadd(\`ratelimit:\${userId}\`, now, \`\${now}-\${Math.random()}\`);
  // # Clean up old entries outside the window
  await redis.zremrangebyscore(\`ratelimit:\${userId}\`, 0, windowStart);

  return true;  // # Under the limit → allow
}
\`\`\`

**3. Fixed Window Counter**

Count requests per fixed time window (e.g., "100 requests per minute, resetting at :00"). Simplest to implement, but has a boundary problem: a client can send 100 requests at 0:59 and another 100 at 1:01 — 200 requests in 2 seconds while technically respecting the "100 per minute" limit.

### Architecture

\`\`\`
Client → Load Balancer → Rate Limiter (middleware) → Backend API
                              ↓
                         Redis (shared counters)
\`\`\`

The rate limiter sits in front of your API, either as middleware in your application or as a separate service at the API gateway level. Redis provides the shared counter — all API server instances check the same counter, so a client cannot bypass the limit by hitting different servers.

### Response Headers

When rate limiting, always tell the client their status:

\`\`\`
X-RateLimit-Limit: 100          // # Maximum requests per window
X-RateLimit-Remaining: 87       // # How many requests left
X-RateLimit-Reset: 1625097600   // # When the window resets (Unix timestamp)
Retry-After: 30                 // # Seconds to wait before retrying (on 429 response)
\`\`\`

### Rate Limit Configuration

Different endpoints need different limits based on cost and sensitivity:

| Endpoint | Limit | Window | Why |
|----------|-------|--------|-----|
| General API | 100 requests | 1 minute | Standard protection |
| Login | 5 attempts | 5 minutes | Prevent brute force |
| AI generation | 10 requests | 1 hour | Expensive compute |
| File upload | 20 uploads | 1 hour | Resource-heavy |
| Password reset | 3 requests | 15 minutes | Security-sensitive |

### Distributed Rate Limiting

With multiple API servers, the counter MUST be shared. If each server tracks its own count, a client hitting 3 different servers gets 3x the allowed rate. Redis solves this — all servers read/write the same key. Use Redis MULTI/EXEC or Lua scripts to make the check-and-increment atomic (avoid race conditions).`,
      },
      {
        title: "System Design Quiz",
        slug: "system-design-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 4,
        content: `## System Design Quiz

<!--quiz
[
  {
    "question": "You're designing a URL shortener. Should you use 301 (permanent) or 302 (temporary) redirects?",
    "options": [
      "301 — faster because the browser caches it and never hits your server again",
      "302 — the browser always contacts your server, which lets you track click analytics and change the target URL later",
      "It doesn't matter — both accomplish the same redirect",
      "Use 200 with a meta refresh tag instead"
    ],
    "correctIndex": 1,
    "explanation": "302 (temporary redirect) means the browser always contacts your server for each click. This enables: (1) click analytics — you can count every visit, (2) URL updates — you can change where the short URL points to, (3) expiration — you can stop redirecting after the TTL. 301 is faster for users but you lose analytics and control. Most URL shorteners (Bitly, TinyURL) use 302 or 307."
  },
  {
    "question": "In a chat system like WhatsApp, why is Kafka used between the WebSocket servers and the chat service?",
    "options": [
      "Kafka encrypts messages for security",
      "Kafka provides durable, ordered message delivery — if the recipient's server is down, messages are safely stored until they can be delivered",
      "Kafka is faster than direct server-to-server communication",
      "Kafka compresses messages to save bandwidth"
    ],
    "correctIndex": 1,
    "explanation": "Kafka decouples message production from consumption. Benefits: (1) Durability — if the recipient's WebSocket server crashes, messages are safely stored in Kafka (not lost), (2) Ordering — messages within a partition are strictly ordered, (3) Backpressure — if the chat service is overwhelmed, messages queue in Kafka instead of being dropped, (4) Replay — if a consumer fails, it can re-read messages from where it left off."
  },
  {
    "question": "Your rate limiter uses a fixed window counter (100 requests per minute). A user sends 100 requests at 11:59:59 and another 100 at 12:00:01. What happens?",
    "options": [
      "The second batch is rejected — 200 total requests exceeds the limit",
      "Both batches are allowed — each falls within a different minute window. The user effectively sent 200 requests in 2 seconds while 'respecting' the limit",
      "The rate limiter crashes from the burst",
      "Only 50 of the second batch are allowed"
    ],
    "correctIndex": 1,
    "explanation": "This is the boundary problem with fixed window counters. The window resets at the minute boundary, so 100 requests at 11:59:59 and 100 at 12:00:01 are each within their respective windows. The user sends 200 requests in 2 seconds while technically respecting the '100 per minute' rule. Sliding window counters fix this by looking at the actual last 60 seconds, not calendar minutes."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Code Architecture
     ============================================================ */
  {
    name: "Code Architecture",
    slug: "code-architecture",
    description: "SOLID principles, design patterns, clean code practices — all with TypeScript examples and real-world context.",
    order: 4,
    sections: [
      {
        title: "SOLID Principles",
        slug: "solid-principles",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## SOLID Principles

SOLID is a set of five design principles that help you write code that is maintainable, extensible, and testable. They are not rules to follow blindly — they are guidelines that become intuitive with experience. The goal is not "SOLID-compliant code" — it is code that is easy to change, easy to test, and easy to understand.

Think of SOLID like the principles of good architecture in buildings. A well-designed building separates electrical, plumbing, and structural systems so that you can rewire the electricity without tearing down a wall. SOLID does the same for software — it separates concerns so that changing one part does not break unrelated parts.

### S — Single Responsibility Principle

**One class (or function) should have one reason to change.**

This does not mean a class should have only one method. It means a class should serve one purpose, one area of responsibility. If changes to email templates require modifying the same class as changes to user database queries, those two concerns are tangled together — and tangling means risk.

**Bad — UserService does four unrelated things:**
\`\`\`typescript
// # This class has FOUR reasons to change:
// # 1. User creation logic changes
// # 2. Email templates or provider changes
// # 3. Report format changes
// # 4. Password rules change
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
  sendWelcome(user: User): void { /* email logic only */ }
}

class ReportGenerator {
  generateUserReport(users: User[]): PDF { /* reporting only */ }
}

class PasswordValidator {
  validate(password: string): ValidationResult { /* validation only */ }
}
\`\`\`

**Why it matters in practice:** When you need to switch email providers (from SendGrid to Resend), you only touch EmailService. No risk of accidentally breaking user creation, reporting, or password validation. The blast radius of any change is contained.

### O — Open/Closed Principle

**Open for extension, closed for modification.** You should be able to add new behaviour without changing existing, tested code.

**Bad — adding a new payment method requires modifying the function:**
\`\`\`typescript
// # Every new payment method requires editing this function
// # and risking breakage of existing payment methods
function processPayment(method: string, amount: number) {
  if (method === "credit_card") { /* credit card logic */ }
  else if (method === "paypal") { /* paypal logic */ }
  else if (method === "crypto") { /* crypto logic — had to MODIFY existing code! */ }
}
\`\`\`

**Good — new payment methods are added by creating new classes, not modifying existing ones:**
\`\`\`typescript
// # Define the contract
interface PaymentProcessor {
  process(amount: number): PaymentResult;
}

// # Each implementation is independent — adding one never touches another
class CreditCardProcessor implements PaymentProcessor {
  process(amount: number) { /* credit card logic */ }
}

class PayPalProcessor implements PaymentProcessor {
  process(amount: number) { /* paypal logic */ }
}

// # Adding crypto — ZERO existing code modified
class CryptoProcessor implements PaymentProcessor {
  process(amount: number) { /* crypto logic */ }
}
\`\`\`

### L — Liskov Substitution Principle

**Subtypes must be substitutable for their base types without breaking the program.**

If your code works with a base class, it should work with ANY subclass without surprises. The classic violation: Square extends Rectangle, but setting width on a Square also changes height — breaking code that assumes width and height are independent.

### I — Interface Segregation Principle

**No client should be forced to depend on methods it does not use.**

\`\`\`typescript
// # Bad: one fat interface forces Robot to implement eat() and sleep()
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// # Good: split into focused interfaces
interface Workable { work(): void; }
interface Feedable { eat(): void; }

class HumanWorker implements Workable, Feedable {
  work() { }
  eat() { }
}

class RobotWorker implements Workable {
  work() { }  // # Robot only implements what makes sense
}
\`\`\`

### D — Dependency Inversion Principle

**High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).**

\`\`\`typescript
// # Bad — tightly coupled to specific implementations
class OrderService {
  private db = new PostgresDatabase();    // # Locked to Postgres
  private mailer = new SendGridMailer();  // # Locked to SendGrid
}

// # Good — depends on abstractions, implementations injected
interface Database { insert(table: string, data: any): void; }
interface Mailer { send(to: string, body: string): void; }

class OrderService {
  constructor(
    private db: Database,      // # Any database works
    private mailer: Mailer     // # Any mailer works
  ) {}
}

// # Production: real implementations
new OrderService(new PostgresDatabase(), new SendGridMailer());
// # Testing: mock implementations
new OrderService(new MockDatabase(), new MockMailer());
\`\`\`

### When SOLID Goes Too Far

SOLID principles are guidelines, not laws. Over-applying them creates "architecture astronaut" code — dozens of tiny classes, interfaces for everything, and layers of abstraction that make simple operations hard to follow. Apply SOLID when you feel the pain of NOT applying it: duplicate code, hard-to-test classes, changes rippling through many files. Do not pre-apply it to code that is simple and unlikely to change.`,
      },
      {
        title: "Design Patterns in TypeScript",
        slug: "design-patterns-typescript",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## Design Patterns in TypeScript

Design patterns are reusable solutions to common software design problems. They are not code you copy-paste — they are architectural templates that you adapt to your specific situation. You do not need to memorise all 23 Gang of Four patterns. Learn the ones that appear in real codebases.

### Strategy Pattern

**Problem:** You need different algorithms or behaviours that can be swapped at runtime without changing the code that uses them.

**Real-world analogy:** A GPS app lets you choose your navigation strategy — shortest route, fastest route, avoid tolls. The navigation engine does not change; only the route calculation strategy changes.

\`\`\`typescript
// # 1. Define the strategy interface — the contract
interface SortStrategy {
  sort(data: number[]): number[];
}

// # 2. Implement concrete strategies — each one is independent
class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    return [...data].sort((a, b) => a - b);  // # Quick sort implementation
  }
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  // # Swap
        }
      }
    }
    return arr;
  }
}

// # 3. Context uses ANY strategy through the interface
class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy) {
    this.strategy = strategy;  // # Swap algorithm at runtime
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);  // # Delegates to the current strategy
  }
}

// # Usage: swap algorithms without changing the Sorter
const sorter = new Sorter(new QuickSort());
sorter.sort([3, 1, 2]);  // # Uses QuickSort

sorter.setStrategy(new BubbleSort());
sorter.sort([3, 1, 2]);  // # Now uses BubbleSort — zero code changes
\`\`\`

**Where you will see this:** Payment processing (Stripe/PayPal/Crypto), authentication methods (JWT/Session/OAuth), notification channels (email/SMS/push), pricing calculations (flat/tiered/usage-based).

### Observer Pattern

**Problem:** When one object changes state, multiple other objects need to be notified and updated automatically — without tight coupling between them.

**Real-world analogy:** A YouTube channel has subscribers. When the channel uploads a new video, every subscriber is notified. The channel does not know who its subscribers are or what they do with the notification — it just broadcasts.

\`\`\`typescript
// # Type-safe event emitter using generics
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
}

// # Define event types for type safety
type AppEvents = {
  "user:created": { id: string; email: string };
  "order:placed": { orderId: string; total: number };
};

const events = new EventEmitter<AppEvents>();

// # Multiple independent listeners for the same event
events.on("user:created", (user) => sendWelcomeEmail(user.email));
events.on("user:created", (user) => createDefaultSettings(user.id));
events.on("user:created", (user) => trackAnalytics("signup", user.id));

// # Emitting the event notifies ALL listeners
events.emit("user:created", { id: "123", email: "jane@example.com" });
\`\`\`

**Where you will see this:** React state management, Node.js EventEmitter, DOM events, WebSocket messages, pub/sub systems.

### Factory Pattern

**Problem:** Create objects without the caller needing to know the specific class being instantiated.

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

// # Factory function: caller specifies WHAT, factory decides HOW
function createNotification(type: "email" | "sms"): Notification {
  switch (type) {
    case "email": return new EmailNotification();
    case "sms": return new SMSNotification();
  }
}

// # Caller does not know or care about the concrete class
const notifier = createNotification("email");
notifier.send("Hello!", "jane@example.com");
\`\`\`

### Pattern Decision Guide

| Problem | Pattern | Example |
|---------|---------|---------|
| Swap algorithms at runtime | Strategy | Payment processor, sort algorithm |
| Notify multiple listeners of changes | Observer | Event system, pub/sub |
| Create objects without knowing exact type | Factory | Notification type, database driver |
| Ensure exactly one instance | Singleton | Database connection, logger |
| Add behaviour to objects dynamically | Decorator | Logging middleware, auth wrapper |
| Simplify a complex subsystem | Facade | Payment gateway SDK, email service |`,
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
      "Single Responsibility — each payment method gets its own class",
      "Open/Closed — new methods should be added WITHOUT modifying existing code",
      "Dependency Inversion — depend on a PaymentProcessor interface, not concrete classes",
      "All of the above work together — SRP isolates each method, O/C allows extension without modification, DIP ensures loose coupling"
    ],
    "correctIndex": 3,
    "explanation": "All three work together: Open/Closed says add new payment types without modifying existing code. Single Responsibility says each payment type is its own class with one reason to change. Dependency Inversion says the payment service depends on a PaymentProcessor interface, not on CreditCardProcessor directly. This lets you add PayPal without touching a single line of existing code."
  },
  {
    "question": "You need to send notifications via email, SMS, or push depending on user preferences, and the preference can change at runtime. Which design pattern?",
    "options": [
      "Singleton — one notification instance",
      "Strategy — define a NotificationStrategy interface, swap implementations at runtime",
      "Observer — broadcast to all channels",
      "Factory — create the right notification type"
    ],
    "correctIndex": 1,
    "explanation": "Strategy pattern: define a NotificationStrategy interface with a send() method. Implement EmailStrategy, SMSStrategy, PushStrategy. The notification service accepts any strategy and uses it without knowing the implementation details. The strategy can be selected based on user preferences at runtime and swapped without changing the notification service code."
  },
  {
    "question": "What's wrong with this class from a SOLID perspective? class UserService { register(), sendVerificationEmail(), generateAvatar(), createBillingAccount() }",
    "options": [
      "Nothing — all methods relate to users",
      "Violates Single Responsibility — the class has 4 unrelated reasons to change (user creation, email, avatar, billing)",
      "Violates Open/Closed — can't extend without modifying",
      "Violates Interface Segregation — clients must depend on all methods"
    ],
    "correctIndex": 1,
    "explanation": "This violates Single Responsibility. UserService has 4 distinct areas of change: (1) registration logic, (2) email templates/delivery, (3) avatar generation, (4) billing integration. If the email provider changes, you modify UserService. If billing changes, you modify UserService. Each change risks breaking unrelated functionality. Split into: UserRepository, EmailService, AvatarService, BillingService."
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
    description: "Unit testing patterns, integration testing, TDD, mocking strategy, and building a testing culture.",
    order: 5,
    sections: [
      {
        title: "Testing Fundamentals",
        slug: "testing-fundamentals",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 45,
        order: 1,
        content: `## Testing Fundamentals

Good tests are the difference between "I am confident this deploy will not break anything" and "let me deploy on Friday afternoon and pray." Tests are not just a safety net — they are a design tool. Code that is easy to test is usually well-designed code. Code that is hard to test is usually poorly designed.

### The Testing Pyramid

The testing pyramid tells you how many of each type of test to write:

\`\`\`
        /\\
       /  \\         E2E Tests (few — slow, expensive, brittle)
      /    \\        Test complete user flows through the real UI
     /------\\
    /        \\      Integration Tests (moderate — test real connections)
   /          \\     Test components working together (API + DB, service + service)
  /------------\\
 /              \\   Unit Tests (many — fast, cheap, reliable)
/                \\  Test individual functions and classes in isolation
\\________________/
\`\`\`

**Unit tests** are the foundation. They test individual functions and classes in isolation — no database, no network, no file system. They run in milliseconds and tell you exactly what broke. You should have hundreds or thousands of them.

**Integration tests** verify that components work together correctly. Does your API route actually query the database and return the right response? Does your authentication middleware correctly block unauthenticated requests? These are slower (they hit real databases or APIs) but catch issues that unit tests miss.

**E2E (End-to-End) tests** simulate real user behaviour through the actual UI. "Click the signup button, fill in the form, submit, verify the welcome page appears." These are the most realistic but also the slowest, most expensive, and most brittle. Write few but critical ones.

### The AAA Pattern (Arrange, Act, Assert)

Every test follows this three-step structure:

\`\`\`typescript
test("calculates total with tax correctly", () => {
  // # ARRANGE — set up the test data and preconditions
  const cart = new ShoppingCart();
  cart.addItem({ name: "Book", price: 20 });
  cart.addItem({ name: "Pen", price: 5 });
  const taxRate = 0.1;  // # 10% tax

  // # ACT — execute the function being tested
  const total = cart.calculateTotal(taxRate);

  // # ASSERT — verify the result is correct
  expect(total).toBe(27.5);  // # (20 + 5) × 1.1 = 27.5
});
\`\`\`

This pattern makes tests readable: even someone who has never seen the codebase can understand what is being tested, how, and what the expected result is.

### Test Behaviour, Not Implementation

This is the single most important testing principle. Test WHAT the code does (its outputs and side effects), not HOW it does it internally.

**Bad — testing implementation details:**
\`\`\`typescript
// # This test breaks if you change the sorting algorithm,
// # even though the output is still correct
test("sorts using quicksort", () => {
  const spy = jest.spyOn(sorter, "quicksort");
  sorter.sort([3, 1, 2]);
  expect(spy).toHaveBeenCalled();  // # Who cares HOW it sorts?
});
\`\`\`

**Good — testing behaviour:**
\`\`\`typescript
// # This test passes regardless of which algorithm is used internally
test("sorts array in ascending order", () => {
  expect(sorter.sort([3, 1, 2])).toEqual([1, 2, 3]);
});
\`\`\`

The bad test is brittle — it breaks when you change the internal algorithm, even though the function still works correctly. The good test only breaks when the function's actual behaviour changes.

### Testing Edge Cases

The most valuable tests are often edge case tests. Happy path tests ("normal inputs produce normal outputs") catch obvious bugs. Edge case tests catch the subtle bugs that make it to production.

\`\`\`typescript
describe("findMax", () => {
  test("returns max of positive numbers", () => {
    expect(findMax([3, 7, 2, 9, 1])).toBe(9);       // # Happy path
  });

  test("handles single element", () => {
    expect(findMax([42])).toBe(42);                   // # Edge: only one element
  });

  test("handles negative numbers", () => {
    expect(findMax([-5, -2, -8])).toBe(-2);           // # Edge: all negative
  });

  test("handles duplicates", () => {
    expect(findMax([5, 5, 5])).toBe(5);               // # Edge: all same
  });

  test("throws on empty array", () => {
    expect(() => findMax([])).toThrow("Array cannot be empty");  // # Edge: empty input
  });
});
\`\`\`

### Mocking Strategy

Mocks replace real dependencies (database, API, file system) with controlled substitutes. They make unit tests fast and isolated. But they have a critical limitation: mocks test that your code works IF the dependency behaves as expected. They do not catch mismatches between your mock and the real dependency.

**Rule of thumb:**
- **Unit tests:** mock external dependencies (database, APIs, file system)
- **Integration tests:** use real dependencies (test database, test API server)
- **Never mock what you own** — if you wrote the function, test it with real inputs, not a mock

### What to Test vs. What Not to Test

| Test This | Do NOT Test This |
|-----------|-----------------|
| Business logic (calculations, validations, transformations) | Framework code (React renders, Express routing) |
| Edge cases and error handling | Simple getters/setters with no logic |
| API contract (request/response shapes) | Configuration files |
| Regression tests (bugs that were fixed) | Third-party library internals |
| Security-critical paths (auth, input validation) | CSS styling details |

### Coverage Target

Aim for 80% code coverage on business logic. 100% coverage is usually counterproductive — the last 20% often involves testing trivial code (getters, configuration) that provides no value but makes tests brittle and slow. Focus coverage on the code where bugs would cause the most damage: business logic, security, and data processing.`,
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
      "Just test calculateDiscount(100, 10) = 90 — one happy path test is enough",
      "Normal case (100, 10), zero discount (100, 0), full discount (100, 100), negative price, percentage > 100, and decimal edge cases",
      "Only test with random values to cover more scenarios",
      "Only test the cases listed in the requirements document"
    ],
    "correctIndex": 1,
    "explanation": "Good unit tests cover: (1) happy path (100, 10 → 90), (2) boundary cases (0% discount → no change, 100% discount → free), (3) invalid inputs (negative price — should it throw? percentage > 100 — is that allowed?), (4) decimal precision (10.5% of 99.99). Edge case tests catch the bugs that make it to production. A single happy-path test gives false confidence."
  },
  {
    "question": "Your test mocks the database and all API calls. Every test passes. But the feature is broken in production. What went wrong?",
    "options": [
      "The test framework has a bug",
      "Mocks matched the EXPECTED behaviour but not the ACTUAL behaviour of the real dependencies — you need integration tests that use real services",
      "The test was too thorough",
      "Production has different hardware"
    ],
    "correctIndex": 1,
    "explanation": "Mocks verify that your code works IF the dependency behaves as mocked. But mocks do not catch: schema mismatches (database returns different column names), API behaviour changes (vendor updated their API), query errors (your SQL has a typo), connection handling issues, or data format differences. You need integration tests that hit a real (test) database and real (test) APIs to catch these mismatches."
  },
  {
    "question": "You have 95% test coverage but bugs keep shipping. What's most likely wrong?",
    "options": [
      "You need 100% coverage",
      "High coverage ≠ good tests — you're probably testing implementation details instead of behaviour and missing critical edge cases",
      "The test framework is unreliable",
      "You need more E2E tests instead of unit tests"
    ],
    "correctIndex": 1,
    "explanation": "Coverage measures which lines RUN during tests, not whether they are tested CORRECTLY. Common problems: (1) tests that assert nothing meaningful ('expect(true).toBe(true)'), (2) tests that mirror implementation details instead of testing behaviour, (3) edge cases not tested even though normal paths are covered, (4) tests that do not check error handling. Quality over quantity — one well-designed edge-case test catches more bugs than ten trivial happy-path tests."
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
    description: "Git workflows, CI/CD pipelines, Docker, deployment strategies, monitoring, and the DevOps mindset.",
    order: 6,
    sections: [
      {
        title: "Git, CI/CD, and Deployment",
        slug: "git-cicd-deployment",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 45,
        order: 1,
        content: `## Git, CI/CD, and Modern Deployment

DevOps is not a job title — it is a culture. It means developers and operations teams work together to automate everything between writing code and that code running in production. The goal: deploy confidently, frequently, and safely. A mature DevOps team deploys multiple times per day without drama. An immature team treats every deployment as a risky event requiring a war room.

### Git — Version Control That Enables Everything Else

Git is the foundation of all modern software collaboration. Every CI/CD pipeline, every code review, and every deployment starts with Git. Understanding Git is not optional — it is as fundamental as understanding how to use a text editor.

**The Three Areas of Git:**

1. **Working Directory** — the files you see and edit on disk
2. **Staging Area** — files you have marked for the next commit (\`git add\`)
3. **Repository** — the committed history (what gets pushed to the remote)

\`\`\`
Working Directory → git add → Staging Area → git commit → Repository → git push → Remote
\`\`\`

**Essential Commands Every Engineer Uses Daily:**

| Command | What It Does |
|---------|-------------|
| \`git status\` | Show what has changed, what is staged, what is untracked |
| \`git add file.ts\` | Stage a specific file for the next commit |
| \`git commit -m "message"\` | Create a snapshot of staged changes |
| \`git log --oneline\` | See commit history in compact format |
| \`git diff\` | See what has changed but NOT yet staged |
| \`git diff --staged\` | See what IS staged and will be committed |
| \`git stash\` | Temporarily save uncommitted changes (like a clipboard for code) |
| \`git stash pop\` | Restore stashed changes |

### Branching Strategies

**Git Flow (structured teams, release-based):**
- \`main\` — production code, always deployable, protected
- \`develop\` — integration branch for the next release
- \`feature/xyz\` — one branch per feature, branched from develop
- \`hotfix/xyz\` — urgent production fixes, branched from main

**Trunk-Based (modern teams, continuous deployment):**
- \`main\` — everyone works here via very short-lived branches (hours, not weeks)
- Feature branches live less than 1 day before merging
- Incomplete features hidden behind feature flags
- This is what Google, Netflix, and most high-performing teams use

### Commit Messages That Help

\`\`\`
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore
\`\`\`

**Good examples:**
- \`feat(auth): add Google OAuth login\`
- \`fix(cart): prevent negative quantity on decrement\`
- \`refactor(user): extract validation into separate module\`

**Bad examples:**
- \`fix bug\` — which bug? Where? Why?
- \`changes\` — what changes? This tells nobody anything.
- \`WIP\` — do not commit work-in-progress to shared branches

### CI/CD — Continuous Integration / Continuous Deployment

**Continuous Integration (CI):** Every time a developer pushes code, automated checks run — linting, type checking, unit tests, integration tests. If any check fails, the team is notified immediately and the merge is blocked. CI catches bugs before they reach production.

**Continuous Deployment (CD):** After CI passes, the code is automatically deployed to production (or staging, depending on the pipeline). This means every merged PR reaches users within minutes, not weeks.

**A typical CI/CD pipeline:**

\`\`\`
Push code → Lint check → Type check → Unit tests →
  → Integration tests → Build → Deploy to staging →
  → Smoke tests on staging → Deploy to production
\`\`\`

Each step is a gate. If linting fails, the pipeline stops. If tests fail, the pipeline stops. Code only reaches production if EVERY gate passes.

### Docker — Consistent Environments

The most common deployment problem: "It works on my machine but not in production." This happens because your machine has different software versions, environment variables, operating system settings, or installed packages than the production server.

Docker solves this by packaging your application AND its entire environment (operating system, dependencies, configuration) into a container. The container runs identically everywhere — your laptop, the CI server, staging, and production.

\`\`\`dockerfile
# # Multi-stage Docker build: build in one stage, run in a smaller one
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                          # # Install dependencies (deterministic)
COPY . .
RUN npm run build                   # # Build the application

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist        # # Copy only the built output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]       # # Start the application
\`\`\`

**Why multi-stage builds?** The builder stage has all build tools (TypeScript compiler, dev dependencies). The runner stage has only what is needed to RUN the app. This makes the production image smaller (faster to deploy, smaller attack surface).

### Deployment Strategies

| Strategy | How It Works | Risk Level | When to Use |
|----------|-------------|------------|-------------|
| **Rolling** | Replace instances one at a time | Low | Default for most services |
| **Blue/Green** | Run old and new versions side by side, switch traffic instantly | Very low (instant rollback) | Critical services, databases |
| **Canary** | Send 5% of traffic to the new version first, gradually increase | Very low | High-traffic services, risky changes |
| **Recreate** | Stop all old instances, start new ones | High (downtime) | Only for dev/staging environments |

### Monitoring — What to Watch After Deployment

Deploying code is not the end — it is the beginning. You need to monitor the deployed code to catch issues that tests did not find.

**The Four Golden Signals (from Google SRE):**

1. **Latency** — how long requests take. Track p50 (median), p95 (95th percentile), and p99. A spike in p95 latency means some users are having a bad experience even if the median looks fine.
2. **Traffic** — requests per second. A sudden drop means something is broken (users cannot reach your service). A sudden spike means you might need to scale.
3. **Errors** — error rate (5xx responses / total responses). Track this as a percentage, not a count. 100 errors out of 100K requests (0.1%) is normal. 100 errors out of 200 requests (50%) is a crisis.
4. **Saturation** — how full your resources are (CPU, memory, disk, database connections). When saturation approaches 100%, performance degrades dramatically.

### Golden Rules of DevOps

1. **Never force push to main** — you will overwrite your team's work
2. **Never commit secrets** — .env files, API keys, passwords. Use environment variables.
3. **Automate everything you do more than twice** — manual steps are error-prone
4. **Make deployments boring** — if deployment is stressful, your process is broken
5. **Monitor, do not guess** — dashboards and alerts catch problems before users report them`,
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
      "Delete the file and push a new commit — the old commit will be buried",
      "Immediately rotate ALL exposed API keys and secrets — they are already compromised. THEN remove the file from git history.",
      "Make the repository private",
      "Add .env to .gitignore — that will remove it from history"
    ],
    "correctIndex": 1,
    "explanation": "Rotating secrets is the FIRST priority because automated bots scan GitHub continuously for exposed keys — within minutes. Even after you delete the file, the old commit with the secrets still exists in git history — anyone can view it with 'git log'. Steps: (1) Rotate ALL exposed secrets immediately, (2) Remove from git history using BFG or git filter-branch, (3) Add to .gitignore to prevent future accidents, (4) Force push the cleaned history."
  },
  {
    "question": "Your CI pipeline runs: lint → type check → unit tests → integration tests → build → deploy. Unit tests pass but integration tests fail. What does this tell you?",
    "options": [
      "The unit tests are wrong",
      "Individual functions work correctly in isolation, but something breaks when components interact — likely a database query, API call, or configuration mismatch",
      "The integration test environment is broken",
      "You should skip integration tests to speed up deployment"
    ],
    "correctIndex": 1,
    "explanation": "Unit tests verify individual functions in isolation (with mocks). Integration tests verify that components work together with real dependencies. When unit tests pass but integration tests fail, the individual pieces work but their interaction does not — common causes: SQL query returns unexpected columns, API endpoint returns a different format than expected, environment variable is missing, or a database migration was not applied. This is exactly why you need both layers of tests."
  },
  {
    "question": "What is the main advantage of canary deployments over rolling deployments?",
    "options": [
      "Canary is faster",
      "Canary deploys to only a small percentage of traffic first (e.g., 5%), so if the new version has a bug, only 5% of users are affected — not 100%",
      "Canary doesn't require Docker",
      "Canary is simpler to implement"
    ],
    "correctIndex": 1,
    "explanation": "Canary deployments send a small percentage of real traffic (e.g., 5%) to the new version while 95% continues on the old version. If error rates or latency increase for the canary group, you roll back — only 5% of users were affected. Rolling deployments replace instances one at a time, but once an instance is replaced, its traffic hits the new version permanently. Canary gives you a controlled experiment before full rollout."
  }
]
-->`,
      },
    ],
  },
];
