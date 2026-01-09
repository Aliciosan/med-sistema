import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, MapPin, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';

// --- DADOS ESTÁTICOS ---
const DOCTORS = [
  { id: 1, name: 'Dra. Ana Silva', specialty: 'Cardiologista', image: 'https://i.pravatar.cc/150?u=1', price: 'R$ 350,00' },
  { id: 2, name: 'Dr. Carlos Lima', specialty: 'Clínico Geral', image: 'https://i.pravatar.cc/150?u=2', price: 'R$ 200,00' },
  { id: 3, name: 'Dra. Júlia Costa', specialty: 'Dermatologista', image: 'https://i.pravatar.cc/150?u=4', price: 'R$ 280,00' },
];

const TIMES = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

// Função para gerar os próximos 14 dias
const getNextDays = () => {
  const dates = [];
  const today = new Date();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({ 
      day: d.getDate().toString().padStart(2, '0'), 
      weekDay: weekDays[d.getDay()], 
      month: months[d.getMonth()],
      fullDate: d.toLocaleDateString('pt-BR') 
    });
  }
  return dates;
};

export default function BookingWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados do Wizard
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dates] = useState(getNextDays());
  
  // Estado para verificar ocupação
  const [allAppointments, setAllAppointments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Carregar agendamentos existentes para bloquear horários
  useEffect(() => {
    appointmentService.getAll().then(data => setAllAppointments(data));
  }, []);

  // 2. Verifica se o horário está ocupado
  const isBusy = (time) => {
    if (!selectedDoctor || !selectedDay) return false;
    
    // Verifica na lista carregada do Supabase
    return allAppointments.some(apt => 
      apt.doctor_id === selectedDoctor.id && 
      apt.date === selectedDay.fullDate && 
      apt.time === time &&
      apt.status !== 'cancelled' // Se foi cancelado, libera o horário
    );
  };

  // 3. Salva no Supabase (CORREÇÃO DE SNAKE_CASE AQUI)
  const handleFinish = async () => {
    if (!selectedDoctor || !selectedDay || !selectedTime) return;

    setIsSaving(true);

    const newAppointment = {
      patient_id: user.id,          // snake_case
      patient_name: user.name,      // snake_case
      doctor_id: selectedDoctor.id, // snake_case
      doctor_name: selectedDoctor.name, // snake_case
      date: selectedDay.fullDate,
      time: selectedTime,
      type: 'Consulta',
      status: 'pending'
    };

    const result = await appointmentService.create(newAppointment);

    if (result) {
      alert('✅ Agendamento Confirmado!');
      navigate('/portal/meus-agendamentos');
    } else {
      alert('❌ Erro ao agendar. Tente novamente.');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20"> 
      
      {/* --- HEADER DO WIZARD --- */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-2 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors shadow-sm">
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
                {step === 1 ? 'Selecione o Profissional' : 'Data e Horário'}
            </h1>
            <p className="text-slate-500 text-sm hidden sm:block">
                {step === 1 ? 'Escolha com quem deseja se consultar.' : 'Verifique a disponibilidade na agenda.'}
            </p>
          </div>
        </div>
        {/* Barra de Progresso */}
        <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
          <div className={`h-full bg-primary transition-all duration-500 ease-out ${step === 1 ? 'w-1/3' : 'w-full'}`}></div>
        </div>
      </div>

      {/* --- PASSO 1: LISTA DE MÉDICOS --- */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCTORS.map(doc => (
            <div 
              key={doc.id}
              onClick={() => { setSelectedDoctor(doc); setStep(2); }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-primary hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 group-hover:from-primary/20 transition-all"></div>
              
              <img src={doc.image} className="w-16 h-16 rounded-full bg-slate-200 object-cover border-2 border-white shadow-sm z-10" />
              <div className="flex-1 z-10">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">{doc.name}</h3>
                <p className="text-sm text-slate-500">{doc.specialty}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{doc.price}</span>
                    <span className="text-xs text-primary font-bold flex items-center gap-1">Agendar <ChevronLeft size={14} className="rotate-180"/></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- PASSO 2: AGENDA (LAYOUT DIVIDIDO NO DESKTOP) --- */}
      {step === 2 && (
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* COLUNA ESQUERDA: SELEÇÃO */}
            <div className="flex-1 space-y-8">
                
                {/* Seleção de Dias */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-primary"/> Escolha o Dia
                    </h3>
                    
                    {/* MOBILE: Scroll Horizontal / DESKTOP: Grid */}
                    <div className="
                        flex gap-3 overflow-x-auto pb-4 hide-scroll 
                        lg:grid lg:grid-cols-7 lg:pb-0
                    ">
                        {dates.map((d, i) => (
                            <button
                            key={i}
                            onClick={() => { setSelectedDay(d); setSelectedTime(null); }}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[70px] border-2 transition-all duration-200
                                ${selectedDay?.day === d.day 
                                ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                                : 'bg-white text-slate-600 border-slate-50 hover:border-primary/50 hover:bg-slate-50'}`}
                            >
                                <span className="text-[10px] uppercase font-bold opacity-70 mb-1">{d.weekDay}</span>
                                <span className="text-xl font-bold">{d.day}</span>
                                <span className="text-[10px] opacity-60">{d.month}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Seleção de Horários */}
                {selectedDay && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-slide-up">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-primary"/> Horários - {selectedDay.weekDay}, {selectedDay.day}
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {TIMES.map(time => {
                            const busy = isBusy(time);
                            const selected = selectedTime === time;

                            return (
                                <button
                                key={time}
                                disabled={busy}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 rounded-xl text-sm font-bold border-2 transition-all
                                    ${busy 
                                    ? 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed opacity-60 decoration-slice line-through' 
                                    : selected 
                                        ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                                        : 'bg-white text-slate-700 border-slate-100 hover:border-primary hover:text-primary'}`}
                                >
                                {time}
                                </button>
                            );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* COLUNA DIREITA: RESUMO (FIXO NO DESKTOP, MODAL NO MOBILE) */}
            <div className="lg:w-96">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg lg:sticky lg:top-24">
                    <h3 className="font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Resumo</h3>
                    
                    {/* Médico */}
                    <div className="flex items-center gap-4 mb-6">
                        <img src={selectedDoctor.image} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Profissional</p>
                            <p className="font-bold text-slate-800">{selectedDoctor.name}</p>
                            <p className="text-xs text-slate-500">{selectedDoctor.specialty}</p>
                        </div>
                    </div>

                    {/* Detalhes */}
                    <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Data</span>
                            <span className="font-bold text-slate-800">{selectedDay ? selectedDay.fullDate : '--/--'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Horário</span>
                            <span className="font-bold text-slate-800">{selectedTime || '--:--'}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2"></div>
                        <div className="flex justify-between text-base">
                            <span className="font-bold text-slate-600">Valor</span>
                            <span className="font-bold text-primary">{selectedDoctor.price}</span>
                        </div>
                    </div>

                    {/* Botão de Confirmação Desktop */}
                    <button
                        disabled={!selectedTime || isSaving}
                        onClick={handleFinish}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSaving ? 'Agendando...' : <><ShieldCheck size={20} /> Confirmar</>}
                    </button>
                </div>
            </div>

            {/* Botão Fixo Mobile (Só aparece no celular) */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 lg:hidden transition-transform duration-300 z-50 ${selectedTime ? 'translate-y-0' : 'translate-y-full'}`}>
                <button
                    disabled={isSaving}
                    onClick={handleFinish}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                    {isSaving ? 'Agendando...' : `Confirmar (${selectedTime})`}
                </button>
            </div>

        </div>
      )}
    </div>
  );
}