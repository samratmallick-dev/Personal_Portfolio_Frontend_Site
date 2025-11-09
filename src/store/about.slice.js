import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SummeryApi } from "../config/api";
import { createRequest, handleAsyncError, createAsyncReducer, createThunkMatcher } from "./utils/asyncUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      loadingStates: {
            fetchAboutData: false,
            addUpdateAboutData: false,
      },
      aboutData: null,
      error: null,
      lastUpdated: null,
};

export const addUpdateAboutData = createAsyncThunk(
      "about/updateAboutData",
      async (formData, { rejectWithValue, signal }) => {
            try {
                  const { request } = createRequest(
                        {
                              method: 'post',
                              url: `${baseUrl}${SummeryApi.addUpdateAboutContentUrl}`,
                              data: formData,
                              headers: { "Content-Type": "multipart/form-data" },
                        },
                        15000 
                  );

                  const response = await request;
                  return response.data;
            } catch (error) {
                  return rejectWithValue(handleAsyncError(error, 'Failed to update about data'));
            }
      }
);

export const fetchAboutData = createAsyncThunk(
      "about/fetchAboutData",
      async (_, { rejectWithValue, signal }) => {
            try {
                  const { request } = createRequest(
                        {
                              method: 'get',
                              url: `${baseUrl}${SummeryApi.getAboutContentUrl}`,
                        },
                        10000 
                  );

                  const response = await request;
                  return response.data;
            } catch (error) {
                  return rejectWithValue(handleAsyncError(error, 'Failed to fetch about data'));
            }
      }
);

const aboutSlice = createSlice({
      name: "about",
      initialState,
      reducers: {
            clearAboutError: (state) => {
                  state.error = null;
            },
            resetAboutLoadingState: (state, action) => {
                  if (state.loadingStates[action.payload]) {
                        state.loadingStates[action.payload] = false;
                  }
            },
      },
      extraReducers: (builder) => {
            builder
                  .addMatcher(
                        (action) => action.type.includes('about/'),
                        (state, action) => {
                        }
                  )
                  .addMatcher(
                        (action) => action.type.includes('fetchAboutData'),
                        (state, action) => {
                              const reducer = createAsyncReducer(fetchAboutData, 'fetchAboutData');
                              if (action.type.endsWith('/pending')) return reducer[fetchAboutData.pending](state);
                              if (action.type.endsWith('/fulfilled')) {
                                    reducer[fetchAboutData.fulfilled](state, action);
                                    if (action.payload?.data) {
                                          state.aboutData = action.payload.data;
                                    }
                              }
                              if (action.type.endsWith('/rejected')) return reducer[fetchAboutData.rejected](state, action);
                        }
                  )
                  .addMatcher(
                        (action) => action.type.includes('updateAboutData'),
                        (state, action) => {
                              const reducer = createAsyncReducer(addUpdateAboutData, 'addUpdateAboutData');
                              if (action.type.endsWith('/pending')) return reducer[addUpdateAboutData.pending](state);
                              if (action.type.endsWith('/fulfilled')) {
                                    reducer[addUpdateAboutData.fulfilled](state, action);
                                    if (action.payload?.data) {
                                          state.aboutData = action.payload.data;
                                    }
                              }
                              if (action.type.endsWith('/rejected')) return reducer[addUpdateAboutData.rejected](state, action);
                        }
                  );
      },
});

export const { clearAboutError, resetAboutLoadingState } = aboutSlice.actions;
export default aboutSlice.reducer;