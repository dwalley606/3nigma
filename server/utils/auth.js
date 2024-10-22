import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
console.log("JWT Secret:", secret);
const expiration = "2h";

export const authMiddleware = ({ req }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return { user: null }; // Explicitly return null user if no token is found
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return { user: data }; // Return the user data if token is valid
  } catch (error) {
    console.log("Invalid token:", error.message);
    return { user: null }; // Return null user if token verification fails
  }
};
