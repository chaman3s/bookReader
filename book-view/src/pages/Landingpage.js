import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar';
import { FaPlusCircle } from 'react-icons/fa';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import ePub from 'epubjs';
import { useDispatch, useSelector } from 'react-redux';
import { getBookList, checkAndUpdateBook ,getBookFile} from '../store/reducers/bookSlice';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const LandingPage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { booklist } = useSelector((state) => state.book);
  const { msg } = useSelector((state) => state.book);

  useEffect(() => {
    if (booklist.length === 0) {
      dispatch(getBookList());
      console.log("booklist:",booklist);
    }
  }, [dispatch, booklist.length]);

  const handleClickonBook=(index)=>{
     let bookdata =booklist[index] 
     const bookDataToSend = {
      bookname: bookdata.bookname,
      authorname: bookdata.authorname,
      bookedition: bookdata.bookedition
    };
    
    // Send the JSON data to the server
    dispatch(getBookFile(bookDataToSend))
      .unwrap()
      .then((response) => {
        console.log(msg);
        if (msg == "successfully update state") {
          
          navigate(`/view`);
        } else if (msg === "book not exists") {
          alert('Something went wrong');
        }
      })
      .catch((err) => {
        console.error('Failed to add book:', err);
        alert(err);
      });
   
  }
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleAddBookClick = () => {
    fileInputRef.current.click();
    console.log(fileInputRef);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        await handlePDFUpload(file);
      } else if (file.type === 'application/epub+zip') {
        await handleEPUBUpload(file);
      } else {
        alert('Unsupported file type. Please upload a PDF or EPUB.');
      }
    }
  };
  
  const handlePDFUpload = async (file) => {
    const fileReader = new FileReader();
  
    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result;
  
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        console.error('Error: ArrayBuffer is empty or not loaded.');
        return;
      }
  
      try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const metadata = await pdf.getMetadata();
        const info = metadata.info;
        const bookname = info.Title || file.name.replace('.pdf', '');
        const author = info.Author || 'Unknown Author';
        const edition = parseInt(info.Edition || '1', 10);
  
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await firstPage.render({ canvasContext: context, viewport }).promise;
        const imageUrl = canvas.toDataURL();
  
        // Convert base64 to Blob and append to FormData
        const imageBlob = base64ToBlob(imageUrl);
        const formData = new FormData();
        formData.append('bookname', bookname);
        formData.append('authorname', author);
        formData.append('edition', edition);
        formData.append('bookImage', imageBlob, `${bookname}.png`);
        formData.append('bookFile', file); // Attach the file itself
  
        // Send to server
        dispatch(checkAndUpdateBook(formData))
          .unwrap()
          .then((response) => {
            if (response.msg === "book added") {
              console.log('Book added successfully');
            } else if (response.msg === "book exists") {
              alert('Book already exists');
            }
          })
          .catch((err) => {
            console.error('Failed to add book:', err);
            alert(err);
          });
      } catch (error) {
        console.error('Error processing PDF file:', error);
      }
    };
  
    fileReader.readAsArrayBuffer(file);
  };
  
  const handleEPUBUpload = async (file) => {
    try {
      const book = ePub(file);
      const bookname = file.name.replace('.epub', '');
      const author = book.metadata.creator || 'Unknown Author';
      const coverImage = await book.coverUrl();
  
      const formData = new FormData();
      formData.append('bookname', bookname);
      formData.append('authorname', author);
      formData.append('bookImage', coverImage); // Cover image from EPUB
      formData.append('bookFile', file); // Attach the EPUB file itself
  
      // Send to server
      dispatch(checkAndUpdateBook(formData))
        .unwrap()
        .then((response) => {
          if (response.msg === "book added") {
            console.log('Book added successfully');
          } else if (response.msg === "book exists") {
            alert('Book already exists');
          }
        })
        .catch((err) => {
          console.error('Failed to add book:', err);
          alert(err);
        });
    } catch (error) {
      console.error('Error processing EPUB file:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-4 m-3 ml-3 mr-3">
      
      
      {/* Label for recent documents */}
      <div className="text-lg font-semibold mt-8">{(booklist.length!==0)?"Recent upload books":"start uplaoding book"}</div>
      <div className="flex mb-6 gap-2">
      
      <div className="  mt-4 w-1/6 w-56 flex items-center justify-center border border-dashed border-gray-400 p-6 cursor-pointer hover:bg-gray-100" onClick={handleAddBookClick}>
          <span className="text-4xl text-gray-400"  >+</span>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <input type="file" style={{ display: 'none' }} name="bookImage" />
        </div>
        {/* Loop through recent books */}
        {booklist.slice(0,5).map((book, index) => (
          <div key={index} className={` w-72 h-[337px] mt-4 border border-gray-200 p-4 hover:shadow-lg cursor-pointer`}  onClick={(e)=>handleClickonBook(index)} >
            <img src={book.bookImage} alt={book.bookname} className="h-48 w-full object-cover" />
            <h3 className="mt-4 text-lg font-medium">{book.bookname}</h3>
            <p className="text-sm text-gray-500">{book.authorname}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



export default LandingPage;
