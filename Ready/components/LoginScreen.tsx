import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

interface LoginScreenProps {
  onLogin: () => void;
  theme: ThemeMode;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(''); // General message (error or success)
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLight = theme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(true);
      setMessage('FALTAN DATOS');
      return;
    }

    setIsLoading(true);
    setError(false);
    setIsSuccess(false);
    setMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); 
    } catch (err: any) {
      console.error("Auth failed", err);
      setError(true);
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setMessage('CREDENCIALES INVÁLIDAS');
      } else if (err.code === 'auth/missing-password') {
        setMessage('FALTA CONTRASEÑA');
      } else if (err.code === 'auth/too-many-requests') {
        setMessage('DEMASIADOS INTENTOS');
      } else if (err.code === 'auth/user-disabled') {
        setMessage('CUENTA DESHABILITADA');
      } else {
        setMessage('ERROR DE CONEXIÓN');
      }
      
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError(true);
      setMessage('INGRESA TU EMAIL PRIMERO');
      return;
    }

    setIsLoading(true);
    setError(false);
    setIsSuccess(false);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      setMessage('ENVIADO (REVISA SPAM)');
    } catch (err: any) {
      setError(true);
      if (err.code === 'auth/user-not-found') {
        setMessage('EMAIL NO REGISTRADO');
      } else if (err.code === 'auth/invalid-email') {
        setMessage('EMAIL INVÁLIDO');
      } else {
        setMessage('ERROR AL ENVIAR');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerClass = isLight ? 'bg-white text-gray-800' : 'bg-neutral-950 text-neutral-300';
  const inputClass = `w-full bg-transparent border-b p-2 text-sm focus:outline-none transition-colors ${
    isLight 
      ? 'border-gray-300 focus:border-blue-500 placeholder-gray-400 text-gray-900' 
      : 'border-neutral-800 focus:border-neutral-500 placeholder-neutral-700 text-neutral-200'
  } ${error ? 'border-red-500 text-red-500 placeholder-red-400' : ''} ${isSuccess ? 'border-green-500 text-green-500' : ''}`;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${containerClass}`}>
      <div className="w-full max-w-xs">
        <div className="mb-8 text-center opacity-50 flex justify-center">
           {isLoading ? (
             <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${isLight ? 'border-gray-800' : 'border-neutral-400'}`}></div>
           ) : (
             <div className={`w-2 h-2 rounded-full ${isLight ? 'bg-gray-300' : 'bg-neutral-800'}`}></div>
           )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if(error || isSuccess) { setError(false); setIsSuccess(false); setMessage(''); }
              }}
              placeholder="EMAIL"
              className={inputClass}
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if(error || isSuccess) { setError(false); setIsSuccess(false); setMessage(''); }
              }}
              placeholder="PASSWORD"
              className={inputClass}
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-[10px] font-bold tracking-[0.2em] uppercase rounded transition-all duration-300 ${
                (error || isSuccess) && message
                  ? (isSuccess ? 'bg-green-500/10 text-green-500 cursor-default' : 'bg-red-500/10 text-red-500 cursor-default')
                  : isLoading
                      ? 'opacity-50 cursor-wait ' + (isLight ? 'bg-gray-200 text-gray-500' : 'bg-neutral-900 text-neutral-600')
                      : isLight 
                          ? 'bg-gray-900 text-white hover:bg-gray-700' 
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              {(error || isSuccess) && message ? message : isLoading ? 'PROCESANDO...' : 'ENTRAR'}
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-3">
          <button 
              type="button"
              onClick={handleResetPassword}
              disabled={isLoading}
              className={`text-[9px] uppercase tracking-widest hover:underline transition-colors ${
              isLight ? 'text-gray-400 hover:text-gray-600' : 'text-neutral-600 hover:text-neutral-400'
              }`}
          >
              Olvidé mi contraseña
          </button>
        </div>
      </div>
    </div>
  );
};