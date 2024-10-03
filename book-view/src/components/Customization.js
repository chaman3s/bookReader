import React, { useState } from 'react';

const Customization = ({ onStyleChange }) => {
    const [fontSize, setFontSize] = useState('16px');
    const [fontStyle, setFontStyle] = useState('normal');
    const [fontColor, setFontColor] = useState('#000000');

    const handleStyleChange = () => {
        onStyleChange({ fontSize, fontStyle, fontColor });
    };

    return (
        <div className="customization-panel">
            <h3>Customize Text</h3>
            <label>
                Font Size:
                <input
                    type="number"
                    value={fontSize.replace('px', '')}
                    onChange={(e) => setFontSize(`${e.target.value}px`)}
                />
            </label>
            <label>
                Font Style:
                <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="bold">Bold</option>
                </select>
            </label>
            <label>
                Font Color:
                <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                />
            </label>
            <button onClick={handleStyleChange}>Apply Changes</button>
        </div>
    );
};

export default Customization;
