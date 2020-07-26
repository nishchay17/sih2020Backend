const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema(
  {
    state: {
      type: Number,
      default: 0, // (0 panding) (1 ok) (2 rejected)
    },
    schemeId: {
      type: String,
      require: true,
      trim: true,
    },
    userId: {
      type: String,
      require: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
