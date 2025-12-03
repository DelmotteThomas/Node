// Import du module HTTP de Node.js
const http = require('http');

// Import du module 'fs' pour la gestion des fichiers
const fs = require('fs');

// Import du module 'path' pour la gestion des chemins de fichiers
const path = require('path');

// Import du module 'url' pour la gestion des URLs
const url = require('url');

// Définition du port d'écoute
const PORT = 3000;



// Création du serveur HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Route pour la page d'accueil
    // --

    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        // Lecture du fichier HTML pour la page d'accueil
        const filepath = path.join(__dirname, '..', 'views', 'pages', 'homepage.html');
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        
        // Envoi de la réponse 200 avec le contenu du fichier HTML
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(fileContent);

        return;
    }


    // Route pour la liste des fichiers
    // --

    if (parsedUrl.pathname === '/files' && req.method === 'GET') {

        // Lecture du contenu du repertoire "data"
        const dataDir = path.join(__dirname, '..', 'data');
        const files = fs.readdirSync(dataDir);
        
        // Génération de la liste des fichiers en HTML
        let fileListHTML = '<ul>';
        files.forEach(file => {
            fileListHTML += `<li><a href="/file?name=${file}">${file}</a></li>`;
        });
        fileListHTML += '</ul>';


        // Lecture du fichier HTML pour la liste des fichiers
        const filepath = path.join(__dirname, '..', 'views', 'pages', 'files.html');
        let fileContent = fs.readFileSync(filepath, 'utf-8');

        // Insertion de la liste des fichiers dans le contenu HTML
        fileContent = fileContent.replace('{{ filesList }}', fileListHTML);
        

        // Envoi de la réponse 200 avec le contenu du fichier HTML
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(fileContent);

        return;
    }


    // Route pour la lecture d'un fichier
    // --

    // req.url === '/file'
    // req.url === '/file?name=monfichier.txt'
    if (parsedUrl.pathname === '/file' && req.method === 'GET') {

        // Récupération du nom du fichier depuis les paramètres de l'URL
        const name = parsedUrl.query.name;

        // Verification de la présence du paramètre 'name'
        if (!name) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bad Request: missing "name" query parameter.');
            return;
        }

        const inputFilePath = path.join(__dirname, '..', 'data', name);
        
        // Verification de l'existence du fichier
        if (!fs.existsSync(inputFilePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('File not found.');
            return;
        }

        // Lecture du contenu du fichier demandé
        const fileData = fs.readFileSync(inputFilePath, 'utf-8');

        // Lecture du fichier HTML pour la page de lecture d'un fichier
        const filepath = path.join(__dirname, '..', 'views', 'pages', 'file.html');
        let fileContent = fs.readFileSync(filepath, 'utf-8');
        
        // Ajout du contenu du fichier dans le HTML
        fileContent = fileContent.replace('{{ fileName }}', name);
        fileContent = fileContent.replace('{{ fileContent }}', `<pre>${fileData}</pre>`);

        // Envoi de la réponse 200 avec le contenu du fichier HTML
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(fileContent);

        return;
    }


    // Route pour la création d'un fichier (affichage formulaire)
    // --

    if (parsedUrl.pathname === '/form' && req.method === 'GET') {
        // Lecture du fichier HTML pour la page de formulaire
        const filepath = path.join(__dirname, '..', 'views', 'pages', 'form.html');
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        
        // Envoi de la réponse 200 avec le contenu du fichier HTML
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(fileContent);

        return;
    }


    // Route pour la création d'un fichier (traitement formulaire)
    // --

    // if (req.url === '/submit') {
    if (parsedUrl.pathname === '/form' && req.method === 'POST') {

        let body = '';

        // Récupération des données du formulaire
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedBody = new URLSearchParams(body);

            // Récupération du nom du fichier
            const fileName = parsedBody.get('filename');

            // Récupération du contenu du fichier
            const fileContent = parsedBody.get('content');

            // Sauvegarde du fichier dans le répertoire "data"
            const outputFilePath = path.join(__dirname, '..', 'data', fileName);
            fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
        });


        
        // Lecture du fichier HTML pour la page de traitement du formulaire
        const filepath = path.join(__dirname, '..', 'views', 'pages', 'submit.html');
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        
        // Envoi de la réponse 200 avec le contenu du fichier HTML
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(fileContent);

        return;
    }


    // Route par défaut (404)
    // -- 

    // Lecture du fichier HTML pour la page 404
    const filepath = path.join(__dirname, '..', 'views', 'errors', 'error_404.html');
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    
    // Envoi de la réponse 404 avec le contenu du fichier HTML
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end(fileContent);
});



// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Serveur démarré  http://localhost:${PORT}`);
});