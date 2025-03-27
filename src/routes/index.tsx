import { Routes, Route } from 'react-router-dom';

import { CreateAccount } from '../pages/CreateAccount';
import { ForgotPassword } from '../pages/ForgotPassword';

import { SignIn } from '../pages/Signin';
import { ResetPassword } from '../pages/ResetPassword';
import { PrivateRoute } from './Route';
import CustomerAppointment from '../pages/CustomerAppointment';

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/barbearia/:slug"
        element={<PrivateRoute element={<CustomerAppointment />} />}
      />

      <Route path="*" element={<h1>Página não encontrada</h1>} />

      <Route path="/" element={<SignIn />} />
      <Route path="/criar-conta" element={<CreateAccount />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRouter;
