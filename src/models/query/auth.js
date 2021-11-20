const models = require('../index');

const checkExistUser = (fieldValue, field) => new Promise((resolve, reject) => {
  models.Users.findOne({ where: { [field]: fieldValue } })
    .then((res) => resolve(res))
    .catch((err) => reject(err));
});

module.exports = { checkExistUser };
