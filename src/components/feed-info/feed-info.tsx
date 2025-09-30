import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds } from '../../services/slices/ordersSlice';

import { RootState } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.orders);

  // Загружаем заказы при монтировании, если их нет
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  // Передаем все данные feed, если нужно
  const feed = { total: orders.length, totalToday: orders.length }; // Можно доработать под реальные данные

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
