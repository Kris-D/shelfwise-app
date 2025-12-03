const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [8, "Password should be at least 8 characters long"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.postimg.cc/QC1VH63w/1731408804234.jpg",
    },
    phone: {
      type: String,
      default: "+234",
    },
    bio: {
      type: String,
      maxLength: [250, "Bio should not be more than 250 characters "],
      default: "bio",
    },
    referralCode: {
      type: String,
      default: "",
    },
    referralBy: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//Encrypt password before saving to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
  //Hash password with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
