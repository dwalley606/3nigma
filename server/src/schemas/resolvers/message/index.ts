import { IResolvers } from '@graphql-tools/utils';
import { messageQueries } from './queries.js';
import { messageMutations } from './mutations.js';

export const messageResolvers: IResolvers = {
  Query: messageQueries,
  Mutation: messageMutations,
};
