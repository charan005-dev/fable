const path = require("path");
const uuid = require("uuid");
var isValid = require("is-valid-path");
const { validGenres } = require("../genres");
const _ = require("lodash");

const validateUuid = (id) => {
  console.log(id, uuid.validate(id));
  if (!uuid.validate(id)) throw `Invalid id parameter provided.`;
};

const validateSearchQ = (str) => {
  if (!str || typeof str !== "string" || str.length === 0 || str.trim().length === 0) {
    throw `Invalid string parameter provided.`;
  }
};

const validateUserId = (uid) => {
  if (!uid || typeof uid !== "string" || uid.length === 0 || uid.trim().length === 0) {
    throw `Invalid uid in request for user.`;
  }
};

const validateDisplayName = (dname) => {
  if (
    !dname ||
    typeof dname !== "string" ||
    dname.length === 0 ||
    dname.trim().length === 0 ||
    dname.length < 6 ||
    dname.length > 30
  ) {
    // return { isValid: false, error: "Your display name should not be less than 6 or more than 30 characters long." };
    throw `Your display name should not be less than 6 or more than 30 characters long.`;
  }
};

const validateWpm = (wpm) => {
  if (!wpm) {
    return { isValid: false, message: "WPM is a mandatory field." };
  }
  wpm = parseInt(wpm);
  if (isNaN(wpm)) return { isValid: false, message: "WPM is a mandatory field and should be a number." };
  if (wpm < 30 || wpm > 500)
    return {
      isValid: false,
      message: "WPM is a mandatory field and should be a number not less than 30 and not greater than 500.",
    };
  return { isValid: true };
};

const validateFilePath = (filePath) => {
  if (!filePath) {
    // this is allowed
    return;
  }
  // if filePath is provided, it should be valid
  if (!isValid(filePath)) {
    throw `Given file path is invalid.`;
  }
};

const validatePaginationParams = (skip, take) => {
  // handle cases where skip and take are not provided
  if (!skip || !take) {
    return;
  }
  skip = parseInt(skip);
  take = parseInt(take);
  if (isNaN(skip) || isNaN(take)) throw `Pagination params (skip & take) must be numbers.`;
  if (skip < 0 || take < 0) throw `Pagination params (skip & take) must be positive numbers.`;
};

const validateRequired = (required) => {
  required = parseInt(required);
  if (!required || isNaN(required)) throw `Invalid parameter for required. Expecting a number.`;
  if (required <= 0 || required > 30) throw `Required parameter should be positive and must not exceed 30`;
};

const validateGenres = (genres) => {
  if (!genres || !Array.isArray(genres)) throw `genres is not an array.`;
  let diff = _.difference(validGenres, genres);
  if (diff.length !== 0) throw `Invalid values [ ${diff} ] in request. Expected:[ ${validGenres} ]`;
};

const validateHot = (hot) => {
  if (!hot || typeof hot !== "string" || hot.length === 0 || hot.trim().length === 0) {
    throw `Invalid parameter for hot.`;
  }
  if (hot !== "true" && hot !== "false") {
    throw `Invalid parameter for hot.`;
  }
};

const validateExact = (exact) => {
  if (!exact || typeof exact !== "string" || exact.length === 0 || exact.trim().length === 0) {
    throw `Invalid parameter for hot.`;
  }
  if (exact !== "true" && exact !== "false") {
    throw `Invalid parameter for hot.`;
  }
};

const validateStoryTitle = (title) => {
  if (
    !title ||
    typeof title !== "string" ||
    title.length === 0 ||
    title.trim().length === 0 ||
    title.length < 6 ||
    title.length > 30
  )
    throw `Your title value is invalid or contains more/less than the expected amount of characters.`;
};

const validateStoryDesc = (desc) => {
  if (
    !desc ||
    typeof desc !== "string" ||
    desc.length === 0 ||
    desc.trim().length === 0 ||
    desc.length < 30 ||
    desc.length > 5000
  )
    throw `Your description is invalid or contains more/less than the expected amount of characters.`;
};

const validateStoryContent = (content) => {
  if (
    !content ||
    typeof content !== "string" ||
    content.length === 0 ||
    content.trim().length === 0 ||
    content.length < 200 ||
    content.length > 1000000
  )
    throw `Your story content is invalid or contains more/less than the expected amount of characters.`;
};

const validateComment = (comment) => {
  if (
    !comment ||
    typeof comment !== "string" ||
    comment.length === 0 ||
    comment.trim().length === 0 ||
    comment.length < 6 ||
    comment.length > 250
  )
    throw `Your comment text is invalid. Enter less than 250 characters and more than 6 characters.`;
};

const validateLibraryName = (lname) => {
  if (!lname || typeof lname !== "string" || lname.trim().length === 0) {
    throw `Please make sure that you enter a valid library name(only characters)`;
  }
};

module.exports = {
  validateUuid,
  validateDisplayName,
  validateWpm,
  validateUserId,
  validateFilePath,
  validatePaginationParams,
  validateRequired,
  validateHot,
  validateExact,
  validateGenres,
  validateStoryContent,
  validateStoryDesc,
  validateStoryTitle,
  validateSearchQ,
  validateComment,
  validateLibraryName,
};
