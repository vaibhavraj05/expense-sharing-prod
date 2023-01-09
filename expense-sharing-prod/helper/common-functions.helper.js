const _ = require("lodash");

const { commonErrorHandler } = require("./error-handler.helper");

const validateRequest = (req, res, next, schema, requestParamterType) => {
  let requestData = {};
  if (requestParamterType === "body") {
    requestData = req.body;
  } else if (requestParamterType === "query") {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  const { error, value } = schema.validate(requestData);

  if (!error) {
    if (requestParamterType === "body") {
      req.body = value;
    } else if (requestParamterType === "query") {
      req.query = value;
    } else {
      req.params = value;
    }
    return next();
  }

  const { details } = error;

  //to make "password" -> password
  const message = details
    .map((i) => i.message.replace(/("([a-z]*)")/gm, "$2"))
    .join(",");
  return commonErrorHandler(req, res, message, 422);
};

module.exports = {
  validateRequest,
};
