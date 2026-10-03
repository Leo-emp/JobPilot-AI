/* ============================================================
   AI ENGINEER WORKSHOP — Seed Content
   ============================================================
   # ML fundamentals, LLM integration, RAG, fine-tuning,
   # prompt engineering, evaluation, and AI system design.
   ============================================================ */

export const aiEngineerModules = [
  /* ============================================================
     MODULE 1: ML Fundamentals
     ============================================================ */
  {
    name: "ML Fundamentals",
    slug: "ml-fundamentals",
    description: "Supervised vs unsupervised learning, neural networks, training pipelines, and model evaluation — no PhD required.",
    order: 1,
    sections: [
      {
        title: "Machine Learning From Zero",
        slug: "ml-from-zero",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## Machine Learning From Zero

Machine learning is teaching computers to learn patterns from data instead of explicitly programming rules. This lesson gives you the mental models you need — no math prerequisites.

### The Core Idea

**Traditional programming:**
\`\`\`
Rules + Data → Output
\`\`\`
You write rules: "if temperature > 30°C, turn on AC."

**Machine learning:**
\`\`\`
Data + Output → Rules (Model)
\`\`\`
You give examples: "these 10,000 days of temperature data + whether AC was on → learn the pattern."

### Types of Machine Learning

**Supervised Learning — Learning from labeled examples**
- You provide input-output pairs: "this email is spam, this one isn't"
- Model learns the mapping from input → output
- Use cases: spam detection, image classification, price prediction

**Unsupervised Learning — Finding hidden patterns**
- You provide data without labels
- Model discovers structure on its own
- Use cases: customer segmentation, anomaly detection, topic modeling

**Reinforcement Learning — Learning by trial and error**
- Agent takes actions in an environment
- Gets rewards or penalties
- Learns the optimal strategy over time
- Use cases: game AI, robotics, recommendation systems

### Neural Networks — How Deep Learning Works

A neural network is layers of simple mathematical operations stacked together. Each layer learns increasingly abstract features.

**Analogy — Face recognition:**
- Layer 1: detects edges (lines, curves)
- Layer 2: detects features (eyes, nose, mouth shapes)
- Layer 3: detects face structures (face proportions, expressions)
- Output: identifies the person

**Key concepts:**
- **Neuron** — a single computation unit (multiply inputs by weights, add bias, apply activation)
- **Layer** — a group of neurons processing data in parallel
- **Weight** — how important each input is (learned during training)
- **Bias** — an offset that helps the model fit the data
- **Activation function** — introduces non-linearity (ReLU, sigmoid, softmax)
- **Loss function** — measures how wrong the model is (lower = better)
- **Backpropagation** — algorithm that adjusts weights to reduce loss
- **Epoch** — one complete pass through the training data

### Model Evaluation Metrics

| Metric | What It Measures | When to Use |
|--------|-----------------|-------------|
| Accuracy | % of correct predictions | Balanced classes |
| Precision | Of all positive predictions, % actually positive | When false positives are costly (spam filter) |
| Recall | Of all actual positives, % correctly predicted | When false negatives are costly (cancer detection) |
| F1 Score | Harmonic mean of precision and recall | Imbalanced classes |
| AUC-ROC | Model's ability to distinguish classes | Binary classification |
| MSE/RMSE | Average squared error | Regression (predicting numbers) |

### Overfitting vs Underfitting

**Overfitting** — model memorizes training data but fails on new data.
- Like a student who memorizes answers but can't solve new problems.
- Fix: more data, regularization, simpler model, dropout

**Underfitting** — model is too simple to capture the patterns.
- Like a student who studied the wrong subject.
- Fix: more complex model, more features, train longer

### The ML Pipeline

1. **Collect data** — gather labeled examples
2. **Clean data** — handle missing values, remove duplicates, fix formats
3. **Split data** — train (70%), validation (15%), test (15%)
4. **Feature engineering** — create useful inputs from raw data
5. **Train model** — fit the model on training data
6. **Evaluate** — measure performance on validation data
7. **Tune hyperparameters** — adjust model settings for better performance
8. **Test** — final evaluation on held-out test data
9. **Deploy** — serve the model in production
10. **Monitor** — watch for model drift and degradation`,
      },
      {
        title: "ML Fundamentals Quiz",
        slug: "ml-fundamentals-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## ML Fundamentals Quiz

<!--quiz
[
  {
    "question": "A medical AI needs to detect cancer from X-rays. Which metric matters MOST?",
    "options": [
      "Accuracy — maximize overall correctness",
      "Precision — minimize false positives (healthy people told they have cancer)",
      "Recall — minimize false negatives (cancer cases that are missed)",
      "F1 Score — balance between precision and recall"
    ],
    "correctIndex": 2,
    "explanation": "In cancer detection, missing a real cancer case (false negative) is far more dangerous than flagging a healthy person for further testing (false positive). High recall ensures you catch as many cancer cases as possible, even if some healthy people get unnecessary follow-up tests. A missed diagnosis can be fatal; an extra test is an inconvenience."
  },
  {
    "question": "Your model gets 99% accuracy on training data but only 60% on test data. What's happening?",
    "options": [
      "Underfitting — the model is too simple",
      "Overfitting — the model memorized training data instead of learning patterns",
      "The test data is bad and needs cleaning",
      "The model needs more training epochs"
    ],
    "correctIndex": 1,
    "explanation": "The large gap between training accuracy (99%) and test accuracy (60%) is the classic sign of overfitting. The model memorized the training examples instead of learning generalizable patterns. Solutions: add more training data, use regularization (dropout, L2), simplify the model, or use data augmentation."
  },
  {
    "question": "You want to group customers into segments based on purchasing behavior, but you don't have predefined categories. Which approach?",
    "options": [
      "Supervised learning — train on labeled customer segments",
      "Unsupervised learning — let the algorithm discover natural groups",
      "Reinforcement learning — reward the model for good groupings",
      "Transfer learning — use a pre-trained customer model"
    ],
    "correctIndex": 1,
    "explanation": "Without predefined categories (no labels), this is an unsupervised learning problem. Clustering algorithms like K-means or DBSCAN can discover natural groupings in the data based on purchasing patterns. Supervised learning would require labeled examples of which segment each customer belongs to, which you don't have."
  },
  {
    "question": "What does 'backpropagation' do in a neural network?",
    "options": [
      "Sends data backwards through the network to check results",
      "Calculates how much each weight contributed to the error and adjusts them accordingly",
      "Removes bad training examples from the dataset",
      "Reverses the model to go from output back to input"
    ],
    "correctIndex": 1,
    "explanation": "Backpropagation calculates the gradient of the loss function with respect to each weight — essentially 'how much did this weight contribute to the error?' It then adjusts each weight in the direction that reduces the error. It's called 'back' propagation because it works backwards from the output layer to the input layer, updating weights along the way."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 2: LLM Integration
     ============================================================ */
  {
    name: "LLM Integration",
    slug: "llm-integration",
    description: "OpenAI/Anthropic API integration, streaming, function calling, structured output, and error handling.",
    order: 2,
    sections: [
      {
        title: "Building with LLM APIs",
        slug: "building-with-llm-apis",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## Building with LLM APIs

Integrating Large Language Models into your application is the most valuable skill in AI engineering today. This lesson covers practical patterns for production use.

### API Basics

All major LLM providers (OpenAI, Anthropic, Google) use the same pattern:

\`\`\`typescript
// Basic completion
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Explain quantum computing in one paragraph." }
  ],
});

console.log(response.content[0].text);
\`\`\`

### System Prompts — Setting Behavior

The system prompt defines the AI's persona, rules, and capabilities.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: \`You are a customer support agent for TechCorp.
Rules:
- Only answer questions about TechCorp products
- If you don't know the answer, say so and offer to connect with a human agent
- Never discuss competitors
- Be concise and helpful\`,
  messages: [
    { role: "user", content: "How do I reset my password?" }
  ],
});
\`\`\`

### Streaming — Real-Time Responses

Don't make users wait for the entire response. Stream tokens as they're generated.

\`\`\`typescript
// Streaming with Anthropic
const stream = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  stream: true,
  messages: [{ role: "user", content: "Write a haiku about coding" }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
\`\`\`

### Function Calling (Tool Use)

Let the LLM call functions in your application — the most powerful integration pattern.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a location",
      input_schema: {
        type: "object",
        properties: {
          location: { type: "string", description: "City name" },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  ],
  messages: [{ role: "user", content: "What's the weather in London?" }],
});

// Check if the model wants to use a tool
for (const block of response.content) {
  if (block.type === "tool_use") {
    // Call your actual weather API
    const weather = await getWeather(block.input.location);
    // Send tool result back to the model
  }
}
\`\`\`

### Production Patterns

**Retry with exponential backoff:**
\`\`\`typescript
async function callLLM(prompt: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
\`\`\`

**Token budget management:**
\`\`\`typescript
// Count tokens before sending (approximate)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4); // Rough estimate: ~4 chars per token
}

// Set appropriate max_tokens based on task
const MAX_TOKENS = {
  classification: 50,    // Short answer
  summary: 500,          // Paragraph
  generation: 2000,      // Long-form content
  code: 4000,            // Code generation
};
\`\`\`

### Cost Optimization

| Strategy | Savings |
|----------|---------|
| Use smaller models for simple tasks | 5-10x cheaper |
| Cache identical requests | Avoid redundant API calls |
| Set appropriate max_tokens | Don't pay for unused tokens |
| Batch requests when possible | Reduce overhead |
| Use streaming to show progress | Better UX, same cost |
| Prompt engineering over fine-tuning | Cheaper and more flexible |`,
      },
      {
        title: "Structured Output & Tool Use",
        slug: "structured-output-tool-use",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 2,
        content: `## Structured Output & Tool Use

Getting reliable, parseable output from LLMs is the key to building real features — not just chatbots.

### The Problem with Free-Form Output

\`\`\`typescript
// You ask: "Extract the product name and price"
// Sometimes you get: "The product is Widget Pro and costs $29.99"
// Other times: "Product: Widget Pro, Price: $29.99"
// Or: "{ name: 'Widget Pro', price: 29.99 }" // Note: invalid JSON (single quotes)
\`\`\`

You can't build reliable software on unpredictable output. The solution: force structure.

### Technique 1: JSON Mode

Tell the model to return valid JSON with a strict schema.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: \`Extract product info. Return ONLY valid JSON matching this schema:
{
  "name": "string",
  "price": number,
  "currency": "string",
  "inStock": boolean,
  "features": ["string"]
}
No other text. No markdown fences. Just the JSON object.\`,
  messages: [{ role: "user", content: productDescription }],
});

// Parse and validate with Zod
const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  inStock: z.boolean(),
  features: z.array(z.string()),
});

const product = productSchema.parse(JSON.parse(response.content[0].text));
\`\`\`

### Technique 2: Tool Use (Function Calling)

The most reliable way to get structured output — the model fills in a function's parameters.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [{
    name: "save_contact",
    description: "Save an extracted contact to the database",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Full name" },
        email: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number" },
        company: { type: "string", description: "Company name" },
        role: { type: "string", description: "Job title" },
      },
      required: ["name", "email"],
    },
  }],
  tool_choice: { type: "tool", name: "save_contact" }, // Force this tool
  messages: [{ role: "user", content: businessCardText }],
});

// The model returns structured tool_use with validated parameters
const toolBlock = response.content.find(b => b.type === "tool_use");
const contact = toolBlock.input; // { name, email, phone, company, role }
\`\`\`

### Technique 3: AI SDK Structured Output

The Vercel AI SDK provides type-safe structured generation:

\`\`\`typescript
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const { object } = await generateObject({
  model: anthropic("claude-sonnet-4-20250514"),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      servings: z.number(),
      ingredients: z.array(z.object({
        item: z.string(),
        amount: z.string(),
      })),
      steps: z.array(z.string()),
      cookTime: z.number().describe("in minutes"),
    }),
  }),
  prompt: "Create a recipe for chocolate brownies",
});
// object.recipe is fully typed!
\`\`\`

### When to Use Each Technique

| Technique | Reliability | Use When |
|-----------|------------|----------|
| JSON in system prompt | Medium | Simple extraction, prototyping |
| Tool use / function calling | High | Production, complex schemas |
| AI SDK generateObject | Highest | Next.js apps with type safety |
| Multiple tool choices | High | Model needs to choose an action |`,
      },
      {
        title: "LLM Integration Quiz",
        slug: "llm-integration-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## LLM Integration Quiz

<!--quiz
[
  {
    "question": "Your LLM API call sometimes returns malformed JSON that crashes your parser. What's the most reliable fix?",
    "options": [
      "Add 'Please return valid JSON' to the prompt",
      "Use tool use / function calling — the model fills structured parameters instead of generating free text",
      "Retry until you get valid JSON",
      "Use a regex to extract the JSON from the response"
    ],
    "correctIndex": 1,
    "explanation": "Tool use (function calling) is the most reliable way to get structured output. Instead of asking the model to generate JSON text (which can have formatting issues), tool use makes the model fill in typed parameters — the API handles serialization. It's like the difference between asking someone to write JSON by hand vs. filling out a form."
  },
  {
    "question": "Your AI feature works in development but is too expensive in production (100,000 requests/day). What's the FIRST cost reduction to try?",
    "options": [
      "Switch to a smaller, cheaper model for simple tasks",
      "Remove the AI feature entirely",
      "Fine-tune a custom model",
      "Reduce max_tokens to 10"
    ],
    "correctIndex": 0,
    "explanation": "Model routing is the highest-impact cost reduction. Most requests (classification, extraction, simple Q&A) work perfectly with smaller/cheaper models (Claude Haiku). Route complex requests to expensive models (Claude Opus). This alone can reduce costs 5-30x. Fine-tuning is expensive and complex; removing the feature defeats the purpose; and cutting max_tokens too low breaks responses."
  },
  {
    "question": "Why should you implement streaming for LLM responses in a user-facing chat?",
    "options": [
      "It's cheaper than non-streaming",
      "It reduces hallucinations",
      "Users see tokens appear in real-time instead of waiting 5-10 seconds for the full response",
      "It increases model accuracy"
    ],
    "correctIndex": 2,
    "explanation": "Streaming dramatically improves perceived performance. Without streaming, users stare at a loading spinner for 5-10 seconds. With streaming, they see the response forming in real-time — same total time, but the experience feels instant and engaging. Cost and accuracy are the same; streaming only affects how the response is delivered."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 3: RAG (Retrieval-Augmented Generation)
     ============================================================ */
  {
    name: "RAG Systems",
    slug: "rag-systems",
    description: "Vector databases, embeddings, chunking strategies, hybrid search, and building production RAG pipelines.",
    order: 3,
    sections: [
      {
        title: "Building a RAG Pipeline",
        slug: "building-rag-pipeline",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## RAG — Retrieval-Augmented Generation

RAG lets LLMs answer questions about YOUR data — company docs, knowledge bases, product manuals — without fine-tuning the model.

### How RAG Works

\`\`\`
User Question → Search your documents → Found relevant chunks →
  Send to LLM with context → Answer grounded in your data
\`\`\`

**Without RAG:** "What's our refund policy?" → LLM makes something up (hallucination)
**With RAG:** "What's our refund policy?" → Finds policy doc → LLM answers based on the actual policy

### The RAG Pipeline

**Step 1: Indexing (one-time)**
1. Load documents (PDFs, web pages, databases)
2. Split into chunks (500-1000 tokens each)
3. Generate embeddings for each chunk (vector representation)
4. Store embeddings in a vector database

**Step 2: Querying (per request)**
1. Convert user's question to an embedding
2. Search vector database for most similar chunks
3. Build a prompt with the retrieved context
4. Send to LLM for answer generation

### Embeddings — What Are They?

Embeddings convert text into a list of numbers (a vector) that captures the text's meaning. Similar texts have similar vectors.

\`\`\`typescript
// Generate embeddings
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "How do I reset my password?",
});
// Returns: [0.023, -0.041, 0.089, ...] (1536 numbers)
\`\`\`

**Why this works:** The vector for "reset password" is mathematically close to the vector for "change password" and "forgot password" — even though the words are different.

### Chunking Strategies

How you split documents dramatically affects RAG quality.

| Strategy | How | Best For |
|----------|-----|---------|
| Fixed size | Split every N characters/tokens | Simple, consistent |
| Paragraph | Split on paragraph breaks | Well-structured docs |
| Semantic | Split when topic changes | Long, varied documents |
| Recursive | Split by hierarchy (section → paragraph → sentence) | Mixed content |
| Overlap | Include N tokens from previous chunk | Prevent losing context at boundaries |

**Best practice:** Use recursive splitting with 200-500 token overlap. This preserves context that might span chunk boundaries.

### Vector Databases

| Database | Type | Best For |
|----------|------|---------|
| Pinecone | Managed cloud | Production, zero ops |
| Weaviate | Open source | Self-hosted, hybrid search |
| ChromaDB | Lightweight | Prototyping, local development |
| pgvector | PostgreSQL extension | Already using PostgreSQL |
| Qdrant | Open source | High performance, filtering |

### Building the Prompt

\`\`\`typescript
function buildRAGPrompt(question: string, chunks: string[]): string {
  return \`Answer the user's question based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have enough information to answer that."

Context:
\${chunks.map((c, i) => \`[Source \${i + 1}]: \${c}\`).join("\\n\\n")}

Question: \${question}

Answer:\`;
}
\`\`\`

### Common RAG Pitfalls

| Problem | Solution |
|---------|---------|
| Irrelevant chunks retrieved | Improve chunking, add metadata filtering |
| Answer contradicts sources | Add "cite your sources" to the prompt |
| Hallucination despite context | Use "only answer from context" instruction |
| Missing information | Check chunk size (too small = lost context) |
| Slow retrieval | Add approximate nearest neighbor (ANN) indexes |
| Outdated answers | Implement document refresh pipeline |`,
      },
      {
        title: "Advanced RAG Techniques",
        slug: "advanced-rag",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 25,
        order: 2,
        content: `## Advanced RAG Techniques

Basic RAG gets you 70% of the way. These advanced techniques close the gap to production quality.

### Hybrid Search (Vector + Keyword)

Vector search finds semantically similar content, but sometimes you need exact keyword matches (product names, error codes, IDs).

\`\`\`typescript
// Combine vector similarity with keyword search
async function hybridSearch(query: string, topK: number = 5) {
  // 1. Vector search (semantic similarity)
  const embedding = await generateEmbedding(query);
  const vectorResults = await vectorDB.search(embedding, topK * 2);

  // 2. Keyword search (BM25 / full-text)
  const keywordResults = await fullTextSearch(query, topK * 2);

  // 3. Reciprocal Rank Fusion (merge results)
  const scored = new Map<string, number>();
  const k = 60; // RRF constant

  vectorResults.forEach((doc, rank) => {
    scored.set(doc.id, (scored.get(doc.id) || 0) + 1 / (k + rank + 1));
  });
  keywordResults.forEach((doc, rank) => {
    scored.set(doc.id, (scored.get(doc.id) || 0) + 1 / (k + rank + 1));
  });

  // Sort by combined score
  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK);
}
\`\`\`

### Query Rewriting

Users ask bad questions. Rewrite them for better retrieval.

\`\`\`typescript
async function rewriteQuery(originalQuery: string): Promise<string[]> {
  const response = await llm.generate({
    system: \`You are a search query optimizer. Given a user question,
generate 3 alternative phrasings that might match relevant documents better.
Return as a JSON array of strings.\`,
    user: originalQuery,
  });

  // Search with ALL versions, merge results
  return JSON.parse(response);
}

// "why is my app slow" becomes:
// ["application performance optimization"]
// ["slow page load time debugging"]
// ["latency issues web application"]
\`\`\`

### Re-Ranking

Initial retrieval finds candidates. Re-ranking picks the best ones.

\`\`\`typescript
async function retrieveAndRerank(query: string) {
  // Step 1: Retrieve many candidates (cheap)
  const candidates = await vectorDB.search(queryEmbedding, 20);

  // Step 2: Re-rank with a cross-encoder or LLM (expensive, but few items)
  const reranked = await llm.generate({
    system: \`Rate each document's relevance to the query (1-10).
Return JSON: [{ "index": number, "score": number, "reason": string }]\`,
    user: \`Query: \${query}\\n\\nDocuments:\\n\${candidates.map(
      (c, i) => \`[\${i}]: \${c.text.slice(0, 200)}\`
    ).join("\\n")}\`,
  });

  // Step 3: Take top results by reranked score
  return JSON.parse(reranked)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => candidates[r.index]);
}
\`\`\`

### Metadata Filtering

Don't search everything — filter by what's relevant.

\`\`\`typescript
// Store metadata with each chunk
const chunk = {
  text: "Our enterprise plan costs $499/month...",
  metadata: {
    source: "pricing-page",
    category: "pricing",
    lastUpdated: "2026-01-15",
    audience: "enterprise",
  },
};

// Filter during retrieval
const results = await vectorDB.search(queryEmbedding, 10, {
  filter: {
    category: "pricing",
    lastUpdated: { $gte: "2025-01-01" }, // Only recent docs
  },
});
\`\`\`

### RAG Evaluation Metrics

| Metric | What It Measures | How to Calculate |
|--------|-----------------|-----------------|
| Retrieval Precision | Are retrieved docs relevant? | Relevant retrieved / Total retrieved |
| Retrieval Recall | Did we find all relevant docs? | Relevant retrieved / Total relevant |
| Answer Faithfulness | Is the answer supported by context? | LLM-as-judge vs source docs |
| Answer Relevance | Does the answer address the question? | LLM-as-judge vs original query |
| Context Utilization | Is the model using the provided context? | Check if answer cites sources |`,
      },
      {
        title: "RAG Systems Quiz",
        slug: "rag-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## RAG Systems Quiz

<!--quiz
[
  {
    "question": "Your RAG system answers 'What is error code E-4021?' with irrelevant results. Vector search finds semantically similar but wrong content. What's the fix?",
    "options": [
      "Use a bigger embedding model",
      "Add hybrid search — combine vector search with keyword/BM25 search to catch exact matches like error codes",
      "Increase the number of retrieved chunks",
      "Use a more expensive LLM"
    ],
    "correctIndex": 1,
    "explanation": "Error codes, product IDs, and specific terms need exact matching, which vector/semantic search is bad at. 'E-4021' is semantically similar to 'E-4022' in vector space, but they're completely different errors. Hybrid search combines vector search (good for meaning) with keyword search (good for exact terms), giving you the best of both worlds."
  },
  {
    "question": "You're chunking a 100-page technical manual. Your chunks are 100 tokens each with no overlap. Users report the AI gives partial/incomplete answers. Why?",
    "options": [
      "The embedding model is too small",
      "100 tokens is too small — important context spans across chunk boundaries and gets split apart",
      "The manual is too long for RAG",
      "You need more chunks in the prompt"
    ],
    "correctIndex": 1,
    "explanation": "With 100-token chunks and no overlap, sentences and paragraphs get sliced mid-thought. The chunk contains half an explanation, and the other half is in the next chunk (which wasn't retrieved). Fix: use larger chunks (300-500 tokens) with 100-200 token overlap. The overlap ensures that boundary content appears in at least one complete chunk."
  },
  {
    "question": "Your RAG system retrieves the right documents but the LLM still makes up information not in the context. What's the best guardrail?",
    "options": [
      "Use a smaller model — it hallucinates less",
      "Add explicit instructions: 'Answer ONLY from the provided context. If the answer isn't in the context, say I don't know.'",
      "Remove the system prompt",
      "Increase temperature for more creative answers"
    ],
    "correctIndex": 1,
    "explanation": "Explicit grounding instructions dramatically reduce hallucination. Tell the model to ONLY use the provided context and to explicitly state when it doesn't have enough information. Also helpful: ask the model to cite which source it used. Smaller models actually hallucinate MORE, and higher temperature increases randomness (more hallucination)."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Prompt Engineering
     ============================================================ */
  {
    name: "Prompt Engineering",
    slug: "prompt-engineering",
    description: "Advanced prompting techniques, chain-of-thought, few-shot learning, structured output, and prompt testing.",
    order: 4,
    sections: [
      {
        title: "Advanced Prompting Techniques",
        slug: "advanced-prompting",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Advanced Prompting Techniques

Prompt engineering is the difference between a toy demo and a production AI feature. Good prompts get consistent, reliable, structured output.

### Zero-Shot vs Few-Shot

**Zero-shot** — no examples, just instructions:
\`\`\`
Classify this review as positive, negative, or neutral:
"The product arrived late but the quality was excellent."
\`\`\`

**Few-shot** — provide examples:
\`\`\`
Classify reviews as positive, negative, or neutral.

Review: "Absolutely love this product!"
Classification: positive

Review: "Broken on arrival, terrible experience."
Classification: negative

Review: "It's okay, nothing special."
Classification: neutral

Review: "The product arrived late but the quality was excellent."
Classification:
\`\`\`

Few-shot consistently outperforms zero-shot for classification and formatting tasks.

### Chain-of-Thought (CoT)

Force the model to think step-by-step before answering.

**Without CoT:**
\`\`\`
Q: A store sells apples for $2 each. You have $15 and a $3 coupon.
   How many apples can you buy?
A: 7 ← Often wrong
\`\`\`

**With CoT:**
\`\`\`
Q: A store sells apples for $2 each. You have $15 and a $3 coupon.
   How many apples can you buy?
   Think step by step.
A: Step 1: Total budget = $15 + $3 coupon = $18
   Step 2: Price per apple = $2
   Step 3: Number of apples = $18 / $2 = 9
   Answer: 9 ✓
\`\`\`

### Structured Output

Force the model to return JSON or specific formats.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: \`You extract structured data from job postings.
Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "company": "string",
  "location": "string",
  "salary": { "min": number, "max": number, "currency": "string" } | null,
  "skills": ["string"],
  "experience_years": number | null,
  "remote": boolean
}\`,
  messages: [{ role: "user", content: jobPostingText }],
});
\`\`\`

### Prompt Templates

Build reusable prompt templates for your application:

\`\`\`typescript
const PROMPTS = {
  summarize: (text: string, maxWords: number) => ({
    system: "You are a concise summarizer. Output ONLY the summary.",
    user: \`Summarize the following text in at most \${maxWords} words:\\n\\n\${text}\`,
  }),

  classify: (text: string, categories: string[]) => ({
    system: \`Classify the text into exactly one of these categories: \${categories.join(", ")}.
Output ONLY the category name, nothing else.\`,
    user: text,
  }),

  extractEntities: (text: string) => ({
    system: \`Extract named entities from the text.
Return JSON: { "people": [], "organizations": [], "locations": [], "dates": [] }\`,
    user: text,
  }),
};
\`\`\`

### Prompt Testing

**Test your prompts like you test code:**

\`\`\`typescript
const testCases = [
  { input: "I love this product!", expected: "positive" },
  { input: "Terrible, waste of money", expected: "negative" },
  { input: "It works as described", expected: "neutral" },
  { input: "Great quality but shipping was slow", expected: "positive" },
  { input: "", expected: "neutral" }, // Edge case: empty input
];

for (const testCase of testCases) {
  const result = await classify(testCase.input);
  console.log(
    result === testCase.expected ? "PASS" : "FAIL",
    \`Input: "\${testCase.input}" → Expected: \${testCase.expected}, Got: \${result}\`
  );
}
\`\`\`

### Prompting Best Practices

| Technique | When to Use |
|-----------|-------------|
| Be specific | Always — vague prompts get vague answers |
| Provide examples (few-shot) | Classification, formatting, style matching |
| Chain-of-thought | Math, reasoning, multi-step logic |
| Role-play ("You are a...") | When persona affects output quality |
| Output format specification | When you need structured data (JSON) |
| Negative constraints ("Never...") | Prevent common failure modes |
| Temperature = 0 | Deterministic tasks (classification, extraction) |
| Temperature = 0.7-1.0 | Creative tasks (writing, brainstorming) |`,
      },
      {
        title: "Prompt Engineering Quiz",
        slug: "prompt-engineering-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Prompt Engineering Quiz

<!--quiz
[
  {
    "question": "You're building a sentiment classifier. The model returns 'Positive' sometimes and 'positive' other times, breaking your code. Best fix?",
    "options": [
      "Convert to lowercase in your code",
      "Use few-shot examples that show the exact format you want, and add 'Output ONLY one word in lowercase'",
      "Use a different model",
      "Fine-tune the model"
    ],
    "correctIndex": 1,
    "explanation": "Few-shot examples are the most reliable way to control output format. Show 3-4 examples with the exact casing and format you want, plus an explicit instruction. While toLowerCase() works for this simple case, few-shot is the general solution — it works for complex formats, multi-field outputs, and edge cases that simple string manipulation can't handle."
  },
  {
    "question": "You ask the model to solve: 'A train leaves at 2pm going 60mph. Another at 3pm going 90mph. When do they meet?' It gets it wrong. What technique helps?",
    "options": [
      "Increase temperature for more creative problem-solving",
      "Use chain-of-thought — ask the model to think step by step before giving the answer",
      "Use a bigger model",
      "Use few-shot examples of train problems"
    ],
    "correctIndex": 1,
    "explanation": "Chain-of-thought (CoT) forces the model to show its reasoning, which dramatically improves accuracy on math and logic problems. Without CoT, the model tries to jump to the answer and often gets it wrong. With CoT, it breaks the problem into steps: calculate distance, set up equation, solve. Adding 'Think step by step' to your prompt is one of the highest-impact prompt techniques."
  },
  {
    "question": "You want the model to NEVER mention competitor products, even when asked directly. Which approach is most effective?",
    "options": [
      "Add 'Don't mention competitors' to the user message",
      "Use a system prompt with explicit rules, negative constraints, and examples of how to redirect competitor questions",
      "Set temperature to 0",
      "Fine-tune the model to avoid competitor mentions"
    ],
    "correctIndex": 1,
    "explanation": "System prompts with explicit rules, negative constraints ('NEVER mention X, Y, Z by name'), and redirect examples ('If asked about competitors, say: I can only speak to our products') are the most effective. The system prompt is the highest-priority instruction context. Temperature doesn't affect what topics the model discusses, and fine-tuning is expensive overkill for a behavioral constraint."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 5: AI System Design
     ============================================================ */
  {
    name: "AI System Design",
    slug: "ai-system-design",
    description: "Designing production AI systems: architecture, evaluation, monitoring, safety, and scaling patterns.",
    order: 5,
    sections: [
      {
        title: "Designing AI Systems for Production",
        slug: "ai-systems-production",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## Designing AI Systems for Production

Moving from a demo to production requires thinking about reliability, cost, safety, and user experience. This is where AI engineering meets software engineering.

### Architecture Patterns

**1. Simple API Call**
\`\`\`
User → Your API → LLM API → Response → User
\`\`\`
Best for: chatbots, content generation, classification

**2. RAG (Retrieval-Augmented Generation)**
\`\`\`
User → Your API → Vector DB → LLM API (with context) → Response → User
\`\`\`
Best for: Q&A over documents, knowledge bases, customer support

**3. Agent Loop**
\`\`\`
User → Your API → LLM decides action → Tool execution →
  LLM reviews result → (repeat) → Final response → User
\`\`\`
Best for: complex multi-step tasks, research, data analysis

**4. Pipeline**
\`\`\`
Input → Stage 1 (classify) → Stage 2 (extract) → Stage 3 (generate) → Output
\`\`\`
Best for: content processing, data pipelines, multi-model workflows

### Evaluation — How to Know If It's Working

| Metric | How to Measure |
|--------|---------------|
| Accuracy | Compare AI output to human-labeled ground truth |
| Relevance | Human rating (1-5) or LLM-as-judge |
| Hallucination rate | Fact-check outputs against source documents |
| Latency | Time from request to first token (P50, P95, P99) |
| Cost per request | Input tokens + output tokens × price |
| User satisfaction | Thumbs up/down, NPS, task completion rate |

### Safety & Guardrails

**Input guardrails (before the LLM):**
- Content moderation (reject harmful requests)
- PII detection (redact personal info before sending to API)
- Prompt injection detection (catch attempts to manipulate the system)
- Rate limiting (prevent abuse)

**Output guardrails (after the LLM):**
- Fact-checking against source documents (RAG)
- Content filtering (block inappropriate outputs)
- Format validation (ensure structured output matches schema)
- Confidence thresholds (flag low-confidence responses for human review)

### Cost Management

| Lever | Impact |
|-------|--------|
| Model selection | Claude Haiku vs Opus can be 30x cheaper |
| Prompt length | Shorter prompts = fewer input tokens |
| max_tokens | Don't allocate 4,000 tokens for a yes/no answer |
| Caching | Same question → same answer, skip the API call |
| Batching | Process multiple items in one API call |
| Routing | Use cheap models for simple tasks, expensive for hard ones |

### Monitoring in Production

Track these metrics continuously:
1. **Latency** — are responses getting slower?
2. **Error rate** — are API calls failing?
3. **Cost** — is spending within budget?
4. **Quality** — are user satisfaction scores dropping?
5. **Hallucination rate** — is the model making things up more often?
6. **Token usage** — are prompts growing unexpectedly?

Set alerts for anomalies in any of these metrics.`,
      },
      {
        title: "AI Agents & Multi-Step Workflows",
        slug: "ai-agents-workflows",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 25,
        order: 2,
        content: `## AI Agents & Multi-Step Workflows

An AI agent doesn't just answer questions — it takes actions, uses tools, and works through multi-step tasks autonomously. This is the frontier of AI engineering.

### What Makes an Agent Different from a Chatbot?

| Chatbot | Agent |
|---------|-------|
| Responds to messages | Plans and executes tasks |
| Single turn | Multi-turn loops |
| Text only | Uses tools (search, code, APIs) |
| Predetermined flow | Dynamic decision-making |
| No side effects | Takes real actions |

### The Agent Loop

\`\`\`typescript
async function agentLoop(task: string, maxSteps = 10) {
  const messages = [{ role: "user", content: task }];

  for (let step = 0; step < maxSteps; step++) {
    // 1. Ask the LLM what to do next
    const response = await llm.create({
      model: "claude-sonnet-4-20250514",
      tools: availableTools,
      messages,
    });

    // 2. Check if the model wants to use a tool
    const toolUse = response.content.find(b => b.type === "tool_use");

    if (!toolUse) {
      // Model gave a final text response — we're done
      return response.content[0].text;
    }

    // 3. Execute the tool
    const toolResult = await executeTool(toolUse.name, toolUse.input);

    // 4. Send the result back to the model
    messages.push(
      { role: "assistant", content: response.content },
      { role: "user", content: [{
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(toolResult),
      }]}
    );
    // Loop continues — model decides next action
  }

  return "Max steps reached";
}
\`\`\`

### Tool Design Principles

Good tools make agents more reliable:

\`\`\`typescript
const tools = [
  {
    name: "search_products",
    // Clear description helps the model choose when to use it
    description: "Search the product database by name, category, or price range. Returns up to 10 matching products with name, price, and stock status.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term" },
        category: { type: "string", enum: ["electronics", "clothing", "books"] },
        maxPrice: { type: "number", description: "Maximum price in GBP" },
      },
      required: ["query"],
    },
  },
  {
    name: "create_order",
    description: "Place an order for a specific product. Returns order confirmation with order ID and estimated delivery date.",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 10 },
      },
      required: ["productId", "quantity"],
    },
  },
];
\`\`\`

### Multi-Agent Architectures

**Router pattern:**
\`\`\`
User → Router Agent → decides → Specialist Agent A (code)
                               → Specialist Agent B (research)
                               → Specialist Agent C (writing)
\`\`\`

**Pipeline pattern:**
\`\`\`
Input → Research Agent → Analysis Agent → Writer Agent → Output
\`\`\`

**Supervisor pattern:**
\`\`\`
Supervisor Agent → assigns tasks → Worker Agent 1 (parallel)
                                 → Worker Agent 2 (parallel)
                 → reviews results → Final output
\`\`\`

### Safety for Agents

Agents take real actions, so safety is critical:

1. **Human-in-the-loop** — require approval for destructive actions
2. **Sandboxing** — run code in isolated environments
3. **Budget limits** — cap API calls and costs per run
4. **Action allowlisting** — only permit specific tools
5. **Audit logging** — record every action for review
6. **Timeout** — stop agents that run too long (infinite loops)`,
      },
      {
        title: "AI System Design Quiz",
        slug: "ai-system-design-quiz",
        type: "quiz" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## AI System Design Quiz

<!--quiz
[
  {
    "question": "You're building a customer support AI that needs to answer questions about your product AND process refunds. Which architecture fits best?",
    "options": [
      "Simple API call — send the question to an LLM",
      "RAG for knowledge + Agent loop with tools for actions (search docs + process refund)",
      "Fine-tune a model on your support tickets",
      "Pipeline — classify first, then answer"
    ],
    "correctIndex": 1,
    "explanation": "This needs TWO capabilities: knowledge (answering product questions) and action (processing refunds). RAG provides grounded knowledge from your docs. The agent loop lets the model decide when to search docs vs. when to call the refund tool. A simple API call can't access your docs or process refunds. Fine-tuning can't take actions. A pipeline is too rigid for varied support queries."
  },
  {
    "question": "Your AI agent is processing orders but sometimes creates duplicate orders. What's the MOST important safeguard to add?",
    "options": [
      "Use a bigger model — it will be more careful",
      "Human-in-the-loop confirmation for any action that creates, modifies, or deletes data",
      "Add 'don't create duplicates' to the system prompt",
      "Reduce the number of available tools"
    ],
    "correctIndex": 1,
    "explanation": "Human-in-the-loop is the most reliable safeguard for destructive or costly actions. Before the agent creates an order, show the user: 'I'm about to place order for X. Confirm?' Prompt instructions are advisory (the model can still make mistakes). Bigger models help but aren't a guarantee. The real protection is requiring human confirmation for irreversible actions."
  },
  {
    "question": "Your AI costs $2,000/month and 80% of queries are simple FAQ-type questions. How do you reduce costs the most?",
    "options": [
      "Cache all responses for 24 hours",
      "Route simple queries to a cheap model (Haiku) and complex ones to an expensive model (Opus)",
      "Limit users to 5 queries per day",
      "Remove the AI entirely and use a static FAQ page"
    ],
    "correctIndex": 1,
    "explanation": "Model routing is the highest-impact cost optimization. If 80% of queries are simple FAQ-style (classification, lookup), a cheap model handles them perfectly at 1/30th the cost. Only the 20% complex queries (reasoning, multi-step) need the expensive model. Expected savings: ~60-70% ($1,200-1,400/month). Caching helps too but has freshness issues. Usage limits hurt the user experience."
  }
]
-->`,
      },
    ],
  },
];
