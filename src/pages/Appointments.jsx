import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Filter, Plus } from 'lucide-react';
import Modal from '../components/Modal'; 
import { appointmentService } from '../services/appointmentService';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Carrega os dados reais ao abrir a tela
  useEffect(() => {
    appointmentService.getAll().then(data => setAppointments(data));
}, []);

  // Simulação de formulário manual (para médico adicionar na hora)
  const [formData, setFormData] = useState({ patient: '', date: '', time: '', type: 'Consulta' });

 const handleSave = async (e) => {
    e.preventDefault();
    const newApt = await appointmentService.create({
      patientId: 0, // Manual
      patientName: formData.patient,
      doctorId: 1, // Assumindo logado
      doctorName: 'Você',
      date: new Date(formData.date).toLocaleDateString('pt-BR'),
      time: formData.time,
      type: formData.type
    });
    setAppointments([newApt, ...appointments]);
    setIsModalOpen(false);
    setFormData({ patient: '', date: '', time: '', type: 'Consulta' });
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agenda Médica</h1>
          <p className="text-slate-500 text-sm">Gerencie os agendamentos dos pacientes.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-50 font-medium text-sm">
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
          <div key={apt.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:border-primary/50 transition-all relative group">
             <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg border border-white shadow-sm">
                  {apt.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{apt.patientName}</h3>
                  <p className="text-xs text-slate-500">{apt.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(apt.status)}`}>
                {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
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

            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors flex justify-center items-center gap-2">
                 <CheckCircle size={16} /> Aceitar
               </button>
               <button className="flex-1 bg-red-50 text-red-700 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex justify-center items-center gap-2">
                 <XCircle size={16} /> Recusar
               </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agendamento Manual">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Paciente</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: João da Silva" value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
              <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Horário</label>
              <input required type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all mt-4">
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
}