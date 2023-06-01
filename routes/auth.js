const express = require("express");
/* const config = require("config"); */
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
/* const webToken = require("jsonwebtoken"); */
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  const { email, password } = req.body;
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateToken();

  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(8).max(30).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
