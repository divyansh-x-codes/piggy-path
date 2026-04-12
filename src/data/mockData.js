export const STOCKS = [
  { id: 'msft', name: 'Microsoft', ticker: 'MSFT', logo: 'MS', color: '#7C3AED', sector: 'IT', desc: 'Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington.', basePrice: 420, change: 2.5, volume: '9.45L', avgPrice: 418.50, pe: 32.4, eps: 13.0, mktCap: '3.1T' },
  { id: 'aapl', name: 'Apple Inc', ticker: 'AAPL', logo: '🍎', color: '#111', sector: 'IT', desc: 'Apple Inc. is an American multinational technology company headquartered in Cupertino, California.', basePrice: 198, change: -1.2, volume: '12.3L', avgPrice: 195.00, pe: 29.1, eps: 6.8, mktCap: '3.0T' },
  { id: 'reliance', name: 'Reliance', ticker: 'RIL', logo: 'R', color: '#1d4ed8', sector: 'Energy', desc: 'Reliance Industries Limited is an Indian multinational conglomerate company, headquartered in Mumbai.', basePrice: 2890, change: 1.8, volume: '5.2L', avgPrice: 2870, pe: 24.6, eps: 117.5, mktCap: '19.5L Cr' },
  { id: 'tcs', name: 'TCS', ticker: 'TCS', logo: 'TC', color: '#0ea5e9', sector: 'IT', desc: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai.', basePrice: 3520, change: 0.9, volume: '3.1L', avgPrice: 3490, pe: 28.3, eps: 124.4, mktCap: '12.8L Cr' },
  { id: 'infosys', name: 'Infosys', ticker: 'INFY', logo: 'IN', color: '#059669', sector: 'IT', desc: 'Infosys Limited is an Indian multinational information technology company.', basePrice: 1680, change: -0.6, volume: '8.7L', avgPrice: 1700, pe: 22.1, eps: 76.0, mktCap: '7.0L Cr' },
  { id: 'hdfc', name: 'HDFC Bank', ticker: 'HDFC', logo: 'HD', color: '#dc2626', sector: 'Finance', desc: 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai.', basePrice: 1620, change: 1.1, volume: '6.9L', avgPrice: 1600, pe: 18.5, eps: 87.6, mktCap: '12.3L Cr' },
];

export const NEWS = [
  { cat: 'Trending', stock: 'Microsoft', ticker: 'MSFT', title: 'Why We Should Buy Microsoft Now', body: 'Analysts bullish on Microsoft Azure cloud business amid strong Q4 earnings. The company reported record revenue growth driven by AI services.', change: '+2.5%' },
  { cat: 'IT News', stock: 'TCS', ticker: 'TCS', title: 'TCS Wins $500M Deal in Europe', body: 'TCS secured a major multi-year contract to modernize banking infrastructure for a leading European financial institution.', change: '+1.9%' },
  { cat: 'Healthcare', stock: 'Infosys', ticker: 'INFY', title: 'Infosys Partners with NHS for Digital Transformation', body: 'Infosys announced a strategic partnership with UK\'s National Health Service to accelerate digital transformation across hospitals.', change: '-0.5%' },
  { cat: 'Gov News', stock: 'Reliance', ticker: 'RIL', title: 'Government Boosts Renewable Energy Policy', body: 'New government policy on green hydrogen production expected to benefit Reliance Industries significantly as it expands in clean energy.', change: '+3.2%' },
];

export const IPO_DATA = {
  current: [{ name: 'Megasoft - Pan HR Solution Ltd', date: 'Day 3 - 3:33pm', priceRange: '111-117', minInv: '1,40,400', minQty: '1200', status: 'current' }],
  closed: [{ name: 'Bapplee Technologies Ltd', date: 'Day 5 - 5:00pm', issuePrice: '95-102', listPrice: '115', gain: '12', status: 'closed' }, { name: 'Denver Corp', date: 'Day 2 - 2:30pm', issuePrice: '210-220', listPrice: '240', gain: '10', status: 'closed' }, { name: 'FinVest Securities', date: 'Day 1 - 1:00pm', issuePrice: '75-80', listPrice: '88', gain: '10', status: 'closed' }],
  listed: [{ name: 'TechPark Solutions', listPrice: '420', gain: '40' }, { name: 'GrowMore Finance', listPrice: '180', gain: '25' }, { name: 'SmartRetail India', listPrice: '320', gain: '18' }, { name: 'HealthFirst Ltd', listPrice: '275', gain: '15' }]
};
