const express = require("express");
const { updateUsername, updateAvatar, getUserProfil } = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.put("/username", authenticateToken, updateUsername);
router.put("/avatar", authenticateToken, upload.single("avatar"), updateAvatar);
router.get("/:id", getUserProfil);

module.exports = router;
