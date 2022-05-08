const users = require("./users");
const stories = require("./stories");
const libraries = require("./libraries");

const constructorMethod = (app) => {
  app.use("/api/users", users);
  app.use("/api/stories", stories);
  app.use("/api/libraries", libraries);
  app.use("*", async (req, res) => {
    console.log("Catch-all route");
    return;
  });
};

module.exports = constructorMethod;
