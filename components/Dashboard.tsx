
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Trophy, Gift, User, HelpCircle, ShoppingCart, LogIn } from 'lucide-react';
import { AppRoute } from '../types';
import { useAuth } from '../AuthContext';

interface DashboardItemProps {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  onClick: () => void;
}

const DashboardItem: React.FC<DashboardItemProps> = ({ icon: Icon, label, colorClass, onClick }) => (
  <div className="flex flex-col items-center justify-center group cursor-pointer" onClick={onClick}>
    <div className={`${colorClass} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md flex items-center justify-center text-white mb-3 transition-transform transform group-hover:scale-105 group-active:scale-95`}>
      <Icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
    </div>
    <span className="text-sm font-medium text-slate-700 text-center leading-tight">{label}</span>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Cohesive "Cold" Color Palette
  const items = [
    { label: 'Results', icon: FileText, color: 'bg-sky-600', route: AppRoute.RESULTS },
    { label: 'Ticket Check', icon: CheckCircle, color: 'bg-emerald-600', route: AppRoute.TICKET_CHECK },
    { label: 'Prize Check', icon: Trophy, color: 'bg-indigo-600', route: AppRoute.PRIZE_CHECK },
    { label: 'Buy Ticket', icon: ShoppingCart, color: 'bg-amber-500', route: AppRoute.BUY_TICKET },
    { label: 'Prize Claim', icon: Gift, color: 'bg-teal-700', route: AppRoute.PRIZE_CLAIM },
    // Conditional Login/Profile Item
    isAuthenticated 
      ? { label: 'My Profile', icon: User, color: 'bg-blue-800', route: AppRoute.PROFILE }
      : { label: 'Login', icon: LogIn, color: 'bg-blue-800', route: AppRoute.LOGIN },
      
    { label: 'Help', icon: HelpCircle, color: 'bg-slate-600', route: AppRoute.HELP },
  ];

  return (
    <div className="flex flex-col items-center p-6 w-full max-w-4xl mx-auto animate-fade-in">
      
      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-8 w-full mt-4">
        {items.map((item, idx) => (
          <DashboardItem
            key={idx}
            label={item.label}
            icon={item.icon}
            colorClass={`bg-gradient-to-br from-${item.color.replace('bg-', '')} to-${item.color.replace('bg-', '')}/80`}
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>

      {/* Information Card */}
      <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full">
        <h3 className="text-[#0c4a6e] font-bold text-lg mb-2">ABOUT US</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Kerala Lottery Official is a mobile application initiative undertaken by the Department of State Lotteries, Government of Kerala towards providing a digital platform for ticket buyers to check the validity of purchased paper lottery tickets and to verify if a ticket is prize-winning.
        </p>
      </div>

      {/* Today's Highlight (Mock Ad) */}
      <div className="mt-6 w-full h-40 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-between p-6 text-white overflow-hidden relative">
          <div className="z-10">
              <h4 className="font-bold text-2xl">Karunya Plus</h4>
              <p className="text-sm opacity-90 mb-2">Win upto ₹80 Lakhs!</p>
              <button onClick={() => navigate(AppRoute.BUY_TICKET)} className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-amber-400">
                  BUY NOW
              </button>
          </div>
          <Trophy className="w-24 h-24 absolute -right-4 -bottom-4 text-white/20 rotate-12" />
      </div>
    </div>
  );
};

export default Dashboard;
