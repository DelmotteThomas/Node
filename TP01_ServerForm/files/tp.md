#  Serveur HTTP complet avec formulaire**

## Objectifs

* Servir une page HTML d’accueil (`/`)
* Lister les fichiers du dossier `/data` (`/files`)
* Lire le contenu d’un fichier (`/file?name=xxx`)
* Afficher un formulaire HTML (`/form`)
* Enregistrer les données du formulaire dans `./data` (`/submit`, POST)

---



# **Fonctionnalités opérationnelles**

| Route            | Méthode | Description                                  |
| ---------------- | ------- | -------------------------------------------- |
| `/`              | GET     | Page d’accueil                               |
| `/files`         | GET     | JSON : liste des fichiers du dossier `data/` |
| `/file?name=xxx` | GET     | Lire le contenu du fichier                   |
| `/form`          | GET     | Formulaire HTML pour créer un fichier        |
| `/submit`        | POST    | Traitement du formulaire et enregistrement   |

---

# Tests rapides

1. Lancer :

   ```bash
   node server/index.js
   ```

2. Ouvrir :

   * [http://localhost:3000](http://localhost:3000)
   * [http://localhost:3000/form](http://localhost:3000/form)
   * [http://localhost:3000/files](http://localhost:3000/files)

3. Créer un fichier via le formulaire

4. Vérifier qu’il apparaît dans `./data`

5. Lire via `/file?name=...`
