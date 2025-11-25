
export interface LotteryDraw {
    id: string;
    name: string;
    code: string;
    drawDate: string; // ISO Date string
    drawNumber: string;
    firstPrize: string; // Amount
    firstPrizeWinner?: string; // Ticket Number
    imageUrl?: string;
    status: 'completed' | 'upcoming' | 'live';
}

export interface PrizeStructure {
    rank: string;
    amount: string;
    winners: string[]; // Array of ticket numbers or partials
}

export interface Ticket {
    series: string;
    number: string;
    drawCode: string;
}

export interface LotteryItem {
    id: string;
    name: string;
    code: string;
    drawNumber: string;
    drawDate: string;
    price: number;
    jackpot: string;
}

export interface FAQItem {
    id: string;
    q: string;
    a: string;
}

export interface PurchasedTicket {
    id: string;
    lotteryName: string;
    drawCode: string;
    drawNumber: string;
    drawDate: string;
    series: string;
    number: string;
    purchaseDate: string;
    status: 'upcoming' | 'won' | 'lost' | 'claimed';
    prizeAmount?: string;
    prizeRank?: string;
}

export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: 'user' | 'admin';
    profileImage?: string;
    walletBalance: number;
    isActive: boolean;
}

export enum AppRoute {
    HOME = '/',
    RESULTS = '/results',
    TICKET_CHECK = '/ticket-check',
    PRIZE_CHECK = '/prize-check',
    PRIZE_CLAIM = '/prize-claim',
    BUY_TICKET = '/buy-ticket',
    CONTACT = '/contact',
    LOGIN = '/login',
    PROFILE = '/profile',
    MY_TICKETS = '/my-tickets',
    HELP = '/help',
    ADMIN = '/admin'
}
