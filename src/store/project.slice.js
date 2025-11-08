import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SummeryApi } from "../config/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      isLoading: false,
      projectsData: [],
      featuredProjects: [],
      error: null,
};

export const getAllProjects = createAsyncThunk(
      "project/getAllProjects",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getAllProjectsUrl}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const createProject = createAsyncThunk(
      "project/createProject",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.createProjectUrl}`, formData, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const updateProjectById = createAsyncThunk(
      "project/updateProjectById",
      async ({ id, formData }, { rejectWithValue }) => {
            try {
                  const response = await axios.put(`${baseUrl}${SummeryApi.updateProjectUrl}${id}`, formData, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const deleteProjectById = createAsyncThunk(
      "project/deleteProjectById",
      async (id, { rejectWithValue }) => {
            try {
                  const response = await axios.delete(`${baseUrl}${SummeryApi.deleteProjectUrl}${id}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const getFeaturedProjects = createAsyncThunk(
      "project/getFeaturedProjects",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getFeaturedProjectsUrl}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const setFeaturedProjects = createAsyncThunk(
      "project/setFeaturedProjects",
      async ({ projectIds }, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.setFeaturedProjectsUrl}`, { projectIds }, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

const projectSlice = createSlice({
      name: "project",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(getAllProjects.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getAllProjects.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.projectsData = action.payload.data || [];
                        state.error = null;
                  })
                  .addCase(getAllProjects.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(createProject.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(createProject.fulfilled, (state, action) => {
                        state.isLoading = false;
                        if (action.payload?.data) {
                              state.projectsData.push(action.payload.data);
                        }
                        state.error = null;
                  })
                  .addCase(createProject.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(updateProjectById.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(updateProjectById.fulfilled, (state, action) => {
                        state.isLoading = false;
                        const updated = action.payload?.data;
                        if (updated?._id) {
                              const idx = state.projectsData.findIndex(p => p._id === updated._id);
                              if (idx !== -1) {
                                    state.projectsData[idx] = updated;
                              }
                        }
                        state.error = null;
                  })
                  .addCase(updateProjectById.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(deleteProjectById.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(deleteProjectById.fulfilled, (state) => {
                        state.isLoading = false;
                        state.error = null;

                  })
                  .addCase(deleteProjectById.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(getFeaturedProjects.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getFeaturedProjects.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.featuredProjects = action.payload.data || [];
                        state.error = null;
                  })
                  .addCase(getFeaturedProjects.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(setFeaturedProjects.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(setFeaturedProjects.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.featuredProjects = action.payload.data || [];
                        state.error = null;
                  })
                  .addCase(setFeaturedProjects.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  });
      },
});

export default projectSlice.reducer;
