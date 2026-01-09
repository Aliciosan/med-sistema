import { supabase } from './supabaseClient';

export const appointmentService = {
  // Buscar todos
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

  // Buscar por Paciente
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

  // Criar
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

  // Atualizar Status
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
      console.error('Erro ao atualizar status:', error);
      return null;
    }
  },

  // --- NOVO: Editar Dados (Data, Hora, Nome) ---
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao editar:', error);
      return null;
    }
  },

  // --- NOVO: Deletar Agendamento ---
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar:', error);
      return false;
    }
  }
};