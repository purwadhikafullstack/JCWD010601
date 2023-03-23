const express = require("express");
const router = express.Router();

const userContoller = require("../../controllers/admin/user/userController");

import { emailValidator } from "../../validations/admin/loginValidation";

// Get All Admin
// localhost:8000/api/admin?role=User -> Must add req query
router.get("/admin", userContoller.getAllUsers);

// Create Admin
router.post("/admins", emailValidator(), userContoller.createAdmin);

// Update Admin
router.put("/admin/:adminID", emailValidator(), userContoller.updateAdmin);

// delete Admin
router.delete("/admin/:adminID", userContoller.deleteAdmin);

module.exports = router;
