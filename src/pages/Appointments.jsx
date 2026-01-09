import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Filter, Plus } from 'lucide-react';
import Modal from '../components/Modal'; 
import { appointmentService } from '../services/appointmentService';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carrega dados iniciais
  const fetchAppointments = async () => {
    const data = await appointmentService.getAll();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setIsLoading(true);
    await appointmentService.updateStatus(id, newStatus);
    await fetchAppointments();
    setIsLoading(false);
  };

  // Simulação de formulário manual
  const [formData, setFormData] = useState({ patient: '', date: '', time: '', type: 'Consulta' });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Cria no banco
    const newApt = await appointmentService.create({
      patient_id: 0,
      patient_name: formData.patient, // Usando snake_case para o Supabase
      doctor_id: 1,
      doctor_name: 'Você',
      date: new Date(formData.date).toLocaleDateString('pt-BR'),
      time: formData.time,
      type: formData.type,
      status: 'confirmed'
    });

    if (newApt) {
      setAppointments([newApt, ...appointments]);
      setIsModalOpen(false);
      setFormData({ patient: '', date: '', time: '', type: 'Consulta' });
    } else {
      alert("Erro ao salvar. Verifique sua conexão.");
    }
    setIsLoading(false);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-500 border-red-100 opacity-70';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusLabel = (s) => ({ confirmed: 'Confirmado', pending: 'Pendente', cancelled: 'Cancelado' }[s] || s);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agenda Médica</h1>
          <p className="text-slate-500 text-sm">Gerencie solicitações e horários.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors">
            <Filter size={18} /> Filtrar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Manual
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appointments.map((apt) => (
          <div key={apt.id} className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-200 transition-all relative group ${apt.status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}>
             
             <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg border border-white shadow-sm">
                  {apt.patient_name ? apt.patient_name.charAt(0) : '?'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{apt.patient_name || 'Paciente'}</h3>
                  <p className="text-xs text-slate-500">{apt.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(apt.status)}`}>
                {getStatusLabel(apt.status)}
              </span>
            </div>
            
            <div className="flex gap-4 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <CalendarIcon size={16} className="text-primary" /> {apt.date}
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Clock size={16} className="text-primary" /> {apt.time}
                </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            {apt.status === 'pending' && (
              <div className="flex gap-2">
                 <button 
                   onClick={() => handleStatusChange(apt.id, 'confirmed')}
                   disabled={isLoading}
                   className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors flex justify-center items-center gap-2"
                 >
                   <CheckCircle size={18} /> Aceitar
                 </button>
                 <button 
                   onClick={() => handleStatusChange(apt.id, 'cancelled')}
                   disabled={isLoading}
                   className="flex-1 bg-red-50 text-red-700 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                 >
                   <XCircle size={18} /> Recusar
                 </button>
              </div>
            )}
            
            {/* Status Estático */}
            {apt.status === 'confirmed' && <div className="mt-2 text-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-xl">Consulta Confirmada</div>}
            {apt.status === 'cancelled' && <div className="mt-2 text-center text-xs font-bold text-red-500 bg-red-50 py-2 rounded-xl">Cancelado</div>}

          </div>
        ))}
      </div>

      {/* MODAL MANUAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agendamento Manual">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Paciente</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
              value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
              <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Horário</label>
              <input required type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <button disabled={isLoading} type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-4">
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Modal>
    </div>
  );
}