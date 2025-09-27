// store/slices/burgerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as burgerApi from '@api';
import { TIngredient, TOrder, TConstructorIngredient } from '@utils-types';

// состояние конструктора
interface ConstructorState {
  bun: TConstructorIngredient | null;
  items: TConstructorIngredient[];
}

interface BurgerState {
  ingredients: TIngredient[];
  orders: TOrder[];
  userOrders: TOrder[];
  loading: boolean;
  error: string | null;

  constructor: ConstructorState;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: BurgerState = {
  ingredients: [],
  orders: [],
  userOrders: [],
  loading: false,
  error: null,
  constructor: {
    bun: null,
    items: []
  },
  orderRequest: false,
  orderModalData: null
};

// Загрузка ингредиентов
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

// Загрузка ленты заказов
export const fetchFeeds = createAsyncThunk(
  'burger/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await burgerApi.getFeedsApi();
      return data.orders;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);
// Загрузка ленты заказов пользователя
export const fetchOrders = createAsyncThunk(
  'burger/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await burgerApi.getOrdersApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);
// Создание заказа
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

    const ingredientIds: string[] = [
      constructor.bun._id,
      ...constructor.items.map((i) => i._id),
      constructor.bun._id
    ];

    const data = await burgerApi.orderBurgerApi(ingredientIds);
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
    moveConstructorIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.constructor.items.splice(fromIndex, 1);
      state.constructor.items.splice(toIndex, 0, movedItem);
    },

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
    closeOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchIngredients
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

      // fetchFeeds
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

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
  moveConstructorIngredient,
  removeConstructorIngredient,
  clearConstructor,
  closeOrderModal
} = burgerSlice.actions;

export default burgerSlice.reducer;
