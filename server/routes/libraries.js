const express = require("express");
const router = express.Router();
const libraries = require("../data/libraries");
const path = require("path");

router.post("/", async (req, res) => {
  try {
    let creatorId = req.body.userId;
    let libraryName = req.body.libraryName;
    let private = req.body.private;
    if (!creatorId) {
      res.status(401).json({ success: false, error: "You must be logged in to perform this action." });
      return;
    }
    const createdLibrary = await libraries.createLibrary(creatorId, libraryName, private);
    res.status(200).json({ success: true, library: createdLibrary.library });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong. " });
  }
});

router.get("/me", async (req, res) => {
  try {
    let owner = req.query.owner;
    if (!owner) {
      res.status(401).json({ success: false, error: "You must be logged in to perform this action." });
      return;
    }
    let allMyLibraries = await libraries.getAllMyLibraries(owner);
    res.status(200).json({ success: true, libraries: allMyLibraries });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong. " });
  }
});

module.exports = router;
