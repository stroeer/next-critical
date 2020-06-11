// 📌 this config is only for jest.
// Unfortunately jest does not bubble up the packages for a root `babel.config.js`.
// See: https://github.com/facebook/jest/issues/7359
module.exports = {
  extends: '../../babel.config.js',
};
