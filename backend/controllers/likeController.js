const db = require("../config/db");

exports.toggleLike = (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.id;

    // Vérifier si l'utilisateur a déjà liké le post
    db.query("SELECT * FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            // Si le like existe, on le supprime (unlike)
            db.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.status(200).json({ message: "Like supprimé" });
            });
        } else {
            // Sinon, on ajoute un like
            db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [user_id, post_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.status(201).json({ message: "Like ajouté" });
            });
        }
    });
};

exports.getLikes = (req, res) => {
    const { post_id } = req.params;

    db.query("SELECT COUNT(*) AS total_likes FROM likes WHERE post_id = ?", [post_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

exports.getUserLikeStatus = (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;

    db.query("SELECT * FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ liked: results.length > 0 });
    });
};
