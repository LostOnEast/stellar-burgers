import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  items: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  items: []
};

const constructorBurgerSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient | null>) {
      console.log(action.payload);
      console.log('state');
      console.log(state.items);
      state.bun = action.payload;
    },
    addConstructorIngredient(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      state.items.push({ ...action.payload, id: uuidv4() });
      //state.items.push(action.payload);
    },
    removeConstructorIngredient(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    moveConstructorIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.items.splice(fromIndex, 1);
      state.items.splice(toIndex, 0, movedItem);
    },
    clearConstructor(state) {
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
} = constructorBurgerSlice.actions;
export default constructorBurgerSlice.reducer;
