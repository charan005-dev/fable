const { stories } = require("../config/mongoCollections");
const uuid = require("uuid");
const { convert } = require("html-to-text");

const createStory = async (creatorId, title, shortDescription, contentHtml, genres) => {
  let story = {
    _id: uuid.v4(),
    creatorId,
    title,
    shortDescription,
    contentText: convert(contentHtml, { wordwrap: 130 }),
    contentHtml,
    genres,
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

module.exports = {
  createStory,
  getAllStories,
};
