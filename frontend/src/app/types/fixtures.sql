-- =========================================================================
-- 1. AUTO-ECOLES
-- =========================================================================
INSERT INTO auto_ecole (nom)
VALUES ('La Chouette');
INSERT INTO auto_ecole (nom)
VALUES ('Le Centre');

-- =========================================================================
-- 2. LE RÉFÉRENTIEL DE COMPÉTENCES OFFICIEL
-- =========================================================================

INSERT INTO competence (nom, category)
VALUES
  -- Catégorie : Maîtriser le maniement du véhicule
  ('Entrer, s''installer au poste de conduite et en sortir', 'Maîtriser'),
  ('Connaître les organes, commandes et faire les vérifications', 'Maîtriser'),
  ('Avoir des notions sur l''entretien et le dépannage', 'Maîtriser'),
  ('Diriger la voiture en avant en ligne droite et en courbe', 'Maîtriser'),
  ('Regarder autour de soi et avertir', 'Maîtriser'),
  ('Effectuer une marche arrière et un demi-tour en sécurité', 'Maîtriser'),
  ('Démarrer et s''arrêter', 'Maîtriser'),
  ('Tenir, tourner le volant et maintenir la trajectoire', 'Maîtriser'),
  ('Utiliser la boîte de vitesses', 'Maîtriser'),
  ('Doser l''accélération et le freinage à diverses allures', 'Maîtriser'),

  -- Catégorie : Appréhender la route
  ('Rechercher la signalisation, les indices et en tenir compte', 'Appréhender'),
  ('Positionner le véhicule et choisir la voie de circulation', 'Appréhender'),
  ('Adapter l''allure aux situations', 'Appréhender'),
  ('Évaluer et maintenir les distances de sécurité', 'Appréhender'),
  ('Détecter et franchir les intersections selon la priorité', 'Appréhender'),
  ('Tourner à droite et à gauche en agglomération', 'Appréhender'),
  ('Franchir les ronds-points et carrefours à sens giratoire', 'Appréhender'),

  -- Catégorie : Pratiquer une conduite sûre
  ('Croiser, dépasser, être dépassé', 'Pratiquer'),
  ('Passer des virages et conduire en déclivité', 'Pratiquer'),
  ('Connaître les facteurs de risque et recommandations', 'Pratiquer'),
  ('Expérimenter les aides à la conduite (régulateur, ABS...)', 'Pratiquer'),
  ('Comportements en cas d''accident: protéger, alerter, secourir', 'Pratiquer'),
  ('Conduire quand l''adhérence et la visibilité sont réduites', 'Pratiquer'),
  ('Connaître les autres usagers et se comporter avec courtoisie', 'Pratiquer'),

  -- Catégorie : Circuler dans des conditions complexes
  ('S''insérer, circuler et sortir d''une voie rapide', 'Circuler'),
  ('Conduire dans une file de véhicules et circulation dense', 'Circuler'),
  ('S''arrêter et stationner en épi, en bataille et en créneau', 'Circuler'),
  ('Préparer et effectuer un voyage longue distance', 'Circuler'),
  ('Pratiquer l''écoconduite', 'Circuler'),
  ('Suivre un itinéraire de manière autonome', 'Circuler');

-- =========================================================================
-- 3. FORFAITS (Massifs et variés)
-- =========================================================================
-- Pour "La Chouette"
INSERT INTO forfait (auto_ecole_id, nom, prix, description, nombre_heures, is_forfait)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Forfait Permis B 20h', 1190.00,
        'Le pack classique pour débuter sereinement avec code inclus.', 20, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Conduite Accompagnée AAC', 1350.00,
        'Idéal dès 15 ans, inclut les rendez-vous pédagogiques.', 20, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Pack 5 Heures Perf', 250.00,
        'Heures de perfectionnement avant l''examen.', 5, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Heure à la carte', 55.00,
        'Heure de conduite supplémentaire à l''unité.', 1, FALSE);

-- Pour "Le Centre"
INSERT INTO forfait (auto_ecole_id, nom, prix, description, nombre_heures, is_forfait)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), 'Pack Accéléré 30h', 1650.00,
        'Permis en 1 mois chrono. Formation intensive.', 30, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), 'Forfait Etudiant 20h', 1050.00,
        'Tarif réduit sur présentation de la carte étudiante.', 20, TRUE);

-- =========================================================================
-- 4. PROFILS (Avec TOUS les vrais UID Auth)
-- =========================================================================

-- 🦉 ÉQUIPE "LA CHOUETTE"
-- Admin
INSERT INTO profile (user_id, auto_ecole_id, nom, prenom, role)
VALUES ('7af99f86-27de-45fb-a1c0-eb5402c8046c', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Rouget',
        'Sébastien', 'admin');

