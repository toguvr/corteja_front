import { Routes, Route } from 'react-router-dom';

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
import BarberAgenda from '../pages/BarbershopPages/BarberAgenda';
import BarbersManagementPage from '../pages/BarbershopPages/Barbers';
import BarbershopPrivateLayout from '../components/BarbershopPrivateLayout';
import BarbershopDashboard from '../pages/BarbershopPages/Dashboard';
import ScheduleManagement from '../pages/BarbershopPages/ScheduleManagement';
import { CreateAccount } from '../pages/CreateAccount';
import ServicesManagement from '../pages/BarbershopPages/ServicesManagement';
import PlansManagement from '../pages/BarbershopPages/PlansManagement';
import BarbershopCreation from '../pages/BarbershopPages/BarbershopCreation';
import PublicLayout from '../components/PublicLayout';
import PublicLayoutBarbershop from '../components/PublicLayoutBarbershop';
import RecipientBalancePage from '../pages/BarbershopPages/Balance';

const AppRouter = () => {
  return (
    <Routes>
      {/* cliente */}
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

      {/* admin */}
      <Route
        path="/empresa/dashboard"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <BarbershopDashboard />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      <Route
        path="/empresa/agenda"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <BarberAgenda />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      <Route
        path="/empresa/profissionais"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <BarbersManagementPage />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      <Route
        path="/empresa/horarios"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <ScheduleManagement />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      <Route
        path="/empresa/servicos"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <ServicesManagement />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      <Route
        path="/empresa/planos"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <PlansManagement />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      <Route
        path="/empresa/extrato"
        element={
          <PrivateRoute
            element={
              <BarbershopPrivateLayout>
                <RecipientBalancePage />
              </BarbershopPrivateLayout>
            }
          />
        }
      />
      {/* publica */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />

      <Route path="/" element={<SignIn />} />
      <Route path="/admin" element={<SignInBarbershop />} />
      <Route path="/criar-conta" element={<CreateAccount />} />
      <Route
        path="/criar-empresa"
        element={
          <PublicLayoutBarbershop>
            <BarbershopCreation />
          </PublicLayoutBarbershop>
        }
      />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRouter;
