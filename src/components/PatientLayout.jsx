import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, LogOut, PlusCircle, Bell } from 'lucide-react'; // Adicionado Bell
import { useAuth } from '../context/AuthContext';

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '/portal' },
    { icon: Calendar, label: 'Agendamentos', path: '/portal/meus-agendamentos' },
    { icon: PlusCircle, label: 'Novo', path: '/portal/novo' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 md:pb-0 pt-16 md:pt-0">
      
      {/* ============================================================
          HEADER SUPERIOR (Fixo no Mobile e Desktop)
         ============================================================ */}
      <div className="bg-white border-b border-slate-200 fixed md:sticky top-0 left-0 right-0 z-50 shadow-sm h-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full">
          <div className="flex justify-between items-center h-full">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <PlusCircle size={22} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg md:text-xl text-slate-800 tracking-tight">
                Med<span className="text-primary">Connect</span>
              </span>
            </div>

            {/* Menu Desktop (Central) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    location.pathname === item.path 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Área do Usuário (Direita) */}
            <div className="flex items-center gap-2 md:gap-4">
               <span className="hidden md:block text-sm font-bold text-slate-600">Olá, {user?.name.split(' ')[0]}</span>
               
               {/* Ícone de Notificação (Sino) */}
               <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
               </button>

               {/* BOTÃO SAIR (Visível em Mobile e Desktop agora) */}
               <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sair">
                 <LogOut size={20} />
               </button>
            </div>

          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
        <Outlet />
      </main>

      {/* ============================================================
          MENU INFERIOR MOBILE (Sem o botão Sair)
         ============================================================ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}