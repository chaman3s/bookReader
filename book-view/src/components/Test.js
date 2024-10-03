import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import Pdf from './practice_mind.pdf'
const PdfViewer = () => {
   let  pdfUrl= Pdf;

  const [pagesData, setPagesData] = useState([]);

  // Function to extract PDF text and images
  const extractPdfData = async (pdfUrl) => {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const allPagesData = [];

    for (let pageNumber = 2; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });

      const images = []; // Add logic to extract images if needed

      allPagesData.push({
        number: pageNumber,
        textItems: textContent.items,
        viewport, // Keep track of page size for scaling
        images,
      });
    }
    return allPagesData;
  };

  // Function to generate CSS for each text and image
  const generateCssFromPdfPage = (pageData) => {
    let css = '';
    pageData.textItems.forEach((item, index) => {
      const left = item.transform[4]; // X coordinate
      const top = pageData.viewport.height - item.transform[5]; // Y coordinate, flipped
      const fontSize = item.transform[0]; // Font size

      css += `.pdf-page-${pageData.number} .pdf-text-${index} {
        position: absolute;
        left: ${left}px;
        top: ${top}px;
        font-size: ${fontSize}px;
        white-space: pre;
        font-family: 'Arial', sans-serif;
      }\n`;
    });

    // Generate CSS for images if needed
    pageData.images.forEach((img, index) => {
      css += `.pdf-page-${pageData.number} .pdf-image-${index} {
        position: absolute;
        left: ${img.x}px;
        top: ${img.y}px;
        width: ${img.width}px;
        height: ${img.height}px;
      }\n`;
    });

    return css;
  };

  // Function to inject CSS into the document
  const injectCss = (css) => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
  };

  // Function to render PDF content in HTML
  const renderPdfContent = (pagesData) => {
    const container = document.getElementById('pdf-content');
    pagesData.forEach((pageData) => {
      const pageDiv = document.createElement('div');
      pageDiv.className = `pdf-page pdf-page-${pageData.number}`;
      pageDiv.style.position = 'relative';
      pageDiv.style.width = `${pageData.viewport.width}px`;
      pageDiv.style.height = `${pageData.viewport.height}px`;

      // Render text
      pageData.textItems.forEach((item, index) => {
        const textDiv = document.createElement('div');
        textDiv.className = `pdf-text-${index}`;
        textDiv.textContent = item.str; // Set the text content
        pageDiv.appendChild(textDiv);
      });

      // Render images if any
      pageData.images.forEach((img, index) => {
        const imgElement = document.createElement('img');
        imgElement.className = `pdf-image-${index}`;
        imgElement.src = img.src; // Image source URL
        pageDiv.appendChild(imgElement);
      });

      container.appendChild(pageDiv);
    });
  };

  // Main function to process PDF and display it
  const renderPdfToHtml = async (pdfUrl) => {
    const pagesData = await extractPdfData(pdfUrl);
    let allCss = '';

    pagesData.forEach((pageData) => {
      const pageCss = generateCssFromPdfPage(pageData);
      allCss += pageCss;
    });

    injectCss(allCss); // Inject the generated CSS
    renderPdfContent(pagesData); // Render the content with styled elements
  };

  // UseEffect to trigger PDF extraction and rendering on mount
  useEffect(() => {
    if (pdfUrl) {
      renderPdfToHtml(pdfUrl);
    }
  }, [pdfUrl]);

  return <div id="pdf-content"></div>;
};

export default PdfViewer;
