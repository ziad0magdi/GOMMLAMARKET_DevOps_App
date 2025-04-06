// routes/departmentRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const MeetingsController = require("../controllers/Meeting");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.post("/AddMeeting", asyncHandler(MeetingsController.addMeeting));
router.post(
  "/MeetingLocation",
  asyncHandler(MeetingsController.getMeetingLocation)
);
router.post("/approveMeeting", asyncHandler(MeetingsController.approveMeeting));
router.post("/declineMeeting", asyncHandler(MeetingsController.declineMeeting));

module.exports = router;
