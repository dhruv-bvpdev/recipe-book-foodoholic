const express = require("express")
let app = express.Router();
const https = require("https");
recepiesForHome = "511728,654857,663933,663905,654532,654527,641893,648974,632983,638420,638174,637999";

app.get("/", (req, res) => {
    if(req.isAuthenticated()) {
      let username = req.session.username; 
     res.render("home", {username: username}); 

    } else {
      res.redirect("/");
    }
});

app.post("/", (req, res) => {
    let name = req.body.reciepeName;
    
    const url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + process.env.API_KEY + "&query=" + name;
  
    https.get(url, "JSON", function(response){
      if (response.statusCode != 200) {
        res.redirect("/failure");
      }
      else{
        var data;
        response.on("data", function(chunk) {
          if (!data) {
            data = chunk;
          } else {
            data += chunk;
          }
        });
    
        response.on("end", function() {
            const recepieData = JSON.parse(data);
            recepieArray = recepieData.results;
            let username = req.session.username;
            res.render("foundRecepie", {recepiesFound: recepieArray, username: username});
        });
      }
        
    });
  })

  module.exports = app;
  