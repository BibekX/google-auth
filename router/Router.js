function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("user authenticated");
    return next();
  }
  return res.redirect("/");
}

class Router {
  constructor(express, passport) {
    this.express = express;
    this.passport = passport;
  }
  router() {
    const router = this.express.Router();

    router.get("/", (req, res) => {
      res.sendFile("index.html");
    });
    router.get("/secret", isAuthenticated, (req, res) => {
      res.sendFile(process.cwd() + "/public/secret.html");
    });
    router.get("/login", (req, res) => {
      res.sendFile(process.cwd() + "/public/login.html");
    });

    router.get(
      "/auth/gmail",
      this.passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );

    router.get(
      "/auth/gmail/callback",
      this.passport.authenticate("google", {
        successRedirect: "/secret",
        failureRedirect: "/error",
      })
    );

    router.get("/logout", (req, res) => {
      req.logout();
      res.redirect("/login");
    });

    return router;
  }
}

module.exports = Router;
