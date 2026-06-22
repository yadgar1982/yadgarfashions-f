import {createSlice} from "@reduxjs/toolkit";

const dlvDurationSlice = createSlice({
    name : "dlvDurationSlice",
    initialState : null,
    reducers : {
        setDlvDuration(state,action){
            state = action.payload;
            return state
        },
        resetDlvDuration(state,action){
            state = null;
            return state;
        }
    }
});

export const {setDlvDuration,resetDlvDuration} = dlvDurationSlice.actions;
export default dlvDurationSlice.reducer;