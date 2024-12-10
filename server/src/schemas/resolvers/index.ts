import { IResolvers } from '@graphql-tools/utils';
import { userResolvers } from './user/index.js';
import { messageResolvers } from './message/index.js';
import { groupResolvers } from './group/index.js';

const resolvers: IResolvers = {
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