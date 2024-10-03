import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  bookuploadlist: [],
  status: 'idle',
  error: null,
};

// Thunks

// Update book list by adding a new book or checking if it exists
export const updatebooklist = createAsyncThunk(
  "bookUpload/updatebooklist",
  async (bookData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('bookname', bookData.bookname);
      formData.append('author', bookData.author);
      formData.append('file', bookData.file); // The actual file

      const response = await axios.post("/api/book/updatebookList", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Check if error.response exists
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ error: error.message });
      }
    }
  }
);

// Get book list from the database
export const getbooklist = createAsyncThunk(
  "bookUpload/getbooklist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/book/getallbooks");
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
const bookUploadSlice = createSlice({
  name: "bookUpload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle updatebooklist
      .addCase(updatebooklist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatebooklist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.msg === "book added") {
          state.bookuploadlist.push(action.payload.book);
        }
        // If book exists, error is handled separately
      })
      .addCase(updatebooklist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.msg || action.payload.error;
      })

      // Handle getbooklist
      .addCase(getbooklist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getbooklist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookuploadlist = action.payload.books;
      })
      .addCase(getbooklist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.msg || action.payload.error;
      });
  },
});

export default bookUploadSlice.reducer;
