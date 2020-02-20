const express = require("express");
const router = express.Router();

const AuthController = require("../controller/auth");

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.get("/signout", AuthController.signout);
router.post("/forgot", AuthController.forgotPassword);
router.patch("/reset/:token", AuthController.resetPassword);
router.post("/googleauth", AuthController.verifyGoogle);
module.exports = router;
