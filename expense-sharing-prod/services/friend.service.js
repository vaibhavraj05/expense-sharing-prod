const { Op, Sequelize } = require("sequelize");

const { sequelize } = require("../models");
const models = require("../models");

const addFriend = async (payload, userData) => {
  let friendOneId = userData.id;
  let friendTwoEmail = payload.email;

  let friendTwo = await models.User.findOne({
    where: { email: friendTwoEmail },
  });
  if (!friendTwo) throw new Error("User Not Found!");
  let friendTwoId = friendTwo.dataValues.id;

  let existingRelation = await models.FriendList.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ friendOne: friendOneId }, { friendTwo: friendTwoId }],
        },
        {
          [Op.and]: [{ friendOne: friendTwoId }, { friendTwo: friendOneId }],
        },
      ],
    },
  });

  if (existingRelation) throw new Error("Relation already exist");

  let createRelation = await models.FriendList.create({
    friendOne: friendOneId,
    friendTwo: friendTwoId,
  });

  return createRelation;
};

const addExpense = async (payload, userData) => {
  let { payeeId, payerId, baseAmount, splitType, payerAmount } = payload;
  let amountToPay;

  if (!(payeeId === userData.id || payerId === userData.id))
    throw new Error("Access Denied!");

  let payer = await models.User.findOne({
    where: { id: payerId },
  });
  if (!payer) throw new Error("User Not Found!");
  let payee = await models.User.findOne({
    where: { id: payeeId },
  });
  if (!payee) throw new Error("User Not Found!");

  let existingRelation = await models.FriendList.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ friendOne: payeeId }, { friendTwo: payerId }],
        },
        {
          [Op.and]: [{ friendOne: payerId }, { friendTwo: payeeId }],
        },
      ],
    },
  });
  if (!existingRelation)
    addFriend({ email: payer.dataValues.email }, { id: payee.dataValues.id });

  if (splitType === "exactly") {
    amountToPay = baseAmount;
  } else if (splitType === "equally") {
    amountToPay = baseAmount / 2;
  } else {
    if (!(baseAmount > payerAmount)) throw new Error("Invalid values");
    amountToPay = payerAmount;
  }
  let transaction, expense;
  const t = await sequelize.transaction();
  try {
    expense = await models.Expense.create(
      {
        name: payload.name,
        baseAmount: payload.baseAmount,
        splitType: payload.splitType,
      },
      { transaction: t }
    );
    transaction = await models.Transaction.create(
      {
        expenseId: expense.dataValues.id,
        payeeId: payeeId,
        payerId: payerId,
        amountToPay: amountToPay,
      },
      { transaction: t }
    );

    await t.commit();
    return {
      expense,
      transaction,
    };
  } catch (error) {
    await t.rollback();
    throw new Error("Something went wrong");
  }
};

const simplifyDebts = async (userData, params) => {
  let targetUserId = params.id;
  let currentUserId = userData.id;

  let targetUserData = await models.Transaction.findAll({
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("amount_to_pay")), "targetUserAmount"],
    ],
    where: {
      payeeId: currentUserId,
      payerId: targetUserId,
    },
  });
  let currentUserData = await models.Transaction.findAll({
    attributes: [
      [
        Sequelize.fn("sum", Sequelize.col("amount_to_pay")),
        "currentUserAmount",
      ],
    ],
    where: {
      payeeId: targetUserId,
      payerId: currentUserId,
    },
  });
  let amountDifference =
    targetUserData[0].dataValues.targetUserAmount -
    currentUserData[0].dataValues.currentUserAmount;
  return {
    amountDifference,
  };
};

const overallExpenseOfCurrentUser = async (userData) => {
  let currentUserId = userData.id;

  let borrow = await models.Transaction.findAll({
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("amount_to_pay")), "borrow"],
    ],
    where: {
      payerId: currentUserId,
    },
  });
  let lent = await models.Transaction.findAll({
    attributes: [[Sequelize.fn("sum", Sequelize.col("amount_to_pay")), "lent"]],
    where: {
      payeeId: currentUserId,
    },
  });
  let amountDifference = lent[0].dataValues.lent - borrow[0].dataValues.borrow;
  return {
    amountDifference,
  };
};

const AllTransactionWithTargetUser = async (userData, params) => {
  let currentUserId = userData.id;
  let targetUserId = params.id;

  let targetUserData = await models.User.findOne({
    where: { id: targetUserId },
  });
  if (!targetUserData) throw new Error("User Not Found!");

  let lentToTargetUser = await models.Transaction.findAll({
    where: {
      payeeId: currentUserId,
      payerId: targetUserId,
    },
    include: [
      {
        model: models.Expense,
        as: "expense",
        include: [
          {
            model: models.Group,
            as: "group",
          },
        ],
      },
    ],
  });
  let borrowFromTargetUser = await models.Transaction.findAll({
    where: {
      payeeId: targetUserId,
      payerId: currentUserId,
    },
    include: [
      {
        model: models.Expense,
        as: "expense",
        include: [
          {
            model: models.Group,
            as: "group",
          },
        ],
      },
    ],
  });
  return {
    borrowFromTargetUser,
    lentToTargetUser,
  };
};

