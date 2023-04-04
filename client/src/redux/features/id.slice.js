import { createSlice } from '@reduxjs/toolkit';
const url = 'contest';
const idSlice = createSlice({
  name: 'id',
  initialState: {
    id: undefined,
  },
  reducers: {
    setId: (state, actions) => {
      state.id = actions.payload;
    },
  },
});
export const { setId } = idSlice.actions;
export default idSlice.reducer;
