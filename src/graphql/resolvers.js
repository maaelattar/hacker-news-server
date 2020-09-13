const path = require("path");
const { mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { GraphQLDateTime } = require("graphql-iso-date");

const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"), {
  extensions: ["js"],
});

resolversArray.push({ Date: GraphQLDateTime });

module.exports = mergeResolvers(resolversArray);
