import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

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
  const isAuth = false; // здесь должна быть логика проверки авторизации
  return isAuth ? element : <Login />;
};

const App = () => (
  <Router>
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* обычные роуты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* защищённые роуты */}
        <Route path='/login' element={<ProtectedRoute element={<Login />} />} />
        <Route
          path='/register'
          element={<ProtectedRoute element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute element={<ResetPassword />} />}
        />
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
