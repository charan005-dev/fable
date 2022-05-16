const express = require("express");
const router = express.Router();
const users = require("../data/users");
const multer = require("multer");
const xss = require("xss");
const path = require("path");
const {
  validateDisplayName,
  validateUuid,
  validateUserId,
  validateWpm,
  validateFilePath,
  validatePaginationParams,
} = require("../helpers/validator");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages/"));
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + req.body.userId + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({ storage: storage });

router.post("/", async (req, res) => {
  try {
    let userId = req.body.userId;
    let emailAddress = req.body.emailAddress;
    let displayName = req.body.displayName;
    // validation blocks
    try {
      // don't validate user id against validator's validateUuid method. User Id is from Firebase
      // just validate it as a string
      validateUserId(userId);
      validateDisplayName(displayName);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
      return;
    }
    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided. " });
      return;
    }
    const createdUser = await users.createUser(xss(userId), xss(emailAddress), xss(displayName));
    res.status(200).json({ success: true, createdUser });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong. " });
  }
});

router.get("/check", async (req, res) => {
  try {
    let displayName = req.query.tentative;
    try {
      validateDisplayName(displayName);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
      return;
    }
    try {
      const { isAvailable } = await users.checkDisplayName(xss(displayName));
      if (isAvailable) {
        res.status(200).json({ success: true, isAvailable: true });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(409).json({ success: false, isAvailable: false, message: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong. " });
  }
});

router.get("/public_profile/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    try {
      validateUserId(userId);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
      return;
    }
    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided. " });
      return;
    }
    const userProfile = await users.getPublicProfile(xss(userId));
    res.status(200).json({ success: true, profile: userProfile });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong. " });
  }
});

router.put("/:userId", upload.single("userAvatar"), async (req, res) => {
  try {
    let userId = req.params.userId;
    let { displayName, wpm } = req.body;
    wpm = parseInt(wpm);
    let filePath = null;
    if (req.file) {
      filePath = "/public/userImages/" + req.file.filename;
    }
    try {
      validateUserId(userId);
      validateDisplayName(displayName);
      validateWpm(wpm);
      validateFilePath(filePath);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
      return;
    }
    if (isNaN(wpm) || wpm < 30 || wpm > 500) {
      res.status(400).json({ success: false, error: "Invalid wpm count. Should be more than 30 and less than 500." });
      return;
    }
    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided " });
      return;
    }
    const updatedUser = await users.updateUser(xss(userId), xss(displayName), xss(wpm), xss(filePath));
    res.status(200).json({ success: true, user: updatedUser });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.get("/:userId/stories", async (req, res) => {
  try {
    let { userId } = req.params;
    let { skip, take } = req.query;
    if (skip) skip = parseInt(skip);
    if (take) take = parseInt(take);
    try {
      validateUserId(userId);
      validatePaginationParams(skip, take);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
      return;
    }
    let userStories = await users.getStoriesOfUser(xss(userId), skip, take);

    res.status(200).json({ success: true, stories: userStories.stories, next: userStories.next });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

module.exports = router;
