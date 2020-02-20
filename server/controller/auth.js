const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");
const { errorHandler } = require("../utils/errorHandler");
const sendMail = require("../utils/sendMail");

const cookieOptions = req => {
  return {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https"
  };
};

const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return next(errorHandler("Please enter your email address", "fail", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(errorHandler("Incorrect Email or Password", "fail", 400));
    }
    user.password = undefined;

    const token = generateToken(user.id, user.role);

    const tokenExpirationDate = new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRY, 10) * 60 * 60 * 1000
    );
    res.cookie("jwt", token, cookieOptions(req));
    res.status(200).json({
      status: "success",
      data: {
        token,
        user,
        tokenExpirationDate
      }
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.signout = (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
    message: "user sign out successfull"
  });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(errorHandler("Please enter your email address", "fail", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler("User doesn't exist", "fail", 404));
    }

    const passwordResetToken = user.createPasswordResetToken();
    await user.save();

    // const url = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/auth/reset/${passwordResetToken}`;

    const url = `${req.protocol}://localhost:8080/reset/${passwordResetToken}`;
    const message = `Please goto this ${url} link to reset your password. \nIgnore this if you dont want to reset your password.`;

    const mailConfig = {
      email: user.email,
      message,
      subject: "Reset Password"
    };

    try {
      await sendMail(mailConfig);
      res.status(200).json({
        status: "success",
        message: "Link to reset your password has been sent to your mail"
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      console.log(error);
      await user.save();
      return next(
        errorHandler(
          "There was an error sending the mail. Please try again later",
          "error",
          500
        )
      );
    }
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;
    console.log(validator.isHexadecimal(token));
    if (!validator.isHexadecimal(token)) {
      return next(errorHandler("Invalid Token.  Please retry.", "fail", 400));
    }

    if (newPassword !== confirmPassword) {
      return next(errorHandler("Passwords don't match", "fail", 400));
    }
    const hashedPasswordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      $and: [
        { resetPasswordToken: hashedPasswordResetToken },
        { resetPasswordTokenExpiry: { $gt: Date.now() } }
      ]
    });
    if (!user) {
      return next(
        errorHandler(
          "The session to reset your password has expired! Please try again",
          "fail",
          408
        )
      );
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password was reset successfully"
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.oAuth = (req, res, next) => {
  const token = generateToken(req.user.id, req.user.role);
  res.cookie("jwt", token, cookieOptions(req));
  res.status(200).json({
    status: "success",
    data: {
      token,
      user: req.user
    }
  });
};

exports.verifyGoogle = async (req, res, next) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENTID);
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENTID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const profile = ticket.getPayload();
    console.log(ticket);
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    // passport cb
    if (req.user) {
      const exitingUser = User.findOne({ google: profile.sub });
      if (exitingUser && exitingUser.id !== req.user.id) {
        return done(
          errorHandler(
            "There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.",
            "fail",
            400
          ),
          false
        );
      } else {
        const user = User.findById(req.user.id);
        user.google = profile.sub;
        user.username = user.username || profile.name;
        user.name = user.name || profile.given_name;
        user.avatar = user.avatar || profile.picture;
        await user.save();
        //
        const token = generateToken(user.id, user.role);
        res.cookie("jwt", token, cookieOptions(req));
        res.status(200).json({
          status: "success",
          data: {
            token,
            user
          }
        });
      }
    } else {
      const user = await User.findOne({ google: profile.sub });
      if (user) {
        //
        const token = generateToken(user.id, user.role);
        res.cookie("jwt", token, cookieOptions(req));
        res.status(200).json({
          status: "success",
          data: {
            token,
            user
          }
        });
      } else {
        const user = await User.findOne({ email: profile.email });
        if (user) {
          user.google = profile.sub;
          user.username = user.username || profile.name;
          user.name = user.name || profile.given_name;
          user.avatar = user.avatar || profile.picture;

          await user.save();
          //
          const token = generateToken(user.id, user.role);
          res.cookie("jwt", token, cookieOptions(req));
          res.status(200).json({
            status: "success",
            data: {
              token,
              user
            }
          });
        } else {
          const body = {
            username: profile.name,
            name: profile.given_name,
            google: profile.sub,
            avatar: profile.picture,
            email: profile.email
          };
          const user = await User.create(body);
          //
          const token = generateToken(user.id, user.role);
          res.cookie("jwt", token, cookieOptions(req));
          res.status(200).json({
            status: "success",
            data: {
              token,
              user
            }
          });
        }
      }
    }
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.unlinkAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler("User doesn't exist", "fail", 404));
    }
    user[token] = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      data: {
        user,
        message: "Account has been unlinked."
      }
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.cookieOptions = cookieOptions;
exports.generateToken = generateToken;
