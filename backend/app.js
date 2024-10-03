const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Note = require('./models/Note');
const Document = require('./models/Document');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookview', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in "uploads" directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  }
});
const upload = multer({ storage });

// Routes for file upload
app.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const newDocument = new Document({
      name: req.file.originalname,
      path: req.file.path,
    });
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading document' });
  }
});

// Route to add a new note
app.post('/note', async (req, res) => {
  const { documentId, text, color, position, page } = req.body;

  try {
    const newNote = new Note({
      documentId,
      text,
      color,
      position,
      page,
    });

    const savedNote = await newNote.save();
    const document = await Document.findById(documentId);
    document.notes.push(savedNote._id);
    await document.save();

    res.status(201).json(savedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving note' });
  }
});

// Route to get notes for a specific document
app.get('/notes/:documentId', async (req, res) => {
  try {
    const notes = await Note.find({ documentId: req.params.documentId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Route for translation
app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const response = await axios.post('https://translation.googleapis.com/language/translate/v2', null, {
      params: {
        q: text,
        target: targetLang,
        key: process.env.GoogleTranslateKey,
      },
    });

    const translatedText = response.data.data.translations[0].translatedText;
    res.status(200).json({ translatedText });
  } catch (err) {
    console.error('Error translating text:', err);
    res.status(500).json({ message: 'Error translating text' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
