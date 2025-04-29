
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppointmentCard from '@/components/AppointmentCard';
import { useAuth } from '@/context/AuthContext';
import { useAppointment } from '@/context/AppointmentContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUpcomingAppointments } = useAppointment();
  
  const upcomingAppointments = getUpcomingAppointments().slice(0, 3); // Mostrar solo los 3 próximos
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-8 bg-gray-50">
        <div className="container mx-auto">
          {/* Bienvenida */}
          <section className="mb-8">
            <div className="p-6 rounded-lg medical-gradient">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-bold text-white md:text-3xl">
                    Bienvenido, {user?.name}
                  </h1>
                  <p className="text-blue-100">
                    Gestione sus turnos médicos de manera fácil y rápida
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white text-medical-primary hover:bg-blue-50"
                  asChild
                >
                  <Link to="/appointments/new">Solicitar nuevo turno</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Dashboard de información */}
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            {/* Mis próximos turnos */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Mis próximos turnos</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                    <div className="text-center">
                      <Button variant="ghost" asChild>
                        <Link to="/appointments">Ver todos mis turnos</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                    <div className="p-3 rounded-full bg-medical-light text-medical-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No tiene turnos próximos programados
                    </p>
                    <Button
                      variant="outline"
                      className="border-medical-primary text-medical-primary hover:bg-medical-accent"
                      asChild
                    >
                      <Link to="/appointments/new">Solicitar turno</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="justify-start w-full border-medical-light text-medical-primary hover:bg-medical-accent"
                  asChild
                >
                  <Link to="/appointments/new">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Solicitar nuevo turno
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start w-full border-medical-light text-medical-primary hover:bg-medical-accent"
                  asChild
                >
                  <Link to="/appointments">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ver todos mis turnos
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start w-full border-medical-light text-medical-primary hover:bg-medical-accent"
                  asChild
                >
                  <Link to="/profile">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Editar mi perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Especialidades */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Especialidades disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <Link to="/appointments/new" className="block p-4 text-center transition-all rounded-lg group hover:bg-medical-accent">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-medical-light text-medical-primary group-hover:bg-medical-primary group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Cardiología</h3>
                </Link>

                <Link to="/appointments/new" className="block p-4 text-center transition-all rounded-lg group hover:bg-medical-accent">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-medical-light text-medical-primary group-hover:bg-medical-primary group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Dermatología</h3>
                </Link>

                <Link to="/appointments/new" className="block p-4 text-center transition-all rounded-lg group hover:bg-medical-accent">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-medical-light text-medical-primary group-hover:bg-medical-primary group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Oftalmología</h3>
                </Link>

                <Link to="/appointments/new" className="block p-4 text-center transition-all rounded-lg group hover:bg-medical-accent">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-medical-light text-medical-primary group-hover:bg-medical-primary group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Pediatría</h3>
                </Link>

                <Link to="/appointments/new" className="block p-4 text-center transition-all rounded-lg group hover:bg-medical-accent">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-medical-light text-medical-primary group-hover:bg-medical-primary group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Ginecología</h3>
                </Link>

                <Link to="/appointments/new" className="block p-4 text-center transition-all rounded-lg group hover:bg-medical-accent">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-medical-light text-medical-primary group-hover:bg-medical-primary group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Ver todas</h3>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
