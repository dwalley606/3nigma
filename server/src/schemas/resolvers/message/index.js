import { messageQueries } from './queries.js';
import { messageMutations } from './mutations.js';

export const messageResolvers = {
  Query: messageQueries,
  Mutation: messageMutations,
};
