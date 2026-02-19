import React, { useState, useEffect } from 'react';
import { AcademicLevel, ExamConfig, ExamType, ResponseStyle, SubjectMode, ThemeMode } from '../types';
import { InstructionsPanel } from './InstructionsPanel';

interface PreExamFormProps {
  onStart: (config: ExamConfig) => void;
  theme: ThemeMode;
  onLogout: () => void;
}

export const PreExamForm: React.FC<PreExamFormProps> = ({ onStart, theme, onLogout }) => {
  const [subject, setSubject] = useState<SubjectMode>('general');
  const [customSubject, setCustomSubject] = useState('');
  
  const [examType, setExamType] = useState<ExamType>('mixed');
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>('mixed_short');
  
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('university');
  const [language, setLanguage] = useState<'auto' | 'es' | 'en'>('es');
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const isLight = theme === 'light';

  // Reset response style when exam type changes to ensure validity
  useEffect(() => {
    if (examType === 'mixed') {
        setResponseStyle('mixed_short');
    } else if (examType === 'closed') {
        setResponseStyle('option_only');
    } else {
        setResponseStyle('short');
    }
  }, [examType]);
  
  const subjects: {value: SubjectMode, label: string}[] = [
    { value: 'general', label: 'General' },
    { value: 'math', label: 'Matemáticas' },
    { value: 'physics', label: 'Física' },
    { value: 'chemistry', label: 'Química' },
    { value: 'biology', label: 'Biología' },
    { value: 'geography', label: 'Geografía' },
    { value: 'coding', label: 'Programación' },
    { value: 'history', label: 'Historia' },
    { value: 'science', label: 'Ciencias (General)' },
    { value: 'ethics', label: 'Ética' },
    { value: 'philosophy', label: 'Filosofía' },
    { value: 'custom', label: 'Otro / Específico...' },
  ];

  const handleInitialClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmStart = () => {
    onStart({
      subject,
      customSubject: subject === 'custom' ? customSubject : undefined,
      examType,
      responseStyle,
      academicLevel,
      language
    });
  };

  const containerClass = isLight ? 'bg-white text-gray-800' : 'bg-neutral-900 text-neutral-300';
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-500' : 'text-neutral-500'}`;
  const inputClass = `w-full p-2 rounded text-sm mb-4 border focus:outline-none focus:ring-1 ${
    isLight 
      ? 'bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-100' 
      : 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 focus:ring-neutral-800'
  }`;
  
  const selectClass = inputClass; // Reuse styles

  const radioContainerClass = `flex space-x-2 mb-4`;
  const radioLabelClass = (active: boolean) => `
    flex-1 text-center py-2 px-1 rounded cursor-pointer text-xs transition-colors border flex items-center justify-center
    ${active 
      ? (isLight ? 'bg-blue-600 text-white border-blue-600' : 'bg-neutral-200 text-neutral-900 border-neutral-200') 
      : (isLight ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200' : 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:bg-neutral-700')
    }
  `;

  // Helper to display readable config in modal
  const getReadableStyle = () => {
      switch(responseStyle) {
          case 'mixed_short': return 'Corta e Incisos';
          case 'mixed_detailed': return 'Detallada e Incisos';
          case 'option_only': return 'Solo Inciso';
          case 'detailed': return examType === 'closed' ? 'Inciso y Explicación' : 'Detallada';
          case 'short': return 'Corta';
          default: return responseStyle;
      }
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-6 ${containerClass} relative overflow-y-auto`}>
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-10">
          <button 
              onClick={onLogout}
              className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded transition-colors ${
                  isLight ? 'text-gray-400 hover:text-red-500 hover:bg-gray-100' : 'text-neutral-600 hover:text-red-400 hover:bg-neutral-800'
              }`}
          >
              Cerrar Sesión
          </button>
      </div>

      <div className="flex flex-row gap-12 items-start justify-center w-full max-w-5xl">
        
        {/* FORM COLUMN */}
        <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold tracking-tight opacity-90">Pre Examen</h1>
                <p className={`text-xs mt-1 ${isLight ? 'text-gray-400' : 'text-neutral-600'}`}>optimiza las respuestas que necesitas</p>
            </div>

            {/* Subject Selection - Custom Dropdown for scrolling */}
            <div className="relative">
            <label className={labelClass}>Materia / Tema</label>
            <button
                type="button"
                onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                className={`${selectClass} text-left flex justify-between items-center`}
            >
                <span>{subjects.find(s => s.value === subject)?.label}</span>
                <span className="text-xs opacity-50">▼</span>
            </button>

            {showSubjectDropdown && (
                <div className={`absolute z-20 w-full -mt-3 rounded-b shadow-xl border max-h-48 overflow-y-auto scrollbar-thin ${
                    isLight 
                    ? 'bg-white border-gray-200 scrollbar-thumb-gray-300' 
                    : 'bg-neutral-800 border-neutral-700 scrollbar-thumb-neutral-600'
                }`}>
                    {subjects.map((s) => (
                        <div
                            key={s.value}
                            onClick={() => {
                                setSubject(s.value);
                                setShowSubjectDropdown(false);
                            }}
                            className={`p-2 text-sm cursor-pointer transition-colors ${
                                s.value === subject 
                                ? (isLight ? 'bg-blue-50 text-blue-800 font-semibold' : 'bg-neutral-700 text-neutral-100 font-semibold') 
                                : (isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-neutral-300 hover:bg-neutral-700')
                            }`}
                        >
                            {s.label}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Overlay to close dropdown when clicking outside */}
            {showSubjectDropdown && (
                <div className="fixed inset-0 z-10" onClick={() => setShowSubjectDropdown(false)}></div>
            )}
            
            {subject === 'custom' && (
                <input 
                type="text" 
                placeholder="Ej: Derecho Romano, Anatomía, C# Avanzado..." 
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className={inputClass}
                autoFocus
                />
            )}
            </div>

            {/* Exam Type */}
            <div>
                <label className={labelClass}>Tipo de Examen</label>
                <div className={radioContainerClass}>
                    <div 
                        onClick={() => setExamType('open')} 
                        className={radioLabelClass(examType === 'open')}
                    >
                        Abierto
                    </div>
                    <div 
                        onClick={() => setExamType('closed')} 
                        className={radioLabelClass(examType === 'closed')}
                    >
                        Cerrado
                    </div>
                    <div 
                        onClick={() => setExamType('mixed')} 
                        className={radioLabelClass(examType === 'mixed')}
                    >
                        Mixto
                    </div>
                </div>
            </div>

            {/* Response Style (Dynamic based on Exam Type) */}
            <div>
            <label className={labelClass}>Tipo de Respuesta</label>
            <div className={radioContainerClass}>
                {examType === 'mixed' && (
                    <>
                        <div 
                            onClick={() => setResponseStyle('mixed_short')} 
                            className={radioLabelClass(responseStyle === 'mixed_short')}
                        >
                            <div>
                                <span className="block font-semibold">Corta e Incisos</span>
                                <span className="block text-[10px] opacity-80">(10-15 palabras)</span>
                            </div>
                        </div>
                        <div 
                            onClick={() => setResponseStyle('mixed_detailed')} 
                            className={radioLabelClass(responseStyle === 'mixed_detailed')}
                        >
                            <div>
                                <span className="block font-semibold">Detallada e Incisos</span>
                                <span className="block text-[10px] opacity-80">(~25 palabras)</span>
                            </div>
                        </div>
                    </>
                )}
                
                {examType === 'closed' && (
                    <>
                        <div 
                            onClick={() => setResponseStyle('option_only')} 
                            className={radioLabelClass(responseStyle === 'option_only')}
                        >
                            Solo Inciso
                        </div>
                        <div 
                            onClick={() => setResponseStyle('detailed')} 
                            className={radioLabelClass(responseStyle === 'detailed')}
                        >
                            <div>
                                <span className="block font-semibold">Inciso y Exp.</span>
                                <span className="block text-[10px] opacity-80">(~25 palabras)</span>
                            </div>
                        </div>
                    </>
                )}

                {examType === 'open' && (
                    <>
                        <div 
                            onClick={() => setResponseStyle('short')} 
                            className={radioLabelClass(responseStyle === 'short')}
                        >
                            <div>
                                <span className="block font-semibold">Corta</span>
                                <span className="block text-[10px] opacity-80">(10-15 palabras)</span>
                            </div>
                        </div>
                        <div 
                            onClick={() => setResponseStyle('detailed')} 
                            className={radioLabelClass(responseStyle === 'detailed')}
                        >
                            <div>
                                <span className="block font-semibold">Detallada</span>
                                <span className="block text-[10px] opacity-80">(~25 palabras)</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            </div>

            {/* Row for Level & Language */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className={labelClass}>Nivel</label>
                    <select 
                        value={academicLevel}
                        onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                        className={selectClass}
                    >
                        <option value="high_school">Preparatoria</option>
                        <option value="university">Universidad</option>
                        <option value="expert">Experto</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className={labelClass}>Idioma Output</label>
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className={selectClass}
                    >
                        <option value="auto">Automático</option>
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                    </select>
                </div>
            </div>

            {/* Start Button */}
            <button 
            onClick={handleInitialClick}
            className={`w-full py-3 rounded font-bold text-sm tracking-widest mt-4 transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                isLight 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-neutral-200 text-neutral-900 hover:bg-white'
            }`}
            >
            TODO LISTO
            </button>
        </div>

        {/* INSTRUCTIONS COLUMN (Visible on medium screens and up) */}
        <InstructionsPanel theme={theme} />

      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className={`w-full max-w-sm p-6 rounded-lg shadow-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-neutral-900 border-neutral-700'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isLight ? 'text-gray-800' : 'text-neutral-200'}`}>Confirmar Sesión</h3>
                  
                  <div className={`space-y-3 mb-6 text-sm ${isLight ? 'text-gray-600' : 'text-neutral-400'}`}>
                      <div className="flex justify-between border-b pb-2 border-dashed border-gray-700/30">
                          <span>Materia:</span>
                          <span className="font-semibold text-right">{subject === 'custom' ? customSubject || 'Custom' : subjects.find(s => s.value === subject)?.label}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2 border-dashed border-gray-700/30">
                          <span>Tipo de Examen:</span>
                          <span className="font-semibold capitalize text-right">{examType === 'mixed' ? 'Mixto' : examType === 'open' ? 'Abierto' : 'Cerrado'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2 border-dashed border-gray-700/30">
                          <span>Respuesta:</span>
                          <span className="font-semibold text-right">{getReadableStyle()}</span>
                      </div>
                      <div className="flex justify-between">
                          <span>Idioma:</span>
                          <span className="font-semibold capitalize text-right">{language === 'auto' ? 'Auto' : language === 'es' ? 'Español' : 'Inglés'}</span>
                      </div>
                  </div>

                  <div className="flex space-x-3">
                      <button 
                          onClick={() => setShowConfirmation(false)}
                          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                              isLight 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          }`}
                      >
                          Corregir
                      </button>
                      <button 
                          onClick={handleConfirmStart}
                          className={`flex-1 py-2 rounded text-sm font-bold tracking-wide transition-colors ${
                              isLight 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-neutral-100 text-neutral-900 hover:bg-white'
                          }`}
                      >
                          CONFIRMAR
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};