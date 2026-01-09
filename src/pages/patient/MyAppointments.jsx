import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, AlertCircle, XCircle, CheckCircle } from 'lucide-react';

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = () => {
    if (user) {
      appointmentService.getByPatientId(user.id).then(data => setAppointments(data));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCancel = async (id) => {
    if(!window.confirm("Tem certeza que deseja cancelar?")) return;
    setIsLoading(true);
    await appointmentService.updateStatus(id, 'cancelled');
    loadData();
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
        case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusLabel = (s) => ({ confirmed: 'Confirmado', pending: 'Pendente', cancelled: 'Cancelado' }[s] || s);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800">Meus Agendamentos</h1>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Calendar size={32} />
          </div>
          <p className="text-slate-500 font-medium">Você ainda não tem agendamentos.</p>
        </div>
      ) : (
        appointments.map((apt) => (
          <div key={apt.id} className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${apt.status === 'cancelled' ? 'opacity-75 bg-slate-50' : ''}`}>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Profissional</p>
                {/* Aqui usamos doctor_name (snake_case) */}
                <h3 className="font-bold text-slate-800 text-lg">{apt.doctor_name || 'Médico'}</h3>
                <p className="text-sm text-slate-500">{apt.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(apt.status)}`}>
                {getStatusLabel(apt.status)}
              </span>
            </div>
            
            <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar size={18} className="text-primary"/> {apt.date}
              </div>
              <div className="w-px bg-slate-200"></div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Clock size={18} className="text-primary"/> {apt.time}
              </div>
            </div>
            
            {/* Ações */}
            {apt.status === 'pending' && (
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                    <AlertCircle size={14} /> Aguardando confirmação.
                 </div>
                 <button onClick={() => handleCancel(apt.id)} disabled={isLoading} className="w-full py-2.5 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors">
                    Cancelar Solicitação
                 </button>
              </div>
            )}

            {apt.status === 'confirmed' && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        <CheckCircle size={14} /> Confirmado!
                    </div>
                    <button onClick={() => handleCancel(apt.id)} disabled={isLoading} className="text-xs text-red-400 font-bold hover:text-red-600 self-end px-2">
                        Cancelar Agendamento
                    </button>
                </div>
            )}
            
            {apt.status === 'cancelled' && <div className="text-center text-xs text-slate-400 font-medium pt-2">Agendamento cancelado.</div>}

          </div>
        ))
      )}
    </div>
  );
}