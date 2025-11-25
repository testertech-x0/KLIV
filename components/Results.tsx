
import React, { useState, useMemo } from 'react';
import { Download, Share2, Youtube, ArrowLeft, Search, ChevronDown, ChevronUp, AlertCircle, FileText, Filter } from 'lucide-react';
import { COLORS } from '../constants';
import { LotteryDraw, PrizeStructure } from '../types';
import { useData } from '../DataContext';

const Results: React.FC = () => {
  const { draws, prizeStructures } = useData();
  const [selectedDraw, setSelectedDraw] = useState<LotteryDraw | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'LATEST' | 'OLD'>('ALL');

  // Logic to sort and filter draws
  const displayedDraws = useMemo(() => {
    // 1. Sort by Date Descending (Newest first)
    const sortedDraws = [...draws].sort((a, b) => 
        new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()
    );

    const completedDraws = sortedDraws.filter(d => d.status === 'completed');

    switch (filter) {
        case 'LATEST':
            return completedDraws.length > 0 ? [completedDraws[0]] : [];
        case 'OLD':
            return completedDraws.length > 1 ? completedDraws.slice(1) : [];
        case 'ALL':
        default:
            return sortedDraws;
    }
  }, [filter, draws]);

  if (selectedDraw) {
    return <DrawDetail draw={selectedDraw} prizeStructures={prizeStructures} onBack={() => setSelectedDraw(null)} />;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto w-full animate-fade-in pb-24">
      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all border ${
                filter === 'ALL' 
                ? `${COLORS.secondary} text-white border-transparent shadow-md transform scale-105` 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
            All Results
        </button>
        <button 
            onClick={() => setFilter('LATEST')}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all border ${
                filter === 'LATEST' 
                ? `${COLORS.secondary} text-white border-transparent shadow-md transform scale-105` 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
            Latest
        </button>
        <button 
            onClick={() => setFilter('OLD')}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all border ${
                filter === 'OLD' 
                ? `${COLORS.secondary} text-white border-transparent shadow-md transform scale-105` 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
            Old Results
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {displayedDraws.length > 0 ? (
            displayedDraws.map((draw) => (
            <div key={draw.id} onClick={() => setSelectedDraw(draw)} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all hover:shadow-md group">
                {/* Card Content */}
                <div className="flex justify-between items-start z-10">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-[#0c4a6e] font-bold text-lg uppercase group-hover:underline">{draw.name}</h3>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">{draw.code}</span>
                        </div>
                        <p className={`text-xs font-bold mt-1 uppercase tracking-wide ${draw.status === 'upcoming' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {draw.status === 'upcoming' ? '● Upcoming Draw' : '● Results Published'}
                        </p>
                        <p className="text-slate-500 text-sm mt-2 flex items-center">
                            <span className="opacity-70">Draw Date:</span> 
                            <span className="ml-1 font-medium">{draw.drawDate}</span>
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between h-full space-y-4">
                        <span className="text-xs font-bold text-slate-400">#{draw.drawNumber}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0c4a6e] group-hover:text-white transition">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                    <div className="w-32 h-32 bg-[#0c4a6e] rounded-full blur-2xl"></div>
                </div>
            </div>
            ))
        ) : (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-800 font-bold">No results found</h3>
                <p className="text-slate-500 text-sm mt-1">Try changing the filter category.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const PrizeGroup: React.FC<{ prize: PrizeStructure }> = ({ prize }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = prize.winners.length > 12;
    const displayWinners = isExpanded || !shouldTruncate ? prize.winners : prize.winners.slice(0, 12);

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-4">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-slate-800 text-sm">{prize.rank}</h4>
                    <p className="text-xs text-slate-500">Prize Amount: <span className="font-bold text-[#0c4a6e]">{prize.amount}</span></p>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border">
                    {prize.winners.length} Winners
                </div>
            </div>
            
            <div className="p-4">
                <div className="flex flex-wrap gap-2">
                    {displayWinners.map((w, i) => (
                        <span key={i} className={`font-mono text-sm px-2 py-1 rounded border ${
                            prize.rank.includes('1st') 
                            ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold' 
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}>
                            {w}
                        </span>
                    ))}
                    {shouldTruncate && !isExpanded && (
                         <span className="font-mono text-sm px-2 py-1 text-slate-400">...</span>
                    )}
                </div>
                
                {shouldTruncate && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full mt-3 text-xs font-bold text-sky-600 flex items-center justify-center space-x-1 hover:bg-sky-50 py-2 rounded transition"
                    >
                        {isExpanded ? (
                            <><span>Show Less</span><ChevronUp className="w-3 h-3" /></>
                        ) : (
                            <><span>Show All {prize.winners.length} Winners</span><ChevronDown className="w-3 h-3" /></>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

const DrawDetail: React.FC<{ draw: LotteryDraw; prizeStructures: any; onBack: () => void }> = ({ draw, prizeStructures, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch specific prize structure based on code
  const prizeStructure = prizeStructures[draw.code] || [];
  const isPending = prizeStructure.length === 0;

  // Search Logic
  const filteredStructure = searchTerm 
    ? prizeStructure.map((p: any) => ({
        ...p,
        winners: p.winners.filter((w: string) => w.includes(searchTerm))
      })).filter((p: any) => p.winners.length > 0)
    : prizeStructure;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 animate-fade-in relative z-50">
      {/* Detail Header */}
      <div className="sticky top-[72px] bg-white z-40 shadow-sm">
          <div className="p-4 flex items-center space-x-4 border-b border-slate-100">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex-1">
                <h2 className="font-bold text-lg text-[#0c4a6e] leading-tight">{draw.name}</h2>
                <p className="text-xs text-slate-500">{draw.code} • Draw No: {draw.drawNumber}</p>
            </div>
          </div>
          
          {/* Search Bar for Winners */}
          {!isPending && (
             <div className="p-3 bg-slate-50 border-b border-slate-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search your 4-digit number..." 
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#0c4a6e] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </div>
          )}
      </div>

      <div className="p-4 max-w-3xl mx-auto">
        {isPending ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Results Pending</h3>
                <p className="text-slate-500 mt-2 max-w-xs">
                    The draw for <span className="font-bold">{draw.name}</span> has not taken place yet. Please check back on <span className="font-bold">{draw.drawDate}</span>.
                </p>
            </div>
        ) : (
            <>
                {/* 1st Prize Highlight */}
                {searchTerm === '' && (
                    <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c4a6e] to-[#0284c7] text-white p-6 shadow-lg">
                        <div className="relative z-10 text-center">
                             <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">First Prize Winner</p>
                             <h2 className="text-4xl font-extrabold tracking-wider font-mono">{prizeStructure[0]?.winners[0] || '---'}</h2>
                             <p className="text-lg font-medium mt-2 text-sky-200">{prizeStructure[0]?.amount}</p>
                        </div>
                    </div>
                )}

                {/* Prize List */}
                <div className="space-y-2">
                    {filteredStructure.length > 0 ? (
                        filteredStructure.map((prize: any, idx: number) => (
                            <PrizeGroup key={idx} prize={prize} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <Search className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p>No winning numbers found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Results;
