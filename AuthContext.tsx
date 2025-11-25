
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PurchasedTicket } from './types';
import { MOCK_USER_TICKETS } from './constants';

interface AuthContextType {
  user: User | null;
  tickets: PurchasedTicket[];
  users: User[]; // Admin usage
  login: (phone: string, name?: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  buyTickets: (newTickets: PurchasedTicket[], totalCost: number) => boolean;
  isAuthenticated: boolean;
  
  // Admin Functions
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load data on startup
  useEffect(() => {
    // 1. Load Current Session
    const storedUser = localStorage.getItem('kerala_lottery_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // 2. Load Tickets
    const storedTickets = localStorage.getItem('kerala_lottery_tickets');
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      setTickets(MOCK_USER_TICKETS);
    }

    // 3. Load All Users (Simulated DB)
    const storedUsers = localStorage.getItem('kerala_lottery_users_db');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Seed generic users if empty
      const initialUsers: User[] = [
        { id: 'u1', name: 'Adarsh Kumar', phone: '9876543210', email: 'adarsh@example.com', role: 'user', walletBalance: 2000, isActive: true },
        { id: 'u2', name: 'Admin User', phone: 'admin', email: 'admin@kerala.gov.in', role: 'admin', walletBalance: 99999, isActive: true }
      ];
      setUsers(initialUsers);
      localStorage.setItem('kerala_lottery_users_db', JSON.stringify(initialUsers));
    }
  }, []);

  const login = (phone: string, name?: string): boolean => {
    // Check for Admin
    if (phone === 'admin') {
       const adminUser = users.find(u => u.role === 'admin');
       if (adminUser) {
           setUser(adminUser);
           localStorage.setItem('kerala_lottery_user', JSON.stringify(adminUser));
           return true;
       }
       return false;
    }

    // Check existing user or Register
    let currentUser = users.find(u => u.phone === phone);
    
    if (currentUser) {
        if (!currentUser.isActive) {
            alert("Account disabled. Contact Admin.");
            return false;
        }
    } else {
        // Register new user
        currentUser = {
            id: `u-${Date.now()}`,
            name: name || 'New User',
            phone: phone,
            email: name ? `${name.toLowerCase().replace(/\s+/g, '.')}@example.com` : 'user@example.com',
            walletBalance: 2000,
            role: 'user',
            isActive: true
        };
        const updatedUsers = [...users, currentUser];
        setUsers(updatedUsers);
        localStorage.setItem('kerala_lottery_users_db', JSON.stringify(updatedUsers));
    }

    setUser(currentUser);
    localStorage.setItem('kerala_lottery_user', JSON.stringify(currentUser));
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
      if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem('kerala_lottery_user', JSON.stringify(updatedUser));
          
          // Update in DB
          const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
          setUsers(updatedUsers);
          localStorage.setItem('kerala_lottery_users_db', JSON.stringify(updatedUsers));
      }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kerala_lottery_user');
  };

  const buyTickets = (newTickets: PurchasedTicket[], totalCost: number): boolean => {
      if (!user) return false;
      if (user.walletBalance < totalCost) return false;

      const updatedUser = { ...user, walletBalance: user.walletBalance - totalCost };
      setUser(updatedUser);
      localStorage.setItem('kerala_lottery_user', JSON.stringify(updatedUser));

      // Update in DB
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('kerala_lottery_users_db', JSON.stringify(updatedUsers));

      const updatedTickets = [...newTickets, ...tickets];
      setTickets(updatedTickets);
      localStorage.setItem('kerala_lottery_tickets', JSON.stringify(updatedTickets));
      
      return true;
  };

  // --- ADMIN FUNCTIONS ---
  const deleteUser = (id: string) => {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('kerala_lottery_users_db', JSON.stringify(updatedUsers));
  };

  const toggleUserStatus = (id: string) => {
      const updatedUsers = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
      setUsers(updatedUsers);
      localStorage.setItem('kerala_lottery_users_db', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ 
        user, tickets, users, 
        login, logout, updateProfile, buyTickets, isAuthenticated: !!user,
        deleteUser, toggleUserStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
