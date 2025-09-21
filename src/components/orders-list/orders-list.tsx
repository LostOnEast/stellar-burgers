import { FC, useEffect, memo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { useDispatch, useSelector, RootState } from '../../services/store';
import {
  fetchFeeds,
  fetchOrders,
  fetchIngredients
} from '../../services/slices/burgerSlice';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const dispatch = useDispatch();

  const { ingredients, loading } = useSelector(
    (state: RootState) => state.burger
  );
  // Подгружаем ингредиенты для подсветки заказов
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
