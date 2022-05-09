require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");
const { firebaseApp } = require("./initFirebaseAdmin");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(__dirname + "/public");
app.use("/public", express.static(__dirname + "/public/"));

app.use("/", async (req, res, next) => {
  console.log(req.originalUrl, req.method);
  if (req.originalUrl === "/api/users" && req.method.toLowerCase() === "post") {
    console.log("User creation process. Skipping authentication check.");
    next();
    return;
  }
  const idToken = req.headers.authtoken;
  try {
    if (!idToken) {
      throw `No authtoken in incoming request. Cannot authenticate user.`;
    }
    let { uid, email, auth_time } = await firebaseApp.auth().verifyIdToken(idToken);
    console.info(`Authenticated user with email ${email}. Authenticated on: ${new Date(auth_time * 1000)}`);
    req["authenticatedUser"] = uid;
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, message: "You must be logged in to perform this action." });
    return;
  }
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
