// routes/departmentRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const UsersController = require("../controllers/User");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.post("/User", asyncHandler(UsersController.addUser));
router.post(
  "/Employee",
  asyncHandler(UsersController.GetAllEmployeeWithSpacificUser)
);
router.post("/ApproveAccounts", asyncHandler(UsersController.ApproveAccounts));
router.post("/DeclineAccounts", asyncHandler(UsersController.DeclineAccounts));
module.exports = router;
