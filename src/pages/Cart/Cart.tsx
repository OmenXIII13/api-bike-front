// src/pages/Cart/Cart.tsx
import styles from './Cart.module.css';
import Headling from '../../components/Headling/Headling';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import CartItem from '../../components/CartItem/CartItem';
import { cartActions } from '../../store/cart.slice';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DELIVERY_FEE = 169;

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((s: RootState) => s.cart.items);
  const jwt = useSelector((s: RootState) => s.user.jwt);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((acc, item) => acc + (item.price * item.count), 0);

  const clearCart = () => {
    dispatch(cartActions.clear());
  };

  const checkout = async () => {
    if (!jwt) {
      navigate('/auth/login');
      return;
    }

    if (items.length === 0) {
      alert('Корзина пуста');
      return;
    }

    // Демо-оформление заказа без API
    alert(`Заказ оформлен! Сумма: ${total + DELIVERY_FEE} ₽`);
    dispatch(cartActions.clear());
    navigate('/success');
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  if (!mounted) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <Button 
          onClick={handleBackToMenu}
          className={styles['backButton']}
        >
          ← Назад к меню
        </Button>
        <Headling>Корзина</Headling>
      </div>
      
      {items.length === 0 ? (
        <div className={styles['empty']}>
  {/* Контурная иконка корзины */}
  <div className={styles['emptyIcon']}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18l-2 10H5L3 6z"/>
      <path d="M3 6l-1-3"/>
      <circle cx="9" cy="20" r="1"/>
      <circle cx="18" cy="20" r="1"/>
    </svg>
  </div>
  
  <h3>Корзина пуста</h3>
  <p>Добавьте товары из меню</p>
  <Button appearence="big" onClick={() => navigate('/')}>
    Перейти к меню
  </Button>
</div>
) : (
        <>
          {items.map(item => (
            <CartItem 
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              count={item.count}
            />
          ))}
          
          <div className={styles['total']}>
            <div className={styles['row']}>
              <div>Итог</div>
              <div>{total} ₽</div>
            </div>
            <hr className={styles['hr']} />
            <div className={styles['row']}>
              <div>Доставка</div>
              <div>{DELIVERY_FEE} ₽</div>
            </div>
            <hr className={styles['hr']} />
            <div className={styles['row']}>
              <div>Итог <span className={styles['count']}>({items.reduce((acc, item) => acc + item.count, 0)})</span></div>
              <div>{total + DELIVERY_FEE} ₽</div>
            </div>
          </div>
          
          <div className={styles['actions']}>
            <Button appearence="big" onClick={checkout}>
              Оформить заказ
            </Button>
            <Button onClick={clearCart}>
              Очистить корзину
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;