-- =========================================================================
-- JEU D'ESSAI (FIXTURES) POUR DRIVEFLOW
-- =========================================================================

-- 1. INSERTION DES AUTO-ECOLES (Les slugs vont se générer tout seuls via le trigger !)
INSERT INTO auto_ecole (nom)
VALUES ('La Chouette');
INSERT INTO auto_ecole (nom)
VALUES ('Auto Ecole du Centre');

-- 2. INSERTION DES COMPETENCES DU LIVRET A RAISON D'ETRE (Partagées par toutes les écoles)
INSERT INTO competence (nom)
VALUES ('Maîtriser le véhicule à allure lente');
INSERT INTO competence (nom)
VALUES ('Circuler dans des conditions normales');
INSERT INTO competence (nom)
VALUES ('Circuler dans des conditions difficiles (Autoroute)');
INSERT INTO competence (nom)
VALUES ('Pratiquer une conduite autonome et écologique');

-- 3. RECUPERATION DES ID POUR LES ETAPES SUIVANTES (Utilisation de variables ou sous-requêtes)
-- Pour simplifier le script, on va insérer directement en utilisant des sous-requêtes SELECT.

-- 4. INSERTION DES FORFAITS
INSERT INTO forfait (auto_ecole_id, nom, prix, description, nombre_heures)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        'Forfait Initial 20h',
        1190.00,
        'Le pack classique pour débuter sereinement avec code inclus.',
        20);

INSERT INTO forfait (auto_ecole_id, nom, prix, description, nombre_heures)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        'Conduite Accompagnée AAC',
        1350.00,
        'Idéal dès 15 ans, inclut les rendez-vous pédagogiques.',
        20);

INSERT INTO forfait (auto_ecole_id, nom, prix, description, nombre_heures)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'Auto Ecole du Centre'),
        'Pack Accéléré 10h',
        650.00,
        'Pour ceux qui ont déjà échoué à l''examen et veulent se remettre à niveau rapidement.',
        10);

-- =========================================================================
-- 5. INSERTION DES PROFILS (Liaison directe avec l'Auth Supabase)
-- =========================================================================

-- PROFIL 1 : Sébastien (Admin de "La Chouette")
INSERT INTO profile (id, user_id, auto_ecole_id, nom, prenom, role)
VALUES (gen_random_uuid(),
        '24dca03d-b5b1-4ae4-90a8-57c045a891b6', -- Vrai UID de sebastien-rouget@admin.com
        (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        'Rouget', 'Sébastien', 'admin');

-- PROFIL 2 : Jean (Moniteur chez "La Chouette")
INSERT INTO profile (id, user_id, auto_ecole_id, nom, prenom, role)
VALUES (gen_random_uuid(),
        '3205d1ed-480f-4b8e-bf99-3390b947776b', -- Vrai UID de jean-pavois@moniteur.com
        (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        'Pavois', 'Jean', 'moniteur');

-- PROFIL 3 : Clément (Élève chez "La Chouette" avec le Forfait Initial)
INSERT INTO profile (id, user_id, auto_ecole_id, forfait_id, nom, prenom, date_naissance, role, heures_restantes,
                     heures_effectuees)
VALUES (gen_random_uuid(),
        '6c162bdd-fed8-46bf-af72-34dabe611a32', -- Vrai UID de clement-martin@eleve.com
        (SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM forfait WHERE nom = 'Forfait Initial 20h'),
        'Martin', 'Clément', '2010-04-12', 'eleve', 18, 2);

-- PROFIL 4 : Marie (Élève chez "Auto Ecole du Centre")
INSERT INTO profile (id, user_id, auto_ecole_id, forfait_id, nom, prenom, date_naissance, role, heures_restantes,
                     heures_effectuees)
VALUES (gen_random_uuid(),
        '8e8eb41c-236e-4023-a00f-1ce39dec3ffe', -- Vrai UID de marie-dubois@eleve.com
        (SELECT id FROM auto_ecole WHERE nom = 'Auto Ecole du Centre'),
        (SELECT id FROM forfait WHERE nom = 'Pack Accéléré 10h'),
        'Dubois', 'Marie', '2008-09-23', 'eleve', 10, 0);

-- =========================================================================
-- 6. INSERTION DU PLANNING ET DES RESERVATIONS
-- =========================================================================

-- Créneau 1 : Une leçon DÉJÀ effectuée et passée (Pour alimenter l'historique de Clément)
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved, commentaire_moniteur)
VALUES ((SELECT auto_ecole_id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'),
        CURRENT_DATE - INTERVAL '2 days',
        '10:00:00',
        'Clio 5 - Noire',
        TRUE,
        TRUE,
        'Bonne maîtrise de l''embrayage, attention aux contrôles d''angle mort en tournant.');

-- Créneau 2 : Un créneau de libre ouvert par Jean (Disponible à la réservation)
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved)
VALUES ((SELECT auto_ecole_id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Jean'),
        NULL,
        CURRENT_DATE + INTERVAL '1 day',
        '14:00:00',
        'Clio 5 - Noire',
        TRUE,
        FALSE);

-- Créneau 3 : Un créneau futur déjà réservé par Clément pour la semaine prochaine
INSERT INTO reservation (auto_ecole_id, moniteur_id, eleve_id, date_creneau, heure_debut, vehicule, is_manuelle,
                         is_reserved)
VALUES ((SELECT auto_ecole_id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Jean'),
        (SELECT id FROM profile WHERE prenom = 'Clément'),
        CURRENT_DATE + INTERVAL '5 days',
        '11:00:00',
        'Clio 5 - Noire',
        TRUE,
        TRUE);

-- =========================================================================
-- 7. LIVRET D'APPRENTISSAGE & LOGS D'AUDIT
-- =========================================================================

-- Initialisation des notes de Clément pour ses compétences
INSERT INTO livret_apprentissage (eleve_id, competence_id, maitrise)
VALUES ((SELECT id FROM profile WHERE prenom = 'Clément'),
        (SELECT id FROM competence WHERE nom = 'Maîtriser le véhicule à allure lente'),
        'Moyen');

INSERT INTO livret_apprentissage (eleve_id, competence_id, maitrise)
VALUES ((SELECT id FROM profile WHERE prenom = 'Clément'),
        (SELECT id FROM competence WHERE nom = 'Circuler dans des conditions normales'),
        'A revoir');

-- Quelques faux logs
INSERT INTO log_action (auto_ecole_id, user_id, action, details)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM profile WHERE prenom = 'Sébastien'),
        'ROLE_UPDATE',
        'L''administrateur Sébastien Rouget a validé le rôle de moniteur pour Jean Pavois.');

INSERT INTO log_action (auto_ecole_id, user_id, action, details)
VALUES ((SELECT id FROM auto_ecole WHERE nom = 'La Chouette'),
        (SELECT id FROM profile WHERE prenom = 'Clément'),
        'RESERVATION_CREATE',
        'L''élève Clément Martin a réservé un créneau de conduite pour le ' ||
        (CURRENT_DATE + INTERVAL '5 days')::TEXT || ' à 11:00.');
