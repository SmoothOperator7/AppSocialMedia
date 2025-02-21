const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Définir le dossier d'upload
const uploadDir = path.join(__dirname, "../uploads");

// vérifie si le dossier existe, sinon le créer
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + fileExt);
    }
});

// Filtre des formats fichiers
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non supporté. Seuls JPEG, PNG et GIF sont autorisés."), false);
    }
};

// Taille limite du fichier (2MB)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;
