import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SummeryApi } from "../config/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      isLoading: false,
      contact: [],
      messages: [],
      error: null,
};

export const getContactDetails = createAsyncThunk(
      "contact/getContactDetails",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getContactDetailsUrl}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const addUpdateContactDetails = createAsyncThunk(
      "contact/addUpdateContactDetails",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.addUpdateContactDetailsUrl}`, formData, {
                        withCredentials: true,
                        headers: { "Content-Type": "multipart/form-data" },
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const sendContactMessage = createAsyncThunk(
      "contact/sendContactMessage",
      async (payload, { rejectWithValue }) => {
            try {
                  const response = await axios.post(`${baseUrl}${SummeryApi.sendMessageUrl}`, payload, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const getAllMessages = createAsyncThunk(
      "contact/getAllMessages",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(`${baseUrl}${SummeryApi.getAllMessagesUrl}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

export const deleteMessageById = createAsyncThunk(
      "contact/deleteMessageById",
      async (messageId, { rejectWithValue }) => {
            try {
                  const response = await axios.delete(`${baseUrl}${SummeryApi.deleteMessageUrl}${messageId}`, {
                        withCredentials: true,
                  });
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data);
            }
      }
);

const contactSlice = createSlice({
      name: "contact",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(getContactDetails.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getContactDetails.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.contact = action.payload?.data || [];
                        state.error = null;
                  })
                  .addCase(getContactDetails.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(addUpdateContactDetails.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(addUpdateContactDetails.fulfilled, (state, action) => {
                        state.isLoading = false;
                        const updated = action.payload?.data;
                        if (updated) {
                              if (state.contact && state.contact.length > 0) {
                                    state.contact[0] = updated;
                              } else {
                                    state.contact = [updated];
                              }
                        }
                        state.error = null;
                  })
                  .addCase(addUpdateContactDetails.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(sendContactMessage.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(sendContactMessage.fulfilled, (state) => {
                        state.isLoading = false;
                        state.error = null;
                  })
                  .addCase(sendContactMessage.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(getAllMessages.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getAllMessages.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.messages = action.payload?.data || [];
                        state.error = null;
                  })
                  .addCase(getAllMessages.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  })
                  .addCase(deleteMessageById.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(deleteMessageById.fulfilled, (state) => {
                        state.isLoading = false;
                        state.error = null;
                  })
                  .addCase(deleteMessageById.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload;
                  });
      },
});

export default contactSlice.reducer;