import pool from "../database/db.js"

const createTable=async()=>{
  try{
    await pool.querry(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("table created ")
  }catch(error){
    console.log(error);   
  }
}


createTable()
