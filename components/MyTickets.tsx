import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, QrCode, Trophy, AlertCircle, Share2, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { COLORS, PRIZE_STRUCTURES } from '../constants';
import { PurchasedTicket, PrizeStructure } from '../types';

const TicketCard: React.FC<{ ticket: PurchasedTicket; onClick: () => void }> = ({ ticket, onClick }) => {
  const getStatusStyle = () => {
    switch(ticket.status) {
      case 'won': return 'bg-amber-50 border-amber-200 ring-1 ring-amber-300';
      case 'upcoming': return 'bg-white border-slate-200 hover:border-[#0c4a6e]';
      default: return 'bg-slate-50 border-slate-200 grayscale opacity-80';
    }
  };

  return (
    <div 
        onClick={onClick}
        className={`relative rounded-2xl border shadow-sm overflow-hidden mb-4 transition-transform active:scale-[0.98] cursor-pointer ${getStatusStyle()}`}
    >
       {/* Status Banner for Winner */}
       {ticket.status === 'won' && (
           <div className="bg-amber-400 text-amber-900 text-xs font-bold text-center py-1 flex items-center justify-center space-x-1">
               <Trophy className="w-3 h-3" />
               <span>CONGRATULATIONS! YOU WON {ticket.prizeRank}</span>
           </div>
       )}

       <div className="flex">
          {/* Main Ticket Area */}
          <div className="flex-1 p-4 relative">
             <div className="flex justify-between items-start mb-3">
                 <div>
                     <h3 className="text-[#0c4a6e] font-bold text-sm uppercase leading-tight">{ticket.lotteryName}</h3>
                     <p className="text-slate-500 text-xs">{ticket.drawCode} • No: {ticket.drawNumber}</p>
                 </div>
                 {ticket.status === 'won' && (
                     <div className="text-right">
                         <p className="text-xs font-bold text-slate-500">Prize Amount</p>
                         <p className="text-lg font-bold text-emerald-600">{ticket.prizeAmount}</p>
                     </div>
                 )}
             </div>

             <div className="flex items-center space-x-3 mb-2">
                 <div className="bg-slate-100 px-3 py-1 rounded text-slate-600 font-bold font-mono text-sm border">
                     {ticket.series}
                 </div>
                 <div className="flex-1 text-center bg-slate-50 py-1 rounded border border-dashed border-slate-300">
                     <span className="text-2xl font-mono font-bold tracking-widest text-slate-800">{ticket.number}</span>
                 </div>
             </div>
             
             <div className="flex items-center text-xs text-slate-500 mt-3 space-x-4">
                 <div className="flex items-center space-x-1">
                     <Calendar className="w-3 h-3" />
                     <span>Draw: {ticket.drawDate}</span>
                 </div>
                 {ticket.status === 'upcoming' && <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">Wait for Results</span>}
             </div>
          </div>

          {/* Perforated Line */}
          <div className="w-4 relative flex flex-col items-center justify-center border-l-2 border-dashed border-slate-200 my-2">
              <div className="absolute -top-3 w-6 h-6 bg-slate-50 rounded-full border-b border-slate-200"></div>
              <div className="absolute -bottom-3 w-6 h-6 bg-slate-50 rounded-full border-t border-slate-200"></div>
          </div>

          {/* QR Area */}
          <div className="w-20 bg-slate-50 flex flex-col items-center justify-center border-l border-slate-100 p-2">
               <QrCode className="w-10 h-10 text-slate-400 opacity-50" />
               <p className="text-[10px] text-slate-400 mt-1 text-center uppercase">Details</p>
          </div>
       </div>
    </div>
  );
};

const TicketDetailView: React.FC<{ ticket: PurchasedTicket; onBack: () => void }> = ({ ticket, onBack }) => {
    // Determine the prize structure for this ticket's lottery
    const prizeStructure = PRIZE_STRUCTURES[ticket.drawCode] || [];
    const hasStructure = prizeStructure.length > 0;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 animate-fade-in relative">
             {/* Header */}
            <div className={`sticky top-[72px] z-40 bg-white border-b border-slate-100 shadow-sm`}>
                <div className="p-4 flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <h2 className="font-bold text-lg text-[#0c4a6e] leading-tight">Ticket Details</h2>
                        <p className="text-xs text-slate-500">ID: {ticket.id}</p>
                    </div>
                    <div className="flex space-x-2">
                         <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Share2 className="w-5 h-5" /></button>
                         <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Download className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto space-y-6">
                
                {/* Visual Status Header */}
                <div className={`rounded-2xl p-6 text-center border shadow-lg overflow-hidden relative ${
                    ticket.status === 'won' ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' :
                    ticket.status === 'lost' ? 'bg-slate-200 text-slate-600' :
                    'bg-gradient-to-br from-[#0c4a6e] to-[#0284c7] text-white'
                }`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                         </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                            {ticket.status === 'won' && <Trophy className="w-8 h-8 text-white" />}
                            {ticket.status === 'lost' && <XCircle className="w-8 h-8 text-slate-500" />}
                            {ticket.status === 'upcoming' && <Clock className="w-8 h-8 text-white" />}
                        </div>
                        
                        <h3 className="text-2xl font-bold uppercase tracking-wide">
                            {ticket.status === 'won' ? 'Winner!' : ticket.status === 'lost' ? 'Better Luck Next Time' : 'Draw Upcoming'}
                        </h3>
                        
                        {ticket.status === 'won' && (
                            <p className="text-amber-100 font-medium mt-1">You won the {ticket.prizeRank}</p>
                        )}
                        {ticket.status === 'upcoming' && (
                            <p className="text-sky-100 font-medium mt-1">Results will be announced on {ticket.drawDate}</p>
                        )}
                    </div>
                </div>

                {/* Digital Ticket Representation */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                        <div>
                             <p className="text-xs text-slate-400 uppercase font-bold">Lottery Name</p>
                             <p className="font-bold text-[#0c4a6e] text-lg">{ticket.lotteryName}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-slate-400 uppercase font-bold">Draw Code</p>
                             <p className="font-bold text-slate-700">{ticket.drawCode}</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center py-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                         <span className="text-2xl font-bold text-slate-400 mr-2">{ticket.series}</span>
                         <span className="text-4xl font-mono font-bold text-slate-800 tracking-widest">{ticket.number}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-bold">Purchase Date</p>
                            <p className="text-slate-700 font-medium">{ticket.purchaseDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs uppercase font-bold">Draw Date</p>
                            <p className="text-slate-700 font-medium">{ticket.drawDate}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="mt-8 flex flex-col items-center">
                        <div className="bg-white p-2 rounded-lg shadow-inner border border-slate-200">
                             <QrCode className="w-32 h-32 text-slate-800" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Scan at any lottery stall to verify</p>
                    </div>
                </div>

                {/* Prize Structure Table (Only if results published) */}
                {hasStructure && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-700">Prize Structure</h3>
                            <p className="text-xs text-slate-500">Official Results for {ticket.drawCode}</p>
                        </div>
                        <div>
                            {prizeStructure.map((prize, idx) => {
                                // Check if this prize tier matches the user's winning tier
                                const isWonRank = ticket.status === 'won' && ticket.prizeRank === prize.rank;
                                
                                return (
                                    <div 
                                        key={idx} 
                                        className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-0 transition-colors ${
                                            isWonRank ? 'bg-amber-50' : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {isWonRank && <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                                            <div>
                                                <p className={`text-sm font-bold ${isWonRank ? 'text-amber-800' : 'text-slate-700'}`}>
                                                    {prize.rank}
                                                </p>
                                                <p className="text-xs text-slate-400">{prize.winners.length} Winners</p>
                                            </div>
                                        </div>
                                        <span className={`font-mono font-bold ${isWonRank ? 'text-amber-700' : 'text-[#0c4a6e]'}`}>
                                            {prize.amount}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MyTickets: React.FC = () => {
  const navigate = useNavigate();
  const { tickets } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket | null>(null);

  const activeTickets = tickets.filter(t => t.status === 'upcoming');
  const pastTickets = tickets.filter(t => t.status !== 'upcoming');
  
  const displayTickets = activeTab === 'active' ? activeTickets : pastTickets;

  // Handle Detail View
  if (selectedTicket) {
      return <TicketDetailView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-fade-in">
        {/* Header */}
        <div className={`sticky top-[72px] z-40 ${COLORS.primary} text-white pb-6 pt-2 px-4 shadow-md rounded-b-3xl`}>
             <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-white/80 hover:text-white mb-4">
                 <ArrowLeft className="w-5 h-5" />
                 <span>Back to Profile</span>
             </button>
             <h2 className="text-2xl font-bold">My Tickets</h2>
             <p className="text-white/70 text-sm">Manage your purchased lottery tickets</p>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-6">
            <div className="bg-white p-1 rounded-xl shadow-sm flex">
                <button 
                   onClick={() => setActiveTab('active')}
                   className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${activeTab === 'active' ? 'bg-[#0c4a6e] text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Active Tickets ({activeTickets.length})
                </button>
                <button 
                   onClick={() => setActiveTab('history')}
                   className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${activeTab === 'history' ? 'bg-[#0c4a6e] text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    History ({pastTickets.length})
                </button>
            </div>
        </div>

        {/* Ticket List */}
        <div className="px-4 mt-6">
            {displayTickets.length > 0 ? (
                displayTickets.map(ticket => (
                    <TicketCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        onClick={() => setSelectedTicket(ticket)}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-800 font-bold">No tickets found</p>
                    <p className="text-slate-500 text-sm mt-1">You haven't purchased any tickets in this category yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MyTickets;