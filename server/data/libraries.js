const { stories, users, libraries } = require("../config/mongoCollections");
const uuid = require("uuid");
const axios = require("axios").default;

const createLibrary = async (userId, libraryName, private) => {
  const librariesCollection = await libraries();
  const existingLibraryName = await librariesCollection.findOne({ libraryName, owner: userId });
  if (existingLibraryName) throw `You already have a library with the same name. Please choose some other name.`;
  let newLibrary = {
    _id: uuid.v4(),
    owner: userId,
    libraryName,
    private,
    stories: [],
  };
  const { insertedId } = await librariesCollection.insertOne(newLibrary);
  return { success: true, library: await librariesCollection.findOne({ _id: insertedId }) };
};

const addStoryToUserLibrary = async (userId, storyId, libraryId, private) => {
  const usersCollection = await users();
  const storiesCollection = await stories();
  const librariesCollection = await libraries();
};

const getAllMyLibraries = async (owner) => {
  const usersCollection = await users();
  const librariesCollection = await libraries();
  const allLibraries = await librariesCollection.find({ owner }).toArray();
  return allLibraries;
};

module.exports = {
  createLibrary,
  addStoryToUserLibrary,
  getAllMyLibraries,
};
