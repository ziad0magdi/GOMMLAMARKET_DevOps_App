const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const BranchesController = require("../controllers/Branches");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.get("/branch", asyncHandler(BranchesController.getAllBranchess));
router.post("/branch", asyncHandler(BranchesController.addBranches));
router.put("/branch/:id", asyncHandler(BranchesController.updateBranches));
router.delete("/branch/:id", asyncHandler(BranchesController.deleteBranches));

module.exports = router;
