import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: -1,
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
  },
});
export const { setId } = userSlice.actions;
export default userSlice.reducer;
