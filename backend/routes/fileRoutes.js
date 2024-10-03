
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/save-notes', (req, res) => {
    const { bookTitle, chapter, notes } = req.body;

    const dirPath = path.join(__dirname, 'user_notes', bookTitle, chapter);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, 'notes.txt');
    fs.writeFileSync(filePath, notes);

    res.status(200).json({ message: 'Notes saved successfully!' });
});

module.exports = router;
