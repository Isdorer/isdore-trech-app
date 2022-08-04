
const express = require("express");
      app = express();
      bodyParser = require("body-parser");
      mongoose = require("mongoose");
      passport = require("passport");
      LocalStrategy = require("passport-local");
      passportlocalMongoose = require("passport-local-mongoose");
      User = require("./models/user");
      async = require("async");
      nodemailer = require("nodemailer");
      crypto = require("crypto");
      request = require("request");
      flash = require("connect-flash");


// require dotenv

const DotEnv = require("dotenv").config();


// requiring routes
const trechRoutes = require("./routes/trech");
const indexRoutes = require("./routes/index");


//MONGOOSE/MODEL CONFIG



//APP CONFIG
mongoose.connect("mongodb://localhost/trech_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "this is the best blog page ever",
    resave: false,
    saveUninitialized: false,
  })
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static("public"));

app.use(flash());

app.use(function (req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
})


  // APP ROUTES
 
app.use(indexRoutes);
app.use(trechRoutes);
  
 
  
  
 
  app.listen(process.env.PORT || 3000, function () {
    console.log("server has started");
  });
  