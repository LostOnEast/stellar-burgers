import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
//import { v4 as uuidv4 } from 'uuid';
import {
  setBun,
  addConstructorIngredient
} from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const makeUniqueId = (base: string) =>
      `${base}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const handleAdd = () => {
      console.log('BurgerIngredient');
      console.log(ingredient);
      if (ingredient.type === 'bun') {
        const bun: TConstructorIngredient = {
          ...ingredient,
          id: ingredient._id
        };
        dispatch(setBun(bun));
        //dispatch(setBun({ ...bun, id: uuidv4() }));
      } else {
        const con: TConstructorIngredient = {
          ...ingredient,
          id: makeUniqueId(ingredient._id)
        };
        dispatch(addConstructorIngredient(con));
        //dispatch(addConstructorIngredient({ ...ingredient, id: uuidv4() }));
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
