import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import authReducer from './slices/authSlice';
import constructorBurgerReducer from './slices/constructorBurgerSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';

// объединяем все редьюсеры
const rootReducer = combineReducers({
  orders: ordersReducer,
  auth: authReducer,
  ingredients: ingredientsReducer,
  constructorBurger: constructorBurgerReducer
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
