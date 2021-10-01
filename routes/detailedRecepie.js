const express = require("express");
const app = express.Router();
const https = require("https");

app.get("/:searchedRecepie", (req, res) => {


    if(req.isAuthenticated()) {
      const recepieId = req.params.searchedRecepie;
  
      const url = "https://api.spoonacular.com/recipes/"+ recepieId +"/information?apiKey=" + process.env.API_KEY;
  
      https.get(url, "JSON", function(response){
        if (response.statusCode != 200) {
          res.redirect("/failure");
        }
        else {
          var data;
          response.on("data", function(chunk) {
            if (!data) {
              data = chunk;
            } else {
              data += chunk;
            }
          });
  
          response.on("end", function() {
            var newString = data.replace(/<\/?[^>]+>/gi, '');
            const recepieInformation = JSON.parse(newString);
            let username = req.session.username;
            res.render("searchRecepie", {recepieInformation: recepieInformation, username: username});
          });
        }
     });
  
    } else {
      res.redirect("/")
    }
      
  });

  module.exports = app;