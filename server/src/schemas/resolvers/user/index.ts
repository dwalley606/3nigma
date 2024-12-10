import { IResolvers } from '@graphql-tools/utils';
import { userQueries } from './queries.js';
import { userMutations } from './mutations.js';

export const userResolvers: IResolvers = {
  Query: userQueries,
  Mutation: userMutations,
};
