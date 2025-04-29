
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialtyCard from '@/components/SpecialtyCard';
import DoctorCard from '@/components/DoctorCard';
import { useAppointment } from '@/context/AppointmentContext';
import { toast } from '@/hooks/use-toast';

const steps = [
  { id: 1, name: 'Especialidad' },
  { id: 2, name: 'Profesional' },
  { id: 3, name: 'Fecha y hora' },
  { id: 4, name: 'Confirmación' },
];

const NewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { 
    specialties,
    doctors, 
    availableSlots,
    selectedSpecialty, 
    selectedDoctor, 
    selectedDate, 
    setSelectedSpecialty,
    setSelectedDoctor,
    setSelectedDate,
    getAvailableSlots,
    bookAppointment
  } = useAppointment();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Filtrar médicos por la especialidad seleccionada
  const filteredDoctors = selectedSpecialty 
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty.id) 
    : [];
  
  // Agrupar horarios disponibles por hora
  const groupedSlots = availableSlots.reduce<Record<string, typeof availableSlots>>((acc, slot) => {
    const hour = format(new Date(slot.date), 'HH:mm');
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(slot);
    return acc;
  }, {});

  // Cuando seleccionamos un médico, limpiar la fecha
  useEffect(() => {
    if (currentStep === 3 && selectedDoctor && !selectedDate) {
      // Si no hay fecha seleccionada, establecer a hoy o mañana como fecha inicial
      const initialDate = new Date();
      if (initialDate.getHours() >= 17) { // Si es tarde, mostrar disponibilidad para mañana
        initialDate.setDate(initialDate.getDate() + 1);
      }
      setSelectedDate(initialDate);
    }
  }, [currentStep, selectedDoctor, selectedDate, setSelectedDate]);
  
  // Cuando cambia la fecha o el médico seleccionado, obtener slots disponibles
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDoctor && selectedDate) {
        await getAvailableSlots(selectedDoctor.id, selectedDate);
        setSelectedTime(null); // Resetear el horario seleccionado
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDoctor, selectedDate, getAvailableSlots]);
  
  // Manejar el cambio de paso
  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      // Validaciones específicas por paso
      if (currentStep === 1 && !selectedSpecialty) {
        toast({
          title: "Error",
          description: "Por favor, seleccione una especialidad",
          variant: "destructive"
        });
        return;
      }
      
      if (currentStep === 2 && !selectedDoctor) {
        toast({
          title: "Error",
          description: "Por favor, seleccione un profesional",
          variant: "destructive"
        });
        return;
      }
      
      if (currentStep === 3 && !selectedTime) {
        toast({
          title: "Error",
          description: "Por favor, seleccione un horario disponible",
          variant: "destructive"
        });
        return;
      }
      
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };
  
  // Confirmar la reserva del turno
  const handleConfirmAppointment = async () => {
    try {
      if (!selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime) {
        toast({
          title: "Error",
          description: "Por favor, complete todos los pasos necesarios",
          variant: "destructive"
        });
        return;
      }
      
      // Buscar el slot seleccionado
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      const selectedSlot = availableSlots.find(slot => 
        format(new Date(slot.date), 'HH:mm') === selectedTime
      );
      
      if (!selectedSlot) {
        toast({
          title: "Error",
          description: "El horario seleccionado ya no está disponible",
          variant: "destructive"
        });
        return;
      }
      
      await bookAppointment(selectedSlot);
      
      // Redireccionar a la página de turnos
      navigate('/appointments');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reservar el turno",
        variant: "destructive"
      });
    }
  };

  // Renderizado condicional según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Selección de especialidad
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Seleccione una especialidad</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {specialties.map((specialty) => (
                <SpecialtyCard
                  key={specialty.id}
                  specialty={specialty}
                  selected={selectedSpecialty?.id === specialty.id}
                  onClick={() => setSelectedSpecialty(specialty)}
                />
              ))}
            </div>
          </div>
        );
        
      case 2: // Selección de profesional
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Seleccione un profesional</h2>
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    selected={selectedDoctor?.id === doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No hay profesionales disponibles para la especialidad seleccionada.
              </p>
            )}
          </div>
        );
        
      case 3: // Selección de fecha y hora
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Seleccione fecha y hora</h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Calendario para seleccionar la fecha */}
              <div>
                <h3 className="mb-2 font-medium">Fecha</h3>
                <Card className="p-3 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => {
                      // Deshabilitar fechas pasadas y domingos
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today || date.getDay() === 0;
                    }}
                    locale={es}
                    className="pointer-events-auto"
                  />
                </Card>
              </div>
              
              {/* Lista de horarios disponibles */}
              <div>
                <h3 className="mb-2 font-medium">Horario</h3>
                {selectedDate ? (
                  Object.keys(groupedSlots).length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                      {Object.keys(groupedSlots).sort().map(time => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={selectedTime === time ? "bg-medical-primary hover:bg-medical-dark" : ""}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center border rounded-lg bg-gray-50">
                      <p className="text-gray-500">
                        No hay horarios disponibles para la fecha seleccionada.
                      </p>
                      <p className="text-sm text-gray-400">
                        Por favor, seleccione otra fecha.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-4 text-center border rounded-lg bg-gray-50">
                    <p className="text-gray-500">
                      Seleccione una fecha para ver los horarios disponibles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 4: // Confirmación
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Confirme su turno</h2>
            
            <Card className="overflow-hidden">
              <div className="p-1 medical-gradient" />
              <div className="p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Especialidad</h3>
                    <p className="text-lg">{selectedSpecialty?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Profesional</h3>
                    <p className="text-lg">{selectedDoctor?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
                    <p className="text-lg capitalize">
                      {selectedDate && format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Hora</h3>
                    <p className="text-lg">{selectedTime}</p>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-medical-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="text-gray-600">
                        Por favor, recuerde presentarse 15 minutos antes de su turno con su DNI.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Puede cancelar o reprogramar su turno hasta 24 horas antes de la hora programada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-8 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Solicitar nuevo turno</h1>
          
          {/* Steps indicator */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((step, index) => (
                  <li 
                    key={step.id} 
                    className={`relative flex-1 ${index === 0 ? '' : ''}`}
                  >
                    {index !== 0 && (
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className={`h-0.5 w-full ${currentStep > index ? 'bg-medical-primary' : 'bg-gray-200'}`}></div>
                      </div>
                    )}
                    <div className="relative flex flex-col items-center group">
                      <span 
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          currentStep > index
                            ? 'bg-medical-primary text-white'
                            : currentStep === index + 1
                            ? 'border-2 border-medical-primary text-medical-primary bg-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {currentStep > index ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="mt-2 text-xs font-medium text-center md:text-sm">
                        {step.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          
          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleStepChange('prev')}
              disabled={currentStep === 1}
            >
              Volver
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                className="bg-medical-primary hover:bg-medical-dark"
                onClick={() => handleStepChange('next')}
              >
                Continuar
              </Button>
            ) : (
              <Button 
                className="bg-medical-primary hover:bg-medical-dark"
                onClick={handleConfirmAppointment}
              >
                Confirmar turno
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewAppointment;
