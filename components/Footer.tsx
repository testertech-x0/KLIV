import React from 'react';
import { COLORS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className={`${COLORS.primary} text-white mt-auto`}>
        {/* Wave Separator SVG */}
        <div className="w-full overflow-hidden leading-[0]">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] fill-[#f8fafc]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
        </div>

        <div className="px-6 pb-8 pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                 {/* Mock Emblem */}
                <div className="h-16 w-16 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <img src="https://picsum.photos/id/237/100/100" alt="Emblem" className="rounded-full opacity-80 grayscale hover:grayscale-0 transition" />
                </div>
                <div>
                    <p className="font-bold text-sm uppercase">Directorate of Kerala</p>
                    <p className="font-bold text-sm uppercase">State Lotteries</p>
                    <p className="text-[10px] text-white/70">Government of Kerala</p>
                </div>
            </div>
            
             {/* Mascot/Icon Placeholder */}
            <div className="opacity-80">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                   <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                   <path d="M4 22h16"/>
                   <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                   <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                   <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
               </svg>
            </div>
        </div>
    </footer>
  );
};

export default Footer;