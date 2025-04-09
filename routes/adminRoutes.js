import express from "express";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", (req, res, next) => {
  console.log(`🛂 /api/admin/login hit at ${new Date().toISOString()}`);
  next(); // Pass control to adminLogin
}, adminLogin);

export default router;