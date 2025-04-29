
export interface User {
  id: string;
  name: string;
  dni: string;
  email: string;
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl?: string;
}

export interface Specialty {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: Date;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  specialtyId: string;
  dateTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

export interface AppointmentContextType {
  appointments: Appointment[];
  doctors: Doctor[];
  specialties: Specialty[];
  availableSlots: TimeSlot[];
  selectedSpecialty: Specialty | null;
  selectedDoctor: Doctor | null;
  selectedDate: Date | null;
  setSelectedSpecialty: (specialty: Specialty | null) => void;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedDate: (date: Date | null) => void;
  getAvailableSlots: (doctorId: string, date: Date) => Promise<TimeSlot[]>;
  bookAppointment: (slot: TimeSlot) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
}
