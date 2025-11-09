import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SummeryApi } from "../config/api";
import { createRequest, handleAsyncError } from "./utils/asyncUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      loadingStates: {
            fetchAll: false,
            fetchById: false,
            create: false,
            update: false,
            delete: false,
            addSkill: false,
            updateSkill: false,
            deleteSkill: false,
      },
      skillsData: [],
      currentCategory: null,
      currentSkill: null,
      error: null,
      lastUpdated: null,
};


const createSkillThunk = (name, url, method = 'get', isFormData = false) => {
      return createAsyncThunk(
            `skills/${name}`,
            async (data, { rejectWithValue, signal }) => {
                  try {
                        const config = {
                              method,
                              url: typeof url === 'function' ? url(data) : `${baseUrl}${url}${data?.id || ''}`,
                        };

                        if (method !== 'get' && method !== 'delete') {
                              config.data = data?.formData || data?.skillData || data;
                        }

                        if (isFormData) {
                              config.headers = { "Content-Type": "multipart/form-data" };
                        }

                        const { request } = createRequest(config, 10000);
                        const response = await request;
                        return response.data?.data || response.data;
                  } catch (error) {
                        return rejectWithValue(handleAsyncError(error, `Failed to ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`));
                  }
            }
      );
};

export const createSkillCategory = createSkillThunk('createSkillCategory', SummeryApi.createSkillCategoryUrl, 'post');
export const getAllSkillCategories = createSkillThunk('getAllSkillCategories', SummeryApi.getAllSkillCategoriesUrl, 'get');
export const getSkillCategoryById = createSkillThunk('getSkillCategoryById', (id) => `${SummeryApi.getSkillCategoryUrl}${id}`, 'get');
export const deleteSkillCategory = createSkillThunk('deleteSkillCategory', (id) => `${SummeryApi.deleteSkillCategoryUrl}${id}`, 'delete');
export const addSkillToCategory = createSkillThunk('addSkillToCategory', (data) => `${SummeryApi.addSkillToCategoryUrl}${data.id}`, 'post');
export const updateSkillToCategory = createSkillThunk('updateSkillToCategory', 
      (data) => `${SummeryApi.updateSkillInCategoryUrl}${data.categoryId}/${data.skillId}`, 
      'put'
);
export const deleteSkillFromCategory = createSkillThunk('deleteSkillFromCategory', 
      (data) => `${SummeryApi.deleteSkillFromCategoryUrl}${data.categoryId}/${data.skillId}`, 
      'delete'
);

const skillsSlice = createSlice({
      name: "skills",
      initialState,
      reducers: {
            clearSkillError: (state) => {
                  state.error = null;
            },
            resetSkillState: () => initialState,
            setCurrentCategory: (state, action) => {
                  state.currentCategory = action.payload;
            },
            setCurrentSkill: (state, action) => {
                  state.currentSkill = action.payload;
            },
      },
      extraReducers: (builder) => {
            
            builder.addCase(createSkillCategory.pending, (state) => {
                  state.loadingStates.create = true;
                  state.error = null;
            });
            builder.addCase(createSkillCategory.fulfilled, (state, action) => {
                  state.loadingStates.create = false;
                  if (action.payload) {
                        state.skillsData.push(action.payload);
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(createSkillCategory.rejected, (state, action) => {
                  state.loadingStates.create = false;
                  state.error = action.payload;
            });

            
            builder.addCase(getAllSkillCategories.pending, (state) => {
                  state.loadingStates.fetchAll = true;
                  state.error = null;
            });
            builder.addCase(getAllSkillCategories.fulfilled, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.skillsData = action.payload || [];
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getAllSkillCategories.rejected, (state, action) => {
                  state.loadingStates.fetchAll = false;
                  state.error = action.payload;
            });

            
            builder.addCase(getSkillCategoryById.pending, (state) => {
                  state.loadingStates.fetchById = true;
                  state.error = null;
            });
            builder.addCase(getSkillCategoryById.fulfilled, (state, action) => {
                  state.loadingStates.fetchById = false;
                  state.currentCategory = action.payload || null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(getSkillCategoryById.rejected, (state, action) => {
                  state.loadingStates.fetchById = false;
                  state.error = action.payload;
            });

            
            builder.addCase(deleteSkillCategory.pending, (state) => {
                  state.loadingStates.delete = true;
                  state.error = null;
            });
            builder.addCase(deleteSkillCategory.fulfilled, (state, action) => {
                  state.loadingStates.delete = false;
                  if (action.meta.arg) {
                        state.skillsData = state.skillsData.filter(
                              category => category._id !== action.meta.arg
                        );
                        if (state.currentCategory?._id === action.meta.arg) {
                              state.currentCategory = null;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(deleteSkillCategory.rejected, (state, action) => {
                  state.loadingStates.delete = false;
                  state.error = action.payload;
            });

            
            builder.addCase(addSkillToCategory.pending, (state) => {
                  state.loadingStates.addSkill = true;
                  state.error = null;
            });
            builder.addCase(addSkillToCategory.fulfilled, (state, action) => {
                  state.loadingStates.addSkill = false;
                  const updatedCategory = action.payload;
                  if (updatedCategory?._id) {
                        const index = state.skillsData.findIndex(
                              category => category._id === updatedCategory._id
                        );
                        if (index !== -1) {
                              state.skillsData[index] = updatedCategory;
                        }
                        if (state.currentCategory?._id === updatedCategory._id) {
                              state.currentCategory = updatedCategory;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(addSkillToCategory.rejected, (state, action) => {
                  state.loadingStates.addSkill = false;
                  state.error = action.payload;
            });

            
            builder.addCase(updateSkillToCategory.pending, (state) => {
                  state.loadingStates.updateSkill = true;
                  state.error = null;
            });
            builder.addCase(updateSkillToCategory.fulfilled, (state, action) => {
                  state.loadingStates.updateSkill = false;
                  const updatedCategory = action.payload;
                  if (updatedCategory?._id) {
                        const index = state.skillsData.findIndex(
                              category => category._id === updatedCategory._id
                        );
                        if (index !== -1) {
                              state.skillsData[index] = updatedCategory;
                        }
                        if (state.currentCategory?._id === updatedCategory._id) {
                              state.currentCategory = updatedCategory;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(updateSkillToCategory.rejected, (state, action) => {
                  state.loadingStates.updateSkill = false;
                  state.error = action.payload;
            });

            
            builder.addCase(deleteSkillFromCategory.pending, (state) => {
                  state.loadingStates.deleteSkill = true;
                  state.error = null;
            });
            builder.addCase(deleteSkillFromCategory.fulfilled, (state, action) => {
                  state.loadingStates.deleteSkill = false;
                  const updatedCategory = action.payload;
                  if (updatedCategory?._id) {
                        const index = state.skillsData.findIndex(
                              category => category._id === updatedCategory._id
                        );
                        if (index !== -1) {
                              state.skillsData[index] = updatedCategory;
                        }
                        if (state.currentCategory?._id === updatedCategory._id) {
                              state.currentCategory = updatedCategory;
                        }
                  }
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(deleteSkillFromCategory.rejected, (state, action) => {
                  state.loadingStates.deleteSkill = false;
                  state.error = action.payload;
            });
      },
});

export const { 
      clearSkillError, 
      resetSkillState, 
      setCurrentCategory, 
      setCurrentSkill 
} = skillsSlice.actions;

export default skillsSlice.reducer;
