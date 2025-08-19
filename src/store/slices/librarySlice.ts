import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LibraryState, ProfileType } from '../../types/types.ts';
import type { BookType } from '../../types/types.ts';
import type { ShelfType } from '../../types/types.ts';

const initialState: LibraryState = {
  shelves: [],
  books: [],
  selectedBook: null,
  publicLibrary: { shelves: [], books: [] },
  ownerInfo: null
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addShelf: (state, action: PayloadAction<ShelfType>) => {
      state.shelves.push(action.payload);
    },
    addBook: (state, action: PayloadAction<BookType>) => {
      state.books.push(action.payload);
    },
    removeShelf: (state, action: PayloadAction<string>) => {
      state.shelves = state.shelves.filter((s) => s.id !== action.payload);
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
    setLibrary: (state, action: PayloadAction<{ shelves: ShelfType[]; books: BookType[] }>) => {
      state.shelves = action.payload.shelves;
      state.books = action.payload.books;
    },
    setPublicLibrary: (
      state,
      action: PayloadAction<{
        library: { shelves: ShelfType[]; books: BookType[] };
        ownerInfo: ProfileType;
      }>
    ) => {
      state.publicLibrary = action.payload.library;
      state.ownerInfo = action.payload.ownerInfo;
    },
    selectBook: (state, action: PayloadAction<string>) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        state.selectedBook = book;
      }
    },
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
    updateBook: (state, action: PayloadAction<BookType>) => {
      const bookIndex = state.books.findIndex((b) => b.id === action.payload.id);
      if (bookIndex === -1) return;
      state.books[bookIndex] = action.payload;
      if (state.selectedBook?.id === action.payload.id) {
        state.selectedBook = action.payload;
      }
    },
    updateShelf: (state, action: PayloadAction<ShelfType>) => {
      const index = state.shelves.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.shelves[index] = action.payload;
      }
    }
  }
});

export const {
  addShelf,
  removeShelf,
  addBook,
  removeBook,
  updateShelf,
  setLibrary,
  selectBook,
  clearSelectedBook,
  updateBook,
  setPublicLibrary
} = librarySlice.actions;
export default librarySlice.reducer;
