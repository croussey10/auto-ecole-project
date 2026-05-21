-- =========================================================================

-- 1. ENUMS (Types personnalisés de données)

-- =========================================================================

CREATE TYPE user_role AS ENUM ('eleve', 'moniteur', 'admin');

CREATE TYPE niveau_maitrise AS ENUM ('A revoir', 'Moyen', 'Acquis');

CREATE TYPE type_document AS ENUM ('CNI', 'ANTS', 'Permis', 'Justificatif_Domicile');

CREATE TYPE statut_document AS ENUM ('En_attente', 'Valide', 'Refuse');

CREATE TYPE action_type AS ENUM ('AUTH_LOGIN', 'AUTH_REGISTER', 'RESERVATION_CREATE', 'RESERVATION_CANCEL', 'DOCUMENT_UPLOAD', 'DOCUMENT_VALIDATE', 'ROLE_UPDATE');



-- =========================================================================

-- 2. TABLES INDÉPENDANTES & GESTION DES SLUGS AUTOMATIQUES

-- =========================================================================

CREATE TABLE auto_ecole
(

  id         UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  nom        VARCHAR(100)                                                  NOT NULL CHECK (char_length(nom) >= 2),

  slug       VARCHAR(120) UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);



CREATE TABLE competence
(

  id         UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  nom        VARCHAR(100)                                                  NOT NULL CHECK (char_length(nom) >= 2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);


-- Fonction automatique pour les slugs (Ex: "La Chouette" -> "la-chouette")

CREATE
OR REPLACE FUNCTION generate_auto_ecole_slug()

RETURNS TRIGGER AS $$

BEGIN

    NEW.slug
:= LOWER(REGEXP_REPLACE(TRIM(NEW.nom), '\s+', '-', 'g'));

    NEW.updated_at
:= TIMEZONE('utc'::text, NOW());

RETURN NEW;

END;

$$
LANGUAGE plpgsql;



CREATE TRIGGER trigger_auto_ecole_slug

  BEFORE INSERT OR
UPDATE OF nom
ON auto_ecole
  FOR EACH ROW
  EXECUTE FUNCTION generate_auto_ecole_slug();



-- =========================================================================

-- 3. TABLES DÉPENDANTES D'AUTO_ECOLE

-- =========================================================================

CREATE TABLE forfait
(

  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,

  nom           VARCHAR(100)                                                  NOT NULL CHECK (char_length(nom) >= 2),

  prix          NUMERIC                                                       NOT NULL CHECK (prix >= 0),         -- Pas de prix négatif

  description   TEXT,

  nombre_heures INT                                                           NOT NULL CHECK (nombre_heures > 0), -- Un forfait a au moins 1 heure

  created_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);



-- =========================================================================

-- 4. LE PROFIL (Liaisons, Multi-tenant et Modèle Multi-Profils)

-- =========================================================================

CREATE TABLE profile
(

  id                UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  user_id           UUID REFERENCES auth.users (id) ON DELETE CASCADE             NOT NULL,

  auto_ecole_id     UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,

  forfait_id        UUID                                                          REFERENCES forfait (id) ON DELETE SET NULL,

  nom               VARCHAR(50)                                                   NOT NULL CHECK (char_length(nom) >= 2),

  prenom            VARCHAR(50)                                                   NOT NULL CHECK (char_length(prenom) >= 2),

  date_naissance    DATE,

  role              user_role                                                     NOT NULL DEFAULT 'eleve',

  heures_restantes  INT                      DEFAULT 0 CHECK (heures_restantes >= 0), -- Bouclier anti-heures négatives

  heures_effectuees INT                      DEFAULT 0 CHECK (heures_effectuees >= 0),

  created_at        TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE (user_id, auto_ecole_id)

);



-- =========================================================================

-- 5. CALENDRIER ET LIVRET D'APPRENTISSAGE (Sécurité Anti-Collisions)

-- =========================================================================

CREATE TABLE reservation
(

  id                   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  auto_ecole_id        UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,

  moniteur_id          UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,

  eleve_id             UUID                                                          REFERENCES profile (id) ON DELETE SET NULL,

  date_creneau         DATE                                                          NOT NULL,

  heure_debut          TIME                                                          NOT NULL,

  vehicule             VARCHAR(100),

  is_manuelle          BOOLEAN                  DEFAULT TRUE                         NOT NULL,

  is_reserved          BOOLEAN                  DEFAULT FALSE                        NOT NULL,

  commentaire_moniteur TEXT,

  created_at           TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,


  -- Anti-Collision : Un moniteur ne peut pas être à deux endroits en même temps

  CONSTRAINT moniteur_double_booking UNIQUE (moniteur_id, date_creneau, heure_debut),

  -- Anti-Collision : Un élève ne peut pas réserver deux cours sur le même créneau

  CONSTRAINT eleve_double_booking UNIQUE (eleve_id, date_creneau, heure_debut)

);



CREATE TABLE livret_apprentissage
(

  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  eleve_id      UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,

  competence_id UUID REFERENCES competence (id) ON DELETE CASCADE             NOT NULL,

  maitrise      niveau_maitrise                                               NOT NULL DEFAULT 'A revoir',

  created_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE (eleve_id, competence_id)

);



-- =========================================================================

-- 6. DOCUMENTS, COMPTABILITÉ ET AUDIT

-- =========================================================================

CREATE TABLE document
(

  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,

  user_id       UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,

  type_doc      type_document                                                 NOT NULL,

  statut        statut_document                                               NOT NULL DEFAULT 'En_attente',

  fichier_url   TEXT                                                          NOT NULL, -- On laisse en TEXT car les URL de stockage peuvent être très longues

  date_upload   TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);



CREATE TABLE chat_historique
( -- Anciennement achat_historique (Correction faute de frappe mineure)

  id              UUID PRIMARY KEY                                           DEFAULT gen_random_uuid(),

  auto_ecole_id   UUID REFERENCES auto_ecole (id) ON DELETE CASCADE NOT NULL,

  eleve_id        UUID REFERENCES profile (id) ON DELETE CASCADE    NOT NULL,

  forfait_id      UUID                                              REFERENCES forfait (id) ON DELETE SET NULL,

  prix_paye       NUMERIC                                           NOT NULL CHECK (prix_paye >= 0),

  statut_paiement VARCHAR(30)                                       NOT NULL DEFAULT 'Complete',

  date_achat      TIMESTAMP WITH TIME ZONE                                   DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);



CREATE TABLE log_action
(

  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),

  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,

  user_id       UUID                                                          REFERENCES profile (id) ON DELETE SET NULL,

  action        action_type                                                   NOT NULL,

  details       TEXT                                                          NOT NULL,

  created_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);



