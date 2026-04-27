import pool from "../database/db";


const createCodeTable=async()=>{
  try{
    await pool.query(`
      CREATE TABLE IF NOT EXIST code(
      id PRIMARY KEY,
      CONSTRAINT fk_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,
      language STRING,
      orignal_code TEXT,
      ai_feedback JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      )
      
      
      `)

  }catch(error){

  }
}