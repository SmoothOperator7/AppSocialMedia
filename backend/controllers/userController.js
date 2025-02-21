const db = require("../config/db");

exports.updateUsername = (req, res) => {
    const userId = req.user.id; // on récupere l'ID de l'utilisateur connecté
    const { username } = req.body;

    if (!username || username.trim() === "") {
        return res.status(400).json({ error: "Le username ne peut pas être vide" });
    }

    db.query("UPDATE users SET username = ? WHERE id = ?", [username, userId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour du username :", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Username mis à jour avec succès" });
    });
};

exports.updateAvatar = (req, res) => {
    const userId = req.user.id; // ID de l'utilisateur 

    if (!req.file) {
        return res.status(400).json({ error: "Aucune image reçue. Vérifiez votre requête." });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    db.query("UPDATE users SET avatar = ? WHERE id = ?", [avatarPath, userId], (err) => {
        if (err) {
            console.error("Erreur mise à jour avatar :", err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Avatar mis à jour", avatar: avatarPath });
    });
};

exports.getUserProfil = (req, res) => {
    const userId = req.params.id;

    db.query("SELECT id, username, email, avatar FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération du profil :", err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.json(results[0]);
    });
};
