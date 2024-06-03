import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Schema } from "mongoose";


const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    }, name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    }, phone: {
        type: String,
    },
    body: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;