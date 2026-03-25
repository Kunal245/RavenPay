const mongoose = require("mongoose")
const Schema = mongoose.Schema;

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

const accountSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
})

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account,

};