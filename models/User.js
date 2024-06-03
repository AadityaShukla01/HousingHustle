import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists... '],
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    bookmarks: [
        {
            type: Schema.ObjectId,
            // model from where we will get object id
            ref: 'Property'
        }
    ]
}, {
    timestamps: true
})

const User = models.User || model('User', userSchema);

export default User;