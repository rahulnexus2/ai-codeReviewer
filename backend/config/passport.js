import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../database/db.js"
import dotenv from "dotenv"
dotenv.config()

passport.use(
  new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
async (accessToken, refreshToken, profile, done) => {
     try{
       const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails[0].value;
        const avatar = profile.photos[0].value;

        const userResult = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [googleId]
        );

        if (userResult.rows.length > 0) {
          return done(null, userResult.rows[0]);
        }

        const newUser = await pool.query(
          `INSERT INTO users (google_id, name, email, avatar)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [googleId, name, email, avatar]
        );

         return done(null, newUser.rows[0]);
      }catch(error){
         return done(error, null);
      }

    })
    
)

passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((obj, done) => {
  done(null, obj);
});



export default passport