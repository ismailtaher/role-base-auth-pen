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

module.exports = { findUserByUsername, createUser, assignRoleToUser };
