import React from 'react';
import { ThemeMode } from '../types';

interface InstructionsPanelProps {
  theme: ThemeMode;
}

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ theme }) => {
  const isLight = theme === 'light';

  const containerClass = isLight 
    ? 'border-l border-gray-200 text-gray-500' 
    : 'border-l border-neutral-800 text-neutral-500';

  const titleClass = `text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${isLight ? 'text-gray-400' : 'text-neutral-600'}`;
  
  const itemClass = "flex justify-between items-center text-xs mb-3 group hover:opacity-100 transition-opacity opacity-70";
  const keyClass = `font-mono text-[10px] px-1.5 py-0.5 rounded border ${
    isLight 
      ? 'bg-gray-100 border-gray-300 text-gray-600' 
      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
  }`;

  return (
    <div className={`hidden md:block w-64 pl-8 py-4 ${containerClass}`}>
      <h3 className={titleClass}>Atajos</h3>
      
      <div className="space-y-1">
        <div className={itemClass}>
          <span>Pánico</span>
          <span className={keyClass}>ESC</span>
        </div>
        
        <div className={itemClass}>
          <span>Borrar</span>
          <span className={keyClass}>CTRL + L</span>
        </div>
        
        <div className={itemClass}>
          <span>Salir</span>
          <span className={keyClass}>CTRL + ALT + Q</span>
        </div>

        <div className={itemClass}>
          <span>Enviar</span>
          <span className={keyClass}>ENTER</span>
        </div>

         <div className={itemClass}>
          <span>Pegar Imagen</span>
          <span className={keyClass}>CTRL + V</span>
        </div>
      </div>

      <h3 className={`${titleClass} mt-8`}>Sigilo</h3>
      
      <div className="space-y-3 text-[11px] leading-relaxed">
        <div className="group opacity-70 hover:opacity-100 transition-opacity">
          <strong className={isLight ? 'text-gray-700' : 'text-neutral-300'}>Modo Fantasma:</strong>
          <p>Quita el fondo. Solo deja el texto.</p>
        </div>

        <div className="group opacity-70 hover:opacity-100 transition-opacity">
          <strong className={isLight ? 'text-gray-700' : 'text-neutral-300'}>Gotero (Alt + C):</strong>
          <p>Usa el atajo para activar el selector y copia el color de otra ventana.</p>
        </div>
      </div>
    </div>
  );
};