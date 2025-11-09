import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SummeryApi } from "../config/api";
import { createRequest, handleAsyncError } from "./utils/asyncUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      loadingStates: {
            fetchHeroData: false,
            updateHeroData: false,
      },
      heroData: null,
      error: null,
      lastUpdated: null,
};

export const addUpdateHeroData = createAsyncThunk(
      "hero/updateHeroData",
      async (formData, { rejectWithValue, signal }) => {
            try {
                  const { request } = createRequest(
                        {
                              method: 'post',
                              url: `${baseUrl}${SummeryApi.addUpdateHeroContentUrl}`,
                              data: formData,
                              headers: { "Content-Type": "multipart/form-data" },
                        },
                        15000
                  );

                  const response = await request;
                  return response.data;
            } catch (error) {
                  return rejectWithValue(handleAsyncError(error, 'Failed to update hero data'));
            }
      }
);

export const fetchHeroData = createAsyncThunk(
      "hero/fetchHeroData",
      async (_, { rejectWithValue, signal }) => {
            try {
                  const { request } = createRequest(
                        {
                              method: 'get',
                              url: `${baseUrl}${SummeryApi.getHeroContentUrl}`,
                        },
                        10000
                  );

                  const response = await request;
                  return response.data;
            } catch (error) {
                  return rejectWithValue(handleAsyncError(error, 'Failed to fetch hero data'));
            }
      }
);

const heroSlice = createSlice({
      name: "hero",
      initialState,
      reducers: {
            clearHeroError: (state) => {
                  state.error = null;
            },
            resetHeroLoadingState: (state, action) => {
                  if (state.loadingStates[action.payload]) {
                        state.loadingStates[action.payload] = false;
                  }
            },
      },
      extraReducers: (builder) => {

            builder.addCase(addUpdateHeroData.pending, (state) => {
                  state.loadingStates.updateHeroData = true;
                  state.error = null;
            });
            builder.addCase(addUpdateHeroData.fulfilled, (state, action) => {
                  state.loadingStates.updateHeroData = false;
                  state.heroData = action.payload?.data || null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(addUpdateHeroData.rejected, (state, action) => {
                  state.loadingStates.updateHeroData = false;
                  state.error = action.payload;
            });


            builder.addCase(fetchHeroData.pending, (state) => {
                  state.loadingStates.fetchHeroData = true;
                  state.error = null;
            });
            builder.addCase(fetchHeroData.fulfilled, (state, action) => {
                  state.loadingStates.fetchHeroData = false;
                  state.heroData = action.payload?.data || null;
                  state.error = null;
                  state.lastUpdated = new Date().toISOString();
            });
            builder.addCase(fetchHeroData.rejected, (state, action) => {
                  state.loadingStates.fetchHeroData = false;
                  state.error = action.payload;
            });
      },
});

export const { clearHeroError, resetHeroLoadingState } = heroSlice.actions;
export default heroSlice.reducer;