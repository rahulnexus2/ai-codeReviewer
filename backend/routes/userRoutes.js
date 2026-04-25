import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"

const router=express.Router();


router.get("/profile",authMiddleware,(req,res)=>{
  res.json({
    sucess:true,
    user:req.user
  })

})





export default router;