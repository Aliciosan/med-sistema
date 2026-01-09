import { FileText, Clock, Stethoscope } from 'lucide-react';

export default function MedicalRecords() {
  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-800">Prontuários Recentes</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="border-l-2 border-slate-100 ml-3 space-y-8 pl-8 py-2">
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              {/* Bolinha da timeline */}
              <span className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-primary shadow-sm"></span>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Consulta de Rotina</h3>
                  <p className="text-slate-500 text-sm mb-2">Paciente: Ana Carolina Souza</p>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Paciente relatou dores de cabeça frequentes. Prescrito analgésico e solicitado exames de sangue.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full self-start">
                  <Clock size={14} /> 10 Jan 2026
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                  <FileText size={14} /> Ver Receita
                </button>
                 <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                  <Stethoscope size={14} /> Ver Exames
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}