import express from "express";
import dotenv from "dotenv"
dotenv.config()
import createTable from "./models/userSchema.js"
import userRoutes from "./routes/userRoutes.js"
import authGoogle from "./routes/authGoogle.js"
import codeReview from "./routes/codeReview.js"



await createTable();

const port =8000
const app=express()


app.use("/code",express.text({ type: "*/*" }),codeReview)

app.use(express.json())

app.get('/',(req,res)=>{
  res.send('hey welome to my app')
})



app.use("/auth",authGoogle)
app.use("/user",userRoutes)


app.listen(port,()=>{
  console.log(`app is listening at port ${port}`)
})

