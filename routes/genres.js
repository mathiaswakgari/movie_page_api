const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleWare = require("../middleware/async");

router.get("/", async (req, res) => {
  /* throw new Error("Couldnt get Genres"); */
  const genres = await Genre.find().sort({ genreName: 1 });
  res.header("Access-Control-Allow-Origin", "*").send(genres);
});
router.get(
  "/:id",
  asyncMiddleWare(async (req, res, next) => {
    const genre = await Genre.find({ _id: req.params.id }).sort({
      genreName: 1,
    });
    if (!genre) return res.status(404).send("Genre could not be found.");
    console.log(genre);
    res.header("Access-Control-Allow-Origin", "*").send(genre);
  })
);
router.post(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({
      genreName: req.body.genreName,
    });
    await genre.save();
    res.send(genre);
  })
);
router.put(
  "/:id",
  asyncMiddleWare(async (req, res, next) => {
    const genre = await Genre.update(
      { _id: req.params.id },
      {
        genreName: req.body.genreName,
      }
    );
    res.send(`Genre with id ${req.params.id} updated Succesfully`);
  })
);
router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleWare(async (req, res, next) => {
    const genre = await Genre.deleteOne({ _id: req.params.id });
    res.send("Deleted!");
  })
);

module.exports = router;
