import pool from "../database/db.js";


const createCodeTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS code (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        model TEXT,
        original_code TEXT,
        ai_feedback JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      )
    `);

    console.log("✅ Code table created successfully");
  } catch (error) {
    console.error("❌ table creation failed", error.message);
  }
};


export default createCodeTable