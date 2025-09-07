// store/slices/burgerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as burgerApi from '@api';
import { TIngredient, TOrder, TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  items: TConstructorIngredient[]; // добавляемые (каждый с уникальным id)
}

interface BurgerState {
  ingredients: TIngredient[];
  orders: TOrder[];
  loading: boolean;
  error: string | null;

  // constructor + order state
  constructor: ConstructorState;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: BurgerState = {
  ingredients: [],
  orders: [],
  loading: false,
  error: null,
  constructor: {
    bun: null,
    items: []
  },
  orderRequest: false,
  orderModalData: null
};

// Thunk для загрузки ингредиентов (твой уже существующий)
export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await burgerApi.getIngredientsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ингредиентов');
    }
  }
);

// Thunk для отправки заказа
export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { rejectValue: string; state: any }
>('burger/createOrder', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const constructor: ConstructorState = state.burger.constructor;
    if (!constructor.bun) {
      return rejectWithValue('Булка не выбрана');
    }

    // Обычно API ожидает список id: булка + начинки.
    // Часто булку добавляют 2 раза (верх+низ). Если ваш API ожидает иначе — поменяйте.
    const ingredientIds: string[] = [
      constructor.bun._id,
      ...constructor.items.map((i) => i._id),
      constructor.bun._id
    ];

    const data = await burgerApi.orderBurgerApi(ingredientIds);
    // orderBurgerApi возвращает обёртку с .order
    if (data && data.order) {
      return data.order;
    }
    return rejectWithValue('Ошибка ответа сервера при создании заказа');
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка создания заказа');
  }
});

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    // Управление конструктором
    setBun(state, action: PayloadAction<TConstructorIngredient | null>) {
      state.constructor.bun = action.payload;
    },
    addConstructorIngredient(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      state.constructor.items.push(action.payload);
    },
    removeConstructorIngredient(state, action: PayloadAction<string>) {
      state.constructor.items = state.constructor.items.filter(
        (i) => i.id !== action.payload
      );
    },
    clearConstructor(state) {
      state.constructor = { bun: null, items: [] };
    },

    // закрыть модалку
    closeOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ингредиенты
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchIngredients.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
          state.orders.push(action.payload);
          // очистим конструктор после успешного заказа
          state.constructor = { bun: null, items: [] };
        }
      )
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.orderRequest = false;
        state.error = action.payload;
      });
  }
});

export const {
  setBun,
  addConstructorIngredient,
  removeConstructorIngredient,
  clearConstructor,
  closeOrderModal
} = burgerSlice.actions;

export default burgerSlice.reducer;
