import React, { useState, useEffect, useRef } from 'react';
import { generateAnswer } from './services/geminiService';
import { ChatMessage, ViewMode, ExamConfig, ThemeMode } from './types';
import { ControlBar } from './components/ControlBar';
import { InputArea } from './components/InputArea';
import { PreExamForm } from './components/PreExamForm';
import { LoginScreen } from './components/LoginScreen';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Application State
  const [viewMode, setViewMode] = useState<ViewMode>('setup');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [opacity, setOpacity] = useState(1);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState(false);
  
  // Chameleon & Stealth Modes
  const [customBg, setCustomBg] = useState(''); // Stores hex color
  const [isGhostMode, setIsGhostMode] = useState(false); // Text-only mode
  
  // Configuration State
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    subject: 'general',
    examType: 'mixed',
    responseStyle: 'mixed_short',
    academicLevel: 'university',
    language: 'es'
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setViewMode('setup'); 
        setMessages([]);
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Panic Mode
      if (e.key === 'Escape') {
        e.preventDefault();
        try {
            window.open('', '_self', '');
            window.close();
        } catch (e) {
            console.log("Close blocked");
        }
        return;
      }
      
      // Clear Chat
      if (e.ctrlKey && e.code === 'KeyL' && viewMode === 'chat') {
        e.preventDefault();
        setMessages([]);
      }

      // Logout
      if (e.ctrlKey && e.altKey && e.code === 'KeyQ') {
         e.preventDefault();
         handleLogout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewMode, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [messages, viewMode, isLoading]);

  const handleStartExam = (config: ExamConfig) => {
    setExamConfig(config);
    setViewMode('chat');
  };

  const handleLogout = () => {
      signOut(auth);
  };

  const handleSend = async (text: string, images: string[]) => {
    // Prevent sending empty requests unless we have images
    if (!text.trim() && images.length === 0) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text || (images.length > 0 ? "[Imagen]" : ""),
      images: images.length > 0 ? images : undefined
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    const answer = await generateAnswer(text, images, examConfig);

    const newAiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: answer
    };

    setMessages(prev => [...prev, newAiMsg]);
    setIsLoading(false);
  };

  const renderTextWithBold = (text: string | undefined) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getContrastColor = (hexcolor: string) => {
      if (!hexcolor) return null;
      hexcolor = hexcolor.replace("#", "");
      if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(c => c + c).join('');
      const r = parseInt(hexcolor.substr(0,2),16);
      const g = parseInt(hexcolor.substr(2,2),16);
      const b = parseInt(hexcolor.substr(4,2),16);
      const yiq = ((r*299)+(g*587)+(b*114))/1000;
      return (yiq >= 128) ? 'black' : 'white';
  };

  if (authChecking) {
    return <div className={`h-screen w-screen bg-black`}></div>;
  }

  const getBackgroundColor = () => {
    if (customBg) return customBg;
    if (theme === 'light') return '#ffffff';
    return '#0a0a0a'; 
  };

  let textColorClass = '';
  const contrast = getContrastColor(customBg);

  if (customBg && contrast) {
     textColorClass = contrast === 'black' ? 'text-gray-900' : 'text-gray-100';
  } else {
     textColorClass = theme === 'light' ? 'text-gray-800' : 'text-neutral-300';
  }

  return (
    <div 
      className={`h-screen w-screen flex flex-col overflow-hidden transition-all duration-200 relative ${textColorClass}`}
      style={{ 
        opacity: opacity,
        backgroundColor: getBackgroundColor()
      }}
    >
      {!isAuthenticated ? (
        <LoginScreen onLogin={() => {}} theme={theme} />
      ) : (
        <>
          {viewMode === 'setup' ? (
            <PreExamForm onStart={handleStartExam} theme={theme} onLogout={handleLogout} />
          ) : (
            <>
              <ControlBar 
                opacity={opacity}
                setOpacity={setOpacity}
                config={examConfig}
                onReconfigure={() => setViewMode('setup')}
                theme={theme}
                setTheme={setTheme}
                onClear={() => setMessages([])}
                onLogout={handleLogout}
                customBg={customBg}
                setCustomBg={setCustomBg}
                isGhostMode={isGhostMode}
                setIsGhostMode={setIsGhostMode}
              />

              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
              >
                {messages.length === 0 && (
                  <div className={`flex flex-col items-center justify-center h-full space-y-2 select-none opacity-20`}>
                    <div className="w-8 h-px bg-current"></div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[95%] text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.role === 'user' 
                          ? 'text-right opacity-40 text-xs mb-1'
                          : 'text-left font-medium text-base'
                      }`}
                    >
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 justify-end">
                            {msg.images.map((img, idx) => (
                                 <img key={idx} src={img} alt="in" className="h-8 w-auto rounded border border-gray-700/50 opacity-60" />
                            ))}
                        </div>
                      )}
                      {renderTextWithBold(msg.text)}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-start animate-pulse">
                         <div className={`h-4 w-1 rounded bg-blue-500`}></div>
                    </div>
                )}
              </div>

              <InputArea 
                onSend={handleSend} 
                isLoading={isLoading} 
                theme={theme} 
                isGhostMode={isGhostMode} 
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;