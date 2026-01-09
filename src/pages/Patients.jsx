import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Phone, Mail } from 'lucide-react';

const mockPatients = [
  { id: 1, name: 'Ana Carolina Souza', phone: '(11) 99999-1111', email: 'ana@email.com', lastVisit: '10/12/2025' },
  { id: 2, name: 'Bruno Lima', phone: '(21) 98888-2222', email: 'bruno@email.com', lastVisit: '05/01/2026' },
  { id: 3, name: 'Carlos Eduardo', phone: '(31) 97777-3333', email: 'carlos@email.com', lastVisit: 'Nunca' },
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockPatients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Meus Pacientes</h1>
        <button className="w-full md:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
          <Plus size={20} /> Novo Paciente
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome, CPF ou telefone..." 
          className="flex-1 outline-none text-sm p-2 text-slate-700 placeholder:text-slate-400"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((patient) => (
          <div key={patient.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all group relative">
            <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-600"><MoreHorizontal size={20} /></button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{patient.name}</h3>
                <p className="text-xs text-slate-400">Última visita: {patient.lastVisit}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={14} className="text-primary" /> {patient.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail size={14} className="text-primary" /> {patient.email}
              </div>
            </div>
            
            <button className="w-full mt-4 bg-slate-50 text-slate-600 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
              Ver Prontuário
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}