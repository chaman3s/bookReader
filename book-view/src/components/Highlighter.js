import React, { useState } from 'react';

const Highlighter = ({ onHighlight }) => {
    const [selectedText, setSelectedText] = useState('');

    const handleMouseUp = () => {
        const text = window.getSelection().toString();
        if (text) {
            setSelectedText(text);
            onHighlight(text);
        }
    };

    return (
        <div onMouseUp={handleMouseUp}>
            {/* Render your document viewer content here */}
        </div>
    );
};

export default Highlighter;
