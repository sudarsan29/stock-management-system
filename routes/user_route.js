const express  = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const UserModel = mongoose.model('UserModel');
const {JWT_SECRET} = require('../config')

router.post("/signup", (req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({error: "one or more fields are empty"});
    }
    UserModel.findOne({email: email})
    .then((userInDB)=>{
        if(userInDB){
            return res.status(500).json({error: "user with this email already existed"});
        }
        bcryptjs.hash(password, 16)
        .then((hashedPassword)=>{
            const user = new UserModel({email, name, password: hashedPassword});
            user.save()
            .then((newUser)=>{
                res.status(201).json({result: "User signed up Successfully"});
            })
            .catch((err)=>{
                console.log(err);
            })
        })
    })
    
});
router.post("/login", (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({error: "one or more fields are empty"});
    }
    UserModel.findOne({email: email})
    .then((userInDB)=>{
        if(!userInDB){
            return res.status(401).json({error: "Invalid Credentials"});
        }
        bcryptjs.compare(password, userInDB.password)
        .then((didMatch)=>{
           if(didMatch){
            const jwtToken = jwt.sign({_id: userInDB._id}, JWT_SECRET);
            const userInfo = {"email": userInDB.email, "name": userInDB.name};

            res.status(201).json({result: {token: jwtToken, user: userInfo}});
           }else{
            return res.status(401).json({error: "Invalid Credentials"});
           }
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch((error)=>{
            console.log(error);
        })
    });
    

module.exports = router;