import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

export const fetchBranding = createAsyncThunk(
  'branding/fetchBranding',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get('/api/branding/get');
    return res.data;
  }
);

const brandingSlice = createSlice({
  name: 'branding',
  initialState: {
    branding: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranding.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranding.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.branding = action.payload;
        //saveToLocal("classes", action.payload);
      })
      .addCase(fetchBranding.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default brandingSlice.reducer;
