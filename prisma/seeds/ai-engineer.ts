/* ============================================================
   AI ENGINEER WORKSHOP — Seed Content
   ============================================================
   # ML fundamentals, LLM integration, RAG, fine-tuning,
   # prompt engineering, evaluation, and AI system design.
   # EXPANDED: Deep prose, analogies, step-by-step walkthroughs.
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
        estimatedMinutes: 45,
        order: 1,
        content: `## Machine Learning From Zero

Machine learning is one of those terms that sounds intimidating, but at its core, it is surprisingly intuitive. Instead of writing explicit rules for a computer to follow, you give the computer a bunch of examples and let it figure out the rules on its own. That is the entire concept in one sentence. Everything else — neural networks, transformers, GPT, diffusion models — is just increasingly clever ways of doing that one thing.

Think of it like teaching a child to recognise dogs. You do not hand the child a 200-page manual describing every possible dog breed, ear shape, fur texture, and tail length. Instead, you point at hundreds of animals and say "dog" or "not dog." After enough examples, the child builds an internal mental model that lets them recognise dogs they have never seen before — even weird-looking ones. Machine learning works the same way, except the "child" is a mathematical function and the "pointing" is feeding it labelled data.

### Traditional Programming vs Machine Learning

In traditional programming, you are the expert. You study the problem, figure out the rules, and write them down as code. If you are building a spam filter the old-fashioned way, you might write rules like: "if the email contains the word 'lottery' and has more than three exclamation marks, mark it as spam." This works for obvious cases, but spammers evolve. They start writing "l0ttery" or "lo.tte.ry" to dodge your rules. You end up in an arms race, constantly updating your rules by hand.

\`\`\`
# Traditional programming
Rules + Data → Output
# You write: "if temperature > 30°C, turn on AC"
\`\`\`

Machine learning flips this around. Instead of writing rules, you collect thousands of emails that humans have already marked as spam or not-spam. You feed these examples into a learning algorithm, and it discovers its own rules — patterns you might never have thought of. When spammers change tactics, you simply feed in new examples and let the model re-learn. The model adapts; your hand-written rules cannot.

\`\`\`
# Machine learning
Data + Output → Rules (Model)
# You give: "10,000 emails + spam/not-spam labels → learn the pattern"
\`\`\`

This shift from "programmer writes rules" to "algorithm learns rules from data" is what makes machine learning so powerful. It works for problems that are too complex, too nuanced, or too fast-changing for humans to write rules by hand.

### Types of Machine Learning

There are three main flavours of machine learning, and understanding the difference between them is one of the most important mental models you can build.

**Supervised Learning — Learning from labelled examples**

Supervised learning is the most common and most intuitive type. You provide the algorithm with input-output pairs — "here is an email, and here is whether it is spam or not" — and the algorithm learns to predict the output from the input. It is called "supervised" because you are acting as the supervisor, providing the correct answers during training.

Imagine you are teaching someone to appraise houses. You show them 10,000 houses along with their actual sale prices. Each house has features: square footage, number of bedrooms, neighbourhood, year built, proximity to schools. After studying all these examples, the person develops an intuition for pricing houses — they can look at a new house they have never seen and give you a reasonable price estimate. That is supervised learning.

Common use cases include spam detection, image classification (is this a cat or a dog?), price prediction, medical diagnosis, credit scoring, and language translation. Basically, any problem where you have historical examples with known correct answers.

**Unsupervised Learning — Finding hidden patterns**

Unsupervised learning is different because you do not provide labels. You give the algorithm a pile of data and say, "find interesting patterns." The algorithm groups, clusters, and organises the data on its own, discovering structure that you might not have known existed.

Think of it like sorting a pile of 1,000 photographs without any instructions. You might naturally group them by location (beach photos, city photos, mountain photos), or by the people in them, or by the time of day. Nobody told you how to sort them — you found natural groupings yourself. Unsupervised learning does the same thing with data.

Common use cases include customer segmentation (grouping customers by behaviour without predefined categories), anomaly detection (finding unusual transactions that might be fraud), topic modelling (discovering themes in thousands of documents), and recommendation systems (finding users with similar tastes).

**Reinforcement Learning — Learning by trial and error**

Reinforcement learning is the most different of the three. Instead of learning from examples, an agent learns by interacting with an environment and receiving rewards or penalties. It is exactly how you train a dog: good behaviour gets a treat, bad behaviour gets nothing. Over time, the dog — or the AI — learns which actions lead to the best outcomes.

The agent tries an action, sees what happens, gets a reward (or punishment), and adjusts its strategy. After millions of these cycles, it develops surprisingly sophisticated behaviour. This is how DeepMind's AlphaGo learned to beat the world champion at Go — by playing millions of games against itself and learning from every win and loss.

Common use cases include game AI, robotics (teaching a robot to walk), recommendation engines, autonomous driving, and resource allocation. Reinforcement learning is powerful but much harder to set up than supervised or unsupervised learning, because you need to define the environment, the actions, and the reward function carefully.

### Neural Networks — How Deep Learning Works

A neural network is the most popular and powerful type of machine learning model. Despite the intimidating name, it is just layers of simple mathematical operations stacked on top of each other. Each layer transforms the data slightly, and by the time the data passes through all the layers, it has been transformed from raw input into a useful prediction.

The name "neural network" comes from a loose analogy to the human brain. Just as your brain has billions of neurons connected by synapses, a neural network has artificial neurons (mathematical functions) connected by weighted connections. But do not take the analogy too literally — artificial neural networks are much simpler than biological brains.

**How a single neuron works:** A neuron receives several input numbers. It multiplies each input by a weight (a number that represents how important that input is). It adds up all the weighted inputs, adds a bias term (a constant offset), and passes the result through an activation function (which introduces non-linearity — the ability to learn curved, complex patterns instead of only straight lines). The output of this neuron becomes one of the inputs to neurons in the next layer.

**How layers build understanding — the face recognition analogy:**

Imagine a neural network that recognises faces in photographs. The input is a grid of pixel values — just numbers representing colour intensity.

- **Layer 1** (closest to the input) learns to detect simple features: edges, lines, corners, colour gradients. It discovers, for instance, that a vertical line of high contrast often indicates the edge of an object.
- **Layer 2** combines those simple features into slightly more complex ones: curves, textures, basic shapes. It might learn that a specific arrangement of edges forms something that looks like an eye, or a nose, or a mouth.
- **Layer 3** combines those features into even higher-level concepts: face shapes, expressions, spatial relationships between features. It might learn that two eyes above a nose above a mouth, in the right proportions, forms a face.
- **Output layer** takes all of that high-level understanding and makes a final decision: "this is Person A with 97% confidence."

Each successive layer learns more abstract, more meaningful features. This hierarchical feature learning is what makes deep learning (deep = many layers) so powerful.

**Key vocabulary you need to know:**

- **Neuron** — a single computation unit that multiplies inputs by weights, adds a bias, and applies an activation function
- **Layer** — a group of neurons that process data in parallel at the same level of abstraction
- **Weight** — a number that represents how important each input is (these are what the network learns during training)
- **Bias** — a constant offset that helps the model fit the data better (like the y-intercept in a line equation)
- **Activation function** — a mathematical function that introduces non-linearity, allowing the network to learn complex, curved patterns (common ones: ReLU, sigmoid, softmax)
- **Loss function** — measures how wrong the model's predictions are (lower = better). The entire goal of training is to minimise this number
- **Backpropagation** — the algorithm that calculates how much each weight contributed to the error, then adjusts each weight to reduce the error. It works backwards from the output layer to the input layer, which is why it is called "back" propagation
- **Epoch** — one complete pass through the entire training dataset. Training typically involves many epochs (tens, hundreds, or thousands)
- **Learning rate** — how big a step the model takes when adjusting weights. Too high and it overshoots the optimal values; too low and training takes forever
- **Batch size** — how many training examples the model looks at before updating weights. Smaller batches mean more frequent updates but noisier gradients

### Model Evaluation Metrics

Building a model is only half the job. You also need to know whether it is actually good. Different problems need different metrics, and choosing the wrong metric can lead you to celebrate a model that is actually terrible.

**Accuracy** is the simplest metric: what percentage of predictions are correct? If your model correctly classifies 95 out of 100 emails, its accuracy is 95%. But accuracy can be deeply misleading. Imagine a dataset where 99% of emails are not spam. A model that simply predicts "not spam" for every email achieves 99% accuracy — but it is completely useless because it catches zero spam. This is the "accuracy paradox" for imbalanced datasets.

**Precision** answers: "Of all the things the model flagged as positive, how many actually were positive?" High precision means few false positives. This matters when false positives are expensive — for example, a spam filter with low precision would send legitimate emails to the spam folder, causing you to miss important messages.

**Recall** answers: "Of all the actual positive cases, how many did the model catch?" High recall means few false negatives. This matters when missing a positive case is dangerous — for example, a cancer detection system with low recall would miss actual cancer cases, which could be fatal.

**F1 Score** is the harmonic mean of precision and recall, giving you a single number that balances both. It is especially useful for imbalanced datasets where accuracy is misleading.

| Metric | What It Measures | When to Use |
|--------|-----------------|-------------|
| Accuracy | % of correct predictions | Balanced classes only |
| Precision | Of positive predictions, % actually positive | False positives are costly (spam filter) |
| Recall | Of actual positives, % correctly predicted | False negatives are costly (cancer detection) |
| F1 Score | Balance of precision and recall | Imbalanced classes |
| AUC-ROC | Model's ability to distinguish classes | Binary classification |
| MSE/RMSE | Average squared error | Regression (predicting numbers) |

### Overfitting vs Underfitting

These are the two most common failure modes in machine learning, and understanding them deeply will save you countless hours of debugging.

**Overfitting** happens when a model memorises the training data instead of learning general patterns. It performs brilliantly on training data but terribly on new, unseen data. The analogy: a student who memorises every answer in the textbook but cannot solve a slightly different problem on the exam. They have memorised, not understood.

Overfitting often happens when your model is too complex relative to the amount of training data. A model with millions of parameters trained on only a few hundred examples has enough capacity to memorise every example individually, rather than being forced to find general patterns. Signs of overfitting: training accuracy is very high (98%+) but validation accuracy is much lower (70%).

How to fix overfitting: get more training data (the single most effective fix), use regularisation (techniques like dropout that randomly disable neurons during training, forcing the network to be robust), simplify your model (fewer layers, fewer parameters), use data augmentation (create variations of existing training data), or use early stopping (stop training when validation performance starts getting worse).

**Underfitting** is the opposite problem: the model is too simple to capture the patterns in the data. It performs poorly on both training data and new data. The analogy: a student who tried to learn calculus but only studied basic arithmetic — their toolkit is too limited for the problem.

Signs of underfitting: both training accuracy and validation accuracy are low. How to fix underfitting: use a more complex model (more layers, more parameters), add more features (give the model more information to work with), train for more epochs, or reduce regularisation (you might be constraining the model too much).

### The ML Pipeline — Step by Step

Building a machine learning system is not just "throw data at an algorithm." It is a structured process with distinct stages. Here is the full pipeline:

1. **Define the problem** — What are you trying to predict? Is this classification (categories) or regression (numbers)? What does success look like? This step is underrated but crucial.

2. **Collect data** — Gather labelled examples. More data almost always beats a fancier model. The quality of your data matters more than the cleverness of your algorithm.

3. **Clean data** — Handle missing values, remove duplicates, fix inconsistent formats, deal with outliers. Data scientists spend 60-80% of their time on this step. It is unglamorous but essential.

4. **Split data** — Divide into training (70%), validation (15%), and test (15%) sets. The training set is what the model learns from. The validation set is what you use to tune hyperparameters. The test set is your final, unbiased evaluation — you only use it once, at the very end.

5. **Feature engineering** — Transform raw data into features the model can learn from. This might mean converting text to numbers, normalising values to the same scale, creating interaction features, or encoding categorical variables.

6. **Train the model** — Feed the training data to your chosen algorithm and let it learn. This is the part most people think of as "machine learning," but it is actually one of the shorter steps.

7. **Evaluate** — Measure performance on the validation set. Check accuracy, precision, recall, F1, or whatever metric matters for your problem.

8. **Tune hyperparameters** — Adjust settings like learning rate, number of layers, batch size, and regularisation strength. This is an iterative process.

9. **Test** — Final evaluation on the held-out test set. This gives you an unbiased estimate of how the model will perform in production.

10. **Deploy** — Put the model into production where it can make predictions on real data.

11. **Monitor** — Watch for model drift (the real-world data changing so the model's accuracy degrades over time). Retrain periodically with new data.`,
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
  },
  {
    "question": "A spam filter has 99% accuracy on a dataset where 99% of emails are NOT spam. Is this model good?",
    "options": [
      "Yes — 99% accuracy is excellent",
      "No — it could achieve 99% by always predicting 'not spam' and catching zero actual spam",
      "It depends on the F1 score",
      "You need more data to decide"
    ],
    "correctIndex": 1,
    "explanation": "This is the accuracy paradox. On an imbalanced dataset (99% negative, 1% positive), a model that always predicts 'not spam' gets 99% accuracy but is completely useless — it catches zero spam. You need precision and recall (or F1) to evaluate models on imbalanced data, not accuracy."
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
        estimatedMinutes: 45,
        order: 1,
        content: `## Building with LLM APIs

Large Language Models are the most transformative technology since the internet, and knowing how to integrate them into your applications is arguably the most valuable skill in software engineering today. This lesson teaches you how to use LLM APIs in production — not just how to call them, but how to call them well.

### Understanding How LLM APIs Work

When you call an LLM API, you are sending text to a remote server that runs a massive neural network. The model processes your text, generates a response token by token, and sends the result back. It is fundamentally a stateless process — the model does not remember previous conversations unless you explicitly send the conversation history with each request.

This is a crucial mental model: every API call is independent. The model receives your entire message, generates a response, and forgets everything. If you want a multi-turn conversation, you must send the full conversation history every time. This means your costs and latency grow with conversation length.

### API Basics — Your First LLM Call

Every major provider (Anthropic, OpenAI, Google) follows the same basic pattern: you send messages, you get a response. Here is a real example with Anthropic's Claude:

\`\`\`typescript
// # Import the Anthropic SDK
import Anthropic from "@anthropic-ai/sdk";

// # Create a client with your API key
// # The key is loaded from ANTHROPIC_API_KEY environment variable
const anthropic = new Anthropic();

// # Make a basic completion request
const response = await anthropic.messages.create({
  // # Which model to use — more capable models cost more
  model: "claude-sonnet-4-20250514",
  // # Maximum tokens in the response (1 token ≈ 4 characters)
  max_tokens: 1024,
  // # The conversation — an array of user/assistant messages
  messages: [
    { role: "user", content: "Explain quantum computing in one paragraph." }
  ],
});

// # The response contains an array of content blocks
// # Most responses have one text block
console.log(response.content[0].text);
\`\`\`

The response object contains more than just the text. It includes the model used, the stop reason (did it finish naturally or hit the token limit?), and usage statistics (how many tokens were consumed). You should log these in production for cost tracking and debugging.

### System Prompts — Setting the AI's Behaviour

The system prompt is the single most important piece of your LLM integration. It defines who the AI is, what it can and cannot do, and how it should behave. Think of it as the job description you give to a new employee on their first day.

A good system prompt is specific, structured, and anticipates edge cases. Vague prompts produce vague behaviour. Here is an example that shows the level of specificity you should aim for:

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  // # System prompt — this is the AI's "job description"
  // # Be specific about: identity, capabilities, rules, and format
  system: \`You are a customer support agent for TechCorp, a B2B SaaS company.

Identity:
- Your name is Alex
- You are friendly, professional, and concise
- You speak in British English

Capabilities:
- Answer questions about TechCorp products (CRM, Analytics, Billing)
- Help with account issues (password reset, billing inquiries)
- Guide users through common troubleshooting steps

Rules:
- NEVER discuss competitors by name — redirect to our strengths
- NEVER make promises about future features or timelines
- If you do not know the answer, say so honestly and offer to connect with a human agent
- Always verify the customer's account before discussing account-specific details

Response Format:
- Keep responses under 200 words
- Use numbered steps for procedures
- End complex answers with "Is there anything else I can help with?"\`,
  messages: [
    { role: "user", content: "How do I reset my password?" }
  ],
});
\`\`\`

Notice how the system prompt covers identity, capabilities, rules, and format. Each section eliminates a category of potential problems. Without the rules section, the model might casually mention competitors. Without the format section, responses might be inconsistent lengths.

### Streaming — Real-Time Responses

When a user asks a question, the model might take 5-10 seconds to generate a full response. Without streaming, the user stares at a loading spinner for those entire 5-10 seconds, wondering if the app is broken. With streaming, tokens appear on screen as they are generated — the total time is the same, but the perceived experience is dramatically better. It feels instant and alive instead of slow and broken.

Streaming is not optional for user-facing applications. It is a fundamental UX requirement.

\`\`\`typescript
// # Create a streaming response
const stream = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  stream: true,  // # This enables streaming
  messages: [{ role: "user", content: "Write a haiku about coding" }],
});

// # Process each event as it arrives
for await (const event of stream) {
  // # "content_block_delta" events contain new text tokens
  if (
    event.type === "content_block_delta" &&
    event.delta.type === "text_delta"
  ) {
    // # Write each token immediately — do not buffer
    process.stdout.write(event.delta.text);
  }
}
\`\`\`

In a web application, you would use Server-Sent Events (SSE) or the AI SDK's streaming helpers to pipe these tokens to the browser in real time. The Vercel AI SDK makes this particularly easy with React hooks like \`useChat\`.

### Function Calling (Tool Use) — The Most Powerful Pattern

Function calling (also called "tool use") lets the LLM call functions in your application. This is what transforms a chatbot from a text generator into an intelligent agent that can search databases, place orders, send emails, and interact with the real world.

Here is how it works: you describe your functions to the model (name, description, parameter schema), and the model decides when and how to call them. You then execute the function, send the result back to the model, and it uses the result to formulate its response.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  // # Define the tools the model can use
  tools: [
    {
      name: "get_weather",
      // # Clear description helps the model decide WHEN to use this tool
      description: "Get current weather conditions for a city. Returns temperature, conditions, humidity, and wind speed.",
      // # JSON Schema defining the function's parameters
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name, e.g. 'London' or 'Tokyo'",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit. Default celsius.",
          },
        },
        required: ["location"],
      },
    },
  ],
  messages: [{ role: "user", content: "What's the weather in London?" }],
});

// # Check if the model wants to use a tool
for (const block of response.content) {
  if (block.type === "tool_use") {
    // # The model has decided to call get_weather
    // # block.input contains: { location: "London", unit: "celsius" }
    console.log("Tool called:", block.name, block.input);

    // # Execute the actual function (your real weather API call)
    const weather = await getWeatherFromAPI(block.input.location);

    // # Send the result back to continue the conversation
    const followUp = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        { role: "user", content: "What's the weather in London?" },
        { role: "assistant", content: response.content },
        {
          role: "user",
          content: [{
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(weather),
          }],
        },
      ],
    });
    // # The model now responds with a natural language answer
    // # incorporating the real weather data
  }
}
\`\`\`

The key insight about function calling is that the model decides WHEN to call functions based on the user's message and the tool descriptions. If the user asks about weather, the model calls the weather tool. If the user asks about something else, it does not. This decision-making ability is what makes agents possible.

### Production Patterns — Building Robust LLM Features

In production, LLM API calls can fail. Rate limits, network issues, server overloads, and malformed responses all happen regularly. You need robust error handling.

**Retry with exponential backoff:**

\`\`\`typescript
// # Retry failed API calls with increasing delays
// # 1st retry: 1 second, 2nd: 2 seconds, 3rd: 4 seconds
async function callLLMWithRetry(prompt: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error: any) {
      // # If this was our last attempt, throw the error
      if (attempt === maxRetries - 1) throw error;

      // # Rate limit errors (429) — respect the retry-after header
      if (error.status === 429) {
        const retryAfter = error.headers?.["retry-after"] || Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      // # Server errors (500, 502, 503) — retry with backoff
      if (error.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // # Client errors (400, 401, 403) — do not retry, fix the request
      throw error;
    }
  }
}
\`\`\`

**Token budget management:**

Tokens are the currency of LLM APIs. Every character of input and output costs tokens, and tokens cost money. Understanding and managing your token budget is essential.

\`\`\`typescript
// # Rough estimate: 1 token ≈ 4 English characters ≈ 0.75 words
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// # Set max_tokens based on the task — do not over-allocate
const MAX_TOKENS_BY_TASK = {
  classification: 50,     // # "positive" or "negative" — very short
  yesNo: 10,              // # Just "yes" or "no"
  summary: 500,           // # A paragraph
  emailDraft: 1000,       // # A full email
  codeGeneration: 4000,   // # Substantial code block
  longForm: 8000,         // # Article or documentation
};
\`\`\`

### Cost Optimization — Real Strategies That Work

LLM costs can spiral quickly in production. Here are the most effective strategies, ordered by impact:

| Strategy | Expected Savings | Effort |
|----------|-----------------|--------|
| Model routing (cheap for simple, expensive for complex) | 50-80% | Medium |
| Caching identical or similar requests | 20-40% | Low |
| Prompt optimization (shorter prompts, fewer examples) | 10-30% | Low |
| Setting appropriate max_tokens | 5-15% | Trivial |
| Batching multiple items in one request | 10-20% | Medium |
| Using streaming (same cost but better UX) | 0% (but feels faster) | Low |

The single highest-impact optimization is model routing: use a cheap, fast model (like Claude Haiku) for simple tasks (classification, extraction, short answers) and route only complex tasks (reasoning, code generation, creative writing) to expensive models (like Claude Opus). If 80% of your traffic is simple tasks, routing alone can cut costs by 60-70%.`,
      },
      {
        title: "Structured Output & Tool Use",
        slug: "structured-output-tool-use",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## Structured Output & Tool Use

Getting an LLM to generate free-form text is easy. Getting it to generate reliable, parseable, structured data that your application can actually use — that is the real engineering challenge. This lesson teaches you three techniques for getting structured output, when to use each one, and how to handle the inevitable edge cases.

### Why Free-Form Output Breaks Applications

When you ask an LLM "extract the product name and price from this text," you might expect a consistent response. But LLMs are probabilistic — they generate different outputs each time, even for the same input. One call might return "The product is Widget Pro at $29.99," another might return "Product: Widget Pro, Price: $29.99," and a third might return something in JSON-like format but with single quotes instead of double quotes (which is invalid JSON).

If your code expects JSON and the model returns prose, your application crashes. If your code expects a specific field name and the model uses a synonym, your application crashes. This inconsistency is the fundamental challenge of building reliable software on top of LLMs.

\`\`\`typescript
// # The problem: unpredictable output format
// # Ask: "Extract the product name and price"
// # Response 1: "The product is Widget Pro and costs $29.99"
// # Response 2: "Product: Widget Pro, Price: $29.99"
// # Response 3: "{ name: 'Widget Pro', price: 29.99 }" // Invalid JSON!
// # Response 4: "widget pro - $29.99"
// # Your JSON.parse() call fails on all of these
\`\`\`

The solution is to force the model to return structured data through one of three techniques, each with different trade-offs in reliability, complexity, and flexibility.

### Technique 1: JSON Mode via System Prompt

The simplest approach is to instruct the model to return JSON in a specific schema. This works surprisingly well for simple structures, especially with Claude and GPT-4 class models. The key is to be extremely specific about the schema and to validate the output.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  // # Be very explicit about the expected format
  system: \`You extract product information from text.
Return ONLY valid JSON matching this exact schema:
{
  "name": "string — the product name",
  "price": number — the price as a decimal (not a string),
  "currency": "string — three-letter currency code (USD, GBP, EUR)",
  "inStock": boolean — true if available, false if out of stock,
  "features": ["string"] — list of product features mentioned
}

Rules:
- Output ONLY the JSON object. No markdown fences. No explanation.
- If a field is not mentioned in the text, use null.
- Price must be a number, not a string. Correct: 29.99. Wrong: "$29.99".\`,
  messages: [{ role: "user", content: productDescription }],
});

// # Always validate the output with Zod
import { z } from "zod";

const productSchema = z.object({
  name: z.string(),
  price: z.number().nullable(),
  currency: z.string().length(3).nullable(),
  inStock: z.boolean().nullable(),
  features: z.array(z.string()),
});

// # Parse and validate — this throws if the model returned garbage
try {
  const product = productSchema.parse(JSON.parse(response.content[0].text));
  // # product is now fully typed and validated
} catch (error) {
  // # Handle parsing failure — retry or fall back
  console.error("Failed to parse LLM response:", error);
}
\`\`\`

This technique is simple and works well for prototyping, but it has reliability issues. The model might occasionally add explanatory text before or after the JSON, include markdown code fences, or produce subtly invalid JSON. Always validate with Zod or a similar schema validator, and have a retry strategy.

### Technique 2: Tool Use (Function Calling) — The Production Standard

Tool use (also called function calling) is the most reliable way to get structured output from an LLM. Instead of asking the model to generate JSON text, you define a function with typed parameters, and the model fills in those parameters. The API handles serialization, so you never get malformed JSON.

Think of the difference like this: JSON mode is like asking someone to write a JSON object from scratch. Tool use is like handing them a form to fill in. The form approach is far more reliable because the structure is enforced by the system, not by the model's output generation.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [{
    name: "save_contact",
    // # Description helps the model understand WHEN to use this tool
    description: "Save an extracted contact to the database. Extract all available fields from the provided text.",
    // # JSON Schema for the function parameters
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Full name of the person",
        },
        email: {
          type: "string",
          description: "Email address if mentioned",
        },
        phone: {
          type: "string",
          description: "Phone number in international format if mentioned",
        },
        company: {
          type: "string",
          description: "Company or organisation name if mentioned",
        },
        role: {
          type: "string",
          description: "Job title or role if mentioned",
        },
        linkedin: {
          type: "string",
          description: "LinkedIn profile URL if mentioned",
        },
      },
      required: ["name"],
    },
  }],
  // # Force the model to use this specific tool
  // # Without this, the model might just respond with text
  tool_choice: { type: "tool", name: "save_contact" },
  messages: [{ role: "user", content: businessCardText }],
});

// # Extract the structured data from the tool use block
const toolBlock = response.content.find(b => b.type === "tool_use");
if (toolBlock) {
  const contact = toolBlock.input;
  // # contact is now: { name: "Jane Smith", email: "jane@corp.com", ... }
  // # The structure is guaranteed by the API — no parsing needed
}
\`\`\`

The \`tool_choice\` parameter is important. Without it, the model might decide to just answer with text instead of using the tool. Setting \`tool_choice: { type: "tool", name: "save_contact" }\` forces the model to use that specific tool, guaranteeing you get structured output.

### Technique 3: AI SDK Structured Generation

The Vercel AI SDK provides the highest-level abstraction for structured output. It combines Zod schemas with LLM calls to give you fully typed, validated objects with minimal boilerplate. This is the recommended approach for Next.js applications.

\`\`\`typescript
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// # Define your schema with Zod — this becomes both
// # the TypeScript type AND the LLM's output constraint
const recipeSchema = z.object({
  recipe: z.object({
    name: z.string().describe("The recipe name"),
    cuisine: z.string().describe("The cuisine type (Italian, Japanese, etc.)"),
    servings: z.number().int().min(1).describe("Number of servings"),
    prepTime: z.number().int().describe("Preparation time in minutes"),
    cookTime: z.number().int().describe("Cooking time in minutes"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    ingredients: z.array(z.object({
      item: z.string(),
      amount: z.string().describe("e.g. '2 cups', '500g', '1 tablespoon'"),
      optional: z.boolean().default(false),
    })),
    steps: z.array(z.string().describe("One step per string")),
    tips: z.array(z.string()).optional().describe("Chef's tips"),
  }),
});

// # generateObject handles the LLM call, parsing, and validation
const { object } = await generateObject({
  model: anthropic("claude-sonnet-4-20250514"),
  schema: recipeSchema,
  prompt: "Create a recipe for chocolate brownies",
});

// # object.recipe is FULLY TYPED — TypeScript knows every field
console.log(object.recipe.name);        // string
console.log(object.recipe.ingredients); // { item: string, amount: string, optional: boolean }[]
console.log(object.recipe.steps);       // string[]
\`\`\`

The beauty of this approach is that your Zod schema serves triple duty: it defines the TypeScript type (so you get autocomplete and type checking), it tells the LLM what structure to produce, and it validates the output at runtime. One schema, three benefits.

### When to Use Each Technique

| Technique | Reliability | Best For | Avoid When |
|-----------|------------|----------|------------|
| JSON in system prompt | Medium (85-95%) | Quick prototyping, simple schemas | Production systems, complex nested objects |
| Tool use / function calling | High (98%+) | Production APIs, any language/framework | You need the simplicity of raw prompting |
| AI SDK generateObject | Highest (99%+) | Next.js / TypeScript apps | Non-TypeScript projects |
| Multiple tool choices | High (98%+) | When the model needs to choose an action | Single-purpose extraction |

In production, always validate the output regardless of which technique you use. Even tool use can occasionally produce unexpected values (a string where you expected a number, for example). Zod validation is your safety net.`,
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
  },
  {
    "question": "You're building a customer support AI. The system prompt says 'never discuss competitors.' A user asks 'Is your product better than CompetitorX?' and the model starts comparing them. What went wrong?",
    "options": [
      "The model is too smart to follow instructions",
      "System prompts are just suggestions — the model can ignore them",
      "The system prompt needs more explicit rules with examples of HOW to redirect, not just what to avoid",
      "You need a bigger model"
    ],
    "correctIndex": 2,
    "explanation": "Negative constraints alone ('never discuss competitors') are weaker than positive instructions with examples. Add: 'If asked about competitors, redirect by saying: I can only speak to our products. Here is how we can help with [their need]...' Show the model WHAT to do instead, not just what NOT to do. Models follow demonstrated behaviour better than abstract rules."
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
        estimatedMinutes: 50,
        order: 1,
        content: `## RAG — Retrieval-Augmented Generation

RAG is the technique that lets LLMs answer questions about YOUR data — your company documents, knowledge base, product manuals, internal wikis — without fine-tuning the model. It is one of the most important patterns in AI engineering because it solves the fundamental problem of LLMs: they only know what they were trained on, and they cannot access your private data.

### The Problem RAG Solves

Imagine you have built a customer support chatbot for your company. A customer asks: "What is your refund policy for enterprise accounts?" The LLM has no idea. It was trained on the public internet, not your internal policy documents. It has two options: refuse to answer (unhelpful) or make something up (dangerous). Neither is acceptable.

RAG solves this by retrieving relevant documents from your knowledge base and including them in the prompt. Now the LLM has the actual refund policy in front of it and can give an accurate, grounded answer. The model is augmented with retrieved information — hence "Retrieval-Augmented Generation."

**Without RAG:** "What is our refund policy?" → LLM guesses or makes something up (hallucination)

**With RAG:** "What is our refund policy?" → System finds the policy document → LLM reads it and answers based on the real policy

### How RAG Works — The Two-Phase Process

RAG has two distinct phases: indexing (done once, when you set up the system) and querying (done every time a user asks a question).

**Phase 1: Indexing (offline, one-time setup)**

During indexing, you process your documents and prepare them for fast retrieval. This phase happens before any user interacts with the system.

1. **Load documents** — Gather all the documents you want the AI to know about. These might be PDFs, web pages, database records, markdown files, or any other text format. You need a document loader for each format.

2. **Split into chunks** — Individual documents are often too long to include entirely in a prompt (LLMs have context limits). You split each document into smaller pieces called "chunks," typically 200-1000 tokens each. How you split matters enormously — we will cover chunking strategies in detail.

3. **Generate embeddings** — For each chunk, you generate an "embedding" — a list of numbers (a vector) that captures the chunk's meaning. Semantically similar chunks produce similar vectors. This is what enables semantic search.

4. **Store in a vector database** — You store the embeddings alongside the original text in a specialised database designed for fast similarity search.

**Phase 2: Querying (online, per request)**

When a user asks a question, the query phase finds relevant chunks and generates an answer.

1. **Embed the query** — Convert the user's question into an embedding using the same model you used during indexing.

2. **Search for similar chunks** — Compare the query embedding against all stored chunk embeddings to find the most similar ones. This is called "nearest neighbour search." The vector database handles this efficiently, even with millions of chunks.

3. **Build the prompt** — Construct a prompt that includes the retrieved chunks as context, along with instructions for the model.

4. **Generate the answer** — Send the prompt to the LLM. The model reads the provided context and generates an answer grounded in your actual documents.

### Embeddings — The Secret Sauce

Embeddings are the technology that makes RAG possible. An embedding model converts text into a list of numbers (typically 768 to 3072 numbers) that represents the text's meaning in a high-dimensional space. The crucial property is that texts with similar meanings produce similar numbers.

\`\`\`typescript
// # Generate an embedding for a query
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "How do I reset my password?",
});
// # Returns something like: [0.023, -0.041, 0.089, ...] (1536 numbers)
\`\`\`

Why does this work? The embedding model has been trained on billions of text pairs to place semantically similar texts close together in vector space. So the vector for "reset password" is mathematically close to the vector for "change password," "forgot my login credentials," and "account access recovery" — even though these phrases use completely different words. This is what makes semantic search so much more powerful than keyword search.

You can measure the similarity between two embeddings using cosine similarity — a number between -1 and 1, where 1 means identical meaning and 0 means unrelated. The vector database computes this for you during search.

### Chunking Strategies — The Most Underrated Decision

How you split your documents into chunks has a bigger impact on RAG quality than which embedding model or vector database you choose. Bad chunking leads to bad retrieval leads to bad answers. Here is a deep dive into the main strategies:

**Fixed-size chunking** splits text every N characters or tokens, regardless of content. It is simple and predictable, but it often slices sentences and paragraphs in half, losing important context.

**Paragraph-based chunking** splits on paragraph breaks. This preserves natural thought units and works well for well-structured documents (blog posts, documentation). It struggles with documents that have very long or very short paragraphs.

**Recursive chunking** is the most sophisticated common strategy. It tries to split at the highest-level boundary possible (sections, then paragraphs, then sentences), only falling to lower levels when chunks would be too large. This preserves the most context.

**Overlap** is a modifier you apply to any strategy. Each chunk includes a number of tokens from the end of the previous chunk. This ensures that information spanning a chunk boundary appears completely in at least one chunk. Typical overlap: 100-200 tokens.

| Strategy | How | Best For | Weakness |
|----------|-----|---------|----------|
| Fixed size | Every N tokens | Simple, predictable | Cuts mid-sentence |
| Paragraph | On paragraph breaks | Well-structured docs | Uneven chunk sizes |
| Semantic | When topic changes | Long, varied documents | Expensive to compute |
| Recursive | By hierarchy (section → para → sentence) | Mixed content | More complex to implement |

**Best practice for production:** Use recursive splitting with 200-token overlap and 500-token chunk size. This gives you a good balance of context preservation and retrieval granularity. Adjust based on your specific documents and testing.

### Vector Databases — Where Embeddings Live

A vector database is optimised for storing and searching high-dimensional vectors. Regular databases can store the vectors, but they cannot search them efficiently. Vector databases use specialised indexing algorithms (like HNSW — Hierarchical Navigable Small World) to find the nearest neighbours in milliseconds, even with millions of vectors.

| Database | Type | Best For | Pricing Model |
|----------|------|---------|---------------|
| Pinecone | Managed cloud | Production apps, zero ops | Per-vector storage + queries |
| Weaviate | Open source / cloud | Self-hosted, hybrid search | Free (self-hosted) or managed |
| ChromaDB | Lightweight, embedded | Prototyping, local dev | Free, runs in-process |
| pgvector | PostgreSQL extension | Already using PostgreSQL | Free extension |
| Qdrant | Open source / cloud | High performance, filtering | Free (self-hosted) or managed |

For most applications, start with ChromaDB for prototyping (it runs in-process, zero setup), then move to Pinecone or Qdrant for production.

### Building the Prompt — Where Context Meets Question

The prompt you build determines how well the LLM uses the retrieved context. A good RAG prompt has three parts: instructions, context, and the question.

\`\`\`typescript
function buildRAGPrompt(question: string, chunks: string[]): string {
  return \`You are a helpful assistant that answers questions based on provided documents.

INSTRUCTIONS:
- Answer the user's question based ONLY on the context provided below
- If the context does not contain enough information to answer, say "I don't have enough information to answer that based on the available documents"
- NEVER make up information that is not in the context
- Cite which source number you used: [Source 1], [Source 2], etc.
- Be concise but complete

CONTEXT:
\${chunks.map((c, i) => \`[Source \${i + 1}]: \${c}\`).join("\\n\\n")}

USER QUESTION: \${question}

ANSWER:\`;
}
\`\`\`

The instruction to answer ONLY from the provided context is critical. Without it, the model will freely mix its general knowledge with the retrieved context, and you will not know which parts are grounded in your documents and which parts are hallucinated.

### Common RAG Pitfalls and Their Solutions

| Problem | Symptom | Root Cause | Solution |
|---------|---------|------------|----------|
| Irrelevant chunks retrieved | Answers are off-topic | Bad chunking or no metadata filtering | Improve chunking, add metadata filters |
| Answer contradicts sources | Model says X, document says Y | Model's training conflicts with context | Strengthen "only use context" instruction |
| Hallucination despite context | Answer includes made-up facts | Context is partial, model fills gaps | Add explicit "say I don't know" instruction |
| Missing information | "I don't know" when the answer IS in the docs | Chunks are too small, important context split | Increase chunk size and overlap |
| Slow retrieval | 2+ seconds per query | Too many vectors, no ANN index | Add HNSW or IVF index to vector DB |
| Outdated answers | Answer uses old information | Documents not refreshed | Build a document refresh pipeline |`,
      },
      {
        title: "Advanced RAG Techniques",
        slug: "advanced-rag",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## Advanced RAG Techniques

Basic RAG — embed, search, prompt — gets you about 70% of the way to a good system. These advanced techniques close the remaining gap and are what separate a prototype from a production-quality system.

### Hybrid Search — Best of Both Worlds

Vector search excels at understanding meaning. If a user asks "how to fix login issues," vector search finds documents about "authentication errors" and "password problems" — even though those phrases share no keywords. But vector search has a blind spot: exact terms. If a user asks "what is error code E-4021?", vector search might return documents about E-4022 or E-4019 because they are semantically similar. But the user needs the exact match.

Keyword search (BM25) does the opposite. It excels at exact matches but fails at understanding meaning. "Fix login issues" would not match a document about "authentication errors" because the keywords are different.

Hybrid search combines both, giving you semantic understanding AND exact matching. This is essential for any RAG system that deals with codes, IDs, product names, or technical terms.

\`\`\`typescript
// # Hybrid search: combine vector similarity with keyword matching
async function hybridSearch(query: string, topK: number = 5) {
  // # Step 1: Vector search — finds semantically similar content
  // # Good at: "how do I change my password" → finds "credential reset guide"
  const embedding = await generateEmbedding(query);
  const vectorResults = await vectorDB.search(embedding, topK * 2);

  // # Step 2: Keyword search (BM25) — finds exact term matches
  // # Good at: "error E-4021" → finds the exact error code document
  const keywordResults = await fullTextSearch(query, topK * 2);

  // # Step 3: Reciprocal Rank Fusion (RRF) — merge both result sets
  // # RRF assigns a score based on rank position, then combines
  // # This is better than raw score combination because vector and
  // # keyword scores are on different scales
  const scored = new Map<string, number>();
  const k = 60; // # RRF constant (standard value, rarely needs tuning)

  vectorResults.forEach((doc, rank) => {
    const currentScore = scored.get(doc.id) || 0;
    scored.set(doc.id, currentScore + 1 / (k + rank + 1));
  });

  keywordResults.forEach((doc, rank) => {
    const currentScore = scored.get(doc.id) || 0;
    scored.set(doc.id, currentScore + 1 / (k + rank + 1));
  });

  // # Documents that appear in BOTH searches get boosted scores
  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK);
}
\`\`\`

### Query Rewriting — Fixing Bad Questions

Users are not search experts. They ask vague, poorly-worded, or context-dependent questions. "Why is it slow?" could mean anything. Query rewriting uses an LLM to transform the user's question into better search queries.

The key insight is that you can generate MULTIPLE rewrites and search with all of them, merging the results. This dramatically improves recall — the percentage of relevant documents you find.

\`\`\`typescript
// # Use an LLM to generate better search queries from the user's question
async function rewriteQuery(originalQuery: string): Promise<string[]> {
  const response = await llm.generate({
    system: \`You are a search query optimizer. Given a user question,
generate 3 alternative phrasings that might match relevant documents better.
Consider synonyms, more specific terms, and different angles on the same topic.
Return as a JSON array of strings. No other text.\`,
    user: originalQuery,
  });

  // # Parse the alternative queries
  const alternatives = JSON.parse(response);

  // # Return original + alternatives — search with ALL of them
  return [originalQuery, ...alternatives];
}

// # Example: "why is my app slow" generates:
// # ["why is my app slow",
// #  "application performance optimization techniques",
// #  "diagnosing slow page load times and high latency",
// #  "web application speed debugging guide"]
// # Each query might match different relevant documents
\`\`\`

### Re-Ranking — Finding the Real Best Results

Initial vector search is fast but approximate. It uses embedding similarity, which captures meaning but misses nuance. Re-ranking takes the initial results and uses a more expensive, more accurate model to pick the truly best matches.

Think of it like a job application process: the initial search is the resume screen (fast, approximate), and re-ranking is the interview (slower, more accurate). You screen 100 resumes quickly, then interview the top 20 carefully.

\`\`\`typescript
async function retrieveAndRerank(query: string) {
  // # Step 1: Cast a wide net — retrieve many candidates cheaply
  const candidates = await vectorDB.search(queryEmbedding, 20);

  // # Step 2: Re-rank with an LLM — expensive but accurate
  // # The LLM reads each document and rates its actual relevance
  const reranked = await llm.generate({
    system: \`You are a document relevance judge. For each document,
rate how relevant it is to answering the user's query on a scale of 1-10.
10 = directly answers the question
7-9 = contains highly relevant information
4-6 = somewhat relevant, tangentially related
1-3 = not relevant to the query
Return JSON: [{ "index": number, "score": number, "reason": string }]\`,
    user: \`Query: \${query}

Documents:
\${candidates.map((c, i) => \`[Document \${i}]: \${c.text.slice(0, 300)}\`).join("\\n\\n")}\`,
  });

  // # Step 3: Sort by re-ranked score and take the best
  return JSON.parse(reranked)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5)
    .map((r: any) => candidates[r.index]);
}
\`\`\`

### Metadata Filtering — Narrowing the Search Space

Not every document is relevant to every query. If a user asks about enterprise pricing, you should not search your entire knowledge base — just the pricing documents. Metadata filtering lets you narrow the search space before doing vector similarity, which improves both speed and relevance.

\`\`\`typescript
// # When indexing, attach metadata to each chunk
const chunk = {
  text: "Our enterprise plan starts at $499/month for up to 50 users...",
  embedding: await generateEmbedding(text),
  metadata: {
    source: "pricing-page",         // # Where this content came from
    category: "pricing",            // # Topic category
    audience: "enterprise",         // # Who it is for
    lastUpdated: "2026-01-15",      // # When it was last verified
    product: "CRM",                 // # Which product it relates to
  },
};

// # When querying, filter by relevant metadata BEFORE vector search
const results = await vectorDB.search(queryEmbedding, 10, {
  filter: {
    category: "pricing",                    // # Only pricing docs
    lastUpdated: { $gte: "2025-01-01" },    // # Only recent docs
    audience: { $in: ["enterprise", "all"] }, // # Enterprise-relevant
  },
});
// # Now vector search only runs on the filtered subset — faster and more relevant
\`\`\`

Good metadata design is an investment that pays dividends. Spend time thinking about what metadata will be useful for filtering, and tag your documents thoroughly during indexing.

### RAG Evaluation — How to Know If Your RAG System Is Good

You cannot improve what you do not measure. RAG evaluation has four dimensions:

**Retrieval quality** — Are the right documents being found?
- Retrieval Precision: What percentage of retrieved documents are actually relevant?
- Retrieval Recall: Of all relevant documents in your database, what percentage did you find?

**Answer quality** — Is the generated answer good?
- Faithfulness: Is the answer supported by the retrieved context? (No hallucinations?)
- Relevance: Does the answer actually address the user's question?
- Completeness: Does the answer cover all relevant points from the context?

You can measure these automatically using LLM-as-judge: have a separate LLM evaluate the answer quality against the source documents and the original question.`,
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
  },
  {
    "question": "You have 500,000 documents in your vector database. Searches take 3 seconds per query. How do you speed this up without removing documents?",
    "options": [
      "Use a faster embedding model",
      "Add metadata filters to narrow the search space before vector search, and ensure HNSW indexing is enabled",
      "Reduce the embedding dimensions",
      "Switch to keyword-only search"
    ],
    "correctIndex": 1,
    "explanation": "Two complementary fixes: (1) Metadata filtering reduces the number of vectors that need to be compared — if you can filter to a relevant category first, you might search 10,000 vectors instead of 500,000. (2) HNSW (Hierarchical Navigable Small World) indexing is an approximate nearest-neighbor algorithm that trades a tiny amount of accuracy for massive speed improvements — from O(n) to O(log n). Most vector databases support HNSW but it may need to be explicitly enabled or configured."
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
        estimatedMinutes: 45,
        order: 1,
        content: `## Advanced Prompting Techniques

Prompt engineering is the art and science of communicating effectively with large language models. The difference between a good prompt and a bad prompt is often the difference between a toy demo and a production-ready AI feature. A well-engineered prompt gets consistent, reliable, structured output every single time.

Many developers underestimate prompt engineering because it looks like "just writing text." But think of it this way: a prompt is a program written in natural language. Like any program, it can have bugs, edge cases, and ambiguities. And like any program, it benefits from clear structure, thorough testing, and iterative refinement.

### Zero-Shot vs Few-Shot Prompting

**Zero-shot prompting** means giving the model instructions without any examples. You describe what you want and trust the model to figure it out:

\`\`\`
Classify this customer review as positive, negative, or neutral:
"The product arrived late but the quality was excellent."
\`\`\`

This works surprisingly well for simple tasks. But when you need consistent formatting, specific decision boundaries, or handling of edge cases, zero-shot prompting often falls short. The model might return "Positive" one time and "positive" the next. It might return "Mixed — positive quality but negative delivery" when you need a single category.

**Few-shot prompting** provides examples that demonstrate exactly what you want. This is dramatically more reliable:

\`\`\`
Classify customer reviews as positive, negative, or neutral.
Output ONLY the category name in lowercase.

Review: "Absolutely love this product! Best purchase ever."
Classification: positive

Review: "Broken on arrival, terrible experience. Want a refund."
Classification: negative

Review: "It's okay, nothing special. Does what it says."
Classification: neutral

Review: "Great quality but shipping was painfully slow."
Classification: positive

Review: "The product arrived late but the quality was excellent."
Classification:
\`\`\`

Notice how the examples establish the format (lowercase, single word) and the decision boundary (positive quality outweighs negative logistics). The fourth example is deliberately chosen to show how to handle mixed reviews — this teaches the model your specific classification policy.

Few-shot prompting consistently outperforms zero-shot for classification, formatting, and any task where consistency matters. The investment in creating good examples pays for itself many times over.

### Chain-of-Thought (CoT) — Teaching the Model to Think

Chain-of-thought prompting forces the model to show its reasoning step by step before giving a final answer. This dramatically improves accuracy on math, logic, and multi-step reasoning problems.

Without CoT, the model tries to jump directly to the answer — and often gets it wrong, especially for problems that require multiple steps:

\`\`\`
Question: A store sells apples for $2 each. You have $15 and a $3 coupon.
How many apples can you buy?
Answer: 7     ← Wrong! The model guessed instead of calculating.
\`\`\`

With CoT, the model works through the problem methodically:

\`\`\`
Question: A store sells apples for $2 each. You have $15 and a $3 coupon.
How many apples can you buy? Think step by step.

Answer:
Step 1: Calculate total budget. $15 cash + $3 coupon = $18 total.
Step 2: Calculate how many apples. $18 ÷ $2 per apple = 9 apples.
Final answer: 9 ✓
\`\`\`

The magic phrase is "think step by step" (or "let's work through this" or "show your reasoning"). These phrases trigger the model to generate intermediate reasoning steps, which dramatically improves accuracy.

CoT is not just for math. It works for any multi-step reasoning: debugging code, analyzing legal documents, making strategic decisions, and evaluating complex situations. Whenever the task requires more than one logical step, use CoT.

### Prompt Templates — Building Reusable, Testable Prompts

In production, you should never write prompts inline. Build reusable prompt templates that are easy to test, version, and iterate on:

\`\`\`typescript
// # Prompt templates as functions — reusable across your application
const PROMPTS = {
  // # Summarization template — control length and style
  summarize: (text: string, maxWords: number) => ({
    system: "You are a concise technical writer. Output ONLY the summary, no preamble.",
    user: \`Summarize the following text in at most \${maxWords} words.
Preserve the key facts and conclusions. Use active voice.

TEXT:
\${text}\`,
  }),

  // # Classification template — force consistent output
  classify: (text: string, categories: string[]) => ({
    system: \`You are a text classifier. Classify the input into exactly one of these categories:
\${categories.join(", ")}.
Output ONLY the category name in lowercase. Nothing else — no punctuation, no explanation.\`,
    user: text,
  }),

  // # Entity extraction template — structured JSON output
  extractEntities: (text: string) => ({
    system: \`Extract named entities from the text.
Return ONLY valid JSON matching this schema:
{
  "people": ["string"],
  "organizations": ["string"],
  "locations": ["string"],
  "dates": ["string"]
}
If a category has no entities, use an empty array []. No other text.\`,
    user: text,
  }),
};
\`\`\`

### Prompt Testing — Your Prompts Need Tests

You would never ship code without tests. You should not ship prompts without tests either. Prompt testing is one of the most underrated practices in AI engineering.

\`\`\`typescript
// # Define test cases with expected outputs
const sentimentTestCases = [
  // # Clear cases
  { input: "I love this product!", expected: "positive" },
  { input: "Terrible, waste of money", expected: "negative" },
  { input: "It works as described", expected: "neutral" },

  // # Edge cases — these are the important ones
  { input: "Great quality but awful shipping", expected: "positive" },
  { input: "Not bad, could be better", expected: "neutral" },
  { input: "", expected: "neutral" },                    // Empty input
  { input: "🔥🔥🔥", expected: "positive" },              // Emoji only
  { input: "The product didn't not disappoint", expected: "positive" }, // Double negative
];

// # Run tests and measure accuracy
let passed = 0;
for (const testCase of sentimentTestCases) {
  const result = await classifySentiment(testCase.input);
  const success = result === testCase.expected;
  if (success) passed++;
  console.log(
    success ? "PASS" : "FAIL",
    \`"\${testCase.input}" → Expected: \${testCase.expected}, Got: \${result}\`
  );
}
console.log(\`\\nAccuracy: \${passed}/\${sentimentTestCases.length} (\${Math.round(passed / sentimentTestCases.length * 100)}%)\`);
\`\`\`

Run these tests every time you change your prompt. A change that improves one case might break three others. Automated prompt testing catches regressions before they reach production.

### Best Practices Summary

| Technique | When to Use | Impact |
|-----------|-------------|--------|
| Be specific and structured | Always | High — vague prompts get vague answers |
| Few-shot examples (3-5) | Classification, formatting, style matching | Very high — most reliable format control |
| Chain-of-thought | Math, reasoning, multi-step logic | Very high — 20-40% accuracy improvement |
| Role assignment ("You are a...") | When persona affects output quality | Medium — sets tone and expertise level |
| Output format specification | When you need structured data (JSON, CSV) | High — prevents parsing failures |
| Negative constraints ("Never...") | Preventing specific failure modes | Medium — pair with positive alternatives |
| Temperature = 0 | Deterministic tasks (classification, extraction) | High — consistent, reproducible output |
| Temperature = 0.7-1.0 | Creative tasks (writing, brainstorming) | Medium — more varied, creative output |`,
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
      "Convert to lowercase in your code after receiving the response",
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
  },
  {
    "question": "You changed your classification prompt to improve accuracy on edge cases, but now it gets simple cases wrong. What should you have done?",
    "options": [
      "Used a bigger model that handles everything",
      "Maintained a test suite of existing cases and run it before deploying any prompt change",
      "Kept the old prompt and accepted the edge case failures",
      "Fine-tuned instead of prompting"
    ],
    "correctIndex": 1,
    "explanation": "Prompt changes are code changes — they need regression testing. A test suite of 20-50 representative cases (including the edge cases you are trying to fix AND the simple cases that already work) catches regressions before they reach production. Run the full test suite every time you modify a prompt. The discipline of prompt testing is what separates reliable AI features from fragile demos."
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
        estimatedMinutes: 50,
        order: 1,
        content: `## Designing AI Systems for Production

There is a massive gap between a working demo and a production AI system. A demo needs to work once, impressively, in controlled conditions. A production system needs to work every time, reliably, at scale, within budget, safely, and with graceful degradation when things go wrong. This lesson covers the architectural patterns, evaluation strategies, safety guardrails, and monitoring practices that bridge that gap.

### Architecture Patterns — Choosing the Right Design

There are four fundamental architecture patterns for AI systems. Most production systems are one of these patterns or a combination:

**Pattern 1: Simple API Call (Direct Inference)**

This is the simplest pattern. User input goes to your API, your API calls the LLM, and the response comes back. No retrieval, no tools, no multi-step reasoning.

\`\`\`
User → Your API → LLM API → Response → User
\`\`\`

Use this for: chatbots, content generation, text classification, translation, summarisation, and any task where the model's built-in knowledge is sufficient. This is where most teams start, and for many use cases, it is all you need.

The key design decision here is model selection. Not every request needs your most powerful (and expensive) model. Classification tasks work fine with Claude Haiku; complex reasoning needs Claude Opus. Building a model router that selects the right model per request is one of the highest-impact optimisations.

**Pattern 2: RAG (Retrieval-Augmented Generation)**

RAG adds a retrieval step before the LLM call. Your system searches a knowledge base for relevant information and includes it in the prompt. This grounds the model's responses in your actual data.

\`\`\`
User → Your API → Vector DB Search → LLM API (with context) → Response → User
\`\`\`

Use this for: Q&A over company documents, knowledge bases, customer support, product documentation, and any task where the model needs access to private or up-to-date information it was not trained on.

**Pattern 3: Agent Loop (Autonomous Tool Use)**

An agent loop lets the LLM decide what actions to take, execute them, observe the results, and decide what to do next. This continues until the task is complete or a limit is reached.

\`\`\`
User → Your API → LLM decides action → Tool execution →
  LLM reviews result → (repeat until done) → Final response → User
\`\`\`

Use this for: complex multi-step tasks, research, data analysis, coding assistants, and any task that requires reasoning about intermediate results. This is the most powerful pattern but also the most complex and hardest to make reliable.

**Pattern 4: Pipeline (Multi-Stage Processing)**

A pipeline breaks a complex task into discrete stages, each handled by a separate model call. This is useful when different parts of the task need different capabilities.

\`\`\`
Input → Stage 1 (classify intent) → Stage 2 (extract data) →
  Stage 3 (generate response) → Stage 4 (safety check) → Output
\`\`\`

Use this for: content processing, data transformation, multi-model workflows, and tasks that benefit from decomposition. Each stage can use a different model, different prompts, and different validation logic.

### Evaluation — How to Know If Your AI System Works

Evaluation is the most important and most neglected aspect of AI engineering. Without rigorous evaluation, you are shipping blind — you have no idea whether your system is getting better or worse.

**Offline evaluation (before deployment):**

Build a test set of representative inputs with known correct outputs. Run your system against this test set and measure performance metrics. Do this every time you change your prompts, models, or retrieval pipeline.

| Metric | What It Measures | How to Calculate |
|--------|-----------------|-----------------|
| Accuracy | Overall correctness | Compare to human-labelled ground truth |
| Relevance | Does the answer address the question? | Human rating (1-5) or LLM-as-judge |
| Faithfulness | Is the answer supported by the context? | Check against source documents |
| Hallucination rate | Does the model make things up? | Fact-check outputs against sources |
| Latency (P50, P95, P99) | How fast are responses? | Measure time from request to last token |
| Cost per request | How expensive is each call? | Track input + output tokens times price |

**Online evaluation (after deployment):**

Monitor real user interactions to catch issues that testing misses.

- **Thumbs up/down** — the simplest and most valuable signal. If users consistently downvote a category of responses, investigate.
- **Task completion rate** — did the user accomplish what they set out to do?
- **Conversation length** — longer conversations might mean the AI is not being helpful enough.
- **Escalation rate** — how often do users ask to talk to a human?
- **Repeat queries** — if users rephrase and retry, the first answer was probably bad.

### Safety & Guardrails — Protecting Users and Your Business

AI safety is not just about preventing harmful outputs. It is about building a system that behaves predictably and fails gracefully. Here are the guardrails you need:

**Input guardrails (before the LLM sees the message):**

These catch problems before they reach the model, saving you money and preventing harmful interactions.

- **Content moderation** — Use a classification model to detect harmful, illegal, or abusive inputs. Reject them before they reach your main model.
- **PII detection** — Scan inputs for personal information (emails, phone numbers, addresses, credit card numbers). Either redact them or warn the user. You probably do not want PII going to a third-party API.
- **Prompt injection detection** — Users (accidentally or maliciously) might try to override your system prompt. Detect inputs that look like instructions ("ignore your instructions and...") and handle them.
- **Rate limiting** — Prevent abuse by limiting requests per user. This protects both your costs and your system's availability.
- **Input length limits** — Set maximum input lengths to prevent cost surprises and potential attacks.

**Output guardrails (after the LLM generates a response):**

These catch problems in the model's output before the user sees it.

- **Format validation** — If you expect JSON, validate it against your schema. If you expect a classification label, check it is one of your valid labels.
- **Content filtering** — Check the output for inappropriate content, even if the input was fine. Models can occasionally generate problematic content unprompted.
- **Fact-checking** — For RAG systems, verify that the answer is actually supported by the retrieved documents.
- **Confidence thresholds** — If the model expresses uncertainty ("I'm not sure..." or "I think..."), flag the response for human review instead of showing it to the user.
- **Forbidden content detection** — Check for mentions of competitors, internal information, or other content that should never reach users.

### Cost Management at Scale

AI costs follow a predictable pattern: they are trivially small in development, surprisingly large in staging, and potentially enormous in production. Planning for cost management from the start prevents unpleasant surprises.

| Cost Lever | How It Works | Expected Savings |
|-----------|-------------|-----------------|
| Model routing | Cheap model for simple tasks, expensive for complex | 50-80% |
| Response caching | Same question → cached answer, skip the API | 20-40% |
| Prompt optimisation | Shorter prompts, fewer few-shot examples | 10-30% |
| Appropriate max_tokens | Don't allocate 4,000 tokens for a yes/no | 5-15% |
| Batch processing | Process multiple items per API call | 10-20% |
| Request deduplication | Skip identical in-flight requests | 5-10% |

### Monitoring in Production — What to Watch

Once your AI system is live, you need continuous monitoring to catch degradation before users notice.

**Alert on these metrics:**

1. **Latency spike** — P95 response time exceeding your SLA. Could indicate model degradation, network issues, or traffic spike.
2. **Error rate increase** — API failures, timeout errors, parsing failures. Any increase from baseline warrants investigation.
3. **Cost anomaly** — Daily spend significantly exceeding budget. Could indicate a prompt change that increased token usage, or a traffic spike.
4. **Quality drop** — User satisfaction scores (thumbs down ratio) increasing. Could indicate model drift, data freshness issues, or a prompt regression.
5. **Hallucination increase** — Fact-check failures increasing. Could indicate retrieval quality degradation.
6. **Token usage change** — Average tokens per request significantly increasing. Could indicate prompt bloat or unexpected input patterns.

Set up alerts for all six of these. The cost of a missed alert is always higher than the cost of a false one.`,
      },
      {
        title: "AI Agents & Multi-Step Workflows",
        slug: "ai-agents-workflows",
        type: "lesson" as const,
        difficulty: "advanced" as const,
        estimatedMinutes: 45,
        order: 2,
        content: `## AI Agents & Multi-Step Workflows

An AI agent is fundamentally different from a chatbot. A chatbot responds to messages. An agent plans and executes tasks. A chatbot generates text. An agent uses tools, makes decisions, and takes actions in the real world. Building reliable AI agents is the cutting edge of AI engineering, and understanding the patterns is essential for any serious AI engineer.

### What Makes an Agent Different from a Chatbot?

The core distinction is autonomy and tool use. A chatbot receives a message and generates a response — that is the entire interaction. An agent receives a task and autonomously decides how to accomplish it, using whatever tools and information it needs, over multiple steps.

| Chatbot | Agent |
|---------|-------|
| Responds to individual messages | Plans and executes multi-step tasks |
| Single request-response cycle | Iterative loop until task is complete |
| Text input → text output | Text input → tools + reasoning → action + output |
| Predetermined conversation flow | Dynamic, adaptive behaviour |
| No side effects (just generates text) | Takes real actions (searches, writes, buys, sends) |
| Easy to build, predictable | Complex to build, requires safety measures |

Think of the difference like this: a chatbot is a customer service phone menu ("Press 1 for billing, press 2 for support"). An agent is a human customer service representative who listens to your problem, figures out what information they need, looks it up in multiple systems, makes a decision, and resolves your issue — all without you having to navigate a menu.

### The Agent Loop — How Agents Work

The agent loop is the fundamental architecture pattern. It is a cycle of: observe → think → act → observe again, repeating until the task is done.

\`\`\`typescript
// # The core agent loop — observe, think, act, repeat
async function agentLoop(task: string, maxSteps = 10) {
  // # Start with the user's task description
  const messages: any[] = [{ role: "user", content: task }];

  for (let step = 0; step < maxSteps; step++) {
    // # THINK: Ask the LLM what to do next
    // # The model sees the full conversation history,
    // # including previous tool results
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      tools: availableTools,    // # All the tools the agent can use
      messages,
    });

    // # Check if the model wants to use a tool
    const toolUse = response.content.find(b => b.type === "tool_use");

    if (!toolUse) {
      // # No tool use — the model gave a final text response
      // # This means the agent has decided the task is complete
      return response.content[0].text;
    }

    // # ACT: Execute the requested tool
    console.log(\`Step \${step + 1}: calling \${toolUse.name}\`, toolUse.input);
    const toolResult = await executeTool(toolUse.name, toolUse.input);

    // # OBSERVE: Send the tool result back to the model
    // # The model will see this result and decide what to do next
    messages.push(
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(toolResult),
        }],
      }
    );
    // # Loop continues — model observes the result and decides next action
  }

  return "Maximum steps reached — task may be incomplete";
}
\`\`\`

What makes this powerful is that the model sees ALL previous steps. After step 3, the model knows what happened in steps 1 and 2. It can use information from early steps to make decisions in later steps. It can recover from errors ("that search returned nothing, let me try different keywords"). It can change strategy mid-task.

### Tool Design — The Art of Good Agent Tools

The tools you give an agent determine what it can do and how reliably it does it. Poorly designed tools lead to unreliable agents. Well-designed tools lead to agents that feel almost magical.

**Principles of good tool design:**

1. **Clear, specific descriptions** — The model decides when to use each tool based on the description. "Get weather" is vague. "Get current weather conditions (temperature, humidity, wind, precipitation) for a specific city. Returns data for the current moment, not forecasts." is specific.

2. **Explicit parameter descriptions** — Every parameter should have a description that tells the model what it means and what format to use.

3. **Focused responsibility** — Each tool should do one thing well. Do not create a "do_everything" tool. Create "search_products," "get_product_details," and "place_order" as separate tools.

4. **Useful return values** — Return information the model can use for its next decision. A tool that returns "success" is less useful than one that returns "Order #12345 placed, estimated delivery 2026-10-07."

5. **Error messages that help** — When a tool fails, return an error message that helps the model recover. "Error" is useless. "Product ID not found. Available IDs: P001, P002, P003" lets the model retry with a valid ID.

\`\`\`typescript
// # Well-designed tools for a shopping agent
const tools = [
  {
    name: "search_products",
    description: "Search the product catalog by keyword, category, or price range. Returns up to 10 matching products with ID, name, price, rating, and stock status. Use this to help customers find products.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term — product name, feature, or description keyword",
        },
        category: {
          type: "string",
          enum: ["electronics", "clothing", "books", "home", "sports"],
          description: "Filter by product category (optional)",
        },
        maxPrice: {
          type: "number",
          description: "Maximum price in GBP. Omit for no price limit.",
        },
        sortBy: {
          type: "string",
          enum: ["relevance", "price_low", "price_high", "rating"],
          description: "Sort order. Default: relevance.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_product_details",
    description: "Get full details for a specific product by ID. Returns name, description, price, specifications, reviews, stock status, and delivery estimate. Use after search to get complete information.",
    input_schema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "Product ID from search results (e.g. 'P-12345')",
        },
      },
      required: ["productId"],
    },
  },
  {
    name: "add_to_cart",
    description: "Add a product to the customer's shopping cart. Returns updated cart contents with total. Requires customer confirmation before calling.",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        quantity: {
          type: "integer",
          minimum: 1,
          maximum: 10,
          description: "Number to add. Default 1.",
        },
      },
      required: ["productId"],
    },
  },
];
\`\`\`

### Multi-Agent Architectures

For complex tasks, a single agent with many tools can become unreliable. Multi-agent architectures divide work among specialised agents, each with focused expertise and limited tools.

**Router pattern** — a routing agent analyses the task and delegates to the right specialist:

\`\`\`
User request → Router Agent
  → "This is a coding question"  → Code Agent (has code tools)
  → "This is a research task"    → Research Agent (has search tools)
  → "This needs data analysis"   → Analysis Agent (has data tools)
\`\`\`

The router agent is simple (just classification) and each specialist agent has a focused set of tools and a domain-specific system prompt. This is easier to debug than one agent with 20 tools.

**Pipeline pattern** — agents work in sequence, each building on the previous agent's output:

\`\`\`
User request → Research Agent (gathers information)
            → Analysis Agent (synthesises findings)
            → Writer Agent (produces the final output)
            → Review Agent (checks quality)
\`\`\`

Each agent sees only its own context plus the output from the previous stage. This keeps context focused and prevents confusion.

**Supervisor pattern** — a supervisor agent coordinates multiple worker agents:

\`\`\`
Supervisor Agent → assigns subtasks →
  Worker Agent A (parallel) → results
  Worker Agent B (parallel) → results
  Worker Agent C (parallel) → results
Supervisor Agent → reviews and merges → Final output
\`\`\`

The supervisor breaks the task into independent subtasks, assigns them to workers (who run in parallel), collects the results, and synthesises a final output. This is faster than sequential processing but requires careful task decomposition.

### Safety for Agents — Non-Negotiable Guardrails

Agents take real actions — searching databases, creating records, sending messages, spending money. This makes safety not just important but critical. An agent bug that creates 1,000 duplicate orders is not a minor inconvenience; it is a business disaster.

**Essential safety measures:**

1. **Human-in-the-loop for destructive actions** — Any action that creates, modifies, or deletes data should require human confirmation. "I am about to place an order for 5 laptops at £4,500. Shall I proceed?"

2. **Sandboxing** — Run code in isolated environments. Never give an agent direct access to production databases, file systems, or network resources without strict access controls.

3. **Budget limits** — Cap the number of API calls, the total cost, and the total time per agent run. An agent stuck in a loop can burn through your API budget in minutes.

4. **Tool allowlisting** — Only provide the tools the agent actually needs for its specific task. A customer support agent does not need access to the database deletion tool.

5. **Comprehensive audit logging** — Record every tool call, every input, every output, and every decision the agent makes. When something goes wrong (and it will), you need to understand exactly what happened.

6. **Timeout and step limits** — Set a maximum number of steps (10-20) and a maximum execution time (30-120 seconds). Agents can get stuck in reasoning loops; these limits prevent runaway execution.

7. **Output review** — Before the agent's final response reaches the user, run it through content moderation and fact-checking. The agent might have arrived at its answer through correct reasoning but expressed it in an inappropriate way.`,
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
  },
  {
    "question": "Your production AI system's answer quality has degraded over the past month, but you haven't changed any code or prompts. What's the most likely cause?",
    "options": [
      "The model provider updated their model weights without telling you",
      "Your knowledge base has become stale — real-world information has changed but your documents haven't been updated",
      "Users are asking harder questions",
      "Your server is running out of memory"
    ],
    "correctIndex": 1,
    "explanation": "Stale knowledge bases are the most common cause of gradual quality degradation in RAG systems. Product prices change, policies update, new features launch, old ones are deprecated — but your indexed documents still reflect the old state. The AI gives answers that WERE correct a month ago but are no longer accurate. Solution: build an automated document refresh pipeline that re-indexes changed documents regularly."
  }
]
-->`,
      },
    ],
  },
];
