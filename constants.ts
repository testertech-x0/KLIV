import { LotteryDraw, PrizeStructure, PurchasedTicket } from './types';

export const MOCK_DRAWS: LotteryDraw[] = [
    {
        id: '1',
        name: 'BHAGYATHARA',
        code: 'BT-30',
        drawDate: '2023-10-25',
        drawNumber: '30',
        firstPrize: '₹1,00,00,000',
        firstPrizeWinner: 'BU 142769',
        imageUrl: 'https://picsum.photos/seed/bt30/400/200',
        status: 'completed'
    },
    {
        id: '2',
        name: 'SAMRUDHI',
        code: 'SM-30',
        drawDate: '2023-10-26',
        drawNumber: '106',
        firstPrize: '₹50,00,000',
        imageUrl: 'https://picsum.photos/seed/sm30/400/200',
        status: 'completed'
    },
    {
        id: '3',
        name: 'POOJA BUMPER',
        code: 'BR-106',
        drawDate: '2023-11-20',
        drawNumber: '106',
        firstPrize: '₹10,00,00,000',
        imageUrl: 'https://picsum.photos/seed/br106/400/200',
        status: 'upcoming'
    }
];

export const MOCK_PRIZE_STRUCTURE: PrizeStructure[] = [
    { rank: '1st Prize', amount: '₹1,00,00,000', winners: ['BU 142769'] },
    { rank: 'Consolation', amount: '₹5,000', winners: ['BN 142769', 'BO 142769', 'BP 142769'] },
    { rank: '2nd Prize', amount: '₹30,00,000', winners: ['BW 334420'] },
    { rank: '3rd Prize', amount: '₹5,00,000', winners: ['BT 272142'] },
    { rank: '4th Prize', amount: '₹5,000', winners: ['1113', '1790', '1794', '3033'] },
];

export const PRIZE_STRUCTURES: Record<string, PrizeStructure[]> = {
    'BT-30': [
        { rank: '1st Prize', amount: '₹1,00,00,000', winners: ['BU 142769'] },
        { rank: 'Consolation', amount: '₹8,000', winners: ['BN 142769', 'BO 142769', 'BP 142769', 'BS 142769', 'BT 142769', 'BV 142769', 'BW 142769', 'BX 142769', 'BY 142769', 'BZ 142769'] },
        { rank: '2nd Prize', amount: '₹10,00,000', winners: ['BW 334420'] },
        { rank: '3rd Prize', amount: '₹5,000', winners: ['0081', '0245', '1289', '2945', '3956', '4123', '5567', '6789', '7890', '8901', '9012', '1122', '3344', '5566', '7788', '9900', '1357', '2468'] },
        { rank: '4th Prize', amount: '₹2,000', winners: ['1113', '1790', '1794', '3033', '4521', '6632', '7741', '8852'] },
        { rank: '5th Prize', amount: '₹1,000', winners: ['0123', '2345', '3456', '5543', '6654', '7765'] },
        { rank: '6th Prize', amount: '₹500', winners: ['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010', '1234', '5678', '9988', '7766'] },
        { rank: '7th Prize', amount: '₹100', winners: ['0123', '2345', '3456', '1231', '9999', '8888', '7777', '6666'] },
    ],
    'SM-30': [
         { rank: '1st Prize', amount: '₹50,00,000', winners: ['SZ 882190'] },
         { rank: 'Consolation', amount: '₹8,000', winners: ['SA 882190', 'SB 882190', 'SC 882190', 'SD 882190', 'SE 882190'] },
         { rank: '2nd Prize', amount: '₹10,00,000', winners: ['SK 112233'] },
         { rank: '3rd Prize', amount: '₹5,000', winners: ['1234', '5678', '9012', '3456', '7890'] },
         { rank: '4th Prize', amount: '₹2,000', winners: ['1111', '2222', '3333', '4444', '5555', '6666', '7777'] },
         { rank: '5th Prize', amount: '₹1,000', winners: ['0123', '2345', '3456', '5543'] },
    ],
    'BR-106': [] // Pending
};

export const MOCK_USER_TICKETS: PurchasedTicket[] = [
    {
        id: 't1',
        lotteryName: 'POOJA BUMPER',
        drawCode: 'BR-106',
        drawNumber: '106',
        drawDate: '2023-11-20',
        series: 'NA',
        number: '458291',
        purchaseDate: '2023-10-27',
        status: 'upcoming'
    },
    {
        id: 't2',
        lotteryName: 'POOJA BUMPER',
        drawCode: 'BR-106',
        drawNumber: '106',
        drawDate: '2023-11-20',
        series: 'NB',
        number: '112233',
        purchaseDate: '2023-10-28',
        status: 'upcoming'
    },
    {
        id: 't3',
        lotteryName: 'BHAGYATHARA',
        drawCode: 'BT-30',
        drawNumber: '30',
        drawDate: '2023-10-25',
        series: 'BU',
        number: '142769',
        purchaseDate: '2023-10-20',
        status: 'won',
        prizeAmount: '₹1,00,00,000',
        prizeRank: '1st Prize'
    },
    {
        id: 't4',
        lotteryName: 'AKSHAYA',
        drawCode: 'AK-56',
        drawNumber: '56',
        drawDate: '2023-09-15',
        series: 'AZ',
        number: '885522',
        purchaseDate: '2023-09-10',
        status: 'lost'
    }
];

export const COLORS = {
    primary: 'bg-[#0c4a6e]', // Deep Ocean Blue (Sky 900)
    primaryGradient: 'bg-gradient-to-r from-[#0c4a6e] to-[#0284c7]', // Sky 900 to Sky 600
    secondary: 'bg-[#059669]', // Emerald Green
    secondaryGradient: 'bg-gradient-to-r from-[#059669] to-[#10b981]',
    lightBg: 'bg-[#f0f9ff]', // Sky 50
    accentBlue: 'bg-[#0ea5e9]' // Sky 500
};