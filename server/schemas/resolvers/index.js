import { userResolvers } from './userResolvers.js';
import { messageResolvers } from './messageResolvers.js';
import { groupResolvers } from './groupResolvers.js';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
    ...groupResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
    ...groupResolvers.Mutation,
  },
};

export default resolvers;