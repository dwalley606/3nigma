import { userResolvers } from './user/queries.js';
import { messageResolvers } from './message/queries.js';
import { groupResolvers } from './group/queries.js/index.js';

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