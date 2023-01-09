const userSignupData = async (req, res, next) => {
  let recievedData = res.data || {};
  let resultData;
  if (recievedData) {
    resultData = {
      id: recievedData.dataValues.id,
      firstName: recievedData.dataValues.firstName,
      lastName: recievedData.dataValues.lastName,
      email: recievedData.dataValues.email,
    };
  }
  res.data = resultData;
  next();
};

module.exports = {
  userSignupData,
};
