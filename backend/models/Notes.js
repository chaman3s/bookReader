const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Document',
  },
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#FFFF00', // default to yellow
  },
  position: {
    start: Number,
    end: Number,
  },
  page: Number,
});

module.exports = mongoose.model('Note', NoteSchema);
