const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken")
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const authMiddleware = require("../middleware/authMiddleware");
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

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
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

    const user = await User.findOne({
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

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/",authMiddleware , async function(req, res){
    const parsedUpdate = zod.safeParse(updateBody);
    if(!parsedUpdate.success) {
        res.status(411).json({
            msg: "Error while updating data"
        })
    }

    await User.updateOne({
        _id: req.userId
    })

    res.json({
        msg: "Updated Successfully"
    })
})

router.get("/bulk", async function(req, res){
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id ,
        }))
    })

})

module.exports = router;