-- Moniteurs
INSERT INTO profile (user_id, auto_ecole_id, nom, prenom, role)
VALUES ('3205d1ed-480f-4b8e-bf99-3390b947776b', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Pavois', 'Jean',
        'moniteur'),
       ('a1f17afa-02d6-4991-8c93-a67c4c76f050', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Rorustre',
        'Fabienne', 'moniteur'),
       ('b61cdeab-e0c3-4cd6-87dd-63a3bcc5b894', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), 'Corneil',
        'Jamal', 'moniteur');

-- Élèves (On leur donne 40 à 50 heures pour encaisser les réservations du trigger)
INSERT INTO profile (user_id, auto_ecole_id, forfait_id, nom, prenom, date_naissance, role, heures_restantes,
                     heures_effectuees)
VALUES ('6c162bdd-fed8-46bf-af72-34dabe611a32', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM forfait WHERE nom = 'Forfait Permis B 20h'), 'Martin', 'Clément', '2004-05-12', 'eleve', 45,
        15),
       ('7c49ba52-983a-42ac-9f86-e6a4bc2e4aa8', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM forfait WHERE nom = 'Conduite Accompagnée AAC'), 'Petit', 'Camille', '2008-02-28', 'eleve', 30,
        8),
       ('f9197ddc-4a63-4095-b519-42883be36b5a', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM forfait WHERE nom = 'Forfait Permis B 20h'), 'Bloit', 'Inès', '2002-11-05', 'eleve', 35, 2),
       ('f0c7c666-51a4-4cc1-9369-1ff3eaf148f9', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM forfait WHERE nom = 'Pack 5 Heures Perf'), 'Poinsel', 'Mathis', '1999-07-19', 'eleve', 20, 25),
       ('a1cdea38-a6ee-44b3-bac6-ea25d6d84d69', (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), NULL, 'Sanchez',
        'Pedro', '2000-09-01', 'eleve', 15, 30);

-- 🏢 ÉQUIPE "LE CENTRE"
-- Admin
INSERT INTO profile (user_id, auto_ecole_id, nom, prenom, role)
VALUES ('0610cb43-e3e9-4989-952a-326d8e856a7a', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), 'Neumard',
        'Chiara', 'admin');

-- Moniteurs
INSERT INTO profile (user_id, auto_ecole_id, nom, prenom, role)
VALUES ('3c1b3ca8-a462-4f21-a78e-3602f49d09e2', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), 'Diakite',
        'Ibrahima', 'moniteur'),
       ('b402c51b-d600-44c8-8a2f-3d0186c2468a', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), 'Dialo', 'Patrick',
        'moniteur');

-- Élèves
INSERT INTO profile (user_id, auto_ecole_id, forfait_id, nom, prenom, date_naissance, role, heures_restantes,
                     heures_effectuees)
VALUES ('e161443f-8892-47c1-a2f0-8d886ac7eaec', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'),
        (SELECT id FROM forfait WHERE nom = 'Pack Accéléré 30h'), 'Lagneau', 'Eva', '2003-12-14', 'eleve', 30, 0),
       ('bba8f89a-833d-41bb-9baf-293e79e772fe', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'),
        (SELECT id FROM forfait WHERE nom = 'Pack Accéléré 30h'), 'Akkus', 'Juliette', '2001-08-08', 'eleve', 40, 10),
       ('8e8eb41c-236e-4023-a00f-1ce39dec3ffe', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'),
        (SELECT id FROM forfait WHERE nom = 'Forfait Etudiant 20h'), 'Dubois', 'Marie', '2005-04-22', 'eleve', 20, 5),
       ('825e1dc4-afb1-4c30-9210-67bde34b49d3', (SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), NULL,
        'Perriocompte', 'Valentin', '1998-01-30', 'eleve', 15, 12);

-- =========================================================================
-- 5. HISTORIQUE D'ACHATS
-- =========================================================================
INSERT INTO achat_historique (auto_ecole_id, eleve_id, forfait_id, prix_paye, forfait_nom, forfait_heures, date_achat)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
        (SELECT id FROM forfait WHERE nom = 'Forfait Permis B 20h'), 1190.00, 'Forfait Permis B 20h', 20,
        CURRENT_DATE - INTERVAL '60 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Mathis'),
        (SELECT id FROM forfait WHERE nom = 'Pack 5 Heures Perf'), 250.00, 'Pack 5 Heures Perf', 5,
        CURRENT_DATE - INTERVAL '15 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Mathis'),
        (SELECT id FROM forfait WHERE nom = 'Heure à la carte'), 55.00, 'Heure à la carte', 1,
        CURRENT_DATE - INTERVAL '2 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), (SELECT id FROM profile WHERE prenom = 'Eva'),
        (SELECT id FROM forfait WHERE nom = 'Pack Accéléré 30h'), 1650.00, 'Pack Accéléré 30h', 30,
        CURRENT_DATE - INTERVAL '5 days');

