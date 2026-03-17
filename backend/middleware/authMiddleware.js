const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const { User } = require("../db");

const app = express();

function authMiddleware(req, res, next){
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    
    try{
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if(decodedValue.userId) {
            req.userId = decodedValue.userId;
            next();
        } else {
            res.status(403).json({
                msg: "Session expired Signin again"
            })
        }
        
    } catch(err) {
        res.status(403).json({})
    }
}

module.exports = authMiddleware;