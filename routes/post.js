const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");


router.get('/allposts',requireLogin,(req,res)=>{
    Post.find().populate("postedBy","_id name username pic")
    .populate("comments.postedBy","_id name username pic")
    .populate("postedBy","_id name username pic")
    .then(posts=>{
        res.json({posts});
    }).catch(err=>{
        console.log(err);
    })
})

router.get('/followingposts',requireLogin,(req,res)=>{
    
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name username pic")
    .populate("comments.postedBy","_id name username pic")
    .populate("postedBy","_id name username pic")
    .then(posts=>{
        res.json({posts});
    }).catch(err=>{
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,caption,image} = req.body;
    if(!title || !caption || !image){
        return res.status(422).json({error: "Please add all the fields"});
    }
    req.user.password=undefined;
    const post = new Post({
        title,
        body:caption,
        photo:image,
        postedBy: req.user
    })
    post.save().then(result=>{
        res.json({post : result});
    }).catch(err=>{
        console.log(err);
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    const sort = {'_id':-1}
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name username pic").populate("comments.postedBy","_id name username pic").sort(sort)
    .then(myPost=>{
        res.json({myPost});
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put('/like',requireLogin,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postID,{
        $push:{likes:req.user._id}
    },{
        new : true
    }).populate("postedBy","_id name username pic")
    .populate("comments.postedBy","_id name username pic").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postID,{
        $pull : {likes : req.user._id}
    },{
        new : true
    }).populate("postedBy","_id name username pic")
    .populate("comments.postedBy","_id name username pic").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    
    Post.findByIdAndUpdate(req.body.postID,{
        $push:{comments:comment}
    },{
        new : true
    }).populate("comments.postedBy","_id name username pic")
    .populate("postedBy","_id name username pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
})

router.delete("/deletepost/:postID",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postID})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err});
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            Post.deleteOne({_id:req.params.postID},(err,result)=>{
                if(err){
                    return res.status(422).json({error:err});
                }else{
                    
                    res.json({message:"Deleted Successfully",_id:req.params.postID});
                }
            })
        }
    })
})


module.exports = router;