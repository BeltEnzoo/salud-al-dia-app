
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 bg-medical-accent">
        <div className="container grid items-center gap-12 px-4 md:grid-cols-2">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Gestione sus citas médicas de manera <span className="text-medical-primary">simple y rápida</span>
            </h1>
            <p className="text-lg text-gray-700 md:text-xl">
              Con SaludAlDía puede reservar, reprogramar o cancelar sus citas médicas en línea, sin esperas ni llamadas telefónicas.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button
                size="lg"
                className="bg-medical-primary hover:bg-medical-dark"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-medical-primary text-medical-primary hover:bg-medical-accent"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="https://placehold.co/600x400/e8f0fe/1a73e8?text=SaludAlDía"
              alt="Gestión de citas médicas"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <h2 className="mb-12 text-3xl font-bold text-center">¿Por qué elegir SaludAlDía?</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 transition-all rounded-lg shadow-md hover:shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-medical-light text-medical-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Ahorre tiempo</h3>
              <p className="text-gray-600">
                Reserve sus citas médicas en cualquier momento del día, sin necesidad de esperar en línea telefónica.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 transition-all rounded-lg shadow-md hover:shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-medical-light text-medical-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Fácil de usar</h3>
              <p className="text-gray-600">
                Interfaz intuitiva que le permite gestionar todas sus citas médicas con solo unos clics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 transition-all rounded-lg shadow-md hover:shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-medical-light text-medical-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">Seguro y confidencial</h3>
              <p className="text-gray-600">
                Sus datos personales y médicos están protegidos con los más altos estándares de seguridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <h2 className="mb-12 text-3xl font-bold text-center">¿Cómo funciona?</h2>
          
          <div className="grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-xl font-bold text-white rounded-full bg-medical-primary">
                1
              </div>
              <h3 className="mb-2 text-xl font-medium text-center">Regístrese</h3>
              <p className="text-center text-gray-600">
                Cree una cuenta con sus datos personales
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-xl font-bold text-white rounded-full bg-medical-primary">
                2
              </div>
              <h3 className="mb-2 text-xl font-medium text-center">Elija especialidad</h3>
              <p className="text-center text-gray-600">
                Seleccione la especialidad médica que necesita
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-xl font-bold text-white rounded-full bg-medical-primary">
                3
              </div>
              <h3 className="mb-2 text-xl font-medium text-center">Seleccione fecha y hora</h3>
              <p className="text-center text-gray-600">
                Escoja el día y horario que mejor le convenga
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-xl font-bold text-white rounded-full bg-medical-primary">
                4
              </div>
              <h3 className="mb-2 text-xl font-medium text-center">¡Listo!</h3>
              <p className="text-center text-gray-600">
                Reciba la confirmación de su turno
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-medical-primary hover:bg-medical-dark"
              onClick={() => navigate('/register')}
            >
              Comenzar ahora
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
