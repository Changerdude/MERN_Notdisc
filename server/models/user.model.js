const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "{PATH} is required"],
        unique: true,
        minlength: [5, "{PATH} must be longer than 3 characters"]
    },
    username: {
        type: String,
        required: [true , "{PATH} is required"],
        unique: true,
        minlength: [3, "{PATH} must be longer than 3 characters"]
    },
    pwHash: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    refreshToken: {
        type: String
    }
},{ timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;