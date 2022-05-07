const { stories, users } = require("../config/mongoCollections");
const uuid = require("uuid");
const { convert } = require("html-to-text");

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
  const storiesCollection = await stories();
  await storiesCollection.insertOne(story);
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

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
};
