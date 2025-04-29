
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { toast } from '../hooks/use-toast';

// Simulación de base de datos local
const USERS_STORAGE_KEY = 'salud_al_dia_users';
const LOGGED_USER_KEY = 'salud_al_dia_current_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(LOGGED_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simulación de registro
  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      setLoading(true);
      
      // Verificar si el email ya existe
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      if (users.some((u: User) => u.email === userData.email)) {
        throw new Error('El email ya está en uso');
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
      };
      
      // Guardar en "base de datos"
      localStorage.setItem(
        USERS_STORAGE_KEY, 
        JSON.stringify([...users, { ...newUser, password: userData.password }])
      );
      
      // Iniciar sesión automáticamente
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registro exitoso",
        description: "Bienvenido a SaludAlDía"
      });
    } catch (error: any) {
      toast({
        title: "Error en el registro",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulación de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Buscar usuario
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Credenciales incorrectas');
      }
      
      // Guardar sesión
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido de nuevo, ${foundUser.name}`
      });
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOGGED_USER_KEY);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
  };

  // Recuperación de contraseña (simulada)
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      
      // Verificar si el email existe
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (!userExists) {
        throw new Error('No existe una cuenta con este email');
      }
      
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Recuperación de contraseña",
        description: "Se han enviado las instrucciones a tu email"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