-- =========================================================================
-- 6. LE PLANNING GIGACHAD (Réservations passées, présentes, futures)
-- =========================================================================

-- 🕰️ LE PASSÉ DE CLÉMENT & JEAN
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved, commentaire_moniteur)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE - INTERVAL '20 days', '10:00:00',
        'Clio 5 - Noire', TRUE, TRUE, '1ère heure : Découverte de l''habitacle et réglages. Très attentif.'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE - INTERVAL '17 days', '14:00:00',
        'Clio 5 - Noire', TRUE, TRUE,
        'Départ et arrêt. Tendance à caler, il faut trouver le point de patinage plus doucement.'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE - INTERVAL '14 days', '09:00:00',
        'Clio 5 - Noire', TRUE, TRUE, 'Beaucoup mieux sur la boîte de vitesse. On a commencé à tourner le volant.'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE - INTERVAL '10 days', '16:00:00',
        'Clio 5 - Noire', TRUE, TRUE, 'Insertion sur route à 80km/h. Bon dynamisme mais oubli du clignotant une fois.'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Fabienne'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE - INTERVAL '7 days', '11:00:00',
        'Peugeot 208 - Blanche', TRUE, TRUE,
        'Remplacement de Jean. Élève sérieux. Les ronds-points sont bien abordés.'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE - INTERVAL '3 days', '13:00:00',
        'Clio 5 - Noire', TRUE, TRUE,
        'Travail sur le créneau droit. Presque parfait, attention à la distance avec le trottoir.');

-- 🕰️ LE PASSÉ DES AUTRES ÉLÈVES
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved, commentaire_moniteur)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jamal'),
        (SELECT id FROM profile WHERE prenom = 'Camille'), CURRENT_DATE - INTERVAL '2 days', '15:00:00', 'C3 - Grise',
        TRUE, TRUE, 'Séance AAC : Les parents étaient présents. Conduite fluide.'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Pedro'), CURRENT_DATE - INTERVAL '1 days', '08:00:00', 'Clio 5 - Noire',
        TRUE, TRUE, 'Derniers réglages avant le permis la semaine pro. C''est du solide.');

-- 📅 AUJOURD'HUI : LA JOURNÉE DE JEAN EST BLINDÉE
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Inès'), CURRENT_DATE, '08:00:00', 'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE, '09:00:00', 'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'), NULL,
        CURRENT_DATE, '10:00:00', 'Clio 5 - Noire', TRUE, FALSE), -- Dispo ce matin !
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Mathis'), CURRENT_DATE, '11:00:00', 'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Camille'), CURRENT_DATE, '14:00:00', 'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Pedro'), CURRENT_DATE, '15:00:00', 'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'), NULL,
        CURRENT_DATE, '16:00:00', 'Clio 5 - Noire', TRUE, FALSE), -- Dispo ce soir
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Fabienne'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE, '14:00:00', 'Peugeot 208 - Auto', FALSE, TRUE);

-- 🚀 LE FUTUR : PLANNING DES PROCHAINES SEMAINES
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'), NULL,
        CURRENT_DATE + INTERVAL '1 day', '09:00:00', 'Clio 5 - Noire', TRUE, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE + INTERVAL '1 day', '10:00:00',
        'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jamal'), NULL,
        CURRENT_DATE + INTERVAL '1 day', '14:00:00', 'C3 - Grise', TRUE, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE + INTERVAL '3 days', '14:00:00',
        'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Inès'), CURRENT_DATE + INTERVAL '3 days', '15:00:00', 'Clio 5 - Noire',
        TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'), NULL,
        CURRENT_DATE + INTERVAL '3 days', '16:00:00', 'Clio 5 - Noire', TRUE, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'), CURRENT_DATE + INTERVAL '8 days', '10:00:00',
        'Clio 5 - Noire', TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Fabienne'), NULL,
        CURRENT_DATE + INTERVAL '8 days', '11:00:00', 'Peugeot 208 - Auto', FALSE, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'), NULL,
        CURRENT_DATE + INTERVAL '9 days', '14:00:00', 'Clio 5 - Noire', TRUE, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'), NULL,
        CURRENT_DATE + INTERVAL '10 days', '08:00:00', 'Clio 5 - Noire', TRUE, FALSE);

