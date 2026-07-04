import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  category: '',
  status: '',
  sort: '-createdAt',
  page: 1,
};

const notesUiSlice = createSlice({
  name: 'notesUi',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // resetting pagination on new search
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFilters: () => {
      return initialState;
    }
  }
});

export const { setSearch, setCategory, setStatus, setSort, setPage, resetFilters } = notesUiSlice.actions;
export default notesUiSlice.reducer;
