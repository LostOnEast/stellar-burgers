import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/authSlice';
import { LoginUI } from '@ui-pages';
import { RootState } from '@store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Берём значения через рефы или state
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={error || ''}
    />
  );
};
