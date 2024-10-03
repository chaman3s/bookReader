import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [highlightedText, setHighlightedText] = useState('');
  const [color, setColor] = useState('#FFFF00'); // Default color yellow
  const [documentId, setDocumentId] = useState('DOCUMENT_ID'); // Replace with actual document ID
  const [notes, setNotes] = useState([]);

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const position = {
        start: window.getSelection().anchorOffset,
        end: window.getSelection().focusOffset,
      };
      const page = 1; // Assume page 1 for now
      setHighlightedText({ text: selectedText, position, page });
    }
  };

  const saveNote = async () => {
    try {
      const response = await axios.post('http://localhost:5000/note', {
        documentId,
        text: highlightedText.text,
        color,
        position: highlightedText.position,
        page: highlightedText.page,
      });
      setNotes([...notes, response.data]);
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <h1>Book Viewer</h1>
      <p>Select text in this document to highlight and save as a note.</p>

      {highlightedText.text && (
        <div>
          <strong>Highlighted Text:</strong> {highlightedText.text}
          <div>
            <label>Choose Color: </label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <button onClick={saveNote}>Save Note</button>
        </div>
      )}

      <div>
        <h2>Saved Notes</h2>
        {notes.map((note) => (
          <div key={note._id} style={{ backgroundColor: note.color }}>
            {note.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
