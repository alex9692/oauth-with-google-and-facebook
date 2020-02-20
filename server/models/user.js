const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    avatar: String,
    username: String,
    name: String,
    email: {
      type: String,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
      type: String,
      minlength: [8, "Password should be minimum 8 characters"],
      select: false
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function(v) {
          return validator.isMobilePhone(v, "en-IN");
        },
        message: v => `${v.value} is not a valid phone number`
      }
    },
    role: {
      type: String,
      enum: ["guest", "user", "admin"],
      default: "guest"
    },
    accountVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    google: String,
    facebook: String
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function(next) {
  if (this.avatar) {
    return next();
  }
  this.avatar = "https://image.flaticon.com/icons/svg/1177/1177568.svg";
  next();
});

userSchema.methods.checkPassword = async function(inputPassword, userPassword) {
  if (!userPassword) return true;
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.generateVerifyAccountToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  return this.constructor.createHashedPasswordResetToken(token);
};

userSchema.methods.createPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = this.constructor.createHashedPasswordResetToken(token);
  this.resetPasswordToken = hashedToken;
  this.resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.statics.createHashedPasswordResetToken = function(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

module.exports = mongoose.model("User", userSchema);
