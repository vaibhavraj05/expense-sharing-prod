const expense = require("../models/expense");

const createGroupData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    resultData = {
      id: reciveData.dataValues.id,
      name: reciveData.dataValues.name,
      category: reciveData.dataValues.category,
    };
  }
  res.data = resultData;
  next();
};

const addMemberData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    let group = {
      id: reciveData[0].dataValues.group.id,
      name: reciveData[0].dataValues.group.name,
      category: reciveData[0].dataValues.group.category,
    };
    let users = [];
    reciveData.forEach((element) => {
      let name =
        element.dataValues.user.firstName + element.dataValues.user.lastName;
      let user = {
        id: element.dataValues.user.id,
        name: name,
        email: element.dataValues.user.email,
      };
      users.push(user);
    });
    group.users = users;
    resultData = {
      group,
    };
  }
  res.data = resultData;
  next();
};

const addExpenseData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    let expense = {
      id: reciveData.expense.dataValues.id,
      name: reciveData.expense.dataValues.name,
      baseAmount: reciveData.expense.dataValues.baseAmount,
      splitType: reciveData.expense.dataValues.splitType,
      groupId: reciveData.expense.dataValues.groupId,
    };
    let transactions = [];
    reciveData.transactions.forEach((element) => {
      let transaction = {
        id: element.dataValues.id,
        payeeId: element.dataValues.payeeId,
        payerId: element.dataValues.payeeId,
        amountToPay: element.dataValues.amountToPay,
        isSettle: element.dataValues.isSettle,
      };
      transactions.push(transaction);
    });
    resultData = {
      expense,
      transactions,
    };
  }
  res.data = resultData;
  next();
};

const expenseDetailData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};
  let transactions = [];
  if (reciveData) {
    let expense = {
      id: reciveData.dataValues.id,
      name: reciveData.dataValues.name,
      baseAmount: reciveData.dataValues.baseAmount,
      splitType: reciveData.dataValues.splitType,
    };
    reciveData.dataValues.transactions.forEach((transaction) => {
      transactions.push({
        id: transaction.id,
        payeeId: transaction.payeeId,
        payerId: transaction.payerId,
        amountToPay: transaction.amountToPay,
      });
    });
    expense.transactions = transactions;
    resultData = {
      expense,
    };
  }
  res.data = resultData;
  next();
};

const groupExpensesData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};
  let expenses = [];

  if (reciveData) {
    reciveData.forEach((expense) => {
      expenses.push({
        id: expense.dataValues.id,
        name: expense.dataValues.name,
        baseAmount: expense.dataValues.baseAmount,
        splitType: expense.dataValues.splitType,
      });
    });
    resultData.expenses = expenses;
  }
  res.data = resultData;
  next();
};

const allGroupOfCurrentUserData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};
  let groups = [];

  if (reciveData) {
    reciveData.forEach((expense) => {
      groups.push({
        id: expense.dataValues.group.id,
        name: expense.dataValues.group.name,
        category: expense.dataValues.group.category,
      });
    });
    resultData.groups = groups;
  }
  res.data = resultData;
  next();
};

module.exports = {
  createGroupData,
  addMemberData,
  addExpenseData,
  expenseDetailData,
  groupExpensesData,
  allGroupOfCurrentUserData,
};
