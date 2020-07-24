const express = require("express");
const authenticate = require("../authenticate");
const Scheme = require("../models/Scheme");
const Applicatio = require("../models/Application");
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

ApplyRouter.route("/:id").get(authenticate.verifyUser, (req, res, next) => {
  const schemeId = req.params.id;
  const userId = req.user._id;
  Applicatio.create({ schemeId, userId })
    .then(
      (application) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(application);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// SchemeRouter.post(
//     "/apply/:schemeId",
//     authenticate.verifyUser,
//     (req, res, next) => {
//       Scheme.findByIdAndUpdate(
//         req.params.schemeId,
//         { $inc: { inProcess: 1 } },
//         { new: true }
//       ).then(res.redirect("/"));
//     }
//   );

module.exports = ApplyRouter;
