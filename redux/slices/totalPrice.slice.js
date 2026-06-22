import {createSlice} from "@reduxjs/toolkit";

const totalPriceSlice = createSlice({
    name : "totalPriceSlice",
    initialState : 0,
    reducers : {
        setTotalPrice(state,action){
            state = action.payload;
            return state
        },
        resetTotalPrice(state,action){
            state = 0;
            return state;
        }
    }
});

export const {setTotalPrice,resetTotalPrice} = totalPriceSlice.actions;
export default totalPriceSlice.reducer;