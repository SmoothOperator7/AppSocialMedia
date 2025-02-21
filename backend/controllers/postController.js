const db = require("../config/db");

exports.createPost = (req, res) => {
    const { content, image } = req.body;
    const user_id = req.user.id;

    db.query(
        "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)",
        [user_id, content, image || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Post ajouté avec succès", postId: result.insertId });
        }
    );
};

exports.getAllPosts = (req, res) => {
    db.query(
        "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC",
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};

exports.deletePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    db.query("SELECT user_id FROM posts WHERE id = ?", [postId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Post non trouvé" });

        if (results[0].user_id !== userId) {
            return res.status(403).json({ error: "Vous ne pouvez supprimer que vos propres posts" });
        }

        db.query("DELETE FROM posts WHERE id = ?", [postId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: "Post supprimé avec succès" });
        });
    });
};

exports.updatePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content, image } = req.body;

    db.query("SELECT user_id FROM posts WHERE id = ?", [postId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Post non trouvé" });

        if (results[0].user_id !== userId) {
            return res.status(403).json({ error: "Vous ne pouvez modifier que vos propres posts" });
        }

        db.query("UPDATE posts SET content = ?, image = ? WHERE id = ?", [content, image || null, postId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: "Post mis à jour avec succès" });
        });
    });
};
