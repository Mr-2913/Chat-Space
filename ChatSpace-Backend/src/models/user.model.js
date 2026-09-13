import mongoose from "mongoose";

const UserSchema= mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            maxlength:50,
        },
        username:{
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
        phonenumber:{
            type:Number,
            required:true,
            trim:true,
            unique:true,
        },
        email:{
            type:String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
    timestamp:true
    }
);

const ChatSpaceUser=mongoose.model("ChatSpaceUser", UserSchema);

export default ChatSpaceUser;