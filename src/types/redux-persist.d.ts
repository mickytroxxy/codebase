import { PersistPartial } from 'redux-persist/es/persistReducer';
import { RootStateWithoutPersist } from '../state/store';

// Augment the PersistPartial type to include our state structure
declare module 'redux-persist/es/persistReducer' {
  export interface PersistPartial {
    _persist: { version: number; rehydrated: boolean };
    location: RootStateWithoutPersist['location'];
    globalVariables: RootStateWithoutPersist['globalVariables'];
    accountSlice: RootStateWithoutPersist['accountSlice'];
    requests: RootStateWithoutPersist['requests'];
    djs: RootStateWithoutPersist['djs'];
    clubs: RootStateWithoutPersist['clubs'];
    musicPlayer: RootStateWithoutPersist['musicPlayer'];
    cart: RootStateWithoutPersist['cart'];
    store: RootStateWithoutPersist['store'];
  }
}
