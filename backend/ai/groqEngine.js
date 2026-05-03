import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const generateResponse = async (userInput) => {
  try {
    const prompt = `You are a senior software engineer and code reviewer.

Your task is to review the following code thoroughly and provide a structured analysis.

### Instructions:

1. **Understand the code first** – explain briefly what the code is doing.
2. **Check for errors and bugs**
   * Syntax errors
   * Logical mistakes
   * Edge cases that may break the code
3. **Evaluate code quality**
   * Readability, Maintainability
   * Proper naming conventions
   * Code structure and modularity
4. **Check best practices**
   * Language-specific best practices
   * Security issues (if any)
   * Performance concerns
5. **Optimization**
   * Suggest improvements if the code is not optimal
6. **Refactored version**
   * Provide a cleaner, optimized version of the code
7. **Score generation**
   * Generate an integer score between 0 and 100 representing the overall quality of the code.

CRITICAL: Return ONLY raw valid JSON. No markdown, no backticks, no \`\`\`json fences, no explanation outside JSON.

### Output format (strict JSON):
{
  "type": "code_review",
  "score": 85,
  "summary": "short explanation of what the code does",
  "issues": [
    {
      "line": "approximate line number or snippet reference",
      "description": "issue description",
      "severity": "error | warning | info",
      "fix": "how to fix"
    }
  ],
  "improvements": ["suggestion 1", "suggestion 2"],
  "optimizedCode": "refactored code here",
  "finalAnswer": null
}

### Code to review:
${userInput}`;

    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY in environment variables");
    }

    const response = await axios.post(
     "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a strict JSON-only coding assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0].message.content;

    // Clean markdown if model still returns it
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw response:", raw);
      parsed = {
        type: "general",
        summary: "Could not parse structured response",
        issues: [],
        improvements: [],
        optimizedCode: null,
        finalAnswer: cleaned,
      };
    }

    return { success: true, data: parsed };

  } catch (error) {
    console.error("Groq error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};