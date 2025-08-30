const listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = res.locals.currUser;
  console.log(newReview);
  list.review.push(newReview);
  await newReview.save();
  await list.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, revId } = req.params;
  review = await Review.findById(revId).populate("author");
  if (!req.user._id.equals(review.author._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  }
  await Review.findByIdAndDelete(revId);
  await listing.findByIdAndUpdate(id, { $pull: { review: revId } });

  req.flash("success", "Review Deleted");
  res.redirect(`/listing/${id}`);
};