-- =========================================================================

-- 7. L'AUTOMATISATION DES HEURES (Trigger)

-- =========================================================================

CREATE
OR REPLACE FUNCTION update_heures_eleve()

RETURNS TRIGGER AS $$

BEGIN

  -- Cas 1 : Réservation d'un créneau (crédit débité)

  IF
(OLD.eleve_id IS NULL AND NEW.eleve_id IS NOT NULL) THEN

    -- On vérifie d'abord si l'élève a assez d'heures (Double sécurité)

    IF (SELECT heures_restantes FROM profile WHERE id = NEW.eleve_id) < 1 THEN

        RAISE EXCEPTION 'Solde d''heures insuffisant pour effectuer cette réservation.';

END IF;



UPDATE profile

SET heures_restantes = heures_restantes - 1

WHERE id = NEW.eleve_id;

END IF;



  -- Cas 2 : Annulation d'un créneau (crédit rendu)

  IF
(OLD.eleve_id IS NOT NULL AND NEW.eleve_id IS NULL) THEN

UPDATE profile

SET heures_restantes = heures_restantes + 1

WHERE id = OLD.eleve_id;

END IF;



  -- On met à jour la date de modification de la leçon automatiquement

  NEW.updated_at
:= TIMEZONE('utc'::text, NOW());

RETURN NEW;

END;

$$
LANGUAGE plpgsql;



CREATE TRIGGER trigger_reservation_heures

  AFTER UPDATE
  ON reservation

  FOR EACH ROW
  EXECUTE FUNCTION update_heures_eleve();
