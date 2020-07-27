const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../authenticate");
router.use(bodyParser.json());

router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({})
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.get(
  "/:id",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({ _id: req.params.id })
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.post("/signup", (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      name: req.body.name,
      lastName: req.body.lastName,
      state: req.body.state,
      caste: req.body.caste,
      age: req.body.age,
      aadhaarNumber: req.body.aadhaarNumber,
      moblieNumber: req.body.moblieNumber,
      income: req.body.income,
      gender: req.body.gender,
      orgName: req.body.orgName || undefined,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  if (req.user.admin)
    res.json({
      success: true,
      authorId: req.user._id,
      // username: req.user.username,
      token: token,
      status: "You are successfully logged in!",
    });
  else
    res.json({
      // username: req.user.username,
      success: true,
      token: token,
      id2: req.user._id,
      status: "You are successfully logged in!",
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
