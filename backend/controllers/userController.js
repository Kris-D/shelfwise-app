const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const resetPasswordTemplate = require("../emails/resetPasswordTemplate");

// jwt Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
// Generate referral code
const generateReferralCode = async (username) => {
  let referralCode;
  let isUnique = false;

  while (!isUnique) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    referralCode = `${username}${randomDigits}`;

    // Check if referralCode already exists
    const existingUser = await User.findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return referralCode;
};

//   Create user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //check if all fields are present
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // check password length
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password should be at least 8 characters ");
  }

  // check if email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  //  Generate a unique referral code
  const referralCode = await generateReferralCode(username);

  // create user
  const user = await User.create({
    username,
    email,
    password,
    referralBy: req.body.referralBy || "",
    referralCode,
  });

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const {
      _id,
      username,
      email,
      photo,
      phone,
      bio,
      referralCode,
      referralBy,
    } = user;
    res.status(201).json({
      _id,
      username,
      email,
      photo,
      phone,
      bio,
      referralCode,
      referralBy,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//   Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found please sign up");
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  if (isPasswordCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1 day
      sameSite: "none",
      secure: true,
    });
  }

  if (user && isPasswordCorrect) {
    const {
      _id,
      username,
      email,
      photo,
      phone,
      bio,
      referralCode,
      referralBy,
    } = user;
    res.status(200).json({
      _id,
      username,
      email,
      photo,
      phone,
      bio,
      referralCode,
      referralBy,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "User Successfully Logged Out",
  });
});

//Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const {
      _id,
      username,
      email,
      photo,
      phone,
      bio,
      referralCode,
      referralBy,
    } = user;
    res.status(200).json({
      _id,
      username,
      email,
      photo,
      phone,
      bio,
      referralCode,
      referralBy,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // verify token
   try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return res.json(true);
  } catch (error) {
    return res.json(false); // token invalid or expired
  }
});

//Update User Data
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { username, email, photo, phone, bio } = user;
    user.email = email;
    user.username = req.body.username || username;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  //Check if user is logged in
  if (!user) {
    res.status(400);
    throw new Error("User not found please signup");
  }

  // Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new Password");
  }

  //Check if oldPassword Matches Password in DB
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save New Password
  if (user && isPasswordCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password Changed Successfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  // Hash Reset Token before saving it to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Save HashToken to DB

  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
  }).save();

  // Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Construct Reset Email
  const year = new Date().getFullYear();
  const timestamp = new Date().toISOString();
  const htmlContent = resetPasswordTemplate(
    user.username,
    resetUrl,
    year,
    timestamp
  );
  const message = htmlContent;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
    res
      .status(200)
      .json({ success: true, message: "Reset Email Sent Successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Error sending email, please try again");
  }
});
// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash Token then compare it to the one in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Find Token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  // Check if Token not exists or is expired
  if (!userToken) {
    res.status(400);
    throw new Error("Invalid or Expired Token");
  }

  // Find User by ID
  const user = await User.findById({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res
    .status(200)
    .json({
      success: true,
      message: "Password Reset Successfully, Please Login  ",
    });
});
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
