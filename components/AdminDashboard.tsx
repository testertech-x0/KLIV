
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ShoppingCart, HelpCircle, LogOut, Plus, Trash2, Edit, Save, X, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useData } from '../DataContext';
import { AppRoute, LotteryDraw, LotteryItem, FAQItem } from '../types';
import { COLORS } from '../constants';

type Tab = 'USERS' | 'RESULTS' | 'INVENTORY' | 'FAQS';

const AdminDashboard: React.FC = () => {
  const { user, logout, users, deleteUser, toggleUserStatus } = useAuth();
  const { draws, addDraw, deleteDraw, lotteryInventory, addLotteryItem, deleteLotteryItem, faqs, addFAQ, deleteFAQ, updateFAQ } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('USERS');

  if (!user || user.role !== 'admin') {
      navigate(AppRoute.LOGIN);
      return null;
  }

  const handleLogout = () => {
      logout();
      navigate(AppRoute.HOME);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-[#0c4a6e] text-white flex flex-col">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <p className="text-xs text-sky-300">Kerala Lottery Official</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                <button onClick={() => setActiveTab('USERS')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'USERS' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                    <Users className="w-5 h-5" /> <span>Manage Users</span>
                </button>
                <button onClick={() => setActiveTab('RESULTS')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'RESULTS' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                    <FileText className="w-5 h-5" /> <span>Lottery Results</span>
                </button>
                <button onClick={() => setActiveTab('INVENTORY')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'INVENTORY' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                    <ShoppingCart className="w-5 h-5" /> <span>Buy Ticket Inventory</span>
                </button>
                <button onClick={() => setActiveTab('FAQS')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'FAQS' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                    <HelpCircle className="w-5 h-5" /> <span>Manage FAQs</span>
                </button>
            </nav>

            <div className="p-4 border-t border-white/10">
                <button onClick={handleLogout} className="flex items-center space-x-2 text-red-300 hover:text-white transition">
                    <LogOut className="w-5 h-5" /> <span>Logout</span>
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    {activeTab === 'USERS' && 'User Management'}
                    {activeTab === 'RESULTS' && 'Manage Results & Draws'}
                    {activeTab === 'INVENTORY' && 'Ticket Inventory Management'}
                    {activeTab === 'FAQS' && 'Help & Support Content'}
                </h1>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-600">
                    Admin: {user.name}
                </div>
            </header>

            {activeTab === 'USERS' && <UsersTable users={users} onDelete={deleteUser} onToggle={toggleUserStatus} />}
            {activeTab === 'RESULTS' && <ResultsManager draws={draws} onAdd={addDraw} onDelete={deleteDraw} />}
            {activeTab === 'INVENTORY' && <InventoryManager items={lotteryInventory} onAdd={addLotteryItem} onDelete={deleteLotteryItem} />}
            {activeTab === 'FAQS' && <FAQManager faqs={faqs} onAdd={addFAQ} onDelete={deleteFAQ} onUpdate={updateFAQ} />}
        </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const UsersTable: React.FC<{ users: any[], onDelete: (id: string) => void, onToggle: (id: string) => void }> = ({ users, onDelete, onToggle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Phone/Role</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Wallet</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-800">{u.name}</td>
                        <td className="p-4 text-sm text-slate-600">
                            <div>{u.phone}</div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{u.role}</span>
                        </td>
                        <td className="p-4 text-sm font-mono text-emerald-600">₹{u.walletBalance}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {u.isActive ? 'Active' : 'Banned'}
                            </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                             {u.role !== 'admin' && (
                                <>
                                    <button onClick={() => onToggle(u.id)} className="text-slate-400 hover:text-slate-600">
                                        {u.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => { if(window.confirm('Delete user?')) onDelete(u.id); }} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                             )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ResultsManager: React.FC<{ draws: LotteryDraw[], onAdd: (d: LotteryDraw) => void, onDelete: (id: string) => void }> = ({ draws, onAdd, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newDraw, setNewDraw] = useState<Partial<LotteryDraw>>({ status: 'upcoming' });

    const handleSave = () => {
        if (!newDraw.name || !newDraw.code || !newDraw.drawDate || !newDraw.drawNumber) return;
        onAdd({
            id: Date.now().toString(),
            name: newDraw.name,
            code: newDraw.code,
            drawDate: newDraw.drawDate,
            drawNumber: newDraw.drawNumber,
            firstPrize: newDraw.firstPrize || '₹0',
            status: newDraw.status as any,
            firstPrizeWinner: newDraw.firstPrizeWinner
        });
        setIsAdding(false);
        setNewDraw({ status: 'upcoming' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow hover:bg-emerald-700">
                    {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isAdding ? 'Cancel' : 'Add New Result'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow border border-slate-200 grid grid-cols-2 gap-4 animate-fade-in">
                    <input className="p-2 border rounded" placeholder="Lottery Name (e.g. KARUNYA)" onChange={e => setNewDraw({...newDraw, name: e.target.value})} />
                    <input className="p-2 border rounded" placeholder="Draw Code (e.g. KR-123)" onChange={e => setNewDraw({...newDraw, code: e.target.value})} />
                    <input className="p-2 border rounded" type="date" onChange={e => setNewDraw({...newDraw, drawDate: e.target.value})} />
                    <input className="p-2 border rounded" placeholder="Draw Number" onChange={e => setNewDraw({...newDraw, drawNumber: e.target.value})} />
                    <input className="p-2 border rounded" placeholder="1st Prize Amount" onChange={e => setNewDraw({...newDraw, firstPrize: e.target.value})} />
                    <input className="p-2 border rounded" placeholder="Winner Ticket (if declared)" onChange={e => setNewDraw({...newDraw, firstPrizeWinner: e.target.value})} />
                    <select className="p-2 border rounded" onChange={e => setNewDraw({...newDraw, status: e.target.value as any})}>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button onClick={handleSave} className="col-span-2 bg-slate-800 text-white py-2 rounded font-bold">Save Draw</button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {draws.map(draw => (
                    <div key={draw.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-800">{draw.name}</h3>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">{draw.code}</span>
                            </div>
                            <p className="text-xs text-slate-500">Date: {draw.drawDate} • Status: {draw.status}</p>
                        </div>
                        <button onClick={() => { if(window.confirm('Delete Result?')) onDelete(draw.id); }} className="text-red-400 hover:text-red-600 p-2">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InventoryManager: React.FC<{ items: LotteryItem[], onAdd: (i: LotteryItem) => void, onDelete: (id: string) => void }> = ({ items, onAdd, onDelete }) => {
    const [form, setForm] = useState<Partial<LotteryItem>>({});
    
    const handleSubmit = () => {
        if (!form.name || !form.price) return;
        onAdd({
            id: Date.now().toString(),
            name: form.name,
            code: form.code || 'NA',
            drawNumber: form.drawNumber || '00',
            drawDate: form.drawDate || new Date().toISOString().split('T')[0],
            price: Number(form.price),
            jackpot: form.jackpot || 'TBD'
        });
        setForm({});
    };

    return (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold mb-4 text-slate-700">Add New Lottery for Sale</h3>
                 <div className="grid grid-cols-3 gap-3">
                     <input className="p-2 border rounded" placeholder="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
                     <input className="p-2 border rounded" placeholder="Code" value={form.code || ''} onChange={e => setForm({...form, code: e.target.value})} />
                     <input className="p-2 border rounded" placeholder="Price" type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                     <input className="p-2 border rounded" placeholder="Jackpot (e.g. 10 Cr)" value={form.jackpot || ''} onChange={e => setForm({...form, jackpot: e.target.value})} />
                     <input className="p-2 border rounded" type="date" value={form.drawDate || ''} onChange={e => setForm({...form, drawDate: e.target.value})} />
                     <button onClick={handleSubmit} className="bg-indigo-600 text-white rounded font-bold">Add to Inventory</button>
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 {items.map(item => (
                     <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between">
                         <div>
                             <h4 className="font-bold text-slate-800">{item.name}</h4>
                             <p className="text-sm text-slate-500">₹{item.price} • Jackpot: {item.jackpot}</p>
                         </div>
                         <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const FAQManager: React.FC<{ faqs: FAQItem[], onAdd: (f: FAQItem) => void, onDelete: (id: string) => void, onUpdate: (f: FAQItem) => void }> = ({ faqs, onAdd, onDelete, onUpdate }) => {
    const [q, setQ] = useState('');
    const [a, setA] = useState('');

    return (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold mb-4 text-slate-700">Add FAQ</h3>
                 <input className="w-full p-2 border rounded mb-2" placeholder="Question" value={q} onChange={e => setQ(e.target.value)} />
                 <textarea className="w-full p-2 border rounded mb-2" placeholder="Answer" rows={3} value={a} onChange={e => setA(e.target.value)} />
                 <button onClick={() => { if(q && a) { onAdd({ id: Date.now().toString(), q, a }); setQ(''); setA(''); } }} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold">Publish FAQ</button>
             </div>

             <div className="space-y-3">
                 {faqs.map(faq => (
                     <div key={faq.id} className="bg-white p-4 rounded-xl border border-slate-200">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{faq.q}</h4>
                            <button onClick={() => onDelete(faq.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                         </div>
                         <p className="text-xs text-slate-500">{faq.a}</p>
                     </div>
                 ))}
             </div>
        </div>
    );
};

export default AdminDashboard;
