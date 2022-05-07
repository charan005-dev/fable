const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase-admin/app");
const stories = require("../data/stories");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/covers/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({ storage: storage });

const firebaseApp = initializeApp();

router.get("/all", async (req, res) => {
  try {
    // let currentUser = req.body.userId;
    // if (!currentUser) {
    //   res.status(403).json({ success: false, message: "You must be logged in to perform this action." });
    //   return;
    // }
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

router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.file.path);
    const currentUser = req.body.creatorId;
    if (!currentUser) {
      res.status(403).json({ success: false, message: "You must be logged in to perform this action." });
      return;
    }
    const { title, shortDescription, contentHtml, genres } = req.body;
    // TODO validate incoming parameters
    let filePath = null;
    if (req.file) {
      filePath = "/public/covers/" + req.file.filename;
    }

    const { success, story } = await stories.createStory(
      currentUser,
      title,
      shortDescription,
      contentHtml,
      genres,
      filePath
    );
    if (success) {
      res.status(200).json({ success, story });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("getting a story");
    let storyId = req.params.id;
    let story = await stories.getStoryById(storyId);
    console.log(story);
    res.status(200).json({ success: true, story: story.story, creator: story.creator });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

router.post("/search", async (req, res) => {
  try {
    let q = req.query.q;
    if (!q) {
      res.status(200).json({ success: true, results: [] });
      return;
    }
    let results = await stories.searchStory(q);
    res.status(200).json({ success: true, results });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
