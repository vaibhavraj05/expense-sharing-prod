const { commonErrorHandler } = require("../helper/error-handler.helper");
const userService = require("../services/user.service");

const userSignup = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.userSignup(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.userLogin(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { userId: userId, token: refreshToken } = req.body;

    const data = await userService.refreshToken(refreshToken, userId);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.forgetPassword(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.resetPassword(payload, req.params);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.updateUser((userData = req.user), payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const data = await userService.deleteUser(req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    const data = await userService.userLogout(req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  userSignup,
  userLogin,
  refreshToken,
  forgetPassword,
  resetPassword,
  updateUser,
  deleteUser,
  userLogout,
};