const removeFriend = async (userData, params) => {
  let currentUserId = userData.id;
  let targetUserId = params.id;

  let targetUserData = await models.User.findOne({
    where: { id: targetUserId },
  });
  if (!targetUserData) throw new Error("User Not Found!");

  let pendingTransaction = await models.Transaction.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            {
              [Op.and]: [{ payeeId: currentUserId }, { payerId: targetUserId }],
            },
            {
              [Op.and]: [{ payeeId: targetUserId }, { payerId: currentUserId }],
            },
          ],
        },
      ],
    },
  });

  if (pendingTransaction) throw new Error("Settle up the pending tranactions");
  await models.FriendList.destroy({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ friendOne: currentUserId }, { friendTwo: targetUserId }],
        },
        {
          [Op.and]: [{ friendOne: targetUserId }, { friendTwo: currentUserId }],
        },
      ],
    },
  });
  return;
};

const getAllFriend = async (userData) => {
  let currentUserId = userData.id;

  let friend = await models.FriendList.findAll({
    where: {
      [Op.or]: [
        {
          friendOne: currentUserId,
        },
        {
          friendTwo: currentUserId,
        },
      ],
    },
    include: [
      {
        model: models.User,
        as: "friendOneData",
      },
      {
        model: models.User,
        as: "friendTwoData",
      },
    ],
  });
  return friend;
};

const expenseDetail = async (params) => {
  let expenseId = params.id;

  let existingExpenseId = await models.Expense.findOne({
    where: { id: expenseId },
    include: [
      {
        model: models.Transaction,
        as: "transactions",
      },
    ],
  });
  if (!existingExpenseId) throw new Error("Expense Id not found");
  return existingExpenseId;
};

const updateExpense = async (payload, params) => {
  let expenseId = params.id;
  let existingExpenseId = await models.Expense.findOne({
    where: { id: expenseId },
    include: [
      {
        model: models.Transaction,
        as: "transactions",
      },
    ],
  });
  if (!existingExpenseId) throw new Error("Expense Id not found");
  let name = payload.name || existingExpenseId.dataValues.name;
  let baseAmount =
    payload.baseAmount || existingExpenseId.dataValues.baseAmount;
  let splitType = payload.splitType || existingExpenseId.dataValues.splitType;
  let payeeId =
    payload.payeeId || existingExpenseId.dataValues.transactions[0].payeeId;
  let payerId =
    payload.payerId || existingExpenseId.dataValues.transactions[0].payerId;
  let amountToPay =
    payload.amountToPay ||
    existingExpenseId.dataValues.transactions[0].amountToPay;

  if (splitType === "exactly") {
    amountToPay = baseAmount;
  } else if (splitType === "equally") {
    amountToPay = baseAmount / 2;
  } else {
    if (!(baseAmount > payerAmount)) throw new Error("Invalid values");
    amountToPay = payerAmount;
  }
  let transaction, expense;
  const t = await sequelize.transaction();
  try {
    expense = await models.Expense.update(
      {
        name: name,
        baseAmount: baseAmount,
        splitType: splitType,
      },
      {
        where: {
          id: expenseId,
        },
      },
      { transaction: t }
    );
    transaction = await models.Transaction.update(
      {
        expenseId: expenseId,
        payeeId: payeeId,
        payerId: payerId,
        amountToPay: amountToPay,
      },
      { where: { id: existingExpenseId.dataValues.transactions[0].id } },
      { transaction: t }
    );

    await t.commit();

    return expenseDetail({ id: expenseId });
  } catch (error) {
    await t.rollback();
    throw new Error("Something went wrong");
  }
};

const settleTransaction = async (params) => {
  let transactionId = params.id;

  let existingTransaction = await models.Transaction.findOne({
    where: {
      id: transactionId,
    },
    include: [
      {
        model: models.Expense,
        as: "expense",
      },
    ],
  });
  if (!existingTransaction) throw new Error("Treansaction not found");
  if (existingTransaction.dataValues.expense.groupId)
    throw new Error("Invalid Opration");
  await models.Transaction.destroy({
    where: {
      id: transactionId,
    },
  });
  await models.Expense.destroy({
    where: {
      id: existingTransaction.dataValues.expense.id,
    },
  });
  return;
};

module.exports = {
  addFriend,
  addExpense,
  simplifyDebts,
  overallExpenseOfCurrentUser,
  AllTransactionWithTargetUser,
  removeFriend,
  getAllFriend,
  expenseDetail,
  updateExpense,
  settleTransaction,
};
