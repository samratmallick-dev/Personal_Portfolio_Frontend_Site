import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SummeryApi } from "../config/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      isLoading: false,
      servicesData: [],
      error: null,
};

export const getAllServices = createAsyncThunk(
      "services/getAllServices",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getAllServicesUrl}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const createService = createAsyncThunk(
      "services/createService",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.createServiceUrl}`, formData, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const updateService = createAsyncThunk(
      "services/updateService",
      async ({ id, formData }, { rejectWithValue }) => {
            try {
                  const response = await axios.put(`${baseUrl}${SummeryApi.updateServiceUrl}${id}`, formData, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const deleteService = createAsyncThunk(
      "services/deleteService",
      async (id, { rejectWithValue }) => {
            try {
                  const response = await axios.delete(`${baseUrl}${SummeryApi.deleteServiceUrl}${id}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

const servicesSlice = createSlice({
      name: "services",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(getAllServices.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getAllServices.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.servicesData = action.payload.data || [];
                        state.error = null;
                  })
                  .addCase(getAllServices.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(createService.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(createService.fulfilled, (state, action) => {
                        state.isLoading = false;
                        if (action.payload?.data) {
                              state.servicesData.push(action.payload.data);
                        }
                        state.error = null;
                  })
                  .addCase(createService.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(updateService.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(updateService.fulfilled, (state, action) => {
                        state.isLoading = false;
                        const updated = action.payload?.data;
                        if (updated?._id) {
                              const idx = state.servicesData.findIndex((s) => s._id === updated._id);
                              if (idx !== -1) {
                                    state.servicesData[idx] = updated;
                              }
                        }
                        state.error = null;
                  })
                  .addCase(updateService.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(deleteService.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(deleteService.fulfilled, (state) => {
                        state.isLoading = false;
                        state.error = null;

                  })
                  .addCase(deleteService.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  });
      },
});

export default servicesSlice.reducer;
