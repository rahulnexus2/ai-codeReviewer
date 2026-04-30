import express from "express";
import dotenv from "dotenv"
dotenv.config()
import createTable from "./models/userSchema.js"
import userRoutes from "./routes/userRoutes.js"
import authGoogle from "./routes/authGoogle.js"
import codeReview from "./routes/codeReview.js"
import createCodeTable from "./models/codeSchema.js";
import codeCrud from "./routes/codeCrud.js"
import cors from "cors"
import cookieParser from "cookie-parser";


await createTable();
await createCodeTable();

const port =8000
const app=express()

//app.use("/code",express.text({ type: "*/*" }),codeReview)
app.use(cookieParser())

app.use(express.json())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.get('/',(req,res)=>{
  res.send('hey welome to my app')
})




app.use("/auth",authGoogle)
app.use("/user",userRoutes)
app.use("/code",codeReview)
app.use("/codereview",codeCrud)




app.listen(port,()=>{
  console.log(`app is listening at port ${port}`)
})

