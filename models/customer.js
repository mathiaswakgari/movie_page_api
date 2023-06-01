const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true, min: 6, max: 15 },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().required(),
    phone: Joi.string().min(6).max(15).required(),
    isGold: Joi.boolean(),
  };
  return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
