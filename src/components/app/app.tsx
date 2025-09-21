import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { getCookie, setCookie } from '../../utils/cookie';

import { AppHeader, OrderInfo, IngredientDetails, Modal } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuth = Boolean(localStorage.getItem('accessToken'));
  if (isAuth) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setCookie('accessToken', accessToken);
    }
  }
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};

const App = () => (
  <Router>
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* публичные роуты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* роуты авторизации */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* защищённые роуты */}
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        {/* модалки */}
        <Route
          path='/feed/:number'
          element={
            <Modal
              title='Информация о заказе'
              onClose={() => window.history.back()}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Ингредиент' onClose={() => window.history.back()}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute
              element={
                <Modal
                  title='Информация о заказе'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </Router>
);

export default App;
