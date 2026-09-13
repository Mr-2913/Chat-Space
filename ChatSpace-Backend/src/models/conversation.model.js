import mongoose from "mongoose";
const ConversationSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSpaceUser",
      required: true,
    },
  ],
  deletedFor: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSpaceUser",
    }
  ],
  type:{
    type:String,
    enum:["private","group"],
    default:"private"
  },
  lastMessage:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "MessageCollection",
    required:false
  },
  lastMessageAt:{
    type: Date,
    default: null
  },
},{
    timestamps:true,
});

const ChatSpaceConversation=mongoose.model("ChatSpaceConversation",ConversationSchema)

export default ChatSpaceConversation;