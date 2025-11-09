import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SummeryApi } from "../config/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
      
      loadingStates: {
            getContactDetails: false,
            addUpdateContactDetails: false,
            sendContactMessage: false,
            getAllMessages: false,
            deleteMessage: false,
      },
      contact: [],
      messages: [],
      error: null,
      lastUpdated: null,
};


const withTimeout = (promise, ms = 10000) => {
      return Promise.race([
            promise,
            new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Request timed out')), ms)
            )
      ]);
};

export const getContactDetails = createAsyncThunk(
      "contact/getContactDetails",
      async (_, { rejectWithValue, signal }) => {
            try {
                  const source = axios.CancelToken.source();

                  
                  if (signal) {
                        signal.addEventListener('abort', () => {
                              source.cancel('Operation canceled by the user');
                        });
                  }

                  const response = await withTimeout(
                        axios.get(`${baseUrl}${SummeryApi.getContactDetailsUrl}`, {
                              withCredentials: true,
                              cancelToken: source.token,
                        }),
                        10000 
                  );

                  return response.data;
            } catch (error) {
                  if (axios.isCancel(error)) {
                        return rejectWithValue('Request canceled');
                  }
                  return rejectWithValue(error.response?.data?.message || "Failed to fetch contact details");
            }
      }
);

export const addUpdateContactDetails = createAsyncThunk(
      "contact/addUpdateContactDetails",
      async (formData, { rejectWithValue }) => {
            try {
                  const response = await withTimeout(
                        axios.post(`${baseUrl}${SummeryApi.addUpdateContactDetailsUrl}`, formData, {
                              withCredentials: true,
                              headers: { "Content-Type": "multipart/form-data" },
                        }),
                        10000 
                  );
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data?.message || "Failed to update contact details");
            }
      }
);

export const sendContactMessage = createAsyncThunk(
      "contact/sendContactMessage",
      async (payload, { rejectWithValue }) => {
            try {
                  console.log('Sending contact form data:', payload);
                  
                  const response = await withTimeout(
                        axios.post(`${baseUrl}${SummeryApi.sendMessageUrl}`, payload, {
                              withCredentials: true,
                              headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                              },
                              validateStatus: (status) => status < 500 // Reject only if the status code is greater than or equal to 500
                        }),
                        15000 // Increased timeout to 15 seconds
                  );

                  console.log('Contact form submission successful:', response.data);
                  return response.data;
            } catch (error) {
                  console.error('Error sending contact form:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        headers: error.response?.headers,
                        config: {
                              url: error.config?.url,
                              method: error.config?.method,
                              data: error.config?.data,
                              headers: error.config?.headers
                        }
                  });

                  const errorMessage = error.response?.data?.message || 
                                    error.message || 
                                    'Failed to send message. Please try again later.';
                  
                  return rejectWithValue(errorMessage);
            }
      }
);

export const getAllMessages = createAsyncThunk(
      "contact/getAllMessages",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await withTimeout(
                        axios.get(`${baseUrl}${SummeryApi.getAllMessagesUrl}`, {
                              withCredentials: true,
                        }),
                        10000 
                  );
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
            }
      }
);

export const deleteMessageById = createAsyncThunk(
      "contact/deleteMessageById",
      async (messageId, { rejectWithValue }) => {
            try {
                  const response = await withTimeout(
                        axios.delete(`${baseUrl}${SummeryApi.deleteMessageUrl}/${messageId}`, {
                              withCredentials: true,
                        }),
                        10000 
                  );
                  return response.data;
            } catch (error) {
                  return rejectWithValue(error.response?.data?.message || "Failed to delete message");
            }
      }
);


