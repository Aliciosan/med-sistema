const STORAGE_KEY = 'med_appointments';

// Dados iniciais fictícios para não começar vazio
const INITIAL_DATA = [
  { id: 1, patientId: 99, patientName: 'Maria Exemplo', doctorId: 1, doctorName: 'Dra. Ana Silva', date: '12/01/2026', time: '09:00', status: 'confirmed', type: 'Consulta' },
  { id: 2, patientId: 3, patientName: 'José Paciente', doctorId: 2, doctorName: 'Dr. Carlos Lima', date: '14/01/2026', time: '14:00', status: 'pending', type: 'Retorno' },
];

export const appointmentService = {
  // Lista todos os agendamentos (para o médico/admin)
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    return JSON.parse(data);
  },

  // Lista agendamentos apenas do paciente logado
  getByPatientId: (patientId) => {
    const all = appointmentService.getAll();
    return all.filter(apt => apt.patientId === patientId);
  },

  // Cria um novo agendamento
  create: (appointment) => {
    const all = appointmentService.getAll();
    const newApt = { ...appointment, id: Date.now(), status: 'pending' };
    const updated = [newApt, ...all];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newApt;
  }
};