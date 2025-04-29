
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  dni: z.string().min(6, 'El DNI debe tener al menos 6 caracteres'),
  email: z.string().email('Ingrese un email válido'),
  phone: z.string().min(6, 'El teléfono debe tener al menos 6 caracteres'),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileFormSchema>;
type PasswordFormData = z.infer<typeof passwordFormSchema>;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    register: profileRegister, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfileForm
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      dni: user?.dni || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });
  
  const { 
    register: passwordRegister, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPasswordForm
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema)
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // Simular actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un caso real, aquí se actualizaría el perfil en la API
      toast({
        title: "Perfil actualizado",
        description: "Sus datos han sido actualizados correctamente"
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un caso real, aquí se actualizaría la contraseña en la API
      toast({
        title: "Contraseña actualizada",
        description: "Su contraseña ha sido actualizada correctamente"
      });
      
      resetPasswordForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfileForm({
      name: user?.name || '',
      dni: user?.dni || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-8 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Mi perfil</h1>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Datos personales</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Datos personales</CardTitle>
                  <CardDescription>
                    Vea y actualice su información personal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input 
                        id="name" 
                        {...profileRegister('name')} 
                        disabled={!isEditing}
                      />
                      {profileErrors.name && (
                        <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI</Label>
                      <Input 
                        id="dni" 
                        {...profileRegister('dni')} 
                        disabled={!isEditing}
                      />
                      {profileErrors.dni && (
                        <p className="text-sm text-red-500">{profileErrors.dni.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...profileRegister('email')} 
                        disabled={!isEditing}
                      />
                      {profileErrors.email && (
                        <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        {...profileRegister('phone')} 
                        disabled={!isEditing}
                      />
                      {profileErrors.phone && (
                        <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      {isEditing ? (
                        <>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-medical-primary hover:bg-medical-dark"
                            disabled={profileSubmitting}
                          >
                            {profileSubmitting ? 'Guardando...' : 'Guardar cambios'}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          type="button"
                          className="bg-medical-primary hover:bg-medical-dark"
                          onClick={() => setIsEditing(true)}
                        >
                          Editar perfil
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar contraseña</CardTitle>
                  <CardDescription>
                    Actualice su contraseña para mantener su cuenta segura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña actual</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        {...passwordRegister('currentPassword')} 
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        {...passwordRegister('newPassword')} 
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        {...passwordRegister('confirmPassword')} 
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-medical-primary hover:bg-medical-dark"
                        disabled={passwordSubmitting}
                      >
                        {passwordSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
