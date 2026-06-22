import {createSlice} from "@reduxjs/toolkit";

const stepsSlice = createSlice({
    name : "stepsSlice",
    initialState : 1,
    reducers : {
        nextStep(state,action){
            state = action.payload;
            return state
        },
        backStep(state,action){
            state = action.payload;
            return state;
        }
    }
});

export const {nextStep,backStep} = stepsSlice.actions;
export default stepsSlice.reducer;