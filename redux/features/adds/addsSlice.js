import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

export const fetchAdds = createAsyncThunk(
  'adds/fetchAdds',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get('/api/adds/all');
    return res.data;
  }
);

const addsSlice = createSlice({
  name: 'adds',
  initialState: {
    adds: {
      adds : []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.adds = action.payload;
      })
      .addCase(fetchAdds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default addsSlice.reducer;