-- Un peu d'activité chez "Le Centre"
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), (SELECT id FROM profile WHERE prenom = 'Ibrahima'),
        (SELECT id FROM profile WHERE prenom = 'Eva'), CURRENT_DATE + INTERVAL '1 day', '13:00:00', 'Clio 4 - Blanche',
        TRUE, TRUE),
       ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), (SELECT id FROM profile WHERE prenom = 'Ibrahima'), NULL,
        CURRENT_DATE + INTERVAL '1 day', '14:00:00', 'Clio 4 - Blanche', TRUE, FALSE),
       ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), (SELECT id FROM profile WHERE prenom = 'Patrick'),
        (SELECT id FROM profile WHERE prenom = 'Juliette'), CURRENT_DATE + INTERVAL '2 days', '09:00:00',
        'Peugeot 208 - Rouge', TRUE, TRUE);

-- =========================================================================
-- 7. LIVRET D'APPRENTISSAGE GIGACHAD SUR TES VRAIES COMPÉTENCES EN BASE
-- =========================================================================

-- Livret de Clément (On utilise l'orthographe EXACTE de ton fichier CSV)
INSERT INTO livret_apprentissage (auto_ecole_id, eleve_id, competence_id, maitrise)
VALUES
  -- ACQUIS (Il maîtrise les bases)
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Entrer, s''installer au poste de conduite et en sortir'), 'Acquis'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Connaître les organes, commandes et faire les vérifications'), 'Acquis'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Démarrer et s''arrêter'), 'Acquis'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Tenir, tourner le volant et maintenir la trajectoire'), 'Acquis'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Diriger la voiture en avant en ligne droite et en courbe'), 'Acquis'),

  -- MOYEN (Il est en train d'apprendre)
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Utiliser la boîte de vitesses'), 'Moyen'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Regarder autour de soi et avertir'), 'Moyen'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Adapter l''allure aux situations'), 'Moyen'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Rechercher la signalisation, les indices et en tenir compte'), 'Moyen'),

  -- A REVOIR (Les trucs un peu plus durs)
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Évaluer et maintenir les distances de sécurité'), 'A revoir'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'Croiser, dépasser, être dépassé'), 'A revoir'),
  ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
   (SELECT id FROM competence WHERE nom = 'S''arrêter et stationner en épi, en bataille et en créneau'), 'A revoir');

-- Livret de Pedro (Prêt pour l'examen)
INSERT INTO livret_apprentissage (auto_ecole_id, eleve_id, competence_id, maitrise)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Pedro'),
        (SELECT id FROM competence WHERE nom = 'Entrer, s''installer au poste de conduite et en sortir'), 'Acquis'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Pedro'),
        (SELECT id FROM competence WHERE nom = 'S''insérer, circuler et sortir d''une voie rapide'), 'Acquis'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Pedro'),
        (SELECT id FROM competence WHERE nom = 'S''arrêter et stationner en épi, en bataille et en créneau'), 'Acquis'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Pedro'),
        (SELECT id FROM competence WHERE nom = 'Suivre un itinéraire de manière autonome'), 'Acquis');


-- =========================================================================
-- 8. LOGS D'ACTION MASSIFS
-- =========================================================================
INSERT INTO log_action (auto_ecole_id, profile_id, action, details, created_at)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Sébastien'),
        'ROLE_UPDATE', 'L''administrateur a validé l''inscription de Inès Bloit.', CURRENT_DATE - INTERVAL '15 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
        'RESERVATION_CREATE', 'Clément Martin a réservé un créneau avec Jean Pavois.',
        CURRENT_DATE - INTERVAL '14 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Jean'),
        'RESERVATION_CREATE', 'Jean Pavois a ouvert 5 nouveaux créneaux pour la semaine prochaine.',
        CURRENT_DATE - INTERVAL '10 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Pedro'),
        'RESERVATION_CANCEL', 'Pedro Sanchez a annulé son créneau à plus de 48h.', CURRENT_DATE - INTERVAL '5 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Sébastien'),
        'DOCUMENT_VALIDATE', 'L''admin a validé la pièce d''identité de Clément Martin.',
        CURRENT_DATE - INTERVAL '2 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'Le Centre'), (SELECT id FROM profile WHERE prenom = 'Chiara'),
        'AUTH_LOGIN', 'Connexion au dashboard administrateur.', CURRENT_DATE - INTERVAL '1 days'),
       ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'), (SELECT id FROM profile WHERE prenom = 'Clément'),
        'AUTH_LOGIN', 'Connexion de l''élève depuis l''application mobile.', CURRENT_DATE);
