import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSpaceConversation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSpaceUser",
      required: true,
    },

    content: {
      type: String,
      default: "",
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "document", "file"],
      default: "text",
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "received"],
      default: "sent",
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ChatSpaceMessage = mongoose.model("Message", MessageSchema);

export default ChatSpaceMessage;