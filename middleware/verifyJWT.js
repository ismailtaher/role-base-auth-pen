const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // unauthorized

  /* console.log(authHeader); */ // Bearer token (<- au p00thHeader will look like this)

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // invalid token
    /* console.log('Decoded token:', decoded);
    console.log('Decoded username:', decoded?.UserInfo?.username);
    console.log('Decoded roles:', decoded?.UserInfo?.roles); */
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
