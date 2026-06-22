import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

const dealField = ['dealerName']; // choose the fields you want
const dealQuery = dealField.join(',');

export const fetchDealers = createAsyncThunk(
  'dealer/fetchDealers',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get(`/api/dealer/query?fields=${dealQuery}`);
    return res.data;
  }
);

const dealerSlice = createSlice({
  name: 'dealer',
  initialState: {
    dealers: {
      dealers : []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDealers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dealers = action.payload;
      })
      .addCase(fetchDealers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dealerSlice.reducer;
