// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import burgerReducer from './slices/burgerSlice';
import authReducer from './slices/authSlice';
import ingredientsReducer from './slices/ingredientsSlice';

// объединяем все редьюсеры
const rootReducer = combineReducers({
  burger: burgerReducer,
  ingredients: ingredientsReducer,
  auth: authReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// типы
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// кастомные хуки
export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
