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
            fetchFeatured: false,
            setFeatured: false,
      },
      projectsData: [],
      featuredProjects: [],
      currentProject: null,
      error: null,
      lastUpdated: null,
};


const createProjectThunk = (name, url, method = 'get', isFormData = false) => {
      return createAsyncThunk(
            `project/${name}`,
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

export const getAllProjects = createProjectThunk('getAllProjects', SummeryApi.getAllProjectsUrl, 'get');
export const createProject = createProjectThunk('createProject', SummeryApi.createProjectUrl, 'post', true);
export const updateProjectById = createProjectThunk('updateProjectById', (data) => `${SummeryApi.updateProjectUrl}${data.id}`, 'put', true);
export const deleteProjectById = createProjectThunk('deleteProjectById', (id) => `${SummeryApi.deleteProjectUrl}${id}`, 'delete');
export const getFeaturedProjects = createProjectThunk('getFeaturedProjects', SummeryApi.getFeaturedProjectsUrl, 'get');
export const setFeaturedProjects = createAsyncThunk(
      "project/setFeaturedProjects",
      async ({ projectIds }, { rejectWithValue, signal }) => {
            try {
                  const { request } = createRequest(
                        {
                              method: 'post',
                              url: `${baseUrl}${SummeryApi.setFeaturedProjectsUrl}`,
                              data: { projectIds },
                        },
                        15000
                  );
                  const response = await request;
                  return response.data;
            } catch (error) {
                  return rejectWithValue(handleAsyncError(error, 'Failed to set featured projects'));
            }
      }
);

const projectSlice = createSlice({
      name: "project",
      initialState,
      reducers: {
            clearProjectError: (state) => {
                  state.error = null;
            },
            resetProjectState: () => initialState,
            setCurrentProject: (state, action) => {
                  state.currentProject = action.payload;
            },
      },
      extraReducers: (builder) => {
            
            builder.addCase(getAllProjects.pending, (state) => {
                  state.loadingStates.fetchAll = true;
                  state.error = null;
            });
            builder.addCase(getAllProjects.fulfilled, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.projectsData = action.payload?.data || [];
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getAllProjects.rejected, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.error = action.payload;
            });

            
            builder.addCase(createProject.pending, (state) => {
                  state.loadingStates.create = true;
                  state.error = null;
            });
            builder.addCase(createProject.fulfilled, (state, action) => {
                  state.loadingStates.create = false;
                  if (action.payload?.data) {
                        state.projectsData.push(action.payload.data);
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(createProject.rejected, (state, action) => {
                  state.loadingStates.create = false;
                  state.error = action.payload;
            });

            
            builder.addCase(updateProjectById.pending, (state) => {
                  state.loadingStates.update = true;
                  state.error = null;
            });
            builder.addCase(updateProjectById.fulfilled, (state, action) => {
                  state.loadingStates.update = false;
                  const updated = action.payload?.data;
                  if (updated?._id) {
                        const idx = state.projectsData.findIndex(p => p._id === updated._id);
                        if (idx !== -1) {
                              state.projectsData[idx] = updated;
                        }
                        if (state.currentProject?._id === updated._id) {
                              state.currentProject = updated;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(updateProjectById.rejected, (state, action) => {
                  state.loadingStates.update = false;
                  state.error = action.payload;
            });

            
            builder.addCase(deleteProjectById.pending, (state) => {
                  state.loadingStates.delete = true;
                  state.error = null;
            });
            builder.addCase(deleteProjectById.fulfilled, (state, action) => {
                  state.loadingStates.delete = false;
                  if (action.meta.arg) {
                        state.projectsData = state.projectsData.filter(
                              item => item._id !== action.meta.arg
                        );
                        if (state.currentProject?._id === action.meta.arg) {
                              state.currentProject = null;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(deleteProjectById.rejected, (state, action) => {
                  state.loadingStates.delete = false;
                  state.error = action.payload;
            });

            
            builder.addCase(getFeaturedProjects.pending, (state) => {
                  state.loadingStates.fetchFeatured = true;
                  state.error = null;
            });
            builder.addCase(getFeaturedProjects.fulfilled, (state, action) => {
                  state.loadingStates.fetchFeatured = false;
                  state.featuredProjects = action.payload?.data || [];
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getFeaturedProjects.rejected, (state, action) => {
                  state.loadingStates.fetchFeatured = false;
                  state.error = action.payload;
            });

            
            builder.addCase(setFeaturedProjects.pending, (state) => {
                  state.loadingStates.setFeatured = true;
                  state.error = null;
            });
            builder.addCase(setFeaturedProjects.fulfilled, (state, action) => {
                  state.loadingStates.setFeatured = false;
                  state.featuredProjects = action.payload?.data || [];
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(setFeaturedProjects.rejected, (state, action) => {
                  state.loadingStates.setFeatured = false;
                  state.error = action.payload;
            });
      },
});

export const { clearProjectError, resetProjectState, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
