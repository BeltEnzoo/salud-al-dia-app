
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, Doctor, Specialty, TimeSlot, AppointmentContextType } from '../types';
import { useAuth } from './AuthContext';
import { toast } from '../hooks/use-toast';

// Simulación de base de datos local
const APPOINTMENTS_STORAGE_KEY = 'salud_al_dia_appointments';
const DOCTORS_STORAGE_KEY = 'salud_al_dia_doctors';
const SPECIALTIES_STORAGE_KEY = 'salud_al_dia_specialties';

// Datos de muestra
const sampleSpecialties: Specialty[] = [
  { id: '1', name: 'Cardiología', imageUrl: 'https://placehold.co/100?text=❤️' },
  { id: '2', name: 'Dermatología', imageUrl: 'https://placehold.co/100?text=🧴' },
  { id: '3', name: 'Pediatría', imageUrl: 'https://placehold.co/100?text=👶' },
  { id: '4', name: 'Ginecología', imageUrl: 'https://placehold.co/100?text=👩' },
  { id: '5', name: 'Oftalmología', imageUrl: 'https://placehold.co/100?text=👁️' },
  { id: '6', name: 'Traumatología', imageUrl: 'https://placehold.co/100?text=🦴' },
];

const sampleDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Carlos Gutiérrez', specialty: '1', imageUrl: 'https://placehold.co/100?text=👨‍⚕️' },
  { id: '2', name: 'Dra. Laura Martínez', specialty: '1', imageUrl: 'https://placehold.co/100?text=👩‍⚕️' },
  { id: '3', name: 'Dr. Miguel Sánchez', specialty: '2', imageUrl: 'https://placehold.co/100?text=👨‍⚕️' },
  { id: '4', name: 'Dra. Ana López', specialty: '3', imageUrl: 'https://placehold.co/100?text=👩‍⚕️' },
  { id: '5', name: 'Dr. Roberto Fernández', specialty: '4', imageUrl: 'https://placehold.co/100?text=👨‍⚕️' },
  { id: '6', name: 'Dra. Julia García', specialty: '5', imageUrl: 'https://placehold.co/100?text=👩‍⚕️' },
  { id: '7', name: 'Dr. Eduardo Torres', specialty: '6', imageUrl: 'https://placehold.co/100?text=👨‍⚕️' },
];

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Inicializar datos
  useEffect(() => {
    // Cargar especialidades
    const storedSpecialties = localStorage.getItem(SPECIALTIES_STORAGE_KEY);
    if (!storedSpecialties) {
      localStorage.setItem(SPECIALTIES_STORAGE_KEY, JSON.stringify(sampleSpecialties));
      setSpecialties(sampleSpecialties);
    } else {
      setSpecialties(JSON.parse(storedSpecialties));
    }

    // Cargar médicos
    const storedDoctors = localStorage.getItem(DOCTORS_STORAGE_KEY);
    if (!storedDoctors) {
      localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(sampleDoctors));
      setDoctors(sampleDoctors);
    } else {
      setDoctors(JSON.parse(storedDoctors));
    }
  }, []);

  // Cargar citas del usuario actual
  useEffect(() => {
    if (user) {
      const allAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || '[]');
      const userAppointments = allAppointments.filter((app: Appointment) => app.userId === user.id);
      setAppointments(userAppointments.map((app: any) => ({
        ...app,
        dateTime: new Date(app.dateTime),
        createdAt: new Date(app.createdAt)
      })));
    }
  }, [user]);

  // Obtener slots disponibles
  const getAvailableSlots = async (doctorId: string, date: Date) => {
    // Simulación de API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convertir la fecha a string para comparación
    const dateStr = date.toDateString();
    
    // Generar horarios para ese día (8am - 6pm, cada 30 min)
    const slots: TimeSlot[] = [];
    const existingAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || '[]');
    
    // Para cada media hora desde las 8:00 hasta las 18:00
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const slotDateTime = new Date(date);
        slotDateTime.setHours(hour, minute, 0, 0);
        
        // Saltear slots en el pasado
        if (slotDateTime < new Date()) continue;
        
        // Verificar si ya existe una cita en ese horario
        const isBooked = existingAppointments.some((app: any) => {
          const appDateTime = new Date(app.dateTime);
          return (
            app.doctorId === doctorId &&
            app.status === 'scheduled' &&
            appDateTime.getFullYear() === slotDateTime.getFullYear() &&
            appDateTime.getMonth() === slotDateTime.getMonth() &&
            appDateTime.getDate() === slotDateTime.getDate() &&
            appDateTime.getHours() === slotDateTime.getHours() &&
            appDateTime.getMinutes() === slotDateTime.getMinutes()
          );
        });
        
        slots.push({
          id: `${doctorId}_${slotDateTime.getTime()}`,
          doctorId,
          date: slotDateTime,
          isAvailable: !isBooked
        });
      }
    }
    
    const availableSlots = slots.filter(slot => slot.isAvailable);
    setAvailableSlots(availableSlots);
    return availableSlots;
  };

  // Reservar turno
  const bookAppointment = async (slot: TimeSlot) => {
    if (!user || !selectedSpecialty) {
      toast({
        title: "Error",
        description: "Debe iniciar sesión y seleccionar una especialidad",
        variant: "destructive"
      });
      return;
    }

    try {
      // Crear nueva cita
      const newAppointment: Appointment = {
        id: `app_${Date.now()}`,
        userId: user.id,
        doctorId: slot.doctorId,
        specialtyId: selectedSpecialty.id,
        dateTime: slot.date,
        status: 'scheduled',
        createdAt: new Date()
      };

      // Guardar en "base de datos"
      const existingAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || '[]');
      localStorage.setItem(
        APPOINTMENTS_STORAGE_KEY, 
        JSON.stringify([...existingAppointments, newAppointment])
      );

      // Actualizar estado local
      setAppointments(prev => [...prev, newAppointment]);
      
      toast({
        title: "Turno reservado",
        description: `Tu turno ha sido reservado para el ${slot.date.toLocaleDateString()} a las ${slot.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
      
      // Actualizar slots disponibles
      if (selectedDoctor && selectedDate) {
        await getAvailableSlots(selectedDoctor.id, selectedDate);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo reservar el turno",
        variant: "destructive"
      });
    }
  };

  // Cancelar turno
  const cancelAppointment = async (appointmentId: string) => {
    try {
      // Buscar todas las citas
      const allAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || '[]');
      
      // Actualizar el estado de la cita a cancelado
      const updatedAppointments = allAppointments.map((app: any) => {
        if (app.id === appointmentId) {
          return { ...app, status: 'cancelled' };
        }
        return app;
      });
      
      // Guardar cambios
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
      
      // Actualizar estado local
      setAppointments(prev => prev.map(app => {
        if (app.id === appointmentId) {
          return { ...app, status: 'cancelled' };
        }
        return app;
      }));
      
      toast({
        title: "Turno cancelado",
        description: "El turno ha sido cancelado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar el turno",
        variant: "destructive"
      });
    }
  };

  // Obtener turnos próximos
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(app => 
        app.status === 'scheduled' && new Date(app.dateTime) >= now
      )
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };

  // Obtener historial de turnos
  const getPastAppointments = () => {
    const now = new Date();
    return appointments
      .filter(app => 
        app.status === 'completed' || 
        app.status === 'cancelled' ||
        (app.status === 'scheduled' && new Date(app.dateTime) < now)
      )
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  };

  const value = {
    appointments,
    doctors,
    specialties,
    availableSlots,
    selectedSpecialty,
    selectedDoctor,
    selectedDate,
    setSelectedSpecialty,
    setSelectedDoctor,
    setSelectedDate,
    getAvailableSlots,
    bookAppointment,
    cancelAppointment,
    getUpcomingAppointments,
    getPastAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment debe ser usado dentro de un AppointmentProvider');
  }
  return context;
};
