const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const ROOT = path.join(__dirname, "..", "files");

/* -------------------------------------------------------------------------- */
/*                              Helpers / Utils                               */
/* -------------------------------------------------------------------------- */

// Icônes Bootstrap 5 selon extension
function getIcon(ext) {
  const icons = {
    ".txt": "bi-file-text",
    ".md": "bi-file-earmark-richtext",
    ".json": "bi-braces",
    ".js": "bi-filetype-js",
    ".html": "bi-filetype-html",
    ".css": "bi-filetype-css",
  };
  return icons[ext] || "bi-file-earmark";
}

// Template wrapper HTML
function pageTemplate(title, content) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  </head>
  <body class="bg-light p-4">
      <div class="container">
          ${content}
      </div>
  </body>
  </html>
  `;
}

/* -------------------------------------------------------------------------- */
/*                               ROUTES HANDLERS                               */
/* -------------------------------------------------------------------------- */

// Page d’accueil
function renderHome(req, res) {
  const indexPath = path.join(ROOT, "index.html");
  if (!fs.existsSync(indexPath)) {
    res.writeHead(500);
    return res.end("Fichier index.html introuvable");
  }
  const html = fs.readFileSync(indexPath, "utf8");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

// Liste des fichiers
function renderFiles(req, res) {
  if (!fs.existsSync(ROOT)) {
    res.writeHead(500);
    return res.end("Dossier files introuvable");
  }

  const files = fs.readdirSync(ROOT);

  const list = files
    .map((file) => {
      const icon = getIcon(path.extname(file).toLowerCase());
      return `
        <li class="list-group-item d-flex align-items-center gap-3">
          <i class="bi ${icon} fs-4 text-secondary"></i>
          <a href="/file?name=${encodeURIComponent(file)}" class="text-decoration-none">
            ${file}
          </a>
        </li>
      `;
    })
    .join("");

  const html = pageTemplate(
    "Liste des fichiers",
    `
    <h1 class="mb-4 text-center"><i class="bi bi-folder"></i> Liste des fichiers</h1>

    <div class="d-flex justify-content-end mb-4">
      <a href="/form" class="btn btn-success">
        <i class="bi bi-file-earmark-plus"></i> Créer un fichier
      </a>
    </div>

    <ul class="list-group shadow">
      ${list}
    </ul>

    <a href="/" class="btn btn-secondary position-fixed bottom-0 end-0 m-4 rounded shadow">
      <i class="bi bi-house fs-4"></i>
    </a>
  `
  );

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

// Affichage d’un fichier
function renderFile(req, res) {
  const query = new URLSearchParams(req.url.split("?")[1]);
  const fileName = query.get("name");

  if (!fileName) {
    res.writeHead(400);
    return res.end("Paramètre '?name=' manquant");
  }

  const filePath = path.join(ROOT, fileName);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end("Fichier introuvable");
  }

  const content = fs.readFileSync(filePath, "utf8");
  const icon = getIcon(path.extname(fileName).toLowerCase());

  const html = pageTemplate(
    `Fichier ${fileName}`,
    `
    <h1 class="mb-4 d-flex align-items-center gap-3">
      <i class="bi ${icon} fs-2"></i> ${fileName}
    </h1>

    <div class="d-flex gap-2 mb-4">
      <a href="/" class="btn btn-secondary"><i class="bi bi-house"></i> Accueil</a>
      <a href="/files" class="btn btn-primary"><i class="bi bi-folder2-open"></i> Fichiers</a>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <pre style="white-space: pre-wrap;">${content.replace(/</g, "&lt;")}</pre>
      </div>
    </div>
  `
  );

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

// Formulaire de création fichier
function renderForm(req, res) {
  const formPath = path.join(ROOT, "form.html");
  if (!fs.existsSync(formPath)) {
    res.writeHead(500);
    return res.end("Fichier form.html introuvable");
  }
  const html = fs.readFileSync(formPath, "utf8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

// Traitement POST /submit
function submitForm(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));

  req.on("end", () => {
    const params = new URLSearchParams(body);
    const fileName = params.get("filename");
    const content = params.get("content");

    if (!fileName) {
      res.writeHead(400);
      return res.end("Nom de fichier manquant");
    }

    const filePath = path.join(ROOT, fileName);

    fs.writeFileSync(filePath, content, "utf8");

    res.writeHead(302, { Location: "/files" });
    res.end();
  });
}

/* -------------------------------------------------------------------------- */
/*                              SERVER / ROUTER                                */
/* -------------------------------------------------------------------------- */

const server = http.createServer((req, res) => {
  const route = req.url.split("?")[0];

  if (route === "/") return renderHome(req, res);
  if (route === "/files") return renderFiles(req, res);
  if (route === "/file") return renderFile(req, res);
  if (route === "/form") return renderForm(req, res);
  if (route === "/submit") {
    if (req.method === "POST") return submitForm(req, res);
    res.writeHead(405);
    return res.end("Méthode non autorisée");
  }

  res.writeHead(404);
  res.end("Page inexistante");
});

/* -------------------------------------------------------------------------- */

server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
