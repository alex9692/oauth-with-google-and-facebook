const express = require("express");
const passport = require("../utils/passport");
const router = express.Router();

const AuthController = require("../controller/auth");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/logout", (req, res) => {
  res.redirect("/api/v1/auth/signout");
});

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     session: false,
//     scope: ["profile", "email"]
//   })
// );

// router.get(
//   "/google/redirect",
//   passport.authenticate("google", { session: false }),
//   AuthController.oAuth
// );

router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  AuthController.oAuth
);

router.post(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  AuthController.oAuth
);

router.get(
  "/unlink/:token",
  passport.authenticate("jwt", { session: false }),
  AuthController.unlinkAccount
);

module.exports = router;
