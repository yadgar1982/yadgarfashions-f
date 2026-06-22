import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../module/http';

export const fetchCurrencies = createAsyncThunk(
  'currency/fetchCurrencies',
  async (token = null) => {
    const httpReq = http(token);
    const res = await httpReq.get('/api/currency/all');
    return res.data;
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currencies: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default currencySlice.reducer;
