import { Product } from '../../../interfaces/product.interface';
import { MenuList } from '../MenuList/MenuList';
import styles from './CategoryList.module.css';
import { useState } from 'react';

interface CategoryListProps {
	products: Product[];
}

export function CategoryList({ products }: CategoryListProps) {
	// Состояние для отслеживания открытых категорий
	const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
		pizza: true, // По умолчанию открыта первая категория
		snack: false,
		drink: false,
		dessert: false,
		other: false
	});

	// Группируем продукты по типам
	const productsByType = products.reduce((acc, product) => {
		const type = product.type || 'other';
		if (!acc[type]) {
			acc[type] = [];
		}
		acc[type].push(product);
		return acc;
	}, {} as Record<string, Product[]>);

	// Названия категорий для отображения
	const categoryNames: Record<string, string> = {
		pizza: '🍕 Пиццы',
		drink: '🥤 Напитки',
		snack: '🍟 Закуски',
		dessert: '🍰 Десерты',
		other: '📦 Другое'
	};

	// Порядок отображения категорий
	const categoryOrder = ['pizza', 'snack', 'drink', 'dessert', 'other'];

	// Функция для переключения категории
	const toggleCategory = (category: string) => {
		setOpenCategories(prev => ({
			...prev,
			[category]: !prev[category]
		}));
	};

	// Функция для разворачивания/сворачивания всех категорий
	const toggleAllCategories = (open: boolean) => {
		const newState: Record<string, boolean> = {};
		categoryOrder.forEach(category => {
			newState[category] = open;
		});
		setOpenCategories(newState);
	};

	return (
		<div className={styles['categories']}>
			{/* Кнопки управления всеми категориями */}
			<div className={styles['categoryControls']}>
				<button 
					className={styles['controlButton']}
					onClick={() => toggleAllCategories(true)}
				>
					Развернуть все
				</button>
				<button 
					className={styles['controlButton']}
					onClick={() => toggleAllCategories(false)}
				>
					Свернуть все
				</button>
			</div>

			{categoryOrder.map(category => {
				const categoryProducts = productsByType[category];
				if (!categoryProducts || categoryProducts.length === 0) return null;

				const isOpen = openCategories[category];

				return (
					<div key={category} className={styles['category']}>
						<button 
							className={styles['categoryHeader']}
							onClick={() => toggleCategory(category)}
						>
							<div className={styles['categoryTitle']}>
								{categoryNames[category]}
								<span className={styles['count']}>({categoryProducts.length})</span>
							</div>
							<div className={styles['arrow']}>
								{isOpen ? '▼' : '▶'}
							</div>
						</button>
						
						<div className={`${styles['categoryContent']} ${isOpen ? styles['open'] : ''}`}>
							<MenuList products={categoryProducts} />
						</div>
					</div>
				);
			})}
		</div>
	);
}