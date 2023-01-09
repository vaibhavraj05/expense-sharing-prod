const { commonErrorHandler } = require("../helper/error-handler.helper");
const groupService = require("../services/group.service");

const createGroup = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await groupService.createGroup(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await groupService.addMember(payload, req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const addExpense = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await groupService.addExpense(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const simplifyDebts = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.simplifyDebts(params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const expenseDetail = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.expenseDetail(params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const groupExpenses = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.groupExpenses(params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const allGroupOfCurrentUser = async (req, res, next) => {
  try {
    const data = await groupService.allGroupOfCurrentUser(req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.leaveGroup(req.user, params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.deleteGroup(params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const overallExpenseOfCurrentUserAtGroups = async (req, res, next) => {
  try {
    const data = await groupService.overallExpenseOfCurrentUserAtGroups(
      req.user
    );
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const overallExpenseOfCurrentUserAtGroup = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.overallExpenseOfCurrentUserAtGroup(
      req.user,
      params
    );
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const settleTransaction = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await groupService.settleTransaction(params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createGroup,
  addMember,
  addExpense,
  simplifyDebts,
  expenseDetail,
  groupExpenses,
  allGroupOfCurrentUser,
  leaveGroup,
  deleteGroup,
  overallExpenseOfCurrentUserAtGroups,
  overallExpenseOfCurrentUserAtGroup,
  settleTransaction,
};
