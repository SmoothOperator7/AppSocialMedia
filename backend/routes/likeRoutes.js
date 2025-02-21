const express = require("express");
const { toggleLike, getLikes, getUserLikeStatus } = require("../controllers/likeController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, toggleLike);
router.get("/count/:post_id", getLikes);
router.get("/status/:post_id", authenticateToken, getUserLikeStatus);

module.exports = router;
