import { FC, SyntheticEvent, ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUser } from '../../services/slices/authSlice';
import { RootState } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, accessToken, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // 1. Проверка токена
  useEffect(() => {
    if (!accessToken) {
      console.log('1. Проверка токена');
      navigate('/login', { replace: true });
    }
  }, [accessToken, navigate]);

  // 2. Получение юзера только один раз при монтировании
  useEffect(() => {
    const token = accessToken || localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getUser())
        .unwrap()
        .then((data) => {
          setFormValue({ name: data.name, email: data.email, password: '' });
        })
        .catch(() => {
          //navigate('/login', { replace: true });
        });
    }
  }, [dispatch, accessToken, navigate]);

  // 3. Заполняем форму, когда user обновился
  useEffect(() => {
    console.log('3. Заполняем форму, когда user обновился');
    if (user) {
      setFormValue({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const isFormChanged =
    user &&
    (formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {})
      };
      console.log('Обновляем данные');
      const result = await dispatch(updateUser(updatedUserData));

      if (updateUser.fulfilled.match(result)) {
        setFormValue({
          name: result.payload.name,
          email: result.payload.email,
          password: ''
        });
      }
    } catch {
      // ошибки уже обрабатываются в slice
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({ name: user.name, email: user.email, password: '' });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading && !user) {
    return (
      <p className='text text_type_main-medium mt-20'>Загрузка профиля...</p>
    );
  }

  if (!accessToken) {
    return null; // редирект уже сработает
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={!!isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || ''}
    />
  );
};
