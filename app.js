
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');

const DB='mongodb+srv://viku:viku@clusters.rcqvpoy.mongodb.net/secretdata?retryWrites=true&w=majority'

mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("database is connected to server")
  }).catch((err)=>{
    console.log("err");
  })

const app = express();

app.set('view engine', 'ejs');

const userSchema= new mongoose.Schema({
  email:String,
  password:String
})


userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });

const User=mongoose.model('User',userSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post('/register',function(req,res){
   const newUser=new User({
    email:req.body.username,
    password:req.body.password
   })
   
   newUser.save().then(()=>{
    res.render("secrets");
   }).catch((err)=>{
    res.render(err);
   })
})

app.post('/login',function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username}). then(function(foundUser){
    if(foundUser.password==password){
      res.render("secrets");
    }
    else{
      res.render(" Wrong password");
    }
 
  }).catch((err)=>{
    res.render("User not found");
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
