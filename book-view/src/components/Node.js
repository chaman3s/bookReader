import React, { useState } from 'react';

const Notes = () => {
    const [notes, setNotes] = useState([]);

    const addNote = (highlightedText) => {
        const newNote = {
            text: highlightedText,
            color: 'yellow' // This can be dynamic later
        };
        setNotes([...notes, newNote]);
    };

    return (
        <div className="notes-section">
            <h2>Notes</h2>
            <ul>
                {notes.map((note, index) => (
                    <li key={index} style={{ backgroundColor: note.color }}>
                        {note.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notes;
