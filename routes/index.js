const express = require("express")
const router = express.Router()
const User = require("../models/user");
const passport = require("passport");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");




//root route

router.get("/", (req, res) => {
    res.render("landing")
})


//register form route

router.get("/register", (req, res) => {
    res.render("register");
  });


//sign up route

  router.post("/register", (req, res) => {
    req.body.username;
    req.body.password;
    User.register(
      new User({ username: req.body.username, email: req.body.email }),
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          req.flash("error", err.message);
          return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
          req.flash("success", "successfully sighned up! Nice to meet you " + req.body.username)
          res.redirect("/index");
        });
      }
    );
  });
  
  // LOG IN ROUTES
  router.get("/login", (req, res) => {
    res.render("login");
  });
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/index",
      failureRedirect: "/login",
    }),
    
    function (req, res) {}
  );
  
  // LOG OUT
  router.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("error", " you just logged out")
      res.redirect("/");
    });
  });
  
  // FORGOT PASSWORD
  router.get("/forgot", (req, res) => {
    res.render("forgot");
  });
  
  router.post("/forgot", function (req, res, next) {
    async.waterfall(
      [
        function (done) {
          crypto.randomBytes(20, function (err, buf) {
            const token = buf.toString("hex");
            done(err, token);
          });
        },
        function (token, done) {
          User.findOne({ email: req.body.email }, function (err, user) {
            if (!user) {
              req.flash("error", "No account with that email address exists.");
              return res.redirect("/forgot");
            }
  
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 1 hour
  
            user.save(function (err) {
              done(err, token, user);
            });
          });
        },
        function (token, user, done) {
          const smtpTransport = nodemailer.createTransport({
            port: process.env.EMAIL_PORT,
            service: "Gmail",
  
            auth: {
              user: "isdoreagoha5@gmail.com",
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          const mailOptions = {
            to: user.email,
            from: "isdoreagoha5@gmail.com",
            subject: "Trech.com Password Reset Request",
            text:
              "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
              "http://" +
              req.headers.host +
              "/reset/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n",
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            console.log("mail sent");
            req.flash(
              "success",
              "An e-mail has been sent to " +
                user.email +
                " with further instructions."
            );
            done(err, "done");
          });
        },
      ],
      function (err) {
        if (err) return next(err);
        res.redirect("/forgot");
      }
    );
  });
  
  router.get("/reset/:token", function (req, res) {
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      },
      function (err, user) {
        if (!user) {
          req.flash("error", "Password reset token is invalid or has expired.");
          return res.redirect("/forgot");
        }
        res.render("reset", { token: req.params.token });
      }
    );
  });
  
  router.post("/reset/:token", function (req, res) {
    async.waterfall(
      [
        function (done) {
          User.findOne(
            {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() },
            },
            function (err, user) {
              if (!user) {
                req.flash(
                  "error",
                  "Password reset token is invalid or has expired."
                );
                return res.redirect("back");
              }
              if (req.body.password === req.body.confirm) {
                user.setPassword(req.body.password, function (err) {
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;
  
                  user.save(function (err) {
                    req.logIn(user, function (err) {
                      done(err, user);
                    });
                  });
                });
              } else {
                req.flash("error", "Passwords do not match.");
                return res.redirect("back");
              }
            }
          );
        },
        function (user, done) {
          const smtpTransport = nodemailer.createTransport({
            port: process.env.EMAIL_PORT,
            service: "Gmail",
  
            auth: {
              user: "isdoreagoha5@gmail.com",
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          const mailOptions = {
            to: user.email,
            from: "isdoreagoha5@mail.com",
            subject: "Your password has been changed",
            text:
              "Hello,\n\n" +
              "This is a confirmation that the password for your account " +
              user.email +
              " has just been changed.\n",
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            req.flash("success", "Success! Your password has been changed.");
            done(err);
          });
        },
      ],
      function (err) {
        res.redirect("/index");
      }
    );
  });

   //MIDDLE WARE
   function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "please log in first")
    res.redirect("/login");
  }

  module.exports = router;