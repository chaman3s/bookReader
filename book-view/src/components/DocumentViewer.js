import React, { useState } from 'react';
import DocumentViewer from '../components/DocumentViewer';
import Highlighter from '../components/Highlighter';
import Notes from '../components/Notes';
import Translator from '../components/Translator';
import ChessBoardSidebar from '../components/ChessBoard';
import Customization from '../components/Customization';

const ViewerPage = () => {
    const [selectedText, setSelectedText] = useState('');
    const [customStyles, setCustomStyles] = useState({});

    return (
        <div className="viewer-page">
            <Customization onStyleChange={setCustomStyles} />
            <DocumentViewer fileType="pdf" fileUrl="path/to/document.pdf" />
            <Highlighter onHighlight={setSelectedText} />
            <Translator textToTranslate={selectedText} />
            <Notes />
            <ChessBoardSidebar />
        </div>
    );
};

export default ViewerPage;
