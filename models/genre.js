const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  genreName: { type: String, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);
function validate(genre) {
  const schema = {
    genreName: Joi.string().min(3).required(),
  };
  const result = Joi.validate(genre, schema);
  return result;
}
module.exports.Genre = Genre;
module.exports.validate = validate;
module.exports.genreSchema = genreSchema;
