const express = require("express");
const Scheme = require("../models/Scheme");
const bodyParser = require("body-parser");
const SchemeRouter = express.Router();
const authenticate = require("../authenticate");
SchemeRouter.use(bodyParser.json());

SchemeRouter.route("/")
  .get((req, res, next) => {
    Scheme.find({})
      .then(
        (scheme) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(scheme);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Scheme.create(req.body)
      .then(
        (scheme) => {
          console.log("Scheme Created ", scheme);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(scheme);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /schemes");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on /schemes");
  });

// for admin to get all schemes he/she created
SchemeRouter.get(
  "/my",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Scheme.find({ author: req.user._id })
      .then(
        (schemes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(schemes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

SchemeRouter.route("/:schemeId")
  .get((req, res, next) => {
    Scheme.find({ _id: req.params.schemeId })
      .then(
        (scheme) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(scheme);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /schemes/:schemeId");
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Scheme.findByIdAndUpdate(
      req.params.schemeId,
      { $set: req.body },
      { new: true }
    )
      .then(
        (scheme) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(scheme);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Scheme.findByIdAndRemove(req.params.schemeId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = SchemeRouter;
