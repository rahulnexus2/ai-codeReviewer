import express from "express" 
import { generateResponse } from "../ai/geminiResEngine.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import pool from "../database/db.js";

const router=express.Router();

router.post('/review',authMiddleware,async(req,res)=>{
  try{  
  
  const {language ,original_code}=req.body;
  
  
  console.log(original_code);
  


    if(!original_code)
    {
      return res.status(400).json({error:"no code for review is provided"})
    
    }
     if(!language)
    {
      return res.status(400).json({error:"language is not selected"})
    
    }

    console.log(original_code)

    const user_id=req.user.id;

    const result =await generateResponse(original_code );
    if (!result.success || !result.data) {
      return res.status(500).json({ error: result.error || "AI failed" });
    }

    const ai_feedback=result.data;

    const dbResult=await pool.query(` 
      INSERT INTO code (user_id,language,original_code,ai_feedback)
      VALUES ($1, $2, $3, $4)
      RETURNING *`
      [user_id, language, original_code, ai_feedback]
    )

    if(!result.success){
      return res.status(500).json({error:result.error})
    }



   res.status(201).json({
      success: true,
      data: dbResult.rows[0],
    });

  }
  catch(error){
    console.error("Review Error:", error);
    res.status(500).json({ error: "Server error" });
  }
   
})


export default router