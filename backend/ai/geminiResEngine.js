import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const generateResponse = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

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
7. **Explain improvements**
   * Clearly explain what you changed and why

CRITICAL: Return ONLY raw valid JSON. No markdown, no backticks, no \`\`\`json fences, no explanation outside JSON.

### Output format (strict JSON):
{
  "type": "code_review",
  "summary": "short explanation of what the code does",
  "issues": [
    {
      "description": "issue description",
      "severity": "low | medium | high",
      "fix": "how to fix"
    }
  ],
  "improvements": ["suggestion 1", "suggestion 2"],
  "optimizedCode": "refactored code here",
  "finalAnswer": null
}

### Code to review:
${userInput}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

   
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
      // Return raw text as fallback so frontend still gets something
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
    console.error("Gemini error:", error.message);
    return { success: false, error: error.message };
  }
};