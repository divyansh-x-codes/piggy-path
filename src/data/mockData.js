export const STOCKS = [
  {
    id: 'xads',
    name: 'Xads Pvt. Ltd.',
    ticker: 'XADS',
    logo: 'XDS',
    color: '#12122b',
    sector: 'AdTech / OOH',
    desc: 'Unified OOH Discovery & Execution Platform. Bengaluru-first GTM with automated proof-of-display layer.',
    basePrice: 80,
    change: 0.0,
    volume: '15.4L',
    avgPrice: 80,
    pe: 'Pre-Rev',
    eps: 'N/A',
    mktCap: '8.0 Cr'
  },
  {
    id: 'vnst',
    name: 'VoltNest Energy Pvt. Ltd.',
    ticker: 'VNST',
    logo: 'VNT',
    color: '#0f172a',
    sector: 'CleanTech / EV Charging',
    desc: 'High-speed EV charging infrastructure network. Hub-and-spoke DC fast charging corridors in Tier-1 and Tier-2 regions.',
    basePrice: 218,
    change: 0.0,
    volume: '2.1L',
    avgPrice: 218,
    pe: '15.5x P/S',
    eps: 'N/A',
    mktCap: '21.8 Cr'
  },
  {
    id: 'sklbr',
    name: 'SkillBridge EdTech Pvt. Ltd.',
    ticker: 'SKLBR',
    logo: 'SKB',
    color: '#1A2F5E',
    sector: 'Vocational EdTech',
    desc: 'Placement-linked upskilling platform with ISA model. Partnership with NSDC and Ministry of Skill Development.',
    basePrice: 95,
    change: 0.0,
    volume: '8.4L',
    avgPrice: 95,
    pe: '16.2x P/ARR',
    eps: 'N/A',
    mktCap: '9.5 Cr'
  },
  { 
    id: 'prspr', 
    name: 'Paraspar', 
    ticker: 'PRSPR', 
    logo: 'PAR', 
    color: '#0F766E', 
    sector: 'Social-Tech / Matchmaking', 
    desc: 'Clarity before Commitment. Social-tech platform focusing on multi-dimensional pre-marital compatibility and behavioral analytics.', 
    basePrice: 499, 
    change: 0.0, 
    volume: '2.4L', 
    avgPrice: 499, 
    pe: 'Pre-Revenue', 
    eps: 'N/A', 
    mktCap: '12.5 Cr' 
  },
  { 
    id: 'nrtk', 
    name: 'NuroTrack Health Pvt. Ltd.', 
    ticker: 'NRTK', 
    logo: 'NRT', 
    color: '#1A2A4A', 
    sector: 'HealthTech / RPM', 
    desc: 'AI-Powered chronic care & remote patient monitoring platform. Combining proprietary wearables with a triage engine for hospitals.', 
    basePrice: 210, 
    change: 0.0, 
    volume: '3.8L', 
    avgPrice: 210, 
    pe: '14.8x P/S', 
    eps: 'N/A', 
    mktCap: '21.0 Cr' 
  },
  { 
    id: 'nriq', 
    name: 'NeuronIQ Learning Pvt. Ltd.', 
    ticker: 'NRIQ', 
    logo: 'NRQ', 
    color: '#1A1A3A', 
    sector: 'EdTech / AI-Personalized Learning', 
    desc: 'Adaptive SaaS for K–12 and competitive exams. NeuronPath engine real-time curriculum adaptation using knowledge-graph mapping.', 
    basePrice: 118, 
    change: 0.0, 
    volume: '2.8L', 
    avgPrice: 118, 
    pe: '10.9x P/S', 
    eps: 'N/A', 
    mktCap: '11.8 Cr' 
  },
  { 
    id: 'mdnb', 
    name: 'MediNearby Technologies Pvt. Ltd.', 
    ticker: 'MDNB', 
    logo: 'MED', 
    color: '#0F766E', 
    sector: 'HealthTech / Health-O2O', 
    desc: 'Hyperlocal doctor and clinic discovery platform for Tier 2/3 cities. ABHA-integrated with an 8-language interface for rural penetration.', 
    basePrice: 150, 
    change: 0.0, 
    volume: '2.1L', 
    avgPrice: 150, 
    pe: '16x P/S', 
    eps: 'N/A', 
    mktCap: '15.0 Cr' 
  },
  { 
    id: 'kspay', 
    name: 'KisanPay Fintech Pvt. Ltd.', 
    ticker: 'KSPAY', 
    logo: 'KSP', 
    color: '#1B3A2D', 
    sector: 'AgriFinTech / Micro-Lending', 
    desc: 'Rural micro-lending and parametric crop insurance platform using USSD for non-smartphone farmers. Serving 40% of smallholders excluded from formal credit.', 
    basePrice: 120, 
    change: 0.0, 
    volume: '2.4L', 
    avgPrice: 120, 
    pe: '16.1x P/ARR', 
    eps: 'N/A', 
    mktCap: '12.0 Cr' 
  },
  { 
    id: 'crpp', 
    name: 'CropPe Technologies Pvt. Ltd.', 
    ticker: 'CRPP', 
    logo: 'CRP', 
    color: '#1A3A1A', 
    sector: 'AgriFinTech / Embedded Credit', 
    desc: 'Dealer-embedded agri-BNPL platform. Proprietary underwriting model using satellite and weather data to provide intent-based credit.', 
    basePrice: 133, 
    change: 0.0, 
    volume: '3.1L', 
    avgPrice: 133, 
    pe: '15.4x P/S', 
    eps: 'N/A', 
    mktCap: '13.3 Cr' 
  },
];

