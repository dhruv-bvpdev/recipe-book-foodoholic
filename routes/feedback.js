const express = require("express");
const app = express.Router();
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  title: String,
  content: String
});

app.get("/", (req, res) => {
    if (req.isAuthenticated()){
      res.render("feedback");
    } else {
      res.redirect("/");
    }
  });
  
  const Feedback = mongoose.model("Feedback", feedbackSchema); 
  
  app.post("/", (req, res) => { 
    const userFeedback = new Feedback({
      title: req.body.feedbackTitle,
      content: req.body.feedbackBody
    });
  
    userFeedback.save(function(err) {
     if (!err){
      res.redirect("/home");
     }
     else {
         res.redirect("/failure");
      }
    });
  
  });


module.exports = app;