const createAsyncReducer = (thunk, key) => ({
      [thunk.pending]: (state) => {
            state.loadingStates[key] = true;
            state.error = null;
      },
      [thunk.fulfilled]: (state, action) => {
            state.loadingStates[key] = false;
            state.error = null;
            state.lastUpdated = new Date().toISOString();

            
            const type = action.type.replace('/fulfilled', '');
            const payload = action.payload?.data;

            switch (type) {
                  case 'contact/getContactDetails':
                        state.contact = payload || [];
                        break;

                  case 'contact/addUpdateContactDetails':
                        if (payload) {
                              if (state.contact.length > 0) {
                                    state.contact[0] = payload;
                              } else {
                                    state.contact = [payload];
                              }
                        }
                        break;

                  case 'contact/getAllMessages':
                        state.messages = payload || [];
                        break;

                  case 'contact/deleteMessageById':
                        
                        state.messages = state.messages.filter(msg =>
                              msg._id !== action.meta.arg
                        );
                        break;

                  default:
                        break;
            }
      },
      [thunk.rejected]: (state, action) => {
            state.loadingStates[key] = false;
            state.error = {
                  message: action.payload || action.error.message,
                  action: key,
                  timestamp: new Date().toISOString()
            };
      },
});

const contactSlice = createSlice({
      name: "contact",
      initialState,
      reducers: {
            
            clearError: (state) => {
                  state.error = null;
            },
            
            resetLoadingState: (state, action) => {
                  if (state.loadingStates[action.payload]) {
                        state.loadingStates[action.payload] = false;
                  }
            },
      },
      extraReducers: (builder) => {
            
            builder
                  .addMatcher(
                        (action) => action.type.endsWith('/pending') ||
                              action.type.endsWith('/fulfilled') ||
                              action.type.endsWith('/rejected'),
                        (state, action) => {
                              
                        }
                  )
                  
                  .addMatcher(
                        (action) => action.type.includes('getContactDetails'),
                        (state, action) => {
                              const reducer = createAsyncReducer(getContactDetails, 'getContactDetails');
                              if (action.type.endsWith('/pending')) return reducer[getContactDetails.pending](state);
                              if (action.type.endsWith('/fulfilled')) return reducer[getContactDetails.fulfilled](state, action);
                              if (action.type.endsWith('/rejected')) return reducer[getContactDetails.rejected](state, action);
                        }
                  )
                  .addMatcher(
                        (action) => action.type.includes('addUpdateContactDetails'),
                        (state, action) => {
                              const reducer = createAsyncReducer(addUpdateContactDetails, 'addUpdateContactDetails');
                              if (action.type.endsWith('/pending')) return reducer[addUpdateContactDetails.pending](state);
                              if (action.type.endsWith('/fulfilled')) return reducer[addUpdateContactDetails.fulfilled](state, action);
                              if (action.type.endsWith('/rejected')) return reducer[addUpdateContactDetails.rejected](state, action);
                        }
                  )
                  .addMatcher(
                        (action) => action.type.includes('sendContactMessage'),
                        (state, action) => {
                              const reducer = createAsyncReducer(sendContactMessage, 'sendContactMessage');
                              if (action.type.endsWith('/pending')) return reducer[sendContactMessage.pending](state);
                              if (action.type.endsWith('/fulfilled')) return reducer[sendContactMessage.fulfilled](state, action);
                              if (action.type.endsWith('/rejected')) return reducer[sendContactMessage.rejected](state, action);
                        }
                  )
                  .addMatcher(
                        (action) => action.type.includes('getAllMessages'),
                        (state, action) => {
                              const reducer = createAsyncReducer(getAllMessages, 'getAllMessages');
                              if (action.type.endsWith('/pending')) return reducer[getAllMessages.pending](state);
                              if (action.type.endsWith('/fulfilled')) return reducer[getAllMessages.fulfilled](state, action);
                              if (action.type.endsWith('/rejected')) return reducer[getAllMessages.rejected](state, action);
                        }
                  )
                  .addMatcher(
                        (action) => action.type.includes('deleteMessageById'),
                        (state, action) => {
                              const reducer = createAsyncReducer(deleteMessageById, 'deleteMessage');
                              if (action.type.endsWith('/pending')) return reducer[deleteMessageById.pending](state);
                              if (action.type.endsWith('/fulfilled')) return reducer[deleteMessageById.fulfilled](state, action);
                              if (action.type.endsWith('/rejected')) return reducer[deleteMessageById.rejected](state, action);
                        }
                  );
      },
});

export const { clearError, resetLoadingState } = contactSlice.actions;

export default contactSlice.reducer;