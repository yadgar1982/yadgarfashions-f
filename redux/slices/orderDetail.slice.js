import {createSlice} from "@reduxjs/toolkit";

const orderDetailSlice = createSlice({
    name : "orderDetailSlice",
    initialState : null,
    reducers : {
        setOrderDetail(state,action){
            state = action.payload;
            return state
        },
        resetOrderDetail(state,action){
            state = null;
            return state;
        }
    }
});

export const {setOrderDetail,resetOrderDetail} = orderDetailSlice.actions;
export default orderDetailSlice.reducer;