const jwt = require('jsonwebtoken');
const { findUserByRefreshToken, getUserRoles } = require('../model/userModel');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
  // get the httpOnly cookie from request
  const cookies = req.cookies;
  // if the cookie does not have a jwt property send 401 unauthorized
  if (!cookies?.jwt) return res.sendStatus(401);

  console.log(cookies.jwt);
  // get the refeshToken from the cookie
  const refreshToken = cookies.jwt;
  // find the user from users table using that user's refreshToken
  const foundUser = await findUserByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403); // Forbidden
  //console.log(foundUser);

  // evaluate JWT
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });
    /* console.log(decoded); */

    // if username from the refreshToken does not match the username from our foundUser that was gotten using the refreshToken
    if (foundUser.username !== decoded.username) return res.sendStatus(403);
    // get roles for that user from the user_roles table
    const roles = await getUserRoles(foundUser.id);
    // creating a new accessToken
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2m' }
    );
    // sending the new accessToken
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.sendStatus(403);
  }
};

module.exports = { handleRefreshToken };