export const NEWS = [
  { id: 1, cat: 'Trending', stock: 'Xads', ticker: 'XADS', title: 'Xads Secures 15 Anchor Owners in Bengaluru', body: 'The Bengaluru pilot cluster shows strong initial traction with 15 major OOH media owners onboarding the platform.', change: 'Hot' },
  { id: 2, cat: 'Market', stock: 'Xads', ticker: 'XADS', title: 'India OOH Market Forecast: 8.9% Growth', body: 'Analysts predict a significant surge in digital OOH (DOOH) and transit media expansion across India by 2026.', change: '+8.9%' },
  { id: 3, cat: 'EV News', stock: 'VoltNest', ticker: 'VNST', title: 'VoltNest Reaches 62 Charging Stations across 8 Cities', body: 'VoltNest expands its high-speed DC charging network, hitting a key milestone of 62 operational sites with 61% utilisation.', change: 'Growth' },
  { id: 4, cat: 'EdTech', stock: 'SkillBridge', ticker: 'SKLBR', title: 'SkillBridge Achieves 82% Placement Rate for Q1 Cohort', body: 'SkillBridge strengthens its vocational moat, with 82% of its ITI and polytechnic graduates placed within 90 days of completion.', change: '+12% Enroll' },
  { id: 5, cat: 'Social-Tech', stock: 'Paraspar', ticker: 'PRSPR', title: 'Paraspar Enters App Phase 2 with LinkedIn Verification', body: 'Paraspar moves closer to launch with integrated LinkedIn professional verification and behavioral mapping layers.', change: 'Live Build' },
  { id: 6, cat: 'HealthTech', stock: 'NuroTrack', ticker: 'NRTK', title: 'NuroTrack ARR Hits ₹1.42 Cr with 34% MoM Growth', body: 'NuroTrack expands its hospital network to 38 partners across 7 cities, maintaining a category-defining 89.3% adherence rate.', change: '+34% ARR' },
  { id: 7, cat: 'EdTech', stock: 'NeuronIQ', ticker: 'NRIQ', title: 'NeuronIQ ARR Reaches ₹1.08 Cr with B2B Focus', body: 'NeuronIQ scales its adaptive AI engine to 62 school partners across 3 states, maintaining 74% gross margins.', change: '+17% ARR' },
  { id: 8, cat: 'HealthTech', stock: 'MediNearby', ticker: 'MDNB', title: 'MediNearby Scales to 556 Providers in 4 Cities', body: 'MediNearby achieves 14,500 monthly bookings with a 71 NPS, driven by its 8-language localized interface.', change: '+22% MoM' },
  { id: 9, cat: 'AgriFinTech', stock: 'KisanPay', ticker: 'KSPAY', title: 'KisanPay AUM Crosses ₹1.85 Cr with 96% Repayment', body: 'KisanPay achieves best-in-class 10.6x LTV/CAC using USSD technology to serve rural farmers excluded from traditional credit.', change: '+21% ARR' },
  { id: 10, cat: 'AgriFinTech', stock: 'CropPe', ticker: 'CRPP', title: 'CropPe Disrupts Agri-Credit with 17x Dealer LTV/CAC', body: 'CropPe scales its dealer-embedded BNPL model to 180 partners, achieving 96.8% repayment across a ₹7.4 Cr loan book.', change: '+21% ARR' },
];

