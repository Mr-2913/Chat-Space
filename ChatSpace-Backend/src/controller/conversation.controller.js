
import ChatSpaceConversation from "../models/conversation.model.js";
import ChatspaceUser from "../models/user.model.js";

export const CreateConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.body;

    // Check userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required.",
      });
    }

    // Cannot create conversation with yourself
    if (currentUserId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself",
      });
    }

    // Check whether other user exists
    const otherUser = await ChatspaceUser.findById(userId);

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check whether private conversation already exists
    const existingConversation = await ChatSpaceConversation.findOne({
      type: "private",
      participants: {
        $all: [currentUserId, userId],
        $size: 2,
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        conversation: existingConversation,
      });
    }

    // Create new conversation
    const conversation = await ChatSpaceConversation.create({
      participants: [currentUserId, userId],
      type: "private",
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConversations =async (req,res)=>{
  try{
    const currentUserId = req.user.id;

    const conversation =await ChatSpaceConversation.find({
      participants:currentUserId
    }).populate("participants","username email profilePicture").sort({updatedAt:-1});

    return res.status(200).json({
      success:true,
      message:"Conversation Fetched Successfully",
      conversation
    });
  }catch(error){
    console.error("get conversation error: ",error);

    return res.status(500).json({
      success:true,
      message:error.message
    });
  }
}

export const getConversationById = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;

    const conversationData = await ChatSpaceConversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    }).populate("participants", "name username email");

    if (!conversationData) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully.",
      conversation: conversationData,
    });
  } catch (error) {
    console.error("Get conversation by ID error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete api