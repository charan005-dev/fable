const usersData = require("./users.json");
const librariesData = require("./libraries.json");
const storiesData = require("./stories.json");
const users = require("../config/mongoCollections").users;
const libraries = require("../config/mongoCollections").libraries;
const stories = require("../config/mongoCollections").stories;
const uuid = require("uuid");

const createUsers = async () => {
  let usersCollection = await users();
  let bulk = usersCollection.initializeUnorderedBulkOp();
  for (const user of usersData) {
    bulk.insert(user);
  }
  bulk.execute();
};

const createStories = async () => {
  let storiesCollection = await stories();
  let bulk = storiesCollection.initializeUnorderedBulkOp();
  for (const story of storiesData) {
    story._id = uuid.v4();
    bulk.insert(story);
  }
  bulk.execute();
};

const createLibraries = async () => {
  let librariesCollection = await libraries();
  let bulk = librariesCollection.initializeUnorderedBulkOp();
  for (const lib of librariesData) {
    lib._id = uuid.v4();
    bulk.insert(lib);
  }
  bulk.execute();
};

createUsers();
createStories();
createLibraries();
