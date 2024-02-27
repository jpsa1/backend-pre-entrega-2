import mongoose from "mongoose";

const messagesCollection = 'messages'

const messagesShema = new mongoose.Schema({
    user:String, 
    message: String
})

export const messagesModel = mongoose.model(messagesCollection, messagesShema)