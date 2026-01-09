import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Barra Lateral (Desktop) / Cabeçalho e Rodapé (Mobile) */}
      <Sidebar />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden pt-20 md:pt-8 pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}