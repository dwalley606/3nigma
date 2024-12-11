import { userQueries } from './user/queries.js';
import { groupQueries } from './group/queries.js';
import { messageQueries } from './message/queries.js';
import { userMutations } from './user/mutations.js';
import { groupMutations } from './group/mutations.js';
import { messageMutations } from './message/mutations.js';

// Merge all queries into a single resolver object
export const resolvers = {
  Query: {
    ...userQueries.Query,
    ...groupQueries.Query,
    ...messageQueries.Query
  },
  Mutation: {
    ...userMutations.Mutation,
    ...groupMutations.Mutation,
    ...messageMutations.Mutation
  }
  // Add other types (Mutation, Subscription, etc.) here if you have them
};