const path = require("path");
const uuid = require("uuid");
var isValid = require("is-valid-path");

const validateUuid = (id) => {
  if (!uuid.validate(id)) throw `Invalid id parameter provided.`;
};

const validateString = (strings) => {
  for (const str of strings) {
    if (!str || typeof str !== "string" || str.length === 0 || str.trim().length === 0) {
      return false;
    }
  }
  return true;
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
  if (!skip) throw `Pagination params (skip) is not provided.`;
  if (!take) throw `Pagination params (take) is not provided.`;
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

const validateGenres = () => {};

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
};
