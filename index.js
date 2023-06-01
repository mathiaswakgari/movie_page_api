const express = require("express");
const winston = require("winston");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
require("./startup/validation_joi")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});
