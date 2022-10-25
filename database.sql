-- To create the database:

-- 1. Create a new user by the name of "enigma" with password "password"
-- 2. Switch to this user
-- 3. Create a new database by the name of "register"
-- 4. Connect to the database and create the tables users, tevents and ievents

-- CREATE TABLE users
-- (id BIGSERIAL PRIMARY KEY NOT NULL,
-- name VARCHAR(200) NOT NULL,
-- email VARCHAR(200) NOT NULL,
-- username VARCHAR(200) NOT NULL,
-- password VARCHAR(200) NOT NULL,
-- pincode INTEGER NOT NULL,
-- city VARCHAR(200) NOT NULL,
-- insti VARCHAR(200) NOT NULL,
-- yos VARCHAR(200) NOT NULL,
-- gender VARCHAR(200) NOT NULL,
-- phno BIGINT NOT NULL,
-- wapp BIGINT NOT NULL,
-- insta VARCHAR(200),
-- fb VARCHAR(200),
-- UNIQUE(email,username));

-- CREATE TABLE tevents
-- (id BIGSERIAL PRIMARY KEY NOT NULL,
-- username VARCHAR(200) NOT NULL,
-- tname VARCHAR(200) NOT NULL,
-- tleader VARCHAR(200) NOT NULL,
-- tmember INTEGER NOT NULL,
-- teamevent VARCHAR(200) NOT NULL)

-- CREATE TABLE ievents
-- (id BIGSERIAL PRIMARY KEY NOT NULL,
-- username VARCHAR(200) NOT NULL,
-- indevent VARCHAR(200) NOT NULL)