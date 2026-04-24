import express from "express";
import dotenv from "dotenv"
dotenv.config()
import passport from "./config/passport.js";
import session from "express-session";



const port =8000
const app=express()


app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get('/',(req,res)=>{
  res.send('hey welome to my app')
})

app.get('/auth/google',passport.authenticate("google", { scope: ["profile", "email"] }))

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    
    res.send("Google Login Successful");
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

