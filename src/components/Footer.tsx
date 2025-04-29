
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 bg-gray-50 border-t">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex flex-col items-center space-y-2 md:items-start">
            <Link to="/" className="text-lg font-bold text-medical-primary">
              SaludAlDía
            </Link>
            <p className="text-sm text-gray-500">
              Gestionando su salud de manera simple
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Plataforma</h3>
              <Link to="/" className="text-gray-500 hover:text-medical-primary">
                Inicio
              </Link>
              <Link to="/specialties" className="text-gray-500 hover:text-medical-primary">
                Especialidades
              </Link>
              <Link to="/doctors" className="text-gray-500 hover:text-medical-primary">
                Profesionales
              </Link>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Soporte</h3>
              <Link to="/faq" className="text-gray-500 hover:text-medical-primary">
                Preguntas frecuentes
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-medical-primary">
                Contacto
              </Link>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Legal</h3>
              <Link to="/privacy" className="text-gray-500 hover:text-medical-primary">
                Privacidad
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-medical-primary">
                Términos de uso
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 text-sm text-center text-gray-500 border-t">
          <p>&copy; {new Date().getFullYear()} SaludAlDía. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
