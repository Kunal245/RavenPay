const mongoose = require("mongoose")
const { Schema } = require("zod")

mongoose.connect("mongodb://localhost:27017/")

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String
})

const User = mongoose.model("User", userSchema)

module.exports({
    User,

})