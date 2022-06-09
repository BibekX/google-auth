const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const Router = require("./router/Router");
const passportJS = require("./passportjs");
require("dotenv").config();

// https.globalAgent.options.rejectUnauthorized = false;

const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));

passportJS(app, passport);

let router = new Router(express, passport);

app.use("/", router.router());

https.createServer(options, app).listen(3000, () => {
  console.log("Listening to port 3000");
});
