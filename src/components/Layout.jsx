import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-primary/20">
      {/* Sidebar Desktop */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0"> {/* Padding bottom pro menu mobile */}
        
        {/* Header Mobile Simplificado */}
        <div className="md:hidden flex justify-between items-center p-6 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
           <div>
             <h1 className="text-xl font-bold text-slate-800">Olá, Dr. {user?.name.split(' ')[0]}</h1>
             <p className="text-xs text-slate-400 font-medium">Bem-vindo de volta</p>
           </div>
           <button className="p-2 bg-white border border-slate-100 rounded-full text-slate-400 shadow-sm relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
           </button>
        </div>

        {/* Conteúdo das Páginas */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Menu Inferior Mobile */}
      <MobileNav />
    </div>
  );
}