const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File Filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(new Error("Types of files allowed are .jpeg, .jpg, .png"), false);
        }
    }
});

// Upload Route
router.post("/uploadFile", upload.single('file'), (req, res) => {
    res.json({ "fileName": req.file.filename });
});

// Download Route
const downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    res.download(filePath);
}

router.get("/files/:filename", downloadFile);

module.exports = router;
