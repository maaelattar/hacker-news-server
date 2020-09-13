const { ApolloServer } = require("apollo-server");
const { GraphQLFileLoader } = require("graphql-tools");
const { PrismaClient } = require("@prisma/client");
const { PubSub } = require("graphql-subscriptions");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req,
      prisma,
      pubsub,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at: ${url}`);
});
