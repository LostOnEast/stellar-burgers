import { forwardRef, useMemo } from 'react';
import { useSelector, RootState } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Берём текущие ингредиенты конструктора из стора
  const burgerConstructor = useSelector(
    (state: RootState) => state._constructor
  );

  const ingredientsCounters = useMemo(() => {
    const { bun, items } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    console.log('Проверка данных из стора');
    console.log(items);
    items.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    if (bun) counters[bun._id] = 2; // булка считается дважды
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});

IngredientsCategory.displayName = 'IngredientsCategory';
