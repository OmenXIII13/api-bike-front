// src/pages/Menu/Menu.tsx
import { ChangeEvent, useEffect, useState } from 'react';
import Headling from '../../components/Headling/Headling';
import Search from '../../components/Search/Search';
import { PREFIX } from '../../helpers/API';
import { Product } from '../../interfaces/product.interface';
import styles from './Menu.module.css';
import axios, { AxiosError } from 'axios';
import { CategoryList } from './CategoryList/CategoryList';
import { MenuList } from './MenuList/MenuList';

export function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [filter, setFilter] = useState<string>();

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      
      const { data } = await axios.get<any[]>(`${PREFIX}/products`, {
        params: {
          limit: 50,
          offset: 0
        }
      });

      console.log('Products data from API:', data);

      // Просто используем тип из API, без определения
      const mapped: Product[] = data.map((p) => ({
        id: p.id?.toString() || p._id?.toString() || Math.random().toString(),
        name: p.name,
        description: p.description || '',
        price: p.price,
        ingredients: p.ingredients || [],
        image: p.image,
        rating: p.rating || 4.0,
        type: p.type || 'other' // Используем тип из API, если нет - ставим 'other'
      }));

      // Отладочная информация
      const typeStats = mapped.reduce((acc, product) => {
        acc[product.type] = (acc[product.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Статистика по типам из API:', typeStats);

      setProducts(mapped);
      setIsLoading(false);
    } catch (e) {
      console.error('Error loading products:', e);
      setIsLoading(false);
      
      if (e instanceof AxiosError) {
        setError(`Ошибка загрузки продуктов: ${e.message}`);
      } else {
        setError('Неизвестная ошибка при загрузке продуктов');
      }
    }
  };

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredProducts = products.filter((p) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.ingredients.join(', ').toLowerCase().includes(q) ||
      (p.type && p.type.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className={styles['head']}>
        <Headling>Меню</Headling>
        <Search placeholder='Введите блюдо или состав' onChange={updateFilter} />
      </div>
      <div>
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            marginBottom: '20px', 
            padding: '15px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px'
          }}>
            {error}
            <br />
            <button 
              onClick={getMenu}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Попробовать снова
            </button>
          </div>
        )}
        
        {/* Показываем категории когда нет фильтра */}
        {!isLoading && filteredProducts.length > 0 && !filter && (
          <CategoryList products={filteredProducts} />
        )}
        
        {/* Показываем обычный список когда есть фильтр */}
        {!isLoading && filteredProducts.length > 0 && filter && (
          <MenuList products={filteredProducts} />
        )}
        
        {isLoading && (
          <div className={styles['loading']}>
            <div className={styles['loading-spinner']}></div>
            <p>Загружаем вкусняшки...</p>
          </div>
        )}
        
        {!isLoading && filteredProducts.length === 0 && products.length > 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>Не найдено блюд по запросу "{filter}"</div>
        )}
        
        {!isLoading && products.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '40px' }}>Нет доступных продуктов</div>
        )}
      </div>
    </>
  );
}

export default Menu;