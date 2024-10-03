const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  bookname: {
    type: String,
    required: true,
  },
  booknote: [
    {
      highlightAreas: [
        {
          height: Number,
          left: Number,
          pageIndex: Number,
          top: Number,
          width: Number,
        },
      ],
      quote: String,
      color: String,
      content: String,
      id: Number,
    },
  ],
  lastOpenPage: {
    type: Number,
    default: 0,
  },
  lasttimereadbook: {
    type: Date, // Use Date type for better flexibility
  },
  uploadtime: {
    type: Date, // Use Date type for upload time
    default: Date.now, // Automatically store the current date/time
  },
  authorname: {
    type: String,
    required: true, // Ensure that author name is provided
  },
  bookFile: {
    type: String, // Cloudinary URL for the book file
  },
  bookImage: {
    type: String, // Cloudinary URL for the book image
  },
  bookedition: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model('Book', BookSchema);
