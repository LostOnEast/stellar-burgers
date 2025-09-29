import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  items: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  items: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action) {
      state.bun = action.payload;
    },
    addConstructorIngredient(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      state.items.push(action.payload);
    },
    clearConstructor(state) {
      state.bun = null;
      state.items = [];
    },
    moveConstructorIngredient(state) {
      state.bun = null;
      state.items = [];
    },
    removeConstructorIngredient(state) {
      state.bun = null;
      state.items = [];
    }
  }
});

export const {
  setBun,
  addConstructorIngredient,
  removeConstructorIngredient,
  moveConstructorIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
