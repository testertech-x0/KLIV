
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Phone, HelpCircle, MessageSquare } from 'lucide-react';
import { AppRoute } from '../types';
import { COLORS } from '../constants';
import { useData } from '../DataContext';

const Help: React.FC = () => {
  const navigate = useNavigate();
  const { faqs } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 animate-fade-in">
         {/* Header */}
         <div className={`${COLORS.primary} text-white p-4 pt-4 sticky top-0 z-10 shadow-md`}>
              <div className="flex items-center space-x-4">
                  <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition">
                      <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold">Help & Support</h2>
              </div>
          </div>

          <div className="p-6 max-w-2xl mx-auto">
              {/* Intro Banner */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">How can we help you?</h3>
                  <p className="text-slate-500 text-sm mt-2">Find answers to common questions or contact our support team.</p>
              </div>

              {/* FAQs */}
              <h3 className="font-bold text-slate-800 mb-4 px-1">Frequently Asked Questions</h3>
              <div className="space-y-3 mb-8">
                  {faqs.map((f, i) => (
                      <div key={f.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                          <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-800 text-sm hover:bg-slate-50 transition"
                          >
                              <span className="pr-4">{f.q}</span>
                              {openIndex === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                          </button>
                          {openIndex === i && (
                              <div className="p-4 pt-0 text-xs text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50">
                                  {f.a}
                              </div>
                          )}
                      </div>
                  ))}
              </div>

              {/* Contact Options */}
              <h3 className="font-bold text-slate-800 mb-4 px-1">Still need help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => navigate(AppRoute.CONTACT)} className="bg-indigo-600 text-white p-5 rounded-xl shadow-lg shadow-indigo-200 flex items-center space-x-4 cursor-pointer active:scale-95 transition">
                      <div className="bg-white/20 p-2 rounded-lg">
                          <Phone className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="font-bold">Contact Support</p>
                          <p className="text-xs opacity-80">Call our helpline</p>
                      </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center space-x-4 cursor-pointer active:scale-95 transition hover:bg-slate-50">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                          <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="font-bold text-slate-800">Live Chat</p>
                          <p className="text-xs text-slate-500">Chat with an agent</p>
                      </div>
                  </div>
              </div>
          </div>
    </div>
  );
};

export default Help;
