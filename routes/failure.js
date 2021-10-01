const express = require("express");
const app = express.Router();
  
app.get("/", (req, res) => {
  res.render("404page");
});

  app.post("/", (req, res) => {
    res.redirect("/home");
  });

module.exports = app;