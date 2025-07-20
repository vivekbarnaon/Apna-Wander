const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/users");

// Signup route
router.route("/signup")
.post(wrapAsync(controller.postSignup))
.get(controller.renderSignup);


// Login route
router.route("/login")
.get(controller.renderLogin)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  controller.postLogin
);

// Logout Route
router.get("/logout", controller.logout);

module.exports = router;
