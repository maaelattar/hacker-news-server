const jwt = require("jsonwebtoken");

function getUserId(context) {
  const authorization = context.req.headers.authorization;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    return userId;
  }
  throw new Error("Not authenticated");
}

module.exports = { getUserId };
