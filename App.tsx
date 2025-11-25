
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import CheckForms from './components/CheckForms';
import BuyTicket from './components/BuyTicket';
import Contact from './components/Contact';
import Login from './components/Login';
import Profile from './components/Profile';
import MyTickets from './components/MyTickets';
import Help from './components/Help';
import AdminDashboard from './components/AdminDashboard';
import { AppRoute } from './types';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';

const Loading = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c4a6e]"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Header />
            
            <main className="flex-1 w-full mx-auto relative">
                {/* Decorative Background Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-5">
                   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                          <circle cx="20" cy="20" r="2" fill="#0c4a6e" />
                        </pattern>
                      </defs>
                      <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                   </svg>
                </div>

                <div className="relative z-10 py-4">
                  <Suspense fallback={<Loading />}>
                    <Routes>
                      <Route path={AppRoute.HOME} element={<Dashboard />} />
                      <Route path={AppRoute.RESULTS} element={<Results />} />
                      <Route path={AppRoute.TICKET_CHECK} element={<CheckForms type="TICKET_CHECK" />} />
                      <Route path={AppRoute.PRIZE_CHECK} element={<CheckForms type="PRIZE_CHECK" />} />
                      <Route path={AppRoute.PRIZE_CLAIM} element={<CheckForms type="PRIZE_CLAIM" />} />
                      <Route path={AppRoute.BUY_TICKET} element={<BuyTicket />} />
                      <Route path={AppRoute.CONTACT} element={<Contact />} />
                      <Route path={AppRoute.LOGIN} element={<Login />} />
                      <Route path={AppRoute.PROFILE} element={<Profile />} />
                      <Route path={AppRoute.MY_TICKETS} element={<MyTickets />} />
                      <Route path={AppRoute.HELP} element={<Help />} />
                      <Route path={AppRoute.ADMIN} element={<AdminDashboard />} />
                    </Routes>
                  </Suspense>
                </div>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;
