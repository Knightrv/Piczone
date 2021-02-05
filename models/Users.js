const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required: true,
    },
    password :{
        type : String,
        required : true,
    },
    pic : {
        type:String,
        default : "https://res.cloudinary.com/cloud-piczone/image/upload/v1612359925/avatar_vf6k4r.svg",
    },
    resetToken : String,
    expireToken : Date,
    followers : [{type:ObjectId,ref:"User"}],
    following : [{type: ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema);