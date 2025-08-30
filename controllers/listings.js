const listing = require("../models/listings");

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let { title, description, price, location, country } = req.body;
  // console.log(req.body.listing);
  let newlisting = new listing({
    title,
    description,
    image: {
      url: url,
      filename: filename,
    },
    price,
    location,
    country,
    owner: req.user._id,
  });
  // console.log(newlisting);
  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country } = req.body.listing;

  let list = await listing.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
    console.log(
      url,
      ".....................................................................",
      filename
    );
  }
  await list.save();

  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
  res.render("listings/update.ejs", { list, originalImageUrl });
};

module.exports.index = async (req, res) => {
  const allListing = await listing.find();
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderCreate = (req, res) => {
  res.render("listings/create.ejs");
};

module.exports.renderDetails = async (req, res) => {
  const { id } = req.params;
  // const list = await listing.findById(id);
  const list = await listing
    .findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "The listing u searched for does not exist.");
    return res.redirect("/listing");
  }
  // console.log(reviews.review[0].comments);
  // console.log(list);
  res.render("listings/detail.ejs", { list });
};
