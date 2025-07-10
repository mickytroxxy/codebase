import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import location from './slices/location';
import modalData from './slices/modalData';
import accountSlice from './slices/accountInfo';
import ConfirmDialog from './slices/ConfirmDialog';
import modalState from './slices/modalState';
import camera from './slices/camera';
import globalVariables from './slices/globalVariables';

const rootReducer = combineReducers({
  location,globalVariables,modalData,accountSlice,ConfirmDialog,modalState, camera,
});

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  blacklist: ['modalData', 'modalState', 'camera', 'ConfirmDialog', 'game'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Define the state structure with all slices
export interface RootStateWithoutPersist {
  location: ReturnType<typeof location>;
  globalVariables: ReturnType<typeof globalVariables>;
  modalData: ReturnType<typeof modalData>;
  accountSlice: ReturnType<typeof accountSlice>;
  ConfirmDialog: ReturnType<typeof ConfirmDialog>;
  modalState: ReturnType<typeof modalState>;
  camera: ReturnType<typeof camera>;
}

// Define the persisted state type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);