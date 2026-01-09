import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PatientHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Grade Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card de Boas Vindas */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Bem-vindo(a) ao seu portal,</p>
            <h1 className="text-3xl font-bold mb-6">{user?.name}</h1>
            
            <Link to="/portal/novo" className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm">
              Agendar Consulta <ArrowRight size={16} />
            </Link>
          </div>
          {/* Elemento decorativo de fundo */}
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Stethoscope size={200} />
          </div>
        </div>

        {/* Card Informativo / Status */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Clock size={24} />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Próximo Compromisso</h2>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
            <p className="text-slate-500 text-sm">Você não tem agendamentos futuros.</p>
            <Link to="/portal/meus-agendamentos" className="text-primary text-xs font-bold mt-2 inline-block hover:underline">
              Ver histórico
            </Link>
          </div>
        </div>
      </div>

      {/* Seção de Serviços */}
      <div>
        <h2 className="font-bold text-slate-800 text-xl mb-4">Serviços Disponíveis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-blue-50 text-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Stethoscope size={24}/>
            </div>
            <h3 className="font-bold text-slate-700">Consultas</h3>
            <p className="text-xs text-slate-400 mt-1">Presenciais e Online</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-emerald-50 text-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24}/>
            </div>
            <h3 className="font-bold text-slate-700">Exames</h3>
            <p className="text-xs text-slate-400 mt-1">Resultados e Coleta</p>
          </div>

          {/* Adicione mais serviços se quiser preencher o grid desktop */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-purple-50 text-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar size={24}/>
            </div>
            <h3 className="font-bold text-slate-700">Retornos</h3>
            <p className="text-xs text-slate-400 mt-1">Acompanhamento</p>
          </div>

        </div>
      </div>

      {/* Banner Promocional Mobile (Opcional no Desktop) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden md:hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Check-up Anual</h2>
          <p className="text-slate-400 text-sm mb-4">Mantenha sua saúde em dia com nossos pacotes.</p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <ShieldCheck size={150} />
        </div>
      </div>
    </div>
  );
}