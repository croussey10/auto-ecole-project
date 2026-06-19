# 🚗 DriveConnect (SaaS Auto-École)

DriveConnect est une plateforme SaaS (Software as a Service) multi-écoles conçue pour digitaliser et simplifier la relation entre les élèves et leurs moniteurs d'auto-école.

## 🚀 1. Le Produit

Aujourd'hui, de nombreuses auto-écoles fonctionnent encore avec des processus papier, générant frustration pour les élèves et perte de temps pour les moniteurs. DriveConnect résout ce problème en proposant une plateforme centralisée et intuitive.

### Cibles et Proposition de valeur
* **Pour les Élèves :** Réservation d'heures de conduite en autonomie, suivi en temps réel du forfait (heures effectuées/restantes), et accès à un livret d'apprentissage 100% numérique.
* **Pour les Moniteurs :** Gestion simplifiée du planning, création de créneaux de disponibilité, évaluation dynamique des compétences des élèves embarqués, et ajout de feedbacks pédagogiques post-leçon.

## 🏗️ 2. Architecture Technique

Le projet repose sur une architecture moderne séparant clairement le client et la base de données.

* **Front-End : Angular 18**
  * Utilisation du nouveau moteur de réactivité (`Signals`, `computed`).
  * Utilisation de la nouvelle API `resource()` pour une gestion asynchrone native et optimisée des appels réseau et des états de chargement.
  * Composants UI implémentés via **PrimeNG** pour garantir un rendu professionnel et accessible.
* **Back-End (BaaS) & Base de Données : Supabase (PostgreSQL)**
  * Base de données relationnelle (PostgreSQL).
  * Authentification multi-tenant gérée nativement.
* **Sécurité & Résilience :**
  * Sécurité stricte appliquée directement au niveau de la base de données via **Row Level Security (RLS)** pour interdire tout accès ou modification non autorisés entre les rôles.

## ⚙️ 3. Prérequis & Installation Locale

Pour faire tourner le projet sur votre machine locale, vous aurez besoin de **Node.js** (v18+) et de **npm**.

1. **Cloner le dépôt :**
```bash
   git clone https://github.com/votre-nom/drive-connect.git
   cd drive-connect
   npm install
