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
    let owner = req.authenticatedUser;
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

router.get("/me/private", async (req, res) => {
  try {
    let accessor = req.authenticatedUser;
    let { skip, take } = req.query;
    if (skip) skip = parseInt(skip);
    if (take) take = parseInt(take);
    const { success, privateLibraries } = await libraries.getMyPrivateLibraries(accessor, skip, take);
    console.log(privateLibraries);
    res.status(200).json({ success, libraries: privateLibraries });
    return;
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
    try {
      let allLibraryStories = await libraries.getAllMyLibraryStories(owner, library);
      res.status(200).json({ success: true, libraries: allLibraryStories });
      return;
    } catch (e) {
      console.log(e);
      res.status(404).json({ success: false, error: e });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong" });
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

router.put("/:libraryId", async (req, res) => {
  try {
    let { libraryId } = req.params;
    let accessor = req.authenticatedUser;
    let { libraryName, private } = req.body;
    try {
      const updatedLibrary = await libraries.updateLibrary(accessor, libraryId, libraryName, private);
      res.status(200).json(updatedLibrary);
      return;
    } catch (e) {
      console.log(e);
      if (e.toString().includes("library does not exist")) res.status(404).json({ success: false, error: e });
      else res.status(400).json({ success: false, error: e });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.delete("/:libraryId", async (req, res) => {
  try {
    let { libraryId } = req.params;
    let accessor = req.authenticatedUser;
    try {
      // will return all user libraries after deletion
      const deletedResult = await libraries.deleteLibrary(accessor, libraryId);
      res.status(200).json({ success: true, libraries: deletedResult.libraries });
      return;
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

module.exports = router;
