const express = require("express")
const router = express.Router()
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const request = require("request");
const user = require("../models/user");



 
router.get("/result",  isLoggedIn,  (req, res) => {
    const searchTerm = req.query.searchterm;
    const page = req.query.page;
    console.log(searchTerm);
    request(
      `https://api.unsplash.com/search/photos?client_id=NNROZl1C9ZCTlVze-cimHwO8UhL4gkoeG1bU5vp-8fU&per_page=30&page=${page}
        
        &query=${searchTerm}`,
  
      function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          const data = JSON.parse(body);
          res.render("result", {
            picData: data,
            pageNumber: page,
          });
        }
      }
    );
  });



router.get("/send_email", (req, res) => {
    res.render("index")
})
router.post("/send_email", function(req,response){
  req.body
  console.log(req.body)
  
 
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "isdoreagoha5@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    }
  })
  
  const mailOptions = {
    from: req.body.email ,
    to: process.env.EMAIL_USERNAME,
    subject: `mssage from ${req.body.email}: ${req.body.name}:`,
    text: req.body.message
  };
  transporter.sendMail(mailOptions, function (error, info){
    if(error) {
      console.log(error)
    } else {
      console.log("mail sent" + info.response);
      req.flash(
        "success",
        "your e-mail has been sent  " 
          
      );
    };
    response.redirect("/send_email")
    
    
  })

})




router.get("/index", (req, res) => {
  res.render("index")
})

router.get("/click", (req, res) => {
  res.render("click")
})

router.get("/explore", isLoggedIn, (req, res) => {
  req.flash("error", "you need to be logged in to access the explore page")
    res.render("explore");
  });

  router.get("/result", isLoggedIn, (req, res) => {
    res.render("result");
  });

  
  //MIDDLE WARE
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "you need to be logged in to access the explore page")
    res.redirect("/login");
  }

  module.exports = router;