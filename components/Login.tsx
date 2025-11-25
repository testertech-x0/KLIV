
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { Lock, Phone, ArrowRight, User as UserIcon, ArrowLeft, CheckCircle, Mail } from 'lucide-react';

type ViewState = 'LOGIN' | 'REGISTER' | 'FORGOT';

const Login: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  
  // Form States
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(phone, name); // name is undefined here for login
      setIsLoading(false);
      
      if (success) {
          if (phone === 'admin') {
              navigate(AppRoute.ADMIN);
          } else {
              navigate(AppRoute.HOME);
          }
      } else {
          alert('Login Failed');
      }
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        login(phone, name);
        setIsLoading(false);
        navigate(AppRoute.HOME);
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setResetSent(true);
    }, 1500);
  };

  // Render Helpers
  const renderHeader = (title: string, subtitle: string, icon: React.ElementType) => (
    <div className={`${COLORS.primaryGradient} p-8 text-center text-white relative`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        
        {view !== 'LOGIN' && (
            <button 
                onClick={() => { setView('LOGIN'); setResetSent(false); }}
                className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition z-20"
            >
                <ArrowLeft className="w-5 h-5 text-white" />
            </button>
        )}

        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm shadow-inner">
            {React.createElement(icon, { className: "w-10 h-10 text-white" })}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-white/80 text-sm mt-1">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* LOGIN VIEW */}
        {view === 'LOGIN' && (
            <>
                {renderHeader("Welcome Back", "Login to access your tickets", Lock)}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                    placeholder="Enter 10 digit number"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button type="button" onClick={() => setView('FORGOT')} className="text-xs text-[#0c4a6e] font-bold hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${COLORS.primaryGradient} text-white py-3.5 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform disabled:opacity-70`}
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <>
                                    <span>LOGIN</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <button onClick={() => setView('REGISTER')} className="text-[#0c4a6e] font-bold hover:underline">
                                Register Now
                            </button>
                        </p>
                    </div>
                </div>
            </>
        )}

        {/* REGISTER VIEW */}
        {view === 'REGISTER' && (
            <>
                {renderHeader("Create Account", "Join us to buy & check tickets", UserIcon)}
                <div className="p-8">
                    <form onSubmit={handleRegister} className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                    placeholder="Enter 10 digit number"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CheckCircle className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${COLORS.secondaryGradient} text-white py-3.5 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform disabled:opacity-70 mt-4`}
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <>
                                    <span>CREATE ACCOUNT</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <button onClick={() => setView('LOGIN')} className="text-[#0c4a6e] font-bold hover:underline">
                                Login Here
                            </button>
                        </p>
                    </div>
                </div>
            </>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {view === 'FORGOT' && (
            <>
                {renderHeader("Forgot Password", "Recover your account access", Mail)}
                <div className="p-8">
                    {!resetSent ? (
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <p className="text-slate-600 text-sm">
                                Enter your registered mobile number. We will send you an OTP to reset your password.
                            </p>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none transition bg-slate-50"
                                        placeholder="Enter registered number"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full ${COLORS.primaryGradient} text-white py-3.5 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform disabled:opacity-70`}
                            >
                                {isLoading ? (
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    <>
                                        <span>SEND OTP</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">OTP Sent!</h3>
                            <p className="text-slate-500 text-sm mt-2 mb-6">
                                A password reset link has been sent to <br/><span className="font-bold text-slate-700">{phone}</span>
                            </p>
                            <button 
                                onClick={() => { setView('LOGIN'); setResetSent(false); }}
                                className="text-[#0c4a6e] font-bold hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {!resetSent && (
                        <div className="mt-8 text-center">
                            <button onClick={() => setView('LOGIN')} className="text-slate-500 font-medium hover:text-[#0c4a6e] text-sm flex items-center justify-center mx-auto space-x-1">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Login</span>
                            </button>
                        </div>
                    )}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default Login;
