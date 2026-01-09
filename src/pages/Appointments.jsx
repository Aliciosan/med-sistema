import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Filter, Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/Modal'; 
import { appointmentService } from '../services/appointmentService';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filterMode, setFilterMode] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para Edição
  const [editingId, setEditingId] = useState(null); // Se null = Criando, Se tem ID = Editando
  const [formData, setFormData] = useState({ patient: '', date: '', time: '', type: 'Consulta' });
  
  const fetchAppointments = async () => {
    const data = await appointmentService.getAll();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --- AÇÕES ---

  // 1. Mudar Status (Aceitar/Recusar)
  const handleStatusChange = async (id, newStatus) => {
    if(!window.confirm(`Deseja alterar o status?`)) return;
    setIsLoading(true);
    await appointmentService.updateStatus(id, newStatus);
    await fetchAppointments();
    setIsLoading(false);
  };

  // 2. Deletar
  const handleDelete = async (id) => {
    if(!window.confirm("Tem certeza que deseja EXCLUIR este agendamento?")) return;
    setIsLoading(true);
    await appointmentService.delete(id);
    await fetchAppointments();
    setIsLoading(false);
  };

  // 3. Abrir Modal para Editar
  const handleEdit = (apt) => {
    setEditingId(apt.id);
    // Converte a data de DD/MM/AAAA para YYYY-MM-DD (formato do input date)
    const [day, month, year] = apt.date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData({
      patient: apt.patient_name,
      date: formattedDate,
      time: apt.time,
      type: apt.type || 'Consulta'
    });
    setIsModalOpen(true);
  };

  // 4. Abrir Modal para Criar
  const handleNew = () => {
    setEditingId(null);
    setFormData({ patient: '', date: '', time: '', type: 'Consulta' });
    setIsModalOpen(true);
  };

  // 5. Salvar (Serve para Criar e Editar)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // CORREÇÃO: Pega a string "AAAA-MM-DD" direto do input e inverte manualmente
    // Isso evita que o fuso horário subtraia um dia
    const [year, month, day] = formData.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    await appointmentService.create({
      patient_id: 0,
      patient_name: formData.patient,
      doctor_id: 1,
      doctor_name: 'Você',
      date: formattedDate, // Usa a data formatada manualmente
      time: formData.time,
      type: formData.type,
      status: 'confirmed'
    });

    await fetchAppointments();
    setIsModalOpen(false);
    setFormData({ patient: '', date: '', time: '', type: 'Consulta' });
    setIsLoading(false);
  };

  // Filtros
  const toggleFilter = () => setFilterMode(prev => prev === 'all' ? 'pending' : 'all');
  
  const filteredAppointments = filterMode === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === 'pending');

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
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agenda Médica</h1>
          <p className="text-slate-500 text-sm">
             {filterMode === 'all' ? 'Todos os agendamentos' : 'Apenas pendentes de aprovação'}
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button 
            onClick={toggleFilter}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors border
                ${filterMode === 'pending' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-amber-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Filter size={18} /> {filterMode === 'all' ? 'Filtrar Pendentes' : 'Ver Todos'}
          </button>

          <button 
            onClick={handleNew}
            className="flex-1 md:flex-none bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Novo
          </button>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAppointments.length === 0 ? (
            <div className="col-span-full text-center py-10 text-slate-400">Nenhum agendamento encontrado.</div>
        ) : (
            filteredAppointments.map((apt) => (
            <div key={apt.id} className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-200 transition-all group relative ${apt.status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}>
                
                {/* Botões de Editar/Excluir (Canto Superior Direito) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleEdit(apt)} 
                        className="p-2 bg-white text-blue-500 rounded-lg border border-slate-100 shadow-sm hover:bg-blue-50" 
                        title="Editar"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(apt.id)} 
                        className="p-2 bg-white text-red-500 rounded-lg border border-slate-100 shadow-sm hover:bg-red-50"
                        title="Excluir"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Info do Paciente */}
                <div className="flex justify-between items-start mb-4 pr-16">
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg border border-white shadow-sm">
                      {apt.patient_name ? apt.patient_name.charAt(0) : '?'}
                      </div>
                      <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1">{apt.patient_name}</h3>
                      <p className="text-xs text-slate-500">{apt.type}</p>
                      </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="mb-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                    </span>
                </div>

                {/* Data e Hora */}
                <div className="flex gap-4 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <CalendarIcon size={16} className="text-primary" /> {apt.date}
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Clock size={16} className="text-primary" /> {apt.time}
                    </div>
                </div>

                {/* Ações (Só para pendentes) */}
                {apt.status === 'pending' && (
                <div className="flex gap-2">
                    <button 
                    onClick={() => handleStatusChange(apt.id, 'confirmed')}
                    disabled={isLoading}
                    className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 flex justify-center items-center gap-2"
                    >
                    <CheckCircle size={18} /> Aceitar
                    </button>
                    <button 
                    onClick={() => handleStatusChange(apt.id, 'cancelled')}
                    disabled={isLoading}
                    className="flex-1 bg-red-50 text-red-700 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 flex justify-center items-center gap-2"
                    >
                    <XCircle size={18} /> Recusar
                    </button>
                </div>
                )}
            </div>
            ))
        )}
      </div>

      {/* Modal Reutilizável */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Agendamento" : "Novo Agendamento"}>
         <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Paciente</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Nome completo"
                value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
                <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                />
                </div>
                <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Horário</label>
                <input required type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                />
                </div>
            </div>
            <button disabled={isLoading} type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                {isLoading ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Criar Agendamento')}
            </button>
         </form>
      </Modal>
    </div>
  );
}