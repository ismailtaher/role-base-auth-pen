const pool = require('./db');

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};
module.exports = { testConnection };
