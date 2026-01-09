import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Tenta recuperar o usuário salvo ao abrir a página
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('med_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    let userData = null;
    
    // Lógica simples para definir quem é quem pelo email
    if (email.includes('medico')) {
      userData = { id: 1, name: 'Dra. Ana Silva', role: 'doctor', email };
    } else if (email.includes('admin')) {
      userData = { id: 2, name: 'Gestor', role: 'admin', email };
    } else {
      // Qualquer outro email vira paciente
      userData = { id: 3, name: 'Paciente Visitante', role: 'patient', email };
    }
    
    setUser(userData);
    localStorage.setItem('med_user', JSON.stringify(userData));
    return userData.role; // <--- O PULO DO GATO: Retorna a função para o Login saber
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('med_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);