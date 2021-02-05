const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require('../middleware/requireLogin');

router.post('/register',(req,res)=>{
    const {username,name,email,password,pic} = req.body;
    if(!username || !name || !email || !password){
        return res.status(422).json({error : "Please add all the fields"});
    }

    User.findOne().or([{'email':email},{'username':username}])
    .then((savedUser)=>{
        if(savedUser){
            if(savedUser.email === email){
                return res.status(422).json({error : "User already exists with same email ID!"});
            }
            else{
                return res.status(422).json({error: "User already exists with same Username !"});
            }
        }
        bcrypt.hash(password,14)
        .then(hashedPassword=>{
            const user = new User({
                username,
                name,
                email,
                password : hashedPassword,
                pic
            });
            user.save()
            .then(user=>{
                res.json({message : "saved successfully"});
            })
            .catch(err=>{
                console.log(err);
            })   
        })
    })
    .catch(err=>{
        console.log(err);
    })

});

router.post("/login",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password !!"});
    }
    User.findOne({email : email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error : "Invalid email or password !!"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name,username,email,followers,following,pic} = savedUser;
               
                res.json({token,user:{_id,name,username,email,followers,following,pic}});
            }else{
                return res.status(422).json({error : "Invalid email or password"});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
})


router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }else{
            const token = buffer.toString('hex');
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:"No user exist with given email !!"});
                }
                user.resetToken = token;
                user.expireToken = Date.now()+1800000;
                user.save().then((result)=>res.json({message : "User Successfully Verified !!",token:token}))
            })
        }
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    
    User.findOne({resetToken : sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again Session Expired"});
        }
        bcrypt.hash(newPassword,14).then(hashedPassword=>{
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.expiredToken = undefined;
            user.save().then(savedUser=>{
                res.json({message:"Password Updated Successfully :)"})
            })
        })
    }).catch(err=>console.log(err))
})

module.exports = router;
