const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const ApplicationController = require("../controllers/Application");
const upload = require("../middlewares/upload");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.post(
  "/Applications",
  asyncHandler(ApplicationController.getAllApplications)
);
router.post(
  "/MyApplication",
  asyncHandler(ApplicationController.getAllUserApplications)
);

router.post(
  "/Application/:id",
  asyncHandler(ApplicationController.getAllApplicationsinformations)
);

router.post(
  "/ApplicationWorkOn",
  asyncHandler(ApplicationController.getApplicationWorkOn)
);
router.post(
  "/Application",
  upload.single("pdfFile"),
  asyncHandler(ApplicationController.AddApplications)
);
router.post(
  "/CancleApplication",
  asyncHandler(ApplicationController.cancleApplication)
);
router.post(
  "/ApproveApplication",
  asyncHandler(ApplicationController.approveApplication)
);
router.post(
  "/DeclineApplication",
  asyncHandler(ApplicationController.declineApplication)
);
router.post(
  "/ChanageApplicationState",
  asyncHandler(ApplicationController.chanageApplicationState)
);
router.post(
  "/AssginApplication",
  asyncHandler(ApplicationController.AssginApplication)
);
router.post(
  "/ReAssginApplication",
  asyncHandler(ApplicationController.ChanageAssginApplication)
);
router.post(
  "/AssginDuration",
  asyncHandler(ApplicationController.AssignDuration)
);
router.post(
  "/ChanageApplicationDuration",
  asyncHandler(ApplicationController.ChanageApplicationDuration)
);
router.delete(
  "/Application/:id",
  asyncHandler(ApplicationController.DeleteApplications)
);

module.exports = router;
