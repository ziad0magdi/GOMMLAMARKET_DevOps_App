// routes/departmentRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const DepartmentController = require("../controllers/Departments");
//const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.get(
  "/departments",
  asyncHandler(DepartmentController.getAllDepartments)
);
router.post("/departments", asyncHandler(DepartmentController.addDepartment));
router.put(
  "/departments/:id",
  asyncHandler(DepartmentController.updateDepartment)
);
router.delete(
  "/departments/:id",
  asyncHandler(DepartmentController.deleteDepartment)
);

module.exports = router;
