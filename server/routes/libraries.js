const express = require("express");
const router = express.Router();
const libraries = require("../data/libraries");
const xss = require("xss");
const path = require("path");
const { validateUserId, validateLibraryName, validateUuid, validatePaginationParams } = require("../helpers/validator");
router.post("/", async (req, res) => {
  try {
    let creatorId = req.body.userId;
    let libraryName = req.body.libraryName;
    let private = req.body.private;
    try {
      validateUserId(creatorId);
      validateLibraryName(libraryName);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    if (!creatorId) {
      res.status(401).json({ success: false, error: "You must be logged in to perform this action." });
      return;
    }
    if (req.authenticatedUser !== creatorId) {
      res.status(403).json({ success: false, message: "You don't have permission to access this resource." });
      return;
    }
    try {
      const createdLibrary = await libraries.createLibrary(xss(creatorId), xss(libraryName), xss(private));
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
    try {
      validateUserId(owner);
      if (storyId) validateUuid(storyId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    if (req.authenticatedUser !== owner) {
      res.status(401).json({ success: false, error: "You must be logged in to perform this action." });
      return;
    }
    // if storyId is not present - get the user's libraries alone
    if (!storyId) {
      let allMyLibraries = await libraries.getAllMyLibraries(xss(owner));
      res.status(200).json({ success: true, libraries: allMyLibraries });
      return;
    }
    // if I provide storyId - get the user's libraries to which this story was not added to
    if (storyId) {
      console.log("Getting the user's libraries to which this story was not added to.");
      let allNonAddedLibs = await libraries.getMyNonAddedLibraries(xss(owner), xss(storyId));
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
    try {
      validateUserId(accessor);
      validatePaginationParams(skip, take);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    const { success, privateLibraries } = await libraries.getMyPrivateLibraries(xss(accessor), xss(skip), xss(take));
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
    let accessor = req.authenticatedUser;
    try {
      validateUserId(owner);
      validateUuid(library);
      validateUserId(accessor);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    try {
      let allLibraryStories = await libraries.getAllMyLibraryStories(xss(owner), xss(library), xss(accessor));
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

// return only userId's public libraries
router.get("/user/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    try {
      validateUserId(userId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    try {
      let publicLibraries = await libraries.getPublicLibrariesOfUser(xss(userId));
      res.status(200).json({ success: true, libraries: publicLibraries });
      return;
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
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
    try {
      validateUserId(owner);
      validateUuid(storyId);
      validateUuid(libraryId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    if (req.authenticatedUser !== owner) {
      res.status(401).json({ success: false, message: "You must be logged in to perform this action." });
      return;
    }
    try {
      const addedToLib = await libraries.addStoryToUserLibrary(xss(owner), xss(storyId), xss(libraryId));
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
      validateUserId(accessor);
      validateUuid(libraryId);
      validateLibraryName(libraryName);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    try {
      const updatedLibrary = await libraries.updateLibrary(
        xss(accessor),
        xss(libraryId),
        xss(libraryName),
        xss(private)
      );
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
      validateUserId(accessor);
      validateUuid(libraryId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    try {
      // will return all user libraries after deletion
      const deletedResult = await libraries.deleteLibrary(xss(accessor), xss(libraryId));
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

router.put("/:libraryId/removeStory", async (req, res) => {
  try {
    let { libraryId } = req.params;
    let accessor = req.authenticatedUser;
    let { storyId } = req.body;
    try {
      validateUserId(accessor);
      validateUuid(libraryId);
      validateUuid(storyId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    if (!storyId) {
      res.status(400).json({ success: false, message: "Story Id is mandatory in the params for performing removal." });
      return;
    }
    try {
      let afterRemoval = await libraries.removeStoryFromLibrary(xss(libraryId), xss(storyId), xss(accessor));
      res.status(200).json({ success: true, library: afterRemoval.library });
      return;
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

module.exports = router;
