import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-blue-600"></div>
        
        <div className="relative inline-block mt-8 mb-4">
           <img 
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff&size=128`} 
            className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-slate-800 text-white rounded-full hover:bg-black transition-colors">
            <Camera size={16} />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
        <p className="text-slate-500 font-medium">CRM/SP 123456</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 font-bold text-slate-700">Dados Pessoais</div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nome Completo</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <User size={18} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{user?.name}</span>
            </div>
          </div>
           <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">E-mail Corporativo</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Mail size={18} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
        <Shield size={20} /> Alterar Senha
      </button>
    </div>
  );
}