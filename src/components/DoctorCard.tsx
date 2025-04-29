
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Doctor } from '@/types';
import { cn } from '@/lib/utils';

interface DoctorCardProps {
  doctor: Doctor;
  selected?: boolean;
  onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  selected = false,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:border-medical-primary", 
        selected ? "border-2 border-medical-primary" : ""
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-4">
        {doctor.imageUrl ? (
          <img 
            src={doctor.imageUrl} 
            alt={doctor.name} 
            className="object-cover w-20 h-20 mb-3 rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-20 h-20 mb-3 text-2xl rounded-full bg-medical-light text-medical-primary">
            {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        )}
        <h3 className="text-base font-medium text-center">{doctor.name}</h3>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
