import { createSlice } from '@reduxjs/toolkit';
const special = createSlice({
  name: 'special',
  initialState: {
    isCreateGroup: false,
    reRenderSideBar: '',
  },
  reducers: {
    setIsCreateGroup: (state, action) => {
      state.isCreateGroup = action.payload;
    },
    setReRenderSideBar: (state, action) => {
      state.reRenderSideBar = action.payload;
    },
  },
});
export const { setIsCreateGroup, setReRenderSideBar } = special.actions;
export default special.reducer;
