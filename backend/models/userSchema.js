import pool from "../database/db.js"

const createTable=async()=>{
  try{
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
         google_id TEXT UNIQUE,
        name TEXT,
        email TEXT UNIQUE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("table created ")
  }catch(error){
    console.error("❌ table creation failed", error.message);   
  }
}



export default createTable

