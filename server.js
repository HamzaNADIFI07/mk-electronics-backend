const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("emails.db");

// Création de la table si elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE
)`);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Servir le dossier public

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route pour l'inscription
app.post("/subscribe", (req, res) => {
  const email = req.body.email;

  if (!email) return res.send("Email invalide");

  db.run(
    "INSERT OR IGNORE INTO subscribers (email) VALUES (?)",
    [email],
    function (err) {
      if (err) {
        console.error(err);
        res.send("Erreur lors de l’enregistrement");
      } else {
        // ✅ Après inscription → rediriger vers subscription.html
        res.redirect("/subscription.html");
      }
    }
  );
});

// Lancer le serveur
app.listen(3100, () =>
  console.log("🚀 Serveur démarré sur http://localhost:3100")
);
