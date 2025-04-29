
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Appointment, Doctor, Specialty } from '@/types';
import { useAppointment } from '@/context/AppointmentContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { doctors, specialties, cancelAppointment } = useAppointment();
  
  const doctor = doctors.find(d => d.id === appointment.doctorId);
  const specialty = specialties.find(s => s.id === appointment.specialtyId);
  
  const isUpcoming = new Date(appointment.dateTime) > new Date();
  const canCancel = isUpcoming && appointment.status === 'scheduled';
  
  const formatDate = (date: Date) => {
    return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
  };
  
  const getStatusBadgeClass = () => {
    switch (appointment.status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    switch (appointment.status) {
      case 'scheduled':
        return 'Programado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };
  
  const handleCancel = async () => {
    if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
      await cancelAppointment(appointment.id);
    }
  };

  return (
    <Card className="appointment-card overflow-hidden">
      <div className="p-1 medical-gradient" />
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h3 className="text-lg font-medium">{specialty?.name}</h3>
            <p className="text-sm text-gray-500">{doctor?.name}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${getStatusBadgeClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm">
            <span className="font-medium">Fecha y hora:</span>{" "}
            <span className="capitalize">{formatDate(new Date(appointment.dateTime))}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Creado el {format(new Date(appointment.createdAt), "dd/MM/yyyy")}
          </p>
        </div>
      </CardContent>
      
      {canCancel && (
        <CardFooter className="flex justify-end p-4 pt-0">
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={handleCancel}
          >
            Cancelar turno
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
