const Joi = require("joi");

const { validateRequest } = require("../helper/common-functions.helper");

const addFriendSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const addExpenseSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    baseAmount: Joi.number().required(),
    payeeId: Joi.string().guid().required(),
    payerId: Joi.string().guid().required(),
    splitType: Joi.string().valid("equally", "unequally", "exactly").required(),
    payerAmount: Joi.number(),
  });
  validateRequest(req, res, next, schema, "body");
};

const paramsIdCheck = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "params");
};

module.exports = {
  addFriendSchema,
  addExpenseSchema,
  paramsIdCheck,
};
