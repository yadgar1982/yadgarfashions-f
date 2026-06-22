import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

export const fetchBrands = createAsyncThunk(
  'brand/fetchBrands',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get('/api/brand/all');
    return res.data;
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    brands: {
      brands : []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default brandSlice.reducer;
