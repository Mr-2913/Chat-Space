import express from "express";
import {CreateConversation, getConversationById, getConversations} from "../controller/conversation.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, CreateConversation);
router.get("/", protect, getConversations);
router.get("/:conversationId", protect, getConversationById);
export default router;