const addFriendData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    resultData = {
      id: reciveData.dataValues.id,
      friendOne: reciveData.dataValues.friendOne,
      friendTwo: reciveData.dataValues.friendTwo,
    };
  }
  res.data = resultData;
  next();
};

const addExpenseData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};
  if (reciveData) {
    resultData = {
      expense: {
        id: reciveData.expense.dataValues.id,
        name: reciveData.expense.dataValues.name,
        baseAmount: reciveData.expense.dataValues.baseAmount,
        splitType: reciveData.expense.dataValues.splitType,
        transaction: {
          payeeId: reciveData.transaction.dataValues.payeeId,
          payerId: reciveData.transaction.dataValues.payerId,
          amountToPay: reciveData.transaction.dataValues.amountToPay,
        },
      },
    };
  }
  res.data = resultData;
  next();
};

const AllTransactionWithTargetUserData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    let borrowFromTargetUser = [];
    let lentToTargetUser = [];
    function serializeData(sourceArray, destinationArray) {
      sourceArray.forEach((element) => {
        let parentObject = {
          id: element.dataValues.id,
          payeeId: element.dataValues.payeeId,
          payerId: element.dataValues.payeeId,
          amountToPay: element.dataValues.amountToPay,
          expense: {
            id: element.dataValues.expense.id,
            name: element.dataValues.expense.name,
            baseAmount: element.dataValues.expense.baseAmount,
            splitType: element.dataValues.expense.splitType,
          },
        };
        if (element.dataValues.expense.groupId) {
          let group = {
            id: element.dataValues.expense.group.id,
            name: element.dataValues.expense.group.name,
            category: element.dataValues.expense.group.category,
          };
          parentObject.expense.group = group;
        }
        destinationArray.push(parentObject);
      });
    }
    serializeData(reciveData.borrowFromTargetUser, borrowFromTargetUser);
    serializeData(reciveData.lentToTargetUser, lentToTargetUser);

    resultData = {
      borrowFromTargetUser,
      lentToTargetUser,
    };
  }
  res.data = resultData;
  next();
};

const getAllFriendData = async (req, res, next) => {
  let currentUserId = req.user.id;
  let reciveData = res.data || {};
  let resultData = {};
  let friends = [];
  let friend;
  if (reciveData) {
    reciveData.forEach((element) => {
      if (element.dataValues.friendOneData.id === currentUserId) {
        let name =
          element.dataValues.friendTwoData.firstName +
          " " +
          element.dataValues.friendTwoData.lastName;
        friend = {
          id: element.dataValues.friendTwoData.id,
          name: name,
          email: element.dataValues.friendTwoData.email,
        };
      } else {
        let name =
          element.dataValues.friendOneData.firstName +
          " " +
          element.dataValues.friendOneData.lastName;
        friend = {
          id: element.dataValues.friendOneData.id,
          name: name,
          email: element.dataValues.friendOneData.email,
        };
      }
      friends.push(friend);
    });
    resultData = {
      friends,
    };
  }
  res.data = resultData;
  next();
};

const expenseDetailData = async (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    resultData = {
      id: reciveData.dataValues.id,
      name: reciveData.dataValues.name,
      baseAmount: reciveData.dataValues.baseAmount,
      splitType: reciveData.dataValues.splitType,
      transaction: {
        id: reciveData.dataValues.transactions[0].id,
        payeeId: reciveData.dataValues.transactions[0].payeeId,
        payerId: reciveData.dataValues.transactions[0].payerId,
        amountToPay: reciveData.dataValues.transactions[0].amountToPay,
      },
    };
  }
  res.data = resultData;
  next();
};

module.exports = {
  addFriendData,
  addExpenseData,
  AllTransactionWithTargetUserData,
  getAllFriendData,
  expenseDetailData,
};
