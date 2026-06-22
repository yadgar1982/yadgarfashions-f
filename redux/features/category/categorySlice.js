import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get('/api/category/all');
    return res.data;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: {
      categories : []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
