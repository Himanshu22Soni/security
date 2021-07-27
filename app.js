require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb://localhost:27017/userDB",
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser.save(function (err) {
      if (!err) {
        console.log("Succesfully Saved");
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});

app.post("/login", function (req, res) {
  const userName = req.body.username;
  const passWord = req.body.password;

  User.findOne({ email: userName }, function (err, foundUser) {
    if (foundUser) {
      bcrypt.compare(passWord, foundUser.password, function (err, result) {
        if (result === true) res.render("secrets");
      });
    } else {
      console.log("No user found please register");
    }
  });
});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});
