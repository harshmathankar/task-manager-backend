module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpire: '7d',
  bcryptSaltRounds: 12
};
