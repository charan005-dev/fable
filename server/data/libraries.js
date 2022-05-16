const { stories, users, libraries } = require("../config/mongoCollections");
const uuid = require("uuid");
const { validateUserId, validateLibraryName, validatePaginationParams, validateUuid } = require("../helpers/validator");
const axios = require("axios").default;

const createLibrary = async (userId, libraryName, private) => {
  validateUserId(userId);
  validateLibraryName(libraryName);
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
  const existingLibraries = await librariesCollection.find({ owner: userId }).toArray();
  console.log(existingLibraries.length);
  if (existingLibraries.length >= 10)
    throw `You've already created the maximum amount of allowed libraries (10). Please delete an existing library and try recreating.`;
  const { insertedId } = await librariesCollection.insertOne(newLibrary);
  return { success: true, library: await librariesCollection.findOne({ _id: insertedId }) };
};

const addStoryToUserLibrary = async (userId, storyId, libraryId) => {
  validateUserId(userId);
  validateUuid(storyId);
  validateUuid(libraryId);
  const usersCollection = await users();
  const storiesCollection = await stories();
  const librariesCollection = await libraries();
  const owner = await usersCollection.findOne({ _id: userId });
  if (!owner) throw `No such user exists.`;
  const story = await storiesCollection.findOne({ _id: storyId });
  if (!story) throw `No such story exists.`;
  const library = await librariesCollection.findOne({ owner: userId, _id: libraryId });
  if (!library) throw `Either the library doesn't exist or the user does not have permission to access this library`;
  let existingStories = library.stories;
  if (existingStories.length >= 3) {
    throw `You've already added the maximum amount of stories to this library (10). Please remove an existing story and try adding a new one.`;
  }
  await librariesCollection.updateOne({ _id: libraryId, owner: userId }, { $addToSet: { stories: storyId } });
  return { success: true, library: await librariesCollection.findOne({ _id: libraryId, owner: userId }) };
};

const getAllMyLibraries = async (owner) => {
  validateUserId(owner);
  const usersCollection = await users();
  const librariesCollection = await libraries();
  const allLibraries = await librariesCollection.find({ owner }).toArray();
  return allLibraries;
};

const getAllMyLibraryStories = async (userId, libraryId, accessor) => {
  validateUserId(userId);
  validateUuid(libraryId);
  validateUserId(accessor);
  const usersCollection = await users();
  const librariesCollection = await libraries();
  const storiesCollection = await stories();
  const owner = await usersCollection.findOne({ _id: userId });
  if (!owner) throw `No such user exists.`;
  let libraryStories = await librariesCollection.findOne({ _id: libraryId });
  if (!libraryStories) throw `No such library exists.`;
  console.log(accessor, libraryStories);
  if (libraryStories.private && accessor !== libraryStories.owner) {
    throw `You don't have access to view this resource.`;
  }
  let allLibStory = [];
  for (const libStories of libraryStories.stories) {
    allLibStory.push(await storiesCollection.findOne({ _id: libStories }));
  }
  libraryStories.stories = allLibStory;
  console.log(libraryStories);
  return libraryStories;
};

const getMyNonAddedLibraries = async (owner, storyId) => {
  validateUserId(owner);
  validateUuid(storyId);
  const librariesCollection = await libraries();
  const allNonAddedLibs = await librariesCollection.find({ owner, stories: { $nin: [storyId] } }).toArray();
  console.log("NonAdded", allNonAddedLibs);
  return allNonAddedLibs;
};

const getMyPrivateLibraries = async (accessor, skip = 0, take = 20) => {
  validateUserId(accessor);
  validatePaginationParams(skip, take);
  const librariesCollection = await libraries();
  const privateLibraries = await librariesCollection
    .find({ owner: accessor, private: true })
    .skip(skip)
    .limit(take)
    .toArray();
  return { success: true, privateLibraries: privateLibraries };
};

const updateLibrary = async (accessor, libraryId, libraryName, private) => {
  validateUserId(accessor);
  validateUuid(libraryId);
  validateLibraryName(libraryName);
  const librariesCollection = await libraries();
  const findLibrary = await librariesCollection.findOne({ owner: accessor, _id: libraryId });
  if (!findLibrary) {
    throw `Either the library does not exist or the user does not have access to perform this action.`;
  }
  const existingName = await librariesCollection.findOne({
    owner: accessor,
    libraryName: { $regex: new RegExp("^" + libraryName + "$", "i") },
  });
  if (existingName && libraryId !== existingName._id) {
    throw `You already have a library with the same name. Please choose some other name instead.`;
  }
  let newLibrary = {
    libraryName,
    private,
  };
  const updatedLib = await librariesCollection.updateOne({ owner: accessor, _id: libraryId }, { $set: newLibrary });
  return {
    success: true,
    library: await librariesCollection.findOne({ owner: accessor, _id: libraryId }),
  };
};

const deleteLibrary = async (accessor, libraryId) => {
  validateUserId(accessor);
  validateUuid(libraryId);
  const librariesCollection = await libraries();
  const existingLibrary = await librariesCollection.findOne({ owner: accessor, _id: libraryId });
  if (!existingLibrary) {
    throw `Either the library does not exist or the user does not have access to perform this action.`;
  }
  await librariesCollection.deleteOne({ owner: accessor, _id: libraryId });
  return { success: true, libraries: await librariesCollection.find({ owner: accessor }).toArray() };
};

const getPublicLibrariesOfUser = async (userId) => {
  validateUserId(userId);
  const librariesCollection = await libraries();
  const allMyLibraries = await librariesCollection.find({ owner: userId, private: false }).toArray();
  return allMyLibraries;
};

const removeStoryFromLibrary = async (libraryId, storyId, owner) => {
  validateUuid(libraryId);
  validateUuid(storyId);
  validateUserId(owner);
  const librariesCollection = await libraries();
  const findLibrary = await librariesCollection.findOne({ owner, _id: libraryId });
  if (!findLibrary) {
    throw `Either the library does not exist or you don't have access to perform this action.`;
  }
  await librariesCollection.updateOne({ owner, _id: libraryId }, { $pull: { stories: storyId } });
  // after deletion we'll return the updated library
  return { success: true, library: await librariesCollection.findOne({ owner, _id: libraryId }) };
};

module.exports = {
  createLibrary,
  addStoryToUserLibrary,
  getAllMyLibraries,
  getAllMyLibraryStories,
  getMyNonAddedLibraries,
  getMyPrivateLibraries,
  updateLibrary,
  deleteLibrary,
  getPublicLibrariesOfUser,
  removeStoryFromLibrary,
};
