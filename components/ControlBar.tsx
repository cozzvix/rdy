import React, { useState } from 'react';
import { ExamConfig, ThemeMode } from '../types';

interface ControlBarProps {
  opacity: number;
  setOpacity: (val: number) => void;
  config: ExamConfig;
  onReconfigure: () => void;
  theme: ThemeMode;
  setTheme: (val: ThemeMode) => void;
  onClear: () => void;
  onLogout: () => void;
  customBg: string;
  setCustomBg: (val: string) => void;
  isGhostMode: boolean;
  setIsGhostMode: (val: boolean) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ 
  opacity, 
  setOpacity, 
  onReconfigure,
  theme,
  setTheme,
  onClear,
  onLogout,
  customBg,
  setCustomBg,
  isGhostMode,
  setIsGhostMode
}) => {
  const isLight = theme === 'light';
  const [isPicking, setIsPicking] = useState(false);

  // Check if EyeDropper API is supported
  const hasEyeDropper = 'EyeDropper' in window;

  const handleEyeDropper = async () => {
    if (!hasEyeDropper) return;
    setIsPicking(true);
    try {
      // @ts-ignore
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setCustomBg(result.sRGBHex);
    } catch (e) {
      console.log('EyeDropper canceled or failed', e);
    } finally {
      setIsPicking(false);
    }
  };

  const containerClasses = isGhostMode
    ? 'bg-transparent border-transparent' 
    : `border-b backdrop-blur-sm transition-colors ${
        customBg 
          ? 'border-black/5' 
          : isLight 
            ? 'bg-white/90 border-gray-200' 
            : 'bg-neutral-900/90 border-neutral-800'
      }`;
  
  const textClasses = 'text-inherit'; 

  return (
    <div className={`flex items-center justify-between p-2 ${containerClasses} ${textClasses}`}>
      <div className="flex items-center space-x-3">
        
        {/* Config Button */}
        <button 
          onClick={onReconfigure}
          className={`text-[10px] uppercase font-bold px-3 py-1 rounded border transition-colors ${
            isGhostMode ? 'opacity-50 hover:opacity-100 border-transparent bg-transparent' : 
            isLight 
              ? 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200' 
              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
          }`}
          title="Configuración"
        >
          CFG
        </button>

        {/* Eye Dropper (Chameleon) */}
        {hasEyeDropper && (
             <button 
             onClick={handleEyeDropper}
             disabled={isPicking}
             className={`w-6 h-6 flex items-center justify-center rounded border transition-colors ${
               isGhostMode ? 'opacity-50 hover:opacity-100 border-transparent bg-transparent' : 
               isLight 
                 ? 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200' 
                 : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
             }`}
             title="Tomar Color de Fondo"
           >
             <div className="w-2 h-2 rounded-full border border-current"></div>
           </button>
        )}

        {/* Ghost Mode Toggle */}
        <button 
          onClick={() => setIsGhostMode(!isGhostMode)}
          className={`w-6 h-6 flex items-center justify-center rounded border transition-colors ${
            isGhostMode 
              ? 'bg-blue-600/20 text-blue-500 border-blue-500/50' 
              : (isLight 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200' 
                  : 'bg-neutral-800 border-neutral-700 text-neutral-600 hover:bg-neutral-700')
          }`}
          title="Modo Fantasma (Solo Texto)"
        >
          <span className="text-xs">👻</span>
        </button>

      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle (Hidden if custom bg is active to avoid confusion) */}
        {!customBg && !isGhostMode && (
             <button 
             onClick={() => setTheme(isLight ? 'dark' : 'light')}
             className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${
               isLight 
                 ? 'text-gray-400 hover:text-gray-600' 
                 : 'text-neutral-600 hover:text-neutral-400'
             }`}
           >
             {isLight ? 'DARK' : 'LIGHT'}
           </button>
        )}

        {/* Clear Button */}
        <button 
          onClick={onClear}
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${
             isGhostMode ? 'opacity-0 hover:opacity-100' : 
             isLight 
             ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' 
             : 'text-neutral-600 hover:text-red-400 hover:bg-red-900/20'
          }`}
          title="Limpiar (Ctrl + L)"
        >
          CLEAR
        </button>

        {/* Opacity Slider */}
        <div 
          className="group relative flex items-center" 
          title="Opacidad"
        >
          <div className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
             isLight ? 'bg-gray-300 group-hover:bg-blue-400' : 'bg-neutral-700 group-hover:bg-blue-600'
          }`}></div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="absolute right-0 w-24 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer h-full"
          />
        </div>
      </div>
    </div>
  );
};