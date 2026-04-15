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
  { id: 1, cat: 'Trending', stock: 'Microsoft', ticker: 'MSFT', title: 'Why We Should Buy Microsoft Now', body: 'Analysts bullish on Microsoft Azure cloud business amid strong Q4 earnings. The company reported record revenue growth driven by AI services.', change: '+2.5%' },
  { id: 2, cat: 'IT News', stock: 'TCS', ticker: 'TCS', title: 'TCS Wins $500M Deal in Europe', body: 'TCS secured a major multi-year contract to modernize banking infrastructure for a leading European financial institution.', change: '+1.9%' },
  { id: 3, cat: 'Healthcare', stock: 'Infosys', ticker: 'INFY', title: 'Infosys Partners with NHS for Digital Transformation', body: 'Infosys announced a strategic partnership with UK\'s National Health Service to accelerate digital transformation across hospitals.', change: '-0.5%' },
  { id: 4, cat: 'Gov News', stock: 'Reliance', ticker: 'RIL', title: 'Government Boosts Renewable Energy Policy', body: 'New government policy on green hydrogen production expected to benefit Reliance Industries significantly as it expands in clean energy.', change: '+3.2%' },
  { id: 'kspay-report', cat: 'Analysis', stock: 'KisanPay', ticker: 'KSPAY', title: 'Deep Dive: KisanPay Fintech', body: 'A detailed look at rural micro-lending potential with best-in-class unit economics.', change: 'Featured' },
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
  },
  aapl: {
    price: 180.00,
    mktCap: '3.0T',
    tags: ['Consumer Giant', 'Ecosystem Lock-in', 'Services Growth', 'iPhone Dominance', 'Privacy Leader'],
    metrics: [
      { label: 'SERVICES REV', value: '$85B', sub: '+12% YoY growth' },
      { label: 'ACTIVE DEVICES', value: '2.2B', sub: 'Growing install base' },
      { label: 'CASH ON HAND', value: '$162B', sub: 'Massive buyback power' },
      { label: 'GROSS MARGIN', value: '45.2%', sub: 'Record high for hardware' }
    ],
    quantScore: {
      total: 88,
      grade: 'A',
      subScores: { ecosystem: 98, hardware: 85, services: 92, margins: 90, valuation: 68, brand: 99 }
    },
    rating: { status: 'HOLD', conviction: 3.2, bull: 225, base: 190, bear: 165, targetRange: '₹165 – ₹225' },
    swot: {
      strengths: ['Ultimate brand loyalty', 'High-margin Services segment', 'Vertical integration of chips/OS'],
      weaknesses: ['iPhone concentration risk', 'China market headwinds', 'App Store regulatory pressure'],
      opportunities: ['Vision Pro spatial computing', 'AI-integrated iOS 18', 'Health-tech expansion'],
      threats: ['Geopolitical supply chain risk', 'EU sideloading mandates', 'Competitive Android AI phones']
    },
    traction: [{ label: 'iPhones', value: '1.4B' }, { label: 'Subscribers', value: '1B+' }],
    projections: [
      { label: '2023', val1: 30, val2: 15, label1: 'SRV', label2: 'NET' },
      { label: '2024E', val1: 40, val2: 25, label1: 'SRV', label2: 'NET' },
      { label: '2025E', val1: 55, val2: 40, label1: 'SRV', label2: 'NET' },
    ]
  },
  reliance: {
    price: 2890,
    mktCap: '19.5L Cr',
    tags: ['Conglomerate', 'Energy Giant', 'Retail Leader', 'Jio Digital', 'Green Energy Pivot'],
    metrics: [
      { label: 'JIO ARPU', value: '₹181.7', sub: 'Strong data growth' },
      { label: 'RETAIL EBITDA', value: '₹23K Cr', sub: 'Expanding footprint' },
      { label: 'O2C MARGINS', value: '18.4%', sub: 'Stable refining spread' }
    ],
    quantScore: {
      total: 82,
      grade: 'A-',
      subScores: { digitalMoat: 94, retailScale: 90, energyPivot: 75, leverage: 68 }
    },
    rating: { status: 'BUY', conviction: 4.1, bull: 3400, base: 3100, bear: 2600, targetRange: '₹2600 – ₹3400' },
    swot: {
      strengths: ['Dominant market position', 'Jio digital ecosystem', 'Executing retail expansion'],
      weaknesses: ['High CAPEX requirements', 'Debt levels from expansion', 'O2C volatility'],
      opportunities: ['5G monetization', 'Green Hydrogen plans', 'Reliance Retail IPO'],
      threats: ['Regulatory policy changes', 'Oil price fluctuations', 'Intense telecom competition']
    },
    traction: [{ label: 'Jio Users', value: '470M' }, { label: 'Retail Stores', value: '18K+' }],
    projections: [
      { label: '2023', val1: 20, val2: 10, label1: 'JIO', label2: 'RET' },
      { label: '2024E', val1: 35, val2: 20, label1: 'JIO', label2: 'RET' },
      { label: '2025E', val1: 50, val2: 35, label1: 'JIO', label2: 'RET' },
    ]
  },
  tcs: {
    price: 3520,
    mktCap: '12.8L Cr',
    tags: ['IT Services', 'Dividend King', 'Digital Transformation', 'Tata Trust', 'High Retention'],
    metrics: [
      { label: 'ORDER BOOK', value: '$8.1B', sub: 'Robust deal pipeline' },
      { label: 'ATTRITION', value: '13.3%', sub: 'Industry-best retention' },
      { label: 'EBIT MARGIN', value: '25.0%', sub: 'Resilient profitability' }
    ],
    quantScore: {
      total: 85,
      grade: 'A',
      subScores: { delivery: 95, clients: 90, talent: 88, dividend: 92, valuation: 72 }
    },
    rating: { status: 'ACCUMULATE', conviction: 3.8, bull: 4200, base: 3850, bear: 3300, targetRange: '₹3300 – ₹4200' },
    swot: {
      strengths: ['Massive global scale', 'Tata brand trust', 'Diversified vertical mix'],
      weaknesses: ['Slow AI pivot vs rivals', 'US/EU tech spend slowdown', 'Labor cost inflation'],
      opportunities: ['Cloud modernization cycle', 'GenAI implementation as-a-service', 'European expansion'],
      threats: ['H-1B visa restrictions', 'Automation squeezing margins', 'Currency volatility']
    },
    traction: [{ label: 'Employees', value: '600K' }, { label: 'Top 500 Client', value: '42%' }],
    projections: [
      { label: '2023', val1: 25, val2: 12, label1: 'IT', label2: 'AI' },
      { label: '2024E', val1: 40, val2: 28, label1: 'IT', label2: 'AI' },
      { label: '2025E', val1: 60, val2: 55, label1: 'IT', label2: 'AI' },
    ]
  }
};

export const IPO_DATA = {
  current: [
    { name: 'Megasoft - Pan HR Solution Ltd', date: 'Day 3 - 3:33pm', priceRange: '111-117', minInv: '1,40,400', minQty: '1200', status: 'current' }
  ],
  closed: [
    { name: 'Bapplee Technologies Ltd', date: 'Day 5 - 5:00pm', issuePrice: '95-102', listPrice: '115', gain: '12', status: 'closed' },
    { name: 'Denver Corp', date: 'Day 2 - 2:30pm', issuePrice: '210-220', listPrice: '240', gain: '10', status: 'closed' },
    { name: 'FinVest Securities', date: 'Day 1 - 1:00pm', issuePrice: '75-80', listPrice: '88', gain: '10', status: 'closed' }
  ],
  listed: [
    { name: 'TechPark Solutions', listPrice: '420', gain: '40' },
    { name: 'GrowMore Finance', listPrice: '180', gain: '25' },
    { name: 'SmartRetail India', listPrice: '320', gain: '18' },
    { name: 'HealthFirst Ltd', listPrice: '275', gain: '15' }
  ]
};
