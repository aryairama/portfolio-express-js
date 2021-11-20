const bcrypt = require('bcrypt');
const authQuery = require('../models/query/auth');
const { responseError, responseCookie } = require('../helpers/helpers');
const { genAccessToken, genRefreshToken } = require('../helpers/jwt');

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

module.exports = { login };
