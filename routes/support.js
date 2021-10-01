const express = require("express")
let app = express.Router();
const https = require("https");
const stripe = require("stripe")(process.env.STRIPE_API_KEY)


app.get("/", (req, res) => {
    if (req.isAuthenticated()){
      res.render("support-us");
    } else {
      res.redirect("/");
    }
  });
  
  app.post("/", async (req, res) => {
    const {amount} = req.body;
   const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Support Payment',
        },
        unit_amount: amount * 100
      },
      quantity: 1,
    },
    ],
    mode: 'payment',
    success_url: req.protocol + "://" + req.get("host") + "/home",
    cancel_url: req.protocol + "://" + req.get("host") + "/failure",
  });
  res.json({
    id: session.id
  })
  });




module.exports = app;