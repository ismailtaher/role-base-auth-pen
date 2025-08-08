const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  findUserByUsername,
  getUserRoles,
  assignRefreshTokenToUser,
} = require('../model/userModel');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and Password are required!' });

  // finding the user using findUserByUsername function
  const foundUser = await findUserByUsername(user);
  if (!foundUser) return res.sendStatus(401); //unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // getting the user's role form user_roles table
    const roles = await getUserRoles(foundUser.id);
    // create JWTs
    const accessToken = jwt.sign(
      { UserInfo: { username: foundUser.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2m' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Saving the refreshToken with current user is users table
    await assignRefreshTokenToUser(foundUser.id, refreshToken);

    // send refershToken to client
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      /* sameSite: 'None',
      secure: true, */
      maxAge: 24 * 60 * 60 * 1000,
      // commented out options are for production code
    });

    // send accessToken to client
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
