const User = require("../models/user");

module.exports.postSignup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "U have successfully registered");
      res.redirect("/listing");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postLogin = (req, res) => {
  req.flash("success", "Welcome to wannderer again");
  // console.log(req);
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.renderLogin = (req, res) => {
  console.log(req);
  res.render("users/login.ejs");
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have successfully logged out");
    res.redirect("/listing");
  });
};
