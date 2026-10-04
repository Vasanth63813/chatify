import mongoose from 'mongoose';

const messageSchema=mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String
    },
    imageUrl:{
        type:String
    }
})

const Message=mongoose.model("Message",messageSchema);
export default Message;