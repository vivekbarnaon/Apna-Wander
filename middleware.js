const listing = require("./models/listings");
const {listingEditSchema, listingSchema,reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");

// const passport = require("passport");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if(req.method === 'GET'){
        req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "You must logged in to do changes");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.ownerListing = async (req, res, next) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  if (!list.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

// middleWare for listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);
  if(!req.file){
    throw new ExpressError(400, "Image is required");
  }
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// MiddleWare for edit listing
module.exports.validateEditListing = (req, res, next) => {
  let { error } = listingEditSchema.validate(req.body.listing);
  // console.log(result);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// middleware for review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body.review);
  // console.log(result);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};
