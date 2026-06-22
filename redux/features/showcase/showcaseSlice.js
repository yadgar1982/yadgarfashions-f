import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

export const fetchShowcases = createAsyncThunk(
  'brand/fetchShowcases',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get('/api/showcase/all');
    return res.data;
  }
);

const showcasesSlice = createSlice({
  name: 'showcase',
  initialState: {
    showcases: {
      showcases : []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowcases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShowcases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.showcases = action.payload;
      })
      .addCase(fetchShowcases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default showcasesSlice.reducer;
