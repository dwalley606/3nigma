import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'yourSecretKey';
const expiration = '2h';

export const authMiddleware = ({ req }) => {
  // Extract token from request
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If token is in the authorization header, remove "Bearer" prefix
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // If no token, return request object as is
  if (!token) {
    return req;
  }

  try {
    // Verify token and attach user data to request
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (error) {
    console.log('Invalid token:', error.message);
  }

  // Return the request object with user data if available
  return req;
};

export const signToken = ({ firstName, email, _id }) => {
  const payload = { firstName, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};
