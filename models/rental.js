const mongoose = require("mongoose");
const Joi = require("joi");
/* Joi.objectId = require("joi-objectid")(Joi); */

const rentalSchema = mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  },
  movie: {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlenght: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  },
  /* dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  }, */
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
    max: 255,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validate(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validate;
