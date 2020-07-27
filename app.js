const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const authenticate = require("./authenticate");
const config = require("./config");
const cors = require("cors");
//"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="D:\project\sih2\mongodb\data"
//router require
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const SchemeRouter = require("./routes/SchemeRouter");
const ApplyRouter = require("./routes/ApplyRouter");

//Mongo DB connection:-
const mongoose = require("mongoose");
const url = process.env.MONGODB_URL || "mongodb://localhost:27017/sih2";
const connect = mongoose.connect(url, { useFindAndModify: false });
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

//Express:-
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(
  session({
    name: "session-id",
    secret: config.secretKey,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/schemes", SchemeRouter);
app.use("/users", usersRouter);
app.use("/apply", ApplyRouter);

const auth = (req, res, next) => {
  if (!req.user) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    next(err);
  } else {
    next();
  }
};

app.use(auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
