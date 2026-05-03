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

const app = express();
const port = 8000;

// 1. DATABASE INITIALIZATION
await createTable();
await createCodeTable();

// 2. GLOBAL MIDDLEWARE (The "Gatekeepers")
// These MUST be defined before your app.use routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json()); // <--- CRITICAL: This MUST come before routes

// 3. ROUTES (The "End-Points")
app.get('/', (req, res) => {
  res.send('hey welcome to my app')
});

app.use("/auth", authGoogle);
app.use("/user", userRoutes);
app.use("/code", codeReview); // Now this route will have access to req.body
app.use("/codereview", codeCrud);

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});