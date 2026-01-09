import { supabase } from './supabaseClient';

export const recordService = {
  // Buscar todos os prontuários
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

  // Criar novo prontuário
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
  }
};