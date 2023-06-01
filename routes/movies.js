const express = require("express");
const moviesRouter = express.Router();
const mongoos = require("mongoose");
const { Genre } = require("../models/genre");
const { validate, Movie } = require("../models/movie");
const auth = require("../middleware/auth");

/* mongoos
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connection Succesful...");
  })
  .catch((e) => {
    return;
  }); */

async function createMovie(title, genre) {
  const movie = new Movie({
    title: title,
    genreId: genre,
    numberInStock: 0,
    dailyRentalRate: 0,
  });
  await movie.save();

  return movie;
}

/* createMovie(
  "Hello",
  new Genre({
    genreName: "Action",
  })
); */
moviesRouter.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ name: 1 });

    /* console.log("%j", movies); */
    res.header("Access-Control-Allow-Origin", "*").send(movies);
  } catch (e) {
    return;
  }
});
moviesRouter.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.find({ _id: req.params.id });

    /* console.log(movie); */
    res.header("Access-Control-Allow-Origin", "*").send(movie);
  } catch (e) {
    return;
  }
});
moviesRouter.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  try {
    if (error) return res.status(400).send(error.details[0].message);
    const movie = await createMovie(req.body.title, req.body.genreId);
    console.log(`New Movie ${movie}.`);
    res.send(movie);
  } catch (E) {
    return;
  }
});
moviesRouter.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  try {
    if (error) return res.status(400).send(error.details[0].message);
    const movie = await Movie.update(
      { _id: req.params.id },
      {
        title: req.body.title,
        genreId: req.body.genreId,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      }
    );
    const updatedMovie = await Movie.find({ _id: req.params.id });
    res.send(updatedMovie);
  } catch (r) {
    return;
  }
});
moviesRouter.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send("Movie couldn't be found");
    res.send(movie);
  } catch (e) {
    return;
  }
});

module.exports = moviesRouter;
