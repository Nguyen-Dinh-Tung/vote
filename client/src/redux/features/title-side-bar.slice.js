import { createSlice } from '@reduxjs/toolkit';

const titleSideBar = createSlice({
  name: 'titleSideBar',
  initialState: {
    title: 'Xin chào các bạn',
  },
  reducers: {
    setTitle: (state, actions) => {
      state.title = actions.payload;
    },
  },
});
export const { setTitle } = titleSideBar.actions;

export default titleSideBar.reducer;
