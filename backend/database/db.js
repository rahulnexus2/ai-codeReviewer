import pkg from "pg"
const {Pool} =pkg
import dotenv from "dotenv"
dotenv.config()



 const pool = new Pool({
  connectionString: process.env.DB_STRING,
  ssl: {
    rejectUnauthorized: false
  }
},
);


export default pool;

async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB Connected Successfully");
    console.log(res.rows);
  } catch (err) {
    console.error("❌ DB Connection Failed");
    console.error(err);
  } 
}

testDB();