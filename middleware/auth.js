const webToken = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied!");

  try {
    const decoded = webToken.verify(token, "vildy-api-node");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = auth;
