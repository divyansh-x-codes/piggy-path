export const STOCKS = [
  { id: 'msft', name: 'Microsoft', ticker: 'MSFT', logo: 'MS', color: '#7C3AED', sector: 'IT', desc: 'Microsoft Corporation is an American multinational technology company.', basePrice: 420, change: 0.0, volume: '9.45L', avgPrice: 418.50, pe: 32.4, eps: 13.0, mktCap: '3.1T' },
  { id: 'aapl', name: 'Apple Inc', ticker: 'AAPL', logo: '🍎', color: '#111', sector: 'IT', desc: 'Apple Inc. is an American multinational technology company.', basePrice: 180, change: 0.0, volume: '12.3L', avgPrice: 178.00, pe: 29.1, eps: 6.8, mktCap: '3.0T' },
  { id: 'googl', name: 'Google', ticker: 'GOOGL', logo: 'G', color: '#EA4335', sector: 'IT', desc: 'Alphabet Inc. is an American multinational technology company.', basePrice: 150, change: 0.0, volume: '8.2L', avgPrice: 148.00, pe: 25.5, eps: 5.4, mktCap: '2.1T' },
  { id: 'reliance', name: 'Reliance', ticker: 'RIL', logo: 'R', color: '#1d4ed8', sector: 'Energy', desc: 'Reliance Industries Limited is an Indian multinational conglomerate.', basePrice: 2890, change: 1.8, volume: '5.2L', avgPrice: 2870, pe: 24.6, eps: 117.5, mktCap: '19.5L Cr' },
  { id: 'tcs', name: 'TCS', ticker: 'TCS', logo: 'TC', color: '#0ea5e9', sector: 'IT', desc: 'Tata Consultancy Services is an Indian multinational IT services company.', basePrice: 3520, change: 0.9, volume: '3.1L', avgPrice: 3490, pe: 28.3, eps: 124.4, mktCap: '12.8L Cr' },
  { id: 'infosys', name: 'Infosys', ticker: 'INFY', logo: 'IN', color: '#059669', sector: 'IT', desc: 'Infosys Limited is an Indian multinational IT company.', basePrice: 1680, change: -0.6, volume: '8.7L', avgPrice: 1700, pe: 22.1, eps: 76.0, mktCap: '7.0L Cr' },
  { 
    id: 'kspay', 
    name: 'KisanPay Fintech', 
    ticker: 'KSPAY', 
    logo: 'KS', 
    color: '#004D40', 
    sector: 'AgriFinTech', 
    desc: 'Rural Micro-Lending + Parametric Crop Insurance.', 
    basePrice: 120, 
    change: 0.0, 
    volume: '15.4L', 
    avgPrice: 120, 
    pe: 16.1, 
    eps: 7.4, 
    mktCap: '12.0 Cr' 
  },
];

export const NEWS = [
  { id: 1, cat: 'Trending', stock: 'Microsoft', ticker: 'MSFT', title: 'Why We Should Buy Microsoft Now', body: 'Analysts bullish on Microsoft Azure cloud business.', change: '+2.5%' },
  { id: 'kspay-report', cat: 'Analysis', stock: 'KisanPay', ticker: 'KSPAY', title: 'Deep Dive: KisanPay Fintech', body: 'A detailed look at rural micro-lending potential.', change: 'Featured' },
];

export const KISANPAY_ANALYSIS = {
  price: 120.00,
  mktCap: '12.0 Cr',
  tags: ['Early Revenue', 'AgriFinTech', 'Micro-Lending + InsurTech', 'USSD Feature Phone', 'RBI Regulatory Risk', 'Seed Stage', 'SIDBI SPEED Cohort'],
  metrics: [
    { label: 'ARR', value: '₹74.4L', sub: '+21% MoM growth' },
    { label: 'LOAN BOOK (AUM)', value: '₹1.85 Cr', sub: 'Finanza-verified' },
    { label: 'GROSS MARGIN', value: '61%', sub: 'Landing spread + comm' },
    { label: 'LTV / CAC', value: '10.6x', sub: '₹4,020 LTV / ₹380 CAC' },
    { label: 'NPA RATE', value: '3.8%', sub: 'Finanza-revised (was 2.1%)', warning: true },
    { label: 'REPAYMENT RATE', value: '96.2%', sub: 'On-time, FPO borrowers' },
    { label: 'ACTIVE FARMERS', value: '2,200', sub: '420 Kisan Mitras / 9 districts' },
    { label: 'P/ARR MULTIPLE', value: '16.1x', sub: 'Benchmark: 10-25x seed' }
  ],
  quantScore: {
    total: 68,
    grade: 'B',
    subScores: {
      unitEconomics: 91,
      teamStrength: 80,
      financialHealth: 30,
      revenueGrowth: 84,
      marketSize: 88,
      regulatorySafety: 28
    }
  },
  rating: {
    status: 'ACCUMULATE',
    conviction: 3.5,
    bull: 185,
    base: 128,
    bear: 55,
    targetRange: '₹85 – ₹160'
  },
  swot: {
    strengths: [
      '10.6x LTV/CAC — best unit economics in AgriFinTech seed cohort',
      'USSD on feature phones — 0 smartphone dependency',
      'Patented Agri-CIBIL score — no CIBIL needed, serves 40% excluded farmers',
      '96.2% repayment; 68-hour insurance payout — proven operations',
      'CEO Devika Rao ex-NABARD — deep FPO + govt network moat'
    ],
    weaknesses: [
      'NPA of 3.8% — above startup-stage benchmark of <2%',
      'Single NBFC partner — Utkarsh SFB concentration risk',
      'Pre-profitability, ₹64.8L net loss in FY24',
      'Collections physically limited in remote areas during monsoon'
    ],
    opportunities: [
      '38 million target farmers across 4 priority states',
      'ISRO-NABARD satellite partnership reduces data cost',
      'FPO working capital loan product — ₹5–25L per FPO = 10x AUM per client',
      'KisanShield v2 multi-peril — 3x addressable insurance market'
    ],
    threats: [
      'RBI LSP guidelines — could require direct NBFC licence',
      'Extended drought → NPA spike across entire loan book',
      'State government loan waiver announcements',
      'Well-funded competitor entering ₹5K–₹50K bracket'
    ]
  },
  traction: [
    { label: 'Farmers', value: '2,200' },
    { label: 'AUM', value: '₹1.85Cr' },
    { label: 'Repayment', value: '96.2%' },
    { label: 'Policies Sold', value: '1,840' }
  ]
};

export const IPO_DATA = {
  current: [],
  closed: [],
  listed: []
};
