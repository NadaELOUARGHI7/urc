// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
export {};

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Types pour les hooks de Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
