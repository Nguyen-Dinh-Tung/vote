import {configureStore} from "@reduxjs/toolkit";
import showReducer from './features/show.slice'
import idReducer from './features/id.slice'
export const store = configureStore({
  reducer: {
    show : showReducer ,
    id : idReducer
  },
});
export default store;
