
import React, { useState, useRef, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { Ticket, Bell, Shield, HelpCircle, LogOut, ChevronRight, Edit2, ArrowLeft, Camera, Mail, Phone, Lock, Save, PlusCircle } from 'lucide-react';
import { AppRoute } from '../types';

type ProfileView = 'MAIN' | 'EDIT' | 'NOTIFICATIONS' | 'SECURITY';

const Profile: React.FC = () => {
  const { user, tickets, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ProfileView>('MAIN');

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    if (!user) return { tickets: 0, winnings: 0, wallet: 0 };

    const totalTickets = tickets.length;
    
    // Sum up winnings (Parse string like "₹1,00,00,000" to number)
    const totalWinnings = tickets.reduce((acc, t) => {
        if (t.status === 'won' && t.prizeAmount) {
            // Remove non-numeric characters except for decimal point if any (though prizes usually integers here)
            const numericValue = parseInt(t.prizeAmount.replace(/[^0-9]/g, ''), 10);
            return acc + (isNaN(numericValue) ? 0 : numericValue);
        }
        return acc;
    }, 0);

    return {
        tickets: totalTickets,
        winnings: totalWinnings,
        wallet: user.walletBalance
    };
  }, [user, tickets]);

  const formatCurrency = (val: number) => {
      return '₹' + val.toLocaleString('en-IN');
  };

  // --- HANDLERS ---
  const handleLogout = () => {
    logout();
    navigate(AppRoute.HOME);
  };

  if (!user) return null;

  // --- SUB-VIEWS ---

  // 1. EDIT PROFILE VIEW
  const EditProfileView = () => {
      const [name, setName] = useState(user.name);
      const [email, setEmail] = useState(user.email);
      const [previewImage, setPreviewImage] = useState<string | undefined>(user.profileImage);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const [isSaving, setIsSaving] = useState(false);

      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  setPreviewImage(reader.result as string);
              };
              reader.readAsDataURL(file);
          }
      };

      const handleSave = () => {
          setIsSaving(true);
          // Simulate API delay
          setTimeout(() => {
              updateProfile({ name, email, profileImage: previewImage });
              setIsSaving(false);
              setCurrentView('MAIN');
          }, 800);
      };

      return (
          <div className="animate-fade-in bg-slate-50 min-h-screen">
              {/* Header */}
              <div className={`${COLORS.primary} text-white p-4 pt-4 sticky top-0 z-10 shadow-md`}>
                  <div className="flex items-center space-x-4">
                      <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-white/20 rounded-full transition">
                          <ArrowLeft className="w-6 h-6" />
                      </button>
                      <h2 className="text-xl font-bold">Edit Profile</h2>
                  </div>
              </div>

              <div className="p-6 max-w-lg mx-auto pb-20">
                  {/* Image Upload */}
                  <div className="flex justify-center mb-8">
                      <div className="relative">
                          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                              {previewImage ? (
                                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                                      {name.charAt(0)}
                                  </div>
                              )}
                          </div>
                          <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="absolute bottom-0 right-0 bg-[#0c4a6e] text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-sky-700 transition"
                          >
                              <Camera className="w-5 h-5" />
                          </button>
                          <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageChange}
                          />
                      </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                          <div className="relative">
                             <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none shadow-sm"
                             />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                 <Edit2 className="w-5 h-5" />
                             </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email Address</label>
                          <div className="relative">
                             <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none shadow-sm"
                             />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                 <Mail className="w-5 h-5" />
                             </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Phone Number</label>
                          <div className="relative opacity-60">
                             <input 
                                type="tel" 
                                value={user.phone}
                                readOnly
                                className="w-full p-4 pl-12 rounded-xl border border-slate-200 bg-slate-100 outline-none cursor-not-allowed"
                             />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                 <Phone className="w-5 h-5" />
                             </div>
                             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">READ ONLY</span>
                          </div>
                      </div>

                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full ${COLORS.primaryGradient} text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition mt-4`}
                      >
                          {isSaving ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : (
                              <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                              </>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  // 2. NOTIFICATIONS VIEW
  const NotificationsView = () => {
      const [settings, setSettings] = useState({
          push: true,
          email: false,
          promo: true,
          draw: true
      });

      const toggle = (key: keyof typeof settings) => {
          setSettings(prev => ({...prev, [key]: !prev[key]}));
      };

      const notifications = [
          { id: 1, title: 'Results Announced!', body: 'Draw BT-30 results are now available. Check if you won!', time: '2 hrs ago', unread: true },
          { id: 2, title: 'New Bumper Lottery', body: 'The Pooja Bumper is now live. Buy your tickets today.', time: '1 day ago', unread: false },
          { id: 3, title: 'Purchase Successful', body: 'You successfully purchased 3 tickets for Karunya Plus.', time: '3 days ago', unread: false },
      ];

      return (
        <div className="animate-fade-in bg-slate-50 min-h-screen">
             <div className={`${COLORS.primary} text-white p-4 pt-4 sticky top-0 z-10 shadow-md`}>
                  <div className="flex items-center space-x-4">
                      <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-white/20 rounded-full transition">
                          <ArrowLeft className="w-6 h-6" />
                      </button>
                      <h2 className="text-xl font-bold">Notifications</h2>
                  </div>
              </div>
              
              <div className="p-6 pb-20">
                  <h3 className="text-slate-800 font-bold mb-4">Settings</h3>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                      {Object.entries(settings).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
                              <span className="capitalize font-medium text-slate-700">
                                  {key === 'push' ? 'Push Notifications' : key === 'promo' ? 'Promotions & Offers' : key === 'draw' ? 'Draw Alerts' : 'Email Alerts'}
                              </span>
                              <button 
                                onClick={() => toggle(key as keyof typeof settings)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${val ? 'bg-emerald-500' : 'bg-slate-300'}`}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${val ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </button>
                          </div>
                      ))}
                  </div>

                  <h3 className="text-slate-800 font-bold mb-4 flex items-center justify-between">
                      <span>Recent Alerts</span>
                      <button className="text-xs text-[#0c4a6e] font-bold">Mark all read</button>
                  </h3>
                  <div className="space-y-3">
                      {notifications.map(n => (
                          <div key={n.id} className={`p-4 rounded-xl border ${n.unread ? 'bg-white border-l-4 border-l-[#0c4a6e] shadow-sm' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                              <div className="flex justify-between items-start mb-1">
                                  <h4 className={`font-bold text-sm ${n.unread ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h4>
                                  <span className="text-[10px] text-slate-400">{n.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{n.body}</p>
                          </div>
                      ))}
                  </div>
              </div>
        </div>
      );
  };

  // 3. SECURITY VIEW
  const SecurityView = () => {
      const [currentPass, setCurrentPass] = useState('');
      const [newPass, setNewPass] = useState('');
      const [confirmPass, setConfirmPass] = useState('');
      const [msg, setMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

      const handleChangePassword = () => {
          setMsg(null);
          if (!currentPass || !newPass || !confirmPass) {
              setMsg({ type: 'error', text: 'All fields are required.' });
              return;
          }
          if (newPass !== confirmPass) {
              setMsg({ type: 'error', text: 'New passwords do not match.' });
              return;
          }
          if (newPass.length < 6) {
              setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
              return;
          }

          // Mock Success
          setTimeout(() => {
              setMsg({ type: 'success', text: 'Password updated successfully!' });
              setCurrentPass('');
              setNewPass('');
              setConfirmPass('');
          }, 500);
      };

      return (
        <div className="animate-fade-in bg-slate-50 min-h-screen">
             <div className={`${COLORS.primary} text-white p-4 pt-4 sticky top-0 z-10 shadow-md`}>
                  <div className="flex items-center space-x-4">
                      <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-white/20 rounded-full transition">
                          <ArrowLeft className="w-6 h-6" />
                      </button>
                      <h2 className="text-xl font-bold">Security</h2>
                  </div>
              </div>

              <div className="p-6 pb-20">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                      <div className="flex items-center space-x-4 mb-6">
                          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                              <Lock className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-800">Change Password</h3>
                              <p className="text-xs text-slate-500">Update your account password</p>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <input 
                              type="password" 
                              placeholder="Current Password"
                              value={currentPass}
                              onChange={(e) => setCurrentPass(e.target.value)}
                              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0c4a6e] outline-none"
                          />
                           <input 
                              type="password" 
                              placeholder="New Password"
                              value={newPass}
                              onChange={(e) => setNewPass(e.target.value)}
                              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0c4a6e] outline-none"
                          />
                           <input 
                              type="password" 
                              placeholder="Confirm New Password"
                              value={confirmPass}
                              onChange={(e) => setConfirmPass(e.target.value)}
                              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0c4a6e] outline-none"
                          />
                          
                          {msg && (
                              <div className={`p-3 rounded-lg text-xs font-bold ${msg.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                  {msg.text}
                              </div>
                          )}

                          <button 
                            onClick={handleChangePassword}
                            className={`w-full ${COLORS.primaryGradient} text-white py-3 rounded-lg font-bold shadow-sm active:scale-95 transition`}
                          >
                              Update Password
                          </button>
                      </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-700">Two-Factor Authentication</span>
                       <div className="bg-slate-200 w-12 h-6 rounded-full p-1 cursor-not-allowed">
                           <div className="bg-white w-4 h-4 rounded-full shadow-sm"></div>
                       </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 px-1">2FA is currently disabled for this region.</p>
              </div>
        </div>
      );
  };

  // --- MAIN RENDER ---

  if (currentView === 'EDIT') return <EditProfileView />;
  if (currentView === 'NOTIFICATIONS') return <NotificationsView />;
  if (currentView === 'SECURITY') return <SecurityView />;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Profile Header */}
      <div className={`${COLORS.primary} pt-8 pb-16 px-6 rounded-b-[2.5rem] shadow-lg text-white relative`}>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center text-2xl font-bold overflow-hidden">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        user.name.charAt(0)
                    )}
                </div>
            </div>
            
            <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="opacity-80 font-medium">{user.phone}</p>
                <button 
                   onClick={() => setCurrentView('EDIT')}
                   className="flex items-center space-x-1 text-xs bg-white/20 px-3 py-1 rounded-full mt-2 hover:bg-white/30 transition"
                >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-8 flex space-x-4 overflow-x-auto no-scrollbar pb-2">
          <div className="min-w-[140px] bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-500 text-xs font-bold uppercase">Total Tickets</p>
              <div className="flex items-center justify-between mt-2">
                 <p className="text-2xl font-bold text-[#0c4a6e]">{stats.tickets}</p>
                 <Ticket className="w-5 h-5 text-slate-300" />
              </div>
          </div>
          <div className="min-w-[140px] bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
              <p className="text-slate-500 text-xs font-bold uppercase">Winnings</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(stats.winnings)}</p>
          </div>
          <div className="min-w-[140px] bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                   <p className="text-slate-500 text-xs font-bold uppercase">Wallet</p>
                   {/* Mock Add Funds Button */}
                   <button className="text-sky-600 hover:text-sky-700">
                       <PlusCircle className="w-4 h-4" />
                   </button>
              </div>
              <p className="text-2xl font-bold text-sky-600 mt-2">{formatCurrency(stats.wallet)}</p>
          </div>
      </div>

      {/* Menu Options */}
      <div className="p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">Account Settings</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* My Tickets (Route) */}
            <button 
                onClick={() => navigate(AppRoute.MY_TICKETS)}
                className="w-full flex items-center p-4 hover:bg-slate-50 transition border-b border-slate-100"
            >
                <div className={`w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-4`}>
                    <Ticket className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-bold text-slate-800">My Tickets</p>
                    <p className="text-xs text-slate-500">View purchased tickets</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>

            {/* Notifications (Sub View) */}
            <button 
                onClick={() => setCurrentView('NOTIFICATIONS')}
                className="w-full flex items-center p-4 hover:bg-slate-50 transition border-b border-slate-100"
            >
                <div className={`w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4`}>
                    <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-bold text-slate-800">Notifications</p>
                    <p className="text-xs text-slate-500">Alerts & announcements</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>

            {/* Security (Sub View) */}
            <button 
                onClick={() => setCurrentView('SECURITY')}
                className="w-full flex items-center p-4 hover:bg-slate-50 transition border-b border-slate-100"
            >
                <div className={`w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4`}>
                    <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-bold text-slate-800">Security</p>
                    <p className="text-xs text-slate-500">Password & privacy</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>

             {/* Help (Route to Help Page) */}
             <button 
                onClick={() => navigate(AppRoute.HELP)}
                className="w-full flex items-center p-4 hover:bg-slate-50 transition"
            >
                <div className={`w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4`}>
                    <HelpCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-bold text-slate-800">Help & Support</p>
                    <p className="text-xs text-slate-500">FAQs and contact</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 border border-red-100 hover:bg-red-100 transition active:scale-95"
          >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">App Version 1.0.3</p>
      </div>
    </div>
  );
};

export default Profile;
