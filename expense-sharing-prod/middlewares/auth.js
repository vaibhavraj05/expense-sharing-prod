const jwt = require("jsonwebtoken");

const models = require("../models");
const redisClient = require("../helper/redis.helper");

const checkAccessToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const accessToken = header ? header.split(" ")[1] : null;
    if (!accessToken) {
      throw new Error("Access denied");
    }
    const decodedJwt = jwt.verify(accessToken, process.env.SECRET_KEY_ACCESS);
    const user = await models.User.findOne({
      where: {
        id: decodedJwt.userId,
      },
    });
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkRefreshToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const refreshToken = header ? header.split(" ")[1] : null;
    if (!refreshToken) {
      throw new Error("Access denied");
    }
    const decodedJwt = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
    let userId = decodedJwt.userId;
    let key = userId + "-refresh-token";
    let cachedRefreshToken = await redisClient.get(key);
    if (cachedRefreshToken !== refreshToken) throw new Error("Login Required");

    req.body.userId = userId;
    req.body.token = refreshToken;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkAccessToken,
  checkRefreshToken,
};
