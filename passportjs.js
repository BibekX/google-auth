const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const googleStrategy = require("./strategies/google-strategy");
const passport = require("passport");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("serialize");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserialize");
    let users = await knex("users").where({ id });

    if (users.length === 0) {
      return done(new Error("Wrong user id"));
    } else {
      let user = users[0];
      return done(null, user);
    }
  });
  googleStrategy(passport, knex);
};
