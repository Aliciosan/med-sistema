import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Users, DollarSign, Activity, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    totalPatients: 0,
    revenue: 0,
    efficiency: 98 // Valor fixo para exemplo
  });
  const [chartData, setChartData] = useState([]);

  // Carregar dados reais
  useEffect(() => {
    async function loadDashboard() {
      const data = await appointmentService.getAll();
      setAppointments(data);
      calculateStats(data);
      generateChartData(data);
    }
    loadDashboard();
  }, []);

  // 1. Calcular Estatísticas
  const calculateStats = (data) => {
    const todayStr = new Date().toLocaleDateString('pt-BR');
    
    // Consultas Hoje
    const todayCount = data.filter(a => a.date === todayStr && a.status !== 'cancelled').length;
    
    // Pacientes Únicos (Conta quantos nomes diferentes existem)
    const uniquePatients = new Set(data.map(a => a.patient_name)).size;
    
    // Faturamento Estimado (Ex: R$ 250 por consulta confirmada)
    const confirmedCount = data.filter(a => a.status === 'confirmed').length;
    const revenue = confirmedCount * 250;

    setStats({ ...stats, todayCount, totalPatients: uniquePatients, revenue });
  };

  // 2. Gerar Gráfico (Agrupa por dia)
  const generateChartData = (data) => {
    // Cria um mapa dos últimos 7 dias
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('pt-BR'); // "12/01/2026"
    });

    const graph = last7Days.map(day => {
        // Pega apenas o dia (ex: "12") para o eixo X
        const dayNumber = day.split('/')[0]; 
        const count = data.filter(a => a.date === day && a.status !== 'cancelled').length;
        return { name: dayNumber, consultas: count };
    });

    setChartData(graph);
  };

  // Componente de Cartão
  const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3.5 rounded-2xl ${bg} ${color}`}>
          <Icon size={24} />
        </div>
        {sub && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> {sub}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1">{label}</p>
    </div>
  );

  // Filtra próximos (Pendentes ou Confirmados)
  const nextAppointments = appointments
    .filter(a => a.status !== 'cancelled')
    .slice(0, 4); // Pega só os 4 primeiros

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-400 mt-1">Bem-vindo(a), Dr(a). {user?.name.split(' ')[0]}.</p>
        </div>
        <div className="text-sm text-slate-500 font-bold bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
          <Calendar size={16} className="text-primary"/> 
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Consultas Hoje" value={stats.todayCount} sub="Agenda" color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Users} label="Total Pacientes" value={stats.totalPatients} sub="Ativos" color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={DollarSign} label="Faturamento Est." value={`R$ ${stats.revenue}`} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={Activity} label="Eficiência" value={`${stats.efficiency}%`} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6">Volume Semanal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                    cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="consultas" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de Próximos */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Próximos</h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-bold">{nextAppointments.length}</span>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
             {nextAppointments.length === 0 ? (
                <p className="text-slate-400 text-center text-sm py-10">Agenda livre por enquanto.</p>
             ) : (
                nextAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 group">
                    <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="text-xs font-bold text-slate-500">{apt.time}</span>
                        <div className="h-full w-0.5 bg-slate-100 my-1 group-last:hidden"></div>
                    </div>
                    <div className={`flex-1 p-3 rounded-2xl border transition-all ${
                        apt.status === 'confirmed' 
                        ? 'bg-blue-50/50 border-blue-100' 
                        : 'bg-slate-50 border-slate-100'
                    }`}>
                        <div className="flex justify-between items-start">
                        <p className="font-bold text-slate-800 text-sm">{apt.patient_name}</p>
                        {apt.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-400" title="Pendente"></span>}
                        {apt.status === 'confirmed' && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Confirmado"></span>}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            {apt.date === new Date().toLocaleDateString('pt-BR') ? 'Hoje' : apt.date} • {apt.type}
                        </p>
                    </div>
                </div>
                ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}