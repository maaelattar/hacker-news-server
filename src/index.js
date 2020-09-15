const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { PubSub } = require("graphql-subscriptions");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const prisma = new PrismaClient();
const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30); // raise max listeners in event emitter

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    reportSchema: true,
    variant: "current",
  },
  context: ({ req }) => {
    return {
      req,
      prisma,
      pubsub,
    };
  },
});

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at: ${url}`);
    console.log(`Subscriptions ready at: ${subscriptionsUrl}`);
  });
