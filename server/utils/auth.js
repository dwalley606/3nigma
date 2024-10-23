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
    console.log("No token provided");
    return { user: null };
  }

  try {
    const { id } = jwt.verify(token, secret, { maxAge: expiration });
    console.log("Token verified, user ID:", id);
    return { user: { id } }; // Ensure the user object is structured correctly
  } catch (error) {
    console.log("Invalid token:", error.message);
    return { user: null };
  }
};
