 const http = require("http");
 const fs = require("fs");
 const path = require("path");
 
 const PORT = 3001;
 
 const server = http.createServer((req, res) => {
   const pathname = req.url.split("?")[0];
 
   switch (pathname) {
     // Route "/"
     case "/":
       const filePathIndex = path.join(__dirname, "..", "files", "index.html");
 
       if (!fs.existsSync(filePathIndex)) {
         res.writeHead(500);
         return res.end("Fichier index.html introuvable");
       }
 
       const html = fs.readFileSync(filePathIndex, "utf8");
       res.writeHead(200, { "Content-Type": "text/html" });
       return res.end(html);
 
     //Route "/files"
   
case "/files": {
    const folderPath = path.join(__dirname, "..", "files");

    if (!fs.existsSync(folderPath)) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Dossier files introuvable");
    }

    const files = fs.readdirSync(folderPath);

    // Fonction pour choisir l'icône selon l'extension
    function getIconForFile(fileName) {
        const ext = path.extname(fileName).toLowerCase();

        switch (ext) {
            case ".txt":
                return "bi-file-text";
            case ".md":
                return "bi-file-earmark-richtext";
            case ".json":
                return "bi-braces";
            case ".js":
                return "bi-filetype-js";
            case ".html":
                return "bi-filetype-html";
            case ".css":
                return "bi-filetype-css";
            default:
                return "bi-file-earmark"; // icône par défaut
        }
    }

    // Génération de la liste
    const listItems = files
        .map(f => `
            <li class="list-group-item d-flex align-items-center gap-3">
                <i class="bi ${getIconForFile(f)} fs-4 text-secondary"></i>
                <a href="/file?name=${encodeURIComponent(f)}" class="text-decoration-none">
                    ${f}
                </a>
            </li>
        `)
        .join("");

    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Liste des fichiers</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    </head>
    <body class="bg-light p-4">

        <div class="container">

            <h1 class="mb-4 text-center"><i class="bi bi-folder"></i> Liste des fichiers</h1>

            <div class="d-flex justify-content-end mb-4">
                

                <a href="/form" class="btn btn-success">
                    <i class="bi bi-file-earmark-plus"></i> Créer un fichier
                </a>
            </div>

            <ul class="list-group shadow">
                ${listItems}
            </ul>

             <a
        href="/"
        class="btn btn-secondary position-fixed bottom-0 end-0 m-4 rounded shadow"
      >
        <i class="bi bi-house fs-4"></i>
      </a>

        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
}
     // Route "/file" /file?name=xxx
     case "/file": {
    if (req.method !== "GET") {
        res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Méthode non autorisée");
    }

    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    const fileName = queryParams.get("name");

    if (!fileName) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Paramètre '?name=' manquant");
    }

    const filePath = path.join(__dirname, "..", "files", fileName);

    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Fichier introuvable");
    }

    const content = fs.readFileSync(filePath, "utf8");

    // Détermine l’icône en fonction de l’extension
    function getIconForFile(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        switch (ext) {
            case ".txt":
                return "bi-file-text";
            case ".md":
                return "bi-file-earmark-richtext";
            case ".json":
                return "bi-braces";
            case ".js":
                return "bi-filetype-js";
            case ".html":
                return "bi-filetype-html";
            case ".css":
                return "bi-filetype-css";
            default:
                return "bi-file-earmark";
        }
    }

    const iconClass = getIconForFile(fileName);

    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Fichier - ${fileName}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    </head>
    <body class="bg-light p-4">

        <div class="container">

            <h1 class="mb-4 d-flex align-items-center gap-3">
                <i class="bi ${iconClass} fs-2"></i>
                ${fileName}
            </h1>

            <!-- Boutons navigation -->
            <div class="d-flex gap-2 mb-4">
                <a href="/" class="btn btn-secondary">
                    <i class="bi bi-house"></i> Accueil
                </a>
                <a href="/files" class="btn btn-primary">
                    <i class="bi bi-folder2-open"></i> Fichiers
                </a>
            </div>

            <!-- Contenu du fichier -->
            <div class="card shadow-sm">
                <div class="card-body">
                    <pre class="m-0" style="white-space: pre-wrap;">${content.replace(/</g, "&lt;")}</pre>
                </div>
            </div>

        </div>

    </body>
    </html>
    `;

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
}
 
     case "/form":
       const filePathForm = path.join(__dirname, "..", "files", "form.html");
       //Vérifier si le fichier existe
       if (!fs.existsSync(filePathForm)) {
         res.writeHead(500);
         return res.end("Fichier form.html introuvable");
       }
       //Lire le contenu du fichier form.html
       const formHtml = fs.readFileSync(filePathForm, "utf8");
       res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
       return res.end(formHtml);
 
     case "/submit":
       if (req.method !== "POST") {
         res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
         return res.end("Méthode non autorisée");
       }
       console.log(">>> ROUTE /submit détectée");
       // déclaration de la variable body pour accumuler les données reçues
       let body = "";
       // Accumuler les données reçues par morceaux chunk
       req.on("data", (chunk) => {
         body += chunk.toString();
       });
       // Une fois toutes les données reçues, les traiter
 
       req.on("end", () => {
         console.log("BODY REÇU =", body);
 
         const params = new URLSearchParams(body);
         const fileName = params.get("filename");
         const message = params.get("content");
         if (!fileName) {
           res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
           return res.end("Nom de fichier manquant");
         }
         // Construire le bon chemin vers /files/<filename>
         const filePath = path.join(__dirname, "..", "files", fileName);
         console.log(">>> CHEMIN FICHIER =", filePath);
         // Écrire le message dans le fichier
         fs.writeFileSync(filePath, message, "utf8");
         
         res.writeHead(302, { Location: "/" });
         
         return res.end();
       });
       return;
 
     default:
       res.writeHead(404);
       return res.end("Page inexistante");
   }
 });
 
 // Démarrer le serveur
 server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });
 
