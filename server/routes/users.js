const express = require("express");
const router = express.Router();
const users = require("../data/users");
const multer = require("multer");
const path = require("path");
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

router.get("/check", async (req, res) => {
  try {
    let displayName = req.query.tentative;
    try {
      const { isAvailable } = await users.checkDisplayName(displayName);
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

router.put("/:userId", upload.single("userAvatar"), async (req, res) => {
  try {
    let userId = req.params.userId;
    let { displayName, wpm } = req.body;
    wpm = parseInt(wpm);
    let filePath = null;
    if (req.file) {
      filePath = "/public/userImages/" + req.file.filename;
    }
    if (isNaN(wpm) || wpm < 30 || wpm > 500) {
      res.status(400).json({ success: false, error: "Invalid wpm count. Should be more than 30 and less than 500." });
      return;
    }
    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided " });
      return;
    }
    const updatedUser = await users.updateUser(userId, displayName, wpm, filePath);
    res.status(200).json({ success: true, user: updatedUser });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

module.exports = router;
