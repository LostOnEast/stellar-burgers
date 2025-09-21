import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchFeeds } from '../../services/slices/burgerSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.burger);

  // Загружаем заказы при монтировании, если их нет
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
