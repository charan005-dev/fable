const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./firebase_service_account.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE,
});

module.exports = {
  firebaseApp: firebaseAdmin,
};
