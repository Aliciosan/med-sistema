import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, User, Calendar, Activity, Phone, FileText, Clock, Trash2, X } from 'lucide-react';
import { patientService } from '../services/patientService';
import Modal from '../components/Modal'; // Reaproveitando seu componente Modal genérico

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o Modal de Histórico
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState({ appointments: [], records: [] });
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' ou 'records'
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Estado para Menu de Opções (qual card está com menu aberto)
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // Carregar lista inicial
  const loadData = async () => {
    setIsLoading(true);
    const data = await patientService.getUniquePatients();
    setPatients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- AÇÕES ---

  // 1. Abrir Prontuário Completo
  const handleViewHistory = async (patient) => {
    setSelectedPatient(patient);
    setIsHistoryOpen(true);
    setIsHistoryLoading(true);
    
    const data = await patientService.getPatientHistory(patient.name);
    setHistory(data);
    
    setIsHistoryLoading(false);
  };

  // 2. Excluir Paciente
  const handleDeletePatient = async (patientName) => {
    if (!window.confirm(`Tem certeza que deseja excluir todo o histórico de ${patientName}? Isso não pode ser desfeito.`)) return;
    
    await patientService.deletePatientData(patientName);
    setOpenMenuIndex(null); // Fecha menu
    loadData(); // Recarrega lista
  };

  // Filtro de busca
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Pacientes</h1>
          <p className="text-slate-500 text-sm">Gerencie o histórico e dados.</p>
        </div>
        
        <div className="w-full md:w-auto relative group">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            className="w-full md:w-80 bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Pacientes */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Carregando pacientes...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
           <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <User size={32} />
          </div>
          <p className="text-slate-500">Nenhum paciente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map((patient, index) => (
            <div key={index} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{patient.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${patient.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {patient.status}
                    </span>
                  </div>
                </div>
                
                {/* Botão Menu Opções */}
                <div className="relative">
                    <button 
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openMenuIndex === index && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-fade-in">
                            <button 
                                onClick={() => handleDeletePatient(patient.name)}
                                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Excluir Paciente
                            </button>
                        </div>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                        <Calendar size={10} /> Última Visita
                    </p>
                    <p className="text-sm font-bold text-slate-700">{patient.lastVisit}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                        <Activity size={10} /> Consultas
                    </p>
                    <p className="text-sm font-bold text-slate-700">{patient.totalVisits}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                    <Phone size={12} /> {patient.phone}
                 </div>
                 <button 
                    onClick={() => handleViewHistory(patient)}
                    className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                 >
                    Ver Prontuário
                 </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL DE HISTÓRICO DO PACIENTE */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={selectedPatient ? selectedPatient.name : 'Prontuário'}>
         <div className="min-h-[400px]">
            {/* Abas */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                <button 
                    onClick={() => setActiveTab('appointments')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'appointments' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Consultas ({history.appointments.length})
                </button>
                <button 
                    onClick={() => setActiveTab('records')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'records' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Anotações ({history.records.length})
                </button>
            </div>

            {isHistoryLoading ? (
                <div className="text-center py-10 text-slate-400">Carregando histórico...</div>
            ) : (
                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    
                    {/* LISTA DE CONSULTAS */}
                    {activeTab === 'appointments' && (
                        history.appointments.length === 0 ? (
                            <p className="text-center text-slate-400 py-10">Nenhuma consulta registrada.</p>
                        ) : (
                            history.appointments.map(apt => (
                                <div key={apt.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                                    <div className="flex flex-col items-center justify-center min-w-[3rem] text-slate-500">
                                        <span className="text-xs font-bold">{apt.time}</span>
                                        <Clock size={14} className="mt-1 opacity-50"/>
                                    </div>
                                    <div className="flex-1 border-l border-slate-200 pl-4">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-slate-700">{apt.date}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{apt.type}</p>
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {/* LISTA DE ANOTAÇÕES/PRONTUÁRIOS */}
                    {activeTab === 'records' && (
                        history.records.length === 0 ? (
                            <p className="text-center text-slate-400 py-10">Nenhuma anotação médica encontrada.</p>
                        ) : (
                            history.records.map(rec => (
                                <div key={rec.id} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800">{rec.title}</h4>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar size={12}/> {rec.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                                        {rec.description}
                                    </p>
                                    {rec.tags && (
                                        <div className="flex gap-2 mt-3">
                                            {rec.tags.split(',').map((tag, i) => (
                                                <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">
                                                    #{tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )
                    )}
                </div>
            )}
         </div>
      </Modal>
    </div>
  );
}