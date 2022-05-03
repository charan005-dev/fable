const express = require("express");
const router = express.Router();

const doLoginFilter = (userSessionId) => {
  if (!userSessionId) return false;
  return true;
};

router.get("/stories", async (req, res) => {
  try {
  } catch (e) {}
});
