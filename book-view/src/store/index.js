import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./reducers/bookSlice"

const store = configureStore({
  reducer: {
    book: bookReducer,
  },
});

export default store;
