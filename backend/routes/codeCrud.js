import pool from "../database/db.js";
import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js";

const router=express.Router();


router.get("/gethistory",authMiddleware,async(req,res)=>{
  try{

    const user_id=req.user.id;

    const result=await pool.query(`
      SELECT * FROM code
      WHERE user_id = $1
      ORDER BY created_at DESC`,
    [user_id]);


    res.status(200).json({
      success:true,
      count:result.rows.length,
      data:result.rows
    })


  }catch(error){
    console.error("History Error:", error);
    res.status(500).json({ error: "Server error" });
  }

})

router.get('/gethistory/:id',authMiddleware,async(req,res)=>{
try{

  const user_id=req.user.id;
  const code_id=req.params.id
  const result=await pool.query(`
    SELECT * FROM code WHERE id = $1 AND user_id= $2`,
  [code_id,user_id]);

  if(!result.rows.length === 0)
    return res.status(404).json({error:"no such record "})

  res.status(200).json({
      success: true,
      data: result.rows[0]
    });


}catch(error){
  console.error("Fetch by ID Error:", error);
    res.status(500).json({ error: "Server error" });

}

})

router.delete('/history/delete/:id',authMiddleware,async(req,res)=>{
  try{
   const user_id = req.user.id;
    const code_id = req.params.id;

    
    if (isNaN(code_id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result=await pool.query(`
      DELETE FROM code WHERE  id= $1 AND user_id= $2  `,
    [code_id,user_id])


    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Code not found or not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Code deleted successfully",
      data: result.rows[0]
    });

  }catch(error){
    
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server error" });
  
  }
})





export default router