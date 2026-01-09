import { useAuth } from '../context/AuthContext';
import { Calendar, Users, DollarSign, Activity, TrendingUp, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const StatCard = ({ icon: Icon, label, value, trend, color, bg }) => (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3.5 rounded-2xl ${bg} ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1">{label}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Desktop */}
      <div className="hidden md:flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-400 mt-1">Resumo das atividades do consultório.</p>
        </div>
        <div className="text-sm text-slate-400 font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          📅 {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Consultas Hoje" value="12" trend="+20%" color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Users} label="Novos Pacientes" value="34" trend="+4%" color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={Clock} label="Tempo Médio" value="24m" color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon={Activity} label="Eficiência" value="98%" trend="+12%" color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner de Ação Rápida */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           
           <h2 className="text-2xl font-bold relative z-10 mb-2">Agenda Lotada?</h2>
           <p className="text-blue-100 relative z-10 mb-6 max-w-md">Você tem 4 consultas pendentes de confirmação para amanhã. Revise sua agenda para evitar conflitos.</p>
           
           <button className="relative z-10 bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
             Revisar Agenda Agora
           </button>
        </div>

        {/* Próximas Consultas - Estilo App */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Próximos</h3>
            <button className="text-primary text-xs font-bold hover:underline">Ver tudo</button>
          </div>
          
          <div className="flex-1 space-y-4">
             {[1,2,3].map((i) => (
               <div key={i} className="flex items-center gap-4 group cursor-pointer">
                 <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-xs font-bold text-slate-400">14:00</span>
                    <div className="h-full w-0.5 bg-slate-100 my-1 group-last:hidden"></div>
                 </div>
                 <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:border-primary/30 group-hover:bg-blue-50/50 transition-all">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-800 text-sm">Mariana Costa</p>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Primeira Consulta</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}