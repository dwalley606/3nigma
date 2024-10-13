import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'mysecretssshhhhhhh';
const expiration = '2h';

export const authMiddleware = ({ req }) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    throw new GraphQLError('No token provided.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (error) {
    console.error('Invalid token:', error);
    throw new GraphQLError('Invalid token.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  return req;
};

export const signToken = ({ firstName, email, _id }) => {
  const payload = { firstName, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};