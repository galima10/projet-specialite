DROP DATABASE IF EXISTS expenses_reports;

CREATE DATABASE expenses_reports;

USE expenses_reports;

DROP TABLE IF EXISTS expenses_documents;

DROP TABLE IF EXISTS expenses_lists;

DROP TABLE IF EXISTS infos_requests;

DROP TABLE IF EXISTS km_mileage_rates;

DROP TABLE IF EXISTS waiver_mileage_rates;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id_users INT UNIQUE NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  role ENUM('MEMBER', 'TREASURER', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
  PRIMARY KEY (id_users)
);

CREATE TABLE waiver_mileage_rates (
  id_waiver_mileage_rates INT UNIQUE NOT NULL AUTO_INCREMENT,
  label VARCHAR(100) NOT NULL,
  amount_per_km DECIMAL(7, 3) NOT NULL,
  PRIMARY KEY (id_waiver_mileage_rates)
);

CREATE TABLE km_mileage_rates (
  id_km_mileage_rates INT UNIQUE NOT NULL AUTO_INCREMENT,
  label VARCHAR(100) NOT NULL,
  amount_per_km DECIMAL(7, 3) NOT NULL,
  PRIMARY KEY (id_km_mileage_rates)
);

CREATE TABLE infos_requests (
  id_infos_requests INT UNIQUE NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reason TEXT NOT NULL,
  budget ENUM(
    "ADMINISTRATIVE",
    "LIBRARY",
    "EXPEDITION_EQUIPEMENT",
    "OTHER_EQUIPEMENT",
    "WEEKENDS_OUTINGS"
  ) NOT NULL DEFAULT "ADMINISTRATIVE",
  amount_waiver DECIMAL(7, 2),
  PRIMARY KEY (id_infos_requests)
);

ALTER TABLE
  infos_requests
ADD
  id_users INT NOT NULL;

ALTER TABLE
  infos_requests
ADD
  CONSTRAINT FK_UsersInfosRequests FOREIGN KEY (id_users) REFERENCES users(id_users) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE
  infos_requests
ADD
  id_km_mileage_rates INT;

ALTER TABLE
  infos_requests
ADD
  CONSTRAINT FK_KmMileageRatesInfosRequests FOREIGN KEY (id_km_mileage_rates) REFERENCES km_mileage_rates(id_km_mileage_rates) ON DELETE
SET
  NULL ON UPDATE CASCADE;

ALTER TABLE
  infos_requests
ADD
  id_waiver_mileage_rates INT;

ALTER TABLE
  infos_requests
ADD
  CONSTRAINT FK_WaiverMileageRatesInfosRequests FOREIGN KEY (id_waiver_mileage_rates) REFERENCES waiver_mileage_rates(id_waiver_mileage_rates) ON DELETE
SET
  NULL ON UPDATE CASCADE;

CREATE TABLE expenses_lists (
  id_expenses_lists INT UNIQUE NOT NULL AUTO_INCREMENT,
  expense_date DATE NOT NULL,
  expense_object VARCHAR(255) NOT NULL,
  kilometers DECIMAL(7, 2),
  transport_misc_cost DECIMAL(7, 2),
  others_cost DECIMAL(7, 2),
  PRIMARY KEY (id_expenses_lists)
);

ALTER TABLE
  expenses_lists
ADD
  id_infos_requests INT;

ALTER TABLE
  expenses_lists
ADD
  CONSTRAINT FK_InfosRequestsExpensesLists FOREIGN KEY (id_infos_requests) REFERENCES infos_requests(id_infos_requests) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE expenses_documents (
  id_expenses_documents INT UNIQUE NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  path_file VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_expenses_documents)
);

ALTER TABLE
  expenses_documents
ADD
  id_expenses_lists INT;

ALTER TABLE
  expenses_documents
ADD
  CONSTRAINT FK_ExpensesListsExpensesDocuments FOREIGN KEY (id_expenses_lists) REFERENCES expenses_lists(id_expenses_lists) ON DELETE CASCADE ON UPDATE CASCADE;