//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

console.log(process.env.secret);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/secretuserdb");

//creating schema simple version

// const userSchema={
//   email:String,
//   password:String
// };
//changing mongoose schema for encryption
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});
//instead of two keys we use string for encryption
// const secret="Thisisourlittelsecret.";  //see it in the .env file
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});



const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});


app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser= new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  })
});




app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;


  User.findOne({email:username},function(err,foundUser){
    console.log("print the found");
    console.log(foundUser);
    if(err){
      console.log(err);
    }
    else{//user with the email exist
      if(foundUser){//  if(foundUser.email){
        if(foundUser.password===password){
          res.render("secrets");
        }
      }
    }
  })
})








app.listen(3000,function(){
  console.log("server started on port 3000");
});
