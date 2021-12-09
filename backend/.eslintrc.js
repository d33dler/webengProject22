module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    properties: 0,
    camelcase: 0,
    'no-unused-vars': 0,
    indent: 0,
    'space-before-blocks': 0,
    'padded-blocks': 0,
    'no-trailing-spaces': 0,
  },
};
