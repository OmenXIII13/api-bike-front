// src/pages/Profile/Profile.tsx
import styles from './Profile.module.css';
import Headling from '../../components/Headling/Headling';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { useEffect, useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  title: string;
  street: string;
  house: string;
  building?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  comment?: string;
}

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, jwt } = useSelector((s: RootState) => s.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    title: '',
    street: '',
    house: '',
    building: '',
    entrance: '',
    floor: '',
    apartment: '',
    comment: ''
  });

  // Функция для получения отображаемого имени
  const getDisplayName = (): string => {
    // 1. Из профиля (основной источник)
    if (profile?.name) {
      return profile.name;
    }
    
    // 2. Из localStorage с привязкой к email
    if (profile?.email) {
      const savedName = localStorage.getItem(`userName_${profile.email}`);
      if (savedName) {
        return savedName;
      }
      
      // 3. Fallback - из email
      const username = profile.email.split('@')[0];
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    return 'Пользователь';
  };

  // Загружаем адреса из localStorage при монтировании
  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Сохраняем адреса в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const handleAddAddress = () => {
    if (!newAddress.title || !newAddress.street || !newAddress.house) {
      alert('Заполните обязательные поля: название, улица и дом');
      return;
    }

    const address: Address = {
      ...newAddress,
      id: Date.now().toString()
    };

    setAddresses(prev => [...prev, address]);
    setNewAddress({
      title: '',
      street: '',
      house: '',
      building: '',
      entrance: '',
      floor: '',
      apartment: '',
      comment: ''
    });
    setIsEditing(false);
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  if (!jwt) {
    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          <Button 
            onClick={handleBackToMenu}
            className={styles['backButton']}
          >
            ← Назад к меню
          </Button>
          <Headling>Профиль</Headling>
        </div>
        <div className={styles['notAuth']}>
          <p>Для просмотра профиля необходимо авторизоваться</p>
        </div>
      </div>
    );
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
        <Headling>Профиль пользователя</Headling>
      </div>
      
      <div className={styles['profileInfo']}>
        <div className={styles['infoCard']}>
          <h3>Личная информация</h3>
          <div className={styles['infoRow']}>
            <span className={styles['label']}>Имя:</span>
            <span className={styles['value']}>{getDisplayName()}</span>
          </div>
          <div className={styles['infoRow']}>
            <span className={styles['label']}>Email:</span>
            <span className={styles['value']}>{profile?.email || 'Не указан'}</span>
          </div>
        </div>

        <div className={styles['addressesSection']}>
          <div className={styles['sectionHeader']}>
            <h3>Мои адреса</h3>
            <Button 
              appearence="small" 
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            >
              + Добавить адрес
            </Button>
          </div>

          {isEditing && (
            <div className={styles['addAddressForm']}>
              <h4>Новый адрес</h4>
              <div className={styles['formGrid']}>
                <Input
                  placeholder="Название адреса (например: Дом, Работа)"
                  value={newAddress.title}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  placeholder="Улица *"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                />
                <Input
                  placeholder="Номер дома *"
                  value={newAddress.house}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, house: e.target.value }))}
                />
                <Input
                  placeholder="Корпус (необязательно)"
                  value={newAddress.building}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, building: e.target.value }))}
                />
                <Input
                  placeholder="Подъезд (необязательно)"
                  value={newAddress.entrance}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, entrance: e.target.value }))}
                />
                <Input
                  placeholder="Этаж (необязательно)"
                  value={newAddress.floor}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, floor: e.target.value }))}
                />
                <Input
                  placeholder="Квартира (необязательно)"
                  value={newAddress.apartment}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, apartment: e.target.value }))}
                />
                <div className={styles['fullWidth']}>
                  <Input
                    placeholder="Комментарий для курьера (необязательно)"
                    value={newAddress.comment}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, comment: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles['formActions']}>
                <Button appearence="big" onClick={handleAddAddress}>
                  Сохранить адрес
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          )}

          <div className={styles['addressesList']}>
            {addresses.length === 0 ? (
              <div className={styles['noAddresses']}>
                <p>У вас пока нет сохраненных адресов</p>
                <p>Добавьте адрес для быстрого оформления заказов</p>
              </div>
            ) : (
              addresses.map(address => (
                <div key={address.id} className={styles['addressCard']}>
                  <div className={styles['addressHeader']}>
                    <h4>{address.title}</h4>
                    <Button 
                      appearence="small" 
                      onClick={() => handleRemoveAddress(address.id)}
                      style={{ backgroundColor: '#ff4444' }}
                    >
                      Удалить
                    </Button>
                  </div>
                  <div className={styles['addressDetails']}>
                    <p><strong>Адрес:</strong> ул. {address.street}, д. {address.house}</p>
                    {address.building && <p><strong>Корпус:</strong> {address.building}</p>}
                    {address.entrance && <p><strong>Подъезд:</strong> {address.entrance}</p>}
                    {address.floor && <p><strong>Этаж:</strong> {address.floor}</p>}
                    {address.apartment && <p><strong>Квартира:</strong> {address.apartment}</p>}
                    {address.comment && (
                      <div className={styles['comment']}>
                        <strong>Комментарий курьеру:</strong> {address.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;