const mongoose = require("mongoose");
const Joi = require("joi");
const webToken = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateToken = function () {
  return webToken.sign(
    { _id: this._id, isAdmin: this.isAdmin, name: this.name },
    "vildy-api-node"
  );
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(8).max(30).required(),
  };

  return Joi.validate(user, schema);
}
module.exports.User = User;
module.exports.validate = validateUser;
