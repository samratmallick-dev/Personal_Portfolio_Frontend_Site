import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SummeryApi } from "../config/api";
import { createRequest, handleAsyncError, createAsyncReducer } from "./utils/asyncUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      loadingStates: {
            create: false,
            fetchAll: false,
            fetchById: false,
            update: false,
            delete: false,
      },
      educationData: [],
      currentEducation: null,
      error: null,
      lastUpdated: null,
};


const createEducationThunk = (name, url, method = 'get', isFormData = false) => {
      return createAsyncThunk(
            `education/${name}`,
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

                        const { request } = createRequest(config, 15000);
                        const response = await request;
                        return response.data;
                  } catch (error) {
                        return rejectWithValue(handleAsyncError(error, `Failed to ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`));
                  }
            }
      );
};

export const createEducation = createEducationThunk('createEducation', SummeryApi.createEducationUrl, 'post', true);
export const getAllEducation = createEducationThunk('getAllEducation', SummeryApi.getAllEducationUrl, 'get');
export const getEducationById = createEducationThunk('getEducationById', (id) => `${SummeryApi.getEducationUrl}${id}`, 'get');
export const updateEducation = createEducationThunk('updateEducation', (data) => `${SummeryApi.updateEducationUrl}${data.id}`, 'put', true);
export const deleteEducation = createEducationThunk('deleteEducation', (id) => `${SummeryApi.deleteEducationUrl}${id}`, 'delete');

const educationSlice = createSlice({
      name: "education",
      initialState,
      reducers: {
            clearEducationError: (state) => {
                  state.error = null;
            },
            resetEducationState: () => initialState,
            setCurrentEducation: (state, action) => {
                  state.currentEducation = action.payload;
            },
      },
      extraReducers: (builder) => {
            
            builder.addCase(createEducation.pending, (state) => {
                  state.loadingStates.create = true;
                  state.error = null;
            });
            builder.addCase(createEducation.fulfilled, (state, action) => {
                  state.loadingStates.create = false;
                  if (action.payload?.data) {
                        state.educationData.push(action.payload.data);
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(createEducation.rejected, (state, action) => {
                  state.loadingStates.create = false;
                  state.error = action.payload;
            });

            
            builder.addCase(getAllEducation.pending, (state) => {
                  state.loadingStates.fetchAll = true;
                  state.error = null;
            });
            builder.addCase(getAllEducation.fulfilled, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.educationData = action.payload?.data || [];
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getAllEducation.rejected, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.error = action.payload;
            });

            
            builder.addCase(getEducationById.pending, (state) => {
                  state.loadingStates.fetchById = true;
                  state.error = null;
            });
            builder.addCase(getEducationById.fulfilled, (state, action) => {
                  state.loadingStates.fetchById = false;
                  state.currentEducation = action.payload?.data || null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getEducationById.rejected, (state, action) => {
                  state.loadingStates.fetchById = false;
                  state.error = action.payload;
            });

            
            builder.addCase(updateEducation.pending, (state) => {
                  state.loadingStates.update = true;
                  state.error = null;
            });
            builder.addCase(updateEducation.fulfilled, (state, action) => {
                  state.loadingStates.update = false;
                  if (action.payload?.data) {
                        const index = state.educationData.findIndex(
                              item => item._id === action.payload.data._id
                        );
                        if (index !== -1) {
                              state.educationData[index] = action.payload.data;
                        }
                        state.currentEducation = action.payload.data;
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(updateEducation.rejected, (state, action) => {
                  state.loadingStates.update = false;
                  state.error = action.payload;
            });

            
            builder.addCase(deleteEducation.pending, (state) => {
                  state.loadingStates.delete = true;
                  state.error = null;
            });
            builder.addCase(deleteEducation.fulfilled, (state, action) => {
                  state.loadingStates.delete = false;
                  if (action.meta.arg) {
                        state.educationData = state.educationData.filter(
                              item => item._id !== action.meta.arg
                        );
                        if (state.currentEducation?._id === action.meta.arg) {
                              state.currentEducation = null;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(deleteEducation.rejected, (state, action) => {
                  state.loadingStates.delete = false;
                  state.error = action.payload;
            });
      },
});

export const { clearEducationError, resetEducationState, setCurrentEducation } = educationSlice.actions;
export default educationSlice.reducer;
