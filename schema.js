const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  // image: Joi.file().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports.listingEditSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required(),
  comments: Joi.string().required(),
});
