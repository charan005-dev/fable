const { stories, users } = require("../config/mongoCollections");
const uuid = require("uuid");
const { convert } = require("html-to-text");
const axios = require("axios").default;
const AppSearchClient = require("@elastic/app-search-node");

const apiKey = process.env.ELASTICSEARCH_API_KEY;
const baseUrlFn = () => "http://localhost:3002/api/as/v1/";
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);
const elasticEngineName = process.env.ELASTICSEARCH_ENGINE_NAME;

const createStory = async (creatorId, title, shortDescription, contentHtml, genres, filePath) => {
  const validGenres = [
    "Horror",
    "Romance",
    "Mystery",
    "Thriller",
    "Sci-fi",
    "Crime",
    "Drama",
    "Fantasy",
    "Adventure",
    "Comedy",
    "Tragedy",
    "Adult",
  ];
  genres = genres.length > 0 ? genres.split(",") : [];
  for (const genre of genres) {
    if (!validGenres.includes(genre))
      throw `Invalid genre ${genre} in request. Accepted genre values are [ ${validGenres} ]`;
  }
  let story = {
    _id: uuid.v4(),
    creatorId,
    title,
    shortDescription,
    contentText: convert(contentHtml, { wordwrap: 130 }),
    contentHtml,
    genres: genres,
    coverImage: filePath,
    likedBy: [],
    visitedBy: [],
    comments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  console.log(story);
  const storiesCollection = await stories();
  await storiesCollection.insertOne(story);
  try {
    let tokenizedKeywords = story.contentText.split(" ").map((word) => {
      if (word.length > 3) return word;
    });
    await client.indexDocument(elasticEngineName, {
      id: story._id,
      content: tokenizedKeywords.join(" "),
      title: story.title,
    });
  } catch (e) {
    // errors in pushing to elastic search could be caught here. logging them for reference
    console.log(e);
  }
  let result = { success: true, createdStory: story };
  return result;
};

const updateStory = async (storyId, owner, title, shortDescription, contentHtml, genres, coverImage) => {
  const validGenres = [
    "Horror",
    "Romance",
    "Mystery",
    "Thriller",
    "Sci-fi",
    "Crime",
    "Drama",
    "Fantasy",
    "Adventure",
    "Comedy",
    "Tragedy",
    "Adult",
  ];
  genres = genres.length > 0 ? genres.split(",") : [];
  for (const genre of genres) {
    if (!validGenres.includes(genre))
      throw `Invalid genre ${genre} in request. Accepted genre values are [ ${validGenres} ]`;
  }
  const storiesCollection = await stories();
  const findUpdatable = await storiesCollection.findOne({ _id: storyId, creatorId: owner });
  if (!findUpdatable) throw `Either the story does not exist or you do not have permission to perform this action.`;
  let updatedStory = {
    title,
    shortDescription,
    contentText: convert(contentHtml, { wordwrap: 130 }),
    contentHtml,
    genres,
    coverImage,
    updatedAt: Date.now(),
  };
  await storiesCollection.updateOne({ _id: storyId, creatorId: owner }, { $set: updatedStory });
  try {
    let tokenizedKeywords = updatedStory.contentText.split(" ").map((word) => {
      if (word.length > 3) return word;
    });
    await client.updateDocuments(elasticEngineName, [
      {
        id: findUpdatable._id,
        content: tokenizedKeywords.join(" "),
        title: updatedStory.title,
      },
    ]);
  } catch (e) {
    // errors in pushing to elastic search could be caught here. logging them for reference
    console.log(e);
  }
  return { success: true, updatedStory: await storiesCollection.findOne({ _id: storyId, creatorId: owner }) };
};

const getAllStories = async () => {
  const storiesCollection = await stories();
  const allStories = await storiesCollection.find({}).toArray();
  let result = { success: true, allStories };
  return result;
};

const getStoryById = async (storyId, accessor) => {
  const storiesCollection = await stories();
  const usersCollection = await users();
  console.log(accessor);
  const story = await storiesCollection.findOne({ _id: storyId });
  const creator = await usersCollection.findOne({ _id: story.creatorId });
  // recording user visits
  await storiesCollection.updateOne({ _id: storyId }, { $addToSet: { visitedBy: accessor } });
  return {
    story,
    creator: creator,
  };
};

const searchStory = async (searchTerm) => {
  let searchResults = [];
  try {
    searchResults = await client.search(elasticEngineName, searchTerm);
  } catch (e) {
    // logging errors in elasticsearch retrieval.
    console.log(e);
  }
  let results = [];
  searchResults.results.forEach((result) => {
    let newObj = {};
    for (let obj in result) {
      if (obj === "_meta") {
        newObj[obj] = result[obj];
        continue;
      }
      newObj[obj] = result[obj]["raw"];
    }
    results.push(newObj);
  });
  return results;
};

const toggleLike = async (storyId, userId) => {
  const storiesCollection = await stories();
  const usersCollection = await users();
  const findStory = await storiesCollection.findOne({ _id: storyId });
  if (!findStory) throw `No story found with the given id.`;
  const findUser = await usersCollection.findOne({ _id: userId });
  if (!findUser) throw `No user found with the given id.`;
  if (findStory.likedBy.includes(userId)) {
    await storiesCollection.updateOne({ _id: storyId }, { $pull: { likedBy: userId } });
  } else {
    await storiesCollection.updateOne({ _id: storyId }, { $addToSet: { likedBy: userId } });
  }
  return {
    success: true,
    story: await storiesCollection.findOne({ _id: storyId }),
  };
};

const getNRandom = async (n) => {
  const storiesCollection = await stories();
  let nRandom = await storiesCollection.aggregate([{ $match: {} }, { $sample: { size: n } }]).toArray();
  return { randomStories: nRandom };
};

const getUserStoriesByGenres = async (genres, authorId) => {
  const storiesCollection = await stories();
  console.log(genres);
  let myStories = await storiesCollection
    .find({ creatorId: authorId, genres: { $size: genres.length, $all: genres } })
    .toArray();
  console.log(myStories);
  return { selectStories: myStories, success: true };
};

const getUserStoriesByGenresNonExact = async (genres, authorId) => {
  const storiesCollection = await stories();
  console.log(genres);
  let myStories = await storiesCollection.find({ creatorId: authorId, genres: { $all: genres } }).toArray();
  return { selectStories: myStories, success: true };
};

const getRecommendations = async (userId, genres) => {
  const storiesCollection = await stories();
  genres = genres.length > 0 ? genres.split(",") : [];
  console.log(genres);
  let recommendations = await storiesCollection
    .aggregate([{ $match: { visitedBy: { $nin: [userId] }, genres: { $in: genres } } }, { $sample: { size: 5 } }])
    .toArray();
  // if recommendations are empty, we simply send in some random 5 stories
  if (recommendations.length === 0) {
    console.log("Recommendations are empty");
    recommendations = await storiesCollection
      .aggregate([{ $match: { genres: { $in: genres } } }, { $sample: { size: 5 } }])
      .toArray();
  }
  return { success: true, recommendations };
};

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  searchStory,
  toggleLike,
  getNRandom,
  getUserStoriesByGenres,
  getUserStoriesByGenresNonExact,
  getRecommendations,
  updateStory,
};
