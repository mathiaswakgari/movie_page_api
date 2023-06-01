const express = require("express");
//const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
/* mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connection to Vidly is successful.");
  })
  .catch((e) => {
    return;
  }); */

async function createCustomer(name, isGold, phone) {
  try {
    const customer = await new Customer({
      isGold: isGold,
      name: name,
      phone: phone,
    });
    await customer.save();
    return customer;
    //console.log(customer);
  } catch (e) {
    return;
  }
}

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      name: 1,
    });
    res.send(customers);
  } catch (e) {
    return;
  }
});
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.find({
      _id: req.params.id,
    });
    res.send("%j", customer);
  } catch (e) {
    return;
  }
});
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  try {
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await createCustomer(
      req.body.name,
      Boolean(req.body.isGold),
      req.body.phone
    );
    console.log(`New Customer ${customer}.`);
    res.send(customer);
  } catch (e) {
    return;
  }
});
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  try {
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.update(
      { _id: req.params.id },
      {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      }
    );
    res.send(`Customer with id ${req.params.id} updated.`);
  } catch (e) {
    return;
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.send(`Customer with id ${req.params.id} Deleted.`);
  } catch (e) {
    return;
  }
});

module.exports = router;
