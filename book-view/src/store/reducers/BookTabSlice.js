import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  bookname: '',
  author: '',
  booknote: [],
  lastOpenPage: 0,
  lasttimereadbook: "",
  status: 'idle',
  error: null,
};

// Thunks

// Update book record by checking existence and updating state
export const updatebookreacode = createAsyncThunk(
  "book/updatebookreacode",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/book/bookrecode", bookData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ error: error.message });
      }
    }
  }
);

// Add a note to the book
export const updateBookNotes = createAsyncThunk(
  "book/updateBookNotes",
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/book/addnotes", noteData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ error: error.message });
      }
    }
  }
);

// Update last open page
export const bookcurrentpage = createAsyncThunk(
  "book/bookcurrentpage",
  async (pageData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/book/updatepage", pageData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ error: error.message });
      }
    }
  }
);

// Create the slice
const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle updatebookreacode
    builder
      .addCase(updatebookreacode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatebookreacode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.msg === "book exists" || action.payload.msg === "book added") {
          const { bookname, author, booknote, lastOpenPage, lasttimereadbook } = action.payload.book;
          state.bookname = bookname;
          state.author = author;
          state.booknote = booknote;
          state.lastOpenPage = lastOpenPage;
          state.lasttimereadbook = lasttimereadbook;
        }
      })
      .addCase(updatebookreacode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.msg || action.payload.error;
      })

      // Handle updateBookNotes
      .addCase(updateBookNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBookNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.msg === "Note successfully added") {
          state.booknote.push(action.payload.note);
        }
      })
      .addCase(updateBookNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.msg || action.payload.error;
      })

      // Handle bookcurrentpage
      .addCase(bookcurrentpage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bookcurrentpage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.msg === "Page updated") {
          state.lastOpenPage = action.payload.lastOpenPage;
        }
      })
      .addCase(bookcurrentpage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.msg || action.payload.error;
      });
  },
});

export default bookSlice.reducer;
