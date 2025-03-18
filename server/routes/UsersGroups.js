// routes/departmentRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const UsersGroupsController = require("../controllers/UsersGroups");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.get(
  "/usersgroups",
  asyncHandler(UsersGroupsController.getAllUsersGroups)
);
router.post("/usersgroups", asyncHandler(UsersGroupsController.addUserGroup));
router.delete(
  "/usersgroups",
  asyncHandler(UsersGroupsController.deleteUserGroup)
);
module.exports = router;
