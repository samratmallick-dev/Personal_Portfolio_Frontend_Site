import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SummeryApi } from "../config/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      isLoading: false,
      isAuthenticated: false,
      user: null,
      error: null
};

export const loginUser = createAsyncThunk(
      "auth/login",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.loginUrl}`, formData, { withCredentials: true });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const checkAuth = createAsyncThunk(
      "auth/checkAuth",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getAdminUserUrl}`, { withCredentials: true });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const logoutUser = createAsyncThunk(
      "auth/logout",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.logoutUrl}`, {}, { withCredentials: true });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const generateOTP = createAsyncThunk(
      "auth/generateOTP",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.generateOtpUrl}`, formData, { withCredentials: true });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const verifyOTPAndUpdateEmail = createAsyncThunk(
      "auth/verifyOTPAndUpdateEmail",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.verifyOtpUpdateEmailUrl}`, formData, { withCredentials: true });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const verifyOTPAndUpdatePassword = createAsyncThunk(
      "auth/verifyOTPAndUpdatePassword",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.verifyOtpUpdatePasswordUrl}`, formData, { withCredentials: true });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
            clearError: (state) => { state.error = null; }
      },
      extraReducers: (builder) => {
            builder
                  .addCase(loginUser.pending, (state) => { state.isLoading = true; })
                  .addCase(loginUser.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isAuthenticated = true;
                        state.user = action.payload.data.user;
                  })
                  .addCase(loginUser.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isAuthenticated = false;
                        state.user = null;
                        state.error = action.payload?.message;
                  })
                  .addCase(checkAuth.fulfilled, (state, action) => {
                        state.isAuthenticated = true;
                        state.user = action.payload.data.user;
                  })
                  .addCase(checkAuth.rejected, (state) => {
                        state.isAuthenticated = false;
                        state.user = null;
                  })
                  .addCase(verifyOTPAndUpdateEmail.fulfilled, (state) => {
                        state.isAuthenticated = false;
                        state.user = null;
                  })
                  .addCase(verifyOTPAndUpdatePassword.fulfilled, (state) => {
                        state.isAuthenticated = false;
                        state.user = null;
                  })
                  .addCase(logoutUser.fulfilled, (state) => {
                        state.isAuthenticated = false;
                        state.user = null;
                  });
      }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
