import { createSlice } from '@reduxjs/toolkit';
const special = createSlice({
  name: 'special',
  initialState: {
    isCreateGroup: false,
    reRenderSideBar: '',
    emitType: 0,
  },
  reducers: {
    setIsCreateGroup: (state, action) => {
      state.isCreateGroup = action.payload;
    },
    setReRenderSideBar: (state, action) => {
      state.reRenderSideBar = action.payload;
    },
    setEmitType: (state, action) => {
      state.emitType = action.payload;
    },
  },
});
export const { setIsCreateGroup, setReRenderSideBar, setEmitType } =
  special.actions;
export default special.reducer;
