import { configureStore } from '@reduxjs/toolkit';
import showReducer from './features/show.slice';
import idReducer from './features/id.slice';
import specialReducer from './features/special';
export const store = configureStore({
  reducer: {
    show: showReducer,
    id: idReducer,
    special: specialReducer,
  },
});
export default store;
