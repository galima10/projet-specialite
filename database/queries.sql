INSERT
  IGNORE INTO users (name, email)
VALUES
  ('User1', NULL);

UPDATE
  users
SET
  name = 'Utilisateur 1',
  email = 'utilisateur.1@gmail.com'
WHERE
  id_users = 1;

UPDATE
  users
SET
  role = 'TREASURER'
WHERE
  id_users = 1;

SELECT
  *
FROM
  users;

---------------------------------------------------------------------------
INSERT
  IGNORE INTO infos_requests (
    reason,
    budget,
    amount_waiver,
    id_users,
    id_km_mileage_rates,
    id_waiver_mileage_rates
  )
VALUES
  (
    'Raison 1',
    'ADMINISTRATIVE',
    NULL,
    1,
    NULL,
    NULL
  );

SELECT * FROM infos_requests;
--------------------------------------------------