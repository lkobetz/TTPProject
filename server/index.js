"use strict";

const express = require("express");
const path = require("path");
const volleyball = require("volleyball");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
// development:
// const { sessionSecret } = require("../secrets");
// production:
const sessionSecret = process.env.sessionSecret;

const app = express();

// parses the req.body from the forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// not actually necessary, but helpful because it saves cookies in req.cookies
app.use(cookieParser());
// logged-in user is stored on the session
app.use(
  session({
    secret: sessionSecret, // this option says if you haven't changed anything, don't resave. It is recommended and reduces session concurrency issues
    // even if nothing's changed, save it anyway
    resave: false,
    // saves to database even when server goes down, keeps servers logged in
    saveUninitialized: true
  })
);

// logging middleware
app.use(volleyball);

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static middleware
app.use(express.static(path.join(__dirname, "../build")));

app.use("/api", require("./api/routes.js")); // include our routes!

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
}); // Send index.html for any other requests

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

module.exports = app;
