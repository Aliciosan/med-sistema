import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout'; // Layout do Médico/Admin
import Login from './pages/Login';

// Layouts e Páginas do Paciente
import PatientLayout from './components/PatientLayout';
import PatientHome from './pages/patient/PatientHome';
import BookingWizard from './pages/patient/BookingWizard';
import MyAppointments from './pages/patient/MyAppointments';

// Páginas do Médico/Admin
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import MedicalRecords from './pages/MedicalRecords';
import Profile from './pages/Profile'; // Perfil visual (card)
import Settings from './pages/Settings'; // <--- Nova página de Configurações (Edição)

// Componente para proteger rotas (Blindagem de Segurança)
const PrivateRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();
  
  // 1. Não está logado? Manda para o Login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // 2. É PACIENTE tentando acessar área de MÉDICO?
  // Se a rota não for explicita para 'patient' e o usuário for 'patient', chuta pro portal
  if (user.role === 'patient' && role !== 'patient') {
    return <Navigate to="/portal" />;
  }

  // 3. É MÉDICO tentando acessar área de PACIENTE?
  // Se a rota for para 'patient' e o usuário NÃO for, chuta pra home
  if (user.role !== 'patient' && role === 'patient') {
    return <Navigate to="/" />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />
          
          {/* === ÁREA MÉDICA / ADMIN === */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="consultas" element={<Appointments />} />
            <Route path="pacientes" element={<Patients />} />
            <Route path="prontuarios" element={<MedicalRecords />} />
            <Route path="perfil" element={<Profile />} /> {/* Visualização do Perfil */}
            <Route path="configuracoes" element={<Settings />} /> {/* <--- NOVA ROTA: Edição de Dados */}
          </Route>

          {/* === ÁREA DO PACIENTE (CLIENTE) === */}
          <Route path="/portal" element={<PrivateRoute role="patient"><PatientLayout /></PrivateRoute>}>
            <Route index element={<PatientHome />} />
            <Route path="novo" element={<BookingWizard />} />
            <Route path="meus-agendamentos" element={<MyAppointments />} />
            {/* Paciente também pode acessar configurações para mudar senha/nome */}
            <Route path="perfil" element={<Settings />} /> 
          </Route>

          {/* Rota de Erro (404) -> Redireciona para Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}