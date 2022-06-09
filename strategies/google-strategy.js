const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

require("dotenv").config();

module.exports = (passport, knex) => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:3000/auth/gmail/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = {
            username: profile.emails[0].value,
          };
          const userResult = await knex("users").where("google_id", profile.id);

          if (userResult.length === 0) {
            await knex("users").insert({
              username: profile.emails[0].value,
              google_id: profile.id,
            });

            let query = await knex("users").where("google_id", profile.id);
            console.log("query", query);
            user.id = query[0].id;
            return done(null, user);
          } else {
            user.id = userResult[0].id;
            return done(null, user);
          }
        } catch (err) {
          return done(err, false, { message: "Couldn't add user" });
        }
      }
    )
  );
};
