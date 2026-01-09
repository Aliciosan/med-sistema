import { supabase } from './supabaseClient';

export const appointmentService = {
  // Lista todos os agendamentos (Para o Médico)
  getAll: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: false }); // Mais recentes primeiro
    
    if (error) {
      console.error('Erro ao buscar:', error);
      return [];
    }
    return data;
  },

  // Lista agendamentos por ID do paciente (Para o Paciente)
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
  },

  // --- NOVO: Atualiza o status (Aceitar, Recusar, Cancelar) ---
  updateStatus: async (id, newStatus) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar:', error);
      return null;
    }
    return data[0];
  }
};