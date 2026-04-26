import express from "express"
import cookieParser from "cookie-parser";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()
import pool from "../database/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router =express.Router();


router.get('/google',
  passport.authenticate("google", { scope: ["profile", "email"] }))

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session:false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user;
     const token = jwt.sign(
      {  id: user.id,
         email: user.email ,
         tokenVersion: user.token_version
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("SETTING COOKIE...");
     res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
        sameSite: "lax",
        
    });
     
    return res.redirect("http://localhost:8000");    
   
  }
);


router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // increment token version → invalidates all tokens
    await pool.query(
      "UPDATE users SET token_version = token_version + 1 WHERE id = $1",
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
});


export default router