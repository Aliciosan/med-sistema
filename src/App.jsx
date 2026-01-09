import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout'; // Layout Médico
import Login from './pages/Login';

// Layouts e Páginas do Paciente
import PatientLayout from './components/PatientLayout';
import PatientHome from './pages/patient/PatientHome';
import BookingWizard from './pages/patient/BookingWizard';
import MyAppointments from './pages/patient/MyAppointments';

// Demais páginas médicas
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import MedicalRecords from './pages/MedicalRecords';
import Profile from './pages/Profile';

// Rota Privada Inteligente
const PrivateRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();
  
  // 1. Não logado? Vai pro login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // 2. É paciente tentando acessar área médica (rota sem role definida ou role diferente)?
  if (user.role === 'patient' && role !== 'patient') {
    return <Navigate to="/portal" />;
  }

  // 3. É médico tentando acessar área de paciente?
  if (user.role !== 'patient' && role === 'patient') {
    return <Navigate to="/" />;
  }

  return children;
};

// --- AQUI ESTAVA O PROBLEMA, PRECISA SER 'export default' ---
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* ÁREA MÉDICA / ADMIN (Bloqueada para pacientes) */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="consultas" element={<Appointments />} />
            <Route path="pacientes" element={<Patients />} />
            <Route path="prontuarios" element={<MedicalRecords />} />
            <Route path="perfil" element={<Profile />} />
          </Route>

          {/* ÁREA DO PACIENTE (Bloqueada para médicos/admins) */}
          <Route path="/portal" element={<PrivateRoute role="patient"><PatientLayout /></PrivateRoute>}>
            <Route index element={<PatientHome />} />
            <Route path="novo" element={<BookingWizard />} />
            <Route path="meus-agendamentos" element={<MyAppointments />} />
          </Route>

          {/* Qualquer rota errada vai pro login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}