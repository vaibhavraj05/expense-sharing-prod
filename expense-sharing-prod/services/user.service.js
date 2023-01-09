const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UniqueStringGenerator = require("unique-string-generator");

const models = require("../models");
const redisClient = require("../helper/redis.helper");
const mailer = require("../helper/mailer.helper");

const userSignup = async (payload) => {
  payload.password = await bcrypt.hash(payload.password, 10);

  const existingUser = await models.User.findOne({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await models.User.create(payload);

  return user;
};

const userLogin = async (payload) => {
  const { email, password } = payload;
  const user = await models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  let key = user.dataValues.id + "-refresh-token";
  let refreshToken = await redisClient.get(key);
  if (!refreshToken) {
    const match = await bcrypt.compareSync(password, user.dataValues.password);
    if (!match) {
      throw new Error("Wrong email or password");
    }
    refreshToken = jwt.sign(
      { userId: user.dataValues.id },
      process.env.SECRET_KEY_REFRESH,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }
    );
  }

  const accessToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );

  await redisClient.set(key, refreshToken, 60 * 24);

  return {
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const refreshToken = async (refreshToken, userId) => {
  let newAccessToken = jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );

  return {
    accessToken: newAccessToken,
    refreshToken,
  };
};

const forgetPassword = async (payload) => {
  const { email } = payload;
  const user = await models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  let randomToken = UniqueStringGenerator.UniqueString();
  let resetPassawordLink = `${process.env.BASE_URL}/api/user/reset-password/${randomToken}`;
  let key = randomToken + "-reset-password-link";
  await redisClient.set(key, user.dataValues.id, 10);

  let recipient = email;
  let subject = "Reset Password Link";
  let body = `Password Reset Link:- ${resetPassawordLink}`;

  await mailer.sendMail(body, subject, recipient);
  return "send reset password link successfully";
};

const resetPassword = async (payload, params) => {
  const resetToken = params.token;
  const password = payload.password;
  let key = resetToken + "-reset-password-link";
  const cachedUserId = await redisClient.get(key);
  if (!cachedUserId) {
    throw new Error("Invalid Reset Link");
  }

  const userExist = await models.User.findOne({ where: { id: cachedUserId } });
  if (!userExist) {
    throw new Error("User Not Found");
  }
  await redisClient.del(key);

  await models.User.update(
    { password: await bcrypt.hash(password, 10) },
    { where: { email: userExist.dataValues.email } }
  );
  const email_body = `Password reset successfull`;
  const email_subject = `Password reset`;
  await mailer.sendMail(email_body, email_subject, userExist.dataValues.email);
  return "Password reset successfully";
};

const updateUser = async (userData, payload) => {
  let user = await models.User.findOne({
    where: {
      email: userData.email,
    },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  user = await models.User.update(payload, {
    where: {
      id: userData.id,
    },
  });
  return;
};

const deleteUser = async (userData) => {
  const user = await models.User.findOne({
    where: {
      id: userData.id,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  await models.User.destroy({
    where: {
      id: userData.id,
    },
  });

  return "User successfully deleted";
};

const userLogout = async (userData) => {
  let userId = userData.id;

  let user = await models.User.findOne({
    where: {
      id: userId,
    },
  });
  if (!user) throw new Error("User not found!");
  let key = userId + "-refresh-token";
  redisClient.del(key);
  return;
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
