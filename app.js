//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res) {
  res.render("home");
})

app.get("/login", function(req,res) {
  res.render("login");
})

app.get("/register", function(req,res) {
  res.render("register");
})

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  try {
    // save 메서드를 프로미스로 감싸고, await를 사용하여 기다림
    const result = await newUser.save();
    console.log(result);
    // 성공적으로 저장된 경우의 처리
    res.render("secrets");
  } catch (err) {
    // 에러 발생 시의 처리
    console.error(err);
  }
});

app.post("/login", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await User.findOne({email: username});
    console.log(result);
    if (result) {
      if (result.password === password) {
        res.render("secrets");
      }
    }
  } catch(err) {
    console.log(err);
  }
});

app.listen(3000, function() {
  console.log('server listen 3000 port');
})