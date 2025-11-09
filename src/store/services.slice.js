import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SummeryApi } from "../config/api";
import { createRequest, handleAsyncError } from "./utils/asyncUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      loadingStates: {
            fetchAll: false,
            create: false,
            update: false,
            delete: false,
      },
      servicesData: [],
      currentService: null,
      error: null,
      lastUpdated: null,
};


const createServiceThunk = (name, url, method = 'get', isFormData = false) => {
      return createAsyncThunk(
            `services/${name}`,
            async (data, { rejectWithValue, signal }) => {
                  try {
                        const config = {
                              method,
                              url: typeof url === 'function' ? url(data) : `${baseUrl}${url}${data?.id || ''}`,
                        };

                        if (method !== 'get' && method !== 'delete') {
                              config.data = data?.formData || data;
                        }

                        if (isFormData) {
                              config.headers = { "Content-Type": "multipart/form-data" };
                        }

                        const { request } = createRequest(config, 10000);
                        const response = await request;
                        return response.data;
                  } catch (error) {
                        return rejectWithValue(handleAsyncError(error, `Failed to ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`));
                  }
            }
      );
};

export const getAllServices = createServiceThunk('getAllServices', SummeryApi.getAllServicesUrl, 'get');
export const createService = createServiceThunk('createService', SummeryApi.createServiceUrl, 'post', true);
export const updateService = createServiceThunk('updateService', (data) => `${SummeryApi.updateServiceUrl}${data.id}`, 'put', true);
export const deleteService = createServiceThunk('deleteService', (id) => `${SummeryApi.deleteServiceUrl}${id}`, 'delete');

const servicesSlice = createSlice({
      name: "services",
      initialState,
      reducers: {
            clearServiceError: (state) => {
                  state.error = null;
            },
            resetServiceState: () => initialState,
            setCurrentService: (state, action) => {
                  state.currentService = action.payload;
            },
      },
      extraReducers: (builder) => {
            
            builder.addCase(getAllServices.pending, (state) => {
                  state.loadingStates.fetchAll = true;
                  state.error = null;
            });
            builder.addCase(getAllServices.fulfilled, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.servicesData = action.payload?.data || [];
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getAllServices.rejected, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.error = action.payload;
            });

            
            builder.addCase(createService.pending, (state) => {
                  state.loadingStates.create = true;
                  state.error = null;
            });
            builder.addCase(createService.fulfilled, (state, action) => {
                  state.loadingStates.create = false;
                  if (action.payload?.data) {
                        state.servicesData.push(action.payload.data);
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(createService.rejected, (state, action) => {
                  state.loadingStates.create = false;
                  state.error = action.payload;
            });

            
            builder.addCase(updateService.pending, (state) => {
                  state.loadingStates.update = true;
                  state.error = null;
            });
            builder.addCase(updateService.fulfilled, (state, action) => {
                  state.loadingStates.update = false;
                  const updated = action.payload?.data;
                  if (updated?._id) {
                        const idx = state.servicesData.findIndex(s => s._id === updated._id);
                        if (idx !== -1) {
                              state.servicesData[idx] = updated;
                        }
                        if (state.currentService?._id === updated._id) {
                              state.currentService = updated;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(updateService.rejected, (state, action) => {
                  state.loadingStates.update = false;
                  state.error = action.payload;
            });

            
            builder.addCase(deleteService.pending, (state) => {
                  state.loadingStates.delete = true;
                  state.error = null;
            });
            builder.addCase(deleteService.fulfilled, (state, action) => {
                  state.loadingStates.delete = false;
                  if (action.meta.arg) {
                        state.servicesData = state.servicesData.filter(
                              item => item._id !== action.meta.arg
                        );
                        if (state.currentService?._id === action.meta.arg) {
                              state.currentService = null;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(deleteService.rejected, (state, action) => {
                  state.loadingStates.delete = false;
                  state.error = action.payload;
            });
      },
});

export const { clearServiceError, resetServiceState, setCurrentService } = servicesSlice.actions;
export default servicesSlice.reducer;
