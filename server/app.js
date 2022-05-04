const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(__dirname + "/public");
app.use("/public", express.static(__dirname + "/public/"));

app.use("/", (req, res, next) => {
  console.log("Into the app!" + req.originalUrl);
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

routes(app);

app.listen(4000, () => {
  console.log("Server started at port 4000!");
});
