import { supabase } from './supabaseClient';

export const appointmentService = {
  // Lista todos os agendamentos
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
      return []; // Retorna array vazio para não quebrar a tela
    }
  },

  // Lista por Paciente
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
      console.error('Erro ao buscar por paciente:', error);
      return [];
    }
  },

  // Criação
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

  // Atualização de Status
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