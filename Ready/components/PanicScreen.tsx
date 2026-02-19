import React from 'react';

interface PanicScreenProps {
  mode: 'notepad';
}

export const PanicScreen: React.FC<PanicScreenProps> = () => {
  return (
      <div className="w-full h-full bg-white text-black p-8 font-serif overflow-y-auto selection:bg-blue-200 selection:text-black">
        <h1 className="text-2xl font-bold mb-4 font-sans">Notas del Proyecto: Historia de la Arquitectura</h1>
        <p className="mb-4 leading-relaxed">
          La arquitectura romana es famosa por su uso del arco, la bóveda y la cúpula.
          A diferencia de los griegos, que utilizaban columnas como soporte estructural, los romanos las usaban a menudo con fines decorativos.
          Esto les permitió construir edificios masivos como el Coliseo y el Panteón.
        </p>
        <p className="mb-4">
          <strong>Términos clave para recordar:</strong>
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Acueducto - Canales de suministro de agua</li>
          <li>Basílica - Gran edificio público</li>
          <li>Termas - Baños públicos</li>
          <li>Óculo - Abertura circular en una cúpula</li>
        </ul>
        <div className="mt-8 p-4 border-l-4 border-gray-300 bg-gray-50 text-sm italic">
            "El Panteón es el edificio mejor conservado de la antigua Roma." - Verificar fuente.
        </div>
        <p className="text-gray-400 text-xs mt-12 font-sans">Última edición: Hoy a las 10:42 AM • 248 palabras</p>
      </div>
  );
};