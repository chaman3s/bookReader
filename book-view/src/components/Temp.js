import React, { useState } from 'react';
import {
    highlightPlugin,
    
} from '@react-pdf-viewer/highlight';
import { Button, Position, PrimaryButton, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import pdf from './practice_mind.pdf'; // Import the PDF

const RenderHighlightsExample = () => {
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([]);
    let noteId = notes.length;
    const [Color, setColor] = useState("green");
    const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
    const [show, Setshow] = useState(false);
    const [Run, setRun] = useState(false);

    const renderHighlightTarget = (props) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <div
                        style={{
                            position: 'absolute',
                            background: '#fff',
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            borderRadius: '4px',
                            padding: '8px',
                            zIndex: 1000,
                            display: 'flex',
                            gap: '10px',
                            top: `${selectionPosition.top}px`, // Absolute pixel positioning
                            left: `${selectionPosition.left}px`,
                        }}
                        onClick={props.toggle}>
                        {/* Color selection options */}
                        {['yellow', 'green', 'blue', 'pink'].map((color, index) => (
                            <div
                                key={index}
                                onClick={() => { setRun(true); setColor(color); }}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    backgroundColor: color,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </div>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props) => {
        const addNote = () => {
            if (message !== '' || (show === false && Run === true)) {
                const note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                    color: Color,
                };
                setNotes(notes.concat([note]));
                console.log(note);
                if (show) { Setshow(false); props.cancel(); }
                else setRun(false);
            }
        };
        if (!show) { addNote(); return null; }
        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                        display: (show) ? "block" : "none"
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    const renderHighlights = (props) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: note.color || 'yellow',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    // Initialize both plugins
    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Viewer
                fileUrl={pdf}
                plugins={[highlightPluginInstance, defaultLayoutPluginInstance]} // Add the layout plugin
            />
        </div>
    );
};

export default RenderHighlightsExample;
