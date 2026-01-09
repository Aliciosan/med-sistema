import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Users, FileText, LogOut, Settings, Bell } from 'lucide-react'; // Adicionado Bell
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Painel', path: '/' },
    { icon: Calendar, label: 'Agenda', path: '/consultas' },
    { icon: Users, label: 'Pacientes', path: '/pacientes' },
    { icon: FileText, label: 'Prontuários', path: '/prontuarios' },
  ];

  return (
    <>
      {/* ============================================================
          HEADER MOBILE (Topo - Apenas Celular)
          Contém: Logo, Sino e Sair
         ============================================================ */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex justify-between items-center px-4 z-50">
          {/* Logo */}
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-lg text-slate-800">MedConnect</span>
          </div>

          {/* Ações (Sino + Sair) */}
          <div className="flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                  <Bell size={20} />
                  {/* Bolinha de notificação */}
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <LogOut size={20} />
              </button>
          </div>
      </div>

      {/* ============================================================
          SIDEBAR DESKTOP (Lateral Esquerda)
         ============================================================ */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 z-40">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold text-slate-800">MedConnect</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 translate-x-1' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 m-4 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
               {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-slate-500 font-medium capitalize">
                {user?.role === 'doctor' ? 'Médico Titular' : 'Admin'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => navigate('/configuracoes')} 
              className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Settings size={14} /> Config
            </button>
            <button onClick={logout} className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================
          MENU INFERIOR MOBILE (Apenas Navegação)
         ============================================================ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 w-16 transition-all ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}