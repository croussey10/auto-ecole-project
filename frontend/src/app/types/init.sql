-- =========================================================================
-- 1. ENUMS (Types personnalisés de données)
-- =========================================================================

CREATE TYPE user_role AS ENUM ('eleve', 'moniteur', 'admin');
CREATE TYPE niveau_maitrise AS ENUM ('A revoir', 'Moyen', 'Acquis', 'Neutre');
CREATE TYPE type_document AS ENUM ('CNI', 'ANTS', 'Permis', 'Justificatif_Domicile');
CREATE TYPE statut_document AS ENUM ('En_attente', 'Valide', 'Refuse');
CREATE TYPE action_type AS ENUM ('AUTH_LOGIN', 'AUTH_REGISTER', 'RESERVATION_CREATE', 'RESERVATION_CANCEL', 'DOCUMENT_UPLOAD', 'DOCUMENT_VALIDATE', 'ROLE_UPDATE');
CREATE TYPE categorie_maitrise AS ENUM ('Maîtriser', 'Appréhender', 'Pratiquer', 'Circuler');

-- =========================================================================
-- 2. TABLES INDÉPENDANTES & GESTION DES SLUGS AUTOMATIQUES
-- =========================================================================

CREATE TABLE auto_ecole
(
  id         UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  nom        VARCHAR(100)                                                  NOT NULL CHECK (char_length(nom) >= 2),
  slug       VARCHAR(120) UNIQUE                                           NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE competence
(
  id         UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  nom        VARCHAR(100)                                                  NOT NULL CHECK (char_length(nom) >= 2),
  category   categorie_maitrise,
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
  FOR EACH ROW EXECUTE FUNCTION generate_auto_ecole_slug();

-- =========================================================================
-- 3. TABLES DÉPENDANTES D'AUTO_ECOLE
-- =========================================================================

CREATE TABLE forfait
(
  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,
  nom           VARCHAR(100)                                                  NOT NULL CHECK (char_length(nom) >= 2),
  prix          NUMERIC                                                       NOT NULL CHECK (prix >= 0),
  description   TEXT,
  nombre_heures INT                                                           NOT NULL CHECK (nombre_heures > 0),
  is_forfait    BOOLEAN                  DEFAULT FALSE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 4. LE PROFIL
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
  role              user_role                DEFAULT 'eleve'                      NOT NULL,
  heures_restantes  INT                      DEFAULT 0                            NOT NULL CHECK (heures_restantes >= 0),
  heures_effectuees INT                      DEFAULT 0 CHECK (heures_effectuees >= 0),
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT profile_user_id_auto_ecole_id_key UNIQUE (user_id, auto_ecole_id)
);

-- =========================================================================
-- 5. CALENDRIER ET LIVRET D'APPRENTISSAGE
-- =========================================================================

CREATE TABLE reservation
(
  id                   UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  auto_ecole_id        UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,
  moniteur_id          UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,
  eleve_id             UUID                                                          REFERENCES profile (id) ON DELETE SET NULL,
  date_creneau         DATE                                                          NOT NULL,
  heure_debut          TIME WITHOUT TIME ZONE                                        NOT NULL,
  vehicule             VARCHAR(100),
  is_manuelle          BOOLEAN                  DEFAULT TRUE                         NOT NULL,
  is_reserved          BOOLEAN                  DEFAULT FALSE                        NOT NULL,
  commentaire_moniteur TEXT,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT moniteur_double_booking UNIQUE (moniteur_id, date_creneau, heure_debut),
  CONSTRAINT eleve_double_booking UNIQUE (eleve_id, date_creneau, heure_debut)
);

CREATE TABLE livret_apprentissage
(
  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,
  eleve_id      UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,
  competence_id UUID REFERENCES competence (id) ON DELETE CASCADE             NOT NULL,
  maitrise      niveau_maitrise          DEFAULT 'Neutre'                     NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT livret_apprentissage_eleve_id_competence_id_key UNIQUE (eleve_id, competence_id)
);

-- =========================================================================
-- 6. DOCUMENTS, COMPTABILITÉ ET AUDIT
-- =========================================================================

CREATE TABLE document
(
  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,
  profile_id    UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,
  type_doc      type_document                                                 NOT NULL,
  statut        statut_document          DEFAULT 'En_attente'                 NOT NULL,
  fichier_url   TEXT                                                          NOT NULL,
  date_upload   TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE achat_historique
(
  id              UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  auto_ecole_id   UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,
  eleve_id        UUID REFERENCES profile (id) ON DELETE CASCADE                NOT NULL,
  forfait_id      UUID                                                          REFERENCES forfait (id) ON DELETE SET NULL,
  prix_paye       NUMERIC                                                       NOT NULL CHECK (prix_paye >= 0),
  statut_paiement VARCHAR(30)              DEFAULT 'Complete'                   NOT NULL,
  date_achat      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  forfait_nom     VARCHAR(100)             DEFAULT 'Forfait inconnu'            NOT NULL,
  forfait_heures  INT                      DEFAULT 0                            NOT NULL
);

CREATE TABLE log_action
(
  id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
  auto_ecole_id UUID REFERENCES auto_ecole (id) ON DELETE CASCADE             NOT NULL,
  profile_id    UUID                                                          REFERENCES profile (id) ON DELETE SET NULL,
  action        action_type                                                   NOT NULL,
  details       TEXT                                                          NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 7. TRIGGERS & VUES AVANCÉES
-- =========================================================================

-- Trigger de gestion des heures robuste (Gère les INSERT ET les UPDATE en sécurité)
CREATE
OR REPLACE FUNCTION update_heures_eleve()
RETURNS TRIGGER AS $$
BEGIN
  -- Mise à jour automatique de updated_at
  NEW.updated_at
:= TIMEZONE('utc'::text, NOW());

  IF
TG_OP = 'INSERT' THEN
    IF NEW.eleve_id IS NOT NULL THEN
      IF (SELECT heures_restantes FROM profile WHERE id = NEW.eleve_id) < 1 THEN
        RAISE EXCEPTION 'Solde d''heures insuffisant pour effectuer cette réservation.';
END IF;
UPDATE profile
SET heures_restantes = heures_restantes - 1
WHERE id = NEW.eleve_id;
END IF;

  ELSIF
TG_OP = 'UPDATE' THEN
    -- L'élève vient de réserver un créneau libre ou remplace quelqu'un d'autre
    IF OLD.eleve_id IS DISTINCT FROM NEW.eleve_id THEN

      -- Débit du nouvel élève
      IF NEW.eleve_id IS NOT NULL THEN
        IF (SELECT heures_restantes FROM profile WHERE id = NEW.eleve_id) < 1 THEN
          RAISE EXCEPTION 'Solde d''heures insuffisant pour effectuer cette réservation.';
END IF;
UPDATE profile
SET heures_restantes = heures_restantes - 1
WHERE id = NEW.eleve_id;
END IF;

      -- Remboursement de l'ancien élève
      IF
OLD.eleve_id IS NOT NULL THEN
UPDATE profile
SET heures_restantes = heures_restantes + 1
WHERE id = OLD.eleve_id;
END IF;

END IF;
END IF;

RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_reservation_heures
  BEFORE INSERT OR
UPDATE ON reservation
  FOR EACH ROW EXECUTE FUNCTION update_heures_eleve();

-- =========================================================================
-- 8. VUES (Avec Security Invoker pour préserver les RLS)
-- =========================================================================

CREATE VIEW public.view_livret_competence
  WITH (security_invoker = true) AS
SELECT l.id,
       l.auto_ecole_id,
       l.eleve_id,
       l.competence_id,
       c.nom      AS competence_nom,
       c.category AS categorie,
       l.maitrise
FROM livret_apprentissage l
       JOIN competence c ON l.competence_id = c.id;

CREATE VIEW public.view_reservation
  WITH (security_invoker = true) AS
SELECT r.id,
       r.eleve_id,
       eleve.prenom    AS eleve_prenom,
       eleve.nom       AS eleve_nom,
       r.moniteur_id,
       moniteur.prenom AS moniteur_prenom,
       moniteur.nom    AS moniteur_nom,
       r.commentaire_moniteur,
       r.auto_ecole_id,
       r.date_creneau,
       r.heure_debut,
       r.vehicule,
       r.is_manuelle,
       r.is_reserved
FROM reservation r
       JOIN profile moniteur ON r.moniteur_id = moniteur.id
       LEFT JOIN profile eleve ON r.eleve_id = eleve.id;
