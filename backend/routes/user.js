const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken")
const { User } = require("../db");
const JWT_SECRET = require("../config")
const app = express();

const signupBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    userName: zod.string().email(),
    password: zod.string(),
})

const router = express.Router();
router.post("/signup", async function (req, res){
    const parsedSignup = zod.safeParse(req.body);
    // const { success } = zod.safeParse(req.body); -object destructuring syntax
    if(!parsedSignup.success){
        res.status(411).json({
            msg: "Invalid input type"
        })
    }
    const existingUser = await User.findOne({
        userName: req.body.userName
    })

    if(existingUser){
        res.status(411).json({
            msg: "username already exist!!"
        })
    }

    const user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstname,
        lastName: req.body.lastName
    })

    const userId = user._id;

    const token = jwt.sign({userId}, JWT_SECRET);

    res.json({
        msg: "User created sucessfully"
    })
})

const signinBody = zod.object({
    userName: zod.string(),
    password: zod.string(),
})

router.post("/signin", async function(req, res){
    const parsedSignin = zod.safeParse(signinBody);
    if (!parsedSignin.success){
        res.status(411).json({
            msg: "Invalid input type"
        })
    }

    const user = await User.find({
        userName: req.body.userName,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        msg: "User doesn't exist"
    })
})

module.exports = router;