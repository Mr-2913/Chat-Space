import express from "express";

import {
  createUser, loginUser, updateUser, ChangePassword, userProfile
} from "../controller/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// Register
router.post("/register", createUser);


// Login
router.post("/login", loginUser);


// Profile
router.get("/profile",protect , userProfile);


// Update profile
router.put("/profile",protect, updateUser);


// Change password
router.put("/change-password",protect, ChangePassword);


export default router;