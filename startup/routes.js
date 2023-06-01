const genresRouter = require("../routes/genres");
const customersRouter = require("../routes/customers");
const moviesRouter = require("../routes/movies");
const rentalsRouter = require("../routes/rentals");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.send("Welcome to Vidly Movie Rental Services");
  });
  app.use("/vidly/api/genres", genresRouter);
  app.use("/vidly/api/rentals", rentalsRouter);
  app.use("/vidly/api/customers", customersRouter);
  app.use("/vidly/api/movies", moviesRouter);
  app.use("/vidly/api/users", usersRouter);
  app.use("/vidly/api/auth", authRouter);

  app.use(error);
};
