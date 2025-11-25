
import React, { useState } from 'react';
import { Menu, X, Home, FileText, CheckCircle, Trophy, Gift, Users, Phone, HelpCircle, LogOut, LogIn, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate(AppRoute.HOME);
  }

  const menuItems = [
    { icon: Home, label: 'Home', route: AppRoute.HOME },
    { icon: FileText, label: 'Results', route: AppRoute.RESULTS },
    { icon: CheckCircle, label: 'Manual Ticket Check', route: AppRoute.TICKET_CHECK },
    { icon: Trophy, label: 'Manual Prize Check', route: AppRoute.PRIZE_CHECK },
    { icon: Gift, label: 'Manual Prize Claim', route: AppRoute.PRIZE_CLAIM },
    // Conditional Menu Item
    isAuthenticated 
      ? { icon: UserIcon, label: 'My Profile', route: AppRoute.PROFILE }
      : { icon: LogIn, label: 'Login', route: AppRoute.LOGIN },
    
    { icon: Phone, label: 'Contact', route: AppRoute.CONTACT },
    { icon: HelpCircle, label: 'Help', route: AppRoute.HELP },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setIsMenuOpen(false);
  };

  // Determine header title based on route
  const getHeaderTitle = () => {
    switch(location.pathname) {
      case AppRoute.RESULTS: return "LOTTERY RESULTS";
      case AppRoute.TICKET_CHECK: return "TICKET CHECK";
      case AppRoute.PRIZE_CHECK: return "PRIZE CHECK";
      case AppRoute.BUY_TICKET: return "BUY TICKETS";
      case AppRoute.CONTACT: return "CONTACT US";
      case AppRoute.LOGIN: return "USER LOGIN";
      case AppRoute.PROFILE: return "MY PROFILE";
      case AppRoute.MY_TICKETS: return "MY TICKETS";
      case AppRoute.HELP: return "HELP & SUPPORT";
      default: return "KERALA LOTTERY OFFICIAL";
    }
  }

  return (
    <>
      {/* Main Header */}
      <header className={`sticky top-0 z-50 ${COLORS.primaryGradient} text-white shadow-lg`}>
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={toggleMenu} className="p-1 hover:bg-white/10 rounded transition">
            <Menu className="w-8 h-8" />
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold tracking-wider leading-tight">
               {getHeaderTitle()}
            </h1>
          </div>
          
          {/* Spacer for balance, or Avatar if logged in */}
          <div className="w-8 flex items-center justify-center">
             {isAuthenticated && (
                <button onClick={() => navigate(AppRoute.PROFILE)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                    <span className="font-bold text-sm">{user?.name.charAt(0)}</span>
                </button>
             )}
          </div>
        </div>
        
        {/* Decorative circles background effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        </div>
      </header>

      {/* Side Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={toggleMenu}
          ></div>

          {/* Drawer Content */}
          <div className={`relative w-[80%] max-w-xs ${COLORS.primary} h-full shadow-2xl flex flex-col text-white transform transition-transform duration-300`}>
            <div className="p-6 flex justify-between items-start border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold">Menu</h2>
                <p className="text-xs text-white/70 mt-1">Kerala State Lotteries</p>
                {isAuthenticated && <p className="text-xs text-sky-300 font-bold mt-2">● Logged In as {user?.name}</p>}
              </div>
              <button onClick={toggleMenu}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNav(item.route)}
                  className="w-full flex items-center px-6 py-4 hover:bg-white/10 transition text-left space-x-4 border-l-4 border-transparent hover:border-white"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-white/10">
              {isAuthenticated ? (
                  <button onClick={handleLogout} className="flex items-center space-x-2 text-red-300 hover:text-red-100 transition">
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
              ) : (
                   <button onClick={() => handleNav(AppRoute.LOGIN)} className="flex items-center space-x-2 text-white/70 hover:text-white transition">
                    <LogIn className="w-5 h-5" />
                    <span>Login / Register</span>
                  </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
