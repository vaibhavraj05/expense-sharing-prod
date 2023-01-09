const { Router } = require("express");

const groupController = require("../controllers/group.controller");
const groupValidator = require("../validators/group.validator");
const genericResponse = require("../helper/generic-response.helper");
const groupSerializer = require("../serializers/group.serializer");
const { checkAccessToken } = require("../middlewares/auth");

const router = Router();

router.post(
  "/",
  checkAccessToken,
  groupValidator.createGroupSchema,
  groupController.createGroup,
  groupSerializer.createGroupData,
  genericResponse.sendResponse
);

router.post(
  "/member",
  checkAccessToken,
  groupValidator.addMemberSchema,
  groupController.addMember,
  groupSerializer.addMemberData,
  genericResponse.sendResponse
);

router.post(
  "/expense",
  checkAccessToken,
  groupValidator.addExpenseSchema,
  groupController.addExpense,
  groupSerializer.addExpenseData,
  genericResponse.sendResponse
);

router.get(
  "/simplify-debt/:id",
  groupValidator.simplifyDebtsSchema,
  groupController.simplifyDebts,
  genericResponse.sendResponse
);

router.get(
  "/expense/:id",
  checkAccessToken,
  groupValidator.paramsIdCheck,
  groupController.expenseDetail,
  groupSerializer.expenseDetailData,
  genericResponse.sendResponse
);

router.get(
  "/expense/all/:id",
  checkAccessToken,
  groupValidator.paramsIdCheck,
  groupController.groupExpenses,
  groupSerializer.groupExpensesData,
  genericResponse.sendResponse
);

router.get(
  "/",
  checkAccessToken,
  groupController.allGroupOfCurrentUser,
  groupSerializer.allGroupOfCurrentUserData,
  genericResponse.sendResponse
);

router.post(
  "/leave/:id",
  checkAccessToken,
  groupValidator.paramsIdCheck,
  groupController.leaveGroup,
  genericResponse.sendResponse
);

router.delete(
  "/:id",
  checkAccessToken,
  groupValidator.paramsIdCheck,
  groupController.deleteGroup,
  genericResponse.sendResponse
);

router.get(
  "/all",
  checkAccessToken,
  groupController.overallExpenseOfCurrentUserAtGroups,
  genericResponse.sendResponse
);

router.get(
  "/all/:id",
  checkAccessToken,
  groupValidator.paramsIdCheck,
  groupController.overallExpenseOfCurrentUserAtGroup,
  genericResponse.sendResponse
);

router.delete(
  "/transaction/:groupId/:expenseId/:transactionId",
  checkAccessToken,
  groupValidator.settleTransactionValidate,
  groupController.settleTransaction,
  genericResponse.sendResponse
);

module.exports = router;
