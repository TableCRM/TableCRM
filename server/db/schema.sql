DROP DATABASE IF EXISTS table_crm;
CREATE DATABASE table_crm;
USE table_crm;

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Schema
* * * * * * * * * * * * * * * * * * * * * * * * * * */

CREATE TABLE opportunities (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50),
  description text(255),
  pipeline varchar(7) DEFAULT 'Sales',
  estimatedValue int,
  winProbability int,
  priority varchar(6),
  status varchar(9) DEFAULT 'Open',
  stage varchar(13) DEFAULT 'Qualified',
  expectedCloseDate date,
  closeDate date,
  lostReason varchar(14),
  origin varchar(9),
  createdAt timestamp DEFAULT NOW(),
  updatedAt timestamp DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE contacts (
  id int NOT NULL AUTO_INCREMENT,
  firstName varchar(50),
  lastName varchar(50),
  suffix varchar(20),
  title varchar(50),
  department varchar(255),
  description varchar(255),
  email varchar(255),
  workPhoneNumber varchar(25),
  personalPhoneNumber varchar(25),
  createdAt timestamp DEFAULT NOW(),
  updatedAt timestamp DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id)
  /*,accountId int,*/
  /*FOREIGN KEY (accountId) REFERENCES opportunities (contactPersonId)*/
);
CREATE TABLE leads (
  id int NOT NULL AUTO_INCREMENT,
  ownerId int,
  description varchar(255),
  firstName varchar(50),
  lastName varchar(50),
  suffix varchar(20),
  title varchar(50),
  value int,
  email varchar(255),
  phoneNumber varchar(255),
  createdAt timestamp DEFAULT NOW(),
  updatedAt timestamp DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE accounts (
  id int NOT NULL AUTO_INCREMENT,
  description text(255),
  industryID int,
  email varchar(60),
  phoneNumber varchar(15),
  street varchar(120),
  city varchar(20),
  state varchar(15),
  postalCode varchar(7),
  country varchar(20),
  website varchar(120),
  createdAt timestamp DEFAULT NOW(),
  updatedAt timestamp DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE leadsColumns (
  id int NOT NULL AUTO_INCREMENT,
  rank int,
  name varchar(50),
  hidden boolean DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE contactsColumns (
  id int NOT NULL AUTO_INCREMENT,
  rank int,
  name varchar(50),
  hidden boolean DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE accountsColumns (
  id int NOT NULL AUTO_INCREMENT,
  rank int,
  name varchar(50),
  hidden boolean DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE opportunitiesColumns (
  id int NOT NULL AUTO_INCREMENT,
  rank int,
  name varchar(50),
  hidden boolean DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE opportunity_contact (
  contactID int,
  opportunityID int,
  PRIMARY KEY (contactID)
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Actual Data
* * * * * * * * * * * * * * * * * * * * * * * * * * */

INSERT INTO leadsColumns (rank, name) VALUES
(0, 'id'),
(1, 'firstName'),
(2, 'lastName'),
(3, 'suffix'),
(4, 'title'),
(5, 'value'),
(6, 'email'),
(7, 'phoneNumber'),
(8, 'description'),
(9, 'createdAt'),
(10, 'ownerId');

INSERT INTO contactsColumns (rank, name) VALUES
(0, 'contactId'),
(1, 'opportunityID'),
(2, 'name'),
(3, 'firstName'),
(4, 'lastName'),
(5, 'suffix'),
(6, 'title'),
(7, 'department'),
(8, 'description'),
(9, 'email'),
(10, 'workPhoneNumber'),
(11, 'personalPhoneNumber'),
(12, 'createdAt'),
(13, 'updatedAt');

INSERT INTO accountsColumns (rank, name) VALUES
(0, 'id'),
(1, 'description'),
(2, 'industryID'),
(3, 'email'),
(4, 'phoneNumber'),
(5, 'street'),
(6, 'city'),
(7, 'state'),
(8, 'postalCode'),
(9, 'country'),
(10, 'website'),
(11, 'createdAt'),
(12, 'updatedAt');

INSERT INTO opportunitiesColumns (rank, name) VALUES
(0, 'id'),
(1, 'name'),
(2, 'description'),
(3,'pipeline'),
(4, 'estimatedValue'),
(5, 'winProbability'),
(6, 'priority'),
(7, 'status'),
(8, 'stage'),
(9, 'expectedCloseDate'),
(10, 'lostReason'),
(11, 'origin'),
(12, 'createdAt'),
(13, 'updatedAt');
/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Dummy Data
* * * * * * * * * * * * * * * * * * * * * * * * * * */
--
-- DELIMITER //
-- CREATE PROCEDURE `inset_accounts`()
-- BEGIN
--   DECLARE i int DEFAULT 1;
--   WHILE i <= 200 DO
--     SET i = i + 1;
--     INSERT INTO accounts (description, email, phoneNumber, street, city, state, postalCode, country, website) VALUES
--     ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website');
--   END WHILE;
-- END //
--
-- CALL `inset_accounts`();
--
-- -- INSERT INTO accounts (description, email, phoneNumber, street, city, state, postalCode, country, website) VALUES
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website'),
-- -- ('description', 'email', 'phoneNumber', 'street', 'city', 'state', '98072', 'country', 'website');
--
-- CREATE PROCEDURE `inset_leads`()
-- BEGIN
--   DECLARE i int DEFAULT 1;
--   WHILE i <= 200 DO
--     SET i = i + 1;
--     INSERT INTO leads (description, firstName, lastName, suffix, title, value, email, phoneNumber, ownerId) VALUES ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1);
--   END WHILE;
-- END //
--
-- CALL `inset_leads`();
--
-- -- INSERT INTO leads (description, firstName, lastName, suffix, title, value, email, phoneNumber, ownerId) VALUES
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
-- -- ('description', 'firstName', 'lastName', 'suffix', 'title', 10000000, 'hi@masato.io', 0001112222, 1),
--
-- CREATE PROCEDURE `inset_opportunities`()
-- BEGIN
--   DECLARE i int DEFAULT 1;
--   WHILE i <= 20 DO
--     SET i = i + 1;
--     INSERT INTO opportunities (name, description, estimatedValue, winProbability, expectedCloseDate) VALUES
--     ('retail pricing app', 'Entrepreneur Rachel just got funding and is looking to add more features to her app.', 50000, 80, '2017-12-31'),
--     ('contractor work with Apple', 'Their design team is looking to outsource for a period of 2-3 months.', 60000, 50, '2017-11-15'),
--     ('recruitment app', 'Steve is looking for a technical cofounder. Prior experience with two startups that got sold.', 210000, 75, '2017-12-1'),
--     ('IT support', 'Connection at MIT; not so exicting, but will wait to hear more update from Allen.', 210000, 30, '2017-12-1'),
--     ('contractor work with Google', 'Started conversation with Debby. Pending response from Jessica.', 200000, 30, '2017-12-9'),
--     ('teaching assistance application', 'software engineering role', 15000, 30, '2017-11-30');
--   END WHILE;
-- END //
--
-- CALL `inset_opportunities`();
--
-- -- INSERT INTO opportunities (name, description, estimatedValue, winProbability, expectedCloseDate) VALUES
-- -- ('retail pricing app', 'Entrepreneur Rachel just got funding and is looking to add more features to her app.', 50000, 80, '2017-12-31'),
-- -- ('contractor work with Apple', 'Their design team is looking to outsource for a period of 2-3 months.', 60000, 50, '2017-11-15'),
-- -- ('recruitment app', 'Steve is looking for a technical cofounder. Prior experience with two startups that got sold.', 210000, 75, '2017-12-1'),
-- -- ('IT support', 'Connection at MIT; not so exicting, but will wait to hear more update from Allen.', 210000, 30, '2017-12-1'),
-- -- ('contractor work with Google', 'Started conversation with Debby. Pending response from Jessica.', 200000, 30, '2017-12-9'),
-- -- ('teaching assistance application', 'software engineering role', 15000, 30, '2017-11-30');
--
-- CREATE PROCEDURE `inset_contacts`()
-- BEGIN
--   DECLARE i int DEFAULT 1;
--   WHILE i <= 20 DO
--     SET i = i + 1;
--     INSERT INTO contacts (firstName, lastName, suffix, title, department, description, email, workPhoneNumber, personalPhoneNumber, createdAt) VALUES
--     ('John','Jones','Mr.','Sales Manager','Sales','text1','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 02:18:22'),
--     ('Sarah','Jones','Mrs.','Sales Coordinator','Sales','text2','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 04:20:22'),
--     ('Larry','David','Mr.','Sales Manager','Sales','text3','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 04:18:22'),
--     ('Sam','Johnson','Miss','Account Executive','Sales','text4','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 04:18:23'),
--     ('Adam','Wills','Mr.','Vice President','Sales','text5','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 08:18:22'),
--     ('Janet','Stone','Mrs.','CEO','Sales','text6','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 05:18:22');
--   END WHILE;
-- END //
--
-- CALL `inset_contacts`();
--
-- -- INSERT INTO contacts (firstName, lastName, suffix, title, department, description, email, workPhoneNumber, personalPhoneNumber, createdAt) VALUES
-- -- ('John','Jones','Mr.','Sales Manager','Sales','text1','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 02:18:22'),
-- -- ('Sarah','Jones','Mrs.','Sales Coordinator','Sales','text2','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 04:20:22'),
-- -- ('Larry','David','Mr.','Sales Manager','Sales','text3','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 04:18:22'),
-- -- ('Sam','Johnson','Miss','Account Executive','Sales','text4','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 04:18:23'),
-- -- ('Adam','Wills','Mr.','Vice President','Sales','text5','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 08:18:22'),
-- -- ('Janet','Stone','Mrs.','CEO','Sales','text6','yasaman109@gmail.com','4082041351','4082041351','2017-11-04 05:18:22');
