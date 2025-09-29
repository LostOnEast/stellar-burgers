import { FC, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds, fetchOrders } from '../../services/slices/ordersSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isFeedPage = location.pathname.startsWith('/feed');
  const isProfileOrdersPage = location.pathname.startsWith('/profile/orders');

  const { ingredients, loading } = useSelector(
    (state: RootState) => state.ingredients
  );
  const { orders, userOrders } = useSelector(
    (state: RootState) => state.orders
  );

  // Подгружаем заказы и ингредиенты
  useEffect(() => {
    if (isFeedPage && !orders.length) {
      dispatch(fetchFeeds());
    }
    if (isProfileOrdersPage && !userOrders.length) {
      dispatch(fetchOrders());
    }
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [
    dispatch,
    isFeedPage,
    isProfileOrdersPage,
    orders.length,
    userOrders.length,
    ingredients.length
  ]);

  // Получаем orderId из URL
  const orderId = useMemo(() => {
    const match = location.pathname.match(
      /\/(?:feed|profile\/orders)\/([^/]+)/
    );
    return match ? Number(match[1]) : null;
  }, [location.pathname]);

  // Выбираем источник заказов в зависимости от страницы
  const orderData: TOrder | undefined = useMemo(() => {
    const source = isFeedPage ? orders : userOrders;
    if (!source.length || !orderId) return undefined;
    return source.find((order) => order.number === orderId);
  }, [isFeedPage, orders, userOrders, orderId]);

  // Формируем данные для UI
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
