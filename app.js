require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const ejs = require("ejs");
const https = require("https");
const mongoose = require("mongoose");
/* const stripe = require("stripe")(process.env.STRIPE_API_KEY) */

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.json());

const home = require("./routes/home");
const detailedRecepie = require("./routes/detailedRecepie");
const feedback = require("./routes/feedback");
const newsletter = require("./routes/newsletter");
const failure = require("./routes/failure");
const support = require("./routes/support");


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/recepieBookUserDB", {useUnifiedTopology: true, useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

/* const feedbackSchema = new mongoose.Schema({
  title: String,
  content: String
}); */

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", userSchema);
/*  const Feedback = mongoose.model("Feedback", feedbackSchema); 
 */


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



                                              //ROUTES

//Root Route

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {

  if ('signup' === req.body.formType) {

    User.register({username: req.body.username}, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.session.username = req.body.username;
          res.redirect("/home");
        })
      }
    })
  
  } else if ('signin' === req.body.formType) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, (err) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          req.session.username = req.body.username;
          res.redirect("/home");
        });
      }
    })
      
  }

});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/")
});

//Home Route
app.use("/home", home);


// Detailed Recepie Route
app.use("/detailedRecepie", detailedRecepie);


//FeedBack Route
app.use("/feedback", feedback);


//Newsletter Route
app.use("/newsletter", newsletter)


// Support Route 
app.use("/support", support);


//Failure Route
app.use("/failure", failure);


app.listen(3000, () => {
    console.log("server up and running at port 3000");
}) ;



