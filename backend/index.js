import express from "express";
import dotenv from "dotenv"
dotenv.config()
import passport from "./config/passport.js";

import createTable from "./models/userSchema.js"
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

await createTable()



const port =8000
const app=express()

app.use(cookieParser());


app.use(passport.initialize());



app.get('/',(req,res)=>{
  res.send('hey welome to my app')
})

app.get('/auth/google',passport.authenticate("google", { scope: ["profile", "email"] }))

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session:false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user;
     const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("SETTING COOKIE...");
     res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
        sameSite: "lax",
        
    });
     
    return res.redirect("http://localhost:8000");
    
   
  }
);

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send("Not logged in");
  }

  res.json(req.user);
});




app.listen(port,()=>{
  console.log(`app is listening at port ${port}`)
})

