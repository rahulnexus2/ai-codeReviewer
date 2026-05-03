import express from "express" 
import { generateResponse as geminiGenerateResponse } from "../ai/geminiResEngine.js"
import { generateResponse as huggingFaceGenerateResponse } from "../ai/huggingFaceEngine.js"
import { generateResponse as groqGenerateResponse } from "../ai/groqEngine.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import pool from "../database/db.js";
import reviewLimiter from "../middlewares/ratelimiter.js";

const router=express.Router();

router.post('/review', reviewLimiter, authMiddleware, async (req, res) => {
  try {
    const { model, original_code } = req.body;

    
    if (!original_code?.trim()) {
      return res.status(400).json({ error: "No code for review provided" });
    }
    if (!model?.trim()) {
      return res.status(400).json({ error: "model is not selected" });
    }

    
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

   
    let result;
    try {
      if (model === 'hugging-face') {
        result = await huggingFaceGenerateResponse(original_code);
      } else if (model === 'groq') {
        result = await grokGenerateResponse(original_code);
      } else {
        
        result = await geminiGenerateResponse(original_code);
      }
      
    } catch (aiErr) {
      console.error("AI engine threw:", aiErr); 
      return res.status(502).json({ error: "AI service failed" });
    }

    if (!result?.success || !result?.data) {
      console.error("AI bad response shape:", result); 
      return res.status(500).json({ error: result?.error || "AI returned no data" });
    }

    const ai_feedback = result.data;

    
    let dbResult;
    try {
      dbResult = await pool.query(
        `INSERT INTO code (user_id, model, original_code, ai_feedback)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, model, original_code, ai_feedback]
      );
    } catch (dbErr) {
      console.error("DB insert failed:", dbErr.message); // ← shows exact Postgres error
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({
      success: true,
      data: dbResult.rows[0],
    });

  } catch (error) {
    console.error("Unhandled Review Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router