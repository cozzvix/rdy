import React, { useRef, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface InputAreaProps {
  onSend: (text: string, images: string[]) => void;
  isLoading: boolean;
  theme: ThemeMode;
  isGhostMode: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, theme, isGhostMode }) => {
  const [text, setText] = useState('');
  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLight = theme === 'light';

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    let foundImage = false;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        foundImage = true;
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setPastedImages(prev => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
    
    if (foundImage) {
        e.preventDefault(); 
    }
  };

  const removeImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if ((!text.trim() && pastedImages.length === 0) || isLoading) return;
    onSend(text, pastedImages);
    setText('');
    setPastedImages([]);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Ghost Mode: No background, no border. Just floating input.
  const containerClass = isGhostMode
    ? 'border-transparent bg-transparent'
    : (isLight ? 'border-gray-200 bg-white' : 'border-neutral-900 bg-black');
    
  const textAreaClass = isLight
    ? 'bg-transparent text-gray-900 placeholder-gray-400'
    : 'bg-transparent text-neutral-200 placeholder-neutral-700';

  return (
    <div className={`p-3 border-t transition-colors ${containerClass}`}>
      {pastedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
            {pastedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                    <img src={img} alt={`preview ${idx}`} className="h-10 w-auto rounded border border-neutral-600 opacity-60 group-hover:opacity-100 transition-opacity object-cover" />
                    <button 
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    >
                        x
                    </button>
                </div>
            ))}
        </div>
      )}
      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={isGhostMode ? "..." : "Escribe o pega..."}
          className={`w-full text-sm resize-none focus:outline-none min-h-[24px] max-h-[100px] py-1 ${textAreaClass}`}
          rows={1}
          style={{ height: text.length > 50 ? 'auto' : '24px' }}
        />
        <div className={`w-2 h-2 rounded-full mb-2 transition-colors ${isLoading ? (isLight ? 'bg-blue-500 animate-pulse' : 'bg-blue-600 animate-pulse') : (isLight ? 'bg-gray-300' : 'bg-neutral-800')}`}></div>
      </div>
    </div>
  );
};