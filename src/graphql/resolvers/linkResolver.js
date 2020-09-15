const { getUserId } = require("../../utils");
const { GraphQLDateTime } = require("graphql-iso-date");

const Query = {
  feed: async function (parent, args, context, info) {
    const where = args.filter
      ? {
          OR: [
            { description: { contains: args.filter } },
            { url: { contains: args.filter } },
          ],
        }
      : {};

    const links = await context.prisma.link.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
    });

    const count = await context.prisma.link.count({ where });

    return {
      links,
      count,
    };
  },
};

const Mutation = {
  post: function (parent, args, context, info) {
    const userId = getUserId(context);
    const newLink = context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    });
    context.pubsub.publish("NEW_LINK", newLink);

    return newLink;
  },
};

const Subscription = {
  newLink: {
    resolve: (payload) => {
      return payload;
    },

    subscribe: (parent, args, context, info) => {
      return context.pubsub.asyncIterator("NEW_LINK");
    },
  },
};
const Link = {
  postedBy: function (parent, args, context) {
    return context.prisma.link.findOne({ where: { id: parent.id } }).postedBy();
  },

  votes: function (parent, args, context) {
    return context.prisma.link.findOne({ where: { id: parent.id } }).votes();
  },
};

module.exports = {
  Query,
  Mutation,
  Subscription,
  Link,
};