export const RESEARCH_REPORTS = {
  xads: {
    name: 'Xads Pvt. Ltd.',
    ticker: 'XADS',
    logo: 'XDS',
    sector: 'AdTech / OOH',
    price: 80.00,
    ipoPrice: 80,
    mktCap: '₹8.0 Cr',
    tags: ['Pre-Revenue', 'AdTech', 'OOH Marketplace', ' Bengaluru Pilot', 'Asset-Light', 'AI-Powered'],
    metrics: [
      { label: 'TAM (2024)', value: '₹5,920 Cr', sub: 'India OOH market size' },
      { label: 'SOM (NEAR-TERM)', value: '₹500 Cr', sub: 'Initial obtainable market' },
      { label: 'Y1 REV TARGET', value: '₹59L', sub: 'Bengaluru pilot cluster' },
      { label: 'Y3 REV TARGET', value: '₹7.00 Cr', sub: 'Multi-city scale' },
      { label: 'TAKE-RATE', value: '8–12%', sub: 'Per campaign booked' },
      { label: 'OWNER SAAS', value: '₹10K–₹50K', sub: 'Per owner / month' },
      { label: 'OOH GROWTH \'26', value: '8.9%', sub: 'WPP Media forecast' },
      { label: 'INVENTORY CAPEX', value: 'Zero', sub: 'Pure asset-light model' }
    ],
    quantScore: {
      total: 62,
      grade: 'B-',
      subScores: {
        marketOpportunity: 86,
        productDifferentiation: 78,
        financialHealth: 22,
        revenueModel: 74,
        gtmClarity: 65,
        teamExecution: 28
      }
    },
    rating: {
      status: 'WATCH',
      conviction: 3.1,
      bull: 160,
      base: 75,
      bear: 30,
      targetRange: '₹55 – ₹130',
      summary: '"Xads is a high-beta play on offline media digitisation. While pre-revenue, its end-to-end workflow position and footfall intelligence layer create a structural moat over legacy aggregators. If the Bengaluru pilot proves the 8–12% take-rate at scale, the asset-light nature of the business ensures rapid margin expansion. Due diligence suggests monitoring campaign proof-of-performance data as the key rating catalyst."'
    },
    swot: {
      strengths: [
        'Unified discovery + execution layer — the "ideal sweet spot" quadrant',
        'Asset-light model: zero inventory capex, pure marketplace economics',
        'AI placement recommendations based on footfall & budget'
      ],
      weaknesses: [
        'Pre-revenue — no live campaigns or disclosed GMV yet',
        'Funding terms and runway entirely undisclosed',
        'Reliance on Bengaluru pilot success before national scale'
      ],
      opportunities: [
        'India OOH market growing at 8.9% in 2026 per WPP forecast',
        'SME segment — premium OOH previously inaccessible to small brands',
        'Footfall intelligence + satellite data creates defensible analytics moat'
      ],
      threats: [
        'Incumbents (Times OOH) could replicate marketplace features',
        'Media owner adoption inertia — informal networks are entrenched',
        'Well-funded competitors (The Media Ant) in discovery space'
      ]
    },
    uniquenessTitle: "WHAT MAKES XADS UNIQUE VS. THE MEDIA ANT / MYHOARDINGS",
    uniquenessProposition: "The Media Ant and MyHoardings solve discovery only. Xads is architected as the full workflow layer: search → AI recommendation → execution → real-time tracking → proof of display. This end-to-end position creates switching costs at every stage, converting offline media into a measurable channel.",
    financialSnapshot: [
      { label: 'Y1 Revenue Target', value: '₹59 Lakhs', color: 'black' },
      { label: 'Y3 Revenue Target', value: '₹7.00 Crore', color: '#15803d' },
      { label: 'Revenue Model', value: 'Take-rate + SaaS', color: 'black' },
      { label: 'Inventory Capex', value: 'Zero (Asset-Light)', color: '#15803d' },
      { label: 'Funding / Runway', value: 'Not Disclosed', color: '#c2410c' }
    ],
    riskRegister: [
      { name: 'Pre-revenue / no traction proof', level: 'HIGH' },
      { name: 'Team & execution visibility', level: 'HIGH' },
      { name: 'Media owner onboarding friction', level: 'MEDIUM' },
      { name: 'Funding / runway undisclosed', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'Anchor Owners', value: '15' },
      { label: 'Live Sites', value: '100' },
      { label: 'SOM Target', value: '₹500 Cr' },
      { label: 'SAM (India)', value: '₹3,283 Cr' },
      { label: 'Growth \'26', value: '8.9%' },
      { label: 'Capex', value: 'Zero' }
    ],
    projections: [
      { label: 'Pre-Rev', val1: 0, val2: 0 },
      { label: 'Year 1', val1: 8, val2: -6 },
      { label: 'Year 2', val1: 37, val2: -4 },
      { label: 'Year 3', val1: 100, val2: 20 },
    ],
    alert: { text: "Analysis based on pilot disclosure. Projections are based on current market velocity and verified traction data. Churn must be tracked quarterly." },
    graphImage: '/graphs/xads-revenue.png'
  },
  vnst: {
    name: 'VoltNest Energy Pvt. Ltd.',
    ticker: 'VNST',
    logo: 'VNT',
    sector: 'CleanTech / EV Charging',
    price: 218.00,
    ipoPrice: 218,
    mktCap: '₹21.8 Cr',
    tags: ['Revenue Generating', 'CleanTech', 'EV Infrastructure', '₹1.4 Cr ARR', '7-Month Runway', 'CapEx Intensive'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹1.41 Cr', sub: '+18% MoM growth' },
      { label: 'GROSS MARGIN', value: '54%', sub: 'Industry avg ~45-58%' },
      { label: 'STATION LTV/CAC', value: '11.4x', sub: 'Strong unit economics' },
      { label: 'BURN RATE', value: '₹19L/mo', sub: 'Runway: 7 months' },
      { label: 'UTILISATION', value: '61%', sub: 'Target: 70% by Q3' },
      { label: 'STATIONS', value: '62', sub: '8 cities, 3 states' },
      { label: 'FY30 TAM (EST)', value: '₹1.2L Cr', sub: 'Highway charging gap' },
      { label: 'INVENTORY CAPEX', value: '₹18L', sub: 'Per station hardware' }
    ],
    quantScore: {
      total: 72,
      grade: 'B+',
      subScores: {
        revenueGrowth: 80,
        teamStrength: 85,
        financialHealth: 44,
        unitEconomics: 82,
        marketSize: 92,
        productMoat: 70
      }
    },
    rating: {
      status: 'BUY',
      conviction: 4.0,
      bull: 340,
      base: 200,
      bear: 105,
      targetRange: '₹160 – ₹290',
      summary: '"VoltNest is among the most capital-efficient EV infrastructure plays at seed stage. Its hub-and-spoke network in Tier-1 corridors creates a network moat difficult to replicate. The 61% utilisation rate — well above industry average — validates the site-selection AI."'
    },
    swot: {
      strengths: [
        "11.4x Station LTV/CAC — capital-efficient rollout",
        "Proprietary SiteIQ AI predicts utilisation within ±4%",
        "61% utilisation rate vs. 45% industry average"
      ],
      weaknesses: [
        "High CapEx per station (₹14–18L) constrains speed",
        "DISCOM delays add 4–8 weeks per new site",
        "Hardware sourced from single OEM"
      ],
      opportunities: [
        "India Highway charging corridors — ₹1.2L Cr infra gap",
        "FAME-III draft policy likely doubles per-station subsidy",
        "Fleet electrification mandates for logistics from 2026"
      ],
      threats: [
        "Tata Power EV deploying subsidised national network",
        "Battery-swap tech could disrupt DC fast-charging model",
        "DISCOM tariff hikes could compress per-kWh margins"
      ]
    },
    uniquenessTitle: "WHAT MAKES VOLTNEST UNIQUE VS. CROPPE (CRPP)",
    uniquenessProposition: "VoltNest is an infrastructure business, not credit. Revenues are session-volume-driven and risk is CapEx-timing, not NPA risk. Site Selection AI creates a data moat in high-growth highway corridors.",
    financialSnapshot: [
      { label: 'ARR', value: '₹1.41 Crore', color: 'black' },
      { label: 'Gross Margin', value: '54%', color: '#0369a1' },
      { label: 'FY24 Net Loss', value: '₹(1.12 Cr)', color: '#ef4444' },
      { label: 'Current Cash', value: '₹1.33 Crore', color: '#c2410c' },
      { label: 'Funding Ask', value: '₹3 Crore (13.8%)', color: 'black' }
    ],
    riskRegister: [
      { name: 'CapEx intensity (funding delay)', level: 'HIGH' },
      { name: 'Grid connectivity (DISCOM delays)', level: 'HIGH' },
      { name: 'Subsidy policy change (FAME-III)', level: 'MEDIUM' },
      { name: 'Hardware OEM concentration', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'Stations', value: '62' },
      { label: 'Sessions', value: '28K' },
      { label: 'Utilisation', value: '61%' },
      { label: 'ARR', value: '₹1.41 Cr' },
      { label: 'Growth', value: '+18%' },
      { label: 'CapEx/St.', value: '₹18L' }
    ],
    projections: [
      { label: 'Y1', val1: 42, val2: -12 },
      { label: 'Y2', val1: 180, val2: 14 },
      { label: 'Y3', val1: 450, val2: 62 },
      { label: 'Y4', val1: 1200, val2: 210 },
    ],
    alert: { text: "Expansion to 14 pre-leased sites requires ₹2.2 Cr. Delay in raise beyond Q2 FY26 risks losing site leases in Pune & Hyderabad. Monitor fundraise timeline." },
    graphImage: '/graphs/vnst-revenue.png'
  },
  sklbr: {
    name: 'SkillBridge EdTech Pvt. Ltd.',
    ticker: 'SKLBR',
    logo: 'SKB',
    sector: 'Vocational EdTech',
    price: 95.00,
    ipoPrice: 95,
    mktCap: '₹9.5 Cr',
    tags: ['Early Revenue', 'EdTech / SkillTech', 'Placement-Linked', '₹58.8L ARR', '82% Placement', 'NSDC Partner'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹58.8L', sub: '+17% MoM growth' },
      { label: 'LTV / CAC', value: '8.2x', sub: '₹6,150 LTV / ₹750 CAC' },
      { label: 'PLACEMENT RATE', value: '82%', sub: 'Within 90 days' },
      { label: 'ACTIVE LEARNERS', value: '3,850', sub: '6 trade verticals' },
      { label: 'GROSS MARGIN', value: '54%', sub: 'Blended revenue' },
      { label: 'COMPLETION', value: '71%', sub: 'Below 80% target' },
      { label: 'EMPLOYER PARTNERS', value: '148', sub: 'Zomato, Lenskart' },
      { label: 'MKT (VOCATIONAL)', value: '₹12K Cr', sub: 'Govt. PMKVY allocation' }
    ],
    quantScore: {
      total: 72,
      grade: 'B+',
      subScores: {
        unitEconomics: 82,
        revenueGrowth: 79,
        teamStrength: 85,
        marketSize: 91,
        financialHealth: 48,
        productMoat: 44
      }
    },
    rating: {
      status: 'BUY',
      conviction: 3.8,
      bull: 165,
      base: 108,
      bear: 42,
      targetRange: '₹75 – ₹145',
      summary: '"SkillBridge has cracked a structural problem — India\'s 12 million ITI graduates remain largely unplaced due to the trust gap. Their ISA (Income Share Agreement) model aligns incentives powerfully. An 82% placement rate is best-in-cohort for seed-stage vocational EdTech."'
    },
    swot: {
      strengths: [
        "82% placement rate within 90 days (top quartile)",
        "ISA model aligns learner & platform incentives",
        "148 employer partners across 9 sectors"
      ],
      weaknesses: [
        "Course completion at 71% — below 80% threshold",
        "Single city dominance (Gurugram) execution",
        "Pre-profitability: ₹52.4L net loss in FY24"
      ],
      opportunities: [
        "India's 500M+ workforce — 5% formally certified",
        "PMKVY 4.0 government allocation — ₹12,000 Cr",
        "Employer SaaS ATS module — 3x ARPU uplift"
      ],
      threats: [
        "EdTech trust deficit post-BYJU's situation",
        "Coursera/LinkedIn entering vocational market",
        "Economic slowdown affecting hiring and ISAs"
      ]
    },
    uniquenessTitle: "WHAT MAKES SKILLBRIDGE UNIQUE",
    uniquenessProposition: "SkillBridge is a hiring platform masquerading as an EdTech. Their profit center isn't selling a course, but the successful placement and subsequent ISA collection. This shifts risk from student to platform, creating an enrollment flywheel legacy players cannot imitate.",
    financialSnapshot: [
      { label: 'ARR', value: '₹58.8 Lakhs', color: 'black' },
      { label: 'Gross Margin', value: '54%', color: '#10b981' },
      { label: 'ISA Receivables', value: '₹38.2L', color: '#f59e0b' },
      { label: 'FY24 Net Loss', value: '₹(52.4L)', color: '#ef4444' },
      { label: 'Funding Ask', value: '₹1.50 Cr (15.8%)', color: 'black' }
    ],
    riskRegister: [
      { name: 'ISA recovery risk (job loss / default)', level: 'HIGH' },
      { name: 'Completion rate below target', level: 'MEDIUM' },
      { name: 'BYJU\'s perception hangover', level: 'MEDIUM' },
      { name: 'Key-person (CEO) risk', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'Learners', value: '3,850' },
      { label: 'Placed', value: '82%' },
      { label: 'Employers', value: '148' },
      { label: 'ARR', value: '₹58.8L' },
      { label: 'Verticals', value: '6' },
      { label: 'Mom Growth', value: '+17%' }
    ],
    projections: [
      { label: 'Y1', val1: 18, val2: -10 },
      { label: 'Y2', val1: 72, val2: -2 },
      { label: 'Y3', val1: 210, val2: 45 },
      { label: 'Y4', val1: 580, val2: 124 },
    ],
    alert: { text: "₹38.2L in ISA receivables are contingent on placed learners retaining employment for 12+ months. Monitor Q2 FY26 churn data closely." },
    graphImage: null
  },
  prspr: {
    name: 'Paraspar',
    ticker: 'PRSPR',
    logo: 'PAR',
    sector: 'Social-Tech / Matchmaking',
    price: 499.00,
    ipoPrice: 499,
    mktCap: '₹12.5 Cr',
    tags: ['Matchmaking', 'Freemium Model', 'Behavioral Analytics', 'Psychological Mapping'],
    metrics: [
      { label: 'TAM (2030)', value: '₹13,000 Cr', sub: 'India Matchmaking market' },
      { label: 'SOM (NEAR-TERM)', value: '₹250 Cr', sub: 'Urban higher-intent SOM' },
      { label: 'MATCH REVENUE', value: '₹499–₹999', sub: 'Hybrid sub pricing' },
      { label: 'OFFLINE MKT %', value: '70% Sh.', sub: 'Legacy dominance' },
      { label: 'DIVORCE RATE', value: '+350%', sub: 'Last 2 decades (India)' },
      { label: 'USER ACQ. CAC', value: '₹850', sub: 'High urban niche cost' },
      { label: 'FREEMIUM CONV.', value: '18%', sub: 'Target conversion' },
      { label: 'APP PHASE', value: 'Build v2', sub: 'Active R&D stage' }
    ],
    quantScore: {
      total: 65,
      grade: 'B',
      subScores: {
        unitEconomics: 68,
        revenueGrowth: 72,
        teamStrength: 88,
        marketSize: 82,
        financialHealth: 35,
        productMoat: 74
      }
    },
    rating: {
      status: 'WATCH',
      conviction: 3.4,
      bull: 1950,
      base: 650,
      bear: 280,
      targetRange: '₹350 – ₹1,200',
      summary: '"Paraspar solves for \'intent\' rather than \'availability\'. Ground-floor opportunity in a high-CAGR sector. By focusing on multi-dimensional compatibility and LinkedIn-led professional verification, it addresses the massive trust gap in digital matchmaking. Execution risk is highlighted by early R&D stage, but the team profile (Microsoft/Magenes) is professional-grade."'
    },
    swot: {
      strengths: [
        "Multi-dimensional compatibility logic",
        "LinkedIn professional verification intake",
        "High-conversion targeted freemium model"
      ],
      weaknesses: [
        "Early R&D execution focus",
        "Complex user intake friction",
        "High urban niche acquisition costs"
      ],
      opportunities: [
        "₹6,500 Cr online matchmaking market",
        "Pre-marital counseling expansion vertical",
        "Partnerships with medical/diagnostic labs"
      ],
      threats: [
        "Legacy offline dominance (70% market share)",
        "Social apps adding verification layers",
        "Data storage/privacy regulatory noise"
      ]
    },
    uniquenessTitle: "WHAT MAKES PARASPAR UNIQUE",
    uniquenessProposition: "PRSPR solves for 'intent' rather than 'availability'. By integrating psychological mapping and LinkedIn verification at intake, it reduces bad matches by 60% (est.), creating a high-trust moat established giants cannot replicate.",
    financialSnapshot: [
      { label: 'Sub Price (Entry)', value: '₹499', color: '#0F766E' },
      { label: 'Premium Anchors', value: 'Up to ₹1.0L', color: '#10b981' },
      { label: 'TAM (Matchmaking)', value: '₹6,500 Cr', color: 'black' },
      { label: 'Funding Ask', value: '₹1.25 Cr (10%)', color: 'black' },
      { label: 'Valuation', value: '₹12.5 Crore', color: 'black' }
    ],
    riskRegister: [
      { name: 'Data Privacy (Medical/Psych)', level: 'HIGH' },
      { name: 'Market Adoption Risk', level: 'MEDIUM' },
      { name: 'Offline scalability friction', level: 'MEDIUM' },
      { name: 'Execution (App Build 2)', level: 'LOW' }
    ],
    milestones: [
      { label: 'TAM', value: '₹13k Cr' },
      { label: 'Divorce Chg', value: '+350%' },
      { label: 'Target Age', value: '21-32+' },
      { label: 'Sector CAGR', value: '10%' },
      { label: 'Offline Sh.', value: '70%' },
      { label: 'App Phase', value: 'Build v2' }
    ],
    projections: [
      { label: 'Y1', val1: 0, val2: -15 },
      { label: 'Y2', val1: 15, val2: -8 },
      { label: 'Y3', val1: 210, val2: 12 },
      { label: 'Y4', val1: 850, val2: 140 },
    ],
    alert: { text: "Analysis based on internal pitch deck. Clarity Before Commitment. High Priority: Data Privacy (Medical/Psych). Verify App Phase 2 rollout timeline." },
    graphImage: null
  },
  nrtk: {
    name: 'NuroTrack Health',
    ticker: 'NRTK',
    logo: 'NRT',
    sector: 'HealthTech / RPM',
    price: 210.00,
    ipoPrice: 210,
    mktCap: '₹21.0 Cr',
    tags: ['Recurring Revenue', 'HealthTech / RPM', '₹1.4 Cr ARR', '8-Month Runway', 'DISHA Compliant'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹1.42 Cr', sub: '+34% MoM growth' },
      { label: 'ADHERENCE', value: '89.3%', sub: 'Industry avg ~62%' },
      { label: 'LTV / CAC', value: '11.8x', sub: 'Strong B2B leverage' },
      { label: 'GROSS MARGIN', value: '72%', sub: 'Above category avg' },
      { label: 'BURN RATE', value: '₹19L/mo', sub: 'Runway: 8 months' },
      { label: 'PATIENTS', value: '11,400', sub: 'Monitored monthly' },
      { label: 'HOSPITALS', value: '38', sub: '7 cities, 3 states' },
      { label: 'DEVICES', value: '14,300', sub: 'Tier-1/2 clinic load' }
    ],
    quantScore: {
      total: 73,
      grade: 'B+',
      subScores: {
        revenueGrowth: 91,
        unitEconomics: 85,
        teamStrength: 88,
        marketSize: 92,
        financialHealth: 44,
        regulatoryMoat: 52
      }
    },
    rating: {
      status: 'BUY',
      conviction: 4.1,
      bull: 340,
      base: 195,
      bear: 95,
      targetRange: '₹165 – ₹290',
      summary: '"NuroTrack is building the chronic care OS for India. Proprietary hardware moat + categorical adherence at 89.3% makes this high conviction. ABHA integration tailwinds provide a significant regulatory moat in Tier-2/3 expansion."'
    },
    swot: {
      strengths: [
        "89.3% adherence (category defining)",
        "NuroSense hardware + AI stack integration",
        "72% high gross margin subscription model"
      ],
      weaknesses: [
        "CE-Mark timeline binary risk for ASEAN",
        "Hardware COGS sensor price volatility",
        "Long hospital procurement sales cycles"
      ],
      opportunities: [
        "Chronic disease burden in India (101M+)",
        "ABDM/ABHA health account integration",
        "Tier-2/3 expansion (8,000 potential sites)"
      ],
      threats: [
        "Big-tech (Apple/Samsung) entering RPM space",
        "DISHA compliance costs and data laws",
        "CDSCO device re-classification risk"
      ]
    },
    uniquenessTitle: "WHAT MAKES NUROTRACK UNIQUE",
    uniquenessProposition: "NuroTrack is hardware + SaaS, not credit. Subscription recurring with hospital lock-in. 89.3% adherence vs 62% industry average creates a structural advantage for Tier 1/2 clinics, converting patient management into an annuity stream for providers.",
    financialSnapshot: [
      { label: 'ARR', value: '₹1.42 Crore', color: 'black' },
      { label: 'Gross Margin', value: '72%', color: '#1D4ED8' },
      { label: 'Devices Deployed', value: '14,300 units', color: 'black' },
      { label: 'Current Cash', value: '₹1.52 Crore', color: '#B45309' },
      { label: 'Funding Ask', value: '₹3 Crore (14.3%)', color: 'black' }
    ],
    riskRegister: [
      { name: 'CE-Mark / CDSCO delay', level: 'HIGH' },
      { name: 'Hardware supply chain', level: 'MEDIUM' },
      { name: 'Hospital procurement cycles', level: 'MEDIUM' },
      { name: 'Data privacy compliance', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'ARR', value: '₹1.42Cr' },
      { label: 'Patients', value: '11.4K' },
      { label: 'Adherence', value: '89%' },
      { label: 'Hospitals', value: '38' },
      { label: 'Devices', value: '14.3K' },
      { label: 'Mom Growth', value: '+34%' }
    ],
    projections: [
      { label: 'Y1', val1: 142, val2: -112 },
      { label: 'Y2', val1: 420, val2: -40 },
      { label: 'Y3', val1: 1200, val2: 240 },
      { label: 'Y4', val1: 2800, val2: 720 },
    ],
    alert: { text: "CE-Mark decision expected Q3 2025. Any delay pushes export revenue to FY27. Monitor Class B status and Class III DISHA compliance closely." },
    graphImage: null
  },
  nriq: {
    name: 'NeuronIQ',
    ticker: 'NRIQ',
    logo: 'NRQ',
    sector: 'EdTech / AI-Personalized Learning',
    price: 118.00,
    ipoPrice: 118,
    mktCap: '₹11.8 Cr',
    tags: ['SaaS / Recurring', 'EdTech / AI', '₹1.1 Cr ARR', '7-Month Runway', 'NPS: 68'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹1.08 Cr', sub: '+17% MoM growth' },
      { label: 'GROSS MARGIN', value: '74%', sub: 'Above category avg' },
      { label: 'LTV / CAC', value: '9.25x', sub: 'B2B: 14.2x' },
      { label: 'BURN RATE', value: '₹11.4L/mo', sub: 'Runway: 7 months' },
      { label: 'SCHOOLS', value: '62', sub: '3 states, CBSE/ICSE' },
      { label: 'RETENTION', value: '84% D30', sub: 'Learner stickiness' },
      { label: 'B2C CHURN', value: '4.1%', sub: 'Monthly benchmark' },
      { label: 'MKT CAP', value: '₹11.8 Cr', sub: 'Seed level valuation' }
    ],
    quantScore: {
      total: 74,
      grade: 'B+',
      subScores: {
        revenueGrowth: 79,
        unitEconomics: 86,
        teamStrength: 82,
        marketSize: 91,
        financialHealth: 44,
        productMoat: 76
      }
    },
    rating: {
      status: 'BUY',
      conviction: 4.1,
      bull: 230,
      base: 115,
      bear: 55,
      targetRange: '₹95 – ₹190',
      summary: '"NeuronIQ fits the AI adoption trend with high stickiness in B2B school channels. The 74% gross margin and B2B LTV/CAC of 14.2x provides superior unit economics compared to legacy EdTechs. Core risk remains churn and school procurement cycles."'
    },
    swot: {
      strengths: [
        "NeuronPath adaptive AI engine",
        "74% rare gross margin for seed EdTech",
        "Annuity-like B2B school contracts"
      ],
      weaknesses: [
        "Rising B2C CAC (+38%) recently",
        "Founder-led sales (scaling execution risk)",
        "CBSE/ICSE library limit constraints"
      ],
      opportunities: [
        "1.5M+ private school headroom in India",
        "NEP 2020 personalized learning mandate",
        "SEA/Middle East international expansion"
      ],
      threats: [
        "Big EdTech incumbents pivoting to AI",
        "Free AI tutoring tools (ChatGPT/etc)",
        "Q1 school budget cycle seasonality"
      ]
    },
    uniquenessTitle: "WHAT MAKES NEURONIQ UNIQUE",
    uniquenessProposition: "NeuronIQ is SaaS, not credit. 74% gross margin and B2B LTV/CAC of 14.2x provides superior unit economics. Defensible knowledge-graph moat allows real-time curriculum adaptation using knowledge-graph mapping.",
    financialSnapshot: [
      { label: 'Monthly Revenue', value: '₹9.0 Lakhs', color: 'black' },
      { label: 'ARR', value: '₹1.08 Crore', color: 'black' },
      { label: 'Gross Margin', value: '74%', color: '#2563EB' },
      { label: 'FY24 Net Loss', value: '₹(78.2L)', color: '#DC2626' },
      { label: 'Funding Ask', value: '₹1.8 Crore (15.3%)', color: 'black' }
    ],
    riskRegister: [
      { name: 'Burn rate / cash runway', level: 'MEDIUM' },
      { name: 'Incumbent competition', level: 'HIGH' },
      { name: 'School budget cycles', level: 'MEDIUM' },
      { name: 'AI model cost scaling', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'ARR', value: '₹1.08Cr' },
      { label: 'Learners', value: '18.4K' },
      { label: 'Retention', value: '84%' },
      { label: 'Schools', value: '62' },
      { label: 'Rating', value: '4.8★' },
      { label: 'Mom Growth', value: '+17%' }
    ],
    projections: [
      { label: 'Y1', val1: 108, val2: -78 },
      { label: 'Y2', val1: 280, val2: -24 },
      { label: 'Y3', val1: 650, val2: 110 },
      { label: 'Y4', val1: 1450, val2: 320 },
    ],
    alert: { text: "7 months cash remaining. B2C CAC rose 38%; funding close critical before Q3 expansion. Monitor AI inference cost scaling metrics." },
    graphImage: null
  },
  mdnb: {
    name: 'MediNearby Technologies',
    ticker: 'MDNB',
    logo: 'MED',
    sector: 'HealthTech / Health-O2O',
    price: 150.00,
    ipoPrice: 150,
    mktCap: '₹15.0 Cr',
    tags: ['HealthTech', 'Clinic SaaS', '₹94L ARR', '8-Month Runway', 'ABHA Integrated'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹93.6L', sub: '+22% MoM growth' },
      { label: 'GROSS MARGIN', value: '68%', sub: 'Above industry avg' },
      { label: 'LTV / CAC', value: '8.4x', sub: 'Strong unit economics' },
      { label: 'BURN RATE', value: '₹11.2L/mo', sub: 'Runway: 8 months' },
      { label: 'PROVIDERS', value: '556', sub: '538 clinics + 18 labs' },
      { label: 'BOOKINGS', value: '14,500', sub: 'Monthly volume' },
      { label: 'NPS', value: '71', sub: 'Platform Score' },
      { label: 'MKT CAP', value: '₹15.0 Cr', sub: 'Institutional valuation' }
    ],
    quantScore: {
      total: 68,
      grade: 'B',
      subScores: {
        revenueGrowth: 85,
        unitEconomics: 78,
        marketSize: 90,
        teamStrength: 74,
        financialHealth: 45,
        regulatoryMoat: 55
      }
    },
    rating: {
      status: 'BUY',
      conviction: 4.0,
      bull: 220,
      base: 160,
      bear: 85,
      targetRange: '₹110 – ₹185',
      summary: '"Hyperlocal Health-O2O solving accessibility in Tier 2/3 cities. MediNearby achieves best-in-class rural penetration with its 8-language localized interface. ABHA government tailwind and high NPS (71) indicate strong product-market fit for expansion into primary care corridors."'
    },
    swot: {
      strengths: [
        "Localized 8-language rural-first UI",
        "ABHA ID government integration winner",
        "High NPS (71) for health bookings"
      ],
      weaknesses: [
        "8-month cash (urgent expansion raise)",
        "CTO key-person risk (FHIR scaling)",
        "Slow city turnaround (3-4 mo to parity)"
      ],
      opportunities: [
        "9L+ private clinic digital gap in India",
        "TPA insurance network distribution",
        "MediNearby+ pharmacy subscription layer"
      ],
      threats: [
        "Practo / 1mg Tier-2 market entry",
        "NMC Bill tightened compliance rules",
        "TPA integration operational delays"
      ]
    },
    uniquenessTitle: "WHAT MAKES MEDINEARBY UNIQUE",
    uniquenessProposition: "8-language localized interface (Haryanvi/Maithili) solves the trust gap Big-Tech cannot bridge in rural districts. ABHA-integrated with an 8-language interface for rural penetration, converting patient management into a data-driven channel for neglected regions.",
    financialSnapshot: [
      { label: 'Monthly Revenue', value: '₹7.8 Lakhs', color: 'black' },
      { label: 'ARR', value: '₹93.6 Lakhs', color: 'black' },
      { label: 'Gross Margin', value: '68%', color: '#16A34A' },
      { label: 'Current Cash', value: '₹27.2 Lakhs', color: '#D97706' },
      { label: 'Valuation', value: '₹15 Crore', color: 'black' }
    ],
    riskRegister: [
      { name: 'City expansion execution', level: 'HIGH' },
      { name: 'Clinic churn risk', level: 'MEDIUM' },
      { name: 'Patient data security', level: 'MEDIUM' },
      { name: 'Long hospital sales cycle', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'Providers', value: '556' },
      { label: 'Patients', value: '1.12L' },
      { label: 'Bookings', value: '14.5K' },
      { label: 'Cities', value: '4' },
      { label: 'NPS', value: '71' },
      { label: 'Growth', value: '+22%' }
    ],
    projections: [
      { label: 'Y1', val1: 94, val2: -65 },
      { label: 'Y2', val1: 280, val2: -12 },
      { label: 'Y3', val1: 720, val2: 84 },
      { label: 'Y4', val1: 1800, val2: 410 },
    ],
    alert: { text: "8 months runway. Raise essential for city expansion. Catalyst: TPA tie-up in Q2 expected to double booking volume." },
    graphImage: null
  },
  kspay: {
    name: 'KisanPay Fintech',
    ticker: 'KSPAY',
    logo: 'KSP',
    sector: 'AgriFinTech / Micro-Lending',
    price: 120.00,
    ipoPrice: 120,
    mktCap: '₹12.0 Cr',
    tags: ['AgriFinTech', 'Micro-Lending', '₹74L ARR', 'USSD Tech', '96% Repayment'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹74.4L', sub: '+21% MoM growth' },
      { label: 'AUM (VERIFIED)', value: '₹1.85 Cr', sub: 'Institutional book' },
      { label: 'GROSS MARGIN', value: '61%', sub: 'Spread + Commission' },
      { label: 'LTV / CAC', value: '10.6x', sub: 'Strong rural economics' },
      { label: 'NPA RATE', value: '3.8%', sub: 'Revised from 2.1%' },
      { label: 'REPAYMENT', value: '96.2%', sub: 'On-time FPO collection' },
      { label: 'FARMERS', value: '2,200', sub: 'Target: 5,000 by Q4' },
      { label: 'MITRAS', value: '420', sub: 'Village agent network' }
    ],
    quantScore: {
      total: 68,
      grade: 'B',
      subScores: {
        unitEconomics: 91,
        revenueGrowth: 84,
        teamStrength: 80,
        marketSize: 88,
        financialHealth: 30,
        regulatorySafety: 28
      }
    },
    rating: {
      status: 'ACCUMULATE',
      conviction: 3.5,
      bull: 185,
      base: 128,
      bear: 55,
      targetRange: '₹85 – ₹160',
      summary: '"Best-in-class unit economics serving the 40% of smallholders excluded from formal credit. KisanPay technology moat (USSD + Satellite) allows operation where Big-Banks fail. Regulatory overhang regarding direct NBFC license is the key watch item."'
    },
    swot: {
      strengths: [
        "10.6x LTV/CAC rural economics",
        "USSD technology (0 smartphone dep.)",
        "Patented Agri-CIBIL underwriting score"
      ],
      weaknesses: [
        "NPA of 3.8% (above internal target)",
        "Utkarsh SFB partner concentration",
        "Monsoon collection seasonal friction"
      ],
      opportunities: [
        "38 million target farmer private headroom",
        "ISRO-NABARD satellite data integration",
        "Multi-peril index insurance vertical"
      ],
      threats: [
        "RBI LSP license disclosure requirement",
        "Extended drought cycle NPA spikes",
        "State government agri-loan waivers"
      ]
    },
    uniquenessTitle: "WHAT MAKES KISANPAY UNIQUE",
    uniquenessProposition: "Serves the 40% of smallholders excluded from formal credit. Satellite data + USSD 0 smartphone dependency creates a high-barrier operational moat, converting rural credit into a data-driven institutional asset class.",
    financialSnapshot: [
      { label: 'ARR', value: '₹74.4 Lakhs', color: 'black' },
      { label: 'AUM', value: '₹1.85 Crore', color: 'black' },
      { label: 'Gross Margin', value: '61%', color: '#16A34A' },
      { label: 'NPA Rate', value: '3.8%', color: '#D97706' },
      { label: 'Funding Ask', value: '₹1.75 Cr (14%)', color: 'black' }
    ],
    riskRegister: [
      { name: 'RBI Regulatory Risk', level: 'HIGH' },
      { name: 'Monsoon / NPA spike', level: 'HIGH' },
      { name: 'Single NBFC dependency', level: 'MEDIUM' },
      { name: 'Key-person risk', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'Farmers', value: '2,200' },
      { label: 'AUM', value: '₹1.85Cr' },
      { label: 'Repayment', value: '96.2%' },
      { label: 'Mitras', value: '420' },
      { label: 'Policies', value: '1,840' },
      { label: 'Growth', value: '+21%' }
    ],
    projections: [
      { label: 'Y1', val1: 74, val2: -32 },
      { label: 'Y2', val1: 240, val2: 18 },
      { label: 'Y3', val1: 680, val2: 140 },
      { label: 'Y4', val1: 2100, val2: 580 },
    ],
    alert: { text: "RBI LSP disclosure regarding direct NBFC license. NPA revised 2.1% → 3.8% due to localized drought in Karnataka clusters. Monitor Q3 collections closely." },
    graphImage: null
  },
  crpp: {
    name: 'CropPe Technologies',
    ticker: 'CRPP',
    logo: 'CRP',
    sector: 'AgriFinTech / Embedded Credit',
    price: 133.00,
    ipoPrice: 133,
    mktCap: '₹13.3 Cr',
    tags: ['AgriFinTech', 'Embedded Credit', '₹87L ARR', '5-Month Runway', 'NBFC-Backed'],
    metrics: [
      { label: 'ARR (LIVE)', value: '₹86.4L', sub: '+21% MoM growth' },
      { label: 'GROSS MARGIN', value: '68%', sub: 'Above industry avg' },
      { label: 'DEALER LTV/CAC', value: '17.1x', sub: 'Outstanding leverage' },
      { label: 'BURN RATE', value: '₹16L/mo', sub: 'Runway: 5 months' },
      { label: 'REPAYMENT', value: '96.8%', sub: 'NPA: 3.2% (revised)' },
      { label: 'LOAN BOOK', value: '₹7.4Cr', sub: 'Total Disbursed' },
      { label: 'DEALERS', value: '180', sub: 'Embedded B2B network' },
      { label: 'TAM (AGRI-CREDIT)', value: '₹8.4L Cr', sub: 'Unorganized segment' }
    ],
    quantScore: {
      total: 67,
      grade: 'B',
      subScores: {
        revenueGrowth: 84,
        unitEconomics: 90,
        teamStrength: 80,
        marketSize: 88,
        financialHealth: 28,
        productMoat: 58
      }
    },
    rating: {
      status: 'BUY',
      conviction: 3.8,
      bull: 210,
      base: 125,
      bear: 60,
      targetRange: '₹85 – ₹175',
      summary: '"High defensible moat in dealer-embedded credit for ag-retail. CropPe achieves a category-defining 17.1x Dealer LTV/CAC. Financial runway (5 months) is the swing factor. Institutional interest is strong on successful Artha Finance debt tie-up."'
    },
    swot: {
      strengths: [
        "17.1x Dealer LTV/CAC unit economics",
        "Dealer-embedded BNPL first-mover moat",
        "96.8% high repayment credit track"
      ],
      weaknesses: [
        "Existential 5-month cash runway",
        "NPA revised upward (3.2%) recently",
        "Artha Finance NBFC partner dependency"
      ],
      opportunities: [
        "1.8L target agri-dealer headroom",
        "Embedded agri-insurance distribution",
        "ONDC credit rail tailwinds"
      ],
      threats: [
        "Consecutive drought cycle NPAs",
        "RBI guideline tightening on FLDG",
        "Scheduled bank competing products"
      ]
    },
    uniquenessTitle: "WHAT MAKES CROPPE UNIQUE",
    uniquenessProposition: "Dealer-embedded credit business with 17.1x LTV/CAC. Technology moat in underwriting allows for rapid expansion into rural credit where Big-Tech cannot bridge the trust gap in dealer relationships.",
    financialSnapshot: [
      { label: 'ARR', value: '₹86.4 Lakhs', color: 'black' },
      { label: 'Gross Margin', value: '68%', color: '#2D6A4F' },
      { label: 'Loans Disbursed', value: '₹7.4 Crore', color: 'black' },
      { label: 'Current Cash', value: '₹9.2 Lakhs', color: '#DC2626' },
      { label: 'Funding Ask', value: '₹2 Crore (15%)', color: 'black' }
    ],
    riskRegister: [
      { name: 'Cash runway (5 months)', level: 'HIGH' },
      { name: 'NPA / credit risk', level: 'HIGH' },
      { name: 'NBFC partner dependency', level: 'MEDIUM' },
      { name: 'Climate / crop failure', level: 'MEDIUM' }
    ],
    milestones: [
      { label: 'ARR', value: '₹87L' },
      { label: 'Farmers', value: '4,200' },
      { label: 'Repayment', value: '96.8%' },
      { label: 'Dealers', value: '180' },
      { label: 'Loan Book', value: '₹7.4Cr' },
      { label: 'Mom Growth', value: '+21%' }
    ],
    projections: [
      { label: 'Y1', val1: 87, val2: -42 },
      { label: 'Y2', val1: 280, val2: 24 },
      { label: 'Y3', val1: 850, val2: 180 },
      { label: 'Y4', val1: 2400, val2: 680 },
    ],
    alert: { text: "Dual Risk Alert: 5 months cash remaining. NPA revised 1.8% → 3.2% due to dealer-level churn in Maharashtra cluster. Raise essential for FY26 growth." },
    graphImage: null
  }
};

export const IPO_DATA = {
  current: [
    { name: 'Xads Pvt. Ltd.', priceRange: '80' },
    { name: 'VoltNest Energy Pvt. Ltd.', priceRange: '218' },
    { name: 'SkillBridge EdTech Pvt. Ltd.', priceRange: '95' },
    { name: 'Paraspar', priceRange: '499' },
    { name: 'NuroTrack Health', priceRange: '210' },
    { name: 'NeuronIQ', priceRange: '118' },
    { name: 'MediNearby Technologies', priceRange: '150' },
    { name: 'KisanPay Fintech', priceRange: '120' },
    { name: 'CropPe Technologies', priceRange: '133' }
  ].map(d => ({ ...d, date: 'Live Now', minInv: '₹' + d.priceRange, minQty: '1', status: 'current' })),
  closed: [],
  listed: []
};
