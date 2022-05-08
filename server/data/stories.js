const { stories, users } = require("../config/mongoCollections");
const uuid = require("uuid");
const { convert } = require("html-to-text");
const axios = require("axios").default;
const AppSearchClient = require("@elastic/app-search-node");

const apiKey = process.env.ELASTICSEARCH_API_KEY;
const baseUrlFn = () => "http://localhost:3002/api/as/v1/";
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

const createStory = async (creatorId, title, shortDescription, contentHtml, genres, filePath) => {
  let story = {
    _id: uuid.v4(),
    creatorId,
    title,
    shortDescription,
    contentText: convert(contentHtml, { wordwrap: 130 }),
    contentHtml,
    genres,
    coverImage: filePath,
    likedBy: [],
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
    const indexedData = await client.indexDocument("fable-search-engine", {
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

const getAllStories = async () => {
  const storiesCollection = await stories();
  const allStories = await storiesCollection.find({}).toArray();
  let result = { success: true, allStories };
  return result;
};

const getStoryById = async (storyId) => {
  const storiesCollection = await stories();
  const usersCollection = await users();
  const story = await storiesCollection.findOne({ _id: storyId });
  const creator = await usersCollection.findOne({ _id: story.creatorId });
  return {
    story,
    creator: creator,
  };
};

const searchStory = async (searchTerm) => {
  let searchResults = [];
  try {
    searchResults = await client.search("fable-search-engine", searchTerm);
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

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  searchStory,
  toggleLike,
};
