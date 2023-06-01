const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validate, Rental } = require("../models/rental");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
/* mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connection Succesful");
  })
  .catch((e) => {
    return;
  }); */
Fawn.init(mongoose);
/* async function createRental() {
  const rental = new Rental({
    customer: {
      name: "Mathias Wakgari",
      isGold: true,
      phone: "s213123",
    },
    movie: {
      title: "Hello World",
      dailyRentalRate: 2,
    },
  });

  await rental.save();
  console.log("%j", rental);
} */

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find();
    console.log("%j", rentals);
    res.send(rentals);
  } catch (e) {
    return;
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Movie not Found");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  /* rental = await rental.save();
  movie.numberInStock--;
  movie.save(); */
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (e) {
    res.status(500).send("Server Failed");
  }
});

module.exports = router;
