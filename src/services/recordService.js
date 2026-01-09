import { supabase } from './supabaseClient';

export const recordService = {
  // Buscar todos
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar prontuários:', error);
      return [];
    }
  },

  // Criar
  create: async (record) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([record])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao criar prontuário:', error);
      return null;
    }
  },

  // --- NOVO: Atualizar Prontuário ---
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao atualizar prontuário:', error);
      return null;
    }
  },

  // --- NOVO: Deletar Prontuário ---
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar prontuário:', error);
      return false;
    }
  }
};