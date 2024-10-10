const User = require("../models/User");
const { generateKeyPair } = require("../utils/keyUtils");

const registerUser = async (username, phoneNumber) => {
  // Generate a new key pair for the user
  const { publicKey, privateKey } = generateKeyPair();

  // Create a new user with the generated public key
  const newUser = new User({
    username,
    phoneNumber,
    publicKey,
    // Do not store the private key in the database
  });

  // Save the user to the database
  await newUser.save();

  // Return the user and the private key
  return { user: newUser, privateKey };
};

module.exports = { registerUser };
