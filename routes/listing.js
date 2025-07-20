const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const {validateEditListing, isLoggedIn, ownerListing, validateListing } = require("../middleware");
const router = express.Router();
const controller = require("../controllers/listings");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

// Show route for listing
// create route for adding to a list
router
  .route("/")
  .post(
    upload.single("image"),
    isLoggedIn,
    validateListing,
    wrapAsync(controller.createListing)
  )
  .get(wrapAsync(controller.index));

// Show route for Create Listing
router.get("/new", isLoggedIn, controller.renderCreate);

// Listing update route
// Show route for details of a listing
router
  .route("/:id")
  .put(
    upload.single("image"),
    isLoggedIn,
    ownerListing,
    validateEditListing,
    wrapAsync(controller.updateListing)
  )
  .get(wrapAsync(controller.renderDetails));

// delete route
router.delete(
  "/:id/delete",
  isLoggedIn,
  ownerListing,
  wrapAsync(controller.destroyListing)
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  ownerListing,
  wrapAsync(controller.editListing)
);

module.exports = router;
