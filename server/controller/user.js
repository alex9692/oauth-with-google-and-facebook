const User = require("../models/user");
const { errorHandler } = require("../utils/errorHandler");
const sendMail = require("../utils/sendMail");
const { generateToken } = require("./auth");

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const token = generateToken(user.id, user.role);
    res.status(200).json({
      status: "success",
      data: {
        token,
        user
      }
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.verifyAccountStart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(errorHandler("User doesn't exist", "fail", 404));
    }
    if (user.role !== "guest") {
      return next(errorHandler("Account is already verified", "fail", 400));
    }

    const token = user.generateVerifyAccountToken();
    user.accountVerificationToken = token;
    await user.save();

    // const url = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/user/verifyaccount/${token}`;
    const url = `${req.protocol}://localhost:8080/verifyaccount/${token}`;
    const message = `Verify your account by going to this ${url} link.\nIgnore this mail if your account is already verified `;

    const mailConfig = {
      email: user.email,
      subject: "Email verification",
      message
    };

    try {
      await sendMail(mailConfig);

      res.status(200).json({
        status: "success",
        message: "Mail to verify your account has been sent."
      });
    } catch (error) {
      console.log(error);
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

exports.verifyAccountEnd = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler("User doesn't exist", "fail", 404));
    }
    if (user.accountVerificationToken !== token) {
      return next(
        errorHandler(
          "There was a problem verifying your account.Please try again later ",
          "fail",
          400
        )
      );
    }
    if (user.role !== "guest") {
      return next(errorHandler("Account is already verified", "fail", 400));
    }
    user.role = "user";
    user.accountVerificationToken = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Your account has been verified"
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user || !(await user.checkPassword(oldPassword, user.password))) {
      return next(
        errorHandler(
          "Your current password is incorrect.Please try again",
          "fail",
          400
        )
      );
    }
    if (newPassword !== confirmNewPassword) {
      return next(errorHandler("New Passwords don't match", "fail", 400));
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully"
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

exports.changeUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    for (let field in req.body) {
      user[field] = req.body[field];
    }

    await user.save();
    res.status(200).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};
