//jshint esversion:6
require("dotenv").config();
const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.set('strictQuery',true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt , {secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("User" , userSchema);

app.get("/" , function(req , res){
    res.render("home");
});

app.get("/login" , function(req , res){
    res.render("login");
});

app.get("/register" , function(req , res){
    res.render("register");
});

app.post("/register" , function(req , res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
   });

   newUser.save(function(err)
   {
    if(err)
    {
        res.send(err);
    }else
    {
        res.render("secrets");
    }
   })
});

app.post("/login" , function(req , res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username} , function(err , foundUser){
        if(err)
        {
            console.log(err);
        }else
        {
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    res.render("secrets");
                }
            }
        }
    });
});

























app.listen(3000 , function(req , res){
    console.log("server started on port 3000");
});