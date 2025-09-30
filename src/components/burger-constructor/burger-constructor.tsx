// components/BurgerConstructor.tsx
import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/ordersSlice';
import { TConstructorIngredient, TOrder } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { orderRequest, orderModalData } = useSelector((s) => s.orders);
  const constructor = useSelector((s: RootState) => s.constructorBurger);

  const navigate = useNavigate();
  const isAuth = Boolean(localStorage.getItem('accessToken'));
  const constructorItems = {
    bun: constructor.bun,
    ingredients: constructor.items || []
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    // диспатчим thunk — createOrder возьмёт данные из state.burger.constructor
    dispatch(createOrder());
  };

  const handleCloseModal = () => dispatch(closeOrderModal());

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      price={price}
      orderRequest={orderRequest}
      orderModalData={orderModalData as TOrder | null}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
