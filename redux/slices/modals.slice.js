import {createSlice} from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name : "modalSlice",
    initialState : {
        waistcoatModal : false,
        waistcoatModalData : null,
        menModal : false,
        menModalData : null,
        womenModal : false,
        womenModalData : null,
    },
    reducers : {
        setWaistcoatMoal(state,action){
            state.waistcoatModal = action.payload.waistcoatModal;
            state.waistcoatModalData = action.payload.data;
            state.menModalData = null;
            state.menModal = false;
            state.womenModal = false;
            state.womenModalData = null;
            return state
        },
        setMenModal(state,action){
            state.waistcoatModal = false;
            state.waistcoatModalData = null;
            state.menModal = action.payload.menModal;
            state.menModalData = action.payload.data;
            state.womenModal = false;
            state.womenModalData = null;
            return state
        },
        setWomenModal(state,action){
            state.waistcoatModal = false;
            state.waistcoatModalData = null;
            state.menModalData = null;
            state.menModal = false;
            state.womenModal = action.payload.womenModal;
            state.womenModalData = action.payload.data;
            return state
        },
        resetModal(state,action){
            state.waistcoatModal = false;
            state.waistcoatModalData = null;
            state.menModal = false;
            state.menModalData = null;
            state.womenModal = false;
            state.womenModalData = null;
            return state
        }
    }
});

export const {setWaistcoatMoal,setMenModal,setWomenModal,resetModal} = modalSlice.actions;
export default modalSlice.reducer;