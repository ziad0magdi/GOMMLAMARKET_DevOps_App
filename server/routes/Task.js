const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const TaskController = require("../controllers/Task");
const upload = require("../middlewares/upload");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.post(
  "/Task",
  upload.single("pdfFile"),
  asyncHandler(TaskController.AddTask)
);
router.post("/AssignTaskDuration", asyncHandler(TaskController.AssignDuration));
router.post(
  "/changeTaskDuration",
  asyncHandler(TaskController.changeTaskDuration)
);
router.post("/AssginTask", asyncHandler(TaskController.AssginTask));

module.exports = router;
