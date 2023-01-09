const Joi = require("joi");

const { validateRequest } = require("../helper/common-functions.helper");

const createGroupSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    category: Joi.string().valid("trip", "home", "couple", "other").required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const addMemberSchema = async (req, res, next) => {
  const schema = Joi.object({
    groupId: Joi.string().required(),
    groupMember: Joi.array().items(Joi.string().guid()).required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const addExpenseSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    baseAmount: Joi.number().required(),
    payeeId: Joi.string().guid().required(),
    member: Joi.array().items(Joi.string().guid()).required(),
    splitType: Joi.string().valid("equally", "unequally").required(),
    payerAmount: Joi.array().items(Joi.number()),
    groupId: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const simplifyDebtsSchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "params");
};

const paramsIdCheck = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "params");
};

const settleTransactionValidate = async (req, res, next) => {
  const schema = Joi.object({
    groupId: Joi.string().guid().required(),
    expenseId: Joi.string().guid().required(),
    transactionId: Joi.string().guid().required(),
  });
  validateRequest(req, res, next, schema, "params");
};

module.exports = {
  createGroupSchema,
  addExpenseSchema,
  simplifyDebtsSchema,
  addMemberSchema,
    paramsIdCheck,
  settleTransactionValidate
};
