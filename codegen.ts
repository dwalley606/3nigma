import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './server/src/schemas/typeDefs.ts',
  generates: {
    './server/src/generated/': {
      preset: 'client',
      plugins: ['typescript', 'typescript-resolvers'],
      presetConfig: {
        gqlTagName: 'gql'
      }
    },
    './client/src/generated/': {
      documents: ['./client/src/graphql/**/*.graphql'],
      preset: 'client',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      presetConfig: {
        gqlTagName: 'gql'
      }
    }
  },
  ignoreNoDocuments: true
};

export default config;
