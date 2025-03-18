const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const authController = require("../controllers/auth");
const { verifyUser } = require("../middlewares/auth");

router.post("/signIn", asyncHandler(authController.signIn));
router.get("/user", verifyUser, authController.verifyToken);
router.get("/user", verifyUser, authController.getUser);

module.exports = router;
