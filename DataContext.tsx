
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LotteryDraw, PrizeStructure, LotteryItem, FAQItem } from './types';
import { MOCK_DRAWS, PRIZE_STRUCTURES, MOCK_PRIZE_STRUCTURE } from './constants';

interface DataContextType {
  draws: LotteryDraw[];
  addDraw: (draw: LotteryDraw) => void;
  updateDraw: (draw: LotteryDraw) => void;
  deleteDraw: (id: string) => void;
  
  prizeStructures: Record<string, PrizeStructure[]>;
  updatePrizeStructure: (code: string, structure: PrizeStructure[]) => void;

  lotteryInventory: LotteryItem[];
  addLotteryItem: (item: LotteryItem) => void;
  updateLotteryItem: (item: LotteryItem) => void;
  deleteLotteryItem: (id: string) => void;

  faqs: FAQItem[];
  addFAQ: (faq: FAQItem) => void;
  updateFAQ: (faq: FAQItem) => void;
  deleteFAQ: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_INVENTORY: LotteryItem[] = [
    { id: 'POOJA', name: 'Pooja Bumper', code: 'BR-106', drawNumber: '106', drawDate: '2023-11-20', price: 200, jackpot: '12 Cr' },
    { id: 'WINWIN', name: 'Win-Win', code: 'W-742', drawNumber: '742', drawDate: '2023-11-25', price: 40, jackpot: '75 L' },
    { id: 'STHREE', name: 'Sthree Sakthi', code: 'SS-388', drawNumber: '388', drawDate: '2023-11-26', price: 40, jackpot: '75 L' },
];

const INITIAL_FAQS: FAQItem[] = [
      { id: '1', q: 'How do I check my ticket results?', a: 'Go to the Results page or use the Ticket Check feature. You can scan the QR code on your ticket or enter the number manually.' },
      { id: '2', q: 'How do I claim a prize?', a: 'For prizes up to ₹5,000, visit any authorized lottery stall. For amounts above ₹5,000, please visit the District Lottery Office with your winning ticket and ID proof.' },
      { id: '3', q: 'Can I buy tickets online?', a: 'Yes, use the "Buy Ticket" feature in this app. Payment is processed securely, and digital tickets are stored in your profile under "My Tickets".' },
      { id: '4', q: 'Is this the official app?', a: 'Yes, this is the official mobile application for the Directorate of Kerala State Lotteries.' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [prizeStructures, setPrizeStructures] = useState<Record<string, PrizeStructure[]>>({});
  const [lotteryInventory, setLotteryInventory] = useState<LotteryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    // Initialize Data from LocalStorage or Constants
    const storedDraws = localStorage.getItem('kl_draws');
    setDraws(storedDraws ? JSON.parse(storedDraws) : MOCK_DRAWS);

    const storedStructures = localStorage.getItem('kl_structures');
    setPrizeStructures(storedStructures ? JSON.parse(storedStructures) : PRIZE_STRUCTURES);

    const storedInventory = localStorage.getItem('kl_inventory');
    setLotteryInventory(storedInventory ? JSON.parse(storedInventory) : INITIAL_INVENTORY);

    const storedFaqs = localStorage.getItem('kl_faqs');
    setFaqs(storedFaqs ? JSON.parse(storedFaqs) : INITIAL_FAQS);
  }, []);

  // --- DRAWS ---
  const addDraw = (draw: LotteryDraw) => {
    const updated = [draw, ...draws];
    setDraws(updated);
    localStorage.setItem('kl_draws', JSON.stringify(updated));
  };

  const updateDraw = (draw: LotteryDraw) => {
    const updated = draws.map(d => d.id === draw.id ? draw : d);
    setDraws(updated);
    localStorage.setItem('kl_draws', JSON.stringify(updated));
  };

  const deleteDraw = (id: string) => {
    const updated = draws.filter(d => d.id !== id);
    setDraws(updated);
    localStorage.setItem('kl_draws', JSON.stringify(updated));
  };

  // --- STRUCTURES ---
  const updatePrizeStructure = (code: string, structure: PrizeStructure[]) => {
    const updated = { ...prizeStructures, [code]: structure };
    setPrizeStructures(updated);
    localStorage.setItem('kl_structures', JSON.stringify(updated));
  };

  // --- INVENTORY ---
  const addLotteryItem = (item: LotteryItem) => {
    const updated = [...lotteryInventory, item];
    setLotteryInventory(updated);
    localStorage.setItem('kl_inventory', JSON.stringify(updated));
  };

  const updateLotteryItem = (item: LotteryItem) => {
    const updated = lotteryInventory.map(i => i.id === item.id ? item : i);
    setLotteryInventory(updated);
    localStorage.setItem('kl_inventory', JSON.stringify(updated));
  };

  const deleteLotteryItem = (id: string) => {
    const updated = lotteryInventory.filter(i => i.id !== id);
    setLotteryInventory(updated);
    localStorage.setItem('kl_inventory', JSON.stringify(updated));
  };

  // --- FAQS ---
  const addFAQ = (faq: FAQItem) => {
    const updated = [...faqs, faq];
    setFaqs(updated);
    localStorage.setItem('kl_faqs', JSON.stringify(updated));
  };

  const updateFAQ = (faq: FAQItem) => {
    const updated = faqs.map(f => f.id === faq.id ? faq : f);
    setFaqs(updated);
    localStorage.setItem('kl_faqs', JSON.stringify(updated));
  };

  const deleteFAQ = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    localStorage.setItem('kl_faqs', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{
      draws, addDraw, updateDraw, deleteDraw,
      prizeStructures, updatePrizeStructure,
      lotteryInventory, addLotteryItem, updateLotteryItem, deleteLotteryItem,
      faqs, addFAQ, updateFAQ, deleteFAQ
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
