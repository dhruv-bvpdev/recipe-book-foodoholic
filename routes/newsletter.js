const express = require("express");
const app = express.Router();
const https = require("https");


app.get("/", (req, res) => {
    if (req.isAuthenticated()){
      res.render("newsletter");
    } else {
      res.redirect("/");
    }
  });
  
  app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const lEmail = req.body.uEmail;
  
    const data = {
      members: [{
          email_address: lEmail,
          status: "subscribed",
          merge_fields: {
              FNAME: firstName,
              LNAME: lastName
          }
      }]
    }
  
  
    const jsonData = JSON.stringify(data);
  
      const url = "https://us5.api.mailchimp.com/3.0/lists/" + process.env.MAIL_CHIMP_AUDIENCE_ID;
      const options = {
          method: "POST",
          auth: "dhruv1:" + process.env.MAIL_CHIMP_API_KEY
      }
      const request = https.request(url, options, function(response) {
  
          if (response.statusCode === 200) {
              res.redirect("/home");
          } else {
              res.redirect("/failure");
          }
          response.on("data", function(data) {
              console.log(JSON.parse(data));
          });
      });
      
      request.write(jsonData);
      request.end();
  
  });


module.exports = app