import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // Import the User model
dotenv.config();
const secret = process.env.JWT_SECRET;
const expiration = "2h";

export const authMiddleware = async ({ req }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    console.log("No token provided");
    return { user: null };
  }

  try {
    const { id } = jwt.verify(token, secret, { maxAge: expiration });
    console.log("Token verified, user ID:", id);

    // Fetch the user details from the database
    const user = await User.findById(id).select("username email"); // Ensure username is selected
    if (!user) {
      console.log("User not found");
      return { user: null };
    }

    return { user: { id: user._id, username: user.username } }; // Include username in the user object
  } catch (error) {
    console.log("Invalid token:", error.message);
    return { user: null };
  }
};
