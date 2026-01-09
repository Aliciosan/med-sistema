import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Users, FileText, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Agenda Médica', path: '/consultas' },
    { icon: Users, label: 'Meus Pacientes', path: '/pacientes' },
    { icon: FileText, label: 'Prontuários', path: '/prontuarios' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 text-primary mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">M</div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">MedConnect</span>
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
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 font-medium">Médico Titular</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <Settings size={14} /> Config
          </button>
          <button onClick={logout} className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>
    </aside>
  );
}