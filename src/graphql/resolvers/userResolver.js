const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Mutation = {
  signup: async function (parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({
      data: { ...args, password },
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user,
    };
  },

  login: async function (parent, args, context, info) {
    const user = await context.prisma.user.findOne({
      where: { email: args.email },
    });
    if (!user) {
      throw new Error("No such user found");
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user,
    };
  },
};

const User = {
  links: function (parent, args, context) {
    return context.prisma.user.findOne({ where: { id: parent.id } }).links();
  },
};

module.exports = {
  Mutation,
  User,
};
