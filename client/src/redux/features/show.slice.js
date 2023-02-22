import { createSlice } from "@reduxjs/toolkit";
const url = 'contest'
const showSlice = createSlice({
  name: "show",
  initialState: {
    alert : {
      status : false ,
      message : '' ,
      type : ''
    } ,
    dialogEdit : false
  },
  reducers: {
    setAlert : (state , actions) =>{
      state.alert = {...state.alert , ...actions.payload}
    } ,
    setDialogEdit : (state , actions) =>{
      state.dialogEdit  = actions.payload
    }
  },
});
export const {
  setAlert ,setDialogEdit
} = showSlice.actions;
export default showSlice.reducer;

