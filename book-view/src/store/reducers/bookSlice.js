import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Initial state
const backendHost= process.env.REACT_APP_BackendHost
const initialState = {
  bookname: '',
  booknote: [],
  lastOpenPage: 0,
  lasttimereadbook: "",
  booklist: [],
  authorname: '',
  bookedition:0,
  bookpath:"",
  error:"",
  msg: "",
};

// Thunks to handle async actions (API requests)

// Send book data to backend and check if it exists in MongoDB
export const getBookFile = createAsyncThunk(
  "book/getBookFile",
  async (book, { rejectWithValue }) => {
    try {
      console.log('Backend Host:', backendHost);
      // Send a POST request with the JSON data
      const response = await axios.post(`${backendHost}/api/book/getbookfile`, book, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data; // Returns the data from the backend
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { msg: "bookList are null" };
      }
      return rejectWithValue(error.response.data);
    }
  }
);
export const getBookList = createAsyncThunk(
  "book/getBookList",
  async (book, { rejectWithValue }) => {
    try {
      console.log('Backend Host:', backendHost);
      const response = await axios.post(backendHost+"/api/book/getbookList");
      return response.data; // Returns the data from backend, either the book exists or new data is added
    } catch (error) {
      if(error.code =="404"){
        return {msg:"bookList are null"}
      }
      return rejectWithValue(error.response.data);
    }
  }
);
export const checkAndUpdateBook = createAsyncThunk(
  "book/checkAndUpdateBook",
  async (bookData, { rejectWithValue }) => {
    console.log('bookData:', bookData);
    try {
      const response = await axios.post(backendHost+"/api/book/bookrecode", bookData);
      return response.data; // Returns the data from backend, either the book exists or new data is added
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Send a note to backend to add to the book's notes array
export const addNoteToBook = createAsyncThunk(
  "book/addNoteToBook",
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await axios.post(backendHost+"/api/book/addnotes", noteData);
      return response.data; // Returns success message from backend
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllNote= createAsyncThunk(
  "book/getAllNote",
  async ( Bookdata,{ rejectWithValue }) => {
    try {
      const response = await axios.post(backendHost+"/api/book/getnotes",Bookdata);
      return response.data; // Returns success message from backend
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

});

// Update lastOpenPage in backend
export const updateLastOpenPage = createAsyncThunk(
  "book/updateLastOpenPage",
  async (pageData, { rejectWithValue }) => {
    try {
      const response = await axios.put(backendHost+"/api/book/updatepage", pageData);
      return response.data; // Returns success message from backend
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle checkAndUpdateBook action
    builder.addCase(checkAndUpdateBook.fulfilled, (state, action) => {
      if (action.payload.msg === "book exists") {
        // Book exists, update state with data from MongoDB
        const { bookname, booknote, lastreadPage, lasttimereadbook ,bookpath,authorname,bookeditions} = action.payload.book;
        state.bookname = bookname;
        state.booknote = booknote;
        state.lastOpenPage = lastreadPage;
        state.lasttimereadbook = lasttimereadbook
        state.bookpath = bookpath;
        state.authorname = authorname;
        state.bookeditions = bookeditions
        state.booklist.push(action.payload.book);
      } else {
        // Book does not exist, update state with user input
        state.bookname = action.payload.bookname;
        state.booknote = action.payload.booknote;
        state.lastOpenPage = action.payload.lastreadPage;
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        state.lasttimereadbook = `${month}/${date}/${year}`;
        state.bookpath = action.payload.bookpath;
        state.authorname = action.payload.authorname;
        state.bookeditions = action.payload.bookeditions;
        state.booklist.push({bookname:action.payload.bookname,authorname:action.payload.authorname,bookedition:action.payload.bookeditions,bookImage:action.payload.bookimage})
      }
    });
    builder.addCase(getBookFile.fulfilled, (state, action) => {
      // When note is added successfully, push it to booknote array
      console.log("book extect:", action.payload);
      state.booknote=action.payload.book.booknote||[];
      state.bookpath = action.payload.book.bookFile;
      state.bookedition= action.payload.book.bookedition||1;
      state.lastOpenPage=action.payload.book.lastOpenPage||0;
      console.log("book extect url:",  action.payload.book.bookFile);
      state.msg = "successfully update state";

    });
    // Handle addNoteToBook action
    builder.addCase(addNoteToBook.fulfilled, (state, action) => {
      // When note is added successfully, push it to booknote array

      
      if (action.payload.note) {
        state.booknote=action.payload.note;
        console.log("Note added successfully:", action.payload.note);
      } else {
        console.warn("No note returned from backend");
      }
    });

    builder.addCase(getAllNote.fulfilled, (state, action) => {
      console.log("Note successfully get:", action.payload);
      if(action.payload.notes){
        state.booknote = action.payload.notes;
        state.lastOpenPage= action.payload.lastpageopen;
        console.log("state successfully update:", state.booknote, "and ",state.lastOpenPage);
      }
      else {
        console.warn("something went wrong");
      }
    });

    // Handle updateLastOpenPage action
    builder.addCase(updateLastOpenPage.fulfilled, (state, action) => {
      state.lastOpenPage = action.payload.lastOpenPage;
    });
    builder.addCase(getBookList.fulfilled, (state, action) => {
      console.log(action.payload)
      if (!action.payload.error) {
        if (action.payload.books){
          console.log("BookList:",action.payload.books);
          state.booklist = action.payload.books;
         
        }

      }
    });
  },
});

export default bookSlice.reducer;
