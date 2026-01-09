import { supabase } from './supabaseClient';

export const appointmentService = {
  // 1. Buscar todos (Para o Médico)
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar:', error);
      return [];
    }
  },

  // 2. Buscar por Paciente (Para o Histórico)
  getByPatientId: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('id', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro user:', error);
      return [];
    }
  },

  // 3. Criar Agendamento
  create: async (appointment) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao criar:', error);
      return null;
    }
  },

  // 4. Atualizar Status (Aceitar, Recusar, Cancelar)
  updateStatus: async (id, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      return null;
    }
  }
};