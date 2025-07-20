const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateReview} = require("../middleware");
const controller = require("../controllers/reviews");

const router = express.Router();

// Review create route
router.post(
  "/:id/review",
  isLoggedIn,
  validateReview,
  wrapAsync(controller.createReview)
);

// Review Delete Route
router.delete(
  "/:id/review/:revId",
  isLoggedIn,
  wrapAsync(controller.destroyReview)
);

module.exports = router;