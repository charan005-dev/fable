const { stories, users, libraries } = require("../config/mongoCollections");
const uuid = require("uuid");
const axios = require("axios").default;

const createLibrary = async (userId, libraryName, private) => {
  const librariesCollection = await libraries();
  const existingLibraryName = await librariesCollection.findOne({
    libraryName: { $regex: new RegExp("^" + libraryName + "$", "i") },
    owner: userId,
  });
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

const addStoryToUserLibrary = async (userId, storyId, libraryId) => {
  const usersCollection = await users();
  const storiesCollection = await stories();
  const librariesCollection = await libraries();
  const owner = await usersCollection.findOne({ _id: userId });
  if (!owner) throw `No such user exists.`;
  const story = await storiesCollection.findOne({ _id: storyId });
  if (!story) throw `No such story exists.`;
  const library = await librariesCollection.findOne({ owner: userId, _id: libraryId });
  if (!library) throw `Either the library doesn't exist or the user does not have permission to access this library`;
  await librariesCollection.updateOne({ _id: libraryId, owner: userId }, { $addToSet: { stories: storyId } });
  return { success: true, library: await librariesCollection.findOne({ _id: libraryId, owner: userId }) };
};

const getAllMyLibraries = async (owner) => {
  const usersCollection = await users();
  const librariesCollection = await libraries();
  const allLibraries = await librariesCollection.find({ owner }).toArray();
  return allLibraries;
};

const getAllMyLibraryStories = async (userId, libraryId) => {
  const usersCollection = await users();
  const librariesCollection = await libraries();
  const storiesCollection = await stories();
  const owner = await usersCollection.findOne({ _id: userId });
  if (!owner) throw `No such user exists.`;
  let libraryStories = await librariesCollection.findOne({ _id: libraryId });
  let allLibStory = [];
  for (const libStories of libraryStories.stories) {
    allLibStory.push(await storiesCollection.findOne({ _id: libStories }));
  }
  libraryStories.stories = allLibStory;
  return libraryStories;
};

const getMyNonAddedLibraries = async (owner, storyId) => {
  const librariesCollection = await libraries();
  const allNonAddedLibs = await librariesCollection.find({ owner, stories: { $nin: [storyId] } }).toArray();
  console.log("NonAdded", allNonAddedLibs);
  return allNonAddedLibs;
};

const getMyPrivateLibraries = async (accessor, skip = 0, take = 20) => {
  const librariesCollection = await libraries();
  const privateLibraries = await librariesCollection
    .find({ owner: accessor, private: true })
    .skip(skip)
    .limit(take)
    .toArray();
  return { success: true, privateLibraries: privateLibraries };
};

module.exports = {
  createLibrary,
  addStoryToUserLibrary,
  getAllMyLibraries,
  getAllMyLibraryStories,
  getMyNonAddedLibraries,
  getMyPrivateLibraries,
};
