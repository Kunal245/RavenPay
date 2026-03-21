const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { Account } = require("../db");
const router = express.Router();

router.get("/balance", authMiddleware, async function(req, res){
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
})

router.post("/transfer", async function(req, res){
    const { amount, to } = req.body;
    const account = await Account.findOne({
        userId: req.userId
    })

    if(account.balance < amount) {
        res.status(400).json({
            msg: "Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: req.userId
    })

    if(!toAccount) {
        res.status(400).json({
            msg: "Invalid Account"
        })
    }

    
})

module.exports = router