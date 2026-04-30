import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"


const router=express.Router();

router.get("/profile",authMiddleware,(req,res)=>{

  console.log(req.user)
  console.log("Cookies received:", req.cookies);

  res.json({
    success:true,
    user:req.user
  })

})

router.get('/verify',authMiddleware,(req,res)=>{
  res.status(200).json({
    success: true,
    user: req.user 
  });
})



export default router;