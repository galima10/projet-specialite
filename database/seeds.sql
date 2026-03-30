INSERT
  IGNORE INTO waiver_mileage_rates (label, amount_per_km)
VALUES
  ('Voiture 3 CV et moins', 0.529),
  ('Voiture 4 CV', 0.606),
  ('Voiture 5 CV', 0.636),
  ('Voiture 6 CV', 0.665),
  ('Voiture 7 CV et plus', 0.697),
  ('Moto 1 & 2 CV', 0.395),
  ('Moto 3, 4 et 5 CV', 0.468),
  ('Moto 6 CV et plus', 0.606);

INSERT
  IGNORE INTO km_mileage_rates (label, amount_per_km)
VALUES
  (
    'Frais kilométriques pour voiture - conducteur tout seul',
    0.360
  ),
  (
    'Frais kilométriques pour voiture - covoiturage ou chargée de matériel, condamnant l’usage à des passagers',
    0.400
  ),
  (
    'Frais kilométriques moto supérieur ou égal à 125cc',
    0.140
  );

SELECT
  *
FROM
  waiver_mileage_rates;

SELECT
  *
FROM
  km_mileage_rates;