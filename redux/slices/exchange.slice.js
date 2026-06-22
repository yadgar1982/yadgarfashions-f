import {createSlice} from "@reduxjs/toolkit";

const exchangeSlice = createSlice({
    name : "exchangeSlice",
    initialState : {
        rate : 1,
        currencyCode : 'USD',
        currency : '$'
    },
    reducers : {
        setExchange(state,action){
            state = action.payload;
            return state
        },
        resetExchange(state,action){
            state = {
                rate : 1,
                currencyCode : 'usd',
                currency : '$'
            };
            return state;
        }
    }
});

export const {setExchange,resetExchange} = exchangeSlice.actions;
export default exchangeSlice.reducer;