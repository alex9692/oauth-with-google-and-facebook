const express = require("express");
const passport = require("../utils/passport");
const acl = require("../utils/nacl");
const router = express.Router();

const UserController = require("../controller/user");

router.get(
  "/verifyaccount",
  passport.authenticate("jwt", { session: false }),
  UserController.verifyAccountStart
);
router.patch(
  "/verifyaccount/:token",
  passport.authenticate("jwt", { session: false }),
  UserController.verifyAccountEnd
);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  UserController.getMe
);

router.patch(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  UserController.changePassword
);

router.patch(
  "/changeuserinfo",
  passport.authenticate("jwt", { session: false }),
  UserController.changeUserInfo
);

router.get(
  "/adminSecret",
  passport.authenticate("jwt", { session: false }),
  acl.authorize,
  UserController.getMe
);
router.get(
  "/userSecret",
  passport.authenticate("jwt", { session: false }),
  acl.authorize,
  UserController.getMe
);
router.get(
  "/guestSecret",
  passport.authenticate("jwt", { session: false }),
  acl.authorize,
  UserController.getMe
);

module.exports = router;
