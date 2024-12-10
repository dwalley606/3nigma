import { userQueries } from './queries.js';
import { userMutations } from './mutations.js';

export const userResolvers = {
  Query: userQueries,
  Mutation: userMutations,
};
