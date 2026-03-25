const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { Account, User } = require("../db");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async function(req, res){
    const account = await Account.findOne({
        userId: req.userId
    });

    if(!account){
        return res.status(404).json({
            msg: "Account not found!!"
        })
    }

    res.json({
        balance: account.balance
    })
})

// router.post("/transfer", async function(req, res){
//     const { amount, to } = req.body;
//     const account = await Account.findOne({
//         userId: req.userId
//     })

//     if(account.balance < amount) {
//         res.status(400).json({
//             msg: "Insufficient Balance"
//         })
//     }

//     const toAccount = await Account.findOne({
//         userId: req.to
//     })

//     if(!toAccount) {
//         res.status(400).json({
//             msg: "Invalid Account"
//         })
//     }

//     await Account.updateOne({
//         userId: to
//     },{
//         $inc: {
//             balance: amount
//         }
//     })

//     await Account.updateOne({
//         userId: userId
//     },{
//         $inc: {
//             balance: -amount
//         }
//     })

//     res.json({
//         msg: "Transaction Failed"
//     })
// })

router.post("/transfer", authMiddleware, async function(req, res) {

    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(!account) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Invalid Account"
        })
    }
    if(amount > account.balance) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient Balance"
        })
    }
    
    const toAccount = await Account.findOne({
        userId: to
    }).session(session);

    if(!toAccount) {
        await session.abortTransaction();
        return res.json({
            msg: "Invalid Account"
        })
    }

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    }).session(session)
    
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    }).session(session)

    await session.commitTransaction();

    res.json({
        msg: "Transaction Sucessful!!"
    })
})

module.exports = router