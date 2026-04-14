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

export const RESEARCH_REPORTS = {
  kspay: {
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
      subScores: { unitEconomics: 91, teamStrength: 80, financialHealth: 30, revenueGrowth: 84, marketSize: 88, regulatorySafety: 28 }
    },
    rating: { status: 'ACCUMULATE', conviction: 3.5, bull: 185, base: 128, bear: 55, targetRange: '₹85 – ₹160' },
    swot: {
      strengths: [
        '10.6x LTV/CAC — best unit economics in AgriFinTech seed cohort',
        'USSD on feature phones — 0 smartphone dependency',
        'Patented Agri-CIBIL score — no CIBIL needed, serves 40% excluded farmers',
        'CEO Devika Rao ex-NABARD — deep FPO + govt network moat'
      ],
      weaknesses: [
        'NPA of 3.8% — above startup-stage benchmark of <2%',
        'Single NBFC partner — Utkarsh SFB concentration risk',
        'Pre-profitability, ₹64.8L net loss in FY24'
      ],
      opportunities: [
        '38 million target farmers across 4 priority states',
        'FPO working capital loan product — ₹5–25L per FPO = 10x AUM per client',
        'KisanShield v2 multi-peril — 3x addressable insurance market'
      ],
      threats: [
        'RBI LSP guidelines — could require direct NBFC licence',
        'Extended drought → NPA spike across entire loan book',
        'Well-funded competitor entering ₹5K–₹50K bracket'
      ]
    },
    traction: [
      { label: 'Farmers', value: '2,200' },
      { label: 'AUM', value: '₹1.85Cr' },
      { label: 'Repayment', value: '96.2%' },
      { label: 'Policies Sold', value: '1,840' }
    ],
    projections: [
      { label: 'FY24', val1: 10, val2: 5, label1: 'AUM', label2: 'REV' },
      { label: 'Yr 1', val1: 25, val2: 15, label1: 'AUM', label2: 'REV' },
      { label: 'Yr 2', val1: 55, val2: 40, label1: 'AUM', label2: 'REV' },
      { label: 'Yr 3', val1: 100, val2: 80, label1: 'AUM', label2: 'REV' },
    ]
  },
  msft: {
    price: 420.00,
    mktCap: '3.1T',
    tags: ['Blue Chip', 'Cloud Leader', 'AI Powerhouse', 'Azure Dominance', 'Copilot Integration', 'High Cash Flow'],
    metrics: [
      { label: 'AZURE GROWTH', value: '31%', sub: 'Driven by AI deployments' },
      { label: 'NET MARGIN', value: '35.4%', sub: 'Best-in-class profitability' },
      { label: 'P/E RATIO', value: '32.4x', sub: 'Above 5Y average (28x)' },
      { label: 'FREE CASH FLOW', value: '$63B', sub: 'Last Twelve Months (LTM)' },
      { label: 'DIVIDEND YIELD', value: '0.71%', sub: 'Steady growth profile' },
      { label: 'ROE', value: '38.2%', sub: 'Exceptional capital efficiency' },
      { label: 'DEBT/EQUITY', value: '0.24', sub: 'Highly conservative balance sheet' },
      { label: 'OPERATING MARGIN', value: '44%', sub: 'Cloud & Office 365 synergy' }
    ],
    quantScore: {
      total: 92,
      grade: 'A+',
      subScores: { cloudGrowth: 95, aiInnovation: 98, cashFlow: 92, marketMoat: 96, valuation: 74, governance: 98 }
    },
    rating: { status: 'STRONG BUY', conviction: 4.8, bull: 520, base: 455, bear: 380, targetRange: '₹380 – ₹520' },
    swot: {
      strengths: [
        'Azure Cloud dominance — 31% YoY growth with high AI contribution',
        'Office 365 ecosystem — 400M+ paid seats creating massive recurring revenue',
        'OpenAI Partnership — Exclusive access to GPT models for Copilot',
        'AAA Credit Rating — One of only two US companies with this rating'
      ],
      weaknesses: [
        'Premium Valuation — P/E of 32x is pricey compared to history',
        'Hardware drag — Surface and Windows OEM growth is stagnant',
        'Regulatory overhead — EU Digital Markets Act compliance costs'
      ],
      opportunities: [
        'Generative AI monetization — Estimated $10B+ revenue by 2026',
        'Gaming Expansion — Activision Blizzard acquisition scaling Xbox Game Pass',
        'Security & Cloud — Multi-cloud hybrid strategy capturing enterprise spend'
      ],
      threats: [
        'Google Cloud & AWS — Intense price competition in hyperscale',
        'Anti-trust action — Global scrutiny over AI & Cloud bundling',
        'Currency fluctuations — Strong USD impacts overseas earnings'
      ]
    },
    traction: [
      { label: 'Azure Share', value: '24%' },
      { label: 'Teams Users', value: '320M' },
      { label: 'AI Revenue', value: '$6B+' },
      { label: 'Countries', value: '190' }
    ],
    projections: [
      { label: '2023', val1: 45, val2: 30, label1: 'CLOUD', label2: 'NET' },
      { label: '2024E', val1: 65, val2: 45, label1: 'CLOUD', label2: 'NET' },
      { label: '2025E', val1: 85, val2: 65, label1: 'CLOUD', label2: 'NET' },
      { label: '2026E', val1: 100, val2: 85, label1: 'CLOUD', label2: 'NET' },
    ]
  }
};

export const IPO_DATA = {
  current: [],
  closed: [],
  listed: []
};
