const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase-admin/app");
const stories = require("../data/stories");
const multer = require("multer");
const path = require("path");
const xss = require("xss");
const gm = require("gm");
const {
  validateRequired,
  validateHot,
  validateUuid,
  validateUserId,
  validateExact,
  validatePaginationParams,
  validateStoryContent,
  validateStoryTitle,
  validateStoryDesc,
  validateSearchQ,
  validateComment,
  validateGenres,
} = require("../helpers/validator");

let basePath = process.env.GM_FS_COVER_PATH;

const resizeImage = (gmPath) => {
  return new Promise((resolve, reject) => {
    gm(gmPath)
      .resize(3200, 4800, "!")
      .write(gmPath, function (err) {
        if (err) reject(err);
        resolve("Resizing Complete!");
      });
  });
};

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
const { validGenres } = require("../genres").validGenres;
// const validGenres = [
//   "Horror",
//   "Romance",
//   "Mystery",
//   "Thriller",
//   "Sci-fi",
//   "Crime",
//   "Drama",
//   "Fantasy",
//   "Adventure",
//   "Comedy",
//   "Tragedy",
//   "Adult",
// ];

router.get("/all", async (req, res) => {
  try {
    let { required, genres, hot } = req.query;
    if (!required) required = 12;
    if (genres && genres.length > 0) genres = genres.split(",");
    else genres = [];
    try {
      validateRequired(required);
      validateGenres(genres);
      // validateHot(hot);
    } catch (e) {
      res.status(200).json({ success: false, message: e });
      return;
    }
    if (hot) {
      hot = hot === "true";
      // don't filter by genres for hot stories - but apply sorting
      try {
        const { success, allStories } = await stories.getAllHotStories(required);
        if (success) {
          res.status(200).json({ success, stories: allStories });
          return;
        }
      } catch (e) {
        res.status(400).json({ success: false, message: e });
        return;
      }
    } else {
      try {
        const { success, allStories } = await stories.getAllStories(required, genres);
        if (success) {
          res.status(200).json({ success, stories: allStories });
          return;
        }
      } catch (e) {
        res.status(400).json({ success: false, message: e });
        return;
      }
    }
    // db function throws in case of errors
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong." });
  }
});

router.get("/:storyId/hit", async (req, res) => {
  try {
    let { storyId } = req.params;
    let accessor = req.authenticatedUser;
    try {
      validateUuid(storyId);
      validateUserId(accessor);
    } catch (e) {
      res.status(200).json({ success: false, message: e });
      return;
    }
    try {
      await stories.recordUserVisit(xss(accessor), xss(storyId));
      res.status(200).json({ success: true });
      return;
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: e });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong." });
  }
});

router.get("/me", async (req, res) => {
  try {
    let selectedGenres = req.query.genres;
    let authorId = req.query.authorId;
    let exact = req.query.exact === "true";
    try {
      validateUserId(authorId);
      // validateExact(exact);
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        error: e,
      });
      return;
    }
    console.log(authorId, req.authenticatedUser);
    if (!authorId || authorId !== req.authenticatedUser) {
      res.status(403).json({
        success: false,
        error: "You don't have permission to access this resource.",
      });
      return;
    }
    selectedGenres = selectedGenres.length > 0 ? selectedGenres.split(",") : [];
    // validateGenres(selectedGenres)
    if (exact) {
      const { selectStories } = await stories.getUserStoriesByGenres(selectedGenres, xss(authorId));
      res.status(200).json({ success: true, stories: selectStories });
      return;
    } else {
      const { selectStories } = await stories.getUserStoriesByGenresNonExact(selectedGenres, xss(authorId));
      res.status(200).json({ success: true, stories: selectStories });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong." });
  }
});

router.get("/filter", async (req, res) => {
  try {
    let selectedGenres = req.query.genres;
    // try {
    //   validateExact(req.query.exact);
    // } catch (e) {
    //   console.log(e);
    //   res.status(400).json({
    //     success: false,
    //     error: e,
    //   });
    //   return;
    // }
    let exact = req.query.exact === "true";
    selectedGenres = selectedGenres.length > 0 ? selectedGenres.split(",") : [];
    if (exact) {
      const { selectStories } = await stories.getALLStoriesByGenres(selectedGenres);
      res.status(200).json({ success: true, stories: selectStories });
      return;
    } else {
      const { selectStories } = await stories.getAllStoriesByGenresNonExact(selectedGenres);
      res.status(200).json({ success: true, stories: selectStories });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ messsage: "Sorry, something went wrong." });
  }
});

router.get("/all/me", async (req, res) => {
  try {
    let accessor = req.authenticatedUser;
    let { skip, take } = req.query;
    if (skip) skip = parseInt(skip);
    if (take) take = parseInt(take);
    try {
      validateUserId(accessor);
      validatePaginationParams(skip, take);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: e });
      return;
    }
    const storiesData = await stories.getMyStories(xss(accessor), skip, take);
    if (storiesData.success) {
      res.status(200).json({ success: true, stories: storiesData.stories, next: storiesData.next });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
    return;
  }
});

