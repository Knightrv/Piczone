const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const {MONGOURI} = require('./config/keys');
const app = express();

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected",()=>{
    console.log("Connected to database");
});

mongoose.connection.on("error",(err)=>{
    console.log("Error occured : "+err);
});

require('./models/Users');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT} .`);
});
