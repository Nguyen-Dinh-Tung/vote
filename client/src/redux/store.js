import { configureStore } from '@reduxjs/toolkit';
import showReducer from './features/show.slice';
import idReducer from './features/id.slice';
import specialReducer from './features/special';
import userReducer from './features/user.slice';
export const store = configureStore({
  reducer: {
    show: showReducer,
    id: idReducer,
    special: specialReducer,
    user: userReducer,
  },
});
export default store;
