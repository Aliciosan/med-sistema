import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Chama o login e recebe o tipo de usuário (role)
    const role = login(email, '123456'); 
    
    // Redirecionamento Inteligente
    if (role === 'patient') {
      navigate('/portal'); // Manda paciente para o Portal
    } else {
      navigate('/'); // Manda médico/admin para o Dashboard
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-4 shadow-lg">
            <Activity size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white">Bem-vindo</h2>
          <p className="text-blue-100 mt-2">Acesse sua conta para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Digite seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary/30">
            Entrar no Sistema
          </button>

          <div className="text-center text-xs text-slate-400 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="font-bold mb-1">Emails para Teste:</p>
            <p>👨‍⚕️ Médico: <span className="font-mono text-slate-600">medico@med.com</span></p>
            <p>👤 Paciente: <span className="font-mono text-slate-600">seuemail@gmail.com</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}