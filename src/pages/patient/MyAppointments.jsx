import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      const myApts = appointmentService.getByPatientId(user.id);
      setAppointments(myApts);
    }
  }, [user]);

  const getStatusColor = (status) => {
    return status === 'confirmed' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
      : 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Meus Agendamentos</h1>

      {appointments.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Calendar size={32} />
          </div>
          <p className="text-slate-500 font-medium">Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        appointments.map((apt) => (
          <div key={apt.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Profissional</p>
                <h3 className="font-bold text-slate-800 text-lg">{apt.doctorName}</h3>
                <p className="text-sm text-slate-500">{apt.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(apt.status)}`}>
                {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
              </span>
            </div>
            
            <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar size={18} className="text-primary"/> {apt.date}
              </div>
              <div className="w-px bg-slate-200"></div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Clock size={18} className="text-primary"/> {apt.time}
              </div>
            </div>
            
            {apt.status === 'pending' && (
              <div className="flex items-center gap-2 mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                <AlertCircle size={14} /> Aguardando confirmação da clínica.
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}