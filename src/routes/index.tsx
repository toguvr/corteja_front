import { Routes, Route } from 'react-router-dom';

import { CreateAccount } from '../pages/CreateAccount';
import { ForgotPassword } from '../pages/ForgotPassword';

import { SignIn } from '../pages/Signin';
import { ResetPassword } from '../pages/ResetPassword';
import { PrivateRoute } from './Route';
import CustomerAppointment from '../pages/CustomerAppointment';
import Schedules from '../pages/Schedules';
import Profile from '../pages/Profile';
import Assinaturas from '../pages/Subscriptions';

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
      <Route path="/perfil" element={<PrivateRoute element={<Profile />} />} />

      <Route path="*" element={<h1>Página não encontrada</h1>} />

      <Route path="/" element={<SignIn />} />
      <Route path="/criar-conta" element={<CreateAccount />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRouter;
