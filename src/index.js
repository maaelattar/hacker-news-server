const { ApolloServer } = require("apollo-server");
const { loadSchema, GraphQLFileLoader } = require("graphql-tools");
const typeDefs = require("./graphql/typeDefs");

const resolvers = {};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at: ${url}`);
});
