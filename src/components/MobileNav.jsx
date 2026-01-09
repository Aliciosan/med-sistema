import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, User } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/' },
    { icon: Calendar, label: 'Agenda', path: '/consultas' },
    { icon: Users, label: 'Pacientes', path: '/pacientes' }, // Você pode ocultar isso se não for médico
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-primary -translate-y-1' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}