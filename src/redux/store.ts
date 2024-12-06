import { configureStore } from "@reduxjs/toolkit";

import loggerMiddleware from "./middleware/loggerMiddleware";
import rootReducer from "./root-reducer";

// Create and configure the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
