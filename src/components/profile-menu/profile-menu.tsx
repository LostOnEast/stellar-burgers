import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { AppDispatch } from '../../services/store';
import { logout } from '../../services/slices/authSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login'); // редирект после выхода
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
