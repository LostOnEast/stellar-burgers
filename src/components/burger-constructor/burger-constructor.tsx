// components/BurgerConstructor.tsx
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/burgerSlice';
import { TConstructorIngredient, TOrder } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { constructor, orderRequest, orderModalData } = useSelector(
    (s) => s.burger
  );

  const constructorItems = {
    bun: constructor.bun,
    ingredients: constructor.items
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