router.get("/all_stories", async (req, res) => {
  try {
    let { skip, take } = req.query;
    if (skip) skip = parseInt(skip);
    if (take) take = parseInt(take);
    try {
      validatePaginationParams(skip, take);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: e });
      return;
    }
    const allStoriesData = await stories.getAllPaginatedStories(skip, take);
    if (allStoriesData.success) {
      res.status(200).json({ success: true, stories: allStoriesData.stories, next: allStoriesData.next });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
    return;
  }
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.file.path);
    const currentUser = req.body.creatorId;
    if (!currentUser || currentUser !== req.authenticatedUser) {
      res.status(403).json({
        success: false,
        error: "You don't have permission to access this resource.",
      });
      return;
    }
    const { title, shortDescription, contentHtml, genres } = req.body;
    // validate incoming parameters
    try {
      validateStoryTitle(title);
      validateStoryDesc(shortDescription);
      validateStoryContent(contentHtml);
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e,
        message: e,
      });
      return;
    }
    let filePath = null;
    let gmPath = null;
    if (req.file) {
      gmPath = path.resolve(basePath + req.file.filename);
      filePath = "/public/covers/" + req.file.filename;
    }
    // graphicsmagick resize
    try {
      if (gmPath) await resizeImage(gmPath);
    } catch (e) {
      console.log(e);
    }
    const { success, story } = await stories.createStory(
      currentUser,
      xss(title),
      xss(shortDescription),
      xss(contentHtml),
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

// will receive a query string param that specifies the list of items needed (0 <= required <= 20)
router.get("/random", async (req, res) => {
  try {
    let required = parseInt(req.query.required);
    if (isNaN(required) || required <= 0 || required > 20) {
      res.status(400).json({
        success: false,
        error: "The required parameter should only be a number, greater than 0 and less than 20",
      });
      return;
    }
    const { randomStories } = await stories.getNRandom(required);
    res.status(200).json({ success: true, randomStories: randomStories });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.get("/recommendations", async (req, res) => {
  try {
    // let userIdTest = req.query.testUser;
    let genres = req.query.genres;
    let userId = req.authenticatedUser;
    if (!userId) {
      res.status(401).json({ success: false, message: "You'd have to be logged in to perform this action." });
      return;
    }
    try {
      validateUserId(userId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    const { recommendations } = await stories.getRecommendations(xss(userId), genres);
    res.status(200).json({ success: true, recommendations });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let storyId = req.params.id;
    let accessor = req.authenticatedUser;
    try {
      let story = await stories.getStoryById(xss(storyId), xss(accessor));
      res.status(200).json({ success: true, story: story.story, creator: story.creator });
      return;
    } catch (e) {
      console.log("Caufht here", e);
      res.status(404).json({ success: false, error: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

router.put("/:id", upload.single("coverImage"), async (req, res) => {
  try {
    let owner = req.authenticatedUser;
    let storyId = req.params.id;
    let { title, shortDescription, genres, contentHtml } = req.body;
    try {
      validateStoryTitle(title);
      validateStoryDesc(shortDescription);
      validateStoryContent(contentHtml);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e, message: e });
    }
    let filePath = null;
    let gmPath = null;
    if (req.file) {
      gmPath = path.resolve(basePath + req.file.filename);
      filePath = "/public/covers/" + req.file.filename;
    }
    // graphicsmagick resize only if gmPath is present
    try {
      if (gmPath) await resizeImage(gmPath);
    } catch (e) {
      console.log(e);
    }
    try {
      const { success, updatedStory } = await stories.updateStory(
        xss(storyId),
        xss(owner),
        xss(title),
        xss(shortDescription),
        xss(contentHtml),
        genres,
        filePath
      );
      if (success) {
        res.status(200).json({ success: true, updatedStory });
        return;
      }
    } catch (e) {
      // valid errors
      console.log(e);
      res.status(400).json({ success: false, error: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong. " });
  }
});

router.post("/search", async (req, res) => {
  try {
    let q = req.query.q;
    try {
      validateSearchQ(q);
    } catch (e) {
      res.status(400).json({ success: false, error: e, message: e });
      return;
    }
    if (!q) {
      res.status(200).json({ success: true, results: [] });
      return;
    }
    let results = await stories.searchStory(xss(q));
    res.status(200).json({ success: true, results });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    let userId = req.body.userId;
    let storyId = req.params.id;
    // this tells us that the logged in user is the one who is asking to be added to the like list
    // redundant - can be retrieved from req.authenticatedUser directly and not rely on the client
    if (req.authenticatedUser !== userId) {
      res.status(403).json({ success: false, message: "You don't have permission to access this resource." });
      return;
    }
    try {
      validateUserId(userId);
      validateUuid(storyId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    let afterLike = await stories.toggleLike(xss(storyId), xss(userId));
    if (afterLike.success) {
      res.status(200).json(afterLike);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.post("/:storyId/comment", async (req, res) => {
  try {
    let storyId = req.params.storyId;
    let commenter = req.authenticatedUser;
    let comment = req.body.comment;
    try {
      validateUuid(storyId);
      validateUserId(commenter);
      validateComment(comment);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    let { success, story } = await stories.addComment(xss(storyId), xss(commenter), xss(comment));
    res.status(200).json({ success, story });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.get("/:storyId/comments", async (req, res) => {
  try {
    let { storyId } = req.params;
    try {
      validateUuid(storyId);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    let existingComments = await stories.getCommentsFromStory(xss(storyId));
    res.status(200).json(existingComments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.delete("/:storyId", async (req, res) => {
  try {
    let accessor = req.authenticatedUser;
    let { storyId } = req.params;
    try {
      validateUuid(storyId);
      validateUserId(accessor);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }
    let { success } = await stories.deleteStory(xss(accessor), xss(storyId));
    if (success) {
      res.status(204).json({ success: true });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

module.exports = router;
