const pool = require('../config/db');

const verifyPermissions = () => {
  return async (req, res, next) => {
    try {
      const roles = req.roles;
      const method = req.method.toUpperCase();

      if (!Array.isArray(roles) || roles.length === 0) {
        return res.sendStatus(403); // No roles means no access
      }

      const query = `SELECT DISTINCT p.name as permission
                    FROM role_permissions rp
                    JOIN permissions p ON rp.permission_id = p.id
                    WHERE rp.role_id = ANY($1)`;
      const { rows } = await pool.query(query, [roles]);

      const permissions = rows.map((row) => row.permission);

      console.log(`User: ${req.user} Method: ${method}`);
      console.log(`User permissions:`, permissions);

      if (!permissions.includes(method)) {
        return res.sendStatus(403); // Forbidden
      }

      next();
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  };
};

module.exports = verifyPermissions;
