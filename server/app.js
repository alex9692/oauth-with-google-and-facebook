const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("./utils/passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const errorController = require("./controller/error");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const oauthRoutes = require("./routes/oauth");

app.set("view engine", "ejs");
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/oauth", oauthRoutes);

app.use(errorController);

module.exports = app;
