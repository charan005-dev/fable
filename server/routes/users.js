const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.post("/", async (req, res) => {
  try {
    console.log("here");
    let userId = req.body.userId;
    let emailAddress = req.body.emailAddress;
    let displayName = req.body.displayName;
    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided. " });
      return;
    }
    const createdUser = await users.createUser(userId, emailAddress, displayName);
    res.status(200).json({ success: true, createdUser });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong. " });
  }
});

router.get("/public_profile/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided. " });
      return;
    }
    const userProfile = await users.getPublicProfile(userId);
    res.status(200).json({ success: true, profile: userProfile });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong. " });
  }
});

module.exports = router;
