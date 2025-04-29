
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppointmentCard from '@/components/AppointmentCard';
import { useAppointment } from '@/context/AppointmentContext';

const AllAppointments: React.FC = () => {
  const { getUpcomingAppointments, getPastAppointments } = useAppointment();
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  
  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-8 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
            <h1 className="mb-4 text-3xl font-bold md:mb-0">Mis turnos</h1>
            <Button 
              className="bg-medical-primary hover:bg-medical-dark"
              asChild
            >
              <Link to="/appointments/new">Solicitar nuevo turno</Link>
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="past">Historial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <div className="p-4 rounded-full bg-medical-light text-medical-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium">No tiene turnos próximos</h2>
                  <p className="max-w-md text-gray-500">
                    ¿Necesita una consulta médica? Solicite un nuevo turno con nuestros profesionales.
                  </p>
                  <Button
                    className="mt-2 bg-medical-primary hover:bg-medical-dark"
                    asChild
                  >
                    <Link to="/appointments/new">Solicitar turno</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <div className="p-4 rounded-full bg-gray-100 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium">No tiene historial de turnos</h2>
                  <p className="max-w-md text-gray-500">
                    Aquí se mostrarán todas sus consultas pasadas y canceladas.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllAppointments;
