const constructorMethod = (app) => {
  app.use("/");
  app.use("*", async (req, res) => {
    // TODO fill in incorrect route information
  });
};

module.exports = constructorMethod;
