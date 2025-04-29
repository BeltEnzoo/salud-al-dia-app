
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Specialty } from '@/types';
import { cn } from '@/lib/utils';

interface SpecialtyCardProps {
  specialty: Specialty;
  selected?: boolean;
  onClick?: () => void;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ 
  specialty, 
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
        {specialty.imageUrl ? (
          <img 
            src={specialty.imageUrl} 
            alt={specialty.name} 
            className="object-cover w-16 h-16 mb-3 rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-16 h-16 mb-3 text-2xl rounded-full bg-medical-light text-medical-primary">
            {specialty.name.charAt(0)}
          </div>
        )}
        <h3 className="text-base font-medium text-center">{specialty.name}</h3>
      </CardContent>
    </Card>
  );
};

export default SpecialtyCard;
