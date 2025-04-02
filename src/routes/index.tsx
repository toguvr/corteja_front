import { Routes, Route } from 'react-router-dom';

import { CreateAccount } from '../pages/CreateAccount';
import { ForgotPassword } from '../pages/ForgotPassword';

import { SignIn } from '../pages/Signin';
import { ResetPassword } from '../pages/ResetPassword';
import { PrivateRoute } from './Route';
import CustomerAppointment from '../pages/CustomerAppointment';
import Schedules from '../pages/Schedules';
import Assinaturas from '../pages/Subscriptions';
import PaymentStatement from '../pages/PaymentStatement';
import EditCustomerProfile from '../pages/Profile';
import SignInBarbershop from '../pages/SigninBarbershop';

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/agendar/:slug"
        element={<PrivateRoute element={<CustomerAppointment />} />}
      />
      <Route
        path="/assinatura/:slug"
        element={<PrivateRoute element={<Assinaturas />} />}
      />
      <Route
        path="/agendamentos"
        element={<PrivateRoute element={<Schedules />} />}
      />
      <Route
        path="/perfil"
        element={<PrivateRoute element={<EditCustomerProfile />} />}
      />
      <Route
        path="/extrato"
        element={<PrivateRoute element={<PaymentStatement />} />}
      />

      <Route path="*" element={<h1>Página não encontrada</h1>} />

      <Route path="/" element={<SignIn />} />
      <Route path="/admin" element={<SignInBarbershop />} />
      <Route path="/criar-conta" element={<CreateAccount />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRouter;
