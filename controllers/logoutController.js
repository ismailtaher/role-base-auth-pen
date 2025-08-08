const {
  findUserByRefreshToken,
  deleteRefreshToken,
} = require('../model/userModel');

const handleLogout = async (req, res) => {
  // on client also delete the accessToken

  // get refreshToken from cookies
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No Content to send back
  const refreshToken = cookies.jwt;

  // find user by using the refreshToken
  const foundUser = await findUserByRefreshToken(refreshToken);

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
  }

  // Delete the refreshToken in the DB
  await deleteRefreshToken(foundUser.id);
  // send response to clear the httpOnly cookie on client side
  res.clearCookie('jwt', {
    httpOnly: true /* sameSite: 'None', secure: true */,
  }); //commented out code is for production code
  res.sendStatus(204);
};

module.exports = { handleLogout };
