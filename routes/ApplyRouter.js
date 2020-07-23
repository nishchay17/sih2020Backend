const express = require("express");
const authenticate = require("../authenticate");
const Scheme = require("../models/Scheme");
const bodyParser = require("body-parser");
const ApplyRouter = express.Router();
ApplyRouter.use(bodyParser.json());

ApplyRouter.route("/").get(authenticate.verifyUser, (req, res, next) => {
  let c = -1;
  if (req.user.caste === 1 || req.user.caste === 2) c = 3;
  console.log(req.user.age);
  Scheme.find({
    $and: [
      {
        eligibilityAgeUpperBound: { $gte: req.user.age },
      },
      {
        eligibilityAgeLowerBound: { $lte: req.user.age },
      },
      {
        eligibilityIncome: { $lte: req.user.income },
      },
      {
        $or: [
          {
            gender: req.user.gender,
          },
          {
            gender: 3,
          },
        ],
      },
      {
        $or: [
          {
            eligibilityCaste: 4,
          },
          {
            eligibilityCaste: req.user.caste,
          },
          {
            eligibilityCaste: c,
          },
        ],
      },
    ],
  })
    .then(
      (schemes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(schemes);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = ApplyRouter;
