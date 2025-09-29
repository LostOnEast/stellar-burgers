import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeConstructorIngredient,
  moveConstructorIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = () => {
      if (index > 0) {
        // dispatch(
        //   moveConstructorIngredient({ fromIndex: index, toIndex: index - 1 })
        // );
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        // dispatch(
        //   moveConstructorIngredient({ fromIndex: index, toIndex: index + 1 })
        // );
      }
    };

    const handleClose = () => {
      //dispatch(removeConstructorIngredient(ingredient.id)); // используем id
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
