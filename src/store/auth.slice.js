import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SummeryApi } from "../config/api";
import { createRequest, handleAsyncError, createAsyncReducer } from "./utils/asyncUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      loadingStates: {
            login: false,
            checkAuth: false,
            logout: false,
            generateOTP: false,
            verifyOTPAndUpdateEmail: false,
            verifyOTPAndUpdatePassword: false,
      },
      isAuthenticated: false,
      user: null,
      error: null,
      lastUpdated: null,
};


const createAuthThunk = (name, url, method = 'post') => {
      return createAsyncThunk(
            `auth/${name}`,
            async (data, { rejectWithValue, signal }) => {
                  try {
                        const { request } = createRequest(
                              {
                                    method,
                                    url: `${baseUrl}${url}`,
                                    data,
                              },
                              15000 
                        );

                        const response = await request;
                        return response.data;
                  } catch (error) {
                        return rejectWithValue(handleAsyncError(error, `Failed to ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`));
                  }
            }
      );
};

export const loginUser = createAuthThunk('login', SummeryApi.loginUrl);
export const checkAuth = createAuthThunk('checkAuth', SummeryApi.getAdminUserUrl, 'get');
export const logoutUser = createAuthThunk('logout', SummeryApi.logoutUrl);
export const generateOTP = createAuthThunk('generateOTP', SummeryApi.generateOtpUrl);
export const verifyOTPAndUpdateEmail = createAuthThunk('verifyOTPAndUpdateEmail', SummeryApi.verifyOtpUpdateEmailUrl);
export const verifyOTPAndUpdatePassword = createAuthThunk('verifyOTPAndUpdatePassword', SummeryApi.verifyOtpUpdatePasswordUrl);

const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
            clearAuthError: (state) => {
                  state.error = null;
            },
            resetAuthState: () => initialState,
            setAuthUser: (state, action) => {
                  state.user = action.payload;
                  state.isAuthenticated = !!action.payload;
            },
      },
      extraReducers: (builder) => {
            
            builder.addCase(loginUser.pending, (state) => {
                  state.loadingStates.login = true;
                  state.error = null;
            });
            builder.addCase(loginUser.fulfilled, (state, action) => {
                  state.loadingStates.login = false;
                  state.isAuthenticated = true;
                  state.user = action.payload?.data?.user || null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(loginUser.rejected, (state, action) => {
                  state.loadingStates.login = false;
                  state.isAuthenticated = false;
                  state.user = null;
                  state.error = action.payload;
            });

            
            builder.addCase(checkAuth.pending, (state) => {
                  state.loadingStates.checkAuth = true;
                  state.error = null;
            });
            builder.addCase(checkAuth.fulfilled, (state, action) => {
                  state.loadingStates.checkAuth = false;
                  state.isAuthenticated = true;
                  state.user = action.payload?.data?.user || null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(checkAuth.rejected, (state) => {
                  state.loadingStates.checkAuth = false;
                  state.isAuthenticated = false;
                  state.user = null;
                  
            });

            
            builder.addCase(logoutUser.fulfilled, (state) => {
                  state.loadingStates.logout = false;
                  state.isAuthenticated = false;
                  state.user = null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });

            
            const handleOTPOperation = (state, action, stateKey) => {
                  state.loadingStates[stateKey] = false;
                  state.error = action.payload || null;
                  state.lastUpdated = new Date().toISOString();
            };

            
            const otpOperations = [
                  { type: generateOTP, key: 'generateOTP' },
                  { type: verifyOTPAndUpdateEmail, key: 'verifyOTPAndUpdateEmail' },
                  { type: verifyOTPAndUpdatePassword, key: 'verifyOTPAndUpdatePassword' },
            ];

            otpOperations.forEach(({ type, key }) => {
                  builder.addCase(type.pending, (state) => {
                        state.loadingStates[key] = true;
                        state.error = null;
                  });
                  builder.addCase(type.fulfilled, (state, action) => {
                        handleOTPOperation(state, action, key);
                  });
                  builder.addCase(type.rejected, (state, action) => {
                        handleOTPOperation(state, action, key);
                  });
            });
      },
});

export const { clearAuthError, resetAuthState, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
