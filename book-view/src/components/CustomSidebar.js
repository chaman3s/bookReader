import React, { useState, useEffect } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import pdf from "./practice_mind.pdf"
import { getDocument } from 'pdfjs-dist';


const CustomSidebar = ({pdfUr, currentPage, onJumpToPage }) => {
   let pdfUrl= pdf;
    const [thumbnails, setThumbnails] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [outline, setOutline] = useState([]);

    useEffect(() => {
        loadThumbnails();
        loadOutline();
    }, []);

    // Generate thumbnails for each page
    const loadThumbnails = async () => {
        const pdf = await getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        const thumbs = [];

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = { canvasContext: context, viewport: viewport };
            await page.render(renderContext).promise;
            
            thumbs.push(canvas.toDataURL());
        }

        setThumbnails(thumbs);
    };

    // Load the PDF outline
    const loadOutline = async () => {
        const pdf = await getDocument(pdfUrl).promise;
        const pdfOutline = await pdf.getOutline();
        setOutline(pdfOutline || []);
    };

    // Bookmark management
    const addBookmark = (pageNum) => {
        setBookmarks([...bookmarks, pageNum]);
    };

    return (
        <div className="sidebar">
            <h2>PDF Thumbnails</h2>
            <div className="thumbnails">
                {thumbnails.map((src, index) => (
                    <img key={index} src={src} alt={`Thumbnail for page ${index + 1}`} />
                ))}
            </div>

            <h2>Bookmarks</h2>
            <ul>
                {bookmarks.map((bookmark, index) => (
                    <li key={index}>Page {bookmark}</li>
                ))}
                <button onClick={() => addBookmark(1)}>Add Bookmark for Page 1</button>
            </ul>

            <h2>Outline</h2>
            <ul>
                {outline.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
};


export default CustomSidebar;
