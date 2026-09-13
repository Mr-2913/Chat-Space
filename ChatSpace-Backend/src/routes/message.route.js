import express from "express";
import { CreateMessage } from "../controller/message.controller.js";
import { protect }from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, CreateMessage);

export default router;