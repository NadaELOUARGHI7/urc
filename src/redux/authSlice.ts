// src/redux/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export {}; 

// Définir l'état initial
interface AuthState {
    user: { username: string; email: string } | null;
    error: string | null;
    successMessage: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    error: null,
    successMessage: null,
    loading: false,
};

// Créer le slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        startLoading(state) {
            state.loading = true;
        },
        registerSuccess(state, action: PayloadAction<{ username: string; email: string }>) {
            state.user = action.payload;
            state.successMessage = "Inscription réussie!";
            state.error = null;
            state.loading = false;
            console.log('Utilisateur inscrit : ', action.payload);

        },
        registerFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.successMessage = null;
            state.loading = false;
        },
        resetAuthState(state) {
            state.user = null;
            state.error = null;
            state.successMessage = null;
            state.loading = false;
        },
    },
});

// Exporter les actions et le reducer
export const { startLoading, registerSuccess, registerFailure, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
