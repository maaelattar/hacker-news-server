const { getUserId } = require("../../utils");
const Mutation = {
  vote: async function (parent, args, context, info) {
    const userId = getUserId(context);
    const vote = await context.prisma.vote.findOne({
      where: {
        linkId_userId: {
          linkId: Number(args.linkId),
          userId: userId,
        },
      },
    });

    if (Boolean(vote)) {
      throw new Error(`Already voted for link: ${args.linkId}`);
    }

    const newVote = context.prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: Number(args.linkId) } },
      },
    });
    context.pubsub.publish("NEW_VOTE", newVote);

    return newVote;
  },
};

const Subscription = {
  newVote: {
    resolve: (payload) => {
      return payload;
    },

    subscribe: (parent, args, context, info) => {
      return context.pubsub.asyncIterator("NEW_VOTE");
    },
  },
};

const Vote = {
  link: function (parent, args, context) {
    return context.prisma.vote.findOne({ where: { id: parent.id } }).link();
  },

  user: function (parent, args, context) {
    return context.prisma.vote.findOne({ where: { id: parent.id } }).user();
  },
};

module.exports = {
  Mutation,
  Subscription,
  Vote,
};
