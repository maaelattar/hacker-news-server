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

function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

module.exports = { getUserId, isUrl };
