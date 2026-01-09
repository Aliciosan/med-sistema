import { supabase } from './supabaseClient';

export const patientService = {
  // 1. Lista Pacientes Únicos (Baseado no histórico)
  getUniquePatients: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      const patientsMap = new Map();

      data.forEach(apt => {
        const nameKey = apt.patient_name ? apt.patient_name.trim() : 'Desconhecido';
        
        if (!patientsMap.has(nameKey)) {
          patientsMap.set(nameKey, {
            id: apt.patient_id || Math.random(), // ID visual
            name: apt.patient_name || 'Paciente Sem Nome',
            lastVisit: apt.date,
            totalVisits: 1,
            status: apt.status === 'confirmed' ? 'Ativo' : 'Inativo',
            phone: '(11) 99999-9999' // Simulado
          });
        } else {
          const p = patientsMap.get(nameKey);
          p.totalVisits += 1;
        }
      });

      return Array.from(patientsMap.values());
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      return [];
    }
  },

  // 2. NOVO: Busca Histórico Completo (Consultas + Prontuários)
  getPatientHistory: async (patientName) => {
    try {
      // Busca Consultas
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_name', patientName)
        .order('id', { ascending: false });

      // Busca Prontuários (Anotações)
      const { data: records } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_name', patientName)
        .order('id', { ascending: false });

      return {
        appointments: appointments || [],
        records: records || []
      };
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return { appointments: [], records: [] };
    }
  },

  // 3. NOVO: Excluir Paciente (Remove todos os registros dele)
  deletePatientData: async (patientName) => {
    try {
      // Remove Consultas
      await supabase.from('appointments').delete().eq('patient_name', patientName);
      // Remove Prontuários
      await supabase.from('medical_records').delete().eq('patient_name', patientName);
      return true;
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      return false;
    }
  }
};