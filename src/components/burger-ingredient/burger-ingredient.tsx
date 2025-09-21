import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import {
  setBun,
  addConstructorIngredient
} from '../../services/slices/burgerSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const makeUniqueId = (base: string) =>
      `${base}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        const bun: TConstructorIngredient = {
          ...ingredient,
          id: ingredient._id
        };
        dispatch(setBun(bun));
      } else {
        const con: TConstructorIngredient = {
          ...ingredient,
          id: makeUniqueId(ingredient._id)
        };
        dispatch(addConstructorIngredient(con));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
