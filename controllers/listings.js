const Listing = require("../models/listings");

// 📌 Show all listings
module.exports.index = async (req, res) => {
  const allListing = await Listing.find();
  res.render("listings/index.ejs", { allListing });
};

// 📌 Render Create Listing Form
module.exports.renderCreate = (req, res) => {
  res.render("listings/create.ejs");
};

// 📌 Create new listing
module.exports.createListing = async (req, res, next) => {
  let { title, description, price, location, country } = req.body;

  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    owner: req.user._id,
  });

  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

// Render details of a single listing
module.exports.renderDetails = async (req, res) => {
  const { id } = req.params;

  const list = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "review",
      populate: { path: "author" }
    });

  if (!list) {
    req.flash("error", "The listing you searched for does not exist.");
    return res.redirect("/listing");
  }

  res.render("listings/detail.ejs", { list });
};

//  Render edit form
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);

  if (!list) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }

  let originalImageUrl = list.image?.url || "";
  if (originalImageUrl) {
    // show smaller preview image
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
  }

  res.render("listings/update.ejs", { list, originalImageUrl });
};

// Update a listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body.listing;

  const list = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
  });

  if (req.file) {
    list.image = { url: req.file.path, filename: req.file.filename };
  }

  await list.save();
  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
};

//  Delete a listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
};
