import { FC, useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!userOrders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch, userOrders.length]);

  if (loading && !userOrders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
