const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { validate, User } = require("../models/user");
const { has } = require("lodash");
const route = express.Router();
const webToken = require("jsonwebtoken");
const auth = require("../middleware/auth");

route.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

route.post("/", async (req, res) => {
  const { error } = validate(req.body);
  try {
    const { name, email, password } = req.body;
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: email });
    if (user) return res.status(400).send("User Already Exists");
    user = new User({
      name: name,
      email: email,
      password: password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const token = user.generateToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ name: name, email: email });
  } catch (E) {
    return E;
  }
});

module.exports = route;
