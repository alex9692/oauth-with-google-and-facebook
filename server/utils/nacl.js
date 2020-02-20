const nacl = require("express-acl");

nacl.config({
  baseUrl: "api/v1",
  filename: "nacl.json",
  path: "utils",
  decodedObjectName: "user",
  denyCallback: res => {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorized to access this resource"
    });
  }
});

module.exports = nacl;
