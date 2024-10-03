import React from 'react';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import '@react-pdf-viewer/core/lib/styles/index.css';

const CustomToolbar = ({ zoomIn, zoomOut }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            }}
        >
                  <div className="toolbar">
            <button><FaSearchPlus /></button>
            <button><FaSearchMinus /></button>
        </div>

        </div>
    );
};

export default CustomToolbar;
