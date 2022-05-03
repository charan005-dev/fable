const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase-admin/app");
const stories = require("../data/stories");

const firebaseApp = initializeApp();

router.get("/all", async (req, res) => {
  try {
    let currentUser = req.body.userId;
    if (!currentUser) {
      res.status(403).json({ success: false, message: "You must be logged in to perform this action." });
      return;
    }
    const { success, allStories } = await stories.getAllStories();
    if (success) {
      res.status(200).json({ success, stories: allStories });
      return;
    }
    // db function throws in case of errors
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong." });
  }
});

module.exports = router;
