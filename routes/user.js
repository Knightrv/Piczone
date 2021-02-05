const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");


router.get("/user/:_id",requireLogin,(req,res)=>{
    if(req.params._id.toString()=== req.user._id.toString()){
        return res.status(422).json({error:"same"});
    }
    const sort = {'_id':-1}
    User.findOne({_id:req.params._id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params._id})
        .populate("postedBy","_id name username pic").sort(sort)
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json({user,posts})
            }
        })        
    }).catch(err=>{
        return res.status(404).json({error:"User not found"});
    })
})

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push : {followers : req.user._id}
    },{new : true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push : {following : req.body.followId}
        },{new :true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull : {followers : req.user._id}
    },{new : true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull : {following : req.body.unfollowId}
        },{new :true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})


router.put("/uploadpic",requireLogin,(req,res)=>{
    const {username,name,email,pic} = req.body;
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
        User.findByIdAndUpdate(req.user._id,{username,name,email,pic},{new : true,omitUndefined:true}).select("-password")
        .then(result=>{
            res.json(result);
        }).catch(err=>{return res.status(422).json({error:err})})
    })       
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp('^'+req.body.query);
    User.find({username:{$regex : userPattern}}).select("_id username")
    .then(user=>res.json({user}))
    .catch(err=>console.log(err))
})

module.exports= router;