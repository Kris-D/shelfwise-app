// middleware/decryptRequest.js
const { decryptData } = require("../utils/encrypt");

function decryptRequest(req, res, next) {
  try {
    if (typeof req.body === "string") {
      req.body = decryptData(req.body);
    }
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid encrypted payload" });
  }
}

module.exports = decryptRequest;