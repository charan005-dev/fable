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
    if (req.authenticatedUser !== creatorId) {
      res.status(403).json({ success: false, message: "You don't have permission to access this resource." });
      return;
    }
    try {
      const createdLibrary = await libraries.createLibrary(creatorId, libraryName, private);
      res.status(200).json({ success: true, library: createdLibrary.library });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong. " });
  }
});

router.get("/me", async (req, res) => {
  try {
    let owner = req.query.owner;
    let storyId = req.query.storyId;
    if (req.authenticatedUser !== owner) {
      res.status(401).json({ success: false, error: "You must be logged in to perform this action." });
      return;
    }
    // if storyId is not present - get the user's libraries alone
    if (!storyId) {
      let allMyLibraries = await libraries.getAllMyLibraries(owner);
      res.status(200).json({ success: true, libraries: allMyLibraries });
      return;
    }
    // if I provide storyId - get the user's libraries to which this story was not added to
    if (storyId) {
      console.log("Getting the user's libraries to which this story was not added to.");
      let allNonAddedLibs = await libraries.getMyNonAddedLibraries(owner, storyId);
      res.status(200).json({ success: true, libraries: allNonAddedLibs });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong. " });
  }
});

router.get("/library_stories/:libraryId", async (req, res) => {
  try {
    let owner = req.query.owner;
    // let storyId = req.query.storyId;
    let library = req.params.libraryId;
    let allLibraryStories = await libraries.getAllMyLibraryStories(owner, library);
    res.status(200).json({ success: true, libraries: allLibraryStories });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ succes: false, error: "Sorry, something went wrong" });
  }
});

router.post("/add", async (req, res) => {
  try {
    let owner = req.body.owner;
    let storyId = req.body.storyId;
    let libraryId = req.body.libraryId;
    if (req.authenticatedUser !== owner) {
      res.status(401).json({ success: false, message: "You must be logged in to perform this action." });
      return;
    }
    try {
      const addedToLib = await libraries.addStoryToUserLibrary(owner, storyId, libraryId);
      res.status(200).json({ success: true, library: addedToLib });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong. " });
  }
});

module.exports = router;
