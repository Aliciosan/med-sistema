import { supabase } from './supabaseClient';

export const appointmentService = {
  // Lista todos os agendamentos
  getAll: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar:', error);
      return [];
    }
    return data;
  },

  // Lista agendamentos por ID do paciente
  getByPatientId: async (patientId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('id', { ascending: false });

    if (error) return [];
    return data;
  },

  // Cria um novo agendamento
  create: async (appointment) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select();

    if (error) {
      console.error('Erro ao criar:', error);
      return null;
    }
    return data[0];
  }
};