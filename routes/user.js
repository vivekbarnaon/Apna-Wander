const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

// Render signup form
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// Handle signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    
    // Auto login after signup
    req.login(registeredUser, (err) => {
      if(err) {
        return next(err);
      }
      req.flash("success", "Welcome to Apna Wander!");
      res.redirect("/listing");
    });
  } catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

// Render login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Handle login
router.post("/login", 
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  }
);

// Handle logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listing");
  });
});

module.exports = router;
