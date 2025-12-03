const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

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
    case "/files":
      // route /files
      // Lister les fichiers du dossier "files"
      const folderPath = path.join(__dirname, "..", "files");
      if (!fs.existsSync(folderPath)) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Dossier files introuvable");
      }
      // Lire les fichiers dans le dossier "files"
      const files = fs.readdirSync(folderPath);
      res.writeHead(200, {
        "Content-Type": "application/json",
        Charset: "utf-8",
      });
      return res.end(JSON.stringify(files));
   
    // Route "/file" /file?name=xxx
    case "/file":
      if (req.method !== "GET") {
        res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Méthode non autorisée");
      }
      const queryParams = new URLSearchParams(req.url.split("?")[1]);
      const fileName = queryParams.get("name");
      if (!fileName) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Paramètre '?name=' manquant dans l'url");
      }

      const filePath = path.join(__dirname, "..", "files", fileName);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Fichier introuvable");
      }
      const fileContent = fs.readFileSync(filePath);
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(fileContent);

      return;

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
