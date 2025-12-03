const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);  
      throw new Error("Not Authorized, please login");
    }
    // verify token
    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (err) {
      res.status(401);     
      throw new Error("Invalid token, please login again");
    }

    // Get user id from token
   try {
      const user = await User.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Database error:", err.message);
      res.status(500);
      throw new Error("Internal server error");
    }
   } catch (error) {
    next(error); // Pass to global error handler
  }
});

module.exports = protect;
