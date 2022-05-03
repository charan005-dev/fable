const users = require("./users");

const constructorMethod = (app) => {
  app.use("/api/users", users);
  app.use("*", async (req, res) => {
    console.log(req);
    return;
  });
};

module.exports = constructorMethod;
