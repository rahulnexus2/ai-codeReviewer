import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config()

const geniAi= new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const generateResponse=async(userInput)=>{
  try{
    const model=geniAi.getGenerativeModel({
      model:"gemini-2.5-flash"
    })

    const prompt=`You are a senior software engineer and code reviewer.

Your task is to review the following code thoroughly and provide a structured analysis.

### Instructions:

1. **Understand the code first** – explain briefly what the code is doing.
2. **Check for errors and bugs**

   * Syntax errors
   * Logical mistakes
   * Edge cases that may break the code
3. **Evaluate code quality**

   * Readability
   * Maintainability
   * Proper naming conventions
   * Code structure and modularity
4. **Check best practices**

   * Language-specific best practices
   * Security issues (if any)
   * Performance concerns
5. **Optimization**

   * Suggest improvements if the code is not optimal
   * Reduce time/space complexity if possible
6. **Refactored version**

   * Provide a cleaner, optimized version of the code
   * Use modern and recommended practices
7. **Explain improvements**

   * Clearly explain what you changed and why

IMPORTANT RULES:
You MUST return ONLY valid JSON
Do NOT include markdown, backticks, or extra text
Do NOT include explanations outside JSON
Keep responses concise but meaningful

### Output format:

{
"type": "code_review" | "general",
"summary": "short explanation",
"issues": [
{
"description": "issue description",
"severity": "low | medium | high",
"fix": "how to fix"
}
],
"improvements": [
"suggestion 1",
"suggestion 2"
],
"optimizedCode": "refactored code here (only if applicable)",
"finalAnswer": "only for non-code queries"
}

### Code:
${userInput}`;


const result=await model.generateContent(prompt)
console.log(result)
const text = result.response.text();


let parsed;

try{
  parsed=JSON.parse(text);
}catch(err){
  parsed = {
        type: "general",
        summary: "AI response",
        finalAnswer: text
      };
}


return { success: true, data: parsed };


  }catch(error){
     return { success: false, error: error.message };
  }
}