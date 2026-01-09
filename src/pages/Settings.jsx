import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Mail, Lock, Shield } from 'lucide-react';

export default function Settings() {
  const { user, login } = useAuth(); // Usamos login para atualizar o estado global se precisar
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de atualização (Aqui você conectaria com Supabase Auth no futuro)
    // Por enquanto, atualizamos o LocalStorage para refletir na hora
    const updatedUser = { ...user, name: formData.name, email: formData.email };
    localStorage.setItem('med_user', JSON.stringify(updatedUser));
    
    // Força um reload suave para atualizar o nome no Header/Sidebar
    setTimeout(() => {
        alert('✅ Dados atualizados com sucesso!');
        setIsLoading(false);
        window.location.reload();
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
        <p className="text-slate-500 text-sm">Gerencie seus dados pessoais e preferências.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Seção de Perfil */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <User size={20} className="text-primary"/> Dados Pessoais
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
                        <User size={18} className="text-slate-400" />
                        <input 
                            type="text" 
                            className="bg-transparent outline-none w-full text-slate-700 font-medium"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
                        <Mail size={18} className="text-slate-400" />
                        <input 
                            type="email" 
                            className="bg-transparent outline-none w-full text-slate-700 font-medium"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-4"></div>

          {/* Seção de Segurança */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Shield size={20} className="text-primary"/> Segurança
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nova Senha</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
                        <Lock size={18} className="text-slate-400" />
                        <input 
                            type="password" 
                            placeholder="Deixe vazio para manter"
                            className="bg-transparent outline-none w-full text-slate-700"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmar Senha</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
                        <Lock size={18} className="text-slate-400" />
                        <input 
                            type="password" 
                            placeholder="Repita a nova senha"
                            className="bg-transparent outline-none w-full text-slate-700"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="pt-4 flex justify-end">
            <button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
            >
                {isLoading ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}