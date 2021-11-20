/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const authQuery = require('../models/query/auth');
const { responseError, responseCookie, response } = require('../helpers/helpers');
const { genAccessToken, genRefreshToken } = require('../helpers/jwt');
const { redis } = require('../configs/redis');

const login = async (req, res, next) => {
  try {
    const checkExistUser = await authQuery.checkExistUser(req.body.email, 'email');
    if (checkExistUser !== null) {
      const comparePassword = await bcrypt.compare(req.body.password, checkExistUser.password);
      if (comparePassword) {
        delete checkExistUser.dataValues.password;
        const accessToken = await genAccessToken({ ...checkExistUser.toJSON() }, { expiresIn: 60 * 60 * 2 });
        const refreshToken = await genRefreshToken({ ...checkExistUser.toJSON() }, { expiresIn: 60 * 60 * 4 });
        responseCookie(
          res,
          'Success',
          200,
          'Login success',
          { ...checkExistUser.toJSON() },
          { accessToken, refreshToken },
          {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          },
        );
      } else {
        responseError(res, 'Authorized failed', 401, 'Wrong password', {
          password: 'passwords dont match',
        });
      }
    } else {
      responseError(res, 'Authorized failed', 401, 'User not Found', {
        email: 'email not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    redis.del(`${process.env.PREFIX_REDIS}jwtRefToken-${req.userLogin.user_id}`, async (error, result) => {
      if (error) {
        next(error);
      } else {
        res.clearCookie('authMyPortfolio', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        response(res, 'Logout', 200, 'Logout success', []);
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout };
