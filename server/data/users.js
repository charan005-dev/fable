const { users } = require("../config/mongoCollections");

const createUser = async (userId, emailAddress, displayName) => {
  const usersCollection = await users();
  const findUser = await usersCollection.findOne({ _id: userId });
  if (findUser) {
    throw `User already exists with given displayName / id.`;
  }
  let user = {
    _id: userId,
    emailAddress,
    displayName,
    storiesPosted: [],
  };
  const insertUser = await usersCollection.insertOne(user);
  if (insertUser.insertedCount === 0) throw `Couldn't insert user to database`;
  return await usersCollection.findOne({ _id: insertUser.insertedId });
};

module.exports = {
  createUser,
};
