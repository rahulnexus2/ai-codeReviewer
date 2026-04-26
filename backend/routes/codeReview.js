import express from "express" 
import { generateResponse } from "../ai/geminiResEngine.js"
import authMiddleware from "../middlewares/authMiddleware.js";

const router=express.Router();



router.post('/review',authMiddleware,async(req,res)=>{
    const input=req.body;
    if(!input)
    {
      return res.status(400).json({error:"input error"})
    
    }


    const result =await generateResponse(input);

    if(!result.success){
      return res.status(500).json({error:result.error})
    }

    res.json(result.data);
  
})


export default router