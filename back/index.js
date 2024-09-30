var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config.json");

const Agentchauff = require("./routes/ChauffeurRoute");
const con = require("./routes/ContactRoute");
const Voi = require("./routes/VoitureRoutes");
const his = require("./routes/HistoRoute");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("DB Connection Estabblished !");
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
const corsOptions = {
  //origin:'https://frontwebpfe-ashen.vercel.app',
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/Chauff", Agentchauff);
app.use("/Voi", Voi);
app.use("/Con", con);
app.use("/hist", his);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

module.exports = app;
