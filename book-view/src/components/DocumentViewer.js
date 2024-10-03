import React, { useState, useRef, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import pdf from './practice_mind.pdf';
import './PdfViewer.css';

const PdfViewer = () => {
    const [highlights, setHighlights] = useState([]);  // Highlights stored here
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedHighlightAreas, setSelectedHighlightAreas] = useState(null); // To store selected areas

    // Initialize the highlight plugin
    const highlightPluginInstance = highlightPlugin({
        renderHighlights: (props) => {
            console.log('Rendering highlights for page', props.pageIndex, highlights);
            return (
                <>
                    {highlights.map((highlight, idx) => (
                        highlight.pageIndex === props.pageIndex && highlight.highlightAreas.map((area, areaIdx) => (
                            <div
                                key={areaIdx}
                                style={{
                                    backgroundColor: highlight.color,
                                    opacity: 0.4,
                                    position: 'absolute',
                                    left: `${area.left}%`,
                                    top: `${area.top}%`,
                                    width: `${area.width}%`,
                                    height: `${area.height}%`,
                                }}
                            />
                        ))
                    ))}
                </>
            );
        },
        onHighlight: (props) => {
            console.log('Highlighting process triggered');
            console.log('Highlighted areas:', props.highlightAreas, 'on page', props.pageIndex);
            if (props.highlightAreas && props.highlightAreas.length > 0) {
                setSelectedHighlightAreas({ areas: props.highlightAreas, pageIndex: props.pageIndex });
                console.log('Selected areas set:', { areas: props.highlightAreas, pageIndex: props.pageIndex });
            } else {
                console.log('No areas selected');
            }
        },
    });

    const pdfViewerRef = useRef(null);

    // Log when highlights are updated
    useEffect(() => {
        console.log('Highlights updated:', highlights);
    }, [highlights]);

    // Handle the right-click context menu
    const handleContextMenu = (event) => {
        event.preventDefault();  // Prevent default browser context menu
        const selection = window.getSelection();
        if (selection && selection.toString().trim() !== '') {
            console.log('Selection detected:', selection.toString());
            setContextMenuPosition({ x: event.clientX, y: event.clientY });
            setContextMenuVisible(true);  // Show custom context menu
        } else {
            console.log('No selection found');
            setContextMenuVisible(false); // Hide menu if no text is selected
        }
    };

    // Close context menu on clicking elsewhere
    const handleClick = () => {
        setContextMenuVisible(false); // Hide the menu when clicking elsewhere
    };

    // Function to highlight selected text in the PDF viewer
    const handleHighlightText = (color) => {
        console.log('Highlighting selected areas:', selectedHighlightAreas);
        if (selectedHighlightAreas && selectedHighlightAreas.areas.length > 0) {
            console.log('i am in if');
            setHighlights((prevHighlights) => [
                ...prevHighlights,
                {
                    color: color,
                    highlightAreas: selectedHighlightAreas.areas,
                    pageIndex: selectedHighlightAreas.pageIndex,
                },
            ]);
        } else {
            console.log('No selected areas to highlight');
        }
        setContextMenuVisible(false);  // Hide context menu after choosing the color
    };

    return (
        <div onClick={handleClick} style={{ position: 'relative' }}>
            {/* Display the PDF */}
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js`}>
                <div
                    ref={pdfViewerRef}
                    className="pdf-viewer"
                    onContextMenu={handleContextMenu}  // Attach context menu handler directly to the viewer
                >
                    <Viewer
                        fileUrl={pdf}
                        plugins={[highlightPluginInstance]} // Use the highlight plugin here
                    />
                </div>
            </Worker>

            {/* Custom context menu */}
            {contextMenuVisible && (
                <div
                    className="custom-context-menu"
                    style={{
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                        position: 'absolute',
                        zIndex: 1000,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        padding: '10px',
                    }}
                >
                    <div onClick={() => handleHighlightText('#FFFF00')}>Highlight Yellow</div>
                    <div onClick={() => handleHighlightText('#FF5733')}>Highlight Orange</div>
                    <div onClick={() => handleHighlightText('#75FF33')}>Highlight Green</div>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;
