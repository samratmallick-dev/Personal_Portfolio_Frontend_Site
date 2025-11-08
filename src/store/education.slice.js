import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SummeryApi } from "../config/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      isLoading: false,
      educationData: [],
      error: null,
};

export const createEducation = createAsyncThunk(
      "education/createEducation",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.createEducationUrl}`, formData, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const getAllEducation = createAsyncThunk(
      "education/getAllEducation",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getAllEducationUrl}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const getEducationById = createAsyncThunk(
      "education/getEducationById",
      async (id, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getEducationUrl}${id}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const updateEducation = createAsyncThunk(
      "education/updateEducation",
      async ({ id, formData }, { rejectWithValue }) => {
            try {
                  const response = await axios.put(`${baseUrl}${SummeryApi.updateEducationUrl}${id}`, formData, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const deleteEducation = createAsyncThunk(
      "education/deleteEducation",
      async (id, { rejectWithValue }) => {
            try {
                  const response = await axios.delete(`${baseUrl}${SummeryApi.deleteEducationUrl}${id}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

const educationSlice = createSlice({
      name: "education",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(createEducation.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(createEducation.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.educationData.push(action.payload.data);
                        state.error = null;
                  })
                  .addCase(createEducation.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(getAllEducation.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getAllEducation.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.educationData = action.payload.data || [];
                        state.error = null;
                  })
                  .addCase(getAllEducation.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(getEducationById.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getEducationById.fulfilled, (state, action) => {
                        state.isLoading = false;

                        state.error = null;
                  })
                  .addCase(getEducationById.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(updateEducation.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(updateEducation.fulfilled, (state, action) => {
                        state.isLoading = false;
                        const index = state.educationData.findIndex(item => item._id === action.payload.data._id);
                        if (index !== -1) {
                              state.educationData[index] = action.payload.data;
                        }
                        state.error = null;
                  })
                  .addCase(updateEducation.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(deleteEducation.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(deleteEducation.fulfilled, (state, action) => {
                        state.isLoading = false;

                        state.error = null;
                  })
                  .addCase(deleteEducation.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  });
      },
});

export const educationActions = educationSlice.actions;
export default educationSlice.reducer;
