
-- Drop tables if they exist (to avoid errors during rerun)
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    refresh_token TEXT
);

-- Create roles table
CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Create permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Create products table (manipulated according to roles/permissions)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

INSERT INTO products (id, name, price) VALUES
(1, 'Tea', 200.00),
(2, 'Coffee', 300.00),
(3, 'Soda', 100.00);

INSERT INTO roles (id, name) VALUES
(5150, 'Admin'),
(1984, 'Editor'),
(2001, 'User');

INSERT INTO permissions (id, name) VALUES
(1, 'GET'),
(2, 'POST'),
(3, 'PUT'),
(4, 'DELETE');

INSERT INTO role_permissions (role_id, permission_id) VALUES
(5150, 1),
(5150, 2),
(5150, 3),
(5150, 4),
(1984, 1),
(1984, 2),
(1984, 3),
(2001, 1);
