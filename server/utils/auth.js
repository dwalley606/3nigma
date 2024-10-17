import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
console.log("JWT Secret:", secret);
const expiration = "2h";

export const authMiddleware = ({ req }) => {
  // Extract token from request
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If token is in the authorization header, remove "Bearer" prefix
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  // If no token, return request object as is
  if (!token) {
    return req;
  }

  try {
    console.log("Token received:", token);
    // Verify token and attach user data to request
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (error) {
    console.log("Invalid token:", error.message);
  }

  // Return the request object with user data if available
  return req;
};
