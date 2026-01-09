import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Calendar, Tag, User, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';
import { recordService } from '../services/recordService';

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Edição
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patient_name: '',
    title: '',
    description: '',
    tags: '' 
  });

  const loadRecords = async () => {
    const data = await recordService.getAll();
    setRecords(data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // --- AÇÕES ---

  // 1. Abrir Modal para Criar
  const handleNew = () => {
    setEditingId(null);
    setFormData({ patient_name: '', title: '', description: '', tags: '' });
    setIsModalOpen(true);
  };

  // 2. Abrir Modal para Editar
  const handleEdit = (rec) => {
    setEditingId(rec.id);
    setFormData({
      patient_name: rec.patient_name,
      title: rec.title,
      description: rec.description,
      tags: rec.tags
    });
    setIsModalOpen(true);
  };

  // 3. Excluir
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este prontuário?")) return;
    setIsLoading(true);
    await recordService.delete(id);
    await loadRecords();
    setIsLoading(false);
  };

  // 4. Salvar (Criar ou Editar)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (editingId) {
      // ATUALIZAR
      await recordService.update(editingId, {
        patient_name: formData.patient_name,
        title: formData.title,
        description: formData.description,
        tags: formData.tags
        // Não atualizamos a data para manter o histórico original, mas poderia atualizar se quisesse
      });
      alert('✅ Prontuário atualizado!');
    } else {
      // CRIAR
      await recordService.create({
        patient_name: formData.patient_name,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        date: new Date().toLocaleDateString('pt-BR')
      });
    }

    await loadRecords();
    setIsModalOpen(false);
    setIsLoading(false);
  };

  // Filtro
  const filteredRecords = records.filter(rec => 
    rec.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Prontuários</h1>
          <p className="text-slate-500 text-sm">Histórico clínico e anotações.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar prontuário..." 
              className="w-full md:w-64 bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleNew}
            className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={20} /> <span className="hidden md:inline">Novo</span>
          </button>
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
               <FileText size={32} />
             </div>
             <p className="text-slate-500">Nenhum prontuário encontrado.</p>
           </div>
        ) : (
          filteredRecords.map((rec) => (
            <div key={rec.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative">
              
              {/* Botões de Ação (Aparecem no Hover) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                    onClick={() => handleEdit(rec)}
                    className="p-2 bg-white text-blue-500 rounded-lg border border-slate-100 shadow-sm hover:bg-blue-50"
                 >
                    <Edit2 size={16} />
                 </button>
                 <button 
                    onClick={() => handleDelete(rec.id)}
                    className="p-2 bg-white text-red-500 rounded-lg border border-slate-100 shadow-sm hover:bg-red-50"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>

              <div className="flex justify-between items-start mb-4 pr-20"> {/* pr-20 para dar espaço aos botões */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{rec.patient_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12}/> {rec.date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-slate-700 mb-2">{rec.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">
                  {rec.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                {rec.tags && rec.tags.split(',').map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                    <Tag size={10} /> {tag.trim()}
                  </span>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Prontuário" : "Novo Prontuário"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Paciente</label>
            <input 
              required 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex: Maria Silva"
              value={formData.patient_name}
              onChange={e => setFormData({...formData, patient_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Título / Motivo</label>
            <input 
              required 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex: Consulta de Rotina"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Descrição Detalhada</label>
            <textarea 
              required 
              rows="4"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Descreva o atendimento..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tags (separadas por vírgula)</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex: Gripe, Retorno"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            {isLoading ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Criar Prontuário')}
          </button>
        </form>
      </Modal>
    </div>
  );
}