const express = require("express");
const { createPost, getAllPosts, deletePost, updatePost } = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createPost);
router.get("/", getAllPosts);
router.delete("/:id", authenticateToken, deletePost);
router.put("/:id", authenticateToken, updatePost);

module.exports = router;
