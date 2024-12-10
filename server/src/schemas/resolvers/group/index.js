import { groupQueries } from './queries.js';
import { groupMutations } from './mutations.js';

export const groupResolvers = {
  Query: groupQueries,
  Mutation: groupMutations,
};
