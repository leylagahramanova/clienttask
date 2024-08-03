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
        console.log('Attempting login with:', user);
        const response = await axios.post('/api/auth', user);
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.data);
        return response.data;
    } catch (error) {
        console.log('Login error:', error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    await axios.delete('/api/auth/logout');
    localStorage.removeItem('token');
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
                state.user = action.payload.data;
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
                state.user = null;
            });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
