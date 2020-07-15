const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//this is the same model for normal users as well as for the admin
//if the user is an admin, then most of the fields will be empty or 0
//if the user is a normal user then front-end will provide all the details

const User = new Schema({
  orgName: {
    type: String,
    trim: true,
    default: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: Number, //alphabetical order from 0
    required: true,
    min: 0,
  },
  caste: {
    type: Number, //1=gen, 2=obc, 3=st/sc
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  aadhaarNumber: {
    type: Number,
    required: true,
    unique: true,
    maxlength: 12,
    minlength: 12,
  },
  moblieNumber: {
    type: Number,
    required: true,
    unique: true,
    maxlength: 10,
    minlength: 10,
  },
  income: {
    type: Number,
    required: true,
    min: 0,
  },
  gender: {
    type: Number, // 0=male, 1=female, 2=trans, 3=other
    required: true,
    min: 0,
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
