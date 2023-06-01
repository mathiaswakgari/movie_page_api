const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  title: String,
  /* genre: { type: genreSchema, required: true } */
  genreId: String,
  numberInStock: Number,
  dailyRentalRate: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

function validate(movie) {
  const schema = {
    title: Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  };
  return Joi.validate(movie, schema);
}
module.exports.Movie = Movie;
module.exports.validate = validate;
