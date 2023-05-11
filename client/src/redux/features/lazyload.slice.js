import { createSlice } from '@reduxjs/toolkit';
const lazyloadSlice = createSlice({
  name: 'lazyload',
  initialState: {
    open: false,
  },
  reducers: {
    setOpen: (state, actions) => {
      state.open = actions.payload;
    },
  },
});
export const { setOpen } = lazyloadSlice.actions;
export default lazyloadSlice.reducer;
