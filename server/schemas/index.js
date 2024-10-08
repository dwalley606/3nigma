// This file is the main entry point for the GraphQL API.
// It exports the typeDefs and resolvers for the API.

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

module.exports = { typeDefs, resolvers };