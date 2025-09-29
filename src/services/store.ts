// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
//import burgerReducer from './slices/burgerSlice';
import authReducer from './slices/authSlice';
//import constructorReducer from './slices/constructorSlice';
import _constructorReducer from './slices/_constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';

// объединяем все редьюсеры
const rootReducer = combineReducers({
  //burger: burgerReducer,
  orders: ordersReducer,
  auth: authReducer,
  ingredients: ingredientsReducer,
  //constructor: constructorReducer,
  _constructor: _constructorReducer
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
