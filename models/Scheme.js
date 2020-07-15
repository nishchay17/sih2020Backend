const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const SchemeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  type: {
    type: Number,
    default: 0,
  },
  eligibilityIncome: {
    type: Number,
    required: true,
  },
  eligibilityCaste: {
    type: Number,
    required: true,
  },
  state: {
    type: Number,
    required: true,
    trim: true,
  },
  eligibilityAgeUpperBound: {
    type: Number,
    required: false,
  },
  eligibilityAgeLowerBound: {
    type: Number,
    required: false,
    min: 0,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  gender: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    default: "",
  },
  author: {
    type: String,
    required: true,
  },
  inProcess: {
    type: Number,
    min: 0,
    default: 0,
  },
  haveThis: [{ type: String }],
});

const Schemes = mongoose.model("Scheme", SchemeSchema);
module.exports = Schemes;
