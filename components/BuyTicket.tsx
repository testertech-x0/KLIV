
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check, AlertCircle, LogIn, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { useAuth } from '../AuthContext';
import { useData } from '../DataContext';
import { AppRoute, PurchasedTicket } from '../types';

const BuyTicket: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, buyTickets, user } = useAuth();
    const { lotteryInventory } = useData();
    
    // Set first available lottery as default if exists
    const [selectedLotteryId, setSelectedLotteryId] = useState(lotteryInventory.length > 0 ? lotteryInventory[0].id : '');
    const [count, setCount] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const seriesOptions = ['NA', 'NB', 'NC', 'ND', 'NE'];
    const [selectedSeries, setSelectedSeries] = useState(seriesOptions[0]);
    const [customNumber, setCustomNumber] = useState('');

    const currentLottery = lotteryInventory.find(l => l.id === selectedLotteryId) || lotteryInventory[0];

    if (!currentLottery) {
        return <div className="p-8 text-center text-slate-500">No lotteries available for purchase at the moment.</div>;
    }

    const total = currentLottery.price * count;

    const handleBuy = () => {
        setErrorMsg(null);

        if (!isAuthenticated) {
            navigate(AppRoute.LOGIN);
            return;
        }

        if (user && user.walletBalance < total) {
            setErrorMsg("Insufficient wallet balance. Please add funds.");
            return;
        }

        setIsProcessing(true);

        const newTickets: PurchasedTicket[] = [];
        const purchaseDate = new Date().toISOString().split('T')[0];

        for (let i = 0; i < count; i++) {
            const ticketNum = customNumber 
                ? (parseInt(customNumber) + i).toString().padStart(6, '0') 
                : Math.floor(100000 + Math.random() * 900000).toString();

            const ticket: PurchasedTicket = {
                id: `TID-${Date.now()}-${i}`,
                lotteryName: currentLottery.name,
                drawCode: currentLottery.code,
                drawNumber: currentLottery.drawNumber,
                drawDate: currentLottery.drawDate,
                series: selectedSeries,
                number: ticketNum,
                purchaseDate: purchaseDate,
                status: 'upcoming'
            };
            newTickets.push(ticket);
        }

        setTimeout(() => {
            const success = buyTickets(newTickets, total);
            
            if (success) {
                setIsProcessing(false);
                setIsSuccess(true);
                setTimeout(() => {
                    navigate(AppRoute.MY_TICKETS);
                }, 2000);
            } else {
                setIsProcessing(false);
                setErrorMsg("Transaction failed. Please try again.");
            }
        }, 1500);
    }

    return (
        <div className="p-4 max-w-2xl mx-auto w-full pb-36 animate-fade-in">
            
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-800">Buy Tickets</h2>
                 {!isAuthenticated ? (
                     <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded flex items-center">
                         <AlertCircle className="w-3 h-3 mr-1" /> Login Required
                     </span>
                 ) : (
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-full flex items-center shadow-sm">
                         <Wallet className="w-3 h-3 mr-1.5" /> Bal: ₹{user?.walletBalance.toLocaleString('en-IN')}
                     </span>
                 )}
            </div>

            {/* Lottery Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                {lotteryInventory.map(l => (
                    <button
                        key={l.id}
                        onClick={() => setSelectedLotteryId(l.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${selectedLotteryId === l.id ? 'border-[#0c4a6e] bg-sky-50 ring-1 ring-[#0c4a6e]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                        <div className="text-xs font-bold text-slate-500 uppercase">Jackpot</div>
                        <div className="text-lg font-bold text-[#0c4a6e]">{l.jackpot}</div>
                        <div className="text-sm font-medium text-slate-700 mt-1 leading-tight">{l.name}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">₹{l.price}</div>
                    </button>
                ))}
            </div>

            {/* Ticket Builder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-800">{currentLottery.name}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                        {currentLottery.code}
                    </span>
                </div>
                
                {/* Series Selection */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Series</label>
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {seriesOptions.map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedSeries(s)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${selectedSeries === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Number Input */}
                <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Number (Optional)</label>
                     <div className="relative">
                        <input 
                            type="tel" 
                            placeholder="Random" 
                            value={customNumber}
                            onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-[#0c4a6e] outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                            {customNumber ? 'CUSTOM' : 'AUTO'}
                        </span>
                     </div>
                     <p className="text-[10px] text-slate-400 mt-2 text-center">Leave blank for auto-generated lucky numbers</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                    <span className="font-medium text-slate-700">Quantity</span>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setCount(Math.max(1, count - 1))} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-100"><Minus className="w-4 h-4" /></button>
                        <span className="font-bold text-lg w-6 text-center">{count}</span>
                        <button onClick={() => setCount(count + 1)} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-100"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm font-bold rounded-xl flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {errorMsg}
                </div>
            )}

            {/* Sticky Bottom Cart */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-2xl z-50 rounded-t-2xl">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Pay</p>
                        <p className="text-3xl font-bold text-slate-900">₹{total}</p>
                    </div>
                    <button 
                        onClick={handleBuy}
                        disabled={isProcessing || isSuccess}
                        className={`${COLORS.primaryGradient} text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center space-x-2 active:scale-95 transition disabled:opacity-70 disabled:scale-100 min-w-[160px] justify-center`}
                    >
                        {isProcessing ? (
                             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : isSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                <span>SUCCESS</span>
                            </>
                        ) : !isAuthenticated ? (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>LOGIN TO BUY</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                <span>PAY NOW</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyTicket;
