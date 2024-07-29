// src/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        const response = await axios.post('https://taskmanagment-api.onrender.com/api/auth', user);
        localStorage.setItem('token', response.data.data); // Store token in local storage
        console.log("Token stored:", response.data.data); // Log the token
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    await axios.delete('https://taskmanagment-api.onrender.com/auth/logout');
    localStorage.removeItem('token'); // Remove token from local storage on logout
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data; // Adjust as per your response structure
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = null; // Reset user state on logout
            });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
