import { IResolvers } from '@graphql-tools/utils';
import { groupQueries } from './queries.js';
import { groupMutations } from './mutations.js';

export const groupResolvers: IResolvers = {
  Query: groupQueries,
  Mutation: groupMutations,
};
