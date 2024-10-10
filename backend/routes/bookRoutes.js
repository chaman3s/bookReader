const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Book = require('../models/Book');
// const Book = require('../models/Test');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Updated bookrecode route to handle image upload
router.post('/bookrecode', upload.fields([{ name: 'bookImage' }, { name: 'bookFile' }]), async (req, res) => {
  const { bookname, authorname, edition } = req.body;
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const fulldate = `${month}/${date}/${year}`;
  
  console.log(req.body);
  console.log('Uploaded files:', req.files);
  console.log('request name:',req.body); 

  try {
    // Check if the book exists in the database
    let book = await Book.findOne({  bookname: bookname, authorname: authorname, bookedition: edition });

    if (book) {
      // If the book exists, update the last read time
      book.lasttimereadbook = fulldate;
      await book.save();
      console.log('Book already exists');
      return res.json({ msg: "Book already exists", book });
    }  else {
      let bookImageUrl, bookFileUrl;

      // Utility function to handle Cloudinary uploads as Promises
      const uploadToCloudinary = (format,fileBuffer, options) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw', format: format, ...options },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        ).end(fileBuffer);
         
          });
         
        }

      // Upload book image to Cloudinary if exists
      if (req.files && req.files.bookImage && req.files.bookImage[0]) {
        try {
          bookImageUrl = await uploadToCloudinary("PNG",req.files.bookImage[0].buffer, { resource_type: 'image' });
        } catch (error) {
          throw new Error('Failed to upload book image');
        }
      }

      // Upload PDF file to Cloudinary if exists
      if (req.files && req.files.bookFile && req.files.bookFile[0]) {
        try {
          bookFileUrl = await uploadToCloudinary('pdf',req.files.bookFile[0].buffer, { resource_type: 'raw' });
        } catch (error) {
          throw new Error('Failed to upload book file:', error);
        }
      }

      console.log("Book file uploaded", bookFileUrl, "and", bookImageUrl);

      // Create a new book record
      const newBook = new Book({
        bookname,
        edition,
        authorname,
        bookImage: bookImageUrl,
        bookFile: bookFileUrl,
        uploadtime: fulldate,
      });

      console.log('New Book:', newBook);
      await newBook.save();

      return res.json({ msg: "Book added successfully", book: newBook });
    
  
    }
  } catch (error) {
    console.error('Error during file processing:', error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});
router.post('/getbookfile', async (req, res) => {
  const { bookname, authorname, bookedition } = req.body;
  console.log('Received book data:', req.body);

  try {
    const book = await Book.findOne({ bookname: bookname, authorname: authorname, bookedition: bookedition });
    if (!book || !book.bookFile) {
      return res.status(404).json({ error: 'Book not found or book file is missing' });
    }
    return res.status(200).json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});
router.post('/getbookList', async (req, res) => {
  try {
    console.log('someone requested');
    // Fetch the list of books and only retrieve specific fields (bookname, bookImage, authorname, etc.)
    const books = await Book.find({}, { bookname: 1, bookImage: 1, authorname: 1, bookedition: 1, _id: 0 });
    
    // If no books are found
    if (!books || books.length === 0) {
      return res.status(200).json({ error: 'No books are present in database ' });
    }
    console.log("books:",books);
    // Process books to handle the image conversion (if applicable)
    const processedBooks = books.map((book) => ( {
      
      bookname: book.bookname,
      authorname: book.authorname,
      bookedition: book.bookedition,
      bookImage: book.bookImage || null // Adjust depending on how you store the image
    }));
   
    console.log(processedBooks,"this are send");
    // Send back the processed book list
    res.json({ books: processedBooks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Add note to existing book's notes array
router.post('/addnotes', async (req, res) => {
  const { bookname, note,authorname ,bookedition} = req.body;
  console.log("note:", note);

  try {
    const book = await Book.findOne({ bookname: bookname, authorname: authorname, bookedition: bookedition });

    if (book) {
      book.booknote.push(note);
      await book.save();
      return res.json({ msg: "Note successfully added", note:book.booknote });
    } else {
      return res.status(404).json({ msg: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Get notes from an existing book
router.post('/getnotes', async (req, res) => {
  const { bookname,authorname, bookedition } = req.body;
  console.log("getnote",req.body);

  try {
    const book = await Book.findOne({ bookname: bookname, authorname: authorname, bookedition: bookedition });

    if (book) {
      return res.json({ notes: book.booknote ,lastpageopen: book.lastOpenPage});
    } else {
      return res.status(404).json({ msg: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Update lastOpenPage
router.put('/updatepage', async (req, res) => {
  const { bookname,authorname,bookedition, lastpageopen } = req.body;

  try {
    const book = await Book.findOne({bookname: bookname, authorname: authorname, bookedition: bookedition});

    if (book) {
      book.lastOpenPage = lastpageopen;
      await book.save();
      return res.json({ msg: "Page updated", lastpageopen });
    } else {
      return res.status(404).json({ msg: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;