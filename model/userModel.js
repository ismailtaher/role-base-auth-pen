const pool = require('../config/db');

const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  return result.rows[0];
};

const createUser = async (username, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
    [username, hashedPassword]
  );
  return result.rows[0].id;
};

const assignRoleToUser = async (userId, roleId) => {
  await pool.query(
    'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
    [userId, roleId]
  );
};

const getUserRoles = async (userId) => {
  const result = await pool.query(
    'SELECT role_id FROM user_roles WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((row) => row.role_id);
};

const assignRefreshTokenToUser = async (userId, refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [
    refreshToken,
    userId,
  ]);
};

module.exports = {
  findUserByUsername,
  createUser,
  assignRoleToUser,
  getUserRoles,
  assignRefreshTokenToUser,
};
