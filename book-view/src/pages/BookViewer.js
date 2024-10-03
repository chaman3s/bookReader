import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    highlightPlugin,
} from '@react-pdf-viewer/highlight';
import { Button, Position, PrimaryButton, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { addNoteToBook, updateLastOpenPage, getAllNote } from '../store/reducers/bookSlice';

const BookViewer = () => {
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([]);
    let noteId = notes.length;
    const [Color, setColor] = useState("green");
    const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
    const [show, Setshow] = useState(false);
    const [Run, setRun] = useState(false);
    const viewerRef = useRef(null); // Store Viewer instance reference
    const bookpath = useSelector((state) => state.book.bookpath);
    const lastOpenPage = useSelector((state) => state.book.lastOpenPage); // lastOpenPage is 3
    const booknote = useSelector((state) => state.book.booknote);
    let bookname = useSelector((state) => state.book.bookname);
    let authorname = useSelector((state) => state.book.authorname);
    let bookedition = useSelector((state) => state.book.edition);
    const dispatch = useDispatch();
    const [count, setCount] = useState(null);

    useEffect(() => {
        const bookdata = {
            bookname: bookname,
            authorname: authorname,
            bookedition: bookedition,
        };
        dispatch(getAllNote(bookdata));
        setCount(booknote.length);
    }, []);

    useEffect(() => {
        if (count === 0) {
            setNotes(booknote);
        }
        setCount(booknote.length);
    }, [booknote]);

    const handleDocumentLoad = () => {
        if (viewerRef.current) {
            // Get the current PDF document from the viewer
            viewerRef.current.viewer.getCurrentPdfDocument().then((pdf) => {
                // Set the desired page (3rd page), pageIndex is zero-based
                const pageIndex =  2;
                
                // Use scrollPageIntoView to jump to the specified page
                viewerRef.current.viewer.scrollPageIntoView({ pageIndex });
            });
        }
    };
    

    const handlePageChange = (e) => {
        // You can uncomment and use this for tracking page change
        // const newPage = e.currentPage;
        // dispatch(updateLastOpenPage(newPage)); // Update last open page in Redux
    };

    const handleUpload = () => {
        console.log("upload clicked");
    };

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
                            top: `${selectionPosition.top}px`,
                            left: `${selectionPosition.left}px`,
                        }}
                        onClick={props.toggle}>
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
                const bookDataToSend = {
                    bookname: bookname,
                    authorname: authorname,
                    bookedition: bookedition,
                    note: note,
                };

                dispatch(addNoteToBook(bookDataToSend))
                    .unwrap()
                    .catch((err) => {
                        console.error('Failed to add book:', err);
                        alert(err);
                    });

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

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            Toolbar: (props) => (
                <>
                    {props.renderDefaultToolbar()}
                    <Button onClick={handleUpload}>Upload</Button>
                </>
            ),
        },
    });

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Viewer
                ref={viewerRef} // Attach ref to viewer
                fileUrl={bookpath}
                plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}
                onDocumentLoad={handleDocumentLoad} // Jump to the correct page after load
                onPageChange={handlePageChange} // Track page changes
            />
        </div>
    );
};

export default BookViewer;
