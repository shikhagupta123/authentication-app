//jshint esversion:6
require("dontenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password:String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});
app.get("/register", function(req, res){
  res.render("register");
});
app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email:req.body.username,
    password: md5(req.body.password)
  })

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
})

app.post("/login", function(req, res){
    var email = req.body.username;
    var password = md5(req.body.password);

    User.findOne({email:email}, function(err, foundUser){
      if(err){
        console.log(email);
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }else{
            console.log(foundUser.password);
            console.log(password);
            console.log(err);
          }
        }
      }
    })
})

app.listen(3000,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Server is running on port 3000");
  }
})
