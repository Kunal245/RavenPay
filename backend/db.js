const mongoose = require("mongoose")
const { Schema } = require("zod")

mongoose.connect("mongodb://localhost:27017/ravenPay")

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        lowercase: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    }
})

const User = mongoose.model("User", userSchema)

module.exports = {
    User,

};