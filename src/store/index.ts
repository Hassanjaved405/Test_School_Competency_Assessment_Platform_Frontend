import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import assessmentReducer from './slices/assessmentSlice';
import { authApi } from './api/authApi';
import { assessmentApi } from './api/assessmentApi';
import { adminApi } from './api/adminApi';
import { questionApi } from './api/questionApi';
import { certificateApi } from './api/certificateApi';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  assessment: assessmentReducer,
  [authApi.reducerPath]: authApi.reducer,
  [assessmentApi.reducerPath]: assessmentApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(assessmentApi.middleware)
      .concat(adminApi.middleware)
      .concat(questionApi.middleware)
      .concat(certificateApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;