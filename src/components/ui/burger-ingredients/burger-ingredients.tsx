import { FC, memo, RefObject } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';

import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '@components';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => {
    // Обработчик клика на таб
    const handleTabClick = (val: string) => {
      onTabClick(val);

      let targetRef: RefObject<HTMLHeadingElement> | null = null;
      if (val === 'bun') targetRef = titleBunRef;
      else if (val === 'main') targetRef = titleMainRef;
      else if (val === 'sauce') targetRef = titleSaucesRef;

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    return (
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value='bun'
              active={currentTab === 'bun'}
              onClick={handleTabClick}
            >
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={handleTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={handleTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div className={styles.content}>
          <IngredientsCategory
            title='Булки'
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
          />
          <IngredientsCategory
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
          />
          <IngredientsCategory
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
          />
        </div>
      </section>
    );
  }
);
