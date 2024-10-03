import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';

const ChessBoardSidebar = () => {
    const [fen, setFen] = useState('start'); // FEN represents the board state

    const handleDiagramDoubleClick = (diagramFen) => {
        setFen(diagramFen); // Load the FEN of the double-clicked diagram
    };

    return (
        <div className="chessboard-sidebar">
            <h3>Chess Board</h3>
            <Chessboard position={fen} />
        </div>
    );
};

export default ChessBoardSidebar;
