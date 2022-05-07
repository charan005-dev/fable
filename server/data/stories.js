const { stories } = require("../config/mongoCollections");
const uuid = require("uuid");
const { convert } = require("html-to-text");
const axios = require("axios").default;
const AppSearchClient = require("@elastic/app-search-node");

// console.log(process.env);
const apiKey = process.env.ELASTICSEARCH_API_KEY;
const baseUrlFn = () => "http://localhost:3002/api/as/v1/";
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

const DOCUMENT_INDEX_URL = "http://localhost:3002/api/as/v1/engines/fable-search-engine/documents";

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
  // let indexed = await client.index({
  //   index: "fable-stories",
  //   document: {
  //     title: title,
  //     content: story.contentText,
  //   },
  // });
  // console.log(indexed);
  const { data } = await axios.post(
    DOCUMENT_INDEX_URL,
    {
      id: story._id,
      content: story.contentText,
      title: story.title,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
    }
  );
  console.log(data);
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
  const story = await storiesCollection.findOne({ _id: storyId });
  return story;
};

const searchStory = async (searchTerm) => {
  const searchResults = await client.search("fable-search-engine", searchTerm);
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

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  searchStory,
};
