require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listings");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl, ownerListing, validateListing } = require("./middleware");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.dbUrl;
const secretCode = process.env.SECRET;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: secretCode
  },
  touchAfter: 24*3600
})

store.on("error",(err)=>{
  console.log("Something went wrong in Atlas database",err);
})

const sessionOptions = {
  secret: secretCode,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  store: store
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// middleWare for flash messages(to store in local)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Home route
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// SignUp route

app.use("/listing",listingRouter);

app.use("/",userRouter);

app.use("/listings",reviewRouter);

// Error handling
app.all("*any", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
  // res.status(statusCode).send(message);
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  
  // res.status(statusCode).send(message);
  if (statusCode === 400) {
    req.flash("error", message);
    return res.redirect(req.get("referer") || "/");
  }
  res.render("error.ejs", { message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening to the server");
});
