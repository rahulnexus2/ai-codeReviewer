import jwt from "jsonwebtoken"
import pool from "../database/db.js"
import dotenv from "dotenv"
dotenv.config()

const authMiddleware=async (req,res,next)=>{
  try{
  const authHeader=req.headers.authorization;
  

  if(!authHeader)
  {
    return res.status(401).json({message:"no token passed "});
  }

  if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

  const token = authHeader.split(" ")[1];
 
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
  

  const result = await pool.query(
      "SELECT id, email, name FROM users WHERE id = $1",
      [decoded.id]
    );

    

  if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

  req.user = result.rows[0];
  
  next();
}
catch(error)
{
  return res.status(401).json({  message: error.name === "TokenExpiredError"
        ? "Token expired"
        : "Invalid token" });
}
}

export default authMiddleware
