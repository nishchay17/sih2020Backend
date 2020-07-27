const express = require("express");
const authenticate = require("../authenticate");
const Scheme = require("../models/Scheme");
const Applicatio = require("../models/Application");
const bodyParser = require("body-parser");
const { application } = require("express");
const ApplyRouter = express.Router();
ApplyRouter.use(bodyParser.json());

// to get all the schemes that a user could apply for
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

// for user to apply for a scheme of id => req.params._id
ApplyRouter.route("/:id").get(authenticate.verifyUser, (req, res, next) => {
  const schemeId = req.params.id;
  const userId = req.user._id;
  Scheme.findById({ _id: schemeId })
    .then((sch) => {
      const author = sch.author;
      Applicatio.create({ schemeId, userId, author })
        .then(
          (application) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(application);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// for admin, to get all applications for his schemes, and to update it
ApplyRouter.route("/review/:id") //it's user id
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const id = req.params.id;
    Applicatio.find({ author: id })
      .then(
        (applications) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(applications);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Applicatio.findByIdAndUpdate(
      req.params.id,
      { state: JSON.parse(req.body.state) },
      { new: true },
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    ).catch((err) => next(err));
  });

//return all applications of the user, id is id of user
ApplyRouter.route("/application/:id").get(
  authenticate.verifyUser,
  (req, res, next) => {
    Applicatio.find({ userId: req.params.id })
      .then(
        (applications) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(applications);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

//to get application by id, for admin
ApplyRouter.route("/reviewone/:applicationId").get(
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    const id = req.params.applicationId;
    Applicatio.findById(id, (err, application) => {
      if (err) next(err);
      else res.json(application);
    }).catch((err) => next(err));
  }
);

module.exports = ApplyRouter;
