
import React, { useState } from 'react';
import { QrCode, ShieldCheck, Trophy, Gift, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants';
import { useData } from '../DataContext';

interface CheckFormProps {
  type: 'TICKET_CHECK' | 'PRIZE_CHECK' | 'PRIZE_CLAIM';
}

const CheckForms: React.FC<CheckFormProps> = ({ type }) => {
  const { prizeStructures, draws } = useData();
  const [scanMode, setScanMode] = useState(false);
  
  // Mock State
  const [drawDate, setDrawDate] = useState('');
  const [series, setSeries] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: 'success' | 'error' | 'warning', message: string, detail?: string} | null>(null);

  const getDetails = () => {
    switch(type) {
      case 'TICKET_CHECK':
        return {
          title: 'Ticket Check',
          subtitle: 'Check Ticket Validity',
          desc: 'Verify your ticket\'s authenticity using the Ticket Check feature. Enter the 6-digit ticket number.',
          icon: ShieldCheck,
          bgIcon: 'bg-emerald-100 text-emerald-600',
          btnColor: COLORS.secondaryGradient,
          btnText: 'VERIFY AUTHENTICITY'
        };
      case 'PRIZE_CHECK':
        return {
          title: 'Prize Check',
          subtitle: 'Check Availability of Prize',
          desc: 'Utilize the Prize Check feature to verify if your ticket contains a prize.',
          icon: Trophy,
          bgIcon: 'bg-indigo-100 text-indigo-600',
          btnColor: COLORS.secondaryGradient,
          btnText: 'CHECK STATUS'
        };
      case 'PRIZE_CLAIM':
         return {
          title: 'Prize Claim',
          subtitle: 'Check Prize Claim Status',
          desc: 'For Prize Claim, verify your claim status by selecting the scheme and draw.',
          icon: Gift,
          bgIcon: 'bg-teal-100 text-teal-600',
          btnColor: COLORS.secondaryGradient,
          btnText: 'CHECK CLAIM STATUS'
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  const handleScanToggle = () => {
    setScanMode(!scanMode);
    setResult(null);
  };

  const handleSubmit = () => {
      setResult(null);
      if (!ticketNumber || ticketNumber.length !== 6) {
          setResult({ status: 'warning', message: 'Invalid Input', detail: 'Please enter a valid 6-digit ticket number.' });
          return;
      }

      setLoading(true);

      setTimeout(() => {
          setLoading(false);
          
          if (type === 'TICKET_CHECK') {
              // Basic check logic: does ticket series and number look plausible
              if (series && ticketNumber) {
                  setResult({ status: 'success', message: 'Authentic Ticket', detail: `Ticket ${series} ${ticketNumber} format is valid.` });
              } else {
                  setResult({ status: 'error', message: 'Verification Failed', detail: 'Invalid format.' });
              }
          } 
          else if (type === 'PRIZE_CHECK') {
              // Logic: Check against ALL known prize structures in DataContext
              let winnerFound = false;
              let winDetails = '';

              Object.entries(prizeStructures).forEach(([code, structure]) => {
                  const win = structure.find(p => p.winners.includes(ticketNumber) || p.winners.includes(series + ' ' + ticketNumber));
                  if (win) {
                      winnerFound = true;
                      winDetails = `Won ${win.rank} (${win.amount}) in draw ${code}`;
                  }
              });

              if (winnerFound) {
                  setResult({ status: 'success', message: 'Congratulations!', detail: winDetails });
              } else {
                  setResult({ status: 'error', message: 'Not a Winner', detail: 'This number was not found in the published prize lists.' });
              }
          }
          else if (type === 'PRIZE_CLAIM') {
              setResult({ status: 'warning', message: 'No Claim Found', detail: 'No pending claims found for this ticket.' });
          }

      }, 1500);
  }

  return (
    <div className="p-6 max-w-xl mx-auto w-full animate-fade-in pb-20">
      {/* Header Card */}
      <div className="flex items-center space-x-4 mb-8">
         <div className={`w-16 h-16 rounded-xl ${details.bgIcon} flex items-center justify-center shadow-sm`}>
            <Icon className="w-8 h-8" />
         </div>
         <div>
             <h2 className="text-xl font-bold text-slate-800">{details.title}</h2>
             <p className="text-sm text-slate-500">{details.subtitle}</p>
         </div>
      </div>

      {/* Toggle Tabs for QR vs Manual */}
      <div className="bg-slate-100 p-1 rounded-lg flex mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${!scanMode ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            onClick={() => setScanMode(false)}
          >
            Manual Entry
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${scanMode ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            onClick={handleScanToggle}
          >
            QR Scan
          </button>
      </div>

      {/* Form Content */}
      {scanMode ? (
        <div className="bg-black/5 rounded-2xl border-2 border-dashed border-slate-300 h-64 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-200 animate-pulse opacity-20"></div>
            <QrCode className="w-16 h-16 mb-4 text-slate-400" />
            <p>Align QR Code within frame</p>
            <button className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-full text-xs">Open Camera</button>
        </div>
      ) : (
        <div className="space-y-5">
           {type !== 'TICKET_CHECK' && (
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Select Draw Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c4a6e] focus:border-transparent outline-none bg-white"
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                />
             </div>
           )}
           
           <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Ticket Details</label>
                <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Series" 
                      className="w-1/3 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c4a6e] outline-none uppercase text-center"
                      value={series}
                      onChange={(e) => setSeries(e.target.value.toUpperCase())}
                      maxLength={2}
                    />
                    <input 
                      type="tel" 
                      placeholder="Number" 
                      className="w-2/3 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c4a6e] outline-none text-center tracking-widest font-mono"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value.replace(/\D/g,''))}
                      maxLength={6}
                    />
                </div>
           </div>
           
           {type === 'TICKET_CHECK' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Secret Code</label>
                <input 
                  type="password" 
                  placeholder="Enter 4 digit pin" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c4a6e] outline-none text-center tracking-widest"
                  maxLength={4}
                />
             </div>
           )}
           
           <button 
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3.5 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 mt-4 ${details.btnColor} flex items-center justify-center`}
           >
               {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : details.btnText}
           </button>
        </div>
      )}

      {/* Result Display */}
      {result && (
          <div className={`mt-6 p-4 rounded-xl border flex items-start space-x-3 animate-fade-in
            ${result.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : ''}
            ${result.status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : ''}
            ${result.status === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : ''}
          `}>
              <div className="mt-0.5">
                  {result.status === 'success' && <CheckCircle className="w-5 h-5" />}
                  {result.status === 'error' && <XCircle className="w-5 h-5" />}
                  {result.status === 'warning' && <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                  <h4 className="font-bold">{result.message}</h4>
                  <p className="text-sm opacity-80 mt-1">{result.detail}</p>
              </div>
          </div>
      )}

      <div className="mt-8 bg-sky-50 p-4 rounded-xl border border-sky-100">
        <p className="text-xs text-sky-800 leading-relaxed">
            {details.desc}
        </p>
      </div>
    </div>
  );
};

export default CheckForms;
