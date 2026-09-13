import ChatSpaceMessage from "../models/message.model.js";
import ChatSpaceConversation from "../models/conversation.model.js";

export const CreateMessage = async (req,res) =>{
    try{
        const senderId= req.user.id;

        const {conversationId, content, messageType, replyTo} = req.body;

        if(!conversationId){
            return res.status(400).json({
                success:false,
                message:"Conversation Id is Required"
            });
        }

        if(!content || !content.trim()){
            return res.status(400).json({
                success:false,
                message:"Message content is Required"
            });
        }

        const conversation = await ChatSpaceConversation.findOne({
            _id:conversationId,
            participants:senderId
        });

        if(!conversation){
            return res.status(400).json({
                success:false,
                message:"Conversation not found"
            });
        }

        if(replyTo){
            const repliedMessage=await ChatSpaceMessage.findOne({
                _id:replyTo,
                conversationId:conversationId
            });
        
        if(!repliedMessage){
            return res.status(400).json({
                success:false,
                message:"Replied Message not found"
            });
        }
    }
        const message= await ChatSpaceMessage.create({
            conversationId,
            senderId,
            content,
            messageType:messageType || null,
            replyTo: replyTo || null,
            status:"sent"
        });

        conversation.lastMessage=message._id;
        conversation.lastMessageAt=new Date();

        await conversation.save();

        await message.populate(
            "senderId",
            "name username email"
        );

        return res.status(201).json({
            success:true,
            message:"Message send successfully"
        });

    }catch(error){
        console.error("message creation error: ", error);

        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}