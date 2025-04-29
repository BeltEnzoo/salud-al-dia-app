
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email('Ingrese un email válido')
});

type FormData = z.infer<typeof formSchema>;

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
    } catch (error) {
      // El error ya es manejado por el context con toast
      console.error('Error sending reset password:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          {!submitted ? (
            <>
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
                <p className="text-gray-500">
                  Ingrese su email para recibir instrucciones
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    {...register('email')} 
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-medical-primary hover:bg-medical-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-bold text-green-600">Email enviado</h2>
              <p className="text-gray-600">
                Se han enviado las instrucciones para restablecer su contraseña al email proporcionado.
              </p>
              <p className="text-gray-600">
                Por favor, revise su bandeja de entrada y siga las instrucciones.
              </p>
            </div>
          )}

          <div className="text-center">
            <Link to="/login" className="text-sm font-medium text-medical-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
